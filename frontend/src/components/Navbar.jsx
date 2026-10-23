import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  // Hatua ya kuangalia kama mtumiaji ni miongoni mwa viongozi wakuu 3
  const isLeader = user && ['KATIBU', 'MWEKAHAZINA', 'MWENYEKITI'].includes(user.role);

  return (
    <nav style={{
      backgroundColor: "#064e3b",
      color: "#ffffff",
      padding: "12px 24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      position: "sticky",
      top: 0,
      zIndex: 1000
    }}>
      {/* LOGO & BRAND NAME */}
      <Link to="/" style={{ textDecoration: "none", color: "#ffffff", display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "24px" }}>🕌</span>
        <div>
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "bold", letterSpacing: "0.5px" }}>
            Raudhwat Al-Atfal
          </h2>
          <span style={{ fontSize: "10px", color: "#f59e0b", display: "block" }}>
            Islamic Educational Platform
          </span>
        </div>
      </Link>

      {/* NAVIGATION LINKS (SEHEMU ZOTE ZA MFUMO) */}
      <div style={{ display: "flex", gap: "18px", alignItems: "center", fontSize: "14px", fontWeight: "600" }}>
        <Link to="/quran" style={{ color: "#ffffff", textDecoration: "none" }}>📖 Qur'an</Link>
        <Link to="/hadith" style={{ color: "#ffffff", textDecoration: "none" }}>📜 Hadith</Link>
        <Link to="/hisn-muslim" style={{ color: "#ffffff", textDecoration: "none" }}>🤲 Hisn Muslim</Link>
        <Link to="/qibla" style={{ color: "#ffffff", textDecoration: "none" }}>🧭 Qibla</Link>
        <Link to="/academy" style={{ color: "#ffffff", textDecoration: "none" }}>🎓 Academy</Link>
        <Link to="/quiz" style={{ color: "#ffffff", textDecoration: "none" }}>❓ Quiz</Link>

        {/* LINKS ZA PEKEE KULINGANA NA WADHIFA (ROLE) */}
        {user && user.role === "admin" && (
          <Link to="/admin" style={{ color: "#f59e0b", textDecoration: "none", backgroundColor: "rgba(245, 158, 11, 0.2)", padding: "4px 10px", borderRadius: "6px" }}>
            👑 Admin Dashboard
          </Link>
        )}

        {user && (user.role === "donor" || user.role === "admin") && (
          <Link to="/donor-dashboard" style={{ color: "#34d399", textDecoration: "none", backgroundColor: "rgba(52, 211, 153, 0.2)", padding: "4px 10px", borderRadius: "6px" }}>
            💚 Donor Dashboard
          </Link>
        )}

        {/* DASHBOARD YA VIONGOZI 3 (KATIBU, MWEKAHAZINA, MWENYEKITI TU) */}
        {isLeader && (
          <Link to="/dashboard-viongozi.html" style={{ color: "#ffd700", textDecoration: "none", backgroundColor: "rgba(255, 215, 0, 0.2)", padding: "4px 10px", borderRadius: "6px", fontWeight: "bold" }}>
            ⚖️ Dashboard ya Viongozi
          </Link>
        )}
      </div>

      {/* TAARIFA ZA MTUMIAJI ALIYEINGIA & LOGOUT BUTTON */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {user ? (
          <>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "13px", fontWeight: "bold", color: "#f59e0b", display: "block" }}>
                👤 {user.name || user.email}
              </span>
              <span style={{ fontSize: "10px", textTransform: "uppercase", color: "#cbd5e1" }}>
                ({user.role || "Member"})
              </span>
            </div>
            <button 
              onClick={() => {
                if (onLogout) onLogout();
                navigate("/login");
              }}
              style={{
                backgroundColor: "#dc2626",
                color: "#ffffff",
                border: "none",
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Toka (Logout)
            </button>
          </>
        ) : (
          <Link 
            to="/login" 
            style={{
              backgroundColor: "#d97706",
              color: "#ffffff",
              textDecoration: "none",
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "bold"
            }}
          >
            Ingia / Jisajili
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;