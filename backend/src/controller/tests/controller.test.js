import request from "supertest";
import express from "express";
import { login} from "../auth.controller.js";
import { openTime, closeTime } from "../time.controller.js";
import { UserModel } from "../../models/user.model.js";
import { TimeModel } from "../../models/time.model.js";
import { createHash, createToken } from "../../service/auth.service.js";
import { sendEmail } from "../../utils/emailConfig.js";
import { calculateDuration } from "../../utils/calculateDuration.js";

jest.mock("./../../models/user.model.js");
jest.mock("./../../service/auth.service.js");
jest.mock("./../../models/time.model.js");
jest.mock("./../../utils/emailConfig.js");
jest.mock("./../../utils/calculateDuration.js");

const app = express();
app.use(express.json());
app.post("/login", login);
app.post("/time/:userId", openTime);
app.post("/time/:userId/:timeId", closeTime);
