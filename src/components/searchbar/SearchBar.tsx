import { ChangeEvent, MouseEvent, useState } from "react";
import { SearchIcon } from "../../assets/icons/SearchIcon";
import "./searchbar.sass";
import cities from "../../assets/json/cities.json";
import countries from "../../assets/json/countries.json";
import { fetchWeatherData } from "../../fetchWeatherData";
import { useWeatherData } from "../../contexts/WeatherDataContext";
import { WeatherDataType } from "../../types/weather_data";
import { usePopupContext } from "../../contexts/PopupContext";

const findSimiliar = (input: string, limit: number) =>
  Object.values(cities)
    .filter(
      (city_obj) =>
        city_obj.name.toLowerCase().search(input.toLowerCase()) === 0
    )
    .reverse()
    .slice(0, limit);

export const SearchBar = () => {
  const { setWeatherData } = useWeatherData();
  const { setVisible } = usePopupContext();
  const [searchResults, setSearchResults] = useState<
    { name: string; lat: string; lng: string; country: string }[] | null
  >(null);

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const inputElement = e.currentTarget;
    setSearchResults(
      inputElement.value.length == 0
        ? null
        : findSimiliar(inputElement.value, 10)
    );
  };

  const changeCity = async (e: MouseEvent) => {
    const hintElement = e.currentTarget as HTMLButtonElement;
    const city_obj = JSON.parse(hintElement.value) as {
      name: string;
      lat: string;
      lng: string;
      country: string;
    };

    setVisible(true);
    const fetchedWeatherData = (await fetchWeatherData(
      `${city_obj.lat},${city_obj.lng}`,
      hintElement.innerText
    )) as WeatherDataType;

    if (!fetchWeatherData) return;

    localStorage.setItem("weather_data", JSON.stringify(fetchedWeatherData));
    setWeatherData(fetchedWeatherData);
    setVisible(false);
  };

  return (
    <nav className="searchbar">
      <button className="search-button">
        <SearchIcon className="icon" />
      </button>
      <input
        type="text"
        placeholder="Search your location"
        onChange={inputChangeHandler}
      />
      <div className={`hints ${searchResults === null ? "disabled" : ""}`}>
        {searchResults?.map((searchResult, i) => (
          <button
            className="hint"
            onClick={changeCity}
            key={i}
            value={JSON.stringify(searchResult)}
          >
            {searchResult.name},{" "}
            {countries[searchResult.country as keyof typeof countries]}
          </button>
        ))}
      </div>
    </nav>
  );
};
