import { FruitTree, Tree } from "./landscapeProps";

const flowers = [[221,788,1.1],[379,714,.87],[449,735,.96],[514,675,.85],[563,798,1.22],[362,871,1.52],[1020,699,.81],[1080,753,1.1],[1178,775,1.38],[1251,718,.91],[1322,827,1.35],[1479,744,1.58]] as const;

export function Garden() {
  return <>
    <path d="M0 499Q230 337 553 432q243 77 482-61 241-116 565 34v370H0Z" fill="var(--hill-far)" />
    <path d="M0 556q207-59 439-9 333 73 567-50 291-116 594-1v504H0Z" fill="var(--hill-near)" />
    <Tree x={219} y={553} scale={1.6} color="var(--foliage-b)" />
    <FruitTree x={533} y={611} scale={1.49} fruit="var(--blossom)" />
    <Tree x={1068} y={562} scale={1.25} color="var(--foliage-a)" variant={1} />
    <FruitTree x={1253} y={609} scale={1.72} />
    <path d="M0 664q320-100 703 16 345-71 897-61v381H0Z" fill="var(--foliage-a)" />
    <g fill="#ecdbb4">
      <path d="M0 560h1600v15H0zM0 614h1600v12H0z" />
      {Array.from({ length: 27 }, (_, i) => {
        const x = i * 61;
        return <path key={x} d={`M${x} 647V543l13-19 13 19v104Z`} fill={i % 3 ? "#e9d9b5" : "#f2e6c8"} />;
      })}
    </g>
    <path d="M622 1000c8-91 52-191 123-260 55-48 146-54 213-8 66 52 60 157 213 268Z" fill="#e5ca9c" />
    <path d="M729 1000q22-114 122-209-94 81-96 209Z" fill="#f0d9ad" opacity=".74" />
    <path d="M0 894q166-104 408-24 107 32 223 94l-8 36H0Zm1600-47q-207-61-411 46-78 41-104 107h515Z" fill="var(--foliage-b)" opacity=".82" />
    {flowers.map(([x,y,s], i) => <g key={x} transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0v-43m0 31q-22 0-24-14 16 0 24 14m0-6q20-14 24-7-5 13-24 7Z" fill="var(--foliage-b)" stroke="var(--foliage-b)" strokeWidth="3" />
      <path d="M0-40q-20 2-17-10 2-8 11-7-1-14 8-14 11 1 9 13 12 0 11 9-2 9-22 9Z" fill={i % 4 ? "var(--blossom)" : "#f4e6b3"} />
      <circle cx="1" cy="-51" r="5" fill="#c4a575" />
    </g>)}
  </>;
}