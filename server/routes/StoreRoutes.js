import express from "express";
import multer from "multer";
import path from "path";
import Store from "../models/Store.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./upload/assets");
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

const uploadImg = multer({ storage: imageStorage });

const storeId = "657bd2a8417c33bbad4850fc";

router.get("/get-data", async (req, res) => {
  try {
    const data = await Store.findById(storeId);

    res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put(
  "/update-store",
  authenticate(["admin"]),
  uploadImg.fields([
    { name: "logo", maxCount: 1 },
    { name: "sliders", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const { name, province, city, address, logo, sliders } = req.body;
      const updateData = {
        name: name,
        province: province,
        city: city,
        address: address,
        logo: logo,
        sliders: sliders,
      };

      if (req.files["logo"]) {
        updateData.logo =
          process.env.SERVER + "/assets/" + req.files["logo"][0].filename;
      }

      if (req.files["sliders"]) {
        updateData.sliders = req.files["sliders"].map((file) => ({
          link: process.env.SERVER + "/assets/" + file.filename,
        }));
      }

      await Store.findByIdAndUpdate(storeId, updateData, {
        runValidators: true,
        new: true,
      });

      res.status(200).json({ message: "Berhasil diperbarui" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
);

export default router;
