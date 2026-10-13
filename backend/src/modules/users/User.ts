import mongoose, { Schema, Document } from "mongoose";

export interface IUserDocument extends Document {
  email: string;
  passwordHash: string;
  nombre: string;
  rol: "admin" | "operador" | "usuario";
  createdAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    nombre: { type: String, required: true, trim: true },
    rol: {
      type: String,
      enum: ["admin", "operador", "usuario"],
      default: "usuario",
      required: true,
    },
  },
  { timestamps: true },
);

export const UserModel = mongoose.model<IUserDocument>("User", UserSchema);
