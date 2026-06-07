"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const sizes = {
  sm: { icon: "h-8 w-8", text: "text-lg" },
  md: { icon: "h-10 w-10", text: "text-xl" },
  lg: { icon: "h-14 w-14", text: "text-3xl" },
};

export default function Logo({ size = "md", showText = true }: LogoProps) {
  const s = sizes[size];

  return (
    <Link href="/" className="flex items-center gap-3 group">
      <motion.div
        whileHover={{ rotate: 180, scale: 1.05 }}
        transition={{ duration: 0.5 }}
        className={`${s.icon} relative flex items-center justify-center rounded-xl border border-gold/40 bg-surface-elevated`}
      >
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-gold/20 to-transparent" />
        <svg viewBox="0 0 32 32" className="h-5 w-5 relative z-10" fill="none">
          <path
            d="M16 4L28 16L16 28L4 16L16 4Z"
            stroke="#D4AF37"
            strokeWidth="1.5"
            fill="url(#goldGrad)"
          />
          <circle cx="16" cy="16" r="4" fill="#D4AF37" />
          <defs>
            <linearGradient id="goldGrad" x1="4" y1="4" x2="28" y2="28">
              <stop stopColor="#F5D061" />
              <stop offset="1" stopColor="#B8941F" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
      {showText && (
        <div>
          <span className={`${s.text} font-display font-bold tracking-wider gold-gradient-text`}>
            NEXUS AI
          </span>
          {size === "lg" && (
            <p className="text-xs text-zinc-500 tracking-widest uppercase mt-0.5">
              Crypto Intelligence
            </p>
          )}
        </div>
      )}
    </Link>
  );
}
