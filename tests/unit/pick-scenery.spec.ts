import { expect, test } from "@playwright/test";
import { createRng } from "../../src/random";
import { SCENERY_IDS, type SceneryId } from "../../src/world/scenery";
import { pickScenery, type SceneDraw } from "../../src/world/pickScenery";
import { pickCompanions } from "../../src/world/companions";

const summer: SceneDraw = { allowed: SCENERY_IDS, season: "summer", weather: "clear", time: "dusk" };

test("worek odwiedza wszystkie dostępne scenerie i nie powtarza sceny po sobie", () => {
  const rng = createRng(17);
  let previous: SceneryId | undefined;
  let remaining: SceneryId[] | undefined;
  const history: SceneryId[] = [];
  for (let i = 0; i < 18; i++) {
    const draw = pickScenery({ ...summer, previous, remaining }, rng);
    expect(draw.id).not.toBe(previous);
    previous = draw.id;
    remaining = draw.remaining;
    history.push(draw.id);
  }
  for (let i = 0; i < 18; i += 6) expect(new Set(history.slice(i, i + 6))).toEqual(new Set(SCENERY_IDS));
});

test("filtry, przypięcie i łazienka zapasowa", () => {
  const rng = createRng(3);
  expect(pickScenery({ ...summer, allowed: ["jetty"], weather: "snow" }, rng).id).toBe("bathroom");
  expect(pickScenery({ ...summer, allowed: ["garden"], season: "autumn" }, rng).id).toBe("bathroom");
  expect(pickScenery({ ...summer, allowed: ["lavender_spa"], time: "day" }, rng).id).toBe("bathroom");
  expect(pickScenery({ ...summer, allowed: ["lavender_spa"], time: "night" }, rng).id).toBe("lavender_spa");
  expect(pickScenery({ ...summer, allowed: ["bathroom"], season: "winter", weather: "snow", pinned: "jetty" }, rng).id).toBe("jetty");
  expect(pickScenery({ ...summer, allowed: [], previous: "jetty" }, rng).id).toBe("bathroom");
});

test("na zimowym losowaniu góry mają większą wagę, a towarzysze nie dublują się", () => {
  const ids = Array.from({ length: 360 }, (_, i) => pickScenery({ ...summer, season: "winter" }, createRng(i + 1)).id);
  expect(ids.filter((id) => id === "mountain_tub").length).toBeGreaterThan(205);
  expect(new Set(ids)).toEqual(new Set(["bathroom", "mountain_tub"]));
  for (let seed = 1; seed <= 32; seed++) {
    const companions = pickCompanions(createRng(seed));
    expect(companions.length).toBeGreaterThanOrEqual(1);
    expect(companions.length).toBeLessThanOrEqual(2);
    expect(new Set(companions).size).toBe(companions.length);
    expect(pickCompanions(createRng(seed))).toEqual(companions);
  }
});