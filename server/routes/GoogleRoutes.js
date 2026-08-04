import express from "express";
import jwt from "jsonwebtoken";
import passport from "passport";

const router = express.Router();

function genereateToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRES,
  });
}

router.get(
  "/google",
  (req, res, next) => {
    res.cookie("ngrok-skip-browser-warning", "true", { path: "/", maxAge: 31536000000 });
    next();
  },
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/ecommerce",
  (req, res, next) => {
    res.cookie("ngrok-skip-browser-warning", "true", { path: "/", maxAge: 31536000000 });
    next();
  },
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Anda tidak terotentikasi" });
    }

    const token = genereateToken(req.user);

    res
      .cookie("token", token)
      .cookie("ngrok-skip-browser-warning", "true", { path: "/", maxAge: 31536000000 })
      .redirect(process.env.DOMAIN);
  }
);

export default router;
