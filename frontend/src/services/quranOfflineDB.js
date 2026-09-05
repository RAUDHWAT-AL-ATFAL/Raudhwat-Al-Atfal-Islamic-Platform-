/*
📖 QUR'AN OFFLINE DATABASE
Hii inatumia IndexedDB ya browser.

Inahifadhi:
- Taarifa za Sura
- Arabic
- Kiswahili
- Tafsir
- Audio information
- Tarehe ya download
==========================================
*/

const DB_NAME = "RaudhwatAlAtfalQuranDB";
const DB_VERSION = 1;
const STORE_NAME = "surahs";

// ==========================================
// OPEN DATABASE
// ==========================================

const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    // ==================================
    // CREATE DATABASE / STORE
    // ==================================
    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "chapterNumber"
        });

        store.createIndex("downloadedAt", "downloadedAt", {
          unique: false
        });
      }
    };

    // ==================================
    // DATABASE OPENED
    // ==================================
    request.onsuccess = () => {
      resolve(request.result);
    };

    // ==================================
    // DATABASE ERROR
    // ==================================
    request.onerror = () => {
      reject(request.error);
    };
  });
};

// ==========================================
// 📥 SAVE SURAH
// ==========================================

export const saveSurahOffline = async (surahData) => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const data = {
      ...surahData,
      downloadedAt: new Date().toISOString()
    };

    const request = store.put(data);

    request.onsuccess = () => {
      resolve({
        success: true,
        data
      });
    };

    request.onerror = () => {
      reject(request.error);
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// ==========================================
// 📖 GET ONE OFFLINE SURAH
// ==========================================

export const getOfflineSurah = async (chapterNumber) => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);

    const request = store.get(Number(chapterNumber));

    request.onsuccess = () => {
      resolve(request.result || null);
    };

    request.onerror = () => {
      reject(request.error);
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// ==========================================
// 🔍 CHECK IF SURAH IS DOWNLOADED
// ==========================================

export const isSurahDownloaded = async (chapterNumber) => {
  const surah = await getOfflineSurah(chapterNumber);
  return !!surah;
};

// ==========================================
// 📚 GET ALL DOWNLOADED SURAHS
// ==========================================

export const getAllOfflineSurahs = async () => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);

    const request = store.getAll();

    request.onsuccess = () => {
      const surahs = request.result || [];

      surahs.sort(
        (a, b) => Number(a.chapterNumber) - Number(b.chapterNumber)
      );

      resolve(surahs);
    };

    request.onerror = () => {
      reject(request.error);
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// ==========================================
// 🔗 ALIAS FOR GET ALL DOWNLOADED SURAHS
// (Hii inazuia error kule kwenye QuranDownloads.jsx)
// ==========================================
export const getDownloadedSurahs = getAllOfflineSurahs;

// ==========================================
// 🗑️ DELETE ONE OFFLINE SURAH
// ==========================================

export const deleteOfflineSurah = async (chapterNumber) => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const request = store.delete(Number(chapterNumber));

    request.onsuccess = () => {
      resolve({
        success: true,
        chapterNumber: Number(chapterNumber)
      });
    };

    request.onerror = () => {
      reject(request.error);
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// ==========================================
// 🧹 DELETE ALL OFFLINE SURAHS
// ==========================================

export const clearAllOfflineSurahs = async () => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const request = store.clear();

    request.onsuccess = () => {
      resolve({
        success: true
      });
    };

    request.onerror = () => {
      reject(request.error);
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// ==========================================
// 📊 GET DOWNLOAD COUNT
// ==========================================

export const getOfflineSurahCount = async () => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);

    const request = store.count();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };

    transaction.oncomplete = () => {
      db.close();
    };
  });
};