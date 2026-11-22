import { line, makeRig, oval, pair, path } from "../geometry/template";

export const persian = makeRig({
  fur: "#e9dccb", furDark: "#cdb8a4", accent: "#f5eedb", coatProfile: "plush",
  back: [path("tail", "M18 66Q35 67 39 57Q36 52 42 46Q44 40 49 40Q55 37 61 45Q65 52 61 57Q62 64 54 67Q52 72 44 73Q33 80 19 77Z", "furDark", true)],
  body: [oval("body", 0, 28, 18, 13, "fur", true),
    path("body", "M-25 48Q-25 37-16 34Q-8 30 0 33Q11 30 19 37Q28 37 29 48Q35 55 30 64Q31 75 21 76Q19 84 8 82Q0 86-8 82Q-19 84-21 76Q-31 75-30 64Q-35 55-25 48Z", "fur", true)],
  bodyDetails: [oval("body", 0, 55, 17, 20, "accent")],
  ears: [path("ears", "M-33-20Q-35-37-31-42Q-28-45-23-40L-12-27ZM12-27L23-40Q28-45 31-42Q35-37 33-20Z", "furDark", true)],
  head: [path("head", "M-38-7Q-39-18-30-21Q-27-32-15-31Q-8-38 0-34Q9-38 16-31Q28-33 32-22Q41-19 39-8Q44 1 37 8Q40 18 29 22Q26 32 14 28Q5 34-1 30Q-7 34-15 29Q-28 31-31 22Q-40 19-37 9Q-44 2-38-7Z", "fur", true)],
  details: [...pair("face", 10, 11, 15, 11, "accent"), oval("nose", 0, 6, 4.5, 2.6, "#af7d70"),
    line("face", "M-19 11l-9-1m9 5-8 2m46-6 9-1m-9 5 8 2", "furDark", 1.45)],
  eyes: { x: 12, y: -4, rx: 3.35, ry: 3.65, glint: "cream" },
  cheeks: false, useNose: false, smile: "M-6 14Q-3 17 0 13Q3 17 6 14", mouth: [0, 14],
  anchors: { headTop: [0, -34], earLeft: [-26, -33], earRight: [26, -33], brow: [0, -20], neck: [0, 32] },
});