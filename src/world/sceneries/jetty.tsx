import { Cottage, Jetty as TinyJetty, Pine, Sailboat } from "./landscapeProps";

export function Jetty() {
  return <>
    <path d="M0 484q162-162 412-72 192 64 333 34 224-144 447-11 176-83 408-31v281H0Z" fill="var(--hill-far)" />
    <path d="M0 573q264-100 480-48 238 48 390 17 224-119 418-22 188 34 312-7v168H0Z" fill="var(--hill-near)" />
    <Cottage x={495} y={547} scale={.61} /><Pine x={447} y={558} scale={.74} color="var(--pine-a)" /><Pine x={903} y={563} scale={.68} color="var(--pine-b)" />
    <path d="M0 574q226-8 435 10 342 18 620-7 297-18 545 1v422H0Z" fill="#9ebfc0" />
    <path d="M0 574q226-8 435 10 342 18 620-7 297-18 545 1v29H0Z" fill="#c8d2b4" opacity=".53" />
    <g fill="none" stroke="#d4e1d6" strokeLinecap="round" opacity=".82">
      <path d="M155 638h265m183-19h109m293 48h248m-556 22h118m-759 70h241m895 16h229m-123 119h203M200 870h119" strokeWidth="5" />
      <path d="M341 655h123m668-23h121m-442 109h113m-415 43H360m947 31h152" strokeWidth="3" />
    </g>
    <Sailboat x={1043} y={655} scale={1.46} /><TinyJetty x={450} y={609} scale={.68} />
    <path d="M474 1000 663 704h268l229 296Z" fill="#ba9474" />
    <path d="M487 1000 671 712h252l223 288Z" fill="#d8b690" />
    <path d="M657 730h278m-299 34h326m-349 39h381m-406 46h442m-477 58h524m-566 68h626" fill="none" stroke="#ad8a6f" opacity=".66" strokeWidth="5" />
    <path d="M574 848q207 12 482 0m-546 128q285-17 628 0" fill="none" stroke="#efd0a8" opacity=".68" strokeWidth="5" />
    {[[393,862,1],[469,773,.72],[1171,882,1.21],[1116,769,.84]].map(([x,y,s]) => <g key={x} transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 5q-5-46-35-74 34 9 40 62 8-40 31-53-6 37-23 67Z" fill="var(--foliage-b)" />
      <path d="M-7-4v-91m22 94v-111" fill="none" stroke="#7f976f" strokeWidth="4" strokeLinecap="round" />
      <path d="M-7-82v-23m22 8v-26" fill="none" stroke="#97765c" strokeWidth="8" strokeLinecap="round" />
    </g>)}
  </>;
}