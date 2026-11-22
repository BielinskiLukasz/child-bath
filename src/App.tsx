import { useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState, type CSSProperties, type MouseEventHandler } from "react";
import { ANIMALS_BY_ID, pickAnimal } from "./animals/roster";
import { BathStage, type BathStageHandle } from "./components/BathStage";
import { DoorPreview } from "./components/DoorPreview";
import { LiveRegion } from "./components/LiveRegion";
import { NextButton } from "./components/NextButton";
import { OneButtonKey } from "./components/OneButtonKey";
import { PlaceholderTub } from "./components/illustration/PlaceholderTub";
import { bathAnnouncement } from "./copy/announce";
import { Gallery } from "./dev/Gallery";
import { bathReducer, createBathState, currentStep } from "./game";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { isArrowKey } from "./input/keyboardBrush";
import { createInputLatch } from "./input/latch";
import { DEFAULT_BATH_SETTINGS } from "./settings/defaults";
import { isTestMode } from "./settings/testMode";
import { readSessionParams } from "./settings/testParams";
import { fadeDuration, scaled, TIMING } from "./timing";

function ownsKeys(target: EventTarget | null): boolean {
  return target instanceof Element && Boolean(target.closest(
    "input, textarea, select, a[href], [contenteditable]:not([contenteditable='false']), button:not([data-bath-control]), dialog[open]",
  ));
}

export default function App() {
  const search = window.location.search;
  if (isTestMode(search) && new URLSearchParams(search).get("gallery") === "animals") return <Gallery />;
  return <BathGame />;
}

function BathGame() {
  const [testMode] = useState(() => isTestMode());
  const [params] = useState(() => readSessionParams());
  const { oneButton, pace } = params;
  const [state, dispatch] = useReducer(bathReducer, params, ({ steps, seed, ease, animal, allowedAnimals }) =>
    createBathState(steps, seed, ease, animal ?? pickAnimal(seed, undefined, allowedAnimals).id));
  const animal = ANIMALS_BY_ID[state.animalId];
  const [latch] = useState(createInputLatch);
  const [ready, setReady] = useState(true);
  const [autoBusy, setAutoBusy] = useState(false);
  const [hidden, setHidden] = useState(() => document.hidden);
  const reduced = useReducedMotion();
  const phase = useRef(state.phase);
  const stage = useRef<BathStageHandle>(null);
  const action = useRef<HTMLElement>(null);
  const waiting = state.phase === "door_waiting";
  const washing = state.phase === "scrubbing";

  useEffect(() => {
    const sync = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  useLayoutEffect(() => {
    if (phase.current !== state.phase) {
      phase.current = state.phase;
      latch.phaseChanged();
    }
    let timer: number | undefined;
    const refresh = () => {
      const remaining = latch.remainingMs();
      setReady(remaining === 0);
      if (remaining && !hidden) timer = window.setTimeout(refresh, Math.ceil(remaining) + 1);
    };
    refresh();
    return () => window.clearTimeout(timer);
  }, [state.phase, hidden, latch]);

  useLayoutEffect(() => {
    // Jeśli gra była prowadzona z pudełka, po zakończeniu wróć do sterowania zapowiedzią.
    // Przycisk, który już miał fokus, nigdy go nie traci przy zmianie fazy.
    if (waiting && stage.current?.hasFocus()) {
      action.current?.querySelector<HTMLButtonElement>("[data-bath-control]")?.focus({ preventScroll: true });
    }
  }, [waiting]);

  const activate = useCallback(() => {
    if (phase.current === "door_waiting") {
      latch.phaseChanged(); // blokada od razu, także przed zatwierdzeniem renderu
      dispatch({ type: "next" });
    } else if (phase.current === "scrubbing" && oneButton) {
      stage.current?.startAutoStroke();
    }
  }, [latch, oneButton]);

  const canUseButton = !hidden && ready && (waiting || (oneButton && washing && !autoBusy));
  const onActivate: MouseEventHandler<HTMLButtonElement> = (event) => {
    if (document.hidden || !canUseButton || !latch.accept(event.nativeEvent)) return;
    activate();
  };

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing || event.altKey || event.ctrlKey || event.metaKey || ownsKeys(event.target)) return;
      const boxFocused = stage.current?.hasFocus() ?? false;
      const buttonFocused = event.target instanceof Element && Boolean(event.target.closest("[data-bath-control]"));
      const key = event.key;
      const enter = key === "Enter";
      const space = key === " ";
      const arrow = isArrowKey(key);
      if (!(enter || (space && (boxFocused || buttonFocused)) || (arrow && boxFocused))) return;
      // Nie dopuszczamy natywnego drugiego clicka ani przewijania w trakcie przejść.
      event.preventDefault();
      if (!latch.accept(event) || document.hidden) return;
      if ((phase.current === "door_waiting" || (oneButton && phase.current === "scrubbing")) && (enter || (space && buttonFocused))) {
        activate();
      } else if (phase.current === "scrubbing" && !oneButton && boxFocused) {
        if (arrow) stage.current?.keyboardStroke(key);
        else if (enter || space) stage.current?.keyboardStroke("zigzag");
      }
    };
    const up = (event: KeyboardEvent) => latch.release(event);
    const blur = () => latch.resetKeys();
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, [activate, latch, oneButton]);

  const motionStyle = {
    "--bath-fade": `${fadeDuration(TIMING.minFade, pace)}s`,
    "--invitation-breath": `${scaled(TIMING.invitationBreath, pace)}s`,
    "--preview-breath": `${scaled(TIMING.previewBreath, pace)}s`,
  } as CSSProperties;

  return (
    <div className="little-world" data-phase={state.phase} data-one-button={String(oneButton)}
      data-input-ready={String(ready && !hidden)} data-paused={String(hidden)}
      data-test-frames={testMode ? "true" : undefined} style={motionStyle}>
      <header className="top-bar" data-zone="Pasek górny">
        <h1 className="app-title">Mała łazienka <em className="app-title__name">{DEFAULT_BATH_SETTINGS.childName}</em></h1>
      </header>
      <main id="scene" className="scene" data-zone="Scena" aria-label="Łazienka">
        <PlaceholderTub />
        <BathStage ref={stage} session={params} state={state} animal={animal} dispatch={dispatch} latch={latch}
          reduced={reduced} onAutoBusy={setAutoBusy} Preview={DoorPreview} />
      </main>
      <section id="narration" className="narration" data-zone="Narracja" aria-hidden="true">
        {testMode && <p className="zone-sample">Żabka skakała po kałużach… (przykładowe zdanie dla rodzica)</p>}
      </section>
      <footer id="action" className="action" data-zone="Strefa akcji" ref={action}>
        {oneButton ? <OneButtonKey ready={canUseButton} waiting={waiting} onActivate={onActivate} />
          : <NextButton ready={canUseButton} onActivate={onActivate} />}
      </footer>
      <LiveRegion message={bathAnnouncement(state.phase, currentStep(state), state.stepIndex, state.steps.length, animal)} />
    </div>
  );
}
