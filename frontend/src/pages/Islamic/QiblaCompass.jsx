import React, { useEffect, useState } from "react";

const KAABA_LATITUDE = 21.4225;
const KAABA_LONGITUDE = 39.8262;

const COMPASS_THEMES = [
  { id: "classic", name: "Classic Blue", ringBg: "#bae6fd", ringBorder: "#0284c7", outerBorder: "#334155", needleRed: "#ef4444", needleGold: "#d97706" },
  { id: "emerald", name: "Gold Emerald", ringBg: "#065f46", ringBorder: "#d97706", outerBorder: "#047857", needleRed: "#f59e0b", needleGold: "#ffffff" },
  { id: "dark", name: "Tactical Dark", ringBg: "#0f172a", ringBorder: "#38bdf8", outerBorder: "#1e293b", needleRed: "#38bdf8", needleGold: "#818cf8" },
  { id: "royal", name: "Royal Gold", ringBg: "#78350f", ringBorder: "#f59e0b", outerBorder: "#b45309", needleRed: "#fef3c7", needleGold: "#f59e0b" },
];

const OFFLINE_CITIES = {
  Mbeya: { lat: -8.9094, lng: 33.4586, code: "3C78+VP8 Mbeya" },
  "Dar es Salaam": { lat: -6.7924, lng: 39.2083, code: "686X+6X Dar es Salaam" },
  Arusha: { lat: -3.3869, lng: 36.6830, code: "J873+X2 Arusha" },
  Dodoma: { lat: -6.1630, lng: 35.7516, code: "R629+X3 Dodoma" },
  Mwanza: { lat: -2.5164, lng: 32.9175, code: "F7M2+X4 Mwanza" },
};

function QiblaCompass() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState("compass");
  const [selectedTheme, setSelectedTheme] = useState(COMPASS_THEMES[0]);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [selectedCity, setSelectedCity] = useState("Mbeya");
  const [activeModal, setActiveModal] = useState(null);

  const [location, setLocation] = useState(OFFLINE_CITIES["Mbeya"]);
  const [qiblaBearing, setQiblaBearing] = useState(12.0);
  const [distanceKm, setDistanceKm] = useState("3445.04");
  const [heading, setHeading] = useState(0);
  const [hasSensorPermission, setHasSensorPermission] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const calculateQibla = (lat, lng) => {
    const toRad = (deg) => deg * (Math.PI / 180);
    const toDeg = (rad) => rad * (180 / Math.PI);

    const phi1 = toRad(lat);
    const phi2 = toRad(KAABA_LATITUDE);
    const lam1 = toRad(lng);
    const lam2 = toRad(KAABA_LONGITUDE);

    const y = Math.sin(lam2 - lam1);
    const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(lam2 - lam1);
    let bearing = toDeg(Math.atan2(y, x));
    bearing = (bearing + 360) % 360;

    const R = 6371;
    const dLat = toRad(KAABA_LATITUDE - lat);
    const dLon = toRad(KAABA_LONGITUDE - lng);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat)) * Math.cos(toRad(KAABA_LATITUDE)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    setQiblaBearing(bearing);
    setDistanceKm((R * c).toFixed(2));
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
    const loc = OFFLINE_CITIES[city];
    if (loc) {
      setLocation(loc);
      calculateQibla(loc.lat, loc.lng);
    }
  };

  // Omba Ruhusa ya Sensor (iOS & Android Modern Browsers)
  const requestCompassPermission = async () => {
    if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
      try {
        const response = await DeviceOrientationEvent.requestPermission();
        if (response === "granted") {
          window.addEventListener("deviceorientation", handleOrientation, true);
          setHasSensorPermission(true);
        } else {
          alert("Ruhusa ya Compass imekataliwa.");
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      window.addEventListener("deviceorientationabsolute", handleOrientation, true) ||
        window.addEventListener("deviceorientation", handleOrientation, true);
      setHasSensorPermission(true);
    }
  };

  const handleOrientation = (e) => {
    let h = e.webkitCompassHeading || (e.alpha !== null ? 360 - e.alpha : 0);
    setHeading(h % 360);
  };

  useEffect(() => {
    requestCompassPermission();
    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, []);

  // Mbinu ya Simulate Drag kwa PC/Laptop
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    setHeading((prev) => (prev + deltaX * 0.2 + 360) % 360);
    setStartX(e.clientX);
  };

  const handleMouseUp = () => setIsDragging(false);

  const dialRotation = -heading;
  const arrowRotation = (qiblaBearing - heading + 360) % 360;

  if (showSplash) {
    return (
      <div style={styles.splashWrapper}>
        <button style={styles.closeSplashBtn} onClick={() => setShowSplash(false)}>✕</button>
        <div style={styles.globeContainer}>
          <div style={styles.kaabaMarker}>🕋</div>
          <div style={styles.greenPointer}></div>
        </div>
        <p style={styles.splashText}>100% Qibla Finder</p>
      </div>
    );
  }

  return (
    <div style={{ ...styles.appContainer, backgroundColor: darkMode ? "#121212" : "#f8fafc", color: darkMode ? "#ffffff" : "#000000" }}>
      
      {/* HEADER */}
      <div style={styles.topHeaderGroup}>
        <div style={styles.brandingHeader}>
          <p style={styles.bismillah}>بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</p>
          <h1 style={{ ...styles.platformName, color: darkMode ? "#34d399" : "#065f46" }}>RAUDHWAT AL-ATFAL</h1>
          <span style={styles.platformBadge}>ISLAMIC EDUCATIONAL PLATFORM</span>
        </div>

        <div style={styles.topBar}>
          <button style={styles.backBtn} onClick={() => setShowSplash(true)}>←</button>
          <span style={styles.topTitle}>{activeTab === "settings" ? "100% Qibla Finder" : "Qibla Direction"}</span>
          <button style={styles.helpBtn} onClick={() => setActiveModal("FAQ")}>?</button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={styles.mainScrollArea}>
        {activeTab === "compass" && (
          <div style={styles.mainContent}>
            <div style={{ ...styles.locationBadge, backgroundColor: darkMode ? "#1e293b" : "#e2e8f0", color: darkMode ? "#cbd5e1" : "#475569" }}>
              📍 <span>{location.code || selectedCity}</span>
            </div>

            {/* KITUFE CHA KUWASHA SENSOR AU MAELEZO YA MOVEMENT */}
            {!hasSensorPermission && (
              <button onClick={requestCompassPermission} style={styles.enableSensorBtn}>
                🔄 BONYEZA HAPA KUWASHA DIRA
              </button>
            )}

            {/* DIRA INAYOZUNGUUKA (Pia Unaweza kudrag kwa Mouse kupima kwenye Laptop) */}
            <div
              style={styles.compassWrapper}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              <div style={{ ...styles.compassOuterRing, borderColor: selectedTheme.outerBorder, transform: `rotate(${dialRotation}deg)` }}>
                <span style={{ ...styles.cardinalText, top: "8px", color: darkMode ? "#fff" : "#334155" }}>N</span>
                <span style={{ ...styles.cardinalText, right: "12px", top: "45%", color: darkMode ? "#fff" : "#334155" }}>E</span>
                <span style={{ ...styles.cardinalText, bottom: "8px", color: darkMode ? "#fff" : "#334155" }}>S</span>
                <span style={{ ...styles.cardinalText, left: "12px", top: "45%", color: darkMode ? "#fff" : "#334155" }}>W</span>

                <div style={{ ...styles.kaabaRingPosition, transform: `rotate(${qiblaBearing}deg) translateY(-105px) rotate(-${qiblaBearing}deg)` }}>
                  🕋
                </div>

                <div style={{ ...styles.innerCircle, backgroundColor: selectedTheme.ringBg, borderColor: selectedTheme.ringBorder }}>
                  <div style={{ ...styles.needlePointer, transform: `rotate(${arrowRotation}deg)` }}>
                    <div style={{ ...styles.needleRed, borderBottomColor: selectedTheme.needleRed }} />
                    <div style={{ ...styles.needleGold, borderTopColor: selectedTheme.needleGold }} />
                    <div style={{ ...styles.needleCenterDot, borderColor: selectedTheme.needleRed }} />
                  </div>
                </div>
              </div>
            </div>

            <p style={{ fontSize: "11px", color: "#a1a1aa", marginTop: "4px" }}>
              (Kama uko kwenye Laptop, unaweza ku-drag dira kwa Mouse)
            </p>

            <div style={styles.infoBox}>
              <p style={styles.distanceText}>Distance from Qibla is <strong>{distanceKm} KM</strong></p>
              <p style={styles.degreeText}>The direction of Qibla is <strong>{qiblaBearing.toFixed(0)}°</strong> from North</p>
            </div>

            {/* THEME PICKER */}
            <div style={styles.themeSelector}>
              <span style={{ fontSize: "12px", color: darkMode ? "#a1a1aa" : "#64748b" }}>Badilisha Theme:</span>
              <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                {COMPASS_THEMES.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTheme(t)}
                    style={{
                      ...styles.themeCircle,
                      backgroundColor: t.ringBg,
                      borderColor: selectedTheme.id === t.id ? "#22c55e" : t.ringBorder,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MAP TAB */}
        {activeTab === "map" && (
          <div style={styles.tabSection}>
            <h3>🗺️ Offline Map & Cities</h3>
            <div style={styles.mapBox}>
              <div style={styles.mapKaaba}>🕋 Kaaba</div>
              <div style={styles.mapLine}></div>
              <div style={styles.mapUser}>📍 You ({selectedCity})</div>
            </div>
            <p style={{ fontSize: "13px", marginTop: "10px" }}>Chagua Mji:</p>
            <select value={selectedCity} onChange={(e) => handleCityChange(e.target.value)} style={styles.dropdown}>
              {Object.keys(OFFLINE_CITIES).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        )}

        {/* LIVE AR TAB */}
        {activeTab === "live" && (
          <div style={styles.tabSection}>
            <h3>📹 Live AR Compass</h3>
            <div style={styles.cameraBox}>
              <div style={styles.arOverlay}>🕋 Qibla Direction ({qiblaBearing.toFixed(0)}°)</div>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <div style={{ ...styles.settingsContainer, backgroundColor: darkMode ? "#18181b" : "#ffffff" }}>
            <div style={styles.settingRow} onClick={() => setActiveModal("Try Premium")}>
              <span>💎 Try Premium</span>
              <span>›</span>
            </div>
            <div style={styles.settingRow} onClick={() => setActiveModal("Promo Code")}>
              <span>💸 Enter Your Promo Code</span>
              <span>›</span>
            </div>
            <div style={styles.settingRow} onClick={() => alert("Purchases Restored!")}>
              <span>🔄 Restore</span>
            </div>
            <div style={styles.settingRow} onClick={() => setActiveTab("map")}>
              <span>📍 Location marker</span>
              <span style={{ fontSize: "12px", color: "#a1a1aa" }}>{selectedCity} ›</span>
            </div>
            <div style={styles.settingRow}>
              <span>📳 Vibration</span>
              <input type="checkbox" checked={vibrationEnabled} onChange={(e) => setVibrationEnabled(e.target.checked)} style={styles.toggleSwitch} />
            </div>
            <div style={styles.settingRow}>
              <span>☀️ Dark Mode</span>
              <input type="checkbox" checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} style={styles.toggleSwitch} />
            </div>
            <div style={styles.settingRow} onClick={() => setActiveModal("Feedback")}>
              <span>✉️ Feedback</span>
            </div>
            <div style={styles.settingRow} onClick={() => setActiveModal("Rate us")}>
              <span>⭐ Rate us</span>
            </div>
            <div style={styles.settingRow} onClick={() => setActiveModal("FAQ")}>
              <span>💬 FAQ</span>
            </div>
            <div style={styles.settingRow} onClick={() => setActiveModal("Privacy & Terms")}>
              <span>🛡️ Privacy&Terms</span>
            </div>
          </div>
        )}
      </div>

      {/* FIXED BOTTOM NAV */}
      <div style={{ ...styles.bottomNav, backgroundColor: darkMode ? "#18181b" : "#ffffff" }}>
        <button onClick={() => setActiveTab("map")} style={{ ...styles.navBtn, color: activeTab === "map" ? "#22c55e" : "#94a3b8" }}>📖 <span style={{ fontSize: "11px" }}>Map</span></button>
        <button onClick={() => setActiveTab("compass")} style={{ ...styles.navBtn, color: activeTab === "compass" ? "#22c55e" : "#94a3b8" }}>🧭 <span style={{ fontSize: "11px" }}>Compass</span></button>
        <button onClick={() => setActiveTab("live")} style={{ ...styles.navBtn, color: activeTab === "live" ? "#22c55e" : "#94a3b8" }}>▶️ <span style={{ fontSize: "11px" }}>Live</span></button>
        <button onClick={() => setActiveTab("settings")} style={{ ...styles.navBtn, color: activeTab === "settings" ? "#22c55e" : "#94a3b8" }}>⚙️ <span style={{ fontSize: "11px" }}>Settings</span></button>
      </div>

      {/* MODALS */}
      {activeModal && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalContent, backgroundColor: darkMode ? "#27272a" : "#ffffff", color: darkMode ? "#fff" : "#000" }}>
            <h4>{activeModal}</h4>
            <p style={{ fontSize: "13px" }}>Kipengele hiki kiko tayari.</p>
            <button style={styles.closeModalBtn} onClick={() => setActiveModal(null)}>Funga</button>
          </div>
        </div>
      )}

    </div>
  );
}

const styles = {
  splashWrapper: { width: "100%", height: "100vh", backgroundColor: "#050B14", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" },
  closeSplashBtn: { position: "absolute", top: "20px", left: "20px", color: "#fff", background: "none", border: "none", fontSize: "22px", cursor: "pointer" },
  globeContainer: { width: "240px", height: "240px", borderRadius: "50%", background: "radial-gradient(circle at 30% 30%, #1e40af, #030712)", boxShadow: "0 0 35px rgba(2, 132, 199, 0.4)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" },
  kaabaMarker: { position: "absolute", top: "35%", left: "42%", fontSize: "28px" },
  greenPointer: { position: "absolute", bottom: "25%", right: "35%", width: 0, height: 0, borderLeft: "15px solid transparent", borderRight: "15px solid transparent", borderBottom: "40px solid #22c55e", transform: "rotate(-30deg)" },
  splashText: { color: "#ffffff", marginTop: "25px", fontSize: "18px", fontWeight: "bold" },
  appContainer: { width: "100%", maxWidth: "420px", height: "100vh", margin: "0 auto", display: "flex", flexDirection: "column", fontFamily: "sans-serif", overflow: "hidden" },
  topHeaderGroup: { flexShrink: 0 },
  brandingHeader: { textAlign: "center", padding: "6px 0 2px 0" },
  bismillah: { fontSize: "13px", color: "#047857", margin: "0", fontWeight: "bold" },
  platformName: { fontSize: "16px", fontWeight: "900", margin: "0" },
  platformBadge: { backgroundColor: "#d1fae5", color: "#047857", padding: "1px 6px", borderRadius: "10px", fontSize: "8px", fontWeight: "bold" },
  topBar: { height: "40px", backgroundColor: "#155e75", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px" },
  backBtn: { background: "none", border: "none", color: "#fff", fontSize: "18px", cursor: "pointer" },
  topTitle: { fontSize: "14px", fontWeight: "bold" },
  helpBtn: { background: "none", border: "1px solid #fff", borderRadius: "50%", width: "20px", height: "20px", color: "#fff", fontSize: "11px", cursor: "pointer" },
  mainScrollArea: { flex: 1, overflowY: "auto", padding: "10px" },
  mainContent: { display: "flex", flexDirection: "column", alignItems: "center" },
  locationBadge: { padding: "4px 12px", borderRadius: "15px", fontSize: "12px", marginBottom: "8px" },
  enableSensorBtn: { backgroundColor: "#22c55e", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: "bold", cursor: "pointer", marginBottom: "8px" },
  compassWrapper: { position: "relative", width: "210px", height: "210px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "grab" },
  compassOuterRing: { width: "200px", height: "200px", borderRadius: "50%", border: "6px solid", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.1s linear" },
  cardinalText: { position: "absolute", fontWeight: "bold", fontSize: "12px" },
  kaabaRingPosition: { position: "absolute", fontSize: "20px", zIndex: 10 },
  innerCircle: { width: "110px", height: "110px", borderRadius: "50%", border: "2px solid", display: "flex", alignItems: "center", justifyContent: "center" },
  needlePointer: { position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.1s ease-out" },
  needleRed: { position: "absolute", width: 0, height: 0, borderLeft: "7px solid transparent", borderRight: "7px solid transparent", borderBottom: "50px solid", transform: "translateY(-25px)" },
  needleGold: { position: "absolute", width: 0, height: 0, borderLeft: "7px solid transparent", borderRight: "7px solid transparent", borderTop: "50px solid", transform: "translateY(25px)" },
  needleCenterDot: { position: "absolute", width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ffffff", border: "2px solid", zIndex: 5 },
  infoBox: { textAlign: "center", marginTop: "8px" },
  distanceText: { fontSize: "12px", margin: "2px 0" },
  degreeText: { fontSize: "12px", margin: "2px 0" },
  themeSelector: { marginTop: "8px", display: "flex", flexDirection: "column", alignItems: "center" },
  themeCircle: { width: "24px", height: "24px", borderRadius: "50%", border: "2px solid", cursor: "pointer" },
  tabSection: { textAlign: "center" },
  mapBox: { width: "100%", height: "150px", backgroundColor: "#1e293b", borderRadius: "12px", position: "relative", display: "flex", alignItems: "center", justifyContent: "space-around" },
  mapKaaba: { fontSize: "16px", zIndex: 2 },
  mapUser: { fontSize: "13px", color: "#22c55e", zIndex: 2 },
  mapLine: { position: "absolute", width: "60%", height: "2px", borderTop: "2px dashed #38bdf8", zIndex: 1 },
  cameraBox: { width: "100%", height: "180px", backgroundColor: "#000000", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" },
  arOverlay: { color: "#22c55e", padding: "6px 12px", border: "2px solid #22c55e", borderRadius: "8px" },
  dropdown: { width: "100%", padding: "8px", borderRadius: "8px", marginTop: "8px" },
  settingsContainer: { borderRadius: "8px" },
  settingRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderBottom: "1px solid rgba(150, 150, 150, 0.1)", fontSize: "13px", cursor: "pointer" },
  toggleSwitch: { width: "32px", height: "16px", accentColor: "#22c55e", cursor: "pointer" },
  bottomNav: { height: "55px", flexShrink: 0, display: "flex", justifyContent: "space-around", alignItems: "center", borderTop: "1px solid rgba(150,150,150,0.2)" },
  navBtn: { background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", gap: "2px" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 },
  modalContent: { padding: "20px", borderRadius: "12px", textAlign: "center", width: "260px" },
  closeModalBtn: { marginTop: "12px", padding: "6px 16px", border: "none", backgroundColor: "#22c55e", color: "#fff", borderRadius: "6px", cursor: "pointer" },
};

export default QiblaCompass;