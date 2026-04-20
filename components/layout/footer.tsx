import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#181C32]/95">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 rounded-3xl border border-white/10 bg-[#1E2344]/70 p-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-center rounded-full border border-white/10 bg-[#181C32] px-3 py-1.5">
              <Image
                src="/paymera-icon.png"
                alt="Paymera"
                width={120}
                height={26}
                className="h-5 w-auto"
              />
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              Secure and seamless e-payment solutions for modern businesses.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Support</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-gray-400">Help Center</span>
              </li>
              <li>
                <span className="text-sm text-gray-400">Contact Us</span>
              </li>
              <li>
                <span className="text-sm text-gray-400">FAQ</span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">Legal</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-gray-400">Privacy Policy</span>
              </li>
              <li>
                <span className="text-sm text-gray-400">Terms of Service</span>
              </li>
              <li>
                <span className="text-sm text-gray-400">Cookie Policy</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Paymera. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
