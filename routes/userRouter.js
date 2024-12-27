import * as express from "express";
import User from "../models/User.js"; 
import { auth } from "../middlewares/authMiddleware.js";
import { block } from "../middlewares/blockMiddleware.js";
import { hashedPassword } from "../utils/bcrypt.js";

const router = express.Router();

// GET - Retrieve all users
router.get("/", block, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

router.get("/verify", auth, (req, res)=>{
  res.status(200).json({status: "success", message: "User verified", user: req.userinfo})
})

// GET - Retrieve a specific user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});


// POST - Create a new user
router.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name) {
    return res
      .status(400)
      .json({ status: "error", message: "Name is required" });
  }
  if (!email) {
    return res
      .status(400)
      .json({ status: "error", message: "Email is required" });
  }
  if (email.includes("@") == false) {
    return res.status(400).json({ status: "error", message: "Invalid email" });
  }
  if (!password) {
    return res
      .status(400)
      .json({ status: "error", message: "Password is required" });
  }
  const hashedPass = await hashedPassword(password);
  const lowerCaseEmail = email.toLowerCase();
  try {
    const newUser = new User({ name, email:lowerCaseEmail, password: hashedPass });
    const savedUser = await newUser.save();
    res.status(201).json({
      status: "success",
      message: "Account creation successfull",
      user: savedUser,
    });
  } catch (error) {
    if (error.message.includes("duplicate key error collection:")) {
      error.message = "User with this email already exists";
    }
    next(error);
  }
});

// PUT - Update a specific user by ID
router.put("/:id", async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
});

// PATCH - Partially update a specific user by ID
router.patch("/:id", async (req, res,next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
});

// DELETE - Delete a specific user by ID
router.delete("/:id", async (req, res,next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
