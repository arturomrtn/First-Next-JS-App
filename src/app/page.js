"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  getWeatherCardBackground,
  glassmorphism,
  mainBackground,
  loaderAnimation,
} from "../styles/weatherStyles";

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [cityImage, setCityImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForecast, setShowForecast] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeatherByCoords(lat, lon);
      });
    }
  }, []);

  const fetchWeather = async () => {
    setLoading(true);
    setWeather(null);
    setForecast(null);
    setShowForecast(false);

    const weatherApiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    const unsplashApiKey = process.env.NEXT_PUBLIC_UNSPLASH_API_KEY;

    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${weatherApiKey}&units=metric`;
      const unsplashUrl = `https://api.unsplash.com/search/photos?query=${city}&client_id=${unsplashApiKey}&per_page=1`;

      const [weatherRes, forecastRes, imageRes] = await Promise.all([
        fetch(weatherUrl),
        fetch(forecastUrl),
        fetch(unsplashUrl),
      ]);

      const weatherData = await weatherRes.json();
      const forecastData = await forecastRes.json();
      const imageData = await imageRes.json();

      if (weatherRes.ok && forecastRes.ok) {
        setWeather(weatherData);
        setForecast(forecastData);
        setCityImage(
          imageData.results.length > 0 ? imageData.results[0].urls.regular : ""
        );
      } else {
        alert("City not found! Try again.");
        setWeather(null);
        setForecast(null);
        setCityImage("");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setWeather(null);
      setForecast(null);
      setCityImage("");
    }
    setLoading(false);
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    setWeather(null);
    setForecast(null);
    setShowForecast(false);

    const weatherApiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    const unsplashApiKey = process.env.NEXT_PUBLIC_UNSPLASH_API_KEY;

    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`;

      const [weatherRes, forecastRes] = await Promise.all([
        fetch(weatherUrl),
        fetch(forecastUrl),
      ]);

      const weatherData = await weatherRes.json();
      const forecastData = await forecastRes.json();

      if (weatherRes.ok && forecastRes.ok) {
        setWeather(weatherData);
        setForecast(forecastData);
        setCity(weatherData.name);

        const unsplashUrl = `https://api.unsplash.com/search/photos?query=${weatherData.name}&client_id=${unsplashApiKey}&per_page=1`;
        const imageRes = await fetch(unsplashUrl);
        const imageData = await imageRes.json();

        setCityImage(
          imageData.results.length > 0 ? imageData.results[0].urls.regular : ""
        );
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
    setLoading(false);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const toggleForecast = () => {
    setShowForecast(!showForecast);
  };

  const dailyForecast = forecast?.list?.reduce((acc, item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center text-white px-4 py-8 transition-all ${mainBackground}`}
    >
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
        Weather App
      </h1>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <input
          type="text"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value.trimStart())}
          className="p-3 w-full border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={fetchWeather}
          className="p-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition"
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {loading && (
        <div className="mt-6 flex items-center gap-3">
          <div className={loaderAnimation}></div>
          <p className="text-lg animate-pulse">Fetching Weather...</p>
        </div>
      )}

      {weather && !loading && !showForecast && (
        <div
          className={`mt-8 w-full max-w-sm ${getWeatherCardBackground(
            weather.weather[0].main.toLowerCase()
          )} ${glassmorphism} flex flex-col items-center transition-all p-6 rounded-lg`}
        >
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
            <p className="text-5xl font-extrabold">
              {Math.round(weather.main.temp)}°C
            </p>
            <Image
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              width={80}
              height={80}
              priority
              className="ml-3"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm mt-6 w-full">
            {[
              {label: "🌡 Feels Like", value: `${Math.round(weather.main.feels_like)}°C`},
              { label: "💧 Humidity", value: `${weather.main.humidity}%` },
              { label: "🌬 Wind Speed", value: `${weather.wind.speed} m/s` },
              { label: "🌅 Sunrise", value: formatTime(weather.sys.sunrise) },
              { label: "🌇 Sunset", value: formatTime(weather.sys.sunset) },
              { label: "☁️ Cloudiness", value: `${weather.clouds.all}%` },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center bg-white/10 rounded-xl p-3 shadow-sm"
              >
                <span className="text-sm opacity-80">{item.label}</span>
                <span className="text-xl font-bold">{item.value}</span>
              </div>
            ))}
          </div>

          <button
            onClick={toggleForecast}
            className="mt-6 p-2 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition"
          >
            Show 5-Day Forecast
          </button>
        </div>
      )}

      {forecast && !loading && showForecast && (
        <div
          className={`mt-8 w-full max-w-sm ${getWeatherCardBackground(
            weather.weather[0].main.toLowerCase()
          )} ${glassmorphism} flex flex-col items-center transition-all p-6 rounded-lg`}
        >
          <h2 className="text-2xl font-semibold">
            5-Day Forecast for {weather.name}
          </h2>

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

          <div className="w-full mt-4 space-y-4">
            {Object.entries(dailyForecast || {})
              .slice(0, 5)
              .map(([date, items]) => (
                <div
                  key={date}
                  className="flex items-center justify-between border-b border-white/30 pb-2"
                >
                  <div className="font-semibold">{formatDate(items[0].dt)}</div>
                  <div className="flex items-center">
                    <Image
                      src={`https://openweathermap.org/img/wn/${
                        items[4]?.weather[0]?.icon || items[0].weather[0].icon
                      }@2x.png`}
                      alt={items[0].weather[0].description}
                      width={40}
                      height={40}
                    />
                    <span className="ml-2">
                      {Math.round(items[0].main.temp_max)}° /{" "}
                      {Math.round(items[0].main.temp_min)}°
                    </span>
                  </div>
                </div>
              ))}
          </div>

          <button
            onClick={toggleForecast}
            className="mt-4 p-2 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition"
          >
            Back to Current Weather
          </button>
        </div>
      )}
    </div>
  );
}
