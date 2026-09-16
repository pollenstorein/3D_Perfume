import { ArrowLeft, ArrowRight, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FRAGRANCES } from "./data";
import { Footer } from "./footer";
import carouselOne from "./Images/1a bg.png";
import orchidGalleryOne from "./Images/1a.PNG";
import orchidGalleryTwo from "./Images/1b.PNG";
import storyOne from "./Images/1c.jpg";
import orchidGalleryFour from "./Images/1d.PNG";
import orchidGalleryFive from "./Images/1e.PNG";
import carouselTwo from "./Images/2a bg.png";
import powerGalleryOne from "./Images/2a.PNG";
import powerGalleryTwo from "./Images/2b.png";
import powerGalleryThree from "./Images/2c.PNG";
import powerGalleryFour from "./Images/2d.PNG";
import { default as powerGalleryFive, default as storyTwo } from "./Images/2e.jpg";
import carouselThree from "./Images/3a bg.png";
import cherryGalleryOne from "./Images/3a.PNG";
import cherryGalleryTwo from "./Images/3b.PNG";
import cherryGalleryThree from "./Images/3c.PNG";
import cherryGalleryFour from "./Images/3d.PNG";
import storyThree from "./Images/3e.jpg";
import giftSetHero, { default as giftGalleryOne, default as momentImage } from "./Images/4a.PNG";
import collectionSecondImage, {
    default as giftGalleryTwo,
    default as giftSetDetailOne,
} from "./Images/4b.PNG";
import { default as giftGalleryThree, default as giftSetDetailTwo } from "./Images/4c.jpg";
import giftGalleryFour from "./Images/4d.PNG";
import giftGalleryFive from "./Images/4e.PNG";
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
  return (
    <section className="relative overflow-hidden bg-black">
      <video
        ref={videoRef}
        src={introVideo}
        autoPlay
        muted
        loop
        playsInline
        onLoadedMetadata={setVideoPlayback}
        aria-label="Know Pollen fragrance introduction"
        className="relative block h-auto w-full"
      />
      <div className="pointer-events-none absolute inset-0 bg-black/10" />
      <button
        type="button"
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute video" : "Mute video"}
        className="absolute bottom-6 left-6 z-10 flex h-10 w-10 items-center justify-center border border-white/70 bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-black"
      >
        {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
      </button>
      <a
        href="/collection"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 border border-white bg-black/20 px-7 py-2.5 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-black"
      >
        Discover
      </a>
    </section>
  );
}

const STORY_PANELS = [
  {
    image: storyThree,
    name: "Lost Cherry",
    tagline: "LIGHT. AIRY. EFFORTLESSLY REFINED.",
  },
  {
    image: storyTwo,
    name: "Power of You",
    tagline: "SWEET. SEDUCTIVE. UNFORGETTABLE.",
  },
  {
    image: storyOne,
    name: "Fresh Orchid",
    tagline: "BOLD. FEARLESS. UNAPOLOGETIC.",
  },
];

export function IntroStories() {
  const routes: Record<string, string> = {
    "Lost Cherry": "/lost-cherry",
    "Power of You": "/power-of-you",
    "Fresh Orchid": "/fresh-orchid",
  };
  return (
    <div>
      {STORY_PANELS.map((panel, index) => (
        <section
          key={panel.name}
          className="relative h-[clamp(600px,90vh,900px)] overflow-hidden bg-black md:h-[clamp(620px,90vh,980px)]"
        >
          <img
            src={panel.image}
            alt={panel.name}
            className={`absolute inset-0 h-full w-full object-cover md:object-contain ${index === 2 ? "object-[60%_75%] md:object-center" : ""}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/5" />
          <div className="absolute inset-x-6 bottom-10 z-10 mx-auto max-w-xl text-center text-white md:bottom-14">
            <h2 className="text-xl font-medium uppercase tracking-[0.08em] md:text-2xl">
              {panel.name}
            </h2>
            <p className="mt-2 text-xs font-normal uppercase tracking-[0.14em] md:text-sm">
              {panel.tagline}
            </p>
            <a
              href={routes[panel.name]}
              className="mt-5 inline-block text-xs font-medium uppercase tracking-[0.12em] text-white underline underline-offset-8 transition-opacity hover:opacity-70"
            >
              Explore Parfum
            </a>
          </div>
        </section>
      ))}
    </div>
  );
}

const BOTTLE_CAROUSEL = [
  { image: carouselOne, fragrance: FRAGRANCES[2] },
  { image: carouselTwo, fragrance: FRAGRANCES[0] },
  { image: carouselThree, fragrance: FRAGRANCES[1] },
];

export function BottleCarousel({
  onAddToCart,
}: {
  onAddToCart: (fragrance: (typeof FRAGRANCES)[number]) => void;
}) {
  const [active, setActive] = useState(0);
  const move = (direction: number) =>
    setActive((index) => (index + direction + BOTTLE_CAROUSEL.length) % BOTTLE_CAROUSEL.length);
  const visiblePanels = [-1, 0, 1].map((offset) => ({
    offset,
    panel: BOTTLE_CAROUSEL[(active + offset + BOTTLE_CAROUSEL.length) % BOTTLE_CAROUSEL.length],
  }));
  const selected = BOTTLE_CAROUSEL[active];
  return (
    <section id="fragrances" className="bg-white px-1 py-12 sm:px-3 md:px-10 md:py-16">
      <div className="mx-auto flex max-w-screen-2xl items-center gap-0.5 sm:gap-2 md:gap-8">
        <button
          type="button"
          onClick={() => move(-1)}
          aria-label="Previous fragrance"
          className="z-20 flex h-9 w-8 shrink-0 items-center justify-center rounded-full text-black transition-all duration-300 ease-out hover:scale-110 hover:bg-black/5 active:scale-95 sm:h-10 sm:w-10 md:h-12 md:w-12"
        >
          <ArrowLeft size={22} strokeWidth={1.25} />
        </button>
        <div className="grid h-[clamp(420px,60vh,680px)] min-w-0 flex-1 grid-cols-3 items-stretch gap-0.5 sm:gap-2 md:gap-8">
          {visiblePanels.map(({ offset, panel }) => (
            <div
              key={`${panel.fragrance.id}-${offset}`}
              className={`bottle-stage-panel relative h-full overflow-hidden bg-white transition-all duration-500 ${offset === 0 ? "col-span-3 z-10 scale-[1.03] md:col-span-1" : "hidden scale-[0.86] opacity-55 md:block md:scale-90 md:opacity-75"}`}
              style={{
                backgroundImage: `url(${panel.image})`,
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="absolute inset-0" />
              {offset === 0 && (
                <div className="absolute inset-x-1 bottom-5 text-center text-black sm:inset-x-2 md:bottom-8">
                  <h2 className="text-sm font-medium uppercase tracking-[0.08em] sm:text-base md:text-2xl">
                    {selected.fragrance.name}
                  </h2>
                  <p className="mt-1 whitespace-nowrap text-[7px] font-normal uppercase tracking-[0.1em] sm:text-[8px] sm:tracking-[0.12em] md:text-xs">
                    {selected.fragrance.tagline}
                  </p>
                  <button
                    type="button"
                    onClick={() => onAddToCart(selected.fragrance)}
                    className="mt-3 bg-black px-3 py-2 text-[8px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-neutral-800 sm:px-4 sm:text-[9px] md:mt-5 md:px-6 md:py-2.5 md:text-[10px]"
                  >
                    Buy Now
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => move(1)}
          aria-label="Next fragrance"
          className="z-20 flex h-9 w-8 shrink-0 items-center justify-center rounded-full text-black transition-all duration-300 ease-out hover:scale-110 hover:bg-black/5 active:scale-95 sm:h-10 sm:w-10 md:h-12 md:w-12"
        >
          <ArrowRight size={22} strokeWidth={1.25} />
        </button>
      </div>
    </section>
  );
}

export function MomentSection() {
  return (
    <section className="relative h-[clamp(520px,78vh,860px)] overflow-hidden bg-black md:aspect-[3375/4219] md:h-auto">
      <img
        src={momentImage}
        alt="Find yourself in the moment"
        className="absolute inset-0 h-full w-full scale-[0.94] object-cover md:scale-100 md:object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
      <div className="absolute inset-x-6 bottom-12 z-10 text-center text-white md:bottom-16">
        <h2 className="text-2xl font-medium uppercase tracking-[0.08em] md:text-4xl">
          "Find yourself in the moment"
        </h2>
        <button
          type="button"
          className="mt-6 border border-white bg-transparent px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-white hover:text-black"
        >
          Know Pollen
        </button>
      </div>
    </section>
  );
}

const PRICING_CARDS = [
  { image: storyOne, fragrance: FRAGRANCES[2] },
  { image: storyTwo, fragrance: FRAGRANCES[0] },
  { image: storyThree, fragrance: FRAGRANCES[1] },
];

export function PricingSection({
  onAddToCart,
  cartItems,
  onChangeQuantity,
}: {
  onAddToCart: (fragrance: (typeof FRAGRANCES)[number]) => void;
  cartItems: { id: number; quantity: number }[];
  onChangeQuantity: (id: number, change: number) => void;
}) {
  return (
    <section className="bg-black px-4 py-14 text-white sm:px-6 md:px-10 md:py-20">
      <div className="mx-auto max-w-screen-2xl">
        <h2 className="mb-10 text-center text-2xl font-medium uppercase tracking-[0.08em] sm:text-3xl md:mb-14 md:text-4xl">
          Shop the collection
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 md:gap-5 lg:gap-8">
          {PRICING_CARDS.map(({ image, fragrance }) => {
            const quantity = cartItems.find((item) => item.id === fragrance.id)?.quantity ?? 0;
            return (
              <article
                key={fragrance.id}
                className="mx-auto flex w-full max-w-sm flex-col text-center"
              >
                <div className="aspect-[4/5] overflow-hidden bg-white">
                  <img
                    src={image}
                    alt={fragrance.name}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col items-center px-2 pt-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.08em] sm:text-base">
                    {fragrance.name}
                  </h3>
                  <p className="mt-3 text-sm text-white/80">₹{fragrance.price.toLocaleString()}</p>
                  {quantity === 0 ? (
                    <button
                      type="button"
                      onClick={() => onAddToCart(fragrance)}
                      className="mt-6 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-black transition-colors hover:bg-neutral-200"
                    >
                      Add to cart
                    </button>
                  ) : (
                    <div className="mt-6 inline-flex items-center border border-white text-sm font-semibold">
                      <button
                        type="button"
                        onClick={() => onChangeQuantity(fragrance.id, -1)}
                        aria-label={`Decrease ${fragrance.name} quantity`}
                        className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-white hover:text-black"
                      >
                        -
                      </button>
                      <span
                        className="flex h-10 min-w-10 items-center justify-center px-2"
                        aria-live="polite"
                      >
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onAddToCart(fragrance)}
                        aria-label={`Increase ${fragrance.name} quantity`}
                        className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-white hover:text-black"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function FragrancesSection({
  onAddToCart,
}: {
  onAddToCart: (fragrance: (typeof FRAGRANCES)[number]) => void;
}) {
  const [active, setActive] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartX = useRef(0);
  const go = (index: number) => setActive((index + FRAGRANCES.length) % FRAGRANCES.length);
  const change = (index: number) => {
    go(index);
    setDragOffset(0);
  };
  return (
    <section id="fragrances" className="bg-white" style={{ borderTop: "1px solid #e8e8e8" }}>
      <div className="flex items-center justify-between border-b border-[#e8e8e8] px-6 py-8 md:px-16">
        <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-black/40">
          Fragrances
        </p>
        <div className="flex items-center gap-6">
          <span className="text-[10px] font-semibold tracking-[0.3em] text-black/35">
            {String(active + 1).padStart(2, "0")} / 03
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => change(active - 1)}
              aria-label="Previous"
              className="flex h-9 w-9 items-center justify-center border border-black/20"
            >
              <ArrowLeft size={14} />
            </button>
            <button
              onClick={() => change(active + 1)}
              aria-label="Next"
              className="flex h-9 w-9 items-center justify-center border border-black/20"
            >
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
      <div
        className="overflow-hidden"
        onPointerDown={(event) => {
          dragStartX.current = event.clientX;
        }}
        onPointerUp={(event) => {
          const delta = dragStartX.current - event.clientX;
          dragStartX.current = 0;
          if (Math.abs(delta) > 50) change(active + (delta > 0 ? 1 : -1));
        }}
      >
        <div
          className="flex transition-transform duration-500"
          style={{
            transform: `translateX(calc(-${active * 100}% + ${dragOffset}px))`,
          }}
        >
          {FRAGRANCES.map((fragrance, index) => (
            <article
              key={fragrance.id}
              className="grid w-full flex-shrink-0 grid-cols-1 md:grid-cols-2"
              style={{ minHeight: "clamp(480px, 72vh, 800px)" }}
            >
              <div className="relative min-h-[280px] overflow-hidden bg-[#f5f0eb] md:min-h-0">
                <img
                  src={fragrance.img}
                  alt={fragrance.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-center gap-6 bg-white px-6 py-10 md:gap-8 md:px-16 md:py-16">
                <div>
                  <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.4em] text-black/35">
                    {String(index + 1).padStart(2, "0")} / 03
                  </p>
                  <h2 className="mb-3 text-[clamp(2.2rem,5vw,4rem)] font-extrabold leading-tight tracking-tight">
                    {fragrance.name}
                  </h2>
                  <p className="mb-6 text-base italic text-black/50">{fragrance.tagline}</p>
                  <p className="max-w-sm text-sm leading-relaxed text-black/65">
                    {fragrance.description}
                  </p>
                </div>
                <div>
                  <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.4em] text-black/35">
                    Key Notes
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {fragrance.notes.map((note) => (
                      <span
                        key={note}
                        className="border border-black px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em]"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onAddToCart(fragrance)}
                  className="inline-flex self-start items-center gap-3 bg-black px-8 py-4 text-xs font-bold uppercase tracking-[0.18em] text-white"
                >
                  Add to cart <ArrowRight size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BundleSection({ onAddBundle }: { onAddBundle: () => void }) {
  return (
    <section id="bundle" className="bg-black px-6 py-24 text-white md:px-16 md:py-32">
      <div className="mx-auto grid max-w-screen-xl items-center gap-16 md:grid-cols-2">
        <div>
          <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.45em] text-white/40">
            Get Your Bundle
          </p>
          <h2 className="mb-8 text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-[0.92] tracking-tight">
            All three.
            <br />
            <em className="font-light italic text-white/50">One story.</em>
          </h2>
          <p className="mb-10 max-w-sm text-sm leading-relaxed text-white/55">
            Power of You + Lost Cherry + Fresh Orchid. The complete Know Pollen collection. Three
            moods, one identity. Bundle and save.
          </p>
          <button
            type="button"
            onClick={onAddBundle}
            className="inline-flex items-center gap-3 bg-white px-8 py-4 text-xs font-bold uppercase tracking-[0.18em] text-black"
          >
            Get the Bundle <ArrowRight size={14} />
          </button>
        </div>
        <div className="flex justify-center gap-4 md:justify-end">
          {FRAGRANCES.map((fragrance) => (
            <div
              key={fragrance.id}
              className="relative max-w-[120px] flex-1 overflow-hidden"
              style={{ aspectRatio: "3/5" }}
            >
              <img
                src={fragrance.img}
                alt={fragrance.name}
                className="h-full w-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <p className="absolute bottom-3 left-3 right-3 text-[8px] font-bold uppercase tracking-[0.15em]">
                {fragrance.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function GiftSetSection({
  onAddBundle,
  onBack,
}: {
  onAddBundle: () => void;
  onBack: () => void;
}) {
  return (
    <section className="min-h-screen bg-white px-1 pb-16 pt-8 sm:px-4 md:px-8 md:pt-12">
      <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)] lg:gap-16">
        <div className="grid grid-cols-2 gap-1 sm:gap-2">
          <div className="col-span-2 aspect-[1.4/1] overflow-hidden bg-[#f3f0ed]">
            <img
              src={giftSetHero}
              alt="The Legacy Set gift box"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="aspect-[0.86/1] overflow-hidden bg-[#f3f0ed]">
            <img
              src={giftSetDetailOne}
              alt="The Legacy Set held in hand"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="aspect-[0.86/1] overflow-hidden bg-[#f3f0ed]">
            <img
              src={giftSetDetailTwo}
              alt="The Legacy Set lifestyle detail"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="flex flex-col justify-center px-5 py-4 lg:px-0">
          <button
            type="button"
            onClick={onBack}
            className="mb-12 inline-flex w-fit items-center text-[10px] font-semibold uppercase tracking-[0.18em] text-black/50 hover:text-black"
          >
            ← Back to collection
          </button>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em]">
            Every day · Every mood · Every side of you
          </p>
          <h1 className="mt-3 text-3xl font-bold uppercase tracking-[0.08em] sm:text-4xl">
            The Legacy Set
          </h1>
          <p className="mt-2 text-lg font-semibold uppercase tracking-[0.08em]">(4 × 20ML)</p>
          <div className="mt-5 flex flex-wrap gap-2 text-[10px] uppercase">
            <span className="bg-black/10 px-3 py-1">Parfum</span>
            <span className="bg-black/10 px-3 py-1">Unisex</span>
            <span className="bg-black/10 px-3 py-1">Gift set</span>
          </div>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-black/65">
            Four signatures. One legacy. The whole of Sarkar, in one box.
          </p>
          <div className="mt-6 flex items-center gap-5">
            <span className="text-2xl">₹999</span>
            <span className="text-lg text-black/45 line-through">₹1,999</span>
            <span className="bg-black px-4 py-2 text-[10px] font-bold uppercase text-white">
              Save 5%
            </span>
          </div>
          <p className="mt-3 text-xs text-black/60">Incl. of all taxes</p>
          <button
            type="button"
            onClick={onAddBundle}
            className="mt-5 w-full bg-black px-5 py-4 text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-neutral-800"
          >
            Add to cart
          </button>
          <p className="mt-8 text-xs text-black/65">* Ships within 24-36 hours of ordering.</p>
          <div className="mt-12 border-t border-black/10 pt-5">
            <p className="text-sm font-semibold">Offers</p>
            <div className="mt-3 flex min-h-32 border border-black/10">
              <div className="flex w-10 items-center justify-center bg-black text-[9px] font-semibold uppercase tracking-[0.12em] text-white [writing-mode:vertical-rl]">
                Gift · included
              </div>
              <div className="flex flex-1 flex-col justify-center px-4">
                <p className="text-lg font-semibold leading-tight">A mini surprise for you</p>
                <p className="mt-4 text-xs text-black/55">
                  Get a 7ml Parfum
                  <br />
                  with your order
                </p>
              </div>
              <div className="w-24 overflow-hidden bg-[#f3f0ed] sm:w-28">
                <img
                  src={giftSetDetailTwo}
                  alt="Mini parfum gift"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const GIFT_SET_GALLERY = [
  { image: giftGalleryOne, alt: "The Gift Set" },
  { image: giftGalleryTwo, alt: "The Gift Set" },
  { image: giftGalleryThree, alt: "The Gift Set" },
  { image: giftGalleryFour, alt: "The Gift Set" },
  { image: giftGalleryFive, alt: "The Gift Set" },
];

export function GiftSetGallerySection({
  onAddBundle,
  onBack,
}: {
  onAddBundle: () => void;
  onBack: () => void;
}) {
  const [activeImage, setActiveImage] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const changeImage = (direction: number) =>
    setActiveImage(
      (index) => (index + direction + GIFT_SET_GALLERY.length) % GIFT_SET_GALLERY.length,
    );

  return (
    <section className="min-h-screen bg-white px-1 pb-16 pt-8 sm:px-4 md:px-8 md:pt-12">
      <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)] lg:gap-16">
        <div className="min-w-0">
          <div
            className="relative overflow-hidden bg-[#f3f0ed] md:hidden"
            onTouchStart={(event) => {
              touchStartX.current = event.touches[0].clientX;
            }}
            onTouchEnd={(event) => {
              if (touchStartX.current === null) return;
              const distance = touchStartX.current - event.changedTouches[0].clientX;
              touchStartX.current = null;
              if (Math.abs(distance) > 40) changeImage(distance > 0 ? 1 : -1);
            }}
          >
            <img
              src={GIFT_SET_GALLERY[activeImage].image}
              alt={GIFT_SET_GALLERY[activeImage].alt}
              className="aspect-[0.86/1] h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => changeImage(-1)}
              aria-label="Previous gift set image"
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center bg-white/85"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => changeImage(1)}
              aria-label="Next gift set image"
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center bg-white/85"
            >
              <ArrowRight size={16} />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {GIFT_SET_GALLERY.map((item, index) => (
                <button
                  key={item.alt}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`Show gift set image ${index + 1}`}
                  className={`h-1.5 w-1.5 rounded-full ${index === activeImage ? "bg-black" : "bg-white"}`}
                />
              ))}
            </div>
          </div>
          <div className="hidden grid-cols-4 gap-1 sm:gap-2 md:grid">
            <div className="col-span-4 aspect-[1.4/1] overflow-hidden bg-[#f3f0ed]">
              <img
                src={GIFT_SET_GALLERY[0].image}
                alt={GIFT_SET_GALLERY[0].alt}
                className="h-full w-full object-cover"
              />
            </div>
            {GIFT_SET_GALLERY.slice(1).map((item) => (
              <div key={item.alt} className="aspect-[0.86/1] overflow-hidden bg-[#f3f0ed]">
                <img src={item.image} alt={item.alt} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center px-5 py-4 lg:px-0">
          <button
            type="button"
            onClick={onBack}
            className="mb-12 inline-flex w-fit items-center text-[10px] font-semibold uppercase tracking-[0.18em] text-black/50 hover:text-black"
          >
            ← Back to collection
          </button>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em]">
            Every day · Every mood · Every side of you
          </p>
          <h1 className="mt-3 text-3xl font-bold uppercase tracking-[0.08em] sm:text-4xl">
            The Gift Set
          </h1>
          <p className="mt-2 text-lg font-semibold uppercase tracking-[0.08em]">(3 × 100ML)</p>
          <div className="mt-5 flex flex-wrap gap-2 text-[10px] uppercase">
            <span className="bg-black/10 px-3 py-1">Parfum</span>
            <span className="bg-black/10 px-3 py-1">Unisex</span>
            <span className="bg-black/10 px-3 py-1">Gift set</span>
          </div>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-black/65">
            Three signatures. One legacy. The whole of Pollen, in one box.
          </p>
          <div className="mt-6 flex items-center gap-5">
            <span className="text-2xl">₹999</span>
            <span className="text-lg text-black/45 line-through">₹1,700</span>
            <span className="bg-black px-4 py-2 text-[10px] font-bold uppercase text-white">
              Save 12%
            </span>
          </div>
          <p className="mt-3 text-xs text-black/60">Incl. of all taxes</p>
          <button
            type="button"
            onClick={onAddBundle}
            className="mt-5 w-full bg-black px-5 py-4 text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-neutral-800"
          >
            Add to cart
          </button>
          <p className="mt-8 text-xs text-black/65">* Ships within 24-36 hours of ordering.</p>
          <div className="mt-12 border-t border-black/10 pt-5">
            <p className="text-sm font-semibold">Offers</p>
            <div className="mt-3 flex min-h-32 border border-black/10">
              <div className="flex w-10 items-center justify-center bg-black text-[9px] font-semibold uppercase tracking-[0.12em] text-white [writing-mode:vertical-rl]">
                Gift · included
              </div>
              <div className="flex flex-1 flex-col justify-center px-4">
                <p className="text-lg font-semibold leading-tight">A mini surprise for you</p>
                <p className="mt-4 text-xs text-black/55">
                  Get a 7ml Parfum
                  <br />
                  with your order
                </p>
              </div>
              <div className="w-24 overflow-hidden bg-[#f3f0ed] sm:w-28">
                <img
                  src={giftGalleryFive}
                  alt="Mini parfum gift"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function GiftSetPage({
  onAddBundle,
  onBack,
  onOpenPrivacy,
  onOpenTerms,
  onOpenRefund,
  onOpenCookies,
  onOpenOrdersShipping,
}: {
  onAddBundle: () => void;
  onBack: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenRefund: () => void;
  onOpenCookies: () => void;
  onOpenOrdersShipping: () => void;
}) {
  const recommendations = [
    { image: storyOne, name: "Fresh Orchid" },
    { image: storyTwo, name: "Power of You" },
    { image: storyThree, name: "Lost Cherry" },
  ];
  return (
    <div className="[&>section]:!min-h-0 [&>section]:!pb-0">
      <GiftSetGallerySection onAddBundle={onAddBundle} onBack={onBack} />
      <div className="w-full overflow-hidden bg-[#f3f0ed]">
        <img
          src={giftSetHero}
          alt="The Legacy Set gift box"
          className="block aspect-[16/9] h-auto w-full object-cover object-[center_68%]"
        />
      </div>
      <section className="bg-white px-6 py-14 md:px-16 md:py-20">
        <div className="mx-auto max-w-screen-xl">
          <div className="border-b border-black/15 pb-10">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.35em] text-black/40">
              The Gift Set
            </p>
            <h2 className="max-w-2xl text-2xl font-bold uppercase tracking-[0.06em] md:text-4xl">
              Three signatures. One legacy.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-black/65">
              The Gift Set brings together three signature perfumes in a considered gift box. Wear
              each scent on its own, layer them by mood, and make every day feel like your own.
            </p>
          </div>
          <div className="pt-12">
            <h2 className="text-xl font-semibold uppercase tracking-[0.08em] md:text-2xl">
              You may also like
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {recommendations.map((item) => (
                <article key={item.name} className="text-center">
                  <div className="aspect-[4/5] overflow-hidden bg-[#f3f0ed]">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold uppercase tracking-[0.08em]">
                    {item.name}
                  </h3>
                  <a
                    href="#fragrances"
                    className="mt-3 inline-block text-[10px] font-semibold uppercase tracking-[0.15em] underline underline-offset-4"
                  >
                    Shop now
                  </a>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer
        onOpenPrivacy={() => {}}
        onOpenTerms={() => {}}
        onOpenRefund={() => {}}
        onOpenCookies={() => {}}
      />
    </div>
  );
}

const POWER_OF_YOU_GALLERY = [
  { image: powerGalleryOne, alt: "Power of You fragrance" },
  { image: powerGalleryTwo, alt: "Power of You bottle detail" },
  { image: powerGalleryThree, alt: "Power of You fragrance detail" },
  { image: powerGalleryFour, alt: "Power of You lifestyle" },
  { image: powerGalleryFive, alt: "Power of You fragrance bottle" },
];

const PERFUME_ROUTES: Record<string, string> = {
  "Power of You": "/power-of-you",
  "Lost Cherry": "/lost-cherry",
  "Fresh Orchid": "/fresh-orchid",
};
const PERFUME_VARIANT_IMAGES: Record<string, string> = {
  "Power of You": carouselTwo,
  "Lost Cherry": carouselThree,
  "Fresh Orchid": carouselOne,
};

export function PerfumeVariants({
  currentName,
  onSelectVariant,
}: {
  currentName: string;
  onSelectVariant?: (route: string) => void;
}) {
  const variants = FRAGRANCES.filter((fragrance) => fragrance.name !== currentName);
  return (
    <section className="perfume-variant-picker bg-white px-5 pb-8 pt-2 md:px-0 md:pb-2 md:pt-0">
      <div className="max-w-md">
        <h2 className="text-sm font-semibold uppercase tracking-[0.08em]">Choose variants</h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {variants.map((variant) => (
            <a
              key={variant.id}
              href={PERFUME_ROUTES[variant.name]}
              onClick={(event) => {
                if (!onSelectVariant) return;
                event.preventDefault();
                onSelectVariant(PERFUME_ROUTES[variant.name]);
              }}
              className="group text-center"
            >
              <div className="aspect-[0.86/1] overflow-hidden border border-black/20 bg-white">
                <img
                  src={PERFUME_VARIANT_IMAGES[variant.name]}
                  alt={variant.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.06em]">
                {variant.name}
              </p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.1em] text-black/55">(100ML)</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function DetailPurchaseControl({ quantity, onAddToCart, onChangeQuantity }: { quantity: number; onAddToCart: () => void; onChangeQuantity: (change: number) => void }) {
  if (quantity === 0)
    return (
      <button
        type="button"
        onClick={onAddToCart}
        className="bg-black px-6 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white hover:bg-neutral-800"
      >
        Add to cart
      </button>
    );
  return (
    <div className="inline-flex h-12 items-center border border-black text-sm font-semibold">
      <button
        type="button"
        onClick={() => onChangeQuantity(-1)}
        aria-label="Decrease quantity"
        className="flex h-full w-12 items-center justify-center hover:bg-black hover:text-white"
      >
        −
      </button>
      <span className="flex h-full min-w-10 items-center justify-center" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onAddToCart()}
        aria-label="Increase quantity"
        className="flex h-full w-12 items-center justify-center hover:bg-black hover:text-white"
      >
        +
      </button>
    </div>
  );
}

export function PowerOfYouPage({
  onAddToCart,
    onBack,
    quantity,
    onChangeQuantity
}: {
  onAddToCart: () => void;
  onBack: () => void;
      quantity: number;
      onChangeQuantity: (change: number) => void;
}) {
  const [activeImage, setActiveImage] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const changeImage = (direction: number) =>
    setActiveImage(
      (index) => (index + direction + POWER_OF_YOU_GALLERY.length) % POWER_OF_YOU_GALLERY.length,
    );
  return (
    <div className="[&>section]:!min-h-0 [&>section]:!pb-0">
      <section className="min-h-screen bg-white px-1 pb-16 pt-8 sm:px-4 md:px-8 md:pt-12">
        <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)] lg:gap-16">
          <div className="min-w-0">
            <div
              className="relative overflow-hidden bg-[#f3f0ed] md:hidden"
              onTouchStart={(event) => {
                touchStartX.current = event.touches[0].clientX;
              }}
              onTouchEnd={(event) => {
                if (touchStartX.current === null) return;
                const distance = touchStartX.current - event.changedTouches[0].clientX;
                touchStartX.current = null;
                if (Math.abs(distance) > 40) changeImage(distance > 0 ? 1 : -1);
              }}
            >
              <img
                src={POWER_OF_YOU_GALLERY[activeImage].image}
                alt={POWER_OF_YOU_GALLERY[activeImage].alt}
                className="aspect-[0.86/1] h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => changeImage(-1)}
                aria-label="Previous Power of You image"
                className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center bg-white/85"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => changeImage(1)}
                aria-label="Next Power of You image"
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center bg-white/85"
              >
                <ArrowRight size={16} />
              </button>
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                {POWER_OF_YOU_GALLERY.map((item, index) => (
                  <button
                    key={item.image}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    aria-label={`Show Power of You image ${index + 1}`}
                    className={`h-1.5 w-1.5 rounded-full ${index === activeImage ? "bg-black" : "bg-white"}`}
                  />
                ))}
              </div>
            </div>
            <div className="hidden grid-cols-4 gap-1 sm:gap-2 md:grid">
              <div className="col-span-4 aspect-[1.4/1] overflow-hidden bg-[#f3f0ed]">
                <img
                  src={POWER_OF_YOU_GALLERY[0].image}
                  alt={POWER_OF_YOU_GALLERY[0].alt}
                  className="h-full w-full object-cover"
                />
              </div>
              {POWER_OF_YOU_GALLERY.slice(1).map((item) => (
                <div key={item.image} className="aspect-[0.86/1] overflow-hidden bg-[#f3f0ed]">
                  <img src={item.image} alt={item.alt} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-center px-5 py-4 lg:px-0">
            <button
              type="button"
              onClick={onBack}
              className="mb-12 inline-flex w-fit items-center text-[10px] font-semibold uppercase tracking-[0.18em] text-black/50 hover:text-black"
            >
              ← Back to collection
            </button>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em]">
              Bold · Fierce · Unapologetic
            </p>
            <h1 className="mt-3 text-3xl font-bold uppercase tracking-[0.08em] sm:text-4xl">
              Power of You
            </h1>
            <p className="mt-2 text-lg font-semibold uppercase tracking-[0.08em]">100 ML</p>
            <div className="mt-5 flex flex-wrap gap-2 text-[10px] uppercase">
              <span className="bg-black/10 px-3 py-1">Parfum</span>
              <span className="bg-black/10 px-3 py-1">Unisex</span>
            </div>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-black/65">
              A commanding fragrance that asserts presence before you enter the room. Warm woods,
              dark musk, and a spark of citrus that lingers all day.
            </p>
            <div className="mt-6 flex items-center gap-5">
              <span className="text-2xl">₹{FRAGRANCES[0].price.toLocaleString()}</span>
              <DetailPurchaseControl quantity={quantity} onAddToCart={onAddToCart} onChangeQuantity={onChangeQuantity} />
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white px-6 py-14 md:px-16 md:py-20">
        <div className="mx-auto max-w-screen-xl border-t border-black/15 pt-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-black/40">
            Power of You
          </p>
          <h2 className="mt-4 max-w-2xl text-2xl font-bold uppercase tracking-[0.06em] md:text-4xl">
            Take the room. Keep your edge.
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-black/65">
            Dark musk, cedarwood, and bergamot come together in a fragrance made for the version of
            you that does not wait for permission.
          </p>
        </div>
      </section>
    </div>
  );
}

export function PowerOfYouPageWithRecommendations({
  onAddToCart,
    onBack,
    quantity,
    onChangeQuantity
}: {
  onAddToCart: () => void;
  onBack: () => void;
      quantity: number;
      onChangeQuantity: (change: number) => void;
}) {
  const recommendations = [
    { image: storyOne, name: "Fresh Orchid", href: "/fresh-orchid" },
    { image: storyThree, name: "Lost Cherry", href: "/lost-cherry" },
    { image: giftSetHero, name: "The Legacy Set", href: "/gift-set" },
  ];
  return (
    <>
      <PowerOfYouPage onAddToCart={onAddToCart} onBack={onBack} quantity={quantity} onChangeQuantity={onChangeQuantity} />
      <section className="bg-white px-6 py-14 md:px-16 md:py-20">
        <div className="mx-auto max-w-screen-xl">
          <h2 className="text-xl font-semibold uppercase tracking-[0.08em] md:text-2xl">
            You may also like
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {recommendations.map((item) => (
              <article key={item.name} className="text-center">
                <div className="aspect-[4/5] overflow-hidden bg-[#f3f0ed]">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <h3 className="mt-4 text-sm font-semibold uppercase tracking-[0.08em]">
                  {item.name}
                </h3>
                <a
                  href={item.href}
                  className="mt-3 inline-block text-[10px] font-semibold uppercase tracking-[0.15em] underline underline-offset-4"
                >
                  Shop now
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Footer
        onOpenPrivacy={() =>
          window.dispatchEvent(new CustomEvent("open-policy", { detail: "privacy" }))
        }
        onOpenTerms={() =>
          window.dispatchEvent(new CustomEvent("open-policy", { detail: "terms" }))
        }
        onOpenRefund={() =>
          window.dispatchEvent(new CustomEvent("open-policy", { detail: "refund" }))
        }
        onOpenCookies={() =>
          window.dispatchEvent(new CustomEvent("open-policy", { detail: "cookies" }))
        }
        onOpenOrdersShipping={() =>
          window.dispatchEvent(new CustomEvent("open-policy", { detail: "orders" }))
        }
      />
    </>
  );
}

const LOST_CHERRY_GALLERY = [
  { image: cherryGalleryOne, alt: "Lost Cherry fragrance" },
  { image: cherryGalleryTwo, alt: "Lost Cherry bottle detail" },
  { image: cherryGalleryThree, alt: "Lost Cherry fragrance detail" },
  { image: cherryGalleryFour, alt: "Lost Cherry lifestyle" },
  { image: storyThree, alt: "Lost Cherry fragrance bottle" },
];

export function LostCherryPageWithRecommendations({
  onAddToCart,
    onBack,
    quantity,
    onChangeQuantity
}: {
  onAddToCart: () => void;
  onBack: () => void;
      quantity: number;
      onChangeQuantity: (change: number) => void;
}) {
  const [activeImage, setActiveImage] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const changeImage = (direction: number) =>
    setActiveImage(
      (index) => (index + direction + LOST_CHERRY_GALLERY.length) % LOST_CHERRY_GALLERY.length,
    );
  const recommendations = [
    { image: storyOne, name: "Fresh Orchid", href: "/fresh-orchid" },
    { image: powerGalleryOne, name: "Power of You", href: "/power-of-you" },
    { image: giftSetHero, name: "The Legacy Set", href: "/gift-set" },
  ];
  return (
    <div className="[&>section]:!min-h-0 [&>section]:!pb-0">
      <section className="min-h-screen bg-white px-1 pb-16 pt-8 sm:px-4 md:px-8 md:pt-12">
        <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)] lg:gap-16">
          <div className="min-w-0">
            <div
              className="relative overflow-hidden bg-[#f3f0ed] md:hidden"
              onTouchStart={(event) => {
                touchStartX.current = event.touches[0].clientX;
              }}
              onTouchEnd={(event) => {
                if (touchStartX.current === null) return;
                const distance = touchStartX.current - event.changedTouches[0].clientX;
                touchStartX.current = null;
                if (Math.abs(distance) > 40) changeImage(distance > 0 ? 1 : -1);
              }}
            >
              <img
                src={LOST_CHERRY_GALLERY[activeImage].image}
                alt={LOST_CHERRY_GALLERY[activeImage].alt}
                className="aspect-[0.86/1] h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => changeImage(-1)}
                aria-label="Previous Lost Cherry image"
                className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center bg-white/85"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => changeImage(1)}
                aria-label="Next Lost Cherry image"
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center bg-white/85"
              >
                <ArrowRight size={16} />
              </button>
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                {LOST_CHERRY_GALLERY.map((item, index) => (
                  <button
                    key={item.image}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    aria-label={`Show Lost Cherry image ${index + 1}`}
                    className={`h-1.5 w-1.5 rounded-full ${index === activeImage ? "bg-black" : "bg-white"}`}
                  />
                ))}
              </div>
            </div>
            <div className="hidden grid-cols-4 gap-1 sm:gap-2 md:grid">
              <div className="col-span-4 aspect-[1.4/1] overflow-hidden bg-[#f3f0ed]">
                <img
                  src={LOST_CHERRY_GALLERY[0].image}
                  alt={LOST_CHERRY_GALLERY[0].alt}
                  className="h-full w-full object-cover"
                />
              </div>
              {LOST_CHERRY_GALLERY.slice(1).map((item) => (
                <div key={item.image} className="aspect-[0.86/1] overflow-hidden bg-[#f3f0ed]">
                  <img src={item.image} alt={item.alt} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-center px-5 py-4 lg:px-0">
            <button
              type="button"
              onClick={onBack}
              className="mb-12 inline-flex w-fit items-center text-[10px] font-semibold uppercase tracking-[0.18em] text-black/50 hover:text-black"
            >
              ← Back to collection
            </button>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em]">
              Sweet · Seductive · Unforgettable
            </p>
            <h1 className="mt-3 text-3xl font-bold uppercase tracking-[0.08em] sm:text-4xl">
              Lost Cherry
            </h1>
            <p className="mt-2 text-lg font-semibold uppercase tracking-[0.08em]">100 ML</p>
            <div className="mt-5 flex flex-wrap gap-2 text-[10px] uppercase">
              <span className="bg-black/10 px-3 py-1">Parfum</span>
              <span className="bg-black/10 px-3 py-1">Unisex</span>
            </div>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-black/65">
              A rich cherry accord layered over Turkish rose and bitter almond. Deeply sensual,
              dangerously addictive.
            </p>
            <div className="mt-6 flex items-center gap-5">
              <span className="text-2xl">₹{FRAGRANCES[1].price.toLocaleString()}</span>
              <DetailPurchaseControl quantity={quantity} onAddToCart={onAddToCart} onChangeQuantity={onChangeQuantity} />
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white px-6 py-14 md:px-16 md:py-20">
        <div className="mx-auto max-w-screen-xl border-t border-black/15 pt-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-black/40">
            Lost Cherry
          </p>
          <h2 className="mt-4 max-w-2xl text-2xl font-bold uppercase tracking-[0.06em] md:text-4xl">
            Sweetness with a dangerous edge.
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-black/65">
            Black cherry, Turkish rose, and bitter almond create an unforgettable signature with
            every spray.
          </p>
        </div>
      </section>
      <section className="bg-white px-6 py-14 md:px-16 md:py-20">
        <div className="mx-auto max-w-screen-xl">
          <h2 className="text-xl font-semibold uppercase tracking-[0.08em] md:text-2xl">
            You may also like
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {recommendations.map((item) => (
              <article key={item.name} className="text-center">
                <div className="aspect-[4/5] overflow-hidden bg-[#f3f0ed]">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <h3 className="mt-4 text-sm font-semibold uppercase tracking-[0.08em]">
                  {item.name}
                </h3>
                <a
                  href={item.href}
                  className="mt-3 inline-block text-[10px] font-semibold uppercase tracking-[0.15em] underline underline-offset-4"
                >
                  Shop now
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Footer
        onOpenPrivacy={() =>
          window.dispatchEvent(new CustomEvent("open-policy", { detail: "privacy" }))
        }
        onOpenTerms={() =>
          window.dispatchEvent(new CustomEvent("open-policy", { detail: "terms" }))
        }
        onOpenRefund={() =>
          window.dispatchEvent(new CustomEvent("open-policy", { detail: "refund" }))
        }
        onOpenCookies={() =>
          window.dispatchEvent(new CustomEvent("open-policy", { detail: "cookies" }))
        }
        onOpenOrdersShipping={() =>
          window.dispatchEvent(new CustomEvent("open-policy", { detail: "orders" }))
        }
      />
    </div>
  );
}

const FRESH_ORCHID_GALLERY = [
  { image: orchidGalleryOne, alt: "Fresh Orchid fragrance" },
  { image: orchidGalleryTwo, alt: "Fresh Orchid bottle detail" },
  { image: storyOne, alt: "Fresh Orchid fragrance detail" },
  { image: orchidGalleryFour, alt: "Fresh Orchid lifestyle" },
  { image: orchidGalleryFive, alt: "Fresh Orchid fragrance bottle" },
];

export function FreshOrchidPageWithRecommendations({
  onAddToCart,
    onBack,
    quantity,
    onChangeQuantity
}: {
  onAddToCart: () => void;
  onBack: () => void;
      quantity: number;
      onChangeQuantity: (change: number) => void;
}) {
  const [activeImage, setActiveImage] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const changeImage = (direction: number) =>
    setActiveImage(
      (index) => (index + direction + FRESH_ORCHID_GALLERY.length) % FRESH_ORCHID_GALLERY.length,
    );
  const recommendations = [
    { image: powerGalleryOne, name: "Power of You", href: "/power-of-you" },
    { image: storyThree, name: "Lost Cherry", href: "/lost-cherry" },
    { image: giftSetHero, name: "The Legacy Set", href: "/gift-set" },
  ];
  return (
    <div className="[&>section]:!min-h-0 [&>section]:!pb-0">
      <section className="min-h-screen bg-white px-1 pb-16 pt-8 sm:px-4 md:px-8 md:pt-12">
        <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)] lg:gap-16">
          <div className="min-w-0">
            <div
              className="relative overflow-hidden bg-[#f3f0ed] md:hidden"
              onTouchStart={(event) => {
                touchStartX.current = event.touches[0].clientX;
              }}
              onTouchEnd={(event) => {
                if (touchStartX.current === null) return;
                const distance = touchStartX.current - event.changedTouches[0].clientX;
                touchStartX.current = null;
                if (Math.abs(distance) > 40) changeImage(distance > 0 ? 1 : -1);
              }}
            >
              <img
                src={FRESH_ORCHID_GALLERY[activeImage].image}
                alt={FRESH_ORCHID_GALLERY[activeImage].alt}
                className="aspect-[0.86/1] h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => changeImage(-1)}
                aria-label="Previous Fresh Orchid image"
                className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center bg-white/85"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => changeImage(1)}
                aria-label="Next Fresh Orchid image"
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center bg-white/85"
              >
                <ArrowRight size={16} />
              </button>
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                {FRESH_ORCHID_GALLERY.map((item, index) => (
                  <button
                    key={item.image}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    aria-label={`Show Fresh Orchid image ${index + 1}`}
                    className={`h-1.5 w-1.5 rounded-full ${index === activeImage ? "bg-black" : "bg-white"}`}
                  />
                ))}
              </div>
            </div>
            <div className="hidden grid-cols-4 gap-1 sm:gap-2 md:grid">
              <div className="col-span-4 aspect-[1.4/1] overflow-hidden bg-[#f3f0ed]">
                <img
                  src={FRESH_ORCHID_GALLERY[0].image}
                  alt={FRESH_ORCHID_GALLERY[0].alt}
                  className="h-full w-full object-cover"
                />
              </div>
              {FRESH_ORCHID_GALLERY.slice(1).map((item) => (
                <div key={item.image} className="aspect-[0.86/1] overflow-hidden bg-[#f3f0ed]">
                  <img src={item.image} alt={item.alt} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-center px-5 py-4 lg:px-0">
            <button
              type="button"
              onClick={onBack}
              className="mb-12 inline-flex w-fit items-center text-[10px] font-semibold uppercase tracking-[0.18em] text-black/50 hover:text-black"
            >
              ← Back to collection
            </button>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em]">
              Light · Airy · Effortlessly Refined
            </p>
            <h1 className="mt-3 text-3xl font-bold uppercase tracking-[0.08em] sm:text-4xl">
              Fresh Orchid
            </h1>
            <p className="mt-2 text-lg font-semibold uppercase tracking-[0.08em]">100 ML</p>
            <div className="mt-5 flex flex-wrap gap-2 text-[10px] uppercase">
              <span className="bg-black/10 px-3 py-1">Parfum</span>
              <span className="bg-black/10 px-3 py-1">Unisex</span>
            </div>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-black/65">
              White orchid petals lifted on a breeze of green tea and white cedar. Purity distilled
              into a single breath.
            </p>
            <div className="mt-6 flex items-center gap-5">
              <span className="text-2xl">₹{FRAGRANCES[2].price.toLocaleString()}</span>
              <DetailPurchaseControl quantity={quantity} onAddToCart={onAddToCart} onChangeQuantity={onChangeQuantity} />
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white px-6 py-14 md:px-16 md:py-20">
        <div className="mx-auto max-w-screen-xl border-t border-black/15 pt-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-black/40">
            Fresh Orchid
          </p>
          <h2 className="mt-4 max-w-2xl text-2xl font-bold uppercase tracking-[0.06em] md:text-4xl">
            A quiet breath of clarity.
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-black/65">
            White orchid, green tea, and white cedar create a clean signature that stays close and
            lingers softly.
          </p>
        </div>
      </section>
      <section className="bg-white px-6 py-14 md:px-16 md:py-20">
        <div className="mx-auto max-w-screen-xl">
          <h2 className="text-xl font-semibold uppercase tracking-[0.08em] md:text-2xl">
            You may also like
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {recommendations.map((item) => (
              <article key={item.name} className="text-center">
                <div className="aspect-[4/5] overflow-hidden bg-[#f3f0ed]">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <h3 className="mt-4 text-sm font-semibold uppercase tracking-[0.08em]">
                  {item.name}
                </h3>
                <a
                  href={item.href}
                  className="mt-3 inline-block text-[10px] font-semibold uppercase tracking-[0.15em] underline underline-offset-4"
                >
                  Shop now
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Footer
        onOpenPrivacy={() =>
          window.dispatchEvent(new CustomEvent("open-policy", { detail: "privacy" }))
        }
        onOpenTerms={() =>
          window.dispatchEvent(new CustomEvent("open-policy", { detail: "terms" }))
        }
        onOpenRefund={() =>
          window.dispatchEvent(new CustomEvent("open-policy", { detail: "refund" }))
        }
        onOpenCookies={() =>
          window.dispatchEvent(new CustomEvent("open-policy", { detail: "cookies" }))
        }
        onOpenOrdersShipping={() =>
          window.dispatchEvent(new CustomEvent("open-policy", { detail: "orders" }))
        }
      />
    </div>
  );
}

export function CollectionPage() {
  const [expanded, setExpanded] = useState(false);
  const products = [
    ...FRAGRANCES.map((fragrance) => ({
      id: fragrance.id,
      name: fragrance.name,
      image: fragrance.img,
      price: fragrance.price,
    })),
    { id: 4, name: "The Legacy Set", image: giftSetHero, price: 999 },
  ];
  return (
    <div className="bg-white">
      <div className="w-full overflow-hidden bg-[#f3f0ed]">
        <img
          src={giftSetHero}
          alt="The Legacy Set"
          className="block aspect-[16/9] w-full object-cover object-center"
        />
      </div>
      <section className="px-6 py-14 md:px-16 md:py-20">
        <div className="mx-auto max-w-screen-xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-black/40">
            The collection
          </p>
          <h1 className="mt-4 text-3xl font-bold uppercase tracking-[0.06em] md:text-5xl">
            Every mood. Every side of you.
          </h1>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <article key={product.name}>
                <div className="aspect-[4/5] overflow-hidden bg-[#f3f0ed]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h2 className="mt-4 text-sm font-semibold uppercase tracking-[0.08em]">
                  {product.name}
                </h2>
                <p className="mt-2 text-sm text-black/60">₹{product.price.toLocaleString()}</p>
              </article>
            ))}
          </div>
          <div className="mt-16 overflow-hidden bg-[#f3f0ed]">
            <img
              src={collectionSecondImage}
              alt="Know Pollen fragrance collection"
              className="block aspect-[16/9] w-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={() => setExpanded((open) => !open)}
            aria-expanded={expanded}
            className="mt-6 inline-flex items-center gap-3 border border-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em]"
          >
            {expanded ? "Read less" : "Read more"}
          </button>
          {expanded && (
            <div className="mt-8 grid gap-8 border-t border-black/15 pt-8 text-sm leading-relaxed text-black/65 md:grid-cols-2">
              <div>
                <h2 className="font-semibold uppercase tracking-[0.08em] text-black">
                  Why buy Pollen
                </h2>
                <p className="mt-3">
                  Thoughtful fragrances made to last, with expressive scents for every version of
                  you.
                </p>
              </div>
              <div>
                <h2 className="font-semibold uppercase tracking-[0.08em] text-black">
                  Collection includes
                </h2>
                <p className="mt-3">Power of You, Lost Cherry, Fresh Orchid, and The Legacy Set.</p>
              </div>
              <div>
                <h2 className="font-semibold uppercase tracking-[0.08em] text-black">
                  Made to be remembered
                </h2>
                <p className="mt-3">
                  Distinctive compositions designed to leave a confident, personal impression.
                </p>
              </div>
              <div>
                <h2 className="font-semibold uppercase tracking-[0.08em] text-black">
                  A scent for every day
                </h2>
                <p className="mt-3">
                  Choose a fragrance for your mood, your moment, and your own story.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer
        onOpenPrivacy={() => {}}
        onOpenTerms={() => {}}
        onOpenRefund={() => {}}
        onOpenCookies={() => {}}
      />
    </div>
  );
}

export function CollectionPageUpdated({
  onAddToCart,
}: {
  onAddToCart: (item: { id: number; name: string; img: string; price: number }) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const products = [
    ...FRAGRANCES.map((fragrance) => ({
      id: fragrance.id,
      name: fragrance.name,
      image: fragrance.img,
      price: fragrance.price,
    })),
    { id: 4, name: "The Legacy Set", image: giftSetHero, price: 999 },
  ];
  return (
    <div className="bg-white">
      <div className="w-full overflow-hidden bg-[#f3f0ed]">
        <img
          src={giftSetHero}
          alt="The Legacy Set"
          className="block aspect-[16/9] w-full object-cover object-center"
        />
      </div>
      <section className="px-6 py-14 md:px-16 md:py-20">
        <div className="mx-auto max-w-screen-xl text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-black/40">
            The collection
          </p>
          <h1 className="mt-4 text-3xl font-bold uppercase tracking-[0.06em] md:text-5xl">
            Every mood. Every side of you.
          </h1>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <article key={product.name} className="mx-auto w-full max-w-xs">
                <div className="aspect-[4/5] overflow-hidden bg-[#f3f0ed]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h2 className="mt-4 text-sm font-semibold uppercase tracking-[0.08em]">
                  {product.name}
                </h2>
                <p className="mt-2 text-xs uppercase tracking-[0.12em] text-black/50">
                  100 ML per bottle
                </p>
                <div className="mt-3 flex items-center justify-center gap-3">
                  <p className="text-sm text-black/60">₹{product.price.toLocaleString()}</p>
                  <button
                    type="button"
                    onClick={() =>
                      onAddToCart({
                        id: product.id,
                        name: product.name,
                        img: product.image,
                        price: product.price,
                      })
                    }
                    className="bg-black px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-white hover:bg-neutral-800"
                  >
                    Add to cart
                  </button>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-16 overflow-hidden bg-[#f3f0ed]">
            <img
              src={collectionSecondImage}
              alt="Know Pollen fragrance collection"
              className="block aspect-[16/9] w-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={() => setExpanded((open) => !open)}
            aria-expanded={expanded}
            className="mt-6 inline-flex items-center gap-3 border border-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em]"
          >
            {expanded ? "Read less" : "Read more"}
          </button>
          {expanded && (
            <div className="mt-8 grid gap-8 border-t border-black/15 pt-8 text-left text-sm leading-relaxed text-black/65 md:grid-cols-2">
              <div>
                <h2 className="font-semibold uppercase tracking-[0.08em] text-black">
                  Why buy Pollen
                </h2>
                <p className="mt-3">
                  Thoughtful fragrances made to last, with expressive scents for every version of
                  you.
                </p>
              </div>
              <div>
                <h2 className="font-semibold uppercase tracking-[0.08em] text-black">
                  Collection includes
                </h2>
                <p className="mt-3">Power of You, Lost Cherry, Fresh Orchid, and The Legacy Set.</p>
              </div>
              <div>
                <h2 className="font-semibold uppercase tracking-[0.08em] text-black">
                  Made to be remembered
                </h2>
                <p className="mt-3">
                  Distinctive compositions designed to leave a confident, personal impression.
                </p>
              </div>
              <div>
                <h2 className="font-semibold uppercase tracking-[0.08em] text-black">
                  A scent for every day
                </h2>
                <p className="mt-3">
                  Choose a fragrance for your mood, your moment, and your own story.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer
        onOpenPrivacy={() => {}}
        onOpenTerms={() => {}}
        onOpenRefund={() => {}}
        onOpenCookies={() => {}}
      />
    </div>
  );
}

export function CollectionPageWithBack({
  onAddToCart,
}: {
  onAddToCart: (item: { id: number; name: string; img: string; price: number }) => void;
}) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-screen-xl px-6 pb-2 pt-8 text-left md:px-16">
        <button
          type="button"
          onClick={() => {
            window.location.href = "/";
          }}
          className="inline-flex items-center text-[10px] font-semibold uppercase tracking-[0.18em] text-black/50 hover:text-black"
        >
          ← Back to collection
        </button>
      </div>
      <CollectionPageUpdated onAddToCart={onAddToCart} />
    </div>
  );
}

export function CheckoutSection({
  items,
  onBack,
  onPlaceOrder,
}: {
  items: {
    id: number;
    name: string;
    img: string;
    price: number;
    quantity: number;
  }[];
  onBack: () => void;
  onPlaceOrder: () => void;
}) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return (
    <section className="min-h-screen bg-white px-6 pb-24 pt-32 md:px-16">
      <div className="mx-auto max-w-screen-xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-12 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-black/55 hover:text-black"
        >
          <ArrowLeft size={14} /> Back to collection
        </button>
        <div className="grid gap-16 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.45em] text-black/40">
              Know Pollen
            </p>
            <h1 className="text-5xl font-extrabold tracking-tight md:text-7xl">Checkout</h1>
            <div className="mt-12 divide-y divide-black/10 border-y border-black/10">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-5">
                  <img src={item.img} alt={item.name} className="h-20 w-14 object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-bold">{item.name}</p>
                    <p className="mt-1 text-xs text-black/50">Qty {item.quantity}</p>
                  </div>
                  <p className="text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="h-fit bg-[#f5f5f5] p-6 md:p-8">
            <div className="flex items-center justify-between border-b border-black/10 pb-5">
              <span className="text-xs uppercase tracking-[0.2em] text-black/50">Total</span>
              <span className="text-2xl font-bold">₹{total.toLocaleString()}</span>
            </div>
            <button
              type="button"
              onClick={onPlaceOrder}
              className="mt-8 w-full bg-black px-5 py-4 text-xs font-bold uppercase tracking-[0.18em] text-white hover:bg-neutral-800"
            >
              Place order
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AboutSection() {
  return (
    <section id="about" className="border-t border-[#e8e8e8] bg-white px-6 py-24 md:px-16 md:py-32">
      <div className="mx-auto grid max-w-screen-xl items-start gap-16 md:grid-cols-[1fr_2fr]">
        <div>
          <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.45em] text-black/35">
            Company
          </p>
          <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-tight tracking-tight">
            Know
            <br />
            Pollen
          </h2>
        </div>
        <div className="space-y-6">
          <p className="max-w-xl text-base leading-relaxed text-black/70">
            Know Pollen is a fragrance house rooted in the belief that scent is identity. We craft
            each fragrance to be worn, remembered, and claimed — not just smelled.
          </p>
          <p className="max-w-xl text-sm leading-relaxed text-black/50">
            Every bottle tells a different story: Power of You is the one you wear to take the room.
            Lost Cherry is the one you wear to take someone's attention. Fresh Orchid is the one you
            wear to take a breath.
          </p>
          <div className="flex flex-wrap gap-12 pt-4">
            {[
              ["3", "Fragrances"],
              ["100%", "Cruelty Free"],
              ["India", "Crafted In"],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="text-3xl font-extrabold tracking-tight">{value}</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-black/35">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function TrackBanner({
  userId,
  onRequireLogin,
}: {
  userId?: string;
  onRequireLogin: () => void;
}) {
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
  return (
    <section id="track" className="border-y border-[#e8e8e8] bg-[#f5f5f5] px-6 py-14 md:px-16">
      <div className="mx-auto flex max-w-screen-xl flex-col gap-6 md:flex-row md:items-center md:gap-16">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em]">Track Your Order</p>
          <p className="mt-1 text-sm text-black/45">Enter your order number below</p>
        </div>
        <div className="flex max-w-md flex-1">
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Order #KP-00000"
            className="flex-1 border border-r-0 border-black/20 bg-white px-5 py-3.5 text-sm outline-none"
          />
          <button
            onClick={handleTrack}
            disabled={loading}
            className="bg-black px-6 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-white disabled:opacity-60"
          >
            {loading ? "Checking" : "Track"}
          </button>
        </div>
        {message && (
          <p className="text-sm text-black/60" aria-live="polite">
            {message}
          </p>
        )}
      </div>
    </section>
  );
}
