// app/api/admin/fix-sales/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Sale from "@/models/Sale";
import Voucher from "@/models/Voucher";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    console.log("🔧 Starting sales data fix...");

    // Find all sales that have voucher codes but are still pending
    const salesWithVouchers = await Sale.find({
      voucherCode: { $exists: true, $ne: null },
      status: "pending",
    });

    console.log(
      `📋 Found ${salesWithVouchers.length} sales with vouchers but pending status`
    );

    // Update these sales to completed
    const updateResult = await Sale.updateMany(
      {
        voucherCode: { $exists: true, $ne: null },
        status: "pending",
      },
      {
        $set: { status: "completed" },
      }
    );

    console.log(
      `✅ Updated ${updateResult.modifiedCount} sales to completed status`
    );

    // Find vouchers that are marked as sold but their sales are still pending
    const soldVouchers = await Voucher.find({ status: "sold" });
    console.log(`🎫 Found ${soldVouchers.length} sold vouchers`);

    let vouchersFixed = 0;
    for (const voucher of soldVouchers) {
      // Find the corresponding sale
      const sale = await Sale.findOne({ voucherCode: voucher.code });
      if (sale && sale.status === "pending") {
        await Sale.findByIdAndUpdate(sale._id, { status: "completed" });
        vouchersFixed++;
      }
    }

    console.log(`✅ Fixed ${vouchersFixed} voucher-sale mismatches`);

    // Get updated stats
    const totalSales = await Sale.countDocuments();
    const completedSales = await Sale.countDocuments({ status: "completed" });
    const totalRevenue = await Sale.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const revenue = totalRevenue[0]?.total || 0;

    return NextResponse.json({
      success: true,
      message: "Sales data fixed successfully",
      stats: {
        totalSales,
        completedSales,
        totalRevenue: revenue,
        salesUpdated: updateResult.modifiedCount,
        vouchersFixed,
      },
    });
  } catch (error) {
    console.error("❌ Fix sales error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fix sales data" },
      { status: 500 }
    );
  }
}
