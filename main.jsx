import React from "react";
import ReactDOM from "react-dom/client";
import IronLog from "./IronLog.jsx";

/**
 * The component was originally built for Claude's artifact `window.storage`
 * API. This shim reproduces the same interface using the browser's
 * localStorage, so all persistence now lives on this device only (no
 * Claude account involved). Data will stay put as long as the user doesn't
 * clear their browser storage.
 */
window.storage = {
  async get(key) {
    const value = localStorage.getItem(key);
    if (value === null) {
      throw new Error("Key not found: " + key);
    }
    return { key, value, shared: false };
  },
  async set(key, value) {
    localStorage.setItem(key, value);
    return { key, value, shared: false };
  },
  async delete(key) {
    const existed = localStorage.getItem(key) !== null;
    localStorage.removeItem(key);
    return { key, deleted: existed, shared: false };
  },
  async list(prefix) {
    const keys = Object.keys(localStorage).filter((k) => !prefix || k.startsWith(prefix));
    return { keys, prefix, shared: false };
  },
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <IronLog />
  </React.StrictMode>
);
