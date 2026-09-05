import { useEffect, useState } from "react";
import {
getDownloadedSurahs,
getOfflineSurah,
deleteOfflineSurah
} from "../../services/quranOfflineDB";

function QuranDownloads() {

const [downloads, setDownloads] = useState([]);
const [loading, setLoading] = useState(true);
const [deleting, setDeleting] = useState(false);

// ==========================================
// LOAD DOWNLOADED SURAHS
// ==========================================

const loadDownloads = async () => {

    try {

        setLoading(true);

        const chapterNumbers =
            await getDownloadedSurahs();

        const downloadedData = [];

        for (
            const chapterNumber
            of chapterNumbers
        ) {

            const surah =
                await getOfflineSurah(
                    chapterNumber
                );

            if (surah) {

                downloadedData.push(
                    surah
                );

            }

        }

        setDownloads(
            downloadedData
        );

    } catch (error) {

        console.error(
            "Load Downloads Error:",
            error
        );

    } finally {

        setLoading(false);

    }

};


// ==========================================
// INITIAL LOAD
// ==========================================

useEffect(() => {

    loadDownloads();

}, []);


// ==========================================
// DELETE ONE SURAH
// ==========================================

const handleDelete = async (
    chapterNumber
) => {

    const confirmDelete =
        window.confirm(
            `Una uhakika unataka kufuta Sura ${chapterNumber} kwenye Offline?`
        );

    if (!confirmDelete) {
        return;
    }


    try {

        setDeleting(true);

        await deleteOfflineSurah(
            chapterNumber
        );

        await loadDownloads();

    } catch (error) {

        console.error(
            "Delete Surah Error:",
            error
        );

        alert(
            "Imeshindikana kufuta Sura."
        );

    } finally {

        setDeleting(false);

    }

};


// ==========================================
// DELETE ALL
// ==========================================

const handleDeleteAll = async () => {

    if (
        downloads.length === 0
    ) {

        return;

    }


    const confirmDelete =
        window.confirm(
            "Una uhakika unataka kufuta Sura zote zilizopakuliwa?"
        );

    if (!confirmDelete) {
        return;
    }


    try {

        setDeleting(true);


        for (
            const surah
            of downloads
        ) {

            await deleteOfflineSurah(
                surah.chapterNumber
            );

        }


        await loadDownloads();

    } catch (error) {

        console.error(
            "Delete All Error:",
            error
        );

        alert(
            "Imeshindikana kufuta downloads zote."
        );

    } finally {

        setDeleting(false);

    }

};


// ==========================================
// LOADING
// ==========================================

if (loading) {

    return (

        <div
            style={{
                padding: "40px",
                textAlign: "center"
            }}
        >

            <h2>
                📥 Qur'an Downloads
            </h2>

            <p>
                Inapakia downloads...
            </p>

        </div>

    );

}


// ==========================================
// PAGE
// ==========================================

return (

    <div
        style={{
            maxWidth: "900px",
            margin: "auto",
            padding: "30px"
        }}
    >

        <header
            style={{
                textAlign: "center",
                marginBottom: "30px"
            }}
        >

            <h1>
                📥 Qur'an Downloads
            </h1>

            <p>
                Sura zilizohifadhiwa Offline
            </p>

            <h3>
                {downloads.length} / 114 Sura
            </h3>

        </header>


        {/* ==================================
            EMPTY STATE
        ================================== */}

        {downloads.length === 0 ? (

            <div
                style={{
                    textAlign: "center",
                    padding: "40px"
                }}
            >

                <h2>
                    📴 Hakuna Sura Offline
                </h2>

                <p>
                    Pakua Sura ili uweze
                    kuzisoma bila Internet.
                </p>

            </div>

        ) : (

            <>

                {/* ==================================
                    DOWNLOAD LIST
                ================================== */}

                <div>

                    {downloads.map(
                        (surah) => (

                            <div
                                key={
                                    surah.chapterNumber
                                }
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems:
                                        "center",
                                    padding: "18px",
                                    marginBottom:
                                        "12px",
                                    border:
                                        "1px solid #ddd",
                                    borderRadius:
                                        "12px"
                                }}
                            >

                                <div>

                                    <strong>

                                        {surah.chapterNumber}.
                                        {" "}

                                        {surah.nameArabic ||
                                            surah.arabicName ||
                                            surah.name ||
                                            "Sura"}

                                    </strong>

                                    <p
                                        style={{
                                            margin:
                                                "6px 0 0"
                                        }}
                                    >

                                        📴 Imehifadhiwa
                                        Offline

                                    </p>

                                </div>


                                <button
                                    onClick={() =>
                                        handleDelete(
                                            surah.chapterNumber
                                        )
                                    }
                                    disabled={
                                        deleting
                                    }
                                >

                                    🗑️ Futa

                                </button>

                            </div>

                        )
                    )}

                </div>


                {/* ==================================
                    DELETE ALL
                ================================== */}

                <div
                    style={{
                        textAlign: "center",
                        marginTop: "30px"
                    }}
                >

                    <button
                        onClick={
                            handleDeleteAll
                        }
                        disabled={
                            deleting
                        }
                    >

                        🗑️ Futa Downloads Zote

                    </button>

                </div>

            </>

        )}

    </div>

);

}

export default QuranDownloads;