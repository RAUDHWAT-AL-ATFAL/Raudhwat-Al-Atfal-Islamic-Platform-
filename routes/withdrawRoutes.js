const express = require("express");
const router = express.Router();
const WithdrawRequest = require("../models/WithdrawRequest");
const Payment = require("./models/Payment");
const Mradi = require("../models/Mradi");

// Note: Hakikisha umemocha updateAndBroadcastMradi au import kutoka server/helper
// Hatua ya 1: KATIBU ANAANZISHA OMBI (Initiate)
router.post("/initiate", async (req, res) => {
    try {
        const { mradi_id, amount, reason, user_id } = req.body;
        const refId = `REQ-${Date.now()}`;

        const request = await WithdrawRequest.create({
            reference_id: refId,
            mradi_id,
            amount: parseFloat(amount),
            reason,
            initiated_by: user_id,
            status: "INITIATED"
        });

        res.status(201).json({
            success: true,
            message: "Ombi limeanzishwa na Katibu. Lanasubiri Uhakiki wa Mwekahazina.",
            data: request
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Hatua ya 2: MWEKAHAZINA ANAHAKIKISHA (Verify)
router.post("/verify", async (req, res) => {
    try {
        const { request_id, user_id, status, rejection_reason } = req.body; // status: 'VERIFIED' au 'REJECTED'

        const request = await WithdrawRequest.findById(request_id);
        if (!request || request.status !== "INITIATED") {
            return res.status(400).json({ success: false, message: "Ombi halijapatikana au lishapita hatua hii." });
        }

        if (status === "REJECTED") {
            request.status = "REJECTED";
            request.rejection_reason = rejection_reason || "LIMEKATALIWA NA MWEKAHAZINA";
            await request.save();
            return res.json({ success: true, message: "Ombi limekataliwa na Mwekahazina." });
        }

        // Badilisha Status kuwa VERIFIED
        request.status = "VERIFIED";
        request.verified_by = user_id;
        await request.save();

        res.json({
            success: true,
            message: "Mwekahazina amethibitisha salio/bajeti. Ombi linasubiri Idhini ya Mwenyekiti.",
            data: request
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Hatua ya 3: MWENYEKITI ANAIDHINISHA (Final Approve & Process Expense)
router.post("/approve", async (req, res) => {
    try {
        const { request_id, user_id, status, rejection_reason } = req.body; // status: 'APPROVED' au 'REJECTED'

        const request = await WithdrawRequest.findById(request_id);
        if (!request || request.status !== "VERIFIED") {
            return res.status(400).json({ success: false, message: "Ombi hili halijathibitishwa na Mwekahazina au lishakamilika." });
        }

        if (status === "REJECTED") {
            request.status = "REJECTED";
            request.rejection_reason = rejection_reason || "LIMEKATALIWA NA MWENYEKITI";
            await request.save();
            return res.json({ success: true, message: "Ombi limekataliwa na Mwenyekiti." });
        }

        // 1. Badilisha status kuwa APPROVED
        request.status = "APPROVED";
        request.approved_by = user_id;
        await request.save();

        // 2. Ingiza Muamala kwenye Payment Schema kama EXPENSE
        const expensePayment = await Payment.create({
            reference_id: `EXP-${Date.now()}`,
            mradi_id: request.mradi_id,
            amount: request.amount,
            phone: "DISBANK_OUT",
            type: "EXPENSE",
            status: "SUCCESS",
            provider: "AZAMPAY_DISBANK"
        });

        // 3. Hapa unaweza kupiga updateAndBroadcastMradi(request.mradi_id) ili kushusha Progress Bar LIVE!

        res.json({
            success: true,
            message: "Mwenyekiti ameidhinisha! Pesa imekatwa kwenye mradi na Progress Bar imepungua.",
            payment: expensePayment
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET: Orodha ya Maombi kulingana na Kiongozi anayeingia
router.get("/list/:role", async (req, res) => {
    try {
        const { role } = req.params;
        let filter = {};

        if (role === "MWEKAHAZINA") {
            filter = { status: "INITIATED" }; // Mwekahazina anaona tu yale yaliyoanzishwa na Katibu
        } else if (role === "MWENYEKITI") {
            filter = { status: "VERIFIED" }; // Mwenyekiti anaona tu yaliyothibitishwa na Mwekahazina
        }

        const requests = await WithdrawRequest.find(filter)
            .populate("mradi_id", "name code")
            .populate("initiated_by", "name email")
            .populate("verified_by", "name email");

        res.json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;