import React from "react";
import { useWeather } from "../context/WeatherContext";

export default function TempToggle() {
  const { tempUnit, toggleTempUnit } = useWeather();

  return (
    <div
      className="relative w-[58px] h-[26px] md:w-[72px] md:h-8 bg-blue-100 dark:bg-blue-900 rounded-full cursor-pointer select-none"
      onClick={toggleTempUnit}
    >
      {/* Sliding background */}
      <div
        className={`absolute top-0 left-0 w-1/2 h-full bg-blue-500 rounded-full transition-all duration-300`}
        style={{
          transform: tempUnit === "C" ? "translateX(0%)" : "translateX(100%)",
        }}
      />

      {/* Options */}
      <div className="relative flex h-full items-center justify-between text-white font-semibold px-2">
        <span
          className="z-10 text-xs md:text-base"
          onClick={(e) => {
            e.stopPropagation(); // ✅ prevent outer div click
            if (tempUnit !== "C") toggleTempUnit();
          }}
        >
          °C
        </span>
        <span
          className="z-10 text-xs md:text-base"
          onClick={(e) => {
            e.stopPropagation(); // ✅ prevent outer div click
            if (tempUnit === "C") toggleTempUnit();
          }}
        >
          °F
        </span>
      </div>
    </div>
  );
}
