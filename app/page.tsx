"use client";

import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import {
  ArrowRight,
  Shield,
  Zap,
  CreditCard,
  Globe,
  ShoppingBag,
  Star,
  BadgeCheck,
} from "lucide-react";
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
    <div className="min-h-screen bg-[#181C32]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-10 lg:py-14">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-24 -top-20 h-80 w-80 rounded-full bg-[#00e06a]/15 blur-3xl" />
          <div className="absolute right-0 top-16 h-72 w-72 rounded-full bg-[#00e06a]/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-6xl rounded-[32px] border border-white/10 bg-[#1E2344]/80 p-6 shadow-[0_45px_90px_-45px_rgba(0,0,0,0.9)] backdrop-blur sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#00e06a]/30 bg-[#00e06a]/10 px-4 py-1.5 text-xs font-semibold text-[#00e06a]">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Trusted by 5k+ shoppers
                </div>

                <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Elegant Shopping.
                  <span className="block text-[#00e06a]">Secure Paymera Checkout.</span>
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-300">
                  Discover curated products and complete purchases with a fast,
                  safe, and modern payment experience.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/products">
                    <Button
                      size="lg"
                      className="rounded-full bg-[#00e06a] px-7 text-[#181C32] hover:bg-[#00e06a]/90"
                    >
                      Explore Products
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  {!isAuthenticated && (
                    <Link href="/register">
                      <Button
                        size="lg"
                        variant="outline"
                        className="rounded-full border-white/20 bg-transparent text-white hover:bg-white/10"
                      >
                        Create Account
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-3xl border border-white/10 bg-[#181C32]/80 p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <Image
                      src="/paymera-icon.png"
                      alt="Paymera"
                      width={120}
                      height={28}
                      className="h-5 w-auto object-contain"
                    />
                  </div>
                  <p className="text-sm text-gray-300">
                    Seamless checkout with real-time payment verification.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 bg-[#252A4A] px-3 py-1 text-xs text-gray-300">
                      Fast Payment
                    </span>
                    <span className="rounded-full border border-white/10 bg-[#252A4A] px-3 py-1 text-xs text-gray-300">
                      Fraud Protected
                    </span>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-[#181C32]/80 p-4">
                    <p className="text-xs text-gray-400">Checkout time</p>
                    <p className="mt-1 text-lg font-semibold text-white">9s</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-[#181C32]/80 p-4">
                    <p className="text-xs text-gray-400">Customer rating</p>
                    <p className="mt-1 flex items-center gap-1 text-lg font-semibold text-white">
                      4.9 <Star className="h-4 w-4 text-[#00e06a]" />
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[#00e06a]/30 bg-[#00e06a]/10 p-4">
                    <p className="text-xs text-[#b8ffd9]">Success rate</p>
                    <p className="mt-1 text-lg font-semibold text-[#00e06a]">99.99%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-y border-white/10 bg-[#1E2344]/60 py-16">
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
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-[#1E2344] to-[#252A4A] p-8 lg:p-16">
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
