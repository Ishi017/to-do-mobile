import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import methodOverride from "method-override";
import Task from "./models/taskModel.js";
import cors from "cors";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;
const dbUrl = process.env.ATLASDB_URL;
const frontendUrl = process.env.FRONTEND_URL;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// CORS configuration
app.use(
    cors({
      origin: frontendUrl,
      credentials: true,
    })
  );


// Connect to MongoDB
async function main() {
    try {
        await mongoose.connect(dbUrl); // Removed deprecated options
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}

main();

// Routes
app.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find(); // Fetch all tasks
        res.json(tasks); // Send tasks as JSON response
    } catch (err) {
        console.error("Error fetching tasks:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Get Task by ID
app.get('/tasks/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ message: 'Error fetching task', error });
    }
});

// Create a new Task
app.post('/tasks', async (req, res) => {
    const { title, description, dateTime } = req.body;

    try {
        const task = new Task({
            title,
            description,
            dateTime,
        });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Error creating task', error });
    }
});

// Update Task by ID
app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, dateTime, status } = req.body;

    try {
        const task = await Task.findByIdAndUpdate(id, { title, description, dateTime, status }, { new: true });
        res.json(task);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ message: 'Error updating task', error });
    }
});

// Delete Task by ID
app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await Task.findByIdAndDelete(id);
        res.status(204).send(); // No content response
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Error deleting task', error });
    }
});

// Root route
app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Start server
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
