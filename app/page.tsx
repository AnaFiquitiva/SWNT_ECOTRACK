"use client";

import { useMemo, useState } from "react";
import { estimateFootprint, type FootprintResult } from "@/lib/estimate";

const EXAMPLE = "Hoy comí carne y viajé 20km en bus";

export default function HomePage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<FootprintResult | null>(null);
  const [history, setHistory] = useState<number[]>([]);

  const maxHistory = useMemo(
    () => Math.max(...history, 1),
    [history],
  );

  function onEstimate() {
    const next = estimateFootprint(text);
    setResult(next);
    if (!next.unmatched) {
      setHistory((prev) => [...prev, next.totalKg]);
    }
  }

  return (
    <main className="shell">
      <header className="hero">
        <h1>EcoTrack</h1>
        <p>
          Describe tu día en una frase. La app estima tu huella de carbono
          a partir de lo que comiste y cómo te moviste.
        </p>
      </header>

      <section className="card">
        <label htmlFor="day">Cuéntame tu día</label>
        <textarea
          id="day"
          value={text}
          placeholder={EXAMPLE}
          suppressHydrationWarning
          onChange={(event) => setText(event.target.value)}
        />
        <div className="actions">
          <button className="primary" type="button" onClick={onEstimate}>
            Calcular huella
          </button>
          <button
            className="ghost"
            type="button"
            onClick={() => setText(EXAMPLE)}
          >
            Usar ejemplo
          </button>
        </div>

        {result ? <ResultCard result={result} /> : null}

        {history.length > 0 ? (
          <div className="history">
            <strong>Historial de esta sesión</strong>
            <div className="bars" aria-hidden="true">
              {history.map((value, index) => (
                <div
                  key={`${value}-${index}`}
                  className="bar"
                  style={{ height: `${Math.max(12, (value / maxHistory) * 88)}px` }}
                />
              ))}
            </div>
            <p className="warn">
              Total acumulado: {history.reduce((sum, value) => sum + value, 0).toFixed(2)} kg CO2e
            </p>
          </div>
        ) : null}
      </section>
    </main>
  );
}

function ResultCard({ result }: { result: FootprintResult }) {
  if (result.unmatched) {
    return (
      <div className="result">
        <p className="warn">
          No reconocí alimentos ni desplazamientos. Menciona qué comiste y
          cuántos km recorriste, por ejemplo: “comí pollo y caminé 3km”.
        </p>
      </div>
    );
  }

  return (
    <div className="result">
      <p className="metric">{result.totalKg} kg CO2e</p>
      {result.foodItems.length > 0 ? (
        <>
          <strong>Alimentación</strong>
          <ul className="list">
            {result.foodItems.map((item) => (
              <li key={item.keyword}>
                {item.keyword}: {item.kg} kg CO2e
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {result.transportItems.length > 0 ? (
        <>
          <strong>Transporte</strong>
          <ul className="list">
            {result.transportItems.map((item) => (
              <li key={`${item.keyword}-${item.km}`}>
                {item.km} km en {item.keyword}: {Math.round(item.kg * 100) / 100} kg CO2e
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
