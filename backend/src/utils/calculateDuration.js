export const calculateDuration = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);

  // Berechne den Unterschied in Millisekunden
  const durationMs = end - start;

  // Berechne Stunden, Minuten und Sekunden
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);

  // Erhalte den Tag des Monats, Wochentag und Monat
  const dayOfMonth = end.getDate();
  const weekDays = [
    "Sonntag",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
  ];
  const months = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ];
  const weekDay = weekDays[end.getDay()];
  const month = months[end.getMonth()];

  return `Stunden: ${hours}, Minuten: ${minutes}, Sekunden: ${seconds} - Tag: ${dayOfMonth}, Wochentag: ${weekDay}, Monat: ${month}`;
};

// Beispiel für die Verwendung:
// const startTime =
//   "Sun Jul 21 2024 18:15:32 GMT+0200 (Central European Summer Time)";
// const endTime =
//   "Sun Jul 21 2024 19:35:02 GMT+0200 (Central European Summer Time)";
// console.log(calculateDuration(startTime, endTime));
