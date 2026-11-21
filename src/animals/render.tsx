import { memo, useId, type CSSProperties } from "react";
import { COAT_LOOK, coatTufts, mixTone } from "./coats";
import { path, VIEWBOX } from "./geometry/template";
import { isFaceReaction, type ReactionRun } from "./reactions";
import { SCARF_COLORS, towelColor, type AnimalState } from "./states";
import type { AnimalDef, AnimalMood, ColorRef, Shape } from "./types";

const viewBox = `${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}`;
const SCARF = path("scarf", "M-23 28Q1 37 23 28L21 39Q0 45-21 39Z");

function tone(def: AnimalDef, color: ColorRef, wet: boolean) {
  if (color === "none") return color;
  const fill = color.startsWith("#") ? color : def.palette[color as keyof AnimalDef["palette"]];
  return wet ? mixTone(fill as `#${string}`, def.palette.ink, 0.15) : fill;
}

function Geometry({ shape, fill, stroke }: { shape: Shape; fill: string; stroke?: string }) {
  const props = {
    fill, stroke, strokeWidth: stroke ? shape.stroke?.width : undefined, strokeLinecap: "round" as const,
    opacity: shape.opacity, transform: `matrix(${shape.matrix.join(" ")})`,
  };
  switch (shape.el) {
    case "circle": return <circle {...shape.attrs} {...props} />;
    case "ellipse": return <ellipse {...shape.attrs} {...props} />;
    case "rect": return <rect {...shape.attrs} {...props} />;
    case "path": return <path {...shape.attrs} {...props} />;
  }
}

function Parts({ def, shapes, wet = false }: { def: AnimalDef; shapes: readonly Shape[]; wet?: boolean }) {
  return <>{shapes.map((shape, index) => (
    <g key={index} data-part={shape.part} data-motion={shape.motion} data-silhouette={shape.silhouette || undefined}>
      <Geometry shape={shape} fill={tone(def, shape.fill, wet)} stroke={shape.stroke && tone(def, shape.stroke.color, wet)} />
    </g>
  ))}</>;
}

function CoatFinish({ def }: { def: AnimalDef }) {
  const look = COAT_LOOK[def.okrywa];
  const [headX, headY] = def.anchors.headTop;
  if (look === "fluffy" || look === "woolly") {
    return <g data-part="extra" data-finish={look} className="animal-fluff">
      {coatTufts(def).map(({ x, y, side, size }, i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${side * size} ${size})`}>
          <path d={look === "woolly" ? "M-0.6-1.25Q0.45-1.65 0.8-0.78Q1.7-0.5 1.13 0.26Q1.34 1.17 0.39 1.22L-0.68 0.78Z" : "M-0.75-1.1Q0.24-0.9 1.24-0.24L0.54 0.08Q1.08 0.5 0.91 0.87L-0.65 0.8Z"}
            fill={look === "woolly" ? def.palette.accent : def.palette.fur} />
        </g>
      ))}
    </g>;
  }
  if (look === "feathered") {
    return <g data-part="extra" data-finish={look} className="animal-feathers" fill={def.palette.accent}>
      <path transform={`translate(${headX} ${headY + 3})`} d="M-4 4C-4 0-4-4-6-5C-2-5 0-2 1 0Q2-4 6-5Q5-1 5 3Q1 7-4 4Z" />
      <path d="M-8 23q4 0 6 3l2-4 3 4q3-2 5-1-1 6-8 7-6-1-8-9Z" />
    </g>;
  }
  const gleam = {
    spiny: "M-13-12q2-3 4-3m-7 11 2-3m23-4 3 2",
    smooth: "M-11 2q3-3 7-3m7 23q4-1 6-4",
    scaled: "M-9 8q4 4 8 0m3 0q4 4 8 0m-14 11q4 4 8 0",
    shell: "M-11 22q4-5 8-5m7 10q4-1 6-4",
  }[look];
  return <g data-part="extra" data-finish={look} className="animal-gleam" opacity="0.75">
    <path d={gleam} fill="none" stroke={def.palette.cream} strokeWidth="1.35" strokeLinecap="round" />
  </g>;
}

function BathClothes({ def, state }: { def: AnimalDef; state: AnimalState }) {
  const towel = towelColor(def);
  if (state === "robe") return <g data-part="extra" data-wear="robe">
    <path d="M-9 15Q-15 18-15 27L-13 35Q0 39 13 35L15 26Q14 19 9 15L0 23Z" fill={towel} />
    <path d="M-10 15L0 23 9 15 12 18 2 28-12 19ZM-13 28Q0 31 13 28L13 31Q0 34-13 31Z" fill={def.palette.cream} opacity="0.75" />
    <ellipse cx="0" cy="30.2" rx="2.6" ry="1.5" fill={mixTone(towel, def.palette.ink, 0.2)} />
  </g>;
  if (state !== "turban") return null;
  const [x, y] = def.anchors.headTop;
  return <g data-part="extra" data-wear="turban" transform={`translate(${x} ${y})`}>
    <path d="M-10 4Q-12-1-8-5Q-4-10 3-7Q8-9 11-4Q14 1 11 5Q1 9-10 4Z" fill={towel} />
    <path d="M-10 1Q-3-4 4-3Q8-3 10-5Q12-4 12-2Q9 1 4 1Q-4 0-10 4Z" fill={def.palette.cream} opacity="0.65" />
    <path d="M5-4Q7-10 11-9Q15-8 12-5Q9-1 6-2Z" fill={mixTone(towel, def.palette.cream, 0.18)} />
  </g>;
}

export interface AnimalSvgProps {
  def: AnimalDef;
  state?: AnimalState;
  mood?: AnimalMood;
  reaction?: ReactionRun | null;
  reduced?: boolean;
  surface?: boolean;
  scarfOpacity?: number;
}

export const AnimalSvg = memo(function AnimalSvg({
  def, state = "clean", mood = "cheerful", reaction, reduced = false, surface = true, scarfOpacity = 1,
}: AnimalSvgProps) {
  const clip = useId();
  const wet = state === "wet";
  const washed = state === "washed" || state === "robe" || state === "turban";
  const scarf = state === "scarf" || state === "robe" || state === "turban";
  const kind = reaction && (!reduced || isFaceReaction(reaction.kind)) ? reaction.kind : undefined;
  const closed = kind && isFaceReaction(kind);
  const [mouthX, mouthY] = def.mouth;
  const ornaments = surface && (state === "dirty" || wet);
  const fluff = def.okrywa === "futro" || def.okrywa === "welna";
  return (
    <svg className="animal-svg" xmlns="http://www.w3.org/2000/svg" viewBox={viewBox}
      data-character={def.id} data-animal-state={state} data-coat={def.okrywa} data-mood={mood}
      aria-hidden="true" focusable="false">
      {ornaments && <defs><clipPath id={clip}>
        {def.shapes.filter((shape) => shape.silhouette).map((shape, index) => <Geometry key={index} shape={shape} fill={def.palette.cream} />)}
      </clipPath></defs>}
      <g className="animal-figure" data-reaction={kind} data-finished={washed || undefined}
        style={kind && reaction ? { "--animal-reaction-time": `${reaction.seconds}s` } as CSSProperties : undefined}>
        {fluff && (washed || kind === "fluff") && <CoatFinish def={def} />}
        <Parts def={def} shapes={def.shapes} wet={wet} />
        {!fluff && (washed || kind === "ruffle") && <CoatFinish def={def} />}
        {ornaments && <g data-part="extra" className="animal-surface" clipPath={`url(#${clip})`}>
          {wet ? (
            <g className="animal-drops" fill={def.palette.cream} opacity="0.57">
              <path d="M-13 4q4 4 0 5-4-1 0-5Zm24-4q4 5 0 5-3-1 0-5ZM-7 23q3 4 0 4-3 0 0-4Zm16 3q3 4 0 4-3 0 0-4Z" />
              <circle cx="4" cy="16" r="0.9" />
            </g>
          ) : <g fill="#9c7155" opacity="0.63"><path d="M-18 7q-1-5 4-4 4-2 5 2 2 4-2 5-5 2-7-3Zm21 16q0-4 3-3 4-2 6 2 1 4-3 5-4 1-6-4Z" /><circle cx="9" cy="-6" r="2" /></g>}
        </g>}
        <g className="animal-eyes-open"><Parts def={def} shapes={def.eyes[mood]} /></g>
        {closed && <g className="animal-eyes-closed"><Parts def={def} shapes={def.eyes.dozing} /></g>}
        {kind === "smileClosed" && <g data-part="face" className="animal-expression" transform={`translate(${mouthX} ${mouthY})`}>
          <path d="M-3.4-0.6Q0 3.2 3.4-0.6" fill="none" stroke={def.palette.line} strokeWidth="0.9" strokeLinecap="round" />
        </g>}
        {kind === "yawn" && <g className="animal-yawn" data-part="face"><ellipse cx={mouthX} cy={mouthY} rx="2.2" ry="2.55" fill={def.palette.nose} /></g>}
        {kind === "shine" && <g className="animal-reaction-shine" data-part="extra"><path d="M-8 22q4-4 8-4m3 8 3-1" fill="none" stroke={def.palette.cream} strokeWidth="1.4" strokeLinecap="round" /></g>}
        {kind === "pawSplash" && <g className="animal-splash" data-part="extra" fill="#a6c8c7">
          <path d="M22 8q4 4 0 5-3-1 0-5Zm5-6q4 4 0 5-3-1 0-5Z" />
        </g>}
        <BathClothes def={def} state={state} />
        {scarf && <g data-part="scarf" opacity={scarfOpacity}><Geometry shape={SCARF} fill={SCARF_COLORS[def.scarf]} /></g>}
      </g>
    </svg>
  );
});

export function HangingScarf({ def, style }: { def: AnimalDef; style: CSSProperties }) {
  return <svg className="hanging-scarf" viewBox="0 0 40 60" style={style} aria-hidden="true" focusable="false">
    <circle cx="20" cy="10" r="4" fill="#9c7155" />
    <path d="M11 16Q20 9 29 16L27 30 32 52Q28 55 22 53L19 31 16 52Q10 54 6 50L13 27Z" fill={SCARF_COLORS[def.scarf]} />
    <path d="M7 46q4 2 10 0m4 3q5 2 10-1" fill="none" stroke="#fffcf3" strokeWidth="2" opacity="0.58" strokeLinecap="round" />
  </svg>;
}