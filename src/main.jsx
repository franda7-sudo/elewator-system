import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ElevatorProvider } from "./context/ElevatorContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ElevatorProvider>
      <App />
    </ElevatorProvider>
  </React.StrictMode>
);
