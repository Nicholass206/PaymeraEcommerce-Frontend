"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/services/api";
import { useCart } from "@/contexts/cart-context";

type PaymentStatus = "loading" | "success" | "failed";

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const { refreshCart } = useCart();
  const [status, setStatus] = useState<PaymentStatus>("loading");
  const [paymentDetails, setPaymentDetails] = useState<{
    amount?: string;
    notes?: string;
    rrn?: string | null;
  } | null>(null);

  useEffect(() => {
    const sleep = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const checkPaymentStatus = async () => {
      // Get payment ID from URL params or localStorage
      const paymentId =
        searchParams.get("paymentId") ||
        searchParams.get("payment_id") ||
        searchParams.get("PaymentId") ||
        searchParams.get("id") ||
        searchParams.get("pid") ||
        localStorage.getItem("paymera_payment_id");

      if (!paymentId) {
        setStatus("failed");
        return;
      }

      try {
        // Payment providers can be briefly delayed before reporting final success.
        for (let attempt = 0; attempt < 4; attempt++) {
          const response = await api.getPaymentStatus(paymentId);

          if (response.ErrorCode === 0) {
            const paymentStatus = String(response.Data?.status ?? "")
              .trim()
              .toUpperCase();
            setPaymentDetails({
              amount: response.Data?.amount,
              notes: response.Data?.notes,
              rrn: response.Data?.rrn,
            });

            if (
              ["S", "SUCCESS", "SUCCEEDED", "COMPLETED", "PAID"].includes(
                paymentStatus
              )
            ) {
              setStatus("success");
              await refreshCart();
              localStorage.removeItem("paymera_payment_id");
              return;
            }
          }

          if (attempt < 3) {
            await sleep(1500);
          }
        }

        setStatus("failed");
        localStorage.removeItem("paymera_payment_id");
      } catch (error) {
        console.error("Failed to check payment status:", error);
        setStatus("failed");
        localStorage.removeItem("paymera_payment_id");
      }
    };

    checkPaymentStatus();
  }, [searchParams, refreshCart]);

  return (
    <Card className="w-full max-w-md border-white/10 bg-[#1E2344]">
      <CardContent className="p-8 text-center">
        {status === "loading" && (
          <>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#252A4A]">
              <Loader2 className="h-10 w-10 animate-spin text-[#00e06a]" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-white">
              Processing Payment
            </h1>
            <p className="text-gray-400">
              Please wait while we verify your payment...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#00e06a]/20">
              <CheckCircle className="h-10 w-10 text-[#00e06a]" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-white">
              Payment Successful!
            </h1>
            <p className="mb-6 text-gray-400">
              Thank you for your purchase. Your order has been confirmed.
            </p>
            {paymentDetails && (
              <div className="mb-6 rounded-lg bg-[#252A4A] p-4 text-left">
                <div className="mb-2 flex justify-between">
                  <span className="text-gray-400">Amount</span>
                  <span className="font-semibold text-[#00e06a]">
                    ${parseFloat(paymentDetails.amount || "0").toFixed(2)}
                  </span>
                </div>
                {paymentDetails.rrn && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Reference</span>
                    <span className="text-white">{paymentDetails.rrn}</span>
                  </div>
                )}
              </div>
            )}
            <Link href="/products">
              <Button className="w-full bg-[#00e06a] text-[#181C32] hover:bg-[#00e06a]/90">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </>
        )}

        {status === "failed" && (
          <>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20">
              <XCircle className="h-10 w-10 text-red-400" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-white">
              Payment Failed
            </h1>
            <p className="mb-6 text-gray-400">
              We couldn&apos;t process your payment. Please try again.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/cart">
                <Button className="w-full bg-[#00e06a] text-[#181C32] hover:bg-[#00e06a]/90">
                  Return to Cart
                </Button>
              </Link>
              <Link href="/">
                <Button
                  variant="ghost"
                  className="w-full text-gray-400 hover:bg-white/5 hover:text-white"
                >
                  Return Home
                </Button>
              </Link>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function LoadingFallback() {
  return (
    <Card className="w-full max-w-md border-white/10 bg-[#1E2344]">
      <CardContent className="p-8 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#252A4A]">
          <Loader2 className="h-10 w-10 animate-spin text-[#00e06a]" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-white">Loading...</h1>
        <p className="text-gray-400">Please wait...</p>
      </CardContent>
    </Card>
  );
}

export default function PaymentCallbackPage() {
  return (
    <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4 py-16">
      <Suspense fallback={<LoadingFallback />}>
        <PaymentCallbackContent />
      </Suspense>
    </div>
  );
}
