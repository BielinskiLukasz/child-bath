import { Pine, Tree } from "./landscapeProps";

export function Fern({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M0 3q-14-33-44-55m44 56Q6-33 0-65m0 70q13-36 43-50" fill="none" stroke="var(--pine-a)" strokeWidth="3.6" strokeLinecap="round" />
    <path d="M-3-9Q-35-9-35-24q17 0 32 15m-9-18q-30-2-32-15 19 3 32 15m12 8q-22-15-18-27Q-4-41 0-19m1-14q10-24 18-19Q23-38 1-33m4 17q19-18 34-12Q30-14 5-16m14-18q16-18 32-13-11 14-32 13Z" fill="var(--foliage-a)" />
  </g>;
}

export function ForestSpring() {
  return <>
    <path d="M0 457Q276 350 587 444q240-100 536-48 261 79 477-9v613H0Z" fill="var(--hill-far)" />
    {[70,180,290,401,493,633,737,874,1021,1150,1280,1432,1551].map((x,i) =>
      <Pine key={x} x={x} y={565 + (i % 4) * 23} scale={1.05 + (i % 3) * 0.27} color={i % 2 ? "var(--pine-a)" : "var(--pine-b)"} />
    )}
    <path d="M0 626q297-151 551-25 222 77 436-31 257-116 613 48v382H0Z" fill="var(--hill-near)" />
    <Pine x={347} y={677} scale={3.12} color="var(--pine-a)" />
    <Pine x={481} y={686} scale={2.18} color="var(--pine-b)" />
    <Tree x={1185} y={717} scale={2.25} color="var(--foliage-b)" />
    <Pine x={1326} y={691} scale={3} color="var(--pine-a)" />
    <path d="M0 790q247-154 554-36 220-71 433-10 313-115 613 11v245H0Z" fill="var(--foliage-a)" />
    <path d="M0 717q342 64 553 34 227-35 391 33 242 91 656-42v181q-505 87-664-19-160-109-380-57Q314 938 0 836Z" fill="#9bbcba" />
    <path d="M0 761q300 95 570 27 183-44 347 32 239 113 683-38m-922 21q121-18 216 28m249 43q169 12 315-33" fill="none" stroke="#d0e1d4" strokeWidth="6" strokeLinecap="round" opacity=".79" />
    {[[422,798,1],[521,842,1.2],[668,831,.8],[947,902,.86],[1080,871,1.18],[1144,773,1.1]].map(([x,y,s]) => <g key={x} transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-41 8q6-29 30-36 28-9 52 23 13 17-15 23-47 10-67-10Z" fill="#a8aa99" />
      <path d="M-38-1q11-29 38-29 18 2 29 17-29 1-67 12Z" fill="var(--foliage-b)" />
    </g>)}
    <Fern x={363} y={943} scale={1.67} /><Fern x={1202} y={960} scale={1.84} /><Fern x={1086} y={934} scale={1.2} /><Fern x={536} y={972} scale={1.45} />
  </>;
}