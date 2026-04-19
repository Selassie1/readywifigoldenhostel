// app/api/admin/sales/[saleId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Sale from "@/models/Sale";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { saleId: string } }
) {
  try {
    await connectDB();

    const { saleId } = params;
    if (!saleId) {
      return NextResponse.json({ success: false, error: "Sale ID is required" }, { status: 400 });
    }

    const deleted = await Sale.findOneAndDelete({ saleId });

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("Delete order error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete order" }, { status: 500 });
  }
}
