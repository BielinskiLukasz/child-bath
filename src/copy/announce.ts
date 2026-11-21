import { byGender, name } from "../animals/names";
import { finishingAction } from "../animals/traits";
import type { AnimalDef } from "../animals/types";
import type { StepKind } from "../bath/steps";
import type { BathPhase } from "../game";

const STEP_NAME: Record<StepKind, string> = {
  scrub: "zmywanie brudu", lather: "namydlanie", rinse: "spłukiwanie piany", dry: "wycieranie", groom: "czesanie",
};

export function bathAnnouncement(phase: BathPhase, step: StepKind, index: number, total: number, animal: AnimalDef): string {
  const guest = name(animal);
  switch (phase) {
    case "door_waiting": return `${guest} czeka na kąpiel. Naciśnij Dalej.`;
    case "arriving": return `${guest} wchodzi do kąpieli.`;
    case "stage_in": return `Przygotowanie kroku ${index + 1}.`;
    case "scrubbing": return `Krok ${index + 1} z ${total}: ${step === "groom" && finishingAction(animal.okrywa) === "pet" ? "głaskanie" : STEP_NAME[step]}.`;
    case "stage_rest": return `Krok ${index + 1} zakończony.`;
    case "reward": return `${guest} ${byGender(animal, { m: "jest czysty", f: "jest czysta", n: "jest czyste" })}.`;
    case "to_bench": return `${guest} odchodzi odpocząć.`;
  }
}

export const bathBoxLabel = (animal: AnimalDef, oneButton: boolean) => `${name(animal)} do kąpieli. ${oneButton
  ? "Enter wykonuje następny ruch."
  : "Strzałki przesuwają gąbkę, Enter lub spacja myje dalej."}`;
