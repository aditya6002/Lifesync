const Journal = require("../models/journal.model");
const { AppError } = require("../middleware/errors.middleware");

// Get all journals
const getData = async (req, res) => {
  const { month, year } = req.params;
  const journal = await Journal.find({ userId: req.user.id }).sort({
    createdAt: -1,
  });

  res.status(200).json({ success: true, journal });
};

// Create new journal
const newJouranl = async (req, res) => {
  const { title, content, createdAt = new Date() } = req.body;

  if (!title || !title.trim() || !content || !content.trim()) {
    throw new AppError("All field required", 400);
  }

  const journal = await Journal.create({
    title,
    content,
    createdAt,
    userId: req.user.id,
  });

  res
    .status(201)
    .json({ success: true, message: "New journal created", journal });
};

// Edit journal
const editJournal = async (req, res) => {
  const journal = req.body.journal;

  if (!journal) {
    throw new AppError("Journal is required");
  }

  const editJournal = await Journal.findByIdAndUpdate(
    { _id: journal._id },
    { title: journal.title, content: journal.content },
    { new: true },
  );

  if (!editJournal) {
    throw new AppError("Journal not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Journal updated",
    editJournal,
  });
};

// Delete journal
const deleteJournal = async (req, res) => {
  const { journalId } = req.params;
  const deleteJournal = await Journal.findByIdAndDelete(journalId);
  if (!deleteJournal) {
    throw new AppError("Journal not found", 404);
  }

  res
    .status(200)
    .json({ success: true, message: "Journal Deleted successfully" });
};

module.exports = { newJouranl, getData, editJournal, deleteJournal };
