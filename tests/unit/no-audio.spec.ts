import { existsSync, readdirSync, readFileSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const SOURCE_DIRS = ["src", "public"];
const SOURCE_FILES = ["index.html"];
const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".css", ".html", ".json", ".svg"]);

/** Zasada 2 z PROJECT.md: aplikacja nie wydaje dźwięków i nie wibruje. */
const FORBIDDEN = [
  { name: "new Audio()", pattern: /new\s+Audio\s*\(/ },
  { name: "AudioContext", pattern: /\b(?:webkit)?AudioContext\b/ },
  { name: "speechSynthesis", pattern: /\bspeechSynthesis\b/ },
  { name: "navigator.vibrate", pattern: /\bvibrate\s*\(/ },
  { name: "<audio>", pattern: /<audio[\s>]/i },
  { name: "<video>", pattern: /<video[\s>]/i },
];
// Zbudowany plik zawiera kod Reacta z nazwami znaczników, więc sprawdzamy w nim tylko wywołania API.
const FORBIDDEN_IN_BUILD = FORBIDDEN.filter((rule) => !rule.name.startsWith("<"));

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return walk(path);
    return SOURCE_EXTENSIONS.has(extname(entry.name)) ? [path] : [];
  });
}

test("kod źródłowy nie używa dźwięku ani wibracji", () => {
  const files = [...SOURCE_DIRS.flatMap((dir) => walk(join(ROOT, dir))), ...SOURCE_FILES.map((file) => join(ROOT, file))];
  expect(files.length).toBeGreaterThan(0);

  const hits: string[] = [];
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    for (const rule of FORBIDDEN) {
      if (rule.pattern.test(text)) hits.push(`${relative(ROOT, file)}: ${rule.name}`);
    }
  }
  expect(hits).toEqual([]);
});

test("zbudowany dist/index.html nie używa dźwięku ani wibracji", () => {
  const dist = join(ROOT, "dist", "index.html");
  expect(existsSync(dist), "Brak dist/index.html: najpierw npm run build").toBe(true);
  const text = readFileSync(dist, "utf8");
  const hits = FORBIDDEN_IN_BUILD.filter((rule) => rule.pattern.test(text)).map((rule) => rule.name);
  expect(hits).toEqual([]);
});
