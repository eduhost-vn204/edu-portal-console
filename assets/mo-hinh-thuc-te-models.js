/*!
 * VLXTModels v1.2.0 — Thu vien SVG Motion Graphics Mo Hinh Thuc Te Vat Ly 12
 * Chuong 1 (17) + Chuong 2 (29) + Chuong 3 (32) + Chuong 4 (16) -> 94 mo hinh Dung/Sai
 * Dung chung cho: prototype-100-mo-hinh-thuc-te.html, ngan-hang-de.html, baihoc.html, thithu.html
 * Khong dung AI Glow / Neon. Chi dung Ambient Observational Loop nhe nhang, sac net.
 */
(function (global) {
    'use strict';

    var VERSION = '1.2.0';
    var STYLE_ID = 'vlxt-models-shared-styles';
    var _uidCounter = 0;

    function nextUid() {
        _uidCounter += 1;
        return 'vm' + _uidCounter + '_';
    }

    function escapeHtml(str) {
        return String(str == null ? '' : str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function ensureStyles() {
        if (typeof document === 'undefined' || !document.head) return;
        if (document.getElementById(STYLE_ID)) return;
        var css = [
            '.vlxt-visual-container{margin:16px 0 18px;background:#090e1a;border:1px solid #334155;border-radius:12px;padding:16px;color:#e2e8f0;box-sizing:border-box;max-width:100%;min-width:0;overflow:hidden;}',
            '.vlxt-visual-container.centered{max-width:920px;margin-left:auto;margin-right:auto;}',
            '.vlxt-visual-container.compact{margin:10px 0 12px;padding:10px;}',
            '.vlxt-grid-2col{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:stretch;}',
            '.vlxt-grid-2col>*{min-width:0;max-width:100%;}',
            '@media (max-width:900px){.vlxt-grid-2col{grid-template-columns:1fr;}}',
            '.vlxt-stage-wrap{position:relative;background:#050811;border:1px solid #1e293b;border-radius:10px;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:12px 14px;width:100%;max-width:100%;min-width:0;box-sizing:border-box;}',
            '.vlxt-stage-wrap svg{display:block;width:100%;max-width:100%;height:auto;font-family:"Plus Jakarta Sans","Segoe UI",Arial,sans-serif;}',
            '.vlxt-stage-wrap svg text,.vlxt-stage-wrap svg tspan{font-family:"Plus Jakarta Sans","Segoe UI",Arial,sans-serif;}',
            '.vlxt-visual-container .stage-caption{font-size:13px;font-weight:800;color:#38bdf8;margin-bottom:10px;text-align:center;letter-spacing:0.2px;display:flex;align-items:center;justify-content:center;gap:6px;flex-wrap:wrap;}',
            '.vlxt-model-slot{margin:12px 0;max-width:100%;min-width:0;}',
            '.vlxt-model-error{padding:12px 14px;border-radius:8px;border:1px dashed #64748b;background:#0f172a;color:#cbd5e1;font-size:13px;}',

            /* Bang so lieu thuc nghiem thich ung nen sang (CBT thithu, modal admin, baihoc light) */
            '.vstep-data-panel{margin:14px auto 16px;background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;padding:12px 14px;max-width:920px;min-width:0;overflow-x:auto;-webkit-overflow-scrolling:touch;color:#0f172a;box-sizing:border-box;}',
            '.vstep-data-title{font-size:13px;font-weight:800;color:#0369a1;margin-bottom:9px;display:flex;align-items:center;gap:6px;letter-spacing:0.2px;flex-wrap:wrap;}',
            '.vstep-data-table{width:100%;border-collapse:collapse;font-size:13.5px;color:#0f172a;text-align:center;background:#ffffff;}',
            '.vstep-data-table th,.vstep-data-table td{border:1px solid #cbd5e1;padding:7px 10px;}',
            '.vstep-data-table th{background:#e2e8f0;font-weight:700;color:#1e293b;font-size:12.5px;white-space:nowrap;}',
            '.vstep-data-table tbody tr:nth-child(even){background:#f8fafc;}',
            '.vstep-data-table tbody tr:hover{background:#f1f5f9;}',
            '.vstep-data-table td.text-left,.vstep-data-table th.text-left{text-align:left;font-weight:600;}',
            '@media (max-width:640px){.vlxt-visual-container{padding:10px;border-radius:10px;}.vlxt-stage-wrap{padding:8px;}.vstep-data-panel{padding:10px;}.vstep-data-table{font-size:12px;}.vstep-data-table th,.vstep-data-table td{padding:6px 7px;white-space:normal;word-break:break-word;}}',

            /* Tu dong chuyen sang theme toi trong prototype, baihoc dark mode, danh sach ngan hang admin */
            'body.dark .vstep-data-panel,body.vlxt-dark-page .vstep-data-panel,.proto-dark .vstep-data-panel,.nh-row .vstep-data-panel{background:#0b1120;border-color:#334155;color:#e2e8f0;}',
            'body.dark .vstep-data-title,body.vlxt-dark-page .vstep-data-title,.proto-dark .vstep-data-title,.nh-row .vstep-data-title{color:#38bdf8;}',
            'body.dark .vstep-data-table,body.vlxt-dark-page .vstep-data-table,.proto-dark .vstep-data-table,.nh-row .vstep-data-table{background:#0f172a;color:#e2e8f0;}',
            'body.dark .vstep-data-table th,body.dark .vstep-data-table td,body.vlxt-dark-page .vstep-data-table th,body.vlxt-dark-page .vstep-data-table td,.proto-dark .vstep-data-table th,.proto-dark .vstep-data-table td,.nh-row .vstep-data-table th,.nh-row .vstep-data-table td{border-color:#334155;}',
            'body.dark .vstep-data-table th,body.vlxt-dark-page .vstep-data-table th,.proto-dark .vstep-data-table th,.nh-row .vstep-data-table th{background:#1e293b;color:#cbd5e1;}',
            'body.dark .vstep-data-table tbody tr:nth-child(even),body.vlxt-dark-page .vstep-data-table tbody tr:nth-child(even),.proto-dark .vstep-data-table tbody tr:nth-child(even),.nh-row .vstep-data-table tbody tr:nth-child(even){background:#131c31;}',
            'body.dark .vstep-data-table tbody tr:hover,body.vlxt-dark-page .vstep-data-table tbody tr:hover,.proto-dark .vstep-data-table tbody tr:hover,.nh-row .vstep-data-table tbody tr:hover{background:#1e293b;}',

            /* Ambient Observational Animations - nhe nhang, khong choi */
            '@keyframes vlxtWaterRipples{0%,100%{transform:translateY(0);}50%{transform:translateY(-2px);}}',
            '@keyframes vlxtIceBobbing{0%,100%{transform:translateY(0);}50%{transform:translateY(2.5px);}}',
            '@keyframes vlxtStirrerMotion{0%,100%{transform:translateY(0);}50%{transform:translateY(-3.5px);}}',
            '@keyframes vlxtCircuitPulse{0%{stroke-dashoffset:40;}100%{stroke-dashoffset:0;}}',
            '@keyframes vlxtHeatArrowPulse{0%,100%{opacity:0.4;}50%{opacity:0.95;}}',
            '@keyframes vlxtSteamRise{0%{transform:translateY(2px);opacity:0.25;}50%{opacity:0.75;}100%{transform:translateY(-10px);opacity:0.1;}}',
            '@keyframes vlxtDropsFall{0%{transform:translateY(-3px);opacity:0.25;}60%{opacity:0.95;}100%{transform:translateY(7px);opacity:0.15;}}',
            '@keyframes vlxtFanSpin{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}',
            '@keyframes vlxtPistonIdle{0%,100%{transform:translateY(0);}50%{transform:translateY(5px);}}',
            '@keyframes vlxtRayGlide{0%{stroke-dashoffset:24;}100%{stroke-dashoffset:0;}}',

            '.ambient-water-wave{animation:vlxtWaterRipples 3s ease-in-out infinite;}',
            '.ambient-ice-bob{animation:vlxtIceBobbing 3s ease-in-out infinite;}',
            '.ambient-stirrer{animation:vlxtStirrerMotion 2.4s ease-in-out infinite;}',
            '.ambient-wire-pulse{stroke-dasharray:8 8;animation:vlxtCircuitPulse 2s linear infinite;}',
            '.ambient-heat-arrow{animation:vlxtHeatArrowPulse 2.2s ease-in-out infinite;}',
            '.ambient-steam{animation:vlxtSteamRise 3.2s ease-in-out infinite;}',
            '.ambient-drops{animation:vlxtDropsFall 2s linear infinite;}',
            '.ambient-fan-spin{transform-box:fill-box;transform-origin:center;animation:vlxtFanSpin 3.6s linear infinite;}',
            '.ambient-piston{animation:vlxtPistonIdle 2.6s ease-in-out infinite;}',
            '.ambient-ray-glide{stroke-dasharray:6 6;animation:vlxtRayGlide 1.8s linear infinite;}',
            '@keyframes vlxtBalloonBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-4px);}}',
            '@keyframes vlxtGasMoveA{0%,100%{transform:translate(0,0);}33%{transform:translate(3px,-3px);}66%{transform:translate(-3px,2px);}}',
            '@keyframes vlxtGasMoveB{0%,100%{transform:translate(0,0);}33%{transform:translate(-3px,3px);}66%{transform:translate(3px,-2px);}}',
            '@keyframes vlxtNeedleQuiver{0%,100%{transform:rotate(0deg);}50%{transform:rotate(5deg);}}',
            '@keyframes vlxtPistonX{0%,100%{transform:translateX(0);}50%{transform:translateX(6px);}}',
            '@keyframes vlxtBubbleUp{0%,100%{transform:translateY(2px);}50%{transform:translateY(-5px);}}',
            '@keyframes vlxtLungScale{0%,100%{transform:scale(1);}50%{transform:scale(1.03);}}',
            '.ambient-balloon{animation:vlxtBalloonBob 3.6s ease-in-out infinite;}',
            '.ambient-gas-a{animation:vlxtGasMoveA 3.2s ease-in-out infinite;}',
            '.ambient-gas-b{animation:vlxtGasMoveB 2.8s ease-in-out infinite;}',
            '.ambient-needle{transform-box:fill-box;transform-origin:center;animation:vlxtNeedleQuiver 2.8s ease-in-out infinite;}',
            '.ambient-piston-x{animation:vlxtPistonX 2.8s ease-in-out infinite;}',
            '.ambient-bubble-up{animation:vlxtBubbleUp 2.6s ease-in-out infinite;}',
            '.ambient-lung{transform-box:fill-box;transform-origin:center;animation:vlxtLungScale 3.2s ease-in-out infinite;}'
        ].join('\n');
        var style = document.createElement('style');
        style.id = STYLE_ID;
        style.type = 'text/css';
        style.textContent = css;
        document.head.appendChild(style);
    }

    function captionHtml(iconClass, text) {
        return '<div class="stage-caption"><i class="' + escapeHtml(iconClass) + '"></i> ' + escapeHtml(text) + '</div>';
    }

    var MODELS = {
        'MH-C1-01': {
            id: 'MH-C1-01',
            title: 'Mô hình truyền nhiệt giữa cốc thủy tinh và cốc nhôm',
            topic: 'DS-C1.1',
            layout: 'single',
            caption: 'Mô hình cốc nhôm đặt trong cốc thủy tinh (Dòng truyền nhiệt tự nhiên)',
            alt: 'Sơ đồ thí nghiệm cốc nhôm chứa nước lạnh đặt trong cốc thủy tinh chứa nước nóng kèm hai nhiệt kế điện tử',
            build: function (u) {
                var svg =
                    '<svg viewBox="0 0 760 390" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
                    '<defs>' +
                    '<linearGradient id="' + u + 'alum" x1="0%" y1="0%" x2="100%" y2="0%">' +
                    '<stop offset="0%" stop-color="#475569"/><stop offset="50%" stop-color="#94a3b8"/><stop offset="100%" stop-color="#334155"/>' +
                    '</linearGradient>' +
                    '<linearGradient id="' + u + 'hot" x1="0%" y1="0%" x2="0%" y2="100%">' +
                    '<stop offset="0%" stop-color="rgba(249,115,22,0.28)"/><stop offset="100%" stop-color="rgba(14,165,233,0.48)"/>' +
                    '</linearGradient>' +
                    '<linearGradient id="' + u + 'cold" x1="0%" y1="0%" x2="0%" y2="100%">' +
                    '<stop offset="0%" stop-color="rgba(56,189,248,0.45)"/><stop offset="100%" stop-color="rgba(14,116,144,0.72)"/>' +
                    '</linearGradient>' +
                    '<marker id="' + u + 'arr" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
                    '<path d="M 0 1 L 9 5 L 0 9 z" fill="#f59e0b"/>' +
                    '</marker>' +
                    '</defs>' +
                    '<line x1="30" y1="348" x2="730" y2="348" stroke="#334155" stroke-width="2.5"/>' +
                    '<line x1="50" y1="356" x2="710" y2="356" stroke="#1e293b" stroke-width="2"/>' +
                    /* Nuoc nong trong coc thuy tinh (85°C) */
                    '<path d="M 185 152 Q 375 148 565 152 L 555 342 Q 375 348 195 342 Z" fill="url(#' + u + 'hot)" class="ambient-water-wave"/>' +
                    /* Thanh coc thuy tinh ben ngoai */
                    '<path d="M 165 100 L 185 100 L 195 342 Q 375 348 555 342 L 565 100 L 570 100" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>' +
                    '<path d="M 165 100 Q 150 103 158 111 L 185 111" fill="none" stroke="#38bdf8" stroke-width="2.5"/>' +
                    /* Vach chia the tich tren coc thuy tinh */
                    '<line x1="544" y1="178" x2="558" y2="178" stroke="#cbd5e1" stroke-width="2"/>' +
                    '<text x="536" y="182" fill="#e2e8f0" font-size="12" font-weight="700" font-family="DM Mono,monospace" text-anchor="end">400 mL</text>' +
                    '<line x1="547" y1="222" x2="557" y2="222" stroke="#64748b" stroke-width="1.8"/>' +
                    '<line x1="544" y1="266" x2="558" y2="266" stroke="#cbd5e1" stroke-width="2"/>' +
                    '<text x="536" y="270" fill="#e2e8f0" font-size="12" font-weight="700" font-family="DM Mono,monospace" text-anchor="end">200 mL</text>' +
                    /* Coc nhom ben trong (ho mieng o tren, khong co net lien dong mieng) */
                    '<path d="M 280 122 L 280 334 Q 280 342 288 342 L 462 342 Q 470 342 470 334 L 470 122 Z" fill="rgba(30,41,59,0.5)"/>' +
                    '<path d="M 280 122 L 280 334 Q 280 342 288 342 L 462 342 Q 470 342 470 334 L 470 122" fill="none" stroke="url(#' + u + 'alum)" stroke-width="3.5" stroke-linecap="round"/>' +
                    /* Nuoc lanh trong coc nhom (23°C) */
                    '<rect x="286" y="176" width="178" height="160" rx="5" fill="url(#' + u + 'cold)" class="ambient-water-wave"/>' +
                    '<line x1="286" y1="176" x2="464" y2="176" stroke="#7dd3fc" stroke-width="2" opacity="0.75"/>' +
                    /* Mui ten truyen nhiet tu nuoc nong ngoai vao coc nhom (dich len y=244 khong che 200 mL) */
                    '<g class="ambient-heat-arrow">' +
                    '<line x1="224" y1="205" x2="274" y2="205" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#' + u + 'arr)"/>' +
                    '<line x1="228" y1="244" x2="274" y2="244" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#' + u + 'arr)"/>' +
                    '<line x1="528" y1="205" x2="476" y2="205" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#' + u + 'arr)"/>' +
                    '<line x1="528" y1="244" x2="476" y2="244" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#' + u + 'arr)"/>' +
                    '</g>' +
                    /* NHIET KE 1 (85°C - Nuoc nong): Cam vao phan nuoc ben NGOAI (giua coc thuy tinh va coc nhom tai x=232) */
                    '<rect x="214" y="60" width="36" height="74" rx="4" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>' +
                    '<line x1="232" y1="134" x2="232" y2="305" stroke="#cbd5e1" stroke-width="3"/>' +
                    '<circle cx="232" cy="305" r="5" fill="#ef4444"/>' +
                    '<rect x="220" y="74" width="24" height="26" rx="3" fill="#0f172a"/>' +
                    '<text x="232" y="92" fill="#ef4444" font-size="12" font-family="DM Mono,monospace" font-weight="800" text-anchor="middle">85°</text>' +
                    /* NHIET KE 2 (23°C - Nuoc lanh): Cam vao phan nuoc ben TRONG coc nhom tai x=375 */
                    '<rect x="357" y="50" width="36" height="74" rx="4" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>' +
                    '<line x1="375" y1="124" x2="375" y2="270" stroke="#cbd5e1" stroke-width="3"/>' +
                    '<circle cx="375" cy="270" r="5" fill="#0284c7"/>' +
                    '<rect x="363" y="64" width="24" height="26" rx="3" fill="#0f172a"/>' +
                    '<text x="375" y="82" fill="#38bdf8" font-size="12" font-family="DM Mono,monospace" font-weight="800" text-anchor="middle">23°</text>' +
                    /* The chu thich */
                    '<g transform="translate(48,155)"><rect x="0" y="0" width="130" height="52" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '<text x="65" y="22" fill="#38bdf8" font-size="13" font-weight="800" text-anchor="middle">Cốc thủy tinh</text>' +
                    '<text x="65" y="41" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">Chứa nước ngoài (85°C)</text></g>' +
                    '<polyline points="178,181 210,181 210,230" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3 3"/>' +
                    '<g transform="translate(580,172)"><rect x="0" y="0" width="130" height="52" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>' +
                    '<text x="65" y="22" fill="#fbbf24" font-size="13" font-weight="800" text-anchor="middle">Cốc nhôm</text>' +
                    '<text x="65" y="41" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">Đặt lọt bên trong (23°C)</text></g>' +
                    '<polyline points="580,198 550,198 472,198" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="3 3"/>' +
                    '<g transform="translate(48,72)"><rect x="0" y="0" width="130" height="50" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>' +
                    '<text x="65" y="22" fill="#e2e8f0" font-size="12.5" font-weight="800" text-anchor="middle">2 Nhiệt kế</text>' +
                    '<text x="65" y="40" fill="#94a3b8" font-size="11.5" font-weight="600" text-anchor="middle">Đo đồng thời t (°C)</text></g>' +
                    '<path d="M 178 97 L 214 97" fill="none" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3 3"/>' +
                    '</svg>';

                return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
                    captionHtml('fa-solid fa-temperature-arrow-up', 'Mô hình cốc nhôm đặt trong cốc thủy tinh (Dòng truyền nhiệt tự nhiên)') + svg +
                    '</div></div>';
            }
        },
        'MH-C1-02': {
            id: 'MH-C1-02',
            title: 'Bộ thí nghiệm đo nhiệt dung riêng của nước và đồ thị t(°C) – τ(s)',
            topic: 'DS-C1.2',
            layout: '2col',
            caption: 'Hình 4.1: Bộ thí nghiệm đo nhiệt dung riêng của nước',
            caption2: 'Đồ thị thực nghiệm nhiệt độ t (°C) theo thời gian τ (s)',
            alt: 'Bộ 5 dụng cụ đo nhiệt dung riêng của nước và đồ thị thực nghiệm nhiệt độ theo thời gian qua hai điểm M và N',
            build: function () {
                var leftSvg =
                    '<svg viewBox="0 0 510 370" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
                    '<rect x="18" y="25" width="128" height="118" rx="8" fill="#1e293b" stroke="#475569" stroke-width="2"/>' +
                    '<g transform="translate(24,32)"><rect x="0" y="0" width="116" height="26" rx="4" fill="#0b1120" stroke="#334155"/>' +
                    '<text x="58" y="18" fill="#38bdf8" font-size="12.5" font-weight="800" text-anchor="middle">(1) Nguồn điện</text></g>' +
                    '<circle cx="82" cy="86" r="20" fill="#334155" stroke="#64748b" stroke-width="2"/>' +
                    '<line x1="82" y1="86" x2="94" y2="75" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/>' +
                    '<circle cx="50" cy="124" r="6" fill="#ef4444"/><circle cx="114" cy="124" r="6" fill="#0284c7"/>' +
                    '<rect x="164" y="25" width="146" height="118" rx="8" fill="#1e293b" stroke="#475569" stroke-width="2"/>' +
                    '<g transform="translate(170,32)"><rect x="0" y="0" width="134" height="26" rx="4" fill="#0b1120" stroke="#334155"/>' +
                    '<text x="67" y="18" fill="#38bdf8" font-size="12.5" font-weight="800" text-anchor="middle">(2) Oát kế</text></g>' +
                    '<rect x="171" y="61" width="132" height="50" rx="5" fill="#0b1120" stroke="#334155"/>' +
                    '<circle cx="185" cy="127" r="4.5" fill="#ef4444"/><circle cx="210" cy="127" r="4.5" fill="#ef4444"/>' +
                    '<circle cx="264" cy="127" r="4.5" fill="#0284c7"/><circle cx="289" cy="127" r="4.5" fill="#0284c7"/>' +
                    '<rect x="330" y="68" width="152" height="186" rx="12" fill="#78350f" opacity="0.35" stroke="#d97706" stroke-width="2.5"/>' +
                    '<rect x="342" y="108" width="128" height="136" rx="8" fill="rgba(14,165,233,0.25)" stroke="#0284c7" stroke-width="1.8"/>' +
                    '<path d="M 360 218 Q 375 203 390 218 T 420 218 T 446 218" fill="none" stroke="#ea580c" stroke-width="3.5"/>' +
                    '<line x1="360" y1="218" x2="360" y2="72" stroke="#f97316" stroke-width="2"/>' +
                    '<line x1="446" y1="218" x2="446" y2="72" stroke="#f97316" stroke-width="2"/>' +
                    '<rect x="325" y="60" width="162" height="18" rx="4" fill="#334155" stroke="#64748b"/>' +
                    '<g transform="translate(325,268)"><rect x="0" y="0" width="162" height="34" rx="6" fill="#0f172a" stroke="#d97706" stroke-width="1.5"/>' +
                    '<text x="81" y="22" fill="#f59e0b" font-size="13" font-weight="800" text-anchor="middle">(4) Nhiệt lượng kế</text></g>' +
                    '<rect x="398" y="16" width="30" height="70" rx="4" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.8"/>' +
                    '<line x1="413" y1="86" x2="413" y2="195" stroke="#cbd5e1" stroke-width="2.8"/>' +
                    '<circle cx="413" cy="195" r="4.5" fill="#ef4444"/>' +
                    '<rect x="402" y="32" width="22" height="24" rx="3" fill="#0f172a"/>' +
                    '<g transform="translate(372,2)"><rect x="0" y="0" width="100" height="22" rx="4" fill="#0f172a" stroke="#334155"/>' +
                    '<text x="50" y="15" fill="#38bdf8" font-size="11.5" font-weight="800" text-anchor="middle">(3) Nhiệt kế</text></g>' +
                    '<g transform="translate(18,220)"><rect x="0" y="0" width="144" height="68" rx="8" fill="#1e293b" stroke="#475569" stroke-width="2"/>' +
                    '<ellipse cx="72" cy="0" rx="58" ry="8" fill="#94a3b8" stroke="#cbd5e1" stroke-width="1.5"/>' +
                    '<rect x="18" y="16" width="108" height="34" rx="4" fill="#0f172a" stroke="#334155"/>' +
                    '<g transform="translate(0,78)"><rect x="0" y="0" width="144" height="26" rx="4" fill="#0f172a" stroke="#334155"/>' +
                    '<text x="72" y="17" fill="#38bdf8" font-size="12" font-weight="800" text-anchor="middle">(5) Cân điện tử</text></g></g>' +
                    '<path d="M 114 124 C 130 190 150 190 185 127" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="3 3"/>' +
                    '<path d="M 289 127 C 320 180 340 180 360 72" fill="none" stroke="#f97316" stroke-width="2" stroke-dasharray="3 3"/>' +
                    '<path d="M 264 127 C 290 200 370 200 446 72" fill="none" stroke="#0284c7" stroke-width="2" stroke-dasharray="3 3"/>' +
                    '</svg>';

                var rightSvg =
                    '<svg viewBox="0 0 510 370" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
                    '<line x1="68" y1="278" x2="428" y2="278" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="58" y="282" fill="#cbd5e1" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="end">5</text>' +
                    '<line x1="68" y1="246" x2="428" y2="246" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="58" y="250" fill="#cbd5e1" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="end">10</text>' +
                    '<line x1="68" y1="214" x2="428" y2="214" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="58" y="218" fill="#cbd5e1" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="end">15</text>' +
                    '<line x1="68" y1="182" x2="428" y2="182" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="58" y="186" fill="#cbd5e1" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="end">20</text>' +
                    '<line x1="68" y1="150" x2="428" y2="150" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="58" y="154" fill="#cbd5e1" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="end">25</text>' +
                    '<line x1="68" y1="118" x2="428" y2="118" stroke="#334155" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="58" y="122" fill="#cbd5e1" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="end">30</text>' +
                    '<line x1="68" y1="86" x2="428" y2="86" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="58" y="90" fill="#cbd5e1" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="end">35</text>' +
                    '<line x1="68" y1="54" x2="428" y2="54" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="58" y="58" fill="#cbd5e1" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="end">40</text>' +
                    '<line x1="108" y1="54" x2="108" y2="310" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="108" y="326" fill="#94a3b8" font-size="11.5" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">50</text>' +
                    '<line x1="148" y1="54" x2="148" y2="310" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="148" y="326" fill="#94a3b8" font-size="11.5" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">100</text>' +
                    '<line x1="188" y1="54" x2="188" y2="310" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="188" y="326" fill="#94a3b8" font-size="11.5" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">150</text>' +
                    '<line x1="228" y1="54" x2="228" y2="310" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="228" y="326" fill="#94a3b8" font-size="11.5" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">200</text>' +
                    '<line x1="268" y1="54" x2="268" y2="310" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="268" y="326" fill="#94a3b8" font-size="11.5" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">250</text>' +
                    '<line x1="308" y1="54" x2="308" y2="310" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="308" y="326" fill="#94a3b8" font-size="11.5" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">300</text>' +
                    '<line x1="348" y1="54" x2="348" y2="310" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="348" y="326" fill="#94a3b8" font-size="11.5" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">350</text>' +
                    '<line x1="388" y1="54" x2="388" y2="310" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="388" y="326" fill="#94a3b8" font-size="11.5" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">400</text>' +
                    '<line x1="428" y1="54" x2="428" y2="310" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="428" y="326" fill="#94a3b8" font-size="11.5" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">450</text>' +
                    '<line x1="60" y1="310" x2="452" y2="310" stroke="#cbd5e1" stroke-width="2"/>' +
                    '<polygon points="452,310 442,306 442,314" fill="#cbd5e1"/>' +
                    '<text x="498" y="315" fill="#f8fafc" font-size="13" font-weight="800" text-anchor="end">τ (s)</text>' +
                    '<text x="58" y="326" fill="#cbd5e1" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="end">0</text>' +
                    '<line x1="68" y1="318" x2="68" y2="34" stroke="#cbd5e1" stroke-width="2"/>' +
                    '<polygon points="68,34 64,44 72,44" fill="#cbd5e1"/>' +
                    '<text x="68" y="24" fill="#f8fafc" font-size="13.5" font-weight="800" text-anchor="middle">t (°C)</text>' +
                    '<line x1="68" y1="163" x2="428" y2="87" stroke="#10b981" stroke-width="2.6"/>' +
                    '<circle cx="116" cy="148.7" r="3.5" fill="#38bdf8" stroke="#0f172a" stroke-width="1.2"/>' +
                    '<circle cx="164" cy="147.4" r="3.5" fill="#38bdf8" stroke="#0f172a" stroke-width="1.2"/>' +
                    '<circle cx="212" cy="137.2" r="3.5" fill="#38bdf8" stroke="#0f172a" stroke-width="1.2"/>' +
                    '<circle cx="260" cy="126.3" r="3.5" fill="#38bdf8" stroke="#0f172a" stroke-width="1.2"/>' +
                    '<circle cx="308" cy="110.3" r="3.5" fill="#38bdf8" stroke="#0f172a" stroke-width="1.2"/>' +
                    '<circle cx="356" cy="103.3" r="3.5" fill="#38bdf8" stroke="#0f172a" stroke-width="1.2"/>' +
                    '<circle cx="404" cy="93.7" r="3.5" fill="#38bdf8" stroke="#0f172a" stroke-width="1.2"/>' +
                    '<circle cx="148" cy="146.2" r="5" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>' +
                    '<text x="148" y="134" fill="#f59e0b" font-size="14" font-weight="800" text-anchor="middle">M</text>' +
                    '<circle cx="388" cy="95.6" r="5" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>' +
                    '<text x="388" y="83" fill="#f59e0b" font-size="14" font-weight="800" text-anchor="middle">N</text>' +
                    '</svg>';

                return '<div class="vlxt-visual-container"><div class="vlxt-grid-2col">' +
                    '<div class="vlxt-stage-wrap">' + captionHtml('fa-solid fa-flask', 'Hình 4.1: Bộ thí nghiệm đo nhiệt dung riêng của nước') + leftSvg + '</div>' +
                    '<div class="vlxt-stage-wrap">' + captionHtml('fa-solid fa-chart-line', 'Đồ thị thực nghiệm nhiệt độ t (°C) theo thời gian τ (s)') + rightSvg + '</div>' +
                    '</div></div>';
            }
        },
        'MH-C1-03': {
            id: 'MH-C1-03',
            title: 'Bộ thí nghiệm đo nhiệt nóng chảy riêng nước đá và đồ thị ngoại suy',
            topic: 'DS-C1.3',
            layout: '2col',
            caption: 'Hình 1: Bộ đo nhiệt nóng chảy riêng của nước đá',
            caption2: 'Hình 2: Đồ thị thay đổi nhiệt độ theo thời gian',
            alt: 'Bộ 5 dụng cụ đo nhiệt nóng chảy riêng của nước đá và đồ thị thực nghiệm nhiệt độ theo thời gian',
            build: function () {
                var leftSvg =
                    '<svg viewBox="0 0 510 370" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
                    '<rect x="18" y="25" width="128" height="118" rx="8" fill="#1e293b" stroke="#475569" stroke-width="2"/>' +
                    '<g transform="translate(24,32)"><rect x="0" y="0" width="116" height="26" rx="4" fill="#0b1120" stroke="#334155"/>' +
                    '<text x="58" y="18" fill="#38bdf8" font-size="12.5" font-weight="800" text-anchor="middle">(1) Nguồn điện</text></g>' +
                    '<circle cx="82" cy="86" r="20" fill="#334155" stroke="#64748b" stroke-width="2"/>' +
                    '<line x1="82" y1="86" x2="94" y2="75" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/>' +
                    '<circle cx="50" cy="124" r="6" fill="#ef4444"/><circle cx="114" cy="124" r="6" fill="#0284c7"/>' +
                    '<rect x="164" y="25" width="146" height="118" rx="8" fill="#1e293b" stroke="#475569" stroke-width="2"/>' +
                    '<g transform="translate(170,32)"><rect x="0" y="0" width="134" height="26" rx="4" fill="#0b1120" stroke="#334155"/>' +
                    '<text x="67" y="18" fill="#38bdf8" font-size="12.5" font-weight="800" text-anchor="middle">(2) Oát kế</text></g>' +
                    '<rect x="171" y="61" width="132" height="50" rx="5" fill="#0b1120" stroke="#334155"/>' +
                    '<circle cx="185" cy="127" r="4.5" fill="#ef4444"/><circle cx="210" cy="127" r="4.5" fill="#ef4444"/>' +
                    '<circle cx="264" cy="127" r="4.5" fill="#0284c7"/><circle cx="289" cy="127" r="4.5" fill="#0284c7"/>' +
                    '<rect x="330" y="68" width="156" height="186" rx="12" fill="#78350f" opacity="0.35" stroke="#d97706" stroke-width="2.5"/>' +
                    '<rect x="340" y="108" width="136" height="136" rx="8" fill="rgba(56,189,248,0.22)" stroke="#38bdf8" stroke-width="1.8"/>' +
                    '<g class="ambient-stirrer">' +
                    '<line x1="365" y1="42" x2="365" y2="226" stroke="#cbd5e1" stroke-width="3"/>' +
                    '<circle cx="365" cy="226" r="9" fill="none" stroke="#cbd5e1" stroke-width="2.5"/>' +
                    '<rect x="356" y="34" width="18" height="16" rx="3" fill="#ef4444"/>' +
                    '</g>' +
                    '<g class="ambient-ice-bob">' +
                    '<rect x="386" y="152" width="28" height="26" rx="4" fill="rgba(255,255,255,0.82)" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '<rect x="422" y="166" width="24" height="22" rx="4" fill="rgba(255,255,255,0.78)" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '<rect x="398" y="192" width="26" height="24" rx="4" fill="rgba(255,255,255,0.72)" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '</g>' +
                    '<path d="M 380 220 Q 395 208 410 220 T 440 220" fill="none" stroke="#ea580c" stroke-width="3"/>' +
                    '<line x1="380" y1="220" x2="380" y2="72" stroke="#f97316" stroke-width="1.8"/>' +
                    '<line x1="440" y1="220" x2="440" y2="72" stroke="#f97316" stroke-width="1.8"/>' +
                    '<rect x="325" y="60" width="166" height="18" rx="4" fill="#334155" stroke="#64748b"/>' +
                    '<g transform="translate(325,268)"><rect x="0" y="0" width="166" height="34" rx="6" fill="#0f172a" stroke="#d97706" stroke-width="1.5"/>' +
                    '<text x="83" y="22" fill="#f59e0b" font-size="13" font-weight="800" text-anchor="middle">(4) Nhiệt lượng kế + Nước đá</text></g>' +
                    '<rect x="444" y="16" width="30" height="70" rx="4" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.8"/>' +
                    '<line x1="459" y1="86" x2="459" y2="195" stroke="#cbd5e1" stroke-width="2.8"/>' +
                    '<circle cx="459" cy="195" r="4.5" fill="#0284c7"/>' +
                    '<rect x="448" y="32" width="22" height="24" rx="3" fill="#0f172a"/>' +
                    '<g transform="translate(416,2)"><rect x="0" y="0" width="94" height="22" rx="4" fill="#0f172a" stroke="#334155"/>' +
                    '<text x="47" y="15" fill="#38bdf8" font-size="11.5" font-weight="800" text-anchor="middle">(3) Nhiệt kế</text></g>' +
                    '<g transform="translate(18,220)"><rect x="0" y="0" width="144" height="68" rx="8" fill="#1e293b" stroke="#475569" stroke-width="2"/>' +
                    '<ellipse cx="72" cy="0" rx="58" ry="8" fill="#94a3b8" stroke="#cbd5e1" stroke-width="1.5"/>' +
                    '<rect x="18" y="16" width="108" height="34" rx="4" fill="#0f172a" stroke="#334155"/>' +
                    '<g transform="translate(0,78)"><rect x="0" y="0" width="144" height="26" rx="4" fill="#0f172a" stroke="#334155"/>' +
                    '<text x="72" y="17" fill="#38bdf8" font-size="12" font-weight="800" text-anchor="middle">(5) Cân điện tử</text></g></g>' +
                    '</svg>';

                var rightSvg =
                    '<svg viewBox="0 0 510 370" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
                    '<line x1="68" y1="264" x2="442" y2="264" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="58" y="268" fill="#cbd5e1" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="end">0,2</text>' +
                    '<line x1="68" y1="228" x2="442" y2="228" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="58" y="232" fill="#cbd5e1" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="end">0,4</text>' +
                    '<line x1="68" y1="192" x2="442" y2="192" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="58" y="196" fill="#cbd5e1" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="end">0,6</text>' +
                    '<line x1="68" y1="156" x2="442" y2="156" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="58" y="160" fill="#cbd5e1" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="end">0,8</text>' +
                    '<line x1="68" y1="120" x2="442" y2="120" stroke="#334155" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="58" y="124" fill="#cbd5e1" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="end">1,0</text>' +
                    '<line x1="68" y1="84" x2="442" y2="84" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="58" y="88" fill="#cbd5e1" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="end">1,2</text>' +
                    '<line x1="68" y1="48" x2="442" y2="48" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="58" y="52" fill="#cbd5e1" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="end">1,4</text>' +
                    '<line x1="102" y1="48" x2="102" y2="300" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="102" y="322" fill="#94a3b8" font-size="11" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">100</text>' +
                    '<line x1="136" y1="48" x2="136" y2="300" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="136" y="322" fill="#94a3b8" font-size="11" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">200</text>' +
                    '<line x1="170" y1="48" x2="170" y2="300" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="170" y="322" fill="#94a3b8" font-size="11" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">300</text>' +
                    '<line x1="204" y1="48" x2="204" y2="300" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="204" y="322" fill="#94a3b8" font-size="11" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">400</text>' +
                    '<line x1="238" y1="48" x2="238" y2="300" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="238" y="322" fill="#94a3b8" font-size="11" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">500</text>' +
                    '<line x1="272" y1="48" x2="272" y2="300" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="272" y="322" fill="#94a3b8" font-size="11" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">600</text>' +
                    '<line x1="306" y1="48" x2="306" y2="300" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="306" y="322" fill="#94a3b8" font-size="11" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">700</text>' +
                    '<line x1="340" y1="48" x2="340" y2="300" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="340" y="322" fill="#94a3b8" font-size="11" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">800</text>' +
                    '<line x1="374" y1="48" x2="374" y2="300" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="374" y="322" fill="#94a3b8" font-size="11" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">900</text>' +
                    '<line x1="408" y1="48" x2="408" y2="300" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="408" y="322" fill="#94a3b8" font-size="11" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">1000</text>' +
                    '<line x1="442" y1="48" x2="442" y2="300" stroke="#1e293b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
                    '<text x="442" y="322" fill="#94a3b8" font-size="11" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">1100</text>' +
                    '<line x1="60" y1="300" x2="462" y2="300" stroke="#cbd5e1" stroke-width="2"/>' +
                    '<polygon points="462,300 452,296 452,304" fill="#cbd5e1"/>' +
                    '<text x="502" y="305" fill="#f8fafc" font-size="13" font-weight="800" text-anchor="end">τ (s)</text>' +
                    '<text x="58" y="322" fill="#cbd5e1" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="end">0</text>' +
                    '<line x1="68" y1="308" x2="68" y2="34" stroke="#cbd5e1" stroke-width="2"/>' +
                    '<polygon points="68,34 64,44 72,44" fill="#cbd5e1"/>' +
                    '<text x="68" y="24" fill="#f8fafc" font-size="13.5" font-weight="800" text-anchor="middle">t (°C)</text>' +
                    '<line x1="68" y1="300" x2="285.6" y2="300" stroke="#38bdf8" stroke-width="3"/>' +
                    '<line x1="285.6" y1="300" x2="425" y2="48" stroke="#10b981" stroke-width="2.8"/>' +
                    '<circle cx="68" cy="300" r="3.5" fill="#38bdf8"/>' +
                    '<circle cx="109" cy="300" r="3.5" fill="#38bdf8"/>' +
                    '<circle cx="150" cy="300" r="3.5" fill="#38bdf8"/>' +
                    '<circle cx="187" cy="300" r="3.5" fill="#38bdf8"/>' +
                    '<circle cx="231" cy="300" r="3.5" fill="#38bdf8"/>' +
                    '<circle cx="272" cy="300" r="3.5" fill="#38bdf8"/>' +
                    '<circle cx="313" cy="246" r="4" fill="#38bdf8" stroke="#0f172a" stroke-width="1.2"/>' +
                    '<circle cx="354" cy="192" r="4" fill="#38bdf8" stroke="#0f172a" stroke-width="1.2"/>' +
                    '<circle cx="394" cy="102" r="4" fill="#38bdf8" stroke="#0f172a" stroke-width="1.2"/>' +
                    '</svg>';

                return '<div class="vlxt-visual-container"><div class="vlxt-grid-2col">' +
                    '<div class="vlxt-stage-wrap">' + captionHtml('fa-solid fa-cube', 'Hình 1: Bộ đo nhiệt nóng chảy riêng của nước đá') + leftSvg + '</div>' +
                    '<div class="vlxt-stage-wrap">' + captionHtml('fa-solid fa-chart-area', 'Hình 2: Đồ thị thay đổi nhiệt độ theo thời gian') + rightSvg + '</div>' +
                    '</div></div>';
            }
        },
        'MH-C1-04': {
            id: 'MH-C1-04',
            title: 'Sơ đồ mạch đo nhiệt dung riêng chất lỏng (Biến áp – Oát kế – Nhiệt lượng kế)',
            topic: 'DS-C1.2',
            layout: 'single',
            caption: 'Sơ đồ mạch đo nhiệt dung riêng chất lỏng (Biến áp nguồn -> Oát kế -> Nhiệt lượng kế)',
            alt: 'Sơ đồ mạch đo nhiệt dung riêng chất lỏng gồm biến áp nguồn, oát kế, bình nhiệt lượng kế có nhiệt kế cắm vào và dây điện trở xoắn lò xo ở đáy',
            build: function () {
                var svg =
                    '<svg viewBox="0 0 840 400" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
                    /* MAT BAN THI NGHIEM */
                    '<line x1="30" y1="350" x2="810" y2="350" stroke="#334155" stroke-width="2.5"/>' +
                    /* 1. BIEN AP NGUON (Ben trai, mau xanh nhat bo goc, 2 num xoay, coc + va -) */
                    '<g transform="translate(60,165)">' +
                    '<rect x="0" y="0" width="170" height="155" rx="16" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>' +
                    /* Man hinh hien thi nho o tren */
                    '<rect x="25" y="18" width="120" height="38" rx="6" fill="#0f172a" stroke="#475569" stroke-width="1.5"/>' +
                    /* 2 Num xoay dieu chinh o duoi */
                    '<circle cx="50" cy="98" r="18" fill="#0b1120" stroke="#64748b" stroke-width="2"/>' +
                    '<line x1="50" y1="98" x2="62" y2="88" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/>' +
                    '<circle cx="120" cy="98" r="18" fill="#0b1120" stroke="#64748b" stroke-width="2"/>' +
                    '<line x1="120" y1="98" x2="132" y2="88" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/>' +
                    /* 2 Coc noi day nguon: Coc Duong (+) o tren, Coc Am (-) o duoi */
                    '<circle cx="68" cy="138" r="5" fill="#ef4444"/><text x="54" y="142" fill="#fca5a5" font-size="14" font-weight="900">+</text>' +
                    '<circle cx="102" cy="138" r="5" fill="#0284c7"/><text x="116" y="142" fill="#7dd3fc" font-size="16" font-weight="900">-</text>' +
                    '</g>' +
                    '<text x="145" y="145" fill="#f8fafc" font-size="14.5" font-weight="800" text-anchor="middle">Biến áp nguồn</text>' +
                    /* 2. OAT KE (O giua, hop nho co 4 coc: 2 coc do o tren, 2 coc xanh o duoi) */
                    '<g transform="translate(305,210)">' +
                    '<rect x="0" y="0" width="95" height="75" rx="10" fill="#1e293b" stroke="#64748b" stroke-width="2"/>' +
                    '<circle cx="28" cy="24" r="6" fill="#ef4444"/><circle cx="67" cy="24" r="6" fill="#ef4444"/>' +
                    '<circle cx="28" cy="51" r="6" fill="#0284c7"/><circle cx="67" cy="51" r="6" fill="#0284c7"/>' +
                    '</g>' +
                    '<text x="352.5" y="195" fill="#f8fafc" font-size="14.5" font-weight="800" text-anchor="middle">Oát kế</text>' +
                    /* DAY NOI DIEN CHUAN XAC: */
                    /* Day do: Tu bien ap nguon sang coc do trai oat ke */
                    '<line x1="128" y1="303" x2="333" y2="234" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>' +
                    /* Day xanh: Tu bien ap nguon sang coc xanh trai oat ke */
                    '<line x1="162" y1="303" x2="333" y2="261" stroke="#0284c7" stroke-width="3" stroke-linecap="round"/>' +
                    /* Day do tu coc do phai oat ke di sang coc do nhiet luong ke */
                    '<path d="M 372 234 L 465 234 L 465 38 L 710 38 L 710 115" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>' +
                    /* Day xanh tu coc xanh phai oat ke di sang coc xanh nhiet luong ke */
                    '<path d="M 372 261 L 480 261 L 480 62 L 660 62 L 660 115" fill="none" stroke="#0284c7" stroke-width="3" stroke-linecap="round"/>' +
                    /* 3. NHIET LUONG KE (Ben phai, binh thuy tinh chua chat long, co nap) */
                    '<g transform="translate(560,95)">' +
                    /* Vanh mieng va binh */
                    '<rect x="0" y="16" width="180" height="235" rx="12" fill="rgba(14,165,233,0.12)" stroke="#38bdf8" stroke-width="2.5"/>' +
                    '<rect x="6" y="65" width="168" height="180" rx="8" fill="rgba(56,189,248,0.25)" class="ambient-water-wave"/>' +
                    '<line x1="6" y1="65" x2="174" y2="65" stroke="#7dd3fc" stroke-width="2"/>' +
                    /* Nap binh nhiet luong ke */
                    '<rect x="-8" y="8" width="196" height="16" rx="4" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>' +
                    /* 2 Coc dien tren nap */
                    '<rect x="94" y="-3" width="12" height="12" rx="2" fill="#0284c7"/>' +
                    '<rect x="144" y="-3" width="12" height="12" rx="2" fill="#ef4444"/>' +
                    /* 2 Thanh kim loai dan dien tu nap xuong day binh */
                    '<line x1="100" y1="9" x2="100" y2="200" stroke="#94a3b8" stroke-width="3.5"/>' +
                    '<line x1="150" y1="9" x2="150" y2="200" stroke="#94a3b8" stroke-width="3.5"/>' +
                    /* DAY DIEN TRO XOAN LO XO NAM NGANG O DAY (000000) */
                    '<g transform="translate(100,200)">' +
                    '<path d="M 0 0 C 8 -12 14 -12 14 0 C 14 12 8 12 0 0 ' +
                            'M 10 0 C 18 -12 24 -12 24 0 C 24 12 18 12 10 0 ' +
                            'M 20 0 C 28 -12 34 -12 34 0 C 34 12 28 12 20 0 ' +
                            'M 30 0 C 38 -12 44 -12 44 0 C 44 12 38 12 30 0 ' +
                            'M 40 0 C 48 -12 50 -12 50 0" ' +
                          'fill="none" stroke="#ea580c" stroke-width="3.5" stroke-linecap="round"/>' +
                    '</g>' +
                    /* NHIET KE RƯỢU / THỦY NGÂN CAM THANG DUNG QUA NAP */
                    '<g transform="translate(42,-45)">' +
                    '<rect x="0" y="0" width="18" height="210" rx="9" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>' +
                    '<line x1="9" y1="18" x2="9" y2="198" stroke="#ef4444" stroke-width="3.5"/>' +
                    '<circle cx="9" cy="198" r="6" fill="#ef4444"/>' +
                    '<rect x="-3" y="45" width="24" height="14" rx="2" fill="#dc2626"/>' +
                    '<line x1="4" y1="75" x2="8" y2="75" stroke="#475569" stroke-width="1.5"/>' +
                    '<line x1="4" y1="90" x2="8" y2="90" stroke="#475569" stroke-width="1.5"/>' +
                    '<line x1="4" y1="105" x2="8" y2="105" stroke="#475569" stroke-width="1.5"/>' +
                    '<line x1="4" y1="120" x2="8" y2="120" stroke="#475569" stroke-width="1.5"/>' +
                    '</g>' +
                    '</g>' +
                    /* Nhan chu thich */
                    '<text x="740" y="80" fill="#f8fafc" font-size="14.5" font-weight="800">Nhiệt lượng kế</text>' +
                    '<text x="705" y="325" fill="#fbbf24" font-size="14" font-weight="800">Dây điện trở</text>' +
                    '<line x1="700" y1="318" x2="675" y2="300" stroke="#f59e0b" stroke-width="1.8" stroke-dasharray="3 3"/>' +
                    '</svg>';
                return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
                    captionHtml('fa-solid fa-bolt', 'Sơ đồ mạch đo nhiệt dung riêng chất lỏng (Biến áp nguồn -> Oát kế -> Nhiệt lượng kế)') + svg +
                    '</div></div>';
            }
        },
        'MH-C1-05': {
            id: 'MH-C1-05',
            title: 'Bộ 5 dụng cụ thực hành đo nhiệt nóng chảy riêng bằng phương pháp trộn lẫn',
            topic: 'DS-C1.3',
            layout: 'single',
            caption: 'Sân khấu 5 thiết bị thực hành đo nhiệt nóng chảy riêng (Phương pháp trộn lẫn)',
            alt: 'Năm thiết bị thí nghiệm đánh số (1) Chai nước, (2) Nhiệt lượng kế có que khuấy, (3) Cốc nước đá 0°C, (4) Cân điện tử ±0,01 g, (5) Nhiệt kế ±0,1°C',
            build: function () {
                var svg =
                    '<svg viewBox="0 0 940 400" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
                    '<line x1="15" y1="308" x2="925" y2="308" stroke="#334155" stroke-width="2.5"/>' +
                    '<line x1="25" y1="315" x2="915" y2="315" stroke="#1e293b" stroke-width="2"/>' +
                    '<g transform="translate(48,62)">' +
                    '<rect x="15" y="45" width="60" height="190" rx="10" fill="rgba(14,165,233,0.22)" stroke="#38bdf8" stroke-width="2"/>' +
                    '<path d="M 15 95 Q 45 90 75 95 L 75 233 Q 45 235 15 233 Z" fill="rgba(2,132,199,0.4)"/>' +
                    '<rect x="29" y="16" width="32" height="30" rx="4" fill="rgba(56,189,248,0.3)" stroke="#38bdf8" stroke-width="1.8"/>' +
                    '<rect x="26" y="5" width="38" height="14" rx="3" fill="#0284c7"/>' +
                    '<rect x="16" y="125" width="58" height="42" fill="#1e293b" rx="3"/>' +
                    '<text x="45" y="151" fill="#38bdf8" font-size="13" font-weight="800" text-anchor="middle">H₂O</text>' +
                    '</g>' +
                    '<g transform="translate(18,323)"><rect x="0" y="0" width="154" height="54" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>' +
                    '<text x="77" y="23" fill="#38bdf8" font-size="13.5" font-weight="800" text-anchor="middle">(1) Chai nước</text>' +
                    '<text x="77" y="42" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">Nước cất tinh khiết</text></g>' +
                    '<g transform="translate(205,54)">' +
                    '<rect x="10" y="35" width="130" height="210" rx="10" fill="#1e293b" stroke="#64748b" stroke-width="2.5"/>' +
                    '<rect x="20" y="80" width="110" height="155" rx="6" fill="rgba(14,165,233,0.2)" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '<rect x="5" y="25" width="140" height="18" rx="4" fill="#334155" stroke="#475569"/>' +
                    '<g class="ambient-stirrer">' +
                    '<line x1="45" y1="0" x2="45" y2="225" stroke="#cbd5e1" stroke-width="3"/>' +
                    '<circle cx="45" cy="225" r="9" fill="none" stroke="#cbd5e1" stroke-width="2.5"/>' +
                    '<rect x="36" y="-8" width="18" height="16" rx="3" fill="#ef4444"/>' +
                    '</g>' +
                    '<rect x="22" y="115" width="106" height="26" rx="3" fill="#0f172a"/>' +
                    '<text x="75" y="133" fill="#cbd5e1" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">BÌNH CÁCH NHIỆT</text>' +
                    '</g>' +
                    '<g transform="translate(192,323)"><rect x="0" y="0" width="170" height="54" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>' +
                    '<text x="85" y="23" fill="#38bdf8" font-size="13.5" font-weight="800" text-anchor="middle">(2) Nhiệt lượng kế</text>' +
                    '<text x="85" y="42" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">Vỏ xốp, có que khuấy</text></g>' +
                    '<g transform="translate(390,78)">' +
                    '<rect x="10" y="25" width="120" height="195" rx="8" fill="rgba(56,189,248,0.16)" stroke="#38bdf8" stroke-width="2.5"/>' +
                    '<path d="M 12 75 Q 70 70 128 75 L 126 218 Q 70 220 14 218 Z" fill="rgba(2,132,199,0.35)"/>' +
                    '<g class="ambient-ice-bob">' +
                    '<rect x="25" y="60" width="34" height="30" rx="4" fill="rgba(255,255,255,0.85)" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '<rect x="68" y="70" width="32" height="28" rx="4" fill="rgba(255,255,255,0.8)" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '<rect x="45" y="105" width="30" height="26" rx="4" fill="rgba(255,255,255,0.75)" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '</g></g>' +
                    '<g transform="translate(382,323)"><rect x="0" y="0" width="158" height="54" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>' +
                    '<text x="79" y="23" fill="#38bdf8" font-size="13.5" font-weight="800" text-anchor="middle">(3) Cốc nước đá</text>' +
                    '<text x="79" y="42" fill="#f59e0b" font-size="12" font-weight="700" text-anchor="middle">Nhiệt độ 0,0°C</text></g>' +
                    '<g transform="translate(565,123)">' +
                    '<rect x="5" y="45" width="165" height="130" rx="10" fill="#1e293b" stroke="#475569" stroke-width="2.5"/>' +
                    '<ellipse cx="87" cy="45" rx="72" ry="11" fill="#94a3b8" stroke="#cbd5e1" stroke-width="2"/>' +
                    '<rect x="20" y="88" width="135" height="46" rx="5" fill="#0f172a" stroke="#334155"/>' +
                    '</g>' +
                    '<g transform="translate(560,323)"><rect x="0" y="0" width="176" height="54" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>' +
                    '<text x="88" y="23" fill="#38bdf8" font-size="13.5" font-weight="800" text-anchor="middle">(4) Cân điện tử</text>' +
                    '<text x="88" y="42" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">Độ chia nhỏ nhất 0,01 g</text></g>' +
                    '<g transform="translate(788,48)">' +
                    '<line x1="32" y1="125" x2="32" y2="255" stroke="#cbd5e1" stroke-width="3"/>' +
                    '<circle cx="32" cy="255" r="4.5" fill="#94a3b8"/>' +
                    '<rect x="12" y="20" width="40" height="105" rx="8" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>' +
                    '<rect x="16" y="44" width="32" height="36" rx="3" fill="#0f172a" stroke="#1e293b" stroke-width="1"/>' +
                    '</g>' +
                    '<g transform="translate(756,323)"><rect x="0" y="0" width="166" height="54" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>' +
                    '<text x="83" y="23" fill="#38bdf8" font-size="13.5" font-weight="800" text-anchor="middle">(5) Nhiệt kế</text>' +
                    '<text x="83" y="42" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">Độ chính xác 0,1°C</text></g>' +
                    '</svg>';
                return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
                    captionHtml('fa-solid fa-boxes-stacked', 'Sân khấu 5 thiết bị thực hành đo nhiệt nóng chảy riêng (Phương pháp trộn lẫn)') + svg +
                    '</div></div>';
            }
        },
        'MH-C1-06': {
            id: 'MH-C1-06',
            title: 'Bình nước nóng năng lượng mặt trời (Tấm hấp thụ 2 m² & Bình bảo ôn 200 lít)',
            topic: 'DS-C1.4',
            layout: 'single',
            caption: 'Mô hình bình nước nóng năng lượng mặt trời (Đối lưu tuần hoàn 3D)',
            alt: 'Bình nước nóng năng lượng mặt trời phối cảnh 3D gồm bình bảo ôn nằm ngang, tấm thu nhiệt nghiêng và chu trình đối lưu tuần hoàn nước nóng dâng lên',
            build: function (u) {
                var svg =
                    '<svg viewBox="0 0 840 400" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
                    '<defs>' +
                    '<linearGradient id="' + u + 'tank3D" x1="0%" y1="0%" x2="0%" y2="100%">' +
                    '<stop offset="0%" stop-color="#94a3b8"/><stop offset="35%" stop-color="#f8fafc"/><stop offset="100%" stop-color="#334155"/>' +
                    '</linearGradient>' +
                    '<linearGradient id="' + u + 'panel3D" x1="0%" y1="0%" x2="100%" y2="100%">' +
                    '<stop offset="0%" stop-color="#0f172a"/><stop offset="50%" stop-color="#1e293b"/><stop offset="100%" stop-color="#0b1120"/>' +
                    '</linearGradient>' +
                    '<marker id="' + u + 'sunArr" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
                    '<path d="M 0 1 L 9 5 L 0 9 z" fill="#f59e0b"/>' +
                    '</marker>' +
                    '<marker id="' + u + 'flowHot" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
                    '<path d="M 0 1 L 9 5 L 0 9 z" fill="#ef4444"/>' +
                    '</marker>' +
                    '<marker id="' + u + 'flowCold" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
                    '<path d="M 0 1 L 9 5 L 0 9 z" fill="#0284c7"/>' +
                    '</marker>' +
                    '</defs>' +
                    /* MAT SAN */
                    '<line x1="30" y1="355" x2="810" y2="355" stroke="#334155" stroke-width="2.5"/>' +
                    /* KHUNG CHAN DO 3D */
                    '<line x1="375" y1="108" x2="355" y2="355" stroke="#64748b" stroke-width="3.5"/>' +
                    '<line x1="595" y1="108" x2="625" y2="355" stroke="#64748b" stroke-width="4"/>' +
                    '<line x1="355" y1="240" x2="615" y2="240" stroke="#475569" stroke-width="2"/>' +
                    /* TAM THU NHIET 3D ISOMETRIC (Dat can xung truc giua) */
                    '<g transform="translate(345,125)">' +
                    '<polygon points="0,0 230,0 170,225 -60,225" fill="url(#' + u + 'panel3D)" stroke="#38bdf8" stroke-width="2.5"/>' +
                    /* Cac ong dong thu nhiet song song tren mat tam */
                    '<line x1="-30" y1="225" x2="30" y2="0" stroke="#1e3a8a" stroke-width="5"/>' +
                    '<line x1="0" y1="225" x2="60" y2="0" stroke="#1e3a8a" stroke-width="5"/>' +
                    '<line x1="30" y1="225" x2="90" y2="0" stroke="#1e3a8a" stroke-width="5"/>' +
                    '<line x1="60" y1="225" x2="120" y2="0" stroke="#1e3a8a" stroke-width="5"/>' +
                    '<line x1="90" y1="225" x2="150" y2="0" stroke="#1e3a8a" stroke-width="5"/>' +
                    '<line x1="120" y1="225" x2="180" y2="0" stroke="#1e3a8a" stroke-width="5"/>' +
                    '<line x1="150" y1="225" x2="210" y2="0" stroke="#1e3a8a" stroke-width="5"/>' +
                    /* Duyen nuoc nong duoc suoi am tu tu dang len theo ong (Doi luu tu nhien) */
                    '<line x1="10" y1="210" x2="70" y2="15" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="6 6" class="ambient-ray-glide"/>' +
                    '<line x1="70" y1="210" x2="130" y2="15" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="6 6" class="ambient-ray-glide"/>' +
                    '<line x1="130" y1="210" x2="190" y2="15" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="6 6" class="ambient-ray-glide"/>' +
                    '</g>' +
                    /* BINH BAO ON HINH TRU 3D NAM NGANG PHIA TREN (Tam x=460) */
                    '<g transform="translate(330,48)">' +
                    '<rect x="0" y="0" width="260" height="68" rx="34" fill="url(#' + u + 'tank3D)" stroke="#475569" stroke-width="2.2"/>' +
                    '<rect x="18" y="16" width="224" height="34" rx="17" fill="rgba(239,68,68,0.22)" stroke="rgba(249,115,22,0.5)" stroke-width="1.5"/>' +
                    '<text x="130" y="38" fill="#0f172a" font-size="13.5" font-weight="900" text-anchor="middle">Bình bảo ôn · V = 200 lít (25°C)</text>' +
                    '</g>' +
                    /* CHU TRINH DOI LUU TUAN HOAN 3D GIUA BINH VA TAM THU: */
                    /* Ong nuoc lanh (Xanh): Nuoc lanh tu day binh bao on chay xuong day tam thu */
                    '<path d="M 390 114 L 390 280 L 320 340" fill="none" stroke="#0284c7" stroke-width="6" stroke-linecap="round"/>' +
                    '<line x1="390" y1="135" x2="390" y2="245" stroke="#7dd3fc" stroke-width="2.5" marker-end="url(#' + u + 'flowCold)"/>' +
                    '<text x="330" y="275" fill="#38bdf8" font-size="12" font-weight="800">Nước lạnh chìm xuống</text>' +
                    /* Ong nuoc nong (Do): Nuoc sau suoi nong tu dinh tam thu dang len vao binh */
                    '<path d="M 525 125 L 525 114" fill="none" stroke="#ef4444" stroke-width="7" stroke-linecap="round"/>' +
                    '<line x1="525" y1="124" x2="525" y2="114" stroke="#fca5a5" stroke-width="2.5" marker-end="url(#' + u + 'flowHot)"/>' +
                    '<text x="545" y="132" fill="#ef4444" font-size="12" font-weight="800">Nước nóng dâng lên (Đối lưu)</text>' +
                    /* MAT TROI CHIEU TIA NANG SONG SONG */
                    '<circle cx="115" cy="70" r="28" fill="#f59e0b"/>' +
                    '<circle cx="115" cy="70" r="36" fill="none" stroke="#fbbf24" stroke-width="2" stroke-dasharray="6 6" class="ambient-fan-spin"/>' +
                    '<g class="ambient-heat-arrow">' +
                    '<line x1="145" y1="88" x2="315" y2="185" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#' + u + 'sunArr)"/>' +
                    '<line x1="135" y1="108" x2="300" y2="204" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#' + u + 'sunArr)"/>' +
                    '<line x1="122" y1="126" x2="282" y2="220" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#' + u + 'sunArr)"/>' +
                    '</g>' +
                    /* The chu thich */
                    '<g transform="translate(22,250)"><rect x="0" y="0" width="186" height="58" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>' +
                    '<text x="93" y="23" fill="#fbbf24" font-size="13" font-weight="800" text-anchor="middle">Cường độ sáng Mặt Trời</text>' +
                    '<text x="93" y="44" fill="#e2e8f0" font-size="12.5" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">I = 1370 W/m² · H = 60%</text></g>' +
                    '<g transform="translate(635,185)"><rect x="0" y="0" width="185" height="56" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '<text x="92" y="23" fill="#38bdf8" font-size="13" font-weight="800" text-anchor="middle">Tấm thu năng lượng mặt trời</text>' +
                    '<text x="92" y="43" fill="#cbd5e1" font-size="12.5" font-weight="600" text-anchor="middle">Diện tích S = 2 m²</text></g>' +
                    '</svg>';
                return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
                    captionHtml('fa-solid fa-solar-panel', 'Mô hình bình nước nóng năng lượng mặt trời (Đối lưu tuần hoàn 3D)') + svg +
                    '</div></div>';
            }
        },
        'MH-C1-07': {
            id: 'MH-C1-07',
            title: 'Sơ đồ nguyên lý máy làm nóng nước dùng rơ-le nhiệt tự ngắt (20 lít – 2500 W)',
            topic: 'DS-C1.4',
            layout: 'single',
            caption: 'Sơ đồ nguyên lý máy làm nóng nước 20 lít – 2500 W (Rơ-le ngắt ở 70°C)',
            alt: 'Máy làm nóng nước gián tiếp có đường điện vào phía trên, màn hình 70°C, núm điều chỉnh, ống nước nóng ra (khóa) và ống nước lạnh vào (18°C)',
            build: function () {
                var svg =
                    '<svg viewBox="0 0 760 390" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
                    '<line x1="373" y1="22" x2="373" y2="75" stroke="#ef4444" stroke-width="4" class="ambient-wire-pulse"/>' +
                    '<line x1="387" y1="22" x2="387" y2="75" stroke="#94a3b8" stroke-width="4"/>' +
                    '<rect x="275" y="75" width="210" height="236" rx="22" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>' +
                    '<rect x="295" y="95" width="170" height="196" rx="14" fill="#0f172a" stroke="#334155" stroke-width="2"/>' +
                    '<rect x="322" y="114" width="116" height="44" rx="6" fill="#050811" stroke="#475569" stroke-width="2"/>' +
                    '<text x="380" y="143" fill="#4ade80" font-size="22" font-family="DM Mono,monospace" font-weight="800" text-anchor="middle">70°C</text>' +
                    '<circle cx="380" cy="202" r="24" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>' +
                    '<circle cx="380" cy="202" r="14" fill="#0284c7"/>' +
                    '<line x1="380" y1="202" x2="394" y2="190" stroke="#f8fafc" stroke-width="2.5" stroke-linecap="round"/>' +
                    '<path d="M 326 266 Q 344 252 362 266 T 398 266 T 434 266" fill="none" stroke="#f97316" stroke-width="4" class="ambient-heat-arrow"/>' +
                    '<text x="380" y="246" fill="#94a3b8" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">20 lít · P = 2500 W</text>' +
                    '<rect x="336" y="311" width="16" height="58" fill="#ef4444" rx="2"/>' +
                    '<line x1="332" y1="336" x2="356" y2="336" stroke="#f8fafc" stroke-width="3"/>' +
                    '<rect x="408" y="311" width="16" height="58" fill="#0284c7" rx="2"/>' +
                    '<polyline points="387,44 495,44" fill="none" stroke="#cbd5e1" stroke-width="1.8" stroke-dasharray="3 3"/>' +
                    '<circle cx="387" cy="44" r="4" fill="#f59e0b"/>' +
                    '<g transform="translate(495,20)"><rect x="0" y="0" width="210" height="48" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>' +
                    '<text x="105" y="21" fill="#fbbf24" font-size="13.5" font-weight="800" text-anchor="middle">Đường đưa điện vào</text>' +
                    '<text x="105" y="39" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">Hiệu suất máy H = 95%</text></g>' +
                    '<polyline points="322,136 226,136" fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="3 3"/>' +
                    '<circle cx="322" cy="136" r="4" fill="#38bdf8"/>' +
                    '<g transform="translate(18,108)"><rect x="0" y="0" width="208" height="54" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '<text x="104" y="23" fill="#38bdf8" font-size="13.5" font-weight="800" text-anchor="middle">Nhiệt độ nước đã làm nóng</text>' +
                    '<text x="104" y="42" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">Rơ-le tự ngắt tại 70°C</text></g>' +
                    '<polyline points="404,202 520,202" fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="3 3"/>' +
                    '<circle cx="404" cy="202" r="4" fill="#38bdf8"/>' +
                    '<g transform="translate(520,175)"><rect x="0" y="0" width="212" height="54" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '<text x="106" y="23" fill="#38bdf8" font-size="13.5" font-weight="800" text-anchor="middle">Núm điều chỉnh nhiệt độ</text>' +
                    '<text x="106" y="42" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">Cảm biến rơ-le nhiệt</text></g>' +
                    '<polyline points="336,348 232,348" fill="none" stroke="#ef4444" stroke-width="1.8" stroke-dasharray="3 3"/>' +
                    '<circle cx="336" cy="348" r="4" fill="#ef4444"/>' +
                    '<g transform="translate(18,320)"><rect x="0" y="0" width="214" height="54" rx="6" fill="#0f172a" stroke="#ef4444" stroke-width="1.5"/>' +
                    '<text x="107" y="23" fill="#fca5a5" font-size="13.5" font-weight="800" text-anchor="middle">Ống dẫn nước nóng ra</text>' +
                    '<text x="107" y="42" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">(Đang khóa van khi đun)</text></g>' +
                    '<polyline points="424,348 520,348" fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="3 3"/>' +
                    '<circle cx="424" cy="348" r="4" fill="#38bdf8"/>' +
                    '<g transform="translate(520,320)"><rect x="0" y="0" width="212" height="54" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '<text x="106" y="23" fill="#7dd3fc" font-size="13.5" font-weight="800" text-anchor="middle">Ống dẫn nước lạnh vào</text>' +
                    '<text x="106" y="42" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">Nhiệt độ ban đầu 18°C</text></g>' +
                    '</svg>';
                return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
                    captionHtml('fa-solid fa-temperature-high', 'Sơ đồ nguyên lý máy làm nóng nước 20 lít – 2500 W (Rơ-le tự ngắt ở 70°C)') + svg +
                    '</div></div>';
            }
        },
        'MH-C1-09': {
            id: 'MH-C1-09',
            title: 'Hệ thống tắm nóng lạnh gián tiếp và vòi hoa sen hòa trộn',
            topic: 'DS-C1.4',
            layout: 'single',
            caption: 'Hệ thống bình tắm nóng lạnh gián tiếp (15 lít) hòa trộn qua vòi hoa sen',
            alt: 'Bình nước nóng gián tiếp 15 lít ở 70°C hòa trộn với đường nước lạnh 20°C qua van trộn để phun nước 30°C tại vòi hoa sen',
            build: function (u) {
                var svg =
                    '<svg viewBox="0 0 800 400" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
                    '<defs><marker id="' + u + 'arw" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
                    '<path d="M 0 1 L 9 5 L 0 9 z" fill="#38bdf8"/></marker></defs>' +
                    '<rect x="38" y="34" width="236" height="52" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>' +
                    '<text x="156" y="57" fill="#fbbf24" font-size="13" font-weight="800" text-anchor="middle">Cầu dao nguồn điện 2,5 kW</text>' +
                    '<text x="156" y="75" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">Hiệu suất làm nóng H = 97%</text>' +
                    '<line x1="156" y1="86" x2="156" y2="112" stroke="#f59e0b" stroke-width="3" class="ambient-wire-pulse"/>' +
                    '<rect x="52" y="112" width="208" height="148" rx="16" fill="#1e293b" stroke="#64748b" stroke-width="2.5"/>' +
                    '<rect x="66" y="126" width="180" height="120" rx="10" fill="rgba(239,68,68,0.22)" stroke="#ef4444" stroke-width="1.8"/>' +
                    '<path d="M 96 226 Q 116 212 136 226 T 176 226 T 216 226" fill="none" stroke="#f97316" stroke-width="3.5"/>' +
                    '<text x="156" y="160" fill="#f8fafc" font-size="14" font-weight="800" text-anchor="middle">BÌNH CHỨA 15 LÍT</text>' +
                    '<text x="156" y="182" fill="#fca5a5" font-size="13" font-family="DM Mono,monospace" font-weight="800" text-anchor="middle">t nóng = 70°C</text>' +
                    '<text x="156" y="202" fill="#94a3b8" font-size="12" font-weight="600" text-anchor="middle">(Ban đầu đầy nước 20°C)</text>' +
                    '<polyline points="156,260 156,315 395,315" fill="none" stroke="#ef4444" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>' +
                    '<polyline points="156,260 156,315 395,315" fill="none" stroke="#fca5a5" stroke-width="2" class="ambient-ray-glide"/>' +
                    '<rect x="44" y="330" width="210" height="44" rx="6" fill="#0f172a" stroke="#ef4444" stroke-width="1.5"/>' +
                    '<text x="149" y="357" fill="#fca5a5" font-size="12.5" font-weight="800" text-anchor="middle">Dòng nước nóng 70°C ra</text>' +
                    '<line x1="395" y1="190" x2="395" y2="300" stroke="#0284c7" stroke-width="8" stroke-linecap="round"/>' +
                    '<line x1="395" y1="195" x2="395" y2="295" stroke="#7dd3fc" stroke-width="2" class="ambient-ray-glide"/>' +
                    '<rect x="305" y="132" width="180" height="54" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '<text x="395" y="155" fill="#7dd3fc" font-size="13" font-weight="800" text-anchor="middle">Nước lạnh hệ thống</text>' +
                    '<text x="395" y="174" fill="#cbd5e1" font-size="12.5" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">t lạnh = 20°C</text>' +
                    '<circle cx="395" cy="315" r="24" fill="#1e293b" stroke="#f59e0b" stroke-width="3"/>' +
                    '<text x="395" y="319" fill="#fbbf24" font-size="12" font-weight="800" text-anchor="middle">TRỘN</text>' +
                    '<text x="395" y="358" fill="#cbd5e1" font-size="12.5" font-weight="700" text-anchor="middle">Van hòa trộn</text>' +
                    '<polyline points="419,315 585,315 585,112 630,112" fill="none" stroke="#f59e0b" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>' +
                    '<polyline points="419,315 585,315 585,112 630,112" fill="none" stroke="#fef3c7" stroke-width="2" class="ambient-ray-glide"/>' +
                    '<rect x="442" y="255" width="130" height="44" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>' +
                    '<text x="507" y="275" fill="#fbbf24" font-size="12.5" font-weight="800" text-anchor="middle">Nước pha ấm</text>' +
                    '<text x="507" y="292" fill="#e2e8f0" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">t = 30°C</text>' +
                    '<polygon points="622,102 688,125 676,142 612,118" fill="#94a3b8" stroke="#cbd5e1" stroke-width="2"/>' +
                    '<g class="ambient-drops">' +
                    '<line x1="624" y1="126" x2="604" y2="215" stroke="#38bdf8" stroke-width="2.2" stroke-dasharray="5 5"/>' +
                    '<line x1="640" y1="132" x2="632" y2="225" stroke="#38bdf8" stroke-width="2.2" stroke-dasharray="5 5"/>' +
                    '<line x1="656" y1="138" x2="660" y2="225" stroke="#38bdf8" stroke-width="2.2" stroke-dasharray="5 5"/>' +
                    '<line x1="672" y1="144" x2="688" y2="215" stroke="#38bdf8" stroke-width="2.2" stroke-dasharray="5 5"/>' +
                    '</g>' +
                    '<rect x="598" y="242" width="184" height="72" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '<text x="690" y="264" fill="#38bdf8" font-size="13" font-weight="800" text-anchor="middle">Vòi hoa sen (30°C)</text>' +
                    '<text x="690" y="284" fill="#e2e8f0" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">Tổng tiết diện S = 30 mm²</text>' +
                    '<text x="690" y="302" fill="#e2e8f0" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">Tốc độ tia v = 4 m/s</text>' +
                    '</svg>';
                return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
                    captionHtml('fa-solid fa-shower', 'Hệ thống tắm nóng lạnh gián tiếp (15 lít) hòa trộn qua vòi hoa sen') + svg +
                    '</div></div>';
            }
        },
        'MH-C1-10': {
            id: 'MH-C1-10',
            title: 'Sục điện nhôm xoắn kép 2500 W đun 10 lít nước trong xô nhựa',
            topic: 'DS-C1.4',
            layout: 'single',
            caption: 'Mô hình đun 10 lít nước bằng sục điện xoắn kép (2500 W – 220 V)',
            alt: 'Xô nhựa chứa 10 lít nước ở 20°C có đầu sục điện nhôm xoắn kép cắm trực tiếp nối phích cắm vào ổ điện 220 V',
            build: function () {
                var svg =
                    '<svg viewBox="0 0 760 390" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
                    '<line x1="40" y1="348" x2="720" y2="348" stroke="#334155" stroke-width="2.5"/>' +
                    /* Than xo nhua: mieng xo tren ho hoan toan (khong co net lien o tren nap), thanh va day xo */
                    '<path d="M 155 138 L 178 344 L 342 344 L 365 138" fill="rgba(30,41,59,0.5)" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>' +
                    /* Nuoc trong xo */
                    '<polygon points="163,180 357,180 338,338 182,338" fill="rgba(14,165,233,0.34)" class="ambient-water-wave"/>' +
                    '<line x1="163" y1="180" x2="357" y2="180" stroke="#7dd3fc" stroke-width="2"/>' +
                    /* Tay cam/chuoi cach dien mau trang cua suc dien */
                    '<rect x="242" y="88" width="36" height="54" rx="6" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>' +
                    '<rect x="248" y="78" width="24" height="12" rx="3" fill="#cbd5e1"/>' +
                    /* Day cap dien nguon noi tu chuoi trang vao phich cam 220V */
                    '<path d="M 260 78 C 260 25 435 25 445 135 L 445 208" fill="none" stroke="#475569" stroke-width="6" stroke-linecap="round"/>' +
                    '<path d="M 260 78 C 260 25 435 25 445 135 L 445 208" fill="none" stroke="#ef4444" stroke-width="2.5" class="ambient-wire-pulse"/>' +
                    /* Soi nhom xoan kep: 2 can kim loai dinh chat tu day chuoi trang (y=142) di xuong, uon lien tuc thanh lo xo xoan oc */
                    '<line x1="250" y1="142" x2="250" y2="208" stroke="#cbd5e1" stroke-width="5.5" stroke-linecap="round"/>' +
                    '<line x1="270" y1="142" x2="270" y2="292" stroke="#cbd5e1" stroke-width="5.5" stroke-linecap="round"/>' +
                    /* Cac vong lo xo xoan oc lien tuc (Continuous helical coils) */
                    '<path d="M 250 208 C 218 214 218 228 260 228 C 302 228 302 242 250 244 ' +
                            'C 218 248 218 262 260 262 C 302 262 302 276 250 278 ' +
                            'C 218 282 218 296 260 296 C 275 296 270 292 270 292" ' +
                          'fill="none" stroke="#f97316" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>' +
                    /* Bot nuoc va hoi nong boc len quanh day dot */
                    '<g class="ambient-steam">' +
                    '<circle cx="232" cy="196" r="4" fill="rgba(255,255,255,0.6)"/>' +
                    '<circle cx="288" cy="210" r="3.5" fill="rgba(255,255,255,0.55)"/>' +
                    '<circle cx="255" cy="172" r="4" fill="rgba(255,255,255,0.55)"/>' +
                    '</g>' +
                    /* O cam dien 220V */
                    '<rect x="415" y="198" width="60" height="58" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2.5"/>' +
                    '<circle cx="434" cy="226" r="5" fill="#94a3b8"/><circle cx="456" cy="226" r="5" fill="#94a3b8"/>' +
                    '<text x="445" y="248" fill="#fbbf24" font-size="12" font-family="DM Mono,monospace" font-weight="800" text-anchor="middle">220 V</text>' +
                    /* The chu thich Soi nhom xoan kep */
                    '<polyline points="296,250 515,250" fill="none" stroke="#f59e0b" stroke-width="1.8" stroke-dasharray="3 3"/>' +
                    '<circle cx="296" cy="250" r="4" fill="#f59e0b"/>' +
                    '<g transform="translate(515,222)"><rect x="0" y="0" width="225" height="58" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>' +
                    '<text x="112" y="23" fill="#fbbf24" font-size="13.5" font-weight="800" text-anchor="middle">Sợi nhôm xoắn kép (Sục điện)</text>' +
                    '<text x="112" y="44" fill="#cbd5e1" font-size="12" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">2500 W – 220 V · H = 90%</text></g>' +
                    /* The chu thich O cam dien */
                    '<polyline points="475,226 515,152" fill="none" stroke="#ef4444" stroke-width="1.8" stroke-dasharray="3 3"/>' +
                    '<circle cx="475" cy="226" r="4" fill="#ef4444"/>' +
                    '<g transform="translate(515,120)"><rect x="0" y="0" width="225" height="56" rx="6" fill="#0f172a" stroke="#ef4444" stroke-width="1.5"/>' +
                    '<text x="112" y="23" fill="#fca5a5" font-size="13.5" font-weight="800" text-anchor="middle">Ổ cắm lưới điện 220 V</text>' +
                    '<text x="112" y="43" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">Cấu trúc dây trần ngâm nước</text></g>' +
                    /* The chu thich Xo nhua */
                    '<polyline points="175,260 142,260" fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="3 3"/>' +
                    '<circle cx="175" cy="260" r="4" fill="#38bdf8"/>' +
                    '<g transform="translate(12,232)"><rect x="0" y="0" width="132" height="56" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '<text x="66" y="23" fill="#38bdf8" font-size="13.5" font-weight="800" text-anchor="middle">Xô nhựa</text>' +
                    '<text x="66" y="43" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">10 lít (t₀ = 20°C)</text></g>' +
                    '</svg>';
                return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
                    captionHtml('fa-solid fa-plug', 'Mô hình đun 10 lít nước bằng sục điện xoắn kép (2500 W – 220 V)') + svg +
                    '</div></div>';
            }
        },
        'MH-C1-11': {
            id: 'MH-C1-11',
            title: 'Hệ thống tản nhiệt chất lỏng cho CPU (Water Block – Bơm – Quạt két tản nhiệt)',
            topic: 'DS-C1.5',
            layout: 'single',
            caption: 'Cấu trúc hệ thống tản nhiệt chất lỏng cho CPU (Phối cảnh 3D chuẩn)',
            alt: 'Hệ thống làm mát chất lỏng CPU gồm bộ làm mát áp trực tiếp CPU, hai ống dẫn mềm uốn vòng cung và két tản nhiệt kèm quạt 3D phía trước',
            build: function (u) {
                var svg =
                    '<svg viewBox="0 0 840 410" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
                    '<defs>' +
                    '<linearGradient id="' + u + 'cpuBlock" x1="0%" y1="0%" x2="100%" y2="0%">' +
                    '<stop offset="0%" stop-color="#ef4444"/><stop offset="100%" stop-color="#0284c7"/>' +
                    '</linearGradient>' +
                    '<marker id="' + u + 'windIn" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 1 L 9 5 L 0 9 z" fill="#38bdf8"/></marker>' +
                    '<marker id="' + u + 'windOut" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 1 L 9 5 L 0 9 z" fill="#ef4444"/></marker>' +
                    '</defs>' +
                    /* 1. BO LAM MAT CPU (Water Block 3D o goc duoi ben trai) */
                    '<g transform="translate(60,250)">' +
                    /* De kim loai bat 4 oc vit xuong mainboard */
                    '<polygon points="40,95 150,95 130,120 20,120" fill="#334155" stroke="#94a3b8" stroke-width="1.8"/>' +
                    '<circle cx="28" cy="116" r="3.5" fill="#f8fafc"/><circle cx="122" cy="116" r="3.5" fill="#f8fafc"/>' +
                    '<circle cx="48" cy="98" r="3.5" fill="#f8fafc"/><circle cx="142" cy="98" r="3.5" fill="#f8fafc"/>' +
                    /* Than khoi tru tron Water Block */
                    '<ellipse cx="85" cy="80" rx="48" ry="18" fill="url(#' + u + 'cpuBlock)" stroke="#cbd5e1" stroke-width="2"/>' +
                    '<rect x="37" y="52" width="96" height="28" fill="url(#' + u + 'cpuBlock)" stroke="#cbd5e1" stroke-width="1.8"/>' +
                    '<ellipse cx="85" cy="52" rx="48" ry="16" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>' +
                    '<text x="85" y="56" fill="#f8fafc" font-size="12" font-weight="800" text-anchor="middle">CPU (210 W)</text>' +
                    /* 2 Khop noi ong tren than Water Block */
                    '<rect x="115" y="48" width="18" height="12" rx="3" fill="#ef4444"/>' +
                    '<rect x="135" y="54" width="18" height="12" rx="3" fill="#0284c7"/>' +
                    '</g>' +
                    '<text x="145" y="240" fill="#38bdf8" font-size="14" font-weight="800" text-anchor="middle">Bộ làm mát</text>' +
                    /* 2. HAI ONG DAN NUOC MEM UON CONG HINH VONG CUNG SANG KET TAN NHIET */
                    /* Ong do: Nuoc nong chay tu CPU sang ket tan nhiet */
                    '<path d="M 193 304 C 340 340 580 340 705 242" fill="none" stroke="#ef4444" stroke-width="11" stroke-linecap="round"/>' +
                    '<path d="M 193 304 C 340 340 580 340 705 242" fill="none" stroke="#fef2f2" stroke-width="2.5" stroke-dasharray="8 8" class="ambient-ray-glide"/>' +
                    /* Ong xanh: Nuoc mat tu ket tan nhiet hoi ve CPU */
                    '<path d="M 705 218 C 570 300 340 300 213 310" fill="none" stroke="#0284c7" stroke-width="11" stroke-linecap="round"/>' +
                    '<path d="M 705 218 C 570 300 340 300 213 310" fill="none" stroke="#e0f2fe" stroke-width="2.5" stroke-dasharray="8 8" class="ambient-ray-glide"/>' +
                    /* 3. BO TAN NHIET (Radiator 3D o goc tren ben phai) */
                    '<g transform="translate(565,25)">' +
                    /* Mat hop truoc */
                    '<polygon points="0,25 130,0 130,175 0,200" fill="#0f172a" stroke="#64748b" stroke-width="2.2"/>' +
                    /* Mat hong day */
                    '<polygon points="130,0 155,18 155,193 130,175" fill="#1e293b" stroke="#64748b" stroke-width="1.8"/>' +
                    /* Mat tren */
                    '<polygon points="0,25 130,0 155,18 25,43" fill="#334155" stroke="#64748b" stroke-width="1.8"/>' +
                    /* Cac la nhom tan nhiet ngang (Chia nua tren lanh, nua duoi nong) */
                    '<line x1="15" y1="55" x2="115" y2="35" stroke="#38bdf8" stroke-width="3"/>' +
                    '<line x1="15" y1="75" x2="115" y2="55" stroke="#38bdf8" stroke-width="3"/>' +
                    '<line x1="15" y1="95" x2="115" y2="75" stroke="#38bdf8" stroke-width="3"/>' +
                    '<line x1="15" y1="125" x2="115" y2="105" stroke="#ef4444" stroke-width="3"/>' +
                    '<line x1="15" y1="145" x2="115" y2="125" stroke="#ef4444" stroke-width="3"/>' +
                    '<line x1="15" y1="165" x2="115" y2="145" stroke="#ef4444" stroke-width="3"/>' +
                    /* 2 Khop noi ong tren ket */
                    '<circle cx="140" cy="193" r="7" fill="#0284c7"/>' +
                    '<circle cx="140" cy="217" r="7" fill="#ef4444"/>' +
                    '</g>' +
                    /* 4. KHUNG QUAT 3D GAN TACH PHIA TRUOC KET TAN NHIET (Chuan image14.jpg) */
                    '<g transform="translate(445,65)">' +
                    /* 4 Thanh oc bulong dai bat noi quat voi ket */
                    '<line x1="10" y1="20" x2="120" y2="-20" stroke="#cbd5e1" stroke-width="2.5"/>' +
                    '<line x1="120" y1="0" x2="230" y2="-40" stroke="#cbd5e1" stroke-width="2.5"/>' +
                    '<line x1="10" y1="185" x2="120" y2="145" stroke="#cbd5e1" stroke-width="2.5"/>' +
                    '<line x1="120" y1="165" x2="230" y2="125" stroke="#cbd5e1" stroke-width="2.5"/>' +
                    /* Mat truoc khung quat vuong 3D mau trang bac */
                    '<polygon points="0,20 115,0 115,165 0,185" fill="rgba(241,245,249,0.92)" stroke="#94a3b8" stroke-width="2"/>' +
                    '<circle cx="12" cy="30" r="3.5" fill="#475569"/><circle cx="103" cy="12" r="3.5" fill="#475569"/>' +
                    '<circle cx="12" cy="173" r="3.5" fill="#475569"/><circle cx="103" cy="155" r="3.5" fill="#475569"/>' +
                    /* Long tron va Canh quat 3D xoay ben trong */
                    '<ellipse cx="58" cy="102" rx="42" ry="64" fill="#090e1a" stroke="#cbd5e1" stroke-width="2"/>' +
                    '<g class="ambient-fan-spin">' +
                    '<ellipse cx="58" cy="72" rx="10" ry="26" fill="#64748b"/>' +
                    '<ellipse cx="78" cy="116" rx="10" ry="26" transform="rotate(120 78 116)" fill="#64748b"/>' +
                    '<ellipse cx="38" cy="116" rx="10" ry="26" transform="rotate(240 38 116)" fill="#64748b"/>' +
                    '<circle cx="58" cy="102" r="10" fill="#38bdf8"/>' +
                    '</g>' +
                    '</g>' +
                    '<text x="502" y="55" fill="#f8fafc" font-size="14.5" font-weight="800" text-anchor="middle">Quạt</text>' +
                    /* 5. LUONG KHONG KHI (Gio mat xanh vao mat quat -> Gio nong do thoat ra sau ket) */
                    '<g class="ambient-heat-arrow">' +
                    '<line x1="345" y1="135" x2="435" y2="135" stroke="#38bdf8" stroke-width="5" marker-end="url(#' + u + 'windIn)"/>' +
                    '<line x1="360" y1="168" x2="450" y2="168" stroke="#38bdf8" stroke-width="5" marker-end="url(#' + u + 'windIn)"/>' +
                    '<line x1="345" y1="200" x2="435" y2="200" stroke="#38bdf8" stroke-width="5" marker-end="url(#' + u + 'windIn)"/>' +
                    '<line x1="720" y1="85" x2="800" y2="65" stroke="#ef4444" stroke-width="5" marker-end="url(#' + u + 'windOut)"/>' +
                    '<line x1="720" y1="115" x2="800" y2="95" stroke="#ef4444" stroke-width="5" marker-end="url(#' + u + 'windOut)"/>' +
                    '<line x1="720" y1="145" x2="800" y2="125" stroke="#ef4444" stroke-width="5" marker-end="url(#' + u + 'windOut)"/>' +
                    '</g>' +
                    '<text x="640" y="295" fill="#fbbf24" font-size="13.5" font-weight="800">Két tản nhiệt (Radiator)</text>' +
                    '</svg>';
                return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
                    captionHtml('fa-solid fa-fan', 'Cấu trúc hệ thống tản nhiệt chất lỏng cho CPU (Phối cảnh 3D chuẩn)') + svg +
                    '</div></div>';
            }
        },
        'MH-C1-12': {
            id: 'MH-C1-12',
            title: 'Hệ thống làm mát động cơ ô tô qua két tản nhiệt và bơm tuần hoàn',
            topic: 'DS-C1.5',
            layout: 'single',
            caption: 'Sơ đồ hệ thống làm mát tuần hoàn của động cơ ô tô',
            alt: 'Hệ thống làm mát ô tô gồm động cơ, bơm tuần hoàn, khoang nước nóng, két tản nhiệt kèm quạt và dòng nước lạnh hồi về liên tục',
            build: function (u) {
                var svg =
                    '<svg viewBox="0 0 820 390" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
                    '<defs>' +
                    '<linearGradient id="' + u + 'pipeV" x1="0%" y1="0%" x2="0%" y2="100%">' +
                    '<stop offset="0%" stop-color="#ef4444"/><stop offset="100%" stop-color="#0284c7"/>' +
                    '</linearGradient>' +
                    '<marker id="' + u + 'arC" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 1 L 9 5 L 0 9 z" fill="#7dd3fc"/></marker>' +
                    '<marker id="' + u + 'arH" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 1 L 9 5 L 0 9 z" fill="#fca5a5"/></marker>' +
                    '</defs>' +
                    /* Binh chua nuoc nong phia tren ket tan nhiet */
                    '<rect x="148" y="34" width="60" height="18" rx="3" fill="#94a3b8"/>' +
                    '<rect x="130" y="52" width="102" height="56" rx="6" fill="#ef4444" stroke="#fca5a5" stroke-width="2"/>' +
                    '<text x="181" y="77" fill="#fff" font-size="12.5" font-weight="800" text-anchor="middle">NƯỚC NÓNG</text>' +
                    '<text x="181" y="96" fill="#fef2f2" font-size="12.5" font-family="DM Mono,monospace" font-weight="800" text-anchor="middle">80°C</text>' +
                    /* Ong dan nuoc nong tu dong co qua bom ve binh nuoc nong */
                    '<polygon points="222,68 350,118 336,154 210,104" fill="#dc2626"/>' +
                    '<polygon points="376,128 456,162 456,196 364,158" fill="#ef4444" opacity="0.85"/>' +
                    /* Vach dut trang chuyen dong tuan hoan trong ONG NONG DO PHIA TREN */
                    '<path d="M 456 179 L 364 143 L 216 86" fill="none" stroke="#fff" stroke-width="2.5" stroke-dasharray="7 7" class="ambient-ray-glide"/>' +
                    /* Ket cac la tan nhiet thang dung */
                    '<rect x="156" y="108" width="46" height="184" fill="url(#' + u + 'pipeV)"/>' +
                    /* Vach dut trang chuyen dong xuong trong KET TAN NHIET */
                    '<line x1="179" y1="112" x2="179" y2="288" stroke="#fff" stroke-width="2.5" stroke-dasharray="6 6" class="ambient-ray-glide"/>' +
                    '<line x1="142" y1="132" x2="216" y2="132" stroke="#cbd5e1" stroke-width="4"/>' +
                    '<line x1="142" y1="160" x2="216" y2="160" stroke="#cbd5e1" stroke-width="4"/>' +
                    '<line x1="142" y1="188" x2="216" y2="188" stroke="#cbd5e1" stroke-width="4"/>' +
                    '<line x1="142" y1="216" x2="216" y2="216" stroke="#cbd5e1" stroke-width="4"/>' +
                    '<line x1="142" y1="244" x2="216" y2="244" stroke="#cbd5e1" stroke-width="4"/>' +
                    '<line x1="142" y1="272" x2="216" y2="272" stroke="#cbd5e1" stroke-width="4"/>' +
                    /* Day ong dan nuoc lanh hoi ve dong co (huong tu trai sang phai) */
                    '<path d="M 156 292 L 456 292 L 456 326 L 156 326 Z" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>' +
                    '<text x="302" y="314" fill="#f8fafc" font-size="13" font-weight="800" text-anchor="middle">NƯỚC LẠNH (30°C · 0,22 kg/s)</text>' +
                    /* Vach dut trang chuyen dong tuan hoan trong ONG LANH XANH PHIA DUOI */
                    '<line x1="160" y1="309" x2="456" y2="309" stroke="#fff" stroke-width="2.5" stroke-dasharray="7 7" class="ambient-ray-glide"/>' +
                    /* Khoang dong co 4 xi-lanh */
                    '<rect x="444" y="150" width="330" height="186" rx="10" fill="rgba(56,189,248,0.16)" stroke="#38bdf8" stroke-width="2.5"/>' +
                    '<rect x="476" y="196" width="48" height="106" fill="#475569" stroke="#94a3b8" stroke-width="1.5"/>' +
                    '<rect x="548" y="196" width="48" height="106" fill="#475569" stroke="#94a3b8" stroke-width="1.5"/>' +
                    '<rect x="620" y="196" width="48" height="106" fill="#475569" stroke="#94a3b8" stroke-width="1.5"/>' +
                    '<rect x="692" y="196" width="48" height="106" fill="#475569" stroke="#94a3b8" stroke-width="1.5"/>' +
                    /* Vach dut trang chuyen dong tuan hoan trong KHOANG DONG CO (tu duoi len tren) */
                    '<line x1="500" y1="288" x2="500" y2="202" stroke="#fff" stroke-width="2.2" stroke-dasharray="6 6" class="ambient-ray-glide"/>' +
                    '<line x1="572" y1="288" x2="572" y2="202" stroke="#fff" stroke-width="2.2" stroke-dasharray="6 6" class="ambient-ray-glide"/>' +
                    '<line x1="644" y1="288" x2="644" y2="202" stroke="#fff" stroke-width="2.2" stroke-dasharray="6 6" class="ambient-ray-glide"/>' +
                    '<line x1="716" y1="288" x2="716" y2="202" stroke="#fff" stroke-width="2.2" stroke-dasharray="6 6" class="ambient-ray-glide"/>' +
                    '<text x="609" y="178" fill="#f8fafc" font-size="14" font-weight="800" text-anchor="middle">ĐỘNG CƠ (4 Xi-lanh)</text>' +
                    /* BOM TUAN HOAN (Pump) dang quay */
                    '<circle cx="364" cy="134" r="34" fill="#0f172a" stroke="#38bdf8" stroke-width="3"/>' +
                    '<g class="ambient-fan-spin">' +
                    '<line x1="344" y1="134" x2="384" y2="134" stroke="#cbd5e1" stroke-width="3.5"/>' +
                    '<line x1="364" y1="114" x2="364" y2="154" stroke="#cbd5e1" stroke-width="3.5"/>' +
                    '<circle cx="364" cy="134" r="7" fill="#38bdf8"/>' +
                    '</g>' +
                    '<text x="364" y="88" fill="#38bdf8" font-size="13.5" font-weight="800" text-anchor="middle">Bơm tuần hoàn</text>' +
                    /* Quat thoi lam mat ket nuoc */
                    '<g transform="translate(242,165)">' +
                    '<line x1="20" y1="36" x2="72" y2="36" stroke="#94a3b8" stroke-width="6" stroke-linecap="round"/>' +
                    '<ellipse cx="20" cy="20" rx="7" ry="18" fill="#e2e8f0" stroke="#64748b"/>' +
                    '<ellipse cx="20" cy="52" rx="7" ry="18" fill="#e2e8f0" stroke="#64748b"/>' +
                    '<circle cx="20" cy="36" r="6" fill="#38bdf8"/>' +
                    '<text x="58" y="66" fill="#e2e8f0" font-size="13" font-weight="800" text-anchor="middle">Quạt</text>' +
                    '</g>' +
                    '<g transform="translate(14,154)"><rect x="0" y="0" width="112" height="90" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '<text x="56" y="25" fill="#38bdf8" font-size="13" font-weight="800" text-anchor="middle">Các lá</text>' +
                    '<text x="56" y="45" fill="#38bdf8" font-size="13" font-weight="800" text-anchor="middle">tản nhiệt</text>' +
                    '<text x="56" y="66" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">Khí 20,0°C</text>' +
                    '<text x="56" y="81" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">1,25 kg/s</text></g>' +
                    '</svg>';
                return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
                    captionHtml('fa-solid fa-car', 'Sơ đồ hệ thống làm mát tuần hoàn của động cơ ô tô (Dòng nước lưu thông khép kín)') + svg +
                    '</div></div>';
            }
        },
        'MH-C1-13': {
            id: 'MH-C1-13',
            title: 'Cấu tạo máy hút ẩm ngưng tụ và Chu trình làm lạnh 4 bộ phận',
            topic: 'DS-C1.5',
            layout: '2col',
            caption: 'Phần 1: Cấu tạo máy hút ẩm dạng ngưng tụ',
            caption2: 'Phần 2: Sơ đồ nguyên lý chu trình lạnh (1-2-3-4)',
            alt: 'Bên trái là máy hút ẩm 3D gồm dàn lạnh ngưng tụ, khay hứng nước, bình chứa nước, dàn nóng sấy khô, quạt và máy nén; bên phải là sơ đồ chu trình 4 bộ phận thoáng đãng',
            build: function (u) {
                /* SVG Trai: Cau tao may hut am trong vo may (Cutaway 3D chuan image16.jpg) */
                var leftSvg =
                    '<svg viewBox="0 0 460 380" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
                    '<defs>' +
                    '<marker id="' + u + 'cIn" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 1 L 9 5 L 0 9 z" fill="#38bdf8"/></marker>' +
                    '<marker id="' + u + 'cOut" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 1 L 9 5 L 0 9 z" fill="#f97316"/></marker>' +
                    '</defs>' +
                    /* Vo may hut am cat bo 3D */
                    '<rect x="90" y="30" width="280" height="335" rx="12" fill="#0b1120" stroke="#64748b" stroke-width="2.5"/>' +
                    /* Khong khi am di vao tu mat truoc ben trai qua luoi loc */
                    '<g class="ambient-heat-arrow">' +
                    '<path d="M 15 105 Q 45 95 80 105" fill="none" stroke="#38bdf8" stroke-width="3" marker-end="url(#' + u + 'cIn)"/>' +
                    '<path d="M 15 130 Q 45 120 80 130" fill="none" stroke="#38bdf8" stroke-width="3" marker-end="url(#' + u + 'cIn)"/>' +
                    '</g>' +
                    '<text x="50" y="80" fill="#38bdf8" font-size="12" font-weight="800" text-anchor="middle">Không khí ẩm</text>' +
                    /* 1. DAN LANH (Evaporator - Lam lanh khong khi xuong duoi diem suong de ngung tu nuoc) */
                    '<g transform="translate(120,65)">' +
                    '<rect x="0" y="0" width="36" height="115" rx="4" fill="rgba(56,189,248,0.2)" stroke="#38bdf8" stroke-width="2"/>' +
                    '<path d="M 8 6 V 109 M 18 6 V 109 M 28 6 V 109" stroke="#38bdf8" stroke-width="2.5"/>' +
                    '<text x="18" y="-8" fill="#38bdf8" font-size="12" font-weight="800" text-anchor="middle">Dàn lạnh</text>' +
                    '</g>' +
                    /* Khay hung nuoc ngung tu o duoi dan lanh */
                    '<polygon points="112,185 166,185 160,202 118,202" fill="#334155" stroke="#94a3b8" stroke-width="1.5"/>' +
                    '<line x1="139" y1="202" x2="139" y2="235" stroke="#38bdf8" stroke-width="3"/>' +
                    '<g class="ambient-drops"><circle cx="139" cy="225" r="2.5" fill="#38bdf8"/></g>' +
                    /* Binh chua nuoc ngung tu o day (Khoi hop mau trang xam lon) */
                    '<rect x="110" y="235" width="105" height="110" rx="8" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>' +
                    '<text x="162" y="295" fill="#0f172a" font-size="12" font-weight="800" text-anchor="middle">Bình chứa nước</text>' +
                    /* 2. DAN NONG (Condenser - Say kho khong khi sau khi tach am) */
                    '<g transform="translate(185,65)">' +
                    '<rect x="0" y="0" width="36" height="115" rx="4" fill="rgba(239,68,68,0.2)" stroke="#f97316" stroke-width="2"/>' +
                    '<path d="M 8 6 V 109 M 18 6 V 109 M 28 6 V 109" stroke="#f97316" stroke-width="2.5"/>' +
                    '<text x="18" y="-8" fill="#f97316" font-size="12" font-weight="800" text-anchor="middle">Dàn nóng</text>' +
                    '</g>' +
                    /* 3. CANH QUAT HUT & THOI GIO RA NGOAI */
                    '<circle cx="280" cy="122" r="34" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>' +
                    '<g class="ambient-fan-spin">' +
                    '<ellipse cx="280" cy="104" rx="8" ry="16" fill="#cbd5e1"/>' +
                    '<ellipse cx="295" cy="131" rx="8" ry="16" transform="rotate(120 295 131)" fill="#cbd5e1"/>' +
                    '<ellipse cx="265" cy="131" rx="8" ry="16" transform="rotate(240 265 131)" fill="#cbd5e1"/>' +
                    '<circle cx="280" cy="122" r="8" fill="#38bdf8"/>' +
                    '</g>' +
                    '<text x="280" y="172" fill="#cbd5e1" font-size="11.5" font-weight="700" text-anchor="middle">Cánh quạt</text>' +
                    /* Khong khi kho am thoi ra mat sau */
                    '<g class="ambient-heat-arrow">' +
                    '<path d="M 320 105 Q 355 95 390 105" fill="none" stroke="#f97316" stroke-width="3" marker-end="url(#' + u + 'cOut)"/>' +
                    '<path d="M 320 130 Q 355 120 390 130" fill="none" stroke="#f97316" stroke-width="3" marker-end="url(#' + u + 'cOut)"/>' +
                    '</g>' +
                    '<text x="415" y="80" fill="#f97316" font-size="12" font-weight="800" text-anchor="middle">Không khí khô</text>' +
                    /* 4. MAY NEN (Compressor o day ben phai) */
                    '<rect x="235" y="245" width="65" height="95" rx="10" fill="#334155" stroke="#cbd5e1" stroke-width="2"/>' +
                    '<text x="267.5" y="298" fill="#f8fafc" font-size="12" font-weight="800" text-anchor="middle">Máy nén</text>' +
                    /* DUONG ONG MOI CHAT TUAN HOAN KET NOI GIUA DAN LANH, DAN NONG VA MAY NEN */
                    /* Ong tu dan nong vao may nen */
                    '<path d="M 203 180 L 203 215 L 250 215 L 250 245" fill="none" stroke="#ef4444" stroke-width="3.5"/>' +
                    /* Ong tu may nen qua van tiet luu len dan lanh */
                    '<path d="M 285 245 L 285 220 L 315 220 L 315 48 L 138 48 L 138 65" fill="none" stroke="#0284c7" stroke-width="3.5"/>' +
                    '</svg>';

                /* SVG Phai: So do nguyen ly chu trinh lanh 4 bo phan THOANG DANG KHONG CHONG CHEO */
                var rightSvg =
                    '<svg viewBox="0 0 460 380" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
                    '<defs>' +
                    '<marker id="' + u + 'rArr" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 1 L 9 5 L 0 9 z" fill="#ef4444"/></marker>' +
                    '<marker id="' + u + 'bArr" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 1 L 9 5 L 0 9 z" fill="#0284c7"/></marker>' +
                    '</defs>' +
                    /* BO PHAN 1: DAN NONG (Ben trai, ong uon luon do toa nhiet) */
                    '<path d="M 120 75 C 85 90 85 115 120 130 C 85 145 85 170 120 185 C 85 200 85 225 120 240 L 120 280" fill="none" stroke="#ef4444" stroke-width="8" stroke-linecap="round"/>' +
                    '<text x="145" y="175" fill="#ef4444" font-size="19" font-weight="900" text-anchor="middle">1</text>' +
                    '<text x="145" y="195" fill="#fca5a5" font-size="12" font-weight="800" text-anchor="middle">(Dàn nóng)</text>' +
                    /* Mui ten toa nhiet do lon sang trai - DAT TACH BIET KHONG CHE KHUAT */
                    '<polygon points="20,185 55,155 55,172 75,172 75,198 55,198 55,215" fill="rgba(239,68,68,0.75)" stroke="#ef4444" stroke-width="1.5"/>' +
                    '<text x="45" y="142" fill="#ef4444" font-size="12" font-weight="800" text-anchor="middle">Tỏa nhiệt Q₁</text>' +
                    /* BO PHAN 2: VAN TIET LUU (Phia tren, thap lai) */
                    '<line x1="120" y1="75" x2="210" y2="75" stroke="#ef4444" stroke-width="7"/>' +
                    '<line x1="145" y1="92" x2="185" y2="92" stroke="#ef4444" stroke-width="2.5" marker-end="url(#' + u + 'rArr)"/>' +
                    /* Cho that van tiet luu o giua */
                    '<polygon points="210,68 225,75 210,82" fill="#cbd5e1"/>' +
                    '<polygon points="240,68 225,75 240,82" fill="#cbd5e1"/>' +
                    '<text x="225" y="52" fill="#f8fafc" font-size="18" font-weight="900" text-anchor="middle">2</text>' +
                    '<text x="225" y="112" fill="#cbd5e1" font-size="12" font-weight="800" text-anchor="middle">Van tiết lưu</text>' +
                    '<line x1="240" y1="75" x2="330" y2="75" stroke="#0284c7" stroke-width="7"/>' +
                    '<line x1="265" y1="92" x2="305" y2="92" stroke="#0284c7" stroke-width="2.5" marker-end="url(#' + u + 'bArr)"/>' +
                    /* BO PHAN 3: DAN LANH (Ben phai, ong uon luon xanh thu nhiet) */
                    '<path d="M 330 75 C 365 90 365 115 330 130 C 365 145 365 170 330 185 C 365 200 365 225 330 240 L 330 280" fill="none" stroke="#0284c7" stroke-width="8" stroke-linecap="round"/>' +
                    '<text x="305" y="175" fill="#0284c7" font-size="19" font-weight="900" text-anchor="middle">3</text>' +
                    '<text x="305" y="195" fill="#7dd3fc" font-size="12" font-weight="800" text-anchor="middle">(Dàn lạnh)</text>' +
                    /* Mui ten thu nhiet xanh lon sang phai - DAT TACH BIET KHONG CHE KHUAT */
                    '<polygon points="430,185 395,155 395,172 375,172 375,198 395,198 395,215" fill="rgba(14,165,233,0.75)" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '<text x="405" y="142" fill="#38bdf8" font-size="12" font-weight="800" text-anchor="middle">Thu nhiệt Q₂</text>' +
                    /* BO PHAN 4: MAY NEN (Phia duoi) */
                    '<line x1="330" y1="280" x2="260" y2="280" stroke="#0284c7" stroke-width="7"/>' +
                    '<line x1="310" y1="262" x2="275" y2="262" stroke="#0284c7" stroke-width="2.5" marker-end="url(#' + u + 'bArr)"/>' +
                    '<rect x="195" y="248" width="65" height="65" rx="8" fill="#334155" stroke="#cbd5e1" stroke-width="2"/>' +
                    '<text x="227.5" y="287" fill="#fff" font-size="18" font-weight="900" text-anchor="middle">4</text>' +
                    '<text x="227.5" y="332" fill="#f8fafc" font-size="12.5" font-weight="800" text-anchor="middle">Máy nén (Công A)</text>' +
                    '<line x1="195" y1="280" x2="120" y2="280" stroke="#ef4444" stroke-width="7"/>' +
                    '<line x1="175" y1="262" x2="140" y2="262" stroke="#ef4444" stroke-width="2.5" marker-end="url(#' + u + 'rArr)"/>' +
                    '</svg>';

                return '<div class="vlxt-visual-container"><div class="vlxt-grid-2col">' +
                    '<div class="vlxt-stage-wrap">' + captionHtml('fa-solid fa-box-archive', 'Phần 1: Cấu tạo máy hút ẩm dạng ngưng tụ') + leftSvg + '</div>' +
                    '<div class="vlxt-stage-wrap">' + captionHtml('fa-solid fa-arrows-spin', 'Phần 2: Sơ đồ nguyên lý chu trình lạnh (1-2-3-4)') + rightSvg + '</div>' +
                    '</div></div>';
            }
        },
        'MH-C1-14': {
            id: 'MH-C1-14',
            title: 'Ống Cu-lít-giơ phát tia X với hệ thống nước làm nguội Anode',
            topic: 'DS-C1.5',
            layout: 'single',
            caption: 'Sơ đồ ống Cu-lít-giơ phát tia X (U_AK = 1,0·10⁴ V · I = 10 A · H = 1,0%)',
            alt: 'Ống phát tia X có sợi nung F-F phẩy, Cathode K cong lõm sang phải, chùm electron đập vào mặt vát cong hướng xuống của Anode A phát tia X chĩa xuống dưới',
            build: function (u) {
                var svg =
                    '<svg viewBox="0 0 840 400" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
                    '<defs>' +
                    '<marker id="' + u + 'arX" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 1 L 9 5 L 0 9 z" fill="#f59e0b"/></marker>' +
                    '<marker id="' + u + 'arW" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 1 L 9 5 L 0 9 z" fill="#38bdf8"/></marker>' +
                    '<marker id="' + u + 'arR" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 1 L 9 5 L 0 9 z" fill="#ef4444"/></marker>' +
                    '<linearGradient id="' + u + 'anodeGrad" x1="0%" y1="0%" x2="100%" y2="0%">' +
                    '<stop offset="0%" stop-color="#b45309"/><stop offset="100%" stop-color="#d97706"/>' +
                    '</linearGradient>' +
                    '</defs>' +
                    /* Vo bong thuy tinh Cu-lit-gio hut chan khong */
                    '<path d="M 70 145 L 245 145 A 100 100 0 0 1 455 145 L 610 145 A 8 36 0 0 1 610 217 L 455 217 A 100 100 0 0 1 245 217 L 70 217 A 8 36 0 0 1 70 145 Z" fill="rgba(56,189,248,0.05)" stroke="#cbd5e1" stroke-width="2.5"/>' +
                    /* Cuc am (-): Day dan noi tu nguon ngoai vao Cathode K */
                    '<line x1="50" y1="58" x2="50" y2="181" stroke="#ef4444" stroke-width="2.5"/>' +
                    '<line x1="50" y1="181" x2="200" y2="181" stroke="#ef4444" stroke-width="2.5"/>' +
                    '<circle cx="50" cy="54" r="6" fill="none" stroke="#ef4444" stroke-width="2.5"/>' +
                    '<text x="68" y="60" fill="#fca5a5" font-size="19" font-weight="800">-</text>' +
                    /* CATHODE K: Chom cau phieu kim loai cong LOM SANG PHAI (ve phia Anode A) */
                    '<path d="M 215 152 A 38 42 0 0 1 215 210" fill="none" stroke="#cbd5e1" stroke-width="4" stroke-linecap="round"/>' +
                    '<text x="188" y="176" fill="#cbd5e1" font-size="15" font-weight="800">K</text>' +
                    /* SOI NUNG F - F': Lo xo xoan thang dung nam TRONG LONG chom cau K */
                    '<path d="M 226 162 C 238 162 238 170 226 170 C 238 170 238 178 226 178 C 238 178 238 186 226 186 C 238 186 238 194 226 194 C 238 194 238 200 226 200" fill="none" stroke="#f97316" stroke-width="3" stroke-linecap="round"/>' +
                    '<path d="M 226 162 C 220 150 200 136 172 136" fill="none" stroke="#fb923c" stroke-width="2"/>' +
                    '<path d="M 226 200 C 220 212 200 226 172 226" fill="none" stroke="#fb923c" stroke-width="2"/>' +
                    '<polyline points="172,136 150,118" fill="none" stroke="#fb923c" stroke-width="2" marker-end="url(#' + u + 'arX)"/>' +
                    '<polyline points="172,226 150,244" fill="none" stroke="#fb923c" stroke-width="2" marker-end="url(#' + u + 'arX)"/>' +
                    '<text x="140" y="116" fill="#fb923c" font-size="14.5" font-weight="800">F</text>' +
                    '<text x="140" y="258" fill="#fb923c" font-size="14.5" font-weight="800">F′</text>' +
                    /* CHUM ELECTRON: Ban tu Cathode K dap vao mat vat cong cua Anode A */
                    '<g class="ambient-ray-glide">' +
                    '<line x1="234" y1="168" x2="335" y2="173" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="5 5"/>' +
                    '<line x1="234" y1="181" x2="345" y2="181" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="5 5"/>' +
                    '<line x1="234" y1="194" x2="360" y2="192" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="5 5"/>' +
                    '</g>' +
                    /* ANODE A: MAT VAT CONG HUONG XUONG DUOI (Dinh tren nho ra truoc o x=330, y=160; duong vat cong xuong duoi lui ve x=375, y=204) */
                    '<path d="M 330 160 Q 345 185 375 204 L 418 204 L 418 160 Z" fill="#334155" stroke="#cbd5e1" stroke-width="2"/>' +
                    /* Cac duong gach cheo mat vat ///// */
                    '<line x1="340" y1="160" x2="385" y2="204" stroke="#cbd5e1" stroke-width="1.8"/>' +
                    '<line x1="360" y1="160" x2="400" y2="204" stroke="#cbd5e1" stroke-width="1.8"/>' +
                    '<line x1="380" y1="160" x2="415" y2="198" stroke="#cbd5e1" stroke-width="1.8"/>' +
                    '<text x="385" y="146" fill="#f8fafc" font-size="16" font-weight="900" text-anchor="middle">A</text>' +
                    /* CHUM TIA X: Dap vao mat vat cong va phan xa PHAT RA CHECH XUONG DUOI (qua day ong thuy tinh) */
                    '<g class="ambient-heat-arrow">' +
                    '<line x1="345" y1="182" x2="258" y2="308" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#' + u + 'arX)"/>' +
                    '<line x1="352" y1="187" x2="305" y2="315" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#' + u + 'arX)"/>' +
                    '<line x1="360" y1="192" x2="355" y2="318" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#' + u + 'arX)"/>' +
                    '<line x1="368" y1="197" x2="405" y2="315" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#' + u + 'arX)"/>' +
                    '<line x1="375" y1="202" x2="452" y2="308" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#' + u + 'arX)"/>' +
                    '</g>' +
                    '<text x="355" y="342" fill="#fbbf24" font-size="14.5" font-weight="800" text-anchor="middle">Tia X (Hiệu suất 1,0%)</text>' +
                    /* TRUC ANODE: Can kim loai dong chay xuyen qua ong thuy tinh va THO RA NGOAI ong thuy tinh ve ben phai */
                    '<rect x="418" y="168" width="270" height="26" fill="url(#' + u + 'anodeGrad)" stroke="#92400e" stroke-width="1.8"/>' +
                    /* Cuc duong (+): Day dien noi vao truc Anode ngoai thanh ong */
                    '<line x1="590" y1="58" x2="590" y2="168" stroke="#38bdf8" stroke-width="2.5"/>' +
                    '<circle cx="590" cy="54" r="6" fill="none" stroke="#38bdf8" stroke-width="2.5"/>' +
                    '<text x="566" y="60" fill="#7dd3fc" font-size="19" font-weight="800">+</text>' +
                    /* HE THONG NUOC LAM NGUOI: Thò han ra ngoai ong thuy tinh o phia phai */
                    '<line x1="688" y1="174" x2="745" y2="174" stroke="#38bdf8" stroke-width="4.5"/>' +
                    '<line x1="745" y1="140" x2="745" y2="174" stroke="#38bdf8" stroke-width="4.5" marker-end="url(#' + u + 'arW)"/>' +
                    '<line x1="688" y1="188" x2="745" y2="188" stroke="#ef4444" stroke-width="4.5"/>' +
                    '<path d="M 745 188 L 760 188 C 770 188 770 215 770 230" fill="none" stroke="#ef4444" stroke-width="4.5" marker-end="url(#' + u + 'arR)"/>' +
                    '<text x="735" y="132" fill="#38bdf8" font-size="12" font-weight="800" text-anchor="end">Nước vào (25°C)</text>' +
                    '<text x="775" y="248" fill="#fca5a5" font-size="12" font-weight="800" text-anchor="middle">Nước ra (55°C)</text>' +
                    /* The chu thich */
                    '<g transform="translate(485,270)"><rect x="0" y="0" width="220" height="66" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '<text x="110" y="22" fill="#38bdf8" font-size="13" font-weight="800" text-anchor="middle">Nước làm nguội Anode</text>' +
                    '<text x="110" y="42" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">Lưu lượng làm mát liên tục</text>' +
                    '<text x="110" y="58" fill="#fbbf24" font-size="11.5" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">Hấp thụ 99% nhiệt năng</text></g>' +
                    '</svg>';
                return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
                    captionHtml('fa-solid fa-radiation', 'Ống phát tia X Cu-lít-giơ với hệ thống nước làm nguội Anode') + svg +
                    '</div></div>';
            }
        },
        'MH-C1-15': {
            id: 'MH-C1-15',
            title: 'Quạt hơi nước làm mát không khí phòng nhờ bay hơi trên tấm làm mát',
            topic: 'DS-C1.5',
            layout: 'single',
            caption: 'Nguyên lý làm mát bằng bay hơi nước của quạt hơi nước (Phối cảnh 3D đồng nhất)',
            alt: 'Mô hình 3D đồng bộ góc nhìn gồm bể chứa nước trên, tấm làm mát tổ ong, bể thu hồi nước dưới và quạt 3D cùng quay về một hướng',
            build: function (u) {
                var svg =
                    '<svg viewBox="0 0 840 400" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
                    '<defs>' +
                    '<marker id="' + u + 'arH3D" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 1 L 9 5 L 0 9 z" fill="#ef4444"/></marker>' +
                    '<marker id="' + u + 'arC3D" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 1 L 9 5 L 0 9 z" fill="#38bdf8"/></marker>' +
                    '<linearGradient id="' + u + 'padGrad" x1="0%" y1="0%" x2="100%" y2="100%">' +
                    '<stop offset="0%" stop-color="#9a3412"/><stop offset="50%" stop-color="#ea580c"/><stop offset="100%" stop-color="#7c2d12"/>' +
                    '</linearGradient>' +
                    '</defs>' +
                    /* DONG BO 100% CUNG HE TOA DO 3D ISOMETRIC (Mat don gio nghieng sang trai, mat thoi gio nghieng sang phai) */
                    /* 1. BE CHUA NUOC TREN */
                    '<g transform="translate(245,28)">' +
                    '<polygon points="0,20 45,-12 165,-12 120,20" fill="#0284c7" stroke="#38bdf8" stroke-width="1.8"/>' +
                    '<polygon points="0,20 120,20 120,42 0,42" fill="#0369a1" stroke="#38bdf8" stroke-width="1.8"/>' +
                    '<polygon points="120,20 165,-12 165,10 120,42" fill="#075985" stroke="#38bdf8" stroke-width="1.8"/>' +
                    '<text x="60" y="-18" fill="#38bdf8" font-size="13" font-weight="800" text-anchor="middle">Bể chứa nước</text>' +
                    '</g>' +
                    /* Giot nuoc roi tu be tren */
                    '<g class="ambient-drops">' +
                    '<circle cx="270" cy="80" r="3" fill="#38bdf8"/><circle cx="295" cy="86" r="3" fill="#38bdf8"/><circle cx="320" cy="80" r="3" fill="#38bdf8"/><circle cx="345" cy="86" r="3" fill="#38bdf8"/>' +
                    '</g>' +
                    /* 2. TAM LAM MAT TO ONG (Cooling Pad 3D cung huong) */
                    '<g transform="translate(245,98)">' +
                    '<polygon points="0,20 45,-12 155,-12 110,20" fill="#b45309" stroke="#d97706" stroke-width="1.8"/>' +
                    '<polygon points="0,20 110,20 110,208 0,208" fill="url(#' + u + 'padGrad)" stroke="#f59e0b" stroke-width="2"/>' +
                    '<polygon points="110,20 155,-12 155,176 110,208" fill="#78350f" stroke="#d97706" stroke-width="1.8"/>' +
                    /* Gan song to ong 3D */
                    '<line x1="22" y1="20" x2="22" y2="208" stroke="#fdba74" stroke-width="2.5" stroke-dasharray="6 6"/>' +
                    '<line x1="44" y1="20" x2="44" y2="208" stroke="#fdba74" stroke-width="2.5" stroke-dasharray="6 6"/>' +
                    '<line x1="66" y1="20" x2="66" y2="208" stroke="#fdba74" stroke-width="2.5" stroke-dasharray="6 6"/>' +
                    '<line x1="88" y1="20" x2="88" y2="208" stroke="#fdba74" stroke-width="2.5" stroke-dasharray="6 6"/>' +
                    '</g>' +
                    '<text x="375" y="278" fill="#fbbf24" font-size="13" font-weight="800">Tấm làm mát</text>' +
                    '<line x1="370" y1="272" x2="335" y2="245" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="3 3"/>' +
                    /* 3. BE THU HOI NUOC DUOI (Cung huong) */
                    '<g transform="translate(235,316)">' +
                    '<polygon points="0,20 45,-12 165,-12 120,20" fill="#0284c7" stroke="#38bdf8" stroke-width="1.8"/>' +
                    '<polygon points="0,20 120,20 120,42 0,42" fill="#0369a1" stroke="#38bdf8" stroke-width="1.8"/>' +
                    '<polygon points="120,20 165,-12 165,10 120,42" fill="#075985" stroke="#38bdf8" stroke-width="1.8"/>' +
                    '<text x="60" y="58" fill="#cbd5e1" font-size="12.5" font-weight="700" text-anchor="middle">Bể thu hồi nước</text>' +
                    '</g>' +
                    /* KHONG KHI NONG: Mui ten do 3D thoi xuyen qua tam lam mat */
                    '<g class="ambient-heat-arrow">' +
                    '<line x1="140" y1="185" x2="235" y2="185" stroke="#ef4444" stroke-width="5" marker-end="url(#' + u + 'arH3D)"/>' +
                    '<line x1="140" y1="225" x2="235" y2="225" stroke="#ef4444" stroke-width="5" marker-end="url(#' + u + 'arH3D)"/>' +
                    '</g>' +
                    '<g transform="translate(18,172)"><rect x="0" y="0" width="118" height="62" rx="6" fill="#0f172a" stroke="#ef4444" stroke-width="1.5"/>' +
                    '<text x="59" y="24" fill="#fca5a5" font-size="13" font-weight="800" text-anchor="middle">Không khí nóng</text>' +
                    '<text x="59" y="44" fill="#cbd5e1" font-size="11.5" font-weight="600" text-anchor="middle">Khí phòng 4×5×4 m</text></g>' +
                    /* Mui ten chuyen tiep sau tam lam mat vao mat quat */
                    '<line x1="375" y1="205" x2="445" y2="205" stroke="#38bdf8" stroke-width="4.5" marker-end="url(#' + u + 'arC3D)"/>' +
                    /* 4. KHUNG QUAT 3D DONG BO CUNG HUONG 3D VOI BE NUOC */
                    '<g transform="translate(455,108)">' +
                    /* Mat truoc khung quat */
                    '<polygon points="0,20 45,-12 155,-12 110,20" fill="#334155" stroke="#64748b" stroke-width="1.8"/>' +
                    '<polygon points="0,20 110,20 110,195 0,195" fill="#1e293b" stroke="#64748b" stroke-width="2.2"/>' +
                    '<polygon points="110,20 155,-12 155,163 110,195" fill="#0f172a" stroke="#64748b" stroke-width="1.8"/>' +
                    /* Long tron quat */
                    '<ellipse cx="55" cy="107" rx="42" ry="62" fill="#090e1a" stroke="#94a3b8" stroke-width="2.2"/>' +
                    /* Canh quat quay dong tam chinh xac */
                    '<g transform="translate(55,107)">' +
                    '<g class="ambient-fan-spin">' +
                    '<ellipse cx="0" cy="-32" rx="10" ry="22" fill="#94a3b8"/>' +
                    '<ellipse cx="28" cy="16" rx="10" ry="22" transform="rotate(120 28 16)" fill="#94a3b8"/>' +
                    '<ellipse cx="-28" cy="16" rx="10" ry="22" transform="rotate(240 -28 16)" fill="#94a3b8"/>' +
                    '<circle cx="0" cy="0" r="10" fill="#cbd5e1" stroke="#475569" stroke-width="1.5"/>' +
                    '</g></g>' +
                    '</g>' +
                    /* KHONG KHI MAT LANH TOA RA PHIA SAU QUAT */
                    '<g class="ambient-heat-arrow">' +
                    '<path d="M 610 190 Q 645 168 680 155" fill="none" stroke="#38bdf8" stroke-width="4.5" marker-end="url(#' + u + 'arC3D)"/>' +
                    '<line x1="610" y1="210" x2="695" y2="210" stroke="#38bdf8" stroke-width="5" marker-end="url(#' + u + 'arC3D)"/>' +
                    '<path d="M 610 230 Q 645 252 680 265" fill="none" stroke="#38bdf8" stroke-width="4.5" marker-end="url(#' + u + 'arC3D)"/>' +
                    '</g>' +
                    '<g transform="translate(680,68)"><rect x="0" y="0" width="144" height="62" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>' +
                    '<text x="72" y="24" fill="#38bdf8" font-size="13" font-weight="800" text-anchor="middle">KHÔNG KHÍ MÁT LẠNH</text>' +
                    '<text x="72" y="44" fill="#cbd5e1" font-size="11.5" font-weight="600" text-anchor="middle">Thổi ra làm mát phòng</text></g>' +
                    '</svg>';
                return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
                    captionHtml('fa-solid fa-wind', 'Nguyên lý làm mát bằng bay hơi nước của quạt hơi nước (Phối cảnh 3D đồng nhất)') + svg +
                    '</div></div>';
            }
        },
        'MH-C1-18': {
            id: 'MH-C1-18',
            title: 'Quy trình nấu chảy đồng bằng than đá & đúc chuông đồng làng Trà Đông',
            topic: 'DS-C1.4',
            layout: 'single',
            caption: 'Quy trình nấu chảy đồng (20 kg · 1084°C) và đúc chuông đồng Trà Đông',
            alt: 'Mô hình đúc chuông đồng gồm lò than đá nung đỏ có ống khói thông suốt, nồi rót đồng nóng chảy vào khuôn chuông và quy trình 6 bước',
            build: function (u) {
                var svg =
                    '<svg viewBox="0 0 840 400" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
                    '<defs>' +
                    '<linearGradient id="' + u + 'fireGrad" x1="0%" y1="100%" x2="0%" y2="0%">' +
                    '<stop offset="0%" stop-color="#ef4444"/><stop offset="60%" stop-color="#f97316"/><stop offset="100%" stop-color="#fbbf24"/>' +
                    '</linearGradient>' +
                    '</defs>' +
                    /* NEN MAT DAT / XUONG DUC DONG */
                    '<line x1="20" y1="288" x2="820" y2="288" stroke="#334155" stroke-width="2.5"/>' +
                    /* NGON LUA THAN DA BAP BUNG QUANH DAY VA THAN LO (1084°C) */
                    '<g class="ambient-heat-arrow">' +
                    '<path d="M 40 286 C 45 255 58 245 65 260 C 75 235 88 230 95 258 C 105 230 120 225 130 255 C 142 228 158 232 165 258 C 178 235 190 240 198 262 C 205 248 218 255 224 286 Z" fill="url(#' + u + 'fireGrad)" opacity="0.85"/>' +
                    '<path d="M 52 286 C 60 262 70 252 78 268 C 88 248 102 245 112 268 C 122 242 138 240 148 266 C 160 246 172 248 182 268 C 190 256 202 260 210 286 Z" fill="#fbbf24" opacity="0.75"/>' +
                    '</g>' +
                    /* THAN LO NAU DONG VA ONG KHOI THONG SUOT (KHONG BI NET LIEN CHAN NGANG) */
                    '<path d="M 68 284 L 68 140 C 68 128 92 120 162 120 L 162 48 C 162 42 188 42 188 48 L 188 120 C 198 120 206 128 206 140 L 206 284 Z" fill="#1e293b" stroke="#64748b" stroke-width="2.5"/>' +
                    /* Long noi nau ben trong (Crucible) chua dong nong chay 1084°C */
                    '<path d="M 88 220 L 186 220 L 174 274 L 100 274 Z" fill="#f97316" stroke="#fbbf24" stroke-width="2"/>' +
                    '<ellipse cx="137" cy="220" rx="49" ry="8" fill="#fbbf24"/>' +
                    '<text x="137" y="254" fill="#0f172a" font-size="13" font-weight="900" text-anchor="middle">Đồng 1084°C</text>' +
                    /* Khoi than da thoat tu do tu ong khoi len tren (Thong suot) */
                    '<g class="ambient-steam">' +
                    '<circle cx="175" cy="34" r="8" fill="rgba(148,163,184,0.45)"/>' +
                    '<circle cx="185" cy="18" r="11" fill="rgba(148,163,184,0.35)"/>' +
                    '</g>' +
                    '<text x="202" y="38" fill="#cbd5e1" font-size="12" font-weight="700">Ống khói than đá (q = 27 MJ/kg)</text>' +
                    /* The ghi chu ben ngoai Lo nau (Khong de dính chu ben trong lo) */
                    '<g transform="translate(32,78)"><rect x="0" y="0" width="138" height="42" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>' +
                    '<text x="69" y="18" fill="#fbbf24" font-size="12" font-weight="800" text-anchor="middle">Lò nấu than đá</text>' +
                    '<text x="69" y="34" fill="#cbd5e1" font-size="11.5" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">31°C → 1084°C</text></g>' +
                    /* NOI ROT DONG NONG CHAY VAO KHUON DUC CHUONG */
                    '<g transform="translate(315,74)">' +
                    '<path d="M 38 14 L 98 14 L 84 68 L 50 68 Z" fill="#475569" stroke="#cbd5e1" stroke-width="2" transform="rotate(-22 68 41)"/>' +
                    '<path d="M 92 44 Q 112 82 110 134" fill="none" stroke="#f59e0b" stroke-width="9" stroke-linecap="round" class="ambient-heat-arrow"/>' +
                    '<rect x="26" y="130" width="168" height="84" rx="8" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>' +
                    '<path d="M 60 208 L 76 156 C 82 142 138 142 144 156 L 160 208 Z" fill="#f97316" stroke="#fbbf24" stroke-width="2"/>' +
                    '<text x="110" y="190" fill="#0f172a" font-size="13" font-weight="900" text-anchor="middle">Chuông đồng</text>' +
                    '</g>' +
                    '<text x="424" y="62" fill="#fbbf24" font-size="13.5" font-weight="800" text-anchor="middle">Rót đồng vào khuôn (20 kg · Hao phí 40%)</text>' +
                    /* BANG THONG SO NHIET HOC DONG */
                    '<g transform="translate(565,88)"><rect x="0" y="0" width="240" height="186" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>' +
                    '<text x="120" y="26" fill="#38bdf8" font-size="13.5" font-weight="800" text-anchor="middle">Thông số nhiệt học đồng</text>' +
                    '<text x="16" y="56" fill="#e2e8f0" font-size="12.5" font-family="DM Mono,monospace">• Khối lượng m = 20 kg</text>' +
                    '<text x="16" y="82" fill="#e2e8f0" font-size="12.5" font-family="DM Mono,monospace">• Ban đầu t₀ = 31°C</text>' +
                    '<text x="16" y="108" fill="#e2e8f0" font-size="12.5" font-family="DM Mono,monospace">• Nóng chảy t_nc = 1084°C</text>' +
                    '<text x="16" y="134" fill="#e2e8f0" font-size="12.5" font-family="DM Mono,monospace">• c = 380 J/(kg·K)</text>' +
                    '<text x="16" y="158" fill="#e2e8f0" font-size="12.5" font-family="DM Mono,monospace">• λ = 180 kJ/kg</text>' +
                    '</g>' +
                    /* 6 BUOC TRUYEN THONG DUC CHUONG DONG */
                    '<g transform="translate(24,312)">' +
                    '<rect x="0" y="0" width="120" height="54" rx="6" fill="#0f172a" stroke="#475569"/><text x="60" y="22" fill="#38bdf8" font-size="12.5" font-weight="800" text-anchor="middle">Bước 1</text><text x="60" y="41" fill="#e2e8f0" font-size="12" text-anchor="middle">Tạo mẫu</text>' +
                    '<rect x="132" y="0" width="120" height="54" rx="6" fill="#0f172a" stroke="#475569"/><text x="192" y="22" fill="#38bdf8" font-size="12.5" font-weight="800" text-anchor="middle">Bước 2</text><text x="192" y="41" fill="#e2e8f0" font-size="12" text-anchor="middle">Tạo khuôn</text>' +
                    '<rect x="264" y="0" width="124" height="54" rx="6" fill="#0f172a" stroke="#f59e0b"/><text x="326" y="22" fill="#fbbf24" font-size="12.5" font-weight="800" text-anchor="middle">Bước 3</text><text x="326" y="41" fill="#e2e8f0" font-size="12" text-anchor="middle">Nấu chảy đồng</text>' +
                    '<rect x="400" y="0" width="120" height="54" rx="6" fill="#0f172a" stroke="#475569"/><text x="460" y="22" fill="#38bdf8" font-size="12.5" font-weight="800" text-anchor="middle">Bước 4</text><text x="460" y="41" fill="#e2e8f0" font-size="12" text-anchor="middle">Rót khuôn</text>' +
                    '<rect x="532" y="0" width="130" height="54" rx="6" fill="#0f172a" stroke="#475569"/><text x="597" y="22" fill="#38bdf8" font-size="12.5" font-weight="800" text-anchor="middle">Bước 5</text><text x="597" y="41" fill="#e2e8f0" font-size="12" text-anchor="middle">Làm nguội, tách</text>' +
                    '<rect x="674" y="0" width="120" height="54" rx="6" fill="#0f172a" stroke="#475569"/><text x="734" y="22" fill="#38bdf8" font-size="12.5" font-weight="800" text-anchor="middle">Bước 6</text><text x="734" y="41" fill="#e2e8f0" font-size="12" text-anchor="middle">Hoàn thiện</text>' +
                    '</g>' +
                    '</svg>';
                return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
                    captionHtml('fa-solid fa-fire-burner', 'Quy trình nấu chảy đồng (20 kg · 1084°C) và đúc chuông đồng Trà Đông') + svg +
                    '</div></div>';
            }
        },
        'MH-C1-19': {
            id: 'MH-C1-19',
            title: 'Thùng xốp cách nhiệt làm lạnh 24 lon bia (330 mL) cùng đá lạnh (-5°C)',
            topic: 'DS-C1.1',
            layout: 'single',
            caption: 'Mô hình cân bằng nhiệt trong thùng xốp cách nhiệt ướp đá (Phối cảnh 3D Xuyên Thấu)',
            alt: 'Thùng xốp 3D xuyên thấu phóng to qua vách kính mờ chứa các lon bia 3D đứng cạnh các viên đá lập phương 3D ngâm trong nước lạnh',
            build: function (u) {
                var svg =
                    '<svg viewBox="0 0 840 400" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
                    '<defs>' +
                    '<marker id="' + u + 'arHeat" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 1 L 9 5 L 0 9 z" fill="#f59e0b"/></marker>' +
                    '<linearGradient id="' + u + 'canGrad" x1="0%" y1="0%" x2="100%" y2="0%">' +
                    '<stop offset="0%" stop-color="#1e3a8a"/><stop offset="40%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#172554"/>' +
                    '</linearGradient>' +
                    '</defs>' +
                    /* NAP THUNG XOP 3D MO NGHIENG TUYA PHIA SAU */
                    '<g transform="translate(100,20)">' +
                    '<polygon points="0,32 110,0 640,0 530,32" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2.2"/>' +
                    '<text x="320" y="22" fill="#1e293b" font-size="14" font-weight="900" text-anchor="middle">NẮP THÙNG XỐP CÁCH NHIỆT (MỞ)</text>' +
                    '</g>' +
                    /* THUNG XOP 3D PHONG TO CHIEM TOAN BO KHONG GIAN (BO BANG THUA GOC PHAI) */
                    '<g transform="translate(70,55)">' +
                    /* Vach sau va day thung xop */
                    '<polygon points="110,0 640,0 640,270 110,270" fill="#0f172a" stroke="#475569" stroke-width="2"/>' +
                    /* Nuoc lanh ngap trong thung (H2O 3 lit mau xanh trong suot) */
                    '<polygon points="0,135 110,70 640,70 530,135" fill="rgba(14,165,233,0.32)" class="ambient-water-wave"/>' +
                    '<polygon points="0,270 110,205 640,205 530,270" fill="rgba(14,165,233,0.22)"/>' +
                    /* HANG LON BIA 3D (330 mL, vo nhom xanh vang) */
                    /* Lon 1 */
                    '<g transform="translate(70,95)">' +
                    '<ellipse cx="36" cy="132" rx="30" ry="11" fill="#1e293b"/>' +
                    '<rect x="6" y="32" width="60" height="100" fill="url(#' + u + 'canGrad)" stroke="#94a3b8" stroke-width="1.5"/>' +
                    '<ellipse cx="36" cy="32" rx="30" ry="10" fill="#94a3b8" stroke="#e2e8f0" stroke-width="1.8"/>' +
                    '<ellipse cx="36" cy="132" rx="30" ry="10" fill="url(#' + u + 'canGrad)"/>' +
                    '<rect x="6" y="60" width="60" height="38" fill="#f59e0b" opacity="0.9"/>' +
                    '<text x="36" y="85" fill="#0f172a" font-size="12.5" font-weight="900" text-anchor="middle">330 mL</text>' +
                    '</g>' +
                    /* Lon 2 */
                    '<g transform="translate(160,95)">' +
                    '<ellipse cx="36" cy="132" rx="30" ry="11" fill="#1e293b"/>' +
                    '<rect x="6" y="32" width="60" height="100" fill="url(#' + u + 'canGrad)" stroke="#94a3b8" stroke-width="1.5"/>' +
                    '<ellipse cx="36" cy="32" rx="30" ry="10" fill="#94a3b8" stroke="#e2e8f0" stroke-width="1.8"/>' +
                    '<ellipse cx="36" cy="132" rx="30" ry="10" fill="url(#' + u + 'canGrad)"/>' +
                    '<rect x="6" y="60" width="60" height="38" fill="#f59e0b" opacity="0.9"/>' +
                    '<text x="36" y="85" fill="#0f172a" font-size="12.5" font-weight="900" text-anchor="middle">330 mL</text>' +
                    '</g>' +
                    /* Lon 3 */
                    '<g transform="translate(250,95)">' +
                    '<ellipse cx="36" cy="132" rx="30" ry="11" fill="#1e293b"/>' +
                    '<rect x="6" y="32" width="60" height="100" fill="url(#' + u + 'canGrad)" stroke="#94a3b8" stroke-width="1.5"/>' +
                    '<ellipse cx="36" cy="32" rx="30" ry="10" fill="#94a3b8" stroke="#e2e8f0" stroke-width="1.8"/>' +
                    '<ellipse cx="36" cy="132" rx="30" ry="10" fill="url(#' + u + 'canGrad)"/>' +
                    '<rect x="6" y="60" width="60" height="38" fill="#f59e0b" opacity="0.9"/>' +
                    '<text x="36" y="85" fill="#0f172a" font-size="12.5" font-weight="900" text-anchor="middle">330 mL</text>' +
                    '</g>' +
                    /* CAC KHOI DA LAP PHUONG 3D (Isometric Ice Cubes trong suot lap lanh) */
                    '<g class="ambient-ice-bob">' +
                    /* Vien da 1 */
                    '<g transform="translate(345,115)">' +
                    '<polygon points="0,18 26,0 58,0 32,18" fill="rgba(255,255,255,0.95)" stroke="#38bdf8" stroke-width="1.8"/>' +
                    '<polygon points="0,18 32,18 32,52 0,52" fill="rgba(224,242,254,0.85)" stroke="#38bdf8" stroke-width="1.8"/>' +
                    '<polygon points="32,18 58,0 58,34 32,52" fill="rgba(186,230,253,0.8)" stroke="#38bdf8" stroke-width="1.8"/>' +
                    '</g>' +
                    /* Vien da 2 */
                    '<g transform="translate(415,135)">' +
                    '<polygon points="0,18 26,0 58,0 32,18" fill="rgba(255,255,255,0.95)" stroke="#38bdf8" stroke-width="1.8"/>' +
                    '<polygon points="0,18 32,18 32,52 0,52" fill="rgba(224,242,254,0.85)" stroke="#38bdf8" stroke-width="1.8"/>' +
                    '<polygon points="32,18 58,0 58,34 32,52" fill="rgba(186,230,253,0.8)" stroke="#38bdf8" stroke-width="1.8"/>' +
                    '</g>' +
                    /* Vien da 3 */
                    '<g transform="translate(365,180)">' +
                    '<polygon points="0,18 26,0 58,0 32,18" fill="rgba(255,255,255,0.9)" stroke="#38bdf8" stroke-width="1.8"/>' +
                    '<polygon points="0,18 32,18 32,52 0,52" fill="rgba(224,242,254,0.8)" stroke="#38bdf8" stroke-width="1.8"/>' +
                    '<polygon points="32,18 58,0 58,34 32,52" fill="rgba(186,230,253,0.75)" stroke="#38bdf8" stroke-width="1.8"/>' +
                    '</g>' +
                    /* Vien da 4 */
                    '<g transform="translate(435,195)">' +
                    '<polygon points="0,18 26,0 58,0 32,18" fill="rgba(255,255,255,0.9)" stroke="#38bdf8" stroke-width="1.8"/>' +
                    '<polygon points="0,18 32,18 32,52 0,52" fill="rgba(224,242,254,0.8)" stroke="#38bdf8" stroke-width="1.8"/>' +
                    '<polygon points="32,18 58,0 58,34 32,52" fill="rgba(186,230,253,0.75)" stroke="#38bdf8" stroke-width="1.8"/>' +
                    '</g>' +
                    '</g>' +
                    /* Mui ten truyen nhiet noi he tu Bia (35°C) sang Da lanh (-5°C) */
                    '<g class="ambient-heat-arrow">' +
                    '<line x1="315" y1="145" x2="350" y2="135" stroke="#f59e0b" stroke-width="3.5" marker-end="url(#' + u + 'arHeat)"/>' +
                    '<line x1="315" y1="185" x2="360" y2="195" stroke="#f59e0b" stroke-width="3.5" marker-end="url(#' + u + 'arHeat)"/>' +
                    '</g>' +
                    /* VACH TRUOC KINH MO TRONG SUOT (Mo mo nhe nhang tao chieu sau 3D) */
                    '<polygon points="0,65 530,65 530,270 0,270" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.55)" stroke-width="2.5"/>' +
                    '<polygon points="530,65 640,0 640,205 530,270" fill="rgba(255,255,255,0.04)" stroke="#64748b" stroke-width="2"/>' +
                    '</g>' +
                    '<text x="420" y="365" fill="#e2e8f0" font-size="14" font-weight="800" text-anchor="middle">Hệ cô lập trao đổi nhiệt nội bộ (Bia 35°C truyền nhiệt làm tan đá -5°C)</text>' +
                    '</svg>';
                return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
                    captionHtml('fa-solid fa-snowflake', 'Mô hình cân bằng nhiệt trong thùng xốp cách nhiệt (Phối cảnh 3D Xuyên Thấu)') + svg +
                    '</div></div>';
            }
        },
        'MH-C1-21': {
            id: 'MH-C1-21',
            title: 'Động cơ xăng đốt trong 4 kỳ (Cấu tạo xi-lanh và 4 hành trình)',
            topic: 'DS-C1.6',
            layout: 'single',
            caption: 'Mô phỏng chu trình 4 kỳ của động cơ đốt trong (Chuẩn cơ cấu động học)',
            alt: 'Động cơ đốt trong 4 kỳ gồm bugi, van nạp nghiêng có lò xo, van xả nghiêng có lò xo, piston lên xuống, thanh truyền nghiêng và trục khuỷu quay qua 4 hành trình',
            build: function (u) {
                var svg =
                    '<svg viewBox="0 0 860 410" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
                    '<defs>' +
                    '<linearGradient id="' + u + 'combustGrad" x1="0%" y1="0%" x2="0%" y2="100%">' +
                    '<stop offset="0%" stop-color="#ef4444"/><stop offset="50%" stop-color="#f97316"/><stop offset="100%" stop-color="#eab308"/>' +
                    '</linearGradient>' +
                    '</defs>' +
                    /* KHOANG XI-LANH DONG CO DONG HOC CHUAN VIDEO (Ben trai) */
                    '<g transform="translate(30,15)">' +
                    /* Than khoi dong co va khoang cacte ben duoi */
                    '<path d="M 40 45 L 230 45 L 230 105 L 205 105 L 205 235 L 245 355 L 25 355 L 65 235 L 65 105 L 40 105 Z" fill="#1e293b" stroke="#64748b" stroke-width="2.5"/>' +
                    /* Duong ong nap khi ben trai (cong vao buong dot) */
                    '<path d="M 0 65 Q 40 65 72 98" fill="none" stroke="#64748b" stroke-width="16" stroke-linecap="round"/>' +
                    '<path d="M 0 65 Q 40 65 72 98" fill="none" stroke="#38bdf8" stroke-width="6" stroke-linecap="round" opacity="0.8"/>' +
                    /* Duong ong xa khi ben phai (cong ra ngoai ong xa) */
                    '<path d="M 270 65 Q 230 65 198 98" fill="none" stroke="#64748b" stroke-width="16" stroke-linecap="round"/>' +
                    '<path d="M 270 65 Q 230 65 198 98" fill="none" stroke="#94a3b8" stroke-width="6" stroke-linecap="round" opacity="0.6"/>' +
                    /* Long xi lanh chinh giua */
                    '<rect x="68" y="105" width="134" height="135" fill="#0b1120" stroke="#475569" stroke-width="2"/>' +
                    /* Vung hoa khi / ngon lua chay buong dot */
                    '<rect x="70" y="107" width="130" height="42" fill="url(#' + u + 'combustGrad)" opacity="0.65" class="ambient-heat-arrow"/>' +
                    /* XUPAP NAP (Ben trai dat nghieng kem lo xo xoan nhu video) */
                    '<g transform="translate(62,40)">' +
                    '<line x1="15" y1="0" x2="35" y2="62" stroke="#cbd5e1" stroke-width="4.5"/>' +
                    '<polygon points="24,62 48,62 36,68" fill="#38bdf8"/>' +
                    /* Lo xo xupap nap */
                    '<line x1="18" y1="18" x2="28" y2="48" stroke="#94a3b8" stroke-width="3" stroke-dasharray="3 3"/>' +
                    '<rect x="10" y="-4" width="10" height="8" rx="2" fill="#475569"/>' +
                    '</g>' +
                    '<text x="45" y="32" fill="#38bdf8" font-size="12.5" font-weight="800">Van nạp</text>' +
                    /* XUPAP XA (Ben phai dat nghieng kem lo xo xoan nhu video) */
                    '<g transform="translate(175,40)">' +
                    '<line x1="33" y1="0" x2="13" y2="62" stroke="#cbd5e1" stroke-width="4.5"/>' +
                    '<polygon points="1,62 25,62 13,68" fill="#fca5a5"/>' +
                    /* Lo xo xupap xa */
                    '<line x1="30" y1="18" x2="20" y2="48" stroke="#94a3b8" stroke-width="3" stroke-dasharray="3 3"/>' +
                    '<rect x="28" y="-4" width="10" height="8" rx="2" fill="#475569"/>' +
                    '</g>' +
                    '<text x="225" y="32" fill="#fca5a5" font-size="12.5" font-weight="800">Van xả</text>' +
                    /* BUGI / VOI PHUN DUNG THANG CHINH GIUA DINH XI LANH */
                    '<rect x="130" y="8" width="10" height="68" fill="#94a3b8" stroke="#cbd5e1" stroke-width="1.5"/>' +
                    '<circle cx="135" cy="8" r="6" fill="#cbd5e1"/>' +
                    '<polygon points="127,78 135,92 143,78" fill="#fbbf24" class="ambient-heat-arrow"/>' +
                    '<text x="135" y="-3" fill="#fbbf24" font-size="12.5" font-weight="800" text-anchor="middle">Bugi</text>' +
                    /* PISTON MAU VANG CAM CO RANH XEC-MANG TINH TIEN LEN XUONG */
                    '<g class="ambient-piston">' +
                    '<rect x="74" y="145" width="122" height="52" rx="4" fill="#d97706" stroke="#fbbf24" stroke-width="2"/>' +
                    '<line x1="74" y1="155" x2="196" y2="155" stroke="#78350f" stroke-width="1.8"/>' +
                    '<line x1="74" y1="165" x2="196" y2="165" stroke="#78350f" stroke-width="1.8"/>' +
                    /* Chot piston */
                    '<circle cx="135" cy="172" r="10" fill="#0f172a" stroke="#cbd5e1" stroke-width="2"/>' +
                    /* Thanh truyen (Connecting rod) nghieng theo truc khuyu */
                    '<line x1="135" y1="182" x2="120" y2="288" stroke="#94a3b8" stroke-width="12" stroke-linecap="round"/>' +
                    '</g>' +
                    /* CACTE TRUC KHUYU VA DIA TRUC KHUYU QUAY TRON */
                    '<circle cx="135" cy="300" r="46" fill="#0f172a" stroke="#94a3b8" stroke-width="2.5"/>' +
                    '<g class="ambient-fan-spin">' +
                    '<circle cx="120" cy="275" r="12" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>' +
                    '<line x1="120" y1="275" x2="135" y2="300" stroke="#cbd5e1" stroke-width="6"/>' +
                    '<circle cx="135" cy="300" r="11" fill="#38bdf8"/>' +
                    '</g>' +
                    '<text x="135" y="375" fill="#cbd5e1" font-size="13" font-weight="800" text-anchor="middle">Xi-lanh · Piston · Trục khuỷu</text>' +
                    '</g>' +
                    /* BANG 4 HANH TRINH HOAT DONG DONG BO TUAN TU (NAP - NEN - NO - XA) */
                    '<g transform="translate(325,18)">' +
                    /* Ky 1: NAP */
                    '<g transform="translate(0,0)"><rect x="0" y="0" width="245" height="160" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>' +
                    '<text x="12" y="24" fill="#38bdf8" font-size="14" font-weight="900">1. HÀNH TRÌNH NẠP</text>' +
                    '<text x="12" y="52" fill="#e2e8f0" font-size="12.5">• Van nạp MỞ, van xả ĐÓNG</text>' +
                    '<text x="12" y="76" fill="#e2e8f0" font-size="12.5">• Piston đi xuống (ĐCT → ĐCD)</text>' +
                    '<text x="12" y="100" fill="#e2e8f0" font-size="12.5">• Hút hòa khí xăng + không khí</text>' +
                    '<text x="12" y="126" fill="#7dd3fc" font-size="11.5" font-family="DM Mono,monospace">V tăng, áp suất buồng đốt giảm</text>' +
                    '<text x="12" y="146" fill="#94a3b8" font-size="11.5" font-family="DM Mono,monospace">Trục khuỷu quay 180°</text></g>' +
                    /* Ky 2: NEN */
                    '<g transform="translate(260,0)"><rect x="0" y="0" width="245" height="160" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="1.8"/>' +
                    '<text x="12" y="24" fill="#fbbf24" font-size="14" font-weight="900">2. HÀNH TRÌNH NÉN</text>' +
                    '<text x="12" y="52" fill="#e2e8f0" font-size="12.5">• Cả 2 van đều ĐÓNG KÍN</text>' +
                    '<text x="12" y="76" fill="#e2e8f0" font-size="12.5">• Piston đi lên (ĐCD → ĐCT)</text>' +
                    '<text x="12" y="100" fill="#e2e8f0" font-size="12.5">• Nén chặt hòa khí lại đỉnh nòng</text>' +
                    '<text x="12" y="126" fill="#fde047" font-size="11.5" font-family="DM Mono,monospace">Áp suất và nhiệt độ tăng vọt</text>' +
                    '<text x="12" y="146" fill="#94a3b8" font-size="11.5" font-family="DM Mono,monospace">Cuối kỳ: Bugi đánh tia lửa</text></g>' +
                    /* Ky 3: NO (SINH CONG) */
                    '<g transform="translate(0,175)"><rect x="0" y="0" width="245" height="160" rx="8" fill="#0f172a" stroke="#ef4444" stroke-width="2"/>' +
                    '<text x="12" y="24" fill="#ef4444" font-size="14" font-weight="900">3. HÀNH TRÌNH NỔ (SINH CÔNG)</text>' +
                    '<text x="12" y="52" fill="#e2e8f0" font-size="12.5">• Cả 2 van tiếp tục ĐÓNG</text>' +
                    '<text x="12" y="76" fill="#e2e8f0" font-size="12.5">• Hòa khí bốc cháy mãnh liệt</text>' +
                    '<text x="12" y="100" fill="#e2e8f0" font-size="12.5">• Khí giãn nở đẩy piston lao xuống</text>' +
                    '<text x="12" y="126" fill="#fca5a5" font-size="11.5" font-family="DM Mono,monospace">Sinh công làm quay trục khuỷu</text>' +
                    '<text x="12" y="146" fill="#fbbf24" font-size="11.5" font-family="DM Mono,monospace">Năng lượng: q = 44,8 MJ/kg</text></g>' +
                    /* Ky 4: XA */
                    '<g transform="translate(260,175)"><rect x="0" y="0" width="245" height="160" rx="8" fill="#0f172a" stroke="#64748b" stroke-width="1.8"/>' +
                    '<text x="12" y="24" fill="#cbd5e1" font-size="14" font-weight="900">4. HÀNH TRÌNH XẢ</text>' +
                    '<text x="12" y="52" fill="#e2e8f0" font-size="12.5">• Van xả MỞ, van nạp ĐÓNG</text>' +
                    '<text x="12" y="76" fill="#e2e8f0" font-size="12.5">• Piston đi lên (ĐCD → ĐCT)</text>' +
                    '<text x="12" y="100" fill="#e2e8f0" font-size="12.5">• Đẩy toàn bộ khí cháy ra ống xả</text>' +
                    '<text x="12" y="126" fill="#94a3b8" font-size="11.5" font-family="DM Mono,monospace">Khí thải quét sạch buồng đốt</text>' +
                    '<text x="12" y="146" fill="#38bdf8" font-size="11.5" font-family="DM Mono,monospace">Hoàn tất 720°, lặp lại kỳ 1</text></g>' +
                    '</g>' +
                    '</svg>';
                return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
                    captionHtml('fa-solid fa-gears', 'Mô phỏng chu trình 4 kỳ của động cơ đốt trong (Chuẩn cơ cấu động học)') + svg +
                    '</div></div>';
            }
        },

  'MH-C2-23': {
    id: 'MH-C2-23',
    title: 'Bóng thám không khảo sát khí quyển',
    topic: 'DS-C2.2',
    layout: 'single',
    caption: 'Sơ đồ hoạt động của bóng thám không từ mặt đất lên độ cao 40 km',
    alt: 'Sơ đồ bóng thám không mang hộp cảm biến khí tượng bay lên độ cao 40 km, bóng giãn nở do chênh lệch áp suất',
    build: function (u) {
      // TUÂN THỦ QUY TẮC CỦA THẦY:
      // - Tuyệt đối KHÔNG ghi các thông số trạng thái (V1, p1, T1, V2, p2, T2) làm lộ đáp án câu hỏi.
      // - Hộp cảm biến ở mặt đất và trên cao GIỮ NGUYÊN kích thước (bóng nở to chứ cảm biến không nở to).
      // - Thể hiện các mũi tên áp suất từ tâm đẩy ép vào thành vỏ bóng làm bóng giãn nở.
      var svg =
        '<svg viewBox="0 0 700 360" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs>' +
        '<linearGradient id="' + u + 'sky" x1="0%" y1="100%" x2="0%" y2="0%">' +
        '<stop offset="0%" stop-color="#0f294a"/><stop offset="55%" stop-color="#0b1b36"/><stop offset="100%" stop-color="#040814"/>' +
        '</linearGradient>' +
        '<radialGradient id="' + u + 'bal" cx="40%" cy="35%" r="60%">' +
        '<stop offset="0%" stop-color="#f8fafc"/><stop offset="65%" stop-color="#cbd5e1"/><stop offset="100%" stop-color="#64748b"/>' +
        '</radialGradient>' +
        '<marker id="' + u + 'up" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
        '<path d="M 0 1 L 9 5 L 0 9 z" fill="#38bdf8"/></marker>' +
        '<marker id="' + u + 'pArrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto">' +
        '<path d="M 0 1 L 9 5 L 0 9 z" fill="#38bdf8"/></marker>' +
        '</defs>' +
        '<rect x="16" y="16" width="668" height="328" rx="12" fill="url(#' + u + 'sky)" stroke="#1e293b" stroke-width="1.5"/>' +
        // Thang đo độ cao bên trái
        '<line x1="78" y1="42" x2="78" y2="320" stroke="#475569" stroke-width="2"/>' +
        '<line x1="70" y1="54" x2="86" y2="54" stroke="#f59e0b" stroke-width="2"/>' +
        '<text x="64" y="59" fill="#fbbf24" font-size="13" font-weight="800" text-anchor="end">40 km</text>' +
        '<line x1="72" y1="186" x2="84" y2="186" stroke="#64748b" stroke-width="1.5"/>' +
        '<text x="64" y="191" fill="#94a3b8" font-size="12.5" font-weight="700" text-anchor="end">20 km</text>' +
        '<line x1="70" y1="316" x2="86" y2="316" stroke="#10b981" stroke-width="2"/>' +
        '<text x="64" y="320" fill="#6ee7b7" font-size="13" font-weight="800" text-anchor="end">0 km</text>' +
        // Mặt đất & Đài quan sát khí tượng
        '<rect x="92" y="302" width="582" height="30" rx="4" fill="#0f172a" stroke="#334155" stroke-width="1.2"/>' +
        '<rect x="135" y="274" width="66" height="28" rx="4" fill="#1e293b" stroke="#38bdf8" stroke-width="1.6"/>' +
        '<path d="M 160 274 L 168 254 L 176 274" fill="none" stroke="#94a3b8" stroke-width="2"/>' +
        '<path d="M 155 250 Q 168 240 181 250" fill="none" stroke="#38bdf8" stroke-width="2" class="ambient-heat-arrow"/>' +
        '<text x="210" y="321" fill="#cbd5e1" font-size="13" font-weight="700" text-anchor="middle">Đài quan sát khí tượng (Mặt đất)</text>' +
        // Quả bóng lúc thả ở mặt đất (bóng nhỏ, r = 22)
        '<circle cx="242" cy="242" r="22" fill="url(#' + u + 'bal)" stroke="#e2e8f0" stroke-width="1.5"/>' +
        // Dây treo cảm biến (dài 14px)
        '<line x1="242" y1="264" x2="242" y2="278" stroke="#cbd5e1" stroke-width="1.5"/>' +
        // Hộp cảm biến ở mặt đất (kích thước chuẩn 18 x 13)
        '<rect x="233" y="278" width="18" height="13" rx="2.5" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>' +
        '<circle cx="242" cy="284.5" r="2" fill="#10b981"/>' +
        '<text x="274" y="248" fill="#e2e8f0" font-size="13.5" font-weight="800">Lúc thả (Mặt đất)</text>' +
        '<text x="274" y="268" fill="#94a3b8" font-size="12">Thể tích ban đầu</text>' +
        // Đường bay lượn sóng lên cao
        '<path d="M 258 214 Q 306 160 348 118" fill="none" stroke="#38bdf8" stroke-width="2.2" stroke-dasharray="6 5" marker-end="url(#' + u + 'up)"/>' +
        // Quả bóng giãn nở ở độ cao lớn (~40 km, r = 58)
        '<g class="ambient-balloon">' +
        '<circle cx="415" cy="110" r="58" fill="url(#' + u + 'bal)" stroke="#38bdf8" stroke-width="2"/>' +
        // Mũi tên áp suất từ tâm đẩy ép ra thành vỏ bóng
        '<line x1="415" y1="110" x2="415" y2="60" stroke="#38bdf8" stroke-width="1.8" marker-end="url(#' + u + 'pArrow)"/>' +
        '<line x1="415" y1="110" x2="415" y2="160" stroke="#38bdf8" stroke-width="1.8" marker-end="url(#' + u + 'pArrow)"/>' +
        '<line x1="415" y1="110" x2="368" y2="110" stroke="#38bdf8" stroke-width="1.8" marker-end="url(#' + u + 'pArrow)"/>' +
        '<line x1="415" y1="110" x2="462" y2="110" stroke="#38bdf8" stroke-width="1.8" marker-end="url(#' + u + 'pArrow)"/>' +
        '<line x1="415" y1="110" x2="380" y2="76" stroke="#38bdf8" stroke-width="1.6" marker-end="url(#' + u + 'pArrow)"/>' +
        '<line x1="415" y1="110" x2="450" y2="76" stroke="#38bdf8" stroke-width="1.6" marker-end="url(#' + u + 'pArrow)"/>' +
        '<line x1="415" y1="110" x2="380" y2="144" stroke="#38bdf8" stroke-width="1.6" marker-end="url(#' + u + 'pArrow)"/>' +
        '<line x1="415" y1="110" x2="450" y2="144" stroke="#38bdf8" stroke-width="1.6" marker-end="url(#' + u + 'pArrow)"/>' +
        // Dây treo cảm biến lên cao
        '<line x1="415" y1="168" x2="415" y2="188" stroke="#cbd5e1" stroke-width="1.5"/>' +
        // HỘP CẢM BIẾN LÚC SAU GIỮ NGUYÊN KÍCH THƯỚC (18 x 13) KHÔNG ĐƯỢC TO LÊN!
        '<rect x="406" y="188" width="18" height="13" rx="2.5" fill="#1e293b" stroke="#fbbf24" stroke-width="1.5"/>' +
        '<circle cx="415" cy="194.5" r="2" fill="#10b981"/>' +
        '<path d="M 395 194 Q 387 197 395 200" fill="none" stroke="#38bdf8" stroke-width="1.5" class="ambient-heat-arrow"/>' +
        '<path d="M 435 194 Q 443 197 435 200" fill="none" stroke="#38bdf8" stroke-width="1.5" class="ambient-heat-arrow"/>' +
        '</g>' +
        // Chú thích bên phải
        '<polyline points="473,88 505,70 664,70" fill="none" stroke="#f59e0b" stroke-width="1.8"/>' +
        '<circle cx="473" cy="88" r="3.5" fill="#f59e0b"/>' +
        '<text x="508" y="63" fill="#fbbf24" font-size="13.5" font-weight="800">Bóng giãn nở ở độ cao lớn (~40 km)</text>' +
        '<text x="508" y="88" fill="#e2e8f0" font-size="12.5">Áp suất ngoài giảm → Khí nở ép vỏ bóng</text>' +
        '<polyline points="424,194 505,194 664,194" fill="none" stroke="#38bdf8" stroke-width="1.6" stroke-dasharray="3 3"/>' +
        '<circle cx="424" cy="194" r="3.5" fill="#38bdf8"/>' +
        '<text x="508" y="186" fill="#7dd3fc" font-size="13.5" font-weight="800">Hộp cảm biến &amp; GPS/Radar</text>' +
        '<text x="508" y="212" fill="#cbd5e1" font-size="12.5">Kích thước không đổi · Đo p, T, ẩm, gió</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-cloud-arrow-up', this.caption) + svg + '</div></div>';
    }
  },

    'MH-C2-24': {
    id: 'MH-C2-24',
    title: 'Bóng thám không chứa khí Hydrogen',
    topic: 'DS-C2.2',
    layout: 'single',
    caption: 'Các trạng thái biến đổi của bóng thám không chứa khí Hydrogen khi bay lên cao',
    alt: 'Sơ đồ so sánh trạng thái của bóng thám không chứa khí H2 từ điều kiện chuẩn, lúc thả đến giới hạn nổ',
    build: function (u) {
      // TUÂN THỦ QUY TẮC CỦA THẦY:
      // - Chỉ thể hiện thông tin của đề bài, KHÔNG lấy số liệu tính toán ở ý hỏi c) (7°C, 67 000 Pa).
      // - Cảm biến kích thước không đổi.
      var svg =
        '<svg viewBox="0 0 700 350" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><radialGradient id="' + u + 'hb" cx="38%" cy="32%" r="65%">' +
        '<stop offset="0%" stop-color="#f1f5f9"/><stop offset="65%" stop-color="#94a3b8"/><stop offset="100%" stop-color="#475569"/>' +
        '</radialGradient>' +
        '<marker id="' + u + 'ar" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
        '<path d="M 0 1 L 9 5 L 0 9 z" fill="#38bdf8"/></marker></defs>' +
        '<rect x="16" y="16" width="668" height="318" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Cột 1: Điều kiện chuẩn (ĐKTC)
        '<rect x="32" y="34" width="194" height="282" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>' +
        '<text x="129" y="58" fill="#94a3b8" font-size="13.5" font-weight="800" text-anchor="middle">Điều kiện chuẩn (ĐKTC)</text>' +
        '<circle cx="129" cy="142" r="32" fill="url(#' + u + 'hb)" opacity="0.88"/>' +
        '<text x="129" y="147" fill="#0f172a" font-size="14" font-weight="800" text-anchor="middle">H₂</text>' +
        '<text x="129" y="214" fill="#e2e8f0" font-size="12.5" font-weight="700" text-anchor="middle">t₀ = 0°C · p₀ = 101,3 kPa</text>' +
        '<text x="129" y="238" fill="#7dd3fc" font-size="12.5" font-weight="700" text-anchor="middle">ρ₀ = 0,09 kg/m³</text>' +
        '<text x="129" y="262" fill="#cbd5e1" font-size="12.5" text-anchor="middle">1 mol khí = 22,4 lít</text>' +
        // Cột 2: Trạng thái thả bóng (mặt đất)
        '<rect x="252" y="34" width="194" height="282" rx="10" fill="#0f172a" stroke="#0284c7" stroke-width="1.6"/>' +
        '<text x="349" y="58" fill="#38bdf8" font-size="13.5" font-weight="800" text-anchor="middle">Trạng thái thả bóng (1)</text>' +
        '<g class="ambient-balloon">' +
        '<circle cx="349" cy="138" r="40" fill="url(#' + u + 'hb)" stroke="#38bdf8" stroke-width="1.5"/>' +
        '<g class="ambient-gas-a"><circle cx="337" cy="128" r="3" fill="#0284c7"/><circle cx="362" cy="146" r="3" fill="#0284c7"/></g>' +
        '<line x1="349" y1="178" x2="349" y2="192" stroke="#cbd5e1" stroke-width="1.5"/>' +
        '<rect x="340" y="192" width="18" height="12" rx="2" fill="#1e293b" stroke="#38bdf8" stroke-width="1.4"/>' +
        '</g>' +
        '<text x="349" y="238" fill="#e2e8f0" font-size="13" font-weight="700" text-anchor="middle">V₁ = 15,8 m³</text>' +
        '<text x="349" y="262" fill="#7dd3fc" font-size="13" font-weight="700" text-anchor="middle">p₁ = 105 000 Pa</text>' +
        '<text x="349" y="286" fill="#cbd5e1" font-size="13" font-weight="700" text-anchor="middle">t₁ = 27°C</text>' +
        // Cột 3: Giới hạn nổ (lên cao khí giãn nở tới hạn)
        '<rect x="472" y="34" width="196" height="282" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="1.6"/>' +
        '<text x="570" y="58" fill="#fbbf24" font-size="13.5" font-weight="800" text-anchor="middle">Giới hạn giãn nở &amp; Nổ</text>' +
        '<g class="ambient-balloon">' +
        '<circle cx="570" cy="136" r="54" fill="url(#' + u + 'hb)" stroke="#fbbf24" stroke-width="1.8" stroke-dasharray="6 3"/>' +
        '<g class="ambient-gas-b"><circle cx="552" cy="122" r="3.2" fill="#d97706"/><circle cx="585" cy="148" r="3.2" fill="#d97706"/></g>' +
        '<line x1="570" y1="190" x2="570" y2="204" stroke="#cbd5e1" stroke-width="1.5"/>' +
        '<rect x="561" y="204" width="18" height="12" rx="2" fill="#1e293b" stroke="#fbbf24" stroke-width="1.4"/>' +
        '</g>' +
        '<text x="570" y="246" fill="#fca5a5" font-size="13" font-weight="800" text-anchor="middle">Bóng sẽ vỡ khi đạt tới:</text>' +
        '<text x="570" y="270" fill="#fbbf24" font-size="13" font-weight="700" text-anchor="middle">V_nổ = 39,5 m³</text>' +
        '<text x="570" y="292" fill="#e2e8f0" font-size="13" font-weight="700" text-anchor="middle">p_nổ = 27 640 Pa</text>' +
        // Mũi tên chuyển trạng thái 2 -> 3
        '<line x1="448" y1="140" x2="470" y2="140" stroke="#38bdf8" stroke-width="2.2" marker-end="url(#' + u + 'ar)"/>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-up-right-and-down-left-from-center', this.caption) + svg + '</div></div>';
    }
  },

    'MH-C2-25': {
    id: 'MH-C2-25',
    title: 'Khinh khí cầu có lỗ hở & Bịt kín bay lên độ cao cực đại',
    topic: 'DS-C2.2',
    layout: 'single',
    caption: 'Cấu tạo khinh khí cầu có lỗ hở dưới đáy và phân tích các lực tác dụng khi bay lên',
    alt: 'Mô hình khinh khí cầu thể tích không đổi V = 1,15 m3 và các vectơ lực F_A, P_khí, P_vỏ đặt trực tiếp trên khí cầu',
    build: function (u) {
      // TUÂN THỦ QUY TẮC CỦA THẦY:
      // - Lực tác động F_A, P_khí và P_vỏ phải thể hiện TRỰC TIẾP lên trên hình khí cầu.
      // - Chỉ số dưới phải chuẩn hóa (F_A, P_khí, P_vỏ, m_vỏ), tuyệt đối không để chữ gạch dưới thô xấu.
      var svg =
        '<svg viewBox="0 0 700 370" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs>' +
        '<linearGradient id="' + u + 'shell" x1="0%" y1="0%" x2="100%" y2="0%">' +
        '<stop offset="0%" stop-color="#0284c7"/><stop offset="50%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#0369a1"/>' +
        '</linearGradient>' +
        '<marker id="' + u + 'fa" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
        '<path d="M 0 1 L 9 5 L 0 9 z" fill="#10b981"/></marker>' +
        '<marker id="' + u + 'fg" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
        '<path d="M 0 1 L 9 5 L 0 9 z" fill="#f97316"/></marker>' +
        '<marker id="' + u + 'fv" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
        '<path d="M 0 1 L 9 5 L 0 9 z" fill="#ef4444"/></marker>' +
        '</defs>' +
        '<rect x="16" y="16" width="668" height="338" rx="12" fill="#081020" stroke="#1e293b" stroke-width="1.5"/>' +
        // Thân khinh khí cầu (tâm hình học tại x = 180, y = 135)
        '<g class="ambient-balloon">' +
        '<path d="M 130 120 C 130 50 230 50 230 120 C 230 165 204 200 198 222 L 162 222 C 156 200 130 165 130 120 Z" fill="rgba(56,189,248,0.16)" stroke="url(#' + u + 'shell)" stroke-width="3"/>' +
        '<g class="ambient-gas-a"><circle cx="162" cy="112" r="3.5" fill="#fbbf24"/><circle cx="196" cy="134" r="3.5" fill="#fbbf24"/></g>' +
        '<g class="ambient-gas-b"><circle cx="186" cy="100" r="3.5" fill="#f97316"/><circle cx="170" cy="150" r="3.5" fill="#f97316"/></g>' +
        // Đầu đốt lửa tại lỗ hở đáy
        '<ellipse cx="180" cy="214" rx="8" ry="12" fill="#f59e0b" class="ambient-heat-arrow"/>' +
        // Dây treo giỏ
        '<line x1="164" y1="222" x2="168" y2="246" stroke="#94a3b8" stroke-width="1.8"/>' +
        '<line x1="196" y1="222" x2="192" y2="246" stroke="#94a3b8" stroke-width="1.8"/>' +
        '<rect x="164" y="246" width="32" height="22" rx="4" fill="#92400e" stroke="#d97706" stroke-width="1.5"/>' +
        // ═══ CÁC VECTƠ LỰC ĐẶT TRỰC TIẾP LÊN HÌNH KHÍ CẦU ═══
        // 1. Lực đẩy Ác-si-mét F_A (điểm đặt tại tâm khí cầu x=180, y=135, hướng thẳng đứng LÊN)
        '<circle cx="180" cy="135" r="4.5" fill="#10b981"/>' +
        '<line x1="180" y1="135" x2="180" y2="52" stroke="#10b981" stroke-width="3.2" marker-end="url(#' + u + 'fa)"/>' +
        '<text x="194" y="66" fill="#6ee7b7" font-size="14.5" font-weight="800">F<tspan font-size="11" dy="3">A</tspan></text>' +
        // 2. Trọng lực khối khí P_khí (điểm đặt tại tâm khí cầu x=180, y=135, hướng thẳng đứng XUỐNG)
        '<line x1="180" y1="135" x2="180" y2="198" stroke="#f97316" stroke-width="3" marker-end="url(#' + u + 'fg)"/>' +
        '<text x="194" y="190" fill="#fdba74" font-size="14" font-weight="800">P<tspan font-size="10.5" dy="3">khí</tspan></text>' +
        // 3. Trọng lực vỏ khí cầu & giỏ P_vỏ (điểm đặt tại giỏ treo x=180, y=257, hướng thẳng đứng XUỐNG)
        '<circle cx="180" cy="257" r="4" fill="#ef4444"/>' +
        '<line x1="180" y1="257" x2="180" y2="325" stroke="#ef4444" stroke-width="3" marker-end="url(#' + u + 'fv)"/>' +
        '<text x="194" y="315" fill="#fca5a5" font-size="14" font-weight="800">P<tspan font-size="10.5" dy="3">vỏ</tspan></text>' +
        '</g>' +
        // Bảng chú thích thông số chuẩn hóa KaTeX chỉ số dưới bên phải
        '<rect x="290" y="38" width="382" height="76" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.4"/>' +
        '<text x="306" y="62" fill="#7dd3fc" font-size="13.5" font-weight="800">Thông số khí cầu &amp; Mặt đất</text>' +
        '<text x="306" y="84" fill="#e2e8f0" font-size="13">V = 1,15 m³ · m<tspan font-size="10" dy="2">vỏ</tspan><tspan dy="-2"> = 0,2 kg · g = 10 m/s²</tspan></text>' +
        '<text x="306" y="103" fill="#cbd5e1" font-size="13">t₁ = 20°C · p₁ = 1,013·10⁵ Pa · ρ₀ = 1,2 kg/m³</text>' +

        '<rect x="290" y="126" width="382" height="78" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.4"/>' +
        '<text x="306" y="150" fill="#fbbf24" font-size="13.5" font-weight="800">1. Lỗ hở trao đổi khí đáy (Đẳng áp)</text>' +
        '<text x="306" y="172" fill="#e2e8f0" font-size="13">Áp suất trong cầu luôn bằng áp suất khí quyển.</text>' +
        '<text x="306" y="191" fill="#cbd5e1" font-size="13">Nung nóng → Khí nở ra và thoát bớt qua lỗ hở.</text>' +

        '<rect x="290" y="216" width="382" height="88" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.4"/>' +
        '<text x="306" y="240" fill="#6ee7b7" font-size="13.5" font-weight="800">2. Bịt kín lỗ hở ở t₂ = 110°C &amp; Bay lên</text>' +
        '<text x="306" y="262" fill="#e2e8f0" font-size="13">Mật độ không khí giảm theo độ cao: ρ(h) = ρ₀·e<tspan font-size="9" dy="-4">-ρ₀gh/p₁</tspan></text>' +
        '<text x="306" y="286" fill="#cbd5e1" font-size="13">Điều kiện lơ lửng cực đại: F<tspan font-size="10" dy="2">A</tspan><tspan dy="-2"> = P</tspan><tspan font-size="10" dy="2">vỏ</tspan><tspan dy="-2"> + P</tspan><tspan font-size="10" dy="2">khí</tspan></text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-fire-flame-curved', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C2-26': {
    id: 'MH-C2-26',
    title: 'Lễ hội khinh khí cầu Huế tại Quảng trường Ngọ Môn',
    topic: 'DS-C2.2',
    layout: 'single',
    caption: 'Khinh khí cầu lễ hội Huế (V = 336 m³) bay lên nhờ đốt nóng khối khí bên trong',
    alt: 'Khinh khí cầu nhiều màu sắc bay phía trên Ngọ Môn Huế kèm thông số động năng phân tử và trạng thái khí',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 360" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><linearGradient id="' + u + 'night" x1="0%" y1="0%" x2="0%" y2="100%">' +
        '<stop offset="0%" stop-color="#080d22"/><stop offset="100%" stop-color="#17203a"/></linearGradient></defs>' +
        '<rect x="16" y="16" width="668" height="328" rx="12" fill="url(#' + u + 'night)" stroke="#1e293b" stroke-width="1.5"/>' +
        // Ngo Mon silhouette at bottom left
        '<path d="M 48 318 L 350 318 L 350 294 L 308 294 L 298 274 L 244 274 L 236 254 L 162 254 L 154 274 L 100 274 L 90 294 L 48 294 Z" fill="#1e293b" stroke="#f59e0b" stroke-width="1.6"/>' +
        '<path d="M 184 318 L 184 298 A 15 15 0 0 1 214 298 L 214 318 Z" fill="#090e1a" stroke="#d97706" stroke-width="1.2"/>' +
        '<text x="199" y="336" fill="#fbbf24" font-size="13" font-weight="700" text-anchor="middle">Quảng trường Ngọ Môn – Huế</text>' +
        // Hot air balloon
        '<g class="ambient-balloon">' +
        '<path d="M 140 112 C 140 42 258 42 258 112 C 258 156 226 190 218 206 L 180 206 C 172 190 140 156 140 112 Z" fill="#0284c7" stroke="#f8fafc" stroke-width="1.8"/>' +
        '<path d="M 164 60 C 180 110 180 165 186 206 L 212 206 C 218 165 218 110 234 60 Q 199 54 164 60 Z" fill="#f59e0b" opacity="0.88"/>' +
        '<path d="M 182 58 C 190 110 190 165 193 206 L 205 206 C 208 165 208 110 216 58 Z" fill="#ef4444" opacity="0.85"/>' +
        '<ellipse cx="199" cy="214" rx="7" ry="10" fill="#fde047" class="ambient-heat-arrow"/>' +
        '<rect x="187" y="226" width="24" height="15" rx="3" fill="#78350f" stroke="#fbbf24" stroke-width="1.3"/>' +
        '</g>' +
        // Micro physics inset card on right
        '<rect x="372" y="42" width="290" height="270" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>' +
        '<text x="517" y="68" fill="#38bdf8" font-size="14" font-weight="800" text-anchor="middle">Thông số & Mô hình phân tử</text>' +
        '<text x="392" y="96" fill="#e2e8f0" font-size="13">• Thể tích khí cầu: V = 336 m³</text>' +
        '<text x="392" y="120" fill="#e2e8f0" font-size="13">• Khối lượng vỏ: m = 84 kg</text>' +
        '<text x="392" y="144" fill="#e2e8f0" font-size="13">• Không khí ngoài: t = 27°C · p = 1 atm</text>' +
        '<text x="392" y="168" fill="#cbd5e1" font-size="13">• Khối lượng mol: M = 20·10⁻³ kg/mol</text>' +
        // Micro gas box
        '<rect x="392" y="186" width="250" height="106" rx="8" fill="#050811" stroke="#334155" stroke-width="1.4"/>' +
        '<text x="517" y="208" fill="#fbbf24" font-size="13" font-weight="700" text-anchor="middle">Chuyển động nhiệt phân tử (T = 300 K)</text>' +
        '<g class="ambient-gas-a"><circle cx="430" cy="238" r="5" fill="#38bdf8"/><circle cx="515" cy="262" r="5" fill="#10b981"/><circle cx="595" cy="234" r="5" fill="#fbbf24"/></g>' +
        '<g class="ambient-gas-b"><circle cx="468" cy="268" r="5" fill="#fbbf24"/><circle cx="556" cy="240" r="5" fill="#38bdf8"/><circle cx="614" cy="272" r="5" fill="#10b981"/></g>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-atom', this.caption) + svg + '</div></div>';
    }
  },

    'MH-C2-27': {
    id: 'MH-C2-27',
    title: 'Thí nghiệm kiểm chứng Định luật Boyle (V - p)',
    topic: 'DS-C2.1',
    layout: 'single',
    caption: 'Sơ đồ bộ thí nghiệm khảo sát mối liên hệ giữa áp suất và thể tích ở nhiệt độ không đổi',
    alt: 'Bộ thí nghiệm gồm áp kế nối thông xilanh, cảm biến nhiệt độ cắm đầu dò vào lòng khí, pít-tông và tay quay',
    build: function (u) {
      // TUÂN THỦ QUY TẮC CỦA THẦY:
      // - Đường ống từ xilanh lên áp kế PHẢI THÔNG NHAU LIỀN MẠCH đúng như trong tài liệu Word.
      // - Cảm biến nhiệt độ phải có đầu dò que đo (probe) cắm rõ ràng vào lòng khí xilanh.
      var svg =
        '<svg viewBox="0 0 700 340" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><linearGradient id="' + u + 'gas" x1="0%" y1="0%" x2="100%" y2="0%">' +
        '<stop offset="0%" stop-color="rgba(56,189,248,0.28)"/><stop offset="100%" stop-color="rgba(14,165,233,0.12)"/>' +
        '</linearGradient></defs>' +
        '<rect x="16" y="16" width="668" height="308" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Áp kế đo áp suất (trên bên trái)
        '<g transform="translate(110,82)">' +
        '<circle cx="0" cy="0" r="38" fill="#f8fafc" stroke="#38bdf8" stroke-width="3"/>' +
        '<circle cx="0" cy="0" r="30" fill="#0f172a" stroke="#475569" stroke-width="1.5"/>' +
        '<line x1="0" y1="0" x2="18" y2="-15" stroke="#ef4444" stroke-width="2.6" stroke-linecap="round" class="ambient-needle"/>' +
        '<circle cx="0" cy="0" r="4" fill="#e2e8f0"/>' +
        '<text x="0" y="21" fill="#94a3b8" font-size="11" font-weight="700" text-anchor="middle">bar</text>' +
        '</g>' +
        '<polyline points="150,68 184,46 250,46" fill="none" stroke="#38bdf8" stroke-width="1.6"/>' +
        '<text x="188" y="40" fill="#7dd3fc" font-size="13.5" font-weight="800">Áp kế</text>' +
        // ═══ ĐƯỜNG ỐNG NỐI THÔNG KHÍ TỪ XILANH LÊN ĐẾ ÁP KẾ (LIỀN MẠCH, THÔNG NHAU) ═══
        // Lớp ngoài (thành ống)
        '<path d="M 110 120 L 110 216 L 165 216" fill="none" stroke="#94a3b8" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/>' +
        // Lớp trong (lòng khí thông suốt từ xilanh lên áp kế)
        '<path d="M 110 120 L 110 216 L 168 216" fill="none" stroke="rgba(56,189,248,0.35)" stroke-width="4.5" stroke-linejoin="round"/>' +
        // ═══ CẢM BIẾN NHIỆT ĐỘ CÓ QUE DÒ (PROBE) CẮM XUYÊN VÀO LÒNG KHÍ XILANH ═══
        // Hộp điện tử hiển thị 23.5°C
        '<rect x="220" y="80" width="112" height="42" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.8"/>' +
        '<text x="276" y="108" fill="#6ee7b7" font-size="17" font-weight="800" font-family="DM Mono,monospace" text-anchor="middle">23.5°C</text>' +
        // Dây dẫn và Que dò (probe) cắm xuyên vào đỉnh xilanh
        '<path d="M 276 122 L 276 168 L 276 195" fill="none" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/>' +
        '<circle cx="276" cy="195" r="3.5" fill="#10b981"/>' +
        '<polyline points="276,80 295,54 445,54" fill="none" stroke="#6ee7b7" stroke-width="1.6"/>' +
        '<text x="300" y="47" fill="#6ee7b7" font-size="13.5" font-weight="800">Cảm biến nhiệt độ (Que dò cắm vào khí)</text>' +
        // Khung giá đỡ đế xilanh
        '<rect x="145" y="280" width="380" height="16" rx="4" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>' +
        // Thân xilanh thủy tinh chia vạch
        '<rect x="165" y="168" width="320" height="106" rx="10" fill="rgba(15,23,42,0.8)" stroke="#94a3b8" stroke-width="3"/>' +
        '<rect x="167" y="170" width="180" height="102" rx="8" fill="url(#' + u + 'gas)"/>' +
        '<g class="ambient-gas-a"><circle cx="205" cy="204" r="3.5" fill="#38bdf8"/><circle cx="285" cy="238" r="3.5" fill="#38bdf8"/><circle cx="242" cy="245" r="3.5" fill="#7dd3fc"/></g>' +
        '<g class="ambient-gas-b"><circle cx="232" cy="196" r="3.5" fill="#38bdf8"/><circle cx="312" cy="208" r="3.5" fill="#7dd3fc"/><circle cx="195" cy="242" r="3.5" fill="#38bdf8"/></g>' +
        // Vạch chia thể tích trên xilanh
        '<line x1="205" y1="258" x2="205" y2="274" stroke="#cbd5e1" stroke-width="2"/>' +
        '<line x1="245" y1="258" x2="245" y2="274" stroke="#cbd5e1" stroke-width="2"/>' +
        '<line x1="285" y1="258" x2="285" y2="274" stroke="#cbd5e1" stroke-width="2"/>' +
        '<line x1="325" y1="258" x2="325" y2="274" stroke="#cbd5e1" stroke-width="2"/>' +
        '<line x1="365" y1="258" x2="365" y2="274" stroke="#cbd5e1" stroke-width="2"/>' +
        '<line x1="405" y1="258" x2="405" y2="274" stroke="#cbd5e1" stroke-width="2"/>' +
        // Pít-tông và Tay quay điều chỉnh
        '<g class="ambient-piston-x">' +
        '<rect x="342" y="170" width="18" height="102" rx="3" fill="#475569" stroke="#e2e8f0" stroke-width="1.6"/>' +
        '<line x1="360" y1="221" x2="578" y2="221" stroke="#cbd5e1" stroke-width="5"/>' +
        '<rect x="478" y="160" width="14" height="122" rx="3" fill="#334155" stroke="#94a3b8" stroke-width="1.4"/>' +
        '<path d="M 578 221 L 578 148 L 606 148" fill="none" stroke="#cbd5e1" stroke-width="5" stroke-linecap="round"/>' +
        '<rect x="598" y="136" width="22" height="24" rx="4" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5"/>' +
        '</g>' +
        // Nhãn Pít-tông, Xilanh, Tay quay
        '<polyline points="351,170 376,140 435,140" fill="none" stroke="#cbd5e1" stroke-width="1.5"/>' +
        '<text x="378" y="134" fill="#cbd5e1" font-size="13" font-weight="700">Pít-tông</text>' +
        '<polyline points="425,168 446,140 520,140" fill="none" stroke="#cbd5e1" stroke-width="1.5"/>' +
        '<text x="450" y="134" fill="#cbd5e1" font-size="13" font-weight="700">Xilanh</text>' +
        '<polyline points="606,160 626,160 626,188 560,188" fill="none" stroke="#38bdf8" stroke-width="1.5"/>' +
        '<text x="560" y="206" fill="#7dd3fc" font-size="13" font-weight="800">Tay quay</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-gauge-high', this.caption) + svg + '</div></div>';
    }
  },

    'MH-C2-28': {
    id: 'MH-C2-28',
    title: 'Thí nghiệm khảo sát áp suất p theo nhiệt độ tuyệt đối T',
    topic: 'DS-C2.1',
    layout: 'single',
    caption: 'Thí nghiệm đẳng tích: Bình thủy tinh chứa 1 lít khí nối với áp kế và nhiệt kế',
    alt: 'Bình cầu thủy tinh liền khối chứa 1 lít khí nhúng ngập trong cốc nước đun nóng, ống xuyên qua nút cao su nối kín vào áp kế',
    build: function (u) {
      // TUÂN THỦ QUY TẮC CỦA THẦY:
      // - Bình cầu và cổ bình phải THÔNG NHAU LIỀN MỘT KHỐI (không tách hình tròn với hình chữ nhật có vách ngăn).
      // - Nước trong cốc phải ngập sát 2 thành cốc (không để khoảng trắng hở 2 bên).
      // - Ống thủy tinh phải ĐÂM XUYÊN QUA nút cao su để lấy khí bên trong, và nối THÔNG TRỰC TIẾP vào đế áp kế.
      var svg =
        '<svg viewBox="0 0 680 350" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><linearGradient id="' + u + 'wb" x1="0%" y1="0%" x2="0%" y2="100%">' +
        '<stop offset="0%" stop-color="rgba(56,189,248,0.32)"/><stop offset="100%" stop-color="rgba(14,116,144,0.6)"/>' +
        '</linearGradient></defs>' +
        '<rect x="16" y="16" width="648" height="318" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Kiềng đun & Đèn cồn
        '<line x1="118" y1="264" x2="366" y2="264" stroke="#64748b" stroke-width="5"/>' +
        '<line x1="142" y1="266" x2="120" y2="318" stroke="#64748b" stroke-width="5"/>' +
        '<line x1="342" y1="266" x2="364" y2="318" stroke="#64748b" stroke-width="5"/>' +
        '<rect x="226" y="286" width="32" height="32" rx="3" fill="#475569"/>' +
        '<path d="M 242 264 C 230 278 232 288 242 288 C 252 288 254 278 242 264 Z" fill="#38bdf8" class="ambient-heat-arrow"/>' +
        '<path d="M 242 271 C 236 280 237 286 242 286 C 247 286 248 280 242 271 Z" fill="#f59e0b" class="ambient-heat-arrow"/>' +
        // Cốc đựng nước (khối nước NGẬP SÁT 2 THÀNH CỐC, không để khoảng trắng)
        '<path d="M 136 122 L 136 260 L 348 260 L 348 122" fill="none" stroke="#94a3b8" stroke-width="3"/>' +
        '<rect x="138" y="136" width="208" height="122" fill="url(#' + u + 'wb)" class="ambient-water-wave"/>' +
        // ═══ BÌNH CẦU THỦY TINH LIỀN KHỐI (Cổ bình thông mượt vào thân cầu) ═══
        // Đường bao liền mạch: Cổ bình rộng 26px (x: 235..261) lượn cong xuống thân cầu r=58 tâm (248, 186)
        '<path d="M 235 96 L 235 136 C 235 142 216 150 200 168 C 182 188 184 218 204 236 C 224 254 272 254 292 236 C 312 218 314 188 296 168 C 280 150 261 142 261 136 L 261 96 Z" fill="rgba(15,23,42,0.78)" stroke="#7dd3fc" stroke-width="2.5"/>' +
        '<g class="ambient-gas-a"><circle cx="230" cy="186" r="3.5" fill="#fbbf24"/><circle cx="268" cy="204" r="3.5" fill="#fbbf24"/></g>' +
        '<g class="ambient-gas-b"><circle cx="262" cy="176" r="3.5" fill="#38bdf8"/><circle cx="234" cy="214" r="3.5" fill="#38bdf8"/></g>' +
        '<text x="248" y="194" fill="#e2e8f0" font-size="13.5" font-weight="800" text-anchor="middle">Khí (1 lít)</text>' +
        // Nút cao su màu cam đậy kín miệng cổ bình
        '<rect x="233" y="86" width="30" height="16" rx="2" fill="#d97706" stroke="#b45309" stroke-width="1.5"/>' +
        // ═══ ỐNG DẪN ĐÂM XUYÊN NÚT CAO SU & NỐI THẲNG VÀO CUỐNG ÁP KẾ ═══
        // Lớp ngoài ống thủy tinh
        '<path d="M 248 120 L 248 54 L 444 54 L 444 214 L 524 214" fill="none" stroke="#94a3b8" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>' +
        // Lòng ống thông khí
        '<path d="M 248 120 L 248 54 L 444 54 L 444 214 L 526 214" fill="none" stroke="rgba(56,189,248,0.4)" stroke-width="3.5" stroke-linejoin="round"/>' +
        // Nhiệt kế cắm ngập sâu trong nước
        '<rect x="156" y="54" width="12" height="175" rx="6" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>' +
        '<rect x="159" y="92" width="6" height="130" fill="#ef4444"/>' +
        '<circle cx="162" cy="226" r="8" fill="#ef4444"/>' +
        // Áp kế đo áp suất (cuống nối trực tiếp với ống dẫn ở y=214)
        '<rect x="492" y="260" width="76" height="14" rx="3" fill="#475569"/>' +
        '<rect x="523" y="200" width="14" height="60" fill="#64748b" stroke="#334155" stroke-width="1.2"/>' +
        '<circle cx="530" cy="150" r="44" fill="#f8fafc" stroke="#38bdf8" stroke-width="3"/>' +
        '<circle cx="530" cy="150" r="35" fill="#0f172a" stroke="#475569" stroke-width="1.5"/>' +
        '<line x1="530" y1="150" x2="508" y2="128" stroke="#f59e0b" stroke-width="2.8" stroke-linecap="round" class="ambient-needle"/>' +
        '<circle cx="530" cy="150" r="4.5" fill="#e2e8f0"/>' +
        // Nhãn chỉ dẫn
        '<polyline points="156,66 128,48 88,48" fill="none" stroke="#fca5a5" stroke-width="1.6"/>' +
        '<text x="82" y="52" fill="#fca5a5" font-size="13.5" font-weight="800" text-anchor="end">Nhiệt kế</text>' +
        '<polyline points="138,178 92,178" fill="none" stroke="#38bdf8" stroke-width="1.6"/>' +
        '<text x="86" y="182" fill="#7dd3fc" font-size="13.5" font-weight="800" text-anchor="end">Nước</text>' +
        '<polyline points="292,216 320,240 375,240" fill="none" stroke="#7dd3fc" stroke-width="1.5"/>' +
        '<text x="378" y="244" fill="#7dd3fc" font-size="13" font-weight="700">Bình cầu khí</text>' +
        '<text x="530" y="92" fill="#fbbf24" font-size="14" font-weight="800" text-anchor="middle">Áp kế</text>' +
        '<text x="530" y="296" fill="#94a3b8" font-size="12.5" text-anchor="middle">Nút cao su bịt kín (V = const)</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-temperature-high', this.caption) + svg + '</div></div>';
    }
  },

    'MH-C2-29': {
    id: 'MH-C2-29',
    title: 'Thí nghiệm kiểm chứng phương trình trạng thái khí lý tưởng',
    topic: 'DS-C2.1',
    layout: 'single',
    caption: 'Bộ thí nghiệm đo đồng thời áp suất, thể tích và nhiệt độ (Chú ý nhận diện thiết bị (1) và (2))',
    alt: 'Bình tam giác có nút cao su cắm ống tiêm (1) đo V, ống nối sang áp kế đo p, và nhiệt kế (2) đo T trong nước',
    build: function (u) {
      // TUÂN THỦ QUY TẮC CỦA THẦY VÀ HÌNH ẢNH WORD ĐỐI CHIẾU:
      // - Ống dẫn sang áp kế PHẢI NỐI THÔNG TRỰC TIẾP với cổ bình tam giác (dưới nút cao su).
      // - Ống tiêm (1) cắm xuyên qua nút cao su, có cần pít-tông và vạch chia thể tích.
      // - Nhãn nhận diện thiết bị (1) và (2) rõ ràng.
      var svg =
        '<svg viewBox="0 0 680 360" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="16" y="16" width="648" height="328" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Chậu nước đun nóng
        '<path d="M 150 202 L 150 318 L 530 318 L 530 202" fill="none" stroke="#94a3b8" stroke-width="3"/>' +
        '<rect x="153" y="220" width="374" height="95" fill="rgba(14,165,233,0.3)" class="ambient-water-wave"/>' +
        '<text x="340" y="302" fill="#fca5a5" font-size="14.5" font-weight="800" text-anchor="middle">Nước đun nóng</text>' +
        // ═══ BÌNH TAM GIÁC (ERLENMEYER FLASK) CHỨA KHÍ ═══
        '<path d="M 318 164 L 318 206 L 268 274 Q 262 284 276 284 L 404 284 Q 418 284 412 274 L 362 206 L 362 164" fill="rgba(15,23,42,0.75)" stroke="#e2e8f0" stroke-width="2.5"/>' +
        '<g class="ambient-gas-a"><circle cx="322" cy="245" r="3.5" fill="#fbbf24"/><circle cx="356" cy="260" r="3.5" fill="#38bdf8"/></g>' +
        '<g class="ambient-gas-b"><circle cx="352" cy="236" r="3.5" fill="#fbbf24"/><circle cx="315" cy="264" r="3.5" fill="#38bdf8"/></g>' +
        // Nút cao su đen bịt kín cổ bình
        '<rect x="314" y="152" width="52" height="18" rx="3" fill="#1e293b" stroke="#64748b" stroke-width="1.6"/>' +
        // ═══ ĐƯỜNG ỐNG NỐI TỪ CỔ BÌNH TAM GIÁC SANG ÁP KẾ (THÔNG SUỐT) ═══
        // Lớp ngoài ống
        '<path d="M 318 186 L 210 186 L 210 156" fill="none" stroke="#94a3b8" stroke-width="6" stroke-linejoin="round"/>' +
        // Lòng ống thông khí
        '<path d="M 318 186 L 210 186 L 210 156" fill="none" stroke="rgba(56,189,248,0.4)" stroke-width="3" stroke-linejoin="round"/>' +
        // Áp kế tròn bên trái
        '<circle cx="210" cy="120" r="36" fill="#f8fafc" stroke="#38bdf8" stroke-width="2.6"/>' +
        '<circle cx="210" cy="120" r="28" fill="#0f172a" stroke="#475569" stroke-width="1.4"/>' +
        '<line x1="210" y1="120" x2="225" y2="104" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" class="ambient-needle"/>' +
        '<circle cx="210" cy="120" r="4" fill="#e2e8f0"/>' +
        '<polyline points="184,96 154,72 86,72" fill="none" stroke="#fbbf24" stroke-width="1.8"/>' +
        '<text x="80" y="76" fill="#fbbf24" font-size="14" font-weight="800" text-anchor="end">Áp kế</text>' +
        // ═══ THIẾT BỊ (1): ỐNG TIÊM Y TẾ CẮM XUYÊN QUA NÚT CAO SU ═══
        // Thân ống tiêm trong suốt
        '<rect x="330" y="58" width="20" height="94" rx="2" fill="rgba(248,250,252,0.15)" stroke="#e2e8f0" stroke-width="1.8"/>' +
        // Miệng trên ống tiêm (vành tai cầm)
        '<rect x="323" y="54" width="34" height="5" rx="2" fill="#cbd5e1"/>' +
        // Pít-tông cao su đen bên trong
        '<rect x="331" y="98" width="18" height="12" fill="#ef4444" rx="1"/>' +
        // Cần đẩy pít-tông kim loại nhô lên trên
        '<line x1="340" y1="28" x2="340" y2="98" stroke="#cbd5e1" stroke-width="3.5"/>' +
        // Tay cầm đẩy pít-tông
        '<rect x="326" y="24" width="28" height="6" rx="2" fill="#94a3b8"/>' +
        // Cuống kim ống tiêm đâm xuyên qua nút cao su vào bình
        '<rect x="338" y="152" width="4" height="24" fill="#94a3b8"/>' +
        // Vạch chia độ trên thân ống tiêm
        '<line x1="330" y1="75" x2="336" y2="75" stroke="#94a3b8" stroke-width="1"/>' +
        '<line x1="330" y1="88" x2="338" y2="88" stroke="#94a3b8" stroke-width="1.2"/>' +
        '<line x1="330" y1="102" x2="336" y2="102" stroke="#94a3b8" stroke-width="1"/>' +
        '<line x1="330" y1="116" x2="338" y2="116" stroke="#94a3b8" stroke-width="1.2"/>' +
        '<line x1="330" y1="130" x2="336" y2="130" stroke="#94a3b8" stroke-width="1"/>' +
        // Huy hiệu nhận diện Thiết bị (1)
        '<polyline points="350,82 396,50 420,50" fill="none" stroke="#10b981" stroke-width="2"/>' +
        '<circle cx="436" cy="50" r="16" fill="#064e3b" stroke="#10b981" stroke-width="2.2"/>' +
        '<text x="436" y="55" fill="#6ee7b7" font-size="15" font-weight="800" text-anchor="middle">1</text>' +
        // ═══ THIẾT BỊ (2): NHIỆT KẾ THỦY NGÂN CẮM TRONG NƯỚC ═══
        '<rect x="466" y="128" width="14" height="145" rx="7" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>' +
        '<rect x="470" y="162" width="6" height="104" fill="#ef4444"/>' +
        '<circle cx="473" cy="268" r="7" fill="#ef4444"/>' +
        // Huy hiệu nhận diện Thiết bị (2)
        '<polyline points="480,154 522,126 544,126" fill="none" stroke="#10b981" stroke-width="2"/>' +
        '<circle cx="560" cy="126" r="16" fill="#064e3b" stroke="#10b981" stroke-width="2.2"/>' +
        '<text x="560" y="131" fill="#6ee7b7" font-size="15" font-weight="800" text-anchor="middle">2</text>' +
        // Nhãn Bình chứa khí
        '<polyline points="354,228 456,88 648,88" fill="none" stroke="#fbbf24" stroke-width="1.6"/>' +
        '<circle cx="354" cy="228" r="3.5" fill="#fbbf24"/>' +
        '<text x="646" y="81" fill="#fbbf24" font-size="14" font-weight="800" text-anchor="end">Bình chứa khí</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-flask', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C2-30': {
    id: 'MH-C2-30',
    title: 'Thí nghiệm áp kế thủy ngân hình chữ U đo p(T)',
    topic: 'DS-C2.1',
    layout: 'single',
    caption: 'Bình A (3,5 lít) trong chậu nước B, đun bởi bếp R, nối áp kế thủy ngân chữ U hở đầu phải',
    alt: 'Bình chứa khí A đặt trong bình nước B có nhiệt kế T, điện trở đun R, máy khuấy 6V và ống dẫn nối áp kế thủy ngân chữ U đo Δh',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 365" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="16" y="16" width="668" height="333" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Water tank B
        '<rect x="64" y="160" width="236" height="150" fill="rgba(56,189,248,0.22)" stroke="#94a3b8" stroke-width="2.5"/>' +
        '<text x="46" y="236" fill="#7dd3fc" font-size="15" font-weight="800" text-anchor="end">B</text>' +
        // Flask A inside B
        '<circle cx="156" cy="236" r="56" fill="rgba(15,23,42,0.82)" stroke="#e2e8f0" stroke-width="2.2"/>' +
        '<rect x="142" y="140" width="28" height="44" fill="#1e293b" stroke="#e2e8f0" stroke-width="2"/>' +
        '<rect x="139" y="136" width="34" height="14" rx="2" fill="#475569"/>' +
        '<text x="156" y="242" fill="#e2e8f0" font-size="14" font-weight="800" text-anchor="middle">A (3,5 lít)</text>' +
        // Thermometer T
        '<rect x="148" y="96" width="7" height="110" rx="3" fill="#f8fafc" stroke="#64748b" stroke-width="1"/>' +
        '<rect x="150" y="114" width="3" height="88" fill="#ef4444"/>' +
        '<text x="138" y="108" fill="#fca5a5" font-size="14" font-weight="800" text-anchor="end">T</text>' +
        // Heater R & Stirrer 6V
        '<path d="M 226 285 Q 250 275 276 285 Q 250 295 226 285" fill="none" stroke="#f59e0b" stroke-width="4" class="ambient-heat-arrow"/>' +
        '<text x="252" y="272" fill="#fbbf24" font-size="13.5" font-weight="800" text-anchor="middle">R (~220V)</text>' +
        '<rect x="276" y="142" width="28" height="24" rx="3" fill="#475569" stroke="#94a3b8" stroke-width="1.4"/>' +
        '<line x1="290" y1="166" x2="290" y2="218" stroke="#cbd5e1" stroke-width="2"/>' +
        '<ellipse cx="290" cy="220" rx="14" ry="4" fill="#38bdf8" class="ambient-stirrer"/>' +
        '<text x="312" y="158" fill="#cbd5e1" font-size="13" font-weight="700">Khuấy 6V</text>' +
        // Connecting tube from A to U-manometer
        '<path d="M 162 136 L 162 76 L 406 76 L 406 164" fill="none" stroke="#94a3b8" stroke-width="6" stroke-linejoin="round"/>' +
        '<path d="M 162 136 L 162 76 L 406 76 L 406 164" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linejoin="round"/>' +
        // Manometer stand
        '<rect x="434" y="308" width="90" height="10" rx="2" fill="#38bdf8"/>' +
        '<rect x="474" y="96" width="12" height="212" fill="#64748b"/>' +
        '<rect x="382" y="156" width="52" height="130" rx="3" fill="#1e293b" stroke="#475569" stroke-width="1.4"/>' +
        '<rect x="520" y="54" width="60" height="232" rx="3" fill="#1e293b" stroke="#475569" stroke-width="1.4"/>' +
        // U-tube with Mercury (red/silver contrast)
        '<path d="M 406 164 L 406 296 Q 406 320 479 320 Q 548 320 548 296 L 548 68" fill="none" stroke="#cbd5e1" stroke-width="11" stroke-linecap="round"/>' +
        '<path d="M 406 232 L 406 296 Q 406 320 479 320 Q 548 320 548 296 L 548 122" fill="none" stroke="#ef4444" stroke-width="7"/>' +
        // Level guide & Δh bracket
        '<line x1="406" y1="232" x2="606" y2="232" stroke="#64748b" stroke-width="1.4" stroke-dasharray="4 3"/>' +
        '<line x1="548" y1="122" x2="606" y2="122" stroke="#64748b" stroke-width="1.4" stroke-dasharray="4 3"/>' +
        '<line x1="598" y1="122" x2="598" y2="232" stroke="#fbbf24" stroke-width="2.2"/>' +
        '<text x="610" y="182" fill="#fbbf24" font-size="14" font-weight="800">Δh</text>' +
        '<text x="548" y="44" fill="#7dd3fc" font-size="13" font-weight="800" text-anchor="middle">Thông p₀ = 760 mmHg</text>' +
        '<text x="392" y="236" fill="#cbd5e1" font-size="12.5" font-weight="700" text-anchor="end">0</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-flask-vial', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C2-31': {
    id: 'MH-C2-31',
    title: 'Nguyên lý hoạt động túi khí an toàn trên ô tô',
    topic: 'DS-C2.5',
    layout: 'single',
    caption: 'Cảm biến va chạm kích hoạt bộ kích nổ tạo khí N₂ bơm phồng túi khí 60 lít',
    alt: 'Sơ đồ hệ thống túi khí xe hơi gồm cảm biến va chạm, tín hiệu điều khiển tới bộ kích nổ tạo khí N2 và túi khí 60 lít có lỗ thoát khí',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 350" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="16" y="16" width="668" height="318" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // 1. Crash sensor box
        '<rect x="42" y="120" width="146" height="104" rx="10" fill="#0f172a" stroke="#ef4444" stroke-width="2"/>' +
        '<text x="115" y="148" fill="#fca5a5" font-size="13.5" font-weight="800" text-anchor="middle">Cảm biến va chạm</text>' +
        '<polygon points="90,176 112,162 108,176 138,166 116,192 120,178" fill="#f59e0b" class="ambient-heat-arrow"/>' +
        '<text x="115" y="210" fill="#cbd5e1" font-size="12.5" text-anchor="middle">Phát hiện xung lực</text>' +
        // Signal wire to Inflator
        '<line x1="188" y1="172" x2="256" y2="172" stroke="#f59e0b" stroke-width="3.5" class="ambient-wire-pulse"/>' +
        // 2. Inflator
        '<rect x="256" y="112" width="148" height="120" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>' +
        '<text x="330" y="140" fill="#fbbf24" font-size="13.5" font-weight="800" text-anchor="middle">Bộ phận kích nổ</text>' +
        '<rect x="282" y="156" width="96" height="34" rx="6" fill="#451a03" stroke="#f97316" stroke-width="1.5"/>' +
        '<text x="330" y="178" fill="#fde047" font-size="13" font-weight="800" text-anchor="middle">Sinh khí N₂</text>' +
        '<text x="330" y="216" fill="#cbd5e1" font-size="12.5" text-anchor="middle">t = 25°C</text>' +
        // Gas flow into Airbag
        '<line x1="404" y1="172" x2="452" y2="172" stroke="#38bdf8" stroke-width="4" class="ambient-wire-pulse"/>' +
        // 3. Inflated Airbag
        '<ellipse cx="556" cy="166" rx="104" ry="88" fill="rgba(56,189,248,0.16)" stroke="#38bdf8" stroke-width="3" class="ambient-balloon"/>' +
        '<text x="556" y="114" fill="#7dd3fc" font-size="14" font-weight="800" text-anchor="middle">Túi khí N₂</text>' +
        '<g class="ambient-gas-a"><circle cx="512" cy="146" r="4" fill="#38bdf8"/><circle cx="592" cy="184" r="4" fill="#10b981"/><circle cx="545" cy="212" r="4" fill="#38bdf8"/></g>' +
        '<g class="ambient-gas-b"><circle cx="585" cy="142" r="4" fill="#10b981"/><circle cx="520" cy="196" r="4" fill="#38bdf8"/><circle cx="556" cy="162" r="4" fill="#fbbf24"/></g>' +
        '<text x="556" y="168" fill="#e2e8f0" font-size="13" font-weight="700" text-anchor="middle">V ≈ 60 lít</text>' +
        '<text x="556" y="190" fill="#cbd5e1" font-size="13" font-weight="700" text-anchor="middle">p_max = 5 psi</text>' +
        // Exhaust vent arrows
        '<line x1="636" y1="226" x2="660" y2="246" stroke="#94a3b8" stroke-width="2" stroke-dasharray="3 3"/>' +
        '<text x="500" y="294" fill="#94a3b8" font-size="12.5" text-anchor="middle">Lỗ thoát khí giảm áp lực va chạm (1 psi ≈ 6,895 kPa)</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-car-burst', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C2-32': {
    id: 'MH-C2-32',
    title: 'Bóng đèn sợi đốt Wolfram chứa khí trơ',
    topic: 'DS-C2.4',
    layout: 'single',
    caption: 'Cấu tạo bóng đèn sợi đốt Wolfram chịu nhiệt chứa khí trơ ở áp suất thấp',
    alt: 'Bóng đèn sợi đốt gồm vỏ thủy tinh chịu nhiệt, sợi đốt Wolfram nóng sáng và khí trơ áp suất thấp bên trong',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 680 350" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="16" y="16" width="648" height="318" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Bulb glass outline (shifted left for ample right label room)
        '<path d="M 212 222 C 172 192 152 152 152 116 A 88 88 0 1 1 328 116 C 328 152 308 192 268 222 Z" fill="rgba(251,191,36,0.08)" stroke="#cbd5e1" stroke-width="2.6"/>' +
        // Screw base
        '<rect x="212" y="222" width="56" height="58" rx="4" fill="#475569" stroke="#94a3b8" stroke-width="2"/>' +
        '<line x1="212" y1="238" x2="268" y2="244" stroke="#94a3b8" stroke-width="2.5"/>' +
        '<line x1="212" y1="254" x2="268" y2="260" stroke="#94a3b8" stroke-width="2.5"/>' +
        '<path d="M 226 280 L 254 280 L 246 296 L 234 296 Z" fill="#1e293b" stroke="#64748b" stroke-width="1.5"/>' +
        // Lead wires & Tungsten filament
        '<polyline points="226,222 226,155 208,118" fill="none" stroke="#94a3b8" stroke-width="2.4"/>' +
        '<polyline points="254,222 254,155 272,118" fill="none" stroke="#94a3b8" stroke-width="2.4"/>' +
        '<path d="M 208 118 Q 216 102 224 118 Q 232 102 240 118 Q 248 102 256 118 Q 264 102 272 118" fill="none" stroke="#fbbf24" stroke-width="3.6" class="ambient-heat-arrow"/>' +
        // Inert gas molecules inside bulb
        '<g class="ambient-gas-a"><circle cx="190" cy="142" r="3.5" fill="#38bdf8"/><circle cx="290" cy="136" r="3.5" fill="#38bdf8"/></g>' +
        '<g class="ambient-gas-b"><circle cx="240" cy="74" r="3.5" fill="#7dd3fc"/><circle cx="240" cy="176" r="3.5" fill="#7dd3fc"/></g>' +
        // Leader lines & annotations
        '<polyline points="240,108 304,62 362,62" fill="none" stroke="#fbbf24" stroke-width="1.8"/>' +
        '<circle cx="240" cy="108" r="3.5" fill="#fbbf24"/>' +
        '<text x="370" y="67" fill="#fbbf24" font-size="14" font-weight="800">Sợi đốt Wolfram</text>' +
        '<text x="370" y="88" fill="#cbd5e1" font-size="13">T_nóng chảy ≈ 3422°C · t_sáng = 260°C</text>' +

        '<polyline points="326,128 362,128" fill="none" stroke="#cbd5e1" stroke-width="1.8"/>' +
        '<circle cx="326" cy="128" r="3.5" fill="#cbd5e1"/>' +
        '<text x="370" y="133" fill="#e2e8f0" font-size="14" font-weight="800">Vỏ thủy tinh chịu nhiệt</text>' +

        '<polyline points="290,136 362,188" fill="none" stroke="#38bdf8" stroke-width="1.6" stroke-dasharray="3 3"/>' +
        '<circle cx="290" cy="136" r="3.5" fill="#38bdf8"/>' +
        '<text x="370" y="186" fill="#7dd3fc" font-size="14" font-weight="800">Khí trơ áp suất thấp</text>' +
        '<text x="370" y="207" fill="#cbd5e1" font-size="13">Chống oxi hóa, quá trình đẳng tích</text>' +

        '<text x="340" y="324" fill="#94a3b8" font-size="13" text-anchor="middle">Khi đèn sáng: t₂ = 260°C, p₂ = 1 atm · Khi chưa sáng: t₁ = 26°C</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-regular fa-lightbulb', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C2-33': {
    id: 'MH-C2-33',
    title: 'Sơ đồ nguyên lý súng phun nước (Nguyên lý Pascal)',
    topic: 'DS-C2.3',
    layout: 'single',
    caption: 'Nguyên lý truyền áp suất chất lỏng trong súng phun nước (S₁ = 2,1 cm², S₂ = 0,09 cm²)',
    alt: 'Sơ đồ mặt cắt súng phun nước gồm khoang nước, pít-tông tiết diện 2,1 cm2, cò súng tác dụng lực 4,2 N và vòi phun 0,09 cm2',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 340" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><marker id="' + u + 'f" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
        '<path d="M 0 1 L 9 5 L 0 9 z" fill="#f59e0b"/></marker></defs>' +
        '<rect x="16" y="16" width="668" height="308" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Gun silhouette
        '<path d="M 100 72 L 446 72 L 458 106 L 446 122 L 376 138 L 362 214 L 212 214 L 172 302 L 96 302 L 122 200 Q 88 164 100 72 Z" fill="#1e293b" stroke="#cbd5e1" stroke-width="2.5" stroke-linejoin="round"/>' +
        // Water chamber (top + bottom cylinder connected on left)
        '<path d="M 138 90 L 442 90 L 442 114 L 176 114 L 176 146 L 230 146 L 230 198 L 138 198 Z" fill="rgba(56,189,248,0.42)" stroke="#38bdf8" stroke-width="1.8"/>' +
        '<text x="290" y="106" fill="#e2e8f0" font-size="13.5" font-weight="800" text-anchor="middle">Nước (ρ = 1,0 g/cm³)</text>' +
        // Moving Piston & Trigger inside lower slot
        '<rect x="232" y="144" width="114" height="58" rx="8" fill="#090e1a" stroke="#64748b" stroke-width="1.6"/>' +
        '<g class="ambient-piston-x">' +
        '<rect x="230" y="146" width="12" height="54" rx="2" fill="#e2e8f0"/>' +
        '<rect x="242" y="166" width="52" height="14" fill="#94a3b8"/>' +
        '<rect x="294" y="152" width="12" height="42" rx="3" fill="#f59e0b"/>' +
        '<line x1="338" y1="173" x2="312" y2="173" stroke="#f59e0b" stroke-width="3" marker-end="url(#' + u + 'f)"/>' +
        '</g>' +
        // Water stream from nozzle
        '<line x1="458" y1="102" x2="622" y2="102" stroke="#38bdf8" stroke-width="5" class="ambient-ray-glide"/>' +
        // Callouts
        '<polyline points="458,94 484,60 518,60" fill="none" stroke="#7dd3fc" stroke-width="1.6"/>' +
        '<text x="524" y="64" fill="#7dd3fc" font-size="13.5" font-weight="800">Vòi phun (0,09 cm²)</text>' +

        '<polyline points="236,202 236,256 256,256" fill="none" stroke="#fbbf24" stroke-width="1.6"/>' +
        '<text x="262" y="254" fill="#fbbf24" font-size="13.5" font-weight="800">Pít-tông (S = 2,1 cm²)</text>' +
        '<text x="262" y="274" fill="#cbd5e1" font-size="13">Dịch chuyển d = 2,2 cm</text>' +

        '<polyline points="300,194 364,228 440,228" fill="none" stroke="#6ee7b7" stroke-width="1.6"/>' +
        '<text x="446" y="226" fill="#6ee7b7" font-size="13.5" font-weight="800">Cò súng</text>' +
        '<text x="446" y="246" fill="#cbd5e1" font-size="13">Lực bóp F = 4,2 N</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-water', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C2-34': {
    id: 'MH-C2-34',
    title: 'Bình tích áp hai ngăn trong máy lọc nước',
    topic: 'DS-C2.3',
    layout: 'single',
    caption: 'Cấu tạo bình tích áp 12 lít gồm bóng chứa nước, bóng chứa khí nén (T = const) và rơ-le áp suất',
    alt: 'Bình tích áp hình trụ gồm ống nước vào có rơ-le áp suất, ống nước ra, ngăn bóng chứa nước phía trên và bóng chứa khí lí tưởng phía dưới',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 680 365" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="16" y="16" width="648" height="333" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Pipe & Relay at top
        '<path d="M 225 96 L 225 56 L 270 56" fill="none" stroke="#94a3b8" stroke-width="6"/>' +
        '<path d="M 225 56 L 225 32" fill="none" stroke="#94a3b8" stroke-width="6"/>' +
        '<rect x="270" y="44" width="38" height="24" rx="4" fill="#475569" stroke="#fbbf24" stroke-width="1.8"/>' +
        '<line x1="308" y1="56" x2="348" y2="56" stroke="#94a3b8" stroke-width="6"/>' +
        // Tank body
        '<rect x="118" y="96" width="214" height="226" rx="34" fill="#0f172a" stroke="#cbd5e1" stroke-width="3"/>' +
        // Water bladder (top)
        '<path d="M 130 130 Q 130 108 225 108 Q 320 108 320 130 L 320 226 Q 225 234 130 226 Z" fill="rgba(56,189,248,0.28)" stroke="#38bdf8" stroke-width="2" class="ambient-water-wave"/>' +
        '<text x="225" y="168" fill="#e2e8f0" font-size="14.5" font-weight="800" text-anchor="middle">Bóng chứa nước</text>' +
        '<text x="225" y="190" fill="#7dd3fc" font-size="13" text-anchor="middle">(Đóng bơm ở 6L · Ngắt ở 9L)</text>' +
        // Air bladder (bottom)
        '<path d="M 130 236 Q 225 244 320 236 L 320 288 Q 320 310 225 310 Q 130 310 130 288 Z" fill="rgba(245,158,11,0.16)" stroke="#f59e0b" stroke-width="2"/>' +
        '<g class="ambient-gas-a"><circle cx="164" cy="266" r="3.5" fill="#fbbf24"/><circle cx="282" cy="288" r="3.5" fill="#fbbf24"/></g>' +
        '<g class="ambient-gas-b"><circle cx="272" cy="256" r="3.5" fill="#fde047"/><circle cx="176" cy="292" r="3.5" fill="#fde047"/></g>' +
        '<text x="225" y="280" fill="#fbbf24" font-size="14" font-weight="800" text-anchor="middle">Bóng chứa khí</text>' +
        // Labels right & left
        '<text x="208" y="42" fill="#7dd3fc" font-size="13" font-weight="800" text-anchor="end">Ống nước ra ↑</text>' +
        '<text x="356" y="61" fill="#7dd3fc" font-size="13" font-weight="800">← Ống nước vào</text>' +
        '<polyline points="289,68 356,96 420,96" fill="none" stroke="#fbbf24" stroke-width="1.6"/>' +
        '<text x="426" y="101" fill="#fbbf24" font-size="13.5" font-weight="800">Rơ-le áp suất</text>' +
        // Spec box on right
        '<rect x="372" y="138" width="268" height="168" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>' +
        '<text x="506" y="164" fill="#38bdf8" font-size="14" font-weight="800" text-anchor="middle">Thông số bình tích áp</text>' +
        '<text x="390" y="192" fill="#e2e8f0" font-size="13">• Tổng thể tích bình: V = 12 lít</text>' +
        '<text x="390" y="216" fill="#e2e8f0" font-size="13">• Khi rỗng nước: p₀ = 120 kPa</text>' +
        '<text x="390" y="240" fill="#cbd5e1" font-size="13">• Ngắt máy khi V_nước = 9 lít</text>' +
        '<text x="390" y="264" fill="#cbd5e1" font-size="13">• Đóng lại khi V_nước giảm còn 6 lít</text>' +
        '<text x="390" y="288" fill="#6ee7b7" font-size="13" font-weight="700">• Quá trình đẳng nhiệt (T = const)</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-faucet-drip', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C2-35': {
    id: 'MH-C2-35',
    title: 'Cấu tạo & Nguyên lý hai kỳ của bơm tay xe đạp',
    topic: 'DS-C2.5',
    layout: 'single',
    caption: 'Chu kỳ bơm tay: Kéo pít-tông lên hút khí (van vào mở) và đẩy xuống nén khí (van ra mở)',
    alt: 'Sơ đồ 2 pha của bơm tay xe đạp: pha kéo lên hút khí qua van đầu vào và pha đẩy xuống 35 cm mở van đầu ra',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 355" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="16" y="16" width="668" height="323" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Left phase: Pull UP
        '<rect x="36" y="34" width="302" height="288" rx="10" fill="#0f172a" stroke="#0284c7" stroke-width="1.6"/>' +
        '<text x="187" y="58" fill="#38bdf8" font-size="14" font-weight="800" text-anchor="middle">1. Kéo tay bơm lên (h = 50 cm)</text>' +
        '<rect x="122" y="118" width="94" height="148" fill="#050811" stroke="#cbd5e1" stroke-width="2.5"/>' +
        '<rect x="130" y="76" width="78" height="12" rx="4" fill="#f97316"/>' +
        '<line x1="169" y1="88" x2="169" y2="146" stroke="#94a3b8" stroke-width="6"/>' +
        '<rect x="124" y="146" width="90" height="12" fill="#64748b"/>' +
        '<line x1="142" y1="158" x2="132" y2="174" stroke="#10b981" stroke-width="3"/>' + // open intake flap
        '<line x1="216" y1="226" x2="216" y2="254" stroke="#ef4444" stroke-width="3"/>' + // closed outlet valve
        '<path d="M 216 228 L 266 228 M 216 252 L 266 252" stroke="#cbd5e1" stroke-width="2.5"/>' +
        '<g class="ambient-gas-a"><circle cx="152" cy="198" r="4" fill="#38bdf8"/><circle cx="182" cy="226" r="4" fill="#38bdf8"/><circle cx="166" cy="244" r="4" fill="#38bdf8"/></g>' +
        '<text x="114" y="168" fill="#6ee7b7" font-size="12.5" font-weight="700" text-anchor="end">Van vào</text>' +
        '<text x="114" y="185" fill="#6ee7b7" font-size="12.5" font-weight="700" text-anchor="end">MỞ</text>' +
        '<text x="270" y="245" fill="#fca5a5" font-size="12.5" font-weight="700">Van ra</text>' +
        '<text x="270" y="262" fill="#fca5a5" font-size="12.5" font-weight="700">ĐÓNG</text>' +
        '<text x="187" y="300" fill="#cbd5e1" font-size="13" font-weight="700" text-anchor="middle">p₁ = 10⁵ Pa · t₁ = 27°C</text>' +

        // Right phase: Push DOWN
        '<rect x="362" y="34" width="302" height="288" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="1.6"/>' +
        '<text x="513" y="58" fill="#fbbf24" font-size="14" font-weight="800" text-anchor="middle">2. Đẩy pít-tông xuống (Δh = 35 cm)</text>' +
        '<rect x="448" y="118" width="94" height="148" fill="#050811" stroke="#cbd5e1" stroke-width="2.5"/>' +
        '<rect x="456" y="102" width="78" height="12" rx="4" fill="#f97316"/>' +
        '<line x1="495" y1="114" x2="495" y2="218" stroke="#94a3b8" stroke-width="6"/>' +
        '<rect x="450" y="218" width="90" height="12" fill="#64748b"/>' +
        '<line x1="542" y1="228" x2="558" y2="236" stroke="#10b981" stroke-width="3"/>' + // open outlet flap
        '<path d="M 542 228 L 598 228 M 542 252 L 598 252" stroke="#cbd5e1" stroke-width="2.5"/>' +
        '<line x1="554" y1="240" x2="626" y2="240" stroke="#38bdf8" stroke-width="3" class="ambient-ray-glide"/>' +
        '<g class="ambient-gas-b"><circle cx="476" cy="242" r="4" fill="#fbbf24"/><circle cx="514" cy="252" r="4" fill="#fbbf24"/></g>' +
        '<text x="410" y="218" fill="#fca5a5" font-size="12.5" font-weight="700" text-anchor="end">Van vào</text>' +
        '<text x="410" y="235" fill="#fca5a5" font-size="12.5" font-weight="700" text-anchor="end">ĐÓNG</text>' +
        '<text x="614" y="220" fill="#6ee7b7" font-size="12.5" font-weight="700" text-anchor="middle">Khí ra</text>' +
        '<text x="513" y="300" fill="#fde68a" font-size="13" font-weight="700" text-anchor="middle">Cột khí còn 15 cm · t₂ = 45°C</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-arrows-up-down', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C2-36': {
    id: 'MH-C2-36',
    title: 'Bơm bóng bay từ bình chứa khí Helium nén',
    topic: 'DS-C2.5',
    layout: 'single',
    caption: 'Bình nén Helium (6 lít · 5,00·10⁵ Pa) bơm sang các quả bóng (2,0 lít · 1,25·10⁵ Pa) ở nhiệt độ không đổi',
    alt: 'Bình chứa khí Helium dung tích 6 lít áp suất 5,00.10^5 Pa dẫn ống sang các quả bóng bay 2 lít áp suất 1,25.10^5 Pa',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 680 350" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="16" y="16" width="648" height="318" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Pink Helium Tank on left
        '<rect x="92" y="114" width="128" height="178" rx="22" fill="#be185d" stroke="#f472b6" stroke-width="2.5"/>' +
        '<rect x="138" y="88" width="36" height="28" rx="4" fill="#94a3b8"/>' +
        '<rect x="130" y="76" width="52" height="12" rx="3" fill="#10b981"/>' +
        '<text x="156" y="168" fill="#fff" font-size="15.5" font-weight="800" text-anchor="middle">BÌNH HELIUM</text>' +
        '<text x="156" y="198" fill="#fce7f3" font-size="13.5" font-weight="700" text-anchor="middle">V = 6,0 lít</text>' +
        '<text x="156" y="222" fill="#fce7f3" font-size="13.5" font-weight="700" text-anchor="middle">p = 5,00·10⁵ Pa</text>' +
        '<text x="156" y="256" fill="#fbcfe8" font-size="12.5" text-anchor="middle">Ngừng bơm khi</text>' +
        '<text x="156" y="274" fill="#fbcfe8" font-size="12.5" text-anchor="middle">p_bình = 1,25·10⁵ Pa</text>' +
        // Hose & Gas flow
        '<path d="M 174 102 L 266 102 L 266 202 L 352 202" fill="none" stroke="#38bdf8" stroke-width="4" stroke-linejoin="round" class="ambient-wire-pulse"/>' +
        // Floating Balloons on right
        '<g class="ambient-balloon">' +
        '<ellipse cx="412" cy="116" rx="36" ry="44" fill="#0284c7" stroke="#7dd3fc" stroke-width="2"/>' +
        '<ellipse cx="496" cy="96" rx="38" ry="46" fill="#f59e0b" stroke="#fde68a" stroke-width="2"/>' +
        '<ellipse cx="580" cy="122" rx="36" ry="44" fill="#10b981" stroke="#6ee7b7" stroke-width="2"/>' +
        '<text x="412" y="121" fill="#fff" font-size="13.5" font-weight="800" text-anchor="middle">He</text>' +
        '<text x="496" y="101" fill="#0f172a" font-size="13.5" font-weight="800" text-anchor="middle">He</text>' +
        '<text x="580" y="127" fill="#0f172a" font-size="13.5" font-weight="800" text-anchor="middle">He</text>' +
        '<line x1="412" y1="160" x2="430" y2="220" stroke="#94a3b8" stroke-width="1.6"/>' +
        '<line x1="496" y1="142" x2="496" y2="220" stroke="#94a3b8" stroke-width="1.6"/>' +
        '<line x1="580" y1="166" x2="554" y2="220" stroke="#94a3b8" stroke-width="1.6"/>' +
        '</g>' +
        // Info box bottom right
        '<rect x="336" y="220" width="302" height="84" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>' +
        '<text x="487" y="246" fill="#38bdf8" font-size="14" font-weight="800" text-anchor="middle">Mỗi quả bóng bay (T = const)</text>' +
        '<text x="487" y="269" fill="#e2e8f0" font-size="13.5" font-weight="700" text-anchor="middle">V₀ = 2,0 lít · p₀ = 1,25·10⁵ Pa</text>' +
        '<text x="487" y="291" fill="#cbd5e1" font-size="13" text-anchor="middle">Mục tiêu trường THPT Mỏ Trạng: 187 quả</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-wind', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C2-37': {
    id: 'MH-C2-37',
    title: 'Bộ thí nghiệm bơm khí kiểm chứng áp suất theo lượng khí',
    topic: 'DS-C2.1',
    layout: 'single',
    caption: 'Bơm thể tích V₁ = 0,6 lít với hai van k₁, k₂ nối vào bình V₂ = 5,0 lít gắn áp kế Bar và nhiệt kế 29,0°C',
    alt: 'Sơ đồ gồm ống bơm thể tích V1 có van một chiều k1, k2 nối bình chứa khí V2 = 5,0 lít, phía trên gắn áp kế Bar và nhiệt kế hiện số 29 độ C',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 350" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="16" y="16" width="668" height="318" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Pump V1 on left
        '<path d="M 46 184 L 106 184 L 106 146 L 234 146 M 46 218 L 106 218 L 106 256 L 234 256" fill="none" stroke="#cbd5e1" stroke-width="2.5"/>' +
        '<rect x="106" y="148" width="128" height="106" fill="rgba(56,189,248,0.08)"/>' +
        '<text x="170" y="206" fill="#e2e8f0" font-size="14" font-weight="800" text-anchor="middle">V₁ = 0,6 lít</text>' +
        // Container V2
        '<rect x="234" y="128" width="388" height="170" rx="6" fill="#0f172a" stroke="#e2e8f0" stroke-width="2.6"/>' +
        '<text x="428" y="220" fill="#7dd3fc" font-size="16" font-weight="800" text-anchor="middle">Bình chứa V₂ = 5,0 lít</text>' +
        // Valves k1, k2 drawn above rect so never hidden
        '<line x1="106" y1="176" x2="118" y2="212" stroke="#10b981" stroke-width="3"/>' +
        '<text x="98" y="138" fill="#6ee7b7" font-size="14" font-weight="800" text-anchor="middle">k₁</text>' +
        '<line x1="234" y1="176" x2="246" y2="212" stroke="#10b981" stroke-width="3"/>' +
        '<text x="218" y="138" fill="#6ee7b7" font-size="14" font-weight="800" text-anchor="middle">k₂</text>' +
        '<g class="ambient-gas-a"><circle cx="290" cy="172" r="3.5" fill="#38bdf8"/><circle cx="566" cy="256" r="3.5" fill="#38bdf8"/><circle cx="352" cy="264" r="3.5" fill="#7dd3fc"/></g>' +
        '<g class="ambient-gas-b"><circle cx="532" cy="166" r="3.5" fill="#7dd3fc"/><circle cx="322" cy="242" r="3.5" fill="#38bdf8"/><circle cx="480" cy="268" r="3.5" fill="#38bdf8"/></g>' +
        // Top Pressure Gauge (Bar)
        '<rect x="336" y="106" width="16" height="24" fill="#d97706"/>' +
        '<circle cx="344" cy="70" r="38" fill="#f8fafc" stroke="#38bdf8" stroke-width="2.6"/>' +
        '<circle cx="344" cy="70" r="30" fill="#0f172a"/>' +
        '<line x1="344" y1="70" x2="322" y2="76" stroke="#ef4444" stroke-width="2.6" stroke-linecap="round" class="ambient-needle"/>' +
        '<text x="344" y="90" fill="#94a3b8" font-size="11.5" font-weight="700" text-anchor="middle">Bar</text>' +
        '<text x="292" y="68" fill="#fbbf24" font-size="13.5" font-weight="800" text-anchor="end">Áp kế</text>' +
        // Top Digital Thermometer (29,0°C)
        '<line x1="518" y1="98" x2="518" y2="178" stroke="#94a3b8" stroke-width="3.5"/>' +
        '<rect x="492" y="42" width="66" height="58" rx="6" fill="#f59e0b" stroke="#fbbf24" stroke-width="1.8"/>' +
        '<rect x="500" y="54" width="50" height="28" rx="3" fill="#0f172a"/>' +
        '<text x="525" y="73" fill="#6ee7b7" font-size="13.5" font-weight="800" font-family="DM Mono,monospace" text-anchor="middle">29,0°C</text>' +
        '<text x="568" y="74" fill="#fbbf24" font-size="13.5" font-weight="800">Nhiệt kế (3)</text>' +
        '<text x="360" y="322" fill="#94a3b8" font-size="13" text-anchor="middle">Ban đầu áp kế chỉ 0 bar (p = p₀) · Bơm giữ nhiệt độ ổn định 29,0°C</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-compass', this.caption) + svg + '</div></div>';
    }
  },

'MH-C2-38': {
    id: 'MH-C2-38',
    title: 'Phong vũ biểu thủy ngân Torricelli',
    topic: 'DS-C2.3',
    layout: 'single',
    caption: 'Cấu tạo phong vũ biểu thủy ngân Torricelli đo áp suất khí quyển (p₀ = 760 mmHg)',
    alt: 'Sơ đồ phong vũ biểu thủy ngân gồm chậu Hg có màng đàn hồi, áp suất khí quyển p0 tác dụng lên mặt thoáng và cột thủy ngân trong ống kín',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 355" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs>' +
        '<linearGradient id="' + u + 'hg" x1="0%" y1="0%" x2="100%" y2="0%">' +
        '<stop offset="0%" stop-color="#64748b"/><stop offset="50%" stop-color="#cbd5e1"/><stop offset="100%" stop-color="#475569"/>' +
        '</linearGradient>' +
        '<marker id="' + u + 'dn" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
        '<path d="M 0 1 L 9 5 L 0 9 z" fill="#38bdf8"/></marker>' +
        '</defs>' +
        '<rect x="16" y="16" width="668" height="323" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Basin containing Hg
        '<path d="M 134 176 L 134 306 L 346 306 L 346 176" fill="none" stroke="#cbd5e1" stroke-width="3"/>' +
        '<rect x="137" y="216" width="206" height="87" fill="url(#' + u + 'hg)" opacity="0.88"/>' +
        '<text x="240" y="274" fill="#0f172a" font-size="16" font-weight="800" text-anchor="middle">Thủy ngân (Hg)</text>' +
        // Inverted glass tube (closed top)
        '<path d="M 222 250 L 222 60 A 18 18 0 0 1 258 60 L 258 250" fill="rgba(15,23,42,0.75)" stroke="#e2e8f0" stroke-width="2.5"/>' +
        // Mercury column inside tube
        '<rect x="224" y="96" width="32" height="120" fill="url(#' + u + 'hg)"/>' +
        '<ellipse cx="240" cy="96" rx="16" ry="3" fill="#38bdf8"/>' +
        // Vacuum/gas pocket at top
        '<rect x="224" y="60" width="32" height="36" fill="rgba(251,191,36,0.12)"/>' +
        // Atmospheric pressure arrow p0 on basin surface
        '<line x1="176" y1="158" x2="176" y2="208" stroke="#38bdf8" stroke-width="3" marker-end="url(#' + u + 'dn)" class="ambient-heat-arrow"/>' +
        '<text x="162" y="182" fill="#7dd3fc" font-size="15" font-weight="800" text-anchor="end">p₀</text>' +
        // Column height dimension line h
        '<line x1="258" y1="96" x2="296" y2="96" stroke="#fbbf24" stroke-width="1.4" stroke-dasharray="3 3"/>' +
        '<line x1="258" y1="216" x2="296" y2="216" stroke="#fbbf24" stroke-width="1.4" stroke-dasharray="3 3"/>' +
        '<line x1="288" y1="98" x2="288" y2="214" stroke="#fbbf24" stroke-width="2"/>' +
        '<text x="298" y="160" fill="#fbbf24" font-size="14" font-weight="800">h</text>' +
        // Callouts
        '<polyline points="240,68 188,52 138,52" fill="none" stroke="#e2e8f0" stroke-width="1.6"/>' +
        '<circle cx="240" cy="68" r="3" fill="#e2e8f0"/>' +
        '<text x="132" y="50" fill="#f8fafc" font-size="13.5" font-weight="800" text-anchor="end">Khoảng chân không</text>' +
        '<text x="132" y="69" fill="#94a3b8" font-size="12.5" text-anchor="end">(Hoặc khí lọt vào)</text>' +
        '<polyline points="258,96 346,68 380,68" fill="none" stroke="#38bdf8" stroke-width="1.6"/>' +
        '<circle cx="258" cy="96" r="3.5" fill="#38bdf8"/>' +
        '<rect x="380" y="42" width="280" height="72" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.4"/>' +
        '<text x="394" y="66" fill="#7dd3fc" font-size="13.5" font-weight="800">Lớp nước / màng đàn hồi</text>' +
        '<text x="394" y="87" fill="#cbd5e1" font-size="12.5">Ngăn hơi thủy ngân bay lên,</text>' +
        '<text x="394" y="105" fill="#cbd5e1" font-size="12.5">phía trên là vùng chân không (p ≈ 0).</text>' +
        // Info box on bottom right
        '<rect x="380" y="136" width="280" height="162" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>' +
        '<text x="520" y="164" fill="#fbbf24" font-size="14" font-weight="800" text-anchor="middle">Nguyên lý Torricelli (1643)</text>' +
        '<text x="396" y="192" fill="#e2e8f0" font-size="13">• Ống dài 80–90 cm (800–900 mm)</text>' +
        '<text x="396" y="216" fill="#e2e8f0" font-size="13">• Chuẩn khí quyển: p₀ = 760 mmHg</text>' +
        '<text x="396" y="242" fill="#fde68a" font-size="13">• Nếu khí lọt vào trên đầu ống:</text>' +
        '<text x="406" y="264" fill="#cbd5e1" font-size="13">p₀ = p_cột Hg + p_khí lọt</text>' +
        '<text x="406" y="285" fill="#6ee7b7" font-size="12.5" font-weight="700">Nhiệt độ không đổi (Đẳng nhiệt)</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-ruler-vertical', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C2-39': {
    id: 'MH-C2-39',
    title: 'Ống thủy tinh úp ngược nhúng trong chậu nước',
    topic: 'DS-C2.6',
    layout: 'single',
    caption: 'So sánh hai trạng thái: Hình (a) đầu kín ngang mặt thoáng và Hình (b) kéo ống lên trên mặt nước 30 cm',
    alt: 'Hai chậu nước hình a và hình b minh họa ống thủy tinh trụ úp ngược nhúng thẳng đứng vào nước với cột khí h0 = 20 cm và độ chênh mực nước x',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 365" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="16" y="16" width="668" height="333" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Panel A (left)
        '<rect x="34" y="32" width="306" height="300" rx="10" fill="#0f172a" stroke="#0284c7" stroke-width="1.6"/>' +
        '<text x="187" y="56" fill="#38bdf8" font-size="14" font-weight="800" text-anchor="middle">Hình (a): Đầu kín ngang mặt nước</text>' +
        '<path d="M 74 114 L 84 282 Q 187 288 290 282 L 300 114" fill="none" stroke="#94a3b8" stroke-width="2.5"/>' +
        '<path d="M 78 156 L 296 156 L 290 282 Q 187 288 84 282 Z" fill="rgba(56,189,248,0.28)" class="ambient-water-wave"/>' +
        // Inverted tube A: closed top at y=156 (level with water surface)
        '<path d="M 164 268 L 164 166 A 20 20 0 0 1 204 166 L 204 268 Z" fill="rgba(15,23,42,0.85)" stroke="#e2e8f0" stroke-width="2.2"/>' +
        '<rect x="166" y="216" width="36" height="50" fill="rgba(2,132,199,0.72)"/>' +
        '<g class="ambient-gas-a"><circle cx="178" cy="184" r="3" fill="#fbbf24"/><circle cx="192" cy="198" r="3" fill="#38bdf8"/></g>' +
        // h0 dimension
        '<line x1="138" y1="156" x2="158" y2="156" stroke="#fbbf24" stroke-width="1.5"/>' +
        '<line x1="138" y1="216" x2="158" y2="216" stroke="#fbbf24" stroke-width="1.5"/>' +
        '<line x1="146" y1="156" x2="146" y2="216" stroke="#fbbf24" stroke-width="2"/>' +
        '<text x="132" y="191" fill="#fbbf24" font-size="13.5" font-weight="800" text-anchor="end">h₀ = 20 cm</text>' +
        '<text x="187" y="314" fill="#cbd5e1" font-size="13" font-weight="700" text-anchor="middle">t_a = 27°C · p₀ = 9,8·10⁴ Pa</text>' +

        // Panel B (right)
        '<rect x="360" y="32" width="306" height="300" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="1.6"/>' +
        '<text x="513" y="56" fill="#fbbf24" font-size="14" font-weight="800" text-anchor="middle">Hình (b): Kéo phần nhô lên 30 cm</text>' +
        '<path d="M 400 132 L 410 282 Q 513 288 616 282 L 626 132" fill="none" stroke="#94a3b8" stroke-width="2.5"/>' +
        '<path d="M 404 176 L 622 176 L 616 282 Q 513 288 410 282 Z" fill="rgba(56,189,248,0.28)" class="ambient-water-wave"/>' +
        // Inverted tube B: raised 30 cm above y=176 -> top around y=82
        '<path d="M 492 222 L 492 94 A 20 20 0 0 1 532 94 L 532 222 Z" fill="rgba(15,23,42,0.85)" stroke="#e2e8f0" stroke-width="2.2"/>' +
        '<rect x="494" y="148" width="36" height="72" fill="rgba(2,132,199,0.72)"/>' +
        '<g class="ambient-gas-b"><circle cx="506" cy="116" r="3" fill="#fbbf24"/><circle cx="520" cy="132" r="3" fill="#38bdf8"/></g>' +
        // 30 cm dimension on right of tube
        '<line x1="538" y1="78" x2="558" y2="78" stroke="#6ee7b7" stroke-width="1.5"/>' +
        '<line x1="538" y1="176" x2="558" y2="176" stroke="#6ee7b7" stroke-width="1.5"/>' +
        '<line x1="550" y1="78" x2="550" y2="176" stroke="#6ee7b7" stroke-width="2"/>' +
        '<text x="560" y="132" fill="#6ee7b7" font-size="13.5" font-weight="800">30 cm</text>' +
        // x dimension on left of tube (water rise inside)
        '<line x1="464" y1="148" x2="486" y2="148" stroke="#fbbf24" stroke-width="1.5"/>' +
        '<line x1="464" y1="176" x2="486" y2="176" stroke="#fbbf24" stroke-width="1.5"/>' +
        '<line x1="472" y1="148" x2="472" y2="176" stroke="#fbbf24" stroke-width="2"/>' +
        '<text x="458" y="167" fill="#fbbf24" font-size="14" font-weight="800" text-anchor="end">x</text>' +
        '<text x="513" y="314" fill="#cbd5e1" font-size="13" font-weight="700" text-anchor="middle">d = 10⁴ N/m³ (Khí lý tưởng)</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-flask', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C2-40': {
    id: 'MH-C2-40',
    title: 'Nguyên lý bơm & xả khí của máy đo huyết áp điện tử',
    topic: 'DS-C2.3',
    layout: 'single',
    caption: 'Chu trình bơm (120 → 380 cm³) và xả chậm của vòng bít máy đo huyết áp (T = const = 27°C)',
    alt: 'Sơ đồ máy đo huyết áp điện tử hiển thị 118 trên 78 mmHg nối ống dẫn khí với vòng bít cánh tay ở trạng thái tâm thu và tâm trương',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 350" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="16" y="16" width="668" height="318" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Arm & inflatable cuff on left
        '<path d="M 60 154 L 306 154 Q 328 154 328 184 Q 328 214 306 214 L 60 214" fill="#78350f" opacity="0.48" stroke="#d97706" stroke-width="2"/>' +
        '<rect x="116" y="134" width="134" height="100" rx="14" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>' +
        '<rect x="128" y="144" width="110" height="80" rx="8" fill="rgba(56,189,248,0.18)" stroke="#0284c7" stroke-width="1.4" class="ambient-lung"/>' +
        '<text x="183" y="180" fill="#7dd3fc" font-size="13.5" font-weight="800" text-anchor="middle">Vòng bít</text>' +
        '<text x="183" y="200" fill="#cbd5e1" font-size="12.5" text-anchor="middle">t = 27°C (T = const)</text>' +
        '<text x="183" y="260" fill="#e2e8f0" font-size="13" font-weight="700" text-anchor="middle">Δp: 0 → 160 mmHg</text>' +
        '<text x="183" y="280" fill="#94a3b8" font-size="13" text-anchor="middle">V: 120 cm³ → 380 cm³</text>' +
        // Connecting air hose with pulse
        '<path d="M 250 184 L 386 184" fill="none" stroke="#38bdf8" stroke-width="5" class="ambient-wire-pulse"/>' +
        '<text x="318" y="168" fill="#fbbf24" font-size="12.5" font-weight="700" text-anchor="middle">Q = 30 cm³/s</text>' +
        // Electronic BP Monitor body on right
        '<rect x="386" y="54" width="268" height="242" rx="18" fill="#1e293b" stroke="#64748b" stroke-width="2.5"/>' +
        '<rect x="412" y="76" width="216" height="148" rx="10" fill="#0b1120" stroke="#38bdf8" stroke-width="1.6"/>' +
        '<text x="428" y="102" fill="#94a3b8" font-size="12.5" font-weight="700">SYS (Tâm thu)</text>' +
        '<text x="612" y="110" fill="#6ee7b7" font-size="24" font-family="DM Mono,monospace" font-weight="800" text-anchor="end">118</text>' +
        '<text x="428" y="148" fill="#94a3b8" font-size="12.5" font-weight="700">DIA (Tâm trương)</text>' +
        '<text x="612" y="156" fill="#38bdf8" font-size="24" font-family="DM Mono,monospace" font-weight="800" text-anchor="end">78</text>' +
        '<line x1="426" y1="176" x2="614" y2="176" stroke="#1e293b" stroke-width="1.4"/>' +
        '<text x="520" y="202" fill="#fbbf24" font-size="13" font-family="DM Mono,monospace" font-weight="700" text-anchor="middle">p₀ = 760 mmHg (101 325 Pa)</text>' +
        // Start button on monitor
        '<circle cx="520" cy="258" r="22" fill="#0284c7" stroke="#7dd3fc" stroke-width="2"/>' +
        '<text x="520" y="263" fill="#fff" font-size="12" font-weight="800" text-anchor="middle">START</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-heart-pulse', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C2-41': {
    id: 'MH-C2-41',
    title: 'Bình khí Oxygen nén y tế & Cung cấp cho phổi bệnh nhân',
    topic: 'DS-C2.5',
    layout: 'single',
    caption: 'Bình O₂ nén (18 kg · 15 MPa · 27°C) truyền qua van điều áp cấp khí cho phổi người bệnh (5,7 → 6,0 lít · 37°C)',
    alt: 'Sơ đồ bình oxy nén y tế 15 MPa mở van cấp khí qua mặt nạ thở cho phổi bệnh nhân giãn từ 5,7 lên 6,0 lít',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 355" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="16" y="16" width="668" height="323" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Medical O2 tank on left
        '<rect x="64" y="102" width="128" height="196" rx="28" fill="#065f46" stroke="#34d399" stroke-width="2.5"/>' +
        '<rect x="108" y="72" width="40" height="32" rx="4" fill="#94a3b8"/>' +
        '<circle cx="152" cy="78" r="18" fill="#f8fafc" stroke="#38bdf8" stroke-width="2"/>' +
        '<line x1="152" y1="78" x2="162" y2="68" stroke="#ef4444" stroke-width="2.2" class="ambient-needle"/>' +
        '<text x="128" y="156" fill="#fff" font-size="17" font-weight="800" text-anchor="middle">BÌNH O₂ Y TẾ</text>' +
        '<text x="128" y="186" fill="#d1fae5" font-size="13.5" font-weight="700" text-anchor="middle">p₁ = 15 MPa</text>' +
        '<text x="128" y="210" fill="#d1fae5" font-size="13.5" font-weight="700" text-anchor="middle">t = 27°C (300 K)</text>' +
        '<text x="128" y="236" fill="#a7f3d0" font-size="13" text-anchor="middle">M_tổng = 18 kg</text>' +
        '<text x="128" y="264" fill="#fde68a" font-size="12.5" text-anchor="middle">Khi xả còn 11 MPa:</text>' +
        '<text x="128" y="282" fill="#fde68a" font-size="12.5" font-weight="700" text-anchor="middle">còn 17,3 kg</text>' +
        // Pipe & Flow valve
        '<path d="M 170 78 L 320 78 L 320 144 L 408 144" fill="none" stroke="#34d399" stroke-width="4" stroke-linejoin="round" class="ambient-wire-pulse"/>' +
        '<rect x="256" y="60" width="90" height="36" rx="6" fill="#0f172a" stroke="#fbbf24" stroke-width="1.6"/>' +
        '<text x="301" y="83" fill="#fbbf24" font-size="13" font-weight="800" text-anchor="middle">Van xả O₂</text>' +
        // Lungs schematic on right
        '<rect x="408" y="54" width="248" height="248" rx="12" fill="#0f172a" stroke="#334155" stroke-width="1.6"/>' +
        '<text x="532" y="82" fill="#38bdf8" font-size="14.5" font-weight="800" text-anchor="middle">Phổi người bệnh</text>' +
        '<g class="ambient-lung">' +
        '<path d="M 526 100 L 526 130 M 526 130 L 502 150 M 526 130 L 550 150" stroke="#94a3b8" stroke-width="4" fill="none"/>' +
        '<path d="M 518 124 C 468 124 446 184 468 214 C 482 224 514 212 520 184 Z" fill="rgba(56,189,248,0.28)" stroke="#38bdf8" stroke-width="2"/>' +
        '<path d="M 534 124 C 584 124 606 184 584 214 C 570 224 538 212 532 184 Z" fill="rgba(56,189,248,0.28)" stroke="#38bdf8" stroke-width="2"/>' +
        '</g>' +
        '<text x="532" y="246" fill="#e2e8f0" font-size="13.5" font-weight="700" text-anchor="middle">V: 5,7 lít → 6,0 lít</text>' +
        '<text x="532" y="268" fill="#7dd3fc" font-size="13" text-anchor="middle">p = 101 kPa · t = 37°C</text>' +
        '<text x="532" y="288" fill="#6ee7b7" font-size="13" font-weight="700" text-anchor="middle">Tỉ lệ O₂ trong phổi: 21%</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-lungs', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C2-42': {
    id: 'MH-C2-42',
    title: 'Bệnh giảm áp & Sự giãn nở bọt khí Nitrogen khi thợ lặn nổi lên',
    topic: 'DS-C2.3',
    layout: 'single',
    caption: 'Bọt khí Nitrogen giãn nở khi thợ lặn từ độ sâu 30 m nổi lên mặt nước (p = p₀ + ρgh)',
    alt: 'Cột nước biển từ mặt thoáng 0 m xuống độ sâu 30 m minh họa bọt khí nhỏ dưới đáy giãn to dần khi nổi lên mặt nước',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 360" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><linearGradient id="' + u + 'sea" x1="0%" y1="0%" x2="0%" y2="100%">' +
        '<stop offset="0%" stop-color="#0ea5e9" stop-opacity="0.32"/><stop offset="100%" stop-color="#0f172a" stop-opacity="0.92"/>' +
        '</linearGradient></defs>' +
        '<rect x="16" y="16" width="668" height="328" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        '<rect x="108" y="76" width="546" height="248" rx="8" fill="url(#' + u + 'sea)" stroke="#0284c7" stroke-width="1.5"/>' +
        // Water surface wave
        '<path d="M 108 76 Q 176 68 244 76 T 380 76 T 516 76 T 654 76" fill="none" stroke="#7dd3fc" stroke-width="2.5" class="ambient-water-wave"/>' +
        '<text x="380" y="54" fill="#7dd3fc" font-size="14" font-weight="800" text-anchor="middle">Mặt nước (h = 0 m): p₀ = 1,013·10⁵ Pa</text>' +
        // Depth scale on left
        '<line x1="84" y1="76" x2="84" y2="300" stroke="#94a3b8" stroke-width="2"/>' +
        '<line x1="76" y1="76" x2="92" y2="76" stroke="#7dd3fc" stroke-width="2"/>' +
        '<text x="68" y="81" fill="#7dd3fc" font-size="13" font-weight="800" text-anchor="end">0 m</text>' +
        '<line x1="76" y1="188" x2="92" y2="188" stroke="#94a3b8" stroke-width="1.8"/>' +
        '<text x="68" y="193" fill="#cbd5e1" font-size="13" font-weight="700" text-anchor="end">15 m</text>' +
        '<line x1="76" y1="300" x2="92" y2="300" stroke="#fbbf24" stroke-width="2"/>' +
        '<text x="68" y="305" fill="#fbbf24" font-size="13.5" font-weight="800" text-anchor="end">30 m</text>' +
        // Diver silhouette at 30 m
        '<g transform="translate(150,278)">' +
        '<ellipse cx="32" cy="12" rx="28" ry="11" fill="#334155" stroke="#fbbf24" stroke-width="1.8"/>' +
        '<circle cx="62" cy="12" r="9" fill="#0f172a" stroke="#38bdf8" stroke-width="1.8"/>' +
        '<rect x="14" y="-2" width="26" height="8" rx="4" fill="#f59e0b"/>' +
        '</g>' +
        '<text x="200" y="256" fill="#fde68a" font-size="13" font-weight="700" text-anchor="middle">Thợ lặn ở độ sâu 30 m</text>' +
        // Expanding N2 bubbles rising
        '<g class="ambient-bubble-up">' +
        '<circle cx="288" cy="276" r="6" fill="rgba(255,255,255,0.22)" stroke="#7dd3fc" stroke-width="1.8"/>' +
        '<circle cx="298" cy="204" r="11" fill="rgba(255,255,255,0.22)" stroke="#38bdf8" stroke-width="2"/>' +
        '<circle cx="286" cy="112" r="19" fill="rgba(255,255,255,0.25)" stroke="#fbbf24" stroke-width="2.2"/>' +
        '</g>' +
        '<polyline points="308,112 346,112" fill="none" stroke="#fbbf24" stroke-width="1.6"/>' +
        '<text x="354" y="117" fill="#fbbf24" font-size="13.5" font-weight="800">Bọt khí N₂ nở to khi p giảm</text>' +
        // Parameters box bottom right
        '<rect x="356" y="166" width="276" height="136" rx="10" fill="rgba(15,23,42,0.9)" stroke="#334155" stroke-width="1.5"/>' +
        '<text x="494" y="192" fill="#38bdf8" font-size="13.5" font-weight="800" text-anchor="middle">Thông số môi trường nước</text>' +
        '<text x="372" y="218" fill="#e2e8f0" font-size="13">• Độ sâu ban đầu: h = 30 m</text>' +
        '<text x="372" y="242" fill="#e2e8f0" font-size="13">• ρ = 1000 kg/m³ · g = 9,8 m/s²</text>' +
        '<text x="372" y="266" fill="#cbd5e1" font-size="13">• Nhiệt độ xem như không đổi</text>' +
        '<text x="372" y="289" fill="#fca5a5" font-size="12.5" font-weight="700">Nổi quá nhanh → Nguy cơ tắc mạch!</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-water', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C2-43': {
    id: 'MH-C2-43',
    title: 'Người nhái sửa chữa tàu biển với bình khí nén 150 atm',
    topic: 'DS-C2.3',
    layout: 'single',
    caption: 'Người nhái sửa tàu ở độ sâu 5 m: bình 150 atm (ngưỡng an toàn ≥ 30 atm) & bọt khí hình cầu nổi lên',
    alt: 'Sơ đồ người nhái đeo bình khí nén 150 atm sửa chữa thân tàu ở độ sâu 5 m dưới mặt biển và bọt khí hình cầu bán kính r0 nổi lên',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 355" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="16" y="16" width="668" height="323" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Ocean background
        '<rect x="34" y="76" width="632" height="248" rx="8" fill="rgba(14,165,233,0.16)" stroke="#0284c7" stroke-width="1.5"/>' +
        '<path d="M 34 76 Q 114 68 194 76 T 354 76 T 514 76 T 666 76" fill="none" stroke="#7dd3fc" stroke-width="2.5" class="ambient-water-wave"/>' +
        // Ship hull on top left extending down 5 m
        '<path d="M 48 44 L 222 44 L 184 218 L 48 218 Z" fill="#1e293b" stroke="#94a3b8" stroke-width="2.2"/>' +
        '<text x="454" y="54" fill="#7dd3fc" font-size="13.5" font-weight="800" text-anchor="middle">Mặt biển: p_khí quyển = 9,5 m nước biển</text>' +
        '<circle cx="190" cy="196" r="10" fill="#ef4444" opacity="0.7" class="ambient-heat-arrow"/>' +
        '<text x="118" y="148" fill="#cbd5e1" font-size="13.5" font-weight="800" text-anchor="middle">Thân tàu</text>' +
        '<text x="118" y="170" fill="#fca5a5" font-size="12.5" font-weight="700" text-anchor="middle">Chỗ hỏng (-5 m)</text>' +
        // Depth 5 m marker
        '<line x1="230" y1="76" x2="230" y2="218" stroke="#fbbf24" stroke-width="1.8" stroke-dasharray="4 3"/>' +
        '<text x="238" y="152" fill="#fbbf24" font-size="13.5" font-weight="800">5 m</text>' +
        // Diver working near hull
        '<g transform="translate(216,216)">' +
        '<ellipse cx="32" cy="14" rx="26" ry="10" fill="#334155" stroke="#38bdf8" stroke-width="1.8"/>' +
        '<rect x="16" y="-2" width="28" height="9" rx="4" fill="#f59e0b"/>' +
        '<circle cx="6" cy="12" r="8" fill="#0f172a" stroke="#38bdf8" stroke-width="1.8"/>' +
        '</g>' +
        // Rising spherical bubbles
        '<g class="ambient-bubble-up">' +
        '<circle cx="292" cy="196" r="7" fill="rgba(255,255,255,0.22)" stroke="#7dd3fc" stroke-width="1.8"/>' +
        '<circle cx="300" cy="134" r="10" fill="rgba(255,255,255,0.24)" stroke="#38bdf8" stroke-width="2"/>' +
        '<circle cx="292" cy="96" r="12" fill="rgba(255,255,255,0.26)" stroke="#fbbf24" stroke-width="2"/>' +
        '</g>' +
        '<text x="310" y="102" fill="#fde68a" font-size="13" font-weight="700">Bọt cầu</text>' +
        '<text x="310" y="120" fill="#fde68a" font-size="13" font-weight="700">r₀ → r₁</text>' +
        // Right summary panel
        '<rect x="382" y="102" width="268" height="196" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>' +
        '<text x="516" y="130" fill="#fbbf24" font-size="14" font-weight="800" text-anchor="middle">Nhật ký lặn &amp; Khí nén</text>' +
        '<text x="398" y="158" fill="#e2e8f0" font-size="13">• Áp suất đầu bình: 150 atm</text>' +
        '<text x="398" y="182" fill="#e2e8f0" font-size="13">• Sau 8 phút tìm kiếm: giảm 20%</text>' +
        '<text x="398" y="206" fill="#cbd5e1" font-size="13">• Khi sửa: tiêu thụ gấp 1,5 lần</text>' +
        '<text x="398" y="230" fill="#fca5a5" font-size="13" font-weight="700">• Ngưỡng an toàn: p ≥ 30 atm</text>' +
        '<text x="398" y="256" fill="#6ee7b7" font-size="13">• Coi T không đổi suốt quá trình</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-ship', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C2-44': {
    id: 'MH-C2-44',
    title: 'Xilanh thẳng đứng cao 152 cm chứa khí lý tưởng và thủy ngân',
    topic: 'DS-C2.6',
    layout: 'single',
    caption: 'Xilanh cao 152 cm có pít-tông nhẹ: Trạng thái ban đầu (76 cm khí + 76 cm Hg) và sau khi nung nóng (114 cm khí + 38 cm Hg)',
    alt: 'Hai xilanh thẳng đứng cao 152 cm so sánh cột khí 76 cm và 76 cm thủy ngân ban đầu với 114 cm khí và 38 cm thủy ngân sau khi tăng nhiệt độ',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 355" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><marker id="' + u + 'ar" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
        '<path d="M 0 1 L 9 5 L 0 9 z" fill="#f59e0b"/></marker></defs>' +
        '<rect x="16" y="16" width="668" height="323" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Left State 1
        '<text x="194" y="48" fill="#38bdf8" font-size="14" font-weight="800" text-anchor="middle">Trạng thái ban đầu (T₁ = 600 K)</text>' +
        '<path d="M 134 72 L 134 292 L 254 292 L 254 72" fill="none" stroke="#e2e8f0" stroke-width="3.5"/>' +
        // Hg top 76 cm (y=74..176)
        '<rect x="137" y="74" width="114" height="102" fill="#94a3b8"/>' +
        '<text x="194" y="130" fill="#0f172a" font-size="16" font-weight="800" text-anchor="middle">Hg</text>' +
        // Light piston
        '<rect x="137" y="176" width="114" height="12" fill="#f59e0b"/>' +
        // Gas bottom 76 cm (y=188..289)
        '<rect x="137" y="188" width="114" height="101" fill="rgba(56,189,248,0.18)"/>' +
        '<g class="ambient-gas-a"><circle cx="164" cy="220" r="3.5" fill="#38bdf8"/><circle cx="222" cy="256" r="3.5" fill="#fbbf24"/></g>' +
        '<g class="ambient-gas-b"><circle cx="216" cy="212" r="3.5" fill="#fbbf24"/><circle cx="168" cy="264" r="3.5" fill="#38bdf8"/></g>' +
        '<text x="194" y="244" fill="#e2e8f0" font-size="13.5" font-weight="800" text-anchor="middle">Khí (p₁, T₁)</text>' +
        // Left dimension arrows
        '<line x1="118" y1="74" x2="118" y2="176" stroke="#cbd5e1" stroke-width="1.8"/>' +
        '<text x="110" y="130" fill="#cbd5e1" font-size="13.5" font-weight="800" text-anchor="end">76 cm</text>' +
        '<line x1="118" y1="188" x2="118" y2="290" stroke="#7dd3fc" stroke-width="1.8"/>' +
        '<text x="110" y="244" fill="#7dd3fc" font-size="13.5" font-weight="800" text-anchor="end">76 cm</text>' +

        // Transition arrow
        '<line x1="286" y1="182" x2="386" y2="182" stroke="#f59e0b" stroke-width="3" marker-end="url(#' + u + 'ar)"/>' +
        '<text x="336" y="166" fill="#fbbf24" font-size="13.5" font-weight="800" text-anchor="middle">Tăng T dần</text>' +
        '<text x="336" y="206" fill="#cbd5e1" font-size="12.5" text-anchor="middle">½ Hg tràn ra</text>' +

        // Right State 2
        '<text x="514" y="48" fill="#fbbf24" font-size="14" font-weight="800" text-anchor="middle">Trạng thái sau (p₀ = 76 cmHg)</text>' +
        '<path d="M 454 72 L 454 292 L 574 292 L 574 72" fill="none" stroke="#e2e8f0" stroke-width="3.5"/>' +
        // Hg top 38 cm (y=74..125)
        '<rect x="457" y="74" width="114" height="51" fill="#94a3b8"/>' +
        '<text x="514" y="105" fill="#0f172a" font-size="15.5" font-weight="800" text-anchor="middle">Hg</text>' +
        // Light piston moved up
        '<rect x="457" y="125" width="114" height="12" fill="#f59e0b"/>' +
        // Gas bottom 114 cm (y=137..289)
        '<rect x="457" y="137" width="114" height="152" fill="rgba(56,189,248,0.18)"/>' +
        '<g class="ambient-gas-a"><circle cx="484" cy="176" r="3.5" fill="#38bdf8"/><circle cx="542" cy="242" r="3.5" fill="#fbbf24"/></g>' +
        '<g class="ambient-gas-b"><circle cx="536" cy="172" r="3.5" fill="#fbbf24"/><circle cx="486" cy="252" r="3.5" fill="#38bdf8"/></g>' +
        '<text x="514" y="218" fill="#e2e8f0" font-size="13.5" font-weight="800" text-anchor="middle">Khí giãn nở</text>' +
        // Right dimension arrows
        '<line x1="438" y1="74" x2="438" y2="125" stroke="#cbd5e1" stroke-width="1.8"/>' +
        '<text x="430" y="105" fill="#cbd5e1" font-size="13.5" font-weight="800" text-anchor="end">38 cm</text>' +
        '<line x1="438" y1="137" x2="438" y2="290" stroke="#7dd3fc" stroke-width="1.8"/>' +
        '<text x="430" y="218" fill="#7dd3fc" font-size="13.5" font-weight="800" text-anchor="end">114 cm</text>' +
        '<text x="350" y="324" fill="#94a3b8" font-size="13" text-anchor="middle">Tổng chiều cao xilanh = 152 cm · Pít-tông nhẹ không ma sát</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-arrows-up-to-line', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C2-45': {
    id: 'MH-C2-45',
    title: 'Xilanh chứa khí Hydro dưới pít-tông và cột chất lỏng',
    topic: 'DS-C2.6',
    layout: 'single',
    caption: 'Khí Hydro (2V) dưới pít-tông nhẹ nâng cột chất lỏng (V, áp suất phụ p₀/9) nhận nhiệt Q = 119 J tới khi chất lỏng tràn hết',
    alt: 'Xilanh thẳng đứng mở miệng trên chịu áp suất p0 gồm phần trống V, cột chất lỏng V, pít-tông và buồng khí Hydro 2V nhận nhiệt Q = 119 J',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 680 355" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="16" y="16" width="648" height="323" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Cylinder on left
        '<path d="M 138 54 L 138 276 L 326 276 L 326 54" fill="none" stroke="#e2e8f0" stroke-width="3.5"/>' +
        // Top atmospheric open gap (V)
        '<text x="232" y="84" fill="#7dd3fc" font-size="13.5" font-weight="800" text-anchor="middle">p₀ = 10⁵ N/m² (Phần V)</text>' +
        // Liquid column (V)
        '<rect x="141" y="96" width="182" height="58" fill="rgba(148,163,184,0.45)" stroke="#94a3b8" stroke-width="1.5" class="ambient-water-wave"/>' +
        '<text x="232" y="130" fill="#f8fafc" font-size="13.5" font-weight="800" text-anchor="middle">Chất lỏng (V · p₀/9)</text>' +
        // Hatched Piston
        '<rect x="141" y="154" width="182" height="14" fill="#f59e0b" stroke="#fbbf24" stroke-width="1"/>' +
        // Hydrogen chamber (2V)
        '<rect x="141" y="168" width="182" height="105" fill="rgba(56,189,248,0.16)"/>' +
        '<g class="ambient-gas-a"><circle cx="176" cy="198" r="3.5" fill="#38bdf8"/><circle cx="282" cy="242" r="3.5" fill="#fbbf24"/></g>' +
        '<g class="ambient-gas-b"><circle cx="278" cy="196" r="3.5" fill="#fbbf24"/><circle cx="178" cy="246" r="3.5" fill="#38bdf8"/></g>' +
        '<text x="232" y="226" fill="#e2e8f0" font-size="16" font-weight="800" text-anchor="middle">Hydro (2V)</text>' +
        // Heat arrows below cylinder
        '<path d="M 192 312 L 192 286 M 232 312 L 232 286 M 272 312 L 272 286" stroke="#ef4444" stroke-width="3" class="ambient-heat-arrow"/>' +
        '<text x="232" y="330" fill="#fca5a5" font-size="13.5" font-weight="800" text-anchor="middle">Cấp nhiệt chậm Q = 119 J</text>' +
        // Right thermodynamic stages box
        '<rect x="358" y="64" width="280" height="222" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>' +
        '<text x="498" y="92" fill="#fbbf24" font-size="14" font-weight="800" text-anchor="middle">Phân tích quá trình biến đổi</text>' +
        '<text x="376" y="122" fill="#e2e8f0" font-size="13">• Trạng thái đầu: V₁ = 2V · p₁ = p₀ + p₀/9</text>' +
        '<text x="376" y="148" fill="#7dd3fc" font-size="13" font-weight="700">• Giai đoạn 1 (2V → 3V): Đẳng áp</text>' +
        '<text x="386" y="168" fill="#cbd5e1" font-size="12.5">Chất lỏng dâng tới miệng ống.</text>' +
        '<text x="376" y="194" fill="#fde68a" font-size="13" font-weight="700">• Giai đoạn 2 (3V → 4V): Tràn chất lỏng</text>' +
        '<text x="386" y="214" fill="#cbd5e1" font-size="12.5">Áp suất p giảm tuyến tính từ 10p₀/9 → p₀.</text>' +
        '<text x="376" y="242" fill="#6ee7b7" font-size="13">• Nội năng H₂: U = (5/2)·nRT</text>' +
        '<text x="376" y="266" fill="#cbd5e1" font-size="12.5">p₀ = 10⁵ N/m² · Bỏ qua mọi ma sát</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-fire', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C2-46': {
    id: 'MH-C2-46',
    title: 'Nguyên lý giác hơi điều trị cổ truyền',
    topic: 'DS-C2.4',
    layout: 'single',
    caption: 'Cơ chế tạo lực hút của lọ giác hơi: Hơ nóng đến 353°C rồi úp kín lên da để nguội về 27°C',
    alt: 'Hai giai đoạn của lọ giác hơi: hơ nóng khí trong lọ ở 353 độ C với áp suất p0, sau đó úp kín miệng S = 28 cm2 lên da khi nguội xuống 27 độ C',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 350" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><marker id="' + u + 'ar" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
        '<path d="M 0 1 L 9 5 L 0 9 z" fill="#38bdf8"/></marker></defs>' +
        '<rect x="16" y="16" width="668" height="318" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Stage 1 left
        '<rect x="36" y="34" width="298" height="282" rx="10" fill="#0f172a" stroke="#ef4444" stroke-width="1.6"/>' +
        '<text x="185" y="58" fill="#fca5a5" font-size="14" font-weight="800" text-anchor="middle">1. Hơ nóng & Lúc vừa úp (t = 353°C)</text>' +
        '<path d="M 142 208 C 122 182 122 108 158 92 Q 185 82 212 92 C 248 108 248 182 228 208 Z" fill="rgba(239,68,68,0.16)" stroke="#e2e8f0" stroke-width="2.5"/>' +
        '<ellipse cx="185" cy="176" rx="10" ry="18" fill="#f59e0b" class="ambient-heat-arrow"/>' +
        '<line x1="120" y1="218" x2="250" y2="218" stroke="#d97706" stroke-width="4" stroke-linecap="round"/>' +
        '<text x="185" y="250" fill="#fde68a" font-size="13.5" font-weight="700" text-anchor="middle">p₁ = p₀ = 1,0·10⁵ Pa</text>' +
        '<text x="185" y="274" fill="#cbd5e1" font-size="13" text-anchor="middle">Diện tích miệng lọ: S = 28,0 cm²</text>' +
        '<text x="185" y="296" fill="#94a3b8" font-size="12.5" text-anchor="middle">Không khí nóng nở ra trước khi úp</text>' +

        // Transition arrow
        '<line x1="338" y1="168" x2="362" y2="168" stroke="#38bdf8" stroke-width="3" marker-end="url(#' + u + 'ar)"/>' +

        // Stage 2 right
        '<rect x="366" y="34" width="298" height="282" rx="10" fill="#0f172a" stroke="#38bdf8" stroke-width="1.6"/>' +
        '<text x="515" y="58" fill="#7dd3fc" font-size="14" font-weight="800" text-anchor="middle">2. Nguội về môi trường (t₀ = 27°C)</text>' +
        '<path d="M 472 214 C 452 182 452 108 488 92 Q 515 82 542 92 C 578 108 578 182 558 214 Z" fill="rgba(56,189,248,0.14)" stroke="#e2e8f0" stroke-width="2.5"/>' +
        '<path d="M 450 218 L 474 218 Q 515 198 556 218 L 580 218" fill="rgba(239,68,68,0.22)" stroke="#f59e0b" stroke-width="3.5"/>' +
        '<line x1="515" y1="202" x2="515" y2="168" stroke="#38bdf8" stroke-width="2.6" marker-end="url(#' + u + 'ar)" class="ambient-heat-arrow"/>' +
        '<text x="515" y="148" fill="#7dd3fc" font-size="13" font-weight="800" text-anchor="middle">Lực hút F = Δp·S</text>' +
        '<text x="515" y="252" fill="#e2e8f0" font-size="13" font-weight="700" text-anchor="middle">Áp suất trong giảm: p &lt; p₀</text>' +
        '<text x="515" y="274" fill="#cbd5e1" font-size="12.5" text-anchor="middle">• Bỏ qua phồng da: V = const</text>' +
        '<text x="515" y="296" fill="#fde68a" font-size="12.5" text-anchor="middle">• Thực tế da phồng: V giảm 10%</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-notes-medical', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C2-48': {
    id: 'MH-C2-48',
    title: 'Hệ thống khí nén đẩy nước dằn giúp tàu ngầm nổi lên',
    topic: 'DS-C2.5',
    layout: 'single',
    caption: 'Tàu ngầm ở độ sâu 120 m mở bình khí nén (60 lít · 10 MPa · 27°C) đẩy nước biển khỏi thùng dằn (T₂ = 2°C)',
    alt: 'Mặt cắt tàu ngầm nghiên cứu biển ở độ sâu 120 m dùng bình khí nén 60 lít áp suất 10 MPa đẩy nước ra khỏi thùng chứa giữa hai lớp vỏ',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 355" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><marker id="' + u + 'out" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
        '<path d="M 0 1 L 9 5 L 0 9 z" fill="#38bdf8"/></marker></defs>' +
        '<rect x="16" y="16" width="668" height="323" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        '<rect x="34" y="68" width="632" height="258" rx="8" fill="rgba(14,116,144,0.2)" stroke="#0284c7" stroke-width="1.5"/>' +
        '<path d="M 34 68 Q 114 60 194 68 T 354 68 T 514 68 T 666 68" fill="none" stroke="#7dd3fc" stroke-width="2.5" class="ambient-water-wave"/>' +
        '<text x="350" y="48" fill="#7dd3fc" font-size="13.5" font-weight="800" text-anchor="middle">Mặt biển (p₀ = 1,013·10⁵ Pa · ρ = 1030 kg/m³ · g = 9,81 m/s²)</text>' +
        // Depth ruler
        '<line x1="68" y1="68" x2="68" y2="210" stroke="#fbbf24" stroke-width="2" stroke-dasharray="4 3"/>' +
        '<text x="78" y="144" fill="#fbbf24" font-size="13.5" font-weight="800">h = 120 m</text>' +
        // Submarine hull cutaway
        '<g class="ambient-balloon">' +
        '<path d="M 156 174 C 156 138 224 134 328 134 L 468 134 C 522 134 552 152 552 174 C 552 196 522 214 468 214 L 224 214 C 176 214 156 196 156 174 Z" fill="#1e293b" stroke="#cbd5e1" stroke-width="2.5"/>' +
        '<path d="M 304 134 L 314 102 L 360 102 L 368 134 Z" fill="#334155" stroke="#cbd5e1" stroke-width="2"/>' +
        // Air bottle inside sub
        '<rect x="218" y="152" width="76" height="34" rx="10" fill="#f59e0b" stroke="#fde68a" stroke-width="1.5"/>' +
        '<text x="256" y="174" fill="#0f172a" font-size="12.5" font-weight="800" text-anchor="middle">60L · 10MPa</text>' +
        // Ballast tank between double hull
        '<rect x="332" y="152" width="174" height="52" rx="6" fill="rgba(56,189,248,0.28)" stroke="#38bdf8" stroke-width="1.6"/>' +
        '<text x="419" y="182" fill="#e2e8f0" font-size="12.5" font-weight="800" text-anchor="middle">Thùng dằn (Khí đẩy nước)</text>' +
        '<line x1="294" y1="168" x2="332" y2="168" stroke="#fbbf24" stroke-width="3" class="ambient-wire-pulse"/>' +
        // Water expelled downwards
        '<line x1="419" y1="204" x2="419" y2="238" stroke="#38bdf8" stroke-width="3" marker-end="url(#' + u + 'out)" class="ambient-heat-arrow"/>' +
        '</g>' +
        // Parameters strip at bottom
        '<rect x="54" y="252" width="592" height="60" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.4"/>' +
        '<text x="350" y="276" fill="#fde68a" font-size="13.5" font-weight="800" text-anchor="middle">Trạng thái khí nén: V₁ = 60 lít · p₁ = 10 MPa · t₁ = 27°C → Giãn nở đến t₂ = 2°C</text>' +
        '<text x="350" y="298" fill="#cbd5e1" font-size="13" text-anchor="middle">Lượng nước bị đẩy ra ngoài bằng thể tích khí dãn thêm (V₂ − V₁) ở áp suất độ sâu 120 m</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-submarine', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C2-49': {
    id: 'MH-C2-49',
    title: 'Mô hình phổi trong hệ hô hấp (Chai nhựa – Bóng bay – Màng cao su)',
    topic: 'DS-C2.3',
    layout: 'single',
    caption: 'Thí nghiệm mô phỏng cơ chế hít vào và thở ra nhờ chênh lệch áp suất trong khoang chai (T ≈ const)',
    alt: 'Mô hình hai trạng thái của phổi tự tạo bằng chai nhựa 1,5 lít, 2 ống hút nối 2 quả bóng bay và màng cao su cơ hoành ở đáy chai',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 360" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><marker id="' + u + 'in" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
        '<path d="M 0 1 L 9 5 L 0 9 z" fill="#10b981"/></marker>' +
        '<marker id="' + u + 'pull" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
        '<path d="M 0 1 L 9 5 L 0 9 z" fill="#f59e0b"/></marker></defs>' +
        '<rect x="16" y="16" width="668" height="328" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Left: Normal / Exhale (released diaphragm)
        '<rect x="34" y="32" width="306" height="296" rx="10" fill="#0f172a" stroke="#64748b" stroke-width="1.5"/>' +
        '<text x="187" y="56" fill="#cbd5e1" font-size="14" font-weight="800" text-anchor="middle">1. Thả tay (Thở ra / Cân bằng)</text>' +
        // Bottle outline
        '<path d="M 168 78 L 206 78 L 206 98 L 238 122 L 238 258 L 136 258 L 136 122 L 168 98 Z" fill="rgba(56,189,248,0.06)" stroke="#cbd5e1" stroke-width="2.4"/>' +
        '<rect x="166" y="74" width="42" height="14" rx="3" fill="#38bdf8"/>' +
        // Straws & small deflated balloons
        '<path d="M 187 70 L 187 124 L 168 150 M 187 124 L 206 150" fill="none" stroke="#e2e8f0" stroke-width="3"/>' +
        '<ellipse cx="164" cy="176" rx="16" ry="28" fill="#ef4444" opacity="0.85"/>' +
        '<ellipse cx="210" cy="176" rx="16" ry="28" fill="#ef4444" opacity="0.85"/>' +
        // Flat rubber membrane
        '<path d="M 136 258 Q 187 262 238 258" fill="none" stroke="#f59e0b" stroke-width="5"/>' +
        '<text x="187" y="294" fill="#cbd5e1" font-size="13" text-anchor="middle">Thể tích chai giảm → p_chai tăng</text>' +
        '<text x="187" y="314" fill="#94a3b8" font-size="12.5" text-anchor="middle">Khí bị đẩy ra ngoài qua ống hút</text>' +

        // Right: Pull diaphragm down (Inhale)
        '<rect x="360" y="32" width="306" height="296" rx="10" fill="#0f172a" stroke="#10b981" stroke-width="1.6"/>' +
        '<text x="513" y="56" fill="#6ee7b7" font-size="14" font-weight="800" text-anchor="middle">2. Kéo chậm màng đáy (Hít vào)</text>' +
        // Air rushing in arrow at top
        '<line x1="513" y1="62" x2="513" y2="82" stroke="#10b981" stroke-width="2.5" marker-end="url(#' + u + 'in)"/>' +
        // Bottle outline
        '<path d="M 494 84 L 532 84 L 532 104 L 564 128 L 564 252 L 462 252 L 462 128 L 494 104 Z" fill="rgba(56,189,248,0.08)" stroke="#cbd5e1" stroke-width="2.4"/>' +
        '<rect x="492" y="80" width="42" height="14" rx="3" fill="#38bdf8"/>' +
        '<path d="M 513 78 L 513 128 L 492 152 M 513 128 L 534 152" fill="none" stroke="#e2e8f0" stroke-width="3"/>' +
        // Expanded balloons (ambient lung pulse)
        '<g class="ambient-lung">' +
        '<ellipse cx="489" cy="186" rx="23" ry="38" fill="#ef4444" stroke="#fca5a5" stroke-width="1.8"/>' +
        '<ellipse cx="537" cy="186" rx="23" ry="38" fill="#ef4444" stroke="#fca5a5" stroke-width="1.8"/>' +
        '</g>' +
        // Pulled down diaphragm
        '<path d="M 462 252 Q 513 292 564 252" fill="rgba(245,158,11,0.16)" stroke="#f59e0b" stroke-width="5"/>' +
        '<line x1="513" y1="276" x2="513" y2="294" stroke="#f59e0b" stroke-width="2.5" marker-end="url(#' + u + 'pull)"/>' +
        '<text x="634" y="274" fill="#fbbf24" font-size="12.5" font-weight="800" text-anchor="end">Cơ hoành</text>' +
        '<text x="513" y="314" fill="#a7f3d0" font-size="13" font-weight="700" text-anchor="middle">p_chai &lt; p_ngoài → Bóng phình to</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-lungs-virus', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C2-50': {
    id: 'MH-C2-50',
    title: 'Áp suất khí trong lốp xe ô tô vượt sa mạc',
    topic: 'DS-C2.4',
    layout: 'single',
    caption: 'Ô tô 4 bánh vượt sa mạc: Đẳng tích khi nhiệt độ tăng từ 5,0°C sáng sớm lên 42°C giữa trưa',
    alt: 'Sơ đồ ô tô 4 bánh trên sa mạc kèm mặt cắt phân tử khí va chạm vào thành lốp xe thể tích 1,2 m3 tăng nhiệt độ từ 5 độ C lên 42 độ C',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 350" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="16" y="16" width="668" height="318" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Left: Desert SUV profile
        '<rect x="36" y="36" width="326" height="278" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>' +
        '<circle cx="294" cy="86" r="24" fill="#fbbf24" class="ambient-heat-arrow"/>' +
        '<text x="160" y="64" fill="#fde68a" font-size="14" font-weight="800" text-anchor="middle">Sa mạc (5,0°C → 42°C)</text>' +
        // Sand dune line
        '<path d="M 38 250 Q 120 236 200 248 T 360 244 L 360 310 L 38 310 Z" fill="#78350f" opacity="0.5"/>' +
        // 4x4 SUV outline
        '<path d="M 76 218 L 84 186 L 138 182 L 166 154 L 284 154 L 306 184 L 312 218 Z" fill="#1e293b" stroke="#cbd5e1" stroke-width="2.4"/>' +
        '<rect x="168" y="162" width="44" height="22" rx="3" fill="#0284c7" opacity="0.65"/>' +
        '<rect x="220" y="162" width="52" height="22" rx="3" fill="#0284c7" opacity="0.65"/>' +
        '<circle cx="128" cy="222" r="26" fill="#0f172a" stroke="#94a3b8" stroke-width="6"/>' +
        '<circle cx="128" cy="222" r="11" fill="#64748b"/>' +
        '<circle cx="268" cy="222" r="26" fill="#0f172a" stroke="#94a3b8" stroke-width="6"/>' +
        '<circle cx="268" cy="222" r="11" fill="#64748b"/>' +
        '<text x="199" y="284" fill="#e2e8f0" font-size="13.5" font-weight="800" text-anchor="middle">Mỗi lốp: V = 1,2 m³ · p₀ = 2,5 bar</text>' +
        '<text x="199" y="302" fill="#94a3b8" font-size="12.5" text-anchor="middle">(4 lốp giống nhau · 1 bar = 10⁵ Pa)</text>' +

        // Right: Magnified tire cross-section with thermal collisions
        '<rect x="380" y="36" width="284" height="278" rx="10" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>' +
        '<text x="522" y="62" fill="#38bdf8" font-size="14" font-weight="800" text-anchor="middle">Chuyển động nhiệt trong lốp</text>' +
        '<circle cx="522" cy="158" r="76" fill="#050811" stroke="#64748b" stroke-width="16"/>' +
        '<circle cx="522" cy="158" r="32" fill="#1e293b" stroke="#94a3b8" stroke-width="3"/>' +
        '<g class="ambient-gas-a"><circle cx="468" cy="134" r="4" fill="#fbbf24"/><circle cx="574" cy="176" r="4" fill="#38bdf8"/><circle cx="508" cy="212" r="4" fill="#fbbf24"/></g>' +
        '<g class="ambient-gas-b"><circle cx="566" cy="126" r="4" fill="#38bdf8"/><circle cx="472" cy="186" r="4" fill="#38bdf8"/><circle cx="536" cy="102" r="4" fill="#fbbf24"/></g>' +
        '<text x="522" y="266" fill="#e2e8f0" font-size="13" font-weight="700" text-anchor="middle">Bỏ qua dãn nở nhiệt → V = const</text>' +
        '<text x="522" y="290" fill="#6ee7b7" font-size="13" text-anchor="middle">E_đ = (3/2)·kT tăng khi T tăng</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-car-side', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C2-51': {
    id: 'MH-C2-51',
    title: 'Kiểm tra nhiệt độ & áp suất lốp xe bán tải trên cao tốc',
    topic: 'DS-C2.4',
    layout: 'single',
    caption: 'Xe bán tải chạy cao tốc Bắc – Nam: Theo dõi áp suất lốp (120 lít · 240 kPa tại 27°C) khi lốp nóng tới 45°C – 65°C',
    alt: 'Xe bán tải trên đường cao tốc kèm súng nhiệt kế hồng ngoại đo nhiệt độ lốp 65 độ C với thể tích 120 lít và áp suất ban đầu 240 kPa',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 350" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="16" y="16" width="668" height="318" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Road & Pickup truck
        '<rect x="38" y="246" width="380" height="44" rx="4" fill="#1e293b" stroke="#334155"/>' +
        '<line x1="56" y1="268" x2="398" y2="268" stroke="#fbbf24" stroke-width="3" stroke-dasharray="18 14"/>' +
        '<path d="M 62 198 L 62 160 L 180 160 L 210 124 L 306 124 L 336 160 L 382 164 L 388 210 L 62 210 Z" fill="#0369a1" stroke="#e2e8f0" stroke-width="2.2"/>' +
        '<polygon points="214,132 252,132 252,158 194,158" fill="#0f172a" stroke="#7dd3fc" stroke-width="1.4"/>' +
        '<polygon points="262,132 300,132 322,158 262,158" fill="#0f172a" stroke="#7dd3fc" stroke-width="1.4"/>' +
        '<circle cx="132" cy="214" r="28" fill="#0f172a" stroke="#94a3b8" stroke-width="6"/>' +
        '<circle cx="132" cy="214" r="12" fill="#64748b"/>' +
        '<circle cx="322" cy="214" r="28" fill="#0f172a" stroke="#94a3b8" stroke-width="6"/>' +
        '<circle cx="322" cy="214" r="12" fill="#64748b"/>' +
        '<text x="228" y="84" fill="#7dd3fc" font-size="14.5" font-weight="800" text-anchor="middle">Cao tốc Bắc – Nam (Mùa hè)</text>' +
        // IR thermometer laser hitting front tire
        '<line x1="354" y1="208" x2="462" y2="162" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="5 3" class="ambient-ray-glide"/>' +
        '<rect x="462" y="138" width="186" height="68" rx="8" fill="#0f172a" stroke="#ef4444" stroke-width="2"/>' +
        '<text x="555" y="164" fill="#fca5a5" font-size="13.5" font-weight="800" text-anchor="middle">Nhiệt kế hồng ngoại</text>' +
        '<text x="555" y="190" fill="#fbbf24" font-size="16" font-family="DM Mono,monospace" font-weight="800" text-anchor="middle">t_mặt lốp = 65°C</text>' +
        // Parameters summary cards bottom right
        '<rect x="442" y="44" width="224" height="76" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>' +
        '<text x="554" y="68" fill="#38bdf8" font-size="13.5" font-weight="800" text-anchor="middle">Lúc sáng sớm (t₁ = 27°C)</text>' +
        '<text x="554" y="92" fill="#e2e8f0" font-size="13.5" font-weight="700" text-anchor="middle">V = 120 lít · p₁ = 240 kPa</text>' +
        '<text x="554" y="110" fill="#cbd5e1" font-size="12.5" text-anchor="middle">k = 1,38·10⁻²³ J/K</text>' +

        '<rect x="442" y="224" width="224" height="82" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>' +
        '<text x="554" y="250" fill="#fde68a" font-size="13.5" font-weight="800" text-anchor="middle">Tại Cam Lộ: t_đường = 45°C</text>' +
        '<text x="554" y="274" fill="#cbd5e1" font-size="13" text-anchor="middle">Thể tích không đổi (V = const)</text>' +
        '<text x="554" y="294" fill="#6ee7b7" font-size="12.5" font-weight="700" text-anchor="middle">Khí không thoát ra ngoài</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-temperature-three-quarters', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C2-52': {
    id: 'MH-C2-52',
    title: 'Súng bắn đinh khí nén & Bình nén khí gắn rơ-le áp suất',
    topic: 'DS-C2.5',
    layout: 'single',
    caption: 'Bình nén khí (10 lít · 12 atm · 27°C) cấp cho súng bắn đinh (0,5 lít/lần ở 1 atm); rơ-le nạp lại khi p < 4 atm',
    alt: 'Sơ đồ bình chứa khí nén 10 lít áp suất 12 atm có rơ-le ngắt ở 4 atm nối dây dẫn tới súng bắn đinh giải phóng 0,5 lít khí mỗi phát bắn',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 350" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><marker id="' + u + 'nail" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
        '<path d="M 0 1 L 9 5 L 0 9 z" fill="#f59e0b"/></marker></defs>' +
        '<rect x="16" y="16" width="668" height="318" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Compressor Tank on left
        '<rect x="52" y="124" width="186" height="122" rx="34" fill="#0369a1" stroke="#38bdf8" stroke-width="2.6"/>' +
        '<rect x="82" y="92" width="124" height="32" rx="6" fill="#1e293b" stroke="#fbbf24" stroke-width="1.8"/>' +
        '<text x="144" y="113" fill="#fbbf24" font-size="13" font-weight="800" text-anchor="middle">Rơ-le (&lt; 4 atm)</text>' +
        '<text x="145" y="172" fill="#fff" font-size="15.5" font-weight="800" text-anchor="middle">BÌNH KHÍ NÉN</text>' +
        '<text x="145" y="198" fill="#e0f2fe" font-size="13.5" font-weight="700" text-anchor="middle">V = 10 lít · p₁ = 12 atm</text>' +
        '<text x="145" y="220" fill="#bae6fd" font-size="13" text-anchor="middle">t = 27°C (300 K)</text>' +
        '<line x1="94" y1="246" x2="94" y2="268" stroke="#94a3b8" stroke-width="6"/>' +
        '<line x1="196" y1="246" x2="196" y2="268" stroke="#94a3b8" stroke-width="6"/>' +
        // Air hose to nail gun
        '<path d="M 238 184 Q 302 224 352 204 L 382 192" fill="none" stroke="#f59e0b" stroke-width="4" class="ambient-wire-pulse"/>' +
        '<text x="308" y="236" fill="#fde68a" font-size="12.5" font-weight="700" text-anchor="middle">Khí cấp (T = const)</text>' +
        // Pneumatic Nail Gun
        '<path d="M 382 118 L 522 118 L 538 142 L 522 158 L 444 158 L 424 218 L 388 218 L 404 158 L 382 158 Z" fill="#1e293b" stroke="#cbd5e1" stroke-width="2.4" stroke-linejoin="round"/>' +
        '<rect x="498" y="158" width="22" height="92" rx="3" fill="#475569" stroke="#94a3b8" stroke-width="2"/>' +
        '<line x1="538" y1="142" x2="578" y2="142" stroke="#f59e0b" stroke-width="3" marker-end="url(#' + u + 'nail)" class="ambient-ray-glide"/>' +
        // Wood target on right
        '<rect x="588" y="88" width="44" height="176" rx="4" fill="#92400e" stroke="#d97706" stroke-width="2"/>' +
        '<text x="610" y="180" fill="#fde68a" font-size="13.5" font-weight="800" text-anchor="middle">Gỗ</text>' +
        // Bottom callout strip
        '<rect x="278" y="264" width="380" height="50" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.4"/>' +
        '<text x="468" y="286" fill="#7dd3fc" font-size="13.5" font-weight="800" text-anchor="middle">Mỗi lần bắn: thoát V₀ = 0,5 lít ở 1 atm · 27°C</text>' +
        '<text x="468" y="305" fill="#94a3b8" font-size="12.5" text-anchor="middle">Lượng khí trong bình giảm dần sau mỗi phát bắn</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-hammer', this.caption) + svg + '</div></div>';
    }
  }

  ,'MH-C3-53': {
    id: 'MH-C3-53',
    title: 'Thí nghiệm cân từ trường đo cảm ứng từ nam châm chữ U',
    topic: 'DS-C3.1',
    layout: 'single',
    caption: 'Bộ thí nghiệm đo cảm ứng từ bằng cân điện tử và nam châm chữ U',
    alt: 'Dây dẫn PQ cố định nằm ngang giữa hai cực N và S của nam châm chữ U đặt trên cân điện tử',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 360" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="16" y="16" width="668" height="328" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        '<line x1="60" y1="308" x2="640" y2="308" stroke="#334155" stroke-width="3"/>' +
        // Electronic balance (3)
        '<rect x="215" y="256" width="230" height="52" rx="8" fill="#1e293b" stroke="#64748b" stroke-width="2"/>' +
        '<rect x="242" y="244" width="176" height="14" rx="4" fill="#475569" stroke="#94a3b8" stroke-width="1.5"/>' +
        '<rect x="268" y="268" width="124" height="28" rx="4" fill="#050811" stroke="#38bdf8" stroke-width="1.5"/>' +
        '<text x="330" y="287" fill="#34d399" font-size="14" font-weight="800" font-family="DM Mono,monospace" text-anchor="middle">2.20 g</text>' +
        // U-magnet (2) back arm S (blue) and front arm N (red)
        '<path d="M 270 244 L 270 116 L 390 116 L 390 244 Z" fill="#1e3a8a" stroke="#60a5fa" stroke-width="2"/>' +
        '<text x="330" y="142" fill="#e0f2fe" font-size="15" font-weight="800" text-anchor="middle">S (sau)</text>' +
        // Stands holding wire PQ
        '<rect x="128" y="128" width="18" height="180" rx="3" fill="#334155" stroke="#64748b" stroke-width="1.5"/>' +
        '<rect x="108" y="294" width="58" height="14" rx="3" fill="#475569"/>' +
        '<rect x="514" y="128" width="18" height="180" rx="3" fill="#334155" stroke="#64748b" stroke-width="1.5"/>' +
        '<rect x="494" y="294" width="58" height="14" rx="3" fill="#475569"/>' +
        // Horizontal wire PQ
        '<line x1="137" y1="158" x2="523" y2="158" stroke="#f59e0b" stroke-width="5" stroke-linecap="round"/>' +
        '<line x1="150" y1="158" x2="510" y2="158" stroke="#fef08a" stroke-width="2" class="ambient-wire-pulse"/>' +
        '<circle cx="152" cy="158" r="5" fill="#fbbf24"/>' +
        '<circle cx="508" cy="158" r="5" fill="#fbbf24"/>' +
        '<text x="152" y="142" fill="#fde047" font-size="15" font-weight="800" text-anchor="middle">P</text>' +
        '<text x="508" y="142" fill="#fde047" font-size="15" font-weight="800" text-anchor="middle">Q</text>' +
        // Front magnet pole N (red) partly below PQ so wire stays clear
        '<path d="M 254 244 L 254 176 L 406 176 L 406 244 Z" fill="rgba(185,28,28,0.88)" stroke="#f87171" stroke-width="2.2"/>' +
        '<text x="330" y="206" fill="#fef2f2" font-size="15" font-weight="800" text-anchor="middle">N (trước)</text>' +
        '<text x="330" y="228" fill="#cbd5e1" font-size="12" font-weight="700" text-anchor="middle">l_trong từ trường = 5,0 cm</text>' +
        // Callout (1) Wire PQ
        '<polyline points="222,158 202,92 184,92" fill="none" stroke="#fbbf24" stroke-width="1.6"/>' +
        '<circle cx="222" cy="158" r="3.5" fill="#fbbf24"/>' +
        '<rect x="34" y="64" width="150" height="46" rx="7" fill="#0f172a" stroke="#fbbf24" stroke-width="1.4"/>' +
        '<text x="109" y="84" fill="#fde68a" font-size="13" font-weight="800" text-anchor="middle">(1) Dây dẫn PQ</text>' +
        '<text x="109" y="101" fill="#cbd5e1" font-size="12" text-anchor="middle">I = 5,0 A · cố định</text>' +
        // Callout (2) U-magnet
        '<polyline points="406,198 468,92 486,92" fill="none" stroke="#f87171" stroke-width="1.6"/>' +
        '<circle cx="406" cy="198" r="3.5" fill="#f87171"/>' +
        '<rect x="486" y="64" width="180" height="46" rx="7" fill="#0f172a" stroke="#f87171" stroke-width="1.4"/>' +
        '<text x="576" y="84" fill="#fca5a5" font-size="13" font-weight="800" text-anchor="middle">(2) Nam châm chữ U</text>' +
        '<text x="576" y="101" fill="#cbd5e1" font-size="12" text-anchor="middle">Đặt trực tiếp trên cân</text>' +
        // Callout (3) Balance
        '<polyline points="445,282 486,282" fill="none" stroke="#38bdf8" stroke-width="1.6"/>' +
        '<circle cx="445" cy="282" r="3.5" fill="#38bdf8"/>' +
        '<rect x="486" y="256" width="180" height="44" rx="7" fill="#0f172a" stroke="#38bdf8" stroke-width="1.4"/>' +
        '<text x="576" y="275" fill="#7dd3fc" font-size="13" font-weight="800" text-anchor="middle">(3) Cân điện tử</text>' +
        '<text x="576" y="292" fill="#cbd5e1" font-size="12" text-anchor="middle">Hiệu chỉnh về 0 ban đầu</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-scale-balanced', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C3-54': {
    id: 'MH-C3-54',
    title: 'Đo cảm ứng từ giữa hai nhánh nam châm chữ U bằng cân hiện số',
    topic: 'DS-C3.1',
    layout: 'single',
    caption: 'Sơ đồ thí nghiệm xác định cảm ứng từ với dây 15 cm và nam châm dài 8,4 cm',
    alt: 'Đoạn dây dẫn 15 cm nằm giữa hai nhánh nam châm chữ U dài 8,4 cm đặt trên cân đồng hồ hiện số',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 360" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="16" y="16" width="668" height="328" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Scale body (3)
        '<rect x="200" y="246" width="260" height="68" rx="8" fill="#1e293b" stroke="#64748b" stroke-width="2"/>' +
        '<rect x="235" y="232" width="190" height="14" rx="4" fill="#475569" stroke="#94a3b8" stroke-width="1.5"/>' +
        '<rect x="258" y="262" width="144" height="36" rx="5" fill="#050811" stroke="#38bdf8" stroke-width="1.5"/>' +
        '<text x="330" y="286" fill="#34d399" font-size="16" font-weight="800" font-family="DM Mono,monospace" text-anchor="middle">164.40 g</text>' +
        // Magnet back S + front N
        '<rect x="242" y="102" width="176" height="130" rx="5" fill="#1e3a8a" stroke="#60a5fa" stroke-width="2"/>' +
        '<text x="330" y="128" fill="#e0f2fe" font-size="15" font-weight="800" text-anchor="middle">S (mặt sau)</text>' +
        // Support posts & wire (1) length 15 cm
        '<line x1="115" y1="148" x2="545" y2="148" stroke="#f59e0b" stroke-width="6" stroke-linecap="round"/>' +
        '<line x1="130" y1="148" x2="530" y2="148" stroke="#fef08a" stroke-width="2" class="ambient-wire-pulse"/>' +
        '<rect x="102" y="140" width="16" height="174" rx="3" fill="#334155" stroke="#64748b" stroke-width="1.5"/>' +
        '<rect x="542" y="140" width="16" height="174" rx="3" fill="#334155" stroke="#64748b" stroke-width="1.5"/>' +
        // Dimension 15 cm above wire
        '<line x1="118" y1="74" x2="542" y2="74" stroke="#fbbf24" stroke-width="1.4" stroke-dasharray="4 3"/>' +
        '<line x1="118" y1="68" x2="118" y2="138" stroke="#64748b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
        '<line x1="542" y1="68" x2="542" y2="138" stroke="#64748b" stroke-width="1.2" stroke-dasharray="3 3"/>' +
        '<rect x="262" y="58" width="136" height="28" rx="6" fill="#0f172a" stroke="#fbbf24" stroke-width="1.3"/>' +
        '<text x="330" y="77" fill="#fde047" font-size="13" font-weight="800" text-anchor="middle">(1) Dây dẫn 15 cm</text>' +
        // Front N pole
        '<rect x="234" y="166" width="192" height="66" rx="4" fill="rgba(185,28,28,0.9)" stroke="#f87171" stroke-width="2"/>' +
        '<text x="330" y="196" fill="#fef2f2" font-size="15" font-weight="800" text-anchor="middle">N (mặt trước)</text>' +
        '<text x="330" y="218" fill="#fee2e2" font-size="12.5" font-weight="700" text-anchor="middle">Bề rộng nam châm l = 8,4 cm</text>' +
        // Labels (2) & (3)
        '<rect x="28" y="182" width="176" height="46" rx="7" fill="#0f172a" stroke="#f87171" stroke-width="1.4"/>' +
        '<text x="116" y="202" fill="#fca5a5" font-size="13" font-weight="800" text-anchor="middle">(2) Nam châm chữ U</text>' +
        '<text x="116" y="219" fill="#cbd5e1" font-size="12" text-anchor="middle">l = 8,4 cm · cực N trước</text>' +
        '<line x1="204" y1="205" x2="234" y2="205" stroke="#f87171" stroke-width="1.6"/>' +
        '<rect x="488" y="256" width="178" height="46" rx="7" fill="#0f172a" stroke="#38bdf8" stroke-width="1.4"/>' +
        '<text x="577" y="276" fill="#7dd3fc" font-size="13" font-weight="800" text-anchor="middle">(3) Cân đồng hồ</text>' +
        '<text x="577" y="293" fill="#cbd5e1" font-size="12" text-anchor="middle">m₀ = 164,40 g (lúc I = 0)</text>' +
        '<line x1="460" y1="279" x2="488" y2="279" stroke="#38bdf8" stroke-width="1.6"/>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-magnet', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C3-55': {
    id: 'MH-C3-55',
    title: 'Khảo sát lực từ bằng hai lực kế treo dây dẫn AB',
    topic: 'DS-C3.1',
    layout: 'single',
    caption: 'Thí nghiệm treo thanh dẫn AB giữa hai lực kế trong lòng nam châm chữ U',
    alt: 'Thanh dẫn AB treo bởi hai lực kế lò xo có dòng điện I từ A sang B và lực từ hướng xuống',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 370" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs>' +
        '<marker id="' + u + 'arB" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L9 5 L0 9 z" fill="#38bdf8"/></marker>' +
        '<marker id="' + u + 'arF" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 1 L9 5 L0 9 z" fill="#60a5fa"/></marker>' +
        '<marker id="' + u + 'arI" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L9 5 L0 9 z" fill="#fbbf24"/></marker>' +
        '</defs>' +
        '<rect x="16" y="16" width="668" height="338" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Top support beam
        '<rect x="150" y="38" width="400" height="14" rx="4" fill="#334155" stroke="#64748b" stroke-width="1.5"/>' +
        // Left & right spring dynamometers
        '<rect x="200" y="52" width="32" height="92" rx="6" fill="#0f172a" stroke="#94a3b8" stroke-width="2"/>' +
        '<path d="M 216 62 L 210 70 L 222 78 L 210 86 L 222 94 L 210 102 L 216 110" fill="none" stroke="#e2e8f0" stroke-width="2"/>' +
        '<line x1="216" y1="144" x2="216" y2="216" stroke="#cbd5e1" stroke-width="2.5"/>' +
        '<rect x="468" y="52" width="32" height="92" rx="6" fill="#0f172a" stroke="#94a3b8" stroke-width="2"/>' +
        '<path d="M 484 62 L 478 70 L 490 78 L 478 86 L 490 94 L 478 102 L 484 110" fill="none" stroke="#e2e8f0" stroke-width="2"/>' +
        '<line x1="484" y1="144" x2="484" y2="216" stroke="#cbd5e1" stroke-width="2.5"/>' +
        '<text x="188" y="98" fill="#cbd5e1" font-size="13" font-weight="700" text-anchor="end">Lực kế 1</text>' +
        '<text x="512" y="98" fill="#cbd5e1" font-size="13" font-weight="700" text-anchor="start">Lực kế 2</text>' +
        // Back Magnet S (blue)
        '<rect x="268" y="138" width="164" height="118" rx="6" fill="#1e3a8a" stroke="#60a5fa" stroke-width="2"/>' +
        '<text x="350" y="160" fill="#e0f2fe" font-size="15" font-weight="800" text-anchor="middle">S</text>' +
        // Wire B -- A
        '<line x1="175" y1="216" x2="525" y2="216" stroke="#f59e0b" stroke-width="6" stroke-linecap="round"/>' +
        '<line x1="408" y1="204" x2="298" y2="204" stroke="#fbbf24" stroke-width="2.5" marker-end="url(#' + u + 'arI)"/>' +
        '<text x="350" y="196" fill="#fde047" font-size="13.5" font-weight="800" text-anchor="middle">I (A → B)</text>' +
        '<text x="160" y="221" fill="#fde68a" font-size="15" font-weight="800" text-anchor="end">B</text>' +
        '<text x="540" y="221" fill="#fde68a" font-size="15" font-weight="800" text-anchor="start">A</text>' +
        // Magnetic field arrows B (front to back)
        '<line x1="295" y1="186" x2="315" y2="170" stroke="#38bdf8" stroke-width="2.2" marker-end="url(#' + u + 'arB)"/>' +
        '<line x1="395" y1="186" x2="415" y2="170" stroke="#38bdf8" stroke-width="2.2" marker-end="url(#' + u + 'arB)"/>' +
        '<text x="424" y="168" fill="#7dd3fc" font-size="14" font-weight="800">B</text>' +
        // Front Magnet N (red)
        '<rect x="254" y="232" width="192" height="68" rx="6" fill="rgba(185,28,28,0.88)" stroke="#f87171" stroke-width="2.2"/>' +
        '<text x="310" y="270" fill="#fef2f2" font-size="15" font-weight="800" text-anchor="middle">N (trước)</text>' +
        // Downward Force arrow F
        '<line x1="350" y1="218" x2="350" y2="334" stroke="#60a5fa" stroke-width="4" marker-end="url(#' + u + 'arF)"/>' +
        '<rect x="372" y="308" width="176" height="32" rx="6" fill="#0f172a" stroke="#60a5fa" stroke-width="1.3"/>' +
        '<text x="460" y="329" fill="#93c5fd" font-size="13.5" font-weight="800" text-anchor="middle">Lực từ F (hướng xuống)</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-weight-hanging', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C3-56': {
    id: 'MH-C3-56',
    title: 'Cân dòng điện Oersted và quy tắc mô men lực',
    topic: 'DS-C3.1',
    layout: 'single',
    caption: 'Mô hình cân dòng điện Oersted cân bằng mô men lực từ và trọng lượng kẹp giấy',
    alt: 'Đòn cân đặt trên trục quay, đầu trái mang dòng điện I đặt trong nam châm chữ U chịu lực F_B hướng xuống, đầu phải treo kẹp giấy trọng lượng P',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 360" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs>' +
        '<marker id="' + u + 'arr" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L9 5 L0 9 z" fill="#f87171"/></marker>' +
        '<marker id="' + u + 'arrB" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L9 5 L0 9 z" fill="#38bdf8"/></marker>' +
        '</defs>' +
        '<rect x="16" y="16" width="668" height="328" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // U-magnet left
        '<path d="M 62 126 L 166 126 L 166 154 L 96 154 L 96 244 L 166 244 L 166 272 L 62 272 Z" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>' +
        '<rect x="116" y="126" width="50" height="28" fill="#dc2626"/>' +
        '<rect x="116" y="244" width="50" height="28" fill="#2563eb"/>' +
        '<text x="141" y="145" fill="#fff" font-size="14" font-weight="800" text-anchor="middle">N</text>' +
        '<text x="141" y="263" fill="#fff" font-size="14" font-weight="800" text-anchor="middle">S</text>' +
        '<text x="78" y="116" fill="#cbd5e1" font-size="12.5" font-weight="700" text-anchor="middle">B = 0,08 T</text>' +
        // Lever beam balanced on pivot at x=300
        '<line x1="150" y1="196" x2="585" y2="196" stroke="#fbbf24" stroke-width="5" stroke-linecap="round"/>' +
        '<polygon points="300,200 282,238 318,238" fill="#475569" stroke="#94a3b8" stroke-width="2"/>' +
        '<line x1="255" y1="238" x2="345" y2="238" stroke="#64748b" stroke-width="3"/>' +
        '<text x="300" y="258" fill="#cbd5e1" font-size="13" font-weight="700" text-anchor="middle">Trục quay</text>' +
        // Current segment l = 0.3 m inside magnet
        '<circle cx="150" cy="196" r="10" fill="#0f172a" stroke="#fbbf24" stroke-width="2.5"/>' +
        '<circle cx="150" cy="196" r="3.5" fill="#fbbf24"/>' +
        '<rect x="166" y="164" width="122" height="24" rx="4" fill="#070d1c" opacity="0.92"/>' +
        '<text x="172" y="180" fill="#fde047" font-size="13" font-weight="800" text-anchor="start">I = 2 A (l = 0,3 m)</text>' +
        // F_B downward arrow
        '<line x1="150" y1="208" x2="150" y2="290" stroke="#38bdf8" stroke-width="3.2" marker-end="url(#' + u + 'arrB)"/>' +
        '<text x="164" y="294" fill="#7dd3fc" font-size="14" font-weight="800">F_B</text>' +
        // Right paperclip and weight P
        '<rect x="572" y="196" width="12" height="24" rx="5" fill="none" stroke="#cbd5e1" stroke-width="2.2"/>' +
        '<line x1="578" y1="220" x2="578" y2="296" stroke="#f87171" stroke-width="3.2" marker-end="url(#' + u + 'arr)"/>' +
        '<text x="594" y="266" fill="#fca5a5" font-size="14" font-weight="800">P (Kẹp giấy)</text>' +
        // Dimension x and y
        '<line x1="150" y1="90" x2="300" y2="90" stroke="#38bdf8" stroke-width="1.6"/>' +
        '<line x1="150" y1="84" x2="150" y2="184" stroke="#334155" stroke-dasharray="3 3"/>' +
        '<line x1="300" y1="84" x2="300" y2="190" stroke="#334155" stroke-dasharray="3 3"/>' +
        '<rect x="180" y="72" width="90" height="26" rx="5" fill="#0f172a" stroke="#38bdf8" stroke-width="1.2"/>' +
        '<text x="225" y="90" fill="#7dd3fc" font-size="13" font-weight="800" text-anchor="middle">x = 0,1 m</text>' +
        '<line x1="300" y1="90" x2="578" y2="90" stroke="#10b981" stroke-width="1.6"/>' +
        '<line x1="578" y1="84" x2="578" y2="190" stroke="#334155" stroke-dasharray="3 3"/>' +
        '<rect x="394" y="72" width="90" height="26" rx="5" fill="#0f172a" stroke="#10b981" stroke-width="1.2"/>' +
        '<text x="439" y="90" fill="#6ee7b7" font-size="13" font-weight="800" text-anchor="middle">y = 0,4 m</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-balance-scale', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C3-57': {
    id: 'MH-C3-57',
    title: 'Máy phát điện xoay chiều một pha dùng vành khuyên & chổi quét',
    topic: 'DS-C3.3',
    layout: 'single',
    caption: 'Khung dây N = 200 vòng quay đều (f = 50 Hz) trong từ trường đều B = 0,5 T',
    alt: 'Sơ đồ máy phát điện xoay chiều một pha gồm hai cực N S, khung dây quay, hai vành khuyên và chổi quét',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 350" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><marker id="' + u + 'rot" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L9 5 L0 9 z" fill="#38bdf8"/></marker></defs>' +
        '<rect x="16" y="16" width="668" height="318" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Poles N (red left) & S (blue right)
        '<path d="M 68 92 L 154 92 L 154 248 L 68 248 Z" fill="#b91c1c" stroke="#f87171" stroke-width="2"/>' +
        '<text x="111" y="178" fill="#fff" font-size="26" font-weight="800" text-anchor="middle">N</text>' +
        '<path d="M 508 92 L 594 92 L 594 248 L 508 248 Z" fill="#1d4ed8" stroke="#60a5fa" stroke-width="2"/>' +
        '<text x="551" y="178" fill="#fff" font-size="26" font-weight="800" text-anchor="middle">S</text>' +
        // Axis dashed
        '<line x1="330" y1="54" x2="330" y2="290" stroke="#475569" stroke-width="1.6" stroke-dasharray="5 4"/>' +
        // Rotating wire loop
        '<polygon points="210,126 450,94 450,214 210,246" fill="rgba(245,158,11,0.12)" stroke="#fbbf24" stroke-width="3.5" stroke-linejoin="round"/>' +
        '<text x="330" y="156" fill="#fde68a" font-size="14" font-weight="800" text-anchor="middle">Khung dây (N = 200 vòng)</text>' +
        '<text x="330" y="176" fill="#cbd5e1" font-size="13" text-anchor="middle">S = 0,02 m² · B = 0,5 T</text>' +
        // Rotation arrow
        '<path d="M 300 66 A 32 14 0 1 1 356 68" fill="none" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#' + u + 'rot)"/>' +
        '<text x="330" y="48" fill="#7dd3fc" font-size="13" font-weight="800" text-anchor="middle">Quay đều f = 50 Hz</text>' +
        // Slip rings & brushes at bottom
        '<ellipse cx="305" cy="264" rx="22" ry="8" fill="none" stroke="#fbbf24" stroke-width="3"/>' +
        '<ellipse cx="355" cy="284" rx="22" ry="8" fill="none" stroke="#fbbf24" stroke-width="3"/>' +
        '<rect x="258" y="258" width="18" height="12" rx="2" fill="#94a3b8"/>' +
        '<rect x="384" y="278" width="18" height="12" rx="2" fill="#94a3b8"/>' +
        '<polyline points="258,264 190,264 190,308" fill="none" stroke="#38bdf8" stroke-width="2.2" class="ambient-wire-pulse"/>' +
        '<polyline points="402,284 470,284 470,308" fill="none" stroke="#38bdf8" stroke-width="2.2" class="ambient-wire-pulse"/>' +
        '<text x="205" y="254" fill="#e2e8f0" font-size="12.5" font-weight="700" text-anchor="middle">Chổi quét</text>' +
        '<text x="458" y="274" fill="#fde68a" font-size="12.5" font-weight="700" text-anchor="middle">Vành khuyên</text>' +
        '<text x="330" y="324" fill="#7dd3fc" font-size="13" font-weight="800" text-anchor="middle">Ngõ ra suất điện động xoay chiều e(t)</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-bolt', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C3-58': {
    id: 'MH-C3-58',
    title: 'Máy phát điện xoay chiều 3 cặp cực (Rotato 6 cực – Stato 6 cuộn)',
    topic: 'DS-C3.3',
    layout: 'single',
    caption: 'Cấu tạo máy phát 3 cặp cực (6 nam châm rotato và 6 cuộn dây stato mắc nối tiếp)',
    alt: 'Vành ngoài Stato gồm 6 cuộn dây lõi sắt nối tiếp nhau, bên trong là Rotato 6 cực S-N xen kẽ quay quanh trục',
    build: function (u) {
      var statorAngles = [0, 60, 120, 180, 240, 300];
      var coils = '';
      var poles = '';
      var poleLabels = ['N', 'S', 'N', 'S', 'N', 'S'];
      for (var i = 0; i < 6; i++) {
        var deg = statorAngles[i];
        var rad = (deg - 90) * Math.PI / 180;
        var cx = 250 + Math.cos(rad) * 124;
        var cy = 176 + Math.sin(rad) * 124;
        coils += '<g transform="translate(' + cx.toFixed(1) + ',' + cy.toFixed(1) + ') rotate(' + deg + ')">' +
          '<rect x="-15" y="-14" width="30" height="28" rx="4" fill="#92400e" stroke="#fbbf24" stroke-width="2"/>' +
          '<line x1="-11" y1="-6" x2="11" y2="-6" stroke="#fde68a" stroke-width="1.4"/>' +
          '<line x1="-11" y1="0" x2="11" y2="0" stroke="#fde68a" stroke-width="1.4"/>' +
          '<line x1="-11" y1="6" x2="11" y2="6" stroke="#fde68a" stroke-width="1.4"/>' +
          '</g>';
        var px = 250 + Math.cos(rad) * 68;
        var py = 176 + Math.sin(rad) * 68;
        var isN = poleLabels[i] === 'N';
        poles += '<g transform="translate(' + px.toFixed(1) + ',' + py.toFixed(1) + ')">' +
          '<circle cx="0" cy="0" r="18" fill="' + (isN ? '#dc2626' : '#2563eb') + '" stroke="#f8fafc" stroke-width="1.5"/>' +
          '<text x="0" y="5" fill="#fff" font-size="14" font-weight="800" text-anchor="middle">' + poleLabels[i] + '</text>' +
          '</g>';
      }
      var svg =
        '<svg viewBox="0 0 700 355" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="16" y="16" width="668" height="323" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Outer stator ring
        '<circle cx="250" cy="176" r="144" fill="none" stroke="#475569" stroke-width="18"/>' +
        '<circle cx="250" cy="176" r="124" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="10 6" class="ambient-wire-pulse"/>' +
        coils +
        // Rotor disc + poles
        '<g class="ambient-fan-spin" style="animation-duration:10s;">' +
        '<circle cx="250" cy="176" r="90" fill="#0f172a" stroke="#64748b" stroke-width="2.2"/>' +
        poles +
        '</g>' +
        '<circle cx="250" cy="176" r="14" fill="#334155" stroke="#cbd5e1" stroke-width="2"/>' +
        // Output leads at bottom
        '<line x1="234" y1="306" x2="234" y2="332" stroke="#38bdf8" stroke-width="2.5"/>' +
        '<line x1="266" y1="306" x2="266" y2="332" stroke="#38bdf8" stroke-width="2.5"/>' +
        '<text x="250" y="340" fill="#7dd3fc" font-size="12" font-weight="800" text-anchor="middle">Ngõ ra ~ (f = 50 Hz)</text>' +
        // Specs panel right
        '<rect x="424" y="54" width="236" height="244" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>' +
        '<text x="542" y="84" fill="#38bdf8" font-size="14.5" font-weight="800" text-anchor="middle">Thông số máy phát</text>' +
        '<text x="442" y="116" fill="#e2e8f0" font-size="13" font-weight="700">• Rotato (quay): 3 cặp cực</text>' +
        '<text x="454" y="138" fill="#cbd5e1" font-size="12.5">6 cực N-S xen kẽ đối xứng</text>' +
        '<text x="442" y="172" fill="#fde68a" font-size="13" font-weight="700">• Stato (cố định): 6 cuộn dây</text>' +
        '<text x="454" y="194" fill="#cbd5e1" font-size="12.5">Mỗi cuộn 200 vòng nối tiếp</text>' +
        '<text x="442" y="228" fill="#e2e8f0" font-size="13">• Φ₀ (1 vòng) = 0,800 mWb</text>' +
        '<text x="442" y="256" fill="#e2e8f0" font-size="13">• Tần số f = 50,0 Hz</text>' +
        '<text x="442" y="282" fill="#94a3b8" font-size="12">(p = 3 · N = 1200 vòng)</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-fan', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C3-59': {
    id: 'MH-C3-59',
    title: 'Mô hình phanh tái sinh xe ô tô điện thu hồi năng lượng',
    topic: 'DS-C3.3',
    layout: 'single',
    caption: 'Khung dây vuông ABCD cạnh L quay quanh trục OO′ thu hồi cơ năng khi xe phanh',
    alt: 'Khung dây vuông ABCD giữa hai cực N bên trái và S bên phải nối tới bộ tích trữ năng lượng',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 350" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><marker id="' + u + 'rot" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L9 5 L0 9 z" fill="#38bdf8"/></marker></defs>' +
        '<rect x="16" y="16" width="668" height="318" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Poles N left & S right
        '<rect x="52" y="88" width="90" height="162" rx="6" fill="#b91c1c" stroke="#f87171" stroke-width="2"/>' +
        '<text x="97" y="177" fill="#fff" font-size="26" font-weight="800" text-anchor="middle">N</text>' +
        '<rect x="448" y="88" width="84" height="162" rx="6" fill="#1d4ed8" stroke="#60a5fa" stroke-width="2"/>' +
        '<text x="490" y="177" fill="#fff" font-size="26" font-weight="800" text-anchor="middle">S</text>' +
        // Dashed field arrow N -> S
        '<line x1="152" y1="168" x2="438" y2="168" stroke="#38bdf8" stroke-width="1.4" stroke-dasharray="5 4" opacity="0.5"/>' +
        // Axis O-O'
        '<line x1="286" y1="42" x2="286" y2="288" stroke="#94a3b8" stroke-width="1.6" stroke-dasharray="5 4"/>' +
        '<text x="286" y="34" fill="#cbd5e1" font-size="13" font-weight="800" text-anchor="middle">O</text>' +
        '<text x="272" y="304" fill="#cbd5e1" font-size="13" font-weight="800" text-anchor="end">O′</text>' +
        // Square loop ABCD (AB left, CD right)
        '<polygon points="188,132 374,104 374,204 188,232" fill="rgba(251,191,36,0.12)" stroke="#fbbf24" stroke-width="3.2" stroke-linejoin="round"/>' +
        '<text x="174" y="132" fill="#fde047" font-size="15" font-weight="800" text-anchor="end">A</text>' +
        '<text x="174" y="238" fill="#fde047" font-size="15" font-weight="800" text-anchor="end">B</text>' +
        '<text x="386" y="210" fill="#fde047" font-size="15" font-weight="800" text-anchor="start">C</text>' +
        '<text x="386" y="106" fill="#fde047" font-size="15" font-weight="800" text-anchor="start">D</text>' +
        // Downward motion arrow on CD (matching CCW rotation seen from front)
        '<line x1="406" y1="126" x2="406" y2="184" stroke="#38bdf8" stroke-width="2.8" marker-end="url(#' + u + 'rot)"/>' +
        '<text x="410" y="76" fill="#7dd3fc" font-size="12" font-weight="700" text-anchor="middle">CD đi xuống</text>' +
        // Wires to storage unit
        '<polyline points="282,254 282,318 552,318 552,226" fill="none" stroke="#38bdf8" stroke-width="2.2" class="ambient-wire-pulse"/>' +
        '<polyline points="312,268 312,306 536,306 536,226" fill="none" stroke="#fbbf24" stroke-width="2.2" class="ambient-wire-pulse"/>' +
        '<rect x="546" y="114" width="124" height="112" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2"/>' +
        '<text x="608" y="156" fill="#6ee7b7" font-size="13.5" font-weight="800" text-anchor="middle">Bộ tích trữ</text>' +
        '<text x="608" y="176" fill="#6ee7b7" font-size="13.5" font-weight="800" text-anchor="middle">năng lượng</text>' +
        '<text x="608" y="204" fill="#cbd5e1" font-size="12" text-anchor="middle">(Pin xe điện)</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-car-battery', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C3-60': {
    id: 'MH-C3-60',
    title: 'Thanh MN rơi thẳng đứng trên ray và đồ thị vận tốc theo thời gian',
    topic: 'DS-C3.2',
    layout: 'grid-2col',
    caption: 'Hình H1: Thanh MN (r = 2 Ω) trượt không ma sát trên hai ray thẳng đứng',
    caption2: 'Hình H2: Đồ thị vận tốc v (m/s) theo thời gian t (s) của thanh MN',
    alt: 'Hai hình: sơ đồ thanh kim loại MN rơi vào từ trường đều dưới ranh giới OO phẩy và đồ thị vận tốc tăng tuyến tính rồi đạt không đổi 10 m/s',
    build: function (u) {
      var crosses = '';
      for (var row = 0; row < 4; row++) {
        for (var col = 0; col < 5; col++) {
          var cx = 148 + col * 46;
          var cy = 198 + row * 34;
          crosses += '<text x="' + cx + '" y="' + cy + '" fill="#38bdf8" font-size="15" font-weight="800" text-anchor="middle" opacity="0.82">×</text>';
        }
      }
      var svg1 =
        '<svg viewBox="0 0 480 350" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="12" y="12" width="456" height="326" rx="10" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Top resistor R = 8 Ohm
        '<line x1="140" y1="54" x2="140" y2="320" stroke="#94a3b8" stroke-width="3.5"/>' +
        '<line x1="340" y1="54" x2="340" y2="320" stroke="#94a3b8" stroke-width="3.5"/>' +
        '<line x1="140" y1="54" x2="205" y2="54" stroke="#94a3b8" stroke-width="3"/>' +
        '<rect x="205" y="40" width="70" height="28" rx="4" fill="#1e293b" stroke="#fbbf24" stroke-width="2"/>' +
        '<text x="240" y="59" fill="#fde68a" font-size="13.5" font-weight="800" text-anchor="middle">R = 8 Ω</text>' +
        '<line x1="275" y1="54" x2="340" y2="54" stroke="#94a3b8" stroke-width="3"/>' +
        // Falling bar MN
        '<g class="ambient-piston">' +
        '<rect x="136" y="108" width="208" height="12" rx="3" fill="#f59e0b" stroke="#fef08a" stroke-width="1.5"/>' +
        '<text x="122" y="119" fill="#fde047" font-size="15" font-weight="800" text-anchor="end">M</text>' +
        '<text x="358" y="119" fill="#fde047" font-size="15" font-weight="800" text-anchor="start">N</text>' +
        '<text x="240" y="96" fill="#cbd5e1" font-size="12.5" font-weight="700" text-anchor="middle">m = 0,4 kg · r = 2 Ω · l = 2 m</text>' +
        '</g>' +
        // Boundary OO'
        '<line x1="86" y1="166" x2="394" y2="166" stroke="#e2e8f0" stroke-width="2" stroke-dasharray="6 4"/>' +
        '<text x="76" y="170" fill="#e2e8f0" font-size="14" font-weight="800" text-anchor="end">O</text>' +
        '<text x="404" y="170" fill="#e2e8f0" font-size="14" font-weight="800" text-anchor="start">O′</text>' +
        // Field B crosses below OO'
        '<rect x="130" y="172" width="220" height="148" rx="6" fill="rgba(56,189,248,0.06)"/>' +
        crosses +
        '<text x="240" y="330" fill="#7dd3fc" font-size="12.5" font-weight="700" text-anchor="middle">Từ trường đều B (hướng vào trong)</text>' +
        '</svg>';

      var svg2 =
        '<svg viewBox="0 0 480 350" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><marker id="' + u + 'ax" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L9 5 L0 9 z" fill="#cbd5e1"/></marker></defs>' +
        '<rect x="12" y="12" width="456" height="326" rx="10" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Dashed grid lines: origin (78, 286), t=1 -> 218, t=2 -> 358 (step 140); v=5 -> 216, v=10 -> 146, v=15 -> 76
        '<line x1="78" y1="216" x2="412" y2="216" stroke="#1e293b" stroke-dasharray="4 4"/>' +
        '<line x1="78" y1="146" x2="412" y2="146" stroke="#334155" stroke-dasharray="4 4"/>' +
        '<line x1="78" y1="76" x2="412" y2="76" stroke="#1e293b" stroke-dasharray="4 4"/>' +
        '<line x1="218" y1="60" x2="218" y2="286" stroke="#334155" stroke-dasharray="4 4"/>' +
        '<line x1="358" y1="60" x2="358" y2="286" stroke="#1e293b" stroke-dasharray="4 4"/>' +
        // Axes
        '<line x1="78" y1="286" x2="430" y2="286" stroke="#cbd5e1" stroke-width="2.2" marker-end="url(#' + u + 'ax)"/>' +
        '<line x1="78" y1="286" x2="78" y2="48" stroke="#cbd5e1" stroke-width="2.2" marker-end="url(#' + u + 'ax)"/>' +
        '<text x="90" y="54" fill="#e2e8f0" font-size="14" font-weight="800">v (m/s)</text>' +
        '<text x="436" y="290" fill="#e2e8f0" font-size="14" font-weight="800">t (s)</text>' +
        // Ticks & clean numbers (NO pill overlap)
        '<text x="66" y="294" fill="#94a3b8" font-size="13" font-weight="700" text-anchor="end">0</text>' +
        '<text x="66" y="220" fill="#94a3b8" font-size="13" font-weight="700" text-anchor="end">5</text>' +
        '<text x="66" y="150" fill="#fbbf24" font-size="14" font-weight="800" text-anchor="end">10</text>' +
        '<text x="66" y="80" fill="#94a3b8" font-size="13" font-weight="700" text-anchor="end">15</text>' +
        '<text x="218" y="308" fill="#fbbf24" font-size="14" font-weight="800" text-anchor="middle">1</text>' +
        '<text x="358" y="308" fill="#7dd3fc" font-size="14" font-weight="800" text-anchor="middle">2</text>' +
        // Graph curve: (78,286) -> (218,146) -> (400,146)
        '<polyline points="78,286 218,146 398,146" fill="none" stroke="#38bdf8" stroke-width="3.6" stroke-linejoin="round"/>' +
        '<circle cx="218" cy="146" r="5" fill="#fbbf24" stroke="#070d1c" stroke-width="1.5"/>' +
        '<circle cx="358" cy="146" r="5" fill="#38bdf8" stroke="#070d1c" stroke-width="1.5"/>' +
        '<text x="288" y="128" fill="#7dd3fc" font-size="13" font-weight="700" text-anchor="middle">v = 10 m/s (không đổi)</text>' +
        '</svg>';

      return '<div class="vlxt-visual-container"><div class="vlxt-grid-2col">' +
        '<div class="vlxt-stage-wrap">' + captionHtml('fa-solid fa-bars', this.caption) + svg1 + '</div>' +
        '<div class="vlxt-stage-wrap">' + captionHtml('fa-solid fa-chart-line', this.caption2) + svg2 + '</div>' +
        '</div></div>';
    }
  },

  'MH-C3-61': {
    id: 'MH-C3-61',
    title: 'Thanh dẫn mn trượt trên hai thanh ray OA, OB hợp góc 45°',
    topic: 'DS-C3.2',
    layout: 'single',
    caption: 'Thanh mn chuyển động đều với vận tốc v = 2 m/s ra xa đỉnh O (góc AOB = 45°)',
    alt: 'Hai ray OA và OB hợp nhau 45 độ tại O trong từ trường B hướng vào, thanh thẳng đứng mn chuyển động sang phải',
    build: function (u) {
      var crosses = '';
      var pts = [
        [255,220],[325,220],[395,220],[465,220],[535,220],
        [340,145],[420,145],[500,145],[575,145],
        [430,248],[510,248]
      ];
      for (var i = 0; i < pts.length; i++) {
        crosses += '<text x="' + pts[i][0] + '" y="' + pts[i][1] + '" fill="#38bdf8" font-size="15" font-weight="800" text-anchor="middle" opacity="0.8">×</text>';
      }
      var svg =
        '<svg viewBox="0 0 700 340" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><marker id="' + u + 'vel" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L9 5 L0 9 z" fill="#10b981"/></marker></defs>' +
        '<rect x="16" y="16" width="668" height="308" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        crosses +
        // Origin O (150, 265), Rail OA horizontal right, Rail OB 45 deg up-right
        '<line x1="150" y1="265" x2="600" y2="265" stroke="#cbd5e1" stroke-width="3.5" stroke-linecap="round"/>' +
        '<line x1="150" y1="265" x2="375" y2="40" stroke="#cbd5e1" stroke-width="3.5" stroke-linecap="round"/>' +
        // Wait 45 deg up-right from (150,265): dx=225 -> dy=-225! Let's extend to x=430? Wait: y=40 is 225px above 265 -> right at (375,40)! Let's move origin left to (120, 275) so x=350 fits bar at dx=220 cleanly
        '<circle cx="150" cy="265" r="5" fill="#fbbf24"/>' +
        '<text x="134" y="274" fill="#fde047" font-size="15" font-weight="800" text-anchor="end">O</text>' +
        '<text x="608" y="270" fill="#e2e8f0" font-size="15" font-weight="800">A</text>' +
        '<text x="386" y="42" fill="#e2e8f0" font-size="15" font-weight="800">B</text>' +
        // 45° angle arc cleanly labeled
        '<path d="M 206 265 A 56 56 0 0 0 190 225" fill="none" stroke="#fbbf24" stroke-width="2.2"/>' +
        '<text x="218" y="250" fill="#fde047" font-size="15" font-weight="800">45°</text>' +
        // Vertical sliding bar mn at x = 310 (y from 265 up to 105)
        '<line x1="310" y1="105" x2="310" y2="265" stroke="#f59e0b" stroke-width="5.5" stroke-linecap="round"/>' +
        '<text x="304" y="92" fill="#fde68a" font-size="15" font-weight="800" text-anchor="end">m</text>' +
        '<text x="310" y="287" fill="#fde68a" font-size="15" font-weight="800" text-anchor="middle">n</text>' +
        '<text x="292" y="192" fill="#cbd5e1" font-size="13" font-weight="700" text-anchor="end">l₀ = 1 m</text>' +
        // Velocity arrow rightward
        '<line x1="312" y1="185" x2="392" y2="185" stroke="#10b981" stroke-width="3" marker-end="url(#' + u + 'vel)"/>' +
        '<text x="364" y="176" fill="#6ee7b7" font-size="14" font-weight="800">v = 2 m/s</text>' +
        // Info box top right
        '<rect x="462" y="42" width="196" height="82" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.4"/>' +
        '<text x="560" y="66" fill="#7dd3fc" font-size="13.5" font-weight="800" text-anchor="middle">B = 0,1 T (⊕ vào trong)</text>' +
        '<text x="560" y="90" fill="#e2e8f0" font-size="13" text-anchor="middle">Điện trở khung R = 2 Ω</text>' +
        '<text x="560" y="110" fill="#cbd5e1" font-size="12" text-anchor="middle">Thanh mn ⊥ OA tại t = 0</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-ruler-combined', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C3-62': {
    id: 'MH-C3-62',
    title: 'Thanh MN trượt trên mặt phẳng nghiêng góc 30° trong từ trường thẳng đứng',
    topic: 'DS-C3.2',
    layout: 'single',
    caption: 'Mặt nghiêng α = 30°, hai dây ray nối điện trở R = 0,4 Ω, cảm ứng từ B hướng thẳng đứng lên',
    alt: 'Hai ray song song nghiêng góc 30 độ, đầu trên nối điện trở R, thanh MN trượt xuống trong từ trường B hướng lên',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 360" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><marker id="' + u + 'upB" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L9 5 L0 9 z" fill="#38bdf8"/></marker></defs>' +
        '<rect x="16" y="16" width="668" height="328" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Horizontal ground reference + inclined plane wedge
        '<line x1="70" y1="304" x2="620" y2="304" stroke="#475569" stroke-width="2.5"/>' +
        '<polygon points="100,114 100,304 540,304" fill="rgba(30,41,59,0.45)" stroke="#475569" stroke-width="1.8"/>' +
        // Perspective inclined rails descending L -> R
        // Top rail: A(108, 108) -> (468, 254), Bottom rail: B(180, 148) -> (540, 294)
        '<line x1="108" y1="108" x2="468" y2="254" stroke="#cbd5e1" stroke-width="3.2"/>' +
        '<line x1="180" y1="148" x2="540" y2="294" stroke="#cbd5e1" stroke-width="3.2"/>' +
        // Top resistor R between A and B
        '<line x1="108" y1="108" x2="180" y2="148" stroke="#94a3b8" stroke-width="2.4"/>' +
        '<rect x="118" y="106" width="52" height="28" rx="4" transform="rotate(29 144 120)" fill="#1e293b" stroke="#fbbf24" stroke-width="2"/>' +
        '<text x="144" y="126" fill="#fde047" font-size="13" font-weight="800" text-anchor="middle">R</text>' +
        '<text x="96" y="104" fill="#e2e8f0" font-size="14" font-weight="800" text-anchor="end">A</text>' +
        '<text x="192" y="144" fill="#e2e8f0" font-size="14" font-weight="800" text-anchor="start">B</text>' +
        // Sliding bar MN at midway
        '<line x1="308" y1="189" x2="380" y2="229" stroke="#f59e0b" stroke-width="6" stroke-linecap="round"/>' +
        '<text x="300" y="182" fill="#fde047" font-size="14.5" font-weight="800" text-anchor="end">N</text>' +
        '<text x="388" y="242" fill="#fde047" font-size="14.5" font-weight="800" text-anchor="start">M</text>' +
        // Angle alpha = 30 deg
        '<path d="M 476 304 A 56 56 0 0 1 482 280" fill="none" stroke="#10b981" stroke-width="2"/>' +
        '<text x="458" y="295" fill="#6ee7b7" font-size="13.5" font-weight="800" text-anchor="end">α = 30°</text>' +
        // Vertical upward B field vectors
        '<line x1="255" y1="196" x2="255" y2="108" stroke="#38bdf8" stroke-width="2.6" marker-end="url(#' + u + 'upB)"/>' +
        '<line x1="344" y1="176" x2="344" y2="88" stroke="#38bdf8" stroke-width="2.6" marker-end="url(#' + u + 'upB)"/>' +
        '<line x1="428" y1="214" x2="428" y2="126" stroke="#38bdf8" stroke-width="2.6" marker-end="url(#' + u + 'upB)"/>' +
        '<text x="344" y="76" fill="#7dd3fc" font-size="14.5" font-weight="800" text-anchor="middle">B = 0,5 T (hướng lên)</text>' +
        // Specs panel right
        '<rect x="492" y="42" width="174" height="106" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.4"/>' +
        '<text x="579" y="66" fill="#fbbf24" font-size="13" font-weight="800" text-anchor="middle">Thông số thanh MN</text>' +
        '<text x="506" y="90" fill="#e2e8f0" font-size="12.5">• m = 50 g · l = 20 cm</text>' +
        '<text x="506" y="112" fill="#e2e8f0" font-size="12.5">• R = 0,4 Ω · α = 30°</text>' +
        '<text x="506" y="134" fill="#cbd5e1" font-size="12">• Trượt không ma sát</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-sliders', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C3-63': {
    id: 'MH-C3-63',
    title: 'Bốn thanh dẫn thẳng chuyển động tách ra xa nhau tạo hình vuông MNPQ',
    topic: 'DS-C3.2',
    layout: 'single',
    caption: 'Bốn thanh chuyển động ra xa nhau với tốc độ không đổi v₀ trong từ trường đều B',
    alt: 'Bốn vật dẫn thẳng dài giao nhau tạo hình vuông MNPQ chuyển động vuông góc ra bốn hướng với vận tốc v0',
    build: function (u) {
      var crosses = '';
      for (var r = 0; r < 4; r++) {
        for (var c = 0; c < 4; c++) {
          crosses += '<text x="' + (216 + c * 42) + '" y="' + (120 + r * 42) + '" fill="#38bdf8" font-size="15" font-weight="800" text-anchor="middle" opacity="0.75">×</text>';
        }
      }
      var svg =
        '<svg viewBox="0 0 700 350" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><marker id="' + u + 'v0" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L9 5 L0 9 z" fill="#10b981"/></marker></defs>' +
        '<rect x="16" y="16" width="668" height="318" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        crosses +
        // Intersecting rods forming square M(205,105) N(355,105) P(355,255) Q(205,255)
        '<line x1="145" y1="105" x2="415" y2="105" stroke="#fbbf24" stroke-width="4" stroke-linecap="round"/>' +
        '<line x1="145" y1="255" x2="415" y2="255" stroke="#fbbf24" stroke-width="4" stroke-linecap="round"/>' +
        '<line x1="205" y1="55" x2="205" y2="305" stroke="#f59e0b" stroke-width="4" stroke-linecap="round"/>' +
        '<line x1="355" y1="55" x2="355" y2="305" stroke="#f59e0b" stroke-width="4" stroke-linecap="round"/>' +
        // Corner labels M, N, P, Q cleanly outside intersections
        '<text x="192" y="96" fill="#fde047" font-size="15" font-weight="800" text-anchor="end">M</text>' +
        '<text x="368" y="96" fill="#fde047" font-size="15" font-weight="800" text-anchor="start">N</text>' +
        '<text x="368" y="274" fill="#fde047" font-size="15" font-weight="800" text-anchor="start">P</text>' +
        '<text x="192" y="274" fill="#fde047" font-size="15" font-weight="800" text-anchor="end">Q</text>' +
        // 4 outward velocity arrows v0
        '<line x1="280" y1="105" x2="280" y2="54" stroke="#10b981" stroke-width="2.8" marker-end="url(#' + u + 'v0)"/>' +
        '<text x="292" y="64" fill="#6ee7b7" font-size="13.5" font-weight="800">v₀</text>' +
        '<line x1="280" y1="255" x2="280" y2="306" stroke="#10b981" stroke-width="2.8" marker-end="url(#' + u + 'v0)"/>' +
        '<text x="292" y="302" fill="#6ee7b7" font-size="13.5" font-weight="800">v₀</text>' +
        '<line x1="205" y1="180" x2="152" y2="180" stroke="#10b981" stroke-width="2.8" marker-end="url(#' + u + 'v0)"/>' +
        '<text x="144" y="185" fill="#6ee7b7" font-size="13.5" font-weight="800" text-anchor="end">v₀</text>' +
        '<line x1="355" y1="180" x2="408" y2="180" stroke="#10b981" stroke-width="2.8" marker-end="url(#' + u + 'v0)"/>' +
        '<text x="416" y="185" fill="#6ee7b7" font-size="13.5" font-weight="800">v₀</text>' +
        // Specs card right
        '<rect x="462" y="88" width="198" height="162" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>' +
        '<text x="561" y="118" fill="#38bdf8" font-size="14" font-weight="800" text-anchor="middle">Thông số khung MNPQ</text>' +
        '<text x="478" y="148" fill="#e2e8f0" font-size="13">• Cạnh ban đầu: a</text>' +
        '<text x="478" y="174" fill="#e2e8f0" font-size="13">• Tốc độ tách: v₀ = const</text>' +
        '<text x="478" y="200" fill="#e2e8f0" font-size="13">• Điện trở dài: λ (Ω/m)</text>' +
        '<text x="478" y="226" fill="#7dd3fc" font-size="13">• Từ trường đều B ⊥ mp</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-up-down-left-right', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C3-64': {
    id: 'MH-C3-64',
    title: 'Kéo dãn khung dây hình vuông cạnh l = 20 cm thành hình thoi góc θ = 120°',
    topic: 'DS-C3.2',
    layout: 'grid-2col',
    caption: 'Trạng thái đầu: Khung vuông cạnh l = 20 cm trong từ trường B = 0,5 T',
    caption2: 'Trạng thái sau (Δt = 0,05 s): Kéo thành hình thoi có góc ở đỉnh θ = 120°',
    alt: 'Hai trạng thái của khung dây kín đặt vuông góc từ trường B hướng vào: hình vuông ban đầu và hình thoi bị kéo dãn có góc 120 độ',
    build: function (u) {
      var c1 = '';
      var crossPts1 = [
        [90,82],[240,56],[390,82],
        [82,170],[240,170],[398,170],
        [90,260],[240,284],[390,260]
      ];
      for (var i = 0; i < crossPts1.length; i++) {
        c1 += '<text x="' + crossPts1[i][0] + '" y="' + crossPts1[i][1] + '" fill="#38bdf8" font-size="15" font-weight="800" text-anchor="middle" opacity="0.7">×</text>';
      }
      var svg1 =
        '<svg viewBox="0 0 480 340" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="12" y="12" width="456" height="316" rx="10" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        c1 +
        // Diamond square rotated 45 deg: center (240, 170), half-diag 96
        '<polygon points="240,74 336,170 240,266 144,170" fill="rgba(251,191,36,0.10)" stroke="#fbbf24" stroke-width="3.6" stroke-linejoin="round"/>' +
        // Right angle marker at left vertex (144,170)
        '<polyline points="154,160 164,170 154,180" fill="none" stroke="#fde047" stroke-width="2"/>' +
        '<text x="180" y="114" fill="#fde047" font-size="14" font-weight="800" text-anchor="end">l = 20 cm</text>' +
        '<text x="306" y="114" fill="#fde047" font-size="14" font-weight="800" text-anchor="start">l</text>' +
        '<text x="240" y="302" fill="#7dd3fc" font-size="13" font-weight="700" text-anchor="middle">B = 0,5 T (hướng vào trong)</text>' +
        '</svg>';

      var svg2 =
        '<svg viewBox="0 0 480 340" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><marker id="' + u + 'pull" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L9 5 L0 9 z" fill="#f87171"/></marker></defs>' +
        '<rect x="12" y="12" width="456" height="316" rx="10" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        c1 +
        // Stretched rhombus: apex 120 deg at top/bottom -> horizontal half-diag 118, vertical half-diag 68
        '<polygon points="240,102 358,170 240,238 122,170" fill="rgba(251,191,36,0.10)" stroke="#fbbf24" stroke-width="3.6" stroke-linejoin="round"/>' +
        // Dashed diagonals a (horizontal) & b (vertical)
        '<line x1="122" y1="170" x2="358" y2="170" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 3"/>' +
        '<line x1="240" y1="102" x2="240" y2="238" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 3"/>' +
        '<text x="296" y="162" fill="#e2e8f0" font-size="13" font-weight="800">a</text>' +
        '<text x="250" y="138" fill="#e2e8f0" font-size="13" font-weight="800">b</text>' +
        // Top apex angle arc theta = 120 deg
        '<path d="M 218 115 A 25 25 0 0 0 262 115" fill="none" stroke="#10b981" stroke-width="2.2"/>' +
        '<text x="240" y="88" fill="#6ee7b7" font-size="14" font-weight="800" text-anchor="middle">θ = 120°</text>' +
        // Pull arrows at left and right vertices
        '<line x1="120" y1="170" x2="72" y2="170" stroke="#f87171" stroke-width="3" marker-end="url(#' + u + 'pull)"/>' +
        '<line x1="360" y1="170" x2="408" y2="170" stroke="#f87171" stroke-width="3" marker-end="url(#' + u + 'pull)"/>' +
        '<text x="64" y="160" fill="#fca5a5" font-size="12.5" font-weight="800" text-anchor="end">Kéo</text>' +
        '<text x="416" y="160" fill="#fca5a5" font-size="12.5" font-weight="800" text-anchor="start">Kéo</text>' +
        '<text x="240" y="302" fill="#cbd5e1" font-size="13" font-weight="700" text-anchor="middle">R = 5 Ω · Δt = 0,05 s</text>' +
        '</svg>';

      return '<div class="vlxt-visual-container"><div class="vlxt-grid-2col">' +
        '<div class="vlxt-stage-wrap">' + captionHtml('fa-regular fa-square', this.caption) + svg1 + '</div>' +
        '<div class="vlxt-stage-wrap">' + captionHtml('fa-solid fa-up-right-and-down-left-from-center', this.caption2) + svg2 + '</div>' +
        '</div></div>';
    }
  },

  'MH-C3-65': {
    id: 'MH-C3-65',
    title: 'Ném ngang khung dây vuông cạnh a trong từ trường biến thiên B = B₀ + kZ',
    topic: 'DS-C3.2',
    layout: 'single',
    caption: 'Khung dây vuông cạnh a được ném ngang với vận tốc v₀ từ độ cao Z₀',
    alt: 'Hệ trục thẳng đứng OZ và mặt đất Ox, khung dây vuông ném ngang với v0 trong vùng từ trường phụ thuộc độ cao Z',
    build: function (u) {
      var crosses = '';
      var pts65 = [
        [220,148],[315,108],[410,108],
        [220,200],[315,174],[410,174],[520,174],[605,174],
        [220,248],[315,248],[410,248],[520,248],[605,248]
      ];
      for (var p65 = 0; p65 < pts65.length; p65++) {
        crosses += '<text x="' + pts65[p65][0] + '" y="' + pts65[p65][1] + '" fill="#38bdf8" font-size="16" font-weight="800" text-anchor="middle" opacity="0.65">×</text>';
      }
      var svg =
        '<svg viewBox="0 0 700 350" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs>' +
        '<marker id="' + u + 'ax" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L9 5 L0 9 z" fill="#cbd5e1"/></marker>' +
        '<marker id="' + u + 'v0" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L9 5 L0 9 z" fill="#10b981"/></marker>' +
        '</defs>' +
        '<rect x="16" y="16" width="668" height="318" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        crosses +
        // Vertical Z axis & Horizontal Ox ground
        '<line x1="120" y1="292" x2="620" y2="292" stroke="#cbd5e1" stroke-width="2.4" marker-end="url(#' + u + 'ax)"/>' +
        '<line x1="120" y1="292" x2="120" y2="48" stroke="#cbd5e1" stroke-width="2.4" marker-end="url(#' + u + 'ax)"/>' +
        '<text x="108" y="308" fill="#cbd5e1" font-size="14" font-weight="800" text-anchor="end">O</text>' +
        '<text x="630" y="296" fill="#cbd5e1" font-size="14" font-weight="800">x</text>' +
        '<text x="108" y="56" fill="#cbd5e1" font-size="14" font-weight="800" text-anchor="end">Z</text>' +
        // Z0 marker + Square frame at height Z0
        '<text x="104" y="122" fill="#fde047" font-size="14" font-weight="800" text-anchor="end">Z₀</text>' +
        '<line x1="114" y1="118" x2="148" y2="118" stroke="#fbbf24" stroke-width="1.4" stroke-dasharray="3 3"/>' +
        '<rect x="150" y="96" width="46" height="46" rx="2" fill="rgba(251,191,36,0.16)" stroke="#fbbf24" stroke-width="3"/>' +
        '<text x="173" y="123" fill="#fde047" font-size="13" font-weight="800" text-anchor="middle">a</text>' +
        // v0 vector
        '<line x1="198" y1="118" x2="278" y2="118" stroke="#10b981" stroke-width="3" marker-end="url(#' + u + 'v0)"/>' +
        '<text x="242" y="106" fill="#6ee7b7" font-size="14" font-weight="800" text-anchor="middle">v₀</text>' +
        // Parabolic descent curve
        '<path d="M 196 118 Q 360 128 485 270" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="6 4"/>' +
        '<rect x="334" y="182" width="46" height="46" rx="2" fill="rgba(251,191,36,0.10)" stroke="#fbbf24" stroke-width="2" stroke-dasharray="4 2"/>' +
        // Law box
        '<rect x="444" y="54" width="218" height="92" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.4"/>' +
        '<text x="553" y="80" fill="#7dd3fc" font-size="13.5" font-weight="800" text-anchor="middle">Quy luật từ trường B(Z)</text>' +
        '<text x="553" y="104" fill="#e2e8f0" font-size="13.5" font-weight="700" text-anchor="middle">B = B₀ + k·Z (k &gt; 0)</text>' +
        '<text x="553" y="128" fill="#cbd5e1" font-size="12" text-anchor="middle">Khung thẳng đứng, ⊥ với B</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-arrow-trend-down', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C3-66': {
    id: 'MH-C3-66',
    title: 'Khung dây vuông ABCD (200 vòng) tịnh tiến qua vùng từ trường đều',
    topic: 'DS-C3.2',
    layout: 'single',
    caption: 'Khung dây vuông cạnh a = 10 cm (200 vòng, R = 2,5 Ω) chuyển động đều v = 0,2 m/s',
    alt: 'Khung vuông ABCD đi từ trái sang phải với vận tốc v tiến vào vùng từ trường đều A phẩy B phẩy C phẩy D phẩy',
    build: function (u) {
      var crosses = '';
      for (var r = 0; r < 4; r++) {
        for (var c = 0; c < 4; c++) {
          crosses += '<text x="' + (350 + c * 42) + '" y="' + (116 + r * 44) + '" fill="#38bdf8" font-size="15" font-weight="800" text-anchor="middle">×</text>';
        }
      }
      var svg =
        '<svg viewBox="0 0 700 330" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><marker id="' + u + 'vel" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L9 5 L0 9 z" fill="#10b981"/></marker></defs>' +
        '<rect x="16" y="16" width="668" height="298" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Field box D'C'B'A'
        '<rect x="320" y="84" width="190" height="176" rx="4" fill="rgba(56,189,248,0.08)" stroke="#38bdf8" stroke-width="2.2" stroke-dasharray="6 4"/>' +
        crosses +
        '<text x="320" y="72" fill="#7dd3fc" font-size="14" font-weight="800" text-anchor="middle">D′</text>' +
        '<text x="510" y="72" fill="#7dd3fc" font-size="14" font-weight="800" text-anchor="middle">C′</text>' +
        '<text x="510" y="280" fill="#7dd3fc" font-size="14" font-weight="800" text-anchor="middle">B′</text>' +
        '<text x="320" y="280" fill="#7dd3fc" font-size="14" font-weight="800" text-anchor="middle">A′</text>' +
        // Translating square frame ABCD on left
        '<g class="ambient-piston-x">' +
        '<rect x="108" y="116" width="112" height="112" rx="2" fill="rgba(251,191,36,0.12)" stroke="#fbbf24" stroke-width="3.6"/>' +
        '<text x="100" y="108" fill="#fde047" font-size="14" font-weight="800" text-anchor="end">D</text>' +
        '<text x="226" y="108" fill="#fde047" font-size="14" font-weight="800" text-anchor="start">C</text>' +
        '<text x="226" y="242" fill="#fde047" font-size="14" font-weight="800" text-anchor="start">B</text>' +
        '<text x="100" y="242" fill="#fde047" font-size="14" font-weight="800" text-anchor="end">A</text>' +
        '<line x1="224" y1="172" x2="294" y2="172" stroke="#10b981" stroke-width="3" marker-end="url(#' + u + 'vel)"/>' +
        '<text x="260" y="160" fill="#6ee7b7" font-size="13.5" font-weight="800" text-anchor="middle">v = 0,2 m/s</text>' +
        '</g>' +
        // Specs panel right
        '<rect x="534" y="96" width="132" height="148" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.4"/>' +
        '<text x="600" y="122" fill="#fde68a" font-size="13" font-weight="800" text-anchor="middle">Khung ABCD</text>' +
        '<text x="546" y="148" fill="#e2e8f0" font-size="12.5">• a = 10 cm</text>' +
        '<text x="546" y="172" fill="#e2e8f0" font-size="12.5">• N = 200 vòng</text>' +
        '<text x="546" y="196" fill="#e2e8f0" font-size="12.5">• R = 2,5 Ω</text>' +
        '<text x="546" y="220" fill="#7dd3fc" font-size="12.5">• B = 0,4 T</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-right-long', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C3-67': {
    id: 'MH-C3-67',
    title: 'Công tắc điện từ (Rơ-le đóng ngắt mạch)',
    topic: 'DS-C3.4',
    layout: 'single',
    caption: 'Cấu tạo rơ-le gồm cuộn dây nam châm điện, cánh tay động, lò xo hồi và bộ tiếp điểm',
    alt: 'Sơ đồ rơ-le gồm mạch điều khiển qua cuộn nam châm điện thẳng đứng hút cánh tay sắt non đóng tiếp điểm mạch công suất',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 350" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="16" y="16" width="668" height="318" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Vertical iron core & coil bottom center
        '<rect x="275" y="162" width="46" height="106" rx="3" fill="#475569" stroke="#94a3b8" stroke-width="2"/>' +
        '<rect x="260" y="182" width="76" height="72" rx="6" fill="#92400e" stroke="#fbbf24" stroke-width="2.2"/>' +
        '<line x1="262" y1="196" x2="334" y2="196" stroke="#fde68a" stroke-width="1.6"/>' +
        '<line x1="262" y1="210" x2="334" y2="210" stroke="#fde68a" stroke-width="1.6"/>' +
        '<line x1="262" y1="224" x2="334" y2="224" stroke="#fde68a" stroke-width="1.6"/>' +
        '<line x1="262" y1="238" x2="334" y2="238" stroke="#fde68a" stroke-width="1.6"/>' +
        // Control coil terminals
        '<polyline points="260,218 190,218 190,286 250,286" fill="none" stroke="#38bdf8" stroke-width="2.4" class="ambient-wire-pulse"/>' +
        '<polyline points="336,218 392,218 392,286 330,286" fill="none" stroke="#38bdf8" stroke-width="2.4"/>' +
        '<text x="291" y="314" fill="#7dd3fc" font-size="13" font-weight="800" text-anchor="middle">Mạch điều khiển (5 V · 50 Ω)</text>' +
        // Pivoted armature lever
        '<polygon points="172,150 156,184 188,184" fill="#334155" stroke="#94a3b8" stroke-width="1.8"/>' +
        '<line x1="142" y1="142" x2="432" y2="142" stroke="#cbd5e1" stroke-width="8" stroke-linecap="round"/>' +
        // Return spring left
        '<path d="M 148 148 L 138 162 L 158 172 L 138 182 L 158 192 L 148 206" fill="none" stroke="#10b981" stroke-width="2.2"/>' +
        '<line x1="128" y1="206" x2="168" y2="206" stroke="#64748b" stroke-width="3"/>' +
        '<text x="118" y="182" fill="#6ee7b7" font-size="12.5" font-weight="700" text-anchor="end">Lò xo hồi</text>' +
        // Contacts upper right
        '<circle cx="432" cy="142" r="7" fill="#fbbf24"/>' +
        '<circle cx="432" cy="110" r="7" fill="#ef4444"/>' +
        '<polyline points="439,110 538,110 538,176" fill="none" stroke="#f87171" stroke-width="3"/>' +
        '<polyline points="439,142 492,142 492,202 538,202" fill="none" stroke="#10b981" stroke-width="3"/>' +
        '<rect x="520" y="176" width="136" height="44" rx="7" fill="#0f172a" stroke="#f87171" stroke-width="1.5"/>' +
        '<text x="588" y="203" fill="#fca5a5" font-size="13" font-weight="800" text-anchor="middle">Mạch tải thứ hai</text>' +
        // Callouts
        '<text x="298" y="122" fill="#e2e8f0" font-size="13.5" font-weight="800" text-anchor="middle">Cánh tay động (sắt non)</text>' +
        '<text x="432" y="88" fill="#fca5a5" font-size="13" font-weight="800" text-anchor="middle">Bộ tiếp điểm</text>' +
        '<text x="176" y="246" fill="#fde68a" font-size="12.5" font-weight="700" text-anchor="end">Nam châm điện</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-toggle-on', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C3-68': {
    id: 'MH-C3-68',
    title: 'Rơ-le đóng tiếp điểm A-B và mạch báo cháy cảm biến nhiệt X (80°C)',
    topic: 'DS-C3.4',
    layout: 'grid-2col',
    caption: 'Hình 1: Rơ-le dùng nguồn một chiều và khóa S đóng ngắt mạch AB',
    caption2: 'Hình 2: Mạch báo cháy kết hợp nhiệt điện trở X với chuông báo động',
    alt: 'Hai hình: sơ đồ cấu tạo rơ-le với cực dương pin bên phải D nối qua khóa S và mạch ứng dụng báo cháy mắc điện trở nhiệt X nối tiếp cuộn CD',
    build: function (u) {
      var svg1 =
        '<svg viewBox="0 0 480 350" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="12" y="12" width="456" height="326" rx="10" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Dashed Relay enclosure
        '<rect x="108" y="42" width="286" height="196" rx="8" fill="rgba(15,23,42,0.7)" stroke="#64748b" stroke-width="1.8" stroke-dasharray="6 4"/>' +
        '<text x="251" y="64" fill="#94a3b8" font-size="12.5" font-weight="800" text-anchor="middle">Khung Rơ-le</text>' +
        // Top contacts A - B
        '<line x1="70" y1="88" x2="180" y2="88" stroke="#e2e8f0" stroke-width="2.5"/>' +
        '<circle cx="180" cy="88" r="5" fill="#fbbf24"/>' +
        '<text x="64" y="93" fill="#fde047" font-size="14" font-weight="800" text-anchor="end">A</text>' +
        '<line x1="252" y1="88" x2="430" y2="88" stroke="#e2e8f0" stroke-width="2.5"/>' +
        '<circle cx="252" cy="88" r="5" fill="#fbbf24"/>' +
        '<text x="438" y="93" fill="#fde047" font-size="14" font-weight="800" text-anchor="start">B</text>' +
        // L-shaped soft iron hinged armature
        '<polyline points="200,98 200,154 248,154" fill="none" stroke="#94a3b8" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/>' +
        '<circle cx="200" cy="154" r="5" fill="#38bdf8"/>' +
        '<text x="150" y="128" fill="#cbd5e1" font-size="12.5" font-weight="700" text-anchor="middle">Thanh sắt non</text>' +
        '<text x="156" y="168" fill="#7dd3fc" font-size="12" text-anchor="middle">Trục quay</text>' +
        // Horizontal solenoid coil inside box between C and D
        '<rect x="264" y="138" width="92" height="32" rx="4" fill="#475569" stroke="#cbd5e1" stroke-width="1.5"/>' +
        '<rect x="276" y="132" width="68" height="44" rx="4" fill="#92400e" stroke="#fbbf24" stroke-width="2"/>' +
        '<text x="310" y="120" fill="#fde68a" font-size="12.5" font-weight="700" text-anchor="middle">Cuộn dây</text>' +
        '<line x1="286" y1="176" x2="286" y2="210" stroke="#38bdf8" stroke-width="2.2"/>' +
        '<line x1="334" y1="176" x2="334" y2="210" stroke="#38bdf8" stroke-width="2.2"/>' +
        '<circle cx="286" cy="210" r="4" fill="#e2e8f0"/><text x="272" y="216" fill="#e2e8f0" font-size="13.5" font-weight="800" text-anchor="end">C</text>' +
        '<circle cx="334" cy="210" r="4" fill="#e2e8f0"/><text x="348" y="216" fill="#e2e8f0" font-size="13.5" font-weight="800" text-anchor="start">D</text>' +
        // Bottom DC source: short '-' left (C), long '+' right (D) + switch S
        '<polyline points="286,210 286,282 296,282" fill="none" stroke="#38bdf8" stroke-width="2.2"/>' +
        '<polyline points="334,210 334,282 320,282" fill="none" stroke="#38bdf8" stroke-width="2.2"/>' +
        '<line x1="296" y1="270" x2="296" y2="294" stroke="#60a5fa" stroke-width="4"/>' +
        '<line x1="312" y1="260" x2="312" y2="304" stroke="#f87171" stroke-width="3"/>' +
        '<text x="284" y="266" fill="#60a5fa" font-size="15" font-weight="800">−</text>' +
        '<text x="322" y="266" fill="#f87171" font-size="15" font-weight="800">+</text>' +
        '<text x="218" y="286" fill="#cbd5e1" font-size="13" font-weight="700" text-anchor="end">Khóa S</text>' +
        '<line x1="226" y1="282" x2="262" y2="282" stroke="#cbd5e1" stroke-width="2.2"/>' +
        '<circle cx="262" cy="282" r="3" fill="#e2e8f0"/>' +
        '</svg>';

      var svg2 =
        '<svg viewBox="0 0 480 350" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="12" y="12" width="456" height="326" rx="10" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Relay dashed block center
        '<rect x="166" y="72" width="150" height="196" rx="8" fill="#0f172a" stroke="#64748b" stroke-width="1.8" stroke-dasharray="6 4"/>' +
        '<text x="241" y="96" fill="#94a3b8" font-size="13" font-weight="800" text-anchor="middle">RƠ LE</text>' +
        '<circle cx="166" cy="126" r="5" fill="#fbbf24"/><text x="180" y="131" fill="#fde047" font-size="13" font-weight="800">A</text>' +
        '<circle cx="316" cy="126" r="5" fill="#fbbf24"/><text x="302" y="131" fill="#fde047" font-size="13" font-weight="800" text-anchor="end">B</text>' +
        '<circle cx="166" cy="214" r="5" fill="#38bdf8"/><text x="180" y="219" fill="#7dd3fc" font-size="13" font-weight="800">C</text>' +
        '<circle cx="316" cy="214" r="5" fill="#38bdf8"/><text x="302" y="219" fill="#7dd3fc" font-size="13" font-weight="800" text-anchor="end">D</text>' +
        '<line x1="186" y1="126" x2="294" y2="112" stroke="#cbd5e1" stroke-width="3"/>' +
        '<rect x="206" y="196" width="70" height="34" rx="4" fill="#92400e" stroke="#fbbf24" stroke-width="2"/>' +
        // Left control loop with Thermistor X and Source U
        '<polyline points="166,214 68,214 68,298 370,298 370,214 316,214" fill="none" stroke="#38bdf8" stroke-width="2.4"/>' +
        '<rect x="86" y="200" width="54" height="28" rx="4" fill="#1e293b" stroke="#f87171" stroke-width="2"/>' +
        '<line x1="92" y1="234" x2="134" y2="192" stroke="#fca5a5" stroke-width="2"/>' +
        '<text x="113" y="219" fill="#fca5a5" font-size="14" font-weight="800" text-anchor="middle">X</text>' +
        '<text x="113" y="182" fill="#fca5a5" font-size="12.5" font-weight="700" text-anchor="middle">Nhiệt trở X (80°C)</text>' +
        '<rect x="190" y="284" width="62" height="28" rx="5" fill="#0f172a" stroke="#60a5fa" stroke-width="1.5"/>' +
        '<text x="221" y="303" fill="#93c5fd" font-size="13.5" font-weight="800" text-anchor="middle">Nguồn U</text>' +
        // Right alarm bell loop on A-B
        '<polyline points="316,126 420,126 420,62 380,62" fill="none" stroke="#fbbf24" stroke-width="2.4"/>' +
        '<polyline points="166,126 120,126 120,62 320,62" fill="none" stroke="#fbbf24" stroke-width="2.4"/>' +
        '<rect x="312" y="42" width="76" height="40" rx="8" fill="#1e293b" stroke="#f87171" stroke-width="2"/>' +
        '<text x="350" y="67" fill="#fca5a5" font-size="13.5" font-weight="800" text-anchor="middle">Chuông</text>' +
        '</svg>';

      return '<div class="vlxt-visual-container"><div class="vlxt-grid-2col">' +
        '<div class="vlxt-stage-wrap">' + captionHtml('fa-solid fa-sliders', this.caption) + svg1 + '</div>' +
        '<div class="vlxt-stage-wrap">' + captionHtml('fa-solid fa-bell', this.caption2) + svg2 + '</div>' +
        '</div></div>';
    }
  }

  ,'MH-C3-69': {
    id: 'MH-C3-69',
    title: 'Máy gia tốc hạt Cyclotron gồm hai hộp cực chữ D',
    topic: 'DS-C3.5',
    layout: 'single',
    caption: 'Proton xuất phát từ tâm S được tăng tốc qua khe hở giữa hai hộp D (R = 53 cm, f = 12 MHz)',
    alt: 'Sơ đồ hai hộp rỗng hình chữ D II và I nối với nguồn điện xoay chiều, quỹ đạo xoắn ốc bán kính tăng dần của proton',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 360" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><marker id="' + u + 'exit" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L9 5 L0 9 z" fill="#10b981"/></marker></defs>' +
        '<rect x="16" y="16" width="668" height="328" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Left D (II) and Right D (I)
        '<path d="M 224 62 A 118 118 0 0 0 224 298 Z" fill="rgba(180,83,9,0.22)" stroke="#fbbf24" stroke-width="3"/>' +
        '<path d="M 244 62 A 118 118 0 0 1 244 298 Z" fill="rgba(180,83,9,0.22)" stroke="#fbbf24" stroke-width="3"/>' +
        '<text x="150" y="114" fill="#fde68a" font-size="18" font-weight="800" text-anchor="middle">II</text>' +
        '<text x="318" y="114" fill="#fde68a" font-size="18" font-weight="800" text-anchor="middle">I</text>' +
        // Center ion source S
        '<circle cx="234" cy="180" r="5" fill="#ef4444"/>' +
        '<text x="234" y="198" fill="#fca5a5" font-size="13" font-weight="800" text-anchor="middle">S</text>' +
        // Expanding CCW spiral path starting rightward into I
        '<path d="M 234 180 A 14 14 0 0 0 234 152 L 224 152 A 28 28 0 0 0 224 208 L 244 208 A 42 42 0 0 0 244 124 L 224 124 A 56 56 0 0 0 224 236 L 244 236 A 70 70 0 0 0 244 96 L 224 96 A 84 84 0 0 0 224 264 L 244 264 A 98 98 0 0 0 330 120 L 382 68" fill="none" stroke="#38bdf8" stroke-width="2.6" marker-end="url(#' + u + 'exit)" class="ambient-ray-glide"/>' +
        '<text x="390" y="64" fill="#6ee7b7" font-size="13" font-weight="800">Chùm proton thoát ra</text>' +
        // AC oscillator at bottom
        '<polyline points="200,296 200,322 268,322 268,296" fill="none" stroke="#94a3b8" stroke-width="2"/>' +
        '<circle cx="234" cy="322" r="14" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>' +
        '<text x="234" y="328" fill="#7dd3fc" font-size="16" font-weight="800" text-anchor="middle">~</text>' +
        // Field B indicator & Specs panel
        '<rect x="410" y="102" width="250" height="196" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>' +
        '<text x="535" y="132" fill="#38bdf8" font-size="14" font-weight="800" text-anchor="middle">Thông số Cyclotron</text>' +
        '<text x="428" y="162" fill="#e2e8f0" font-size="13">• Bán kính hộp D: R = 53 cm</text>' +
        '<text x="428" y="188" fill="#e2e8f0" font-size="13">• Tần số dao động: f = 12 MHz</text>' +
        '<text x="428" y="214" fill="#e2e8f0" font-size="13">• Hạt proton: m = 1,67·10⁻²⁷ kg</text>' +
        '<text x="428" y="240" fill="#e2e8f0" font-size="13">• Điện tích: q = +1,6·10⁻¹⁹ C</text>' +
        '<text x="428" y="268" fill="#7dd3fc" font-size="12.5" font-weight="700">Từ trường đều B ⊥ mặt hộp D</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-hurricane', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C3-70': {
    id: 'MH-C3-70',
    title: 'Máy Gia tốc Hạt Lớn LHC (CERN) – Quỹ đạo tròn proton',
    topic: 'DS-C3.5',
    layout: 'single',
    caption: 'Lực từ đóng vai trò lực hướng tâm giữ hạt proton chuyển động tròn trong vùng B = 5 T',
    alt: 'Sơ đồ vành gia tốc tròn LHC và chuyển động tròn của hạt proton bán kính r = 0,4297 m trong từ trường siêu dẫn 5 T',
    build: function (u) {
      var crosses = '';
      for (var r = 0; r < 3; r++) {
        for (var c = 0; c < 3; c++) {
          crosses += '<text x="' + (154 + c * 68) + '" y="' + (120 + r * 66) + '" fill="#38bdf8" font-size="15" font-weight="800" text-anchor="middle" opacity="0.6">×</text>';
        }
      }
      var svg =
        '<svg viewBox="0 0 700 340" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs>' +
        '<marker id="' + u + 'v" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L9 5 L0 9 z" fill="#10b981"/></marker>' +
        '<marker id="' + u + 'f" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L9 5 L0 9 z" fill="#f87171"/></marker>' +
        '</defs>' +
        '<rect x="16" y="16" width="668" height="308" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        crosses +
        // Circular proton orbit
        '<circle cx="222" cy="176" r="102" fill="rgba(56,189,248,0.06)" stroke="#38bdf8" stroke-width="3" stroke-dasharray="10 6" class="ambient-ray-glide"/>' +
        '<circle cx="222" cy="176" r="4" fill="#94a3b8"/>' +
        '<line x1="222" y1="176" x2="310" y2="124" stroke="#94a3b8" stroke-width="1.6" stroke-dasharray="4 3"/>' +
        '<text x="274" y="160" fill="#cbd5e1" font-size="13" font-weight="700">r = 0,4297 m</text>' +
        // Proton particle at top of orbit (222, 74)
        '<circle cx="222" cy="74" r="9" fill="#f59e0b" stroke="#fef08a" stroke-width="2"/>' +
        '<text x="222" y="78" fill="#050811" font-size="12" font-weight="800" text-anchor="middle">+</text>' +
        '<line x1="232" y1="74" x2="306" y2="74" stroke="#10b981" stroke-width="2.8" marker-end="url(#' + u + 'v)"/>' +
        '<text x="314" y="78" fill="#6ee7b7" font-size="13.5" font-weight="800">v</text>' +
        '<line x1="222" y1="84" x2="222" y2="146" stroke="#f87171" stroke-width="2.8" marker-end="url(#' + u + 'f)"/>' +
        '<text x="206" y="122" fill="#fca5a5" font-size="13.5" font-weight="800" text-anchor="end">F_t</text>' +
        // Right LHC info panel
        '<rect x="394" y="56" width="268" height="232" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>' +
        '<text x="528" y="88" fill="#38bdf8" font-size="14.5" font-weight="800" text-anchor="middle">Máy gia tốc LHC (CERN)</text>' +
        '<text x="414" y="120" fill="#e2e8f0" font-size="13">• Chu vi vòng gia tốc: 27 km</text>' +
        '<text x="414" y="148" fill="#e2e8f0" font-size="13">• Nam châm siêu dẫn: B = 5 T</text>' +
        '<text x="414" y="176" fill="#e2e8f0" font-size="13">• Bán kính quỹ đạo: r = 0,4297 m</text>' +
        '<text x="414" y="204" fill="#e2e8f0" font-size="13">• m_p = 1,67·10⁻²⁷ kg</text>' +
        '<text x="414" y="232" fill="#e2e8f0" font-size="13">• |e| = 1,60·10⁻¹⁹ C</text>' +
        '<text x="414" y="264" fill="#fde68a" font-size="12.5" font-weight="700">Lực từ: F = B·v·|q| (⊥ với v)</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-atom', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C3-71': {
    id: 'MH-C3-71',
    title: 'Máy quang phổ khối đo khối lượng ion',
    topic: 'DS-C3.5',
    layout: 'single',
    caption: 'Ion từ nguồn S được tăng tốc qua hiệu điện thế U rồi uốn nửa đường tròn trong từ trường B hướng ra',
    alt: 'Sơ đồ máy quang phổ khối gồm nguồn ion S, vùng tăng tốc U, buồng từ trường B chấm tròn hướng ra và cảm biến ở khoảng cách x',
    build: function (u) {
      var dots = '';
      var cols = [235, 315, 395, 475, 555];
      var rows = [92, 146, 200];
      for (var r = 0; r < rows.length; r++) {
        for (var c = 0; c < cols.length; c++) {
          dots += '<circle cx="' + cols[c] + '" cy="' + rows[r] + '" r="3" fill="#38bdf8" opacity="0.75"/>' +
            '<circle cx="' + cols[c] + '" cy="' + rows[r] + '" r="7" fill="none" stroke="#38bdf8" stroke-width="1" opacity="0.45"/>';
        }
      }
      var svg =
        '<svg viewBox="0 0 700 360" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><marker id="' + u + 'ar" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L9 5 L0 9 z" fill="#fbbf24"/></marker></defs>' +
        '<rect x="16" y="16" width="668" height="328" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Separation chamber upper
        '<rect x="186" y="54" width="444" height="176" rx="6" fill="rgba(15,23,42,0.85)" stroke="#64748b" stroke-width="2.2"/>' +
        dots +
        '<text x="580" y="78" fill="#7dd3fc" font-size="13.5" font-weight="800" text-anchor="end">B = 80 mT (⊙ hướng ra)</text>' +
        // Accelerating plates below entrance slit x=275
        '<line x1="220" y1="230" x2="262" y2="230" stroke="#94a3b8" stroke-width="4"/>' +
        '<line x1="288" y1="230" x2="630" y2="230" stroke="#94a3b8" stroke-width="4"/>' +
        '<line x1="220" y1="292" x2="330" y2="292" stroke="#f87171" stroke-width="3.5"/>' +
        '<text x="210" y="296" fill="#fca5a5" font-size="14" font-weight="800" text-anchor="end">+ (U)</text>' +
        '<text x="210" y="236" fill="#7dd3fc" font-size="14" font-weight="800" text-anchor="end">−</text>' +
        // Source S
        '<circle cx="275" cy="292" r="7" fill="#fbbf24"/>' +
        '<text x="275" y="320" fill="#fde047" font-size="14" font-weight="800" text-anchor="middle">Nguồn S (+q)</text>' +
        // Acceleration beam straight up then CW semicircle of radius r = 110 -> hits x = 495
        '<line x1="275" y1="284" x2="275" y2="234" stroke="#fbbf24" stroke-width="3" marker-end="url(#' + u + 'ar)"/>' +
        '<path d="M 275 230 A 110 110 0 0 1 495 224" fill="none" stroke="#fbbf24" stroke-width="3.2" stroke-dasharray="8 5" class="ambient-ray-glide"/>' +
        // Radius marker
        '<line x1="385" y1="230" x2="385" y2="120" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 3"/>' +
        '<text x="394" y="168" fill="#cbd5e1" font-size="14" font-weight="800">r</text>' +
        // Sensor bar & distance x
        '<rect x="462" y="220" width="76" height="12" rx="3" fill="#10b981"/>' +
        '<text x="500" y="256" fill="#6ee7b7" font-size="13.5" font-weight="800" text-anchor="middle">Cảm biến</text>' +
        '<line x1="275" y1="264" x2="495" y2="264" stroke="#38bdf8" stroke-width="1.8"/>' +
        '<text x="385" y="284" fill="#7dd3fc" font-size="14" font-weight="800" text-anchor="middle">x = 1,6254 m</text>' +
        // Side summary U=1000 V
        '<rect x="40" y="88" width="126" height="92" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.4"/>' +
        '<text x="103" y="114" fill="#fde68a" font-size="13" font-weight="800" text-anchor="middle">Tăng tốc</text>' +
        '<text x="103" y="138" fill="#e2e8f0" font-size="12.5" text-anchor="middle">U = 1000 V</text>' +
        '<text x="103" y="160" fill="#cbd5e1" font-size="12" text-anchor="middle">B = 80 mT</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-magnet', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C3-72': {
    id: 'MH-C3-72',
    title: 'Máy quang phổ tách đồng vị Uranium U-235 và U-238',
    topic: 'DS-C3.5',
    layout: 'single',
    caption: 'Các ion ²³⁵U và ²³⁸U bay vào từ trường B = 0,25 T bị uốn thành hai nửa đường tròn bán kính khác nhau',
    alt: 'Bể chân không tách đồng vị Uranium: nguồn ion bắn qua khe hẹp vào từ trường đều tách thành hai quỹ đạo bán kính nhỏ U-235 và lớn U-238',
    build: function (u) {
      var dots = '';
      for (var r = 0; r < 3; r++) {
        for (var c = 0; c < 4; c++) {
          dots += '<circle cx="' + (246 + c * 92) + '" cy="' + (90 + r * 58) + '" r="3" fill="#38bdf8" opacity="0.65"/>';
        }
      }
      var svg =
        '<svg viewBox="0 0 700 350" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="16" y="16" width="668" height="318" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Vacuum chamber
        '<rect x="170" y="54" width="470" height="232" rx="10" fill="#0f172a" stroke="#64748b" stroke-width="2.4"/>' +
        '<text x="405" y="76" fill="#94a3b8" font-size="13" font-weight="800" text-anchor="middle">Bể chân không (Từ trường đều B = 0,25 T)</text>' +
        dots +
        // Ion source UCl4 on left bottom shooting upward from slit (235, 254)
        '<rect x="40" y="218" width="126" height="58" rx="8" fill="#1e293b" stroke="#fbbf24" stroke-width="2"/>' +
        '<text x="103" y="244" fill="#fde68a" font-size="13" font-weight="800" text-anchor="middle">Nguồn ion U</text>' +
        '<text x="103" y="264" fill="#cbd5e1" font-size="12" text-anchor="middle">v = 3·10⁵ m/s</text>' +
        '<line x1="166" y1="248" x2="235" y2="248" stroke="#fbbf24" stroke-width="3"/>' +
        '<line x1="235" y1="248" x2="235" y2="230" stroke="#fbbf24" stroke-width="3"/>' +
        // Two collector arcs curving right from (235, 230):
        // U-235 smaller radius R1 = 96 -> lands at (427, 230)
        '<path d="M 235 230 A 96 96 0 0 1 427 230" fill="none" stroke="#10b981" stroke-width="3.2" stroke-dasharray="8 4" class="ambient-ray-glide"/>' +
        // U-238 larger radius R2 = 128 -> lands at (491, 230)
        '<path d="M 235 230 A 128 128 0 0 1 491 230" fill="none" stroke="#f59e0b" stroke-width="3.2" stroke-dasharray="8 4" class="ambient-ray-glide"/>' +
        // Collector cups
        '<rect x="412" y="232" width="32" height="20" rx="3" fill="#065f46" stroke="#34d399" stroke-width="1.8"/>' +
        '<text x="428" y="270" fill="#6ee7b7" font-size="13" font-weight="800" text-anchor="middle">²³⁵U</text>' +
        '<rect x="476" y="232" width="32" height="20" rx="3" fill="#92400e" stroke="#fbbf24" stroke-width="1.8"/>' +
        '<text x="492" y="270" fill="#fde047" font-size="13" font-weight="800" text-anchor="middle">²³⁸U</text>' +
        '<text x="330" y="156" fill="#6ee7b7" font-size="12.5" font-weight="700" text-anchor="middle">Quỹ đạo U-235</text>' +
        '<text x="362" y="96" fill="#fde047" font-size="12.5" font-weight="700" text-anchor="middle">Quỹ đạo U-238</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-code-branch', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C3-73': {
    id: 'MH-C3-73',
    title: 'Cấu tạo và nguyên lí hoạt động Micro điện động',
    topic: 'DS-C3.4',
    layout: 'single',
    caption: 'Sóng âm làm màng rung và ống dây 12 vòng di chuyển qua lại trong từ trường nam châm',
    alt: 'Sơ đồ micro điện động: sóng âm tác động vào màng rung gắn ống dây trượt quanh nam châm vĩnh cửu, đưa tín hiệu ra hai chân A B tới mạch khuếch đại',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 340" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="16" y="16" width="668" height="308" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Sound waves left
        '<path d="M 68 124 Q 82 170 68 216" fill="none" stroke="#38bdf8" stroke-width="2.6" class="ambient-heat-arrow"/>' +
        '<path d="M 92 110 Q 110 170 92 230" fill="none" stroke="#38bdf8" stroke-width="2.6" class="ambient-heat-arrow"/>' +
        '<path d="M 118 96 Q 138 170 118 244" fill="none" stroke="#38bdf8" stroke-width="2.6" class="ambient-heat-arrow"/>' +
        '<text x="92" y="76" fill="#7dd3fc" font-size="13.5" font-weight="800" text-anchor="middle">Sóng âm</text>' +
        // Diaphragm & moving coil assembly
        '<g class="ambient-piston-x">' +
        '<path d="M 164 82 Q 192 170 164 258" fill="none" stroke="#e2e8f0" stroke-width="5" stroke-linecap="round"/>' +
        '<rect x="182" y="130" width="94" height="80" rx="4" fill="rgba(251,191,36,0.16)" stroke="#fbbf24" stroke-width="2.5"/>' +
        // Coil windings
        '<line x1="200" y1="130" x2="200" y2="210" stroke="#f59e0b" stroke-width="3"/>' +
        '<line x1="216" y1="130" x2="216" y2="210" stroke="#f59e0b" stroke-width="3"/>' +
        '<line x1="232" y1="130" x2="232" y2="210" stroke="#f59e0b" stroke-width="3"/>' +
        '<line x1="248" y1="130" x2="248" y2="210" stroke="#f59e0b" stroke-width="3"/>' +
        '<line x1="264" y1="130" x2="264" y2="210" stroke="#f59e0b" stroke-width="3"/>' +
        '</g>' +
        // Stationary permanent bar magnet inside
        '<rect x="242" y="146" width="84" height="48" fill="#1d4ed8" stroke="#60a5fa" stroke-width="2"/>' +
        '<rect x="326" y="146" width="84" height="48" fill="#b91c1c" stroke="#f87171" stroke-width="2"/>' +
        '<text x="284" y="176" fill="#fff" font-size="16" font-weight="800" text-anchor="middle">S</text>' +
        '<text x="368" y="176" fill="#fff" font-size="16" font-weight="800" text-anchor="middle">N</text>' +
        // Output wires A, B -> Amplifier
        '<polyline points="200,210 200,278 468,278" fill="none" stroke="#fbbf24" stroke-width="2.4" class="ambient-wire-pulse"/>' +
        '<polyline points="264,210 264,254 468,254" fill="none" stroke="#38bdf8" stroke-width="2.4" class="ambient-wire-pulse"/>' +
        '<text x="454" y="248" fill="#7dd3fc" font-size="13" font-weight="800">A</text>' +
        '<text x="454" y="294" fill="#fde047" font-size="13" font-weight="800">B</text>' +
        '<rect x="472" y="232" width="166" height="64" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2"/>' +
        '<text x="555" y="261" fill="#6ee7b7" font-size="13.5" font-weight="800" text-anchor="middle">Mạch khuếch đại</text>' +
        '<text x="555" y="281" fill="#cbd5e1" font-size="12" text-anchor="middle">Truyền tín hiệu điện</text>' +
        // Labels top
        '<text x="164" y="64" fill="#f8fafc" font-size="13" font-weight="800" text-anchor="middle">Màng rung</text>' +
        '<text x="275" y="102" fill="#fde68a" font-size="13" font-weight="800" text-anchor="middle">Cuộn dây (12 vòng, di chuyển)</text>' +
        '<text x="368" y="128" fill="#fca5a5" font-size="13" font-weight="800" text-anchor="middle">Nam châm vĩnh cửu</text>' +
        '<rect x="454" y="64" width="206" height="92" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.4"/>' +
        '<text x="557" y="90" fill="#38bdf8" font-size="13.5" font-weight="800" text-anchor="middle">Thông số ống dây</text>' +
        '<text x="472" y="114" fill="#e2e8f0" font-size="12.5">• N = 12 vòng · S = 40 cm²</text>' +
        '<text x="472" y="138" fill="#e2e8f0" font-size="12.5">• |ΔB/Δt| = 5 T/s</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-microphone-lines', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C3-74': {
    id: 'MH-C3-74',
    title: 'Cấu tạo loa điện động và từ trường hướng kính tác dụng lực lên cuộn dây',
    topic: 'DS-C3.4',
    layout: 'grid-2col',
    caption: 'Hình a: Mặt cắt loa điện động (Nón loa, cuộn âm & nam châm tròn)',
    caption2: 'Hình b: Cực N ở lõi giữa, cực S ở vành ngoài và dòng điện I trên cuộn dây',
    alt: 'Hai hình cấu tạo loa điện động: mặt cắt dọc với nón loa và nam châm tròn, cùng hình chiếu mặt trước cực N trong và cực S ngoài',
    build: function (u) {
      var svg1 =
        '<svg viewBox="0 0 480 340" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="12" y="12" width="456" height="316" rx="10" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Round magnet at left-center
        '<rect x="86" y="88" width="96" height="164" rx="6" fill="#1e3a8a" stroke="#60a5fa" stroke-width="2"/>' +
        '<rect x="108" y="132" width="96" height="76" rx="4" fill="#b91c1c" stroke="#f87171" stroke-width="2"/>' +
        '<text x="156" y="176" fill="#fff" font-size="16" font-weight="800" text-anchor="middle">N</text>' +
        '<text x="116" y="114" fill="#e0f2fe" font-size="15" font-weight="800" text-anchor="middle">S</text>' +
        '<text x="116" y="236" fill="#e0f2fe" font-size="15" font-weight="800" text-anchor="middle">S</text>' +
        // Voice coil wrapped around core + speaker cone
        '<g class="ambient-piston-x">' +
        '<rect x="188" y="118" width="38" height="104" rx="4" fill="rgba(251,191,36,0.22)" stroke="#fbbf24" stroke-width="2.6"/>' +
        '<polyline points="226,118 320,56 320,284 226,222" fill="none" stroke="#e2e8f0" stroke-width="4" stroke-linejoin="round"/>' +
        '</g>' +
        // Metal frame
        '<polyline points="182,88 328,48" fill="none" stroke="#64748b" stroke-width="4"/>' +
        '<polyline points="182,252 328,292" fill="none" stroke="#64748b" stroke-width="4"/>' +
        // Input signal leads
        '<polyline points="196,222 196,294 148,294" fill="none" stroke="#fbbf24" stroke-width="2.2" class="ambient-wire-pulse"/>' +
        '<text x="140" y="299" fill="#fde047" font-size="12.5" font-weight="800" text-anchor="end">Tín hiệu (U = 12 V)</text>' +
        // Sound waves right
        '<path d="M 346 126 Q 364 170 346 214" fill="none" stroke="#38bdf8" stroke-width="2.6" class="ambient-heat-arrow"/>' +
        '<path d="M 374 108 Q 396 170 374 232" fill="none" stroke="#38bdf8" stroke-width="2.6" class="ambient-heat-arrow"/>' +
        '<text x="410" y="174" fill="#7dd3fc" font-size="13" font-weight="800" text-anchor="middle">Sóng âm</text>' +
        // Labels
        '<text x="272" y="46" fill="#cbd5e1" font-size="13" font-weight="800" text-anchor="middle">Nón loa</text>' +
        '<text x="90" y="68" fill="#93c5fd" font-size="12.5" font-weight="800" text-anchor="middle">Nam châm tròn</text>' +
        '</svg>';

      var svg2 =
        '<svg viewBox="0 0 480 340" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><marker id="' + u + 'cw" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L9 5 L0 9 z" fill="#fde047"/></marker></defs>' +
        '<rect x="12" y="12" width="456" height="316" rx="10" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Outer S ring
        '<circle cx="195" cy="170" r="118" fill="none" stroke="#2563eb" stroke-width="26"/>' +
        '<text x="195" y="60" fill="#fff" font-size="16" font-weight="800" text-anchor="middle">S (vành ngoài)</text>' +
        // Center N pole
        '<circle cx="195" cy="170" r="52" fill="#dc2626" stroke="#f87171" stroke-width="2"/>' +
        '<text x="195" y="176" fill="#fff" font-size="22" font-weight="800" text-anchor="middle">N</text>' +
        // Annular copper coil
        '<circle cx="195" cy="170" r="80" fill="none" stroke="#f59e0b" stroke-width="9"/>' +
        '<path d="M 225 245 A 80 80 0 0 1 165 245" fill="none" stroke="#fde047" stroke-width="3" marker-end="url(#' + u + 'cw)"/>' +
        '<text x="195" y="268" fill="#fde047" font-size="13" font-weight="800" text-anchor="middle">I</text>' +
        // Specs box right
        '<rect x="334" y="76" width="122" height="186" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.4"/>' +
        '<text x="395" y="102" fill="#fde68a" font-size="13" font-weight="800" text-anchor="middle">Cuộn âm</text>' +
        '<text x="344" y="130" fill="#e2e8f0" font-size="12">• B = 0,075 T</text>' +
        '<text x="344" y="156" fill="#e2e8f0" font-size="12">• d = 7,2 cm</text>' +
        '<text x="344" y="182" fill="#e2e8f0" font-size="12">• N = 20 vòng</text>' +
        '<text x="344" y="208" fill="#e2e8f0" font-size="12">• R = 5,8 Ω</text>' +
        '<text x="344" y="234" fill="#7dd3fc" font-size="12">• U = 12 V</text>' +
        '</svg>';

      return '<div class="vlxt-visual-container"><div class="vlxt-grid-2col">' +
        '<div class="vlxt-stage-wrap">' + captionHtml('fa-solid fa-volume-high', this.caption) + svg1 + '</div>' +
        '<div class="vlxt-stage-wrap">' + captionHtml('fa-regular fa-circle-dot', this.caption2) + svg2 + '</div>' +
        '</div></div>';
    }
  },

  'MH-C3-75': {
    id: 'MH-C3-75',
    title: 'Dynamo xe đạp – Máy phát điện mini gắn bánh xe',
    topic: 'DS-C3.3',
    layout: 'grid-2col',
    caption: 'Hình a: Núm dẫn động tì lên vành lốp xe và dây cấp điện cho đèn',
    caption2: 'Hình b: Sơ đồ nam châm quay (rôto) bên trong cuộn dây (stato)',
    alt: 'Hai hình: dynamo gắn càng bánh xe đạp nối dây lên đèn pha, và mặt cắt cấu tạo gồm núm dẫn động, nam châm quay N-S, lõi sắt non và cuộn dây dẫn',
    build: function (u) {
      var svg1 =
        '<svg viewBox="0 0 480 340" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="12" y="12" width="456" height="316" rx="10" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Tire arc right-bottom
        '<circle cx="150" cy="240" r="118" fill="none" stroke="#334155" stroke-width="24"/>' +
        '<circle cx="150" cy="240" r="98" fill="none" stroke="#64748b" stroke-width="4"/>' +
        '<text x="126" y="246" fill="#94a3b8" font-size="13.5" font-weight="800" text-anchor="middle">Bánh xe đạp</text>' +
        // Friction wheel & Dynamo body touching tire
        '<rect x="278" y="196" width="24" height="32" rx="4" fill="#f59e0b" stroke="#fef08a" stroke-width="1.8"/>' +
        '<rect x="296" y="206" width="44" height="12" fill="#94a3b8"/>' +
        '<rect x="340" y="182" width="76" height="60" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>' +
        '<text x="378" y="217" fill="#7dd3fc" font-size="13" font-weight="800" text-anchor="middle">Dynamo</text>' +
        // Wire up to bicycle headlight
        '<polyline points="378,182 378,94 274,94" fill="none" stroke="#fbbf24" stroke-width="2.6" class="ambient-wire-pulse"/>' +
        '<circle cx="248" cy="94" r="24" fill="#f59e0b" stroke="#fef08a" stroke-width="2"/>' +
        '<polygon points="224,94 148,64 148,124" fill="rgba(253,224,71,0.18)"/>' +
        '<text x="248" y="54" fill="#fde047" font-size="13.5" font-weight="800" text-anchor="middle">Bóng đèn xe</text>' +
        '<text x="290" y="176" fill="#fde68a" font-size="12.5" font-weight="700" text-anchor="middle">Núm dẫn động</text>' +
        '</svg>';

      var svg2 =
        '<svg viewBox="0 0 480 340" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="12" y="12" width="456" height="316" rx="10" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Friction wheel r = 3 cm & shaft
        '<rect x="46" y="138" width="28" height="64" rx="5" fill="#475569" stroke="#cbd5e1" stroke-width="2"/>' +
        '<line x1="74" y1="170" x2="152" y2="170" stroke="#94a3b8" stroke-width="6"/>' +
        '<text x="64" y="122" fill="#cbd5e1" font-size="12.5" font-weight="700" text-anchor="middle">Núm (r = 3 cm)</text>' +
        // Rotating magnet N | S
        '<g class="ambient-needle" style="transform-origin:194px 170px;">' +
        '<rect x="152" y="142" width="42" height="56" fill="#dc2626" stroke="#f87171" stroke-width="2"/>' +
        '<rect x="194" y="142" width="42" height="56" fill="#2563eb" stroke="#60a5fa" stroke-width="2"/>' +
        '<text x="173" y="176" fill="#fff" font-size="16" font-weight="800" text-anchor="middle">N</text>' +
        '<text x="215" y="176" fill="#fff" font-size="16" font-weight="800" text-anchor="middle">S</text>' +
        '</g>' +
        '<text x="194" y="122" fill="#fca5a5" font-size="12.5" font-weight="800" text-anchor="middle">Nam châm quay</text>' +
        // Soft iron core & stationary coil (stato)
        '<rect x="270" y="150" width="114" height="40" rx="4" fill="#475569" stroke="#94a3b8" stroke-width="2"/>' +
        '<rect x="292" y="138" width="70" height="64" rx="4" fill="#92400e" stroke="#fbbf24" stroke-width="2.2"/>' +
        '<text x="327" y="122" fill="#fde68a" font-size="12.5" font-weight="800" text-anchor="middle">Cuộn dây (Stato)</text>' +
        '<text x="327" y="220" fill="#cbd5e1" font-size="12" text-anchor="middle">Φ_max = 0,03 Wb</text>' +
        // Leads to bulb
        '<polyline points="298,202 298,284 364,284" fill="none" stroke="#38bdf8" stroke-width="2.4" class="ambient-wire-pulse"/>' +
        '<polyline points="356,202 356,256 382,256" fill="none" stroke="#fbbf24" stroke-width="2.4"/>' +
        '<circle cx="404" cy="272" r="22" fill="#0f172a" stroke="#fde047" stroke-width="2.5"/>' +
        '<line x1="392" y1="260" x2="416" y2="284" stroke="#fde047" stroke-width="2"/>' +
        '<line x1="416" y1="260" x2="392" y2="284" stroke="#fde047" stroke-width="2"/>' +
        '<text x="404" y="312" fill="#fde047" font-size="13" font-weight="800" text-anchor="middle">Bóng đèn</text>' +
        '</svg>';

      return '<div class="vlxt-visual-container"><div class="vlxt-grid-2col">' +
        '<div class="vlxt-stage-wrap">' + captionHtml('fa-solid fa-bicycle', this.caption) + svg1 + '</div>' +
        '<div class="vlxt-stage-wrap">' + captionHtml('fa-solid fa-cogs', this.caption2) + svg2 + '</div>' +
        '</div></div>';
    }
  },

  'MH-C3-76': {
    id: 'MH-C3-76',
    title: 'Nguyên lí bếp điện từ làm nóng đáy nồi bằng dòng điện cảm ứng',
    topic: 'DS-C3.4',
    layout: 'single',
    caption: 'Từ trường biến thiên tần số cao xuyên qua mặt kính sinh dòng Foucault ở đáy nồi từ tính',
    alt: 'Mặt cắt bếp từ gồm nồi đáy sắt từ đặt trên mặt bếp thủy tinh, bên dưới có cuộn dây nối mạch điều khiển và đường sức từ khép kín',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 350" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="16" y="16" width="668" height="318" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Pan with water/steam
        '<path d="M 164 68 L 404 68 L 392 174 L 176 174 Z" fill="#334155" stroke="#94a3b8" stroke-width="2.5"/>' +
        '<rect x="122" y="88" width="44" height="12" rx="4" fill="#64748b"/>' +
        '<rect x="402" y="88" width="44" height="12" rx="4" fill="#64748b"/>' +
        '<rect x="176" y="160" width="216" height="14" fill="#f97316"/>' +
        '<rect x="180" y="96" width="208" height="64" fill="rgba(56,189,248,0.22)" class="ambient-water-wave"/>' +
        '<text x="284" y="136" fill="#e0f2fe" font-size="13.5" font-weight="800" text-anchor="middle">Đáy nồi có từ tính (P = 1800 W)</text>' +
        // Glass-ceramic stove top
        '<rect x="114" y="176" width="340" height="16" rx="3" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>' +
        // Induction spiral coil
        '<ellipse cx="220" cy="214" rx="14" ry="8" fill="#92400e" stroke="#fbbf24" stroke-width="2"/>' +
        '<ellipse cx="252" cy="214" rx="14" ry="8" fill="#92400e" stroke="#fbbf24" stroke-width="2"/>' +
        '<ellipse cx="284" cy="214" rx="14" ry="8" fill="#92400e" stroke="#fbbf24" stroke-width="2"/>' +
        '<ellipse cx="316" cy="214" rx="14" ry="8" fill="#92400e" stroke="#fbbf24" stroke-width="2"/>' +
        '<ellipse cx="348" cy="214" rx="14" ry="8" fill="#92400e" stroke="#fbbf24" stroke-width="2"/>' +
        // Closed magnetic flux loops
        '<ellipse cx="226" cy="196" rx="38" ry="30" fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="5 4" class="ambient-ray-glide"/>' +
        '<ellipse cx="342" cy="196" rx="38" ry="30" fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="5 4" class="ambient-ray-glide"/>' +
        // Control circuit bottom
        '<rect x="206" y="256" width="156" height="44" rx="8" fill="#1e293b" stroke="#fbbf24" stroke-width="1.8"/>' +
        '<text x="284" y="283" fill="#fde68a" font-size="13.5" font-weight="800" text-anchor="middle">Mạch điều khiển ~</text>' +
        '<line x1="234" y1="224" x2="234" y2="256" stroke="#fbbf24" stroke-width="2.4"/>' +
        '<line x1="334" y1="224" x2="334" y2="256" stroke="#fbbf24" stroke-width="2.4"/>' +
        // Callout labels right
        '<rect x="480" y="90" width="184" height="44" rx="7" fill="#0f172a" stroke="#f97316" stroke-width="1.4"/>' +
        '<text x="572" y="117" fill="#fdba74" font-size="13" font-weight="800" text-anchor="middle">Dòng Foucault sinh nhiệt</text>' +
        '<line x1="392" y1="166" x2="480" y2="112" stroke="#f97316" stroke-width="1.4"/>' +
        '<rect x="480" y="160" width="184" height="44" rx="7" fill="#0f172a" stroke="#38bdf8" stroke-width="1.4"/>' +
        '<text x="572" y="187" fill="#7dd3fc" font-size="13" font-weight="800" text-anchor="middle">Mặt kính cách điện</text>' +
        '<line x1="454" y1="184" x2="480" y2="184" stroke="#38bdf8" stroke-width="1.4"/>' +
        '<rect x="480" y="232" width="184" height="54" rx="7" fill="#0f172a" stroke="#fbbf24" stroke-width="1.4"/>' +
        '<text x="572" y="254" fill="#fde68a" font-size="13" font-weight="800" text-anchor="middle">Cuộn dây tần số cao</text>' +
        '<text x="572" y="274" fill="#cbd5e1" font-size="12" text-anchor="middle">R_nồi = 40 Ω</text>' +
        '<line x1="362" y1="214" x2="480" y2="258" stroke="#fbbf24" stroke-width="1.4"/>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-fire-burner', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C3-77': {
    id: 'MH-C3-77',
    title: 'Đèn pin lắc tay không dùng pin ứng dụng cảm ứng điện từ',
    topic: 'DS-C3.4',
    layout: 'single',
    caption: 'Lắc đèn để nam châm trượt qua lại xuyên qua cuộn dây cố định tạo điện thắp sáng LED',
    alt: 'Mặt cắt đèn lắc tay gồm bộ phận phát sáng LED, mạch chỉnh lưu tụ điện, đệm cao su hai đầu, cuộn dây cố định và nam châm dịch chuyển bên trong',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 330" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><marker id="' + u + 'sw" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L9 5 L0 9 z" fill="#38bdf8"/></marker></defs>' +
        '<rect x="16" y="16" width="668" height="298" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Flashlight outer shell
        '<path d="M 110 86 L 176 118 L 620 118 L 620 218 L 176 218 L 110 250 Z" fill="#0f172a" stroke="#64748b" stroke-width="2.6" stroke-linejoin="round"/>' +
        // Left LED reflector
        '<rect x="120" y="128" width="26" height="80" rx="4" fill="#fde047" stroke="#f59e0b" stroke-width="2"/>' +
        '<text x="148" y="64" fill="#fde047" font-size="13" font-weight="800" text-anchor="middle">Bộ phận phát sáng</text>' +
        // Circuit board/capacitor
        '<rect x="184" y="136" width="64" height="64" rx="6" fill="#065f46" stroke="#34d399" stroke-width="2"/>' +
        '<text x="216" y="173" fill="#d1fae5" font-size="12" font-weight="800" text-anchor="middle">Mạch điện</text>' +
        // Rubber dampers
        '<rect x="266" y="144" width="14" height="48" rx="3" fill="#475569"/>' +
        '<rect x="588" y="144" width="14" height="48" rx="3" fill="#475569"/>' +
        // Stationary coil around middle
        '<rect x="366" y="122" width="128" height="92" rx="6" fill="rgba(245,158,11,0.18)" stroke="#fbbf24" stroke-width="2.4"/>' +
        '<text x="430" y="96" fill="#fde68a" font-size="13.5" font-weight="800" text-anchor="middle">Cuộn dây cố định</text>' +
        // Sliding magnet N-S inside
        '<g class="ambient-piston-x" style="animation-duration:2s;">' +
        '<rect x="378" y="148" width="46" height="40" fill="#dc2626" stroke="#f87171" stroke-width="1.8"/>' +
        '<rect x="424" y="148" width="46" height="40" fill="#2563eb" stroke="#60a5fa" stroke-width="1.8"/>' +
        '<text x="401" y="174" fill="#fff" font-size="15" font-weight="800" text-anchor="middle">N</text>' +
        '<text x="447" y="174" fill="#fff" font-size="15" font-weight="800" text-anchor="middle">S</text>' +
        '</g>' +
        // Range double arrow below
        '<line x1="290" y1="248" x2="574" y2="248" stroke="#38bdf8" stroke-width="2.2" marker-start="url(#' + u + 'sw)" marker-end="url(#' + u + 'sw)"/>' +
        '<text x="432" y="274" fill="#7dd3fc" font-size="13" font-weight="800" text-anchor="middle">Quãng dịch chuyển dao động của nam châm</text>' +
        '<text x="273" y="294" fill="#94a3b8" font-size="12" text-anchor="middle">Đệm cao su</text>' +
        '<text x="595" y="294" fill="#94a3b8" font-size="12" text-anchor="middle">Đệm cao su</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-bolt', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C3-78': {
    id: 'MH-C3-78',
    title: 'Thí nghiệm đo thành phần nằm ngang cảm ứng từ Trái Đất B_T',
    topic: 'DS-C3.1',
    layout: 'grid-2col',
    caption: 'Hình a: Bố trí khung dây tròn đặt trong mặt phẳng kinh tuyến Bắc – Nam',
    caption2: 'Hình b: Kim nam châm ở tâm khung dây lệch góc α so với trục Đông – Tây',
    alt: 'Hai hình: bộ thí nghiệm điện kế tang gồm nguồn điện, ampe kế và vòng dây tròn đặt đứng; bên phải là sơ đồ các hướng Bắc Nam Đông Tây và góc lệch alpha của kim nam châm',
    build: function (u) {
      var svg1 =
        '<svg viewBox="0 0 480 340" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="12" y="12" width="456" height="316" rx="10" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // DC Power supply left
        '<rect x="38" y="196" width="96" height="86" rx="8" fill="#1e293b" stroke="#64748b" stroke-width="2"/>' +
        '<text x="86" y="232" fill="#e2e8f0" font-size="13" font-weight="800" text-anchor="middle">Nguồn DC</text>' +
        '<text x="86" y="256" fill="#94a3b8" font-size="12" text-anchor="middle">Điều chỉnh I</text>' +
        // Tangent galvanometer circular coil center
        '<circle cx="242" cy="148" r="82" fill="none" stroke="#f59e0b" stroke-width="7"/>' +
        '<rect x="218" y="230" width="48" height="52" rx="4" fill="#334155" stroke="#94a3b8" stroke-width="1.5"/>' +
        '<circle cx="242" cy="148" r="28" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>' +
        '<line x1="226" y1="138" x2="258" y2="158" stroke="#ef4444" stroke-width="3.5" class="ambient-needle"/>' +
        '<text x="242" y="52" fill="#fde68a" font-size="13" font-weight="800" text-anchor="middle">Khung dây N = 200 vòng (d = 18 cm)</text>' +
        // Digital ammeter right
        '<rect x="342" y="196" width="102" height="86" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>' +
        '<rect x="356" y="210" width="74" height="30" rx="4" fill="#050811"/>' +
        '<text x="393" y="231" fill="#34d399" font-size="14" font-weight="800" font-family="DM Mono,monospace" text-anchor="middle">25.0 mA</text>' +
        '<text x="393" y="264" fill="#7dd3fc" font-size="13" font-weight="800" text-anchor="middle">Ampe kế</text>' +
        // Connecting wires
        '<polyline points="86,196 86,170 218,246" fill="none" stroke="#f87171" stroke-width="2.2" class="ambient-wire-pulse"/>' +
        '<polyline points="266,246 342,246" fill="none" stroke="#38bdf8" stroke-width="2.2"/>' +
        '</svg>';

      var svg2 =
        '<svg viewBox="0 0 480 340" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><marker id="' + u + 'ci" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L9 5 L0 9 z" fill="#f59e0b"/></marker></defs>' +
        '<rect x="12" y="12" width="456" height="316" rx="10" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // 3D top-perspective East-West & North-South axes centered at (240, 178)
        '<line x1="76" y1="178" x2="404" y2="178" stroke="#64748b" stroke-width="2" stroke-dasharray="5 4"/>' +
        '<line x1="168" y1="244" x2="312" y2="112" stroke="#64748b" stroke-width="2" stroke-dasharray="5 4"/>' +
        '<text x="64" y="182" fill="#cbd5e1" font-size="13" font-weight="800" text-anchor="end">Tây</text>' +
        '<text x="414" y="182" fill="#cbd5e1" font-size="13" font-weight="800">Đông</text>' +
        '<text x="320" y="106" fill="#7dd3fc" font-size="13" font-weight="800">Bắc (B_T)</text>' +
        '<text x="160" y="262" fill="#cbd5e1" font-size="13" font-weight="800" text-anchor="end">Nam</text>' +
        // Vertical circular coil tilted in N-S plane
        '<ellipse cx="240" cy="178" rx="44" ry="112" fill="none" stroke="#fbbf24" stroke-width="3.6"/>' +
        // Upward current arrow i on East/right limb
        '<line x1="284" y1="196" x2="284" y2="146" stroke="#f59e0b" stroke-width="3.4" marker-end="url(#' + u + 'ci)"/>' +
        '<text x="296" y="142" fill="#fde047" font-size="14" font-weight="800">i</text>' +
        // Compass needle deflected into NW quadrant making angle alpha with West-East axis
        '<polygon points="240,178 188,136 202,158" fill="#ef4444"/>' +
        '<polygon points="240,178 292,220 278,198" fill="#94a3b8"/>' +
        '<circle cx="240" cy="178" r="5" fill="#f8fafc"/>' +
        '<path d="M 192 178 A 48 48 0 0 1 206 150" fill="none" stroke="#10b981" stroke-width="2.2"/>' +
        '<text x="178" y="166" fill="#6ee7b7" font-size="14" font-weight="800" text-anchor="end">α</text>' +
        '<text x="240" y="310" fill="#cbd5e1" font-size="12.5" text-anchor="middle">Kim nam châm hợp với trục Đông–Tây góc α</text>' +
        '</svg>';

      return '<div class="vlxt-visual-container"><div class="vlxt-grid-2col">' +
        '<div class="vlxt-stage-wrap">' + captionHtml('fa-solid fa-compass', this.caption) + svg1 + '</div>' +
        '<div class="vlxt-stage-wrap">' + captionHtml('fa-solid fa-location-arrow', this.caption2) + svg2 + '</div>' +
        '</div></div>';
    }
  },

  'MH-C3-79': {
    id: 'MH-C3-79',
    title: 'Máy đo lưu lượng máu điện từ y học',
    topic: 'DS-C3.5',
    layout: 'grid-2col',
    caption: 'Hình a: Dòng ion (+ / −) trong mạch máu bị tách về hai thành mạch dưới lực Lorentz',
    caption2: 'Hình b: Mặt cắt động mạch (d = 22 mm) gắn hai điện cực nối Vôn kế',
    alt: 'Hai hình: ống mạch máu có các ion âm dương trôi sang trái bị lực từ tách lên xuống; mặt cắt tròn nối hai điện cực với vôn kế trong từ trường B = 0,05 T',
    build: function (u) {
      var svg1 =
        '<svg viewBox="0 0 480 320" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><marker id="' + u + 'fl" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L9 5 L0 9 z" fill="#38bdf8"/></marker></defs>' +
        '<rect x="12" y="12" width="456" height="296" rx="10" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Blood vessel cylinder
        '<rect x="52" y="96" width="376" height="124" rx="12" fill="rgba(153,27,27,0.38)" stroke="#f87171" stroke-width="2.6"/>' +
        // Out of page B dots around
        '<circle cx="150" cy="64" r="3" fill="#38bdf8"/><circle cx="240" cy="64" r="3" fill="#38bdf8"/><circle cx="330" cy="64" r="3" fill="#38bdf8"/>' +
        '<text x="240" y="48" fill="#7dd3fc" font-size="13.5" font-weight="800" text-anchor="middle">B = 0,05 T (⊙ hướng ra)</text>' +
        // Flow direction R -> L
        '<line x1="398" y1="158" x2="294" y2="158" stroke="#38bdf8" stroke-width="3" marker-end="url(#' + u + 'fl)"/>' +
        '<text x="346" y="148" fill="#7dd3fc" font-size="13" font-weight="800" text-anchor="middle">v (dòng máu)</text>' +
        // Separated + (top) and - (bottom) ions
        '<g class="ambient-gas-a">' +
        '<circle cx="140" cy="116" r="10" fill="#ef4444"/><text x="140" y="120" fill="#fff" font-size="14" font-weight="800" text-anchor="middle">+</text>' +
        '<circle cx="215" cy="116" r="10" fill="#ef4444"/><text x="215" y="120" fill="#fff" font-size="14" font-weight="800" text-anchor="middle">+</text>' +
        '<circle cx="285" cy="116" r="10" fill="#ef4444"/><text x="285" y="120" fill="#fff" font-size="14" font-weight="800" text-anchor="middle">+</text>' +
        '</g>' +
        '<g class="ambient-gas-b">' +
        '<circle cx="140" cy="200" r="10" fill="#0284c7"/><text x="140" y="204" fill="#fff" font-size="14" font-weight="800" text-anchor="middle">−</text>' +
        '<circle cx="215" cy="200" r="10" fill="#0284c7"/><text x="215" y="204" fill="#fff" font-size="14" font-weight="800" text-anchor="middle">−</text>' +
        '<circle cx="285" cy="200" r="10" fill="#0284c7"/><text x="285" y="204" fill="#fff" font-size="14" font-weight="800" text-anchor="middle">−</text>' +
        '</g>' +
        '<text x="240" y="264" fill="#cbd5e1" font-size="13" font-weight="700" text-anchor="middle">Mạch máu (Không xâm lấn)</text>' +
        '</svg>';

      var svg2 =
        '<svg viewBox="0 0 480 320" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><marker id="' + u + 'arB" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L9 5 L0 9 z" fill="#38bdf8"/></marker></defs>' +
        '<rect x="12" y="12" width="456" height="296" rx="10" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Horizontal magnetic field B
        '<line x1="60" y1="160" x2="292" y2="160" stroke="#38bdf8" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#' + u + 'arB)"/>' +
        '<text x="72" y="148" fill="#7dd3fc" font-size="14" font-weight="800">B</text>' +
        // Artery cross-section circle
        '<circle cx="176" cy="160" r="74" fill="rgba(153,27,27,0.45)" stroke="#f87171" stroke-width="3"/>' +
        '<text x="176" y="166" fill="#fee2e2" font-size="14" font-weight="800" text-anchor="middle">d = 22 mm</text>' +
        // Top & bottom electrodes
        '<rect x="160" y="74" width="32" height="14" rx="2" fill="#fbbf24"/>' +
        '<rect x="160" y="232" width="32" height="14" rx="2" fill="#fbbf24"/>' +
        '<text x="148" y="84" fill="#fde68a" font-size="12.5" font-weight="700" text-anchor="end">Điện cực +</text>' +
        '<text x="148" y="244" fill="#fde68a" font-size="12.5" font-weight="700" text-anchor="end">Điện cực −</text>' +
        // Wires to Voltmeter U = 0.22 mV
        '<polyline points="192,81 364,81 364,132" fill="none" stroke="#fbbf24" stroke-width="2.4" class="ambient-wire-pulse"/>' +
        '<polyline points="192,239 364,239 364,188" fill="none" stroke="#38bdf8" stroke-width="2.4" class="ambient-wire-pulse"/>' +
        '<circle cx="364" cy="160" r="28" fill="#0f172a" stroke="#10b981" stroke-width="2.6"/>' +
        '<text x="364" y="166" fill="#6ee7b7" font-size="18" font-weight="800" text-anchor="middle">V</text>' +
        '<text x="364" y="274" fill="#e2e8f0" font-size="13" font-weight="800" text-anchor="middle">U = 0,22 mV</text>' +
        '</svg>';

      return '<div class="vlxt-visual-container"><div class="vlxt-grid-2col">' +
        '<div class="vlxt-stage-wrap">' + captionHtml('fa-solid fa-heart-pulse', this.caption) + svg1 + '</div>' +
        '<div class="vlxt-stage-wrap">' + captionHtml('fa-solid fa-gauge', this.caption2) + svg2 + '</div>' +
        '</div></div>';
    }
  },

  'MH-C3-80': {
    id: 'MH-C3-80',
    title: 'Cấu tạo máy biến áp lõi lá sắt non ghép cách điện',
    topic: 'DS-C3.4',
    layout: 'single',
    caption: 'Lõi biến áp gồm nhiều lá sắt non mỏng ghép cách điện và hai cuộn dây N₁, N₂',
    alt: 'Sơ đồ máy biến áp một pha gồm lõi thép kỹ thuật điện dạng khung chữ nhật ghép từ các lá mỏng, cuộn sơ cấp N1 nối điện áp U1 và cuộn thứ cấp N2 nối U2',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 340" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="16" y="16" width="668" height="308" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Laminated rectangular transformer core
        '<rect x="176" y="72" width="348" height="206" rx="10" fill="#475569" stroke="#cbd5e1" stroke-width="2.4"/>' +
        '<rect x="236" y="122" width="228" height="106" rx="6" fill="#070d1c" stroke="#94a3b8" stroke-width="2"/>' +
        // Lamination stripes showing insulated iron sheets
        '<rect x="182" y="78" width="336" height="194" rx="8" fill="none" stroke="#1e293b" stroke-width="1.5"/>' +
        '<rect x="188" y="84" width="324" height="182" rx="6" fill="none" stroke="#334155" stroke-width="1.5"/>' +
        // Primary coil N1 (left limb)
        '<rect x="164" y="130" width="84" height="90" rx="6" fill="#92400e" stroke="#fbbf24" stroke-width="2.4"/>' +
        '<line x1="166" y1="146" x2="246" y2="146" stroke="#fde68a" stroke-width="2"/>' +
        '<line x1="166" y1="162" x2="246" y2="162" stroke="#fde68a" stroke-width="2"/>' +
        '<line x1="166" y1="178" x2="246" y2="178" stroke="#fde68a" stroke-width="2"/>' +
        '<line x1="166" y1="194" x2="246" y2="194" stroke="#fde68a" stroke-width="2"/>' +
        '<line x1="166" y1="210" x2="246" y2="210" stroke="#fde68a" stroke-width="2"/>' +
        '<polyline points="164,142 94,142" fill="none" stroke="#fbbf24" stroke-width="2.8" class="ambient-wire-pulse"/>' +
        '<polyline points="164,208 94,208" fill="none" stroke="#fbbf24" stroke-width="2.8" class="ambient-wire-pulse"/>' +
        '<circle cx="94" cy="142" r="5" fill="#fbbf24"/>' +
        '<circle cx="94" cy="208" r="5" fill="#fbbf24"/>' +
        '<text x="76" y="179" fill="#fde047" font-size="16" font-weight="800" text-anchor="end">U₁</text>' +
        // Secondary coil N2 (right limb)
        '<rect x="452" y="130" width="84" height="90" rx="6" fill="#0369a1" stroke="#38bdf8" stroke-width="2.4"/>' +
        '<line x1="454" y1="146" x2="534" y2="146" stroke="#bae6fd" stroke-width="2"/>' +
        '<line x1="454" y1="162" x2="534" y2="162" stroke="#bae6fd" stroke-width="2"/>' +
        '<line x1="454" y1="178" x2="534" y2="178" stroke="#bae6fd" stroke-width="2"/>' +
        '<line x1="454" y1="194" x2="534" y2="194" stroke="#bae6fd" stroke-width="2"/>' +
        '<line x1="454" y1="210" x2="534" y2="210" stroke="#bae6fd" stroke-width="2"/>' +
        '<polyline points="536,142 606,142" fill="none" stroke="#38bdf8" stroke-width="2.8" class="ambient-wire-pulse"/>' +
        '<polyline points="536,208 606,208" fill="none" stroke="#38bdf8" stroke-width="2.8" class="ambient-wire-pulse"/>' +
        '<circle cx="606" cy="142" r="5" fill="#38bdf8"/>' +
        '<circle cx="606" cy="208" r="5" fill="#38bdf8"/>' +
        '<text x="624" y="179" fill="#7dd3fc" font-size="16" font-weight="800">U₂</text>' +
        // Labels
        '<text x="350" y="52" fill="#e2e8f0" font-size="14" font-weight="800" text-anchor="middle">Lõi biến áp (các lá sắt non sơn cách điện)</text>' +
        '<text x="114" y="114" fill="#fde68a" font-size="13.5" font-weight="800" text-anchor="middle">Cuộn sơ cấp (N₁)</text>' +
        '<text x="584" y="114" fill="#7dd3fc" font-size="13.5" font-weight="800" text-anchor="middle">Cuộn thứ cấp (N₂)</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-plug-circle-bolt', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C3-81': {
    id: 'MH-C3-81',
    title: 'Hệ thống truyền tải điện năng đi xa qua các trạm biến thế',
    topic: 'DS-C3.4',
    layout: 'single',
    caption: 'Sơ đồ lưới truyền tải từ Nhà máy điện (25 kV) → 500 kV → 110 kV → Nhà máy (380 V) & Hộ gia đình (220 V)',
    alt: 'Chuỗi sơ đồ truyền tải điện: Nhà máy 25 kV qua Biến thế 1 lên đường dây 500 kV tới Biến thế 2 xuống 110 kV chia nhánh qua Biến thế 3 ra 380 V và Biến thế 4 ra 220 V',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 320" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="16" y="16" width="668" height="288" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Plant 25 kV
        '<rect x="28" y="118" width="98" height="72" rx="8" fill="#1e293b" stroke="#64748b" stroke-width="2"/>' +
        '<text x="77" y="148" fill="#e2e8f0" font-size="12.5" font-weight="800" text-anchor="middle">Nhà máy điện</text>' +
        '<text x="77" y="170" fill="#fde047" font-size="13.5" font-weight="800" text-anchor="middle">25 kV (20 MW)</text>' +
        '<line x1="126" y1="154" x2="152" y2="154" stroke="#fbbf24" stroke-width="3"/>' +
        // Transformer 1
        '<rect x="152" y="124" width="84" height="60" rx="7" fill="#0f172a" stroke="#fbbf24" stroke-width="2"/>' +
        '<text x="194" y="150" fill="#fde68a" font-size="13" font-weight="800" text-anchor="middle">Biến thế 1</text>' +
        '<text x="194" y="170" fill="#94a3b8" font-size="11.5" text-anchor="middle">1000 vòng</text>' +
        // High-voltage 500 kV line + pylon icon
        '<line x1="236" y1="154" x2="364" y2="154" stroke="#38bdf8" stroke-width="3.5" class="ambient-wire-pulse"/>' +
        '<polygon points="300,96 286,154 314,154" fill="none" stroke="#94a3b8" stroke-width="1.8"/>' +
        '<text x="300" y="84" fill="#7dd3fc" font-size="13.5" font-weight="800" text-anchor="middle">500 kV · 248 km</text>' +
        // Transformer 2
        '<rect x="364" y="124" width="84" height="60" rx="7" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>' +
        '<text x="406" y="158" fill="#7dd3fc" font-size="13" font-weight="800" text-anchor="middle">Biến thế 2</text>' +
        // Branching 110 kV to Transformer 3 (top) & Transformer 4 (bottom)
        '<polyline points="448,142 478,94 504,94" fill="none" stroke="#10b981" stroke-width="2.6" class="ambient-wire-pulse"/>' +
        '<polyline points="448,166 478,214 504,214" fill="none" stroke="#10b981" stroke-width="2.6" class="ambient-wire-pulse"/>' +
        '<text x="470" y="86" fill="#6ee7b7" font-size="12" font-weight="800" text-anchor="middle">110 kV</text>' +
        '<text x="470" y="232" fill="#6ee7b7" font-size="12" font-weight="800" text-anchor="middle">110 kV</text>' +
        // Transformer 3 -> Factory 380V
        '<rect x="504" y="66" width="76" height="54" rx="7" fill="#0f172a" stroke="#10b981" stroke-width="2"/>' +
        '<text x="542" y="98" fill="#6ee7b7" font-size="12.5" font-weight="800" text-anchor="middle">Biến thế 3</text>' +
        '<line x1="580" y1="94" x2="600" y2="94" stroke="#e2e8f0" stroke-width="2.5"/>' +
        '<rect x="600" y="66" width="72" height="54" rx="7" fill="#1e293b" stroke="#64748b" stroke-width="1.6"/>' +
        '<text x="636" y="89" fill="#e2e8f0" font-size="12" font-weight="700" text-anchor="middle">Nhà máy</text>' +
        '<text x="636" y="109" fill="#fde047" font-size="13" font-weight="800" text-anchor="middle">380 V</text>' +
        // Transformer 4 -> House 220V
        '<rect x="504" y="186" width="76" height="54" rx="7" fill="#0f172a" stroke="#10b981" stroke-width="2"/>' +
        '<text x="542" y="218" fill="#6ee7b7" font-size="12.5" font-weight="800" text-anchor="middle">Biến thế 4</text>' +
        '<line x1="580" y1="214" x2="600" y2="214" stroke="#e2e8f0" stroke-width="2.5"/>' +
        '<rect x="600" y="186" width="72" height="54" rx="7" fill="#1e293b" stroke="#64748b" stroke-width="1.6"/>' +
        '<text x="636" y="209" fill="#e2e8f0" font-size="12" font-weight="700" text-anchor="middle">Hộ dân</text>' +
        '<text x="636" y="229" fill="#fde047" font-size="13" font-weight="800" text-anchor="middle">220 V</text>' +
        '<text x="350" y="284" fill="#94a3b8" font-size="12.5" text-anchor="middle">Dây đồng S = 0,81 cm² · ρ = 1,62·10⁻⁸ Ω·m (2 dây đi–về)</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-tower-broadcast', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C3-82': {
    id: 'MH-C3-82',
    title: 'Máy in phun mực nguyên lí Binary-Deflection',
    topic: 'DS-C3.5',
    layout: 'grid-2col',
    caption: 'Hình a: Giọt mực C không tích điện bay thẳng tới giấy; giọt A tích điện lệch lên máng chặn',
    caption2: 'Hình b: Chi tiết vùng lái tia Ox–Oy có bản dài L = 2 cm, điện trường E = 4·10⁶ V/m',
    alt: 'Hai hình: sơ đồ máy in phun gồm vòi phun, điện cực nạp, hai bản lái tia tách giọt C vào giấy và giọt A vào máng; bên phải là đồ thị quỹ đạo lệch trong vùng L',
    build: function (u) {
      var svg1 =
        '<svg viewBox="0 0 480 320" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="12" y="12" width="456" height="296" rx="10" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Nozzle left
        '<rect x="34" y="150" width="70" height="44" rx="5" fill="#1e293b" stroke="#64748b" stroke-width="2"/>' +
        '<text x="69" y="177" fill="#e2e8f0" font-size="12.5" font-weight="800" text-anchor="middle">Vòi phun</text>' +
        // Charging electrode
        '<rect x="136" y="144" width="26" height="56" rx="3" fill="none" stroke="#fbbf24" stroke-width="2"/>' +
        '<text x="149" y="132" fill="#fde68a" font-size="12" font-weight="700" text-anchor="middle">Nạp điện</text>' +
        // High-voltage plates
        '<rect x="196" y="122" width="110" height="12" rx="2" fill="#dc2626"/>' +
        '<rect x="196" y="210" width="110" height="12" rx="2" fill="#2563eb"/>' +
        '<text x="234" y="102" fill="#fca5a5" font-size="12.5" font-weight="800" text-anchor="middle">Bản lái tia (L = 2 cm)</text>' +
        // Straight neutral path (C) to Paper
        '<line x1="104" y1="172" x2="416" y2="172" stroke="#38bdf8" stroke-width="2.4" stroke-dasharray="6 4"/>' +
        '<rect x="416" y="114" width="18" height="126" rx="3" fill="#f8fafc"/>' +
        '<text x="425" y="262" fill="#e2e8f0" font-size="13" font-weight="800" text-anchor="middle">Giấy</text>' +
        '<text x="364" y="192" fill="#7dd3fc" font-size="12.5" font-weight="800" text-anchor="middle">Giọt C (thẳng)</text>' +
        // Deflected drop A path upward into gutter
        '<path d="M 196 172 Q 270 172 340 116" fill="none" stroke="#fbbf24" stroke-width="2.8" class="ambient-ray-glide"/>' +
        '<rect x="342" y="82" width="60" height="34" rx="4" fill="#334155" stroke="#fbbf24" stroke-width="1.8"/>' +
        '<text x="372" y="103" fill="#fde047" font-size="12" font-weight="800" text-anchor="middle">Máng chặn</text>' +
        '<text x="274" y="152" fill="#fde047" font-size="12" font-weight="800" text-anchor="middle">Giọt A</text>' +
        '</svg>';

      var svg2 =
        '<svg viewBox="0 0 480 320" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs>' +
        '<marker id="' + u + 'ax" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L9 5 L0 9 z" fill="#cbd5e1"/></marker>' +
        '<marker id="' + u + 'arE" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L9 5 L0 9 z" fill="#f87171"/></marker>' +
        '</defs>' +
        '<rect x="12" y="12" width="456" height="296" rx="10" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Axes Ox, Oy
        '<line x1="76" y1="210" x2="410" y2="210" stroke="#cbd5e1" stroke-width="2" marker-end="url(#' + u + 'ax)"/>' +
        '<line x1="76" y1="248" x2="76" y2="56" stroke="#cbd5e1" stroke-width="2" marker-end="url(#' + u + 'ax)"/>' +
        '<text x="418" y="214" fill="#cbd5e1" font-size="13.5" font-weight="800">x</text>' +
        '<text x="66" y="62" fill="#cbd5e1" font-size="13.5" font-weight="800" text-anchor="end">y</text>' +
        // Plates top & bottom
        '<rect x="76" y="72" width="240" height="10" fill="#94a3b8"/>' +
        '<rect x="76" y="232" width="240" height="10" fill="#94a3b8"/>' +
        // Downward E vectors
        '<line x1="160" y1="96" x2="160" y2="160" stroke="#f87171" stroke-width="2.4" marker-end="url(#' + u + 'arE)"/>' +
        '<line x1="250" y1="96" x2="250" y2="160" stroke="#f87171" stroke-width="2.4" marker-end="url(#' + u + 'arE)"/>' +
        '<text x="205" y="132" fill="#fca5a5" font-size="13.5" font-weight="800" text-anchor="middle">E = 4·10⁶ V/m</text>' +
        // Upward deflection trajectory inside region L
        '<path d="M 76 210 Q 196 210 316 116" fill="none" stroke="#fbbf24" stroke-width="3.2"/>' +
        '<circle cx="316" cy="116" r="5" fill="#fbbf24"/>' +
        '<line x1="316" y1="116" x2="316" y2="210" stroke="#64748b" stroke-dasharray="4 3"/>' +
        '<text x="316" y="226" fill="#7dd3fc" font-size="13" font-weight="800" text-anchor="middle">L = 2 cm</text>' +
        '<text x="150" y="274" fill="#e2e8f0" font-size="12.5" font-weight="700" text-anchor="middle">v₀ = 20 m/s · m = 3,6·10⁻¹⁰ kg · |q| = 1,8·10⁻¹³ C</text>' +
        '</svg>';

      return '<div class="vlxt-visual-container"><div class="vlxt-grid-2col">' +
        '<div class="vlxt-stage-wrap">' + captionHtml('fa-solid fa-print', this.caption) + svg1 + '</div>' +
        '<div class="vlxt-stage-wrap">' + captionHtml('fa-solid fa-vector-square', this.caption2) + svg2 + '</div>' +
        '</div></div>';
    }
  },

  'MH-C3-83': {
    id: 'MH-C3-83',
    title: 'Thí nghiệm tương tác từ giữa hai dòng điện thẳng song song (4) và (5)',
    topic: 'DS-C3.1',
    layout: 'grid-2col',
    caption: 'Hình a: Hai thanh mảnh (4), (5) mắc song song giữa hai thanh (1) và (2)',
    caption2: 'Hình b: Mắc thêm thanh (3) nối tiếp để đảo chiều dòng qua (4) và (5)',
    alt: 'Hai sơ đồ thí nghiệm tương tác hai dây dẫn song song trên bảng: Hình a nguồn mắc vào hai thanh đứng (1) và (2) tạo dòng cùng chiều hút nhau; Hình b thêm thanh (3) tạo dòng ngược chiều đẩy nhau',
    build: function (u) {
      var svg1 =
        '<svg viewBox="0 0 480 330" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><marker id="' + u + 'ia" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L9 5 L0 9 z" fill="#38bdf8"/></marker></defs>' +
        '<rect x="12" y="12" width="456" height="306" rx="10" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Top power source 12V
        '<rect x="176" y="34" width="128" height="38" rx="6" fill="#0f172a" stroke="#64748b" stroke-width="1.8"/>' +
        '<text x="240" y="58" fill="#fde047" font-size="13.5" font-weight="800" text-anchor="middle">+ Nguồn 12 V −</text>' +
        '<polyline points="176,53 144,53 144,116" fill="none" stroke="#f87171" stroke-width="2.5"/>' +
        '<polyline points="304,53 336,53 336,116" fill="none" stroke="#60a5fa" stroke-width="2.5"/>' +
        // Insulating board
        '<rect x="86" y="102" width="308" height="176" rx="8" fill="#1e293b" stroke="#475569" stroke-width="2"/>' +
        // Vertical thick bars (1) and (2)
        '<rect x="138" y="116" width="12" height="146" rx="3" fill="#b45309" stroke="#fbbf24" stroke-width="1.6"/>' +
        '<rect x="330" y="116" width="12" height="146" rx="3" fill="#b45309" stroke="#fbbf24" stroke-width="1.6"/>' +
        '<text x="124" y="194" fill="#fde68a" font-size="13.5" font-weight="800" text-anchor="end">(1)</text>' +
        '<text x="354" y="194" fill="#fde68a" font-size="13.5" font-weight="800">(2)</text>' +
        // Parallel thin wires (4) and (5) bowing inward slightly (attraction) with parallel currents L->R
        '<path d="M 144 166 Q 240 176 336 166" fill="none" stroke="#38bdf8" stroke-width="3.2"/>' +
        '<path d="M 144 214 Q 240 204 336 214" fill="none" stroke="#38bdf8" stroke-width="3.2"/>' +
        '<line x1="210" y1="160" x2="262" y2="160" stroke="#38bdf8" stroke-width="2" marker-end="url(#' + u + 'ia)"/>' +
        '<line x1="210" y1="224" x2="262" y2="224" stroke="#38bdf8" stroke-width="2" marker-end="url(#' + u + 'ia)"/>' +
        '<text x="180" y="156" fill="#7dd3fc" font-size="13" font-weight="800">(4)</text>' +
        '<text x="180" y="236" fill="#7dd3fc" font-size="13" font-weight="800">(5)</text>' +
        '<circle cx="282" cy="190" r="3.5" fill="#fbbf24"/>' +
        '<text x="292" y="194" fill="#fde047" font-size="13" font-weight="800">A</text>' +
        '<text x="240" y="300" fill="#6ee7b7" font-size="13" font-weight="800" text-anchor="middle">Dòng (4), (5) cùng chiều (trái → phải)</text>' +
        '</svg>';

      var svg2 =
        '<svg viewBox="0 0 480 330" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><marker id="' + u + 'ib" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L9 5 L0 9 z" fill="#f87171"/></marker></defs>' +
        '<rect x="12" y="12" width="456" height="306" rx="10" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Top power source 12V wired to (3) and (1)
        '<rect x="176" y="34" width="128" height="38" rx="6" fill="#0f172a" stroke="#64748b" stroke-width="1.8"/>' +
        '<text x="240" y="58" fill="#fde047" font-size="13.5" font-weight="800" text-anchor="middle">+ Nguồn 12 V −</text>' +
        '<polyline points="176,53 160,53 160,116" fill="none" stroke="#f87171" stroke-width="2.5"/>' +
        '<polyline points="304,53 316,53 316,86 116,86 116,116" fill="none" stroke="#60a5fa" stroke-width="2.5"/>' +
        // Board
        '<rect x="76" y="102" width="328" height="176" rx="8" fill="#1e293b" stroke="#475569" stroke-width="2"/>' +
        // 3 vertical bars: (3) at x=110, (1) at x=154, (2) at x=336
        '<rect x="110" y="116" width="12" height="146" rx="3" fill="#b45309" stroke="#fbbf24" stroke-width="1.6"/>' +
        '<rect x="154" y="116" width="12" height="146" rx="3" fill="#b45309" stroke="#fbbf24" stroke-width="1.6"/>' +
        '<rect x="336" y="116" width="12" height="146" rx="3" fill="#b45309" stroke="#fbbf24" stroke-width="1.6"/>' +
        '<text x="98" y="194" fill="#fde68a" font-size="13" font-weight="800" text-anchor="end">(3)</text>' +
        '<text x="160" y="274" fill="#fde68a" font-size="13" font-weight="800" text-anchor="middle">(1)</text>' +
        '<text x="360" y="194" fill="#fde68a" font-size="13" font-weight="800">(2)</text>' +
        // Wire (4) connects (2) -> (3) bowing upward; Wire (5) connects (1) -> (2) bowing downward (repulsion)
        '<path d="M 116 164 Q 230 144 342 164" fill="none" stroke="#f87171" stroke-width="3.2"/>' +
        '<path d="M 160 214 Q 250 232 342 214" fill="none" stroke="#f87171" stroke-width="3.2"/>' +
        '<line x1="274" y1="146" x2="218" y2="146" stroke="#f87171" stroke-width="2" marker-end="url(#' + u + 'ib)"/>' +
        '<line x1="218" y1="234" x2="274" y2="234" stroke="#f87171" stroke-width="2" marker-end="url(#' + u + 'ib)"/>' +
        '<text x="310" y="146" fill="#fca5a5" font-size="13" font-weight="800">(4)</text>' +
        '<text x="188" y="242" fill="#fca5a5" font-size="13" font-weight="800">(5)</text>' +
        '<text x="240" y="300" fill="#fca5a5" font-size="13" font-weight="800" text-anchor="middle">Dòng (4), (5) ngược chiều (đẩy nhau)</text>' +
        '</svg>';

      return '<div class="vlxt-visual-container"><div class="vlxt-grid-2col">' +
        '<div class="vlxt-stage-wrap">' + captionHtml('fa-solid fa-compress', this.caption) + svg1 + '</div>' +
        '<div class="vlxt-stage-wrap">' + captionHtml('fa-solid fa-expand', this.caption2) + svg2 + '</div>' +
        '</div></div>';
    }
  },

  'MH-C3-84': {
    id: 'MH-C3-84',
    title: 'Đồ thị lưới quỹ đạo chùm electron trong điện trường E và từ trường B',
    topic: 'DS-C3.5',
    layout: 'grid-2col',
    caption: 'Hình a: Chùm electron lệch xuống trong điện trường đều E (qua tọa độ 81,0 mm; −30,0 mm)',
    caption2: 'Hình b: Chùm electron uốn cong lên trong từ trường đều B (qua tọa độ 45,0 mm; 30,0 mm)',
    alt: 'Hai đồ thị lưới tọa độ milimet: Hình a đường parabol đi xuống tới x = 81,0 mm và y = 30,0 mm; Hình b cung tròn đi lên tới x = 45,0 mm và y = 30,0 mm',
    build: function (u) {
      // Grid A: 15 cols (step 24px -> 360px wide, x from 84 to 444), 7 rows (step 32px -> y from 64 to 288). x-axis at row 2 -> y0 = 128.
      // Point (9 cols, 5 rows down) -> (84 + 9*24 = 300, 128 + 5*32 = 288). Wait let's make stepY = 28 -> row 2 at y0 = 112, 5 rows down -> 252!
      var gridA = '';
      for (var c = 0; c <= 15; c++) {
        var gx = 84 + c * 24;
        gridA += '<line x1="' + gx + '" y1="56" x2="' + gx + '" y2="252" stroke="' + (c === 9 ? '#475569' : '#1e293b') + '" stroke-dasharray="3 3"/>';
      }
      for (var r = 0; r <= 7; r++) {
        var gy = 56 + r * 28;
        gridA += '<line x1="84" y1="' + gy + '" x2="444" y2="' + gy + '" stroke="' + (r === 7 ? '#475569' : '#1e293b') + '" stroke-dasharray="3 3"/>';
      }
      var svg1 =
        '<svg viewBox="0 0 480 320" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><marker id="' + u + 'ax1" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L9 5 L0 9 z" fill="#cbd5e1"/></marker></defs>' +
        '<rect x="12" y="12" width="456" height="296" rx="10" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        gridA +
        // Axes: O at (84, 112)
        '<line x1="84" y1="112" x2="454" y2="112" stroke="#cbd5e1" stroke-width="2" marker-end="url(#' + u + 'ax1)"/>' +
        '<line x1="84" y1="264" x2="84" y2="42" stroke="#cbd5e1" stroke-width="2" marker-end="url(#' + u + 'ax1)"/>' +
        '<text x="458" y="116" fill="#cbd5e1" font-size="13.5" font-weight="800">x</text>' +
        '<text x="74" y="48" fill="#cbd5e1" font-size="13.5" font-weight="800" text-anchor="end">y</text>' +
        '<text x="74" y="116" fill="#94a3b8" font-size="12.5" font-weight="700" text-anchor="end">O</text>' +
        // Coordinate labels placed cleanly WITHOUT blocking grid/curve
        '<text x="300" y="280" fill="#fbbf24" font-size="13.5" font-weight="800" text-anchor="middle">81,0 mm</text>' +
        '<text x="74" y="256" fill="#fbbf24" font-size="13" font-weight="800" text-anchor="end">30,0 mm</text>' +
        '<line x1="300" y1="252" x2="300" y2="262" stroke="#fbbf24" stroke-width="1.5"/>' +
        // Parabolic curve: O(84,112) -> (300,252) with tangent along +x at O -> Q(192, 112) (Exact Bezier for y = k x^2!)
        '<path d="M 84 112 Q 192 112 300 252" fill="none" stroke="#38bdf8" stroke-width="3.4"/>' +
        '<circle cx="300" cy="252" r="5" fill="#fbbf24" stroke="#070d1c" stroke-width="1.5"/>' +
        '<text x="366" y="78" fill="#fca5a5" font-size="13" font-weight="800" text-anchor="middle">Vùng điện trường E</text>' +
        '</svg>';

      // Grid B: 9 cols (step 36px -> x from 90 to 414), 6 rows (step 34px -> y from 54 to 258). x-axis at row 5 (y0 = 224).
      // Curve goes from O(90, 224) to (5 cols = 270, 5 rows up = 54)!
      var gridB = '';
      for (var c2 = 0; c2 <= 9; c2++) {
        var gx2 = 90 + c2 * 36;
        gridB += '<line x1="' + gx2 + '" y1="54" x2="' + gx2 + '" y2="258" stroke="' + (c2 === 5 ? '#475569' : '#1e293b') + '" stroke-dasharray="3 3"/>';
      }
      for (var r2 = 0; r2 <= 6; r2++) {
        var gy2 = 54 + r2 * 34;
        gridB += '<line x1="90" y1="' + gy2 + '" x2="414" y2="' + gy2 + '" stroke="' + (r2 === 0 ? '#475569' : '#1e293b') + '" stroke-dasharray="3 3"/>';
      }
      var svg2 =
        '<svg viewBox="0 0 480 320" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><marker id="' + u + 'ax2" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L9 5 L0 9 z" fill="#cbd5e1"/></marker></defs>' +
        '<rect x="12" y="12" width="456" height="296" rx="10" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        gridB +
        '<line x1="90" y1="224" x2="432" y2="224" stroke="#cbd5e1" stroke-width="2" marker-end="url(#' + u + 'ax2)"/>' +
        '<line x1="90" y1="268" x2="90" y2="38" stroke="#cbd5e1" stroke-width="2" marker-end="url(#' + u + 'ax2)"/>' +
        '<text x="440" y="228" fill="#cbd5e1" font-size="13.5" font-weight="800">x</text>' +
        '<text x="80" y="44" fill="#cbd5e1" font-size="13.5" font-weight="800" text-anchor="end">y</text>' +
        '<text x="80" y="232" fill="#94a3b8" font-size="12.5" font-weight="700" text-anchor="end">O</text>' +
        // Coordinate labels placed cleanly WITHOUT overlapping grid
        '<text x="270" y="44" fill="#fbbf24" font-size="13.5" font-weight="800" text-anchor="middle">45,0 mm</text>' +
        '<text x="78" y="60" fill="#fbbf24" font-size="13" font-weight="800" text-anchor="end">30,0 mm</text>' +
        '<text x="270" y="282" fill="#7dd3fc" font-size="13.5" font-weight="800" text-anchor="middle">Vùng từ trường B</text>' +
        // Circular arc centered above or exact R = 195 px curving upward from (90,224) to (270,54)
        '<path d="M 90 224 A 195 195 0 0 0 270 54" fill="none" stroke="#10b981" stroke-width="3.4"/>' +
        '<circle cx="270" cy="54" r="5" fill="#fbbf24" stroke="#070d1c" stroke-width="1.5"/>' +
        '</svg>';

      return '<div class="vlxt-visual-container"><div class="vlxt-grid-2col">' +
        '<div class="vlxt-stage-wrap">' + captionHtml('fa-solid fa-wave-square', this.caption) + svg1 + '</div>' +
        '<div class="vlxt-stage-wrap">' + captionHtml('fa-solid fa-draw-polygon', this.caption2) + svg2 + '</div>' +
        '</div></div>';
    }
  }

  ,'MH-C4-85': {
    id: 'MH-C4-85',
    title: 'Thí nghiệm tán xạ hạt alpha lên lá vàng mỏng (Rutherford 1911)',
    topic: 'DS-C4.1',
    layout: 'single',
    caption: 'Đa số hạt alpha xuyên thẳng qua phần rỗng của nguyên tử vàng; rất ít hạt (1/10⁴) bị bật ngược > 90°',
    alt: 'Lưới hai lớp nguyên tử vàng với các hạt nhân nhỏ ở tâm, chùm tia alpha bắn từ trái: đa số đi thẳng, một số lệch hướng và một tia bật ngược góc lớn hơn 90 độ',
    build: function (u) {
      var atoms = '';
      var centers = [
        [295,86],[295,180],[295,274],
        [415,133],[415,227]
      ];
      for (var i = 0; i < centers.length; i++) {
        var cx = centers[i][0], cy = centers[i][1];
        atoms += '<circle cx="' + cx + '" cy="' + cy + '" r="42" fill="rgba(250,204,21,0.12)" stroke="#eab308" stroke-width="1.6"/>' +
          '<circle cx="' + cx + '" cy="' + cy + '" r="6" fill="#ef4444" stroke="#fecaca" stroke-width="1"/>';
      }
      var svg =
        '<svg viewBox="0 0 700 350" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs>' +
        '<marker id="' + u + 'ba" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L9 5 L0 9 z" fill="#38bdf8"/></marker>' +
        '<marker id="' + u + 'bb" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L9 5 L0 9 z" fill="#f87171"/></marker>' +
        '</defs>' +
        '<rect x="16" y="16" width="668" height="318" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        atoms +
        // Parallel straight alpha beams passing empty space
        '<line x1="92" y1="60" x2="548" y2="60" stroke="#38bdf8" stroke-width="2.4" marker-end="url(#' + u + 'ba)" class="ambient-ray-glide"/>' +
        '<line x1="92" y1="126" x2="548" y2="126" stroke="#38bdf8" stroke-width="2.4" marker-end="url(#' + u + 'ba)" class="ambient-ray-glide"/>' +
        '<line x1="92" y1="234" x2="548" y2="234" stroke="#38bdf8" stroke-width="2.4" marker-end="url(#' + u + 'ba)" class="ambient-ray-glide"/>' +
        '<line x1="92" y1="296" x2="548" y2="296" stroke="#38bdf8" stroke-width="2.4" marker-end="url(#' + u + 'ba)" class="ambient-ray-glide"/>' +
        // Slightly deflected ray passing near (415, 227)
        '<path d="M 92 214 L 380 214 Q 415 214 532 152" fill="none" stroke="#38bdf8" stroke-width="2.4" marker-end="url(#' + u + 'ba)"/>' +
        // Large > 90 deg rebound ray approaching nucleus (295, 180)
        '<path d="M 92 176 L 266 176 Q 288 176 268 156 L 166 74" fill="none" stroke="#f87171" stroke-width="2.8" marker-end="url(#' + u + 'bb)"/>' +
        // Clean labels
        '<text x="58" y="184" fill="#7dd3fc" font-size="13.5" font-weight="800" text-anchor="middle">Chùm</text>' +
        '<text x="58" y="202" fill="#7dd3fc" font-size="13.5" font-weight="800" text-anchor="middle">hạt α</text>' +
        '<text x="562" y="64" fill="#7dd3fc" font-size="13" font-weight="800">Đi qua thẳng</text>' +
        '<text x="542" y="156" fill="#7dd3fc" font-size="13" font-weight="800">Lệch hướng</text>' +
        '<rect x="466" y="256" width="204" height="58" rx="8" fill="#0f172a" stroke="#f87171" stroke-width="1.4"/>' +
        '<text x="568" y="280" fill="#fca5a5" font-size="12.5" font-weight="800" text-anchor="middle">≈ 1/10⁴ hạt α lệch &gt; 90°</text>' +
        '<text x="568" y="300" fill="#fde047" font-size="12" text-anchor="middle">Nguyên tử vàng &amp; Hạt nhân</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-bullseye', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C4-86': {
    id: 'MH-C4-86',
    title: 'Hệ thí nghiệm Rutherford & Quỹ đạo hạt alpha gần hạt nhân vàng',
    topic: 'DS-C4.1',
    layout: 'grid-2col',
    caption: 'Hình a: Nguồn phát α → Khe hẹp → Lá vàng mỏng đặt giữa màn huỳnh quang tròn',
    caption2: 'Hình b: Hạt α tiến sát hạt nhân vàng chịu lực đẩy tĩnh điện bật góc lớn',
    alt: 'Hai hình: bố trí thí nghiệm tán xạ với lá vàng và màn huỳnh quang xung quanh; phóng đại hạt nhân vàng làm bật ngược và lệch góc các hạt alpha',
    build: function (u) {
      var svg1 =
        '<svg viewBox="0 0 480 320" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><marker id="' + u + 'sa" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L9 5 L0 9 z" fill="#38bdf8"/></marker></defs>' +
        '<rect x="12" y="12" width="456" height="296" rx="10" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Circular fluorescent screen centered at (300, 160), opening at left
        '<path d="M 220 120 A 92 92 0 1 1 220 200" fill="none" stroke="#10b981" stroke-width="8" stroke-linecap="round"/>' +
        '<text x="300" y="54" fill="#6ee7b7" font-size="13" font-weight="800" text-anchor="middle">Màn huỳnh quang</text>' +
        // Lead box alpha source & narrow slit
        '<rect x="34" y="138" width="76" height="44" rx="5" fill="#334155" stroke="#94a3b8" stroke-width="2"/>' +
        '<text x="72" y="165" fill="#fde047" font-size="13" font-weight="800" text-anchor="middle">Nguồn α</text>' +
        '<rect x="148" y="120" width="12" height="32" fill="#64748b"/>' +
        '<rect x="148" y="168" width="12" height="32" fill="#64748b"/>' +
        '<text x="154" y="108" fill="#cbd5e1" font-size="12.5" font-weight="700" text-anchor="middle">Khe hẹp</text>' +
        // Gold foil vertical at (300,160)
        '<line x1="300" y1="126" x2="300" y2="194" stroke="#fbbf24" stroke-width="4.5"/>' +
        '<text x="300" y="220" fill="#fde047" font-size="13" font-weight="800" text-anchor="middle">Lá vàng</text>' +
        // Alpha trajectories hitting screen
        '<line x1="110" y1="160" x2="386" y2="160" stroke="#38bdf8" stroke-width="2.6" marker-end="url(#' + u + 'sa)" class="ambient-ray-glide"/>' +
        '<line x1="300" y1="160" x2="372" y2="108" stroke="#38bdf8" stroke-width="2.2" marker-end="url(#' + u + 'sa)"/>' +
        '<line x1="300" y1="160" x2="234" y2="96" stroke="#f87171" stroke-width="2.2" marker-end="url(#' + u + 'sa)"/>' +
        '</svg>';

      var svg2 =
        '<svg viewBox="0 0 480 320" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><marker id="' + u + 'sb" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L9 5 L0 9 z" fill="#38bdf8"/></marker></defs>' +
        '<rect x="12" y="12" width="456" height="296" rx="10" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Single zoomed Gold atom + positive nucleus
        '<circle cx="258" cy="160" r="96" fill="rgba(250,204,21,0.10)" stroke="#eab308" stroke-width="1.8" stroke-dasharray="5 4"/>' +
        '<circle cx="258" cy="160" r="14" fill="#ef4444" stroke="#fecaca" stroke-width="1.8"/>' +
        '<text x="258" y="165" fill="#fff" font-size="13" font-weight="800" text-anchor="middle">+</text>' +
        '<text x="258" y="48" fill="#fde047" font-size="13.5" font-weight="800" text-anchor="middle">Hạt nhân vàng (Q_n = 79e)</text>' +
        // Passing rays & head-on rebound showing closest distance x
        '<line x1="56" y1="92" x2="420" y2="92" stroke="#38bdf8" stroke-width="2.4" marker-end="url(#' + u + 'sb)"/>' +
        '<path d="M 56 128 L 220 128 Q 266 128 386 72" fill="none" stroke="#38bdf8" stroke-width="2.4" marker-end="url(#' + u + 'sb)"/>' +
        // Head-on approach & turnback at distance x
        '<line x1="56" y1="160" x2="210" y2="160" stroke="#fbbf24" stroke-width="3"/>' +
        '<circle cx="212" cy="160" r="5" fill="#fbbf24"/>' +
        '<line x1="212" y1="176" x2="258" y2="176" stroke="#f87171" stroke-width="1.8"/>' +
        '<text x="235" y="194" fill="#fca5a5" font-size="13" font-weight="800" text-anchor="middle">x</text>' +
        '<text x="136" y="274" fill="#cbd5e1" font-size="12.5" font-weight="700" text-anchor="middle">v = 2·10⁷ m/s (xuyên tâm)</text>' +
        '<path d="M 56 218 L 222 218 Q 272 218 396 270" fill="none" stroke="#38bdf8" stroke-width="2.4" marker-end="url(#' + u + 'sb)"/>' +
        '</svg>';

      return '<div class="vlxt-visual-container"><div class="vlxt-grid-2col">' +
        '<div class="vlxt-stage-wrap">' + captionHtml('fa-solid fa-circle-radiation', this.caption) + svg1 + '</div>' +
        '<div class="vlxt-stage-wrap">' + captionHtml('fa-solid fa-atom', this.caption2) + svg2 + '</div>' +
        '</div></div>';
    }
  },

  'MH-C4-87': {
    id: 'MH-C4-87',
    title: 'Chuỗi tích tụ và phân rã Strontium Sr-90 trong xương',
    topic: 'DS-C4.4',
    layout: 'single',
    caption: 'Đồng vị ⁹⁰₃₈Sr (T = 28,79 năm) theo chuỗi thức ăn tích tụ trong xương phát tia β⁻',
    alt: 'Sơ đồ chuỗi tích tụ Strontium-90 từ bụi phóng xạ qua cỏ sữa vào xương người và phát bức xạ beta trừ',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 320" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><marker id="' + u + 'ar" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L9 5 L0 9 z" fill="#f59e0b"/></marker></defs>' +
        '<rect x="16" y="16" width="668" height="288" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // 3 chain boxes
        '<rect x="40" y="64" width="144" height="84" rx="8" fill="#1e293b" stroke="#f59e0b" stroke-width="1.8"/>' +
        '<text x="112" y="96" fill="#fde68a" font-size="13.5" font-weight="800" text-anchor="middle">Bụi phóng xạ</text>' +
        '<text x="112" y="122" fill="#e2e8f0" font-size="13" font-weight="700" text-anchor="middle">⁹⁰₃₈Sr (T = 28,79 năm)</text>' +
        '<line x1="184" y1="106" x2="226" y2="106" stroke="#f59e0b" stroke-width="2.6" marker-end="url(#' + u + 'ar)"/>' +
        '<rect x="230" y="64" width="144" height="84" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="1.8"/>' +
        '<text x="302" y="96" fill="#7dd3fc" font-size="13.5" font-weight="800" text-anchor="middle">Cỏ &amp; Sữa bò</text>' +
        '<text x="302" y="122" fill="#cbd5e1" font-size="12.5" text-anchor="middle">Tương đồng Canxi</text>' +
        '<line x1="374" y1="106" x2="416" y2="106" stroke="#f59e0b" stroke-width="2.6" marker-end="url(#' + u + 'ar)"/>' +
        '<rect x="420" y="64" width="236" height="84" rx="8" fill="#1e293b" stroke="#f87171" stroke-width="1.8"/>' +
        '<text x="538" y="96" fill="#fca5a5" font-size="13.5" font-weight="800" text-anchor="middle">Tủy xương người</text>' +
        '<text x="538" y="122" fill="#fee2e2" font-size="12.5" text-anchor="middle">Phát tia β⁻ năng lượng cao</text>' +
        // Bottom qualitative nuclear decay schematic
        '<rect x="40" y="178" width="616" height="98" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>' +
        '<circle cx="118" cy="227" r="24" fill="#92400e" stroke="#fbbf24" stroke-width="2.2"/>' +
        '<text x="118" y="232" fill="#fef08a" font-size="14" font-weight="800" text-anchor="middle">⁹⁰Sr</text>' +
        '<line x1="146" y1="227" x2="210" y2="227" stroke="#f87171" stroke-width="2.6" marker-end="url(#' + u + 'ar)" class="ambient-ray-glide"/>' +
        '<text x="178" y="216" fill="#fca5a5" font-size="13" font-weight="800" text-anchor="middle">β⁻</text>' +
        '<circle cx="242" cy="227" r="22" fill="#1e3a8a" stroke="#60a5fa" stroke-width="2.2"/>' +
        '<text x="242" y="232" fill="#e0f2fe" font-size="14" font-weight="800" text-anchor="middle">X</text>' +
        '<text x="306" y="212" fill="#e2e8f0" font-size="13" font-weight="700">• Mẫu phân tích: m₀ = 0,0145 μg (M = 90 g/mol)</text>' +
        '<text x="306" y="236" fill="#cbd5e1" font-size="13">• Chu kì bán rã T = 28,79 năm (m_ban đầu lẫn sẵn X)</text>' +
        '<text x="306" y="260" fill="#7dd3fc" font-size="12.5">N(t) = N₀·2^(-t/T) · N_A = 6,02·10²³ mol⁻¹</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-bone', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C4-88': {
    id: 'MH-C4-88',
    title: 'Phát tán đồng vị phóng xạ Iodine I-131 vào sữa bò và ngưỡng an toàn',
    topic: 'DS-C4.4',
    layout: 'single',
    caption: 'Mẫu sữa nhiễm ¹³¹₅₃I có H₀ = 2850 Bq/lít phân rã β⁻ theo chu kì T = 8,02 ngày (ngưỡng 100 Bq/lít)',
    alt: 'Sơ đồ chuỗi phát tán I-131 vào đồng cỏ, sữa bò và máy đo hoạt độ phóng xạ so với ngưỡng an toàn 100 Bq/lít',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 320" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="16" y="16" width="668" height="288" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        '<rect x="44" y="54" width="176" height="106" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="1.8"/>' +
        '<text x="132" y="84" fill="#fde68a" font-size="14" font-weight="800" text-anchor="middle">Đồng vị ¹³¹₅₃I</text>' +
        '<text x="132" y="110" fill="#e2e8f0" font-size="13" text-anchor="middle">Phân rã: ¹³¹₅₃I → Xe + β⁻</text>' +
        '<text x="132" y="136" fill="#cbd5e1" font-size="12.5" text-anchor="middle">T = 8,02 ngày đêm</text>' +
        '<rect x="258" y="54" width="184" height="106" rx="10" fill="#0f172a" stroke="#38bdf8" stroke-width="1.8"/>' +
        '<text x="350" y="84" fill="#7dd3fc" font-size="14" font-weight="800" text-anchor="middle">Mẫu sữa bò</text>' +
        '<text x="350" y="112" fill="#f8fafc" font-size="14" font-weight="800" font-family="DM Mono,monospace" text-anchor="middle">H₀ = 2850 Bq/lít</text>' +
        '<text x="350" y="136" fill="#cbd5e1" font-size="12.5" text-anchor="middle">Đo ngay sau thử nghiệm</text>' +
        '<rect x="480" y="54" width="176" height="106" rx="10" fill="#0f172a" stroke="#10b981" stroke-width="1.8"/>' +
        '<text x="568" y="84" fill="#6ee7b7" font-size="14" font-weight="800" text-anchor="middle">Giới hạn an toàn</text>' +
        '<text x="568" y="112" fill="#34d399" font-size="14" font-weight="800" font-family="DM Mono,monospace" text-anchor="middle">H_gh = 100 Bq/lít</text>' +
        '<text x="568" y="136" fill="#cbd5e1" font-size="12.5" text-anchor="middle">Giảm theo hàm mũ</text>' +
        // Simple qualitative decay graph bottom
        '<rect x="44" y="180" width="612" height="98" rx="8" fill="#050811" stroke="#334155" stroke-width="1.4"/>' +
        '<line x1="94" y1="258" x2="610" y2="258" stroke="#64748b" stroke-width="1.8"/>' +
        '<line x1="94" y1="258" x2="94" y2="196" stroke="#64748b" stroke-width="1.8"/>' +
        '<path d="M 94 202 Q 220 232 580 250" fill="none" stroke="#38bdf8" stroke-width="3"/>' +
        '<line x1="94" y1="242" x2="600" y2="242" stroke="#10b981" stroke-width="1.6" stroke-dasharray="5 4"/>' +
        '<text x="498" y="234" fill="#6ee7b7" font-size="12" font-weight="700">Ngưỡng 100 Bq/lít</text>' +
        '<text x="128" y="200" fill="#fde047" font-size="12" font-weight="700">H₀ = 2850 Bq/lít</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-radiation', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C4-89': {
    id: 'MH-C4-89',
    title: 'Chụp cắt lớp phát xạ Positron (PET) bằng đồng vị F-18',
    topic: 'DS-C4.3',
    layout: 'single',
    caption: 'Đồng vị ¹⁸₉F (T = 11/6 giờ) phát positron β⁺ hủy cặp tạo hai tia γ đối xứng vào vòng đầu dò PET',
    alt: 'Vòng đầu dò PET bao quanh bệnh nhân ghi nhận hai tia gamma phát ra ngược chiều 180 độ từ quá trình hủy cặp positron của đồng vị F-18',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 320" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><marker id="' + u + 'gm" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L9 5 L0 9 z" fill="#fde047"/></marker></defs>' +
        '<rect x="16" y="16" width="668" height="288" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Circular PET detector ring centered at (215, 160)
        '<circle cx="215" cy="160" r="108" fill="#0f172a" stroke="#38bdf8" stroke-width="14" stroke-dasharray="18 6"/>' +
        '<circle cx="215" cy="160" r="94" fill="#050811" stroke="#334155" stroke-width="2"/>' +
        // Body silhouette cross-section + tumor hotspot
        '<ellipse cx="215" cy="164" rx="58" ry="38" fill="#1e293b" stroke="#64748b" stroke-width="2"/>' +
        '<circle cx="228" cy="158" r="10" fill="#ef4444"/>' +
        // Coincident 180 deg gamma photons hitting opposite detectors
        '<line x1="228" y1="158" x2="310" y2="112" stroke="#fde047" stroke-width="2.6" stroke-dasharray="5 3" marker-end="url(#' + u + 'gm)" class="ambient-ray-glide"/>' +
        '<line x1="228" y1="158" x2="128" y2="212" stroke="#fde047" stroke-width="2.6" stroke-dasharray="5 3" marker-end="url(#' + u + 'gm)" class="ambient-ray-glide"/>' +
        '<text x="278" y="120" fill="#fde047" font-size="13" font-weight="800">γ</text>' +
        '<text x="156" y="210" fill="#fde047" font-size="13" font-weight="800">γ</text>' +
        '<text x="215" y="294" fill="#7dd3fc" font-size="13" font-weight="800" text-anchor="middle">Vòng đầu dò PET (Phát hiện đồng thời 2 tia γ)</text>' +
        // Physics summary right
        '<rect x="372" y="56" width="288" height="206" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>' +
        '<text x="516" y="88" fill="#38bdf8" font-size="14" font-weight="800" text-anchor="middle">Dược chất FDG (¹⁸₉F)</text>' +
        '<text x="390" y="120" fill="#e2e8f0" font-size="13">• Phóng xạ β⁺: phát positron (₊₁⁰e)</text>' +
        '<text x="390" y="148" fill="#e2e8f0" font-size="13">• Chu kì bán rã: T = 11/6 giờ (110 phút)</text>' +
        '<text x="390" y="176" fill="#cbd5e1" font-size="13">• Biến đổi trong hạt nhân: p → n + β⁺</text>' +
        '<text x="390" y="204" fill="#fde68a" font-size="13">• Thời gian theo dõi: t = 150 phút</text>' +
        '<text x="390" y="236" fill="#94a3b8" font-size="12">Tạo ảnh 3D khối u bằng tia γ hủy cặp</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-hospital', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C4-90': {
    id: 'MH-C4-90',
    title: 'Xạ trị ung thư tuyến giáp bằng liều uống Iodine I-131 (9,2 μg)',
    topic: 'DS-C4.3',
    layout: 'single',
    caption: 'Tuyến giáp tập trung đồng vị ¹³¹₅₃I (m₀ = 9,2 μg, T = 8,0 ngày) phát tia β⁻ và tia γ',
    alt: 'Mô hình điều trị tuyến giáp bằng 9,2 microgam đồng vị Iodine-131 phóng xạ beta kèm tia gamma cần cách li an toàn',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 310" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="16" y="16" width="668" height="278" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Stylized thyroid gland butterfly silhouette left
        '<path d="M 150 112 C 110 92 92 146 118 192 C 136 218 164 198 166 172 L 194 172 C 196 198 224 218 242 192 C 268 146 250 92 210 112 C 192 122 192 148 180 148 C 168 148 168 122 150 112 Z" fill="rgba(248,113,113,0.22)" stroke="#f87171" stroke-width="2.8"/>' +
        '<circle cx="222" cy="146" r="11" fill="#fbbf24" opacity="0.85" class="ambient-heat-arrow"/>' +
        '<text x="180" y="246" fill="#fca5a5" font-size="13.5" font-weight="800" text-anchor="middle">Tuyến giáp (hấp thụ mạnh I-131)</text>' +
        // Right card specs
        '<rect x="316" y="54" width="340" height="202" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>' +
        '<text x="486" y="84" fill="#fde68a" font-size="14.5" font-weight="800" text-anchor="middle">Thông số liều xạ trị ¹³¹₅₃I</text>' +
        '<text x="336" y="116" fill="#e2e8f0" font-size="13">• Khối lượng ban đầu: m₀ = 9,2 μg</text>' +
        '<text x="336" y="144" fill="#e2e8f0" font-size="13">• Chu kì bán rã: T = 8,0 ngày đêm</text>' +
        '<text x="336" y="172" fill="#fca5a5" font-size="13">• Bức xạ: tia β⁻ (tiêu diệt tế bào) + tia γ</text>' +
        '<text x="336" y="200" fill="#7dd3fc" font-size="13">• Thời gian theo dõi: sau t = 5 ngày</text>' +
        '<text x="336" y="230" fill="#94a3b8" font-size="12">1 Ci = 3,7·10¹⁰ Bq · N_A = 6,02·10²³ mol⁻¹</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-kit-medical', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C4-91': {
    id: 'MH-C4-91',
    title: 'Đồ thị suy giảm độ phóng xạ xuất viện (36,0 mCi → 30,0 mCi)',
    topic: 'DS-C4.3',
    layout: 'single',
    caption: 'Theo dõi độ phóng xạ I-131 giảm từ 36,0 mCi xuống ngưỡng xuất viện 30,0 mCi',
    alt: 'Đồ thị suy giảm độ phóng xạ H(t) của Iodine-131 từ mức ban đầu 36,0 mCi xuống ngưỡng an toàn xuất viện 30,0 mCi',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 320" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><marker id="' + u + 'ax" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L9 5 L0 9 z" fill="#cbd5e1"/></marker></defs>' +
        '<rect x="16" y="16" width="668" height="288" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Axes
        '<line x1="94" y1="264" x2="430" y2="264" stroke="#cbd5e1" stroke-width="2" marker-end="url(#' + u + 'ax)"/>' +
        '<line x1="94" y1="264" x2="94" y2="48" stroke="#cbd5e1" stroke-width="2" marker-end="url(#' + u + 'ax)"/>' +
        '<text x="104" y="54" fill="#e2e8f0" font-size="13.5" font-weight="800">H (mCi)</text>' +
        '<text x="436" y="268" fill="#e2e8f0" font-size="13.5" font-weight="800">t (ngày)</text>' +
        // Decay curve from H0 = 36 (y=80) decaying cleanly
        '<path d="M 94 80 Q 230 164 410 218" fill="none" stroke="#38bdf8" stroke-width="3.2"/>' +
        '<text x="84" y="84" fill="#fde047" font-size="13" font-weight="800" text-anchor="end">36,0</text>' +
        '<line x1="94" y1="128" x2="410" y2="128" stroke="#10b981" stroke-width="1.8" stroke-dasharray="5 4"/>' +
        '<text x="84" y="132" fill="#6ee7b7" font-size="13" font-weight="800" text-anchor="end">30,0</text>' +
        '<circle cx="172" cy="128" r="5" fill="#10b981"/>' +
        '<line x1="172" y1="128" x2="172" y2="264" stroke="#10b981" stroke-width="1.4" stroke-dasharray="3 3"/>' +
        '<text x="172" y="284" fill="#6ee7b7" font-size="13" font-weight="800" text-anchor="middle">t_xv = ?</text>' +
        '<text x="275" y="118" fill="#6ee7b7" font-size="12" font-weight="700">Ngưỡng cho phép xuất viện</text>' +
        // Right card
        '<rect x="464" y="64" width="198" height="176" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>' +
        '<text x="563" y="94" fill="#fde68a" font-size="14" font-weight="800" text-anchor="middle">Hồ sơ bệnh nhân</text>' +
        '<text x="480" y="126" fill="#e2e8f0" font-size="12.5">• Nguồn: ¹³¹₅₃I (tia β⁻)</text>' +
        '<text x="480" y="152" fill="#e2e8f0" font-size="12.5">• T = 8 ngày đêm</text>' +
        '<text x="480" y="178" fill="#e2e8f0" font-size="12.5">• H₀ = 36,0 mCi</text>' +
        '<text x="480" y="204" fill="#6ee7b7" font-size="12.5">• Ngưỡng ra viện: 30,0 mCi</text>' +
        '<text x="480" y="228" fill="#94a3b8" font-size="12">Bỏ qua bài tiết sinh học</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-chart-line', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C4-92': {
    id: 'MH-C4-92',
    title: 'Đánh dấu phóng xạ I-131 trong mô hình nuôi cấy tế bào ung thư',
    topic: 'DS-C4.3',
    layout: 'single',
    caption: '1 lít môi trường nuôi cấy (mật độ 10⁶ tế bào/ml) được đánh dấu 10⁻¹² g ¹³¹₅₃I mỗi tế bào',
    alt: 'Bình nuôi cấy 1 lít tế bào ung thư và phóng đại kính hiển vi hiển thị chất đánh dấu I-131 phát bức xạ gamma 364 keV',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 320" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="16" y="16" width="668" height="288" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Culture flask left
        '<path d="M 106 64 L 154 64 L 154 114 L 208 214 Q 214 236 190 236 L 70 236 Q 46 236 52 214 L 106 114 Z" fill="rgba(56,189,248,0.16)" stroke="#38bdf8" stroke-width="2.6"/>' +
        '<text x="130" y="206" fill="#e0f2fe" font-size="13.5" font-weight="800" text-anchor="middle">1 lít (≈ 1 kg)</text>' +
        '<text x="130" y="264" fill="#7dd3fc" font-size="13" font-weight="800" text-anchor="middle">Môi trường nuôi cấy</text>' +
        // Zoomed cell circle
        '<circle cx="318" cy="156" r="64" fill="#0f172a" stroke="#f87171" stroke-width="2.4"/>' +
        '<circle cx="304" cy="144" r="14" fill="#7f1d1d" stroke="#fca5a5" stroke-width="1.8"/>' +
        '<circle cx="338" cy="170" r="12" fill="#7f1d1d" stroke="#fca5a5" stroke-width="1.8"/>' +
        '<circle cx="304" cy="144" r="4" fill="#fde047"/>' +
        '<text x="318" y="242" fill="#fca5a5" font-size="13" font-weight="800" text-anchor="middle">10⁶ tế bào / ml</text>' +
        // Summary card right
        '<rect x="412" y="56" width="248" height="206" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>' +
        '<text x="536" y="86" fill="#fde68a" font-size="14" font-weight="800" text-anchor="middle">Thông số đánh dấu ¹³¹I</text>' +
        '<text x="430" y="116" fill="#e2e8f0" font-size="12.5">• Chu kì bán rã: T = 8 ngày</text>' +
        '<text x="430" y="142" fill="#e2e8f0" font-size="12.5">• Mỗi tế bào cần: 10⁻¹² g ¹³¹I</text>' +
        '<text x="430" y="168" fill="#e2e8f0" font-size="12.5">• Năng lượng tia γ: ε = 364 keV</text>' +
        '<text x="430" y="194" fill="#e2e8f0" font-size="12.5">• Liều chịu tối đa: 100 Gy</text>' +
        '<text x="430" y="224" fill="#7dd3fc" font-size="12.5">Khảo sát 24 giờ (1 ngày) đầu</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-flask', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C4-93': {
    id: 'MH-C4-93',
    title: 'Cảm biến báo khói ion hóa dùng nguồn phóng xạ Americium Am-241',
    topic: 'DS-C4.4',
    layout: 'single',
    caption: 'Tia α từ ²⁴¹₉₅Am ion hóa không khí giữa hai bản cực; khói vào làm giảm dòng điện kích hoạt báo cháy',
    alt: 'Sơ đồ cảm biến báo khói ion hóa gồm nguồn Am-241 phát hạt alpha vào buồng hai bản cực nối nguồn điện một chiều, cảm biến dòng điện và chuông báo cháy',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 350" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="16" y="16" width="668" height="318" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Outer ionization chamber housing
        '<rect x="136" y="116" width="288" height="158" rx="10" fill="#0f172a" stroke="#64748b" stroke-width="2.4"/>' +
        // Vent slots at bottom for smoke
        '<line x1="184" y1="274" x2="218" y2="274" stroke="#070d1c" stroke-width="5"/>' +
        '<line x1="340" y1="274" x2="374" y2="274" stroke="#070d1c" stroke-width="5"/>' +
        // Top current sensor & circuit to horn
        '<rect x="206" y="42" width="148" height="44" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>' +
        '<text x="280" y="69" fill="#7dd3fc" font-size="13.5" font-weight="800" text-anchor="middle">Cảm biến dòng điện</text>' +
        '<line x1="354" y1="64" x2="450" y2="64" stroke="#f87171" stroke-width="2.6" class="ambient-wire-pulse"/>' +
        '<rect x="450" y="42" width="136" height="44" rx="8" fill="#7f1d1d" stroke="#f87171" stroke-width="2"/>' +
        '<text x="518" y="69" fill="#fee2e2" font-size="13.5" font-weight="800" text-anchor="middle">Chuông báo cháy</text>' +
        // Parallel capacitor plates (+ left red, - right blue)
        '<rect x="176" y="138" width="12" height="106" rx="2" fill="#dc2626"/>' +
        '<rect x="372" y="138" width="12" height="106" rx="2" fill="#2563eb"/>' +
        '<text x="164" y="154" fill="#fca5a5" font-size="15" font-weight="800" text-anchor="end">+</text>' +
        '<text x="396" y="154" fill="#93c5fd" font-size="15" font-weight="800">−</text>' +
        '<polyline points="182,138 182,64 206,64" fill="none" stroke="#f87171" stroke-width="2.2"/>' +
        '<polyline points="378,138 378,64 354,64" fill="none" stroke="#60a5fa" stroke-width="2.2"/>' +
        // Am-241 radiation source at bottom center of chamber
        '<rect x="242" y="236" width="76" height="24" rx="4" fill="#92400e" stroke="#fbbf24" stroke-width="2"/>' +
        '<text x="280" y="253" fill="#fef08a" font-size="12.5" font-weight="800" text-anchor="middle">²⁴¹₉₅Am</text>' +
        // Alpha rays + free ions between plates
        '<line x1="264" y1="236" x2="218" y2="174" stroke="#fbbf24" stroke-width="1.8" stroke-dasharray="4 3" class="ambient-ray-glide"/>' +
        '<line x1="280" y1="236" x2="280" y2="162" stroke="#fbbf24" stroke-width="1.8" stroke-dasharray="4 3" class="ambient-ray-glide"/>' +
        '<line x1="296" y1="236" x2="342" y2="174" stroke="#fbbf24" stroke-width="1.8" stroke-dasharray="4 3" class="ambient-ray-glide"/>' +
        '<circle cx="242" cy="182" r="5" fill="#f87171"/><circle cx="316" cy="182" r="5" fill="#60a5fa"/>' +
        '<text x="280" y="146" fill="#cbd5e1" font-size="12.5" font-weight="700" text-anchor="middle">Các ion tự do</text>' +
        // Rising smoke below
        '<g class="ambient-steam">' +
        '<circle cx="202" cy="306" r="10" fill="rgba(148,163,184,0.35)"/>' +
        '<circle cx="356" cy="306" r="10" fill="rgba(148,163,184,0.35)"/>' +
        '</g>' +
        '<text x="280" y="314" fill="#94a3b8" font-size="13" font-weight="800" text-anchor="middle">Khói xâm nhập</text>' +
        // Specs panel right
        '<rect x="444" y="116" width="218" height="158" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1.4"/>' +
        '<text x="553" y="144" fill="#fde68a" font-size="13.5" font-weight="800" text-anchor="middle">Nguồn ²⁴¹₉₅Am</text>' +
        '<text x="460" y="172" fill="#e2e8f0" font-size="12.5">• m₀ = 0,2025 μg</text>' +
        '<text x="460" y="198" fill="#e2e8f0" font-size="12.5">• λ = 5,086·10⁻¹¹ s⁻¹</text>' +
        '<text x="460" y="224" fill="#e2e8f0" font-size="12.5">• M = 241 g/mol</text>' +
        '<text x="460" y="250" fill="#7dd3fc" font-size="12">• Thời gian dùng: 15 năm</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-smog', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C4-94': {
    id: 'MH-C4-94',
    title: 'Lò phản ứng nhiệt hạch D–T (500 MW điện, hiệu suất 25%)',
    topic: 'DS-C4.2',
    layout: 'single',
    caption: 'Tổng hợp ²₁D + ³₁T → ⁴₂He + ¹₀n cấp nhiệt cho nhà máy phát điện 500 MW (H = 25%)',
    alt: 'Sơ đồ phản ứng nhiệt hạch D-T tạo hạt nhân Heli-4 và neutron trong buồng từ truyền nhiệt phát công suất điện 500 MW với hiệu suất 25 phần trăm',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 320" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><marker id="' + u + 'ar" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L9 5 L0 9 z" fill="#38bdf8"/></marker></defs>' +
        '<rect x="16" y="16" width="668" height="288" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Left reaction illustration
        '<circle cx="100" cy="116" r="24" fill="#0369a1" stroke="#38bdf8" stroke-width="2"/>' +
        '<text x="100" y="121" fill="#fff" font-size="14" font-weight="800" text-anchor="middle">²₁D</text>' +
        '<circle cx="100" cy="196" r="24" fill="#92400e" stroke="#fbbf24" stroke-width="2"/>' +
        '<text x="100" y="201" fill="#fff" font-size="14" font-weight="800" text-anchor="middle">³₁T</text>' +
        '<line x1="128" y1="126" x2="188" y2="152" stroke="#38bdf8" stroke-width="2.6" marker-end="url(#' + u + 'ar)"/>' +
        '<line x1="128" y1="186" x2="188" y2="160" stroke="#fbbf24" stroke-width="2.6" marker-end="url(#' + u + 'ar)"/>' +
        '<circle cx="222" cy="156" r="28" fill="#7f1d1d" stroke="#f87171" stroke-width="2.4" class="ambient-heat-arrow"/>' +
        '<text x="222" y="161" fill="#fef2f2" font-size="13" font-weight="800" text-anchor="middle">Nhiệt hạch</text>' +
        '<line x1="254" y1="146" x2="310" y2="116" stroke="#10b981" stroke-width="2.6" marker-end="url(#' + u + 'ar)"/>' +
        '<line x1="254" y1="166" x2="310" y2="196" stroke="#94a3b8" stroke-width="2.6" marker-end="url(#' + u + 'ar)"/>' +
        '<circle cx="340" cy="112" r="24" fill="#065f46" stroke="#34d399" stroke-width="2"/>' +
        '<text x="340" y="117" fill="#fff" font-size="14" font-weight="800" text-anchor="middle">⁴₂He</text>' +
        '<circle cx="340" cy="200" r="20" fill="#334155" stroke="#cbd5e1" stroke-width="2"/>' +
        '<text x="340" y="205" fill="#fff" font-size="13.5" font-weight="800" text-anchor="middle">¹₀n</text>' +
        '<text x="222" y="264" fill="#fde68a" font-size="13" font-weight="800" text-anchor="middle">1 uc² = 931,5 MeV · Δm_D, Δm_T, Δm_He</text>' +
        // Right power plant specs
        '<rect x="412" y="54" width="248" height="206" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>' +
        '<text x="536" y="84" fill="#38bdf8" font-size="14" font-weight="800" text-anchor="middle">Nhà máy điện nhiệt hạch</text>' +
        '<text x="430" y="116" fill="#e2e8f0" font-size="13">• Công suất điện: P = 500 MW</text>' +
        '<text x="430" y="144" fill="#e2e8f0" font-size="13">• Hiệu suất: H = 25%</text>' +
        '<text x="430" y="172" fill="#cbd5e1" font-size="12.5">• Thời gian: 1 năm (365 ngày)</text>' +
        '<text x="430" y="202" fill="#6ee7b7" font-size="12.5">• Δm_D = 0,002491 amu</text>' +
        '<text x="430" y="226" fill="#6ee7b7" font-size="12.5">• Δm_T = 0,009106 amu</text>' +
        '<text x="430" y="248" fill="#6ee7b7" font-size="12.5">• Δm_He = 0,030382 amu</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-fire-flame-curved', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C4-95': {
    id: 'MH-C4-95',
    title: 'Lò phản ứng phân hạch U-235 trên tàu phá băng nguyên tử (120 MW)',
    topic: 'DS-C4.2',
    layout: 'single',
    caption: 'Phản ứng ²³⁵₉₂U + ¹₀n → ¹⁴³₆₀Nd + ⁹⁰₄₀La + k·¹₀n + 8·⁰₋₁e (200 MeV) chạy tàu 120 MW',
    alt: 'Sơ đồ tàu phá băng chạy năng lượng hạt nhân công suất 120 MW với lò phản ứng phân hạch Uranium-235 hiệu suất 30 phần trăm',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 310" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="16" y="16" width="668" height="278" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Icebreaker ship profile bottom-left
        '<line x1="36" y1="242" x2="386" y2="242" stroke="#38bdf8" stroke-width="2.5"/>' +
        '<path d="M 62 198 L 320 198 L 368 242 L 80 242 Z" fill="#1e293b" stroke="#cbd5e1" stroke-width="2.2" stroke-linejoin="round"/>' +
        '<rect x="140" y="162" width="110" height="36" rx="4" fill="#334155" stroke="#94a3b8" stroke-width="1.8"/>' +
        '<rect x="196" y="204" width="56" height="32" rx="4" fill="#92400e" stroke="#fbbf24" stroke-width="1.8"/>' +
        '<text x="224" y="224" fill="#fde047" font-size="12" font-weight="800" text-anchor="middle">Lò U-235</text>' +
        '<text x="215" y="274" fill="#7dd3fc" font-size="13.5" font-weight="800" text-anchor="middle">Tàu phá băng hạt nhân (120 MW)</text>' +
        // Equation banner top
        '<rect x="44" y="46" width="612" height="58" rx="8" fill="#0f172a" stroke="#fbbf24" stroke-width="1.5"/>' +
        '<text x="350" y="81" fill="#fde68a" font-size="14.5" font-weight="800" text-anchor="middle">²³⁵₉₂U + ¹₀n → ¹⁴³₆₀Nd + ⁹⁰₄₀La + k·¹₀n + 8·⁰₋₁e</text>' +
        // Specs panel right
        '<rect x="404" y="124" width="252" height="142" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>' +
        '<text x="422" y="154" fill="#e2e8f0" font-size="13">• Năng lượng: 200 MeV / phản ứng</text>' +
        '<text x="422" y="182" fill="#e2e8f0" font-size="13">• Công suất điện: P = 120 MW</text>' +
        '<text x="422" y="210" fill="#e2e8f0" font-size="13">• Hiệu suất: H = 30%</text>' +
        '<text x="422" y="238" fill="#7dd3fc" font-size="13">• Vận hành liên tục: t = 24 giờ</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-ship', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C4-96': {
    id: 'MH-C4-96',
    title: 'Phản ứng phân hạch X + U-235 → Xe-139 + Sr-95 + 2X và năng lượng liên kết riêng',
    topic: 'DS-C4.2',
    layout: 'single',
    caption: 'So sánh năng lượng liên kết riêng trước và sau phản ứng hạt nhân trong lò sử dụng U-235',
    alt: 'Sơ đồ phản ứng X cộng U-235 tạo thành Xe-139, Sr-95 và 2 hạt X kèm biểu đồ so sánh năng lượng liên kết riêng 7,6; 8,4 và 8,7 MeV/nucleon',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 320" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="16" y="16" width="668" height="288" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Top reaction box (kept with unknown X!)
        '<rect x="48" y="34" width="604" height="46" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="1.6"/>' +
        '<text x="350" y="63" fill="#7dd3fc" font-size="16" font-weight="800" text-anchor="middle">X + ²³⁵₉₂U → ¹³⁹₅₄Xe + ⁹⁵₃₈Sr + 2X</text>' +
        // Bar chart comparing binding energy per nucleon (MeV/nucleon)
        '<line x1="94" y1="262" x2="404" y2="262" stroke="#94a3b8" stroke-width="2"/>' +
        '<rect x="128" y="172" width="54" height="90" rx="4" fill="#92400e" stroke="#fbbf24" stroke-width="1.8"/>' +
        '<text x="155" y="162" fill="#fde047" font-size="13.5" font-weight="800" text-anchor="middle">7,6</text>' +
        '<text x="155" y="282" fill="#cbd5e1" font-size="13" font-weight="700" text-anchor="middle">²³⁵U</text>' +
        '<rect x="224" y="148" width="54" height="114" rx="4" fill="#0369a1" stroke="#38bdf8" stroke-width="1.8"/>' +
        '<text x="251" y="138" fill="#7dd3fc" font-size="13.5" font-weight="800" text-anchor="middle">8,4</text>' +
        '<text x="251" y="282" fill="#cbd5e1" font-size="13" font-weight="700" text-anchor="middle">¹³⁹Xe</text>' +
        '<rect x="320" y="136" width="54" height="126" rx="4" fill="#065f46" stroke="#34d399" stroke-width="1.8"/>' +
        '<text x="347" y="126" fill="#6ee7b7" font-size="13.5" font-weight="800" text-anchor="middle">8,7</text>' +
        '<text x="347" y="282" fill="#cbd5e1" font-size="13" font-weight="700" text-anchor="middle">⁹⁵Sr</text>' +
        '<text x="249" y="102" fill="#94a3b8" font-size="12" text-anchor="middle">Năng lượng liên kết riêng (MeV/nucleon)</text>' +
        // Right card
        '<rect x="434" y="122" width="222" height="148" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1.4"/>' +
        '<text x="545" y="152" fill="#fde68a" font-size="13.5" font-weight="800" text-anchor="middle">Nhiên liệu lò phản ứng</text>' +
        '<text x="452" y="182" fill="#e2e8f0" font-size="12.5">• Khối lượng ²³⁵₉₂U: 1 kg</text>' +
        '<text x="452" y="208" fill="#e2e8f0" font-size="12.5">• Bảo toàn điện tích Z &amp; số khối A</text>' +
        '<text x="452" y="234" fill="#cbd5e1" font-size="12">• Chu kì bán rã ²³⁵U = hằng số</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-chart-column', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C4-97': {
    id: 'MH-C4-97',
    title: 'Sơ đồ cân bằng năng lượng nhà máy điện hạt nhân 1066 MW',
    topic: 'DS-C4.2',
    layout: 'single',
    caption: 'Cứ 1000 J năng lượng phân hạch U-235 tạo ra 323 J điện năng (công suất điện 1066 MW)',
    alt: 'Chuỗi chuyển hóa 1000 J năng lượng hạt nhân qua Lò phản ứng, Bộ trao đổi nhiệt mất 180 J, Lò hơi, Tua-bin làm mát mất 490 J, Máy phát mất 7 J còn lại 323 J điện năng',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 330" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs>' +
        '<marker id="' + u + 'ar" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto"><path d="M0 1 L9 5 L0 9 z" fill="#38bdf8"/></marker>' +
        '<marker id="' + u + 'up" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto"><path d="M0 1 L9 5 L0 9 z" fill="#f87171"/></marker>' +
        '</defs>' +
        '<rect x="16" y="16" width="668" height="298" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // 5 horizontal pipeline boxes
        '<rect x="28" y="164" width="106" height="66" rx="7" fill="#92400e" stroke="#fbbf24" stroke-width="2"/>' +
        '<text x="81" y="191" fill="#fef08a" font-size="12.5" font-weight="800" text-anchor="middle">Lò phản ứng</text>' +
        '<text x="81" y="213" fill="#fff" font-size="13" font-weight="800" text-anchor="middle">1000 J (U-235)</text>' +
        '<line x1="134" y1="197" x2="152" y2="197" stroke="#38bdf8" stroke-width="2.4" marker-end="url(#' + u + 'ar)"/>' +
        '<rect x="156" y="164" width="106" height="66" rx="7" fill="#1e293b" stroke="#64748b" stroke-width="1.8"/>' +
        '<text x="209" y="191" fill="#e2e8f0" font-size="12.5" font-weight="800" text-anchor="middle">Trao đổi nhiệt</text>' +
        '<text x="209" y="213" fill="#cbd5e1" font-size="12" text-anchor="middle">&amp; Lò hơi</text>' +
        // Loss 180 J up from Heat Exchanger
        '<line x1="209" y1="164" x2="209" y2="106" stroke="#f87171" stroke-width="2.4" marker-end="url(#' + u + 'up)"/>' +
        '<rect x="148" y="56" width="122" height="44" rx="6" fill="#0f172a" stroke="#f87171" stroke-width="1.3"/>' +
        '<text x="209" y="75" fill="#fca5a5" font-size="12.5" font-weight="800" text-anchor="middle">180 J</text>' +
        '<text x="209" y="92" fill="#cbd5e1" font-size="11.5" text-anchor="middle">Mất ra khí quyển</text>' +
        '<line x1="262" y1="197" x2="282" y2="197" stroke="#38bdf8" stroke-width="2.4" marker-end="url(#' + u + 'ar)"/>' +
        '<rect x="286" y="164" width="96" height="66" rx="7" fill="#1e293b" stroke="#64748b" stroke-width="1.8"/>' +
        '<text x="334" y="202" fill="#e2e8f0" font-size="13" font-weight="800" text-anchor="middle">Tua-bin</text>' +
        // Loss 490 J cooling water up from Turbine
        '<line x1="334" y1="164" x2="334" y2="106" stroke="#f87171" stroke-width="2.6" marker-end="url(#' + u + 'up)"/>' +
        '<rect x="276" y="46" width="128" height="54" rx="6" fill="#0f172a" stroke="#f87171" stroke-width="1.3"/>' +
        '<text x="340" y="66" fill="#fca5a5" font-size="12.5" font-weight="800" text-anchor="middle">490 J làm mát</text>' +
        '<text x="340" y="84" fill="#cbd5e1" font-size="11.5" text-anchor="middle">Nước: 48 m³/s</text>' +
        '<line x1="382" y1="197" x2="402" y2="197" stroke="#38bdf8" stroke-width="2.4" marker-end="url(#' + u + 'ar)"/>' +
        '<rect x="406" y="164" width="102" height="66" rx="7" fill="#1e293b" stroke="#64748b" stroke-width="1.8"/>' +
        '<text x="457" y="202" fill="#e2e8f0" font-size="13" font-weight="800" text-anchor="middle">Máy phát</text>' +
        // Loss 7 J up from Generator
        '<line x1="457" y1="164" x2="457" y2="106" stroke="#f87171" stroke-width="2" marker-end="url(#' + u + 'up)"/>' +
        '<rect x="414" y="56" width="108" height="44" rx="6" fill="#0f172a" stroke="#f87171" stroke-width="1.3"/>' +
        '<text x="468" y="75" fill="#fca5a5" font-size="12.5" font-weight="800" text-anchor="middle">7 J mất mát</text>' +
        '<text x="468" y="92" fill="#cbd5e1" font-size="11.5" text-anchor="middle">Ra môi trường</text>' +
        // Output 323 J Electric
        '<line x1="508" y1="197" x2="538" y2="197" stroke="#10b981" stroke-width="3" marker-end="url(#' + u + 'ar)"/>' +
        '<rect x="542" y="156" width="126" height="82" rx="8" fill="#065f46" stroke="#34d399" stroke-width="2"/>' +
        '<text x="605" y="186" fill="#d1fae5" font-size="14" font-weight="800" text-anchor="middle">323 J Điện năng</text>' +
        '<text x="605" y="212" fill="#fde047" font-size="13" font-weight="800" text-anchor="middle">P_đ = 1066 MW</text>' +
        '<text x="350" y="282" fill="#cbd5e1" font-size="12.5" text-anchor="middle">²³⁵U + n → ¹⁴¹Ba + ⁹²Kr + 3n (m_U=235,0409; m_Ba=140,9141; m_Kr=91,9250; m_n=1,0086 amu)</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-industry', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C4-98': {
    id: 'MH-C4-98',
    title: 'Ba đồng vị Potassium (K-39, K-40 phóng xạ, K-41) trong chuối',
    topic: 'DS-C4.4',
    layout: 'single',
    caption: 'Potassium tự nhiên chứa đồng vị phóng xạ ⁴⁰₁₉K (T = 1,28·10⁹ năm) bên cạnh ³⁹₁₉K và ⁴¹₁₉K bền',
    alt: 'Minh họa quả chuối giàu kali kèm thẻ thông tin 3 đồng vị K-39, K-40 phóng xạ và K-41 bền',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 300" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="16" y="16" width="668" height="268" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Stylized crescent banana icon on left
        '<path d="M 88 214 Q 160 222 198 110 Q 178 96 168 112 Q 136 184 74 196 Q 68 210 88 214 Z" fill="#eab308" stroke="#fef08a" stroke-width="2"/>' +
        '<text x="135" y="250" fill="#fde047" font-size="13.5" font-weight="800" text-anchor="middle">Nguồn Kali tự nhiên</text>' +
        // 3 isotope cards on right
        '<rect x="256" y="48" width="124" height="118" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="1.8"/>' +
        '<text x="318" y="84" fill="#6ee7b7" font-size="20" font-weight="800" text-anchor="middle">³⁹₁₉K</text>' +
        '<text x="318" y="116" fill="#e2e8f0" font-size="13" font-weight="700" text-anchor="middle">Đồng vị bền</text>' +
        '<text x="318" y="142" fill="#94a3b8" font-size="12" text-anchor="middle">Z = 19 · A = 39</text>' +
        '<rect x="396" y="48" width="124" height="118" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>' +
        '<text x="458" y="84" fill="#fde047" font-size="20" font-weight="800" text-anchor="middle">⁴⁰₁₉K</text>' +
        '<text x="458" y="116" fill="#fbbf24" font-size="13" font-weight="800" text-anchor="middle">Phóng xạ</text>' +
        '<text x="458" y="142" fill="#cbd5e1" font-size="12" text-anchor="middle">T = 1,28·10⁹ năm</text>' +
        '<rect x="536" y="48" width="124" height="118" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="1.8"/>' +
        '<text x="598" y="84" fill="#6ee7b7" font-size="20" font-weight="800" text-anchor="middle">⁴¹₁₉K</text>' +
        '<text x="598" y="116" fill="#e2e8f0" font-size="13" font-weight="700" text-anchor="middle">Đồng vị bền</text>' +
        '<text x="598" y="142" fill="#94a3b8" font-size="12" text-anchor="middle">Z = 19 · A = 41</text>' +
        '<rect x="256" y="186" width="404" height="68" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.4"/>' +
        '<text x="458" y="214" fill="#7dd3fc" font-size="13.5" font-weight="800" text-anchor="middle">Mẫu phân tích: m = 59 μg đồng vị ⁴⁰₁₉K</text>' +
        '<text x="458" y="238" fill="#cbd5e1" font-size="12.5" text-anchor="middle">M = 40 g/mol · N_A = 6,02·10²³ hạt/mol · 1 năm = 365 ngày</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-seedling', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C4-99': {
    id: 'MH-C4-99',
    title: 'Đường xâm nhập khí phóng xạ Radon Rn-222 từ lòng đất vào nhà ở',
    topic: 'DS-C4.4',
    layout: 'single',
    caption: 'Khí ²²²₈₆Rn (T = 3,82 ngày) từ đất đá phân rã thấm qua khe nứt nền móng và ống thoát vào nhà',
    alt: 'Mặt cắt ngôi nhà phía trên tầng đất đá chứa Uranium, Radium sinh khí Radon xuyên qua khe nứt móng, khe ống nước và tích tụ trong phòng kín',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 340" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><marker id="' + u + 'rn" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1 L9 5 L0 9 z" fill="#f87171"/></marker></defs>' +
        '<rect x="16" y="16" width="668" height="308" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Soil & bedrock layer below y = 224
        '<rect x="32" y="224" width="636" height="84" rx="6" fill="#451a03" stroke="#92400e" stroke-width="2"/>' +
        '<text x="240" y="294" fill="#fde68a" font-size="13" font-weight="800" text-anchor="middle">Đất &amp; Đá nền: Uranium → Radium → Khí Radon (²²²₈₆Rn)</text>' +
        // House cross-section above y=224
        '<polygon points="94,104 240,42 386,104" fill="#1e293b" stroke="#94a3b8" stroke-width="2.4"/>' +
        '<rect x="108" y="104" width="264" height="120" fill="#0f172a" stroke="#94a3b8" stroke-width="2.4"/>' +
        '<line x1="108" y1="164" x2="372" y2="164" stroke="#64748b" stroke-width="2"/>' +
        '<rect x="140" y="118" width="44" height="32" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>' +
        '<text x="266" y="138" fill="#e2e8f0" font-size="12.5" font-weight="700" text-anchor="middle">Không gian sống</text>' +
        '<text x="240" y="196" fill="#cbd5e1" font-size="12.5" font-weight="700" text-anchor="middle">Tầng hầm / Nền nhà</text>' +
        // Radon seeping arrows from soil through cracks
        '<path d="M 150 264 Q 158 232 162 184" fill="none" stroke="#f87171" stroke-width="2.6" stroke-dasharray="5 3" marker-end="url(#' + u + 'rn)" class="ambient-ray-glide"/>' +
        '<path d="M 240 264 Q 246 218 240 152" fill="none" stroke="#f87171" stroke-width="2.6" stroke-dasharray="5 3" marker-end="url(#' + u + 'rn)" class="ambient-ray-glide"/>' +
        '<path d="M 326 264 Q 318 232 316 184" fill="none" stroke="#f87171" stroke-width="2.6" stroke-dasharray="5 3" marker-end="url(#' + u + 'rn)" class="ambient-ray-glide"/>' +
        // Summary card right
        '<rect x="424" y="62" width="234" height="146" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>' +
        '<text x="541" y="92" fill="#fca5a5" font-size="14" font-weight="800" text-anchor="middle">Thông số khí ²²²₈₆Rn</text>' +
        '<text x="442" y="122" fill="#e2e8f0" font-size="12.5">• Chu kì bán rã: T = 3,82 ngày</text>' +
        '<text x="442" y="148" fill="#e2e8f0" font-size="12.5">• Cảnh báo EPA: ≥ 4,00 pCi/lít</text>' +
        '<text x="442" y="174" fill="#7dd3fc" font-size="12.5">• Phòng kín: V = 50 m³ (50 000 lít)</text>' +
        '<text x="442" y="198" fill="#6ee7b7" font-size="12">Mở cửa thông gió làm loãng khí</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-house-chimney-crack', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C4-100': {
    id: 'MH-C4-100',
    title: 'Pin nguyên tử Plutonium Pu-238 (Medtronic Model 9000) trong máy tạo nhịp tim',
    topic: 'DS-C4.4',
    layout: 'single',
    caption: 'Thông số vỏ pin Medtronic Laurens-Alcatel Model 9000: PU-238 · 2,5 Ci (1974)',
    alt: 'Vỏ kim loại pin nguyên tử y tế khắc nhãn Medtronic Pulse Generator Model 9000, kí hiệu PU-238 và độ phóng xạ 2.5CI - 1974',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 320" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><linearGradient id="' + u + 'ti" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#475569"/><stop offset="50%" stop-color="#94a3b8"/><stop offset="100%" stop-color="#334155"/></linearGradient></defs>' +
        '<rect x="16" y="16" width="668" height="288" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Pacemaker titanium capsule casing on left
        '<rect x="52" y="64" width="320" height="196" rx="28" fill="url(#' + u + 'ti)" stroke="#cbd5e1" stroke-width="2.6"/>' +
        '<rect x="74" y="84" width="276" height="156" rx="16" fill="#0f172a" stroke="#64748b" stroke-width="1.6"/>' +
        '<text x="212" y="114" fill="#f8fafc" font-size="14" font-weight="800" letter-spacing="1" text-anchor="middle">MEDTRONIC · MODEL 9000</text>' +
        '<text x="212" y="136" fill="#cbd5e1" font-size="12" font-weight="700" text-anchor="middle">PULSE GENERATOR · LAURENS-ALCATEL</text>' +
        // Trefoil radiation badge & engraved specs
        '<circle cx="130" cy="176" r="20" fill="#eab308" stroke="#0f172a" stroke-width="2"/>' +
        '<circle cx="130" cy="176" r="5" fill="#0f172a"/>' +
        '<text x="236" y="172" fill="#fde047" font-size="18" font-weight="800" font-family="DM Mono,monospace" text-anchor="middle">PU-238</text>' +
        '<text x="236" y="196" fill="#7dd3fc" font-size="15" font-weight="800" font-family="DM Mono,monospace" text-anchor="middle">2.5CI - 1974</text>' +
        '<text x="212" y="224" fill="#94a3b8" font-size="11.5" font-weight="700" text-anchor="middle">RADIOACTIVE · USA</text>' +
        // Right technical summary
        '<rect x="400" y="64" width="260" height="196" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>' +
        '<text x="530" y="96" fill="#38bdf8" font-size="14" font-weight="800" text-anchor="middle">Thông số Pin nguyên tử</text>' +
        '<text x="418" y="128" fill="#e2e8f0" font-size="12.5">• Đồng vị nhiên liệu: ²³⁸Pu</text>' +
        '<text x="418" y="156" fill="#e2e8f0" font-size="12.5">• Độ phóng xạ đầu: H₀ = 2,5 Ci</text>' +
        '<text x="418" y="184" fill="#e2e8f0" font-size="12.5">• Chu kì bán rã: T = 87,7 năm</text>' +
        '<text x="418" y="212" fill="#fde68a" font-size="12.5">• Thay pin khi công suất giảm 50%</text>' +
        '<text x="418" y="240" fill="#94a3b8" font-size="12">(Suất điện động E tỉ lệ thuận với H)</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-heart-circle-bolt', this.caption) + svg + '</div></div>';
    }
  }
    };

    function has(id) {
        return typeof id === 'string' && Object.prototype.hasOwnProperty.call(MODELS, id);
    }

    function get(id) {
        if (!has(id)) return null;
        var m = MODELS[id];
        return {
            id: m.id,
            title: m.title,
            topic: m.topic,
            layout: m.layout,
            caption: m.caption,
            caption2: m.caption2 || '',
            alt: m.alt
        };
    }

    function listIds() {
        return Object.keys(MODELS);
    }

    function withStandaloneSvgFont(svgStr, includeStyleBlock) {
        if (!svgStr) return svgStr;
        var out = svgStr.replace(/<svg\b([^>]*)>/g, function (full, attrs) {
            var nextAttrs = /font-family=/i.test(attrs)
                ? attrs
                : attrs + ' font-family="\'Plus Jakarta Sans\', \'Segoe UI\', Arial, sans-serif"';
            if (includeStyleBlock) {
                return '<svg' + nextAttrs + '><style type="text/css">text,tspan{font-family:\'Plus Jakarta Sans\',\'Segoe UI\',Arial,sans-serif;}</style>';
            }
            return '<svg' + nextAttrs + '>';
        });
        return out;
    }

    function render(id, opts) {
        ensureStyles();
        if (!has(id)) {
            return '<div class="vlxt-model-error">Không tìm thấy mô hình trực quan: <code>' + escapeHtml(id) + '</code></div>';
        }
        var m = MODELS[id];
        var html = withStandaloneSvgFont(m.build(nextUid(), opts || {}), false);
        if (opts && opts.compact) {
            html = html.replace('class="vlxt-visual-container centered"', 'class="vlxt-visual-container centered compact"')
                       .replace('class="vlxt-visual-container"', 'class="vlxt-visual-container compact"');
        }
        return html;
    }

    function getSvgString(id, opts) {
        if (!has(id)) return '';
        var html = MODELS[id].build(nextUid(), opts || {});
        var matches = html.match(/<svg[\s\S]*?<\/svg>/g);
        if (!matches || !matches.length) return '';
        matches = matches.map(function (s) { return withStandaloneSvgFont(s, true); });
        if (opts && opts.all) return matches;
        return matches[0];
    }


    // =========================================================================
    // CANVAS V2 REGISTRY & ANIMATION ENGINE
    // =========================================================================
    var canvasRegistry = {};
    var activeCanvases = [];
    var isAnimRunning = false;

    const MODEL_CAPTIONS = {
            // Ca 1 (Câu 1 -> Câu 9)
            'MH-C1-01': 'Mô hình đối chứng 2 thí nghiệm truyền nhiệt (Cốc nhôm đặt trong cốc thủy tinh & 2 nhiệt kế)',
            'MH-C1-02': 'Bộ thiết bị thí nghiệm đo nhiệt dung riêng của nước (5 dụng cụ nối thông mạch điện)',
            'MH-C1-03': 'Thí nghiệm đo nhiệt nóng chảy riêng của nước đá & đồ thị ngoại suy điểm gãy pha',
            'MH-C1-04': 'Sơ đồ mạch đo nhiệt dung riêng chất lỏng (U = 1,6 V; I = 2,5 A; m = 150,0 g)',
            'MH-C1-05': 'Bộ dụng cụ đo nhiệt nóng chảy riêng của nước đá bằng phương pháp trộn lẫn',
            'MH-C1-06': 'Nguyên lý bình nước nóng năng lượng mặt trời (S = 2 m²; V = 200 lít; H = 60%)',
            'MH-C1-07': 'Sơ đồ nguyên lý bình làm nóng nước gián tiếp (20 lít; 2500 W; rơ-le ngắt tại 70°C)',
            'MH-C1-09': 'Hệ thống tắm nóng lạnh gián tiếp & van hòa trộn nước nóng – nước lạnh ra vòi hoa sen',
            // Ca 2 (Câu 10 -> Câu 21)
            'MH-C1-10': 'Mô hình sục điện đun nước sinh viên (Dây điện trở xoắn lò xo & bọt khí sôi đối lưu)',
            'MH-C1-11': 'Hệ thống tản nhiệt nước AIO cho CPU (Bơm tuần hoàn, Block đồng & Két tản nhiệt Radiator)',
            'MH-C1-12': 'Hệ thống làm mát tuần hoàn động cơ ô tô (Áo nước xilanh, Van hằng nhiệt & Két tản nhiệt)',
            'MH-C1-13': 'Sơ đồ nguyên lý máy hút ẩm dạng ngưng tụ (Quạt hút, Dàn lạnh ngưng tụ & Dàn nóng sấy khí)',
            'MH-C1-14': 'Ống phát tia X Cu-lít-giơ làm mát bằng dòng nước tuần hoàn (Coolidge Tube & Đối lưu nhiệt)',
            'MH-C1-15': 'Nguyên lý quạt điều hòa hơi nước (Tấm làm mát Cooling Pad dạng tổ ong & Bơm tuần hoàn)',
            'MH-C1-18': 'Quy trình đúc chuông đồng truyền thống (Lò nung chảy hợp kim đồng - thiếc & Rót khuôn đúc)',
            'MH-C1-19': 'Mô hình ướp lạnh các lon bia trong thùng xốp đá lạnh (Quá trình cân bằng nhiệt hệ 3 vật)',
            'MH-C1-21': 'Sơ đồ nguyên lý động cơ xăng 4 kỳ (Chu trình tuần hoàn: Nạp - Nén - Nổ - Thải)',
            // Ca 3 (Chương 2: Câu 23 -> Câu 37)
            'MH-C2-23': 'Mô hình quả bóng thời tiết (bóng thám không) bay lên cao giãn nở theo áp suất khí quyển',
            'MH-C2-24': 'Bóng thám không chứa khí Hydrogen (V = 15,8 m³; t = 27°C; p = 105000 Pa → giới hạn nổ 39,5 m³)',
            'MH-C2-25': 'Khinh khí cầu có lỗ hở phía dưới (V = 1,15 m³; m = 0,2 kg) cùng các vectơ lực F_A, P và P_khí',
            'MH-C2-26': 'Khinh khí cầu lễ hội Huế (V = 336 m³; m = 84 kg; 27°C; 1 atm) đang đốt nóng không khí bên trong',
            'MH-C2-27': 'Bộ thí nghiệm kiểm chứng định luật Boyle (Xilanh, pít-tông, tay quay, áp kế & cảm biến 23,5°C)',
            'MH-C2-28': 'Thí nghiệm khảo sát áp suất theo nhiệt độ đẳng tích (Bình cầu 1 lít trong chậu nước đun nóng & áp kế)',
            'MH-C2-29': 'Bộ thí nghiệm kiểm chứng phương trình trạng thái khí lí tưởng (Bình tam giác, áp kế, xilanh (1) & nhiệt kế (2))',
            'MH-C2-30': 'Thí nghiệm đẳng tích với bình cầu A (3,5 lít) trong bình nước B và áp kế thủy ngân chữ U',
            'MH-C2-31': 'Hệ thống túi khí an toàn ô tô (Cảm biến va chạm → Bộ kích nổ → Túi khí N₂ 60 lít ở 25°C)',
            'MH-C2-32': 'Cấu tạo bóng đèn sợi đốt Wolfram chứa khí trơ ở áp suất thấp trong vỏ thủy tinh chịu nhiệt',
            'MH-C2-33': 'Sơ đồ nguyên lý súng phun nước theo nguyên lý truyền áp suất Pascal (S₁ = 2,1 cm²; S₂ = 0,09 cm²)',
            'MH-C2-34': 'Bình tích áp máy lọc nước 12 lít (Bóng chứa nước phía trên, bóng chứa khí p₀ = 120 kPa phía dưới)',
            'MH-C2-35': 'Nguyên lý hoạt động của bơm tay xe đạp 2 trạng thái (Kéo tay bơm lên hút khí & đẩy xuống nén khí)',
            'MH-C2-36': 'Bình nén khí Helium (6 lít; 5,00·10⁵ Pa) bơm các quả bóng bay sự kiện (2,0 lít; 1,25·10⁵ Pa)',
            'MH-C2-37': 'Thí nghiệm bơm khí kiểm chứng áp suất tỉ lệ lượng khí (Bơm V₁ = 0,6 lít qua van k₁, k₂ vào bình V₂ = 5,0 lít)',
            // Ca 4 (Chương 2: Câu 38 -> Câu 52, trừ Câu 47)
            'MH-C2-38': 'Mô hình phong vũ biểu thủy ngân Torricelli (Ống thủy tinh dài 80–90 cm úp ngược trong chậu Hg)',
            'MH-C2-39': 'Thí nghiệm nhúng ống thủy tinh một đầu kín vào chậu nước ở 2 trạng thái đối chứng hình (a) và hình (b)',
            'MH-C2-40': 'Sơ đồ nguyên lý máy đo huyết áp điện tử và vòng bít trên cánh tay (p₀ = 760 mmHg; 27°C; 30 cm³/s)',
            'MH-C2-41': 'Bình chứa khí Oxygen (O₂) nén dùng trong y tế (Tổng khối lượng 18 kg; áp suất 15 MPa; 27°C)',
            'MH-C2-42': 'Mô hình thợ lặn ở độ sâu 30 m nổi lên mặt nước & bọt khí Nitrogen (N₂) nở to dần theo định luật Boyle',
            'MH-C2-43': 'Mô hình người nhái mang bình khí nén 150 atm lặn sửa thân tàu hỏng ở độ sâu 5 m',
            'MH-C2-44': 'Cylinder thẳng đứng cao 152 cm đậy bằng pít-tông nhẹ (76 cm khí ở 600 K & 76 cm thủy ngân Hg)',
            'MH-C2-45': 'Cylinder thẳng đứng chứa khí Hydrogen đậy bằng pít-tông nhẹ dưới cột chất lỏng gây áp suất phụ p₀/9',
            'MH-C2-46': 'Lọ giác hơi y học cổ truyền hơ nóng đến 353°C úp trên bề mặt da lưng ở 27,0°C (S = 28,0 cm²)',
            'MH-C2-48': 'Tàu ngầm ở độ sâu 120 m mở bình khí nén 60 lít (10 MPa; 27°C) đẩy nước biển khỏi thùng dằn',
            'MH-C2-49': 'Mô hình phổi trong hệ hô hấp làm từ vỏ chai nhựa 1,0–1,5 lít, 2 bóng bay và màng cao su cơ hoành',
            'MH-C2-50': 'Mô hình phân tử khí chuyển động nhiệt va chạm thành trong lốp ô tô vượt sa mạc (5,0°C; 1,2 m³; 2,5 bar)',
            'MH-C2-51': 'Mô hình lốp xe bán tải chạy cao tốc mùa hè (27°C; 120 lít; 240 kPa) tăng áp suất đẳng tích',
            'MH-C2-52': 'Súng bắn đinh khí nén nối với bình khí nén 10 lít (12 atm; 27°C) có gắn rơ-le áp suất tự động',
            // Ca 5 (Chương 3: Câu 53 -> Câu 68)
            'MH-C3-53': 'Thí nghiệm cân từ trường (Đoạn dây PQ nằm ngang trong lòng nam châm chữ U đặt trên cân điện tử)',
            'MH-C3-54': 'Bộ thí nghiệm đo độ lớn cảm ứng từ giữa hai nhánh nam châm chữ U trên cân đồng hồ hiện số',
            'MH-C3-55': 'Thí nghiệm khảo sát lực từ tác dụng lên đoạn dây dẫn AB treo bằng hai lực kế trong từ trường',
            'MH-C3-56': 'Mô hình "cân dòng điện" Oersted cân bằng mô-men lực từ F_B và trọng lực kẹp giấy P',
            'MH-C3-57': 'Sơ đồ nguyên lý máy phát điện xoay chiều một pha đơn giản (Khung dây quay đều trong từ trường B)',
            'MH-C3-58': 'Cấu tạo máy phát điện xoay chiều một pha (Rôto 3 cặp cực N–S và Stato 6 cuộn dây lõi sắt)',
            'MH-C3-59': 'Mô hình phanh tái sinh năng lượng ô tô điện (Khung dây vuông ABCD quay quanh trục OO\' giữa hai cực N–S)',
            'MH-C3-60': 'Thanh kim loại MN rơi thẳng đứng trên hai ray song song nối điện trở R (H1) và đồ thị v–t (H2)',
            'MH-C3-61': 'Thanh kim loại mn trượt thẳng đều trên hai thanh ray OA, OB hợp góc 45° trong từ trường đều B',
            'MH-C3-62': 'Thanh dẫn MN trượt trên hai ray song song đặt trên mặt phẳng nghiêng 30° trong từ trường thẳng đứng',
            'MH-C3-63': 'Bốn thanh vật dẫn thẳng dài tạo thành hình vuông MNPQ chuyển động ra xa nhau với tốc độ v₀',
            'MH-C3-64': 'Khung dây hình vuông cạnh l bị kéo dãn tại hai đỉnh đối diện thành hình thoi góc θ = 120°',
            'MH-C3-65': 'Khung dây dẫn hình vuông cạnh a ném ngang trong từ trường biến thiên theo độ cao B = B₀ + k·Z',
            'MH-C3-66': 'Khung dây vuông ABCD chuyển động tịnh tiến đều qua vùng từ trường đều hình chữ nhật A\'B\'C\'D\'',
            'MH-C3-67': 'Cấu tạo và nguyên lý hoạt động của công tắc điện từ (Rơ-le điện) đóng ngắt mạch thứ cấp',
            'MH-C3-68': 'Sơ đồ rơ-le điện từ (Hình 1) và mạch báo cháy tự động dùng điện trở nhiệt X (Hình 2)',
            // Ca 6 (Chương 3: Câu 69 -> Câu 84)
            'MH-C3-69': 'Nguyên lý máy gia tốc hạt Cyclotron (Hai hộp chữ D: I & II nối nguồn xoay chiều tần số f_dd = 12 MHz)',
            'MH-C3-70': 'Mô hình gia tốc hạt proton trong từ trường siêu dẫn B = 5 T của Máy Gia tốc Hạt Lớn LHC',
            'MH-C3-71': 'Sơ đồ nguyên lý máy quang phổ khối đo khối lượng ion (Nguồn S, điện áp U, từ trường ⊙ B & cảm biến)',
            'MH-C3-72': 'Máy quang phổ khối tách đồng vị Uranium U-235 và U-238 trong bể chân không (B = 0,25 T; v = 3·10⁵ m/s)',
            'MH-C3-73': 'Cấu tạo và nguyên lý hoạt động của Micro điện động (Màng rung, cuộn dây 12 vòng & nam châm N–S)',
            'MH-C3-74': 'Cấu tạo loa điện động: Mặt cắt dọc (Hình a) và bố trí cuộn dây – nam châm tròn (Hình b)',
            'MH-C3-75': 'Dynamo xe đạp (Tì núm dẫn động vào vành lốp) và sơ đồ mặt cắt dọc cấu tạo bên trong',
            'MH-C3-76': 'Sơ đồ nguyên lý bếp điện từ (Cuộn dây cao tần dưới mặt kính & dòng điện Foucault làm nóng đáy nồi)',
            'MH-C3-77': 'Sơ đồ cấu tạo đèn lắc tay không cần pin (Thanh nam châm N–S dao động xuyên qua lòng cuộn dây cố định)',
            'MH-C3-78': 'Thí nghiệm đo thành phần nằm ngang của từ trường Trái Đất bằng khung dây tròn N = 200 vòng và la bàn',
            'MH-C3-79': 'Nguyên lý máy đo lưu lượng máu điện từ không xâm lấn (Từ trường B = 0,05 T & hai điện cực đo U = 0,22 mV)',
            'MH-C3-80': 'Cấu tạo máy biến áp một pha (Lõi lá sắt non cách điện, cuộn sơ cấp N₁ và cuộn thứ cấp N₂)',
            'MH-C3-81': 'Sơ đồ hệ thống truyền tải điện năng đi xa (Nhà máy 25 kV → Máy tăng áp 500 kV → Đường dây 248 km → Hạ áp)',
            'MH-C3-82': 'Nguyên lý máy in phun mực Binary-Deflection (Giọt mực tích điện loại A lệch quỹ đạo & giọt loại C bay thẳng)',
            'MH-C3-83': 'Thí nghiệm tương tác từ giữa hai dòng điện thẳng song song cùng chiều (Hình a) và ngược chiều (Hình b)',
            'MH-C3-84': 'Ống tia điện tử khảo sát quỹ đạo chùm electron (U = 2,70 kV) trong điện trường E (Hình a) và từ trường B (Hình b)',
            // Ca 7 (Chương 4: Câu 85 -> Câu 100)
            'MH-C4-85': 'Thí nghiệm tán xạ hạt alpha của Ernest Rutherford (1911) bắn phá lá vàng mỏng trong chân không',
            'MH-C4-86': 'Mô hình tán xạ hạt alpha qua lá vàng mỏng (Hình a) và tương tác vi mô với hạt nhân vàng (Hình b)',
            'MH-C4-87': 'Chu trình xâm nhập bụi phóng xạ Strontium ⁹⁰₃₈Sr vào xương người và đường cong phân rã β⁻',
            'MH-C4-88': 'Phân rã phóng xạ Iodine ¹³¹₅₃I trong sữa bò và đường cong suy giảm về ngưỡng an toàn 100 Bq/lít',
            'MH-C4-89': 'Kỹ thuật chụp cắt lớp phát xạ Positron (PET) sử dụng đồng vị phóng xạ ¹⁸₉F trong chẩn đoán ung thư',
            'MH-C4-90': 'Quy trình xạ trị ung thư tuyến giáp bằng dược chất phóng xạ Iodine ¹³¹₅₃I (9,2 μg; T = 8,0 ngày)',
            'MH-C4-91': 'Đồ thị theo dõi độ phóng xạ xuất viện của bệnh nhân điều trị Iodine-131 (36,0 mCi → 30,0 mCi)',
            'MH-C4-92': 'Mô hình đánh dấu tế bào ung thư nuôi cấy bằng đồng vị phóng xạ ¹³¹₅₃I phát tia gamma 364 keV',
            'MH-C4-93': 'Sơ đồ nguyên lý cảm biến báo khói ion hóa sử dụng nguồn phóng xạ alpha Americium ²⁴¹₉₅Am',
            'MH-C4-94': 'Phản ứng nhiệt hạch tổng hợp Deuterium ²₁D và Tritium ³₁T tạo thành ⁴₂He và neutron ¹₀n',
            'MH-C4-95': 'Sơ đồ phản ứng phân hạch dây chuyền của ²³⁵₉₂U và ứng dụng trên tàu phá băng hạt nhân',
            'MH-C4-96': 'Sơ đồ nguyên lý lò phản ứng hạt nhân và năng lượng liên kết riêng của ²³⁵₉₂U, ¹³⁹₅₄Xe, ⁹⁵₃₈Sr',
            'MH-C4-97': 'Chuỗi chuyển hóa năng lượng trong nhà máy điện hạt nhân dùng nhiên liệu U-235 (1000 J → 323 J điện)',
            'MH-C4-98': 'Ba đồng vị Potassium trong chuối (³⁹₁₉K, ⁴⁰₁₉K, ⁴¹₁₉K) và thông số phân rã phóng xạ ⁴⁰₁₉K',
            'MH-C4-99': 'Con đường khí phóng xạ tự nhiên Radon ²²²₈₆Rn thấm từ đất đá tích tụ vào bên trong ngôi nhà',
            'MH-C4-100': 'Cấu tạo Pin nguyên tử Plutonium-238 (2,5 Ci · T = 87,7 năm) chuyển nhiệt phân rã alpha thành điện năng'
        };

    function registerCanvas(id, fn) {
        canvasRegistry[id] = fn;
    }

    function canvasAnimLoop(now) {
        var t = now * 0.001;
        for (var i = activeCanvases.length - 1; i >= 0; i--) {
            var item = activeCanvases[i];
            if (typeof document !== 'undefined' && document.body && !document.body.contains(item.cv)) {
                activeCanvases.splice(i, 1);
                continue;
            }
            try {
                item.drawFn(item.ctx, item.w, item.h, t);
            } catch (e) {}
        }
        if (typeof requestAnimationFrame !== 'undefined') {
            requestAnimationFrame(canvasAnimLoop);
        }
    }

    function ensureAnimLoop() {
        if (!isAnimRunning && typeof requestAnimationFrame !== 'undefined') {
            isAnimRunning = true;
            requestAnimationFrame(canvasAnimLoop);
        }
    }

    function mountAll(rootEl, opts) {
        ensureStyles();
        var root = rootEl || (typeof document !== 'undefined' ? document : null);
        if (!root || !root.querySelectorAll) return 0;
        var slots = root.querySelectorAll('.vlxt-model-slot[data-model-id]');
        var mounted = 0;
        for (var i = 0; i < slots.length; i++) {
            var slot = slots[i];
            var mid = slot.getAttribute('data-model-id');
            if (!mid) continue;

            // 1. Ưu tiên hàng đầu: Vẽ đồ họa Canvas V2 nếu có trong registry
            if (canvasRegistry[mid]) {
                if (slot.getAttribute('data-canvas-mounted') === mid) continue;
                slot.setAttribute('data-canvas-mounted', mid);

                var drawFn = canvasRegistry[mid];
                var caption = MODEL_CAPTIONS[mid] || ('Mô hình Canvas V2 ' + mid);

                slot.innerHTML = '<div class="vlxt-visual-container centered" style="max-width: 920px; margin: 16px auto; background: #070d1c; border: 1.5px solid #1e293b; border-radius: 12px; padding: 14px; box-shadow: 0 4px 16px rgba(0,0,0,0.3);">' +
                    '<div class="canvas-box" style="background: #050811; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 10px; display: flex; flex-direction: column; align-items: center;">' +
                        '<div class="canvas-caption" style="font-size: 13.5px; font-weight: 700; color: #38bdf8; margin-bottom: 10px; text-align: center; display: flex; align-items: center; justify-content: center; gap: 8px;">' +
                            '<span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#22c55e;"></span>' +
                            '<span>' + caption + '</span>' +
                            '<span style="font-size: 11px; padding: 2px 8px; border-radius: 4px; background: rgba(56,189,248,0.15); color: #38bdf8; border: 1px solid rgba(56,189,248,0.3);">Canvas Hydrogen V2</span>' +
                        '</div>' +
                        '<canvas class="vlxt-physics-canvas" data-model-id="' + mid + '" style="width: 100%; max-width: 780px; height: auto; border-radius: 6px; display: block; margin: 0 auto; background: #050811; border: 1px solid #1e293b; aspect-ratio: 780 / 305;"></canvas>' +
                    '</div>' +
                '</div>';

                var cv = slot.querySelector('canvas');
                if (cv) {
                    var dpr = Math.max(2, (typeof window !== 'undefined' && window.devicePixelRatio) || 1);
                    var logicalW = 780;
                    var logicalH = 305;
                    cv.width = logicalW * dpr;
                    cv.height = logicalH * dpr;
                    var ctx = cv.getContext('2d');
                    if (ctx) {
                        ctx.scale(dpr, dpr);
                        activeCanvases.push({
                            cv: cv,
                            ctx: ctx,
                            drawFn: drawFn,
                            w: logicalW,
                            h: logicalH
                        });
                    }
                }
                mounted += 1;
                continue;
            }

            // 2. Dự phòng: Vẽ SVG cũ nếu câu hỏi chưa có hàm vẽ Canvas
            var prev = slot.getAttribute('data-vlxt-mounted');
            if (prev === mid && slot.querySelector('svg')) continue;
            slot.innerHTML = render(mid, opts);
            slot.setAttribute('data-vlxt-mounted', mid);
            mounted += 1;
        }
        ensureAnimLoop();
        return mounted;
    }

    // Nạp toàn bộ 94 hàm vẽ Canvas V2 từ 7 Ca vào canvasRegistry
    (function() {
        var tempVLXT = {
            register: function(id, fn) {
                canvasRegistry[id] = fn;
            }
        };

        try {
            (function(window) {
// ============================================================================
// CHUNK C1 - CA 1 (CÂU 1 -> CÂU 9) | PHIÊN BẢN V2: MOBILE-FIRST, CỐC HỞ MIỆNG,
// BIẾN THIÊN 1 CHIỀU SAWTOOTH, CHỮ TO RÕ KHÔNG CHỒNG LẤN NÉT VẼ
// ============================================================================
(function(global) {
  if (!global.VLXTModels) {
    global.VLXTModels = {
      _registry: {},
      register(id, fn) { this._registry[id] = fn; }
    };
  }

  function drawSubText(ctx, base, sub, x, y, opts = {}) {
    const fontSize = opts.fontSize || 15;
    const subSize = Math.round(fontSize * 0.75);
    const weight = opts.weight || '700';
    const italic = opts.italic ? 'italic ' : '';
    const color = opts.color || '#f1f5f9';
    const align = opts.align || 'left';
    ctx.save();
    ctx.fillStyle = color;
    ctx.font = `${italic}${weight} ${fontSize}px "Plus Jakarta Sans", sans-serif`;
    const baseW = ctx.measureText(base).width;
    ctx.font = `${weight} ${subSize}px "Plus Jakarta Sans", sans-serif`;
    const subW = sub ? ctx.measureText(sub).width : 0;
    const totalW = baseW + subW;
    let startX = x;
    if (align === 'center') startX = x - totalW / 2;
    else if (align === 'right') startX = x - totalW;

    ctx.font = `${italic}${weight} ${fontSize}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(base, startX, y);
    if (sub) {
      ctx.font = `${weight} ${subSize}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillText(sub, startX + baseW + 1, y + Math.round(fontSize * 0.28));
    }
    ctx.restore();
    return totalW;
  }

  function drawArrow(ctx, x1, y1, x2, y2, color = '#38bdf8', width = 2.6, headLen = 9) {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawRoundRect(ctx, x, y, w, h, r, fill, stroke, lineWidth = 2.2) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); }
    ctx.restore();
  }

  // Vẽ cốc hở miệng trên (Open-top U-shape cup/beaker)
  function drawOpenCup(ctx, x, y, w, h, strokeColor = '#cbd5e1', lineWidth = 3, flare = 0) {
    ctx.save();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    if (flare > 0) {
      ctx.moveTo(x - flare, y);
      ctx.lineTo(x, y + 7);
    } else {
      ctx.moveTo(x, y);
    }
    ctx.lineTo(x, y + h);
    ctx.lineTo(x + w, y + h);
    if (flare > 0) {
      ctx.lineTo(x + w, y + 7);
      ctx.lineTo(x + w + flare, y);
    } else {
      ctx.lineTo(x + w, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  // Nhãn chú thích có hộp nền gọn và đường dẫn (Leader Line) chống đè nét
  function drawCallout(ctx, targetX, targetY, boxX, boxY, text, borderColor = '#38bdf8', textColor = '#f1f5f9') {
    ctx.save();
    ctx.font = '700 13.5px "Plus Jakarta Sans", sans-serif';
    const padX = 8, boxH = 26;
    const textW = ctx.measureText(text).width;
    const boxW = textW + padX * 2;
    const anchorX = (boxX + boxW / 2 < targetX) ? (boxX + boxW) : boxX;
    const anchorY = boxY + boxH / 2;

    // Đường gióng
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(targetX, targetY);
    ctx.lineTo(anchorX, anchorY);
    ctx.stroke();

    // Điểm chấm tại vật thể
    ctx.fillStyle = borderColor;
    ctx.beginPath();
    ctx.arc(targetX, targetY, 3, 0, Math.PI * 2);
    ctx.fill();

    // Hộp nhãn
    drawRoundRect(ctx, boxX, boxY, boxW, boxH, 6, '#0f172a', borderColor, 1.5);
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, boxX + boxW / 2, boxY + boxH / 2);
    ctx.restore();
  }

  function drawThermometer(ctx, x, yTop, yBot, bulbR, fillRatio, color = '#ef4444', label = '') {
    ctx.save();
    // Thân ống thủy tinh
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.roundRect(x - 5, yTop, 10, yBot - yTop, 5);
    ctx.fill();
    ctx.stroke();

    // Bầu nhiệt kế ngập trong nước
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, yBot + bulbR - 2, bulbR, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Cột chất lỏng (biến thiên 1 chiều sawtooth)
    const ratio = Math.max(0.08, Math.min(1, fillRatio));
    const colTop = yBot - (yBot - yTop - 10) * ratio;
    ctx.fillStyle = color;
    ctx.fillRect(x - 2.5, colTop, 5, yBot - colTop + 2);

    // Vạch chia
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.2;
    for (let yy = yTop + 12; yy < yBot - 6; yy += 10) {
      ctx.beginPath();
      ctx.moveTo(x + 5, yy);
      ctx.lineTo(x + 9, yy);
      ctx.stroke();
    }

    if (label) {
      drawRoundRect(ctx, x - 34, yTop - 28, 68, 22, 5, '#0f172a', color, 1.4);
      ctx.fillStyle = '#f8fafc';
      ctx.font = '700 12.5px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, x, yTop - 13);
    }
    ctx.restore();
  }

  const chunkModels = {
    // CÂU 1: Cốc nhôm (hở miệng trên) đặt trong cốc thủy tinh + Nhiệt kế sawtooth 1 chiều + Callout không đè nét
    'MH-C1-01': function(ctx, w, h, t) {
      ctx.clearRect(0, 0, w, h);
      // Chu kỳ răng cưa 1 chiều: tăng đều rồi ngắt về đầu (không bao giờ tụt lên tụt xuống)
      const saw = (t * 0.22) % 1;

      const panels = [
        { cx: w * 0.25, title: 'TN 1: CÙNG NHIỆT ĐỘ (23°C)', outerCol: 'rgba(56, 189, 248, 0.25)', innerCol: 'rgba(56, 189, 248, 0.38)', heat: false },
        { cx: w * 0.75, title: 'TN 2: CHÊNH LỆCH NHIỆT ĐỘ', outerCol: 'rgba(239, 68, 68, 0.28)', innerCol: 'rgba(56, 189, 248, 0.38)', heat: true }
      ];

      panels.forEach((p, idx) => {
        ctx.fillStyle = p.heat ? '#fbbf24' : '#38bdf8';
        ctx.font = '800 14.5px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(p.title, p.cx, 24);

        const gx = p.cx - 86, gy = 105, gw = 172, gh = 165;
        const waterTop = gy + 36;

        // Nước trong cốc thủy tinh
        ctx.fillStyle = p.outerCol;
        ctx.fillRect(gx + 2, waterTop, gw - 4, gh - 38);

        // Sóng mặt thoáng cốc thủy tinh
        ctx.strokeStyle = p.heat ? '#f87171' : '#38bdf8';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        for (let xx = gx + 2; xx <= gx + gw - 2; xx += 4) {
          const yy = waterTop + Math.sin(xx * 0.08 + t * 3) * 1.5;
          if (xx === gx + 2) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
        }
        ctx.stroke();

        // Cốc nhôm bên trong (HỞ MIỆNG TRÊN - dùng drawOpenCup thay vì strokeRect)
        const ax = p.cx - 24, ay = gy + 20, aw = 88, ah = gh - 22;
        const innerWaterTop = ay + 34;

        // Xóa nền nước ngoài phía sau cốc nhôm
        ctx.fillStyle = '#050811';
        ctx.fillRect(ax, ay, aw, ah);

        // Nước trong cốc nhôm
        ctx.fillStyle = p.innerCol;
        ctx.fillRect(ax + 2, innerWaterTop, aw - 4, ah - 36);

        // Sóng mặt thoáng cốc nhôm
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let xx = ax + 2; xx <= ax + aw - 2; xx += 4) {
          const yy = innerWaterTop + Math.cos(xx * 0.1 + t * 3) * 1.3;
          if (xx === ax + 2) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
        }
        ctx.stroke();

        // Thành cốc thủy tinh (hở miệng trên, có loe nhẹ)
        drawOpenCup(ctx, gx, gy, gw, gh, '#cbd5e1', 3.2, 5);
        // Thành cốc nhôm (HỞ MIỆNG TRÊN hoàn toàn, không có nét ngang bịt miệng)
        drawOpenCup(ctx, ax, ay, aw, ah, '#94a3b8', 3.5, 0);

        // Nhiệt kế 1 (Cốc ngoài) & Nhiệt kế 2 (Cốc nhôm)
        // Ở TN2: NK trong chỉ TĂNG 1 chiều từ 0.25 -> 0.78 rồi ngắt về 0.25; NK ngoài giảm từ 0.88 -> 0.55 rồi ngắt
        const ratioOut = p.heat ? (0.88 - 0.32 * saw) : 0.32;
        const ratioIn  = p.heat ? (0.28 + 0.48 * saw) : 0.32;
        drawThermometer(ctx, gx + 26, 64, waterTop + 62, 6.5, ratioOut, p.heat ? '#ef4444' : '#38bdf8', 'NK ngoài');
        drawThermometer(ctx, ax + aw * 0.52, 64, innerWaterTop + 52, 6.5, ratioIn, '#38bdf8', 'NK trong');

        // Mũi tên truyền nhiệt ở TN2
        if (p.heat) {
          const pulse = 0.5 + 0.5 * Math.sin(t * 3.5) ** 2;
          const colArrow = `rgba(245, 158, 11, ${pulse.toFixed(2)})`;
          drawArrow(ctx, gx + 10, waterTop + 95, ax - 3, waterTop + 95, colArrow, 2.8, 8);
          drawArrow(ctx, gx + gw - 6, waterTop + 95, ax + aw + 3, waterTop + 95, colArrow, 2.8, 8);
          ctx.fillStyle = '#fbbf24';
          ctx.font = '700 13.5px "Plus Jakarta Sans", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Truyền nhiệt: Nóng → Lạnh', p.cx, gy + gh + 26);
        } else {
          ctx.fillStyle = '#94a3b8';
          ctx.font = '700 13.5px "Plus Jakarta Sans", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Không truyền nhiệt', p.cx, gy + gh + 26);
        }
      });

      // Chú thích Callout đặt ở khoảng giữa 2 bể, trỏ mũi tên vào đúng thành cốc (không đè lên nét cốc)
      drawCallout(ctx, w * 0.25 + 86, 155, w * 0.5 - 54, 142, 'Cốc thủy tinh', '#cbd5e1', '#f1f5f9');
      drawCallout(ctx, w * 0.25 + 64, 210, w * 0.5 - 46, 197, 'Cốc nhôm', '#38bdf8', '#38bdf8');
    },

    // CÂU 2: Bộ thí nghiệm đo nhiệt dung riêng của nước (Chữ to rõ cho điện thoại, nhiệt kế sawtooth)
    'MH-C1-02': function(ctx, w, h, t) {
      ctx.clearRect(0, 0, w, h);
      const saw = (t * 0.18) % 1;

      // (5) Cân điện tử
      drawRoundRect(ctx, 20, 195, 130, 56, 8, '#1e293b', '#64748b', 2.2);
      ctx.fillStyle = '#475569';
      ctx.fillRect(34, 186, 102, 9);
      drawRoundRect(ctx, 38, 208, 94, 28, 5, '#050811', '#38bdf8', 1.5);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '700 14px "DM Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('0.25 kg', 85, 227);
      ctx.fillStyle = '#f1f5f9';
      ctx.font = '700 14px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('(5) Cân điện tử', 85, 274);

      // (1) Biến thế nguồn
      drawRoundRect(ctx, 175, 135, 165, 116, 10, '#1e293b', '#64748b', 2.2);
      ctx.fillStyle = '#f1f5f9';
      ctx.font = '700 14px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('(1) Biến thế nguồn', 257, 160);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.8;
      ctx.beginPath(); ctx.arc(298, 202, 19, 0, Math.PI * 2); ctx.stroke();
      drawArrow(ctx, 298, 202, 310, 189, '#38bdf8', 2.8, 6);
      ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(210, 214, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#3b82f6'; ctx.beginPath(); ctx.arc(242, 214, 7, 0, Math.PI * 2); ctx.fill();

      // (2) Oát kế & Thời gian
      drawRoundRect(ctx, 368, 142, 165, 109, 10, '#1e293b', '#64748b', 2.2);
      ctx.fillStyle = '#f1f5f9';
      ctx.fillText('(2) Oát kế & Thời gian', 450, 165);
      drawRoundRect(ctx, 386, 175, 128, 38, 6, '#050811', '#10b981', 1.8);
      ctx.fillStyle = '#6ee7b7';
      ctx.font = '700 14px "DM Mono", monospace';
      ctx.fillText('P (W) | τ (s)', 450, 199);
      const pinsX = [398, 424, 476, 502];
      const pinsCol = ['#ef4444', '#3b82f6', '#ef4444', '#3b82f6'];
      pinsX.forEach((px, i) => {
        ctx.fillStyle = pinsCol[i];
        ctx.beginPath(); ctx.arc(px, 232, 6, 0, Math.PI * 2); ctx.fill();
      });

      // (4) Nhiệt lượng kế
      const bx = 575, by = 105, bw = 175, bh = 148;
      drawRoundRect(ctx, bx, by, bw, bh, 10, '#1e293b', '#94a3b8', 2.6);
      const wx = bx + 12, wy = by + 42, ww = bw - 24, wh = bh - 54;
      ctx.fillStyle = 'rgba(56, 189, 248, 0.26)';
      ctx.fillRect(wx, wy, ww, wh);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let xx = wx; xx <= wx + ww; xx += 4) {
        const yy = wy + Math.sin(xx * 0.1 + t * 3) * 1.5;
        if (xx === wx) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
      }
      ctx.stroke();

      // Nắp bình
      ctx.fillStyle = '#334155';
      ctx.fillRect(bx - 5, by - 7, bw + 10, 15);
      ctx.fillStyle = '#f1f5f9';
      ctx.font = '700 14px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('(4) Nhiệt lượng kế', bx + bw / 2, by + bh + 22);

      // Dây điện trở chìm trong nước
      const glow = 0.55 + 0.45 * Math.sin(t * 4) ** 2;
      ctx.strokeStyle = `rgba(249, 115, 22, ${glow.toFixed(2)})`;
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.moveTo(bx + 42, by - 7);
      ctx.lineTo(bx + 42, wy + 60);
      for (let k = 0; k < 5; k++) {
        ctx.lineTo(bx + 50 + k * 11, wy + 48);
        ctx.lineTo(bx + 55 + k * 11, wy + 70);
      }
      ctx.lineTo(bx + 106, wy + 60);
      ctx.lineTo(bx + 106, by - 7);
      ctx.stroke();

      // (3) Nhiệt kế tăng 1 chiều rồi reset
      drawThermometer(ctx, bx + 138, 48, wy + 58, 6.5, 0.35 + 0.5 * saw, '#ef4444', '(3) Nhiệt kế');

      // Dây nối mạch
      ctx.save();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.moveTo(210, 214); ctx.lineTo(210, 282); ctx.lineTo(398, 282); ctx.lineTo(398, 232);
      ctx.moveTo(476, 232); ctx.lineTo(476, 282); ctx.lineTo(552, 282); ctx.lineTo(552, 74); ctx.lineTo(bx + 42, 74); ctx.lineTo(bx + 42, by - 7);
      ctx.stroke();

      ctx.strokeStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(242, 214); ctx.lineTo(242, 292); ctx.lineTo(424, 292); ctx.lineTo(424, 232);
      ctx.moveTo(502, 232); ctx.lineTo(502, 292); ctx.lineTo(562, 292); ctx.lineTo(562, 84); ctx.lineTo(bx + 106, 84); ctx.lineTo(bx + 106, by - 7);
      ctx.stroke();
      ctx.restore();
    },

    // CÂU 3: Đo nhiệt nóng chảy riêng nước đá (Viên đá to rộng rãi, chữ nằm gọn trong viên đá, không đè chữ)
    'MH-C1-03': function(ctx, w, h, t) {
      ctx.clearRect(0, 0, w, h);
      const bx = 55, by = 85, bw = 235, bh = 182;
      drawRoundRect(ctx, bx, by, bw, bh, 12, '#1e293b', '#94a3b8', 2.8);
      const wx = bx + 14, wy = by + 54, ww = bw - 28, wh = bh - 68;

      ctx.fillStyle = 'rgba(56, 189, 248, 0.26)';
      ctx.fillRect(wx, wy, ww, wh);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let xx = wx; xx <= wx + ww; xx += 4) {
        const yy = wy + Math.sin(xx * 0.08 + t * 3) * 1.5;
        if (xx === wx) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
      }
      ctx.stroke();

      // Nắp bình
      ctx.fillStyle = '#334155';
      ctx.fillRect(bx - 5, by - 8, bw + 10, 15);

      // Dây điện trở chìm dưới đáy
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.moveTo(bx + 42, by - 8);
      ctx.lineTo(bx + 42, wy + 85);
      for (let k = 0; k < 5; k++) {
        ctx.lineTo(bx + 52 + k * 14, wy + 73);
        ctx.lineTo(bx + 59 + k * 14, wy + 95);
      }
      ctx.lineTo(bx + 125, wy + 85);
      ctx.lineTo(bx + 125, by - 8);
      ctx.stroke();

      // Viên nước đá KÍCH THƯỚC RỘNG RÃI (92x34px) để chữ "Đá: 0,02 kg" nằm gọn 100% bên trong
      const bob = Math.sin(t * 2.4) * 2.2;
      const iceX = bx + 48, iceY = wy - 10 + bob, iceW = 92, iceH = 34;
      drawRoundRect(ctx, iceX, iceY, iceW, iceH, 8, 'rgba(224, 242, 254, 0.9)', '#38bdf8', 2);
      ctx.fillStyle = '#0f172a';
      ctx.font = '800 13px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Đá: 0,02 kg', iceX + iceW / 2, iceY + 21);

      // Que khuấy đặt cách xa nhiệt kế
      const stirY = Math.sin(t * 3.5) * 5;
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(bx + 156, 48 + stirY);
      ctx.lineTo(bx + 156, wy + 62 + stirY);
      ctx.moveTo(bx + 144, wy + 62 + stirY);
      ctx.lineTo(bx + 168, wy + 62 + stirY);
      ctx.stroke();

      // Nhiệt kế đặt bên phải
      const prog = (t * 0.2) % 1;
      const tempRatio = prog < 0.6 ? 0.22 : (0.22 + (prog - 0.6) * 0.9);
      drawThermometer(ctx, bx + 202, 52, wy + 70, 6.5, tempRatio, '#38bdf8', 'Nhiệt kế');

      ctx.fillStyle = '#f1f5f9';
      ctx.font = '700 14px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Bình nhiệt lượng kế (Nước + Đá)', bx + bw / 2, by + bh + 22);

      // Đồ thị t(°C) theo τ(s) bên phải
      const ox = 365, oy = 245, gxW = 365, gyH = 180;
      drawArrow(ctx, ox, oy, ox + gxW, oy, '#94a3b8', 2.4, 8);
      drawArrow(ctx, ox, oy, ox, oy - gyH, '#94a3b8', 2.4, 8);
      ctx.fillStyle = '#f1f5f9';
      ctx.font = '700 14.5px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('t (°C)', ox - 18, oy - gyH - 10);
      ctx.fillText('τ (s)', ox + gxW + 8, oy + 5);
      ctx.textAlign = 'right';
      ctx.fillText('0', ox - 8, oy + 5);

      const bendX = ox + 195;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(bendX, oy);
      ctx.lineTo(ox + 320, oy - 145);
      ctx.stroke();

      let dotX, dotY;
      if (prog < 0.6) {
        dotX = ox + (prog / 0.6) * 195;
        dotY = oy;
      } else {
        const p2 = (prog - 0.6) / 0.4;
        dotX = bendX + p2 * 125;
        dotY = oy - p2 * 145;
      }
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath(); ctx.arc(dotX, dotY, 6.5, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = '#38bdf8';
      ctx.font = '700 13.5px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Đá đang nóng chảy (0°C)', ox + 98, oy + 24);
      ctx.fillStyle = '#fbbf24';
      ctx.fillText('Nước tăng nhiệt độ', bendX + 95, oy - 105);
    },

    // CÂU 4: Mạch đo nhiệt dung riêng chất lỏng (Chữ to rõ, nhiệt kế sawtooth 1 chiều)
    'MH-C1-04': function(ctx, w, h, t) {
      ctx.clearRect(0, 0, w, h);
      const saw = (t * 0.2) % 1;

      drawRoundRect(ctx, 40, 110, 180, 138, 12, '#1e293b', '#64748b', 2.5);
      ctx.fillStyle = '#f1f5f9';
      ctx.font = '800 15px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Biến áp nguồn', 130, 138);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '700 15px "DM Mono", monospace';
      ctx.fillText('U = 1,6 V', 130, 174);
      ctx.fillText('I = 2,5 A', 130, 202);

      drawRoundRect(ctx, 275, 138, 135, 84, 10, '#1e293b', '#38bdf8', 2.5);
      ctx.fillStyle = '#f1f5f9';
      ctx.font = '800 15px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Oát kế', 342, 168);
      ctx.fillStyle = '#6ee7b7';
      ctx.font = '700 14px "DM Mono", monospace';
      ctx.fillText('P = U · I', 342, 196);

      const bx = 485, by = 85, bw = 225, bh = 182;
      drawRoundRect(ctx, bx, by, bw, bh, 12, '#1e293b', '#94a3b8', 2.8);
      const wx = bx + 14, wy = by + 44, ww = bw - 28, wh = bh - 56;
      ctx.fillStyle = 'rgba(56, 189, 248, 0.26)';
      ctx.fillRect(wx, wy, ww, wh);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let xx = wx; xx <= wx + ww; xx += 4) {
        const yy = wy + Math.sin(xx * 0.09 + t * 3) * 1.5;
        if (xx === wx) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
      }
      ctx.stroke();

      ctx.fillStyle = '#334155';
      ctx.fillRect(bx - 5, by - 7, bw + 10, 15);
      ctx.fillStyle = '#f1f5f9';
      ctx.font = '700 14.5px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Nhiệt lượng kế (m = 150,0 g)', bx + bw / 2, by + bh + 22);

      drawThermometer(ctx, bx + 48, 48, wy + 78, 6.5, 0.32 + 0.52 * saw, '#ef4444', 'Nhiệt kế');

      const glow = 0.55 + 0.45 * Math.sin(t * 4) ** 2;
      ctx.strokeStyle = `rgba(249, 115, 22, ${glow.toFixed(2)})`;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(bx + 120, by - 7);
      ctx.lineTo(bx + 120, wy + 78);
      for (let k = 0; k < 5; k++) {
        ctx.lineTo(bx + 128 + k * 11, wy + 66);
        ctx.lineTo(bx + 134 + k * 11, wy + 90);
      }
      ctx.lineTo(bx + 185, wy + 78);
      ctx.lineTo(bx + 185, by - 7);
      ctx.stroke();

      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.moveTo(220, 162); ctx.lineTo(275, 162);
      ctx.moveTo(410, 162); ctx.lineTo(445, 162); ctx.lineTo(445, 56); ctx.lineTo(bx + 185, 56); ctx.lineTo(bx + 185, by - 7);
      ctx.stroke();

      ctx.strokeStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(220, 198); ctx.lineTo(275, 198);
      ctx.moveTo(410, 198); ctx.lineTo(460, 198); ctx.lineTo(460, 68); ctx.lineTo(bx + 120, 68); ctx.lineTo(bx + 120, by - 7);
      ctx.stroke();
    },

    // CÂU 5: 5 dụng cụ đo nhiệt nóng chảy riêng nước đá bằng phương pháp trộn
    'MH-C1-05': function(ctx, w, h, t) {
      ctx.clearRect(0, 0, w, h);
      ctx.font = '700 13.5px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';

      // (1) Chai nước
      drawRoundRect(ctx, 42, 110, 64, 132, 12, 'rgba(56,189,248,0.18)', '#38bdf8', 2.4);
      ctx.fillStyle = 'rgba(56,189,248,0.35)';
      ctx.fillRect(44, 142, 60, 98);
      ctx.fillStyle = '#334155';
      ctx.fillRect(62, 92, 24, 18);
      ctx.fillStyle = '#f1f5f9';
      ctx.fillText('(1) Chai nước', 74, 268);

      // (2) Nhiệt lượng kế
      const bx = 152, by = 98, bw = 158, bh = 144;
      drawRoundRect(ctx, bx, by, bw, bh, 12, '#1e293b', '#94a3b8', 2.6);
      ctx.fillStyle = 'rgba(56,189,248,0.25)';
      ctx.fillRect(bx + 10, by + 40, bw - 20, bh - 50);
      ctx.fillStyle = '#334155';
      ctx.fillRect(bx - 4, by - 6, bw + 8, 13);
      const sy = Math.sin(t * 3.5) * 5;
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.moveTo(bx + 115, 60 + sy); ctx.lineTo(bx + 115, by + 105 + sy);
      ctx.moveTo(bx + 102, by + 105 + sy); ctx.lineTo(bx + 128, by + 105 + sy);
      ctx.stroke();
      ctx.fillStyle = '#f1f5f9';
      ctx.fillText('(2) Nhiệt lượng kế', bx + bw / 2, 268);

      // (3) Cốc nước đá (hở miệng trên)
      const cx = 355, cy = 118, cw = 120, ch = 124;
      ctx.fillStyle = 'rgba(56,189,248,0.22)';
      ctx.fillRect(cx + 3, cy + 28, cw - 6, ch - 30);
      drawOpenCup(ctx, cx, cy, cw, ch, '#cbd5e1', 2.8, 4);
      const bob = Math.sin(t * 2.5) * 2;
      drawRoundRect(ctx, cx + 16, cy + 22 + bob, 36, 26, 6, 'rgba(224,242,254,0.85)', '#38bdf8', 1.8);
      drawRoundRect(ctx, cx + 64, cy + 26 - bob, 38, 26, 6, 'rgba(224,242,254,0.85)', '#38bdf8', 1.8);
      ctx.fillStyle = '#f1f5f9';
      ctx.fillText('(3) Cốc nước đá', cx + cw / 2, 268);

      // (5) Nhiệt kế điện tử
      drawThermometer(ctx, 542, 60, 145, 6.5, 0.55, '#ef4444', '(5) Nhiệt kế');
      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 12.5px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('(±0,1°C)', 542, 178);

      // (4) Cân điện tử
      drawRoundRect(ctx, 605, 180, 150, 62, 8, '#1e293b', '#64748b', 2.4);
      ctx.fillStyle = '#475569';
      ctx.fillRect(620, 171, 120, 9);
      drawRoundRect(ctx, 632, 196, 96, 28, 5, '#050811', '#10b981', 1.6);
      ctx.fillStyle = '#6ee7b7';
      ctx.font = '700 13.5px "DM Mono", monospace';
      ctx.fillText('0.00 g', 680, 215);
      ctx.fillStyle = '#f1f5f9';
      ctx.font = '700 13.5px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('(4) Cân (0,01g)', 680, 268);
    },

    // CÂU 6: Bình nước nóng năng lượng mặt trời
    'MH-C1-06': function(ctx, w, h, t) {
      ctx.clearRect(0, 0, w, h);
      const sx = 85, sy = 58;
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath(); ctx.arc(sx, sy, 25, 0, Math.PI * 2); ctx.fill();
      for (let i = 0; i < 4; i++) {
        const off = ((t * 45 + i * 25) % 75);
        const x1 = sx + 32 + i * 18 + off * 0.7;
        const y1 = sy + 18 - i * 6 + off * 0.55;
        drawArrow(ctx, x1, y1, x1 + 36, y1 + 28, '#fbbf24', 2.5, 7);
      }
      ctx.fillStyle = '#fbbf24';
      ctx.font = '800 14px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Cường độ sáng: 1370 W/m²', 128, 42);
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '700 13.5px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Hấp thụ truyền cho nước: 60%', 128, 64);

      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(215, 255); ctx.lineTo(415, 118); ctx.lineTo(415, 255);
      ctx.moveTo(190, 255); ctx.lineTo(445, 255);
      ctx.stroke();

      ctx.save();
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.moveTo(215, 248);
      ctx.lineTo(365, 140);
      ctx.lineTo(425, 150);
      ctx.lineTo(275, 255);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = '#38bdf8';
      ctx.font = '800 14px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Tấm thu nhiệt S = 2 m²', 320, 280);

      drawRoundRect(ctx, 330, 80, 185, 62, 28, '#1e293b', '#cbd5e1', 2.8);
      drawRoundRect(ctx, 340, 90, 165, 42, 20, 'rgba(239, 68, 68, 0.38)', null);
      ctx.fillStyle = '#f8fafc';
      ctx.font = '800 14px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Bình: 200 lít (25°C)', 422, 116);

      drawRoundRect(ctx, 535, 82, 225, 172, 10, '#0f172a', '#334155', 2);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '800 14px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('THÔNG SỐ ĐỀ BÀI', 552, 108);
      ctx.fillStyle = '#f1f5f9';
      ctx.font = '600 13.5px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('• Diện tích thu: 2 m²', 552, 136);
      ctx.fillText('• Thể tích bình: 200 lít', 552, 162);
      ctx.fillText('• Nhiệt độ đầu: 25°C', 552, 188);
      ctx.fillText('• Cường độ: 1370 W/m²', 552, 214);
      ctx.fillText('• Hiệu suất thu: 60%', 552, 240);
    },

    // CÂU 7: Bình làm nóng nước gián tiếp (Chữ to rõ, van khóa rõ nét)
    'MH-C1-07': function(ctx, w, h, t) {
      ctx.clearRect(0, 0, w, h);
      const bx = 275, by = 52, bw = 230, bh = 185;
      drawRoundRect(ctx, bx, by, bw, bh, 18, '#1e293b', '#94a3b8', 2.8);
      drawRoundRect(ctx, bx + 14, by + 16, bw - 28, bh - 32, 10, 'rgba(239, 68, 68, 0.25)', 'rgba(248, 113, 113, 0.45)', 1.8);

      ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3.2;
      ctx.beginPath(); ctx.moveTo(bx + bw / 2 - 6, 14); ctx.lineTo(bx + bw / 2 - 6, by + 35); ctx.stroke();
      ctx.strokeStyle = '#38bdf8';
      ctx.beginPath(); ctx.moveTo(bx + bw / 2 + 6, 14); ctx.lineTo(bx + bw / 2 + 6, by + 35); ctx.stroke();
      ctx.fillStyle = '#fbbf24';
      ctx.font = '800 14px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Điện vào: P = 2500 W (H = 95%)', bx + bw / 2 + 18, 32);

      const pulse = 0.55 + 0.45 * Math.sin(t * 4) ** 2;
      ctx.strokeStyle = `rgba(249, 115, 22, ${pulse.toFixed(2)})`;
      ctx.lineWidth = 3.8;
      ctx.beginPath();
      ctx.moveTo(bx + bw / 2 - 6, by + 35);
      ctx.lineTo(bx + bw / 2 - 38, by + 85);
      ctx.lineTo(bx + bw / 2 + 38, by + 105);
      ctx.lineTo(bx + bw / 2 - 38, by + 125);
      ctx.lineTo(bx + bw / 2 + 6, by + 145);
      ctx.lineTo(bx + bw / 2 + 6, by + 35);
      ctx.stroke();

      drawRoundRect(ctx, bx + 60, by + 46, 110, 38, 6, '#050811', '#38bdf8', 1.8);
      ctx.fillStyle = '#f87171';
      ctx.font = '800 18px "DM Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('70°C', bx + bw / 2, by + 71);

      const ox1 = bx + 60;
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(ox1 - 6, by + bh - 16, 12, 56);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(ox1 - 16, by + bh + 16, 32, 8);
      ctx.fillStyle = '#fca5a5';
      ctx.font = '700 13.5px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('Ống nước nóng ra (Khóa)', ox1 - 22, by + bh + 25);

      const ox2 = bx + bw - 60;
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(ox2 - 6, by + bh - 16, 12, 56);
      drawArrow(ctx, ox2, by + bh + 44, ox2, by + bh + 12, '#38bdf8', 2.6, 7);
      ctx.fillStyle = '#38bdf8';
      ctx.textAlign = 'left';
      ctx.fillText('Nước lạnh vào (18°C)', ox2 + 18, by + bh + 25);

      ctx.fillStyle = '#f8fafc';
      ctx.font = '800 14px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Dung tích: 20 lít', bx + bw / 2, by + bh - 26);
    },

    // CÂU 9: Hệ thống tắm nóng lạnh gián tiếp hòa trộn tại vòi hoa sen
    'MH-C1-09': function(ctx, w, h, t) {
      ctx.clearRect(0, 0, w, h);
      const bx = 55, by = 55, bw = 195, bh = 160;
      drawRoundRect(ctx, bx, by, bw, bh, 14, '#1e293b', '#94a3b8', 2.8);
      drawRoundRect(ctx, bx + 12, by + 14, bw - 24, bh - 28, 8, 'rgba(239, 68, 68, 0.28)', 'rgba(248,113,113,0.4)', 1.8);
      ctx.fillStyle = '#f8fafc';
      ctx.font = '800 14px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Bình chứa nước nóng', bx + bw / 2, by + 42);
      ctx.fillStyle = '#fbbf24';
      ctx.font = '700 13.5px "DM Mono", monospace';
      ctx.fillText('V = 15 L | P = 2,5 kW', bx + bw / 2, by + 70);
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('Đầu: 20°C | H = 97%', bx + bw / 2, by + 96);

      const mixX = 415, mixY = 168;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 9;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(bx + 65, by + bh - 14);
      ctx.lineTo(bx + 65, mixY);
      ctx.lineTo(mixX, mixY);
      ctx.stroke();
      ctx.fillStyle = '#fca5a5';
      ctx.font = '700 13.5px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Nước nóng ra', 285, mixY - 14);

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 9;
      ctx.beginPath();
      ctx.moveTo(mixX, 270);
      ctx.lineTo(mixX, mixY);
      ctx.stroke();
      drawArrow(ctx, mixX + 20, 255, mixX + 20, 202, '#38bdf8', 2.5, 7);
      ctx.fillStyle = '#38bdf8';
      ctx.textAlign = 'left';
      ctx.fillText('Nước lạnh (20°C)', mixX + 30, 235);

      drawRoundRect(ctx, mixX - 26, mixY - 24, 52, 48, 10, '#334155', '#fbbf24', 2.8);
      ctx.fillStyle = '#fbbf24';
      ctx.font = '800 12.5px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('TRỘN', mixX, mixY + 5);

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 9;
      ctx.beginPath();
      ctx.moveTo(mixX, mixY - 24);
      ctx.lineTo(mixX, 72);
      ctx.lineTo(575, 72);
      ctx.lineTo(575, 105);
      ctx.stroke();

      drawRoundRect(ctx, 540, 102, 70, 18, 6, '#94a3b8', '#f8fafc', 1.8);
      ctx.fillStyle = '#f8fafc';
      ctx.font = '800 14px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Vòi hoa sen', 620, 116);

      const dropShift = (t * 90) % 24;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.4;
      for (let i = -2; i <= 2; i++) {
        const sx = 575 + i * 11;
        for (let yy = 126 + dropShift; yy < 258; yy += 24) {
          ctx.beginPath();
          ctx.moveTo(sx + i * (yy - 120) * 0.08, yy);
          ctx.lineTo(sx + i * (yy - 110) * 0.08, yy + 11);
          ctx.stroke();
        }
      }
    }
  };

  Object.entries(chunkModels).forEach(([id, fn]) => global.VLXTModels.register(id, fn));
})(window);

            })({ VLXTModels: tempVLXT });
        } catch(e) {
            if (typeof console !== 'undefined') console.error('Lỗi nạp Canvas chunk:', e);
        }



        try {
            (function(window) {
/**
 * ============================================================================
 * BỘ MÔ HÌNH CANVAS VẬT LÍ HYDROGEN V2 - CHƯƠNG 1 - CA 2 (CÂU 10 -> CÂU 21)
 * Gồm 9 mô hình: MH-C1-10, MH-C1-11, MH-C1-12, MH-C1-13, MH-C1-14,
 *                MH-C1-15, MH-C1-18, MH-C1-19, MH-C1-21
 * Chuẩn khung logic: 780 x 305 | Tuân thủ 10 Quy Tắc Vàng VLXT_MOTION_SPEC.md
 * ============================================================================
 */
(function(window) {
    'use strict';

    window.VLXTModels = window.VLXTModels || {
        _registry: {},
        register: function(id, fn) {
            this._registry[id] = fn;
        }
    };

    // =========================================================================
    // HỆ THỐNG HÀM TRỢ GIÚP CHUẨN VLXT (CORE HELPERS)
    // =========================================================================
    function clearCanvas(ctx, w, h) {
        ctx.clearRect(0, 0, w, h);
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#060b19');
        grad.addColorStop(1, '#0a1226');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Lưới kỹ thuật mờ
        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
        ctx.lineWidth = 1;
        for (let x = 20; x < w; x += 26) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (let y = 20; y < h; y += 26) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }
        ctx.restore();
    }

    function drawRoundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }

    function drawArrow(ctx, x1, y1, x2, y2, color, lineWidth = 2, headLen = 7) {
        const angle = Math.atan2(y2 - y1, x2 - x1);
        ctx.save();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    // Quy tắc vàng: Cốc/Xô hở miệng trên (U-shape, không bao giờ vẽ nắp đóng kín nếu không đậy)
    function drawOpenCup(ctx, x, y, w, h, waterRatio, options = {}) {
        const wallColor = options.wallColor || '#94a3b8';
        const waterTopColor = options.waterTopColor || 'rgba(56, 189, 248, 0.36)';
        const waterBotColor = options.waterBotColor || 'rgba(14, 116, 144, 0.58)';
        const wallWidth = options.wallWidth || 3;
        const flare = options.flare || 0; // độ loe miệng trên

        ctx.save();
        // Vẽ khối nước bên trong
        if (waterRatio > 0) {
            const wh = (h - 6) * Math.min(1, Math.max(0, waterRatio));
            const wy = y + h - 3 - wh;
            const topFlare = flare * (wh / h);

            const wGrad = ctx.createLinearGradient(0, wy, 0, y + h);
            wGrad.addColorStop(0, waterTopColor);
            wGrad.addColorStop(1, waterBotColor);

            ctx.fillStyle = wGrad;
            ctx.beginPath();
            ctx.moveTo(x + 2 - topFlare, wy);
            ctx.lineTo(x + w - 2 + topFlare, wy);
            ctx.lineTo(x + w - 2, y + h - 3);
            ctx.lineTo(x + 2, y + h - 3);
            ctx.closePath();
            ctx.fill();

            // Mặt thoáng nước
            ctx.strokeStyle = options.surfaceColor || '#7dd3fc';
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.moveTo(x + 2 - topFlare, wy);
            ctx.lineTo(x + w - 2 + topFlare, wy);
            ctx.stroke();
        }

        // Thành cốc/xô chữ U hở miệng trên
        ctx.strokeStyle = wallColor;
        ctx.lineWidth = wallWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(x - flare, y);
        ctx.lineTo(x, y + h);
        ctx.lineTo(x + w, y + h);
        ctx.lineTo(x + w + flare, y);
        ctx.stroke();

        // Viền mép miệng trên nhẹ
        ctx.lineWidth = wallWidth + 1;
        ctx.beginPath();
        ctx.moveTo(x - flare - 3, y);
        ctx.lineTo(x - flare + 2, y);
        ctx.moveTo(x + w + flare - 2, y);
        ctx.lineTo(x + w + flare + 3, y);
        ctx.stroke();
        ctx.restore();
    }

    // Quy tắc vàng: Chú thích chống đè nét (chấm neo + đường gấp khúc + badge chữ)
    function drawCallout(ctx, ax, ay, tx, ty, lines, color = '#38bdf8', align = 'left') {
        ctx.save();
        // Chấm tròn tại điểm neo
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(ax, ay, 3.2, 0, Math.PI * 2);
        ctx.fill();

        // Đường dẫn gấp khúc
        const elbowX = align === 'left' ? tx - 8 : tx + 8;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.3;
        ctx.setLineDash([3, 2]);
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(elbowX, ty);
        ctx.lineTo(tx, ty);
        ctx.stroke();
        ctx.setLineDash([]);

        // Vẽ text với viền nền tối chống chìm chữ
        ctx.font = '600 11.5px system-ui, -apple-system, sans-serif';
        ctx.textAlign = align;
        ctx.textBaseline = 'middle';

        const lineHeight = 15;
        const startY = ty - ((lines.length - 1) * lineHeight) / 2;

        lines.forEach((line, idx) => {
            const ly = startY + idx * lineHeight;
            const metrics = ctx.measureText(line);
            const padX = 5;
            const boxW = metrics.width + padX * 2;
            const boxX = align === 'left' ? tx : tx - boxW;

            ctx.fillStyle = 'rgba(6, 12, 28, 0.86)';
            drawRoundRect(ctx, boxX, ly - 7.5, boxW, 15, 4);
            ctx.fill();

            ctx.fillStyle = idx === 0 ? '#f8fafc' : '#cbd5e1';
            ctx.fillText(line, align === 'left' ? tx + padX : tx - padX, ly);
        });
        ctx.restore();
    }

    function drawTitleBadge(ctx, text, x = 16, y = 16) {
        ctx.save();
        ctx.font = '700 12px system-ui, -apple-system, sans-serif';
        const w = ctx.measureText(text).width + 18;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 1;
        drawRoundRect(ctx, x, y, w, 22, 6);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x + 9, y + 11);
        ctx.restore();
    }

    // =========================================================================
    // 1. MH-C1-10: SỤC ĐIỆN ĐUN NƯỚC SINH VIÊN
    // =========================================================================
    window.VLXTModels.register('MH-C1-10', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'MÔ HÌNH SỤC ĐIỆN ĐUN NƯỚC (P = 1000 W; H = 85%)');

        // Tiến độ gia nhiệt tuần hoàn (sawtooth 1 chiều)
        const cycle = (t * 0.16) % 1;
        const temp = 25 + cycle * 75; // 25°C -> 100°C

        // Vẽ xô nước hở miệng trên (tâm x = 390)
        const cupX = 305, cupY = 108, cupW = 170, cupH = 162;
        const hotness = cycle;
        const topR = Math.round(56 + hotness * 180);
        const topG = Math.round(189 - hotness * 90);
        const topB = Math.round(248 - hotness * 170);

        drawOpenCup(ctx, cupX, cupY, cupW, cupH, 0.78, {
            wallColor: '#94a3b8',
            flare: 14,
            waterTopColor: `rgba(${topR}, ${topG}, ${topB}, 0.42)`,
            waterBotColor: 'rgba(14, 116, 144, 0.58)',
            surfaceColor: `rgb(${topR}, ${topG}, ${topB})`
        });

        // Cán cầm nhựa & dây nguồn nối phích cắm phía trên phải
        ctx.save();
        // Dây điện cong sang phải
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(426, 62);
        ctx.bezierCurveTo(475, 34, 520, 42, 558, 70);
        ctx.stroke();

        // Phích cắm 2 chân
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        drawRoundRect(ctx, 554, 62, 26, 20, 4);
        ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(580, 68); ctx.lineTo(592, 68);
        ctx.moveTo(580, 76); ctx.lineTo(592, 76);
        ctx.stroke();

        // Tay cầm cách điện gác trên miệng xô
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 2;
        drawRoundRect(ctx, 396, 56, 32, 36, 6);
        ctx.fill(); ctx.stroke();

        // Hai thanh dẫn thẳng xuống nước
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(405, 92); ctx.lineTo(405, 192);
        ctx.moveTo(419, 92); ctx.lineTo(419, 192);
        ctx.stroke();

        // Vòng dây sục xoắn lò xo phát nhiệt đỏ rực
        const glow = 0.65 + 0.35 * Math.sin(t * 7);
        ctx.shadowColor = `rgba(239, 68, 68, ${glow})`;
        ctx.shadowBlur = 14;
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3.2;
        for (let i = 0; i < 6; i++) {
            const cy = 196 + i * 8;
            ctx.beginPath();
            ctx.ellipse(412, cy, 18, 4.5, 0, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.shadowBlur = 0;

        // Bong bóng khí sôi bay lên 1 chiều (sawtooth)
        const waterSurfaceY = cupY + cupH - 3 - (cupH - 6) * 0.78;
        for (let i = 0; i < 16; i++) {
            const p = ((t * (0.45 + (i % 4) * 0.12) + i * 0.19) % 1);
            const bx = 385 + ((i * 19) % 54) + Math.sin(p * 8 + i) * 3;
            const by = 238 - p * (238 - waterSurfaceY - 4);
            const br = 1.8 + p * 2.5 * (0.4 + 0.6 * cycle);
            ctx.strokeStyle = `rgba(224, 242, 254, ${0.85 * (1 - p * 0.5)})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(bx, by, br, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Hơi nước bốc lên mặt thoáng khi nhiệt độ cao
        if (cycle > 0.35) {
            for (let s = 0; s < 5; s++) {
                const sp = (t * 0.4 + s * 0.2) % 1;
                const sx = 340 + s * 25 + Math.sin(sp * 6 + s) * 6;
                const sy = waterSurfaceY - 6 - sp * 34;
                ctx.strokeStyle = `rgba(248, 250, 252, ${(1 - sp) * 0.45})`;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(sx, sy);
                ctx.quadraticCurveTo(sx + 4, sy - 6, sx - 2, sy - 12);
                ctx.stroke();
            }
        }
        ctx.restore();

        // Chú thích 2 bên không đè nét
        drawCallout(ctx, 298, 175, 225, 132, ['Xô chứa nước (m = 3 kg)', `Nhiệt độ: ${temp.toFixed(0)}°C`], '#38bdf8', 'right');
        drawCallout(ctx, 298, 232, 225, 215, ['Nước nhận nhiệt đối lưu', 'c = 4200 J/(kg·K)'], '#22d3ee', 'right');
        drawCallout(ctx, 430, 216, 520, 175, ['Dây sục xoắn lò xo', 'Tỏa nhiệt Q = P·t'], '#f87171', 'left');
        drawCallout(ctx, 566, 72, 520, 118, ['Phích cắm & cán cách điện', 'Công suất P = 1000 W'], '#fb923c', 'left');
    });

    // =========================================================================
    // 2. MH-C1-11: HỆ THỐNG TẢN NHIỆT NƯỚC CPU (HEATPIPE / WATER COOLING)
    // =========================================================================
    window.VLXTModels.register('MH-C1-11', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'HỆ THỐNG TẢN NHIỆT LỎNG CPU (CÔNG SUẤT TỎA NHIỆT P)');

        // 1. CPU & Đế đồng (bên trái dưới)
        ctx.save();
        // Bo mạch chủ (PCB)
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        drawRoundRect(ctx, 185, 238, 160, 18, 4);
        ctx.fill(); ctx.stroke();

        // Chip CPU phát nhiệt
        const pulse = 0.6 + 0.4 * Math.sin(t * 5);
        ctx.fillStyle = '#334155';
        drawRoundRect(ctx, 215, 218, 100, 20, 3);
        ctx.fill();
        ctx.fillStyle = `rgba(239, 68, 68, ${0.45 + 0.3 * pulse})`;
        drawRoundRect(ctx, 225, 222, 80, 12, 2);
        ctx.fill();

        // Đế đồng (Waterblock / Copper base)
        const cuGrad = ctx.createLinearGradient(210, 182, 320, 218);
        cuGrad.addColorStop(0, '#d97706');
        cuGrad.addColorStop(0.5, '#f59e0b');
        cuGrad.addColorStop(1, '#b45309');
        ctx.fillStyle = cuGrad;
        drawRoundRect(ctx, 210, 184, 110, 34, 6);
        ctx.fill();
        ctx.strokeStyle = '#fde68a';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // 2. Két tản nhiệt & Quạt (bên phải trên)
        const radX = 445, radY = 66, radW = 145, radH = 126;
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        drawRoundRect(ctx, radX, radY, radW, radH, 8);
        ctx.fill(); ctx.stroke();

        // Lá nhôm tản nhiệt ngang
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.5;
        for (let y = radY + 12; y < radY + radH - 8; y += 10) {
            ctx.beginPath();
            ctx.moveTo(radX + 8, y);
            ctx.lineTo(radX + radW - 8, y);
            ctx.stroke();
        }

        // Quạt thổi gió bên phải két
        const fanX = 602, fanY = 74, fanW = 22, fanH = 110;
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        drawRoundRect(ctx, fanX, fanY, fanW, fanH, 4);
        ctx.fill(); ctx.stroke();

        // Cánh quạt quay dao động
        for (let b = 0; b < 5; b++) {
            const by = fanY + 14 + b * 20 + Math.sin(t * 14 + b) * 3;
            ctx.strokeStyle = '#7dd3fc';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(fanX + 4, by);
            ctx.lineTo(fanX + fanW - 4, by + 4);
            ctx.stroke();
        }

        // Luồng gió mát thổi từ trái qua két ra phải (sawtooth 1 chiều)
        for (let a = 0; a < 4; a++) {
            const p = (t * 0.9 + a * 0.25) % 1;
            const ax = 632 + p * 46;
            const ay = 86 + a * 28;
            drawArrow(ctx, ax, ay, ax + 22, ay, `rgba(56, 189, 248, ${1 - p})`, 1.8, 6);
        }

        // 3. Hệ thống ống dẫn tuần hoàn (Ống trên: Chất lỏng nóng/bay hơi đỏ; Ống dưới: Ngưng tụ mát xanh)
        // Ống nóng đi lên
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(265, 184);
        ctx.lineTo(265, 96);
        ctx.lineTo(445, 96);
        ctx.stroke();

        // Ống lạnh hồi về
        ctx.strokeStyle = '#0ea5e9';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(445, 164);
        ctx.lineTo(310, 164);
        ctx.lineTo(310, 184);
        ctx.stroke();

        // Hạt chất lỏng / hơi chuyển động 1 chiều trong ống
        for (let i = 0; i < 6; i++) {
            const p = (t * 0.55 + i / 6) % 1;
            // Nhánh nóng (0 -> 268px)
            const dHot = p * 268;
            let hx, hy;
            if (dHot < 88) { hx = 265; hy = 184 - dHot; }
            else { hx = 265 + (dHot - 88); hy = 96; }
            ctx.fillStyle = '#fef08a';
            ctx.beginPath(); ctx.arc(hx, hy, 3.2, 0, Math.PI * 2); ctx.fill();

            // Nhánh lạnh hồi về (155px)
            const dCold = p * 155;
            let cx, cy;
            if (dCold < 135) { cx = 445 - dCold; cy = 164; }
            else { cx = 310; cy = 164 + (dCold - 135); }
            ctx.fillStyle = '#e0f2fe';
            ctx.beginPath(); ctx.arc(cx, cy, 3.2, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();

        // Chú thích rõ ràng ở vùng trống
        drawCallout(ctx, 215, 228, 172, 232, ['Chip CPU tỏa nhiệt', 'Nhiệt độ giới hạn T'], '#f87171', 'right');
        drawCallout(ctx, 210, 198, 172, 165, ['Đế đồng tiếp xúc', 'Thu nhiệt làm bay hơi'], '#fbbf24', 'right');
        drawCallout(ctx, 355, 96, 340, 56, ['Ống dẫn hơi/lỏng nóng', 'Mang nhiệt lên dàn'], '#ef4444', 'right');
        drawCallout(ctx, 520, 66, 615, 44, ['Dàn ngưng & Quạt gió', 'Tỏa nhiệt ra môi trường'], '#38bdf8', 'left');
        drawCallout(ctx, 385, 164, 430, 235, ['Chất lỏng ngưng tụ nguội', 'Tuần hoàn trở lại đế CPU'], '#0ea5e9', 'left');
    });

    // =========================================================================
    // 3. MH-C1-12: HỆ THỐNG LÀM MÁT ĐỘNG CƠ Ô TÔ
    // =========================================================================
    window.VLXTModels.register('MH-C1-12', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'HỆ THỐNG LÀM MÁT ĐỘNG CƠ Ô TÔ BẰNG CHẤT LỎNG');

        ctx.save();
        // 1. Két nước tản nhiệt tổ ong (bên trái)
        const radX = 165, radY = 74, radW = 58, radH = 168;
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2.5;
        drawRoundRect(ctx, radX, radY, radW, radH, 6);
        ctx.fill(); ctx.stroke();

        // Gradient nóng trên -> mát dưới trong két
        const rGrad = ctx.createLinearGradient(0, radY, 0, radY + radH);
        rGrad.addColorStop(0, 'rgba(239, 68, 68, 0.5)');
        rGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.3)');
        rGrad.addColorStop(1, 'rgba(14, 165, 233, 0.55)');
        ctx.fillStyle = rGrad;
        ctx.fillRect(radX + 4, radY + 4, radW - 8, radH - 8);

        // Nan tổ ong
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
        ctx.lineWidth = 1;
        for (let y = radY + 12; y < radY + radH - 6; y += 11) {
            ctx.beginPath(); ctx.moveTo(radX + 4, y); ctx.lineTo(radX + radW - 4, y); ctx.stroke();
        }

        // Luồng gió làm mát thổi xuyên qua két từ trái sang
        for (let i = 0; i < 4; i++) {
            const p = (t * 0.85 + i * 0.25) % 1;
            const gx = 112 + p * 44;
            const gy = 95 + i * 38;
            drawArrow(ctx, gx, gy, gx + 18, gy, `rgba(56, 189, 248, ${1 - p})`, 1.8, 5);
        }

        // 2. Thân động cơ & Áo nước bao quanh 3 xi-lanh (bên phải)
        const engX = 355, engY = 86, engW = 195, engH = 146;
        // Áo nước xanh-đỏ bao quanh
        ctx.fillStyle = 'rgba(14, 165, 233, 0.22)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        drawRoundRect(ctx, engX, engY, engW, engH, 10);
        ctx.fill(); ctx.stroke();

        // 3 Xi-lanh & Pit-tông dao động bên trong áo nước
        for (let c = 0; c < 3; c++) {
            const cx = engX + 20 + c * 58;
            const cy = engY + 18;
            ctx.fillStyle = '#1e293b';
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 1.5;
            ctx.fillRect(cx, cy, 40, 108);
            ctx.strokeRect(cx, cy, 40, 108);

            // Buồng đốt đỏ rực phía trên pit-tông
            const py = cy + 28 + Math.sin(t * 6 + c * 2.1) * 16;
            const burn = 0.5 + 0.5 * Math.sin(t * 6 + c * 2.1);
            ctx.fillStyle = `rgba(249, 115, 22, ${0.35 + 0.45 * burn})`;
            ctx.fillRect(cx + 2, cy + 2, 36, py - cy - 2);

            // Pit-tông
            ctx.fillStyle = '#cbd5e1';
            ctx.fillRect(cx + 3, py, 34, 18);
        }

        // 3. Van hằng nhiệt (Thermostat) tại góc trên trái động cơ
        ctx.fillStyle = '#f59e0b';
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(348, 96, 11, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();

        // 4. Bơm nước tuần hoàn (Water Pump) tại góc dưới trái động cơ
        const pumpX = 348, pumpY = 216;
        ctx.fillStyle = '#0284c7';
        ctx.strokeStyle = '#7dd3fc';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(pumpX, pumpY, 14, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();

        // Cánh bơm quay
        ctx.save();
        ctx.translate(pumpX, pumpY);
        ctx.rotate(-t * 5);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        for (let b = 0; b < 4; b++) {
            ctx.rotate(Math.PI / 2);
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(9, 0); ctx.stroke();
        }
        ctx.restore();

        // 5. Đường ống dẫn nước nóng (trên: động cơ -> két) & nước nguội (dưới: két -> bơm -> động cơ)
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 9;
        ctx.beginPath();
        ctx.moveTo(337, 96);
        ctx.lineTo(223, 96);
        ctx.stroke();

        ctx.strokeStyle = '#0ea5e9';
        ctx.lineWidth = 9;
        ctx.beginPath();
        ctx.moveTo(223, 216);
        ctx.lineTo(334, 216);
        ctx.stroke();

        // Hạt dòng chảy tuần hoàn 1 chiều
        for (let i = 0; i < 4; i++) {
            const p = (t * 0.7 + i * 0.25) % 1;
            // Nóng sang trái
            ctx.fillStyle = '#fef08a';
            ctx.beginPath();
            ctx.arc(335 - p * 110, 96, 3, 0, Math.PI * 2);
            ctx.fill();

            // Nguội sang phải
            ctx.fillStyle = '#e0f2fe';
            ctx.beginPath();
            ctx.arc(225 + p * 108, 216, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();

        // Chú thích
        drawCallout(ctx, 165, 130, 108, 72, ['Két nước tổ ong', 'Tản nhiệt ra không khí'], '#38bdf8', 'right');
        drawCallout(ctx, 280, 96, 275, 52, ['Nước nóng từ động cơ', 'Nhiệt độ tăng Δt'], '#ef4444', 'left');
        drawCallout(ctx, 348, 230, 275, 265, ['Bơm tuần hoàn & Nước nguội', 'Đẩy nước vào áo xi-lanh'], '#0ea5e9', 'left');
        drawCallout(ctx, 550, 155, 585, 135, ['Áo nước bao xi-lanh', 'Hấp thụ nhiệt lượng Q'], '#fb923c', 'left');
        drawCallout(ctx, 355, 86, 585, 215, ['Van hằng nhiệt', 'Điều tiết lưu lượng'], '#fbbf24', 'left');
    });

    // =========================================================================
    // 4. MH-C1-13: MÁY HÚT ẨM DẠNG NGƯNG TỤ
    // =========================================================================
    window.VLXTModels.register('MH-C1-13', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'NGUYÊN LÝ MÁY HÚT ẨM DẠNG NGƯNG TỤ');

        ctx.save();
        // Vỏ máy hút ẩm (khung chính giữa)
        const boxX = 240, boxY = 58, boxW = 300, boxH = 212;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2.5;
        drawRoundRect(ctx, boxX, boxY, boxW, boxH, 12);
        ctx.fill(); ctx.stroke();

        // 1. Dàn lạnh (Evaporator - bên trái bên trong máy)
        const evapX = 278, evapY = 82, evapW = 46, evapH = 104;
        ctx.fillStyle = 'rgba(14, 165, 233, 0.25)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        drawRoundRect(ctx, evapX, evapY, evapW, evapH, 6);
        ctx.fill(); ctx.stroke();

        // Ống đồng xoắn dàn lạnh
        ctx.strokeStyle = '#7dd3fc';
        ctx.lineWidth = 2.5;
        for (let y = evapY + 14; y < evapY + evapH - 10; y += 16) {
            ctx.beginPath();
            ctx.moveTo(evapX + 6, y);
            ctx.lineTo(evapX + evapW - 6, y);
            ctx.stroke();
        }

        // 2. Dàn nóng (Condenser - bên phải dàn lạnh)
        const condX = 374, condY = 82, condW = 46, condH = 104;
        ctx.fillStyle = 'rgba(239, 68, 68, 0.22)';
        ctx.strokeStyle = '#f87171';
        ctx.lineWidth = 2;
        drawRoundRect(ctx, condX, condY, condW, condH, 6);
        ctx.fill(); ctx.stroke();

        ctx.strokeStyle = '#fca5a5';
        ctx.lineWidth = 2.5;
        for (let y = condY + 14; y < condY + condH - 10; y += 16) {
            ctx.beginPath();
            ctx.moveTo(condX + 6, y);
            ctx.lineTo(condX + condW - 6, y);
            ctx.stroke();
        }

        // 3. Quạt hút/thổi bên phải trong máy
        const fanX = 482, fanY = 134;
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(fanX, fanY, 26, 0, Math.PI * 2); ctx.stroke();
        ctx.save();
        ctx.translate(fanX, fanY);
        ctx.rotate(t * 7);
        ctx.fillStyle = '#38bdf8';
        for (let b = 0; b < 4; b++) {
            ctx.rotate(Math.PI / 2);
            ctx.beginPath();
            ctx.ellipse(11, 0, 10, 4, 0.3, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();

        // 4. Khay chứa nước ngưng phía dưới dàn lạnh (OpenCup)
        const waterLevel = 0.35 + 0.45 * ((t * 0.12) % 1);
        drawOpenCup(ctx, 266, 206, 72, 48, waterLevel, {
            wallColor: '#94a3b8',
            waterTopColor: 'rgba(56, 189, 248, 0.5)',
            waterBotColor: 'rgba(2, 132, 199, 0.7)'
        });

        // Giọt nước ngưng tụ rơi từ đáy dàn lạnh xuống khay (1 chiều sawtooth)
        for (let d = 0; d < 3; d++) {
            const dp = (t * 0.95 + d * 0.33) % 1;
            const dx = 288 + d * 13;
            const dy = 188 + dp * 34;
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.arc(dx, dy, 2.8, 0, Math.PI * 2);
            ctx.moveTo(dx - 2.8, dy);
            ctx.lineTo(dx, dy - 6);
            ctx.lineTo(dx + 2.8, dy);
            ctx.fill();
        }

        // 5. Máy nén (Compressor) góc dưới phải
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#fb923c';
        ctx.lineWidth = 2;
        drawRoundRect(ctx, 415, 212, 64, 38, 8);
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fdba74';
        ctx.font = '600 10px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('MÁY NÉN', 447, 234);

        // 6. Luồng không khí ẩm vào (trái) -> khí khô ấm ra (phải)
        for (let i = 0; i < 3; i++) {
            const p = (t * 0.75 + i * 0.33) % 1;
            // Khí ẩm vào (xanh ngọc)
            const inX = 175 + p * 55;
            const inY = 102 + i * 32;
            drawArrow(ctx, inX, inY, inX + 22, inY, `rgba(45, 212, 191, ${1 - p})`, 2, 6);

            // Khí khô thổi ra (cam nhạt)
            const outX = 548 + p * 55;
            const outY = 102 + i * 32;
            drawArrow(ctx, outX, outY, outX + 22, outY, `rgba(251, 191, 36, ${1 - p})`, 2, 6);
        }
        ctx.restore();

        // Chú thích
        drawCallout(ctx, 195, 134, 165, 76, ['Không khí ẩm vào', 'Chứa hơi nước'], '#2dd4bf', 'right');
        drawCallout(ctx, 278, 125, 165, 152, ['Dàn lạnh ngưng tụ', 'Hơi nước hóa lỏng (L)'], '#38bdf8', 'right');
        drawCallout(ctx, 266, 232, 165, 235, ['Khay hứng nước ngưng', 'Nước lỏng chảy xuống'], '#0ea5e9', 'right');
        drawCallout(ctx, 397, 82, 560, 56, ['Dàn nóng sấy khô', 'Làm ấm luồng khí'], '#f87171', 'left');
        drawCallout(ctx, 575, 134, 615, 168, ['Quạt thổi khí khô ra', 'Độ ẩm đã giảm'], '#fbbf24', 'left');
    });

    // =========================================================================
    // 5. MH-C1-14: ỐNG PHÁT TIA X CU-LÍT-GIƠ (COOLIDGE TUBE)
    // =========================================================================
    window.VLXTModels.register('MH-C1-14', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'ỐNG PHÁT TIA X CU-LÍT-GIƠ & HỆ LÀM MÁT ANOT');

        ctx.save();
        // 1. Vỏ thủy tinh chân không của ống Cu-lít-giơ
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.65)';
        ctx.fillStyle = 'rgba(15, 23, 42, 0.55)';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        // Cổ trái (Catot) -> Bầu giữa -> Cổ phải (Anot)
        ctx.moveTo(180, 128);
        ctx.lineTo(285, 128);
        ctx.quadraticCurveTo(320, 74, 385, 74);
        ctx.quadraticCurveTo(450, 74, 485, 128);
        ctx.lineTo(595, 128);
        ctx.lineTo(595, 182);
        ctx.lineTo(485, 182);
        ctx.quadraticCurveTo(450, 236, 385, 236);
        ctx.quadraticCurveTo(320, 236, 285, 182);
        ctx.lineTo(180, 182);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 2. Catot & Sợi nung (bên trái)
        ctx.fillStyle = '#475569';
        ctx.fillRect(182, 144, 72, 22);
        // Chụp hội tụ Catot
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(262, 155, 16, -Math.PI * 0.45, Math.PI * 0.45);
        ctx.stroke();

        // Sợi nung phát sáng vàng cam
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 12;
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(254, 149);
        ctx.lineTo(266, 152);
        ctx.lineTo(254, 155);
        ctx.lineTo(266, 158);
        ctx.lineTo(254, 161);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // 3. Anot vát nghiêng 45° bằng đồng/vonfram + Ống nước làm nguội bên trong (bên phải)
        // Khối đồng Anot vát mặt trái
        const anotGrad = ctx.createLinearGradient(410, 130, 590, 180);
        anotGrad.addColorStop(0, '#f59e0b');
        anotGrad.addColorStop(0.4, '#d97706');
        anotGrad.addColorStop(1, '#92400e');
        ctx.fillStyle = anotGrad;
        ctx.beginPath();
        ctx.moveTo(412, 136); // Đỉnh trên mặt vát
        ctx.lineTo(593, 136);
        ctx.lineTo(593, 174);
        ctx.lineTo(446, 174); // Đáy dưới mặt vát (vát 45 độ)
        ctx.closePath();
        ctx.fill();

        // Bia Vonfram (W) gắn trên mặt vát
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(414, 138);
        ctx.lineTo(444, 172);
        ctx.stroke();

        // Kênh nước làm nguội tuần hoàn rỗng bên trong cán Anot
        ctx.strokeStyle = '#0ea5e9';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(593, 149);
        ctx.lineTo(458, 149);
        ctx.lineTo(458, 161);
        ctx.lineTo(593, 161);
        ctx.stroke();

        // Hạt nước làm mát chảy 1 chiều trong cán Anot
        for (let i = 0; i < 4; i++) {
            const p = (t * 0.8 + i * 0.25) % 1;
            // Dòng vào (trên sang trái)
            ctx.fillStyle = '#e0f2fe';
            ctx.beginPath(); ctx.arc(590 - p * 130, 149, 2, 0, Math.PI * 2); ctx.fill();
            // Dòng ra (dưới sang phải mang nhiệt đi)
            ctx.fillStyle = '#fca5a5';
            ctx.beginPath(); ctx.arc(460 + p * 130, 161, 2, 0, Math.PI * 2); ctx.fill();
        }

        // 4. Chùm electron gia tốc bắn từ Catot đập vào mặt vát Anot (1 chiều sawtooth)
        for (let e = 0; e < 7; e++) {
            const ep = (t * 1.4 + e / 7) % 1;
            const ex = 268 + ep * 160;
            const ey = 155 + (e % 3 - 1) * 3;
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.arc(ex, ey, 2.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // Điểm va chạm phát sáng tại bia Anot
        const hitGlow = 0.6 + 0.4 * Math.sin(t * 18);
        ctx.fillStyle = `rgba(254, 240, 138, ${hitGlow})`;
        ctx.beginPath(); ctx.arc(429, 155, 7, 0, Math.PI * 2); ctx.fill();

        // 5. Chùm tia X phát vuông góc xuống dưới (1 chiều sawtooth)
        for (let r = 0; r < 4; r++) {
            const rp = (t * 1.1 + r * 0.25) % 1;
            const angle = Math.PI / 2 + (r - 1.5) * 0.16;
            const rStart = 14 + rp * 55;
            const rEnd = rStart + 26;
            const x1 = 429 + Math.cos(angle) * rStart;
            const y1 = 155 + Math.sin(angle) * rStart;
            const x2 = 429 + Math.cos(angle) * rEnd;
            const y2 = 155 + Math.sin(angle) * rEnd;
            drawArrow(ctx, x1, y1, x2, y2, `rgba(192, 132, 252, ${1 - rp})`, 2, 6);
        }
        ctx.restore();

        // Chú thích
        drawCallout(ctx, 258, 155, 165, 92, ['Catot & Sợi nung', 'Phát xạ nhiệt electron'], '#fbbf24', 'right');
        drawCallout(ctx, 345, 155, 165, 222, ['Chùm electron gia tốc', 'Động năng lớn Wđ'], '#38bdf8', 'right');
        drawCallout(ctx, 429, 155, 520, 72, ['Anot vát nghiêng 45°', '99% động năng hóa nhiệt'], '#fb923c', 'left');
        drawCallout(ctx, 540, 155, 615, 155, ['Nước làm nguội Anot', 'Lưu lượng m/t tải nhiệt'], '#0ea5e9', 'left');
        drawCallout(ctx, 429, 245, 520, 255, ['Chùm tia X phát ra', 'Bước sóng ngắn λ'], '#c084fc', 'left');
    });

    // =========================================================================
    // 6. MH-C1-15: QUẠT ĐIỀU HÒA HƠI NƯỚC (EVAPORATIVE AIR COOLER)
    // =========================================================================
    window.VLXTModels.register('MH-C1-15', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'QUẠT ĐIỀU HÒA HƠI NƯỚC (LÀM MÁT BAY HƠI)');

        ctx.save();
        // Thân quạt điều hòa
        const bodyX = 270, bodyY = 52, bodyW = 220, bodyH = 224;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2.5;
        drawRoundRect(ctx, bodyX, bodyY, bodyW, bodyH, 10);
        ctx.fill(); ctx.stroke();

        // 1. Bể chứa nước dưới đáy (OpenCup)
        const waterRatio = 0.72 - 0.18 * ((t * 0.08) % 1);
        drawOpenCup(ctx, 286, 214, 188, 50, waterRatio, {
            wallColor: '#64748b',
            waterTopColor: 'rgba(56, 189, 248, 0.45)',
            waterBotColor: 'rgba(14, 116, 144, 0.7)'
        });

        // 2. Bơm chìm & Ống dẫn nước lên máng phân phối trên đỉnh
        ctx.fillStyle = '#0284c7';
        drawRoundRect(ctx, 294, 238, 22, 20, 4);
        ctx.fill();

        // Ống dẫn nước thẳng đứng lên đỉnh
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(305, 238);
        ctx.lineTo(305, 70);
        ctx.lineTo(345, 70);
        ctx.stroke();

        // Hạt nước bơm đi lên
        for (let i = 0; i < 4; i++) {
            const p = (t * 0.7 + i * 0.25) % 1;
            ctx.fillStyle = '#e0f2fe';
            ctx.beginPath();
            ctx.arc(305, 235 - p * 162, 2.2, 0, Math.PI * 2);
            ctx.fill();
        }

        // 3. Tấm làm mát tổ ong (Cooling Pad - bên trái thân máy)
        const padX = 326, padY = 76, padW = 36, padH = 128;
        ctx.fillStyle = 'rgba(14, 165, 233, 0.25)';
        ctx.strokeStyle = '#0ea5e9';
        ctx.lineWidth = 2;
        drawRoundRect(ctx, padX, padY, padW, padH, 4);
        ctx.fill(); ctx.stroke();

        // Họa tiết tổ ong ziczac & màng nước chảy xuống
        ctx.strokeStyle = 'rgba(125, 211, 252, 0.55)';
        ctx.lineWidth = 1.2;
        for (let y = padY + 8; y < padY + padH - 6; y += 10) {
            ctx.beginPath();
            ctx.moveTo(padX + 4, y);
            ctx.lineTo(padX + padW / 2, y + 5);
            ctx.lineTo(padX + padW - 4, y);
            ctx.stroke();
        }

        // 4. Lồng quạt ly tâm / hướng trục (bên phải tấm làm mát)
        const fanX = 432, fanY = 140;
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(fanX, fanY, 34, 0, Math.PI * 2); ctx.stroke();
        ctx.save();
        ctx.translate(fanX, fanY);
        ctx.rotate(t * 7.5);
        ctx.fillStyle = '#38bdf8';
        for (let b = 0; b < 5; b++) {
            ctx.rotate((Math.PI * 2) / 5);
            ctx.beginPath();
            ctx.ellipse(15, 0, 13, 4.5, 0.35, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();

        // 5. Luồng khí nóng từ sau vào (trái, đỏ cam) -> Bay hơi thu nhiệt -> Gió mát ra phòng (phải, xanh dương)
        for (let i = 0; i < 4; i++) {
            const p = (t * 0.85 + i * 0.25) % 1;
            // Khí nóng vào
            const hx = 195 + p * 65;
            const hy = 92 + i * 32;
            drawArrow(ctx, hx, hy, hx + 22, hy, `rgba(249, 115, 22, ${1 - p})`, 2, 6);

            // Gió mát thổi ra
            const cx = 498 + p * 75;
            const cy = 92 + i * 32;
            drawArrow(ctx, cx, cy, cx + 26, cy, `rgba(56, 189, 248, ${1 - p})`, 2.2, 6);
        }
        ctx.restore();

        // Chú thích
        drawCallout(ctx, 220, 124, 185, 82, ['Không khí nóng khô vào', 'Nhiệt độ cao T₁'], '#fb923c', 'right');
        drawCallout(ctx, 326, 145, 185, 162, ['Tấm làm mát tổ ong', 'Nước bay hơi thu nhiệt L'], '#38bdf8', 'right');
        drawCallout(ctx, 286, 245, 185, 240, ['Bể nước & Bơm tuần hoàn', 'Cấp nước ướt tấm tổ ong'], '#0ea5e9', 'right');
        drawCallout(ctx, 432, 106, 515, 65, ['Quạt hút & thổi gió', 'Tạo dòng khí đối lưu'], '#94a3b8', 'left');
        drawCallout(ctx, 545, 155, 585, 195, ['Luồng gió mát ra phòng', 'Nhiệt độ giảm T₂ < T₁'], '#22d3ee', 'left');
    });

    // =========================================================================
    // 7. MH-C1-18: NGHỀ ĐÚC ĐỒNG TRUYỀN THỐNG TRÀ ĐÔNG
    // =========================================================================
    window.VLXTModels.register('MH-C1-18', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'NGHỀ ĐÚC ĐỒNG TRÀ ĐÔNG (NẤU CHẢY & RÓT KHUÔN)');

        ctx.save();
        // 1. Lò nung rực lửa (bên trái)
        const furX = 165, furY = 128, furW = 108, furH = 135;
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2.5;
        drawRoundRect(ctx, furX, furY, furW, furH, 8);
        ctx.fill(); ctx.stroke();

        // Cửa lò rực lửa cam đỏ
        const fireGlow = 0.75 + 0.25 * Math.sin(t * 9);
        const fGrad = ctx.createRadialGradient(furX + 54, furY + 86, 6, furX + 54, furY + 86, 44);
        fGrad.addColorStop(0, '#fef08a');
        fGrad.addColorStop(0.5, `rgba(249, 115, 22, ${fireGlow})`);
        fGrad.addColorStop(1, 'rgba(185, 28, 28, 0.2)');
        ctx.fillStyle = fGrad;
        drawRoundRect(ctx, furX + 18, furY + 46, 72, 76, 30);
        ctx.fill();

        // Ngọn lửa bập bùng bên trong
        for (let f = 0; f < 3; f++) {
            const fp = (t * 1.8 + f * 0.33) % 1;
            const fx = furX + 36 + f * 18;
            const fy = furY + 106 - fp * 36;
            ctx.fillStyle = `rgba(254, 240, 138, ${1 - fp})`;
            ctx.beginPath();
            ctx.arc(fx, fy, 4 * (1 - fp * 0.5), 0, Math.PI * 2);
            ctx.fill();
        }

        // 2. Nồi nấu đồng (Crucible) nghiêng rót đồng nóng chảy ở giữa trên
        ctx.save();
        ctx.translate(362, 112);
        ctx.rotate(0.42); // Nghiêng rót sang phải

        // Thân nồi nấu bằng gốm chịu nhiệt
        ctx.fillStyle = '#334155';
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(-28, -24);
        ctx.lineTo(-20, 28);
        ctx.lineTo(20, 28);
        ctx.lineTo(28, -24);
        ctx.closePath();
        ctx.fill(); ctx.stroke();

        // Bề mặt đồng lỏng phát sáng bên trong nồi
        ctx.fillStyle = '#fb923c';
        ctx.fillRect(-23, -18, 46, 12);

        // Càng gắp dài giữ nồi
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(-26, 0);
        ctx.lineTo(-92, 16);
        ctx.stroke();
        ctx.restore();

        // 3. Dòng đồng lỏng đỏ cam phát sáng chảy vào khuôn (1 chiều)
        ctx.shadowColor = '#f97316';
        ctx.shadowBlur = 14;
        ctx.strokeStyle = '#fb923c';
        ctx.lineWidth = 6.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(392, 102);
        ctx.quadraticCurveTo(426, 116, 434, 174);
        ctx.stroke();

        // Lõi sáng trắng vàng trong dòng đồng
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(392, 102);
        ctx.quadraticCurveTo(426, 116, 434, 174);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Tia lửa kim loại bắn ra tại miệng rót (sawtooth)
        for (let s = 0; s < 6; s++) {
            const sp = (t * 1.6 + s / 6) % 1;
            const ang = -Math.PI * 0.8 + (s % 5) * 0.4;
            const sx = 434 + Math.cos(ang) * sp * 28;
            const sy = 172 + Math.sin(ang) * sp * 22 + sp * sp * 14;
            ctx.fillStyle = `rgba(254, 240, 138, ${1 - sp})`;
            ctx.beginPath(); ctx.arc(sx, sy, 1.8, 0, Math.PI * 2); ctx.fill();
        }

        // 4. Khuôn đúc trống đồng (bên phải dưới)
        const moldX = 382, moldY = 174, moldW = 114, moldH = 92;
        // Vỏ khuôn đất sét
        ctx.fillStyle = '#451a03';
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 2.5;
        drawRoundRect(ctx, moldX, moldY, moldW, moldH, 6);
        ctx.fill(); ctx.stroke();

        // Lòng khuôn hình dáng trống đồng Đông Sơn (mặt trống loe, tang phình, chân choãi)
        const fillCycle = (t * 0.18) % 1;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(moldX + 14, moldY + 8);
        ctx.lineTo(moldX + moldW - 14, moldY + 8);
        ctx.lineTo(moldX + moldW - 8, moldY + 34);
        ctx.lineTo(moldX + moldW - 22, moldY + 56);
        ctx.lineTo(moldX + moldW - 12, moldY + 84);
        ctx.lineTo(moldX + 12, moldY + 84);
        ctx.lineTo(moldX + 22, moldY + 56);
        ctx.lineTo(moldX + 8, moldY + 34);
        ctx.closePath();
        ctx.fillStyle = '#1c1917';
        ctx.fill();
        ctx.clip();

        // Mức đồng lỏng dâng lên trong khuôn
        const fillH = 76 * (0.25 + 0.75 * fillCycle);
        const mGrad = ctx.createLinearGradient(0, moldY + 84 - fillH, 0, moldY + 84);
        mGrad.addColorStop(0, '#fef08a');
        mGrad.addColorStop(0.35, '#f97316');
        mGrad.addColorStop(1, '#dc2626');
        ctx.fillStyle = mGrad;
        ctx.fillRect(moldX, moldY + 84 - fillH, moldW, fillH);
        ctx.restore();
        ctx.restore();

        // Chú thích
        drawCallout(ctx, 165, 195, 132, 155, ['Lò nung nhiên liệu', 'Cấp nhiệt nấu chảy đồng'], '#f97316', 'right');
        drawCallout(ctx, 355, 86, 275, 58, ['Nồi đồng nóng chảy', 'Nhiệt độ nóng chảy ~1084°C'], '#fbbf24', 'right');
        drawCallout(ctx, 415, 128, 525, 95, ['Dòng đồng lỏng rót khuôn', 'Chuyển thể Lỏng → Rắn'], '#fb923c', 'left');
        drawCallout(ctx, 496, 222, 525, 225, ['Khuôn đúc trống đồng', 'Tỏa nhiệt đông đặc λ·m'], '#f59e0b', 'left');
    });

    // =========================================================================
    // 8. MH-C1-19: ƯỚP LON BIA TRONG THÙNG XỐP ĐÁ LẠNH
    // =========================================================================
    window.VLXTModels.register('MH-C1-19', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'ƯỚP LẠNH LON BIA TRONG THÙNG XỐP ĐÁ (CÂN BẰNG NHIỆT)');

        const coolProgress = (t * 0.14) % 1; // 0 -> 1 quá trình làm lạnh & tan đá

        ctx.save();
        // 1. Thùng xốp cách nhiệt mở nắp trên (dạng hộp cách nhiệt dày màu trắng xám)
        const boxX = 245, boxY = 104, boxW = 290, boxH = 162;

        // Nắp thùng xốp mở nghiêng sang trái phía trên
        ctx.save();
        ctx.translate(boxX, boxY);
        ctx.rotate(-0.36);
        ctx.fillStyle = '#e2e8f0';
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        drawRoundRect(ctx, -4, -18, 220, 18, 4);
        ctx.fill(); ctx.stroke();
        ctx.restore();

        // Lớp nước đá tan đọng dưới đáy thùng xốp
        const meltWaterH = 18 + coolProgress * 34;
        ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.fillRect(boxX + 12, boxY + boxH - 12 - meltWaterH, boxW - 24, meltWaterH);

        // Mặt thoáng nước đá tan
        ctx.strokeStyle = '#7dd3fc';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(boxX + 12, boxY + boxH - 12 - meltWaterH);
        ctx.lineTo(boxX + boxW - 12, boxY + boxH - 12 - meltWaterH);
        ctx.stroke();

        // 2. Các lon bia nhôm xếp trong thùng (màu chuyển dần từ ấm cam sang lạnh xanh)
        const canPositions = [282, 344, 406, 468];
        const canR = Math.round(245 - coolProgress * 210);
        const canG = Math.round(158 + coolProgress * 45);
        const canB = Math.round(66 + coolProgress * 185);

        canPositions.forEach((cx, idx) => {
            const cy = 148;
            const cw = 38, ch = 96;
            const cGrad = ctx.createLinearGradient(cx, cy, cx + cw, cy);
            cGrad.addColorStop(0, `rgb(${canR}, ${canG}, ${canB})`);
            cGrad.addColorStop(0.5, '#f8fafc');
            cGrad.addColorStop(1, `rgb(${canR}, ${canG}, ${canB})`);

            ctx.fillStyle = cGrad;
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 1.5;
            drawRoundRect(ctx, cx, cy, cw, ch, 6);
            ctx.fill(); ctx.stroke();

            // Nhãn vòng giữa lon
            ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
            ctx.fillRect(cx + 1, cy + 32, cw - 2, 26);
            ctx.fillStyle = '#38bdf8';
            ctx.font = '700 9px system-ui';
            ctx.textAlign = 'center';
            ctx.fillText('330ml', cx + cw / 2, cy + 48);
        });

        // 3. Các viên đá lạnh (0°C) xen kẽ xung quanh lon bia, nhỏ dần khi tan
        const iceScale = 1 - coolProgress * 0.38;
        const iceCoords = [
            [266, 178, 18], [326, 166, 20], [388, 174, 19], [450, 165, 20], [508, 180, 18],
            [274, 212, 20], [332, 206, 21], [392, 210, 20], [452, 204, 21], [504, 214, 19]
        ];
        iceCoords.forEach(([ix, iy, isize]) => {
            const s = isize * iceScale;
            ctx.fillStyle = 'rgba(224, 242, 254, 0.82)';
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.4;
            drawRoundRect(ctx, ix - s / 2, iy - s / 2, s, s, 4);
            ctx.fill(); ctx.stroke();
        });

        // 4. Mũi tên truyền nhiệt từ lon bia (nóng hơn) sang viên đá (0°C)
        const pulse = 0.5 + 0.5 * Math.sin(t * 5);
        ctx.globalAlpha = 0.5 + 0.5 * pulse;
        drawArrow(ctx, 344, 185, 330, 185, '#f97316', 2, 5);
        drawArrow(ctx, 406, 185, 392, 185, '#f97316', 2, 5);
        drawArrow(ctx, 468, 185, 454, 185, '#f97316', 2, 5);
        ctx.globalAlpha = 1;

        // 5. Thành thùng xốp cách nhiệt chữ U dày
        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 10;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(boxX, boxY);
        ctx.lineTo(boxX, boxY + boxH);
        ctx.lineTo(boxX + boxW, boxY + boxH);
        ctx.lineTo(boxX + boxW, boxY);
        ctx.stroke();

        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(boxX - 5, boxY, 10, boxH + 5);
        ctx.strokeRect(boxX + boxW - 5, boxY, 10, boxH + 5);
        ctx.restore();

        // Chú thích
        drawCallout(ctx, 240, 185, 195, 130, ['Thùng xốp cách nhiệt', 'Ngăn trao đổi nhiệt ngoài'], '#e2e8f0', 'right');
        drawCallout(ctx, 272, 212, 195, 225, ['Nước đá lạnh (0°C)', 'Nhận nhiệt nóng chảy λ·m'], '#38bdf8', 'right');
        drawCallout(ctx, 487, 165, 575, 125, ['Các lon bia (t₁ > 0°C)', 'Tỏa nhiệt giảm nhiệt độ'], '#fb923c', 'left');
        drawCallout(ctx, 515, 245, 575, 225, ['Nước đá tan ra (0°C)', 'Cân bằng nhiệt Q_tỏa = Q_thu'], '#7dd3fc', 'left');
    });

    // =========================================================================
    // 9. MH-C1-21: ĐỘNG CƠ XĂNG 4 KỲ (NẠP - NÉN - NỔ - THẢI)
    // =========================================================================
    window.VLXTModels.register('MH-C1-21', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'CHU TRÌNH ĐỘNG CƠ XĂNG 4 KỲ (NẠP → NÉN → NỔ → THẢI)');

        // Chu kỳ 4 kỳ: góc quay trục khuỷu theta từ 0 đến 4*PI (720 độ)
        const theta = (t * 2.2) % (Math.PI * 4);
        const phaseIdx = Math.floor(theta / Math.PI); // 0: Nạp, 1: Nén, 2: Nổ (Sinh công), 3: Thải
        const phaseNames = ['1. KỲ NẠP', '2. KỲ NÉN', '3. KỲ NỔ (SINH CÔNG)', '4. KỲ THẢI'];
        const phaseColors = ['#38bdf8', '#fbbf24', '#ef4444', '#94a3b8'];

        // Vị trí pit-tông: theta = 0 (ĐCT - trên cùng), theta = PI (ĐCD - dưới cùng)
        // y_piston = top + stroke * (1 - cos(theta)) / 2
        const crankX = 390, crankY = 232, crankR = 26;
        const pistonNorm = (1 - Math.cos(theta)) / 2; // 0 (trên) -> 1 (dưới)
        const cylX = 352, cylY = 66, cylW = 76, cylH = 122;
        const pistonY = cylY + 18 + pistonNorm * 52;

        ctx.save();
        // 1. Ống nạp (trái) & Ống xả (phải)
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        // Ống nạp trái
        ctx.fillRect(298, 54, 68, 16);
        ctx.strokeRect(298, 54, 68, 16);
        // Ống xả phải
        ctx.fillRect(414, 54, 68, 16);
        ctx.strokeRect(414, 54, 68, 16);

        // 2. Thân xi-lanh
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cylX, cylY);
        ctx.lineTo(cylX, cylY + cylH);
        ctx.moveTo(cylX + cylW, cylY);
        ctx.lineTo(cylX + cylW, cylY + cylH);
        ctx.stroke();

        // 3. Buồng đốt (màu thay đổi theo từng kỳ)
        const chamberH = pistonY - cylY;
        let chamberColor = 'rgba(56, 189, 248, 0.25)'; // Nạp: hòa khí xanh mát
        if (phaseIdx === 1) {
            const comp = 1 - pistonNorm;
            chamberColor = `rgba(251, 191, 36, ${0.25 + comp * 0.45})`; // Nén: nóng dần lên vàng cam
        } else if (phaseIdx === 2) {
            const exp = 1 - pistonNorm;
            chamberColor = `rgba(239, 68, 68, ${0.35 + exp * 0.55})`; // Nổ: cháy rực đỏ cam
        } else if (phaseIdx === 3) {
            chamberColor = 'rgba(148, 163, 184, 0.35)'; // Thải: khí khói xám
        }
        ctx.fillStyle = chamberColor;
        ctx.fillRect(cylX + 2, cylY, cylW - 4, chamberH);

        // 4. Xupap nạp (trái) & Xupap xả (phải)
        const intakeOpen = (phaseIdx === 0) ? Math.sin(theta) * 7 : 0;
        const exhaustOpen = (phaseIdx === 3) ? Math.sin(theta - 3 * Math.PI) * 7 : 0;

        // Xupap nạp
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(370, 44 + intakeOpen);
        ctx.lineTo(370, 66 + intakeOpen);
        ctx.moveTo(362, 66 + intakeOpen);
        ctx.lineTo(378, 66 + intakeOpen);
        ctx.stroke();

        // Xupap xả
        ctx.strokeStyle = '#f87171';
        ctx.beginPath();
        ctx.moveTo(410, 44 + exhaustOpen);
        ctx.lineTo(410, 66 + exhaustOpen);
        ctx.moveTo(402, 66 + exhaustOpen);
        ctx.lineTo(418, 66 + exhaustOpen);
        ctx.stroke();

        // 5. Bugi ở chính giữa nắp xi-lanh
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(386, 40, 8, 24);
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(385, 46, 10, 8);

        // Tia lửa điện bugi đánh ở đầu kỳ Nổ (phaseIdx === 2 và pistonNorm < 0.22)
        if (phaseIdx === 2 && pistonNorm < 0.25) {
            ctx.shadowColor = '#fef08a';
            ctx.shadowBlur = 14;
            ctx.strokeStyle = '#fef08a';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(390, 64);
            ctx.lineTo(384, 72);
            ctx.lineTo(395, 76);
            ctx.lineTo(388, 84);
            ctx.stroke();
            ctx.shadowBlur = 0;
        }

        // Luồng khí nạp / khí thải qua ống
        if (phaseIdx === 0) {
            const p = (t * 2) % 1;
            drawArrow(ctx, 302 + p * 30, 62, 322 + p * 30, 62, '#38bdf8', 2, 5);
        } else if (phaseIdx === 3) {
            const p = (t * 2) % 1;
            drawArrow(ctx, 425 + p * 30, 62, 445 + p * 30, 62, '#94a3b8', 2, 5);
        }

        // 6. Pit-tông, Thanh truyền & Trục khuỷu
        ctx.fillStyle = '#cbd5e1';
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.5;
        drawRoundRect(ctx, cylX + 3, pistonY, cylW - 6, 26, 3);
        ctx.fill(); ctx.stroke();

        // Vòng tròn quỹ đạo trục khuỷu
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(crankX, crankY, crankR, 0, Math.PI * 2); ctx.stroke();

        // Chốt khuỷu quay theo theta (theta=0 ở đỉnh trên)
        const pinX = crankX + Math.sin(theta) * crankR;
        const pinY = crankY - Math.cos(theta) * crankR;

        // Thanh truyền nối tâm pit-tông với chốt khuỷu
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(crankX, pistonY + 16);
        ctx.lineTo(pinX, pinY);
        ctx.stroke();

        // Tay quay trục khuỷu
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(crankX, crankY);
        ctx.lineTo(pinX, pinY);
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.beginPath(); ctx.arc(crankX, crankY, 5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(pinX, pinY, 4, 0, Math.PI * 2); ctx.fill();

        // Thanh chỉ thị 4 kỳ bên trái
        phaseNames.forEach((name, idx) => {
            const active = idx === phaseIdx;
            const by = 116 + idx * 34;
            ctx.fillStyle = active ? 'rgba(30, 41, 59, 0.95)' : 'rgba(15, 23, 42, 0.5)';
            ctx.strokeStyle = active ? phaseColors[idx] : 'rgba(71, 85, 105, 0.4)';
            ctx.lineWidth = active ? 2 : 1;
            drawRoundRect(ctx, 42, by, 196, 26, 6);
            ctx.fill(); ctx.stroke();

            ctx.fillStyle = active ? phaseColors[idx] : '#64748b';
            ctx.font = active ? '700 11.5px system-ui' : '500 11px system-ui';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(name, 54, by + 13);
        });
        ctx.restore();

        // Chú thích bên phải
        drawCallout(ctx, 390, 46, 515, 65, ['Bugi đánh lửa', 'Đốt cháy hỗn hợp xăng-khí'], '#fef08a', 'left');
        drawCallout(ctx, 428, 125, 515, 138, ['Xi-lanh & Pit-tông', 'Thể tích khí biến thiên'], '#38bdf8', 'left');
        drawCallout(ctx, 416, 232, 515, 218, ['Trục khuỷu & Thanh truyền', 'Biến chuyển động tịnh tiến → quay'], '#f59e0b', 'left');
    });

})(window);

            })({ VLXTModels: tempVLXT });
        } catch(e) {
            if (typeof console !== 'undefined') console.error('Lỗi nạp Canvas chunk:', e);
        }



        try {
            (function(window) {
/**
 * ============================================================================
 * BỘ MÔ HÌNH CANVAS VẬT LÍ HYDROGEN V2 - CHƯƠNG 2 - CA 3 (CÂU 23 -> CÂU 37)
 * Gồm 15 mô hình: MH-C2-23, MH-C2-24, MH-C2-25, MH-C2-26, MH-C2-27,
 *                MH-C2-28, MH-C2-29, MH-C2-30, MH-C2-31, MH-C2-32,
 *                MH-C2-33, MH-C2-34, MH-C2-35, MH-C2-36, MH-C2-37
 * Chuẩn khung logic: 780 x 305 | Tuân thủ 10 Quy Tắc Vàng VLXT_MOTION_SPEC.md
 * ============================================================================
 */
(function(window) {
    'use strict';

    window.VLXTModels = window.VLXTModels || {
        _registry: {},
        register: function(id, fn) {
            this._registry[id] = fn;
        }
    };

    // =========================================================================
    // HỆ THỐNG HÀM TRỢ GIÚP CHUẨN VLXT (CORE HELPERS)
    // =========================================================================
    function clearCanvas(ctx, w, h) {
        ctx.clearRect(0, 0, w, h);
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#060b19');
        grad.addColorStop(1, '#0a1226');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
        ctx.lineWidth = 1;
        for (let x = 20; x < w; x += 26) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (let y = 20; y < h; y += 26) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }
        ctx.restore();
    }

    function drawRoundRect(ctx, x, y, w, h, r, fill, stroke, lineWidth = 2.5) {
        ctx.save();
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(x, y, w, h, r);
        } else {
            ctx.moveTo(x + r, y);
            ctx.lineTo(x + w - r, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + r);
            ctx.lineTo(x + w, y + h - r);
            ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            ctx.lineTo(x + r, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - r);
            ctx.lineTo(x, y + r);
            ctx.quadraticCurveTo(x, y, x + r, y);
            ctx.closePath();
        }
        if (fill) { ctx.fillStyle = fill; ctx.fill(); }
        if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); }
        ctx.restore();
    }

    function drawSubText(ctx, base, sub, x, y, opts = {}) {
        const fontSize = opts.fontSize || 15;
        const subSize = Math.round(fontSize * 0.74);
        const weight = opts.weight || '700';
        const italic = opts.italic ? 'italic ' : '';
        const color = opts.color || '#f8fafc';
        const align = opts.align || 'left';
        ctx.save();
        ctx.fillStyle = color;
        ctx.textBaseline = opts.baseline || 'alphabetic';
        ctx.font = `${italic}${weight} ${fontSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
        const baseW = ctx.measureText(base).width;
        ctx.font = `${weight} ${subSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
        const subW = sub ? ctx.measureText(sub).width : 0;
        const totalW = baseW + subW;
        let startX = x;
        if (align === 'center') startX = x - totalW / 2;
        else if (align === 'right') startX = x - totalW;

        ctx.font = `${italic}${weight} ${fontSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
        ctx.fillText(base, startX, y);
        if (sub) {
            ctx.font = `${weight} ${subSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
            ctx.fillText(sub, startX + baseW + 1, y + Math.round(fontSize * 0.28));
        }
        ctx.restore();
        return totalW;
    }

    function drawArrow(ctx, x1, y1, x2, y2, color = '#38bdf8', width = 3, headLen = 9) {
        const angle = Math.atan2(y2 - y1, x2 - x1);
        ctx.save();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    // Cốc/chậu hở miệng trên (U-shape, không bao giờ bịt nắp miệng trên)
    function drawOpenCup(ctx, x, y, w, h, waterRatio, options = {}) {
        const wallColor = options.wallColor || '#cbd5e1';
        const waterTopColor = options.waterTopColor || 'rgba(56, 189, 248, 0.32)';
        const waterBotColor = options.waterBotColor || 'rgba(14, 116, 144, 0.52)';
        const wallWidth = options.wallWidth || 3.2;
        const flare = options.flare || 0;

        ctx.save();
        if (waterRatio > 0) {
            const innerLeft = x + wallWidth * 0.45;
            const innerRight = x + w - wallWidth * 0.45;
            const innerBot = y + h - wallWidth * 0.45;
            const maxWaterH = h - 8;
            const wh = maxWaterH * Math.min(1, Math.max(0, waterRatio));
            const wy = innerBot - wh;
            const topFlare = flare * (wh / h);

            const wGrad = ctx.createLinearGradient(0, wy, 0, innerBot);
            wGrad.addColorStop(0, waterTopColor);
            wGrad.addColorStop(1, waterBotColor);

            ctx.fillStyle = wGrad;
            ctx.beginPath();
            ctx.moveTo(innerLeft - topFlare, wy);
            ctx.lineTo(innerRight + topFlare, wy);
            ctx.lineTo(innerRight, innerBot);
            ctx.lineTo(innerLeft, innerBot);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = options.surfaceColor || '#7dd3fc';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(innerLeft - topFlare, wy);
            ctx.lineTo(innerRight + topFlare, wy);
            ctx.stroke();
        }

        ctx.strokeStyle = wallColor;
        ctx.lineWidth = wallWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(x - flare, y);
        ctx.lineTo(x, y + h);
        ctx.lineTo(x + w, y + h);
        ctx.lineTo(x + w + flare, y);
        ctx.stroke();
        ctx.restore();
    }

    // Hộp chú thích nền #0f172a chống đè nét (Mobile-First >= 13.5px bold)
    function drawCallout(ctx, targetX, targetY, boxX, boxY, lines, borderColor = '#38bdf8', textColor = '#f8fafc') {
        const lineArr = Array.isArray(lines) ? lines : [lines];
        ctx.save();
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        const padX = 10;
        const lineH = 18;
        const boxH = lineArr.length * lineH + 10;
        let maxW = 0;
        lineArr.forEach(l => {
            const mw = ctx.measureText(l).width;
            if (mw > maxW) maxW = mw;
        });
        const boxW = maxW + padX * 2;
        const anchorX = (boxX + boxW / 2 < targetX) ? (boxX + boxW) : (boxX > targetX ? boxX : boxX + boxW / 2);
        const anchorY = boxY + boxH / 2;

        // Đường gióng
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(targetX, targetY);
        ctx.lineTo(anchorX, anchorY);
        ctx.stroke();

        // Chấm neo tại vật thể
        ctx.fillStyle = borderColor;
        ctx.beginPath();
        ctx.arc(targetX, targetY, 3.6, 0, Math.PI * 2);
        ctx.fill();

        // Hộp nhãn nền tối #0f172a
        drawRoundRect(ctx, boxX, boxY, boxW, boxH, 7, '#0f172a', borderColor, 1.8);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        lineArr.forEach((line, idx) => {
            ctx.fillStyle = idx === 0 ? textColor : '#cbd5e1';
            ctx.fillText(line, boxX + boxW / 2, boxY + 5 + lineH * (idx + 0.5));
        });
        ctx.restore();
    }

    function drawTitleBadge(ctx, text, x = 16, y = 14) {
        ctx.save();
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        const w = ctx.measureText(text).width + 22;
        drawRoundRect(ctx, x, y, w, 28, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.6);
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x + 11, y + 14);
        ctx.restore();
    }

    // Áp kế đồng hồ tròn chuẩn VLXT
    function drawPressureGauge(ctx, cx, cy, r, needleAngle, unitText, valueText, accent = '#38bdf8') {
        ctx.save();
        // Vỏ ngoài
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Vành chia độ
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.6;
        for (let i = 0; i <= 10; i++) {
            const ang = Math.PI * 0.75 + (i / 10) * Math.PI * 1.5;
            const r1 = r - 7;
            const r2 = (i % 5 === 0) ? r - 14 : r - 11;
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(ang) * r1, cy + Math.sin(ang) * r1);
            ctx.lineTo(cx + Math.cos(ang) * r2, cy + Math.sin(ang) * r2);
            ctx.stroke();
        }

        // Kim chỉ thị
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cx - Math.cos(needleAngle) * 6, cy - Math.sin(needleAngle) * 6);
        ctx.lineTo(cx + Math.cos(needleAngle) * (r - 10), cy + Math.sin(needleAngle) * (r - 10));
        ctx.stroke();

        // Trục tâm kim
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        ctx.fill();

        if (unitText) {
            ctx.fillStyle = accent;
            ctx.font = '800 11.5px "DM Mono", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(unitText, cx, cy + r * 0.45);
        }
        if (valueText) {
            drawRoundRect(ctx, cx - 44, cy - r - 28, 88, 22, 5, '#0f172a', accent, 1.5);
            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 13px "DM Mono", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(valueText, cx, cy - r - 17);
        }
        ctx.restore();
    }

    // Nhiệt kế thủy ngân/cồn dọc
    function drawThermometer(ctx, x, yTop, yBot, bulbR, fillRatio, color = '#ef4444', label = '') {
        ctx.save();
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(x - 6, yTop, 12, yBot - yTop, 6);
        else ctx.rect(x - 6, yTop, 12, yBot - yTop);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, yBot + bulbR - 2, bulbR, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        const ratio = Math.max(0.1, Math.min(1, fillRatio));
        const colTop = yBot - (yBot - yTop - 10) * ratio;
        ctx.fillStyle = color;
        ctx.fillRect(x - 3, colTop, 6, yBot - colTop + 2);

        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.4;
        for (let yy = yTop + 12; yy < yBot - 6; yy += 11) {
            ctx.beginPath();
            ctx.moveTo(x + 6, yy);
            ctx.lineTo(x + 11, yy);
            ctx.stroke();
        }

        if (label) {
            ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
            const lw = ctx.measureText(label).width + 16;
            drawRoundRect(ctx, x - lw / 2, yTop - 30, lw, 24, 6, '#0f172a', color, 1.6);
            ctx.fillStyle = '#f8fafc';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, x, yTop - 18);
        }
        ctx.restore();
    }

    // =========================================================================
    // 1. MH-C2-23: BÓNG THÁM KHÔNG BAY LÊN CAO GIÃN NỞ
    // Ràng buộc riêng:
    // - KHÔNG viết p1, V1, T1, p2, V2, T2 lên hình (vì nằm ở ý d).
    // - Khi bóng phình to ở độ cao lớn, hộp cảm biến treo dưới đáy bóng PHẢI
    //   giữ nguyên kích thước cố định (không được phóng to theo bóng).
    // - Vẽ các mũi tên vectơ hướng từ tâm ra ép vuông góc vào mặt trong thành bóng.
    // =========================================================================
    window.VLXTModels.register('MH-C2-23', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'QUẢ BÓNG THỜI TIẾT (BÓNG THÁM KHÔNG) GIÃN NỞ THEO ĐỘ CAO');

        const saw = (t * 0.22) % 1; // 1 chiều sawtooth: bay lên & giãn nở -> reset
        const cx = 365;
        // Độ cao bay lên (y giảm dần) và bán kính bóng tăng dần
        const cy = 182 - saw * 62;
        const R = 38 + saw * 40; // 38px -> 78px

        ctx.save();
        // Các tầng độ cao tham chiếu bên trái
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(40, 74); ctx.lineTo(545, 74);
        ctx.moveTo(40, 238); ctx.lineTo(545, 238);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#fbbf24';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Tầng cao (~40 km): Áp suất giảm → Bóng giãn tới giới hạn vỡ', 42, 66);
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('Mặt đất (0h & 12h UTC): Thả bóng chứa khí nhẹ hơn không khí', 42, 256);

        // Vỏ bóng thám không hình cầu giãn nở
        const bGrad = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.1, cx, cy, R);
        bGrad.addColorStop(0, 'rgba(224, 242, 254, 0.42)');
        bGrad.addColorStop(0.7, 'rgba(56, 189, 248, 0.22)');
        bGrad.addColorStop(1, 'rgba(14, 165, 233, 0.42)');
        ctx.fillStyle = bGrad;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Các mũi tên vectơ hướng từ tâm ra ép vuông góc vào mặt trong thành bóng
        const numArrows = 8;
        for (let i = 0; i < numArrows; i++) {
            const ang = (i * Math.PI * 2) / numArrows + Math.PI / 8;
            const rInner = Math.max(10, R * 0.28);
            const rOuter = R - 5;
            const x1 = cx + Math.cos(ang) * rInner;
            const y1 = cy + Math.sin(ang) * rInner;
            const x2 = cx + Math.cos(ang) * rOuter;
            const y2 = cy + Math.sin(ang) * rOuter;
            drawArrow(ctx, x1, y1, x2, y2, '#fbbf24', 2.6, 8);
        }

        // Cổ buộc bóng (kích thước cố định)
        const neckY = cy + R;
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(cx - 5, neckY - 2, 10, 7);

        // Dây treo cố định chiều dài 24px
        const cordLen = 24;
        const boxTopY = neckY + 5 + cordLen;
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(cx, neckY + 5);
        ctx.lineTo(cx, boxTopY);
        ctx.stroke();

        // HỘP CẢM BIẾN KÍCH THƯỚC CỐ ĐỊNH TUYỆT ĐỐI (38 x 24 px, KHÔNG PHÓNG TO THEO BÓNG)
        const boxW = 38;
        const boxH = 24;
        drawRoundRect(ctx, cx - boxW / 2, boxTopY, boxW, boxH, 5, '#1e293b', '#10b981', 2.6);
        // Anten phát tín hiệu GPS/vô tuyến cố định
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(cx + 12, boxTopY);
        ctx.lineTo(cx + 12, boxTopY - 10);
        ctx.stroke();
        ctx.fillStyle = '#6ee7b7';
        ctx.font = '800 10.5px "DM Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('GPS', cx, boxTopY + boxH / 2);
        ctx.restore();

        // Chú thích callout chống đè nét đặt bên phải
        drawCallout(ctx, cx + R * 0.72, cy - R * 0.72, 505, 86, ['Vỏ bóng đàn hồi', 'Giãn nở khi áp suất giảm'], '#38bdf8');
        drawCallout(ctx, cx + R - 6, cy, 505, 152, ['Áp suất khí bên trong', 'Đẩy vuông góc thành bóng'], '#fbbf24');
        drawCallout(ctx, cx + boxW / 2, boxTopY + boxH / 2, 505, 222, ['Hộp cảm biến & GPS', 'Đo t, p, độ ẩm, gió'], '#10b981');
    });

    // =========================================================================
    // 2. MH-C2-24: BÓNG THÁM KHÔNG CHỨA KHÍ HYDROGEN (THÔNG SỐ ĐỀ DẪN)
    // =========================================================================
    window.VLXTModels.register('MH-C2-24', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'BÓNG THÁM KHÔNG KHÍ HYDROGEN (H₂) — TỪ MẶT ĐẤT ĐẾN GIỚI HẠN NỔ');

        const saw = (t * 0.22) % 1;
        const cx = 290;
        const cy = 180 - saw * 58;
        const R = 36 + saw * 40;

        ctx.save();
        // Bóng thám không chứa H2
        const bGrad = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.25, 6, cx, cy, R);
        bGrad.addColorStop(0, 'rgba(16, 185, 129, 0.38)');
        bGrad.addColorStop(1, 'rgba(56, 189, 248, 0.22)');
        ctx.fillStyle = bGrad;
        ctx.strokeStyle = saw > 0.88 ? '#ef4444' : '#38bdf8';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Mũi tên áp suất khí Hydrogen bên trong hướng vuông góc thành bóng
        for (let i = 0; i < 8; i++) {
            const ang = (i * Math.PI * 2) / 8;
            const r1 = Math.max(10, R * 0.28);
            const r2 = R - 5;
            drawArrow(ctx, cx + Math.cos(ang) * r1, cy + Math.sin(ang) * r1, cx + Math.cos(ang) * r2, cy + Math.sin(ang) * r2, '#34d399', 2.5, 7.5);
        }

        // Cổ buộc & dây treo & hộp cảm biến kích thước cố định (38 x 24 px)
        const neckY = cy + R;
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(cx - 5, neckY - 2, 10, 7);
        const boxTopY = neckY + 26;
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(cx, neckY + 5);
        ctx.lineTo(cx, boxTopY);
        ctx.stroke();

        const boxW = 38, boxH = 24;
        drawRoundRect(ctx, cx - boxW / 2, boxTopY, boxW, boxH, 5, '#1e293b', '#38bdf8', 2.6);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 10.5px "DM Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('SENSOR', cx, boxTopY + boxH / 2);

        // 2 Thẻ thông số đề dẫn bên phải (Zero Data Leakage)
        drawRoundRect(ctx, 435, 58, 320, 104, 10, '#0f172a', '#38bdf8', 2);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('TRẠNG THÁI THẢ BÓNG (MẶT ĐẤT)', 452, 82);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Thể tích ban đầu: V = 15,8 m³', 452, 108);
        ctx.fillText('• Áp suất: p = 105 000 Pa | t = 27°C', 452, 132);
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('• ĐKTC (0°C; 101300 Pa): ρ = 0,09 kg/m³', 452, 152);

        drawRoundRect(ctx, 435, 178, 320, 96, 10, '#0f172a', '#f87171', 2);
        ctx.fillStyle = '#fca5a5';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('GIỚI HẠN BỊ NỔ Ở ĐỘ CAO LỚN', 452, 202);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Thể tích giới hạn nổ: V = 39,5 m³', 452, 228);
        ctx.fillText('• Áp suất khi nổ: p = 27 640 Pa', 452, 252);

        // Callout trỏ từ bóng sang 2 thẻ thông số
        drawCallout(ctx, cx + boxW / 2, boxTopY + 12, 48, 228, ['Cảm biến cố định', 'Khí Hydrogen (H₂)'], '#10b981');
        ctx.restore();
    });

    // =========================================================================
    // 3. MH-C2-25: KHINH KHÍ CẦU CÓ LỖ HỞ PHÍA DƯỚI
    // Ràng buộc riêng:
    // - Phải vẽ trực tiếp 3 vectơ lực: lực đẩy Archimedes F_A hướng lên,
    //   trọng lực vỏ P và trọng lực khí P_khí hướng xuống.
    // - Bắt buộc dùng hàm drawSubText để hiển thị chỉ số dưới chuẩn xác
    //   (F_A, P_khí), tuyệt đối KHÔNG viết dấu gạch dưới kiểu "F_A" hay "P_khi".
    // =========================================================================
    window.VLXTModels.register('MH-C2-25', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'KHINH KHÍ CẦU HỞ ĐÁY (V = 1,15 m³; m = 0,2 kg; t₁ = 20°C)');

        const bob = Math.sin(t * 2.6) * 3;
        const cx = 270;
        const cy = 132 + bob;

        ctx.save();
        // Quả khí cầu có lỗ hở phía dưới
        const bGrad = ctx.createRadialGradient(cx - 20, cy - 22, 10, cx, cy, 72);
        bGrad.addColorStop(0, 'rgba(251, 146, 60, 0.55)');
        bGrad.addColorStop(0.65, 'rgba(239, 68, 68, 0.32)');
        bGrad.addColorStop(1, 'rgba(56, 189, 248, 0.25)');

        ctx.fillStyle = bGrad;
        ctx.strokeStyle = '#fb923c';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(cx - 16, cy + 68);
        ctx.bezierCurveTo(cx - 78, cy + 32, cx - 76, cy - 68, cx, cy - 68);
        ctx.bezierCurveTo(cx + 76, cy - 68, cx + 78, cy + 32, cx + 16, cy + 68);
        // Lỗ hở phía dưới không vẽ nét đóng ngang
        ctx.stroke();
        ctx.fill();

        // Miệng lỗ hở phía dưới
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx - 16, cy + 68);
        ctx.lineTo(cx - 16, cy + 76);
        ctx.moveTo(cx + 16, cy + 68);
        ctx.lineTo(cx + 16, cy + 76);
        ctx.stroke();

        // Ngọn lửa đốt nóng tại miệng lỗ hở
        const flameH = 12 + Math.sin(t * 14) * 3;
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.moveTo(cx - 7, cy + 76);
        ctx.quadraticCurveTo(cx, cy + 76 - flameH * 1.6, cx + 7, cy + 76);
        ctx.closePath();
        ctx.fill();

        // Dây treo & giỏ/bộ đốt nóng phía dưới
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(cx - 14, cy + 74); ctx.lineTo(cx - 12, cy + 94);
        ctx.moveTo(cx + 14, cy + 74); ctx.lineTo(cx + 12, cy + 94);
        ctx.stroke();
        drawRoundRect(ctx, cx - 15, cy + 94, 30, 18, 4, '#334155', '#cbd5e1', 2.2);

        // Tâm đặt lực O
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
        ctx.fill();

        // 1. Vectơ lực đẩy Archimedes F_A hướng lên
        drawArrow(ctx, cx, cy, cx, cy - 92, '#10b981', 3.4, 10);
        // Ký hiệu vectơ mũi tên trên đầu chữ F_A
        drawRoundRect(ctx, cx + 10, cy - 95, 44, 26, 6, '#0f172a', '#10b981', 1.6);
        drawSubText(ctx, 'F', 'A', cx + 32, cy - 77, { fontSize: 15, italic: true, color: '#6ee7b7', align: 'center' });
        drawArrow(ctx, cx + 21, cy - 91, cx + 33, cy - 91, '#6ee7b7', 1.6, 4);

        // 2. Vectơ trọng lực vỏ P hướng xuống (lệch trái nhẹ 7px cho tách bạch 2 mũi tên)
        drawArrow(ctx, cx - 7, cy, cx - 7, cy + 72, '#38bdf8', 3.2, 9);
        drawRoundRect(ctx, cx - 54, cy + 44, 38, 25, 6, '#0f172a', '#38bdf8', 1.6);
        drawSubText(ctx, 'P', '', cx - 35, cy + 61, { fontSize: 15, italic: true, color: '#7dd3fc', align: 'center' });
        drawArrow(ctx, cx - 41, cy + 48, cx - 29, cy + 48, '#7dd3fc', 1.6, 4);

        // 3. Vectơ trọng lực khí P_khí hướng xuống (lệch phải nhẹ 7px)
        drawArrow(ctx, cx + 7, cy, cx + 7, cy + 86, '#f87171', 3.2, 9);
        drawRoundRect(ctx, cx + 18, cy + 56, 56, 26, 6, '#0f172a', '#f87171', 1.6);
        drawSubText(ctx, 'P', 'khí', cx + 46, cy + 73, { fontSize: 15, italic: true, color: '#fca5a5', align: 'center' });
        drawArrow(ctx, cx + 30, cy + 59, cx + 42, cy + 59, '#fca5a5', 1.6, 4);

        // Chú thích lỗ hở phía dưới
        drawCallout(ctx, cx - 16, cy + 73, 44, 232, ['Lỗ hở thông khí quyển', 'Áp suất trong = p₁'], '#38bdf8');

        // Bảng thông số đề dẫn bên phải
        drawRoundRect(ctx, 435, 62, 320, 198, 10, '#0f172a', '#fb923c', 2);
        ctx.fillStyle = '#fb923c';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('THÔNG SỐ KHINH KHÍ CẦU', 452, 88);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Thể tích không đổi: V = 1,15 m³', 452, 116);
        ctx.fillText('• Khối lượng vỏ & bộ đốt: m = 0,2 kg', 452, 142);
        ctx.fillText('• Mặt đất: t₁ = 20°C; p₁ = 1,013·10⁵ Pa', 452, 168);
        ctx.fillText('• Khối lượng riêng KK: ρ₀ = 1,2 kg/m³', 452, 194);
        ctx.fillText('• Gia tốc trọng trường: g = 10 m/s²', 452, 220);
        ctx.fillStyle = '#6ee7b7';
        ctx.fillText('• Điều kiện bay lên: F_A > P + P_khí'.replace('F_A', 'Lực nâng').replace('P + P_khí', 'Tổng trọng lực'), 452, 244);
        ctx.restore();
    });

    // =========================================================================
    // 4. MH-C2-26: KHINH KHÍ CẦU LỄ HỘI HUẾ (V = 336 m³, m = 84 kg, 27°C, 1 atm)
    // =========================================================================
    window.VLXTModels.register('MH-C2-26', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'LỄ HỘI KHINH KHÍ CẦU HUẾ (V = 336 m³; m = 84 kg; 27°C; 1 atm)');

        const bob = Math.sin(t * 2.4) * 3.5;
        const cx = 250;
        const cy = 128 + bob;

        ctx.save();
        // Vỏ khinh khí cầu sọc màu lễ hội
        const bGrad = ctx.createRadialGradient(cx - 22, cy - 22, 10, cx, cy, 74);
        bGrad.addColorStop(0, 'rgba(250, 204, 21, 0.55)');
        bGrad.addColorStop(0.5, 'rgba(249, 115, 22, 0.38)');
        bGrad.addColorStop(1, 'rgba(225, 29, 72, 0.32)');
        ctx.fillStyle = bGrad;
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(cx - 18, cy + 68);
        ctx.bezierCurveTo(cx - 82, cy + 30, cx - 78, cy - 66, cx, cy - 66);
        ctx.bezierCurveTo(cx + 78, cy - 66, cx + 82, cy + 30, cx + 18, cy + 68);
        ctx.stroke();
        ctx.fill();

        // Các múi kinh tuyến trang trí lễ hội
        ctx.strokeStyle = 'rgba(254, 240, 138, 0.45)';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(cx - 9, cy + 68);
        ctx.bezierCurveTo(cx - 42, cy + 20, cx - 40, cy - 55, cx, cy - 66);
        ctx.moveTo(cx + 9, cy + 68);
        ctx.bezierCurveTo(cx + 42, cy + 20, cx + 40, cy - 55, cx, cy - 66);
        ctx.stroke();

        // Ngọn lửa đốt nóng không khí bên trong
        const flame = 14 + Math.sin(t * 15) * 4;
        ctx.fillStyle = '#fb923c';
        ctx.beginPath();
        ctx.moveTo(cx - 8, cy + 78);
        ctx.quadraticCurveTo(cx, cy + 78 - flame * 1.7, cx + 8, cy + 78);
        ctx.closePath();
        ctx.fill();

        // Dây cáp & Giỏ mây chở khách
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(cx - 16, cy + 70); ctx.lineTo(cx - 14, cy + 96);
        ctx.moveTo(cx + 16, cy + 70); ctx.lineTo(cx + 14, cy + 96);
        ctx.stroke();
        drawRoundRect(ctx, cx - 18, cy + 96, 36, 22, 5, '#78350f', '#fbbf24', 2.4);

        // 2 Vectơ lực F_A (hướng lên) và tổng trọng lực P (hướng xuống)
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath(); ctx.arc(cx, cy, 4.5, 0, Math.PI * 2); ctx.fill();

        drawArrow(ctx, cx, cy, cx, cy - 88, '#10b981', 3.4, 10);
        drawRoundRect(ctx, cx + 12, cy - 92, 46, 26, 6, '#0f172a', '#10b981', 1.6);
        drawSubText(ctx, 'F', 'A', cx + 35, cy - 74, { fontSize: 15, italic: true, color: '#6ee7b7', align: 'center' });
        drawArrow(ctx, cx + 23, cy - 88, cx + 35, cy - 88, '#6ee7b7', 1.6, 4);

        drawArrow(ctx, cx, cy, cx, cy + 84, '#f87171', 3.4, 10);
        drawRoundRect(ctx, cx + 12, cy + 48, 42, 26, 6, '#0f172a', '#f87171', 1.6);
        drawSubText(ctx, 'P', '', cx + 33, cy + 66, { fontSize: 15, italic: true, color: '#fca5a5', align: 'center' });
        drawArrow(ctx, cx + 26, cy + 52, cx + 38, cy + 52, '#fca5a5', 1.6, 4);

        // Thẻ thông số đề dẫn bên phải
        drawRoundRect(ctx, 415, 62, 340, 198, 10, '#0f172a', '#facc15', 2);
        ctx.fillStyle = '#facc15';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('THÔNG SỐ KHINH KHÍ CẦU LỄ HỘI HUẾ', 432, 88);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Thể tích khí cầu: V = 336 m³', 432, 116);
        ctx.fillText('• Khối lượng vỏ: m = 84 kg', 432, 142);
        ctx.fillText('• Môi trường: t = 27°C; p = 1 atm', 432, 168);
        ctx.fillText('  (1 atm = 1,013·10⁵ Pa)', 432, 192);
        ctx.fillText('• Khối lượng mol: M = 20·10⁻³ kg/mol', 432, 218);
        ctx.fillStyle = '#fb923c';
        ctx.fillText('• Đốt nóng khí bên trong để tạo lực nâng', 432, 244);
        ctx.restore();
    });

    // =========================================================================
    // 5. MH-C2-27: BỘ THÍ NGHIỆM KIỂM CHỨNG ĐỊNH LUẬT BOYLE (p - V)
    // Ràng buộc riêng:
    // - Ống dẫn từ đầu trái xilanh lên chân áp kế phải nối thông liền mạch
    //   (xóa vách ngăn tại chỗ nối).
    // - Đầu dò cảm biến nhiệt độ 23,5°C phải vẽ rõ ràng cắm xuyên vào bên trong
    //   ống dẫn khí.
    // =========================================================================
    window.VLXTModels.register('MH-C2-27', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'THÍ NGHIỆM KIỂM CHỨNG ĐỊNH LUẬT BOYLE (ĐẲNG NHIỆT t = 23,5°C)');

        // Nén khí 1 chiều sawtooth: V giảm từ 22 -> 14 cm³, p tăng tương ứng
        const saw = (t * 0.22) % 1;
        const cylX = 210, cylY = 165, cylW = 285, cylH = 74;
        const pistonX = cylX + 225 - saw * 95; // dịch chuyển sang trái nén khí

        ctx.save();
        // Đế đỡ bộ thí nghiệm
        drawRoundRect(ctx, 130, 246, 445, 16, 4, '#334155', '#64748b', 2);
        drawRoundRect(ctx, 185, 226, 28, 22, 3, '#475569', '#94a3b8', 2);
        drawRoundRect(ctx, 480, 155, 16, 93, 3, '#475569', '#94a3b8', 2);

        // Vùng khí bị nén bên trong xilanh & ống dẫn (tô màu chung liền mạch)
        const gasAlpha = 0.22 + saw * 0.26;
        ctx.fillStyle = `rgba(56, 189, 248, ${gasAlpha.toFixed(2)})`;
        // Ruột xilanh
        ctx.fillRect(cylX, cylY + 2, pistonX - cylX, cylH - 4);
        // Ruột ống dẫn chữ L nối thông liền mạch từ đầu trái xilanh lên chân áp kế
        ctx.fillRect(142, 108, 16, 102);
        ctx.fillRect(142, 194, cylX - 140, 16);

        // Vẽ viền ngoài xilanh + ống dẫn chữ L LIỀN MẠCH (không vẽ nét cắt tại chỗ nối)
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 3.2;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        // Từ chân áp kế bên trái xuống góc khuỷu rồi sang thành dưới xilanh
        ctx.moveTo(142, 108);
        ctx.lineTo(142, 210);
        ctx.lineTo(210, 210);
        ctx.lineTo(210, cylY + cylH);
        ctx.lineTo(cylX + cylW, cylY + cylH);
        // Từ chân áp kế bên phải xuống góc trong rồi sang thành trên xilanh
        ctx.moveTo(158, 108);
        ctx.lineTo(158, 194);
        ctx.lineTo(210, 194);
        ctx.lineTo(210, cylY);
        ctx.lineTo(cylX + cylW, cylY);
        ctx.stroke();

        // Vạch chia thể tích V trên thân xilanh
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.8;
        for (let i = 1; i <= 7; i++) {
            const vx = cylX + i * 32;
            ctx.beginPath();
            ctx.moveTo(vx, cylY + cylH);
            ctx.lineTo(vx, cylY + cylH - 12);
            ctx.stroke();
        }

        // Pít-tông & Trục vít tay quay bên phải
        drawRoundRect(ctx, pistonX, cylY + 3, 18, cylH - 6, 3, '#94a3b8', '#f8fafc', 2.2);
        // Trục vít nối tay quay
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(pistonX + 18, cylY + cylH / 2);
        ctx.lineTo(568, cylY + cylH / 2);
        ctx.stroke();
        // Tay quay chữ Z
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        ctx.moveTo(568, cylY + cylH / 2);
        ctx.lineTo(568, cylY + cylH / 2 - 44);
        ctx.lineTo(598, cylY + cylH / 2 - 44);
        ctx.stroke();
        drawRoundRect(ctx, 594, cylY + cylH / 2 - 52, 16, 16, 4, '#0284c7', '#f8fafc', 2);

        // Áp kế gắn trên đầu ống dẫn (x = 150, y = 78)
        const needleAng = Math.PI * 0.85 + saw * Math.PI * 0.85;
        drawPressureGauge(ctx, 150, 74, 34, needleAng, 'bar', '', '#38bdf8');

        // ĐẦU DÒ CẢM BIẾN NHIỆT ĐỘ 23,5°C CẮM XUYÊN VÀO BÊN TRONG ỐNG DẪN KHÍ
        const probeY = 142;
        // Dây dẫn từ hộp hiển thị tới ống
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(232, 134);
        ctx.bezierCurveTo(205, 134, 195, probeY, 174, probeY);
        ctx.stroke();
        // Thân đầu dò kim loại cắm xuyên qua thành phải ống (x=158) vào sâu lòng ống (x=147)
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(160, probeY - 3, 14, 6); // gioăng cao su trên thành ống
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(172, probeY);
        ctx.lineTo(147, probeY); // đầu dò nằm rõ ràng bên trong lòng ống dẫn khí!
        ctx.stroke();
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath(); ctx.arc(147, probeY, 3, 0, Math.PI * 2); ctx.fill();

        // Hộp hiển thị nhiệt kế số 23,5°C
        drawRoundRect(ctx, 232, 114, 108, 36, 7, '#0f172a', '#10b981', 2.2);
        ctx.fillStyle = '#6ee7b7';
        ctx.font = '800 17px "DM Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('23.5°C', 286, 132);
        ctx.restore();

        // Nhãn callout rõ ràng
        drawCallout(ctx, 116, 74, 18, 52, ['Áp kế (bar)', 'Đo áp suất khí'], '#38bdf8');
        drawCallout(ctx, 340, 128, 375, 102, ['Cảm biến nhiệt độ', 'Đầu dò cắm trong ống'], '#10b981');
        drawCallout(ctx, 365, 165, 485, 58, ['Xilanh chứa khí', 'Dịch chuyển chậm pít-tông'], '#cbd5e1');
        drawCallout(ctx, 598, 152, 622, 132, ['Tay quay nén khí', 'Thay đổi thể tích V'], '#38bdf8');
    });

    // =========================================================================
    // 6. MH-C2-28: THÍ NGHIỆM KHẢO SÁT ÁP SUẤT THEO NHIỆT ĐỘ ĐẲNG TÍCH
    // Ràng buộc riêng:
    // (1) Cổ bình cầu và bụng bình cầu phải thông nhau liền mạch (không nét cắt).
    // (2) Nước trong chậu phải tràn sát 100% hai thành bên của cốc (không hở).
    // (3) Ống dẫn khí chữ L phải ĐÂM XUYÊN QUA nút cao su màu cam vào tận bên
    //     trong bình cầu và đầu kia nối thông kín khít vào chân áp kế.
    // =========================================================================
    window.VLXTModels.register('MH-C2-28', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'KHẢO SÁT ÁP SUẤT THEO NHIỆT ĐỘ ĐẲNG TÍCH (V = 1 lít)');

        const saw = (t * 0.2) % 1; // Tăng nhiệt độ 1 chiều -> reset
        const cupX = 165, cupY = 104, cupW = 205, cupH = 148;
        const wallW = 3.5;

        ctx.save();
        // Giá đỡ kiềng 3 chân & Đèn cồn bên dưới chậu nước
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(cupX - 8, cupY + cupH + 2);
        ctx.lineTo(cupX + cupW + 8, cupY + cupH + 2);
        ctx.moveTo(cupX + 12, cupY + cupH + 2);
        ctx.lineTo(cupX - 4, 294);
        ctx.moveTo(cupX + cupW - 12, cupY + cupH + 2);
        ctx.lineTo(cupX + cupW + 4, 294);
        ctx.stroke();

        // Đèn cồn & ngọn lửa đun nóng
        drawRoundRect(ctx, 244, 276, 46, 18, 5, '#334155', '#cbd5e1', 2);
        const fl = 14 + Math.sin(t * 14) * 3;
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(267, 276);
        ctx.quadraticCurveTo(257, 265, 267, 276 - fl);
        ctx.quadraticCurveTo(277, 265, 267, 276);
        ctx.fill();

        // (2) NƯỚC TRONG CHẬU TRÀN SÁT 100% HAI THÀNH BÊN CỦA CỐC (KHÔNG HỞ)
        const waterTop = cupY + 26;
        const waterLeft = cupX + wallW * 0.4;
        const waterRight = cupX + cupW - wallW * 0.4;
        const waterBot = cupY + cupH - wallW * 0.4;
        const wGrad = ctx.createLinearGradient(0, waterTop, 0, waterBot);
        wGrad.addColorStop(0, `rgba(56, 189, 248, ${(0.28 + saw * 0.14).toFixed(2)})`);
        wGrad.addColorStop(1, `rgba(239, 68, 68, ${(0.18 + saw * 0.25).toFixed(2)})`);
        ctx.fillStyle = wGrad;
        ctx.fillRect(waterLeft, waterTop, waterRight - waterLeft, waterBot - waterTop);

        // Mặt thoáng nước
        ctx.strokeStyle = '#7dd3fc';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(waterLeft, waterTop);
        ctx.lineTo(waterRight, waterTop);
        ctx.stroke();

        // Vẽ thành chậu thủy tinh hở miệng trên (U-shape)
        drawOpenCup(ctx, cupX, cupY, cupW, cupH, 0, { wallColor: '#cbd5e1', wallWidth: wallW });

        // (1) BÌNH CẦU THỦY TINH LIỀN MẠCH GIỮA CỔ BÌNH VÀ BỤNG BÌNH (KHÔNG NÉT CẮT NGANG)
        const bx = 285, by = 186, br = 48;
        const neckHalfW = 13;
        const neckTopY = 92;
        const joinAngle = Math.asin(neckHalfW / br); // góc tiếp xúc cổ - bụng bình cầu

        ctx.save();
        // Tạo đường bao liền mạch 1 nét khép kín cho cổ + bụng bình cầu
        ctx.beginPath();
        ctx.moveTo(bx - neckHalfW, neckTopY);
        ctx.lineTo(bx - neckHalfW, by - Math.cos(joinAngle) * br);
        ctx.arc(bx, by, br, -Math.PI / 2 - joinAngle, -Math.PI / 2 + joinAngle, true);
        ctx.lineTo(bx + neckHalfW, neckTopY);
        ctx.closePath();

        // Tô khối khí bên trong bình cầu
        const gGrad = ctx.createRadialGradient(bx - 12, by - 12, 6, bx, by, br);
        gGrad.addColorStop(0, 'rgba(224, 242, 254, 0.42)');
        gGrad.addColorStop(1, `rgba(56, 189, 248, ${(0.26 + saw * 0.22).toFixed(2)})`);
        ctx.fillStyle = gGrad;
        ctx.fill();

        // Viền thủy tinh bình cầu liền mạch (không có bất kỳ nét ngang nào cắt cổ bình)
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(bx - neckHalfW, neckTopY);
        ctx.lineTo(bx - neckHalfW, by - Math.cos(joinAngle) * br);
        ctx.arc(bx, by, br, -Math.PI / 2 - joinAngle, -Math.PI / 2 + joinAngle, true);
        ctx.lineTo(bx + neckHalfW, neckTopY);
        ctx.stroke();
        ctx.restore();

        // Nút cao su màu cam đậy kín cổ bình (y = 88 -> 108)
        drawRoundRect(ctx, bx - neckHalfW + 1, 88, (neckHalfW - 1) * 2, 20, 3, '#f97316', '#fed7aa', 2);

        // (3) ỐNG DẪN KHÍ CHỮ L ĐÂM XUYÊN QUA NÚT CAO SU MÀU CAM VÀO TẬN BÊN TRONG BÌNH CẦU
        //     VÀ ĐẦU KIA NỐI THÔNG KÍN KHÍT VÀO CHÂN ÁP KẾ
        const tubeInnerX1 = bx - 4, tubeInnerX2 = bx + 4;
        const tubeTipY = 128; // đầu ống đâm xuyên qua đáy nút cao su (y=108) sâu vào lòng bình cầu!
        const tubeTopY1 = 56, tubeTopY2 = 64;
        const tubeRightX1 = 428, tubeRightX2 = 436;
        const tubeBotY1 = 216, tubeBotY2 = 224;
        const gaugeStemX = 492; // tâm trụ chân áp kế

        ctx.save();
        // Lòng ống dẫn khí nối thông kín khít vào chân áp kế
        ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.beginPath();
        ctx.moveTo(tubeInnerX1, tubeTipY);
        ctx.lineTo(tubeInnerX1, tubeTopY1);
        ctx.lineTo(tubeRightX2, tubeTopY1);
        ctx.lineTo(tubeRightX2, tubeBotY1);
        ctx.lineTo(gaugeStemX, tubeBotY1);
        ctx.lineTo(gaugeStemX, tubeBotY2);
        ctx.lineTo(tubeRightX1, tubeBotY2);
        ctx.lineTo(tubeRightX1, tubeTopY2);
        ctx.lineTo(tubeInnerX2, tubeTopY2);
        ctx.lineTo(tubeInnerX2, tubeTipY);
        ctx.closePath();
        ctx.fill();

        // Thành ống dẫn khí chữ L kép sắc nét
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2.6;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(tubeInnerX1, tubeTipY);
        ctx.lineTo(tubeInnerX1, tubeTopY1);
        ctx.lineTo(tubeRightX2, tubeTopY1);
        ctx.lineTo(tubeRightX2, tubeBotY1);
        ctx.lineTo(gaugeStemX, tubeBotY1);
        ctx.moveTo(tubeInnerX2, tubeTipY);
        ctx.lineTo(tubeInnerX2, tubeTopY2);
        ctx.lineTo(tubeRightX1, tubeTopY2);
        ctx.lineTo(tubeRightX1, tubeBotY2);
        ctx.lineTo(gaugeStemX, tubeBotY2);
        ctx.stroke();
        ctx.restore();

        // Nhiệt kế cắm trong bình nước bên trái bình cầu
        drawThermometer(ctx, 198, 54, 212, 7.5, 0.32 + saw * 0.55, '#ef4444', '');

        // Áp kế & Chân đế bên phải (ống dẫn cắm kín khít vào trụ đứng của áp kế)
        drawRoundRect(ctx, 464, 240, 56, 12, 3, '#64748b', '#cbd5e1', 2);
        drawRoundRect(ctx, gaugeStemX - 7, 174, 14, 66, 3, '#475569', '#cbd5e1', 2.2);
        // Khớp nối ren kín khít tại chân áp kế
        drawRoundRect(ctx, gaugeStemX - 13, 213, 10, 14, 2, '#94a3b8', '#f8fafc', 1.8);
        const needleAng = Math.PI * 0.8 + saw * Math.PI * 0.7;
        drawPressureGauge(ctx, gaugeStemX, 140, 36, needleAng, '10⁵ Pa', '', '#38bdf8');

        // Nhãn callout rõ ràng không đè nét
        drawCallout(ctx, 192, 92, 22, 68, ['Nhiệt kế đo nước', 'Coi t_khí = t_nước'], '#ef4444');
        drawCallout(ctx, 165, 185, 22, 148, ['Chậu nước đun nóng', 'Truyền nhiệt vào bình'], '#38bdf8');
        drawCallout(ctx, 297, 96, 22, 225, ['Nút cao su kín', 'Ống dẫn xuyên qua nút'], '#f97316');
        drawCallout(ctx, 528, 140, 565, 118, ['Áp kế đo áp suất p', 'Nối kín ống dẫn khí'], '#38bdf8');
        drawCallout(ctx, 326, 212, 565, 206, ['Bình cầu chứa 1 lít khí', 'Quá trình đẳng tích'], '#e2e8f0');
    });

    // =========================================================================
    // 7. MH-C2-29: BỘ THÍ NGHIỆM KIỂM CHỨNG PHƯƠNG TRÌNH TRẠNG THÁI KHÍ LÝ TƯỞNG
    // Ràng buộc riêng:
    // - Ống tiêm/xilanh (1) phải có phần đầu ống nhỏ đâm xuyên qua nút cao su
    //   thông vào lòng bình chứa khí.
    // - Ống dẫn nhánh trái nối thông kín khít vào áp kế.
    // - Chỉ đánh số (1) và (2) theo đúng hình gốc, KHÔNG ghi tên giải thích
    //   làm lộ đáp án ý d.
    // =========================================================================
    window.VLXTModels.register('MH-C2-29', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'THÍ NGHIỆM KIỂM CHỨNG PHƯƠNG TRÌNH TRẠNG THÁI KHÍ LÍ TƯỞNG');

        const saw = (t * 0.2) % 1;
        const cupX = 245, cupY = 166, cupW = 285, cupH = 112;
        const wallW = 3.2;

        ctx.save();
        // Nước đun nóng trong chậu tràn sát 2 thành bên của cốc
        const waterTop = cupY + 26;
        ctx.fillStyle = 'rgba(56, 189, 248, 0.34)';
        ctx.fillRect(cupX + wallW * 0.4, waterTop, cupW - wallW * 0.8, cupH - 26 - wallW * 0.4);
        ctx.strokeStyle = '#7dd3fc';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cupX + wallW * 0.4, waterTop);
        ctx.lineTo(cupX + cupW - wallW * 0.4, waterTop);
        ctx.stroke();

        // Thành chậu thủy tinh hở miệng trên
        drawOpenCup(ctx, cupX, cupY, cupW, cupH, 0, { wallColor: '#cbd5e1', wallWidth: wallW });

        // Bình tam giác Erlenmeyer nhúng trong chậu nước (tâm x = 365)
        const fx = 365;
        ctx.beginPath();
        ctx.moveTo(fx - 18, 128);
        ctx.lineTo(fx - 18, 162);
        ctx.lineTo(fx - 64, 256);
        ctx.quadraticCurveTo(fx - 66, 266, fx - 54, 266);
        ctx.lineTo(fx + 54, 266);
        ctx.quadraticCurveTo(fx + 66, 266, fx + 64, 256);
        ctx.lineTo(fx + 18, 162);
        ctx.lineTo(fx + 18, 128);
        ctx.closePath();
        ctx.fillStyle = 'rgba(14, 165, 233, 0.24)';
        ctx.fill();
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Nút cao su đậy kín miệng bình tam giác (y = 118 -> 136)
        drawRoundRect(ctx, fx - 21, 118, 42, 18, 4, '#334155', '#94a3b8', 2.2);

        // Ống dẫn nhánh trái từ cổ bình tam giác nối thông kín khít vào chân áp kế
        const gX = 212, gY = 104, gR = 32;
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(fx - 18, 146);
        ctx.lineTo(gX, 146);
        ctx.lineTo(gX, gY + gR + 10);
        ctx.moveTo(fx - 18, 154);
        ctx.lineTo(gX - 8, 154);
        ctx.lineTo(gX - 8, gY + gR + 10);
        ctx.stroke();
        ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.fillRect(gX - 8, 146, fx - 18 - (gX - 8), 8);
        ctx.fillRect(gX - 8, gY + gR + 10, 8, 146 - (gY + gR + 10));
        // Cổ ren nối kín vào áp kế
        drawRoundRect(ctx, gX - 11, gY + gR - 2, 14, 14, 2, '#64748b', '#cbd5e1', 2);
        drawPressureGauge(ctx, gX - 4, gY, gR, Math.PI * 0.8 + saw * Math.PI * 0.65, '', '', '#f59e0b');

        // DỤNG CỤ (1): XILANH CÓ ĐẦU ỐNG NHỎ ĐÂM XUYÊN QUA NÚT CAO SU VÀO LÒNG BÌNH KHÍ
        const syX = fx, syTop = 44, syBot = 108, syW = 24;
        // Đầu kim/ống nhỏ đâm xuyên qua nút cao su (y=118..136) vào sâu trong lòng bình (y=152)
        ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.fillRect(syX - 3, syBot, 6, 44);
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 2.4;
        ctx.strokeRect(syX - 3, syBot, 6, 44);

        // Thân xilanh (1)
        drawRoundRect(ctx, syX - syW / 2, syTop, syW, syBot - syTop, 3, 'rgba(15, 23, 42, 0.85)', '#cbd5e1', 2.6);
        // Vạch chia thể tích
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.4;
        for (let yy = syTop + 12; yy < syBot - 8; yy += 9) {
            ctx.beginPath(); ctx.moveTo(syX - syW / 2, yy); ctx.lineTo(syX - 3, yy); ctx.stroke();
        }
        // Pít-tông bên trong xilanh (1)
        const pisY = syTop + 26 + saw * 18;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(syX - syW / 2 + 2, pisY, syW - 4, 8);
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(syX, pisY);
        ctx.lineTo(syX, syTop - 16);
        ctx.moveTo(syX - 11, syTop - 16);
        ctx.lineTo(syX + 11, syTop - 16);
        ctx.stroke();

        // DỤNG CỤ (2): CẮM TRONG NƯỚC ĐUN NÓNG BÊN PHẢI BÌNH TAM GIÁC
        drawThermometer(ctx, 466, 98, 224, 6.5, 0.35 + saw * 0.5, '#ef4444', '');

        // Nhãn chỉ đánh số (1) và (2) theo đúng hình gốc (TUYỆT ĐỐI KHÔNG GHI TÊN GIẢI THÍCH)
        function drawCircleNum(nx, ny, tx, ty, numStr) {
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(tx, ty);
            ctx.lineTo(nx, ny);
            ctx.stroke();
            ctx.fillStyle = '#0f172a';
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.arc(nx, ny, 16, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#6ee7b7';
            ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(numStr, nx, ny);
        }

        drawCircleNum(448, 66, syX + syW / 2, 74, '1');
        drawCircleNum(564, 114, 474, 128, '2');

        // Nhãn các bộ phận còn lại đúng hình gốc
        drawCallout(ctx, gX - 36, gY, 58, 86, ['Áp kế'], '#f59e0b');
        drawCallout(ctx, fx + 34, 195, 565, 186, ['Bình chứa khí'], '#38bdf8');
        ctx.fillStyle = '#f87171';
        ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Nước đun nóng', 462, 248);
        ctx.restore();
    });

    // =========================================================================
    // 8. MH-C2-30: BÌNH CẦU A (3,5 LÍT) TRONG BÌNH NƯỚC B + ÁP KẾ THỦY NGÂN CHỮ U
    // =========================================================================
    window.VLXTModels.register('MH-C2-30', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'BÌNH CẦU A (3,5 lít) TRONG BÌNH NƯỚC B & ÁP KẾ THỦY NGÂN CHỮ U');

        const saw = (t * 0.2) % 1;
        const dhShift = saw * 26; // mực thủy ngân nhánh phải dâng lên theo nhiệt độ

        ctx.save();
        // 1. Bình nước B (OpenCup) bên trái
        const bx = 86, by = 114, bw = 188, bh = 152;
        const wallW = 3.2;
        ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.fillRect(bx + wallW * 0.4, by + 22, bw - wallW * 0.8, bh - 22 - wallW * 0.4);
        ctx.strokeStyle = '#7dd3fc';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bx + wallW * 0.4, by + 22);
        ctx.lineTo(bx + bw - wallW * 0.4, by + 22);
        ctx.stroke();
        drawOpenCup(ctx, bx, by, bw, bh, 0, { wallColor: '#cbd5e1', wallWidth: wallW });

        // Dây nung điện trở R (~220V) ở góc dưới phải bình nước B
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(bx + bw, 232);
        ctx.lineTo(bx + bw - 34, 232);
        ctx.arc(bx + bw - 34, 240, 8, -Math.PI / 2, Math.PI / 2, true);
        ctx.lineTo(bx + bw, 248);
        ctx.stroke();
        ctx.fillStyle = '#fca5a5';
        ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('R (~220V)', bx + bw + 8, 244);

        // Bình cầu A (3,5 lít) đặt trong bình nước B (cổ bình liền mạch)
        const ax = 158, ay = 198, ar = 46;
        const nHalf = 12, nTop = 98;
        const jAng = Math.asin(nHalf / ar);
        ctx.beginPath();
        ctx.moveTo(ax - nHalf, nTop);
        ctx.lineTo(ax - nHalf, ay - Math.cos(jAng) * ar);
        ctx.arc(ax, ay, ar, -Math.PI / 2 - jAng, -Math.PI / 2 + jAng, true);
        ctx.lineTo(ax + nHalf, nTop);
        ctx.closePath();
        ctx.fillStyle = 'rgba(224, 242, 254, 0.36)';
        ctx.fill();
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 2.8;
        ctx.stroke();

        // Nút cao su đậy bình A
        drawRoundRect(ctx, ax - nHalf + 1, 96, (nHalf - 1) * 2, 18, 3, '#334155', '#94a3b8', 2);

        // Nhiệt kế T đâm xuyên nút cao su vào lòng bình A
        drawThermometer(ctx, ax - 5, 58, 172, 4.5, 0.35 + saw * 0.45, '#ef4444', '');
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('T', ax - 15, 76);
        ctx.fillText('A (3,5 l)', ax - 4, 204);
        ctx.fillText('B', bx - 8, 148);

        // 2. Áp kế thủy ngân chữ U bên phải
        const uLeftX = 432, uRightX = 566, uTopY = 82, uBotY = 266;
        // Bảng chia độ sau nhánh phải
        drawRoundRect(ctx, uRightX - 16, 46, 56, 204, 5, '#1e293b', '#64748b', 1.8);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.4;
        for (let yy = 62; yy <= 222; yy += 16) {
            ctx.beginPath(); ctx.moveTo(uRightX + 6, yy); ctx.lineTo(uRightX + 16, yy); ctx.stroke();
        }
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '700 12px "DM Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText('0', uRightX + 19, 178);
        ctx.fillText('Δh', uRightX + 19, 134);

        // Ống thủy tinh chữ U & Ống dẫn nối từ bình A sang nhánh trái áp kế
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        // Ống dẫn khí từ bình A (x = ax + 4, y = 122) sang nhánh trái chữ U
        ctx.moveTo(ax + 4, 122);
        ctx.lineTo(ax + 4, 66);
        ctx.lineTo(uLeftX, 66);
        ctx.lineTo(uLeftX, uBotY);
        ctx.arc((uLeftX + uRightX) / 2, uBotY, (uRightX - uLeftX) / 2, Math.PI, 0, true);
        ctx.lineTo(uRightX, uTopY);
        ctx.stroke();

        // Cột thủy ngân đỏ trong ống chữ U (nhánh trái giữ mức 0 ở y=174, nhánh phải dâng cao tạo Δh)
        const hgLeftY = 174;
        const hgRightY = 132 - dhShift;
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 8;
        ctx.lineCap = 'butt';
        ctx.beginPath();
        ctx.moveTo(uLeftX, hgLeftY);
        ctx.lineTo(uLeftX, uBotY);
        ctx.arc((uLeftX + uRightX) / 2, uBotY, (uRightX - uLeftX) / 2, Math.PI, 0, true);
        ctx.lineTo(uRightX, hgRightY);
        ctx.stroke();

        // Đường gióng chỉ độ chênh lệch Δh
        ctx.strokeStyle = '#fbbf24';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(uLeftX, hgLeftY); ctx.lineTo(uRightX, hgLeftY);
        ctx.stroke();
        ctx.setLineDash([]);
        drawArrow(ctx, uRightX - 24, hgLeftY, uRightX - 24, hgRightY, '#fbbf24', 2.2, 6);
        drawArrow(ctx, uRightX - 24, hgRightY, uRightX - 24, hgLeftY, '#fbbf24', 2.2, 6);

        // Nhãn p0 = 760 mmHg thông khí quyển ở nhánh phải
        drawCallout(ctx, uRightX, uTopY, 615, 68, ['Nhánh phải hở', 'p₀ = 760 mmHg'], '#38bdf8');
        drawCallout(ctx, uRightX - 24, (hgLeftY + hgRightY) / 2, 615, 146, ['Chênh lệch thủy ngân Δh', 'p = p₀ + Δh'], '#fbbf24');
        drawCallout(ctx, 295, 66, 300, 128, ['Ống dẫn khí nhỏ', 'Thể tích khí V = 3,5 l'], '#cbd5e1');
        ctx.restore();
    });

    // =========================================================================
    // 9. MH-C2-31: HỆ THỐNG TÚI KHÍ AN TOÀN Ô TÔ (V = 60 LÍT, 25°C, p_max = 5 PSI)
    // =========================================================================
    window.VLXTModels.register('MH-C2-31', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'HỆ THỐNG TÚI KHÍ AN TOÀN Ô TÔ (KHÍ N₂ · V = 60 lít · 25°C · p_max = 5 psi)');

        const saw = (t * 0.28) % 1; // Bơm căng túi khí 1 chiều -> reset
        const bagR = 26 + saw * 54;

        ctx.save();
        // 1. Cảm biến va chạm (Crash Sensor) bên trái
        drawRoundRect(ctx, 42, 134, 124, 58, 9, '#0f172a', '#ef4444', 2.6);
        ctx.fillStyle = '#fca5a5';
        ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('CẢM BIẾN', 104, 156);
        ctx.fillText('VA CHẠM', 104, 175);

        // Tín hiệu điện truyền sang bộ kích nổ
        drawArrow(ctx, 168, 163, 232, 163, '#fbbf24', 3.2, 9);
        ctx.fillStyle = '#fbbf24';
        ctx.font = '700 12.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('Tín hiệu', 200, 148);

        // 2. Bộ kích nổ (Inflator) ở giữa
        drawRoundRect(ctx, 236, 126, 118, 74, 10, '#1e293b', '#f97316', 2.8);
        // Lõi phát sáng kích nổ
        const glow = 0.45 + 0.55 * Math.sin(t * 16) ** 2;
        ctx.fillStyle = `rgba(251, 191, 36, ${glow.toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(295, 163, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('BỘ KÍCH NỔ', 295, 112);

        // Luồng khí N2 phun từ bộ kích nổ vào túi khí
        drawArrow(ctx, 356, 163, 405, 163, '#38bdf8', 3.4, 9);

        // 3. Túi khí (Air Bag) phồng lên bên phải
        const bagCX = 412 + bagR * 0.92;
        const bagCY = 163;
        const bGrad = ctx.createRadialGradient(bagCX - bagR * 0.2, bagCY - bagR * 0.2, 8, bagCX, bagCY, bagR);
        bGrad.addColorStop(0, 'rgba(248, 250, 252, 0.55)');
        bGrad.addColorStop(1, 'rgba(56, 189, 248, 0.32)');
        ctx.fillStyle = bGrad;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.ellipse(bagCX, bagCY, bagR * 0.92, bagR * 1.06, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Các phân tử khí N2 bên trong túi khí
        ctx.fillStyle = '#6ee7b7';
        for (let i = 0; i < 12; i++) {
            const ang = i * 0.55 + t * 2.5;
            const dist = ((i * 17) % 100) / 100 * (bagR * 0.65);
            const px = bagCX + Math.cos(ang) * dist;
            const py = bagCY + Math.sin(ang) * dist;
            ctx.beginPath();
            ctx.arc(px, py, 3, 0, Math.PI * 2);
            ctx.fill();
        }

        // Thẻ thông số đề dẫn góc phải (Zero Data Leakage)
        drawRoundRect(ctx, 575, 68, 185, 184, 10, '#0f172a', '#38bdf8', 2);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('TÚI KHÍ CHUẨN', 590, 94);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Khí bơm: Nitơ (N₂)', 590, 122);
        ctx.fillText('• Thể tích: V ≈ 60 lít', 590, 148);
        ctx.fillText('• Nhiệt độ: t = 25°C', 590, 174);
        ctx.fillText('• Áp suất tối đa:', 590, 200);
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('  p_max = 5 psi'.replace('p_max', '5 psi'), 590, 224);
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('  (1 psi ≈ 6,895 kPa)', 590, 244);
        ctx.restore();
    });

    // =========================================================================
    // 10. MH-C2-32: BÓNG ĐÈN SỢI ĐỐT WOLFRAM CHỨA KHÍ TRƠ ÁP SUẤT THẤP
    // =========================================================================
    window.VLXTModels.register('MH-C2-32', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'BÓNG ĐÈN SỢI ĐỐT WOLFRAM CHỨA KHÍ TRƠ Ở ÁP SUẤT THẤP');

        const glow = 0.55 + 0.45 * Math.sin(t * 3.5) ** 2;
        const cx = 250, cy = 132;

        ctx.save();
        // Vùng ánh sáng tỏa ra quanh bóng đèn
        const halo = ctx.createRadialGradient(cx, cy - 10, 10, cx, cy - 10, 96);
        halo.addColorStop(0, `rgba(254, 240, 138, ${(0.38 * glow).toFixed(2)})`);
        halo.addColorStop(0.6, `rgba(251, 191, 36, ${(0.14 * glow).toFixed(2)})`);
        halo.addColorStop(1, 'rgba(251, 191, 36, 0)');
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(cx, cy - 10, 96, 0, Math.PI * 2);
        ctx.fill();

        // Bầu thủy tinh chịu nhiệt hình quả lê
        ctx.beginPath();
        ctx.moveTo(cx - 26, cy + 68);
        ctx.bezierCurveTo(cx - 34, cy + 36, cx - 64, cy + 16, cx - 64, cy - 22);
        ctx.arc(cx, cy - 22, 64, Math.PI, 0, false);
        ctx.bezierCurveTo(cx + 64, cy + 16, cx + 34, cy + 36, cx + 26, cy + 68);
        ctx.closePath();
        ctx.fillStyle = 'rgba(224, 242, 254, 0.14)';
        ctx.fill();
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Trụ thủy tinh & Hai dây dẫn điện cực lên sợi đốt
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(cx - 8, cy + 68); ctx.lineTo(cx - 20, cy - 18);
        ctx.moveTo(cx + 8, cy + 68); ctx.lineTo(cx + 20, cy - 18);
        ctx.stroke();

        // Dây tóc Wolfram xoắn phát sáng rực
        ctx.strokeStyle = `rgba(254, 240, 138, ${(0.6 + 0.4 * glow).toFixed(2)})`;
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(cx - 20, cy - 18);
        for (let i = 0; i <= 8; i++) {
            const fx = cx - 20 + i * 5;
            const fy = cy - 18 + (i % 2 === 0 ? -5 : 5);
            ctx.lineTo(fx, fy);
        }
        ctx.stroke();

        // Các phân tử khí trơ chuyển động nhiệt bên trong bóng
        ctx.fillStyle = '#38bdf8';
        const pts = [[-32, -32], [30, -36], [-38, -4], [36, -6], [0, -54], [-18, 16], [20, 14]];
        pts.forEach(([dx, dy], idx) => {
            const ox = Math.cos(t * 4 + idx) * 4;
            const oy = Math.sin(t * 4.5 + idx) * 4;
            ctx.beginPath();
            ctx.arc(cx + dx + ox, cy + dy + oy, 3, 0, Math.PI * 2);
            ctx.fill();
        });

        // Đui đèn xoáy kim loại phía dưới
        drawRoundRect(ctx, cx - 24, cy + 68, 48, 34, 4, '#475569', '#cbd5e1', 2.4);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - 24, cy + 79); ctx.lineTo(cx + 24, cy + 79);
        ctx.moveTo(cx - 24, cy + 90); ctx.lineTo(cx + 24, cy + 90);
        ctx.stroke();
        // Cực đáy đui đèn
        drawRoundRect(ctx, cx - 12, cy + 102, 24, 9, 3, '#1e293b', '#94a3b8', 2);

        // Nhãn callout rõ ràng
        drawCallout(ctx, cx - 20, cy - 18, 36, 78, ['Sợi đốt Wolfram', 'Chịu nhiệt độ cao'], '#fbbf24');
        drawCallout(ctx, cx - 64, cy - 22, 36, 152, ['Vỏ thủy tinh chịu nhiệt', 'Thể tích khí không đổi'], '#cbd5e1');
        drawCallout(ctx, cx - 36, cy - 4, 36, 224, ['Khí trơ áp suất thấp', 'Giảm oxi hóa sợi đốt'], '#38bdf8');

        // Thẻ thông số đề dẫn bên phải (Zero Data Leakage)
        drawRoundRect(ctx, 435, 76, 315, 168, 10, '#0f172a', '#fbbf24', 2);
        ctx.fillStyle = '#fbbf24';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('CẤU TẠO & NGUYÊN LÝ ĐÈN SỢI ĐỐT', 452, 102);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Dây tóc: Kim loại Wolfram (W)', 452, 130);
        ctx.fillText('• Vỏ bóng: Thủy tinh chịu nhiệt kín', 452, 156);
        ctx.fillText('• Môi trường trong: Khí trơ áp suất thấp', 452, 182);
        ctx.fillText('• Ứng dụng: Chiếu sáng & kích hoa trái vụ', 452, 208);
        ctx.restore();
    });

    // =========================================================================
    // 11. MH-C2-33: SÚNG PHUN NƯỚC (NGUYÊN LÝ TRUYỀN ÁP SUẤT PASCAL)
    // =========================================================================
    window.VLXTModels.register('MH-C2-33', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'SÚNG PHUN NƯỚC — NGUYÊN LÝ TRUYỀN ÁP SUẤT PASCAL');

        const saw = (t * 0.25) % 1; // Bóp cò đẩy pít-tông sang trái 1 chiều -> reset
        const strokePx = saw * 36;

        ctx.save();
        // Khung thân súng phun nước bao ngoài
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(145, 62);
        ctx.lineTo(545, 62);
        ctx.lineTo(545, 148);
        ctx.lineTo(445, 158);
        ctx.lineTo(445, 224);
        ctx.lineTo(240, 224);
        ctx.lineTo(222, 276);
        ctx.lineTo(135, 276);
        ctx.lineTo(155, 185);
        ctx.lineTo(145, 165);
        ctx.closePath();
        ctx.stroke();

        // Khoang chứa nước chữ U bên trong (nòng trên + ống nối trái + buồng pít-tông dưới)
        const pisX = 335 - strokePx;
        ctx.fillStyle = 'rgba(56, 189, 248, 0.36)';
        // Nòng trên
        ctx.fillRect(175, 76, 355, 42);
        // Ống nối đứng bên trái
        ctx.fillRect(175, 118, 34, 92);
        // Buồng pít-tông dưới (từ x=209 đến pisX)
        ctx.fillRect(209, 164, pisX - 209, 46);

        // Thành buồng nước sắc nét
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        ctx.moveTo(530, 76);
        ctx.lineTo(175, 76);
        ctx.lineTo(175, 210);
        ctx.lineTo(355, 210);
        ctx.moveTo(530, 118);
        ctx.lineTo(209, 118);
        ctx.lineTo(209, 164);
        ctx.lineTo(355, 164);
        ctx.stroke();

        // Vòi phun tiết diện nhỏ S2 = 0,09 cm² ở đầu phải nòng trên
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(530, 74, 16, 18);
        ctx.fillRect(530, 102, 16, 18);

        // Tia nước phun mạnh ra từ vòi phun (1 chiều)
        for (let i = 0; i < 5; i++) {
            const jp = (t * 1.4 + i * 0.2) % 1;
            const jx = 550 + jp * 165;
            drawArrow(ctx, jx, 97, jx + 24, 97, `rgba(56, 189, 248, ${(1 - jp * 0.7).toFixed(2)})`, 2.8, 7);
        }

        // Pít-tông tiết diện S1 = 2,1 cm² & Cò súng
        drawRoundRect(ctx, pisX, 166, 14, 42, 2, '#cbd5e1', '#f8fafc', 2);
        // Thanh nối cò súng
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(pisX + 14, 182, 46, 10);
        // Cò súng
        drawRoundRect(ctx, pisX + 60, 168, 14, 38, 4, '#f59e0b', '#fef08a', 2);

        // Mũi tên lực F = 4,2 N tác dụng vào cò súng
        drawArrow(ctx, pisX + 115, 187, pisX + 77, 187, '#ef4444', 3.2, 8);

        // Nhãn thông số đề dẫn rõ ràng
        drawCallout(ctx, 275, 97, 315, 126, ['Nước truyền nguyên vẹn áp suất'], '#38bdf8');
        drawCallout(ctx, pisX + 7, 164, 248, 242, ['Pít-tông: 2,1 cm² | Dịch chuyển 2,2 cm'], '#cbd5e1');
        drawCallout(ctx, pisX + 96, 187, 468, 232, ['Cò súng: Lực F = 4,2 N'], '#ef4444');
        drawCallout(ctx, 546, 97, 566, 152, ['Vòi phun: 0,09 cm²', 'ρ_nước = 1,0 g/cm³'], '#38bdf8');
        ctx.restore();
    });

    // =========================================================================
    // 12. MH-C2-34: BÌNH TÍCH ÁP MÁY LỌC NƯỚC 12 LÍT (p0 = 120 kPa)
    // =========================================================================
    window.VLXTModels.register('MH-C2-34', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'BÌNH TÍCH ÁP MÁY LỌC NƯỚC (V_bình = 12 lít; p₀ = 120 kPa)');

        // Nước bơm vào bóng trên tăng từ 6 lít -> 9 lít (1 chiều sawtooth)
        const saw = (t * 0.2) % 1;
        const waterRatio = 0.5 + saw * 0.25; // 6/12 -> 9/12
        const tx = 185, ty = 74, tw = 195, th = 198;
        const membraneY = ty + 20 + (th - 40) * waterRatio;

        ctx.save();
        // Vỏ bình tích áp hình trụ bo tròn 2 đầu
        drawRoundRect(ctx, tx, ty, tw, th, 44, '#0f172a', '#cbd5e1', 3.4);

        // Clip bên trong ruột bình tích áp
        ctx.save();
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(tx + 3, ty + 3, tw - 6, th - 6, 41);
        else ctx.rect(tx + 3, ty + 3, tw - 6, th - 6);
        ctx.clip();

        // Phần trên: Bóng chứa nước (màu xanh dương)
        ctx.fillStyle = 'rgba(56, 189, 248, 0.34)';
        ctx.fillRect(tx, ty, tw, membraneY - ty);

        // Phần dưới: Bóng chứa khí nén (màu hổ phách)
        ctx.fillStyle = `rgba(245, 158, 11, ${(0.22 + saw * 0.18).toFixed(2)})`;
        ctx.fillRect(tx, membraneY, tw, ty + th - membraneY);

        // Màng cao su đàn hồi ngăn cách hai bóng
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(tx, membraneY);
        ctx.quadraticCurveTo(tx + tw / 2, membraneY + 8, tx + tw, membraneY);
        ctx.stroke();
        ctx.restore();

        // Nhãn bên trong 2 khoang bóng
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Bóng chứa nước', tx + tw / 2, ty + 54);
        ctx.fillStyle = '#fde68a';
        ctx.fillText('Bóng chứa khí', tx + tw / 2, ty + th - 36);

        // Đường ống nước vào/ra phía trên đỉnh bình
        const pipeX = tx + tw / 2;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(pipeX, ty);
        ctx.lineTo(pipeX, 42);
        ctx.moveTo(pipeX, 52);
        ctx.lineTo(pipeX + 125, 52);
        ctx.stroke();

        // Rơ-le áp suất trên nhánh ống nước vào
        drawRoundRect(ctx, pipeX + 36, 41, 34, 22, 5, '#1e293b', '#10b981', 2.4);
        drawArrow(ctx, pipeX + 120, 52, pipeX + 76, 52, '#38bdf8', 2.4, 6);
        drawArrow(ctx, pipeX, 44, pipeX, 24, '#38bdf8', 2.4, 6);

        // Chân đế bình tích áp
        drawRoundRect(ctx, tx + 28, ty + th, 26, 12, 3, '#475569', '#94a3b8', 2);
        drawRoundRect(ctx, tx + tw - 54, ty + th, 26, 12, 3, '#475569', '#94a3b8', 2);

        // Chú thích callout
        drawCallout(ctx, pipeX, 34, 34, 52, ['Ống nước ra'], '#38bdf8');
        drawCallout(ctx, pipeX + 53, 63, 415, 76, ['Rơ-le áp suất tự động', 'Ngắt ở 9 lít · Đóng ở 6 lít'], '#10b981');

        // Thẻ thông số đề dẫn bên phải (Zero Data Leakage)
        drawRoundRect(ctx, 415, 132, 340, 144, 10, '#0f172a', '#fbbf24', 2);
        ctx.fillStyle = '#fbbf24';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('THÔNG SỐ BÌNH TÍCH ÁP (T = const)', 432, 156);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Dung tích toàn bình: V = 12 lít', 432, 182);
        ctx.fillText('• Khi chưa có nước: V_khí = 12 lít, p₀ = 120 kPa', 432, 206);
        ctx.fillText('• Bơm đầy 9 lít nước → Rơ-le ngắt điện', 432, 230);
        ctx.fillText('• Xả còn 6 lít nước → Công tắc đóng lại', 432, 254);
        ctx.restore();
    });

    // =========================================================================
    // 13. MH-C2-35: BƠM TAY XE ĐẠP 2 TRẠNG THÁI (KÉO LÊN & ĐẨY XUỐNG)
    // =========================================================================
    window.VLXTModels.register('MH-C2-35', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'BƠM TAY XE ĐẠP 2 TRẠNG THÁI (H = 50 cm; p₀ = 10⁵ Pa; 27°C)');

        const saw = (t * 0.25) % 1; // 1 chiều sawtooth

        // --- TRẠNG THÁI 1 (TRÁI): KÉO TAY BƠM LÊN (VAN VÀO MỞ, VAN RA ĐÓNG) ---
        const c1x = 135, c1y = 115, cw = 84, ch = 135;
        const pis1Y = c1y + 82 - saw * 54; // kéo lên

        ctx.save();
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('1. KÉO TAY BƠM LÊN', c1x + cw / 2, 64);

        // Thân xilanh bơm 1 (có lỗ hút trên trái & ống ra dưới phải)
        ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
        ctx.fillRect(c1x, pis1Y + 12, cw, c1y + ch - (pis1Y + 12));

        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 3;
        ctx.beginPath();
        // Thành trái (chừa lỗ van đầu vào ở y=132..148)
        ctx.moveTo(c1x, c1y); ctx.lineTo(c1x, 130);
        ctx.moveTo(c1x, 150); ctx.lineTo(c1x, c1y + ch);
        // Đáy & ống đầu ra phải
        ctx.lineTo(c1x + cw, c1y + ch);
        ctx.moveTo(c1x + cw, c1y); ctx.lineTo(c1x + cw, c1y + ch - 26);
        // Ống ra ngang
        ctx.moveTo(c1x + cw, c1y + ch - 26); ctx.lineTo(c1x + cw + 42, c1y + ch - 26);
        ctx.moveTo(c1x + cw, c1y + ch); ctx.lineTo(c1x + cw + 42, c1y + ch);
        ctx.stroke();

        // Van đầu vào MỞ (bản lề mở vào trong)
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(c1x, 130);
        ctx.lineTo(c1x + 12, 146);
        ctx.stroke();

        // Van đầu ra ĐÓNG (chắn kín cổ ống ra)
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(c1x + cw, c1y + ch - 26);
        ctx.lineTo(c1x + cw, c1y + ch);
        ctx.stroke();

        // Pít-tông & Tay bơm kéo lên
        drawRoundRect(ctx, c1x + 3, pis1Y, cw - 6, 12, 2, '#94a3b8', '#f8fafc', 2);
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(c1x + cw / 2, pis1Y);
        ctx.lineTo(c1x + cw / 2, pis1Y - 40);
        ctx.stroke();
        drawRoundRect(ctx, c1x + 14, pis1Y - 48, cw - 28, 10, 4, '#f97316', '#fed7aa', 2);
        drawArrow(ctx, c1x + cw + 14, pis1Y - 12, c1x + cw + 14, pis1Y - 46, '#10b981', 2.8, 7);

        // Khí đi vào qua van mở
        drawArrow(ctx, c1x - 36, 140, c1x - 4, 140, '#38bdf8', 2.6, 7);
        drawCallout(ctx, c1x - 20, 140, 16, 184, ['Van vào MỞ', 'Khí đi vào'], '#10b981');
        drawCallout(ctx, c1x + cw, c1y + ch - 13, 252, 248, ['Van ra ĐÓNG'], '#ef4444');

        // --- TRẠNG THÁI 2 (PHẢI): ĐẨY TAY BƠM XUỐNG (VAN VÀO ĐÓNG, VAN RA MỞ) ---
        const c2x = 490, c2y = 115;
        const pis2Y = c2y + 24 + saw * 62; // đẩy xuống nén khí

        ctx.fillStyle = '#fb923c';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('2. ĐẨY TAY BƠM XUỐNG', c2x + cw / 2, 64);

        // Khí bị nén bên dưới pít-tông
        ctx.fillStyle = `rgba(249, 115, 22, ${(0.24 + saw * 0.25).toFixed(2)})`;
        ctx.fillRect(c2x, pis2Y + 12, cw, c2y + ch - (pis2Y + 12));

        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(c2x, c2y); ctx.lineTo(c2x, c2y + ch);
        ctx.lineTo(c2x + cw + 42, c2y + ch);
        ctx.moveTo(c2x + cw, c2y); ctx.lineTo(c2x + cw, c2y + ch - 26);
        ctx.lineTo(c2x + cw + 42, c2y + ch - 26);
        ctx.stroke();

        // Van đầu vào ĐÓNG (ép sát thành trái)
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(c2x + 2, 130);
        ctx.lineTo(c2x + 2, 150);
        ctx.stroke();

        // Van đầu ra MỞ (bản lề mở sang phải)
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(c2x + cw, c2y + ch - 26);
        ctx.lineTo(c2x + cw + 16, c2y + ch - 14);
        ctx.stroke();

        // Pít-tông & Tay bơm đẩy xuống
        drawRoundRect(ctx, c2x + 3, pis2Y, cw - 6, 12, 2, '#94a3b8', '#f8fafc', 2);
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(c2x + cw / 2, pis2Y);
        ctx.lineTo(c2x + cw / 2, pis2Y - 40);
        ctx.stroke();
        drawRoundRect(ctx, c2x + 14, pis2Y - 48, cw - 28, 10, 4, '#f97316', '#fed7aa', 2);
        drawArrow(ctx, c2x - 14, pis2Y - 46, c2x - 14, pis2Y - 12, '#fb923c', 2.8, 7);

        // Khí nén đẩy ra qua van đầu ra mở
        drawArrow(ctx, c2x + cw + 8, c2y + ch - 13, c2x + cw + 48, c2y + ch - 13, '#38bdf8', 2.8, 7);
        drawCallout(ctx, c2x, 140, 368, 134, ['Van vào ĐÓNG'], '#ef4444');
        drawCallout(ctx, c2x + cw + 28, c2y + ch - 13, 625, 198, ['Van ra MỞ', 'Khí bị đẩy ra'], '#10b981');
        ctx.restore();
    });

    // =========================================================================
    // 14. MH-C2-36: BÌNH NÉN KHÍ HELIUM BƠM BÓNG BAY SỰ KIỆN
    // =========================================================================
    window.VLXTModels.register('MH-C2-36', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'BÌNH KHÍ HELIUM NÉN (6 lít; 5,00·10⁵ Pa) BƠM BÓNG BAY SỰ KIỆN');

        const saw = (t * 0.25) % 1;
        const bR = 24 + saw * 22;

        ctx.save();
        // Bình nén khí Helium (màu hồng tím đặc trưng)
        const tx = 135, ty = 92, tw = 96, th = 176;
        // Tay xách bảo vệ van trên đỉnh
        ctx.strokeStyle = '#f472b6';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(tx + 18, ty + 14);
        ctx.lineTo(tx + 12, ty - 14);
        ctx.lineTo(tx + 34, ty - 14);
        ctx.moveTo(tx + tw - 18, ty + 14);
        ctx.lineTo(tx + tw - 12, ty - 14);
        ctx.lineTo(tx + tw - 34, ty - 14);
        ctx.stroke();

        // Thân bình khí nén Helium
        const tGrad = ctx.createLinearGradient(tx, ty, tx + tw, ty);
        tGrad.addColorStop(0, '#be185d');
        tGrad.addColorStop(0.45, '#ec4899');
        tGrad.addColorStop(1, '#9d174d');
        drawRoundRect(ctx, tx, ty, tw, th, 26, tGrad, '#fbcfe8', 2.8);

        // Van khóa trên đỉnh bình
        const vx = tx + tw / 2;
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(vx - 7, ty - 16, 14, 16);
        ctx.fillStyle = '#10b981';
        ctx.fillRect(vx - 16, ty - 20, 32, 6);

        ctx.fillStyle = '#ffffff';
        ctx.font = '800 16px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('He', vx, ty + 62);
        ctx.font = '700 13px "DM Mono", monospace';
        ctx.fillText('6 lít', vx, ty + 88);
        ctx.fillText('5,00·10⁵ Pa', vx, ty + 110);

        // Vòi bơm nối từ van bình sang quả bóng bay đang bơm căng
        const bx = 345, by = 132;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(vx + 7, ty - 8);
        ctx.quadraticCurveTo(270, ty - 16, bx, by + bR + 8);
        ctx.stroke();

        // Quả bóng bay đang bơm căng (1 chiều)
        ctx.fillStyle = 'rgba(56, 189, 248, 0.36)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(bx, by, bR * 0.88, bR * 1.05, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('V = 2,0 lít', bx, by - 6);
        ctx.fillText('1,25·10⁵ Pa', bx, by + 12);

        // Các quả bóng bay đã bơm xong bay lơ lửng lên trên
        const floatY = (t * 28) % 55;
        const smallBalloons = [
            { x: 425, y: 215 - floatY, col: '#fbbf24' },
            { x: 465, y: 175 - floatY * 0.8, col: '#34d399' },
            { x: 435, y: 120 - floatY * 0.6, col: '#f472b6' }
        ];
        smallBalloons.forEach(sb => {
            ctx.fillStyle = sb.col;
            ctx.beginPath();
            ctx.ellipse(sb.x, sb.y, 14, 17, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.moveTo(sb.x, sb.y + 17);
            ctx.lineTo(sb.x, sb.y + 38);
            ctx.stroke();
        });

        // Thẻ thông số đề dẫn bên phải (Zero Data Leakage)
        drawRoundRect(ctx, 512, 72, 248, 194, 10, '#0f172a', '#ec4899', 2);
        ctx.fillStyle = '#f472b6';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('THÔNG SỐ BƠM BÓNG HELIUM', 526, 98);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Bình khí He: V = 6 lít', 526, 126);
        ctx.fillText('  Áp suất đầu: p = 5,00·10⁵ Pa', 526, 150);
        ctx.fillText('• Mỗi bóng bay: V₀ = 2,0 lít', 526, 178);
        ctx.fillText('  Áp suất bóng: p₀ = 1,25·10⁵ Pa', 526, 202);
        ctx.fillText('• Số học sinh cần: 187 em', 526, 228);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('• Quá trình đẳng nhiệt (T = const)', 526, 252);
        ctx.restore();
    });

    // =========================================================================
    // 15. MH-C2-37: THÍ NGHIỆM BƠM KHÍ KIỂM CHỨNG ÁP SUẤT TỈ LỆ LƯỢNG KHÍ
    // =========================================================================
    window.VLXTModels.register('MH-C2-37', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'THÍ NGHIỆM BƠM KHÍ VÀO BÌNH CỨNG (V₁ = 0,6 lít → V₂ = 5,0 lít; 29°C)');

        const saw = (t * 0.25) % 1;
        const isPush = saw >= 0.45; // Giai đoạn 1: hút khí (k1 mở, k2 đóng); Giai đoạn 2: đẩy khí (k1 đóng, k2 mở)

        ctx.save();
        // 1. Bình chứa khí cứng V2 = 5,0 lít bên phải
        const bx = 325, by = 118, bw = 395, bh = 158;
        drawRoundRect(ctx, bx, by, bw, bh, 6, 'rgba(15, 23, 42, 0.85)', '#cbd5e1', 3.2);

        // Các chấm phân tử khí trong bình V2 (mật độ tăng theo saw)
        ctx.fillStyle = '#38bdf8';
        const dotCount = 34 + Math.round(saw * 24);
        for (let i = 0; i < dotCount; i++) {
            const dx = bx + 18 + ((i * 53) % (bw - 36));
            const dy = by + 18 + ((i * 37) % (bh - 36));
            ctx.beginPath();
            ctx.arc(dx, dy, 2.2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Nhãn V2 = 5,0 lít ở giữa bình
        drawRoundRect(ctx, bx + bw / 2 - 56, by + bh / 2 - 15, 112, 30, 6, '#0f172a', '#38bdf8', 1.6);
        drawSubText(ctx, 'V', '2', bx + bw / 2 - 42, by + bh / 2 + 5, { fontSize: 15, italic: true, color: '#38bdf8' });
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('= 5,0 lít', bx + bw / 2 - 18, by + bh / 2 + 5);

        // 2. Xilanh bơm V1 = 0,6 lít nối vào thành trái bình V2
        const px = 148, py = 154, pw = 177, ph = 64;
        // Xóa vách ngăn chỗ nối giữa V1 và V2 để thông nhau qua van k2
        ctx.fillStyle = '#070d1c';
        ctx.fillRect(px, py, pw + 2, ph);

        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(bx, py);
        ctx.moveTo(px, py + ph);
        ctx.lineTo(bx, py + ph);
        ctx.stroke();

        // Pít-tông trong bơm V1
        const pisX = isPush ? (px + 18 + ((saw - 0.45) / 0.55) * 95) : (px + 113 - (saw / 0.45) * 95);
        // Lỗ hút khí qua pít-tông & Van 1 chiều k1
        drawRoundRect(ctx, pisX, py + 3, 18, 22, 2, '#64748b', '#f8fafc', 2);
        drawRoundRect(ctx, pisX, py + ph - 25, 18, 22, 2, '#64748b', '#f8fafc', 2);
        // Cán pít-tông
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(pisX, py + 22); ctx.lineTo(pisX - 65, py + 22);
        ctx.moveTo(pisX, py + ph - 22); ctx.lineTo(pisX - 65, py + ph - 22);
        ctx.stroke();

        // Van một chiều k1 trên pít-tông
        ctx.strokeStyle = isPush ? '#ef4444' : '#10b981';
        ctx.lineWidth = 3.4;
        ctx.beginPath();
        ctx.moveTo(pisX + 18, py + 25);
        if (isPush) ctx.lineTo(pisX + 18, py + ph - 25); // k1 đóng
        else ctx.lineTo(pisX + 30, py + ph - 27); // k1 mở hút khí vào
        ctx.stroke();
        drawSubText(ctx, 'k', '1', pisX + 34, py + ph - 12, { fontSize: 14.5, color: '#fbbf24' });

        // Van một chiều k2 tại cửa nối vào bình V2
        ctx.strokeStyle = isPush ? '#10b981' : '#ef4444';
        ctx.lineWidth = 3.4;
        ctx.beginPath();
        ctx.moveTo(bx, py + 6);
        if (isPush) ctx.lineTo(bx + 14, py + ph - 10); // k2 mở đẩy khí vào bình V2
        else ctx.lineTo(bx, py + ph - 6); // k2 đóng
        ctx.stroke();
        drawSubText(ctx, 'k', '2', bx + 18, py + ph - 10, { fontSize: 14.5, color: '#fbbf24' });

        // Nhãn V1 = 0,6 lít
        drawSubText(ctx, 'V', '1', 238, py - 12, { fontSize: 15, italic: true, color: '#38bdf8' });
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('= 0,6 lít', 258, py - 12);

        // 3. Áp kế đơn vị Bar gắn trên nắp bình V2
        const gX = 432, gY = 72;
        drawRoundRect(ctx, gX - 7, 102, 14, 18, 2, '#f59e0b', '#cbd5e1', 2);
        const nAng = Math.PI * 0.8 + saw * Math.PI * 0.55;
        drawPressureGauge(ctx, gX, gY, 30, nAng, 'bar', '', '#38bdf8');
        drawCallout(ctx, gX - 30, gY, 275, 56, ['Áp kế (Bar)', 'Chỉ 0 tại p_kq'], '#38bdf8');

        // 4. Nhiệt kế điện tử hiện số 29°C cắm xuyên nắp bình V2
        const tX = 632, tY = 54;
        drawRoundRect(ctx, tX - 24, tY, 48, 52, 8, '#f59e0b', '#fef08a', 2.2);
        drawRoundRect(ctx, tX - 18, tY + 12, 36, 22, 4, '#0f172a', '#10b981', 1.6);
        ctx.fillStyle = '#6ee7b7';
        ctx.font = '800 13px "DM Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('29°C', tX, tY + 23);
        // Que dò nhiệt độ cắm xuyên nắp bình vào trong
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(tX + 6, tY + 52);
        ctx.lineTo(tX + 6, 174);
        ctx.stroke();
        drawCallout(ctx, tX + 24, tY + 26, 668, 58, ['Nhiệt kế số', '29,0°C'], '#10b981');
        ctx.restore();
    });

})(window);
            })({ VLXTModels: tempVLXT });
        } catch(e) {
            if (typeof console !== 'undefined') console.error('Lỗi nạp Canvas chunk:', e);
        }



        try {
            (function(window) {
/**
 * ============================================================================
 * BỘ MÔ HÌNH CANVAS VẬT LÍ HYDROGEN V2 - CHƯƠNG 2 - CA 4 (CÂU 38 -> CÂU 52, TRỪ 47)
 * Gồm 14 mô hình: MH-C2-38, MH-C2-39, MH-C2-40, MH-C2-41, MH-C2-42,
 *                MH-C2-43, MH-C2-44, MH-C2-45, MH-C2-46, MH-C2-48,
 *                MH-C2-49, MH-C2-50, MH-C2-51, MH-C2-52
 * Chuẩn khung logic: 780 x 305 | Tuân thủ 10 Quy Tắc Vàng VLXT_MOTION_SPEC.md
 * ============================================================================
 */
(function(window) {
    'use strict';

    window.VLXTModels = window.VLXTModels || {
        _registry: {},
        register: function(id, fn) {
            this._registry[id] = fn;
        }
    };

    // =========================================================================
    // HỆ THỐNG HÀM TRỢ GIÚP CHUẨN VLXT (CORE HELPERS)
    // =========================================================================
    function clearCanvas(ctx, w, h) {
        ctx.clearRect(0, 0, w, h);
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#060b19');
        grad.addColorStop(1, '#0a1226');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
        ctx.lineWidth = 1;
        for (let x = 20; x < w; x += 26) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (let y = 20; y < h; y += 26) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }
        ctx.restore();
    }

    function drawRoundRect(ctx, x, y, w, h, r, fill, stroke, lineWidth = 2.8) {
        ctx.save();
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(x, y, w, h, r);
        } else {
            ctx.moveTo(x + r, y);
            ctx.lineTo(x + w - r, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + r);
            ctx.lineTo(x + w, y + h - r);
            ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            ctx.lineTo(x + r, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - r);
            ctx.lineTo(x, y + r);
            ctx.quadraticCurveTo(x, y, x + r, y);
            ctx.closePath();
        }
        if (fill) { ctx.fillStyle = fill; ctx.fill(); }
        if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); }
        ctx.restore();
    }

    function drawSubText(ctx, base, sub, x, y, opts = {}) {
        const fontSize = opts.fontSize || 15;
        const subSize = Math.round(fontSize * 0.74);
        const weight = opts.weight || '700';
        const italic = opts.italic ? 'italic ' : '';
        const color = opts.color || '#f8fafc';
        const align = opts.align || 'left';
        ctx.save();
        ctx.fillStyle = color;
        ctx.textBaseline = opts.baseline || 'alphabetic';
        ctx.font = `${italic}${weight} ${fontSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
        const baseW = ctx.measureText(base).width;
        ctx.font = `${weight} ${subSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
        const subW = sub ? ctx.measureText(sub).width : 0;
        const totalW = baseW + subW;
        let startX = x;
        if (align === 'center') startX = x - totalW / 2;
        else if (align === 'right') startX = x - totalW;

        ctx.font = `${italic}${weight} ${fontSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
        ctx.fillText(base, startX, y);
        if (sub) {
            ctx.font = `${weight} ${subSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
            ctx.fillText(sub, startX + baseW + 1, y + Math.round(fontSize * 0.28));
        }
        ctx.restore();
        return totalW;
    }

    function drawArrow(ctx, x1, y1, x2, y2, color = '#38bdf8', width = 3, headLen = 9) {
        const angle = Math.atan2(y2 - y1, x2 - x1);
        ctx.save();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    // Chậu / Xi-lanh hở miệng trên (U-shape, không bao giờ vẽ nắp đóng kín miệng trên)
    function drawOpenCup(ctx, x, y, w, h, waterRatio, options = {}) {
        const wallColor = options.wallColor || '#cbd5e1';
        const waterTopColor = options.waterTopColor || 'rgba(56, 189, 248, 0.34)';
        const waterBotColor = options.waterBotColor || 'rgba(14, 116, 144, 0.54)';
        const wallWidth = options.wallWidth || 3.2;
        const flare = options.flare || 0;

        ctx.save();
        if (waterRatio > 0) {
            const innerLeft = x + wallWidth * 0.45;
            const innerRight = x + w - wallWidth * 0.45;
            const innerBot = y + h - wallWidth * 0.45;
            const maxWaterH = h - 6;
            const wh = maxWaterH * Math.min(1, Math.max(0, waterRatio));
            const wy = innerBot - wh;
            const topFlare = flare * (wh / h);

            const wGrad = ctx.createLinearGradient(0, wy, 0, innerBot);
            wGrad.addColorStop(0, waterTopColor);
            wGrad.addColorStop(1, waterBotColor);

            ctx.fillStyle = wGrad;
            ctx.beginPath();
            ctx.moveTo(innerLeft - topFlare, wy);
            ctx.lineTo(innerRight + topFlare, wy);
            ctx.lineTo(innerRight, innerBot);
            ctx.lineTo(innerLeft, innerBot);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = options.surfaceColor || '#7dd3fc';
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.moveTo(innerLeft - topFlare, wy);
            ctx.lineTo(innerRight + topFlare, wy);
            ctx.stroke();
        }

        ctx.strokeStyle = wallColor;
        ctx.lineWidth = wallWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(x - flare, y);
        ctx.lineTo(x, y + h);
        ctx.lineTo(x + w, y + h);
        ctx.lineTo(x + w + flare, y);
        ctx.stroke();
        ctx.restore();
    }

    // Hộp chú thích nền #0f172a chống đè nét (Mobile-First >= 13.5px bold)
    function drawCallout(ctx, targetX, targetY, boxX, boxY, lines, borderColor = '#38bdf8', textColor = '#f8fafc') {
        const lineArr = Array.isArray(lines) ? lines : [lines];
        ctx.save();
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        const padX = 10;
        const lineH = 18;
        const boxH = lineArr.length * lineH + 10;
        let maxW = 0;
        lineArr.forEach(l => {
            const mw = ctx.measureText(l).width;
            if (mw > maxW) maxW = mw;
        });
        const boxW = maxW + padX * 2;
        const anchorX = (boxX + boxW / 2 < targetX) ? (boxX + boxW) : (boxX > targetX ? boxX : boxX + boxW / 2);
        const anchorY = boxY + boxH / 2;

        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(targetX, targetY);
        ctx.lineTo(anchorX, anchorY);
        ctx.stroke();

        ctx.fillStyle = borderColor;
        ctx.beginPath();
        ctx.arc(targetX, targetY, 3.8, 0, Math.PI * 2);
        ctx.fill();

        drawRoundRect(ctx, boxX, boxY, boxW, boxH, 7, '#0f172a', borderColor, 1.8);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        lineArr.forEach((line, idx) => {
            ctx.fillStyle = idx === 0 ? textColor : '#cbd5e1';
            ctx.fillText(line, boxX + boxW / 2, boxY + 5 + lineH * (idx + 0.5));
        });
        ctx.restore();
    }

    function drawTitleBadge(ctx, text, x = 16, y = 14) {
        ctx.save();
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        const w = ctx.measureText(text).width + 22;
        drawRoundRect(ctx, x, y, w, 28, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x + 11, y + 14);
        ctx.restore();
    }

    function drawPressureGauge(ctx, cx, cy, r, needleAngle, unitText, valueText, accent = '#38bdf8') {
        ctx.save();
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.6;
        for (let i = 0; i <= 10; i++) {
            const ang = Math.PI * 0.75 + (i / 10) * Math.PI * 1.5;
            const r1 = r - 6;
            const r2 = (i % 5 === 0) ? r - 13 : r - 10;
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(ang) * r1, cy + Math.sin(ang) * r1);
            ctx.lineTo(cx + Math.cos(ang) * r2, cy + Math.sin(ang) * r2);
            ctx.stroke();
        }

        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cx - Math.cos(needleAngle) * 5, cy - Math.sin(needleAngle) * 5);
        ctx.lineTo(cx + Math.cos(needleAngle) * (r - 9), cy + Math.sin(needleAngle) * (r - 9));
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(cx, cy, 3.8, 0, Math.PI * 2);
        ctx.fill();

        if (unitText) {
            ctx.fillStyle = accent;
            ctx.font = '800 11px "DM Mono", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(unitText, cx, cy + r * 0.48);
        }
        if (valueText) {
            drawRoundRect(ctx, cx - 44, cy - r - 28, 88, 22, 5, '#0f172a', accent, 1.5);
            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 13px "DM Mono", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(valueText, cx, cy - r - 17);
        }
        ctx.restore();
    }

    // =========================================================================
    // 1. MH-C2-38: PHONG VŨ BIỂU THỦY NGÂN TORRICELLI
    // Ràng buộc riêng:
    // - Chậu thủy ngân vẽ bằng drawOpenCup tràn sát 2 thành bên.
    // - Miệng dưới của ống thủy tinh phải cắm ngập sâu xuống dưới mặt thoáng
    //   thủy ngân trong chậu (không dừng lơ lửng ở mặt thoáng).
    // - KHÔNG ghi các con số 760 mmHg, 748 mmHg, 52 mm của ý c lên hình.
    // =========================================================================
    window.VLXTModels.register('MH-C2-38', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'PHONG VŨ BIỂU THỦY NGÂN TORRICELLI (ỐNG DÀI 80–90 cm)');

        const pulse = Math.sin(t * 2.2) * 2;
        const cupX = 235, cupY = 175, cupW = 240, cupH = 104;
        const wallW = 3.4;
        const waterRatio = 0.72;
        const innerBot = cupY + cupH - wallW * 0.45;
        const surfY = innerBot - (cupH - 6) * waterRatio; // Mặt thoáng Hg trong chậu (~ y = 207)

        ctx.save();
        // 1. Vẽ chậu thủy ngân bằng drawOpenCup tràn sát 2 thành bên
        drawOpenCup(ctx, cupX, cupY, cupW, cupH, waterRatio, {
            wallColor: '#cbd5e1',
            wallWidth: wallW,
            waterTopColor: 'rgba(148, 163, 184, 0.52)',
            waterBotColor: 'rgba(71, 85, 105, 0.78)',
            surfaceColor: '#e2e8f0'
        });

        // 2. Ống thủy tinh một đầu kín (trên), đầu hở dưới cắm NGẬP SÂU xuống dưới mặt thoáng Hg
        const tx = 355, tw = 30;
        const tubeTopY = 58;
        const tubeBotY = 252; // Ngập sâu 45px dưới mặt thoáng surfY (y=207)
        const hgTopY = 98 + pulse;

        // Nền tối khoang chân không phía trên cột thủy ngân trong ống
        ctx.fillStyle = '#070c18';
        ctx.beginPath();
        ctx.arc(tx, tubeTopY + tw / 2, tw / 2, Math.PI, 0, false);
        ctx.lineTo(tx + tw / 2, hgTopY);
        ctx.lineTo(tx - tw / 2, hgTopY);
        ctx.closePath();
        ctx.fill();

        // Cột thủy ngân dâng cao trong ống (từ hgTopY xuống tận miệng dưới tubeBotY)
        const hgGrad = ctx.createLinearGradient(tx - tw / 2, 0, tx + tw / 2, 0);
        hgGrad.addColorStop(0, '#64748b');
        hgGrad.addColorStop(0.45, '#cbd5e1');
        hgGrad.addColorStop(1, '#475569');
        ctx.fillStyle = hgGrad;
        ctx.fillRect(tx - tw / 2 + 1.5, hgTopY, tw - 3, tubeBotY - hgTopY);

        // Lớp màng đàn hồi / mặt khum thủy ngân tại đỉnh cột Hg
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(tx - tw / 2 + 2, hgTopY);
        ctx.lineTo(tx + tw / 2 - 2, hgTopY);
        ctx.stroke();

        // Viền ống thủy tinh hở đáy (không vẽ nét đóng đáy ống)
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(tx - tw / 2, tubeBotY);
        ctx.lineTo(tx - tw / 2, tubeTopY + tw / 2);
        ctx.arc(tx, tubeTopY + tw / 2, tw / 2, Math.PI, 0, false);
        ctx.lineTo(tx + tw / 2, tubeBotY);
        ctx.stroke();

        // 3. Mũi tên áp suất khí quyển p0 ép xuống mặt thoáng thủy ngân trong chậu
        drawArrow(ctx, 282, 146, 282, surfY - 3, '#fbbf24', 3.4, 9);
        drawSubText(ctx, 'p', '0', 268, 165, { fontSize: 16, italic: true, color: '#fbbf24', align: 'right' });

        // Đường gióng & mũi tên chỉ chiều cao cột thủy ngân h
        ctx.strokeStyle = '#38bdf8';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(tx + tw / 2, hgTopY); ctx.lineTo(426, hgTopY);
        ctx.moveTo(tx + tw / 2, surfY); ctx.lineTo(426, surfY);
        ctx.stroke();
        ctx.setLineDash([]);
        drawArrow(ctx, 418, surfY, 418, hgTopY, '#38bdf8', 2.4, 7);
        drawArrow(ctx, 418, hgTopY, 418, surfY, '#38bdf8', 2.4, 7);
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'italic 800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('h', 426, (hgTopY + surfY) / 2 + 5);

        // Nhãn Hg trong chậu
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Hg', 425, 246);

        // Chú thích callout chống đè nét
        drawCallout(ctx, tx - tw / 2, 78, 36, 68, ['Khoảng chân không', 'Áp suất p ≈ 0'], '#94a3b8');
        drawCallout(ctx, tx + tw / 2, hgTopY, 495, 76, ['Màng đàn hồi / Đỉnh cột Hg', 'Chiều cao h đo p₀'], '#38bdf8');
        drawCallout(ctx, tx + tw / 2, 236, 495, 198, ['Miệng ống ngập sâu', 'Dưới mặt thoáng thủy ngân'], '#cbd5e1');
        ctx.restore();
    });

    // =========================================================================
    // 2. MH-C2-39: ỐNG THỦY TINH NHÚNG THẲNG ĐỨNG VÀO CHẬU NƯỚC (HÌNH a & b)
    // Ràng buộc riêng:
    // - Vẽ rõ 2 chậu nước (a) và (b) đặt cạnh nhau như hình gốc.
    // - Ở hình (a): đầu kín ngang bằng mặt thoáng nước, cột không khí bên trong
    //   dài h0 = 20 cm (mực nước trong ống thấp hơn mặt thoáng ngoài).
    // - Ở hình (b): kéo ống lên cao, mực nước trong ống dâng cao hơn mặt thoáng
    //   ngoài một đoạn ký hiệu là x (không ghi số 30 cm hay 10 cm của ý b, c).
    // =========================================================================
    window.VLXTModels.register('MH-C2-39', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'ỐNG THỦY TINH NHÚNG VÀO CHẬU NƯỚC (p₀ = 9,8·10⁴ N/m²; d = 10⁴ N/m³; 27°C)');

        const wallW = 3.2;

        // --- HÌNH (a): ĐẦU KÍN NGANG MẶT THOÁNG NƯỚC, CỘT KHÍ DÀI h0 = 20 cm ---
        const c1x = 115, c1y = 106, cw = 215, ch = 152;
        const surf1Y = c1y + 28; // Mặt thoáng nước ngoài ở hình (a) (~ y = 134)

        ctx.save();
        drawOpenCup(ctx, c1x, c1y, cw, ch, 0.82, {
            wallColor: '#cbd5e1',
            wallWidth: wallW,
            waterTopColor: 'rgba(56, 189, 248, 0.28)',
            waterBotColor: 'rgba(14, 116, 144, 0.48)',
            surfaceColor: '#7dd3fc'
        });

        // Ống thủy tinh hình (a): đầu kín ngang mặt thoáng surf1Y, miệng dưới gần đáy chậu
        const t1x = c1x + cw / 2 + 12, tw = 32;
        const t1TopY = surf1Y; // Đầu kín ngang bằng với mặt thoáng nước
        const t1BotY = c1y + ch - 12;
        const air1BotY = t1TopY + 72; // Cột không khí dài h0 = 20 cm (mực nước trong thấp hơn ngoài)

        // Khoang khí trong ống (a)
        ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        ctx.beginPath();
        ctx.arc(t1x, t1TopY + tw / 2, tw / 2, Math.PI, 0, false);
        ctx.lineTo(t1x + tw / 2, air1BotY);
        ctx.lineTo(t1x - tw / 2, air1BotY);
        ctx.closePath();
        ctx.fill();

        // Nước dâng vào phần dưới ống (a)
        ctx.fillStyle = 'rgba(2, 132, 199, 0.65)';
        ctx.fillRect(t1x - tw / 2 + 1.5, air1BotY, tw - 3, t1BotY - air1BotY);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(t1x - tw / 2 + 2, air1BotY);
        ctx.lineTo(t1x + tw / 2 - 2, air1BotY);
        ctx.stroke();

        // Viền ống thủy tinh (a)
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        ctx.moveTo(t1x - tw / 2, t1BotY);
        ctx.lineTo(t1x - tw / 2, t1TopY + tw / 2);
        ctx.arc(t1x, t1TopY + tw / 2, tw / 2, Math.PI, 0, false);
        ctx.lineTo(t1x + tw / 2, t1BotY);
        ctx.stroke();

        // Đoạn kích thước h0 = 20 cm bên trái ống (a)
        const dim1X = t1x - tw / 2 - 14;
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(dim1X - 5, t1TopY); ctx.lineTo(dim1X + 5, t1TopY);
        ctx.moveTo(dim1X, t1TopY); ctx.lineTo(dim1X, air1BotY);
        ctx.moveTo(dim1X - 5, air1BotY); ctx.lineTo(dim1X + 5, air1BotY);
        ctx.stroke();
        drawSubText(ctx, 'h', '0', dim1X - 10, (t1TopY + air1BotY) / 2 - 4, { fontSize: 15, italic: true, color: '#fbbf24', align: 'right' });
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('= 20 cm', dim1X - 8, (t1TopY + air1BotY) / 2 + 14);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 16px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Hình (a)', c1x + cw / 2, 286);

        // --- HÌNH (b): KÉO ỐNG LÊN CAO, MỰC NƯỚC TRONG ỐNG CAO HƠN NGOÀI ĐOẠN x ---
        const c2x = 450, c2y = 106;
        const surf2Y = c2y + 28; // Mặt thoáng nước ngoài ở hình (b) (~ y = 134)

        drawOpenCup(ctx, c2x, c2y, cw, ch, 0.82, {
            wallColor: '#cbd5e1',
            wallWidth: wallW,
            waterTopColor: 'rgba(56, 189, 248, 0.28)',
            waterBotColor: 'rgba(14, 116, 144, 0.48)',
            surfaceColor: '#7dd3fc'
        });

        // Ống thủy tinh (b) kéo cao nhô khỏi mặt nước
        const t2x = c2x + cw / 2 + 12;
        const t2TopY = 54;
        const t2BotY = surf2Y + 52; // Miệng ống vẫn ngập dưới mặt nước
        const waterIn2Y = surf2Y - 26; // Mực nước trong ống cao hơn mặt thoáng ngoài đoạn x

        // Khoang khí trong ống (b)
        ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        ctx.beginPath();
        ctx.arc(t2x, t2TopY + tw / 2, tw / 2, Math.PI, 0, false);
        ctx.lineTo(t2x + tw / 2, waterIn2Y);
        ctx.lineTo(t2x - tw / 2, waterIn2Y);
        ctx.closePath();
        ctx.fill();

        // Cột nước dâng cao trong ống (b)
        ctx.fillStyle = 'rgba(2, 132, 199, 0.68)';
        ctx.fillRect(t2x - tw / 2 + 1.5, waterIn2Y, tw - 3, t2BotY - waterIn2Y);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(t2x - tw / 2 + 2, waterIn2Y);
        ctx.lineTo(t2x + tw / 2 - 2, waterIn2Y);
        ctx.stroke();

        // Viền ống thủy tinh (b)
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        ctx.moveTo(t2x - tw / 2, t2BotY);
        ctx.lineTo(t2x - tw / 2, t2TopY + tw / 2);
        ctx.arc(t2x, t2TopY + tw / 2, tw / 2, Math.PI, 0, false);
        ctx.lineTo(t2x + tw / 2, t2BotY);
        ctx.stroke();

        // Ký hiệu chênh lệch mực nước x ở hình (b)
        const dim2X = t2x - tw / 2 - 14;
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(dim2X - 5, waterIn2Y); ctx.lineTo(dim2X + 5, waterIn2Y);
        ctx.moveTo(dim2X, waterIn2Y); ctx.lineTo(dim2X, surf2Y);
        ctx.moveTo(dim2X - 5, surf2Y); ctx.lineTo(dim2X + 5, surf2Y);
        ctx.stroke();
        ctx.fillStyle = '#6ee7b7';
        ctx.font = 'italic 800 16px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('x', dim2X - 9, (waterIn2Y + surf2Y) / 2 + 5);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 16px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Hình (b)', c2x + cw / 2, 286);
        ctx.restore();
    });

    // =========================================================================
    // 3. MH-C2-40: MÁY ĐO HUYẾT ÁP ĐIỆN TỬ & VÒNG BÍT QUẤN TRÊN CÁNH TAY
    // =========================================================================
    window.VLXTModels.register('MH-C2-40', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'MÁY ĐO HUYẾT ÁP ĐIỆN TỬ & VÒNG BÍT (p₀ = 760 mmHg; 27°C; 30 cm³/s)');

        const saw = (t * 0.25) % 1; // Bơm khí vào vòng bít 1 chiều -> reset

        ctx.save();
        // 1. Thân máy đo huyết áp điện tử bên trái
        const mx = 75, my = 66, mw = 178, mh = 196;
        drawRoundRect(ctx, mx, my, mw, mh, 16, '#1e293b', '#94a3b8', 3);
        // Màn hình LCD hiển thị kết quả đề dẫn: 118 mmHg (tâm thu) và 78 mmHg (tâm trương)
        drawRoundRect(ctx, mx + 18, my + 20, mw - 36, 118, 8, '#070c18', '#38bdf8', 2);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '700 11.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('SYS (Tâm thu)', mx + 26, my + 38);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 26px "DM Mono", monospace';
        ctx.textAlign = 'right';
        ctx.fillText('118', mx + mw - 26, my + 60);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '700 11.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('DIA (Tâm trương)', mx + 26, my + 86);
        ctx.fillStyle = '#6ee7b7';
        ctx.font = '800 24px "DM Mono", monospace';
        ctx.textAlign = 'right';
        ctx.fillText('78', mx + mw - 26, my + 108);

        ctx.fillStyle = '#fbbf24';
        ctx.font = '700 11px "DM Mono", monospace';
        ctx.fillText('mmHg', mx + mw - 26, my + 128);

        // Nút START trên máy đo
        drawRoundRect(ctx, mx + 46, my + 152, 86, 30, 8, '#0284c7', '#7dd3fc', 2);
        ctx.fillStyle = '#ffffff';
        ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('START', mx + 89, my + 172);

        // 2. Cánh tay & Vòng bít (Cuff) bên phải
        const armY = 178;
        // Cánh tay (bắp tay -> khuỷu -> cẳng tay)
        ctx.fillStyle = 'rgba(251, 191, 36, 0.16)';
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        ctx.moveTo(395, armY - 34);
        ctx.lineTo(685, armY - 26);
        ctx.arc(685, armY, 26, -Math.PI / 2, Math.PI / 2, false);
        ctx.lineTo(395, armY + 34);
        ctx.stroke();
        ctx.fill();

        // Vòng bít (Cuff) quấn quanh bắp tay (phồng nhẹ theo saw)
        const inflate = saw * 6;
        drawRoundRect(ctx, 435, armY - 40 - inflate, 118, 80 + inflate * 2, 12, 'rgba(56, 189, 248, 0.28)', '#38bdf8', 3.2);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Vòng bít khí', 494, armY - 6);
        ctx.fillStyle = '#7dd3fc';
        ctx.font = '700 12.5px "DM Mono", monospace';
        ctx.fillText('120 → 380 cm³', 494, armY + 14);

        // 3. Ống dẫn khí nối LIỀN MẠCH từ hông máy đo vào vòng bít
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(mx + mw, 198);
        ctx.bezierCurveTo(310, 198, 345, 252, 435, 202);
        ctx.stroke();
        // Mũi tên dòng khí bơm 30 cm³/s chạy dọc theo ống dẫn
        const fp = saw;
        const fx = mx + mw + 16 + fp * 145;
        const fy = 205 + Math.sin(fp * Math.PI) * 18;
        drawArrow(ctx, fx, fy, fx + 24, fy, '#38bdf8', 2.8, 7);

        // Chú thích callout
        drawCallout(ctx, 330, 218, 285, 92, ['Ống dẫn khí nối kín', 'Lưu lượng bơm/xả: 30 cm³/s'], '#38bdf8');
        drawCallout(ctx, 553, 178, 565, 76, ['Khí trong vòng bít (27°C)', 'p₀ = 760 mmHg; Δp_max = 160 mmHg'], '#fbbf24');
        ctx.restore();
    });

    // =========================================================================
    // 4. MH-C2-41: BÌNH CHỨA KHÍ OXYGEN (O2) NÉN DÙNG TRONG Y TẾ
    // Ràng buộc riêng:
    // - Tổng khối lượng bình và khí 18 kg, áp suất 15 MPa, nhiệt độ 27°C,
    //   có van khóa và đồng hồ đo áp suất trên cổ bình.
    // - KHÔNG lộ các số liệu của ý b, c, d (không ghi 11 MPa, 17,3 kg, 2,6 kg,
    //   193 kg/m³, 5,7 lít, 6 lít, 79 g...).
    // =========================================================================
    window.VLXTModels.register('MH-C2-41', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'BÌNH KHÍ OXYGEN (O₂) NÉN Y TẾ (m_tổng = 18 kg; p = 15 MPa; 27°C)');

        const saw = (t * 0.25) % 1;

        ctx.save();
        // 1. Thân bình khí nén Oxygen y tế (màu xanh ngọc y tế chuẩn)
        const bx = 185, by = 96, bw = 112, bh = 182;
        const bGrad = ctx.createLinearGradient(bx, by, bx + bw, by);
        bGrad.addColorStop(0, '#0f766e');
        bGrad.addColorStop(0.45, '#14b8a6');
        bGrad.addColorStop(1, '#115e59');
        drawRoundRect(ctx, bx, by, bw, bh, 34, bGrad, '#99f6e4', 3);

        // Đế bình
        drawRoundRect(ctx, bx + 12, by + bh - 8, bw - 24, 14, 4, '#334155', '#94a3b8', 2);

        // Chữ thập y tế & Ký hiệu O2 trên thân bình
        const cx = bx + bw / 2;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(cx - 5, by + 42, 10, 28);
        ctx.fillRect(cx - 14, by + 51, 28, 10);
        ctx.font = '800 20px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('O₂', cx, by + 98);
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillStyle = '#ccfbf1';
        ctx.fillText('15 MPa', cx, by + 124);
        ctx.fillText('27°C', cx, by + 146);

        // 2. Cổ bình, Van khóa & Đồng hồ đo áp suất
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(cx - 12, by - 24, 24, 24);
        // Tay vặn van khóa trên đỉnh
        drawRoundRect(ctx, cx - 22, by - 32, 44, 9, 4, '#f59e0b', '#fef08a', 2);

        // Ống nhánh sang đồng hồ áp suất bên phải cổ bình
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(cx + 12, by - 12);
        ctx.lineTo(cx + 68, by - 12);
        ctx.stroke();

        // Đồng hồ đo áp suất gắn trên cổ bình
        drawPressureGauge(ctx, cx + 68, by - 36, 26, Math.PI * 1.45, 'MPa', '', '#14b8a6');

        // Ống dẫn khí thở ra phía phải
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(cx + 68, by - 10);
        ctx.quadraticCurveTo(cx + 95, by + 18, cx + 135, by + 18);
        ctx.stroke();
        drawArrow(ctx, cx + 102 + saw * 26, by + 18, cx + 122 + saw * 26, by + 18, '#38bdf8', 2.6, 6);

        // Nhãn callout rõ ràng
        drawCallout(ctx, cx - 22, by - 28, 36, 72, ['Van khóa cổ bình'], '#f59e0b');
        drawCallout(ctx, cx + 94, by - 36, 415, 64, ['Đồng hồ đo áp suất', 'Ban đầu chỉ 15 MPa'], '#14b8a6');

        // Thẻ thông số đề dẫn (Zero Data Leakage - chỉ chứa dữ liệu phần dẫn đề)
        drawRoundRect(ctx, 415, 134, 335, 134, 10, '#0f172a', '#14b8a6', 2);
        ctx.fillStyle = '#5eead4';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('THÔNG SỐ BÌNH KHÍ Y TẾ BAN ĐẦU', 432, 160);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Khối lượng (bình + khí): 18 kg', 432, 186);
        ctx.fillText('• Áp suất ban đầu: p₁ = 15 MPa', 432, 212);
        ctx.fillText('• Nhiệt độ khí: t = 27°C (M_O₂ = 32 g/mol)', 432, 238);
        ctx.restore();
    });

    // =========================================================================
    // 5. MH-C2-42: THỢ LẶN Ở ĐỘ SÂU 30 m NỔI LÊN MẶT NƯỚC & BỌT KHÍ N2 NỞ TO DẦN
    // Ràng buộc riêng:
    // - KHÔNG ghi kết quả áp suất 395,3 kPa hay tỉ lệ 3,9 lần của ý b, d.
    // =========================================================================
    window.VLXTModels.register('MH-C2-42', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'THỢ LẶN TỪ ĐỘ SÂU h = 30 m NỔI LÊN MẶT NƯỚC (p₀ = 1,013·10⁵ Pa)');

        ctx.save();
        // Khối nước biển từ y = 74 xuống y = 282
        const surfY = 74, botY = 282;
        const seaGrad = ctx.createLinearGradient(0, surfY, 0, botY);
        seaGrad.addColorStop(0, 'rgba(56, 189, 248, 0.28)');
        seaGrad.addColorStop(1, 'rgba(3, 105, 161, 0.58)');
        ctx.fillStyle = seaGrad;
        ctx.fillRect(45, surfY, 445, botY - surfY);

        // Mặt thoáng nước biển & Mũi tên áp suất khí quyển p0
        ctx.strokeStyle = '#7dd3fc';
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        ctx.moveTo(45, surfY);
        ctx.lineTo(490, surfY);
        ctx.stroke();

        drawArrow(ctx, 115, 48, 115, surfY - 2, '#fbbf24', 3, 8);
        drawSubText(ctx, 'p', '0', 124, 62, { fontSize: 15, italic: true, color: '#fbbf24' });
        ctx.fillStyle = '#fde68a';
        ctx.font = '700 13px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('= 1,013·10⁵ Pa', 144, 62);

        // Thước đo độ sâu h = 30 m bên trái
        const dimX = 76;
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(dimX - 6, surfY); ctx.lineTo(dimX + 6, surfY);
        ctx.moveTo(dimX, surfY); ctx.lineTo(dimX, 246);
        ctx.moveTo(dimX - 6, 246); ctx.lineTo(dimX + 6, 246);
        ctx.stroke();
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('h = 30 m', dimX + 10, 166);

        // Hình tượng thợ lặn ở độ sâu 30 m (y = 246)
        const dx = 225, dy = 246;
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.6;
        // Thân & bình dưỡng khí
        drawRoundRect(ctx, dx - 28, dy - 10, 48, 18, 8, '#0f172a', '#38bdf8', 2.5);
        drawRoundRect(ctx, dx - 22, dy - 18, 34, 9, 4, '#f59e0b', '#fef08a', 1.8);
        // Đầu & Kính lặn
        ctx.beginPath(); ctx.arc(dx + 26, dy - 2, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // Chân nhái
        ctx.beginPath();
        ctx.moveTo(dx - 28, dy - 4); ctx.lineTo(dx - 48, dy - 12); ctx.lineTo(dx - 46, dy + 6); ctx.closePath();
        ctx.fill(); ctx.stroke();

        // Các bọt khí Nitrogen (N2) nổi lên 1 chiều sawtooth & NỞ TO DẦN khi áp suất giảm
        for (let i = 0; i < 6; i++) {
            const p = (t * 0.26 + i / 6) % 1; // 0 (ở sâu 30m) -> 1 (sát mặt nước)
            const bx = 335 + Math.sin(p * 8 + i * 1.4) * 14 + (i % 2) * 24;
            const by = 244 - p * (244 - surfY - 14);
            // Thể tích tăng ~ 3.9 lần => bán kính tăng ~ 3.9^(1/3) ≈ 1.58 lần
            const br = 5 + p * 8.5;

            ctx.fillStyle = 'rgba(224, 242, 254, 0.36)';
            ctx.strokeStyle = '#e0f2fe';
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.arc(bx, by, br, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }

        // Thẻ thông số đề dẫn bên phải (Zero Data Leakage)
        drawRoundRect(ctx, 508, 74, 252, 204, 10, '#0f172a', '#38bdf8', 2);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('BỆNH GIẢM ÁP THỢ LẶN', 524, 100);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Độ sâu lặn: h = 30 m', 524, 128);
        ctx.fillText('• Khối lượng riêng nước:', 524, 154);
        ctx.fillText('  ρ = 1000 kg/m³', 524, 176);
        ctx.fillText('• Áp suất khí quyển:', 524, 202);
        ctx.fillText('  p₀ = 1,013·10⁵ Pa; g = 9,8 m/s²', 524, 224);
        ctx.fillStyle = '#6ee7b7';
        ctx.fillText('• Nổi lên: p giảm → V_bọt N₂ tăng', 524, 254);
        ctx.restore();
    });

    // =========================================================================
    // 6. MH-C2-43: NGƯỜI NHÁI MANG BÌNH KHÍ NÉN 150 atm LẶN SỬA TÀU Ở ĐỘ SÂU 5 m
    // Ràng buộc riêng:
    // - KHÔNG lộ bán kính r1 hay thời gian 16 phút của ý c, d.
    // =========================================================================
    window.VLXTModels.register('MH-C2-43', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'NGƯỜI NHÁI SỬA THÂN TÀU Ở ĐỘ SÂU 5 m (BÌNH KHÍ 150 atm; T = const)');

        ctx.save();
        const surfY = 74, botY = 282;
        const seaGrad = ctx.createLinearGradient(0, surfY, 0, botY);
        seaGrad.addColorStop(0, 'rgba(56, 189, 248, 0.28)');
        seaGrad.addColorStop(1, 'rgba(2, 132, 199, 0.56)');
        ctx.fillStyle = seaGrad;
        ctx.fillRect(45, surfY, 445, botY - surfY);

        // Mặt biển
        ctx.strokeStyle = '#7dd3fc';
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        ctx.moveTo(45, surfY);
        ctx.lineTo(490, surfY);
        ctx.stroke();

        // Thân tàu biển ngâm một phần dưới mặt nước bên trái
        ctx.fillStyle = '#334155';
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(45, 56);
        ctx.lineTo(185, 56);
        ctx.lineTo(168, 228);
        ctx.lineTo(45, 228);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Vị trí chỗ hỏng trên thân tàu ở độ sâu 5 m (y = 214)
        const leakY = 214;
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(169, leakY, 7, 0, Math.PI * 2);
        ctx.fill();

        // Thước đo độ sâu 5 m
        const dimX = 210;
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(dimX - 6, surfY); ctx.lineTo(dimX + 6, surfY);
        ctx.moveTo(dimX, surfY); ctx.lineTo(dimX, leakY);
        ctx.moveTo(dimX - 6, leakY); ctx.lineTo(dimX + 6, leakY);
        ctx.stroke();
        ctx.fillStyle = '#fbbf24';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('5 m', dimX + 10, (surfY + leakY) / 2 + 5);

        // Người nhái đang sửa chữa tại vị trí hỏng
        const dx = 295, dy = 216;
        drawRoundRect(ctx, dx - 24, dy - 10, 46, 18, 8, '#0f172a', '#10b981', 2.5);
        drawRoundRect(ctx, dx - 18, dy - 19, 34, 10, 4, '#38bdf8', '#e0f2fe', 1.8);
        ctx.beginPath(); ctx.arc(dx - 32, dy - 2, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        // Bọt khí hình cầu thở ra từ người nhái nở to dần từ bán kính r0 khi nổi lên mặt thoáng
        for (let i = 0; i < 5; i++) {
            const p = (t * 0.28 + i / 5) % 1;
            const bx = 375 + Math.sin(p * 7 + i) * 12 + (i % 2) * 20;
            const by = 212 - p * (212 - surfY - 12);
            const br = 5.5 + p * 6.5;

            ctx.fillStyle = 'rgba(224, 242, 254, 0.38)';
            ctx.strokeStyle = '#f8fafc';
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.arc(bx, by, br, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }
        drawSubText(ctx, 'r', '0', 362, 224, { fontSize: 15, italic: true, color: '#fbbf24', align: 'right' });

        // Thẻ thông số đề dẫn bên phải (Zero Data Leakage)
        drawRoundRect(ctx, 508, 74, 252, 204, 10, '#0f172a', '#10b981', 2);
        ctx.fillStyle = '#6ee7b7';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('THÔNG SỐ LẶN SỬA TÀU', 524, 100);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Bình khí ban đầu: p₀ = 150 atm', 524, 128);
        ctx.fillText('• Quan sát 8 phút → giảm 20%', 524, 154);
        ctx.fillText('• Độ sâu chỗ hỏng: 5 m', 524, 180);
        ctx.fillText('• Sửa chữa: tiêu thụ gấp 1,5 lần', 524, 206);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('• Nhiệt độ khí không đổi', 524, 234);
        ctx.restore();
    });

    // =========================================================================
    // 7. MH-C2-44: CYLINDER HÌNH TRỤ CAO 152 cm ĐẬY PÍT-TÔNG NHẸ & CỘT THỦY NGÂN
    // Ràng buộc riêng:
    // - Vẽ trạng thái ban đầu: nửa dưới 76 cm chứa khí lý tưởng ở 600 K,
    //   nửa trên 76 cm chứa đầy thủy ngân Hg, p0 = 76 cmHg.
    // - Khi tăng nhiệt độ thì pít-tông đi lên đẩy một phần thủy ngân tràn ra ngoài.
    // - KHÔNG ghi sẵn 38 cm hay 114 cm làm lộ đáp án ý d.
    // =========================================================================
    window.VLXTModels.register('MH-C2-44', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'CYLINDER THẲNG ĐỨNG CAO 152 cm (BAN ĐẦU: 76 cm KHÍ + 76 cm Hg; T₁ = 600 K)');

        const saw = (t * 0.22) % 1; // Tăng nhiệt độ 1 chiều -> pít-tông đi lên -> thủy ngân tràn ra

        // --- BÊN TRÁI: TRẠNG THÁI BAN ĐẦU (CỐ ĐỊNH 76 cm KHÍ + 76 cm Hg) ---
        const c1x = 145, topY = 68, cylW = 92, cylH = 196;
        const midY = topY + cylH / 2; // 76 cm + 76 cm = 152 cm

        ctx.save();
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('TRẠNG THÁI BAN ĐẦU', c1x + cylW / 2, 54);

        // Nửa dưới 76 cm chứa khí lí tưởng (T1 = 600 K)
        ctx.fillStyle = 'rgba(56, 189, 248, 0.24)';
        ctx.fillRect(c1x, midY, cylW, cylH / 2);

        // Pít-tông nhẹ không ma sát ở chính giữa
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(c1x + 2, midY - 6, cylW - 4, 12);
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 2;
        ctx.strokeRect(c1x + 2, midY - 6, cylW - 4, 12);

        // Nửa trên 76 cm chứa đầy thủy ngân Hg tới miệng trên
        ctx.fillStyle = 'rgba(148, 163, 184, 0.65)';
        ctx.fillRect(c1x + 2, topY, cylW - 4, midY - 6 - topY);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('Hg', c1x + cylW / 2, topY + 42);
        ctx.fillStyle = '#7dd3fc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('Khí (600 K)', c1x + cylW / 2, midY + 52);

        // Thành xi-lanh hở miệng trên (drawOpenCup)
        drawOpenCup(ctx, c1x, topY, cylW, cylH, 0, { wallColor: '#cbd5e1', wallWidth: 3.4 });

        // Thước kích thước 76 cm trên và 76 cm dưới
        const dim1X = c1x - 14;
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(dim1X - 5, topY); ctx.lineTo(dim1X + 5, topY);
        ctx.moveTo(dim1X, topY); ctx.lineTo(dim1X, midY);
        ctx.moveTo(dim1X - 5, midY); ctx.lineTo(dim1X + 5, midY);
        ctx.moveTo(dim1X, midY); ctx.lineTo(dim1X, topY + cylH);
        ctx.moveTo(dim1X - 5, topY + cylH); ctx.lineTo(dim1X + 5, topY + cylH);
        ctx.stroke();
        ctx.fillStyle = '#fbbf24';
        ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('76 cm', dim1X - 8, (topY + midY) / 2 + 5);
        ctx.fillText('76 cm', dim1X - 8, (midY + topY + cylH) / 2 + 5);

        // --- BÊN PHẢI: KHI TĂNG NHIỆT ĐỘ -> PÍT-TÔNG ĐI LÊN ĐẨY THỦY NGÂN TRÀN RA ---
        const c2x = 365;
        const risePx = saw * (cylH * 0.25); // dịch chuyển 1 chiều lên trên
        const pis2Y = midY - risePx;

        ctx.fillStyle = '#fb923c';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('TĂNG NHIỆT ĐỘ (Hg TRÀN RA)', c2x + cylW / 2, 54);

        // Khoang khí giãn nở bên dưới pít-tông
        ctx.fillStyle = 'rgba(251, 146, 60, 0.28)';
        ctx.fillRect(c2x, pis2Y, cylW, topY + cylH - pis2Y);

        // Pít-tông đi lên
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(c2x + 2, pis2Y - 6, cylW - 4, 12);
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 2;
        ctx.strokeRect(c2x + 2, pis2Y - 6, cylW - 4, 12);

        // Phần thủy ngân còn lại phía trên pít-tông tới miệng ống
        ctx.fillStyle = 'rgba(148, 163, 184, 0.65)';
        ctx.fillRect(c2x + 2, topY, cylW - 4, pis2Y - 6 - topY);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('Hg', c2x + cylW / 2, topY + (pis2Y - 6 - topY) / 2 + 5);

        // Dòng thủy ngân tràn qua 2 mép miệng trên xi-lanh
        if (saw > 0.05) {
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(c2x, topY);
            ctx.quadraticCurveTo(c2x - 14, topY + 6, c2x - 14, topY + 26 + saw * 42);
            ctx.moveTo(c2x + cylW, topY);
            ctx.quadraticCurveTo(c2x + cylW + 14, topY + 6, c2x + cylW + 14, topY + 26 + saw * 42);
            ctx.stroke();
        }

        // Thành xi-lanh hở miệng trên (drawOpenCup)
        drawOpenCup(ctx, c2x, topY, cylW, cylH, 0, { wallColor: '#cbd5e1', wallWidth: 3.4 });

        // Ngọn lửa cấp nhiệt dưới đáy xi-lanh phải
        const fl = 12 + Math.sin(t * 14) * 3;
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.moveTo(c2x + cylW / 2 - 10, topY + cylH + 18);
        ctx.quadraticCurveTo(c2x + cylW / 2, topY + cylH + 18 - fl * 1.6, c2x + cylW / 2 + 10, topY + cylH + 18);
        ctx.closePath();
        ctx.fill();

        // Thẻ thông số đề dẫn bên phải (Zero Data Leakage - KHÔNG ghi 38 cm hay 114 cm)
        drawRoundRect(ctx, 505, 76, 255, 184, 10, '#0f172a', '#fbbf24', 2);
        ctx.fillStyle = '#fbbf24';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('THÔNG SỐ CYLINDER & THỦY NGÂN', 520, 102);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Chiều cao trụ: H = 152 cm', 520, 130);
        ctx.fillText('• Ban đầu: 76 cm khí + 76 cm Hg', 520, 156);
        ctx.fillText('• Nhiệt độ đầu: T₁ = 600 K', 520, 182);
        ctx.fillText('• Áp suất khí quyển: p₀ = 76 cmHg', 520, 208);
        ctx.fillStyle = '#fb923c';
        ctx.fillText('• Nung nóng → 1/2 Hg tràn ra ngoài', 520, 236);
        ctx.restore();
    });

    // =========================================================================
    // 8. MH-C2-45: CYLINDER CHỨA KHÍ HYDROGEN ĐẨY CỘT CHẤT LỎNG TRÀN HẾT RA NGOÀI
    // =========================================================================
    window.VLXTModels.register('MH-C2-45', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'CYLINDER KHÍ HYDROGEN CẤP NHIỆT CHẬM (Q = 119 J; p_lỏng = p₀/9)');

        const saw = (t * 0.22) % 1;
        const cx = 195, topY = 64, cylW = 112, cylH = 200;
        // Tổng chiều cao chia 4 phần ban đầu: 2 phần khí Hidro (dưới), 1 phần chất lỏng (giữa), 1 phần trống (trên)
        const unitH = cylH / 4; // 50px
        const risePx = saw * (unitH * 2); // Khi chất lỏng tràn hết ra ngoài thì pít-tông lên tới miệng trên!
        const pisY = topY + unitH * 2 - risePx;
        const liqTopY = Math.max(topY, pisY - unitH);

        ctx.save();
        // Áp suất khí quyển p0 phía trên miệng hở
        drawArrow(ctx, cx + cylW / 2, 32, cx + cylW / 2, topY - 2, '#fbbf24', 2.8, 8);
        drawSubText(ctx, 'p', '0', cx + cylW / 2 + 12, 48, { fontSize: 16, italic: true, color: '#fbbf24' });

        // Khoang khí Hidro bên dưới pít-tông
        ctx.fillStyle = 'rgba(56, 189, 248, 0.26)';
        ctx.fillRect(cx, pisY, cylW, topY + cylH - pisY);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Hidro', cx + cylW / 2, pisY + (topY + cylH - pisY) / 2 + 5);

        // Pít-tông nhẹ
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(cx + 2, pisY - 6, cylW - 4, 12);
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 2.2;
        ctx.strokeRect(cx + 2, pisY - 6, cylW - 4, 12);

        // Cột chất lỏng phía trên pít-tông (gây áp suất phụ p0/9)
        if (pisY - 6 > liqTopY) {
            ctx.fillStyle = 'rgba(148, 163, 184, 0.55)';
            ctx.fillRect(cx + 2, liqTopY, cylW - 4, pisY - 6 - liqTopY);
        }

        // Chất lỏng tràn ra ngoài khi chạm miệng trên (saw > 0.45)
        if (saw > 0.45) {
            const ov = (saw - 0.45) / 0.55;
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(cx, topY);
            ctx.quadraticCurveTo(cx - 16, topY + 8, cx - 16, topY + 24 + ov * 58);
            ctx.moveTo(cx + cylW, topY);
            ctx.quadraticCurveTo(cx + cylW + 16, topY + 8, cx + cylW + 16, topY + 24 + ov * 58);
            ctx.stroke();
        }

        // Thành xi-lanh hở miệng trên (drawOpenCup)
        drawOpenCup(ctx, cx, topY, cylW, cylH, 0, { wallColor: '#cbd5e1', wallWidth: 3.4 });

        // Mũi tên cấp nhiệt chậm Q = 119 J từ đáy bình
        drawArrow(ctx, cx + cylW / 2, 294, cx + cylW / 2, topY + cylH + 3, '#ef4444', 3.2, 8);
        ctx.fillStyle = '#fca5a5';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Q = 119 J', cx + cylW / 2 + 12, 288);

        // Chú thích callout các tỉ lệ thể tích ban đầu
        drawCallout(ctx, cx, topY + 24, 24, 68, ['Khoảng trống trên (V)'], '#94a3b8');
        drawCallout(ctx, cx, topY + 74, 24, 134, ['Cột chất lỏng (V)', 'Áp suất phụ p₀/9'], '#cbd5e1');
        drawCallout(ctx, cx, topY + 150, 24, 206, ['Khí Hidro (2V)', 'Cấp nhiệt giãn nở'], '#38bdf8');

        // Thẻ thông số đề dẫn bên phải (Zero Data Leakage)
        drawRoundRect(ctx, 395, 68, 365, 200, 10, '#0f172a', '#38bdf8', 2);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('THÔNG SỐ BIẾN ĐỔI KHÍ HIDRO', 412, 94);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Ban đầu: V_lỏng = V_trống = 1/2 V_Hidro', 412, 122);
        ctx.fillText('• Áp suất phụ cột chất lỏng: p_lỏng = p₀/9', 412, 148);
        ctx.fillText('• Áp suất khí quyển: p₀ = 10⁵ N/m²', 412, 174);
        ctx.fillText('• Nhiệt lượng cung cấp: Q = 119 J', 412, 200);
        ctx.fillText('• Nội năng khí Hidro: U = (5/2)nRT', 412, 226);
        ctx.fillStyle = '#6ee7b7';
        ctx.fillText('• Toàn bộ chất lỏng bị đẩy tràn ra ngoài', 412, 252);
        ctx.restore();
    });

    // =========================================================================
    // 9. MH-C2-46: LỌ GIÁC HƠI Y HỌC CỔ TRUYỀN ÚP TRÊN BỀ MẶT DA LƯNG
    // =========================================================================
    window.VLXTModels.register('MH-C2-46', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'LỌ GIÁC HƠI ÚP TRÊN DA (t = 353°C → t₀ = 27,0°C; p₀ = 10⁵ Pa; S = 28,0 cm²)');

        const saw = (t * 0.22) % 1; // Khí trong lọ nguội dần -> áp suất giảm -> hút phồng nhẹ vùng da
        const bulgeH = 4 + saw * 14; // Da phồng nhẹ lên bên trong miệng lọ

        ctx.save();
        // Bề mặt da lưng của người bệnh & phần da bị hút phồng bên trong miệng lọ
        const skinY = 228;
        const cx = 235;
        const mouthHalf = 46;

        ctx.fillStyle = 'rgba(251, 146, 60, 0.24)';
        ctx.strokeStyle = '#fb923c';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(45, skinY);
        ctx.lineTo(cx - mouthHalf, skinY);
        // Phần da bị hút phồng nhẹ vào trong miệng lọ
        ctx.quadraticCurveTo(cx, skinY - bulgeH * 2, cx + mouthHalf, skinY);
        ctx.lineTo(425, skinY);
        ctx.stroke();
        ctx.lineTo(425, 274);
        ctx.lineTo(45, 274);
        ctx.closePath();
        ctx.fill();

        // Lọ giác hơi thủy tinh hình cầu úp ngược trên da (miệng lọ tại skinY)
        const cupTopY = 82;
        const rRed = Math.round(239 - saw * 183);
        const rBlue = Math.round(68 + saw * 180);
        const gasGrad = ctx.createRadialGradient(cx, 152, 10, cx, 152, 76);
        gasGrad.addColorStop(0, `rgba(${rRed}, 130, ${rBlue}, 0.42)`);
        gasGrad.addColorStop(1, `rgba(${rRed}, 110, ${rBlue}, 0.22)`);

        ctx.fillStyle = gasGrad;
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 3.4;
        ctx.beginPath();
        ctx.moveTo(cx - mouthHalf, skinY);
        ctx.bezierCurveTo(cx - 84, 192, cx - 82, cupTopY, cx, cupTopY);
        ctx.bezierCurveTo(cx + 82, cupTopY, cx + 84, 192, cx + mouthHalf, skinY);
        ctx.stroke();
        ctx.fill();

        // Các mũi tên áp suất khí quyển p0 ép bên ngoài lọ & lực hút đẩy vùng da phồng lên
        drawArrow(ctx, cx - 96, 134, cx - 68, 148, '#fbbf24', 2.8, 7);
        drawArrow(ctx, cx + 96, 134, cx + 68, 148, '#fbbf24', 2.8, 7);
        drawArrow(ctx, cx, skinY + 24, cx, skinY - bulgeH + 2, '#ef4444', 3, 8);

        // Chú thích callout
        drawCallout(ctx, cx - 64, 118, 28, 74, ['Lọ giác hơi thủy tinh', 'Úp kín lên bề mặt da'], '#cbd5e1');
        drawCallout(ctx, cx, skinY - bulgeH, 28, 168, ['Vùng da bị hút phồng', 'Chênh lệch áp suất Δp'], '#ef4444');

        // Thẻ thông số đề dẫn bên phải (Zero Data Leakage)
        drawRoundRect(ctx, 445, 72, 315, 196, 10, '#0f172a', '#fb923c', 2);
        ctx.fillStyle = '#fb923c';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('THÔNG SỐ LỌ GIÁC HƠI', 462, 98);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Nhiệt độ khí khi úp: t = 353°C', 462, 126);
        ctx.fillText('• Nhiệt độ môi trường: t₀ = 27,0°C', 462, 152);
        ctx.fillText('• Áp suất khí quyển: p₀ = 1,0·10⁵ Pa', 462, 178);
        ctx.fillText('• Diện tích miệng lọ: S = 28,0 cm²', 462, 204);
        ctx.fillStyle = '#6ee7b7';
        ctx.fillText('• Nguội đi → p_trong giảm → hút da', 462, 234);
        ctx.restore();
    });

    // =========================================================================
    // 10. MH-C2-48: TÀU NGẦM Ở ĐỘ SÂU 120 m MỞ BÌNH KHÍ NÉN ĐẨY NƯỚC THÙNG DẰN
    // =========================================================================
    window.VLXTModels.register('MH-C2-48', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'TÀU NGẦM Ở ĐỘ SÂU 120 m MỞ BÌNH KHÍ (60 lít; 10 MPa; 27°C → 2°C)');

        const saw = (t * 0.24) % 1; // Mở van khí nén -> khí giãn nở đẩy nước ra khỏi thùng dằn

        ctx.save();
        // Mặt biển & Độ sâu 120 m
        const surfY = 66;
        ctx.fillStyle = 'rgba(14, 116, 144, 0.34)';
        ctx.fillRect(35, surfY, 455, 218);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.6;
        ctx.beginPath(); ctx.moveTo(35, surfY); ctx.lineTo(490, surfY); ctx.stroke();

        // Thước độ sâu 120 m bên trái
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(54, surfY); ctx.lineTo(66, surfY);
        ctx.moveTo(60, surfY); ctx.lineTo(60, 198);
        ctx.moveTo(54, 198); ctx.lineTo(66, 198);
        ctx.stroke();
        ctx.fillStyle = '#fbbf24';
        ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('120 m', 68, 136);

        // Thân tàu ngầm 2 lớp vỏ
        const sx = 128, sy = 148, sw = 325, sh = 96;
        // Tháp chỉ huy tàu ngầm
        drawRoundRect(ctx, sx + 125, sy - 28, 56, 30, 8, '#1e293b', '#94a3b8', 2.6);
        // Vỏ ngoài tàu ngầm
        drawRoundRect(ctx, sx, sy, sw, sh, 44, '#0f172a', '#cbd5e1', 3);

        // Thùng chứa nước dằn ở giữa hai lớp vỏ (bên trái = khí giãn nở đẩy nước, bên phải = nước biển bị đẩy ra)
        const bx = sx + 54, by = sy + 18, bw = 216, bh = 60;
        drawRoundRect(ctx, bx, by, bw, bh, 12, '#1e293b', '#38bdf8', 2.2);

        const splitX = bx + 48 + saw * 124; // Ranh giới khí đẩy nước sang phải
        // Phần khí giãn nở (2°C)
        ctx.fillStyle = 'rgba(251, 191, 36, 0.34)';
        ctx.fillRect(bx + 2, by + 2, splitX - bx - 2, bh - 4);
        // Phần nước biển còn lại trong thùng dằn
        ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.fillRect(splitX, by + 2, bx + bw - splitX - 2, bh - 4);

        // Bình khí nén cao áp 60 lít (10 MPa, 27°C) đặt ở khoang đầu tàu
        drawRoundRect(ctx, bx + 8, by + 12, 34, 36, 8, '#f59e0b', '#fef08a', 2);
        drawArrow(ctx, splitX - 18, by + 30, splitX + 14, by + 30, '#fbbf24', 2.8, 7);

        // Nước biển bị đẩy phun ra dưới đáy thùng dằn
        drawArrow(ctx, bx + bw - 22, by + bh, bx + bw - 22, by + bh + 28, '#38bdf8', 3, 8);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 12.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Khí giãn nở (2°C)', bx + 62, by + 24);
        ctx.fillText('Nước đẩy ra', bx + bw - 48, by + 46);

        // Thẻ thông số đề dẫn bên phải (Zero Data Leakage)
        drawRoundRect(ctx, 505, 68, 255, 212, 10, '#0f172a', '#38bdf8', 2);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('THÔNG SỐ TÀU NGẦM', 520, 94);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Độ sâu lặn: h = 120 m', 520, 120);
        ctx.fillText('• Bình khí nén: V₁ = 60 lít', 520, 144);
        ctx.fillText('  p₁ = 10 MPa; t₁ = 27°C', 520, 166);
        ctx.fillText('• Sau giãn nở: t₂ = 2°C', 520, 192);
        ctx.fillText('• Nước biển: ρ = 1030 kg/m³', 520, 218);
        ctx.fillText('• p₀ = 1,013·10⁵ Pa; g = 9,81 m/s²', 520, 244);
        ctx.restore();
    });

    // =========================================================================
    // 11. MH-C2-49: MÔ HÌNH PHỔI TRONG HỆ HÔ HẤP (CHAI NHỰA, 2 BÓNG BAY & MÀNG CAO SU)
    // =========================================================================
    window.VLXTModels.register('MH-C2-49', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'MÔ HÌNH PHỔI TRONG HỆ HÔ HẤP (VỎ CHAI 1,0–1,5 lít & MÀNG CƠ HOÀNH)');

        // Kéo chậm màng cao su (cơ hoành) xuống dưới 1 chiều sawtooth -> 2 quả bóng phình to
        const saw = (t * 0.25) % 1;
        const pullY = saw * 26;
        const lungR = 18 + saw * 14;

        ctx.save();
        const cx = 235;
        // Vỏ chai nhựa trong suốt (lồng ngực)
        const bottleTop = 86, bottleBot = 224, bw = 136;
        ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 3;
        ctx.beginPath();
        // Cổ chai trên
        ctx.moveTo(cx - 22, 62);
        ctx.lineTo(cx - 22, bottleTop);
        ctx.quadraticCurveTo(cx - bw / 2, bottleTop + 14, cx - bw / 2, bottleTop + 38);
        ctx.lineTo(cx - bw / 2, bottleBot);
        ctx.moveTo(cx + 22, 62);
        ctx.lineTo(cx + 22, bottleTop);
        ctx.quadraticCurveTo(cx + bw / 2, bottleTop + 14, cx + bw / 2, bottleTop + 38);
        ctx.lineTo(cx + bw / 2, bottleBot);
        ctx.stroke();

        // Nút đậy kín cổ chai
        drawRoundRect(ctx, cx - 25, 58, 50, 14, 4, '#475569', '#94a3b8', 2);

        // Ống hút chữ Y dẫn không khí từ bên ngoài vào 2 quả bóng bay
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cx, 36);
        ctx.lineTo(cx, 118);
        ctx.lineTo(cx - 32, 142);
        ctx.moveTo(cx, 118);
        ctx.lineTo(cx + 32, 142);
        ctx.stroke();

        // Mũi tên không khí bên ngoài tràn qua ống hút vào 2 quả bóng
        drawArrow(ctx, cx - 16, 26, cx - 16, 54, '#38bdf8', 2.6, 6);

        // 2 quả bóng bay (2 lá phổi) phình to bên trong chai
        [-32, 32].forEach(dx => {
            const lx = cx + dx;
            const ly = 144 + lungR * 1.15;
            ctx.fillStyle = 'rgba(244, 114, 182, 0.45)';
            ctx.strokeStyle = '#f472b6';
            ctx.lineWidth = 2.8;
            ctx.beginPath();
            ctx.ellipse(lx, ly, lungR * 0.82, lungR * 1.15, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });

        // Màng cao su (cơ hoành) bịt kín đáy chai & kéo xuống dưới
        const diapY = bottleBot + pullY;
        ctx.fillStyle = 'rgba(245, 158, 11, 0.35)';
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3.4;
        ctx.beginPath();
        ctx.moveTo(cx - bw / 2, bottleBot);
        ctx.quadraticCurveTo(cx, diapY + 12, cx + bw / 2, bottleBot);
        ctx.stroke();
        ctx.fill();

        // Mũi tên lực kéo màng cao su xuống dưới
        drawArrow(ctx, cx, diapY + 8, cx, diapY + 36, '#fbbf24', 3, 8);

        // Chú thích callout
        drawCallout(ctx, cx, 96, 26, 76, ['Ống hút chữ Y', 'Dẫn khí từ bên ngoài'], '#f8fafc');
        drawCallout(ctx, cx - 32 - lungR * 0.7, 165, 26, 150, ['2 quả bóng bay (Phổi)', 'Phình to khi kéo màng'], '#f472b6');
        drawCallout(ctx, cx - bw / 2, bottleBot + 4, 26, 224, ['Màng cao su (Cơ hoành)', 'Kéo xuống → V_chai tăng'], '#f59e0b');

        // Thẻ giải thích cơ chế vật lý bên phải
        drawRoundRect(ctx, 395, 76, 365, 188, 10, '#0f172a', '#f472b6', 2);
        ctx.fillStyle = '#f472b6';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('NGUYÊN LÝ HÔ HẤP TRONG MÔ HÌNH', 412, 102);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Vỏ chai kín: Thể tích 1,0–1,5 lít', 412, 130);
        ctx.fillText('• Kéo chậm màng cao su xuống dưới:', 412, 156);
        ctx.fillText('  → Thể tích phần khí trong chai tăng', 412, 180);
        ctx.fillText('  → Áp suất khí trong chai giảm (< p_kq)', 412, 204);
        ctx.fillStyle = '#6ee7b7';
        ctx.fillText('  → Không khí ngoài tràn vào làm phồng bóng', 412, 232);
        ctx.restore();
    });

    // =========================================================================
    // 12. MH-C2-50: Ô TÔ 4 BÁNH VƯỢT SA MẠC (t0 = 5,0°C; V = 1,2 m³; p0 = 2,5 bar)
    // =========================================================================
    window.VLXTModels.register('MH-C2-50', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'LỐP XE Ô TÔ VƯỢT SA MẠC (t₀ = 5,0°C; V = 1,2 m³; p₀ = 2,5 bar)');

        ctx.save();
        // Mặt cắt lốp xe & La-zăng bên trái
        const cx = 225, cy = 166;
        const rOuter = 94, rInner = 46;

        // Vành cao su lốp xe chứa khí nén
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(cx, cy, rOuter, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Khoang khí trong lốp xe
        ctx.fillStyle = 'rgba(245, 158, 11, 0.22)';
        ctx.beginPath();
        ctx.arc(cx, cy, rOuter - 8, 0, Math.PI * 2);
        ctx.fill();

        // La-zăng hợp kim ở tâm bánh xe
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, rInner, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Các nan hoa la-zăng
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 4;
        for (let k = 0; k < 5; k++) {
            const ang = k * (Math.PI * 2) / 5 + t * 0.6;
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(ang) * 10, cy + Math.sin(ang) * 10);
            ctx.lineTo(cx + Math.cos(ang) * (rInner - 2), cy + Math.sin(ang) * (rInner - 2));
            ctx.stroke();
        }

        // Các phân tử khí chuyển động nhiệt va chạm thành trong của lốp gây áp suất
        for (let i = 0; i < 16; i++) {
            const ang = (i * Math.PI * 2) / 16 + t * 0.8;
            const osc = Math.sin(t * 7 + i * 1.7) * 12;
            const rad = (rInner + rOuter - 8) / 2 + osc;
            const px = cx + Math.cos(ang) * rad;
            const py = cy + Math.sin(ang) * rad;
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.arc(px, py, 3.4, 0, Math.PI * 2);
            ctx.fill();
        }

        // Mũi tên áp suất khí tác dụng vuông góc lên thành trong của lốp
        for (let i = 0; i < 6; i++) {
            const ang = (i * Math.PI * 2) / 6;
            drawArrow(ctx, cx + Math.cos(ang) * 56, cy + Math.sin(ang) * 56, cx + Math.cos(ang) * 82, cy + Math.sin(ang) * 82, '#fbbf24', 2.4, 6);
        }

        // Chú thích callout
        drawCallout(ctx, cx - 72, cy - 58, 22, 68, ['Thành trong lốp xe', 'Phân tử khí va chạm gây áp suất'], '#fbbf24');

        // Thẻ thông số đề dẫn bên phải (Zero Data Leakage)
        drawRoundRect(ctx, 415, 72, 345, 196, 10, '#0f172a', '#fbbf24', 2);
        ctx.fillStyle = '#fbbf24';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('THÔNG SỐ LỐP Ô TÔ 4 BÁNH', 432, 98);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Nhiệt độ sáng sớm: t₀ = 5,0°C', 432, 126);
        ctx.fillText('• Thể tích mỗi lốp: V = 1,2 m³', 432, 152);
        ctx.fillText('• Áp suất ban đầu: p₀ = 2,5 bar', 432, 178);
        ctx.fillText('  (1 bar = 10⁵ Pa)', 432, 200);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('• Bỏ qua sự dãn nở vì nhiệt của lốp', 432, 232);
        ctx.restore();
    });

    // =========================================================================
    // 13. MH-C2-51: XE BÁN TẢI CHẠY CAO TỐC MÙA HÈ (27°C; V = 120 lít; p = 240 kPa)
    // =========================================================================
    window.VLXTModels.register('MH-C2-51', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'LỐP XE BÁN TẢI CHẠY CAO TỐC MÙA HÈ (t = 27°C; V = 120 lít; p = 240 kPa)');

        const saw = (t * 0.22) % 1; // Nhiệt độ tăng 1 chiều -> áp suất trong lốp tăng đẳng tích

        ctx.save();
        // Lốp xe bán tải bên trái
        const cx = 210, cy = 166;
        const rOuter = 94, rInner = 46;

        // Nền đường nhựa nóng bức xạ nhiệt lên lốp
        ctx.fillStyle = '#334155';
        ctx.fillRect(45, cy + rOuter, 330, 14);
        for (let i = 0; i < 4; i++) {
            const hx = 135 + i * 50;
            const hy = cy + rOuter - 2 - saw * 12;
            drawArrow(ctx, hx, cy + rOuter, hx, hy, '#ef4444', 2.4, 6);
        }

        // Lốp xe (màu chuyển ấm dần theo nhiệt độ)
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(cx, cy, rOuter, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = `rgba(239, 68, 68, ${(0.18 + saw * 0.25).toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(cx, cy, rOuter - 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, rInner, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Đồng hồ đo áp suất lốp gắn bên cạnh
        drawPressureGauge(ctx, 354, 114, 32, Math.PI * 0.95 + saw * Math.PI * 0.45, 'kPa', '', '#ef4444');
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(cx + rOuter - 6, cy - 34);
        ctx.lineTo(324, 124);
        ctx.stroke();

        // Thẻ thông số đề dẫn bên phải (Zero Data Leakage)
        drawRoundRect(ctx, 415, 72, 345, 196, 10, '#0f172a', '#ef4444', 2);
        ctx.fillStyle = '#fca5a5';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('THÔNG SỐ LỐP XE BÁN TẢI', 432, 98);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Nhiệt độ sáng sớm: t = 27°C', 432, 126);
        ctx.fillText('• Thể tích mỗi lốp: V = 120 lít', 432, 152);
        ctx.fillText('• Áp suất ban đầu: p = 240 kPa', 432, 178);
        ctx.fillText('• Hằng số Boltzmann: k = 1,38·10⁻²³ J/K', 432, 204);
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('• Nhiệt độ tăng → áp suất lốp tăng đẳng tích', 432, 234);
        ctx.restore();
    });

    // =========================================================================
    // 14. MH-C2-52: SÚNG BẮN ĐINH KHÍ NÉN NỐI VỚI BÌNH KHÍ NÉN (10 lít; 12 atm; 27°C)
    // =========================================================================
    window.VLXTModels.register('MH-C2-52', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'SÚNG BẮN ĐINH KHÍ NÉN & BÌNH KHÍ (V = 10 lít; p = 12 atm; 27°C)');

        const saw = (t * 0.35) % 1; // Bắn đinh 1 chiều -> reset

        ctx.save();
        // 1. Bình khí nén 10 lít (12 atm, 27°C) bên trái
        const tx = 58, ty = 92, tw = 96, th = 166;
        const tGrad = ctx.createLinearGradient(tx, ty, tx + tw, ty);
        tGrad.addColorStop(0, '#0284c7');
        tGrad.addColorStop(0.5, '#38bdf8');
        tGrad.addColorStop(1, '#0369a1');
        drawRoundRect(ctx, tx, ty, tw, th, 24, tGrad, '#bae6fd', 2.8);

        ctx.fillStyle = '#0f172a';
        ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('BÌNH KHÍ', tx + tw / 2, ty + 54);
        ctx.font = '800 13.5px "DM Mono", monospace';
        ctx.fillText('10 lít', tx + tw / 2, ty + 82);
        ctx.fillText('12 atm', tx + tw / 2, ty + 104);
        ctx.fillText('27°C', tx + tw / 2, ty + 126);

        // Rơ-le áp suất & Đồng hồ áp suất trên đỉnh bình khí nén
        const vx = tx + tw / 2;
        drawRoundRect(ctx, vx - 18, ty - 24, 36, 24, 5, '#1e293b', '#10b981', 2.2);
        drawPressureGauge(ctx, vx - 34, ty - 34, 20, Math.PI * 1.4, '', '', '#10b981');
        drawCallout(ctx, vx + 18, ty - 14, 174, 54, ['Rơ-le áp suất', 'Đóng nạp lại khi p < 4 atm'], '#10b981');

        // 2. Dây dẫn khí nén nối từ bình sang tay cầm súng bắn đinh
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(vx + 18, ty - 12);
        ctx.bezierCurveTo(235, ty - 12, 225, 252, 295, 226);
        ctx.stroke();

        // 3. Súng bắn đinh khí nén bên phải
        const gx = 285, gy = 114;
        // Tay cầm súng
        drawRoundRect(ctx, gx + 10, gy + 44, 28, 72, 6, '#334155', '#94a3b8', 2.6);
        // Thân súng bắn đinh
        drawRoundRect(ctx, gx, gy, 134, 48, 10, '#0284c7', '#e0f2fe', 2.8);
        // Băng đinh & Mũi súng
        drawRoundRect(ctx, gx + 108, gy + 48, 22, 62, 4, '#475569', '#cbd5e1', 2.2);
        drawRoundRect(ctx, gx + 134, gy + 14, 18, 20, 3, '#94a3b8', '#f8fafc', 2);

        // Đinh sắt phóng vào tấm gỗ khi bóp cò
        const nailX = gx + 154 + saw * 24;
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(nailX, gy + 24);
        ctx.lineTo(nailX + 26, gy + 24);
        ctx.stroke();

        // Khối gỗ nhận đinh
        drawRoundRect(ctx, 466, 98, 32, 132, 5, '#78350f', '#d97706', 2.4);

        // Thẻ thông số đề dẫn bên phải (Zero Data Leakage)
        drawRoundRect(ctx, 514, 72, 246, 196, 10, '#0f172a', '#38bdf8', 2);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('THÔNG SỐ SÚNG BẮN ĐINH', 528, 98);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Bình khí: V = 10 lít; p = 12 atm', 528, 126);
        ctx.fillText('• Nhiệt độ không đổi: t = 27°C', 528, 152);
        ctx.fillText('• Rơ-le đóng nạp lại khi p < 4 atm', 528, 178);
        ctx.fillText('• Mỗi lần bắn giải phóng:', 528, 204);
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('  0,5 lít khí ở áp suất 1 atm', 528, 228);
        ctx.restore();
    });

})(window);
            })({ VLXTModels: tempVLXT });
        } catch(e) {
            if (typeof console !== 'undefined') console.error('Lỗi nạp Canvas chunk:', e);
        }



        try {
            (function(window) {
/**
 * ============================================================================
 * BỘ MÔ HÌNH CANVAS VẬT LÍ HYDROGEN V2 - CHƯƠNG 3 - CA 5 (CÂU 53 -> CÂU 68)
 * Gồm 16 mô hình: MH-C3-53, MH-C3-54, MH-C3-55, MH-C3-56, MH-C3-57, MH-C3-58,
 *                MH-C3-59, MH-C3-60, MH-C3-61, MH-C3-62, MH-C3-63, MH-C3-64,
 *                MH-C3-65, MH-C3-66, MH-C3-67, MH-C3-68
 * Chuẩn khung logic: 780 x 305 | Tuân thủ 10 Quy Tắc Vàng VLXT_MOTION_SPEC.md
 * ============================================================================
 */
(function(window) {
    'use strict';

    window.VLXTModels = window.VLXTModels || {
        _registry: {},
        register: function(id, fn) {
            this._registry[id] = fn;
        }
    };

    // =========================================================================
    // HỆ THỐNG HÀM TRỢ GIÚP CHUẨN VLXT (CORE HELPERS)
    // =========================================================================
    function clearCanvas(ctx, w, h) {
        ctx.clearRect(0, 0, w, h);
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#060b19');
        grad.addColorStop(1, '#0a1226');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
        ctx.lineWidth = 1;
        for (let x = 20; x < w; x += 26) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (let y = 20; y < h; y += 26) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }
        ctx.restore();
    }

    function drawRoundRect(ctx, x, y, w, h, r, fill, stroke, lineWidth = 2.8) {
        ctx.save();
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(x, y, w, h, r);
        } else {
            ctx.moveTo(x + r, y);
            ctx.lineTo(x + w - r, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + r);
            ctx.lineTo(x + w, y + h - r);
            ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            ctx.lineTo(x + r, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - r);
            ctx.lineTo(x, y + r);
            ctx.quadraticCurveTo(x, y, x + r, y);
            ctx.closePath();
        }
        if (fill) { ctx.fillStyle = fill; ctx.fill(); }
        if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); }
        ctx.restore();
    }

    function drawSubText(ctx, base, sub, x, y, opts = {}) {
        const fontSize = opts.fontSize || 15;
        const subSize = Math.round(fontSize * 0.74);
        const weight = opts.weight || '700';
        const italic = opts.italic ? 'italic ' : '';
        const color = opts.color || '#f8fafc';
        const align = opts.align || 'left';
        ctx.save();
        ctx.fillStyle = color;
        ctx.textBaseline = opts.baseline || 'alphabetic';
        ctx.font = `${italic}${weight} ${fontSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
        const baseW = ctx.measureText(base).width;
        ctx.font = `${weight} ${subSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
        const subW = sub ? ctx.measureText(sub).width : 0;
        const totalW = baseW + subW;
        let startX = x;
        if (align === 'center') startX = x - totalW / 2;
        else if (align === 'right') startX = x - totalW;

        ctx.font = `${italic}${weight} ${fontSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
        ctx.fillText(base, startX, y);
        if (sub) {
            ctx.font = `${weight} ${subSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
            ctx.fillText(sub, startX + baseW + 1, y + Math.round(fontSize * 0.28));
        }
        if (opts.vector) {
            const vy = y - fontSize + 1;
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.moveTo(startX, vy);
            ctx.lineTo(startX + baseW + 2, vy);
            ctx.lineTo(startX + baseW - 2, vy - 3);
            ctx.moveTo(startX + baseW + 2, vy);
            ctx.lineTo(startX + baseW - 2, vy + 3);
            ctx.stroke();
        }
        ctx.restore();
        return totalW;
    }

    function drawArrow(ctx, x1, y1, x2, y2, color = '#38bdf8', width = 3, headLen = 9) {
        const angle = Math.atan2(y2 - y1, x2 - x1);
        ctx.save();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    // Ký hiệu từ trường hướng vào trong mặt phẳng hình vẽ (⊗ B)
    function drawCrossB(ctx, x, y, r = 9, color = '#38bdf8') {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.stroke();
        const d = r * 0.62;
        ctx.beginPath();
        ctx.moveTo(x - d, y - d); ctx.lineTo(x + d, y + d);
        ctx.moveTo(x + d, y - d); ctx.lineTo(x - d, y + d);
        ctx.stroke();
        ctx.restore();
    }

    // Ký hiệu từ trường hướng ra ngoài mặt phẳng hình vẽ (⊙ B)
    function drawDotB(ctx, x, y, r = 9, color = '#38bdf8') {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y, 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    function drawCallout(ctx, targetX, targetY, boxX, boxY, lines, borderColor = '#38bdf8', textColor = '#f8fafc') {
        const lineArr = Array.isArray(lines) ? lines : [lines];
        ctx.save();
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        const padX = 10;
        const lineH = 18;
        const boxH = lineArr.length * lineH + 10;
        let maxW = 0;
        lineArr.forEach(l => {
            const mw = ctx.measureText(l).width;
            if (mw > maxW) maxW = mw;
        });
        const boxW = maxW + padX * 2;
        const anchorX = (boxX + boxW / 2 < targetX) ? (boxX + boxW) : (boxX > targetX ? boxX : boxX + boxW / 2);
        const anchorY = boxY + boxH / 2;

        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(targetX, targetY);
        ctx.lineTo(anchorX, anchorY);
        ctx.stroke();

        ctx.fillStyle = borderColor;
        ctx.beginPath();
        ctx.arc(targetX, targetY, 3.8, 0, Math.PI * 2);
        ctx.fill();

        drawRoundRect(ctx, boxX, boxY, boxW, boxH, 7, '#0f172a', borderColor, 1.8);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        lineArr.forEach((line, idx) => {
            ctx.fillStyle = idx === 0 ? textColor : '#cbd5e1';
            ctx.fillText(line, boxX + boxW / 2, boxY + 5 + lineH * (idx + 0.5));
        });
        ctx.restore();
    }

    function drawTitleBadge(ctx, text, x = 16, y = 14) {
        ctx.save();
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        const w = ctx.measureText(text).width + 22;
        drawRoundRect(ctx, x, y, w, 28, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x + 11, y + 14);
        ctx.restore();
    }

    function drawCircleNum(ctx, nx, ny, tx, ty, numStr, color = '#38bdf8') {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(nx, ny);
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.arc(nx, ny, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(numStr, nx, ny);
        ctx.restore();
    }

    // =========================================================================
    // 1. MH-C3-53: THÍ NGHIỆM CÂN TỪ TRƯỜNG (NAM CHÂM CHỮ U TRÊN CÂN ĐIỆN TỬ)
    // Ràng buộc: KHÔNG vẽ sẵn mũi tên chiều lực từ hay chiều dòng điện P->Q
    // =========================================================================
    window.VLXTModels.register('MH-C3-53', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'THÍ NGHIỆM CÂN TỪ TRƯỜNG (L = 5,0 cm; I = 5,0 A; g = 9,8 m/s²)');

        ctx.save();
        // 1. Cân điện tử (3)
        const sx = 245, sy = 204, sw = 240, sh = 66;
        drawRoundRect(ctx, sx, sy, sw, sh, 10, '#1e293b', '#94a3b8', 2.8);
        // Đĩa cân trên
        drawRoundRect(ctx, sx + 22, sy - 10, sw - 44, 10, 3, '#475569', '#cbd5e1', 2);
        // Màn hình LCD cân hiển thị 2.20 g
        drawRoundRect(ctx, sx + 48, sy + 14, 144, 34, 6, '#050811', '#10b981', 2);
        ctx.fillStyle = '#6ee7b7';
        ctx.font = '800 18px "DM Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('002.20 g', sx + 120, sy + 31);

        // 2. Nam châm hình chữ U (2) đặt trên đĩa cân (Cực S sau màu xanh, cực N trước màu đỏ)
        const mx = 315, my = 104, mw = 100, mh = 90;
        // Cực S (phía sau - xanh dương #3b82f6)
        drawRoundRect(ctx, mx - 18, my - 14, 86, 56, 6, '#3b82f6', '#93c5fd', 2.2);
        ctx.fillStyle = '#ffffff';
        ctx.font = '800 18px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('S', mx + 25, my + 12);

        // Đáy chữ U & Cực N (phía trước - đỏ #ef4444)
        ctx.fillStyle = '#64748b';
        ctx.fillRect(mx - 18, my + 42, 18, 48);
        ctx.fillRect(mx - 18, my + 78, 106, 14);
        drawRoundRect(ctx, mx + 2, my + 14, 86, 56, 6, '#ef4444', '#fca5a5', 2.4);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('N', mx + 45, my + 42);

        // 3. Hai giá đỡ cố định hai bên & Đoạn dây dẫn PQ (1) nằm ngang giữa 2 cực N-S
        // Giá đỡ trái
        drawRoundRect(ctx, 132, 236, 48, 18, 4, '#334155', '#94a3b8', 2);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(153, 118, 6, 118);
        // Giá đỡ phải
        drawRoundRect(ctx, 550, 236, 48, 18, 4, '#334155', '#94a3b8', 2);
        ctx.fillRect(571, 118, 6, 118);

        // Đoạn dây dẫn PQ (1) nằm ngang xuyên qua lòng nam châm (KHÔNG vẽ mũi tên chiều I hay F)
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3.8;
        ctx.beginPath();
        ctx.moveTo(156, 132);
        ctx.lineTo(574, 132);
        ctx.stroke();

        // Dây mềm nối nguồn hai đầu
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(156, 132); ctx.quadraticCurveTo(95, 165, 68, 224);
        ctx.moveTo(574, 132); ctx.quadraticCurveTo(625, 165, 648, 224);
        ctx.stroke();

        // Nhãn P và Q
        ctx.fillStyle = '#fbbf24';
        ctx.font = '800 16px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('P', 245, 118);
        ctx.fillText('Q', 475, 118);

        // Ký hiệu đánh số (1), (2), (3) theo hình gốc
        drawCircleNum(ctx, 212, 74, 232, 132, '(1)', '#fbbf24');
        drawCircleNum(ctx, 365, 58, 365, 90, '(2)', '#ef4444');
        drawCircleNum(ctx, 535, 174, 485, 226, '(3)', '#10b981');
        ctx.restore();
    });

    // =========================================================================
    // 2. MH-C3-54: BỘ THÍ NGHIỆM ĐO CẢM ỨNG TỪ NAM CHÂM CHỮ U TRÊN CÂN HIỆN SỐ
    // Ràng buộc: KHÔNG lộ chiều dòng điện hay chiều lực từ của ý b, d.
    // =========================================================================
    window.VLXTModels.register('MH-C3-54', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'ĐO CẢM ỨNG TỪ NAM CHÂM CHỮ U (L_dây = 15 cm; L_nam châm = 8,4 cm)');

        ctx.save();
        // Đế bộ thí nghiệm
        drawRoundRect(ctx, 110, 236, 480, 24, 6, '#1e293b', '#64748b', 2.4);

        // Cân đồng hồ hiện số (3) ở giữa
        drawRoundRect(ctx, 265, 198, 170, 38, 6, '#334155', '#cbd5e1', 2.4);
        drawRoundRect(ctx, 295, 206, 110, 22, 4, '#050811', '#38bdf8', 1.6);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "DM Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('164.40 g', 350, 217);

        // Nam châm chữ U (2): Cực S phía sau (xanh dương), cực N mặt trước (đỏ)
        drawRoundRect(ctx, 282, 116, 136, 54, 6, '#3b82f6', '#93c5fd', 2);
        drawRoundRect(ctx, 276, 132, 148, 64, 7, '#ef4444', '#fca5a5', 2.6);
        ctx.fillStyle = '#ffffff';
        ctx.font = '800 26px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('N', 350, 164);

        // Hai trụ đỡ hai bên & Dây dẫn thẳng (1)
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(168, 92, 10, 144);
        ctx.fillRect(522, 92, 10, 144);
        drawRoundRect(ctx, 164, 88, 18, 22, 4, '#0f172a', '#cbd5e1', 2);
        drawRoundRect(ctx, 518, 88, 18, 22, 4, '#0f172a', '#cbd5e1', 2);

        // Thanh dẫn ngang (1) xuyên qua khe giữa 2 cực nam châm (không vẽ mũi tên chiều I)
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(173, 142);
        ctx.lineTo(527, 142);
        ctx.stroke();

        // Hai cọc đấu dây nguồn đỏ/xanh bên phải
        drawRoundRect(ctx, 474, 162, 14, 28, 3, '#ef4444', '#fca5a5', 1.8);
        drawRoundRect(ctx, 502, 162, 14, 28, 3, '#3b82f6', '#93c5fd', 1.8);
        ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(488, 170); ctx.lineTo(625, 170); ctx.stroke();
        ctx.strokeStyle = '#3b82f6';
        ctx.beginPath(); ctx.moveTo(516, 182); ctx.lineTo(625, 182); ctx.stroke();

        // Đánh số (1), (2), (3) theo đúng hình gốc
        drawCircleNum(ctx, 218, 76, 232, 142, '(1)', '#fbbf24');
        drawCircleNum(ctx, 350, 74, 350, 132, '(2)', '#ef4444');
        drawCircleNum(ctx, 218, 206, 265, 216, '(3)', '#38bdf8');
        ctx.restore();
    });

    // =========================================================================
    // 3. MH-C3-55: KHẢO SÁT LỰC TỪ TÁC DỤNG LÊN ĐOẠN DÂY AB TREO HAI LÒ XO/LỰC KẾ
    // =========================================================================
    window.VLXTModels.register('MH-C3-55', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'KHẢO SÁT LỰC TỪ TÁC DỤNG LÊN ĐOẠN DÂY AB TREO HAI LỰC KẾ');

        const pull = 3 + Math.sin(t * 2.5) * 2.5;

        ctx.save();
        // Hai chân đế & Khung giá treo
        drawRoundRect(ctx, 135, 238, 74, 26, 5, '#334155', '#94a3b8', 2.2);
        drawRoundRect(ctx, 475, 218, 74, 26, 5, '#334155', '#94a3b8', 2.2);

        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(172, 238); ctx.lineTo(172, 92);
        ctx.moveTo(512, 218); ctx.lineTo(512, 74);
        ctx.moveTo(172, 92); ctx.lineTo(512, 74); // Thanh xà ngang trên
        ctx.stroke();

        // Nam châm chữ U đặt ở giữa (Cực S xanh phía sau, cực N đỏ phía trước)
        const mx = 285, my = 128;
        drawRoundRect(ctx, mx - 24, my - 16, 118, 56, 6, '#3b82f6', '#93c5fd', 2.2);
        ctx.fillStyle = '#ffffff';
        ctx.font = '800 18px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('S', mx + 35, my + 8);

        ctx.fillStyle = '#64748b';
        ctx.fillRect(mx - 24, my + 40, 20, 62);
        ctx.fillRect(mx - 24, my + 90, 146, 14);
        drawRoundRect(ctx, mx + 4, my + 24, 118, 56, 6, '#ef4444', '#fca5a5', 2.4);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('N', mx + 63, my + 54);

        // Hai lò xo / lực kế treo từ thanh xà xuống đoạn dây AB
        function drawSpring(sx, yTop, yBot) {
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.moveTo(sx, yTop);
            const coils = 7;
            const step = (yBot - yTop) / coils;
            for (let i = 0; i < coils; i++) {
                const yy = yTop + i * step;
                ctx.lineTo(sx + (i % 2 === 0 ? -6 : 6), yy + step / 2);
            }
            ctx.lineTo(sx, yBot);
            ctx.stroke();
        }

        const wireY = 146 + pull;
        drawSpring(255, 88, wireY - 12);
        drawSpring(445, 78, wireY - 22);

        // Đoạn dây dẫn AB mang dòng điện I từ A sang B
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(255, wireY - 12);
        ctx.lineTo(255, wireY + 12);
        ctx.lineTo(445, wireY + 2);
        ctx.lineTo(445, wireY - 22);
        ctx.stroke();

        // Mũi tên chiều dòng điện I từ A sang B
        drawArrow(ctx, 325, wireY + 8, 375, wireY + 5, '#fbbf24', 3.2, 8);
        ctx.fillStyle = '#fbbf24';
        ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('B', 240, wireY + 18);
        ctx.fillText('A', 460, wireY + 8);
        ctx.fillText('I', 352, wireY - 6);

        // Vectơ cảm ứng từ B hướng từ N (trước) sang S (sau)
        drawArrow(ctx, 330, wireY + 22, 304, wireY - 2, '#38bdf8', 2.8, 7);
        drawSubText(ctx, 'B', '', 286, wireY - 4, { fontSize: 15, italic: true, color: '#38bdf8', vector: true });

        // Vectơ lực từ F hướng thẳng đứng từ trên xuống dưới
        drawArrow(ctx, 355, wireY + 7, 355, wireY + 68, '#a855f7', 3.4, 9);
        drawSubText(ctx, 'F', '', 366, wireY + 62, { fontSize: 16, italic: true, color: '#d8b4fe', vector: true });

        // Callout giải thích
        drawCallout(ctx, 445, 110, 560, 86, ['Hai lực kế giống nhau', 'Đo tổng P + F_từ'], '#94a3b8');
        ctx.restore();
    });

    // =========================================================================
    // 4. MH-C3-56: "CÂN DÒNG ĐIỆN" OERSTED (L = 0,3 m; I = 2 A; B = 0,08 T)
    // =========================================================================
    window.VLXTModels.register('MH-C3-56', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'CÂN DÒNG ĐIỆN OERSTED (I = 2 A; l = 0,3 m; B = 0,08 T; x = 0,1 m; y = 0,4 m)');

        const tilt = Math.sin(t * 2.2) * 0.025; // Dao động cân bằng nhỏ quanh trục O

        ctx.save();
        // Nam châm chữ U đặt ở đầu trái
        const mx = 120, my = 128;
        drawRoundRect(ctx, mx, my, 92, 126, 12, 'rgba(30, 41, 59, 0.85)', '#cbd5e1', 2.8);
        // Cực N đỏ trên, cực S xanh dưới
        drawRoundRect(ctx, mx + 6, my + 6, 80, 26, 5, '#ef4444', '#fca5a5', 1.8);
        drawRoundRect(ctx, mx + 6, my + 94, 80, 26, 5, '#3b82f6', '#93c5fd', 1.8);
        ctx.fillStyle = '#ffffff';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('N', mx + 46, my + 24);
        ctx.fillText('S', mx + 46, my + 112);

        // Đường sức từ thẳng đứng từ N xuống S
        drawArrow(ctx, mx + 26, my + 34, mx + 26, my + 92, '#38bdf8', 2, 6);
        drawArrow(ctx, mx + 66, my + 34, mx + 66, my + 92, '#38bdf8', 2, 6);

        // Trục quay cố định (Tam giác tựa tại pivotX = 435, pivotY = 175)
        const pivX = 435, pivY = 175;
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(pivX, pivY);
        ctx.lineTo(pivX - 16, pivY + 26);
        ctx.lineTo(pivX + 16, pivY + 26);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#fbbf24';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('Trục quay', pivX, pivY + 42);

        // Đòn cân & Khung dây dẫn quay quanh trục
        ctx.save();
        ctx.translate(pivX, pivY);
        ctx.rotate(tilt);

        // Cánh tay đòn trái (chiều dài x = 0,1 m -> 195px)
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(0, -4);
        ctx.lineTo(-195, -4);
        ctx.lineTo(-265, 16);
        ctx.lineTo(-345, -14);
        ctx.lineTo(-195, -14);
        ctx.lineTo(0, -14);
        // Cánh tay đòn phải (chiều dài y = 0,4 m -> 225px)
        ctx.lineTo(225, -14);
        ctx.lineTo(225, -4);
        ctx.lineTo(0, -4);
        ctx.stroke();

        // Kẹp giấy đặt ở đầu phải cách trục đoạn y = 0,4 m
        drawRoundRect(ctx, 198, -24, 34, 12, 5, '#94a3b8', '#e2e8f0', 2);

        // Vectơ trọng lực P của kẹp giấy hướng xuống
        drawArrow(ctx, 215, -4, 215, 58, '#10b981', 3.2, 8);
        drawSubText(ctx, 'P', '', 226, 52, { fontSize: 16, italic: true, color: '#6ee7b7', vector: true });

        // Vectơ lực từ F_B hướng xuống tại đầu trái cách trục đoạn x = 0,1 m
        drawArrow(ctx, -195, -4, -195, 68, '#ef4444', 3.2, 8);
        drawSubText(ctx, 'F', 'B', -184, 62, { fontSize: 16, italic: true, color: '#fca5a5', vector: true });

        // Mũi tên dòng điện I trên đoạn dây trong từ trường
        drawArrow(ctx, -295, -14, -245, -14, '#fbbf24', 2.8, 7);
        ctx.fillStyle = '#fbbf24';
        ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('I', -270, -24);

        ctx.restore();

        // Nhãn khoảng cách x và y
        drawCallout(ctx, 335, 152, 285, 76, ['Khoảng cách x = 0,1 m', 'Đoạn dây l = 0,3 m'], '#38bdf8');
        drawCallout(ctx, 545, 152, 545, 76, ['Kẹp giấy (trọng lượng P)', 'Khoảng cách y = 0,4 m'], '#10b981');
        ctx.restore();
    });

    // =========================================================================
    // 5. MH-C3-57: MÁY PHÁT ĐIỆN XOAY CHIỀU MỘT PHA ĐƠN GIẢN (N = 200 vòng; f = 50 Hz)
    // =========================================================================
    window.VLXTModels.register('MH-C3-57', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'MÁY PHÁT ĐIỆN XOAY CHIỀU 1 PHA (N = 200 vòng; S = 0,02 m²; B = 0,5 T; f = 50 Hz)');

        const theta = t * 2.4;
        const proj = Math.cos(theta); // độ mở khung dây theo góc quay

        ctx.save();
        // Cực Bắc N (bên trái - màu đỏ)
        drawRoundRect(ctx, 115, 96, 86, 134, 12, '#ef4444', '#fca5a5', 2.8);
        ctx.fillStyle = '#ffffff';
        ctx.font = '800 28px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('N', 158, 163);

        // Cực Nam S (bên phải - màu xanh dương)
        drawRoundRect(ctx, 475, 96, 86, 134, 12, '#3b82f6', '#93c5fd', 2.8);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('S', 518, 163);

        // Các đường sức từ B hướng từ N sang S
        for (let yy = 118; yy <= 208; yy += 30) {
            drawArrow(ctx, 206, yy, 468, yy, 'rgba(56, 189, 248, 0.35)', 2, 7);
        }

        // Trục quay nét đứt ở giữa
        const cx = 338, cy = 163;
        ctx.strokeStyle = '#94a3b8';
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(210, cy + 45);
        ctx.lineTo(465, cy - 45);
        ctx.stroke();
        ctx.setLineDash([]);

        // Khung dây dẫn quay đều quanh trục
        const halfW = 72;
        const halfH = 42 * proj;
        const dx = halfW * 0.85, dy = -halfW * 0.3;
        const px = halfH * 0.3, py = halfH * 0.9;

        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3.8;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(cx - dx - px, cy - dy - py);
        ctx.lineTo(cx + dx - px, cy + dy - py);
        ctx.lineTo(cx + dx + px, cy + dy + py);
        ctx.lineTo(cx - dx + px, cy - dy + py);
        ctx.closePath();
        ctx.stroke();

        // Hai vành khuyên & Hai chổi quét ở đầu trục dưới trái
        const r1x = 248, r1y = 195;
        const r2x = 226, r2y = 203;
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.ellipse(r1x, r1y, 10, 16, 0.3, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(r2x, r2y, 10, 16, 0.3, 0, Math.PI * 2); ctx.stroke();

        // Chổi quét & Dây ra mạch ngoài
        drawRoundRect(ctx, r1x + 6, r1y + 10, 12, 10, 2, '#94a3b8', '#f8fafc', 1.6);
        drawRoundRect(ctx, r2x + 6, r2y + 10, 12, 10, 2, '#94a3b8', '#f8fafc', 1.6);

        // Chú thích callout
        drawCallout(ctx, 338, 122, 315, 56, ['Khung dây N = 200 vòng', 'Quay đều tần số f = 50 Hz'], '#fbbf24');
        drawCallout(ctx, 226, 218, 42, 232, ['Vành khuyên & Chổi quét'], '#d97706');

        // Thẻ thông số bên phải
        drawRoundRect(ctx, 578, 76, 184, 182, 10, '#0f172a', '#38bdf8', 2);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('THÔNG SỐ MÁY PHÁT', 592, 100);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Số vòng: N = 200', 592, 128);
        ctx.fillText('• Diện tích: S = 0,02 m²', 592, 154);
        ctx.fillText('• Cảm ứng từ: B = 0,5 T', 592, 180);
        ctx.fillText('• Tần số quay: f = 50 Hz', 592, 206);
        ctx.fillStyle = '#6ee7b7';
        ctx.fillText('• Đường sức B: N → S', 592, 234);
        ctx.restore();
    });

    // =========================================================================
    // 6. MH-C3-58: MÁY PHÁT ĐIỆN XOAY CHIỀU 1 PHA (RÔTO 3 CẶP CỰC & STATO 6 CUỘN)
    // =========================================================================
    window.VLXTModels.register('MH-C3-58', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'MÁY PHÁT ĐIỆN 1 PHA (RÔTO 3 CẶP CỰC N–S; STATO 6 CUỘN × 200 VÒNG)');

        const cx = 250, cy = 166;
        const rotAng = t * 1.4;

        ctx.save();
        // 1. Vành ngoài Stato cố định (màu xanh đậm)
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 18;
        ctx.beginPath();
        ctx.arc(cx, cy, 104, 0, Math.PI * 2);
        ctx.stroke();

        // 6 cực lõi sắt & cuộn dây của Stato đặt đối xứng (mỗi 60 độ)
        for (let i = 0; i < 6; i++) {
            const a = (i * Math.PI) / 3;
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(a);
            // Cực lõi sắt hướng vào tâm
            ctx.fillStyle = '#0284c7';
            ctx.fillRect(76, -11, 24, 22);
            // Cuộn dây quấn quanh cực Stato
            drawRoundRect(ctx, 79, -15, 16, 30, 3, '#ef4444', '#fca5a5', 1.6);
            ctx.restore();
        }

        // 2. Rôto nam châm 6 cực (3 cặp cực N - S xen kẽ) quay ở tâm
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotAng);
        for (let i = 0; i < 6; i++) {
            const a = (i * Math.PI) / 3;
            const isNorth = (i % 2 === 0);
            ctx.save();
            ctx.rotate(a);
            drawRoundRect(ctx, 18, -12, 48, 24, 5, isNorth ? '#ef4444' : '#3b82f6', '#f8fafc', 1.8);
            ctx.fillStyle = '#ffffff';
            ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(isNorth ? 'N' : 'S', 46, 0);
            ctx.restore();
        }
        // Lõi trục Rôto ở tâm
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2.6;
        ctx.beginPath(); ctx.arc(0, 0, 22, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // Mũi tên chỉ chiều quay Rôto
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 1.4); ctx.stroke();
        ctx.restore();

        // Nhãn callout Stato & Rôto
        drawCallout(ctx, cx - 72, cy - 72, 22, 66, ['Rôto (3 cặp cực N–S)', 'Phần quay tạo từ trường'], '#38bdf8');
        drawCallout(ctx, cx + 86, cy - 64, 375, 58, ['Stato (6 cuộn dây)', 'Mỗi cuộn 200 vòng'], '#ef4444');

        // Thẻ thông số đề dẫn bên phải
        drawRoundRect(ctx, 415, 114, 345, 160, 10, '#0f172a', '#38bdf8', 2);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('THÔNG SỐ MÁY PHÁT XOAY CHIỀU', 432, 140);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Rôto: p = 3 cặp cực N–S xen kẽ', 432, 168);
        ctx.fillText('• Stato: 6 cuộn dây × 200 vòng/cuộn', 432, 194);
        ctx.fillText('• Từ thông cực đại: Φ₀ = 0,800 mWb', 432, 220);
        ctx.fillText('• Tần số điện áp phát ra: f = 50,0 Hz', 432, 246);
        ctx.restore();
    });

    // =========================================================================
    // 7. MH-C3-59: PHANH TÁI SINH NĂNG LƯỢNG Ô TÔ ĐIỆN (KHUNG DÂY ABCD)
    // Ràng buộc: Hiển thị đúng chiều quay trên hình gốc, KHÔNG vẽ sẵn mũi tên
    // dòng điện trên cạnh CD làm lộ đáp án ý b.
    // =========================================================================
    window.VLXTModels.register('MH-C3-59', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'MÔ HÌNH PHANH TÁI SINH Ô TÔ ĐIỆN (KHUNG VUÔNG ABCD CẠNH L)');

        const theta = t * 2.1;
        const proj = Math.cos(theta);

        ctx.save();
        // Cực Bắc N bên trái (đỏ) & Cực Nam S bên phải (xanh dương)
        drawRoundRect(ctx, 105, 86, 86, 136, 12, '#ef4444', '#fca5a5', 2.8);
        ctx.fillStyle = '#ffffff';
        ctx.font = '800 28px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('N', 148, 154);

        drawRoundRect(ctx, 465, 86, 86, 136, 12, '#3b82f6', '#93c5fd', 2.8);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('S', 508, 154);

        // Trục quay OO' nét đứt
        const cx = 328, cy = 154;
        ctx.strokeStyle = '#94a3b8';
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(195, cy + 48);
        ctx.lineTo(465, cy - 48);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('O', 185, cy + 54);
        ctx.fillText("O'", 452, cy - 54);

        // Mũi tên cong chỉ chiều quay quanh trục OO' (theo hình gốc: cạnh gần nâng lên, cạnh xa hạ xuống)
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.arc(432, cy - 36, 16, -Math.PI * 0.8, Math.PI * 0.45);
        ctx.stroke();
        drawArrow(ctx, 436, cy - 20, 428, cy - 21, '#fbbf24', 2.4, 6);

        // Khung dây hình vuông 1 vòng ABCD (KHÔNG vẽ mũi tên dòng điện trên cạnh CD)
        const halfW = 68;
        const halfH = 42 * proj;
        const dx = halfW * 0.85, dy = -halfW * 0.3;
        const px = halfH * 0.3, py = halfH * 0.9;

        const Ax = cx - dx - px, Ay = cy - dy - py;
        const Bx = cx + dx - px, By = cy + dy - py;
        const Cx = cx + dx + px, Cy = cy + dy + py;
        const Dx = cx - dx + px, Dy = cy - dy + py;

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3.8;
        ctx.beginPath();
        ctx.moveTo(Ax, Ay);
        ctx.lineTo(Bx, By);
        ctx.lineTo(Cx, Cy);
        ctx.lineTo(Dx, Dy);
        ctx.closePath();
        ctx.stroke();

        // Nhãn 4 đỉnh A, B, C, D
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('A', Ax - 12, Ay - 8);
        ctx.fillText('B', Bx + 4, By - 12);
        ctx.fillText('C', Cx + 12, Cy + 6);
        ctx.fillText('D', Dx - 6, Dy + 14);

        // Vành khuyên, chổi quét & Bộ tích trữ năng lượng phía dưới
        drawRoundRect(ctx, 295, 244, 134, 36, 7, '#1e293b', '#10b981', 2.2);
        ctx.fillStyle = '#6ee7b7';
        ctx.font = '700 13px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('Bộ tích trữ điện', 362, 262);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(246, 198); ctx.lineTo(246, 256); ctx.lineTo(295, 256);
        ctx.moveTo(226, 206); ctx.lineTo(226, 268); ctx.lineTo(295, 268);
        ctx.stroke();

        // Thẻ thông số đề dẫn bên phải
        drawRoundRect(ctx, 568, 76, 194, 188, 10, '#0f172a', '#38bdf8', 2);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('PHANH TÁI SINH XE ĐIỆN', 582, 100);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Khung vuông 1 vòng ABCD', 582, 128);
        ctx.fillText('• Chiều dài mỗi cạnh: L', 582, 154);
        ctx.fillText('• Cảm ứng từ đều: B', 582, 180);
        ctx.fillText('• Tốc độ góc quay: ω', 582, 206);
        ctx.fillStyle = '#6ee7b7';
        ctx.fillText('• Cơ năng → Điện năng', 582, 234);
        ctx.restore();
    });

    // =========================================================================
    // 8. MH-C3-60: HAI PHẦN SONG SONG H1 (RAY THẲNG ĐỨNG) & H2 (ĐỒ THỊ v - t)
    // =========================================================================
    window.VLXTModels.register('MH-C3-60', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'THANH KIM LOẠI MN RƠI TRÊN HAI RAY THẲNG ĐỨNG (L = 2 m; R = 8 Ω; r = 2 Ω)');

        const saw = (t * 0.25) % 1; // 1 chiều sawtooth: rơi tự do -> vào từ trường đạt v = 10 m/s

        ctx.save();
        // --- HÌNH H1 (BÊN TRÁI): HAI RAY THẲNG ĐỨNG & ĐIỆN TRỞ R ---
        const rx1 = 135, rx2 = 255, rTop = 74, rBot = 258;
        const ooY = 148;

        // Hai thanh ray thẳng đứng
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(rx1, rTop); ctx.lineTo(rx1, rBot);
        ctx.moveTo(rx2, rTop); ctx.lineTo(rx2, rBot);
        ctx.moveTo(rx1, rTop); ctx.lineTo(rx2, rTop);
        ctx.stroke();

        // Điện trở R ở đầu trên hai ray
        drawRoundRect(ctx, (rx1 + rx2) / 2 - 26, rTop - 10, 52, 20, 4, '#1e293b', '#38bdf8', 2.4);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('R = 8 Ω', (rx1 + rx2) / 2, rTop - 22);

        // Đường ranh giới nét đứt OO'
        ctx.strokeStyle = '#fbbf24';
        ctx.setLineDash([6, 4]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(rx1 - 24, ooY);
        ctx.lineTo(rx2 + 24, ooY);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#fbbf24';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('O', rx1 - 36, ooY);
        ctx.fillText("O'", rx2 + 38, ooY);

        // Vùng từ trường đều bên dưới OO' (các dấu x)
        for (let x = rx1 + 24; x <= rx2 - 20; x += 36) {
            for (let y = ooY + 22; y <= rBot - 14; y += 34) {
                drawCrossB(ctx, x, y, 7.5, 'rgba(56, 189, 248, 0.75)');
            }
        }

        // Thanh kim loại MN rơi 1 chiều từ trên OO' xuống vùng từ trường
        const mnY = (rTop + 22) + saw * (rBot - rTop - 36);
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(rx1 - 8, mnY);
        ctx.lineTo(rx2 + 8, mnY);
        ctx.stroke();
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('M', rx1 - 22, mnY);
        ctx.fillText('N', rx2 + 22, mnY);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('H1', (rx1 + rx2) / 2, 282);

        // --- HÌNH H2 (BÊN PHẢI): ĐỒ THỊ VẬN TỐC - THỜI GIAN (v - t) ---
        const ox = 415, oy = 242, gxW = 285, gyH = 165;
        drawArrow(ctx, ox, oy, ox + gxW, oy, '#cbd5e1', 2.6, 8);
        drawArrow(ctx, ox, oy, ox, oy - gyH, '#cbd5e1', 2.6, 8);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('v (m/s)', ox - 18, oy - gyH - 12);
        ctx.fillText('t (s)', ox + gxW + 8, oy);
        ctx.textAlign = 'right';
        ctx.fillText('O', ox - 8, oy + 14);
        ctx.fillText('10', ox - 10, oy - 115);

        // Đường đồ thị: tăng tuyến tính (0,0) -> (1s, 10 m/s), sau đó nằm ngang tới 2s
        const t1X = ox + 105, t2X = ox + 210, v10Y = oy - 115;
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3.6;
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(t1X, v10Y);
        ctx.lineTo(t2X + 35, v10Y);
        ctx.stroke();

        // Đường gióng nét đứt tại t = 1 s và t = 2 s
        ctx.strokeStyle = '#64748b';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(ox, v10Y); ctx.lineTo(t1X, v10Y);
        ctx.moveTo(t1X, v10Y); ctx.lineTo(t1X, oy);
        ctx.moveTo(t2X, v10Y); ctx.lineTo(t2X, oy);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#cbd5e1';
        ctx.textAlign = 'center';
        ctx.fillText('1', t1X, oy + 16);
        ctx.fillText('2', t2X, oy + 16);

        // Điểm động chạy đồng bộ theo saw trên đồ thị H2
        let dotX, dotY;
        if (saw < 0.5) {
            const p = saw / 0.5;
            dotX = ox + p * 105;
            dotY = oy - p * 115;
        } else {
            const p = (saw - 0.5) / 0.5;
            dotX = t1X + p * 105;
            dotY = v10Y;
        }
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath(); ctx.arc(dotX, dotY, 6, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('H2', ox + gxW / 2, 282);
        ctx.restore();
    });

    // =========================================================================
    // 9. MH-C3-61: HAI THANH RAY OA, OB HỢP GÓC 45° & THANH mn CHUYỂN ĐỘNG ĐỀU
    // =========================================================================
    window.VLXTModels.register('MH-C3-61', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'THANH mn TRƯỢT TRÊN HAI RAY HỢP GÓC 45° (l₀ = 1 m; v = 2 m/s; B = 0,1 T)');

        const saw = (t * 0.25) % 1; // Chuyển động 1 chiều sawtooth từ l0 sang phải rồi reset
        const ox = 115, oy = 248;
        const barX = ox + 115 + saw * 145; // Vị trí thanh thẳng đứng mn
        const topIntersectY = oy - (barX - ox); // Vì góc 45 độ nên tan(45°) = 1

        ctx.save();
        // Vùng tam giác từ trường bên trong khung O-m-n
        ctx.fillStyle = 'rgba(56, 189, 248, 0.14)';
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(barX, oy);
        ctx.lineTo(barX, topIntersectY);
        ctx.closePath();
        ctx.fill();

        // Ký hiệu từ trường đều ⊗ B hướng vuông góc vào trong
        const bCoords = [[195, 224], [245, 224], [245, 178], [295, 224], [295, 178], [295, 132], [345, 224], [345, 178]];
        bCoords.forEach(([bx, by]) => drawCrossB(ctx, bx, by, 8, '#38bdf8'));
        drawSubText(ctx, 'B', '', 214, 152, { fontSize: 16, italic: true, color: '#38bdf8', vector: true });

        // Hai thanh ray OA (nằm ngang) và OB (nghiêng 45°)
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(ox, oy); ctx.lineTo(485, oy); // OA
        ctx.moveTo(ox, oy); ctx.lineTo(325, oy - 210); // OB
        ctx.stroke();

        // Điện trở R = 2 Ω gắn trên nhánh OA
        drawRoundRect(ctx, ox + 45, oy - 9, 44, 18, 4, '#1e293b', '#fbbf24', 2.2);

        // Cung góc 45° tại O
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ox, oy, 36, -Math.PI / 4, 0);
        ctx.stroke();
        ctx.fillStyle = '#fbbf24';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('45°', ox + 40, oy - 10);

        // Nhãn O, A, B
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('O', ox - 18, oy + 6);
        ctx.fillText('A', 494, oy + 5);
        ctx.fillText('B', 332, oy - 206);

        // Thanh kim loại thẳng đứng mn chuyển động sang phải với vận tốc v = 2 m/s
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 4.2;
        ctx.beginPath();
        ctx.moveTo(barX, topIntersectY - 26);
        ctx.lineTo(barX, oy + 22);
        ctx.stroke();
        ctx.fillStyle = '#f8fafc';
        ctx.fillText('m', barX - 6, topIntersectY - 32);
        ctx.fillText('n', barX - 6, oy + 36);

        // Vectơ vận tốc v hướng ngang sang phải
        drawArrow(ctx, barX + 4, (oy + topIntersectY) / 2, barX + 56, (oy + topIntersectY) / 2, '#10b981', 3.2, 8);
        drawSubText(ctx, 'v', '', barX + 26, (oy + topIntersectY) / 2 - 10, { fontSize: 16, italic: true, color: '#6ee7b7', vector: true });

        // Thẻ thông số đề dẫn bên phải
        drawRoundRect(ctx, 520, 72, 240, 194, 10, '#0f172a', '#38bdf8', 2);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('THÔNG SỐ HỆ RAY OA–OB', 536, 98);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Góc giữa hai ray: α = 45°', 536, 126);
        ctx.fillText('• Khoảng cách đầu: l₀ = 1 m', 536, 152);
        ctx.fillText('• Vận tốc thanh mn: v = 2 m/s', 536, 178);
        ctx.fillText('• Cảm ứng từ đều: B = 0,1 T', 536, 204);
        ctx.fillText('• Điện trở khung dây: R = 2 Ω', 536, 230);
        ctx.restore();
    });

    // =========================================================================
    // 10. MH-C3-62: THANH DẪN MN TRƯỢT TRÊN MẶT PHẲNG NGHIÊNG α = 30° TRONG B THẲNG ĐỨNG
    // Ràng buộc: KHÔNG vẽ sẵn chiều dòng điện cảm ứng qua R làm lộ đáp án ý d.
    // =========================================================================
    window.VLXTModels.register('MH-C3-62', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'THANH DẪN MN TRƯỢT TRÊN MẶT PHẲNG NGHIÊNG 30° (B = 0,5 T THẲNG ĐỨNG LÊN)');

        const saw = (t * 0.24) % 1; // Thanh MN trượt xuống mặt phẳng nghiêng 1 chiều -> reset

        ctx.save();
        // Khối nêm mặt phẳng nghiêng góc 30°
        const xTop = 95, yTop = 104;
        const xBot = 465, yBot = 268;
        ctx.fillStyle = 'rgba(30, 41, 59, 0.6)';
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(xTop, yTop);
        ctx.lineTo(xBot, yBot);
        ctx.lineTo(xTop, yBot);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Cung góc α = 30° ở chân dốc
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(xBot, yBot, 44, Math.PI, Math.PI + 0.42);
        ctx.stroke();
        ctx.fillStyle = '#fbbf24';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('α = 30°', xBot - 50, yBot - 8);

        // Hai thanh ray song song đặt dọc mặt phẳng nghiêng (góc chiếu phối cảnh)
        const a1x = 175, a1y = 122, b1x = 145, b1y = 148;
        const dx = 225, dy = 100;
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(a1x, a1y); ctx.lineTo(a1x + dx, a1y + dy); // Ray trên (A)
        ctx.moveTo(b1x, b1y); ctx.lineTo(b1x + dx, b1y + dy); // Ray dưới (B)
        ctx.moveTo(a1x, a1y); ctx.lineTo(b1x, b1y); // Đoạn nối AB
        ctx.stroke();

        // Điện trở R = 0,4 Ω ở đầu trên AB (KHÔNG vẽ chiều dòng điện qua R)
        drawRoundRect(ctx, (a1x + b1x) / 2 - 12, (a1y + b1y) / 2 - 14, 24, 28, 4, '#0f172a', '#ef4444', 2.2);
        ctx.fillStyle = '#fca5a5';
        ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('R = 0,4 Ω', b1x - 10, b1y - 4);
        ctx.fillStyle = '#f8fafc';
        ctx.fillText('A', a1x - 4, a1y - 8);
        ctx.fillText('B', b1x - 6, b1y + 16);

        // Thanh dẫn MN trượt xuống dọc hai ray (1 chiều sawtooth)
        const slide = 0.25 + saw * 0.62;
        const nx = a1x + dx * slide, ny = a1y + dy * slide;
        const mx = b1x + dx * slide, my = b1y + dy * slide;

        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        ctx.moveTo(nx, ny);
        ctx.lineTo(mx, my);
        ctx.stroke();
        ctx.fillStyle = '#f8fafc';
        ctx.textAlign = 'left';
        ctx.fillText('N', nx + 6, ny - 6);
        ctx.fillText('M', mx - 16, my + 18);

        // Vectơ cảm ứng từ B hướng thẳng đứng từ dưới lên trên
        const bx = 255, by = 164;
        drawArrow(ctx, bx, by, bx, by - 78, '#38bdf8', 3.4, 9);
        drawSubText(ctx, 'B', '', bx + 12, by - 64, { fontSize: 16, italic: true, color: '#38bdf8', vector: true });

        // Thẻ thông số đề dẫn bên phải (Zero Data Leakage)
        drawRoundRect(ctx, 495, 72, 265, 196, 10, '#0f172a', '#38bdf8', 2);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('THÔNG SỐ MẶT NGHIÊNG', 512, 98);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Góc nghiêng: α = 30°', 512, 126);
        ctx.fillText('• Cảm ứng từ: B = 0,5 T (thẳng đứng lên)', 512, 152);
        ctx.fillText('• Điện trở đầu trên: R = 0,4 Ω', 512, 178);
        ctx.fillText('• Thanh MN: m = 50 g; MN = 20 cm', 512, 204);
        ctx.fillStyle = '#6ee7b7';
        ctx.fillText('• Trượt không ma sát trên hai ray', 512, 234);
        ctx.restore();
    });

    // =========================================================================
    // 11. MH-C3-63: BỐN THANH DẪN TẠO HÌNH VUÔNG MNPQ GIÃN RA XA NHAU TỐC ĐỘ v0
    // =========================================================================
    window.VLXTModels.register('MH-C3-63', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'BỐN THANH DẪN TẠO HÌNH VUÔNG MNPQ CHUYỂN ĐỘNG RA XA NHAU (TỐC ĐỘ v₀)');

        const saw = (t * 0.24) % 1;
        const cx = 255, cy = 164;
        const half = 46 + saw * 26; // Hình vuông mở rộng 1 chiều -> reset
        const over = 24;

        ctx.save();
        // Ký hiệu từ trường đều ⊗ B vuông góc mặt phẳng hình vẽ
        drawCrossB(ctx, cx, cy, 10, '#38bdf8');
        drawSubText(ctx, 'B', '', cx + 16, cy + 6, { fontSize: 16, italic: true, color: '#38bdf8', vector: true });

        // 4 thanh vật dẫn thẳng dài đặt vuông góc tạo hình vuông MNPQ
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 3.6;
        ctx.beginPath();
        // Thanh trên (MN)
        ctx.moveTo(cx - half - over, cy - half); ctx.lineTo(cx + half + over, cy - half);
        // Thanh dưới (QP)
        ctx.moveTo(cx - half - over, cy + half); ctx.lineTo(cx + half + over, cy + half);
        // Thanh trái (MQ)
        ctx.moveTo(cx - half, cy - half - over); ctx.lineTo(cx - half, cy + half + over);
        // Thanh phải (NP)
        ctx.moveTo(cx + half, cy - half - over); ctx.lineTo(cx + half, cy + half + over);
        ctx.stroke();

        // Nhãn 4 đỉnh M, N, P, Q
        ctx.fillStyle = '#fbbf24';
        ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('M', cx - half - 14, cy - half - 8);
        ctx.fillText('N', cx + half + 14, cy - half - 8);
        ctx.fillText('P', cx + half + 14, cy + half + 18);
        ctx.fillText('Q', cx - half - 14, cy + half + 18);

        // 4 mũi tên vận tốc v0 hướng ra ngoài vuông góc 4 cạnh
        const arrLen = 34;
        drawArrow(ctx, cx, cy - half, cx, cy - half - arrLen, '#10b981', 3, 8);
        drawSubText(ctx, 'v', '0', cx + 10, cy - half - arrLen + 6, { fontSize: 14.5, italic: true, color: '#6ee7b7', vector: true });

        drawArrow(ctx, cx, cy + half, cx, cy + half + arrLen, '#10b981', 3, 8);
        drawSubText(ctx, 'v', '0', cx + 10, cy + half + arrLen - 2, { fontSize: 14.5, italic: true, color: '#6ee7b7', vector: true });

        drawArrow(ctx, cx - half, cy, cx - half - arrLen, cy, '#10b981', 3, 8);
        drawSubText(ctx, 'v', '0', cx - half - arrLen, cy - 10, { fontSize: 14.5, italic: true, color: '#6ee7b7', vector: true });

        drawArrow(ctx, cx + half, cy, cx + half + arrLen, cy, '#10b981', 3, 8);
        drawSubText(ctx, 'v', '0', cx + half + 12, cy - 10, { fontSize: 14.5, italic: true, color: '#6ee7b7', vector: true });

        // Thẻ thông số đề dẫn bên phải
        drawRoundRect(ctx, 455, 72, 305, 194, 10, '#0f172a', '#38bdf8', 2);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('THÔNG SỐ KHUNG DẪN MNPQ', 472, 98);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Độ dài cạnh ban đầu: a', 472, 126);
        ctx.fillText('• Cảm ứng từ đều vuông góc: B', 472, 152);
        ctx.fillText('• 4 thanh chuyển động ra xa nhau', 472, 178);
        ctx.fillText('  với cùng tốc độ không đổi v₀', 472, 202);
        ctx.fillText('• Điện trở trên 1 đơn vị dài: λ', 472, 228);
        ctx.restore();
    });

    // =========================================================================
    // 12. MH-C3-64: KHUNG DÂY HÌNH VUÔNG BỊ KÉO DÃN THÀNH HÌNH THOI GÓC θ = 120°
    // =========================================================================
    window.VLXTModels.register('MH-C3-64', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'KÉO DÃN KHUNG DÂY VUÔNG THÀNH HÌNH THOI (l = 20 cm; B = 0,5 T; θ = 120°; R = 5 Ω)');

        ctx.save();
        // --- TRẠNG THÁI 1 (TRÁI): KHUNG DÂY HÌNH VUÔNG BAN ĐẦU ---
        const c1x = 185, c1y = 175, diag = 76;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3.4;
        ctx.beginPath();
        ctx.moveTo(c1x, c1y - diag);
        ctx.lineTo(c1x + diag, c1y);
        ctx.lineTo(c1x, c1y + diag);
        ctx.lineTo(c1x - diag, c1y);
        ctx.closePath();
        ctx.stroke();

        // Ký hiệu góc vuông 90° ở đỉnh trái
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(c1x - diag + 12, c1y - 12);
        ctx.lineTo(c1x - diag + 24, c1y);
        ctx.lineTo(c1x - diag + 12, c1y + 12);
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'italic 800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('l', c1x - diag / 2 - 12, c1y - diag / 2 - 6);
        ctx.fillText('l', c1x + diag / 2 + 12, c1y - diag / 2 - 6);

        // Ký hiệu từ trường ⊗ B
        drawCrossB(ctx, c1x + 92, 82, 10, '#38bdf8');
        drawSubText(ctx, 'B', '', c1x + 108, 88, { fontSize: 16, italic: true, color: '#38bdf8', vector: true });

        // --- TRẠNG THÁI 2 (PHẢI): KHUNG DÂY BỊ KÉO DÃN THÀNH HÌNH THOI GÓC θ = 120° ---
        const c2x = 535, c2y = 175;
        const side = diag * Math.SQRT2; // ~ 107.5 px
        const halfA = side * Math.sin(Math.PI / 3); // nửa đường chéo ngang a/2 (~ 93px)
        const halfB = side * Math.cos(Math.PI / 3); // nửa đường chéo đứng b/2 (~ 53.7px)

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3.4;
        ctx.beginPath();
        ctx.moveTo(c2x, c2y - halfB);
        ctx.lineTo(c2x + halfA, c2y);
        ctx.lineTo(c2x, c2y + halfB);
        ctx.lineTo(c2x - halfA, c2y);
        ctx.closePath();
        ctx.stroke();

        // Hai đường chéo nét đứt màu đỏ a và b
        ctx.strokeStyle = '#ef4444';
        ctx.setLineDash([5, 4]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(c2x - halfA, c2y); ctx.lineTo(c2x + halfA, c2y);
        ctx.moveTo(c2x, c2y - halfB); ctx.lineTo(c2x, c2y + halfB);
        ctx.stroke();
        ctx.setLineDash([]);

        // Cung góc ở đỉnh θ = 120°
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(c2x, c2y - halfB, 22, Math.PI / 6, (5 * Math.PI) / 6);
        ctx.stroke();
        ctx.fillStyle = '#fbbf24';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('θ = 120°', c2x + 34, c2y - halfB + 32);

        // Nhãn đường chéo a, b và cạnh l
        ctx.fillStyle = '#fca5a5';
        ctx.font = 'italic 800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('a', c2x - 46, c2y + 16);
        ctx.fillText('b', c2x + 12, c2y + 28);
        ctx.fillStyle = '#f8fafc';
        ctx.fillText('l', c2x - halfA / 2 - 10, c2y - halfB / 2 - 8);
        ctx.fillText('l', c2x + halfA / 2 + 10, c2y - halfB / 2 - 8);

        // Hai mũi tên lực kéo dãn tại hai đỉnh đối diện
        drawArrow(ctx, c2x - halfA, c2y, c2x - halfA - 36, c2y, '#10b981', 3, 8);
        drawArrow(ctx, c2x + halfA, c2y, c2x + halfA + 36, c2y, '#10b981', 3, 8);

        drawCrossB(ctx, c2x + 102, 82, 10, '#38bdf8');
        drawSubText(ctx, 'B', '', c2x + 118, 88, { fontSize: 16, italic: true, color: '#38bdf8', vector: true });
        ctx.restore();
    });

    // =========================================================================
    // 13. MH-C3-65: KHUNG DÂY NÉM NGANG TRONG TỪ TRƯỜNG BIẾN THIÊN B = B0 + k·Z
    // =========================================================================
    window.VLXTModels.register('MH-C3-65', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'KHUNG DÂY VUÔNG CẠNH a NÉM NGANG TRONG TỪ TRƯỜNG B = B₀ + k·Z');

        const saw = (t * 0.25) % 1; // Quỹ đạo ném ngang cong xuống theo nhánh parabol 1 chiều sawtooth

        ctx.save();
        // Hệ trục tọa độ OXZ
        const ox = 115, oy = 258;
        drawArrow(ctx, ox, oy, 445, oy, '#cbd5e1', 2.8, 8); // Trục OX
        drawArrow(ctx, ox, oy, ox, 62, '#cbd5e1', 2.8, 8); // Trục OZ

        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('Z', ox - 10, 72);
        ctx.fillText('O', ox - 10, oy + 12);
        ctx.textAlign = 'left';
        ctx.fillText('X', 452, oy + 5);

        // Đường quỹ đạo parabol nét đứt
        const startX = 165, startY = 104;
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
        ctx.setLineDash([5, 4]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(startX + 22, startY + 22);
        for (let p = 0; p <= 1; p += 0.05) {
            const qx = startX + 22 + p * 210;
            const qy = startY + 22 + p * p * 110;
            ctx.lineTo(qx, qy);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Vị trí khung dây hình vuông cạnh a chuyển động theo saw
        const fx = startX + saw * 210;
        const fy = startY + saw * saw * 110;
        const side = 44;

        drawRoundRect(ctx, fx, fy, side, side, 2, 'rgba(56, 189, 248, 0.16)', '#38bdf8', 3);
        // Kích thước cạnh a
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'italic 800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('a', fx + side / 2, fy - 8);

        // Vectơ vận tốc ngang v0
        drawArrow(ctx, fx + side, fy + side / 2, fx + side + 44, fy + side / 2, '#10b981', 3, 8);
        drawSubText(ctx, 'v', '0', fx + side + 18, fy + side / 2 - 10, { fontSize: 15, italic: true, color: '#6ee7b7', vector: true });

        // Ký hiệu từ trường ⊗ B vuông góc mặt phẳng OXZ
        drawCrossB(ctx, 182, 206, 10, '#38bdf8');
        drawSubText(ctx, 'B', '', 198, 212, { fontSize: 16, italic: true, color: '#38bdf8', vector: true });

        // Thẻ thông số đề dẫn bên phải
        drawRoundRect(ctx, 478, 72, 282, 196, 10, '#0f172a', '#38bdf8', 2);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('THÔNG SỐ KHUNG DÂY NÉM NGANG', 494, 98);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Khung vuông: cạnh a, khối lượng m', 494, 126);
        ctx.fillText('• Điện trở khung: R', 494, 152);
        ctx.fillText('• Ném ngang từ Z₀ với vận tốc v₀', 494, 178);
        ctx.fillText('• Từ trường phụ thuộc độ cao Z:', 494, 204);
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('  B = B₀ + k·Z (k > 0)', 494, 228);
        ctx.restore();
    });

    // =========================================================================
    // 14. MH-C3-66: KHUNG DÂY ABCD CHUYỂN ĐỘNG TỊNH TIẾN QUA VÙNG TỪ TRƯỜNG A'B'C'D'
    // =========================================================================
    window.VLXTModels.register('MH-C3-66', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'KHUNG DÂY ABCD (a = 10 cm; 200 vòng) CHUYỂN ĐỘNG QUA VÙNG TỪ TRƯỜNG B = 0,4 T');

        const saw = (t * 0.24) % 1; // Khung dây đi tịnh tiến từ trái qua phải xuyên qua vùng từ trường -> reset

        ctx.save();
        // Vùng từ trường đều hình chữ nhật A'B'C'D' bên phải
        const bx = 315, by = 82, bw = 185, bh = 166;
        drawRoundRect(ctx, bx, by, bw, bh, 4, 'rgba(56, 189, 248, 0.12)', '#38bdf8', 2.8);

        // Các ký hiệu từ trường đều ⊗ B trong vùng A'B'C'D'
        for (let x = bx + 28; x <= bx + bw - 22; x += 44) {
            for (let y = by + 28; y <= by + bh - 22; y += 44) {
                drawCrossB(ctx, x, y, 8, 'rgba(56, 189, 248, 0.72)');
            }
        }
        drawSubText(ctx, 'B', '', bx + 44, by + 28, { fontSize: 16, italic: true, color: '#38bdf8', vector: true });

        // Nhãn 4 đỉnh vùng từ trường A', B', C', D'
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("D'", bx - 12, by - 4);
        ctx.fillText("C'", bx + bw + 12, by - 4);
        ctx.fillText("A'", bx - 12, by + bh + 16);
        ctx.fillText("B'", bx + bw + 12, by + bh + 16);

        // Khung dây hình vuông ABCD cạnh a = 10 cm di chuyển 1 chiều từ trái qua phải
        const side = 88;
        const fx = 65 + saw * 475;
        const fy = by + (bh - side) / 2;

        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3.6;
        ctx.strokeRect(fx, fy, side, side);

        // Nhãn 4 đỉnh A, B, C, D của khung dây
        ctx.fillStyle = '#fbbf24';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('D', fx - 10, fy - 4);
        ctx.fillText('C', fx + side + 10, fy - 4);
        ctx.fillText('A', fx - 10, fy + side + 15);
        ctx.fillText('B', fx + side + 10, fy + side + 15);

        // Vectơ vận tốc v = 0,2 m/s hướng ngang sang phải
        drawArrow(ctx, fx + side, fy + side / 2, fx + side + 42, fy + side / 2, '#10b981', 3, 8);
        drawSubText(ctx, 'v', '', fx + side + 18, fy + side / 2 - 10, { fontSize: 15, italic: true, color: '#6ee7b7', vector: true });

        // Thẻ thông số đề dẫn góc phải
        drawRoundRect(ctx, 540, 74, 222, 188, 10, '#0f172a', '#fbbf24', 2);
        ctx.fillStyle = '#fbbf24';
        ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('THÔNG SỐ KHUNG DÂY', 554, 98);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Cạnh vuông: a = 10 cm', 554, 126);
        ctx.fillText('• Số vòng dây: N = 200', 554, 152);
        ctx.fillText('• Điện trở: R = 2,5 Ω', 554, 178);
        ctx.fillText('• Cảm ứng từ: B = 0,4 T', 554, 204);
        ctx.fillText('• Vận tốc đều: v = 0,2 m/s', 554, 230);
        ctx.restore();
    });

    // =========================================================================
    // 15. MH-C3-67: CẤU TẠO CÔNG TẮC ĐIỆN TỪ (RƠ-LE ĐIỆN)
    // =========================================================================
    window.VLXTModels.register('MH-C3-67', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'CẤU TẠO & NGUYÊN LÝ HOẠT ĐỘNG CÔNG TẮC ĐIỆN TỪ (RƠ-LE)');

        // Chu kỳ đóng/ngắt rơ-le 1 chiều sawtooth
        const saw = (t * 0.25) % 1;
        const isClosed = saw >= 0.5;
        const armAngle = isClosed ? 0.08 : -0.05;

        ctx.save();
        // Đế cách điện phía dưới
        drawRoundRect(ctx, 115, 250, 390, 14, 4, '#78350f', '#d97706', 2);

        // Lõi sắt đứng & Cuộn dây điện từ ở giữa
        const coilX = 278, coilY = 112, coilW = 84, coilH = 128;
        // Lõi sắt non nhô trên & dưới cuộn dây
        drawRoundRect(ctx, coilX + 16, coilY - 14, 52, 152, 4, '#64748b', '#cbd5e1', 2);

        // Các vòng dây đồng quấn quanh lõi sắt
        const gradCopper = ctx.createLinearGradient(coilX, 0, coilX + coilW, 0);
        gradCopper.addColorStop(0, '#b45309');
        gradCopper.addColorStop(0.5, '#f59e0b');
        gradCopper.addColorStop(1, '#92400e');
        drawRoundRect(ctx, coilX, coilY, coilW, coilH, 6, gradCopper, '#fef08a', 2);

        ctx.strokeStyle = 'rgba(120, 53, 15, 0.7)';
        ctx.lineWidth = 1.6;
        for (let yy = coilY + 10; yy < coilY + coilH - 6; yy += 9) {
            ctx.beginPath(); ctx.moveTo(coilX + 2, yy); ctx.lineTo(coilX + coilW - 2, yy); ctx.stroke();
        }

        // Dây dẫn cấp dòng điện vào cuộn dây từ chân đế
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(232, 250); ctx.lineTo(232, 126); ctx.lineTo(coilX, 126);
        ctx.moveTo(254, 250); ctx.lineTo(254, 224); ctx.lineTo(coilX, 224);
        ctx.stroke();

        // Điểm tựa hình tam giác của cánh tay động
        const pivX = 212, pivY = 92;
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(pivX, pivY);
        ctx.lineTo(pivX - 10, pivY + 16);
        ctx.lineTo(pivX + 10, pivY + 16);
        ctx.closePath();
        ctx.fill();

        // Lò xo hồi vị bên trái
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(166, 250);
        const spTop = isClosed ? 86 : 94;
        for (let i = 0; i < 10; i++) {
            const sy = 244 - i * ((244 - spTop) / 10);
            ctx.lineTo(166 + (i % 2 === 0 ? -7 : 7), sy);
        }
        ctx.lineTo(166, spTop);
        ctx.stroke();

        // Cánh tay di động quay quanh điểm tựa
        ctx.save();
        ctx.translate(pivX, pivY - 6);
        ctx.rotate(armAngle);
        drawRoundRect(ctx, -54, -8, 265, 14, 4, '#94a3b8', '#f8fafc', 2.2);
        // Tiếp điểm động ở đầu phải cánh tay
        drawRoundRect(ctx, 194, 6, 16, 7, 2, '#fbbf24', '#fef08a', 1.6);
        ctx.restore();

        // Tiếp điểm tĩnh & Mạch thứ hai màu đỏ bên phải
        const contactY = 104;
        drawRoundRect(ctx, 405, contactY, 18, 7, 2, '#fbbf24', '#fef08a', 1.6);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(414, contactY + 7);
        ctx.lineTo(414, 250);
        ctx.stroke();

        // Trạng thái đóng/ngắt
        drawRoundRect(ctx, 515, 68, 245, 198, 10, '#0f172a', isClosed ? '#10b981' : '#f59e0b', 2);
        ctx.fillStyle = isClosed ? '#6ee7b7' : '#fbbf24';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(isClosed ? 'TRẠNG THÁI: ĐÓNG MẠCH' : 'TRẠNG THÁI: NGẮT MẠCH', 530, 94);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Cuộn dây điện từ tạo từ trường', 530, 124);
        ctx.fillText('• Hút cánh tay di động xuống', 530, 150);
        ctx.fillText('• Đóng bộ tiếp điểm mạch thứ 2', 530, 176);
        ctx.fillText('• Ngắt dòng cuộn dây → lò xo kéo', 530, 204);
        ctx.fillText('  cánh tay lên ngắt tiếp điểm', 530, 228);
        ctx.restore();
    });

    // =========================================================================
    // 16. MH-C3-68: HAI SƠ ĐỒ HÌNH 1 (RƠ-LE) & HÌNH 2 (MẠCH BÁO CHÁY ĐIỆN TRỞ NHIỆT X)
    // =========================================================================
    window.VLXTModels.register('MH-C3-68', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'RƠ-LE ĐIỆN TỪ (HÌNH 1) & ỨNG DỤNG MẠCH BÁO CHÁY ĐIỆN TRỞ NHIỆT X (HÌNH 2)');

        const saw = (t * 0.25) % 1;
        const active = saw >= 0.5;

        ctx.save();
        // --- HÌNH 1 (BÊN TRÁI): CẤU TẠO RƠ-LE TRONG KHUNG NÉT ĐỨT ---
        ctx.strokeStyle = '#94a3b8';
        ctx.setLineDash([6, 4]);
        ctx.lineWidth = 2.2;
        ctx.strokeRect(42, 64, 345, 194);
        ctx.setLineDash([]);

        // Cặp tiếp điểm A, B phía trên trái
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        ctx.moveTo(85, 86); ctx.lineTo(148, 86);
        ctx.moveTo(85, 108); ctx.lineTo(148, 108);
        ctx.stroke();
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('A', 78, 91);
        ctx.fillText('B', 78, 113);

        // Thanh sắt non hình chữ L quay quanh trục ở góc phải trên cuộn dây
        const pivX = 278, pivY = 128;
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath(); ctx.arc(pivX, pivY, 5, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        if (active) {
            ctx.moveTo(154, 128); ctx.lineTo(pivX, pivY); ctx.lineTo(pivX, 184);
        } else {
            ctx.moveTo(154, 122); ctx.lineTo(pivX, pivY); ctx.lineTo(pivX + 6, 184);
        }
        ctx.stroke();

        // Cuộn dây & Lõi kim loại nối với nguồn và khóa S tại C, D
        drawRoundRect(ctx, 138, 144, 126, 36, 4, '#1e293b', '#f59e0b', 2.4);
        // Các vòng dây quấn
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2.2;
        for (let xx = 148; xx <= 254; xx += 13) {
            ctx.beginPath(); ctx.moveTo(xx, 140); ctx.lineTo(xx, 184); ctx.stroke();
        }
        // Dây xuống C, D và khóa S
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(144, 180); ctx.lineTo(144, 224); ctx.lineTo(175, 224);
        ctx.moveTo(175, 224); ctx.lineTo(198, active ? 224 : 210); // Khóa S
        ctx.moveTo(202, 224); ctx.lineTo(258, 224); ctx.lineTo(258, 180);
        ctx.stroke();
        // Nguồn điện 1 chiều (cực dương bên trái, cực âm bên phải)
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(222, 214); ctx.lineTo(222, 234); // bản dài (+)
        ctx.moveTo(232, 219); ctx.lineTo(232, 229); // bản ngắn (-)
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.textAlign = 'center';
        ctx.fillText('C', 132, 226);
        ctx.fillText('D', 270, 226);
        ctx.fillText('S', 186, 206);
        ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('Hình 1', 214, 282);

        // --- HÌNH 2 (BÊN PHẢI): MẠCH BÁO CHÁY VỚI ĐIỆN TRỞ NHIỆT X & CHUÔNG ---
        const m2x = 455;
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 2.6;
        ctx.strokeRect(m2x, 86, 175, 162);

        // Nguồn U ở cạnh trái
        ctx.fillStyle = '#070d1c';
        ctx.fillRect(m2x - 8, 152, 16, 26);
        ctx.beginPath();
        ctx.moveTo(m2x - 12, 156); ctx.lineTo(m2x + 12, 156);
        ctx.moveTo(m2x - 7, 172); ctx.lineTo(m2x + 7, 172);
        ctx.stroke();
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('U', m2x - 22, 168);

        // Nhánh giữa: Điện trở nhiệt X & Cuộn dây C-D
        const midX = m2x + 88;
        ctx.beginPath();
        ctx.moveTo(midX, 74); ctx.lineTo(midX, 248);
        ctx.stroke();
        // Ký hiệu điện trở nhiệt X
        drawRoundRect(ctx, midX - 10, 98, 20, 42, 3, '#1e293b', '#ef4444', 2.2);
        ctx.strokeStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(midX - 18, 104); ctx.lineTo(midX + 18, 136);
        ctx.stroke();
        ctx.fillStyle = '#fca5a5';
        ctx.fillText('X', midX - 24, 124);

        // Hộp nét đứt Rơ-le bao quanh C-D và tiếp điểm A-B
        ctx.strokeStyle = '#38bdf8';
        ctx.setLineDash([5, 4]);
        ctx.strokeRect(midX - 28, 168, 146, 68);
        ctx.setLineDash([]);
        drawRoundRect(ctx, midX - 12, 184, 24, 38, 3, '#1e293b', '#f59e0b', 2);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('C', midX - 20, 182);
        ctx.fillText('D', midX - 20, 228);

        // Tiếp điểm A-B trên nhánh phải & Chuông báo động
        const rightX = m2x + 175;
        ctx.fillStyle = '#070d1c';
        ctx.fillRect(rightX - 8, 192, 16, 24);
        ctx.strokeStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(rightX, 192);
        ctx.lineTo(active ? rightX : rightX - 10, 214);
        ctx.stroke();
        ctx.fillText('A', rightX + 14, 192);
        ctx.fillText('B', rightX + 14, 222);

        // Chuông báo động ở góc phải trên
        drawRoundRect(ctx, rightX, 114, 18, 32, 6, active ? '#10b981' : '#475569', '#f8fafc', 2);
        ctx.fillStyle = '#f8fafc';
        ctx.textAlign = 'left';
        ctx.fillText('Chuông', rightX + 24, 134);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('Rơ le', rightX + 24, 206);

        ctx.fillStyle = '#f8fafc';
        ctx.textAlign = 'center';
        ctx.fillText('Hình 2', m2x + 88, 282);
        ctx.restore();
    });

})(window);
            })({ VLXTModels: tempVLXT });
        } catch(e) {
            if (typeof console !== 'undefined') console.error('Lỗi nạp Canvas chunk:', e);
        }



        try {
            (function(window) {
/**
 * ============================================================================
 * BỘ MÔ HÌNH CANVAS VẬT LÍ HYDROGEN V2 - CHƯƠNG 3 - CA 6 (CÂU 69 -> CÂU 84)
 * Gồm 16 mô hình: MH-C3-69, MH-C3-70, MH-C3-71, MH-C3-72, MH-C3-73, MH-C3-74,
 *                MH-C3-75, MH-C3-76, MH-C3-77, MH-C3-78, MH-C3-79, MH-C3-80,
 *                MH-C3-81, MH-C3-82, MH-C3-83, MH-C3-84
 * Chuẩn khung logic: 780 x 305 | Tuân thủ 10 Quy Tắc Vàng VLXT_MOTION_SPEC.md
 * ============================================================================
 */
(function(window) {
    'use strict';

    window.VLXTModels = window.VLXTModels || {
        _registry: {},
        register: function(id, fn) {
            this._registry[id] = fn;
        }
    };

    // =========================================================================
    // HỆ THỐNG HÀM TRỢ GIÚP CHUẨN VLXT (CORE HELPERS)
    // =========================================================================
    function clearCanvas(ctx, w, h) {
        ctx.clearRect(0, 0, w, h);
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#060b19');
        grad.addColorStop(1, '#0a1226');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
        ctx.lineWidth = 1;
        for (let x = 20; x < w; x += 26) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (let y = 20; y < h; y += 26) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }
        ctx.restore();
    }

    function drawRoundRect(ctx, x, y, w, h, r, fill, stroke, lineWidth = 2.8) {
        ctx.save();
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(x, y, w, h, r);
        } else {
            ctx.moveTo(x + r, y);
            ctx.lineTo(x + w - r, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + r);
            ctx.lineTo(x + w, y + h - r);
            ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            ctx.lineTo(x + r, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - r);
            ctx.lineTo(x, y + r);
            ctx.quadraticCurveTo(x, y, x + r, y);
            ctx.closePath();
        }
        if (fill) { ctx.fillStyle = fill; ctx.fill(); }
        if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); }
        ctx.restore();
    }

    function drawSubText(ctx, base, sub, x, y, opts = {}) {
        const fontSize = opts.fontSize || 15;
        const subSize = Math.round(fontSize * 0.74);
        const weight = opts.weight || '700';
        const italic = opts.italic ? 'italic ' : '';
        const color = opts.color || '#f8fafc';
        const align = opts.align || 'left';
        ctx.save();
        ctx.fillStyle = color;
        ctx.textBaseline = opts.baseline || 'alphabetic';
        ctx.font = `${italic}${weight} ${fontSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
        const baseW = ctx.measureText(base).width;
        ctx.font = `${weight} ${subSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
        const subW = sub ? ctx.measureText(sub).width : 0;
        const totalW = baseW + subW;
        let startX = x;
        if (align === 'center') startX = x - totalW / 2;
        else if (align === 'right') startX = x - totalW;

        ctx.font = `${italic}${weight} ${fontSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
        ctx.fillText(base, startX, y);
        if (sub) {
            ctx.font = `${weight} ${subSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
            ctx.fillText(sub, startX + baseW + 1, y + Math.round(fontSize * 0.28));
        }
        if (opts.vector) {
            const vy = y - fontSize + 1;
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.moveTo(startX, vy);
            ctx.lineTo(startX + baseW + 2, vy);
            ctx.lineTo(startX + baseW - 2, vy - 3);
            ctx.moveTo(startX + baseW + 2, vy);
            ctx.lineTo(startX + baseW - 2, vy + 3);
            ctx.stroke();
        }
        ctx.restore();
        return totalW;
    }

    function drawArrow(ctx, x1, y1, x2, y2, color = '#38bdf8', width = 3, headLen = 9) {
        const angle = Math.atan2(y2 - y1, x2 - x1);
        ctx.save();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    function drawCrossB(ctx, x, y, r = 9, color = '#38bdf8') {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.stroke();
        const d = r * 0.62;
        ctx.beginPath();
        ctx.moveTo(x - d, y - d); ctx.lineTo(x + d, y + d);
        ctx.moveTo(x + d, y - d); ctx.lineTo(x - d, y + d);
        ctx.stroke();
        ctx.restore();
    }

    function drawDotB(ctx, x, y, r = 9, color = '#38bdf8') {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y, 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    function drawCallout(ctx, targetX, targetY, boxX, boxY, lines, borderColor = '#38bdf8', textColor = '#f8fafc') {
        const lineArr = Array.isArray(lines) ? lines : [lines];
        ctx.save();
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        const padX = 10;
        const lineH = 18;
        const boxH = lineArr.length * lineH + 10;
        let maxW = 0;
        lineArr.forEach(l => {
            const mw = ctx.measureText(l).width;
            if (mw > maxW) maxW = mw;
        });
        const boxW = maxW + padX * 2;
        const anchorX = (boxX + boxW / 2 < targetX) ? (boxX + boxW) : (boxX > targetX ? boxX : boxX + boxW / 2);
        const anchorY = boxY + boxH / 2;

        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(targetX, targetY);
        ctx.lineTo(anchorX, anchorY);
        ctx.stroke();

        ctx.fillStyle = borderColor;
        ctx.beginPath();
        ctx.arc(targetX, targetY, 3.8, 0, Math.PI * 2);
        ctx.fill();

        drawRoundRect(ctx, boxX, boxY, boxW, boxH, 7, '#0f172a', borderColor, 1.8);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        lineArr.forEach((line, idx) => {
            ctx.fillStyle = idx === 0 ? textColor : '#cbd5e1';
            ctx.fillText(line, boxX + boxW / 2, boxY + 5 + lineH * (idx + 0.5));
        });
        ctx.restore();
    }

    function drawTitleBadge(ctx, text, x = 16, y = 14) {
        ctx.save();
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        const w = ctx.measureText(text).width + 22;
        drawRoundRect(ctx, x, y, w, 28, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x + 11, y + 14);
        ctx.restore();
    }

    // =========================================================================
    // 1. MH-C3-69: MÁY GIA TỐC HẠT CYCLOTRON (HAI HỘP CHỮ D I & II)
    // Ràng buộc: f_dd = 12 MHz, R = 53 cm; KHÔNG lộ B = 0,787 T của ý c.
    // =========================================================================
    window.VLXTModels.register('MH-C3-69', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'MÁY GIA TỐC HẠT CYCLOTRON (HAI CỰC CHỮ D: I & II · f_dd = 12 MHz · R = 53 cm)');

        const saw = (t * 0.25) % 1; // Hạt proton tăng tốc xoắn ốc 1 chiều -> phóng ra ngoài
        const cx = 255, cy = 144, R = 84;
        const gap = 8;

        ctx.save();
        // Hai hộp rỗng hình chữ D (trái = II, phải = I)
        ctx.fillStyle = 'rgba(56, 189, 248, 0.14)';
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 3;

        // Cực D bên trái (II)
        ctx.beginPath();
        ctx.arc(cx - gap, cy, R, Math.PI / 2, -Math.PI / 2, false);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Cực D bên phải (I)
        ctx.beginPath();
        ctx.arc(cx + gap, cy, R, -Math.PI / 2, Math.PI / 2, false);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Quỹ đạo xoắn ốc gồm các nửa đường tròn bán kính tăng dần từng bước
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        const turns = 4;
        for (let k = 0; k < turns * 2; k++) {
            const rad = 11 + k * 8.5;
            const isRight = (k % 2 === 0);
            const arcCx = cx + (isRight ? gap : -gap);
            const startA = isRight ? Math.PI / 2 : -Math.PI / 2;
            const endA = isRight ? -Math.PI / 2 : Math.PI / 2;
            ctx.arc(arcCx, cy, rad, startA, endA, true);
        }
        // Đoạn phóng hạt ra ngoài ở mép trên phải
        ctx.lineTo(cx + R + 58, cy - R + 12);
        ctx.stroke();
        drawArrow(ctx, cx + R + 24, cy - R + 6, cx + R + 62, cy - R + 13, '#fbbf24', 2.8, 8);

        // Chấm nguồn S ở tâm
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
        ctx.fill();

        // Hạt proton chuyển động 1 chiều dọc quỹ đạo xoắn ốc
        const totalA = saw * (turns * Math.PI * 2);
        const curR = 11 + (totalA / Math.PI) * 8.5;
        const px = cx + Math.cos(totalA) * curR;
        const py = cy - Math.sin(totalA) * curR;
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fill();

        // Nhãn II, I và S
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('II', cx - 44, cy - 32);
        ctx.fillText('I', cx + 44, cy - 32);
        ctx.fillStyle = '#fca5a5';
        ctx.fillText('S', cx - 10, cy + 16);

        // Nguồn điện xoay chiều S ở dưới nối với 2 cực D
        const acY = 262;
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(cx - 42, cy + R - 10); ctx.lineTo(cx - 42, acY); ctx.lineTo(cx - 18, acY);
        ctx.moveTo(cx + 42, cy + R - 10); ctx.lineTo(cx + 42, acY); ctx.lineTo(cx + 18, acY);
        ctx.stroke();
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.arc(cx, acY, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('~', cx, acY + 5);

        // Thẻ thông số đề dẫn bên phải (Zero Data Leakage - KHÔNG lộ B = 0,787 T)
        drawRoundRect(ctx, 455, 68, 305, 200, 10, '#0f172a', '#38bdf8', 2);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('THÔNG SỐ MÁY CYCLOTRON', 472, 94);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Hạt gia tốc: Proton', 472, 122);
        ctx.fillText('  m = 1,67·10⁻²⁷ kg; q = 1,6·10⁻¹⁹ C', 472, 144);
        ctx.fillText('• Tần số điện xoay chiều: f_dd = 12 MHz', 472, 170);
        ctx.fillText('• Bán kính hộp chữ D: R = 53 cm', 472, 196);
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('• Lực Lorentz giữ quỹ đạo nửa tròn', 472, 224);
        ctx.fillStyle = '#6ee7b7';
        ctx.fillText('• Điện trường tăng tốc qua khe hở', 472, 248);
        ctx.restore();
    });

    // =========================================================================
    // 2. MH-C3-70: MÁY GIA TỐC HẠT LỚN LHC (CERN · CHU VI 27 km · B = 5 T · r = 0,4297 m)
    // =========================================================================
    window.VLXTModels.register('MH-C3-70', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'MÁY GIA TỐC HẠT LỚN LHC (CERN · B = 5 T; r = 0,4297 m; q = 1,6·10⁻¹⁹ C)');

        const angle = (t * 2.2) % (Math.PI * 2);

        ctx.save();
        // 1. Nam châm chữ U siêu dẫn tạo từ trường B = 5 T bên trái
        const mx = 68, my = 104;
        drawRoundRect(ctx, mx, my, 82, 122, 16, '#1e293b', '#94a3b8', 2.8);
        // Hai cực N (đỏ) và S (xanh)
        drawRoundRect(ctx, mx + 6, my + 6, 30, 48, 5, '#ef4444', '#fca5a5', 1.8);
        drawRoundRect(ctx, mx + 46, my + 6, 30, 48, 5, '#3b82f6', '#93c5fd', 1.8);
        ctx.fillStyle = '#ffffff';
        ctx.font = '800 16px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('N', mx + 21, my + 35);
        ctx.fillText('S', mx + 61, my + 35);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('B = 5 T', mx + 41, my + 148);

        // Dấu cộng "+"
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 28px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('+', 186, 172);

        // 2. Quỹ đạo tròn bán kính r = 0,4297 m của hạt proton ở giữa
        const cx = 315, cy = 166, r = 74;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3.4;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();

        // Bán kính r nét đứt từ tâm ra
        ctx.strokeStyle = '#f59e0b';
        ctx.setLineDash([5, 4]);
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + r, cy);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'italic 800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('r', cx + r / 2, cy - 10);

        // Hạt proton chuyển động tròn đều & Vectơ lực từ hướng tâm F + vận tốc tiếp tuyến v
        const px = cx + Math.cos(angle) * r;
        const py = cy + Math.sin(angle) * r;
        // Lực từ hướng tâm
        drawArrow(ctx, px, py, px - Math.cos(angle) * 34, py - Math.sin(angle) * 34, '#ef4444', 2.8, 7);
        // Vận tốc tiếp tuyến
        drawArrow(ctx, px, py, px - Math.sin(angle) * 34, py + Math.cos(angle) * 34, '#10b981', 2.8, 7);

        ctx.fillStyle = '#fbbf24';
        ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2); ctx.fill();

        // Thẻ thông số đề dẫn bên phải
        drawRoundRect(ctx, 445, 72, 315, 196, 10, '#0f172a', '#38bdf8', 2);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('THÔNG SỐ MÁY GIA TỐC LHC', 462, 98);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Chu vi đường hầm: 27 km', 462, 126);
        ctx.fillText('• Cảm ứng từ siêu dẫn: B = 5 T', 462, 152);
        ctx.fillText('• Bán kính quỹ đạo: r = 0,4297 m', 462, 178);
        ctx.fillText('• Proton: m = 1,67·10⁻²⁷ kg', 462, 204);
        ctx.fillStyle = '#6ee7b7';
        ctx.fillText('• Lực từ F = Bv|q| đóng vai trò lực hướng tâm', 462, 234);
        ctx.restore();
    });

    // =========================================================================
    // 3. MH-C3-71: MÁY QUANG PHỔ KHỐI (NGUỒN S, ĐIỆN ÁP U, TỪ TRƯỜNG ⊙ B, CẢM BIẾN x)
    // =========================================================================
    window.VLXTModels.register('MH-C3-71', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'MÁY QUANG PHỔ KHỐI ĐO KHỐI LƯỢNG ION (B = 80 mT; U = 1000 V)');

        const saw = (t * 0.28) % 1; // Ion +q tăng tốc từ nguồn S -> uốn nửa vòng tròn đập vào cảm biến

        ctx.save();
        // Buồng phân tách từ trường hình chữ nhật phía trên
        const bx = 175, by = 56, bw = 465, bh = 166;
        const botY = by + bh; // y = 222
        drawRoundRect(ctx, bx, by, bw, bh, 4, 'rgba(15, 23, 42, 0.78)', '#cbd5e1', 3);

        // Chừa khe hở ở đáy buồng cho chùm ion bay vào (tại entryX = 255)
        const entryX = 255;
        ctx.fillStyle = '#060b19';
        ctx.fillRect(entryX - 8, botY - 3, 16, 6);

        // Các dấu chấm tròn từ trường đều ⊙ B hướng ra ngoài mặt phẳng hình vẽ
        for (let x = bx + 34; x <= bx + bw - 26; x += 56) {
            for (let y = by + 26; y <= botY - 26; y += 44) {
                drawDotB(ctx, x, y, 7.5, 'rgba(56, 189, 248, 0.72)');
            }
        }
        drawSubText(ctx, 'B', '', bx + 225, by + 64, { fontSize: 16, italic: true, color: '#38bdf8', vector: true });

        // Nguồn ion S & Nguồn điện áp tăng tốc U ở dưới
        drawRoundRect(ctx, entryX - 20, 256, 40, 32, 5, '#1e293b', '#f59e0b', 2.4);
        ctx.fillStyle = '#fbbf24';
        ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('S', entryX, 277);

        // Ký hiệu nguồn điện U nối từ S lên đáy buồng
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(entryX - 20, 272); ctx.lineTo(132, 272); ctx.lineTo(132, 254);
        ctx.moveTo(132, 242); ctx.lineTo(132, botY); ctx.lineTo(175, botY);
        // Bản cực nguồn U
        ctx.moveTo(120, 242); ctx.lineTo(144, 242); // cực âm (-)
        ctx.moveTo(125, 254); ctx.lineTo(139, 254); // cực dương (+)
        ctx.stroke();
        ctx.fillStyle = '#f8fafc';
        ctx.fillText('U', 106, 252);

        // Thanh Cảm biến nằm dọc đáy buồng bên phải
        const rArc = 112;
        const arcCenterX = entryX + rArc; // 367
        const hitX = entryX + 2 * rArc; // 479
        ctx.fillStyle = '#10b981';
        ctx.fillRect(arcCenterX + 18, botY - 5, 195, 10);
        drawCallout(ctx, arcCenterX + 125, botY - 5, 515, 166, ['Cảm biến ion'], '#10b981');

        // Quỹ đạo ion nét đứt: bay thẳng đứng lên vào khe -> uốn nửa đường tròn bán kính r -> đập vào Cảm biến
        ctx.strokeStyle = '#fbbf24';
        ctx.setLineDash([5, 4]);
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(entryX, 256);
        ctx.lineTo(entryX, botY);
        ctx.arc(arcCenterX, botY, rArc, Math.PI, 0, false);
        ctx.lineTo(hitX, botY + 28);
        ctx.stroke();
        ctx.setLineDash([]);

        // Bán kính r & Khoảng cách x = 2r
        drawArrow(ctx, arcCenterX, botY, arcCenterX + rArc * Math.cos(-Math.PI / 4), botY + rArc * Math.sin(-Math.PI / 4), '#38bdf8', 2.2, 7);
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'italic 800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('r', arcCenterX + 34, botY - 46);

        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(entryX, botY + 34); ctx.lineTo(hitX, botY + 34);
        ctx.stroke();
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('x = 2r', arcCenterX, botY + 52);

        // Hạt ion +q chuyển động 1 chiều sawtooth dọc quỹ đạo
        let ix, iy;
        if (saw < 0.25) {
            const p = saw / 0.25;
            ix = entryX;
            iy = 256 - p * (256 - botY);
        } else {
            const p = (saw - 0.25) / 0.75;
            const ang = Math.PI - p * Math.PI;
            ix = arcCenterX + Math.cos(ang) * rArc;
            iy = botY - Math.sin(ang) * rArc;
        }
        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.arc(ix, iy, 5.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fca5a5';
        ctx.font = '800 13px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('+q', entryX + 18, 242);
        ctx.restore();
    });

    // =========================================================================
    // 4. MH-C3-72: MÁY QUANG PHỔ KHỐI TÁCH ĐỒNG VỊ URANIUM U-235 VÀ U-238
    // Ràng buộc: KHÔNG ghi sẵn khoảng cách 0,075 m của ý a.
    // =========================================================================
    window.VLXTModels.register('MH-C3-72', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'TÁCH ĐỒNG VỊ URANIUM U-235 & U-238 (B = 0,25 T; v = 3·10⁵ m/s)');

        const saw = (t * 0.26) % 1;

        ctx.save();
        // Bể chân không chứa từ trường đều vuông góc mặt phẳng
        const bx = 95, by = 52, bw = 425, bh = 232;
        drawRoundRect(ctx, bx, by, bw, bh, 6, 'rgba(15, 23, 42, 0.8)', '#cbd5e1', 3);

        // Nguồn ion UCl4 ở góc dưới trái
        drawRoundRect(ctx, bx + 16, by + bh - 64, 92, 48, 5, '#1e293b', '#f59e0b', 2.4);
        ctx.fillStyle = '#fbbf24';
        ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Nguồn ion', bx + 62, by + bh - 45);
        ctx.fillText('UCl₄', bx + 62, by + bh - 26);

        // Khe hẹp định hướng chùm ion bay ngang vào từ trường
        const slitX = bx + 148, slitY = by + bh - 40;
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(slitX, slitY - 24); ctx.lineTo(slitX, slitY - 7);
        ctx.moveTo(slitX, slitY + 7); ctx.lineTo(slitX, slitY + 24);
        ctx.stroke();

        // Hai hộp thu đồng vị phía trên (U-238 ngoài cùng bán kính lớn hơn, U-235 bên trong bán kính nhỏ hơn)
        const r235 = 56, r238 = 84;
        const c235Y = slitY - r235;
        const c238Y = slitY - r238;
        const top235Y = slitY - 2 * r235;
        const top238Y = slitY - 2 * r238;

        // Hộp thu U-238 (vòng ngoài)
        drawOpenCupU(ctx, slitX - 18, top238Y - 12, 26, 24, '#ef4444');
        // Hộp thu U-235 (vòng trong)
        drawOpenCupU(ctx, slitX - 18, top235Y - 12, 26, 24, '#10b981');

        function drawOpenCupU(c, x, y, wBox, hBox, col) {
            c.strokeStyle = col;
            c.lineWidth = 3;
            c.beginPath();
            c.moveTo(x + wBox, y);
            c.lineTo(x, y);
            c.lineTo(x, y + hBox);
            c.lineTo(x + wBox, y + hBox);
            c.stroke();
        }

        // Quỹ đạo nửa đường tròn của U-235 (bán kính nhỏ) và U-238 (bán kính lớn)
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(bx + 108, slitY);
        ctx.lineTo(slitX + 35, slitY);
        ctx.stroke();

        // Quỹ đạo U-235 (trong)
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(slitX + 35, c235Y, r235, Math.PI / 2, -Math.PI / 2, true);
        ctx.lineTo(slitX - 6, top235Y);
        ctx.stroke();

        // Quỹ đạo U-238 (ngoài)
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(slitX + 35, c238Y, r238, Math.PI / 2, -Math.PI / 2, true);
        ctx.lineTo(slitX - 6, top238Y);
        ctx.stroke();

        // Hai hạt ion chuyển động đồng bộ 1 chiều sawtooth vào 2 hộp thu
        const ang = Math.PI / 2 - saw * Math.PI;
        ctx.fillStyle = '#6ee7b7';
        ctx.beginPath();
        ctx.arc(slitX + 35 + Math.cos(ang) * r235, c235Y + Math.sin(ang) * r235, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fca5a5';
        ctx.beginPath();
        ctx.arc(slitX + 35 + Math.cos(ang) * r238, c238Y + Math.sin(ang) * r238, 5, 0, Math.PI * 2);
        ctx.fill();

        // Nhãn U-238 và U-235
        ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillStyle = '#fca5a5';
        ctx.fillText('U-238', slitX - 24, top238Y + 5);
        ctx.fillStyle = '#6ee7b7';
        ctx.fillText('U-235', slitX - 24, top235Y + 5);

        ctx.textAlign = 'left';
        ctx.fillStyle = '#fca5a5';
        ctx.fillText('Ions U-238', slitX + 35 + r238 + 8, c238Y);
        ctx.fillStyle = '#6ee7b7';
        ctx.fillText('Ions U-235', slitX + 35 + r235 + 8, c235Y + 18);

        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'center';
        ctx.fillText('Bể chân không (B = 0,25 T)', bx + bw - 115, by + 26);

        // Thẻ thông số đề dẫn bên phải (Zero Data Leakage - KHÔNG ghi 0,075 m)
        drawRoundRect(ctx, 538, 68, 224, 200, 10, '#0f172a', '#38bdf8', 2);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('THÔNG SỐ TÁCH ĐỒNG VỊ', 552, 94);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Điện tích: q = 1,6·10⁻¹⁹ C', 552, 122);
        ctx.fillText('• Vận tốc: v = 3·10⁵ m/s', 552, 148);
        ctx.fillText('• Cảm ứng từ: B = 0,25 T', 552, 174);
        ctx.fillText('• m(U-235) = 3,90·10⁻²⁵ kg', 552, 200);
        ctx.fillText('• m(U-238) = 3,95·10⁻²⁵ kg', 552, 226);
        ctx.restore();
    });

    // =========================================================================
    // 5. MH-C3-73: MICRO ĐIỆN ĐỘNG (MÀNG RUNG, CUỘN DÂY 12 VÒNG, NAM CHÂM N-S)
    // =========================================================================
    window.VLXTModels.register('MH-C3-73', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'CẤU TẠO MICRO ĐIỆN ĐỘNG (N = 12 vòng; S = 40 cm²; ΔB/Δt = 5 T/s)');

        const vib = Math.sin(t * 7) * 5; // Màng rung & cuộn dây dao động dọc trục nam châm

        ctx.save();
        // 1. Sóng âm truyền từ bên trái đập vào màng rung (1 chiều sawtooth)
        for (let i = 0; i < 4; i++) {
            const sp = (t * 0.9 + i * 0.25) % 1;
            const sx = 95 + sp * 115;
            ctx.strokeStyle = `rgba(56, 189, 248, ${(1 - sp * 0.6).toFixed(2)})`;
            ctx.lineWidth = 2.6;
            ctx.beginPath();
            ctx.arc(sx, 152, 16 + sp * 14, -Math.PI * 0.35, Math.PI * 0.35);
            ctx.stroke();
        }
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Sóng âm', 145, 108);

        // 2. Thanh nam châm vĩnh cửu nằm yên ở giữa-phải (cực S xanh trái, cực N đỏ phải)
        const magX = 315, magY = 132, magW = 215, magH = 40;
        drawRoundRect(ctx, magX, magY, magW / 2, magH, 4, '#3b82f6', '#93c5fd', 2.2);
        drawRoundRect(ctx, magX + magW / 2, magY, magW / 2, magH, 4, '#ef4444', '#fca5a5', 2.2);
        ctx.fillStyle = '#ffffff';
        ctx.font = '800 16px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textBaseline = 'middle';
        ctx.fillText('S', magX + 26, magY + magH / 2);
        ctx.fillText('N', magX + magW - 26, magY + magH / 2);

        // 3. Màng rung hình phễu & Ống cuộn dây 12 vòng di chuyển qua lại dọc trục nam châm
        const coneX = 245 + vib;
        ctx.fillStyle = 'rgba(148, 163, 184, 0.32)';
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(coneX, 92);
        ctx.lineTo(coneX + 42, 126);
        ctx.lineTo(coneX + 42, 178);
        ctx.lineTo(coneX, 212);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Ống trụ gắn cuộn dây trượt trên đầu cực S của nam châm
        const coilStartX = coneX + 42;
        drawRoundRect(ctx, coilStartX, 126, 78, 52, 4, 'rgba(245, 158, 11, 0.22)', '#fbbf24', 2.2);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3.2;
        for (let k = 0; k < 8; k++) {
            const wx = coilStartX + 10 + k * 8;
            ctx.beginPath();
            ctx.moveTo(wx, 123);
            ctx.lineTo(wx, 181);
            ctx.stroke();
        }

        // Hai đầu dây A, B đưa tín hiệu điện cảm ứng ra Mạch khuếch đại
        const wireAx = coilStartX + 10, wireBx = coilStartX + 66;
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(wireAx, 181); ctx.lineTo(wireAx, 232);
        ctx.moveTo(wireBx, 181); ctx.lineTo(wireBx, 232);
        ctx.stroke();
        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.arc(wireAx, 234, 4.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(wireBx, 234, 4.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('A', wireAx - 14, 235);
        ctx.fillText('B', wireBx + 14, 235);
        drawArrow(ctx, (wireAx + wireBx) / 2, 236, (wireAx + wireBx) / 2, 266, '#fbbf24', 3, 7);
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('Mạch khuếch đại', (wireAx + wireBx) / 2, 282);

        // Chú thích callout
        drawCallout(ctx, coneX, 112, 28, 198, ['Màng rung', 'Dao động theo sóng âm'], '#cbd5e1');
        drawCallout(ctx, coilStartX + 40, 123, 335, 58, ['Cuộn dây (12 vòng; 40 cm²)', 'Di chuyển dọc trục nam châm'], '#f59e0b');
        drawCallout(ctx, magX + magW - 20, magY, 555, 86, ['Nam châm vĩnh cửu', 'Đặt cố định (nằm yên)'], '#ef4444');
        ctx.restore();
    });

    // =========================================================================
    // 6. MH-C3-74: LOA ĐIỆN ĐỘNG GỒM 2 HÌNH SONG SONG (HÌNH a & HÌNH b)
    // =========================================================================
    window.VLXTModels.register('MH-C3-74', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'CẤU TẠO LOA ĐIỆN ĐỘNG (N = 20 vòng; d = 7,2 cm; B = 0,075 T; R = 5,8 Ω)');

        const vib = Math.sin(t * 7) * 4;

        ctx.save();
        // --- HÌNH a (BÊN TRÁI): MẶT CẮT DỌC LOA ĐIỆN ---
        // Nam châm tròn mặt cắt (cực S xanh bao ngoài, cực N đỏ ở giữa)
        const m1x = 128, m1y = 148;
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(m1x, m1y - 54, 46, 108);
        ctx.fillStyle = '#070c18';
        ctx.fillRect(m1x + 18, m1y - 38, 30, 76);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(m1x + 18, m1y - 22, 34, 44);

        ctx.fillStyle = '#ffffff';
        ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('S', m1x + 32, m1y - 44);
        ctx.fillText('S', m1x + 32, m1y + 48);
        ctx.fillText('N', m1x + 35, m1y + 4);

        // Cuộn dây & Nón loa dao động theo vib
        const cx1 = m1x + 44 + vib;
        drawRoundRect(ctx, cx1, m1y - 28, 22, 56, 3, 'rgba(245, 158, 11, 0.35)', '#fbbf24', 2.4);

        // Nón loa (màng loa)
        ctx.fillStyle = 'rgba(56, 189, 248, 0.28)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx1 + 22, m1y - 28);
        ctx.lineTo(cx1 + 78, m1y - 78);
        ctx.lineTo(cx1 + 78, m1y + 78);
        ctx.lineTo(cx1 + 22, m1y + 28);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Hai dây tín hiệu điện I đi vào cuộn dây
        ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.moveTo(cx1 + 8, m1y + 28); ctx.quadraticCurveTo(95, 226, 86, 250); ctx.stroke();
        ctx.strokeStyle = '#ef4444';
        ctx.beginPath(); ctx.moveTo(cx1 + 16, m1y + 28); ctx.quadraticCurveTo(118, 226, 110, 250); ctx.stroke();
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '700 13px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('Tín hiệu điện I', 98, 266);
        ctx.fillText('Nón loa', cx1 + 82, 64);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('Hình a. Mặt cắt dọc loa', 185, 290);

        // --- HÌNH b (BÊN PHẢI): PHỐI CẢNH NAM CHÂM TRÒN & CUỘN DÂY ---
        const c2x = 545, c2y = 146;
        // Vành cực Nam S (xanh dương) bao ngoài
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 24;
        ctx.beginPath();
        ctx.arc(c2x, c2y, 76, -Math.PI * 0.85, Math.PI * 0.65);
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = '800 16px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('S', c2x - 76, c2y);

        // Cuộn dây tròn nằm trong khe từ
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.arc(c2x, c2y, 50, 0, Math.PI * 2);
        ctx.stroke();
        // Các đường vòng dây đồng
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 1.4;
        for (let r = 44; r <= 56; r += 4) {
            ctx.beginPath(); ctx.arc(c2x, c2y, r, 0, Math.PI * 2); ctx.stroke();
        }

        // Trụ cực Bắc N (màu đỏ) ở tâm
        ctx.fillStyle = '#ef4444';
        ctx.strokeStyle = '#fca5a5';
        ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.arc(c2x, c2y, 32, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = '800 20px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('N', c2x, c2y + 6);

        // Mũi tên chiều dòng điện I chạy cùng chiều kim đồng hồ trên cuộn dây
        drawArrow(ctx, c2x - 28, c2y + 58, c2x + 24, c2y + 58, '#fbbf24', 2.8, 7);
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'italic 800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('I', c2x, c2y + 76);

        drawCallout(ctx, c2x + 42, c2y + 34, 625, 212, ['Cuộn dây tròn', 'Gắn vào nón loa'], '#f59e0b');
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('Hình b. Bố trí cuộn dây & nam châm', 545, 290);
        ctx.restore();
    });

    // =========================================================================
    // 7. MH-C3-75: DYNAMO XE ĐẠP (BÁNH XE TÌ NÚM DẪN ĐỘNG & SƠ ĐỒ MẶT CẮT)
    // =========================================================================
    window.VLXTModels.register('MH-C3-75', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'DYNAMO XE ĐẠP (BÁN KÍNH NÚM DẪN ĐỘNG R = 3 cm; Φ_max = 0,03 Wb)');

        const rot = t * 4;

        ctx.save();
        // --- BÊN TRÁI: BÁNH XE ĐẠP TÌ NÚM DẪN ĐỘNG DYNAMO & ĐÈN PHA ---
        const wx = 125, wy = 245, wr = 115;
        // Vành lốp xe đạp quay
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 10;
        ctx.beginPath(); ctx.arc(wx, wy, wr, Math.PI, Math.PI * 1.92); ctx.stroke();
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        for (let k = 0; k < 6; k++) {
            const a = Math.PI + (k * 0.16) + ((rot * 0.1) % 0.16);
            ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(wx + Math.cos(a) * wr, wy + Math.sin(a) * wr); ctx.stroke();
        }

        // Thân Dynamo tì sát vành lốp
        ctx.save();
        ctx.translate(185, 152);
        ctx.rotate(-0.42);
        drawRoundRect(ctx, -12, 0, 24, 52, 5, '#334155', '#94a3b8', 2.2);
        drawRoundRect(ctx, -8, -14, 16, 14, 3, '#f59e0b', '#fef08a', 2); // Núm tì vào lốp
        ctx.restore();

        // Đèn pha xe đạp phát sáng phía trên
        drawRoundRect(ctx, 118, 76, 36, 26, 8, '#1e293b', '#cbd5e1', 2.2);
        ctx.fillStyle = '#fef08a';
        ctx.beginPath(); ctx.arc(156, 89, 10, -Math.PI / 2, Math.PI / 2); ctx.fill();
        drawArrow(ctx, 170, 89, 206, 89, '#fef08a', 2.4, 6);

        // --- BÊN PHẢI: SƠ ĐỒ MẶT CẮT DỌC DYNAMO ---
        const dx = 455;
        // Núm dẫn động bán kính 3 cm trên đỉnh
        drawRoundRect(ctx, dx - 22, 62, 44, 18, 4, '#475569', '#cbd5e1', 2.2);
        // Trục quay thẳng đứng
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(dx - 4, 80, 8, 66);

        // Lõi sắt non hình chữ U cố định bên dưới
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 14;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(dx - 42, 152);
        ctx.lineTo(dx - 42, 232);
        ctx.lineTo(dx + 42, 232);
        ctx.lineTo(dx + 42, 152);
        ctx.stroke();

        // Cuộn dây dẫn quấn quanh đáy lõi sắt non
        drawRoundRect(ctx, dx - 26, 220, 52, 24, 4, '#b45309', '#fbbf24', 2);
        ctx.strokeStyle = '#fef08a'; ctx.lineWidth = 1.6;
        for (let xx = dx - 20; xx <= dx + 20; xx += 7) {
            ctx.beginPath(); ctx.moveTo(xx, 220); ctx.lineTo(xx, 244); ctx.stroke();
        }

        // Nam châm N-S quay trên trục giữa hai nhánh lõi sắt
        const magHalfW = 28 * Math.cos(rot);
        if (magHalfW >= 0) {
            ctx.fillStyle = '#ef4444'; ctx.fillRect(dx - magHalfW, 146, magHalfW, 38);
            ctx.fillStyle = '#3b82f6'; ctx.fillRect(dx, 146, magHalfW, 38);
        } else {
            ctx.fillStyle = '#3b82f6'; ctx.fillRect(dx + magHalfW, 146, -magHalfW, 38);
            ctx.fillStyle = '#ef4444'; ctx.fillRect(dx, 146, -magHalfW, 38);
        }
        ctx.strokeStyle = '#f8fafc'; ctx.lineWidth = 2;
        ctx.strokeRect(dx - Math.abs(magHalfW), 146, Math.abs(magHalfW) * 2, 38);

        // Bóng đèn mắc nối tiếp với cuộn dây
        const lx = 335, ly = 86;
        ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(dx - 26, 232); ctx.lineTo(lx - 10, 232); ctx.lineTo(lx - 10, ly + 14);
        ctx.moveTo(dx - 20, 244); ctx.lineTo(lx + 10, 244); ctx.lineTo(lx + 10, ly + 14);
        ctx.stroke();
        const glow = 0.5 + 0.5 * Math.sin(rot * 2) ** 2;
        ctx.fillStyle = `rgba(254, 240, 138, ${(0.45 + 0.55 * glow).toFixed(2)})`;
        ctx.strokeStyle = '#fbbf24';
        ctx.beginPath(); ctx.arc(lx, ly, 16, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        // Nhãn callout rõ ràng
        drawCallout(ctx, dx + 22, 71, 535, 58, ['Núm dẫn động (R = 3 cm)'], '#cbd5e1');
        drawCallout(ctx, dx + 28, 165, 535, 114, ['Nam châm quay (Phần cảm)'], '#ef4444');
        drawCallout(ctx, dx + 49, 200, 535, 174, ['Lõi sắt non chữ U'], '#94a3b8');
        drawCallout(ctx, dx + 26, 234, 535, 232, ['Cuộn dây dẫn (Phần ứng)'], '#fbbf24');
        ctx.restore();
    });

    // =========================================================================
    // 8. MH-C3-76: BẾP ĐIỆN TỪ (CUỘN DÂY CAO TẦN & DÒNG ĐIỆN FOUCAULT ĐÁY NỒI)
    // =========================================================================
    window.VLXTModels.register('MH-C3-76', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'NGUYÊN LÝ BẾP ĐIỆN TỪ (CẢM ỨNG ĐIỆN TỪ & DÒNG FOUCAULT)');

        const pulse = 0.5 + 0.5 * Math.sin(t * 6) ** 2;

        ctx.save();
        // 1. Mặt bếp bằng thủy tinh chịu nhiệt phẳng ở giữa
        const glassY = 172;
        drawRoundRect(ctx, 115, glassY, 440, 14, 4, '#334155', '#94a3b8', 2.4);

        // 2. Nồi kim loại đáy có từ tính đặt trên mặt bếp
        const potX = 185, potY = 76, potW = 300, potH = 96;
        // Nước sôi bên trong nồi
        ctx.fillStyle = 'rgba(56, 189, 248, 0.28)';
        ctx.fillRect(potX + 4, potY + 26, potW - 8, potH - 30);
        // Đáy nồi nhiễm từ phát nhiệt đỏ cam
        ctx.fillStyle = `rgba(239, 68, 68, ${(0.35 + 0.45 * pulse).toFixed(2)})`;
        ctx.fillRect(potX + 2, potY + potH - 14, potW - 4, 12);

        // Thành nồi hở miệng trên
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(potX, potY);
        ctx.lineTo(potX, potY + potH);
        ctx.lineTo(potX + potW, potY + potH);
        ctx.lineTo(potX + potW, potY);
        ctx.stroke();

        // Mũi tên dòng điện xoáy Foucault & nhiệt bốc lên trong đáy nồi
        for (let x = potX + 38; x <= potX + potW - 38; x += 56) {
            drawArrow(ctx, x, potY + potH - 12, x, potY + 38, '#fb923c', 2.4, 6);
        }

        // 3. Cuộn dây phẳng dưới mặt bếp & Mạch điều khiển
        const coilY = 212;
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.ellipse(335, coilY, 138, 14, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(335, coilY, 96, 9, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Các đường sức từ biến thiên nét đứt xuyên qua mặt bếp vào đáy nồi
        ctx.strokeStyle = `rgba(56, 189, 248, ${(0.45 + 0.5 * pulse).toFixed(2)})`;
        ctx.setLineDash([5, 4]);
        ctx.lineWidth = 2.2;
        [-75, 75].forEach(dx => {
            ctx.beginPath();
            ctx.ellipse(335 + dx, 184, 52, 34, 0, 0, Math.PI * 2);
            ctx.stroke();
        });
        ctx.setLineDash([]);

        // Mạch điều khiển tần số cao bên dưới
        drawRoundRect(ctx, 435, 248, 92, 34, 6, '#1e293b', '#38bdf8', 2.2);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '700 12.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Mạch điều khiển', 481, 268);
        ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.moveTo(395, 224); ctx.lineTo(435, 265); ctx.stroke();

        // Chú thích callout rõ ràng
        drawCallout(ctx, 485, 162, 535, 96, ['Đáy nồi có từ tính', 'Dòng Foucault sinh nhiệt'], '#fb923c');
        drawCallout(ctx, 545, 179, 535, 164, ['Mặt bếp thủy tinh', 'Cách nhiệt & cách điện'], '#cbd5e1');
        drawCallout(ctx, 210, 212, 22, 236, ['Cuộn dây phẳng', 'Dòng cao tần f ≈ 12,1 kHz'], '#f59e0b');
        ctx.restore();
    });

    // =========================================================================
    // 9. MH-C3-77: ĐÈN LẮC TAY KHÔNG CẦN PIN (NAM CHÂM DAO ĐỘNG QUA CUỘN DÂY)
    // =========================================================================
    window.VLXTModels.register('MH-C3-77', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'ĐÈN LẮC TAY KHÔNG DÙNG PIN (CẢM ỨNG ĐIỆN TỪ)');

        const osc = Math.sin(t * 4.5) * 58; // Nam châm trượt qua lại dọc trục xuyên qua cuộn dây

        ctx.save();
        // Thân đèn hình trụ trong suốt
        const bx = 95, by = 112, bw = 490, bh = 88;
        drawRoundRect(ctx, bx, by, bw, bh, 18, 'rgba(15, 23, 42, 0.78)', '#94a3b8', 3);

        // Hai đệm cao su đàn hồi ở hai đầu ống
        drawRoundRect(ctx, bx + 8, by + 12, 16, bh - 24, 4, '#475569', '#cbd5e1', 2);
        drawRoundRect(ctx, bx + bw - 95, by + 12, 16, bh - 24, 4, '#475569', '#cbd5e1', 2);

        // Cuộn dây dẫn cố định ở giữa thân đèn
        const coilX = 285, coilW = 92;
        drawRoundRect(ctx, coilX, by - 6, coilW, bh + 12, 6, 'rgba(245, 158, 11, 0.25)', '#f59e0b', 2.6);
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3;
        for (let xx = coilX + 10; xx < coilX + coilW - 6; xx += 10) {
            ctx.beginPath(); ctx.moveTo(xx, by - 6); ctx.lineTo(xx, by + bh + 6); ctx.stroke();
        }

        // Thanh nam châm N-S trượt qua lại dọc trục xuyên qua lòng cuộn dây
        const magX = 285 + osc, magW = 92, magH = 42;
        const magY = by + (bh - magH) / 2;
        drawRoundRect(ctx, magX, magY, magW / 2, magH, 4, '#3b82f6', '#93c5fd', 2);
        drawRoundRect(ctx, magX + magW / 2, magY, magW / 2, magH, 4, '#ef4444', '#fca5a5', 2);
        ctx.fillStyle = '#ffffff';
        ctx.font = '800 16px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('S', magX + 22, magY + magH / 2);
        ctx.fillText('N', magX + magW - 22, magY + magH / 2);

        // Bóng đèn LED & Chóa phản xạ ở đầu phải
        const ledBrightness = Math.abs(Math.cos(t * 4.5));
        ctx.fillStyle = `rgba(254, 240, 138, ${(0.3 + 0.7 * ledBrightness).toFixed(2)})`;
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.arc(bx + bw - 42, by + bh / 2, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Tia sáng phát ra từ đèn LED
        for (let a = -0.4; a <= 0.4; a += 0.4) {
            drawArrow(ctx, bx + bw + 8, by + bh / 2 + a * 30, bx + bw + 56, by + bh / 2 + a * 65, `rgba(254, 240, 138, ${ledBrightness.toFixed(2)})`, 2.6, 7);
        }

        // Chú thích callout
        drawCallout(ctx, bx + 16, by + 20, 42, 54, ['Đệm cao su đàn hồi'], '#94a3b8');
        drawCallout(ctx, coilX + 46, by - 6, 335, 52, ['Cuộn dây cố định'], '#f59e0b');
        drawCallout(ctx, bx + bw - 42, by + 22, 525, 52, ['Bóng đèn LED'], '#fbbf24');
        drawCallout(ctx, magX + 46, magY + magH, 235, 232, ['Nam châm trượt dọc trục', 'Tạo từ thông biến thiên'], '#ef4444');
        ctx.restore();
    });

    // =========================================================================
    // 10. MH-C3-78: THÍ NGHIỆM ĐO THÀNH PHẦN NẰM NGANG CỦA TỪ TRƯỜNG TRÁI ĐẤT
    // =========================================================================
    window.VLXTModels.register('MH-C3-78', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'ĐO THÀNH PHẦN NẰM NGANG TỪ TRƯỜNG TRÁI ĐẤT (N = 200 vòng; d = 18 cm; I = 25 mA)');

        const cx = 255, cy = 166, rLoop = 94;

        ctx.save();
        // 1. La bàn 4 hướng Bắc - Nam - Đông - Tây đặt ở tâm khung dây
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.arc(cx, cy, 62, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Trục phương vị Bắc - Nam (dọc) và Đông - Tây (ngang)
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(cx, cy - 56); ctx.lineTo(cx, cy + 56);
        ctx.moveTo(cx - 56, cy); ctx.lineTo(cx + 56, cy);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#cbd5e1';
        ctx.font = '800 13px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Bắc', cx, cy - 68);
        ctx.fillText('Nam', cx, cy + 76);
        ctx.fillText('Tây', cx - 76, cy + 4);
        ctx.fillText('Đông', cx + 78, cy + 4);

        // 2. Khung dây tròn thẳng đứng N = 200 vòng bao quanh la bàn
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 34, rLoop, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Kim nam châm ở tâm lệch góc α = 45° so với phương Đông - Tây
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(-Math.PI / 4); // Lệch góc 45 độ
        // Nửa kim cực Bắc màu đỏ
        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.moveTo(42, 0); ctx.lineTo(0, -6); ctx.lineTo(0, 6); ctx.closePath(); ctx.fill();
        // Nửa kim cực Nam màu xanh
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath(); ctx.moveTo(-42, 0); ctx.lineTo(0, -6); ctx.lineTo(0, 6); ctx.closePath(); ctx.fill();
        ctx.restore();

        // Cung góc lệch α = 45°
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, 32, -Math.PI / 4, 0);
        ctx.stroke();
        ctx.fillStyle = '#6ee7b7';
        ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('α', cx + 42, cy - 14);

        // Ampe kế & Nguồn một chiều nối phía dưới khung dây
        ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(cx - 8, cy + rLoop); ctx.lineTo(cx - 8, 282); ctx.lineTo(395, 282);
        ctx.moveTo(cx + 8, cy + rLoop); ctx.lineTo(cx + 8, 272); ctx.lineTo(395, 272);
        ctx.stroke();
        drawRoundRect(ctx, 395, 262, 34, 28, 14, '#0f172a', '#38bdf8', 2.2);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('A', 412, 281);

        // Thẻ thông số đề dẫn bên phải
        drawRoundRect(ctx, 455, 68, 305, 184, 10, '#0f172a', '#f59e0b', 2);
        ctx.fillStyle = '#fbbf24';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('THÔNG SỐ THÍ NGHIỆM', 472, 94);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Khung dây tròn: N = 200 vòng', 472, 122);
        ctx.fillText('• Đường kính khung: d = 18,0 cm', 472, 148);
        ctx.fillText('• Cường độ dòng điện: I = 25,0 mA', 472, 174);
        ctx.fillText('• Góc lệch kim nam châm: α = 45°', 472, 200);
        ctx.fillStyle = '#6ee7b7';
        ctx.fillText('• Công thức tâm khung: B = 2π·10⁻⁷·N·i / R', 472, 228);
        ctx.restore();
    });

    // =========================================================================
    // 11. MH-C3-79: MÁY ĐO LƯU LƯỢNG MÁU ĐIỆN TỪ (ELECTROMAGNETIC BLOOD FLOWMETER)
    // =========================================================================
    window.VLXTModels.register('MH-C3-79', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'MÁY ĐO LƯU LƯỢNG MÁU ĐIỆN TỪ (d = 22 mm; B = 0,05 T; U = 0,22 mV)');

        ctx.save();
        // 1. Đoạn mạch máu hình trụ nằm ngang đường kính d = 22 mm
        const vx = 95, vy = 134, vw = 375, vh = 78;
        ctx.fillStyle = 'rgba(239, 68, 68, 0.22)';
        ctx.strokeStyle = '#f87171';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(vx, vy); ctx.lineTo(vx + vw, vy);
        ctx.moveTo(vx, vy + vh); ctx.lineTo(vx + vw, vy + vh);
        ctx.stroke();
        ctx.fillRect(vx, vy + 2, vw, vh - 4);

        // Ký hiệu từ trường đều ⊗ B vuông góc dòng chảy
        for (let x = vx + 45; x <= vx + vw - 45; x += 65) {
            drawCrossB(ctx, x, vy + vh / 2, 8, 'rgba(56, 189, 248, 0.55)');
        }
        drawSubText(ctx, 'B', '', vx + 26, vy + vh / 2 + 6, { fontSize: 16, italic: true, color: '#38bdf8', vector: true });

        // Hai điện cực gắn ở hai phía đối diện thành mạch (trên = +, dưới = -)
        const elX = vx + vw / 2;
        drawRoundRect(ctx, elX - 18, vy - 12, 36, 12, 3, '#fbbf24', '#fef08a', 2);
        drawRoundRect(ctx, elX - 18, vy + vh, 36, 12, 3, '#38bdf8', '#bae6fd', 2);

        // Các ion dương (+) lệch lên điện cực trên, ion âm (-) lệch xuống điện cực dưới
        for (let i = 0; i < 6; i++) {
            const p = (t * 0.45 + i / 6) % 1;
            const ix = vx + 25 + p * (vw - 50);
            const shift = Math.sin(p * Math.PI) * 24;
            // Ion dương (+) lệch lên trên
            ctx.fillStyle = '#ef4444';
            ctx.beginPath(); ctx.arc(ix, vy + vh / 2 - shift, 6.5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#ffffff'; ctx.font = '800 11px system-ui'; ctx.textAlign = 'center';
            ctx.fillText('+', ix, vy + vh / 2 - shift + 4);

            // Ion âm (-) lệch xuống dưới
            ctx.fillStyle = '#0284c7';
            ctx.beginPath(); ctx.arc(ix + 14, vy + vh / 2 + shift, 6.5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.fillText('–', ix + 14, vy + vh / 2 + shift + 3.5);
        }

        // Dây nối hai điện cực ra đồng hồ đo hiệu điện thế cảm ứng U = 0,22 mV
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(elX, vy - 12); ctx.lineTo(elX, 74); ctx.lineTo(495, 74); ctx.lineTo(495, 114);
        ctx.moveTo(elX, vy + vh + 12); ctx.lineTo(elX, 256); ctx.lineTo(495, 256); ctx.lineTo(495, 212);
        ctx.stroke();

        drawRoundRect(ctx, 455, 114, 96, 98, 10, '#0f172a', '#10b981', 2.4);
        ctx.fillStyle = '#6ee7b7';
        ctx.font = '800 14px "DM Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('U = 0,22', 503, 156);
        ctx.fillText('mV', 503, 178);

        // Thẻ thông số đề dẫn bên phải
        drawRoundRect(ctx, 568, 76, 194, 184, 10, '#0f172a', '#38bdf8', 2);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('ĐO LƯU LƯỢNG MÁU', 582, 102);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Đường kính: d = 22 mm', 582, 130);
        ctx.fillText('• Cảm ứng từ: B = 0,05 T', 582, 156);
        ctx.fillText('• Hiệu điện thế: U = 0,22 mV', 582, 182);
        ctx.fillStyle = '#6ee7b7';
        ctx.fillText('• Không xâm lấn mạch máu', 582, 212);
        ctx.restore();
    });

    // =========================================================================
    // 12. MH-C3-80: CẤU TẠO MÁY BIẾN ÁP (LÕI SẮT NON GHÉP LÁ & 2 CUỘN DÂY N1, N2)
    // =========================================================================
    window.VLXTModels.register('MH-C3-80', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'CẤU TẠO & NGUYÊN LÝ MÁY BIẾN ÁP (CUỘN SƠ CẤP N₁ – CUỘN THỨ CẤP N₂)');

        const pulse = Math.sin(t * 4);

        ctx.save();
        // Lõi biến áp hình khung chữ nhật ghép từ các lá sắt non sơn cách điện
        const lx = 175, ly = 76, lw = 250, lh = 176;
        drawRoundRect(ctx, lx, ly, lw, lh, 10, '#1e293b', '#94a3b8', 3.4);
        // Cửa sổ rỗng bên trong lõi thép
        drawRoundRect(ctx, lx + 46, ly + 42, lw - 92, lh - 84, 6, '#060b19', '#64748b', 2.4);

        // Đường sức từ khép kín biến thiên chạy trong lõi thép
        ctx.strokeStyle = `rgba(56, 189, 248, ${(0.45 + 0.45 * Math.abs(pulse)).toFixed(2)})`;
        ctx.setLineDash([8, 6]);
        ctx.lineWidth = 2.4;
        drawRoundRect(ctx, lx + 23, ly + 21, lw - 46, lh - 42, 8, null, ctx.strokeStyle, 2.4);
        ctx.setLineDash([]);

        // Cuộn dây sơ cấp N1 quấn bên trụ trái
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 4;
        for (let yy = ly + 46; yy <= ly + lh - 46; yy += 14) {
            ctx.beginPath();
            ctx.moveTo(lx - 6, yy);
            ctx.lineTo(lx + 52, yy + 4);
            ctx.stroke();
        }
        // Đầu dây nối nguồn điện áp xoay chiều U1
        ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(lx - 6, ly + 46); ctx.lineTo(95, ly + 46);
        ctx.moveTo(lx - 6, ly + lh - 46); ctx.lineTo(95, ly + lh - 46);
        ctx.stroke();
        drawSubText(ctx, 'U', '1', 72, ly + lh / 2 + 6, { fontSize: 16, italic: true, color: '#fca5a5' });

        // Cuộn dây thứ cấp N2 quấn bên trụ phải
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 4;
        for (let yy = ly + 42; yy <= ly + lh - 42; yy += 10) {
            ctx.beginPath();
            ctx.moveTo(lx + lw - 52, yy);
            ctx.lineTo(lx + lw + 6, yy + 4);
            ctx.stroke();
        }
        // Đầu dây ra tải tiêu thụ U2
        ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(lx + lw + 6, ly + 42); ctx.lineTo(495, ly + 42);
        ctx.moveTo(lx + lw + 6, ly + lh - 42); ctx.lineTo(495, ly + lh - 42);
        ctx.stroke();
        drawSubText(ctx, 'U', '2', 504, ly + lh / 2 + 6, { fontSize: 16, italic: true, color: '#6ee7b7' });

        // Chú thích callout
        drawCallout(ctx, lx + 23, ly + 10, 42, 54, ['Lõi lá sắt non cách điện', 'Giảm dòng điện Foucault'], '#94a3b8');
        drawCallout(ctx, lx - 6, ly + 90, 22, 212, ['Cuộn sơ cấp N₁'], '#ef4444');
        drawCallout(ctx, lx + lw + 6, ly + 90, 545, 76, ['Cuộn thứ cấp N₂', 'Cảm ứng điện từ'], '#10b981');

        // Thẻ thông số đề dẫn bên phải
        drawRoundRect(ctx, 545, 146, 215, 122, 10, '#0f172a', '#38bdf8', 2);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('MÁY BIẾN ÁP LÍ TƯỞNG', 560, 170);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• N₁ = 100 vòng; N₂ = 200 vòng', 560, 198);
        ctx.fillText('• Biến đổi điện áp xoay chiều', 560, 224);
        ctx.fillText('• Giữ nguyên tần số dòng điện', 560, 248);
        ctx.restore();
    });

    // =========================================================================
    // 13. MH-C3-81: SƠ ĐỒ HỆ THỐNG TRUYỀN TẢI ĐIỆN NĂNG ĐI XA (25 kV -> 500 kV)
    // =========================================================================
    window.VLXTModels.register('MH-C3-81', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'HỆ THỐNG TRUYỀN TẢI ĐIỆN NĂNG ĐI XA (P = 20 MW; 25 kV → 500 kV; L = 248 km)');

        const saw = (t * 0.35) % 1;

        ctx.save();
        // 1. Nhà máy phát điện (20 MW, 25 kV) bên trái
        drawRoundRect(ctx, 28, 134, 114, 92, 8, '#1e293b', '#f59e0b', 2.4);
        ctx.fillStyle = '#fbbf24';
        ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('NHÀ MÁY', 85, 162);
        ctx.fillText('ĐIỆN', 85, 180);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 12.5px "DM Mono", monospace';
        ctx.fillText('20 MW · 25 kV', 85, 206);

        // 2. Máy biến thế 1 (Tăng áp 25 kV -> 500 kV)
        drawRoundRect(ctx, 174, 146, 68, 68, 8, '#0f172a', '#ef4444', 2.4);
        ctx.fillStyle = '#fca5a5';
        ctx.font = '800 13px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('MBT 1', 208, 174);
        ctx.fillText('Tăng áp', 208, 194);
        ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2.8;
        ctx.beginPath(); ctx.moveTo(142, 180); ctx.lineTo(174, 180); ctx.stroke();

        // 3. Đường dây tải điện cao thế 500 kV (dài 248 km) & Cột điện cao thế ở giữa
        const lineStartX = 242, lineEndX = 485;
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2.4;
        // Hai cột điện cao thế minh họa
        [305, 422].forEach(px => {
            ctx.beginPath();
            ctx.moveTo(px - 14, 226); ctx.lineTo(px, 116); ctx.lineTo(px + 14, 226);
            ctx.moveTo(px - 22, 136); ctx.lineTo(px + 22, 136);
            ctx.stroke();
        });
        // Hai dây dẫn tải điện song song
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(lineStartX, 164); ctx.quadraticCurveTo(305, 142, 364, 152); ctx.quadraticCurveTo(422, 142, lineEndX, 164);
        ctx.moveTo(lineStartX, 192); ctx.quadraticCurveTo(305, 170, 364, 180); ctx.quadraticCurveTo(422, 170, lineEndX, 192);
        ctx.stroke();

        // Xung năng lượng chạy trên đường dây cao thế 500 kV
        const px = lineStartX + saw * (lineEndX - lineStartX);
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath(); ctx.arc(px, 154, 4.5, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('Đường dây 500 kV (L = 248 km)', 364, 96);

        // 4. Trạm biến áp hạ áp MBT 2, 3, 4 & Thành phố X bên phải
        drawRoundRect(ctx, 485, 146, 86, 68, 8, '#0f172a', '#10b981', 2.4);
        ctx.fillStyle = '#6ee7b7';
        ctx.font = '800 13px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('MBT 2, 3, 4', 528, 174);
        ctx.fillText('Hạ áp', 528, 194);

        ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2.8;
        ctx.beginPath(); ctx.moveTo(571, 180); ctx.lineTo(605, 180); ctx.stroke();

        drawRoundRect(ctx, 605, 134, 144, 92, 8, '#1e293b', '#38bdf8', 2.4);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('THÀNH PHỐ X', 677, 168);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '700 13px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('Hộ tiêu thụ điện', 677, 194);
        ctx.restore();
    });

    // =========================================================================
    // 14. MH-C3-82: MÁY IN PHUN MỰC BINARY-DEFLECTION (GIỌT MỰC A VÀ C)
    // =========================================================================
    window.VLXTModels.register('MH-C3-82', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'MÁY IN PHUN MỰC BINARY-DEFLECTION (L = 2 cm; v₀ = 20 m/s; E = 4·10⁶ V/m)');

        const saw = (t * 0.35) % 1;

        ctx.save();
        // 1. Vòi phun & Bộ nạp điện cực bên trái
        drawRoundRect(ctx, 36, 152, 68, 32, 6, '#334155', '#cbd5e1', 2.4);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Vòi phun', 70, 172);

        // Bộ nạp điện cực
        drawRoundRect(ctx, 134, 142, 34, 52, 4, '#1e293b', '#fbbf24', 2.2);
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('Cực nạp', 151, 130);

        // 2. Hai bản lái tia phẳng dài L = 2 cm (Bản dương + ở trên, bản âm - ở dưới -> E hướng xuống)
        const pX = 215, pW = 195, pTopY = 104, pBotY = 232;
        drawRoundRect(ctx, pX, pTopY, pW, 12, 3, '#ef4444', '#fca5a5', 2);
        drawRoundRect(ctx, pX, pBotY, pW, 12, 3, '#3b82f6', '#93c5fd', 2);
        ctx.fillStyle = '#fca5a5';
        ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('+  +  +  +  +', pX + pW / 2, pTopY - 10);
        ctx.fillStyle = '#93c5fd';
        ctx.fillText('–  –  –  –  –', pX + pW / 2, pBotY + 26);

        // Các đường sức điện trường đều E hướng thẳng đứng từ trên xuống (ngược chiều Oy)
        for (let x = pX + 35; x <= pX + pW - 35; x += 55) {
            drawArrow(ctx, x, pTopY + 16, x, pBotY - 6, 'rgba(56, 189, 248, 0.35)', 1.8, 6);
        }
        drawSubText(ctx, 'E', '', pX + pW + 12, 132, { fontSize: 16, italic: true, color: '#38bdf8', vector: true });

        // 3. Quỹ đạo giọt mực loại C (không tích điện -> bay thẳng theo trục Ox tới Bề mặt giấy)
        const midY = 168;
        ctx.strokeStyle = '#94a3b8';
        ctx.setLineDash([5, 4]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(104, midY);
        ctx.lineTo(595, midY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Bề mặt giấy in bên phải
        drawRoundRect(ctx, 595, 76, 18, 188, 3, '#f8fafc', '#94a3b8', 2);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Bề mặt giấy', 622, 172);

        // 4. Quỹ đạo giọt mực loại A (tích điện âm -> lệch cong lên phía bản dương vào Máng chặn mực)
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(pX, midY);
        ctx.quadraticCurveTo(pX + pW * 0.65, midY, pX + pW + 75, 118);
        ctx.stroke();

        // Máng chặn mực thu hồi
        drawRoundRect(ctx, pX + pW + 72, 92, 46, 42, 6, '#334155', '#fbbf24', 2.2);
        ctx.fillStyle = '#fbbf24';
        ctx.font = '700 13px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Máng chặn', pX + pW + 95, 80);

        // Chuyển động 1 chiều sawtooth của 2 giọt mực A và C
        const dropX = 104 + saw * 485;
        // Giọt C bay thẳng
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.arc(dropX, midY, 4.5, 0, Math.PI * 2); ctx.fill();

        // Giọt A lệch lên trên khi qua 2 bản
        if (dropX <= pX + pW + 72) {
            let dropAY = midY;
            if (dropX > pX) {
                const u = (dropX - pX) / (pW + 72);
                dropAY = midY - u * u * 50;
            }
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath(); ctx.arc(dropX, dropAY, 4.5, 0, Math.PI * 2); ctx.fill();
        }

        // Nhãn giọt A và giọt C
        drawCallout(ctx, 455, 128, 435, 52, ['Giọt mực loại A (q < 0)'], '#fbbf24');
        drawCallout(ctx, 485, midY, 435, 224, ['Giọt mực loại C (q = 0)'], '#38bdf8');
        ctx.restore();
    });

    // =========================================================================
    // 15. MH-C3-83: TƯƠNG TÁC TỪ GIỮA HAI DÒNG ĐIỆN THẲNG SONG SONG (HÌNH a & HÌNH b)
    // Ràng buộc: KHÔNG ghi sẵn chữ "hút nhau" hay "đẩy nhau" làm lộ đáp án ý c, d.
    // =========================================================================
    window.VLXTModels.register('MH-C3-83', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'THÍ NGHIỆM TƯƠNG TÁC TỪ GIỮA HAI DÒNG ĐIỆN THẲNG SONG SONG (NGUỒN 12 V)');

        ctx.save();
        function drawSetup(offsetX, sameDir, labelTitle) {
            // Bảng nhựa cách điện
            drawRoundRect(ctx, offsetX, 66, 335, 196, 10, '#1e293b', '#64748b', 2.4);

            // Hai thanh đồng cố định (1) trên và (2) dưới
            const y1 = 112, y2 = 216;
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(offsetX + 36, y1); ctx.lineTo(offsetX + 298, y1);
            ctx.moveTo(offsetX + 36, y2); ctx.lineTo(offsetX + 298, y2);
            ctx.stroke();

            ctx.fillStyle = '#fbbf24';
            ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('(1)', offsetX + 12, y1 + 4);
            ctx.fillText('(2)', offsetX + 12, y2 + 4);

            // Hai thanh đồng mảnh (4) trái và (5) phải đặt gác lên hai thanh (1), (2)
            const x4 = offsetX + 132, x5 = offsetX + 204;
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 3.4;
            ctx.beginPath();
            ctx.moveTo(x4, y1 - 14); ctx.lineTo(x4, y2 + 14);
            ctx.moveTo(x5, y1 - 14); ctx.lineTo(x5, y2 + 14);
            ctx.stroke();

            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'center';
            ctx.fillText('(4)', x4, y1 - 22);
            ctx.fillText('(5)', x5, y1 - 22);

            // Mũi tên chiều dòng điện trên (4) và (5)
            // Hình a: cả hai dòng cùng chiều từ dưới lên trên
            // Hình b: (4) từ dưới lên trên, (5) từ trên xuống dưới (ngược chiều)
            drawArrow(ctx, x4, y2 - 18, x4, y1 + 18, '#ef4444', 2.8, 7);
            if (sameDir) {
                drawArrow(ctx, x5, y2 - 18, x5, y1 + 18, '#ef4444', 2.8, 7);
            } else {
                drawArrow(ctx, x5, y1 + 18, x5, y2 - 18, '#ef4444', 2.8, 7);
            }

            // Ký hiệu nguồn 12 V
            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.fillText(labelTitle, offsetX + 167, 286);
        }

        drawSetup(34, true, 'Hình a (Hai dòng điện cùng chiều)');
        drawSetup(410, false, 'Hình b (Hai dòng điện ngược chiều)');
        ctx.restore();
    });

    // =========================================================================
    // 16. MH-C3-84: ỐNG TIA ĐIỆN TỬ KHẢO SÁT QUỸ ĐẠO ELECTRON (HÌNH a & HÌNH b)
    // Ràng buộc: KHÔNG vẽ sẵn chiều mũi tên E hay ký hiệu chấm/nhân của B.
    // =========================================================================
    window.VLXTModels.register('MH-C3-84', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'ỐNG TIA ĐIỆN TỬ KHẢO SÁT CHÙM ELECTRON (U = 2,70 kV)');

        const saw = (t * 0.32) % 1;

        ctx.save();
        // --- HÌNH a (BÊN TRÁI): QUỸ ĐẠO PARABOL TRONG ĐIỆN TRƯỜNG ĐỀU E ---
        const ox1 = 76, oy1 = 78, gw = 265, gh = 175;
        drawArrow(ctx, ox1, oy1, ox1 + gw, oy1, '#cbd5e1', 2.4, 7); // Trục Ox
        drawArrow(ctx, ox1, oy1, ox1, oy1 + gh, '#cbd5e1', 2.4, 7); // Trục hướng xuống

        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('O', ox1 - 8, oy1 + 4);
        ctx.textAlign = 'left';
        ctx.fillText('x (mm)', ox1 + gw + 6, oy1 + 4);
        ctx.fillText('y (mm)', ox1 - 24, oy1 + gh + 16);

        // Vùng điện trường đều E (KHÔNG vẽ sẵn chiều mũi tên E)
        drawRoundRect(ctx, ox1 + 12, oy1 + 10, 215, 145, 6, 'rgba(245, 158, 11, 0.1)', 'rgba(245, 158, 11, 0.35)', 1.6);
        drawSubText(ctx, 'E', '', ox1 + 195, oy1 + 34, { fontSize: 16, italic: true, color: '#fbbf24', vector: true });

        // Quỹ đạo parabol đi qua điểm (x = 30 mm; y = 81 mm)
        const p1X = ox1 + 135, p1Y = oy1 + 135;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(ox1, oy1);
        for (let u = 0; u <= 1.08; u += 0.04) {
            const qx = ox1 + u * 135;
            const qy = oy1 + u * u * 135;
            ctx.lineTo(qx, qy);
        }
        ctx.stroke();

        // Đường gióng tọa độ (30 mm; 81 mm)
        ctx.strokeStyle = '#94a3b8';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(p1X, oy1); ctx.lineTo(p1X, p1Y);
        ctx.moveTo(ox1, p1Y); ctx.lineTo(p1X, p1Y);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.arc(p1X, p1Y, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#cbd5e1';
        ctx.textAlign = 'center';
        ctx.fillText('30', p1X, oy1 - 8);
        ctx.textAlign = 'right';
        ctx.fillText('81', ox1 - 8, p1Y + 4);

        // Chùm electron chuyển động 1 chiều sawtooth
        ctx.fillStyle = '#6ee7b7';
        ctx.beginPath();
        ctx.arc(ox1 + saw * 135, oy1 + saw * saw * 135, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Hình a (Trong điện trường E)', ox1 + gw / 2, 286);

        // --- HÌNH b (BÊN PHẢI): QUỸ ĐẠO CUNG TRÒN TRONG TỪ TRƯỜNG ĐỀU B ---
        const ox2 = 435, oy2 = 78;
        drawArrow(ctx, ox2, oy2, ox2 + gw, oy2, '#cbd5e1', 2.4, 7);
        drawArrow(ctx, ox2, oy2, ox2, oy2 + gh, '#cbd5e1', 2.4, 7);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('O', ox2 - 8, oy2 + 4);
        ctx.textAlign = 'left';
        ctx.fillText('x (mm)', ox2 + gw + 6, oy2 + 4);
        ctx.fillText('y (mm)', ox2 - 24, oy2 + gh + 16);

        // Vùng từ trường đều B (KHÔNG vẽ sẵn ký hiệu chấm/nhân)
        drawRoundRect(ctx, ox2 + 12, oy2 + 10, 215, 145, 6, 'rgba(56, 189, 248, 0.1)', 'rgba(56, 189, 248, 0.35)', 1.6);
        drawSubText(ctx, 'B', '', ox2 + 195, oy2 + 34, { fontSize: 16, italic: true, color: '#38bdf8', vector: true });

        // Quỹ đạo cung tròn tâm (ox2, oy2 + R) đi qua điểm (x = 45 mm; y = 30 mm)
        // Với R = (45^2 + 30^2)/(2*30) = 48.75 mm -> scale 1 mm = 3.5 px => R_px = 170.6 px
        const scale = 3.5;
        const Rpx = 48.75 * scale;
        const p2X = ox2 + 45 * scale;
        const p2Y = oy2 + 30 * scale;
        const maxAng = Math.asin((45 * scale) / Rpx);

        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.arc(ox2, oy2 + Rpx, Rpx, -Math.PI / 2, -Math.PI / 2 + maxAng * 1.12, false);
        ctx.stroke();

        // Đường gióng tọa độ (45 mm; 30 mm)
        ctx.strokeStyle = '#94a3b8';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(p2X, oy2); ctx.lineTo(p2X, p2Y);
        ctx.moveTo(ox2, p2Y); ctx.lineTo(p2X, p2Y);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.arc(p2X, p2Y, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#cbd5e1';
        ctx.textAlign = 'center';
        ctx.fillText('45', p2X, oy2 - 8);
        ctx.textAlign = 'right';
        ctx.fillText('30', ox2 - 8, p2Y + 4);

        // Chùm electron chuyển động 1 chiều sawtooth trên cung tròn
        const curA = -Math.PI / 2 + saw * maxAng;
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(ox2 + Math.cos(curA) * Rpx, oy2 + Rpx + Math.sin(curA) * Rpx, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Hình b (Trong từ trường B)', ox2 + gw / 2, 286);
        ctx.restore();
    });

})(window);
            })({ VLXTModels: tempVLXT });
        } catch(e) {
            if (typeof console !== 'undefined') console.error('Lỗi nạp Canvas chunk:', e);
        }



        try {
            (function(window) {
/**
 * ============================================================================
 * BỘ MÔ HÌNH CANVAS VẬT LÍ HYDROGEN V2 - CHƯƠNG 4 - CA 7 (CÂU 85 -> CÂU 100)
 * Gồm 16 mô hình: MH-C4-85, MH-C4-86, MH-C4-87, MH-C4-88, MH-C4-89, MH-C4-90,
 *                MH-C4-91, MH-C4-92, MH-C4-93, MH-C4-94, MH-C4-95, MH-C4-96,
 *                MH-C4-97, MH-C4-98, MH-C4-99, MH-C4-100
 * Chuẩn khung logic: 780 x 305 | Tuân thủ 10 Quy Tắc Vàng VLXT_MOTION_SPEC.md
 * ============================================================================
 */
(function(window) {
    'use strict';

    window.VLXTModels = window.VLXTModels || {
        _registry: {},
        register: function(id, fn) {
            this._registry[id] = fn;
        }
    };

    // =========================================================================
    // HỆ THỐNG HÀM TRỢ GIÚP CHUẨN VLXT (CORE HELPERS)
    // =========================================================================
    function clearCanvas(ctx, w, h) {
        ctx.clearRect(0, 0, w, h);
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#060b19');
        grad.addColorStop(1, '#0a1226');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.045)';
        ctx.lineWidth = 1;
        for (let x = 20; x < w; x += 26) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (let y = 20; y < h; y += 26) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }
        ctx.restore();
    }

    function drawRoundRect(ctx, x, y, w, h, r, fill, stroke, lineWidth = 2.8) {
        ctx.save();
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(x, y, w, h, r);
        } else {
            ctx.moveTo(x + r, y);
            ctx.lineTo(x + w - r, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + r);
            ctx.lineTo(x + w, y + h - r);
            ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            ctx.lineTo(x + r, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - r);
            ctx.lineTo(x, y + r);
            ctx.quadraticCurveTo(x, y, x + r, y);
            ctx.closePath();
        }
        if (fill) { ctx.fillStyle = fill; ctx.fill(); }
        if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); }
        ctx.restore();
    }

    // Ký hiệu hạt nhân chuẩn: chỉ số trên A (số khối) và chỉ số dưới Z (nguyên tử số)
    // đặt thẳng hàng ở phía trước ký hiệu nguyên tố X, không bao giờ đè lên nhau
    function drawNuclide(ctx, A, Z, sym, x, y, opts = {}) {
        const fontSize = opts.fontSize || 16;
        const idxSize = Math.round(fontSize * 0.68);
        const weight = opts.weight || '800';
        const color = opts.color || '#f8fafc';
        const align = opts.align || 'left';

        ctx.save();
        ctx.textBaseline = 'middle';
        ctx.font = `${weight} ${idxSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
        const wA = A !== '' && A !== null && A !== undefined ? ctx.measureText(String(A)).width : 0;
        const wZ = Z !== '' && Z !== null && Z !== undefined ? ctx.measureText(String(Z)).width : 0;
        const idxW = Math.max(wA, wZ);
        const gap = idxW > 0 ? 2 : 0;

        ctx.font = `${weight} ${fontSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
        const symW = ctx.measureText(sym).width;
        const totalW = idxW + gap + symW;

        let startX = x;
        if (align === 'center') startX = x - totalW / 2;
        else if (align === 'right') startX = x - totalW;

        ctx.fillStyle = color;
        ctx.textAlign = 'right';
        ctx.font = `${weight} ${idxSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
        if (wA > 0) ctx.fillText(String(A), startX + idxW, y - Math.round(fontSize * 0.36));
        if (wZ > 0) ctx.fillText(String(Z), startX + idxW, y + Math.round(fontSize * 0.38));

        ctx.textAlign = 'left';
        ctx.font = `${weight} ${fontSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
        ctx.fillText(sym, startX + idxW + gap, y);
        ctx.restore();
        return totalW;
    }

    function drawArrow(ctx, x1, y1, x2, y2, color = '#38bdf8', width = 3, headLen = 9) {
        const angle = Math.atan2(y2 - y1, x2 - x1);
        ctx.save();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    function drawGammaRay(ctx, x1, y1, x2, y2, color = '#a855f7') {
        const dx = x2 - x1, dy = y2 - y1;
        const len = Math.hypot(dx, dy);
        const ang = Math.atan2(dy, dx);
        ctx.save();
        ctx.translate(x1, y1);
        ctx.rotate(ang);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        const waves = Math.max(3, Math.floor(len / 12));
        const bodyLen = len - 10;
        for (let i = 0; i <= waves * 4; i++) {
            const px = (i / (waves * 4)) * bodyLen;
            const py = Math.sin((i / 4) * Math.PI * 2) * 4;
            ctx.lineTo(px, py);
        }
        ctx.lineTo(len, 0);
        ctx.stroke();
        // Mũi tên ở cuối tia gamma
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(len, 0);
        ctx.lineTo(len - 8, -4);
        ctx.lineTo(len - 8, 4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    function drawAlphaCluster(ctx, cx, cy, r = 4.5) {
        ctx.save();
        // 2 proton đỏ (#ef4444) + 2 neutron xanh xám (#38bdf8)
        const offs = [
            [-r * 0.65, -r * 0.55, '#ef4444'],
            [ r * 0.65,  r * 0.55, '#ef4444'],
            [ r * 0.65, -r * 0.55, '#38bdf8'],
            [-r * 0.65,  r * 0.55, '#38bdf8']
        ];
        offs.forEach(([ox, oy, col]) => {
            ctx.fillStyle = col;
            ctx.beginPath();
            ctx.arc(cx + ox, cy + oy, r, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();
    }

    function drawCallout(ctx, targetX, targetY, boxX, boxY, lines, borderColor = '#38bdf8', textColor = '#f8fafc') {
        const lineArr = Array.isArray(lines) ? lines : [lines];
        ctx.save();
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        const padX = 10;
        const lineH = 18;
        const boxH = lineArr.length * lineH + 10;
        let maxW = 0;
        lineArr.forEach(l => {
            const mw = ctx.measureText(l).width;
            if (mw > maxW) maxW = mw;
        });
        const boxW = maxW + padX * 2;
        const anchorX = (boxX + boxW / 2 < targetX) ? (boxX + boxW) : (boxX > targetX ? boxX : boxX + boxW / 2);
        const anchorY = boxY + boxH / 2;

        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(targetX, targetY);
        ctx.lineTo(anchorX, anchorY);
        ctx.stroke();

        ctx.fillStyle = borderColor;
        ctx.beginPath();
        ctx.arc(targetX, targetY, 3.8, 0, Math.PI * 2);
        ctx.fill();

        drawRoundRect(ctx, boxX, boxY, boxW, boxH, 7, '#0f172a', borderColor, 1.8);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        lineArr.forEach((line, idx) => {
            ctx.fillStyle = idx === 0 ? textColor : '#cbd5e1';
            ctx.fillText(line, boxX + boxW / 2, boxY + 5 + lineH * (idx + 0.5));
        });
        ctx.restore();
    }

    function drawTitleBadge(ctx, text, x = 16, y = 14) {
        ctx.save();
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        const w = ctx.measureText(text).width + 22;
        drawRoundRect(ctx, x, y, w, 28, 7, '#0f172a', 'rgba(56, 189, 248, 0.55)', 1.8);
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x + 11, y + 14);
        ctx.restore();
    }

    // =========================================================================
    // 1. MH-C4-85: THÍ NGHIỆM TÁN XẠ HẠT ALPHA CỦA ERNEST RUTHERFORD (1911)
    // =========================================================================
    window.VLXTModels.register('MH-C4-85', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'THÍ NGHIỆM TÁN XẠ HẠT ALPHA CỦA RUTHERFORD (1911) — LÁ VÀNG MỎNG');

        const saw = (t * 0.35) % 1;
        const foilX = 335, foilY = 164;

        ctx.save();
        // 1. Hộp chì chứa nguồn phát hạt alpha (He-4) bên trái
        drawRoundRect(ctx, 42, 134, 86, 60, 6, '#334155', '#94a3b8', 2.8);
        // Khe chuẩn trực hẹp
        ctx.fillStyle = '#060b19';
        ctx.fillRect(108, 156, 22, 16);
        // Nguồn phóng xạ phát sáng cam
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath(); ctx.arc(82, 164, 12, 0, Math.PI * 2); ctx.fill();

        // 2. Màn huỳnh quang ZnS hình vòng cung lớn bao quanh lá vàng
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.arc(foilX, foilY, 108, -Math.PI * 0.78, Math.PI * 0.78, false);
        ctx.stroke();

        // Kính hiển vi quan sát các chấm sáng nhấp nháy
        ctx.save();
        ctx.translate(foilX + 86, foilY - 76);
        ctx.rotate(-0.72);
        drawRoundRect(ctx, 0, -10, 44, 20, 4, '#1e293b', '#10b981', 2.2);
        ctx.restore();

        // 3. Lá vàng rất mỏng đặt thẳng đứng ở tâm (foilX, foilY)
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(foilX - 3, foilY - 46, 6, 92);

        // Chùm hạt alpha đi thẳng (đa số) & một số ít lệch góc lớn / bật ngược lại
        // Tia đi thẳng
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.75)';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(115, foilY); ctx.lineTo(foilX + 104, foilY);
        ctx.stroke();
        // Tia lệch góc nhọn
        ctx.beginPath();
        ctx.moveTo(foilX, foilY); ctx.lineTo(foilX + 76, foilY - 72);
        ctx.moveTo(foilX, foilY); ctx.lineTo(foilX + 82, foilY + 64);
        // Tia bật ngược > 90 độ (rất ít)
        ctx.strokeStyle = '#ef4444';
        ctx.moveTo(foilX, foilY); ctx.lineTo(foilX - 68, foilY - 78);
        ctx.stroke();

        // Chấm sáng nhấp nháy trên màn ZnS
        ctx.fillStyle = '#fef08a';
        [[foilX + 104, foilY], [foilX + 76, foilY - 72], [foilX + 82, foilY + 64], [foilX - 68, foilY - 78]].forEach(([sx, sy]) => {
            ctx.beginPath(); ctx.arc(sx, sy, 4.5, 0, Math.PI * 2); ctx.fill();
        });

        // Hạt alpha chuyển động 1 chiều sawtooth từ nguồn -> lá vàng -> xuyên thẳng
        const ax = 115 + saw * (foilX + 100 - 115);
        drawAlphaCluster(ctx, ax, foilY, 4);

        // Chú thích callout rõ ràng
        drawCallout(ctx, 74, 134, 24, 58, ['Nguồn hạt α (He-4)', 'Đặt trong hộp chì'], '#f59e0b');
        drawCallout(ctx, foilX, foilY - 46, 225, 58, ['Lá vàng siêu mỏng'], '#fbbf24');
        drawCallout(ctx, foilX + 102, foilY - 68, 495, 62, ['Kính hiển vi & Màn ZnS', 'Đếm chấm sáng nhấp nháy'], '#10b981');

        // Thẻ kết quả thí nghiệm bên phải
        drawRoundRect(ctx, 495, 132, 265, 144, 10, '#0f172a', '#38bdf8', 2);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('KẾT QUẢ THÍ NGHIỆM RUTHERFORD', 510, 156);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Hầu hết hạt α xuyên thẳng qua lá vàng', 510, 184);
        ctx.fillText('• Một số ít bị lệch hướng góc nhỏ', 510, 210);
        ctx.fillStyle = '#fca5a5';
        ctx.fillText('• Tỉ lệ ~1/10⁴ bật ngược (> 90°)', 510, 236);
        ctx.restore();
    });

    // =========================================================================
    // 2. MH-C4-86: TÁN XẠ HẠT ALPHA QUA LÁ VÀNG (HÌNH a) & VA CHẠM HẠT NHÂN (HÌNH b)
    // =========================================================================
    window.VLXTModels.register('MH-C4-86', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'MÔ HÌNH TÁN XẠ HẠT ALPHA: VĨ MÔ (HÌNH a) & VI MÔ HẠT NHÂN VÀNG (HÌNH b)');

        const saw = (t * 0.34) % 1;

        ctx.save();
        // --- HÌNH a (BÊN TRÁI): CHÙM HẠT ALPHA BẮN QUA LÁ VÀNG MỎNG ---
        const f1X = 185, f1Y = 158;
        drawRoundRect(ctx, 36, f1Y - 22, 54, 44, 5, '#334155', '#94a3b8', 2.4);
        ctx.fillStyle = '#f59e0b';
        ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Nguồn α', 63, f1Y - 30);

        // Lá vàng mỏng
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(f1X - 3, f1Y - 56, 6, 112);
        ctx.fillText('Lá vàng', f1X, f1Y - 66);

        // Màn chắn phát quang
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(f1X, f1Y, 92, -Math.PI * 0.72, Math.PI * 0.72, false);
        ctx.stroke();

        // Các quỹ đạo tia alpha
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.75)';
        ctx.lineWidth = 2.2;
        [-22, 0, 22].forEach(dy => {
            ctx.beginPath(); ctx.moveTo(90, f1Y + dy); ctx.lineTo(f1X + 88, f1Y + dy); ctx.stroke();
        });
        ctx.beginPath();
        ctx.moveTo(f1X, f1Y - 10); ctx.lineTo(f1X + 68, f1Y - 58);
        ctx.moveTo(f1X, f1Y + 10); ctx.lineTo(f1X + 68, f1Y + 58);
        ctx.strokeStyle = '#ef4444';
        ctx.moveTo(f1X, f1Y); ctx.lineTo(f1X - 58, f1Y - 64);
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('Hình a. Bố trí thí nghiệm', 165, 286);

        // --- HÌNH b (BÊN PHẢI): TƯƠNG TÁC VI MÔ HẠT ALPHA VỚI HẠT NHÂN VÀNG (+79e) ---
        const auX = 565, auY = 158;
        // Các lớp quỹ đạo nguyên tử vàng nét đứt
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.arc(auX, auY, 88, 0, Math.PI * 2); ctx.stroke();
        ctx.setLineDash([]);

        // Hạt nhân vàng mang điện dương lớn ở tâm (+79e)
        ctx.fillStyle = '#ef4444';
        ctx.strokeStyle = '#fca5a5';
        ctx.lineWidth = 2.6;
        ctx.beginPath(); ctx.arc(auX, auY, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = '800 13px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('+Q_n', auX, auY + 4);

        // Quỹ đạo các hạt alpha ở góc nhìn vi mô:
        // 1. Hạt ở xa đi thẳng qua khoảng trống nguyên tử
        drawArrow(ctx, 375, auY - 64, 695, auY - 64, '#10b981', 2.4, 7);
        drawArrow(ctx, 375, auY + 64, 695, auY + 64, '#10b981', 2.4, 7);

        // 2. Hạt bay gần hạt nhân bị lực đẩy Coulomb bẻ cong quỹ đạo
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(375, auY - 26);
        ctx.quadraticCurveTo(auX - 18, auY - 26, auX + 85, auY - 92);
        ctx.stroke();
        drawArrow(ctx, auX + 55, auY - 70, auX + 88, auY - 94, '#fbbf24', 2.6, 7);

        // 3. Hạt va chạm xuyên tâm tiến đến khoảng cách gần nhất x rồi bật ngược lại
        ctx.strokeStyle = '#ef4444';
        ctx.setLineDash([4, 3]);
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(375, auY);
        ctx.lineTo(auX - 34, auY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Hạt alpha chuyển động 1 chiều tới điểm dừng gần nhất cách tâm khoảng x rồi bật ngược
        let hx;
        if (saw < 0.5) {
            hx = 375 + (saw / 0.5) * (auX - 34 - 375);
        } else {
            hx = (auX - 34) - ((saw - 0.5) / 0.5) * (auX - 34 - 375);
        }
        drawAlphaCluster(ctx, hx, auY, 4);

        // Đoạn khoảng cách gần nhất x
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(auX - 34, auY + 14); ctx.lineTo(auX, auY + 14);
        ctx.stroke();
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'italic 800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('x', auX - 17, auY + 28);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 14.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('Hình b. Va chạm xuyên tâm với hạt nhân vàng', 545, 286);
        ctx.restore();
    });

    // =========================================================================
    // 3. MH-C4-87: BỤI PHÓNG XẠ STRONTIUM Sr-90 TÍCH TỤ TRONG XƯƠNG (T = 28,79 năm)
    // =========================================================================
    window.VLXTModels.register('MH-C4-87', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'ĐỒNG VỊ PHÓNG XẠ STRONTIUM Sr-90 (T = 28,79 năm · PHÓNG XẠ β⁻)');

        const saw = (t * 0.28) % 1;

        ctx.save();
        // 1. Sơ đồ chuỗi xâm nhập bụi phóng xạ Sr-90 -> Cỏ/Sữa -> Xương người
        drawRoundRect(ctx, 36, 74, 152, 62, 8, '#1e293b', '#f59e0b', 2.4);
        drawNuclide(ctx, '90', '38', 'Sr', 54, 105, { fontSize: 17, color: '#fbbf24' });
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '700 13px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Bụi phóng xạ', 96, 98);
        ctx.fillText('T = 28,79 năm', 96, 118);

        drawArrow(ctx, 188, 105, 228, 105, '#fbbf24', 2.8, 7);

        // Mẫu xương tích tụ Sr-90 phát tia beta- phá hủy tủy xương
        drawRoundRect(ctx, 232, 64, 168, 86, 10, '#0f172a', '#ef4444', 2.4);
        // Hình xương cách điệu
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 7;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(264, 107); ctx.lineTo(368, 107);
        ctx.stroke();
        ctx.fillStyle = '#e2e8f0';
        [264, 368].forEach(bx => {
            ctx.beginPath(); ctx.arc(bx, 101, 7, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(bx, 113, 7, 0, Math.PI * 2); ctx.fill();
        });

        // Tia beta- (electron) phóng ra từ xương (1 chiều sawtooth)
        const bX = 316 + saw * 54;
        const bY = 107 - saw * 32;
        ctx.fillStyle = '#10b981';
        ctx.beginPath(); ctx.arc(bX, bY, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#6ee7b7';
        ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Tia β⁻ phá hủy tủy xương', 316, 138);

        // 2. Đồ thị phân rã phóng xạ của Sr-90 theo thời gian t (năm)
        const ox = 455, oy = 248, gxW = 285, gyH = 165;
        drawArrow(ctx, ox, oy, ox + gxW, oy, '#cbd5e1', 2.4, 7);
        drawArrow(ctx, ox, oy, ox, oy - gyH, '#cbd5e1', 2.4, 7);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('N(t)', ox - 16, oy - gyH - 10);
        ctx.fillText('t (năm)', ox + gxW - 22, oy + 20);
        ctx.textAlign = 'right';
        ctx.fillText('N₀', ox - 8, oy - 135);
        ctx.fillText('N₀/2', ox - 8, oy - 67);

        // Đường cong mũ N(t) = N0 * 2^(-t/T)
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        for (let u = 0; u <= 1; u += 0.03) {
            const px = ox + u * 240;
            const py = oy - 140 * Math.pow(0.5, u * 2.2);
            if (u === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Đường gióng tại t = T = 28,79 năm
        const t1X = ox + 240 / 2.2;
        const yHalf = oy - 70;
        ctx.strokeStyle = '#64748b';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(ox, yHalf); ctx.lineTo(t1X, yHalf); ctx.lineTo(t1X, oy);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#fbbf24';
        ctx.textAlign = 'center';
        ctx.fillText('T = 28,79', t1X, oy + 18);

        // Thẻ thông số đề dẫn góc dưới trái
        drawRoundRect(ctx, 36, 174, 364, 96, 10, '#0f172a', '#fbbf24', 2);
        ctx.fillStyle = '#fbbf24';
        ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('THÔNG SỐ STRONTIUM-90', 52, 198);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Hạt nhân mẹ: ⁹⁰₃₈Sr (T = 28,79 năm)', 52, 224);
        ctx.fillText('• Phương trình phân rã: ⁹⁰₃₈Sr → X + ⁰₋₁e', 52, 248);
        ctx.restore();
    });

    // =========================================================================
    // 4. MH-C4-88: NHIỄM PHÓNG XẠ IODINE I-131 TRONG SỮA BÒ (2850 -> 100 Bq/lít)
    // =========================================================================
    window.VLXTModels.register('MH-C4-88', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'PHÂN RÃ IODINE I-131 TRONG SỮA BÒ (H₀ = 2850 Bq/lít → H_an toàn = 100 Bq/lít)');

        const saw = (t * 0.25) % 1;

        ctx.save();
        // 1. Sơ đồ phân rã hạt nhân I-131 -> Xe + beta-
        drawRoundRect(ctx, 36, 66, 336, 86, 10, '#0f172a', '#38bdf8', 2);
        drawNuclide(ctx, '131', '53', 'I', 68, 108, { fontSize: 19, color: '#fbbf24' });
        drawArrow(ctx, 118, 108, 172, 108, '#38bdf8', 3, 8);
        drawNuclide(ctx, '131', '54', 'Xe', 190, 108, { fontSize: 19, color: '#6ee7b7' });
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 16px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('+', 246, 113);
        drawNuclide(ctx, '0', '-1', 'e', 268, 108, { fontSize: 18, color: '#ef4444' });
        ctx.fillStyle = '#fca5a5';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('(Tia β⁻)', 305, 113);

        // 2. Mẫu sữa bò kiểm tra mức an toàn phóng xạ (H0 = 2850 Bq/lít -> 100 Bq/lít)
        drawRoundRect(ctx, 36, 172, 336, 98, 10, '#1e293b', '#10b981', 2);
        ctx.fillStyle = '#6ee7b7';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('THÔNG SỐ MẪU SỮA BÒ TẠI TRANG TRẠI', 52, 196);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Chu kì bán rã I-131: T = 8,02 ngày', 52, 222);
        ctx.fillText('• Độ phóng xạ ban đầu: H₀ = 2850 Bq/lít', 52, 244);
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('• Ngưỡng an toàn cho phép: 100 Bq/lít', 52, 264);

        // 3. Đồ thị suy giảm độ phóng xạ H(t) về ngưỡng an toàn 100 Bq/lít
        const ox = 435, oy = 248, gxW = 315, gyH = 165;
        drawArrow(ctx, ox, oy, ox + gxW, oy, '#cbd5e1', 2.4, 7);
        drawArrow(ctx, ox, oy, ox, oy - gyH, '#cbd5e1', 2.4, 7);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('H (Bq/lít)', ox - 24, oy - gyH - 10);
        ctx.fillText('t (ngày)', ox + gxW - 32, oy + 20);
        ctx.textAlign = 'right';
        ctx.fillText('2850', ox - 8, oy - 140);
        ctx.fillText('100', ox - 8, oy - 18);

        // Đường ngưỡng an toàn nét đứt màu xanh lá tại 100 Bq/lít
        ctx.strokeStyle = '#10b981';
        ctx.setLineDash([5, 4]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ox, oy - 18);
        ctx.lineTo(ox + gxW - 20, oy - 18);
        ctx.stroke();
        ctx.setLineDash([]);

        // Đường cong phân rã H(t) = 2850 * 2^(-t/8.02)
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        for (let u = 0; u <= 1; u += 0.025) {
            const px = ox + u * 270;
            const py = oy - 142 * Math.pow(0.5, u * 5.2);
            if (u === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Điểm chạy 1 chiều sawtooth trên đồ thị
        const dotX = ox + saw * 255;
        const dotY = oy - 142 * Math.pow(0.5, saw * 5.2 * (255 / 270));
        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.arc(dotX, dotY, 5.5, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
    });

    // =========================================================================
    // 5. MH-C4-89: CHỤP CẮT LỚP PHÁT XẠ POSITRON PET VỚI F-18 (T = 11/6 giờ)
    // =========================================================================
    window.VLXTModels.register('MH-C4-89', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'CHỤP CẮT LỚP PHÁT XẠ POSITRON (PET) — ĐỒNG VỊ F-18 (T = 11/6 giờ)');

        const saw = (t * 0.35) % 1; // Hủy cặp e+ + e- phát 2 tia gamma ngược chiều tới vòng đầu dò PET

        ctx.save();
        // 1. Vòng đầu dò máy quét PET bên trái
        const cx = 235, cy = 166, rRing = 96;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 16;
        ctx.beginPath();
        ctx.arc(cx, cy, rRing, 0, Math.PI * 2);
        ctx.stroke();

        // Các khối tinh thể đầu dò chia quanh vòng PET
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2.4;
        for (let i = 0; i < 16; i++) {
            const a = (i * Math.PI * 2) / 16;
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(a) * (rRing - 8), cy + Math.sin(a) * (rRing - 8));
            ctx.lineTo(cx + Math.cos(a) * (rRing + 8), cy + Math.sin(a) * (rRing + 8));
            ctx.stroke();
        }

        // Khối u hấp thụ F-18-FDG ở tâm
        ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.arc(cx, cy, 24, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        // Hạt positron e+ và electron e- hủy cặp phát ra 2 tia gamma ngược chiều (180 độ)
        const gLen = saw * (rRing - 10);
        const ang = -Math.PI / 5;
        drawGammaRay(ctx, cx, cy, cx + Math.cos(ang) * gLen, cy + Math.sin(ang) * gLen, '#fbbf24');
        drawGammaRay(ctx, cx, cy, cx - Math.cos(ang) * gLen, cy - Math.sin(ang) * gLen, '#fbbf24');

        ctx.fillStyle = '#fef08a';
        ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('γ', cx + 48, cy - 42);
        ctx.fillText('γ', cx - 48, cy + 48);

        // Chú thích callout
        drawCallout(ctx, cx + rRing, cy, 355, 62, ['Vòng đầu dò máy quét PET', 'Ghi nhận cặp photon γ ngược chiều'], '#38bdf8');
        drawCallout(ctx, cx, cy + 24, 22, 232, ['Hủy cặp e⁺ + e⁻ → 2γ', 'Tại mô khối u hấp thụ FDG'], '#ef4444');

        // 2. Thẻ phương trình & thông số F-18 bên phải (Zero Data Leakage)
        drawRoundRect(ctx, 415, 128, 345, 144, 10, '#0f172a', '#fbbf24', 2);
        ctx.fillStyle = '#fbbf24';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('PHÂN RÃ POSITRON CỦA FLUORINE-18', 432, 154);

        drawNuclide(ctx, '18', '9', 'F', 446, 186, { fontSize: 18, color: '#38bdf8' });
        drawArrow(ctx, 488, 186, 536, 186, '#38bdf8', 2.8, 7);
        drawNuclide(ctx, '18', '8', 'O', 552, 186, { fontSize: 18, color: '#6ee7b7' });
        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 15px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('+', 602, 191);
        drawNuclide(ctx, '0', '+1', 'e', 624, 186, { fontSize: 17, color: '#ef4444' });
        ctx.fillText('+ ν', 666, 191);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Chu kì bán rã: T = 11/6 giờ (110 phút)', 432, 224);
        ctx.fillText('• Dược chất đánh dấu chuyển hóa: FDG', 432, 248);
        ctx.restore();
    });

    // =========================================================================
    // 6. MH-C4-90: XẠ TRỊ UNG THƯ TUYẾN GIÁP BẰNG IODINE-131 (9,2 μg; T = 8,0 ngày)
    // =========================================================================
    window.VLXTModels.register('MH-C4-90', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'ĐIỀU TRỊ UNG THƯ TUYẾN GIÁP BẰNG IODINE-131 (m₀ = 9,2 μg; T = 8,0 ngày)');

        const saw = (t * 0.3) % 1;

        ctx.save();
        // 1. Viên nang dược chất phóng xạ I-131 bên trái
        drawRoundRect(ctx, 42, 126, 94, 42, 21, '#0284c7', '#7dd3fc', 2.6);
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(115, 147, 21, -Math.PI / 2, Math.PI / 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('I-131 (9,2 μg)', 89, 112);

        drawArrow(ctx, 142, 147, 198, 147, '#fbbf24', 3, 8);

        // 2. Tuyến giáp hình cánh bướm tập trung I-131 phát bức xạ beta tiêu diệt tế bào u
        const tx = 295, ty = 154;
        ctx.fillStyle = 'rgba(244, 114, 182, 0.25)';
        ctx.strokeStyle = '#f472b6';
        ctx.lineWidth = 3;
        // Hai thùy tuyến giáp
        ctx.beginPath();
        ctx.ellipse(tx - 28, ty, 24, 48, -0.18, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(tx + 28, ty, 24, 48, 0.18, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Eo tuyến giáp
        ctx.fillRect(tx - 14, ty - 10, 28, 20);

        // Bức xạ beta phát ra trong mô tuyến giáp (1 chiều sawtooth)
        for (let i = 0; i < 6; i++) {
            const ang = (i * Math.PI * 2) / 6 + 0.3;
            const r = saw * 36;
            const bx = tx + Math.cos(ang) * r;
            const by = ty + Math.sin(ang) * r;
            ctx.fillStyle = '#10b981';
            ctx.beginPath(); ctx.arc(bx, by, 4, 0, Math.PI * 2); ctx.fill();
        }

        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('Tuyến giáp hấp thụ I-131', tx, 224);

        // 3. Thẻ thông số đề dẫn bên phải (Zero Data Leakage)
        drawRoundRect(ctx, 415, 72, 345, 196, 10, '#0f172a', '#f472b6', 2);
        ctx.fillStyle = '#f472b6';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('THÔNG SỐ LIỀU XẠ TRỊ IODINE-131', 432, 98);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Đồng vị sử dụng: ¹³¹₅₃I (phóng xạ β⁻)', 432, 126);
        ctx.fillText('• Chu kì bán rã: T = 8,0 ngày', 432, 152);
        ctx.fillText('• Liều lượng dùng 1 lần: m₀ = 9,2 μg', 432, 178);
        ctx.fillText('• Khối lượng mol: M = 131 g/mol', 432, 204);
        ctx.fillStyle = '#6ee7b7';
        ctx.fillText('• Tia β⁻ tầm ngắn diệt tế bào bất thường', 432, 234);
        ctx.restore();
    });

    // =========================================================================
    // 7. MH-C4-91: THEO DÕI XUẤT VIỆN BỆNH NHÂN XẠ TRỊ I-131 (36,0 mCi -> 30,0 mCi)
    // =========================================================================
    window.VLXTModels.register('MH-C4-91', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'THEO DÕI ĐỘ PHÓNG XẠ XUẤT VIỆN (H₀ = 36,0 mCi → H_xuất viện = 30,0 mCi)');

        const saw = (t * 0.25) % 1;

        ctx.save();
        // Đồ thị suy giảm hoạt độ phóng xạ H (mCi) theo thời gian t
        const ox = 85, oy = 248, gxW = 355, gyH = 165;
        drawArrow(ctx, ox, oy, ox + gxW, oy, '#cbd5e1', 2.6, 8);
        drawArrow(ctx, ox, oy, ox, oy - gyH, '#cbd5e1', 2.6, 8);

        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('H (mCi)', ox - 24, oy - gyH - 10);
        ctx.fillText('t (ngày)', ox + gxW - 30, oy + 20);
        ctx.textAlign = 'right';
        ctx.fillText('36,0', ox - 8, oy - 140);
        ctx.fillText('30,0', ox - 8, oy - 116);

        // Ngưỡng xuất viện 30,0 mCi nét đứt xanh lá
        const y30 = oy - 116;
        const xOut = ox + 82;
        ctx.strokeStyle = '#10b981';
        ctx.setLineDash([5, 4]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ox, y30); ctx.lineTo(xOut, y30); ctx.lineTo(xOut, oy);
        ctx.stroke();
        ctx.setLineDash([]);

        // Đường cong phân rã H(t) = 36 * 2^(-t/8)
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3.4;
        ctx.beginPath();
        for (let u = 0; u <= 1; u += 0.025) {
            const px = ox + u * 310;
            const py = oy - 140 * Math.pow(0.5, u * 1.0);
            if (u === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Điểm chạy 1 chiều sawtooth từ H0 = 36,0 mCi xuống ngưỡng xuất viện
        const dotX = ox + saw * 260;
        const dotY = oy - 140 * Math.pow(0.5, saw * (260 / 310));
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath(); ctx.arc(dotX, dotY, 6, 0, Math.PI * 2); ctx.fill();

        drawCallout(ctx, xOut, y30, 215, 76, ['Ngưỡng xuất viện', 'H = 30,0 mCi'], '#10b981');

        // Thẻ thông số đề dẫn bên phải (Zero Data Leakage)
        drawRoundRect(ctx, 465, 72, 295, 196, 10, '#0f172a', '#38bdf8', 2);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('THÔNG SỐ ĐIỀU TRỊ I-131', 482, 98);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Chu kì bán rã: T = 8 ngày đêm', 482, 126);
        ctx.fillText('• Độ phóng xạ ban đầu: H₀ = 36,0 mCi', 482, 152);
        ctx.fillText('• Ngưỡng xuất viện: H = 30,0 mCi', 482, 178);
        ctx.fillText('• Bỏ qua sự bài tiết sinh học', 482, 204);
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('• Phương trình: ¹³¹₅₃I → Xe + β⁻', 482, 234);
        ctx.restore();
    });

    // =========================================================================
    // 8. MH-C4-92: NUÔI CẤY TẾ BÀO UNG THƯ ĐÁNH DẤU BẰNG I-131 (1 lít; 10^6 TB/ml)
    // =========================================================================
    window.VLXTModels.register('MH-C4-92', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'ĐÁNH DẤU TẾ BÀO UNG THƯ NUÔI CẤY BẰNG I-131 (V = 1 lít; 10⁶ tế bào/ml)');

        const saw = (t * 0.3) % 1;

        ctx.save();
        // Bình nuôi cấy tế bào dung tích 1 lít bên trái
        const bx = 95, by = 82, bw = 225, bh = 186;
        // Dung dịch nuôi cấy màu hồng nhạt
        ctx.fillStyle = 'rgba(244, 114, 182, 0.22)';
        ctx.fillRect(bx + 3, by + 38, bw - 6, bh - 41);
        ctx.strokeStyle = '#f472b6';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(bx + 3, by + 38); ctx.lineTo(bx + bw - 3, by + 38);
        ctx.stroke();

        // Thành bình thủy tinh hở miệng trên
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(bx, by); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by);
        ctx.stroke();

        // Các tế bào ung thư & tia gamma (364 keV) phát ra trong dung dịch
        const cells = [[145, 165], [215, 152], [265, 184], [165, 224], [242, 228]];
        cells.forEach(([cx, cy], idx) => {
            ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(cx, cy, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            // Nhân tế bào gắn I-131
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fill();

            if (idx % 2 === 0) {
                const len = 18 + saw * 24;
                drawGammaRay(ctx, cx, cy, cx + len, cy - len * 0.7, '#a855f7');
            }
        });

        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Môi trường nuôi cấy 1 lít', bx + bw / 2, by + bh + 20);

        // Thẻ thông số đề dẫn bên phải (Zero Data Leakage)
        drawRoundRect(ctx, 365, 72, 395, 198, 10, '#0f172a', '#a855f7', 2);
        ctx.fillStyle = '#d8b4fe';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('THÔNG SỐ MÔ HÌNH NUÔI CẤY TẾ BÀO', 382, 98);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Thể tích môi trường: V = 1 lít (1000 ml)', 382, 126);
        ctx.fillText('• Mật độ tế bào: 10⁶ tế bào/ml', 382, 152);
        ctx.fillText('• Nhu cầu mỗi tế bào: 10⁻¹² g ¹³¹₅₃I', 382, 178);
        ctx.fillText('• Chu kì bán rã: T = 8 ngày; M = 131 g/mol', 382, 204);
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('• Năng lượng mỗi tia γ: 364 keV', 382, 232);
        ctx.restore();
    });

    // =========================================================================
    // 9. MH-C4-93: ĐẦU BÁO KHÓI ION HÓA DÙNG NGUỒN AMERICIUM Am-241
    // =========================================================================
    window.VLXTModels.register('MH-C4-93', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'CẢM BIẾN BÁO KHÓI ION HÓA — NGUỒN AMERICIUM ²⁴¹₉₅Am');

        const saw = (t * 0.25) % 1;
        const smokeActive = saw >= 0.5;

        ctx.save();
        // Buồng ion hóa gồm hai bản kim loại song song nối nguồn điện
        const px = 145, pw = 235, topY = 88, botY = 232;
        drawRoundRect(ctx, px, topY, pw, 14, 3, '#ef4444', '#fca5a5', 2);
        drawRoundRect(ctx, px, botY, pw, 14, 3, '#3b82f6', '#93c5fd', 2);
        ctx.fillStyle = '#ffffff';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('+  +  +  +  +  +  +', px + pw / 2, topY + 11);
        ctx.fillText('–  –  –  –  –  –  –', px + pw / 2, botY + 11);

        // Nguồn phóng xạ alpha Am-241 đặt ở bản cực dưới
        drawRoundRect(ctx, px + 36, botY - 14, 42, 14, 3, '#f59e0b', '#fef08a', 2);
        drawNuclide(ctx, '241', '95', 'Am', px + 18, botY - 26, { fontSize: 15, color: '#fbbf24' });

        // Các hạt alpha bắn ra ion hóa không khí tạo cặp ion (+) và (-)
        for (let i = 0; i < 4; i++) {
            const p = ((t * 0.9 + i * 0.25) % 1);
            const ax = px + 57 + i * 32;
            const ay = botY - 18 - p * 95;
            drawAlphaCluster(ctx, ax, ay, 3.5);
        }

        // Các cặp ion (+) đi xuống bản âm, (-) đi lên bản dương
        if (!smokeActive) {
            for (let k = 0; k < 4; k++) {
                const ix = px + 95 + k * 34;
                drawArrow(ctx, ix, 162, ix, topY + 20, '#38bdf8', 2.2, 6);
                drawArrow(ctx, ix + 12, 162, ix + 12, botY - 8, '#ef4444', 2.2, 6);
            }
        } else {
            // Hạt khói bay vào buồng làm cản trở ion
            ctx.fillStyle = 'rgba(148, 163, 184, 0.55)';
            [[215, 145, 16], [255, 165, 20], [305, 148, 18], [338, 174, 15]].forEach(([sx, sy, sr]) => {
                ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill();
            });
            ctx.fillStyle = '#f8fafc';
            ctx.fillText('Hạt khói cản trở dòng ion', px + pw / 2, 164);
        }

        // Mạch điện bên trái nối nguồn & cảm biến dòng điện + Chuông báo cháy
        ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(px, topY + 7); ctx.lineTo(68, topY + 7); ctx.lineTo(68, 148);
        ctx.moveTo(px, botY + 7); ctx.lineTo(68, botY + 7); ctx.lineTo(68, 176);
        ctx.stroke();
        // Nguồn điện 1 chiều
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(54, 148); ctx.lineTo(82, 148); // cực dương (+)
        ctx.moveTo(60, 176); ctx.lineTo(76, 176); // cực âm (-)
        ctx.stroke();

        // Bộ cảm biến dòng & Chuông báo cháy bên phải
        drawRoundRect(ctx, 415, 126, 114, 68, 8, '#1e293b', smokeActive ? '#ef4444' : '#10b981', 2.4);
        ctx.fillStyle = smokeActive ? '#fca5a5' : '#6ee7b7';
        ctx.font = '800 13px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText(smokeActive ? 'DÒNG GIẢM!' : 'DÒNG ỔN ĐỊNH', 472, 152);
        ctx.fillText(smokeActive ? 'CHUÔNG KÊU' : 'Bình thường', 472, 174);

        // Thẻ thông số đề dẫn bên phải (Zero Data Leakage)
        drawRoundRect(ctx, 548, 72, 212, 196, 10, '#0f172a', '#fbbf24', 2);
        ctx.fillStyle = '#fbbf24';
        ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('THÔNG SỐ NGUỒN Am-241', 562, 98);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Khối lượng đầu: 0,2025 μg', 562, 126);
        ctx.fillText('• Hằng số phóng xạ:', 562, 152);
        ctx.fillText('  λ = 5,086·10⁻¹¹ s⁻¹', 562, 174);
        ctx.fillText('• Khối lượng mol: 241 g/mol', 562, 200);
        ctx.fillStyle = '#6ee7b7';
        ctx.fillText('• Phát tia α ion hóa không khí', 562, 228);
        ctx.restore();
    });

    // =========================================================================
    // 10. MH-C4-94: PHẢN ỨNG NHIỆT HẠCH D + T -> He + n (NHÀ MÁY ĐIỆN 500 MW)
    // =========================================================================
    window.VLXTModels.register('MH-C4-94', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'PHẢN ỨNG NHIỆT HẠCH ²₁D + ³₁T → ⁴₂He + ¹₀n (CÔNG SUẤT ĐIỆN 500 MW; H = 25%)');

        const saw = (t * 0.32) % 1;
        const cx = 245, cy = 164;

        ctx.save();
        if (saw < 0.5) {
            // Giai đoạn 1: Deuterium (2_1 D) và Tritium (3_1 T) lao vào nhau
            const p = saw / 0.5;
            const dX = 85 + p * (cx - 105);
            const tX = 405 - p * (405 - cx - 22);

            // Hạt nhân Deuterium (1p + 1n)
            ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(dX - 6, cy, 9, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#38bdf8'; ctx.beginPath(); ctx.arc(dX + 6, cy, 9, 0, Math.PI * 2); ctx.fill();
            drawNuclide(ctx, '2', '1', 'D', dX, cy - 26, { fontSize: 16, color: '#fbbf24', align: 'center' });
            drawArrow(ctx, dX + 20, cy, dX + 52, cy, '#fbbf24', 2.8, 7);

            // Hạt nhân Tritium (1p + 2n)
            ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(tX, cy - 7, 9, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#38bdf8'; ctx.beginPath(); ctx.arc(tX - 8, cy + 7, 9, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(tX + 8, cy + 7, 9, 0, Math.PI * 2); ctx.fill();
            drawNuclide(ctx, '3', '1', 'T', tX, cy - 26, { fontSize: 16, color: '#fbbf24', align: 'center' });
            drawArrow(ctx, tX - 20, cy, tX - 52, cy, '#fbbf24', 2.8, 7);
        } else {
            // Giai đoạn 2: Tổng hợp thành Helium (4_2 He) + Neutron (1_0 n) bay ra
            const p = (saw - 0.5) / 0.5;
            // Chớp sáng giải phóng năng lượng nhiệt hạch
            ctx.fillStyle = `rgba(254, 240, 138, ${(0.5 * (1 - p)).toFixed(2)})`;
            ctx.beginPath(); ctx.arc(cx, cy, 22 + p * 44, 0, Math.PI * 2); ctx.fill();

            // Hạt nhân Helium-4 (2p + 2n)
            const heX = cx - 28 - p * 65, heY = cy - p * 34;
            drawAlphaCluster(ctx, heX, heY, 7.5);
            drawNuclide(ctx, '4', '2', 'He', heX, heY - 26, { fontSize: 16, color: '#6ee7b7', align: 'center' });

            // Hạt Neutron (1_0 n) phóng nhanh sang phải
            const nX = cx + 28 + p * 115, nY = cy + p * 36;
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath(); ctx.arc(nX, nY, 9, 0, Math.PI * 2); ctx.fill();
            drawNuclide(ctx, '1', '0', 'n', nX, nY - 22, { fontSize: 16, color: '#38bdf8', align: 'center' });
        }

        // Thẻ thông số đề dẫn bên phải (Zero Data Leakage)
        drawRoundRect(ctx, 445, 68, 315, 200, 10, '#0f172a', '#fbbf24', 2);
        ctx.fillStyle = '#fbbf24';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('THÔNG SỐ LÒ NHIỆT HẠCH', 462, 94);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Công suất điện: P = 500 MW; H = 25%', 462, 122);
        ctx.fillText('• Độ hụt khối Δm_T = 0,009106 amu', 462, 148);
        ctx.fillText('• Độ hụt khối Δm_D = 0,002491 amu', 462, 174);
        ctx.fillText('• Độ hụt khối Δm_He = 0,030382 amu', 462, 200);
        ctx.fillStyle = '#6ee7b7';
        ctx.fillText('• 1 uc² = 931,5 MeV', 462, 228);
        ctx.restore();
    });

    // =========================================================================
    // 11. MH-C4-95: PHẢN ỨNG PHÂN HẠCH U-235 & TÀU PHÁ BĂNG HẠT NHÂN (120 MW)
    // =========================================================================
    window.VLXTModels.register('MH-C4-95', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'PHÂN HẠCH ²³⁵₉₂U + ¹₀n → ¹⁴³₆₀Nd + ⁹⁰₄₀La + k·¹₀n + 8·⁰₋₁e (200 MeV)');

        const saw = (t * 0.32) % 1;
        const cx = 225, cy = 158;

        ctx.save();
        if (saw < 0.45) {
            const p = saw / 0.45;
            // Neutron chậm bay vào hạt nhân U-235
            const nx = 54 + p * (cx - 34 - 54);
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath(); ctx.arc(nx, cy, 7, 0, Math.PI * 2); ctx.fill();
            drawNuclide(ctx, '1', '0', 'n', nx, cy - 22, { fontSize: 15, color: '#38bdf8', align: 'center' });

            // Hạt nhân nặng U-235
            ctx.fillStyle = 'rgba(245, 158, 11, 0.35)';
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 3;
            ctx.beginPath(); ctx.arc(cx, cy, 28, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            drawNuclide(ctx, '235', '92', 'U', cx, cy, { fontSize: 16, color: '#ffffff', align: 'center' });
        } else {
            const p = (saw - 0.45) / 0.55;
            // Vỡ thành Nd-143 và La-90 kèm k neutron mới
            const ndX = cx + 24 + p * 86, ndY = cy - 18 - p * 44;
            const laX = cx + 24 + p * 86, laY = cy + 18 + p * 44;

            ctx.fillStyle = 'rgba(16, 185, 129, 0.3)';
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2.6;
            ctx.beginPath(); ctx.arc(ndX, ndY, 20, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            drawNuclide(ctx, '143', '60', 'Nd', ndX, ndY, { fontSize: 14, color: '#ffffff', align: 'center' });

            ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
            ctx.strokeStyle = '#38bdf8';
            ctx.beginPath(); ctx.arc(laX, laY, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            drawNuclide(ctx, '90', '40', 'La', laX, laY, { fontSize: 14, color: '#ffffff', align: 'center' });

            // k neutron thứ cấp phóng ra phía trước
            [-26, 0, 26].forEach(dy => {
                const nX = cx + 30 + p * 125;
                const nY = cy + dy * (0.4 + p * 0.8);
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath(); ctx.arc(nX, nY, 5.5, 0, Math.PI * 2); ctx.fill();
            });
        }

        // Thẻ ứng dụng Tàu phá băng hạt nhân bên phải (Zero Data Leakage)
        drawRoundRect(ctx, 415, 68, 345, 200, 10, '#0f172a', '#38bdf8', 2);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('TÀU PHÁ BĂNG CHẠY NĂNG LƯỢNG HẠT NHÂN', 432, 94);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Năng lượng 1 phân hạch: 200 MeV', 432, 122);
        ctx.fillText('• Công suất phát điện tàu: P = 120 MW', 432, 148);
        ctx.fillText('• Hiệu suất chuyển hóa: H = 30%', 432, 174);
        ctx.fillText('• Nhiên liệu sử dụng: ²³⁵₉₂U (235 g/mol)', 432, 200);
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('• Phản ứng dây chuyền có điều khiển', 432, 228);
        ctx.restore();
    });

    // =========================================================================
    // 12. MH-C4-96: LÒ PHẢN ỨNG NHÀ MÁY ĐIỆN HẠT NHÂN (X + U-235 -> Xe-139 + Sr-95 + 2X)
    // =========================================================================
    window.VLXTModels.register('MH-C4-96', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'LÒ PHẢN ỨNG NHÀ MÁY ĐIỆN HẠT NHÂN (X + ²³⁵₉₂U → ¹³⁹₅₄Xe + ⁹⁵₃₈Sr + 2X)');

        const saw = (t * 0.3) % 1;

        ctx.save();
        // 1. Vùng hoạt động Lò phản ứng hạt nhân bên trái
        const rx = 56, ry = 76, rw = 215, rh = 186;
        drawRoundRect(ctx, rx, ry, rw, rh, 12, '#0f172a', '#ef4444', 3);

        // Các thanh nhiên liệu Uranium (đỏ cam) & Thanh điều khiển Boron/Cadmium (xám xanh)
        [86, 134, 182, 230].forEach((fx, idx) => {
            drawRoundRect(ctx, fx - 7, ry + 48, 14, 124, 3, '#f59e0b', '#fef08a', 1.8);
            if (idx < 3) {
                // Thanh điều khiển nhô từ nắp lò xuống hấp thụ bớt hạt X
                drawRoundRect(ctx, fx + 18, ry - 12, 10, 74, 3, '#64748b', '#cbd5e1', 1.8);
            }
        });
        ctx.fillStyle = '#fca5a5';
        ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Lò phản ứng hạt nhân', rx + rw / 2, ry + rh + 20);

        // 2. Vòng tuần hoàn sơ cấp dẫn nhiệt sang Bình sinh hơi & Tua-bin máy phát
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(rx + rw, 114); ctx.lineTo(345, 114);
        ctx.stroke();
        ctx.strokeStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(345, 224); ctx.lineTo(rx + rw, 224);
        ctx.stroke();
        drawArrow(ctx, 285 + saw * 42, 114, 305 + saw * 42, 114, '#fbbf24', 2.8, 6);

        // Bình sinh hơi & Tua-bin
        drawRoundRect(ctx, 345, 92, 86, 152, 10, '#1e293b', '#38bdf8', 2.4);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '700 13px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('Bình sinh', 388, 158);
        ctx.fillText('hơi & Tua-bin', 388, 178);

        // Thẻ thông số năng lượng liên kết riêng bên phải
        drawRoundRect(ctx, 455, 72, 305, 196, 10, '#0f172a', '#fbbf24', 2);
        ctx.fillStyle = '#fbbf24';
        ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('NĂNG LƯỢNG LIÊN KẾT RIÊNG (W_lkr / A)', 470, 98);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Hạt nhân ²³⁵₉₂U: 7,6 MeV/nucleon', 470, 126);
        ctx.fillText('• Hạt nhân ¹³⁹₅₄Xe: 8,4 MeV/nucleon', 470, 152);
        ctx.fillText('• Hạt nhân ⁹⁵₃₈Sr: 8,7 MeV/nucleon', 470, 178);
        ctx.fillStyle = '#6ee7b7';
        ctx.fillText('• Phản ứng: X + ²³⁵₉₂U → ¹³⁹₅₄Xe + ⁹⁵₃₈Sr + 2X', 470, 206);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText('• Thanh điều khiển hấp thụ bớt hạt X', 470, 234);
        ctx.restore();
    });

    // =========================================================================
    // 13. MH-C4-97: SƠ ĐỒ CHUYỂN HÓA NĂNG LƯỢNG NHÀ MÁY ĐIỆN HẠT NHÂN (1000 J -> 323 J)
    // =========================================================================
    window.VLXTModels.register('MH-C4-97', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'CHUỖI CHUYỂN HÓA NĂNG LƯỢNG NHÀ MÁY ĐIỆN HẠT NHÂN (P_điện = 1066 MW)');

        const saw = (t * 0.35) % 1;

        ctx.save();
        // Sơ đồ dòng năng lượng từ 1000 J phân hạch -> Lò phản ứng -> Tua-bin -> Máy phát -> 323 J điện
        const nodes = [
            { x: 26,  y: 112, w: 122, h: 72, title: 'Năng lượng', sub: '1000 J', col: '#f59e0b' },
            { x: 184, y: 112, w: 122, h: 72, title: 'Lò phản ứng', sub: 'Cấp nhiệt', col: '#ef4444' },
            { x: 342, y: 112, w: 122, h: 72, title: 'Tua-bin hơi', sub: 'Sinh cơ năng', col: '#38bdf8' },
            { x: 500, y: 112, w: 122, h: 72, title: 'Máy phát', sub: 'Phát điện', col: '#10b981' },
            { x: 648, y: 112, w: 112, h: 72, title: 'Điện năng', sub: '323 J (1066 MW)', col: '#6ee7b7' }
        ];

        nodes.forEach((n, idx) => {
            drawRoundRect(ctx, n.x, n.y, n.w, n.h, 8, '#0f172a', n.col, 2.4);
            ctx.fillStyle = '#f8fafc';
            ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(n.title, n.x + n.w / 2, n.y + 28);
            ctx.fillStyle = n.col;
            ctx.font = '700 12.5px "DM Mono", monospace';
            ctx.fillText(n.sub, n.x + n.w / 2, n.y + 50);

            if (idx < nodes.length - 1) {
                const nextX = nodes[idx + 1].x;
                drawArrow(ctx, n.x + n.w, 148, nextX - 2, 148, '#fbbf24', 2.8, 7);
            }
        });

        // Nhánh nước làm mát tuần hoàn qua Tua-bin (48 m³/s)
        drawRoundRect(ctx, 275, 222, 255, 56, 8, '#1e293b', '#38bdf8', 2);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Hệ thống làm mát Tua-bin: 48 m³/s', 402, 244);
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '700 12.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('c = 4200 J/(kg·K) · ρ = 1000 kg/m³', 402, 264);
        drawArrow(ctx, 402, 184, 402, 220, '#38bdf8', 2.6, 7);

        // Xung năng lượng chạy dọc sơ đồ
        const pulseX = 85 + saw * 615;
        ctx.fillStyle = '#fef08a';
        ctx.beginPath(); ctx.arc(pulseX, 148, 5, 0, Math.PI * 2); ctx.fill();

        // Phương trình phản ứng U-235 ở góc trên phải
        ctx.fillStyle = '#fbbf24';
        ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Phản ứng: ²³⁵U + n → ¹⁴¹Ba + ⁹²Kr + 3n', 28, 76);
        ctx.restore();
    });

    // =========================================================================
    // 14. MH-C4-98: ĐỒNG VỊ PHÓNG XẠ POTASSIUM K-40 TRONG QUẢ CHUỐI (T = 1,28·10^9 năm)
    // =========================================================================
    window.VLXTModels.register('MH-C4-98', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'ĐỒNG VỊ POTASSIUM TRONG CHUỐI: ³⁹₁₉K, ⁴⁰₁₉K (PHÓNG XẠ), ⁴¹₁₉K');

        const saw = (t * 0.3) % 1;

        ctx.save();
        // Hình minh họa quả chuối & các đồng vị Potassium bên trái
        ctx.strokeStyle = '#facc15';
        ctx.fillStyle = 'rgba(250, 204, 21, 0.22)';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(95, 96);
        ctx.quadraticCurveTo(75, 195, 195, 224);
        ctx.quadraticCurveTo(132, 175, 118, 96);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Tia phóng xạ phát ra từ đồng vị K-40 trong chuối (1 chiều sawtooth)
        const rx = 132 + saw * 64;
        const ry = 165 - saw * 48;
        drawGammaRay(ctx, 132, 165, rx, ry, '#fbbf24');

        // 3 thẻ đồng vị Potassium ở giữa
        const isotopes = [
            { A: '39', Z: '19', status: 'Đồng vị bền', col: '#10b981', y: 74 },
            { A: '40', Z: '19', status: 'Phóng xạ (T = 1,28·10⁹ năm)', col: '#ef4444', y: 142 },
            { A: '41', Z: '19', status: 'Đồng vị bền', col: '#38bdf8', y: 210 }
        ];
        isotopes.forEach(iso => {
            drawRoundRect(ctx, 235, iso.y, 245, 54, 8, '#0f172a', iso.col, 2);
            drawNuclide(ctx, iso.A, iso.Z, 'K', 265, iso.y + 27, { fontSize: 18, color: iso.col });
            ctx.fillStyle = '#f8fafc';
            ctx.font = '700 13px "Plus Jakarta Sans", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(iso.status, 305, iso.y + 31);
        });

        // Thẻ thông số đề dẫn bên phải (Zero Data Leakage)
        drawRoundRect(ctx, 502, 74, 258, 190, 10, '#0f172a', '#facc15', 2);
        ctx.fillStyle = '#facc15';
        ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('THÔNG SỐ ĐỒNG VỊ ⁴⁰₁₉K', 518, 100);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Chu kì bán rã: T = 1,28·10⁹ năm', 518, 128);
        ctx.fillText('• Quy ước: 1 năm = 365 ngày', 518, 154);
        ctx.fillText('• Khối lượng mol: M = 40 g/mol', 518, 180);
        ctx.fillText('• Khối lượng mẫu: m = 59 μg', 518, 206);
        ctx.fillStyle = '#6ee7b7';
        ctx.fillText('• N_A = 6,02·10²³ hạt/mol', 518, 234);
        ctx.restore();
    });

    // =========================================================================
    // 15. MH-C4-99: KHÍ PHÓNG XẠ RADON Rn-222 TÍCH TỤ TRONG NGÔI NHÀ (T = 3,82 ngày)
    // =========================================================================
    window.VLXTModels.register('MH-C4-99', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'KHÍ PHÓNG XẠ TỰ NHIÊN RADON ²²²₈₆Rn TÍCH TỤ TRONG NHÀ (T = 3,82 ngày)');

        const saw = (t * 0.28) % 1;

        ctx.save();
        // 1. Nền đất chứa đá phóng xạ Uranium/Radium bên dưới
        ctx.fillStyle = '#451a03';
        ctx.fillRect(42, 224, 385, 58);
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2.6;
        ctx.beginPath(); ctx.moveTo(42, 224); ctx.lineTo(427, 224); ctx.stroke();

        // 2. Mặt cắt ngôi nhà (Tầng hầm & Tầng trệt)
        const hx = 105, hy = 112, hw = 255, hh = 136;
        // Mái nhà tam giác
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(hx - 18, hy);
        ctx.lineTo(hx + hw / 2, 58);
        ctx.lineTo(hx + hw + 18, hy);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Thân nhà & Nền móng tiếp xúc đất
        drawRoundRect(ctx, hx, hy, hw, hh, 2, 'rgba(15, 23, 42, 0.85)', '#cbd5e1', 3);
        // Sàn ngăn tầng
        ctx.beginPath(); ctx.moveTo(hx, 178); ctx.lineTo(hx + hw, 178); ctx.stroke();

        // Các khe nứt ở nền móng & Mũi tên khí Radon Rn-222 thấm từ đất vào nhà (1 chiều sawtooth)
        [145, 215, 295].forEach(rx => {
            const py = 266 - saw * 98;
            drawArrow(ctx, rx, 266, rx, 216, '#ef4444', 2.8, 7);
            ctx.fillStyle = 'rgba(239, 68, 68, 0.75)';
            ctx.beginPath(); ctx.arc(rx + Math.sin(saw * 6 + rx) * 8, py, 4.5, 0, Math.PI * 2); ctx.fill();
        });

        ctx.fillStyle = '#fbbf24';
        ctx.font = '800 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Khí Radon ²²²₈₆Rn thấm qua nền nhà', hx + hw / 2, 152);
        ctx.fillStyle = '#fdba74';
        ctx.fillText('Đất đá chứa U, Th, Ra phân rã', 234, 274);

        // Thẻ thông số đề dẫn bên phải (Zero Data Leakage)
        drawRoundRect(ctx, 445, 72, 315, 198, 10, '#0f172a', '#ef4444', 2);
        ctx.fillStyle = '#fca5a5';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('THÔNG SỐ KHÍ RADON ²²²₈₆Rn', 462, 98);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Chu kì bán rã: T = 3,82 ngày', 462, 126);
        ctx.fillText('• Khối lượng mol: M = 222 g/mol', 462, 152);
        ctx.fillText('• Mức cảnh báo EPA: ≥ 4,00 pCi/lít', 462, 178);
        ctx.fillText('• Số Avogadro: N_A = 6,02·10²³ mol⁻¹', 462, 204);
        ctx.fillStyle = '#6ee7b7';
        ctx.fillText('• Mở cửa thông gió giúp pha loãng khí', 462, 234);
        ctx.restore();
    });

    // =========================================================================
    // 16. MH-C4-100: PIN NGUYÊN TỬ PLUTONIUM PU-238 (2,5 Ci · T = 87,7 năm)
    // =========================================================================
    window.VLXTModels.register('MH-C4-100', function(ctx, w, h, t) {
        clearCanvas(ctx, w, h);
        drawTitleBadge(ctx, 'PIN NGUYÊN TỬ PLUTONIUM-238 (H₀ = 2,5 Ci; T = 87,7 năm — MEDTRONIC MODEL 9000)');

        const saw = (t * 0.3) % 1;

        ctx.save();
        // 1. Vỏ pin nguyên tử cấy ghép y tế (Medtronic Laurens-Alcatel Model 9000)
        const px = 65, py = 74, pw = 295, ph = 186;
        drawRoundRect(ctx, px, py, pw, ph, 26, '#1e293b', '#94a3b8', 3.4);

        // Nhãn thông số kỹ thuật khắc trên vỏ pin như đề dẫn
        drawRoundRect(ctx, px + 22, py + 18, pw - 44, 44, 6, '#0f172a', '#fbbf24', 2);
        ctx.fillStyle = '#fbbf24';
        ctx.font = '800 15px "DM Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('PU-238 · 2.5CI - 1974', px + pw / 2, py + 45);

        // Khoang viên nhiên liệu Pu-238 & Cặp nhiệt điện chuyển nhiệt phân rã -> điện năng
        drawRoundRect(ctx, px + 26, py + 82, 96, 76, 8, 'rgba(239, 68, 68, 0.25)', '#ef4444', 2.2);
        drawNuclide(ctx, '238', '94', 'Pu', px + 74, py + 112, { fontSize: 17, color: '#fca5a5', align: 'center' });
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 12px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('Phân rã α tỏa nhiệt', px + 74, py + 142);

        // Mũi tên truyền nhiệt sang Bộ chuyển đổi nhiệt điện
        drawArrow(ctx, px + 124, py + 120, px + 162, py + 120, '#fbbf24', 3, 7);

        drawRoundRect(ctx, px + 166, py + 82, 102, 76, 8, 'rgba(16, 185, 129, 0.22)', '#10b981', 2.2);
        ctx.fillStyle = '#6ee7b7';
        ctx.font = '800 13px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('Cặp nhiệt điện', px + 217, py + 112);
        ctx.fillText('Nhiệt → Điện', px + 217, py + 134);

        // Xung dòng điện ổn định đi ra cực pin
        drawArrow(ctx, px + pw, py + 120, px + pw + 34, py + 120, '#38bdf8', 3, 8);
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.arc(px + pw + 6 + saw * 24, py + 120, 4, 0, Math.PI * 2); ctx.fill();

        // Thẻ thông số đề dẫn bên phải (Zero Data Leakage)
        drawRoundRect(ctx, 415, 72, 345, 196, 10, '#0f172a', '#10b981', 2);
        ctx.fillStyle = '#6ee7b7';
        ctx.font = '800 14px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('THÔNG SỐ PIN NGUYÊN TỬ PU-238', 432, 98);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '700 13.5px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillText('• Đồng vị phóng xạ: ²³⁸₉₄Pu', 432, 126);
        ctx.fillText('• Độ phóng xạ ban đầu: H₀ = 2,5 Ci', 432, 152);
        ctx.fillText('• Chu kì bán rã: T = 87,7 năm', 432, 178);
        ctx.fillText('• 1 Ci = 3,7·10¹⁰ Bq; 1 năm = 365 ngày', 432, 204);
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('• Thay pin khi công suất giảm 50%', 432, 234);
        ctx.restore();
    });

})(window);
            })({ VLXTModels: tempVLXT });
        } catch(e) {
            if (typeof console !== 'undefined') console.error('Lỗi nạp Canvas chunk:', e);
        }

    })();


    var api = {
        version: VERSION,
        has: has,
        get: get,
        listIds: listIds,
        render: render,
        getSvgString: getSvgString,
        mountAll: mountAll,
        ensureStyles: ensureStyles
    ,
        register: registerCanvas,
        _canvasRegistry: canvasRegistry
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }
    global.VLXTModels = api;
})(typeof window !== 'undefined' ? window : globalThis);
