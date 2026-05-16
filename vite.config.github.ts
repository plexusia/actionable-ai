import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "node:path";

/** Static SPA build for GitHub Pages (no SSR). */
export default defineConfig({
  base: process.env.BASE_PATH ?? "/",
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  build: {
    outDir: "dist-pages",
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, "index.github.html"),
    },
  },
});
