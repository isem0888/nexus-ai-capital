"use client";

import { motion } from "framer-motion";
import type { Signal, SignalType } from "@/lib/data";
import { signalLabels } from "@/lib/data";

interface SignalCardProps {
  signal: Signal;
  index: number;
}

const signalStyles: Record<SignalType, { bg: string; border: string; text: string }> = {
  buy: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
  },
  sell: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-400",
  },
  "strong-buy": {
    bg: "bg-emerald-500/20",
    border: "border-emerald-400/50",
    text: "text-emerald-300",
  },
  "strong-sell": {
    bg: "bg-red-500/20",
    border: "border-red-400/50",
    text: "text-red-300",
  },
};

export default function SignalCard({ signal, index }: SignalCardProps) {
  const style = signalStyles[signal.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{ x: 4, transition: { duration: 0.2 } }}
      className="group flex items-center gap-4 rounded-2xl border border-border bg-surface-elevated p-5 hover:border-gold/20 transition-colors"
    >
      <div className="flex-shrink-0">
        <span
          className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border ${style.bg} ${style.border} ${style.text}`}
        >
          {signalLabels[signal.type]}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-white group-hover:text-gold transition-colors">
            {signal.asset}
          </h3>
          <span className="text-xs text-zinc-600">{signal.timeframe}</span>
        </div>
        <div className="flex items-center gap-4 mt-1 text-sm">
          <span className="text-zinc-400">
            Entry: <span className="text-white">{signal.price}</span>
          </span>
          <span className="text-zinc-400">
            Target: <span className="text-gold">{signal.target}</span>
          </span>
        </div>
      </div>

      <div className="flex-shrink-0 text-right hidden sm:block">
        <div className="relative w-12 h-12">
          <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15" fill="none" stroke="#2a2a2a" strokeWidth="3" />
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="3"
              strokeDasharray={`${signal.confidence} ${100 - signal.confidence}`}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gold">
            {signal.confidence}
          </span>
        </div>
        <p className="text-xs text-zinc-600 mt-1">{signal.timestamp}</p>
      </div>
    </motion.div>
  );
}
