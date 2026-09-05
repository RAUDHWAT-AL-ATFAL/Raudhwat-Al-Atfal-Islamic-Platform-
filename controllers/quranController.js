// ======================================================
// QUR'AN CONTROLLER
// ======================================================

const quranService =
    require("../services/quranService");

const swahiliQuranService =
    require("../services/swahiliQuranService");


// ======================================================
// GET ALL 114 SURAHS
// GET /api/quran
// ======================================================

const getAllQuranSurahs = async (req, res) => {

    try {

        const data =
            await quranService.getQuranChapters();

        res.status(200).json({

            success: true,

            count:
                data.chapters?.length || 0,

            data:
                data.chapters || []
        });

    } catch (error) {

        console.error(
            "Get All Quran Surahs Error:",
            error.message
        );

        res.status(500).json({

            success: false,

            message:
                "Imeshindikana kupata Surah za Qur'an",

            error:
                error.message
        });
    }
};


// ======================================================
// GET ONE SURAH
// GET /api/quran/:chapterNumber
// ======================================================

const getQuranSurah = async (req, res) => {

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

        const data =
            await quranService.getQuranChapter(
                chapterNumber
            );

        res.status(200).json({

            success: true,

            data
        });

    } catch (error) {

        console.error(
            "Get Quran Surah Error:",
            error.message
        );

        res.status(500).json({

            success: false,

            message:
                "Imeshindikana kupata Surah",

            error:
                error.message
        });
    }
};


// ======================================================
// GET SURAH VERSES
// GET /api/quran/:chapterNumber/verses
// ======================================================

const getSurahVerses = async (req, res) => {

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

        const page =
            Number(req.query.page) || 1;

        const perPage =
            Number(req.query.perPage) || 50;

        const fields =
            req.query.fields ||
            "text_uthmani";

        const translations =
            req.query.translations || "";

        const tafsirs =
            req.query.tafsirs || "";

        if (
            page < 1 ||
            perPage < 1 ||
            perPage > 100
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Page au perPage sio sahihi"
            });
        }

        const data =
            await quranService.getQuranChapterVerses(

                chapterNumber,

                page,

                perPage,

                fields,

                translations,

                tafsirs
            );

        const swahili =
            await swahiliQuranService.getSwahiliSurah(
                chapterNumber
            );

        res.status(200).json({

            success: true,

            chapter:
                chapterNumber,

            page,

            perPage,

            data: {

                quran:
                    data,

                swahili
            }
        });

    } catch (error) {

        console.error(
            "Get Surah Verses Error:",
            error.message
        );

        res.status(500).json({

            success: false,

            message:
                "Imeshindikana kupata Aya za Surah",

            error:
                error.message
        });
    }
};


// ======================================================
// GET ONE AYAH
// GET /api/quran/ayah/:verseKey
// ======================================================

const getSingleAyah = async (req, res) => {

    try {

        const verseKey =
            req.params.verseKey;

        if (
            !verseKey ||
            !/^\d+:\d+$/.test(verseKey)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Verse key lazima iwe mfano 1:1"
            });
        }

        const data =
            await quranService.getQuranVerse(
                verseKey
            );

        res.status(200).json({

            success: true,

            verseKey,

            data
        });

    } catch (error) {

        console.error(
            "Get Single Ayah Error:",
            error.message
        );

        res.status(500).json({

            success: false,

            message:
                "Imeshindikana kupata Aya",

            error:
                error.message
        });
    }
};


// ======================================================
// GET FULL SURAH
// GET /api/quran/full/:chapterNumber
// ======================================================

const getFullSurah = async (req, res) => {

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
                    "Namba ya Sura lazima iwe kati ya 1 na 114"
            });
        }

        const translationId =
            process.env.QF_SW_TRANSLATION_ID;

        const tafsirId =
            process.env.QF_SW_TAFSIR_ID;

        const recitationId =
            process.env.QF_RECITATION_ID;

        const surah =
            await quranService.getQuranChapter(
                chapterNumber
            );

        let page = 1;

        let allVerses = [];

        let hasMore = true;

        while (hasMore) {

            const response =
                await quranService
                    .getVersesWithTranslationAndTafsir(

                        chapterNumber,

                        translationId,

                        tafsirId,

                        page,

                        50
                    );

            const verses =
                response.verses || [];

            allVerses =
                allVerses.concat(verses);

            const totalPages =
                response.pagination?.total_pages;

            if (
                totalPages &&
                page >= totalPages
            ) {

                hasMore = false;

            } else if (
                verses.length < 50
            ) {

                hasMore = false;

            } else {

                page++;
            }

            if (page > 20) {

                hasMore = false;
            }
        }

        let audio = null;

        if (recitationId) {

            try {

                audio =
                    await quranService
                        .getRecitationAudio(

                            recitationId,

                            chapterNumber
                        );

            } catch (audioError) {

                console.error(
                    "Recitation Error:",
                    audioError.message
                );
            }
        }

        res.status(200).json({

            success: true,

            data: {

                surah,

                totalVerses:
                    allVerses.length,

                verses:
                    allVerses,

                audio
            }
        });

    } catch (error) {

        console.error(
            "Full Surah Error:",
            error.response?.data ||
            error.message
        );

        res.status(500).json({

            success: false,

            message:
                "Imeshindikana kupata taarifa kamili za Sura",

            error:
                error.message
        });
    }
};


// ======================================================
// 🎙️ GET CHAPTER RECITERS
//
// GET /api/quran/reciters
//
// Hii inatoa Qari halisi kutoka Quran Foundation.
// ======================================================

const getQuranReciters = async (req, res) => {

    try {

        const data =
            await quranService
                .getChapterReciters();

        res.status(200).json({

            success: true,

            data
        });

    } catch (error) {

        console.error(
            "Get Quran Reciters Error:",
            error.response?.data ||
            error.message
        );

        res.status(500).json({

            success: false,

            message:
                "Imeshindikana kupata orodha ya Ma-Qari",

            error:
                error.message
        });
    }
};


// ======================================================
// 🎧 QUR'AN AUDIO MODE
//
// Arabic
// + Swahili / English
// + Selected Chapter Reciter
// + Full Surah Audio
// + Verse timestamps
// + Word segments
//
// Example:
//
// /api/quran/audio/1?language=sw&reciterId=7
//
// /api/quran/audio/1?language=en&reciterId=7
// ======================================================

const getQuranAudioMode = async (req, res) => {

    try {

        // ==================================================
        // 1. CHAPTER
        // ==================================================

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


        // ==================================================
        // 2. LANGUAGE
        // ==================================================

        const language =
            (req.query.language || "sw")
                .toLowerCase();

        if (
            language !== "sw" &&
            language !== "en"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Language lazima iwe 'sw' au 'en'"
            });
        }


        // ==================================================
        // 3. GET CHAPTER RECITERS
        // ==================================================

        const recitersData =
            await quranService
                .getChapterReciters();

        const chapterReciters =
            recitersData?.chapter_reciters ||
            recitersData?.reciters ||
            recitersData?.data ||
            [];


        // ==================================================
        // 4. SELECT RECITER
        // ==================================================

        const requestedReciterId =
            Number(
                req.query.reciterId || 7
            );

        let selectedReciter =
            chapterReciters.find(

                (reciter) =>
                    Number(
                        reciter.id ||
                        reciter.reciter_id
                    ) === requestedReciterId
            );


        // ==================================================
        // FALLBACK
        // ==================================================

        if (!selectedReciter) {

            selectedReciter =
                chapterReciters[0];
        }


        if (!selectedReciter) {

            return res.status(404).json({

                success: false,

                message:
                    "Hakuna Chapter Reciter aliyepatikana"
            });
        }


        const reciterId =
            Number(
                selectedReciter.id ||
                selectedReciter.reciter_id
            );


        const reciterName =
            selectedReciter.reciter_name ||
            selectedReciter.name ||
            selectedReciter.reciter?.name ||
            "Unknown Reciter";


        // ==================================================
        // 5. GET ARABIC
        // ==================================================

        let page = 1;

        let allArabicVerses = [];

        let hasMore = true;

        while (hasMore) {

            const response =
                await quranService
                    .getQuranChapterVerses(

                        chapterNumber,

                        page,

                        50,

                        "text_uthmani"
                    );

            const verses =
                response.verses || [];

            allArabicVerses =
                allArabicVerses.concat(
                    verses
                );

            const totalPages =
                response.pagination?.total_pages;

            if (
                totalPages &&
                page >= totalPages
            ) {

                hasMore = false;

            } else if (
                verses.length < 50
            ) {

                hasMore = false;

            } else {

                page++;
            }

            if (page > 20) {

                hasMore = false;
            }
        }


        // ==================================================
        // 6. TRANSLATION MAP
        // ==================================================

        let translationMap = {};

        let translatorId = null;


        // ==================================================
        // 🇹🇿 SWAHILI
        // ==================================================

        if (language === "sw") {

            translatorId =
                "swahili_rwwad";

            const swahiliData =
                await swahiliQuranService
                    .getSwahiliSurah(
                        chapterNumber
                    );

            let swahiliVerses = [];

            if (
                Array.isArray(
                    swahiliData?.result
                )
            ) {

                swahiliVerses =
                    swahiliData.result;

            } else if (
                Array.isArray(
                    swahiliData?.result?.verses
                )
            ) {

                swahiliVerses =
                    swahiliData.result.verses;

            } else if (
                Array.isArray(
                    swahiliData?.verses
                )
            ) {

                swahiliVerses =
                    swahiliData.verses;

            } else if (
                Array.isArray(
                    swahiliData?.data
                )
            ) {

                swahiliVerses =
                    swahiliData.data;
            }


            swahiliVerses.forEach(
                (item) => {

                    const ayahNumber =
                        Number(
                            item.aya ||
                            item.verse ||
                            item.verse_number
                        );

                    if (
                        Number.isInteger(
                            ayahNumber
                        )
                    ) {

                        translationMap[
                            ayahNumber
                        ] =
                            item.translation ||
                            item.text ||
                            null;
                    }
                }
            );
        }


        // ==================================================
        // 🇬🇧 ENGLISH
        // ==================================================

        if (language === "en") {

            translatorId =
                process.env.QF_EN_TRANSLATION_ID;

            if (!translatorId) {

                return res.status(500).json({

                    success: false,

                    message:
                        "QF_EN_TRANSLATION_ID haijawekwa kwenye .env"
                });
            }


            page = 1;

            let allEnglishVerses = [];

            hasMore = true;

            while (hasMore) {

                const response =
                    await quranService
                        .getTranslatedVerses(

                            chapterNumber,

                            translatorId,

                            page,

                            50
                        );

                const verses =
                    response.verses || [];

                allEnglishVerses =
                    allEnglishVerses.concat(
                        verses
                    );

                const totalPages =
                    response.pagination?.total_pages;

                if (
                    totalPages &&
                    page >= totalPages
                ) {

                    hasMore = false;

                } else if (
                    verses.length < 50
                ) {

                    hasMore = false;

                } else {

                    page++;
                }

                if (page > 20) {

                    hasMore = false;
                }
            }


            allEnglishVerses.forEach(
                (item) => {

                    const ayahNumber =
                        Number(
                            item.verse_number
                        );

                    if (
                        Number.isInteger(
                            ayahNumber
                        )
                    ) {

                        translationMap[
                            ayahNumber
                        ] =
                            item.translations?.[0]?.text ||
                            null;
                    }
                }
            );
        }


        // ==================================================
        // 7. GET CHAPTER AUDIO
        // ==================================================

        const chapterAudio =
            await quranService
                .getChapterRecitationAudio(

                    reciterId,

                    chapterNumber,

                    true
                );


        const audioFile =
            chapterAudio?.audio_file ||
            null;


        const audioUrl =
            audioFile?.audio_url ||
            null;


        const timestamps =
            audioFile?.timestamps ||
            [];


        // ==================================================
        // 8. TIMESTAMP MAP
        // ==================================================

        const timestampMap = {};

        timestamps.forEach(
            (timestamp) => {

                if (
                    timestamp?.verse_key
                ) {

                    timestampMap[
                        timestamp.verse_key
                    ] = timestamp;
                }
            }
        );

         //
        // ==================================================
       // 9. COMBINE
        // ==================================================
           
        const verses =
            allArabicVerses.map(
                (verse) => {

                    const verseNumber =
                        Number(
                            verse.verse_number
                        );

                    const verseKey =
                        verse.verse_key;

                    const timing =
                        timestampMap[
                            verseKey
                        ] || null;


                    return {

                        verseKey,

                        verseNumber,

                        arabic:
                            verse.text_uthmani ||
                            verse.text_arabic ||
                            null,

                        translation:
                            translationMap[
                                verseNumber
                            ] || null,

                        timing: timing
                            ? {
                                timestampFrom:
                                    timing.timestamp_from,

                                timestampTo:
                                    timing.timestamp_to,

                                duration:
                                    timing.duration,

                                segments:
                                    timing.segments ||
                                    []
                            }
                            : null
                    };
                }
            );


        // ==================================================
        // 10. RESPONSE
        // ==================================================

        return res.status(200).json({

            success: true,

            chapter:
                chapterNumber,

            language,

            translatorId,

            reciter: {

                id:
                    reciterId,

                name:
                    reciterName
            },

            audio: {

                url:
                    audioUrl,

                format:
                    audioFile?.format ||
                    null,

                fileSize:
                    audioFile?.file_size ||
                    null
            },

            totalVerses:
                verses.length,

            verses
        });

    } catch (error) {

        console.error(
            "Get Quran Audio Mode Error:",

            error.response?.data ||
            error.message
        );

        return res.status(500).json({

            success: false,

            message:
                "Imeshindikana kupata Qur'an Audio Mode",

            error:
                error.response?.data ||
                error.message
        });
    }
};


// ======================================================
// GET QUR'AN RESOURCES
// GET /api/quran/resources
// ======================================================

const getQuranResources = async (req, res) => {

    try {

        const data =
            await quranService
                .getQuranResources();

        res.status(200).json({

            success: true,

            data
        });

    } catch (error) {

        console.error(
            "Get Quran Resources Error:",
            error.response?.data ||
            error.message
        );

        res.status(500).json({

            success: false,

            message:
                "Imeshindikana kupata Qur'an resources",

            error:
                error.message
        });
    }
};


// ======================================================
// EXPORTS
// ======================================================

module.exports = {

    getAllQuranSurahs,

    getQuranSurah,

    getSurahVerses,

    getSingleAyah,

    getFullSurah,

    getQuranAudioMode,

    getQuranReciters,

    getQuranResources
};