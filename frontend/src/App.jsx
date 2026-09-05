import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
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

function GlobalBackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === "/quran" || location.pathname === "/" || location.pathname === "/login") {
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

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("raudhwat_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [allUsers, setAllUsers] = useState(() => {
    const saved = localStorage.getItem("raudhwat_all_users");
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "Ustadh Juma", email: "admin1@raudhwat.org", role: "admin" },
      { id: 2, name: "Sheikh Ali", email: "admin2@raudhwat.org", role: "admin" }
    ];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("raudhwat_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("raudhwat_user");
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
  };

  return (
    <BrowserRouter>
      <Navbar user={user} onLogout={handleLogout} />
      <GlobalBackButton />

      <Routes>
        <Route path="/" element={<Navigate to="/quran" replace />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/quran" element={<QuranHome />} />
        <Route path="/surah-list" element={<SurahList />} />
        <Route path="/quran/surah/:id" element={<SurahPage />} />
        <Route path="/surah/:id" element={<SurahPage />} />
        <Route path="/quran/downloads" element={<QuranDownloads />} />
        <Route path="/hisn-muslim" element={<HisnMuslimPage />} />
        <Route path="/hadith" element={<HadithPage />} />
        <Route path="/academy" element={<IslamicAcademyPage />} />
        <Route path="/quiz" element={<AcademyQuiz />} />
        <Route path="/qibla" element={<QiblaCompass />} />

        <Route 
          path="/admin" 
          element={
            user && user.role === "admin" ? (
              <AdminDashboard usersList={allUsers} currentUser={user} />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        <Route 
          path="/donor-dashboard" 
          element={
            user && (user.role === "donor" || user.role === "admin") ? (
              <DonorDashboard currentUser={user} />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        <Route path="*" element={<QuranHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;