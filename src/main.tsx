import { createRoot } from "react-dom/client";
import { Layout } from "./Layout";
import "./assets/main.sass";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { WeatherDataProvider } from "./contexts/WeatherDataContext";
import { PopupContextProvider } from "./contexts/PopupContext";
import { HourInfo } from "./pages/hourInfo/HourInfo";

createRoot(document.getElementById("root")!).render(
  <PopupContextProvider>
    <WeatherDataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/hourInfo" element={<HourInfo />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </WeatherDataProvider>
  </PopupContextProvider>
);
