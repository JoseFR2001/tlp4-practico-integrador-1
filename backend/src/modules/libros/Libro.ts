import mongoose, { Schema, Document } from 'mongoose';
import { EstadoLibro } from '../../observer/events/LibroStatusChangedEvent';

export interface ILibroDocument extends Document {
  titulo: string;
  autor: string;
  descripcion: string;
  estado: EstadoLibro;
  createdAt: Date;
  updatedAt: Date;
}

const LibroSchema = new Schema<ILibroDocument>(
  {
    titulo: { type: String, required: true, trim: true },
    autor: { type: String, required: true, trim: true },
    descripcion: { type: String, required: true },
    estado: {
      type: String,
      enum: ['DISPONIBLE', 'PRESTADO', 'EN_REPARACION'],
      default: 'DISPONIBLE',
      required: true,
    },
  },
  { timestamps: true }
);

export const LibroModel = mongoose.model<ILibroDocument>('Libro', LibroSchema);

