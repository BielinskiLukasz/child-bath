/**
 * Stałe czasowe w sekundach (planning/phases/README.md: jedno miejsce, zawsze mnożone przez tempo).
 * Wartości przejść pochodzą z aktywności „Kąpiel Zwierzątek” w child-page (IN_S, REST_S, BUBBLE_S, SPAWN_GAP_S).
 */
export const TIMING = {
  /** Pojawienie się warstwy kroku. */
  stageIn: 0.7,
  /** Zanik reszty warstwy po osiągnięciu progu (przy ograniczonym ruchu: natychmiast). */
  stageRest: 0.5,
  /** Zaślepka nagrody z Fazy 2 (pełna nagroda powstaje w Fazie 8). */
  reward: 2,
  /** Zanik zwierzątka na końcu nagrody i jego pojawienie się na początku kąpieli. */
  animalFade: 0.7,
  /** Pojawienie się i zanik narzędzia po dotyku lub najechaniu. */
  toolFade: 0.5,
  rewardBreath: 2.4,
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
