import { UserModel } from "./../models/user.model.js";
import {
  createHash,
  createToken,
  createSalt,
} from "./../service/auth.service.js";

/** Login-Funktion
Diese Funktion authentifiziert einen Benutzer basierend auf seiner E-Mail und seinem Passwort.
*/
export const login = async (req, res) => {
  // Suche nach einem Benutzer mit der angegebenen E-Mail.
  const user = await UserModel.findOne({ email: req.body.email });

  // Wenn der Benutzer nicht gefunden wird, antworte mit dem Status 401 (Unauthorized).
  if (!user) return res.status(401).end();

  // Überprüfe, ob das eingegebene Passwort korrekt ist.
  // Das Passwort wird mit dem gespeicherten Salt gehasht und mit dem gespeicherten Passwort verglichen.
  if (user.password !== createHash(req.body.password, user.salt))
    return res.status(401).end();

  // Erstelle ein Token für den authentifizierten Benutzer.
  const token = createToken({
    userId: user._id,
    userEmail: user.email,
  });
  const userId = user._id;
  const userEmail = user.email;

  // Sende das Token als httpOnly-Cookie und antworte mit den Benutzerinformationen.
  res
    .cookie("user_auth", token, {
      httpOnly: true, // Das Cookie ist nur für den Server zugänglich.
      secure: true, // Das Cookie wird nur über HTTPS gesendet.
    })
    .json({
      id: userId,
      email: userEmail,
    });
};

// Registrierungs-Funktion benutz um am Anfang Users Einzulegen
// Diese Funktion registriert einen neuen Benutzer und speichert ihn in der Datenbank.

// export const register = async (req, res) => {
//   // Überprüfe, ob die E-Mail bereits registriert ist.
//   const registeredUserEmail = await UserModel.findOne({
//     email: req.body.email,
//   });

//   // Wenn die E-Mail bereits registriert ist, antworte mit dem Status 401 (Unauthorized).
//   if (registeredUserEmail) return res.status(401).end();

//   // Erstelle einen neuen Benutzer mit den angegebenen Daten.
//   const newUser = new UserModel(req.body);
//   // Erzeuge einen Salt und hashe das Passwort des neuen Benutzers.
//   newUser.salt = createSalt();
//   newUser.password = createHash(newUser.password, newUser.salt);
//   // Speichere den neuen Benutzer in der Datenbank.
//   await newUser.save();

//   // Antworte mit dem Status 201 (Created) und den Informationen des neuen Benutzers.
//   res.status(201).json({
//     email: req.body.email,
//     role: req.body.role,
//   });
// };
