import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllSurahs } from "../../services/quranApi";

// ==========================================
// CONSTANTS & SHARED DATA
// ==========================================

// Qari Selectors (Reciter Options for SurahPage & QuranHome)
const RECITERS = [
  { 
    id: "mishari_al_afasy", 
    name: "Mishary Rashid Alafasy", 
    subtext: "Murattal • Hafs", 
    url: (s, a) => a ? `https://everyayah.com/data/Alafasy_128kbps/${String(s).padStart(3, "0")}${String(a).padStart(3, "0")}.mp3` : `https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/${s}.mp3` 
  },
  { 
    id: "abdurrahim_as_sudais", 
    name: "Abdul Rahman Al-Sudais", 
    subtext: "Murattal • Makkah", 
    url: (s, a) => a ? `https://everyayah.com/data/Sudais_192kbps/${String(s).padStart(3, "0")}${String(a).padStart(3, "0")}.mp3` : `https://download.quranicaudio.com/qdc/abdurrahim_as_sudais/murattal/${s}.mp3` 
  },
  { 
    id: "abu_bakr_shatri", 
    name: "Abu Bakr Al-Shatri", 
    subtext: "Murattal • Soft", 
    url: (s, a) => a ? `https://everyayah.com/data/Abu_Bakr_Ash-Shaatree_128kbps/${String(s).padStart(3, "0")}${String(a).padStart(3, "0")}.mp3` : `https://download.quranicaudio.com/qdc/abu_bakr_shatri/murattal/${s}.mp3` 
  },
  { 
    id: "maher_al_muaiqly", 
    name: "Maher Al-Muaiqly", 
    subtext: "Murattal • Clear", 
    url: (s, a) => a ? `https://everyayah.com/data/Maher_AlMuaiqly_64kbps/${String(s).padStart(3, "0")}${String(a).padStart(3, "0")}.mp3` : `https://download.quranicaudio.com/qdc/maher_al_muaiqly/murattal/${s}.mp3` 
  },
  {
    id: "saad_el_ghamidi",
    name: "Sa'ad Al-Ghamdi",
    subtext: "Murattal • Melodic",
    url: (s) => `https://download.quranicaudio.com/qdc/saad_el_ghamidi/murattal/${s}.mp3`
  }
];

const TRANSLATION_LANGUAGES = [
  { code: "sw", name: "🇹🇿 Kiswahili", translator: "Ali Muhsin Al-Barwani", resourceId: 234 },
  { code: "en", name: "🇬🇧 English", translator: "Saheeh International", resourceId: 131 }
];

const PLAYBACK_MODES = [
  { id: "all", label: "🌟 Vyote Pamoja", desc: "Recitation + Tafsiri + Word Highlighting" },
  { id: "audio_only", label: "🎧 Sauti Tu", desc: "Kiarabu Pekee Bila Tafsiri" },
  { id: "audio_translation", label: "📚 Sauti + Tafsiri", desc: "Sauti Ya Kiarabu na Tafsiri ya Text" },
  { id: "audio_highlight", label: "🖍️ Sauti + Highlighting", desc: "Inamulika Neno Baada ya Neno" }
];

// ==========================================
// COMPONENT 1: SURAH DETAIL PAGE
// ==========================================
export const SurahPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Surah Data States
  const [verses, setVerses] = useState([]);
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Reader Settings & Offline Persistence
  const [fontSize, setFontSize] = useState(() => Number(localStorage.getItem("quran_font_ar")) || 32);
  const [selectedReciter, setSelectedReciter] = useState(() => localStorage.getItem("quran_reciter") || "mishari_al_afasy");
  const [selectedLanguage, setSelectedLanguage] = useState(() => localStorage.getItem("quran_language") || "sw");
  const [showTafsir, setShowTafsir] = useState(false);
  const [activeTafsirVerse, setActiveTafsirVerse] = useState(null);

  // User Interactive Features
  const [bookmarks, setBookmarks] = useState(() => JSON.parse(localStorage.getItem(`quran_bookmarks_${id}`) || "[]"));
  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem(`quran_notes_${id}`) || "{}"));
  const [downloadedSurahs, setDownloadedSurahs] = useState(() => JSON.parse(localStorage.getItem("quran_downloaded_surahs") || "[]"));

  // Continuous Audio & Live Highlighting States
  const [currentVerseIndex, setCurrentVerseIndex] = useState(null);
  const [activeWordIndex, setActiveWordIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [continuousAudio, setContinuousAudio] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef(null);
  const verseRefs = useRef({});

  // Save Settings Changes
  useEffect(() => {
    localStorage.setItem("quran_reciter", selectedReciter);
    localStorage.setItem("quran_language", selectedLanguage);
  }, [selectedReciter, selectedLanguage]);

  useEffect(() => {
    localStorage.setItem(`quran_bookmarks_${id}`, JSON.stringify(bookmarks));
  }, [bookmarks, id]);

  useEffect(() => {
    localStorage.setItem(`quran_notes_${id}`, JSON.stringify(notes));
  }, [notes, id]);

  // Fetch Surah Details
  useEffect(() => {
    const fetchFullSurah = async () => {
      try {
        setLoading(true);
        setError("");

        const localSurahData = localStorage.getItem(`quran_offline_surah_${id}`);
        if (localSurahData) {
          const parsed = JSON.parse(localSurahData);
          setChapter(parsed.chapter);
          setVerses(parsed.verses);
          setLoading(false);
        }

        const chRes = await fetch(`https://api.quran.com/api/v4/chapters/${id}?language=sw`);
        const chData = await chRes.json();

        const vRes = await fetch(`https://api.quran.com/api/v4/verses/by_chapter/${id}?language=en&words=true&translations=20,131&per_page=300`);
        const vData = await vRes.json();

        if (vData && vData.verses) {
          setChapter(chData.chapter);
          setVerses(vData.verses);

          localStorage.setItem(`quran_offline_surah_${id}`, JSON.stringify({
            chapter: chData.chapter,
            verses: vData.verses
          }));
        }
      } catch (err) {
        console.warn("API Error, using cached content if available:", err);
        if (!localStorage.getItem(`quran_offline_surah_${id}`)) {
          setError("Imeshindikana kupakua Sura hii. Tafadhali angalia mtandao wako.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchFullSurah();
  }, [id]);

  const saveReadingProgress = (verseIdx) => {
    const lastReadData = {
      surahId: id,
      surahName: chapter?.name_simple || `Surah ${id}`,
      verseIndex: verseIdx
    };
    localStorage.setItem("quran_last_read", JSON.stringify(lastReadData));
  };

  useEffect(() => {
    if (currentVerseIndex !== null && verseRefs.current[currentVerseIndex]) {
      verseRefs.current[currentVerseIndex].scrollIntoView({ behavior: "smooth", block: "center" });
      saveReadingProgress(currentVerseIndex);
    }
  }, [currentVerseIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const cur = audioRef.current.currentTime;
      const dur = audioRef.current.duration || 1;
      setCurrentTime(cur);
      setDuration(dur);

      const currentVerse = verses[currentVerseIndex];
      if (currentVerse && currentVerse.words) {
        const totalWords = currentVerse.words.length;
        const estimatedWordIdx = Math.floor((cur / dur) * totalWords);
        setActiveWordIndex(Math.min(estimatedWordIdx, totalWords - 1));
      }
    }
  };

  const playVerse = (index) => {
    if (index < 0 || index >= verses.length) return;
    setCurrentVerseIndex(index);
    setActiveWordIndex(0);

    const ayahNum = index + 1;
    const currentReciterObj = RECITERS.find((r) => r.id === selectedReciter) || RECITERS[0];
    const audioUrl = currentReciterObj.url(id, ayahNum);

    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.error("Audio playback error:", e));
    }
  };

  const togglePlay = () => {
    if (currentVerseIndex === null && verses.length > 0) {
      playVerse(0);
      return;
    }
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleAudioEnded = () => {
    if (continuousAudio && currentVerseIndex < verses.length - 1) {
      playVerse(currentVerseIndex + 1);
    } else {
      setIsPlaying(false);
      setCurrentVerseIndex(null);
      setActiveWordIndex(null);
    }
  };

  const copyAyah = (verseText, translation) => {
    const textToCopy = `${verseText}\n\nTafsiri: ${translation}\n[Quran Experience]`;
    navigator.clipboard.writeText(textToCopy);
    alert("📋 Ayah imenakiliwa kikamilifu!");
  };

  const shareAyah = (verseKey, verseText) => {
    if (navigator.share) {
      navigator.share({ title: `Quran Ayah ${verseKey}`, text: `${verseText} (Quran ${verseKey})` });
    } else {
      copyAyah(verseText, "");
    }
  };

  const toggleBookmark = (verseKey) => {
    setBookmarks(prev => prev.includes(verseKey) ? prev.filter(k => k !== verseKey) : [...prev, verseKey]);
  };

  const handleNoteSave = (verseKey, noteText) => {
    setNotes(prev => ({ ...prev, [verseKey]: noteText }));
  };

  const downloadSurahForOffline = () => {
    if (!downloadedSurahs.includes(id)) {
      const updated = [...downloadedSurahs, id];
      setDownloadedSurahs(updated);
      localStorage.setItem("quran_downloaded_surahs", JSON.stringify(updated));
      alert("📥 Sura imehifadhiwa kwa ajili ya Offline Reading!");
    } else {
      alert("📥 Sura hii tayari ipo kwenye simu/kifaa chako!");
    }
  };

  const getTranslationText = (verse) => {
    if (!verse || !verse.translations) return "";
    if (selectedLanguage === "sw") {
      const sw = verse.translations.find(t => t.resource_id === 131 || t.language_name === "swahili");
      return sw ? sw.text : verse.translations[0]?.text || "";
    }
    const en = verse.translations.find(t => t.resource_id === 20 || t.language_name === "english");
    return en ? en.text : verse.translations[0]?.text || "";
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (loading && verses.length === 0) {
    return (
      <div style={surahStyles.loadingContainer}>
        <div style={surahStyles.spinner}>📖</div>
        <h2>Inapakia Sura...</h2>
      </div>
    );
  }

  if (error && verses.length === 0) {
    return (
      <div style={surahStyles.errorContainer}>
        <h2>⚠️ Utatuzi Unahitajika</h2>
        <p>{error}</p>
        <button style={surahStyles.primaryButton} onClick={() => navigate("/quran")}>⬅️ Rudi Kwenye Dashboard</button>
      </div>
    );
  }

  return (
    <div style={surahStyles.container}>
      <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onEnded={handleAudioEnded} />

      {/* TOP READER HEADER */}
      <header style={surahStyles.header}>
        <button style={surahStyles.backButton} onClick={() => navigate("/quran")}>⬅️ Dashboard</button>
        
        <div style={surahStyles.controlsGroup}>
          <button style={surahStyles.downloadBtn} onClick={downloadSurahForOffline}>
            {downloadedSurahs.includes(id) ? "📥 Offline Ready" : "📥 Download Surah"}
          </button>
          
          <div style={surahStyles.fontAdjuster}>
            <span style={{ fontSize: "12px", color: "#334155" }}>Typography:</span>
            <button style={surahStyles.fontBtn} onClick={() => setFontSize(p => Math.min(p + 2, 48))}>A+</button>
            <button style={surahStyles.fontBtn} onClick={() => setFontSize(p => Math.max(p - 2, 20))}>A-</button>
          </div>
        </div>
      </header>

      {/* SURAH TITLE BANNER */}
      <section style={surahStyles.banner}>
        <p style={surahStyles.bismillah}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        <h1 style={surahStyles.surahTitleArabic}>{chapter?.name_arabic}</h1>
        <h2 style={surahStyles.surahTitleEnglish}>{chapter?.name_simple}</h2>
        <div style={surahStyles.badgeRow}>
          <span style={surahStyles.infoBadge}>🕌 {chapter?.revelation_place === "makkah" ? "Makka" : "Madina"}</span>
          <span style={surahStyles.infoBadge}>📖 Aya {chapter?.verses_count || verses.length}</span>
        </div>

        {/* SETTINGS CONTROL PANEL */}
        <div style={surahStyles.settingsGrid}>
          <div style={surahStyles.settingBox}>
            <label style={surahStyles.settingLabel}>🎙️ Qari Selector:</label>
            <select value={selectedReciter} onChange={(e) => setSelectedReciter(e.target.value)} style={surahStyles.selectInput}>
              {RECITERS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>

          <div style={surahStyles.settingBox}>
            <label style={surahStyles.settingLabel}>🌐 Language / Tafsiri:</label>
            <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} style={surahStyles.selectInput}>
              <option value="sw">🇹ℤ Swahili Translation</option>
              <option value="en">🇬🇧 English Translation</option>
            </select>
          </div>
        </div>
      </section>

      {/* VERSES LIST */}
      <main style={surahStyles.versesContainer}>
        {verses.map((verse, idx) => {
          const verseKey = verse.verse_key || `${id}:${idx + 1}`;
          const isActive = currentVerseIndex === idx;
          const isBookmarked = bookmarks.includes(verseKey);
          const translation = getTranslationText(verse);

          return (
            <div
              key={verse.id || verseKey}
              ref={(el) => (verseRefs.current[idx] = el)}
              style={{
                ...surahStyles.verseCard,
                backgroundColor: isActive ? "#fef3c7" : "#ffffff",
                borderColor: isActive ? "#d97706" : "#e2e8f0",
                borderLeft: isActive ? "6px solid #d97706" : "1px solid #e2e8f0"
              }}
            >
              <div style={surahStyles.verseHeader}>
                <span style={{ ...surahStyles.verseBadge, backgroundColor: isActive ? "#d97706" : "#ecfdf5", color: isActive ? "#fff" : "#047857" }}>
                  Aya {verseKey}
                </span>

                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  <button style={surahStyles.actionBtn} onClick={() => playVerse(idx)}>
                    {isActive && isPlaying ? "⏸️ Sitisha" : "▶️ Cheza"}
                  </button>
                  <button style={{ ...surahStyles.iconToolBtn, color: isBookmarked ? "#d97706" : "#64748b" }} onClick={() => toggleBookmark(verseKey)}>
                    🔖
                  </button>
                  <button style={surahStyles.iconToolBtn} onClick={() => copyAyah(verse.text_uthmani, translation)}>📋</button>
                  <button style={surahStyles.iconToolBtn} onClick={() => shareAyah(verseKey, verse.text_uthmani)}>🔗</button>
                  <button style={{ ...surahStyles.actionBtn, backgroundColor: "#0284c7" }} onClick={() => { setShowTafsir(true); setActiveTafsirVerse(verseKey); }}>
                    📚 Tafsir
                  </button>
                </div>
              </div>

              <div style={{ ...surahStyles.arabicTextContainer, fontSize: `${fontSize}px` }}>
                {verse.words && verse.words.length > 0 ? (
                  verse.words.map((wordObj, wIdx) => {
                    const isWordActive = isActive && activeWordIndex === wIdx;
                    return (
                      <span
                        key={wIdx}
                        style={{
                          ...surahStyles.wordSpan,
                          backgroundColor: isWordActive ? "#f59e0b" : "transparent",
                          color: isWordActive ? "#ffffff" : (isActive ? "#92400e" : "#0f172a")
                        }}
                      >
                        {wordObj.text_uthmani || wordObj.text}
                      </span>
                    );
                  })
                ) : (
                  <span>{verse.text_uthmani}</span>
                )}
              </div>

              <p style={surahStyles.translationText}>
                {translation.replace(/<[^>]*>?/gm, "")}
              </p>

              <div style={surahStyles.noteContainer}>
                <label style={surahStyles.noteLabel}>📝 Personal Notes / Kumbukumbu:</label>
                <input
                  type="text"
                  placeholder="Andika maelezo yako kuhusu aya hii hapa..."
                  value={notes[verseKey] || ""}
                  onChange={(e) => handleNoteSave(verseKey, e.target.value)}
                  style={surahStyles.noteInput}
                />
              </div>
            </div>
          );
        })}
      </main>

      {/* TAFSIR MODAL POPUP */}
      {showTafsir && (
        <div style={surahStyles.modalOverlay}>
          <div style={surahStyles.modalContent}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>📚 Tafsir ya Aya {activeTafsirVerse}</h3>
              <button style={surahStyles.closeBtn} onClick={() => setShowTafsir(false)}>✖</button>
            </div>
            <p style={{ marginTop: "16px", lineHeight: "1.6", color: "#334155" }}>
              Ufafanuzi na Tafsir ya aya hii inapatikana na inafundisha mazingatio, sheria na hekima za Mwenyezi Mungu zilizomo katika Aya hii ya Quran.
            </p>
          </div>
        </div>
      )}

      {/* FLOATING CONTINUOUS AUDIO PLAYER */}
      <div style={surahStyles.floatingPlayer}>
        <div style={surahStyles.progressRow}>
          <span style={surahStyles.timeText}>{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={(e) => { if (audioRef.current) audioRef.current.currentTime = e.target.value; }}
            style={surahStyles.progressBar}
          />
          <span style={surahStyles.timeText}>{formatTime(duration)}</span>
        </div>

        <div style={surahStyles.playerControls}>
          <div style={{ fontSize: "12px", color: "#e2e8f0" }}>
            {currentVerseIndex !== null ? `▶️ Inacheza Aya #${currentVerseIndex + 1}` : "Chagua Aya Kuanza Listening"}
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button style={surahStyles.playerBtn} onClick={() => playVerse(currentVerseIndex - 1)}>⏮️</button>
            <button style={surahStyles.playPauseCircleBtn} onClick={togglePlay}>{isPlaying ? "⏸️" : "▶️"}</button>
            <button style={surahStyles.playerBtn} onClick={() => playVerse(currentVerseIndex + 1)}>⏭️</button>
            <button
              style={{ ...surahStyles.playerBtn, backgroundColor: continuousAudio ? "#10b981" : "#334155" }}
              onClick={() => setContinuousAudio(!continuousAudio)}
              title="Continuous Audio Playback"
            >
              🔄
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT 2: QURAN HOME DASHBOARD
// ==========================================
function QuranHome() {
  const navigate = useNavigate();
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedReciter, setSelectedReciter] = useState(() => {
    return localStorage.getItem("quran_reciter") || "mishari_al_afasy";
  });
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return localStorage.getItem("quran_language") || "sw";
  });
  const [playbackMode, setPlaybackMode] = useState(() => {
    return localStorage.getItem("quran_playback_mode") || "all";
  });
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);

  const [playingSurahId, setPlayingSurahId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    localStorage.setItem("quran_reciter", selectedReciter);
    localStorage.setItem("quran_language", selectedLanguage);
    localStorage.setItem("quran_playback_mode", playbackMode);
  }, [selectedReciter, selectedLanguage, playbackMode]);

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getAllSurahs();
        if (Array.isArray(response)) {
          setSurahs(response);
        } else if (response && Array.isArray(response.data)) {
          setSurahs(response.data);
        } else {
          setSurahs([]);
        }
      } catch (err) {
        console.error("Qur'an API Error:", err);
        setError("Imeshindikana kupata Sura za Qur'an. Tafadhali hakikisha mtandao uko sawa.");
      } finally {
        setLoading(false);
      }
    };
    fetchSurahs();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    const currentAudio = audioRef.current;
    const handleEnded = () => {
      setIsPlaying(false);
      setPlayingSurahId(null);
    };
    currentAudio.addEventListener("ended", handleEnded);
    return () => {
      currentAudio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const handleQuickPlay = (e, surahNumber) => {
    e.stopPropagation();
    const currentReciterObj = RECITERS.find((r) => r.id === selectedReciter) || RECITERS[0];
    const streamUrl = currentReciterObj.url(surahNumber);
    if (playingSurahId === surahNumber && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.src = streamUrl;
      audioRef.current
        .play()
        .then(() => {
          setPlayingSurahId(surahNumber);
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error("Audio playback error:", err);
          const formattedId = String(surahNumber).padStart(3, "0");
          audioRef.current.src = `https://server8.mp3quran.net/afs/${formattedId}.mp3`;
          audioRef.current.play();
          setPlayingSurahId(surahNumber);
          setIsPlaying(true);
        });
    }
  };

  const handleNavigateToSurah = (surahNumber) => {
    navigate(`/quran/surah/${surahNumber}`);
  };

  const filteredSurahs = surahs.filter((surah) => {
    const nameArabic = surah.name_arabic || surah.name || "";
    const nameSimple = surah.name_simple || surah.englishName || "";
    const nameTranslated = surah.translated_name?.name || surah.englishNameTranslation || "";
    const query = searchQuery.toLowerCase().trim();
    return (
      nameArabic.toLowerCase().includes(query) ||
      nameSimple.toLowerCase().includes(query) ||
      nameTranslated.toLowerCase().includes(query) ||
      String(surah.id || surah.number).includes(query)
    );
  });

  const activeReciterName = RECITERS.find((r) => r.id === selectedReciter)?.name || "Mishary Alafasy";
  const activeLangName = TRANSLATION_LANGUAGES.find((l) => l.code === selectedLanguage)?.name || "Kiswahili";

  if (loading) {
    return (
      <div style={homeStyles.loadingWrapper}>
        <div style={homeStyles.loadingCard}>
          <div style={homeStyles.quranPulseIcon}>📖</div>
          <h2 style={homeStyles.loadingTitle}>القرآن الكريم</h2>
          <p style={homeStyles.loadingSub}>Inapakia Orodha Ya Sura Za Qur'an...</p>
          <div style={homeStyles.progressBarWrapper}>
            <div style={homeStyles.progressBarFill}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={homeStyles.loadingWrapper}>
        <div style={{ ...homeStyles.loadingCard, borderColor: "#fecaca" }}>
          <div style={{ fontSize: "50px", marginBottom: "10px" }}>⚠️</div>
          <h2 style={{ color: "#991b1b", margin: 0 }}>Imeshindikana Kupakia</h2>
          <p style={{ color: "#4b5563", fontSize: "15px", margin: "10px 0 20px 0" }}>{error}</p>
          <button onClick={() => window.location.reload()} style={homeStyles.retryBtn}>
            🔄 Jaribu Tena
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={homeStyles.container}>
      <div style={homeStyles.innerContainer}>
        <header style={homeStyles.heroHeader}>
          <div style={homeStyles.badgeTop}>✨ RAUDHWAT AL-ATFAL ISLAMIC PLATFORM</div>
          <p style={homeStyles.bismillah}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
          <h1 style={homeStyles.mainHeading}>📖 القرآن الكريم</h1>
          <p style={homeStyles.quoteText}>
            "Tusomen Qur'an ndugu zangu, hakika itakuja Siku ya Kiyama ikiwa mwombezi kwa watu wake."
          </p>
          <div style={homeStyles.searchContainer}>
            <span style={homeStyles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Tafuta Sura (Mfano: Al-Fatiha, Yasin, 36)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={homeStyles.searchInput}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} style={homeStyles.clearSearchBtn}>
                ✖
              </button>
            )}
          </div>
          
          <div style={homeStyles.settingsControlBar}>
            <div style={homeStyles.activePillsContainer}>
              <span style={homeStyles.activePill}>
                🎙️ Msomaji: <strong>{activeReciterName}</strong>
              </span>
              <span style={homeStyles.activePill}>
                🌐 Tafsiri: <strong>{activeLangName}</strong>
              </span>
            </div>
            <button
              onClick={() => setShowSettingsPanel(!showSettingsPanel)}
              style={homeStyles.toggleSettingsBtn}
            >
              {showSettingsPanel ? "✖ Funga Mipangilio" : "⚙️ Mipangilio Ya Kusikiliza & Tafsiri"}
            </button>
          </div>

          {showSettingsPanel && (
            <div style={homeStyles.settingsPanelCard}>
              <h3 style={homeStyles.settingsTitle}>⚙️ Mipangilio Ya Qur'an Player</h3>
              
              <div style={homeStyles.settingsGrid}>
                <div style={homeStyles.settingGroup}>
                  <label style={homeStyles.settingLabel}>🎧 Chagua Reciter (Msomaji):</label>
                  <select
                    value={selectedReciter}
                    onChange={(e) => setSelectedReciter(e.target.value)}
                    style={homeStyles.settingSelect}
                  >
                    {RECITERS.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.subtext})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={homeStyles.settingGroup}>
                  <label style={homeStyles.settingLabel}>🌐 Chagua Lugha Ya Tafsiri:</label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    style={homeStyles.settingSelect}
                  >
                    {TRANSLATION_LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.name} - {l.translator}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={homeStyles.settingGroupFull}>
                  <label style={homeStyles.settingLabel}>📱 Njia Ya Kusoma na Kusikiliza (Playback Mode):</label>
                  <div style={homeStyles.modesGrid}>
                    {PLAYBACK_MODES.map((mode) => {
                      const isSelected = playbackMode === mode.id;
                      return (
                        <button
                          key={mode.id}
                          onClick={() => setPlaybackMode(mode.id)}
                          style={{
                            ...homeStyles.modeCardBtn,
                            borderColor: isSelected ? "#047857" : "#cbd5e1",
                            backgroundColor: isSelected ? "#ecfdf5" : "#ffffff",
                            color: isSelected ? "#064e3b" : "#334155"
                          }}
                        >
                          <div style={{ fontWeight: "700", fontSize: "14px" }}>{mode.label}</div>
                          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
                            {mode.desc}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div style={homeStyles.statsBar}>
            <span>📊 Sura Zilizoonyeshwa: <strong>{filteredSurahs.length}</strong> / 114</span>
          </div>
        </header>

        <div style={homeStyles.grid}>
          {filteredSurahs.map((surah, index) => {
            const surahNumber = surah.id || surah.number || index + 1;
            const arabicName = surah.name_arabic || surah.name || "سورة";
            const simpleName = surah.name_simple || surah.englishName || `Surah ${surahNumber}`;
            const translatedName = surah.translated_name?.name || surah.englishNameTranslation || "Tafsiri Ya Sura";
            const versesCount = surah.verses_count || surah.numberOfAyahs || "-";
            const isMeccan = (surah.revelation_place || surah.revelationType || "").toLowerCase() === "makkah";
            const isCurrentPlaying = playingSurahId === surahNumber && isPlaying;

            return (
              <div
                key={surahNumber}
                style={{
                  ...homeStyles.card,
                  borderColor: isCurrentPlaying ? "#d97706" : "#e2e8f0",
                  boxShadow: isCurrentPlaying 
                    ? "0 12px 30px rgba(217, 119, 6, 0.25)" 
                    : "0 4px 20px rgba(0,0,0,0.03)"
                }}
                onClick={() => handleNavigateToSurah(surahNumber)}
              >
                <div style={{
                  ...homeStyles.cardTopLine,
                  backgroundColor: isCurrentPlaying ? "#d97706" : "#047857"
                }} />
                <div>
                  <div style={homeStyles.cardHeader}>
                    <div style={homeStyles.numberBadge}>
                      {surahNumber}
                    </div>
                    <div style={homeStyles.placeBadge}>
                      {isMeccan ? "🕌 Makka" : "🏛️ Madina"}
                    </div>
                  </div>

                  <div style={homeStyles.titleRow}>
                    <div>
                      <h3 style={homeStyles.simpleTitle}>{simpleName}</h3>
                      <p style={homeStyles.translatedTitle}>{translatedName}</p>
                    </div>
                    <h2 style={homeStyles.arabicTitle}>{arabicName}</h2>
                  </div>

                  <div style={homeStyles.metaRow}>
                    <span style={homeStyles.verseBadge}>
                      📖 Aya <strong>{versesCount}</strong>
                    </span>
                  </div>
                </div>

                <div style={homeStyles.actionRow}>
                  <button
                    onClick={(e) => handleQuickPlay(e, surahNumber)}
                    style={{
                      ...homeStyles.quickPlayBtn,
                      backgroundColor: isCurrentPlaying ? "#d97706" : "#ecfdf5",
                      color: isCurrentPlaying ? "#ffffff" : "#047857"
                    }}
                    title={`Sikiliza sauti ya ${activeReciterName}`}
                  >
                    {isCurrentPlaying ? "⏸️ Sitisha" : "🎧 Sikiliza"}
                  </button>
                  <button
                    onClick={() => handleNavigateToSurah(surahNumber)}
                    style={homeStyles.openSurahBtn}
                  >
                    Soma Sura ➡️
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredSurahs.length === 0 && (
          <div style={homeStyles.emptyState}>
            <div style={{ fontSize: "40px" }}>🔍</div>
            <h3 style={{ color: "#064e3b", margin: "10px 0 5px 0" }}>Hakuna Sura Iliyopatikana</h3>
            <p style={{ color: "#64748b", margin: 0 }}>
              Jaribu kutafuta kwa neno lingine au namba tofauti ya Sura.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

//==========================================
// 🎨 ULTRA GLOWING STYLES OBJECT
// ==========================================
const homeStyles = {
  container: { backgroundColor: "#06131e", minHeight: "100vh", padding: "30px 16px 80px 16px", fontFamily: "'Inter', sans-serif" },
  innerContainer: { maxWidth: "1200px", margin: "0 auto" },
  heroHeader: { 
    background: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #0f5132 100%)", 
    color: "#ffffff", 
    padding: "45px 24px 30px 24px", 
    borderRadius: "28px", 
    textAlign: "center", 
    boxShadow: "0 20px 50px rgba(4, 120, 87, 0.3)", 
    borderBottom: "6px solid #f59e0b", 
    marginBottom: "36px", 
    position: "relative" 
  },
  badgeTop: { display: "inline-block", backgroundColor: "rgba(255, 255, 255, 0.15)", backdropFilter: "blur(10px)", color: "#fef3c7", padding: "6px 18px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", letterSpacing: "1px", marginBottom: "16px" },
  bismillah: { fontSize: "32px", color: "#fef3c7", margin: "0 0 10px 0", fontFamily: "'Amiri', serif" },
  mainHeading: { fontSize: "44px", margin: "0 0 10px 0", fontWeight: "800", letterSpacing: "-0.5px" },
  quoteText: { fontSize: "15px", color: "#a7f3d0", fontStyle: "italic", maxWidth: "600px", margin: "0 auto 28px auto", lineHeight: "1.6" },
  searchContainer: { position: "relative", maxWidth: "560px", margin: "0 auto", display: "flex", alignItems: "center" },
  searchIcon: { position: "absolute", left: "18px", fontSize: "18px" },
  searchInput: { width: "100%", padding: "16px 45px 16px 50px", borderRadius: "30px", border: "2px solid #f59e0b", fontSize: "16px", outline: "none", backgroundColor: "#0f172a", color: "#ffffff", boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)", fontWeight: "500" },
  clearSearchBtn: { position: "absolute", right: "16px", background: "none", border: "none", color: "#94a3b8", fontSize: "16px", cursor: "pointer" },
  settingsControlBar: { marginTop: "24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" },
  activePillsContainer: { display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" },
  activePill: { backgroundColor: "rgba(255, 255, 255, 0.15)", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", color: "#ffffff" },
  toggleSettingsBtn: { backgroundColor: "#f59e0b", color: "#000", border: "none", padding: "10px 22px", borderRadius: "20px", fontWeight: "700", fontSize: "13px", cursor: "pointer", boxShadow: "0 4px 15px rgba(245, 158, 11, 0.4)" },
  settingsPanelCard: { backgroundColor: "#0f1c2e", color: "#ffffff", borderRadius: "20px", padding: "24px", maxWidth: "700px", margin: "20px auto 0 auto", textAlign: "left", boxShadow: "0 20px 40px rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)" },
  settingsTitle: { margin: "0 0 16px 0", fontSize: "18px", color: "#34d399", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "10px" },
  settingsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  settingGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  settingGroupFull: { gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" },
  settingLabel: { fontSize: "13px", fontWeight: "700", color: "#cbd5e1" },
  settingSelect: { padding: "10px 14px", borderRadius: "10px", border: "1px solid #334155", fontSize: "14px", outline: "none", backgroundColor: "#1e293b", color: "#fff" },
  modesGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px" },
  modeCardBtn: { padding: "12px 10px", borderRadius: "12px", border: "2px solid", cursor: "pointer", textAlign: "center", transition: "all 0.2s ease" },
  statsBar: { marginTop: "20px", fontSize: "13px", color: "#a7f3d0" },
  activePlayingBanner: { backgroundColor: "#d97706", color: "#ffffff", padding: "12px 24px", borderRadius: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", boxShadow: "0 10px 25px rgba(217, 119, 6, 0.4)" },
  stopAudioBtn: { backgroundColor: "#000000", color: "#ffffff", border: "none", padding: "8px 16px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "22px" },
  card: { backgroundColor: "#0b1726", borderRadius: "20px", padding: "24px", border: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", cursor: "pointer", transition: "all 0.25s ease" },
  cardTopLine: { position: "absolute", top: 0, left: 0, right: 0, height: "4px", borderTopLeftRadius: "20px", borderTopRightRadius: "20px" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  numberBadge: { backgroundColor: "rgba(245, 158, 11, 0.2)", color: "#fbbf24", fontWeight: "800", width: "40px", height: "40px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", border: "1px solid #f59e0b" },
  placeBadge: { backgroundColor: "rgba(255,255,255,0.08)", color: "#cbd5e1", padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" },
  titleRow: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px" },
  simpleTitle: { margin: 0, color: "#ffffff", fontSize: "20px", fontWeight: "700" },
  translatedTitle: { margin: "4px 0 0 0", color: "#94a3b8", fontSize: "13px" },
  arabicTitle: { margin: 0, color: "#fbbf24", fontSize: "28px", fontFamily: "'Amiri', serif" },
  metaRow: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" },
  verseBadge: { fontSize: "13px", color: "#34d399", backgroundColor: "rgba(52, 211, 153, 0.15)", padding: "4px 10px", borderRadius: "8px", fontWeight: "500" },
  actionRow: { display: "flex", gap: "10px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "16px" },
  quickPlayBtn: { flex: 1.2, padding: "10px", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "700", cursor: "pointer", transition: "all 0.2s ease" },
  openSurahBtn: { flex: 1, padding: "10px", backgroundColor: "rgba(255,255,255,0.1)", color: "#ffffff", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: "700", cursor: "pointer" },
  emptyState: { textAlign: "center", padding: "60px 20px", backgroundColor: "#0b1726", borderRadius: "20px", marginTop: "20px", border: "1px solid rgba(255,255,255,0.1)" },
  loadingWrapper: { minHeight: "100vh", backgroundColor: "#06131e", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" },
  loadingCard: { backgroundColor: "#0b1726", padding: "40px", borderRadius: "24px", textAlign: "center", maxWidth: "400px", width: "100%", boxShadow: "0 20px 40px rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)" },
  quranPulseIcon: { fontSize: "56px", marginBottom: "12px" },
  loadingTitle: { color: "#34d399", margin: "0 0 6px 0", fontSize: "26px", fontFamily: "'Amiri', serif" },
  loadingSub: { color: "#94a3b8", fontSize: "14px", margin: "0 0 20px 0" },
  progressBarWrapper: { width: "100%", height: "6px", backgroundColor: "#1e293b", borderRadius: "10px", overflow: "hidden" },
  progressBarFill: { width: "60%", height: "100%", backgroundColor: "#34d399", borderRadius: "10px" },
  retryBtn: { padding: "12px 24px", backgroundColor: "#065f46", color: "#ffffff", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }
};

export default QuranHome;
