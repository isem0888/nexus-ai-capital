"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  badge?: string;
  children?: ReactNode;
}

export default function PageHeader({ title, subtitle, badge, children }: PageHeaderProps) {
  return (
    <section className="relative pt-32 pb-16 px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/5 blur-[120px] rounded-full" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {badge && (
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase border border-gold/30 bg-gold/5 text-gold mb-6">
              {badge}
            </span>
          )}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="gold-gradient-text">{title}</span>
          </h1>
          <p className="mt-4 text-lg text-zinc-400 max-w-2xl">{subtitle}</p>
          {children}
        </motion.div>
      </div>
    </section>
  );
}
