// Źródło: child-train@b881e09:src/components/illustration/Scenery.tsx (rekwizyty krajobrazowe).
// Kształty pozostają w jednostkach źródłowych; skala i pozycje należą do nowych scen.
export function Pine({
  x,
  y,
  scale = 1,
  color = "#648a71",
}: {
  x: number;
  y: number;
  scale?: number;
  color?: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path
        d="M0-125v130"
        stroke="#777c58"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="m0-155-35 59h17l-32 50h23L-63 9Q0 26 63 9L27-46h23L18-96h17Z"
        fill={color}
      />
      <path
        d="M0-119V5m0-66 20 21M0-27l-24-19M0-79l-16-16"
        stroke="#f1f0d8"
        strokeWidth="2"
        strokeLinecap="round"
        opacity=".22"
      />
    </g>
  );
}

export function Tree({
  x,
  y,
  scale = 1,
  color = "#8da982",
  variant = 0,
}: {
  x: number;
  y: number;
  scale?: number;
  color?: string;
  variant?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {variant === 0 ? (
        <path
          d="M-3-160c-43-9-76 21-66 54-35 27-20 74 18 78C-22 0 27-5 39-26 86-19 102-69 73-92c12-40-28-75-76-68Z"
          fill={color}
        />
      ) : (
        <path
          d="M0-187c-32 0-60 69-65 112-9 62 16 78 65 77s77-19 65-77C55-122 33-187 0-187Z"
          fill={color}
        />
      )}
      <path
        d="M0-112V7m0-48-28-30M0-65l28-25M0-19l21-23"
        stroke="#738064"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="m-40-104 8-9m72 43 8-9m-52-62 8-9"
        stroke="#eef0d7"
        strokeWidth="3"
        strokeLinecap="round"
        opacity=".35"
      />
    </g>
  );
}

export function Sailboat({
  x,
  y,
  scale = 1,
}: {
  x: number;
  y: number;
  scale?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* Boat hull */}
      <path d="M-35 0C-28 16 28 16 35 0Z" fill="#ba8063" />
      <path d="M-33 0h66" stroke="#94624a" strokeWidth="2.5" />
      {/* Mast & Sails */}
      <path
        d="M0 0V-48"
        stroke="#715b49"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M2-44L28-8H2Z" fill="#f7f2dc" />
      <path d="M-2-40L-22-10H-2Z" fill="#dfbe97" />
      {/* Water ripple */}
      <ellipse cx="0" cy="8" rx="42" ry="4" fill="#a8c7c9" opacity=".5" />
    </g>
  );
}

export function Cottage({
  x,
  y,
  scale = 1,
  color = "#e4c6a0",
}: {
  x: number;
  y: number;
  scale?: number;
  color?: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x="-57" y="-77" width="114" height="77" rx="2" fill={color} />
      <path d="M-70-75 0-133 70-75Z" fill="#b78268" />
      <path d="M33-109v-32h13v42" fill="#b78268" />
      <path
        d="M-66-75H65"
        stroke="#976e59"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path d="M-11 0v-43a11 11 0 0 1 22 0V0" fill="#9ca38a" />
      {[-36, 34].map((wx) => (
        <g key={wx}>
          <rect
            x={wx - 10}
            y="-55"
            width="20"
            height="24"
            rx="2"
            fill="var(--window, #f7e8bb)"
          />
          <path d={`M${wx}-55v24m-10-12h20`} stroke="#b5ac8c" strokeWidth="2" />
        </g>
      ))}
      <path
        d="M-63 0H63"
        stroke="#b8b896"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </g>
  );
}

/** Low fruit tree with a seasonal crown and a few hanging fruits. */
export function FruitTree({
  x,
  y,
  scale = 1,
  fruit = "#d98a72",
}: {
  x: number;
  y: number;
  scale?: number;
  fruit?: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path
        d="M0-72v76"
        stroke="#8a6b4d"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M0-46l-22-20M0-38l24-18"
        stroke="#8a6b4d"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M0-132c-34 0-56 22-56 46s22 42 56 42 56-18 56-42-22-46-56-46Z"
        fill="var(--foliage-a, #93ab7c)"
      />
      <path
        d="M-20-118c-18 2-28 16-26 30 14 6 30-2 32-16-1-8-3-13-6-14Z"
        fill="var(--foliage-b, #a8bd8c)"
        opacity=".75"
      />
      {/* Fruits */}
      {[
        [-30, -96],
        [12, -104],
        [34, -84],
        [-8, -76],
        [22, -62],
      ].map(([fx, fy]) => (
        <g key={`${fx}-${fy}`}>
          <circle cx={fx} cy={fy} r="6" fill={fruit} />
          <circle cx={fx - 2} cy={fy - 2} r="1.6" fill="#fff" opacity=".45" />
        </g>
      ))}
    </g>
  );
}

/** One lavender bush: a mound of leaves with upright purple spikes. */
export function LavenderBush({
  x,
  y,
  scale = 1,
}: {
  x: number;
  y: number;
  scale?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M-26 0q4-16 26-16t26 16Z" fill="var(--foliage-b, #9aa87f)" />
      {/* One spike = stem + head. The pale highlight was dropped to keep this
          the heaviest scene under a sane node budget. */}
      {[-20, -12, -4, 4, 12, 20].map((sx, i) => (
        <g key={sx}>
          <path
            d={`M${sx}-8v-${26 + (i % 3) * 9}`}
            stroke="#7f8c68"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <ellipse
            cx={sx}
            cy={-16 - (26 + (i % 3) * 9)}
            rx="4.2"
            ry={11 + (i % 3) * 3}
            fill={i % 2 ? "#9d8bc0" : "#8a7bb4"}
          />
        </g>
      ))}
    </g>
  );
}

export function Jetty({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M0 0h120v9H0Z" fill="#a5805c" />
      <path
        d="M4 9v34M112 9v34"
        stroke="#8a6a4a"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path d="M0 0h120" stroke="#c6a37c" strokeWidth="3" />
      <path d="M18 4h84" stroke="#8f6d4c" strokeWidth="2" opacity=".6" />
      {/* Mooring post and rope */}
      <path
        d="M126 2v-26"
        stroke="#8a6a4a"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M126-22q-16 8-30 20"
        stroke="#cbb894"
        strokeWidth="2.5"
        fill="none"
      />
    </g>
  );
}

