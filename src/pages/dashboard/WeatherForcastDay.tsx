import { ReactElement } from "react";

type props = {
  dayOfWeek: string;
  high: number;
  low: number;
  weatherIcon?: ReactElement;
};

export const WeatherForcastDay = ({
  dayOfWeek,
  high,
  low,
  weatherIcon,
}: props) => {
  return (
    <div className="weather-forcast-day">
      <div className="day-name">
        {weatherIcon}
        {dayOfWeek}
      </div>
      <div className="day-temperature">
        <span className="high">{high}&deg;C</span>
        <span className="low">{low}&deg;C</span>
      </div>
    </div>
  );
};
