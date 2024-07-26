import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useUser } from "./../context/userProvider";
import { Link } from "react-router-dom";
import BackSvg from "./SVG/BackSvg";
import useFetch from "../hooks/useFetch";

function MyCalendar() {
  const [date, setDate] = useState(new Date());
  const [workHours, setWorkHours] = useState([]);
  const [message, setMessage] = useState("");
  const { user } = useUser();
  const { fetchData, error } = useFetch();

  const onChange = async (date) => {
    setDate(date);
    const hours = await fetchWorkHours(date);
    setWorkHours(hours);
  };

  const fetchWorkHours = async (date) => {
    const formattedDate = formatLocalDate(date); // Formatierung des Datums in YYYY-MM-DD
    console.log(formattedDate);

    const { ok, data } = await fetchData(
      `/api/time/${user.id}/${formattedDate}`,
      "GET"
    );

    if (ok) {
      if (data.data.length === 0) {
        setMessage("Keine Einträge für diesen Tag");
        return [];
      } else {
        setMessage("");
        return transformWorkHours(data.data);
      }
    } else {
      console.error("Fehler beim Abrufen der Arbeitsstunden:", error);
      setMessage("Fehler beim Abrufen der Arbeitsstunden");
      return [];
    }
  };

  // Funktion zur Transformation der Arbeitsstunden-Daten
  const transformWorkHours = (data) => {
    return data.map((timeEntry) => {
      return {
        startTime: new Date(timeEntry.startTime).toLocaleTimeString(),
        endTime: timeEntry.endTime
          ? new Date(timeEntry.endTime).toLocaleTimeString()
          : "Noch offen",
        durationTime: transformDuration(timeEntry.durationTime),
      };
    });
  };

  const transformDuration = (durationString) => {
    const parts = durationString.match(
      /Stunden: (\d+), Minuten: (\d+), Sekunden: (\d+)/
    );
    if (!parts) return "0:00:0";

    const hours = parseInt(parts[1], 10);
    const minutes = parseInt(parts[2], 10);
    const seconds = parseInt(parts[3], 10);

    // Format to hh:mm:ss
    const formattedHours = hours;
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  // Funktion zur Formatierung des Datums in der lokalen Zeitzone
  const formatLocalDate = (date) => {
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
    return adjustedDate.toISOString().split("T")[0];
  };

  return (
    <div>
      <div className="flex justify-center items-center mb-6">
        <Link to="/time" className="btn btn-active btn-primary">
          <BackSvg />
          Start/Stop
        </Link>
      </div>

      <h2 className="text-center font-semibold text-xl pb-2">Datum wählen</h2>
      <Calendar
        onChange={onChange}
        value={date}
        className="border-primary rounded-md bg-base-100 text-primary"
      />
      <div className="flex-col justify-center items-center mt-4">
        <p className="p-4 border border-primary rounded-md">
          Datum: {date.toDateString()}
        </p>
        {message ? (
          <p className="p-4 border border-primary rounded-md">{message}</p>
        ) : (
          <ul className="p-4 border border-primary rounded-md">
            {workHours.map((hour, index) => (
              <li className="border-b border-primary" key={index}>
                {hour.startTime} - {hour.endTime} Uhr{" "}
                <span className="block text-primary">
                  Dauer: {hour.durationTime}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MyCalendar;
