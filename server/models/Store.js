import { Schema, model } from "mongoose";

const storeSchema = new Schema(
  {
    name: { type: String },
    province: { type: String },
    city: { type: String },
    address: { type: String },
    sliders: [{ link: { type: String } }],
    logo: { type: String },
  },
  { timestamps: true }
);

export default model("store", storeSchema);
