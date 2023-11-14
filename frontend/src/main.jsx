// import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./Store/store";
import App from "./App";
import { createRoot } from "react-dom/client";

const root = document.getElementById("root");

const reactRoot = createRoot(root);

reactRoot.render(
  <Provider store={store}>
    <App />
  </Provider>
);
