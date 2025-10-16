import { Sun, Moon } from "lucide-react";
import { useWeather } from "../context/WeatherContext";

export default function ToggleTheme() {
  const { darkMode, toggleDarkMode } = useWeather();

  return (
    <div
      role="switch"
      aria-checked={darkMode}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleDarkMode();
        }
      }}
      className="relative w-[58px] h-[26px] md:w-[72px] md:h-8 bg-gray-300 dark:bg-gray-700 rounded-full cursor-pointer select-none"
      onClick={toggleDarkMode}
    >
      {/* Sliding background */}
      <div
        className="absolute top-0 left-0 w-1/2 h-full rounded-full transition-all duration-500 ease-in-out"
        style={{
          transform: darkMode ? "translateX(100%)" : "translateX(0%)",
          backgroundColor: darkMode ? "#000" : "#3b82f6",
        }}
      />

      {/* Icons */}
      <div className="relative flex h-full items-center justify-between text-white font-semibold px-2">
        <button
          type="button"
          className="z-10 bg-transparent border-0 p-0 inline-flex items-center"
          aria-label="Switch to light theme"
          aria-pressed={!darkMode}
          onClick={(e) => {
            e.stopPropagation();
            // Sun = switch to light. Only toggle if currently dark
            if (!darkMode) return;
            toggleDarkMode();
          }}
        >
          <Sun size={16} />
        </button>

        <button
          type="button"
          className="z-10 bg-transparent border-0 p-0 inline-flex items-center"
          aria-label="Switch to dark theme"
          aria-pressed={darkMode}
          onClick={(e) => {
            e.stopPropagation();
            // Moon = switch to dark. Only toggle if currently light
            if (darkMode) return;
            toggleDarkMode();
          }}
        >
          <Moon size={16} />
        </button>
      </div>
    </div>
  );
}
