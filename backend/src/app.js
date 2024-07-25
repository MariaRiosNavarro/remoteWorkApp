import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { router as authRouter } from "./routes/auth.routes.js";
import { router as timeRouter } from "./routes/time.routes.js";

dotenv.config();

export function connectToDatabase() {
  const dbUrl = process.env.MONGO_ATLAS_URI;
  return mongoose.connect(dbUrl, { dbName: "remoteWork" });
}

connectToDatabase();

export const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRouter);
app.use("/api/time", timeRouter);
