import { line, makeRig, muzzle, oval, pair, path, waving } from "../geometry/template";

export const triceratops = makeRig({
  fur: "#d4a38c", furDark: "#b9836e", accent: "#dfbc70",
  back: [path("tail", "M17 65Q37 63 43 54Q47 49 51 52Q55 57 48 64Q37 76 19 75Z", "furDark", true)],
  body: [oval("body", 0, 51, 32, 32, "fur", true)],
  bodyDetails: [oval("body", 0, 57, 20, 17, "#e9bea5")],
  paws: pair("paws", 17, 77, 12, 7, "furDark", true),
  arms: [oval("arm", -29, 51, 8, 14, "fur", true, 24), waving(oval("arm", 31, 50, 8, 13, "fur", true, -22))],
  ears: [path("back", "M0-49Q12-55 21-46Q35-49 40-37Q53-35 50-20Q58-10 50 0Q48 20 31 29Q16 38 0 37Q-16 38-31 29Q-48 20-50 0Q-58-10-50-20Q-53-35-40-37Q-35-49-21-46Q-12-55 0-49Z", "accent", true),
    ...pair("extra", 39, -23, 4, 4.5, "#efd59a"), ...pair("extra", 25, -37, 4, 4, "#efd59a")],
  head: [oval("head", 0, -1, 33, 28, "fur", true)],
  details: [
    path("extra", "M-25-21Q-24-32-19-37Q-14-42-12-35Q-9-30-12-22Q-19-15-25-21ZM12-22Q9-30 12-35Q14-42 19-37Q24-32 25-21Q19-15 12-22Z", "cream"),
    muzzle(18, 10, "#e9bea5", 12), path("extra", "M-5 6Q-5-1-1-5Q4-7 6 1Q7 6 3 8Q-2 9-5 6Z", "cream"),
    line("nose", "M-9 10h1m16 0h1", "furDark", 2.4),
  ],
  eyes: { x: 12, y: -6, rx: 3, ry: 3.55, glint: "cream" }, useNose: false,
  smile: "M-7 15Q0 20 7 15", mouth: [0, 17],
  anchors: { headTop: [0, -45], earLeft: [-39, -16], earRight: [39, -16], brow: [0, -15], neck: [0, 34] },
  collar: { center: [0, 36], width: 1.1 },
});