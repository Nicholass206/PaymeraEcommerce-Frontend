"use client";

import { createContext, useContext, type ReactNode } from "react";
import useSWR from "swr";
import { api } from "@/services/api";
import type { Cart, CartItem } from "@/types";
import { useAuth } from "./auth-context";

interface CartContextType {
  cart: Cart | null;
  items: CartItem[];
  itemCount: number;
  isLoading: boolean;
  error: Error | null;
  addItem: (productId: number, quantity: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  const {
    data: cartData,
    error,
    isLoading,
    mutate,
  } = useSWR(
    isAuthenticated ? "/cart" : null,
    () => api.getCart(),
    {
      revalidateOnFocus: false,
    }
  );

  const cart = cartData?.data ?? null;
  const items = cart?.items ?? [];
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const addItem = async (productId: number, quantity: number) => {
    const response = await api.addToCart(productId, quantity);
    mutate({ data: response.cart }, false);
  };

  const updateItem = async (itemId: number, quantity: number) => {
    const response = await api.updateCartItem(itemId, quantity);
    mutate({ data: response.cart }, false);
  };

  const removeItem = async (itemId: number) => {
    const response = await api.removeFromCart(itemId);
    mutate({ data: response.cart }, false);
  };

  const refreshCart = async () => {
    await mutate();
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        items,
        itemCount,
        isLoading,
        error: error as Error | null,
        addItem,
        updateItem,
        removeItem,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
