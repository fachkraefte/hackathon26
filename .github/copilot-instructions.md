# Team rules

Canonical source: `AGENTS.md`. Keep this file in sync with the team rules there. If they differ, `AGENTS.md` wins.

These rules apply to every coding agent on this repo: Cursor, Claude Code, and VS Code with GitHub Copilot. `AGENTS.md` is the source of truth. `CLAUDE.md` imports it. `.github/copilot-instructions.md` repeats the rules below so Copilot sees them. If a copy drifts, this file wins and the copy must be updated.

## Product

The product is specified in German in these files. Read them before you build a feature:

- `PROJEKT.md` – what we build and why, the user flow, rules, plan, decisions. **This is the specification.** If another file disagrees, `PROJEKT.md` wins.
- `TECHNIK.md` – architecture, AI steps, data types, storage, demo mode.
- `DEMO_BETRIEBE.md` – the five fictional test companies and the demo data.
- `MASTERPROMPT.md` – a short briefing to paste into another AI.

Do not invent pages, features, user roles, copy, or data fields beyond these files and the task you were given. If something is missing or unclear, ask.

Other files and what they are for:

- `ROKI_Recherche_*.md` (three files) are checked research. They are the only source an AI suggestion may cite as "von ROKI geprüft". They are content, not a specification of the app.
- `ROKI_Branchen_Problemanalyse_Robotik_und_Automatisierung.md` collects problem hypotheses per industry. Only statements marked `[ROKI geprüft]` there may be used as checked knowledge.
- `ROKI_SPRACHE_UND_TONALITAET.md` sets the tone for all German user-facing text.
- `DESIGN.md` is the visual design of the ROKI platform. We use its colors, font, and tone (see Styling below). It links to code files that are not in this repo.
- `roki-projektübersicht.md` is background on the ROKI knowledge platform.

## Stack

- Next.js App Router and TypeScript with `strict` on. Do not add the Pages Router.
- React Server Components by default. Add `"use client"` only for state, event handlers, or a browser-only API.
- npm only. Commit `package-lock.json`. Do not use pnpm, Yarn, or Bun, and do not commit another lockfile.
- Deploy on Vercel. Do not add a second host, a custom server, or Docker. `vercel.json` sets the framework to Next.js. Do not set `outputDirectory`; Vercel serves the Next.js build, not a `public` folder.
- This Next.js version differs from older training data. Read the matching guide in `node_modules/next/dist/docs/` before using a Next.js API. Locale routing goes through `proxy.ts`, not `middleware.ts`.
- Do not import `next-intl/plugin`. It loads a native SWC binary on startup. `next.config.mjs` already aliases `next-intl/config` to `i18n/request.ts`.
- Some company PCs block `swc.win32-x64-msvc.node` and `next-swc.win32-x64-msvc.node`. Do not try to unblock those files. On those PCs run `npm run dev:wasm` and `npm run build:wasm` (WebAssembly compiler and webpack). Other machines keep `npm run dev` and `npm run build`.

## Dependencies and styling

- Do not add a dependency unless the current stack cannot do the task. Name the reason in the pull request.
- Styling: plain CSS in `app/globals.css` or a CSS module next to the component. Do not add Tailwind, CSS-in-JS, or a component library. The look follows the ROKI design in `DESIGN.md` for now: font Rubik (via `next/font`), navy `#15263E` for text, turquoise `#2FB9CB` and orange `#F08119` as accents (orange sparingly), background `#F6F8FA`, navy text on colored buttons. Keep these values as CSS variables in `app/globals.css`.
- Internationalization uses `next-intl` with locale prefixes (`/de`, `/en`). **German is the default.** English follows later through the existing language switcher. Write German strings first in `messages/de.json` and keep `messages/en.json` with the same keys. To add a language, add its code to `i18n/routing.ts` and a `messages/<locale>.json` file with the same keys as `messages/de.json`. Do not add i18next, react-intl, or a second catalog. User-facing strings belong in the message files. AI prompts are not user-facing strings; they live in `lib/ki/`.
- Import `Link`, `redirect`, `usePathname`, and `useRouter` from `i18n/navigation.ts`. Do not import those from `next/link` or `next/navigation`.
- The database is Supabase. Use the server client in `lib/supabase/server.ts`. Confirm the schema before creating tables. Do not add Prisma, Firebase, or another database. The service role key is server-only and must never use the `NEXT_PUBLIC_` prefix. `@supabase/supabase-js` is the client because the app cannot reach Supabase without it. Do not add `@supabase/ssr` unless the app stores a user session in cookies.

## Safety and quality

- No `any`. Type the boundary and let TypeScript infer the rest.
- Do not swallow errors with an empty `catch`. Show the failure, or rethrow with the cause attached.
- Secrets go in `.env.local` and in the Vercel project settings. Commit names only, in `.env.example`, with no values.
- `npm run lint` and `npm run typecheck` must pass before a pull request.
- Add a test only when logic is easy to get wrong. Do not add a test runner for static pages.
- Work on a branch and open a pull request into `main`. Do not commit or push directly to `main`.

## Commands

- `npm install`
- `npm run dev`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
