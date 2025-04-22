import { DarkGradient } from "./assets/DarkGradient";
import { LightGradient } from "./assets/LightGradient";
import { Menu } from "./components/menu/Menu";
import { SearchBar } from "./components/searchbar/SearchBar";
import { Outlet } from "react-router-dom";

export const Layout = () => (
  <>
    <LightGradient />
    <DarkGradient />
    <Menu />
    <SearchBar />
    <Outlet />
  </>
);
