import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";

dotenv.config();

export const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
