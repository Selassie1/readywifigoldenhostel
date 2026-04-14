// models/Voucher.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IVoucher extends Document {
  code: string;
  plan: string;
  status: 'unused' | 'reserved' | 'sold' | 'expired';
  batchId: string;
  soldToPhone?: string;
  soldChannel?: 'web' | 'ussd';
  soldAt?: Date;
  redeemedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VoucherSchema = new Schema<IVoucher>({
  code: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  plan: {
    type: String,
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: ['unused', 'reserved', 'sold', 'expired'],
    default: 'unused',
    index: true,
  },
  batchId: {
    type: String,
    required: true,
    index: true,
  },
  soldToPhone: {
    type: String,
    index: true,
  },
  soldChannel: {
    type: String,
    enum: ['web', 'ussd'],
  },
  soldAt: {
    type: Date,
  },
  redeemedAt: {
    type: Date,
  },
  notes: {
    type: String,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Voucher || mongoose.model<IVoucher>('Voucher', VoucherSchema);
