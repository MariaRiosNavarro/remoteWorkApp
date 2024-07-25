import express from "express";

import { openTime, closeTime } from "./../controller/time.controller.js";
import { verifyUser } from "../middlewares/auth.middlewares.js";

export const router = new express.Router();

router.post("/:userId", verifyUser, openTime);
router.put("/:userId/:timeId", verifyUser, closeTime);
