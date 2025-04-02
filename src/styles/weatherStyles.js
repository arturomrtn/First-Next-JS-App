export const getWeatherCardBackground = (condition) => {
    const backgrounds = {
      clear: "bg-gradient-to-r from-yellow-400 to-orange-500", // Sunny
      clouds: "bg-gradient-to-r from-gray-400 to-gray-700", // Cloudy
      rain: "bg-gradient-to-r from-blue-700 to-gray-900", // Rainy
      thunderstorm: "bg-gradient-to-r from-gray-800 to-black", // Storm
      snow: "bg-gradient-to-r from-blue-200 to-blue-400", // Snowy
      drizzle: "bg-gradient-to-r from-blue-500 to-gray-500", // Drizzle
      mist: "bg-gradient-to-r from-gray-300 to-gray-500", // Fog/Mist
    };
  
    return backgrounds[condition] || "bg-gradient-to-r from-blue-400 to-purple-400"; // Default
  };
  
  export const glassmorphism = "bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg rounded-lg p-6";
  