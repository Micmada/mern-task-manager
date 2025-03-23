const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  dueDate: { type: Date, required: false }, // New field
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" } // New field
});

module.exports = mongoose.model("Task", TaskSchema);

