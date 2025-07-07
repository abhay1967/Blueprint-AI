import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        // Remove the /api prefix completely
        rewrite: (path) => path.replace(/^\/api\//, "/"),
      },
      "/chats": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
        ws: false,
      },
      "/chat": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
        ws: false,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
