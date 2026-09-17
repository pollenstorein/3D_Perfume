import { ArrowLeft } from "lucide-react";

type LegalProps = { onBack: () => void };
const shell = "min-h-screen bg-[#faf9f7] px-6 pb-24 pt-32 md:px-16 md:pb-32 md:pt-40";
const body = "whitespace-pre-line text-sm leading-8 text-black/60";
function LegalLayout({
  title,
  date,
  children,
  onBack,
}: LegalProps & { title: React.ReactNode; date: string; children: React.ReactNode }) {
  return (
    <section className={shell}>
      <div className="mx-auto max-w-screen-xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-16 inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] text-black/55"
        >
          <ArrowLeft size={14} />
          Back to shop
        </button>
        <div className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-20">
          <div>
            <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.45em] text-black/35">
              Legal
            </p>
            <h1 className="text-[clamp(2.5rem,6vw,5.5rem)] font-extrabold leading-[0.95] tracking-tight text-black">
              {title}
            </h1>
            <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.25em] text-black/35">
              Last updated: {date}
            </p>
          </div>
          <div className="max-w-2xl space-y-10 border-t border-black/15 pt-8 md:border-t-0 md:pt-0">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
function Blocks({ items }: { items: [string, string][] }) {
  return (
    <>
      {items.map(([heading, copy]) => (
        <div key={heading} className="border-t border-black/10 pt-6">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-black">
            {heading}
          </h2>
          <p className={body}>{copy}</p>
        </div>
      ))}
    </>
  );
}
export function TermsSection({ onBack }: LegalProps) {
  return (
    <LegalLayout
      title={
        <>
          Terms &<br />
          Conditions
        </>
      }
      date="2 September 2026"
      onBack={onBack}
    >
      <p className="text-lg leading-relaxed text-black/75">Welcome to POLLEN.</p>
      <p className="text-sm leading-relaxed text-black/60">
        These Terms & Conditions govern your use of the POLLEN website and your purchase of products
        through our website. By accessing our website or placing an order, you agree to these terms.
      </p>
      <Blocks
        items={[
          [
            "Products",
            "We make reasonable efforts to display our products, photographs, descriptions, colours, sizes, and other details as accurately as possible.\n\nHowever, the actual colour or appearance of a product may look slightly different depending on your screen, device, lighting conditions, or display settings.\n\nProduct availability may change without prior notice.",
          ],
          [
            "Pricing",
            "All prices are displayed in Indian Rupees (₹).\n\nThe price applicable to your purchase will be the price displayed at checkout when you place your order. Any applicable shipping charges will be shown before you complete the purchase.\n\nPOLLEN reserves the right to correct pricing, product information, or promotional errors on the website.",
          ],
          [
            "Orders",
            "After successfully placing an order, you will receive an order confirmation through the contact details provided during checkout.\n\nPlease make sure that your name, phone number, email address, and delivery address are correct before placing an order.\n\nPOLLEN reserves the right to cancel or refuse an order in situations including, but not limited to:\n\n- The product being unavailable\n- Incorrect pricing or product information\n- Incomplete or incorrect customer information\n- Suspected fraudulent or unauthorised activity\n- Duplicate or unusual orders\n- Other circumstances where fulfilment of the order is not reasonably possible\n\nIf your order is cancelled after payment has been received, the amount paid for the cancelled order will be refunded through the applicable payment method, subject to the payment provider's processing timelines.",
          ],
          [
            "Payment",
            "Payments are processed through our authorised payment gateway and available payment methods displayed at checkout.\n\nPOLLEN does not directly store your complete card, banking, or other sensitive payment credentials.",
          ],
          [
            "Delivery",
            "Orders are shipped to the delivery address provided during checkout.\n\nDelivery timelines may vary depending on your location, courier availability, weather, holidays, operational conditions, and other factors outside our control.\n\nOnce an order has been handed over to the courier, delays caused by the courier or circumstances beyond POLLEN's reasonable control may occur.\n\nPlease ensure that someone is available to receive the package at the provided address.",
          ],
        ]}
      />
    </LegalLayout>
  );
}
export function OrdersShippingSection({ onBack }: LegalProps) {
  return (
    <LegalLayout
      title={
        <>
          Orders &<br />
          Shipping
        </>
      }
      date="13.09.2026"
      onBack={onBack}
    >
      <p className="text-lg leading-relaxed text-black/75">
        Every POLLEN fragrance is priced at ₹399 for 50 ml.
      </p>
      <Blocks
        items={[
          [
            "Pricing",
            "All prices displayed on our website are in Indian Rupees (₹) and include applicable taxes unless stated otherwise.\n\nShipping charges, if applicable, will be displayed separately at checkout before you complete your purchase.\n\nThe final price payable by you will be the amount shown at checkout.\n\nPOLLEN reserves the right to change product prices, offers, discounts, or promotional pricing at any time. Any price change will not affect an order that has already been successfully placed and confirmed.",
          ],
          [
            "Disclaimer",
            "The information provided on the POLLEN website is intended for general informational and product-related purposes.",
          ],
          [
            "Fragrance descriptions",
            "Fragrance notes, descriptions, mood references, and product information are provided to help customers understand and choose our fragrances.\n\nFragrance perception can vary from person to person depending on individual body chemistry, skin type, environment, temperature, application method, and personal preference.\n\nTherefore, the actual fragrance experience may differ between individuals.\n\nDescriptions of fragrance notes or moods should not be understood as a guarantee of how a fragrance will smell on every person.",
          ],
          [
            "Product images",
            "We make reasonable efforts to display our products accurately.\n\nHowever, product colours and visual appearance may vary slightly depending on lighting, photography, screen settings, and the device used to view the website.",
          ],
          [
            "Product use",
            "POLLEN fragrances are intended for external use only.\n\nPlease use fragrance products according to the instructions provided on the product packaging.\n\nAvoid contact with the eyes and do not ingest the product. Keep fragrances away from children, heat, flames, and other sources of ignition.\n\nIf irritation or discomfort occurs, discontinue use.\n\nCustomers should review the product packaging and any applicable product-specific instructions before use.",
          ],
          [
            "Website information",
            "Although we make reasonable efforts to keep the information on our website accurate and up to date, we do not guarantee that every piece of information will always be complete, current, or error-free.\n\nProduct availability, pricing, descriptions, promotions, and other website information may change without prior notice.",
          ],
          [
            "Third-party services",
            "Our website may use third-party services such as payment gateways, courier services, analytics tools, hosting providers, and other technology services.\n\nPOLLEN is not responsible for interruptions, delays, errors, or issues caused by third-party services that are outside our reasonable control.",
          ],
          [
            "External links",
            "Our website may contain links to third-party websites or services.\n\nThese websites operate independently and may have their own terms, policies, and practices. POLLEN is not responsible for the content, availability, or policies of third-party websites.",
          ],
          [
            "Contact",
            "If you have any questions about the information provided on our website or about a POLLEN product, please contact us.\n\nEmail: contactpollen@gmail.com\nWhatsApp: +91 9609180954",
          ],
        ]}
      />
    </LegalLayout>
  );
}
export function PrivacyPolicySection({ onBack }: LegalProps) {
  return (
    <LegalLayout
      title={
        <>
          Privacy
          <br />
          Policy
        </>
      }
      date="3 September 2026"
      onBack={onBack}
    >
      <p className="text-lg leading-relaxed text-black/75">
        When you shop with POLLEN, we collect the information needed to process your order and get
        it to you.
      </p>
      <p className="text-sm leading-relaxed text-black/60">
        This may include your name, phone number, email address, billing address, delivery address
        and order details.
      </p>
      <Blocks
        items={[
          [
            "How we use your information",
            "1. Process and deliver your orders\n2. Send order and delivery updates\n3. Respond to your questions\n4. Process payments\n5. Improve our website and products\n6. Prevent fraud and misuse\n7. Send marketing messages when you've chosen to receive them",
          ],
          [
            "Sharing your information",
            "Some information needs to be shared with the people and services that help us run POLLEN.\n\nThis may include payment providers, courier partners, website providers and customer support services.\n\nWe only share information needed for these services.",
          ],
          [
            "Your information",
            "We take reasonable steps to keep your information safe.\n\nIf you have a question about your personal information or want to make a request about it, contact us at contactpollen@gmail.com.",
          ],
        ]}
      />
    </LegalLayout>
  );
}
export function RefundPolicySection({ onBack }: LegalProps) {
  return (
    <LegalLayout
      title={
        <>
          Return &<br />
          Refund
          <br />
          Policy
        </>
      }
      date="10.09.2026"
      onBack={onBack}
    >
      <Blocks
        items={[
          [
            "Damaged, defective or incorrect orders",
            "If your order arrives damaged, leaking, defective, or contains the wrong product, please contact us within 48 hours of delivery.\n\nYou may be required to provide:\n\n- Your order number\n- Photographs of the outer packaging\n- Photographs of the shipping label\n- Photographs or video showing the issue\n- An unboxing video, where available\n\nWe will review the information provided and determine the appropriate resolution in accordance with our Refund & Exchange Policy.",
          ],
          [
            "Fragrance products",
            "Fragrance products are personal-use products. For hygiene, safety, and product integrity reasons, products that have been opened, used, sprayed, or otherwise handled after delivery cannot ordinarily be returned or exchanged.",
          ],
          [
            "Intellectual Property",
            "All POLLEN photographs, designs, graphics, text, product names, logos, trademarks, packaging designs, and other website content are owned by POLLEN or used with appropriate permission.\n\nYou may not copy, reproduce, modify, distribute, publish, sell, or commercially use our content without prior written permission.",
          ],
          [
            "Changes to these Terms",
            "POLLEN may update these Terms & Conditions from time to time. Changes will be posted on this page and will apply from the date they are published.",
          ],
          [
            "For questions regarding these Terms & Conditions, contact us at:",
            "Email: contactpollen@gmail.com",
          ],
        ]}
      />
    </LegalLayout>
  );
}
export function CookiePolicySection({ onBack }: LegalProps) {
  return (
    <LegalLayout
      title={
        <>
          Cookie
          <br />
          Policy
        </>
      }
      date="10.09.26"
      onBack={onBack}
    >
      <p className="text-lg leading-relaxed text-black/75">
        POLLEN uses cookies and similar technologies to help our website function properly and to
        understand how visitors use our website.
      </p>
      <p className="text-sm leading-relaxed text-black/60">
        Cookies are small files that may be stored on your device when you visit a website.
      </p>
      <Blocks
        items={[
          [
            "How we use cookies",
            "We may use cookies for purposes including:\n\n- Keeping the website and shopping experience functional\n- Remembering items in your cart\n- Supporting checkout and payment-related functionality\n- Maintaining website security\n- Understanding website traffic and usage\n- Improving website performance and user experience\n- Measuring the effectiveness of advertising and marketing campaigns\n\nSome cookies may be essential for the website to function properly, while others help us understand how visitors interact with the website.",
          ],
          [
            "Third-party cookies",
            "Some third-party services used on our website may also place cookies or similar technologies on your device.\n\nThese may include services related to analytics, advertising, payment processing, website functionality, or other technology services.\n\nThese third parties may have their own privacy and cookie policies.",
          ],
          [
            "Managing cookies",
            "You can manage or disable cookies through your browser settings.\n\nPlease note that disabling certain cookies may affect the functionality of our website. Some features, including cart, checkout, or other essential functions, may not work correctly if certain cookies are disabled.",
          ],
          [
            "Changes to this Cookie Policy",
            "We may update this Cookie Policy from time to time. Any changes will be published on this page.",
          ],
          [
            "For questions about our use of cookies, please contact:",
            "Email: contactpollen@gmail.com",
          ],
        ]}
      />
    </LegalLayout>
  );
}
