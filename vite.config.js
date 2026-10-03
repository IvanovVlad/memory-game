import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/memory-game",
  build: {
    sourcemap: true,
    outDir: "docs",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
  },
});
