import { makeRig, oval, pair, path, line, waving } from "../geometry/template";

export const penguin = makeRig({
  fur: "#3e5b4d", furDark: "#354e45", accent: "#f5eedb",
  body: [oval("body", 0, 28, 32, 54, "fur", true)],
  bodyDetails: [oval("body", 0, 43, 24, 33, "accent")],
  paws: pair("paws", 13, 76, 12, 7, "#d3a653", true),
  arms: [
    path("arm", "M-25 22L-20 28L-24 43Q-27 57-36 62Q-41 65-42 59C-44 45-35 26-25 22Z", "furDark", true),
    waving(path("arm", "M20 28L25 22C35 26 44 45 42 59Q41 65 36 62Q27 57 24 43Z", "furDark", true)),
  ],
  head: [oval("head", 0, -6, 30, 28, "fur", true)],
  details: [path("face", "M-25-2Q-25-22-12-23Q-3-23 0-13Q3-23 12-23Q25-22 25-2Q24 18 0 20Q-24 18-25-2Z", "accent"),
    path("nose", "M-9 5Q0 0 9 5Q5 13 0 14Q-6 12-9 5Z", "#f2b84b"), line("nose", "M-6 6Q0 8 6 6", "#a87943", 1.2)],
  face: "custom", useNose: false, cheeks: false, smile: false,
  eyes: { x: 12, y: -7, rx: 2.9, ry: 3.6, glint: "cream" }, mouth: [0, 9],
  anchors: { headTop: [0, -34], earLeft: [-22, -18], earRight: [22, -18], brow: [0, -18], neck: [0, 22] },
  collar: { center: [0, 22], width: 1 },
});