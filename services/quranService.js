const axios = require("axios");

// ======================================================
// QUR'AN FOUNDATION CONFIGURATION
// ======================================================

const ENV = process.env.QF_ENV || "prelive";

const CONFIG = {
    prelive: {
        authUrl: "https://prelive-oauth2.quran.foundation",
        apiUrl: "https://apis-prelive.quran.foundation"
    },

    production: {
        authUrl: "https://oauth2.quran.foundation",
        apiUrl: "https://apis.quran.foundation"
    }
};

if (!CONFIG[ENV]) {
    throw new Error(
        "QF_ENV lazima iwe 'prelive' au 'production'"
    );
}

const AUTH_URL = CONFIG[ENV].authUrl;
const API_URL = CONFIG[ENV].apiUrl;


// ======================================================
// TOKEN CACHE
// ======================================================

let cachedToken = null;
let tokenExpiresAt = 0;


// ======================================================
// GET ACCESS TOKEN
// ======================================================

const getQuranAccessToken = async () => {

    try {

        if (
            !process.env.QF_CLIENT_ID ||
            !process.env.QF_CLIENT_SECRET
        ) {
            throw new Error(
                "QF_CLIENT_ID na QF_CLIENT_SECRET hazijawekwa kwenye .env"
            );
        }

        // Return cached token
        if (
            cachedToken &&
            Date.now() < tokenExpiresAt
        ) {
            return cachedToken;
        }

        const credentials = Buffer
            .from(
                `${process.env.QF_CLIENT_ID}:${process.env.QF_CLIENT_SECRET}`
            )
            .toString("base64");

        const response = await axios.post(

            `${AUTH_URL}/oauth2/token`,

            new URLSearchParams({
                grant_type: "client_credentials",
                scope: "content"
            }).toString(),

            {
                headers: {
                    Authorization: `Basic ${credentials}`,
                    "Content-Type":
                        "application/x-www-form-urlencoded"
                },

                timeout: 30000
            }
        );

        cachedToken = response.data.access_token;

        const expiresIn =
            response.data.expires_in || 3600;

        tokenExpiresAt =
            Date.now() +
            ((expiresIn - 60) * 1000);

        return cachedToken;

    } catch (error) {

        cachedToken = null;
        tokenExpiresAt = 0;

        console.error(
            "Qur'an Token Error:",
            error.response?.data ||
            error.message
        );

        throw new Error(
            "Imeshindikana kupata Qur'an Foundation access token"
        );
    }
};


// ======================================================
// GENERIC QUR'AN API REQUEST
// ======================================================

const quranRequest = async (
    endpoint,
    params = {},
    retry = true
) => {

    try {

        const token =
            await getQuranAccessToken();

        const response = await axios.get(

            `${API_URL}/content/api/v4${endpoint}`,

            {
                params,

                headers: {
                    "x-auth-token": token,
                    "x-client-id":
                        process.env.QF_CLIENT_ID
                },

                timeout: 30000
            }
        );

        return response.data;

    } catch (error) {

        const status =
            error.response?.status;

        // Retry once if token expired
        if (
            status === 401 &&
            retry
        ) {

            cachedToken = null;
            tokenExpiresAt = 0;

            return quranRequest(
                endpoint,
                params,
                false
            );
        }

        console.error(
            "Qur'an API Error:",
            error.response?.data ||
            error.message
        );

        throw error;
    }
};


// ======================================================
// GET ALL CHAPTERS (SURA ZOTE 114 DIRECT)
// ======================================================

const getQuranChapters = async () => {
    try {
        // Tunatumia endpoint ya wazi kupata Sura zote 114
        const response = await axios.get("https://api.quran.com/api/v4/chapters");
        return response.data;
    } catch (error) {
        console.error("Fallback API Error, trying main request:", error.message);
        return await quranRequest("/chapters");
    }
};


// ======================================================
// GET ONE CHAPTER
// ======================================================

const getQuranChapter = async (
    chapterNumber
) => {

    return await quranRequest(
        `/chapters/${chapterNumber}`
    );
};


// ======================================================
// GET CHAPTER VERSES
// ======================================================

const getQuranChapterVerses = async (
    chapterNumber,
    page = 1,
    perPage = 50,
    fields = "text_uthmani",
    translations = "",
    tafsirs = ""
) => {

    const params = {
        page,
        per_page: perPage,
        fields
    };

    if (translations) {
        params.translations = translations;
    }

    if (tafsirs) {
        params.tafsirs = tafsirs;
    }

    return await quranRequest(
        `/verses/by_chapter/${chapterNumber}`,
        params
    );
};


// ======================================================
// GET ONE AYAH
// ======================================================

const getQuranVerse = async (
    verseKey,
    {
        translationId = null,
        tafsirId = null,
        fields = ""
    } = {}
) => {

    const params = {};

    if (translationId) {
        params.translations = translationId;
    }

    if (tafsirId) {
        params.tafsirs = tafsirId;
    }

    if (fields) {
        params.fields = fields;
    }

    return await quranRequest(
        `/verses/by_key/${verseKey}`,
        params
    );
};


// ======================================================
// GET TRANSLATIONS
// ======================================================

const getTranslations = async () => {

    return await quranRequest(
        "/resources/translations"
    );
};


// ======================================================
// GET TAFSIRS
// ======================================================

const getTafsirs = async () => {

    return await quranRequest(
        "/resources/tafsirs"
    );
};


// ======================================================
// GET RECITATIONS
// AYAH-BY-AYAH RECITATIONS
// ======================================================

const getRecitations = async () => {

    return await quranRequest(
        "/resources/recitations"
    );
};


// ======================================================
// GET CHAPTER RECITERS
// IMPORTANT:
// HIZI NDIZO ID ZITAKAZOTUMIKA KWA CHAPTER AUDIO
// ======================================================

const getChapterReciters = async () => {

    return await quranRequest(
        "/resources/chapter_reciters"
    );
};


// ======================================================
// GET TRANSLATED VERSES
// ======================================================

const getTranslatedVerses = async (
    chapterNumber,
    translationId,
    page = 1,
    perPage = 50
) => {

    return await quranRequest(

        `/verses/by_chapter/${chapterNumber}`,

        {
            page,
            per_page: perPage,
            translations: translationId,
            fields: "text_uthmani"
        }
    );
};


// ======================================================
// GET TAFSIR VERSES
// ======================================================

const getTafsirVerses = async (
    chapterNumber,
    tafsirId,
    page = 1,
    perPage = 50
) => {

    return await quranRequest(

        `/verses/by_chapter/${chapterNumber}`,

        {
            page,
            per_page: perPage,
            tafsirs: tafsirId
        }
    );
};


// ======================================================
// GET VERSES WITH TAFSIR ONLY
// ======================================================

const getVersesWithTafsir = async (
    chapterNumber,
    tafsirId,
    page = 1,
    perPage = 50
) => {

    return await quranRequest(

        `/verses/by_chapter/${chapterNumber}`,

        {
            page,
            per_page: perPage,
            tafsirs: tafsirId
        }
    );
};


// ======================================================
// GET VERSES WITH TRANSLATION + TAFSIR
// ======================================================

const getVersesWithTranslationAndTafsir =
async (
    chapterNumber,
    translationId,
    tafsirId,
    page = 1,
    perPage = 50
) => {

    return await quranRequest(

        `/verses/by_chapter/${chapterNumber}`,

        {
            page,
            per_page: perPage,
            translations: translationId,
            tafsirs: tafsirId
        }
    );
};


// ======================================================
// OLD AYAH-BY-AYAH RECITATION AUDIO
// ======================================================

const getRecitationAudio = async (
    recitationId,
    chapterNumber,
    page = 1,
    perPage = 50
) => {

    return await quranRequest(

        `/recitations/${recitationId}/by_chapter/${chapterNumber}`,

        {
            page,
            per_page: perPage
        }
    );
};


// ======================================================
// 🎧 GET CHAPTER RECITATION AUDIO
// ======================================================

const getChapterRecitationAudio = async (
    reciterId,
    chapterNumber,
    segments = true
) => {

    return await quranRequest(

        `/chapter_recitations/${reciterId}/${chapterNumber}`,

        {
            segments
        }
    );
};


// ======================================================
// GET ALL CHAPTER AUDIO FILES FOR RECITER
// ======================================================

const getChapterRecitationAudioFiles = async (
    reciterId
) => {

    return await quranRequest(
        `/chapter_recitations/${reciterId}`
    );
};


// ======================================================
// GET QUR'AN RESOURCES
// ======================================================

const getQuranResources = async () => {

    const [
        translations,
        tafsirs,
        recitations,
        chapterReciters
    ] = await Promise.all([

        getTranslations(),

        getTafsirs(),

        getRecitations(),

        getChapterReciters()
    ]);

    return {

        translations,

        tafsirs,

        recitations,

        chapterReciters
    };
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    getQuranAccessToken,

    getQuranChapters,

    getQuranChapter,

    getQuranChapterVerses,

    getQuranVerse,

    getTranslations,

    getTafsirs,

    getRecitations,

    getChapterReciters,

    getTranslatedVerses,

    getTafsirVerses,

    getVersesWithTranslationAndTafsir,

    getVersesWithTafsir,

    // Old ayah-by-ayah audio
    getRecitationAudio,

    // New chapter audio
    getChapterRecitationAudio,

    getChapterRecitationAudioFiles,

    getQuranResources
};