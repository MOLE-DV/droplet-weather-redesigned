import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { WeatherDataType } from "../types/weather_data";
import { fetchWeatherData } from "../fetchWeatherData";
import { usePopupContext } from "./PopupContext";

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
  const { setVisible } = usePopupContext();

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
      setVisible(true);
      if (!localWeatherData || last_update >= 60) {
        try {
          const fetchedWeatherData = localWeatherData
            ? await fetchWeatherData(
                localWeatherData.location,
                localWeatherData.locationLabel
              )
            : await fetchWeatherData("London", "London");
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
      setVisible(false);
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
