import "./index.css";

import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import appStore from "./redux/appStore.js";

const clientID = import.meta.env.VITE_GOOGLE_AUTH_KEY;

createRoot(document.getElementById("root")).render(
  <Provider store={appStore}>
    <GoogleOAuthProvider clientId={clientID}>
      <BrowserRouter>
        <Toaster position="top-center" reverseOrder={false} />
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </Provider>,
);
