// Źródło: child-train@b881e09:vite.config.ts (base, wtyczki i alias @).
// Zmiany: build singlefile z licencjami fontów, podgląd pod ścieżką GitHub Pages.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const PAGES_BASE = "/child-bath/";
const FONT_LICENSES = ["dm-sans.txt", "fraunces.txt"];

function fontLicenses(): Plugin {
  return {
    name: "child-bath:font-licenses",
    transformIndexHtml() {
      // Licencje SIL OFL towarzyszą osadzonym fontom w każdym pojedynczym HTML.
      const text = FONT_LICENSES.map((file) =>
        readFileSync(new URL(`./src/assets/licenses/${file}`, import.meta.url), "utf8").trim(),
      ).join("\n\n\n");
      return [{
        tag: "script",
        attrs: { type: "text/plain", id: "font-licenses" },
        children: `\n${text.replace(/<\//g, "<\\/")}\n`,
        injectTo: "head",
      }];
    },
  };
}

export default defineConfig(({ command }) => ({
  // Produkcyjny HTML musi działać także spod file://; manifest i SW mają adresy względne.
  base: command === "build" ? "./" : PAGES_BASE,
  // Singlefile jest potrzebny tylko w buildzie. Na dev/preview nie nadpisuje ścieżki Pages.
  plugins: [react(), tailwindcss(), fontLicenses(), command === "build" && viteSingleFile()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
}));
