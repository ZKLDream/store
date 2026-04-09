# Workflow

## Standard flow

1. Verify the host page shape.
   - Taro page remains the route entry.
   - `usingComponents` registers the native component.
   - The native component is rendered inside a simple host shell.

2. Trace the build chain.
   - Source native component directory
   - Intermediate runtime directory such as `.runtime/...`
   - Final copied directory in `dist/...`

3. Inspect final runtime artifacts.
   - Start with `.runtime`
   - Then inspect `dist`
   - Do not stop at source-only inspection

4. If copied JS still contains ESM:
   - Replace regex preprocessing with Babel module conversion
   - Transform only the native component directory
   - Leave Taro app source untouched

5. Re-check the final output.
   - Confirm no top-level `import/export` remains
   - Confirm `usingComponents` still points at the copied runtime directory
   - Confirm the native component page is backed by the Taro host shell, not an overwritten raw page

6. Only after the build chain is clean, debug layout or runtime behavior.

## Real-project example

If you want a concrete sample of this workflow in practice, read [teststore-case.md](teststore-case.md).
If you want the stable config end state from that sample, read [teststore-recommended-config.md](teststore-recommended-config.md).

## Recommended architecture

- Native component source stays in its original form
- Build step writes transformed output to `.runtime/<component-name>`
- Taro copy step copies from `.runtime/<component-name>` to `dist/<component-name>`
- Taro page hosts the component with `usingComponents`
- Build-time constants inject env configuration; runtime code does not read `process.env`
