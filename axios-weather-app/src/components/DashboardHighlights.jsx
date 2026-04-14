import React from "react";

function DashboardHighlights({ weather }) {
  if (!weather) {
    return (
      <div className="glass-card highlights-card">
        <div className="section-title">Today Highlights</div>
        <div className="empty-box">No weather data available.</div>
      </div>
    );
  }

  const items = [
    {
      label: "Humidity",
      value: `${weather.main?.humidity ?? "--"}%`,
      sub: "Air moisture level",
    },
    {
      label: "Feels Like",
      value: `${Math.round(weather.main?.feels_like ?? 0)}°C`,
      sub: "Perceived temperature",
    },
    {
      label: "Pressure",
      value: `${weather.main?.pressure ?? "--"} hPa`,
      sub: "Atmospheric pressure",
    },
    {
      label: "Visibility",
      value: `${((weather.visibility || 0) / 1000).toFixed(1)} km`,
      sub: "Current viewing range",
    },
    {
      label: "Wind Speed",
      value: `${weather.wind?.speed ?? "--"} m/s`,
      sub: "Surface wind flow",
    },
    {
      label: "Sunrise / Sunset",
      value: "Daily Cycle",
      sub: "See right panel",
    },
  ];

  return (
    <div className="glass-card highlights-card">
      <div className="section-title">Today Highlights</div>

      <div className="highlights-grid">
        {items.map((item, index) => (
          <div className="highlight-item" key={index}>
            <div className="highlight-label">{item.label}</div>
            <div className="highlight-value">{item.value}</div>
            <div className="highlight-sub">{item.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardHighlights;