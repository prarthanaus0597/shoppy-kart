import React, { useContext, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { LoginContext } from "../context/ContextProvider";
import Axios from "axios";
import "../css/payment.css";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Container, Grid, TextField } from "@material-ui/core";
import { styled } from "@mui/material/styles";

const CssTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      border: "1px solid blue",
    },
  },
});

const Payment = () => {
  let { amt } = useParams();
  const [address, setaddress] = useState("");
  const { account, setaccount } = useContext(LoginContext);
  const handleSuccess = (res) => {
    // separate key and values from the res object which is nothing but param_dict
    let keyArr = Object.keys(res);
    let valArr = Object.values(res);

    // when we start the payment verification we will hide our Product form
    document.getElementById("paymentFrm").style.display = "none";

    // Lets create a form by DOM manipulation
    // display messages as soon as payment starts
    let heading1 = document.createElement("h1");
    heading1.innerText = "Redirecting you to the paytm....";
    let heading2 = document.createElement("h1");
    heading2.innerText = "Please do not refresh your page....";

    //create a form that will send necessary details to the paytm
    let frm = document.createElement("form");
    frm.action = "https://securegw-stage.paytm.in/order/process/";
    frm.method = "post";
    frm.name = "paytmForm";

    // we have to pass all the credentials that we've got from param_dict
    keyArr.map((k, i) => {
      // create an input element
      let inp = document.createElement("input");
      inp.key = i;
      inp.type = "hidden";
      // input tag's name should be a key of param_dict
      inp.name = k;
      // input tag's value should be a value associated with the key that we are passing in inp.name
      inp.value = valArr[i];
      // append those all input tags in the form tag
      frm.appendChild(inp);
    });

    // append all the above tags into the body tag
    document.body.appendChild(heading1);
    document.body.appendChild(heading2);
    document.body.appendChild(frm);
    // finally submit that form
    frm.submit();

    // if you remember, the param_dict also has "'CALLBACK_URL': 'http://127.0.0.1:8000/api/handlepayment/'"
    // so as soon as Paytm gets the payment it will hit that callback URL with some response and
    // on the basis of that response we are displaying the "payment successful" or "failed" message
  };
  const startPayment = async () => {
    let bodyData = new FormData();
    let uid = account.uid;

    // we will pass the amount and product name to the backend using form data
    bodyData.append("amount", amt.toString());

    let pay_id = "order_" + Math.random().toString(36).slice(2);
    bodyData.append("uid", uid);
    bodyData.append("pay_id", pay_id);
    bodyData.append("address", address);
    console.log(address);
    const data = await Axios({
      url: `/paytm/pay/`,
      method: "POST",
      headers: {
        Accept: "application/json",

        "Content-Type": "application/json",
      },
      data: bodyData,
    }).then((res) => {
      // we will retrieve the param_dict that we are sending from the backend with
      // all the necessary credentials, and we will pass it to the handleSuccess() func
      //  for the further process
      console.log(res);
      if (res) {
        handleSuccess(res.data.param_dict);
      }
    });
  };

  return (
    <div
      id="paymentFrm"
      className="container_pay"
      style={{ marginTop: "20vh" }}
    >
      <Card className="card" sx={{ margin: "auto" }}>
        <CardContent>
          <Typography
            className="pay-title"
            sx={{
              fontSize: 25,
              fontFamily: "Bubblegum Sans",
            }}
            variant="h5"
            color="text.secondary"
          >
            PAYMENT PAGE
          </Typography>
          <br />
          <Container>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12} lg={12}>
                <CssTextField
                  fullWidth
                  variant="outlined"
                  id="outlined-required"
                  label="Enter the Address"
                  required="true"
                  onChange={(e) => setaddress(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={12} lg={12}>
                <CssTextField
                  fullWidth
                  variant="outlined"
                  id="outlined-required"
                  label="Email"
                  defaultValue={account.email}
                  disabled
                  className="amt"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CssTextField
                  fullWidth
                  variant="outlined"
                  id="outlined-required"
                  label="Amount"
                  defaultValue={amt}
                  disabled
                  className="amt"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CssTextField
                  fullWidth
                  variant="outlined"
                  id="outlined-required"
                  label="Phone"
                  defaultValue={account.phone}
                  disabled
                  className="amt"
                />
              </Grid>
            </Grid>
          </Container>
        </CardContent>
        <h6 className="h6">Please donot refresh the page*</h6>
        <CardActions className="buttons-payment">
          <Button variant="outlined" className="pay-btn" onClick={startPayment}>
            Pay with PayTm
          </Button>
          <NavLink to="/" style={{ textDecoration: "none" }}>
            <Button variant="contained" className="home-btn">
              Home
            </Button>
          </NavLink>
        </CardActions>
        <br />
      </Card>
    </div>
  );
};

export default Payment;
