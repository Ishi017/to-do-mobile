import React, { useEffect, useState } from 'react';
import '../Styles/AllTasks.css'; 
import Back from "../assets/back.svg";
import { Link } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;

const AllTasks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${apiUrl}/tasks`);
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleCheckboxChange = async (id, currentStatus) => {
    try {
      const updatedStatus = currentStatus === "Completed" ? "Open" : "Completed"; // Toggle status
      await fetch(`http://localhost:8080/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: updatedStatus }), // Send updated status
      });

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? { ...task, status: updatedStatus } : task
        )
      );
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

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

  // Filter and get tasks for the current week
  const filteredTasks = getCurrentWeekTasks(tasks).filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="all-tasks-page">
      <div className="back-button-container">
        <Link to="/home"><img src={Back} alt="Back" className="back-icon" /></Link>
      </div>
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Finish"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input-all-tasks"
        />
        <div className="search-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="10.5"
              cy="10.5"
              r="7.5"
              stroke="#090E23"
              strokeWidth="1.5"
            />
            <line
              x1="16.5"
              y1="16.5"
              x2="21.5"
              y2="21.5"
              stroke="#090E23"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </div>

      {loading ? (
        <div>Loading tasks...</div>
      ) : (
        <div className="task-list-container">
          {filteredTasks.map(task => (
            <div key={task._id} className={`task-item ${task.status === "Completed" ? 'task-done' : ''}`}>
              <div className="alltasks-listnames">
                <input 
                  type="checkbox" 
                  checked={task.status === "Completed"} 
                  onChange={() => handleCheckboxChange(task._id, task.status)} 
                  className="task-checkbox" 
                />
                <span className={`task-name-all-tasks ${task.status === "Completed" ? 'line-through' : ''}`}>
                  {task.title}
                </span>
              </div>
              <div className="task-divider"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllTasks;