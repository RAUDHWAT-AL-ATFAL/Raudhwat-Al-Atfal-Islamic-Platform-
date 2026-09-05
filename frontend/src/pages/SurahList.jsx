// src/pages/SurahList.jsx - QURAN SURAH ENGINE (API INTEGRATED)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SurahList = () => {
  const navigate = useNavigate();
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Vuta Orodha ya Sura Zote 114 kutoka API ya Alquran.cloud
    fetch("https://api.alquran.cloud/v1/surah")
      ? fetch("https://api.alquran.cloud/v1/surah")
          .then((res) => res.json())
          .then((data) => {
            setSurahs(data.data || []);
            setLoading(false);
          })
          .catch(() => setLoading(false))
      : setLoading(false);
  }, []);

  const filteredSurahs = surahs.filter(
    (s) =>
      s.englishName.toLowerCase().includes(search.toLowerCase()) ||
      s.name.includes(search) ||
      s.number.toString() === search
  );

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={{ color: "#047857", margin: 0 }}>📖 Qur'an Tukufu</h1>
        <p style={{ margin: 0, opacity: 0.8 }}>Soma na Uskilize Sura Zote 114</p>
      </header>

      {/* SEARCH BAR */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Tafuta Sura kwa Jina au Namba (mfano: Al-Fatiha au 1)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <span>🔄 Inavuta Orodha ya Sura za Qur'an...</span>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredSurahs.map((surah) => (
            <div
              key={surah.number}
              onClick={() => navigate(`/surah/${surah.number}`)}
              style={styles.card}
            >
              <div style={styles.numberBadge}>{surah.number}</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, color: "#047857" }}>{surah.englishName}</h3>
                <span style={{ fontSize: "12px", opacity: 0.7 }}>
                  {surah.revelationType} • Aya {surah.numberOfAyahs}
                </span>
              </div>
              <div style={styles.arabicName}>{surah.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: "20px", maxWidth: "1000px", margin: "0 auto", paddingBottom: "80px", fontFamily: "sans-serif" },
  header: { textAlign: "center", marginBottom: "24px" },
  searchInput: { width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "16px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" },
  card: { display: "flex", alignItems: "center", gap: "12px", padding: "16px", backgroundColor: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" },
  numberBadge: { width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#e0f2fe", color: "#0369a1", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center" },
  arabicName: { fontSize: "20px", fontFamily: "'Amiri', serif", color: "#047857" }
};

export default SurahList;