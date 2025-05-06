import { WeatherIcon } from "../../assets/icons/weather/WeatherIcon";
import { useWeatherData } from "../../contexts/WeatherDataContext";
import { WeatherForcastDay } from "./WeatherForcastDay";

type props = {
  date: Date;
  className?: string;
};

export const WeatherForcast = ({ date, className }: props) => {
  const { weatherData } = useWeatherData();
  return (
    <div className={className}>
      {[1, 2, 3, 4, 5, 6].map((day, i) => (
        <>
          <WeatherForcastDay
            key={day - 1}
            dayOfWeek={new Date(
              date.getTime() + day * 24 * 60 * 60 * 1000
            ).toLocaleDateString("en-US", { weekday: "long" })}
            high={weatherData ? weatherData.forecast[day].tempmax : 0}
            low={weatherData ? weatherData.forecast[day].tempmin : 0}
            weatherIcon={
              <WeatherIcon
                name={
                  weatherData ? weatherData.forecast[i].icon.toString() : ""
                }
                className="icon"
              />
            }
          />
          {day !== 6 && <div className="divider" key={day} />}
        </>
      ))}
    </div>
  );
};
