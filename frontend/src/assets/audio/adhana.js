import { useEffect, useRef, useState } from "react";
import adhanAudio from "../../assets/audio/adhan.mp3";

function AutomaticAdhan({ prayerTimes }) {

const [enabled, setEnabled] =
    useState(false);

const [currentPrayer, setCurrentPrayer] =
    useState(null);

const [status, setStatus] =
    useState("Automatic Adhan imezimwa");

const audioRef =
    useRef(null);

const playedTodayRef =
    useRef({});


// ==========================================
// 🕌 PRAYER NAMES
// ==========================================

const prayers = [
    {
        name: "Fajr",
        key: "Fajr"
    },
    {
        name: "Dhuhr",
        key: "Dhuhr"
    },
    {
        name: "Asr",
        key: "Asr"
    },
    {
        name: "Maghrib",
        key: "Maghrib"
    },
    {
        name: "Isha",
        key: "Isha"
    }
];


// ==========================================
// 🔊 CREATE AUDIO
// ==========================================

useEffect(() => {

    audioRef.current =
        new Audio(adhanAudio);

    audioRef.current.preload =
        "auto";


    return () => {

        if (audioRef.current) {

            audioRef.current.pause();

            audioRef.current =
                null;

        }

    };

}, []);


// ==========================================
// 🧹 RESET DAILY RECORD
// ==========================================

useEffect(() => {

    const today =
        new Date().toDateString();

    const savedDate =
        localStorage.getItem(
            "adhanPlayedDate"
        );


    if (savedDate !== today) {

        localStorage.setItem(
            "adhanPlayedDate",
            today
        );

        localStorage.removeItem(
            "adhanPlayed"
        );

        playedTodayRef.current =
            {};

    }

}, []);


// ==========================================
// 🔊 PLAY ADHAN
// ==========================================

const playAdhan = (
    prayerName
) => {

    if (!audioRef.current) {

        return;

    }


    try {

        audioRef.current.currentTime =
            0;

        audioRef.current.play();


        setCurrentPrayer(
            prayerName
        );

        setStatus(
            🔊 Adhan ya ${prayerName} inachezwa
        );


    } catch (error) {

        console.error(
            "Adhan Audio Error:",
            error
        );

        setStatus(
            "⚠️ Browser imezuia Audio. Bonyeza Enable Adhan kwanza."
        );

    }

};


// ==========================================
// ⏰ CHECK PRAYER TIME
// ==========================================

useEffect(() => {

    if (
        !enabled ||
        !prayerTimes
    ) {

        return;

    }


    const checkPrayerTime = () => {

        const now =
            new Date();


        const currentHour =
            now.getHours();

        const currentMinute =
            now.getMinutes();


        const currentTime =
            ${String(currentHour).padStart(2, "0")}:${String(currentMinute).padStart(2, "0")};


        prayers.forEach(
            (prayer) => {

                const prayerTime =
                    prayerTimes[
                        prayer.key
                    ];


                if (!prayerTime) {

                    return;

                }


                const cleanTime =
                    String(
                        prayerTime
                    ).substring(
                        0,
                        5
                    );


                if (
                    cleanTime ===
                    currentTime
                ) {

                    const today =
                        new Date()
                            .toDateString();


                    const uniqueKey =
                        ${today}-${prayer.key};


                    if (
                        !playedTodayRef
                            .current[
                                uniqueKey
                            ]
                    ) {

                        playedTodayRef
                            .current[
                                uniqueKey
                            ] = true;


                        playAdhan(
                            prayer.name
                        );

                    }

                }

            }
        );

    };


    // Check immediately

    checkPrayerTime();


    // Check every 10 seconds

    const interval =
        setInterval(
            checkPrayerTime,
            10000
        );


    return () => {

        clearInterval(
            interval
        );

    };

}, [
    enabled,
    prayerTimes
]);


// ==========================================
// 🔘 ENABLE / DISABLE
// ==========================================

const toggleAdhan = async () => {

    if (!enabled) {

        try {

            if (
                audioRef.current
            ) {

                audioRef.current.volume =
                    0;

                await audioRef.current
                    .play();

                audioRef.current.pause();

                audioRef.current.currentTime =
                    0;

                audioRef.current.volume =
                    1;

            }


            setEnabled(true);

            setStatus(
                "🔊 Automatic Adhan imewashwa"
            );


        } catch (error) {

            console.error(
                "Enable Adhan Error:",
                error
            );

            setStatus(
                "⚠️ Ruhusu Audio kwa kubonyeza Enable Adhan."
            );

        }

    } else {

        if (
            audioRef.current
        ) {

            audioRef.current.pause();

            audioRef.current.currentTime =
                0;

        }


        setEnabled(false);

        setCurrentPrayer(null);

        setStatus(
            "🔇 Automatic Adhan imezimwa"
        );

    }

};


// ==========================================
// 🖥️ UI
// ==========================================

return (

    <div
        style={{
            maxWidth: "700px",
            margin: "30px auto",
            padding: "25px",
            textAlign: "center",
            border: "1px solid #ddd",
            borderRadius: "15px"
        }}
    >

        <h2>
            🔊 Automatic Adhan
        </h2>


        <p>
            Mfumo utapiga Adhan
            moja kwa moja wakati wa Swala.
        </p>


        {/* ==================================
            STATUS
        ================================== */}

        <p
            style={{
                fontWeight: "bold",
                marginTop: "20px"
            }}
        >

            {status}

        </p>


        {/* ==================================
            CURRENT PRAYER
        ================================== */}

        {currentPrayer && (

            <h3>

                🕌 {currentPrayer}

            </h3>

        )}


        {/* ==================================
            ENABLE BUTTON
        ================================== */}

        <button
            onClick={toggleAdhan}
            style={{
                padding: "12px 22px",
                borderRadius: "10px",
                cursor: "pointer"
            }}
        >

            {enabled
                ? "🔇 Zima Automatic Adhan"
                : "🔊 Washa Automatic Adhan"}

        </button>


        {/* ==================================
            INFORMATION
        ================================== */}

        <p
            style={{
                marginTop: "20px",
                fontSize: "14px"
            }}
        >

            ⚠️ Tafadhali washa Automatic Adhan
            kwanza ili browser iruhusu audio.

        </p>

    </div>

);

}

export default AutomaticAdhan;