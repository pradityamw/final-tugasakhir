import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env"), override: true });

import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import User from "./models/User.js";

import userRoutes from "./routes/UserRoutes.js";
import productRoutes from "./routes/ProductRoutes.js";
import cartRoutes from "./routes/CartRoutes.js";
import shippingRoutes from "./routes/ShippingRoutes.js";
import paymentRoutes from "./routes/PaymentRoutes.js";
import orderRoutes from "./routes/OrderRoutes.js";
import googleRoutes from "./routes/GoogleRoutes.js";
import storeRoutes from "./routes/StoreRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

import { Strategy as GoogleStrategy } from "passport-google-oauth2";

const app = express();

app.use((req, res, next) => {
  res.setHeader("ngrok-skip-browser-warning", "true");
  res.cookie("ngrok-skip-browser-warning", "true", {
    path: "/",
    maxAge: 31536000000,
    sameSite: "lax",
  });
  next();
});

const allowedOrigins = [
  process.env.DOMAIN,
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        origin.includes("ngrok")
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  express.static(path.join(__dirname, "upload"), {
    setHeaders: (res, filePath) => {
      res.setHeader("Access-Control-Allow-Origin", process.env.DOMAIN);
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("ngrok-skip-browser-warning", "true");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      sameSite: "none",
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/google/ecommerce",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
      scope: ["profile", "email"],
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate(
        {
          googleId: profile.id,
        },
        {
          name: profile.displayName,
          username: profile.emails[0].value,
          avatar: profile.photos[0].value,
        },
        function (err, user) {
          return cb(err, user);
        }
      );
    }
  )
);
app.use("/auth", googleRoutes);
app.use("/user", userRoutes);

// Image proxy: baca file dari disk, kirim dengan header yang benar
// Menggunakan /img-proxy/:filename agar tidak bentrok dengan /products route
app.get("/img-proxy/:filename", (req, res) => {
  const filename = decodeURIComponent(req.params.filename);
  const filePath = path.join(__dirname, "upload", "products", filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "Image not found" });
  }
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
  };
  const contentType = mimeTypes[ext] || "application/octet-stream";
  res.setHeader("Content-Type", contentType);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader("Cache-Control", "public, max-age=86400");
  fs.createReadStream(filePath).pipe(res);
});

app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/shipping", shippingRoutes);
app.use("/payment", paymentRoutes);
app.use("/order", orderRoutes);
app.use("/store", storeRoutes);
app.use("/chat", chatRoutes);

export default app;
