import { TIMING } from "../timing";

type KeyPress = Pick<KeyboardEvent, "key" | "repeat"> & { code?: string };
type Click = Pick<MouseEvent, "detail">;

export interface InputLatch {
  accept(event: KeyPress | Click): boolean;
  release(event: Pick<KeyPress, "key" | "code">): void;
  resetKeys(): void;
  phaseChanged(): void;
  remainingMs(): number;
}

export function createInputLatch({ cooldownMs = TIMING.inputCooldown * 1000, now = () => performance.now() } = {}): InputLatch {
  const held = new Set<string>();
  let lockedUntil = -Infinity;
  const keyId = (event: Pick<KeyPress, "key" | "code">) => event.code || event.key;
  return {
    accept(event) {
      if ("key" in event) {
        const id = keyId(event);
        if (event.repeat || held.has(id)) return false;
        // Nawet naciśnięcie w czasie blokady wymaga puszczenia przed kolejną próbą.
        held.add(id);
      } else if (event.detail === 0) {
        return false;
      }
      return now() >= lockedUntil;
    },
    release: (event) => { held.delete(keyId(event)); },
    resetKeys: () => { held.clear(); },
    phaseChanged: () => { lockedUntil = now() + cooldownMs; },
    remainingMs: () => Math.max(0, lockedUntil - now()),
  };
}
