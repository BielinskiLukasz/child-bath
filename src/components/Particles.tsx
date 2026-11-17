import { useImperativeHandle, useRef, type Ref } from "react";
import { LH, LW } from "../bath/coverage";
import { particleView, type Particle } from "../bath/particles";
import { MAX_PARTICLES } from "../timing";

export interface ParticlesHandle {
  render(pool: readonly Particle[]): void;
}

/**
 * Pula 28 kółek SVG na bańki i krople. Ruch tylko przez transform i opacity, bez filtrów.
 * Węzły aktualizujemy bezpośrednio (bez renderowania Reacta w każdej klatce).
 */
export function Particles({ ref }: { ref: Ref<ParticlesHandle> }) {
  const nodes = useRef<(SVGCircleElement | null)[]>([]);

  useImperativeHandle(
    ref,
    () => ({
      render(pool: readonly Particle[]) {
        pool.forEach((particle, index) => {
          const node = nodes.current[index];
          if (!node) return;
          if (particle.age < 0) {
            if (node.style.opacity !== "0") node.style.opacity = "0";
            return;
          }
          const view = particleView(particle);
          node.setAttribute("r", particle.r.toFixed(1));
          node.setAttribute("class", `bath-particle bath-particle--${particle.kind}`);
          node.style.transform = `translate(${view.x.toFixed(1)}px, ${view.y.toFixed(1)}px)`;
          node.style.opacity = view.opacity.toFixed(3);
        });
      },
    }),
    [],
  );

  return (
    <svg
      className="bath-particles"
      viewBox={`0 0 ${LW} ${LH}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {Array.from({ length: MAX_PARTICLES }, (_, index) => (
        <circle
          key={index}
          ref={(node) => {
            nodes.current[index] = node;
          }}
          className="bath-particle"
          cx={0}
          cy={0}
          r={0}
          style={{ opacity: 0 }}
        />
      ))}
    </svg>
  );
}
