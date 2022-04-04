import {
  getProductsDiscountReducers,
  getProductsElectronicsReducers,
  getProductsBooksReducers,
  getProductsGroceryReducers,
  getProductsFurnitureReducers,
  getProductsFashionReducers,
  getProductsMobileReducers,
  getProductsApplianceReducers,
  getProductsOthersReducers,
} from "./Productreducers";

import { combineReducers } from "redux";

const rootreducers = combineReducers({
  getproductsdiscountdata: getProductsDiscountReducers,
  getproductselectdata: getProductsElectronicsReducers,
  getproductsbooksdata: getProductsBooksReducers,
  getproductsgrocerydata: getProductsGroceryReducers,
  getproductsmobiledata: getProductsMobileReducers,
  getproductsfashiondata: getProductsFashionReducers,
  getproductsfurnituredata: getProductsFurnitureReducers,
  getproductsappliancedata: getProductsApplianceReducers,
  getproductsothersdata: getProductsOthersReducers,
});

export default rootreducers;
