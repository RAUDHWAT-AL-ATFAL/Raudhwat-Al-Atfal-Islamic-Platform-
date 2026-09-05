const {
saveSurahOffline,
isSurahDownloaded,
getOfflineSurah,
deleteOfflineSurah,
getDownloadedSurahs
} = require("../services/quranOfflineService");

// ==========================================
// 📥 DOWNLOAD SURAH
// ==========================================

const downloadSurah = async (req, res) => {

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


    // Kama tayari ipo Offline
    if (isSurahDownloaded(chapterNumber)) {

        return res.status(200).json({
            success: true,
            message:
                "Surah hii tayari imepakuliwa kwa matumizi ya Offline"
        });

    }


    /*
     * Kwa sasa tunatumia data ya Surah kutoka
     * database yetu.
     *
     * Baadaye hapa tutaunganisha quranService.js
     * ili tupate:
     *
     * Arabic
     * Kiswahili
     * Tafsir
     * Audio
     */

    const QuranSurah =
        require("../models/quranSurahModel");

    const surah =
        await QuranSurah.findOne({
            chapterNumber,
            isActive: true
        });


    if (!surah) {

        return res.status(404).json({
            success: false,
            message:
                "Surah haijapatikana"
        });

    }


    const offlineResult =
        await saveSurahOffline({
            chapterNumber,
            surah,
            verses: surah.verses || [],
            audio: surah.audio || null
        });


    res.status(200).json({

        success: true,

        message:
            "Surah imepakuliwa kwa matumizi ya Offline",

        data: offlineResult

    });


} catch (error) {

    console.error(
        "Download Surah Error:",
        error.message
    );

    res.status(500).json({

        success: false,

        message:
            "Imeshindikana kupakua Surah",

        error:
            error.message

    });

}

};

// ==========================================
// 📱 GET OFFLINE SURAH LIST
// ==========================================

const getOfflineSurahList = async (req, res) => {

try {

    const chapters =
        getDownloadedSurahs();

    res.status(200).json({

        success: true,

        count:
            chapters.length,

        data:
            chapters

    });

} catch (error) {

    res.status(500).json({

        success: false,

        message:
            "Imeshindikana kupata Sura zilizopakuliwa",

        error:
            error.message

    });

}

};

// ==========================================
// 📖 GET ONE OFFLINE SURAH
// ==========================================

const getOfflineSurahData = async (req, res) => {

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


    const surah =
        getOfflineSurah(chapterNumber);


    if (!surah) {

        return res.status(404).json({

            success: false,

            message:
                "Surah hii haipo kwenye Offline storage"

        });

    }


    res.status(200).json({

        success: true,

        data:
            surah

    });


} catch (error) {

    res.status(500).json({

        success: false,

        message:
            "Imeshindikana kupata Surah ya Offline",

        error:
            error.message

    });

}

};

// ==========================================
// 🗑️ DELETE OFFLINE SURAH
// ==========================================

const removeOfflineSurah = async (req, res) => {

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


    const deleted =
        deleteOfflineSurah(
            chapterNumber
        );


    if (!deleted) {

        return res.status(404).json({

            success: false,

            message:
                "Surah hii haipo kwenye Offline storage"

        });

    }


    res.status(200).json({

        success: true,

        message:
            "Surah imeondolewa kwenye Offline storage"

    });


} catch (error) {

    res.status(500).json({

        success: false,

        message:
            "Imeshindikana kuondoa Surah",

        error:
            error.message

    });

}

};

// ==========================================
// EXPORT
// ==========================================

module.exports = {

downloadSurah,
getOfflineSurahData,
getOfflineSurahList,
removeOfflineSurah

};