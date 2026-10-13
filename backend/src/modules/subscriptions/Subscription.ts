import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscriptionDocument extends Document {
  userId: string;
  libroId: string;
  createdAt: Date;
}

const SubscriptionSchema = new Schema<ISubscriptionDocument>(
  {
    userId: { type: String, required: true },
    libroId: { type: String, required: true },
  },
  { timestamps: true }
);

SubscriptionSchema.index({ userId: 1, libroId: 1 }, { unique: true });

export const SubscriptionModel = mongoose.model<ISubscriptionDocument>('Subscription', SubscriptionSchema);

