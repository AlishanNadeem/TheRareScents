import ProductCard from "@/components/ProductCard";

export default function ProductGrid({ products, enablePriority = true }) {
  if (!products?.length) {
    return (
      <p className="py-12 text-center text-neutral-500">No products found.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard
          key={product._id}
          product={product}
          priority={enablePriority && index < 4}
        />
      ))}
    </div>
  );
}
