# Checklist

## Before build

- Confirm the native component is registered through `usingComponents`
- Confirm the Taro route page is the real page entry
- Confirm the preprocessing step writes to `.runtime/...`
- Confirm the Taro copy step copies from `.runtime/...`, not from source

## After preprocessing

Preferred check:

```bash
rg -n "^(import|export) " .runtime -g '*.js'
```

Fallback if `rg` is unavailable:

```bash
grep -REn '^(import|export)[[:space:]]' .runtime --include='*.js'
```

Expected result:

- no output

## After Taro build

Preferred check:

```bash
rg -n "^(import|export) " dist -g '*.js'
```

Fallback:

```bash
grep -REn '^(import|export)[[:space:]]' dist --include='*.js'
```

Expected result:

- no output

## Runtime validation

- The page renders the native component instead of a placeholder
- WeChat DevTools no longer reports ESM parse errors
- No module-not-defined error for native component submodules
- No `process is not defined` in Mini Program runtime

## If still broken

- Inspect the exact file mentioned by DevTools in `dist`
- Compare it with the corresponding `.runtime` file
- Verify the copy source path is not still pointing at the original source folder
