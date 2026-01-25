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
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/ecommerce",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Anda tidak terotentikasi" });
    }

    const token = genereateToken(req.user);

    res.status(200).cookie("token", token).redirect(process.env.DOMAIN);
  }
);

export default router;
