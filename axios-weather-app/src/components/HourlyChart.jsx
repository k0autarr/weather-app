import React from "react";

function HourlyChart({ hourlyData = [] }) {
  return (
    <div className="dark-widget">
      <div className="dark-widget-title">24 Hour Forecast</div>

      <div className="hourly-strip">
        {hourlyData.length > 0 ? (
          hourlyData.map((hour, index) => (
            <div className="hourly-card" key={index}>
              <div className="hour-label">{hour.time}</div>
              <div className="hour-icon">{hour.icon}</div>
              <div className="hour-temp">{Math.round(hour.temp)}°</div>
              <div className="hour-rain">{hour.rain}% rain</div>
            </div>
          ))
        ) : (
          <div className="empty-box">No hourly forecast available.</div>
        )}
      </div>
    </div>
  );
}

export default HourlyChart;