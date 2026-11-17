import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));

/** Miejsca, w których może być kod przeniesiony z child-train albo child-page. */
const SCAN = [
  "src",
  "public",
  "tools",
  "tests",
  ".github",
  "index.html",
  "vite.app.ts",
  "playwright.config.ts",
  "tsconfig.json",
  ".gitignore",
];
const TEXT_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".css", ".html", ".json", ".py", ".yml", ".yaml", ".svg", ""]);
// Komentarz źródła: słowo „Źródło”, repozytorium, @ i 7 znaków skrótu commita.
const SOURCE_COMMENT = new RegExp("Źródło: child-(?:train|page)@[0-9a-f]{7}");

function collect(path: string): string[] {
  if (!existsSync(path)) return [];
  if (statSync(path).isDirectory()) return readdirSync(path).flatMap((name) => collect(join(path, name)));
  return TEXT_EXTENSIONS.has(extname(path)) ? [path] : [];
}

test("każdy plik z komentarzem źródła ma wpis w SOURCES.md (Definition of Done, punkt 6)", () => {
  const sources = readFileSync(join(ROOT, "SOURCES.md"), "utf8");
  const ported = SCAN.flatMap((entry) => collect(join(ROOT, entry)))
    .filter((file) => SOURCE_COMMENT.test(readFileSync(file, "utf8")))
    .map((file) => relative(ROOT, file).split(sep).join("/"));

  expect(ported.length).toBeGreaterThan(0);
  const missing = ported.filter((path) => !sources.includes(`\`${path}\``));
  expect(missing).toEqual([]);
});
