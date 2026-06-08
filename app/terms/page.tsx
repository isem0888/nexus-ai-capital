"use client";
import Link from "next/link";

export default function TermsOfService() {
  const sections = [
    {
      title: "1. Introduction",
      content: `Welcome to Nexus AI Capital. By accessing or using our website, services, applications, or digital platforms, you agree to be bound by these Terms of Service.

If you do not agree with these terms, please discontinue use of our services.`,
    },
    {
      title: "2. Nature of Services",
      content: `Nexus AI Capital provides information regarding AI-driven investment technologies, digital asset management solutions, market analytics, and related financial technology services.

Information provided on this website is for informational and educational purposes only.`,
    },
    {
      title: "3. No Financial Advice",
      content: `Nothing on this website constitutes:

• Financial advice
• Investment advice
• Legal advice
• Tax advice
• A recommendation to buy or sell any asset

Users are solely responsible for their own investment decisions.`,
    },
    {
      title: "4. Risk Disclosure",
      content: `Investments in digital assets, cryptocurrencies, DeFi protocols, and financial markets involve significant risk.

Users acknowledge that:

• Asset values may fluctuate.
• Past performance does not guarantee future results.
• Loss of capital is possible.

Nexus AI Capital makes no guarantees regarding profitability or investment performance.`,
    },
    {
      title: "5. Wallet Connections",
      content: `Users may connect third-party cryptocurrency wallets.

Nexus AI Capital:

• Does not store private keys.
• Does not control user wallets.
• Cannot recover lost credentials.
• Is not responsible for third-party wallet providers.`,
    },
    {
      title: "6. User Responsibilities",
      content: `Users agree:

• To provide accurate information.
• Not to use the platform for illegal activities.
• Not to attempt unauthorized access to systems or data.
• To comply with applicable laws and regulations.`,
    },
    {
      title: "7. Intellectual Property",
      content: `All website content, branding, graphics, software, designs, and proprietary technologies remain the property of Nexus AI Capital unless otherwise stated.

Unauthorized reproduction or distribution is prohibited.`,
    },
    {
      title: "8. Limitation of Liability",
      content: `To the fullest extent permitted by law, Nexus AI Capital shall not be liable for:

• Financial losses
• Trading losses
• Loss of profits
• Loss of digital assets
• Service interruptions
• Third-party platform failures`,
    },
    {
      title: "9. Third-Party Services",
      content: `The platform may integrate with:

• Blockchain networks
• Wallet providers
• Market data providers
• Third-party APIs

Nexus AI Capital is not responsible for the availability or performance of third-party services.`,
    },
    {
      title: "10. Modifications",
      content: `We reserve the right to modify these Terms of Service at any time.

Continued use of the platform constitutes acceptance of updated terms.`,
    },
    {
      title: "11. Contact Information",
      content: `For questions regarding these Terms of Service:

Nexus AI Capital

Email: info@nexusinnovationscapital.com

Website: https://nexus-ai-capital.com`,
    },
  ];

  return (
    <main className="relative min-h-screen bg-slate-50">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute left-[-300px] top-[100px] h-[700px] w-[700px] rounded-full bg-blue-600/5 blur-[250px]" />
        <div className="absolute right-[-250px] top-[200px] h-[800px] w-[800px] rounded-full bg-violet-500/5 blur-[250px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-10 py-6 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-4 cursor-pointer">
          <img src="/logo.png" alt="Nexus AI Capital" className="h-12 w-auto" />
          <span className="font-bold text-3xl bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            NEXUS
          </span>
        </Link>
        <Link
          href="/"
          className="rounded-xl border border-slate-300 px-5 py-2 text-slate-600 hover:border-blue-500 hover:text-blue-600 transition"
        >
          Back to Home
        </Link>
      </nav>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-10 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Legal Documents
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Terms of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
              Service
            </span>
          </h1>
          <p className="text-slate-600 text-lg">Last Updated: Feb 2026</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-10 md:p-16">
          <div className="prose prose-slate max-w-none">
            {sections.map((section, index) => (
              <div key={index} className="mb-10 last:mb-0">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  {section.title.replace(/^\d+\.\s*/, "")}
                </h2>
                <div className="text-slate-600 leading-relaxed pl-11">
                  {section.content.split("\n").map((paragraph, i) => (
                    <p key={i} className="mb-3 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
                {index < sections.length - 1 && (
                  <div className="mt-10 border-t border-slate-100" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-6">
            Have questions about our terms?
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="mailto:legal@nexus-ai-capital.com"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 text-white font-semibold hover:from-blue-500 hover:to-violet-500 transition"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Legal Team
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-6 py-3 text-slate-700 font-semibold hover:border-blue-500 hover:text-blue-600 transition"
            >
              Back to Platform
            </Link>
          </div>
        </div>

        {/* Additional Legal Links */}
        <div className="mt-16 pt-10 border-t border-slate-200">
          <div className="text-center mb-6">
            <p className="text-slate-600 text-sm mb-4">Other Legal Documents</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Privacy Policy", href: "/privacy" },
              { name: "Risk Disclosure", href: "/risk-disclosure" },
              { name: "AML & KYC Policy", href: "/aml-kyc" },
              { name: "Cookie Policy", href: "/cookies" },
            ].map((doc) => (
              <Link
                key={doc.name}
                href={doc.href}
                className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 hover:border-blue-500 hover:bg-blue-50 transition group"
              >
                <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-slate-700 font-medium group-hover:text-blue-600 transition">
                  {doc.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center font-black text-white">
                N
              </div>
              <div>
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  NEXUS Investment Fund
                  <span className="text-xs font-normal text-slate-400">•</span>
                  <span className="text-xs font-medium text-slate-500">A NEXO Company</span>
                </div>
                <div className="text-xs text-slate-500">
                  © 2026 — The future of decentralized investments
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}