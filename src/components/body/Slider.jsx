import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import "../css/slider.css";
import Countdown from "react-countdown";
import { NavLink } from "react-router-dom";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

function Slider({ timer, title, set, category }) {
  return (
    <>
      <div className="products_section">
        <div className="products_deal">
          <h3>
            {title}
            {timer ? (
              <>
                {" "}
                <img
                  alt="watch"
                  src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/timer_a73398.svg"
                  style={{ height: "30px", marginLeft: 5 }}
                ></img>{" "}
                <div style={{ color: "gray", marginLeft: 5 }}>
                  <Countdown date={Date.now() + 5.04e7} />
                </div>
              </>
            ) : (
              <></>
            )}
          </h3>
          <NavLink to={`/viewall/${set}`}>
            <button className="view_btn">View All</button>
          </NavLink>
        </div>

        <Carousel
          responsive={responsive}
          infinite={true}
          draggable={false}
          swipeable={true}
          centerMode={true}
          autoPlay={true}
          autoPlaySpeed={2000}
          keyBoardControl={true}
          showDots={false}
          removeArrowOnDeviceType={["tablet", "mobile"]}
          dotListClass="custom-dot-list-style"
          itemClass="carousel-item-padding-40-px"
          containerClass="carousel-container"
        >
          {category.map((item) => (
            <NavLink to={`/getproducts/all/${item.pid}`}>
              <div className="products_items">
                <div className="product_img">
                  <img src={item.image_url} alt="" />
                </div>
                <p className="products_name">
                  <strong>{item.short_title}</strong>
                </p>
                <p className="products_offer" style={{ color: "green" }}>
                  {item.discounts}
                </p>
                <p className="products_explore" style={{ color: "#007185" }}>
                  {item.tagline}
                </p>
              </div>
            </NavLink>
          ))}
        </Carousel>
      </div>
    </>
  );
}

export default Slider;
