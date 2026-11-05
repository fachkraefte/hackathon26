# Hackathon

KI-gestützte Bestandsaufnahme für KMU – Hackathon-Projekt im Rahmen von ROKI.

**Worum es geht:** [`PROJEKT.md`](PROJEKT.md) (maßgeblich) · Technik: [`TECHNIK.md`](TECHNIK.md) · Testdaten: [`DEMO_BETRIEBE.md`](DEMO_BETRIEBE.md) · Einstieg für andere KIs: [`MASTERPROMPT.md`](MASTERPROMPT.md)

Next.js app. German is the default at `/de`; English follows at `/en`.

```bash
npm install
npm run dev
```

If company security blocks `swc.win32-x64-msvc.node`, use the WebAssembly compiler instead:

```bash
npm run dev:wasm
```

Check before a pull request:

```bash
npm run lint
npm run typecheck
```

Shared agent rules are in `AGENTS.md`.
