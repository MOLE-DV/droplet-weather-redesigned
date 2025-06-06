import { createRoot } from "react-dom/client";
import { Layout } from "./Layout";
import "./assets/main.sass";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { WeatherDataProvider } from "./contexts/WeatherDataContext";
import { PopupContextProvider } from "./contexts/PopupContext";
import { HourInfo } from "./pages/hourInfo/HourInfo";
import { Settings } from "./pages/settings/Settings";
import { SettingsProvider } from "./contexts/SettingsContext";

createRoot(document.getElementById("root")!).render(
  <SettingsProvider>
    <PopupContextProvider>
      <WeatherDataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="/hourInfo" element={<HourInfo />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </WeatherDataProvider>
    </PopupContextProvider>
  </SettingsProvider>
);
