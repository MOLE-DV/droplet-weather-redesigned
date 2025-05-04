import axios from "axios";
import { WeatherDataType } from "./types/weather_data";

const api = axios.create({
  baseURL:
    "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline",
});

export const fetchWeatherData = async (
  location: string,
  locationLabel: string
) => {
  const apiKey = import.meta.env.VITE_API_KEY;

  try {
    console.log(`Fetching weather data from API for location: ${location}.`);

    return await api
      .get(
        `/${encodeURI(
          location
        )}?unitGroup=metric&key=${apiKey}&contentType=json&iconSet=icons2`
      )
      .then((res: any) => {
        if (res == null) return null;
        console.log("Succesfully fetched from API.");
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
          locationLabel,
        } as WeatherDataType;
      });
  } catch (error: any) {
    alert(`Failed to fetch weather information [ ${error.code} ]`);
    console.error(`Failed to fetch weather data: ${error}`);
  }
};
