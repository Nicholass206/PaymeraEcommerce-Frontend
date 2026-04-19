"use client";

import { Minus, Plus, Trash2, Package } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import type { CartItem as CartItemType } from "@/types";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateItem, removeItem } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    setIsUpdating(true);
    try {
      await updateItem(item.id, newQuantity);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      await removeItem(item.id);
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const price = item.product ? parseFloat(item.product.price) : 0;
  const total = price * item.quantity;

  return (
    <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#1E2344] p-4 transition-all hover:border-white/20">
      {/* Product Image Placeholder */}
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-[#252A4A]">
        <Package className="h-10 w-10 text-gray-500" />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="truncate text-base font-semibold text-white">
          {item.product?.name || `Product #${item.product_id}`}
        </h3>
        <p className="text-sm text-gray-400">
          ${price.toFixed(2)} each
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={isUpdating || item.quantity <= 1}
          className="h-8 w-8 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white disabled:opacity-50"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center text-sm font-medium text-white">
          {item.quantity}
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={isUpdating}
          className="h-8 w-8 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Total */}
      <div className="w-24 text-right">
        <span className="text-lg font-bold text-[#00e06a]">
          ${total.toFixed(2)}
        </span>
      </div>

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleRemove}
        disabled={isUpdating}
        className="h-8 w-8 text-gray-400 hover:bg-red-500/20 hover:text-red-400 disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
