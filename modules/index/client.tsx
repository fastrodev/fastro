import React from "react";
import { hydrateRoot } from "react-dom/client";
import { App } from "./App.tsx";

const root = document.getElementById("root");
if (root) {
  hydrateRoot(root, <App />);
}
