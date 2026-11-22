// Źródło: child-page@e7a19ac:js/kapiel.js (rozmiar pudełka i odstęp między cząsteczkami).
// Zmiany: React, logiczna siatka i wspólna ścieżka stemplowania dla wszystkich rodzajów wejścia.
import {
  useCallback, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState,
  type CSSProperties, type ComponentType, type Dispatch, type Ref,
} from "react";
import { insideMask, silhouettePath } from "../animals/mask";
import { isFaceReaction, rewardReaction, type ReactionRun } from "../animals/reactions";
import { AnimalSvg, HangingScarf } from "../animals/render";
import { pickAnimal } from "../animals/roster";
import { animalBathState } from "../animals/states";
import type { AnimalDef } from "../animals/types";
import { autoBrushRadius, planAutoStrokes, strokePoint, type Stroke } from "../bath/autoStroke";
import { createGrid, LH, LW, progress as gridProgress, resetGrid, stampSegment } from "../bath/coverage";
import { createPool, REDUCED_PARTICLE_LIMIT, spawn, stepPool, type Particle } from "../bath/particles";
import { brushRadius, STEPS } from "../bath/steps";
import { bathBoxLabel } from "../copy/announce";
import { currentStep, isTimed, phaseDuration, type BathAction, type BathState } from "../game";
import { useBathClock } from "../hooks/useBathClock";
import { useScrub } from "../hooks/useScrub";
import { moveBrush, START_BRUSH, zigzag, type ArrowKey } from "../input/keyboardBrush";
import type { InputLatch } from "../input/latch";
import { createRng, MAX_SEED } from "../random";
import type { SessionParams } from "../settings/testParams";
import { fadeDuration, scaled, TIMING } from "../timing";
import type { DoorPreview } from "./DoorPreview";
import { LayerCanvas, type LayerHandle } from "./LayerCanvas";
import { Particles, type ParticlesHandle } from "./Particles";
import { ToolCursor, type ToolCursorHandle } from "./ToolCursor";

const ASPECT = LW / LH;
const BOX_MIN = 160, BOX_MAX = 640;
const KEY_TOOL = -1, AUTO_TOOL = -2;
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
const smooth = (t: number) => t * t * (3 - 2 * t);

type Segment = (x0: number, y0: number, x1: number, y1: number) => boolean;
type AutoMove = { stroke: Stroke; elapsed: number; x: number; y: number };

export interface BathStageHandle {
  hasFocus(): boolean;
  keyboardStroke(key: ArrowKey | "zigzag"): void;
  startAutoStroke(): void;
}

interface Props {
  ref: Ref<BathStageHandle>;
  session: SessionParams;
  state: BathState;
  animal: AnimalDef;
  dispatch: Dispatch<BathAction>;
  latch: InputLatch;
  reduced: boolean;
  onAutoBusy(busy: boolean): void;
  Preview: ComponentType<React.ComponentProps<typeof DoorPreview>>;
}

export function BathStage({ ref, session, state, animal, dispatch, latch, reduced, onAutoBusy, Preview }: Props) {
  const { pace, ease, oneButton, seed, allowedAnimals } = session;
  const particleLimit = reduced ? REDUCED_PARTICLE_LIMIT : undefined;
  const fxRng = useMemo(() => createRng(seed ^ 0x5bd1e995), [seed]);
  const nextSeed = useMemo(() => createRng(state.animalSeed ^ 0x6d2b79f5).int(1, MAX_SEED), [state.animalSeed]);
  const nextAnimal = useMemo(() => pickAnimal(nextSeed, animal.id, allowedAnimals), [nextSeed, animal.id, allowedAnimals]);
  const stageRef = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    const element = stageRef.current;
    if (!element) return;
    const update = () => {
      const { width, height } = element.getBoundingClientRect();
      setScene((previous) => previous.width === width && previous.height === height ? previous : { width, height });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Rezerwujemy małą wnękę z lewej strony; środek nadal mieści właściwe pudełko.
  const margin = Math.min(18, scene.width * 0.038);
  const doorWidth = Math.min(126, scene.width * 0.27, scene.height * 0.34);
  const doorHeight = doorWidth * 1.36;
  const door = { x: margin, y: Math.max(0, scene.height - doorHeight - 10), width: doorWidth, height: doorHeight };
  const leftSpace = Math.max(0, scene.width - doorWidth - margin * 2 - 6);
  const available = Math.min(scene.height, leftSpace / ASPECT);
  const preferred = Math.max(BOX_MIN, Math.min(available * 0.96, BOX_MAX));
  const boxH = Math.max(0, Math.min(Math.round(preferred), Math.floor(available)));
  const boxW = boxH * ASPECT;
  const boxLeft = Math.max((scene.width - boxW) / 2, door.x + door.width + 4);
  const boxTop = (scene.height - boxH) / 2;
  const previewW = door.width * 0.89;
  const previewH = previewW / ASPECT;
  const previewX = door.x + (door.width - previewW) / 2;
  const previewY = door.y + door.height * 0.91 - previewH;

  const layerSeed = useMemo(() => createRng(state.animalSeed ^ 0x37f811e9).int(1, MAX_SEED), [state.animalSeed]);
  const silhouette = useMemo(() => silhouettePath(animal), [animal]);
  const grid = useMemo(() => createGrid(insideMask(animal)), [animal]);
  const pool = useRef<Particle[] | null>(null);
  if (!pool.current) pool.current = createPool();

  const step = currentStep(state);
  const baseRadius = brushRadius(STEPS[step], ease, boxW);
  const radius = useMemo(() => oneButton ? autoBrushRadius(grid.inside, baseRadius) : baseRadius, [baseRadius, grid, oneButton]);
  const live = useRef({ state, radius, reduced });
  useLayoutEffect(() => { live.current = { state, radius, reduced }; });
  const layer = useRef<LayerHandle>(null);
  const particles = useRef<ParticlesHandle>(null);
  const box = useRef<HTMLDivElement>(null);
  const tools = useRef<ToolCursorHandle>(null);
  const pendingProgress = useRef<number | null>(null);
  const lastSpawn = useRef(-Infinity);
  const brush = useRef(START_BRUSH);
  const currentMove = useRef<AutoMove | null>(null);
  const strokePlan = useRef<{ radius: number; pass: number; strokes: Stroke[] } | null>(null);
  const [strokeCount, setStrokeCount] = useState(0);
  const [reaction, setReaction] = useState<ReactionRun | null>(null);
  const reactedTurn = useRef(0);
  const spawnGapMs = scaled(TIMING.particleGap, pace) * 1000;

  // Jedna ścieżka dla dotyku, klawiatury i ruchu automatycznego. Nie odczytuje pikseli.
  const segment = useCallback<Segment>((x0, y0, x1, y1) => {
    const { state: current, radius: r } = live.current;
    if (document.hidden || current.phase !== "scrubbing" || !(r > 0)) return false;
    const changed = stampSegment(grid, x0, y0, x1, y1, r) > 0;
    layer.current?.stroke(x0, y0, x1, y1, r);
    if (changed) pendingProgress.current = gridProgress(grid);
    const kind = currentStep(current);
    const now = performance.now();
    const inside = x1 >= 0 && x1 <= LW && y1 >= 0 && y1 <= LH;
    if (!inside || kind === "dry" || kind === "groom" || now - lastSpawn.current < spawnGapMs) return changed;
    lastSpawn.current = now;
    return spawn(pool.current!, x1 + (fxRng.float() - 0.5) * 30, y1 + (fxRng.float() - 0.5) * 20,
      kind === "rinse" ? "drop" : "bubble", fxRng, particleLimit) || changed;
  }, [fxRng, grid, particleLimit, spawnGapMs]);

  const tick = useCallback((dt: number) => {
    const { state: current, reduced: isReduced } = live.current;
    const move = currentMove.current;
    let completedStroke = false;
    if (move && current.phase === "scrubbing") {
      const duration = scaled(TIMING.autoStroke, pace);
      move.elapsed = Math.min(duration, move.elapsed + dt);
      const [x, y] = strokePoint(move.stroke, move.elapsed / duration);
      segment(move.x, move.y, x, y);
      move.x = x;
      move.y = y;
      // Przy ograniczonym ruchu nie animujemy kursora, ale czas i zasady wejścia są takie same.
      if (isReduced) tools.current?.end(AUTO_TOOL);
      else tools.current?.move(AUTO_TOOL, x, y, true);
      if (move.elapsed >= duration) {
        completedStroke = true;
        currentMove.current = null;
        tools.current?.end(AUTO_TOOL);
        onAutoBusy(false);
      }
    }
    // Prawdziwy postęp jest widoczny także przed końcem pasa, ale faza wtedy jeszcze się nie zmienia.
    if (pendingProgress.current !== null || completedStroke) {
      dispatch({ type: "progress", value: pendingProgress.current ?? gridProgress(grid), finishStroke: !currentMove.current });
      pendingProgress.current = null;
    }
    const timed = isTimed(current);
    if (timed) dispatch({ type: "tick", dt, pace, reduced: isReduced, nextAnimalSeed: nextSeed, nextAnimalId: nextAnimal.id });
    const alive = stepPool(pool.current!, dt / pace, particleLimit);
    particles.current?.render(pool.current!, isReduced);
    return Boolean(currentMove.current) || timed || alive > 0;
  }, [dispatch, grid, nextAnimal, nextSeed, onAutoBusy, pace, particleLimit, segment]);
  const wake = useBathClock(tick);

  useLayoutEffect(() => {
    if (state.phase !== "scrubbing") tools.current?.reset();
  }, [state.phase]);

  useLayoutEffect(() => {
    if (state.phase !== "reward") {
      setReaction(null);
    } else if (state.animalCount !== reactedTurn.current) {
      reactedTurn.current = state.animalCount;
      setReaction(rewardReaction(animal, state.animalSeed, pace, reduced));
    } else if (reduced) {
      setReaction((current) => current && isFaceReaction(current.kind) ? current : null);
    }
  }, [animal, pace, reduced, state.animalCount, state.animalSeed, state.phase]);

  useEffect(() => {
    if (state.phase !== "stage_in" || state.layerReady) return;
    const rng = createRng((layerSeed + state.stepIndex * 7919) % MAX_SEED);
    layer.current?.prepare(STEPS[step], silhouette, rng);
    resetGrid(grid);
    pendingProgress.current = null;
    strokePlan.current = null;
    currentMove.current = null;
    brush.current = START_BRUSH;
    setStrokeCount(0);
    dispatch({ type: "layerReady" });
  }, [dispatch, grid, layerSeed, silhouette, state.layerReady, state.phase, state.stepIndex, step]);

  useEffect(() => { wake(); }, [state.phase, state.layerReady, reduced, wake]);

  const showBrush = useCallback(() => {
    if (oneButton || live.current.state.phase !== "scrubbing" || document.hidden || document.activeElement !== box.current) return;
    tools.current?.move(KEY_TOOL, brush.current.x * LW, brush.current.y * LH, false);
  }, [oneButton]);

  useEffect(() => { showBrush(); }, [state.phase, boxW, showBrush]);

  useImperativeHandle(ref, () => ({
    hasFocus: () => document.activeElement === box.current,
    keyboardStroke(key) {
      const before = brush.current;
      const next = key === "zigzag" ? zigzag(before) : moveBrush(before, key);
      brush.current = next;
      const wrapped = key === "zigzag" && next.y < before.y;
      if (segment((wrapped ? next.x : before.x) * LW, (wrapped ? next.y : before.y) * LH, next.x * LW, next.y * LH)) wake();
      showBrush();
    },
    startAutoStroke() {
      const { state: current, radius: r, reduced: isReduced } = live.current;
      if (current.phase !== "scrubbing" || currentMove.current || !(r > 0) || gridProgress(grid) >= current.threshold) return;
      let plan = strokePlan.current;
      if (!plan || plan.radius !== r) {
        plan = { radius: r, pass: 0, strokes: planAutoStrokes(grid.inside, r) };
        strokePlan.current = plan;
      }
      if (!plan.strokes.length) return;
      let stroke = plan.strokes[plan.pass++ % plan.strokes.length];
      // Po zmianie rozmiaru lub bardzo cienkim narzędziu kolejny obieg wypełnia pominięte komórki.
      // Wybieramy pasy z pozostałej maski, nie zwiększamy sztucznie postępu.
      if (plan.pass === plan.strokes.length + 1) {
        const { inside, done } = grid;
        const remaining = inside.map((value, index) => value && !done[index] ? 1 : 0);
        const extra = planAutoStrokes(remaining, r);
        if (extra.length) {
          plan.strokes = extra;
          plan.pass = 1;
          stroke = extra[0];
        }
      }
      const [x, y] = strokePoint(stroke, 0);
      currentMove.current = { stroke, elapsed: 0, x, y };
      onAutoBusy(true);
      setStrokeCount((count) => count + 1);
      segment(x, y, x, y);
      if (!isReduced) tools.current?.move(AUTO_TOOL, x, y, true);
      wake();
    },
  }), [grid, onAutoBusy, segment, showBrush, wake]);

  const washing = state.phase === "scrubbing";
  useScrub(box, {
    canStart: () => live.current.state.phase === "scrubbing" && !oneButton && latch.remainingMs() === 0,
    onSegment(x0, y0, x1, y1) {
      if (!oneButton && segment(x0, y0, x1, y1)) wake();
    },
    onPointer(id, x, y, pressed) {
      if (live.current.state.phase !== "scrubbing" || oneButton) return;
      tools.current?.end(KEY_TOOL);
      tools.current?.move(id, x, y, pressed);
    },
    onPointerEnd(id) { tools.current?.end(id); showBrush(); },
    onReset() { tools.current?.reset(); showBrush(); },
  }, washing && !oneButton);

  const waiting = state.phase === "door_waiting";
  const arriving = state.phase === "arriving";
  const leaving = state.phase === "to_bench";
  const rewarding = state.phase === "reward";
  const duration = phaseDuration(state.phase, pace, reduced);
  const progress = duration > 0 ? clamp01(state.phaseT / duration) : 1;
  const eased = smooth(progress);
  let layerOpacity = 0;
  if (state.phase === "stage_in") layerOpacity = state.layerReady ? progress : 0;
  else if (washing) layerOpacity = 1;
  else if (state.phase === "stage_rest") layerOpacity = reduced ? 0 : 1 - progress;

  const entryScale = previewH / Math.max(1, boxH);
  const previewStyle: CSSProperties | null = waiting || arriving ? {
    left: previewX, top: previewY, width: previewW, height: previewH,
    opacity: arriving && reduced ? 1 - eased : 1,
    transform: arriving && !reduced
      ? `translate(${(boxLeft - previewX) * eased}px, ${(boxTop - previewY) * eased}px) scale(${1 + (boxH / Math.max(1, previewH) - 1) * eased})`
      : undefined,
  } : null;
  const animalStyle: CSSProperties = {
    opacity: waiting || (arriving && !reduced) ? 0 : arriving ? eased : leaving ? 1 - eased : 1,
    transform: leaving && !reduced ? `translateX(${boxW * 0.36 * eased}px) scale(${1 - (1 - entryScale) * 0.38 * eased})` : undefined,
  };
  const bathLook = animalBathState(state.phase, step, animal, state.animalCount);
  const scarfTransfer = arriving ? clamp01(1 - (duration - state.phaseT) / fadeDuration(TIMING.minFade, pace)) : waiting ? 0 : 1;
  const hangerSize = Math.min(44, Math.max(32, scene.width / 16));
  const gettingWet = state.phase === "stage_in" && step === "rinse";
  const boxStyle = {
    left: boxLeft, top: boxTop, width: boxW, height: boxH,
    "--bath-tool-fade": `${fadeDuration(TIMING.toolFade, pace)}s`,
  } as CSSProperties;

  return (
    <div ref={stageRef} className="bath-stage" data-phase={state.phase} data-step={step}
      data-progress={state.progress.toFixed(2)} data-animal={animal.id} data-animal-turn={state.animalCount}
      data-seed={seed} data-auto-strokes={strokeCount}>
      <Preview layout={door} animalStyle={previewStyle} waiting={waiting} def={animal} scarfOpacity={1 - scarfTransfer} />
      <HangingScarf def={animal} style={{
        left: scene.width - hangerSize - margin, top: scene.height * 0.18,
        width: hangerSize, height: hangerSize * 1.5, opacity: scarfTransfer * (leaving ? 1 - eased : 1),
      }} />
      <div ref={box} className="bath-box" data-phase={state.phase} style={boxStyle} role="application"
        tabIndex={waiting || arriving ? -1 : 0} aria-label={bathBoxLabel(animal, oneButton)}
        onFocus={showBrush} onBlur={() => tools.current?.end(KEY_TOOL)}>
        <div className="bath-animal" style={animalStyle}>
          <div className="bath-animal__base">
            <AnimalSvg def={animal} state={leaving ? "washed" : rewarding ? (step === "dry" ? "wet" : "clean") : gettingWet ? "clean" : bathLook} reduced={reduced}
              surface={step === "rinse"} scarfOpacity={arriving ? 1 - scarfTransfer : 1} />
          </div>
          {gettingWet && <div className="bath-animal__blend" style={{ opacity: layerOpacity }}>
            <AnimalSvg def={animal} state="wet" reduced={reduced} />
          </div>}
          {rewarding && <div className="bath-animal__reward">
            <AnimalSvg def={animal} state="washed" reaction={reaction} reduced={reduced} />
          </div>}
          {leaving && <div className="bath-animal__blend" style={{ opacity: clamp01(state.phaseT / fadeDuration(TIMING.minFade, pace)) }}>
            <AnimalSvg def={animal} state={bathLook} reduced={reduced} />
          </div>}
        </div>
        <LayerCanvas ref={layer} opacity={layerOpacity} />
        <Particles ref={particles} />
        <ToolCursor ref={tools} tool={step} radius={radius} />
      </div>
    </div>
  );
}
