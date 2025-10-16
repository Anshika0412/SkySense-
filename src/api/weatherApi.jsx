import axios from "axios";

// ✅ Get coordinates by city
export const getCoordsByCity = async (city) => {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    city
  )}&count=1&language=en&format=json`;

  const { data } = await axios.get(url);

  if (!data.results || data.results.length === 0) {
    console.error("No results found for city:", city);
    throw new Error("City not found");
  }

  const { latitude, longitude, name, country } = data.results[0];
  return { latitude, longitude, name, country };
};

// ✅ Get forecast by coordinates (optionally include AQI separately)
export const getForecastByCoords = async (lat, lon) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode,sunrise,sunset&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,pressure_msl,wind_speed_10m,precipitation&timezone=auto`;

  const { data } = await axios.get(url);
  return data;
};

// ✅ Get AQI by coordinates
export const getAQIByCoords = async (lat, lon) => {
  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=us_aqi`;
    const { data } = await axios.get(url);

    const aqiArray = data.hourly?.us_aqi || [];
    if (aqiArray.length === 0) return null;

    // ✅ find the most recent non-null AQI value from the end
    for (let i = aqiArray.length - 1; i >= 0; i--) {
      if (aqiArray[i] !== null && aqiArray[i] !== undefined) {
        return aqiArray[i];
      }
    }

    return null;
  } catch (err) {
    console.error("Failed to fetch AQI:", err);
    return null;
  }
};


// ✅ Get forecast + AQI + location by city
export const getForecastByCity = async (city) => {
  const { latitude, longitude, name, country } = await getCoordsByCity(city);

  const forecast = await getForecastByCoords(latitude, longitude);
  const aqi = await getAQIByCoords(latitude, longitude);

  return { ...forecast, location: { name, country }, aqi };
};

// ✅ New helper: get forecast + AQI by coords directly
export const getForecastWithAQIByCoords = async (lat, lon) => {
  const forecast = await getForecastByCoords(lat, lon);
  const aqi = await getAQIByCoords(lat, lon);

  return { ...forecast, aqi };
};
