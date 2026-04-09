#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { transformSync } = require("@babel/core");
const transformModulesCommonjs = require("@babel/plugin-transform-modules-commonjs");

function usage() {
  console.error("Usage: node build-native-component-template.js <sourceDir> <outputDir>");
  process.exit(1);
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function clearDir(dirPath) {
  fs.rmSync(dirPath, { recursive: true, force: true });
}

function walk(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
      continue;
    }
    files.push(fullPath);
  }

  return files;
}

function transformJs(code, filename) {
  const result = transformSync(code, {
    babelrc: false,
    configFile: false,
    filename,
    sourceType: "module",
    comments: true,
    compact: false,
    sourceMaps: false,
    parserOpts: {
      allowReturnOutsideFunction: true,
      plugins: [
        "dynamicImport",
        "importMeta",
        "optionalChaining",
        "nullishCoalescingOperator",
        "objectRestSpread",
        "classProperties",
        "topLevelAwait",
      ],
    },
    plugins: [
      [
        transformModulesCommonjs,
        {
          loose: true,
          allowTopLevelThis: true,
        },
      ],
    ],
  });

  if (!result || typeof result.code !== "string") {
    throw new Error(`Failed to transform JS file: ${filename}`);
  }

  return result.code;
}

function copyAsset(sourcePath, targetPath) {
  ensureDir(path.dirname(targetPath));
  fs.copyFileSync(sourcePath, targetPath);
}

function validateOutput(rootDir) {
  const jsFiles = walk(rootDir).filter((filePath) => path.extname(filePath) === ".js");
  const leftoverFiles = [];

  for (const filePath of jsFiles) {
    const code = fs.readFileSync(filePath, "utf8");
    if (/^(?:import|export)\s/m.test(code)) {
      leftoverFiles.push(path.relative(process.cwd(), filePath));
    }
  }

  if (leftoverFiles.length > 0) {
    throw new Error(
      `ESM syntax remains after native component build:\n${leftoverFiles.map((file) => `- ${file}`).join("\n")}`
    );
  }
}

function main() {
  const [, , sourceArg, outputArg] = process.argv;

  if (!sourceArg || !outputArg) {
    usage();
  }

  const sourceRoot = path.resolve(process.cwd(), sourceArg);
  const outputRoot = path.resolve(process.cwd(), outputArg);

  if (!fs.existsSync(sourceRoot)) {
    throw new Error(`Source directory not found: ${sourceRoot}`);
  }

  clearDir(outputRoot);
  ensureDir(outputRoot);

  const files = walk(sourceRoot);

  for (const sourcePath of files) {
    const relativePath = path.relative(sourceRoot, sourcePath);
    const targetPath = path.join(outputRoot, relativePath);

    if (path.extname(sourcePath) !== ".js") {
      copyAsset(sourcePath, targetPath);
      continue;
    }

    const sourceCode = fs.readFileSync(sourcePath, "utf8");
    const transformedCode = transformJs(sourceCode, sourcePath);
    ensureDir(path.dirname(targetPath));
    fs.writeFileSync(targetPath, transformedCode, "utf8");
  }

  validateOutput(outputRoot);

  console.log(`Native component build complete: ${files.length} files -> ${outputRoot}`);
}

main();
