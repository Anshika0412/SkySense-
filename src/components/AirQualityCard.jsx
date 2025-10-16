import { useWeather } from "../context/WeatherContext";

export default function AirQualityCard() {
  const { aqi, loading } = useWeather();

  // 🌫️ Show shimmer while loading
  if (loading) {
    return (
      <div
        className=" w-[22%] sm:w-full min-h-24 sm:min-h-36 relative py-2 px-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg
        overflow-hidden animate-pulse"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-300/10 to-gray-600/10 opacity-20 blur-xl"></div>

        <div className="relative z-10 text-center space-y-3">
          {/* Title shimmer */}
          <div className="h-5 w-32 sm:w-40 bg-white/20 mx-auto rounded"></div>
          <div className="flex items-center justify-around mt-3">
              <div className="h-14 w-14 bg-white/20 rounded-xl"></div>
              <div className="h-8 w-16 bg-white/20 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // 🚫 Don’t render anything if no AQI data after loading
  if (aqi === null) return null;

  // 🩵 Define AQI levels and advice
  const getAQIInfo = (aqi) => {
    if (aqi <= 50)
      return {
        level: "Good 😊",
        advice: "Perfect day to go outside!",
        bgColor: "from-green-400 to-emerald-500",
        textColor: "text-green-500",
      };
    if (aqi <= 100)
      return {
        level: "Moderate 😐",
        advice: "You can go out, but be cautious.",
        bgColor: "from-yellow-400 to-amber-500",
        textColor: "text-yellow-500",
      };
    if (aqi <= 150)
      return {
        level: "Unhealthy for Sensitive 😷",
        advice: "Limit outdoor activities.",
        bgColor: "from-orange-400 to-red-400",
        textColor: "text-orange-500",
      };
    if (aqi <= 200)
      return {
        level: "Unhealthy 😣",
        advice: "Better stay indoors today.",
        bgColor: "from-red-500 to-pink-500",
        textColor: "text-red-600",
      };
    return {
      level: "Hazardous ☠️",
      advice: "Stay indoors and avoid exertion!",
      bgColor: "from-purple-600 to-red-600",
      textColor: "text-purple-700",
    };
  };

  const { level, advice, bgColor, textColor } = getAQIInfo(aqi);

  return (
    <div className="max-h-40 relative p-2 sm:py-3 sm:px-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg overflow-hidden transition-all duration-500">
      {/* Animated gradient background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${bgColor} opacity-30 blur-xl animate-pulse`}
      ></div>

      {/* Content */}
      <div className="relative z-10 text-center sm:space-y-2">
        <h2 className="text-xs lg:text-xl font-semibold drop-shadow tracking-wider">
          Should I go Outside?
        </h2>

        <div className="flex flex-col lg:flex-row items-center justify-around">
          <div className="flex flex-col  items-center justify-center">
            <p className={`text-3xl lg:text-5xl font-bold lg:my-1 ${textColor}`}>
              {aqi}
            </p>
            <h2 className="text-[6px] lg:text-[8px] drop-shadow">Air Quality Index</h2>
          </div>

          <div className="flex flex-col items-center lg:items-start font-semibold">
            <p className="text-[9px] lg:text-base">{level}</p>
            <p className="text-xs lg:text-sm italic">{advice}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
