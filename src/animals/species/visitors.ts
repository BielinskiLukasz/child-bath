// Źródło: child-page@e7a19ac:js/animals.js (grzywa i palety Lwa, Słonia, Pandy i Koali).
// Nowe frontalne sylwetki w proporcjach child-train.
import { circle, head, line, makeRig, muzzle, oval, pair, path } from "../geometry/template";

export const visitors = {
  lion: makeRig({
    fur: "#f0c36b", furDark: "#d9964a", accent: "#fbe3b8",
    back: [path("tail", "M15 70Q37 70 42 55Q43 49 48 48Q54 48 53 54Q48 74 21 77Z", "furDark", true), circle("tail", 49, 47, 6, "furDark", true)],
    ears: [
      path("back", "M-43-10Q-45-25-32-29Q-31-42-17-40Q-9-49 1-43Q12-49 23-39Q37-40 38-28Q50-22 45-9Q53 3 45 13Q45 27 32 29Q25 41 12 37Q0 45-11 38Q-25 42-32 30Q-45 28-45 14Q-52 4-43-10Z", "furDark", true),
      ...pair("ears", 24, -23, 11, 11, "fur", true), ...pair("ears", 24, -26, 5.8, 5.8, "accent"),
    ],
    head: [head(31, 31)], details: [muzzle(17, 12, "accent", 13)],
    anchors: { headTop: [0, -42], earLeft: [-25, -25], earRight: [25, -25], neck: [0, 35] },
  }),
  elephant: makeRig({
    fur: "#b9c9dc", furDark: "#8fa3bb", accent: "#d6b8c8",
    ears: [...pair("ears", 33, -2, 22, 26, "fur", true, -18), ...pair("ears", 36, -1, 14, 19, "accent", false, -18)],
    head: [head(31, 28), path("nose", "M-8 6Q0 0 8 6L9 25Q9 33 14 30Q18 27 21 30Q25 34 20 38Q11 46 3 39Q-4 34-6 23Z", "fur", true)],
    details: [line("nose", "M-4 15Q1 17 5 15M-3 22Q1 24 6 22", "furDark", 2.1)],
    useNose: false, smile: false, eyes: { x: 13, y: -6, rx: 2.7, ry: 3.3 },
    anchors: { headTop: [0, -29], earLeft: [-41, -15], earRight: [41, -15], brow: [0, -17], neck: [-16, 35] }, mouth: [0, 12],
  }),
  panda: makeRig({
    fur: "#fbfbfd", furDark: "#4a4560", accent: "#f0e7dc", limbs: "furDark", head: [head(34, 31)],
    ears: pair("ears", 27, -28, 13, 13, "furDark", true),
    details: [...pair("face", 13, -4, 9, 11, "furDark", false, -22), oval("nose", 0, 8, 4.8, 3.5, "furDark")],
    eyes: { x: 13, y: -5, rx: 2.55, ry: 3, color: "cream" },
    useNose: false, anchors: { headTop: [0, -31], earLeft: [-28, -30], earRight: [28, -30] },
  }),
  koala: makeRig({
    fur: "#aeb4bf", furDark: "#4a4560", accent: "#ede2ea",
    ears: [...pair("ears", 31, -19, 18, 17, "fur", true), ...pair("ears", 33, -20, 11, 11, "accent")],
    head: [head(31, 28)], details: [oval("nose", 0, 6, 7.8, 10, "furDark")],
    bodyDetails: [oval("body", 0, 58, 17, 20, "accent")],
    eyes: { x: 13, y: -6, rx: 2.65, ry: 3.1 },
    useNose: false, smile: "M-5 18Q0 23 5 18", mouth: [0, 20],
    anchors: { headTop: [0, -29], earLeft: [-35, -25], earRight: [35, -25] },
  }),
} as const;