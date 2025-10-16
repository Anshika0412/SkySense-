// src/components/Header.jsx
import { useWeather } from "../context/WeatherContext";
import { MapPin } from "lucide-react";
import SearchBar from "./SearchBar";
import ToggleTempCF from "./ToggleTempCF";
import ToggleTheme from "./ToggleTheme";

export default function Header() {
  const { cityName } = useWeather();

  if (!cityName) return null;

  return (
    <header className="w-full bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg shadow-md sticky top-0 z-50 rounded-b-xl p-3">
      
      {/* Mobile/Tablet: Two rows | Desktop: Single row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        
        {/* Row 1: Logo + Location + Toggle Buttons (mobile/tablet) | Logo + Location (desktop) */}
        <div className="flex items-center justify-between sm:justify-start gap-6">
          
          {/* Logo + Location */}
          <div className="flex items-center gap-6">
            <div className="text-xs  sm:text-base font-semibold text-blue-700 dark:text-blue-400 italic">
              🌤️ SkySense 
            </div>
            <div className="relative flex gap-1 items-center group">
              <MapPin className="size-4 sm:size-6 text-red-500" />
              {cityName.city && (
                <span className="text-xs sm:text-lg text-white font-bold underline cursor-default">
                  {cityName.city}
                </span>
              )}
              {(cityName.state || cityName.country) && (
                <div
                  className="absolute top-[110%] left-3/4 transform -translate-x-1/2 mb-2 px-3 py-1
                             bg-black bg-opacity-70 text-white text-xs sm:text-sm rounded-xl whitespace-nowrap
                             opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50"
                >
                  {cityName.city}
                  {cityName.state && `, ${cityName.state}`}
                  {cityName.country && `, ${cityName.country}`}
                </div>
              )}
            </div>
          </div>

          {/* Toggle Buttons - Visible on mobile/tablet, hidden on desktop */}
          <div className="flex items-center gap-4 sm:hidden">
            <ToggleTempCF />
            <ToggleTheme />
          </div>
        </div>

        {/* Search Bar - Full width on mobile/tablet, flex-1 on desktop */}
        <div className="w-full sm:flex-1 sm:mx-6">
          <SearchBar />
        </div>

        {/* Toggle Buttons - Hidden on mobile/tablet, visible on desktop */}
        <div className="hidden sm:flex items-center gap-4">
          <ToggleTempCF />
          <ToggleTheme />
        </div>
      </div>
    </header>
  );
}