require("dotenv").config();

const mongoose = require("mongoose");

const QuranSurah =
require("../models/quranSurahModel");

const {
getQuranChapters
} = require("../services/quranService");

// ==========================================
// CONNECT MONGODB
// ==========================================

const connectDatabase = async () => {

try {

    await mongoose.connect(
        process.env.MONGO_URI
    );

    console.log(
        "✅ MongoDB connected"
    );

} catch (error) {

    console.error(
        "❌ MongoDB connection failed:",
        error.message
    );

    process.exit(1);

}

};

// ==========================================
// SYNC QURAN SURAHS
// ==========================================

const syncQuranSurahs = async () => {

try {

    console.log(
        "📖 Starting Quran Surah synchronization..."
    );


    // ==================================
    // GET CHAPTERS FROM QURAN FOUNDATION
    // ==================================

    const response =
        await getQuranChapters();


    const chapters =
        response.chapters || [];


    if (!chapters.length) {

        throw new Error(
            "Hakuna Surah zilizopatikana kutoka Quran Foundation API"
        );

    }


    console.log(
        `📚 Surah zilizopatikana: ${chapters.length}`
    );


    // ==================================
    // SAVE / UPDATE EACH SURAH
    // ==================================

    for (
        const chapter of chapters
    ) {

        const chapterNumber =
            chapter.id;


        await QuranSurah.findOneAndUpdate(

            {
                chapterNumber
            },

            {

                chapterNumber,

                arabicName:
                    chapter.name_arabic || "",

                transliteratedName:
                    chapter.name_simple || "",

                swahiliName:
                    "",

                revelationPlace:
                    chapter.revelation_place ||
                    "Unknown",

                numberOfAyahs:
                    chapter.verses_count || 0,

                contentSource:
                    "Quran Foundation",

                isActive:
                    true

            },

            {

                upsert: true,

                new: true,

                setDefaultsOnInsert:
                    true

            }

        );


        console.log(
            `✅ Synced Surah ${chapterNumber}: ${chapter.name_simple}`
        );

    }


    console.log(
        "🎉 Quran Surah synchronization completed successfully!"
    );


} catch (error) {

    console.error(
        "❌ Quran synchronization failed:",
        error.message
    );

}

};

// ==========================================
// RUN
// ==========================================

const run = async () => {

await connectDatabase();

await syncQuranSurahs();

await mongoose.connection.close();

console.log(
    "🔌 MongoDB connection closed"
);

};

run();