import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", dueDate: "", priority: "Medium" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    setLoading(true);
    axios.get("http://localhost:5000/api/tasks")
      .then((res) => setTasks(res.data))
      .catch(() => setMessage("Error loading tasks"))
      .finally(() => setLoading(false));
  };

  const addTask = () => {
    if (!newTask.title.trim()) {
      setMessage("Task cannot be empty!");
      return;
    }

    axios.post("http://localhost:5000/api/tasks", newTask)
      .then((res) => {
        setTasks([...tasks, res.data]);
        setNewTask({ title: "", dueDate: "", priority: "Medium" });
        setMessage("Task added successfully!");
      })
      .catch(() => setMessage("Error adding task"));
  };

  const toggleComplete = (id) => {
    axios.put(`http://localhost:5000/api/tasks/${id}/toggle`)
      .then((res) => {
        setTasks(tasks.map((task) => (task._id === id ? res.data : task)));
        setMessage(res.data.completed ? "Task marked as completed!" : "Task marked as incomplete!");
      })
      .catch(() => setMessage("Error updating task"));
  };

  const deleteTask = (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    axios.delete(`http://localhost:5000/api/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter((task) => task._id !== id));
        setMessage("Task deleted successfully!");
      })
      .catch(() => setMessage("Error deleting task"));
  };

  return (
    <div className="container">
      <h1>Task Manager</h1>
      {message && <p style={{ color: "green" }}>{message}</p>}

      <input
        value={newTask.title}
        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        placeholder="Enter task..."
      />
      <input
        type="date"
        value={newTask.dueDate}
        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
      />
      <select
        value={newTask.priority}
        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <button className="add-btn" onClick={addTask}>Add Task</button>

      {loading ? <p>Loading...</p> : null}

      <ul>
  {tasks.map((task) => (
    <li 
      key={task._id} 
      className={`${task.completed ? "completed" : ""} ${
        task.priority === "High" ? "high-priority" :
        task.priority === "Medium" ? "medium-priority" : 
        "low-priority"
      }`}
    >
      <div>
        <strong>{task.title}</strong> <br />
        Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"} <br />
        Priority: <span style={{ color: task.priority === "High" ? "red" : task.priority === "Medium" ? "orange" : "green" }}>
          {task.priority}
        </span>
      </div>
      <button className="complete-btn" onClick={() => toggleComplete(task._id)}>
        {task.completed ? "Undo" : "Complete"}
      </button>
      <button className="delete-btn" onClick={() => deleteTask(task._id)}>Delete</button>
    </li>
  ))}
</ul>

    </div>
  );
};

export default App;
