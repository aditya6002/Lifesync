// src/routes/activity.js
const express = require("express");
const router = express.Router();
const { isUserLogin } = require("../middleware/auth.middleware");

const {
  getHeatmap,
  getRecentActivity,
  getDailyScore,
} = require("../controllers/activityController.controller");

// GET /api/activity/heatmap?days=70
router.get("/heatmap", isUserLogin, getHeatmap);

// GET /api/activity/recent?limit=10
router.get("/recent", isUserLogin, getRecentActivity);

// GET /api/activity/score?date=2026-03-11
router.get("/score", isUserLogin, getDailyScore);

module.exports = router;
