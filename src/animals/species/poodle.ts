// Źródło: child-page@e7a19ac:js/dogs.js (paleta i pompony pudla).
import { oval, pair, path, makeRig, muzzle, waving } from "../geometry/template";

export const poodle = makeRig({
  fur: "#f1e6d6", furDark: "#e6d6bf", accent: "#fbf4ea", coatProfile: "pompons",
  back: [path("tail", "M12 63Q30 59 39 47Q42 43 46 47Q47 52 44 56Q31 69 16 71Z", "furDark", true),
    path("tail", "M43 36Q52 35 55 42Q62 47 57 53Q54 61 46 58Q38 59 36 51Q32 44 38 41Q39 37 43 36Z", "accent", true)],
  body: [oval("body", 0, 30, 13, 12, "fur", true), oval("body", 0, 53, 21, 28, "fur", true)],
  paws: pair("paws", 12, 74, 11, 10, "furDark", true),
  arms: [oval("arm", -21, 48, 6.8, 13, "fur", true, 19), waving(oval("arm", 25, 40, 8, 14, "furDark", true, -28))],
  ears: [path("ears", "M-28-19Q-23-22-18-17Q-10-17-14-7Q-12-1-16 4Q-15 14-22 16Q-28 22-34 15Q-42 12-40 5Q-46-4-40-10Q-39-18-33-18ZM28-19Q33-18 39-14Q43-12 42-5Q46 2 41 6Q42 15 34 17Q27 22 23 16Q15 14 17 6Q12 0 16-9Q14-17 22-17Z", "furDark", true)],
  head: [oval("head", 0, -1, 23, 23, "fur", true),
    path("head", "M-28-20Q-30-30-22-34Q-21-43-12-43Q-7-51 1-46Q11-51 16-43Q27-45 29-34Q38-27 30-20Q29-12 20-14Q15-8 8-13Q1-7-5-12Q-14-8-19-14Q-26-12-28-20Z", "accent", true)],
  details: [muzzle(13, 10), ...pair("extra", 10, -29, 3, 3, "fur")],
  eyes: { x: 9, y: -3, rx: 2.7, ry: 3.3, glint: "cream" },
  anchors: { headTop: [0, -47], earLeft: [-31, -5], earRight: [31, -5], brow: [0, -18], neck: [0, 26] },
  collar: { center: [0, 27], width: 0.8 },
});