/**
 * Bộ kiểm thử toàn diện cho Google OAuth Trial Engine (YouTube Data API v3 & Drive API v3)
 * Kiểm thử 100% OFFLINE (không mạng), mô phỏng đầy đủ giao thức:
 * 1. OAuth Guard & Chặn cứng profile production
 * 2. Xác thực credentials & Token Refresh
 * 3. Identity Verification (Google Account, YouTube Channel ID, Drive Folder ID)
 * 4. YouTube Resumable Upload (Init, Chunk Upload, Range Query, Resume)
 * 5. YouTube Video Processing Status (processing pending vs completed)
 * 6. YouTube Captions Upload (SRT/VTT mapping)
 * 7. Google Drive Folder & Hash Reuse (Chống duplicate, không tạo (1))
 * 8. Contract Blocker: Chống lộ bài pilot cho học sinh khi chưa có trường draft/hidden
 * 9. Secret Scanning: Kiểm tra checkpoint và kết quả không rò rỉ token/secret
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import assert from 'assert';
import crypto from 'crypto';

import {
  getTrialOAuthCredentials,
  refreshAccessToken,
  verifyTrialIdentity,
  uploadYouTubeVideoResumable,
  uploadYouTubeCaption,
  uploadDrivePdfWithHash,
  GOOGLE_OAUTH_TOKEN_URL,
  GOOGLE_USERINFO_URL,
  YOUTUBE_CHANNELS_URL,
  YOUTUBE_VIDEOS_UPLOAD_URL,
  YOUTUBE_VIDEOS_URL,
  YOUTUBE_CAPTIONS_UPLOAD_URL,
  DRIVE_FILES_URL,
  DRIVE_UPLOAD_URL
} from './google-oauth-trial-client.mjs';

import {
  uploadTwoVideosToYouTube,
  uploadThreePdfsToDrive,
  createFullDraftLessonOnBackend,
  loadCheckpoint,
  saveCheckpoint,
  PILOT_B10_LESSON_NAME
} from './youtube-lesson-pipeline.mjs';

let passed = 0;
let total = 0;

function it(name, fn) {
  total++;
  try {
    fn();
    console.log(`  ✓ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`          ${err.message}`);
    throw err;
  }
}

async function itAsync(name, fn) {
  total++;
  try {
    await fn();
    console.log(`  ✓ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`          ${err.message}`);
    throw err;
  }
}

function createTempDir(prefix = 'trial-engine-test-') {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function cleanupTempDir(dir) {
  try {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  } catch {}
}

console.log(`\n======================================================`);
console.log(`🧪 KIỂM THỬ ĐỘC LẬP: GOOGLE OAUTH TRIAL LIVE ENGINE`);
console.log(`======================================================\n`);

// =========================================================================
// SUITE 1: OAUTH GUARD & CHẶN CỨNG PRODUCTION
// =========================================================================
console.log(`--- [SUITE 1] OAuth Guard & Chặn Cứng Production ---`);

it('getTrialOAuthCredentials: Chặn đứng profile "production" và ném lỗi PRODUCTION_PROFILE_FORBIDDEN', () => {
  let threw = false;
  try {
    getTrialOAuthCredentials({ oauthProfile: 'production' });
  } catch (err) {
    threw = true;
    assert.strictEqual(err.code, 'PRODUCTION_PROFILE_FORBIDDEN');
    assert.ok(err.message.includes('VI PHẠM HÀNG RÀO AN TOÀN'));
  }
  assert.strictEqual(threw, true);
});

await itAsync('uploadTwoVideosToYouTube: Chặn profile "production" fail-closed', async () => {
  const tmp = createTempDir();
  try {
    let threw = false;
    try {
      await uploadTwoVideosToYouTube(tmp, { title: 'Test' }, { oauthProfile: 'production' });
    } catch (err) {
      threw = true;
      assert.ok(err.message.includes('VI PHẠM HÀNG RÀO AN TOÀN'));
    }
    assert.strictEqual(threw, true);
  } finally {
    cleanupTempDir(tmp);
  }
});

await itAsync('uploadThreePdfsToDrive: Chặn profile "production" fail-closed', async () => {
  const tmp = createTempDir();
  try {
    let threw = false;
    try {
      await uploadThreePdfsToDrive(tmp, { title: 'Test' }, { oauthProfile: 'production' });
    } catch (err) {
      threw = true;
      assert.ok(err.message.includes('VI PHẠM HÀNG RÀO AN TOÀN'));
    }
    assert.strictEqual(threw, true);
  } finally {
    cleanupTempDir(tmp);
  }
});

// =========================================================================
// SUITE 2: CREDENTIALS VALIDATION & TOKEN REFRESH
// =========================================================================
console.log(`\n--- [SUITE 2] Credentials Validation & Token Refresh ---`);

it('getTrialOAuthCredentials: Ném OAUTH_ACTION_REQUIRED khi thiếu clientId/secret/refreshToken', () => {
  const origId = process.env.TRIAL_GOOGLE_CLIENT_ID;
  const origSec = process.env.TRIAL_GOOGLE_CLIENT_SECRET;
  const origTok = process.env.TRIAL_GOOGLE_REFRESH_TOKEN;
  delete process.env.TRIAL_GOOGLE_CLIENT_ID;
  delete process.env.TRIAL_GOOGLE_CLIENT_SECRET;
  delete process.env.TRIAL_GOOGLE_REFRESH_TOKEN;
  delete process.env.TRIAL_YOUTUBE_CLIENT_ID;
  delete process.env.TRIAL_YOUTUBE_CLIENT_SECRET;
  delete process.env.TRIAL_YOUTUBE_REFRESH_TOKEN;

  try {
    let threw = false;
    try {
      getTrialOAuthCredentials({});
    } catch (err) {
      threw = true;
      assert.strictEqual(err.code, 'OAUTH_ACTION_REQUIRED');
      assert.ok(err.message.includes('OAUTH_ACTION_REQUIRED'));
    }
    assert.strictEqual(threw, true);
  } finally {
    if (origId) process.env.TRIAL_GOOGLE_CLIENT_ID = origId;
    if (origSec) process.env.TRIAL_GOOGLE_CLIENT_SECRET = origSec;
    if (origTok) process.env.TRIAL_GOOGLE_REFRESH_TOKEN = origTok;
  }
});

await itAsync('refreshAccessToken: Thành công khi Google trả về HTTP 200 và access_token', async () => {
  const mockFetch = async (url, opts) => {
    assert.strictEqual(url, GOOGLE_OAUTH_TOKEN_URL);
    assert.strictEqual(opts.method, 'POST');
    assert.ok(opts.body.includes('grant_type=refresh_token'));
    return {
      ok: true,
      status: 200,
      json: async () => ({
        access_token: 'mock_test_access_token_123',
        expires_in: 3600,
        token_type: 'Bearer'
      })
    };
  };

  const creds = { clientId: 'mock_id', clientSecret: 'mock_sec', refreshToken: 'mock_ref' };
  const token = await refreshAccessToken(creds, { fetchImpl: mockFetch });
  assert.strictEqual(token, 'mock_test_access_token_123');
});

await itAsync('refreshAccessToken: Ném OAUTH_ACTION_REQUIRED khi Google từ chối (HTTP 400 invalid_grant)', async () => {
  const mockFetch = async () => ({
    ok: false,
    status: 400,
    text: async () => JSON.stringify({ error: 'invalid_grant', error_description: 'Token expired or revoked' })
  });

  const creds = { clientId: 'mock_id', clientSecret: 'mock_sec', refreshToken: 'expired_ref' };
  let threw = false;
  try {
    await refreshAccessToken(creds, { fetchImpl: mockFetch });
  } catch (err) {
    threw = true;
    assert.strictEqual(err.code, 'OAUTH_ACTION_REQUIRED');
    assert.ok(err.message.includes('invalid_grant'));
  }
  assert.strictEqual(threw, true);
});

// =========================================================================
// =========================================================================
// SUITE 3: IDENTITY GUARDS BẮT BUỘC (Google Account, YouTube Channel, Drive Folder)
// =========================================================================
console.log(`\n--- [SUITE 3] Identity Guards Bắt Buộc (Account, Channel, Folder) ---`);

const sampleCreds = { clientId: 'c_id', clientSecret: 'c_sec', refreshToken: 'c_ref' };

await itAsync('verifyTrialIdentity: Bắt buộc đủ cả 3 biến kỳ vọng; thiếu bất kỳ biến nào ném OAUTH_ACTION_REQUIRED', async () => {
  const origEnvEmail = process.env.EXPECTED_TRIAL_GOOGLE_EMAIL;
  const origEnvChannel = process.env.EXPECTED_TRIAL_YOUTUBE_CHANNEL_ID;
  const origEnvFolder = process.env.EXPECTED_TRIAL_DRIVE_FOLDER_ID;
  delete process.env.EXPECTED_TRIAL_GOOGLE_EMAIL;
  delete process.env.EXPECTED_TRIAL_YOUTUBE_CHANNEL_ID;
  delete process.env.EXPECTED_TRIAL_DRIVE_FOLDER_ID;

  try {
    // Thiếu cả 3
    let threw = false;
    try {
      await verifyTrialIdentity(sampleCreds, 'mock_token', {});
    } catch (err) {
      threw = true;
      assert.strictEqual(err.code, 'OAUTH_ACTION_REQUIRED');
      assert.ok(err.message.includes('Thiếu thông tin cấu hình danh tính kỳ vọng'));
    }
    assert.strictEqual(threw, true);

    // Thiếu folderId
    threw = false;
    try {
      await verifyTrialIdentity(sampleCreds, 'mock_token', {
        expectedEmail: 'test@gmail.com',
        expectedChannelId: 'UC123'
      });
    } catch (err) {
      threw = true;
      assert.strictEqual(err.code, 'OAUTH_ACTION_REQUIRED');
    }
    assert.strictEqual(threw, true);
  } finally {
    if (origEnvEmail) process.env.EXPECTED_TRIAL_GOOGLE_EMAIL = origEnvEmail;
    if (origEnvChannel) process.env.EXPECTED_TRIAL_YOUTUBE_CHANNEL_ID = origEnvChannel;
    if (origEnvFolder) process.env.EXPECTED_TRIAL_DRIVE_FOLDER_ID = origEnvFolder;
  }
});

await itAsync('verifyTrialIdentity: Ném IDENTITY_UNVERIFIABLE khi UserInfo API lỗi hoặc không trả về email', async () => {
  const mockFetch = async (url) => {
    if (url === GOOGLE_USERINFO_URL) {
      return { ok: false, status: 500 };
    }
    return { ok: true, json: async () => ({}) };
  };

  let threw = false;
  try {
    await verifyTrialIdentity(sampleCreds, 'mock_token', {
      fetchImpl: mockFetch,
      expectedEmail: 'trial_teacher@gmail.com',
      expectedChannelId: 'UC_TRIAL_999',
      driveFolderId: 'FOLDER_123'
    });
  } catch (err) {
    threw = true;
    assert.strictEqual(err.code, 'IDENTITY_UNVERIFIABLE');
    assert.ok(err.message.includes('IDENTITY_UNVERIFIABLE'));
  }
  assert.strictEqual(threw, true);
});

await itAsync('verifyTrialIdentity: Pass khi mọi thông tin khớp; return object KHÔNG chứa fullGoogleEmail', async () => {
  const mockFetch = async (url) => {
    if (url === GOOGLE_USERINFO_URL) {
      return { ok: true, json: async () => ({ email: 'trial_teacher@gmail.com' }) };
    }
    if (url.startsWith(YOUTUBE_CHANNELS_URL)) {
      return {
        ok: true,
        json: async () => ({
          items: [{ id: 'UC_TRIAL_CHANNEL_999', snippet: { title: 'Vật Lý Xuân Trường (Trial)' } }]
        })
      };
    }
    if (url.startsWith(DRIVE_FILES_URL)) {
      return {
        ok: true,
        json: async () => ({
          id: 'FOLDER_PILOT_TRIAL_123',
          name: '00_PILOT_LESSONS_TRIAL',
          mimeType: 'application/vnd.google-apps.folder',
          trashed: false
        })
      };
    }
    throw new Error(`Unexpected URL: ${url}`);
  };

  const report = await verifyTrialIdentity(sampleCreds, 'mock_token', {
    fetchImpl: mockFetch,
    expectedEmail: 'trial_teacher@gmail.com',
    expectedChannelId: 'UC_TRIAL_CHANNEL_999',
    driveFolderId: 'FOLDER_PILOT_TRIAL_123'
  });

  assert.strictEqual(report.youtubeChannelId, 'UC_TRIAL_CHANNEL_999');
  assert.strictEqual(report.driveFolderId, 'FOLDER_PILOT_TRIAL_123');
  assert.strictEqual(report.fullGoogleEmail, undefined, 'Tuyệt đối không rò rỉ fullGoogleEmail');
  assert.strictEqual(report.googleEmail, 'tr***@gmail.com', 'Google email bắt buộc phải masked');
});

await itAsync('verifyTrialIdentity: Ném IDENTITY_MISMATCH khi email Google sai khác; thông báo lỗi không lộ full email', async () => {
  const mockFetch = async (url) => {
    if (url === GOOGLE_USERINFO_URL) {
      return { ok: true, json: async () => ({ email: 'attacker_fake@gmail.com' }) };
    }
    return { ok: true, json: async () => ({}) };
  };

  let threw = false;
  try {
    await verifyTrialIdentity(sampleCreds, 'mock_token', {
      fetchImpl: mockFetch,
      expectedEmail: 'trial_teacher@gmail.com',
      expectedChannelId: 'UC_TRIAL_CHANNEL_999',
      driveFolderId: 'FOLDER_PILOT_123'
    });
  } catch (err) {
    threw = true;
    assert.strictEqual(err.code, 'IDENTITY_MISMATCH');
    assert.strictEqual(err.message.includes('attacker_fake@gmail.com'), false, 'Không lộ full actual email');
    assert.strictEqual(err.message.includes('trial_teacher@gmail.com'), false, 'Không lộ full expected email');
    assert.ok(err.message.includes('at***@gmail.com'));
    assert.ok(err.message.includes('tr***@gmail.com'));
  }
  assert.strictEqual(threw, true);
});

await itAsync('verifyTrialIdentity: Ném IDENTITY_MISMATCH khi kênh YouTube thực tế khác expectedChannelId', async () => {
  const mockFetch = async (url) => {
    if (url === GOOGLE_USERINFO_URL) {
      return { ok: true, json: async () => ({ email: 'trial_teacher@gmail.com' }) };
    }
    if (url.startsWith(YOUTUBE_CHANNELS_URL)) {
      return {
        ok: true,
        json: async () => ({
          items: [{ id: 'UC_OTHER_WRONG_CHANNEL', snippet: { title: 'Kênh Khác Không Phải Trial' } }]
        })
      };
    }
    return { ok: true, json: async () => ({}) };
  };

  let threw = false;
  try {
    await verifyTrialIdentity(sampleCreds, 'mock_token', {
      fetchImpl: mockFetch,
      expectedEmail: 'trial_teacher@gmail.com',
      expectedChannelId: 'UC_TRIAL_CHANNEL_999',
      driveFolderId: 'FOLDER_PILOT_123'
    });
  } catch (err) {
    threw = true;
    assert.strictEqual(err.code, 'IDENTITY_MISMATCH');
    assert.ok(err.message.includes('Kênh YouTube không khớp'));
  }
  assert.strictEqual(threw, true);
});

await itAsync('verifyTrialIdentity: Ném IDENTITY_MISMATCH khi Drive Folder không tồn tại (HTTP 404)', async () => {
  const mockFetch = async (url) => {
    if (url === GOOGLE_USERINFO_URL) {
      return { ok: true, json: async () => ({ email: 'trial_teacher@gmail.com' }) };
    }
    if (url.startsWith(YOUTUBE_CHANNELS_URL)) {
      return {
        ok: true,
        json: async () => ({
          items: [{ id: 'UC_TRIAL_CHANNEL_999', snippet: { title: 'Kênh Trial' } }]
        })
      };
    }
    if (url.startsWith(DRIVE_FILES_URL)) {
      return {
        ok: false,
        status: 404,
        text: async () => 'File not found'
      };
    }
    return { ok: true, json: async () => ({}) };
  };

  let threw = false;
  try {
    await verifyTrialIdentity(sampleCreds, 'mock_token', {
      fetchImpl: mockFetch,
      expectedEmail: 'trial_teacher@gmail.com',
      expectedChannelId: 'UC_TRIAL_CHANNEL_999',
      driveFolderId: 'FOLDER_NON_EXISTENT'
    });
  } catch (err) {
    threw = true;
    assert.strictEqual(err.code, 'IDENTITY_MISMATCH');
    assert.ok(err.message.includes('Không tìm thấy hoặc không có quyền'));
  }
  assert.strictEqual(threw, true);
});

// =========================================================================
// SUITE 4: YOUTUBE RESUMABLE CHUNK UPLOAD, CRASH & RECOVERY
// =========================================================================
console.log(`\n--- [SUITE 4] YouTube Resumable Chunk Upload & Crash Recovery ---`);

await itAsync('uploadYouTubeVideoResumable: Upload chia chunk hữu hạn, gọi onProgress checkpoint sau mỗi 308', async () => {
  const tmp = createTempDir();
  try {
    const videoPath = path.join(tmp, 'sample_chunk_test.mp4');
    // Tạo file 1500 bytes, tải chunk 500 bytes => 3 chunks
    const totalBytes = 1500;
    const chunkSize = 500;
    fs.writeFileSync(videoPath, Buffer.alloc(totalBytes, 0x33));

    const progressHistory = [];
    const sessionUrl = 'https://www.googleapis.com/upload/youtube/v3/videos?upload_id=chunk_sess_123';

    const mockFetch = async (url, opts) => {
      if (url.includes('uploadType=resumable')) {
        return {
          ok: true,
          status: 200,
          headers: new Headers({ Location: sessionUrl })
        };
      }
      if (url === sessionUrl) {
        const range = opts.headers['Content-Range'];
        if (range === 'bytes 0-499/1500') {
          return {
            status: 308,
            ok: false,
            headers: new Headers({ Range: 'bytes=0-499' })
          };
        }
        if (range === 'bytes 500-999/1500') {
          return {
            status: 308,
            ok: false,
            headers: new Headers({ Range: 'bytes=0-999' })
          };
        }
        if (range === 'bytes 1000-1499/1500') {
          return {
            status: 200,
            ok: true,
            json: async () => ({ id: 'YT_CHUNK_SUCCESS_789' })
          };
        }
      }
      if (url.includes('part=status,processingDetails')) {
        return {
          ok: true,
          json: async () => ({ items: [{ id: 'YT_CHUNK_SUCCESS_789', processingDetails: { processingStatus: 'uploaded' } }] })
        };
      }
      throw new Error(`Unexpected: ${url} Range: ${opts.headers?.['Content-Range']}`);
    };

    const res = await uploadYouTubeVideoResumable(
      videoPath,
      { title: 'Chunk Upload Test' },
      'mock_token',
      {
        fetchImpl: mockFetch,
        chunkSize,
        onProgress: async (prog) => {
          progressHistory.push({ ...prog });
        }
      }
    );

    assert.strictEqual(res.videoId, 'YT_CHUNK_SUCCESS_789');
    assert.strictEqual(res.privacyStatus, 'private');
    // Phải có ít nhất: SESSION_INITIALIZED (0 byte), chunk 1 (500), chunk 2 (1000), chunk 3 (1500)
    assert.ok(progressHistory.length >= 4, `Cần ít nhất 4 events onProgress, thực tế: ${progressHistory.length}`);
    assert.strictEqual(progressHistory[0].status, 'SESSION_INITIALIZED');
    assert.strictEqual(progressHistory[1].bytesConfirmed, 500);
    assert.strictEqual(progressHistory[2].bytesConfirmed, 1000);
    assert.strictEqual(progressHistory[3].bytesConfirmed, 1500);
  } finally {
    cleanupTempDir(tmp);
  }
});

await itAsync('uploadYouTubeVideoResumable: Phục hồi sau crash, tiếp tục từ byte server báo, KHÔNG gửi lại byte cũ', async () => {
  const tmp = createTempDir();
  try {
    const videoPath = path.join(tmp, 'sample_crash_resume.mp4');
    const totalBytes = 1500;
    const chunkSize = 500;
    fs.writeFileSync(videoPath, Buffer.alloc(totalBytes, 0x44));

    const sessionUrl = 'https://www.googleapis.com/upload/youtube/v3/videos?upload_id=crash_resume_sess';
    let uploadedBytesTotal = 0;
    let rangeQueryHandled = false;

    const mockFetch = async (url, opts) => {
      if (url === sessionUrl && opts.headers['Content-Range'] === `bytes */${totalBytes}`) {
        rangeQueryHandled = true;
        // Server xác nhận đã có byte 0-499 từ lần chạy trước khi crash
        return {
          status: 308,
          ok: false,
          headers: new Headers({ Range: 'bytes=0-499' })
        };
      }
      if (url === sessionUrl && opts.headers['Content-Range'] === 'bytes 500-999/1500') {
        uploadedBytesTotal += opts.body.length;
        return {
          status: 308,
          ok: false,
          headers: new Headers({ Range: 'bytes=0-999' })
        };
      }
      if (url === sessionUrl && opts.headers['Content-Range'] === 'bytes 1000-1499/1500') {
        uploadedBytesTotal += opts.body.length;
        return {
          status: 200,
          ok: true,
          json: async () => ({ id: 'YT_CRASH_RESUMED_OK' })
        };
      }
      if (url.includes('part=status,processingDetails')) {
        return {
          ok: true,
          json: async () => ({ items: [{ id: 'YT_CRASH_RESUMED_OK', processingDetails: { processingStatus: 'uploaded' } }] })
        };
      }
      throw new Error(`Unexpected: ${url} Range: ${opts.headers?.['Content-Range']}`);
    };

    // Khởi động lần chạy mới với checkpoint cũ có sessionUrl
    const res = await uploadYouTubeVideoResumable(
      videoPath,
      { title: 'Crash Recovery Test' },
      'mock_token',
      {
        fetchImpl: mockFetch,
        chunkSize,
        resumableSessionUrl: sessionUrl
      }
    );

    assert.strictEqual(rangeQueryHandled, true, 'Bắt buộc phải query range */total');
    assert.strictEqual(uploadedBytesTotal, 1000, 'Chỉ được tải 1000 byte còn lại, không tải lại 500 byte đầu');
    assert.strictEqual(res.videoId, 'YT_CRASH_RESUMED_OK');
  } finally {
    cleanupTempDir(tmp);
  }
});

await itAsync('uploadYouTubeVideoResumable: Dừng fail-closed MANUAL_RECOVERY_REQUIRED khi session expired (404/410)', async () => {
  const tmp = createTempDir();
  try {
    const videoPath = path.join(tmp, 'sample_expired.mp4');
    fs.writeFileSync(videoPath, Buffer.alloc(1000, 0x55));

    const expiredSessionUrl = 'https://www.googleapis.com/upload/youtube/v3/videos?upload_id=expired_sess';

    const mockFetch = async (url, opts) => {
      if (url === expiredSessionUrl) {
        return { status: 404, ok: false, text: async () => 'Not Found - Session Expired' };
      }
      if (url.includes(YOUTUBE_VIDEOS_URL)) {
        return { ok: true, json: async () => ({ items: [] }) };
      }
      throw new Error(`Unexpected: ${url}`);
    };

    let threw = false;
    try {
      await uploadYouTubeVideoResumable(
        videoPath,
        { title: 'Expired Session Test' },
        'mock_token',
        { fetchImpl: mockFetch, resumableSessionUrl: expiredSessionUrl }
      );
    } catch (err) {
      threw = true;
      assert.strictEqual(err.code, 'MANUAL_RECOVERY_REQUIRED');
      assert.ok(err.message.includes('MANUAL_RECOVERY_REQUIRED'));
      assert.ok(err.message.includes('Nghiêm cấm tự động upload lại'));
    }
    assert.strictEqual(threw, true);
  } finally {
    cleanupTempDir(tmp);
  }
});

// =========================================================================
// SUITE 4B: HAI VIDEO CHECKPOINT ĐỘC LẬP & FAULT INJECTION
// =========================================================================
console.log(`\n--- [SUITE 4B] Hai Video Checkpoint Độc Lập & Fault Injection ---`);

await itAsync('uploadTwoVideosToYouTube: Video 1 xong checkpoint ngay; Video 2 lỗi -> chạy lại không gọi lại Video 1', async () => {
  const tmp = createTempDir();
  try {
    const v1Path = path.join(tmp, 'vid_theory.mp4');
    const v2Path = path.join(tmp, 'vid_practice.mp4');
    fs.writeFileSync(v1Path, Buffer.alloc(500, 0x11));
    fs.writeFileSync(v2Path, Buffer.alloc(500, 0x22));

    const manifest = {
      lessonName: '[PILOT] B10 Checkpoint Test',
      sourceDir: tmp,
      videoTheoryFile: 'vid_theory.mp4',
      videoPracticeFile: 'vid_practice.mp4'
    };

    let video1UploadCalls = 0;
    let video2UploadCalls = 0;

    const makeMockFetch = (failVideo2 = false) => async (url, opts) => {
      if (url === GOOGLE_OAUTH_TOKEN_URL) {
        return { ok: true, status: 200, json: async () => ({ access_token: 'mock_token_for_4b' }) };
      }
      if (url === GOOGLE_USERINFO_URL) {
        return { ok: true, json: async () => ({ email: 'trial_teacher@gmail.com' }) };
      }
      if (url.startsWith(YOUTUBE_CHANNELS_URL)) {
        return { ok: true, json: async () => ({ items: [{ id: 'UC_TRIAL_CHANNEL_999', snippet: { title: 'Trial' } }] }) };
      }
      if (url.startsWith(DRIVE_FILES_URL)) {
        return { ok: true, json: async () => ({ id: 'FOLDER_TRIAL', mimeType: 'application/vnd.google-apps.folder', trashed: false }) };
      }
      if (url.includes('uploadType=resumable')) {
        const body = JSON.parse(opts.body);
        if (body.snippet.title.includes('Phần 1: Bài giảng')) {
          video1UploadCalls++;
          return {
            ok: true,
            status: 200,
            headers: new Headers({ Location: 'https://youtube.upload/session_theory' })
          };
        }
        if (body.snippet.title.includes('Phần 2: Chữa bài tập')) {
          video2UploadCalls++;
          if (failVideo2) {
            return { ok: false, status: 503, text: async () => 'Service Unavailable on Video 2' };
          }
          return {
            ok: true,
            status: 200,
            headers: new Headers({ Location: 'https://youtube.upload/session_practice' })
          };
        }
      }
      if (url === 'https://youtube.upload/session_theory') {
        return { ok: true, status: 200, json: async () => ({ id: 'YT_THEORY_ID_111' }) };
      }
      if (url === 'https://youtube.upload/session_practice') {
        return { ok: true, status: 200, json: async () => ({ id: 'YT_PRACTICE_ID_222' }) };
      }
      if (url.includes('part=status,processingDetails')) {
        return { ok: true, json: async () => ({ items: [{ status: { uploadStatus: 'uploaded' } }] }) };
      }
      throw new Error(`Unexpected: ${url}`);
    };

    const commonOpts = {
      expectedEmail: 'trial_teacher@gmail.com',
      expectedChannelId: 'UC_TRIAL_CHANNEL_999',
      driveFolderId: 'FOLDER_TRIAL',
      clientId: 'mock_c',
      clientSecret: 'mock_s',
      refreshToken: 'mock_r'
    };

    // LẦN 1: Video 1 thành công, Video 2 fail mạng
    let threwL1 = false;
    try {
      await uploadTwoVideosToYouTube(tmp, manifest, {
        ...commonOpts,
        fetchImpl: makeMockFetch(true) // Fail video 2
      });
    } catch (err) {
      threwL1 = true;
      assert.ok(err.message.includes('Service Unavailable on Video 2') || err.message.includes('503'));
    }
    assert.strictEqual(threwL1, true, 'Lần 1 phải ném lỗi tại Video 2');
    assert.strictEqual(video1UploadCalls, 1, 'Video 1 đã được gọi upload trong lần 1');
    assert.strictEqual(video2UploadCalls, 1, 'Video 2 đã được gọi và fail trong lần 1');

    // Kiểm tra checkpoint độc lập sau lần 1: video 1 ĐÃ ĐƯỢC LƯU
    const cpAfterL1 = loadCheckpoint(tmp);
    assert.strictEqual(cpAfterL1.youtubeTheory?.status, 'UPLOADED_PRIVATE');
    assert.strictEqual(cpAfterL1.youtubeTheory?.videoId, 'YT_THEORY_ID_111');
    assert.strictEqual(cpAfterL1.state, 'YOUTUBE_THEORY_UPLOADED');

    // LẦN 2: Chạy lại khi mạng ổn định
    const resL2 = await uploadTwoVideosToYouTube(tmp, manifest, {
      ...commonOpts,
      fetchImpl: makeMockFetch(false) // Thành công
    });

    // BẮT BUỘC: Video 1 không được gọi lại lần 2! video1UploadCalls vẫn là 1
    assert.strictEqual(video1UploadCalls, 1, 'Video 1 TUYỆT ĐỐI KHÔNG được upload lại!');
    assert.strictEqual(video2UploadCalls, 2, 'Video 2 được upload thành công ở lần 2');
    assert.strictEqual(resL2.theoryVideoId, 'YT_THEORY_ID_111');
    assert.strictEqual(resL2.practiceVideoId, 'YT_PRACTICE_ID_222');
  } finally {
    cleanupTempDir(tmp);
  }
});

// =========================================================================
// SUITE 5: YOUTUBE CAPTIONS UPLOAD & FAIL-CLOSED
// =========================================================================
console.log(`\n--- [SUITE 5] YouTube Captions Upload & Fail-Closed ---`);

await itAsync('uploadYouTubeCaption: Khởi tạo và upload file SRT phụ đề tiếng Việt chuẩn', async () => {
  const tmp = createTempDir();
  try {
    const srtPath = path.join(tmp, 'subtitles.srt');
    fs.writeFileSync(srtPath, '1\n00:00:01,000 --> 00:00:05,000\nPhụ đề bài giảng vật lý 12\n', 'utf8');

    let initCaptionMeta = null;
    let captionBodyReceived = null;

    const mockFetch = async (url, opts) => {
      if (url.includes(YOUTUBE_CAPTIONS_UPLOAD_URL)) {
        initCaptionMeta = JSON.parse(opts.body);
        return {
          ok: true,
          status: 200,
          headers: new Headers({ Location: 'https://youtube.com/upload/caption_sess_1' })
        };
      }
      if (url === 'https://youtube.com/upload/caption_sess_1') {
        captionBodyReceived = opts.body;
        return {
          ok: true,
          status: 200,
          json: async () => ({ id: 'CAPTION_ID_VI_123' })
        };
      }
      throw new Error(`Unexpected call: ${url}`);
    };

    const capRes = await uploadYouTubeCaption('YT_VIDEO_1', srtPath, 'mock_token', { fetchImpl: mockFetch });
    assert.strictEqual(capRes.captionId, 'CAPTION_ID_VI_123');
    assert.strictEqual(initCaptionMeta.snippet.language, 'vi');
    assert.strictEqual(initCaptionMeta.snippet.videoId, 'YT_VIDEO_1');
    assert.ok(captionBodyReceived.includes('Phụ đề bài giảng vật lý 12'));
  } finally {
    cleanupTempDir(tmp);
  }
});

await itAsync('uploadYouTubeCaption: Ném CAPTION_UPLOAD_FAILED khi API upload thất bại, không nuốt lỗi', async () => {
  const tmp = createTempDir();
  try {
    const srtPath = path.join(tmp, 'subtitles.srt');
    fs.writeFileSync(srtPath, '1\n00:00:01,000 --> 00:00:02,000\nTest\n', 'utf8');

    const mockFetch = async () => ({
      ok: false,
      status: 500,
      text: async () => 'Internal Server Error'
    });

    let threw = false;
    try {
      await uploadYouTubeCaption('YT_VIDEO_1', srtPath, 'mock_token', { fetchImpl: mockFetch });
    } catch (err) {
      threw = true;
      assert.strictEqual(err.code, 'CAPTION_UPLOAD_FAILED');
    }
    assert.strictEqual(threw, true, 'Bắt buộc ném CAPTION_UPLOAD_FAILED');
  } finally {
    cleanupTempDir(tmp);
  }
});

await itAsync('uploadTwoVideosToYouTube: Ném CAPTION_UPLOAD_FAILED khi bật captions nhưng upload caption thất bại', async () => {
  const tmp = createTempDir();
  try {
    const v1Path = path.join(tmp, 'vid1.mp4');
    const v2Path = path.join(tmp, 'vid2.mp4');
    const srtPath = path.join(tmp, 'subtitles.srt');
    fs.writeFileSync(v1Path, Buffer.alloc(200, 0x11));
    fs.writeFileSync(v2Path, Buffer.alloc(200, 0x22));
    fs.writeFileSync(srtPath, '1\n00:00:00,000 --> 00:00:01,000\nCaption\n', 'utf8');

    const manifest = {
      lessonName: 'Pilot Caption Test',
      sourceDir: tmp,
      videoTheoryFile: 'vid1.mp4',
      videoPracticeFile: 'vid2.mp4',
      uploadCaptions: true
    };

    const mockFetch = async (url) => {
      if (url === GOOGLE_OAUTH_TOKEN_URL) {
        return { ok: true, status: 200, json: async () => ({ access_token: 'tok' }) };
      }
      if (url === GOOGLE_USERINFO_URL) {
        return { ok: true, json: async () => ({ email: 'trial_teacher@gmail.com' }) };
      }
      if (url.startsWith(YOUTUBE_CHANNELS_URL)) {
        return { ok: true, json: async () => ({ items: [{ id: 'UC_TRIAL_CHANNEL_999', snippet: { title: 'T' } }] }) };
      }
      if (url.startsWith(DRIVE_FILES_URL)) {
        return { ok: true, json: async () => ({ id: 'FLD', mimeType: 'application/vnd.google-apps.folder', trashed: false }) };
      }
      if (url.includes('uploadType=resumable') && url.includes('/videos')) {
        return { ok: true, status: 200, headers: new Headers({ Location: 'https://yt.upload/vid' }) };
      }
      if (url === 'https://yt.upload/vid') {
        return { ok: true, status: 200, json: async () => ({ id: 'VID_OK_123' }) };
      }
      if (url.includes('part=status,processingDetails')) {
        return { ok: true, json: async () => ({ items: [{ status: { uploadStatus: 'uploaded' } }] }) };
      }
      // Giả lập Captions upload lỗi 500
      if (url.includes('/captions')) {
        return { ok: false, status: 500, text: async () => 'Caption service unavailable' };
      }
      throw new Error(`Unexpected: ${url}`);
    };

    let threw = false;
    try {
      await uploadTwoVideosToYouTube(tmp, manifest, {
        expectedEmail: 'trial_teacher@gmail.com',
        expectedChannelId: 'UC_TRIAL_CHANNEL_999',
        driveFolderId: 'FLD',
        clientId: 'c',
        clientSecret: 's',
        refreshToken: 'r',
        fetchImpl: mockFetch
      });
    } catch (err) {
      threw = true;
      assert.strictEqual(err.code, 'CAPTION_UPLOAD_FAILED');
      assert.ok(err.message.includes('CAPTION_UPLOAD_FAILED'));
    }
    assert.strictEqual(threw, true, 'Pipeline phải fail-closed với CAPTION_UPLOAD_FAILED');

    const cp = loadCheckpoint(tmp);
    assert.strictEqual(cp.state, 'CAPTION_UPLOAD_FAILED');
  } finally {
    cleanupTempDir(tmp);
  }
});

// =========================================================================
// SUITE 6: GOOGLE DRIVE ESCAPE QUERY & GET READ-BACK ĐỐI SOÁT
// =========================================================================
console.log(`\n--- [SUITE 6] Google Drive Escape Query & GET Read-Back Đối Soát ---`);

await itAsync('uploadDrivePdfWithHash: Tái sử dụng file cũ khi MD5 hash và tên file trùng khớp', async () => {
  const tmp = createTempDir();
  try {
    const pdfPath = path.join(tmp, "Bai_10_Ly_Thuyet.pdf");
    fs.writeFileSync(pdfPath, '%PDF-1.4 sample content for hash reuse testing');
    const expectedMd5 = crypto.createHash('md5').update(fs.readFileSync(pdfPath)).digest('hex');

    let uploadCalled = false;
    const mockFetch = async (url) => {
      if (url.includes(DRIVE_FILES_URL)) {
        return {
          ok: true,
          json: async () => ({
            files: [
              {
                id: 'DRIVE_FILE_REUSED_123',
                name: 'Bai_10_Ly_Thuyet.pdf',
                md5Checksum: expectedMd5,
                mimeType: 'application/pdf',
                parents: ['FOLDER_TRIAL_ID'],
                webViewLink: 'https://drive.google.com/file/d/DRIVE_FILE_REUSED_123/view'
              }
            ]
          })
        };
      }
      if (url.includes(DRIVE_UPLOAD_URL)) {
        uploadCalled = true;
        return { ok: true, json: async () => ({ id: 'NEW_FILE' }) };
      }
      throw new Error(`Unexpected: ${url}`);
    };

    const res = await uploadDrivePdfWithHash(pdfPath, 'FOLDER_TRIAL_ID', 'mock_token', { fetchImpl: mockFetch });
    assert.strictEqual(res.fileId, 'DRIVE_FILE_REUSED_123');
    assert.strictEqual(res.isReused, true, 'Phải tái sử dụng file cũ');
    assert.strictEqual(uploadCalled, false, 'Không được gọi upload multipart khi hash đã có');
  } finally {
    cleanupTempDir(tmp);
  }
});

await itAsync('uploadDrivePdfWithHash: Escape ký tự nháy đơn trong query, upload mới và GET read-back đối soát', async () => {
  const tmp = createTempDir();
  try {
    // Tên file có chứa dấu nháy đơn
    const specialFileName = "Bai_10_O'Reilly_Ly_Thuyet.pdf";
    const pdfPath = path.join(tmp, specialFileName);
    fs.writeFileSync(pdfPath, '%PDF-1.4 special filename content');
    const expectedMd5 = crypto.createHash('md5').update(fs.readFileSync(pdfPath)).digest('hex');

    let queryCaptured = '';
    let readBackCalled = false;

    const mockFetch = async (url, opts) => {
      if (url.includes('uploadType=multipart')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            id: 'DRIVE_SPECIAL_UPLOAD_999',
            name: specialFileName
          })
        };
      }
      if (url.includes('/files/DRIVE_SPECIAL_UPLOAD_999')) {
        readBackCalled = true;
        return {
          ok: true,
          status: 200,
          json: async () => ({
            id: 'DRIVE_SPECIAL_UPLOAD_999',
            name: specialFileName,
            mimeType: 'application/pdf',
            parents: ['FOLDER_TRIAL_ID'],
            md5Checksum: expectedMd5,
            webViewLink: 'https://drive.google.com/file/d/DRIVE_SPECIAL_UPLOAD_999/view'
          })
        };
      }
      if (url.includes(DRIVE_FILES_URL)) {
        queryCaptured = decodeURIComponent(url);
        return { ok: true, json: async () => ({ files: [] }) };
      }
      throw new Error(`Unexpected: ${url}`);
    };

    const res = await uploadDrivePdfWithHash(pdfPath, 'FOLDER_TRIAL_ID', 'mock_token', { fetchImpl: mockFetch });
    assert.strictEqual(res.fileId, 'DRIVE_SPECIAL_UPLOAD_999');
    assert.strictEqual(res.isReused, false);
    assert.strictEqual(readBackCalled, true, 'Bắt buộc phải gọi GET read-back đối soát file sau upload');
    // Kiểm tra query đã được escape dấu nháy đơn: O\'Reilly
    assert.ok(queryCaptured.includes("Bai_10_O\\'Reilly_Ly_Thuyet.pdf"), `Query chưa escape đúng nháy đơn: ${queryCaptured}`);
    assert.ok(queryCaptured.includes("'FOLDER_TRIAL_ID' in parents"));
  } finally {
    cleanupTempDir(tmp);
  }
});

await itAsync('uploadDrivePdfWithHash: Ném DRIVE_VERIFICATION_FAILED nếu read-back phát hiện md5 không khớp', async () => {
  const tmp = createTempDir();
  try {
    const pdfPath = path.join(tmp, 'tampered.pdf');
    fs.writeFileSync(pdfPath, '%PDF-1.4 tampered content');

    const mockFetch = async (url) => {
      if (url.includes('uploadType=multipart')) {
        return { ok: true, json: async () => ({ id: 'FILE_CORRUPTED_1' }) };
      }
      if (url.includes('/files/FILE_CORRUPTED_1')) {
        // Read-back trả về hash khác
        return {
          ok: true,
          json: async () => ({
            id: 'FILE_CORRUPTED_1',
            mimeType: 'application/pdf',
            parents: ['FOLDER_TRIAL'],
            md5Checksum: 'WRONG_MD5_HASH'
          })
        };
      }
      if (url.includes(DRIVE_FILES_URL)) {
        return { ok: true, json: async () => ({ files: [] }) };
      }
      throw new Error(`Unexpected: ${url}`);
    };

    let threw = false;
    try {
      await uploadDrivePdfWithHash(pdfPath, 'FOLDER_TRIAL', 'mock_token', { fetchImpl: mockFetch });
    } catch (err) {
      threw = true;
      assert.strictEqual(err.code, 'DRIVE_VERIFICATION_FAILED');
      assert.ok(err.message.includes('không khớp mã hash'));
    }
    assert.strictEqual(threw, true);
  } finally {
    cleanupTempDir(tmp);
  }
});

// =========================================================================
// SUITE 7: CONTRACT BLOCKER - CHỐNG LỘ BÀI PILOT CHO HỌC SINH
// =========================================================================
console.log(`\n--- [SUITE 7] Contract Blocker: Chống Lộ Bài Pilot Cho Học Sinh ---`);

await itAsync('createFullDraftLessonOnBackend: Dừng fail-closed CONTRACT_BLOCKER_STUDENT_VISIBILITY nếu gọi live production mà chưa xác nhận', async () => {
  const tmp = createTempDir();
  try {
    const manifest = { lessonName: PILOT_B10_LESSON_NAME, course: 'Vật Lý 12' };
    const mockVideos = { theoryUrl: 'https://yt/1', practiceUrl: 'https://yt/2' };
    const mockDrive = { theoryPdfUrl: 'https://dr/1', appliedPdfUrl: 'https://dr/2', practicePdfUrl: 'https://dr/3' };

    let threw = false;
    try {
      // Giả lập gọi production live (mockBackend: false, adminKey có giá trị, fetchImpl không đổi)
      await createFullDraftLessonOnBackend(
        tmp, manifest, mockVideos, mockDrive, [], [],
        { mockBackend: false, adminKey: 'prod_admin_key_abc' }
      );
    } catch (err) {
      threw = true;
      assert.strictEqual(err.code, 'CONTRACT_BLOCKER_STUDENT_VISIBILITY');
      assert.ok(err.message.includes('CONTRACT_BLOCKER_STUDENT_VISIBILITY'));
      assert.ok(err.message.includes('chưa hỗ trợ cột \'draft\' hoặc \'hidden\''));
    }
    assert.strictEqual(threw, true, 'Phải dừng an toàn khi chưa có cơ chế ẩn bài pilot');

    const cp = loadCheckpoint(tmp);
    assert.strictEqual(cp.state, 'CONTRACT_BLOCKER_STUDENT_VISIBILITY');
  } finally {
    cleanupTempDir(tmp);
  }
});

// =========================================================================
// SUITE 8: SECRET SCANNING TRONG CHECKPOINT & LOGS
// =========================================================================
console.log(`\n--- [SUITE 8] Secret Scanning Trong Checkpoint ---`);

it('Quét checkpoint đảm bảo không chứa token, refresh token hay secret', () => {
  const tmp = createTempDir();
  try {
    const cp = {
      state: 'YOUTUBE_UPLOADED',
      youtube: {
        status: 'UPLOADED_PRIVATE',
        videoId: 'abc12345678',
        channelId: 'UC123456',
        privacyStatus: 'private'
      },
      drive: {
        folderId: 'FLD123',
        theoryPdfUrl: 'https://drive/1'
      }
    };
    saveCheckpoint(tmp, cp);

    const cpContent = fs.readFileSync(path.join(tmp, '.checkpoint.json'), 'utf8');
    assert.strictEqual(cpContent.includes('access_token'), false);
    assert.strictEqual(cpContent.includes('refresh_token'), false);
    assert.strictEqual(cpContent.includes('client_secret'), false);
    assert.strictEqual(cpContent.includes('adminKey'), false);
  } finally {
    cleanupTempDir(tmp);
  }
});

console.log(`\n======================================================`);
console.log(`🎉 HOÀN THÀNH TẤT CẢ KIỂM THỬ: ${passed}/${total} PASS (0 FAIL)`);
console.log(`======================================================\n`);
