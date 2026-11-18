// Źródło: child-train@b881e09:src/App.tsx (podpis Dotknij/Naciśnij, klawisz Enter i piktogram).
// Zmiany: jeden przycisk zapowiada zwierzątko i steruje automatycznymi ruchami.
import type { ControlProps } from "./NextButton";

export function OneButtonKey({ ready, waiting, onActivate }: ControlProps & { waiting: boolean }) {
  return (
    <button type="button" className="bath-control one-button-key" data-bath-control="one-button"
      aria-disabled={!ready} aria-label={waiting ? "Enter — Dalej" : "Enter — następny ruch"} onClick={onActivate}>
      <span className="one-button-prompt" aria-hidden="true">
        <span className="one-button-prompt__press">Naciśnij</span>
        <span className="one-button-prompt__touch">Dotknij</span>
      </span>
      <span className="one-button-legend">
        Enter
        <svg width="23" height="20" viewBox="0 0 24 20" fill="none" aria-hidden="true" focusable="false">
          <path d="M20 3v9H4m0 0 5-5m-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </button>
  );
}
