// Źródło: child-page@e7a19ac:js/dogs.js (paleta, niski korpus i długie uszy jamnika).
import { makeRig, oval, pair, path, rounded, waving } from "../geometry/template";

export const dachshund = makeRig({
  fur: "#a8683f", furDark: "#7d4a2b", accent: "#c58d62",
  back: [path("tail", "M25 59C41 58 46 47 53 39Q59 33 63 38Q68 44 61 51C54 64 41 72 27 72Z", "furDark", true)],
  body: [rounded("body", -39, 45, 78, 33, 15, "fur", true), oval("body", 0, 41, 20, 16, "fur", true)],
  bodyDetails: [oval("body", 0, 59, 17, 15, "accent")],
  paws: pair("paws", 23, 77, 13, 7, "furDark", true),
  arms: [oval("arm", -31, 59, 8, 12, "fur", true, 27), waving(oval("arm", 34, 49, 8, 12, "fur", true, -33))],
  ears: pair("ears", 26, 13, 11.5, 24, "furDark", true, 12),
  head: [oval("head", 0, 4, 27, 26, "fur", true)],
  details: [oval("face", 0, 18, 17, 11, "accent"), ...pair("extra", 10, -9, 4.5, 2.3, "accent"), oval("nose", 0, 14.5, 5.1, 3.45, "ink")],
  eyes: { x: 10, y: -3, rx: 2.85, ry: 3.4, glint: "cream" }, cheeks: false, useNose: false,
  smile: "M0 17v4m-6 0Q-3 25 0 21Q3 25 6 21", mouth: [0, 21],
  anchors: { headTop: [0, -22], earLeft: [-27, 8], earRight: [27, 8], brow: [0, -15], neck: [0, 37] },
  collar: { center: [0, 37], width: 0.96 },
});