// Źródło: child-page@e7a19ac:js/kapiel.js (drawLayer i erase: warstwy przycięte do sylwetki, plamy z source-atop, zmywanie destination-out).
// Zmiany: kolory z palety child-train (krem zamiast bieli, ziemiste plamy), losowanie z ziarnem, kropka zamiast odcinka zerowej długości.
import type { Rng } from "../random";
import { LH, LW } from "./coverage";
import type { StepKind } from "./steps";

/** Warstwy robocze Fazy 2. Ślady zabawy (błotko, mech, pyłek…) dochodzą w Fazie 7. */
export type LayerKind = "dirt" | "foam" | "damp";

export function layerKindFor(step: StepKind): LayerKind {
  switch (step) {
    case "scrub":
      return "dirt";
    case "lather":
    case "rinse":
      return "foam";
    default:
      return "damp";
  }
}

function dot(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, fill: string): void {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

/** Maluje świeżą warstwę kroku w jednostkach logicznych (kontekst ma już skalę DPR). */
export function paintLayer(ctx: CanvasRenderingContext2D, kind: LayerKind, silhouette: Path2D, rng: Rng): void {
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.clearRect(0, 0, LW, LH);
  ctx.clip(silhouette);
  const point = () => [rng.float() * LW, rng.float() * LH] as const;

  if (kind === "dirt") {
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = "#b78268";
    ctx.fillRect(0, 0, LW, LH);
    ctx.globalAlpha = 1;
    for (let i = 0; i < 46; i++) {
      const [x, y] = point();
      dot(ctx, x, y, 6 + rng.float() * 20, rng.float() < 0.5 ? "rgba(156, 113, 85, 0.45)" : "rgba(212, 163, 140, 0.38)");
    }
  } else if (kind === "foam") {
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
    // Wilgoć: ciemniejszy odcień futra i kremowe kropelki.
    ctx.globalAlpha = 0.34;
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

/** Zmywa kapsułę wzdłuż odcinka; pojedynczy dotyk zmywa koło. */
export function eraseSegment(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, r: number): void {
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  if (Math.hypot(x1 - x0, y1 - y0) < 0.01) {
    dot(ctx, x1, y1, r, "#000");
  } else {
    ctx.strokeStyle = "#000";
    ctx.lineCap = "round";
    ctx.lineWidth = 2 * r;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  }
  ctx.restore();
}
