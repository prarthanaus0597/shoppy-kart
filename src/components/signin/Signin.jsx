import React from "react";
import Logo from "./Logo";
import { useState, useContext } from "react";
import "../css/signin.css";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoginContext } from "../context/ContextProvider";

function Signin() {
  const [logData, setLogdata] = useState({
    email: "",
    password: "",
  });
  const { account, setaccount } = useContext(LoginContext);
  const navigate = useNavigate();
  const addData = (e) => {
    const { name, value } = e.target;
    setLogdata(() => {
      return {
        ...logData, //each time set value previosly typed onchange
        [name]: value,
      };
    });
  };
  const sign_in = async (e) => {
    e.preventDefault();
    // const regex = new RegExp("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,}");
    const reg_email = /\S+@\S+\.\S+/;
    const { email, password } = logData;
    if (!email || !password) {
      toast.error("Enter all the details...", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    if (!reg_email.test(email)) {
      toast.warn("Enter valid email...", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    const res = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
      credentials: "include",
    });
    const data2 = await res.json();
    // await res.json();
    if (res.status === 404) {
      toast.error("No Such User !!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      return;
    }
    if (res.status === 405) {
      toast.error("Incorrect password !!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      return;
    }
    toast.success("Logged in successfully", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    setLogdata({
      ...logData,
      email: "",
      password: "",
    });

    setaccount(data2);
    // console.log(data2);
    let path = `/`;

    navigate(path);
  };

  return (
    <section>
      <div className="sign_container">
        <div className="sign_header1">
          <Logo />
        </div>
        <div className="sign_form">
          <form method="POST">
            <h1>Sign-In </h1>
            <div className="form_data">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={addData}
                placeholder="Email"
                value={logData.email}
                required
              ></input>
            </div>
            <div className="form-data">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                onChange={addData}
                value={logData.password}
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
                title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                required
              ></input>
            </div>
            <button className="signin_btn" onClick={sign_in}>
              Continue
            </button>
          </form>
        </div>
        <div className="create_accountinfo">
          <p>New to ShoppyKart?</p>
          <NavLink to="/register">
            <button style={{ cursor: "pointer" }}>Create New account</button>
          </NavLink>
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
    </section>
  );
}

export default Signin;
