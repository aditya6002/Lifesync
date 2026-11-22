import Journal from "../models/features/journal.model.js";
import { encrypt, decrypt } from "../helper/hashing.helper.js";

const addJournal = async (req, res) => {
  const { title, content, tags, mood } = req.body;
  const user = req.user;

  const hashTitle = encrypt(title, user._id);
  const hashContent = encrypt(content, user._id);

  const newJournal = await Journal.create({
    title: hashTitle,
    content: hashContent,
    tags: "#trytofigureout",
    mood: "calm",
    userId: user._id,
  });

  newJournal.title = title;
  newJournal.content = content;

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

  try {
    journal.title = decrypt(journal.title, user._id);
    journal.content = decrypt(journal.content, user._id);
  } catch (e) {
    // Keep raw if not encrypted
  }

  res.status(200).json({
    success: true,
    journal: journal,
    message: "Journal entry retrieved successfully",
  });
};

const getLastJournal = async (req, res) => {
  const user = req.user;

  let journal = await Journal.findOne({ userId: user._id })
    .sort({ createdAt: -1 })
    .select("-userId -deleteIn");

  if (!journal) {
    return res.status(200).json({
      success: true,
      journal: null,
      message: "No journal entry found",
    });
  }

  const doc = journal.toObject();
  try {
    doc.title = decrypt(doc.title);
    doc.content = decrypt(doc.content);
  } catch (e) {
    // Keep as-is if unencrypted
  }

  const wordCount = doc.content ? doc.content.trim().split(/\s+/).length : 0;
  const formattedDate = doc.createdAt
    ? new Date(doc.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      })
    : "Today";

  res.status(200).json({
    success: true,
    journal: {
      ...doc,
      id: doc._id.toString(),
      date: formattedDate,
      tag: "Reflection",
      mood: "Calm 🌿",
      wordCount,
    },
    message: "Last journal retrieved successfully",
  });
};

const editJournal = async (req, res) => {
  const { title, content, tags, mood } = req.body;
  const journalId = req.params.journalId;
  const user = req.user;

  const journal = await Journal.findOne({ _id: journalId, userId: user._id });

  if (!journal) {
    return res.status(404).json({
      success: false,
      message: "Journal entry not found",
    });
  }

  const hashTitle = encrypt(title, user._id);
  const hashContent = encrypt(content, user._id);

  journal.title = hashTitle;
  journal.content = hashContent;
  journal.tags = "#trytofigureout";
  journal.mood = mood || "calm";

  await journal.save();

  journal.title = title;
  journal.content = content;

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
  const skip = Number(req.query.skip) || 0;
  const limit = Number(req.query.limit) || 15;

  const journals = await Journal.find({ userId: user._id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const decryptedJournals = journals.map((j) => {
    const doc = j.toObject();
    try {
      doc.title = decrypt(doc.title, user._id);
      doc.content = decrypt(doc.content, user._id);
    } catch (e) {
      // Keep as-is
    }
    return {
      ...doc,
      id: doc._id.toString(),
    };
  });

  res.status(200).json({
    success: true,
    journals: decryptedJournals,
    message: "Journals retrieved successfully",
  });
};

export default {
  addJournal,
  getJournal,
  getLastJournal,
  editJournal,
  deleteJournal,
  getAll,
};
