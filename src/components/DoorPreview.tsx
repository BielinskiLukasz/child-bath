import type { CSSProperties } from "react";
import { AnimalSvg } from "../animals/render";
import type { AnimalDef } from "../animals/types";

export function DoorPreview({ def, animalStyle, waiting, scarfOpacity, dozing }: {
  def: AnimalDef; animalStyle: CSSProperties | null; waiting: boolean; scarfOpacity: number; dozing: boolean;
}) {
  if (!animalStyle) return null;
  return <div className="door-preview-animal" data-waiting={waiting ? "true" : undefined} style={animalStyle}>
    <div className="door-preview-animal__fade" key={def.id} aria-hidden="true">
      <AnimalSvg def={def} state="scarf" mood={waiting ? dozing ? "dozing" : "curious" : "cheerful"} scarfOpacity={scarfOpacity} />
    </div>
  </div>;
}
