import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";
import { createRng, MAX_SEED, randomSeed } from "../../src/random";

const SRC = fileURLToPath(new URL("../../src", import.meta.url));

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : /\.(ts|tsx)$/.test(name) ? [path] : [];
  });
}

test("to samo ziarno daje ten sam ciąg liczb", () => {
  const a = createRng(42);
  const b = createRng(42);
  const c = createRng(43);
  const seqA = Array.from({ length: 20 }, () => a.float());
  expect(Array.from({ length: 20 }, () => b.float())).toEqual(seqA);
  expect(Array.from({ length: 20 }, () => c.float())).not.toEqual(seqA);
  expect(seqA.every((value) => value >= 0 && value < 1)).toBe(true);
});

test("int mieści się w przedziale, pick wybiera z listy, pusta lista jest błędem", () => {
  const rng = createRng(7);
  const ints = Array.from({ length: 500 }, () => rng.int(2, 5));
  expect(Math.min(...ints)).toBe(2);
  expect(Math.max(...ints)).toBe(5);
  expect(["a", "b", "c"]).toContain(rng.pick(["a", "b", "c"]));
  expect(() => rng.pick([])).toThrow();
});

test("ziarno sesji jest dodatnią liczbą całkowitą", () => {
  const seed = randomSeed();
  expect(Number.isInteger(seed)).toBe(true);
  expect(seed).toBeGreaterThan(0);
  expect(seed).toBeLessThanOrEqual(MAX_SEED);
});

test("Math.random występuje tylko w src/random.ts", () => {
  const offenders = walk(SRC)
    .filter((file) => !file.endsWith(`${sep}random.ts`))
    .filter((file) => /Math\.random\s*\(/.test(readFileSync(file, "utf8")))
    .map((file) => relative(SRC, file));
  expect(offenders).toEqual([]);
});
