import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { WeatherDataType } from "../types/weather_data";

interface WeatherDataContextType {
  weatherData: WeatherDataType;
  setWeatherData: (data: WeatherDataType) => void;
}

const WeatherDataContext = createContext<WeatherDataContextType | undefined>(
  undefined
);

const newData = {
  c_temp: 20,
  c_feels_like: 15,
  c_wind_speed: 5,
  c_humidity: 60,
  c_uv_index: 3,
  c_weather: "Sunny",
  forecast: [
    {
      day: 1,
      high: 15,
      low: 5,
      weather: "Sunny",
    },
    {
      day: 2,
      high: 20,
      low: 3,
      weather: "Sunny",
    },
    {
      day: 3,
      high: 22,
      low: 15,
      weather: "Sunny",
    },
    {
      day: 4,
      high: 5,
      low: 2,
      weather: "Sunny",
    },
    {
      day: 5,
      high: 12,
      low: 10,
      weather: "Sunny",
    },
    {
      day: 6,
      high: 16,
      low: 4,
      weather: "Sunny",
    },
  ],
  last_update: new Date(),
  location: "Sieradz",
} as WeatherDataType;

export const WeatherDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [weatherData, setWeatherData] = useState<any>(null);

  useEffect(() => {
    const localWeatherData = JSON.parse(
      localStorage.getItem("weather_data") as string
    ) as WeatherDataType;

    // If the local weather data is null or the last update was more than 60 minutes ago, fetch new data
    if (
      !localWeatherData ||
      Math.abs(
        Math.floor(
          (new Date().getTime() -
            new Date(localWeatherData.last_update).getTime()) /
            1000 /
            60
        )
      ) >= 60
    ) {
      console.log("Fetching weather data from API...");
      localStorage.setItem("weather_data", JSON.stringify(newData));
      setWeatherData(newData);
    } else {
      console.log("Using cached weather data...");
      setWeatherData(localWeatherData);
    }
  }, []);

  return (
    <WeatherDataContext.Provider value={{ weatherData, setWeatherData }}>
      {children}
    </WeatherDataContext.Provider>
  );
};

export const useWeatherData = () => {
  const context = useContext(WeatherDataContext);
  if (!context) {
    throw new Error("useWeatherData must be used within a WeatherDataProvider");
  }
  return context;
};
