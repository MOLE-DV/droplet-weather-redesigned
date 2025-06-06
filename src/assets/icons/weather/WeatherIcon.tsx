type props = {
  name: string;
  className?: string;
};

import weatherIconsSVG from "./svg/getWeatherIconSVG";

export const WeatherIcon = ({ name, className }: props) => {
  return (
    <img
      className={className}
      src={
        weatherIconsSVG[
          name && Object.keys(weatherIconsSVG).includes(name) ? name : "unknown"
        ]
      }
    />
  );
};
