const Journal = require("../models/journal.model");

// Get all journals
const getData = async (req, res) => {
  const { skip, limit } = req.params;
  const journal = await Journal.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .skip(Number(skip))
    .limit(Number(limit));

  res.status(200).json({ success: true, journal });
};

// Create new journal
const newJouranl = async (req, res) => {
  const { title, content } = req.body;

  const journal = await Journal.create({ title, content, userId: req.user.id });

  res
    .status(201)
    .json({ success: true, message: "New journal created", journal });
};

// Edit journal
const editJournal = async (req, res) => {
  try {
    const journal = req.body.journal;

    const editJournal = await Journal.findByIdAndUpdate(
      { _id: journal._id },
      { title: journal.title, content: journal.content },
    );

    res.status(200).json({
      success: true,
      message: "Journal updated",
      editJournal,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Delete journal
const deleteJournal = async (req, res) => {
  try {
    const { journalId } = req.params;
    await Journal.findByIdAndDelete({ journalId });

    res
      .status(200)
      .json({ success: true, message: "Journal Deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { newJouranl, getData, editJournal, deleteJournal };
