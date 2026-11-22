// Źródło: child-page@e7a19ac:js/dogs.js (paleta, stojące uszy, ogon i jasna maska).
import { head, makeRig, oval, pair, path } from "../geometry/template";

export const husky = makeRig({
  fur: "#8f98aa", furDark: "#6f788c", accent: "#f6f4fa",
  back: [path("tail", "M17 68L17 63Q33 64 38 52Q41 44 37 41Q32 44 28 40Q26 36 29 33Q34 29 40 33C45 36 48 43 46 51C43 62 31 69 17 68Z", "furDark", true),
    path("tail", "M40 33Q34 29 29 33Q26 36 28 40Q32 44 37 41Q40 43 39 47Q44 43 43 37Z", "accent")],
  bodyDetails: [path("body", "M-12 33Q0 26 12 33Q22 55 0 72Q-22 55-12 33Z", "accent")],
  feet: "accent",
  ears: [path("ears", "M-32-16L-32-51Q-32-59-25-54L-4-30L-11-17ZM11-17L4-30L25-54Q32-59 32-51V-16Z", "furDark", true),
    path("ears", "M-27-29L-26-47L-13-30ZM13-30L26-47L27-29Z", "#cab2bc")],
  head: [head(33, 29)],
  details: [path("face", "M-31-2Q-24-19-15-17Q-7-17 0-4Q7-17 15-17Q24-19 31-2Q24 25 0 27Q-24 25-31-2Z", "accent"),
    ...pair("extra", 10, -14, 3.8, 2.1, "#aeb8c8"), oval("nose", 0, 8, 4.9, 3.4, "furDark")],
  eyes: { x: 12, y: -5, rx: 2.75, ry: 3.25, glint: "cream" }, useNose: false, cheeks: false,
  anchors: { headTop: [0, -30], earLeft: [-26, -36], earRight: [26, -36], brow: [0, -17], neck: [0, 30] },
});