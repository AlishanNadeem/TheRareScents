import { notFound } from "next/navigation";
import CategoryLanding from "@/components/CategoryLanding";
import {
  CATEGORY_SLUGS,
  getCategoryPage,
} from "@/lib/categoryPages";
import { getProductsByCategory } from "@/lib/products";
import { faqPageJsonLd } from "@/lib/faq";
import {
  breadcrumbJsonLd,
  buildMetadata,
  collectionPageJsonLd,
} from "@/lib/seo";

export const revalidate = 60;

export function generateStaticParams() {
  return CATEGORY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const page = getCategoryPage(params.slug);

  if (!page) {
    return buildMetadata({
      title: "Category Not Found",
      description: "This fragrance category could not be found.",
      path: `/category/${params.slug}`,
    });
  }

  return buildMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: page.path,
  });
}

export default async function CategorySlugPage({ params }) {
  const page = getCategoryPage(params.slug);

  if (!page) {
    notFound();
  }

  const products = await getProductsByCategory(page.productCategory);

  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: page.label, path: page.path },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            collectionPageJsonLd({
              name: page.h1,
              description: page.metaDescription,
              path: page.path,
              products,
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbLd),
        }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqPageJsonLd(page.faqs)),
        }}
      />
      <CategoryLanding page={page} products={products} />
    </>
  );
}
