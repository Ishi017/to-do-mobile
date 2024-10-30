import express from "express";
import mongoose from "mongoose";
import methodOverride from "method-override";
import dotenv from "dotenv"; 
import Task from "./models/taskModel.js";
import cors from "cors"; 

dotenv.config(); 

const app = express();
const port = 8080;

const dbUrl = process.env.ATLASDB_URL;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(methodOverride('_method'));

async function main() {
    try {
        await mongoose.connect(dbUrl); // Connect to MongoDB
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}

main(); 

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

app.post('/tasks', async (req, res) => {
    const { title, description, dateTime } = req.body;

    // Check for undefined values
    console.log('Received task:', req.body);

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
        const task = await Task.findByIdAndUpdate(id, { title, description, dateTime, status }, { new: true }); // Update all fields
        res.json(task); // Return the updated task
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

app.get("/", (req, res) => {
    console.log("hi"); 
    res.send("Hello World!"); 
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});