import { useWeather } from "../context/WeatherContext";
import ForecastCard from "./ForecastCard";

export default function SevenDayForecast() {
  const { forecast, loading, error } = useWeather();

  // Shimmer component for loading state
  const ShimmerCard = () => (
    <div className="w-20 sm:w-24 h-24 sm:h-28 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl animate-pulse"></div>
  );

  if (loading) {
    return (
      <section className=" w-[55%] sm:w-full min-w-7xl sm:mx-auto p-6 text-center border bg-white/10 backdrop-blur-lg border-white/20 rounded-xl animate-pulse">
        <h2 className="text-xl font-semibold mb-2 text-center h-4 w-10 sm:w-28"></h2>
        <div className="flex gap-2 justify-between">
          {Array(7)
            .fill(0)
            .map((_, i) => (
              <ShimmerCard key={i} />
            ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full max-w-6xl mx-auto p-6 text-center">
        <p className="text-red-500">{error}</p>
      </section>
    );
  }

  if (!forecast || !forecast.daily) return null;

  return (
    <section className="max-h-[350px] lg:max-h-56 w-full p-3 pb-5 shadow-xl rounded-xl bg-white/10 backdrop-blur-lg border border-white/20">
      <h2 className="text-xl font-semibold mb-2 text-center">7-Day Forecast</h2>

      <div className="flex gap-3 lg:gap-2 items-center justify-stretch flex-wrap">
        {forecast.daily.time.slice(0, 7).map((_, i) => (
          <ForecastCard
            key={i}
            daily={forecast.daily}
            hourly={forecast.hourly}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}
