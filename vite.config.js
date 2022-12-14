/// <reference types="vitest"/>
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split(".").pop();
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = "img";
          }
          if (/css|woff|woff2/i.test(extType)) {
            extType = "style";
          }

          return `assets/${extType}/[name]-[hash][extname]`;
        },

        chunkFileNames: "assets/js/[name]-[hash].js",

        entryFileNames: "assets/js/[name]-[hash].js",
      },
    },
  },

  plugins: [svgr(), react()],
});
