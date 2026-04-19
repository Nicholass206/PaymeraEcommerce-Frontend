"use client";

import { use, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShoppingCart,
  Minus,
  Plus,
  Package,
  Check,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/services/api";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const productId = parseInt(resolvedParams.id);

  const { data, isLoading, error } = useSWR(
    isAuthenticated && productId ? `/products/${productId}` : null,
    () => api.getProduct(productId)
  );

  const product = data?.data;

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAdding(true);
    try {
      await addItem(product.id, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold text-white">
            Sign in to View Product
          </h1>
          <p className="mb-8 text-gray-400">
            Please log in to view product details and make purchases.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/login">
              <Button className="bg-[#00e06a] text-[#181C32] hover:bg-[#00e06a]/90">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <Skeleton className="mb-8 h-10 w-32 bg-[#1E2344]" />
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-2xl bg-[#1E2344]" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4 bg-[#1E2344]" />
            <Skeleton className="h-6 w-full bg-[#1E2344]" />
            <Skeleton className="h-6 w-2/3 bg-[#1E2344]" />
            <Skeleton className="h-12 w-32 bg-[#1E2344]" />
            <Skeleton className="h-12 w-full bg-[#1E2344]" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
        <AlertCircle className="mb-4 h-16 w-16 text-red-400" />
        <h1 className="mb-2 text-2xl font-bold text-white">Product Not Found</h1>
        <p className="mb-8 text-gray-400">
          The product you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link href="/products">
          <Button className="bg-[#00e06a] text-[#181C32] hover:bg-[#00e06a]/90">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  const price = parseFloat(product.price);
  const total = price * quantity;
  const inStock = product.stock > 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-8 inline-flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Product Image */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1E2344]">
          <div className="flex aspect-square items-center justify-center bg-[#252A4A]">
            <Package className="h-32 w-32 text-gray-500" />
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
            {product.name}
          </h1>

          <p className="mb-6 text-lg text-gray-400">{product.description}</p>

          {/* Stock Status */}
          <div className="mb-6">
            {inStock ? (
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${
                    lowStock
                      ? "bg-orange-500/10 text-orange-400"
                      : "bg-[#00e06a]/10 text-[#00e06a]"
                  }`}
                >
                  <Check className="h-4 w-4" />
                  {lowStock ? `Only ${product.stock} left` : "In Stock"}
                </span>
              </div>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-3 py-1 text-sm font-medium text-red-400">
                <AlertCircle className="h-4 w-4" />
                Out of Stock
              </span>
            )}
          </div>

          {/* Price */}
          <div className="mb-8">
            <span className="text-4xl font-bold text-[#00e06a]">
              ${price.toFixed(2)}
            </span>
          </div>

          {/* Quantity Selector */}
          {inStock && (
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-400">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-lg border border-white/10 bg-[#1E2344]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-gray-400 transition-colors hover:text-white disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center text-lg font-medium text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    className="px-4 py-3 text-gray-400 transition-colors hover:text-white disabled:opacity-50"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-lg font-semibold text-white">
                  Total: ${total.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <Button
            size="lg"
            onClick={handleAddToCart}
            disabled={!inStock || isAdding}
            className={`w-full transition-all ${
              addedToCart
                ? "bg-[#00e06a] text-[#181C32]"
                : "bg-[#00e06a] text-[#181C32] hover:bg-[#00e06a]/90"
            } disabled:opacity-50`}
          >
            {addedToCart ? (
              <>
                <Check className="mr-2 h-5 w-5" />
                Added to Cart!
              </>
            ) : isAdding ? (
              "Adding..."
            ) : (
              <>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </>
            )}
          </Button>

          {/* Continue Shopping */}
          <Link href="/products">
            <Button
              variant="ghost"
              className="mt-4 w-full text-gray-400 hover:bg-white/5 hover:text-white"
            >
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
