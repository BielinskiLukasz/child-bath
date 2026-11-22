// Źródło: child-page@e7a19ac:js/dogs.js (paleta, opadające uszy i siedem plam).
import { head, makeRig, muzzle, oval, pair, path } from "../geometry/template";

export const dalmatian = makeRig({
  fur: "#f8f5e8", furDark: "#4f4a66", accent: "#fffcf3",
  back: [path("tail", "M14 65C33 67 43 56 49 47Q53 42 58 45Q63 49 59 55Q47 77 19 76Z", "fur", true),
    path("tail", "M49 47Q53 42 58 45Q63 49 59 55L55 60Q54 55 45 54Z", "furDark")],
  body: [oval("body", 0, 28, 15, 13, "fur", true), oval("body", 0, 51, 23, 31, "fur", true)],
  bodyDetails: [oval("extra", -13, 39, 5.2, 6.8, "furDark", false, -14),
    oval("extra", 8, 46, 6, 5.1, "furDark", false, 18), oval("extra", -6, 61, 5.25, 4.7, "furDark"),
    oval("extra", 13, 66, 4.2, 5, "furDark", false, 24)],
  paws: pair("paws", 13, 76, 10, 8.2, "fur", true),
  ears: pair("ears", 27, -4, 10, 23, "furDark", true, 11), head: [head(28, 29)],
  details: [oval("extra", -16, -15, 7, 7.6, "furDark", false, 20),
    oval("extra", 5, -20, 4.5, 3.9, "furDark"), oval("extra", 21, 4, 4.6, 4.5, "furDark"), muzzle(15, 11)],
  eyes: { x: 11, y: -6, rx: 2.9, ry: 3.5, glint: "cream" }, cheeks: false,
  anchors: { headTop: [0, -30], earLeft: [-30, -12], earRight: [30, -12], brow: [0, -17], neck: [0, 30] },
});