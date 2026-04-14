import React from "react";

function ForecastList({ dailyForecast = [] }) {
  return (
    <div className="glass-card forecast-card">
      <div className="section-title">Weekly Forecast</div>

      <div className="forecast-list">
        {dailyForecast.length > 0 ? (
          dailyForecast.map((day, index) => (
            <div className="forecast-row" key={index}>
              <div className="forecast-day">
                <strong>{day.day}</strong>
                <span>{day.description}</span>
              </div>

              <div className="forecast-icon">{day.icon}</div>
              <div className="forecast-temp">{Math.round(day.temp)}°</div>
            </div>
          ))
        ) : (
          <div className="empty-box">No forecast available yet.</div>
        )}
      </div>
    </div>
  );
}

export default ForecastList;