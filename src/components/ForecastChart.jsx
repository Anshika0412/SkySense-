import React, { useRef, useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { useWeather } from "../context/WeatherContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ForecastChart() {
  const { forecast, tempUnit, convertTemp, loading } = useWeather();
  // const scrollRef = useRef(null);

  const [startIndex, setStartIndex] = useState(0);
  const [chartWidth, setChartWidth] = useState(560);
  const [visibleCount, setVisibleCount] = useState(14);
  const [scrollStep, setScrollStep] = useState(8);

  // ✅ Handle responsive chart settings
  useEffect(() => {
    const updateLayout = () => {
      if (window.innerWidth < 1024) {
        // mobile + tablet
        setVisibleCount(6);
        setScrollStep(4);
        setChartWidth(5 * (window.innerWidth < 640 ? 55 : 60));
      } else {
        // desktop
        setVisibleCount(14);
        setScrollStep(8);
        setChartWidth(14 * 80);
      }
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  const formatHour = (hour) => {
    const period = hour >= 12 ? "PM" : "AM";
    const hr12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hr12} ${period}`;
  };

  const hourly = forecast?.hourly;
  const now = new Date();
  const hourlyData = [];

  if (hourly?.time?.length) {
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    for (let i = 0; i < hourly.time.length; i++) {
      const date = new Date(hourly.time[i]);
      if (date >= today && date < tomorrow) {
        hourlyData.push({
          time: formatHour(date.getHours()),
          hour: date.getHours(),
          temp: convertTemp(hourly.temperature_2m[i]),
          isNow:
            date.getDate() === now.getDate() &&
            date.getHours() === now.getHours(),
        });
      }
    }
  }

  const isDay = now.getHours() >= 6 && now.getHours() < 18;
  const gradientId = isDay ? "dayGradient" : "nightGradient";

  const temps = hourlyData.map((d) => d.temp);
  const minTemp = temps.length ? Math.min(...temps) : 0;
  const maxTemp = temps.length ? Math.max(...temps) : 0;
  const yDomain = [minTemp - 1, maxTemp + 1];

  const endIndex = startIndex + visibleCount;
  const visibleData = hourlyData.slice(startIndex, endIndex);

  // ✅ Responsive scroll step
  const scrollLeft = () => setStartIndex((prev) => Math.max(prev - scrollStep, 0));
  const scrollRight = () =>
    setStartIndex((prev) =>
      Math.min(prev + scrollStep, hourlyData.length - visibleCount)
    );

  useEffect(() => {
    if (!hourlyData.length) return;
    const currentIndex = hourlyData.findIndex((d) => d.isNow);
    if (currentIndex >= 0) {
      let initIndex = Math.max(0, currentIndex - Math.floor(visibleCount / 2));
      if (initIndex > hourlyData.length - visibleCount) {
        initIndex = hourlyData.length - visibleCount;
      }
      setStartIndex(initIndex >= 0 ? initIndex : 0);
    } else setStartIndex(0);
  }, [forecast, visibleCount]);

  if (loading) {
    return (
      <div className="relative min-h-40 w-[55%] sm:w-full rounded-xl pt-1 pb-2 px-9 mt-4
                      bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg  
                      transition-all duration-700 overflow-hidden animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-300/10 via-white/10 to-slate-300/10 opacity-30 blur-xl"></div>
        <div className="flex justify-between px-8 mt-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className=" w-10 h-10 sm:w-20 sm:h-20 gap-4 sm:gap-1 bg-white/20 rounded-xl animate-pulse"
              style={{
                animationDelay: `${i * 100}ms`,
                animationDuration: "1.2s",
              }}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (!forecast) return null;

  return (
    <div
      className="relative max-h-44 w-full rounded-xl pt-1 pb-2 px-9 
                    bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg  
                    transition-all duration-700 overflow-hidden"
    >
      <h3 className="text-sm sm:text-xl font-semibold text-center mb-2">
        Hourly Temperature
      </h3>

      {/* Scroll buttons */}
      <button
        onClick={scrollLeft}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/30 dark:bg-black/40 rounded-full hover:bg-white/50 dark:hover:bg-black/60 transition "
      >
        <ChevronLeft size={20} className="text-gray-800 dark:text-gray-200" />
      </button>
      <button
        onClick={scrollRight}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/30 dark:bg-black/40 rounded-full hover:bg-white/50 dark:hover:bg-black/60 transition "
      >
        <ChevronRight size={20} className="text-gray-800 dark:text-gray-200" />
      </button>

      {/* Chart */}
      <div className="overflow-x-hidden w-full">
        <LineChart
          width={chartWidth}
          height={130}
          data={visibleData}
          margin={{ top: 20, right: 20, left: 20 }}
        >
          <defs>
            <linearGradient id="dayGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <linearGradient id="nightGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            interval={0}
            tick={{ fill: "#e2e8f0", fontSize: 10 }}
          />
          <YAxis hide domain={yDomain} />
          <Tooltip
            cursor={false}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div
                    className=" p-1 sm:px-2 rounded-lg text-white text-xs sm:text-base"
                    style={{
                      background: isDay
                        ? "linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,220,150,0.3))"
                        : "linear-gradient(135deg, rgba(80,100,255,0.25), rgba(30,30,70,0.4))",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      textAlign: "center",
                    }}
                  >
                    {`${data.temp}°${tempUnit}`}
                  </div>
                );
              }
              return null;
            }}
          />

          <Line
            type="monotone"
            dataKey="temp"
            stroke={`url(#${gradientId})`}
            strokeWidth={3}
            dot={({ cx, cy, payload, index }) => {
              if (payload.isNow) {
                return (
                  <g key={`dot-${index}`}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={7}
                      fill="#facc15"
                      stroke="#1e3a8a"
                      strokeWidth={3}
                    >
                      <animate
                        attributeName="r"
                        values="7;8;7"
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                );
              }
              return (
                <circle
                  key={`dot-${index}`}
                  cx={cx}
                  cy={cy}
                  r={4}
                  fill="#fff"
                  stroke="#1e3a8a"
                  strokeWidth={2}
                  style={{
                    cursor: "pointer",
                    transformOrigin: `${cx}px ${cy}px`,
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.3)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                />
              );
            }}
            activeDot={{ r: 0 }}
          />
        </LineChart>
      </div>
    </div>
  );
}
