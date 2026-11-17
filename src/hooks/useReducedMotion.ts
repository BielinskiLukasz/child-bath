import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/** Czy system prosi o ograniczony ruch; zmiana ustawienia działa bez przeładowania strony. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => typeof window !== "undefined" && Boolean(window.matchMedia?.(QUERY).matches));

  useEffect(() => {
    const media = window.matchMedia?.(QUERY);
    if (!media) return;
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}
