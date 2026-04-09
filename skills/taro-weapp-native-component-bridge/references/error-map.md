# Error Map

## `Unexpected token 'export'`

Most common cause:

- JS copied into `.runtime` or `dist` still contains top-level `export`

Check:

- The preprocessing script did not transform every JS file
- A regex rule missed compressed, semicolon-less, or unusual ESM syntax
- The copy step still points at source instead of `.runtime`

## `Cannot use import statement outside a module`

Most common cause:

- JS copied into Mini Program runtime still contains top-level `import`

Check:

- Intermediate output and final `dist` output, not only source files
- Utility subdirectories inside the native component, especially markdown or highlight helpers

## `module '.../index.js' is not defined`

Most common cause:

- The target file failed to parse earlier, so the Mini Program runtime never registered it

Check:

- The referenced file for leftover `import/export`
- The exact file mentioned in the error first
- Subcomponent dependencies that may still be ESM

## `process is not defined`

Most common cause:

- Mini Program runtime code still contains `process.env` access

Fix direction:

- Read env vars only in Taro config or Node build scripts
- Inject runtime values through build-time constants

## White screen after component loads

Common causes:

- The host page is rendering a placeholder instead of the native component
- The Taro shell is correct, but the copied native component runtime is stale
- Layout heights are fighting between the host card and the native component root

Fix order:

1. Confirm the runtime JS is clean
2. Confirm the Taro host page is the real route entry
3. Then debug layout
