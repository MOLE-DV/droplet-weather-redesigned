import { useState } from "react";
import { useWeatherData } from "../../contexts/WeatherDataContext";
import { Day } from "./Day";
import { Graph } from "./Graph";
import "./hourInfo.sass";
import InfoBox from "../../components/infobox/InfoBox";

export const HourInfo = () => {
  const { weatherData } = useWeatherData();
  const [selectedDay, setSelectedDay] = useState<number>(0);

  return (
    <div className="pages hour-info-container">
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
          unit="km/h"
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
    </div>
  );
};
