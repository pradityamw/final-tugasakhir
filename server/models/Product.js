import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    desc: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    capital: { type: Number, required: true },
    profit: { type: Number, required: true },
    stock: { type: Number, required: true },
    weight: { type: Number, required: true },
    rating: { type: Number, required: false },
    image: [{ link: { type: String, required: false } }],
    reviews: [
      {
        user: { type: String },
        product: { type: Schema.Types.ObjectId },
        rating: { type: Number, required: false, default: 0 },
        review: { type: String, required: false },
      },
    ],
  },
  { timestamps: true }
);

export default model("product", productSchema);
