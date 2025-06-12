import { createRoot } from "react-dom/client";
import "./assets/main.sass";
import { BrowserRouter } from "react-router-dom";
import { WeatherDataProvider } from "./contexts/WeatherDataContext";
import { PopupContextProvider } from "./contexts/PopupContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import { AnimatedRoutes } from "./pages/AnimatedRoutes";

createRoot(document.getElementById("root")!).render(
  <SettingsProvider>
    <PopupContextProvider>
      <WeatherDataProvider>
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </WeatherDataProvider>
    </PopupContextProvider>
  </SettingsProvider>
);
