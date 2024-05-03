import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import connect from "./config/database.js"
import userRouter from "./features/user/userRouter.js";
import otpRouter from "./features/otp/otpRouter.js";


const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/v1/user",userRouter);
app.use("/api/v1/otp",otpRouter);


app.listen(PORT,() => {
    connect();
    console.log(`server running at ${PORT}`);
});