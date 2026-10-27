const mongoose = require("mongoose");

const MchangoSchema = new mongoose.Schema(
    {
        mradi: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Mradi",
            required: true
        },

        jinaLaMchangiaji: {
            type: String,
            required: true,
            trim: true
        },

        nambaYaSimu: {
            type: String,
            required: true,
            trim: true
        },

        kiasi: {
            type: Number,
            required: true,
            min: 1000
        },

        njiaYaMalipo: {
            type: String,
            enum: [
                "AzaPay",
                "M-Koba",
                "Lipa Namba",
                "Simu",
                "Benki",
                "Nyingine"
            ],
            required: true
        },

        haliYaMalipo: {
            type: String,
            enum: [
                "inasubiri",
                "imethibitishwa",
                "imekataliwa",
                "imeshindwa"
            ],
            default: "inasubiri"
        },

        nambaYaMuamala: {
            type: String,
            default: "",
            trim: true
        },

        ujumbeWaMchangiaji: {
            type: String,
            default: "",
            trim: true
        },

        risiti: {
            type: String,
            default: ""
        },

        smsImetumwa: {
            type: Boolean,
            default: false
        }
    },

    {
        timestamps: true
    }
);

const Mchango = mongoose.model("Mchango", MchangoSchema);

module.exports = Mchango;