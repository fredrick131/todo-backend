const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors());
app.use(express.json());

/* ---------------- MONGODB CONNECT ---------------- */
mongoose.connect(process.env.MONGO_URL)
.then(() => {
  console.log("✅ MongoDB Connected");
})
.catch((err) => {
  console.log("❌ MongoDB Error:", err.message);
});

/* ---------------- SCHEMA ---------------- */
const taskSchema = new mongoose.Schema({
  text: String,
  completed: {
    type: Boolean,
    default: false
  }
});

const Task = mongoose.model("Task", taskSchema);

/* ---------------- ROUTES ---------------- */

// Home route
app.get("/", (req, res) => {
  res.send("Todo Backend + MongoDB Running");
});

/* GET all tasks */
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

/* ADD task */
app.post("/tasks", async (req, res) => {
  const newTask = new Task({
    text: req.body.text
  });

  await newTask.save();
  res.json(newTask);
});

/* DELETE task */
app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);

  res.json({
    message: "Task deleted successfully"
  });
});

/* TOGGLE complete task */
app.put("/tasks/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found"
    });
  }

  task.completed = !task.completed;

  await task.save();

  res.json(task);
});

/* ---------------- SERVER ---------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});