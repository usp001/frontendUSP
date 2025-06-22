import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Calendar.css";

const Calendar = ({ refreshKey }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    fetchEvents();
  }, [refreshKey]);

  const fetchEvents = async () => {
    try {
      const { data } = await axios.post(
        "https://backend-production-fc3a.up.railway.app/api/event/listEvent",
        { department: [] },
        { headers: { "Content-Type": "application/json" } }
      );

      if (Array.isArray(data.data)) {
        setEvents(data.data);
      } else {
        console.error("Unexpected response format:", data);
        setEvents([]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    }
  };

  const handleMonthChange = (offset) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + offset)
    );
  };

  const renderCalendarDays = () => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const firstDayIndex = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const cells = [];

    // Fill leading empty cells
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push(
        <div key={`empty-${i}`} className="calendar-day calendar-empty"></div>
      );
    }

    // Fill day cells
    for (let day = 1; day <= totalDays; day++) {
      const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

      const dayEvents = events.filter((event) => {
        const eventDate = new Date(event.startDate).toISOString().split("T")[0];
        return eventDate === dateString;
      });

      cells.push(
        <div key={day} className="calendar-day">
          <div className="calendar-day-number">{day}</div>
          <div className="calendar-events">
            {dayEvents.map((event) => {
              const start = new Date(event.startDate);
              const end = new Date(event.endDate);

              const formatTime = (d) =>
                `${d.getHours() % 12 || 12}:${String(d.getMinutes()).padStart(2, "0")} ${d.getHours() >= 12 ? "PM" : "AM"}`;

              return (
                <div
                  key={event.id}
                  className="calendar-event"
                  title={`${event.title}\n${event.info}\n${event.department}`}
                >
                  {`${event.title} (${formatTime(start)} - ${formatTime(end)})`}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return cells;
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h1 className="calendar-title">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h1>
        <div className="calendar-navigation">
          <button onClick={() => handleMonthChange(-1)}>←</button>
          <button onClick={() => handleMonthChange(1)}>→</button>
        </div>
      </div>

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {weekdays.map((day) => (
            <div key={day} className="calendar-weekday">
              {day}
            </div>
          ))}
        </div>
        <div className="calendar-days">{renderCalendarDays()}</div>
      </div>
    </div>
  );
};

export default Calendar;
