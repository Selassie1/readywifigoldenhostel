// models/Batch.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IBatch extends Document {
  batchId: string;
  source: string;
  plan: string;
  count: number;
  fileName: string;
  importedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BatchSchema = new Schema<IBatch>({
  batchId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  source: {
    type: String,
    default: 'omada_csv',
  },
  plan: {
    type: String,
    required: true,
    index: true,
  },
  count: {
    type: Number,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  importedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Batch || mongoose.model<IBatch>('Batch', BatchSchema);
