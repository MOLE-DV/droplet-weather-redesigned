// import snow_i from "./svg/universal/snow.svg";
// import snow_showers_day_i from './svg/day/snow-showers-day.svg';
// import snow_showers_night_i from './svg/night/snow-showers-night.svg';
// import thunder_rain_i from './svg/universal/thunder-rain.svg';
// import thunder_showers_day_i from './svg/day/thunder-showers-day.svg';
// import thunder_showers_night_i from './svg/night/thunder-showers-night.svg';
// import rain_i from './svg/universal/rain.svg';
// import showers_day_i from './svg/day/showers-day.svg';
// import showers_night from ''

import React, { useEffect, useState } from "react";

type props = {
  name: string;
};

const icons = import.meta.glob("./svg/**/*.svg", { eager: true }) as {
  [key: string]: { default: string };
};

export const WeatherIcon = ({ name }: props) => {
  const [icon, setIcon] = useState("");
  console.log(icons["./svg/universal/rain.svg"].default);
  switch (name) {
    case "snow":
  }
  return <img src={icon} />;
};
