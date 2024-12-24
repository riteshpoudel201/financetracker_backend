import * as express from "express";
import Transaction from "../models/Transaction.js";
const router = express.Router();

router.post("/", async (req, res, next) => {
  const { amount, type, title, date } = req.body;
  const user = req.userInfo;
  const userId = user?._id;
  if (!amount || !type || !title || !userId) {
    return res
      .status(400)
      .json({ status: "error", message: "All fields are required" });
  }

  try {
    const newTransaction = new Transaction({
      amount,
      type,
      title,
      date,
      userId,
    });
    const savedTransaction = await newTransaction.save();
    res.status(201).json({
      status: "success",
      message: "Transaction created successfully",
      transaction: savedTransaction,
    });
  } catch (error) {
    error.details = error;
    if (error.message.includes("duplicate key error")) {
      error.message = "Transaction with this title already exists";
    }
    next(error);
  }
});
router.put("/", async (req, res, next) => {
  const { amount, type, title, date, _id } = req.body; 
  const user = req.userInfo;
  const userId = user?._id;
  if (!userId) {
    return res
      .status(403)
      .json({ status: "error", message: "Invalid user or unauthorized." });
  }
  if (!amount || !type || !title || !date || !_id) {
    return res
      .status(400)
      .json({ status: "error", message: "All fields are required" });
  }

  try {
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id, userId },
      { amount, type, title, date },
      { new: true }
    );

    if (!updatedTransaction) {
      return res
        .status(404)
        .json({ status: "error", message: "Transaction not found" });
    }

    res.status(200).json({
      status: "success",
      message: "Transaction updated successfully",
      transaction: updatedTransaction,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  const user = req.userInfo;
  try {
    const transactions = await Transaction.find({ userId: user._id });
    res.status(200).json({
      status: "success",
      message: "Transactions fetched successfully",
      transactions,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/", async (req, res, next) => {
  const { id } = req.body;
  const { _id } = req.userInfo;

  if (!id) {
    return res
      .status(400)
      .json({ status: "error", message: "Transaction id is required" });
  }

  try {
    let deletedTransaction;

    if (Array.isArray(id)) {
      deletedTransaction = await Transaction.deleteMany({
        _id: { $in: id },
        userId: _id,
      });
    } else if (typeof id === "string") {
      deletedTransaction = await Transaction.findByIdAndDelete(id, {
        userId: _id,
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "Invalid format of transaction ID.",
      });
    }

    if (!deletedTransaction || deletedTransaction.deletedCount === 0) {
      return res.status(404).json({
        status: "error",
        message: "Transaction either not found or could not be deleted",
      });
    }

    res.status(200).json({
      status: "success",
      message: `${deletedTransaction.deletedCount} transactions were deleted successfully`,
      transaction: deletedTransaction,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
