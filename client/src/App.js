import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};


const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", dueDate: "", priority: "Medium" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [filterStatus, setFilterStatus] = useState("uncompleted");
  const [filterPriority, setFilterPriority] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");

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



const filteredTasks = tasks
  .filter(task => 
    filterStatus === "all" || 
    (filterStatus === "completed" && task.completed) || 
    (filterStatus === "uncompleted" && !task.completed)
  )
  .filter(task => 
    filterPriority === "all" || task.priority === filterPriority
  )
  .sort((a, b) => {
    if (sortBy === "dueDate") {
      return new Date(a.dueDate) - new Date(b.dueDate);
    } else if (sortBy === "priority") {
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      if (priorityOrder[a.priority] === priorityOrder[b.priority]) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return new Date(a.createdAt) - new Date(b.createdAt);
  });


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

      <div className="filters">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="uncompleted">Incomplete</option>
          <option value="completed">Completed</option>
          <option value="all">All Tasks</option>
        </select>

        <select onChange={(e) => setFilterPriority(e.target.value)}>
          <option value="all">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select onChange={(e) => setSortBy(e.target.value)}>
          <option value="createdAt">Sort by Creation First</option>
          <option value="dueDate">Sort by Due First</option>
          <option value="priority">Sort by Highest Priority</option>
        </select>
      </div>
      <ul>
        {filteredTasks.map((task) => (
          <li key={task._id} className={`${task.completed ? "completed" : ""} ${
              task.priority === "High" ? "high-priority" :
              task.priority === "Medium" ? "medium-priority" : 
              "low-priority"
            }`}>

            
            <div>
            <strong>{task.title}</strong> <br />
            Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-GB', options) : "No due date"} <br />
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
