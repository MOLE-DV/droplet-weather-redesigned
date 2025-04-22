import React, { createContext, useContext, useState, ReactNode } from "react";
import { WeatherDataType } from "../types/weather_data";

interface WeatherDataContextType {
  weatherData: WeatherDataType;
  setWeatherData: (data: WeatherDataType) => void;
}

const WeatherDataContext = createContext<WeatherDataContextType | undefined>(
  undefined
);

export const WeatherDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [weatherData, setWeatherData] = useState<any>(null);

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
