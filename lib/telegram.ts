// lib/telegram.ts
/**
 * Simple helper to send messages to a Telegram bot.
 * Requires TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env.local
 */

export async function sendTelegramMessage(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("⚠️ Telegram configuration missing. Skipping notification.");
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: "Markdown",
      }),
    });

    const result = await response.json();
    if (!result.ok) {
      console.error("❌ Telegram API error:", result.description);
      return false;
    }

    return true;
  } catch (error) {
    console.error("❌ Failed to send Telegram message:", error);
    return false;
  }
}
