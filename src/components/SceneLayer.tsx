import { memo } from "react";
import { SkyPlate, WeatherEffects } from "./Atmosphere";
import { CompanionArt } from "../world/companions";
import { resolveLayout, type Rect, type Size } from "../world/layout";
import { SCENERIES } from "../world/sceneries";
import { SceneFittings } from "../world/sceneries/fittings";
import type { SceneRound } from "../hooks/useWorldClock";

const fadingStyle = { opacity: 0 };

const PaintedBackdrop = memo(function PaintedBackdrop({ scene }: { scene: SceneRound["id"] }) {
  const { Background, indoor } = SCENERIES[scene];
  return <svg className="world-backdrop" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
    {!indoor && <SkyPlate />}
    <Background />
    {!indoor && <WeatherEffects />}
  </svg>;
});

function Board({ round, size, box, current, blending }: { round: SceneRound; size: Size; box: Rect; current: boolean; blending: boolean }) {
  const scene = SCENERIES[round.id];
  const geometry = resolveLayout(size, box, size.height > size.width ? scene.layout.portrait : scene.layout.landscape);
  return <div className="world-board" data-layer-scenery={round.id} data-scene-role={current ? "current" : "outgoing"}
    style={current && blending ? fadingStyle : undefined}>
    <PaintedBackdrop scene={scene.id} />
    <svg className="world-props" viewBox={`0 0 ${size.width} ${size.height}`}>
      <SceneFittings def={scene} scene={size} geometry={geometry} />
    </svg>
    {round.companions.map((kind, i) => <CompanionArt key={kind} kind={kind} spot={geometry.companions[i]} />)}
  </div>;
}

export const SceneLayer = memo(function SceneLayer({ current, outgoing, size, box, fadeSeconds }: {
  current: SceneRound; outgoing?: SceneRound; size: Size; box: Rect; fadeSeconds: number;
}) {
  if (!size.width || !size.height) return null;
  return <div className="world-layer" data-blending={outgoing ? "true" : "false"} data-fade-seconds={fadeSeconds} aria-hidden="true">
    {outgoing && <Board key={outgoing.round} round={outgoing} size={size} box={box} current={false} blending={false} />}
    <Board key={current.round} round={current} size={size} box={box} current blending={Boolean(outgoing)} />
  </div>;
});