import React from "react";

function formatTime(timestamp) {
  if (!timestamp) return "--:--";
  return new Date(timestamp * 1000).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getSunProgress(sunrise, sunset) {
  if (!sunrise || !sunset) return 50;

  const now = Date.now() / 1000;

  if (now <= sunrise) return 0;
  if (now >= sunset) return 100;

  return ((now - sunrise) / (sunset - sunrise)) * 100;
}

function SunriseWidget({ current }) {
  const sunrise = current?.sys?.sunrise;
  const sunset = current?.sys?.sunset;
  const progress = getSunProgress(sunrise, sunset);

  return (
    <div className="sunrise-card">
      <div className="sunrise-label">☀️ SUNRISE</div>

      <div className="sunrise-time">{formatTime(sunrise)}</div>

      <div className="sunrise-curve-wrap">
        <div className="sunrise-line"></div>
        <div className="sunrise-arc"></div>

        <div
          className="sunrise-dot"
          style={{ left: `${progress}%` }}
        ></div>
      </div>

      <div className="sunset-text">Sunset: {formatTime(sunset)}</div>
    </div>
  );
}

export default SunriseWidget;