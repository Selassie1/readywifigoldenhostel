// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI || "",
    PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY || "",
    PAYSTACK_PUBLIC_KEY: process.env.PAYSTACK_PUBLIC_KEY || "",
    MNOTIFY_API_KEY: process.env.MNOTIFY_API_KEY || "",
    MNOTIFY_SENDER_ID: process.env.MNOTIFY_SENDER_ID || "",
    WEBHOOK_SECRET: process.env.WEBHOOK_SECRET || "",
  },
};

module.exports = nextConfig;
