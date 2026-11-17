// Źródło: child-page@e7a19ac:js/kapiel.js (rozmiar pudełka: współczynnik 0,96, granice 160–640 px; cząsteczki co 0,09 s).
// Zmiany: React, logiczna siatka pokrycia, jawny reducer, losowanie z ziarnem i narzędzie dla każdego dotyku.
import { useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState, type CSSProperties } from "react";
import { SketchAnimal } from "../animals/SketchAnimal";
import { insideMask, silhouettePath, SKETCH_FURS } from "../animals/sketch";
import { createGrid, LH, LW, progress as gridProgress, resetGrid, stampSegment, type CoverageGrid } from "../bath/coverage";
import { createPool, spawn, stepPool, type Particle } from "../bath/particles";
import { brushRadius, STEPS } from "../bath/steps";
import { bathReducer, createBathState, currentStep, isTimed, phaseDuration, type BathPhase } from "../game";
import { useBathClock } from "../hooks/useBathClock";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useScrub } from "../hooks/useScrub";
import { createRng, MAX_SEED } from "../random";
import { readSessionParams } from "../settings/testParams";
import { fadeDuration, scaled, TIMING } from "../timing";
import { LayerCanvas, type LayerHandle } from "./LayerCanvas";
import { Particles, type ParticlesHandle } from "./Particles";
import { ToolCursor, type ToolCursorHandle } from "./ToolCursor";

const ASPECT = LW / LH;
const BOX_MIN = 160;
const BOX_MAX = 640;

export function BathStage({ onPhaseChange }: { onPhaseChange?: (phase: BathPhase) => void }) {
  const [params] = useState(readSessionParams);
  const rng = useMemo(() => createRng(params.seed), [params.seed]);
  const fxRng = useMemo(() => createRng(params.seed ^ 0x5bd1e995), [params.seed]);
  const [state, dispatch] = useReducer(bathReducer, undefined, () => createBathState(params.steps, params.seed, params.ease));
  const reduced = useReducedMotion();

  const stageRef = useRef<HTMLDivElement>(null);
  const [boxH, setBoxH] = useState(0);
  useLayoutEffect(() => {
    const element = stageRef.current;
    if (!element) return;
    const update = () => {
      const rect = element.getBoundingClientRect();
      const available = Math.min(rect.height, rect.width / ASPECT);
      const preferred = Math.max(BOX_MIN, Math.min(available * 0.96, BOX_MAX));
      setBoxH(Math.min(Math.round(preferred), Math.floor(available)));
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
  const radius = brushRadius(STEPS[stepKind], params.ease, boxW);
  const live = useRef({ state, radius, reduced });
  useLayoutEffect(() => {
    live.current = { state, radius, reduced };
  });

  const layerRef = useRef<LayerHandle>(null);
  const particlesRef = useRef<ParticlesHandle>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<ToolCursorHandle>(null);
  const pendingProgress = useRef<number | null>(null);
  const lastSpawn = useRef(-Infinity);
  const spawnGapMs = scaled(TIMING.particleGap, params.pace) * 1000;

  // Próbki wskaźnika nie renderują widoku. Reducer dostaje co najwyżej jedną zmianę postępu na klatkę.
  const tick = useCallback((dt: number) => {
    const current = live.current.state;
    if (pendingProgress.current !== null) {
      dispatch({ type: "progress", value: pendingProgress.current });
      pendingProgress.current = null;
    }
    const timed = isTimed(current);
    if (timed) dispatch({ type: "tick", dt, pace: params.pace, reduced: live.current.reduced });
    const pool = poolRef.current!;
    const alive = stepPool(pool, dt / params.pace);
    particlesRef.current?.render(pool);
    return timed || alive > 0;
  }, [params.pace]);
  const wake = useBathClock(tick);

  useEffect(() => {
    if (state.phase !== "stage_in" || state.layerReady) return;
    const layerRng = createRng((animal.layerSeed + state.stepIndex * 7919) % MAX_SEED);
    layerRef.current?.prepare(STEPS[state.steps[state.stepIndex]], silhouette, layerRng);
    resetGrid(gridRef.current!);
    pendingProgress.current = null;
    dispatch({ type: "layerReady" });
  }, [state.phase, state.layerReady, state.stepIndex, state.steps, animal.layerSeed, silhouette]);

  useEffect(() => {
    if (state.phase === "done") {
      dispatch({ type: "newAnimal", steps: params.steps, seed: rng.int(1, MAX_SEED), ease: params.ease });
    }
  }, [state.phase, rng, params]);

  useEffect(() => {
    wake();
  }, [state.phase, state.layerReady, wake]);

  useEffect(() => {
    onPhaseChange?.(state.phase);
  }, [state.phase, onPhaseChange]);

  useEffect(() => {
    const syncVisibility = () => {
      boxRef.current?.setAttribute("data-paused", String(document.hidden));
    };
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => document.removeEventListener("visibilitychange", syncVisibility);
  }, []);

  useScrub(boxRef, {
    onSegment(x0, y0, x1, y1) {
      const { state: current, radius: r } = live.current;
      if (current.phase !== "scrubbing") return;
      const grid = gridRef.current!;
      const changed = stampSegment(grid, x0, y0, x1, y1, r) > 0;
      layerRef.current?.stroke(x0, y0, x1, y1, r);
      if (changed) pendingProgress.current = gridProgress(grid);
      const kind = currentStep(current);
      const now = performance.now();
      const inBox = x1 >= 0 && x1 <= LW && y1 >= 0 && y1 <= LH;
      let spawned = false;
      if (inBox && (kind === "scrub" || kind === "rinse" || kind === "lather") && now - lastSpawn.current >= spawnGapMs) {
        lastSpawn.current = now;
        const jitterX = (fxRng.float() - 0.5) * 30;
        const jitterY = (fxRng.float() - 0.5) * 20;
        spawned = spawn(poolRef.current!, x1 + jitterX, y1 + jitterY, kind === "rinse" ? "drop" : "bubble", fxRng);
      }
      if (changed || spawned) wake();
    },
    onPointer(id, x, y, pressed) { toolsRef.current?.move(id, x, y, pressed); },
    onPointerEnd(id) { toolsRef.current?.end(id); },
    onReset() { toolsRef.current?.reset(); },
  });

  const inDuration = phaseDuration("stage_in", params.pace, reduced);
  let layerOpacity = 1;
  if (state.phase === "stage_in") layerOpacity = state.layerReady ? Math.min(1, state.phaseT / inDuration) : 0;
  else if (state.phase === "stage_rest") {
    const restDuration = phaseDuration("stage_rest", params.pace, reduced);
    layerOpacity = restDuration > 0 ? Math.max(0, 1 - state.phaseT / restDuration) : 0;
  } else if (state.phase === "reward" || state.phase === "done") layerOpacity = 0;

  let animalOpacity = 1;
  if (state.phase === "stage_in" && state.stepIndex === 0) animalOpacity = layerOpacity;
  else if (state.phase === "reward") {
    const remaining = phaseDuration("reward", params.pace, reduced) - state.phaseT;
    animalOpacity = Math.min(1, Math.max(0, remaining / fadeDuration(TIMING.animalFade, params.pace)));
  } else if (state.phase === "done") animalOpacity = 0;

  const boxStyle = {
    width: boxW, height: boxH,
    "--bath-tool-fade": `${fadeDuration(TIMING.toolFade, params.pace)}s`,
    "--bath-breath": `${scaled(TIMING.rewardBreath, params.pace)}s`,
  } as CSSProperties;

  return (
    <div ref={stageRef} className="bath-stage" data-phase={state.phase} data-step={stepKind}
      data-progress={state.progress.toFixed(2)} data-animal={`sketch-${state.animalCount}`}>
      <div ref={boxRef} className="bath-box" data-phase={state.phase} style={boxStyle} role="img" aria-label="Zwierzątko do kąpieli">
        <div className="bath-animal" style={{ opacity: animalOpacity }} data-reward={state.phase === "reward" ? "true" : undefined}>
          <SketchAnimal fur={animal.fur} />
        </div>
        <LayerCanvas ref={layerRef} opacity={layerOpacity} />
        <Particles ref={particlesRef} />
        <ToolCursor ref={toolsRef} tool={stepKind} radius={radius} />
      </div>
    </div>
  );
}
