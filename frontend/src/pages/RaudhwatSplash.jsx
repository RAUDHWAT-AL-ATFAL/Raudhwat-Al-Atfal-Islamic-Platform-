
import React, { useState, useEffect } from "react";
import "./RaudhwatSplash.css"; // Inaunganisha CSS yetu safi

export default function SplashScreen({ onFinish }) {
  const [stage, setStage] = useState(1); // 1 = Logo, 2 = Banner na Watoto
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Hatua ya 1 inakaa kwa sekunde 3, kisha inahamia kwenye banner ya watoto
    const timerStage = setTimeout(() => {
      setStage(2);
    }, 3000);

    return () => clearTimeout(timerStage);
  }, []);

  useEffect(() => {
    if (stage === 2) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              if (onFinish) onFinish();
            }, 400);
            return 100;
          }
          return prev + 4;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [stage, onFinish]);

  return (
    <div className="splash-wrapper">
      {/* STAGE 1: LOGO INAYO-ANIKA KWANZA */}
      {stage === 1 && (
        <div className="splash-stage-one">
          <img
            src="/icon-512.png"
            alt="Raudhwat Logo"
            className="splash-logo-img"
          />
          <h2 className="splash-logo-title">Raudhwat Al-Atfal</h2>
        </div>
      )}

      {/* STAGE 2: BANNER YENYE WATOTO & PROGRESS BAR */}
      {stage === 2 && (
        <div className="splash-stage-two">
          <img
            src="/RaudhwatSplash.png"
            alt="Raudhwat Al-Atfal Splash"
            className="splash-banner-img"
          />

          <div className="splash-progress-card">
            <div className="splash-progress-track">
              <div
                className="splash-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="splash-progress-text">
              Inapakia Mfumo... {progress}%
            </div>
            <div className="splash-progress-subtext">
              Pamoja... Tunaweza!
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
