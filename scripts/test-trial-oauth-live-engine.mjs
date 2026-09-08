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
// SUITE 3: IDENTITY VERIFICATION (Google Account, YouTube Channel, Drive Folder)
// =========================================================================
console.log(`\n--- [SUITE 3] Identity Verification (Account, Channel, Folder) ---`);

const sampleCreds = { clientId: 'c_id', clientSecret: 'c_sec', refreshToken: 'c_ref' };

await itAsync('verifyTrialIdentity: Pass khi mọi thông tin tài khoản, kênh và folder khớp', async () => {
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
  assert.strictEqual(report.fullGoogleEmail, 'trial_teacher@gmail.com');
  assert.ok(report.googleEmail.includes('***@gmail.com')); // Masked
});

await itAsync('verifyTrialIdentity: Ném IDENTITY_MISMATCH khi kênh YouTube thực tế khác expectedChannelId', async () => {
  const mockFetch = async (url) => {
    if (url === GOOGLE_USERINFO_URL) {
      return { ok: true, json: async () => ({ email: 'teacher@gmail.com' }) };
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

await itAsync('verifyTrialIdentity: Ném OAUTH_ACTION_REQUIRED khi Drive Folder không tồn tại (HTTP 404)', async () => {
  const mockFetch = async (url) => {
    if (url === GOOGLE_USERINFO_URL) {
      return { ok: true, json: async () => ({ email: 'teacher@gmail.com' }) };
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
      expectedChannelId: 'UC_TRIAL_CHANNEL_999',
      driveFolderId: 'FOLDER_NON_EXISTENT'
    });
  } catch (err) {
    threw = true;
    assert.strictEqual(err.code, 'OAUTH_ACTION_REQUIRED');
    assert.ok(err.message.includes('Không tìm thấy hoặc không có quyền'));
  }
  assert.strictEqual(threw, true);
});

// =========================================================================
// SUITE 4: YOUTUBE RESUMABLE UPLOAD & PROCESSING STATUS
// =========================================================================
console.log(`\n--- [SUITE 4] YouTube Resumable Upload & Processing Status ---`);

await itAsync('uploadYouTubeVideoResumable: Khởi tạo session, upload video và luôn đặt privacyStatus: private', async () => {
  const tmp = createTempDir();
  try {
    const videoPath = path.join(tmp, 'sample_theory.mp4');
    fs.writeFileSync(videoPath, Buffer.alloc(1024 * 50, 0x11)); // 50KB video

    let initPayloadCaptured = null;
    let chunkHeadersCaptured = null;

    const mockFetch = async (url, opts) => {
      if (url.includes('uploadType=resumable')) {
        initPayloadCaptured = JSON.parse(opts.body);
        return {
          ok: true,
          status: 200,
          headers: new Headers({
            Location: 'https://www.googleapis.com/upload/youtube/v3/videos?upload_id=mock_session_abc'
          })
        };
      }
      if (url.includes('upload_id=mock_session_abc')) {
        chunkHeadersCaptured = opts.headers;
        return {
          ok: true,
          status: 200,
          json: async () => ({
            id: 'YT_VIDEO_THEORY_123',
            processingDetails: { processingStatus: 'processing' }
          })
        };
      }
      if (url.includes('part=status,processingDetails')) {
        return {
          ok: true,
          json: async () => ({
            items: [{ id: 'YT_VIDEO_THEORY_123', processingDetails: { processingStatus: 'processing' } }]
          })
        };
      }
      throw new Error(`Unexpected url: ${url}`);
    };

    const res = await uploadYouTubeVideoResumable(
      videoPath,
      { title: 'Bài 10 Lý thuyết', description: 'Pilot' },
      'mock_token',
      { fetchImpl: mockFetch }
    );

    assert.strictEqual(res.videoId, 'YT_VIDEO_THEORY_123');
    assert.strictEqual(res.privacyStatus, 'private');
    assert.strictEqual(initPayloadCaptured.status.privacyStatus, 'private', 'Bắt buộc luôn là private');
    assert.strictEqual(res.processingStatus, 'processing');
  } finally {
    cleanupTempDir(tmp);
  }
});

await itAsync('uploadYouTubeVideoResumable: Hỗ trợ Resume khi session đã upload dở 50% byte', async () => {
  const tmp = createTempDir();
  try {
    const videoPath = path.join(tmp, 'sample_resume.mp4');
    const totalBytes = 2000;
    fs.writeFileSync(videoPath, Buffer.alloc(totalBytes, 0x22));

    const sessionUrl = 'https://www.googleapis.com/upload/youtube/v3/videos?upload_id=mock_resume_sess';
    let rangeQueryCalled = false;
    let uploadChunkRangeHeader = null;

    const mockFetch = async (url, opts) => {
      if (url === sessionUrl && opts.headers['Content-Range'] === `bytes */${totalBytes}`) {
        rangeQueryCalled = true;
        // Giả lập server YouTube phản hồi: đã nhận 0-999 (1000 bytes đầu)
        return {
          status: 308,
          ok: false,
          headers: new Headers({
            Range: 'bytes=0-999'
          })
        };
      }
      if (url === sessionUrl && opts.headers['Content-Range'].startsWith('bytes 1000-1999')) {
        uploadChunkRangeHeader = opts.headers['Content-Range'];
        return {
          ok: true,
          status: 200,
          json: async () => ({
            id: 'YT_RESUMED_VIDEO_888',
            processingDetails: { processingStatus: 'succeeded' }
          })
        };
      }
      if (url.includes('part=status,processingDetails')) {
        return {
          ok: true,
          json: async () => ({
            items: [{ id: 'YT_RESUMED_VIDEO_888', processingDetails: { processingStatus: 'succeeded' } }]
          })
        };
      }
      throw new Error(`Unexpected call: ${url} with range ${opts.headers?.['Content-Range']}`);
    };

    const res = await uploadYouTubeVideoResumable(
      videoPath,
      { title: 'Video Resumed' },
      'mock_token',
      { fetchImpl: mockFetch, resumableSessionUrl: sessionUrl }
    );

    assert.strictEqual(rangeQueryCalled, true, 'Phải truy vấn range byte đã nạp');
    assert.strictEqual(uploadChunkRangeHeader, 'bytes 1000-1999/2000', 'Chunk upload phải bắt đầu từ byte 1000');
    assert.strictEqual(res.videoId, 'YT_RESUMED_VIDEO_888');
    assert.strictEqual(res.processingStatus, 'succeeded');
  } finally {
    cleanupTempDir(tmp);
  }
});

// =========================================================================
// SUITE 5: YOUTUBE CAPTIONS UPLOAD
// =========================================================================
console.log(`\n--- [SUITE 5] YouTube Captions Upload (SRT/VTT) ---`);

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

// =========================================================================
// SUITE 6: GOOGLE DRIVE FOLDER & HASH REUSE
// =========================================================================
console.log(`\n--- [SUITE 6] Google Drive Folder & Hash Reuse (Chống Duplicate) ---`);

await itAsync('uploadDrivePdfWithHash: Tái sử dụng file cũ khi MD5 hash và tên file trùng khớp', async () => {
  const tmp = createTempDir();
  try {
    const pdfPath = path.join(tmp, 'Bai_10_Ly_Thuyet.pdf');
    fs.writeFileSync(pdfPath, '%PDF-1.4 sample content for hash reuse testing');
    const expectedMd5 = crypto.createHash('md5').update(fs.readFileSync(pdfPath)).digest('hex');

    let uploadCalled = false;
    const mockFetch = async (url, opts) => {
      if (url.includes(DRIVE_FILES_URL)) {
        // Trả về danh sách file có sẵn trong folder
        return {
          ok: true,
          json: async () => ({
            files: [
              {
                id: 'DRIVE_FILE_REUSED_123',
                name: 'Bai_10_Ly_Thuyet.pdf',
                md5Checksum: expectedMd5,
                mimeType: 'application/pdf',
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

await itAsync('uploadDrivePdfWithHash: Upload mới khi chưa có file, gắn đúng parents folder và mimeType', async () => {
  const tmp = createTempDir();
  try {
    const pdfPath = path.join(tmp, 'Bai_10_Luyen_Tap.pdf');
    fs.writeFileSync(pdfPath, '%PDF-1.4 new unique content');

    let multipartBodyCaptured = null;
    const mockFetch = async (url, opts) => {
      if (url.includes(DRIVE_FILES_URL)) {
        return { ok: true, json: async () => ({ files: [] }) }; // Thư mục chưa có file này
      }
      if (url.includes(DRIVE_UPLOAD_URL)) {
        multipartBodyCaptured = opts.body;
        return {
          ok: true,
          status: 200,
          json: async () => ({
            id: 'DRIVE_NEW_UPLOAD_456',
            name: 'Bai_10_Luyen_Tap.pdf',
            mimeType: 'application/pdf',
            parents: ['FOLDER_TRIAL_ID'],
            webViewLink: 'https://drive.google.com/file/d/DRIVE_NEW_UPLOAD_456/view'
          })
        };
      }
      throw new Error(`Unexpected: ${url}`);
    };

    const res = await uploadDrivePdfWithHash(pdfPath, 'FOLDER_TRIAL_ID', 'mock_token', { fetchImpl: mockFetch });
    assert.strictEqual(res.fileId, 'DRIVE_NEW_UPLOAD_456');
    assert.strictEqual(res.isReused, false);
    assert.ok(multipartBodyCaptured.toString().includes('"parents":["FOLDER_TRIAL_ID"]'));
    assert.ok(multipartBodyCaptured.toString().includes('application/pdf'));
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
