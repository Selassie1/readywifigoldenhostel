// models/UssdSession.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IUssdSession extends Document {
  sessionId: string;
  phone: string;
  state: string;
  chosenPlan?: string;
  pendingSaleId?: string;
  updatedAt: Date;
  createdAt: Date;
}

const UssdSessionSchema = new Schema<IUssdSession>({
  sessionId: {
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
  state: {
    type: String,
    required: true,
  },
  chosenPlan: {
    type: String,
  },
  pendingSaleId: {
    type: String,
  },
}, {
  timestamps: true,
});

// TTL index to auto-delete sessions after 24 hours
UssdSessionSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 86400 });

export default mongoose.models.UssdSession || mongoose.model<IUssdSession>('UssdSession', UssdSessionSchema);
