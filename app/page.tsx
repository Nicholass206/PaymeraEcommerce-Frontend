"use client";

import Link from "next/link";
import useSWR from "swr";
import { ArrowRight, Shield, Zap, CreditCard, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/products/product-grid";
import { api } from "@/services/api";
import { useAuth } from "@/contexts/auth-context";

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  const { data, isLoading } = useSWR(
    isAuthenticated ? "/products?featured" : null,
    () => api.getProducts(1)
  );

  const featuredProducts = data?.data?.slice(0, 4) ?? [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-1/4 top-0 h-96 w-96 rounded-full bg-[#00e06a]/10 blur-3xl" />
          <div className="absolute -right-1/4 bottom-0 h-96 w-96 rounded-full bg-[#00e06a]/5 blur-3xl" />
        </div>
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#00e06a]/30 bg-[#00e06a]/10 px-4 py-2 text-sm text-[#00e06a]">
              <Zap className="h-4 w-4" />
              <span>Fast & Secure Payments</span>
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white lg:text-6xl">
              <span className="text-balance">The Future of</span>{" "}
              <span className="bg-gradient-to-r from-[#00e06a] to-emerald-400 bg-clip-text text-transparent">
                E-Payments
              </span>
            </h1>
            <p className="mb-8 text-lg text-gray-400 lg:text-xl">
              Experience seamless shopping with Paymera. Browse products, manage
              your cart, and pay securely — all in one modern platform.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-[#00e06a] text-[#181C32] hover:bg-[#00e06a]/90"
                >
                  Browse Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              {!isAuthenticated && (
                <Link href="/register">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Create Account
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-y border-white/10 bg-[#1E2344]/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="group rounded-xl border border-white/10 bg-[#1E2344] p-6 transition-all hover:border-[#00e06a]/50">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#00e06a]/10 text-[#00e06a] transition-colors group-hover:bg-[#00e06a] group-hover:text-[#181C32]">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-semibold text-white">Secure Payments</h3>
              <p className="text-sm text-gray-400">
                Bank-level encryption protects every transaction you make.
              </p>
            </div>
            <div className="group rounded-xl border border-white/10 bg-[#1E2344] p-6 transition-all hover:border-[#00e06a]/50">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#00e06a]/10 text-[#00e06a] transition-colors group-hover:bg-[#00e06a] group-hover:text-[#181C32]">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-semibold text-white">Lightning Fast</h3>
              <p className="text-sm text-gray-400">
                Process payments in seconds with our optimized infrastructure.
              </p>
            </div>
            <div className="group rounded-xl border border-white/10 bg-[#1E2344] p-6 transition-all hover:border-[#00e06a]/50">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#00e06a]/10 text-[#00e06a] transition-colors group-hover:bg-[#00e06a] group-hover:text-[#181C32]">
                <CreditCard className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-semibold text-white">Multiple Options</h3>
              <p className="text-sm text-gray-400">
                Accept all major credit cards and payment methods.
              </p>
            </div>
            <div className="group rounded-xl border border-white/10 bg-[#1E2344] p-6 transition-all hover:border-[#00e06a]/50">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#00e06a]/10 text-[#00e06a] transition-colors group-hover:bg-[#00e06a] group-hover:text-[#181C32]">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-semibold text-white">Global Reach</h3>
              <p className="text-sm text-gray-400">
                Shop and sell anywhere in the world with ease.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {isAuthenticated && (
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-10 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white lg:text-3xl">
                  Featured Products
                </h2>
                <p className="mt-2 text-gray-400">
                  Discover our top picks for you
                </p>
              </div>
              <Link href="/products">
                <Button
                  variant="ghost"
                  className="text-[#00e06a] hover:bg-[#00e06a]/10 hover:text-[#00e06a]"
                >
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <ProductGrid products={featuredProducts} isLoading={isLoading} />
          </div>
        </section>
      )}

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#1E2344] to-[#252A4A] p-8 lg:p-16">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#00e06a]/10 blur-3xl" />
              <div className="relative mx-auto max-w-2xl text-center">
                <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
                  Ready to Get Started?
                </h2>
                <p className="mb-8 text-gray-400">
                  Join thousands of satisfied customers who trust Paymera for
                  their online shopping needs.
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link href="/register">
                    <Button
                      size="lg"
                      className="bg-[#00e06a] text-[#181C32] hover:bg-[#00e06a]/90"
                    >
                      Create Free Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button
                      size="lg"
                      variant="ghost"
                      className="text-white hover:bg-white/10"
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
