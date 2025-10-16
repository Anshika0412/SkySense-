import ForecastChart from "../components/ForecastChart";
import Header from "../components/Header";
import SevenDayForecast from "../components/SevenDayForecast";
import TodayForecastCard from "../components/TodayForecastCard";
import AirQualityCard from "../components/AirQualityCard";
import TodayWeatherDetails from "../components/TodayWeatherDetails";
import { useWeather } from "../context/WeatherContext";
import Footer from "../components/Footer";

export default function Home() {
  const { error, forecast, loading } = useWeather();

  // Show error if data or city not found
  if (!loading && (error || !forecast || !forecast.daily)) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 text-center">
        <div className="fixed top-0  left-4 right-6 sm:left-10 sm:right-10 sm:w-[92%] z-50">
          <Header />
        </div>
        <div className="mt-8  text-red-700 px-6 py-4 rounded-xl shadow-lg max-w-md bg-white/10 backdrop-blur-lg border border-white/20">
          <h2 className="text-2xl font-semibold mb-2">City or data not found</h2>
          <p className="text-white">Try another nearby city or check your internet connection.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full px-4 lg:px-8">
      <Header />

      <div className="w-full flex flex-col gap-y-[272px] md:gap-y-[300px] lg:gap-0">
        <div className="max-h-80 grid lg:grid-cols-[30%_69%] py-2 gap-2">
          <div className="flex lg:flex-col gap-2 ">
            <TodayForecastCard />
            <AirQualityCard />
          </div>

          <div className="flex flex-col-reverse lg:flex-col gap-2">
            <SevenDayForecast />
            <TodayWeatherDetails />
          </div>
        </div>

        <div >
          <ForecastChart />
        </div>
      </div>
      <Footer/>
    </div>
  );
}
