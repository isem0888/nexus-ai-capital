"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function TermsOfService() {
  const useScrollReveal = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
        { threshold: 0.08 }
      );
      obs.observe(el);
      return () => obs.disconnect();
    }, []);
    return { ref, visible };
  };

  const sHeader = useScrollReveal();
  const sContent = useScrollReveal();
  const sCta = useScrollReveal();
  const sLinks = useScrollReveal();

  const sections = [
    {
      title: "Introduction",
      icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      content: [
        "Welcome to Nexus AI Capital. By accessing or using our website, platform, services, applications, or any digital products operated by Nexus AI Capital, you agree to be fully bound by these Terms of Service ('Terms').",
        "These Terms constitute a legally binding agreement between you ('User', 'you', or 'your') and Nexus AI Capital ('Company', 'we', 'us', or 'our'). Please read them carefully before using our services.",
        "If you do not agree with any provision of these Terms, you must immediately discontinue use of our platform and services. Your continued use constitutes unconditional acceptance of all terms outlined herein.",
      ],
    },
    {
      title: "Nature of Services",
      icon: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18",
      content: [
        "Nexus AI Capital provides AI-driven investment technology infrastructure, digital asset management solutions, autonomous trading agent systems, market analytics, and related financial technology services.",
        "Our platform enables users to access AI-powered trading strategies through a decentralized interface. We utilize six specialized autonomous agents: Arbitrage, Macro Intelligence, Risk Control, Liquidity Mining, Options Income, and Dual Currency strategies.",
        "Information provided on this website is for informational and educational purposes only and does not constitute a solicitation or offer to buy or sell any financial instrument or service in any jurisdiction.",
        "We reserve the right to modify, suspend, or discontinue any aspect of our services at any time without prior notice. We shall not be liable for any consequences arising from such changes.",
      ],
    },
    {
      title: "No Financial Advice",
      icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
      content: [
        "Nothing on this website, platform, or in any communications from Nexus AI Capital constitutes financial advice, investment advice, trading advice, legal advice, tax advice, or any other form of professional advice.",
        "Specifically, the following do not constitute financial advice: APR projections displayed on our platform, AI agent performance metrics and statistics, market data and price feeds, investment plan descriptions and comparisons, any written or automated communications from our system.",
        "All content is provided purely for informational and technological demonstration purposes. Users are solely responsible for their own investment decisions and must conduct their own due diligence.",
        "We strongly recommend consulting with a licensed financial advisor, legal counsel, and tax professional before making any investment decisions. Past performance of our AI systems does not guarantee future results.",
      ],
    },
    {
      title: "Risk Disclosure",
      icon: "M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      content: [
        "Investments in digital assets, cryptocurrencies, DeFi protocols, and AI-managed financial strategies involve substantial risk of loss. You should carefully consider whether such activities are suitable for you in light of your financial circumstances.",
        "Specific risks include: extreme price volatility of digital assets, smart contract vulnerabilities and protocol exploits, regulatory changes that may affect asset legality or accessibility, liquidity risks and potential inability to exit positions, technical failures of blockchain networks or our platform, cyberattacks, hacks, or unauthorized access to systems.",
        "AI trading systems, while sophisticated, operate based on historical data and algorithmic models. Market conditions can change rapidly in ways that historical models cannot predict. There is no guarantee that our AI agents will generate positive returns.",
        "Users acknowledge and accept that the total loss of invested capital is a real possibility. Nexus AI Capital makes no warranties, representations, or guarantees regarding investment performance, returns, or the preservation of capital.",
        "Only invest amounts you can afford to lose entirely. Do not invest emergency funds, borrowed money, or assets critical to your financial stability.",
      ],
    },
    {
      title: "Eligibility & Prohibited Jurisdictions",
      icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064",
      content: [
        "By using our platform, you represent and warrant that you are at least 18 years of age (or the legal age of majority in your jurisdiction), have the legal capacity to enter into binding contracts, and are not prohibited from using our services under applicable law.",
        "Our services are not available to residents of the following jurisdictions: United States of America, United States territories and possessions, Iran, North Korea, Syria, Cuba, Venezuela, Belarus, Myanmar, and any jurisdiction subject to comprehensive international sanctions.",
        "We reserve the right to restrict access to our platform from any jurisdiction at our sole discretion without prior notice. Users who access our platform from prohibited jurisdictions do so in violation of these Terms and assume all associated legal risk.",
        "It is your responsibility to ensure that your use of our platform complies with all applicable laws and regulations in your jurisdiction.",
      ],
    },
    {
      title: "Wallet Connections & Asset Custody",
      icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
      content: [
        "Nexus AI Capital provides a non-custodial platform interface. When you connect a third-party cryptocurrency wallet, you retain full custody and control of your private keys and digital assets at all times.",
        "We do not: store, access, or have visibility into your private keys or seed phrases; have the ability to move, freeze, or recover your digital assets; take custody of assets deposited to our smart contracts beyond what is technically required for strategy execution; guarantee the security or availability of third-party wallet providers.",
        "You are solely responsible for the security of your wallet, private keys, seed phrases, and any credentials used to access your cryptocurrency holdings. Loss of private keys cannot be recovered by Nexus AI Capital under any circumstances.",
        "By connecting your wallet, you authorize the execution of transactions as described in the investment plans you select. You acknowledge that blockchain transactions are irreversible once confirmed.",
        "Deposit addresses displayed on our platform are controlled by Nexus AI Capital treasury infrastructure. Always verify addresses independently before sending assets.",
      ],
    },
    {
      title: "Investment Plans & APR",
      icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
      content: [
        "Investment plans displayed on our platform represent structured yield products powered by our AI trading infrastructure. Annual Percentage Rate (APR) figures shown are estimates based on historical AI agent performance and current market conditions.",
        "APR figures are not guaranteed returns. Actual returns may be higher or lower than displayed estimates depending on market volatility, liquidity conditions, strategy performance, and other factors.",
        "Lock periods specified in investment plans represent the minimum commitment period during which assets are deployed in active strategies. Early withdrawal may not be available for locked plans.",
        "Flexible plans allow withdrawal at any time without penalty. However, execution may be subject to on-chain gas fees, network congestion, and liquidity availability.",
        "We reserve the right to adjust APR rates, modify plan structures, or discontinue specific investment plans at any time. Users will be notified of material changes through platform announcements.",
      ],
    },
    {
      title: "User Responsibilities",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      content: [
        "As a user of our platform, you agree to: provide accurate, current, and complete information when required; maintain the security and confidentiality of your account credentials and wallet access; notify us immediately of any unauthorized use of your account or any security breach.",
        "You agree not to: use our platform for any illegal, fraudulent, or unauthorized purpose; attempt to gain unauthorized access to our systems, servers, or databases; interfere with or disrupt the integrity or performance of our platform; use automated tools, bots, or scripts to access our platform without express written permission.",
        "You agree not to: engage in market manipulation, wash trading, or any activity that artificially affects asset prices; use our platform to launder money or finance terrorism; copy, reproduce, distribute, or create derivative works of our proprietary content without authorization.",
        "Violation of these responsibilities may result in immediate termination of access to our platform, potential legal action, and reporting to relevant law enforcement authorities.",
      ],
    },
    {
      title: "Intellectual Property",
      icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
      content: [
        "All content, materials, software, designs, algorithms, AI models, branding, graphics, user interfaces, and proprietary technologies on our platform are the exclusive intellectual property of Nexus AI Capital or its licensors.",
        "This includes but is not limited to: the Nexus AI Capital name, logo, and brand identity; all platform source code and architecture; AI trading algorithms and agent logic; market analysis methodologies; written content, documentation, and marketing materials.",
        "You are granted a limited, non-exclusive, non-transferable, revocable license to access and use our platform solely for its intended purpose. This license does not permit: reselling or redistributing our services; modifying, adapting, or creating derivative works; reverse engineering any aspect of our technology; removing or altering any proprietary notices.",
        "Any feedback, suggestions, or ideas you provide to us may be used by Nexus AI Capital without restriction, compensation, or attribution.",
      ],
    },
    {
      title: "Limitation of Liability",
      icon: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636",
      content: [
        "To the fullest extent permitted by applicable law, Nexus AI Capital, its directors, officers, employees, agents, partners, and licensors shall not be liable for any indirect, incidental, special, consequential, punitive, or exemplary damages.",
        "This includes but is not limited to: financial losses or trading losses; loss of profits, revenue, or anticipated savings; loss of digital assets or cryptocurrency; loss of data or information; loss of business or business opportunity; service interruptions or platform downtime; third-party platform failures or exploits.",
        "Our total aggregate liability for any claims arising from or related to these Terms or your use of our services shall not exceed the amount of fees paid by you to Nexus AI Capital in the 12 months preceding the claim.",
        "Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability. In such jurisdictions, our liability shall be limited to the maximum extent permitted by law.",
      ],
    },
    {
      title: "Governing Law & Dispute Resolution",
      icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
      content: [
        "These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Nexus AI Capital is incorporated, without regard to its conflict of law provisions.",
        "Any dispute, controversy, or claim arising out of or relating to these Terms or the breach, termination, or invalidity thereof shall first be subject to good faith negotiation between the parties.",
        "If resolution cannot be reached through negotiation within 30 days, disputes shall be resolved through binding arbitration in accordance with internationally recognized arbitration rules. The arbitration shall be conducted in English.",
        "You waive any right to participate in class action lawsuits or class-wide arbitration against Nexus AI Capital. Claims must be brought individually.",
      ],
    },
    {
      title: "Amendments & Termination",
      icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
      content: [
        "We reserve the right to modify, update, or replace these Terms of Service at any time at our sole discretion. Material changes will be announced through platform notifications or email where applicable.",
        "Your continued use of our platform after any modifications to these Terms constitutes your acceptance of the revised Terms. If you do not agree to the modified Terms, you must cease using our services immediately.",
        "We reserve the right to suspend or terminate your access to our platform at any time, for any reason, including but not limited to: violation of these Terms, fraudulent or illegal activity, requests from law enforcement, extended periods of inactivity.",
        "Upon termination, all licenses granted to you under these Terms will immediately cease. Provisions that by their nature should survive termination shall remain in effect.",
      ],
    },
    {
      title: "Contact Information",
      icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      content: [
        "For questions, concerns, or requests regarding these Terms of Service, please contact us through the following channels:",
        "Email: info@nexusinnovationscapital.com",
        "Website: https://nexus-ai-capital.vercel.app",
        "We aim to respond to all inquiries within 5 business days. For urgent legal matters, please indicate the urgency in your communication subject line.",
        "Last Updated: Feb 2026 — These Terms supersede all previous versions.",
      ],
    },
  ];

  return (
    <main
      className="relative min-h-screen text-white overflow-hidden"
      style={{
        backgroundImage: "linear-gradient(rgba(2,6,23,0.85), rgba(2,6,23,0.92)), url('/images/ai-network-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-slate-950/70 pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-6 md:px-10 py-5 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <img src="/logo.png" alt="Nexus AI Capital" className="h-10 w-auto" />
          <div>
            <div className="font-black text-white text-base tracking-wide">NEXUS AI CAPITAL</div>
            <div className="text-slate-500 text-xs">Autonomous Trading Intelligence</div>
          </div>
        </Link>
        <Link
          href="/"
          className="rounded-lg border border-slate-700 px-4 py-2 text-slate-400 hover:border-slate-500 hover:text-white transition text-sm font-medium"
        >
          ← Back to Home
        </Link>
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 py-16 md:py-24">

        {/* Header */}
        <div
          ref={sHeader.ref}
          style={{ opacity: sHeader.visible ? 1 : 0, transform: sHeader.visible ? "translateY(0)" : "translateY(36px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Legal Documents
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
            Terms of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
              Service
            </span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto">
            Please read these terms carefully before using the Nexus AI Capital platform.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-xs text-slate-500">
            <span>Last Updated: June 2026</span>
            <span>•</span>
            <span>{sections.length} Sections</span>
            <span>•</span>
            <span>Effective Immediately</span>
          </div>
        </div>

        {/* Sections */}
        <div
          ref={sContent.ref}
          style={{ opacity: sContent.visible ? 1 : 0, transform: sContent.visible ? "translateY(0)" : "translateY(36px)", transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s" }}
          className="space-y-4"
        >
          {sections.map((section, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-6 md:p-8"
            >
              <div className="flex items-start gap-4 mb-5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={section.icon} />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-0.5">
                    Section {index + 1}
                  </div>
                  <h2 className="text-lg md:text-xl font-bold text-white">{section.title}</h2>
                </div>
              </div>
              <div className="pl-14 space-y-3">
                {section.content.map((para, i) => (
                  <p key={i} className="text-slate-300 text-sm md:text-base leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
              {index < sections.length - 1 && (
                <div className="mt-6 border-t border-slate-800/60" />
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          ref={sCta.ref}
          style={{ opacity: sCta.visible ? 1 : 0, transform: sCta.visible ? "translateY(0)" : "translateY(36px)", transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s" }}
          className="mt-12 rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-8 text-center"
        >
          <h3 className="text-xl font-bold text-white mb-2">Questions about our Terms?</h3>
          <p className="text-slate-400 text-sm mb-6">
            Our legal team is available to clarify any provisions of these Terms.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="mailto:info@nexusinnovationscapital.com"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 px-6 py-3 text-white font-semibold transition text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Legal Team
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-600 px-6 py-3 text-slate-300 font-semibold hover:border-slate-400 hover:text-white transition text-sm"
            >
              Back to Platform
            </Link>
          </div>
        </div>

        {/* Other Legal Docs */}
        <div
          ref={sLinks.ref}
          style={{ opacity: sLinks.visible ? 1 : 0, transform: sLinks.visible ? "translateY(0)" : "translateY(36px)", transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s" }}
          className="mt-10"
        >
          <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold text-center mb-4">Other Legal Documents</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: "Privacy Policy", href: "/privacy" },
              { name: "Risk Disclosure", href: "/risk-disclosure" },
              { name: "AML & KYC Policy", href: "/aml-kyc" },
              { name: "Cookie Policy", href: "/cookies" },
            ].map((doc) => (
              <Link
                key={doc.name}
                href={doc.href}
                className="flex items-center gap-2 p-3 rounded-xl border border-slate-700/50 bg-slate-900/40 hover:border-blue-500/40 hover:bg-blue-500/5 transition text-sm text-slate-400 hover:text-white font-medium"
              >
                <svg className="w-4 h-4 text-slate-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {doc.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center font-black text-white text-sm">N</div>
            <div>
              <div className="font-bold text-white text-sm">NEXUS Investment Fund</div>
              <div className="text-xs text-slate-500">© 2026 — The future of decentralized investments</div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <Link href="/privacy" className="hover:text-blue-400 transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-blue-400 transition">Terms of Service</Link>
            <Link href="/regulatory" className="hover:text-blue-400 transition">Regulatory</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}