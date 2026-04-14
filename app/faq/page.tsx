// app/faq/page.tsx
"use client";

import Link from "next/link";
import {
  ArrowLeft,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Wifi,
  CreditCard,
  MessageSquare,
  Shield,
} from "lucide-react";
import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    question: "How do I purchase a WiFi voucher?",
    answer:
      "Simply select your desired data plan, enter your phone number, and complete the payment through our secure Paystack payment gateway. You'll receive your voucher code via SMS immediately after payment.",
    category: "General",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major payment methods including Visa, Mastercard, Mobile Money (MTN, Vodafone, AirtelTigo), and bank transfers through our secure Paystack integration.",
    category: "Payment",
  },
  {
    question: "How quickly will I receive my voucher code?",
    answer:
      "Voucher codes are delivered instantly via SMS to the phone number you provide during checkout. If you don't receive it within 5 minutes, please contact our support team.",
    category: "General",
  },
  {
    question: "How do I use my WiFi voucher code?",
    answer:
      "Connect to the WiFi network, open your browser, and enter the voucher code when prompted. The code will activate your data plan and provide internet access for the specified duration.",
    category: "Usage",
  },
  {
    question: "What if I don't receive my voucher code?",
    answer:
      "Check your SMS inbox and spam folder first. If you still haven't received it, contact our support team with your order reference number and we'll resend it immediately.",
    category: "Support",
  },
  {
    question: "Can I get a refund if I'm not satisfied?",
    answer:
      "Refunds are available under specific circumstances such as technical issues, duplicate payments, or service unavailability. Please see our Refund Policy for detailed information.",
    category: "Payment",
  },
  {
    question: "How long are voucher codes valid?",
    answer:
      "Voucher codes are valid for 30 days from the date of first activation. Unused codes will expire after this period and cannot be refunded.",
    category: "Usage",
  },
  {
    question: "Can I share my voucher code with others?",
    answer:
      "Voucher codes are for single use only and should not be shared. Each code is tied to your purchase and sharing may result in service termination.",
    category: "Usage",
  },
  {
    question: "What if I accidentally purchase the wrong plan?",
    answer:
      "Contact our support team immediately if you haven't used the voucher code yet. We may be able to exchange it for the correct plan within 1 hour of purchase.",
    category: "Support",
  },
  {
    question: "Is my payment information secure?",
    answer:
      "Yes, all payments are processed securely through Paystack, which is PCI DSS compliant. We never store your payment information on our servers.",
    category: "Security",
  },
  {
    question: "What should I do if the WiFi is slow?",
    answer:
      "Internet speed depends on various factors including network congestion, device capabilities, and location. Try moving closer to the WiFi source or contact the venue for assistance.",
    category: "Usage",
  },
  {
    question: "Can I use multiple voucher codes at once?",
    answer:
      "No, only one voucher code can be active at a time. You'll need to wait for your current session to expire or logout before using another code.",
    category: "Usage",
  },
  {
    question: "How do I contact customer support?",
    answer:
      "You can reach us via email at mrselasi@gmail.com, phone at +233 55 521 8254. We respond within 24 hours.",
    category: "Support",
  },
  {
    question: "What happens if I lose my voucher code?",
    answer:
      "Contact our support team with your order reference number and we can resend your voucher code to your registered phone number.",
    category: "Support",
  },
  {
    question: "Are there any hidden fees?",
    answer:
      "No, the price displayed at checkout is the final amount you'll pay. There are no hidden fees, taxes, or additional charges.",
    category: "Payment",
  },
];

const categories = [
  "All",
  "General",
  "Payment",
  "Usage",
  "Support",
  "Security",
];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openItems, setOpenItems] = useState<number[]>([]);

  const filteredFAQs =
    selectedCategory === "All"
      ? faqData
      : faqData.filter((faq) => faq.category === selectedCategory);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "General":
        return <Wifi className="h-4 w-4" />;
      case "Payment":
        return <CreditCard className="h-4 w-4" />;
      case "Usage":
        return <HelpCircle className="h-4 w-4" />;
      case "Support":
        return <MessageSquare className="h-4 w-4" />;
      case "Security":
        return <Shield className="h-4 w-4" />;
      default:
        return <HelpCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 shadow-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 sm:py-6">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl lg:rounded-2xl shadow-lg">
                <HelpCircle className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                  Frequently Asked Questions
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm hidden sm:block">
                  Get answers to common questions
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            Filter by Category
          </h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-cyan-500 text-white"
                    : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                }`}
              >
                {getCategoryIcon(category)}
                <span className="ml-2">{category}</span>
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className="bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-700/30 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    {getCategoryIcon(faq.category)}
                  </div>
                  <h3 className="text-white font-semibold">{faq.question}</h3>
                </div>
                {openItems.includes(index) ? (
                  <ChevronUp className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                )}
              </button>

              {openItems.includes(index) && (
                <div className="px-6 pb-4">
                  <div className="border-t border-slate-700/50 pt-4">
                    <p className="text-slate-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 sm:p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Still Have Questions?
            </h2>
            <p className="text-slate-400 mb-6">
              Can't find the answer you're looking for? Our support team is here
              to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:mrselasi@gmail.com"
                className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all duration-300"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Email Support
              </a>
              <a
                href="tel:+233555218254"
                className="flex items-center justify-center px-6 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition-all duration-300"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Call Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
