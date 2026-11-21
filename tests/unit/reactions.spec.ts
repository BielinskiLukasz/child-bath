import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { ANIMALS, ANIMALS_BY_ID } from "../../src/animals/roster";
import { createReactionPlayer, isFaceReaction, REACTIONS, reactionDuration, rewardReaction } from "../../src/animals/reactions";
import { PACES } from "../../src/settings/defaults";
import { TIMING } from "../../src/timing";

test("dwanaście reakcji, co najmniej trzy reakcje Żabki i Labradora oraz bezpieczny czas", () => {
  const kinds = Object.keys(REACTIONS) as (keyof typeof REACTIONS)[];
  expect(kinds).toHaveLength(12);
  expect(new Set(ANIMALS.flatMap(({ reactions }) => reactions))).toEqual(new Set(kinds));
  expect(ANIMALS_BY_ID.frog.reactions).toEqual(["pawSplash", "squint", "smileClosed", "shine"]);
  expect(ANIMALS_BY_ID.labrador.reactions).toEqual(["tailWag", "shake", "stretch", "smileClosed"]);
  for (const kind of kinds) for (const pace of PACES) {
    const seconds = reactionDuration(kind, pace);
    expect(seconds, kind).toBeGreaterThanOrEqual(1.2);
    expect(seconds, kind).toBeLessThanOrEqual(TIMING.reward * pace);
  }
  for (const def of ANIMALS) {
    expect(isFaceReaction(rewardReaction(def, 7, 1, true).kind)).toBe(true);
    expect(def.reactions).toContain(rewardReaction(def, 7, 1, false).kind);
  }
});

test("odtwarzacz nie nakłada ani nie kolejkuje reakcji i odrzuca ruch przy innej preferencji", () => {
  const player = createReactionPlayer();
  expect(player.playReaction("shake", 1, true)).toBeNull();
  const run = player.playReaction("smileClosed", 1, true)!;
  expect(run.kind).toBe("smileClosed");
  expect(player.playReaction("tailWag")).toBeNull();
  expect(player.advance(run.seconds - 0.1)).toBe(true);
  expect(player.playReaction("stretch")).toBeNull();
  expect(player.advance(0.11)).toBe(false);
  expect(player.advance(0.01)).toBe(false);
  expect(player.playReaction("fluff")?.kind).toBe("fluff");
});

test("klatki reakcji modyfikują wyłącznie transform i opacity, mimika bez transformacji", () => {
  const css = readFileSync(new URL("../../src/styles/animations.css", import.meta.url), "utf8");
  const reactions = css.split(/(?=@keyframes animal-)/).slice(1);
  expect(reactions.length).toBeGreaterThanOrEqual(12);
  for (const reaction of reactions) {
    const name = reaction.match(/^@keyframes (animal-[\w-]+)/)?.[1];
    const frames = reaction.slice(0, reaction.indexOf("\n") > -1 ? reaction.indexOf("\n") : reaction.length);
    const properties = [...frames.matchAll(/([\w-]+)\s*:/g)].map((match) => match[1]);
    expect(properties.length, name).toBeGreaterThan(0);
    expect(properties.every((property) => property === "transform" || property === "opacity"), name).toBe(true);
    if (name?.startsWith("animal-face-")) expect(properties).not.toContain("transform");
  }
});