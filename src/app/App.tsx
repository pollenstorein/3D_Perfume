import { ArrowLeft, ArrowRight, Facebook, Instagram, Mail, MessageCircle, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "SHOP", href: "#" },
  { label: "FRAGRANCES", href: "#fragrances" },
  { label: "GET YOUR BUNDLE", href: "#bundle" },
  { label: "KNOW POLLEN", href: "#about" },
  { label: "TRACK ORDER", href: "#track" },
  { label: "LOG IN", href: "#login" },
];

const FRAGRANCES = [
  {
    id: 1,
    name: "Power of You",
    tagline: "Bold. Fierce. Unapologetic.",
    description: "A commanding fragrance that asserts presence before you enter the room. Warm woods, dark musk, and a spark of citrus that lingers all day.",
    notes: ["Dark Musk", "Cedarwood", "Bergamot"],
    img: "/src/app/Images/pollen1.jpeg",
  },
  {
    id: 2,
    name: "Lost Cherry",
    tagline: "Sweet. Seductive. Unforgettable.",
    description: "A rich cherry accord layered over Turkish rose and bitter almond. Deeply sensual, dangerously addictive.",
    notes: ["Black Cherry", "Turkish Rose", "Bitter Almond"],
    img: "/src/app/Images/pollen2.jpeg",
  },
  {
    id: 3,
    name: "Fresh Orchid",
    tagline: "Light. Airy. Effortlessly refined.",
    description: "White orchid petals lifted on a breeze of green tea and white cedar. Purity distilled into a single breath.",
    notes: ["White Orchid", "Green Tea", "White Cedar"],
    img: "/src/app/Images/pollen3.jpeg",
  },
];

const AUTH_STORAGE_KEY = "know-pollen-user";

function TopBar({
  menuOpen,
  onMenuToggle,
  user,
  onOpenAuth,
  onLogout,
}: {
  menuOpen: boolean;
  onMenuToggle: () => void;
  user: { name: string; email: string } | null;
  onOpenAuth: (mode: "login" | "signup") => void;
  onLogout: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-30 px-4 sm:px-6 md:px-10 transition-all duration-300"
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

        {user ? (
          <div className="flex items-center gap-3">
            <span className="hidden text-[10px] font-semibold tracking-[0.18em] uppercase text-black md:inline-block">
              {user.name.split(" ")[0]}
            </span>
            <button
              onClick={onLogout}
              className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase bg-black text-white px-3 sm:px-4 md:px-6 py-2.5 hover:bg-neutral-800 transition-colors duration-200"
              style={{ textDecoration: "none", border: "none", cursor: "pointer" }}
            >
              Log out
            </button>
          </div>
        ) : (
          <button
            onClick={() => onOpenAuth("login")}
            className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase bg-black text-white px-3 sm:px-4 md:px-6 py-2.5 hover:bg-neutral-800 transition-colors duration-200"
            style={{ textDecoration: "none", border: "none", cursor: "pointer" }}
          >
            Log In
          </button>
        )}
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
  user,
  onOpenAuth,
  onLogout,
}: {
  open: boolean;
  onClose: () => void;
  user: { name: string; email: string } | null;
  onOpenAuth: (mode: "login" | "signup") => void;
  onLogout: () => void;
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
                if (item.label === "LOG IN") {
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        onClose();
                        if (user) {
                          onLogout();
                          return;
                        }
                        onOpenAuth("login");
                      }}
                      className="group flex items-center justify-between py-4 text-left text-black border-b border-[#f0f0f0] hover:border-black transition-colors duration-200"
                      style={{ textDecoration: "none" }}
                    >
                      <span className="text-sm font-semibold tracking-[0.12em] uppercase group-hover:translate-x-1 transition-transform duration-200 inline-block">
                        {user ? "LOG OUT" : item.label}
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
          src="/src/app/Images/pollen1.jpeg"
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
            ✦ New Collection — 2025
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

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
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
              {["Privacy Policy", "Terms & Conditions", "Orders & Shipping", "Cancellation", "Refund Policy"].map(p => (
                <a key={p} href="#" className="block text-xs font-medium text-black/60 hover:text-black transition-colors duration-200" style={{ textDecoration: "none" }}>
                  {p}
                </a>
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

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
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

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", background: "#fff", minHeight: "100vh", color: "#0a0a0a", overflowX: "hidden" }}>
      <style>{GLOBAL_STYLES}</style>

      <SideMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        user={user}
        onOpenAuth={openAuth}
        onLogout={handleLogout}
      />
      <TopBar
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen(o => !o)}
        user={user}
        onOpenAuth={openAuth}
        onLogout={handleLogout}
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
        <Hero />
        <FragrancesSection />
        <BundleSection />
        <AboutSection />
        <TrackBanner />
      </main>

      <Footer />
    </div>
  );
}
