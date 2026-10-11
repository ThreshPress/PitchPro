import { copyFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const workspace = resolve(import.meta.dirname);

function pagesExtras(): Plugin {
  return {
    name: "pitch-pro-pages",
    apply: "build",
    closeBundle() {
      const out = resolve(workspace, "dist-pages");
      copyFileSync(resolve(workspace, "public/favicon.svg"), resolve(out, "favicon.svg"));
      copyFileSync(resolve(out, "index.html"), resolve(out, "404.html"));
      writeFileSync(resolve(out, ".nojekyll"), "");
    },
  };
}

export default defineConfig({
  root: resolve(workspace, "pages"),
  base: "./",
  publicDir: false,
  build: {
    outDir: resolve(workspace, "dist-pages"),
    emptyOutDir: true,
  },
  resolve: {
    tsconfigPaths: true,
    alias: { "@": resolve(workspace, "src") },
  },
  plugins: [tailwindcss(), react(), pagesExtras()],
});
