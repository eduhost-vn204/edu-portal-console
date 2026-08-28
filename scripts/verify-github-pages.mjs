import https from 'https';

function fetchText(u) {
  return new Promise((resolve, reject) => {
    https.get(u, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchText(res.headers.location));
      }
      let raw = '';
      res.on('data', d => raw += d);
      res.on('end', () => resolve({ status: res.statusCode, body: raw }));
    }).on('error', reject);
  });
}

async function verifyLivePages() {
  console.log('=== VERIFYING GITHUB PAGES DEPLOYMENTS ===\n');
  
  // 1. LMS live teaching-scope.js
  const lmsRes = await fetchText('https://vatlyxuantruong.io.vn/teaching-scope.js?t=' + Date.now());
  console.log('1. LMS (vatlyxuantruong.io.vn/teaching-scope.js):');
  console.log('   HTTP Status:               ', lmsRes.status);
  console.log('   Has fail-closed TINH check:', lmsRes.body.includes("rawTier === 'tinh'"));
  console.log('   Length:                    ', lmsRes.body.length);
  
  // 2. Admin live index.html
  const adminRes = await fetchText('https://eduhost-vn204.github.io/edu-portal-console/index.html?t=' + Date.now());
  console.log('\n2. Admin (eduhost-vn204.github.io/edu-portal-console/index.html):');
  console.log('   HTTP Status:               ', adminRes.status);
  console.log('   Has bankMarkChatLuongPrompt:', adminRes.body.includes('bankMarkChatLuongPrompt'));
  console.log('   Has nhe-chatluong dropdown:', adminRes.body.includes('nhe-chatluong'));
  console.log('   Has 3-state badges:        ', adminRes.body.includes('Chưa duyệt — cần thẩm định'));
  console.log('   Length:                    ', adminRes.body.length);

  console.log('\n=== KẾT QUẢ XÁC NHẬN GITHUB PAGES HOÀN TẤT ===');
}

verifyLivePages().catch(console.error);
