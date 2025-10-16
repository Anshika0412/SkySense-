import Home from "./pages/Home";
import dayBg from "./assets/daybg.jpeg";
import nightBg from "./assets/nightbg.jpeg";
import { useWeather } from "./context/WeatherContext";

function App() {
  const { darkMode } = useWeather(); // get dark mode state

  return (
    <div
      className="transition-colors duration-700 w-full min-h-screen text-blue-50 dark:text-gray-300"
      style={{
        backgroundImage: `url(${darkMode ? nightBg : dayBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Home />
    </div>
  );
}

export default App;
