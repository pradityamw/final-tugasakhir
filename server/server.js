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
        // Pesan pertama: kirim auto-reply sambutan
        const autoReply = await Chat.create({
          message: AUTO_REPLY_MESSAGE,
          sender: "admin",
          recipient: message.sender,
        });
        io.emit("chatMessage", autoReply);
      } else {
        // Pesan berikutnya: cek apakah admin sudah membalas sejak pesan terakhir user
        // Cari pesan terakhir dalam conversation ini (selain pesan yang baru dikirim)
        const lastMessage = await Chat.findOne({
          $or: [
            { sender: message.sender },
            { sender: "admin", recipient: message.sender },
          ],
          _id: { $ne: chat._id },
        }).sort({ _id: -1 });

        // Jika pesan terakhir sebelumnya juga dari user → admin belum balas → kirim antrian
        if (lastMessage && lastMessage.sender === message.sender) {
          const queueReply = await Chat.create({
            message: QUEUE_MESSAGE,
            sender: "admin",
            recipient: message.sender,
          });
          io.emit("chatMessage", queueReply);
        }
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
