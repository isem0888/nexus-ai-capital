"use client";

import { motion } from "framer-motion";
import type { Sector } from "@/lib/data";

interface SectorCardProps {
  sector: Sector;
  index: number;
}

export default function SectorCard({ sector, index }: SectorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="group relative rounded-2xl border border-border bg-surface-elevated p-6 overflow-hidden"
    >
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold/5 rounded-full blur-3xl group-hover:bg-gold/10 transition-colors duration-500" />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-display font-bold text-white group-hover:gold-gradient-text transition-all">
            {sector.name}
          </h3>
          <span
            className={`text-sm font-semibold ${
              sector.positive ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {sector.change24h}
          </span>
        </div>

        <p className="text-sm text-zinc-500 mb-4 leading-relaxed">{sector.description}</p>

        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div>
            <p className="text-xs text-zinc-600 uppercase tracking-wider">Market Cap</p>
            <p className="text-sm font-semibold text-gold">{sector.marketCap}</p>
          </div>
          <div className="flex gap-2">
            {sector.topTokens.map((token) => (
              <span
                key={token}
                className="px-2 py-1 text-xs font-medium rounded-md bg-black border border-border text-zinc-400 group-hover:border-gold/30 group-hover:text-gold transition-colors"
              >
                {token}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
