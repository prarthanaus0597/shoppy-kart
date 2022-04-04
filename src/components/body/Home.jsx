import React, { useEffect } from "react";
import Body from "./Body";
import "../css/home.css";
import Banner from "../body/Banner";
import Slider from "./Slider";
import MiddleImages from "./MiddleImages";
import { Divider } from "@mui/material";
import { getProducts } from "../redux/actions/action";
import { connect, useSelector } from "react-redux";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { NavLink } from "react-router-dom";

const Home = ({ products }) => {
  const { discount } = useSelector((state) => state.getproductsdiscountdata);
  const { electronics } = useSelector((state) => state.getproductselectdata);
  const { books } = useSelector((state) => state.getproductsbooksdata);
  const { grocery } = useSelector((state) => state.getproductsgrocerydata);
  const { mobile } = useSelector((state) => state.getproductsmobiledata);
  const { fashion } = useSelector((state) => state.getproductsfashiondata);
  const { furniture } = useSelector((state) => state.getproductsfurnituredata);
  const { appliance } = useSelector((state) => state.getproductsappliancedata);
  const { others } = useSelector((state) => state.getproductsothersdata);

  useEffect(() => {
    products();
  }, []);

  return (
    <>
      <Header></Header>
      <Body />

      <div className="home_section">
        <div className="banner_part">
          <Banner />
        </div>
        <Divider></Divider>
        <div className="slide_part">
          <div className="left_slide">
            <Slider
              timer={true}
              title="Deal of the day"
              set="discount"
              category={discount}
            />
          </div>
          <div className="right_slide">
            <NavLink to="/viewall/furniture" style={{ textDecoration: "none" }}>
              <h4 style={{ marginBottom: 10 }}>India Ka furniture Store</h4>

              <img
                src="https://rukminim1.flixcart.com/flap/464/708/image/633789f7def60050.jpg?q=70"
                alt=""
              ></img>
            </NavLink>
          </div>
        </div>
        <Divider></Divider>
        <div className="middle_img">
          <MiddleImages />
        </div>
        <Slider
          timer={false}
          title="Books for You"
          set="books"
          category={books}
        />
        <Slider
          timer={false}
          title="Electronics for You"
          set="electronics"
          category={electronics}
        />
        <Slider
          timer={false}
          title="Grocery for You"
          set="grocery"
          category={grocery}
        />
        <Slider
          timer={false}
          title="Mobile Phones for You"
          set="mobile"
          category={mobile}
        />
        <Slider
          timer={false}
          title="Clothes for You"
          set="fashion"
          category={fashion}
        />
        <Slider
          timer={false}
          title="Furniture for You"
          set="furniture"
          category={furniture}
        />
        <Slider
          timer={false}
          title="Appliances for You"
          set="appliance"
          category={appliance}
        />
        <Slider timer={false} title="Others" set="others" category={others} />
      </div>
      <Footer></Footer>
    </>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    products: () => {
      dispatch(getProducts());
    },
  };
};

export default connect(null, mapDispatchToProps)(Home);
