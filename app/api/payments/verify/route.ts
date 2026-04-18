// app/api/payments/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import connectDB from "@/lib/mongodb";
import Sale from "@/models/Sale";
import Voucher from "@/models/Voucher";
import PpskPassword from "@/models/PpskPassword";
import { sendSms, formatVoucherSms, formatDualAccessSms } from "@/lib/sms";
import { sendTelegramMessage } from "@/lib/telegram";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        { success: false, error: "Payment reference is required" },
        { status: 400 }
      );
    }

    console.log("🔍 Verifying payment with reference:", reference);

    // Verify payment with Paystack
    const verification = await verifyPaymentWithPaystack(reference);

    if (!verification.success) {
      return NextResponse.json(
        { success: false, error: verification.error },
        { status: 400 }
      );
    }

    const paymentData = verification.data;

    // Check if payment was successful
    if (paymentData.status !== "success") {
      return NextResponse.json(
        {
          success: false,
          error: `Payment not successful. Status: ${paymentData.status}`,
        },
        { status: 400 }
      );
    }

    console.log("✅ Payment verified successfully:", {
      reference,
      amount: paymentData.amount,
      status: paymentData.status,
      metadata: paymentData.metadata,
    });

    // Connect to database
    await connectDB();

    // Check if sale already exists
    let sale = await Sale.findOne({ paymentRef: reference });

    if (sale) {
      console.log("📋 Sale already exists:", sale._id);

      // If sale exists but no voucher assigned, try to assign one
      if (!sale.voucherCode) {
        console.log("🔄 Assigning voucher to existing sale...");
        const voucherAssignment = await assignVoucherToSale(
          sale,
          paymentData.metadata
        );
        if (voucherAssignment.success) {
          sale = voucherAssignment.sale;
        }
      }

      // If plan includes TV access but no PPSK assigned yet, assign one now
      const includesTvAccessExisting =
        paymentData.metadata?.includes_tv_access === true ||
        paymentData.metadata?.includes_tv_access === "true";

      if (includesTvAccessExisting && sale.voucherCode && !sale.ppskPassword) {
        console.log("📺 Assigning missing PPSK to existing sale...");
        const ppsk = await PpskPassword.findOneAndUpdate(
          { status: "unused" },
          {
            status: "assigned",
            assignedToPhone: sale.phone,
            assignedChannel: "web",
            assignedAt: new Date(),
          },
          { new: true }
        );
        if (ppsk) {
          await Sale.findByIdAndUpdate(sale._id, { ppskPassword: ppsk.password });
          sale.ppskPassword = ppsk.password;
          console.log("✅ PPSK assigned to existing sale:", ppsk.password);

          // Telegram Notification
          await sendTelegramMessage(
            `🛒 *New Purchase (Recovery)*\n\n` +
              `📱 *Phone:* \`${sale.phone}\`\n` +
              `📦 *Plan:* ${sale.plan}\n` +
              `💵 *Amount:* GHS ${sale.amount}\n` +
              `\n🎫 *Voucher Code:* \`${sale.voucherCode}\`\n` +
              `📡 *PPSK Code:* \`${ppsk.password}\`\n` +
              `\n🔗 *Ref:* \`${sale.paymentRef}\`\n` +
              `📍 *Channel:* ${sale.channel}`
          );
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          reference: sale.paymentRef,
          amount: sale.amount,
          plan: sale.plan,
          voucherCode: sale.voucherCode,
          ppskPassword: sale.ppskPassword || null,
          includesTvAccess: !!sale.ppskPassword,
          phone: sale.phone,
          status: sale.status,
          createdAt: sale.createdAt,
        },
      });
    }

    // Create new sale record only if it doesn't exist
    console.log("📝 Creating new sale record...");
    const saleData = {
      saleId: `SALE-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)
        .toUpperCase()}`,
      paymentRef: reference,
      plan: paymentData.metadata.plan || "Unknown Plan",
      amount: paymentData.amount / 100, // Convert from pesewas to cedis
      phone: paymentData.metadata.phone || "Unknown",
      currency: "GHS",
      channel: "web" as const,
      paymentProvider: "paystack",
      status: "completed" as const,
      voucherCode: null, // Will be assigned below
    };

    console.log("📋 Sale data to create:", saleData);

    let newSale;
    try {
      newSale = await Sale.create(saleData);
      console.log("✅ Sale created:", newSale._id);
    } catch (createError) {
      console.error("❌ Sale creation error:", createError);
      throw createError;
    }

    // Assign voucher to the sale
    console.log("🎫 Assigning voucher to sale...");
    const voucherAssignment = await assignVoucherToSale(
      newSale,
      paymentData.metadata
    );

    if (!voucherAssignment.success) {
      console.error("❌ Failed to assign voucher:", voucherAssignment.error);
      return NextResponse.json(
        {
          success: false,
          error:
            "Payment verified but no vouchers available. Please contact support.",
        },
        { status: 400 }
      );
    }

    const finalSale = voucherAssignment.sale;

    // If this plan includes TV access, also assign a PPSK password
    const includesTvAccess = paymentData.metadata?.includes_tv_access === true
      || paymentData.metadata?.includes_tv_access === "true";

    if (includesTvAccess && finalSale.voucherCode) {
      console.log("📺 Assigning PPSK password for TV/Console access...");
      const ppsk = await PpskPassword.findOneAndUpdate(
        { status: "unused" },
        {
          status: "assigned",
          assignedToPhone: finalSale.phone,
          assignedChannel: "web",
          assignedAt: new Date(),
        },
        { new: true }
      );

      if (ppsk) {
        await Sale.findByIdAndUpdate(finalSale._id, { ppskPassword: ppsk.password });
        finalSale.ppskPassword = ppsk.password;
        console.log("✅ PPSK assigned:", ppsk.password);

        // Telegram Notification (with PPSK)
        await sendTelegramMessage(
          `🛒 *New Purchase*\n\n` +
            `📱 *Phone:* \`${finalSale.phone}\`\n` +
            `📦 *Plan:* ${finalSale.plan}\n` +
            `💵 *Amount:* GHS ${finalSale.amount}\n` +
            `\n🎫 *Voucher Code:* \`${finalSale.voucherCode}\`\n` +
            `📡 *PPSK Code:* \`${ppsk.password}\`\n` +
            `\n🔗 *Ref:* \`${finalSale.paymentRef}\`\n` +
            `📍 *Channel:* ${finalSale.channel}`
        );
      } else {
        console.warn("⚠️ No PPSK passwords available — TV access skipped");
      }
    } else if (!includesTvAccess && finalSale.voucherCode) {
      // Telegram Notification (voucher-only plans: Basic, Pro)
      await sendTelegramMessage(
        `🛒 *New Purchase*\n\n` +
          `📱 *Phone:* \`${finalSale.phone}\`\n` +
          `📦 *Plan:* ${finalSale.plan}\n` +
          `💵 *Amount:* GHS ${finalSale.amount}\n` +
          `\n🎫 *Voucher Code:* \`${finalSale.voucherCode}\`\n` +
          `\n🔗 *Ref:* \`${finalSale.paymentRef}\`\n` +
          `📍 *Channel:* ${finalSale.channel}`
      );
    }

    // Send SMS with voucher code (and PPSK if available)
    if (finalSale.voucherCode && finalSale.phone) {
      console.log("📱 Sending SMS with access codes via Arkesel...");
      try {
        let smsMessage: string;
        if (finalSale.ppskPassword) {
          smsMessage = formatDualAccessSms({
            voucherCode: finalSale.voucherCode,
            ppskPassword: finalSale.ppskPassword,
          });
        } else {
          smsMessage = formatVoucherSms({
            voucherCode: finalSale.voucherCode,
            plan: finalSale.plan,
          });
        }

        const smsResult = await sendSms({
          to: finalSale.phone,
          message: smsMessage,
        });

        if (smsResult.status === "success") {
          await Sale.findByIdAndUpdate(finalSale._id, { smsSent: true });
          console.log("✅ SMS sent successfully via Arkesel");
        } else {
          console.error("❌ SMS failed to send:", smsResult.message);
        }
      } catch (smsError) {
        console.error("❌ SMS error:", smsError);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        reference: finalSale.paymentRef,
        amount: finalSale.amount,
        plan: finalSale.plan,
        voucherCode: finalSale.voucherCode,
        ppskPassword: finalSale.ppskPassword || null,
        includesTvAccess: !!finalSale.ppskPassword,
        phone: finalSale.phone,
        status: finalSale.status,
        createdAt: finalSale.createdAt,
      },
    });
  } catch (error) {
    console.error("❌ Payment verification error:", error);
    return NextResponse.json(
      { success: false, error: "Payment verification failed" },
      { status: 500 }
    );
  }
}

async function verifyPaymentWithPaystack(reference: string) {
  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(
        reference
      )}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    console.log("📡 Paystack verification response:", {
      status: response.data.status,
      data: response.data.data,
    });

    if (response.data.status && response.data.data) {
      return {
        success: true,
        data: response.data.data,
      };
    } else {
      return {
        success: false,
        error: "Invalid response from Paystack",
      };
    }
  } catch (error: any) {
    console.error("❌ Paystack verification error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    return {
      success: false,
      error:
        error.response?.data?.message ||
        "Failed to verify payment with Paystack",
    };
  }
}

async function assignVoucherToSale(sale: any, metadata: any) {
  try {
    // Get plan from metadata (it's stored as 'plan' not 'planName')
    const planName = metadata.plan?.toLowerCase() || "unlimited";

    // Map plan names to our database plan names.
    // To add a new plan later, add its id here as both key and value.
    const planMapping: { [key: string]: string } = {
      "basic plan": "basic",
      basic: "basic",
      "pro plan": "pro",
      pro: "pro",
      "unlimited plan": "unlimited",
      unlimited: "unlimited",
    };

    const dbPlanName = planMapping[planName] || planName;

    console.log("🔍 Looking for voucher for plan:", dbPlanName);

    // Find an available voucher for this plan
    const voucher = await Voucher.findOne({
      plan: dbPlanName,
      status: "unused",
    });

    if (!voucher) {
      console.error("❌ No available vouchers for plan:", dbPlanName);
      return {
        success: false,
        error: `No vouchers available for ${planName} plan`,
      };
    }

    // Mark voucher as sold
    voucher.status = "sold";
    voucher.soldAt = new Date();
    voucher.soldToPhone = sale.phone;
    voucher.soldChannel = "web";
    await voucher.save();

    // Update sale with voucher code
    sale.voucherCode = voucher.code;
    sale.status = "completed";
    await sale.save();

    console.log("✅ Voucher assigned:", voucher.code);

    return {
      success: true,
      sale: sale,
      voucher: voucher,
    };
  } catch (error) {
    console.error("❌ Voucher assignment error:", error);
    return {
      success: false,
      error: "Failed to assign voucher",
    };
  }
}
