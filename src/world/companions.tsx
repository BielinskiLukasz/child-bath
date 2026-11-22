import { memo } from "react";
import type { Rng } from "../random";
import type { ResolvedSpot } from "./layout";

export const COMPANIONS = ["duck", "boat", "frog"] as const;
export type Companion = (typeof COMPANIONS)[number];

export function pickCompanions(rng: Rng): readonly Companion[] {
  const first = rng.pick(COMPANIONS);
  return rng.int(0, 1) ? [first, rng.pick(COMPANIONS.filter((kind) => kind !== first))] : [first];
}

export const CompanionArt = memo(function CompanionArt({ kind, spot }: { kind: Companion; spot: ResolvedSpot }) {
  const seconds = kind === "duck" ? 4.8 : kind === "boat" ? 5.6 : 5.2;
  return <svg className="world-companion" data-companion={kind} viewBox="0 0 60 48" aria-hidden="true" focusable="false"
    style={{ left: spot.x - spot.size / 2, top: spot.y - spot.size * 0.75, width: spot.size, height: spot.size * 0.8 }}>
    <g className="world-companion__body" style={{ animationDuration: `${seconds}s` }}>
      {kind === "duck" ? <>
        <path d="M12 22q8 8 17 5c-7-11-2-20 8-20 9 0 13 8 11 15l-2 4q4 13-16 16c-14 2-24-6-23-16q0-6 5-4Z" fill="#e6bf70" />
        <path d="M47 17q14 0 10 5-4 4-11 2Z" fill="#bc8153" /><circle cx="41" cy="16" r="1.8" fill="#3f4d40" />
        <path d="M16 31q9-5 18 1-7 7-16 2Z" fill="#f2d78c" />
      </> : kind === "boat" ? <>
        <path d="M8 32h45l-9 10H18Z" fill="#ac7859" /><path d="M9 32h43" stroke="#dfba89" strokeWidth="2" strokeLinecap="round" />
        <path d="M30 32V5" stroke="#8b634d" strokeWidth="2.3" strokeLinecap="round" />
        <path d="M32 7 48 28H32Z" fill="#f7edd6" /><path d="M27 12 15 28h12Z" fill="#c6a0a2" />
      </> : <>
        <path d="M10 25q-2-13 8-14 6-1 9 5 8-3 14 0 7-8 13-1 5 5 0 13 5 13-16 14H23Q5 40 10 25Z" fill="#90aa76" />
        <path d="M13 28q18-5 39 0-3 10-18 11-17 0-21-11Z" fill="#c2d29a" />
        <circle cx="19" cy="20" r="1.7" fill="#3f4d40" /><circle cx="47" cy="20" r="1.7" fill="#3f4d40" />
        <path d="M27 28q6 6 12 0" fill="none" stroke="#58714f" strokeWidth="1.7" strokeLinecap="round" />
      </>}
    </g>
  </svg>;
});