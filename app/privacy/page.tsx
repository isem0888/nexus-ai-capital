"use client";
import Link from "next/link";

export default function PrivacyPolicy() {
  const sections = [
    {
      title: "1. Introduction",
      content: `Welcome to Nexus AI Capital. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.

Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the site or use our services.`,
    },
    {
      title: "2. Information We Collect",
      content: `We may collect information about you in a variety of ways. The information we may collect includes:

• Personal Data: Email address, name, and other contact information you voluntarily provide.
• Wallet Addresses: Public blockchain wallet addresses when you connect your wallet.
• Usage Data: Information about how you access and use our platform, including IP address, browser type, operating system, and pages visited.
• Transaction Data: Information about transactions you initiate through our platform.
• Device Data: Information about the device you use to access our services.`,
    },
    {
      title: "3. How We Use Your Information",
      content: `We may use the information we collect for various purposes, including:

• To provide and maintain our services
• To process transactions and manage your account
• To communicate with you about updates, security alerts, and support messages
• To analyze usage patterns and improve our platform
• To detect, prevent, and address technical issues or fraudulent activity
• To comply with legal obligations and enforce our terms
• To provide customer support`,
    },
    {
      title: "4. Blockchain and Wallet Data",
      content: `When you connect a cryptocurrency wallet to our platform:

• We do not store your private keys or seed phrases.
• We only access your public wallet address and publicly available blockchain data.
• Blockchain transactions are immutable and publicly visible by nature.
• We cannot control or modify data already recorded on the blockchain.
• Third-party wallet providers may have their own privacy policies that govern their data collection practices.`,
    },
    {
      title: "5. Cookies and Tracking Technologies",
      content: `We may use cookies, beacons, tags, and scripts to analyze trends, administer the website, track users' movements, and gather demographic information.

You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our platform.

Types of cookies we use:

• Essential Cookies: Required for the platform to function properly.
• Analytics Cookies: Help us understand how visitors interact with our website.
• Preference Cookies: Remember your settings and preferences.`,
    },
    {
      title: "6. Data Sharing and Disclosure",
      content: `We may share your information in the following situations:

• With Service Providers: Third parties that perform services on our behalf.
• For Legal Requirements: When required by law, regulation, or legal process.
• To Protect Rights: To protect our rights, privacy, safety, or property.
• Business Transfers: In connection with a merger, acquisition, or sale of assets.
• With Your Consent: When you give us explicit permission to share your information.

We do not sell your personal information to third parties.`,
    },
    {
      title: "7. Data Security",
      content: `We implement appropriate technical and organizational security measures to protect your information, including:

• Encryption of data in transit and at rest
• Regular security audits and assessments
• Access controls and authentication mechanisms
• Employee training on data protection

However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security.`,
    },
    {
      title: "8. Your Data Protection Rights",
      content: `Depending on your location, you may have the following rights regarding your personal data:

• Right to Access: Request copies of your personal data.
• Right to Rectification: Request correction of inaccurate information.
• Right to Erasure: Request deletion of your personal data.
• Right to Restrict Processing: Request limitations on how we use your data.
• Right to Data Portability: Request transfer of your data to another organization.
• Right to Object: Object to our processing of your personal data.

To exercise any of these rights, please contact us at privacy@nexus-ai-capital.com.`,
    },
    {
      title: "9. Third-Party Services",
      content: `Our platform may contain links to third-party websites or services that are not operated by us. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.

We strongly advise you to review the Privacy Policy of every site you visit. Third-party services we may integrate with include:

• Blockchain networks and explorers
• Wallet providers (MetaMask, WalletConnect, etc.)
• Market data providers
• Analytics services`,
    },
    {
      title: "10. Children's Privacy",
      content: `Our services are not intended for use by individuals under the age of 18. We do not knowingly collect personally identifiable information from children.

If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us immediately. If we become aware that we have collected personal data from children without verification of parental consent, we will take steps to remove that information.`,
    },
    {
      title: "11. Changes to This Privacy Policy",
      content: `We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.

You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.

Continued use of our services after any modifications constitutes your acceptance of the updated Privacy Policy.`,
    },
    {
      title: "12. Contact Us",
      content: `If you have any questions about this Privacy Policy, please contact us:

Nexus AI Capital

Email: info@nexusinnovationscapital.com

Website: https://nexus-ai-capital.com

For data protection inquiries, you may also write to:

Legal Department
Nexus AI Capital
New York
8315 Northern
Blvd, Jackson
Heights, NY 11372
607-247-8905`,
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 text-violet-600 text-sm font-semibold mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Privacy & Security
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            Privacy{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
              Policy
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
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
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
            Have questions about our privacy practices?
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="mailto:privacy@nexus-ai-capital.com"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3 text-white font-semibold hover:from-violet-500 hover:to-blue-500 transition"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Privacy Team
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
              { name: "Terms of Service", href: "/terms" },
              { name: "Risk Disclosure", href: "/risk-disclosure" },
              { name: "AML & KYC Policy", href: "/aml-kyc" },
              { name: "Cookie Policy", href: "/cookies" },
            ].map((doc) => (
              <Link
                key={doc.name}
                href={doc.href}
                className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 hover:border-violet-500 hover:bg-violet-50 transition group"
              >
                <svg className="w-5 h-5 text-slate-400 group-hover:text-violet-600 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-slate-700 font-medium group-hover:text-violet-600 transition">
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