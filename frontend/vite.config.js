// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/auth": "http://localhost:5000",
      "/parcels": "http://localhost:5000",
      "/tags": "http://localhost:5000",
      "/admin": "http://localhost:5000",
      "/agent": "http://localhost:5000",
      "/tracking-logs": "http://localhost:5000",
    },
  },
});
