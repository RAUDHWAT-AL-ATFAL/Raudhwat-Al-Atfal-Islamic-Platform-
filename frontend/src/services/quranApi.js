// src/services/quranApi.js - RAUDHWAT AL-ATFAL ISLAMIC PLATFORM

const BASE_URL_V4 = "https://api.quran.com/api/v4";
const ALQURAN_CLOUD_URL = "https://api.alquran.cloud/v1";

// 🚀 IN-MEMORY CACHE FOR SUPER FAST SPEED
const memoryCache = new Map();

// 🎙️ MAP YA WASOMAJI (RECITERS AUDIO ENDPOINTS)
export const RECITER_AUDIO_PATHS = {
  mishari_al_afasy: "https://everyayah.com/data/Alafasy_128kbps",
  abdurrahim_as_sudais: "https://everyayah.com/data/Sudais_192kbps",
  abu_bakr_shatri: "https://everyayah.com/data/Abu_Bakr_Ash-Shaatree_128kbps",
  maher_al_muaiqly: "https://everyayah.com/data/Maher_AlMuaiqly_64kbps",
  saad_el_ghamidi: "https://everyayah.com/data/Ghamadi_40kbps"
};

// Map ya ID za Quran.com za Reciters kwa ajili ya Full Surah MP3 Download
const RECITER_CHAPTER_IDS = {
  mishari_al_afasy: 7,
  abdurrahim_as_sudais: 2,
  abu_bakr_shatri: 4,
  maher_al_muaiqly: 6,
  saad_el_ghamidi: 3
};

/**
 * 📖 1. PATA ORODHA YA SURA ZOTE 114 (FETCH SURAH LIST)
 */
export const getAllSurahs = async () => {
  const cacheKey = "quran_surah_list_v2";
  
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey);
  }

  const localData = localStorage.getItem(cacheKey);
  if (localData) {
    try {
      const parsed = JSON.parse(localData);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryCache.set(cacheKey, parsed);
        return parsed;
      }
    } catch (e) {
      localStorage.removeItem(cacheKey);
    }
  }

  try {
    const response = await fetch(`${BASE_URL_V4}/chapters?language=sw`);
    if (!response.ok) throw new Error("Failed to fetch chapters from primary API");
    
    const data = await response.json();
    const chapters = data.chapters || [];

    localStorage.setItem(cacheKey, JSON.stringify(chapters));
    memoryCache.set(cacheKey, chapters);

    return chapters;
  } catch (error) {
    console.warn("Primary API failed, fetching from secondary AlQuran Cloud...", error);
    
    try {
      const fallbackRes = await fetch(`${ALQURAN_CLOUD_URL}/surah`);
      const fallbackData = await fallbackRes.json();
      
      const formattedChapters = (fallbackData.data || []).map((s) => ({
        id: s.number,
        name_simple: s.englishName,
        name_arabic: s.name,
        translated_name: { name: s.englishNameTranslation },
        verses_count: s.numberOfAyahs,
        revelation_place: s.revelationType.toLowerCase()
      }));

      return formattedChapters;
    } catch (fbErr) {
      console.error("Secondary Quran API error:", fbErr);
      throw fbErr;
    }
  }
};

export const getSurahList = getAllSurahs;

/**
 * 📖 2. PATA TAARIFA ZA SURA MOJA TU (FETCH SINGLE SURAH DETAILS)
 */
export const getSurahDetails = async (surahId, lang = "sw") => {
  const cacheKey = `surah_detail_${surahId}_${lang}`;
  if (memoryCache.has(cacheKey)) return memoryCache.get(cacheKey);

  try {
    const res = await fetch(`${BASE_URL_V4}/chapters/${surahId}?language=${lang}`);
    if (!res.ok) throw new Error("Failed to fetch surah details");
    const data = await res.json();
    
    memoryCache.set(cacheKey, data.chapter);
    return data.chapter;
  } catch (err) {
    console.error("Error fetching surah details:", err);
    return null;
  }
};

/**
 * 🎧 3. PATA DIRECT MP3 AUDIO YA SURA NZIMA (FOR GLOBAL SYSTEM AMPLIFIER)
 */
export const getFullSurahAudioUrl = (surahId, reciterKey = "mishari_al_afasy") => {
  const paddedSurah = String(surahId).padStart(3, "0");

  if (reciterKey === "mishari_al_afasy") {
    return `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${paddedSurah}.mp3`;
  } else if (reciterKey === "abdurrahim_as_sudais") {
    return `https://download.quranicaudio.com/quran/abdurrahmaan_as_sudays/${paddedSurah}.mp3`;
  } else if (reciterKey === "saad_el_ghamidi") {
    return `https://download.quranicaudio.com/quran/sa3d_al_ghaamidi/complete/${paddedSurah}.mp3`;
  } else if (reciterKey === "maher_al_muaiqly") {
    return `https://download.quranicaudio.com/quran/maher_al_muaiqly/year1431/${paddedSurah}.mp3`;
  } else if (reciterKey === "abu_bakr_shatri") {
    return `https://download.quranicaudio.com/quran/abu_bakr_ash-shaatree/${paddedSurah}.mp3`;
  }

  return `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${paddedSurah}.mp3`;
};

/**
 * 📖 4. PATA SURA KAMILI NA AYA ZAKE ZOTE (FETCH FULL SURAH WITH VERSES & AUDIO)
 */
export const getFullSurah = async (surahId, reciterId = "mishari_al_afasy", lang = "sw") => {
  const cacheKey = `full_surah_${surahId}_${reciterId}_${lang}`;

  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey);
  }

  try {
    const translationId = lang === "sw" ? 131 : 20;

    const [chapterRes, versesRes] = await Promise.all([
      fetch(`${BASE_URL_V4}/chapters/${surahId}?language=${lang}`),
      fetch(
        `${BASE_URL_V4}/verses/by_chapter/${surahId}?language=${lang}&words=true&translations=${translationId}&fields=text_uthmani,text_indopak&per_page=300`
      )
    ]);

    if (!chapterRes.ok || !versesRes.ok) {
      throw new Error("Imeshindikana kupakua taarifa za Sura kutoka Quran.com API");
    }

    const chapterData = await chapterRes.json();
    const versesData = await versesRes.json();

    const chapter = chapterData.chapter;
    const rawVerses = versesData.verses || [];

    const audioBasePath = RECITER_AUDIO_PATHS[reciterId] || RECITER_AUDIO_PATHS.mishari_al_afasy;

    const formattedVerses = rawVerses.map((verse, index) => {
      const verseNum = verse.verse_number || index + 1;
      const paddedSurah = String(surahId).padStart(3, "0");
      const paddedVerse = String(verseNum).padStart(3, "0");

      const audioUrl = `${audioBasePath}/${paddedSurah}${paddedVerse}.mp3`;

      const translationText =
        verse.translations && verse.translations.length > 0
          ? verse.translations[0].text.replace(/<[^>]*>?/gm, "")
          : "Tafsiri inapakia...";

      return {
        id: verse.id,
        verse_number: verseNum,
        verse_key: verse.verse_key || `${surahId}:${verseNum}`,
        text_arabic: verse.text_uthmani || verse.text_indopak || "",
        translation: translationText,
        audioUrl: audioUrl,
        words: verse.words || []
      };
    });

    const fullAudioUrl = getFullSurahAudioUrl(surahId, reciterId);

    const resultPayload = {
      chapter: chapter,
      verses: formattedVerses,
      fullSurahAudioUrl: fullAudioUrl
    };

    memoryCache.set(cacheKey, resultPayload);
    return resultPayload;

  } catch (primaryErr) {
    console.warn("Primary Full Surah API failed, trying Fallback Engine...", primaryErr);
    return await getFullSurahFallback(surahId, reciterId);
  }
};

/**
 * 🔄 5. FALLBACK ENGINE
 */
const getFullSurahFallback = async (surahId, reciterId) => {
  try {
    const res = await fetch(`${ALQURAN_CLOUD_URL}/surah/${surahId}/editions/quran-uthmani,sw.barwani`);
    const data = await res.json();

    if (!data.data || data.data.length < 2) {
      throw new Error("Fallback API data invalid");
    }

    const arabicEdition = data.data[0];
    const swahiliEdition = data.data[1];

    const audioBasePath = RECITER_AUDIO_PATHS[reciterId] || RECITER_AUDIO_PATHS.mishari_al_afasy;
    const paddedSurah = String(surahId).padStart(3, "0");

    const formattedVerses = arabicEdition.ayahs.map((ayah, idx) => {
      const verseNum = ayah.numberInSurah;
      const paddedVerse = String(verseNum).padStart(3, "0");

      return {
        id: ayah.number,
        verse_number: verseNum,
        verse_key: `${surahId}:${verseNum}`,
        text_arabic: ayah.text,
        translation: swahiliEdition.ayahs[idx]?.text || "",
        audioUrl: `${audioBasePath}/${paddedSurah}${paddedVerse}.mp3`,
        words: []
      };
    });

    return {
      chapter: {
        id: surahId,
        name_simple: arabicEdition.englishName,
        name_arabic: arabicEdition.name,
        translated_name: { name: arabicEdition.englishNameTranslation },
        verses_count: arabicEdition.numberOfAyahs,
        revelation_place: arabicEdition.revelationType.toLowerCase()
      },
      verses: formattedVerses,
      fullSurahAudioUrl: getFullSurahAudioUrl(surahId, reciterId)
    };
  } catch (err) {
    console.error("Critical: Both Quran APIs failed!", err);
    throw err;
  }
};

/**
 * 🔎 6. SMART QURAN SEARCH ENGINE
 */
export const searchQuranGlobal = async (query, lang = "sw") => {
  if (!query || query.trim().length < 2) return [];

  try {
    const response = await fetch(`${BASE_URL_V4}/search?q=${encodeURIComponent(query)}&size=20&page=1&language=${lang}`);
    if (!response.ok) throw new Error("Search API error");

    const data = await response.json();
    return data.search?.results || [];
  } catch (err) {
    console.error("Quran Search Error:", err);
    return [];
  }
};

/**
 * 📚 7. PATA TAFSIR YA AYA (FETCH TAFSIR)
 */
export const getAyahTafsir = async (verseKey) => {
  try {
    const response = await fetch(`${BASE_URL_V4}/tafsirs/169/by_ayah/${verseKey}`);
    if (!response.ok) throw new Error("Tafsir API error");

    const data = await response.json();
    return data.tafsir?.text?.replace(/<[^>]*>?/gm, "") || "Tafsir ya aya hii inapakia...";
  } catch (err) {
    console.error("Tafsir Fetch Error:", err);
    return "Tafsir haijapatikana kwa sasa. Tafadhali jaribu tena baadae.";
  }
};