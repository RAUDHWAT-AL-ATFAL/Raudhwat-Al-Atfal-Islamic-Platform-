const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        reference_id: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        mradi_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Mradi",
            required: true
        },
        student_id: {
            type: String,
            default: "GUEST"
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        phone: {
            type: String,
            required: function() {
                // Inahitajika ikiwa siyo maombi ya mfumo wa idhini
                return this.provider !== "SYSTEM_APPROVAL";
            },
            trim: true,
            default: "N/A"
        },
        reason: {
            type: String,
            trim: true
        },
        type: {
            type: String,
            enum: ["INCOME", "EXPENSE"],
            default: "INCOME"
        },
        status: {
            type: String,
            enum: [
                "PENDING", 
                "INITIATED",               // Ombi limeanzishwa na Katibu
                "VERIFIED",                // Limehakikiwa na Mwekahazina
                "SUCCESS",                 // Limeidhinishwa rasmi na Mwenyekiti (Pesa Imetoka/Imeingia)
                "FAILED", 
                "REJECTED_BY_TREASURER",   // Limekataliwa na Mwekahazina
                "REJECTED_BY_CHAIRMAN"     // Limekataliwa na Mwenyekiti
            ],
            default: "PENDING"
        },
        provider: {
            type: String,
            enum: ["AZAMPAY", "AZAMPAY_DISBANK", "VODACOM_MENU", "SYSTEM_APPROVAL", "OTHER"],
            default: "AZAMPAY"
        },
        // Audit Trail: Marejeo ya Viongozi Walioidhinisha
        initiated_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        verified_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        approved_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true // Inatengeneza createdAt na updatedAt kiotomatiki
    }
);

// Compound Index inayosaidia mfumo kuhesabu Salio kwa Haraka Sana (Optimization)
paymentSchema.index({ mradi_id: 1, status: 1, type: 1 });

module.exports = mongoose.model("Payment", paymentSchema);