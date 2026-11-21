// Źródło: child-page@e7a19ac:js/kapiel.js (drawLayer i erase: warstwy przycięte do sylwetki, zmywanie destination-out).
// Zmiany: paleta child-train, wzory z ziarnem, wspólna kapsuła zmywania i nakładania.
import type { Rng } from "../random";
import { LH, LW } from "./coverage";
import type { StepDef, StepKind } from "./steps";

/** Warstwy robocze Fazy 2. Właściwe ślady zabawy, namydlanie i czesanie dochodzą w Fazie 7. */
export type LayerKind = "dirt" | "foam" | "damp";

export function layerKindFor(step: StepKind): LayerKind {
  if (step === "scrub") return "dirt";
  if (step === "lather" || step === "rinse") return "foam";
  return "damp";
}

function dot(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, fill: string): void {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

/** Przygotowuje roboczą warstwę kroku. Przy nakładaniu jej cały obszar jest na początku pusty. */
export function paintLayer(ctx: CanvasRenderingContext2D, step: StepDef, silhouette: Path2D, rng: Rng): void {
  ctx.clearRect(0, 0, LW, LH);
  if (step.mode === "apply") return;

  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.clip(silhouette);
  const kind = layerKindFor(step.kind);
  const point = () => [rng.float() * LW, rng.float() * LH] as const;

  if (kind === "dirt") {
    // Keep the species' markings readable beneath the bath layer.
    ctx.globalAlpha = 0.53;
    ctx.fillStyle = "#b78268";
    ctx.fillRect(0, 0, LW, LH);
    ctx.globalAlpha = 1;
    for (let i = 0; i < 46; i++) {
      const [x, y] = point();
      dot(ctx, x, y, 6 + rng.float() * 20, rng.float() < 0.5 ? "rgba(156, 113, 85, 0.45)" : "rgba(212, 163, 140, 0.38)");
    }
  } else if (kind === "foam") {
    ctx.globalAlpha = 0.66;
    ctx.fillStyle = "#f8f5e8";
    ctx.fillRect(0, 0, LW, LH);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "rgba(192, 212, 207, 0.75)";
    for (let i = 0; i < 46; i++) {
      const [x, y] = point();
      const r = 5 + rng.float() * 14;
      dot(ctx, x, y, r, "#fffcf3");
      ctx.stroke();
      if (rng.float() < 0.35) dot(ctx, x - r * 0.35, y - r * 0.35, 1.2, "#ffffff");
    }
  } else {
    ctx.globalAlpha = 0.23;
    ctx.fillStyle = "#4e6754";
    ctx.fillRect(0, 0, LW, LH);
    ctx.globalAlpha = 1;
    for (let i = 0; i < 70; i++) {
      const [x, y] = point();
      dot(ctx, x, y, 2 + rng.float() * 4, "rgba(255, 252, 243, 0.85)");
    }
  }
  ctx.restore();
}

/** Rysuje tę samą kapsułę, którą stampSegment liczy w siatce. Nie odczytuje obrazu. */
export function paintStroke(
  ctx: CanvasRenderingContext2D, step: StepDef, silhouette: Path2D,
  x0: number, y0: number, x1: number, y1: number, r: number,
): void {
  if (!(r > 0)) return;
  const apply = step.mode === "apply";
  const fill = apply ? (step.kind === "groom" ? "#f5eedb" : "#fffcf3") : "#000";
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = apply ? "source-over" : "destination-out";
  if (apply) ctx.clip(silhouette); // Zmywanie usuwa wyłącznie istniejące, już przycięte piksele.

  if (x0 === x1 && y0 === y1) {
    dot(ctx, x1, y1, r, fill);
  } else {
    ctx.strokeStyle = fill;
    ctx.lineCap = "round";
    ctx.lineWidth = 2 * r;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  }
  ctx.restore();
}
