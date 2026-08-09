import { siteConfig } from "@/lib/siteConfig";
import SocialStrip from "@/components/SocialStrip";

export default function SocialSection() {
  return (
    <section className="bg-ink">
      <div className="mx-auto max-w-6xl px-6 py-12 text-center">
        <h2 className="font-display text-xl text-paper sm:text-2xl">
          Follow {siteConfig.name}
        </h2>
        <p className="mt-2 text-sm text-paper/75">
          New arrivals, restocks &amp; behind-the-scenes — follow along online
          for the latest drops.
        </p>
        <SocialStrip className="mt-5 justify-center" />
      </div>
    </section>
  );
}
