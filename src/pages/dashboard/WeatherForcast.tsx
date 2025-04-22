import { CloudIcon } from "../../assets/icons/weather/CloudIcon";
import { WeatherForcastDay } from "./WeatherForcastDay";

type props = {
  date: Date;
  className?: string;
};

export const WeatherForcast = ({ date, className }: props) => {
  return (
    <div className={className}>
      {[1, 2, 3, 4, 5, 6].map((day) => (
        <>
          <WeatherForcastDay
            key={day - 1}
            dayOfWeek={new Date(
              date.getTime() + day * 24 * 60 * 60 * 1000
            ).toLocaleDateString("en-US", { weekday: "long" })}
            high={Math.floor(Math.random() * 10) + 20}
            low={Math.floor(Math.random() * 10) + 10}
            weatherIcon={<CloudIcon className="icon" />}
          />
          {day !== 6 && <div className="divider" key={day} />}
        </>
      ))}
    </div>
  );
};
