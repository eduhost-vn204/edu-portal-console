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

/**
 * Xác minh danh tính tài khoản Google, Kênh YouTube và Google Drive Folder
 * In báo cáo an toàn (che dấu/sanitized), đối chiếu với expected values.
 */
export async function verifyTrialIdentity(credentials, accessToken, options = {}) {
  const fetchImpl = options.fetchImpl || fetch;

  // 1. Xác minh Google Email
  let googleEmail = '';
  try {
    const userRes = await fetchImpl(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (userRes.ok) {
      const userJson = await userRes.json();
      googleEmail = userJson.email || '';
    }
  } catch (e) {
    // userinfo có thể không bắt buộc nếu scope hạn chế
  }

  const expectedEmail = options.expectedEmail || process.env.EXPECTED_TRIAL_GOOGLE_EMAIL;
  if (expectedEmail && googleEmail && googleEmail.toLowerCase() !== expectedEmail.toLowerCase()) {
    const err = new Error(
      `OAUTH_ACTION_REQUIRED: Tài khoản Google không khớp! (Thực tế: ${googleEmail}, Yêu cầu: ${expectedEmail})`
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

  const expectedChannelId = options.expectedChannelId || process.env.EXPECTED_TRIAL_YOUTUBE_CHANNEL_ID;
  if (expectedChannelId && channelId !== expectedChannelId) {
    const err = new Error(
      `OAUTH_ACTION_REQUIRED: Kênh YouTube không khớp! (Thực tế: ${channelId} [${channelTitle}], Yêu cầu: ${expectedChannelId})`
    );
    err.code = 'IDENTITY_MISMATCH';
    throw err;
  }

  // 3. Xác minh Google Drive Folder ID
  const folderId = options.driveFolderId || process.env.EXPECTED_TRIAL_DRIVE_FOLDER_ID;
  if (!folderId) {
    const err = new Error(`OAUTH_ACTION_REQUIRED: Chưa cấu hình folder ID đích cho Google Drive Pilot (EXPECTED_TRIAL_DRIVE_FOLDER_ID).`);
    err.code = 'OAUTH_ACTION_REQUIRED';
    throw err;
  }

  const folderRes = await fetchImpl(`${DRIVE_FILES_URL}/${folderId}?fields=id,name,mimeType,trashed`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!folderRes.ok) {
    const errText = await folderRes.text().catch(() => '');
    const err = new Error(`OAUTH_ACTION_REQUIRED: Không tìm thấy hoặc không có quyền truy cập Drive Folder [${folderId}] (${folderRes.status}): ${errText}`);
    err.code = 'OAUTH_ACTION_REQUIRED';
    throw err;
  }

  const folderJson = await folderRes.json();
  if (folderJson.trashed || folderJson.mimeType !== 'application/vnd.google-apps.folder') {
    const err = new Error(`OAUTH_ACTION_REQUIRED: Đối tượng Drive [${folderId}] không phải là thư mục hợp lệ hoặc đã bị xóa.`);
    err.code = 'OAUTH_ACTION_REQUIRED';
    throw err;
  }

  const safeReport = {
    profile: 'trial',
    googleEmail: googleEmail ? `${googleEmail.slice(0, 2)}***${googleEmail.slice(googleEmail.indexOf('@'))}` : '(unknown)',
    fullGoogleEmail: googleEmail,
    youtubeChannelId: channelId,
    youtubeChannelTitle: channelTitle,
    driveFolderId: folderId,
    driveFolderName: folderJson.name || ''
  };

  console.log(`\n======================================================`);
  console.log(`🔒 XÁC MINH DANH TÍNH TÀI KHOẢN TRIAL AN TOÀN:`);
  console.log(`   - Profile:            trial (Chặn cứng production)`);
  console.log(`   - Google Account:     ${safeReport.googleEmail}`);
  console.log(`   - YouTube Channel:    ${safeReport.youtubeChannelTitle} (ID: ${channelId})`);
  console.log(`   - Drive Folder:       ${safeReport.driveFolderName} (ID: ${folderId})`);
  console.log(`======================================================\n`);

  return safeReport;
}

/**
 * Upload Video lên YouTube dùng Resumable Upload (YouTube Data API v3)
 * Luôn đặt privacyStatus: 'private'
 */
export async function uploadYouTubeVideoResumable(filePath, metadata, accessToken, options = {}) {
  const fetchImpl = options.fetchImpl || fetch;

  if (!fs.existsSync(filePath)) {
    throw new Error(`Không tìm thấy file video tại: ${filePath}`);
  }

  const stats = fs.statSync(filePath);
  const fileSize = stats.size;
  const fileHash = crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');

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

  // Bước 1: Khởi tạo Resumable Upload Session
  let sessionUrl = options.resumableSessionUrl;
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
  }

  // Bước 2: Kiểm tra Range hiện tại (trong trường hợp resume session)
  let startByte = 0;
  try {
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
    } else if (rangeCheckRes.ok) {
      const finishedJson = await rangeCheckRes.json();
      return {
        videoId: finishedJson.id,
        url: `https://www.youtube.com/watch?v=${finishedJson.id}`,
        fileHash,
        privacyStatus: privacy,
        processingStatus: finishedJson.processingDetails?.processingStatus || 'uploaded'
      };
    }
  } catch (e) {
    startByte = 0;
  }

  // Bước 3: Upload nội dung video từ startByte
  const fileBuffer = fs.readFileSync(filePath);
  const chunkBuffer = fileBuffer.subarray(startByte);

  const uploadRes = await fetchImpl(sessionUrl, {
    method: 'PUT',
    headers: {
      'Content-Range': `bytes ${startByte}-${fileSize - 1}/${fileSize}`,
      'Content-Type': 'video/mp4'
    },
    body: chunkBuffer
  });

  if (!uploadRes.ok && uploadRes.status !== 308) {
    const txt = await uploadRes.text().catch(() => '');
    throw new Error(`Upload video chunk thất bại (${uploadRes.status}): ${txt}`);
  }

  let videoJson = {};
  if (uploadRes.status === 200 || uploadRes.status === 201) {
    videoJson = await uploadRes.json();
  } else {
    throw new Error(`Upload chưa hoàn tất đầy đủ (HTTP ${uploadRes.status}).`);
  }

  const videoId = videoJson.id;
  if (!videoId) {
    throw new Error(`YouTube không trả về video ID sau khi upload.`);
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
    privacyStatus: privacy,
    processingStatus,
    uploadedAt: new Date().toISOString()
  };
}

/**
 * Upload phụ đề SRT/VTT cho video qua YouTube Captions API
 */
export async function uploadYouTubeCaption(videoId, captionFilePath, accessToken, options = {}) {
  const fetchImpl = options.fetchImpl || fetch;

  if (!fs.existsSync(captionFilePath)) {
    throw new Error(`Không tìm thấy file phụ đề tại: ${captionFilePath}`);
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
  const initRes = await fetchImpl(`${YOUTUBE_CAPTIONS_UPLOAD_URL}?uploadType=resumable&part=snippet`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(metadata)
  });

  if (!initRes.ok) {
    const txt = await initRes.text().catch(() => '');
    throw new Error(`Khởi tạo upload caption thất bại (${initRes.status}): ${txt}`);
  }

  const sessionUrl = initRes.headers.get('location');
  if (!sessionUrl) {
    throw new Error(`YouTube Captions API không trả về Location header.`);
  }

  // Upload caption body
  const uploadRes = await fetchImpl(sessionUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': mimeType
    },
    body: captionContent
  });

  if (!uploadRes.ok) {
    const txt = await uploadRes.text().catch(() => '');
    throw new Error(`Upload caption content thất bại (${uploadRes.status}): ${txt}`);
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
 * Upload file PDF lên Google Drive, tái sử dụng file nếu hash và tên trùng khớp (chống duplicate / không tạo (1))
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

  // 1. Tìm xem trong folderId đã có file cùng tên & hash chưa
  const listUrl = `${DRIVE_FILES_URL}?q='${folderId}'+in+parents+and+name='${encodeURIComponent(fileName)}'+and+trashed=false&fields=files(id,name,md5Checksum,mimeType,parents,webViewLink)`;
  const listRes = await fetchImpl(listUrl, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (listRes.ok) {
    const listJson = await listRes.json();
    const existing = (listJson.files || []).find(f => f.name === fileName && f.md5Checksum === md5Hash);
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

  // Xác minh an toàn: đúng folder, đúng MIME
  if (uploadedFile.parents && !uploadedFile.parents.includes(folderId)) {
    throw new Error(`LỖI AN TOÀN: File được tạo nhưng không nằm trong folder ID chỉ định [${folderId}]!`);
  }

  return {
    fileId: uploadedFile.id,
    fileName: uploadedFile.name,
    webViewLink: uploadedFile.webViewLink || `https://drive.google.com/file/d/${uploadedFile.id}/view`,
    folderId,
    md5Hash: uploadedFile.md5Checksum || md5Hash,
    sha256Hash,
    isReused: false,
    uploadedAt: new Date().toISOString()
  };
}
