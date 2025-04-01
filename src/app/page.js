"use client";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [city, setCity] = useState(""); 
  const [weather, setWeather] = useState(null);
  const [cityImage, setCityImage] = useState("");

  const handleCityChange = (e) => {
    setCity(e.target.value.trimStart());
  };

  const fetchWeather = async () => {
    const weatherApiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    const unsplashApiKey = process.env.NEXT_PUBLIC_UNSPLASH_API_KEY;

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`;
    const unsplashUrl = `https://api.unsplash.com/search/photos?query=${city}&client_id=${unsplashApiKey}&per_page=1`;

    try {
      const weatherRes = await fetch(weatherUrl);
      const weatherData = await weatherRes.json();

      if (weatherRes.ok) {
        setWeather(weatherData);

        const imageRes = await fetch(unsplashUrl);
        const imageData = await imageRes.json();
        
        if (imageData.results.length > 0) {
          setCityImage(imageData.results[0].urls.regular);
        } else {
          setCityImage("");
        }
      } else {
        alert("City not found! Try again.");
        setWeather(null);
        setCityImage("");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setWeather(null);
      setCityImage("");
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
      <h1 className="text-4xl font-bold mb-6">🌤 Weather App</h1>
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Enter city..."
          value={city}
          onChange={handleCityChange}
          className="p-3 w-64 border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button 
          onClick={fetchWeather} 
          className="p-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition"
        >
          Search
        </button>
      </div>
      {weather && (
        <div className="mt-8 w-96 bg-gradient-to-r from-blue-400 to-purple-400 backdrop-blur-md p-6 rounded-lg shadow-xl flex flex-col items-center">
          <h2 className="text-2xl font-semibold">{weather.name}</h2>
          {cityImage && (
            <div className="w-full h-40 overflow-hidden rounded-lg mt-3">
              <Image 
                src={cityImage} 
                alt={`View of ${weather.name}`} 
                width={400} 
                height={160} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex items-center mt-4">
            <p className="text-5xl font-extrabold">{weather.main.temp}°C</p>
            <Image
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              width={80}
              height={80}
              priority
              className="ml-3"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm mt-4">
            <p className="text-lg">🌡 Feels like: <span className="font-semibold">{weather.main.feels_like}°C</span></p>
            <p className="text-lg">💧 Humidity: <span className="font-semibold">{weather.main.humidity}%</span></p>
            <p className="text-lg">🌬 Wind Speed: <span className="font-semibold">{weather.wind.speed} m/s</span></p>
            <p className="text-lg">🌅 Sunrise: <span className="font-semibold">{formatTime(weather.sys.sunrise)}</span></p>
            <p className="text-lg">🌇 Sunset: <span className="font-semibold">{formatTime(weather.sys.sunset)}</span></p>
            <p className="text-lg">☁️ Cloudiness: <span className="font-semibold">{weather.clouds.all}%</span></p>
          </div>
        </div>
      )}
    </div>
  );
}





