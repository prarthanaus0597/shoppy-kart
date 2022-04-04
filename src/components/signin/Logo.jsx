import React from "react";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import "../css/signin.css";
import { NavLink } from "react-router-dom";

function Logo() {
  return (
    <NavLink className="logo_sec" to="/">
      <div className="logo">
        <div className="title">
          <h4 className="h3">
            <span style={{ color: "black" }}>Shoppy</span>
            <span style={{ color: "#ebd834" }}>Kart</span>
          </h4>
        </div>
        <LocalMallIcon sx={{ color: "black", marginLeft: "5px" }} />
      </div>
    </NavLink>
  );
}

export default Logo;
