const fs = require("fs");
const path = require("path");

// ==========================================
// QUR'AN OFFLINE STORAGE DIRECTORY
// ==========================================

const offlineDirectory =
path.join(
__dirname,
"../offline/quran"
);

// ==========================================
// CREATE DIRECTORY IF NOT EXISTS
// ==========================================

const ensureOfflineDirectory = () => {

if (
    !fs.existsSync(
        offlineDirectory
    )
) {

    fs.mkdirSync(
        offlineDirectory,
        {
            recursive: true
        }
    );

}

};

// ==========================================
// CREATE SURAH OFFLINE FILE
// ==========================================

const saveSurahOffline = async ({
chapterNumber,
surah,
verses,
audio
}) => {

try {

    ensureOfflineDirectory();


    const offlineData = {

        downloadedAt:
            new Date().toISOString(),

        chapterNumber,

        surah,

        verses,

        audio

    };


    const fileName =
        `surah-${chapterNumber}.json`;


    const filePath =
        path.join(
            offlineDirectory,
            fileName
        );


    fs.writeFileSync(

        filePath,

        JSON.stringify(
            offlineData,
            null,
            2
        ),

        "utf8"

    );


    return {

        success: true,

        fileName,

        filePath,

        message:
            "Sura imehifadhiwa kwa matumizi ya Offline"

    };


} catch (error) {

    console.error(
        "Save Offline Surah Error:",
        error.message
    );

    throw error;

}

};

// ==========================================
// CHECK IF SURAH IS DOWNLOADED
// ==========================================

const isSurahDownloaded = (
chapterNumber
) => {

ensureOfflineDirectory();


const fileName =
    `surah-${chapterNumber}.json`;


const filePath =
    path.join(
        offlineDirectory,
        fileName
    );


return fs.existsSync(
    filePath
);

};

// ==========================================
// GET OFFLINE SURAH
// ==========================================

const getOfflineSurah = (
chapterNumber
) => {

ensureOfflineDirectory();


const fileName =
    `surah-${chapterNumber}.json`;


const filePath =
    path.join(
        offlineDirectory,
        fileName
    );


if (
    !fs.existsSync(
        filePath
    )
) {

    return null;

}


const data =
    fs.readFileSync(
        filePath,
        "utf8"
    );


return JSON.parse(
    data
);

};

// ==========================================
// DELETE OFFLINE SURAH
// ==========================================

const deleteOfflineSurah = (
chapterNumber
) => {

ensureOfflineDirectory();


const fileName =
    `surah-${chapterNumber}.json`;


const filePath =
    path.join(
        offlineDirectory,
        fileName
    );


if (
    fs.existsSync(
        filePath
    )
) {

    fs.unlinkSync(
        filePath
    );

    return true;

}


return false;

};

// ==========================================
// GET DOWNLOADED SURAHS
// ==========================================

const getDownloadedSurahs = () => {

ensureOfflineDirectory();


const files =
    fs.readdirSync(
        offlineDirectory
    );


return files

    .filter(
        file =>
            file.startsWith(
                "surah-"
            ) &&
            file.endsWith(
                ".json"
            )
    )

    .map(
        file =>
            Number(
                file
                    .replace(
                        "surah-",
                        ""
                    )
                    .replace(
                        ".json",
                        ""
                    )
            )
    )

    .sort(
        (a, b) =>
            a - b
    );

};

// ==========================================
// EXPORT
// ==========================================

module.exports = {

saveSurahOffline,

isSurahDownloaded,

getOfflineSurah,

deleteOfflineSurah,

getDownloadedSurahs

};