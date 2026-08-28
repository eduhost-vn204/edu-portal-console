import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import https from 'https';

const REPO_DIR = 'C:\\Users\\Xuan Truong\\.gemini\\antigravity\\brain\\e36e7db9-4957-452f-9e82-1608c27a5ece\\scratch\\vatly-content-studio-private';
const BATCH_DIR = path.join(REPO_DIR, 'content-pipeline', 'chuong-1', '05-approved-output', 'chapter-1-batch-001');

function getJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(getJson(res.headers.location));
      }
      let raw = '';
      res.on('data', d => raw += d);
      res.on('end', () => {
        try {
          resolve(JSON.parse(raw));
        } catch (e) {
          resolve(raw);
        }
      });
    }).on('error', reject);
  });
}

function sha256File(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buf).digest('hex');
}

async function main() {
  console.log('=== VERIFYING BATCH 001 HANDOVER ===\n');

  // 1. Verify Checksums
  const checksumsFile = path.join(BATCH_DIR, 'batch-001-checksums.json');
  const checksumsData = JSON.parse(fs.readFileSync(checksumsFile, 'utf8'));
  
  let mismatchCount = 0;
  console.log('1. Checking file checksums against batch-001-checksums.json:');
  const fileEntries = checksumsData.files || checksumsData;
  for (const [relPath, entry] of Object.entries(fileEntries)) {
    const expectedHash = typeof entry === 'string' ? entry : entry.sha256;
    const targetPath = path.join(BATCH_DIR, relPath);
    if (!fs.existsSync(targetPath)) {
      console.error(`   MISSING: ${relPath}`);
      mismatchCount++;
      continue;
    }
    const actualHash = sha256File(targetPath);
    if (actualHash.toLowerCase() === expectedHash.toLowerCase()) {
      console.log(`   MATCH: ${relPath} (${actualHash.slice(0, 16)}...)`);
    } else {
      console.error(`   MISMATCH: ${relPath} (expected ${expectedHash}, got ${actualHash})`);
      mismatchCount++;
    }
  }
  console.log(`   Total mismatches: ${mismatchCount}\n`);

  // 2. Secret / PDF scan
  console.log('2. Scanning for secrets, tokens, PDFs:');
  function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        if (ent.name !== '.git') scanDir(full);
      } else {
        if (ent.name.endsWith('.pdf')) {
          console.warn(`   WARNING: PDF file found: ${full}`);
        }
        if (/id_rsa|token|secret|\.env/i.test(ent.name)) {
          console.warn(`   WARNING: Secret file found: ${full}`);
        }
      }
    }
  }
  scanDir(REPO_DIR);
  console.log('   Scan finished.\n');

  // 3. Load batch files
  const pilot5Ids = JSON.parse(fs.readFileSync(path.join(BATCH_DIR, 'pilot-5-ids.json'), 'utf8'));
  const pilot5Candidate = JSON.parse(fs.readFileSync(path.join(BATCH_DIR, 'pilot-5-website-candidate.json'), 'utf8'));
  const teacherApproved = JSON.parse(fs.readFileSync(path.join(BATCH_DIR, 'teacher-approved-questions.json'), 'utf8'));
  const approvalManifest = JSON.parse(fs.readFileSync(path.join(BATCH_DIR, 'approval-manifest.json'), 'utf8'));
  const mediaManifest = JSON.parse(fs.readFileSync(path.join(BATCH_DIR, 'media-manifest.json'), 'utf8'));
  const mappingDoc = fs.readFileSync(path.join(BATCH_DIR, 'website-field-mapping.md'), 'utf8');

  console.log('3. Batch file summaries:');
  console.log(`   approval-manifest total approved: ${approvalManifest.total_approved || approvalManifest.approved_count || Object.keys(approvalManifest).length}`);
  console.log(`   teacher-approved-questions total: ${teacherApproved.length}`);
  console.log(`   pilot-5-ids:`, pilot5Ids);
  console.log(`   pilot-5-website-candidate length: ${pilot5Candidate.length}`);
  console.log(`   media-manifest:`, mediaManifest);

  // 4. Fetch production bank to test ID collision
  console.log('\n4. Fetching production bank (5,438 questions) for collision check...');
  const prodBankRes = await getJson('https://script.google.com/macros/s/AKfycbyqejp4SzgwNsJb3QrTP76C5-6K2MYqv5T1CzPyi6KUOEEsC7GKQLCnR07i0DNbqKBL/exec?type=nganhang');
  const prodQuestions = prodBankRes.data || [];
  console.log(`   Production question count: ${prodQuestions.length}`);

  const prodIdSet = new Set(prodQuestions.map(q => String(q.id).trim()));
  const candidateIds = pilot5Candidate.map(q => String(q.id || q.canonical_id || q.code).trim());
  const duplicateIds = candidateIds.filter(id => prodIdSet.has(id));
  console.log(`   Candidate IDs:`, candidateIds);
  console.log(`   Duplicate IDs with production:`, duplicateIds);

  // 5. Structure & KaTeX check on 5 pilot questions
  console.log('\n5. Verifying structure and KaTeX of 5 pilot candidate questions:');
  const invalidItems = [];
  pilot5Candidate.forEach((q, idx) => {
    const id = q.id || q.canonical_id || q.code;
    const errors = [];
    if (!q.question && !q.deBaiChung) errors.push('Missing question text');
    if (!q.optA || !q.optB || !q.optC || !q.optD) errors.push('Missing options A/B/C/D');
    const corr = String(q.correct || '').trim().toUpperCase();
    if (!['A', 'B', 'C', 'D'].includes(corr)) errors.push(`Invalid correct answer: ${corr}`);

    // Check if Option A is the approved option or if correct matches approved
    const originalApproved = teacherApproved.find(orig => (orig.id === id || orig.canonical_id === id || orig.code === id));
    if (!originalApproved) {
      errors.push('Not found in teacher-approved-questions.json');
    }

    if (q.media || q.hinhAnh) {
      errors.push('Unexpected media in pilot question');
    }

    if (errors.length) {
      invalidItems.push({ id, errors });
      console.error(`   [FAIL] Question ${id}:`, errors.join(', '));
    } else {
      console.log(`   [OK] Question ${id} (type=${q.loai||'TN'}, correct=${corr}, chuong=${q.chuong}, baiHoc=${q.baiHoc})`);
    }
  });

  console.log(`   Total invalid pilot items: ${invalidItems.length}`);
}

main().catch(console.error);
