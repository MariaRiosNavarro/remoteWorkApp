import { TimeModel } from "./../models/time.model.js";
import { UserModel } from "./../models/user.model.js";
import { calculateDuration } from "../utils/calculateDuration.js";

/**
 * Öffnet eine neue Homeoffice-Zeiterfassung für einen Benutzer.
 */
export const openTime = async (req, res) => {
  try {
    const { userId } = req.params;

    // Benutzer suchen
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }

    // Neuen Zeiteintrag erstellen
    const newTime = new TimeModel({
      userIdRef: userId,
      startTime: new Date(),
      status: "open",
    });

    // Neuen Zeiteintrag speichern
    await newTime.save();

    res.status(201).json({
      success: true,
      data: newTime,
      message: "Homeoffice-Zeit erfolgreich gestartet ✅",
    });
  } catch (error) {
    console.error("Fehler beim Öffnen der Homeoffice-Zeit:", error);
    res.status(500).json({
      success: false,
      message: "Fehler beim Öffnen der Homeoffice-Zeit",
      error: error.message,
    });
  }
};

/**
 * Schließt eine offene Homeoffice-Zeiterfassung.
 */
export const closeTime = async (req, res) => {
  try {
    const { userId, timeId } = req.params;

    // Offenen Zeiteintrag suchen
    const time = await TimeModel.findOne({
      _id: timeId,
      userIdRef: userId,
      status: "open",
    });
    if (!time) {
      return res
        .status(404)
        .json({ message: "Kein offener Zeiteintrag gefunden" });
    }

    // Zeiteintrag schließen
    time.status = "close";
    time.endTime = new Date();

    let durationTime = calculateDuration(time.startTime, time.endTime);

    // const durationTime = (time.endTime - time.startTime) / (1000 * 60 * 60);

    time.durationTime = durationTime;

    await time.save();

    // Benutzerinformationen abrufen
    const user = await UserModel.findById(userId);

    res.status(200).json({
      success: true,
      data: time,
      message: "Homeoffice-Zeit erfolgreich beendet ✅",
    });
  } catch (error) {
    console.error("Fehler beim Schließen der Homeoffice-Zeit:", error);
    res.status(500).json({
      success: false,
      message:
        "Fehler beim Schließen der Homeoffice-Zeit oder Senden der Benachrichtigung",
      error: error.message,
    });
  }
};
