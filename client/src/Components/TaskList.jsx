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

  // Handle the click on the edit button
  const handleEditClick = (task) => {
    setEditTaskId(task._id);
    const formattedDateTime = new Date(task.dateTime).toISOString().slice(0, 16);
    setEditedTask({ 
      title: task.title, 
      description: task.description, 
      dateTime: formattedDateTime 
    });
  };

  // Handle save after editing
  const handleEditSubmit = async () => {
    try {
      await axios.put(`${API_URL}/tasks/${editTaskId}`, editedTask);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === editTaskId ? { ...task, ...editedTask } : task))
      );
      setEditTaskId(null); // Close edit mode
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Handle status change with checkbox
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

  // Filter tasks for today's date
  const currentDate = new Date().toISOString().slice(0, 10);
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
                // Editable form when in edit mode
                <div className="edit-form">
                  <input
                    type="text"
                    value={editedTask.title}
                    onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                    className="edit-input"
                  />
                  <input
                    type="text"
                    value={editedTask.description}
                    onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                    className="edit-input"
                  />
                  <input
                    type="datetime-local"
                    value={editedTask.dateTime}
                    onChange={(e) => setEditedTask({ ...editedTask, dateTime: e.target.value })}
                    className="edit-input"
                  />
                  <button onClick={handleEditSubmit} className="save-button">Save</button>
                  <button onClick={() => setEditTaskId(null)} className="cancel-button">Cancel</button>
                </div>
              ) : (
                // Regular task display when not editing
                <div className="task-content">
                  <input
                    type="checkbox"
                    checked={task.status === "Completed"}
                    onChange={() => handleCheckboxChange(task)}
                    className="task-checkbox"
                  />
                  <Link to={`/view-task/${task._id}`} className={`task-name ${task.status === "Completed" ? "task-done-name" : ""}`}>
                    {task.title}
                  </Link>
                </div>
              )}
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