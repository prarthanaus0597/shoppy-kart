import React, { useContext, useEffect, useState } from "react";
import "../css/header_navbar.css";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Badge from "@mui/material/Badge";
import { NavLink, useNavigate } from "react-router-dom";
import { Avatar, Drawer, IconButton, List, ListItem } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import RightHeader from "./RightHeader";
import { LoginContext } from "../context/ContextProvider";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { makeStyles } from "@material-ui/core";
import { useSelector } from "react-redux";

const usestyle = makeStyles({
  component: {
    marginTop: 10,
    marginRight: "-50px",
    width: "300px",
    padding: 50,
    height: "300px",
  },
});

const Header = () => {
  const classes = usestyle();
  const { account, setaccount } = useContext(LoginContext);
  const { discount } = useSelector((state) => state.getproductsdiscountdata);
  const { electronics } = useSelector((state) => state.getproductselectdata);
  const { books } = useSelector((state) => state.getproductsbooksdata);
  const { grocery } = useSelector((state) => state.getproductsgrocerydata);
  const { mobile } = useSelector((state) => state.getproductsmobiledata);
  const { fashion } = useSelector((state) => state.getproductsfashiondata);
  const { furniture } = useSelector((state) => state.getproductsfurnituredata);
  const { appliance } = useSelector((state) => state.getproductsappliancedata);
  const { others } = useSelector((state) => state.getproductsothersdata);

  var products = [
    ...discount,
    ...electronics,
    ...books,
    ...grocery,
    ...mobile,
    ...fashion,
    ...furniture,
    ...appliance,
    ...others,
  ];

  //drawer on small screen
  const [open, setOpen] = useState(false);
  const [liopen, setLiopen] = useState(true);
  const [text, setText] = useState();
  const [dropen, setDropen] = useState(false);

  const handleClick = (event) => {
    setOpen(event.currentTarget);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleopen = () => {
    setDropen(true);
  };

  const handleClosedr = () => {
    setDropen(false);
  };

  const getText = (text) => {
    setText(text);
    setLiopen(false);
  };

  // for logout
  const history = useNavigate("");
  const logoutuser = async () => {
    const res2 = await fetch("/logout/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data2 = await res2.json();

    if (res2.status !== 200) {
      const error = new Error(res2.error);
      throw error;
    } else {
      setaccount("");
      setOpen(false);
      document.cookie = "jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      history("/");
    }
  };

  //if user is logged in
  const getdetailsvaliduser = async () => {
    const res = await fetch("/verifyuser", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await res.json();

    if (res.status !== 200) {
      console.log("first login");
    } else {
      setaccount(data);
    }
  };
  const setproducts = () => {
    console.log(products);
    products = [
      ...discount,
      ...electronics,
      ...books,
      ...grocery,
      ...mobile,
      ...fashion,
      ...furniture,
      ...appliance,
      ...others,
    ];
    console.log(products);
  };

  useEffect(() => {
    getdetailsvaliduser();
    // products = [...discount, ...electronics, ...books];
  }, []);

  return (
    <header>
      <nav onLoad={() => setproducts()}>
        <div className="left">
          <IconButton className="sidebar" onClick={handleopen}>
            <MenuIcon sx={{ color: "white" }} />
          </IconButton>
          <Drawer open={dropen} onClose={handleClosedr}>
            <RightHeader userlog={logoutuser} logclose={handleClosedr} />
          </Drawer>

          <NavLink to="/" className="home_link">
            <div className="logo">
              <div>
                <h3>
                  <span style={{ color: "white" }}>Shoppy</span>
                  <span style={{ color: "#ebd834" }}>Kart</span>
                </h3>
              </div>
              <LocalMallIcon sx={{ color: "white", marginLeft: "5px" }} />
            </div>
          </NavLink>
          <div className="nav_searchbar">
            <input
              type="text"
              name=""
              id=""
              onChange={(e) => getText(e.target.value)}
              placeholder="Search the products"
            ></input>
            <div className="search_icon">
              <SearchIcon sx={{ color: "#ebd834" }} />
            </div>
            {text && (
              <List className="extrasearch" hidden={liopen}>
                {products
                  .filter((product) =>
                    product.short_title
                      .toLowerCase()
                      .includes(text.toLowerCase())
                  )
                  .map((product) => (
                    <ListItem>
                      <NavLink
                        to={`/getproducts/all/${product.pid}`}
                        onClick={() => setLiopen(true)}
                      >
                        {product.short_title}
                      </NavLink>
                    </ListItem>
                  ))}
              </List>
            )}
          </div>
        </div>

        <div className="right">
          {account ? (
            <div
              className="nav_btn"
              style={{ color: "#f2f2f2", userSelect: "none", marginTop: 0 }}
            >
              {account.fname}
            </div>
          ) : (
            <div className="nav_btn">
              <NavLink to="/login">
                <span className="login-btn">Login</span>
              </NavLink>
            </div>
          )}
          {account ? (
            <NavLink to={`/buynow/${account.uid}`}>
              <div className="cart_btn ">
                <Badge
                  color="primary"
                  badgeContent={account.cart_length}
                  sx={{
                    "& .MuiBadge-badge": {
                      backgroundColor: "#ebd834",
                      color: "whitesmoke",
                    },
                  }}
                >
                  <ShoppingCartIcon sx={{ color: "whitesmoke" }} />
                </Badge>

                <p>Cart</p>
              </div>
            </NavLink>
          ) : (
            <NavLink to="/login">
              <div className="cart_btn ">
                <Badge
                  color="primary"
                  badgeContent={0}
                  sx={{
                    "& .MuiBadge-badge": {
                      backgroundColor: "#ebd834",
                      color: "whitesmoke",
                    },
                  }}
                >
                  <ShoppingCartIcon sx={{ color: "whitesmoke" }} />
                </Badge>

                <p>Cart</p>
              </div>
            </NavLink>
          )}
          {account ? (
            <Avatar
              onClick={handleClick}
              className="avtar2"
              sx={{ background: "#b3b3ff" }}
            >
              {account.fname[0].toUpperCase()}
            </Avatar>
          ) : (
            <Avatar onClick={handleClick} className="avtar"></Avatar>
          )}

          <div className="menu_div">
            {account ? (
              <Menu
                anchorEl={open}
                open={Boolean(open)}
                onClose={handleClose}
                className={classes.component}
              >
                {/* <MenuItem onClick={handleClose} style={{ margin: 10 }}>
                  <NavLink
                    to="/myaccount"
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    My account
                  </NavLink>
                </MenuItem> */}
                <MenuItem style={{ margin: 10 }} onClick={logoutuser}>
                  <LogoutIcon style={{ fontSize: 16, marginRight: 3 }} /> Logout
                </MenuItem>
              </Menu>
            ) : (
              ""
            )}
          </div>
          {/* <ToastContainer /> */}
        </div>
      </nav>
    </header>
  );
};

export default Header;
