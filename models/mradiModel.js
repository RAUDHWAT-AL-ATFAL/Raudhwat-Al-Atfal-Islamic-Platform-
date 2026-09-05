const mongoose = require("mongoose");

const MradiSchema = new mongoose.Schema(
    {
        kichwa: {
            type: String,
            required: true,
            trim: true
        },

        maelezo: {
            type: String,
            required: true,
            trim: true
        },

        hadithi: {
            type: String,
            default: "",
            trim: true
        },

        nukuu: [
            {
                ujumbe: {
                    type: String,
                    trim: true
                },

                chanzo: {
                    type: String,
                    trim: true,
                    default: ""
                }
            }
        ],

        lengoLaMchango: {
            type: Number,
            required: true,
            min: 1
        },

        kiasiKilichopatikana: {
            type: Number,
            default: 0,
            min: 0
        },

        kianzioChaMchango: {
            type: Number,
            default: 10000,
            min: 0
        },

        ujumbeWaMchango: {
            type: String,
            default: "",
            trim: true
        },

        tareheYaKuanza: {
            type: Date,
            required: true
        },

        tareheYaKumalizika: {
            type: Date,
            required: true
        },

        tareheYaTukio: {
            type: Date
        },

        hali: {
            type: String,
            enum: [
                "unaokuja",
                "unaendelea sasa",
                "umekamilika",
                "umeghairiwa",
                "umehifadhiwa"
            ],
            default: "unaendelea sasa"
        },

        picha: {
            type: String,
            default: ""
        },

        mpangilio: {
            type: Number,
            default: 0
        }
    },

    {
        timestamps: true
    }
);

const Mradi = mongoose.model("Mradi", MradiSchema);

module.exports = Mradi;