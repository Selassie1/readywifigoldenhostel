// app/api/webhooks/paystack/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Sale from "@/models/Sale";
import Voucher from "@/models/Voucher";
import PpskPassword from "@/models/PpskPassword";
import { sendSms, formatVoucherSms, formatDualAccessSms } from "@/lib/sms";
import { sendTelegramMessage } from "@/lib/telegram";
import { verifyWebhookSignature } from "@/lib/paystack";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-paystack-signature") || "";

    // Verify the webhook is actually from Paystack
    if (!verifyWebhookSignature(rawBody, signature, PAYSTACK_SECRET_KEY)) {
      console.error("❌ Invalid Paystack webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    console.log("📩 Paystack webhook event:", event.event);

    // We only care about successful charge completions
    if (event.event !== "charge.success") {
      return NextResponse.json({ received: true });
    }

    const data      = event.data;
    const reference = data.reference as string;
    const metadata  = data.metadata || {};
    const channel   = metadata.channel || "unknown";

    // Only handle USSD-originated payments here; web payments are handled by the verify route GET
    if (channel !== "ussd") {
      console.log(`ℹ️ Webhook for non-USSD channel (${channel}). Skipping.`);
      return NextResponse.json({ received: true });
    }

    console.log(`✅ USSD charge.success for ref: ${reference}`);

    await connectDB();

    // Find the pending sale created by the USSD route
    const sale = await Sale.findOne({ paymentRef: reference });

    if (!sale) {
      console.warn(`⚠️ No sale found for paymentRef: ${reference}`);
      return NextResponse.json({ received: true });
    }

    if (sale.status === "completed") {
      console.log("ℹ️ Sale already completed:", sale.saleId);
      return NextResponse.json({ received: true });
    }

    const planName = sale.plan?.toLowerCase() || "unlimited";

    // ── Assign voucher ────────────────────────────────────────────────
    const voucher = await Voucher.findOne({ plan: planName, status: "unused" });

    if (!voucher) {
      console.error(`❌ No vouchers available for plan: ${planName}`);
      // Mark sale failed so admin can see it
      await Sale.findByIdAndUpdate(sale._id, { status: "failed" });
      await sendTelegramMessage(
        `⚠️ *USSD Payment Success — No Voucher Available*\n\n` +
        `📱 *Phone:* \`${sale.phone}\`\n` +
        `📦 *Plan:* ${sale.plan}\n` +
        `💵 *Amount:* GHS ${sale.amount}\n` +
        `🔗 *Ref:* \`${reference}\`\n\n` +
        `Please assign a voucher manually and resend SMS.`
      );
      return NextResponse.json({ received: true });
    }

    // Mark voucher as sold
    voucher.status = "sold";
    voucher.soldAt = new Date();
    voucher.soldToPhone = sale.phone;
    voucher.soldChannel = "ussd";
    await voucher.save();

    // Update sale to completed
    sale.voucherCode = voucher.code;
    sale.status = "completed";
    await sale.save();

    console.log("🎫 Voucher assigned for USSD sale:", voucher.code);

    // ── Optionally assign PPSK for unlimited plan ─────────────────────
    let ppskPassword: string | null = null;

    if (planName === "unlimited") {
      const ppsk = await PpskPassword.findOneAndUpdate(
        { status: "unused" },
        { status: "assigned", assignedToPhone: sale.phone, assignedChannel: "ussd", assignedAt: new Date() },
        { new: true }
      );
      if (ppsk) {
        await Sale.findByIdAndUpdate(sale._id, { ppskPassword: ppsk.password });
        ppskPassword = ppsk.password;
        console.log("📺 PPSK assigned for USSD unlimited:", ppsk.password);
      }
    }

    // ── Telegram notification ─────────────────────────────────────────
    await sendTelegramMessage(
      `🛒 *New USSD Purchase*\n\n` +
      `📱 *Phone:* \`${sale.phone}\`\n` +
      `📦 *Plan:* ${sale.plan}\n` +
      `💵 *Amount:* GHS ${sale.amount}\n` +
      `\n🎫 *Voucher Code:* \`${voucher.code}\`\n` +
      (ppskPassword ? `📡 *PPSK Code:* \`${ppskPassword}\`\n` : "") +
      `\n🔗 *Ref:* \`${reference}\`\n` +
      `📍 *Channel:* USSD`
    );

    // ── Send SMS to customer ──────────────────────────────────────────
    try {
      let smsMessage: string;
      if (ppskPassword) {
        smsMessage = formatDualAccessSms({ voucherCode: voucher.code, ppskPassword });
      } else {
        smsMessage = formatVoucherSms({ voucherCode: voucher.code, plan: sale.plan });
      }

      const smsResult = await sendSms({ to: sale.phone, message: smsMessage });
      if (smsResult.status === "success") {
        await Sale.findByIdAndUpdate(sale._id, { smsSent: true });
        console.log("📱 SMS sent to USSD customer:", sale.phone);
      } else {
        console.error("❌ SMS failed:", smsResult.message);
      }
    } catch (smsError) {
      console.error("❌ SMS error:", smsError);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Webhook handler error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
