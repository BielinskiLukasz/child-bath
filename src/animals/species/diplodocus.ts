import { makeRig, oval, pair, path, waving } from "../geometry/template";

export const diplodocus = makeRig({
  fur: "#a8bfaa", furDark: "#758f7c", accent: "#dce4c8",
  back: [path("tail", "M15 60C33 62 42 59 52 53Q60 48 62 51Q65 55 58 62Q44 75 16 74Z", "furDark", true)],
  body: [
    path("body", "M-17 51C-12 29-10 8-12-15C-12-35-13-51-8-63Q-4-69 7-62C8-53 6-32 9-15C12 10 13 32 19 49Z", "fur", true),
    oval("body", 0, 58, 25, 24, "fur", true),
  ],
  bodyDetails: [path("body", "M-3-43Q1-46 5-41Q4-19 7 10Q11 32 11 50Q13 64 4 70Q-5 71-9 63Q-12 52-6 34Q-2 16-5-8Q-8-32-3-43Z", "accent")],
  paws: pair("paws", 14, 77, 10, 7, "furDark", true),
  arms: [oval("arm", -21, 49, 7, 12, "fur", true, 23), waving(oval("arm", 22, 48, 7, 12, "fur", true, -24))],
  head: [oval("head", 0, -63, 23, 16, "fur", true)],
  details: [oval("face", 0, -56, 15, 6.8, "accent"), ...pair("nose", 4, -60, 1.25, 1.4, "furDark"),
    ...pair("cheeks", 15, -58, 2.8, 1.4, "#b7a995")],
  eyes: { x: 8, y: -66, rx: 2.5, ry: 3, glint: "cream" },
  cheeks: false, useNose: false, smile: "M-6-55Q0-50 6-55", mouth: [0, -53],
  anchors: { headTop: [0, -79], brow: [0, -74], earLeft: [-17, -64], earRight: [17, -64], neck: [0, -30] },
  collar: { center: [0, -28], width: 0.5 },
});