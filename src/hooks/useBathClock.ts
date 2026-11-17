// Źródło: child-page@e7a19ac:js/kapiel.js (frame/start/onVis: jedna pętla rAF, dt do 50 ms, pauza przy ukrytej karcie).
// Zmiany: hook Reacta; tick zwraca, czy coś jeszcze trwa, a wake() budzi pętlę po zdarzeniu.
import { useCallback, useEffect, useRef } from "react";
import { TIMING } from "../timing";

/**
 * Zegar kąpieli świadomy widoczności karty (PROJECT.md, A4). Pętla biegnie, dopóki tick zwraca true,
 * a potem staje (bateria). Przy ukrytej karcie zatrzymuje się i po powrocie startuje bez skoku czasu.
 * Zwraca wake(), które wznawia pętlę (np. po dotyku albo zmianie fazy).
 */
export function useBathClock(tick: (dt: number) => boolean): () => void {
  const tickRef = useRef(tick);
  const raf = useRef(0);
  const last = useRef(0);
  const wanted = useRef(false);

  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  const frame = useCallback((now: number) => {
    raf.current = 0;
    const dt = Math.min(Math.max(0, (now - last.current) / 1000), TIMING.maxDt);
    last.current = now;
    const busy = tickRef.current(dt);
    wanted.current = busy;
    if (busy && !document.hidden) raf.current = requestAnimationFrame(frame);
  }, []);

  const wake = useCallback(() => {
    wanted.current = true;
    if (raf.current || document.hidden) return;
    last.current = performance.now();
    raf.current = requestAnimationFrame(frame);
  }, [frame]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        if (raf.current) {
          cancelAnimationFrame(raf.current);
          raf.current = 0;
          wanted.current = true;
        }
      } else if (wanted.current) {
        wake();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
  }, [wake]);

  return wake;
}
