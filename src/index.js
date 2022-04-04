import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import store, { persistor } from "./store";
import { Provider } from "react-redux";
import ContextProvider from "./components/context/ContextProvider";
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.render(
  <ContextProvider>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </ContextProvider>,
  document.getElementById("root")
);

reportWebVitals();
