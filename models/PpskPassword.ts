// models/PpskPassword.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IPpskPassword extends Document {
  password: string;
  status: 'unused' | 'assigned';
  batchId: string;
  assignedToPhone?: string;
  assignedChannel?: 'web' | 'ussd';
  assignedAt?: Date;
  expiryNotification3DaySent: boolean;
  expiryNotificationSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PpskPasswordSchema = new Schema<IPpskPassword>({
  password: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  status: {
    type: String,
    enum: ['unused', 'assigned'],
    default: 'unused',
    index: true,
  },
  batchId: {
    type: String,
    required: true,
    index: true,
  },
  assignedToPhone: {
    type: String,
    index: true,
  },
  assignedChannel: {
    type: String,
    enum: ['web', 'ussd'],
  },
  assignedAt: {
    type: Date,
  },
  notes: {
    type: String,
  },
  expiryNotification3DaySent: {
    type: Boolean,
    default: false,
  },
  expiryNotificationSent: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export default mongoose.models.PpskPassword || mongoose.model<IPpskPassword>('PpskPassword', PpskPasswordSchema);
