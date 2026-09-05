// src/pages/AcademyQuiz.jsx
import React, { useState, useEffect } from "react";
import { fetchDailyOnlineQuestions } from "../data/quizData";

const AcademyQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Pakua maswali mtandaoni kiotomatiki
  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      const fetchedQuestions = await fetchDailyOnlineQuestions();
      setQuestions(fetchedQuestions.slice(0, 10)); // Chukua 10 pekee za siku ya leo
      setLoading(false);
    };

    loadQuestions();
  }, []);

  const currentQuestion = questions[currentIndex];

  const handleNextQuestion = async () => {
    let newScore = score;
    if (selectedOption === currentQuestion.correctAnswer) {
      newScore += 1;
      setScore(newScore);
    }

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
    } else {
      // Swali la mwisho!
      setSubmitting(true);
      await submitResultsToAdmin(newScore, questions.length);
      setSubmitting(false);
      setIsCompleted(true);
    }
  };

  // Tuma matokeo kwa Admin
  const submitResultsToAdmin = async (finalScore, total) => {
    const userSession = JSON.parse(localStorage.getItem("user_session") || "{}");
    
    const resultPayload = {
      userId: userSession.id || "guest_" + Date.now(),
      userName: userSession.name || "Mwanafunzi",
      score: finalScore,
      totalQuestions: total,
      percentage: Math.round((finalScore / total) * 100) + "%",
      date: new Date().toLocaleDateString("sw-TZ")
    };

    // Hifadhi kwenye local database ya Admin
    const adminLogs = JSON.parse(localStorage.getItem("admin_quiz_results") || "[]");
    adminLogs.push(resultPayload);
    localStorage.setItem("admin_quiz_results", JSON.stringify(adminLogs));
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px", fontSize: "16px", color: "#047857" }}>
        🌐 Injini inavuta Maswali Mapya ya Dini kutoka mtandaoni...
      </div>
    );
  }

  // RESULT PAGE
  if (isCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    const isPassed = percentage >= 70;

    return (
      <div style={styles.card}>
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: "50px" }}>{isPassed ? "🏆" : "📚"}</span>
          <h2 style={{ color: "#047857", margin: "10px 0" }}>
            {isPassed ? "MashaAllah! Allah Akuzidishie Elimu!" : "Jitahidi Zaidi na Zaidi!"}
          </h2>

          <div style={styles.scoreBadge}>
            <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>Alama Zako za Leo:</p>
            <h1 style={{ margin: "4px 0 0 0", color: isPassed ? "#047857" : "#b45309" }}>
              {score} / {questions.length} ({percentage}%)
            </h1>
          </div>

          <p style={{ fontSize: "13px", color: "#64748b", margin: "16px 0" }}>
            ✅ Matokeo yako yatumwa kwa Admin/Mwalimu kikamilifu.
          </p>

          <button onClick={() => window.location.reload()} style={styles.actionBtn}>
            🔄 Cheza Tena Maswali ya Leo
          </button>
        </div>
      </div>
    );
  }

  // QUIZ PAGE
  return (
    <div style={styles.card}>
      <div style={styles.quizHeader}>
        <span style={{ fontSize: "13px", color: "#64748b" }}>
          Swali la <strong>{currentIndex + 1}</strong> / {questions.length}
        </span>
        <span style={styles.categoryBadge}>{currentQuestion.category}</span>
      </div>

      <h3 style={styles.questionText}>{currentQuestion.question}</h3>

      <div style={styles.optionsContainer}>
        {currentQuestion.options.map((option, idx) => {
          const isSelected = selectedOption === idx;
          return (
            <button
              key={idx}
              onClick={() => setSelectedOption(idx)}
              style={{
                ...styles.optionBtn,
                backgroundColor: isSelected ? "#047857" : "#f8fafc",
                color: isSelected ? "#ffffff" : "#0f172a",
                borderColor: isSelected ? "#047857" : "#cbd5e1"
              }}
            >
              <strong>{String.fromCharCode(65 + idx)}.</strong> {option}
            </button>
          );
        })}
      </div>

      <button
        disabled={selectedOption === null || submitting}
        onClick={handleNextQuestion}
        style={{
          ...styles.nextBtn,
          opacity: selectedOption === null || submitting ? 0.5 : 1,
          cursor: selectedOption === null ? "not-allowed" : "pointer"
        }}
      >
        {submitting
          ? "⏳ Inatuma..."
          : currentIndex + 1 === questions.length
          ? "✅ Submit Majibu Yote"
          : "Swali Linalofuata ➡️"}
      </button>
    </div>
  );
};

const styles = {
  card: { backgroundColor: "#ffffff", borderRadius: "20px", padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", maxWidth: "550px", margin: "20px auto", border: "1px solid #e2e8f0" },
  quizHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  categoryBadge: { backgroundColor: "#fef3c7", color: "#b45309", padding: "4px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: "bold" },
  questionText: { fontSize: "17px", color: "#0f172a", marginBottom: "20px", lineHeight: "1.5" },
  optionsContainer: { display: "flex", flexDirection: "column", gap: "10px" },
  optionBtn: { display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", borderRadius: "12px", border: "1px solid", fontSize: "14px", textAlign: "left", cursor: "pointer" },
  nextBtn: { width: "100%", marginTop: "20px", padding: "14px", backgroundColor: "#047857", color: "#ffffff", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "bold" },
  scoreBadge: { backgroundColor: "#f0fdf4", padding: "16px", borderRadius: "16px", margin: "16px 0", border: "1px solid #bbf7d0" },
  actionBtn: { padding: "12px 20px", backgroundColor: "#b45309", color: "#ffffff", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }
};

export default AcademyQuiz;