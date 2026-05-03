const Url = require("../models/urlModel");
const { nanoid } = require("nanoid");
const validUrl = require("valid-url");

// =========================================
// CREATE SHORT URL
// =========================================
exports.createShortUrl = async (req, res) => {
  try {
    let { originalUrl } = req.body;

    // 1. Check input
    if (!originalUrl) {
      return res.status(400).json({ error: "URL is required" });
    }

    // 2. Normalize URL (add https if missing)
    if (
      !originalUrl.startsWith("http://") &&
      !originalUrl.startsWith("https://")
    ) {
      originalUrl = "https://" + originalUrl;
    }

    // 3. Validate URL
    if (!validUrl.isUri(originalUrl)) {
      return res.status(400).json({ error: "Invalid URL" });
    }

    // 4. Check duplicate URL
    const existing = await Url.findOne({ originalUrl });

    if (existing) {
      return res.json({
        originalUrl: existing.originalUrl,
        shortId: existing.shortId,
        shortUrl: `${process.env.BASE_URL}/${existing.shortId}`,
      });
    }

    // 5. Create shortId
    const shortId = nanoid(7);

    // 6. Save to DB
    const url = await Url.create({
      originalUrl,
      shortId,
      clicks: 0,
    });

    // 7. Response
    return res.json({
      originalUrl: url.originalUrl,
      shortId: url.shortId,
      shortUrl: `${process.env.BASE_URL}/${url.shortId}`,
    });
  } catch (err) {
    console.log("CREATE ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
};

// =========================================
// REDIRECT SHORT URL → ORIGINAL URL
// =========================================
exports.redirectUrl = async (req, res) => {
  try {
    const { shortId } = req.params;

    const url = await Url.findOne({ shortId });

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    // increment clicks
    url.clicks = (url.clicks || 0) + 1;
    await url.save();

    return res.redirect(url.originalUrl);
  } catch (err) {
    console.log("REDIRECT ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
};

// =========================================
// GET URL STATS
// =========================================
exports.getUrlStats = async (req, res) => {
  try {
    const { shortId } = req.params;

    const url = await Url.findOne({ shortId });

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    return res.json({
      originalUrl: url.originalUrl,
      shortId: url.shortId,
      clicks: url.clicks || 0,
      createdAt: url.createdAt,
    });
  } catch (err) {
    console.log("STATS ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
};