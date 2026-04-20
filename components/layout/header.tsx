"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, User, LogOut, Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#181C32]/85 backdrop-blur-xl supports-backdrop-filter:bg-[#181C32]/75">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full border border-white/10 bg-[#1E2344]/90 px-4 py-2 shadow-lg shadow-black/20"
        >
          <Image
            src="/paymera-icon.png"
            alt="Paymera"
            width={110}
            height={24}
            priority
            className="h-5 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-[#1E2344]/80 p-1 md:flex">
          <Link
            href="/"
            className="rounded-full px-4 py-2 text-sm text-white transition-colors hover:bg-white/10"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="rounded-full px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            Products
          </Link>
          <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-[#00e06a]/15 px-3 py-1 text-xs text-[#00e06a]">
            <Sparkles className="h-3 w-3" />
            New Deals
          </span>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 md:flex">
          {isAuthenticated ? (
            <>
              <Link href="/cart" className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-300 hover:bg-white/10 hover:text-white"
                >
                  <ShoppingCart className="h-5 w-5" />
                </Button>
                {itemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#00e06a] text-xs font-medium text-[#181C32]">
                    {itemCount}
                  </span>
                )}
              </Link>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <User className="h-4 w-4" />
                <span>{user?.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-300 hover:bg-white/10 hover:text-white"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:bg-white/10 hover:text-white"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-[#00e06a] text-[#181C32] hover:bg-[#00e06a]/90">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="rounded-full border border-white/10 bg-[#1E2344]/80 p-2 text-gray-300 md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-[#181C32] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            <Link
              href="/"
              className="text-sm text-gray-300 transition-colors hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-sm text-gray-300 transition-colors hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  href="/cart"
                  className="flex items-center gap-2 text-sm text-gray-300 transition-colors hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Cart {itemCount > 0 && `(${itemCount})`}
                </Link>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <User className="h-4 w-4" />
                  <span>{user?.name}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-sm text-gray-300 transition-colors hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full text-gray-300 hover:bg-white/10 hover:text-white"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-[#00e06a] text-[#181C32] hover:bg-[#00e06a]/90">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
