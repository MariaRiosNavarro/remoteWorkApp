import { TimeModel } from "./../models/time.model.js";
import { UserModel } from "./../models/user.model.js";
import { calculateDuration } from "../utils/calculateDuration.js";
import { sendEmail } from "./../utils/emailConfig.js";

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

    await sendEmail(user, time);

    res.status(200).json({
      success: true,
      data: time,
      message: "Homeoffice-Zeit erfolgreich beendet und Email gesendet ✅",
    });
  } catch (error) {
    console.error("Fehler beim Schließen der Homeoffice-Zeit:", error);
    res.status(500).json({
      success: false,
      message:
        "Fehler beim Schließen der Homeoffice-Zeit oder Senden der Email",
      error: error.message,
    });
  }
};

/**
 * Ruft alle Homeoffice-Zeiterfassungen für einen Benutzer für ein Bestimmten Tag ab..
 */

export const getAllTimeOneUserOneDay = async (req, res) => {
  try {
    const { userId, date } = req.params;

    // Überprüfen, ob das Datumsformat gültig ist
    if (!Date.parse(date)) {
      return res.status(400).json({
        success: false,
        message: "Ungültiges Datum",
      });
    }

    // format: JJJJ-MM-DD

    // Benutzer suchen
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Benutzer nicht gefunden",
      });
    }

    // Den Datumsbereich für das angegebene Datum erstellen
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0); // Anfang des Tages festlegen
    const endOfDay = new Date(startOfDay);
    endOfDay.setUTCHours(23, 59, 59, 999); // Ende des Tages festlegen

    // Zeiteinträge des Benutzers für den angegebenen Tag suchen
    const timePeriods = await TimeModel.find({
      userIdRef: userId,
      startTime: { $gte: startOfDay, $lt: endOfDay },
    }).sort({ startTime: -1 });

    // Wenn keine Einträge gefunden wurden, leeres Array zurückgeben
    if (!timePeriods || timePeriods.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "Keine Zeiteinträge für diesen Tag gefunden",
      });
    }

    // Gefundene Zeiteinträge zurückgeben
    res.status(200).json({
      success: true,
      data: timePeriods,
      message: "Zeiteinträge für den angegebenen Tag erfolgreich abgerufen",
    });
  } catch (error) {
    console.error("Fehler beim Abrufen der Zeiteinträge:", error);
    res.status(500).json({
      success: false,
      message: "Fehler beim Abrufen der Zeiteinträge",
      error: error.message,
    });
  }
};
