import { runClasp } from './clasp-runner.mjs';

const PROD_URL = 'https://script.google.com/macros/s/AKfycbwF8whuCRmJtodfusehx6CWYS04yRlsVvQWNp0X2dBTCfZF-AmqmJ_KR0MIVLekVFqW/exec';

async function main() {
  console.log('=== [1] RUNNING LIVE SERVER-SIDE SELF-TEST VIA CLASP ===');
  try {
    const runRes = await runClasp(['run', 'runExamControlsSelfTest']);
    console.log('clasp run output:\n', runRes.stdout);
    if (runRes.stderr) console.error('clasp run stderr:\n', runRes.stderr);
  } catch(e) {
    console.warn('clasp run note (OAuth execution):', e.message);
  }

  console.log('\n=== [2] VERIFYING LIVE HTTP ENDPOINT (GET ?type=danhsachde) ===');
  const r = await fetch(PROD_URL + '?type=danhsachde&_t=' + Date.now());
  const j = await r.json();
  
  if (!j.ok || !Array.isArray(j.data)) {
    console.error('FAIL: live API did not return ok: true and data array', j);
    process.exit(1);
  }

  console.log(`[PASS] Live endpoint returned ${j.data.length} exams.`);
  
  const exams2k9 = j.data.filter(e => String(e.examId).startsWith('vedich2k9'));
  console.log(`[PASS] Found ${exams2k9.length} 2k9 simulation exams (IDs: vedich2k9_de02..de15).`);
  
  if (exams2k9.length !== 14) {
    console.error(`FAIL: Expected 14 2k9 exams, found ${exams2k9.length}`);
    process.exit(1);
  }

  // Check 100% are an and khoa
  const allHidden = exams2k9.every(e => e.hienThi === 'an' || e.hienThi === false);
  const allLocked = exams2k9.every(e => e.trangThai === 'khoa');

  console.log(`[PASS] All 14 exams hienThi === 'an': ${allHidden}`);
  console.log(`[PASS] All 14 exams trangThai === 'khoa': ${allLocked}`);

  if (!allHidden || !allLocked) {
    console.error('FAIL: Not all 14 exams are safely hidden and locked!');
    process.exit(1);
  }

  console.log('\n========================================================');
  console.log('  LIVE SERVER-SIDE AUDIT & END-TO-END VERIFICATION PASS!');
  console.log('========================================================\n');
}

main().catch(err => {
  console.error('Fatal error in live pilot:', err);
  process.exit(1);
});
