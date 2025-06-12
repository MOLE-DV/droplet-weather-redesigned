import { useState } from "react";
import { useWeatherData } from "../../contexts/WeatherDataContext";
import { Day } from "./Day";
import { Graph } from "./Graph";
import "./hourInfo.sass";
import InfoBox from "../../components/infobox/InfoBox";
import useSettingsContext from "../../contexts/SettingsContext";
import { motion } from "framer-motion";
export const HourInfo = () => {
  const { weatherData } = useWeatherData();
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const { unitType } = useSettingsContext();
  console.log("Current location:", location.pathname);

  return (
    <motion.div
      className="pages hour-info-container"
      initial={{ transform: "translateY(-100%)", opacity: 0 }}
      animate={{ transform: "translateY(0%)", opacity: 1 }}
      exit={{ transform: "translateY(-100%)", opacity: 0 }}
    >
      <Graph day={selectedDay} />
      <div className="day-picker" tabIndex={-1}>
        {weatherData &&
          Object.values(weatherData["forecast"].slice(0, 7)).map(
            (dayData, i) => {
              return (
                <Day
                  key={i}
                  weatherIconName={dayData.icon as string}
                  tempDay={dayData.tempmax as number}
                  tempNight={dayData.tempmin as number}
                  date={dayData.datetime as string}
                  onClick={() => setSelectedDay(i)}
                  selected={selectedDay === i}
                />
              );
            }
          )}
      </div>
      <div className="day-weather-info-container">
        <InfoBox
          title="Wind speed"
          content={
            weatherData ? weatherData.forecast[selectedDay].windspeed : 0
          }
          unit={unitType == "metric" ? "km/h" : "mph"}
          iconName="wind"
        />
        <InfoBox
          title="Humidity"
          content={weatherData ? weatherData.forecast[selectedDay].humidity : 0}
          unit="%"
          iconName="droplet"
        />
        <InfoBox
          title="Conditions"
          content={
            weatherData ? weatherData.forecast[selectedDay].conditions : 0
          }
          unit=""
          iconName="cloud"
        />
        <InfoBox
          title="UV Index"
          content={weatherData ? weatherData.forecast[selectedDay].uvindex : 0}
          unit=""
          iconName="sun"
        />
      </div>
    </motion.div>
  );
};
