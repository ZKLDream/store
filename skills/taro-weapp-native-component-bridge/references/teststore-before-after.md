# testStore before/after

This file contrasts the earlier unstable integration approach with the final stable setup used in this repository.

## 1. Native component copy source

### Before

- Raw `agent-ui/` source was copied toward `dist`
- Source JS still contained top-level `import/export`

### After

- `agent-ui/` remains source only
- JS is transformed into `.runtime/agent-ui`
- Taro copies only from `.runtime/agent-ui` to `dist/agent-ui`

Why the change mattered:

- Mini Program runtime can execute the transformed output
- It cannot safely execute the original ESM source as-is

## 2. JS preprocessing strategy

### Before

- Preprocessing relied on regex replacement
- Conversion looked successful for some files
- Nested helpers and unusual ESM forms were still missed

### After

- `scripts/build-agent-ui.js` uses Babel module transformation
- Every JS file in the native component tree is parsed and transformed consistently
- Build fails if output still contains top-level `import/export`

Why the change mattered:

- Regex was partial and fragile
- Babel made the conversion deterministic

## 3. Validation target

### Before

- Debugging focused on source files
- Sometimes `.runtime` looked fixed, but `dist` was still stale or wrong

### After

- Validation checks both:
  - `.runtime/agent-ui`
  - `dist/agent-ui`
- Final runtime artifacts are treated as the source of truth

Why the change mattered:

- WeChat DevTools executes the final copied output, not the source directory

## 4. Taro page responsibility

### Before

- There was confusion between the Taro route page and raw native page assets
- It was easy to mix “host page” concerns with “native component runtime” concerns

### After

- Taro remains the route owner
- `src/pages/ai-chat/index.config.ts` mounts the component with:
  - `'agent-ui': '/agent-ui/index'`
- Native component stays responsible for its internal WXML/WXSS/JS behavior

Why the change mattered:

- Route ownership and native runtime behavior are now clearly separated

## 5. Runtime environment access

### Before

- Mini Program runtime code still referenced `process.env`
- This surfaced as `process is not defined`

### After

- Build config reads env values
- Build-time constants are injected through `config/index.ts`
- Runtime code reads:
  - `__AI_BOT_ID__`
  - `__AI_RESOURCE_APPID__`
  - `__AI_RESOURCE_ENV__`

Why the change mattered:

- Mini Program runtime no longer depends on Node globals

## 6. Build command chain

### Before

- Native component preprocessing was easy to skip or partially apply

### After

- `package.json` keeps the preprocess step in front of both:
  - `build:weapp`
  - `dev:weapp`

Why the change mattered:

- Development and production builds now share the same native asset pipeline

## 7. Practical outcome

### Before

- ESM parse errors moved between different files
- Fixes appeared to work temporarily but did not stabilize the build
- Runtime behavior was hard to trust

### After

- Native component JS is converted before copy
- Final runtime output can be verified deterministically
- The Taro host page and Mini Program runtime responsibilities are stable

## 8. Short version

### Broken pattern

- source -> `dist`
- regex rewrite
- source-only inspection
- runtime `process.env`

### Stable pattern

- source -> `.runtime` -> `dist`
- Babel module transform
- `.runtime` + `dist` validation
- build-time constant injection

## 9. When to use this comparison

Use this page when you need to:

- explain why the current config should stay as-is
- onboard someone new to the integration
- show why regex preprocessing was abandoned
- justify the `.runtime` bridge and Babel conversion in code review or documentation
