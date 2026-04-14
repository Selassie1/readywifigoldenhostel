// app/api/admin/clear-database/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Voucher from "@/models/Voucher";
import Sale from "@/models/Sale";
import Batch from "@/models/Batch";
import SmsLog from "@/models/SmsLog";
import UssdSession from "@/models/UssdSession";
import AuditLog from "@/models/AuditLog";

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    // Clear all collections
    await Voucher.deleteMany({});
    await Sale.deleteMany({});
    await Batch.deleteMany({});
    await SmsLog.deleteMany({});
    await UssdSession.deleteMany({});
    await AuditLog.deleteMany({});

    return NextResponse.json({
      success: true,
      message: "Database cleared successfully",
    });
  } catch (error) {
    console.error("Database clear error:", error);
    return NextResponse.json(
      { error: "Failed to clear database" },
      { status: 500 }
    );
  }
}

