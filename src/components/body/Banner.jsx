import React from "react";
import Carousel from "react-material-ui-carousel";
import { bannerData } from "../data";
import "../css/banner.css";

function Banner() {
  return (
    <>
      <Carousel
        autoPlay={true}
        animation="slide"
        indicators={false}
        navButtonsAlwaysVisible={true}
        navButtonsProps={{
          style: {
            background: "#fff",
            color: "#494949",
            margin: 0,
          },
        }}
        className="carousel"
      >
        {bannerData.map((image, i) => (
          <>
            <img alt="" src={image} key={i} className="carousel_img"></img>
          </>
        ))}
      </Carousel>
    </>
  );
}

export default Banner;
