// app/api/admin/ppsk/check-expiry/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PpskPassword from "@/models/PpskPassword";
import { sendTelegramMessage } from "@/lib/telegram";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    const now = new Date();
    const threeDaysThreshold = new Date(now.getTime() - 27 * 24 * 60 * 60 * 1000); // 27 days ago
    const expiryThreshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

    // 1. Find PPSKs expiring in 3 days (assigned ~27 days ago)
    const expiringSoon = await PpskPassword.find({
      status: "assigned",
      assignedAt: { $lte: threeDaysThreshold },
      expiryNotification3DaySent: false,
    });

    // 2. Find PPSKs that have expired (assigned ~30 days ago)
    const expiredNow = await PpskPassword.find({
      status: "assigned",
      assignedAt: { $lte: expiryThreshold },
      expiryNotificationSent: false,
    });

    if (expiringSoon.length === 0 && expiredNow.length === 0) {
      return NextResponse.json({ success: true, message: "No expiries found today." });
    }

    // 3. Send Summary Message
    let summaryText = `🔔 *PPSK Expiry Alert Summary*\n\n`;
    if (expiredNow.length > 0) {
      summaryText += `🚨 *${expiredNow.length}* code(s) have reached 30-day expiry!\n`;
    }
    if (expiringSoon.length > 0) {
      summaryText += `⚠️ *${expiringSoon.length}* code(s) will expire in 3 days.\n`;
    }
    await sendTelegramMessage(summaryText);

    // 4. Send Individual Messages for Expired Codes
    for (const ppsk of expiredNow) {
      const message = `🚨 *PPSK EXPIRED (30 Days)*\n\n` +
        `🔑 Code: \`${ppsk.password}\`\n` +
        `📱 Phone: \`${ppsk.assignedToPhone}\`\n` +
        `📅 Assigned: ${ppsk.assignedAt?.toLocaleDateString()}\n\n` +
        `Please proceed to block this code on the Omada controller.`;
      
      const success = await sendTelegramMessage(message);
      if (success) {
        ppsk.expiryNotificationSent = true;
        // Also mark 3-day notification as sent in case it was skipped
        ppsk.expiryNotification3DaySent = true;
        await ppsk.save();
      }
    }

    // 5. Send Individual Messages for Warning Codes
    for (const ppsk of expiringSoon) {
      // Skip if already handled in expiredNow loop
      if (ppsk.expiryNotification3DaySent) continue;

      const message = `⚠️ *PPSK EXPIRING SOON (3 Days Left)*\n\n` +
        `🔑 Code: \`${ppsk.password}\`\n` +
        `📱 Phone: \`${ppsk.assignedToPhone}\`\n` +
        `📅 Assigned: ${ppsk.assignedAt?.toLocaleDateString()}\n\n` +
        `This code will reach 30 days in exactly 72 hours.`;
      
      const success = await sendTelegramMessage(message);
      if (success) {
        ppsk.expiryNotification3DaySent = true;
        await ppsk.save();
      }
    }

    return NextResponse.json({
      success: true,
      notified: {
        expired: expiredNow.length,
        warning: expiringSoon.length,
      },
    });
  } catch (error) {
    console.error("Expiry check error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
