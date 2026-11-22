import { expect, test } from "@playwright/test";
import { sampleAtmosphere, SEASONS, WEATHER_TYPES } from "../../src/world/atmosphere";
import { advanceWorldClock, createWorldClock, nextWorldRound, worldAtmosphere } from "../../src/world/worldClock";
import { TIMING } from "../../src/timing";

test("ziarno daje powtarzalną godzinę, pogodę, sezon i księżyc", () => {
  expect(createWorldClock(71)).toEqual(createWorldClock(71));
  expect(createWorldClock(71)).not.toEqual(createWorldClock(72));
  const draws = Array.from({ length: 120 }, (_, i) => createWorldClock(i + 1));
  expect(new Set(draws.map(({ weather }) => weather))).toEqual(new Set(WEATHER_TYPES));
  expect(new Set(draws.map(({ season }) => season))).toEqual(new Set(SEASONS));
  expect(draws.every(({ hour, moonPhase }) => hour >= 0 && hour < 24 && moonPhase >= 0 && moonPhase < 1)).toBe(true);
});

test("dwie minuty aktywnej widocznej kąpieli odpowiadają godzinie, a pauza niczego nie zmienia", () => {
  const start = createWorldClock(11, { hour: 23.75 });
  const during = advanceWorldClock(start, TIMING.worldHourSeconds, true, true);
  expect(during.hour).toBeCloseTo(0.75);
  expect(advanceWorldClock(during, 600, false, true)).toBe(during);
  expect(advanceWorldClock(during, 600, true, false)).toBe(during);
  const midnight = sampleAtmosphere({ ...worldAtmosphere(during), hour: 0 });
  const wrap = sampleAtmosphere({ ...worldAtmosphere(during), hour: 24 });
  expect(midnight).toEqual(wrap);
  expect(nextWorldRound(during).moonPhase).toBe(during.moonPhase);
});

test("nowy sezon przenika przez 3 s, pogoda przez 8 s, bez skoku przy ponownym przejściu", () => {
  const start = createWorldClock(21);
  const next = nextWorldRound(start);
  const index = (SEASONS.indexOf(start.season) + 1) % 4;
  const newWeather = next.weather;
  expect(next.season).toBe(SEASONS[index]);
  expect(worldAtmosphere(next).seasonWeights).toEqual(worldAtmosphere(start).seasonWeights);
  expect(worldAtmosphere(next).weights).toEqual(worldAtmosphere(start).weights);
  const seasonMiddle = advanceWorldClock(next, 1.5, false, true);
  expect(worldAtmosphere(seasonMiddle).seasonWeights[next.season]).toBeCloseTo(0.5);
  const seasonEnd = advanceWorldClock(next, 3, false, true);
  expect(worldAtmosphere(seasonEnd).seasonWeights[next.season]).toBe(1);
  expect(worldAtmosphere(seasonEnd).weights[newWeather]).toBeLessThan(0.5);
  const weatherMiddle = advanceWorldClock(next, 4, false, true);
  expect(worldAtmosphere(weatherMiddle).weights[newWeather]).toBeCloseTo(0.5);
  expect(worldAtmosphere(nextWorldRound(weatherMiddle)).weights).toEqual(worldAtmosphere(weatherMiddle).weights);
  expect(advanceWorldClock(weatherMiddle, 50, false, false)).toBe(weatherMiddle);
  const weatherEnd = advanceWorldClock(next, 8, false, true);
  expect(worldAtmosphere(weatherEnd).weights[newWeather]).toBe(1);
  expect(Object.values(worldAtmosphere(weatherMiddle).weights).reduce((sum, n) => sum + n, 0)).toBeCloseTo(1);
});

test("stałe ustawienia mają pierwszeństwo i nie zmieniają fazy księżyca", () => {
  const start = createWorldClock(57, { hour: 18, time: "night", season: "autumn", weather: "rain" });
  let state = start;
  for (let round = 0; round < 4; round++) {
    state = advanceWorldClock(nextWorldRound(state), 240, true, true);
    expect(state).toMatchObject({ hour: 1, season: "autumn", weather: "rain", moonPhase: start.moonPhase });
    expect(worldAtmosphere(state)).toMatchObject({ mode: "override", weights: { rain: 1 } });
  }
  const season = createWorldClock(24).season;
  let clock = createWorldClock(24);
  for (let round = 0; round < 4; round++) clock = nextWorldRound(clock);
  expect(clock.season).toBe(season);
});

function luminance(hex: string): number {
  return [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255)
    .reduce((sum, s, index) => sum + [0.2126, 0.7152, 0.0722][index] * (s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4), 0);
}

test("tusz, wyciszony tekst i akcent zachowują kontrast 4,5 : 1 przez cały dzień", () => {
  const core = worldAtmosphere(createWorldClock(61));
  const ratios: number[] = [];
  for (let index = 0; index < 144; index++) {
    const sample = sampleAtmosphere({ ...core, hour: index / 6 });
    ratios.push(...[sample.ink, sample.muted, sample.accent].map((foreground) => (luminance(sample.paper) + .05) / (luminance(foreground) + .05)));
  }
  expect(Math.min(...ratios)).toBeGreaterThanOrEqual(4.5);
  expect(sampleAtmosphere({ ...core, hour: 1 }).ink).not.toBe(sampleAtmosphere({ ...core, hour: 12 }).ink);
});