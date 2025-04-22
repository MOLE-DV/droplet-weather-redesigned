import { createRoot } from "react-dom/client";
import { Layout } from "./Layout";
import "./assets/main.sass";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { WeatherDataProvider } from "./contexts/WeatherDataContext";

createRoot(document.getElementById("root")!).render(
  <WeatherDataProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </WeatherDataProvider>
);
