import { SKETCH_SILHOUETTE, VIEWBOX, type SketchShape } from "./sketch";

function Shape({ shape, fill }: { shape: SketchShape; fill: string }) {
  return shape.kind === "circle" ? (
    <circle cx={shape.cx} cy={shape.cy} r={shape.r} fill={fill} />
  ) : (
    <ellipse cx={shape.cx} cy={shape.cy} rx={shape.rx} ry={shape.ry} fill={fill} />
  );
}

/**
 * Rysunek zwierzątka-szkicu w stylu wycinanki child-train: wypełnienia bez konturów,
 * wspólna twarz (oczy #3f4d40, nos #495043, policzki #cf9f89 przy kryciu 55%).
 */
export function SketchAnimal({ fur }: { fur: string }) {
  const [body, pawLeft, pawRight, earLeft, earRight, head] = SKETCH_SILHOUETTE;
  return (
    <svg
      className="sketch-animal"
      viewBox={`${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}`}
      aria-hidden="true"
      focusable="false"
    >
      <ellipse cx={0} cy={41} rx={22} ry={1.6} fill="#3f4d40" fillOpacity={0.08} />
      <Shape shape={body} fill={fur} />
      <ellipse cx={0} cy={26} rx={10.5} ry={7.5} fill="#f3dcc4" fillOpacity={0.75} />
      <Shape shape={pawLeft} fill={fur} />
      <Shape shape={pawRight} fill={fur} />
      <Shape shape={earLeft} fill={fur} />
      <Shape shape={earRight} fill={fur} />
      <circle cx={-13} cy={-13} r={3.2} fill="#f3dcc4" />
      <circle cx={13} cy={-13} r={3.2} fill="#f3dcc4" />
      <Shape shape={head} fill={fur} />
      <ellipse cx={0} cy={5} rx={6.5} ry={5} fill="#f3dcc4" />
      <circle cx={-6} cy={-3} r={2} fill="#3f4d40" />
      <circle cx={6} cy={-3} r={2} fill="#3f4d40" />
      <circle cx={-5.3} cy={-3.7} r={0.6} fill="#ffffff" />
      <circle cx={6.7} cy={-3.7} r={0.6} fill="#ffffff" />
      <ellipse cx={0} cy={3} rx={2.2} ry={1.6} fill="#495043" />
      <path d="M-2.6 6.4q2.6 2.2 5.2 0" fill="none" stroke="#495043" strokeWidth={1} strokeLinecap="round" />
      <circle cx={-10} cy={4} r={2.6} fill="#cf9f89" fillOpacity={0.55} />
      <circle cx={10} cy={4} r={2.6} fill="#cf9f89" fillOpacity={0.55} />
    </svg>
  );
}
