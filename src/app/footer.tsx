import { Facebook, Instagram, Mail, MessageCircle } from "lucide-react";

type FooterProps = {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenRefund: () => void;
  onOpenCookies: () => void;
  onOpenOrdersShipping?: () => void;
};

const policyLinks = [
  "Privacy Policy",
  "Terms & Conditions",
  "Orders & Shipping",
  "Cookie Policy",
  "Return & Refund Policy",
];

export function Footer({
  onOpenPrivacy,
  onOpenTerms,
  onOpenRefund,
  onOpenCookies,
  onOpenOrdersShipping = () => {},
}: FooterProps) {
  const trigger = (callback: () => void, policy: string) => () => {
    callback();
    window.dispatchEvent(new CustomEvent("open-policy", { detail: policy }));
  };
  const handlers: Record<string, () => void> = {
    "Privacy Policy": trigger(onOpenPrivacy, "privacy"),
    "Terms & Conditions": trigger(onOpenTerms, "terms"),
    "Orders & Shipping": trigger(onOpenOrdersShipping, "orders"),
    "Return & Refund Policy": trigger(onOpenRefund, "refund"),
    "Cookie Policy": trigger(onOpenCookies, "cookies"),
  };

  return (
    <footer className="border-t border-[#e8e8e8] bg-white">
      <div className="mx-auto max-w-screen-xl px-6 py-16 md:px-16 md:py-20">
        <div className="mb-16 grid grid-cols-2 gap-10 md:grid-cols-[2fr_1fr_1.5fr_1.5fr] md:gap-12">
          <div className="col-span-2 md:col-span-1">
            <p className="mb-4 text-base font-extrabold uppercase tracking-[0.3em]">Know Pollen</p>
            <p className="mb-6 max-w-[200px] text-xs leading-relaxed text-black/45">
              Fragrances for those who know who they are - and are unafraid to say it.
            </p>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/_pollen.co" target="_blank" rel="noreferrer" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center border border-black/15 text-black/50">
                <Instagram size={14} />
              </a>
              <a href="https://www.facebook.com/share/1EKwnHM4Ya/" target="_blank" rel="noreferrer" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center border border-black/15 text-black/50">
                <Facebook size={14} />
              </a>
            </div>
          </div>
          <div>
            <p className="mb-5 text-[9px] font-bold uppercase tracking-[0.4em] text-black/35">Fragrances</p>
            <div className="space-y-3">
              {["Power of You", "Lost Cherry", "Fresh Orchid"].map((name) => (
                <a key={name} href="#fragrances" className="block text-xs font-medium text-black/60">{name}</a>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-5 text-[9px] font-bold uppercase tracking-[0.4em] text-black/35">Company</p>
            <a href="#about" className="text-xs font-medium text-black/60">Know Pollen</a>
            <p className="mb-5 mt-8 text-[9px] font-bold uppercase tracking-[0.4em] text-black/35">Policy</p>
            <div className="space-y-3">
              {policyLinks.map((label) => (
                <button key={label} type="button" onClick={handlers[label]} className="block text-left text-xs font-medium text-black/60">
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-5 text-[9px] font-bold uppercase tracking-[0.4em] text-black/35">Contact Us</p>
            <div className="space-y-4">
              <a href="mailto:contactpollen@gmail.com" className="flex items-start gap-3 text-xs font-medium text-black/60">
                <Mail size={13} />
                <span>contactpollen@gmail.com</span>
              </a>
              <a href="https://wa.me/919609180954" target="_blank" rel="noreferrer" className="flex items-start gap-3 text-xs font-medium text-black/60">
                <MessageCircle size={13} />
                <span>+91 96091 80954</span>
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start justify-between gap-4 border-t border-[#e8e8e8] pt-8 md:flex-row md:items-center">
          <p className="text-[10px] tracking-wide text-black/30">© 2026 Pollen. All rights reserved.</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-black/25">Crafted in India</p>
        </div>
      </div>
    </footer>
  );
}