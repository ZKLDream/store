# testStore case

This repository contains a full working example of the pattern described by this skill.

If you want the incident sequence that led to this final pattern, read [teststore-timeline.md](teststore-timeline.md).
If you want the final config set to keep in place, read [teststore-recommended-config.md](teststore-recommended-config.md).
If you want the wrong-vs-right comparison in one place, read [teststore-before-after.md](teststore-before-after.md).

## Real chain in this project

### 1. Native component source

- Source directory: `agent-ui/`
- This directory keeps the original native Mini Program component assets:
  - `wxml`
  - `wxss`
  - `js`
  - `json`
  - images and subcomponents

Important point:

- The source JS is allowed to stay in ESM-style authoring form.
- It is not copied directly into `dist`.

### 2. Preprocess stage

- Build script entry: `scripts/build-agent-ui.js`
- Source input: `agent-ui/`
- Intermediate output: `.runtime/agent-ui`

What the script does:

- walks the whole `agent-ui/` directory
- transforms every JS file with Babel module conversion
- copies non-JS assets unchanged
- validates the generated `.runtime/agent-ui/**/*.js`
- fails fast if top-level `import/export` still remains

Why this matters:

- earlier regex-style preprocessing was incomplete
- semicolon-less ESM and compressed helper files were missed
- Babel module conversion was the reliable fix

## 3. Taro build integration

The Taro build does not copy from `agent-ui/` directly.

In this project:

- `package.json`
  - `build:agent-ui` runs `node scripts/build-agent-ui.js`
  - `build:weapp` runs `npm run build:agent-ui && taro build --type weapp`
  - `dev:weapp` also runs the preprocess step first

- `config/index.ts`
  - `copy.patterns` copies:
    - from `.runtime/agent-ui`
    - to `dist/agent-ui`

This is the key rule:

- source -> `.runtime` -> `dist`
- never source -> `dist`

## 4. Taro host page

The native component is hosted by a Taro route page, not by a copied raw page.

In this project:

- `src/pages/ai-chat/index.config.ts`
  - registers `usingComponents`
  - maps `'agent-ui': '/agent-ui/index'`

This keeps:

- route ownership in Taro
- page shell and outer layout in Taro
- native component behavior inside the native component itself

## 5. Runtime config injection

This project also shows the correct way to avoid `process is not defined`.

Relevant files:

- `config/index.ts`
  - reads `.env` and process-level env values during build
  - injects `__AI_BOT_ID__`, `__AI_RESOURCE_APPID__`, `__AI_RESOURCE_ENV__`

- `src/config/ai.ts`
  - reads those build-time constants
  - does not read `process.env` inside Mini Program runtime code

## 6. What this project demonstrates

This repository is a good concrete example of these final decisions:

- Taro page acts as the host shell
- native component directory is preprocessed before copy
- Babel handles JS module conversion
- `.runtime` is the truth source for copied native output
- `dist` is validated as the real runtime target
- Mini Program runtime code does not depend on `process.env`

## 7. What originally went wrong

The project also demonstrates the most common failure path:

- raw `agent-ui/` JS was copied into `dist`
- some files still contained top-level `import/export`
- WeChat DevTools reported parse errors and undefined modules
- regex preprocessing fixed some files but still missed others
- the final stable fix was Babel AST/module transformation plus output validation

## 8. How to reuse this case

If you are adapting this pattern to another project:

1. replace `agent-ui/` with your native component source directory
2. keep the preprocess output in a dedicated runtime folder
3. copy only from the runtime folder into `dist`
4. keep the route page in Taro and mount the native component with `usingComponents`
5. verify `.runtime` and `dist` instead of trusting source-only inspection
