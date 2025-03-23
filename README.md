# MERN Task Manager

## Overview
This is a full-stack Task Manager application built with the MERN stack (MongoDB, Express, React, Node.js). Users can **Create, Read, Update, and Delete (CRUD)** tasks.

## Features
- Add tasks
- View all tasks
- Update tasks
- Delete tasks

## Technologies Used
- **Frontend:** React, Axios
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Other:** CORS, Dotenv

## Setup Instructions

### 1. Clone the repository
```sh
git clone YOUR_GITHUB_REPO_URL
cd mern-task-manager
```

### 2. Install dependencies
#### Backend
```sh
cd server
npm install
```
#### Frontend
```sh
cd client
npm install
```

### 3. Set up environment variables
Create a `.env` file inside the `server` folder:
```
MONGO_URI=your_mongodb_connection_string
```

### 4. Run the application
#### Start the backend server
```sh
cd server
nodemon server.js
```
#### Start the frontend
```sh
cd client
npm start
```

### 5. Open the application
Visit `http://localhost:3000` in your browser.

## API Endpoints
| Method | Endpoint       | Description         |
|--------|--------------|---------------------|
| GET    | /api/tasks   | Get all tasks       |
| POST   | /api/tasks   | Create a new task   |
| PUT    | /api/tasks/:id | Update a task      |
| DELETE | /api/tasks/:id | Delete a task      |

## Deployment
- **Frontend:** Deploy to **Netlify** or **Vercel**
- **Backend:** Deploy to **Render** or **Heroku**

## Contributing
Feel free to fork this repo, create a new branch, and submit a pull request!

