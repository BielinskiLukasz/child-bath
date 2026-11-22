import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ANCHOR_KINDS, type AnimalDef, type AnimalGroup, type AnimalMood, type ReactionKind } from "../animals/types";
import { ANIMALS, ANIMALS_BY_ID, isAnimalId } from "../animals/roster";
import { ANIMAL_GROUPS, COAT_LABELS, isAnimalGroup } from "../animals/traits";
import { ANIMAL_STATES, STATE_LABELS, type AnimalState } from "../animals/states";
import { DECOR_IDS, decorAnchor } from "../animals/anchors";
import { VIEWBOX } from "../animals/geometry/template";
import { insideMask } from "../animals/mask";
import { NAME_CASES, name } from "../animals/names";
import { AnimalSvg, type AnimalSvgProps } from "../animals/render";
import { createReactionPlayer, isFaceReaction, REACTIONS, type ReactionRun } from "../animals/reactions";
import { useBathClock } from "../hooks/useBathClock";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { readSessionParams } from "../settings/testParams";

const CASE_LABELS = ["Mianownik", "Dopełniacz", "Celownik", "Biernik", "Narzędnik", "Miejscownik"];
const MOOD_LABELS: Record<AnimalMood, string> = { cheerful: "Pogodny", curious: "Ciekawski", dozing: "Zaspany" };
const ANCHOR_LABELS = { headTop: "Czubek głowy", earLeft: "Lewe ucho", earRight: "Prawe ucho", neck: "Szyja", brow: "Czoło" };
const DECOR_LABELS = ["Wianek z kwiatów", "Wianek z liści", "Kokardka", "Korona", "Czapeczka", "Turban", "Kwiatek", "Muszka", "Gwiazdka", "Słomkowy kapelusz", "Czapka z pomponem"];

function InspectAnimal(props: AnimalSvgProps & { showAnchors: boolean }) {
  return <div className="gallery-portrait">
    <AnimalSvg {...props} />
    {props.showAnchors && <svg className="gallery-anchors" viewBox={`${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}`} aria-hidden="true">
      {ANCHOR_KINDS.map((anchor) => {
        const [x, y] = props.def.anchors[anchor];
        return <circle key={anchor} cx={x} cy={y} r="1.15" data-anchor={anchor}><title>{ANCHOR_LABELS[anchor]}</title></circle>;
      })}
    </svg>}
  </div>;
}

export function Gallery() {
  const [params] = useState(() => readSessionParams());
  const [still] = useState(() => new URLSearchParams(window.location.search).get("still") === "1");
  const [state, setState] = useState<AnimalState>("clean");
  const [filter, setFilter] = useState<AnimalGroup | "all">(() => {
    const group = new URLSearchParams(window.location.search).get("group");
    return isAnimalGroup(group) ? group : "all";
  });
  const [selection, setSelection] = useState<AnimalDef>(params.animal ? ANIMALS_BY_ID[params.animal] : ANIMALS_BY_ID.frog);
  const [mood, setMood] = useState<AnimalMood>("cheerful");
  const [showAnchors, setShowAnchors] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [run, setRun] = useState<ReactionRun | null>(null);
  const [suppressed, setSuppressed] = useState(false);
  const [hidden, setHidden] = useState(() => document.hidden);
  const reduced = useReducedMotion();
  const [player] = useState(createReactionPlayer);
  const panel = useRef<HTMLElement>(null);
  const visibleAnimals = useMemo(() => filter === "all" ? ANIMALS : ANIMALS.filter((def) => def.group === filter), [filter]);
  const tick = useCallback((dt: number) => {
    const busy = player.advance(dt);
    if (!busy) setRun(null);
    return busy;
  }, [player]);
  const wake = useBathClock(tick);

  useEffect(() => {
    const visibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", visibility);
    return () => document.removeEventListener("visibilitychange", visibility);
  }, []);
  useEffect(() => {
    if (reduced && run && !isFaceReaction(run.kind)) setSuppressed(true);
  }, [reduced, run]);

  function choose(id: string, fromGrid = false) {
    if (run || !isAnimalId(id)) return;
    setSelection(ANIMALS_BY_ID[id]);
    if (fromGrid) panel.current?.focus();
  }

  function react(kind: ReactionKind) {
    if (still) return;
    const accepted = player.playReaction(kind, params.pace, reduced);
    if (!accepted) return;
    setSuppressed(false);
    setRun(accepted);
    wake();
  }

  return (
    <main className="animal-gallery" data-paused={String(still || hidden)} data-still={String(still)}>
      <div className="gallery-inner">
        <header className="gallery-header">
          <a href="?" className="gallery-back"><span aria-hidden="true">&larr;</span> Mała łazienka</a>
          <p className="gallery-kicker">Przegląd postaci · Faza 5</p>
          <h1>Galeria zwierzątek</h1>
          <p>Porównaj wygląd całej rodziny i obejrzyj reakcje w powiększeniu.</p>
        </header>

        <div className="gallery-filters" aria-label="Widok galerii">
          <label><span id="gallery-state-label">Stan wszystkich postaci</span><select aria-labelledby="gallery-state-label" value={state} onChange={(event) => setState(event.target.value as AnimalState)}>
            {ANIMAL_STATES.map((key) => <option value={key} key={key}>{STATE_LABELS[key]}</option>)}
          </select></label>
          <label><span id="gallery-group-label">Grupa</span><select aria-labelledby="gallery-group-label" value={filter} onChange={(event) => setFilter(event.target.value as AnimalGroup | "all")}>
            <option value="all">Wszystkie · {ANIMALS.length}</option>
            {(Object.keys(ANIMAL_GROUPS) as AnimalGroup[]).map((group) => {
              const count = ANIMALS.filter((def) => def.group === group).length;
              return <option key={group} value={group}>{ANIMAL_GROUPS[group]} · {count}</option>;
            })}
          </select></label>
        </div>
        <label className="gallery-check gallery-roster-toggle"><input type="checkbox" checked={showLabels} onChange={(event) => setShowLabels(event.target.checked)} /> Pokaż podpisy postaci</label>

        <ul className="gallery-grid" aria-label="Wybierz postać do podglądu" data-count={visibleAnimals.length} data-labels={String(showLabels)}>
          {visibleAnimals.map((def) => <li key={def.id}>
            <button type="button" className="gallery-tile" data-gallery-animal={def.id} aria-pressed={selection === def}
              aria-label={`Obejrzyj: ${name(def)}`} disabled={Boolean(run)} onClick={() => choose(def.id, true)}>
              <AnimalSvg def={def} state={state} />
              <strong>{name(def)}</strong><span>{COAT_LABELS[def.okrywa]}</span>
            </button>
          </li>)}
        </ul>

        <section className="gallery-inspector" ref={panel} tabIndex={-1} aria-labelledby="animal-detail-title" data-selected={selection.id}>
          <div className="gallery-inspector__art">
            <InspectAnimal def={selection} state={state} mood={mood} reaction={suppressed ? null : run} reduced={reduced} showAnchors={showAnchors} />
            <a className="gallery-bath-link" href={`?test=1&animal=${selection.id}`}>Wykąp {name(selection, "bier")} <span aria-hidden="true">&rarr;</span></a>
          </div>
          <div className="gallery-inspector__controls">
            <p className="gallery-kicker">{ANIMAL_GROUPS[selection.group]} / {COAT_LABELS[selection.okrywa]}</p>
            <h2 id="animal-detail-title">{name(selection)}</h2>
            <div className="gallery-filters gallery-filters--detail">
              <label><span id="gallery-animal-label">Zwierzątko</span><select aria-labelledby="gallery-animal-label" value={selection.id} disabled={Boolean(run)} onChange={(event) => choose(event.target.value)}>
                {ANIMALS.map((def) => <option key={def.id} value={def.id}>{name(def)}</option>)}
              </select></label>
              <label><span id="gallery-mood-label">Nastrój</span><select aria-labelledby="gallery-mood-label" value={mood} onChange={(event) => setMood(event.target.value as AnimalMood)}>
                {(Object.keys(MOOD_LABELS) as AnimalMood[]).map((key) => <option value={key} key={key}>{MOOD_LABELS[key]}</option>)}
              </select></label>
            </div>
            <h3>Reakcje</h3>
            <div className="gallery-reactions">
              {selection.reactions.map((kind) => <button type="button" key={kind} data-play-reaction={kind}
                aria-disabled={still || Boolean(run) || (reduced && !isFaceReaction(kind))} onClick={() => react(kind)}>{REACTIONS[kind].label}</button>)}
            </div>
            <p className="gallery-reaction-note" aria-live="polite">{run ? REACTIONS[run.kind].label : still ? "Widok nieruchomy do zrzutów." : reduced ? "Ograniczony ruch: dostępna jest tylko mimika." : "Wybierz reakcję, aby ją odtworzyć."}</p>
            <label className="gallery-check"><input type="checkbox" checked={showAnchors} onChange={(event) => setShowAnchors(event.target.checked)} /> Pokaż kotwice ozdób</label>
            <details>
              <summary>Odmiana imienia</summary>
              <dl>{NAME_CASES.map((key, i) => <div key={key}><dt>{CASE_LABELS[i]}</dt><dd>{name(selection, key)}</dd></div>)}</dl>
            </details>
            <details>
              <summary>Zgodność ozdób</summary>
              <dl>{DECOR_IDS.map((key, i) => {
                const fit = decorAnchor(selection, key);
                return <div key={key}><dt>{DECOR_LABELS[i]}</dt><dd>{fit ? ANCHOR_LABELS[fit.kind] : "Nie pasuje"}</dd></div>;
              })}</dl>
            </details>
          </div>
        </section>
        {new URLSearchParams(window.location.search).get("mask") === "1" && (
          <ol hidden aria-hidden="true">{ANIMALS.map((def) => <li key={def.id} data-mask-for={def.id}>{insideMask(def).join("")}</li>)}</ol>
        )}
      </div>
    </main>
  );
}