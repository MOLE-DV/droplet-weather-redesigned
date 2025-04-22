export type WeatherDataType = {
  c_temp: number;
  c_feels_like: number;
  c_wind_speed: number;
  c_humidity: number;
  c_uv_index: number;
  c_weather: string;
  forecast: Array<{
    day: number;
    high: number;
    low: number;
    weather: string;
  }>;
  last_update: Date;
  location: string;
};
