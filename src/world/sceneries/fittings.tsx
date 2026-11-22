import type { Rect, Size, WorldGeometry } from "../layout";
import type { BenchStyle, Portal, SceneryDef, TubStyle, WaterSource } from "../scenery";
import { WindowView } from "../../components/illustration/WindowView";
import { WallClock } from "../../components/illustration/WallClock";
import { Fern } from "./forest-spring";

function transform(rect: Rect, w: number, h: number) {
  return `translate(${rect.x} ${rect.y}) scale(${rect.width / w} ${rect.height / h})`;
}

export function PortalArt({ kind, rect }: { kind: Portal; rect: Rect }) {
  return <g data-preview-place={kind} transform={transform(rect, 100, 132)}>
    <ellipse cx="50" cy="124" rx="48" ry="8" fill="#72644b" opacity=".19" />
    {kind === "door" ? <>
      <path d="M9 121V49a41 41 0 0 1 82 0v72Z" fill="#a77f63" />
      <path d="M16 121V49a34 34 0 0 1 68 0v72Z" fill="#546456" />
      <path d="M16 50q0-25 24-32v103H16Z" fill="#899e8c" />
      <path d="M22 65h14m-14 41h14" stroke="#aabea7" opacity=".72" strokeWidth="3" strokeLinecap="round" />
      <circle cx="33" cy="77" r="3.2" fill="#edd297" />
    </> : kind === "gate" ? <>
      <path d="M10 121V38q0-6 5-7 6 0 6 7v83zm70 0V38q0-6 5-7 6 0 6 7v83z" fill="#a28968" />
      <path d="M19 49q30-23 63 0v72H19Z" fill="#ad8666" />
      <path d="M23 50l13-7v77H23Zm16-9 12-2v81H39Zm15 0 12 4v75H54Zm15 5 10 5v69H69Z" fill="#dec6a1" />
      <path d="M21 100h59M22 65h57" stroke="#b59777" strokeWidth="5" />
      <circle cx="70" cy="82" r="3.3" fill="#806650" />
    </> : kind === "arch" ? <>
      <path d="M7 121V51a43 43 0 0 1 86 0v70Z" fill="#b79382" />
      <path d="M16 121V51a34 35 0 0 1 68 0v70Z" fill="#817984" />
      <path d="M10 70h11m58 14h12M26 23l8 8m29-15-5 10m19 12 8-5" stroke="#d8bdaa" strokeWidth="4" strokeLinecap="round" />
      <path d="M10 118q1-39 14-49M90 119q-1-34-13-48" stroke="#a1946f" strokeWidth="3" fill="none" />
    </> : <>
      <path d="M9 121q23-9 23-29 3-25 18-38 15 15 18 38 3 18 24 29Z" fill={kind === "reeds" ? "#d7b18a" : "#ddd0a8"} />
      <path d="M19 121q16-10 19-26m29-1q2 19 16 26" fill="none" stroke="#f0deba" strokeWidth="3" strokeLinecap="round" />
      {kind === "ferns" ? <><Fern x={22} y={118} scale={.48} /><Fern x={78} y={118} scale={.51} /></> : kind === "reeds" ? <>
        <path d="M17 118V71m9 42V58m54 60V70m-7 42V53" stroke="#829672" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M17 78V65m9-2V50m54 26V63m-7-3V46" stroke="#9d775c" strokeWidth="6" strokeLinecap="round" />
      </> : <>
        <path d="M4 117q3-14 17-17 9 2 13 16-16 7-30 1Zm62 2q3-20 17-24 11 0 15 22-15 7-32 2Z" fill="#a5a598" />
        <path d="M11 100q4-10 12-10 7 0 10 10-10 5-22 0Zm62-6q4-13 14-13 10 0 9 12-9 5-23 1Z" fill="#c4c3b2" />
      </>}
    </>}
    <path d="M8 121h84q4 0 4 4t-4 4H8q-4 0-4-4t4-4Z" fill={kind === "door" || kind === "gate" ? "#b18b6d" : "#c6ad8c"} />
  </g>;
}

export function BenchArt({ geometry, style }: { geometry: WorldGeometry; style: BenchStyle }) {
  const { bench, seats } = geometry;
  const wood = style === "stone" ? "#b4aaa1" : style === "log" ? "#ab8063" : style === "plank" ? "#b68e70" : "#ad8165";
  const light = style === "stone" ? "#d3c7ba" : "#d3a87f";
  return <g data-bench="true">
    <g transform={transform(bench, 198, 62)}>
      <ellipse cx="99" cy="56" rx="94" ry="5" fill="#79694f" opacity=".18" />
      {style === "log" ? <>
        <rect x="10" y="26" width="178" height="28" rx="12" fill={wood} />
        <ellipse cx="183" cy="40" rx="12" ry="14" fill="#c69773" />
        <ellipse cx="185" cy="40" rx="5" ry="8" fill="#ab8063" />
      </> : <>
        <path d="M20 35h20l-5 20H19Zm138 0h20l3 20h-18Z" fill={wood} />
        {style === "wood" && <>
          <path d="M14 28V10Q14 5 19 5h160q5 0 5 5v18Z" fill={light} />
          <path d="M26 11h145" stroke="#e5bc92" strokeWidth="2" strokeLinecap="round" />
        </>}
        <rect x="8" y="26" width="182" height="16" rx={style === "stone" ? 8 : 5} fill={wood} />
      </>}
      <path d="M10 24q89-6 178 0l5 7q1 6-7 6H12q-8 0-7-6Z" fill={light} />
      <path d="M19 29q81-4 160 0" stroke="#f0d0ac" strokeWidth="2" opacity=".56" fill="none" strokeLinecap="round" />
    </g>
    {seats.map((seat, i) => <ellipse key={i} data-bench-seat={i + 1} cx={seat.x} cy={seat.y} rx={seat.size / 2} ry={seat.size * 0.14} fill={wood} opacity=".3" />)}
  </g>;
}

const TUB_COLORS: Record<TubStyle, [string, string, string]> = {
  porcelain: ["#f7ead3", "#e9d5b9", "#9b826b"], wood: ["#ba8d68", "#a87755", "#87634f"],
  stone: ["#b2b5a6", "#93988d", "#7c8377"], copper: ["#c59677", "#ad7d64", "#88614f"],
  lavender: ["#c9b6cf", "#b29dbb", "#8f7995"],
};

export function TubArt({ rect, style, steam }: { rect: Rect; style: TubStyle; steam?: boolean }) {
  const [body, lower, trim] = TUB_COLORS[style];
  return <g data-scene-tub={style} transform={transform(rect, 420, 142)}>
    <ellipse cx="210" cy="132" rx="185" ry="9" fill="#7f6b50" opacity=".19" />
    <ellipse cx="210" cy="31" rx="193" ry="29" fill={trim} />
    <ellipse cx="210" cy="30" rx="176" ry="20" fill="var(--water)" />
    <path d="M48 31q36-12 91-11m106 4q61 2 99 10m-178-2q14-5 29-1" stroke="#d2e1cd" strokeWidth="3.7" opacity=".85" fill="none" strokeLinecap="round" />
    <path d="M81 111h37l-10 20q-17 6-30-1Zm220 0h38l3 19q-13 7-31 1Z" fill={trim} />
    <path d="M25 37q6 31 24 58 13 20 45 24 116 17 236 0 30-5 42-25 18-26 23-57Z" fill={body} />
    <path d="M48 91q127 24 325 0-15 25-45 29-121 16-233 0-31-5-47-29Z" fill={lower} />
    {style === "wood" && <path d="M54 46l26 65m26-60 17 71m37-69 8 74m40-73v74m44-75-10 74m46-76-19 71m48-74-27 66" stroke="#966b52" strokeWidth="3.8" opacity=".53" />}
    <path d="M22 32q188 33 376 0 8-1 7 8-2 10-11 11-184 32-368 0-10-2-11-11-1-8 7-8Z" fill={style === "porcelain" ? "#fff2de" : trim} />
    <path d="M70 46q93 17 183 13m32-3 56-8" stroke="#f9ebd4" strokeWidth="2.7" fill="none" strokeLinecap="round" opacity=".48" />
    <g fill="var(--foam)" opacity=".94">
      <path d="M32 34q-7-10 5-15 1-11 13-11 10 0 13 8 16-8 21 6 19 2 20 17Z" />
      <path d="M300 43q-1-10 17-12 1-12 15-12 9 1 14 6 17-13 29-5 6 3 7 9 15 0 14 10Z" />
    </g>
    {steam && <g fill="none" stroke="#f8efe0" strokeWidth="7" strokeLinecap="round" className="world-steam">
      <path d="M127 11q-20-18-1-36 13-14 1-29" /><path d="M204 5q-24-18-4-36 14-16 0-29" /><path d="M281 12q-20-19 0-36 17-16 0-32" />
    </g>}
  </g>;
}

function WaterFixture({ rect, source }: { rect: Rect; source: WaterSource }) {
  const scale = Math.min(rect.width / 300, rect.height / 103);
  const x = rect.x + rect.width * .93;
  const y = rect.y + 11 * scale;
  return <g transform={`translate(${x} ${y}) scale(${scale})`} data-water-fixture={source}>
    {source === "shower" ? <>
      <path d="M14 39V-64q0-24-22-24h-43" fill="none" stroke="#93a6a2" strokeWidth="8" strokeLinecap="round" />
      <path d="M-71-83q8-17 26-11l13 10-8 6Z" fill="#8eaaa6" /><path d="M-72-81l33 6" stroke="#c2cebf" strokeWidth="4" strokeLinecap="round" />
      <path d="M4-18h22" stroke="#c6a884" strokeWidth="6" strokeLinecap="round" />
    </> : source === "can" ? <>
      <path d="M2 5h37q8 0 8 8v18q0 8-8 8H3q-8 0-8-8V14Q-5 5 2 5Z" fill="#8da7a0" />
      <path d="M40 11q19-12 20 7 0 11-15 13M-4 30-26 17" stroke="#79958b" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M-28 12l9 8-6 6-9-6Z" fill="#c6c4a2" /><path d="M9 6V1q13-8 23 0v5" fill="none" stroke="#778e82" strokeWidth="3" />
    </> : <>
      <path d="M20 15 53-3" stroke="#9f765b" strokeWidth="6" strokeLinecap="round" />
      <path d="M-14 13q14-8 37 0l-3 13q-12 11-27 4Z" fill="#ba8d68" />
      <ellipse cx="4" cy="13" rx="18" ry="5" fill="#e0b88a" /><ellipse cx="4" cy="13.5" rx="13" ry="2.7" fill="#a3bdb5" />
    </>}
  </g>;
}

export function SceneFittings({ def, scene, geometry }: { def: SceneryDef; scene: Size; geometry: WorldGeometry }) {
  const { width, height } = scene;
  const windowScale = Math.min(width * 0.43 / 190, height * 0.69 / 143, 1.52);
  const windowW = windowScale * 190;
  const windowX = width * 0.41 - windowW / 2;
  const clockSize = Math.min(56, width * 0.125, height * .22);
  return <>
    {def.indoor && <>
      <WindowView x={windowX} y={height * 0.085} scale={windowScale} />
      <WallClock x={width * 0.78} y={height * 0.214} diameter={clockSize} />
    </>}
    {def.id === "jetty" && <>
      <g transform={transform(geometry.door, 100, 132)}>
        <path d="M20 111h8v18h-8Zm54 0h8v18h-8Z" fill="#917761" />
        <path d="M10 105h79l8 14H3Z" fill="#bc9673" /><path d="M17 111h72" stroke="#dcb591" strokeWidth="3" />
      </g>
      <g transform={transform(geometry.bench, 198, 62)}>
        <path d="M25 39h8v22h-8Zm137 1h8v21h-8Z" fill="#92725e" />
        <path d="M9 46h175l12 12H0Z" fill="#bb9777" /><path d="M9 53h179" stroke="#e0bb94" strokeWidth="4" />
      </g>
    </>}
    <PortalArt kind={def.portal} rect={geometry.door} />
    <WaterFixture rect={geometry.tub} source={def.water} />
    <TubArt rect={geometry.tub} style={def.tub} steam={def.steam} />
    <BenchArt geometry={geometry} style={def.benchStyle} />
  </>;
}
