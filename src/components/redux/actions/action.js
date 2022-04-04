import axios from "axios";

export const getProducts = () => async (dispatch) => {
  const config = {
    Headers: {
      "Content-Type": "application/json",
    },
  };
  await axios
    .get("/getproducts/set/discount", config)
    .then((res) => {
      dispatch({ type: "SUCCESS_GET_PRODUCTS_DISCOUNT", payload: res.data });
    })
    .then(
      await axios.get("/getproducts/set/electronics", config).then((res) => {
        dispatch({
          type: "SUCCESS_GET_PRODUCTS_ELECTRONICS",
          payload: res.data,
        });
      })
    )
    .then(
      await axios.get("/getproducts/set/books", config).then((res) => {
        dispatch({
          type: "SUCCESS_GET_PRODUCTS_BOOKS",
          payload: res.data,
        });
      })
    )
    .then(
      await axios.get("/getproducts/set/grocery", config).then((res) => {
        dispatch({
          type: "SUCCESS_GET_PRODUCTS_GROCERY",
          payload: res.data,
        });
      })
    )
    .then(
      await axios.get("/getproducts/set/mobile", config).then((res) => {
        dispatch({
          type: "SUCCESS_GET_PRODUCTS_MOBILE",
          payload: res.data,
        });
      })
    )
    .then(
      await axios.get("/getproducts/set/fashion", config).then((res) => {
        dispatch({
          type: "SUCCESS_GET_PRODUCTS_FASHION",
          payload: res.data,
        });
      })
    )
    .then(
      await axios.get("/getproducts/set/furniture", config).then((res) => {
        dispatch({
          type: "SUCCESS_GET_PRODUCTS_FURNITURE",
          payload: res.data,
        });
      })
    )
    .then(
      await axios.get("/getproducts/set/appliance", config).then((res) => {
        dispatch({
          type: "SUCCESS_GET_PRODUCTS_APPLIANCE",
          payload: res.data,
        });
      })
    )
    .then(
      await axios.get("/getproducts/set/others", config).then((res) => {
        dispatch({
          type: "SUCCESS_GET_PRODUCTS_OTHERS",
          payload: res.data,
        });
      })
    );
};
