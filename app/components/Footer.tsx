import Link from "next/link";
import Logo from "./Logo";
import { navLinks } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 text-zinc-500 text-sm leading-relaxed max-w-sm">
              Nexus AI combines artificial intelligence with on-chain analytics to deliver
              institutional-grade crypto market intelligence.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gold uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2">
              {navLinks.slice(1, 5).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gold uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-zinc-500 hover:text-gold transition-colors cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-sm text-zinc-500 hover:text-gold transition-colors cursor-pointer">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="text-sm text-zinc-500 hover:text-gold transition-colors cursor-pointer">
                  Risk Disclosure
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} Nexus AI. All rights reserved.
          </p>
          <p className="text-xs text-zinc-600">
            Not financial advice. Trade at your own risk.
          </p>
        </div>
      </div>
    </footer>
  );
}
