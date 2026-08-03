import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import axios from "axios";
import qs from "qs";

const rajaongkir = axios.create({
  baseURL: process.env.RAJAONGKIR_URL || "https://rajaongkir.komerce.id/api/v1/",
  headers: {
    key: process.env.RAJAONGKIR || "oWy5D4Z923173389859eb332OEO1U7vH",
    Key: process.env.RAJAONGKIR || "oWy5D4Z923173389859eb332OEO1U7vH",
  },
});

const router = express.Router();

router.get("/provinces", authenticate(["user", "admin"]), async (req, res) => {
  try {
    const response = await rajaongkir.get("/destination/province");
    res.status(200).json(response.data.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get(
  "/city/:province_id",
  authenticate(["user", "admin"]),
  async (req, res) => {
    try {
      const id = req.params.province_id;
      const cities = await rajaongkir.get(`/destination/city/${id}`);
      res.status(200).json(cities.data.data);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
);

router.get(
  "/district/:city_id",
  authenticate(["user", "admin"]),
  async (req, res) => {
    try {
      const id = req.params.city_id;
      const district = await rajaongkir.get(`/destination/district/${id}`);
      res.status(200).json(district.data.data);
    } catch (error) {
      return res.status(500).json({ message: error.message });
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
      price: "lowest",
    });

    const cost = await rajaongkir.post("/calculate/district/domestic-cost", data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const results = cost.data.data;

    if (!results) {
      return res.status(404).json({ message: "Layanan pengiriman tidak ditemukan untuk rute atau kurir ini." });
    }

    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
