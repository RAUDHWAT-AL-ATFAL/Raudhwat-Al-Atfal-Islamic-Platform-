// src/data/hadithData.js - AUTHENTIC HADITH DATA ENGINE

export const HADITH_CATEGORIES = [
  { id: "all", name: "Hadithi Zote", icon: "📚" },
  { id: "nawawi", name: "Hadithi 40 za An-Nawawi", icon: "⭐" },
  { id: "qudsi", name: "Hadithi Qudsi", icon: "👑" },
  { id: "bukhari", name: "Sahih al-Bukhari", icon: "📖" },
  { id: "muslim", name: "Sahih Muslim", icon: "🟢" }
];

// Alias kwa ajili ya usalama wa majina tofauti
export const HADITH_BOOKS = HADITH_CATEGORIES;

export const AUTHENTIC_HADITHS = [
  {
    id: 1,
    categoryId: "nawawi",
    bookId: "nawawi",
    number: 1,
    narrator: "Amirul Mu'minina Abu Hafs Umar ibn al-Khattab (R.A)",
    arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    translation: "Hakika matendo yote yanategemea nia, na kila mtu atalipwa kulingana na kile alichonuia.",
    explanation: "Hadithi hii ni msingi mkuu wa Uislamu. Kila amali njema lazima iwe na nia safi kwa ajili ya Allah pekee.",
    grade: "Sahih (Sahihi)",
    source: "Sahih al-Bukhari (1) & Sahih Muslim (1907)"
  },
  {
    id: 2,
    categoryId: "qudsi",
    bookId: "qudsi",
    number: 1,
    narrator: "Abu Dharr Al-Ghifari (R.A) kutoka kwa Mtume ﷺ kutoka kwa Allah ﷻ",
    arabic: "يَا عِبَادِي إِنِّي حَرَّمْتُ الظُّلْمَ عَلَى نَفْسِي وَجَعَلْتُهُ بَيْنَكُمْ مُحَرَّمًا فَلاَ تَظَالَمُوا",
    translation: "Enyi waja Wangu! Hakika Mimi nimejiharamishia dhuluma Nafsi Yangu, na nimeifanya kuwa haramu baina yenu, basi msidhulumiane.",
    explanation: "Allah ﷻ anatufundisha kuwa dhuluma ni haramu kwa viwango vyote na anawasihi waja wake kutendeana haki.",
    grade: "Sahih (Sahihi)",
    source: "Sahih Muslim (2577)"
  },
  {
    id: 3,
    categoryId: "nawawi",
    bookId: "nawawi",
    number: 2,
    narrator: "Umar ibn al-Khattab (R.A)",
    arabic: "قَالَ : فَأَخْبِرْنِي عَنِ الإِسْلاَمِ ، فَقَالَ رَسُولُ اللَّهِ ﷺ : الإِسْلاَمُ أَنْ تَشْهَدَ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ...",
    translation: "Malaika Jibril alimwuliza Mtume ﷺ kuhusu Uislamu, Imani, na Ihsan. Mtume ﷺ alieleza nguzo kuu za dini yetu.",
    explanation: "Hadithi hii inajulikana kama 'Hadith Jibril' na inakusanya misingi yote ya Elimu ya Dini.",
    grade: "Sahih (Sahihi)",
    source: "Sahih Muslim (8)"
  }
];