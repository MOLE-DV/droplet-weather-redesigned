import { DarkGradient } from "./assets/DarkGradient";
import { LightGradient } from "./assets/LightGradient";
import { Menu } from "./components/menu/Menu";
import { SearchBar } from "./components/searchbar/SearchBar";
import { Outlet } from "react-router-dom";
import {
  useWeatherData,
  WeatherDataProvider,
} from "./contexts/WeatherDataContext";
import { useEffect } from "react";
import { WeatherDataType } from "./types/weather_data";

export const Layout = () => {
  const { weatherData, setWeatherData } = useWeatherData();

  useEffect(() => {
    const localWeatherData = localStorage.getItem(
      "weather_data"
    ) as WeatherDataType | null;
  }, []);
  return (
    <>
      <LightGradient />
      <DarkGradient />
      <Menu />
      <SearchBar />
      <WeatherDataProvider>
        <Outlet />
      </WeatherDataProvider>
    </>
  );
};
