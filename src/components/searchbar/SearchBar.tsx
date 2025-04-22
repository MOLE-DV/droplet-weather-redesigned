import { SearchIcon } from "../../assets/icons/SearchIcon";
import "./searchbar.sass";

export const SearchBar = () => {
  return (
    <nav className="searchbar">
      <button className="search-button">
        <SearchIcon className="icon" />
      </button>
      <input type="text" placeholder="Search your location" />
    </nav>
  );
};
