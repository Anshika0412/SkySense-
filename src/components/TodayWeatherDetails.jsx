import React from "react";
import { Wind, Droplet, Thermometer, CloudRain, Sunrise, Sunset } from "lucide-react";
import { useWeather } from "../context/WeatherContext";

export default function TodayWeatherDetails({ dayIndex = 0 }) {
  const { forecast, loading, tempUnit, convertTemp } = useWeather();

  // Shimmer component for individual info cards
  const ShimmerCard = ({ width = "w-20", height = "h-32" }) => (
    <div
      className={`${width} ${height} bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl animate-pulse`}
    ></div>
  );

  // Shimmer layout for the entire details section
  if (loading || !forecast || !forecast.daily || !forecast.hourly) {
    return (
      <div className=" w-[55%] sm:w-full grid grid-rows-2 lg:grid-cols-[65%_auto] gap-2">
        {/* Wind, Humidity, Pressure, Precipitation */}
        <div className="min-h-28 flex justify-between rounded-xl p-5 px-2 shadow-xl bg-white/10 backdrop-blur-lg border border-white/20 flex-wrap">
          <ShimmerCard width="w-12 md:w-16 lg:w-20" height="h-6 md:h-10 lg:h-12" />
          <ShimmerCard width="w-12 md:w-16 lg:w-20" height="h-6 md:h-10 lg:h-12" />
          <ShimmerCard width="w-12 md:w-16 lg:w-20" height="h-6 md:h-10 lg:h-12" />
          <ShimmerCard width="w-12 md:w-16 lg:w-20" height="h-6 md:h-10 lg:h-12" />
        </div>
        {/* Sunrise / Sunset */}
        <div className="min-h-28 flex justify-between rounded-xl py-4 px-6 shadow-xl bg-white/10 backdrop-blur-lg border border-white/20">
          <ShimmerCard width="w-12 md:w-16 lg:w-20" height="h-8 md:h-10 lg:h-12" />
          <ShimmerCard width="w-12 md:w-16 lg:w-20" height="h-8 md:h-10 lg:h-12" />
        </div>
      </div>
    );
  }

  // Actual weather details
  const { daily, hourly } = forecast;
  const weatherCode = daily.weathercode[dayIndex];

  const sunrise = daily.sunrise ? new Date(daily.sunrise[dayIndex]) : null;
  const sunset = daily.sunset ? new Date(daily.sunset[dayIndex]) : null;

  const sunriseTime = sunrise
    ? sunrise.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "--:--";
  const sunsetTime = sunset
    ? sunset.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "--:--";

  return (
    <div className="grid grid-cols-[65%_auto]  gap-2">
      {/* Wind, Humidity, Pressure, Precipitation */}
      <div className="max-h-24 lg:max-h-20 flex justify-between md:gap-2 lg-gap-2 rounded-xl p-3 sm:p-4 lg:p-3 sm:px-2 shadow-xl bg-white/10 backdrop-blur-lg border border-white/20 flex-wrap lg:flex-nowrap">
        <div className="flex items-center gap-2">
          <div className=" border-2 rounded-lg sm:rounded-xl flex items-center justify-center">
            <Wind className=" w-6 h-6 p-1 sm:w-10 sm:h-10 sm:p-2 lg:w-8 lg:h-8" />
          </div>
          <div>
            <p className="text-[12px] md:text-sm lg:text-xs">{hourly.wind_speed_10m[dayIndex]} km/h</p>
            <p className="text-[10px] md:text-xs">Wind</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className=" border-2 rounded-lg sm:rounded-xl flex items-center justify-center">
            <Thermometer className="w-6 h-6 p-1 sm:w-10 sm:h-10 sm:p-2 lg:w-8 lg:h-8" />
          </div>
          <div>
            <p className="text-[12px] md:text-sm">{hourly.pressure_msl[dayIndex]} hPa</p>
            <p className="text-[10px] md:text-xs">Pressure</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className=" border-2 rounded-lg sm:rounded-xl flex items-center justify-center">
            <Droplet className="w-6 h-6 p-1 sm:w-10 sm:h-10 sm:p-2 lg:w-8 lg:h-8" />
          </div>
          <div>
            <p className="text-[12px] md:text-sm">{hourly.relative_humidity_2m[dayIndex]}%</p>
            <p className="text-[10px] md:text-xs">Humidity</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="border-2 rounded-lg sm:rounded-xl flex items-center justify-center">
            <CloudRain className="w-6 h-6 p-1 sm:w-10 sm:h-10 sm:p-2 lg:w-8 lg:h-8" />
          </div>
          <div>
            <p className="text-[12px] md:text-sm">{daily.precipitation_sum[dayIndex]} mm</p>
            <p className="text-[10px] md:text-xs">Precipitation</p>
          </div>
        </div>
      </div>

      {/* Sunrise / Sunset */}
      <div className="max-h-24 lg:max-h-20 flex flex-col sm:flex-row justify-between rounded-xl p-2 sm:py-5 sm:px-4 shadow-xl bg-white/10 backdrop-blur-lg border border-white/20">
        <div className="flex items-center gap-2">
          <div className="border-2 rounded-lg sm:rounded-xl flex items-center justify-center">
            <Sunrise className="w-6 h-6 p-1 sm:w-10 sm:h-10 sm:p-2 lg:w-8 lg:h-8" />
          </div>
          <div>
            <p className="text-[10px] md:text-xs font-semibold">Sunrise</p>
            <p className="text-xs md:text-[13px]">{sunriseTime}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="border-2 rounded-lg sm:rounded-xl flex items-center justify-center">
            <Sunset className="w-6 h-6 p-1 sm:w-10 sm:h-10 sm:p-2 lg:text-[8px]" />
          </div>
          <div>
            <p className="text-[10px] md:text-xs font-semibold">Sunset</p>
            <p className="text-xs md:text-[13px]">{sunsetTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
