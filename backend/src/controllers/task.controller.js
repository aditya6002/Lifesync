import Task from "../models/features/task.model.js";
import { encrypt, decrypt } from "../helper/hashing.helper.js";

const addTask = async (req, res) => {
  let { title, note, dueDate, startingTime, endingTime, priority } = req.body;

  const user = req.user;

  let startTime = new Date();
  let endTime = new Date();
  let [hours, minutes] = startingTime.split(":");
  let [endHours, endMinutes] = endingTime.split(":");

  startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  endTime.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);

  const durationInMinutes = (endTime - startTime) / (1000 * 60);
  const dueDateObj = new Date(dueDate);
  const hashTitle = encrypt(title);
  const hashNote = note ? encrypt(note) : null;
  priority = priority || "low";

  const task = await Task.create({
    task: hashTitle,
    note: hashNote,
    dueDate: dueDateObj,
    startingTime: startTime,
    endingTime: endTime,
    duration: durationInMinutes,
    priority: priority,
    userId: user.id,
  });

  res.status(201).json({
    message: "Task created successfully",
    task: {
      id: task.id,
      title: decrypt(task.task),
      note: task.note ? decrypt(task.note) : null,
      dueDate: task.dueDate,
      startingTime: task.startingTime,
      endingTime: task.endingTime,
      duration: task.duration,
      priority: task.priority,
    },
  });
};

const editTask = async (req, res) => {
  let { title, note, dueDate, startingTime, endingTime, priority } = req.body;
  const taskId = req.params.taskId;

  const user = req.user;

  let startTime = new Date();
  let endTime = new Date();
  let [hours, minutes] = startingTime.split(":");
  let [endHours, endMinutes] = endingTime.split(":");

  startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  endTime.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);

  const durationInMinutes = (endTime - startTime) / (1000 * 60);
  const dueDateObj = new Date(dueDate);
  const hashTitle = encrypt(title);
  const hashNote = note ? encrypt(note) : null;
  priority = priority || "low";

  const task = await Task.findOneAndUpdate(
    { _id: taskId, userId: user._id },
    {
      task: hashTitle,
      note: hashNote,
      dueDate: dueDateObj,
      startingTime: startTime,
      endingTime: endTime,
      duration: durationInMinutes,
      priority: priority,
    },
    { new: true },
  );

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  res.status(201).json({
    message: "Task updated successfully",
    task: {
      id: task._id,
      title: decrypt(task.task),
      note: task.note ? decrypt(task.note) : null,
      dueDate: task.dueDate,
      startingTime: task.startingTime,
      endingTime: task.endingTime,
      duration: task.duration,
      priority: task.priority,
    },
  });
};

const deleteTask = async (req, res) => {
  const taskId = req.params.taskId;
  const user = req.user;

  const task = await Task.findOneAndDelete({ _id: taskId, userId: user._id });

  if (!task) {
    res.status(400).json({
      success: false,
      message: "Task not found",
    });
  }

  res.status(202).json({
    success: true,
    message: "Task deleted successfully",
  });
};

const getTask = async (req, res) => {
  const taskId = req.params.taskId;
  const user = req.user;

  const task = await Task.findOne({
    _id: taskId,
    userId: user._id,
  }).select("-deleteIn -createdAt -updatedAt");

  if (!task) {
    res.status(400).json({
      success: false,
      message: "Task not found",
    });
  }

  task.task = decrypt(task.task);
  task.note = task.note ? decrypt(task.note) : null;

  res.status(200).json({
    success: true,
    task,
  });
};
const getAll = async (req, res) => {
  const user = req.user;
  const skip = req.query.skip || 0;
  const limit = req.query.limit || 15;

  const tasks = await Task.find({ userId: user._id })
    .sort({ dueDate: 1, startingTime: 1 })
    .skip(skip)
    .limit(limit)
    .select("-deleteIn -createdAt -updatedAt");

  const decryptedTasks = tasks.map((task) => {
    return {
      ...task.toObject(),
      task: decrypt(task.task),
      note: task.note ? decrypt(task.note) : null,
    };
  });

  res.status(200).json({
    success: true,
    tasks: decryptedTasks,
  });
};

const toggleTask = async (req, res) => {
  const taskId = req.params.taskId;
  const user = req.user;

  const task = await Task.findOne({ _id: taskId, userId: user._id }).select(
    "-deleteIn -createdAt -updatedAt",
  );

  if (!task) {
    res.status(400).json({
      success: false,
      message: "Task not found",
    });
  }

  task.status = !task.status;
  await task.save();

  const updatedTask = task.toObject();

  updatedTask.task = decrypt(task.task);
  updatedTask.note = task.note ? decrypt(task.note) : null;

  res.status(200).json({
    success: true,
    task: updatedTask,
    message: `Task marked as ${updatedTask.status ? "completed" : "incomplete"}`,
  });
};

export default {
  addTask,
  deleteTask,
  editTask,
  getAll,
  getTask,
  toggleTask,
};
