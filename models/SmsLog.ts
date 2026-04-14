// models/SmsLog.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ISmsLog extends Document {
  to: string;
  body: string;
  provider: string;
  status: 'queued' | 'sent' | 'failed';
  messageId?: string;
  context: {
    saleId?: string;
    voucherCode?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const SmsLogSchema = new Schema<ISmsLog>({
  to: {
    type: String,
    required: true,
    index: true,
  },
  body: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    default: 'hubtel',
  },
  status: {
    type: String,
    enum: ['queued', 'sent', 'failed'],
    default: 'queued',
    index: true,
  },
  messageId: {
    type: String,
  },
  context: {
    saleId: String,
    voucherCode: String,
  },
}, {
  timestamps: true,
});

export default mongoose.models.SmsLog || mongoose.model<ISmsLog>('SmsLog', SmsLogSchema);
