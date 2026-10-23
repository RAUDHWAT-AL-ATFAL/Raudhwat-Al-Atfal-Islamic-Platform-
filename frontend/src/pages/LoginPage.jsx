import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage({ onLogin }) {
  const [mainCategory, setMainCategory] = useState(null); 
  
  // States za Step-by-Step kwa ajili ya Viongozi 3 (Amiri, Katibu, Mwekahazina)
  const [roleStep, setRoleStep] = useState(1);
  const [roleDetected, setRoleDetected] = useState(""); 
  const [roleStepData, setRoleStepData] = useState({
    usernameInput: "",
    emailInput: "",
    passwordInput: ""
  });
  const [showRolePassword, setShowRolePassword] = useState(false);
  const [isRoleStepValid, setIsRoleStepValid] = useState(false);

  // General Member & Donor Forms state
  const [generalFormData, setGeneralFormData] = useState({ identifier: "", password: "" });
  
  // Admin Form state (Viongozi 6 maalum)
  const [adminFormData, setAdminFormData] = useState({ username: "", email: "", password: "" });
  const [adminShowPassword, setAdminShowPassword] = useState(false);
  const [isAdminValid, setIsAdminValid] = useState(false);

  // Ujumbe wa makosa na aliyeingia
  const [errorMessage, setErrorMessage] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [userRoleKey, setUserRoleKey] = useState(""); 

  const navigate = useNavigate();

  // Orodha rasmi ya Viongozi 6 
  const validAdminRoles = {
    "AMIRI": { names: ["amiri", "mwenyekiti"], email: "amiri@miradi.org", password: "amiri123", label: "AMIRI (Mwenyekiti)" },
    "AMIRATI": { names: ["amirati"], email: "amirati@miradi.org", password: "amirati123", label: "AMIRATI" },
    "KATIBU_ADMIN": { names: ["katibu", "katibu_admin"], email: "katibu.admin@miradi.org", password: "katibu123", label: "KATIBU" },
    "KATIBATI": { names: ["katibati"], email: "katibati@miradi.org", password: "katibati123", label: "KATIBATI" },
    "MWEKAHAZINA_ADMIN": { names: ["mwekahazina", "mwekahazina_admin"], email: "mwekahazina.admin@miradi.org", password: "mwekahazina123", label: "MWEKAHAZINA" },
    "AMIRI_HABARI": { names: ["habari", "amiri_habari"], email: "habari@miradi.org", password: "habari123", label: "AMIRI HABARI" }
  };

  // Live validation kwa upande wa Admin (Viongozi 6)
  const handleAdminInputChange = (field, value) => {
    const updatedForm = { ...adminFormData, [field]: value };
    setAdminFormData(updatedForm);
    setErrorMessage("");

    const uInput = updatedForm.username.trim().toLowerCase();
    const eInput = updatedForm.email.trim().toLowerCase();
    const pInput = updatedForm.password.trim();

    let matchedConfig = null;
    for (const key in validAdminRoles) {
      const config = validAdminRoles[key];
      if (config.names.includes(uInput) || config.email.toLowerCase() === eInput) {
        matchedConfig = config;
        break;
      }
    }

    if (matchedConfig && eInput === matchedConfig.email.toLowerCase() && pInput === matchedConfig.password) {
      setIsAdminValid(true);
    } else {
      setIsAdminValid(false);
    }
  };

  // Live validation kwa ajili ya Kundi la Majukumu (Viongozi 3: Katibu, Amiri/Mwenyekiti, Mwekahazina)
  const handleRoleInputChange = (field, value) => {
    setRoleStepData(prev => ({ ...prev, [field]: value }));
    setErrorMessage("");
    const val = value.trim().toLowerCase();

    if (roleStep === 1) {
      if (val === "katibu" || val === "amiri" || val === "mwenyekiti" || val === "mwekahazina") {
        setIsRoleStepValid(true);
      } else {
        setIsRoleStepValid(false);
      }
    } else if (roleStep === 2) {
      let expectedEmail = "";
      if (roleDetected === "KATIBU") expectedEmail = "katibu.admin@miradi.org";
      else if (roleDetected === "AMIRI") expectedEmail = "amiri@miradi.org";
      else if (roleDetected === "MWEKAHAZINA") expectedEmail = "mwekahazina.admin@miradi.org";

      if (val === expectedEmail) {
        setIsRoleStepValid(true);
      } else {
        setIsRoleStepValid(false);
      }
    } else if (roleStep === 3) {
      let expectedPass = "";
      if (roleDetected === "KATIBU") expectedPass = "katibu123";
      else if (roleDetected === "AMIRI") expectedPass = "amiri123";
      else if (roleDetected === "MWEKAHAZINA") expectedPass = "mwekahazina123";

      if (value.trim() === expectedPass) {
        setIsRoleStepValid(true);
      } else {
        setIsRoleStepValid(false);
      }
    }
  };

  // Kitendakazi cha kuingia kwa Admin Mkuu (Viongozi 6)
  const handleAdminSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    const uInput = adminFormData.username.trim().toLowerCase();
    const eInput = adminFormData.email.trim().toLowerCase();
    const pInput = adminFormData.password.trim();

    let matchedConfig = null;
    let matchedKey = "";

    for (const key in validAdminRoles) {
      const config = validAdminRoles[key];
      if (config.names.includes(uInput) || config.email.toLowerCase() === eInput) {
        matchedConfig = config;
        matchedKey = key;
        break;
      }
    }

    if (!matchedConfig || eInput !== matchedConfig.email.toLowerCase() || pInput !== matchedConfig.password) {
      setErrorMessage("❌ Taarifa za Admin si sahihi! Tafadhali hakikisha username, email na password zinalingana na kiongozi halali.");
      setIsAdminValid(false);
      return;
    }

    const finalData = { role: matchedKey, email: eInput };
    if (onLogin) onLogin(finalData);

    setLoggedInUser(matchedConfig.label);
    setUserRoleKey(matchedKey);
  };

  // Kitendakazi cha Step-by-Step kwa ajili ya Viongozi 3
  const handleRoleStepSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    const uInput = roleStepData.usernameInput.trim().toLowerCase();
    const eInput = roleStepData.emailInput.trim().toLowerCase();
    const pInput = roleStepData.passwordInput.trim();

    if (roleStep === 1) {
      let detected = "";
      if (uInput === "katibu") detected = "KATIBU";
      else if (uInput === "amiri" || uInput === "mwenyekiti") detected = "AMIRI";
      else if (uInput === "mwekahazina") detected = "MWEKAHAZINA";

      if (!detected) {
        setErrorMessage("❌ Jina la mtumiaji (Username) si sahihi! Tumia: katibu, amiri, au mwekahazina.");
        setIsRoleStepValid(false);
        return;
      }
      setRoleDetected(detected);
      setRoleStep(2);
      setIsRoleStepValid(false);
    } else if (roleStep === 2) {
      let expectedEmail = "";
      if (roleDetected === "KATIBU") expectedEmail = "katibu.admin@miradi.org";
      else if (roleDetected === "AMIRI") expectedEmail = "amiri@miradi.org";
      else if (roleDetected === "MWEKAHAZINA") expectedEmail = "mwekahazina.admin@miradi.org";

      if (eInput !== expectedEmail) {
        setErrorMessage(`❌ Barua pepe (Email) si sahihi kwa ajili ya ${roleDetected}. Tafadhali iandike kwa usahihi.`);
        setIsRoleStepValid(false);
        return;
      }
      setRoleStep(3);
      setIsRoleStepValid(false);
    } else if (roleStep === 3) {
      let expectedPass = "";
      if (roleDetected === "KATIBU") expectedPass = "katibu123";
      else if (roleDetected === "AMIRI") expectedPass = "amiri123";
      else if (roleDetected === "MWEKAHAZINA") expectedPass = "mwekahazina123";

      if (pInput !== expectedPass) {
        setErrorMessage("❌ Nenosiri (Password) si sahihi! Taarifa zote zimefutwa kwa usalama, tafadhali anza upya.");
        setRoleStepData({ usernameInput: "", emailInput: "", passwordInput: "" });
        setRoleStep(1);
        setRoleDetected("");
        setIsRoleStepValid(false);
        return;
      }

      const finalData = { role: roleDetected, email: eInput };
      if (onLogin) onLogin(finalData);

      setLoggedInUser(`Kiongozi wa Majukumu (${roleDetected})`);
      setUserRoleKey(roleDetected);
    }
  };

  const handleResetRoleData = () => {
    setRoleStepData({ usernameInput: "", emailInput: "", passwordInput: "" });
    setErrorMessage("");
    setRoleStep(1);
    setRoleDetected("");
    setIsRoleStepValid(false);
    setMainCategory(null);
  };

  const handleResetAdminData = () => {
    setAdminFormData({ username: "", email: "", password: "" });
    setErrorMessage("");
    setIsAdminValid(false);
    setMainCategory(null);
  };

  const inputFocusStyle = {
    width: "100%",
    padding: "15px",
    borderRadius: "12px",
    border: "3px solid #cbd5e1",
    fontSize: "16px",
    outline: "none",
    backgroundColor: "#f8fafc",
    fontWeight: "700",
    boxSizing: "border-box",
    transition: "all 0.2s ease"
  };

  const handleInputFocus = (e) => {
    e.target.style.borderColor = "#f59e0b";
    e.target.style.boxShadow = "0 0 10px rgba(245, 158, 11, 0.4)";
    e.target.style.backgroundColor = "#fff";
  };

  const handleInputBlur = (e) => {
    e.target.style.borderColor = "#cbd5e1";
    e.target.style.boxShadow = "none";
    e.target.style.backgroundColor = "#f8fafc";
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #022c22 0%, #047857 50%, #022c22 100%)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 0",
      fontFamily: "'Poppins', 'Segoe UI', sans-serif",
      overflowX: "hidden"
    }}>
      {/* 1. UJUMBE WA JUU (TOP MARQUEE) */}
      <div style={{
        width: "100%",
        backgroundColor: "#b45309",
        color: "#ffffff",
        padding: "16px 0",
        fontWeight: "900",
        fontSize: "21px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
        borderBottom: "4px solid #fbbf24",
        letterSpacing: "0.8px",
        textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
      }}>
        <marquee behavior="scroll" direction="left" scrollamount="7">
          🌟 KARIBU TENA RAUDHWات AL-ATFAL (BUSTANI YA WATOTO) 🌟 — KITUO CHA KIPEPEO CHA MAELEZO BORA YA DINI, MAADILI, QURAN NA SUNNAH — MFUMO RASMI WA UONGOZI NA WADAU 🌟
        </marquee>
      </div>

      {/* 2. KADI KUU YA LOGIN */}
      <div style={{
        backgroundColor: "#ffffff",
        width: "92%",
        maxWidth: "600px",
        borderRadius: "32px",
        boxShadow: "0 35px 70px -15px rgba(0,0,0,0.7)",
        padding: "45px 40px",
        border: "4px solid #f59e0b",
        textAlign: "center",
        margin: "25px 0",
        zIndex: 2,
        transition: "all 0.3s ease"
      }}>
        {loggedInUser ? (
          <div style={{ padding: "20px 10px" }}>
            <div style={{ fontSize: "70px", marginBottom: "15px" }}>🎉</div>
            <div style={{ fontSize: "26px", color: "#d97706", fontWeight: "900", fontFamily: "'Amiri', serif" }}>
              أَهْلًا وَسَهْلًا وَمَرْحَبًا
            </div>
            
            <h2 style={{ color: "#064e3b", fontSize: "32px", margin: "18px 0 10px 0", fontWeight: "900" }}>
              Karibu Sana, {loggedInUser}!
            </h2>
            
            <p style={{ color: "#334155", fontSize: "17px", lineHeight: "1.7", fontWeight: "600" }}>
              Akaunti yako imethibitishwa kikamilifu kupitia mfumo salama wa **Raudhwat Al-Atfal**.
            </p>

            {/* SEHEMU YA VITUFE VYA KUELEKEZA KWENYE DASHIBODI KUTOKANA NA AINA YA MTUMIAJI */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "25px" }}>
              
              {/* 1. KWA AJILI YA WANACHAMA NA WAFADHILI */}
              {(mainCategory === "MEMBER" || mainCategory === "DONOR") && (
                <button 
                  onClick={() => navigate("/donordashboard")}
                  style={{
                    width: "100%",
                    padding: "18px",
                    backgroundColor: "#064e3b",
                    color: "#fff",
                    border: "none",
                    borderRadius: "16px",
                    fontSize: "19px",
                    fontWeight: "900",
                    cursor: "pointer",
                    boxShadow: "0 8px 20px rgba(6,78,59,0.5)"
                  }}
                >
                  Nenda kwenye Donordashboard →
                </button>
              )}

              {/* 2. KWA AJILI YA VIONGOZI 3 WA MAJUKUMU (WANAWEZA KUONA VYOTE TRIPLE DASHBOARD) */}
              {mainCategory === "ROLE" && (
                <>
                  <button 
                    onClick={() => navigate("/donordashboard")}
                    style={{
                      width: "100%",
                      padding: "16px",
                      backgroundColor: "#064e3b",
                      color: "#fff",
                      border: "none",
                      borderRadius: "14px",
                      fontSize: "17px",
                      fontWeight: "900",
                      cursor: "pointer"
                    }}
                  >
                    1. Nenda Donor Dashboard 👥
                  </button>
                  <button 
                    onClick={() => navigate("/admin")}
                    style={{
                      width: "100%",
                      padding: "16px",
                      backgroundColor: "#d97706",
                      color: "#fff",
                      border: "none",
                      borderRadius: "14px",
                      fontSize: "17px",
                      fontWeight: "900",
                      cursor: "pointer"
                    }}
                  >
                    2. Nenda Admin Dashboard 📊
                  </button>
                  <button 
                    onClick={() => { window.location.href = "dashboard-viongozi.html"; }}
                    style={{
                      width: "100%",
                      padding: "16px",
                      backgroundColor: "#b45309",
                      color: "#fff",
                      border: "none",
                      borderRadius: "14px",
                      fontSize: "17px",
                      fontWeight: "900",
                      cursor: "pointer"
                    }}
                  >
                    3. Nenda Dashboard ya Viongozi (Miamala) 🔐
                  </button>
                </>
              )}

              {/* 3. KWA AJILI YA VIONGOZI 6 WA ADMIN (WANAONA DONOR NA ADMIN DASHBOARD TU) */}
              {mainCategory === "ADMIN" && (
                <>
                  <button 
                    onClick={() => navigate("/donordashboard")}
                    style={{
                      width: "100%",
                      padding: "16px",
                      backgroundColor: "#064e3b",
                      color: "#fff",
                      border: "none",
                      borderRadius: "14px",
                      fontSize: "17px",
                      fontWeight: "900",
                      cursor: "pointer"
                    }}
                  >
                    Nenda Donor Dashboard 👥
                  </button>
                  <button 
                    onClick={() => navigate("/admin")}
                    style={{
                      width: "100%",
                      padding: "16px",
                      backgroundColor: "#d97706",
                      color: "#fff",
                      border: "none",
                      borderRadius: "14px",
                      fontSize: "17px",
                      fontWeight: "900",
                      cursor: "pointer"
                    }}
                  >
                    Nenda Admin Dashboard 📊
                  </button>
                </>
              )}

            </div>
          </div>
        ) : (
          <>
            <div style={{
              fontSize: "30px",
              color: "#d97706",
              fontWeight: "bold",
              fontFamily: "'Amiri', serif",
              marginBottom: "8px"
            }}>
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </div>
            <h3 style={{ margin: "0", color: "#064e3b", fontSize: "18px", fontWeight: "800" }}>
              السَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ
            </h3>
            <h1 style={{
              fontSize: "34px",
              fontWeight: "900",
              color: "#0f172a",
              margin: "10px 0 5px 0"
            }}>
              Raudhwat Al-Atfal
            </h1>

            {/* MAKUNDI 4 MAKUU */}
            {!mainCategory ? (
              <div>
                <p style={{ fontSize: "16px", color: "#475569", marginBottom: "25px", fontWeight: "700" }}>
                  Tafadhali chagua kundi lako ili uweze kuingia kwenye mfumo kwa usalama mkubwa:
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <button 
                    onClick={() => setMainCategory("MEMBER")}
                    style={{
                      padding: "16px",
                      backgroundColor: "#ecfdf5",
                      border: "3px solid #064e3b",
                      borderRadius: "16px",
                      color: "#064e3b",
                      fontSize: "18px",
                      fontWeight: "900",
                      cursor: "pointer",
                      textAlign: "left",
                      paddingLeft: "20px"
                    }}
                  >
                    👥 1. WANACHAMA (Members)
                  </button>
                  <button 
                    onClick={() => setMainCategory("DONOR")}
                    style={{
                      padding: "16px",
                      backgroundColor: "#fffbeb",
                      border: "3px solid #d97706",
                      borderRadius: "16px",
                      color: "#b45309",
                      fontSize: "18px",
                      fontWeight: "900",
                      cursor: "pointer",
                      textAlign: "left",
                      paddingLeft: "20px"
                    }}
                  >
                    🤝 2. WAFADHILI (Donors)
                  </button>
                  <button 
                    onClick={() => { setMainCategory("ADMIN"); setIsAdminValid(false); setAdminFormData({ username: "", email: "", password: "" }); }}
                    style={{
                      padding: "16px",
                      backgroundColor: "#fef3c7",
                      border: "3px solid #d97706",
                      borderRadius: "16px",
                      color: "#92400e",
                      fontSize: "18px",
                      fontWeight: "900",
                      cursor: "pointer",
                      textAlign: "left",
                      paddingLeft: "20px"
                    }}
                  >
                    ⚙️ 3. ADMIN (Viongozi 6 Mfumo Mzima)
                  </button>
                  <button 
                    onClick={() => { setMainCategory("ROLE"); setRoleStep(1); setIsRoleStepValid(false); }}
                    style={{
                      padding: "16px",
                      backgroundColor: "#064e3b",
                      border: "3px solid #f59e0b",
                      borderRadius: "16px",
                      color: "#ffffff",
                      fontSize: "18px",
                      fontWeight: "900",
                      cursor: "pointer",
                      textAlign: "left",
                      paddingLeft: "20px"
                    }}
                  >
                    🔐 4. MAJUKUMU / VIONGOZI 3 (Step-by-Step)
                  </button>
                </div>
              </div>
            ) : mainCategory === "ADMIN" ? (
              /* ADMIN: VIONGOZI 6 MAALUM */
              <div style={{ textAlign: "left", marginTop: "15px" }}>
                <div style={{
                  backgroundColor: "#fef3c7",
                  border: "2px solid #d97706",
                  padding: "12px 15px",
                  borderRadius: "12px",
                  marginBottom: "15px",
                  fontSize: "13px",
                  fontWeight: "800",
                  color: "#92400e"
                }}>
                  🛡️ Eneo hili ni maalum kwa ajili ya viongozi 6 wa mfumo mzima.
                </div>
                {errorMessage && (
                  <div style={{
                    backgroundColor: "#fef2f2",
                    color: "#dc2626",
                    padding: "12px 15px",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: "800",
                    marginBottom: "18px",
                    border: "2px solid #fca5a5",
                    textAlign: "center"
                  }}>
                    {errorMessage}
                  </div>
                )}
                <form onSubmit={handleAdminSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label style={{ fontSize: "14px", fontWeight: "900", color: "#1e293b", marginBottom: "6px", display: "block" }}>
                      Jina la Kiongozi au Username
                    </label>
                    <input 
                      type="text" 
                      placeholder="Mfano: amiri, amirati, katibati..." 
                      required 
                      value={adminFormData.username}
                      style={inputFocusStyle}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      onChange={(e) => handleAdminInputChange("username", e.target.value)} 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "14px", fontWeight: "900", color: "#1e293b", marginBottom: "6px", display: "block" }}>
                      Barua Pepe (Email) Rasmi
                    </label>
                    <input 
                      type="email" 
                      placeholder="Weka email husika ya kiongozi..." 
                      required 
                      value={adminFormData.email}
                      style={inputFocusStyle}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      onChange={(e) => handleAdminInputChange("email", e.target.value)} 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "14px", fontWeight: "900", color: "#1e293b", marginBottom: "6px", display: "block" }}>
                      Nenosiri (Password)
                    </label>
                    <div style={{ position: "relative" }}>
                      <input 
                        type={adminShowPassword ? "text" : "password"} 
                        placeholder="Weka nenosiri lako..." 
                        required 
                        value={adminFormData.password}
                        style={{ ...inputFocusStyle, paddingRight: "50px" }}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        onChange={(e) => handleAdminInputChange("password", e.target.value)} 
                      />
                      <button 
                        type="button"
                        onClick={() => setAdminShowPassword(!adminShowPassword)}
                        style={{
                          position: "absolute",
                          right: "14px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "22px"
                        }}
                      >
                        {adminShowPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                    <button 
                      type="button"
                      onClick={handleResetAdminData}
                      style={{
                        flex: 1,
                        padding: "15px",
                        backgroundColor: "#64748b",
                        color: "#fff",
                        border: "none",
                        borderRadius: "12px",
                        fontSize: "16px",
                        fontWeight: "900",
                        cursor: "pointer"
                      }}
                    >
                      ← Rudi Nyuma
                    </button>
                    <button 
                      type="submit" 
                      disabled={!isAdminValid}
                      style={{
                        flex: 2,
                        padding: "15px",
                        backgroundColor: isAdminValid ? "#064e3b" : "#94a3b8",
                        color: "#ffffff",
                        border: "3px solid",
                        borderColor: isAdminValid ? "#f59e0b" : "#cbd5e1",
                        borderRadius: "12px",
                        fontSize: "17px",
                        fontWeight: "900",
                        cursor: isAdminValid ? "pointer" : "not-allowed",
                        opacity: isAdminValid ? 1 : 0.7
                      }}
                    >
                      Ingia Sasa 🚀
                    </button>
                  </div>
                </form>
              </div>
            ) : mainCategory === "ROLE" ? (
              /* MAJUKUMU: STEP-BY-STEP YA VIONGOZI 3 */
              <div style={{ textAlign: "left", marginTop: "15px" }}>
                <div style={{
                  backgroundColor: "#f0fdf4",
                  border: "2px solid #10b981",
                  padding: "12px 15px",
                  borderRadius: "12px",
                  marginBottom: "15px",
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "#064e3b"
                }}>
                  ✨ Jaza taarifa sahihi kwa kila hatua (Viongozi 3: Katibu, Amiri/Mwenyekiti, Mwekahazina).
                </div>
                {errorMessage && (
                  <div style={{
                    backgroundColor: "#fef2f2",
                    color: "#dc2626",
                    padding: "12px 15px",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: "800",
                    marginBottom: "18px",
                    border: "2px solid #fca5a5",
                    textAlign: "center"
                  }}>
                    {errorMessage}
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "18px", fontSize: "14px", fontWeight: "900", color: "#064e3b" }}>
                  <span>Hatua ya {roleStep} kati ya 3</span>
                  <span>{roleStep === 1 ? "Jina la Mtumiaji" : roleStep === 2 ? "Barua Pepe" : "Nenosiri"}</span>
                </div>
                <form onSubmit={handleRoleStepSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  {roleStep === 1 && (
                    <div>
                      <label style={{ fontSize: "14px", fontWeight: "900", color: "#1e293b", marginBottom: "6px", display: "block" }}>
                        1. Andika Jina la Mtumiaji (Username):
                      </label>
                      <input 
                        type="text" 
                        placeholder="Mfano: katibu, amiri, mwekahazina..." 
                        required 
                        value={roleStepData.usernameInput}
                        style={inputFocusStyle}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        onChange={(e) => handleRoleInputChange("usernameInput", e.target.value)} 
                      />
                    </div>
                  )}
                  {roleStep === 2 && (
                    <div>
                      <label style={{ fontSize: "14px", fontWeight: "900", color: "#1e293b", marginBottom: "6px", display: "block" }}>
                        2. Andika Barua Pepe (Email) ya <span style={{ color: "#d97706" }}>{roleDetected}</span>:
                      </label>
                      <input 
                        type="email" 
                        placeholder="Weka barua pepe husika..." 
                        required 
                        value={roleStepData.emailInput}
                        style={inputFocusStyle}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        onChange={(e) => handleRoleInputChange("emailInput", e.target.value)} 
                      />
                    </div>
                  )}
                  {roleStep === 3 && (
                    <div>
                      <label style={{ fontSize: "14px", fontWeight: "900", color: "#1e293b", marginBottom: "6px", display: "block" }}>
                        3. Andika Nenosiri Lako:
                      </label>
                      <div style={{ position: "relative" }}>
                        <input 
                          type={showRolePassword ? "text" : "password"} 
                          placeholder="Weka nenosiri..." 
                          required 
                          value={roleStepData.passwordInput}
                          style={{ ...inputFocusStyle, paddingRight: "50px" }}
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                          onChange={(e) => handleRoleInputChange("passwordInput", e.target.value)} 
                        />
                        <button 
                          type="button"
                          onClick={() => setShowRolePassword(!showRolePassword)}
                          style={{
                            position: "absolute",
                            right: "14px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "22px"
                          }}
                        >
                          {showRolePassword ? "🙈" : "👁️"}
                        </button>
                      </div>
                    </div>
                  )}
                  <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                    <button 
                      type="button"
                      onClick={() => {
                        if (roleStep > 1) {
                          setRoleStep(roleStep - 1);
                          setIsRoleStepValid(true);
                          setErrorMessage("");
                        } else {
                          handleResetRoleData();
                        }
                      }}
                      style={{
                        flex: 1,
                        padding: "15px",
                        backgroundColor: "#64748b",
                        color: "#fff",
                        border: "none",
                        borderRadius: "12px",
                        fontSize: "16px",
                        fontWeight: "900",
                        cursor: "pointer"
                      }}
                    >
                      ← Rudi Nyuma
                    </button>
                    <button 
                      type="submit" 
                      disabled={!isRoleStepValid}
                      style={{
                        flex: 2,
                        padding: "15px",
                        backgroundColor: isRoleStepValid ? "#064e3b" : "#94a3b8",
                        color: "#ffffff",
                        border: "3px solid",
                        borderColor: isRoleStepValid ? "#f59e0b" : "#cbd5e1",
                        borderRadius: "12px",
                        fontSize: "17px",
                        fontWeight: "900",
                        cursor: isRoleStepValid ? "pointer" : "not-allowed",
                        opacity: isRoleStepValid ? 1 : 0.7
                      }}
                    >
                      {roleStep === 3 ? "Ingia Sasa 🚀" : "Endelea →"}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* WANACHAMA AU WAFADHILI (WANAINGIA NA KUELEKEZWA DONORDASHBOARD) */
              <div style={{ textAlign: "left", marginTop: "15px" }}>
                <h3 style={{ color: "#064e3b", fontSize: "18px", marginBottom: "15px", fontWeight: "900" }}>
                  Ingia kama: {mainCategory === "MEMBER" ? "Mwanachama" : "Mfadhili (Donor)"}
                </h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const labelUser = mainCategory === "MEMBER" ? "Mwanachama" : "Mfadhili";
                  setLoggedInUser(labelUser);
                  setUserRoleKey(mainCategory);
                }} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label style={{ fontSize: "14px", fontWeight: "900", color: "#1e293b", marginBottom: "6px", display: "block" }}>
                      Barua Pepe au Namba ya Simu
                    </label>
                    <input 
                      type="text" 
                      placeholder="Weka email au namba ya simu..." 
                      required 
                      style={inputFocusStyle}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      onChange={(e) => setGeneralFormData({ ...generalFormData, identifier: e.target.value })} 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "14px", fontWeight: "900", color: "#1e293b", marginBottom: "6px", display: "block" }}>
                      Nenosiri (Password)
                    </label>
                    <input 
                      type="password" 
                      placeholder="Weka nenosiri lako..." 
                      required 
                      style={inputFocusStyle}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      onChange={(e) => setGeneralFormData({ ...generalFormData, password: e.target.value })} 
                    />
                  </div>
                  <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                    <button 
                      type="button"
                      onClick={() => setMainCategory(null)}
                      style={{
                        flex: 1,
                        padding: "15px",
                        backgroundColor: "#64748b",
                        color: "#fff",
                        border: "none",
                        borderRadius: "12px",
                        fontSize: "16px",
                        fontWeight: "900",
                        cursor: "pointer"
                      }}
                    >
                      ← Rudi Nyuma
                    </button>
                    <button 
                      type="submit" 
                      style={{
                        flex: 2,
                        padding: "15px",
                        backgroundColor: "#064e3b",
                        color: "#ffffff",
                        border: "3px solid #f59e0b",
                        borderRadius: "12px",
                        fontSize: "17px",
                        fontWeight: "900",
                        cursor: "pointer"
                      }}
                    >
                      Ingia Sasa 🚀
                    </button>
                  </div>
                </form>
              </div>
            )}
            <div style={{ marginTop: "20px" }}>
              <button 
  onClick={() => { window.location.href = "/"; }} 
  style={{ background: "none", border: "none", color: "#064e3b", fontSize: "14px", fontWeight: "900", cursor: "pointer" }}
>
  ← Rudi Kurasa Kuu (Home)
</button>
            </div>
          </>
        )}
      </div>

      {/* 3. UJUMBE WA CHINI */}
      <div style={{
        width: "100%",
        backgroundColor: "#064e3b",
        color: "#fbbf24",
        padding: "16px 0",
        fontWeight: "900",
        fontSize: "20px",
        borderTop: "4px solid #b45309",
        textShadow: "2px 2px 4px rgba(0,0,0,0.5)"
      }}>
        <marquee behavior="scroll" direction="right" scrollamount="6">
          🌙 RABBANA HAB LANA MIN AZWAJINA WA DHURRIYYATINA QURRATA A'YUNIN WAJ'ALNA LILMUTTAQINA IMAMA — "EWE MOLA WETU TUPATIE KATIKA WENZE WETU NA ZURRIYA ZETU TULIZO LA MANI YA MACHO" 🌙
        </marquee>
      </div>
    </div>
  );
}

export default LoginPage;
