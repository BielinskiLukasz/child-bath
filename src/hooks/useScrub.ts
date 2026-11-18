// Źródło: child-page@e7a19ac:js/kapiel.js (down/move/up: pointer capture, wielodotyk, współrzędne logiczne).
// Zmiany: zdarzenia scalone, osobne znaczniki i wygaszanie gestu po zmianie fazy lub układu.
import { useEffect, useRef, type RefObject } from "react";
import { LH, LW } from "../bath/coverage";

type PointerPosition = { x: number; y: number; left: number; top: number; width: number; height: number };

export interface ScrubCallbacks {
  canStart(): boolean;
  onSegment(x0: number, y0: number, x1: number, y1: number): void;
  onPointer(id: number, x: number, y: number, pressed: boolean): void;
  onPointerEnd(id: number): void;
  onReset(): void;
}

export function useScrub(target: RefObject<HTMLElement | null>, callbacks: ScrubCallbacks, enabled: boolean): void {
  const callbacksRef = useRef(callbacks);
  useEffect(() => { callbacksRef.current = callbacks; });

  useEffect(() => {
    const element = target.current;
    if (!element || !enabled) return;
    const pointers = new Map<number, PointerPosition>();
    const logicalX = (event: PointerEvent, rect: DOMRect) => (event.clientX - rect.left) * LW / rect.width;
    const logicalY = (event: PointerEvent, rect: DOMRect) => (event.clientY - rect.top) * LH / rect.height;

    const down = (event: PointerEvent) => {
      const cb = callbacksRef.current;
      if (document.hidden || !cb.canStart() || (event.pointerType === "mouse" && event.button !== 0)) return;
      const rect = element.getBoundingClientRect();
      if (!(rect.width > 0 && rect.height > 0)) return;
      const x = logicalX(event, rect);
      const y = logicalY(event, rect);
      pointers.set(event.pointerId, { x, y, left: rect.left, top: rect.top, width: rect.width, height: rect.height });
      try { element.setPointerCapture(event.pointerId); } catch { /* Syntetyczny wskaźnik może nie mieć capture. */ }
      cb.onSegment(x, y, x, y);
      cb.onPointer(event.pointerId, x, y, true);
      event.preventDefault();
    };

    const move = (event: PointerEvent) => {
      if (document.hidden) return;
      const previous = pointers.get(event.pointerId);
      if (!previous && event.pointerType !== "mouse") return;
      const rect = element.getBoundingClientRect();
      if (!(rect.width > 0 && rect.height > 0)) return;
      const x = logicalX(event, rect);
      const y = logicalY(event, rect);
      const cb = callbacksRef.current;
      if (previous) {
        if (previous.left !== rect.left || previous.top !== rect.top || previous.width !== rect.width || previous.height !== rect.height) {
          cb.onSegment(x, y, x, y);
        } else {
          let lastX = previous.x;
          let lastY = previous.y;
          const coalesced = event.getCoalescedEvents?.();
          if (coalesced) for (const item of coalesced) {
            const nextX = logicalX(item, rect);
            const nextY = logicalY(item, rect);
            cb.onSegment(lastX, lastY, nextX, nextY);
            lastX = nextX;
            lastY = nextY;
          }
          if (!coalesced?.length || x !== lastX || y !== lastY) cb.onSegment(lastX, lastY, x, y);
        }
        previous.x = x;
        previous.y = y;
        previous.left = rect.left;
        previous.top = rect.top;
        previous.width = rect.width;
        previous.height = rect.height;
      }
      cb.onPointer(event.pointerId, x, y, Boolean(previous));
    };

    const up = (event: PointerEvent) => {
      if (!pointers.delete(event.pointerId)) return;
      if (!document.hidden && event.pointerType === "mouse") {
        const rect = element.getBoundingClientRect();
        if (event.clientX >= rect.left && event.clientX < rect.right && event.clientY >= rect.top && event.clientY < rect.bottom) {
          callbacksRef.current.onPointer(event.pointerId, logicalX(event, rect), logicalY(event, rect), false);
          return;
        }
      }
      callbacksRef.current.onPointerEnd(event.pointerId);
    };

    const cancel = (event: PointerEvent) => {
      if (pointers.delete(event.pointerId)) callbacksRef.current.onPointerEnd(event.pointerId);
    };
    const leave = (event: PointerEvent) => {
      if (!pointers.has(event.pointerId)) callbacksRef.current.onPointerEnd(event.pointerId);
    };
    const clear = () => {
      for (const id of pointers.keys()) {
        pointers.delete(id);
        if (element.hasPointerCapture(id)) element.releasePointerCapture(id);
      }
      callbacksRef.current.onReset();
    };
    const onVisibility = () => { if (document.hidden) clear(); };

    element.addEventListener("pointerdown", down);
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerup", up);
    element.addEventListener("pointercancel", cancel);
    element.addEventListener("lostpointercapture", cancel);
    element.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", clear);
    return () => {
      element.removeEventListener("pointerdown", down);
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerup", up);
      element.removeEventListener("pointercancel", cancel);
      element.removeEventListener("lostpointercapture", cancel);
      element.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", clear);
      clear();
    };
  }, [target, enabled]);
}
