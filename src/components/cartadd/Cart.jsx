import { Divider } from "@mui/material";
import React, { useContext } from "react";
import "../css/cart.css";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import { LoginContext } from "../context/ContextProvider";
import CircularProgress from "@mui/material/CircularProgress";

const Cart = () => {
  const { id } = useParams("");
  const navigate = useNavigate();

  const { account, setaccount } = useContext(LoginContext);

  const [products, setIndedata] = useState("");
  const getinddata = async () => {
    const res = await fetch(`/getproducts/all/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await res.json();
    // console.log(data[0]);

    if (res.status !== 200) {
      alert("no data available");
    } else {
      // console.log("ind mila hain");
      setIndedata(data[0]);
    }
  };

  useEffect(() => {
    setTimeout(getinddata, 500);
    // getinddata();
  }, [id]);

  //add to cart
  const addtocart = async (id) => {
    const checkres = await fetch(`/addcart/cart/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        products,
      }),
      credentials: "include",
    });
    const data2 = await checkres.json();
    console.log(data2);
    if (checkres.status === 404) {
      let path = `/login`;
      navigate(path);
    } else if (checkres.status === 200) {
      toast.success("Item added to cart !!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setaccount(data2);
    }
  };
  //buynow to cart
  const buynow = async (id) => {
    const checkres = await fetch(`/addcart/cart/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        products,
      }),
      credentials: "include",
    });
    const data2 = await checkres.json();
    // console.log(data2);
    if (checkres.status === 404) {
      let path = `/login`;
      navigate(path);
    } else if (checkres.status === 200) {
      setaccount(data2);

      navigate(`/buynow/${data2["uid"]}`);
    }
  };

  return (
    <>
      <Header />
      {products ? (
        <div className="cart_section">
          <div className="cart_container">
            <div className="left_cart">
              <img src={products.image_url} alt=""></img>
              <div className="cart_btn">
                <button className="cart_btn1" onClick={() => addtocart(id)}>
                  Add to cart{" "}
                </button>
                <button className="cart_btn2" onClick={() => buynow(id)}>
                  Buy Now
                </button>
              </div>
            </div>
            <div className="right_cart">
              <h3>{products.short_title}</h3>
              <h4>{products.long_title}</h4>
              <Divider />
              <p className="mrp">
                M.R.P :{" "}
                <span style={{ color: "#b12704" }}>
                  <s> &#8377;{products.mrp.toLocaleString("en-IN")}</s>
                </span>
              </p>
              <p>
                Deal of the day :
                <span style={{ color: "#b12704" }}>
                  &#8377;{products.cost.toLocaleString("en-IN")}
                </span>
              </p>
              <p>
                You save:
                <span style={{ color: "#b12704" }}>
                  &#8377;
                  {(products.mrp - products.cost).toLocaleString("en-IN")}(
                  {(
                    ((products.mrp - products.cost) / products.mrp) *
                    100
                  ).toLocaleString("en-IN")}
                  %)
                </span>
              </p>
              <div className="discount_box ">
                <h5>
                  Discount:
                  <span
                    style={{ color: "#111", fontWeight: "600", marginLeft: 10 }}
                  >
                    {products.discounts}{" "}
                  </span>{" "}
                </h5>
                <h4>
                  Free Delivery:
                  <span
                    style={{ color: "#111", fontWeight: "600", marginLeft: 10 }}
                  >
                    {new Date().toLocaleString("default", { month: "long" })}{" "}
                    &nbsp;
                    {new Date().getDate() + 6} - {new Date().getDate() + 8}
                  </span>
                </h4>
              </div>
              <p className="description">
                About the item:
                <br />
                <Divider />
                <span
                  style={{
                    color: "#565959",
                    fontSize: "14px",
                    fontWeight: "500",
                    letterSpacing: "0.4px",
                    marginLeft: 10,
                    marginBottom: 100,
                  }}
                >
                  {products.desc}
                </span>
              </p>
            </div>
            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </div>
      ) : (
        <>
          {" "}
          <div className="circle">
            <CircularProgress />
            <h2> Loading....</h2>
          </div>
        </>
      )}
      <Footer />
    </>
  );
};

export default Cart;
