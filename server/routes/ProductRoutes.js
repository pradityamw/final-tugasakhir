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
    const sanitized = path.parse(file.originalname).name.replace(/\s+/g, "-");
    cb(null, sanitized + "-" + Date.now() + path.extname(file.originalname));
  },
});

const uploadImg = multer({ storage: productStorage }).array("image", 10);

const router = express.Router();

const formatImageLink = (url) => {
  if (!url) return url;
  const baseUrl = process.env.SERVER || "http://localhost:2000";
  try {
    let filename = "";
    if (typeof url === "string" && (url.startsWith("http://") || url.startsWith("https://"))) {
      const urlObj = new URL(url);
      const parts = urlObj.pathname.split("/");
      filename = parts[parts.length - 1];
    } else if (typeof url === "string") {
      const parts = url.split("/");
      filename = parts[parts.length - 1];
    }

    if (!filename) return url;
    const decoded = decodeURIComponent(filename);
    return `${baseUrl}/img-proxy/${encodeURIComponent(decoded)}`;
  } catch (err) {
    return url;
  }
};

router.post(
  "/add-product",
  authenticate(["admin"]),
  uploadImg,
  async (req, res) => {
    try {
      const images = req.files
        ? req.files.map(
            (img) =>
              process.env.SERVER + "/img-proxy/" + encodeURIComponent(img.filename)
          )
        : [];

      const { name, desc, category, price, capital, stock, weight } = req.body;

      const profit = Number(price || 0) - Number(capital || 0);

      const product = await Product.create({
        name: name,
        desc: desc,
        category: category,
        price: Number(price),
        capital: Number(capital),
        profit: profit,
        stock: Number(stock),
        weight: Number(weight),
        image: images.map((link) => ({ link })),
      });

      if (!product)
        return res.status(500).json({ message: "Produk gagal ditambahkan" });

      res.status(200).json({ message: "Produk berhasil ditambahkan", product });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
);

router.post("/upload-products", authenticate(["admin"]), async (req, res) => {
  try {
    const { data } = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: "Format data tidak valid" });
    }

    const validData = data.filter(
      (item) =>
        Array.isArray(item) &&
        item[0] !== null &&
        item[0] !== undefined &&
        String(item[0]).trim() !== ""
    );

    await Promise.all(
      validData.map(async (item) => {
        const capital = Number(item[2]) || 0;
        const price = Number(item[3]) || 0;
        const profit = Number(item[4]) || price - capital;
        const stock = Number(item[5]) || 0;
        const weight = Number(item[6]) || 0;

        await Product.create({
          name: String(item[0]).trim(),
          category: String(item[1] || "Umum").trim(),
          capital: capital,
          price: price,
          profit: profit,
          stock: stock,
          weight: weight,
          desc: String(item[7] || "").trim(),
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

    const formattedProducts = products.map((prod) => {
      const p = prod.toObject();
      if (p.image && Array.isArray(p.image)) {
        p.image = p.image.map((img) => ({
          ...img,
          link: formatImageLink(img.link),
        }));
      }
      return p;
    });

    res.status(200).json(formattedProducts);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/:name", async (req, res, next) => {
  try {
    const decodedName = decodeURIComponent(req.params.name);
    const product = await Product.findOne({
      $or: [{ name: decodedName }, { name: req.params.name }],
    });

    if (!product) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    const p = product.toObject();
    if (p.image && Array.isArray(p.image)) {
      p.image = p.image.map((img) => ({
        ...img,
        link: formatImageLink(img.link),
      }));
    }

    res.status(200).json(p);
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
          (img) =>
            process.env.SERVER + "/img-proxy/" + encodeURIComponent(img.filename)
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
        let imageList = [];
        if (Array.isArray(image)) {
          imageList = image;
        } else if (typeof image === "string" && image.trim() !== "") {
          imageList = [image];
        }

        data = {
          name: name,
          desc: desc,
          category: category,
          price: price,
          capital: capital,
          profit: profit,
          stock: stock,
          weight: weight,
          image: imageList.map((link) => ({ link })),
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
