// Źródło: child-train@b881e09:src/components/illustration/Station.tsx (tarcza i wskazówki sterowane godziną symulacji).
// Łazienkowa tarcza, wskazówka minutowa wykonuje jeden obrót na godzinę.
export function WallClock({ x, y, diameter }: { x: number; y: number; diameter: number }) {
  return <g data-world-clock="true" transform={`translate(${x} ${y}) scale(${diameter / 64})`}>
    <circle r="32" fill="#a27c63" />
    <circle r="27.3" fill="#f6edd3" />
    <circle r="23" fill="#fbf1d9" />
    <g fill="#a99679">
      {Array.from({ length: 12 }, (_, i) => <circle key={i} transform={`rotate(${i * 30})`} cy="-21.6" r={i % 3 ? 1.18 : 1.87} />)}
    </g>
    <g className="clock-hand clock-hand--hour"><path d="M0 1V-12" stroke="#676e57" strokeWidth="3.6" strokeLinecap="round" /></g>
    <g className="clock-hand clock-hand--minute"><path d="M0 1V-19" stroke="#676e57" strokeWidth="2.1" strokeLinecap="round" /></g>
    <circle r="2.85" fill="#9c7155" />
  </g>;
}