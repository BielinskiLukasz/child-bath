import { createRng } from "../random";
import { TIMING } from "../timing";
import { SEASONS, WEATHER_TYPES, smoothstep, weatherWeights, wrap, type AtmosphereInput, type Season, type SeasonWeights, type TimeOfDay, type Weather, type WeatherWeights } from "./atmosphere";

export interface WorldOverrides {
  hour?: number;
  time?: TimeOfDay;
  season?: Season;
  weather?: Weather;
}

export interface WorldClock {
  readonly overrides: WorldOverrides;
  readonly hour: number;
  readonly moonPhase: number;
  readonly round: number;
  readonly roundSeconds: number;
  readonly season: Season;
  readonly weather: Weather;
  readonly fromSeason: SeasonWeights;
  readonly fromWeather: WeatherWeights;
}

const FIXED_HOURS: Record<TimeOfDay, number> = { dawn: 6, day: 12, dusk: 19, night: 1 };
const seasonWeights = (season: Season): SeasonWeights => ({ spring: 0, summer: 0, autumn: 0, winter: 0, [season]: 1 });

export function createWorldClock(seed: number, overrides: WorldOverrides = {}): WorldClock {
  const rng = createRng(seed ^ 0x8a6efd17);
  const startHour = rng.float() * 24;
  const startWeather = rng.pick(WEATHER_TYPES);
  const moonPhase = rng.float();
  const startSeason = rng.pick(SEASONS);
  const weather = overrides.weather ?? startWeather;
  const season = overrides.season ?? startSeason;
  return {
    overrides, hour: overrides.time ? FIXED_HOURS[overrides.time] : wrap(overrides.hour ?? startHour, 24),
    moonPhase, season, weather, round: 1, roundSeconds: TIMING.worldWeatherFade,
    fromSeason: seasonWeights(season), fromWeather: weatherWeights(weather),
  };
}

function transition<K extends string>(keys: readonly K[], from: Record<K, number>, to: K, elapsed: number, duration: number): Record<K, number> {
  const t = smoothstep(0, duration, elapsed);
  const result = { ...from };
  for (const key of keys) result[key] = from[key] * (1 - t) + (key === to ? t : 0);
  return result;
}

export function worldAtmosphere(clock: WorldClock): AtmosphereInput {
  return {
    hour: clock.hour, moonPhase: clock.moonPhase, season: clock.season,
    weights: clock.overrides.weather ? weatherWeights(clock.weather) : transition(WEATHER_TYPES, clock.fromWeather, clock.weather, clock.roundSeconds, TIMING.worldWeatherFade),
    seasonWeights: clock.overrides.season ? seasonWeights(clock.season) : transition(SEASONS, clock.fromSeason, clock.season, clock.roundSeconds, TIMING.worldSeasonFade),
    mode: clock.overrides.time || clock.overrides.weather || clock.overrides.season ? "override" : "dynamic",
  };
}

export function advanceWorldClock(clock: WorldClock, seconds: number, playing: boolean, visible: boolean): WorldClock {
  if (!visible || !(seconds > 0) || !Number.isFinite(seconds)) return clock;
  const hour = playing && !clock.overrides.time ? wrap(clock.hour + seconds / TIMING.worldHourSeconds, 24) : clock.hour;
  const roundSeconds = Math.min(TIMING.worldWeatherFade, clock.roundSeconds + seconds);
  return hour === clock.hour && roundSeconds === clock.roundSeconds ? clock : { ...clock, hour, roundSeconds };
}

export function nextWorldRound(clock: WorldClock): WorldClock {
  // A partially blended frame is a valid starting point for another round.
  const visible = worldAtmosphere(clock);
  return {
    ...clock, round: clock.round + 1, roundSeconds: 0,
    season: clock.overrides.season ?? SEASONS[(SEASONS.indexOf(clock.season) + 1) % SEASONS.length],
    weather: clock.overrides.weather ?? WEATHER_TYPES[(WEATHER_TYPES.indexOf(clock.weather) + 1) % WEATHER_TYPES.length],
    fromSeason: visible.seasonWeights, fromWeather: visible.weights,
  };
}