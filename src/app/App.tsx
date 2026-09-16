import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { AuthModal, ProfileSettings, type User } from "./auth";
import { FRAGRANCES } from "./data";
import { Footer } from "./footer";
import giftGalleryOne from "./Images/4a.PNG";
import { CookiePolicySection, OrdersShippingSection, PrivacyPolicySection, RefundPolicySection, TermsSection } from "./legal";
import { CartDrawer, SideMenu, TopBar, type CartItem } from "./navigation";
import { BottleCarousel, CheckoutSection, CollectionPageWithBack, GiftSetPage, Hero, IntroStories, MomentSection, PowerOfYouPageWithRecommendations, PricingSection, TrackBanner } from "./sections";
import { capturePayment, createOrder, createPaymentOrder, deleteOrder, getOrdersByUser, markOrderPaid, supabase } from "./supabase";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const getPathname = () => window.location.pathname.replace(/\/+$/, "") || "/";
const GiftSetGallerySection = (props: { onAddBundle: () => void; onBack: () => void }) => getPathname() === "/collection" ? <CollectionPageWithBack onAddToCart={item => window.dispatchEvent(new CustomEvent("collection-add-to-cart", { detail: item }))} /> : getPathname() === "/power-of-you" ? <PowerOfYouPageWithRecommendations onAddToCart={() => window.dispatchEvent(new CustomEvent("power-of-you-add-to-cart"))} onBack={props.onBack} /> : <GiftSetPage {...props} onOpenPrivacy={() => window.dispatchEvent(new CustomEvent("open-policy", { detail: "privacy" }))} onOpenTerms={() => window.dispatchEvent(new CustomEvent("open-policy", { detail: "terms" }))} onOpenRefund={() => window.dispatchEvent(new CustomEvent("open-policy", { detail: "refund" }))} onOpenCookies={() => window.dispatchEvent(new CustomEvent("open-policy", { detail: "cookies" }))} onOpenOrdersShipping={() => window.dispatchEvent(new CustomEvent("open-policy", { detail: "orders" }))} />;

const GLOBAL_STYLES = `
  html { scroll-behavior: smooth; overflow-x: hidden; }
  body { overflow-x: hidden; }
  [class*="mt-12"][class*="border-t"][class*="border-black/10"][class*="pt-5"] { display: none !important; }
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
  const [giftSetOpen, setGiftSetOpen] = useState(() => ["/gift-set", "/collection", "/power-of-you"].includes(getPathname()));
  const [checkoutAfterLogin, setCheckoutAfterLogin] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentOrder, setPaymentOrder] = useState<{ id: string; tracking_id: string; status: string; total_amount: number | null; created_at: string; title: string } | null>(null);
  const [orderHistoryOpen, setOrderHistoryOpen] = useState(false);
  const [orderHistory, setOrderHistory] = useState<Array<{ id: string; tracking_id: string; status: string; total_amount: number | null; created_at: string; title: string }>>([]);
  const shopScrollY = useRef(0);
  const pendingScrollRestore = useRef<number | null>(null);

  useEffect(() => {
    const handlePolicyNavigation = (event: Event) => {
      const policy = (event as CustomEvent<string>).detail;
      if (policy === "privacy") setPrivacyOpen(true);
      if (policy === "terms") setTermsOpen(true);
      if (policy === "orders") setOrdersShippingOpen(true);
      if (policy === "refund") setRefundOpen(true);
      if (policy === "cookies") setCookiesOpen(true);
    };
      window.addEventListener("open-policy", handlePolicyNavigation);
    return () => window.removeEventListener("open-policy", handlePolicyNavigation);
  }, []);

  useEffect(() => {
    const handleCollectionAdd = (event: Event) => handleAddToCart((event as CustomEvent<{ id: number; name: string; img: string; price: number }>).detail);
    const handlePowerOfYouAdd = () => handleAddToCart({ ...FRAGRANCES[0], img: FRAGRANCES[0].img });
    window.addEventListener("collection-add-to-cart", handleCollectionAdd);
    window.addEventListener("power-of-you-add-to-cart", handlePowerOfYouAdd);
    return () => { window.removeEventListener("collection-add-to-cart", handleCollectionAdd); window.removeEventListener("power-of-you-add-to-cart", handlePowerOfYouAdd); };
  }, []);

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
    if (!giftSetOpen) return;
    const resetScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    resetScroll();
    const frame = window.requestAnimationFrame(resetScroll);
    return () => window.cancelAnimationFrame(frame);
  }, [giftSetOpen]);

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
      setGiftSetOpen(false);
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
  const handleOpenPowerOfYou = () => { setGiftSetOpen(true); window.history.pushState(null, "", "/power-of-you"); window.scrollTo(0, 0); };
  const handleOpenCart = () => setCartOpen(true);
  const handleAddToCart = (fragrance: { id: number; name: string; img: string; price: number }) => {
    const price = fragrance.id === 4 ? 1500 : fragrance.price;
    const nextCartItems = cartItems.some(item => item.id === fragrance.id)
      ? cartItems.map(item => item.id === fragrance.id ? { ...item, price, quantity: item.quantity + 1 } : item)
      : [...cartItems, { id: fragrance.id, name: fragrance.name, img: fragrance.img, price, quantity: 1 }];
    setCartItems(nextCartItems);
  };
  const handleCartQuantity = (id: number, change: number) => setCartItems(items => items.flatMap(item => item.id === id ? [{ ...item, quantity: item.quantity + change }].filter(updated => updated.quantity > 0) : [item]));
  const handleRemoveFromCart = (id: number) => setCartItems(items => items.filter(item => item.id !== id));
  const handleEmptyCart = () => setCartItems([]);
  const handleCheckout = (items = cartItems) => {
    if (items.length === 0) return;
    if (!user) {
      setCheckoutAfterLogin(true);
      return openAuth("login");
    }
    setCartOpen(false);
    setGiftSetOpen(false);
    setCheckoutOpen(true);
    window.history.pushState(null, "", "/checkout");
  };
  const handlePlaceOrder = async () => {
    if (!user || cartItems.length === 0) return;
    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    try {
      const order = await createOrder(user.id ?? "", totalAmount, user.name);
      const titles = cartItems.map(item => item.name).join(", ");
      const createdOrder = {
        ...order,
        title: titles,
      };
      setCartItems([]);
      setCartOpen(false);
      setPaymentOrder(createdOrder);
      setPaymentOpen(true);
      setCheckoutOpen(false);
      window.history.pushState(null, "", "/payment");
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Unable to create your order.");
    }
  };
  const handlePayNow = async (order = paymentOrder) => {
    if (!order || !user) return;
    const returnHome = () => {
      setPaymentOpen(false);
      setPaymentOrder(null);
      window.history.pushState(null, "", "/");
      window.scrollTo(0, 0);
    };
    const showPaymentFailure = (message = "Payment failed. Please try again.") => {
      returnHome();
      window.alert(message);
    };
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKey || razorpayKey.includes("your_")) {
      window.alert("Razorpay is not configured. Add VITE_RAZORPAY_KEY_ID in Vercel Environment Variables and redeploy the client.");
      return;
    }
    try {
      const gatewayOrder = await createPaymentOrder(Number(order.total_amount ?? 0), order.tracking_id);
      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Unable to load the Razorpay payment window."));
          document.body.appendChild(script);
        });
      }
      if (!window.Razorpay) throw new Error("Razorpay is unavailable. Please try again.");
      const razorpay = new window.Razorpay({
        key: razorpayKey,
        amount: gatewayOrder.amount,
        currency: gatewayOrder.currency,
        name: "Know Pollen",
        description: order.title,
        order_id: gatewayOrder.id,
        prefill: { name: user.name, email: user.email },
        theme: { color: "#0a0a0a" },
        handler: async (response: { razorpay_payment_id: string }) => {
          try {
            await capturePayment(response.razorpay_payment_id, Number(order.total_amount ?? 0));
            await markOrderPaid(user.id, order.id);
            setPaymentOrder(current => current?.id === order.id ? { ...current, status: "paid" } : current);
            window.alert("Payment successful. Your order is confirmed.");
            returnHome();
          } catch (error) {
            showPaymentFailure(error instanceof Error ? error.message : "Payment failed. Please try again.");
          }
        },
      });
      razorpay.on("payment.failed", (response: { error?: { description?: string } }) => {
        showPaymentFailure(response.error?.description ?? "Payment failed. Please try again.");
      });
      razorpay.open();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Unable to start payment.");
    }
  };
  useEffect(() => {
    const originalAlert = window.alert;
    window.alert = message => {
      if (message === "Payment gateway integration can be connected here using your Razorpay key.") {
        void handlePayNow();
        return;
      }
      originalAlert(message);
    };
    return () => { window.alert = originalAlert; };
  }, [paymentOrder, user]);

  const openOrderHistory = async () => {
    if (!user) { openAuth("login"); return; }
    try {
      const orders = await getOrdersByUser(user.id ?? "");
      setOrderHistory(orders.map(order => ({ ...order, title: order.total_amount ? `${order.customer_name ?? "Customer"} · Order for ${order.tracking_id}` : order.customer_name ?? "Order" })));
      setOrderHistoryOpen(true);
      setMenuOpen(false);
      window.history.pushState(null, "", "/orders");
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Unable to load your order history.");
    }
  };
  const handleDeletePendingOrder = async (orderId: string) => {
    if (!user || !window.confirm("Delete this pending order?")) return;
    try {
      await deleteOrder(user.id, orderId);
      setOrderHistory(orders => orders.filter(order => order.id !== orderId));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Unable to delete this pending order.");
    }
  };
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const legalPage = cookiesOpen ? <CookiePolicySection onBack={() => closeLegalPage(setCookiesOpen)} /> : refundOpen ? <RefundPolicySection onBack={() => closeLegalPage(setRefundOpen)} /> : ordersShippingOpen ? <OrdersShippingSection onBack={() => closeLegalPage(setOrdersShippingOpen)} /> : privacyOpen ? <PrivacyPolicySection onBack={() => closeLegalPage(setPrivacyOpen)} /> : termsOpen ? <TermsSection onBack={() => closeLegalPage(setTermsOpen)} /> : null;

  return (
    <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", background: "#fff", minHeight: "100vh", color: "#0a0a0a", overflowX: "hidden" }}>
      <style>{GLOBAL_STYLES}</style>
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} onBuyNow={handleBuyNow} onOpenGiftSet={handleOpenGiftSet} onOpenFragrance={id => { if (id === 1) handleOpenPowerOfYou(); }} user={user} onLogin={() => openAuth("login")} onProfileSettings={() => setProfileSettingsOpen(true)} onSignOut={handleSignOut} onOpenOrderHistory={openOrderHistory} />
      <TopBar menuOpen={menuOpen} onMenuToggle={() => setMenuOpen((open: boolean) => !open)} user={user} onBuyNow={handleBuyNow} cartCount={cartCount} onCartOpen={handleOpenCart} />
      <CartDrawer open={cartOpen} items={cartItems} onClose={() => setCartOpen(false)} onChangeQuantity={handleCartQuantity} onRemove={handleRemoveFromCart} onEmpty={handleEmptyCart} onCheckout={handleCheckout} />
      <AuthModal open={authOpen} mode={authMode} onClose={() => { setCheckoutAfterLogin(false); setAuthOpen(false); }} onSubmit={handleAuthSubmit} onGoogleSignIn={handleGoogleSignIn} onModeChange={setAuthMode} user={user} />
      <ProfileSettings open={profileSettingsOpen} user={user} provider={authProvider} onClose={() => setProfileSettingsOpen(false)} onPasswordChange={handlePasswordChange} />
      <main>
        {legalPage ? legalPage : giftSetOpen ? <GiftSetGallerySection onAddBundle={() => handleAddToCart({ id: 4, name: "The Legacy Set", img: giftGalleryOne, price: 1899 })} onBack={handleBackFromGiftSet} /> : paymentOpen && paymentOrder ? <section className="min-h-screen bg-white px-6 pb-24 pt-32 md:px-16"><div className="mx-auto max-w-screen-xl"><button type="button" onClick={() => { setPaymentOpen(false); setPaymentOrder(null); window.history.pushState(null, "", "/"); }} className="mb-12 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-black/55 hover:text-black"><span className="text-lg">←</span> Back to collection</button><div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]"><div className="rounded-none border border-black/10 bg-[#fafafa] p-8"><p className="text-[10px] font-bold uppercase tracking-[0.35em] text-black/45">Payment</p><h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">Complete payment</h1><p className="mt-6 max-w-md text-sm leading-relaxed text-black/60">Your order has been created. Confirm the details below and proceed with the payment to complete checkout.</p><div className="mt-8 space-y-4 text-sm"><div className="flex items-center justify-between border-b border-black/10 pb-3"><span className="text-black/50">Tracking ID</span><span className="font-semibold">{paymentOrder.tracking_id}</span></div><div className="flex items-center justify-between border-b border-black/10 pb-3"><span className="text-black/50">Order</span><span className="font-semibold text-right">{paymentOrder.title}</span></div><div className="flex items-center justify-between border-b border-black/10 pb-3"><span className="text-black/50">Amount</span><span className="font-semibold">₹{Number(paymentOrder.total_amount ?? 0).toLocaleString()}</span></div><div className="flex items-center justify-between"><span className="text-black/50">Status</span><span className="font-semibold uppercase tracking-[0.12em]">{paymentOrder.status}</span></div></div></div><div className="bg-[#f5f5f5] p-8"><p className="text-[10px] font-bold uppercase tracking-[0.35em] text-black/45">Payment details</p><div className="mt-6 space-y-6"><div className="rounded-none border border-black/10 bg-white p-4"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/45">Gateway</p><p className="mt-2 text-lg font-semibold">Razorpay</p></div><div className="rounded-none border border-black/10 bg-white p-4"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/45">Order value</p><p className="mt-2 text-lg font-semibold">₹{Number(paymentOrder.total_amount ?? 0).toLocaleString()}</p></div><button type="button" onClick={() => { window.alert("Payment gateway integration can be connected here using your Razorpay key."); }} className="mt-2 w-full bg-black px-5 py-4 text-xs font-bold uppercase tracking-[0.18em] text-white hover:bg-neutral-800">Pay now</button></div></div></div></div></section> : checkoutOpen ? <CheckoutSection items={cartItems} onBack={() => { setCheckoutOpen(false); window.history.pushState(null, "", "/"); }} onPlaceOrder={handlePlaceOrder} /> : orderHistoryOpen ? <section className="min-h-screen bg-white px-6 pb-24 pt-32 md:px-16"><div className="mx-auto max-w-screen-xl"><button type="button" onClick={() => { setOrderHistoryOpen(false); window.history.pushState(null, "", "/"); }} className="mb-12 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-black/55 hover:text-black"><span className="text-lg">←</span> Back</button><div className="mb-8"><p className="text-[10px] font-bold uppercase tracking-[0.35em] text-black/45">Account</p><h1 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">Order history</h1></div>{orderHistory.length === 0 ? <p className="text-sm text-black/55">No orders yet.</p> : <div className="space-y-5">{orderHistory.map(order => <article key={order.id} className="border border-black/10 bg-[#fafafa] p-5"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/45">{new Date(order.created_at).toLocaleDateString()}</p><h2 className="mt-2 text-lg font-bold">{order.title}</h2></div><div className="text-left md:text-right"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/45">Status</p><p className="mt-2 uppercase tracking-[0.12em]">{order.status}</p></div></div><div className="mt-5 grid gap-4 md:grid-cols-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/45">Track ID</p><p className="mt-2 text-sm font-medium">{order.tracking_id}</p></div><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/45">Order Date</p><p className="mt-2 text-sm font-medium">{new Date(order.created_at).toLocaleString()}</p></div><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/45">Payment</p><p className="mt-2 text-sm font-medium">₹{Number(order.total_amount ?? 0).toLocaleString()}</p></div></div></article>)}</div>}</div></section> : <><Hero /><IntroStories /><BottleCarousel onAddToCart={handleAddToCart} /><MomentSection /><PricingSection onAddToCart={handleAddToCart} cartItems={cartItems} onChangeQuantity={handleCartQuantity} /><TrackBanner userId={user?.id} onRequireLogin={() => openAuth("login")} /></>}
      </main>
      {orderHistoryOpen && orderHistory.some(order => order.status.toLowerCase() === "pending") && <aside className="fixed bottom-6 right-6 z-30 w-[min(360px,calc(100vw-3rem))] border border-black/10 bg-white p-5 shadow-xl"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/45">Pending payments</p><div className="mt-4 space-y-3">{orderHistory.filter(order => order.status.toLowerCase() === "pending").map(order => <div key={order.id} className="flex items-center justify-between gap-4 border-t border-black/10 pt-3"><div className="min-w-0"><p className="truncate text-sm font-semibold">{order.title}</p><p className="mt-1 text-xs text-black/50">₹{Number(order.total_amount ?? 0).toLocaleString()}</p></div><div className="flex shrink-0 gap-2"><button type="button" onClick={() => handlePayNow(order)} className="bg-black px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white hover:bg-neutral-800">Pay now</button><button type="button" onClick={() => void handleDeletePendingOrder(order.id)} className="border border-black/20 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-black hover:bg-black hover:text-white">Delete</button></div></div>)}</div></aside>}
      {!legalPage && !checkoutOpen && !giftSetOpen && !paymentOpen && !orderHistoryOpen && <Footer onOpenPrivacy={() => openLegalPage(setPrivacyOpen)} onOpenTerms={() => openLegalPage(setTermsOpen)} onOpenOrdersShipping={() => openLegalPage(setOrdersShippingOpen)} onOpenRefund={() => openLegalPage(setRefundOpen)} onOpenCookies={() => openLegalPage(setCookiesOpen)} />}
    </div>
  );
}