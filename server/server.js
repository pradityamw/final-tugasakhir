import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, ".env");
dotenv.config({ path: envPath, override: true });

import app from "./app.js";
import connect from "./config/connection.js";
import http from "http";
import { Server } from "socket.io";
import Chat from "./models/Chat.js";

connect();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.DOMAIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const ADMIN_WHATSAPP = "6285954082545";
const AUTO_REPLY_MESSAGE = `Mohon ditunggu ya, admin akan membalas pesanmu dalam 5 menit. Jika admin tidak merespon, kamu bisa menghubungi kami langsung via WhatsApp: https://wa.me/${ADMIN_WHATSAPP}`;
const QUEUE_MESSAGE = "Mohon ditunggu yaa, chatmu dalam proses antrian untuk dibalas 🙏";

// Map untuk melacak timer antrian per user: username -> timeoutId
const pendingAntrian = new Map();

io.on("connection", (socket) => {
  socket.on("chatMessage", async (message) => {
    const chat = await Chat.create({
      message: message.message,
      sender: message.sender,
      recipient: message.recipient,
    });

    io.emit("chatMessage", chat);

    // Cek apakah ini pesan dari user (bukan admin)
    if (message.sender !== "admin") {
      const userMessageCount = await Chat.countDocuments({
        sender: message.sender,
      });

      if (userMessageCount === 1) {
        // Pesan pertama: kirim auto-reply sambutan langsung
        const autoReply = await Chat.create({
          message: AUTO_REPLY_MESSAGE,
          sender: "admin",
          recipient: message.sender,
          isAutoReply: true,
        });
        io.emit("chatMessage", autoReply);
      } else {
        // Pesan ke-2 dan seterusnya: reset timer, tunggu 1 menit dulu
        // Kalau user kirim pesan lagi sebelum 1 menit, timer di-reset
        if (pendingAntrian.has(message.sender)) {
          clearTimeout(pendingAntrian.get(message.sender));
        }

        // Simpan _id pesan ini untuk dicek nanti setelah 1 menit
        const currentChatId = chat._id.toString();
        const username = message.sender;

        const timeoutId = setTimeout(async () => {
          pendingAntrian.delete(username);

          // Cek apakah admin sudah membalas secara manual sejak pesan ini dikirim
          const lastRealAdminReply = await Chat.findOne({
            sender: "admin",
            recipient: username,
            isAutoReply: { $ne: true },
          }).sort({ _id: -1 });

          // Admin sudah balas jika ada balasan manual yang lebih baru dari pesan user ini
          const adminHasReplied =
            lastRealAdminReply &&
            lastRealAdminReply._id.toString() > currentChatId;

          if (!adminHasReplied) {
            const queueReply = await Chat.create({
              message: QUEUE_MESSAGE,
              sender: "admin",
              recipient: username,
              isAutoReply: true,
            });
            io.emit("chatMessage", queueReply);
          }
        }, 60 * 1000); // Tunggu 1 menit

        pendingAntrian.set(username, timeoutId);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.get("/", (req, res) => {
  res.redirect(process.env.DOMAIN);
});

const port = 2000;
const portSocket = 1000;

server.listen(port, () => {
  console.log(`Socket server on port ${port}`);
});
