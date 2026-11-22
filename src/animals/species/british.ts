import { head, line, makeRig, oval, pair, path } from "../geometry/template";

export const british = makeRig({
  fur: "#9aa4b1", furDark: "#778495", accent: "#b7c4ce",
  back: [path("tail", "M19 63Q35 64 44 54Q47 46 52 44Q59 43 62 48Q67 58 54 67Q40 77 21 75Z", "furDark", true)],
  body: [oval("body", 0, 28, 18, 13, "fur", true), oval("body", 0, 55, 30, 28, "fur", true)],
  bodyDetails: [oval("body", 0, 55, 18, 19, "accent")],
  paws: pair("paws", 17, 76, 12.5, 7.5, "fur", true),
  ears: [...pair("ears", 24, -23, 9.25, 12, "fur", true, 17), ...pair("ears", 25, -24, 4.85, 6.2, "#b6a6a8", false, 17)],
  head: [head(34, 30)],
  details: [...pair("face", 11, 10, 16, 13, "accent"), oval("nose", 0, 7, 4.35, 2.85, "#6e6069"),
    line("face", "M-14 9l-11-2m11 6-10 2m38-6 11-2m-11 6 10 2", "furDark", 1.45)],
  eyes: { x: 11, y: -5, rx: 3.1, ry: 3.55, glint: "cream" }, cheeks: false, useNose: false,
  anchors: { headTop: [0, -31], earLeft: [-24, -29], earRight: [24, -29], brow: [0, -17], neck: [0, 32] },
});