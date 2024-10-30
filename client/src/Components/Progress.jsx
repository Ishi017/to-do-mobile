import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../Styles/Progress.css";

const API_URL = import.meta.env.VITE_API_URL; // Ensure this is set in your environment variables

const WeeklyProgress = () => {
  const [completedPercentage, setCompletedPercentage] = useState(0);
  const [tasks, setTasks] = useState([]); // Added to store tasks

  // Utility function to get start of the week (Monday)
  const getStartOfWeek = (date) => {
    const day = date.getUTCDay();
    const diff = (day >= 1 ? day - 1 : 6); // Adjust if Sunday (0)
    const monday = new Date(date);
    monday.setDate(date.getDate() - diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  // Filter tasks for the current week
  const getCurrentWeekTasks = (tasks) => {
    const currentDate = new Date();
    const weekStart = getStartOfWeek(currentDate);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // End of the week (Sunday)

    return tasks.filter(task => {
      const taskDate = new Date(task.dateTime);
      return taskDate >= weekStart && taskDate <= weekEnd;
    });
  };

  // Function to calculate completed tasks percentage
  const calculateProgress = (tasks) => {
    const currentWeekTasks = getCurrentWeekTasks(tasks); 

    const completedTasks = currentWeekTasks.filter(task => task.status === "Completed");
    const totalTasks = currentWeekTasks.length;

    // Calculate completed percentage
    if (totalTasks > 0) {
      const percentage = (completedTasks.length / totalTasks) * 100;
      setCompletedPercentage(percentage);
    } else {
      setCompletedPercentage(0);
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${API_URL}/tasks`);
        const fetchedTasks = response.data;
        setTasks(fetchedTasks); // Store tasks
        calculateProgress(fetchedTasks); 
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="weekly-progress-container">
      <span className="weekly-progress-text">Weekly Progress</span>
      <div className="progress-background">
        <div className="progress-bar" style={{ width: `${completedPercentage}%` }}></div>
      </div>
    </div>
  );
};

export default WeeklyProgress;