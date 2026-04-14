// app/api/admin/sms/resend/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Sale from "@/models/Sale";
import SmsLog from "@/models/SmsLog";
import AuditLog from "@/models/AuditLog";
import { sendSms, formatVoucherSms } from "@/lib/sms";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { saleId } = body;

    if (!saleId) {
      return NextResponse.json(
        { error: "Sale ID is required" },
        { status: 400 }
      );
    }

    // Find the sale
    const sale = await Sale.findOne({ saleId });
    if (!sale) {
      return NextResponse.json({ error: "Sale not found" }, { status: 404 });
    }

    if (!sale.voucherCode) {
      return NextResponse.json(
        { error: "No voucher code available for this sale" },
        { status: 400 }
      );
    }

    if (sale.status !== "paid") {
      return NextResponse.json({ error: "Sale is not paid" }, { status: 400 });
    }

    // Send SMS
    const smsBody = formatVoucherSms({
      voucherCode: sale.voucherCode,
      plan: sale.plan,
    });

    const smsResponse = await sendSms({
      to: sale.phone,
      message: smsBody,
    });

    // Log SMS
    await SmsLog.create({
      to: sale.phone,
      body: smsBody,
      provider: "arkesel",
      status: smsResponse.status === "success" ? "sent" : "failed",
      messageId: smsResponse.data?.message_id,
      context: {
        saleId: sale.saleId,
        voucherCode: sale.voucherCode,
      },
    });

    // Log audit event
    await AuditLog.create({
      actor: "admin",
      action: "sms_resent",
      entityType: "sale",
      entityId: sale.saleId,
      meta: {
        voucherCode: sale.voucherCode,
        phone: sale.phone,
        smsSent: smsResponse.status === "success",
      },
    });

    return NextResponse.json({
      success: true,
      message: "SMS resent successfully",
      smsStatus: smsResponse.status === "success" ? "sent" : "failed",
    });
  } catch (error) {
    console.error("SMS resend error:", error);
    return NextResponse.json(
      { error: "Failed to resend SMS" },
      { status: 500 }
    );
  }
}
