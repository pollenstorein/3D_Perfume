import { useEffect, useLayoutEffect, useState } from "react";

import { AuthModal, ProfileSettings, type User } from "./auth";
import { FRAGRANCES } from "./data";
import { Footer } from "./footer";
import { CookiePolicySection, PrivacyPolicySection, RefundPolicySection, TermsSection } from "./legal";
import { CartDrawer, SideMenu, TopBar, type CartItem } from "./navigation";
import { AboutSection, BundleSection, FragrancesSection, Hero, TrackBanner } from "./sections";
import { getProfile, saveProfile, supabase } from "./supabase";

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

function returnToHome() {
  window.history.replaceState(null, "", "/");
  window.scrollTo({ top: 0, behavior: "smooth" });
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
  const [authProvider, setAuthProvider] = useState("email");
  const [profileSettingsOpen, setProfileSettingsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem("know-pollen-cart");
      return savedCart ? JSON.parse(savedCart) as CartItem[] : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("know-pollen-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    let mounted = true;
    const restoreSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user && mounted) {
        setAuthProvider(session.user.app_metadata.provider ?? "email");
        const fallback = { id: session.user.id, name: session.user.user_metadata.name ?? session.user.email ?? "", email: session.user.email ?? "" };
        const profile = await getProfile(session.user.id, fallback).catch(() => fallback);
        setUser({ ...profile, name: fallback.name });
      }
    };
    restoreSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) { setUser(null); return; }
      setAuthProvider(session.user.app_metadata.provider ?? "email");
      returnToHome();
      const fallback = { id: session.user.id, name: session.user.user_metadata.name ?? session.user.email ?? "", email: session.user.email ?? "" };
      const profile = await getProfile(session.user.id, fallback).catch(() => fallback);
      if (mounted) setUser({ ...profile, name: fallback.name });
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

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
  const handleAuthSubmit = async ({ name, email, password }: { name: string; email: string; password: string }) => {
    const cleanedName = name.trim();
    const cleanedEmail = email.trim().toLowerCase();
    if (!cleanedEmail || !password || (authMode === "signup" && !cleanedName)) throw new Error("Please fill in all required fields.");
    if (!/\S+@\S+\.\S+/.test(cleanedEmail)) throw new Error("Please enter a valid email address.");
    if (authMode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email: cleanedEmail, password });
      if (error) throw new Error(error.message);
    } else {
      const { data, error } = await supabase.auth.signUp({ email: cleanedEmail, password, options: { data: { name: cleanedName } } });
      if (error) throw new Error(error.message);
      if (!data.session) throw new Error("Account created. Check your email to confirm your account before logging in.");
      if (data.user) await saveProfile({ id: data.user.id, email: cleanedEmail });
    }
    setAuthOpen(false);
    returnToHome();
  };
  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: "https://3-d-perfume.vercel.app/" } });
    if (error) throw new Error(error.message);
  };
  const handlePasswordChange = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw new Error(error.message);
  };
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    setProfileSettingsOpen(false);
    setAuthProvider("email");
  };
  const handleBuyNow = () => user ? scrollToHash("#fragrances") : openAuth("login");
  const handleAddToCart = (fragrance: { id: number; name: string; img: string }) => {
    setCartItems(items => {
      const existing = items.find(item => item.id === fragrance.id);
      if (existing) return items.map(item => item.id === fragrance.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...items, { id: fragrance.id, name: fragrance.name, img: fragrance.img, quantity: 1 }];
    });
    setCartOpen(true);
  };
  // A bundle always contains exactly one of every fragrance in the collection.
  const handleAddBundle = () => {
    setCartItems(items => FRAGRANCES.reduce((nextItems, fragrance) => {
      const existing = nextItems.find(item => item.id === fragrance.id);
      if (existing) return nextItems.map(item => item.id === fragrance.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...nextItems, { id: fragrance.id, name: fragrance.name, img: fragrance.img, quantity: 1 }];
    }, items));
    setCartOpen(true);
  };
  const handleCartQuantity = (id: number, change: number) => setCartItems(items => items.flatMap(item => item.id === id ? [{ ...item, quantity: item.quantity + change }].filter(updated => updated.quantity > 0) : [item]));
  const handleRemoveFromCart = (id: number) => setCartItems(items => items.filter(item => item.id !== id));
  const handleEmptyCart = () => setCartItems([]);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const legalPage = cookiesOpen ? <CookiePolicySection onBack={() => setCookiesOpen(false)} /> : refundOpen ? <RefundPolicySection onBack={() => setRefundOpen(false)} /> : privacyOpen ? <PrivacyPolicySection onBack={() => setPrivacyOpen(false)} /> : termsOpen ? <TermsSection onBack={() => setTermsOpen(false)} /> : null;

  return <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", background: "#fff", minHeight: "100vh", color: "#0a0a0a", overflowX: "hidden" }}><style>{GLOBAL_STYLES}</style><SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} onBuyNow={handleBuyNow} user={user} onProfileSettings={() => setProfileSettingsOpen(true)} onSignOut={handleSignOut} /><TopBar menuOpen={menuOpen} onMenuToggle={() => setMenuOpen((open: boolean) => !open)} user={user} onBuyNow={handleBuyNow} cartCount={cartCount} onCartOpen={() => setCartOpen(true)} /><CartDrawer open={cartOpen} items={cartItems} onClose={() => setCartOpen(false)} onChangeQuantity={handleCartQuantity} onRemove={handleRemoveFromCart} onEmpty={handleEmptyCart} /><AuthModal open={authOpen} mode={authMode} onClose={() => setAuthOpen(false)} onSubmit={handleAuthSubmit} onGoogleSignIn={handleGoogleSignIn} onModeChange={setAuthMode} user={user} /><ProfileSettings open={profileSettingsOpen} user={user} provider={authProvider} onClose={() => setProfileSettingsOpen(false)} onPasswordChange={handlePasswordChange} /><main>{legalPage ?? <><Hero /><FragrancesSection onAddToCart={handleAddToCart} /><BundleSection onAddBundle={handleAddBundle} /><AboutSection /><TrackBanner userId={user?.id} onRequireLogin={() => openAuth("login")} /></>}</main>{!legalPage && <Footer onOpenPrivacy={() => setPrivacyOpen(true)} onOpenTerms={() => setTermsOpen(true)} onOpenRefund={() => setRefundOpen(true)} onOpenCookies={() => setCookiesOpen(true)} />}</div>;
}
