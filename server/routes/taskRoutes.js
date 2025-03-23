const express = require("express");
const Task = require("../models/Task");
const router = express.Router();

// Create a task
router.post("/tasks", async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.send(task);
});

// Get all tasks
router.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.send(tasks);
});

// Update a task
router.put("/tasks/:id", async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(task);
});

// Delete a task
router.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.send({ message: "Task deleted" });
});

module.exports = router;
