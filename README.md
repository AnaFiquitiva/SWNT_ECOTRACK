# EcoTrack

MVP que estima la huella de carbono diaria a partir de una descripción en
lenguaje natural (ej. *"Hoy comí carne y viajé 20km en bus"*).

## Ejecutar localmente

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Desplegar en Replit

1. En [replit.com](https://replit.com), **Create Repl → Import from GitHub**.
2. Replit detecta `.replit` y arranca `npm run dev` en el puerto 3000.
3. Para una URL permanente, usa **Deploy** (Autoscale / Reserved VM).

## Entregables del ejercicio

- `.cursorrules` — personalidad y límites del agente.
- `VIBE_REPORT.md` — reflexión sobre el flujo de vibe coding.
- `lib/estimate.ts` — parser y factores de emisión.
- `app/page.tsx` — interfaz del prototipo.
- `docs/ecotrack-cursor.png` — captura de Cursor y Replit operando en conjunto.
- `docs/cursor-usage-limit.png` — captura del límite de uso ("usage limit") alcanzado en Cursor durante el desarrollo.
