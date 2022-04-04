import React, { useContext, useState } from "react";
import { LoginContext } from "../context/ContextProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NavLink } from "react-router-dom";

function Option({ deletedata, get }) {
  // var counts = 1;
  const { account, setaccount } = useContext(LoginContext);
  // const setCount = (val) => {
  //   counts = val;
  //   count(counts);
  // };
  const removedata = async (id) => {
    try {
      const res = await fetch(`/addcart/remove/${id}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      // console.log(data);

      if (res.status === 404) {
        console.log("error");
      } else {
        setaccount(data);
        // console.log(data);
        toast.success("Item removed from cart!", {
          position: "bottom-right",
        });
        get();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // let res = this.menu.value;
  return (
    <div
      className="add_remove_select"
      //  key={deletedata}
    >
      <select name="" id="">
        <option value="1">1</option>
        {/* <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option> */}
      </select>
      {/* <p onClick={() => removedata(deletedata)} > */}
      <p
        style={{ cursor: "pointer" }}
        onClick={() => {
          removedata(deletedata);
        }}
      >
        Delete
      </p>
      {/* </p> */}
      <span>|</span>

      <p className="forremovemedia" style={{ cursor: "pointer" }}>
        <NavLink to="/" style={{ textDecoration: "none" }}>
          See More items
        </NavLink>
      </p>
      <ToastContainer />
    </div>
  );
}

export default Option;
