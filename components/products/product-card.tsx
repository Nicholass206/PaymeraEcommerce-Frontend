"use client";

import Link from "next/link";
import { ShoppingCart, Package } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!isAuthenticated) return;
    setIsAdding(true);
    try {
      await addItem(product.id, 1);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const price = parseFloat(product.price);

  return (
    <Card className="group overflow-hidden rounded-2xl border-white/10 bg-[#1E2344]/90 transition-all duration-300 hover:-translate-y-1 hover:border-[#00e06a]/50 hover:shadow-xl hover:shadow-[#00e06a]/10">
      <div className="relative aspect-square overflow-hidden bg-linear-to-b from-[#252A4A] to-[#181C32]">
        <div className="flex h-full items-center justify-center">
          <Package className="h-20 w-20 text-gray-500 transition-transform duration-300 group-hover:scale-110" />
        </div>
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute right-2 top-2 rounded-full bg-orange-500/90 px-2 py-1 text-xs font-medium text-white">
            Low Stock
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute right-2 top-2 rounded-full bg-red-500/90 px-2 py-1 text-xs font-medium text-white">
            Out of Stock
          </span>
        )}
      </div>
      <CardContent className="p-5">
        <Link href={`/products/${product.id}`}>
          <h3 className="mb-1 line-clamp-1 text-lg font-semibold text-white transition-colors hover:text-[#00e06a]">
            {product.name}
          </h3>
        </Link>
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-400">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-[#00e06a]">
            ${price.toFixed(2)}
          </span>
          {isAuthenticated ? (
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={isAdding || product.stock === 0}
              className="bg-[#00e06a] text-[#181C32] hover:bg-[#00e06a]/90 disabled:opacity-50"
            >
              <ShoppingCart className="mr-1 h-4 w-4" />
              {isAdding ? "Adding..." : "Add"}
            </Button>
          ) : (
            <Link href="/login">
              <Button
                size="sm"
                className="bg-[#00e06a] text-[#181C32] hover:bg-[#00e06a]/90"
              >
                Sign in to Buy
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
