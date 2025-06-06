import { Link } from "react-router-dom";
import "./menu.sass";
import { DashboardIcon } from "../../assets/icons/DashboardIcon";
import { ChartIcon } from "../../assets/icons/ChartIcon";
import { InfoIcon } from "../../assets/icons/InfoIcon";
import { CogIcon } from "../../assets/icons/CogIcon";

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
        <Link to={"/hourInfo"} className="menu-link">
          <ChartIcon className="icon" />
        </Link>
        <Link to={"/settings"} className="menu-link">
          <CogIcon className="icon" />
        </Link>
        <Link to={"/"} className="menu-link info">
          <InfoIcon className="icon" />
        </Link>
      </header>
    </>
  );
};
