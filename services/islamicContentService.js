const axios = require("axios");

const ALADHAN_BASE_URL =
    process.env.ALADHAN_BASE_URL ||
    "https://api.aladhan.com/v1";
const DailyContent = require("../models/dailyContentModel");
// ==========================================
// GET TODAY'S DATE KEY
// ==========================================

const getTodayDateKey = () => {

const now = new Date();

return now
    .toISOString()
    .split("T")[0];

};

// ==========================================
// GET GREGORIAN DATE
// ==========================================

const getGregorianDate = () => {

return new Intl.DateTimeFormat(
    "en-GB",
    {
        day: "2-digit",
        month: "long",
        year: "numeric"
    }
).format(new Date());

};

// ==========================================
// GET ISLAMIC DATE
// ==========================================

const fetchIslamicDate = async () => {

try {

    const date =
        new Date();

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const year =
        date.getFullYear();

    const response =
        await axios.get(
            `${ALADHAN_BASE_URL}/gToH/${day}-${month}-${year}`
        );

    const hijri =
        response.data?.data?.hijri;

    if (!hijri) {
        return "";
    }

    return `${hijri.day} ${hijri.month.en} ${hijri.year}`;

} catch (error) {

    console.error(
        "Islamic Date API Error:",
        error.message
    );

    return "";
}

};

// ==========================================
// GET TODAY'S CACHED CONTENT
// ==========================================

const getCachedTodayContent =
async () => {

    const dateKey =
        getTodayDateKey();

    return await DailyContent.findOne({
        dateKey,
        isActive: true
    });
};

// ==========================================
// GET TODAY'S CONTENT
// ==========================================

const getTodayIslamicContent =
async () => {

    const dateKey =
        getTodayDateKey();

    // ==================================
    // CHECK DATABASE FIRST
    // ==================================

    const existingContent =
        await DailyContent.findOne({
            dateKey,
            isActive: true
        });

    if (existingContent) {

        return existingContent;
    }


    // ==================================
    // FETCH ISLAMIC DATE
    // ==================================

    const islamicDate =
        await fetchIslamicDate();


    // ==================================
    // CREATE AUTOMATIC CONTENT
    // ==================================

    const automaticContent = {

        dateKey,

        islamicDate:
            islamicDate ||
            "Islamic date unavailable",

        gregorianDate:
            getGregorianDate(),

        quranVerse: {
            text: "",
            reference: "",
            translation: ""
        },

        hadith: {
            text: "",
            source: ""
        },

        dua: {
            text: "",
            meaning: ""
        },

        allahName: {
            name: "",
            meaning: ""
        },

        contentSource:
            "automatic",

        isActive:
            true
    };


    // ==================================
    // SAVE CACHE
    // ==================================

    return await DailyContent.findOneAndUpdate(

        {
            dateKey
        },

        automaticContent,

        {
            new: true,
            upsert: true,
            runValidators: true
        }
    );
};

// ==========================================
// SAVE ADMIN CONTENT
// ==========================================

const saveAdminContent =
async (
content,
adminId = null
) => {

    const dateKey =
        content.dateKey ||
        getTodayDateKey();

    return await DailyContent.findOneAndUpdate(

        {
            dateKey
        },

        {
            ...content,

            dateKey,

            contentSource:
                "admin",

            createdBy:
                adminId,

            isActive:
                true
        },

        {
            new: true,
            upsert: true,
            runValidators: true
        }
    );
};

// ==========================================
// DELETE / DISABLE CONTENT
// ==========================================

const deleteDailyContent =
async (dateKey) => {

    return await DailyContent.findOneAndUpdate(

        {
            dateKey
        },

        {
            isActive: false
        },

        {
            new: true
        }
    );
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {

getTodayDateKey,

getGregorianDate,

fetchIslamicDate,

getCachedTodayContent,

getTodayIslamicContent,

saveAdminContent,

deleteDailyContent

};