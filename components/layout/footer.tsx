import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#181C32]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00e06a]">
                <span className="text-lg font-bold text-[#181C32]">P</span>
              </div>
              <span className="text-xl font-bold text-white">Paymera</span>
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

        <div className="mt-12 border-t border-white/10 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Paymera. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
