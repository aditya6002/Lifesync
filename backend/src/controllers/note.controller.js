import Note from "../models/features/note.model.js";

const getAllNotes = async (req, res) => {
  const userId = req.user._id;

  let notes = await Note.find({ userId }).sort({ createdAt: -1 });

  // Seed default notes in dev mode if empty
  if (notes.length === 0 && process.env.NODE_ENV === "development") {
    const defaultNotes = [
      {
        title: "LifeSync Vision",
        content:
          "Minimalist personal dashboard blending productivity, financial clarity, and mindful journaling into one seamless routine.",
        tag: "Life",
        userId,
      },
      {
        title: "Atomic Habits Insight",
        content:
          "Every action you take is a vote for the type of person you wish to become. Small positive votes compound quietly.",
        tag: "Reading",
        userId,
      },
      {
        title: "Design Philosophy",
        content:
          "Quiet editorial aesthetics, Marcellus serif typography, subtle pastel accents, and effortless interactions.",
        tag: "Ideas",
        userId,
      },
      {
        title: "Sprint Goals",
        content:
          "Polish responsive layout, finalize dashboard views, verify local storage persistence, and test build.",
        tag: "Work",
        userId,
      },
    ];
    notes = await Note.insertMany(defaultNotes);
  }

  const formattedNotes = notes.map((n) => ({
    id: n._id.toString(),
    _id: n._id,
    title: n.title,
    content: n.content,
    tag: n.tag || "Ideas",
    date: n.createdAt
      ? new Date(n.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      : "Today",
    createdAt: n.createdAt,
  }));

  res.status(200).json({
    success: true,
    notes: formattedNotes,
    message: "Notes retrieved successfully",
  });
};

const createNote = async (req, res) => {
  const userId = req.user._id;
  const { title, content, tag } = req.body;

  if (!title?.trim() && !content?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Note title or content is required",
    });
  }

  const note = await Note.create({
    title: title?.trim() || "Untitled Note",
    content: content?.trim() || "",
    tag: tag || "Ideas",
    userId,
  });

  res.status(201).json({
    success: true,
    note: {
      id: note._id.toString(),
      _id: note._id,
      title: note.title,
      content: note.content,
      tag: note.tag,
      date: "Just now",
      createdAt: note.createdAt,
    },
    message: "Note created successfully",
  });
};

const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const userId = req.user._id;
  const { title, content, tag } = req.body;

  const updateFields = {};
  if (title !== undefined) updateFields.title = title.trim();
  if (content !== undefined) updateFields.content = content.trim();
  if (tag !== undefined) updateFields.tag = tag;

  const updatedNote = await Note.findOneAndUpdate(
    { _id: noteId, userId },
    { $set: updateFields },
    { new: true }
  );

  if (!updatedNote) {
    return res.status(404).json({
      success: false,
      message: "Note not found",
    });
  }

  res.status(200).json({
    success: true,
    note: {
      id: updatedNote._id.toString(),
      _id: updatedNote._id,
      title: updatedNote.title,
      content: updatedNote.content,
      tag: updatedNote.tag,
      date: new Date(updatedNote.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      createdAt: updatedNote.createdAt,
    },
    message: "Note updated successfully",
  });
};

const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const userId = req.user._id;

  const deletedNote = await Note.findOneAndDelete({ _id: noteId, userId });

  if (!deletedNote) {
    return res.status(404).json({
      success: false,
      message: "Note not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Note deleted successfully",
  });
};

export default {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
};
