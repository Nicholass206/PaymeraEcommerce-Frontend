"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Shield, Loader2, X } from "lucide-react";
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
  const [isIframeOpen, setIsIframeOpen] = useState(false);
  const [isIframeLoading, setIsIframeLoading] = useState(false);
  const [gatewayUrl, setGatewayUrl] = useState<string | null>(null);
  const [activePaymentId, setActivePaymentId] = useState<string | null>(null);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollingInFlightRef = useRef(false);

  const subtotal = items.reduce((sum, item) => {
    const price = item.product ? parseFloat(item.product.price) : 0;
    return sum + price * item.quantity;
  }, 0);

  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const closeIframeCheckout = () => {
    setIsIframeOpen(false);
    setIsIframeLoading(false);
    setGatewayUrl(null);
  };

  useEffect(() => {
    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isIframeOpen || !activePaymentId) {
      return;
    }

    const successStatuses = ["S", "SUCCESS", "SUCCEEDED", "COMPLETED", "PAID"];
    const pendingStatuses = ["P", "PENDING", "PROCESSING", "IN_PROGRESS"];

    const checkStatus = async () => {
      if (pollingInFlightRef.current) return;
      pollingInFlightRef.current = true;

      try {
        const response = await api.getPaymentStatus(activePaymentId);
        if (response.ErrorCode !== 0) return;

        const status = String(response.Data?.status ?? "").trim().toUpperCase();

        if (successStatuses.includes(status)) {
          if (pollTimerRef.current) clearInterval(pollTimerRef.current);
          localStorage.removeItem("paymera_payment_id");
          closeIframeCheckout();
          router.push(
            `/payment/callback?paymentId=${encodeURIComponent(activePaymentId)}`
          );
          return;
        }

        if (!pendingStatuses.includes(status)) {
          if (pollTimerRef.current) clearInterval(pollTimerRef.current);
          localStorage.removeItem("paymera_payment_id");
          closeIframeCheckout();
          router.push(
            `/payment/callback?paymentId=${encodeURIComponent(activePaymentId)}`
          );
        }
      } catch {
        // Keep polling; temporary network issues should not fail checkout immediately.
      } finally {
        pollingInFlightRef.current = false;
      }
    };

    checkStatus();
    pollTimerRef.current = setInterval(checkStatus, 2000);

    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
      }
    };
  }, [isIframeOpen, activePaymentId, router]);

  const handleCheckout = async () => {
    setIsProcessing(true);
    setError(null);
    setIsIframeLoading(true);

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
        setActivePaymentId(response.Data.paymentId);
        setGatewayUrl(response.Data.url);
        setIsIframeOpen(true);
      } else {
        setIsIframeLoading(false);
        setError(response.ErrorMessage || "Failed to create payment");
      }
    } catch (err) {
      setIsIframeLoading(false);
      setError(err instanceof Error ? err.message : "Failed to process payment");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenInNewTab = () => {
    if (!gatewayUrl) return;
    window.open(gatewayUrl, "_blank", "noopener,noreferrer");
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

      {isIframeOpen && gatewayUrl && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#181C32] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div>
                <h3 className="text-sm font-semibold text-white">Secure Checkout</h3>
                <p className="text-xs text-gray-400">
                  Complete payment below. We will update status automatically.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={handleOpenInNewTab}
                >
                  Open in New Tab
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-300 hover:bg-white/10 hover:text-white"
                  onClick={closeIframeCheckout}
                  aria-label="Close checkout"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="relative h-[75vh] min-h-[520px] w-full bg-[#11162b]">
              {(isIframeLoading || isProcessing) && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#11162b]/80">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Loader2 className="h-4 w-4 animate-spin text-[#00e06a]" />
                    Loading secure payment...
                  </div>
                </div>
              )}
              <iframe
                src={gatewayUrl}
                title="Paymera Checkout"
                className="h-full w-full border-0"
                allow="payment *"
                onLoad={() => setIsIframeLoading(false)}
              />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
