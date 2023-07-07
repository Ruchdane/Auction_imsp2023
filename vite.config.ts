import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@/ui": resolve(__dirname, "ui"),
      "@/utils": resolve(__dirname, "utils"),
      "@/feature": resolve(__dirname, "feature"),
      "@": resolve(__dirname, "src"),
    },
  },
  plugins: [react()],
});
