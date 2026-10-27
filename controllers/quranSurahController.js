const QuranSurah = require("../models/quranSurahModel");
// ==========================================
// GET ALL SURAHS
// ==========================================
const getAllSurahInformation = async (req, res) => {
try {
    const surahs =
        await QuranSurah.find({
            isActive: true
        })
        .sort({
            chapterNumber: 1
        });

    res.status(200).json({

        success: true,

        count:
            surahs.length,

        data:
            surahs

    });

} catch (error) {

    console.error(
        "Get Surah Information Error:",
        error.message
    );

    res.status(500).json({

        success: false,

        message:
            "Imeshindikana kupata taarifa za Surah",

        error:
            error.message

    });

}

};
// ==========================================
// GET ONE SURAH INFORMATION
// ==========================================

const getSurahInformation = async (req, res) => {

try {

    const chapterNumber =
        Number(req.params.chapterNumber);


    if (
        !Number.isInteger(chapterNumber) ||
        chapterNumber < 1 ||
        chapterNumber > 114
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Namba ya Surah lazima iwe kati ya 1 na 114"

        });

    }


    const surah =
        await QuranSurah.findOne({

            chapterNumber,

            isActive: true

        });


    if (!surah) {

        return res.status(404).json({

            success: false,

            message:
                "Taarifa za Surah hazijapatikana"

        });

    }
    
    res.status(200).json({

        success: true,

        data:
            surah

    });

} catch (error) {

    console.error(
        "Get One Surah Information Error:",
        error.message
    );

    res.status(500).json({

        success: false,

        message:
            "Imeshindikana kupata taarifa za Surah",

        error:
            error.message

    });

}

};

// ==========================================
// UPDATE SURAH INTRODUCTION — ADMIN
// ==========================================

const updateSurahIntroduction = async (
req,
res
) => {

try {

    const chapterNumber =
        Number(req.params.chapterNumber);


    if (
        !Number.isInteger(chapterNumber) ||
        chapterNumber < 1 ||
        chapterNumber > 114
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Namba ya Surah sio sahihi"

        });

    }


    const {

        adminIntroduction,

        adminIntroductionAudioUrl,

        useAdminIntroduction

    } = req.body;

    const surah =
        await QuranSurah.findOne({

            chapterNumber

        });


    if (!surah) {

        return res.status(404).json({

            success: false,

            message:
                "Surah haijapatikana"

        });

    }


    // ==================================
    // UPDATE ADMIN CONTENT
    // ==================================

    if (
        adminIntroduction !== undefined
    ) {

        surah.adminIntroduction =
            adminIntroduction;

    }


    if (
        adminIntroductionAudioUrl !==
        undefined
    ) {

        surah.adminIntroductionAudioUrl =
            adminIntroductionAudioUrl;

    }


    if (
        useAdminIntroduction !==
        undefined
    ) {

        surah.useAdminIntroduction =
            useAdminIntroduction;

    }


    await surah.save();


    res.status(200).json({

        success: true,

        message:
            "Maelezo ya Surah yameboreshwa",

        data:
            surah

    });

} catch (error) {

    console.error(
        "Update Surah Introduction Error:",
        error.message
    );

    res.status(500).json({

        success: false,

        message:
            "Imeshindikana kubadilisha maelezo ya Surah",

        error:
            error.message

    });

}

};

// ==========================================
// DELETE / RESET ADMIN INTRODUCTION
// ==========================================

const resetSurahIntroduction = async (
req,
res
) => {

try {

    const chapterNumber =
        Number(req.params.chapterNumber);


    const surah =
        await QuranSurah.findOne({

            chapterNumber

        });


    if (!surah) {

        return res.status(404).json({

            success: false,

            message:
                "Surah haijapatikana"

        });

    }


    // ==================================
    // RETURN TO AUTOMATIC CONTENT
    // ==================================

    surah.adminIntroduction =
        "";

    surah.adminIntroductionAudioUrl =
        "";

    surah.useAdminIntroduction =
        false;


    await surah.save();


    res.status(200).json({

        success: true,

        message:
            "Surah imerudishwa kwenye Automatic Content",

        data:
            surah

    });

} catch (error) {

    console.error(
        "Reset Surah Introduction Error:",
        error.message
    );

    res.status(500).json({

        success: false,

        message:
            "Imeshindikana kurejesha Automatic Content",

        error:
            error.message

    });

}

};

// ==========================================
// EXPORT
// ==========================================

module.exports = {

getAllSurahInformation,

getSurahInformation,

updateSurahIntroduction,

resetSurahIntroduction
};