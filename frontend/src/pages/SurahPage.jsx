// src/pages/SurahPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const SurahPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [surahData, setSurahData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vuta Aya za Sura hii pamoja na Audio
    fetch(`https://api.alquran.cloud/v1/surah/${id}/ar.alafasy`)
      .then((res) => res.json())
      .then((data) => {
        setSurahData(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ textAlign: "center", padding: "50px" }}>🔄 Inapakua Aya...</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", paddingBottom: "90px" }}>
      <button onClick={() => navigate("/")} style={{ padding: "8px 16px", borderRadius: "8px", border: "none", cursor: "pointer" }}>⬅️ Rudi Kwenye Orodha</button>
      
      <h2 style={{ textAlign: "center", color: "#047857" }}>{surahData?.englishName} ({surahData?.name})</h2>

      {surahData?.ayahs.map((ayah) => (
        <div key={ayah.number} style={{ backgroundColor: "#fff", padding: "16px", borderRadius: "12px", margin: "12px 0", border: "1px solid #e2e8f0" }}>
          <div style={{ textAlign: "right", fontSize: "24px", lineHeight: "2", fontFamily: "'Amiri', serif" }}>
            {ayah.text} ﴿{ayah.numberInSurah}﴾
          </div>
          <audio controls src={ayah.audio} style={{ width: "100%", marginTop: "10px" }} />
        </div>
      ))}
    </div>
  );
};

export default SurahPage;