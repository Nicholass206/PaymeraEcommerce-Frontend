"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/services/api";
import type { CartItem } from "@/types";

interface CartSummaryProps {
  items: CartItem[];
}

export function CartSummary({ items }: CartSummaryProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = items.reduce((sum, item) => {
    const price = item.product ? parseFloat(item.product.price) : 0;
    return sum + price * item.quantity;
  }, 0);

  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const handleCheckout = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await api.createPayment({
        lang: "en",
        amount: Math.round(total * 100), // Convert to cents
        callbackURL: `${window.location.origin}/payment/callback`,
        triggerURL: `${window.location.origin}/payment/trigger`,
        notes: `Order with ${items.length} item(s)`,
      });

      if (response.ErrorCode === 0 && response.Data?.url) {
        // Store payment ID for status check
        localStorage.setItem("paymera_payment_id", response.Data.paymentId);
        // Redirect to payment gateway
        window.location.href = response.Data.url;
      } else {
        setError(response.ErrorMessage || "Failed to create payment");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process payment");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="sticky top-24 border-white/10 bg-[#1E2344]">
      <CardHeader className="border-b border-white/10">
        <CardTitle className="text-white">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Subtotal</span>
            <span className="text-white">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Tax (10%)</span>
            <span className="text-white">${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Shipping</span>
            <span className="text-[#00e06a]">Free</span>
          </div>
          <div className="border-t border-white/10 pt-4">
            <div className="flex justify-between">
              <span className="text-lg font-semibold text-white">Total</span>
              <span className="text-xl font-bold text-[#00e06a]">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <Button
            onClick={handleCheckout}
            disabled={isProcessing || items.length === 0}
            className="w-full bg-[#00e06a] text-[#181C32] hover:bg-[#00e06a]/90 disabled:opacity-50"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Proceed to Checkout
              </>
            )}
          </Button>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <Shield className="h-4 w-4" />
            <span>Secure payment powered by Paymera</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
