import React from "react";
import { SunIcon } from "../../assets/icons/weather/SunIcon";
import { CloudIcon } from "../../assets/icons/weather/CloudIcon";
import { WindIcon } from "../../assets/icons/weather/WindIcon";
import { DropletIcon } from "../../assets/icons/weather/DropletIcon";
import { ThermometerIcon } from "../../assets/icons/weather/ThermometerIcon";

interface InfoBoxProps {
  title: string;
  content: string;
  unit: string;
  iconName?: string;
}

const InfoBox: React.FC<InfoBoxProps> = ({
  title,
  content,
  unit,
  iconName,
}) => {
  let icon = null;
  switch (iconName) {
    case "sun":
      icon = <SunIcon className="icon" />;
      break;
    case "cloud":
      icon = <CloudIcon className="icon" />;
      break;
    case "wind":
      icon = <WindIcon className="icon" />;
      break;
    case "droplet":
      icon = <DropletIcon className="icon" />;
      break;
    case "thermometer":
      icon = <ThermometerIcon className="icon" />;
      break;
  }
  return (
    <div className="weather-info-box">
      <div className="title">
        {icon}
        {title}
      </div>
      <div className="info">
        {content}
        <span className="unit">{unit}</span>
      </div>
    </div>
  );
};

export default InfoBox;
