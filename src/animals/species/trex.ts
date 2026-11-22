import { makeRig, muzzle, oval, pair, path, waving } from "../geometry/template";

export const trex = makeRig({
  fur: "#b9c79d", furDark: "#91a17b", accent: "#e3e9c9",
  back: [path("tail", "M17 60Q34 66 48 57Q55 51 62 51Q69 53 63 59Q47 79 19 75Z", "furDark", true)],
  body: [oval("body", 0, 53, 30, 30, "fur", true), oval("body", 0, 29, 20, 12, "fur", true)],
  bodyDetails: [oval("body", 0, 53, 20, 20, "accent")],
  paws: pair("paws", 18, 76, 14, 8, "furDark", true),
  arms: [oval("arm", -27, 43, 5.5, 9, "fur", true, 30), waving(oval("arm", 30, 38, 5.5, 9, "fur", true, -31))],
  head: [oval("head", 0, -9, 38, 33, "fur", true)],
  details: [muzzle(25, 13, "accent", 9), ...pair("nose", 6, 3, 2.1, 1.55, "furDark")],
  eyes: { x: 15, y: -13, rx: 4.35, ry: 5, glint: "cream" },
  useNose: false, cheeks: false, smile: "M-12 11Q0 20 12 11", mouth: [0, 14],
  anchors: { headTop: [0, -42], earLeft: [-28, -23], earRight: [28, -23], brow: [0, -29], neck: [0, 27] },
  collar: { center: [0, 27], width: 1.02 },
});