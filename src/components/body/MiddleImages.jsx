import React from "react";
import { ImageURL } from "../data";
import "../css/home.css";
import { NavLink } from "react-router-dom";

function MiddleImages() {
  return (
    <>
      <div className="wrap">
        {ImageURL.map((image) => (
          <NavLink to={image.to} style={{ textDecoration: "none" }}>
            <img src={image.image} alt={image.image} className="middle"></img>
          </NavLink>
        ))}
      </div>
    </>
  );
}

export default MiddleImages;
