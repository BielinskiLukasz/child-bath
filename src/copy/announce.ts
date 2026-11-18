import type { StepKind } from "../bath/steps";
import type { BathPhase } from "../game";

const STEP_NAME: Record<StepKind, string> = {
  scrub: "zmywanie brudu", lather: "namydlanie", rinse: "spłukiwanie piany", dry: "wycieranie", groom: "czesanie",
};

export function bathAnnouncement(phase: BathPhase, step: StepKind, index: number, total: number): string {
  switch (phase) {
    case "door_waiting": return "Zwierzątko czeka na kąpiel. Naciśnij Dalej.";
    case "arriving": return "Zwierzątko wchodzi do kąpieli.";
    case "stage_in": return `Przygotowanie kroku ${index + 1}.`;
    case "scrubbing": return `Krok ${index + 1} z ${total}: ${STEP_NAME[step]}.`;
    case "stage_rest": return `Krok ${index + 1} zakończony.`;
    case "reward": return "Zwierzątko jest czyste.";
    case "to_bench": return "Zwierzątko odchodzi odpocząć.";
  }
}

export const bathBoxLabel = (oneButton: boolean) => oneButton
  ? "Zwierzątko do kąpieli. Enter wykonuje następny ruch."
  : "Zwierzątko do kąpieli. Strzałki przesuwają gąbkę, Enter lub spacja myje dalej.";
