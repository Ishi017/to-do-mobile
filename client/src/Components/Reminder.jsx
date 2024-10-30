import React, { useEffect, useState } from 'react';
import "../Styles/Reminder.css";
import Pending from "../assets/pending.svg";
import Completed from "../assets/completed.svg";
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL; 

const Reminder = () => {
  const [completedCount, setCompletedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  const getStartOfWeek = (date) => {
    const day = date.getUTCDay();
    const diff = (day >= 1 ? day - 1 : 6);
    const monday = new Date(date);
    monday.setDate(date.getDate() - diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${API_URL}/tasks`);
        const tasks = response.data;

        const today = new Date();
        const firstDayOfWeek = getStartOfWeek(today);

        const completedTasks = tasks.filter(task => 
          task.status === "Completed" && new Date(task.dateTime) >= firstDayOfWeek && new Date(task.dateTime) <= new Date(firstDayOfWeek).setDate(firstDayOfWeek.getDate() + 6)
        );

        const pendingTasks = tasks.filter(task => 
          task.status !== "Completed" && new Date(task.dateTime) >= firstDayOfWeek && new Date(task.dateTime) <= new Date(firstDayOfWeek).setDate(firstDayOfWeek.getDate() + 6)
        );

        setCompletedCount(completedTasks.length);
        setPendingCount(pendingTasks.length);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="task-reminder-container">
      <div className="task-complete">
        <div className="task-complete-header">
          <div className="task-icon">
            <img src={Completed} alt="Task Complete" />
          </div>
          <span className="task-complete-text">Task Complete</span>
        </div>
        <div className="task-complete-details">
          <span className="task-count">{completedCount}</span>
          <span className="task-week">This Week</span>
        </div>
      </div>

      <div className="task-pending">
        <div className="task-pending-header">
          <div className="pending-icon">
            <img src={Pending} alt="Task Pending" />
          </div>
          <span className="task-pending-text">Task Pending</span>
        </div>
        <div className="task-pending-details">
          <span className="task-count">{pendingCount}</span>
          <span className="task-week">This Week</span>
        </div>
      </div>
    </div>
  );
};

export default Reminder;