const express = require("express");

const {

getAllSurahInformation,

getSurahInformation,

updateSurahIntroduction,

resetSurahIntroduction

} = require(
"../controllers/quranSurahController"
);

const protect =
require("../middleware/authMiddleware");

const authorize =
require("../middleware/roleMiddleware");

const router =
express.Router();

// ==========================================
// GET ALL SURAH INFORMATION
// PUBLIC
// ==========================================

router.get(
"/",
getAllSurahInformation
);

// ==========================================
// GET ONE SURAH INFORMATION
// PUBLIC
// ==========================================

router.get(
"/:chapterNumber",
getSurahInformation
);

// ==========================================
// ADMIN UPDATE INTRODUCTION
// ==========================================

router.patch(
"/:chapterNumber/introduction",

protect,

authorize("admin"),

updateSurahIntroduction

);

// ==========================================
// ADMIN RESET TO AUTOMATIC
// ==========================================

router.delete(
"/:chapterNumber/introduction",

protect,

authorize("admin"),

resetSurahIntroduction

);

module.exports = router;