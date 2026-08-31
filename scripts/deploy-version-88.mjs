import { runClasp } from './clasp-runner.mjs';

async function deployV88() {
  console.log('=== DEPLOY APPS SCRIPT VERSION 88 PRODUCTION ===\n');

  console.log('1. Pushing local source files...');
  await runClasp(['push', '--force']);

  console.log('\n2. Creating version 88 on Google Apps Script...');
  const verRes = await runClasp(['version', 'v88: Add getQuestionStats and importQuestionsBatch with dryRun and idempotent support (Issue #19)']);
  console.log('Version creation output:', verRes.stdout);

  const match = verRes.stdout.match(/Created version\s+(\d+)/i) || verRes.stdout.match(/version\s+(\d+)/i);
  const versionNum = match ? match[1] : '88';
  console.log(`Detected created version: ${versionNum}`);

  console.log(`\n3. Deploying version ${versionNum} to production deployment ID...`);
  const deployRes = await runClasp([
    'deploy',
    '--deploymentId', 'AKfycbyqejp4SzgwNsJb3QrTP76C5-6K2MYqv5T1CzPyi6KUOEEsC7GKQLCnR07i0DNbqKBL',
    '--versionNumber', versionNum,
    '--description', `v${versionNum}: Add getQuestionStats and importQuestionsBatch with dryRun and idempotent support (Issue #19)`
  ]);
  console.log('Deploy output:', deployRes.stdout);

  console.log(`\n=== HOÀN TẤT TRIỂN KHAI VERSION ${versionNum} LÊN PRODUCTION ===`);
}

deployV88().catch(err => {
  console.error('Deploy error:', err);
  process.exit(1);
});
