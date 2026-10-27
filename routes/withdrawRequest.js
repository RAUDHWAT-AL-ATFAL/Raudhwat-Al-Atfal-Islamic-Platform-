const mongoose = require("mongoose");

const withdrawRequestSchema = new mongoose.Schema(
    {
        reference_id: {
            type: String,
            required: true,
            unique: true
        },
        mradi_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Mradi",
            required: true
        },
        amount: {
            type: Number,
            required: true,
            min: 1
        },
        reason: {
            type: String,
            required: true,
            trim: true
        },
        // Step 1: Katibu anayeanzisha ombi
        initiated_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        // Step 2: Mwekahazina anayethibitisha bajeti/salio
        verified_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        // Step 3: Mwenyekiti anayeidhinisha kutoa pesa
        approved_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        // Ngazi za Mchakato: INITIATED -> VERIFIED -> APPROVED (au REJECTED)
        status: {
            type: String,
            enum: ["INITIATED", "VERIFIED", "APPROVED", "REJECTED"],
            default: "INITIATED"
        },
        rejection_reason: {
            type: String,
            default: ""
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("WithdrawRequest", withdrawRequestSchema);