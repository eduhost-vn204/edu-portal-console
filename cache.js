/* ============================================================
   cache.js (ADMIN) — Tang toc chuyen tab cho trang Admin
   Khac ban hoc sinh: KHONG dung JSON tinh (admin can du lieu THAT tu GAS),
   chi cache localStorage de chuyen tab tuc thi + lam moi ngam nhanh.
   Sau khi admin LUU/XOA -> tu xoa cache de doc lai du lieu moi.
   Cach dung: thay fetch(url) bang cachedFetch(url) cho cac lenh DOC (GET).
   ============================================================ */
(function () {
  var FRESH_MS = 1500;          // gan nhu luc nao cung lam moi ngam (admin can tuoi)
  var MAX_STALE_MS = 3600000;   // 1 gio: qua han thi phai cho du lieu moi

  function keyOf(url) {
    return 'vlxt_cache_' + url.replace(/([?&])t=\d+/g, '').replace(/[?&]$/, '');
  }
  function wrap(data) {
    return {
      ok: true,
      json: function () { return Promise.resolve(data); },
      text: function () { return Promise.resolve(JSON.stringify(data)); }
    };
  }
  function revalidate(url, key) {
    return fetch(url).then(function (r) { return r.json(); }).then(function (data) {
      try { localStorage.setItem(key, JSON.stringify({ time: Date.now(), data: data })); } catch (e) {}
      return data;
    });
  }

  window.cachedFetch = function (url) {
    var key = keyOf(url);
    var hit = null;
    try { hit = JSON.parse(localStorage.getItem(key) || 'null'); } catch (e) {}
    var age = hit ? (Date.now() - hit.time) : Infinity;
    if (hit && age < MAX_STALE_MS) {
      if (age >= FRESH_MS) { revalidate(url, key).catch(function () {}); }
      return Promise.resolve(wrap(hit.data));
    }
    return revalidate(url, key).then(function (data) { return wrap(data); })
      .catch(function () {
        if (hit) return wrap(hit.data);
        return fetch(url).then(function (r) { return r.json(); }).then(function (d) { return wrap(d); });
      });
  };

  window.clearVlxtCache = function () {
    try {
      Object.keys(localStorage)
        .filter(function (k) { return k.indexOf('vlxt_cache_') === 0; })
        .forEach(function (k) { localStorage.removeItem(k); });
    } catch (e) {}
  };

  // Xoa cache sau MOI lenh POST (luu/xoa). Cai SAU khi trang load xong de boc
  // chong len lop fetch rieng cua admin (giu nguyen adminKey), tranh bi ghi de.
  function installPostHook() {
    if (window.__vlxtPostHook) return;
    window.__vlxtPostHook = true;
    var _origFetch = window.fetch.bind(window);
    window.fetch = function (url, opts) {
      var p = _origFetch(url, opts);
      if (opts && opts.method && String(opts.method).toUpperCase() === 'POST') {
        p.then(function () { window.clearVlxtCache(); }).catch(function () {});
      }
      return p;
    };
  }
  if (document.readyState === 'complete') installPostHook();
  else window.addEventListener('load', installPostHook);
})();
