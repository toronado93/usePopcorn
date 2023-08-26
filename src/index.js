import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <App />
  /* <Star maxRating={5}></Star>
    <Star maxRating={5} size={30}></Star>
    <Star maxRating={5} size={30} color="red"></Star> */
);
