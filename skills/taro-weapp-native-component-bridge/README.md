# taro-weapp-native-component-bridge

A Codex skill for diagnosing and fixing Taro + native WeChat Mini Program component integration issues.

It is designed for cases where a Taro project hosts native Mini Program components such as `agent-ui`, and the copied native JS cannot run directly in WeChat DevTools because `import/export` syntax remains in the final runtime output.

## What this skill helps with

- Taro hosting native Mini Program components via `usingComponents`
- `Unexpected token 'export'`
- `Cannot use import statement outside a module`
- `module '.../index.js' is not defined`
- `process is not defined`
- Replacing fragile regex preprocessing with Babel/CommonJS transformation
- Building a stable `source -> .runtime -> dist` pipeline

## Included

- `SKILL.md`
  Main skill entry and trigger description
- `references/`
  Workflow, error mapping, checklists, real project case study, timeline, recommended config, and before/after comparison
- `scripts/build-native-component-template.js`
  Reusable Babel preprocessing script template
- `agents/openai.yaml`
  Skill UI metadata

## Recommended usage

Explicit invocation:

```text
Use $taro-weapp-native-component-bridge to diagnose why a native Mini Program component copied into dist still contains import/export.
```

Typical trigger keywords:

- Taro
- usingComponents
- agent-ui
- WeChat Mini Program native component
- import/export
- Babel
- CommonJS
- .runtime
- dist

## Core idea

Do not copy raw native component source directly into `dist`.

Use this pattern instead:

```text
source -> .runtime -> dist
```

Where:

- source keeps the original native component files
- `.runtime` contains Babel-transformed executable JS
- `dist` receives only the transformed runtime output

## Why this exists

This skill was extracted from a real Taro + `agent-ui` integration/debugging process.

The original integration failed because:

- raw native component JS was copied into `dist`
- some files still contained top-level `import/export`
- regex preprocessing fixed some files but missed others
- Mini Program runtime errors kept moving deeper into nested dependencies

The final stable solution was:

- keep native source unchanged
- preprocess JS with Babel
- output to `.runtime`
- copy only from `.runtime` to `dist`
- validate final runtime output
- inject runtime config through build-time constants instead of `process.env`

## Reference guides included

- `references/workflow.md`
- `references/error-map.md`
- `references/checklist.md`
- `references/taro-hosting.md`
- `references/teststore-case.md`
- `references/teststore-timeline.md`
- `references/teststore-recommended-config.md`
- `references/teststore-before-after.md`

## Best for

- Taro 4.x projects
- WeChat Mini Program native component mix-in scenarios
- Third-party native component directories that contain ESM-style JS

## Example problems this skill can help solve

- “Taro 接入原生小程序组件后，微信开发者工具报 Unexpected token 'export'”
- “agent-ui 在 Taro 中显示占位，dist 里仍然有 import/export”
- “.runtime 已经干净了，但 dist 里的原生组件还是报 module is not defined”
- “Mini Program runtime 报 process is not defined”

## Publishing

This repository can be shared as:

- a standalone Codex skill repository
- a team-internal skill package
- a reusable troubleshooting reference for Taro + native WeChat Mini Program component integration

## License

MIT
