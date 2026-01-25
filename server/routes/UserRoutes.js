import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import passport from "passport";
import { authenticate } from "../middleware/authenticate.js";
import SendEmail from "../utils/Sendemail.js";
import multer from "multer";
import path from "path";

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./upload/avatar");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      path.parse(file.originalname).name +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

const uploadAvatar = multer({ storage: avatarStorage });

const router = express.Router();

function genereateToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRES,
  });
}

// Register
router.post("/register", async (req, res) => {
  try {
    User.register(
      {
        name: req.body.name,
        username: req.body.username,
        phone: req.body.phone,
      },
      req.body.password,
      (err, user) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        } else {
          const token = genereateToken(user);

          res
            .status(200)
            .cookie("token", token)
            .json({ mesaage: "Pendaftaran berhasil" });
        }
      }
    );
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    passport.authenticate("local", (err, user) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      } else if (!user) {
        return res
          .status(404)
          .json({ message: "Username atau password salah" });
      } else {
        req.login(user, function (err) {
          if (err) {
            return res.status(500).json({ message: err.message });
          }
          const token = genereateToken(user);

          res.status(200).cookie("token", token).json({ isLogin: true, user });
        });
      }
    })(req, res);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Profile
router.get("/profile", authenticate(["admin", "user"]), async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

// Update profile
router.put(
  "/update-profile",
  authenticate(["admin", "user"]),
  async (req, res) => {
    try {
      const id = req.user._id;

      const user = await User.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      res.status(200).json({ message: "Berhasil diperbarui", user });
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
);

// Update password
router.put(
  "/change-password",
  authenticate(["admin", "user"]),
  async (req, res) => {
    try {
      const { username, oldPassword, newPassword } = req.body;

      const user = await User.findById(req.user._id);

      if (username && !oldPassword && !newPassword) {
        user.username = username;
        await user.save();
        return res.status(200).json({ message: "Username berhasil diganti" });
      }

      if (oldPassword && newPassword) {
        user.changePassword(oldPassword, newPassword, (error) => {
          if (error) {
            return res.status(400).json({ message: "Password tidak sesuai" });
          } else {
            return res
              .status(200)
              .json({ message: "Password berhasil diganti" });
          }
        });
      }

      //  await User.findByUsername(req.body.username, (error, user) => {
      //    if (error) {
      //      return res.status(500).json({ message: error.message });
      //    } else {
      //      user.changePassword(
      //        req.body.oldPassword,
      //        req.body.newPassword,
      //        (error) => {
      //          if (error) {
      //            return res
      //              .status(400)
      //              .json({ message: "Password tidak sesuai" });
      //          } else {
      //            return res
      //              .status(200)
      //              .json({ message: "Password berhasil dirubah" });
      //          }
      //        }
      //      );
      //    }
      //  });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// upload avatar
router.post(
  "/upload-avatar",
  authenticate(["admin", "user"]),
  uploadAvatar.single("file"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);

      const imageLink = process.env.SERVER + "/avatar/" + req.file.filename;

      user.avatar = imageLink;

      await user.save();

      res.status(200).json({ message: "Avatar berhasil disimpan" });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
);

// Menampilkan seluruh user
router.get("/get", authenticate(["admin"]), async (req, res) => {
  try {
    const data = await User.find();

    const users = data.filter((user) => user.role === "user");

    res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

// Menghapus user
router.delete("/delete/:id", authenticate(["admin"]), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    await user.deleteOne();

    res.status(200).json({ message: "User berhasil dihapus" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

// Kirim email
router.post("/send-email", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.email });

    if (!user) {
      return res.status(404).json({ error: "Email tidak ditemukan" });
    }

    const token = user.PasswordToken();

    await user.save({ validateBeforeSave: true });

    const url = `${process.env.DOMAIN}/reset-password/${token}`;

    const message = `Klik link ini: ${url}`;

    await SendEmail({
      email: user.username,
      subject: "Reset Password",
      message,
    });

    res.status(200).json({
      message: `Link reset password sudah terkirim ke email ${user.username}`,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/logout", (req, res) => {
  try {
    res.cookie("token", null, {
      expiresIn: new Date(Date.now()),
    });

    res.status(200).json({ message: "Berhasil logout" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
