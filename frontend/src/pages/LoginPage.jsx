import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // State ya kucheki kama mtumiaji ameingia kikamilifu
  const [loggedInUser, setLoggedInUser] = useState(null);

  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    role: "member" 
  });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLogin) {
      onLogin(formData);
    }
    
    // Hifadhi taarifa za aliyeingia ili kumkaribisha kwa jina
    setLoggedInUser(formData.name || formData.email.split("@")[0]);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #022c22 100%)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 0",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      overflow: "hidden"
    }}>

      {/* 1. UJUMBE UNONG'AA NA KUTEMBEA JUUSI (TOP MARQUEE) */}
      <div style={{
        width: "100%",
        backgroundColor: "#d97706",
        color: "#ffffff",
        padding: "10px 0",
        fontWeight: "bold",
        fontSize: "18px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        borderBottom: "2px solid #f59e0b"
      }}>
        <marquee behavior="scroll" direction="left" scrollamount="7">
          ✨ KARIBU RAUDHWAT AL-ATFAL (BUSTANI YA WATOTO) ✨ — MALEZI BORA YA DINI NA MAADILI KWA WATOTO WETU — CHEMICHEMI YA ELIMU YA QURAN NA SUNNAH — KUZUIA MAADILI MABOYA NA KUJENGA KIZAZI KILICHO BORA ✨
        </marquee>
      </div>

      {/* 2. KADI KUU YA LOGIN AU UKARIBISHO */}
      <div style={{
        backgroundColor: "#ffffff",
        width: "90%",
        maxWidth: "480px",
        borderRadius: "24px",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
        padding: "35px 30px",
        border: "2px solid #f59e0b",
        textAlign: "center",
        margin: "20px 0",
        zIndex: 2
      }}>

        {/* AKIWA TAYARI AMEINGIA (LOGGED IN STATE) */}
        {loggedInUser ? (
          <div style={{ padding: "20px 10px" }}>
            <div style={{ fontSize: "50px", marginBottom: "10px" }}>🎉</div>
            <div style={{ fontSize: "20px", color: "#d97706", fontWeight: "bold", fontFamily: "'Amiri', serif" }}>
              أَهْلًا وَسَهْلًا وَمَرْحَبًا
            </div>
            
            <h2 style={{ color: "#064e3b", fontSize: "24px", margin: "15px 0 5px 0", fontWeight: "800" }}>
              Karibu Sana, {loggedInUser}!
            </h2>
            
            <p style={{ color: "#475569", fontSize: "14px", lineHeight: "1.6" }}>
              Akaunti yako ipo tayari. Umefanikiwa kuingia kwenye mfumo rasmi wa **Raudhwat Al-Atfal** (Bustani ya Watoto).
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "25px" }}>
              <button 
                onClick={() => {
                  if (formData.role === "admin") navigate("/admin");
                  else if (formData.role === "donor") navigate("/donor-dashboard");
                  else navigate("/quran");
                }}
                style={{
                  padding: "14px",
                  backgroundColor: "#064e3b",
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(6,78,59,0.3)"
                }}
              >
                Endelea Kwenye Dashibodi Yako →
              </button>
            </div>
          </div>
        ) : (
          /* AKIWA BADO HAJAINGIA (LOGIN / REGISTER FORM) */
          <>
            {/* BISMILLAH */}
            <div style={{
              fontSize: "24px",
              color: "#d97706",
              fontWeight: "bold",
              fontFamily: "'Amiri', 'Traditional Arabic', serif",
              marginBottom: "8px"
            }}>
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </div>

            <h3 style={{ margin: "0", color: "#064e3b", fontSize: "15px", fontWeight: "700" }}>
              السَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ
            </h3>

            <h1 style={{
              fontSize: "26px",
              fontWeight: "900",
              color: "#0f172a",
              margin: "6px 0",
              letterSpacing: "-0.5px"
            }}>
              Raudhwat Al-Atfal
            </h1>

            <p style={{
              fontSize: "13px",
              color: "#64748b",
              lineHeight: "1.5",
              marginBottom: "20px",
              fontWeight: "500"
            }}>
              {isRegister 
                ? "Sajili akaunti mpya ili kuingiza mtoto wako au kusaidia malezi ya Bustani ya Watoto." 
                : "Ingia kwenye akaunti yako uendelee na masomo, ibada, na malezi bora."}
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px", textAlign: "left" }}>
              
              {isRegister && (
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "#1e293b", marginBottom: "4px", display: "block" }}>
                    Jina Kamili (Rassmi)
                  </label>
                  <input 
                    type="text" 
                    placeholder="Mfano: Ustadh Rajabu Bashiri" 
                    required 
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "10px",
                      border: "1.5px solid #cbd5e1",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  />
                </div>
              )}

              <div>
                <label style={{ fontSize: "12px", fontWeight: "700", color: "#1e293b", marginBottom: "4px", display: "block" }}>
                  Barua Pepe (Email) au Namba ya Simu
                </label>
                <input 
                  type="email" 
                  placeholder="rajabubashiri75@gmail.com" 
                  required 
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "10px",
                    border: "1.5px solid #cbd5e1",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                />
              </div>

              {/* PASSWORD FIELD WITH VIEW TOGGLE */}
              <div>
                <label style={{ fontSize: "12px", fontWeight: "700", color: "#1e293b", marginBottom: "4px", display: "block" }}>
                  Nenosiri (Password)
                </label>
                <div style={{ position: "relative" }}>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    required 
                    style={{
                      width: "100%",
                      padding: "12px 42px 12px 14px",
                      borderRadius: "10px",
                      border: "1.5px solid #cbd5e1",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "18px"
                    }}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {isRegister && (
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "#1e293b", marginBottom: "4px", display: "block" }}>
                    Chagua Aina ya Akaunti
                  </label>
                  <select 
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "10px",
                      border: "1.5px solid #cbd5e1",
                      fontSize: "14px",
                      outline: "none",
                      backgroundColor: "#fff",
                      boxSizing: "border-box"
                    }}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="member">Mwanachama / Mzazi (Member)</option>
                    <option value="donor">Mfadhili / Mchangiaji (Donor)</option>
                    <option value="admin">Kiongozi wa Mfumo (Admin)</option>
                  </select>
                </div>
              )}

              <button 
                type="submit" 
                style={{
                  marginTop: "8px",
                  width: "100%",
                  padding: "14px",
                  backgroundColor: "#064e3b",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(6, 78, 59, 0.4)"
                }}
              >
                {isRegister ? "Sajili Akaunti Sasa" : "Ingia Kwenye Mfumo"}
              </button>
            </form>

            <div style={{ marginTop: "20px", paddingTop: "12px", borderTop: "1px solid #e2e8f0" }}>
              <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
                {isRegister ? "Tayari una akaunti?" : "Huna akaunti bado?"}{" "}
                <span 
                  onClick={() => setIsRegister(!isRegister)}
                  style={{ color: "#d97706", fontWeight: "bold", cursor: "pointer", textDecoration: "underline" }}
                >
                  {isRegister ? "Ingia Sasa" : "Jisajili Hapa"}
                </span>
              </p>
            </div>

            <div style={{ marginTop: "12px" }}>
              <button 
                onClick={() => navigate("/quran")}
                style={{ background: "none", border: "none", color: "#064e3b", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}
              >
                ← Rudi Mwanzo (Home)
              </button>
            </div>
          </>
        )}

      </div>

      {/* 3. UJUMBE UNONG'AA NA KUTEMBEA CHINI (BOTTOM MARQUEE) */}
      <div style={{
        width: "100%",
        backgroundColor: "#064e3b",
        color: "#f59e0b",
        padding: "10px 0",
        fontWeight: "bold",
        fontSize: "17px",
        borderTop: "2px solid #d97706"
      }}>
        <marquee behavior="scroll" direction="right" scrollamount="6">
          🌙 RABBANA HAB LABNA MIN AZWAJINA WA DHURRIYYATINA QURRATA A'YUNIN WAJ'ALNA LILMUTTAQINA IMAMA — "EWE MOLA WETU TUPATIE KATIKA WENZE WETU NA ZURRIYA ZETU TULIZO LA MANI YA MACHO" 🌙
        </marquee>
      </div>

    </div>
  );
}

export default LoginPage;