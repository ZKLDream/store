# testStore debugging timeline

This file captures the actual path that led from the first broken integration attempt to the final stable pattern used in this repository.

If you want the outcome summarized as a side-by-side comparison, read [teststore-before-after.md](teststore-before-after.md).

## Phase 1: The host page rendered, but the native component runtime was wrong

Initial direction:

- The Taro page was used as the visible route entry for the AI page.
- The native `agent-ui` component directory was copied toward the Mini Program build output.

What went wrong:

- The copied native JS still contained top-level `import/export`.
- WeChat DevTools treated those files as normal Mini Program scripts, not ESM modules.
- The result was parse-time failures rather than normal runtime logic failures.

Typical symptoms:

- `Unexpected token 'export'`
- `Cannot use import statement outside a module`

Key lesson:

- If the native component source includes ESM, direct copy to `dist` is not a valid integration strategy.

## Phase 2: Regex preprocessing looked promising, but it was incomplete

First fix attempt:

- Add a preprocessing step before copy.
- Rewrite `import/export` with regex rules.

Why it failed:

- Some files used semicolon-less ESM
- Some helper files were compressed or single-line
- Some utility files in nested subdirectories were easy to miss

Observed pattern:

- A few files were converted successfully
- Other files still leaked ESM into `.runtime` or `dist`
- Failures moved deeper into the dependency tree instead of disappearing

Representative example from this project:

- `wd-markdown` and its utility files were among the places where partial conversion was not enough

Key lesson:

- Regex preprocessing is fragile for third-party native component trees.
- Even if it fixes the entry file, nested helpers may still break the runtime.

## Phase 3: The real target was not the source tree, but the final runtime artifacts

Important realization:

- Looking only at `agent-ui/` was not enough
- Looking only at `.runtime/` was not enough
- The actual truth was the final copied output in `dist`

What happened:

- In some rounds, `.runtime/agent-ui` looked clean
- But `dist/agent-ui` still contained stale or unconverted files
- This created confusing situations where source and intermediate output looked fixed, but WeChat DevTools still failed

Key lesson:

- Always validate both:
  - `.runtime/<component>`
  - `dist/<component>`

- The final copied runtime output is what Mini Program actually executes.

## Phase 4: Babel AST/module conversion became the stable fix

Final turning point:

- Replace regex rewriting with Babel-based module transformation

Why this worked:

- Babel handled full JS parsing instead of text matching
- It covered semicolon-less ESM and compressed files
- It gave one uniform conversion strategy for every JS file in the native component tree

In this project, the stable pattern became:

1. Source directory stays in original form: `agent-ui/`
2. Build script transforms JS into `.runtime/agent-ui`
3. Taro copies from `.runtime/agent-ui` into `dist/agent-ui`
4. Build fails if generated runtime files still contain top-level ESM

Key lesson:

- For native Mini Program component trees, Babel/CommonJS preprocessing is the reliable solution.

## Phase 5: Runtime config was a separate Mini Program problem

After ESM issues were resolved, another error surfaced:

- `process is not defined`

Root cause:

- Mini Program runtime code was still reading `process.env`

Final fix direction:

- Read env values only in Taro config / Node build stage
- Inject runtime values via build-time constants
- Consume those constants inside `src/config/ai.ts`

Key lesson:

- Solving module-format issues does not solve runtime-environment issues.
- Mini Program code must not depend on Node globals.

## Phase 6: The stable end state for this project

The final integration pattern in `testStore` is:

- Taro route page remains the host page
- `usingComponents` mounts the native component
- `agent-ui/` remains source-of-truth for native assets
- `scripts/build-agent-ui.js` preprocesses JS into `.runtime/agent-ui`
- `config/index.ts` copies from `.runtime/agent-ui` to `dist/agent-ui`
- Build-time constants replace runtime `process.env`

This combination is the reusable conclusion of the incident.

## Practical rules extracted from the timeline

1. Do not copy raw native component JS directly into `dist`.
2. Do not trust regex preprocessing for third-party Mini Program component trees.
3. Always inspect final runtime artifacts, not just source or intermediate output.
4. Treat module-format conversion and runtime-environment injection as separate problems.
5. Prefer one deterministic build chain:
   - source -> `.runtime` -> `dist`

## When to reuse this timeline

Use this timeline when:

- a Taro project starts failing right after native component copy
- the same ESM error keeps moving between different nested files
- `.runtime` looks fixed but DevTools still fails
- the team needs a postmortem-style explanation of why Babel conversion became necessary
