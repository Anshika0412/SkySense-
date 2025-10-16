import Home from "./pages/Home";
import dayBg from "./assets/daybg.jpeg";
import nightBg from "./assets/nightbg.jpeg";
import { useState, useEffect } from "react";

function App() {
  const [isDay, setIsDay] = useState(true);

  // Example: You can toggle day/night based on time or any logic
  useEffect(() => {
    const hour = new Date().getHours();
    setIsDay(hour >= 6 && hour < 18); // day between 6AM-6PM
  }, []);

  return (
    <div
      className="transition-colors duration-700 w-[98vw] text-blue-50 dark:text-gray-300"
      style={{
        backgroundImage: `url(${isDay ? dayBg : nightBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <Home />
    </div>
  );
}

export default App;
