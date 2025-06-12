import { useLocation, Routes, Route } from "react-router-dom";
import { Layout } from "../Layout";
import { Dashboard } from "./dashboard/Dashboard";
import { HourInfo } from "./hourInfo/HourInfo";
import { Settings } from "./settings/Settings";

import { AnimatePresence } from "framer-motion";

export const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/hourInfo" element={<HourInfo />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};
