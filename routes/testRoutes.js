const express = require("express");
const authorize = require("../middleware/roleMiddleware");
const protect = require("../middleware/authMiddleware");
const {
    createTest,
    getTests
} = require("../controllers/testController");

const router = express.Router();
router.get("/", protect, (req, res) => {
    res.json({
        success: true,
        message: "Protected route accessed successfully 🔐",
        user: req.user
    });
});
 //Admin-only route
router.get("/admin", protect, authorize("admin"), (req, res) => {
    res.json({
        success: true,
        message: "Welcome Admin 👑",
        user: req.user
    });
});
// POST - Save data
router.post("/", createTest);

// GET - Get all data
router.get("/", getTests);

module.exports = router;