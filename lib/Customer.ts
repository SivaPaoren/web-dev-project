import mongoose, { Schema, models, model } from "mongoose";

const CustomerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, required: true },
    memberNumber: { type: Number, required: true, min: 1, unique: true },
    interests: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default models.Customer || model("Customer", CustomerSchema);
