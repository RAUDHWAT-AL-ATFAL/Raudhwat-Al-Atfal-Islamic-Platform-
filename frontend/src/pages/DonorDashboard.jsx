import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// MANDHARI 5 ZA HD VIBRANT (HIGH CONTRAST & LARGE GLOWING FONTS)
const THEMES = {
  goldEmerald: {
    name: "Gold & Emerald Luxe 🌟",
    pageBg: "radial-gradient(circle at 50% -20%, #064e3b 0%, #022c22 60%, #011710 100%)",
    cardBg: "rgba(4, 47, 36, 0.92)",
    cardBorder: "2px solid rgba(250, 204, 21, 0.8)",
    textColor: "#ffffff",
    bismillahColor: "#fde047",
    titleColor: "#ffffff",
    subtitleColor: "#6ee7b7",
    dividerColor: "linear-gradient(90deg, transparent, #facc15, #10b981, transparent)",
    accentColor: "#facc15",
    inputBg: "rgba(2, 44, 34, 0.95)",
  },
  sapphireNight: {
    name: "Sapphire Arabic Night 💎",
    pageBg: "radial-gradient(circle at 50% -20%, #1e1b4b 0%, #0f172a 60%, #020617 100%)",
    cardBg: "rgba(15, 23, 42, 0.92)",
    cardBorder: "2px solid rgba(56, 189, 248, 0.8)",
    textColor: "#ffffff",
    bismillahColor: "#38bdf8",
    titleColor: "#ffffff",
    subtitleColor: "#a5b4fc",
    dividerColor: "linear-gradient(90deg, transparent, #38bdf8, #818cf8, transparent)",
    accentColor: "#38bdf8",
    inputBg: "rgba(15, 23, 42, 0.95)",
  },
  sunsetGlow: {
    name: "Sunset Mosque Glow 🌅",
    pageBg: "radial-gradient(circle at 50% -20%, #451a03 0%, #1c0a00 60%, #0c0400 100%)",
    cardBg: "rgba(43, 15, 1, 0.92)",
    cardBorder: "2px solid rgba(251, 146, 60, 0.8)",
    textColor: "#ffffff",
    bismillahColor: "#fb923c",
    titleColor: "#ffffff",
    subtitleColor: "#fde047",
    dividerColor: "linear-gradient(90deg, transparent, #fb923c, #fde047, transparent)",
    accentColor: "#f97316",
    inputBg: "rgba(28, 10, 0, 0.95)",
  },
  neonForest: {
    name: "Neon Forest & Mint 🌿",
    pageBg: "radial-gradient(circle at 50% -20%, #022c22 0%, #051e17 60%, #010d0a 100%)",
    cardBg: "rgba(2, 44, 34, 0.92)",
    cardBorder: "2px solid rgba(52, 211, 153, 0.8)",
    textColor: "#ffffff",
    bismillahColor: "#34d399",
    titleColor: "#ffffff",
    subtitleColor: "#a7f3d0",
    dividerColor: "linear-gradient(90deg, transparent, #34d399, #059669, transparent)",
    accentColor: "#10b981",
    inputBg: "rgba(1, 13, 10, 0.95)",
  },
  royalViolet: {
    name: "Royal Violet & Rose Gold 🔮",
    pageBg: "radial-gradient(circle at 50% -20%, #4c1d95 0%, #2e1065 60%, #0f051d 100%)",
    cardBg: "rgba(46, 16, 101, 0.92)",
    cardBorder: "2px solid rgba(244, 114, 182, 0.8)",
    textColor: "#ffffff",
    bismillahColor: "#f472b6",
    titleColor: "#ffffff",
    subtitleColor: "#e9d5ff",
    dividerColor: "linear-gradient(90deg, transparent, #f472b6, #c084fc, transparent)",
    accentColor: "#f472b6",
    inputBg: "rgba(15, 5, 29, 0.95)",
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

// LIVE CHANNELS (ULTRA HD) & MASHEIKH (AUDIO & VIDEO OPTION)
const INITIAL_ADMIN_MEDIA = [
  // ==========================================
  // SEHEMU YA KWANZA: ULTRA HD LIVE TV CHANNELS (5)
  // ==========================================
  {
    id: "tv_1",
    title: "TV Imaan - Ultra HD Live Stream",
    type: "iframe",
    url: "https://www.youtube.com/embed/live_stream?channel=UCXb63vW1H1zP4F5oV529EwA",
    description: "Matangazo ya moja kwa moja ya Ultra HD, darsa, na vipindi vya kiislamu kutoka TV Imaan."
  },
  {
    id: "tv_2",
    title: "IBN TV - Ultra HD Live Stream",
    type: "iframe",
    url: "https://www.youtube.com/embed/live_stream?channel=UCOhZ6bF-qJp0Q5WwY0p0WwA",
    description: "Vipindi vya Dini kwa kiwango cha juu zaidi, mihadhara, na matangazo ya moja kwa moja."
  },
  {
    id: "tv_3",
    title: "Maahasin TV - Ultra HD Live Stream",
    type: "iframe",
    url: "https://www.youtube.com/embed/live_stream?channel=UCTGP-uD38RqgTK5e5nx6CxQ",
    description: "Televisheni ya Kiislamu inayowaletea mawaidha na vipindi vya kuelimisha jamii katika ubora wa Ultra HD."
  },
  {
    id: "tv_4",
    title: "Salaam TV - Ultra HD Live Stream",
    type: "iframe",
    url: "https://www.youtube.com/embed/live_stream?channel=UCSalaamTVChannelId",
    description: "Matangazo ya moja kwa moja ya Ultra HD, quran, na darsa mbalimbali kutoka Salaam TV."
  },
  {
    id: "tv_5",
    title: "Al-Hidaya TV - Ultra HD Live Stream",
    type: "iframe",
    url: "https://www.youtube.com/embed/live_stream?channel=UCAlHidayaChannelId",
    description: "Kituo maalum cha kuelimisha kuhusu mafunzo sahihi ya Qur'an na Sunnah kwa ubora wa Ultra HD."
  },
  // ==========================================
  // SEHEMU YA PILI: MASHEHE 11 (VIDEO & AUDIO OPTIONS)
  // ==========================================
  {
    id: "kishki_1",
    title: "1. Sheikh Nurdin Kishki - Fadhila za Kulisha Mayatima",
    type: "sheikh",
    videoUrl: "https://www.youtube.com/embed/VMdgskFFDqo?rel=1",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    description: "Ufafanuzi wa kina kuhusu malipo na fadhila za kuwakumbuka na kuwahudumia mayatima katika Uislamu."
  },
  {
    id: "othman_1",
    title: "2. Sheikh Othman Maalim - Mawaidha ya Ndoa na Haki",
    type: "sheikh",
    videoUrl: "https://www.youtube.com/embed/2pi48eES_Ag?rel=1",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    description: "Ufafanuzi wa kina kuhusu haki za wanandoa na misingi ya ndoa bora."
  },
  {
    id: "bafana_1",
    title: "3. Sheikh Said Bafana - Umuhimu wa Uchamungu",
    type: "sheikh",
    videoUrl: "https://www.youtube.com/embed/CZ8CF0Yxxfo?rel=1",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    description: "Darsa maalum kuhusu kumcha Allah na kujiepusha na mambo yaliyokatazwa."
  },
  {
    id: "nyundo_1",
    title: "4. Sheikh Sued Nyundo - Sheria za Swala za Faradhi",
    type: "sheikh",
    videoUrl: "https://www.youtube.com/embed/VMdgskFFDqo?rel=1",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    description: "Ufafanuzi wa kina kuhusu usahihi wa swala na nyakati zake."
  },
  {
    id: "sule_1",
    title: "5. Sheikh Suleiman Kheef - Tafsiri ya Aya za Qur'an",
    type: "sheikh",
    videoUrl: "https://www.youtube.com/embed/S0VMmEO-cX0?rel=1",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    description: "Uchambuzi wa maana na mafunzo yaliyomo ndani ya Kitabu Kitukufu."
  },
  {
    id: "mafuta_1",
    title: "6. Sheikh Kassim Mafuta - Tajwidi na Usomaji wa Qur'an",
    type: "sheikh",
    videoUrl: "https://www.youtube.com/embed/u5DAi9PGnq0?rel=1",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    description: "Mafunzo ya tajwidi na misingi ya kusoma kitabu kitukufu kwa ufasaha."
  },
  {
    id: "hemedi_1",
    title: "7. Sheikh Hemedi Suleiman - Kusimama Imara Katika Dini",
    type: "sheikh",
    videoUrl: "https://www.youtube.com/embed/2pi48eES_Ag?rel=1",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    description: "Mawaidha ya kuimarisha imani wakati wa shida na raha."
  },
  {
    id: "farid_1",
    title: "8. Sheikh Farid Hadi - Malezi ya Watoto Kiislamu",
    type: "sheikh",
    videoUrl: "https://www.youtube.com/embed/Qeq0nkShYDk?rel=1",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    description: "Wajibu wa wazazi katika kuwalea watoto wenye maadili na hofu ya Allah."
  },
  {
    id: "amir_1",
    title: "9. Sheikh Juma Amir - Mlango wa Toba na Rehema",
    type: "sheikh",
    videoUrl: "https://www.youtube.com/embed/lS_hxnpNDKQ?rel=1",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    description: "Uhimizo wa kurejea kwa Mwenyezi Mungu na kuomba msamaha."
  },
  {
    id: "kipo_1",
    title: "10. Sheikh Alhaji Kipo - Sheria na Taratibu za Twahara",
    type: "sheikh",
    videoUrl: "https://www.youtube.com/embed/CZ8CF0Yxxfo?rel=1",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    description: "Usahihi wa usafi katika mwili na mavazi kabla ya ibada."
  },
  {
    id: "mazrui_1",
    title: "11. Sheikh Al-Amin Mazrui - Sheria ya Kiislamu na Jamii",
    type: "sheikh",
    videoUrl: "https://www.youtube.com/embed/VMdgskFFDqo?rel=1",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
    description: "Ufafanuzi wa kina kuhusu jinsi Sharia inavyokidhi mahitaji ya maisha ya sasa."
  }
];

function DonorDashboard() {
  const navigate = useNavigate();
  const [currentTheme, setCurrentTheme] = useState(() => localStorage.getItem("app_theme_v3") || "goldEmerald");
  const theme = THEMES[currentTheme] || THEMES.goldEmerald;
  const [activeTab, setActiveTab] = useState("projects");
  const [projectsList, setProjectsList] = useState(DEFAULT_PROJECTS);
  const [totalRaudhwatCash, setTotalRaudhwatCash] = useState(16200000);
  const [donationLogs, setDonationLogs] = useState(INITIAL_DONATION_LOGS);
  const [currentDonorEmail, setCurrentDonorEmail] = useState("rajabubashiri75@gmail.com");
  const [currentDonorName, setCurrentDonorName] = useState("Rajabu Bashiri");
  
  // ADMIN MEDIA STATE
  const [adminMediaList] = useState(() => {
    const saved = localStorage.getItem("raudhwat_admin_media_v3");
    return saved ? JSON.parse(saved) : INITIAL_ADMIN_MEDIA;
  });

  // MEDIA MODE (VIDEO vs AUDIO) FOR EACH SHEIKH
  const [mediaModes, setMediaModes] = useState({});

  // LOCATION & PRAYER TIME STATES
  const [selectedRegion, setSelectedRegion] = useState("Dar es Salaam");
  const [userCoords, setUserCoords] = useState({ lat: -6.7924, lng: 39.2083 });
  const [hijriOffset, setHijriOffset] = useState(0); 
  const adhanAudioRef = useRef(new Audio("https://cdn.islamicfinder.org/adhan/athan.mp3"));
  
  // Dynamic Daily Islamic Content State
  const [dailyContent, setDailyContent] = useState(null);
  
  // PRAYER TRACKER STATE (AUTOMATIC TIME LOGIC)
  const [prayersData, setPrayersData] = useState({
    fajr: { status: false, time: "05:00 AM", rawTime: "05:00" },
    dhuhr: { status: false, time: "01:00 PM", rawTime: "13:00" },
    asr: { status: false, time: "04:15 PM", rawTime: "16:15" },
    maghrib: { status: false, time: "06:45 PM", rawTime: "18:45" },
    isha: { status: false, time: "08:00 PM", rawTime: "20:00" }
  });
  
  const [formattedDates, setFormattedDates] = useState({
    islamicDate: "Inapakia...",
    gregorianDate: new Date().toLocaleDateString("sw-TZ", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  });

  // Modal States
  const [showAddContentModal, setShowAddContentModal] = useState(false);
  const [newContentType, setNewContentType] = useState("hadith");
  const [newContentData, setNewContentData] = useState({ arabic: "", swahili: "", dalili: "" });
  const [addContentMessage, setAddContentMessage] = useState("");
  
  const [showFormModal, setShowFormModal] = useState(false);
  const [step, setStep] = useState(1);
  const [donorName, setDonorName] = useState(currentDonorName);
  const [donorEmail, setDonorEmail] = useState(currentDonorEmail);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("p1");
  const [amount, setAmount] = useState("");
  const [paymentCategory, setPaymentCategory] = useState("mobile");
  const [network, setNetwork] = useState("M-Pesa");
  const [mkobaAccount] = useState("M-KOBA-RAUDHWAT-9082");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStatusText, setPaymentStatusText] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [lastReceipt, setLastReceipt] = useState(null);

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.warn("Geolocation warning: ", err)
      );
    }
  }, []);

  // AUTOMATIC PRAYER TIMES & DATES (ISLAMIC DATE CHANGES AT MAGHRIB, GREGORIAN AT MIDNIGHT)
  useEffect(() => {
    const fetchPrayerTimesAndHijri = async () => {
      try {
        const timestamp = Math.floor(Date.now() / 1000);
        const url = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${userCoords.lat}&longitude=${userCoords.lng}&method=3&adjustment=${hijriOffset}`;
        const res = await axios.get(url);
        if (res.data?.data) {
          const timings = res.data.data.timings;
          const hijri = res.data.data.date.hijri;
          const gregorian = res.data.data.date.gregorian;
          
          setPrayersData({
            fajr: { status: false, time: timings.Fajr, rawTime: timings.Fajr },
            dhuhr: { status: false, time: timings.Dhuhr, rawTime: timings.Dhuhr },
            asr: { status: false, time: timings.Asr, rawTime: timings.Asr },
            maghrib: { status: false, time: timings.Maghrib, rawTime: timings.Maghrib },
            isha: { status: false, time: timings.Isha, rawTime: timings.Isha }
          });

          setFormattedDates({
            islamicDate: `${hijri.day} ${hijri.month.en} ${hijri.year} AH`,
            gregorianDate: `${gregorian.weekday.en}, ${gregorian.day} ${gregorian.month.en} ${gregorian.year}`
          });
        }
      } catch (err) {
        console.warn("Aladhan API fallback active");
      }
    };
    fetchPrayerTimesAndHijri();
  }, [userCoords, hijriOffset]);

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
            swahili: nameData?.en?.meaning || "Mwingi wa Rehema Mwenye Kueneza Rehema zake.",
            dalili: `Jina la ${randomName} katika Asmaul Husna`
          }
        });
      } catch (err) {
        console.warn("Islamic Content API fallback active");
      }
    };
    fetchIslamicContent();
  }, []);

  // REAL-TIME PRAYER STATUS & ADHAN EVALUATION
  const getPrayerStateDetails = (prayerRawTime, prayerStatus) => {
    if (!prayerRawTime) return { canTick: false, isMissed: false, label: "Subiri Muda", icon: "🔒" };
    
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    const [pHours, pMinutes] = prayerRawTime.split(":").map(Number);
    const prayerTotalMinutes = pHours * 60 + pMinutes;
    
    // Swala inakaa wazi kwa saa 2 baada ya kuingia muda wake
    const gracePeriodMinutes = 120; 

    if (currentMinutes < prayerTotalMinutes) {
      return { canTick: false, isMissed: false, label: "Subiri Muda wa Swala", icon: "🔒" };
    } else if (currentMinutes >= prayerTotalMinutes && currentMinutes <= (prayerTotalMinutes + gracePeriodMinutes)) {
      if (prayerStatus) return { canTick: true, isMissed: false, label: "Umeswali", icon: "✔️" };
      return { canTick: true, isMissed: false, label: "Muda wa Swala (Weka Tick)", icon: "⏰" };
    } else {
      if (prayerStatus) return { canTick: true, isMissed: false, label: "Umeswali", icon: "✔️" };
      return { canTick: false, isMissed: true, label: "Hujaswali (Muda umepita)", icon: "❌" };
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;

      Object.keys(prayersData).forEach((pKey) => {
        if (prayersData[pKey].rawTime === currentTimeStr && !prayersData[pKey].status) {
          adhanAudioRef.current.play().catch((e) => console.log("Audio play alert:", e));
          if (Notification.permission === "granted") {
            new Notification(`📢 Muda wa Swala ya ${pKey.toUpperCase()} Umewadia!`, {
              body: `Ni wakati wa kutekeleza Swala kulingana na eneo lako.`,
              icon: "https://cdn-icons-png.flaticon.com/512/2913/2913008.png"
            });
          }
        }
      });
    }, 30000);
    return () => clearInterval(timer);
  }, [prayersData]);

  const handleRegionChange = (region) => {
    setSelectedRegion(region);
    if (REGIONS_COORDINATES[region]) {
      setUserCoords(REGIONS_COORDINATES[region]);
    }
  };

  const handlePrayerToggle = (prayerName) => {
    const prayer = prayersData[prayerName];
    const stateInfo = getPrayerStateDetails(prayer.rawTime, prayer.status);
    if (!stateInfo.canTick) return;

    setPrayersData((prev) => ({
      ...prev,
      [prayerName]: { ...prev[prayerName], status: !prev[prayerName].status }
    }));
  };

  const handleAddDonorContent = async (e) => {
    e.preventDefault();
    if (!newContentData.swahili) {
      alert("Tafadhali ingiza maelezo/tafsiri ya Kiswahili!");
      return;
    }
    setAddContentMessage("Maudhui yako yamepokelewa na yanatumwa kwa Admin!");
    setTimeout(() => {
      setShowAddContentModal(false);
      setAddContentMessage("");
      setNewContentData({ arabic: "", swahili: "", dalili: "" });
    }, 2000);
  };

  const myPersonalLogs = donationLogs.filter(
    (log) => log.email?.toLowerCase() === currentDonorEmail?.toLowerCase() || log.donorName === currentDonorName
  );
  const myTotalDonated = myPersonalLogs.reduce((sum, item) => sum + Number(item.amount), 0);

  const getFaithAssessment = () => {
    if (myTotalDonated >= 100000) {
      return {
        badge: "🌟 MUUMINI MKARIMU SANA (SABIUN BIL-KHAIRAT)",
        color: "#10b981",
        bg: "rgba(16, 185, 129, 0.25)",
        msg: "MashaAllah! Moyo wako wa kutoa katika njia ya Allah na kusaidia Mayatima ni mkubwa sana. Allah akulipe Pepo ya Firdaus!"
      };
    } else if (myTotalDonated > 0) {
      return {
        badge: "🌿 MUUMINI ANAYEJITAHIDI KUTOA (MUKHTASID)",
        color: "#facc15",
        bg: "rgba(250, 204, 21, 0.25)",
        msg: "Alhamdulillah kwa kujitahidi kwako kutoa! Allah anapokea hata mbegu ndogo zaidi. Ongeza juhudi ufikie daraja za juu zaidi."
      };
    } else {
      return {
        badge: "⚠️ TANBIHI NA WITO WA TOBA / KUAMKA IMOYO",
        color: "#ef4444",
        bg: "rgba(239, 68, 68, 0.3)",
        msg: "Astaghfirullah! Bado hujatoa mchango wowote kwenye mfuko huu. Kumbuka Mtume (S.A.W) amesema Sadaka haipunguzi mali! Toa kidogo uweke akiba ya Akhera."
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
      if (!donorName.trim()) { alert("Tafadhali ingiza jina lako kamili!"); return; }
      if (!phoneNumber || phoneNumber.length < 10) { alert("Tafadhali ingiza namba sahihi ya simu!"); return; }
      setStep(2);
    } else if (step === 2) {
      if (!amount || Number(amount) <= 0) { alert("Tafadhali ingiza kiasi halali cha mchango!"); return; }
      setStep(3);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setPaymentStatusText("📲 Inatuma ombi la malipo AzamPay... Angalia simu yako iweke PIN.");
    try {
      setTimeout(() => {
        const donatedVal = Number(amount);
        const targetProj = projectsList.find((p) => p.id === selectedProjectId);
        const referenceId = "AZMPAY-" + Math.floor(100000 + Math.random() * 900000);
        
        setTotalRaudhwatCash((prev) => prev + donatedVal);
        setProjectsList((prev) => prev.map((p) => p.id === selectedProjectId ? { ...p, kiasiKilichopatikana: p.kiasiKilichopatikana + donatedVal } : p));
        
        const newLog = {
          id: referenceId,
          donorName: donorName || currentDonorName,
          email: donorEmail || currentDonorEmail,
          project: targetProj ? targetProj.kichwa : "Mchango wa Raudhwat",
          amount: donatedVal,
          network: paymentCategory === "mobile" ? network : "Card Payment",
          date: new Date().toLocaleDateString("sw-TZ") + " " + new Date().toLocaleTimeString("sw-TZ"),
          status: "Imethibitishwa (Webhook)"
        };
        setDonationLogs((prev) => [newLog, ...prev]);
        setLastReceipt({
          receiptNo: referenceId,
          donorName: donorName || currentDonorName,
          projectName: targetProj ? targetProj.kichwa : "Mchango wa Raudhwat",
          amount: donatedVal,
          network: paymentCategory === "mobile" ? network : "Card Payment",
          phone: phoneNumber,
          account: mkobaAccount,
          date: new Date().toLocaleDateString("sw-TZ"),
          time: new Date().toLocaleTimeString("sw-TZ")
        });
        setIsSubmitting(false);
        setPaymentSuccess(true);
      }, 4000);
    } catch (error) {
      console.error("AzamPay Error:", error);
      setPaymentStatusText("❌ Imeshindikana kuunganisha na AzamPay. Jaribu tena.");
      setIsSubmitting(false);
    }
  };

  const handleDownloadReceipt = () => {
    if (!lastReceipt) return;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Risiti ya Mchango - ${lastReceipt.receiptNo}</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #1e293b; background: #f8fafc; }
            .receipt-card { max-width: 650px; margin: 0 auto; background: #ffffff; border: 3px solid #064e3b; border-radius: 20px; padding: 40px; box-shadow: 0 15px 35px rgba(0,0,0,0.15); }
            .header { text-align: center; border-bottom: 3px solid #facc15; padding-bottom: 20px; margin-bottom: 25px; }
            .bismillah { font-size: 22px; color: #064e3b; font-weight: bold; }
            .title { font-size: 26px; color: #064e3b; margin: 8px 0; font-weight: 900; }
            .subtitle { font-size: 14px; color: #059669; margin: 0; font-weight: bold; }
            .row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px dashed #cbd5e1; font-size: 15px; }
            .total-box { background: #ecfdf5; border: 2px solid #10b981; border-radius: 12px; padding: 20px; text-align: center; margin-top: 25px; }
            .total-amount { font-size: 30px; font-weight: 900; color: #064e3b; margin: 8px 0 0 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 13px; color: #475569; font-style: italic; }
          </style>
        </head>
        <body>
          <div class="receipt-card">
            <div class="header">
              <div class="bismillah">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</div>
              <div class="title">RAUDHWAT AL-ATFAL ISLAMIC PLATFORM</div>
              <div class="subtitle">Official Donation Receipt / Risiti Rasmi ya Mchango</div>
            </div>
            <div class="row"><span><strong>Namba ya Risiti:</strong></span> <span>${lastReceipt.receiptNo}</span></div>
            <div class="row"><span><strong>Jina la Mchangiaji:</strong></span> <span>${lastReceipt.donorName}</span></div>
            <div class="row"><span><strong>Namba ya Simu:</strong></span> <span>${lastReceipt.phone}</span></div>
            <div class="row"><span><strong>Mradi Uliochangia:</strong></span> <span>${lastReceipt.projectName}</span></div>
            <div class="row"><span><strong>Njia ya Malipo:</strong></span> <span>${lastReceipt.network} (AzamPay Live)</span></div>
            <div class="row"><span><strong>Akaunti ya Kupokelea:</strong></span> <span>${lastReceipt.account}</span></div>
            <div class="row"><span><strong>Tarehe & Muda:</strong></span> <span>${lastReceipt.date} - ${lastReceipt.time}</span></div>
            
            <div class="total-box">
              <span style="font-size: 13px; font-weight: bold; color: #047857;">KIASI KILICHOTOLEWA:</span>
              <div class="total-amount">TZS ${lastReceipt.amount.toLocaleString()}</div>
            </div>
            <div class="footer">
              <p style="margin: 6px 0; font-weight: bold; color: #064e3b;">🤲 Jazakallahu Khayran! Shukrani na Du'a kutoka Raudhwat Al-Atfal.</p>
              <p style="margin: 0;">Barua Pepe: info@raudhwat.org | Simu: +255 700 000 000</p>
            </div>
          </div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const closeAndResetModal = () => {
    setShowFormModal(false);
    setStep(1);
    setAmount("");
    setPaymentSuccess(false);
    setPaymentStatusText("");
  };

  return (
    <div style={{ ...styles.pageWrapper, background: theme.pageBg, color: theme.textColor }}>
      <div style={styles.container}>
        
        {/* TOP BAR & THEME SELECTOR */}
        <div style={{ ...styles.topBar, border: theme.cardBorder }}>
          <div style={styles.themeBtnGroup}>
            <span style={{ fontSize: "13px", fontWeight: "900", color: "#facc15" }}>🎨 MANDHARI:</span>
            {Object.keys(THEMES).map((key) => (
              <button
                key={key}
                onClick={() => { setCurrentTheme(key); localStorage.setItem("app_theme_v3", key); }}
                style={{
                  ...styles.themeBtn,
                  backgroundColor: currentTheme === key ? theme.accentColor : "rgba(255,255,255,0.15)",
                  border: currentTheme === key ? `2px solid #ffffff` : "1px solid rgba(255,255,255,0.3)",
                  color: currentTheme === key ? "#000" : "#fff",
                }}
              >
                {THEMES[key].name}
              </button>
            ))}
          </div>
          <button onClick={() => navigate("/login")} style={styles.logoutBtn}>🚪 Ondoka</button>
        </div>

        {/* HEADER SECTION */}
        <header style={styles.header}>
          <p style={{ ...styles.bismillah, color: theme.bismillahColor }}>بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</p>
          <h1 style={{ ...styles.title, color: theme.titleColor }}>RAUDHWAT AL-ATFAL</h1>
          <p style={{ ...styles.subtitle, color: theme.subtitleColor }}>Mfumo Rasmi wa Mchango wa Sadaka na Miradi ya Kiislamu</p>
          
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", marginTop: "14px", flexWrap: "wrap" }}>
            <label style={{ fontSize: "13px", fontWeight: "900", color: "#facc15" }}>📍 MKOA WAKO:</label>
            <select
              value={selectedRegion}
              onChange={(e) => handleRegionChange(e.target.value)}
              style={{ padding: "6px 12px", borderRadius: "8px", backgroundColor: theme.inputBg, color: "#fff", border: "2px solid #facc15", fontWeight: "bold" }}
            >
              {Object.keys(REGIONS_COORDINATES).map((reg) => (
                <option key={reg} value={reg} style={{ background: "#0f172a" }}>{reg}</option>
              ))}
            </select>
            <label style={{ fontSize: "13px", fontWeight: "900", color: "#facc15", marginLeft: "10px" }}>🌙 MWEZI:</label>
            <button onClick={() => setHijriOffset(prev => prev - 1)} style={styles.offsetBtn}>-1</button>
            <span style={{ fontSize: "14px", fontWeight: "900", color: "#fff" }}>{hijriOffset}</span>
            <button onClick={() => setHijriOffset(prev => prev + 1)} style={styles.offsetBtn}>+1</button>
          </div>

          <div style={styles.dateHeaderContainer}>
            <span style={styles.dateBadgeLabel}>📅 TAREHE YA LEO:</span>
            <span style={styles.dateTextArabic}>{formattedDates.islamicDate}</span>
            <span style={{ color: "#facc15" }}>|</span>
            <span style={styles.dateTextSwahili}>{formattedDates.gregorianDate}</span>
          </div>
          <div style={{ ...styles.goldDivider, background: theme.dividerColor }}></div>
        </header>

        {/* PRAYER TRACKER SECTION (AUTOMATIC CONSTANT DYNAMIC STATE) */}
        <div style={{ ...styles.prayerTrackerBox, backgroundColor: "rgba(0,0,0,0.75)", border: theme.cardBorder }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "16px" }}>
            <h3 style={{ margin: 0, color: "#facc15", fontSize: "18px", fontWeight: "900", display: "flex", alignItems: "baseline", gap: "8px" }}>
              <span>🕌</span> TRACKER YA SWALA 5 ZA LEO ({selectedRegion.toUpperCase()})
            </h3>
            <span style={{ fontSize: "13px", color: "#6ee7b7", fontWeight: "800" }}>
              Inabadilika moja kwa moja kulingana na muda sahihi wa eneo lako!
            </span>
          </div>
          <div style={styles.prayerGrid}>
            {Object.keys(prayersData).map((pKey) => {
              const prayer = prayersData[pKey];
              const stateInfo = getPrayerStateDetails(prayer.rawTime, prayer.status);
              return (
                <div key={pKey} style={styles.prayerCircleCard}>
                  <span style={styles.prayerNameText}>{pKey.toUpperCase()}</span>
                  <span style={styles.prayerTimeText}>{prayer.time}</span>
                  <button
                    onClick={() => handlePrayerToggle(pKey)}
                    disabled={!stateInfo.canTick}
                    style={{
                      ...styles.circleBtn,
                      backgroundColor: prayer.status ? "#10b981" : (stateInfo.isMissed ? "#ef4444" : "rgba(255,255,255,0.15)"),
                      borderColor: prayer.status ? "#34d399" : (stateInfo.isMissed ? "#f87171" : "rgba(255,255,255,0.4)"),
                      cursor: stateInfo.canTick ? "pointer" : "not-allowed",
                    }}
                  >
                    {prayer.status ? "✔️" : stateInfo.icon}
                  </button>
                  <span style={{ fontSize: "11px", marginTop: "6px", fontWeight: "bold", textAlign: "center", color: prayer.status ? "#34d399" : (stateInfo.isMissed ? "#ef4444" : "#cbd5e1") }}>
                    {prayer.status ? "Umeswali" : stateInfo.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* SEHEMU YA 1: LIVE ISLAMIC TV CHANNELS (ULTRA HD & MWONEKANO WA JUU) */}
        <div style={{ ...styles.quotesWrapper, backgroundColor: "rgba(0,0,0,0.85)", border: theme.cardBorder, marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "18px" }}>
            <h3 style={{ margin: 0, color: "#facc15", fontSize: "19px", fontWeight: "900", display: "flex", alignItems: "center", gap: "8px" }}>
              📡 LIVE CHANNELS ZA KISLAMU (ULTRA HD & High Quality)
            </h3>
            <span style={{ fontSize: "13px", color: "#34d399", fontWeight: "800", background: "rgba(16,185,129,0.2)", padding: "4px 10px", borderRadius: "8px", border: "1px solid #10b981" }}>
              Ubora wa Juu Kuliko Zote Duniani
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "20px" }}>
            {adminMediaList.filter(m => m.type === "iframe").map((tv) => (
              <div key={tv.id} style={{ ...styles.quoteCard, backgroundColor: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(250,204,21,0.4)" }}>
                <span style={styles.quoteBadge}>📺 ULTRA HD LIVE STREAM</span>
                <h4 style={{ margin: "4px 0 6px 0", color: "#ffffff", fontSize: "16px", fontWeight: "900" }}>{tv.title}</h4>
                <p style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#cbd5e1", lineHeight: "1.5" }}>{tv.description}</p>
                <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", borderRadius: "12px", overflow: "hidden", backgroundColor: "#000" }}>
                  <iframe
                    src={tv.url}
                    title={tv.title}
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SEHEMU YA 2: MASHEHE WOTE WA YOUTUBE (VIDEO & AUDIO OPTIONS) */}
        <div style={{ ...styles.quotesWrapper, backgroundColor: "rgba(0,0,0,0.8)", border: theme.cardBorder, marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "18px" }}>
            <h3 style={{ margin: 0, color: "#facc15", fontSize: "19px", fontWeight: "900", display: "flex", alignItems: "center", gap: "8px" }}>
              🎙️ MASHEHE WA YOUTUBE (Chagua Video au Kusikiliza Audio)
            </h3>
            <span style={{ fontSize: "13px", color: "#38bdf8", fontWeight: "800", background: "rgba(56,189,248,0.2)", padding: "4px 10px", borderRadius: "8px", border: "1px solid #38bdf8" }}>
              11 Masheikh Wakubwa
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
            {adminMediaList.filter(m => m.type === "sheikh").map((sheikh) => {
              const currentMode = mediaModes[sheikh.id] || "video"; // Default is video
              return (
                <div key={sheikh.id} style={{ ...styles.quoteCard, backgroundColor: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(250,204,21,0.3)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={styles.quoteBadge}> Sheikh Mkubwa</span>
                    {/* TOGGLE VIDEO / AUDIO BUTTONS */}
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        onClick={() => setMediaModes(prev => ({ ...prev, [sheikh.id]: "video" }))}
                        style={{
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: "bold",
                          cursor: "pointer",
                          backgroundColor: currentMode === "video" ? "#facc15" : "rgba(255,255,255,0.2)",
                          color: currentMode === "video" ? "#000" : "#fff",
                          border: "none"
                        }}
                      >
                        🎥 Video
                      </button>
                      <button
                        onClick={() => setMediaModes(prev => ({ ...prev, [sheikh.id]: "audio" }))}
                        style={{
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: "bold",
                          cursor: "pointer",
                          backgroundColor: currentMode === "audio" ? "#38bdf8" : "rgba(255,255,255,0.2)",
                          color: currentMode === "audio" ? "#000" : "#fff",
                          border: "none"
                        }}
                      >
                        🎧 Audio
                      </button>
                    </div>
                  </div>

                  <h4 style={{ margin: "4px 0 6px 0", color: "#ffffff", fontSize: "15px", fontWeight: "900" }}>{sheikh.title}</h4>
                  <p style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#cbd5e1", lineHeight: "1.5" }}>{sheikh.description}</p>
                  
                  {/* PLAYER CONTAINER */}
                  <div style={{ width: "100%", marginTop: "auto" }}>
                    {currentMode === "video" ? (
                      <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", borderRadius: "10px", overflow: "hidden", backgroundColor: "#000" }}>
                        <iframe
                          src={sheikh.videoUrl}
                          title={sheikh.title}
                          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div style={{ padding: "14px", backgroundColor: "rgba(0,0,0,0.5)", borderRadius: "10px", border: "1px solid rgba(56,189,248,0.4)", textAlign: "center" }}>
                        <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#38bdf8", fontWeight: "bold" }}>🎵 Sikiliza Audio Pekee</p>
                        <audio controls style={{ width: "100%" }} src={sheikh.audioUrl}>
                          Kivinjari chako hakitumii kipengele cha Audio.
                        </audio>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DAILY ISLAMIC CONTENT SECTION */}
        <div style={{ ...styles.quotesWrapper, backgroundColor: "rgba(0,0,0,0.7)", border: theme.cardBorder }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "16px" }}>
            <h3 style={{ margin: 0, color: "#facc15", fontSize: "18px", fontWeight: "900" }}>
              📖 MAUDHUI YA LEO (HADITH, AYA, DUA NA ASMAUL HUSNA)
            </h3>
            <button
              onClick={() => setShowAddContentModal(true)}
              style={{ ...styles.addContentBtn, backgroundColor: theme.accentColor, color: "#000" }}
            >
              ➕ Ongeza Maudhui
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "18px" }}>
            <div style={styles.quoteCard}>
              <span style={styles.quoteBadge}>📖 AYA YA QUR'AN</span>
              <p style={styles.arabicText}>{dailyContent?.quranVerse?.arabic}</p>
              <p style={styles.swahiliQuote}>“{dailyContent?.quranVerse?.swahili}”</p>
              <p style={styles.daliliText}>📌 {dailyContent?.quranVerse?.dalili}</p>
            </div>
            <div style={styles.quoteCard}>
              <span style={styles.quoteBadge}>✨ HADITH YA MTUME (S.A.W)</span>
              <p style={styles.arabicText}>{dailyContent?.hadith?.arabic}</p>
              <p style={styles.swahiliQuote}>“{dailyContent?.hadith?.swahili}”</p>
              <p style={styles.daliliText}>📌 {dailyContent?.hadith?.dalili}</p>
            </div>
            <div style={styles.quoteCard}>
              <span style={styles.quoteBadge}>🤲 DUA YA LEO</span>
              <p style={styles.arabicText}>{dailyContent?.dua?.arabic}</p>
              <p style={styles.swahiliQuote}>“{dailyContent?.dua?.swahili}”</p>
              <p style={styles.daliliText}>📌 {dailyContent?.dua?.dalili}</p>
            </div>
            <div style={styles.quoteCard}>
              <span style={styles.quoteBadge}>🌟 ASMA-UL-HUSNA</span>
              <p style={{ ...styles.arabicText, fontSize: "26px", color: "#facc15" }}>
                {dailyContent?.allahName?.arabic} ({dailyContent?.allahName?.transliteration})
              </p>
              <p style={styles.swahiliQuote}><strong>Maana:</strong> {dailyContent?.allahName?.swahili}</p>
              <p style={styles.daliliText}>📌 {dailyContent?.allahName?.dalili}</p>
            </div>
          </div>
        </div>

        {/* FAITH ASSESSMENT SECTION */}
        <div style={{ ...styles.faithBox, backgroundColor: faithAssessment.bg, border: `2.5px solid ${faithAssessment.color}` }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: "13px", fontWeight: "900", color: faithAssessment.color, textTransform: "uppercase", letterSpacing: "1px" }}>
              {faithAssessment.badge}
            </span>
            <h3 style={{ margin: "8px 0 6px 0", fontSize: "22px", fontWeight: "900", color: "#ffffff" }}>
              Ndugu: {currentDonorName}
            </h3>
            <p style={{ margin: 0, fontSize: "15px", lineHeight: "1.6", color: "#f1f5f9", fontWeight: "600" }}>
              {faithAssessment.msg}
            </p>
          </div>
          <div style={{ textAlign: "right", minWidth: "200px" }}>
            <span style={{ display: "block", fontSize: "12px", color: "#cbd5e1", fontWeight: "900" }}>JUMLA ULIYOTOA HADI SASA:</span>
            <strong style={{ fontSize: "26px", color: "#facc15", fontWeight: "900", textShadow: "0 2px 6px rgba(0,0,0,0.5)" }}>TZS {myTotalDonated.toLocaleString()}</strong>
            <span style={{ display: "block", fontSize: "13px", color: "#34d399", fontWeight: "800", marginTop: "4px" }}>
              Michango Yako: {myPersonalLogs.length}
            </span>
          </div>
        </div>

        {/* TABS SWITCHER */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginBottom: "22px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("projects")}
            style={{
              padding: "14px 24px",
              borderRadius: "14px",
              border: activeTab === "projects" ? `2.5px solid ${theme.accentColor}` : "1px solid rgba(255,255,255,0.3)",
              backgroundColor: activeTab === "projects" ? theme.accentColor : "rgba(0,0,0,0.5)",
              color: activeTab === "projects" ? "#000" : "#fff",
              fontWeight: "900",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            📊 Miradi & Progress Bars
          </button>
          <button
            onClick={() => setActiveTab("myHistory")}
            style={{
              padding: "14px 24px",
              borderRadius: "14px",
              border: activeTab === "myHistory" ? `2.5px solid ${theme.accentColor}` : "1px solid rgba(255,255,255,0.3)",
              backgroundColor: activeTab === "myHistory" ? theme.accentColor : "rgba(0,0,0,0.5)",
              color: activeTab === "myHistory" ? "#000" : "#fff",
              fontWeight: "900",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            📜 Historia Yangu ({myPersonalLogs.length})
          </button>
        </div>

        {/* TOTAL CASH CARD */}
        <div style={styles.cashHeaderCard}>
          <div>
            <p style={{ margin: 0, fontSize: "13px", fontWeight: "900", color: "#facc15", textTransform: "uppercase", letterSpacing: "1px" }}>
              💵 JUMLA YA FEDHA TASLIMU ZA RAUDHWAT AL-ATFAL
            </p>
            <h2 style={{ margin: "8px 0 0 0", fontSize: "40px", fontWeight: "900", color: "#ffffff", textShadow: "0 3px 12px rgba(0,0,0,0.7)" }}>
              TZS {totalRaudhwatCash.toLocaleString()}
            </h2>
          </div>
          <div style={{ fontSize: "50px" }}>🤲</div>
        </div>

        {/* TAB 1: PROJECTS & PROGRESS BARS */}
        {activeTab === "projects" && (
          <div style={{ ...styles.card, background: theme.cardBg, border: theme.cardBorder, marginBottom: "24px" }}>
            <div style={styles.cardHeader}>
              <span style={{ fontSize: "32px" }}>📊</span>
              <div>
                <h2 style={{ ...styles.cardTitle, color: theme.titleColor, fontSize: "22px" }}>Hali ya Michango na Progress Bars za Miradi</h2>
                <p style={{ margin: 0, fontSize: "14px", color: theme.subtitleColor, fontWeight: "700" }}>
                  Fedha taslimu na asilimia za maendeleo ya kila mradi
                </p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "22px", marginTop: "24px" }}>
              {projectsList.map((p) => {
                const percentage = Math.min(Math.round((p.kiasiKilichopatikana / p.lengoLaMchango) * 100), 100);
                const barColor = getProgressBarColor(percentage);
                return (
                  <div key={p.id} style={{ ...styles.projectCardBox, backgroundColor: "rgba(0,0,0,0.5)", border: "2px solid rgba(255,255,255,0.2)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "900", color: "#ffffff" }}>{p.kichwa}</h3>
                      <span style={{ fontSize: "20px", fontWeight: "900", color: barColor, textShadow: "0 2px 6px rgba(0,0,0,0.9)" }}>{percentage}%</span>
                    </div>
                    <div style={styles.progressTrack}>
                      <div style={{ ...styles.progressBarFill, width: `${percentage}%`, backgroundColor: barColor }} />
                    </div>
                    <div style={styles.projectFooter}>
                      <div>
                        <span style={{ display: "block", fontSize: "12px", color: "#cbd5e1", fontWeight: "900" }}>IMEOPATIKANA:</span>
                        <strong style={{ fontSize: "16px", color: "#34d399", fontWeight: "900" }}>TZS {p.kiasiKilichopatikana.toLocaleString()}</strong>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ display: "block", fontSize: "12px", color: "#cbd5e1", fontWeight: "900" }}>LENGO:</span>
                        <span style={{ fontSize: "15px", color: "#facc15", fontWeight: "900" }}>TZS {p.lengoLaMchango.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ textAlign: "center", marginTop: "35px" }}>
              <button
                onClick={() => setShowFormModal(true)}
                style={{ ...styles.donateMainBtn, backgroundColor: theme.accentColor, color: "#000" }}
              >
                ❤️ TOA MCHANGO SASA (DONATE)
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: MY HISTORY */}
        {activeTab === "myHistory" && (
          <div style={{ ...styles.card, background: theme.cardBg, border: theme.cardBorder, marginBottom: "24px" }}>
            <div style={styles.cardHeader}>
              <span style={{ fontSize: "32px" }}>📜</span>
              <div>
                <h2 style={{ ...styles.cardTitle, color: theme.titleColor, fontSize: "22px" }}>Historia Yangu ya Michango</h2>
                <p style={{ margin: 0, fontSize: "14px", color: theme.subtitleColor, fontWeight: "700" }}>Kumbukumbu ya michango yote uliyotoa kupitia akaunti yako</p>
              </div>
            </div>
            {myPersonalLogs.length > 0 ? (
              <div style={{ overflowX: "auto", marginTop: "22px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "2.5px solid #facc15", color: "#facc15", fontSize: "14px" }}>
                      <th style={{ padding: "16px" }}>TX ID</th>
                      <th style={{ padding: "16px" }}>MRADI</th>
                      <th style={{ padding: "16px" }}>KIASI</th>
                      <th style={{ padding: "16px" }}>MTANDAO</th>
                      <th style={{ padding: "16px" }}>TAREHE & MUDA</th>
                      <th style={{ padding: "16px" }}>RISITI</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: "15px" }}>
                    {myPersonalLogs.map((log) => (
                      <tr key={log.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.15)", background: "rgba(0,0,0,0.25)" }}>
                        <td style={{ padding: "16px", fontWeight: "900", color: "#38bdf8" }}>{log.id}</td>
                        <td style={{ padding: "16px", fontWeight: "900", color: "#ffffff" }}>{log.project}</td>
                        <td style={{ padding: "16px", fontWeight: "900", color: "#34d399", fontSize: "16px" }}>TZS {log.amount.toLocaleString()}</td>
                        <td style={{ padding: "16px", color: "#e2e8f0", fontWeight: "bold" }}>{log.network}</td>
                        <td style={{ padding: "16px", color: "#cbd5e1", fontSize: "13px" }}>{log.date}</td>
                        <td style={{ padding: "16px" }}>
                          <button
                            onClick={() => {
                              setLastReceipt({
                                receiptNo: log.id,
                                donorName: log.donorName,
                                projectName: log.project,
                                amount: log.amount,
                                network: log.network,
                                phone: phoneNumber || "07XXXXXXXX",
                                account: mkobaAccount,
                                date: log.date,
                                time: "Kamilifu"
                              });
                              handleDownloadReceipt();
                            }}
                            style={{ backgroundColor: theme.accentColor, color: "#000", border: "none", padding: "8px 14px", borderRadius: "8px", fontWeight: "900", fontSize: "13px", cursor: "pointer" }}
                          >
                            📄 Risiti
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "35px 0" }}>
                <p style={{ fontSize: "17px", color: "#ef4444", fontWeight: "900" }}>⚠️ Bado hujafanya mchango wowote katika akaunti hii!</p>
                <button
                  onClick={() => setShowFormModal(true)}
                  style={{ ...styles.donateMainBtn, backgroundColor: theme.accentColor, color: "#000", marginTop: "15px" }}
                >
                  ❤️ Anza Kutoa Mchango Wako wa Kwanza
                </button>
              </div>
            )}
          </div>
        )}

        {/* MODAL 1: ADD CONTENT */}
        {showAddContentModal && (
          <div style={styles.modalOverlay}>
            <div style={{ ...styles.modalContent, background: theme.cardBg, border: theme.cardBorder }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                <h3 style={{ margin: 0, color: theme.titleColor, fontSize: "20px", fontWeight: "900" }}>
                  ✍️ Ongeza Maudhui ya Kiislamu
                </h3>
                <button onClick={() => setShowAddContentModal(false)} style={styles.closeBtn}>✖</button>
              </div>
              {addContentMessage ? (
                <div style={{ padding: "20px", borderRadius: "12px", background: "rgba(34,197,94,0.25)", border: "2px solid #22c55e", textAlign: "center" }}>
                  <p style={{ margin: 0, color: "#34d399", fontWeight: "bold", fontSize: "16px" }}>{addContentMessage}</p>
                </div>
              ) : (
                <form onSubmit={handleAddDonorContent} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Aina ya Maudhui</label>
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
                    <label style={styles.label}>Kiarabu (Kama kipo)</label>
                    <input
                      type="text"
                      placeholder="Mfano: َّإِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ"
                      value={newContentData.arabic}
                      onChange={(e) => setNewContentData({ ...newContentData, arabic: e.target.value })}
                      style={{ ...styles.input, backgroundColor: theme.inputBg, color: theme.textColor, fontFamily: "'Amiri', serif" }}
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Tafsiri ya Kiswahili *</label>
                    <textarea
                      rows="3"
                      placeholder="Andika maelezo au tafsiri..."
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
                  <button type="submit" style={{ ...styles.actionBtn, backgroundColor: theme.accentColor, color: "#000", marginTop: "12px" }}>
                    🚀 Tuma Kwa Admin Ithibitishwe
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* MODAL 2: DONATION WIZARD (LIVE AZAMPAY) */}
        {showFormModal && (
          <div style={styles.modalOverlay}>
            <div style={{ ...styles.modalContent, background: theme.cardBg, border: theme.cardBorder }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                <h3 style={{ margin: 0, color: theme.titleColor, fontSize: "20px", fontWeight: "900" }}>
                  {paymentSuccess ? "✅ Mchango Umekamilika" : `Form ya Mchango - Hatua ya ${step} kati ya 3`}
                </h3>
                <button onClick={closeAndResetModal} style={styles.closeBtn}>✖</button>
              </div>
              {!paymentSuccess ? (
                <form style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {step === 1 && (
                    <>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Jina Lako Kamili *</label>
                        <input
                          type="text"
                          placeholder="Mfano: Sheikh Abdallah"
                          value={donorName}
                          onChange={(e) => setDonorName(e.target.value)}
                          style={{ ...styles.input, backgroundColor: theme.inputBg, color: theme.textColor }}
                        />
                      </div>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Namba ya Simu ya Kupokea USSD Push *</label>
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
                      <div style={{ display: "flex", gap: "12px" }}>
                        <button type="button" onClick={() => setStep(1)} style={styles.backBtn}>⬅️ Nyuma</button>
                        <button type="button" onClick={handleNextStep} style={{ ...styles.actionBtn, backgroundColor: theme.accentColor, color: "#000" }}>
                          Endelea Malipo ➡️
                        </button>
                      </div>
                    </>
                  )}
                  {step === 3 && (
                    <>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Njia ya Malipo (AzamPay Gateway)</label>
                        <select
                          value={paymentCategory}
                          onChange={(e) => setPaymentCategory(e.target.value)}
                          style={{ ...styles.input, backgroundColor: theme.inputBg, color: theme.textColor }}
                        >
                          <option value="mobile" style={{ background: "#0f172a", color: "#fff" }}>Mobile Money (M-Pesa, TigoPesa, AirtelMoney)</option>
                          <option value="card" style={{ background: "#0f172a", color: "#fff" }}>Visa / Mastercard</option>
                        </select>
                      </div>
                      {paymentCategory === "mobile" && (
                        <div style={styles.inputGroup}>
                          <label style={styles.label}>Chagua Mtandao</label>
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
                      <div style={{ padding: "14px", borderRadius: "12px", background: "rgba(0,0,0,0.6)", border: "1.5px solid rgba(255,255,255,0.25)" }}>
                        <p style={{ margin: 0, fontSize: "12px", color: "#cbd5e1", fontWeight: "bold" }}>Akaunti ya Raudhwat (AzamPay M-Koba):</p>
                        <p style={{ margin: "4px 0 0 0", fontSize: "17px", fontWeight: "900", color: "#facc15" }}>{mkobaAccount}</p>
                      </div>
                      <div style={{ padding: "14px", borderRadius: "10px", background: "rgba(245, 158, 11, 0.2)", border: "1.5px solid #f59e0b" }}>
                        <p style={{ margin: 0, fontSize: "13px", color: "#fde047", fontWeight: "bold", lineHeight: "1.5" }}>
                          ℹ️ Ukibonyeza "Wasilisha Malipo", AzamPay itatuma USSD Push moja kwa moja kwenye simu yako (<strong style={{ color: "#fff" }}>{phoneNumber || "07XXXXXXXX"}</strong>). Weka namba yako ya siri (PIN) kwenye simu yako kukamilisha.
                        </p>
                      </div>
                      {paymentStatusText && (
                        <div style={{ padding: "12px", borderRadius: "10px", background: "rgba(250, 204, 21, 0.25)", border: "1.5px solid #facc15", textAlign: "center" }}>
                          <p style={{ margin: 0, fontSize: "13px", color: "#facc15", fontWeight: "bold" }}>{paymentStatusText}</p>
                        </div>
                      )}
                      <div style={{ display: "flex", gap: "12px" }}>
                        <button type="button" onClick={() => setStep(2)} style={styles.backBtn} disabled={isSubmitting}>⬅️ Nyuma</button>
                        <button
                          type="button"
                          onClick={handleFinalSubmit}
                          disabled={isSubmitting}
                          style={{ ...styles.actionBtn, backgroundColor: "#22c55e", color: "#fff" }}
                        >
                          {isSubmitting ? "Inasubiri Webhook..." : "Wasilisha Malipo 🤝"}
                        </button>
                      </div>
                    </>
                  )}
                </form>
              ) : (
                <div style={{ textAlign: "center", padding: "15px 0" }}>
                  <span style={{ fontSize: "60px" }}>🤲✨</span>
                  <h3 style={{ color: "#22c55e", margin: "12px 0 6px 0", fontSize: "22px", fontWeight: "900" }}>Jazakallahu Khayran, {lastReceipt?.donorName}!</h3>
                  <p style={{ fontSize: "15px", lineHeight: "1.6", color: "#ffffff", fontWeight: "600" }}>
                    Mchango wako wa <strong style={{ color: "#facc15" }}>TZS {lastReceipt?.amount.toLocaleString()}</strong> umethibitishwa rasmi na Webhook ya AzamPay kwenye <strong>{lastReceipt?.projectName}</strong>.
                  </p>
                  <div style={{ padding: "14px", borderRadius: "12px", background: "rgba(34, 197, 94, 0.2)", border: "1.5px solid #22c55e", margin: "16px 0" }}>
                    <p style={{ margin: 0, fontSize: "13px", color: "#34d399", fontWeight: "700" }}>
                      📲 Ujumbe wa shukrani umetumwa kwenye simu ({phoneNumber}) na risiti imetengenezwa.
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadReceipt}
                    style={{ ...styles.actionBtn, backgroundColor: theme.accentColor, color: "#000", marginTop: "12px" }}
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

// STYLES (ENHANCED FOR LARGE, GLOWING & PROFESSIONAL FONTS)
const styles = {
  pageWrapper: { minHeight: "100vh", padding: "30px 20px", fontFamily: "'Inter', sans-serif" },
  container: { maxWidth: "1200px", margin: "0 auto" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 22px", borderRadius: "18px", backgroundColor: "rgba(0,0,0,0.6)", marginBottom: "24px", flexWrap: "wrap", gap: "12px" },
  themeBtnGroup: { display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" },
  themeBtn: { padding: "8px 14px", borderRadius: "10px", fontSize: "12px", fontWeight: "900", cursor: "pointer", transition: "all 0.2s" },
  logoutBtn: { backgroundColor: "rgba(239, 68, 68, 0.3)", color: "#ef4444", border: "2px solid #ef4444", padding: "8px 18px", borderRadius: "12px", fontSize: "13px", fontWeight: "900", cursor: "pointer" },
  header: { textAlign: "center", marginBottom: "24px" },
  bismillah: { fontSize: "28px", margin: "0 0 8px 0", fontWeight: "bold", fontFamily: "'Amiri', serif", textShadow: "0 2px 8px rgba(0,0,0,0.5)" },
  title: { fontSize: "36px", fontWeight: "900", margin: 0, letterSpacing: "1.5px", textShadow: "0 3px 10px rgba(0,0,0,0.6)" },
  subtitle: { fontSize: "15px", margin: "6px 0 0 0", fontWeight: "700" },
  offsetBtn: { padding: "4px 10px", borderRadius: "6px", backgroundColor: "rgba(255,255,255,0.2)", color: "#fff", border: "1px solid rgba(255,255,255,0.4)", fontWeight: "bold", cursor: "pointer" },
  dateHeaderContainer: { display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", margin: "14px 0 6px 0", flexWrap: "wrap", fontSize: "14px", fontWeight: "900" },
  dateBadgeLabel: { backgroundColor: "rgba(250, 204, 21, 0.25)", color: "#facc15", padding: "6px 12px", borderRadius: "10px", border: "1.5px solid rgba(250, 204, 21, 0.5)" },
  dateTextArabic: { color: "#34d399", fontFamily: "'Amiri', serif", fontSize: "17px" },
  dateTextSwahili: { color: "#ffffff" },
  goldDivider: { height: "4px", width: "130px", margin: "14px auto 0 auto", borderRadius: "3px" },
  prayerTrackerBox: { padding: "22px 24px", borderRadius: "22px", marginBottom: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.4)" },
  prayerGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "14px", marginTop: "12px" },
  prayerCircleCard: { backgroundColor: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.18)", borderRadius: "18px", padding: "14px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
  prayerNameText: { fontSize: "14px", fontWeight: "900", color: "#facc15" },
  prayerTimeText: { fontSize: "12px", color: "#cbd5e1", marginBottom: "10px", fontWeight: "bold" },
  circleBtn: { width: "48px", height: "48px", borderRadius: "50%", border: "2.5px solid", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", outline: "none", transition: "transform 0.2s" },
  quotesWrapper: { padding: "24px", borderRadius: "22px", marginBottom: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.4)" },
  addContentBtn: { border: "none", padding: "10px 18px", borderRadius: "12px", fontWeight: "900", fontSize: "13px", cursor: "pointer" },
  quoteCard: { backgroundColor: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: "16px", padding: "18px", display: "flex", flexDirection: "column", gap: "10px" },
  quoteBadge: { alignSelf: "flex-start", backgroundColor: "rgba(250, 204, 21, 0.25)", color: "#facc15", padding: "6px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: "900" },
  arabicText: { margin: 0, fontSize: "18px", fontWeight: "bold", color: "#34d399", textAlign: "right", fontFamily: "'Amiri', serif", textShadow: "0 1px 4px rgba(0,0,0,0.5)" },
  swahiliQuote: { margin: 0, fontSize: "14px", color: "#ffffff", fontStyle: "italic", lineHeight: "1.6", fontWeight: "600" },
  daliliText: { margin: 0, fontSize: "12px", color: "#cbd5e1", fontWeight: "900" },
  faithBox: { padding: "22px 28px", borderRadius: "20px", marginBottom: "26px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "18px", boxShadow: "0 12px 35px rgba(0,0,0,0.4)" },
  cashHeaderCard: { display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "rgba(0,0,0,0.7)", border: "2px solid rgba(250, 204, 21, 0.6)", padding: "24px 32px", borderRadius: "22px", marginBottom: "26px", boxShadow: "0 12px 35px rgba(0,0,0,0.5)" },
  card: { borderRadius: "22px", padding: "28px", backdropFilter: "blur(16px)", boxShadow: "0 15px 40px rgba(0,0,0,0.5)" },
  cardHeader: { display: "flex", alignItems: "center", gap: "14px" },
  cardTitle: { fontSize: "20px", fontWeight: "900", margin: 0 },
  projectCardBox: { padding: "20px", borderRadius: "18px" },
  progressTrack: { height: "18px", width: "100%", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "10px", overflow: "hidden", margin: "14px 0" },
  progressBarFill: { height: "100%", borderRadius: "10px", transition: "width 0.6s ease" },
  projectFooter: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" },
  donateMainBtn: { border: "none", padding: "18px 45px", borderRadius: "16px", fontWeight: "900", fontSize: "17px", cursor: "pointer", boxShadow: "0 12px 30px rgba(0,0,0,0.4)" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.88)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "18px" },
  modalContent: { width: "100%", maxWidth: "520px", padding: "28px", borderRadius: "22px", boxShadow: "0 30px 60px rgba(0,0,0,0.8)" },
  closeBtn: { background: "transparent", border: "none", color: "#fff", fontSize: "22px", cursor: "pointer", fontWeight: "bold" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "13px", fontWeight: "900", textTransform: "uppercase", color: "#facc15" },
  input: { padding: "14px 16px", borderRadius: "12px", border: "2px solid rgba(255,255,255,0.3)", fontSize: "15px", outline: "none", fontWeight: "700" },
  actionBtn: { width: "100%", border: "none", padding: "16px", borderRadius: "14px", fontWeight: "900", fontSize: "15px", cursor: "pointer" },
  backBtn: { backgroundColor: "rgba(255,255,255,0.2)", color: "#fff", border: "none", padding: "16px", borderRadius: "14px", fontWeight: "900", fontSize: "14px", cursor: "pointer" }
};

export default DonorDashboard;
