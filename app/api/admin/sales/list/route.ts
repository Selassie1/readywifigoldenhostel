// app/api/admin/sales/list/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Sale from "@/models/Sale";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const plan = searchParams.get("plan");
    const status = searchParams.get("status");
    const channel = searchParams.get("channel");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build filter
    const filter: any = {};
    if (plan) filter.plan = plan;
    if (status) filter.status = status;
    if (channel) filter.channel = channel;

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Get sales with pagination
    const skip = (page - 1) * limit;
    const sales = await Sale.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const total = await Sale.countDocuments(filter);

    // Get summary stats
    const stats = await Sale.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: "$amount" },
          paidSales: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          paidRevenue: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, "$amount", 0] },
          },
        },
      },
    ]);

    const summary = stats[0] || {
      totalSales: 0,
      totalRevenue: 0,
      paidSales: 0,
      paidRevenue: 0,
    };

    // --- Chart Data Aggregations ---
    // 1. Revenue by Plan
    const revenueByPlanStats = await Sale.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: "$plan",
          value: { $sum: "$amount" }
        }
      }
    ]);
    
    const revenueByPlan = revenueByPlanStats.map(item => ({
      name: item._id ? item._id.charAt(0).toUpperCase() + item._id.slice(1) : "Unknown",
      value: item.value
    }));

    // 2. Weekly Sales (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const weeklySalesStats = await Sale.aggregate([
      { 
        $match: { 
          status: "completed",
          createdAt: { $gte: sevenDaysAgo } 
        } 
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          sales: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Format weekly sales to fill missing days with 0 and use short day names
    const weeklySales = [];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    for (let i = 0; i < 7; i++) {
        const d = new Date(sevenDaysAgo);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        
        const statData = weeklySalesStats.find(s => s._id === dateStr);
        weeklySales.push({
            name: days[d.getDay()],
            sales: statData ? statData.sales : 0
        });
    }

    const chartData = {
        revenueByPlan,
        weeklySales
    };

    return NextResponse.json({
      sales,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      summary,
      chartData,
    });
  } catch (error) {
    console.error("Sales list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sales" },
      { status: 500 }
    );
  }
}
