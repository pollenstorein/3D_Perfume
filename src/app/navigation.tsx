import { ArrowRight, ChevronDown, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { FRAGRANCES, NAV_ITEMS } from "./data";

export type CartItem = { id: number; name: string; img: string; price: number; quantity: number };

export function HamburgerButton({ onClick, open }: { onClick: () => void; open: boolean }) {
  return (
    <button
      onClick={onClick}
      aria-label="Toggle menu"
      className="flex flex-col gap-[5px] cursor-pointer p-1 group"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="block bg-black transition-all duration-300"
          style={{
            width: i === 1 ? (open ? "24px" : "18px") : "24px",
            height: "1.5px",
            transformOrigin: "center",
          }}
        />
      ))}
    </button>
  );
}

export function TopBar({
  menuOpen,
  onMenuToggle,
  user,
  onBuyNow,
  onOpenHome,
  cartCount,
  onCartOpen,
}: {
  menuOpen: boolean;
  onMenuToggle: () => void;
  user: { name: string; email: string } | null;
  onBuyNow: () => void;
  onOpenHome: () => void;
  cartCount: number;
  onCartOpen: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-30 px-4 sm:px-6 md:px-10 transition-all duration-300"
        style={{
          height: scrolled ? "56px" : "72px",
          background: "rgba(255,255,255,0.68)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(0,0,0,0.14)",
        }}
      >
        <div className="mx-auto flex h-full w-full max-w-screen-xl items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <HamburgerButton onClick={onMenuToggle} open={menuOpen} />
            <button
              type="button"
              onClick={onOpenHome}
              aria-label="Go to Know Pollen homepage"
              className="text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.22em] sm:tracking-[0.28em] uppercase text-black select-none whitespace-nowrap"
            >
              Know Pollen
            </button>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onCartOpen}
              aria-label={`Open cart${cartCount ? `, ${cartCount} items` : ""}`}
              className="relative flex h-10 w-10 items-center justify-center border border-black/20 bg-white hover:bg-black hover:text-white"
            >
              <ShoppingBag size={16} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center bg-black px-1 text-[9px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={onBuyNow}
              className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase bg-black text-white px-3 sm:px-4 md:px-6 py-2.5 hover:bg-neutral-800 transition-colors duration-200"
              style={{ textDecoration: "none", border: "none", cursor: "pointer" }}
            >
              Buy Now
            </button>
          </div>
        </div>
      </header>
      <div aria-hidden="true" style={{ height: scrolled ? "56px" : "72px" }} />
    </>
  );
}

export function CartDrawer({
  open,
  items,
  onClose,
  onChangeQuantity,
  onRemove,
  onEmpty,
  onCheckout,
}: {
  open: boolean;
  items: CartItem[];
  onClose: () => void;
  onChangeQuantity: (id: number, change: number) => void;
  onRemove: (id: number) => void;
  onEmpty: () => void;
  onCheckout: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/20"
            onClick={onClose}
          />
          <motion.aside
            key="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35 }}
            className="fixed right-0 top-0 z-[80] flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-black/10 px-6 py-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-black/45">
                  Your selection
                </p>
                <h2 className="mt-2 text-xl font-bold">Cart</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close cart"
                className="flex h-9 w-9 items-center justify-center border border-black/10 hover:bg-black hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {items.length === 0 ? (
                <p className="py-12 text-center text-sm text-black/50">Your cart is empty.</p>
              ) : (
                <div className="space-y-5">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 border-b border-black/10 pb-5">
                      <img src={item.img} alt={item.name} className="h-24 w-16 object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold">{item.name}</p>
                            <p className="mt-1 text-xs text-black/50">
                              ₹{item.price.toLocaleString()}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemove(item.id)}
                            aria-label={`Remove ${item.name}`}
                            className="text-black/45 hover:text-black"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <div className="mt-5 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onChangeQuantity(item.id, -1)}
                            aria-label={`Decrease ${item.name} quantity`}
                            className="flex h-7 w-7 items-center justify-center border border-black/15"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => onChangeQuantity(item.id, 1)}
                            aria-label={`Increase ${item.name} quantity`}
                            className="flex h-7 w-7 items-center justify-center border border-black/15"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {items.length > 0 && (
              <div className="flex gap-3 border-t border-black/10 px-6 py-6">
                <button
                  type="button"
                  onClick={onEmpty}
                  className="flex-1 border border-black/20 px-4 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-black hover:bg-black hover:text-white"
                >
                  Empty cart
                </button>
                <button
                  type="button"
                  onClick={onCheckout}
                  className="flex-1 bg-black px-4 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:bg-neutral-800"
                >
                  Checkout
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function SideMenu({
  open,
  onClose,
  onBuyNow,
  onOpenGiftSet,
  onOpenHome,
  onOpenFragrance,
  user,
  onLogin,
  onProfileSettings,
  onSignOut,
  onOpenOrderHistory,
}: {
  open: boolean;
  onClose: () => void;
  onBuyNow: () => void;
  onOpenGiftSet: () => void;
  onOpenHome: () => void;
  onOpenFragrance: (id: number) => void;
  user: { name: string; email: string } | null;
  onLogin: () => void;
  onProfileSettings: () => void;
  onSignOut: () => void;
  onOpenOrderHistory: () => void;
}) {
  const [fragrancesOpen, setFragrancesOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/20"
            onClick={onClose}
          />
          <motion.aside
            key="drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.45, ease: [0.32, 0, 0.08, 1] }}
            className="fixed top-0 left-0 z-50 flex h-full w-full flex-col overflow-y-auto bg-white"
            style={{ width: "min(360px, 85vw)", borderRight: "1px solid #e0e0e0" }}
          >
            <div
              className="flex items-center justify-between px-8 pt-8 pb-6"
              style={{ borderBottom: "1px solid #e8e8e8" }}
            >
              <span className="text-xs tracking-[0.3em] font-semibold text-black uppercase">
                Menu
              </span>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-200"
              >
                <X size={16} />
              </button>
            </div>
            <nav className="flex-1 px-8 py-10 flex flex-col gap-1">
              {user && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onProfileSettings();
                  }}
                  className="group flex items-center justify-between border-b border-[#f0f0f0] py-4 text-left text-black hover:border-black"
                >
                  <span className="text-sm font-semibold uppercase tracking-[0.12em]">
                    Profile settings
                  </span>
                  <ArrowRight
                    size={13}
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </button>
              )}
              {user && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenOrderHistory();
                  }}
                  className="group flex items-center justify-between border-b border-[#f0f0f0] py-4 text-left text-black hover:border-black"
                >
                  <span className="text-sm font-semibold uppercase tracking-[0.12em]">
                    Order history
                  </span>
                  <ArrowRight
                    size={13}
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </button>
              )}
              {NAV_ITEMS.filter((item) => item.label === "GET YOUR BUNDLE").map((item) => (
                <motion.button
                  key={item.label}
                  type="button"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.35 }}
                  onClick={() => {
                    onClose();
                    onOpenGiftSet();
                  }}
                  className="group flex items-center justify-between border-b border-[#f0f0f0] py-4 text-left text-black transition-colors duration-200 hover:border-black"
                >
                  <span className="inline-block text-sm font-semibold uppercase tracking-[0.12em] transition-transform duration-200 group-hover:translate-x-1">
                    Gift Set
                  </span>
                  <ArrowRight
                    size={13}
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </motion.button>
              ))}
              {NAV_ITEMS.filter((item) => item.label === "SHOP").map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.155, duration: 0.35 }}
                  onClick={onClose}
                  className="group flex items-center justify-between border-b border-[#f0f0f0] py-4 text-black transition-colors duration-200 hover:border-black"
                  style={{ textDecoration: "none" }}
                >
                  <span className="inline-block text-sm font-semibold uppercase tracking-[0.12em] transition-transform duration-200 group-hover:translate-x-1">
                    Shop the collection
                  </span>
                  <ArrowRight
                    size={13}
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </motion.a>
              ))}
              <div className="border-b border-[#f0f0f0]">
                <button
                  type="button"
                  onClick={() => setFragrancesOpen((openState) => !openState)}
                  aria-expanded={fragrancesOpen}
                  className="group flex w-full items-center justify-between py-4 text-left text-black transition-colors duration-200 hover:border-black"
                >
                  <span className="text-sm font-semibold uppercase tracking-[0.12em] transition-transform duration-200 group-hover:translate-x-1">
                    Fragrances
                  </span>
                  <ChevronDown
                    size={15}
                    className={`transition-transform duration-200 ${fragrancesOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {fragrancesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pb-2"
                    >
                      {FRAGRANCES.map((fragrance) => (
                        <button
                          key={fragrance.id}
                          type="button"
                          onClick={() => {
                            onClose();
                            if (fragrance.id === 1 || fragrance.id === 2 || fragrance.id === 3)
                              onOpenFragrance(fragrance.id);
                            else window.location.hash = "fragrances";
                          }}
                          className="block w-full py-2 pl-3 text-left text-xs font-medium uppercase tracking-[0.12em] text-black/60 hover:text-black"
                        >
                          {fragrance.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {!user && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onLogin();
                  }}
                  className="group flex items-center justify-between border-b border-[#f0f0f0] py-4 text-left text-black hover:border-black"
                >
                  <span className="text-sm font-semibold uppercase tracking-[0.12em]">Login</span>
                  <ArrowRight
                    size={13}
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </button>
              )}
              {NAV_ITEMS.filter((item) => item.label === "KNOW POLLEN").map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.265, duration: 0.35 }}
                  onClick={(event) => {
                    event.preventDefault();
                    onOpenHome();
                  }}
                  className="group flex items-center justify-between border-b border-[#f0f0f0] py-4 text-black transition-colors duration-200 hover:border-black"
                  style={{ textDecoration: "none" }}
                >
                  <span className="inline-block text-sm font-semibold uppercase tracking-[0.12em] transition-transform duration-200 group-hover:translate-x-1">
                    Know Pollen
                  </span>
                  <ArrowRight
                    size={13}
                    className="opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  />
                </motion.a>
              ))}
            </nav>
            <div className="space-y-5 px-8 pb-[calc(2.5rem+env(safe-area-inset-bottom))]">
              {user && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSignOut();
                  }}
                  className="w-full border-t border-[#e8e8e8] pt-5 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-black/60 hover:text-black"
                >
                  Log out
                </button>
              )}
              <p className="text-[10px] tracking-[0.35em] uppercase text-neutral-400">
                Know Pollen®
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
