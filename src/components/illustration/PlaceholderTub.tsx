/**
 * Szkic łazienki z Fazy 1 (PHASE-01, plan 01-02) do oceny proporcji stref na telefonie:
 * ściana, pas kafelków, podłoga z desek, ręcznik na haczyku i wanna na nóżkach z pianą.
 *
 * Styl papierowej wycinanki z child-train: wypełnienia zamiast konturów, zaokrąglone kształty,
 * bez filtrów, rozmyć i cieni (jedynie bardzo delikatna elipsa pod wanną, jak pod pociągiem).
 * Kreska pojawia się tylko tam, gdzie jest samym przedmiotem (szwy desek).
 *
 * Płótno 1600 × 1000 jest zakotwiczone u dołu (xMidYMax slice): w pionie przycinamy boki,
 * w poziomie górę ściany, a wanna zawsze zostaje w kadrze. Zastąpią go scenerie z Fazy 6.
 */

type Circle = readonly [cx: number, cy: number, r: number];

const VIEW_WIDTH = 1600;
const VIEW_HEIGHT = 1000;

const TILE_SIZE = 92;
const TILE_GAP = 10;
const TILE_COLUMNS = 16;
const TILE_ROWS = 4;
const TILE_TOP = 478;

const TILES = Array.from({ length: TILE_COLUMNS * TILE_ROWS }, (_, index) => ({
  x: 8 + (index % TILE_COLUMNS) * (TILE_SIZE + TILE_GAP),
  y: TILE_TOP + Math.floor(index / TILE_COLUMNS) * (TILE_SIZE + TILE_GAP),
}));

/** Szwy desek podłogi: dwie długie linie i krótkie, przesunięte łączenia. */
const FLOOR_SEAMS: readonly string[] = [
  "M0 908H1600",
  "M0 958H1600",
  "M150 860V908",
  "M520 860V908",
  "M1080 860V908",
  "M1390 860V908",
  "M330 908V958",
  "M760 908V958",
  "M1200 908V958",
  "M90 958V1000",
  "M600 958V1000",
  "M1040 958V1000",
  "M1500 958V1000",
];

/** Piana nad brzegiem wanny. Niebieskawe bańki leżą głębiej, kremowe z przodu. */
const FOAM_DEEP: readonly Circle[] = [
  [738, 592, 36],
  [990, 597, 32],
];
const FOAM_FRONT: readonly Circle[] = [
  [612, 598, 32],
  [668, 582, 44],
  [800, 574, 52],
  [866, 589, 40],
  [932, 580, 46],
];
const FOAM_FLOATING: readonly Circle[] = [
  [712, 524, 13],
  [902, 508, 10],
  [842, 478, 7],
];
/** Drobne błyski na bańkach: jedyne miejsca z czystą bielą. */
const SHINES: readonly Circle[] = [
  [786, 558, 9],
  [654, 568, 7],
  [920, 565, 8],
];

function circles(list: readonly Circle[], className: string) {
  return list.map(([cx, cy, r]) => <circle key={`${cx}-${cy}`} className={className} cx={cx} cy={cy} r={r} />);
}

export function PlaceholderTub() {
  return (
    <svg
      className="placeholder-tub"
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      {/* Ściana i pas kafelków z kremową listwą */}
      <rect className="pt-wall" width={VIEW_WIDTH} height={VIEW_HEIGHT} />
      <rect className="pt-tiles" y={470} width={VIEW_WIDTH} height={390} />
      {TILES.map(({ x, y }) => (
        <rect key={`${x}-${y}`} className="pt-tile" x={x} y={y} width={TILE_SIZE} height={TILE_SIZE} rx={12} />
      ))}
      <rect className="pt-trim" y={458} width={VIEW_WIDTH} height={18} rx={9} />

      {/* Ręcznik na haczyku */}
      <rect className="pt-towel" x={1172} y={322} width={86} height={150} rx={18} />
      <rect className="pt-towel-stripe" x={1172} y={428} width={86} height={14} />
      <circle className="pt-hook" cx={1215} cy={318} r={10} />

      {/* Podłoga z desek */}
      <rect className="pt-floor" y={860} width={VIEW_WIDTH} height={140} />
      <path className="pt-seam" d={FLOOR_SEAMS.join(" ")} />

      {/* Wanna na nóżkach z pianą */}
      <ellipse className="pt-shadow" cx={800} cy={872} rx={300} ry={17} />
      <rect className="pt-foot" x={604} y={810} width={46} height={56} rx={18} />
      <rect className="pt-foot" x={950} y={810} width={46} height={56} rx={18} />
      <ellipse className="pt-foot" cx={627} cy={864} rx={30} ry={11} />
      <ellipse className="pt-foot" cx={973} cy={864} rx={30} ry={11} />
      <rect className="pt-water" x={538} y={600} width={524} height={26} rx={13} />
      {circles(FOAM_DEEP, "pt-foam pt-foam--deep")}
      {circles(FOAM_FRONT, "pt-foam")}
      <path className="pt-body" d="M540 640H1060V700C1060 788 986 838 892 838H708C614 838 540 788 540 700Z" />
      <path className="pt-body-shade" d="M543 744C562 806 628 838 708 838H892C972 838 1038 806 1057 744Z" />
      <rect className="pt-rim" x={520} y={616} width={560} height={36} rx={18} />
      {circles(SHINES, "pt-shine")}
      {circles(FOAM_FLOATING, "pt-foam")}
    </svg>
  );
}
