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
app.put("/time/:userId/:timeId", closeTime);

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

describe("Time Controller - openTime", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("sollte 404 zurückgeben, wenn der Benutzer nicht gefunden wurde", async () => {
    UserModel.findById.mockResolvedValue(null);

    const response = await request(app).post("/time/12345");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Benutzer nicht gefunden" });
  });

  it("sollte 201 zurückgeben und den neuen Zeiteintrag, wenn erfolgreich", async () => {
    const mockUser = { userId: "12345" };
    UserModel.findById.mockResolvedValue(mockUser);

    const mockTime = {
      _id: "timeId",
      userIdRef: "12345",
      startTime: new Date(),
      status: "open",
      save: jest.fn().mockResolvedValue(true),
    };

    TimeModel.mockImplementation(() => mockTime);

    const response = await request(app).post("/time/12345");

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      success: true,
      data: {
        _id: "timeId",
        userIdRef: "12345",
        startTime: expect.any(String),
        status: "open",
      },
      message: "Homeoffice-Zeit erfolgreich gestartet ✅",
    });

    expect(mockTime.save).toHaveBeenCalled();
  });

  it("sollte 500 zurückgeben, wenn ein Fehler auftritt", async () => {
    UserModel.findById.mockRejectedValue(new Error("Datenbankfehler"));

    const response = await request(app).post("/time/12345");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      success: false,
      message: "Fehler beim Öffnen der Homeoffice-Zeit",
      error: "Datenbankfehler",
    });
  });
});

describe("Time Controller - closeTime", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("closeTime", () => {
    it("sollte 200 zurückgeben und den geschlossenen Zeiteintrag, wenn erfolgreich", async () => {
      const mockTime = {
        _id: "timeId",
        userIdRef: "12345",
        startTime: new Date("2023-01-01T09:00:00Z"),
        endTime: null,
        status: "open",
        save: jest.fn().mockResolvedValue(true),
      };

      TimeModel.findOne.mockResolvedValue(mockTime);
      UserModel.findById.mockResolvedValue({ email: "test@example.com" });
      calculateDuration.mockReturnValue(8);
      sendEmail.mockResolvedValue(true);

      const response = await request(app).put("/time/12345/timeId");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: expect.objectContaining({
          _id: "timeId",
          userIdRef: "12345",
          status: "close",
          endTime: expect.any(String),
          durationTime: 8,
        }),
        message: "Homeoffice-Zeit erfolgreich beendet und Email gesendet ✅",
      });

      expect(TimeModel.findOne).toHaveBeenCalledWith({
        _id: "timeId",
        userIdRef: "12345",
        status: "open",
      });
      expect(mockTime.save).toHaveBeenCalled();
      expect(sendEmail).toHaveBeenCalled();
    });

    it("sollte 404 zurückgeben, wenn kein offener Zeiteintrag gefunden wurde", async () => {
      TimeModel.findOne.mockResolvedValue(null);

      const response = await request(app).put("/time/12345/timeId").send();

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: "Kein offener Zeiteintrag gefunden",
      });
    });

    it("sollte 500 zurückgeben, wenn ein Fehler auftritt", async () => {
      TimeModel.findOne.mockRejectedValue(new Error("Datenbankfehler"));

      const response = await request(app).put("/time/12345/timeId");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        success: false,
        message:
          "Fehler beim Schließen der Homeoffice-Zeit oder Senden der Email",
        error: "Datenbankfehler",
      });
    });
  });
});
