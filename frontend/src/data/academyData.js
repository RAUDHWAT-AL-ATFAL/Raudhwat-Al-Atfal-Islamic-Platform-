// src/data/academyData.js - RAUDHWAT AL-ATFAL ISLAMIC ACADEMY DATA ENGINE

export const ACADEMY_SUBJECTS = [
  { id: "all", name: "Masomo Yote", icon: "📚" },
  { id: "fiqh", name: "Fiqh & Ibada", icon: "🕌" },
  { id: "aqeedah", name: "Aqeedah & Tawheed", icon: "☝️" },
  { id: "seerah", name: "Seerah & Historia", icon: "📜" },
  { id: "quizzes", name: "Chemsha Bongo (Quizzes)", icon: "🎯" }
];

export const LESSONS_DATA = [
  {
    id: 1,
    subjectId: "fiqh",
    title: "Nguzo za Uislamu (The 5 Pillars of Islam)",
    level: "Kiwango cha Kwanza (Beginner)",
    readTime: "Dk 3 za Kusoma",
    summary: "Jifunze nguzo 5 kuu zinazojenga na kuthibitisha Uislamu wa Muislamu yeyote.",
    content: [
      "1. **Shahada (Kushuhudia):** Kuthibitisha kwa ulimi na moyo kuwa hakuna mola anayestahiki kuabudiwa kwa haki ila Allah, na Muhammad ﷺ ni Mtume Wake.",
      "2. **Kusimamisha Swala:** Kutekeleza Swala 5 za faradhi kila siku kwa nyakati zake zilizowekwa.",
      "3. **Kutoa Zaka:** Kutoa sehemu ya mali kwa masikini na wenye haja mara moja kwa mwaka iwapo mali imefikia kiwango (Nisab).",
      "4. **Kufunga Mwezi wa Ramadhani:** Kujizuia na kula, kunywa na matamanio kuanzia alajiri hadi magharibi mwezi wote wa Ramadhani.",
      "5. **Kuhiji Nyumba ya Allah (Al-Hijja):** Kwenda Makkah kutekeleza Hijja mara moja maishani kwa mwenye uwezo wa mali na afya."
    ],
    evidence: "Sahih al-Bukhari (8) & Sahih Muslim (16) - Hadithi ya Ibn Umar (R.A)"
  },
  {
    id: 2,
    subjectId: "fiqh",
    title: "Masharti na Njia Sahihi ya Kutawadha (Wudhu)",
    level: "Kiwango cha Kwanza (Beginner)",
    readTime: "Dk 4 za Kusoma",
    summary: "Twahara ndio ufunguo wa Swala. Jifunze hatua kwa hatua jinsi ya kutawadha kulingana na Sunnah.",
    content: [
      "1. **Nia na Bismillah:** Kunuia moyoni na kusema 'Bismillah' kabla ya kuanza.",
      "2. **Kuosha Kitanga cha Mikono:** Kuosha mikono mara 3 hadi kwenye vifundo.",
      "3. **Kusukutua na Kustanshaq:** Kusukutua maji mdomoni na kuvuta maji puani mara 3.",
      "4. **Kuosha Uso:** Kuosha uso wote kutoka utosi wa nywele hadi chini ya kidevu mara 3.",
      "5. **Kuosha Mikono Hadi Kwenye Viko:** Kuanza mkono wa kulia kisha wa kushoto mara 3.",
      "6. **Kupaka Kichwa na Masikio:** Kupaka maji kichwani na masikioni mara 1.",
      "7. **Kuosha Miguu:** Kuosha mguu wa kulia kisha wa kushoto hadi kwenye vifundo vya miguu mara 3."
    ],
    evidence: "Surah Al-Ma'idah (5:6) & Sahih Muslim (226)"
  },
  {
    id: 3,
    subjectId: "aqeedah",
    title: "Nguzo 6 za Imani (Pillars of Iman)",
    level: "Kiwango cha Kwanza (Beginner)",
    readTime: "Dk 4 za Kusoma",
    summary: "Imani thabiti ya Muislamu inajengwa juu ya nguzo sita kuu zilizotajwa kwenye Hadith Jibril.",
    content: [
      "1. **Kumuamini Allah:** Kuamini kuwa Yeye ndiye Muumba wa kila kitu na hana mshirika.",
      "2. **Kuaamini Malaika Wake:** Kuamini viumbe wa nuru walioumbwa na Allah kama Jibril, Mikail, n.k.",
      "3. **Kuaamini Vitabu Vyake:** Kuamini vitabu vilivyoteremshwa (Tawrat, Zabur, Injil, na Qur'an Tukufu).",
      "4. **Kuaamini Mitume Wake:** Kuamini Mitume yote kuanzia Adam (A.S) hadi wa mwisho Muhammad ﷺ.",
      "5. **Kuaamini Siku ya Mwisho (Qiyama):** Kuamini kufufuliwa, hesabu, na malipo ya Pepo au Moto.",
      "6. **Kuaamini Qadara (Kipimo cha Kheri na Shar):** Kuamini kuwa kila linalotokea limetoka kwa uamuzi wa Allah."
    ],
    evidence: "Sahih Muslim (8) - Hadithi mashuhuri ya Malaika Jibril (A.S)"
  },
  {
    id: 4,
    subjectId: "seerah",
    title: "Kuzaliwa na Utoto wa Mtume Muhammad ﷺ",
    level: "Kiwango cha Kwanza (Beginner)",
    readTime: "Dk 5 za Kusoma",
    summary: "Jifunze kisa cha kuzaliwa kwa Bwana wa Viumbe ﷺ na jinsi alivyokua akiwa mwaminifu (Al-Ameen).",
    content: [
      "• **Kuzaliwa:** Mtume ﷺ alizaliwa Makkah katika Mwaka wa Tembo (Year of the Elephant) mwezi wa Rabi' al-Awwal.",
      "• **Wazazi Wake:** Baba yake alikuwa Abdullah ibn Abdil-Muttalib (alifariki kabla hajazaliwa), na Mama yake alikuwa Aminah bint Wahb.",
      "• **Mama wa Kunyonyesha:** Halimah As-Sa'diyyah alimnyonyesha na kumlea jangwani ambapo baraka zilimwagika nyumbani kwake.",
      "• **Tabia Yake:** Hata kabla ya kupewa Utume, watu wa Makkah walimpa jina la **Al-Ameen** (Mwaminifu) na **As-Sadiq** (Mkweli)."
    ],
    evidence: "Ar-Raheeq Al-Makhtum (Seerah Nabawiyyah ya Safiur-Rahman Al-Mubarakpuri)"
  }
];

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Je, ni ipi Nguzo ya Kwanza miongoni mwa Nguzo 5 za Uislamu?",
    options: ["Kusimamisha Swala", "Kushuhudia (Shahada)", "Kutoa Zaka", "Kufunga Ramadhani"],
    correctAnswer: 1,
    explanation: "Shahada ndio ufunguo na nguzo ya kwanza kabisa inayomuingiza mtu katika Uislamu."
  },
  {
    id: 2,
    question: "Mtume Muhammad ﷺ alizaliwa katika mji gani?",
    options: ["Madinah", "Jerusalem (Quds)", "Makkah", "Taif"],
    correctAnswer: 2,
    explanation: "Mtume ﷺ alizaliwa katika mji takatifu wa Makkah Al-Mukarramah."
  },
  {
    id: 3,
    question: "Ni Kitabu gani cha Mwenyezi Mungu kilichoteremshwa kwa Mtume Isa (A.S)?",
    options: ["Tawrat", "Zabur", "Qur'an Tukufu", "Injil"],
    correctAnswer: 3,
    explanation: "Injil iliteremshwa kwa Mtume Isa (A.S), wakati Zabur kwa Dawud (A.S) na Tawrat kwa Musa (A.S)."
  },
  {
    id: 4,
    question: "Swala za Faradhi zinazotakiwa kutekelezwa kwa siku ni ngapi?",
    options: ["3", "5", "7", "4"],
    correctAnswer: 1,
    explanation: "Swala za Faradhi ni 5: Alfajiri, Dhuhuri, Lasiri, Magharibi, na Isha."
  }
];