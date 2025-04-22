import { useEffect, useRef } from "react";
import { CloudIcon } from "../../assets/icons/weather/CloudIcon";
import "./dashboard.sass";
import InfoBox from "./InfoBox";
import { WeatherForcast } from "./WeatherForcast";

export const Dashboard = () => {
  const date = useRef(new Date());
  date.current.setHours(0, 0, 0, 0);

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
    <div className="dashboard-container">
      <div className="current-temperature-container">
        <div className="top">
          <CloudIcon className="icon" />
          <h1 className="temperature">
            18<span>&deg;C</span>
          </h1>
        </div>
        <div className="date" id="main-date">
          {date.current.toLocaleDateString("en-US", { weekday: "long" })}{" "}
          {date.current.getDate()}th of{" "}
          {date.current.toLocaleDateString("en-US", { month: "long" })}
        </div>
      </div>
      <div className="weather-info-container">
        <InfoBox title="Wind speed" content="10" unit="km/h" iconName="wind" />
        <InfoBox title="Humidity" content="60" unit="%" iconName="droplet" />
        <InfoBox
          title="Feels like"
          content="10"
          unit="&deg;C"
          iconName="thermometer"
        />
        <InfoBox title="UV Index" content="5" unit="" iconName="sun" />
      </div>
      <WeatherForcast
        date={date.current}
        className="weather-forcast-container"
      />
    </div>
  );
};
