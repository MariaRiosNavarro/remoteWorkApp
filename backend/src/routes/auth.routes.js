import express from "express";
import { login } from "./../controller/auth.controller.js";

export const router = new express.Router();

router.post("/login", login);
