import cities from "./assets/json/cities.json";
export const findSimiliarCities = (input: string, limit: number) =>
  Object.values(cities)
    .filter(
      (city_obj) =>
        city_obj.name.toLowerCase().search(input.toLowerCase()) === 0
    )
    .reverse()
    .slice(0, limit);
