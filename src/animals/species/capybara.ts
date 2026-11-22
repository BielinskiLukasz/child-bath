import { makeRig, oval, pair, path, rounded, waving } from "../geometry/template";

export const capybara = makeRig({
  fur: "#b78268", furDark: "#9c7155", accent: "#dfb99a",
  body: [oval("body", 0, 55, 31, 29, "fur", true), oval("body", 0, 27, 21, 12, "fur", true)],
  bodyDetails: [oval("body", 0, 59, 21, 19, "#c99677")],
  ears: [...pair("ears", 22, -31, 7, 8, "furDark", true), ...pair("ears", 22, -31, 3.5, 4, "#d5a088")],
  head: [rounded("head", -34, -34, 68, 63, 18, "fur", true)],
  arms: [oval("arm", -30, 52, 8, 16, "furDark", true, 15), waving(oval("arm", 31, 46, 8, 16, "furDark", true, -22))],
  details: [rounded("face", -25, -1, 50, 26, 10, "accent"), ...pair("nose", 5.5, 5, 2.5, 2.1, "ink"),
    path("extra", "M-21-18q6-4 12-2l-1 2q-5-1-11 2Zm30-2q6-2 12 2v2q-6-3-11-2Z", "furDark")],
  eyes: { x: 17, y: -11, rx: 2.7, ry: 3.1, glint: "cream" },
  useNose: false, cheeks: false, smile: "M-8 15Q0 21 8 15", mouth: [0, 17],
  anchors: { headTop: [0, -34], earLeft: [-22, -33], earRight: [22, -33], brow: [0, -20], neck: [0, 32] },
});