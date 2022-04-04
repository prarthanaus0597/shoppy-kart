import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { experimentalStyled as styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import { NavLink } from "react-router-dom";
import "../css/viewall.css";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const ViewAll = () => {
  var { set } = useParams("");
  const { discount } = useSelector((state) => state.getproductsdiscountdata);
  const { electronics } = useSelector((state) => state.getproductselectdata);
  const { books } = useSelector((state) => state.getproductsbooksdata);
  const { grocery } = useSelector((state) => state.getproductsgrocerydata);
  const { mobile } = useSelector((state) => state.getproductsmobiledata);
  const { fashion } = useSelector((state) => state.getproductsfashiondata);
  const { furniture } = useSelector((state) => state.getproductsfurnituredata);
  const { appliance } = useSelector((state) => state.getproductsappliancedata);
  const { others } = useSelector((state) => state.getproductsothersdata);
  var products;
  if (set === "furniture") {
    products = [...furniture];
  }
  if (set === "appliance") {
    products = [...appliance];
  }
  if (set === "others") {
    products = [...others];
  }
  if (set === "discount") {
    products = [...discount];
  }
  if (set === "electronics") {
    products = [...electronics];
  }
  if (set === "books") {
    products = [...books];
  }
  if (set === "grocery") {
    products = [...grocery];
  }
  if (set === "mobile") {
    products = [...mobile];
  }
  if (set === "fashion") {
    products = [...fashion];
  }
  return (
    <div style={{ background: "#e6e8eb" }}>
      <Header />
      <div style={{ background: "#e6e8eb" }}>
        {products.length ? (
          <Box
            className="box"
            style={{ background: "#e6e8eb" }}
            sx={{
              flexGrow: 1,

              margin: 6,
            }}
          >
            <h3
              className="titles"
              style={{ fontFamily: "Bubblegum Sans", paddingTop: 35 }}
            >
              {set.toUpperCase()} FOR YOU
            </h3>
            <br />
            <Grid
              container
              spacing={{ xs: 5, md: 3 }}
              columns={{ xs: 5, sm: 8, md: 12 }}
            >
              <br />
              {
                //Array.from(Array(6)).map((_, index) => (
                products.map((items, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Item sx={{ height: 350 }}>
                      <div className="img_text">
                        <div className="product_img">
                          <img src={items.image_url} alt={items.image_url} />
                        </div>

                        <div className="text_shorttitle">
                          {items.short_title}
                        </div>
                        <div className="text_discount" style={{ color: "red" }}>
                          {items.discounts}
                        </div>
                        <div className="text_tag" style={{ color: "green" }}>
                          {items.tagline}
                        </div>
                        <br />
                        <div className="btn-link">
                          <NavLink
                            className="navlink"
                            to={`/getproducts/all/${items.pid}`}
                            style={{ textDecoration: "none" }}
                          >
                            <Button
                              className="btn-view"
                              variant="contained"
                              endIcon={<SendIcon />}
                              style={{
                                textDecoration: "none",
                                margin: "auto",
                                background: "#ebd834",
                                color: "black",
                              }}
                            >
                              View
                            </Button>
                          </NavLink>
                        </div>
                      </div>
                    </Item>
                  </Grid>
                ))
              }
            </Grid>
          </Box>
        ) : (
          <>
            {" "}
            <div className="circle">
              <CircularProgress />
              <h2> Loading....</h2>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ViewAll;
