import "./styles/tailwind.css";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./store";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);

import * as bikesApi from "./api/bikes.js";
window.bikesApi = bikesApi;