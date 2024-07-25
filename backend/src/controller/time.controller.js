import { TimeModel } from "./../models/time.model.js";
import { UserModel } from "./../models/user.model.js";


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
