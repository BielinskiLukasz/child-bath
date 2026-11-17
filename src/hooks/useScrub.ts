// Źródło: child-page@e7a19ac:js/kapiel.js (down/move/up: przechwycenie wskaźnika, wiele palców, przeliczenie na współrzędne logiczne).
// Zmiany: hook Reacta, zdarzenia scalone (getCoalescedEvents), wskaźnik myszy bez wciśnięcia dla narzędzia pod kursorem.
import { useEffect, useRef, type RefObject } from "react";
import { LH, LW } from "../bath/coverage";

export type PointerPhase = "down" | "move" | "up" | "hover" | "leave";

export interface ScrubCallbacks {
  /** Odcinek ruchu jednego palca w jednostkach logicznych (pojedynczy dotyk: x0 = x1, y0 = y1). */
  onSegment(x0: number, y0: number, x1: number, y1: number): void;
  /** Położenie wskaźnika do narzędzia pod palcem; active = liczba wciśniętych wskaźników. */
  onPointer(x: number, y: number, phase: PointerPhase, active: number, pointerType: string): void;
}

/**
 * Zamienia zdarzenia wskaźnika na odcinkach pudełka zwierzątka na odcinki w przestrzeni 256 × 336.
 * Ruch nie przechodzi przez stan Reacta (tylko wywołania zwrotne), więc nie wywołuje renderowania.
 */
export function useScrub(target: RefObject<HTMLElement | null>, callbacks: ScrubCallbacks): void {
  const callbacksRef = useRef(callbacks);
  useEffect(() => {
    callbacksRef.current = callbacks;
  });

  useEffect(() => {
    const element = target.current;
    if (!element) return;
    const pointers = new Map<number, [number, number]>();
    const toLogical = (event: PointerEvent): [number, number] => {
      const rect = element.getBoundingClientRect();
      return [((event.clientX - rect.left) / rect.width) * LW, ((event.clientY - rect.top) / rect.height) * LH];
    };

    const down = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      const point = toLogical(event);
      pointers.set(event.pointerId, point);
      try {
        element.setPointerCapture(event.pointerId);
      } catch {
        // Syntetyczne wskaźniki (testy) nie zawsze pozwalają na przechwycenie.
      }
      callbacksRef.current.onSegment(point[0], point[1], point[0], point[1]);
      callbacksRef.current.onPointer(point[0], point[1], "down", pointers.size, event.pointerType);
      event.preventDefault();
    };

    const move = (event: PointerEvent) => {
      const previous = pointers.get(event.pointerId);
      if (!previous) {
        if (event.pointerType === "mouse") {
          const point = toLogical(event);
          callbacksRef.current.onPointer(point[0], point[1], "hover", pointers.size, event.pointerType);
        }
        return;
      }
      const coalesced = typeof event.getCoalescedEvents === "function" ? event.getCoalescedEvents() : [];
      let last = previous;
      for (const item of coalesced.length > 0 ? coalesced : [event]) {
        const point = toLogical(item);
        callbacksRef.current.onSegment(last[0], last[1], point[0], point[1]);
        last = point;
      }
      pointers.set(event.pointerId, last);
      callbacksRef.current.onPointer(last[0], last[1], "move", pointers.size, event.pointerType);
    };

    const up = (event: PointerEvent) => {
      const previous = pointers.get(event.pointerId);
      if (!previous) return;
      pointers.delete(event.pointerId);
      callbacksRef.current.onPointer(previous[0], previous[1], "up", pointers.size, event.pointerType);
    };

    const leave = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && !pointers.has(event.pointerId)) {
        callbacksRef.current.onPointer(0, 0, "leave", pointers.size, event.pointerType);
      }
    };

    element.addEventListener("pointerdown", down);
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerup", up);
    element.addEventListener("pointercancel", up);
    element.addEventListener("lostpointercapture", up);
    element.addEventListener("pointerleave", leave);
    return () => {
      element.removeEventListener("pointerdown", down);
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerup", up);
      element.removeEventListener("pointercancel", up);
      element.removeEventListener("lostpointercapture", up);
      element.removeEventListener("pointerleave", leave);
    };
  }, [target]);
}
