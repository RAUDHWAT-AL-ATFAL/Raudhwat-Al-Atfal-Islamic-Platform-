const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const {
    createAdmin,
    getAllAdmins,
    updateAdmin,
    deactivateAdmin
} = require("../controllers/adminController");

const router = express.Router();

// Add new admin
router.post(
    "/",
    protect,
    authorize("admin"),
    createAdmin
);
// Get all admins
router.get(
    "/",
    protect,
    authorize("admin"),
    getAllAdmins
);
// Update admin
router.put(
    "/:id",
    protect,
    authorize("admin"),
    updateAdmin
);
// Deactivate admin
router.patch(
    "/:id/deactivate",
    protect,
    authorize("admin"),
    deactivateAdmin
);
module.exports = router;