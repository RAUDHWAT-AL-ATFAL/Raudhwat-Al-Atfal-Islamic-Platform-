import React, { useState, useEffect } from "react";

export default function AIAssistancepage({ currentUser }) {
  // --- STATES ---
  const [activeTab, setActiveTab] = useState("chat"); // 'chat', 'diagrams', 'prayer', 'zakat', 'quiz'
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\n\nAssalamu Alaykum ${currentUser?.name || ""}! Mimi ni Msaidizi wa Raudhwat Al-Atfal. Nikusaidie nini leo kuhusu Qur'ani Tukufu, Hadithi, au Mfumo wetu?`
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // States za Quiz
  const [quizList, setQuizList] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Maswali ya Mfano (Mock Questions kwa ajili ya Quiz Engine)
  const defaultQuestions = [
    {
      id: 1,
      question: "Nguzo kuu za Uislamu ni ngapi?",
      options: { A: "3", B: "5", C: "7", D: "6" },
      answer: "B",
      explanation: "Nguzo za Uislamu ni 5: Shahada, Swala, Zakat, Swaum, na Hajj (Sahih Bukhari & Muslim)."
    },
    {
      id: 2,
      question: "Nani ni Mtume wa mwisho kutumwa na Mwenyezi Mungu?",
      options: { A: "Nabii Musa A.S", B: "Nabii Isa A.S", C: "Mtume Muhammad S.A.W", D: "Nabii Ibrahim A.S" },
      answer: "C",
      explanation: "Mtume Muhammad (ﷺ) ndiye Khatam an-Nabiyyin (Mwisho wa Mitume) - Surah Al-Ahzab: 40."
    },
    {
      id: 3,
      question: "Surah gani ndiyo ndefu kuliko zote katika Qur'ani Tukufu?",
      options: { A: "Surah Al-Fatiha", B: "Surah Yasin", C: "Surah Al-Baqarah", D: "Surah Al-Ikhlas" },
      answer: "C",
      explanation: "Surah Al-Baqarah ina aya 286 na ndiyo surah ndefu zaidi katika Qur'ani."
    }
  ];

  // --- HANDLERS ---
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    const query = input;
    setInput("");
    setLoading(true);

    try {
      // Inapiga API ya Backend
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, userId: currentUser?.id })
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: data.reply || "MashaAllah, asante kwa swali yako!" }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Jazakallahu Khair! (Mtandao uko offline, mfumo unahifadhi maswali yako)." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Quiz Logic
  const handleStartQuiz = () => {
    setQuizList(defaultQuestions);
    setCurrentQIndex(0);
    setQuizScore(0);
    setQuizFinished(false);
    setAnswerSubmitted(false);
    setSelectedOption("");
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption) return;
    const currentQ = quizList[currentQIndex];
    const chosenLetter = selectedOption.split(".")[0].trim();
    
    setAnswerSubmitted(true);
    if (chosenLetter === currentQ.answer) {
      setQuizScore((prev) => prev + 1);
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  const handleNextQuestion = () => {
    setAnswerSubmitted(false);
    setSelectedOption("");
    if (currentQIndex + 1 < quizList.length) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "80px auto 40px auto", padding: "20px", fontFamily: "sans-serif" }}>
      {/* HEADER CARD */}
      <div style={{
        background: "linear-gradient(135deg, #064E3B 0%, #047857 50%, #065F46 100%)",
        color: "white",
        padding: "25px",
        borderRadius: "16px",
        textAlign: "center",
        border: "2px solid #F59E0B",
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)"
      }}>
        <div style={{ fontSize: "22px", color: "#FBBF24", fontWeight: "bold", marginBottom: "6px" }}>
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </div>
        <h2 style={{ margin: "5px 0", fontSize: "24px" }}>🕌 MSAIDIZI WA RAUDHWAT AL ATFAL</h2>
        <p style={{ fontSize: "13px", opacity: 0.9 }}>"وَقُل رَّبِّ زِدْنِي عِلْمًا" — "Na sema: Mola wangu! Niongezee elimu."</p>
      </div>

      {/* NAVIGATION TABS */}
      <div style={{ display: "flex", gap: "8px", overflowX: "auto", margin: "20px 0", paddingBottom: "5px" }}>
        {[
          { id: "chat", label: "💬 AI Chat Assistant" },
          { id: "quiz", label: "🎴 Maswali ya Dini (Quiz)" },
          { id: "prayer", label: "🕌 Swala & Qibla" },
          { id: "zakat", label: "🧮 Zakat & Mirathi" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border: "1px solid #0f766e",
              backgroundColor: activeTab === tab.id ? "#0f766e" : "#ffffff",
              color: activeTab === tab.id ? "#ffffff" : "#0f766e",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "13px",
              whiteSpace: "nowrap"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: CHAT ASSISTANT */}
      {activeTab === "chat" && (
        <div>
          <div style={{
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            height: "420px",
            overflowY: "auto",
            padding: "16px",
            backgroundColor: "#f9fafb"
          }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ textAlign: msg.sender === "user" ? "right" : "left", marginBottom: "14px" }}>
                <div style={{
                  display: "inline-block",
                  padding: "10px 16px",
                  borderRadius: msg.sender === "user" ? "18px 18px 2px 18px" : "18px 18px 18px 2px",
                  backgroundColor: msg.sender === "user" ? "#0f766e" : "#ffffff",
                  color: msg.sender === "user" ? "#ffffff" : "#1f2937",
                  border: msg.sender === "user" ? "none" : "1px solid #e5e7eb",
                  fontSize: "14px",
                  maxWidth: "80%",
                  whiteSpace: "pre-line"
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && <div style={{ color: "#0f766e", fontSize: "13px" }}><em>Msaidizi anafikiria...</em></div>}
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Uliza swali la Dini au Quran..."
              style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db" }}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              style={{ backgroundColor: "#0f766e", color: "white", border: "none", padding: "12px 24px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
            >
              Tuma
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: QUIZ & FLASHCARDS ENGINE */}
      {activeTab === "quiz" && (
        <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <button
              onClick={handleStartQuiz}
              style={{ backgroundColor: "#065f46", color: "white", padding: "12px 24px", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
            >
              🔄 Anzisha / Tengeneza Maswali 10 Mapya
            </button>
          </div>

          {quizList.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666" }}>Tafadhali bonyeza kitufe hapo juu ili kuanza chemsha bongo!</p>
          ) : quizFinished ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <h3>🌟 Tathmini Imekamilika! 🌟</h3>
              <p style={{ fontSize: "18px", fontWeight: "bold" }}>Umepata: {quizScore} kati ya {quizList.length}</p>
              <button onClick={handleStartQuiz} style={{ backgroundColor: "#0f766e", color: "white", padding: "10px 20px", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                🔁 Rudia Yale Yale Maswali
              </button>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: "12px", color: "#666" }}>Swali la {currentQIndex + 1} kati ya {quizList.length}</p>
              <h3 style={{ color: "#0f766e" }}>❓ {quizList[currentQIndex].question}</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", margin: "15px 0" }}>
                {Object.entries(quizList[currentQIndex].options).map(([key, val]) => (
                  <label key={key} style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "6px", cursor: "pointer", backgroundColor: selectedOption.startsWith(key) ? "#f0fdf4" : "#fff" }}>
                    <input
                      type="radio"
                      name="quiz_option"
                      value={`${key}. ${val}`}
                      checked={selectedOption.startsWith(key)}
                      onChange={(e) => setSelectedOption(e.target.value)}
                      disabled={answerSubmitted}
                      style={{ marginRight: "10px" }}
                    />
                    <strong>{key}.</strong> {val}
                  </label>
                ))}
              </div>

              {!answerSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  style={{ backgroundColor: "#0f766e", color: "white", padding: "10px 20px", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
                >
                  Wasilisha Jibu
                </button>
              ) : (
                <div style={{ marginTop: "15px" }}>
                  <div style={{ padding: "12px", borderRadius: "6px", backgroundColor: isCorrect ? "#d1fae5" : "#fee2e2", color: isCorrect ? "#065f46" : "#991b1b", marginBottom: "10px" }}>
                    {isCorrect ? "✨ MashaAllah! Umepatia Vizuri Sana!" : `SubhanaAllah! Jibu Sahihi Lilikuwa: ${quizList[currentQIndex].answer}`}
                  </div>
                  <p style={{ fontSize: "13px", color: "#4b5563" }}>📖 {quizList[currentQIndex].explanation}</p>
                  <button
                    onClick={handleNextQuestion}
                    style={{ backgroundColor: "#065f46", color: "white", padding: "10px 20px", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", marginTop: "10px" }}
                  >
                    ➡️ Swali Linalofuata
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SWALA & QIBLA */}
      {activeTab === "prayer" && (
        <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e5e7eb", textAlign: "center" }}>
          <h3 style={{ color: "#0f766e" }}>🕌 Nyakati za Swala & Kiashiria cha Qibla</h3>
          <p>Mji: Dar es Salaam, Tanzania</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px", margin: "20px 0" }}>
            {["Fajr: 05:00", "Dhuhr: 12:30", "Asr: 15:45", "Maghrib: 18:25", "Isha: 19:35"].map((time, i) => (
              <div key={i} style={{ padding: "10px", backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", fontWeight: "bold", color: "#065f46" }}>
                {time}
              </div>
            ))}
          </div>
          <p style={{ fontWeight: "bold", color: "#047857" }}>🕋 Uelekeo wa Ka'bah: 255° SW</p>
        </div>
      )}

      {/* TAB 4: ZAKAT & MIRATHI */}
      {activeTab === "zakat" && (
        <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
          <h3 style={{ color: "#0f766e" }}>🧮 Kikokotoo cha Zakat</h3>
          <p style={{ fontSize: "14px", color: "#666" }}>Kiwango cha Nisab ya Zakat ni 2.5% ya mali au akiba iliyofikisha mwaka mmoja.</p>
          <div style={{ padding: "15px", backgroundColor: "#f9fafb", borderRadius: "8px" }}>
            <p><strong>Mfano:</strong> Akiba ya TZS 1,000,000 $\rightarrow$ Zakat yako ni <strong>TZS 25,000</strong></p>
          </div>
        </div>
      )}
    </div>
  );
}
