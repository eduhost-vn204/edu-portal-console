import { runClasp } from './clasp-runner.mjs';

async function deployV87() {
  console.log('=== DEPLOY APPS SCRIPT VERSION 87 PRODUCTION ===\n');

  console.log('1. Pushing local source files...');
  await runClasp(['push', '--force']);

  console.log('\n2. Creating version 87 on Google Apps Script...');
  const verRes = await runClasp(['version', 'v87: Fix exact positional correct answer mapping and auto-update existing tinh rows']);
  console.log('Version creation output:', verRes.stdout);

  const match = verRes.stdout.match(/Created version\s+(\d+)/i) || verRes.stdout.match(/version\s+(\d+)/i);
  const versionNum = match ? match[1] : '87';
  console.log(`Detected created version: ${versionNum}`);

  console.log(`\n3. Deploying version ${versionNum} to production deployment ID...`);
  const deployRes = await runClasp([
    'deploy',
    '--deploymentId', 'AKfycbyqejp4SzgwNsJb3QrTP76C5-6K2MYqv5T1CzPyi6KUOEEsC7GKQLCnR07i0DNbqKBL',
    '--versionNumber', versionNum,
    '--description', `v${versionNum}: Fix exact positional correct answer mapping and auto-update existing tinh rows`
  ]);
  console.log('Deploy output:', deployRes.stdout);

  console.log(`\n=== HOÀN TẤT TRIỂN KHAI VERSION ${versionNum} LÊN PRODUCTION ===`);
}

deployV87().catch(err => {
  console.error('Deploy error:', err);
  process.exit(1);
});
