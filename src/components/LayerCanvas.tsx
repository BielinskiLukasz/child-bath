import { useImperativeHandle, useRef, useState, type Ref } from "react";
import { LH, LW } from "../bath/coverage";
import { eraseSegment, paintLayer, type LayerKind } from "../bath/layers";
import type { Rng } from "../random";

export interface LayerHandle {
  paint(kind: LayerKind, silhouette: Path2D, rng: Rng): void;
  erase(x0: number, y0: number, x1: number, y1: number, r: number): void;
}

/**
 * Warstwa kroku w canvasie 2D (PROJECT.md, A2). Rozmiar wewnętrzny to przestrzeń logiczna × DPR (≤ 2),
 * a CSS tylko skaluje obraz, więc obrót ekranu i zmiana rozmiaru nie gubią treści.
 */
export function LayerCanvas({ ref, opacity }: { ref: Ref<LayerHandle>; opacity: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dpr] = useState(() => Math.min(2, Math.max(1, window.devicePixelRatio || 1)));

  useImperativeHandle(
    ref,
    () => {
      const context = () => {
        const ctx = canvasRef.current?.getContext("2d");
        ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
        return ctx ?? null;
      };
      return {
        paint(kind: LayerKind, silhouette: Path2D, rng: Rng) {
          const ctx = context();
          if (ctx) paintLayer(ctx, kind, silhouette, rng);
        },
        erase(x0: number, y0: number, x1: number, y1: number, r: number) {
          const ctx = context();
          if (ctx) eraseSegment(ctx, x0, y0, x1, y1, r);
        },
      };
    },
    [dpr],
  );

  return (
    <canvas
      ref={canvasRef}
      className="bath-layer"
      width={LW * dpr}
      height={LH * dpr}
      style={{ opacity }}
      aria-hidden="true"
    />
  );
}
