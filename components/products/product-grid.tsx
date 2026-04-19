"use client";

import { ProductCard } from "./product-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-white/10 bg-[#1E2344]">
            <Skeleton className="aspect-square w-full bg-[#252A4A]" />
            <div className="p-4">
              <Skeleton className="mb-2 h-6 w-3/4 bg-[#252A4A]" />
              <Skeleton className="mb-3 h-4 w-full bg-[#252A4A]" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-20 bg-[#252A4A]" />
                <Skeleton className="h-8 w-16 bg-[#252A4A]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 rounded-full bg-[#1E2344] p-6">
          <svg
            className="h-12 w-12 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-white">No products found</h3>
        <p className="text-gray-400">Check back later for new products.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
