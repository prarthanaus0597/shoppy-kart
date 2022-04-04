import React from "react";
import Avatar from "@mui/material/Avatar";

import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { LoginContext } from "../context/ContextProvider";

import "../css/rightheader.css";
import { Divider } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

const RightHeader = ({ userlog, logclose }) => {
  const { account, setaccount } = useContext(LoginContext);

  return (
    <div className="rightheader">
      <div className="right_nav">
        {account ? (
          <>
            <Avatar className="avtar2" title={account.fname.toUpperCase()}>
              {account.fname[0].toUpperCase()}
            </Avatar>
          </>
        ) : (
          <Avatar className="avtar" />
        )}
        {account ? (
          <h3>
            Hello,<br></br> {account.fname}
          </h3>
        ) : (
          ""
        )}
      </div>
      <div className="nav_btn" onClick={() => logclose()}>
        <NavLink to="/">Shop By Category</NavLink>

        <NavLink to="/">Today's Deal</NavLink>
        {account ? (
          <NavLink to={`/buynow/${account.uid}`}>Your Order</NavLink>
        ) : (
          <NavLink to="/login">Your Order</NavLink>
        )}
        {/* <Divider style={{ width: "100%", marginLeft: -20 }} /> */}
        {/* <div className="flag">
          <NavLink
            to="/myaccount"
            style={{ textDecoration: "none", color: "black" }}
          >
            My Account
          </NavLink>
        </div> */}

        {account ? (
          <div className="flag">
            <LogoutIcon style={{ fontSize: 18, marginRight: 4 }} />
            <h3
              onClick={() => userlog()}
              style={{ cursor: "pointer", fontWeight: 500 }}
            >
              Log Out
            </h3>
          </div>
        ) : (
          <>
            <NavLink to="/login">Sign in</NavLink>
            <Divider style={{ width: "100%", marginLeft: -20 }} />
          </>
        )}
      </div>
    </div>
  );
};

export default RightHeader;
