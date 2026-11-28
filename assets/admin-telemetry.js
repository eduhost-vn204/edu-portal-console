/* Lucian UX/UI Prompt #417 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#417 */
(function (global) {
  'use strict';

  var RTDB_ROOT = 'https://edu-portal-live-default-rtdb.firebaseio.com/support_chats/_vlxt_system';

  function getAdminSessionState() {
    try {
      return localStorage.getItem('adminLoggedIn') === '1';
    } catch (e) {
      return false;
    }
  }

  function sanitizeDetail(obj) {
    if (!obj || typeof obj !== 'object') return {};
    var out = {};
    var forbidden = /key|token|secret|pass|auth|credential/i;
    Object.keys(obj).forEach(function (k) {
      if (forbidden.test(k)) return;
      var v = obj[k];
      if (typeof v === 'string') {
        out[k] = v.slice(0, 240);
      } else if (typeof v === 'number' || typeof v === 'boolean') {
        out[k] = v;
      }
    });
    return out;
  }

  function getPageFile() {
    try {
      var p = String((global.location && global.location.pathname) || '').split('/').pop();
      return p || 'index.html';
    } catch (e) {
      return 'index.html';
    }
  }

  function logAction(action, detail) {
    if (typeof fetch !== 'function') return Promise.resolve(false);
    var id = 'adm_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
    var record = {
      id: id,
      action: String(action || 'admin_event'),
      page: getPageFile(),
      detail: sanitizeDetail(detail),
      loggedIn: getAdminSessionState(),
      ts: Date.now()
    };
    return fetch(RTDB_ROOT + '/admin_audit/' + encodeURIComponent(id) + '.json', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    }).then(function (r) { return r.ok; }).catch(function () { return false; });
  }

  function updateNavBadges(openReports, newReserves) {
    var total = (openReports || 0) + (newReserves || 0);
    var links = document.querySelectorAll('a[href*="phan-tich-hanh-vi.html"]');
    links.forEach(function (link) {
      var existing = link.querySelector('.vlxt-adm-inbox-badge');
      if (total <= 0) {
        if (existing) existing.remove();
        return;
      }
      if (!existing) {
        existing = document.createElement('span');
        existing.className = 'vlxt-adm-inbox-badge';
        existing.style.cssText = 'margin-left:auto;background:#dc2626;color:#ffffff;font-size:10.5px;font-weight:800;padding:2px 7px;border-radius:999px;line-height:1.3;';
        link.appendChild(existing);
      }
      existing.textContent = String(total);
      existing.title = openReports + ' báo lỗi/góp ý mở · ' + newReserves + ' giữ suất VIP mới';
    });
    var heroBadge = document.getElementById('vlxt-hero-analytics-pill');
    if (heroBadge) {
      heroBadge.textContent = openReports + ' phản hồi mở · ' + newReserves + ' giữ suất mới';
    }
  }

  function refreshBadges() {
    if (typeof fetch !== 'function') return Promise.resolve({ openReports: 0, newReserves: 0 });
    return Promise.all([
      fetch(RTDB_ROOT + '/feedback_reports.json').then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; }),
      fetch(RTDB_ROOT + '/vip_reservations.json').then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; })
    ]).then(function (res) {
      var fbObj = res[0] && typeof res[0] === 'object' ? res[0] : {};
      var rsvObj = res[1] && typeof res[1] === 'object' ? res[1] : {};
      var openReports = Object.keys(fbObj).filter(function (k) {
        var it = fbObj[k];
        return it && it.status !== 'resolved' && it.status !== 'closed';
      }).length;
      var newReserves = Object.keys(rsvObj).filter(function (k) {
        var it = rsvObj[k];
        return it && (!it.status || it.status === 'new');
      }).length;
      updateNavBadges(openReports, newReserves);
      return { openReports: openReports, newReserves: newReserves };
    });
  }

  function initLucianSidebarMotion() {
    try {
      var nav = document.querySelector('.drawer-nav');
      if (!nav || nav.dataset.u417Ready === '1') return;
      nav.dataset.u417Ready = '1';
      nav.classList.add('ux', 'has-u417');

      var curFile = getPageFile();
      var items = Array.prototype.slice.call(nav.querySelectorAll('a[href]'));
      if (!items.length) return;

      var activeEl = nav.querySelector('a.active') || items.find(function (a) {
        return String(a.getAttribute('href') || '').split('?')[0].split('#')[0] === curFile;
      }) || items[0];

      items.forEach(function (a) {
        var hrefFile = String(a.getAttribute('href') || '').split('?')[0].split('#')[0];
        var isCur = (hrefFile === curFile) || (a === activeEl && a.classList.contains('active'));
        if (hrefFile === curFile) isCur = true;
        if (isCur) {
          a.classList.add('active');
          a.setAttribute('aria-current', 'page');
          activeEl = a;
        } else {
          a.classList.remove('active');
          a.removeAttribute('aria-current');
        }
      });

      var pill = nav.querySelector('.u417-pl');
      if (!pill) {
        pill = document.createElement('div');
        pill.className = 'u417-pl';
        pill.setAttribute('aria-hidden', 'true');
        nav.insertBefore(pill, nav.firstChild);
      }

      var positionPill = function (animate) {
        if (!activeEl) return;
        if (!animate) pill.style.transition = 'none';
        var top = activeEl.offsetTop;
        var h = activeEl.offsetHeight || 38;
        pill.style.setProperty('--py', top + 'px');
        pill.style.setProperty('--ph', h + 'px');
        if (!animate) {
          void pill.offsetWidth;
          pill.style.transition = '';
        }
      };

      positionPill(false);
      setTimeout(function () { positionPill(false); }, 120);

      items.forEach(function (a, idx) {
        a.addEventListener('keydown', function (e) {
          var nextIdx = e.key === 'ArrowDown' ? idx + 1 : (e.key === 'ArrowUp' ? idx - 1 : -1);
          if (nextIdx >= 0 && items[nextIdx]) {
            e.preventDefault();
            items[nextIdx].focus();
          }
        });
      });

      var drawer = nav.closest('aside, .drawer, #admin-drawer');
      if (drawer && typeof MutationObserver === 'function') {
        var mo = new MutationObserver(function () {
          setTimeout(function () { positionPill(true); }, 40);
        });
        mo.observe(drawer, { attributes: true, attributeFilter: ['class', 'style'] });
      }
      global.addEventListener('resize', function () { positionPill(false); });
    } catch (e) {}
  }

  if (typeof global.addEventListener === 'function') {
    global.addEventListener('error', function (ev) {
      var msg = (ev && ev.message) ? String(ev.message) : 'Admin runtime error';
      if (msg && msg.indexOf('Script error') === -1) {
        logAction('admin_js_error', { message: msg.slice(0, 180), lineno: ev.lineno || 0 });
      }
    });
    global.addEventListener('DOMContentLoaded', function () {
      initLucianSidebarMotion();
      refreshBadges();
      try {
        var key = 'vlxt_adm_pv_' + getPageFile();
        if (!sessionStorage.getItem(key)) {
          sessionStorage.setItem(key, '1');
          logAction('admin_page_view', { title: document.title || getPageFile() });
        }
      } catch (e) {}
    });
  }

  global.VLXT_ADMIN_TELEMETRY = {
    RTDB_ROOT: RTDB_ROOT,
    logAction: logAction,
    refreshBadges: refreshBadges
  };
})(window);
