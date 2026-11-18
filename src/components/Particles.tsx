import { memo, useImperativeHandle, useRef, type Ref } from "react";
import { LH, LW } from "../bath/coverage";
import { particleView, type Particle } from "../bath/particles";
import { MAX_PARTICLES } from "../timing";

export interface ParticlesHandle {
  render(pool: readonly Particle[], reduced?: boolean): void;
}

/** Pula 28 kółek SVG. Po zainicjowaniu cząsteczki animujemy tylko transform i opacity. */
export const Particles = memo(function Particles({ ref }: { ref: Ref<ParticlesHandle> }) {
  const nodes = useRef<(SVGCircleElement | null)[]>([]);
  const variants = useRef<Particle["kind"][]>([]);
  const radii = useRef<number[]>([]);

  useImperativeHandle(ref, () => ({
    render(pool: readonly Particle[], reduced = false) {
      pool.forEach((particle, index) => {
        const node = nodes.current[index];
        if (!node) return;
        if (particle.age < 0) {
          if (node.style.opacity !== "0") node.style.opacity = "0";
          return;
        }
        if (radii.current[index] !== particle.r) {
          radii.current[index] = particle.r;
          node.setAttribute("r", particle.r.toFixed(1));
        }
        if (variants.current[index] !== particle.kind) {
          variants.current[index] = particle.kind;
          node.setAttribute("class", `bath-particle bath-particle--${particle.kind}`);
        }
        const view = particleView(particle, reduced);
        node.style.transform = `translate(${view.x.toFixed(1)}px, ${view.y.toFixed(1)}px)`;
        node.style.opacity = view.opacity.toFixed(3);
      });
    },
  }), []);

  return (
    <svg className="bath-particles" viewBox={`0 0 ${LW} ${LH}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
      {Array.from({ length: MAX_PARTICLES }, (_, index) => (
        <circle key={index} ref={(node) => { nodes.current[index] = node; }}
          className="bath-particle" cx={0} cy={0} r={0} style={{ opacity: 0 }} />
      ))}
    </svg>
  );
});
