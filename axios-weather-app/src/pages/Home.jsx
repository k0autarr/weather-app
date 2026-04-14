import React, { useEffect, useMemo, useState } from "react";
import SearchBar from "../components/SearchBar";
import CityCard from "../components/CityCard";
import ForecastList from "../components/ForecastList";
import DashboardHighlights from "../components/DashboardHighlights";
import WeatherWidget from "../components/WeatherWidget";
import CloudBackground from "../components/CloudBackground";
import { getCompleteCityWeather } from "../services/weatherApi";
import { getCityImage } from "../services/imageApi";

function getWeatherEmoji(main) {
  switch (main) {
    case "Clear":
      return "☀️";
    case "Clouds":
      return "☁️";
    case "Rain":
      return "🌧️";
    case "Thunderstorm":
      return "⛈️";
    case "Snow":
      return "❄️";
    default:
      return "🌤️";
  }
}

function formatDayLabel(dateString, index) {
  const date = new Date(dateString);

  if (index === 0) return "Today";

  return date.toLocaleDateString([], {
    weekday: "short",
  });
}

function buildDailyForecast(forecastList = []) {
  const dailyMap = {};

  forecastList.forEach((item) => {
    const dateKey = item.dt_txt.split(" ")[0];

    if (!dailyMap[dateKey]) {
      dailyMap[dateKey] = item;
    }
  });

  return Object.values(dailyMap)
    .slice(0, 6)
    .map((item, index) => ({
      day: formatDayLabel(item.dt_txt, index),
      description: item.weather?.[0]?.main || "Weather",
      icon: getWeatherEmoji(item.weather?.[0]?.main),
      temp: item.main?.temp || 0,
    }));
}

function buildRainBars(forecastList = []) {
  return forecastList.slice(0, 6).map((item, index) => ({
    time: new Date(item.dt * 1000).toLocaleTimeString([], {
      hour: "numeric",
    }),
    value: Math.round((item.pop || 0) * 100),
    highlight: index === 2,
  }));
}

function buildWeatherAlerts(currentWeather, forecastData) {
  const alerts = [];

  if (!currentWeather) return alerts;

  const temp = currentWeather.main?.temp || 0;
  const wind = currentWeather.wind?.speed || 0;
  const forecastList = forecastData?.list || [];

  if (temp >= 30) {
    alerts.push({
      type: "heat",
      icon: "☀️",
      message: "Hot day ahead. Temperatures are expected to stay high.",
    });
  }

  if (wind >= 10) {
    alerts.push({
      type: "wind",
      icon: "💨",
      message: "Windy conditions detected. Expect stronger gusts today.",
    });
  }

  const rainySlot = forecastList.find((item) => (item.pop || 0) > 0.5);

  if (rainySlot) {
    const time = new Date(rainySlot.dt * 1000).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

    alerts.push({
      type: "rain",
      icon: "🌧️",
      message: `Rain is likely around ${time}.`,
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      type: "clear",
      icon: "🌤️",
      message: "Conditions look stable. No major alerts for now.",
    });
  }

  return alerts;
}

function Home() {
  const [cities, setCities] = useState(() => {
    try {
      const savedCities = localStorage.getItem("weather_cities");
      return savedCities ? JSON.parse(savedCities) : [];
    } catch (error) {
      return [];
    }
  });

  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedWeather, setSelectedWeather] = useState(null);
  const [selectedForecast, setSelectedForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bootLoading, setBootLoading] = useState(true);
  const [error, setError] = useState("");

  const defaultCities = useMemo(() => ["Berlin", "Paris", "New York"], []);

  const loadCityData = async (cityName) => {
    const weatherBundle = await getCompleteCityWeather(cityName);
    const image = await getCityImage(cityName);

    return {
      id: `${cityName}-${Date.now()}-${Math.random()}`,
      city: weatherBundle.location.name,
      country: weatherBundle.location.country,
      temp: weatherBundle.current.main.temp,
      condition: weatherBundle.current.weather?.[0]?.main || "Weather",
      image,
      current: weatherBundle.current,
      forecast: weatherBundle.forecast,
    };
  };

  const initializeDefaultCities = async () => {
    try {
      setBootLoading(true);
      setError("");

      if (cities.length > 0) {
        setSelectedCity(cities[0]);
        setSelectedWeather(cities[0].current);
        setSelectedForecast(cities[0].forecast);
        return;
      }

      const loadedCities = await Promise.all(defaultCities.map(loadCityData));

      setCities(loadedCities);
      setSelectedCity(loadedCities[0]);
      setSelectedWeather(loadedCities[0].current);
      setSelectedForecast(loadedCities[0].forecast);
    } catch (err) {
      setError("Could not load default cities. Check your API keys.");
    } finally {
      setBootLoading(false);
    }
  };

  useEffect(() => {
    initializeDefaultCities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("weather_cities", JSON.stringify(cities));
    } catch (error) {
      // ignore localStorage errors
    }
  }, [cities]);

  const handleSearchCity = async (cityName) => {
    try {
      setLoading(true);
      setError("");

      const existingCity = cities.find(
        (item) => item.city.toLowerCase() === cityName.toLowerCase()
      );

      if (existingCity) {
        setSelectedCity(existingCity);
        setSelectedWeather(existingCity.current);
        setSelectedForecast(existingCity.forecast);
        return;
      }

      const newCity = await loadCityData(cityName);

      setCities((prev) => [newCity, ...prev]);
      setSelectedCity(newCity);
      setSelectedWeather(newCity.current);
      setSelectedForecast(newCity.forecast);
    } catch (err) {
      setError("Invalid city name or API request failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCity = (cityData) => {
    setSelectedCity(cityData);
    setSelectedWeather(cityData.current);
    setSelectedForecast(cityData.forecast);
  };

  const dailyForecast = buildDailyForecast(selectedForecast?.list || []);
  const rainBars = buildRainBars(selectedForecast?.list || []);
  const alerts = buildWeatherAlerts(selectedWeather, selectedForecast);

  return (
    <div className="weather-layout">
      <div className="left-panel">
        <div className="panel-top-row">
          <div className="brand-block">
            <div className="brand-label">Weather Dashboard</div>
            <div className="brand-title">Premium Forecast</div>
          </div>

          <div className="avatar-badge">KOW</div>
        </div>

        <SearchBar onSearch={handleSearchCity} loading={loading} />

        {error && <div className="error-box">{error}</div>}

        {bootLoading ? (
          <div className="city-cards-row">
            <div className="city-card skeleton"></div>
            <div className="city-card skeleton"></div>
            <div className="city-card skeleton"></div>
          </div>
        ) : (
          <div className="city-cards-row">
            {cities.map((cityItem) => (
              <CityCard
                key={cityItem.id}
                cityData={cityItem}
                onSelectCity={handleSelectCity}
              />
            ))}
          </div>
        )}

        <div className="left-bottom-grid">
          <ForecastList dailyForecast={dailyForecast} />
          <DashboardHighlights weather={selectedWeather} />
        </div>
      </div>

      <div className="right-panel">
        <CloudBackground />

        <div className="panel-top-row">
          <div className="brand-block">
            <div className="brand-label">Live Conditions</div>
            <div className="brand-title">Today Overview</div>
          </div>

          <div className="avatar-badge">24H</div>
        </div>

        <WeatherWidget
          selectedCity={selectedCity}
          weather={selectedWeather}
          rainBars={rainBars}
        />

        <div className="dashboard-alerts-preview">
          <div className="dashboard-alerts-title">Smart Alerts</div>

          <div className="dashboard-alerts-list">
            {alerts.map((alert, index) => (
              <div key={index} className="dashboard-alert-card">
                <span className="dashboard-alert-icon">{alert.icon}</span>
                <span>{alert.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;