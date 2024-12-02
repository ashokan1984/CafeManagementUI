import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./router"; // Import the router with all the routes defined
import "./index.css"; // Import global styles (optional)

// Render the root application component into the DOM
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);
