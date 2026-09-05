const express = require("express");

const {
getTodayContent,
createAdminContent,
updateAdminContent,
removeAdminContent,
getContentByDate
} = require("../controllers/dailyContentController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// ==========================================
// GET TODAY'S CONTENT
// ==========================================
// Donor / authenticated user
//
// Returns:
// Islamic Date
// Gregorian Date
// Quran Verse
// Hadith
// Dua
// Allah Name + Meaning

router.get(
"/today",
protect,
getTodayContent
);

// ==========================================
// GET CONTENT BY DATE
// ==========================================
// Authenticated users can view a specific date

router.get(
"/:dateKey",
protect,
getContentByDate
);

// ==========================================
// CREATE ADMIN CONTENT
// ==========================================
// Admin only

router.post(
"/admin",
protect,
authorize("admin"),
createAdminContent
);

// ==========================================
// UPDATE ADMIN CONTENT
// ==========================================
// Admin only

router.put(
"/admin/:dateKey",
protect,
authorize("admin"),
updateAdminContent
);

// ==========================================
// REMOVE ADMIN OVERRIDE
// ==========================================
// Admin only
//
// After removal, automatic content
// can be used again.

router.delete(
"/admin/:dateKey",
protect,
authorize("admin"),
removeAdminContent
);

module.exports = router;