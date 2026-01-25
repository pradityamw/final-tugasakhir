import express from "express";
import midtransClient from "midtrans-client";
import { authenticate } from "../middleware/authenticate.js";
import Order from "../models/Order.js";

const router = express.Router();

router.post(
  "/process-transaction",
  authenticate(["user"]),
  async (req, res) => {
    try {
      const snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: process.env.SERVER_KEY,
        clientKey: process.env.CLIENT_KEY,
      });

      const parameter = {
        transaction_details: {
          order_id: req.body.orderId,
          gross_amount: req.body.amount,
        },
        customer_details: {
          first_name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
        },
        callbacks: {
          finish: `${process.env.DOMAIN}/confirmation`,
        },
        enabled_payment: [
          "mandiri_clicpay",
          "bca-_clicpay",
          "bni_va",
          "bca_va",
          "permata_va",
          "other_va",
        ],
      };

      console.log("kesini");
      

      snap
        .createTransaction(parameter)
        .then((transaction) => {
          const dataPayment = {
            mindtransRespone: JSON.stringify(transaction),
          };

          const transactionToken = transaction.token;

          res.status(200).json({ token: transactionToken, dataPayment });
        })
        .catch((error) => {
          console.log(error);

          res.status(400).json({ error: error.message });
        });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

router.get(
  "/status/:orderId",
  // authenticate(["admin", "user"]),
  async (req, res) => {
    try {
      const snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: process.env.SERVER_KEY,
        clientKey: process.env.CLIENT_KEY,
      });

      console.log("kesono");


      snap.transaction
        .status(req.params.orderId)
        .then(async (response) => {
          const order = await Order.findOne({ orderId: req.params.orderId });

          order.paymentStatus = response.transaction_status;

          await order.save();

          let message = "";

          if (order.paymentStatus === "settlement") {
            message = "Pembayaran diterima";
          } else if (order.paymentStatus === "pending") {
            message = "Menunggu pembayaran";
          } else if (order.paymentStatus === "expire") {
            message = "Pembayaran kaladuarsa";
          }

          res.status(200).json({ message });
        })
        .catch((error) => {
          res.status(404).json({ error: "Order tidak ditemukan" });
        });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

export default router;
