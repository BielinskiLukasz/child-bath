import { expect, test } from "@playwright/test";
import { ANIMALS } from "../../src/animals/roster";
import { REACTIONS, reactionDuration } from "../../src/animals/reactions";
import type { ReactionKind } from "../../src/animals/types";

const EPOCH = new Date("2026-06-01T12:00:00Z");
const REACTION_KINDS = Object.keys(REACTIONS) as ReactionKind[];

test("galeria porównuje stany, pokazuje kotwice i pozwala wykąpać konkretną postać", async ({ page }) => {
  await page.goto("./?gallery=animals&animal=lion");
  await expect(page.locator(".little-world")).toHaveCount(1);
  await expect(page.locator(".animal-gallery")).toHaveCount(0);
  await page.goto("./?test=1&gallery=animals");
  const gallery = page.locator(".animal-gallery");
  const inspector = gallery.locator(".gallery-inspector");
  await expect(gallery.getByRole("heading", { level: 1 })).toHaveText("Galeria zwierzątek");
  await expect(page.locator("[data-gallery-animal]")).toHaveCount(20);
  expect(await gallery.evaluate((el) => el.scrollHeight > el.clientHeight)).toBe(true);
  expect(await gallery.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
  await gallery.getByLabel("Stan wszystkich postaci").selectOption("washed");
  const finish = (animal: string) => page.locator(`[data-gallery-animal="${animal}"] [data-finish]`);
  await expect(finish("sheep")).toHaveAttribute("data-finish", "woolly");
  await expect(finish("owl")).toHaveAttribute("data-finish", "feathered");
  await expect(finish("labrador")).toHaveAttribute("data-finish", "fluffy");
  await expect(finish("turtle")).toHaveAttribute("data-finish", "shell");
  await expect(finish("hedgehog")).toHaveAttribute("data-finish", "spiny");
  await expect(finish("frog")).toHaveAttribute("data-finish", "smooth");
  expect(await finish("sheep").locator("path").count()).toBeGreaterThan(await finish("labrador").locator("path").count());
  // Pióra i połysk muszą leżeć na okrywie, a nie zostać przez nią zasłonięte.
  await expect(page.locator('[data-gallery-animal="turtle"] [data-silhouette] ~ [data-finish="shell"]')).toHaveCount(1);
  await expect(page.locator('[data-gallery-animal="owl"] [data-silhouette] ~ [data-finish="feathered"]')).toHaveCount(1);
  await gallery.getByLabel("Grupa", { exact: true }).selectOption("dalekie");
  await expect(page.locator("[data-gallery-animal]")).toHaveCount(4);
  await gallery.getByRole("button", { name: "Obejrzyj: Panda" }).click();
  await expect(inspector).toHaveAttribute("data-selected", "panda");
  await inspector.getByLabel("Pokaż kotwice ozdób").check();
  await expect(inspector.locator("[data-anchor]")).toHaveCount(5);
  await inspector.getByText("Odmiana imienia", { exact: true }).click();
  await expect(inspector.locator("dd").filter({ hasText: /^Pandzie$/ }).first()).toBeVisible();

  for (const state of ["dirty", "wet", "scarf", "robe", "turban", "clean"] as const) {
    await gallery.getByLabel("Stan wszystkich postaci").selectOption(state);
    await expect(inspector.locator("[data-animal-state]")).toHaveAttribute("data-animal-state", state);
    await expect(inspector.locator("[data-part=scarf]")).toHaveCount(["scarf", "robe", "turban"].includes(state) ? 1 : 0);
    if (state === "wet") await expect(inspector.locator(".animal-drops")).toHaveCount(1);
    if (state === "robe" || state === "turban") await expect(inspector.locator(`[data-wear="${state}"]`)).toHaveCount(1);
  }
  await inspector.getByLabel("Nastrój").selectOption("dozing");
  await expect(inspector.locator("[data-mood]")).toHaveAttribute("data-mood", "dozing");
  await inspector.getByRole("link", { name: /Wykąp Pandę/ }).click();
  await expect(page.locator(".bath-stage")).toHaveAttribute("data-animal", "panda");
});

test("każda reakcja jest odtwarzana tylko raz, bez nakładania i z ograniczonym ruchem", async ({ page }) => {
  await page.clock.install({ time: EPOCH });
  await page.clock.pauseAt(new Date(EPOCH.getTime() + 1000));
  await page.goto("./?test=1&gallery=animals&pace=0.8");
  const inspector = page.locator(".gallery-inspector");
  const selected = inspector.getByLabel("Zwierzątko", { exact: true });
  const samples = () => inspector.locator(".animal-figure").evaluate((element) =>
    element.getAnimations({ subtree: true }).map((animation) => {
      const effect = animation.effect as KeyframeEffect;
      return { duration: effect.getTiming().duration, iterations: effect.getTiming().iterations,
        props: [...new Set(effect.getKeyframes().flatMap((frame) => Object.keys(frame)))],
      };
    }),
  );
  for (const kind of REACTION_KINDS) {
    const def = ANIMALS.find((candidate) => candidate.reactions.includes(kind))!;
    await selected.selectOption(def.id);
    const button = inspector.locator(`[data-play-reaction="${kind}"]`);
    await button.click();
    await expect(inspector.locator("[data-reaction]")).toHaveAttribute("data-reaction", kind);
    await expect(button).toHaveAttribute("aria-disabled", "true");
    const other = inspector.locator(`[data-play-reaction]:not([data-play-reaction="${kind}"])`).first();
    await other.evaluate((el) => (el as HTMLButtonElement).click());
    await expect(inspector.locator("[data-reaction]")).toHaveAttribute("data-reaction", kind);
    const animations = await samples();
    expect(animations.length, kind).toBeGreaterThan(0);
    for (const motion of animations) {
      expect(motion.duration, kind).toBeGreaterThanOrEqual(1200);
      expect(motion.iterations).toBe(1);
      expect(motion.props.filter((key) => !["offset", "easing", "composite", "computedOffset", "opacity", "transform"].includes(key))).toEqual([]);
    }
    await page.clock.runFor(reactionDuration(kind, 0.8) * 1000 + 100);
    await expect(inspector.locator("[data-reaction]")).toHaveCount(0);
  }
  await selected.selectOption("labrador");
  await inspector.locator('[data-play-reaction="shake"]').click();
  await expect(inspector.locator('[data-reaction="shake"]')).toHaveCount(1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(inspector.locator('[data-reaction="shake"]')).toHaveCount(0);
  await page.clock.runFor(1700);
  await expect(inspector.locator('[data-play-reaction="shake"]')).toHaveAttribute("aria-disabled", "true");
  await inspector.locator('[data-play-reaction="smileClosed"]').click();
  const calm = await samples();
  expect(calm.length).toBeGreaterThan(0);
  expect(calm.flatMap(({ props }) => props)).not.toContain("transform");
});