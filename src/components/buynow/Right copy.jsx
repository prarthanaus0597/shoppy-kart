import React, { useEffect, useState } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useNavigate } from "react-router-dom";
import Logo from "../signin/Logo";
import { Navigate } from "react-router-dom";
import Axios from "axios";
import useRazorpay from "react-razorpay";

const Right = ({ items, uid }) => {
  const Razorpay = useRazorpay();

  const [val, setVal] = useState(false);
  // const [red, setred] = useState(false);
  const [price, setPrice] = useState(0);

  const history = useNavigate("");

  useEffect(() => {
    totalAmount();
  }, [items]);

  const totalAmount = () => {
    let price = 0;
    items.map((item) => {
      price += item.cost;
    });
    setPrice(price);
  };

  // const proceesby = () => {
  //   alert("Your Order is Confirmed");
  //   setred(() => {
  //     return {
  //       red: true,
  //     };
  //   });
  // };

  const deletecart = async () => {
    const res = await fetch("/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items, uid }),
      credentials: "include",
    });
    const data_resp = await res.json();

    const resp = await fetch(`/addcart/removeall/${uid}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await resp.json();
    console.log("done");
    if (data) {
      history("/");
    }
  };

  //-----------------------------------------------------------------------------------------------------
  // this function will handel payment when user submit his/her money
  // and it will confim if payment is successfull or not
  const handlePaymentSuccess = async (response) => {
    try {
      let bodyData = new FormData();

      // we will send the response we've got from razorpay to the backend to validate the payment
      bodyData.append("response", JSON.stringify(response));

      await Axios({
        url: `/razorpay/payment/success/`,
        method: "POST",
        data: bodyData,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          deletecart();
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(console.error());
    }
  };

  // this will load a script tag which will open up Razorpay payment card to make //transactions
  // const loadScript = () => {
  //   const script = document.createElement("script");
  //   script.src = "https://checkout.razorpay.com/v1/checkout.js";
  //   document.body.appendChild(script);
  // };

  const showRazorpay = async (e) => {
    // console.log(data_resp);

    // const res = await loadScript();

    let bodyData = new FormData();

    if (price >= 499) {
      // we will pass the amount and product name to the backend using form data
      bodyData.append("amount", price.toString());
    } else {
      bodyData.append("amount", (price + 100).toString());
    }
    bodyData.append("uid", uid);

    const data = await Axios({
      url: `/razorpay/pay/`,
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: bodyData,
    }).then((res) => {
      return res;
    });

    // in data we will receive an object from the backend with the information about the payment
    //that has been made by the user

    var options = {
      key_id: process.env.REACT_APP_PUBLIC_KEY, // in react your environment variable must start with REACT_APP_
      key_secret: process.env.REACT_APP_SECRET_KEY,
      amount: data.data.payment.amount,
      currency: "INR",
      name: "ShoppyKart",
      description: "Payment section",
      image: "", // add image url
      order_id: data.data.payment.id,
      handler: function (response) {
        // we will handle success by calling handlePaymentSuccess method and
        // will pass the response that we've got from razorpay
        handlePaymentSuccess(response);
      },
      prefill: {
        name: "User's name",
        email: "User's email",
        contact: "User's phone",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    var rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <div className="right_buy">
      <center>
        {" "}
        <div className="logo1" sx={{ marginLeft: 15 }}>
          <Logo className="logo-large" />
        </div>
      </center>

      <div className="cost_right">
        {price >= 499 ? (
          <>
            <p>
              Your order is eligible for FREE Delivery. <br />
              <span style={{ color: "#565959" }}>
                The items will be delivered by 2-5 days
              </span>
            </p>
          </>
        ) : (
          <p>
            Add ₹{499 - price} to be eligible for free delivery. Delivery
            charges applied is ₹100
            <br />
            <span style={{ color: "#565959" }}>
              The items will be delivered by 2-5 days
            </span>
          </p>
        )}
        <h3>
          Total ({items.length} items):{" "}
          {price >= 499 ? (
            <span style={{ fontWeight: "700" }}>₹{price}.00</span>
          ) : (
            <span style={{ fontWeight: "700" }}>₹{price + 100}.00</span>
          )}
        </h3>

        <button className="rightbuy_btn" type="submit" onClick={showRazorpay}>
          Proceed to Buy
        </button>

        <div className="emi" onClick={() => setVal(!val)}>
          Emi available
          {!val ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </div>
        <span className={val ? "show" : "hide"}>
          {" "}
          Your order qualifies for EMI with valid credit cards (not available on
          purchase of Gold, Jewelry, Gift cards). Learn more
        </span>
      </div>
      {/* {red ? <Navigate to="/" /> : <></>} */}
    </div>
  );
};

export default Right;
