import express from "express";

import { openTime } from "./../controller/time.controller.js";
import { verifyUser } from "../middlewares/auth.middlewares.js";

export const router = new express.Router();

router.post("/:userId", verifyUser, openTime);
