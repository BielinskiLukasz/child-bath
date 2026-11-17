// Źródło: child-page@e7a19ac:js/kapiel.js (szerokości pędzla BRUSH = [0.11, 0.2, 0.17], min. 44 px CSS, próg 0.9).
// Zmiany: pięć kroków rytuału (PROJECT.md 7.2), tryb zmywania lub nakładania, łatwość mycia (D-19).
import { LW } from "./coverage";

export type StepKind = "scrub" | "lather" | "rinse" | "dry" | "groom";
export type StepMode = "erase" | "apply";

export interface StepDef {
  kind: StepKind;
  /** Zmywanie usuwa warstwę, nakładanie ją maluje; oba mierzy ta sama siatka pokrycia. */
  mode: StepMode;
  /** Średnica narzędzia jako ułamek szerokości pudełka zwierzątka. */
  brushFrac: number;
}

export const STEPS: Record<StepKind, StepDef> = {
  scrub: { kind: "scrub", mode: "erase", brushFrac: 0.11 },
  lather: { kind: "lather", mode: "apply", brushFrac: 0.14 },
  rinse: { kind: "rinse", mode: "erase", brushFrac: 0.2 },
  dry: { kind: "dry", mode: "erase", brushFrac: 0.17 },
  groom: { kind: "groom", mode: "apply", brushFrac: 0.12 },
};

export type EaseKey = "easy" | "normal" | "precise";

/** Łatwość mycia: mnożnik szerokości narzędzia i próg automatycznego domknięcia kroku. */
export const EASE: Record<EaseKey, { brush: number; threshold: number }> = {
  easy: { brush: 1.3, threshold: 0.8 },
  normal: { brush: 1, threshold: 0.9 },
  precise: { brush: 0.85, threshold: 0.95 },
};

/** Narzędzie nigdy nie jest węższe niż 44 px CSS (cel dotyku dla małego palca). */
export const MIN_TOOL_CSS = 44;

/** Roboczy rytuał klasyczny z Fazy 2: brud → piana do spłukania → wilgoć (jak w kapiel). */
export const CLASSIC_STEPS: readonly StepKind[] = ["scrub", "rinse", "dry"];

export function isEaseKey(value: unknown): value is EaseKey {
  return value === "easy" || value === "normal" || value === "precise";
}

/** Średnica narzędzia w pikselach CSS. */
export function toolDiameterCss(step: StepDef, ease: EaseKey, boxWidthCss: number): number {
  return Math.max(MIN_TOOL_CSS, boxWidthCss * step.brushFrac * EASE[ease].brush);
}

/** Promień narzędzia w jednostkach logicznych (256 = szerokość pudełka). */
export function brushRadius(step: StepDef, ease: EaseKey, boxWidthCss: number): number {
  if (!(boxWidthCss > 0)) return 0;
  return (toolDiameterCss(step, ease, boxWidthCss) / 2 / boxWidthCss) * LW;
}
