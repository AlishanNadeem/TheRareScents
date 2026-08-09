import AnnouncementStrip from "@/components/AnnouncementStrip";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import BrandStory from "@/components/BrandStory";
import CategoryHighlights from "@/components/CategoryHighlights";
import TrustStrip from "@/components/TrustStrip";
import Testimonials from "@/components/Testimonials";
import FAQSection from "@/components/FAQSection";
import SocialSection from "@/components/SocialSection";
import { faqPageJsonLd } from "@/lib/faq";
import { buildMetadata, organizationJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";

export const metadata = buildMetadata({
  title: `${siteConfig.name} | Buy Original Perfumes Online in Pakistan`,
  description: `Shop original perfumes, oud & attars online in ${siteConfig.country}. ${siteConfig.name} curates rare oils and exclusive blends, delivered from ${siteConfig.primaryCity} nationwide.`,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd()),
        }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqPageJsonLd()),
        }}
      />
      <AnnouncementStrip />
      <Hero />
      <FeaturedProducts />
      <BrandStory />
      <CategoryHighlights />
      <TrustStrip />
      <Testimonials />
      <FAQSection />
      <SocialSection />
    </>
  );
}
