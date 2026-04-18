// app/api/buy/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Sale from "@/models/Sale";
import Voucher from "@/models/Voucher";
import {
  generateSaleId,
  formatPhoneNumber,
  validatePhoneNumber,
} from "@/lib/utils";
import { initializeTransaction } from "@/lib/paystack";

// ── Plan Catalogue ─────────────────────────────────────────────────────────
// To add a new plan: add another key here with the same shape.
// The key must match the plan id used when uploading vouchers.
// Set includes_tv_access: true on any plan that should also assign a PPSK.
const PLANS = {
  basic: {
    name: "Basic",
    duration: "30 Days",
    price: 50,
    data: "30GB",
    speed: "50Mbps",
    devices: "Up to 2 devices",
    includes_tv_access: false,
  },
  pro: {
    name: "Pro",
    duration: "30 Days",
    price: 150,
    data: "95GB",
    speed: "50Mbps",
    devices: "Up to 2 devices",
    includes_tv_access: false,
  },
  unlimited: {
    name: "Unlimited",
    duration: "30 Days",
    price: 300,
    data: "Unlimited",
    speed: "100Mbps",
    devices: "Up to 3 devices",
    includes_tv_access: true,
  },
};
// ────────────────────────────────────────────────────────────────────────────


// Simple in-memory rate limiting (Note: clears on Vercel instance restart)
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

export async function POST(request: NextRequest) {
  try {
    const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const rateLimit = rateLimitMap.get(ip);

    if (rateLimit) {
      if (now > rateLimit.expiresAt) {
        rateLimitMap.set(ip, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW_MS });
      } else if (rateLimit.count >= MAX_REQUESTS_PER_WINDOW) {
        return NextResponse.json(
          { error: "Too many requests. Please try again in a minute." },
          { status: 429 }
        );
      } else {
        rateLimit.count++;
      }
    } else {
      rateLimitMap.set(ip, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW_MS });
    }

    await connectDB();

    const body = await request.json();
    const { plan, phone } = body;

    // Validate input
    if (!plan || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!PLANS[plan as keyof typeof PLANS]) {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    const formattedPhone = formatPhoneNumber(phone);
    if (!validatePhoneNumber(formattedPhone)) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    // Check stock availability
    const stockCount = await Voucher.countDocuments({
      plan,
      status: "unused",
    });

    if (stockCount < 1) {
      return NextResponse.json(
        { error: "Selected plan is out of stock" },
        { status: 400 }
      );
    }

    // Generate payment reference (sale will be created after successful payment)
    const planData = PLANS[plan as keyof typeof PLANS];
    const paymentRef = `WEB_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 6)}`;

    // Initialize Paystack transaction
    const paymentData = await initializeTransaction({
      email: `${formattedPhone}@readywifi.com`, // Use phone as email for Paystack
      amount: planData.price,
      currency: "GHS",
      reference: paymentRef,
      metadata: {
        plan,
        phone: formattedPhone,
        channel: "web",
        includes_tv_access: !!(planData as any).includes_tv_access,
      },
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?reference=${paymentRef}`,
    });

    return NextResponse.json({
      success: true,
      paymentRef,
      paymentUrl: paymentData.data.authorization_url,
      message: "Payment initialized successfully",
    });
  } catch (error) {
    console.error("Buy API error:", error);
    return NextResponse.json(
      { error: "Failed to process purchase" },
      { status: 500 }
    );
  }
}
