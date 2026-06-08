import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WalletProvider from "../providers/WalletProvider";
import Navbar from "./components/Navbar";
import AuthProvider from "./components/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nexus-ai-capital.vercel.app"),

  title: {
    default: "Nexus AI Capital",
    template: "%s | Nexus AI Capital",
  },

  description:
    "AI-powered investment platform utilizing autonomous trading agents, options strategies and liquidity mining solutions.",

  applicationName: "Nexus AI Capital",

  keywords: [
    "AI Trading",
    "Investment Platform",
    "Crypto Investment",
    "Ethereum",
    "Liquidity Mining",
    "Options Trading",
    "Digital Assets",
    "Nexus AI Capital",
  ],

  openGraph: {
    title: "Nexus AI Capital",
    description:
      "AI-powered investment platform utilizing autonomous trading agents and digital asset management.",
    url: "https://nexus-ai-capital.vercel.app",
    siteName: "Nexus AI Capital",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Nexus AI Capital",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Nexus AI Capital",
    description:
      "AI-powered investment platform utilizing autonomous trading agents and digital asset management.",
    images: ["/logo.png"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <AuthProvider>
          <WalletProvider>
            {/* <Navbar /> */}
            {children}
          </WalletProvider>
        </AuthProvider>
      </body>
    </html>
  );
}