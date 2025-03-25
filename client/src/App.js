import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import "./App.css";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";


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
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (message) {
      const fadeTimer = setTimeout(() => {
        const messageElement = document.querySelector(".fade-message");
        if (messageElement) {
          messageElement.classList.add("fade-out");
        }
      }, 8000); // Start fading at 8 seconds
  
      const clearTimer = setTimeout(() => {
        setMessage("");
      }, 10000); // Remove message after 10 seconds
  
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(clearTimer);
      };
    }
  }, [message]);
  
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
  
    const today = new Date().toISOString().split("T")[0];
    if (newTask.dueDate && newTask.dueDate < today) {
      setMessage("Due date cannot be in the past!");
      return;
    }
  
    axios.post("http://localhost:5000/api/tasks", newTask)
      .then((res) => {
        setTasks([...tasks, res.data]);
        setNewTask({ title: "", dueDate: "", priority: "Medium" });
        setMessage("Task added successfully!");
        setIsModalOpen(false);
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

  const statusOptions = [
    { value: "uncompleted", label: "Incomplete" },
    { value: "completed", label: "Completed" },
    { value: "all", label: "All Tasks" },
  ];

  const priorityOptions = [
    { value: "all", label: "All Priorities" },
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" },
  ];

  const newTaskPriorityOptions = [
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" },
  ];

  const sortByOptions = [
    { value: "createdAt", label: "Sort by Creation First" },
    { value: "dueDate", label: "Sort by Due First" },
    { value: "priority", label: "Sort by Highest Priority" },
  ];

  return (
    <div className="container">
      <h1>Task Manager</h1>
      <div className="message-container">
        {message && <p className="fade-message">{message}</p>}
      </div>



      {/* Button to open modal */}
      <button className="add-btn" onClick={() => setIsModalOpen(true)}>+ Add Task</button>

      {loading && <p>Loading...</p>}

      <div className="filters">
      <Select
          value={statusOptions.find(option => option.value === filterStatus)}
          onChange={(e) => setFilterStatus(e.value)}
          options={statusOptions}
          className="custom-select"
          classNamePrefix="custom-select"
        />

        <Select
          value={priorityOptions.find(option => option.value === filterPriority)}
          onChange={(e) => setFilterPriority(e.value)}
          options={priorityOptions}
          className="custom-select"
          classNamePrefix="custom-select"
        />

        <Select
          value={sortByOptions.find(option => option.value === sortBy)}
          onChange={(e) => setSortBy(e.value)}
          options={sortByOptions}
          className="custom-select"
          classNamePrefix="custom-select"
        />
      </div>

      {filteredTasks.length === 0 && <p>No Tasks To Show</p>}

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

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>X</button>
            <h2>Add Task</h2>
            <div className="message-container">
              {message && <p className="fade-message">{message}</p>}
            </div>

            <input className="modal-input"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="Enter task..."
            />
            <div className="test">
            <DatePicker
              selected={newTask.dueDate}
              onChange={(date) => setNewTask({ ...newTask, dueDate: date })}
              minDate={new Date()} // Prevent past dates
              dateFormat="dd/MM/yyyy"
              className="custom-datepicker"
              placeholderText="Select a due date"
            />
            </div>
            <Select
              value={newTaskPriorityOptions.find(option => option.value === newTask.priority)}  // Fix value to match the object format
              onChange={(e) => setNewTask({ ...newTask, priority: e.value })}  // Update the priority with the selected value
              options={newTaskPriorityOptions}
              className="custom-select"
              classNamePrefix="custom-select"
              placeholder="Select Priority"
            />

            <button className="add-btn" onClick={addTask}>Add Task</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

