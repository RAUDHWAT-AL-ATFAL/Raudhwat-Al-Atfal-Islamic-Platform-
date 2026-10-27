import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, Link } from "react-router-dom";

import Navbar from "./components/Navbar";
import SplashScreen from "./pages/RaudhwatSplash"; // Importing wetu wa Splash Screen mpya

import HomePage from "./pages/HomePage";
import QuranHome from "./pages/Quran/QuranHome";
import SurahPage from "./pages/Quran/SurahPage";
import QuranDownloads from "./pages/Quran/QuranDownloads";
import SurahList from "./pages/SurahList";
import HisnMuslimPage from "./pages/HisnMuslimPage";
import HadithPage from "./pages/HadithPage";
import IslamicAcademyPage from "./pages/IslamicAcademyPage";
import AcademyQuiz from "./pages/AcademyQuiz";
import QiblaCompass from "./pages/Islamic/QiblaCompass";
import AdminDashboard from "./pages/AdminDashboard";
import DonorDashboard from "./pages/DonorDashboard";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/registerPage";

// --- IMPORT YA MSAIDIZI WA RAUDHWAT AL-ATFAL (AI ASSISTANT) ---
import AIAssistancepage from "./pages/AIAssistancepage";

// --- 1. PWA INSTALL HOOK ---
export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // Kuzuia pop-up ya default ya browser
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  return { isInstallable, handleInstallClick };
}

// --- 2. GLOBAL BACK BUTTON COMPONENT ---
function GlobalBackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  if (
    location.pathname === "/home" ||
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register"
  ) {
    return null;
  }

  return (
    <button
      onClick={() => navigate(-1)}
      style={{
        position: "fixed",
        top: "70px",
        left: "15px",
        zIndex: 999,
        backgroundColor: "#065f46",
        color: "#ffffff",
        border: "none",
        padding: "6px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
      }}
    >
      ← Rudi Ulipokuwa
    </button>
  );
}

// --- 3. MAIN APP COMPONENT ---
export default function App() {
  // A. Multi-Stage Flow: "logo" -> "splash" -> "main"
  const [currentStep, setCurrentStep] = useState("logo");

  // Timer ya Logo kuonekana kwa sekunde 2 kisha kuhamia Splash ya Watoto
  useEffect(() => {
    const logoTimer = setTimeout(() => {
      setCurrentStep("splash");
    }, 2000);

    return () => clearTimeout(logoTimer);
  }, []);

  // B. PWA Install State & Hook
  const { isInstallable, handleInstallClick } = usePWAInstall();
  const [showInstallBanner, setShowInstallBanner] = useState(true);

  // C. User States & LocalStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("raudhwat_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [allUsers, setAllUsers] = useState(() => {
    const saved = localStorage.getItem("raudhwat_all_users");
    return saved
      ? JSON.parse(saved)
      : [
          { id: 1, name: "Ustadh Juma", email: "admin1@raudhwat.org", role: "admin" },
          { id: 2, name: "Sheikh Ali", email: "admin2@raudhwat.org", role: "admin" }
        ];
  });

  // Hifadhi data za user kwenye LocalStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("raudhwat_user", JSON.stringify(user));
      if (user.role) {
        localStorage.setItem("role", user.role);
      }
      if (user.token) {
        localStorage.setItem("token", user.token);
      } else {
        localStorage.setItem("token", "dummy_jwt_token_active");
      }
    } else {
      localStorage.removeItem("raudhwat_user");
      localStorage.removeItem("role");
      localStorage.removeItem("token");
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("raudhwat_all_users", JSON.stringify(allUsers));
  }, [allUsers]);

  const handleLogin = (userData) => {
    setUser(userData);
    const exists = allUsers.some((u) => u.email === userData.email);
    if (!exists) {
      setAllUsers((prev) => [...prev, userData]);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("raudhwat_user");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // Roles za Ma-Admin Pekee
  const adminRoles = [
    "admin",
    "AMIRI",
    "AMIRATI",
    "KATIBU_ADMIN",
    "KATIBATI",
    "MWEKAHAZINA_ADMIN",
    "AMIRI_HABARI",
    "KATIBU",
    "MWEKAHAZINA"
  ];

  const isAdmin = user && adminRoles.includes(user.role);

  // --- 1. HATUA YA KWANZA: LOGO YA MFUMO ---
  if (currentStep === "logo") {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#065f46",
        color: "#ffffff"
      }}>
        <img 
          src="/icon-192.png" 
          alt="Raudhwat Logo" 
          style={{ width: "110px", height: "110px", borderRadius: "24px", marginBottom: "20px", boxShadow: "0 6px 20px rgba(0,0,0,0.4)" }} 
        />
        <h2 style={{ fontFamily: "sans-serif", fontSize: "24px", margin: 0, fontWeight: "bold" }}>Raudhwat Al-Atfal</h2>
        <p style={{ fontSize: "14px", opacity: 0.9, marginTop: "8px" }}>Bismillahi Rahmani Rahim</p>
      </div>
    );
  }

  // --- 2. HATUA YA PILI: SPLASH SCREEN YA WATOTO ---
  if (currentStep === "splash") {
    return <SplashScreen onFinish={() => setCurrentStep("main")} />;
  }

  // --- 3. HATUA YA TATU: MFUMO WENYEWE UNAPOFUNGUKA NA KUONYESHA MAUDHUI ---
  return (
    <BrowserRouter>
      {user && <Navbar user={user} onLogout={handleLogout} />}
      {user && <GlobalBackButton />}

      {/* A. POP-UP BANNER YA KU-INSTALL APP (Chini ya Screen) */}
      {isInstallable && showInstallBanner && (
        <div style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#0f766e",
          color: "white",
          padding: "12px 20px",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          gap: "12px",
          maxWidth: "90%",
          width: "400px"
        }}>
          <img src="/icon-192.png" alt="App Icon" style={{ width: "36px", height: "36px", borderRadius: "8px" }} />
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "bold" }}>Sakinisha App ya Raudhwat</h4>
            <p style={{ margin: 0, fontSize: "11px", opacity: 0.9 }}>Iweke kwenye simu kwa matumizi rahisi</p>
          </div>
          <button
            onClick={handleInstallClick}
            style={{
              backgroundColor: "#ffffff",
              color: "#0f766e",
              border: "none",
              padding: "6px 12px",
              borderRadius: "6px",
              fontWeight: "bold",
              fontSize: "12px",
              cursor: "pointer"
            }}
          >
            Sakinisha
          </button>
          <button
            onClick={() => setShowInstallBanner(false)}
            style={{
              background: "none",
              border: "none",
              color: "white",
              fontSize: "16px",
              cursor: "pointer"
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* B. BUTTON YA ZIADA (FLOATING INSTALL BUTTON) */}
      {isInstallable && !showInstallBanner && (
        <button
          onClick={handleInstallClick}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "#0f766e",
            color: "#ffffff",
            border: "none",
            borderRadius: "50px",
            padding: "10px 18px",
            fontWeight: "bold",
            fontSize: "13px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            zIndex: 999,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          📲 Sakinisha App
        </button>
      )}

      {/* C. FLOATING BUTTON YA MSAIDIZI WA MAARIFA (AI ASSISTANT) */}
      {user && (
        <Link
          to="/ai-assistant"
          style={{
            position: "fixed",
            bottom: isInstallable && !showInstallBanner ? "75px" : "20px",
            right: "20px",
            backgroundColor: "#065f46",
            color: "#ffffff",
            borderRadius: "50px",
            padding: "10px 18px",
            fontWeight: "bold",
            fontSize: "13px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            zIndex: 998,
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          ✨ 📖 Msaidizi wa Maarifa
        </Link>
      )}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />

        {/* Login na Register */}
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage onLogin={handleLogin} />} />

        {/* Kurasa za Quran na Maarifa */}
        <Route path="/quran" element={user ? <QuranHome /> : <Navigate to="/login" replace />} />
        <Route path="/surah-list" element={user ? <SurahList /> : <Navigate to="/login" replace />} />
        <Route path="/quran/surah/:id" element={user ? <SurahPage /> : <Navigate to="/login" replace />} />
        <Route path="/quran/downloads" element={user ? <QuranDownloads /> : <Navigate to="/login" replace />} />
        <Route path="/hisn-muslim" element={user ? <HisnMuslimPage /> : <Navigate to="/login" replace />} />
        <Route path="/hadith" element={user ? <HadithPage /> : <Navigate to="/login" replace />} />
        <Route path="/academy" element={user ? <IslamicAcademyPage /> : <Navigate to="/login" replace />} />
        <Route path="/quiz" element={user ? <AcademyQuiz /> : <Navigate to="/login" replace />} />
        <Route path="/qibla" element={user ? <QiblaCompass /> : <Navigate to="/login" replace />} />

        {/* ROUTE YA MSAIDIZI WA MAARIFA (AI ASSISTANT PAGE) */}
        <Route
          path="/ai-assistant"
          element={
            user ? (
              <AIAssistancepage currentUser={user} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Dashboards */}
        <Route
          path="/admin"
          element={isAdmin ? <AdminDashboard usersList={allUsers} currentUser={user} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/admindashboard"
          element={isAdmin ? <AdminDashboard usersList={allUsers} currentUser={user} /> : <Navigate to="/login" replace />}
        />

        {/* Mfadhili Dashboard */}
        <Route
          path="/donordashboard"
          element={
            user ? (
              <DonorDashboard currentUser={user} title="Dashboard ya Mfadhili" userType="mfadhili" />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Mwanachama Dashboard */}
        <Route
          path="/memberdashboard"
          element={
            user ? (
              <DonorDashboard currentUser={user} title="Dashboard ya Mwanachama" userType="mwanachama" />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/role-dashboard"
          element={isAdmin ? <AdminDashboard usersList={allUsers} currentUser={user} /> : <Navigate to="/login" replace />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
