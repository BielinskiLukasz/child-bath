import { makeRig, muzzle, oval, pair, path, waving } from "../geometry/template";

export const stegosaurus = makeRig({
  fur: "#94aa83", furDark: "#6f8769", accent: "#dfbc70",
  back: [
    path("tail", "M16 59C31 64 45 58 53 48Q60 40 65 44Q70 48 62 56Q43 78 19 75Z", "furDark", true),
    path("back", "M-45 65Q-52 57-50 47Q-49 40-42 43L-31 51L-26 64ZM-36 52Q-46 40-44 27Q-43 19-36 23Q-28 26-20 37L-17 49ZM-20 46Q-28 36-27 20Q-26 10-18 15Q-8 20-3 36L-1 49ZM22 38Q31 23 39 23Q45 23 45 31Q44 43 35 51ZM35 52Q46 38 53 39Q58 39 58 45Q56 55 47 60Z", "accent", true),
  ],
  body: [oval("body", 0, 55, 33, 27, "fur", true), oval("body", 0, 29, 17, 15, "fur", true)],
  bodyDetails: [oval("body", 0, 53, 20, 20, "#bacc9d")],
  paws: pair("paws", 17, 76, 13, 8, "furDark", true),
  arms: [oval("arm", -27, 53, 7, 13, "fur", true, 24), waving(oval("arm", 28, 48, 8, 12, "fur", true, -22))],
  head: [oval("head", 0, 0, 29, 27, "fur", true)],
  details: [muzzle(17, 12, "#bacc9d", 12), ...pair("nose", 5, 9, 1.6, 1.45, "furDark")],
  eyes: { x: 11, y: -5, rx: 2.9, ry: 3.45, glint: "cream" }, useNose: false,
  smile: "M-8 15Q0 21 8 15", mouth: [0, 17],
  anchors: { headTop: [0, -27], earLeft: [-21, -15], earRight: [21, -15], brow: [0, -18], neck: [0, 30] },
});