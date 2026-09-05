const DailyContent = require("../models/dailyContentModel");

const {
getTodayDateKey,
getTodayIslamicContent,
saveAdminContent,
deleteDailyContent
} = require("../services/islamicContentService");

// ==========================================
// GET TODAY'S ISLAMIC CONTENT
// ==========================================

const getTodayContent = async (req, res) => {
try {

    const content =
        await getTodayIslamicContent();

    res.status(200).json({
        success: true,
        data: content
    });

} catch (error) {

    console.error(
        "Get Today Content Error:",
        error
    );

    res.status(500).json({
        success: false,
        message:
            "Imeshindikana kupata content ya leo"
    });

}

};

// ==========================================
// CREATE / OVERRIDE ADMIN CONTENT
// ==========================================

const createAdminContent = async (req, res) => {
try {

    const {
        dateKey,
        islamicDate,
        gregorianDate,
        quranVerse,
        hadith,
        dua,
        allahName
    } = req.body;

    // ==================================
    // BASIC VALIDATION
    // ==================================

    if (
        !islamicDate ||
        !gregorianDate
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Tafadhali jaza Islamic Date na Gregorian Date"
        });
    }

    // ==================================
    // SAVE ADMIN CONTENT
    // ==================================

    const content =
        await saveAdminContent(
            {
                dateKey:
                    dateKey ||
                    getTodayDateKey(),

                islamicDate,

                gregorianDate,

                quranVerse:
                    quranVerse || {},

                hadith:
                    hadith || {},

                dua:
                    dua || {},

                allahName:
                    allahName || {}
            },

            req.user?._id || null
        );

    res.status(201).json({

        success: true,

        message:
            "Daily Islamic content ya Admin imehifadhiwa",

        data:
            content
    });

} catch (error) {

    console.error(
        "Create Admin Content Error:",
        error
    );

    res.status(500).json({
        success: false,
        message: error.message
    });

}

};

// ==========================================
// UPDATE ADMIN CONTENT
// ==========================================

const updateAdminContent = async (req, res) => {
try {

    const {
        islamicDate,
        gregorianDate,
        quranVerse,
        hadith,
        dua,
        allahName
    } = req.body;

    const content =
        await DailyContent.findOne({
            dateKey:
                req.params.dateKey
        });

    if (!content) {
        return res.status(404).json({
            success: false,
            message:
                "Daily content haijapatikana"
        });
    }

    // ==================================
    // UPDATE FIELDS
    // ==================================

    if (islamicDate !== undefined) {
        content.islamicDate =
            islamicDate;
    }

    if (gregorianDate !== undefined) {
        content.gregorianDate =
            gregorianDate;
    }

    if (quranVerse !== undefined) {
        content.quranVerse =
            quranVerse;
    }

    if (hadith !== undefined) {
        content.hadith =
            hadith;
    }

    if (dua !== undefined) {
        content.dua =
            dua;
    }

    if (allahName !== undefined) {
        content.allahName =
            allahName;
    }

    // Force Admin mode
    content.contentSource =
        "admin";

    content.isActive =
        true;

    await content.save();

    res.status(200).json({

        success: true,

        message:
            "Daily Islamic content imebadilishwa",

        data:
            content
    });

} catch (error) {

    console.error(
        "Update Admin Content Error:",
        error
    );

    res.status(500).json({
        success: false,
        message: error.message
    });

}

};

// ==========================================
// REMOVE ADMIN OVERRIDE
// ==========================================

const removeAdminContent = async (req, res) => {
try {

    const dateKey =
        req.params.dateKey;

    const content =
        await DailyContent.findOne({
            dateKey
        });

    if (!content) {
        return res.status(404).json({
            success: false,
            message:
                "Daily content haijapatikana"
        });
    }

    /*
        Instead of deleting permanently,
        we deactivate the admin content.

        Automatic content can therefore
        be generated/fetched again.
    */

    content.isActive =
        false;

    content.contentSource =
        "automatic";

    await content.save();

    res.status(200).json({

        success: true,

        message:
            "Admin override imeondolewa. Automatic content itatumika.",

        data:
            content
    });

} catch (error) {

    console.error(
        "Remove Admin Content Error:",
        error
    );

    res.status(500).json({
        success: false,
        message: error.message
    });

}

};

// ==========================================
// GET CONTENT BY DATE
// ==========================================

const getContentByDate = async (req, res) => {
try {

    const content =
        await DailyContent.findOne({
            dateKey:
                req.params.dateKey,
            isActive:
                true
        });

    if (!content) {
        return res.status(404).json({
            success: false,
            message:
                "Daily content ya tarehe hiyo haijapatikana"
        });
    }

    res.status(200).json({

        success: true,

        data:
            content
    });

} catch (error) {

    res.status(500).json({
        success: false,
        message: error.message
    });

}

};

// ==========================================
// EXPORT
// ==========================================

module.exports = {

getTodayContent,

createAdminContent,

updateAdminContent,

removeAdminContent,

getContentByDate

};