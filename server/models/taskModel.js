import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    dateTime: {
        type: Date,
        required: true,
        default: Date.now, 
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium",
    },
    status: {
        type: String,
        enum: ["Open", "In Progress", "Completed"],
        default: "Open",
    },
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);

export default Task;