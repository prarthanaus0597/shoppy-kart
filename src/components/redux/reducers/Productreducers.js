const discount = [];

export const getProductsDiscountReducers = (state = { discount }, action) => {
  switch (action.type) {
    case "SUCCESS_GET_PRODUCTS_DISCOUNT":
      // console.log(discount);
      return { discount: action.payload };
    default:
      return state;
  }
};

const electronics = [];

export const getProductsElectronicsReducers = (
  state = { electronics },
  action
) => {
  switch (action.type) {
    case "SUCCESS_GET_PRODUCTS_ELECTRONICS":
      return { electronics: action.payload };

    default:
      return state;
  }
};

const books = [];

export const getProductsBooksReducers = (state = { books }, action) => {
  switch (action.type) {
    case "SUCCESS_GET_PRODUCTS_BOOKS":
      return { books: action.payload };

    default:
      return state;
  }
};

const grocery = [];

export const getProductsGroceryReducers = (state = { grocery }, action) => {
  switch (action.type) {
    case "SUCCESS_GET_PRODUCTS_GROCERY":
      return { grocery: action.payload };

    default:
      return state;
  }
};

const mobile = [];

export const getProductsMobileReducers = (state = { mobile }, action) => {
  switch (action.type) {
    case "SUCCESS_GET_PRODUCTS_MOBILE":
      return { mobile: action.payload };

    default:
      return state;
  }
};

const fashion = [];

export const getProductsFashionReducers = (state = { fashion }, action) => {
  switch (action.type) {
    case "SUCCESS_GET_PRODUCTS_FASHION":
      return { fashion: action.payload };

    default:
      return state;
  }
};

const furniture = [];

export const getProductsFurnitureReducers = (state = { furniture }, action) => {
  switch (action.type) {
    case "SUCCESS_GET_PRODUCTS_FURNITURE":
      return { furniture: action.payload };

    default:
      return state;
  }
};

const appliance = [];

export const getProductsApplianceReducers = (state = { appliance }, action) => {
  switch (action.type) {
    case "SUCCESS_GET_PRODUCTS_APPLIANCE":
      return { appliance: action.payload };

    default:
      return state;
  }
};

const others = [];

export const getProductsOthersReducers = (state = { others }, action) => {
  switch (action.type) {
    case "SUCCESS_GET_PRODUCTS_OTHERS":
      return { others: action.payload };

    default:
      return state;
  }
};
