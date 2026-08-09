import ProductGrid from "@/components/ProductGrid";
import { Reveal } from "@/components/Reveal";
import { getAllProducts } from "@/lib/products";

export default async function RelatedProducts({ currentProduct }) {
  const products = await getAllProducts();
  const related = products
    .filter(
      (product) =>
        product.category === currentProduct.category &&
        product._id !== currentProduct._id
    )
    .slice(0, 4);

  if (!related.length) return null;

  return (
    <section
      aria-label="Related products"
      className="mt-16 border-t border-ink/10 pt-12"
    >
      <Reveal>
        <h2 className="font-display text-2xl text-ink">You Might Also Like</h2>
        <p className="mt-1 text-sm text-neutral-600">
          More from {currentProduct.category}.
        </p>
      </Reveal>
      <div className="mt-6">
        <ProductGrid products={related} enablePriority={false} />
      </div>
    </section>
  );
}
