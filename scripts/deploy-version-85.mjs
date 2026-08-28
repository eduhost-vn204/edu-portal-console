import { runClasp } from './clasp-runner.mjs';

async function deployV85() {
  console.log('=== DEPLOY APPS SCRIPT VERSION 85 PRODUCTION ===\n');

  console.log('1. Pushing local source files...');
  await runClasp(['push', '--force']);

  console.log('\n2. Creating version 85 on Google Apps Script...');
  const verRes = await runClasp(['version', 'v85: Fix lastRealRow declaration in importNganHang']);
  console.log('Version creation output:', verRes.stdout);

  console.log('\n3. Deploying version 85 to production deployment ID...');
  const deployRes = await runClasp([
    'deploy',
    '--deploymentId', 'AKfycbyqejp4SzgwNsJb3QrTP76C5-6K2MYqv5T1CzPyi6KUOEEsC7GKQLCnR07i0DNbqKBL',
    '--versionNumber', '85',
    '--description', 'v85: Fix lastRealRow declaration in importNganHang'
  ]);
  console.log('Deploy output:', deployRes.stdout);

  console.log('\n4. Verifying clasp deployments...');
  const listRes = await runClasp(['deployments']);
  console.log(listRes.stdout);

  console.log('\n=== HOÀN TẤT TRIỂN KHAI VERSION 85 LÊN PRODUCTION ===');
}

deployV85().catch(err => {
  console.error('Deploy error:', err);
  process.exit(1);
});
