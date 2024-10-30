import React, { useState, useEffect } from 'react';
import '../Styles/TaskPopup.css';
import Cross from "../assets/cross.svg";

const TaskPopup = ({ isOpen, onClose }) => {
    const [taskDetails, setTaskDetails] = useState({
        title: '',
        startTime: '',
        endTime: '',
        date: '',
        description: '',
    });

    // Effect to set default date and time
    useEffect(() => {
        if (isOpen) {
            const now = new Date();
            const currentDate = now.toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
            const currentTime = now.toTimeString().split(' ')[0].slice(0, 5); // Get current time in HH:MM format

            setTaskDetails(prevDetails => ({
                ...prevDetails,
                date: currentDate,
                startTime: currentTime,
                endTime: currentTime, // You can set a default end time if needed
            }));
        }
    }, [isOpen]); // Run this effect when the popup opens

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTaskDetails({
            ...taskDetails,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const { title, startTime, endTime, date, description } = taskDetails;
    
        // Log the taskDetails to see their values
        console.log('Task Details:', taskDetails);
    
        const dateTime = new Date(`${date}T${startTime}`); // Combine date and startTime
    
        // Create a task object
        const taskToSend = {
            title,
            description,
            dateTime, // Ensure this is being sent
        };
    
        // Log the final object to send
        console.log('Task to send:', taskToSend);
    
        try {
            const response = await fetch('http://localhost:8080/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskToSend),
            });
    
            if (!response.ok) {
                throw new Error('Failed to create task');
            }
    
            const newTask = await response.json();
            console.log('New Task:', newTask);
            setTaskDetails({
                title: '',
                startTime: '',
                endTime: '',
                date: '',
                description: '',
            });
            onClose();
        } catch (error) {
            console.error('Error adding task:', error);
            alert('Error adding task: ' + error.message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="task-popup-overlay">
            <div className="task-popup-content">
                <img
                    src={Cross}
                    alt="Close"
                    className="task-popup-close-icon"
                    onClick={onClose}
                />
                <h2 className="task-popup-heading">Add New Task</h2>
                <form onSubmit={handleSubmit} className="task-popup-form">
                    <div className="task-popup-field">
                        <label htmlFor="title" className="task-popup-label">Task Title</label>
                        <input
                            type="text"
                            name="title"
                            value={taskDetails.title}
                            onChange={handleChange}
                            placeholder="Enter task title"
                            required
                            className="task-popup-input"
                        />
                    </div>
                    <div className="taskpopup-time">
                        <div className="task-popup-field">
                            <label htmlFor="startTime" className="task-popup-label">Start Time</label>
                            <input
                                type="time"
                                name="startTime"
                                value={taskDetails.startTime}
                                onChange={handleChange}
                                required
                                className="task-popup-input"
                            />
                        </div>
                        <div className="task-popup-field">
                            <label htmlFor="endTime" className="task-popup-label">End Time</label>
                            <input
                                type="time"
                                name="endTime"
                                value={taskDetails.endTime}
                                onChange={handleChange}
                                required
                                className="task-popup-input"
                            />
                        </div>
                    </div>
                    <div className="task-popup-field">
                        <label htmlFor="date" className="task-popup-label">Set Date</label>
                        <input
                            type="date"
                            name="date"
                            value={taskDetails.date}
                            onChange={handleChange}
                            required
                            className="task-popup-input"
                        />
                    </div>
                    <div className="task-popup-field">
                        <label htmlFor="description" className="task-popup-label">Description</label>
                        <textarea
                            name="description"
                            value={taskDetails.description}
                            onChange={handleChange}
                            placeholder="Add Description"
                            required
                            className="task-popup-textarea"
                        />
                    </div>
                    <button type="submit" className="task-popup-submit-button">Create Task</button>
                </form>
            </div>
        </div>
    );
};

export default TaskPopup;