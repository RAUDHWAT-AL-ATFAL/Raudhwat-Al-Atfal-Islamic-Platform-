// src/data/quizData.js - HYBRID QUIZ ENGINE (ONLINE + CUSTOM LOCAL)

// 1. Maswali yako binafsi ya ndani (Unaweza kuongeza hapa muda wowote ukitaka)
export const MY_CUSTOM_QUESTIONS = [
  {
    id: "custom_1",
    category: "Qur'an",
    question: "Je, ni Surah gani ndefu zaidi katika Qur'an Tukufu?",
    options: ["Surah Al-Baqarah", "Surah Yasin", "Surah Al-Imran", "Surah Al-Kahf"],
    correctAnswer: 0
  },
  {
    id: "custom_2",
    category: "Fiqh",
    question: "Je, ni ipi Nguzo ya Kwanza miongoni mwa Nguzo za Uislamu?",
    options: ["Kuswali", "Kutoa Zaka", "Kutoa Shahada mbili", "Kufunga Ramadhani"],
    correctAnswer: 2
  },
  {
    id: "custom_3",
    category: "Seerah",
    question: "Mtume Muhammad (S.A.W) alizaliwa katika mji gani?",
    options: ["Madinah", "Makkah", "Taif", "Jerusalem"],
    correctAnswer: 1
  }
];

// 2. Injini ya kuvuta maswali mtandaoni (Online API Engine)
export const fetchDailyOnlineQuestions = async () => {
  try {
    // Tunavuta maswali kutoka kwenye API ya mtandaoni (Open Trivia Database - Islamic History/General)
    const response = await fetch("https://opentdb.com/api.php?amount=10&category=20&type=multiple");
    
    if (response.ok) {
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        
        // Format maswali kutoka API ya mtandaoni kuwa kwenye mfumo wetu
        const formattedApiQuestions = data.results.map((item, index) => {
          // Changanya jibu sahihi na majibu ya uongo (shuffled options)
          const options = [...item.incorrect_answers];
          const randomIndex = Math.floor(Math.random() * 4);
          options.splice(randomIndex, 0, item.correct_answer);

          return {
            id: `online_${index + 1}`,
            category: "Islamic History / Knowledge",
            question: decodeHTMLEntities(item.question),
            options: options.map(opt => decodeHTMLEntities(opt)),
            correctAnswer: randomIndex
          };
        });

        // Unganisha maswali ya mtandaoni na maswali yako ya ndani (Custom)
        return [...MY_CUSTOM_QUESTIONS, ...formattedApiQuestions];
      }
    }
  } catch (error) {
    console.warn("API mtandaoni haikupatika, inatumia maswali ya akiba:", error);
  }

  // Backup ikitokea intaneti hakuna
  return MY_CUSTOM_QUESTIONS;
};

// Mfumo wa kusafisha herufi za HTML kutoka API
function decodeHTMLEntities(text) {
  const textArea = document.createElement("textarea");
  textArea.innerHTML = text;
  return textArea.value;
}