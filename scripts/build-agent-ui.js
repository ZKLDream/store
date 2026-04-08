const fs = require('fs');
const path = require('path');
const { transformSync } = require('@babel/core');
const transformModulesCommonjs = require('@babel/plugin-transform-modules-commonjs');

const projectRoot = path.resolve(__dirname, '..');
const sourceRoot = path.join(projectRoot, 'agent-ui');
const outputRoot = path.join(projectRoot, '.runtime', 'agent-ui');

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function clearDir(dirPath) {
  fs.rmSync(dirPath, { recursive: true, force: true });
}

function walk(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files = [];

  entries.forEach((entry) => {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
      return;
    }
    files.push(fullPath);
  });

  return files;
}

function transformJs(code, filename) {
  const result = transformSync(code, {
    babelrc: false,
    configFile: false,
    filename,
    sourceType: 'module',
    comments: true,
    compact: false,
    sourceMaps: false,
    parserOpts: {
      allowReturnOutsideFunction: true,
      plugins: [
        'dynamicImport',
        'importMeta',
        'optionalChaining',
        'nullishCoalescingOperator',
        'objectRestSpread',
        'classProperties',
        'topLevelAwait',
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

  if (!result || typeof result.code !== 'string') {
    throw new Error(`Failed to transform JS file: ${filename}`);
  }

  return result.code;
}

function copyAsset(sourcePath, targetPath) {
  ensureDir(path.dirname(targetPath));
  fs.copyFileSync(sourcePath, targetPath);
}

function validateOutput(rootDir) {
  const jsFiles = walk(rootDir).filter((filePath) => path.extname(filePath) === '.js');
  const leftoverFiles = [];

  jsFiles.forEach((filePath) => {
    const code = fs.readFileSync(filePath, 'utf8');
    if (/^(?:import|export)\s/m.test(code)) {
      leftoverFiles.push(path.relative(projectRoot, filePath));
    }
  });

  if (leftoverFiles.length > 0) {
    throw new Error(
      `ESM syntax remains after build-agent-ui:\n${leftoverFiles.map((file) => `- ${file}`).join('\n')}`
    );
  }
}

function build() {
  if (!fs.existsSync(sourceRoot)) {
    throw new Error(`agent-ui source directory not found: ${sourceRoot}`);
  }

  clearDir(outputRoot);
  ensureDir(outputRoot);

  const files = walk(sourceRoot);

  files.forEach((sourcePath) => {
    const relativePath = path.relative(sourceRoot, sourcePath);
    const targetPath = path.join(outputRoot, relativePath);

    if (path.extname(sourcePath) !== '.js') {
      copyAsset(sourcePath, targetPath);
      return;
    }

    const sourceCode = fs.readFileSync(sourcePath, 'utf8');
    const transformedCode = transformJs(sourceCode, sourcePath);
    ensureDir(path.dirname(targetPath));
    fs.writeFileSync(targetPath, transformedCode, 'utf8');
  });

  validateOutput(outputRoot);

  console.log(`agent-ui build complete: ${files.length} files -> ${outputRoot}`);
}

build();
