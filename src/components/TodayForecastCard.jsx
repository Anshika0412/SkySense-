// src/components/TodayForecastCard.jsx
import React from "react";
import { useWeather } from "../context/WeatherContext";
import ReactAnimatedWeather from "react-animated-weather";

const weatherData = [
  [[0], { iconDay: "CLEAR_DAY", iconNight: "CLEAR_NIGHT", desc: "Clear Sky" }],
  [[1], { iconDay: "CLEAR_DAY", iconNight: "CLEAR_NIGHT", desc: "Mainly Clear" }],
  [[2], { iconDay: "PARTLY_CLOUDY_DAY", iconNight: "PARTLY_CLOUDY_NIGHT", desc: "Partly Cloudy" }],
  [[3], { iconDay: "CLOUDY", iconNight: "CLOUDY", desc: "Overcast" }],
  [[45, 48], { iconDay: "FOG", iconNight: "FOG", desc: "Foggy" }],
  [[51, 53, 55], { iconDay: "RAIN", iconNight: "RAIN", desc: "Drizzle" }],
  [[56, 57, 66, 67], { iconDay: "SLEET", iconNight: "SLEET", desc: "Freezing Rain" }],
  [[61, 63, 65, 80, 81, 82], { iconDay: "RAIN", iconNight: "RAIN", desc: "Rainy" }],
  [[71, 73, 75, 77, 85, 86], { iconDay: "SNOW", iconNight: "SNOW", desc: "Snowy" }],
  [[95, 96, 99], { iconDay: "WIND", iconNight: "WIND", desc: "Thunderstorm" }],
].reduce((acc, [codes, data]) => {
  codes.forEach((c) => (acc[c] = data));
  return acc;
}, {});

export default function TodayForecastCard({ dayIndex = 0 }) {
  const { forecast, loading, tempUnit, convertTemp } = useWeather();

  // ✅ Shimmer loading state
  if (loading) {
    return (
      <div
        className=" w-[30%] sm:w-full max-h-40 rounded-xl p-4 shadow-xl bg-white/10 backdrop-blur-lg border border-white/20
        flex items-center justify-between animate-pulse"
      >
        <div className="flex flex-col gap-3 w-1/2">
          <div className="h-5 w-24 bg-white/20 rounded"></div>
          <div className="h-4 w-32 bg-white/10 rounded"></div>
          <div className="h-8 w-20 bg-white/20 rounded mt-2"></div>
          <div className="h-4 w-24 bg-white/10 rounded"></div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="hidden sm:h-14 sm:w-14 bg-white/20 rounded-full"></div>
          <div className="h-4 w-20 bg-white/10 rounded"></div>
        </div>
      </div>
    );
  }

  if (!forecast) return <p className="text-center text-gray-300">No data available</p>;

  const { daily, hourly } = forecast;
  const weatherCode = daily.weathercode[dayIndex];
  const sunrise = daily.sunrise ? new Date(daily.sunrise[dayIndex]) : null;
  const sunset = daily.sunset ? new Date(daily.sunset[dayIndex]) : null;

  const now = new Date();
  const isNight =
    (sunrise && sunset && (now < sunrise || now > sunset)) ||
    now.getHours() >= 19 ||
    now.getHours() <= 5;

  const iconData = weatherData[weatherCode];
  const iconToShow = isNight ? iconData?.iconNight : iconData?.iconDay;

  const isEmoji = typeof iconToShow === "string" && /[\u231A-\uD83E\uDDFF]/.test(iconToShow);
  const unitSymbol = tempUnit === "C" ? "°C" : "°F";

  const getCurrentHourlyIndex = () => {
    const now = new Date();
    return hourly.time.findIndex(
      (t) =>
        new Date(t).getHours() === now.getHours() &&
        new Date(t).getDate() === now.getDate()
    );
  };

  const currentIndex = getCurrentHourlyIndex();

  return (
    <div
      className=" max-h-[160px] lg:max-h-[164px] w-full rounded-xl p-2 lg:p-4 shadow-xl
        flex flex-row items-start justify-between gap-10 lg:gap-6
        bg-white/10 backdrop-blur-lg border border-white/20 transition-opacity duration-700 ease-in-out "
    >
      <div className=" sm:px-4">
        {/* Date Section */}
        <div className="text-center md:text-left">
          <p className="text-lg lg:text-xl font-semibold">
            {new Date().toLocaleDateString("en-US", { weekday: "long" })}
          </p>
          <p className=" text-xs lg:text-sm">
            {new Date().toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Temperature & Feels Like */}
        <div>
          <p className=" my-1 text-3xl lg:text-4xl font-bold drop-shadow-md">
            {currentIndex !== -1
              ? convertTemp(hourly.temperature_2m[currentIndex])
              : "--"}
            <sup className=" text-base sm:text-2xl">{unitSymbol}</sup>
          </p>

          <p className="text-sm lg:text-base">Feels Like</p>
          <p className="text-xs sm:text-sm">
            {currentIndex !== -1
              ? convertTemp(hourly.apparent_temperature[currentIndex])
              : "--"}
            {unitSymbol}
          </p>
        </div>
      </div>

      {/* Weather Icon & short desc */}
      <div className="flex flex-col items-center mt-4 sm:mt-6">
        {isEmoji ? (
          <div className="text-xl md:text-2xl lg:text-4xl">{iconToShow}</div>
        ) : (
          <ReactAnimatedWeather
            icon={iconToShow || "CLEAR_DAY"}
            color="white"
            size={60}
            animate={true}
          />
        )}
        <p className="mx-4 mt-2 text-xs lg:text-base font-medium">
          {weatherData[weatherCode]?.desc || "Unknown"}
        </p>
      </div>
    </div>
  );
}
