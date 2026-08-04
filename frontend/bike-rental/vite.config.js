import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Standard React + Vite setup. No path aliases were introduced so that the
// extraction stays a pure file move — every import is a real relative path.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },"/storage": { target: "http://localhost:8080", changeOrigin: true, secure: false },
    },
  },
});
