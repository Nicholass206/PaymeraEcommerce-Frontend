"use client";

import { useState } from "react";
import useSWR from "swr";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProductGrid } from "@/components/products/product-grid";
import { Pagination } from "@/components/products/pagination";
import { api } from "@/services/api";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProductsPage() {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useSWR(
    isAuthenticated ? `/products?page=${currentPage}` : null,
    () => api.getProducts(currentPage)
  );

  const products = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.last_page ?? 1;

  // Client-side search filtering
  const filteredProducts = searchQuery
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold text-white">
            Sign in to Browse Products
          </h1>
          <p className="mb-8 text-gray-400">
            Please log in to view our product catalog and make purchases.
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

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      {/* Header */}
      <div className="mb-8 rounded-3xl border border-white/10 bg-[#1E2344]/70 p-6">
        <h1 className="mb-2 text-3xl font-bold text-white lg:text-4xl">
          Products
        </h1>
        <p className="text-gray-400">
          Browse our collection of quality products
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <Input
          type="search"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-11 rounded-full border-white/10 bg-[#1E2344] pl-10 text-white placeholder:text-gray-500 focus:border-[#00e06a] focus:ring-[#00e06a]/20"
        />
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-8 rounded-lg bg-red-500/10 p-4 text-center text-red-400">
          Failed to load products. Please try again later.
        </div>
      )}

      {/* Products Grid */}
      <ProductGrid products={filteredProducts} isLoading={isLoading} />

      {/* Pagination */}
      {!isLoading && totalPages > 1 && !searchQuery && (
        <div className="mt-12">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
