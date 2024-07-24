import { UserModel } from "./../models/user.model.js";
import {
  createHash,
  createSalt,
} from "./../service/auth.service.js";

// Registrierungs-Funktion benutz um am Anfang Users Einzulegen
// Diese Funktion registriert einen neuen Benutzer und speichert ihn in der Datenbank.

export const register = async (req, res) => {
  // Überprüfe, ob die E-Mail bereits registriert ist.
  const registeredUserEmail = await UserModel.findOne({
    email: req.body.email,
  });

  // Wenn die E-Mail bereits registriert ist, antworte mit dem Status 401 (Unauthorized).
  if (registeredUserEmail) return res.status(401).end();

  // Erstelle einen neuen Benutzer mit den angegebenen Daten.
  const newUser = new UserModel(req.body);
  // Erzeuge einen Salt und hashe das Passwort des neuen Benutzers.
  newUser.salt = createSalt();
  newUser.password = createHash(newUser.password, newUser.salt);
  // Speichere den neuen Benutzer in der Datenbank.
  await newUser.save();

  // Antworte mit dem Status 201 (Created) und den Informationen des neuen Benutzers.
  res.status(201).json({
    email: req.body.email,
    role: req.body.role,
  });
};
