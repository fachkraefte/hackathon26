# Hackathon

Next.js app. English and German are available at `/en` and `/de`.

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
