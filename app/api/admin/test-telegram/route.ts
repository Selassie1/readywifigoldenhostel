// app/api/admin/test-telegram/route.ts
import { NextResponse } from "next/server";
import { sendTelegramMessage } from "@/lib/telegram";

export async function GET() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return NextResponse.json({
      success: false,
      error: "Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in .env.local",
    });
  }

  // ── 1. Simulate: New Purchase notification ───────────────────────────────
  await sendTelegramMessage(
    `🛒 *New Purchase*\n\n` +
      `📱 *Phone:* \`+233555218254\`\n` +
      `📦 *Plan:* unlimited\n` +
      `💵 *Amount:* GHS 305.97\n` +
      `\n🎫 *Voucher Code:* \`486646\`\n` +
      `📡 *PPSK Code:* \`G3n3sis-2024\`\n` +
      `\n🔗 *Ref:* \`WEB_1776148761788_f3m7vc\`\n` +
      `📍 *Channel:* web`
  );

  await new Promise((r) => setTimeout(r, 800));

  // ── 2. Simulate: Expiry Summary ──────────────────────────────────────────
  await sendTelegramMessage(
    `🔔 *PPSK Expiry Alert Summary*\n\n` +
      `🚨 *2* code(s) have reached 30-day expiry!\n` +
      `⚠️ *3* code(s) will expire in 3 days.`
  );

  await new Promise((r) => setTimeout(r, 800));

  // ── 3. Simulate: Individual 3-Day Warning ────────────────────────────────
  await sendTelegramMessage(
    `⚠️ *PPSK EXPIRING SOON — 3 Days Left*\n\n` +
      `🔑 *Code:* \`G3n3sis-2024\`\n` +
      `📱 *Phone:* \`+233555218254\`\n` +
      `📅 *Assigned:* 11 Apr 2026\n` +
      `📅 *Expires:* 14 Apr 2026\n\n` +
      `_Plan to block this on the Omada controller in the next 72 hours._`
  );

  await new Promise((r) => setTimeout(r, 800));

  // ── 4. Simulate: Individual Expired Alert ────────────────────────────────
  await sendTelegramMessage(
    `🚨 *PPSK EXPIRED — 30 Days Reached*\n\n` +
      `🔑 *Code:* \`5unr1se-9871\`\n` +
      `📱 *Phone:* \`+233244567890\`\n` +
      `📅 *Assigned:* 14 Mar 2026\n` +
      `📅 *Expired:* 14 Apr 2026\n\n` +
      `🛑 *Action Required:* Block this code on the Omada controller now.`
  );

  return NextResponse.json({
    success: true,
    message: "4 simulated messages sent to Telegram. Check your bot!",
    sent: [
      "1. New Purchase",
      "2. Expiry Summary",
      "3. 3-Day Warning (individual)",
      "4. Expired Alert (individual)",
    ],
  });
}
