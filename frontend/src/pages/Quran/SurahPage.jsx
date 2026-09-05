// src/pages/SurahPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFullSurah } from "../../services/quranApi";

// ORODHA YA WASOMAJI (RECITERS)
const RECITERS = [
  {
    id: "mishari_al_afasy",
    name: "Mishary Rashid Alafasy",
    subtext: "Murattal • Hafs",
    url: (surah, ayah) => `https://everyayah.com/data/Alafasy_128kbps/${String(surah).padStart(3, "0")}${String(ayah).padStart(3, "0")}.mp3`
  },
  {
    id: "abdurrahim_as_sudais",
    name: "Abdul Rahman Al-Sudais",
    subtext: "Murattal • Makkah",
    url: (surah, ayah) => `https://everyayah.com/data/Sudais_192kbps/${String(surah).padStart(3, "0")}${String(ayah).padStart(3, "0")}.mp3`
  },
  {
    id: "abu_bakr_shatri",
    name: "Abu Bakr Al-Shatri",
    subtext: "Murattal • Soft",
    url: (surah, ayah) => `https://everyayah.com/data/Abu_Bakr_Ash-Shaatree_128kbps/${String(surah).padStart(3, "0")}${String(ayah).padStart(3, "0")}.mp3`
  },
  {
    id: "maher_al_muaiqly",
    name: "Maher Al-Muaiqly",
    subtext: "Murattal • Clear",
    url: (surah, ayah) => `https://everyayah.com/data/Maher_AlMuaiqly_64kbps/${String(surah).padStart(3, "0")}${String(ayah).padStart(3, "0")}.mp3`
  },
  {
    id: "saad_el_ghamidi",
    name: "Sa'ad Al-Ghamdi",
    subtext: "Murattal • Melodic",
    url: (surah, ayah) => `https://everyayah.com/data/Ghamadi_40kbps/${String(surah).padStart(3, "0")}${String(ayah).padStart(3, "0")}.mp3`
  }
];
// 🎨 ISLAMIC BACKGROUND THEMES (MANDHARI 5 ZA KIISLAMU)
const THEMES = {
  emerald: {
    id: "emerald",
    name: "🌲 Emerald Masjid",
    bg: "#064e3b",
    cardBg: "#047857",
    cardText: "#ffffff",
    primary: "#059669",
    accent: "#fbbf24",
    text: "#f0fdf4"
  },
  midnight: {
    id: "midnight",
    name: "🌙 Midnight Mosque",
    bg: "#0b132b",
    cardBg: "#1c2541",
    cardText: "#ffffff",
    primary: "#3a506b",
    accent: "#6fffe9",
    text: "#edf2f4"
  },
  parchment: {
    id: "parchment",
    name: "📜 Classic Parchment",
    bg: "#fcf5e5",
    cardBg: "#f5e6ca",
    cardText: "#2c1810",
    primary: "#8c6d46",
    accent: "#b45309",
    text: "#3d2314"
  },
  slate: {
    id: "slate",
    name: "🏛️ Royal Slate",
    bg: "#1e293b",
    cardBg: "#334155",
    cardText: "#f8fafc",
    primary: "#475569",
    accent: "#38bdf8",
    text: "#f1f5f9"
  },
  dark: {
    id: "dark",
    name: "🌑 Dark Mode",
    bg: "#090d16",
    cardBg: "#131c2e",
    cardText: "#f8fafc",
    primary: "#1d2a44",
    accent: "#eab308",
    text: "#e2e8f0"
  }
};

const ARABIC_FONTS = [
  { id: "'Amiri', serif", name: "Amiri Naskh" },
  { id: "'Scheherazade New', serif", name: "Scheherazade" },
  { id: "'Lateef', cursive", name: "Lateef Soft" },
  { id: "'Traditional Arabic', serif", name: "Traditional" }
];
// ORODHA YA LUGHA ZA TAFSIRI
const TRANSLATION_LANGUAGES = [
  { code: "sw", name: "🇹ℤ Kiswahili", translator: "Ali Muhsin Al-Barwani" },
  { code: "en", name: "🇬🇧 English", translator: "Saheeh International" }
];

// PLAYBACK MODES
const PLAYBACK_MODES = [
  { id: "all", label: "🌟 Vyote Pamoja", desc: "Recitation + Tafsiri + Word Highlighting" },
  { id: "audio_only", label: "🎧 Sauti Tu", desc: "Kiarabu Pekee Bila Tafsiri" },
  { id: "audio_translation", label: "📚 Sauti + Tafsiri", desc: "Sauti na Tafsiri Ya Text" },
  { id: "audio_highlight", label: "🖍️ Sauti + Highlighting", desc: "Word-by-Word Highlighting" }
];

const SurahPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Data States
  const [surahData, setSurahData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fontSize, setFontSize] = useState(32);

  // Dynamic User Notes State
  const [userNotes, setUserNotes] = useState({});

  // PREFERENCES STATE (READ & PERSIST LOCALSTORAGE)
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

  // Audio & Highlight Control States
  const [currentVerseIndex, setCurrentVerseIndex] = useState(null);
  const [activeWordIndex, setActiveWordIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [playTranslationVoice, setPlayTranslationVoice] = useState(false);

  // Audio Ref & Scroll Ref
  const audioRef = useRef(null);
  const verseRefs = useRef({});

  // Save Settings Changes
  useEffect(() => {
    localStorage.setItem("quran_reciter", selectedReciter);
    localStorage.setItem("quran_language", selectedLanguage);
    localStorage.setItem("quran_playback_mode", playbackMode);
  }, [selectedReciter, selectedLanguage, playbackMode]);

  // Load Surah Data
  useEffect(() => {
    const fetchSurah = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getFullSurah(id);
        setSurahData(data);

        const savedNotes = localStorage.getItem(`quran_notes_${id}`);
        if (savedNotes) {
          setUserNotes(JSON.parse(savedNotes));
        }
      } catch (err) {
        console.error("Error loading Surah:", err);
        setError("Imeshindikana kupakua Sura hii. Tafadhali angalia mtandao wako.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSurah();
  }, [id]);

  const verses = surahData?.verses || surahData?.ayahs || [];
  const chapter = surahData?.chapter || surahData || {};

  // Auto-Scroll to Active Verse
  useEffect(() => {
    if (currentVerseIndex !== null && verseRefs.current[currentVerseIndex]) {
      verseRefs.current[currentVerseIndex].scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  }, [currentVerseIndex]);

  // Time update for Audio & Word Highlighting Simulation
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const cur = audioRef.current.currentTime;
      const dur = audioRef.current.duration || 1;
      setCurrentTime(cur);
      setDuration(dur);

      // Simulated Word-by-Word Highlighting based on audio progress ratio
      if (playbackMode === "all" || playbackMode === "audio_highlight") {
        const currentVerse = verses[currentVerseIndex];
        const arabicText = currentVerse?.text_uthmani || currentVerse?.text_arabic || currentVerse?.text || "";
        const wordsArray = arabicText.split(" ");
        if (wordsArray.length > 0) {
          const wordIndex = Math.floor((cur / dur) * wordsArray.length);
          setActiveWordIndex(Math.min(wordIndex, wordsArray.length - 1));
        }
      }
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (currentVerseIndex === null && verses.length > 0) {
      playVerse(0);
      return;
    }
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      window.speechSynthesis.cancel();
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const playVerse = (index) => {
    if (index < 0 || index >= verses.length) return;

    window.speechSynthesis.cancel();
    setCurrentVerseIndex(index);
    setActiveWordIndex(0);

    const ayahNumber = index + 1;
    const currentReciterObj = RECITERS.find((r) => r.id === selectedReciter) || RECITERS[0];
    const audioUrl = currentReciterObj.url(id, ayahNumber);

    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error("Playback error fallback:", err);
          // Fallback audio url
          const verse = verses[index];
          const fallbackUrl = verse?.audioUrl || (verse?.audio?.url ? `https://audio.quran.com/${verse.audio.url}` : "");
          if (fallbackUrl) {
            audioRef.current.src = fallbackUrl;
            audioRef.current.play();
            setIsPlaying(true);
          }
        });
    }
  };

  const handleAudioEnded = () => {
    const currentVerse = verses[currentVerseIndex];
    const translation = getVerseTranslation(currentVerse);

    if (playTranslationVoice && translation && (playbackMode === "all" || playbackMode === "audio_translation")) {
      const cleanText = translation.replace(/<[^>]*>?/gm, "");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = selectedLanguage === "sw" ? "sw-TZ" : "en-US";
      utterance.onend = () => moveToNextVerse();
      window.speechSynthesis.speak(utterance);
    } else {
      moveToNextVerse();
    }
  };

  const moveToNextVerse = () => {
    if (currentVerseIndex < verses.length - 1) {
      playVerse(currentVerseIndex + 1);
    } else {
      setIsPlaying(false);
      setCurrentVerseIndex(null);
      setActiveWordIndex(null);
    }
  };

  const getVerseTranslation = (verse) => {
    if (!verse) return "";
    if (selectedLanguage === "en") {
      return verse.translation_en || verse.englishTranslation || verse.translations?.[1]?.text || verse.translations?.[0]?.text || verse.translation || "";
    }
    return verse.translation_sw || verse.swahiliTranslation || verse.translations?.[0]?.text || verse.translation || "";
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) audioRef.current.currentTime = newTime;
  };

  const skipForward = () => {
    if (audioRef.current) audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 5, duration);
  };

  const skipBackward = () => {
    if (audioRef.current) audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 5, 0);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (audioRef.current) audioRef.current.volume = val;
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const speakTranslation = (text) => {
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/<[^>]*>?/gm, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = selectedLanguage === "sw" ? "sw-TZ" : "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const handleNoteChange = (verseKey, text) => {
    const updated = { ...userNotes, [verseKey]: text };
    setUserNotes(updated);
    localStorage.setItem(`quran_notes_${id}`, JSON.stringify(updated));
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}>📖</div>
        <h2 style={styles.loadingText}>Inapakia Mfumo Wa Kisasa Wa Qur'an...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <h2>⚠️ Imeshindikana</h2>
        <p>{error}</p>
        <button style={styles.primaryButton} onClick={() => navigate("/quran")}>
          ⬅️ Rudi Kwenye Orodha
        </button>
      </div>
    );
  }

  const activeReciterName = RECITERS.find((r) => r.id === selectedReciter)?.name || "Mishary Alafasy";

  return (
    <div style={styles.container}>
      <audio 
        ref={audioRef} 
        onTimeUpdate={handleTimeUpdate} 
        onEnded={handleAudioEnded} 
      />

      {/* HEADER & GLOBAL CONTROL BAR */}
      <header style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate("/quran")}>
          ⬅️ Rudi Kwenye Orodha
        </button>

        <div style={styles.headerRightGroup}>
          <button 
            style={styles.settingsToggleBtn}
            onClick={() => setShowSettingsPanel(!showSettingsPanel)}
          >
            {showSettingsPanel ? "✖ Funga Mipangilio" : "⚙️ Mipangilio"}
          </button>

          <div style={styles.controlsGroup}>
            <span style={styles.label}>Maandishi:</span>
            <button style={styles.fontBtn} onClick={() => setFontSize((p) => Math.min(p + 2, 48))}>A+</button>
            <button style={styles.fontBtn} onClick={() => setFontSize((p) => Math.max(p - 2, 20))}>A-</button>
          </div>
        </div>
      </header>

      {/* EXPANDABLE QUICK SETTINGS PANEL */}
      {showSettingsPanel && (
        <div style={styles.settingsPanelCard}>
          <h3 style={styles.settingsTitle}>⚙️ Mipangilio Ya Kusoma na Kusikiliza</h3>
          
          <div style={styles.settingsGrid}>
            <div style={styles.settingGroup}>
              <label style={styles.settingLabel}>🎧 Msomaji (Reciter):</label>
              <select
                value={selectedReciter}
                onChange={(e) => setSelectedReciter(e.target.value)}
                style={styles.settingSelect}
              >
                {RECITERS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.subtext})
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.settingGroup}>
              <label style={styles.settingLabel}>🌐 Lugha Ya Tafsiri:</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                style={styles.settingSelect}
              >
                {TRANSLATION_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.name} - {l.translator}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.settingGroupFull}>
              <label style={styles.settingLabel}>📱 Live Display Mode:</label>
              <div style={styles.modesGrid}>
                {PLAYBACK_MODES.map((mode) => {
                  const isSelected = playbackMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setPlaybackMode(mode.id)}
                      style={{
                        ...styles.modeCardBtn,
                        borderColor: isSelected ? "#047857" : "#cbd5e1",
                        backgroundColor: isSelected ? "#ecfdf5" : "#ffffff",
                        color: isSelected ? "#064e3b" : "#334155"
                      }}
                    >
                      <div style={{ fontWeight: "700", fontSize: "13px" }}>{mode.label}</div>
                      <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
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

      {/* BANNER SECTION */}
      <section style={styles.banner}>
        <p style={styles.bismillah}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        <h1 style={styles.surahTitleArabic}>{chapter.name_arabic || "القرآن الكريم"}</h1>
        <h2 style={styles.surahTitleEnglish}>{chapter.name_simple || chapter.name || ""}</h2>

        <div style={styles.badgeRow}>
          <span style={styles.infoBadge}>🕌 {chapter.revelation_place === "makkah" ? "Makka" : "Madina"}</span>
          <span style={styles.infoBadge}>📖 Aya: {chapter.verses_count || verses.length}</span>
          <span style={styles.infoBadge}>🎙️ {activeReciterName}</span>
        </div>

        {(playbackMode === "all" || playbackMode === "audio_translation") && (
          <div style={styles.translationToggleBox}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>
              <input 
                type="checkbox" 
                checked={playTranslationVoice} 
                onChange={(e) => setPlayTranslationVoice(e.target.checked)} 
              />
              🔊 Soma na Sauti ya Tafsiri ({selectedLanguage === "sw" ? "Kiswahili" : "English"}) Baada ya Aya
            </label>
          </div>
        )}
      </section>

      {/* VERSES LIST */}
      <main style={styles.versesContainer}>
        {verses.map((verse, idx) => {
          const verseKey = verse.verse_key || `${id}:${idx + 1}`;
          const isActive = currentVerseIndex === idx;
          const translationText = getVerseTranslation(verse);
          const arabicText = verse.text_uthmani || verse.text_arabic || verse.text || "";
          const arabicWords = arabicText.split(" ");

          const showTranslation = playbackMode === "all" || playbackMode === "audio_translation";
          const allowHighlighting = (playbackMode === "all" || playbackMode === "audio_highlight") && isActive;

          return (
            <div
              key={verse.id || verseKey}
              ref={(el) => (verseRefs.current[idx] = el)}
              style={{
                ...styles.verseCard,
                backgroundColor: isActive ? "#fef3c7" : "#ffffff",
                borderColor: isActive ? "#d97706" : "#e2e8f0",
                borderLeft: isActive ? "8px solid #d97706" : "1px solid #e2e8f0",
                transform: isActive ? "scale(1.01)" : "scale(1)",
                boxShadow: isActive ? "0 10px 25px rgba(217, 119, 6, 0.2)" : "0 4px 12px rgba(0,0,0,0.03)"
              }}
            >
              {/* VERSE CARD HEADER */}
              <div style={styles.verseHeader}>
                <span style={{
                  ...styles.verseBadge,
                  backgroundColor: isActive ? "#d97706" : "#ecfdf5",
                  color: isActive ? "#ffffff" : "#047857"
                }}>
                  Aya {verseKey}
                </span>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    style={styles.actionBtn}
                    onClick={() => playVerse(idx)}
                  >
                    {isActive && isPlaying ? "⏸️ Sitisha" : "▶️ Cheza Aya"}
                  </button>

                  {translationText && showTranslation && (
                    <button
                      style={{ ...styles.actionBtn, backgroundColor: "#0284c7" }}
                      onClick={() => speakTranslation(translationText)}
                    >
                      🗣️ Sikiliza Tafsiri
                    </button>
                  )}
                </div>
              </div>

              {/* ARABIC TEXT WITH LIVE WORD-BY-WORD HIGHLIGHTING */}
              <div style={{
                ...styles.arabicTextContainer,
                fontSize: `${fontSize}px`
              }}>
                {arabicWords.map((word, wIdx) => {
                  const isWordActive = allowHighlighting && activeWordIndex === wIdx;
                  return (
                    <span
                      key={wIdx}
                      style={{
                        ...styles.arabicWord,
                        backgroundColor: isWordActive ? "#f59e0b" : "transparent",
                        color: isWordActive ? "#ffffff" : (isActive ? "#92400e" : "#0f172a"),
                        borderRadius: "6px",
                        padding: isWordActive ? "2px 6px" : "0 2px",
                        fontWeight: isWordActive || isActive ? "bold" : "normal",
                        transition: "all 0.15s ease"
                      }}
                    >
                      {word}{" "}
                    </span>
                  );
                })}
              </div>

              {/* TRANSLATION DISPLAY */}
              {showTranslation && (
                translationText ? (
                  <p style={styles.translationText}>
                    {translationText.replace(/<[^>]*>?/gm, "")}
                  </p>
                ) : (
                  <p style={{ ...styles.translationText, color: "#94a3b8" }}>
                    (Tafsiri inapakia...)
                  </p>
                )
              )}

              {/* NOTES / PRACTICE BOX */}
              <div style={styles.noteBox}>
                <label style={styles.noteLabel}>✍️ Andika Kumbukumbu / Mazoezi ya Aya Hii:</label>
                <textarea
                  style={styles.textarea}
                  placeholder="Andika maelezo au hifadhi ya aya hii hapa..."
                  value={userNotes[verseKey] || ""}
                  onChange={(e) => handleNoteChange(verseKey, e.target.value)}
                />
              </div>
            </div>
          );
        })}
      </main>

      {/* FLOATING AUDIO PLAYER CONTROL */}
      <div style={styles.floatingPlayer}>
        <div style={styles.progressContainer}>
          <span style={styles.timeText}>{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            style={styles.progressBar}
          />
          <span style={styles.timeText}>{formatTime(duration)}</span>
        </div>

        <div style={styles.playerControlsRow}>
          <div style={styles.nowPlayingInfo}>
            <span style={styles.nowPlayingTitle}>
              {currentVerseIndex !== null 
                ? `Aya ${verses[currentVerseIndex]?.verse_key || currentVerseIndex + 1} • ${activeReciterName}` 
                : "Chagua Aya Au Bonyeza Play"}
            </span>
          </div>

          <div style={styles.mainButtonsGroup}>
            <button style={styles.playerIconBtn} onClick={() => playVerse(currentVerseIndex - 1)}>⏮️</button>
            <button style={styles.playerIconBtn} onClick={skipBackward}>⏪ 5s</button>
            
            <button style={styles.playPauseCircleBtn} onClick={togglePlay}>
              {isPlaying ? "⏸️" : "▶️"}
            </button>

            <button style={styles.playerIconBtn} onClick={skipForward}>5s ⏩</button>
            <button style={styles.playerIconBtn} onClick={() => playVerse(currentVerseIndex + 1)}>⏭️</button>
          </div>

          <div style={styles.volumeContainer}>
            <button style={styles.muteBtn} onClick={toggleMute}>
              {isMuted || volume === 0 ? "🔇" : "🔊"}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              style={styles.volumeBar}
            />
          </div>
        </div>
      </div>

      <footer style={styles.footer}>
        <p style={styles.footerArabic}>روضة الأطفال - حديقة القرآن الكريم</p>
        <p style={styles.footerText}>Raudhwat Al Atfal - World Class Digital Quran Platform</p>
      </footer>
    </div>
  );
};

// ===============================
// PREMIUM STYLES (Inline CSS)
// ===============================
const styles = {
  container: { backgroundColor: "#f8fafc", minHeight: "100vh", padding: "24px 16px 140px 16px", fontFamily: "'Inter', sans-serif" },
  loadingContainer: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh" },
  spinner: { fontSize: "60px", marginBottom: "15px" },
  loadingText: { color: "#064e3b", fontWeight: "600" },
  errorContainer: { textAlign: "center", padding: "40px", backgroundColor: "#fff", borderRadius: "16px", maxWidth: "500px", margin: "50px auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "960px", margin: "0 auto 24px auto", flexWrap: "wrap", gap: "12px" },
  backButton: { padding: "10px 20px", backgroundColor: "#064e3b", color: "#ffffff", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600" },
  headerRightGroup: { display: "flex", alignItems: "center", gap: "10px" },
  settingsToggleBtn: { backgroundColor: "#fbbf24", color: "#78350f", border: "none", padding: "8px 16px", borderRadius: "10px", fontWeight: "700", fontSize: "13px", cursor: "pointer" },
  controlsGroup: { display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#ffffff", padding: "6px 14px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
  label: { color: "#4b5563", fontSize: "13px", fontWeight: "600" },
  fontBtn: { padding: "6px 14px", backgroundColor: "#ecfdf5", color: "#047857", border: "1px solid #a7f3d0", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" },
  settingsPanelCard: { backgroundColor: "#ffffff", color: "#0f172a", borderRadius: "20px", padding: "20px", maxWidth: "960px", margin: "0 auto 24px auto", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0" },
  settingsTitle: { margin: "0 0 16px 0", fontSize: "16px", color: "#064e3b", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" },
  settingsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  settingGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  settingGroupFull: { gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "8px", marginTop: "6px" },
  settingLabel: { fontSize: "13px", fontWeight: "700", color: "#334155" },
  settingSelect: { padding: "10px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", backgroundColor: "#f8fafc" },
  modesGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "8px" },
  modeCardBtn: { padding: "10px 8px", borderRadius: "10px", border: "2px solid", cursor: "pointer", textAlign: "center", transition: "all 0.2s ease" },
  banner: { background: "linear-gradient(135deg, #064e3b 0%, #047857 100%)", color: "#ffffff", padding: "36px 24px", borderRadius: "24px", textAlign: "center", maxWidth: "960px", margin: "0 auto 32px auto", boxShadow: "0 10px 30px rgba(6, 78, 59, 0.25)" },
  bismillah: { fontSize: "28px", color: "#fef08a", margin: "0 0 16px 0", fontFamily: "'Amiri', serif" },
  surahTitleArabic: { fontSize: "48px", margin: "10px 0", color: "#fbbf24", fontFamily: "'Amiri', serif" },
  surahTitleEnglish: { fontSize: "22px", margin: "5px 0 16px 0", fontWeight: "600" },
  badgeRow: { display: "flex", justifyContent: "center", gap: "12px", marginBottom: "20px", flexWrap: "wrap" },
  infoBadge: { backgroundColor: "rgba(255, 255, 255, 0.15)", padding: "6px 16px", borderRadius: "20px", fontSize: "13px", color: "#f0fdf4" },
  translationToggleBox: { backgroundColor: "rgba(0,0,0,0.2)", display: "inline-block", padding: "10px 20px", borderRadius: "12px" },
  versesContainer: { maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" },
  verseCard: { padding: "28px", borderRadius: "20px", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" },
  verseHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  verseBadge: { padding: "6px 14px", borderRadius: "10px", fontSize: "13px", fontWeight: "700" },
  actionBtn: { backgroundColor: "#059669", color: "#ffffff", border: "none", padding: "8px 16px", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: "600" },
  arabicTextContainer: { textAlign: "right", direction: "rtl", lineHeight: "2.4", fontFamily: "'Amiri', serif", margin: "20px 0 16px 0", wordWrap: "break-word" },
  arabicWord: { display: "inline-block" },
  translationText: { color: "#334155", fontSize: "16px", lineHeight: "1.7", borderTop: "1px solid #f1f5f9", paddingTop: "16px", margin: 0 },
  noteBox: { marginTop: "18px", paddingTop: "14px", borderTop: "1px dashed #cbd5e1" },
  noteLabel: { fontSize: "13px", color: "#64748b", fontWeight: "600", display: "block", marginBottom: "6px" },
  textarea: { width: "100%", height: "60px", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", resize: "vertical", fontFamily: "inherit" },
  floatingPlayer: { position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)", width: "92%", maxWidth: "960px", backgroundColor: "#0f172a", color: "#ffffff", borderRadius: "20px", padding: "16px 24px", boxShadow: "0 20px 40px rgba(0,0,0,0.4)", zIndex: 1000, border: "1px solid #334155" },
  progressContainer: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" },
  timeText: { fontSize: "12px", color: "#94a3b8", fontFamily: "monospace" },
  progressBar: { flex: 1, accentColor: "#10b981", cursor: "pointer" },
  playerControlsRow: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" },
  nowPlayingInfo: { flex: "1 1 200px" },
  nowPlayingTitle: { fontSize: "14px", fontWeight: "600", color: "#f1f5f9" },
  mainButtonsGroup: { display: "flex", alignItems: "center", gap: "12px" },
  playerIconBtn: { backgroundColor: "#1e293b", color: "#e2e8f0", border: "none", padding: "8px 12px", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: "600" },
  playPauseCircleBtn: { backgroundColor: "#10b981", color: "#ffffff", border: "none", width: "48px", height: "48px", borderRadius: "50%", cursor: "pointer", fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(16, 185, 129, 0.4)" },
  volumeContainer: { display: "flex", alignItems: "center", gap: "8px", flex: "1 1 150px", justifyContent: "flex-end" },
  muteBtn: { background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#fff" },
  volumeBar: { width: "80px", accentColor: "#10b981", cursor: "pointer" },
  footer: { textAlign: "center", marginTop: "60px", padding: "30px 0" },
  footerArabic: { fontSize: "24px", color: "#064e3b", margin: 0, fontFamily: "'Amiri', serif", fontWeight: "bold" },
  footerText: { fontSize: "14px", color: "#64748b", marginTop: "6px" },
  primaryButton: { marginTop: "15px", padding: "10px 20px", backgroundColor: "#064e3b", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }
};
export default SurahPage;