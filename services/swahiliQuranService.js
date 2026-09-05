const axios = require("axios");

// ==========================================
// QURANENC CONFIGURATION
// ==========================================

const QURANENC_API =
    "https://quranenc.com/api/v1";

// ==========================================
// GET ONE SWAHILI AYAH
// Example: 1:1
// ==========================================

const getSwahiliAyah = async (
    surahNumber,
    ayahNumber
) => {

    const response = await axios.get(
        `${QURANENC_API}/translation/aya/swahili_rwwad/${surahNumber}/${ayahNumber}`,
        {
            timeout: 30000
        }
    );

    return response.data;

};

// ==========================================
// GET FULL SWAHILI SURAH
// Example: Surah 1
// ==========================================

const getSwahiliSurah = async (
    surahNumber
) => {

    const response = await axios.get(
        `${QURANENC_API}/translation/sura/swahili_rwwad/${surahNumber}`,
        {
            timeout: 30000
        }
    );

    return response.data;

};

// ==========================================
// EXPORT
// ==========================================

module.exports = {

    getSwahiliAyah,
    getSwahiliSurah

};