import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const router = express.Router();

router.post("/create", authenticate(["user"]), async (req, res) => {
  try {
   
    await Order.create(req.body);

    res.status(200).json({ message: "Pesanan berhasil disimpan" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/create-from-cart", authenticate(["user"]), async (req, res) => {
  try {
    console.log("disini : ", req.body);

    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      const productIds = req.body.products.map((product) => product.productId);

      cart.products = cart.products.filter(
        (cartProduct) => !productIds.includes(cartProduct.productId.toString())
      );

      await cart.save();
    }

    await Order.create(req.body);
    

    res.status(200).json({ message: "Pesanan berhasil disimpan" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/my-order", authenticate(["user"]), async (req, res) => {
  try {
    const order = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "products",
        populate: { path: "productId", model: "product" },
      });

    if (!order) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/get-orders", authenticate(["admin"]), async (req, res) => {
  try {
    const order = await Order.find()
      .populate({ path: "user", model: "user" })
      .populate({
        path: "products",
        populate: { path: "productId", model: "product" },
      })
      .sort({ createdAt: -1 });

    if (!order) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put("/input-resi/:id", authenticate(["admin"]), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan" });
    }

    for (const item of order.products) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          message: `Produk dengan id: ${item.productId} tidak ditemukan`,
        });
      }

      product.stock = product.stock - item.qty;

      await product.save();
    }

    order.resi = req.body.resi;
    order.orderStatus = "Delivered";

    await order.save();

    res.status(200).json({ message: "Resi berhasil disimpan" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
