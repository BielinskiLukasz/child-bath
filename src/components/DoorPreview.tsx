import type { CSSProperties } from "react";
import { AnimalSvg } from "../animals/render";
import type { AnimalDef } from "../animals/types";

export interface PreviewLayout { x: number; y: number; width: number; height: number }

/** Papierowa wnęka z boku sceny; przyszłe scenerie podmienią ją na własne wejścia. */
export function DoorPreview({ layout, def, animalStyle, waiting, scarfOpacity }: {
  layout: PreviewLayout; def: AnimalDef; animalStyle: CSSProperties | null; waiting: boolean; scarfOpacity: number;
}) {
  return (
    <>
      <svg className="bath-door" viewBox="0 0 100 136" aria-hidden="true" focusable="false"
        style={{ left: layout.x, top: layout.y, width: layout.width, height: layout.height }}>
        <ellipse className="bath-door__mat" cx="50" cy="130" rx="46" ry="6" />
        <path className="bath-door__frame" d="M9 122V47a41 41 0 0 1 82 0v75z" />
        <path className="bath-door__alcove" d="M17 122V47a33 33 0 0 1 66 0v75z" />
        <path className="bath-door__panel" d="M17 48q0-23 24-30v104H17z" />
        <circle className="bath-door__knob" cx="34" cy="75" r="3" />
        <rect className="bath-door__step" x="6" y="122" width="88" height="6" rx="3" />
      </svg>
      {animalStyle && (
        <div className="door-preview-animal" data-waiting={waiting ? "true" : undefined} style={animalStyle}>
          <div className="door-preview-animal__fade" key={def.id} aria-hidden="true">
            <AnimalSvg def={def} state="scarf" mood={waiting ? "curious" : "cheerful"} scarfOpacity={scarfOpacity} />
          </div>
        </div>
      )}
    </>
  );
}
