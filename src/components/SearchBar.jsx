// src/components/SearchBar.jsx
import { useState } from "react";
import { useWeather } from "../context/WeatherContext";
import {Search} from 'lucide-react';

export default function SearchBar() {
  const [city, setCity] = useState("");
  const { fetchWeather } = useWeather();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city);
      setCity(""); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex bg-white/20 w-full max-w-md mx-auto border-2 border-blue-400 hover:to-blue-600 rounded-xl">
      <input
        type="text"
        placeholder="Search city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="w-full p-1 px-4 rounded-xl bg-white/0 text-blue-500 placeholder-gray-300 outline-none"
      />
      <button
        type="submit"
        className="px-4 py-1  text-blue-500 text-base font-bold hover:text-blue-800"
      > <Search />
      </button>
    </form>
  );
}
