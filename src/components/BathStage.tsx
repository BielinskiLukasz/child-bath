// Źródło: child-page@e7a19ac:js/kapiel.js (layout: wysokość pudełka clamp(min(H·0,96; W·0,96·84/64; 640), ≥160); spawn co 0,09 s).
// Zmiany: React, siatka pokrycia zamiast getImageData, jawny reducer faz, losowanie z ziarnem.
import { useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from "react";
import { SketchAnimal } from "../animals/SketchAnimal";
import { insideMask, silhouettePath, SKETCH_FURS } from "../animals/sketch";
import { createGrid, LH, LW, progress as gridProgress, resetGrid, stampSegment, type CoverageGrid } from "../bath/coverage";
import { layerKindFor } from "../bath/layers";
import { createPool, spawn, stepPool, type Particle } from "../bath/particles";
import { brushRadius, CLASSIC_STEPS, STEPS, toolDiameterCss } from "../bath/steps";
import { bathReducer, createBathState, currentStep, isTimed, phaseDuration, type BathPhase } from "../game";
import { useBathClock } from "../hooks/useBathClock";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useScrub, type PointerPhase } from "../hooks/useScrub";
import { createRng, MAX_SEED } from "../random";
import { readSessionParams } from "../settings/testParams";
import { TIMING } from "../timing";
import { LayerCanvas, type LayerHandle } from "./LayerCanvas";
import { Particles, type ParticlesHandle } from "./Particles";
import { ToolCursor } from "./ToolCursor";

const ASPECT = LW / LH; // 64 : 84
const BOX_MIN = 160;
const BOX_MAX = 640;

/**
 * Pudełko kąpieli (PHASE-02): zwierzątko-szkic, warstwa kroku, narzędzie pod palcem, bańki i krople.
 * Atrybuty data-phase, data-step, data-progress i data-animal służą testom (planning/phases/README.md).
 */
export function BathStage({ onPhaseChange }: { onPhaseChange?: (phase: BathPhase) => void }) {
  const params = useMemo(() => readSessionParams(), []);
  const rng = useMemo(() => createRng(params.seed), [params.seed]);
  const fxRng = useMemo(() => createRng(params.seed ^ 0x5bd1e995), [params.seed]);
  const [state, dispatch] = useReducer(bathReducer, undefined, () => createBathState(CLASSIC_STEPS, params.seed, params.ease));
  const reduced = useReducedMotion();

  // Rozmiar pudełka: wzór z kapiel, liczony z wymiarów sceny.
  const stageRef = useRef<HTMLDivElement>(null);
  const [boxH, setBoxH] = useState(0);
  useLayoutEffect(() => {
    const element = stageRef.current;
    if (!element) return;
    const update = () => {
      const rect = element.getBoundingClientRect();
      setBoxH(Math.round(Math.max(BOX_MIN, Math.min(rect.height * 0.96, (rect.width * 0.96) / ASPECT, BOX_MAX))));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const boxW = boxH * ASPECT;

  const animal = useMemo(() => {
    const animalRng = createRng(state.animalSeed);
    return { fur: animalRng.pick(SKETCH_FURS), layerSeed: animalRng.int(1, MAX_SEED) };
  }, [state.animalSeed]);
  const silhouette = useMemo(() => silhouettePath(), []);
  const gridRef = useRef<CoverageGrid | null>(null);
  if (!gridRef.current) gridRef.current = createGrid(insideMask());
  const poolRef = useRef<Particle[] | null>(null);
  if (!poolRef.current) poolRef.current = createPool();

  const stepKind = currentStep(state);
  const step = STEPS[stepKind];
  const radius = brushRadius(step, params.ease, boxW);
  const toolPx = toolDiameterCss(step, params.ease, boxW);

  // Najnowsze wartości dla wywołań zwrotnych z pętli i zdarzeń wskaźnika.
  const live = useRef({ state, radius, boxW, boxH, reduced });
  useLayoutEffect(() => {
    live.current = { state, radius, boxW, boxH, reduced };
  });

  const layerRef = useRef<LayerHandle>(null);
  const particlesRef = useRef<ParticlesHandle>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const showerRef = useRef<HTMLDivElement>(null);
  const pendingProgress = useRef<number | null>(null);
  const lastSpawn = useRef(0);

  // Zegar: postęp najwyżej raz na klatkę, czasy faz, cząsteczki.
  const tick = useCallback(
    (dt: number) => {
      const current = live.current.state;
      if (pendingProgress.current !== null) {
        dispatch({ type: "progress", value: pendingProgress.current });
        pendingProgress.current = null;
      }
      const timed = isTimed(current);
      if (timed) dispatch({ type: "tick", dt, pace: params.pace, reduced: live.current.reduced });
      const pool = poolRef.current!;
      const alive = stepPool(pool, dt);
      particlesRef.current?.render(pool);
      return timed || alive > 0;
    },
    [params.pace],
  );
  const wake = useBathClock(tick);

  // Nowy krok: świeża warstwa i czysta siatka, potem stage_in rusza.
  useEffect(() => {
    if (state.phase !== "stage_in" || state.layerReady) return;
    const layerRng = createRng((animal.layerSeed + state.stepIndex * 7919) % MAX_SEED);
    layerRef.current?.paint(layerKindFor(state.steps[state.stepIndex]), silhouette, layerRng);
    resetGrid(gridRef.current!);
    dispatch({ type: "layerReady" });
  }, [state.phase, state.layerReady, state.stepIndex, state.steps, animal.layerSeed, silhouette]);

  // Po nagrodzie: nowe zwierzątko-szkic z ziarnem z generatora sesji.
  useEffect(() => {
    if (state.phase === "done") {
      dispatch({ type: "newAnimal", steps: CLASSIC_STEPS, seed: rng.int(1, MAX_SEED), ease: params.ease });
    }
  }, [state.phase, rng, params.ease]);

  useEffect(() => {
    wake();
  }, [state.phase, state.layerReady, wake]);

  useEffect(() => {
    onPhaseChange?.(state.phase);
  }, [state.phase, onPhaseChange]);

  useScrub(boxRef, {
    onSegment(x0, y0, x1, y1) {
      const { state: current, radius: r } = live.current;
      if (current.phase !== "scrubbing") return;
      const grid = gridRef.current!;
      stampSegment(grid, x0, y0, x1, y1, r);
      layerRef.current?.erase(x0, y0, x1, y1, r);
      pendingProgress.current = gridProgress(grid);
      const kind = currentStep(current);
      const now = performance.now();
      if (kind !== "dry" && now - lastSpawn.current >= TIMING.particleGap * 1000) {
        lastSpawn.current = now;
        const jitterX = (fxRng.float() - 0.5) * 30;
        const jitterY = (fxRng.float() - 0.5) * 20;
        spawn(poolRef.current!, x1 + jitterX, y1 + jitterY, kind === "rinse" ? "drop" : "bubble", fxRng);
      }
      wake();
    },
    onPointer(x, y, phase: PointerPhase, active, pointerType) {
      const cursor = cursorRef.current;
      const shower = showerRef.current;
      if (!cursor || !shower) return;
      const { state: current, boxW: width, boxH: height } = live.current;
      const size = cursor.offsetWidth;
      const px = (x / LW) * width;
      const py = (y / LH) * height;
      const pressed = phase === "down" || phase === "move";
      if (pressed || phase === "hover") {
        cursor.style.transform = `translate(${(px - size / 2).toFixed(1)}px, ${(py - size / 2).toFixed(1)}px)`;
        cursor.dataset.visible = "true";
      }
      const showerOn = pressed && currentStep(current) === "rinse";
      if (showerOn) {
        shower.style.transform = `translateX(${(px - shower.offsetWidth / 2).toFixed(1)}px)`;
        shower.style.height = `${Math.max(0, py).toFixed(1)}px`;
        shower.dataset.visible = "true";
      }
      if ((phase === "up" && active === 0) || phase === "leave") {
        shower.dataset.visible = "false";
        if (pointerType !== "mouse" || phase === "leave") cursor.dataset.visible = "false";
      }
    },
  });

  // Krycie warstwy i zwierzątka liczone z fazy (tylko opacity).
  const inDuration = phaseDuration("stage_in", params.pace, reduced);
  let layerOpacity = 1;
  if (state.phase === "stage_in") layerOpacity = state.layerReady ? Math.min(1, state.phaseT / inDuration) : 0;
  else if (state.phase === "stage_rest") {
    const restDuration = phaseDuration("stage_rest", params.pace, reduced);
    layerOpacity = restDuration > 0 ? Math.max(0, 1 - state.phaseT / restDuration) : 0;
  } else if (state.phase === "reward" || state.phase === "done") layerOpacity = 0;

  let animalOpacity = 1;
  if (state.phase === "stage_in" && state.stepIndex === 0 && state.animalCount > 1) animalOpacity = layerOpacity;
  else if (state.phase === "reward") {
    const remaining = phaseDuration("reward", params.pace, reduced) - state.phaseT;
    animalOpacity = Math.min(1, Math.max(0, remaining / (TIMING.animalFade * params.pace)));
  } else if (state.phase === "done") animalOpacity = 0;

  return (
    <div
      ref={stageRef}
      className="bath-stage"
      data-phase={state.phase}
      data-step={stepKind}
      data-progress={state.progress.toFixed(2)}
      data-animal={`sketch-${state.animalCount}`}
    >
      <div
        ref={boxRef}
        className="bath-box"
        data-phase={state.phase}
        style={{ width: boxW, height: boxH }}
        role="img"
        aria-label="Zwierzątko do kąpieli"
      >
        <div className="bath-animal" style={{ opacity: animalOpacity }} data-reward={state.phase === "reward" ? "true" : undefined}>
          <SketchAnimal fur={animal.fur} />
        </div>
        <LayerCanvas ref={layerRef} opacity={layerOpacity} />
        <div ref={showerRef} className="bath-shower" data-visible="false" style={{ width: toolPx }} aria-hidden="true" />
        <Particles ref={particlesRef} />
        <ToolCursor ref={cursorRef} tool={stepKind} size={toolPx} />
      </div>
    </div>
  );
}
