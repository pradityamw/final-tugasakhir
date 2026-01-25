import { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    orderId: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Tambahkan ref untuk relasi
    address: { type: String, required: true },
    phone: { type: String, required: true }, 
    subtotal: { type: Number, required: true },
    payment: { type: Number, required: true },
    paymentStatus: { type: String, default: "pending" },
    shipment: { type: String, required: true },
    shippingCost: { type: Number, required: true },
    courier: { type: String, default: "-" },
    orderStatus: { type: String, default: "processing" },
    resi: { type: String },
    products: [
      {
        productId: { 
            type: Schema.Types.ObjectId, 
            ref: 'Product', // Tambahkan ref untuk relasi
            required: true // Typo diperbaiki dari `require`
        },
        qty: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
        profit: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default model("Order", orderSchema); // Nama collection akan menjadi 'orders'