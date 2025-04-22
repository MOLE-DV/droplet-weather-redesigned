import { Link } from "react-router-dom";
import "./menu.sass";
import { DashboardIcon } from "../../assets/icons/DashboardIcon";
import { BuildingsIcon } from "../../assets/icons/BuildingIcon";
import { CalendarIcon } from "../../assets/icons/CalendarIcon";
import { InfoIcon } from "../../assets/icons/InfoIcon";

export const Menu = () => {
  return (
    <>
      <label className="dropdown-menu-button">
        <input type="checkbox" className="center" />
      </label>

      <header className="menu">
        <Link to={"/"} className="menu-link">
          <DashboardIcon className="icon" />
        </Link>
        <Link to={"/"} className="menu-link">
          <BuildingsIcon className="icon" />
        </Link>
        <Link to={"/"} className="menu-link">
          <CalendarIcon className="icon" />
        </Link>
        <Link to={"/"} className="menu-link info">
          <InfoIcon className="icon" />
        </Link>
      </header>
    </>
  );
};
