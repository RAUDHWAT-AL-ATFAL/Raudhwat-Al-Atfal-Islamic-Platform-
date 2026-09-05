const express = require("express");

const {
    getAllQuranSurahs,
    getQuranSurah,
    getSurahVerses,
    getSingleAyah,
    getFullSurah,
    getQuranAudioMode,
    getQuranReciters,
    getQuranResources
} = require("../controllers/quranController");

const router = express.Router();

// ==========================================
// GET ALL SURAHS
// GET /api/quran
// ==========================================

router.get(
    "/",
    getAllQuranSurahs
);

// ==========================================
// GET QUR'AN RESOURCES
// GET /api/quran/resources
// ==========================================

router.get(
    "/resources",
    getQuranResources
);

// ==========================================
// GET ONE AYAH
// GET /api/quran/ayah/1:1
// ==========================================

router.get(
    "/ayah/:verseKey",
    getSingleAyah
);

// ==========================================
// GET FULL SURAH
// GET /api/quran/full/1
// ==========================================

router.get(
    "/full/:chapterNumber",
    getFullSurah
);

// ==========================================
// 🎧 QUR'AN AUDIO MODE
// GET /api/quran/audio/1
// ==========================================

router.get(
    "/audio/:chapterNumber",
    getQuranAudioMode
);

// ==========================================
// GET SURAH VERSES
// GET /api/quran/1/verses
// ==========================================
router.get("/reciters", getQuranReciters);
router.get(
    "/:chapterNumber/verses",
    getSurahVerses
);

// ==========================================
// GET ONE SURAH
// GET /api/quran/1
// ==========================================

router.get(
    "/:chapterNumber",
    getQuranSurah
);

module.exports = router;