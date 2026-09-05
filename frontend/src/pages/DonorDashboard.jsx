import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// MANDHARI 5 ZA HD VIBRANT (HIGH CONTRAST FOR LARGE FONTS)
const THEMES = {
  goldEmerald: {
    name: "Gold & Emerald Luxe 🌟",
    pageBg: "radial-gradient(circle at 50% -20%, #064e3b 0%, #022c22 60%, #011710 100%)",
    cardBg: "rgba(6, 78, 59, 0.85)",
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
    cardBg: "rgba(30, 27, 75, 0.85)",
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
    cardBg: "rgba(69, 26, 3, 0.85)",
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
    cardBg: "rgba(5, 30, 23, 0.88)",
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
    cardBg: "rgba(76, 29, 149, 0.85)",
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

// MIKOA YA TANZANIA NA COORDINATES ZA PRAYER TIMES
const REGIONS_COORDINATES = {
  "Dar es Salaam": { lat: -6.7924, lng: 39.2083 },
  "Mbeya": { lat: -8.9094, lng: 33.4586 },
  "Dodoma": { lat: -6.1630, lng: 35.7516 },
  "Arusha": { lat: -3.3869, lng: 36.6830 },
  "Mwanza": { lat: -2.5164, lng: 32.9033 },
  "Zanzibar": { lat: -6.1659, lng: 39.2026 },
  "Tanga": { lat: -5.0689, lng: 39.0988 },
  "Kigoma": { lat: -4.8769, lng: 29.6267 },
  "Morogoro": { lat: -6.8278, lng: 37.6591 }
};

// MIRADI YA LAZIMA KUSIMAMISHA MFUMO (FALLBACK PROJECTS)
const DEFAULT_PROJECTS = [
  { id: "p1", kichwa: "1. Mfuko wa Watoto Mayatima", lengoLaMchango: 8000000, kiasiKilichopatikana: 4200000 },
  { id: "p2", kichwa: "2. Vifaa vya Shule na Elimu", lengoLaMchango: 3000000, kiasiKilichopatikana: 1100000 },
  { id: "p3", kichwa: "3. Futari na Ramadhani", lengoLaMchango: 10000000, kiasiKilichopatikana: 6500000 },
  { id: "p4", kichwa: "4. Eidy Al-Fitr ya Watoto", lengoLaMchango: 4000000, kiasiKilichopatikana: 3200000 },
  { id: "p5", kichwa: "5. Mfuko wa Akiba wa Kituo", lengoLaMchango: 5000000, kiasiKilichopatikana: 1200000 }
];

const INITIAL_DONATION_LOGS = [
  { id: "TX101", donorName: "Rajabu Bashiri", email: "rajabubashiri75@gmail.com", project: "Mfuko wa Watoto Mayatima", amount: 150000, network: "M-Pesa", date: "2026-03-01 10:30 AM", status: "Imethibitishwa" },
  { id: "TX102", donorName: "Sheikh Abdallah", email: "abdallah@raudhwat.org", project: "Futari na Ramadhani", amount: 500000, network: "TigoPesa", date: "2026-03-02 02:15 PM", status: "Imethibitishwa" },
  { id: "TX103", donorName: "Rajabu Bashiri", email: "rajabubashiri75@gmail.com", project: "Eidy Al-Fitr ya Watoto", amount: 200000, network: "AirtelMoney", date: "2026-03-03 09:00 AM", status: "Imethibitishwa" }
];

const API_BASE_URL = "http://localhost:5000/api";

function DonorDashboard() {
  const navigate = useNavigate();
  // Theme State
  const [currentTheme, setCurrentTheme] = useState(() => localStorage.getItem("app_theme_v3") || "goldEmerald");
  const theme = THEMES[currentTheme] || THEMES.goldEmerald;
  // View Mode: 'projects' | 'myHistory'
  const [activeTab, setActiveTab] = useState("projects");
  // State ya Miradi na Jumla ya Pesa
  const [projectsList, setProjectsList] = useState(DEFAULT_PROJECTS);
  const [totalRaudhwatCash, setTotalRaudhwatCash] = useState(16200000);
  // Donor Data State
  const [donationLogs, setDonationLogs] = useState(INITIAL_DONATION_LOGS);
  // Current Logged-in Donor Info
  const [currentDonorEmail, setCurrentDonorEmail] = useState("rajabubashiri75@gmail.com");
  const [currentDonorName, setCurrentDonorName] = useState("Rajabu Bashiri");

  // LOCATION & PRAYER TIME STATES
  const [selectedRegion, setSelectedRegion] = useState("Dar es Salaam");
  const [userCoords, setUserCoords] = useState({ lat: -6.7924, lng: 39.2083 });
  const [hijriOffset, setHijriOffset] = useState(0); // Rekebisha tarehe ya Kiarabu (+1 au -1)
  const adhanAudioRef = useRef(new Audio("https://cdn.islamicfinder.org/adhan/athan.mp3"));

  // Dynamic Daily Islamic Content State
  const [dailyContent, setDailyContent] = useState(null);
  const [prayersData, setPrayersData] = useState({
    fajr: { status: false, time: "05:00 AM", canTick: true, isMissed: false, rawTime: "05:00" },
    dhuhr: { status: false, time: "01:00 PM", canTick: false, isMissed: true, rawTime: "13:00" },
    asr: { status: false, time: "04:15 PM", canTick: false, isMissed: false, rawTime: "16:15" },
    maghrib: { status: false, time: "06:45 PM", canTick: false, isMissed: false, rawTime: "18:45" },
    isha: { status: false, time: "08:00 PM", canTick: false, isMissed: false, rawTime: "20:00" }
  });

  const [formattedDates, setFormattedDates] = useState({
    islamicDate: "Inapakia...",
    gregorianDate: new Date().toLocaleDateString("sw-TZ", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  });

  // State ya Modal ya Donor Ku-Add Content
  const [showAddContentModal, setShowAddContentModal] = useState(false);
  const [newContentType, setNewContentType] = useState("hadith");
  const [newContentData, setNewContentData] = useState({
    arabic: "",
    swahili: "",
    dalili: ""
  });
  const [addContentMessage, setAddContentMessage] = useState("");

  // Form Modal Control (Donation)
  const [showFormModal, setShowFormModal] = useState(false);
  const [step, setStep] = useState(1);

  // Form Fields
  const [donorName, setDonorName] = useState(currentDonorName);
  const [donorEmail, setDonorEmail] = useState(currentDonorEmail);
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

  // REQUEST NOTIFICATION PERMISSION & AUTOMATIC GEOLOCATION
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => console.warn("Geolocation hakuwezekana, inatumia Region Mbeya/Dar: ", err)
      );
    }
  }, []);

  // FETCH PRAYER TIMES & HIJRI DATE VIA API AUTOMATICALLY
  useEffect(() => {
    const fetchPrayerTimesAndHijri = async () => {
      try {
        const timestamp = Math.floor(Date.now() / 1000);
        const url = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${userCoords.lat}&longitude=${userCoords.lng}&method=3&adjustment=${hijriOffset}`;
        const res = await axios.get(url);
        
        if (res.data && res.data.data) {
          const timings = res.data.data.timings;
          const hijri = res.data.data.date.hijri;
          const gregorian = res.data.data.date.gregorian;

          // Badili Prayer Times
          setPrayersData({
            fajr: { status: false, time: timings.Fajr, canTick: true, isMissed: false, rawTime: timings.Fajr },
            dhuhr: { status: false, time: timings.Dhuhr, canTick: true, isMissed: false, rawTime: timings.Dhuhr },
            asr: { status: false, time: timings.Asr, canTick: true, isMissed: false, rawTime: timings.Asr },
            maghrib: { status: false, time: timings.Maghrib, canTick: true, isMissed: false, rawTime: timings.Maghrib },
            isha: { status: false, time: timings.Isha, canTick: true, isMissed: false, rawTime: timings.Isha }
          });

          // Weka Tarehe ya Hijri Sahihi
          setFormattedDates({
            islamicDate: `${hijri.day} ${hijri.month.en} ${hijri.year} AH`,
            gregorianDate: `${gregorian.weekday.en}, ${gregorian.day} ${gregorian.month.en} ${gregorian.year}`
          });
        }
      } catch (err) {
        console.warn("Aladhan API Offline, inatumia fallback local state:", err);
      }
    };

    fetchPrayerTimesAndHijri();
  }, [userCoords, hijriOffset]);

  // FETCH ISLAMIC CONTENT (QURAN, HADITH, NAMES OF ALLAH) FROM API
  useEffect(() => {
    const fetchIslamicContent = async () => {
      try {
        const randomAyah = Math.floor(Math.random() * 6236) + 1;
        const randomName = Math.floor(Math.random() * 99) + 1;

        const [quranRes, nameRes] = await Promise.all([
          axios.get(`https://api.alquran.cloud/v1/ayah/${randomAyah}/editions/quran-uthmani,sw.barwani`),
          axios.get(`https://api.aladhan.com/v1/asmaAlHusna/${randomName}`)
        ]);

        const ayahData = quranRes.data?.data;
        const nameData = nameRes.data?.data?.[0];

        setDailyContent({
          quranVerse: {
            arabic: ayahData?.[0]?.text || "مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ...",
            swahili: ayahData?.[1]?.text || "Mfano wa wale wanaotoa mali zao katika njia ya Allah...",
            dalili: `Surah ${ayahData?.[0]?.surah?.englishName} (${ayahData?.[0]?.surah?.number}:${ayahData?.[0]?.numberInSurah})`
          },
          hadith: {
            arabic: "أَنَا وَكَافِلُ الْيَتِيمِ فِي الْجَنَّةِ هَكَذَا...",
            swahili: "Mimi na yule mwenye kumlea na kumsaidia YATIMA tutakuwa pamoja Peponi...",
            dalili: "Sahih al-Bukhari (5304)"
          },
          dua: {
            arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
            swahili: "Mola wetu, tupe duniani mema na Akhera mema, na utukingishe na adhabu ya Moto.",
            dalili: "Dua kutoka katika Qur'an"
          },
          allahName: {
            arabic: nameData?.name || "الرَّحْمَٰنُ",
            transliteration: nameData?.transliteration || "AR-RAHMAN",
            swahili: nameData?.en?.meaning || "Mwingi wa Rehema Mwenye Kueneza Rehema zake kwa viumbe vyote.",
            dalili: `Jina la ${randomName} katika Asmaul Husna`
          }
        });
      } catch (err) {
        console.warn("Islamic APIs Offline, inatumia fallback local content:", err);
      }
    };

    fetchIslamicContent();
  }, []);

  // ADHAN & NOTIFICATION TRACKER INTERVAL
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;

      Object.keys(prayersData).forEach((pKey) => {
        if (prayersData[pKey].rawTime === currentTimeStr && !prayersData[pKey].status) {
          // Cheza Adhana
          adhanAudioRef.current.play().catch((e) => console.log("Audio auto-play alert:", e));

          // Onyesha Desktop Notification
          if (Notification.permission === "granted") {
            new Notification(`📢 Muda wa Swala ya ${pKey.toUpperCase()} Umewadia!`, {
              body: `Ni wakati wa kutekeleza Swala kulingana na eneo lako.`,
              icon: "https://cdn-icons-png.flaticon.com/512/2913/2913008.png"
            });
          }
        }
      });
    }, 30000); // Check every 30 seconds

    return () => clearInterval(timer);
  }, [prayersData]);

  // HANDLER FOR MANUAL REGION CHANGE
  const handleRegionChange = (region) => {
    setSelectedRegion(region);
    if (REGIONS_COORDINATES[region]) {
      setUserCoords(REGIONS_COORDINATES[region]);
    }
  };

  // FETCH BACKEND DATA (DASHBOARD & PRAYER TRACKER)
  useEffect(() => {
    const MY_REAL_DONOR_ID = "6a9432cc8df6e354b4fb8b49";
    const activeDonorId = localStorage.getItem("donorId") || MY_REAL_DONOR_ID;
    const token = localStorage.getItem("token");
    const authHeader = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    axios.get(`${API_BASE_URL}/donors/dashboard/${activeDonorId}`, authHeader)
      .then((res) => {
        if (res.data?.projects) setProjectsList(res.data.projects);
        if (res.data?.totalCash) setTotalRaudhwatCash(res.data.totalCash);
        if (res.data?.donorName) {
          setCurrentDonorName(res.data.donorName);
          setDonorName(res.data.donorName);
        }
        if (res.data?.donorEmail) {
          setCurrentDonorEmail(res.data.donorEmail);
          setDonorEmail(res.data.donorEmail);
        }
      })
      .catch((err) => console.warn("Dashboard API offline, unatumia local data:", err));
  }, []);

  // TOGGLE PRAYER TICK FUNCTION
  const handlePrayerToggle = async (prayerName) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE_URL}/daily-content/prayer-toggle`,
        { prayerName },
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      if (res.data?.success && res.data?.prayers) {
        setPrayersData(res.data.prayers);
      } else {
        setPrayersData((prev) => ({
          ...prev,
          [prayerName]: { ...prev[prayerName], status: !prev[prayerName].status }
        }));
      }
    } catch (err) {
      setPrayersData((prev) => ({
        ...prev,
        [prayerName]: { ...prev[prayerName], status: !prev[prayerName].status }
      }));
    }
  };

  // DONOR SUBMIT CUSTOM CONTENT
  const handleAddDonorContent = async (e) => {
    e.preventDefault();
    if (!newContentData.swahili) {
      alert("Tafadhali ingiza maelezo/tafsiri ya Kiswahili!");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE_URL}/daily-content/donor-add`,
        {
          contentType: newContentType,
          contentData: newContentData
        },
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      if (res.data?.success) {
        setAddContentMessage(res.data.message || "Maudhui yako yamepokelewa na yanatumwa kwa Admin!");
        setTimeout(() => {
          setShowAddContentModal(false);
          setAddContentMessage("");
          setNewContentData({ arabic: "", swahili: "", dalili: "" });
        }, 2000);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Imeshindikana kuongeza content");
    }
  };

  // HESABU MICHANGO YA DONOR
  const myPersonalLogs = donationLogs.filter(
    (log) => log.email?.toLowerCase() === currentDonorEmail?.toLowerCase() || log.donorName === currentDonorName
  );
  const myTotalDonated = myPersonalLogs.reduce((sum, item) => sum + Number(item.amount), 0);

  // FAITH ASSESSMENT BADGE
  const getFaithAssessment = () => {
    if (myTotalDonated >= 100000) {
      return {
        badge: "🌟 MUUMINI MKARIMU SANA (SABIUN BIL-KHAIRAT)",
        color: "#10b981",
        bg: "rgba(16, 185, 129, 0.2)",
        msg: "MashaAllah! Moyo wako wa kutoa katika njia ya Allah na kusaidia Mayatima ni mkubwa sana. Tunamuomba Allah akulipe Pepo ya Firdaus na akuzidishie kheri katika mali na familia yako!"
      };
    } else if (myTotalDonated > 0) {
      return {
        badge: "🌿 MUUMINI ANAYEJITAHIDI KUTOA (MUKHTASID)",
        color: "#facc15",
        bg: "rgba(250, 204, 21, 0.2)",
        msg: "Alhamdulillah kwa kujitahidi kwako kutoa! Allah anapokea hata mbegu ndogo zaidi. Ongeza juhudi ufikie daraja za juu zaidi za kusaidia wanyonge na Mayatima."
      };
    } else {
      return {
        badge: "⚠️ TANBIHI NA WITO WA TOBA / KUAMKA IMOYO",
        color: "#ef4444",
        bg: "rgba(239, 68, 68, 0.25)",
        msg: "Astaghfirullah! Bado hujatoa mchango wowote kwenye mfuko huu. Kumbuka Mtume (S.A.W) amesema Sadaka haipunguzi mali! Usiwe na moyo mzito au wenye choyo mbele ya Mayatima na Dini ya Allah. Toa kidogo hata kama ni TZS 1,000 uweke akiba ya Akhera!"
      };
    }
  };
  const faithAssessment = getFaithAssessment();

  const getProgressBarColor = (percentage) => {
    if (percentage <= 24) return "#ef4444";
    if (percentage <= 49) return "#f97316";
    if (percentage <= 74) return "#facc15";
    return "#22c55e";
  };

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

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (!pinCode || pinCode.length < 4) {
      alert("Tafadhali ingiza Namba ya Siri (PIN) ili kuthibitisha muamala!");
      return;
    }
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
        donorName: donorName || currentDonorName,
        email: donorEmail || currentDonorEmail,
        project: targetProj ? targetProj.kichwa : "Mchango wa Raudhwat",
        amount: donatedVal,
        network: paymentCategory === "mobile" ? network : "Card Payment",
        date: new Date().toLocaleDateString("sw-TZ") + " " + new Date().toLocaleTimeString("sw-TZ"),
        status: "Imethibitishwa"
      };
      setDonationLogs((prev) => [newLog, ...prev]);
      const receiptData = {
        receiptNo: "RATFAL-" + Math.floor(100000 + Math.random() * 900000),
        donorName: donorName || currentDonorName,
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

        {/* BRANDING HEADER WITH DYNAMIC DATE & REGION TRACKER */}
        <header style={styles.header}>
          <p style={{ ...styles.bismillah, color: theme.bismillahColor }}>بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</p>
          <h1 style={{ ...styles.title, color: theme.titleColor }}>RAUDHWAT AL-ATFAL</h1>
          <p style={{ ...styles.subtitle, color: theme.subtitleColor }}>Mfumo Rasmi wa Mchango wa Sadaka na Miradi</p>

          {/* CHAGUA MKOA NA REKEBISHA TAREHE YA KIARABU */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
            <label style={{ fontSize: "12px", fontWeight: "bold", color: "#facc15" }}>📍 MKOA WAKO:</label>
            <select
              value={selectedRegion}
              onChange={(e) => handleRegionChange(e.target.value)}
              style={{ padding: "4px 8px", borderRadius: "6px", backgroundColor: theme.inputBg, color: "#fff", border: "1px solid #facc15" }}
            >
              {Object.keys(REGIONS_COORDINATES).map((reg) => (
                <option key={reg} value={reg} style={{ background: "#0f172a" }}>{reg}</option>
              ))}
            </select>

            <label style={{ fontSize: "12px", fontWeight: "bold", color: "#facc15", marginLeft: "10px" }}>🌙 MWEZI (+/- Siku):</label>
            <button onClick={() => setHijriOffset(prev => prev - 1)} style={{ padding: "2px 8px", borderRadius: "4px" }}>-1</button>
            <span style={{ fontSize: "12px", fontWeight: "bold" }}>{hijriOffset}</span>
            <button onClick={() => setHijriOffset(prev => prev + 1)} style={{ padding: "2px 8px", borderRadius: "4px" }}>+1</button>
          </div>

          {/* TAREHE ZA KIARABU NA KISWAHILI */}
          <div style={styles.dateHeaderContainer}>
            <span style={styles.dateBadgeLabel}>📅 TAREHE YA LEO:</span>
            <span style={styles.dateTextArabic}>{formattedDates.islamicDate}</span>
            <span style={{ color: "#facc15" }}>|</span>
            <span style={styles.dateTextSwahili}>{formattedDates.gregorianDate}</span>
          </div>
          <div style={{ ...styles.goldDivider, background: theme.dividerColor }}></div>
        </header>

        {/* SECTION: PRAYER TRACKER (SWALA 5 WITH VIBOX VYA DUARA) */}
        <div style={{ ...styles.prayerTrackerBox, backgroundColor: "rgba(0,0,0,0.6)", border: theme.cardBorder }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
            <h3 style={{ margin: 0, color: "#facc15", fontSize: "16px", fontWeight: "900", display: "flex", alignItems: "baseline", gap: "8px" }}>
              <span>🕌</span> TRACKER YA SWALA 5 ZA LEO ({selectedRegion.toUpperCase()})
            </h3>
            <span style={{ fontSize: "12px", color: "#6ee7b7", fontWeight: "700" }}>
              Bofya duara kuweka tick au kurekebisha swala iliyoswaliwa!
            </span>
          </div>
          <div style={styles.prayerGrid}>
            {Object.keys(prayersData).map((pKey) => {
              const prayer = prayersData[pKey];
              const pNameCapitalized = pKey.toUpperCase();
              return (
                <div key={pKey} style={styles.prayerCircleCard}>
                  <span style={styles.prayerNameText}>{pNameCapitalized}</span>
                  <span style={styles.prayerTimeText}>{prayer.time}</span>
                  {/* DUARA CIRCLE WITH Dynamic TICK / ? / LOCKED */}
                  <button
                    onClick={() => handlePrayerToggle(pKey)}
                    disabled={!prayer.canTick}
                    style={{
                      ...styles.circleBtn,
                      backgroundColor: prayer.status
                        ? "#10b981"
                        : (prayer.isMissed ? "#ef4444" : "rgba(255,255,255,0.1)"),
                      borderColor: prayer.status
                        ? "#34d399"
                        : (prayer.isMissed ? "#f87171" : "rgba(255,255,255,0.3)"),
                      cursor: prayer.canTick ? "pointer" : "not-allowed",
                      opacity: prayer.canTick || prayer.status || prayer.isMissed ? 1 : 0.5
                    }}
                    title={!prayer.canTick && !prayer.isMissed ? "Muda wa swala hii bado haujafika" : ""}
                  >
                    {prayer.status ? "✔️" : (prayer.isMissed ? "❓" : "🔒")}
                  </button>
                  <span style={{ fontSize: "10px", marginTop: "4px", color: prayer.status ? "#34d399" : (prayer.isMissed ? "#ef4444" : "#cbd5e1") }}>
                    {prayer.status ? "Umeswali" : (prayer.isMissed ? "Hujaweka Tick" : "Subiri Muda")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION: DYNAMIC DAILY ISLAMIC CONTENT (QURAN, HADITH, DUA & MAJINA YA ALLAH) */}
        <div style={{ ...styles.quotesWrapper, backgroundColor: "rgba(0,0,0,0.55)", border: theme.cardBorder }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "14px" }}>
            <h3 style={{ margin: 0, color: "#facc15", fontSize: "16px", fontWeight: "900" }}>
              📖 MAUDHUI YA LEO (HADITH, AYA, DUA NA MAJINA YA ALLAH)
            </h3>
            <button
              onClick={() => setShowAddContentModal(true)}
              style={{ ...styles.addContentBtn, backgroundColor: theme.accentColor, color: "#000" }}
            >
              ➕ Ongeza Maudhui (Option)
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>

            {/* 1. QURAN VERSE */}
            <div style={styles.quoteCard}>
              <span style={styles.quoteBadge}>📖 AYA YA QUR'AN</span>
              <p style={styles.arabicText}>{dailyContent?.quranVerse?.arabic || "مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ..."}</p>
              <p style={styles.swahiliQuote}>{dailyContent?.quranVerse?.swahili || "“Mfano wa wale wanaotoa mali zao katika njia ya Allah ni kama mfano wa mbegu...”"}</p>
              <p style={styles.daliliText}>📌 {dailyContent?.quranVerse?.dalili || "Surah Al-Baqarah (2:261)"}</p>
            </div>
            {/* 2. HADITH */}
            <div style={styles.quoteCard}>
              <span style={styles.quoteBadge}>✨ HADITH YA MTUME (S.A.W)</span>
              <p style={styles.arabicText}>{dailyContent?.hadith?.arabic || "أَنَا وَكَافِلُ الْيَتِيمِ فِي الْجَنَّةِ هَكَذَا..."}</p>
              <p style={styles.swahiliQuote}>{dailyContent?.hadith?.swahili || "“Mimi na yule mwenye kumlea na kumsaidia YATIMA tutakuwa pamoja Peponi...”"}</p>
              <p style={styles.daliliText}>📌 {dailyContent?.hadith?.dalili || "Sahih al-Bukhari (5304)"}</p>
            </div>
            {/* 3. DUA YA LEO */}
            <div style={styles.quoteCard}>
              <span style={styles.quoteBadge}>🤲 DUA YA LEO</span>
              <p style={styles.arabicText}>{dailyContent?.dua?.arabic || "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ"}</p>
              <p style={styles.swahiliQuote}>{dailyContent?.dua?.swahili || "“Mola wetu, tupe duniani mema na Akhera mema, na utukingishe na adhabu ya Moto.”"}</p>
              <p style={styles.daliliText}>📌 {dailyContent?.dua?.dalili || "Dua kutoka katika Qur'an"}</p>
            </div>
            {/* 4. JINA LA ALLAH NA MAANA YAKE */}
            <div style={styles.quoteCard}>
              <span style={styles.quoteBadge}>🌟 JINA LA ALLAH (ASMA-UL-HUSNA)</span>
              <p style={{ ...styles.arabicText, fontSize: "24px", color: "#facc15" }}>
                {dailyContent?.allahName?.arabic || "الرَّحْمَٰنُ"} ({dailyContent?.allahName?.transliteration || "AR-RAHMAN"})
              </p>
              <p style={styles.swahiliQuote}>
                <strong>Maana:</strong> {dailyContent?.allahName?.swahili || "Mwingi wa Rehema Mwenye Kueneza Rehema zake kwa viumbe vyote."}
              </p>
              <p style={styles.daliliText}>📌 {dailyContent?.allahName?.dalili || "Jina la 1 katika Asmaul Husna"}</p>
            </div>
          </div>
        </div>

        {/* SECTION: PERSONAL FAITH & CHARITY ASSESSMENT */}
        <div style={{ ...styles.faithBox, backgroundColor: faithAssessment.bg, border: `2px solid ${faithAssessment.color}` }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: "12px", fontWeight: "900", color: faithAssessment.color, textTransform: "uppercase", letterSpacing: "1px" }}>
              {faithAssessment.badge}
            </span>
            <h3 style={{ margin: "6px 0 4px 0", fontSize: "20px", fontWeight: "900", color: "#ffffff" }}>
              Ndugu: {currentDonorName} ({currentDonorEmail})
            </h3>
            <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.5", color: "#e2e8f0" }}>
              {faithAssessment.msg}
            </p>
          </div>
          <div style={{ textAlign: "right", minWidth: "180px" }}>
            <span style={{ display: "block", fontSize: "11px", color: "#cbd5e1", fontWeight: "800" }}>JUMLA ULIYOTOA HADI SASA:</span>
            <strong style={{ fontSize: "22px", color: "#facc15", fontWeight: "900" }}>TZS {myTotalDonated.toLocaleString()}</strong>
            <span style={{ display: "block", fontSize: "12px", color: "#34d399", fontWeight: "700", marginTop: "2px" }}>
              Idadi ya Michango: {myPersonalLogs.length}
            </span>
          </div>
        </div>

        {/* NAVIGATION TABS SWITCHER (DONOR ONLY) */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("projects")}
            style={{
              padding: "12px 20px",
              borderRadius: "12px",
              border: activeTab === "projects" ? `2px solid ${theme.accentColor}` : "1px solid rgba(255,255,255,0.2)",
              backgroundColor: activeTab === "projects" ? theme.accentColor : "rgba(0,0,0,0.4)",
              color: activeTab === "projects" ? "#000" : "#fff",
              fontWeight: "900",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            📊 Miradi & Progress Bars
          </button>
          <button
            onClick={() => setActiveTab("myHistory")}
            style={{
              padding: "12px 20px",
              borderRadius: "12px",
              border: activeTab === "myHistory" ? `2px solid ${theme.accentColor}` : "1px solid rgba(255,255,255,0.2)",
              backgroundColor: activeTab === "myHistory" ? theme.accentColor : "rgba(0,0,0,0.4)",
              color: activeTab === "myHistory" ? "#000" : "#fff",
              fontWeight: "900",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            📜 Historia Yangu ya Michango ({myPersonalLogs.length})
          </button>
        </div>

        {/* JUMLA YA FEDHA TASLIMU */}
        <div style={styles.cashHeaderCard}>
          <div>
            <p style={{ margin: 0, fontSize: "12px", fontWeight: "800", color: "#facc15", textTransform: "uppercase", letterSpacing: "1px" }}>
              💵 JUMLA YA FEDHA TASLIMU ZA RAUDHWAT AL ATFAL
            </p>
            <h2 style={{ margin: "6px 0 0 0", fontSize: "36px", fontWeight: "900", color: "#ffffff", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
              TZS {totalRaudhwatCash.toLocaleString()}
            </h2>
          </div>
          <div style={{ fontSize: "45px" }}>🤲</div>
        </div>

        {/* TAB 1: MIRADI NA PROGRESS BARS */}
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
                      <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "900", color: "#ffffff" }}>{p.kichwa}</h3>
                      <span style={{ fontSize: "18px", fontWeight: "900", color: barColor, textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>{percentage}%</span>
                    </div>
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

        {/* TAB 2: HISTORIA YANGU YA MICHANGO */}
        {activeTab === "myHistory" && (
          <div style={{ ...styles.card, background: theme.cardBg, border: theme.cardBorder, marginBottom: "24px" }}>
            <div style={styles.cardHeader}>
              <span style={{ fontSize: "28px" }}>📜</span>
              <div>
                <h2 style={{ ...styles.cardTitle, color: theme.titleColor, fontSize: "20px" }}>Historia Yangu ya Michango (My Personal Donations)</h2>
                <p style={{ margin: 0, fontSize: "13px", color: theme.subtitleColor, fontWeight: "600" }}>Kumbukumbu ya Michango Yote Uliyotoa Kwenye Mfumo Huu</p>
              </div>
            </div>
            {myPersonalLogs.length > 0 ? (
              <div style={{ overflowX: "auto", marginTop: "20px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #facc15", color: "#facc15", fontSize: "13px" }}>
                      <th style={{ padding: "14px" }}>TX ID</th>
                      <th style={{ padding: "14px" }}>MRADI ULIOCHANGIA</th>
                      <th style={{ padding: "14px" }}>KIASI (TZS)</th>
                      <th style={{ padding: "14px" }}>MTANDAO</th>
                      <th style={{ padding: "14px" }}>TAREGHE & MUDA</th>
                      <th style={{ padding: "14px" }}>RISITI</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: "14px" }}>
                    {myPersonalLogs.map((log) => (
                      <tr key={log.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.2)" }}>
                        <td style={{ padding: "14px", fontWeight: "900", color: "#38bdf8" }}>{log.id}</td>
                        <td style={{ padding: "14px", fontWeight: "900", color: "#ffffff" }}>{log.project}</td>
                        <td style={{ padding: "14px", fontWeight: "900", color: "#34d399", fontSize: "15px" }}>TZS {log.amount.toLocaleString()}</td>
                        <td style={{ padding: "14px", color: "#e2e8f0" }}>{log.network}</td>
                        <td style={{ padding: "14px", color: "#cbd5e1", fontSize: "12px" }}>{log.date}</td>
                        <td style={{ padding: "14px" }}>
                          <button
                            onClick={() => alert(`RISITI YA MCHANGO\n\nTX ID: ${log.id}\nMchangiaji: ${log.donorName}\nMradi: ${log.project}\nKiasi: TZS ${log.amount.toLocaleString()}\nTarehe: ${log.date}`)}
                            style={{ backgroundColor: theme.accentColor, color: "#000", border: "none", padding: "6px 12px", borderRadius: "6px", fontWeight: "900", fontSize: "12px", cursor: "pointer" }}
                          >
                            📄 Angalia
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "30px 0" }}>
                <p style={{ fontSize: "16px", color: "#ef4444", fontWeight: "800" }}>⚠️ Bado hujafanya mchango wowote katika akaunti hii!</p>
                <button
                  onClick={() => setShowFormModal(true)}
                  style={{ ...styles.donateMainBtn, backgroundColor: theme.accentColor, color: "#000", marginTop: "10px" }}
                >
                  ❤️ Anza Kutoa Mchango Wako wa Kwanza
                </button>
              </div>
            )}
          </div>
        )}

        {/* MODAL 1: DONOR ADD CUSTOM CONTENT */}
        {showAddContentModal && (
          <div style={styles.modalOverlay}>
            <div style={{ ...styles.modalContent, background: theme.cardBg, border: theme.cardBorder }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0, color: theme.titleColor, fontSize: "18px", fontWeight: "900" }}>
                  ✍️ Kuongeza Maudhui ya Kiislamu (Option)
                </h3>
                <button onClick={() => setShowAddContentModal(false)} style={styles.closeBtn}>✖</button>
              </div>
              {addContentMessage ? (
                <div style={{ padding: "16px", borderRadius: "10px", background: "rgba(34,197,94,0.2)", border: "1px solid #22c55e", textAlign: "center" }}>
                  <p style={{ margin: 0, color: "#34d399", fontWeight: "bold" }}>{addContentMessage}</p>
                </div>
              ) : (
                <form onSubmit={handleAddDonorContent} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Aina ya Content</label>
                    <select
                      value={newContentType}
                      onChange={(e) => setNewContentType(e.target.value)}
                      style={{ ...styles.input, backgroundColor: theme.inputBg, color: theme.textColor }}
                    >
                      <option value="hadith" style={{ background: "#0f172a" }}>Hadithi ya Mtume (S.A.W)</option>
                      <option value="quranVerse" style={{ background: "#0f172a" }}>Aya ya Qur'an</option>
                      <option value="dua" style={{ background: "#0f172a" }}>Dua ya Siku</option>
                      <option value="allahName" style={{ background: "#0f172a" }}>Jina la Allah & Maana</option>
                    </select>
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Kiarabu (Arabic - Sio Lazima)</label>
                    <input
                      type="text"
                      placeholder="Mfano: َّإِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ"
                      value={newContentData.arabic}
                      onChange={(e) => setNewContentData({ ...newContentData, arabic: e.target.value })}
                      style={{ ...styles.input, backgroundColor: theme.inputBg, color: theme.textColor, fontFamily: "'Amiri', serif" }}
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Tafsiri Ya Kiswahili *</label>
                    <textarea
                      rows="3"
                      placeholder="Andika mafunzo au tafsiri kwa kiswahili..."
                      value={newContentData.swahili}
                      onChange={(e) => setNewContentData({ ...newContentData, swahili: e.target.value })}
                      style={{ ...styles.input, backgroundColor: theme.inputBg, color: theme.textColor, resize: "none" }}
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Dalili / Rejea (Reference)</label>
                    <input
                      type="text"
                      placeholder="Mfano: Sahih Al-Bukhari Na. 1"
                      value={newContentData.dalili}
                      onChange={(e) => setNewContentData({ ...newContentData, dalili: e.target.value })}
                      style={{ ...styles.input, backgroundColor: theme.inputBg, color: theme.textColor }}
                    />
                  </div>
                  <button type="submit" style={{ ...styles.actionBtn, backgroundColor: theme.accentColor, color: "#000", marginTop: "10px" }}>
                    🚀 Tuma Kwa Admin Ithibitishwe
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* MODAL 2: MCHANGO NA PAYMENT WIZARD */}
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

                  {/* HATUA YA 1 */}
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
                        <label style={styles.label}>Barua Pepe / Email</label>
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
                  {/* HATUA YA 2 */}
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
                  {/* HATUA YA 3 */}
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

// STYLES
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
  dateHeaderContainer: { display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", margin: "12px 0 4px 0", flexWrap: "wrap", fontSize: "13px", fontWeight: "800" },
  dateBadgeLabel: { backgroundColor: "rgba(250, 204, 21, 0.2)", color: "#facc15", padding: "4px 10px", borderRadius: "8px", border: "1px solid rgba(250, 204, 21, 0.4)" },
  dateTextArabic: { color: "#34d399", fontFamily: "'Amiri', serif", fontSize: "15px" },
  dateTextSwahili: { color: "#ffffff" },
  goldDivider: { height: "3px", width: "100px", margin: "12px auto 0 auto", borderRadius: "2px" },

  // PRAYER TRACKER STYLES
  prayerTrackerBox: { padding: "18px 20px", borderRadius: "20px", marginBottom: "20px" },
  prayerGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "12px", marginTop: "10px" },
  prayerCircleCard: { backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "16px", padding: "12px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
  prayerNameText: { fontSize: "13px", fontWeight: "900", color: "#facc15" },
  prayerTimeText: { fontSize: "11px", color: "#cbd5e1", marginBottom: "8px" },
  circleBtn: { width: "42px", height: "42px", borderRadius: "50%", border: "2px solid", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", transition: "all 0.3s ease", outline: "none" },

  // ISLAMIC QUOTES STYLES
  quotesWrapper: { padding: "20px", borderRadius: "20px", marginBottom: "20px" },
  addContentBtn: { border: "none", padding: "8px 16px", borderRadius: "10px", fontWeight: "900", fontSize: "12px", cursor: "pointer" },
  quoteCard: { backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "14px", padding: "16px", display: "flex", flexDirection: "column", gap: "8px" },
  quoteBadge: { alignSelf: "flex-start", backgroundColor: "rgba(250, 204, 21, 0.2)", color: "#facc15", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "900" },
  arabicText: { margin: 0, fontSize: "16px", fontWeight: "bold", color: "#34d399", textAlign: "right", fontFamily: "'Amiri', serif" },
  swahiliQuote: { margin: 0, fontSize: "13px", color: "#ffffff", fontStyle: "italic", lineHeight: "1.5" },
  daliliText: { margin: 0, fontSize: "11px", color: "#cbd5e1", fontWeight: "800" },

  // PERSONAL FAITH ASSESSMENT STYLES
  faithBox: { padding: "18px 24px", borderRadius: "18px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" },
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
