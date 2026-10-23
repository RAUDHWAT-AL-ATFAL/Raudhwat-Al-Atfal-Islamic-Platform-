import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  // Orodha ya Themes 5 za Kiislamu zenye mvuto mzuri na zisizochoma macho
  const islamicThemes = [
    {
      id: "madina",
      name: "مدينة (Madina Emerald & Gold)",
      bgGradient: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #0f766e 100%)",
      cardBg: "#032019",
      primaryColor: "#34d399",
      accentColor: "#fbbf24",
      textColor: "#ffffff",
      borderStyle: "3px solid #34d399"
    },
    {
      id: "mecca",
      name: "مكة (Mecca Royal Velvet)",
      bgGradient: "linear-gradient(135deg, #18181b 0%, #27272a 50%, #09090b 100%)",
      cardBg: "#121214",
      primaryColor: "#fbbf24",
      accentColor: "#f43f5e",
      textColor: "#ffffff",
      borderStyle: "3px solid #fbbf24"
    },
    {
      id: "andalusia",
      name: "الأندلس (Andalusia Sunset)",
      bgGradient: "linear-gradient(135deg, #7c2d12 0%, #9a3412 50%, #c2410c 100%)",
      cardBg: "#451a03",
      primaryColor: "#fed7aa",
      accentColor: "#fde047",
      textColor: "#fffbeb",
      borderStyle: "3px solid #fde047"
    },
    {
      id: "quds",
      name: "القدس (Al-Quds Olive & Pearl)",
      bgGradient: "linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%)",
      cardBg: "#0f381e",
      primaryColor: "#86efac",
      accentColor: "#facc15",
      textColor: "#f0fdf4",
      borderStyle: "3px solid #86efac"
    },
    {
      id: "baghdad",
      name: "بغداد (Baghdad Midnight Sapphire)",
      bgGradient: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #3730a3 100%)",
      cardBg: "#110e3b",
      primaryColor: "#93c5fd",
      accentColor: "#f472b6",
      textColor: "#e0e7ff",
      borderStyle: "3px solid #93c5fd"
    }
  ];

  const [currentTheme, setCurrentTheme] = useState(islamicThemes[0]);

  return (
    <div style={{
      minHeight: "100vh",
      background: currentTheme.bgGradient,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0",
      fontFamily: "'Poppins', 'Segoe UI', sans-serif",
      transition: "background 0.5s ease"
    }}>

      {/* 1. UJUMBE WA JUU (MARQUEE KUBWA ILIYOKOLEA RANGI) */}
      <div style={{
        width: "100%",
        backgroundColor: "#78350f",
        color: "#fef08a",
        padding: "14px 0",
        fontWeight: "900",
        fontSize: "22px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
        borderBottom: "3px solid #d97706",
        letterSpacing: "1px"
      }}>
        <marquee behavior="scroll" direction="left" scrollamount="7">
          ✨ بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ — KARIBU KABISA KATIKA KITUO CHA RAUDHWات AL-ATFAL (BUSTANI YA WATOTO) — MAHALI PA KULEA WATOTO YATIMA, WENYE UHITAJI, NA KUENDELEZA MAADILI YA QURAN NA SUNNAH ✨
        </marquee>
      </div>

      {/* 2. CHAGUO LA THEMES 5 ZA KIISLAMU */}
      <div style={{
        width: "92%",
        maxWidth: "900px",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        borderRadius: "16px",
        padding: "15px 20px",
        marginTop: "20px",
        border: "2px solid rgba(255, 255, 255, 0.3)",
        textAlign: "center"
      }}>
        <div style={{ color: "#fef08a", fontSize: "15px", fontWeight: "900", marginBottom: "10px" }}>
          🎨 CHAGUA MANDHARI (ISLAMIC THEME) YA KUPENDEZA:
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
          {islamicThemes.map((thm) => (
            <button
              key={thm.id}
              onClick={() => setCurrentTheme(thm)}
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                border: currentTheme.id === thm.id ? "3px solid #fef08a" : "2px solid rgba(255,255,255,0.4)",
                backgroundColor: currentTheme.id === thm.id ? "#064e3b" : "rgba(255,255,255,0.2)",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: "900",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
            >
              {thm.name}
            </button>
          ))}
        </div>
      </div>

      {/* 3. MAUDHUI KUU YA HOME (WELCOME & HEART SOFTENING) */}
      <div style={{
        backgroundColor: currentTheme.cardBg,
        width: "92%",
        maxWidth: "900px",
        borderRadius: "28px",
        boxShadow: "0 15px 35px rgba(0, 0, 0, 0.6)",
        padding: "45px 35px",
        border: currentTheme.borderStyle,
        textAlign: "center",
        margin: "25px 0",
        color: currentTheme.textColor
      }}>
        
        {/* Calligraphy Kuu */}
        <div style={{
          fontSize: "36px",
          color: currentTheme.accentColor,
          fontWeight: "900",
          fontFamily: "'Amiri', serif",
          marginBottom: "10px"
        }}>
          رَوْضَةُ الْأَطْفَالِ الْخَيْرِيَّةُ
        </div>

        <h3 style={{ margin: "0", color: currentTheme.primaryColor, fontSize: "20px", fontWeight: "900", letterSpacing: "1px" }}>
          السَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ
        </h3>

        <h1 style={{
          fontSize: "40px",
          fontWeight: "900",
          color: "#ffffff",
          margin: "15px 0"
        }}>
          Raudhwat Al-Atfal
        </h1>

        <div style={{
          fontSize: "18px",
          lineHeight: "1.8",
          fontWeight: "700",
          margin: "20px 0 35px 0",
          color: "#f8fafc",
          padding: "0 10px"
        }}>
          <p style={{ marginBottom: "15px" }}>
            🌟 <span style={{ color: currentTheme.accentColor, fontSize: "20px" }}>Karibu kwenye Bustani ya Huruma na Upendo.</span> Tunakukaribisha kwa mikono miwili wewe uliyefika hapa kwa nia njema. Kituo chetu kimejikita katika <strong style={{ color: currentTheme.primaryColor }}>kulea watoto yatima, kusaidia wenye uhitaji</strong>, na kupanda mbegu za maadili mema, elimu ya Quran na Sunnah kwenye nyoyo changa.
          </p>
          <p>
            💖 Tunaimani kuwa kila mlango wa heri unafunguliwa kwa moyo safi na ukarimu. Tunakusihi ulainishe moyo wako, usome na uone jinsi tunavyojitoa kwa ajili ya jamii, na uungane nasi katika safari hii tukufu ya kutafuta radhi za Allah (S.W.).
          </p>
        </div>

        {/* VITUFE 3 VILIVYOPANGILIWA VIZURI (LOGIN, REGISTER, NA MSAADA) */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", justifyContent: "center", marginTop: "30px" }}>
          
          {/* Kitufe cha 1: Ingia Kwenye Mfumo (Login) */}
          <button 
            onClick={() => navigate("/login")}
            style={{
              padding: "16px 28px",
              backgroundColor: currentTheme.accentColor,
              color: "#111827",
              border: "none",
              borderRadius: "14px",
              fontSize: "18px",
              fontWeight: "900",
              cursor: "pointer",
              letterSpacing: "0.5px"
            }}
          >
            🔐 Ingia (Login)
          </button>

          {/* Kitufe cha 2: Jisajili Sasa (Register) - Kimeongezwa Katikati */}
          <button 
            onClick={() => navigate("/register")}
            style={{
              padding: "16px 28px",
              backgroundColor: "#059669",
              color: "#ffffff",
              border: "2px solid #34d399",
              borderRadius: "14px",
              fontSize: "18px",
              fontWeight: "900",
              cursor: "pointer",
              letterSpacing: "0.5px"
            }}
          >
            ✍️ Jisajili Sasa
          </button>

          {/* Kitufe cha 3: Jinsi ya Kusaidia Yatima */}
          <button 
            onClick={() => alert("💖 Asante kwa moyo wako wa ukarimu! Unaweza kuwasiliana nasi au kutoa mchango wako moja kwa moja kupitia viongozi wetu rasmi kwenye mfumo.")}
            style={{
              padding: "16px 28px",
              backgroundColor: "transparent",
              color: currentTheme.primaryColor,
              border: "3px solid " + currentTheme.primaryColor,
              borderRadius: "14px",
              fontSize: "18px",
              fontWeight: "900",
              cursor: "pointer",
              letterSpacing: "0.5px"
            }}
          >
            🤝 Kusaidia Yatima
          </button>

        </div>

      </div>

      {/* 4. UJUMBE WA CHINI (MARQUEE YA KUKUMBUSHA AKHERA) */}
      <div style={{
        width: "100%",
        backgroundColor: "#064e3b",
        color: "#fef08a",
        padding: "14px 0",
        fontWeight: "900",
        fontSize: "21px",
        borderTop: "3px solid #b45309",
        letterSpacing: "0.5px"
      }}>
        <marquee behavior="scroll" direction="right" scrollamount="6">
          🌙 MWANAMUME MMOJA ALIMLALAMIKIA MTUME (S.A.W) KUHUSU UGUMU WA MOYO WAKE, MTUME AKAMWAMBIA: "MPAKE YATIMA KICHWA CHAKE NA UMLISHE CHAKULA, MOYO WAKO UTAWAHI LAKINI UTALAINIKA" (HR Ahmad) 🌙
        </marquee>
      </div>

    </div>
  );
}

export default HomePage;