// src/pages/HadithPage.jsx - RAUDHWAT AL-ATFAL AUTHENTIC HADITH ENGINE PAGE
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AUTHENTIC_HADITHS, HADITH_BOOKS, HADITH_CATEGORIES } from "../data/hadithData";

const THEMES = {
  emerald: { bg: "#f8fafc", cardBg: "#ffffff", primary: "#047857", accent: "#fbbf24", text: "#0f172a" },
  gold: { bg: "#fffbeb", cardBg: "#ffffff", primary: "#b45309", accent: "#d97706", text: "#451a03" },
  dark: { bg: "#0f172a", cardBg: "#1e293b", primary: "#10b981", accent: "#fbbf24", text: "#f8fafc" }
};

const HadithPage = () => {
  const navigate = useNavigate();

  // --- STATES ---
  // Anza moja kwa moja na AUTHENTIC_HADITHS ili paged isionyeshe 0 Hadithi!
  const [hadithsList, setHadithsList] = useState(AUTHENTIC_HADITHS || []);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedHadithId, setExpandedHadithId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [playingId, setPlayingId] = useState(null);
  const [themeMode] = useState(() => localStorage.getItem("quran_theme") || "emerald");

  const currentTheme = THEMES[themeMode] || THEMES.emerald;

  // --- 1. FETCH & OFFLINE PERSISTENCE ENGINE ---
  useEffect(() => {
    const loadHadithsData = async () => {
      // Step A: Angalia kama kuna offline cache
      const cachedHadiths = localStorage.getItem("offline_hadiths_data");
      if (cachedHadiths) {
        try {
          const parsed = JSON.parse(cachedHadiths);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setHadithsList(parsed);
          }
        } catch (e) {
          console.warn("Kosa la kusoma cached data:", e);
        }
      }

      // Step B: Jaribu kupata data za ziada kutoka mtandaoni
      try {
        setLoading(true);
        const response = await fetch("https://raw.githubusercontent.com/ahmedbhaisora/hadith-json/main/db.json");
        if (response.ok) {
          const apiData = await response.json();
          const rawList = apiData.hadiths || apiData || [];
          
          if (Array.isArray(rawList) && rawList.length > 0) {
            const formatted = rawList.map((item, index) => ({
              id: item.id || `api_${index + 1}`,
              bookId: item.book_id || item.bookId || "all",
              categoryId: item.category_id || item.categoryId || "all",
              chapterName: item.chapter || item.chapterName || "Hadithi Swahihi",
              arabic: item.arabic || item.text_arabic || "",
              transliteration: item.transliteration || "",
              translation: item.swahili || item.translation || item.text || "",
              narrator: item.narrator || "Swahaba (R.A)",
              source: item.source || item.book || "Sahih",
              grade: item.grade || "Swahihi",
              explanation: item.explanation || item.sharh || "Mafunzo ya hadithi hii yanatuhimiza kutenda wema."
            }));

            // Unganisha data za local na mtandao ili zote ziwepo
            const combinedList = [...AUTHENTIC_HADITHS, ...formatted];
            setHadithsList(combinedList);
            localStorage.setItem("offline_hadiths_data", JSON.stringify(combinedList));
          }
        }
      } catch (error) {
        console.warn("Mtandao haupo/umefeli. Mfumo unatumia data za ndani:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHadithsData();
  }, []);

  // --- 2. OFFLINE AUDIO SPEECH ENGINE ---
  const handlePlayAudio = (hadith) => {
    if (!('speechSynthesis' in window)) {
      alert("⚠️ Kivinjari chako hakisaidii mfumo wa kusoma kwa sauti.");
      return;
    }

    if (playingId === hadith.id) {
      window.speechSynthesis.cancel();
      setPlayingId(null);
      return;
    }

    window.speechSynthesis.cancel();

    const textToSpeak = hadith.arabic || hadith.translation;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = hadith.arabic ? "ar-SA" : "sw-TZ";
    utterance.rate = 0.85;

    utterance.onend = () => setPlayingId(null);
    utterance.onerror = () => setPlayingId(null);

    setPlayingId(hadith.id);
    window.speechSynthesis.speak(utterance);
  };

  // --- 3. FILTERING LOGIC (SAFE & FLEXIBLE) ---
  const filteredHadiths = (hadithsList || []).filter((hadith) => {
    if (!hadith) return false;

    // Filter ya Book (Kama 'all' au zinalingana, au data haina bookId)
    const matchesBook =
      selectedBook === "all" ||
      !hadith.bookId ||
      String(hadith.bookId).toLowerCase() === String(selectedBook).toLowerCase();

    // Filter ya Category
    const matchesCat =
      selectedCategory === "all" ||
      !hadith.categoryId ||
      String(hadith.categoryId).toLowerCase() === String(selectedCategory).toLowerCase();

    // Filter ya Search
    const q = (searchQuery || "").toLowerCase();
    const chapterName = (hadith.chapterName || "").toLowerCase();
    const translation = (hadith.translation || "").toLowerCase();
    const narrator = (hadith.narrator || "").toLowerCase();
    const source = (hadith.source || "").toLowerCase();

    const matchesSearch =
      chapterName.includes(q) ||
      translation.includes(q) ||
      narrator.includes(q) ||
      source.includes(q);

    return matchesBook && matchesCat && matchesSearch;
  });

  // Copy Hadith to Clipboard
  const handleCopyHadith = (hadith) => {
    const textToCopy = `📖 *${hadith.chapterName || "Hadithi Swahihi"}*\n\nالحديث: ${hadith.arabic || ""}\n\n*Tafsiri:* ${hadith.translation || ""}\n\n*Mpokezi:* ${hadith.narrator || ""}\n*Chanzo:* ${hadith.source || ""}\n*Daraja:* ${hadith.grade || "Swahihi"}\n\n_Imetoka: Raudhwat-Al-Atfal Islamic Platform_`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(hadith.id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  return (
    <div style={{ ...styles.pageWrapper, backgroundColor: currentTheme.bg, color: currentTheme.text }}>
      
      {/* HEADER */}
      <header style={{ ...styles.header, backgroundColor: currentTheme.cardBg, borderColor: currentTheme.primary + "30" }}>
        <button style={styles.backBtn} onClick={() => navigate("/")}>⬅️ Rudi Home</button>
        <div style={styles.headerTitle}>
          <span style={{ fontSize: "28px" }}>📜</span>
          <div>
            <h1 style={{ margin: 0, fontSize: "20px", color: currentTheme.primary }}>Maktaba ya Hadithi Swahihi</h1>
            <p style={{ margin: 0, fontSize: "12px", opacity: 0.8 }}>
              Zilizothibitishwa Kutoka Vitabu Vikuu vya Sunnah ({filteredHadiths.length} Hadithi)
            </p>
          </div>
        </div>
      </header>

      {/* HERO BANNER */}
      <section style={{ ...styles.heroBanner, background: `linear-gradient(135deg, ${currentTheme.primary} 0%, #064e3b 100%)` }}>
        <h2 style={{ fontSize: "24px", margin: "0 0 8px 0", color: "#fbbf24" }}>"Wafikishieni Watu Kutoka Kwangu Hata Kama ni Aya Moja"</h2>
        <p style={{ margin: 0, fontSize: "14px", opacity: 0.9 }}>[Sahih al-Bukhari 3461]</p>
      </section>

      {/* SEARCH AND FILTERS */}
      <section style={styles.filterSection}>
        {/* Search Bar */}
        <div style={styles.searchBox}>
          <span>🔎</span>
          <input
            type="text"
            placeholder="Tafuta Hadithi (Mfano: Nia, Mama, Elimu, Bukhari)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* Books Filter Row */}
        {HADITH_BOOKS && (
          <div style={styles.chipRow}>
            <button
              onClick={() => setSelectedBook("all")}
              style={{
                ...styles.chip,
                backgroundColor: selectedBook === "all" ? currentTheme.primary : currentTheme.cardBg,
                color: selectedBook === "all" ? "#fff" : currentTheme.text,
                borderColor: currentTheme.primary + "30"
              }}
            >
              📚 Vitabu Vyote
            </button>
            {HADITH_BOOKS.map((book) => (
              <button
                key={book.id}
                onClick={() => setSelectedBook(book.id)}
                style={{
                  ...styles.chip,
                  backgroundColor: selectedBook === book.id ? currentTheme.primary : currentTheme.cardBg,
                  color: selectedBook === book.id ? "#fff" : currentTheme.text,
                  borderColor: currentTheme.primary + "30"
                }}
              >
                {book.icon} {book.name}
              </button>
            ))}
          </div>
        )}

        {/* Categories Filter Row */}
        {HADITH_CATEGORIES && (
          <div style={styles.chipRow}>
            <button
              onClick={() => setSelectedCategory("all")}
              style={{
                ...styles.categoryChip,
                backgroundColor: selectedCategory === "all" ? "#d97706" : "transparent",
                color: selectedCategory === "all" ? "#fff" : currentTheme.text,
                border: "1px solid #d97706"
              }}
            >
              🌟 Vamwe Vyote / Zote
            </button>
            {HADITH_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  ...styles.categoryChip,
                  backgroundColor: selectedCategory === cat.id ? "#d97706" : "transparent",
                  color: selectedCategory === cat.id ? "#fff" : currentTheme.text,
                  border: "1px solid #d97706"
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* HADITHS LIST */}
      <main style={styles.mainGrid}>
        {loading && <div style={{ textAlign: "center", padding: "10px" }}>🔄 Inapakia data mpya...</div>}

        {filteredHadiths.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <span style={{ fontSize: "40px" }}>🔍</span>
            <p>Hakuna Hadithi iliyopatikana kwenye kipengele hiki.</p>
            <button
              onClick={() => { setSelectedBook("all"); setSelectedCategory("all"); setSearchQuery(""); }}
              style={{ padding: "8px 16px", backgroundColor: currentTheme.primary, color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", marginTop: "10px" }}
            >
              Onyesha Hadithi Zote
            </button>
          </div>
        ) : (
          filteredHadiths.map((hadith) => {
            const isExpanded = expandedHadithId === hadith.id;
            const isThisPlaying = playingId === hadith.id;

            return (
              <div
                key={hadith.id}
                style={{
                  ...styles.hadithCard,
                  backgroundColor: currentTheme.cardBg,
                  borderColor: currentTheme.primary + "20"
                }}
              >
                {/* CARD TOP BADGES */}
                <div style={styles.cardTop}>
                  <span style={styles.bookTag}>📚 {hadith.source || "Sahih"}</span>
                  <span style={styles.gradeTag}>✅ {hadith.grade || "Swahihi"}</span>
                </div>

                {/* TITLE & AUDIO BTN */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", flexWrap: "wrap", gap: "8px" }}>
                  <h3 style={{ margin: 0, color: currentTheme.primary, fontSize: "18px" }}>
                    {hadith.chapterName}
                  </h3>
                  
                  <button
                    style={{ ...styles.audioBtn, backgroundColor: isThisPlaying ? "#d97706" : currentTheme.primary }}
                    onClick={() => handlePlayAudio(hadith)}
                  >
                    {isThisPlaying ? "⏸️ Sitisha Sauti" : "🔊 Sikiliza Hadithi"}
                  </button>
                </div>

                {/* ARABIC HADITH TEXT */}
                {hadith.arabic && <div style={styles.arabicText}>{hadith.arabic}</div>}

                {/* TRANSLITERATION */}
                {hadith.transliteration && (
                  <p style={styles.transliterationText}><em>"{hadith.transliteration}"</em></p>
                )}

                {/* SWAHILI TRANSLATION */}
                {hadith.translation && (
                  <p style={styles.translationText}><strong>Tafsiri:</strong> {hadith.translation}</p>
                )}

                {/* NARRATOR */}
                {hadith.narrator && (
                  <p style={styles.narratorText}>👤 <strong>Mpokezi:</strong> {hadith.narrator}</p>
                )}

                {/* EXPANDABLE EXPLANATION */}
                {isExpanded && (
                  <div style={styles.explanationBox}>
                    <strong style={{ color: currentTheme.primary }}>💡 Mafunzo na Sharh ya Hadithi:</strong>
                    <p style={{ margin: "6px 0 0 0", lineHeight: "1.6" }}>{hadith.explanation}</p>
                  </div>
                )}

                {/* CARD ACTION BUTTONS */}
                <div style={styles.cardActions}>
                  <button
                    style={styles.expandBtn}
                    onClick={() => setExpandedHadithId(isExpanded ? null : hadith.id)}
                  >
                    {isExpanded ? "🔼 Funga Mafunzo" : "💡 Soma Mafunzo (Sharh)"}
                  </button>

                  <button
                    style={{
                      ...styles.copyBtn,
                      backgroundColor: copiedId === hadith.id ? "#10b981" : currentTheme.primary
                    }}
                    onClick={() => handleCopyHadith(hadith)}
                  >
                    {copiedId === hadith.id ? "✅ Imenakiliwa!" : "📋 Tuma/Copy Hadithi"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </main>
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
  filterSection: { maxWidth: "1000px", margin: "24px auto", padding: "0 16px", display: "flex", flexDirection: "column", gap: "14px" },
  searchBox: { display: "flex", alignItems: "center", gap: "10px", backgroundColor: "rgba(0,0,0,0.05)", padding: "12px 20px", borderRadius: "16px" },
  searchInput: { border: "none", background: "none", outline: "none", width: "100%", fontSize: "15px" },
  chipRow: { display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "4px" },
  chip: { padding: "8px 16px", borderRadius: "12px", border: "1px solid", cursor: "pointer", fontWeight: "bold", whiteSpace: "nowrap" },
  categoryChip: { padding: "6px 14px", borderRadius: "20px", cursor: "pointer", fontWeight: "600", fontSize: "13px", whiteSpace: "nowrap" },
  mainGrid: { maxWidth: "1000px", margin: "0 auto", padding: "0 16px", display: "flex", flexDirection: "column", gap: "20px" },
  hadithCard: { padding: "24px", borderRadius: "20px", border: "1px solid", boxShadow: "0 4px 15px rgba(0,0,0,0.04)" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" },
  bookTag: { backgroundColor: "#e0f2fe", color: "#0369a1", padding: "4px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold" },
  gradeTag: { backgroundColor: "#ecfdf5", color: "#047857", padding: "4px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold" },
  audioBtn: { padding: "6px 12px", border: "none", borderRadius: "8px", color: "#fff", fontWeight: "bold", cursor: "pointer", fontSize: "12px" },
  arabicText: { fontSize: "26px", fontFamily: "'Amiri', serif", textAlign: "right", direction: "rtl", margin: "16px 0", lineHeight: "1.8" },
  transliterationText: { opacity: 0.8, fontSize: "14px", margin: "8px 0" },
  translationText: { lineHeight: "1.6", margin: "8px 0" },
  narratorText: { fontSize: "13px", opacity: 0.8, margin: "8px 0 16px 0" },
  explanationBox: { padding: "14px", borderRadius: "12px", backgroundColor: "rgba(16, 185, 129, 0.08)", margin: "12px 0", borderLeft: "4px solid #10b981" },
  cardActions: { display: "flex", justifyContent: "space-between", gap: "10px", borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "14px", flexWrap: "wrap" },
  expandBtn: { border: "none", background: "none", cursor: "pointer", fontWeight: "bold", fontSize: "13px", color: "#64748b" },
  copyBtn: { padding: "8px 16px", border: "none", borderRadius: "10px", color: "#fff", fontWeight: "bold", cursor: "pointer", fontSize: "13px" }
};
export default HadithPage;