// lib/sms.ts
/**
 * SMS delivery via Arkesel API.
 * Using the v1 (Legacy) API as shown in the user's dashboard screenshot.
 *
 * Required env vars:
 *   ARKESEL_API_KEY  — from your Arkesel dashboard
 *   SUPPORT_PHONE    — shown inside SMS messages
 */

const ARKESEL_API_KEY = process.env.ARKESEL_API_KEY;
// Defaults to "Arkesel" as a test sender, but user likely needs to register one.
const ARKESEL_SENDER = process.env.ARKESEL_SENDER || "Arkesel";

export interface SmsResponse {
  status: "success" | "error";
  message: string;
  data?: {
    message_id: string;
  };
}

/**
 * Sends an SMS using the Arkesel v1 (GET) API as suggested by your dashboard screen.
 */
export async function sendSms(data: {
  to: string;
  message: string;
}): Promise<SmsResponse> {
  if (!ARKESEL_API_KEY) {
    console.warn("⚠️ ARKESEL_API_KEY not set — SMS skipped.");
    return { status: "error", message: "API key missing" };
  }

  // Normalise: Arkesel v1 needs the number without the leading +
  const recipient = data.to.replace(/^\+/, "");

  try {
    // Using the v1 URL structure from your dashboard screenshot
    const url = new URL("https://sms.arkesel.com/sms/api");
    url.searchParams.append("action", "send-sms");
    url.searchParams.append("api_key", ARKESEL_API_KEY);
    url.searchParams.append("to", recipient);
    url.searchParams.append("from", ARKESEL_SENDER);
    url.searchParams.append("sms", data.message);

    console.log("📤 Sending SMS via Arkesel (v1) to:", data.to);

    const response = await fetch(url.toString());
    
    // v1 API often returns different formats depending on 'response=json' param
    // But usually, it returns a simple text string or JSON if requested.
    // Let's force JSON if possible, but v1 is often just text.
    // Let's add &response=json to be sure.
    url.searchParams.append("response", "json");
    
    const jsonResponse = await fetch(url.toString());
    const result = await jsonResponse.json();

    console.log("📩 Arkesel v1 response:", result);

    // Arkesel v1 success check: code "ok" or "1000", or status "success"
    if (
      result.status === "success" ||
      result.code === "ok" ||
      result.code === "1000" ||
      result.message === "OK"
    ) {
      console.log("✅ SMS sent successfully via Arkesel v1");
      return {
        status: "success",
        message: "Message sent successfully",
        data: {
          message_id: result.id || result.uuid || result.message_id
        }
      };
    } else {
      console.error("❌ Arkesel v1 error:", result.message || result.error);
      return { 
        status: "error", 
        message: result.message || "Failed to send SMS",
        data: result
      };
    }
  } catch (error) {
    console.error("❌ Arkesel v1 fetch error:", error);
    return { status: "error", message: "Failed to connect to Arkesel API" };
  }
}

/** Pre-formatted SMS for a standard voucher-only plan */
export function formatVoucherSms(data: {
  voucherCode: string;
  plan: string;
  supportPhone?: string;
}): string {
  const support = data.supportPhone || process.env.SUPPORT_PHONE || "N/A";
  return `ReadyWifi: Your voucher for ${data.plan} is ${data.voucherCode}.\nConnect to ReadyWifi and enter the code on the portal. Support: ${support}`;
}

/** Pre-formatted SMS for Unlimited plan (voucher + PPSK) */
export function formatDualAccessSms(data: {
  voucherCode: string;
  ppskPassword: string;
  supportPhone?: string;
}): string {
  const support = data.supportPhone || process.env.SUPPORT_PHONE || "N/A";
  return (
    `ReadyWifi Plan activated!\n\n` +
    `PHONES/LAPTOPS:\n` +
    `Network: Ready Wifi\n` +
    `Voucher: ${data.voucherCode}\n\n` +
    `SMART TVs & CONSOLES:\n` +
    `Network: ReadyWifi TV/CONSOLE\n` +
    `Password: ${data.ppskPassword}\n\n` +
    `TV password locks to 1st device.\n` +
    `Support: ${support}`
  );
}
