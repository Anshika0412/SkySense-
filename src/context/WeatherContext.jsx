import React, { createContext, useContext, useState, useEffect } from "react";
import { getForecastByCity, getForecastWithAQIByCoords } from "../api/weatherAPI";

// 1️⃣ Create Context
const WeatherContext = createContext(null);

// 2️⃣ Custom hook for easier access
export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeather must be used within a WeatherProvider");
  }
  return context;
};

// 3️⃣ Provider Component
export const WeatherProvider = ({ children }) => {
  const [forecast, setForecast] = useState(null);
  const [aqi, setAqi] = useState(null); // ✅ Air Quality Index
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cityName, setCityName] = useState({ city: "", state: "", country: "" }); // ✅ Location name as object

  // 🔄 Header toggles
  const [tempUnit, setTempUnit] = useState("C"); // "C" or "F"

  const [darkMode, setDarkMode] = useState(() => {
    if (localStorage.theme) return localStorage.theme === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // ✅ Helper to fetch formatted city name
  const getFullLocation = async ({ city, lat, lon }) => {
    try {
      let data;

      if (lat && lon) {
        // reverse geocode coordinates
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
        );
        data = await res.json();
      } else if (city) {
        // forward geocode city name
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            city
          )}&format=json&limit=1`
        );
        const arr = await res.json();
        if (arr.length > 0) {
          const { lat, lon } = arr[0];
          const res2 = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
          );
          data = await res2.json();
        }
      }

      if (data?.address) {
        const addr = data.address;
        const city = addr.city || addr.town || addr.village || addr.hamlet || "";
        const state = addr.state || "";
        const country = addr.country || "";

        setCityName({ city, state, country });
      }
    } catch (err) {
      console.error("Error fetching location:", err);
      setCityName({ city: city || "Unknown", state: "", country: "" });
    }
  };

  // 🔍 Fetch weather by city
  const fetchWeather = async (city) => {
    try {
      setLoading(true);
      setError("");
      setCityName({ city: "", state: "", country: "" }); // ✅ clear previous city while loading
      const data = await getForecastByCity(city);
      setForecast(data);
      setAqi(data.aqi ?? null);

      // ✅ Get full location info for searched city
      await getFullLocation({ city });
    } catch (err) {
      console.error("Failed to fetch weather:", err);
      setError(err.message || "Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Fetch weather by coordinates (geolocation)
  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      setLoading(true);
      setError("");
      setCityName({ city: "", state: "", country: "" }); // ✅ clear previous city while loading
      const data = await getForecastWithAQIByCoords(lat, lon);
      setForecast(data);
      setAqi(data.aqi ?? null);

      // ✅ Get full location info for initial coordinates
      await getFullLocation({ lat, lon });
    } catch (err) {
      console.error("Failed to fetch weather by coordinates:", err);
      setError(err.message || "Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Automatically detect weather + location on load
  useEffect(() => {
    const detectLocation = () => {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setError("Location access denied. Please allow location access.");
        }
      );
    };

    detectLocation();
  }, []); // ✅ run once on mount

  // Toggle temperature unit
  const toggleTempUnit = () => setTempUnit((prev) => (prev === "C" ? "F" : "C"));

  // Convert temperature based on unit
  const convertTemp = (tempC) => {
    if (tempC == null || isNaN(tempC)) return "--";
    return tempUnit === "C"
      ? tempC.toFixed(1)
      : ((tempC * 9) / 5 + 32).toFixed(1);
  };

  // Apply dark/light mode
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      root.classList.remove("dark");
      localStorage.theme = "light";
    }
  }, [darkMode]);

  // toggle dark/light mode
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <WeatherContext.Provider
      value={{
        forecast,
        aqi,
        loading,
        error,
        fetchWeather,
        fetchWeatherByCoords,
        tempUnit,
        toggleTempUnit,
        convertTemp,
        darkMode,
        toggleDarkMode,
        cityName, // now object { city, state, country }
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};
