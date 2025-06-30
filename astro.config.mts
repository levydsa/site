// @ts-check
import { defineConfig } from "astro/config";
import path from "path";
import { exec } from "child_process";
import { fileURLToPath } from "url";

import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import type { Plugin } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const current_dir = __dirname;

const zigWasmPlugin = (dir: string, compile: string): Plugin => {
  const zigDir = path.resolve(current_dir, dir);

  return {
    name: "zig-wasm-watch",

    configureServer(server) {
      server.watcher.add(zigDir);
      server.watcher.on("change", (file) => {
        console.log(file, "changed");
        if (file.startsWith(zigDir) && file.endsWith(".zig")) {
          exec(compile, (_err, stdout, stderr) => {
            console.info(stdout);
            console.debug(stderr);
          });
        }
      });
    },

    handleHotUpdate({ file, server }) {
      console.log(file);
      if (file.endsWith(".wasm")) {
        const mods = server.moduleGraph.getModulesByFile(file);
        if (mods && mods.size) {
          return [...mods];
        }
      }
    },
  };
};

export default defineConfig({
  integrations: [mdx(), react()],
  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },

  vite: {
    plugins: [tailwindcss(), zigWasmPlugin("src/zig", "zig build --color on")],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  },
});
