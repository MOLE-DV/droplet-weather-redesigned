import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { WeatherDataType } from "../types/weather_data";
import { fetchWeatherData } from "../fetchWeatherData";

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

  useEffect(() => {
    const getWeatherData = async () => {
      const localWeatherData =
        localStorage.getItem("weather_data") != "undefined"
          ? (JSON.parse(
              localStorage.getItem("weather_data") as string
            ) as WeatherDataType)
          : null;

      // If the local weather data is null or the last update was more than 60 minutes ago, fetch new data
      const last_update = localWeatherData
        ? Math.abs(
            Math.floor(
              (new Date().getTime() -
                new Date(localWeatherData.last_update).getTime()) /
                1000 /
                60
            )
          )
        : 0;
      console.log(`Last update of data: ${last_update} minutes ago`);
      if (!localWeatherData || last_update >= 60) {
        try {
          console.log("Fetching weather data from API...");
          const fetchedWeatherData = await fetchWeatherData(
            "Proboszczowice 98-290"
          );
          console.log("fetched_weather_data: ", fetchedWeatherData);

          localStorage.setItem(
            "weather_data",
            JSON.stringify(fetchedWeatherData)
          );
          setWeatherData(fetchedWeatherData);
        } catch (error) {
          console.error("Error fetching weather data:", error);
          setWeatherData(null);
        }
      } else {
        console.log("Using cached weather data...");
        setWeatherData(localWeatherData);
      }
    };
    getWeatherData();
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
