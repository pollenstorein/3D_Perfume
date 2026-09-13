import { ArrowLeft, ArrowRight, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FRAGRANCES } from "./data";
import carouselOne from "./Images/1a bg.png";
import storyOne from "./Images/1c.jpg";
import carouselTwo from "./Images/2a bg.png";
import storyTwo from "./Images/2e.jpg";
import carouselThree from "./Images/3a bg.png";
import storyThree from "./Images/3e.jpg";
import introVideo from "./Images/intro.mp4";
import { getOrderByTrackingId } from "./supabase";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultPlaybackRate = 0.75;
      videoRef.current.playbackRate = 0.75;
      videoRef.current.muted = true;
    }
  }, []);
  const setVideoPlayback = () => {
    if (videoRef.current) {
      videoRef.current.defaultPlaybackRate = 0.75;
      videoRef.current.playbackRate = 0.75;
      videoRef.current.muted = true;
    }
  };
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };
  return <section className="relative overflow-hidden bg-black"><video ref={videoRef} src={introVideo} autoPlay muted loop playsInline onLoadedMetadata={setVideoPlayback} aria-label="Know Pollen fragrance introduction" className="relative block h-auto w-full" /><div className="pointer-events-none absolute inset-0 bg-black/10" /><button type="button" onClick={toggleMute} aria-label={isMuted ? "Unmute video" : "Mute video"} className="absolute bottom-6 left-6 z-10 flex h-10 w-10 items-center justify-center border border-white/70 bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-black">{isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}</button><a href="#fragrances" className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 border border-white bg-black/20 px-7 py-2.5 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-black">Discover</a></section>;
}

const STORY_PANELS = [
  { image: storyOne, name: "Fresh Orchid", tagline: "BOLD. FEARLESS. UNAPOLOGETIC." },
  { image: storyTwo, name: "Power of You", tagline: "SWEET. SEDUCTIVE. UNFORGETTABLE." },
  { image: storyThree, name: "Lost Cherry", tagline: "LIGHT. AIRY. EFFORTLESSLY REFINED." },
];

export function IntroStories() {
  return <div>{STORY_PANELS.map((panel, index) => <section key={panel.name} className="relative h-[clamp(600px,90vh,900px)] overflow-hidden bg-black md:h-[clamp(620px,90vh,980px)]"><img src={panel.image} alt={panel.name} className={`absolute inset-0 h-full w-full object-cover md:object-contain ${index === 2 ? "object-[center_75%] md:object-center" : ""}`} /><div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/5" /><div className="absolute inset-x-6 bottom-10 z-10 mx-auto max-w-xl text-center text-white md:bottom-14"><h2 className="text-xl font-medium uppercase tracking-[0.08em] md:text-2xl">{panel.name}</h2><p className="mt-2 text-xs font-normal uppercase tracking-[0.14em] md:text-sm">{panel.tagline}</p><a href="#" className="mt-5 inline-block text-xs font-medium uppercase tracking-[0.12em] text-white underline underline-offset-8 transition-opacity hover:opacity-70">Explore Parfum</a></div></section>)}</div>;
}

const BOTTLE_CAROUSEL = [
  { image: carouselOne, fragrance: FRAGRANCES[2] },
  { image: carouselTwo, fragrance: FRAGRANCES[0] },
  { image: carouselThree, fragrance: FRAGRANCES[1] },
];

export function BottleCarousel({ onAddToCart }: { onAddToCart: (fragrance: typeof FRAGRANCES[number]) => void }) {
  const [active, setActive] = useState(0);
  const move = (direction: number) => setActive(index => (index + direction + BOTTLE_CAROUSEL.length) % BOTTLE_CAROUSEL.length);
  const visiblePanels = [-1, 0, 1].map(offset => ({ offset, panel: BOTTLE_CAROUSEL[(active + offset + BOTTLE_CAROUSEL.length) % BOTTLE_CAROUSEL.length] }));
  const selected = BOTTLE_CAROUSEL[active];
  return <section id="fragrances" className="bg-white px-1 py-12 sm:px-3 md:px-10 md:py-16"><div className="mx-auto flex max-w-screen-2xl items-center gap-0.5 sm:gap-2 md:gap-8"><button type="button" onClick={() => move(-1)} aria-label="Previous fragrance" className="z-20 flex h-9 w-8 shrink-0 items-center justify-center rounded-full text-black transition-all duration-300 ease-out hover:scale-110 hover:bg-black/5 active:scale-95 sm:h-10 sm:w-10 md:h-12 md:w-12"><ArrowLeft size={22} strokeWidth={1.25} /></button><div className="grid h-[clamp(420px,60vh,680px)] min-w-0 flex-1 grid-cols-3 items-stretch gap-0.5 sm:gap-2 md:gap-8">{visiblePanels.map(({ offset, panel }) => <div key={`${panel.fragrance.id}-${offset}`} className={`bottle-stage-panel relative h-full overflow-hidden bg-white transition-all duration-500 ${offset === 0 ? "col-span-3 z-10 scale-[1.03] md:col-span-1" : "hidden scale-[0.86] opacity-55 md:block md:scale-90 md:opacity-75"}`} style={{ backgroundImage: `url(${panel.image})`, backgroundRepeat: "no-repeat" }}><div className="absolute inset-0" />{offset === 0 && <div className="absolute inset-x-1 bottom-5 text-center text-black sm:inset-x-2 md:bottom-8"><h2 className="text-sm font-medium uppercase tracking-[0.08em] sm:text-base md:text-2xl">{selected.fragrance.name}</h2><p className="mt-1 whitespace-nowrap text-[7px] font-normal uppercase tracking-[0.1em] sm:text-[8px] sm:tracking-[0.12em] md:text-xs">{selected.fragrance.tagline}</p><button type="button" onClick={() => onAddToCart(selected.fragrance)} className="mt-3 bg-black px-3 py-2 text-[8px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-neutral-800 sm:px-4 sm:text-[9px] md:mt-5 md:px-6 md:py-2.5 md:text-[10px]">Buy Now</button></div>}</div>)}</div><button type="button" onClick={() => move(1)} aria-label="Next fragrance" className="z-20 flex h-9 w-8 shrink-0 items-center justify-center rounded-full text-black transition-all duration-300 ease-out hover:scale-110 hover:bg-black/5 active:scale-95 sm:h-10 sm:w-10 md:h-12 md:w-12"><ArrowRight size={22} strokeWidth={1.25} /></button></div></section>;
}

export function FragrancesSection({ onAddToCart }: { onAddToCart: (fragrance: typeof FRAGRANCES[number]) => void }) {
  const [active, setActive] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartX = useRef(0);
  const go = (index: number) => setActive((index + FRAGRANCES.length) % FRAGRANCES.length);
  const change = (index: number) => { go(index); setDragOffset(0); };
  return <section id="fragrances" className="bg-white" style={{ borderTop: "1px solid #e8e8e8" }}><div className="flex items-center justify-between border-b border-[#e8e8e8] px-6 py-8 md:px-16"><p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-black/40">Fragrances</p><div className="flex items-center gap-6"><span className="text-[10px] font-semibold tracking-[0.3em] text-black/35">{String(active + 1).padStart(2, "0")} / 03</span><div className="flex gap-2"><button onClick={() => change(active - 1)} aria-label="Previous" className="flex h-9 w-9 items-center justify-center border border-black/20"><ArrowLeft size={14} /></button><button onClick={() => change(active + 1)} aria-label="Next" className="flex h-9 w-9 items-center justify-center border border-black/20"><ArrowRight size={14} /></button></div></div></div><div className="overflow-hidden" onPointerDown={event => { dragStartX.current = event.clientX; }} onPointerUp={event => { const delta = dragStartX.current - event.clientX; dragStartX.current = 0; if (Math.abs(delta) > 50) change(active + (delta > 0 ? 1 : -1)); }}><div className="flex transition-transform duration-500" style={{ transform: `translateX(calc(-${active * 100}% + ${dragOffset}px))` }}>{FRAGRANCES.map((fragrance, index) => <article key={fragrance.id} className="grid w-full flex-shrink-0 grid-cols-1 md:grid-cols-2" style={{ minHeight: "clamp(480px, 72vh, 800px)" }}><div className="relative min-h-[280px] overflow-hidden bg-[#f5f0eb] md:min-h-0"><img src={fragrance.img} alt={fragrance.name} className="absolute inset-0 h-full w-full object-cover" /></div><div className="flex flex-col justify-center gap-6 bg-white px-6 py-10 md:gap-8 md:px-16 md:py-16"><div><p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.4em] text-black/35">{String(index + 1).padStart(2, "0")} / 03</p><h2 className="mb-3 text-[clamp(2.2rem,5vw,4rem)] font-extrabold leading-tight tracking-tight">{fragrance.name}</h2><p className="mb-6 text-base italic text-black/50">{fragrance.tagline}</p><p className="max-w-sm text-sm leading-relaxed text-black/65">{fragrance.description}</p></div><div><p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.4em] text-black/35">Key Notes</p><div className="flex flex-wrap gap-2">{fragrance.notes.map(note => <span key={note} className="border border-black px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em]">{note}</span>)}</div></div><button type="button" onClick={() => onAddToCart(fragrance)} className="inline-flex self-start items-center gap-3 bg-black px-8 py-4 text-xs font-bold uppercase tracking-[0.18em] text-white">Add to cart <ArrowRight size={14} /></button></div></article>)}</div></div></section>;
}

export function BundleSection({ onAddBundle }: { onAddBundle: () => void }) { return <section id="bundle" className="bg-black px-6 py-24 text-white md:px-16 md:py-32"><div className="mx-auto grid max-w-screen-xl items-center gap-16 md:grid-cols-2"><div><p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.45em] text-white/40">Get Your Bundle</p><h2 className="mb-8 text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-[0.92] tracking-tight">All three.<br /><em className="font-light italic text-white/50">One story.</em></h2><p className="mb-10 max-w-sm text-sm leading-relaxed text-white/55">Power of You + Lost Cherry + Fresh Orchid. The complete Know Pollen collection. Three moods, one identity. Bundle and save.</p><button type="button" onClick={onAddBundle} className="inline-flex items-center gap-3 bg-white px-8 py-4 text-xs font-bold uppercase tracking-[0.18em] text-black">Get the Bundle <ArrowRight size={14} /></button></div><div className="flex justify-center gap-4 md:justify-end">{FRAGRANCES.map(fragrance => <div key={fragrance.id} className="relative max-w-[120px] flex-1 overflow-hidden" style={{ aspectRatio: "3/5" }}><img src={fragrance.img} alt={fragrance.name} className="h-full w-full object-cover opacity-70" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" /><p className="absolute bottom-3 left-3 right-3 text-[8px] font-bold uppercase tracking-[0.15em]">{fragrance.name}</p></div>)}</div></div></section>; }

export function CheckoutSection({ items, onBack, onPlaceOrder }: { items: { id: number; name: string; img: string; price: number; quantity: number }[]; onBack: () => void; onPlaceOrder: () => void }) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return <section className="min-h-screen bg-white px-6 pb-24 pt-32 md:px-16"><div className="mx-auto max-w-screen-xl"><button type="button" onClick={onBack} className="mb-12 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-black/55 hover:text-black"><ArrowLeft size={14} /> Back to collection</button><div className="grid gap-16 md:grid-cols-[1.2fr_0.8fr]"><div><p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.45em] text-black/40">Know Pollen</p><h1 className="text-5xl font-extrabold tracking-tight md:text-7xl">Checkout</h1><div className="mt-12 divide-y divide-black/10 border-y border-black/10">{items.map(item => <div key={item.id} className="flex items-center gap-4 py-5"><img src={item.img} alt={item.name} className="h-20 w-14 object-cover" /><div className="flex-1"><p className="text-sm font-bold">{item.name}</p><p className="mt-1 text-xs text-black/50">Qty {item.quantity}</p></div><p className="text-sm">₹{(item.price * item.quantity).toLocaleString()}</p></div>)}</div></div><div className="h-fit bg-[#f5f5f5] p-6 md:p-8"><div className="flex items-center justify-between border-b border-black/10 pb-5"><span className="text-xs uppercase tracking-[0.2em] text-black/50">Total</span><span className="text-2xl font-bold">₹{total.toLocaleString()}</span></div><button type="button" onClick={onPlaceOrder} className="mt-8 w-full bg-black px-5 py-4 text-xs font-bold uppercase tracking-[0.18em] text-white hover:bg-neutral-800">Place order</button></div></div></div></section>;
}

export function AboutSection() { return <section id="about" className="border-t border-[#e8e8e8] bg-white px-6 py-24 md:px-16 md:py-32"><div className="mx-auto grid max-w-screen-xl items-start gap-16 md:grid-cols-[1fr_2fr]"><div><p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.45em] text-black/35">Company</p><h2 className="text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-tight tracking-tight">Know<br />Pollen</h2></div><div className="space-y-6"><p className="max-w-xl text-base leading-relaxed text-black/70">Know Pollen is a fragrance house rooted in the belief that scent is identity. We craft each fragrance to be worn, remembered, and claimed — not just smelled.</p><p className="max-w-xl text-sm leading-relaxed text-black/50">Every bottle tells a different story: Power of You is the one you wear to take the room. Lost Cherry is the one you wear to take someone's attention. Fresh Orchid is the one you wear to take a breath.</p><div className="flex flex-wrap gap-12 pt-4">{[["3", "Fragrances"], ["100%", "Cruelty Free"], ["India", "Crafted In"]].map(([value, label]) => <div key={label}><p className="text-3xl font-extrabold tracking-tight">{value}</p><p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-black/35">{label}</p></div>)}</div></div></div></section>; }

export function TrackBanner({ userId, onRequireLogin }: { userId?: string; onRequireLogin: () => void }) {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const handleTrack = async () => {
    const trackingId = value.trim();
    if (!userId) return onRequireLogin();
    if (!trackingId) return setMessage("Enter your tracking ID.");
    setLoading(true);
    setMessage("");
    try {
      const order = await getOrderByTrackingId(userId, trackingId);
      setMessage(order ? `Status: ${order.status}` : "No order found for this tracking ID.");
    } catch {
      setMessage("Unable to load your order right now.");
    } finally {
      setLoading(false);
    }
  };
  return <section id="track" className="border-y border-[#e8e8e8] bg-[#f5f5f5] px-6 py-14 md:px-16"><div className="mx-auto flex max-w-screen-xl flex-col gap-6 md:flex-row md:items-center md:gap-16"><div><p className="text-xs font-bold uppercase tracking-[0.3em]">Track Your Order</p><p className="mt-1 text-sm text-black/45">Enter your order number below</p></div><div className="flex max-w-md flex-1"><input value={value} onChange={event => setValue(event.target.value)} placeholder="Order #KP-00000" className="flex-1 border border-r-0 border-black/20 bg-white px-5 py-3.5 text-sm outline-none" /><button onClick={handleTrack} disabled={loading} className="bg-black px-6 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-white disabled:opacity-60">{loading ? "Checking" : "Track"}</button></div>{message && <p className="text-sm text-black/60" aria-live="polite">{message}</p>}</div></section>;
}
