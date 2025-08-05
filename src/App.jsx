import './App.css'
import TaskBoard from './components/TaskBoard'
import AddTaskButton from './components/AddTaskButton'
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';

const BACKEND_URL = 'https://backend-mthk.onrender.com';

function App() {

  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isAddingTask, setIsAddingTask] = useState(false);

  useEffect(() => {
    fetch(`${BACKEND_URL}/tasks`)
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error("Failed to load tasks:", err));
  }, []);


  //TODO add http requests
  const addTask = (taskText) => {
    fetch(`${BACKEND_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: taskText })
    })
      .then(res => res.json())
      .then(data => {
        const newTask = {
          _id: data._id,
          title: taskText,
          completed: false
        };
        setTasks([...tasks, newTask]);
        setIsAddingTask(false);
      })
      .catch(err => console.error("Failed to add task:", err));
  };


  //TODO add http requests
  const editTask = (taskId, newText) => {
    fetch(`${BACKEND_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newText })
    })
      .then(() => {
        setTasks(tasks.map(task => task._id === taskId ? { ...task, title: newText } : task));
        setSelectedTaskId(null);
      })
      .catch(err => console.error("Failed to edit task:", err));
  };


  //TODO add http request
  const deleteTask = (taskId) => {
    fetch(`${BACKEND_URL}/tasks/${taskId}`, {
      method: 'DELETE'
    })
      .then(() => {
        setTasks(tasks.filter(task => task._id !== taskId));
        setSelectedTaskId(null);
      })
      .catch(err => console.error("Failed to delete task:", err));
  };


  //TODO add http requests
  const toggleComplete = (taskId) => {
    const task = tasks.find(t => t._id === taskId);
    const updatedTask = { ...task, completed: !task.completed };

    fetch(`${BACKEND_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: updatedTask.completed })
    })
      .then(() => {
        setTasks(tasks.map(task => task._id === taskId ? updatedTask : task));
      })
      .catch(err => console.error("Failed to toggle complete:", err));
  };


  return (
    <div className='app-container'> 
      <h1>Task Tracker</h1>
      <TaskBoard 
        tasks={tasks}
        selectedTaskId={selectedTaskId}
        setSelectedTaskId={setSelectedTaskId}
        isAddingTask={isAddingTask}
        setIsAddingTask={setIsAddingTask}
        onAddTask={addTask}
        onEditTask={editTask}
        onDeleteTask={deleteTask}
        onToggleComplete={toggleComplete}
      />
      <AddTaskButton 
        isAddingTask={isAddingTask}
        setIsAddingTask={setIsAddingTask}
      />
    </div>
  )
}

export default App
