import React from "react";

function formatHour(timestamp) {
  if (!timestamp) return "--:--";
  return new Date(timestamp * 1000).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function buildAssistantInsights(current, forecastList = []) {
  if (!current) {
    return {
      headline: "No live insights available",
      mood: "Waiting for weather data",
      items: [],
    };
  }

  const temp = Math.round(current.main?.temp || 0);
  const feelsLike = Math.round(current.main?.feels_like || 0);
  const humidity = current.main?.humidity || 0;
  const wind = current.wind?.speed || 0;
  const weatherMain = current.weather?.[0]?.main || "Clear";

  const rainySlot = forecastList.find((item) => (item.pop || 0) > 0.5);
  const warmSlot = forecastList.find((item) => (item.main?.temp || 0) >= 30);

  let headline = "A calm weather window is ahead.";
  let mood = "🌤️ Balanced conditions";

  if (weatherMain === "Rain" || rainySlot) {
    headline = "Rain may shape the next part of your day.";
    mood = "🌧️ Stay prepared";
  } else if (temp >= 30 || warmSlot) {
    headline = "Warm conditions are building through the day.";
    mood = "☀️ Heat-aware mode";
  } else if (wind >= 10) {
    headline = "Wind will be the most noticeable factor today.";
    mood = "💨 Breezy conditions";
  } else if (weatherMain === "Clouds") {
    headline = "Cloud cover keeps the atmosphere soft and steady.";
    mood = "☁️ Calm and overcast";
  }

  const items = [];

  if (rainySlot) {
    items.push({
      label: "Rain window",
      value: `${formatHour(rainySlot.dt)}`,
      note: "A good time to carry an umbrella.",
    });
  } else {
    items.push({
      label: "Rain risk",
      value: "Low",
      note: "No strong rainfall signal right now.",
    });
  }

  if (temp >= 28 || feelsLike >= 30) {
    items.push({
      label: "Comfort tip",
      value: "Stay hydrated",
      note: "Feels warmer than usual outside.",
    });
  } else if (temp <= 10) {
    items.push({
      label: "Comfort tip",
      value: "Dress warm",
      note: "Cool air may feel sharper later.",
    });
  } else {
    items.push({
      label: "Comfort tip",
      value: "Light layers",
      note: "Conditions look comfortable overall.",
    });
  }

  if (wind >= 10) {
    items.push({
      label: "Wind watch",
      value: `${wind} m/s`,
      note: "Expect stronger movement in open areas.",
    });
  } else {
    items.push({
      label: "Air movement",
      value: `${wind} m/s`,
      note: "Wind conditions look manageable.",
    });
  }

  if (humidity >= 75) {
    items.push({
      label: "Humidity",
      value: `${humidity}%`,
      note: "The air may feel heavier than usual.",
    });
  } else {
    items.push({
      label: "Humidity",
      value: `${humidity}%`,
      note: "Moisture levels look fairly balanced.",
    });
  }

  return { headline, mood, items };
}

function WeatherAssistant({ current, forecastList = [], cityName = "" }) {
  const insight = buildAssistantInsights(current, forecastList);

  return (
    <div className="assistant-panel">
      <div className="assistant-panel-top">
        <div>
          <div className="assistant-kicker">AI Weather Assistant</div>
          <div className="assistant-title">Live Insight for {cityName || "Today"}</div>
        </div>

        <div className="assistant-orb-mini">✦</div>
      </div>

      <div className="assistant-hero-card">
        <div className="assistant-mood">{insight.mood}</div>
        <p className="assistant-headline">{insight.headline}</p>
      </div>

      <div className="assistant-list">
        {insight.items.map((item, index) => (
          <div className="assistant-item" key={index}>
            <div className="assistant-item-top">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
            <p>{item.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeatherAssistant;