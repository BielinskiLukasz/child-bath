import { useState } from "react";
import { BathStage } from "./components/BathStage";
import { PlaceholderTub } from "./components/illustration/PlaceholderTub";
import { isTestMode } from "./settings/testMode";

/** Domyślne imię dziecka w dopełniaczu. Od Fazy 10 ustawia je rodzic w panelu. */
const CHILD_NAME = "dziecka";

/**
 * Cztery strefy ekranu z Fazy 1 (pasek górny, scena, narracja, strefa akcji).
 * Od Fazy 2 scena zawiera pudełko kąpieli; szkic łazienki zostaje tłem do czasu scenerii z Fazy 6.
 * Atrybut data-phase na korzeniu odzwierciedla fazę kąpieli (zaczepienie testów i CSS).
 */
export default function App() {
  const testMode = isTestMode();
  const [phase, setPhase] = useState<string>("boot");

  return (
    <div className="little-world" data-phase={phase} data-test-frames={testMode ? "true" : undefined}>
      <header className="top-bar" data-zone="Pasek górny">
        <h1 className="app-title">
          Mała łazienka <em className="app-title__name">{CHILD_NAME}</em>
        </h1>
      </header>

      <main id="scene" className="scene" data-zone="Scena" aria-label="Łazienka">
        <PlaceholderTub />
        <BathStage onPhaseChange={setPhase} />
      </main>

      <section id="narration" className="narration" data-zone="Narracja" aria-hidden="true">
        {testMode && <p className="zone-sample">Żabka skakała po kałużach… (przykładowe zdanie dla rodzica)</p>}
      </section>

      <footer id="action" className="action" data-zone="Strefa akcji">
        {testMode && (
          <div className="zone-sample zone-sample--button" aria-hidden="true">
            Dalej
          </div>
        )}
      </footer>
    </div>
  );
}
