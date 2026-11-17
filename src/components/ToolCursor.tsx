import type { Ref } from "react";
import type { StepKind } from "../bath/steps";

/** Robocze, płaskie narzędzia z Fazy 2 (wypełnienia bez konturów); Faza 6 dodaje źródła wody scenerii. */
const SPONGE = (
  <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">
    <rect x={4} y={9} width={32} height={22} rx={8} fill="#f7f2b5" />
    <circle cx={13} cy={17} r={2.4} fill="#dfbc70" />
    <circle cx={24} cy={23} r={3} fill="#dfbc70" />
    <circle cx={28} cy={15} r={1.8} fill="#dfbc70" />
  </svg>
);

const SPLASH = (
  <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">
    <circle cx={20} cy={20} r={17} fill="#a6c8c7" fillOpacity={0.35} />
    <circle cx={20} cy={20} r={9} fill="#c0d4cf" fillOpacity={0.6} />
  </svg>
);

const TOWEL = (
  <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">
    <rect x={5} y={8} width={30} height={24} rx={6} fill="#d4a38c" />
    <rect x={5} y={25} width={30} height={4} fill="#dfbc70" />
  </svg>
);

function iconFor(tool: StepKind) {
  if (tool === "dry" || tool === "groom") return TOWEL;
  if (tool === "rinse") return SPLASH;
  return SPONGE;
}

/** Narzędzie pod palcem. Położenie (transform) i widoczność (data-visible) ustawia BathStage. */
export function ToolCursor({ ref, tool, size }: { ref: Ref<HTMLDivElement>; tool: StepKind; size: number }) {
  return (
    <div ref={ref} className="tool-cursor" data-tool={tool} data-visible="false" style={{ width: size, height: size }} aria-hidden="true">
      {iconFor(tool)}
    </div>
  );
}
