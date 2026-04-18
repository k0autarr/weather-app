import React, { useEffect, useMemo, useState } from "react";
import SearchBar from "../components/SearchBar";
import CityCard from "../components/CityCard";
import ForecastList from "../components/ForecastList";
import DashboardHighlights from "../components/DashboardHighlights";
import WeatherWidget from "../components/WeatherWidget";
import CloudBackground from "../components/CloudBackground";
import { getCompleteCityWeather } from "../services/weatherApi";
import { getCityImage } from "../services/imageApi";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80";

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
      console.error("Failed to parse saved cities:", error);
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
    try {
      const weatherBundle = await getCompleteCityWeather(cityName);

      let image = FALLBACK_IMAGE;

      try {
        image =
          (await getCityImage(
            weatherBundle.location.name,
            weatherBundle.location.country
          )) || FALLBACK_IMAGE;
      } catch (imageError) {
        console.error(
          `Image fetch failed for ${weatherBundle.location.name}:`,
          imageError
        );
      }

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
    } catch (weatherError) {
      console.error(`Weather fetch failed for ${cityName}:`, weatherError);
      throw weatherError;
    }
  };

  const initializeDefaultCities = async () => {
    try {
      setBootLoading(true);
      setError("");

      if (cities.length > 0) {
        const fixedCities = await Promise.all(
          cities.map(async (city) => {
            try {
              const needsRefresh =
                !city.image ||
                typeof city.image !== "string" ||
                city.image.trim() === "" ||
                city.image.includes("undefined") ||
                city.image === FALLBACK_IMAGE;

              if (needsRefresh) {
                const newImage = await getCityImage(city.city, city.country);
                return {
                  ...city,
                  image: newImage || FALLBACK_IMAGE,
                };
              }

              return {
                ...city,
                image: city.image || FALLBACK_IMAGE,
              };
            } catch (imageError) {
              console.error(`Failed to restore image for ${city.city}:`, imageError);
              return {
                ...city,
                image: FALLBACK_IMAGE,
              };
            }
          })
        );

        setCities(fixedCities);
        setSelectedCity(fixedCities[0]);
        setSelectedWeather(fixedCities[0].current);
        setSelectedForecast(fixedCities[0].forecast);
        return;
      }

      const loadedCities = await Promise.all(defaultCities.map(loadCityData));

      setCities(loadedCities);
      setSelectedCity(loadedCities[0]);
      setSelectedWeather(loadedCities[0].current);
      setSelectedForecast(loadedCities[0].forecast);
    } catch (err) {
      console.error("Initialization failed:", err);
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
    } catch (storageError) {
      console.error("Failed to save cities to localStorage:", storageError);
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
      console.error(`Failed to search city ${cityName}:`, err);
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