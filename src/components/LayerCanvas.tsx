import { useImperativeHandle, useRef, useState, type Ref } from "react";
import { LH, LW } from "../bath/coverage";
import { paintLayer, paintStroke } from "../bath/layers";
import type { StepDef } from "../bath/steps";
import type { Rng } from "../random";

export interface LayerHandle {
  prepare(step: StepDef, silhouette: Path2D, rng: Rng): void;
  stroke(x0: number, y0: number, x1: number, y1: number, r: number): void;
}

/** Canvas ma stały bufor logiczny × DPR (≤ 2). Przy zmianie rozmiaru skaluje go tylko CSS. */
export function LayerCanvas({ ref, opacity }: { ref: Ref<LayerHandle>; opacity: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dpr] = useState(() => Math.min(2, Math.max(1, window.devicePixelRatio || 1)));

  useImperativeHandle(ref, () => {
    let ctx: CanvasRenderingContext2D | null = null;
    let current: { step: StepDef; silhouette: Path2D } | null = null;
    return {
      prepare(step, silhouette, rng) {
        ctx ??= canvasRef.current?.getContext("2d") ?? null;
        if (!ctx) return;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        paintLayer(ctx, step, silhouette, rng);
        current = { step, silhouette };
      },
      stroke(x0, y0, x1, y1, r) {
        if (ctx && current) paintStroke(ctx, current.step, current.silhouette, x0, y0, x1, y1, r);
      },
    };
  }, [dpr]);

  return (
    <canvas
      ref={canvasRef}
      className="bath-layer"
      width={Math.ceil(LW * dpr)}
      height={Math.ceil(LH * dpr)}
      style={{ opacity }}
      aria-hidden="true"
    />
  );
}
