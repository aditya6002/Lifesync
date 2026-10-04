import Journal from "../models/features/journal.model.js";
import { encrypt, decrypt } from "../helper/hashing.helper.js";

const addJournal = async (req, res) => {
  const { title, content } = req.body;
  const user = req.user;

  const hashTitle = encrypt(title);
  const hashContent = encrypt(content);

  const newJournal = await Journal.create({
    title: hashTitle,
    content: hashContent,
    userId: user._id,
  });

  res.status(201).json({
    message: "Journal entry created successfully",
    success: true,
    journal: newJournal,
  });
};

const getJournal = async (req, res) => {
  const journalId = req.params.journalId;
  const user = req.user;

  const journal = await Journal.findOne({
    _id: journalId,
    userId: user._id,
  }).select("-userId -deleteIn");

  if (!journal) {
    return res.status(404).json({
      success: false,
      message: "Journal entry not found",
    });
  }

  journal.title = decrypt(journal.title);
  journal.content = decrypt(journal.content);

  res.status(200).json({
    success: true,
    journal: journal,
    message: "Journal entry retrieved successfully",
  });
};

const editJournal = async (req, res) => {
  const { title, content } = req.body;
  const journalId = req.params.journalId;
  const user = req.user;

  const journal = await Journal.findOne({ _id: journalId, userId: user._id });

  if (!journal) {
    return res.status(404).json({
      success: false,
      message: "Journal entry not found",
    });
  }

  const hashTitle = encrypt(title);
  const hashContent = encrypt(content);

  journal.title = hashTitle;
  journal.content = hashContent;

  await journal.save();

  res.status(200).json({
    success: true,
    message: "Journal entry updated successfully",
    journal: journal,
  });
};

const deleteJournal = async (req, res) => {
  const journalId = req.params.journalId;
  const user = req.user;

  const journal = await Journal.findOneAndDelete({
    _id: journalId,
    userId: user._id,
  });

  if (!journal) {
    return res.status(404).json({
      success: false,
      message: "Journal entry not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Journal entry deleted successfully",
  });
};
const getAll = async (req, res) => {
  const user = req.user;
  const skip = req.query.skip || 0;
  const limit = req.query.limit || 15;

  const journals = await Journal.find({ userId: user._id })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    journals: journals,
    message: "Journals retrieved successfully",
  });
};

export default {
  addJournal,
  getJournal,
  editJournal,
  deleteJournal,
  getAll,
};
