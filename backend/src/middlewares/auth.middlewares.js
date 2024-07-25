import { verifyToken } from "../service/auth.service.js";

// Middleware zur Überprüfung des Tokens
// Diese Middleware überprüft, ob ein gültiges JWT im Request-Cookie vorhanden ist.

export const verifyUser = (req, res, next) => {
  // Extrahieren des Tokens aus den Cookies
  const token = req.cookies.user_auth; // Annahme, dass der Cookie-Name 'user_auth' ist

  // Überprüfen, ob kein Token vorhanden ist
  if (!token) {
    // Senden einer Antwort mit Status 401 (Nicht autorisiert) und einer Fehlermeldung
    return res.status(401).json({
      message: "Es wurde kein Authentifizierungstoken bereitgestellt",
    });
  }

  try {
    // Überprüfen des Tokens
    const payload = verifyToken(token);

    // Speichern der Benutzerinformationen im req-Objekt zur späteren Verwendung
    req.user = {
      userId: payload.userId,
      userEmail: payload.userEmail,
    };

    // Überprüfen, ob die userId in den Parametern mit der userId im Token übereinstimmt
    if (req.params.userId && req.params.userId !== payload.userId) {
      // Senden einer Antwort mit Status 403 (Verboten) und einer Fehlermeldung
      return res.status(403).json({
        message: "Du hast keine Berechtigung, auf diese Ressource zuzugreifen",
      });
    }

    // Weiter zur nächsten Middleware-Funktion
    next();
  } catch (error) {
    // Protokollieren des Fehlers und Senden einer Antwort mit Status 401 (Nicht autorisiert) und einer Fehlermeldung
    console.error("Fehler bei der Tokenüberprüfung:", error.message);
    res.status(401).json({ message: "Ungültiges oder abgelaufenes Token" });
  }
};
