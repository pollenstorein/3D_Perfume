import pollen1 from "./Images/1c.jpg";
import pollen2 from "./Images/2e.jpg";
import pollen3 from "./Images/3e.jpg";

export const NAV_ITEMS = [
  { label: "SHOP", href: "#" },
  { label: "GET YOUR BUNDLE", href: "/gift-set" },
  { label: "KNOW POLLEN", href: "#about" },
  { label: "TRACK ORDER", href: "#track" },
  { label: "BUY NOW", href: "#fragrances" },
];

export const FRAGRANCES = [
  {
    id: 1,
    name: "Power of You",
    tagline: "Bold. Fierce. Unapologetic.",
    description: "A commanding fragrance that asserts presence before you enter the room. Warm woods, dark musk, and a spark of citrus that lingers all day.",
    notes: ["Dark Musk", "Cedarwood", "Bergamot"],
    price: 499,
    img: pollen2,
  },
  {
    id: 2,
    name: "Lost Cherry",
    tagline: "Sweet. Seductive. Unforgettable.",
    description: "A rich cherry accord layered over Turkish rose and bitter almond. Deeply sensual, dangerously addictive.",
    notes: ["Black Cherry", "Turkish Rose", "Bitter Almond"],
    price: 499,
    img: pollen3,
  },
  {
    id: 3,
    name: "Fresh Orchid",
    tagline: "Light. Airy. Effortlessly refined.",
    description: "White orchid petals lifted on a breeze of green tea and white cedar. Purity distilled into a single breath.",
    notes: ["White Orchid", "Green Tea", "White Cedar"],
    price: 499,
    img: pollen1,
  },
];

export const AUTH_STORAGE_KEY = "know-pollen-user";
