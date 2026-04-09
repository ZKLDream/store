# testStore recommended config

This file captures the final configuration shape that should stay in place in this repository for the native `agent-ui` integration to remain stable.

If you want to compare this final state with the earlier broken approach, read [teststore-before-after.md](teststore-before-after.md).

## 1. Keep a dedicated preprocess script

File:

- `scripts/build-agent-ui.js`

Recommended state:

- Input source: `agent-ui/`
- Output target: `.runtime/agent-ui`
- Transform every JS file with Babel module conversion
- Copy non-JS assets unchanged
- Fail the build if generated runtime JS still contains top-level `import/export`

Why this stays:

- This is the stable replacement for incomplete regex preprocessing
- It guarantees the raw native source never enters Mini Program runtime directly

## 2. Keep build scripts chained through the preprocess step

File:

- `package.json`

Recommended state:

- `build:agent-ui` runs the preprocess script
- `build:weapp` runs `build:agent-ui` before `taro build --type weapp`
- `dev:weapp` also runs `build:agent-ui` before `--watch`

Why this stays:

- It prevents `dist` from being populated with stale or raw native component output
- It ensures local development and production builds follow the same pipeline

## 3. Copy only from `.runtime`, never from source

File:

- `config/index.ts`

Recommended state:

- `copy.patterns` copies:
  - from `.runtime/agent-ui`
  - to `dist/agent-ui`

This is the rule:

- `agent-ui/` is source
- `.runtime/agent-ui` is executable intermediate output
- `dist/agent-ui` is final Mini Program runtime output

Why this stays:

- Source -> `dist` was the original failure mode
- `.runtime` is the only safe copy source after Babel transformation

## 4. Keep env injection in build config, not in runtime code

Files:

- `config/index.ts`
- `src/config/ai.ts`
- `types/global.d.ts`

Recommended state:

- `config/index.ts` reads `.env` / `.env.local` and process-level env values
- `config/index.ts` injects:
  - `__AI_BOT_ID__`
  - `__AI_RESOURCE_APPID__`
  - `__AI_RESOURCE_ENV__`
- `src/config/ai.ts` reads only those injected constants
- `types/global.d.ts` declares those constants for TypeScript

Why this stays:

- It prevents `process is not defined` in Mini Program runtime
- It keeps Node-only config resolution out of the client bundle

## 5. Keep the AI page as a Taro host page

File:

- `src/pages/ai-chat/index.config.ts`

Recommended state:

- `usingComponents` maps:
  - `'agent-ui': '/agent-ui/index'`
- The route continues to belong to Taro

Why this stays:

- Taro remains responsible for route ownership and outer page shell
- The native component remains responsible for its Mini Program internals
- This avoids raw native pages overwriting the Taro route output

## 6. Keep the config split by responsibility

Recommended ownership split:

- Taro layer
  - routing
  - page shell
  - build constants
  - copy pipeline

- Native component layer
  - WXML/WXSS/JS behavior
  - assistant UI internals
  - Mini Program-specific interaction logic

Why this stays:

- It reduces accidental coupling
- It keeps future native component updates manageable

## 7. Keep these verification checks as part of the workflow

After preprocessing:

```bash
grep -REn '^(import|export)[[:space:]]' .runtime/agent-ui --include='*.js'
```

After Taro build:

```bash
grep -REn '^(import|export)[[:space:]]' dist/agent-ui --include='*.js'
```

Expected result:

- no output

Why this stays:

- It catches regressions early
- It confirms the final runtime output matches the intended conversion result

## 8. Recommended “do not change unless needed” list

These decisions should be treated as defaults, not temporary workarounds:

1. Do not copy raw `agent-ui/` into `dist`
2. Do not replace Babel conversion with regex rewriting
3. Do not move runtime config back to `process.env`
4. Do not remove `.runtime` from the chain
5. Do not replace the Taro host page with a copied raw native page

## 9. When to revisit this config

Only revisit this configuration if:

- the native component source format changes significantly
- Taro build behavior changes and no longer needs the current copy bridge
- the component is replaced by a first-class Taro-compatible implementation

Until then, this config is the recommended steady state for `testStore`.
