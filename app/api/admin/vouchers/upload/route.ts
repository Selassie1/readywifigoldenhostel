// app/api/admin/vouchers/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Voucher from "@/models/Voucher";
import Batch from "@/models/Batch";
import AuditLog from "@/models/AuditLog";
import { generateBatchId } from "@/lib/utils";
import csv from "csv-parser";
import { Readable } from "stream";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const plan = formData.get("plan") as string;
    const batchId = generateBatchId();

    if (!file || !plan) {
      return NextResponse.json(
        { error: "File and plan are required" },
        { status: 400 }
      );
    }

    // Validate plan.
    // To add a new plan later, add its id to this array.
    const validPlans = ["basic", "pro", "unlimited"];
    if (!validPlans.includes(plan)) {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    // Parse CSV
    const csvData: string[] = [];
    const buffer = Buffer.from(await file.arrayBuffer());
    const stream = Readable.from(buffer.toString());

    await new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on("data", (row) => {
          // Handle TP-Link CSV format - look for 'Code' column
          const code = row.Code || row.code;
          if (code && code.trim()) {
            csvData.push(code.trim().toUpperCase());
          }
        })
        .on("end", resolve)
        .on("error", reject);
    });

    if (csvData.length === 0) {
      return NextResponse.json(
        { error: "No valid codes found in CSV" },
        { status: 400 }
      );
    }

    // Check for existing codes
    const existingVouchers = await Voucher.find({
      code: { $in: csvData },
    });
    const existingCodes = new Set(existingVouchers.map((v) => v.code));

    // Filter out existing codes
    const newCodes = csvData.filter((code) => !existingCodes.has(code));

    if (newCodes.length === 0) {
      return NextResponse.json({
        success: true,
        message: "All codes already exist",
        stats: {
          total: csvData.length,
          duplicates: csvData.length,
          imported: 0,
        },
      });
    }

    // Create vouchers
    const vouchers = newCodes.map((code) => ({
      code,
      plan,
      status: "unused",
      batchId,
    }));

    await Voucher.insertMany(vouchers);

    // Create batch record
    await Batch.create({
      batchId,
      source: "omada_csv",
      plan,
      count: newCodes.length,
      fileName: file.name,
    });

    // Log audit event
    await AuditLog.create({
      actor: "admin",
      action: "vouchers_uploaded",
      entityType: "batch",
      entityId: batchId,
      meta: {
        plan,
        totalCodes: csvData.length,
        duplicates: csvData.length - newCodes.length,
        imported: newCodes.length,
        fileName: file.name,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Vouchers uploaded successfully",
      stats: {
        total: csvData.length,
        duplicates: csvData.length - newCodes.length,
        imported: newCodes.length,
      },
      batchId,
    });
  } catch (error) {
    console.error("Voucher upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload vouchers" },
      { status: 500 }
    );
  }
}
