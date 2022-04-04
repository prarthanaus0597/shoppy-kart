import "./App.css";

import Home from "./components/body/Home";

import Signin from "./components/signin/Signin";
import SignUp from "./components/signin/SignUp";
import { Routes, Route, useLocation } from "react-router-dom";
import Cart from "./components/cartadd/Cart";
import Buynow from "./components/buynow/Buynow";
import { useState, useEffect } from "react";
import ViewAll from "./components/body/ViewAll";
import CircularProgress from "@mui/material/CircularProgress";

import { useLayoutEffect } from "react";
import Payment from "./components/buynow/Payment";

const Wrapper = ({ children }) => {
  const location = useLocation();
  useLayoutEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, [location.pathname]);
  return children;
};
function App() {
  const [data, setData] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setData(true);
    }, 1000);
  }, []);
  return (
    <>
      {data ? (
        <>
          <div className="App">
            <Wrapper>
              <Routes>
                <Route exact path="/" element={<Home />}></Route>
                <Route exact path="/login" element={<Signin />}></Route>
                <Route exact path="/register" element={<SignUp />}></Route>
                <Route path="/getproducts/all/:id" element={<Cart />}></Route>
                <Route path="/buynow/:uid" element={<Buynow />}></Route>
                <Route path="/payment/:amt" element={<Payment />}></Route>
                <Route path="/viewall/:set" element={<ViewAll />}></Route>
              </Routes>
            </Wrapper>
          </div>{" "}
        </>
      ) : (
        <div className="circle">
          <CircularProgress />
          <h2> Loading....</h2>
        </div>
      )}
    </>
  );
}

export default App;
