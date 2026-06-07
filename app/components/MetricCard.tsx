"use client";

import { motion } from "framer-motion";
import type { Metric } from "@/lib/data";

interface MetricCardProps {
  metric: Metric;
  index: number;
}

export default function MetricCard({ metric, index }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group relative rounded-2xl border border-border bg-surface-elevated p-6 overflow-hidden cursor-default"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gold/0 to-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-gold transition-colors">
              {metric.name}
            </h3>
            <span className="text-xs text-zinc-500 uppercase tracking-wider">{metric.asset}</span>
          </div>
          <span
            className={`text-sm font-medium px-2.5 py-1 rounded-lg ${
              metric.positive
                ? "text-emerald-400 bg-emerald-400/10"
                : "text-red-400 bg-red-400/10"
            }`}
          >
            {metric.change}
          </span>
        </div>

        <p className="text-3xl font-bold gold-gradient-text mb-3">{metric.value}</p>
        <p className="text-sm text-zinc-500 leading-relaxed">{metric.description}</p>
      </div>
    </motion.div>
  );
}
