const express = require("express");
const router = express.Router();
const {
  createShortUrl,
  redirectUrl,
  getUrlStats,
} = require("../controllers/urlController");

// =========================================
// SHORT URL CREATE
// =========================================
router.route("/shorten").post(createShortUrl);

// =========================================
// REDIRECT SHORT URL
// =========================================
router.route("/:shortId").get(redirectUrl);

// =========================================
// URL STATS (ANALYTICS)
// =========================================
router.route("/stats/:shortId").get(getUrlStats);

module.exports = router;