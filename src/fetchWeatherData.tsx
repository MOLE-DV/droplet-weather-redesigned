import axios from "axios";
import { WeatherDataType } from "./types/weather_data";

const api = axios.create({
  baseURL:
    "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline",
});

export const fetchWeatherData = async (location: string) => {
  const apiKey = import.meta.env.VITE_API_KEY;

  try {
    return await api
      .get(
        `/${encodeURI(
          location
        )}?unitGroup=metric&key=${apiKey}&contentType=json`
      )
      .then((res: any) => {
        if (res == null) return null;
        console.log("res", res.data);
        return {
          c_temp: res.data.currentConditions.temp,
          c_feels_like: res.data.currentConditions.feelslike,
          c_wind_speed: res.data.currentConditions.windspeed,
          c_humidity: res.data.currentConditions.humidity,
          c_uv_index: res.data.currentConditions.uvindex,
          c_weather: res.data.currentConditions.conditions,
          c_icon: res.data.currentConditions.icon,
          forecast: res.data.days.splice(1),
          last_update: new Date(),
          location: location,
        } as WeatherDataType;
      });
  } catch (error) {
    console.error(`Failed to fetch weather data: ${error}`);
  }
};
