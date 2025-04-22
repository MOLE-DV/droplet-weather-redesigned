import { DarkGradient } from "./assets/DarkGradient";
import { LightGradient } from "./assets/LightGradient";
import { Menu } from "./components/menu/Menu";
import { SearchBar } from "./components/searchbar/SearchBar";
import { Outlet } from "react-router-dom";
import { WeatherDataProvider } from "./contexts/WeatherDataContext";

export const Layout = () => (
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
