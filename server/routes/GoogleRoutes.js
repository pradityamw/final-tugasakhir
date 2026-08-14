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
    const targetDomain = req.cookies.redirect_origin || process.env.DOMAIN || "http://localhost:5173";

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 3 * 24 * 60 * 60 * 1000,
      })
      .cookie("ngrok-skip-browser-warning", "true", { path: "/", maxAge: 31536000000 })
      .redirect(`${targetDomain}/?login=success`);
  }
);

export default router;
