import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/slot-game/" : "/", // base URL for GitHub Pages

  build: {
    outDir: "docs", // output folder for the build
    emptyOutDir: true, // clean folder before build
  },
  server: {
    port: 8080,
    open: true,
  },
}));
