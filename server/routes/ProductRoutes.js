import express from "express";
import Product from "../models/Product.js";
import { authenticate } from "../middleware/authenticate.js";
import multer from "multer";
import path from "path";

const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./upload/products");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      path.parse(file.originalname).name +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

const uploadImg = multer({ storage: productStorage }).array("image", 10);

const router = express.Router();

router.post(
  "/add-product",
  authenticate(["admin"]),
  uploadImg,
  async (req, res) => {
    try {
      const images = req.files.map(
        (img) => process.env.SERVER + "/products/" + img.filename
      );

      const { name, desc, category, price, capital, stock, weight } = req.body;

      const profit = price - capital;

      const product = await Product.create({
        name: name,
        desc: desc,
        category: category,
        price: price,
        capital: capital,
        profit: profit,
        stock: stock,
        weight: weight,
        image: images.map((link) => ({ link })),
      });

      if (!product)
        return res.status(500).json({ error: "Produk gagal ditambahkan" });

      res.status(200).json({ message: "Produk berhasil ditambahkan", product });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

router.post("/upload-products", authenticate(["admin"]), async (req, res) => {
  try {
    const { data } = req.body;

    const validData = data.filter(
      (item) => item[0] !== null && item[0] !== undefined
    );

    await Promise.all(
      validData.map(async (item) => {
        await Product.create({
          name: item[0],
          category: item[1],
          capital: item[2],
          price: item[3],
          profit: item[4],
          stock: item[5],
          weight: item[6],
          desc: item[7],
        });
      })
    );

    res
      .status(200)
      .json({ message: `${validData.length} produk berhasil disimpan` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

router.get("/show-products", async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/:name", async (req, res, next) => {
  try {
    const product = await Product.findOne({ name: req.params.name });

    if (!product) {
      return res.status(404).json({ error: "Produk tidak ditemukan" });
    }

    res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/delete/:id", authenticate(["admin"]), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    await product.deleteOne();

    res.status(200).json({ message: "produk berhasil dihapus" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/delete-all", authenticate(["admin"]), async (req, res) => {
  try {
    await Product.deleteMany();

    res.status(200).json({ message: "Seluruh produk berhasil dihapus" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }
    return res.status(500).json({ message: error.message });
  }
});

router.put(
  "/update/:id",
  authenticate(["admin"]),
  uploadImg,
  async (req, res) => {
    try {
      let images = [];

      if (req.files) {
        images = req.files.map(
          (img) => process.env.SERVER + "/products/" + img.filename
        );
      }

      let product = await Product.findById(req.params.id);

      const { name, desc, category, price, capital, stock, weight, image } =
        req.body;

      const profit = price - capital;

      let data;

      if (images.length > 0) {
        data = {
          name: name,
          desc: desc,
          category: category,
          price: price,
          capital: capital,
          profit: profit,
          stock: stock,
          weight: weight,
          image: images.map((link) => ({ link })),
        };
      } else {
        data = {
          name: name,
          desc: desc,
          category: category,
          price: price,
          capital: capital,
          profit: profit,
          stock: stock,
          weight: weight,
          image: image.map((link) => ({ link })),
        };
      }

      product = await Product.findByIdAndUpdate(req.params.id, data, {
        new: true,
        runValidators: true,
      });

      res.status(200).json({ message: "Produk berhasil diperbarui" });
    } catch (error) {
      console.log(error);
      if (error.name === "CastError") {
        return res.status(404).json({ message: "Produk tidak ditemukan" });
      }
      return res.status(500).json({ message: error.message });
    }
  }
);

router.post("/give-review/:id", authenticate(["user"]), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product tidak temukan" });
    }

    const newReview = {
      user: req.user.name,
      product: product._id,
      rating: req.body.rating,
      review: req.body.review,
    };

    const isReview = product.reviews.find(
      (r) =>
        r.user === req.user.name &&
        r.product.toString() === product._id.toString()
    );

    if (isReview) {
      product.reviews.forEach((r) => {
        if (
          r.user === req.user.name &&
          r.product.toString() === product._id.toString()
        ) {
          (r.rating = req.body.rating), (r.review = req.body.review);
        }
      });

      product.rating = Math.round(
        product.reviews.reduce((acc, r) => acc + r.rating, 0) /
          product.reviews.length
      );

      await product.save();

      res.status(200).json({ message: "Review berhasil diperbarui" });
    } else {
      product.reviews.push(newReview);

      product.rating = Math.round(
        product.reviews.reduce((acc, r) => acc + r.rating, 0) /
          product.reviews.length
      );

      await product.save();

      res.status(200).json({ message: "Review berhasil disimpan" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

export default router;
