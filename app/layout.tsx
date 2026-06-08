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
  title: "Nexus AI Capital",
  description: "AI-Powered Digital Asset Management",

  applicationName: "Nexus AI Capital",

  openGraph: {
    title: "Nexus AI Capital",
    description: "AI-Powered Digital Asset Management",
    url: "https://nexus-ai-capital.vercel.app",
    siteName: "Nexus AI Capital",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Nexus AI Capital",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Nexus AI Capital",
    description: "AI-Powered Digital Asset Management",
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
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white min-h-screen`}>
        <WalletProvider>
          <AuthProvider>
            <Navbar />
            <main className="relative z-10">{children}</main>
          </AuthProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
