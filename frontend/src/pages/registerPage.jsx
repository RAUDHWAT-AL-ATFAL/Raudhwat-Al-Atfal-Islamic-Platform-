import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage({ onLogin }) {
  const [fullName, setFullName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [role, setRole] = useState("donor");
  const [successMessage, setSuccessMessage] = useState(false);
  const [themeIndex, setThemeIndex] = useState(0);
  const navigate = useNavigate();

  // Themes 5 nzuri za Kiislamu za kuchagua kwenye Kona
  const themes = [
    { name: "Kijani cha Riyadh", bg: "linear-gradient(135deg, #022c22 0%, #065f46 50%, #042f2e 100%)", cardBg: "#ffffff", text: "#065f46", accent: "#10b981" },
    { name: "Dhahabu ya Madina", bg: "linear-gradient(135deg, #78350f 0%, #b45309 50%, #451a03 100%)", cardBg: "#fffbeb", text: "#92400e", accent: "#d97706" },
    { name: "Samawati ya Al-Quds", bg: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #020617 100%)", cardBg: "#f8fafc", text: "#1e40af", accent: "#3b82f6" },
    { name: "Kijivu cha Heshima", bg: "linear-gradient(135deg, #334155 0%, #475569 50%, #0f172a 100%)", cardBg: "#f1f5f9", text: "#334155", accent: "#64748b" },
    { name: "Emerald Kifalme", bg: "linear-gradient(135deg, #064e3b 0%, #047857 50%, #022c22 100%)", cardBg: "#ecfdf5", text: "#047857", accent: "#059669" }
  ];

  const currentTheme = themes[themeIndex];
  
  // Kutunza kumbukumbu ya mtumiaji aliyesajiliwa kwa ajili ya kubadili kurasa baadaye
  const [registeredUser, setRegisteredUser] = useState(null);

  const handleRegister = (e) => {
    e.preventDefault();

    const newUser = {
      id: Date.now(),
      name: fullName,
      email: identifier,
      role: role.toUpperCase(), // Inahakikisha inasomeka sahihi kama MEMBER, DONOR, au ADMIN kwenye Dashboard ya Admin
      date: new Date().toISOString().split('T')[0],
      token: "raudhwat-token-" + Date.now()
    };

    setRegisteredUser(newUser);

    // 1. Inahifadhi mtumiaji kwenye session ya sasa
    if (onLogin) {
      onLogin(newUser);
    }

    // 2. Inahifadhi kwenye orodha kuu ya Admin Dashboard ili maadmin waweze kuiona
    try {
      const existingUsers = JSON.parse(localStorage.getItem("raudhwat_all_users")) || [];
      const updatedUsers = [newUser, ...existingUsers];
      localStorage.setItem("raudhwat_all_users", JSON.stringify(updatedUsers));
    } catch (error) {
      console.error("Hitilafu katika kuhifadhi taarifa za mfumo:", error);
    }

    // Inaonyesha ukurasa wa mafanikio na shukrani za dhati
    setSuccessMessage(true);
  };

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column",
      justifyContent: "space-between", 
      alignItems: "center", 
      minHeight: "100vh", 
      background: currentTheme.bg, 
      padding: "15px 20px",
      fontFamily: "Arial, sans-serif",
      boxSizing: "border-box",
      overflowX: "hidden"
    }}>
      
      {/* KONA YA JUU: Chaguo la 5 Themes za Kiislamu */}
      <div style={{ position: "absolute", top: "15px", right: "20px", display: "flex", gap: "8px", zIndex: 10, background: "rgba(0,0,0,0.3)", padding: "8px 12px", borderRadius: "12px", backdropFilter: "blur(5px)" }}>
        <span style={{ color: "#fff", fontSize: "12px", fontWeight: "bold", alignSelf: "center", marginRight: "5px" }}>Theme:</span>
        {themes.map((t, idx) => (
          <button
            key={idx}
            onClick={() => setThemeIndex(idx)}
            title={t.name}
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              border: themeIndex === idx ? "3px solid #fff" : "1px solid rgba(255,255,255,0.6)",
              background: t.bg,
              cursor: "pointer",
              boxShadow: "0 2px 5px rgba(0,0,0,0.3)"
            }}
          />
        ))}
      </div>

      {/* MANENO YANAYOPITA JUU */}
      <div style={{ width: "100%", overflow: "hidden", whiteSpace: "nowrap", background: "rgba(0, 0, 0, 0.6)", padding: "14px 0", borderRadius: "10px", margin: "5px 0 15px 0", border: "1px solid rgba(255,255,255,0.2)" }}>
        <div style={{ display: "inline-block", animation: "marquee 45s linear infinite", color: "#fef08a", fontSize: "22px", fontWeight: "900", letterSpacing: "1.2px", textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}>
          🌟🕌"Hakika mali na watoto ni mtihani, na malipo makubwa yako kwa Mwenyezi Mungu...🕌" &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; 🕌🌙 Karibu Raudhwat Al-Atfal: jumuiya ya kulelea na kuendeleza miradi ya kheri itakayokusemea kesho Akhera...🕌 &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; 🕌 Toa jitihada na mali yako leo katika njia ya haki!🌟
        </div>
      </div>

      {/* BOX KUU LA USAJILI */}
      <div style={{ 
        background: currentTheme.cardBg, 
        padding: "45px 50px", 
        borderRadius: "24px", 
        width: "100%", 
        maxWidth: "850px", 
        boxShadow: "0 25px 60px rgba(0, 0, 0, 0.5)",
        borderTop: `8px solid ${currentTheme.accent}`,
        margin: "auto 0"
      }}>
        
        <div style={{ textAlign: "center", marginBottom: "30px", borderBottom: "3px solid #e2e8f0", paddingBottom: "20px" }}>
          <span style={{ background: currentTheme.text, color: "#fff", padding: "8px 20px", borderRadius: "25px", fontSize: "15px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1.5px" }}>
            🕌🌙 Malimwengu yanapita, Amali za kheri zinadumu 🌙🕌
          </span>
          <h2 style={{ color: currentTheme.text, fontSize: "34px", fontWeight: "900", margin: "18px 0 10px 0" }}>
            Jisajili Kama Mwanaraudhwat al-Atfal
          </h2>
          <p style={{ fontSize: "18px", color: "#334155", lineHeight: "1.7", fontWeight: "700", maxWidth: "750px", margin: "0 auto" }}>
            <em>"Dunia ni shamba la Akhera. Simama kidete kuendesha miradi mikubwa ya elimu, malezi, na huduma za kijamii kwa kujiandikisha rasmi hapa chini."</em>
          </p>
        </div>

        {successMessage ? (
          <div style={{ textAlign: "center", padding: "35px", background: "#d1fae5", border: "3px solid #10b981", borderRadius: "16px", color: "#065f46" }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "28px", fontWeight: "900" }}>Alhamdulillah! Usajili Wako Umekamilika kwa Ukamilifu 🎉</h3>
            <p style={{ fontSize: "18px", lineHeight: "1.6", fontWeight: "700", marginBottom: "25px" }}>
              Tunatoa shukran za dhati kwa kujitolea kwako na kuungana na familia ya Raudhwat Al-Atfal. Taarifa zako zimeshapokelewa na kuhifadhiwa kikamilifu kwenye mfumo wetu mkuu ili viongozi na maadmin waweze kuziona moja kwa moja kwenye dashibodi yao. Mwenyezi Mungu akubariki, akuzidishie kheri, na akufanyie wepesi katika kila hatua!
            </p>
            <button 
              onClick={() => {
  // Inampeleka ADMIN kwenye admin-dashboard, na wengine wote (Member & Donor) wanaenda donor-dashboard
  const userRole = registeredUser?.role || "DONOR"; // Badilisha 'registeredUser' izingatie jina la variable yako ya user
  
  if (userRole === "ADMIN") {
    navigate("/admin-dashboard");
  } else {
    navigate("/donor-dashboard");
  }
}}
              style={{ 
                padding: "16px 32px", background: currentTheme.accent, color: "white", border: "none", 
                borderRadius: "12px", fontWeight: "900", fontSize: "18px", cursor: "pointer", 
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)" 
              }}
            >
              🚀 Ingia Kwenye Dashboard Yako Sasa ➔
            </button>
          </div>
        ) : (
          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "17px", fontWeight: "900", color: "#0f172a", marginBottom: "8px" }}>
                  Jina lako Kamili
                </label>
                <input 
                  type="text" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)} 
                  placeholder="Mfano: Ustadh Juma Bakari" 
                  required 
                  style={{ 
                    width: "100%", padding: "16px", fontSize: "18px", borderRadius: "12px", 
                    border: "3px solid #cbd5e1", outline: "none", fontWeight: "700", color: "#0f172a", background: "#ffffff",
                    transition: "all 0.3s ease"
                  }} 
                  onFocus={(e) => { e.target.style.borderColor = currentTheme.accent; e.target.style.boxShadow = `0 0 12px ${currentTheme.accent}55`; }}
                  onBlur={(e) => { e.target.style.borderColor = "#cbd5e1"; e.target.style.boxShadow = "none"; }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "17px", fontWeight: "900", color: "#0f172a", marginBottom: "8px" }}>
                  Namba ya Simu au Barua Pepe Rasmi
                </label>
                <input 
                  type="text" 
                  value={identifier} 
                  onChange={(e) => setIdentifier(e.target.value)} 
                  placeholder="07XXXXXXXX au email@domain.com" 
                  required 
                  style={{ 
                    width: "100%", padding: "16px", fontSize: "18px", borderRadius: "12px", 
                    border: "3px solid #cbd5e1", outline: "none", fontWeight: "700", color: "#0f172a", background: "#ffffff",
                    transition: "all 0.3s ease"
                  }}
                  onFocus={(e) => { e.target.style.borderColor = currentTheme.accent; e.target.style.boxShadow = `0 0 12px ${currentTheme.accent}55`; }}
                  onBlur={(e) => { e.target.style.borderColor = "#cbd5e1"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "17px", fontWeight: "900", color: "#0f172a", marginBottom: "8px" }}>
                Chagua Nafasi ya uhusika(Chaguo 3 Kuu)
              </label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                style={{ 
                  width: "100%", padding: "16px", fontSize: "18px", borderRadius: "12px", 
                  border: "3px solid #cbd5e1", background: "#ffffff", outline: "none", fontWeight: "900", color: currentTheme.text,
                  transition: "all 0.3s ease", cursor: "pointer"
                }}
                onFocus={(e) => { e.target.style.borderColor = currentTheme.accent; e.target.style.boxShadow = `0 0 12px ${currentTheme.accent}55`; }}
                onBlur={(e) => { e.target.style.borderColor = "#cbd5e1"; e.target.style.boxShadow = "none"; }}
              >
                <option value="member">1. Mwanachama (Member)</option>
                <option value="donor">2. Mfadhili / Mchangiaji (Donor)</option>
                <option value="admin">3. Viongozi(Admin)</option>
              </select>
            </div>

            <button 
              type="submit" 
              style={{ 
                width: "100%", padding: "18px", background: currentTheme.accent, color: "white", 
                border: "none", borderRadius: "12px", fontWeight: "900", fontSize: "20px", cursor: "pointer", 
                marginTop: "12px", boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)", textTransform: "uppercase", letterSpacing: "1px" 
              }}
            >
              🕌 Kamilisha Usajili na Uhifadhi Taarifa
            </button>
          </form>
        )}

        <div style={{ textAlign: "center", marginTop: "25px", borderTop: "3px solid #e2e8f0", paddingTop: "20px" }}>
          <a href="/login" style={{ color: currentTheme.text, fontSize: "18px", fontWeight: "900", textDecoration: "none" }}>
            Tayari una akaunti? Bonyeza hapa kuingia moja kwa moja ➔
          </a>
        </div>

      </div>

      {/* MANENO YANAYOPITA CHINI */}
      <div style={{ width: "100%", overflow: "hidden", whiteSpace: "nowrap", background: "rgba(0, 0, 0, 0.6)", padding: "14px 0", borderRadius: "10px", margin: "15px 0 5px 0", border: "1px solid rgba(255,255,255,0.2)" }}>
        <div style={{ display: "inline-block", animation: "marquee-rev 45s linear infinite", color: "#a7f3d0", fontSize: "22px", fontWeight: "900", letterSpacing: "1.2px", textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}>
          🌿"Wale watoao mali zao kwa usiku na mchana, kwa siri na kwa dhahiri, basi wana ujira wao kwa Mola wao...🕌" &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; 🕌 Raudhwat Al-Atfal: jumuiya ya kuandaa kizazi chenye maadili, elimu, na hofu ya Allah. &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; 💡Jiandikishe leo ili utende mema yenye kudumu!🌿
        </div>
      </div>

      {/* CSS Animation ya Marquee */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes marquee-rev {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

    </div>
  );
}