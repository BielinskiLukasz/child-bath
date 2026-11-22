import { head, line, makeRig, muzzle, oval, pair, path, waving } from "../geometry/template";

export const otter = makeRig({
  fur: "#9c7155", furDark: "#815844", accent: "#f3dcc4",
  back: [path("tail", "M-13 59L-10 70Q-17 71-24 77Q-34 88-50 89Q-55 89-54 85Q-47 84-40 76Q-29 62-13 59Z", "furDark", true)],
  body: [oval("body", 0, 49, 20, 32, "fur", true)],
  bodyDetails: [oval("body", 0, 50, 13, 22, "#d5ae90")],
  paws: pair("paws", 12, 77, 10, 6, "furDark", true),
  arms: [oval("arm", -20, 41, 7, 15, "fur", true, 20), waving(oval("arm", 23, 36, 7.4, 15, "fur", true, -35))],
  ears: [...pair("ears", 19, -23, 8, 8, "fur", true), ...pair("ears", 21, -24, 4.5, 4, "#d5ae90")],
  head: [head(27, 26)],
  details: [muzzle(19, 12, "accent", 11), line("face", "M-10 8l-12-2m12 6-11 2m31-6 12-2m-12 6 11 2", "furDark", 1.4)],
  eyes: { x: 10, y: -6, rx: 2.7, ry: 3.3, glint: "cream" },
  cheeks: false,
  anchors: { headTop: [0, -27], earLeft: [-21, -24], earRight: [21, -24], brow: [0, -18], neck: [0, 30] },
  collar: { center: [0, 30], width: 0.86 },
});