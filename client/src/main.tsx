import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from './App';
import "./index.css";

// Ensure we're using the correct server URL in development
const base = import.meta.env.DEV ? 'http://0.0.0.0:5000' : '';

// Add base URL to any API requests
if (import.meta.env.DEV) {
  window.addEventListener('load', () => {
    const scripts = document.getElementsByTagName('script');
    for (let script of scripts) {
      if (script.src && script.src.includes('localhost')) {
        script.src = script.src.replace('localhost:4001', '0.0.0.0:5000');
      }
    }
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App/>
  </StrictMode>,
);