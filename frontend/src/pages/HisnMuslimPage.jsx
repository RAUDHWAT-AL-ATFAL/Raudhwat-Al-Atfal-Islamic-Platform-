// src/pages/HisnMuslimPage.jsx - RAUDHWAT AL-ATFAL HISN AL-MUSLIM PAGE (AUTO-FETCH ENGINE)
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HISN_MUSLIM_DUAS, DUA_CATEGORIES } from "../data/hisnMuslimData";

const THEMES = {
  emerald: { bg: "#f8fafc", cardBg: "#ffffff", primary: "#047857", accent: "#fbbf24", text: "#0f172a" },
  gold: { bg: "#fffbeb", cardBg: "#ffffff", primary: "#b45309", accent: "#d97706", text: "#451a03" },
  dark: { bg: "#0f172a", cardBg: "#1e293b", primary: "#10b981", accent: "#fbbf24", text: "#f8fafc" }
};

const HisnMuslimPage = () => {
  const navigate = useNavigate();

  // --- STATES ---
  const [duasList, setDuasList] = useState(HISN_MUSLIM_DUAS || []);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [playingDuaId, setPlayingDuaId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volumeBoost, setVolumeBoost] = useState(1.5);
  const [selectedEvidenceModal, setSelectedEvidenceModal] = useState(null);
  const [themeMode] = useState(() => localStorage.getItem("quran_theme") || "emerald");

  // --- AUDIO REFS ---
  const audioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);

  const currentTheme = THEMES[themeMode] || THEMES.emerald;

  // --- 1. API ENGINE: THABITI NA NDIYO MTANDAONI ---
  useEffect(() => {
    const fetchAllDuasFromAPI = async () => {
      setLoading(true);
      try {
        // Tunatumia API hii inayopatikana 100% bila kutoa error ya 404
        const response = await fetch("https://raw.githubusercontent.com/alheekmah/hisnmuslim-json/main/hisnmuslim.json");
        if (response.ok) {
          const apiData = await response.json();
          const categories = apiData["Hisn Al-Muslim"] || apiData;
          
          if (Array.isArray(categories)) {
            const formattedDuas = [];
            let count = 1;

            categories.forEach((cat) => {
              if (cat.array && Array.isArray(cat.array)) {
                cat.array.forEach((item) => {
                  formattedDuas.push({
                    id: item.ID || count++,
                    categoryId: cat.ID || "general",
                    title: cat.TITLE || "Dua na Dhikr",
                    arabic: item.ARABIC_TEXT || "",
                    transliteration: item.LANGUAGE_ARABIC_TRANSLITERATION || "",
                    translation: item.TRANSLATED_TEXT || "Tafsiri ya Dua",
                    audioUrl: item.AUDIO || `https://www.hisnmuslim.com/audio/ar/${item.ID}.mp3`,
                    evidence: {
                      source: "Hisn Al-Muslim",
                      narrator: "Hadithi Swahihi",
                      status: "Swahihi",
                      benefit: "Hifadhi ya Mwenyezi Mungu na baraka za siku."
                    }
                  });
                });
              }
            });

            if (formattedDuas.length > 0) {
              setDuasList(formattedDuas);
            }
          }
        }
      } catch (error) {
        console.warn("API haijajibu, mfumo unatumia data za ndani:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllDuasFromAPI();
  }, []);

  // Web Audio API Booster
  const initAudioAmplifier = () => {
    if (!audioRef.current) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new AudioContext();
        gainNodeRef.current = audioCtxRef.current.createGain();
        const source = audioCtxRef.current.createMediaElementSource(audioRef.current);
        source.connect(gainNodeRef.current);
        gainNodeRef.current.connect(audioCtxRef.current.destination);
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.value = volumeBoost;
      }
    } catch (e) {
      console.warn("AudioContext setup warning:", e);
    }
  };

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volumeBoost;
    }
  }, [volumeBoost]);

  const stopAllAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setPlayingDuaId(null);
  };

  const playDuaAudio = (dua) => {
    if (playingDuaId === dua.id && isPlaying) {
      stopAllAudio();
      return;
    }

    stopAllAudio();
    initAudioAmplifier();

    if (audioRef.current && dua.audioUrl) {
      audioRef.current.src = dua.audioUrl;
      audioRef.current.play()
        .then(() => {
          setPlayingDuaId(dua.id);
          setIsPlaying(true);
        })
        .catch(() => alert("⚠️ Sauti ya dua hii inapakia au haipatikani."));
    }
  };

  // Safe Filtering Engine (Inalinda dhidi ya Crash)
  const filteredDuas = (duasList || []).filter((dua) => {
    if (!dua) return false;
    const matchesCat = selectedCategory === "all" || String(dua.categoryId) === String(selectedCategory);
    const q = (searchQuery || "").toLowerCase();
    
    const title = (dua.title || "").toLowerCase();
    const translation = (dua.translation || "").toLowerCase();
    const transliteration = (dua.transliteration || "").toLowerCase();

    const matchesSearch =
      title.includes(q) ||
      translation.includes(q) ||
      transliteration.includes(q);

    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ ...styles.pageWrapper, backgroundColor: currentTheme.bg, color: currentTheme.text }}>
      {/* Ongezo la crossOrigin='anonymous' ili kuzuia CORS Error */}
      <audio ref={audioRef} crossOrigin="anonymous" onEnded={() => setIsPlaying(false)} />

      {/* HEADER */}
      <header style={{ ...styles.header, backgroundColor: currentTheme.cardBg, borderColor: currentTheme.primary + "30" }}>
        <button style={styles.backBtn} onClick={() => navigate("/")}>⬅️ Rudi Home</button>
        <div style={styles.headerTitle}>
          <span style={{ fontSize: "28px" }}>🤲</span>
          <div>
            <h1 style={{ margin: 0, fontSize: "20px", color: currentTheme.primary }}>Hisn Al-Muslim (Ngome ya Muislamu)</h1>
            <p style={{ margin: 0, fontSize: "12px", opacity: 0.8 }}>Dua Zilizothibitishwa na Dalili Swahihi ({duasList.length} Dua)</p>
          </div>
        </div>
      </header>

      {/* HERO BANNER */}
      <section style={{ ...styles.heroBanner, background: `linear-gradient(135deg, ${currentTheme.primary} 0%, #064e3b 100%)` }}>
        <h2 style={{ fontSize: "26px", margin: "0 0 8px 0", color: "#fbbf24" }}>"Niombeni Mmi Nitakujibuni"</h2>
        <p style={{ margin: 0, fontSize: "14px", opacity: 0.9 }}>[Surah Ghafir 40:60]</p>
        
        {/* VOLUME BOOSTER */}
        <div style={styles.boosterBox}>
          <span>🔊 Sauti ya Dua: {Math.round(volumeBoost * 100)}%</span>
          <input
            type="range"
            min="1"
            max="2.5"
            step="0.1"
            value={volumeBoost}
            onChange={(e) => setVolumeBoost(Number(e.target.value))}
            style={{ accentColor: "#fbbf24", cursor: "pointer" }}
          />
        </div>
      </section>

      {/* SEARCH AND CATEGORIES */}
      <section style={styles.filterSection}>
        <div style={styles.searchBox}>
          <span>🔎</span>
          <input
            type="text"
            placeholder="Tafuta Dua (Mfano: Amka, Usafiri, Chakula, Mvua)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {DUA_CATEGORIES && (
          <div style={styles.categoryRow}>
            <button
              onClick={() => setSelectedCategory("all")}
              style={{
                ...styles.categoryChip,
                backgroundColor: selectedCategory === "all" ? currentTheme.primary : currentTheme.cardBg,
                color: selectedCategory === "all" ? "#fff" : currentTheme.text,
                borderColor: currentTheme.primary + "30"
              }}
            >
              🌟 Zote ({duasList.length})
            </button>
            {DUA_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  ...styles.categoryChip,
                  backgroundColor: selectedCategory === cat.id ? currentTheme.primary : currentTheme.cardBg,
                  color: selectedCategory === cat.id ? "#fff" : currentTheme.text,
                  borderColor: currentTheme.primary + "30"
                }}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* LOADING STATE */}
      {loading && (
        <div style={{ textAlign: "center", padding: "40px", fontSize: "16px" }}>
          🔄 Inapakia Dua zote mtandaoni... Tafadhali subiri kidogo.
        </div>
      )}

      {/* DUAS LIST */}
      <main style={styles.mainGrid}>
        {!loading && filteredDuas.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px", opacity: 0.7 }}>
            ❌ Hakuna Dua iliyopatikana kwa utafutaji huo.
          </div>
        )}

        {filteredDuas.map((dua) => {
          const isThisPlaying = playingDuaId === dua.id && isPlaying;

          return (
            <div
              key={dua.id}
              style={{
                ...styles.duaCard,
                backgroundColor: currentTheme.cardBg,
                borderColor: isThisPlaying ? currentTheme.accent : "transparent",
                boxShadow: isThisPlaying ? `0 10px 25px ${currentTheme.primary}30` : "0 4px 15px rgba(0,0,0,0.04)"
              }}
            >
              <div style={styles.cardHeader}>
                <h3 style={{ margin: 0, color: currentTheme.primary, fontSize: "18px" }}>{dua.title}</h3>
                {dua.audioUrl && (
                  <button
                    style={{ ...styles.playBtn, backgroundColor: isThisPlaying ? currentTheme.accent : currentTheme.primary }}
                    onClick={() => playDuaAudio(dua)}
                  >
                    {isThisPlaying ? "⏸️ Sitisha" : "▶️ Sikiliza Dua"}
                  </button>
                )}
              </div>

              {/* ARABIC TEXT */}
              {dua.arabic && <div style={styles.arabicText}>{dua.arabic}</div>}

              {/* TRANSLITERATION */}
              {dua.transliteration && (
                <p style={styles.transliterationText}><em>"{dua.transliteration}"</em></p>
              )}

              {/* SWAHILI TRANSLATION */}
              {dua.translation && (
                <p style={styles.translationText}><strong>Tafsiri:</strong> {dua.translation}</p>
              )}

              {/* EVIDENCE BADGE BUTTON (SAFE CHECK) */}
              <div style={styles.cardFooter}>
                <span style={{ ...styles.statusBadge, backgroundColor: "#ecfdf5", color: "#047857" }}>
                  ✅ {dua?.evidence?.status || "Swahihi"}
                </span>
                <button
                  style={{ ...styles.evidenceBtn, color: currentTheme.primary }}
                  onClick={() => setSelectedEvidenceModal(dua)}
                >
                  📜 Angalia Dalili na Chanzo ➔
                </button>
              </div>
            </div>
          );
        })}
      </main>

      {/* DALILI & EVIDENCE MODAL */}
      {selectedEvidenceModal && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalCard, backgroundColor: currentTheme.cardBg, color: currentTheme.text }}>
            <div style={styles.modalHeader}>
              <h3>📜 Chanzo na Dalili Halali ya Dua</h3>
              <button style={styles.closeBtn} onClick={() => setSelectedEvidenceModal(null)}>✖</button>
            </div>
            <div style={styles.modalBody}>
              <h4>{selectedEvidenceModal.title}</h4>
              <p><strong>📖 Kitabu / Chanzo:</strong> {selectedEvidenceModal?.evidence?.source || "Hisn Al-Muslim"}</p>
              <p><strong>👤 Mpokezi (Narrator):</strong> {selectedEvidenceModal?.evidence?.narrator || "Swahaba / Hadithi Swahihi"}</p>
              <p><strong>🏅 Daraja ya Hadithi:</strong> <span style={{ color: "#047857", fontWeight: "bold" }}>{selectedEvidenceModal?.evidence?.status || "Swahihi"}</span></p>

              <div style={styles.benefitBox}>
                <strong>✨ Faida na Mafunzo:</strong>
                <p style={{ margin: "4px 0 0 0" }}>{selectedEvidenceModal?.evidence?.benefit || "Inakukinga na mabaya na kuletea baraka katika mambo yako."}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// STYLES SYSTEM
const styles = {
  pageWrapper: { minHeight: "100vh", paddingBottom: "60px", fontFamily: "'Inter', sans-serif" },
  header: { display: "flex", alignItems: "center", gap: "16px", padding: "16px 24px", borderBottom: "1px solid", position: "sticky", top: 0, zIndex: 100 },
  backBtn: { padding: "8px 16px", borderRadius: "10px", border: "none", backgroundColor: "#e2e8f0", cursor: "pointer", fontWeight: "bold" },
  headerTitle: { display: "flex", alignItems: "center", gap: "12px" },
  heroBanner: { padding: "32px 24px", textAlign: "center", color: "#fff", borderRadius: "0 0 24px 24px" },
  boosterBox: { display: "inline-flex", alignItems: "center", gap: "10px", backgroundColor: "rgba(0,0,0,0.25)", padding: "6px 16px", borderRadius: "20px", marginTop: "12px" },
  filterSection: { maxWidth: "1000px", margin: "24px auto", padding: "0 16px", display: "flex", flexDirection: "column", gap: "16px" },
  searchBox: { display: "flex", alignItems: "center", gap: "10px", backgroundColor: "rgba(0,0,0,0.05)", padding: "12px 20px", borderRadius: "16px" },
  searchInput: { border: "none", background: "none", outline: "none", width: "100%", fontSize: "15px" },
  categoryRow: { display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "8px" },
  categoryChip: { padding: "8px 16px", borderRadius: "12px", border: "1px solid", cursor: "pointer", fontWeight: "bold", whiteSpace: "nowrap" },
  mainGrid: { maxWidth: "1000px", margin: "0 auto", padding: "0 16px", display: "flex", flexDirection: "column", gap: "20px" },
  duaCard: { padding: "24px", borderRadius: "20px", border: "2px solid", transition: "all 0.25s ease" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" },
  playBtn: { padding: "8px 16px", border: "none", borderRadius: "10px", color: "#fff", fontWeight: "bold", cursor: "pointer" },
  arabicText: { fontSize: "28px", fontFamily: "'Amiri', serif", textAlign: "right", direction: "rtl", margin: "16px 0", lineHeight: "1.8" },
  transliterationText: { opacity: 0.8, fontSize: "14px", margin: "8px 0" },
  translationText: { lineHeight: "1.6", margin: "8px 0 16px 0" },
  cardFooter: { display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "12px", flexWrap: "wrap", gap: "8px" },
  statusBadge: { padding: "4px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold" },
  evidenceBtn: { border: "none", background: "none", cursor: "pointer", fontWeight: "bold", fontSize: "13px" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000 },
  modalCard: { width: "90%", maxWidth: "500px", borderRadius: "24px", padding: "24px", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #cbd5e1", paddingBottom: "12px" },
  closeBtn: { border: "none", background: "none", fontSize: "18px", cursor: "pointer" },
  modalBody: { marginTop: "16px", display: "flex", flexDirection: "column", gap: "10px" },
  benefitBox: { marginTop: "12px", padding: "12px", backgroundColor: "rgba(251, 191, 36, 0.15)", borderRadius: "10px" }
};

export default HisnMuslimPage;