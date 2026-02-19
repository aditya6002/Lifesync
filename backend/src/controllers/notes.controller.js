const AppError = require("../middleware/AppError.middleware.js");
const Note = require("../models/Note.model.js");

// Get Notes
const getAllNotes = async (req, res) => {
  const { skip, limit } = req.params;
  if (!skip || skip < 0 || !limit || limit < 0) {
    throw new AppError("Invalid request");
  }
  const notes = await Note.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .skip(Number(skip))
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    message: "data fetched",
    notes,
  });
};

// Create note
const createNote = async (req, res) => {
  const { title, content } = req.body;

  if (!title || !title.trim() || !content || !content.trim()) {
    throw new AppError("Title and content is required", 400);
  }

  const newNote = await Note.create({
    title: title.trim(),
    content: content.trim(),
    userId: req.user.id,
  });

  res.status(201).json({
    success: true,
    message: "Note created",
    newNote,
  });
};

// Edit Note
const editNote = async (req, res) => {
  const { note } = req.body;
  if (!note) {
    throw new AppError("Note is required", 400);
  }

  const editedNote = await Note.findByIdAndUpdate(
    note._id,
    { ...note },
    { new: true },
  );

  if (!editedNote) {
    throw new AppError("Note not found", 404);
  }
  res.status(200).json({
    success: true,
    message: "Note updated successfully",
    editedNote,
  });
};

// Delete Note
const deleteNote = async (req, res) => {
  const deletedNote = await Note.findByIdAndDelete({ _id: req.params.noteId });
  if (!deletedNote) {
    throw new AppError("Note not found", 404);
  }
  res.status(200).json({ success: true, message: "Deleted successfully" });
};

module.exports = {
  getAllNotes,
  createNote,
  editNote,
  deleteNote,
};
