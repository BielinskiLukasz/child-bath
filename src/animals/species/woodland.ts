// Źródło: child-train@b881e09:src/components/illustration/Animal.tsx (sylwetki, twarze i FUR_COLORS).
// Przeniesione do wspólnego zestawu kształtów; ogon i pełne wycinanki zastępują grube kreski.
import { circle, head, line, makeRig, muzzle, oval, pair, path } from "../geometry/template";

export const woodland = {
  rabbit: makeRig({
    fur: "#f3ebd7", furDark: "#d3bca4", accent: "#dcb9a8", head: [head(32, 30)],
    ears: [
      ...pair("ears", 17, -48, 11, 34, "fur", true, 13),
      ...pair("ears", 17, -50, 4.5, 24, "accent", false, 13),
    ],
    details: [oval("face", 0, 14, 15, 10, "cream")],
    anchors: { earLeft: [-21, -61], earRight: [21, -61], brow: [0, -18] },
  }),
  fox: makeRig({
    fur: "#c77f4e", furDark: "#a9603e", accent: "#deb59a",
    back: [
      path("tail", "M8 67C17 66 31 60 36 52C46 37 59 40 64 46C70 58 55 77 33 78C23 80 14 78 8 73Z", "furDark", true),
      path("tail", "M53 42Q60 40 64 46Q68 53 62 61Q55 58 48 59Q48 50 53 42Z", "cream"),
    ],
    ears: [path("ears", "M-34-48Q-21-48-4-23L-31-9Q-36-31-34-48ZM34-48Q36-29 31-9L4-23Q20-46 34-48Z", "fur", true),
      path("ears", "M-29-41L-15-25L-28-24ZM29-41L28-24L15-25Z", "accent")],
    head: [path("head", "M-37-5Q-35-35 0-35T37-5Q28 28 0 33Q-28 28-37-5Z", "fur", true)],
    details: [path("face", "M-34-4Q-11-4 0 14Q11-4 34-4Q24 23 0 30Q-24 23-34-4Z", "cream")],
    anchors: { headTop: [0, -34], earLeft: [-29, -32], earRight: [29, -32] },
  }),
  bear: makeRig({
    fur: "#b08557", furDark: "#937052", accent: "#dccaab", head: [circle("head", 0, -1, 34, "fur", true)],
    ears: [...pair("ears", 27, -27, 14, 14, "fur", true), ...pair("ears", 27, -27, 7, 7, "#d1b28b")],
    details: [muzzle(18, 14, "accent", 12)],
    anchors: { headTop: [0, -35], earLeft: [-29, -30], earRight: [29, -30] },
  }),
  hedgehog: makeRig({
    fur: "#9c8874", furDark: "#6d5845", accent: "#edd9bd",
    ears: [path("back", "M-42-19Q-44-31-35-31L-38-42Q-36-47-31-43L-22-37L-18-50Q-15-54-10-49L-3-42L6-52Q10-54 13-49L16-39L31-44Q36-44 34-37L32-32L46-26Q51-24 48-19L42-13Q49 3 40 17Q30 37 0 35Q-37 35-43 12Q-47-4-42-19Z", "furDark", true)],
    head: [head(28, 26)], details: [muzzle(14, 10, "accent", 8)],
    anchors: { headTop: [0, -44], earLeft: [-29, -30], earRight: [29, -30], brow: [0, -15] },
  }),
  owl: makeRig({
    fur: "#9d8e7c", furDark: "#807365", accent: "#f5ede0",
    limbs: "furDark", feet: "#c9a173", face: "custom", useNose: false, smile: false, cheeks: false,
    bodyDetails: [oval("body", 0, 58, 18, 22, "accent"), line("extra", "M-11 50q4 5 8 0m7 0q4 5 8 0m-16 9q4 5 8 0", "furDark", 1.55)],
    ears: [path("ears", "M-25-31L-20-49Q-18-54-14-49L-4-31ZM4-31L14-49Q18-54 20-49L25-31Z", "fur", true)],
    head: [circle("head", 0, -2, 33, "fur", true)],
    details: [...pair("face", 13, -6, 15, 15, "accent"), path("nose", "M-5-6Q0-9 5-6L1 2Q0 4-1 2Z", "#d8964e")],
    eyes: { x: 13, y: -6, rx: 5, ry: 5, glint: "#ffffff" },
    anchors: { headTop: [0, -35], earLeft: [-17, -40], earRight: [17, -40], brow: [0, -23] }, mouth: [0, 6],
  }),
  squirrel: makeRig({
    fur: "#cf7a43", furDark: "#ad633e", accent: "#fae8d3",
    back: [path("tail", "M12 77C26 65 41 59 39 40C28 36 28 18 35 10C46-3 63 5 66 18C72 40 65 62 48 75Q34 86 12 81Z", "furDark", true),
      path("tail", "M44 21Q57 9 61 21Q68 50 47 68Q52 54 50 43Q53 31 44 21Z", "fur")],
    ears: [path("ears", "M-28-54Q-25-49-12-36L-11-23L-22-20ZM11-23L12-36Q25-49 28-54L22-20Z", "fur", true)],
    head: [head(31, 29)], details: [muzzle(16, 12)],
    anchors: { earLeft: [-24, -38], earRight: [24, -38] },
  }),
  badger: makeRig({
    fur: "#585e56", furDark: "#383d36", accent: "#f0ede6", head: [circle("head", 0, -1, 32, "accent", true)],
    ears: [...pair("ears", 24, -22, 11, 11, "furDark", true), ...pair("ears", 24, -22, 5, 5, "fur")],
    details: [path("face", "M-19-24L-8-24L-6 15H-15ZM8-24L19-24L15 15H6Z", "furDark"), muzzle(13, 10)],
    eyes: { x: 12, y: -5, rx: 2.6, ry: 3, color: "cream" },
    anchors: { headTop: [0, -32] },
  }),
  deer: makeRig({
    fur: "#b88a5e", furDark: "#7e5d3c", accent: "#f5e1cb", head: [head(30, 28)],
    ears: [
      path("ears", "M-31-49Q-30-52-27-50L-22-46L-24-51Q-23-54-20-51L-12-30L-16-27L-21-41ZM12-30L20-51Q23-54 24-51L22-46L27-50Q30-52 31-49L21-41L16-27Z", "furDark", true),
      ...pair("ears", 26, -19, 8, 17, "fur", true, 40), ...pair("ears", 28, -20, 4.5, 10, "accent", false, 40),
    ],
    details: [muzzle(15, 12), ...pair("extra", 12, -14, 2.2, 2.5, "cream"), ...pair("extra", 18, -18, 2, 2, "cream")],
    anchors: { headTop: [0, -29], earLeft: [-28, -26], earRight: [28, -26] },
  }),
  mouse: makeRig({
    fur: "#d9cfc2", furDark: "#b3a493", accent: "#e3bfb8", head: [head(28, 26)],
    back: [path("tail", "M-22 68C-31 69-42 72-42 80C-42 85-35 89-24 85C-21 84-20 88-23 89C-33 94-45 92-47 82C-48 73-40 62-22 62Z", "furDark", true)],
    ears: [...pair("ears", 25, -22, 17, 17, "fur", true), ...pair("ears", 25, -22, 10, 10, "accent")],
    details: [line("face", "M-14 9l-12-3m12 7-11 2m25-5 12-3m-12 7 11 2", "furDark", 1.3)],
    anchors: { headTop: [0, -27], earLeft: [-30, -29], earRight: [30, -29] },
  }),
} as const;