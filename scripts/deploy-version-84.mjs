import { runClasp } from './clasp-runner.mjs';

async function deployV84() {
  console.log('=== DEPLOY APPS SCRIPT VERSION 84 PRODUCTION ===\n');

  console.log('1. Pushing local source files...');
  await runClasp(['push', '--force']);

  console.log('\n2. Creating version 84 on Google Apps Script...');
  const verRes = await runClasp(['version', 'v84: Bulletproof lastRealRow countBefore and case-insensitive column fallback']);
  console.log('Version creation output:', verRes.stdout);

  console.log('\n3. Deploying version 84 to production deployment ID...');
  const deployRes = await runClasp([
    'deploy',
    '--deploymentId', 'AKfycbyqejp4SzgwNsJb3QrTP76C5-6K2MYqv5T1CzPyi6KUOEEsC7GKQLCnR07i0DNbqKBL',
    '--versionNumber', '84',
    '--description', 'v84: Bulletproof lastRealRow countBefore and case-insensitive column fallback'
  ]);
  console.log('Deploy output:', deployRes.stdout);

  console.log('\n4. Verifying clasp deployments...');
  const listRes = await runClasp(['deployments']);
  console.log(listRes.stdout);

  console.log('\n=== HOÀN TẤT TRIỂN KHAI VERSION 84 LÊN PRODUCTION ===');
}

deployV84().catch(err => {
  console.error('Deploy error:', err);
  process.exit(1);
});
