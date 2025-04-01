/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["images.unsplash.com"],
      remotePatterns: [
        {
          protocol: "https",
          hostname: "openweathermap.org",
          pathname: "/img/wn/**",
        },
      ],
    },
  };
  
  module.exports = nextConfig;

  
  
