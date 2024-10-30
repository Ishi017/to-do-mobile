import React, { useEffect, useState } from 'react';
import '../Styles/TaskList.css';
import Edit from "../assets/edit.svg";
import Delete from "../assets/delete.svg";
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState({ title: '', description: '', dateTime: '' });

  // Fetch tasks from the server
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${API_URL}/tasks`);
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);
  console.log("API URL:", import.meta.env.VITE_API_URL);

  
  const handleEditClick = (task) => {
    setEditTaskId(task._id);
    const formattedDateTime = new Date(task.dateTime).toISOString().slice(0, 16);
    setEditedTask({ 
      title: task.title, 
      description: task.description, 
      dateTime: formattedDateTime 
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_URL}/tasks/${editTaskId}`, editedTask);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === editTaskId ? response.data : task))
      );
      setEditTaskId(null); // Reset the edit state
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id)); // Update the state after deletion
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleCheckboxChange = async (task) => {
    const updatedStatus = task.status === "Completed" ? "Open" : "Completed";
    try {
      await axios.put(`${API_URL}/tasks/${task._id}`, { status: updatedStatus });
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t._id === task._id ? { ...t, status: updatedStatus } : t))
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  // Get the current date in 'YYYY-MM-DD' format
  const currentDate = new Date().toISOString().slice(0, 10);

  // Filter tasks to only include those that match the current date
  const filteredTasks = tasks.filter(task => 
    new Date(task.dateTime).toISOString().slice(0, 10) === currentDate
  );

  return (
    <div className="weekly-progress">
      <div className="task-today">
        <div className="tasks-today-title">Tasks Today</div>
        <Link to="/all-tasks">
          <div className="view-all">View All</div>
        </Link>
      </div>
      <div className="task-list">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (  
            <div key={task._id} className={`task-item ${task.status === "Completed" ? "task-done" : "tasklist-pending"}`}>
              {editTaskId === task._id ? (
                <form onSubmit={handleEditSubmit} className="edit-form">
                  <input
                    type="text"
                    name="title"
                    value={editedTask.title}
                    onChange={handleEditChange}
                    required
                  />
                  <textarea
                    name="description"
                    value={editedTask.description}
                    onChange={handleEditChange}
                    required
                  />
                  <input
                    type="datetime-local"
                    name="dateTime"
                    value={editedTask.dateTime}
                    onChange={handleEditChange}
                    required
                  />
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setEditTaskId(null)}>Cancel</button>
                </form>
              ) : (
                <>
                  <div className="task-content">
                    <input
                      type="checkbox"
                      checked={task.status === "Completed"}
                      onChange={() => handleCheckboxChange(task)}
                      className="task-checkbox" 
                    />
                    <div className={`task-name ${task.status === "Completed" ? "task-done-name" : ""}`}>
                      {task.title}
                    </div>
                  </div>
                  <div className="edit-trash">
                    <img
                      src={Edit}
                      alt="Edit"
                      className="edit"
                      onClick={() => handleEditClick(task)}
                    />
                    <img
                      src={Delete}
                      alt="Delete"
                      className="trash-2"
                      onClick={() => handleDelete(task._id)}
                    />
                  </div>
                  <div className="line-1"></div>
                </>
              )}
            </div>
          ))
        ) : (
          <div>No tasks available</div>
        )}
      </div>
    </div>
  );
};

export default TaskList;