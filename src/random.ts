/**
 * Jedyne źródło losowości w aplikacji (planning/phases/README.md): generator z ziarnem, więc to samo
 * ziarno daje tę samą sesję w testach. Math.random poza tym plikiem jest zabroniony (test no-math-random).
 * Faza 8 dodaje worki, ważone losowanie i rozwidlanie strumieni.
 */
export interface Rng {
  /** Liczba z przedziału [0, 1). */
  float(): number;
  /** Liczba całkowita z przedziału [min, max] (oba końce włącznie). */
  int(min: number, max: number): number;
  /** Jeden element niepustej listy. */
  pick<T>(list: readonly T[]): T;
}

/** Największe ziarno, jakie losujemy (dodatnia liczba 31-bitowa). */
export const MAX_SEED = 0x7fffffff;

/** Generator mulberry32: szybki, 32-bitowy, w pełni deterministyczny. */
export function createRng(seed: number): Rng {
  let state = seed >>> 0;
  const next = (): number => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    float: next,
    int: (min, max) => min + Math.floor(next() * (max - min + 1)),
    pick: (list) => {
      if (list.length === 0) throw new Error("Nie można wybrać elementu z pustej listy.");
      return list[Math.floor(next() * list.length)];
    },
  };
}

/** Ziarno sesji: z kryptograficznego generatora przeglądarki, a gdy go brak, z zegara. */
export function randomSeed(): number {
  const crypto = globalThis.crypto;
  if (crypto?.getRandomValues) {
    return (crypto.getRandomValues(new Uint32Array(1))[0] % MAX_SEED) + 1;
  }
  return ((Date.now() ^ 0x9e3779b9) >>> 0) % MAX_SEED || 1;
}
