// app/api/plans/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Voucher from "@/models/Voucher";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    // Get stock counts for each plan
    const stockCounts = await Voucher.aggregate([
      {
        $match: { status: "unused" },
      },
      {
        $group: {
          _id: "$plan",
          count: { $sum: 1 },
        },
      },
    ]);

    const stockMap = stockCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>);

    // ── Plan Catalogue ────────────────────────────────────────────────────────
    // To add a new plan later, just add a new entry to this object.
    // The id must match what you use when uploading vouchers via the admin panel.
    // Set includes_tv_access: true on any plan that should also assign a PPSK.
    const PLANS_CONFIG = [
      {
        id: "unlimited",
        name: "Unlimited",
        duration: "30 Days",
        price: 300,
        data: "Unlimited",
        description: "Unlimited high-speed internet for your home or business",
        speed: "100Mbps",
        devices: "Up to 3 devices",
        popular: true,
        includes_tv_access: true,   // also assigns a PPSK password on purchase
      },
    ];
    // ─────────────────────────────────────────────────────────────────────────

    const plans = PLANS_CONFIG.map((plan) => ({
      ...plan,
      stock: stockMap[plan.id] || 0,
      available: (stockMap[plan.id] || 0) > 0,
    }));

    return NextResponse.json({ plans });
  } catch (error) {
    console.error("Plans API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}
