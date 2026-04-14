import React from "react";

function TemperatureTrend({ forecastList = [] }) {
  const chartData = forecastList.slice(0, 8).map((item) => ({
    time: new Date(item.dt * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      hour12: false,
    }),
    temp: Math.round(item.main?.temp || 0),
    feelsLike: Math.round(item.main?.feels_like || 0),
  }));

  const temps = chartData.flatMap((item) => [item.temp, item.feelsLike]);
  const minTemp = Math.min(...temps, 0);
  const maxTemp = Math.max(...temps, 10);
  const range = Math.max(maxTemp - minTemp, 1);

  const getY = (value) => {
    const normalized = (value - minTemp) / range;
    return 180 - normalized * 140;
  };

  const actualPoints = chartData
    .map((item, index) => `${index * 70 + 20},${getY(item.temp)}`)
    .join(" ");

  const feelsPoints = chartData
    .map((item, index) => `${index * 70 + 20},${getY(item.feelsLike)}`)
    .join(" ");

  return (
    <div className="temp-trend-card">
      <div className="temp-trend-title">Temperature Overview</div>

      <div className="temp-chart-wrap">
        <svg
          className="temp-chart-svg"
          viewBox="0 0 540 220"
          preserveAspectRatio="none"
        >
          {[0, 1, 2, 3, 4].map((row) => (
            <line
              key={row}
              x1="0"
              y1={30 + row * 35}
              x2="540"
              y2={30 + row * 35}
              className="temp-grid-line"
            />
          ))}

          {chartData.map((item, index) => (
            <line
              key={index}
              x1={index * 70 + 20}
              y1="20"
              x2={index * 70 + 20}
              y2="190"
              className="temp-grid-vertical"
            />
          ))}

          <polyline
            fill="none"
            points={feelsPoints}
            className="temp-line-feels"
          />

          <polyline
            fill="none"
            points={actualPoints}
            className="temp-line-actual"
          />

          {chartData.map((item, index) => (
            <circle
              key={`actual-${index}`}
              cx={index * 70 + 20}
              cy={getY(item.temp)}
              r="4"
              className="temp-dot-actual"
            />
          ))}

          {chartData.map((item, index) => (
            <circle
              key={`feels-${index}`}
              cx={index * 70 + 20}
              cy={getY(item.feelsLike)}
              r="4"
              className="temp-dot-feels"
            />
          ))}
        </svg>
      </div>

      <div className="temp-chart-hours">
        {chartData.map((item, index) => (
          <span key={index}>{item.time}</span>
        ))}
      </div>

      <div className="temp-chart-legend">
        <div className="legend-pill">
          <span className="legend-line actual"></span>
          Actual
        </div>
        <div className="legend-pill">
          <span className="legend-line feels"></span>
          Feels Like
        </div>
      </div>
    </div>
  );
}

export default TemperatureTrend;