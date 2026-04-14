// app/api/admin/test-sms/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sendSms, formatVoucherSms, formatDualAccessSms } from "@/lib/sms";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get("phone");
  const type = searchParams.get("type") || "single"; // "single" or "dual"

  if (!phone) {
    return NextResponse.json({ 
      error: "Phone number is required. Usage: /api/admin/test-sms?phone=+233xxxxxx&type=dual" 
    }, { status: 400 });
  }

  try {
    let message = "";
    if (type === "dual") {
      message = formatDualAccessSms({
        voucherCode: "TEST-VOUCHER",
        ppskPassword: "TEST-PASSWORD",
      });
    } else {
      message = formatVoucherSms({
        voucherCode: "TEST-VOUCHER",
        plan: "Test Plan",
      });
    }

    const result = await sendSms({
      to: phone,
      message: message,
    });

    return NextResponse.json({
      success: result.status === "success",
      result,
      preview: message
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || "Failed to test SMS" 
    }, { status: 500 });
  }
}
