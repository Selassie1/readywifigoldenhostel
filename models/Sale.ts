// models/Sale.ts
import mongoose, { Document, Schema } from "mongoose";

export interface ISale extends Document {
  saleId: string;
  phone: string;
  plan: string;
  amount: number;
  currency: string;
  channel: 'web' | 'ussd';
  paymentProvider: string;
  paymentRef: string;
  status: 'pending' | 'paid' | 'completed' | 'failed' | 'refunded';
  voucherCode?: string;
  ppskPassword?: string;   // assigned when plan includes TV access
  smsSent?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SaleSchema = new Schema<ISale>(
  {
    saleId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
      index: true,
    },
    plan: {
      type: String,
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "GHS",
    },
    channel: {
      type: String,
      enum: ["web", "ussd"],
      required: true,
      index: true,
    },
    paymentProvider: {
      type: String,
      default: "paystack",
    },
    paymentRef: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "completed", "failed", "refunded"],
      default: "pending",
      index: true,
    },
    voucherCode: {
      type: String,
      index: true,
    },
    ppskPassword: {
      type: String,
      index: true,
    },
    smsSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Sale ||
  mongoose.model<ISale>("Sale", SaleSchema);
