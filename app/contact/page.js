import OrderForm from "@/components/OrderForm";
import { Reveal } from "@/components/Reveal";
import { siteConfig } from "@/lib/siteConfig";
import { buildMetadata, organizationJsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact Us — Order Perfumes via WhatsApp in Pakistan",
  description: `Contact ${siteConfig.name} to order original perfumes, oud & attars online in ${siteConfig.country}. WhatsApp ordering with delivery to ${siteConfig.primaryCity}, Lahore, Islamabad & nationwide.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <section className="bg-paper">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd()),
        }}
      />

      <div className="mx-auto max-w-6xl px-6 py-14 sm:py-16">
        <Reveal>
          <header className="text-center">
            <h1 className="font-display text-3xl text-ink sm:text-4xl">
              Contact {siteConfig.name}
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-neutral-600">
              We&apos;re an online store — order via WhatsApp or the form below,
              and we&apos;ll get back to you shortly. No showroom, no fixed
              hours — just message us any time.
            </p>
          </header>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <Reveal className="space-y-8">
            <div className="rounded-xl border border-ink/10 bg-white p-6 transition duration-300 ease-out hover:shadow-md">
              <h2 className="font-display text-lg text-ink">Get In Touch</h2>

              <div className="mt-4 space-y-3 text-sm text-neutral-700">
                <p>
                  <a
                    href={siteConfig.whatsapp.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors duration-300 hover:text-ink hover:underline"
                  >
                    WhatsApp / Phone: {siteConfig.whatsapp.display}
                  </a>
                </p>
                <p>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="transition-colors duration-300 hover:text-ink hover:underline"
                  >
                    {siteConfig.email}
                  </a>
                </p>
              </div>

              <a
                href={siteConfig.whatsapp.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-gold px-8 py-3 text-sm font-semibold uppercase tracking-wide text-espresso shadow-sm transition duration-300 ease-out hover:scale-[1.03] hover:bg-[#d4af5a] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Chat on WhatsApp
              </a>
            </div>

            <div className="rounded-xl border border-ink/10 bg-white p-6 transition duration-300 ease-out hover:shadow-md">
              <h2 className="font-display text-lg text-ink">
                Delivery Across Pakistan
              </h2>
              <p className="mt-2 text-sm text-neutral-600">
                We&apos;re online-only, so every order ships straight to your
                door. Cash on Delivery is available nationwide, including:
              </p>
              <ul className="mt-4 flex flex-wrap gap-2 text-sm text-neutral-700">
                {siteConfig.cities.map((city) => (
                  <li
                    key={city}
                    className="rounded-full border border-ink/15 bg-ink/5 px-3 py-1"
                  >
                    {city}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-neutral-500">
                &amp; nationwide across {siteConfig.country}.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <OrderForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
