import { Divider } from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";
import "../css/signin.css";
import { useState } from "react";
import Logo from "./Logo";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SignUp() {
  const [uData, setudata] = useState({
    fname: "",
    email: "",
    phone: "",
    password: "",
    cpassword: "",
  });

  const addData = (e) => {
    const { name, value } = e.target;

    setudata(() => {
      return {
        ...uData, //each time set value previosly typed onchange
        [name]: value,
      };
    });
  };

  const sendData = async (e) => {
    e.preventDefault();
    const regex = new RegExp("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,}");
    const reg_email = /\S+@\S+\.\S+/;
    const reg_phone = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-s./0-9]*$/g;

    const { fname, email, phone, password, cpassword } = uData;

    if (!fname || !email || !phone || !password || !cpassword) {
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
    if (!reg_phone.test(phone)) {
      toast.warn("Enter valid phone number...", {
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
    if (!regex.test(password)) {
      toast.warn(
        "Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters",
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );

      return;
    }

    if (password !== cpassword) {
      toast.error("Password and Confirm password doesn't match!!", {
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
    const res = await fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fname: fname,
        email: email,
        phone: phone,
        password: password,
      }),
    });
    // const data = await res.json();
    await res.json();
    if (res.status === 425) {
      toast.error("User already registered with same email id or name!!", {
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
    toast.success("Registered successfully!!", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    setudata({
      ...uData,
      fname: "",
      email: "",
      phone: "",
      password: "",
      cpassword: "",
    });
  };

  return (
    <section>
      <div className="sign_container">
        <div className="sign_header1">
          <Logo />
        </div>
        <div className="sign_form">
          <form method="POST">
            <h1>Sign-Up </h1>
            <div className="form_data">
              <label htmlFor="fname">User Name</label>
              <input
                type="text"
                name="fname"
                id="fname"
                placeholder="Username"
                required
                onChange={addData}
                value={uData.fname}
              ></input>
            </div>
            <div className="form_data">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="Email"
                name="email"
                id="email"
                required
                onChange={addData}
                value={uData.email}
              ></input>
            </div>
            <div className="form_data">
              <label htmlFor="phone">Mobile No.</label>
              <input
                type="text"
                id="phone"
                name="phone"
                placeholder="Mobile Number"
                onChange={addData}
                value={uData.phone}
                pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
              />
            </div>
            <div className="form-data">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                onChange={addData}
                value={uData.password}
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
                title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                required
              ></input>
            </div>
            <div className="form-data">
              <label htmlFor="password">Confirm Password</label>
              <input
                className="cpassword"
                type="password"
                name="cpassword"
                id="cpassword"
                placeholder="Confirm Password"
                onChange={addData}
                value={uData.cpassword}
                // pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
                title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                required
              ></input>
            </div>
            {/* <h6>
              {" "}
              <div className="text-danger" style={{ color: color }}>
                {msg}
              </div>
            </h6> */}
            <button className="signin_btn" onClick={sendData}>
              Continue
            </button>

            <Divider />
            <div className="signin_info">
              <p>
                Already have an account?<NavLink to="/login">Signin</NavLink>{" "}
              </p>
            </div>
          </form>
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

export default SignUp;
