const mongoose = require("mongoose");

const quranSurahSchema = new mongoose.Schema(
{

    // ==========================================
    // QURAN FOUNDATION CHAPTER ID
    // ==========================================

    chapterNumber: {
        type: Number,
        required: true,
        unique: true,
        min: 1,
        max: 114
    },


    // ==========================================
    // SURAH NAMES
    // ==========================================

    arabicName: {
        type: String,
        default: ""
    },

    transliteratedName: {
        type: String,
        default: ""
    },

    swahiliName: {
        type: String,
        default: ""
    },


    // ==========================================
    // SURAH INFORMATION
    // ==========================================

    revelationPlace: {
        type: String,
        enum: [
            "Makkah",
            "Madinah",
            "Unknown"
        ],
        default: "Unknown"
    },

    numberOfAyahs: {
        type: Number,
        default: 0
    },


    // ==========================================
    // SURAH INTRODUCTION
    // ==========================================

    surahIntroduction: {
        type: String,
        default: "",
        trim: true
    },

    surahIntroductionAudioUrl: {
        type: String,
        default: "",
        trim: true
    },


    // ==========================================
    // CONTENT SOURCE
    // ==========================================

    contentSource: {
        type: String,
        default: "Quran Foundation"
    },


    // ==========================================
    // ADMIN OVERRIDE
    // ==========================================

    adminIntroduction: {
        type: String,
        default: "",
        trim: true
    },

    adminIntroductionAudioUrl: {
        type: String,
        default: "",
        trim: true
    },

    useAdminIntroduction: {
        type: Boolean,
        default: false
    },


    // ==========================================
    // STATUS
    // ==========================================

    isActive: {
        type: Boolean,
        default: true
    }

},

{
    timestamps: true
}

);

// ==========================================
// MODEL
// ==========================================

const QuranSurah =
mongoose.model(
"QuranSurah",
quranSurahSchema
);

module.exports = QuranSurah;