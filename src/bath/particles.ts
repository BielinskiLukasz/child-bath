// Źródło: child-page@e7a19ac:js/kapiel.js (pula baniek i kropli: rozmiary, dryf, unoszenie 0.18 i opadanie 0.22 wysokości).
// Zmiany: czysty moduł bez DOM; ruch rysuje komponent Particles przez transform i opacity.
import type { Rng } from "../random";
import { MAX_PARTICLES, TIMING } from "../timing";
import { LH } from "./coverage";

export type ParticleKind = "bubble" | "drop";

export interface Particle {
  /** Wiek w sekundach; wartość ujemna oznacza wolne miejsce w puli. */
  age: number;
  x: number;
  y: number;
  r: number;
  /** Boczny dryf w jednostkach logicznych na całe życie cząsteczki. */
  dx: number;
  kind: ParticleKind;
}

export function createPool(size: number = MAX_PARTICLES): Particle[] {
  return Array.from({ length: size }, () => ({ age: -1, x: 0, y: 0, r: 0, dx: 0, kind: "bubble" as ParticleKind }));
}

/** Zajmuje wolne miejsce w puli; gdy pula jest pełna, nic nie robi (najwyżej 28 węzłów). */
export function spawn(pool: Particle[], x: number, y: number, kind: ParticleKind, rng: Rng): boolean {
  const particle = pool.find((p) => p.age < 0);
  if (!particle) return false;
  particle.age = 0;
  particle.x = x;
  particle.y = y;
  particle.kind = kind;
  particle.r = kind === "drop" ? 3 + rng.float() * 2.6 : 8 + rng.float() * 10;
  particle.dx = (rng.float() - 0.5) * 16;
  return true;
}

/** Postarza cząsteczki i zwalnia te, które skończyły życie. Zwraca liczbę żywych. */
export function stepPool(pool: Particle[], dt: number): number {
  let alive = 0;
  for (const particle of pool) {
    if (particle.age < 0) continue;
    particle.age += dt;
    if (particle.age >= TIMING.particleLife) particle.age = -1;
    else alive++;
  }
  return alive;
}

function smooth(t: number): number {
  return t * t * (3 - 2 * t);
}

/** Położenie i krycie żywej cząsteczki: bańki łagodnie się unoszą, krople opadają, obie powoli znikają. */
export function particleView(particle: Particle): { x: number; y: number; opacity: number } {
  const u = Math.min(1, Math.max(0, particle.age / TIMING.particleLife));
  const lift = particle.kind === "drop" ? 0.22 * LH * u * u : -0.18 * LH * smooth(u);
  return { x: particle.x + particle.dx * u, y: particle.y + lift, opacity: 0.8 * (1 - u * u) };
}
