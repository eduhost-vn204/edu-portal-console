import { runClasp } from './clasp-runner.mjs';

async function deployV86() {
  console.log('=== DEPLOY APPS SCRIPT VERSION 86 PRODUCTION (ISSUE #11) ===\n');

  console.log('1. Pushing local source files...');
  await runClasp(['push', '--force']);

  console.log('\n2. Creating version 86 on Google Apps Script...');
  const verRes = await runClasp(['version', 'v86: 1-Click Tinh Question Import & Automated Technical Scanner with Quarantine (Issue #11)']);
  console.log('Version creation output:', verRes.stdout);

  // Extract version number
  const match = verRes.stdout.match(/Created version\s+(\d+)/i) || verRes.stdout.match(/version\s+(\d+)/i);
  const versionNum = match ? match[1] : '86';
  console.log(`Detected created version: ${versionNum}`);

  console.log(`\n3. Deploying version ${versionNum} to production deployment ID...`);
  const deployRes = await runClasp([
    'deploy',
    '--deploymentId', 'AKfycbyqejp4SzgwNsJb3QrTP76C5-6K2MYqv5T1CzPyi6KUOEEsC7GKQLCnR07i0DNbqKBL',
    '--versionNumber', versionNum,
    '--description', `v${versionNum}: 1-Click Tinh Question Import & Automated Technical Scanner with Quarantine (Issue #11)`
  ]);
  console.log('Deploy output:', deployRes.stdout);

  console.log('\n4. Verifying clasp deployments...');
  const listRes = await runClasp(['deployments']);
  console.log(listRes.stdout);

  console.log(`\n=== HOÀN TẤT TRIỂN KHAI VERSION ${versionNum} LÊN PRODUCTION ===`);
}

deployV86().catch(err => {
  console.error('Deploy error:', err);
  process.exit(1);
});
