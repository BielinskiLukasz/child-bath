// Źródło: child-train@b881e09:src/hooks/useAtmosphere.ts (kontrakt zmiennych CSS i limit 24 fps).
// Zmiany: czas aktywnej kąpieli, przenikanie scenerii i odczyt po wznowieniu bez skoku zegara.
import { useLayoutEffect, useRef, type RefObject } from "react";
import { sampleAtmosphere, smoothstep, type AtmosphereSample } from "../world/atmosphere";
import { worldAtmosphere, type WorldClock } from "../world/worldClock";
import { TIMING } from "../timing";

const formatted = (value: number) => value.toFixed(4);
const px = (value: number) => `${value.toFixed(2)}px`;

function variables(sample: AtmosphereSample, blend: number): Record<string, string> {
  return {
    "--sky-top": sample.skyTop, "--sky-bottom": sample.skyBottom, "--ink": sample.ink, "--muted": sample.muted,
    "--accent": sample.accent, "--world-paper": sample.paper, "--ground": sample.ground, "--window": sample.window,
    "--cloud": sample.cloud, "--cloud-opacity": formatted(1 - sample.weights.fog * 0.3),
    "--sun-opacity": formatted(sample.sun.opacity), "--sun-x": px(sample.sun.x), "--sun-y": px(sample.sun.y),
    "--moon-opacity": formatted(sample.moon.opacity), "--moon-x": px(sample.moon.x), "--moon-y": px(sample.moon.y),
    "--moon-phase-shift": px(sample.moonPhaseShift), "--stars-opacity": formatted(sample.stars),
    "--rain-opacity": formatted(sample.rain), "--snow-opacity": formatted(sample.snow), "--fog-opacity": formatted(sample.fog),
    "--night-veil": formatted(sample.nightVeil), "--night": formatted(sample.night), "--day-hour": formatted(sample.hour),
    "--foliage-a": sample.foliage1, "--foliage-b": sample.foliage2, "--pine-a": sample.pine1, "--pine-b": sample.pine2,
    "--hill-far": sample.hillFar, "--hill-near": sample.hillNear, "--blossom": sample.blossom,
    "--scenery-mix": formatted(blend),
  };
}

interface Driver {
  read(): WorldClock;
  advance(seconds: number, playing: boolean): WorldClock;
  fadeSeconds: number;
  round: number;
  playing: boolean;
  still: boolean;
}

export function useAtmosphere(root: RefObject<HTMLDivElement | null>, { read, advance, fadeSeconds, round, playing, still }: Driver) {
  const lastPaint = useRef(-Infinity);
  const written = useRef<Record<string, string>>({});
  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    let frame = 0;
    let previous = performance.now();
    let lastClock: WorldClock | undefined;
    const period = 1000 / TIMING.worldFps;
    const paint = (clock: WorldClock) => {
      if (clock === lastClock) return;
      lastClock = clock;
      const sample = sampleAtmosphere(worldAtmosphere(clock));
      const props = variables(sample, smoothstep(0, fadeSeconds, clock.roundSeconds));
      for (const [name, value] of Object.entries(props)) {
        if (written.current[name] !== value) element.style.setProperty(name, value);
      }
      written.current = props;
      const incoming = element.querySelector<HTMLDivElement>('.world-layer[data-blending="true"] [data-scene-role="current"]');
      if (incoming && incoming.style.opacity !== props["--scenery-mix"]) incoming.style.opacity = props["--scenery-mix"];
      for (const [key, value] of Object.entries({
        timeOfDay: sample.timeOfDay, weather: sample.weather, season: sample.season, atmosphereMode: sample.mode,
        rainActive: String(sample.rain > 0), snowActive: String(sample.snow > 0),
        fogActive: String(sample.fog > 0), starsActive: String(sample.stars > 0),
      })) if (element.dataset[key] !== value) element.dataset[key] = value;
    };
    const active = () => !(document.hidden || still) && (playing && !read().overrides.time || read().roundSeconds < TIMING.worldWeatherFade);

    const tick = (now: number) => {
      if (document.hidden) return;
      if (now - lastPaint.current >= period) {
        paint(advance(still ? 0 : (now - previous) / 1000, playing));
        previous = now;
        lastPaint.current = now;
      }
      if (active() || lastClock !== read()) frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      const now = performance.now();
      previous = now;
      if (!document.hidden && now - lastPaint.current >= period) {
        paint(read());
        lastPaint.current = now;
      }
      if (!document.hidden && (active() || lastClock !== read())) frame = requestAnimationFrame(tick);
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => { cancelAnimationFrame(frame); document.removeEventListener("visibilitychange", sync); };
  }, [root, read, advance, fadeSeconds, round, playing, still]);
}