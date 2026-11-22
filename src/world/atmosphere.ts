// Źródło: child-train@b881e09:src/atmosphere.ts (palety nieba, pogody i pór roku, pozycje ciał niebieskich).
// Zmiany: niezależny zegar kąpieli i kontrast tekstu na papierze.
export const WEATHER_TYPES = ["clear", "rain", "snow", "fog"] as const;
export type Weather = (typeof WEATHER_TYPES)[number];
export type TimeOfDay = "dawn" | "day" | "dusk" | "night";
export const SEASONS = ["spring", "summer", "autumn", "winter"] as const;
export type Season = (typeof SEASONS)[number];
export const TIMES_OF_DAY = ["dawn", "day", "dusk", "night"] as const;
export type AtmosphereMode = "dynamic" | "override";
export type RGB = [number, number, number];
export type WeatherWeights = Record<Weather, number>;

export interface AtmosphereSample {
  hour: number;
  timeOfDay: TimeOfDay;
  weather: Weather;
  weights: WeatherWeights;
  mode: AtmosphereMode;
  skyTop: string;
  skyBottom: string;
  ink: string;
  paper: string;
  night: number;
  muted: string;
  accent: string;
  ground: string;
  window: string;
  cloud: string;
  cloudiness: number;
  sun: { x: number; y: number; opacity: number };
  moon: { x: number; y: number; opacity: number };
  /** Horizontal offset of the moon's shadow disc, in scene units. */
  moonPhaseShift: number;
  stars: number;
  rain: number;
  snow: number;
  fog: number;
  nightVeil: number;
  season: Season;

  /** Seasonal foliage/ground palette, already darkened for night. */
  foliage1: string;
  foliage2: string;
  pine1: string;
  pine2: string;
  hillFar: string;
  hillNear: string;
  blossom: string;
}

export const clamp = (value: number, min = 0, max = 1) =>
  Math.max(min, Math.min(max, value));
export const wrap = (value: number, length: number) =>
  ((value % length) + length) % length;
export const smoothstep = (low: number, high: number, value: number) => {
  const t = clamp((value - low) / (high - low));
  return t * t * (3 - 2 * t);
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

function rgb(hex: string): RGB {
  const clean = hex.replace("#", "");
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

export function mixColor(a: string, b: string, t: number): string {
  const from = rgb(a);
  const to = rgb(b);
  return `#${from
    .map((channel, i) =>
      Math.round(mix(channel, to[i], clamp(t)))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

const SKY_STOPS = [
  { hour: 0, top: "#27374f", bottom: "#495e7a", night: 1 },
  { hour: 4.5, top: "#293950", bottom: "#526580", night: 1 },
  { hour: 5.5, top: "#7e8099", bottom: "#c6b6c5", night: 0.65 },
  { hour: 6.5, top: "#d5bec2", bottom: "#eddbc0", night: 0.2 },
  { hour: 8, top: "#f5f1e7", bottom: "#edf0df", night: 0 },
  { hour: 12, top: "#faf7ed", bottom: "#eaf0e1", night: 0 },
  { hour: 17, top: "#f2e7d7", bottom: "#eadcbe", night: 0 },
  { hour: 18.5, top: "#dcb8b4", bottom: "#e9c2a7", night: 0.3 },
  { hour: 20, top: "#7a7997", bottom: "#b2a6bb", night: 0.8 },
  { hour: 21.5, top: "#30425a", bottom: "#52647f", night: 1 },
  { hour: 24, top: "#27374f", bottom: "#495e7a", night: 1 },
];

export function weatherWeights(weather: Weather): WeatherWeights {
  return { clear: 0, rain: 0, snow: 0, fog: 0, [weather]: 1 };
}

function dominantWeather(weights: WeatherWeights): Weather {
  return WEATHER_TYPES.reduce(
    (best, kind) => (weights[kind] > weights[best] ? kind : best),
    WEATHER_TYPES[0],
  );
}

export function timeOfDay(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 8) return "dawn";
  if (hour >= 8 && hour < 17.5) return "day";
  if (hour >= 17.5 && hour < 20.5) return "dusk";
  return "night";
}

function skyAt(hour: number) {
  const next = SKY_STOPS.findIndex((stop) => stop.hour > hour);
  const index = Math.max(0, next - 1);
  const before = SKY_STOPS[index];
  const after = SKY_STOPS[index + 1] ?? SKY_STOPS[SKY_STOPS.length - 1];
  const t = smoothstep(before.hour, after.hour, hour);
  return {
    top: mixColor(before.top, after.top, t),
    bottom: mixColor(before.bottom, after.bottom, t),
    night: mix(before.night, after.night, t),
  };
}

type SeasonPalette = {
  season: Season;
  foliage1: string;
  foliage2: string;
  pine1: string;
  pine2: string;
  hillFar: string;
  hillNear: string;
  blossom: string;
};

/**
 * The year as four palette stops, wrapped so winter melts back into spring.
 * Only the leafy landscapes read these; rock, water and snow keep their own
 * fixed palettes because seasons barely change them.
 */
const SEASON_STOPS: SeasonPalette[] = [
  {
    season: "spring",
    foliage1: "#a8c489",
    foliage2: "#c6d89c",
    pine1: "#86a98d",
    pine2: "#9dbca0",
    hillFar: "#e0e7c8",
    hillNear: "#cad9aa",
    blossom: "#f4cfd8",
  },
  {
    season: "summer",
    foliage1: "#8fa87a",
    foliage2: "#7f9c6c",
    pine1: "#6d9075",
    pine2: "#86a88b",
    hillFar: "#cdd8b2",
    hillNear: "#b4c99a",
    blossom: "#f2e6b0",
  },
  {
    season: "autumn",
    foliage1: "#c99a5e",
    foliage2: "#b8794a",
    pine1: "#7d9470",
    pine2: "#8fa37f",
    hillFar: "#ddcfae",
    hillNear: "#cbb894",
    blossom: "#e8b46a",
  },
  {
    season: "winter",
    foliage1: "#bcc7bd",
    foliage2: "#d0d8cf",
    pine1: "#7d948a",
    pine2: "#93a89e",
    hillFar: "#e0e5e5",
    hillNear: "#ccd6d6",
    blossom: "#eef2f0",
  },
];

const SEASON_KEYS: (keyof Omit<SeasonPalette, "season">)[] = [
  "foliage1",
  "foliage2",
  "pine1",
  "pine2",
  "hillFar",
  "hillNear",
  "blossom",
];

export type SeasonWeights = Record<Season, number>;

function seasonAt(season: Season, weights: SeasonWeights, night: number): SeasonPalette {
  const blended = { season } as SeasonPalette;
  for (const key of SEASON_KEYS) {
    const channels = [0, 0, 0];
    for (const stop of SEASON_STOPS) {
      rgb(stop[key]).forEach((channel, i) => { channels[i] += channel * weights[stop.season]; });
    }
    const color = `#${channels.map((channel) => Math.round(channel).toString(16).padStart(2, "0")).join("")}`;
    blended[key] = mixColor(color, "#3d5470", night * 0.55);
  }
  return blended;
}

function celestial(hour: number, rise: number, set: number) {
  const progress = clamp((hour - rise) / (set - rise));
  return {
    x: mix(180, 1420, progress),
    y: 355 - Math.sin(progress * Math.PI) * 235,
  };
}

export interface AtmosphereInput {
  hour: number;
  moonPhase: number;
  season: Season;
  weights: WeatherWeights;
  seasonWeights: SeasonWeights;
  mode: AtmosphereMode;
}

/** Palette stops and celestial motion come from the train; the clock supplies the bath's time. */
export function sampleAtmosphere(input: AtmosphereInput): AtmosphereSample {
  const { mode, weights } = input;
  const hour = wrap(input.hour, 24);
  const sky = skyAt(hour);
  const day = 1 - sky.night;
  const season = seasonAt(input.season, input.seasonWeights, sky.night);

  const cloudiness = clamp(
    weights.rain * 0.9 + weights.snow * 0.65 + weights.fog * 0.8,
  );
  const cloudMix =
    weights.rain * 0.24 + weights.snow * 0.07 + weights.fog * 0.18;
  const sunVisibility =
    smoothstep(5.25, 7, hour) * (1 - smoothstep(18.5, 20.5, hour));
  const sun = celestial(hour, 6, 18);
  const moon = celestial(wrap(hour - 18, 24), 0, 12);
  const moonVisibility = 1 - smoothstep(5, 7.5, hour) + smoothstep(18, 20, hour);

  return {
    hour,
    timeOfDay: timeOfDay(hour),
    weather: dominantWeather(weights),
    weights,
    mode,
    skyTop: mixColor(sky.top, "#b7c4ce", cloudMix * (0.7 + day * 0.3)),
    skyBottom: mixColor(sky.bottom, "#c6d0d2", cloudMix),
    // Warm and cool paper keep the controls readable even while the sky enters twilight.
    ink: sky.night > 0.52 ? "#25364c" : "#243b30",
    muted: sky.night > 0.52 ? "#40536a" : "#465c4d",
    accent: sky.night > 0.52 ? "#514364" : "#77503f",
    paper: mixColor("#f6f3e8", "#dfe8ec", sky.night),
    night: sky.night,
    ground: mixColor("#f6f3e8", "#465b78", sky.night),
    window: mixColor("#f7e8bb", "#ffd58f", sky.night),
    cloud: mixColor(
      mixColor("#fffcf3", "#b1c2cf", sky.night * 0.45),
      "#bcc9ce",
      cloudiness * 0.55,
    ),
    cloudiness,
    sun: { ...sun, opacity: sunVisibility },
    moon: { ...moon, opacity: clamp(moonVisibility) },
    // 0 = full moon, 0.5 = thinnest crescent, 1 = full again from the other side.
    moonPhaseShift: 78 * (1 - 2 * clamp(input.moonPhase)),
    stars: Math.pow(sky.night, 1.7) * (1 - cloudiness * 0.88),
    rain: Math.pow(weights.rain, 1.1) * 0.73,
    snow: Math.pow(weights.snow, 1.15) * 0.9,
    fog: weights.fog * 0.68 + weights.rain * 0.04 + weights.snow * 0.06,
    nightVeil: sky.night * 0.32 + cloudiness * 0.055,
    season: season.season,
    foliage1: season.foliage1,
    foliage2: season.foliage2,
    pine1: season.pine1,
    pine2: season.pine2,
    hillFar: season.hillFar,
    hillNear: season.hillNear,
    blossom: season.blossom,
  };
}
