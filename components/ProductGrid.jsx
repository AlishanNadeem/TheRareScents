"use client";

import ProductCard from "@/components/ProductCard";
import { Stagger, StaggerItem } from "@/components/Reveal";

export default function ProductGrid({ products, enablePriority = true }) {
  if (!products?.length) {
    return (
      <p className="py-12 text-center text-neutral-500">No products found.</p>
    );
  }

  return (
    <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product, index) => (
        <StaggerItem key={product._id}>
          <ProductCard
            product={product}
            priority={enablePriority && index < 4}
          />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
