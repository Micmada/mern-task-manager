const express = require("express");
const Task = require("../models/Task");
const router = express.Router();

// Create a task
router.post("/tasks", async (req, res) => {
    const { title, dueDate, priority } = req.body;
    const task = new Task({ title, dueDate, priority });
    await task.save();
    res.send(task);
  });
  

// Get all tasks
router.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.send(tasks);
});

// Update a task
router.put("/tasks/:id/toggle", async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) return res.status(404).send({ message: "Task not found" });
  
      task.completed = !task.completed; 
      await task.save();
  
      res.send(task);
    } catch (error) {
      res.status(500).send({ message: "Error updating task" });
    }
  });
  

// Delete a task
router.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.send({ message: "Task deleted" });
});

module.exports = router;
