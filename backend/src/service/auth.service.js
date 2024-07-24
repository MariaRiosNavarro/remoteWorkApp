import jwt from "jsonwebtoken";
import { createHmac, randomBytes } from "node:crypto";

// Funktion zur Erstellung eines JWT
// Diese Funktion erstellt ein JSON Web Token (JWT) basierend auf den übergebenen Nutzdaten.
export const createToken = (payload) => {
  // Erzeugt ein JWT mit den Nutzdaten und dem geheimen Schlüssel aus den Umgebungsvariablen.
  // Das Token läuft nach 5 Stunden ab.
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5Hours" });
};

// Funktion zur Verifizierung eines JWT
// Diese Funktion überprüft die Gültigkeit eines übergebenen Tokens.
export const verifyToken = (token) => {
  // Verifiziert das Token mit dem geheimen Schlüssel aus den Umgebungsvariablen.
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Funktion zur Erstellung eines Passwort-Hashes
// Diese Funktion erstellt einen SHA-256 Hash eines Passworts unter Verwendung eines Salts.
export const createHash = (password, salt) => {
  // Erstellt ein HMAC (Hash-based Message Authentication Code) mit SHA-256 Algorithmus und dem übergebenen Salt.
  const hmac = createHmac("sha256", salt);
  // Fügt das Passwort zum HMAC hinzu.
  hmac.update(password);
  // Gibt den erzeugten Hash als hexadezimale Zeichenkette zurück.
  return hmac.digest("hex");
};

// Funktion zur Erstellung eines Salts
// Diese Funktion erzeugt einen zufälligen Salt für die Passwort-Hashing-Funktion.
export const createSalt = () => {
  // Erzeugt 12 zufällige Bytes und gibt sie als hexadezimale Zeichenkette zurück.
  return randomBytes(12).toString("hex");
};

