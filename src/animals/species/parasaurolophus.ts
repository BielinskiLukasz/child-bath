import { line, makeRig, oval, pair, path, waving } from "../geometry/template";

export const parasaurolophus = makeRig({
  fur: "#a5bbae", furDark: "#b78268", accent: "#d8e4d4",
  back: [path("tail", "M14 62Q39 66 54 48Q59 42 64 46Q67 49 63 55Q50 75 19 76Z", "#859c8d", true)],
  body: [oval("body", 0, 52, 28, 31, "fur", true), oval("body", 0, 25, 18, 17, "fur", true)],
  bodyDetails: [oval("body", 0, 54, 18, 19, "accent")],
  paws: pair("paws", 14, 78, 11.5, 6.5, "#859c8d", true),
  arms: [oval("arm", -25, 48, 7, 13, "fur", true, 24), waving(oval("arm", 27, 43, 7, 12, "fur", true, -28))],
  ears: [path("head", "M-13-25C-9-44 5-56 20-68Q31-78 40-69Q47-62 38-55C25-44 20-38 16-24Z", "furDark", true),
    path("extra", "M10-49Q20-61 30-66Q36-69 38-65Q37-62 32-60Q23-54 17-46Z", "#d4a38c")],
  head: [oval("head", 0, -5, 30, 28, "fur", true)],
  details: [path("face", "M-23 8Q-15 1 0 2Q15 1 23 8Q19 22 0 22Q-19 22-23 8Z", "accent"),
    line("nose", "M-7 8h1m12 0h1", "#758e7e", 2.2)],
  eyes: { x: 12, y: -9, rx: 3, ry: 3.7, glint: "cream" }, cheeks: false, useNose: false,
  smile: "M-10 14Q0 20 10 14", mouth: [0, 16],
  anchors: { headTop: [0, -31], earLeft: [-23, -18], earRight: [24, -17], brow: [0, -22], neck: [0, 27] },
  collar: { center: [0, 27], width: 0.82 },
});