import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import HourlyChart from "../components/HourlyChart";
import CloudBackground from "../components/CloudBackground";
import SunriseWidget from "../components/SunriseWidget";
import TemperatureTrend from "../components/TemperatureTrend";
import { getCompleteCityWeather } from "../services/weatherApi";
import { getCityImage } from "../services/imageApi";
import WeatherAssistant from "../components/WeatherAssistant";

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

function CityDetails() {
  const { cityName } = useParams();
  const location = useLocation();

  const passedCityData = location.state?.cityData;

  const [cityBundle, setCityBundle] = useState(passedCityData || null);
  const [image, setImage] = useState(passedCityData?.image || "");
  const [loading, setLoading] = useState(!passedCityData);
  const [error, setError] = useState("");

  const decodedCityName = useMemo(
    () => decodeURIComponent(cityName || ""),
    [cityName]
  );

  useEffect(() => {
    const fetchCityDetails = async () => {
      if (passedCityData) return;

      try {
        setLoading(true);
        setError("");

        const weatherBundle = await getCompleteCityWeather(decodedCityName);
        const cityImage = await getCityImage(decodedCityName);

        setCityBundle({
          city: weatherBundle.location.name,
          country: weatherBundle.location.country,
          temp: weatherBundle.current.main.temp,
          condition: weatherBundle.current.weather?.[0]?.main || "Weather",
          current: weatherBundle.current,
          forecast: weatherBundle.forecast,
          image: cityImage,
        });

        setImage(cityImage);
      } catch (err) {
        setError("Could not load city details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCityDetails();
  }, [decodedCityName, passedCityData]);

  const hourlyData =
    cityBundle?.forecast?.list?.slice(0, 8).map((item) => ({
      time: new Date(item.dt * 1000).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
      icon: getWeatherEmoji(item.weather?.[0]?.main),
      temp: item.main?.temp,
      rain: Math.round((item.pop || 0) * 100),
    })) || [];

  if (loading) {
    return (
      <div className="details-page-shell">
        <div className="loading-box">Loading city details...</div>
      </div>
    );
  }

  if (error || !cityBundle) {
    return (
      <div className="details-page-shell">
        <div className="error-box">{error || "Something went wrong."}</div>
        <br />
        <Link to="/" className="back-link">
          ← Back to dashboard
        </Link>
      </div>
    );
  }

  const current = cityBundle.current;
  const forecastList = cityBundle?.forecast?.list || [];

  return (
    <div className="details-page-shell">
      <CloudBackground />

      <Link to="/" className="back-link">
        ← Back to dashboard
      </Link>

      <div className="details-grid">
        <div className="details-main-card">
          <img
            src={image || cityBundle.image}
            alt={cityBundle.city}
            className="details-hero-image"
          />

          <div className="details-big-row">
            <div>
              <div className="hero-date">
                {new Date().toLocaleDateString([], {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </div>

              <div className="hero-city">
                {cityBundle.city}, {cityBundle.country}
              </div>

              <div className="hero-condition">
                {current.weather?.[0]?.main} · {current.weather?.[0]?.description}
              </div>
            </div>

            <div className="details-temp-big">
              {Math.round(current.main?.temp)}°
            </div>
          </div>

          <br />

          <HourlyChart hourlyData={hourlyData} />

          <div className="details-insights-grid">
            <SunriseWidget current={current} />
            <TemperatureTrend forecastList={forecastList} />
          </div>
        </div>

        <div className="details-side-card">
          <div className="section-title">Detailed Metrics</div>

          <div className="weather-mini-stats">
            <div className="weather-mini-row">
              <span>Humidity</span>
              <strong>{current.main?.humidity}%</strong>
            </div>

            <div className="weather-mini-row">
              <span>Feels Like</span>
              <strong>{Math.round(current.main?.feels_like)}°C</strong>
            </div>

            <div className="weather-mini-row">
              <span>Pressure</span>
              <strong>{current.main?.pressure} hPa</strong>
            </div>

            <div className="weather-mini-row">
              <span>Visibility</span>
              <strong>{(current.visibility / 1000).toFixed(1)} km</strong>
            </div>

            <div className="weather-mini-row">
              <span>Wind Speed</span>
              <strong>{current.wind?.speed} m/s</strong>
            </div>

            <div className="weather-mini-row">
              <span>Cloudiness</span>
              <strong>{current.clouds?.all}%</strong>
            </div>

            <div className="weather-mini-row">
              <span>Latitude</span>
              <strong>{current.coord?.lat}</strong>
            </div>

            <div className="weather-mini-row">
              <span>Longitude</span>
              <strong>{current.coord?.lon}</strong>
            </div>
          </div>

          <br />

          <WeatherAssistant
            current={current}
            forecastList={forecastList}
            cityName={cityBundle.city}
          />
        </div>
      </div>
    </div>
  );
}

export default CityDetails;