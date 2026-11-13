import Note from "../models/features/note.model.js";
import { encrypt, decrypt } from "../helper/hashing.helper.js";

const addNote = async (req, res) => {
  const { title, content } = req.body;
  const user = req.user;

  const hashTitle = encrypt(title);
  const hashContent = encrypt(content);

  const newNote = await Note.create({
    title: hashTitle,
    content: hashContent,
    userId: user._id,
  });

  res.status(201).json({
    message: "Note entry created successfully",
    success: true,
    note: newNote,
  });
};

const getNote = async (req, res) => {
  const noteId = req.params.noteId;
  const user = req.user;

  const note = await Note.findOne({
    _id: noteId,
    userId: user._id,
  }).select("-userId -deleteIn");

  if (!note) {
    return res.status(404).json({
      success: false,
      message: "Note entry not found",
    });
  }

  note.title = decrypt(note.title);
  note.content = decrypt(note.content);

  res.status(200).json({
    success: true,
    note: note,
    message: "Note entry retrieved successfully",
  });
};

const editNote = async (req, res) => {
  const { title, content } = req.body;
  const noteId = req.params.noteId;
  const user = req.user;

  const note = await note.findOne({ _id: noteId, userId: user._id });

  if (!note) {
    return res.status(404).json({
      success: false,
      message: "Note entry not found",
    });
  }

  const hashTitle = encrypt(title);
  const hashContent = encrypt(content);

  note.title = hashTitle;
  note.content = hashContent;

  await note.save();

  res.status(200).json({
    success: true,
    message: "Note entry updated successfully",
    note: note,
  });
};

const deleteNote = async (req, res) => {
  const noteId = req.params.noteId;
  const user = req.user;

  const note = await Note.findOneAndDelete({
    _id: noteId,
    userId: user._id,
  });

  if (!note) {
    return res.status(404).json({
      success: false,
      message: "Note entry not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Note entry deleted successfully",
  });
};
const getAll = async (req, res) => {
  const user = req.user;
  const skip = req.query.skip || 0;
  const limit = req.query.limit || 15;

  const notes = await Note.find({ userId: user._id }).skip(skip).limit(limit);

  res.status(200).json({
    success: true,
    notes: notes,
    message: "notes retrieved successfully",
  });
};

export default {
  addNote,
  getNote,
  editNote,
  deleteNote,
  getAll,
};
