/**
 * Stałe czasowe w sekundach (planning/phases/README.md: jedno miejsce, zawsze mnożone przez tempo).
 * Wartości przejść pochodzą z aktywności „Kąpiel Zwierzątek” w child-page (IN_S, REST_S, BUBBLE_S, SPAWN_GAP_S).
 */
export const TIMING = {
  worldHourSeconds: 120,
  worldFps: 24,
  worldWeatherFade: 8,
  worldSeasonFade: 3,
  sceneryFade: 1.2,
  arriving: 0.8,
  toBench: 0.8,
  autoStroke: 1.2,
  /** Zatrzask wejścia nie zależy od ustawienia tempa. */
  inputCooldown: 0.6,
  invitationBreath: 5,
  previewBreath: 4.2,
  /** Pojawienie się warstwy kroku. */
  stageIn: 0.7,
  /** Zanik reszty warstwy po osiągnięciu progu (przy ograniczonym ruchu: natychmiast). */
  stageRest: 0.5,
  /** Zaślepka nagrody z Fazy 2 (pełna nagroda powstaje w Fazie 8). */
  reward: 2,
  /** Pojawienie się i zanik narzędzia po dotyku lub najechaniu. */
  toolFade: 0.5,
  minReaction: 1.2,
  /** Życie bańki lub kropli i łagodny początek/koniec (także przy tempie 0,8). */
  particleLife: 1.6,
  particleFade: 0.65,
  /** Najkrótszy odstęp między nowymi cząsteczkami. */
  particleGap: 0.09,
  /** Zasada spokoju, niezależnie od mnożnika tempa (poza trybem ograniczonego ruchu). */
  minFade: 0.5,
  /** Najdłuższy krok zegara (dłuższe przerwy nie przyspieszają zabawy). */
  maxDt: 0.05,
} as const;

/** Najwięcej baniek i kropli naraz (pula węzłów, jak w kapiel). */
export const MAX_PARTICLES = 28;

/** Czas zjawiska po uwzględnieniu tempa (1,45 = wolniej, 0,8 = szybciej). */
export function scaled(seconds: number, pace: number): number {
  return seconds * pace;
}

/** Tempo może skrócić animację, ale zwykłe przenikanie nie może trwać mniej niż pół sekundy. */
export function fadeDuration(seconds: number, pace: number): number {
  return Math.max(TIMING.minFade, scaled(seconds, pace));
}
