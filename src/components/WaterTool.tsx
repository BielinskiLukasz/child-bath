import { LH } from "../bath/coverage";
import type { Ref } from "react";
import type { WaterSource } from "../world/scenery";

export function WaterIcon({ source }: { source: WaterSource }) {
  if (source === "shower") return <g data-water-tool="shower">
    <path d="M14 24q5-11 13-7-1 8-13 7Z" fill="#88a6a1" /><path d="M11 25q12 4 18-3" fill="none" stroke="#c9ded2" strokeWidth="2" strokeLinecap="round" />
  </g>;
  return <g data-water-tool={source} transform="translate(20 20)">
    {source === "can" ? <g transform="translate(-23 -23) rotate(23)">
      <path d="M-9 2q-8-9-11-4-4 7 10 9" fill="none" stroke="#849f91" strokeWidth="2.9" strokeLinecap="round" />
      <path d="M-13 0H4l-2 10h-13Z" fill="#91aba4" /><path d="M-11-1q7-5 14 0" fill="none" stroke="#d2d5b8" strokeWidth="2" strokeLinecap="round" />
      <path d="M3 7 15 4" stroke="#829e91" strokeWidth="3.8" strokeLinecap="round" /><path d="M15 1l4 2v4l-4 1Z" fill="#cfceb0" />
    </g> : <g transform="translate(-16 -16) rotate(16)">
      <path d="M-4-2-16-5" stroke="#a57960" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M-8-3q8-3 15 0L4 4q-6 4-10-1Z" fill="#b48362" />
      <ellipse cy="-3" rx="7.6" ry="2.2" fill="#d2ab85" /><ellipse cy="-2.9" rx="5.4" ry="1.2" fill="#acd0c3" />
    </g>}
  </g>;
}

export function WaterStream({ source, radius, streamRef }: { source: WaterSource; radius: number; streamRef: Ref<SVGElement> }) {
  if (source === "shower") return <rect ref={streamRef as Ref<SVGRectElement>} className="bath-shower" data-water-stream={source} data-visible="false"
    x={-radius} y={0} width={radius * 2} height={LH} rx={radius * .72} />;
  const can = source === "can";
  return <g ref={streamRef as Ref<SVGGElement>} className="bath-pour" data-water-stream={source} data-visible="false">
    <g transform={`scale(${radius / 20})`} fill="none" strokeLinecap="round">
      <path d={can ? "M-9-13Q-4-9 0 0" : "M-8-12Q-5-6 0 0"} stroke="var(--water)" strokeWidth={can ? 6 : 8} />
      <path d={can ? "M-10-12q3 4 4 9m-1-9q6 3 7 10" : "M-9-12q3 5 6 8m-3-9q2 4 6 8"} stroke="#d8eadf" strokeWidth="1.55" opacity=".96" />
    </g>
  </g>;
}