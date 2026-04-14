import React from "react";

function formatUnixTime(timestamp) {
  if (!timestamp) return "--:--";
  return new Date(timestamp * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function WeatherWidget({ selectedCity, weather, rainBars = [] }) {
  if (!selectedCity || !weather) {
    return (
      <div className="weather-hero">
        <div className="empty-box">Select a city to see the weather dashboard.</div>
      </div>
    );
  }

  return (
    <div className="weather-hero">
      <div className="hero-meta">
        <div className="hero-date">
          {new Date().toLocaleDateString([], {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </div>

        <div className="hero-city">
          {selectedCity.city}, {selectedCity.country}
        </div>

        <div className="hero-condition">
          {weather.weather?.[0]?.main} · {weather.weather?.[0]?.description}
        </div>
      </div>

      <div className="weather-main-row">
        <div className="hero-temp-block">
          <div className="hero-temp">{Math.round(weather.main?.temp)}°</div>
          <div className="hero-temp-unit">Celsius</div>
        </div>

        <div className="weather-icon-badge">
          {weather.weather?.[0]?.main === "Clouds"
            ? "☁️"
            : weather.weather?.[0]?.main === "Rain"
            ? "🌧️"
            : weather.weather?.[0]?.main === "Clear"
            ? "☀️"
            : "🌤️"}
        </div>
      </div>

     <div className="dark-widget rain-widget-card">
  <div className="dark-widget-title rain-widget-title">Chance of Rain</div>

  <div className="rain-widget-body">
    <div className="rain-scale">
      <span>sunny</span>
      <span>rainy</span>
      <span>heavy rain</span>
    </div>

    <div className="rain-bars-area">
      {rainBars.map((item, index) => (
        <div className="rain-bar-item" key={index}>
          <div className="rain-track">
            <div
              className={`rain-fill ${item.highlight ? "active" : ""}`}
              style={{
                height: `${Math.max(item.value, 18)}%`,
                background: item.highlight
                  ? "linear-gradient(180deg, #ffd84d 0%, #f6be00 100%)"
                  : "rgba(122, 126, 206, 0.55)",
              }}
            />
          </div>
          <div className="rain-time-label">{item.time}</div>
        </div>
      ))}
    </div>
  </div>
</div>
    </div>
  );
}

export default WeatherWidget;