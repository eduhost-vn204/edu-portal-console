import { runClasp } from './clasp-runner.mjs';

async function deployV81() {
  console.log('=== DEPLOY APPS SCRIPT VERSION 81 PRODUCTION ===\n');

  console.log('1. Pushing local source files...');
  await runClasp(['push', '--force']);

  console.log('\n2. Creating version 81 on Google Apps Script...');
  const verRes = await runClasp(['version', 'v81: Hotfix auth requireAdmin trim standardization']);
  console.log('Version creation output:', verRes.stdout);

  console.log('\n3. Deploying version 81 to production deployment ID...');
  const deployRes = await runClasp([
    'deploy',
    '--deploymentId', 'AKfycbyqejp4SzgwNsJb3QrTP76C5-6K2MYqv5T1CzPyi6KUOEEsC7GKQLCnR07i0DNbqKBL',
    '--versionNumber', '81',
    '--description', 'v81: Hotfix auth requireAdmin trim standardization'
  ]);
  console.log('Deploy output:', deployRes.stdout);

  console.log('\n4. Verifying clasp deployments...');
  const listRes = await runClasp(['deployments']);
  console.log(listRes.stdout);

  console.log('\n=== HOÀN TẤT TRIỂN KHAI VERSION 81 LÊN PRODUCTION ===');
}

deployV81().catch(err => {
  console.error('Deploy error:', err);
  process.exit(1);
});
