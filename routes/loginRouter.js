import * as express from "express";
import User from "../models/User.js";
import { signJWT } from "../utils/jwt.js";
import { comparePassword } from "../utils/bcrypt.js";

const router = express.Router();

// POST - User login
router.post("/", async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ status: "error", message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid credentials." });
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid credentials" });
    }
    user.password = null;

    const token = signJWT({ id: user._id, email: user.email });

    res
      .status(200)
      .json({
        status: "success",
        message: "Login successful",
        token,
        _id: user._id,
        email: user?.email,
        name:user.name
      });
  } catch (error) {
    next(error);
  }
});

export default router;
