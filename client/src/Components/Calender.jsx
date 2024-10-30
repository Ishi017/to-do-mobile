import React from 'react';
import "../Styles/Calender.css";

const Calendar = () => {
  const today = new Date();

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const todayIndex = today.getDay();

  const currentDate = today.getDate();

  const dates = Array.from({ length: 7 }, (_, i) => {
    const weekDate = new Date(today);
    weekDate.setDate(currentDate - todayIndex + i);
    return weekDate.getDate();
  });

  return (
    <div className="calendar">
      {daysOfWeek.map((day, index) => (
        <div className={`frame ${index === todayIndex ? 'active' : ''}`} key={index}>
          <div className="day">
            {day}<br />{dates[index]}
          </div>
          {index === todayIndex && <div className="ellipse"></div>}
        </div>
      ))}
    </div>
  );
};

export default Calendar;