const mongoose = require("mongoose");

const dailyContentSchema = new mongoose.Schema(
{
dateKey: {
type: String,
required: true,
unique: true,
trim: true
},

    islamicDate: {
        type: String,
        required: true,
        trim: true
    },

    gregorianDate: {
        type: String,
        required: true,
        trim: true
    },

    quranVerse: {
        text: {
            type: String,
            default: "",
            trim: true
        },

        reference: {
            type: String,
            default: "",
            trim: true
        },

        translation: {
            type: String,
            default: "",
            trim: true
        }
    },

    hadith: {
        text: {
            type: String,
            default: "",
            trim: true
        },

        source: {
            type: String,
            default: "",
            trim: true
        }
    },

    dua: {
        text: {
            type: String,
            default: "",
            trim: true
        },

        meaning: {
            type: String,
            default: "",
            trim: true
        }
    },

    allahName: {
        name: {
            type: String,
            default: "",
            trim: true
        },

        meaning: {
            type: String,
            default: "",
            trim: true
        }
    },

    contentSource: {
        type: String,
        enum: [
            "automatic",
            "admin"
        ],
        default: "automatic"
    },

    isActive: {
        type: Boolean,
        default: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donor",
        default: null
    }
},

{
    timestamps: true
}

);

const DailyContent = mongoose.model(
"DailyContent",
dailyContentSchema
);

module.exports = DailyContent;