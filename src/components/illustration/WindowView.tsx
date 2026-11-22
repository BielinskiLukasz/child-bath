import { memo, useId } from "react";
import { SkyPlate, WeatherEffects } from "../Atmosphere";
import { Pine } from "../../world/sceneries/landscapeProps";

export const WindowView = memo(function WindowView({ x, y, scale }: { x: number; y: number; scale: number }) {
  const clip = useId();
  const pane = "M13 127V66a82 58 0 0 1 164 0v61Z";
  return <g data-window-view="true" transform={`translate(${x} ${y}) scale(${scale})`}>
    <defs><clipPath id={clip}><path d={pane} /></clipPath></defs>
    <path d="M1 135V66a94 66 0 0 1 188 0v69Z" fill="#9c785f" />
    <path d="M6 131V66a89 61 0 0 1 178 0v65Z" fill="#dac0a0" />
    <g clipPath={`url(#${clip})`}>
      <svg x="13" y="7" width="164" height="120" viewBox="0 0 1600 880" preserveAspectRatio="xMidYMin slice">
        <SkyPlate />
        <path d="M0 545q375-190 740-20 275 116 860-62v520H0Z" fill="var(--hill-far)" />
        <path d="M0 670q292-80 593-44 461 130 1007-42v416H0Z" fill="var(--hill-near)" />
        <Pine x={379} y={706} scale={2.02} color="var(--pine-b)" />
        <Pine x={1180} y={682} scale={1.93} color="var(--pine-a)" />
        <WeatherEffects />
      </svg>
      <path d="M95 4v135M8 72h178" fill="none" stroke="#ead5b3" strokeWidth="6" />
      <path d="M31 58l26-25m-16 28 33-30" fill="none" stroke="#f8edd9" strokeWidth="2" opacity=".31" strokeLinecap="round" />
    </g>
    <rect x="-3" y="125" width="196" height="12" rx="4" fill="#f1dcba" />
    <rect x="4" y="136" width="182" height="7" rx="3" fill="#baa188" />
  </g>;
});