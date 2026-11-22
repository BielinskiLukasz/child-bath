import { memo, useImperativeHandle, useRef, type Ref } from "react";
import { LH, LW } from "../bath/coverage";
import type { StepKind } from "../bath/steps";
import type { WaterSource } from "../world/scenery";
import { WaterIcon, WaterStream } from "./WaterTool";

// Dziesięć palców i ewentualny kursor myszy. Pula nie rośnie podczas przeciągania.
const SLOTS = Array.from({ length: 11 }, (_, index) => index);

export interface ToolCursorHandle {
  move(id: number, x: number, y: number, pressed: boolean): void;
  end(id: number): void;
  reset(): void;
}

function ToolIcon({ tool, water }: { tool: StepKind; water: WaterSource }) {
  if (tool === "rinse") return <WaterIcon source={water} />;
  if (tool === "dry" || tool === "groom") return (
    <>
      <rect x={5} y={8} width={30} height={24} rx={6} fill="#d4a38c" />
      <rect x={5} y={25} width={30} height={4} fill="#dfbc70" />
    </>
  );
  return (
    <>
      <rect x={4} y={9} width={32} height={22} rx={8} fill="#f7f2b5" />
      <circle cx={13} cy={17} r={2.4} fill="#dfbc70" />
      <circle cx={24} cy={23} r={3} fill="#dfbc70" />
      <circle cx={28} cy={15} r={1.8} fill="#dfbc70" />
    </>
  );
}

/** Narzędzia i strumienie używają tej samej przestrzeni logicznej co maska i canvas. */
export const ToolCursor = memo(function ToolCursor({ ref, tool, radius, water }: { ref: Ref<ToolCursorHandle>; tool: StepKind; radius: number; water: WaterSource }) {
  const cursors = useRef<(SVGGElement | null)[]>([]);
  const streams = useRef<(SVGElement | null)[]>([]);

  useImperativeHandle(ref, () => {
    for (const cursor of cursors.current) cursor?.setAttribute("data-visible", "false");
    for (const stream of streams.current) stream?.setAttribute("data-visible", "false");
    const active = new Map<number, number>();
    const free = [...SLOTS];
    const end = (id: number) => {
      const slot = active.get(id);
      if (slot === undefined) return;
      active.delete(id);
      free.push(slot);
      cursors.current[slot]?.setAttribute("data-visible", "false");
      streams.current[slot]?.setAttribute("data-visible", "false");
    };
    return {
      move(id, x, y, pressed) {
        let slot = active.get(id);
        if (slot === undefined) {
          slot = free.shift();
          if (slot === undefined) return;
          active.set(id, slot);
        }
        const cursor = cursors.current[slot];
        const stream = streams.current[slot];
        if (!cursor) return;
        cursor.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
        cursor.setAttribute("data-visible", "true");
        cursor.setAttribute("data-keyboard", String(id === -1));
        if (pressed && stream) {
          const scale = Math.max(0, Math.min(1, y / LH));
          stream.style.transform = water === "shower" ? `translateX(${x.toFixed(2)}px) scaleY(${scale})` : `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
          stream.setAttribute("data-visible", "true");
        } else {
          stream?.setAttribute("data-visible", "false");
        }
      },
      end,
      reset() { for (const id of active.keys()) end(id); },
    };
  }, [water, tool]);

  return (
    <svg className="bath-tools" viewBox={`0 0 ${LW} ${LH}`} preserveAspectRatio="none" data-tool={tool} data-water-source={tool === "rinse" ? water : undefined} aria-hidden="true" focusable="false">
      {tool === "rinse" && SLOTS.map((i) => (
        <WaterStream key={`${water}-${i}`} source={water} radius={radius} streamRef={(node) => { streams.current[i] = node; }} />
      ))}
      {SLOTS.map((i) => (
        <g key={i} className="tool-cursor" data-visible="false" ref={(node) => { cursors.current[i] = node; }}>
          <svg className={tool === "rinse" ? "water-icon" : undefined} x={-radius} y={-radius} width={radius * 2} height={radius * 2} viewBox="0 0 40 40">
            <circle cx={20} cy={20} r={20} className="tool-footprint" />
            <circle cx={20} cy={20} r={19.4} className="tool-rim" />
            <ToolIcon tool={tool} water={water} />
          </svg>
        </g>
      ))}
    </svg>
  );
});
