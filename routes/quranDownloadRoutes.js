const express = require("express");

const {
downloadSurah,
getOfflineSurahData,
getOfflineSurahList,
removeOfflineSurah
} = require("../controllers/quranDownloadController");
const router = express.Router();
// ==========================================
// 📥 DOWNLOAD SURAH
// ==========================================
router.post(
"/:chapterNumber/download",
downloadSurah
);
// ==========================================
// 📱 GET ALL OFFLINE SURAHS
// ==========================================
router.get(
"/offline",
getOfflineSurahList
);
// ==========================================
// 📖 GET ONE OFFLINE SURAH
// ==========================================
router.get(
"/offline/:chapterNumber",
getOfflineSurahData
);
// ==========================================
// 🗑️ DELETE OFFLINE SURAH
// ==========================================

router.delete(
"/offline/:chapterNumber",
removeOfflineSurah
);

module.exports = router;