import { ArrowLeft, ArrowRight, Facebook, Instagram, Mail, MessageCircle, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import pollen1 from "./Images/pollen1.jpeg";
import pollen2 from "./Images/pollen2.jpeg";
import pollen3 from "./Images/pollen3.jpeg";
import pollen4 from "./Images/pollen4.jpeg";

// ─── Types ────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "SHOP", href: "#" },
  { label: "FRAGRANCES", href: "#fragrances" },
  { label: "GET YOUR BUNDLE", href: "#bundle" },
  { label: "KNOW POLLEN", href: "#about" },
  { label: "TRACK ORDER", href: "#track" },
  { label: "BUY NOW", href: "#fragrances" },
];

const FRAGRANCES = [
  {
    id: 1,
    name: "Power of You",
    tagline: "Bold. Fierce. Unapologetic.",
    description: "A commanding fragrance that asserts presence before you enter the room. Warm woods, dark musk, and a spark of citrus that lingers all day.",
    notes: ["Dark Musk", "Cedarwood", "Bergamot"],
    img: pollen2,
  },
  {
    id: 2,
    name: "Lost Cherry",
    tagline: "Sweet. Seductive. Unforgettable.",
    description: "A rich cherry accord layered over Turkish rose and bitter almond. Deeply sensual, dangerously addictive.",
    notes: ["Black Cherry", "Turkish Rose", "Bitter Almond"],
    img: pollen1,
  },
  {
    id: 3,
    name: "Fresh Orchid",
    tagline: "Light. Airy. Effortlessly refined.",
    description: "White orchid petals lifted on a breeze of green tea and white cedar. Purity distilled into a single breath.",
    notes: ["White Orchid", "Green Tea", "White Cedar"],
    img: pollen3,
  },
];

const AUTH_STORAGE_KEY = "know-pollen-user";

function TopBar({
  menuOpen,
  onMenuToggle,
  user,
  onBuyNow,
}: {
  menuOpen: boolean;
  onMenuToggle: () => void;
  user: { name: string; email: string } | null;
  onBuyNow: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const fn = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 40);
      setHidden(currentScrollY > lastScrollY && currentScrollY > 80);
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className={`absolute top-0 left-0 right-0 z-30 px-4 sm:px-6 md:px-10 transition-all duration-300 ${hidden ? "-translate-y-full" : "translate-y-0"}`}
      style={{
        height: scrolled ? "56px" : "72px",
        background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.0)",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid #e8e8e8" : "none",
      }}
    >
      <div className="mx-auto flex h-full w-full max-w-screen-xl items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <HamburgerButton onClick={onMenuToggle} open={menuOpen} />
          <span className="text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.22em] sm:tracking-[0.28em] uppercase text-black select-none whitespace-nowrap">
            Know Pollen
          </span>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <span className="hidden text-[10px] font-semibold tracking-[0.18em] uppercase text-black md:inline-block">
              {user.name.split(" ")[0]}
            </span>
          )}
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
  );
}

function AuthModal({
  open,
  mode,
  onClose,
  onSubmit,
  onModeChange,
  user,
}: {
  open: boolean;
  mode: "login" | "signup";
  onClose: () => void;
  onSubmit: (payload: { name: string; email: string; password: string }) => void;
  onModeChange: (mode: "login" | "signup") => void;
  user: { name: string; email: string } | null;
}) {
  const [form, setForm] = useState({ name: user?.name ?? "", email: user?.email ?? "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm({
        name: user?.name ?? "",
        email: user?.email ?? "",
        password: "",
      });
      setError("");
    }
  }, [open, user]);

  if (!open) return null;

  const isSignup = mode === "signup";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md rounded-[28px] border border-black/10 bg-white p-6 shadow-[0_30px_80px_rgba(0,0,0,0.18)]"
          onClick={e => e.stopPropagation()}
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] tracking-[0.35em] uppercase text-black/45">Know Pollen</p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-black">
                {isSignup ? "Create account" : "Welcome back"}
              </h3>
            </div>
            <button
              onClick={onClose}
              aria-label="Close login"
              className="flex h-9 w-9 items-center justify-center border border-black/10 text-black transition-colors hover:bg-black hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          <div className="mb-5 grid grid-cols-2 overflow-hidden rounded-xl border border-black/10 bg-[#f5f5f3] p-1">
            <button
              type="button"
              onClick={() => {
                setError("");
                onModeChange("login");
              }}
              className={`rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${
                !isSignup ? "bg-black text-white" : "text-black/65"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setError("");
                onModeChange("signup");
              }}
              className={`rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${
                isSignup ? "bg-black text-white" : "text-black/65"
              }`}
            >
              Sign up
            </button>
          </div>

          <form
            onSubmit={e => {
              e.preventDefault();
              const clean = { ...form, name: form.name.trim(), email: form.email.trim() };
              onSubmit(clean);
            }}
            className="space-y-4"
          >
            {isSignup && (
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-black/60">
                  Full name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-black/10 bg-[#faf9f7] px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black"
                  placeholder="Alex Morgan"
                />
              </div>
            )}

            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-black/60">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full border border-black/10 bg-[#faf9f7] px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black"
                placeholder="hello@knowpollen.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-black/60">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full border border-black/10 bg-[#faf9f7] px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black"
                placeholder="••••••••"
              />
            </div>

            {error && <p data-auth-error className="text-sm text-red-600">{error}</p>}
            {!error && <p data-auth-error className="sr-only" aria-live="polite" />}

            <button
              type="submit"
              className="mt-2 w-full bg-black px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-neutral-800"
            >
              {isSignup ? "Create account" : "Log in"}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function SideMenu({
  open,
  onClose,
  onBuyNow,
}: {
  open: boolean;
  onClose: () => void;
  onBuyNow: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
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
            className="fixed top-0 left-0 h-full z-50 bg-white flex flex-col"
            style={{ width: "min(360px, 85vw)", borderRight: "1px solid #e0e0e0" }}
          >
            <div className="flex items-center justify-between px-8 pt-8 pb-6" style={{ borderBottom: "1px solid #e8e8e8" }}>
              <span className="text-xs tracking-[0.3em] font-semibold text-black uppercase">Menu</span>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-200">
                <X size={16} />
              </button>
            </div>

            <nav className="flex-1 px-8 py-10 flex flex-col gap-1">
              {NAV_ITEMS.map((item, i) => {
                if (item.label === "BUY NOW") {
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        onClose();
                        onBuyNow();
                      }}
                      className="group flex items-center justify-between py-4 text-left text-black border-b border-[#f0f0f0] hover:border-black transition-colors duration-200"
                      style={{ textDecoration: "none" }}
                    >
                      <span className="text-sm font-semibold tracking-[0.12em] uppercase group-hover:translate-x-1 transition-transform duration-200 inline-block">
                        {item.label}
                      </span>
                      <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </button>
                  );
                }

                return (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.055, duration: 0.35 }}
                    onClick={onClose}
                    className="group flex items-center justify-between py-4 text-black border-b border-[#f0f0f0] hover:border-black transition-colors duration-200"
                    style={{ textDecoration: "none" }}
                  >
                    <span className="text-sm font-semibold tracking-[0.12em] uppercase group-hover:translate-x-1 transition-transform duration-200 inline-block">
                      {item.label}
                    </span>
                    <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </motion.a>
                );
              })}
            </nav>

            <div className="px-8 pb-10">
              <p className="text-[10px] tracking-[0.35em] uppercase text-neutral-400">Know Pollen®</p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Hamburger Button ─────────────────────────────────────────────────────────

function HamburgerButton({ onClick, open }: { onClick: () => void; open: boolean }) {
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

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-screen bg-white flex flex-col overflow-hidden">
      {/* Large background image — right half */}
      <div
        className="absolute top-0 right-0 w-full md:w-[58%] h-full"
        style={{ background: "#f0ece8" }}
      >
        <img
          src={pollen4}
          alt="Know Pollen signature fragrance"
          className="w-full h-full object-cover"
          style={{ mixBlendMode: "multiply", opacity: 0.92 }}
        />
      </div>

      {/* Left content */}
      <div className="relative z-10 flex-1 flex flex-col justify-end pb-20 md:pb-28 px-6 md:px-16 max-w-screen-xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="max-w-lg"
        >
          {/* Eyebrow */}
          <p className="text-[10px] tracking-[0.45em] uppercase font-semibold text-black/50 mb-6">
            ✦ New Collection — 2026
          </p>

          {/* Headline */}
          <h1
            className="text-[clamp(3.2rem,9vw,7.5rem)] leading-[0.92] font-extrabold text-black mb-8 tracking-tight"
          >
            Find<br />
            <em className="not-italic font-light italic text-black/60">the one.</em>
          </h1>

          {/* Sub */}
          <p className="text-sm md:text-base font-normal text-black/55 leading-relaxed max-w-xs mb-10">
            Discover fragrances that speak before you do. Crafted for those who leave a mark.
          </p>

          {/* CTA row */}
          <div className="flex flex-wrap gap-4 items-center">
            <a
              href="#fragrances"
              className="inline-flex items-center gap-3 bg-black text-white text-xs font-bold tracking-[0.18em] uppercase px-8 py-4 hover:bg-neutral-800 transition-colors duration-200"
              style={{ textDecoration: "none" }}
            >
              Discover <ArrowRight size={14} />
            </a>
            <a
              href="#about"
              className="text-xs font-semibold tracking-[0.18em] uppercase text-black underline underline-offset-4 hover:text-black/60 transition-colors duration-200"
              style={{ textDecoration: "underline" }}
            >
              Know Pollen
            </a>
          </div>
        </motion.div>
      </div>

      {/* Vertical "FRAGRANCES" label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="absolute bottom-8 right-8 hidden md:block"
        style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
      >
        <span className="text-[9px] tracking-[0.4em] uppercase font-semibold text-black/30">
          Fragrances · 2025
        </span>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 md:hidden"
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-px h-10 bg-black/20" />
      </motion.div>
    </section>
  );
}

// ─── Fragrances Slider ────────────────────────────────────────────────────────

function FragrancesSection() {
  const [active, setActive] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartX = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = (idx: number) => setActive((idx + FRAGRANCES.length) % FRAGRANCES.length);
  const prev = () => go(active - 1);
  const next = () => go(active + 1);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setActive(i => (i + 1) % FRAGRANCES.length), 5000);
  };

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const handlePrev = () => { prev(); resetTimer(); setDragOffset(0); };
  const handleNext = () => { next(); resetTimer(); setDragOffset(0); };
  const handleDot  = (i: number) => { go(i); resetTimer(); setDragOffset(0); };

  return (
    <section id="fragrances" className="bg-white" style={{ borderTop: "1px solid #e8e8e8" }}>
      {/* Section header */}
      <div className="px-6 md:px-16 py-8 flex items-center justify-between" style={{ borderBottom: "1px solid #e8e8e8" }}>
        <p className="text-[10px] tracking-[0.4em] uppercase font-semibold text-black/40">Fragrances</p>
        <div className="flex items-center gap-6">
          <span className="text-[10px] tracking-[0.3em] font-semibold text-black/35">
            {String(active + 1).padStart(2, "0")} / {String(FRAGRANCES.length).padStart(2, "0")}
          </span>
          <div className="flex gap-2">
            <button onClick={handlePrev} aria-label="Previous" className="w-9 h-9 border border-black/20 flex items-center justify-center hover:bg-black hover:border-black hover:text-white transition-colors duration-200 text-black">
              <ArrowLeft size={14} />
            </button>
            <button onClick={handleNext} aria-label="Next" className="w-9 h-9 border border-black/20 flex items-center justify-center hover:bg-black hover:border-black hover:text-white transition-colors duration-200 text-black">
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Track — all slides side-by-side, clip with overflow-hidden */}
      <div
        className="overflow-hidden"
        style={{ touchAction: "pan-y" }}
        onPointerDown={e => {
          dragStartX.current = e.clientX;
          setDragOffset(0);
        }}
        onPointerMove={e => {
          if (dragStartX.current === 0) return;
          const delta = e.clientX - dragStartX.current;
          setDragOffset(delta);
        }}
        onPointerUp={e => {
          const delta = dragStartX.current - e.clientX;
          setDragOffset(0);
          dragStartX.current = 0;
          if (Math.abs(delta) > 50) { delta > 0 ? handleNext() : handlePrev(); }
        }}
        onPointerLeave={() => {
          dragStartX.current = 0;
          setDragOffset(0);
        }}
        onPointerCancel={() => {
          dragStartX.current = 0;
          setDragOffset(0);
        }}
      >
        <div
          className="flex transition-transform duration-500"
          style={{
            transform: `translateX(calc(-${active * 100}% + ${dragOffset}px))`,
            willChange: "transform",
            transitionTimingFunction: "cubic-bezier(0.32,0,0.08,1)",
            transitionDuration: dragOffset === 0 ? "500ms" : "0ms",
          }}
        >
          {FRAGRANCES.map((f, i) => (
            <div key={f.id} className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-2" style={{ minHeight: "clamp(480px, 72vh, 800px)" }}>
              {/* Image */}
              <div className="relative min-h-[280px] overflow-hidden bg-[#f5f0eb] md:min-h-0">
                <img
                  src={f.img}
                  alt={f.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ transform: i === active ? "scale(1)" : "scale(1.04)", transition: "transform 0.7s ease" }}
                />
                {/* Progress dots */}
                <div className="absolute bottom-6 left-6 flex gap-2 z-10">
                  {FRAGRANCES.map((_, di) => (
                    <button
                      key={di}
                      onClick={() => handleDot(di)}
                      aria-label={`Go to ${FRAGRANCES[di].name}`}
                      className="transition-all duration-400"
                      style={{
                        width: di === active ? "28px" : "8px",
                        height: "4px",
                        background: di === active ? "#ffffff" : "rgba(255,255,255,0.5)",
                        borderRadius: "2px",
                        border: "none",
                        cursor: "pointer",
                      }}
                    />
                  ))}
                </div>
                {/* Auto-advance progress bar */}
                {i === active && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/10">
                    <div
                      key={active}
                      className="h-full bg-white"
                      style={{ animation: "slide-progress 5s linear forwards" }}
                    />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col justify-center px-6 py-10 md:px-16 md:py-16 gap-6 md:gap-8 bg-white">
                <div>
                  <p className="text-[10px] tracking-[0.4em] uppercase font-semibold text-black/35 mb-4">
                    {String(i + 1).padStart(2, "0")} / {String(FRAGRANCES.length).padStart(2, "0")}
                  </p>
                  <h2 className="text-[clamp(2.2rem,5vw,4rem)] font-extrabold tracking-tight text-black leading-tight mb-3">
                    {f.name}
                  </h2>
                  <p className="text-base font-light italic text-black/50 mb-6">{f.tagline}</p>
                  <p className="text-sm text-black/65 leading-relaxed max-w-sm">{f.description}</p>
                </div>

                <div>
                  <p className="text-[9px] tracking-[0.4em] uppercase font-semibold text-black/35 mb-3">Key Notes</p>
                  <div className="flex flex-wrap gap-2">
                    {f.notes.map(note => (
                      <span key={note} className="text-[10px] font-semibold tracking-[0.15em] uppercase px-3 py-1.5 border border-black text-black">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <a
                    href="#shop"
                    className="inline-flex items-center gap-3 bg-black text-white text-xs font-bold tracking-[0.18em] uppercase px-8 py-4 self-start hover:bg-neutral-800 transition-colors duration-200"
                    style={{ textDecoration: "none" }}
                  >
                    Shop {f.name} <ArrowRight size={14} />
                  </a>
                  <div className="flex gap-4 flex-wrap">
                    {FRAGRANCES.map((fr, fi) => (
                      <button
                        key={fr.id}
                        onClick={() => handleDot(fi)}
                        className="text-[9px] font-bold tracking-[0.2em] uppercase transition-all duration-200"
                        style={{
                          color: fi === active ? "#0a0a0a" : "#0a0a0a55",
                          borderBottom: fi === active ? "1.5px solid #0a0a0a" : "1.5px solid transparent",
                          paddingBottom: "2px",
                        }}
                      >
                        {fr.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Bundle Section ───────────────────────────────────────────────────────────

function BundleSection() {
  return (
    <section id="bundle" className="bg-black text-white px-6 md:px-16 py-24 md:py-32">
      <div className="max-w-screen-xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-[10px] tracking-[0.45em] uppercase font-semibold text-white/40 mb-6">
            Get Your Bundle
          </p>
          <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-extrabold tracking-tight leading-[0.92] mb-8">
            All three.<br />
            <em className="not-italic font-light italic text-white/50">One story.</em>
          </h2>
          <p className="text-sm font-normal text-white/55 leading-relaxed max-w-sm mb-10">
            Power of You + Lost Cherry + Fresh Orchid. The complete Know Pollen collection. Three moods, one identity. Bundle and save.
          </p>
          <a
            href="#shop"
            className="inline-flex items-center gap-3 bg-white text-black text-xs font-bold tracking-[0.18em] uppercase px-8 py-4 hover:bg-neutral-100 transition-colors duration-200"
            style={{ textDecoration: "none" }}
          >
            Get the Bundle <ArrowRight size={14} />
          </a>
        </div>

        {/* Mini fragrance stack */}
        <div className="flex gap-4 justify-center md:justify-end">
          {FRAGRANCES.map((f, i) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative overflow-hidden flex-1 max-w-[120px]"
              style={{ aspectRatio: "3/5", background: "#1a1a1a" }}
            >
              <img
                src={f.img}
                alt={f.name}
                className="w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-[8px] font-bold tracking-[0.15em] uppercase text-white leading-tight">{f.name}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Know Pollen / About ──────────────────────────────────────────────────────

function AboutSection() {
  return (
    <section id="about" className="bg-white px-6 md:px-16 py-24 md:py-32" style={{ borderTop: "1px solid #e8e8e8" }}>
      <div className="max-w-screen-xl mx-auto grid md:grid-cols-[1fr_2fr] gap-16 items-start">
        <div>
          <p className="text-[10px] tracking-[0.45em] uppercase font-semibold text-black/35 mb-6">
            Company
          </p>
          <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-tight text-black leading-tight">
            Know<br />Pollen
          </h2>
        </div>
        <div className="space-y-6">
          <p className="text-base font-light text-black/70 leading-relaxed max-w-xl">
            Know Pollen is a fragrance house rooted in the belief that scent is identity. We craft each fragrance to be worn, remembered, and claimed — not just smelled.
          </p>
          <p className="text-sm font-normal text-black/50 leading-relaxed max-w-xl">
            Every bottle tells a different story: Power of You is the one you wear to take the room. Lost Cherry is the one you wear to take someone's attention. Fresh Orchid is the one you wear to take a breath.
          </p>
          <div className="pt-4 flex flex-wrap gap-12">
            {[["3", "Fragrances"], ["100%", "Cruelty Free"], ["India", "Crafted In"]].map(([v, l]) => (
              <div key={l}>
                <p className="text-3xl font-extrabold text-black tracking-tight">{v}</p>
                <p className="text-[10px] tracking-[0.3em] uppercase font-semibold text-black/35 mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Track Order Banner ───────────────────────────────────────────────────────

function TrackBanner() {
  const [val, setVal] = useState("");
  return (
    <section id="track" className="bg-[#f5f5f5] px-6 md:px-16 py-14" style={{ borderTop: "1px solid #e8e8e8", borderBottom: "1px solid #e8e8e8" }}>
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row md:items-center gap-6 md:gap-16">
        <div className="flex-shrink-0">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-black">Track Your Order</p>
          <p className="text-sm text-black/45 mt-1">Enter your order number below</p>
        </div>
        <div className="flex-1 flex gap-0 max-w-md">
          <input
            value={val}
            onChange={e => setVal(e.target.value)}
            placeholder="Order #KP-00000"
            className="flex-1 px-5 py-3.5 text-sm bg-white border border-r-0 border-black/20 outline-none focus:border-black transition-colors"
          />
          <button className="px-6 py-3.5 bg-black text-white text-xs font-bold tracking-[0.15em] uppercase hover:bg-neutral-800 transition-colors duration-200 flex-shrink-0">
            Track
          </button>
        </div>
      </div>
    </section>
  );
}

function TermsSection({ onBack }: { onBack: () => void }) {
  return (
    <section className="min-h-screen bg-[#faf9f7] px-6 pb-24 pt-32 md:px-16 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-screen-xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-16 inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] text-black/55 transition-colors hover:text-black"
        >
          <ArrowLeft size={14} />
          Back to shop
        </button>

        <div className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-20">
          <div>
            <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.45em] text-black/35">Legal</p>
            <h1 className="text-[clamp(2.5rem,6vw,5.5rem)] font-extrabold leading-[0.95] tracking-tight text-black">
              Terms &<br />Conditions
            </h1>
            <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.25em] text-black/35">Last updated: 2 September 2026</p>
          </div>

          <div className="max-w-2xl space-y-10 border-t border-black/15 pt-8 md:pt-0 md:border-t-0">
            <p className="text-lg font-light leading-relaxed text-black/75">Welcome to POLLEN.</p>
            <p className="text-sm leading-relaxed text-black/60">By using our website or placing an order, you agree to these terms.</p>

            {[
              ["Products", "We do our best to show our products as accurately as possible.\n\nThe colour of a product may look slightly different depending on your screen or device."],
              ["Pricing", "All prices are shown in Indian Rupees (₹).\n\nThe price shown at checkout applies to your order. Any applicable shipping charges will be shown before you complete your purchase."],
              ["Orders", "Once your order is placed, you'll receive an order confirmation.\n\nAn order may be cancelled if the product becomes unavailable, there is an incorrect price or product detail on the website, or an order appears to involve fraudulent activity.\n\nIf we've already received your payment, we'll refund the amount paid for a cancelled order."],
              ["Delivery", "Orders are shipped to the address provided during checkout.\n\nDelivery time can vary depending on your location and the courier service.\n\nPlease check your address and phone number before placing your order."],
              ["Damaged or incorrect orders", "If your order arrives damaged, leaking, defective, or with the wrong product, contact us within 48 hours of delivery.\n\nPlease send your order number along with clear photos or a video of the product and packaging.\n\nWe'll review the issue and help with the appropriate resolution."],
              ["Website content", "All POLLEN photographs, designs, text, product names, logos and other website content belong to POLLEN or are used with permission.\n\nPlease contact us before using any of our content elsewhere."],
            ].map(([heading, copy]) => (
              <div key={heading} className="border-t border-black/10 pt-6">
                <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-black">{heading}</h2>
                <p className="whitespace-pre-line text-sm leading-8 text-black/60">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PrivacyPolicySection({ onBack }: { onBack: () => void }) {
  return (
    <section className="min-h-screen bg-[#faf9f7] px-6 pb-24 pt-32 md:px-16 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-screen-xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-16 inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] text-black/55 transition-colors hover:text-black"
        >
          <ArrowLeft size={14} />
          Back to shop
        </button>

        <div className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-20">
          <div>
            <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.45em] text-black/35">Legal</p>
            <h1 className="text-[clamp(2.5rem,6vw,5.5rem)] font-extrabold leading-[0.95] tracking-tight text-black">
              Privacy<br />Policy
            </h1>
            <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.25em] text-black/35">Last updated: 3 September 2026</p>
          </div>

          <div className="max-w-2xl space-y-10 border-t border-black/15 pt-8 md:pt-0 md:border-t-0">
            <p className="text-lg font-light leading-relaxed text-black/75">When you shop with POLLEN, we collect the information needed to process your order and get it to you.</p>
            <p className="text-sm leading-relaxed text-black/60">This may include your name, phone number, email address, billing address, delivery address and order details.</p>

            {[
              ["How we use your information", "1. Process and deliver your orders\n2. Send order and delivery updates\n3. Respond to your questions\n4. Process payments\n5. Improve our website and products\n6. Prevent fraud and misuse\n7. Send marketing messages when you've chosen to receive them"],
              ["Sharing your information", "Some information needs to be shared with the people and services that help us run POLLEN.\n\nThis may include payment providers, courier partners, website providers and customer support services.\n\nWe only share information needed for these services."],
              ["Your information", "We take reasonable steps to keep your information safe.\n\nIf you have a question about your personal information or want to make a request about it, contact us at contactpollen@gmail.com."],
            ].map(([heading, copy]) => (
              <div key={heading} className="border-t border-black/10 pt-6">
                <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-black">{heading}</h2>
                <p className="whitespace-pre-line text-sm leading-8 text-black/60">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RefundPolicySection({ onBack }: { onBack: () => void }) {
  return (
    <section className="min-h-screen bg-[#faf9f7] px-6 pb-24 pt-32 md:px-16 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-screen-xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-16 inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] text-black/55 transition-colors hover:text-black"
        >
          <ArrowLeft size={14} />
          Back to shop
        </button>

        <div className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-20">
          <div>
            <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.45em] text-black/35">Legal</p>
            <h1 className="text-[clamp(2.5rem,6vw,5.5rem)] font-extrabold leading-[0.95] tracking-tight text-black">
              Refund &<br />Exchange<br />Policy
            </h1>
            <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.25em] text-black/35">Last updated: 3 September 2026</p>
          </div>

          <div className="max-w-2xl space-y-10 border-t border-black/15 pt-8 md:pt-0 md:border-t-0">
            <div>
              <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-black">Refund</h2>
              <p className="whitespace-pre-line text-sm leading-8 text-black/60">We do not offer refunds; however, if the issue is genuine, a gift code of the same value will be provided to the customer.</p>
            </div>
            {[
              ["What we Cover", "We offer replacements or gift codes for orders that arrive damaged, defective, or incorrect. This includes leakage, breakage, or a wrong item being delivered.\n\nAs a fragrance brand our products cannot be returned or resold once opened, items cannot be returned once delivered."],
              ["How to Raise a Claim", "We cover damaged, defective, or incorrect items. Report within 48 hours of delivery.\n\nWhat you need:\n\n1. Your order number\n2. An unboxing video showing the sealed package, opening and the issue\n3. Photos of the damaged packaging box with shipping label affixed and photos of damaged or wrong item."],
              ["Contact us", "On WhatsApp: +9196-9180954\n\nEmail: contactpollen@gmail.com"],
            ].map(([heading, copy]) => (
              <div key={heading} className="border-t border-black/10 pt-6">
                <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-black">{heading}</h2>
                <p className="whitespace-pre-line text-sm leading-8 text-black/60">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CookiePolicySection({ onBack }: { onBack: () => void }) {
  return (
    <section className="min-h-screen bg-[#faf9f7] px-6 pb-24 pt-32 md:px-16 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-screen-xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-16 inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] text-black/55 transition-colors hover:text-black"
        >
          <ArrowLeft size={14} />
          Back to shop
        </button>

        <div className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-20">
          <div>
            <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.45em] text-black/35">Legal</p>
            <h1 className="text-[clamp(2.5rem,6vw,5.5rem)] font-extrabold leading-[0.95] tracking-tight text-black">
              Cookie<br />Policy
            </h1>
            <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.25em] text-black/35">Last updated: 3 September 2026</p>
          </div>

          <div className="max-w-2xl space-y-10 border-t border-black/15 pt-8 md:pt-0 md:border-t-0">
            <p className="text-lg font-light leading-relaxed text-black/75">POLLEN uses cookies to keep the website working properly and understand how people use it.</p>
            <p className="text-sm leading-relaxed text-black/60">Some cookies help with things like your cart, checkout and website security.</p>
            <p className="text-sm leading-relaxed text-black/60">Others help us understand which parts of the website people use, so we can make the experience better.</p>
            <p className="text-sm leading-relaxed text-black/60">We may also use cookies to understand how our advertising performs.</p>

            <div className="border-t border-black/10 pt-6">
              <p className="text-sm leading-8 text-black/60">You can manage or turn off cookies through your browser settings.</p>
              <p className="mt-6 text-sm leading-8 text-black/60">Some parts of the website may not work properly when certain cookies are turned off.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer({ onOpenPrivacy, onOpenTerms, onOpenRefund, onOpenCookies }: { onOpenPrivacy: () => void; onOpenTerms: () => void; onOpenRefund: () => void; onOpenCookies: () => void }) {
  return (
    <footer className="bg-white" style={{ borderTop: "1px solid #e8e8e8" }}>
      <div className="max-w-screen-xl mx-auto px-6 md:px-16 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1.5fr_1.5fr] gap-10 md:gap-12 mb-16">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-base font-extrabold tracking-[0.3em] uppercase text-black mb-4">Know Pollen</p>
            <p className="text-xs text-black/45 leading-relaxed max-w-[200px] mb-6">
              Fragrances for those who know who they are — and are unafraid to say it.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 border border-black/15 flex items-center justify-center hover:bg-black hover:border-black hover:text-white transition-colors duration-200 text-black/50" aria-label="Instagram">
                <Instagram size={14} />
              </a>
              <a href="#" className="w-9 h-9 border border-black/15 flex items-center justify-center hover:bg-black hover:border-black hover:text-white transition-colors duration-200 text-black/50" aria-label="Facebook">
                <Facebook size={14} />
              </a>
            </div>
          </div>

          {/* Fragrances */}
          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase font-bold text-black/35 mb-5">Fragrances</p>
            <div className="space-y-3">
              {["Power of You", "Lost Cherry", "Fresh Orchid"].map(f => (
                <a key={f} href="#fragrances" className="block text-xs font-medium text-black/60 hover:text-black transition-colors duration-200" style={{ textDecoration: "none" }}>
                  {f}
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase font-bold text-black/35 mb-5">Company</p>
            <div className="space-y-3">
              <a href="#about" className="block text-xs font-medium text-black/60 hover:text-black transition-colors duration-200" style={{ textDecoration: "none" }}>
                Know Pollen
              </a>
            </div>

            <p className="text-[9px] tracking-[0.4em] uppercase font-bold text-black/35 mt-8 mb-5">Policy</p>
            <div className="space-y-3">
              { ["Privacy Policy", "Terms & Conditions", "Orders & Shipping", "Cookie Policy", "Refund Policy"].map(p => (
                p === "Privacy Policy" ? (
                  <button key={p} type="button" onClick={onOpenPrivacy} className="block text-left text-xs font-medium text-black/60 transition-colors duration-200 hover:text-black">
                    {p}
                  </button>
                ) : p === "Terms & Conditions" ? (
                  <button key={p} type="button" onClick={onOpenTerms} className="block text-left text-xs font-medium text-black/60 transition-colors duration-200 hover:text-black">
                    {p}
                  </button>
                ) : p === "Refund Policy" ? (
                  <button key={p} type="button" onClick={onOpenRefund} className="block text-left text-xs font-medium text-black/60 transition-colors duration-200 hover:text-black">
                    {p}
                  </button>
                ) : p === "Cookie Policy" ? (
                  <button key={p} type="button" onClick={onOpenCookies} className="block text-left text-xs font-medium text-black/60 transition-colors duration-200 hover:text-black">
                    {p}
                  </button>
                ) : (
                  <a key={p} href="#" className="block text-xs font-medium text-black/60 hover:text-black transition-colors duration-200" style={{ textDecoration: "none" }}>
                    {p}
                  </a>
                )
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase font-bold text-black/35 mb-5">Contact Us</p>
            <div className="space-y-4">
              <a href="mailto:hello@knowpollen.com" className="flex items-start gap-3 group" style={{ textDecoration: "none" }}>
                <Mail size={13} className="text-black/35 mt-0.5 flex-shrink-0 group-hover:text-black transition-colors" />
                <span className="text-xs font-medium text-black/60 group-hover:text-black transition-colors">
                  hello@knowpollen.com
                </span>
              </a>
              <a href="https://wa.me/919609180954" target="_blank" rel="noreferrer" className="flex items-start gap-3 group" style={{ textDecoration: "none" }}>
                <MessageCircle size={13} className="text-black/35 mt-0.5 flex-shrink-0 group-hover:text-black transition-colors" />
                <span className="text-xs font-medium text-black/60 group-hover:text-black transition-colors whitespace-nowrap sm:whitespace-normal">
                  +91 96091 80954
                </span>
              </a>
              <div className="flex gap-3 pt-1">
                <a href="https://www.facebook.com/share/1Cv5i38gqB/" className="text-xs font-semibold text-black/60 hover:text-black transition-colors underline underline-offset-2" style={{ textDecoration: "underline" }}>
                  Facebook
                </a>
                <span className="text-black/20">|</span>
                <a href="https://www.instagram.com/_pollen.co?igsi=dzBrOTkybXl2NHoy" className="text-xs font-semibold text-black/60 hover:text-black transition-colors underline underline-offset-2" style={{ textDecoration: "underline" }}>
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4" style={{ borderTop: "1px solid #e8e8e8" }}>
          <p className="text-[10px] text-black/30 tracking-wide">
            © 2026 Pollen. All rights reserved.
          </p>
          <p className="text-[10px] text-black/25 tracking-[0.2em] uppercase">
            Crafted in India
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Global styles ────────────────────────────────────────────────────────────

const GLOBAL_STYLES = `
  html { scroll-behavior: smooth; overflow-x: hidden; }
  body { overflow-x: hidden; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #fff; }
  ::-webkit-scrollbar-thumb { background: #d0d0d0; border-radius: 2px; }
  ::selection { background: rgba(0,0,0,0.12); }
  @keyframes slide-progress {
    from { width: 0%; }
    to   { width: 100%; }
  }
`;

function scrollToHash(hash: string) {
  const target = hash === "#" ? null : document.querySelector(hash);

  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  window.history.pushState(null, "", hash);
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  const [cookiesOpen, setCookiesOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [user, setUser] = useState<{ name: string; email: string; password?: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser) as { name: string; email: string; password?: string };
        setUser(parsed);
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  useEffect(() => {
    const handleInternalNavigation = (event: MouseEvent) => {
      const anchor = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;

      const hash = anchor.getAttribute("href");
      if (!hash) return;

      event.preventDefault();
      scrollToHash(hash);
    };

    document.addEventListener("click", handleInternalNavigation);
    return () => document.removeEventListener("click", handleInternalNavigation);
  }, []);

  const openAuth = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const handleAuthSubmit = ({ name, email, password }: { name: string; email: string; password: string }) => {
    const cleanedName = name.trim();
    const cleanedEmail = email.trim().toLowerCase();

    if (!cleanedEmail || !password || (authMode === "signup" && !cleanedName)) {
      const modal = document.querySelector('[data-auth-error]') as HTMLElement | null;
      if (modal) {
        modal.textContent = "Please fill in all required fields.";
      }
      return;
    }

    if (!/\S+@\S+\.\S+/.test(cleanedEmail)) {
      const modal = document.querySelector('[data-auth-error]') as HTMLElement | null;
      if (modal) {
        modal.textContent = "Please enter a valid email address.";
      }
      return;
    }

    if (authMode === "login") {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!storedUser) {
        const modal = document.querySelector('[data-auth-error]') as HTMLElement | null;
        if (modal) {
          modal.textContent = "No account found for this email. Please sign up first.";
        }
        return;
      }

      try {
        const parsed = JSON.parse(storedUser) as { name: string; email: string; password?: string };
        if (parsed.email !== cleanedEmail || parsed.password !== password) {
          const modal = document.querySelector('[data-auth-error]') as HTMLElement | null;
          if (modal) {
            modal.textContent = "Incorrect email or password.";
          }
          return;
        }

        setUser({ name: parsed.name, email: parsed.email, password: parsed.password });
      } catch {
        const modal = document.querySelector('[data-auth-error]') as HTMLElement | null;
        if (modal) {
          modal.textContent = "Unable to load your account. Please try again.";
        }
        return;
      }
    } else {
      setUser({ name: cleanedName, email: cleanedEmail, password });
    }

    setAuthOpen(false);
  };

  const handleBuyNow = () => {
    if (!user) {
      openAuth("login");
      return;
    }

    scrollToHash("#fragrances");
  };

  return (
    <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", background: "#fff", minHeight: "100vh", color: "#0a0a0a", overflowX: "hidden" }}>
      <style>{GLOBAL_STYLES}</style>

      <SideMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onBuyNow={handleBuyNow}
      />
      <TopBar
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen(o => !o)}
        user={user}
        onBuyNow={handleBuyNow}
      />

      <AuthModal
        open={authOpen}
        mode={authMode}
        onClose={() => setAuthOpen(false)}
        onSubmit={payload => handleAuthSubmit(payload)}
        onModeChange={setAuthMode}
        user={user}
      />

      <main>
        {cookiesOpen ? (
          <CookiePolicySection onBack={() => setCookiesOpen(false)} />
        ) : refundOpen ? (
          <RefundPolicySection onBack={() => setRefundOpen(false)} />
        ) : privacyOpen ? (
          <PrivacyPolicySection onBack={() => setPrivacyOpen(false)} />
        ) : termsOpen ? (
          <TermsSection onBack={() => setTermsOpen(false)} />
        ) : (
          <>
            <Hero />
            <FragrancesSection />
            <BundleSection />
            <AboutSection />
            <TrackBanner />
          </>
        )}
      </main>

      {!privacyOpen && !termsOpen && !refundOpen && !cookiesOpen && (
        <Footer
          onOpenPrivacy={() => setPrivacyOpen(true)}
          onOpenTerms={() => setTermsOpen(true)}
          onOpenRefund={() => setRefundOpen(true)}
          onOpenCookies={() => setCookiesOpen(true)}
        />
      )}
    </div>
  );
}
