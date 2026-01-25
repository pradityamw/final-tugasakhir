import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import Cart from "../models/Cart.js";

const router = express.Router();

router.post("/add-to-cart", authenticate(["user"]), async (req, res) => {
  try {
    const { productId, qty } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      const isProduct = cart.products.find(
        (p) => p.productId.toString() === productId
      );

      if (isProduct) {
        isProduct.qty += qty;
      } else {
        cart.products.push({ productId, qty });
      }

      await cart.save();

      res.status(200).json({ message: "Berhasil disimpan" });
    } else {
      await Cart.create({
        user: req.user._id,
        products: [{ productId, qty }],
      });

      res.status(200).json({ message: "Berhasil disimpan" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/my-cart", authenticate(["user"]), async (req, res) => {
  try {
    const myCart = await Cart.findOne({ user: req.user._id })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "products",
        populate: { path: "productId", model: "product" },
      });

    if (!myCart) {
      return res.status(404).json({ error: "Data tidak ditemukan" });
    }

    res.status(200).json(myCart);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete(
  "/delete-product/:id",
  authenticate(["user"]),
  async (req, res) => {
    try {
      const productId = req.params.id;

      const cart = await Cart.findOne({ user: req.user._id });

      const product = cart.products.find(
        (product) => product.productId.toString() === productId
      );

      if (product) {
        cart.products.pull(product);
      }

      await cart.save();

      res.status(200).json({ message: "Product berhasil dihapus" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

export default router;
