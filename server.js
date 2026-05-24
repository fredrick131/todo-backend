const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log(err));

// Schema
const taskSchema = new mongoose.Schema({
  task: String,
  status: { type: String, default: "pending" },
});

const Task = mongoose.model("Task", taskSchema);

// GET
app.get("/api/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// ADD
app.post("/api/tasks", async (req, res) => {
  await Task.create({ task: req.body.task });

  const tasks = await Task.find();
  res.json(tasks);
});

// UPDATE STATUS
app.put("/api/tasks/:id", async (req, res) => {
  await Task.findByIdAndUpdate(req.params.id, {
    status: req.body.status,
  });

  const tasks = await Task.find();
  res.json(tasks);
});

// DELETE
app.delete("/api/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);

  const tasks = await Task.find();
  res.json(tasks);
});

// 🔥 FIXED PART ONLY (Render compatible)
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});