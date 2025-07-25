import { useEffect, useRef } from "react";
import "./dashboard.sass";
import InfoBox from "../../components/infobox/InfoBox";
import { WeatherForcast } from "./WeatherForcast";
import { useWeatherData } from "../../contexts/WeatherDataContext";
import { WeatherIcon } from "../../assets/icons/weather/WeatherIcon";
import { LocationIcon } from "../../assets/icons/LocationIcon";
import useSettingsContext from "../../contexts/SettingsContext";
import { motion } from "framer-motion";

export const Dashboard = () => {
  const date = useRef(new Date());
  date.current.setHours(0, 0, 0, 0);
  const { weatherData } = useWeatherData();
  const { unitType } = useSettingsContext();

  useEffect(() => {
    const dateContainer = document.getElementById("main-date");
    setInterval(() => {
      const newDate = new Date();
      newDate.setHours(0, 0, 0, 0);

      if (newDate > date.current) {
        setTimeout(() => {
          dateContainer?.classList.toggle("fade-in", false);
          dateContainer?.classList.toggle("fade-out", true);
        }, 1000);
        setTimeout(() => {
          date.current = new Date();
          date.current.setHours(0, 0, 0, 0);
          dateContainer?.classList.toggle("fade-in", true);
          dateContainer?.classList.toggle("fade-out", false);
        }, 1500);
      }
    }, 60 * 1000);
  }, []);

  return (
    <motion.div
      className="pages dashboard-container"
      initial={{ transform: "translateY(-100%)", opacity: 0 }}
      animate={{ transform: "translateY(0%)", opacity: 1 }}
      exit={{ transform: "translateY(-100%)", opacity: 0 }}
    >
      <div className="current-temperature-container">
        <div className="top">
          <h1 className="temperature">
            <WeatherIcon
              name={weatherData ? weatherData.c_icon : ""}
              className="icon"
            />
            {weatherData ? Math.round(weatherData.c_temp) : 0}
            <span>{unitType == "us" ? <>&deg;F</> : <>&deg;C</>}</span>
          </h1>
        </div>
        <div className="bottom" id="main-date">
          <div className="date">
            {date.current.toLocaleDateString("en-US", { weekday: "long" })}{" "}
            {date.current.getDate()}th of{" "}
            {date.current.toLocaleDateString("en-US", { month: "long" })}
          </div>
          <div className="location">
            <LocationIcon className="icon" />
            {weatherData ? weatherData.locationLabel : ""}
          </div>
        </div>
      </div>
      <div className="weather-info-container">
        <InfoBox
          title="Wind speed"
          content={weatherData ? weatherData.c_wind_speed : 0}
          unit={unitType == "metric" ? "km/h" : "mph"}
          iconName="wind"
        />
        <InfoBox
          title="Humidity"
          content={weatherData ? weatherData.c_humidity : 0}
          unit="%"
          iconName="droplet"
        />
        <InfoBox
          title="Feels like"
          content={weatherData ? weatherData.c_feels_like : 0}
          unit={unitType == "us" ? "°F" : "°C"}
          iconName="thermometer"
        />
        <InfoBox
          title="UV Index"
          content={weatherData ? weatherData.c_uv_index : 0}
          unit=""
          iconName="sun"
        />
      </div>
      <WeatherForcast
        date={date.current}
        className="weather-forcast-container"
      />
    </motion.div>
  );
};
