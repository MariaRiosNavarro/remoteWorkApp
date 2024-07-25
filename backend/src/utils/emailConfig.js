import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Lädt Umgebungsvariablen aus der .env-Datei
dotenv.config();

// Erstellt einen nodemailer-Transporter für den E-Mail-Versand
export const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER, // Benutzername für den Mailtrap-Service
    pass: process.env.MAILTRAP_PASSWORD, // Passwort für den Mailtrap-Service
  },
});

/**
 * Sendet eine E-Mail, wenn ein Benutzer seine Homeoffice-Zeit beendet.
 */
export const sendEmail = async (user, time) => {
  try {
    await transporter.sendMail({
      from: '"Home Office System"', // Absender der E-Mail
      to: process.env.OFFICE_EMAIL, // E-Mail-Adresse des Personalbüros
      subject: `Homeoffice beendet von ${user.email}`, // Betreff der E-Mail
      text: `
      Liebes Team des Personalbüros!
      
      Der Benutzer mit der E-Mail ${user.email} hat seine Homeoffice-Zeit beendet.
      Start: ${time.startTime}
      Ende: ${time.endTime}
      Dauer: ${time.durationTime} Stunden`,
      html: `
      <div style='font-family: system-ui, -apple-system, sans-serif, Arial'>
        <h2>Liebes Team des Personalbüros!</h2>
        <p>Der Benutzer mit der E-Mail ${user.email} hat seine Homeoffice-Zeit beendet</p>
        <p>Start:</p>
        <p style='font-family: monospace, Courier; letter-spacing: 5px; border: 1px solid black; width: fit-content; padding: 5px;'>${time.startTime}</p>
        <p>Ende:</p>
        <p style='font-family: monospace, Courier; letter-spacing: 5px; border: 1px solid black; width: fit-content; padding: 5px;'>${time.endTime}</p>
        <p>Dauer:</p>
        <p style='font-family: monospace, Courier; letter-spacing: 5px; border: 1px solid black; width: fit-content; padding: 5px;'>${time.durationTime}</p>
        <p>Mit freundlichen Grüßen, Homeoffice Admin</p>
      </div>`,
    });
    console.log("E-Mail erfolgreich gesendet");
  } catch (error) {
    console.error("Fehler beim Senden einer E-Mail:", error);
  }
};
