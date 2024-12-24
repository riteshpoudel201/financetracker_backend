import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/userRouter.js";
import loginRouter from "./routes/loginRouter.js";
import transactionRouter from "./routes/transactionRouter.js";
import connectToDatabase from "./config/dbConfig.js";
import { auth } from "./middlewares/authMiddleware.js";
import { ErrorHandler as errorHandler } from "./middlewares/errorHandlingMiddleware.js";

dotenv.config();

const port = process.env.PORT || 3000;

const app= express();
connectToDatabase();
app.use(cors());
app.use(express.json());
app.use("/users", userRouter);
app.use("/login", loginRouter);
app.use("/transactions",auth, (req,res,next)=>{
    req.userInfo = req.userinfo;
    next();
}, transactionRouter);

app.get("/", (req,res)=>{
    res.send("Server is running.")
})

// Error handling middleware for undefined routes
app.use((req,res, next)=>{
    const error = new Error("Not found");
    error.statusCode = 404;
    next(error);
})

// Error handling middleware for all errors
app.use(errorHandler);

app.listen(port, error=>{
    error ? console.log(error) : console.log("Server is running at: http://localhost:"+ port);
})
