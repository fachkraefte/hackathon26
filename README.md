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

## Database

The app uses Supabase from the server. Copy `.env.example` to `.env.local` and set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Add the same names in the Vercel project settings. The service role key bypasses row security, so it must never use the `NEXT_PUBLIC_` prefix. The client is `lib/supabase/server.ts`. Tables are not created yet.
