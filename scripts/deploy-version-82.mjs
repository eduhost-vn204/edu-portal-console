import { runClasp } from './clasp-runner.mjs';

async function deployV82() {
  console.log('=== DEPLOY APPS SCRIPT VERSION 82 PRODUCTION ===\n');

  console.log('1. Pushing local source files...');
  await runClasp(['push', '--force']);

  console.log('\n2. Creating version 82 on Google Apps Script...');
  const verRes = await runClasp(['version', 'v82: Fix dynamic header column mapping in importnganhang']);
  console.log('Version creation output:', verRes.stdout);

  console.log('\n3. Deploying version 82 to production deployment ID...');
  const deployRes = await runClasp([
    'deploy',
    '--deploymentId', 'AKfycbyqejp4SzgwNsJb3QrTP76C5-6K2MYqv5T1CzPyi6KUOEEsC7GKQLCnR07i0DNbqKBL',
    '--versionNumber', '82',
    '--description', 'v82: Fix dynamic header column mapping in importnganhang'
  ]);
  console.log('Deploy output:', deployRes.stdout);

  console.log('\n4. Verifying clasp deployments...');
  const listRes = await runClasp(['deployments']);
  console.log(listRes.stdout);

  console.log('\n=== HOÀN TẤT TRIỂN KHAI VERSION 82 LÊN PRODUCTION ===');
}

deployV82().catch(err => {
  console.error('Deploy error:', err);
  process.exit(1);
});
