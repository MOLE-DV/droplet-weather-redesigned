import axios from "axios";
import { WeatherDataType } from "./types/weather_data";

const api = axios.create({
  baseURL:
    "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline",
});

export const fetchWeatherData = async (location: string) => {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  try {
    await api
      .get(
        `/${encodeURI(
          location
        )}?unitGroup=metric&key=${apiKey}&contentType=json`
      )
      .then((res: any) => {
        if (res == null) return null;
        return {
          c_temp: res.currentConditions.temp,
          c_feels_like: res.currentConditions.feelslike,
          c_wind_speed: res.currentConditions.windspeed,
          c_humidity: res.currentConditions.humidity,
          c_uv_index: res.currentConditions.uvindex,
          c_weather: res.currentConditions.conditions,
          forecast: res.days,
          last_update: new Date(),
          location: location,
        } as WeatherDataType;
      });
  } catch (error) {
    console.error(`Failed to fetch weather data: ${error}`);
  }
};
