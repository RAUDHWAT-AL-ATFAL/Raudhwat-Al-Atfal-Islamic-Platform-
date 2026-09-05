import { useEffect, useState } from "react";

function PrayerTimes() {

const [location, setLocation] = useState(null);

const [prayerTimes, setPrayerTimes] =
    useState(null);

const [loading, setLoading] =
    useState(false);

const [error, setError] =
    useState("");


// ==========================================
// 📍 GET USER LOCATION
// ==========================================

const getLocation = () => {

    if (!navigator.geolocation) {

        setError(
            "Browser yako hai-support Location."
        );

        return;

    }


    setLoading(true);

    setError("");


    navigator.geolocation.getCurrentPosition(

        (position) => {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            setLocation({
                latitude,
                longitude
            });


            // Temporary test data
            // API tutaunganisha hatua inayofuata

            setPrayerTimes({

                Fajr: "--:--",

                Sunrise: "--:--",

                Dhuhr: "--:--",

                Asr: "--:--",

                Maghrib: "--:--",

                Isha: "--:--"

            });


            setLoading(false);

        },


        (err) => {

            console.error(
                "Prayer Location Error:",
                err
            );


            setError(
                "Imeshindikana kupata location. Ruhusu Location kwenye browser."
            );


            setLoading(false);

        },


        {

            enableHighAccuracy: true,

            timeout: 10000,

            maximumAge: 0

        }

    );

};


// ==========================================
// 🕌 PRAYER LIST
// ==========================================

const prayers = prayerTimes
    ? [

        {
            name: "Fajr",
            icon: "🌅",
            time: prayerTimes.Fajr
        },

        {
            name: "Sunrise",
            icon: "☀️",
            time: prayerTimes.Sunrise
        },

        {
            name: "Dhuhr",
            icon: "🕌",
            time: prayerTimes.Dhuhr
        },

        {
            name: "Asr",
            icon: "🌇",
            time: prayerTimes.Asr
        },

        {
            name: "Maghrib",
            icon: "🌆",
            time: prayerTimes.Maghrib
        },

        {
            name: "Isha",
            icon: "🌙",
            time: prayerTimes.Isha
        }

    ]
    : [];


// ==========================================
// 🖥️ PAGE
// ==========================================

return (

    <div
        style={{
            maxWidth: "700px",
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
                🕌 Prayer Times
            </h1>

            <p>
                Nyakati za Swala za leo
            </p>

        </header>


        {/* ==================================
            LOCATION
        ================================== */}

        <div
            style={{
                textAlign: "center",
                marginBottom: "25px"
            }}
        >

            <button
                onClick={getLocation}
                disabled={loading}
            >

                {loading
                    ? "⏳ Inatafuta Location..."
                    : "📍 Pata Location Yangu"}

            </button>

        </div>


        {/* ==================================
            ERROR
        ================================== */}

        {error && (

            <div
                style={{
                    padding: "15px",
                    marginBottom: "20px",
                    borderRadius: "10px",
                    background: "#ffecec"
                }}
            >

                ⚠️ {error}

            </div>

        )}


        {/* ==================================
            LOCATION INFO
        ================================== */}

        {location && (

            <div
                style={{
                    textAlign: "center",
                    marginBottom: "25px"
                }}
            >

                <p>
                    📍 Latitude:{" "}
                    {location.latitude}
                </p>

                <p>
                    📍 Longitude:{" "}
                    {location.longitude}
                </p>

            </div>

        )}


        {/* ==================================
            PRAYER TIMES
        ================================== */}

        {prayerTimes && (

            <div>

                {prayers.map(
                    (prayer) => (

                        <div
                            key={
                                prayer.name
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

                            <strong>

                                {prayer.icon}{" "}

                                {prayer.name}

                            </strong>


                            <strong>

                                {prayer.time}

                            </strong>

                        </div>

                    )
                )}

            </div>

        )}

    </div>

);

}

export default PrayerTimes;