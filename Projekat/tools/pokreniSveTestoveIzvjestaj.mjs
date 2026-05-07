import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const rootDir = process.cwd();
const docsTestingDir = path.join(rootDir, 'docs', 'testing');
const reportsRootDir = path.join(docsTestingDir, 'Izvjestaji');

function pad(value) {
  return String(value).padStart(2, '0');
}

function timestampForFolder(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}_${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}`;
}

function runCommand(command, args) {
  const result = spawnSync(command, args, {
    cwd: rootDir,
    encoding: 'utf8',
    shell: true,
    env: process.env,
  });

  return {
    exitCode: result.status ?? 1,
    output: `${result.stdout ?? ''}${result.stderr ?? ''}`,
  };
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

const startedAt = new Date();
const runId = timestampForFolder(startedAt);
const runDir = path.join(reportsRootDir, runId);
ensureDir(runDir);

const steps = [
  { id: 'unit_integration', label: 'Unit + Integration', command: 'npm', args: ['run', 'test'] },
  { id: 'coverage', label: 'Coverage', command: 'npm', args: ['run', 'test:coverage'] },
  { id: 'e2e', label: 'E2E', command: 'npm', args: ['run', 'test:e2e', '--', '--workers=1'] },
];

const results = [];
let overallSuccess = true;

for (const step of steps) {
  const res = runCommand(step.command, step.args);
  results.push({ ...step, ...res });
  fs.writeFileSync(path.join(runDir, `${step.id}.log`), res.output, 'utf8');

  if (res.exitCode !== 0) {
    overallSuccess = false;
    break;
  }
}

const coverageSummaryPath = path.join(rootDir, 'coverage', 'coverage-summary.json');
let coverage = null;

if (fs.existsSync(coverageSummaryPath)) {
  const raw = fs.readFileSync(coverageSummaryPath, 'utf8');
  coverage = JSON.parse(raw)?.total ?? null;
  fs.copyFileSync(coverageSummaryPath, path.join(runDir, 'coverage-summary.json'));
}

const finishedAt = new Date();

const summaryLines = [
  '# Izvjestaj automatskog testiranja',
  '',
  `- Pokrenuto: ${startedAt.toISOString()}`,
  `- Zavrseno: ${finishedAt.toISOString()}`,
  `- Run ID: ${runId}`,
  `- Status: ${overallSuccess ? 'PASS' : 'FAIL'}`,
  '',
  '## Izvrsene provjere',
  '',
];

for (const result of results) {
  summaryLines.push(
    `- ${result.label}: ${result.exitCode === 0 ? 'PASS' : 'FAIL'} (exit code ${result.exitCode})`
  );
}

summaryLines.push('', '## Pokrivenost');

if (coverage) {
  summaryLines.push(
    '',
    `- Statements: ${coverage.statements?.pct ?? 0}%`,
    `- Branches: ${coverage.branches?.pct ?? 0}%`,
    `- Functions: ${coverage.functions?.pct ?? 0}%`,
    `- Lines: ${coverage.lines?.pct ?? 0}%`
  );
} else {
  summaryLines.push('', '- Coverage summary nije dostupan.');
}

summaryLines.push(
  '',
  '## Artefakti',
  '',
  '- `unit_integration.log`',
  '- `coverage.log`',
  '- `e2e.log`',
  '- `coverage-summary.json` (ako postoji)',
  '',
  'Napomena: ovaj folder sadrzi sve sto je testirano u ovom pokretanju.'
);

fs.writeFileSync(path.join(runDir, 'IZVJESTAJ.md'), `${summaryLines.join('\n')}\n`, 'utf8');

const latestPointerPath = path.join(reportsRootDir, 'ZADNJI_RUN.txt');
fs.writeFileSync(
  latestPointerPath,
  `Zadnji run: ${runId}\nLokacija: docs/testing/Izvjestaji/${runId}\nStatus: ${overallSuccess ? 'PASS' : 'FAIL'}\n`,
  'utf8'
);

console.log(`Izvjestaj generisan u: ${path.join('docs', 'testing', 'Izvjestaji', runId)}`);

if (!overallSuccess) {
  process.exit(1);
}
