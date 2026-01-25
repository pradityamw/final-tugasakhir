import express from "express";
import Chat from "../models/Chat.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

router.get(
  "/history/:username",
  authenticate(["admin", "user"]),
  async (req, res) => {
    try {
      const chatHistory = await Chat.find({
        $or: [
          { sender: req.params.username },
          { recipient: req.params.username },
        ],
      }).sort({ createdAt: 1 });

      res.status(200).json(chatHistory);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
);

export default router;
