import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// MANDHARI 5 ZA HD VIBRANT (HIGH CONTRAST FOR LARGE FONTS)
const THEMES = {
  goldEmerald: {
    name: "Gold & Emerald Luxe 🌟",
    pageBg: "radial-gradient(circle at 50% -20%, #064e3b 0%, #022c22 60%, #011710 100%)",
    cardBg: "rgba(6, 78, 59, 0.75)",
    cardBorder: "1.5px solid rgba(234, 179, 8, 0.6)",
    textColor: "#ffffff",
    bismillahColor: "#facc15",
    titleColor: "#ffffff",
    subtitleColor: "#6ee7b7",
    dividerColor: "linear-gradient(90deg, transparent, #facc15, #10b981, transparent)",
    accentColor: "#facc15",
    inputBg: "rgba(2, 44, 34, 0.9)",
  },
  sapphireNight: {
    name: "Sapphire Arabic Night 💎",
    pageBg: "radial-gradient(circle at 50% -20%, #1e1b4b 0%, #0f172a 60%, #020617 100%)",
    cardBg: "rgba(30, 27, 75, 0.8)",
    cardBorder: "1.5px solid rgba(56, 189, 248, 0.6)",
    textColor: "#ffffff",
    bismillahColor: "#38bdf8",
    titleColor: "#ffffff",
    subtitleColor: "#a5b4fc",
    dividerColor: "linear-gradient(90deg, transparent, #38bdf8, #818cf8, transparent)",
    accentColor: "#38bdf8",
    inputBg: "rgba(15, 23, 42, 0.9)",
  },
  sunsetGlow: {
    name: "Sunset Mosque Glow 🌅",
    pageBg: "radial-gradient(circle at 50% -20%, #451a03 0%, #1c0a00 60%, #0c0400 100%)",
    cardBg: "rgba(69, 26, 3, 0.8)",
    cardBorder: "1.5px solid rgba(251, 146, 60, 0.6)",
    textColor: "#ffffff",
    bismillahColor: "#fb923c",
    titleColor: "#ffffff",
    subtitleColor: "#fde047",
    dividerColor: "linear-gradient(90deg, transparent, #fb923c, #fde047, transparent)",
    accentColor: "#f97316",
    inputBg: "rgba(28, 10, 0, 0.9)",
  },
  neonForest: {
    name: "Neon Forest & Mint 🌿",
    pageBg: "radial-gradient(circle at 50% -20%, #022c22 0%, #051e17 60%, #010d0a 100%)",
    cardBg: "rgba(5, 30, 23, 0.85)",
    cardBorder: "1.5px solid rgba(52, 211, 153, 0.6)",
    textColor: "#ffffff",
    bismillahColor: "#34d399",
    titleColor: "#ffffff",
    subtitleColor: "#a7f3d0",
    dividerColor: "linear-gradient(90deg, transparent, #34d399, #059669, transparent)",
    accentColor: "#10b981",
    inputBg: "rgba(1, 13, 10, 0.9)",
  },
  royalViolet: {
    name: "Royal Violet & Rose Gold 🔮",
    pageBg: "radial-gradient(circle at 50% -20%, #4c1d95 0%, #2e1065 60%, #0f051d 100%)",
    cardBg: "rgba(76, 29, 149, 0.75)",
    cardBorder: "1.5px solid rgba(244, 114, 182, 0.6)",
    textColor: "#ffffff",
    bismillahColor: "#f472b6",
    titleColor: "#ffffff",
    subtitleColor: "#e9d5ff",
    dividerColor: "linear-gradient(90deg, transparent, #f472b6, #c084fc, transparent)",
    accentColor: "#f472b6",
    inputBg: "rgba(15, 5, 29, 0.9)",
  }
};

// MIRADI YA LAZIMA KUSIMAMISHA MFUMO (FALLBACK PROJECTS)
const DEFAULT_PROJECTS = [
  { id: "p1", kichwa: "1. Akiba / Kuanzia", lengoLaMchango: 5000000, kiasiKilichopatikana: 1200000 },
  { id: "p2", kichwa: "2. Vifaa vya Shule", lengoLaMchango: 3000000, kiasiKilichopatikana: 1100000 },
  { id: "p3", kichwa: "3. Ramadhani", lengoLaMchango: 10000000, kiasiKilichopatikana: 6500000 },
  { id: "p4", kichwa: "4. Eidy Al-Fitr", lengoLaMchango: 4000000, kiasiKilichopatikana: 3200000 },
  { id: "p5", kichwa: "5. Eidy Al-Hajj", lengoLaMchango: 6000000, kiasiKilichopatikana: 1500000 }
];

// ORODHA YA WANACHAMA WALIOJISAJILI NA MICHANGO YAO (ADMIN DATA)
const INITIAL_MEMBERS = [
  { id: 1, name: "Rajabu Bashiri", email: "rajabubashiri75@gmail.com", role: "admin", date: "2026-03-01", status: "Active" },
  { id: 2, name: "Sheikh Abdallah", email: "abdallah@raudhwat.org", role: "donor", date: "2026-03-02", status: "Active" },
  { id: 3, name: "Ustadh Juma", email: "juma@raudhwat.org", role: "member", date: "2026-03-03", status: "Active" }
];

const INITIAL_DONATION_LOGS = [
  { id: "TX101", donorName: "Rajabu Bashiri", email: "rajabubashiri75@gmail.com", project: "Vifaa vya Shule", amount: 150000, network: "M-Pesa", date: "2026-03-01 10:30 AM", status: "Imethibitishwa" },
  { id: "TX102", donorName: "Sheikh Abdallah", email: "abdallah@raudhwat.org", project: "Ramadhani", amount: 500000, network: "TigoPesa", date: "2026-03-02 02:15 PM", status: "Imethibitishwa" },
  { id: "TX103", donorName: "Ustadh Juma", email: "juma@raudhwat.org", project: "Eidy Al-Fitr", amount: 200000, network: "AirtelMoney", date: "2026-03-03 09:00 AM", status: "Imethibitishwa" }
];

function DonorDashboard() {
  const navigate = useNavigate();

  // Theme State
  const [currentTheme, setCurrentTheme] = useState(() => localStorage.getItem("app_theme_v3") || "goldEmerald");
  const theme = THEMES[currentTheme] || THEMES.goldEmerald;

  // View Mode: 'projects' | 'members' | 'donations'
  const [activeTab, setActiveTab] = useState("projects");

  // State ya Miradi na Jumla ya Pesa
  const [projectsList, setProjectsList] = useState(DEFAULT_PROJECTS);
  const [totalRaudhwatCash, setTotalRaudhwatCash] = useState(13500000);

  // Admin Data State
  const [membersList, setMembersList] = useState(INITIAL_MEMBERS);
  const [donationLogs, setDonationLogs] = useState(INITIAL_DONATION_LOGS);

  // Form Modal / View Control
  const [showFormModal, setShowFormModal] = useState(false);
  const [step, setStep] = useState(1);

  // Form Fields
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("p1");
  const [amount, setAmount] = useState("");
  const [paymentCategory, setPaymentCategory] = useState("mobile");
  const [network, setNetwork] = useState("M-Pesa");
  const [mkobaAccount, setMkobaAccount] = useState("M-KOBA-RAUDHWAT-9082");
  const [pinCode, setPinCode] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [lastReceipt, setLastReceipt] = useState(null);

  // BACKEND API CALL CONNECTION
  useEffect(() => {
    const MY_REAL_DONOR_ID = "6a9432cc8df6e354b4fb8b49";
    const activeDonorId = localStorage.getItem("donorId") || MY_REAL_DONOR_ID;

    axios.get(`http://localhost:5000/api/donors/dashboard/${activeDonorId}`)
      .then((res) => {
        if (res.data && res.data.projects) {
          setProjectsList(res.data.projects);
        }
        if (res.data && res.data.totalCash) {
          setTotalRaudhwatCash(res.data.totalCash);
        }
      })
      .catch((err) => {
        console.warn("Backend 404/Error: Mfumo unatumia Local Default Projects ili progress bar zionekane.", err);
      });
  }, []);

  // HESABU ASILIMIA NA RANGI YA PROGRESS BAR
  const getProgressBarColor = (percentage) => {
    if (percentage <= 24) return "#ef4444"; // 0% - 24%: RED
    if (percentage <= 49) return "#f97316"; // 25% - 49%: ORANGE
    if (percentage <= 74) return "#facc15"; // 50% - 74%: YELLOW
    return "#22c55e";                       // 75% - 100%: GREEN
  };

  // VALIDATION YA HATUA NA HATUA
  const handleNextStep = () => {
    if (step === 1) {
      if (!donorName.trim()) { alert("Tafadhali ingiza jina yako kamili!"); return; }
      if (!phoneNumber || phoneNumber.length < 10) { alert("Tafadhali ingiza namba sahihi ya simu!"); return; }
      setStep(2);
    } else if (step === 2) {
      if (!amount || Number(amount) <= 0) { alert("Tafadhali ingiza kiasi halali cha mchango!"); return; }
      setStep(3);
    }
  };

  // UTHIBITISHO WA MALIPO, UPDATE PROJECTS & LOGS
  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (!pinCode || pinCode.length < 4) {
      alert("Tafadhali ingiza Namba ya Siri (PIN) ili kuthibitisha muamala!");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const donatedVal = Number(amount);

      // 1. Ongeza Fedha Taslimu
      setTotalRaudhwatCash((prev) => prev + donatedVal);

      // 2. Update Progress Bar za Miradi
      const updatedProjects = projectsList.map((p) => {
        if (p.id === selectedProjectId) {
          return { ...p, kiasiKilichopatikana: p.kiasiKilichopatikana + donatedVal };
        }
        return p;
      });
      setProjectsList(updatedProjects);

      // 3. Rekodi Kwenye Logs za Admin Dashboard
      const targetProj = projectsList.find((p) => p.id === selectedProjectId);
      const newLog = {
        id: "TX" + Math.floor(100 + Math.random() * 900),
        donorName,
        email: donorEmail || "hakuna_email@raudhwat.org",
        project: targetProj ? targetProj.kichwa : "Mchango wa Raudhwat",
        amount: donatedVal,
        network: paymentCategory === "mobile" ? network : "Card Payment",
        date: new Date().toLocaleDateString("sw-TZ") + " " + new Date().toLocaleTimeString("sw-TZ"),
        status: "Imethibitishwa"
      };

      setDonationLogs((prev) => [newLog, ...prev]);

      // 4. Ongeza kwenye Wanachama kama hajayupo
      const exists = membersList.some((m) => m.email === donorEmail || m.name === donorName);
      if (!exists) {
        setMembersList((prev) => [
          ...prev,
          { id: prev.length + 1, name: donorName, email: donorEmail || `${donorName.toLowerCase().replace(/\s+/g, '')}@gmail.com`, role: "donor", date: new Date().toLocaleDateString("sw-TZ"), status: "Active" }
        ]);
      }

      // Risiti
      const receiptData = {
        receiptNo: "RATFAL-" + Math.floor(100000 + Math.random() * 900000),
        donorName,
        projectName: targetProj ? targetProj.kichwa : "Mchango wa Raudhwat",
        amount: donatedVal,
        network: paymentCategory === "mobile" ? network : "Card Payment",
        phone: phoneNumber,
        account: mkobaAccount,
        date: new Date().toLocaleDateString("sw-TZ"),
        time: new Date().toLocaleTimeString("sw-TZ")
      };

      setLastReceipt(receiptData);
      setIsSubmitting(false);
      setPaymentSuccess(true);
    }, 1500);
  };

  const closeAndResetModal = () => {
    setShowFormModal(false);
    setStep(1);
    setAmount("");
    setPinCode("");
    setPaymentSuccess(false);
  };

  return (
    <div style={{ ...styles.pageWrapper, background: theme.pageBg, color: theme.textColor }}>
      <div style={styles.container}>
        
        {/* TOP BAR & THEME SELECTOR */}
        <div style={{ ...styles.topBar, border: theme.cardBorder }}>
          <div style={styles.themeBtnGroup}>
            <span style={{ fontSize: "12px", fontWeight: "900", color: "#facc15" }}>🎨 BADILISHA MANDHARI:</span>
            {Object.keys(THEMES).map((key) => (
              <button
                key={key}
                onClick={() => { setCurrentTheme(key); localStorage.setItem("app_theme_v3", key); }}
                style={{
                  ...styles.themeBtn,
                  backgroundColor: currentTheme === key ? theme.accentColor : "rgba(255,255,255,0.12)",
                  border: currentTheme === key ? `2px solid #ffffff` : "1px solid rgba(255,255,255,0.2)",
                  color: currentTheme === key ? "#000" : "#fff",
                }}
              >
                {THEMES[key].name}
              </button>
            ))}
          </div>
          <button onClick={() => navigate("/login")} style={styles.logoutBtn}>🚪 Ondoka</button>
        </div>

        {/* BRANDING HEADER */}
        <header style={styles.header}>
          <p style={{ ...styles.bismillah, color: theme.bismillahColor }}>بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</p>
          <h1 style={{ ...styles.title, color: theme.titleColor }}>RAUDHWAT AL-ATFAL</h1>
          <p style={{ ...styles.subtitle, color: theme.subtitleColor }}>Mfumo Rasmi wa Mchango wa Sadaka, Miradi na Usimamizi wa Wanachama</p>
          <div style={{ ...styles.goldDivider, background: theme.dividerColor }}></div>
        </header>

        {/* ADMIN CONTROL TABS (SWITCHER BETWEEN DONOR & ADMIN VIEWS) */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("projects")}
            style={{
              padding: "12px 22px",
              borderRadius: "12px",
              border: activeTab === "projects" ? `2px solid ${theme.accentColor}` : "1px solid rgba(255,255,255,0.2)",
              backgroundColor: activeTab === "projects" ? theme.accentColor : "rgba(0,0,0,0.4)",
              color: activeTab === "projects" ? "#000" : "#fff",
              fontWeight: "900",
              fontSize: "14px",
              cursor: "pointer",
              boxShadow: activeTab === "projects" ? "0 4px 15px rgba(250, 204, 21, 0.4)" : "none"
            }}
          >
            📊 Miradi & Progress Bars
          </button>

          <button
            onClick={() => setActiveTab("members")}
            style={{
              padding: "12px 22px",
              borderRadius: "12px",
              border: activeTab === "members" ? `2px solid ${theme.accentColor}` : "1px solid rgba(255,255,255,0.2)",
              backgroundColor: activeTab === "members" ? theme.accentColor : "rgba(0,0,0,0.4)",
              color: activeTab === "members" ? "#000" : "#fff",
              fontWeight: "900",
              fontSize: "14px",
              cursor: "pointer",
              boxShadow: activeTab === "members" ? "0 4px 15px rgba(250, 204, 21, 0.4)" : "none"
            }}
          >
            👥 Wanachama Waliojisajili ({membersList.length})
          </button>

          <button
            onClick={() => setActiveTab("donations")}
            style={{
              padding: "12px 22px",
              borderRadius: "12px",
              border: activeTab === "donations" ? `2px solid ${theme.accentColor}` : "1px solid rgba(255,255,255,0.2)",
              backgroundColor: activeTab === "donations" ? theme.accentColor : "rgba(0,0,0,0.4)",
              color: activeTab === "donations" ? "#000" : "#fff",
              fontWeight: "900",
              fontSize: "14px",
              cursor: "pointer",
              boxShadow: activeTab === "donations" ? "0 4px 15px rgba(250, 204, 21, 0.4)" : "none"
            }}
          >
            💰 Kumbukumbu za Michango ({donationLogs.length})
          </button>
        </div>

        {/* 1. FEDHA TASLIMU ZA RAUDHWAT AL ATFAL (TOTAL CASH HEADER) */}
        <div style={styles.cashHeaderCard}>
          <div>
            <p style={{ margin: 0, fontSize: "13px", fontWeight: "800", color: "#facc15", textTransform: "uppercase", letterSpacing: "1px" }}>
              💵 JUMLA YA FEDHA TASLIMU ZA RAUDHWAT AL ATFAL
            </p>
            <h2 style={{ margin: "6px 0 0 0", fontSize: "38px", fontWeight: "900", color: "#ffffff", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
              TZS {totalRaudhwatCash.toLocaleString()}
            </h2>
          </div>
          <div style={{ fontSize: "50px" }}>🤲</div>
        </div>

        {/* VIEW 1: MIRADI NA PROGRESS BARS */}
        {activeTab === "projects" && (
          <div style={{ ...styles.card, background: theme.cardBg, border: theme.cardBorder, marginBottom: "24px" }}>
            <div style={styles.cardHeader}>
              <span style={{ fontSize: "28px" }}>📊</span>
              <div>
                <h2 style={{ ...styles.cardTitle, color: theme.titleColor, fontSize: "20px" }}>Hali ya Michango na Progress Bars za Miradi</h2>
                <p style={{ margin: 0, fontSize: "13px", color: theme.subtitleColor, fontWeight: "600" }}>
                  Fedha taslimu na Asilimia za Kila Mradi
                </p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))", gap: "20px", marginTop: "24px" }}>
              {projectsList.map((p) => {
                const percentage = Math.min(Math.round((p.kiasiKilichopatikana / p.lengoLaMchango) * 100), 100);
                const barColor = getProgressBarColor(percentage);

                return (
                  <div key={p.id} style={{ ...styles.projectCardBox, backgroundColor: "rgba(0,0,0,0.45)", border: "1.5px solid rgba(255,255,255,0.15)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "900", color: "#ffffff" }}>{p.kichwa}</h3>
                      <span style={{ fontSize: "18px", fontWeight: "900", color: barColor, textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>{percentage}%</span>
                    </div>

                    {/* PROGRESS BAR TRACK & DYNAMIC COLOR FILL */}
                    <div style={styles.progressTrack}>
                      <div style={{ ...styles.progressBarFill, width: `${percentage}%`, backgroundColor: barColor }} />
                    </div>

                    <div style={styles.projectFooter}>
                      <div>
                        <span style={{ display: "block", fontSize: "11px", color: "#cbd5e1", fontWeight: "800" }}>FEDHA TASLIMU:</span>
                        <strong style={{ fontSize: "15px", color: "#34d399", fontWeight: "900" }}>TZS {p.kiasiKilichopatikana.toLocaleString()}</strong>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ display: "block", fontSize: "11px", color: "#cbd5e1", fontWeight: "800" }}>LENGO LA MRADI:</span>
                        <span style={{ fontSize: "14px", color: "#facc15", fontWeight: "900" }}>TZS {p.lengoLaMchango.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* BUTTON YA DONATE */}
            <div style={{ textAlign: "center", marginTop: "30px" }}>
              <button
                onClick={() => setShowFormModal(true)}
                style={{ ...styles.donateMainBtn, backgroundColor: theme.accentColor, color: "#000" }}
              >
                ❤️ DONATE / TOA MCHANGO SASA
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: ADMIN - WANACHAMA WALIOJISAJILI */}
        {activeTab === "members" && (
          <div style={{ ...styles.card, background: theme.cardBg, border: theme.cardBorder, marginBottom: "24px" }}>
            <div style={styles.cardHeader}>
              <span style={{ fontSize: "28px" }}>👥</span>
              <div>
                <h2 style={{ ...styles.cardTitle, color: theme.titleColor, fontSize: "20px" }}>Orodha ya Wanachama Waliojisajili (Registration Details)</h2>
                <p style={{ margin: 0, fontSize: "13px", color: theme.subtitleColor, fontWeight: "600" }}>Taarifa za Kila Mwanachama Kwenye Mfumo</p>
              </div>
            </div>

            <div style={{ overflowX: "auto", marginTop: "20px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #facc15", color: "#facc15", fontSize: "14px" }}>
                    <th style={{ padding: "14px" }}># ID</th>
                    <th style={{ padding: "14px" }}>JINA KAMILI</th>
                    <th style={{ padding: "14px" }}>EMAIL / BARUA PEPE</th>
                    <th style={{ padding: "14px" }}>WADHIFS (ROLE)</th>
                    <th style={{ padding: "14px" }}>TAREGHE YA USAJILI</th>
                    <th style={{ padding: "14px" }}>HALI</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: "14px" }}>
                  {membersList.map((m) => (
                    <tr key={m.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.2)" }}>
                      <td style={{ padding: "14px", fontWeight: "900", color: "#facc15" }}>#{m.id}</td>
                      <td style={{ padding: "14px", fontWeight: "900", color: "#ffffff" }}>{m.name}</td>
                      <td style={{ padding: "14px", color: "#cbd5e1" }}>{m.email}</td>
                      <td style={{ padding: "14px" }}>
                        <span style={{
                          backgroundColor: m.role === "admin" ? "#d97706" : m.role === "donor" ? "#059669" : "#2563eb",
                          padding: "6px 12px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: "900",
                          color: "#ffffff",
                          textTransform: "uppercase"
                        }}>
                          {m.role}
                        </span>
                      </td>
                      <td style={{ padding: "14px", color: "#e2e8f0" }}>{m.date}</td>
                      <td style={{ padding: "14px", color: "#34d399", fontWeight: "900" }}>● {m.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 3: ADMIN - KUMBUKUMBU ZA MICHANGO YA KILA MWANACHAMA */}
        {activeTab === "donations" && (
          <div style={{ ...styles.card, background: theme.cardBg, border: theme.cardBorder, marginBottom: "24px" }}>
            <div style={styles.cardHeader}>
              <span style={{ fontSize: "28px" }}>💰</span>
              <div>
                <h2 style={{ ...styles.cardTitle, color: theme.titleColor, fontSize: "20px" }}>Kumbukumbu na Taarifa za Michango Yote</h2>
                <p style={{ margin: 0, fontSize: "13px", color: theme.subtitleColor, fontWeight: "600" }}>Kila Mchango na Mchangiaji Wake</p>
              </div>
            </div>

            <div style={{ overflowX: "auto", marginTop: "20px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #facc15", color: "#facc15", fontSize: "14px" }}>
                    <th style={{ padding: "14px" }}>TX ID</th>
                    <th style={{ padding: "14px" }}>MCHANGIAJI</th>
                    <th style={{ padding: "14px" }}>EMAIL</th>
                    <th style={{ padding: "14px" }}>MRADI</th>
                    <th style={{ padding: "14px" }}>KIASI (TZS)</th>
                    <th style={{ padding: "14px" }}>MTANDAO</th>
                    <th style={{ padding: "14px" }}>TAREGHE & MUDA</th>
                    <th style={{ padding: "14px" }}>HALI YA MALIPO</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: "14px" }}>
                  {donationLogs.map((log) => (
                    <tr key={log.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.2)" }}>
                      <td style={{ padding: "14px", fontWeight: "900", color: "#38bdf8" }}>{log.id}</td>
                      <td style={{ padding: "14px", fontWeight: "900", color: "#ffffff" }}>{log.donorName}</td>
                      <td style={{ padding: "14px", color: "#cbd5e1" }}>{log.email}</td>
                      <td style={{ padding: "14px", fontWeight: "800", color: "#6ee7b7" }}>{log.project}</td>
                      <td style={{ padding: "14px", fontWeight: "900", color: "#facc15", fontSize: "15px" }}>TZS {log.amount.toLocaleString()}</td>
                      <td style={{ padding: "14px", color: "#e2e8f0" }}>{log.network}</td>
                      <td style={{ padding: "14px", color: "#cbd5e1", fontSize: "12px" }}>{log.date}</td>
                      <td style={{ padding: "14px" }}>
                        <span style={{ backgroundColor: "#059669", color: "#fff", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "900" }}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODAL YA KUJISAJILI & KUFANYA MALIPO (STEP-BY-STEP PAYMENT WIZARD) */}
        {showFormModal && (
          <div style={styles.modalOverlay}>
            <div style={{ ...styles.modalContent, background: theme.cardBg, border: theme.cardBorder }}>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0, color: theme.titleColor, fontSize: "18px", fontWeight: "900" }}>
                  {paymentSuccess ? "✅ Mchango Umekamilika" : `Form ya Mchango - Hatua ya ${step} kati ya 3`}
                </h3>
                <button onClick={closeAndResetModal} style={styles.closeBtn}>✖</button>
              </div>

              {!paymentSuccess ? (
                <form style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  
                  {/* HATUA YA 1: TAARIFA ZA DONOR (USAJILI) */}
                  {step === 1 && (
                    <>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Jina Yako Kamili *</label>
                        <input
                          type="text"
                          placeholder="Mfano: Sheikh Abdallah"
                          value={donorName}
                          onChange={(e) => setDonorName(e.target.value)}
                          style={{ ...styles.input, backgroundColor: theme.inputBg, color: theme.textColor }}
                        />
                      </div>

                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Namba ya Simu *</label>
                        <input
                          type="text"
                          placeholder="07XXXXXXXX au 06XXXXXXXX"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          style={{ ...styles.input, backgroundColor: theme.inputBg, color: theme.textColor }}
                        />
                      </div>

                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Barua Pepe / Email (Sio lazima)</label>
                        <input
                          type="email"
                          placeholder="donor@example.com"
                          value={donorEmail}
                          onChange={(e) => setDonorEmail(e.target.value)}
                          style={{ ...styles.input, backgroundColor: theme.inputBg, color: theme.textColor }}
                        />
                      </div>

                      <button type="button" onClick={handleNextStep} style={{ ...styles.actionBtn, backgroundColor: theme.accentColor, color: "#000" }}>
                        Endelea Chagua Mradi ➡️
                      </button>
                    </>
                  )}

                  {/* HATUA YA 2: CHAGUA MRADI & KIASI */}
                  {step === 2 && (
                    <>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Chagua Mradi Unaotaka Kuchangia *</label>
                        <select
                          value={selectedProjectId}
                          onChange={(e) => setSelectedProjectId(e.target.value)}
                          style={{ ...styles.input, backgroundColor: theme.inputBg, color: theme.textColor }}
                        >
                          {projectsList.map((p) => (
                            <option key={p.id} value={p.id} style={{ background: "#0f172a", color: "#fff" }}>
                              {p.kichwa}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Kiasi cha Mchango (TZS) *</label>
                        <input
                          type="number"
                          placeholder="Mfano: 50000"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          style={{ ...styles.input, backgroundColor: theme.inputBg, color: theme.textColor }}
                        />
                      </div>

                      <div style={{ display: "flex", gap: "10px" }}>
                        <button type="button" onClick={() => setStep(1)} style={styles.backBtn}>⬅️ Nyuma</button>
                        <button type="button" onClick={handleNextStep} style={{ ...styles.actionBtn, backgroundColor: theme.accentColor, color: "#000" }}>
                          Endelea kwenye Malipo ➡️
                        </button>
                      </div>
                    </>
                  )}

                  {/* HATUA YA 3: NJIA YA MALIPO & PIN CONFIRMATION */}
                  {step === 3 && (
                    <>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Njia ya Malipo</label>
                        <select
                          value={paymentCategory}
                          onChange={(e) => setPaymentCategory(e.target.value)}
                          style={{ ...styles.input, backgroundColor: theme.inputBg, color: theme.textColor }}
                        >
                          <option value="mobile" style={{ background: "#0f172a", color: "#fff" }}>Mobile Money (M-Pesa, TigoPesa, AirtelMoney, HaloPesa)</option>
                          <option value="card" style={{ background: "#0f172a", color: "#fff" }}>Visa / Mastercard</option>
                        </select>
                      </div>

                      {paymentCategory === "mobile" && (
                        <div style={styles.inputGroup}>
                          <label style={styles.label}>Chagua Mtandao wa Simu</label>
                          <select
                            value={network}
                            onChange={(e) => setNetwork(e.target.value)}
                            style={{ ...styles.input, backgroundColor: theme.inputBg, color: theme.textColor }}
                          >
                            <option value="M-Pesa" style={{ background: "#0f172a", color: "#fff" }}>Vodacom M-Pesa</option>
                            <option value="TigoPesa" style={{ background: "#0f172a", color: "#fff" }}>Tigo Pesa</option>
                            <option value="AirtelMoney" style={{ background: "#0f172a", color: "#fff" }}>Airtel Money</option>
                            <option value="HaloPesa" style={{ background: "#0f172a", color: "#fff" }}>Halo Pesa</option>
                          </select>
                        </div>
                      )}

                      <div style={{ padding: "12px", borderRadius: "10px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)" }}>
                        <p style={{ margin: 0, fontSize: "12px", opacity: 0.8, color: "#cbd5e1" }}>Akaunti ya Raudhwat Al Atfal (M-Koba):</p>
                        <p style={{ margin: "2px 0 0 0", fontSize: "16px", fontWeight: "900", color: "#facc15" }}>{mkobaAccount}</p>
                      </div>

                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Ingiza Namba ya Siri (PIN) ya Thibitisha</label>
                        <input
                          type="password"
                          maxLength="4"
                          placeholder="****"
                          value={pinCode}
                          onChange={(e) => setPinCode(e.target.value)}
                          style={{ ...styles.input, backgroundColor: theme.inputBg, color: theme.textColor, letterSpacing: "6px", fontSize: "18px", fontWeight: "bold" }}
                        />
                      </div>

                      <div style={{ display: "flex", gap: "10px" }}>
                        <button type="button" onClick={() => setStep(2)} style={styles.backBtn}>⬅️ Nyuma</button>
                        <button
                          type="button"
                          onClick={handleFinalSubmit}
                          disabled={isSubmitting}
                          style={{ ...styles.actionBtn, backgroundColor: "#22c55e", color: "#fff" }}
                        >
                          {isSubmitting ? "Inathibitisha..." : "Wasilisha Malipo 🤝"}
                        </button>
                      </div>
                    </>
                  )}

                </form>
              ) : (
                /* MAFANIKIO & RECEIPT DOWNLOAD */
                <div style={{ textAlign: "center", padding: "10px 0" }}>
                  <span style={{ fontSize: "55px" }}>🤲✨</span>
                  <h3 style={{ color: "#22c55e", margin: "10px 0 4px 0", fontSize: "20px" }}>Jazakallahu Khayran, {lastReceipt?.donorName}!</h3>
                  <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#ffffff" }}>
                    Mchango wako wa <strong style={{ color: "#facc15" }}>TZS {lastReceipt?.amount.toLocaleString()}</strong> umepokelewa na kuongezeka kwenye <strong>{lastReceipt?.projectName}</strong>.
                  </p>
                  
                  <div style={{ padding: "12px", borderRadius: "10px", background: "rgba(34, 197, 94, 0.15)", border: "1px solid #22c55e", margin: "14px 0" }}>
                    <p style={{ margin: 0, fontSize: "12px", color: "#34d399", fontStyle: "italic", fontWeight: "600" }}>
                      📲 Ujumbe mzuri wa shukrani na Du'a umepelekwa kwa SMS ({phoneNumber}) na Resiti imeambatanishwa kwenye Email ({donorEmail || "Sio lazima"}).
                    </p>
                  </div>

                  <button
                    onClick={() => alert(`RESITI YA MCHANGO - RAUDHWAT AL ATFAL\n-----------------------------------\nNamba: ${lastReceipt?.receiptNo}\nMchangiaji: ${lastReceipt?.donorName}\nKiasi: TZS ${lastReceipt?.amount.toLocaleString()}\nMradi: ${lastReceipt?.projectName}\nAkaunti: ${lastReceipt?.account}\nTarehe: ${lastReceipt?.date} ${lastReceipt?.time}`)}
                    style={{ ...styles.actionBtn, backgroundColor: theme.accentColor, color: "#000", marginTop: "10px" }}
                  >
                    📄 Download Receipt (PDF)
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// STYLES ZA HIGHER VISIBILITY & HD CONTRAST
const styles = {
  pageWrapper: { minHeight: "100vh", padding: "24px 16px", fontFamily: "'Inter', sans-serif" },
  container: { maxWidth: "1150px", margin: "0 auto" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderRadius: "16px", backgroundColor: "rgba(0,0,0,0.45)", marginBottom: "20px", flexWrap: "wrap", gap: "10px" },
  themeBtnGroup: { display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" },
  themeBtn: { padding: "6px 12px", borderRadius: "8px", fontSize: "11px", fontWeight: "800", cursor: "pointer" },
  logoutBtn: { backgroundColor: "rgba(239, 68, 68, 0.3)", color: "#ef4444", border: "1.5px solid #ef4444", padding: "8px 16px", borderRadius: "10px", fontSize: "12px", fontWeight: "900", cursor: "pointer" },
  header: { textAlign: "center", marginBottom: "20px" },
  bismillah: { fontSize: "24px", margin: "0 0 6px 0", fontWeight: "bold", fontFamily: "'Amiri', serif" },
  title: { fontSize: "32px", fontWeight: "900", margin: 0, letterSpacing: "1px" },
  subtitle: { fontSize: "14px", margin: "4px 0 0 0", fontWeight: "600" },
  goldDivider: { height: "3px", width: "100px", margin: "12px auto 0 auto", borderRadius: "2px" },
  cashHeaderCard: { display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(0,0,0,0.55)", border: "1.5px solid rgba(250, 204, 21, 0.4)", padding: "20px 28px", borderRadius: "20px", marginBottom: "24px" },
  card: { borderRadius: "20px", padding: "24px", backdropFilter: "blur(12px)" },
  cardHeader: { display: "flex", alignItems: "center", gap: "12px" },
  cardTitle: { fontSize: "18px", fontWeight: "900", margin: 0 },
  projectCardBox: { padding: "18px", borderRadius: "16px", backgroundColor: "rgba(0,0,0,0.3)" },
  progressTrack: { height: "16px", width: "100%", backgroundColor: "rgba(255,255,255,0.15)", borderRadius: "10px", overflow: "hidden", margin: "12px 0" },
  progressBarFill: { height: "100%", borderRadius: "10px", transition: "width 0.5s ease" },
  projectFooter: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" },
  donateMainBtn: { border: "none", padding: "16px 40px", borderRadius: "14px", fontWeight: "900", fontSize: "16px", cursor: "pointer", boxShadow: "0 10px 25px rgba(0,0,0,0.3)" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.85)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "16px" },
  modalContent: { width: "100%", maxWidth: "480px", padding: "24px", borderRadius: "20px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.7)" },
  closeBtn: { background: "transparent", border: "none", color: "#fff", fontSize: "20px", cursor: "pointer" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "12px", fontWeight: "800", textTransform: "uppercase", color: "#facc15" },
  input: { padding: "12px 14px", borderRadius: "10px", border: "1.5px solid rgba(255,255,255,0.25)", fontSize: "14px", outline: "none", fontWeight: "600" },
  actionBtn: { width: "100%", border: "none", padding: "14px", borderRadius: "12px", fontWeight: "900", fontSize: "14px", cursor: "pointer" },
  backBtn: { backgroundColor: "rgba(255,255,255,0.15)", color: "#fff", border: "none", padding: "14px", borderRadius: "12px", fontWeight: "800", fontSize: "13px", cursor: "pointer" }
};

export default DonorDashboard;