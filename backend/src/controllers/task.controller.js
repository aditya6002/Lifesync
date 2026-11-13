import Task from "../models/features/task.model.js";

const getAllTasks = async (req, res) => {
  const userId = req.user._id;
  const { status } = req.query;

  const query = { userId };
  if (status && status !== "all") {
    query.status = status;
  }

  let tasks = await Task.find(query).sort({ createdAt: -1 });

  // If no tasks exist for user in dev mode, seed initial tasks for convenience
  if (tasks.length === 0 && process.env.NODE_ENV === "development") {
    const defaultTasks = [
      {
        title: "Review product design specs & wireframes",
        category: "Work",
        status: "completed",
        time: "9:00 AM",
        userId,
      },
      {
        title: "Implement LifeSync dashboard Page 2 UI",
        category: "Dev",
        status: "completed",
        time: "11:30 AM",
        userId,
      },
      {
        title: "Daily 30-min cardio & mindful walk",
        category: "Health",
        status: "pending",
        time: "5:00 PM",
        userId,
      },
      {
        title: "Write evening journal reflection on weekly goals",
        category: "Personal",
        status: "pending",
        time: "7:30 PM",
        userId,
      },
      {
        title: "Audit expenses and categorize monthly subscriptions",
        category: "Finance",
        status: "pending",
        time: "Tomorrow",
        userId,
      },
      {
        title: "Plan upcoming sprint focus & review team PRs",
        category: "Work",
        status: "pending",
        time: "Tomorrow",
        userId,
      },
    ];
    tasks = await Task.insertMany(defaultTasks);
  }

  // Format response with `isDone` for seamless frontend compatibility
  const formattedTasks = tasks.map((t) => ({
    id: t._id.toString(),
    _id: t._id,
    title: t.title,
    description: t.description,
    category: t.category || "Work",
    status: t.status,
    isDone: t.status === "completed",
    time: t.time || "Today",
    createdAt: t.createdAt,
  }));

  res.status(200).json({
    success: true,
    tasks: formattedTasks,
    message: "Tasks retrieved successfully",
  });
};

const createTask = async (req, res) => {
  const userId = req.user._id;
  const { title, description, category, time, status, isDone, dueDate } =
    req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: "Task title is required",
    });
  }

  const taskStatus =
    status || (isDone !== undefined ? (isDone ? "completed" : "pending") : "pending");

  const task = await Task.create({
    title: title.trim(),
    description: description ? description.trim() : null,
    category: category || "Work",
    time: time || "Today",
    dueDate: dueDate || null,
    status: taskStatus,
    userId,
  });

  res.status(201).json({
    success: true,
    task: {
      id: task._id.toString(),
      _id: task._id,
      title: task.title,
      description: task.description,
      category: task.category,
      status: task.status,
      isDone: task.status === "completed",
      time: task.time,
      createdAt: task.createdAt,
    },
    message: "Task created successfully",
  });
};

const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user._id;
  const { title, description, category, time, status, isDone } = req.body;

  const updateFields = {};
  if (title !== undefined) updateFields.title = title.trim();
  if (description !== undefined) updateFields.description = description;
  if (category !== undefined) updateFields.category = category;
  if (time !== undefined) updateFields.time = time;
  if (status !== undefined) {
    updateFields.status = status;
  } else if (isDone !== undefined) {
    updateFields.status = isDone ? "completed" : "pending";
  }

  const updatedTask = await Task.findOneAndUpdate(
    { _id: taskId, userId },
    { $set: updateFields },
    { new: true }
  );

  if (!updatedTask) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  res.status(200).json({
    success: true,
    task: {
      id: updatedTask._id.toString(),
      _id: updatedTask._id,
      title: updatedTask.title,
      description: updatedTask.description,
      category: updatedTask.category,
      status: updatedTask.status,
      isDone: updatedTask.status === "completed",
      time: updatedTask.time,
      createdAt: updatedTask.createdAt,
    },
    message: "Task updated successfully",
  });
};

const deleteTask = async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user._id;

  const deletedTask = await Task.findOneAndDelete({ _id: taskId, userId });

  if (!deletedTask) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
  });
};

const clearCompleted = async (req, res) => {
  const userId = req.user._id;

  await Task.deleteMany({ userId, status: "completed" });

  res.status(200).json({
    success: true,
    message: "Completed tasks cleared successfully",
  });
};

export default {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  clearCompleted,
};
