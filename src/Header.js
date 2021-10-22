import React from "react";
import "./Header.css";
import SearchIcon from "@mui/icons-material/Search";
import LanguageIcon from "@mui/icons-material/Language";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonIcon from "@mui/icons-material/Person";

function Header() {
  return (
    <div className="header">
      <img
        className="header__icon"
        src="https://blogravenridgecottages.files.wordpress.com/2021/04/airbnb-logo.jpeg"
      />

      <div className="header__center">
        <input type="text" />
        <SearchIcon />
      </div>

      <div className="header__right">
        <p>Become a host</p>
        <LanguageIcon />
        <ExpandMoreIcon />
        <PersonIcon />
      </div>
    </div>
  );
}

export default Header;
