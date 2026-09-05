const express = require("express");

const {
createDonor,
getAllDonors,
getDonorById,
updateDonor,
deactivateDonor,
getDonorDashboard
} = require("../controllers/donorController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// ==========================================
// CREATE DONOR — Public
// ==========================================

router.post(
"/",
createDonor
);

// ==========================================
// GET ALL DONORS — Admin Only
// ==========================================

router.get(
"/",
protect,
authorize("admin"),
getAllDonors
);

// ==========================================
// GET DONOR DASHBOARD
// ==========================================
// Donor anaweza kuona:
// Profile
// Total Donated
// Confirmed Donations
// Pending Donations
// Projects Supported
// Donation History
// Projects + Progress

router.get(
"/:id/dashboard",
protect,
getDonorDashboard
);

// ==========================================
// GET DONOR PROFILE
// ==========================================

router.get(
"/:id",
protect,
getDonorById
);

// ==========================================
// UPDATE DONOR — Admin Only
// ==========================================

router.put(
"/:id",
protect,
authorize("admin"),
updateDonor
);

// ==========================================
// DEACTIVATE DONOR — Admin Only
// ==========================================

router.delete(
"/:id",
protect,
authorize("admin"),
deactivateDonor
);

module.exports = router;