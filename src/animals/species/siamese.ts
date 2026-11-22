import { line, makeRig, oval, pair, path, waving } from "../geometry/template";

export const siamese = makeRig({
  fur: "#f3e6d3", furDark: "#6b5248", accent: "#fbf4ea",
  back: [path("tail", "M12 70Q31 73 42 58Q47 47 51 42Q55 38 58 41Q61 44 57 51Q45 79 19 79Z", "furDark", true)],
  body: [oval("body", 0, 28, 13, 11, "fur", true), oval("body", 0, 52, 21, 32, "fur", true)],
  bodyDetails: [oval("body", 0, 52, 13, 21, "accent")],
  paws: pair("paws", 12, 77, 10.5, 7.5, "furDark", true),
  arms: [oval("arm", -20, 45, 7, 18, "fur", true, 18), waving(oval("arm", 23, 38, 7, 18, "fur", true, -27)),
    oval("arm", -23.6, 56.2, 4.5, 5.15, "furDark", false, 18), waving(oval("arm", 18.4, 29, 4.3, 5.25, "furDark", false, -27))],
  ears: [path("ears", "M-31-10L-34-53Q-34-59-28-55L-6-27L-12-13ZM12-13L6-27L28-55Q34-59 34-53L31-10Z", "furDark", true),
    path("ears", "M-27-27L-29-47L-14-29ZM14-29L29-47L27-27Z", "#b09286")],
  head: [path("head", "M-32-5Q-31-27 0-29Q31-27 32-5Q27 19 7 26Q0 29-7 26Q-27 19-32-5Z", "fur", true)],
  details: [path("face", "M0-21Q9-20 18-11Q24-6 22 1Q20 17 4 21Q0 23-4 21Q-20 17-22 1Q-24-6-18-11Q-9-20 0-21Z", "furDark"),
    oval("nose", 0, 6, 3.8, 2.7, "#4f413b"), line("face", "M-10 9l-12-2m12 6-10 2m30-6 12-2m-12 6 10 2", "#ad8b7b", 1.35),
    line("face", "M-6 13Q-3 17 0 13Q3 17 6 13", "#d6b6a3", 1.4)],
  eyes: { x: 10, y: -5, rx: 3.15, ry: 2.8, color: "#b7ceda" },
  cheeks: false, useNose: false, smile: false, mouth: [0, 14],
  anchors: { headTop: [0, -29], earLeft: [-29, -39], earRight: [29, -39], brow: [0, -16], neck: [0, 31] },
  collar: { center: [0, 31], width: 0.8 },
});