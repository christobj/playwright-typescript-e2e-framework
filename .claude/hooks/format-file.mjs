#!/usr/bin/env node
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const IGNORE_PATTERN = /node_modules|playwright-report|test-results/;
const LINT_PATTERN = /\.(ts|tsx|js|jsx|mjs|cjs)$/;
const FORMAT_PATTERN = /\.(ts|tsx|js|jsx|mjs|cjs|json|md|ya?ml)$/;

let input = '';
process.stdin.on('data', (chunk) => {
  input += chunk;
});

process.stdin.on('end', () => {
  let filePath;
  try {
    filePath = JSON.parse(input).tool_input?.file_path;
  } catch {
    process.exit(0);
  }

  if (!filePath || !existsSync(filePath) || IGNORE_PATTERN.test(filePath)) {
    process.exit(0);
  }

  const cwd = process.env.CLAUDE_PROJECT_DIR;
  let errorOutput = '';

  const run = (args) => {
    try {
      execFileSync('npx', args, { cwd, stdio: 'pipe' });
    } catch (err) {
      errorOutput += `${args[0]} failed on ${filePath}:\n${err.stdout}${err.stderr}\n`;
    }
  };

  if (LINT_PATTERN.test(filePath)) run(['eslint', '--fix', filePath]);
  if (FORMAT_PATTERN.test(filePath)) run(['prettier', '--write', filePath]);

  if (errorOutput) {
    process.stderr.write(errorOutput);
    process.exit(2);
  }

  process.exit(0);
});
