import React from "react";
import { navData } from "../data";

import { Typography } from "@mui/material";
import "../css/body.css";
import { NavLink } from "react-router-dom";
function Body() {
  return (
    <>
      <div className="grid-container">
        {navData.map((data) => (
          <NavLink
            to={data.to}
            style={{ textDecoration: "none", color: "black" }}
          >
            <div className="grid-item" key={data.url}>
              <img className="image" src={data.url} alt="" key={data.url}></img>
              <Typography className="text" key={data.text}>
                {data.text}
              </Typography>
            </div>
          </NavLink>
        ))}
      </div>
    </>
  );
}

export default Body;
