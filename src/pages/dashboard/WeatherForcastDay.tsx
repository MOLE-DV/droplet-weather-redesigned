import { ReactElement } from "react";
import useSettingsContext from "../../contexts/SettingsContext";

type props = {
  dayOfWeek: string;
  high: number | string;
  low: number | string;
  weatherIcon?: ReactElement;
};

export const WeatherForcastDay = ({
  dayOfWeek,
  high,
  low,
  weatherIcon,
}: props) => {
  const { unitType } = useSettingsContext();
  return (
    <div className="weather-forcast-day">
      <div className="day-name">
        {weatherIcon}
        {dayOfWeek}
      </div>
      <div className="day-temperature">
        <span className="high">
          {high}
          {unitType == "us" ? <>&deg;F</> : <>&deg;C</>}
        </span>
        <span className="low">
          {low} {unitType == "us" ? <>&deg;F</> : <>&deg;C</>}
        </span>
      </div>
    </div>
  );
};
