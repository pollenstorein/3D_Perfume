import { useEffect, useLayoutEffect, useState } from "react";

import { AuthModal, type User } from "./auth";
import { AUTH_STORAGE_KEY } from "./data";
import { Footer } from "./footer";
import { CookiePolicySection, PrivacyPolicySection, RefundPolicySection, TermsSection } from "./legal";
import { SideMenu, TopBar } from "./navigation";
import { AboutSection, BundleSection, FragrancesSection, Hero, TrackBanner } from "./sections";

const GLOBAL_STYLES = `
  html { scroll-behavior: smooth; overflow-x: hidden; }
  body { overflow-x: hidden; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #fff; }
  ::-webkit-scrollbar-thumb { background: #d0d0d0; border-radius: 2px; }
  ::selection { background: rgba(0,0,0,0.12); }
  @keyframes slide-progress { from { width: 0%; } to { width: 100%; } }
`;

function scrollToHash(hash: string) {
  const target = hash === "#" ? null : document.querySelector(hash);
  if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  else window.scrollTo({ top: 0, behavior: "smooth" });
  window.history.pushState(null, "", hash);
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  const [cookiesOpen, setCookiesOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedUser) {
      try { setUser(JSON.parse(storedUser) as User); } catch { localStorage.removeItem(AUTH_STORAGE_KEY); }
    }
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(AUTH_STORAGE_KEY);
  }, [user]);

  useEffect(() => {
    const handleInternalNavigation = (event: MouseEvent) => {
      const anchor = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      const hash = anchor?.getAttribute("href");
      if (!anchor || !hash) return;
      event.preventDefault();
      scrollToHash(hash);
    };
    document.addEventListener("click", handleInternalNavigation);
    return () => document.removeEventListener("click", handleInternalNavigation);
  }, []);

  useLayoutEffect(() => {
    if (!(privacyOpen || termsOpen || refundOpen || cookiesOpen)) return;
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
    const resetAfterRender = window.requestAnimationFrame(() => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo(0, 0);
    });
    return () => window.cancelAnimationFrame(resetAfterRender);
  }, [privacyOpen, termsOpen, refundOpen, cookiesOpen]);

  const openAuth = (mode: "login" | "signup") => { setAuthMode(mode); setAuthOpen(true); };
  const handleAuthSubmit = ({ name, email, password }: { name: string; email: string; password: string }) => {
    const cleanedName = name.trim();
    const cleanedEmail = email.trim().toLowerCase();
    const showError = (message: string) => { const modal = document.querySelector("[data-auth-error]") as HTMLElement | null; if (modal) modal.textContent = message; };
    if (!cleanedEmail || !password || (authMode === "signup" && !cleanedName)) return showError("Please fill in all required fields.");
    if (!/\S+@\S+\.\S+/.test(cleanedEmail)) return showError("Please enter a valid email address.");
    if (authMode === "login") {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!storedUser) return showError("No account found for this email. Please sign up first.");
      try {
        const parsed = JSON.parse(storedUser) as User;
        if (parsed.email !== cleanedEmail || parsed.password !== password) return showError("Incorrect email or password.");
        setUser(parsed);
      } catch { return showError("Unable to load your account. Please try again."); }
    } else setUser({ name: cleanedName, email: cleanedEmail, password });
    setAuthOpen(false);
  };
  const handleBuyNow = () => user ? scrollToHash("#fragrances") : openAuth("login");

  const legalPage = cookiesOpen ? <CookiePolicySection onBack={() => setCookiesOpen(false)} /> : refundOpen ? <RefundPolicySection onBack={() => setRefundOpen(false)} /> : privacyOpen ? <PrivacyPolicySection onBack={() => setPrivacyOpen(false)} /> : termsOpen ? <TermsSection onBack={() => setTermsOpen(false)} /> : null;

  return <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", background: "#fff", minHeight: "100vh", color: "#0a0a0a", overflowX: "hidden" }}><style>{GLOBAL_STYLES}</style><SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} onBuyNow={handleBuyNow} /><TopBar menuOpen={menuOpen} onMenuToggle={() => setMenuOpen(open => !open)} user={user} onBuyNow={handleBuyNow} /><AuthModal open={authOpen} mode={authMode} onClose={() => setAuthOpen(false)} onSubmit={handleAuthSubmit} onModeChange={setAuthMode} user={user} /><main>{legalPage ?? <><Hero /><FragrancesSection /><BundleSection /><AboutSection /><TrackBanner /></>}</main>{!legalPage && <Footer onOpenPrivacy={() => setPrivacyOpen(true)} onOpenTerms={() => setTermsOpen(true)} onOpenRefund={() => setRefundOpen(true)} onOpenCookies={() => setCookiesOpen(true)} />}</div>;
}
