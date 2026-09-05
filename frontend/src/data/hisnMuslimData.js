// src/data/hisnMuslimData.js - HISN MUSLIM DATA ENGINE

export const DUA_CATEGORIES = [
  { id: "all", name: "Dua Zote", icon: "🤲" },
  { id: "asubuhi-jioni", name: "Asubuhi na Jioni", icon: "🌅" },
  { id: "swala", name: "Swala na Twahara", icon: "🕌" },
  { id: "kazi-nyumbani", name: "Nyumbani na Safari", icon: "🏡" },
  { id: "shida-faraaja", name: "Shida na Huzuni", icon: "🛡️" }
];

export const HISN_MUSLIM_DUAS = [
  {
    id: 1,
    categoryId: "asubuhi-jioni",
    title: "Dua ya Kuamka Kutoka Usingizini",
    arabic: "الْحَمْدُ للّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    transliteration: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilaihin-nushur.",
    translation: "Sifa njema zote ni za Mwenyezi Mungu Aliyetufufua baada ya kutufisha, na Kwake Yeye ndio marejeo.",
    reference: "Sahih al-Bukhari (6312)",
    repeat: 1,
    audioUrl: "https://www.hisnmuslim.com/audio/ar/1.mp3"
  },
  {
    id: 2,
    categoryId: "asubuhi-jioni",
    title: "Dua ya Asubuhi (Adhkar As-Sabah)",
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ",
    transliteration: "Asbahna wa asbahal-mulku lillahi, walhamdu lillah.",
    translation: "Tumeamka na Ufalme wote umeamka ukiwa ni wa Allah, na sifa njema zote ni za Allah.",
    reference: "Sahih Muslim (2723)",
    repeat: 1,
    audioUrl: "https://www.hisnmuslim.com/audio/ar/75.mp3"
  },
  {
    id: 3,
    categoryId: "shida-faraaja",
    title: "Dua ya Kuondosha Shida na Huzuni (Dua ya Yunus A.S)",
    arabic: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
    transliteration: "La ilaha illa anta subhanaka inni kuntu minadh-dhalimin.",
    translation: "Hapana mola apasaye kuabudiwa kwa haki ila Wewe, Utukufu ni Wako, hakika mimi nilikuwa miongoni mwa wenye kudhulumu.",
    reference: "Surah Al-Anbiya (21:87) & Jami at-Tirmidhi (3505)",
    repeat: 3,
    audioUrl: "https://www.hisnmuslim.com/audio/ar/92.mp3"
  }
];