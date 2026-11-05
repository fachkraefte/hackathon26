# Team rules

Canonical source: `AGENTS.md`. Keep this file in sync with the team rules there. If they differ, `AGENTS.md` wins.

These rules apply to every coding agent on this repo: Cursor, Claude Code, and VS Code with GitHub Copilot.

## Product

The product description is not written yet. Another teammate will provide it. Do not invent pages, features, user roles, copy, or a data model beyond the task you were given.

`DESIGN.md` and the `ROKI_*.md` notes are background from a different effort. They are not the specification for this app.

## Stack

- Next.js App Router and TypeScript with `strict` on. Do not add the Pages Router.
- React Server Components by default. Add `"use client"` only for state, event handlers, or a browser-only API.
- npm only. Commit `package-lock.json`. Do not use pnpm, Yarn, or Bun, and do not commit another lockfile.
- Deploy on Vercel. Do not add a second host, a custom server, or Docker.
- This Next.js version differs from older training data. Read the matching guide in `node_modules/next/dist/docs/` before using a Next.js API. Locale routing goes through `proxy.ts`, not `middleware.ts`.
- Do not import `next-intl/plugin`. It loads a native SWC binary on startup. `next.config.mjs` already aliases `next-intl/config` to `i18n/request.ts`.
- Some company PCs block `swc.win32-x64-msvc.node` and `next-swc.win32-x64-msvc.node`. Do not try to unblock those files. On those PCs run `npm run dev:wasm` and `npm run build:wasm` (WebAssembly compiler and webpack). Other machines keep `npm run dev` and `npm run build`.

## Dependencies and styling

- Do not add a dependency unless the current stack cannot do the task. Name the reason in the pull request.
- Styling is not decided. Use plain CSS in `app/globals.css` or a CSS module next to the component. Do not add Tailwind, CSS-in-JS, or a component library.
- Internationalization uses `next-intl` with locale prefixes (`/en`, `/de`). English is the default. To add a language, add its code to `i18n/routing.ts` and a `messages/<locale>.json` file with the same keys as `messages/en.json`. Do not add i18next, react-intl, or a second catalog. User-facing strings belong in the message files.
- Import `Link`, `redirect`, `usePathname`, and `useRouter` from `i18n/navigation.ts`. Do not import those from `next/link` or `next/navigation`.
- A database is not decided. If a task needs to save data, use Supabase. Stop and confirm before installing the client or creating tables. Do not add Prisma, Firebase, or another database. The Supabase service role key is server-only and must never use the `NEXT_PUBLIC_` prefix.

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
