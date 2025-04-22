import axios from "axios";

export const fetchWeatherData = async (location: string) => {
    const c_date = new Date();
    axios.defaults.baseURL = "https://api.weatherapi.com/v1";
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
}