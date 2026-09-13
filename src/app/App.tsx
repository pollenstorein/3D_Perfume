import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { AuthModal, ProfileSettings, type User } from "./auth";
import { FRAGRANCES } from "./data";
import { Footer } from "./footer";
import giftGalleryOne from "./Images/4a.PNG";
import { CookiePolicySection, OrdersShippingSection, PrivacyPolicySection, RefundPolicySection, TermsSection } from "./legal";
import { CartDrawer, SideMenu, TopBar, type CartItem } from "./navigation";
import { BottleCarousel, CheckoutSection, GiftSetGallerySection, Hero, IntroStories, MomentSection, PricingSection, TrackBanner } from "./sections";
import { createOrder, supabase } from "./supabase";

const GLOBAL_STYLES = `
  html { scroll-behavior: smooth; overflow-x: hidden; }
  body { overflow-x: hidden; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #fff; }
  ::-webkit-scrollbar-thumb { background: #d0d0d0; border-radius: 2px; }
  ::selection { background: rgba(0,0,0,0.12); }
  #fragrances > div:nth-child(2) article > div:first-child { background: #fff; }
  #fragrances > div:nth-child(2) article > div:first-child img { object-fit: contain; mix-blend-mode: multiply; }
  .bottle-stage-panel { background-position: center bottom; background-size: auto 125%; }
  @media (min-width: 768px) {
    .bottle-stage-panel { background-position: center bottom; background-size: auto 100%; }
    .hidden.grid-cols-4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .hidden.grid-cols-4 > div:first-child { grid-column: span 2; }
  }
  @media (min-width: 1024px) {
    [class*="max-w-[1440px]"] { align-items: start; }
    [class*="max-w-[1440px]"] > div:last-child { position: sticky; top: 0; align-self: start; height: fit-content; }
  }
  @media (max-width: 767px) {
    button[aria-label="Previous gift set image"], button[aria-label="Next gift set image"] { display: none; }
  }
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
  const [ordersShippingOpen, setOrdersShippingOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  const [cookiesOpen, setCookiesOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [user, setUser] = useState<User | null>(null);
  const [authProvider, setAuthProvider] = useState("email");
  const [profileSettingsOpen, setProfileSettingsOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(() => window.location.pathname === "/checkout");
  const [giftSetOpen, setGiftSetOpen] = useState(() => window.location.pathname === "/gift-set");
  const [checkoutAfterLogin, setCheckoutAfterLogin] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const shopScrollY = useRef(0);
  const pendingScrollRestore = useRef<number | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem("know-pollen-cart");
      const parsedCart = savedCart ? JSON.parse(savedCart) as CartItem[] : [];
      return parsedCart.map(item => ({ ...item, price: item.price ?? FRAGRANCES.find(fragrance => fragrance.id === item.id)?.price ?? 0 }));
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
        setUser({ id: session.user.id, name: session.user.user_metadata.name ?? session.user.email ?? "", email: session.user.email ?? "" });
      }
    };
    restoreSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) { setUser(null); return; }
      setAuthProvider(session.user.app_metadata.provider ?? "email");
      returnToHome();
      if (mounted) setUser({ id: session.user.id, name: session.user.user_metadata.name ?? session.user.email ?? "", email: session.user.email ?? "" });
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
    const legalPageOpen = privacyOpen || termsOpen || ordersShippingOpen || refundOpen || cookiesOpen;
    if (!legalPageOpen) {
      if (pendingScrollRestore.current === null) return;
      const scrollY = pendingScrollRestore.current;
      pendingScrollRestore.current = null;
      document.documentElement.scrollTop = scrollY;
      document.body.scrollTop = scrollY;
      window.scrollTo({ top: scrollY, behavior: "auto" });
      return;
    }
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
    const resetAfterRender = window.requestAnimationFrame(() => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo(0, 0);
    });
    return () => window.cancelAnimationFrame(resetAfterRender);
  }, [privacyOpen, termsOpen, ordersShippingOpen, refundOpen, cookiesOpen]);

  const openAuth = (mode: "login" | "signup") => { setAuthMode(mode); setAuthOpen(true); };
  const openLegalPage = (setPageOpen: (open: boolean) => void) => {
    shopScrollY.current = window.scrollY;
    setPageOpen(true);
  };
  const closeLegalPage = (setPageOpen: (open: boolean) => void) => {
    pendingScrollRestore.current = shopScrollY.current;
    setPageOpen(false);
  };
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
    }
    setAuthOpen(false);
    if (checkoutAfterLogin) {
      setCheckoutAfterLogin(false);
      setCartOpen(false);
      setCheckoutOpen(true);
      window.history.pushState(null, "", "/checkout");
    } else returnToHome();
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
  const handleBuyNow = () => scrollToHash("#fragrances");
  const handleOpenGiftSet = () => { setGiftSetOpen(true); window.history.pushState(null, "", "/gift-set"); window.scrollTo(0, 0); };
  const handleBackFromGiftSet = () => { setGiftSetOpen(false); window.history.pushState(null, "", "/"); window.scrollTo(0, 0); };
  const handleOpenCart = () => setCartOpen(true);
  const handleAddToCart = (fragrance: { id: number; name: string; img: string; price: number }) => {
    setCartItems(items => {
      const existing = items.find(item => item.id === fragrance.id);
      if (existing) return items.map(item => item.id === fragrance.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...items, { id: fragrance.id, name: fragrance.name, img: fragrance.img, price: fragrance.price, quantity: 1 }];
    });
  };
  const handleCartQuantity = (id: number, change: number) => setCartItems(items => items.flatMap(item => item.id === id ? [{ ...item, quantity: item.quantity + change }].filter(updated => updated.quantity > 0) : [item]));
  const handleRemoveFromCart = (id: number) => setCartItems(items => items.filter(item => item.id !== id));
  const handleEmptyCart = () => setCartItems([]);
  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    if (!user) {
      setCheckoutAfterLogin(true);
      return openAuth("login");
    }
    setCartOpen(false);
    setCheckoutOpen(true);
    window.history.pushState(null, "", "/checkout");
  };
  const handlePlaceOrder = async () => {
    if (!user || cartItems.length === 0) return;
    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    try {
      const order = await createOrder(user.id ?? "", totalAmount);
      setCartItems([]);
      setCartOpen(false);
      window.alert(`Order created. Tracking ID: ${order.tracking_id}`);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Unable to create your order.");
    }
  };
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const legalPage = cookiesOpen ? <CookiePolicySection onBack={() => closeLegalPage(setCookiesOpen)} /> : refundOpen ? <RefundPolicySection onBack={() => closeLegalPage(setRefundOpen)} /> : ordersShippingOpen ? <OrdersShippingSection onBack={() => closeLegalPage(setOrdersShippingOpen)} /> : privacyOpen ? <PrivacyPolicySection onBack={() => closeLegalPage(setPrivacyOpen)} /> : termsOpen ? <TermsSection onBack={() => closeLegalPage(setTermsOpen)} /> : null;

  return <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", background: "#fff", minHeight: "100vh", color: "#0a0a0a", overflowX: "hidden" }}><style>{GLOBAL_STYLES}</style><SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} onBuyNow={handleBuyNow} onOpenGiftSet={handleOpenGiftSet} user={user} onLogin={() => openAuth("login")} onProfileSettings={() => setProfileSettingsOpen(true)} onSignOut={handleSignOut} /><TopBar menuOpen={menuOpen} onMenuToggle={() => setMenuOpen((open: boolean) => !open)} user={user} onBuyNow={handleBuyNow} cartCount={cartCount} onCartOpen={handleOpenCart} /><CartDrawer open={cartOpen} items={cartItems} onClose={() => setCartOpen(false)} onChangeQuantity={handleCartQuantity} onRemove={handleRemoveFromCart} onEmpty={handleEmptyCart} onCheckout={handleCheckout} /><AuthModal open={authOpen} mode={authMode} onClose={() => { setCheckoutAfterLogin(false); setAuthOpen(false); }} onSubmit={handleAuthSubmit} onGoogleSignIn={handleGoogleSignIn} onModeChange={setAuthMode} user={user} /><ProfileSettings open={profileSettingsOpen} user={user} provider={authProvider} onClose={() => setProfileSettingsOpen(false)} onPasswordChange={handlePasswordChange} /><main>{legalPage ? legalPage : giftSetOpen ? <GiftSetGallerySection onAddBundle={() => handleAddToCart({ id: 4, name: "The Legacy Set", img: giftGalleryOne, price: 1899 })} onBack={handleBackFromGiftSet} /> : checkoutOpen ? <CheckoutSection items={cartItems} onBack={() => { setCheckoutOpen(false); window.history.pushState(null, "", "/"); }} onPlaceOrder={handlePlaceOrder} /> : <><Hero /><IntroStories /><BottleCarousel onAddToCart={handleAddToCart} /><MomentSection /><PricingSection onAddToCart={handleAddToCart} cartItems={cartItems} onChangeQuantity={handleCartQuantity} /><TrackBanner userId={user?.id} onRequireLogin={() => openAuth("login")} /></>}</main>{!legalPage && !checkoutOpen && !giftSetOpen && <Footer onOpenPrivacy={() => openLegalPage(setPrivacyOpen)} onOpenTerms={() => openLegalPage(setTermsOpen)} onOpenOrdersShipping={() => openLegalPage(setOrdersShippingOpen)} onOpenRefund={() => openLegalPage(setRefundOpen)} onOpenCookies={() => openLegalPage(setCookiesOpen)} />}</div>;
}
