// Źródło: child-page@e7a19ac:js/kapiel.js (pula baniek i kropli: dryf, unoszenie i opadanie).
// Zmiany: czysty moduł, płynne wygaszanie i osobny limit nieruchomych cząsteczek przy ograniczonym ruchu.
import type { Rng } from "../random";
import { MAX_PARTICLES, TIMING } from "../timing";
import { LH } from "./coverage";

export type ParticleKind = "bubble" | "drop";
export const REDUCED_PARTICLE_LIMIT = 6;

export interface Particle {
  age: number;
  x: number;
  y: number;
  r: number;
  dx: number;
  kind: ParticleKind;
}

export function createPool(): Particle[] {
  return Array.from({ length: MAX_PARTICLES }, () => ({ age: -1, x: 0, y: 0, r: 0, dx: 0, kind: "bubble" as ParticleKind }));
}

export function spawn(pool: Particle[], x: number, y: number, kind: ParticleKind, rng: Rng, limit = MAX_PARTICLES): boolean {
  for (let i = 0; i < Math.min(limit, pool.length); i++) {
    const particle = pool[i];
    if (particle.age >= 0) continue;
    particle.age = 0;
    particle.x = x;
    particle.y = y;
    particle.kind = kind;
    particle.r = kind === "drop" ? 3 + rng.float() * 2.6 : 8 + rng.float() * 10;
    particle.dx = (rng.float() - 0.5) * 16;
    return true;
  }
  return false;
}

export function stepPool(pool: Particle[], dt: number, limit = MAX_PARTICLES): number {
  let alive = 0;
  for (let i = 0; i < pool.length; i++) {
    const particle = pool[i];
    if (particle.age < 0) continue;
    particle.age += dt;
    if (i >= limit || particle.age >= TIMING.particleLife) particle.age = -1;
    else alive++;
  }
  return alive;
}

const smooth = (t: number) => t * t * (3 - 2 * t);

export function particleView(particle: Particle, reduced = false): { x: number; y: number; opacity: number } {
  const age = Math.max(0, Math.min(TIMING.particleLife, particle.age));
  const u = age / TIMING.particleLife;
  const lift = particle.kind === "drop" ? 0.22 * LH * u * u : -0.18 * LH * smooth(u);
  const fade = Math.min(1, age / TIMING.particleFade, (TIMING.particleLife - age) / TIMING.particleFade);
  return { x: reduced ? particle.x : particle.x + particle.dx * u, y: reduced ? particle.y : particle.y + lift, opacity: 0.8 * smooth(fade) };
}
