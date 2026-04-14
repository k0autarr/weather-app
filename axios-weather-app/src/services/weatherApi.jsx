import axios from "axios";

const WEATHER_API_KEY = "c0c729617e45f5e8366e18092886a491";
const WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_BASE_URL = "https://api.openweathermap.org/geo/1.0";

export const getCoordinatesByCity = async (city) => {
  const response = await axios.get(`${GEO_BASE_URL}/direct`, {
    params: {
      q: city,
      limit: 1,
      appid: WEATHER_API_KEY,
    },
  });

  if (!response.data || response.data.length === 0) {
    throw new Error("City not found");
  }

  return response.data[0];
};

export const getCurrentWeatherByCoords = async (lat, lon) => {
  const response = await axios.get(`${WEATHER_BASE_URL}/weather`, {
    params: {
      lat,
      lon,
      appid: WEATHER_API_KEY,
      units: "metric",
    },
  });

  return response.data;
};

export const getForecastByCoords = async (lat, lon) => {
  const response = await axios.get(`${WEATHER_BASE_URL}/forecast`, {
    params: {
      lat,
      lon,
      appid: WEATHER_API_KEY,
      units: "metric",
    },
  });

  return response.data;
};

export const getCompleteCityWeather = async (city) => {
  const location = await getCoordinatesByCity(city);
  const current = await getCurrentWeatherByCoords(location.lat, location.lon);
  const forecast = await getForecastByCoords(location.lat, location.lon);

  return {
    location,
    current,
    forecast,
  };
};

export const getWeatherIconUrl = (iconCode) =>
  `https://openweathermap.org/img/wn/${iconCode}@2x.png`;