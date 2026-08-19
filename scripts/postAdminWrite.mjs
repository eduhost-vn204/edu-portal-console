// Bản sao logic THUẦN (không đụng DOM/localStorage/mạng thật) của hàm
// postAdminWrite trong index.html, tách riêng để có thể viết test tự động bằng
// Node (mock fetch) mà không cần trình duyệt hay gọi Google Apps Script thật.
//
// QUAN TRỌNG: file này KHÔNG được nạp vào trình duyệt (index.html không có thẻ
// <script src="scripts/postAdminWrite.mjs">) - admin panel vẫn là 1 file HTML
// độc lập như trước. Đây thuần là bản đối chiếu để kiểm thử logic; nếu sửa hàm
// postAdminWrite trong index.html thì PHẢI sửa đồng bộ ở đây, và ngược lại.
// Xem test: scripts/test-postAdminWrite.mjs (chạy `node scripts/test-postAdminWrite.mjs`).

/**
 * Diễn giải kết quả 1 lần ghi lên Apps Script.
 * CHỈ coi là thành công khi:
 *   1) HTTP response hợp lệ (res.ok, tức status 2xx), VÀ
 *   2) đọc được JSON thật sự có json.ok === true (nghiêm ngặt, không dùng
 *      json.ok !== false vì cách đó biến mọi JSON thiếu field `ok` - kể cả
 *      {} hay {error:'Unauthorized'} - thành "thành công" do undefined !== false).
 * Mọi trường hợp khác (HTTP lỗi, HTML/trang lỗi thay vì JSON, JSON null, JSON
 * không có ok:true, timeout/abort, lỗi mạng) đều trả về false.
 *
 * @param {(url: any, opts: any) => Promise<{ok:boolean, json:() => Promise<any>}>} fetchImpl
 * @param {string} url
 * @param {any} payload
 * @param {{timeoutMs?: number}} [options]
 * @returns {Promise<boolean>}
 */
export async function postAdminWriteCore(fetchImpl, url, payload, options = {}) {
  const timeoutMs = options.timeoutMs ?? 55000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetchImpl(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    if (!res || !res.ok) return false;
    let json;
    try {
      json = await res.json();
    } catch {
      // Không phải JSON hợp lệ (vd trang HTML lỗi/redirect login) -> thất bại.
      return false;
    }
    return !!(json && typeof json === 'object' && json.ok === true);
  } catch {
    // Lỗi mạng, hoặc AbortError do timeout ở trên.
    return false;
  } finally {
    clearTimeout(timer);
  }
}
