// Źródło: child-page@e7a19ac:js/dogs.js (paleta, krótki ogon i złożone uszy).
import { line, makeRig, oval, pair, path, waving } from "../geometry/template";

export const bulldog = makeRig({
  fur: "#e3b98c", furDark: "#c08f63", accent: "#fbf1e4",
  back: [oval("tail", 31, 59, 10, 6.5, "furDark", true, -20)],
  body: [oval("body", 0, 52, 33, 26, "fur", true), oval("body", 0, 29, 19, 13, "fur", true)],
  bodyDetails: [oval("body", 0, 50, 21, 20, "accent")],
  paws: pair("paws", 20, 74, 13, 9, "furDark", true),
  arms: [oval("arm", -29, 55, 9, 13, "fur", true, 16), waving(oval("arm", 32, 47, 9, 13, "fur", true, -23))],
  ears: [path("ears", "M-35-15Q-45-25-43-33Q-40-42-33-38L-16-22L-20-13ZM20-13L16-22L33-38Q40-42 43-33Q45-25 35-15Z", "furDark", true)],
  head: [path("head", "M-40-3Q-34-30 0-29Q34-30 40-3Q43 24 19 28Q0 33-19 28Q-43 24-40-3Z", "fur", true)],
  details: [line("face", "M-13-16Q0-20 13-16m-8 4q8-2 16 0", "furDark", 1.7),
    ...pair("face", 10, 15, 15, 10.5, "accent"), oval("nose", 0, 6, 6, 4, "ink")],
  eyes: { x: 15, y: -6, rx: 3.2, ry: 3.8, glint: "cream" }, cheeks: false, useNose: false,
  smile: "M-11 17Q-6 22 0 17Q6 22 11 17", mouth: [0, 18],
  anchors: { headTop: [0, -29], earLeft: [-36, -26], earRight: [36, -26], brow: [0, -17], neck: [0, 31] },
});