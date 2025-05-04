export type WeatherDataType = {
  c_temp: number;
  c_feels_like: number;
  c_wind_speed: number;
  c_humidity: number;
  c_uv_index: number;
  c_weather: string;
  c_icon: string;
  forecast: Array<{ [key: string]: string | number }>;
  last_update: Date;
  location: string;
  locationLabel: string;
};
