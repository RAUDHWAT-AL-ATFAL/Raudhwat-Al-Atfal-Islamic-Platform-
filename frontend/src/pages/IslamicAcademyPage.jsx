// src/pages/IslamicAcademyPage.jsx - RAUDHWAT AL-ATFAL ISLAMIC ACADEMY ENGINE
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ACADEMY_SUBJECTS, LESSONS_DATA, QUIZ_QUESTIONS } from "../data/academyData";

const THEMES = {
  emerald: { bg: "#f8fafc", cardBg: "#ffffff", primary: "#047857", accent: "#fbbf24", text: "#0f172a" },
  gold: { bg: "#fffbeb", cardBg: "#ffffff", primary: "#b45309", accent: "#d97706", text: "#451a03" },
  dark: { bg: "#0f172a", cardBg: "#1e293b", primary: "#10b981", accent: "#fbbf24", text: "#f8fafc" }
};

const IslamicAcademyPage = () => {
  const navigate = useNavigate();

  // --- STATES ---
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [activeTab, setActiveTab] = useState("lessons"); // 'lessons' au 'quiz'
  const [selectedLesson, setSelectedLesson] = useState(null);
  
  // Quiz Engine States
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const [themeMode] = useState(() => localStorage.getItem("quran_theme") || "emerald");
  const currentTheme = THEMES[themeMode] || THEMES.emerald;

  // Filter Lessons
  const filteredLessons = LESSONS_DATA.filter(
    (l) => selectedSubject === "all" || l.subjectId === selectedSubject
  );

  // Quiz Answer Handler
  const handleSelectOption = (index) => {
    if (selectedOption !== null) return; // Zuia kubadilisha baada ya kuchagua
    setSelectedOption(index);

    if (index === QUIZ_QUESTIONS[currentQuizIndex].correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuizIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentQuizIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedOption(null);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div style={{ ...styles.pageWrapper, backgroundColor: currentTheme.bg, color: currentTheme.text }}>
      
      {/* HEADER */}
      <header style={{ ...styles.header, backgroundColor: currentTheme.cardBg, borderColor: currentTheme.primary + "30" }}>
        <button style={styles.backBtn} onClick={() => navigate("/")}>⬅️ Rudi Home</button>
        <div style={styles.headerTitle}>
          <span style={{ fontSize: "28px" }}>🎓</span>
          <div>
            <h1 style={{ margin: 0, fontSize: "20px", color: currentTheme.primary }}>Chuo cha Elimu ya Kiislamu</h1>
            <p style={{ margin: 0, fontSize: "12px", opacity: 0.8 }}>Fiqh, Aqeedah, Seerah na Chemsha Bongo</p>
          </div>
        </div>
      </header>

      {/* HERO BANNER */}
      <section style={{ ...styles.heroBanner, background: `linear-gradient(135deg, ${currentTheme.primary} 0%, #064e3b 100%)` }}>
        <h2 style={{ fontSize: "24px", margin: "0 0 8px 0", color: "#fbbf24" }}>"Tafutaji Elimu ni Faradhi kwa Kila Muislamu"</h2>
        <p style={{ margin: 0, fontSize: "14px", opacity: 0.9 }}>[Sunan Ibn Majah 224 - Sahih]</p>

        {/* TAB NAVIGATION */}
        <div style={styles.tabContainer}>
          <button
            style={{ ...styles.tabBtn, backgroundColor: activeTab === "lessons" ? "#fbbf24" : "rgba(255,255,255,0.2)", color: activeTab === "lessons" ? "#000" : "#fff" }}
            onClick={() => setActiveTab("lessons")}
          >
            📖 Masomo ya Dini
          </button>
          <button
            style={{ ...styles.tabBtn, backgroundColor: activeTab === "quiz" ? "#fbbf24" : "rgba(255,255,255,0.2)", color: activeTab === "quiz" ? "#000" : "#fff" }}
            onClick={() => { setActiveTab("quiz"); resetQuiz(); }}
          >
            🎯 Chemsha Bongo (Quiz)
          </button>
        </div>
      </section>

      {/* LESSONS TAB */}
      {activeTab === "lessons" && (
        <>
          <section style={styles.filterSection}>
            <div style={styles.chipRow}>
              {ACADEMY_SUBJECTS.filter(s => s.id !== "quizzes").map((subj) => (
                <button
                  key={subj.id}
                  onClick={() => setSelectedSubject(subj.id)}
                  style={{
                    ...styles.chip,
                    backgroundColor: selectedSubject === subj.id ? currentTheme.primary : currentTheme.cardBg,
                    color: selectedSubject === subj.id ? "#fff" : currentTheme.text,
                    borderColor: currentTheme.primary + "30"
                  }}
                >
                  {subj.icon} {subj.name}
                </button>
              ))}
            </div>
          </section>

          <main style={styles.mainGrid}>
            {filteredLessons.map((lesson) => (
              <div
                key={lesson.id}
                style={{
                  ...styles.lessonCard,
                  backgroundColor: currentTheme.cardBg,
                  borderColor: currentTheme.primary + "20"
                }}
              >
                <div style={styles.cardHeader}>
                  <span style={styles.levelTag}>⭐ {lesson.level}</span>
                  <span style={{ fontSize: "12px", opacity: 0.7 }}>⏱️ {lesson.readTime}</span>
                </div>

                <h3 style={{ color: currentTheme.primary, margin: "10px 0 6px 0", fontSize: "18px" }}>
                  {lesson.title}
                </h3>
                <p style={{ fontSize: "14px", opacity: 0.85, lineHeight: "1.5" }}>{lesson.summary}</p>

                <button
                  style={{ ...styles.readBtn, backgroundColor: currentTheme.primary }}
                  onClick={() => setSelectedLesson(lesson)}
                >
                  📖 Soma Somo Hili Kamili ➔
                </button>
              </div>
            ))}
          </main>
        </>
      )}

      {/* QUIZ TAB */}
      {activeTab === "quiz" && (
        <main style={styles.quizWrapper}>
          {!quizFinished ? (
            <div style={{ ...styles.quizCard, backgroundColor: currentTheme.cardBg }}>
              <div style={styles.quizHeader}>
                <span>Swali la {currentQuizIndex + 1} kati ya {QUIZ_QUESTIONS.length}</span>
                <span style={{ fontWeight: "bold", color: currentTheme.primary }}>Alama: {score}</span>
              </div>

              <h3 style={{ fontSize: "20px", margin: "20px 0", color: currentTheme.primary }}>
                {QUIZ_QUESTIONS[currentQuizIndex].question}
              </h3>

              <div style={styles.optionsGrid}>
                {QUIZ_QUESTIONS[currentQuizIndex].options.map((option, idx) => {
                  let btnBg = currentTheme.cardBg;
                  let borderCol = "#cbd5e1";

                  if (selectedOption !== null) {
                    if (idx === QUIZ_QUESTIONS[currentQuizIndex].correctAnswer) {
                      btnBg = "#d1fae5";
                      borderCol = "#10b981";
                    } else if (idx === selectedOption) {
                      btnBg = "#fee2e2";
                      borderCol = "#ef4444";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={selectedOption !== null}
                      onClick={() => handleSelectOption(idx)}
                      style={{
                        ...styles.optionBtn,
                        backgroundColor: btnBg,
                        borderColor: borderCol,
                        color: currentTheme.text
                      }}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {selectedOption !== null && (
                <div style={styles.explanationBox}>
                  <strong>💡 Maelezo:</strong> {QUIZ_QUESTIONS[currentQuizIndex].explanation}
                  <button style={{ ...styles.nextBtn, backgroundColor: currentTheme.primary }} onClick={handleNextQuestion}>
                    {currentQuizIndex + 1 === QUIZ_QUESTIONS.length ? "Maliza Quiz 🎉" : "Swali Linalofuata ➔"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ ...styles.quizCard, backgroundColor: currentTheme.cardBg, textAlign: "center" }}>
              <span style={{ fontSize: "60px" }}>🎉</span>
              <h2>Hongera Sana! Utendaji Wako:</h2>
              <p style={{ fontSize: "24px", fontWeight: "bold", color: currentTheme.primary }}>
                Umepata {score} kati ya {QUIZ_QUESTIONS.length}!
              </p>
              <button style={{ ...styles.readBtn, backgroundColor: currentTheme.primary }} onClick={resetQuiz}>
                🔄 Rudia Quiz Upya
              </button>
            </div>
          )}
        </main>
      )}

      {/* LESSON MODAL */}
      {selectedLesson && (
        <div style={styles.modalOverlay}>
          <div style={{ ...styles.modalCard, backgroundColor: currentTheme.cardBg, color: currentTheme.text }}>
            <div style={styles.modalHeader}>
              <h3>{selectedLesson.title}</h3>
              <button style={styles.closeBtn} onClick={() => setSelectedLesson(null)}>✖</button>
            </div>
            <div style={styles.modalBody}>
              {selectedLesson.content.map((paragraph, idx) => (
                <p key={idx} style={{ lineHeight: "1.7", margin: "10px 0" }}>{paragraph}</p>
              ))}
              <div style={styles.evidenceBox}>
                <strong>📜 Dalili & Chanzo:</strong> {selectedLesson.evidence}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
// STYLES SYSTEM
const styles = {
  pageWrapper: { minHeight: "100vh", paddingBottom: "60px", fontFamily: "'Inter', sans-serif" },
  header: { display: "flex", alignItems: "center", gap: "16px", padding: "16px 24px", borderBottom: "1px solid", position: "sticky", top: 0, zIndex: 100 },
  backBtn: { padding: "8px 16px", borderRadius: "10px", border: "none", backgroundColor: "#e2e8f0", cursor: "pointer", fontWeight: "bold" },
  headerTitle: { display: "flex", alignItems: "center", gap: "12px" },
  heroBanner: { padding: "32px 24px", textAlign: "center", color: "#fff", borderRadius: "0 0 24px 24px" },
  tabContainer: { display: "flex", justifyContent: "center", gap: "12px", marginTop: "20px" },
  tabBtn: { padding: "10px 20px", borderRadius: "12px", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "14px" },
  filterSection: { maxWidth: "1000px", margin: "24px auto 12px auto", padding: "0 16px" },
  chipRow: { display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "4px" },
  chip: { padding: "8px 16px", borderRadius: "12px", border: "1px solid", cursor: "pointer", fontWeight: "bold", whiteSpace: "nowrap" },
  mainGrid: { maxWidth: "1000px", margin: "0 auto", padding: "0 16px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" },
  lessonCard: { padding: "20px", borderRadius: "20px", border: "1px solid", display: "flex", flexDirection: "column", justifyContent: "space-between" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  levelTag: { backgroundColor: "#fef3c7", color: "#92400e", padding: "4px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold" },
  readBtn: { marginTop: "16px", padding: "10px 16px", border: "none", borderRadius: "10px", color: "#fff", fontWeight: "bold", cursor: "pointer", textAlign: "center" },
  quizWrapper: { maxWidth: "600px", margin: "30px auto", padding: "0 16px" },
  quizCard: { padding: "30px", borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" },
  quizHeader: { display: "flex", justifyContent: "space-between", fontSize: "14px", opacity: 0.8 },
  optionsGrid: { display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px" },
  optionBtn: { padding: "14px", borderRadius: "12px", border: "2px solid", cursor: "pointer", textAlign: "left", fontSize: "15px", fontWeight: "600" },
  explanationBox: { marginTop: "20px", padding: "16px", borderRadius: "12px", backgroundColor: "rgba(16, 185, 129, 0.1)", display: "flex", flexDirection: "column", gap: "12px" },
  nextBtn: { padding: "10px", border: "none", borderRadius: "8px", color: "#fff", fontWeight: "bold", cursor: "pointer" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000 },
  modalCard: { width: "90%", maxWidth: "650px", maxHeight: "85vh", overflowY: "auto", borderRadius: "24px", padding: "24px" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #cbd5e1", paddingBottom: "12px" },
  closeBtn: { border: "none", background: "none", fontSize: "18px", cursor: "pointer" },
  modalBody: { marginTop: "16px" },
  evidenceBox: { marginTop: "16px", padding: "12px", backgroundColor: "rgba(4, 120, 87, 0.1)", borderRadius: "10px" }
};
export default IslamicAcademyPage;