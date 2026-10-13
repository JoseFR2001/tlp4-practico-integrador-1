import mongoose, { Schema, Document } from 'mongoose';

export interface INotificationDocument extends Document {
  userId: string;
  userEmail: string;
  libroId: string;
  libroTitulo: string;
  mensaje: string;
  estadoAnterior: string;
  estadoNuevo: string;
  leida: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotificationDocument>(
  {
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
    libroId: { type: String, required: true },
    libroTitulo: { type: String, required: true },
    mensaje: { type: String, required: true },
    estadoAnterior: { type: String, required: true },
    estadoNuevo: { type: String, required: true },
    leida: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const NotificationModel = mongoose.model<INotificationDocument>('Notification', NotificationSchema);

