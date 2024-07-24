import express from "express";
import { register } from "./../controller/auth.controller.js";

export const router = new express.Router();

router.post("/register", register);
