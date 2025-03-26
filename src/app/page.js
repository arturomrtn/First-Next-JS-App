"use client";
import { useState } from "react";
import Image from "next/image"; 

export default function Home() {
  const [city, setCity] = useState(""); 
  const [weather, setWeather] = useState(null); 

  const handleCityChange = (e) => {
    setCity(e.target.value.trimStart());
  };

  const fetchWeather = async () => {
    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (res.ok) {
        setWeather(data);
      } else {
        alert("City not found! Try again.");
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  return (
    <div className="text-center p-5">
      <h1 className="text-xl font-bold py-2">Weather App</h1>
      <input
        type="text"
        placeholder="Enter city..."
        value={city}
        onChange={handleCityChange}
        className="p-2 border border-gray-300 rounded mr-2"
      />
      <button 
        onClick={fetchWeather} 
        className="p-2 bg-blue-500 text-white rounded"
      >
        Get Weather
      </button>
      {weather && (
        <div className="mt-4 flex justify-center items-center">
          <h2 className="text-lg font-semibold">{weather.name}</h2>
          <Image
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
            width={100}
            height={100}
            priority
          />
          <div className="space-y-2">
          <p>{weather.main.temp}°C</p>
          <p>{weather.weather[0].description}</p>
          </div>
        </div>
      )}
    </div>
  );
}


