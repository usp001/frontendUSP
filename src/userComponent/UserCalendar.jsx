import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Calendar.css";

const UserCalendar = ({refreshKey}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    fetchEvents();
  }, [refreshKey]);

  const fetchEvents = async () => {
    try {
      const response = await axios.post(
        "https://backend-production-fc3a.up.railway.app/api/event/listEvent",
        {
          department: [],
        }
      );
      if (response.data && Array.isArray(response.data.data)) {
        setEvents(response.data.data);
      } else {
        console.error("Unexpected response format:", response.data);
        setEvents([]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const renderCalendarDays = () => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const firstDayIndex = firstDay.getDay();
    const totalDays = lastDay.getDate();
  
    const cells = [];
  
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push(<div key={`empty-${i}`} className="calendar-day bg-gray-50"></div>);
    }
  
    for (let day = 1; day <= totalDays; day++) {
      const date = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dayEvents = events.filter(
        (event) => new Date(event.startDate).toISOString().split("T")[0] === date
      );
  
      cells.push(
        <div key={day} className="calendar-day">
          <div className="calendar-day-number">{day}</div>
          <div className="space-y-1">
            {dayEvents.map((event) => {
              // Format the start and end times
              const startTime = new Date(event.startDate);
              const endTime = new Date(event.endDate);
  
              const formattedStartTime = `${startTime.getHours()}:${startTime.getMinutes() < 10 ? '0' : ''}${startTime.getMinutes()} ${startTime.getHours() >= 12 ? 'PM' : 'AM'}`;
              const formattedEndTime = `${endTime.getHours()}:${endTime.getMinutes() < 10 ? '0' : ''}${endTime.getMinutes()} ${endTime.getHours() >= 12 ? 'PM' : 'AM'}`;
  
              return (
                <div
                  key={event.id}
                  className={`calendar-event bg-blue-100 border-blue-300`}
                  title={`${event.title}: ${event.info} ${event.department}`}
                >
                  {event.title} {formattedStartTime} - {formattedEndTime}
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
          {`${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
        </h1>
        <div className="calendar-navigation">
          <button onClick={handlePrevMonth}>←</button>
          <button onClick={handleNextMonth}>→</button>
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

export default UserCalendar;
