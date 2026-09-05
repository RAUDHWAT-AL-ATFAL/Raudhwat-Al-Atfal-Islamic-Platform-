const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
{
// ==========================================
// PROJECT
// ==========================================

    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mradi",
        required: true
    },


    // ==========================================
    // DONOR
    // ==========================================

    donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donor",
        required: true
    },

    donorName: {
        type: String,
        required: true,
        trim: true
    },

    phoneNumber: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        default: "",
        trim: true,
        lowercase: true
    },


    // ==========================================
    // DONATION AMOUNT
    // ==========================================

    amount: {
        type: Number,
        required: true,
        min: 1000
    },


    // ==========================================
    // PAYMENT METHOD
    // ==========================================

    paymentMethod: {
        type: String,
        enum: [
            "AzaPay",
            "M-Koba",
            "Lipa Namba",
            "Bank",
            "Mobile Money",
            "Other"
        ],
        required: true
    },


    // ==========================================
    // PAYMENT STATUS
    // ==========================================

    paymentStatus: {
        type: String,
        enum: [
            "pending",
            "confirmed",
            "failed",
            "cancelled"
        ],
        default: "pending"
    },


    // ==========================================
    // TRANSACTION
    // ==========================================

    transactionReference: {
        type: String,
        default: "",
        trim: true
    },


    // ==========================================
    // RECEIPT
    // ==========================================

    receiptNumber: {
        type: String,
        default: "",
        unique: true,
        sparse: true
    },

    receiptUrl: {
        type: String,
        default: ""
    },


    // ==========================================
    // SMS NOTIFICATION
    // ==========================================

    smsSent: {
        type: Boolean,
        default: false
    },

    smsSentAt: {
        type: Date,
        default: null
    },


    // ==========================================
    // EMAIL NOTIFICATION
    // ==========================================

    emailSent: {
        type: Boolean,
        default: false
    },

    emailSentAt: {
        type: Date,
        default: null
    },


    // ==========================================
    // PAYMENT CONFIRMATION
    // ==========================================

    confirmedAt: {
        type: Date,
        default: null
    }
},


// ==========================================
// TIMESTAMPS
// ==========================================

{
    timestamps: true
}

);

// ==========================================
// CREATE DONATION MODEL
// ==========================================

const Donation =
mongoose.model(
"Donation",
donationSchema
);

module.exports = Donation;