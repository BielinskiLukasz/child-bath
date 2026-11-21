// Źródło: child-train@b881e09:src/components/illustration/Animal.tsx (sylwetki, twarze i FUR_COLORS).
// Źródło: child-page@e7a19ac:js/dogs.js (paleta Labradora).
import { head, line, makeRig, muzzle, oval, pair, path } from "../geometry/template";

export const familiar = {
  dachowiec: makeRig({
    fur: "#e2bc8d", furDark: "#bd8d62", accent: "#fcedda", head: [head(31, 28)],
    back: [path("tail", "M17 71Q40 72 48 56Q51 48 56 49Q63 50 59 60Q47 83 22 79Z", "furDark", true)],
    ears: [path("ears", "M-27-14L-26-41Q-26-46-22-43L-5-23ZM5-23L22-43Q26-46 26-41L27-14Z", "fur", true),
      path("ears", "M-23-18L-22-37L-8-24ZM8-24L22-37L23-18Z", "#deb09d")],
    details: [path("face", "M-15-25L-7-27L-5-15ZM-4-28L4-28L0-14ZM7-27L15-25L5-15Z", "furDark"),
      muzzle(15, 11, "accent", 10), line("face", "M-14 8h-15m15 5-13 2m41-7h15m-15 5 13 2", "line", 1.25)],
    cheeks: false, anchors: { headTop: [0, -29], earLeft: [-22, -29], earRight: [22, -29] },
  }),
  labrador: makeRig({
    fur: "#e8c27a", furDark: "#c9a05a", accent: "#f3dcab", head: [head(32, 29)],
    back: [path("tail", "M14 72C31 67 39 62 47 52Q51 47 57 49Q61 52 58 58C48 73 33 80 20 79Z", "furDark", true)],
    ears: pair("ears", 28, -8, 10, 22, "furDark", true, 15), details: [muzzle(17, 13, "accent", 12)],
    anchors: { headTop: [0, -30], earLeft: [-32, -17], earRight: [32, -17] },
  }),
  frog: makeRig({
    fur: "#8dae76", furDark: "#719160", accent: "#d9eabf", head: [oval("head", 0, -2, 34, 26, "fur", true)],
    ears: pair("ears", 16, -25, 14, 14, "fur", true),
    details: [muzzle(20, 12, "accent", 8), ...pair("face", 16, -25, 7, 7, "#f2f5de")],
    bodyDetails: [oval("body", 0, 58, 18, 20, "accent")],
    eyes: { x: 16, y: -25, rx: 2.8, ry: 2.8 },
    useNose: false, smile: "M-10 8Q0 18 10 8", mouth: [0, 12],
    anchors: { headTop: [0, -27], earLeft: [-20, -31], earRight: [20, -31], brow: [0, -14] },
  }),
  duck: makeRig({
    fur: "#efd489", furDark: "#e6c677", accent: "#fae7ab", head: [oval("head", 0, -2, 30, 28, "fur", true)],
    ears: [path("extra", "M-7-28Q-5-43 7-49Q6-39 1-28Z", "furDark", true)],
    limbs: "furDark", feet: "#e0a24e",
    bodyDetails: [oval("body", 0, 57, 18, 19, "accent")],
    face: "custom", useNose: false, smile: false,
    eyes: { x: 12, y: -6, rx: 3, ry: 3, glint: "#ffffff" },
    details: [path("nose", "M-15 8Q0 1 15 8Q12 20 0 20Q-12 20-15 8Z", "#e0a24e"), line("nose", "M-11 13Q0 15 11 13", "#c98c3f", 1.6)],
    anchors: { headTop: [0, -36], earLeft: [-22, -17], earRight: [22, -17] }, mouth: [0, 13],
  }),
  sheep: makeRig({
    fur: "#f2efe4", furDark: "#6b6259", accent: "#f7f4ea",
    ears: pair("ears", 27, -1, 10, 6, "furDark", true, 18), feet: "furDark", limbs: "#dad4c6",
    head: [path("head", "M-37-14Q-42-28-25-34Q-21-51-3-48Q12-58 26-47Q43-45 43-30Q50-19 42-8Q36 8 19 5Q4 16-12 7Q-30 8-36-5Q-44-7-37-14Z", "accent", true)],
    face: "custom", useNose: false, cheeks: false, smile: "M-6 12Q0 18 6 12",
    details: [oval("face", 0, 2, 21, 20, "furDark", true), path("extra", "M-16-14Q-10-24 0-20Q11-24 16-14Q6-9 0-13Q-8-10-16-14Z", "accent"),
      oval("nose", 0, 9, 4.8, 3.1, "#8d8175"), line("extra", "M-27-21q5-7 12-4m23-12q7-2 13 3", "#ded8c9", 1.8)],
    eyes: { x: 9, y: -2, rx: 2.8, ry: 2.8, color: "cream" },
    anchors: { headTop: [0, -49], earLeft: [-27, -4], earRight: [27, -4], brow: [0, -23] },
  }),
  pig: makeRig({
    fur: "#eec2c2", furDark: "#e2a9a9", accent: "#e5a8a8", head: [head(32, 29)],
    ears: [path("ears", "M-31-16Q-38-40-18-40Q-18-30-25-17ZM25-17Q18-30 18-40Q38-40 31-16Z", "furDark", true)],
    back: [path("tail", "M23 61Q37 56 38 48Q39 43 35 42Q31 41 30 45Q36 42 37 46Q39 50 34 53Q28 54 27 48Q26 37 36 37Q45 38 44 47Q45 59 28 65Z", "furDark", true)],
    useNose: false, smile: false,
    details: [muzzle(15, 11, "accent", 9), ...pair("nose", 5, 9, 2.6, 3.6, "#a86d6d")],
    anchors: { earLeft: [-26, -29], earRight: [26, -29] }, mouth: [0, 17],
  }),
  turtle: makeRig({
    fur: "#9fb27f", furDark: "#7d9465", accent: "#a9b98c", head: [head(30, 27)],
    back: [path("back", "M-39 54Q-37 18 0 19Q37 19 39 54Q36 71 1 72Q-31 71-39 54Z", "furDark", true)],
    bodyDetails: [path("extra", "M-34 52Q-33 26 0 24Q33 25 34 52Q18 67 0 66Q-18 67-34 52Z", "furDark", true),
      line("extra", "M-24 54Q-11 37 0 37Q11 37 24 54M0 32V59M-16 37l7 19m25-19-7 19", "#65794f", 2.1),
      path("extra", "M-31 53Q0 73 31 53L29 58Q0 77-29 58Z", "accent")],
    face: "custom", useNose: false, smile: "M-6 12Q0 17 6 12",
    eyes: { x: 11, y: -4, rx: 2.8, ry: 2.8, glint: "#ffffff" },
    anchors: { headTop: [0, -28], earLeft: [-22, -14], earRight: [22, -14], neck: [0, 29] },
  }),
} as const;