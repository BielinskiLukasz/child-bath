import { LavenderBush, Tree } from "./landscapeProps";

export function LavenderSpa() {
  return <>
    <path d="M0 462q216-172 494-71 192 66 381-17 216-100 397 3 128 65 328 11v612H0Z" fill="var(--hill-far)" />
    <path d="M0 573q335-182 666-47 231 61 452-53 233-107 482 1v526H0Z" fill="#b8adc4" opacity=".72" />
    <Tree x={420} y={578} scale={1.3} color="var(--foliage-b)" variant={1} />
    <Tree x={1216} y={595} scale={1.45} color="var(--foliage-a)" />
    <path d="M0 541h408v18l82 15v127H0zm1600 0h-407v18l-82 16v126h489Z" fill="#b5958d" />
    <path d="M0 531h408l82 40v19l-82-26H0zm1600 0h-407l-82 40v19l82-26h407Z" fill="#d8beb0" />
    <path d="M0 639q333-62 664 34 397-98 936-35v362H0Z" fill="#d2b69f" />
    <path d="M535 1000q60-221 267-319 204 83 268 319Z" fill="#ead1b6" />
    <path d="M685 796h225m-270 45h320m-365 58h417m-430 64h475" fill="none" stroke="#dbc0a8" strokeWidth="3" />
    <path d="M236 839q108-113 320-67 69 22 90 76-198 60-410-9Zm1124-18q-130-110-313-44-27 10-44 64 191 73 357-20Z" fill="#b695a5" opacity=".7" />
    {[[403,816,1.26],[491,842,1.45],[544,776,1.04],[1112,785,1.14],[1178,829,1.45],[1247,769,1.14],[468,960,1.7],[1145,974,1.6]].map(([x,y,s]) => <LavenderBush key={x} x={x} y={y} scale={s} />)}
    <path d="M376 696Q800 827 1219 696" fill="none" stroke="#907b74" strokeWidth="3" opacity=".72" />
    {[461,586,716,852,991,1124].map((x) => {
      const y = 774 - ((x - 800) / 75) ** 2 * 2.65;
      return <g key={x} transform={`translate(${x} ${y})`}>
        <circle cy="2" r="36" fill="var(--lamp)" className="spa-lantern-glow" />
        <path d="M-13-2Q-17-18 0-18T13-2l-4 15H-9Z" fill="var(--window)" />
        <path d="M-11-11h22M-9 14H9" stroke="#a88874" strokeWidth="3" strokeLinecap="round" />
      </g>;
    })}
  </>;
}