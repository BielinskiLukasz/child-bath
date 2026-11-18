import { expect, test } from "@playwright/test";
import { createInputLatch } from "../../src/input/latch";

const enter = { key: "Enter", code: "Enter", repeat: false };

test("dziesięć zdarzeń przytrzymanego klawisza w sekundę daje jedną akcję", () => {
  let now = 0;
  const latch = createInputLatch({ now: () => now });
  const accepted = [latch.accept(enter)];
  latch.phaseChanged();
  for (let i = 1; i < 10; i++) {
    now = i * 100;
    accepted.push(latch.accept(i % 2 ? { ...enter, repeat: true } : enter));
  }
  expect(accepted.filter(Boolean)).toHaveLength(1);
  latch.release(enter);
  expect(latch.accept(enter)).toBe(true);
});

test("cooldown jest równy 600 ms; nie kolejkuje klawisza wciśniętego podczas blokady", () => {
  let now = 100;
  const latch = createInputLatch({ now: () => now });
  latch.phaseChanged();
  expect(latch.remainingMs()).toBe(600);
  now = 699;
  expect(latch.accept({ detail: 1 })).toBe(false);
  expect(latch.accept(enter)).toBe(false);
  now = 700;
  expect(latch.remainingMs()).toBe(0);
  expect(latch.accept(enter)).toBe(false);
  latch.release(enter);
  expect(latch.accept(enter)).toBe(true);
});

test("kliknięcie z klawiatury nie powtarza gestu, a utrata fokusu czyści przytrzymanie", () => {
  const latch = createInputLatch({ now: () => 1 });
  expect(latch.accept({ detail: 0 })).toBe(false);
  expect(latch.accept({ detail: 1 })).toBe(true);
  expect(latch.accept({ ...enter, repeat: true })).toBe(false);
  expect(latch.accept(enter)).toBe(true);
  latch.resetKeys();
  expect(latch.accept(enter)).toBe(true);
});
