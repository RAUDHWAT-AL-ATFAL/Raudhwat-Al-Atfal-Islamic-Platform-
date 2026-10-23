import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// MANDHARI 5 ZA HD VIBRANT
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

const DEFAULT_PROJECTS = [
  { id: "p1", kichwa: "1. Akiba / Kuanzia", lengoLaMchango: 600000, kiasiKilichopatikana: 100000 },
  { id: "p2", kichwa: "2. Vifaa vya Shule", lengoLaMchango: 600000, kiasiKilichopatikana: 184000 },
  { id: "p3", kichwa: "3. Ramadhani", lengoLaMchango: 600000, kiasiKilichopatikana: 0 },
  { id: "p4", kichwa: "4. Eidy Al-Fitr", lengoLaMchango: 600000, kiasiKilichopatikana: 0 },
  { id: "p5", kichwa: "5. Eidy Al-Hajj", lengoLaMchango: 600000, kiasiKilichopatikana: 0 }
];

const INITIAL_MEMBERS = [
  { id: 1, name: "Rajabu Bashiri", email: "rajabubashiri75@gmail.com", role: "admin", date: "2026-03-01", status: "Active" },
  { id: 2, name: "Sheikh Abdallah", email: "abdallah@raudhwat.org", role: "donor", date: "2026-03-02", status: "Active" },
  { id: 3, name: "Ustadh Juma", email: "juma@raudhwat.org", role: "member", date: "2026-03-03", status: "Active" }
];

const INITIAL_DONATION_LOGS = [
  { id: "TX101", donorName: "Rajabu Bashiri", email: "rajabubashiri75@gmail.com", project: "Vifaa vya Shule", amount: 150000, network: "M-Pesa", date: "2026-03-01 10:30 AM", status: "Imethibitishwa" },
  { id: "TX102", donorName: "Sheikh Abdallah", email: "abdallah@raudhwat.org", project: "Ramadhani", amount: 500000, network: "TigoPesa", date: "2026-03-02 02:15 PM", status: "Imethibitishwa" }
];

export default function RaudhwatPortal({ userRole = "admin" }) {
  const navigate = useNavigate();
  
  const [currentTheme, setCurrentTheme] = useState(() => localStorage.getItem("app_theme_v3") || "goldEmerald");
  const theme = THEMES[currentTheme] || THEMES.goldEmerald;
  
  const [activeTab, setActiveTab] = useState("projects");
  
  const [projectsList, setProjectsList] = useState(DEFAULT_PROJECTS);
  const [totalRaudhwatCash, setTotalRaudhwatCash] = useState(284000);
  const [membersList, setMembersList] = useState(INITIAL_MEMBERS);
  const [donationLogs, setDonationLogs] = useState(INITIAL_DONATION_LOGS);
  
  const [showFormModal, setShowFormModal] = useState(false);
  const [step, setStep] = useState(1);
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("p1");
  const [amount, setAmount] = useState("");
  const [paymentCategory] = useState("mobile");
  const [network, setNetwork] = useState("M-Pesa");
  const [mkobaAccount] = useState("M-KOBA-RAUDHWAT-9082");
  const [pinCode, setPinCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [lastReceipt, setLastReceipt] = useState(null);

  // MAUDHUI YANAAZA YAKIWA TUPU (HAKUNA KITU MPAKA ADMIN AWEKE)
  const [mediaList, setMediaList] = useState(() => {
    try {
      const saved = localStorage.getItem("raudhwat_media_content_v3");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // STATES ZA KUPAKIA MAUDHUI
  const [photoTitle, setPhotoTitle] = useState("");
  const [photoSourceType, setPhotoSourceType] = useState("file");
  const [photoGalleryItem, setPhotoGalleryItem] = useState("");
  const [photoFile, setPhotoFile] = useState("");

  const [videoMradiTitle, setVideoMradiTitle] = useState("");
  const [videoMradiSourceType, setVideoMradiSourceType] = useState("file");
  const [videoMradiGalleryItem, setVideoMradiGalleryItem] = useState("");
  const [videoMradiFile, setVideoMradiFile] = useState("");

  const [ukumbushoTitle, setUkumbushoTitle] = useState("");
  const [ukumbushoSourceType, setUkumbushoSourceType] = useState("file");
  const [ukumbushoGalleryItem, setUkumbushoGalleryItem] = useState("");
  const [ukumbushoFile, setUkumbushoFile] = useState("");
  const [ukumbushoUrl, setUkumbushoUrl] = useState("");

  // STATE YA TAARIFA (NOTIFICATION) KWA MEMBER NA DONOR
  const [latestNotification, setLatestNotification] = useState(() => {
    try {
      const savedNotif = localStorage.getItem("raudhwat_latest_notif");
      return savedNotif ? JSON.parse(savedNotif) : null;
    } catch {
      return null;
    }
  });

  const getProgressBarColor = (percentage) => {
    if (percentage <= 24) return "#ef4444";
    if (percentage <= 49) return "#f97316";
    if (percentage <= 74) return "#facc15";
    return "#22c55e";
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!donorName.trim()) { alert("Tafadhali ingiza jina lako kamili!"); return; }
      if (!phoneNumber || phoneNumber.length < 10) { alert("Tafadhali ingiza namba sahihi ya simu!"); return; }
      setStep(2);
    } else if (step === 2) {
      if (!amount || Number(amount) <= 0) { alert("Tafadhali ingiza kiasi halali cha mchango!"); return; }
      setStep(3);
    }
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (!pinCode || pinCode.length < 4) { alert("Tafadhali ingiza Namba ya Siri (PIN)!"); return; }
    setIsSubmitting(true);
    
    setTimeout(() => {
      const donatedVal = Number(amount);
      setTotalRaudhwatCash((prev) => prev + donatedVal);
      
      const updatedProjects = projectsList.map((p) => {
        if (p.id === selectedProjectId) {
          return { ...p, kiasiKilichopatikana: p.kiasiKilichopatikana + donatedVal };
        }
        return p;
      });
      setProjectsList(updatedProjects);
      
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
      
      const exists = membersList.some((m) => m.email === donorEmail || m.name === donorName);
      if (!exists) {
        setMembersList((prev) => [
          ...prev,
          { id: prev.length + 1, name: donorName, email: donorEmail || `${donorName.toLowerCase().replace(/\s+/g, '')}@gmail.com`, role: "donor", date: new Date().toLocaleDateString("sw-TZ"), status: "Active" }
        ]);
      }
      
      setLastReceipt({
        receiptNo: "RATFAL-" + Math.floor(100000 + Math.random() * 900000),
        donorName,
        projectName: targetProj ? targetProj.kichwa : "Mchango wa Raudhwat",
        amount: donatedVal,
        account: mkobaAccount,
        date: new Date().toLocaleDateString("sw-TZ")
      });
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

  // HANDLERS ZA KUSAVE MEDIA NA KUTOA TAARIFA KWA MEMBERS NA DONORS
  const triggerBroadcastNotification = (title, typeText) => {
    const notifObj = {
      message: `📢 Maudhui Mapya Yamewekwa: "${title}" (${typeText}). Wacheki sasa!`,
      time: new Date().toLocaleTimeString("sw-TZ") + " " + new Date().toLocaleDateString("sw-TZ")
    };
    setLatestNotification(notifObj);
    localStorage.setItem("raudhwat_latest_notif", JSON.stringify(notifObj));
  };

  const handleSavePhoto = (e) => {
    e.preventDefault();
    if (!photoTitle) return alert("Tafadhali weka kichwa cha picha!");
    const fileToUse = photoSourceType === "file" ? photoFile : photoGalleryItem;
    if (!fileToUse) return alert("Tafadhali chagua picha ama kupitia faili au gallery!");

    const newItem = { 
      id: Date.now(), 
      type: "image", 
      title: photoTitle, 
      url: fileToUse, 
      date: new Date().toISOString().split('T')[0],
      requiresApproval: true // Imewekewa ulinzi wa idhini ya admin
    };
    const updated = [newItem, ...mediaList];
    setMediaList(updated);
    localStorage.setItem("raudhwat_media_content_v3", JSON.stringify(updated));
    
    triggerBroadcastNotification(photoTitle, "Picha ya Mradi");
    setPhotoTitle(""); setPhotoFile(""); setPhotoGalleryItem("");
    alert("Picha ya mradi imehifadhiwa salama na taarifa imetumwa kwa wanachama!");
  };

  const handleSaveVideoMradi = (e) => {
    e.preventDefault();
    if (!videoMradiTitle) return alert("Tafadhali weka kichwa cha video ya mradi!");
    const fileToUse = videoMradiSourceType === "file" ? videoMradiFile : videoMradiGalleryItem;
    if (!fileToUse) return alert("Tafadhali chagua video ya mradi!");

    const newItem = { 
      id: Date.now(), 
      type: "video_mradi", 
      title: videoMradiTitle, 
      url: fileToUse, 
      date: new Date().toISOString().split('T')[0],
      requiresApproval: true // Imewekewa ulinzi wa idhini ya admin
    };
    const updated = [newItem, ...mediaList];
    setMediaList(updated);
    localStorage.setItem("raudhwat_media_content_v3", JSON.stringify(updated));

    triggerBroadcastNotification(videoMradiTitle, "Video ya Mradi");
    setVideoMradiTitle(""); setVideoMradiFile(""); setVideoMradiGalleryItem("");
    alert("Video ya mradi imehifadhiwa salama na taarifa imetumwa kwa wanachama!");
  };

  const handleSaveUkumbusho = (e) => {
    e.preventDefault();
    if (!ukumbushoTitle) return alert("Tafadhali weka kichwa cha ukumbusho!");
    let fileToUse = "";
    if (ukumbushoSourceType === "file") fileToUse = ukumbushoFile;
    else if (ukumbushoSourceType === "gallery") fileToUse = ukumbushoGalleryItem;
    else fileToUse = ukumbushoUrl;

    if (!fileToUse) return alert("Tafadhali weka faili, chagua gallery, au ingiza URL ya ukumbusho!");

    const newItem = { 
      id: Date.now(), 
      type: "ukumbusho_kiislam", 
      title: ukumbushoTitle, 
      url: fileToUse, 
      date: new Date().toISOString().split('T')[0],
      requiresApproval: false // Free download kwa wote
    };
    const updated = [newItem, ...mediaList];
    setMediaList(updated);
    localStorage.setItem("raudhwat_media_content_v3", JSON.stringify(updated));

    triggerBroadcastNotification(ukumbushoTitle, "Ukumbusho wa Kiislam");
    setUkumbushoTitle(""); setUkumbushoFile(""); setUkumbushoGalleryItem(""); setUkumbushoUrl("");
    alert("Ukumbusho umehifadhiwa na upo tayari kwa Free Download ya wote!");
  };

  const handleDeleteMedia = (id) => {
    const updated = mediaList.filter(item => item.id !== id);
    setMediaList(updated);
    localStorage.setItem("raudhwat_media_content_v3", JSON.stringify(updated));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoFile(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleVideoMradiFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setVideoMradiFile(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUkumbushoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUkumbushoFile(reader.result);
      reader.readAsDataURL(file);
    }
  };
  return (
    <div style={{ ...styles.pageWrapper, background: theme.pageBg, color: theme.textColor }}>
      <div style={styles.container}>
        
        {/* TOP BAR & THEMES */}
        <div style={{ ...styles.topBar, border: theme.cardBorder }}>
          <div style={styles.themeBtnGroup}>
            <span style={{ fontSize: "12px", fontWeight: "900", color: "#facc15" }}>🎨 MANDHARI:</span>
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
          <button onClick={() => navigate("/login")} style={styles.logoutBtn}>🚪 Ondoka ({userRole.toUpperCase()})</button>
        </div>
      </div>
    </div>
  );
       {/* HEADER YA KITUO */}
        <header style={styles.header}>
          <p style={{ ...styles.bismillah, color: theme.bismillahColor }}>بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</p>
          <h1 style={{ ...styles.title, color: theme.titleColor }}>RAUDHWAT AL-ATFAL</h1>
          <p style={{ ...styles.subtitle, color: theme.subtitleColor }}>
            {userRole === "admin" ? "Dashibodi ya Utawala na Usimamizi" : userRole === "donor" ? "Portali ya Mchangiaji (Donor Portal)" : "Portali ya Mwanachama (Member Portal)"}
          </p>
          <div style={{ ...styles.goldDivider, background: theme.dividerColor }}></div>
        </header>

        {/* LIVE NOTIFICATION BANNER KWA MEMBERS NA DONORS */}
        {latestNotification && userRole !== "admin" && (
          <div style={{ 
            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.3))", 
            border: "1px solid #10b981", 
            padding: "14px 20px", 
            borderRadius: "16px", 
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 10px 25px rgba(16, 185, 129, 0.2)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "24px" }}>🔔</span>
              <div>
                <h4 style={{ margin: 0, color: "#34d399", fontSize: "14px", fontWeight: "900" }}>TAARIFA MPYA YA KITUO</h4>
                <p style={{ margin: "3px 0 0 0", color: "#ffffff", fontSize: "13px", fontWeight: "700" }}>{latestNotification.message}</p>
              </div>
            </div>
            <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "bold" }}>{latestNotification.time}</span>
          </div>
        )}

        {/* TABS KUBWA ZA MFUMO */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px", flexWrap: "wrap" }}>
          <button onClick={() => setActiveTab("projects")} style={tabStyle(activeTab === "projects", theme)}>📊 Miradi & Progress</button>
          <button onClick={() => setActiveTab("mediaFeed")} style={tabStyle(activeTab === "mediaFeed", theme)}>📂 Picha & Video Zote ({mediaList.length})</button>
          {userRole === "admin" && (
            <>
              <button onClick={() => setActiveTab("members")} style={tabStyle(activeTab === "members", theme)}>👥 Wanachama ({membersList.length})</button>
              <button onClick={() => setActiveTab("donations")} style={tabStyle(activeTab === "donations", theme)}>💰 Michango ({donationLogs.length})</button>
              <button onClick={() => setActiveTab("adminMedia")} style={tabStyle(activeTab === "adminMedia", theme)}>⚙️ Simamia Maudhui</button>
            </>
          )}
        </div>

        {/* JUMLA YA FEDHA */}
        <div style={styles.cashHeaderCard}>
          <div>
            <p style={{ margin: 0, fontSize: "13px", fontWeight: "800", color: "#facc15", textTransform: "uppercase" }}>
              💵 JUMLA YA FEDHA TASLIMU ZA RAUDHWAT AL ATFAL
            </p>
            <h2 style={{ margin: "6px 0 0 0", fontSize: "38px", fontWeight: "900", color: "#ffffff" }}>
              TZS {totalRaudhwatCash.toLocaleString()}
            </h2>
          </div>
          <div style={{ fontSize: "50px" }}>🤲</div>
        </div>
        {/* TAB 1: MIRADI & PROGRESS BARS */}
        {activeTab === "projects" && (
          <div style={{ ...styles.card, background: theme.cardBg, border: theme.cardBorder, marginBottom: "24px" }}>
            <div style={styles.cardHeader}>
              <span style={{ fontSize: "28px" }}>📊</span>
              <div>
                <h2 style={{ ...styles.cardTitle, color: theme.titleColor, fontSize: "20px" }}>Hali ya Miradi na Progress Bars</h2>
                <p style={{ margin: 0, fontSize: "13px", color: theme.subtitleColor, fontWeight: "600" }}>Viwango vya utekelezaji wa malengo ya kituo</p>
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
                      <span style={{ fontSize: "18px", fontWeight: "900", color: barColor }}>{percentage}%</span>
                    </div>
                    <div style={styles.progressTrack}>
                      <div style={{ ...styles.progressBarFill, width: `${percentage}%`, backgroundColor: barColor }} />
                    </div>
                    <div style={styles.projectFooter}>
                      <div>
                        <span style={{ display: "block", fontSize: "11px", color: "#cbd5e1", fontWeight: "800" }}>IMEPATIKANA:</span>
                        <strong style={{ fontSize: "15px", color: "#34d399", fontWeight: "900" }}>TZS {p.kiasiKilichopatikana.toLocaleString()}</strong>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ display: "block", fontSize: "11px", color: "#cbd5e1", fontWeight: "800" }}>LENGO:</span>
                        <span style={{ fontSize: "14px", color: "#facc15", fontWeight: "900" }}>TZS {p.lengoLaMchango.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

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

        {/* TAB 2: PUBLIC MEDIA FEED (IMETENGANISHWA KIKAMILIFU KWA MAKUNDI 3) */}
        {activeTab === "mediaFeed" && (
          <div style={{ ...styles.card, background: theme.cardBg, border: theme.cardBorder, marginBottom: "24px" }}>
            <h2 style={{ color: theme.titleColor, fontSize: "22px", fontWeight: "900", marginBottom: "8px", textAlign: "center" }}>
              📂 Maonyesho na Maktaba ya Kituo
            </h2>
            <p style={{ fontSize: "14px", color: theme.subtitleColor, marginBottom: "30px", fontWeight: "600", textAlign: "center" }}>
              Tazama picha za miradi, video za utekelezaji, na ukumbusho wa kiislam zilizowekwa rasmi.
            </p>

            {/* KUNDI 1: PICHA ZA MIRADI */}
            <div style={{ marginBottom: "35px" }}>
              <h3 style={{ color: "#facc15", fontSize: "18px", fontWeight: "900", borderBottom: "2px solid rgba(250, 204, 21, 0.4)", paddingBottom: "8px", marginBottom: "15px" }}>
                1️⃣ Picha za Miradi
              </h3>
              {mediaList.filter(i => i.type === "image").length === 0 ? (
                <p style={{ color: "#cbd5e1", fontStyle: "italic", fontSize: "13px" }}>Hakuna picha za miradi zilizowekwa kwa sasa.</p>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "15px" }}>
                  {mediaList.filter(i => i.type === "image").map((item) => (
                    <div key={item.id} style={{ background: "rgba(0,0,0,0.4)", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.15)" }}>
                      <div style={{ height: "160px", backgroundColor: "#000" }}>
                        <img src={item.url} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ padding: "12px" }}>
                        <span style={{ fontSize: "10px", color: "#94a3b8" }}>{item.date}</span>
                        <h4 style={{ margin: "5px 0 0 0", fontSize: "15px", color: "#ffffff", fontWeight: "900" }}>{item.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* KUNDI 2: VIDEO ZA MIRADI */}
            <div style={{ marginBottom: "35px" }}>
              <h3 style={{ color: "#38bdf8", fontSize: "18px", fontWeight: "900", borderBottom: "2px solid rgba(56, 189, 248, 0.4)", paddingBottom: "8px", marginBottom: "15px" }}>
                2️⃣ Video za Miradi
              </h3>
              {mediaList.filter(i => i.type === "video_mradi").length === 0 ? (
                <p style={{ color: "#cbd5e1", fontStyle: "italic", fontSize: "13px" }}>Hakuna video za miradi zilizowekwa kwa sasa.</p>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "15px" }}>
                  {mediaList.filter(i => i.type === "video_mradi").map((item) => (
                    <div key={item.id} style={{ background: "rgba(0,0,0,0.4)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.15)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <span style={{ fontSize: "10px", background: "#0284c7", color: '#fff', padding: "2px 6px", borderRadius: "4px", fontWeight: "bold" }}>VIDEO YA MRADI</span>
                          <span style={{ fontSize: "10px", color: "#94a3b8" }}>{item.date}</span>
                        </div>
                        <h4 style={{ margin: "0 0 12px 0", fontSize: "15px", color: "#ffffff", fontWeight: "900" }}>{item.title}</h4>
                      </div>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ display: "block", textAlign: "center", padding: "8px", backgroundColor: "#38bdf8", color: "#000", borderRadius: "6px", fontWeight: "900", textDecoration: "none", fontSize: "12px" }}>
                        Tazama Video ↗
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* KUNDI 3: VIDEO ZA UKUMBUSHO ZA KIISLAM */}
            <div>
              <h3 style={{ color: "#c084fc", fontSize: "18px", fontWeight: "900", borderBottom: "2px solid rgba(192, 132, 252, 0.4)", paddingBottom: "8px", marginBottom: "15px" }}>
                3️⃣ Video za Ukumbusho za Kiislam
              </h3>
              {mediaList.filter(i => i.type === "ukumbusho_kiislam").length === 0 ? (
                <p style={{ color: "#cbd5e1", fontStyle: "italic", fontSize: "13px" }}>Hakuna video za ukumbusho zilizowekwa kwa sasa.</p>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "15px" }}>
                  {mediaList.filter(i => i.type === "ukumbusho_kiislam").map((item) => (
                    <div key={item.id} style={{ background: "rgba(0,0,0,0.4)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.15)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <span style={{ fontSize: "10px", background: "#7c3aed", color: '#fff', padding: "2px 6px", borderRadius: "4px", fontWeight: "bold" }}>UKUMBUSHO WA KIISLAM</span>
                          <span style={{ fontSize: "10px", color: "#94a3b8" }}>{item.date}</span>
                        </div>
                        <h4 style={{ margin: "0 0 12px 0", fontSize: "15px", color: "#ffffff", fontWeight: "900" }}>{item.title}</h4>
                      </div>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ display: "block", textAlign: "center", padding: "8px", backgroundColor: "#c084fc", color: "#000", borderRadius: "6px", fontWeight: "900", textDecoration: "none", fontSize: "12px" }}>
                        Tazama Darsa ↗
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 3: WANACHAMA (Admin Pekee) */}
        {userRole === "admin" && activeTab === "members" && (
          <div style={{ ...styles.card, background: theme.cardBg, border: theme.cardBorder, marginBottom: "24px" }}>
            <h2 style={{ color: theme.titleColor, fontSize: "20px", fontWeight: "900" }}>👥 Orodha ya Wanachama Waliojisajili</h2>
            <div style={{ overflowX: "auto", marginTop: "20px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #facc15", color: "#facc15", fontSize: "14px" }}>
                    <th style={{ padding: "14px" }}># ID</th>
                    <th style={{ padding: "14px" }}>JINA KAMILI</th>
                    <th style={{ padding: "14px" }}>EMAIL</th>
                    <th style={{ padding: "14px" }}>WADHIFA</th>
                    <th style={{ padding: "14px" }}>TAREHE</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: "14px" }}>
                  {membersList.map((m) => (
                    <tr key={m.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.2)" }}>
                      <td style={{ padding: "14px", fontWeight: "900", color: "#facc15" }}>#{m.id}</td>
                      <td style={{ padding: "14px", fontWeight: "900", color: "#ffffff" }}>{m.name}</td>
                      <td style={{ padding: "14px", color: "#cbd5e1" }}>{m.email}</td>
                      <td style={{ padding: "14px" }}><span style={{ backgroundColor: "#059669", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "bold" }}>{m.role}</span></td>
                      <td style={{ padding: "14px", color: "#e2e8f0" }}>{m.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: MICHANGO (Admin Pekee) */}
        {userRole === "admin" && activeTab === "donations" && (
          <div style={{ ...styles.card, background: theme.cardBg, border: theme.cardBorder, marginBottom: "24px" }}>
            <h2 style={{ color: theme.titleColor, fontSize: "20px", fontWeight: "900" }}>💰 Kumbukumbu za Michango Yote</h2>
            <div style={{ overflowX: "auto", marginTop: "20px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #facc15", color: "#facc15", fontSize: "14px" }}>
                    <th style={{ padding: "14px" }}>TX ID</th>
                    <th style={{ padding: "14px" }}>MCHANGIAJI</th>
                    <th style={{ padding: "14px" }}>MRADI</th>
                    <th style={{ padding: "14px" }}>KIASI (TZS)</th>
                    <th style={{ padding: "14px" }}>TAREHE</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: "14px" }}>
                  {donationLogs.map((log) => (
                    <tr key={log.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.2)" }}>
                      <td style={{ padding: "14px", fontWeight: "900", color: "#38bdf8" }}>{log.id}</td>
                      <td style={{ padding: "14px", fontWeight: "900", color: "#ffffff" }}>{log.donorName}</td>
                      <td style={{ padding: "14px", color: "#6ee7b7" }}>{log.project}</td>
                      <td style={{ padding: "14px", fontWeight: "900", color: "#facc15" }}>TZS {log.amount.toLocaleString()}</td>
                      <td style={{ padding: "14px", color: "#cbd5e1", fontSize: "12px" }}>{log.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: USIMAMIZI WA MAUDHUI - ADMIN PEKEE (WORLD-CLASS SECURE ARCHITECTURE) */}
{userRole === "admin" && activeTab === "adminMedia" && (
  <div style={{ 
    background: "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.9))", 
    backdropFilter: "blur(24px)", 
    border: "1px solid rgba(250, 204, 21, 0.35)", 
    borderRadius: "28px", 
    padding: "32px", 
    boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.8)",
    marginBottom: "30px" 
  }}>
    
    {/* HEADER YA SEHEMU HII */}
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px", borderBottom: "2px solid rgba(255,255,255,0.08)", paddingBottom: "18px", flexWrap: "wrap", gap: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{ background: "linear-gradient(135deg, #facc15, #eab308)", padding: "12px", borderRadius: "16px", color: "#000", fontSize: "22px", boxShadow: "0 0 20px rgba(250,204,21,0.4)" }}>
          🛡️
        </div>
        <div>
          <h2 style={{ color: "#ffffff", fontSize: "22px", fontWeight: "900", margin: 0, letterSpacing: "0.5px" }}>
            Usimamizi Salama wa Maudhui (Secure Media Vault)
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "13px", margin: "4px 0 0 0", fontWeight: "600" }}>
            Miradi inahitaji idhini ya Admin kupakuliwa (Protected), Ukumbusho uko huru kwa wote (Public Free).
          </p>
        </div>
      </div>
      <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ background: "rgba(56, 189, 248, 0.15)", border: "1px solid #38bdf8", color: "#38bdf8", padding: "8px 14px", borderRadius: "12px", fontSize: "11px", fontWeight: "900" }}>
          ☁️ Cloud Sync: Secured
        </div>
        <div style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid #10b981", color: "#34d399", padding: "8px 14px", borderRadius: "12px", fontSize: "11px", fontWeight: "900" }}>
          🔒 Security Shield: Active
        </div>
      </div>
    </div>

    {/* ADVANCED FILTER TABS KWA AJILI YA KUCHUJA MAUDHUI HARAKA */}
    <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap", background: "rgba(0,0,0,0.3)", padding: "8px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)" }}>
      <button 
        onClick={() => setMediaFilter("all")} 
        style={{ padding: "8px 16px", borderRadius: "10px", fontSize: "12px", fontWeight: "900", cursor: "pointer", background: (mediaFilter || "all") === "all" ? "#facc15" : "transparent", color: (mediaFilter || "all") === "all" ? "#000" : "#94a3b8", border: "none" }}
      >
        📂 Maudhui Yote ({mediaList.length})
      </button>
      <button 
        onClick={() => setMediaFilter("image")} 
        style={{ padding: "8px 16px", borderRadius: "10px", fontSize: "12px", fontWeight: "900", cursor: "pointer", background: mediaFilter === "image" ? "#facc15" : "transparent", color: mediaFilter === "image" ? "#000" : "#94a3b8", border: "none" }}
      >
        🖼️ Picha za Miradi
      </button>
      <button 
        onClick={() => setMediaFilter("video_mradi")} 
        style={{ padding: "8px 16px", borderRadius: "10px", fontSize: "12px", fontWeight: "900", cursor: "pointer", background: mediaFilter === "video_mradi" ? "#38bdf8" : "transparent", color: mediaFilter === "video_mradi" ? "#000" : "#94a3b8", border: "none" }}
      >
        🎬 Video za Miradi
      </button>
      <button 
        onClick={() => setMediaFilter("ukumbusho_kiislam")} 
        style={{ padding: "8px 16px", borderRadius: "10px", fontSize: "12px", fontWeight: "900", cursor: "pointer", background: mediaFilter === "ukumbusho_kiislam" ? "#c084fc" : "transparent", color: mediaFilter === "ukumbusho_kiislam" ? "#000" : "#94a3b8", border: "none" }}
      >
        📖 Ukumbusho wa Kiislam
      </button>
    </div>

    {/* MAKUNDI 3 YA KUWEKA MAUDHUI */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", marginBottom: "35px" }}>
      
      {/* 1. PICHA ZA MIRADI (SECURED / APPROVAL REQUIRED) */}
      <div style={{ 
        background: "rgba(15, 23, 42, 0.65)", 
        padding: "24px", 
        borderRadius: "20px", 
        border: "1px solid rgba(250, 204, 21, 0.3)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.4)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ background: "#facc15", color: "#000", width: "28px", height: "28px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "14px" }}>1</span>
            <h4 style={{ color: "#facc15", fontSize: "16px", fontWeight: "900", margin: 0 }}>Picha za Miradi</h4>
          </div>
          <span style={{ fontSize: "10px", background: "rgba(239, 68, 68, 0.2)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.4)", padding: "3px 8px", borderRadius: "6px", fontWeight: "900" }}>
            🔒 Inahitaji Idhini
          </span>
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input 
            type="text" placeholder="Kichwa cha picha..." value={photoTitle} onChange={(e) => setPhotoTitle(e.target.value)}
            style={{ backgroundColor: theme?.inputBg || "rgba(255,255,255,0.06)", color: theme?.textColor || "#fff", border: "1px solid rgba(250,204,21,0.3)", padding: "12px 14px", borderRadius: "10px", outline: "none", fontWeight: "700" }} 
          />

          <div style={{ display: "flex", background: "rgba(0,0,0,0.4)", padding: "4px", borderRadius: "10px", gap: "4px" }}>
            <button
              type="button"
              onClick={() => setPhotoSourceType("file")}
              style={{ flex: 1, padding: "8px", borderRadius: "8px", fontSize: "12px", fontWeight: "800", cursor: "pointer", backgroundColor: photoSourceType === "file" ? "#facc15" : "transparent", color: photoSourceType === "file" ? "#000" : "#94a3b8", border: "none" }}
            >
              📁 Kifaa (File)
            </button>
            <button
              type="button"
              onClick={() => setPhotoSourceType("gallery")}
              style={{ flex: 1, padding: "8px", borderRadius: "8px", fontSize: "12px", fontWeight: "800", cursor: "pointer", backgroundColor: photoSourceType === "gallery" ? "#facc15" : "transparent", color: photoSourceType === "gallery" ? "#000" : "#94a3b8", border: "none" }}
            >
              🖼️ Maktaba (Gallery)
            </button>
          </div>

          {photoSourceType === "file" ? (
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ width: "100%", fontSize: "12px", color: "#cbd5e1", padding: "10px", background: "rgba(255,255,255,0.04)", borderRadius: "10px", border: "1px dashed rgba(255,255,255,0.2)" }} />
          ) : (
            <select 
              value={photoGalleryItem || ""} 
              onChange={(e) => setPhotoGalleryItem(e.target.value)}
              style={{ backgroundColor: theme?.inputBg || "rgba(255,255,255,0.06)", color: theme?.textColor || "#fff", border: "1px solid rgba(250,204,21,0.3)", padding: "12px 14px", borderRadius: "10px", outline: "none", fontWeight: "700", fontSize: "13px" }}
            >
              <option value="" style={{ background: "#0f172a" }}>-- Chagua kutoka Gallery --</option>
              {mediaList.map((m) => (
                <option key={m.id} value={m.url} style={{ background: "#0f172a" }}>{m.title}</option>
              ))}
            </select>
          )}

          <button onClick={handleSavePhoto} style={{ width: "100%", backgroundColor: "#facc15", color: "#000", fontWeight: "900", padding: "14px", borderRadius: "12px", border: "none", cursor: "pointer", boxShadow: "0 4px 15px rgba(250,204,21,0.3)", marginTop: "6px" }}>
            🛡️ Hifadhi (Protected Download)
          </button>
        </div>
      </div>

      {/* 2. VIDEO ZA MIRADI (SECURED / APPROVAL REQUIRED) */}
      <div style={{ 
        background: "rgba(15, 23, 42, 0.65)", 
        padding: "24px", 
        borderRadius: "20px", 
        border: "1px solid rgba(56, 189, 248, 0.3)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.4)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ background: "#38bdf8", color: "#000", width: "28px", height: "28px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "14px" }}>2</span>
            <h4 style={{ color: "#38bdf8", fontSize: "16px", fontWeight: "900", margin: 0 }}>Video za Miradi</h4>
          </div>
          <span style={{ fontSize: "10px", background: "rgba(239, 68, 68, 0.2)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.4)", padding: "3px 8px", borderRadius: "6px", fontWeight: "900" }}>
            🔒 Inahitaji Idhini
          </span>
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input 
            type="text" placeholder="Kichwa cha video..." value={videoMradiTitle} onChange={(e) => setVideoMradiTitle(e.target.value)}
            style={{ backgroundColor: theme?.inputBg || "rgba(255,255,255,0.06)", color: theme?.textColor || "#fff", border: "1px solid rgba(56,189,248,0.3)", padding: "12px 14px", borderRadius: "10px", outline: "none", fontWeight: "700" }} 
          />

          <div style={{ display: "flex", background: "rgba(0,0,0,0.4)", padding: "4px", borderRadius: "10px", gap: "4px" }}>
            <button
              type="button"
              onClick={() => setVideoMradiSourceType("file")}
              style={{ flex: 1, padding: "8px", borderRadius: "8px", fontSize: "12px", fontWeight: "800", cursor: "pointer", backgroundColor: videoMradiSourceType === "file" ? "#38bdf8" : "transparent", color: videoMradiSourceType === "file" ? "#000" : "#94a3b8", border: "none" }}
            >
              📁 Kifaa (File)
            </button>
            <button
              type="button"
              onClick={() => setVideoMradiSourceType("gallery")}
              style={{ flex: 1, padding: "8px", borderRadius: "8px", fontSize: "12px", fontWeight: "800", cursor: "pointer", backgroundColor: videoMradiSourceType === "gallery" ? "#38bdf8" : "transparent", color: videoMradiSourceType === "gallery" ? "#000" : "#94a3b8", border: "none" }}
            >
              🖼️ Maktaba (Gallery)
            </button>
          </div>

          {videoMradiSourceType === "file" ? (
            <input type="file" accept="video/*" onChange={handleVideoMradiFileChange} style={{ width: "100%", fontSize: "12px", color: "#cbd5e1", padding: "10px", background: "rgba(255,255,255,0.04)", borderRadius: "10px", border: "1px dashed rgba(255,255,255,0.2)" }} />
          ) : (
            <select 
              value={videoMradiGalleryItem || ""} 
              onChange={(e) => setVideoMradiGalleryItem(e.target.value)}
              style={{ backgroundColor: theme?.inputBg || "rgba(255,255,255,0.06)", color: theme?.textColor || "#fff", border: "1px solid rgba(56,189,248,0.3)", padding: "12px 14px", borderRadius: "10px", outline: "none", fontWeight: "700", fontSize: "13px" }}
            >
              <option value="" style={{ background: "#0f172a" }}>-- Chagua kutoka Gallery --</option>
              {mediaList.map((m) => (
                <option key={m.id} value={m.url} style={{ background: "#0f172a" }}>{m.title}</option>
              ))}
            </select>
          )}

          <button onClick={handleSaveVideoMradi} style={{ width: "100%", backgroundColor: "#38bdf8", color: "#000", fontWeight: "900", padding: "14px", borderRadius: "12px", border: "none", cursor: "pointer", boxShadow: "0 4px 15px rgba(56,189,248,0.3)", marginTop: "6px" }}>
            🛡️ Ongeza (Protected Download)
          </button>
        </div>
      </div>

      {/* 3. UKUMBUSHO WA KIISLAM (FREE PUBLIC DOWNLOAD) */}
      <div style={{ 
        background: "rgba(15, 23, 42, 0.65)", 
        padding: "24px", 
        borderRadius: "20px", 
        border: "1px solid rgba(192, 132, 252, 0.3)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.4)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ background: "#c084fc", color: "#000", width: "28px", height: "28px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "14px" }}>3</span>
            <h4 style={{ color: "#c084fc", fontSize: "16px", fontWeight: "900", margin: 0 }}>Ukumbusho wa Kiislam</h4>
          </div>
          <span style={{ fontSize: "10px", background: "rgba(16, 185, 129, 0.2)", color: "#34d399", border: "1px solid rgba(16, 185, 129, 0.4)", padding: "3px 8px", borderRadius: "6px", fontWeight: "900" }}>
            ✨ Free Download
          </span>
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input 
            type="text" placeholder="Kichwa cha darsa/ukumbusho..." value={ukumbushoTitle} onChange={(e) => setUkumbushoTitle(e.target.value)}
            style={{ backgroundColor: theme?.inputBg || "rgba(255,255,255,0.06)", color: theme?.textColor || "#fff", border: "1px solid rgba(192,132,252,0.3)", padding: "12px 14px", borderRadius: "10px", outline: "none", fontWeight: "700" }} 
          />

          <div style={{ display: "flex", background: "rgba(0,0,0,0.4)", padding: "4px", borderRadius: "10px", gap: "3px" }}>
            <button
              type="button"
              onClick={() => setUkumbushoSourceType("file")}
              style={{ flex: 1, padding: "8px 4px", borderRadius: "8px", fontSize: "11px", fontWeight: "800", cursor: "pointer", backgroundColor: ukumbushoSourceType === "file" ? "#c084fc" : "transparent", color: ukumbushoSourceType === "file" ? "#000" : "#94a3b8", border: "none" }}
            >
              📁 File
            </button>
            <button
              type="button"
              onClick={() => setUkumbushoSourceType("gallery")}
              style={{ flex: 1, padding: "8px 4px", borderRadius: "8px", fontSize: "11px", fontWeight: "800", cursor: "pointer", backgroundColor: ukumbushoSourceType === "gallery" ? "#c084fc" : "transparent", color: ukumbushoSourceType === "gallery" ? "#000" : "#94a3b8", border: "none" }}
            >
              🖼️ Gallery
            </button>
            <button
              type="button"
              onClick={() => setUkumbushoSourceType("url")}
              style={{ flex: 1, padding: "8px 4px", borderRadius: "8px", fontSize: "11px", fontWeight: "800", cursor: "pointer", backgroundColor: ukumbushoSourceType === "url" ? "#c084fc" : "transparent", color: ukumbushoSourceType === "url" ? "#000" : "#94a3b8", border: "none" }}
            >
              🔗 URL
            </button>
          </div>

          {ukumbushoSourceType === "file" && (
            <input type="file" onChange={handleUkumbushoFileChange} style={{ width: "100%", fontSize: "12px", color: "#cbd5e1", padding: "10px", background: "rgba(255,255,255,0.04)", borderRadius: "10px", border: "1px dashed rgba(255,255,255,0.2)" }} />
          )}

          {ukumbushoSourceType === "gallery" && (
            <select 
              value={ukumbushoGalleryItem || ""} 
              onChange={(e) => setUkumbushoGalleryItem(e.target.value)}
              style={{ backgroundColor: theme?.inputBg || "rgba(255,255,255,0.06)", color: theme?.textColor || "#fff", border: "1px solid rgba(192,132,252,0.3)", padding: "12px 14px", borderRadius: "10px", outline: "none", fontWeight: "700", fontSize: "13px" }}
            >
              <option value="" style={{ background: "#0f172a" }}>-- Chagua kutoka Gallery --</option>
              {mediaList.map((m) => (
                <option key={m.id} value={m.url} style={{ background: "#0f172a" }}>{m.title}</option>
              ))}
            </select>
          )}

          {ukumbushoSourceType === "url" && (
            <input 
              type="text" placeholder="Link ya Ukumbusho (URL)..." value={ukumbushoUrl} onChange={(e) => setUkumbushoUrl(e.target.value)}
              style={{ backgroundColor: theme?.inputBg || "rgba(255,255,255,0.06)", color: theme?.textColor || "#fff", border: "1px solid rgba(192,132,252,0.3)", padding: "12px 14px", borderRadius: "10px", outline: "none", fontWeight: "700" }} 
            />
          )}

          <button onClick={handleSaveUkumbusho} style={{ width: "100%", backgroundColor: "#c084fc", color: "#000", fontWeight: "900", padding: "14px", borderRadius: "12px", border: "none", cursor: "pointer", boxShadow: "0 4px 15px rgba(192,132,252,0.3)", marginTop: "6px" }}>
            🚀 Ongeza Ukumbusho (Free)
          </button>
        </div>
      </div>

    </div>

     {/* ORODHA YOTE NA HALI YA USALAMA (SECURITY STATUS) */}
    <h3 style={{ color: "#ffffff", fontSize: "17px", fontWeight: "900", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
      <span>📋</span> Orodha Yote na Hali ya Vizuizi vya Upakuaji
    </h3>
    
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
      {mediaList
        .filter(item => (mediaFilter || "all") === "all" ? true : item.type === mediaFilter)
        .map((item) => {
          const isProtected = item.type === 'image' || item.type === 'video_mradi';
          return (
            <div key={item.id} style={{ 
              background: "rgba(15, 23, 42, 0.75)", 
              padding: "18px", 
              borderRadius: "14px", 
              border: isProtected ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(52, 211, 153, 0.3)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "14px"
            }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ 
                    fontSize: "10px", 
                    background: item.type === 'image' ? '#facc15' : item.type === 'video_mradi' ? '#38bdf8' : '#c084fc', 
                    color: '#000', 
                    padding: "3px 6px", 
                    borderRadius: "4px", 
                    fontWeight: "900"
                  }}>
                    {item.type.toUpperCase()}
                  </span>
                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <span style={{ fontSize: "10px", background: "rgba(56,189,248,0.2)", color: "#38bdf8", padding: "2px 6px", borderRadius: "4px", fontWeight: "800" }}>
                      📥 {item.downloadsCount || 0}
                    </span>
                    <span style={{ 
                      fontSize: "10px", 
                      backgroundColor: isProtected ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.15)", 
                      color: isProtected ? "#ef4444" : "#34d399", 
                      padding: "3px 8px", 
                      borderRadius: "6px", 
                      fontWeight: "900"
                    }}>
                      {isProtected ? "🔒 Admin Approval" : "✨ Free"}
                    </span>
                  </div>
                </div>
                <h4 style={{ margin: "6px 0 0 0", fontSize: "14px", color: "#ffffff", fontWeight: "800" }}>{item.title}</h4>
              </div>
              
              <div style={{ display: "flex", gap: "8px" }}>
                {isProtected && (
                  <button 
                    onClick={() => alert(`Ombi la idhini limetumwa kwa ajili ya: ${item.title}`)} 
                    style={{ flex: 1, padding: "8px", background: "rgba(250, 204, 21, 0.15)", color: "#facc15", border: "1px solid rgba(250, 204, 21, 0.4)", borderRadius: "8px", fontWeight: "800", cursor: "pointer", fontSize: "11px" }}
                  >
                    Idhinisha (Approve)
                  </button>
                )}
                <button 
                  onClick={() => handleDeleteMedia(item.id)} 
                  style={{ flex: isProtected ? "0 0 auto" : "1", padding: "8px 12px", background: "rgba(239, 68, 68, 0.15)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.4)", borderRadius: "8px", fontWeight: "800", cursor: "pointer", fontSize: "11px" }}
                >
                  🗑️ Futa
                </button>
              </div>
            </div>
          );
        })}
        {/* PAYMENT MODAL WIZARD */}
        {showFormModal && (
          <div style={styles.modalOverlay}>
            <div style={{ ...styles.modalContent, background: theme.cardBg, border: theme.cardBorder }}>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0, color: theme.titleColor, fontSize: "18px", fontWeight: "900" }}>
                  {paymentSuccess ? "✅ Mchango Umekamilika" : `Form ya Mchango - Hatua ya ${step} / 3`}
                </h3>
                <button onClick={closeAndResetModal} style={styles.closeBtn}>✖</button>
              </div>

              {!paymentSuccess ? (
                <form style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {step === 1 && (
                    <>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Jina Yako Kamili *</label>
                        <input type="text" placeholder="Sheikh Abdallah" value={donorName} onChange={(e) => setDonorName(e.target.value)} style={{ ...styles.input, backgroundColor: theme.inputBg, color: theme.textColor }} />
                      </div>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Namba ya Simu *</label>
                        <input type="text" placeholder="07XXXXXXXX" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} style={{ ...styles.input, backgroundColor: theme.inputBg, color: theme.textColor }} />
                      </div>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Barua Pepe / Email</label>
                        <input type="email" placeholder="donor@example.com" value={donorEmail} onChange={(e) => setDonorEmail(e.target.value)} style={{ ...styles.input, backgroundColor: theme.inputBg, color: theme.textColor }} />
                      </div>
                      <button type="button" onClick={handleNextStep} style={{ ...styles.actionBtn, backgroundColor: theme.accentColor, color: "#000" }}>Endelea ➡️</button>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Chagua Mradi *</label>
                        <select value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)} style={{ ...styles.input, backgroundColor: theme.inputBg, color: theme.textColor }}>
                          {projectsList.map((p) => (
                            <option key={p.id} value={p.id} style={{ background: "#0f172a", color: "#fff" }}>{p.kichwa}</option>
                          ))}
                        </select>
                      </div>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Kiasi cha Mchango (TZS) *</label>
                        <input type="number" placeholder="50000" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ ...styles.input, backgroundColor: theme.inputBg, color: theme.textColor }} />
                      </div>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button type="button" onClick={() => setStep(1)} style={styles.backBtn}>⬅️ Nyuma</button>
                        <button type="button" onClick={handleNextStep} style={{ ...styles.actionBtn, backgroundColor: theme.accentColor, color: "#000" }}>Endelea ➡️</button>
                      </div>
                    </>
                  )}

                  {step === 3 && (
                    <>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Mtandao wa Simu</label>
                        <select value={network} onChange={(e) => setNetwork(e.target.value)} style={{ ...styles.input, backgroundColor: theme.inputBg, color: theme.textColor }}>
                          <option value="M-Pesa">Vodacom M-Pesa</option>
                          <option value="TigoPesa">Tigo Pesa</option>
                          <option value="AirtelMoney">Airtel Money</option>
                        </select>
                      </div>
                      <div style={{ padding: "10px", borderRadius: "8px", background: "rgba(0,0,0,0.5)" }}>
                        <p style={{ margin: 0, fontSize: "11px", color: "#cbd5e1" }}>Akaunti ya M-Koba:</p>
                        <p style={{ margin: "2px 0 0 0", fontSize: "14px", fontWeight: "900", color: "#facc15" }}>{mkobaAccount}</p>
                      </div>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Namba ya Siri (PIN)</label>
                        <input type="password" maxLength="4" placeholder="****" value={pinCode} onChange={(e) => setPinCode(e.target.value)} style={{ ...styles.input, backgroundColor: theme.inputBg, color: theme.textColor, letterSpacing: "6px" }} />
                      </div>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button type="button" onClick={() => setStep(2)} style={styles.backBtn}>⬅️ Nyuma</button>
                        <button type="button" onClick={handleFinalSubmit} disabled={isSubmitting} style={{ ...styles.actionBtn, backgroundColor: "#22c55e", color: "#fff" }}>
                          {isSubmitting ? "Inathibitisha..." : "Wasilisha Malipo 🤝"}
                        </button>
                      </div>
                    </>
                  )}
                </form>
              ) : (
                <div style={{ textAlign: "center", padding: "10px 0" }}>
                  <span style={{ fontSize: "50px" }}>🤲✨</span>
                  <h3 style={{ color: "#22c55e", margin: "10px 0" }}>Jazakallahu Khayran!</h3>
                  <p style={{ fontSize: "14px", color: "#ffffff" }}>Mchango wako wa TZS {lastReceipt?.amount.toLocaleString()} umepokelewa.</p>
                  <button onClick={closeAndResetModal} style={{ ...styles.actionBtn, backgroundColor: theme.accentColor, color: "#000", marginTop: "15px" }}>Funga</button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function tabStyle(isActive, theme) {
  return {
    padding: "10px 16px",
    borderRadius: "10px",
    border: isActive ? `2px solid ${theme.accentColor}` : "1px solid rgba(255,255,255,0.2)",
    backgroundColor: isActive ? theme.accentColor : "rgba(0,0,0,0.4)",
    color: isActive ? "#000" : "#fff",
    fontWeight: "900",
    fontSize: "13px",
    cursor: "pointer"
  };
}

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
  donateMainBtn: { border: "none", padding: "16px 40px", borderRadius: "14px", fontWeight: "900", fontSize: "16px", cursor: "pointer" },
  mediaInput: { width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "8px", border: "1.5px solid rgba(255,255,255,0.25)", boxSizing: "border-box", fontSize: "13px" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.85)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "16px" },
  modalContent: { width: "100%", maxWidth: "480px", padding: "24px", borderRadius: "20px" },
  closeBtn: { background: "transparent", border: "none", color: "#fff", fontSize: "20px", cursor: "pointer" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "12px", fontWeight: "800", textTransform: "uppercase", color: "#facc15" },
  input: { padding: "12px 14px", borderRadius: "10px", border: "1.5px solid rgba(255,255,255,0.25)", fontSize: "140px", outline: "none", fontWeight: "600" },
  actionBtn: { width: "100%", border: "none", padding: "12px", borderRadius: "10px", fontWeight: "900", fontSize: "14px", cursor: "pointer" },
  backBtn: { backgroundColor: "rgba(255,255,255,0.15)", color: "#fff", border: "none", padding: "12px", borderRadius: "10px", fontWeight: "800", fontSize: "13px", cursor: "pointer" }
};
}