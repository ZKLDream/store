---
name: taro-weapp-native-component-bridge
description: Use when integrating native WeChat Mini Program components (wxml/wxss/js/json) into a Taro app, especially when copied JS still contains import/export, dist runtime fails with Unexpected token 'export' or Cannot use import statement outside a module, modules are undefined, or you need a Babel/CommonJS preprocessing pipeline before copying native assets into dist.
---

# Taro Native Component Bridge

Use this skill when a Taro project hosts native WeChat Mini Program components through `usingComponents`, and the native component source is not directly runnable after being copied into `dist`.

Typical triggers:

- Native component directories such as `agent-ui/` are copied into `dist`
- The copied JS still contains top-level `import` or `export`
- WeChat DevTools reports:
  - `Unexpected token 'export'`
  - `Cannot use import statement outside a module`
  - `module '.../index.js' is not defined`
  - `process is not defined`
- A regex-based preprocessing script fixed some files but missed compressed or semicolon-less ESM files

## Default approach

1. Confirm this is a real native-component-mix issue, not a Taro JSX/rendering issue.
2. Keep the Taro page as a host shell and register the native component through `usingComponents`.
3. Never copy the raw native component source directly into `dist`.
4. Preprocess only the native component directory into an intermediate runtime directory such as `.runtime/...`.
5. Use Babel module conversion to produce CommonJS-style JS; do not rely on fragile regex rewrites.
6. Copy only the preprocessed runtime directory into `dist`.
7. Validate the final `.runtime` and `dist` outputs for leftover top-level `import/export`.
8. If runtime still fails, inspect the final generated files first, not the source directory.

## Anti-patterns

- Copying the original native component folder straight into `dist`
- Assuming Taro can execute native component ESM as-is
- Matching only `import/export` lines that end with semicolons
- Validating only source files and skipping `.runtime` / `dist`
- Leaving `process.env` inside Mini Program runtime code

## References

- For the end-to-end workflow, read [references/workflow.md](references/workflow.md).
- For Taro host-page responsibilities and `usingComponents`, read [references/taro-hosting.md](references/taro-hosting.md).
- For error-to-root-cause mapping, read [references/error-map.md](references/error-map.md).
- For build and verification checks, read [references/checklist.md](references/checklist.md).
- For a concrete example from this repository, read [references/teststore-case.md](references/teststore-case.md).
- For the actual debugging timeline from this repository, read [references/teststore-timeline.md](references/teststore-timeline.md).
- For the final recommended config set from this repository, read [references/teststore-recommended-config.md](references/teststore-recommended-config.md).
- For a before/after comparison of the final decisions, read [references/teststore-before-after.md](references/teststore-before-after.md).

## Bundled script template

Use [scripts/build-native-component-template.js](scripts/build-native-component-template.js) as the default pattern for:

- walking a native component source directory
- Babel-transforming JS to CommonJS
- copying non-JS assets unchanged
- failing fast if output still contains top-level ESM

Prefer adapting this template over inventing a fresh regex-based preprocessor.
