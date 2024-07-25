import request from "supertest";
import express from "express";
import { login } from "../auth.controller.js";
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

describe("Auth Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("Sollte 401 zurückgeben, wenn der Benutzer nicht gefunden wurde", async () => {
      UserModel.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post("/login")
        .send({ email: "test@example.com", password: "password" });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({});
    });

    it("Sollte 401 zurückgeben, wenn das Passwort falsch ist", async () => {
      UserModel.findOne.mockResolvedValue({
        email: "test@example.com",
        password: "hashedpassword",
        salt: "randomsalt",
      });
      createHash.mockReturnValue("wronghashedpassword");

      const response = await request(app)
        .post("/login")
        .send({ email: "test@example.com", password: "password" });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({});
    });

    it("Sollte bei erfolgreicher Anmeldung Token und Benutzerinformationen zurückgeben", async () => {
      UserModel.findOne.mockResolvedValue({
        _id: "userId",
        email: "test@example.com",
        password: "hashedpassword",
        salt: "randomsalt",
      });
      createHash.mockReturnValue("hashedpassword");
      createToken.mockReturnValue("token");

      const response = await request(app)
        .post("/login")
        .send({ email: "test@example.com", password: "password" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: "userId",
        email: "test@example.com",
      });
      expect(response.headers["set-cookie"][0]).toContain("user_auth=token");
    });
  });
});
