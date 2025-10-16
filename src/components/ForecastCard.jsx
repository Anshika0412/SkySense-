// src/components/ForecastCard.jsx
import React from "react";
import { useWeather } from "../context/WeatherContext";

// Map multiple weather codes to icons/descriptions
const weatherData = [
  [[0, 1], { icon: "☀️", desc: "Clear Sky" }],
  [[2], { icon: "⛅", desc: "Partly Cloudy" }],
  [[3], { icon: "☁️", desc: "Overcast" }],
  [[45, 48], { icon: "🌫️", desc: "Foggy" }],
  [[51, 53, 55], { icon: "🌦️", desc: "Drizzle" }],
  [[56, 57, 66, 67], { icon: "🌨️", desc: "Freezing Rain" }],
  [[61, 63, 65, 80, 81, 82], { icon: "🌧️", desc: "Rainy" }],
  [[71, 73, 75, 77, 85, 86], { icon: "❄️", desc: "Snowy" }],
  [[95, 96, 99], { icon: "⛈️", desc: "Thunderstorm" }],
];

// Reduce array into a lookup object for quick access
const weatherLookup = weatherData.reduce((acc, [codes, data]) => {
  codes.forEach((c) => (acc[c] = data));
  return acc;
}, {});

export default function ForecastCard({ index: dayIndex }) {
  const { forecast, tempUnit } = useWeather();

  if (!forecast) return null;

  const { daily, hourly } = forecast;

  // Helper: get all hourly indices for the current day
  const dayDate = new Date(daily.time[dayIndex]).getDate();
  const dayHours = hourly.time
    .map((t, i) => ({ i, date: new Date(t).getDate() }))
    .filter((obj) => obj.date === dayDate)
    .map((obj) => obj.i);

  const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

  const avgFeels = avg(dayHours.map((i) => hourly.apparent_temperature[i]));
  // const avgHumidity = avg(dayHours.map((i) => hourly.relative_humidity_2m[i]));
  // const avgPressure = avg(dayHours.map((i) => hourly.pressure_msl[i]));
  // const avgWind = avg(dayHours.map((i) => hourly.wind_speed_10m[i]));

  const weatherInfo = weatherLookup[daily.weathercode[dayIndex]] || { icon: "🌈", desc: "Unknown" };

  // Find current hour index for exact temperature
  const now = new Date();
  const currentIndex = hourly.time.findIndex(
    (t) => new Date(t).getHours() === now.getHours() && new Date(t).getDate() === now.getDate()
  );

  const convertTemp = (tempC) => (tempUnit === "C" ? tempC.toFixed(1) : ((tempC * 9) / 5 + 32).toFixed(1));
  const unitSymbol = tempUnit === "C" ? "°C" : "°F";

  return (
    <div className="">
      <p className=" text-xs md:text-sm font-semibold text-center my-1 text-blue-100">
        {new Date(daily.time[dayIndex]).toLocaleDateString("en-US", { weekday: "short" })}
      </p>

      <div className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl py-1 px-2 sm:px-4 shadow-md text-center">
        
        <p className=" font-bold text-base md:text-xl ">
          {currentIndex !== -1 ? convertTemp(hourly.temperature_2m[currentIndex]) : "--"}
          <sup className=" text-xs sm:text-base">{unitSymbol}</sup>
        </p>
        <div className=" text-lg md:text-3xl lg:text-4xl ">{weatherInfo.icon}</div>

        <div className="mt-1 text-[9px] sm:text-xs text-gray-200 sm:space-y-1">
          <p> Feels - {convertTemp(avgFeels)}{unitSymbol}</p>
          <p>💧- {daily.precipitation_sum[dayIndex].toFixed(1)} mm</p>
          
        </div>
      </div>
    </div>
  );
}
