import { useEffect, useRef, useState } from "react";
import { ThermometerIcon } from "../../assets/icons/weather/ThermometerIcon";
import useSettingsContext from "../../contexts/SettingsContext";
import "./settings.sass";
import { UnitType } from "../../types/unitType";
import { useWeatherData } from "../../contexts/WeatherDataContext";
import { fetchWeatherData } from "../../fetchWeatherData";
import { findSimiliarCities } from "../../findSimiliarCities";
import countries from "../../assets/json/countries.json";
import { motion } from "framer-motion";

export const Settings = () => {
  const { unitType, setUnitType, defaultLocation, setDefaultLocation } =
    useSettingsContext();
  const { setWeatherData } = useWeatherData();
  const [searchResults, setSearchResults] = useState<
    { name: string; lat: string; lng: string; country: string }[] | null
  >(null);
  const defaultLocationInputRef = useRef(null);
  const [popup, setPopup] = useState({ visible: false, message: "" });

  const [unsavedSettings, setUnsavedSettings] = useState<{
    unitType: UnitType;
    defaultLocation: string;
  }>({ unitType, defaultLocation });

  const displayPopup = (message: string) => {
    setPopup({ visible: true, message: message });
    setTimeout(() => {
      setPopup((prev) => ({ ...prev, visible: false }));
    }, 2000);
  };
  return (
    <motion.div
      className="pages settings"
      initial={{ transform: "translateY(-100%)", opacity: 0 }}
      animate={{ transform: "translateY(0%)", opacity: 1 }}
      exit={{ transform: "translateY(-100%)", opacity: 0 }}
    >
      <div className={`popup ${popup.visible ? "visible" : "hidden"}`}>
        {popup.message}
      </div>
      <div className="options">
        <label className="option select">
          <div className="title">
            <ThermometerIcon className="icon" /> Unit type:{" "}
          </div>
          <select
            className="dropdown"
            onChange={(e) => {
              const dropDownValue = e.currentTarget.value;
              setUnsavedSettings((prev) => ({
                ...prev,
                unitType: dropDownValue as UnitType,
              }));
            }}
            defaultValue={unitType}
          >
            <option value="metric">metric (km/h, &deg;C)</option>
            <option value="us">US (mph, &deg;F)</option>
            <option value="uk">UK (mph, &deg;C)</option>
          </select>
        </label>
        <label className="option input">
          <div className="title">
            <ThermometerIcon className="icon" /> Default location:{" "}
          </div>
          <div className="content">
            <input
              type="text"
              className="defaultLocationInput"
              placeholder={defaultLocation}
              ref={defaultLocationInputRef}
              onChange={(e) => {
                const defaultLocationInputValue = e.currentTarget.value;
                if (defaultLocationInputValue.length == 0) {
                  setSearchResults(null);
                } else {
                  setSearchResults(
                    findSimiliarCities(defaultLocationInputValue, 3)
                  );
                }
              }}
            />
            <div className="cityNames">
              {searchResults &&
                searchResults.map((city, i) => (
                  <button
                    key={i}
                    value={`${city.name}, ${
                      countries[city.country as keyof typeof countries]
                    }`}
                    className="cityName"
                    onClick={(e) => {
                      if (!defaultLocationInputRef.current) return;
                      const defaultLocationInput =
                        defaultLocationInputRef.current as HTMLInputElement;
                      const cityName = e.currentTarget.value;

                      defaultLocationInput.value = cityName;

                      setSearchResults(null);
                      setUnsavedSettings((prev) => ({
                        ...prev,
                        defaultLocation: cityName,
                      }));
                    }}
                  >
                    {city.name},{" "}
                    {countries[city.country as keyof typeof countries]}
                  </button>
                ))}
            </div>
          </div>
        </label>
        <button
          className="save"
          onClick={async () => {
            if (
              unitType != unsavedSettings.unitType ||
              defaultLocation != unsavedSettings.defaultLocation
            ) {
              const fetchedWeatherData = await fetchWeatherData(
                unsavedSettings.defaultLocation,
                unsavedSettings.defaultLocation,
                unsavedSettings.unitType
              );
              if (!fetchedWeatherData) return;
              setWeatherData(fetchedWeatherData);
              localStorage.setItem(
                "weather_data",
                JSON.stringify(fetchedWeatherData)
              );
              displayPopup("Settings saved successfully!");
            } else {
              displayPopup("No changes to save.");
            }

            setDefaultLocation(unsavedSettings.defaultLocation);
            setUnitType(unsavedSettings.unitType);
          }}
        >
          Save
        </button>
      </div>
    </motion.div>
  );
};
