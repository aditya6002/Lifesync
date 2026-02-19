const AppError = require("../middleware/AppError.middleware.js");
const Task = require("../models/task.model.js");

// Get taskk
const getAllTasks = async (req, res) => {
  const { skip = 0, limit = 15 } = req.params;

  if (skip < 0 || limit < 0) {
    throw new AppError("Invalid request", 404);
  }

  const tasks = await Task.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .skip(Number(skip))
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    message: "Tasks fetched",
    tasks,
  });
};

// Create a task
const addNewTask = async (req, res) => {
  const { title, content, createdAt = new Date() } = req.body;

  if (!title || !content || !title.trim() || !content.trim()) {
    throw new AppError("All field are required", 403);
  }

  const newTask = await Task.create({
    title,
    content,
    createdAt,
    userId: req.user.id,
  });

  res.status(201).json({
    success: true,
    message: "Task created",
    newTask,
  });
};

// Edit Task
const editTask = async (req, res) => {
  const { task } = req.body;
  if (!task) {
    throw new AppError("Task is required", 400);
  }

  const editedTask = await Task.findByIdAndUpdate(
    task._id,
    { title: task.title, content: task.content, isDone: task.isDone },
    { new: true },
  );

  if (!editedTask) {
    throw new AppError("Task not found");
  }

  await res
    .status(200)
    .json({ success: true, message: "Updated successfully", editedTask });
};

// Delete Task
const deleteTask = async (req, res) => {
  const deletedTask = await Task.findByIdAndDelete({ _id: req.params.taskId });
  if (!deletedTask) {
    throw new AppError("Task not found", 404);
  }
  res.status(200).json({
    success: true,
    message: "Deleted successfully",
    deletedTask,
  });
};

module.exports = { getAllTasks, addNewTask, editTask, deleteTask };
