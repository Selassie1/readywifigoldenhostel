// app/privacy/page.tsx
"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  Lock,
  Eye,
  Database,
  User,
  Mail,
  Phone,
} from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 shadow-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 sm:py-6">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl lg:rounded-2xl shadow-lg">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                  Privacy Policy
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm hidden sm:block">
                  ReadyWifi Privacy Protection
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="flex items-center px-3 sm:px-4 py-2 sm:py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-300 border border-slate-600/50 hover:border-cyan-500/50"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="text-sm sm:text-base">Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 sm:p-8 lg:p-12">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-cyan-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">Privacy Policy</h2>
            </div>
            <p className="text-slate-400 text-sm sm:text-base">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-8">
            {/* Introduction */}
            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Lock className="h-5 w-5 text-green-400 mr-2" />
                Introduction
              </h3>
              <p className="text-slate-300 leading-relaxed">
                At ReadyWifi, we are committed to protecting your privacy and
                ensuring the security of your personal information. This Privacy
                Policy explains how we collect, use, disclose, and safeguard
                your information when you use our WiFi voucher services.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Database className="h-5 w-5 text-blue-400 mr-2" />
                Information We Collect
              </h3>

              <div className="space-y-6">
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <h4 className="text-cyan-400 font-semibold mb-2">
                    Personal Information
                  </h4>
                  <ul className="list-disc list-inside text-slate-300 space-y-1 text-sm">
                    <li>Phone number (for SMS delivery)</li>
                    <li>Email address (if provided)</li>
                    <li>
                      Payment information (processed securely by Paystack)
                    </li>
                    <li>IP address and device information</li>
                  </ul>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4">
                  <h4 className="text-cyan-400 font-semibold mb-2">
                    Usage Information
                  </h4>
                  <ul className="list-disc list-inside text-slate-300 space-y-1 text-sm">
                    <li>Voucher purchase history</li>
                    <li>Service usage patterns</li>
                    <li>Website interaction data</li>
                    <li>Support communications</li>
                  </ul>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4">
                  <h4 className="text-cyan-400 font-semibold mb-2">
                    Technical Information
                  </h4>
                  <ul className="list-disc list-inside text-slate-300 space-y-1 text-sm">
                    <li>Browser type and version</li>
                    <li>Operating system</li>
                    <li>Device identifiers</li>
                    <li>Log files and analytics data</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Eye className="h-5 w-5 text-purple-400 mr-2" />
                How We Use Your Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <h4 className="text-green-400 font-semibold mb-2">
                    Service Delivery
                  </h4>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li>• Process voucher purchases</li>
                    <li>• Send SMS notifications</li>
                    <li>• Provide customer support</li>
                    <li>• Verify transactions</li>
                  </ul>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <h4 className="text-blue-400 font-semibold mb-2">
                    Service Improvement
                  </h4>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li>• Analyze usage patterns</li>
                    <li>• Improve our services</li>
                    <li>• Develop new features</li>
                    <li>• Monitor performance</li>
                  </ul>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                  <h4 className="text-purple-400 font-semibold mb-2">
                    Security & Compliance
                  </h4>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li>• Prevent fraud</li>
                    <li>• Ensure security</li>
                    <li>• Comply with laws</li>
                    <li>• Protect rights</li>
                  </ul>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                  <h4 className="text-amber-400 font-semibold mb-2">
                    Communication
                  </h4>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li>• Send important updates</li>
                    <li>• Respond to inquiries</li>
                    <li>• Provide notifications</li>
                    <li>• Share service changes</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Information Sharing */}
            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <User className="h-5 w-5 text-orange-400 mr-2" />
                Information Sharing and Disclosure
              </h3>

              <div className="space-y-4">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <h4 className="text-red-400 font-semibold mb-2">
                    We DO NOT sell your personal information
                  </h4>
                  <p className="text-slate-300 text-sm">
                    We do not sell, trade, or rent your personal information to
                    third parties for marketing purposes.
                  </p>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">
                    Limited Sharing
                  </h4>
                  <p className="text-slate-300 text-sm mb-2">
                    We may share your information only in these limited
                    circumstances:
                  </p>
                  <ul className="list-disc list-inside text-slate-300 text-sm space-y-1 ml-4">
                    <li>
                      With payment processors (Paystack) for transaction
                      processing
                    </li>
                    <li>With SMS service providers for voucher delivery</li>
                    <li>When required by law or legal process</li>
                    <li>To protect our rights and prevent fraud</li>
                    <li>With your explicit consent</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Shield className="h-5 w-5 text-green-400 mr-2" />
                Data Security
              </h3>

              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <h4 className="text-green-400 font-semibold mb-2">
                    Security Measures
                  </h4>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li>• SSL encryption for all data transmission</li>
                    <li>• Secure servers with regular security updates</li>
                    <li>• Access controls and authentication</li>
                    <li>• Regular security audits and monitoring</li>
                    <li>• PCI DSS compliant payment processing</li>
                  </ul>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                  <h4 className="text-amber-400 font-semibold mb-2">
                    Data Retention
                  </h4>
                  <p className="text-slate-300 text-sm">
                    We retain your personal information only as long as
                    necessary to provide our services and comply with legal
                    obligations. Transaction data is typically retained for 7
                    years for accounting and legal purposes.
                  </p>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <User className="h-5 w-5 text-cyan-400 mr-2" />
                Your Privacy Rights
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <h4 className="text-cyan-400 font-semibold mb-2">
                    Access & Portability
                  </h4>
                  <p className="text-slate-300 text-sm">
                    Request a copy of your personal data
                  </p>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4">
                  <h4 className="text-cyan-400 font-semibold mb-2">
                    Correction
                  </h4>
                  <p className="text-slate-300 text-sm">
                    Update or correct inaccurate information
                  </p>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4">
                  <h4 className="text-cyan-400 font-semibold mb-2">Deletion</h4>
                  <p className="text-slate-300 text-sm">
                    Request deletion of your personal data
                  </p>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4">
                  <h4 className="text-cyan-400 font-semibold mb-2">Opt-out</h4>
                  <p className="text-slate-300 text-sm">
                    Unsubscribe from marketing communications
                  </p>
                </div>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Database className="h-5 w-5 text-purple-400 mr-2" />
                Cookies and Tracking
              </h3>
              <p className="text-slate-300 leading-relaxed mb-4">
                We use cookies and similar technologies to enhance your
                experience, analyze usage, and improve our services. You can
                control cookie settings through your browser preferences.
              </p>
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">
                  Types of Cookies We Use:
                </h4>
                <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
                  <li>
                    <strong>Essential Cookies:</strong> Required for basic
                    website functionality
                  </li>
                  <li>
                    <strong>Analytics Cookies:</strong> Help us understand how
                    visitors use our site
                  </li>
                  <li>
                    <strong>Preference Cookies:</strong> Remember your settings
                    and preferences
                  </li>
                </ul>
              </div>
            </section>

            {/* Third-Party Services */}
            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Shield className="h-5 w-5 text-blue-400 mr-2" />
                Third-Party Services
              </h3>
              <p className="text-slate-300 leading-relaxed mb-4">
                We use trusted third-party services to provide our services.
                These partners have their own privacy policies:
              </p>
              <div className="space-y-3">
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <h4 className="text-blue-400 font-semibold mb-1">Paystack</h4>
                  <p className="text-slate-300 text-sm">
                    Payment processing - handles all payment data securely
                  </p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <h4 className="text-blue-400 font-semibold mb-1">MNotify</h4>
                  <p className="text-slate-300 text-sm">
                    SMS delivery service - processes phone numbers for voucher
                    delivery
                  </p>
                </div>
              </div>
            </section>

            {/* Children's Privacy */}
            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <User className="h-5 w-5 text-pink-400 mr-2" />
                Children's Privacy
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Our services are not intended for children under 13 years of
                age. We do not knowingly collect personal information from
                children under 13. If we become aware that we have collected
                personal information from a child under 13, we will take steps
                to delete such information.
              </p>
            </section>

            {/* Changes to Policy */}
            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Shield className="h-5 w-5 text-amber-400 mr-2" />
                Changes to This Privacy Policy
              </h3>
              <p className="text-slate-300 leading-relaxed">
                We may update this Privacy Policy from time to time. We will
                notify you of any material changes by posting the new Privacy
                Policy on this page and updating the "Last updated" date. We
                encourage you to review this Privacy Policy periodically for any
                changes.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Mail className="h-5 w-5 text-green-400 mr-2" />
                Contact Us
              </h3>
              <p className="text-slate-300 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our
                privacy practices, please contact us:
              </p>
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-cyan-400 font-semibold mb-2">Email</h4>
                    <p className="text-slate-300 text-sm">mrselasi@gmail.com</p>
                  </div>
                  <div>
                    <h4 className="text-cyan-400 font-semibold mb-2">Phone</h4>
                    <p className="text-slate-300 text-sm">+233 55 521 8254</p>
                  </div>
                  <div>
                    <h4 className="text-cyan-400 font-semibold mb-2">
                      Location
                    </h4>
                    <p className="text-slate-300 text-sm">Tamale, Ghana</p>
                  </div>
                  <div>
                    <h4 className="text-cyan-400 font-semibold mb-2">
                      Response Time
                    </h4>
                    <p className="text-slate-300 text-sm">Within 48 hours</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-700/50">
            <p className="text-slate-400 text-sm text-center">
              This Privacy Policy is effective as of{" "}
              {new Date().toLocaleDateString()} and applies to all ReadyWifi
              services and users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
