import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import axios from "axios";
import qs from "qs";

axios.defaults.baseURL = process.env.RAJAONGKIR_URL;
axios.defaults.headers.common["Key"] = process.env.RAJAONGKIR;
axios.defaults.headers.post["Content-Type"] =
  "Application/x-www-form-urlencoded";

const router = express.Router();

router.get("/provinces", authenticate(["user", "admin"]), async (req, res) => {
  try {
    // Memanggil endpoint API RajaOngkir untuk destinasi provinsi
    const response = await axios.get("/destination/province");

    res.status(200).json(response.data.data);
  } catch (error) {
    // Penanganan error jika request gagal
    return res.status(500).json({ error: error.message });
  }
});

router.get(
  "/city/:province_id",
  authenticate(["user", "admin"]),
  async (req, res) => {
    try {
      const id = req.params.province_id;

      const cities = await axios.get(`/destination/city/${id}`);

      res.status(200).json(cities.data.data);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

router.get(
  "/district/:city_id",
  authenticate(["user", "admin"]),
  async (req, res) => {
    try {
      const id = req.params.city_id;

      const district = await axios.get(`/destination/district/${id}`);

      res.status(200).json(district.data.data);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

router.get("/cost/:origin/:destination/:weight/:courier", async (req, res) => {
  try {
    const { origin, destination, weight, courier } = req.params;

    const data = qs.stringify({
      origin: origin,
      destination: destination,
      weight: weight,
      courier: courier,
      price: "lowest"
    });

    const cost = await axios.post("/calculate/district/domestic-cost", data);

    const results = cost.data.data;

    if (!results) {
      return res.status(404).json({ message: "Layanan pengiriman tidak ditemukan untuk rute atau kurir ini." });
    }

    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

export default router;
