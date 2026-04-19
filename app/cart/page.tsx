"use client";

import Link from "next/link";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";

export default function CartPage() {
  const { items, isLoading } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
        <div className="text-center">
          <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-gray-500" />
          <h1 className="mb-4 text-3xl font-bold text-white">
            Sign in to View Cart
          </h1>
          <p className="mb-8 text-gray-400">
            Please log in to view your shopping cart and checkout.
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
        <Skeleton className="mb-8 h-10 w-48 bg-[#1E2344]" />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-xl bg-[#1E2344]" />
            ))}
          </div>
          <Skeleton className="h-80 w-full rounded-xl bg-[#1E2344]" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#1E2344]">
            <ShoppingBag className="h-12 w-12 text-gray-500" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-white">
            Your Cart is Empty
          </h1>
          <p className="mb-8 text-gray-400">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Link href="/products">
            <Button className="bg-[#00e06a] text-[#181C32] hover:bg-[#00e06a]/90">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Shopping Cart</h1>
          <p className="mt-1 text-gray-400">
            {items.length} {items.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>
        <Link href="/products">
          <Button
            variant="ghost"
            className="text-gray-400 hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>
        </Link>
      </div>

      {/* Cart Content */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Cart Summary */}
        <div>
          <CartSummary items={items} />
        </div>
      </div>
    </div>
  );
}
