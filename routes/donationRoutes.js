const express = require("express");

const {
    createDonation,
    getAllDonations,
    getDonationById,
    getDonorDonationHistory,
    getDonorDonationSummary,
    confirmDonation
} = require("../controllers/donationController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// ==========================================
// CREATE DONATION — PUBLIC
// ==========================================

router.post(
"/",
createDonation
);

// ==========================================
// GET ALL DONATIONS — ADMIN ONLY
// ==========================================

router.get(
"/",
protect,
authorize("admin"),
getAllDonations
);

// ==========================================
// GET DONOR DONATION HISTORY
// ==========================================

router.get(
"/donor/:donorId",
protect,
getDonorDonationHistory
);
// ==========================================
// GET DONOR DONATION SUMMARY
// ==========================================

router.get(
    "/donor/:donorId/summary",
    protect,
    getDonorDonationSummary
);

// ==========================================
// GET DONATION BY ID — ADMIN ONLY
// ==========================================

router.get(
"/:id",
protect,
authorize("admin"),
getDonationById
);

// ==========================================
// MANUAL CONFIRMATION — ADMIN ONLY
// ==========================================
// Hii itakuwa fallback.
// Main confirmation baadaye itafanyika automatically
// kupitia payment webhook.

router.patch(
"/:id/confirm",
protect,
authorize("admin"),
confirmDonation
);

module.exports = router;