// app/api/ussd/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import UssdSession from "@/models/UssdSession";
import Sale from "@/models/Sale";
import Voucher from "@/models/Voucher";
import { generateSaleId, formatPhoneNumber } from "@/lib/utils";
import { chargeMobileMoney } from "@/lib/paystack";

// ── Plan Catalogue ─────────────────────────────────────────────────────────
// To add a new plan: add another key here and update the menu strings below.
const PLANS = {
  unlimited: {
    name: "Unlimited",
    duration: "30 Days",
    price: 300,
    data: "Unlimited",
    speed: "100Mbps",
    devices: "3 devices",
  },
};
// ────────────────────────────────────────────────────────────────────────────


export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { sessionId, phoneNumber, serviceCode, text } = body;

    const phone = formatPhoneNumber(phoneNumber);
    const input = text ? text.split("*") : [];

    // Get or create session
    let session = await UssdSession.findOne({ sessionId });
    if (!session) {
      session = new UssdSession({
        sessionId,
        phone,
        state: "welcome",
      });
      await session.save();
    }

    let response = "";

    switch (session.state) {
      case "welcome":
        response = `Welcome to ReadyWifi.

1. Buy Internet
2. Check Voucher Status
3. Exit`;
        session.state = "main_menu";
        break;

      case "main_menu":
        if (input[input.length - 1] === "1") {
          response = `Choose plan:

1. Unlimited – Unlimited – GHS 300
2. Back`;
          session.state = "plan_selection";
        } else if (input[input.length - 1] === "2") {
          response = `Enter your voucher code:`;
          session.state = "voucher_check";
        } else if (input[input.length - 1] === "3") {
          response = `Thank you for using ReadyWifi. Goodbye!`;
          session.state = "end";
        } else {
          response = `Invalid option. Please try again.

1. Buy Internet
2. Check Voucher Status
3. Exit`;
        }
        break;

      case "plan_selection":
        const planChoice = input[input.length - 1];
        if (planChoice === "2") {
          response = `Welcome to ReadyWifi.

1. Buy Internet
2. Check Voucher Status
3. Exit`;
          session.state = "main_menu";
        } else if (planChoice === "1") {
          const selectedPlan = "unlimited";
          const plan = PLANS[selectedPlan as keyof typeof PLANS];

          session.chosenPlan = selectedPlan;
          response = `${plan.name} – ${plan.data} – GHS ${plan.price}
Speed: ${plan.speed}
Devices: ${plan.devices}

1. Proceed
2. Back`;
          session.state = "plan_confirmation";
        } else {
          response = `Invalid option. Please try again.

1. Unlimited – Unlimited – GHS 300
2. Back`;
        }
        break;

      case "plan_confirmation":
        const confirmChoice = input[input.length - 1];
        if (confirmChoice === "2") {
          response = `Choose plan:

1. Unlimited – Unlimited – GHS 300
2. Back`;
          session.state = "plan_selection";
        } else if (confirmChoice === "1") {
          // Check stock availability
          const stockCount = await Voucher.countDocuments({
            plan: session.chosenPlan,
            status: "unused",
          });

          if (stockCount < 1) {
            response = `Sorry, ${
              PLANS[session.chosenPlan as keyof typeof PLANS].name
            } plan is currently out of stock. Please try again later.

1. Unlimited – Unlimited – GHS 300
2. Back`;
            session.state = "plan_selection";
          } else {
            // Create sale and initiate payment
            const plan = PLANS[session.chosenPlan as keyof typeof PLANS];
            const saleId = generateSaleId();
            const paymentRef = `USS_${Date.now()}_${Math.random()
              .toString(36)
              .substr(2, 6)}`;

            const sale = new Sale({
              saleId,
              phone,
              plan: session.chosenPlan,
              amount: plan.price,
              currency: "GHS",
              channel: "ussd",
              paymentRef,
              status: "pending",
            });
            await sale.save();

            session.pendingSaleId = saleId;
            session.state = "payment_pending";

            try {
              // Initiate MoMo charge
              await chargeMobileMoney({
                phone,
                amount: plan.price,
                reference: paymentRef,
                metadata: {
                  saleId,
                  plan: session.chosenPlan,
                  channel: "ussd",
                },
              });

              response = `You'll receive a mobile money prompt. Enter your PIN to approve.
You'll get an SMS with your access code after payment.`;
            } catch (error) {
              response = `Payment initiation failed. Please try again later.`;
              session.state = "main_menu";
            }
          }
        } else {
          const plan = PLANS[session.chosenPlan as keyof typeof PLANS];
          response = `${plan.name} – ${plan.duration} – GHS ${plan.price}.

1. Proceed
2. Back`;
        }
        break;

      case "voucher_check":
        const voucherCode = input[input.length - 1];
        const voucher = await Voucher.findOne({
          code: voucherCode.toUpperCase(),
        });

        if (!voucher) {
          response = `Code not found. Check and try again.

1. Buy Internet
2. Check Voucher Status
3. Exit`;
          session.state = "main_menu";
        } else {
          let statusMessage = "";
          switch (voucher.status) {
            case "unused":
              statusMessage = "Voucher is valid and unused.";
              break;
            case "sold":
              statusMessage = "Voucher is sold; redeem on the Wi-Fi portal.";
              break;
            case "expired":
              statusMessage = "Voucher expired.";
              break;
            default:
              statusMessage = "Voucher status unknown.";
          }

          response = `${statusMessage}

1. Buy Internet
2. Check Voucher Status
3. Exit`;
          session.state = "main_menu";
        }
        break;

      case "payment_pending":
        response = `Payment is being processed. You'll receive an SMS with your voucher code shortly.

1. Buy Internet
2. Check Voucher Status
3. Exit`;
        session.state = "main_menu";
        break;

      case "end":
        response = `Thank you for using ReadyWifi. Goodbye!`;
        break;

      default:
        response = `Welcome to ReadyWifi.

1. Buy Internet
2. Check Voucher Status
3. Exit`;
        session.state = "main_menu";
    }

    session.updatedAt = new Date();
    await session.save();

    return NextResponse.json({
      response: response,
      continue: session.state !== "end",
    });
  } catch (error) {
    console.error("USSD error:", error);
    return NextResponse.json(
      {
        response: "An error occurred. Please try again later.",
        continue: false,
      },
      { status: 500 }
    );
  }
}
