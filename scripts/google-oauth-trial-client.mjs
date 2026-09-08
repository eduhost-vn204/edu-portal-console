/**
 * Module quản lý kết nối OAuth2 và dịch vụ Google (YouTube Data API v3 & Google Drive API v3)
 * dành riêng cho môi trường TRIAL (thử nghiệm an toàn).
 *
 * TUYỆT ĐỐI KHÔNG SỬ DỤNG CHO PROFILE PRODUCTION.
 * KHÔNG LƯU SECRET / REFRESH TOKEN VÀO BẤT KỲ FILE CHECKPOINT HOẶC LOG NÀO.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export const GOOGLE_OAUTH_TOKEN_URL = 'https://oauth2.googleapis.com/token';
export const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';
export const YOUTUBE_CHANNELS_URL = 'https://www.googleapis.com/youtube/v3/channels';
export const YOUTUBE_VIDEOS_UPLOAD_URL = 'https://www.googleapis.com/upload/youtube/v3/videos';
export const YOUTUBE_VIDEOS_URL = 'https://www.googleapis.com/youtube/v3/videos';
export const YOUTUBE_CAPTIONS_UPLOAD_URL = 'https://www.googleapis.com/upload/youtube/v3/captions';
export const DRIVE_FILES_URL = 'https://www.googleapis.com/drive/v3/files';
export const DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files';

/**
 * Đọc cấu hình OAuth cho profile trial.
 * Chặn cứng nếu profile là 'production'.
 */
export function getTrialOAuthCredentials(options = {}) {
  const profile = options.oauthProfile || process.env.OAUTH_PROFILE || 'trial';
  if (profile === 'production') {
    const err = new Error("VI PHẠM HÀNG RÀO AN TOÀN: Tuyệt đối cấm sử dụng profile 'production' trong quy trình Pilot!");
    err.code = 'PRODUCTION_PROFILE_FORBIDDEN';
    throw err;
  }

  // Đọc từ options hoặc biến môi trường
  const clientId = options.clientId || process.env.TRIAL_GOOGLE_CLIENT_ID || process.env.TRIAL_YOUTUBE_CLIENT_ID;
  const clientSecret = options.clientSecret || process.env.TRIAL_GOOGLE_CLIENT_SECRET || process.env.TRIAL_YOUTUBE_CLIENT_SECRET;
  const refreshToken = options.refreshToken || process.env.TRIAL_GOOGLE_REFRESH_TOKEN || process.env.TRIAL_YOUTUBE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    const err = new Error(
      "OAUTH_ACTION_REQUIRED: Thiếu thông tin xác thực OAuth profile trial (TRIAL_GOOGLE_CLIENT_ID / SECRET / REFRESH_TOKEN). Vui lòng cấu hình biến môi trường hoặc chạy với cờ --mock."
    );
    err.code = 'OAUTH_ACTION_REQUIRED';
    throw err;
  }

  return {
    profile: 'trial',
    clientId,
    clientSecret,
    refreshToken
  };
}

/**
 * Đổi refresh token lấy access token.
 */
export async function refreshAccessToken(credentials, options = {}) {
  const fetchImpl = options.fetchImpl || fetch;
  const bodyParams = new URLSearchParams({
    client_id: credentials.clientId,
    client_secret: credentials.clientSecret,
    refresh_token: credentials.refreshToken,
    grant_type: 'refresh_token'
  });

  const res = await fetchImpl(GOOGLE_OAUTH_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: bodyParams.toString()
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    const err = new Error(`OAUTH_ACTION_REQUIRED: Đổi access token thất bại (${res.status}): ${errText}`);
    err.code = 'OAUTH_ACTION_REQUIRED';
    throw err;
  }

  const json = await res.json();
  if (!json.access_token) {
    const err = new Error('OAUTH_ACTION_REQUIRED: Google OAuth không trả về access_token hợp lệ.');
    err.code = 'OAUTH_ACTION_REQUIRED';
    throw err;
  }

  return json.access_token;
}

export function maskEmail(email) {
  if (!email || typeof email !== 'string') return '(unknown)';
  const atIdx = email.indexOf('@');
  if (atIdx <= 0) return '***';
  const name = email.slice(0, atIdx);
  const domain = email.slice(atIdx);
  const prefix = name.length > 2 ? name.slice(0, 2) : name.slice(0, 1);
  return `${prefix}***${domain}`;
}

/**
 * Tính SHA-256 của file bằng stream để không đọc toàn bộ file vào RAM
 */
export async function calculateFileSha256(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('data', chunk => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}

/**
 * Xác minh danh tính tài khoản Google, Kênh YouTube và Google Drive Folder
 * Bắt buộc đủ cả 3 thông tin kỳ vọng: expectedEmail, expectedChannelId, expectedFolderId.
 * Không in hoặc lưu trữ fullGoogleEmail.
 */
export async function verifyTrialIdentity(credentials, accessToken, options = {}) {
  const fetchImpl = options.fetchImpl || fetch;

  const expectedEmail = options.expectedEmail || process.env.EXPECTED_TRIAL_GOOGLE_EMAIL;
  const expectedChannelId = options.expectedChannelId || process.env.EXPECTED_TRIAL_YOUTUBE_CHANNEL_ID;
  const expectedFolderId = options.driveFolderId || process.env.EXPECTED_TRIAL_DRIVE_FOLDER_ID;

  if (!expectedEmail || !expectedChannelId || !expectedFolderId) {
    const missing = [];
    if (!expectedEmail) missing.push('EXPECTED_TRIAL_GOOGLE_EMAIL');
    if (!expectedChannelId) missing.push('EXPECTED_TRIAL_YOUTUBE_CHANNEL_ID');
    if (!expectedFolderId) missing.push('EXPECTED_TRIAL_DRIVE_FOLDER_ID');
    const err = new Error(
      `OAUTH_ACTION_REQUIRED: Thiếu thông tin cấu hình danh tính kỳ vọng cho profile trial (${missing.join(', ')}). Bắt buộc phải khai báo đầy đủ cả 3 thông tin trước khi thực hiện pilot.`
    );
    err.code = 'OAUTH_ACTION_REQUIRED';
    throw err;
  }

  // 1. Xác minh Google Email từ UserInfo API
  let googleEmail = '';
  try {
    const userRes = await fetchImpl(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!userRes.ok) {
      const err = new Error(`IDENTITY_UNVERIFIABLE: Không thể truy vấn UserInfo từ Google OAuth (${userRes.status}).`);
      err.code = 'IDENTITY_UNVERIFIABLE';
      throw err;
    }
    const userJson = await userRes.json();
    googleEmail = userJson.email || '';
  } catch (e) {
    if (e.code === 'IDENTITY_UNVERIFIABLE') throw e;
    const err = new Error(`IDENTITY_UNVERIFIABLE: Lỗi kết nối hoặc không đọc được UserInfo: ${e.message}`);
    err.code = 'IDENTITY_UNVERIFIABLE';
    throw err;
  }

  if (!googleEmail) {
    const err = new Error('IDENTITY_UNVERIFIABLE: Google UserInfo không trả về trường email của tài khoản.');
    err.code = 'IDENTITY_UNVERIFIABLE';
    throw err;
  }

  if (googleEmail.toLowerCase() !== expectedEmail.toLowerCase()) {
    const err = new Error(
      `IDENTITY_MISMATCH: Tài khoản Google không khớp! (Thực tế: ${maskEmail(googleEmail)}, Yêu cầu: ${maskEmail(expectedEmail)})`
    );
    err.code = 'IDENTITY_MISMATCH';
    throw err;
  }

  // 2. Xác minh YouTube Channel ID & Name
  const ytRes = await fetchImpl(`${YOUTUBE_CHANNELS_URL}?part=snippet&mine=true`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!ytRes.ok) {
    const errText = await ytRes.text().catch(() => '');
    const err = new Error(`OAUTH_ACTION_REQUIRED: Không thể truy vấn YouTube channel của tài khoản (${ytRes.status}): ${errText}`);
    err.code = 'OAUTH_ACTION_REQUIRED';
    throw err;
  }

  const ytJson = await ytRes.json();
  const channelItem = ytJson.items?.[0];
  if (!channelItem) {
    const err = new Error(`OAUTH_ACTION_REQUIRED: Tài khoản Google này chưa có kênh YouTube nào!`);
    err.code = 'OAUTH_ACTION_REQUIRED';
    throw err;
  }

  const channelId = channelItem.id;
  const channelTitle = channelItem.snippet?.title || '';

  if (channelId !== expectedChannelId) {
    const err = new Error(
      `IDENTITY_MISMATCH: Kênh YouTube không khớp! (Thực tế: ${channelId} [${channelTitle}], Yêu cầu: ${expectedChannelId})`
    );
    err.code = 'IDENTITY_MISMATCH';
    throw err;
  }

  // 3. Xác minh Google Drive Folder ID
  const folderRes = await fetchImpl(`${DRIVE_FILES_URL}/${expectedFolderId}?fields=id,name,mimeType,trashed`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!folderRes.ok) {
    const errText = await folderRes.text().catch(() => '');
    const err = new Error(`IDENTITY_MISMATCH: Không tìm thấy hoặc không có quyền truy cập Drive Folder [${expectedFolderId}] (${folderRes.status}): ${errText}`);
    err.code = 'IDENTITY_MISMATCH';
    throw err;
  }

  const folderJson = await folderRes.json();
  if (folderJson.trashed || folderJson.mimeType !== 'application/vnd.google-apps.folder') {
    const err = new Error(`IDENTITY_MISMATCH: Đối tượng Drive [${expectedFolderId}] không phải là thư mục hợp lệ hoặc đã bị xóa.`);
    err.code = 'IDENTITY_MISMATCH';
    throw err;
  }

  const masked = maskEmail(googleEmail);
  const safeReport = {
    profile: 'trial',
    googleEmail: masked,
    youtubeChannelId: channelId,
    youtubeChannelTitle: channelTitle,
    driveFolderId: expectedFolderId,
    driveFolderName: folderJson.name || ''
  };

  console.log(`\n======================================================`);
  console.log(`🔒 XÁC MINH DANH TÍNH TÀI KHOẢN TRIAL AN TOÀN:`);
  console.log(`   - Profile:            trial (Chặn cứng production)`);
  console.log(`   - Google Account:     ${safeReport.googleEmail}`);
  console.log(`   - YouTube Channel:    ${safeReport.youtubeChannelTitle} (ID: ${channelId})`);
  console.log(`   - Drive Folder:       ${safeReport.driveFolderName} (ID: ${expectedFolderId})`);
  console.log(`======================================================\n`);

  return safeReport;
}

/**
 * Upload Video lên YouTube dùng Resumable Upload (YouTube Data API v3)
 * - Tải theo từng chunk cố định (mặc định 5MB hoặc bội số 256KB), không tải toàn bộ file vào RAM
 * - Checkpoint sau khi nhận Location và sau mỗi phản hồi HTTP 308 (Resume Incomplete)
 * - Tiếp tục tải đúng từ byte máy chủ xác nhận
 * - Khi session hết hạn (404/410): kiểm tra read-back, nếu không chứng minh được an toàn thì fail-closed MANUAL_RECOVERY_REQUIRED
 * - Luôn đặt privacyStatus: 'private'
 */
export async function uploadYouTubeVideoResumable(filePath, metadata, accessToken, options = {}) {
  const fetchImpl = options.fetchImpl || fetch;

  if (!fs.existsSync(filePath)) {
    throw new Error(`Không tìm thấy file video tại: ${filePath}`);
  }

  const stats = fs.statSync(filePath);
  const fileSize = stats.size;
  const fileHash = await calculateFileSha256(filePath);

  // Kích thước chunk: bội số của 256 KB (chuẩn YouTube API), mặc định 5MB
  const chunkSize = options.chunkSize || (5 * 1024 * 1024);

  // Khóa cứng: Private
  const privacy = 'private';

  const resourceMetadata = {
    snippet: {
      title: metadata.title || 'Pilot Video',
      description: metadata.description || 'Pilot upload',
      tags: metadata.tags || ['pilot', 'physics'],
      categoryId: metadata.categoryId || '27'
    },
    status: {
      privacyStatus: privacy,
      selfDeclaredMadeForKids: false
    }
  };

  let sessionUrl = options.resumableSessionUrl || options.existingCheckpoint?.sessionUrl;
  let startByte = 0;

  // Bước 1: Khởi tạo Resumable Session nếu chưa có
  if (!sessionUrl) {
    const initRes = await fetchImpl(`${YOUTUBE_VIDEOS_UPLOAD_URL}?uploadType=resumable&part=snippet,status`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Upload-Content-Type': 'video/mp4',
        'X-Upload-Content-Length': String(fileSize)
      },
      body: JSON.stringify(resourceMetadata)
    });

    if (!initRes.ok) {
      const txt = await initRes.text().catch(() => '');
      throw new Error(`Khởi tạo YouTube Resumable Session thất bại (${initRes.status}): ${txt}`);
    }

    sessionUrl = initRes.headers.get('location');
    if (!sessionUrl) {
      throw new Error(`YouTube API không trả về header Location cho Resumable upload session.`);
    }

    // Checkpoint ngay lập tức sau khi nhận sessionUrl
    if (typeof options.onProgress === 'function') {
      await options.onProgress({
        sessionUrl,
        bytesConfirmed: 0,
        fileSize,
        fileHash,
        status: 'SESSION_INITIALIZED'
      });
    }
  } else {
    // Bước 2: Kiểm tra Range hiện tại của session có sẵn
    const rangeCheckRes = await fetchImpl(sessionUrl, {
      method: 'PUT',
      headers: {
        'Content-Range': `bytes */${fileSize}`
      }
    });

    if (rangeCheckRes.status === 308) {
      const rangeHeader = rangeCheckRes.headers.get('range');
      if (rangeHeader) {
        const match = /bytes=0-(\d+)/.exec(rangeHeader);
        if (match) {
          startByte = parseInt(match[1], 10) + 1;
        }
      }
      if (typeof options.onProgress === 'function') {
        await options.onProgress({
          sessionUrl,
          bytesConfirmed: startByte,
          fileSize,
          fileHash,
          status: 'RESUMING'
        });
      }
    } else if (rangeCheckRes.ok) {
      const finishedJson = await rangeCheckRes.json();
      const videoId = finishedJson.id;
      if (typeof options.onProgress === 'function') {
        await options.onProgress({
          sessionUrl,
          bytesConfirmed: fileSize,
          fileSize,
          fileHash,
          videoId,
          status: 'UPLOADED_PRIVATE'
        });
      }
      return {
        videoId,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        fileHash,
        fileSize,
        privacyStatus: privacy,
        processingStatus: finishedJson.processingDetails?.processingStatus || 'uploaded',
        uploadedAt: new Date().toISOString()
      };
    } else if (rangeCheckRes.status === 404 || rangeCheckRes.status === 410) {
      // Session hết hạn: kiểm tra an toàn, nếu không chứng minh được chưa tạo video -> fail-closed MANUAL_RECOVERY_REQUIRED
      let foundVideoId = null;
      try {
        const searchRes = await fetchImpl(`${YOUTUBE_VIDEOS_URL}?part=snippet&mine=true&maxResults=10`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (searchRes.ok) {
          const searchJson = await searchRes.json();
          const matchItem = (searchJson.items || []).find(it => it.snippet?.title === resourceMetadata.snippet.title);
          if (matchItem) {
            foundVideoId = matchItem.id;
          }
        }
      } catch {}

      const err = new Error(
        `MANUAL_RECOVERY_REQUIRED: Session upload YouTube đã hết hạn (${rangeCheckRes.status}). ${
          foundVideoId
            ? `Phát hiện video có tiêu đề tương tự trên kênh (ID: ${foundVideoId}).`
            : 'Không thể chứng minh an toàn video chưa được tạo.'
        } Nghiêm cấm tự động upload lại để tránh trùng lặp video. Yêu cầu kiểm tra thủ công!`
      );
      err.code = 'MANUAL_RECOVERY_REQUIRED';
      err.foundVideoId = foundVideoId;
      throw err;
    } else {
      const txt = await rangeCheckRes.text().catch(() => '');
      throw new Error(`Kiểm tra trạng thái session upload YouTube thất bại (${rangeCheckRes.status}): ${txt}`);
    }
  }

  // Bước 3: Upload từng chunk hữu hạn từ startByte
  let currentByte = startByte;
  let finalVideoJson = null;

  while (currentByte < fileSize) {
    const endByte = Math.min(currentByte + chunkSize, fileSize) - 1;
    const chunkLength = endByte - currentByte + 1;
    const chunkBuffer = Buffer.alloc(chunkLength);

    // Đọc chunk hữu hạn trực tiếp từ file, không nạp toàn bộ file vào RAM
    const fd = fs.openSync(filePath, 'r');
    try {
      fs.readSync(fd, chunkBuffer, 0, chunkLength, currentByte);
    } finally {
      fs.closeSync(fd);
    }

    const chunkRes = await fetchImpl(sessionUrl, {
      method: 'PUT',
      headers: {
        'Content-Range': `bytes ${currentByte}-${endByte}/${fileSize}`,
        'Content-Type': 'video/mp4'
      },
      body: chunkBuffer
    });

    if (chunkRes.status === 308) {
      const rangeHeader = chunkRes.headers.get('range');
      let nextByte = endByte + 1;
      if (rangeHeader) {
        const match = /bytes=0-(\d+)/.exec(rangeHeader);
        if (match) {
          nextByte = parseInt(match[1], 10) + 1;
        }
      }
      currentByte = nextByte;

      if (typeof options.onProgress === 'function') {
        await options.onProgress({
          sessionUrl,
          bytesConfirmed: currentByte,
          fileSize,
          fileHash,
          status: 'UPLOADING'
        });
      }
    } else if (chunkRes.status === 200 || chunkRes.status === 201) {
      finalVideoJson = await chunkRes.json();
      currentByte = fileSize;
      break;
    } else if (chunkRes.status === 404 || chunkRes.status === 410) {
      const err = new Error(
        `MANUAL_RECOVERY_REQUIRED: Session upload YouTube bị hết hạn/hủy giữa chừng (${chunkRes.status}) tại byte ${currentByte}/${fileSize}. Yêu cầu can thiệp thủ công!`
      );
      err.code = 'MANUAL_RECOVERY_REQUIRED';
      throw err;
    } else {
      const txt = await chunkRes.text().catch(() => '');
      throw new Error(`Upload video chunk thất bại (${chunkRes.status}): ${txt}`);
    }
  }

  if (!finalVideoJson || !finalVideoJson.id) {
    throw new Error('Upload video hoàn tất nhưng YouTube không trả về video ID hợp lệ.');
  }

  const videoId = finalVideoJson.id;

  if (typeof options.onProgress === 'function') {
    await options.onProgress({
      sessionUrl,
      bytesConfirmed: fileSize,
      fileSize,
      fileHash,
      videoId,
      status: 'UPLOADED_PRIVATE'
    });
  }

  // Bước 4: Kiểm tra trạng thái processing
  let processingStatus = 'processing';
  try {
    const procRes = await fetchImpl(`${YOUTUBE_VIDEOS_URL}?part=status,processingDetails&id=${videoId}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (procRes.ok) {
      const procJson = await procRes.json();
      const item = procJson.items?.[0];
      if (item) {
        processingStatus = item.processingDetails?.processingStatus || item.status?.uploadStatus || 'processing';
      }
    }
  } catch (e) {}

  return {
    videoId,
    url: `https://www.youtube.com/watch?v=${videoId}`,
    fileHash,
    fileSize,
    privacyStatus: privacy,
    processingStatus,
    uploadedAt: new Date().toISOString()
  };
}

/**
 * Upload phụ đề SRT/VTT cho video qua YouTube Captions API
 * Nếu lỗi, bắt buộc ném ngoại lệ CAPTION_UPLOAD_FAILED (không nuốt lỗi).
 */
export async function uploadYouTubeCaption(videoId, captionFilePath, accessToken, options = {}) {
  const fetchImpl = options.fetchImpl || fetch;

  if (!fs.existsSync(captionFilePath)) {
    const err = new Error(`CAPTION_UPLOAD_FAILED: Không tìm thấy file phụ đề tại: ${captionFilePath}`);
    err.code = 'CAPTION_UPLOAD_FAILED';
    throw err;
  }

  const captionContent = fs.readFileSync(captionFilePath, 'utf8');
  const ext = path.extname(captionFilePath).toLowerCase();
  const mimeType = ext === '.vtt' ? 'text/vtt' : 'application/x-subrip';

  const metadata = {
    snippet: {
      videoId,
      language: options.language || 'vi',
      name: options.name || 'Tiếng Việt',
      isDraft: false
    }
  };

  // Khởi tạo upload phụ đề
  let initRes;
  try {
    initRes = await fetchImpl(`${YOUTUBE_CAPTIONS_UPLOAD_URL}?uploadType=resumable&part=snippet`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify(metadata)
    });
  } catch (netErr) {
    const err = new Error(`CAPTION_UPLOAD_FAILED: Khởi tạo upload caption thất bại do lỗi mạng: ${netErr.message}`);
    err.code = 'CAPTION_UPLOAD_FAILED';
    throw err;
  }

  if (!initRes.ok) {
    const txt = await initRes.text().catch(() => '');
    const err = new Error(`CAPTION_UPLOAD_FAILED: Khởi tạo upload caption thất bại (${initRes.status}): ${txt}`);
    err.code = 'CAPTION_UPLOAD_FAILED';
    throw err;
  }

  const sessionUrl = initRes.headers.get('location');
  if (!sessionUrl) {
    const err = new Error(`CAPTION_UPLOAD_FAILED: YouTube Captions API không trả về Location header.`);
    err.code = 'CAPTION_UPLOAD_FAILED';
    throw err;
  }

  // Upload caption body
  let uploadRes;
  try {
    uploadRes = await fetchImpl(sessionUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': mimeType
      },
      body: captionContent
    });
  } catch (netErr) {
    const err = new Error(`CAPTION_UPLOAD_FAILED: Tải nội dung caption thất bại do lỗi mạng: ${netErr.message}`);
    err.code = 'CAPTION_UPLOAD_FAILED';
    throw err;
  }

  if (!uploadRes.ok) {
    const txt = await uploadRes.text().catch(() => '');
    const err = new Error(`CAPTION_UPLOAD_FAILED: Upload caption content thất bại (${uploadRes.status}): ${txt}`);
    err.code = 'CAPTION_UPLOAD_FAILED';
    throw err;
  }

  const resJson = await uploadRes.json();
  return {
    captionId: resJson.id,
    videoId,
    language: metadata.snippet.language,
    uploadedAt: new Date().toISOString()
  };
}

/**
 * Upload file PDF lên Google Drive:
 * - Tìm kiếm bằng cú pháp chuẩn với ký tự nháy đơn được escape: `'${folderId}' in parents and name = '${safeName}' and trashed = false`
 * - Tái sử dụng file nếu hash và tên trùng khớp (chống duplicate / không tạo (1))
 * - Khi upload mới: thực hiện GET read-back đối soát chặt chẽ id, parents, mimeType === 'application/pdf', và md5Checksum.
 */
export async function uploadDrivePdfWithHash(filePath, folderId, accessToken, options = {}) {
  const fetchImpl = options.fetchImpl || fetch;

  if (!fs.existsSync(filePath)) {
    throw new Error(`Không tìm thấy file PDF tại: ${filePath}`);
  }

  const fileName = path.basename(filePath);
  const fileBuffer = fs.readFileSync(filePath);
  const md5Hash = crypto.createHash('md5').update(fileBuffer).digest('hex');
  const sha256Hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

  // Escape nháy đơn và backslash trong filename theo chuẩn Google Drive query syntax
  const safeName = fileName.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
  const driveQuery = `'${folderId}' in parents and name = '${safeName}' and trashed = false`;

  // 1. Tìm xem trong folderId đã có file cùng tên & hash chưa
  const listUrl = `${DRIVE_FILES_URL}?q=${encodeURIComponent(driveQuery)}&fields=files(id,name,md5Checksum,mimeType,parents,webViewLink)`;
  const listRes = await fetchImpl(listUrl, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (listRes.ok) {
    const listJson = await listRes.json();
    const existing = (listJson.files || []).find(
      f => f.name === fileName && f.md5Checksum === md5Hash && (f.parents || []).includes(folderId)
    );
    if (existing) {
      console.log(`[Drive] File [${fileName}] đã tồn tại với MD5 hash khớp (${md5Hash}). Tái sử dụng file ID: ${existing.id}`);
      return {
        fileId: existing.id,
        fileName: existing.name,
        webViewLink: existing.webViewLink || `https://drive.google.com/file/d/${existing.id}/view`,
        folderId,
        md5Hash,
        sha256Hash,
        isReused: true
      };
    }
  }

  // 2. Upload Multipart mới vào folderId
  const boundary = `-------314159265358979323846_${Date.now()}`;
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--\r\n`;

  const metadata = {
    name: fileName,
    parents: [folderId],
    mimeType: 'application/pdf'
  };

  const metadataPart = `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}`;
  const mediaHeader = `${delimiter}Content-Type: application/pdf\r\n\r\n`;

  const metaBuffer = Buffer.from(metadataPart, 'utf8');
  const mediaHeaderBuffer = Buffer.from(mediaHeader, 'utf8');
  const closeBuffer = Buffer.from(closeDelimiter, 'utf8');

  const multipartBody = Buffer.concat([
    metaBuffer,
    mediaHeaderBuffer,
    fileBuffer,
    closeBuffer
  ]);

  const uploadRes = await fetchImpl(`${DRIVE_UPLOAD_URL}?uploadType=multipart&fields=id,name,md5Checksum,mimeType,parents,webViewLink`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
      'Content-Length': String(multipartBody.length)
    },
    body: multipartBody
  });

  if (!uploadRes.ok) {
    const txt = await uploadRes.text().catch(() => '');
    throw new Error(`Upload file PDF lên Drive thất bại (${uploadRes.status}): ${txt}`);
  }

  const uploadedFile = await uploadRes.json();
  if (!uploadedFile.id) {
    throw new Error(`Google Drive không trả về file ID sau khi upload.`);
  }

  // 3. Read-back đối soát độc lập sau khi upload
  const readBackUrl = `${DRIVE_FILES_URL}/${uploadedFile.id}?fields=id,name,md5Checksum,mimeType,parents,webViewLink`;
  const readBackRes = await fetchImpl(readBackUrl, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!readBackRes.ok) {
    const txt = await readBackRes.text().catch(() => '');
    const err = new Error(`DRIVE_VERIFICATION_FAILED: Không thể read-back đối soát file vừa upload [${uploadedFile.id}] (${readBackRes.status}): ${txt}`);
    err.code = 'DRIVE_VERIFICATION_FAILED';
    throw err;
  }

  const verifiedFile = await readBackRes.json();
  if (!verifiedFile.id || verifiedFile.id !== uploadedFile.id) {
    const err = new Error(`DRIVE_VERIFICATION_FAILED: File ID read-back không khớp (${verifiedFile.id} vs ${uploadedFile.id})`);
    err.code = 'DRIVE_VERIFICATION_FAILED';
    throw err;
  }

  if (!verifiedFile.parents || !verifiedFile.parents.includes(folderId)) {
    const err = new Error(`DRIVE_VERIFICATION_FAILED: File vừa upload [${verifiedFile.id}] không thuộc folderId [${folderId}]!`);
    err.code = 'DRIVE_VERIFICATION_FAILED';
    throw err;
  }

  if (verifiedFile.mimeType !== 'application/pdf') {
    const err = new Error(`DRIVE_VERIFICATION_FAILED: File vừa upload có mimeType [${verifiedFile.mimeType}], không phải 'application/pdf'!`);
    err.code = 'DRIVE_VERIFICATION_FAILED';
    throw err;
  }

  if (verifiedFile.md5Checksum && verifiedFile.md5Checksum.toLowerCase() !== md5Hash.toLowerCase()) {
    const err = new Error(`DRIVE_VERIFICATION_FAILED: md5Checksum read-back (${verifiedFile.md5Checksum}) không khớp mã hash mong đợi (${md5Hash})!`);
    err.code = 'DRIVE_VERIFICATION_FAILED';
    throw err;
  }

  return {
    fileId: verifiedFile.id,
    fileName: verifiedFile.name,
    webViewLink: verifiedFile.webViewLink || `https://drive.google.com/file/d/${verifiedFile.id}/view`,
    folderId,
    md5Hash: verifiedFile.md5Checksum || md5Hash,
    sha256Hash,
    isReused: false,
    uploadedAt: new Date().toISOString()
  };
}
