// Źródło: child-train@b881e09:src/App.tsx (klawisz jako button i aria-disabled bez usuwania z DOM).
// Zmiany: przycisk zapowiedzi „Dalej”, dekoracyjna strzałka i wspólne sterowanie kąpielą.
import type { MouseEventHandler } from "react";

export interface ControlProps {
  ready: boolean;
  onActivate: MouseEventHandler<HTMLButtonElement>;
}

export function NextButton({ ready, onActivate }: ControlProps) {
  return (
    <button type="button" className="bath-control next-button" data-bath-control="next"
      aria-disabled={!ready} onClick={onActivate}>
      <span>Dalej</span>
      <svg width="23" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
        <path d="M4 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
