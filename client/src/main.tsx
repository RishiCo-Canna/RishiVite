import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from './App';
import "./index.css";

// Get the current protocol and host
const protocol = window.location.protocol;
const hostname = window.location.hostname;
const port = import.meta.env.DEV ? ':5000' : '';
const base = `${protocol}//${hostname}${port}`;

// Add base URL to any API requests
if (import.meta.env.DEV) {
  window.addEventListener('load', () => {
    const scripts = document.getElementsByTagName('script');
    for (let script of scripts) {
      if (script.src) {
        // Update any localhost or hardcoded URLs to use the current protocol and host
        script.src = script.src.replace(/https?:\/\/localhost:\d+/, base)
          .replace(/https?:\/\/0\.0\.0\.0:\d+/, base);
      }
    }
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App/>
  </StrictMode>,
);