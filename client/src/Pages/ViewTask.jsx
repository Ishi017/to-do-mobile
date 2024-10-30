import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../Styles/ViewTask.css";
import Back from "../assets/back.svg";
const apiUrl = import.meta.env.VITE_API_URL;

const ViewTask = () => {
  const { id } = useParams(); // Get task ID from URL
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dateTime: '',
    status: ''
  });

  // Fetch task data by ID
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`${apiUrl}/tasks/${id}`);
        setTask(response.data);
        setFormData({
          title: response.data.title,
          description: response.data.description,
          dateTime: response.data.dateTime,
          status: response.data.status
        });
      } catch (error) {
        console.error('Error fetching task:', error);
      }
    };

    fetchTask();
  }, [id]);

  // Handle input changes for editing
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle save updates
  const handleSave = async () => {
    try {
      const response = await axios.put(`${apiUrl}/tasks/${id}`, formData);
      setTask(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Handle delete task
  const handleDelete = async () => {
    try {
      await axios.delete(`${apiUrl}/tasks/${id}`);
      navigate('/home'); // Redirect after deletion to "/home"
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (!task) return <div className="view-task-loading">Loading...</div>;

  return (
    <div className="view-task-container">
      {/* Back button to navigate to home */}
      <img
        src={Back}
        alt="Back"
        className="back-button"
        onClick={() => navigate('/home')}
      />
      <h2 className="view-task-header">Task Details</h2>
      {isEditing ? (
        <div className="view-task-edit-form">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="view-task-input"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="view-task-textarea"
          />
          <input
            type="datetime-local"
            name="dateTime"
            value={formData.dateTime}
            onChange={handleChange}
            className="view-task-datetime"
          />
          <input
            type="text"
            name="status"
            value={formData.status}
            onChange={handleChange}
            placeholder="Status"
            className="view-task-status"
          />
          <div className="view-task-buttons">
            <button onClick={handleSave} className="view-task-save-button">Save</button>
            <button onClick={() => setIsEditing(false)} className="view-task-cancel-button">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="view-task-details">
          <h3 className="view-task-title">Title: {task.title}</h3>
          <p className="view-task-description">Description: {task.description}</p>
          <p className="view-task-date">Date: {new Date(task.dateTime).toLocaleString()}</p>
          <p className="view-task-status">Status: {task.status}</p>
          <div className="view-task-buttons">
            <button onClick={() => setIsEditing(true)} className="view-task-edit-button">Edit</button>
            <button onClick={handleDelete} className="view-task-delete-button">Delete</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewTask;