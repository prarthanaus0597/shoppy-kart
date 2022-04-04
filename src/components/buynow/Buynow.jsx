import { Divider } from "@mui/material";
import React, { useEffect, useState } from "react";
import "../css/buynow.css";
import Empty from "./Empty";
import Option from "./Option";
import Right from "./Right";
import Subtotal from "./Subtotal";
// import { products } from "../data";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { useParams } from "react-router-dom";

const Buynow = () => {
  const [cartdata, setCartdata] = useState("");
  const { uid } = useParams("");
  const getdatabuy = async () => {
    const res = await fetch(`/addcart/cartdetails/${uid}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await res.json();

    if (res.status === 200) {
      setCartdata(data);
    } else if (res.status === 425) {
      setCartdata("");
    }
  };

  useEffect(() => {
    getdatabuy();
  }, [uid]);
  return (
    <>
      <Header />
      {cartdata.length ? (
        <div className="buynow_section">
          <div className="buynow_container">
            <div className="left_buy">
              <h1>Shopping Cart</h1>

              <span className="leftbuyprice">Price</span>
              <Divider />

              {cartdata.map((e, ind) => {
                return (
                  <>
                    <div className="item_containert" key={ind}>
                      <img src={e.image_url} alt="imgitem" key={ind} />
                      <div className="item_details">
                        <h3>{e.long_title}</h3>
                        <h3>{e.short_title}</h3>
                        <h3 className="diffrentprice">
                          ₹{e.cost.toLocaleString("en-IN")}
                        </h3>
                        <p className="unusuall">
                          Usually dispatched in 4 days.
                        </p>
                        {e.cost >= 499 ? (
                          <p>Eligible for FREE Shipping</p>
                        ) : (
                          <p>
                            Add {499 - e.cost} to be eligible for FREE Shipping
                          </p>
                        )}

                        <Option deletedata={e.pid} get={getdatabuy} />
                      </div>
                      <h3 className="item_price">
                        ₹{e.cost.toLocaleString("en-IN")}.00
                      </h3>
                    </div>
                    {/* {setcount(0)} */}
                    <Divider />
                  </>
                );
              })}

              <Subtotal items={cartdata} />
            </div>
            <Right items={cartdata} uid={uid} />
          </div>
        </div>
      ) : (
        <Empty />
      )}
      <Footer />
    </>
  );
};

export default Buynow;
