"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function PrivacyPolicy() {
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

  const sHeader  = useScrollReveal();
  const sContent = useScrollReveal();
  const sCta     = useScrollReveal();
  const sLinks   = useScrollReveal();

  const sections = [
    {
      title: "Introduction",
      icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
      content: [
        "Welcome to Nexus AI Capital. This Privacy Policy explains how we collect, use, process, disclose, and safeguard your information when you visit our website, use our platform, or interact with our services.",
        "By accessing or using our services, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not access the site or use our services.",
        "This policy applies to all information collected through our platform, as well as any related services, sales, marketing, or events. We are committed to protecting your privacy and handling your data in an open and transparent manner.",
      ],
    },
    {
      title: "Information We Collect",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
      content: [
        "We may collect information about you in a variety of ways depending on how you interact with our platform. Categories of data we collect include:",
        "Personal Data: Email address, name, and other contact information you voluntarily provide when registering or communicating with us. This data is provided at your discretion and is not required to access basic platform features.",
        "Wallet Addresses: Public blockchain wallet addresses when you connect your wallet to our platform. These are inherently public on the blockchain and do not constitute private information in the traditional sense.",
        "Usage Data: Information about how you access and use our platform, including IP address, browser type, operating system, referring URLs, pages visited, time spent on pages, and click behavior. This data helps us improve platform performance.",
        "Transaction Data: Information about on-chain transactions you initiate through our platform, including deposit amounts, asset types, timestamps, and transaction hashes. All on-chain data is publicly visible by design.",
        "Device Data: Technical information about the device you use to access our services, including device identifiers, screen resolution, and hardware specifications.",
        "Communication Data: Records of any communications between you and Nexus AI Capital, including support tickets, emails, and feedback submissions.",
      ],
    },
    {
      title: "How We Use Your Information",
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
      content: [
        "We process the information we collect for specific, legitimate purposes. We do not use your data beyond what is necessary for these purposes.",
        "Service Delivery: To provide, operate, maintain, and improve our platform and services, process investment transactions, and manage your account activity.",
        "Security & Fraud Prevention: To detect, investigate, and prevent fraudulent transactions, unauthorized access, abuse, security breaches, and other potentially prohibited or illegal activities.",
        "Communications: To send you technical notices, security alerts, administrative messages, and updates about our services. We may also send marketing communications with your consent.",
        "Analytics & Improvement: To analyze usage patterns, monitor platform performance, conduct research, and make data-driven decisions to enhance user experience.",
        "Legal Compliance: To comply with applicable laws, regulations, legal processes, and governmental requests, and to enforce our Terms of Service.",
        "Customer Support: To respond to your comments, questions, and requests, and provide assistance when needed.",
      ],
    },
    {
      title: "Blockchain & Wallet Data",
      icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
      content: [
        "Our platform operates in a non-custodial manner, meaning you retain full control of your private keys and digital assets at all times. We do not store private keys, seed phrases, or wallet passwords under any circumstances.",
        "When you connect a cryptocurrency wallet, we access only your public wallet address. This address is inherently public on the blockchain and visible to anyone. We use it solely to facilitate investment transactions you initiate.",
        "All blockchain transactions are immutable by design. Once confirmed on-chain, transactions cannot be reversed, modified, or deleted by Nexus AI Capital or any other party. We have no ability to recover lost assets or reverse transactions.",
        "Public blockchain data, including wallet balances and transaction histories, is permanently and publicly accessible on-chain. Our privacy policy cannot govern data that is already publicly recorded on a blockchain network.",
        "Third-party wallet providers (such as MetaMask, WalletConnect, Coinbase Wallet, and others) operate under their own privacy policies. We strongly recommend reviewing the privacy practices of any wallet provider you use.",
      ],
    },
    {
      title: "Cookies & Tracking Technologies",
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      content: [
        "We use cookies, web beacons, pixel tags, and similar tracking technologies to enhance your experience on our platform, analyze usage patterns, and deliver relevant content.",
        "Essential Cookies: These are strictly necessary for the platform to function correctly. They enable core features such as security, authentication, and session management. These cannot be disabled without affecting platform functionality.",
        "Analytics Cookies: These help us understand how visitors interact with our website by collecting and reporting information anonymously. We use this data to improve platform performance and user experience.",
        "Preference Cookies: These enable the platform to remember information that changes the way it behaves or looks, such as your preferred language, theme settings, or recently viewed content.",
        "You can instruct your browser to refuse all cookies or to notify you when a cookie is being sent. However, disabling certain cookies may limit your ability to use some features of our platform. Most browsers provide instructions for managing cookies in their help documentation.",
      ],
    },
    {
      title: "Data Sharing & Disclosure",
      icon: "M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z",
      content: [
        "We do not sell, rent, or trade your personal information to third parties for their marketing purposes. We may share your information only in the limited circumstances described below.",
        "Service Providers: We may share data with trusted third-party service providers who assist us in operating our platform, conducting our business, or serving our users, subject to confidentiality obligations.",
        "Legal Requirements: We may disclose your information when required to do so by law, court order, or governmental authority, or when we believe in good faith that disclosure is necessary to comply with legal obligations.",
        "Protection of Rights: We may share information to protect the rights, property, or safety of Nexus AI Capital, our users, or others, including for fraud prevention and security purposes.",
        "Business Transfers: In the event of a merger, acquisition, reorganization, bankruptcy, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.",
        "Aggregated Data: We may share anonymized, aggregated, or de-identified data that cannot reasonably be used to identify you for research, analysis, or industry reporting purposes.",
      ],
    },
    {
      title: "Data Security",
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      content: [
        "We implement industry-standard technical and organizational security measures to protect your information against unauthorized access, alteration, disclosure, or destruction.",
        "Technical Measures: Encryption of data in transit using TLS/SSL protocols, encryption of sensitive data at rest, secure coding practices, regular penetration testing and vulnerability assessments.",
        "Organizational Measures: Strict access controls limiting data access to authorized personnel only, regular employee training on data protection and security practices, documented incident response procedures.",
        "Infrastructure Security: Our platform infrastructure is hosted on enterprise-grade cloud services with redundant security systems, continuous monitoring, and automated threat detection.",
        "Despite our best efforts, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security. In the event of a data breach that poses a significant risk to your rights, we will notify you in accordance with applicable laws.",
      ],
    },
    {
      title: "Your Data Protection Rights",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      content: [
        "Depending on your location and applicable law, you may have certain rights regarding your personal data. We are committed to honoring these rights in a timely and transparent manner.",
        "Right to Access: You have the right to request copies of the personal data we hold about you. We will provide this information within 30 days of a verified request.",
        "Right to Rectification: If you believe information we hold about you is inaccurate or incomplete, you have the right to request correction.",
        "Right to Erasure ('Right to be Forgotten'): You may request the deletion of your personal data where there is no compelling reason for its continued processing.",
        "Right to Restrict Processing: You have the right to request that we limit the way we use your data in certain circumstances.",
        "Right to Data Portability: You may request that we transfer your data to another organization or directly to you in a structured, machine-readable format.",
        "Right to Object: You have the right to object to our processing of your personal data for direct marketing or where processing is based on legitimate interests.",
        "To exercise any of these rights, contact us at info@nexusinnovationscapital.com. We may need to verify your identity before processing your request.",
      ],
    },
    {
      title: "Data Retention",
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      content: [
        "We retain your personal data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.",
        "Account Data: Retained for the duration of your account and for a period of up to 7 years following account closure to comply with legal and regulatory obligations.",
        "Transaction Records: Retained for a minimum of 7 years as required by financial regulations and anti-money laundering compliance requirements.",
        "Usage and Analytics Data: Typically retained for 24 months in identifiable form, after which it may be anonymized and retained indefinitely for research purposes.",
        "Communication Records: Support communications and correspondence retained for up to 3 years following the resolution of any matter.",
        "When data is no longer required, we securely delete or anonymize it using industry-standard data destruction methods.",
      ],
    },
    {
      title: "Third-Party Services & Integrations",
      icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1",
      content: [
        "Our platform integrates with various third-party services to deliver its full functionality. These integrations are subject to the privacy practices of those third parties.",
        "Blockchain Networks: We interact with public blockchain networks including Ethereum, Bitcoin, Solana, BNB Chain, XRP Ledger, and NEAR Protocol. Transactions on these networks are public by design.",
        "Wallet Providers: We support connections via MetaMask, WalletConnect, Coinbase Wallet, Rainbow, and other Web3 wallet providers. Each has its own privacy policy governing their data practices.",
        "Market Data Providers: We use third-party APIs including Binance and CoinGecko for real-time price feeds and market data. These providers may collect technical data about API requests.",
        "Analytics Services: We may use privacy-respecting analytics tools to understand platform usage. We configure these tools to minimize personal data collection and do not permit them to use your data for their own purposes.",
        "We encourage you to review the privacy policies of all third-party services you interact with through our platform.",
      ],
    },
    {
      title: "International Data Transfers",
      icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064",
      content: [
        "Nexus AI Capital operates globally, and your information may be transferred to, stored, and processed in countries other than your country of residence. These countries may have different data protection laws than your jurisdiction.",
        "When we transfer personal data internationally, we ensure appropriate safeguards are in place, including standard contractual clauses approved by relevant data protection authorities, adequacy decisions where applicable, and binding corporate rules where appropriate.",
        "By using our services, you consent to the transfer of your information to countries outside your jurisdiction, including countries that may not provide the same level of data protection as your home country.",
      ],
    },
    {
      title: "Children's Privacy",
      icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
      content: [
        "Our services are strictly not intended for use by individuals under the age of 18. We do not knowingly collect, solicit, or maintain personally identifiable information from children under 18.",
        "If we become aware that we have inadvertently collected personal data from a child under 18, we will take immediate steps to delete such information from our records and terminate any associated account.",
        "If you are a parent or guardian and believe your child has provided us with personal information without your consent, please contact us immediately at info@nexusinnovationscapital.com so we can take appropriate action.",
      ],
    },
    {
      title: "Updates to This Policy",
      icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
      content: [
        "We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will indicate the date of the most recent revision at the top of this page.",
        "For material changes that significantly affect your privacy rights or how we use your data, we will provide more prominent notice, which may include email notification where we have your contact information.",
        "We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information. Your continued use of our services after any changes constitutes your acceptance of the updated policy.",
        "Last Updated: June 2026 — This policy supersedes all previous versions.",
      ],
    },
    {
      title: "Contact & Data Requests",
      icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      content: [
        "If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, we encourage you to contact us. We are committed to addressing your privacy concerns promptly.",
        "Email: info@nexusinnovationscapital.com",
        "Website: https://nexus-ai-capital.vercel.app",
        "For data subject access requests, deletion requests, or other rights-related inquiries, please include 'Privacy Request' in the subject line and provide sufficient information to verify your identity.",
        "We aim to respond to all privacy-related inquiries within 30 days. For complex requests, we may extend this period by an additional 60 days, in which case we will notify you of the extension and the reasons for it.",
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
        <Link href="/" className="rounded-lg border border-slate-700 px-4 py-2 text-slate-400 hover:border-slate-500 hover:text-white transition text-sm font-medium">
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Privacy & Security
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
            Privacy{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">
              Policy
            </span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto">
            How we collect, use, and protect your information on the Nexus AI Capital platform.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-xs text-slate-500">
            <span>Last Updated: June 2026</span>
            <span>•</span>
            <span>{sections.length} Sections</span>
            <span>•</span>
            <span>GDPR Compliant</span>
          </div>
        </div>

        {/* Sections */}
        <div
          ref={sContent.ref}
          style={{ opacity: sContent.visible ? 1 : 0, transform: sContent.visible ? "translateY(0)" : "translateY(36px)", transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s" }}
          className="space-y-4"
        >
          {sections.map((section, index) => (
            <div key={index} className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-6 md:p-8">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={section.icon} />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-0.5">Section {index + 1}</div>
                  <h2 className="text-lg md:text-xl font-bold text-white">{section.title}</h2>
                </div>
              </div>
              <div className="pl-14 space-y-3">
                {section.content.map((para, i) => (
                  <p key={i} className="text-slate-300 text-sm md:text-base leading-relaxed">{para}</p>
                ))}
              </div>
              {index < sections.length - 1 && <div className="mt-6 border-t border-slate-800/60" />}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          ref={sCta.ref}
          style={{ opacity: sCta.visible ? 1 : 0, transform: sCta.visible ? "translateY(0)" : "translateY(36px)", transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s" }}
          className="mt-12 rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-8 text-center"
        >
          <h3 className="text-xl font-bold text-white mb-2">Questions about your privacy?</h3>
          <p className="text-slate-400 text-sm mb-6">Our team is here to help with any data protection concerns.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="mailto:info@nexusinnovationscapital.com"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-500 px-6 py-3 text-white font-semibold transition text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Privacy Team
            </Link>
            <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-600 px-6 py-3 text-slate-300 font-semibold hover:border-slate-400 hover:text-white transition text-sm">
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
              { name: "Terms of Service", href: "/terms" },
              { name: "Risk Disclosure", href: "/risk-disclosure" },
              { name: "AML & KYC Policy", href: "/aml-kyc" },
              { name: "Cookie Policy", href: "/cookies" },
            ].map((doc) => (
              <Link key={doc.name} href={doc.href} className="flex items-center gap-2 p-3 rounded-xl border border-slate-700/50 bg-slate-900/40 hover:border-violet-500/40 hover:bg-violet-500/5 transition text-sm text-slate-400 hover:text-white font-medium">
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