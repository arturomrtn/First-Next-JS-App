export const getWeatherCardBackground = (condition) => {
    const backgrounds = {
      clear: "bg-gradient-to-r from-yellow-300 to-orange-500", 
      clouds: "bg-gradient-to-r from-gray-300 to-gray-500",
      rain: "bg-gradient-to-r from-blue-600 to-gray-800",
      thunderstorm: "bg-gradient-to-r from-gray-700 to-black",
      snow: "bg-gradient-to-r from-blue-200 to-blue-400",
      drizzle: "bg-gradient-to-r from-blue-400 to-gray-500", 
      mist: "bg-gradient-to-r from-gray-200 to-gray-400", 
    };
  
    return backgrounds[condition] || "bg-gradient-to-r from-blue-400 to-purple-500"; 
  
  };

  export const mainBackground = "bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500";
  
  export const glassmorphism = "bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg rounded-lg p-6";

  export const loaderAnimation = "animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full";
  
  