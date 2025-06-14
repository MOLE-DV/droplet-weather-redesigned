import { WeatherIcon } from "../../assets/icons/weather/WeatherIcon";
import useSettingsContext from "../../contexts/SettingsContext";

type DayProps = {
  key?: number;
  weatherIconName?: string | undefined;
  date: string;
  tempDay: number;
  tempNight: number;
  onClick?: () => void;
  selected?: boolean;
};
export const Day = ({
  key,
  weatherIconName,
  date,
  tempDay,
  tempNight,
  onClick,
  selected = false,
}: DayProps) => {
  const { unitType } = useSettingsContext();
  return (
    <button
      className={`day-of-week ${selected ? "selected" : ""}`}
      key={key}
      onClick={onClick}
    >
      <div className="day-title">
        <WeatherIcon
          name={weatherIconName ? weatherIconName : "unknown"}
          className="day-icon"
        />
        {new Date(date as string).toLocaleDateString("en-US", {
          weekday: "long",
        })}
        <span>{date}</span>
      </div>
      <div className="day-temperatures">
        <div className="day-temperature">
          <WeatherIcon name="clear-day" className="day-temperature-icon" />
          {Math.round(tempDay)}
          <span className="day-temperature-unit">
            {unitType == "us" ? <>&deg;F</> : <>&deg;C</>}
          </span>
        </div>
        <div className="day-temperature">
          <WeatherIcon name="clear-night" className="day-temperature-icon" />
          {Math.round(tempNight)}
          <span className="day-temperature-unit">
            {unitType == "us" ? <>&deg;F</> : <>&deg;C</>}
          </span>
        </div>
      </div>
    </button>
  );
};
