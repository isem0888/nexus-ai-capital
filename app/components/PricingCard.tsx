"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Plan } from "@/lib/data";

interface PricingCardProps {
  plan: Plan;
  index: number;
}

export default function PricingCard({ plan, index }: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className={`relative rounded-2xl p-8 flex flex-col ${
        plan.highlighted
          ? "border-2 border-gold bg-gradient-to-b from-gold/10 to-surface-elevated gold-border-glow"
          : "border border-border bg-surface-elevated"
      }`}
    >
      {plan.highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-gold-dark via-gold to-gold-light text-black rounded-full">
          Most Popular
        </span>
      )}

      <h3 className="font-display text-2xl font-bold text-white">{plan.name}</h3>
      <p className="text-sm text-zinc-500 mt-2">{plan.description}</p>

      <div className="mt-6 mb-8">
        <span className="text-4xl font-bold gold-gradient-text">{plan.price}</span>
        {plan.price !== "$0" && (
          <span className="text-zinc-500 text-sm ml-1">/ {plan.period}</span>
        )}
      </div>

      <ul className="space-y-3 flex-1 mb-8">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm text-zinc-400">
            <svg className="h-5 w-5 text-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      <Link
        href="/contacts"
        className={`block w-full text-center py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
          plan.highlighted
            ? "bg-gradient-to-r from-gold-dark via-gold to-gold-light text-black hover:shadow-lg hover:shadow-gold/20 hover:scale-105"
            : "border border-border text-zinc-300 hover:border-gold/50 hover:text-gold"
        }`}
      >
        {plan.price === "$0" ? "Get Started" : "Subscribe Now"}
      </Link>
    </motion.div>
  );
}
