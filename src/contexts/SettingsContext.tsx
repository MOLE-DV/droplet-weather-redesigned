import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";

type UnitType = "metric" | "us" | "uk";

interface SettingsContextProps {
  unitType: UnitType;
  setUnitType: (unit: UnitType) => void;
  defaultLocation: string;
  setDefaultLocation: (location: string) => void;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(
  undefined
);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const settingsLocalStorage = localStorage.getItem("settings");
  const [unitType, setUnitType] = useState<UnitType>(
    settingsLocalStorage ? JSON.parse(settingsLocalStorage).unitType : "metric"
  );
  const [defaultLocation, setDefaultLocation] = useState<string>(
    settingsLocalStorage
      ? JSON.parse(settingsLocalStorage).defaultLocation
      : "Warsaw"
  );

  useEffect(() => {
    localStorage.setItem(
      "settings",
      JSON.stringify({ unitType, defaultLocation })
    );
  }, [unitType]);

  return (
    <SettingsContext.Provider
      value={{
        unitType,
        setUnitType,
        defaultLocation,
        setDefaultLocation,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error(
      "useSettingsContext must be used within a SettingsContextProvider"
    );
  }
  return context;
};

export default useSettingsContext;
