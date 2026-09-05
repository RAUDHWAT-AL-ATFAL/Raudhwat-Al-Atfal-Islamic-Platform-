const express = require("express");

const {
    ongezaMradi,
    pataMiradiYote,
    pataMradiKwaId
} = require("../controllers/mradiController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// Kuongeza mradi — Admin pekee
router.post(
    "/",
    protect,
    authorize("admin"),
    ongezaMradi
);

// Kuona miradi yote — Public
router.get(
    "/",
    pataMiradiYote
);

// Kuona mradi mmoja — Public
router.get(
    "/:id",
    pataMradiKwaId
);

module.exports = router;