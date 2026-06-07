export type SignalType = "buy" | "sell" | "strong-buy" | "strong-sell";

export interface Metric {
  id: string;
  name: string;
  value: string;
  change: string;
  positive: boolean;
  description: string;
  asset: string;
}

export interface Sector {
  id: string;
  name: string;
  change24h: string;
  positive: boolean;
  marketCap: string;
  topTokens: string[];
  description: string;
}

export interface Signal {
  id: string;
  asset: string;
  type: SignalType;
  price: string;
  target: string;
  confidence: number;
  timeframe: string;
  timestamp: string;
}

export interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

export const metrics: Metric[] = [
  {
    id: "rsi",
    name: "RSI",
    value: "58.4",
    change: "+2.1",
    positive: true,
    description: "Relative Strength Index — momentum oscillator measuring speed and magnitude of price changes.",
    asset: "BTC",
  },
  {
    id: "macd",
    name: "MACD",
    value: "1,245",
    change: "+180",
    positive: true,
    description: "Moving Average Convergence Divergence — trend-following momentum indicator.",
    asset: "ETH",
  },
  {
    id: "cci",
    name: "CCI",
    value: "72.3",
    change: "-5.4",
    positive: false,
    description: "Commodity Channel Index — identifies cyclical trends and overbought/oversold conditions.",
    asset: "BTC",
  },
  {
    id: "open-interest",
    name: "Open Interest",
    value: "$28.4B",
    change: "+4.2%",
    positive: true,
    description: "Total outstanding derivative contracts — indicates market participation and liquidity depth.",
    asset: "BTC Futures",
  },
  {
    id: "funding-rate",
    name: "Funding Rate",
    value: "0.012%",
    change: "-0.003%",
    positive: false,
    description: "Periodic payment between long and short positions — reflects market sentiment bias.",
    asset: "BTC Perp",
  },
  {
    id: "mvrv",
    name: "MVRV",
    value: "2.14",
    change: "+0.08",
    positive: true,
    description: "Market Value to Realized Value — on-chain metric for fair value assessment.",
    asset: "BTC",
  },
  {
    id: "sopr",
    name: "SOPR",
    value: "1.03",
    change: "+0.01",
    positive: true,
    description: "Spent Output Profit Ratio — measures whether coins are sold at profit or loss.",
    asset: "BTC",
  },
];

export const sectors: Sector[] = [
  {
    id: "ai",
    name: "AI",
    change24h: "+8.4%",
    positive: true,
    marketCap: "$42.8B",
    topTokens: ["FET", "RNDR", "TAO"],
    description: "Artificial intelligence tokens powering decentralized compute and machine learning networks.",
  },
  {
    id: "rwa",
    name: "RWA",
    change24h: "+3.2%",
    positive: true,
    marketCap: "$18.5B",
    topTokens: ["ONDO", "MKR", "CFG"],
    description: "Real World Assets — tokenized treasury bills, real estate, and institutional-grade securities.",
  },
  {
    id: "defi",
    name: "DeFi",
    change24h: "-1.8%",
    positive: false,
    marketCap: "$89.2B",
    topTokens: ["UNI", "AAVE", "LINK"],
    description: "Decentralized finance protocols for lending, trading, and yield generation.",
  },
  {
    id: "gaming",
    name: "Gaming",
    change24h: "+5.6%",
    positive: true,
    marketCap: "$24.1B",
    topTokens: ["IMX", "GALA", "AXS"],
    description: "GameFi and metaverse ecosystems with play-to-earn and NFT integration.",
  },
  {
    id: "layer1",
    name: "Layer 1",
    change24h: "+2.1%",
    positive: true,
    marketCap: "$1.8T",
    topTokens: ["BTC", "ETH", "SOL"],
    description: "Base-layer blockchains providing core infrastructure for the crypto ecosystem.",
  },
  {
    id: "layer2",
    name: "Layer 2",
    change24h: "+6.3%",
    positive: true,
    marketCap: "$32.7B",
    topTokens: ["ARB", "OP", "MATIC"],
    description: "Scaling solutions built on top of Layer 1 chains for faster, cheaper transactions.",
  },
  {
    id: "meme",
    name: "Meme",
    change24h: "-4.2%",
    positive: false,
    marketCap: "$58.4B",
    topTokens: ["DOGE", "SHIB", "PEPE"],
    description: "Community-driven tokens with high volatility and social media-driven momentum.",
  },
];

export const signals: Signal[] = [
  {
    id: "1",
    asset: "BTC/USDT",
    type: "strong-buy",
    price: "$67,420",
    target: "$72,000",
    confidence: 87,
    timeframe: "4H",
    timestamp: "2 min ago",
  },
  {
    id: "2",
    asset: "ETH/USDT",
    type: "buy",
    price: "$3,842",
    target: "$4,100",
    confidence: 74,
    timeframe: "1D",
    timestamp: "15 min ago",
  },
  {
    id: "3",
    asset: "SOL/USDT",
    type: "strong-sell",
    price: "$142.50",
    target: "$128.00",
    confidence: 82,
    timeframe: "4H",
    timestamp: "32 min ago",
  },
  {
    id: "4",
    asset: "AVAX/USDT",
    type: "sell",
    price: "$38.20",
    target: "$35.50",
    confidence: 68,
    timeframe: "1D",
    timestamp: "1 hr ago",
  },
  {
    id: "5",
    asset: "LINK/USDT",
    type: "strong-buy",
    price: "$18.45",
    target: "$21.00",
    confidence: 91,
    timeframe: "1W",
    timestamp: "2 hr ago",
  },
  {
    id: "6",
    asset: "DOGE/USDT",
    type: "sell",
    price: "$0.142",
    target: "$0.128",
    confidence: 71,
    timeframe: "4H",
    timestamp: "3 hr ago",
  },
  {
    id: "7",
    asset: "ARB/USDT",
    type: "buy",
    price: "$0.92",
    target: "$1.05",
    confidence: 76,
    timeframe: "1D",
    timestamp: "4 hr ago",
  },
  {
    id: "8",
    asset: "FET/USDT",
    type: "strong-buy",
    price: "$2.18",
    target: "$2.65",
    confidence: 85,
    timeframe: "1W",
    timestamp: "5 hr ago",
  },
];

export const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Essential market insights to get started with Nexus AI.",
    features: [
      "Daily market overview",
      "Basic BTC & ETH metrics",
      "3 trading signals per day",
      "Community access",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$49",
    period: "month",
    description: "Advanced analytics for serious crypto traders.",
    features: [
      "Real-time CryptoQuant metrics",
      "All sector analysis",
      "Unlimited trading signals",
      "AI market predictions",
      "Email & Telegram alerts",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    id: "vip",
    name: "VIP",
    price: "$199",
    period: "month",
    description: "Institutional-grade intelligence for professional traders.",
    features: [
      "Everything in Pro",
      "Custom AI model training",
      "Whale wallet tracking",
      "Private Discord channel",
      "1-on-1 analyst sessions",
      "API access",
      "Early signal access",
    ],
  },
];

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/metrics", label: "Metrics" },
  { href: "/sectors", label: "Sectors" },
  { href: "/signals", label: "Signals" },
  { href: "/subscriptions", label: "Subscriptions" },
  { href: "/contacts", label: "Contacts" },
];

export const signalLabels: Record<SignalType, string> = {
  buy: "Buy",
  sell: "Sell",
  "strong-buy": "Strong Buy",
  "strong-sell": "Strong Sell",
};
