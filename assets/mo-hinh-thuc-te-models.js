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
            '.vstep-data-panel{margin:14px 0 16px;background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;padding:12px 14px;max-width:100%;min-width:0;overflow-x:auto;-webkit-overflow-scrolling:touch;color:#0f172a;box-sizing:border-box;}',
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
    alt: 'Sơ đồ bóng thám không mang hộp cảm biến khí tượng và GPS bay lên độ cao 40 km khi áp suất giảm và bóng giãn nở',
    build: function (u) {
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
        '</defs>' +
        '<rect x="16" y="16" width="668" height="328" rx="12" fill="url(#' + u + 'sky)" stroke="#1e293b" stroke-width="1.5"/>' +
        // Altitude ruler on left
        '<line x1="78" y1="42" x2="78" y2="320" stroke="#475569" stroke-width="2"/>' +
        '<line x1="70" y1="54" x2="86" y2="54" stroke="#f59e0b" stroke-width="2"/>' +
        '<text x="64" y="59" fill="#fbbf24" font-size="13" font-weight="800" text-anchor="end">40 km</text>' +
        '<line x1="72" y1="186" x2="84" y2="186" stroke="#64748b" stroke-width="1.5"/>' +
        '<text x="64" y="191" fill="#94a3b8" font-size="12.5" font-weight="700" text-anchor="end">20 km</text>' +
        '<line x1="70" y1="316" x2="86" y2="316" stroke="#10b981" stroke-width="2"/>' +
        '<text x="64" y="320" fill="#6ee7b7" font-size="13" font-weight="800" text-anchor="end">0 km</text>' +
        // Ground & Radar/Ground Station
        '<rect x="92" y="302" width="582" height="30" rx="4" fill="#0f172a" stroke="#334155" stroke-width="1.2"/>' +
        '<rect x="140" y="274" width="62" height="28" rx="4" fill="#1e293b" stroke="#38bdf8" stroke-width="1.6"/>' +
        '<path d="M 163 274 L 171 254 L 179 274" fill="none" stroke="#94a3b8" stroke-width="2"/>' +
        '<path d="M 158 250 Q 171 240 184 250" fill="none" stroke="#38bdf8" stroke-width="2" class="ambient-heat-arrow"/>' +
        '<text x="200" y="321" fill="#cbd5e1" font-size="13" font-weight="700" text-anchor="middle">Đài quan sát (0h &amp; 12h UTC)</text>' +
        // Small ground-level reference balloon
        '<circle cx="242" cy="242" r="22" fill="url(#' + u + 'bal)" opacity="0.82"/>' +
        '<path d="M 242 264 L 242 280" stroke="#94a3b8" stroke-width="1.5"/>' +
        '<rect x="234" y="280" width="16" height="12" rx="2" fill="#0f172a" stroke="#38bdf8" stroke-width="1.4"/>' +
        '<text x="274" y="238" fill="#cbd5e1" font-size="13" font-weight="700">Lúc thả: V₁ = 15,8 m³</text>' +
        '<text x="274" y="257" fill="#94a3b8" font-size="13">p₁ = 105 kPa · t₁ = 27°C</text>' +
        // Ascending path dashed arrow
        '<path d="M 258 214 Q 302 162 344 122" fill="none" stroke="#38bdf8" stroke-width="2.2" stroke-dasharray="6 5" marker-end="url(#' + u + 'up)"/>' +
        // High altitude expanded balloon (ambient bob)
        '<g class="ambient-balloon">' +
        '<circle cx="408" cy="112" r="56" fill="url(#' + u + 'bal)" stroke="#f8fafc" stroke-width="1.5"/>' +
        '<g class="ambient-gas-a"><circle cx="390" cy="95" r="3.5" fill="#0284c7"/><circle cx="426" cy="122" r="3.5" fill="#0284c7"/></g>' +
        '<g class="ambient-gas-b"><circle cx="423" cy="92" r="3.5" fill="#0369a1"/><circle cx="394" cy="128" r="3.5" fill="#0369a1"/></g>' +
        '<line x1="408" y1="168" x2="408" y2="196" stroke="#cbd5e1" stroke-width="2"/>' +
        '<rect x="390" y="196" width="36" height="26" rx="4" fill="#1e293b" stroke="#fbbf24" stroke-width="1.8"/>' +
        '<circle cx="408" cy="209" r="4" fill="#10b981"/>' +
        '<path d="M 376 205 Q 366 210 376 216" fill="none" stroke="#38bdf8" stroke-width="1.8" class="ambient-heat-arrow"/>' +
        '<path d="M 440 205 Q 450 210 440 216" fill="none" stroke="#38bdf8" stroke-width="1.8" class="ambient-heat-arrow"/>' +
        '</g>' +
        // Leader callouts on right
        '<polyline points="464,90 494,70 658,70" fill="none" stroke="#f59e0b" stroke-width="1.8"/>' +
        '<circle cx="464" cy="90" r="3.5" fill="#f59e0b"/>' +
        '<text x="496" y="63" fill="#fbbf24" font-size="13.5" font-weight="800">Giãn nở cực đại (~40 km)</text>' +
        '<text x="496" y="88" fill="#e2e8f0" font-size="13">p₂ = 27 640 Pa · V₂ = 39,5 m³</text>' +
        '<polyline points="426,209 494,209 658,209" fill="none" stroke="#38bdf8" stroke-width="1.6" stroke-dasharray="3 3"/>' +
        '<circle cx="426" cy="209" r="3.5" fill="#38bdf8"/>' +
        '<text x="496" y="198" fill="#7dd3fc" font-size="13.5" font-weight="800">Cảm biến &amp; GPS/Radar</text>' +
        '<text x="496" y="226" fill="#cbd5e1" font-size="13">Đo p, T, ẩm, gió gửi về đài</text>' +
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
    alt: 'Sơ đồ so sánh ba trạng thái thể tích và áp suất của bóng thám không chứa khí H2 từ mặt đất lên độ cao lớn',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 350" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><radialGradient id="' + u + 'hb" cx="38%" cy="32%" r="65%">' +
        '<stop offset="0%" stop-color="#f1f5f9"/><stop offset="65%" stop-color="#94a3b8"/><stop offset="100%" stop-color="#475569"/>' +
        '</radialGradient>' +
        '<marker id="' + u + 'ar" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
        '<path d="M 0 1 L 9 5 L 0 9 z" fill="#38bdf8"/></marker></defs>' +
        '<rect x="16" y="16" width="668" height="318" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Column 1: ĐKTC reference
        '<rect x="32" y="34" width="194" height="282" rx="10" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>' +
        '<text x="129" y="58" fill="#94a3b8" font-size="13.5" font-weight="800" text-anchor="middle">Điều kiện chuẩn (ĐKTC)</text>' +
        '<circle cx="129" cy="148" r="34" fill="url(#' + u + 'hb)" opacity="0.88"/>' +
        '<text x="129" y="153" fill="#0f172a" font-size="14" font-weight="800" text-anchor="middle">H₂</text>' +
        '<text x="129" y="218" fill="#e2e8f0" font-size="13" font-weight="700" text-anchor="middle">t₀ = 0°C · p₀ = 101,3 kPa</text>' +
        '<text x="129" y="242" fill="#7dd3fc" font-size="13" font-weight="700" text-anchor="middle">ρ₀ = 0,09 kg/m³</text>' +
        '<text x="129" y="266" fill="#cbd5e1" font-size="13" text-anchor="middle">1 mol khí = 22,4 lít</text>' +
        // Column 2: Launch state
        '<rect x="252" y="34" width="194" height="282" rx="10" fill="#0f172a" stroke="#0284c7" stroke-width="1.6"/>' +
        '<text x="349" y="58" fill="#38bdf8" font-size="13.5" font-weight="800" text-anchor="middle">Trạng thái thả bóng (1)</text>' +
        '<g class="ambient-balloon">' +
        '<circle cx="349" cy="146" r="40" fill="url(#' + u + 'hb)" stroke="#38bdf8" stroke-width="1.5"/>' +
        '<g class="ambient-gas-a"><circle cx="337" cy="136" r="3" fill="#0284c7"/><circle cx="362" cy="154" r="3" fill="#0284c7"/></g>' +
        '<line x1="349" y1="186" x2="349" y2="202" stroke="#94a3b8" stroke-width="1.8"/>' +
        '<rect x="339" y="202" width="20" height="12" rx="2" fill="#1e293b" stroke="#38bdf8" stroke-width="1.4"/>' +
        '</g>' +
        '<text x="349" y="242" fill="#e2e8f0" font-size="13" font-weight="700" text-anchor="middle">V₁ = 15,8 m³</text>' +
        '<text x="349" y="265" fill="#7dd3fc" font-size="13" font-weight="700" text-anchor="middle">p₁ = 105 000 Pa</text>' +
        '<text x="349" y="288" fill="#cbd5e1" font-size="13" font-weight="700" text-anchor="middle">t₁ = 27°C</text>' +
        // Column 3: Burst state
        '<rect x="472" y="34" width="196" height="282" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="1.6"/>' +
        '<text x="570" y="58" fill="#fbbf24" font-size="13.5" font-weight="800" text-anchor="middle">Trên cao & Lúc nổ</text>' +
        '<g class="ambient-balloon">' +
        '<circle cx="570" cy="144" r="52" fill="url(#' + u + 'hb)" stroke="#fbbf24" stroke-width="1.8" stroke-dasharray="6 3"/>' +
        '<g class="ambient-gas-b"><circle cx="552" cy="130" r="3.2" fill="#d97706"/><circle cx="585" cy="156" r="3.2" fill="#d97706"/></g>' +
        '</g>' +
        '<text x="570" y="226" fill="#fde68a" font-size="13" font-weight="700" text-anchor="middle">Ở 7°C: p₃ = 67 000 Pa</text>' +
        '<text x="570" y="254" fill="#fca5a5" font-size="13" font-weight="800" text-anchor="middle">Lúc nổ: V₄ = 39,5 m³</text>' +
        '<text x="570" y="278" fill="#e2e8f0" font-size="13" font-weight="700" text-anchor="middle">p₄ = 27 640 Pa</text>' +
        // Arrow 2 -> 3
        '<line x1="448" y1="146" x2="470" y2="146" stroke="#38bdf8" stroke-width="2.2" marker-end="url(#' + u + 'ar)"/>' +
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
    alt: 'Mô hình khinh khí cầu thể tích không đổi V = 1,15 m3 có lỗ hở đáy trao đổi khí với khí quyển và cân bằng lực F_A với trọng lực',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 360" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs>' +
        '<linearGradient id="' + u + 'shell" x1="0%" y1="0%" x2="100%" y2="0%">' +
        '<stop offset="0%" stop-color="#0284c7"/><stop offset="50%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#0369a1"/>' +
        '</linearGradient>' +
        '<marker id="' + u + 'fa" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
        '<path d="M 0 1 L 9 5 L 0 9 z" fill="#10b981"/></marker>' +
        '<marker id="' + u + 'fg" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
        '<path d="M 0 1 L 9 5 L 0 9 z" fill="#ef4444"/></marker>' +
        '</defs>' +
        '<rect x="16" y="16" width="668" height="328" rx="12" fill="#081020" stroke="#1e293b" stroke-width="1.5"/>' +
        // Balloon body (ambient float)
        '<g class="ambient-balloon">' +
        '<path d="M 190 120 C 190 52 290 52 290 120 C 290 164 264 198 258 220 L 222 220 C 216 198 190 164 190 120 Z" fill="rgba(56,189,248,0.18)" stroke="url(#' + u + 'shell)" stroke-width="3"/>' +
        '<g class="ambient-gas-a"><circle cx="222" cy="112" r="3.5" fill="#fbbf24"/><circle cx="256" cy="134" r="3.5" fill="#fbbf24"/></g>' +
        '<g class="ambient-gas-b"><circle cx="246" cy="100" r="3.5" fill="#f97316"/><circle cx="230" cy="150" r="3.5" fill="#f97316"/></g>' +
        // Burner & open vent
        '<ellipse cx="240" cy="210" rx="8" ry="13" fill="#f59e0b" class="ambient-heat-arrow"/>' +
        '<line x1="224" y1="224" x2="228" y2="246" stroke="#94a3b8" stroke-width="2"/>' +
        '<line x1="256" y1="224" x2="252" y2="246" stroke="#94a3b8" stroke-width="2"/>' +
        '<rect x="224" y="246" width="32" height="22" rx="4" fill="#92400e" stroke="#d97706" stroke-width="1.5"/>' +
        // Buoyancy arrow Up & Weight arrow Down
        '<line x1="158" y1="180" x2="158" y2="95" stroke="#10b981" stroke-width="3" marker-end="url(#' + u + 'fa)"/>' +
        '<text x="148" y="138" fill="#6ee7b7" font-size="14" font-weight="800" text-anchor="end">F_A</text>' +
        '<line x1="158" y1="188" x2="158" y2="262" stroke="#ef4444" stroke-width="3" marker-end="url(#' + u + 'fg)"/>' +
        '<text x="148" y="232" fill="#fca5a5" font-size="14" font-weight="800" text-anchor="end">P + P_khí</text>' +
        '</g>' +
        // Callouts on right side
        '<polyline points="292,102 324,78 340,78" fill="none" stroke="#38bdf8" stroke-width="1.6"/>' +
        '<circle cx="292" cy="102" r="3.5" fill="#38bdf8"/>' +
        '<rect x="340" y="44" width="332" height="72" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.4"/>' +
        '<text x="356" y="68" fill="#7dd3fc" font-size="13.5" font-weight="800">Thông số khí cầu &amp; Mặt đất</text>' +
        '<text x="356" y="90" fill="#e2e8f0" font-size="13">V = 1,15 m³ · m_vỏ = 0,2 kg · g = 10 m/s²</text>' +
        '<text x="356" y="109" fill="#cbd5e1" font-size="13">t₁ = 20°C · p₁ = 1,013·10⁵ Pa · ρ₀ = 1,2 kg/m³</text>' +

        '<polyline points="260,218 324,175 340,175" fill="none" stroke="#fbbf24" stroke-width="1.6"/>' +
        '<circle cx="260" cy="218" r="3.5" fill="#fbbf24"/>' +
        '<rect x="340" y="136" width="332" height="74" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.4"/>' +
        '<text x="356" y="160" fill="#fbbf24" font-size="13.5" font-weight="800">1. Lỗ hở trao đổi khí (đẳng áp)</text>' +
        '<text x="356" y="182" fill="#e2e8f0" font-size="13">Áp suất trong cầu luôn bằng áp suất khí quyển.</text>' +
        '<text x="356" y="201" fill="#cbd5e1" font-size="13">Khí nóng thoát bớt ra ngoài khi tăng nhiệt độ.</text>' +

        '<rect x="340" y="226" width="332" height="86" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.4"/>' +
        '<text x="356" y="250" fill="#6ee7b7" font-size="13.5" font-weight="800">2. Bịt kín lỗ hở ở t₂ = 110°C</text>' +
        '<text x="356" y="272" fill="#e2e8f0" font-size="13">Lên cao ρ_khí quyển giảm theo độ cao h:</text>' +
        '<text x="356" y="294" fill="#cbd5e1" font-size="12.5">ρ(h) = ρ₀·e^(-ρ₀gh/p₁) · Cực đại khi F_A = P_tổng</text>' +
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
    alt: 'Bộ thí nghiệm gồm áp kế, cảm biến nhiệt độ 23,5°C, xilanh chia vạch, pít-tông và tay quay điều chỉnh thể tích khí',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 700 340" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><linearGradient id="' + u + 'gas" x1="0%" y1="0%" x2="100%" y2="0%">' +
        '<stop offset="0%" stop-color="rgba(56,189,248,0.28)"/><stop offset="100%" stop-color="rgba(14,165,233,0.12)"/>' +
        '</linearGradient></defs>' +
        '<rect x="16" y="16" width="668" height="308" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Pressure gauge top left
        '<g transform="translate(105,82)">' +
        '<circle cx="0" cy="0" r="38" fill="#f8fafc" stroke="#38bdf8" stroke-width="3"/>' +
        '<circle cx="0" cy="0" r="30" fill="#0f172a" stroke="#475569" stroke-width="1.5"/>' +
        '<line x1="0" y1="0" x2="17" y2="-16" stroke="#ef4444" stroke-width="2.6" stroke-linecap="round" class="ambient-needle"/>' +
        '<circle cx="0" cy="0" r="4" fill="#e2e8f0"/>' +
        '<text x="0" y="21" fill="#94a3b8" font-size="11" font-weight="700" text-anchor="middle">bar</text>' +
        '</g>' +
        '<polyline points="144,68 180,46 250,46" fill="none" stroke="#38bdf8" stroke-width="1.6"/>' +
        '<text x="184" y="40" fill="#7dd3fc" font-size="13.5" font-weight="800">Áp kế</text>' +
        // Connecting pipe from gauge to cylinder
        '<path d="M 105 120 L 105 215 L 165 215" fill="none" stroke="#94a3b8" stroke-width="8" stroke-linecap="round"/>' +
        '<path d="M 105 120 L 105 215 L 165 215" fill="none" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/>' +
        // Temperature sensor
        '<path d="M 109 162 L 170 162 Q 190 162 200 132" fill="none" stroke="#fbbf24" stroke-width="2"/>' +
        '<circle cx="105" cy="162" r="4" fill="#fbbf24"/>' +
        '<rect x="200" y="96" width="114" height="44" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>' +
        '<text x="257" y="125" fill="#6ee7b7" font-size="18" font-weight="800" font-family="DM Mono,monospace" text-anchor="middle">23.5°C</text>' +
        '<polyline points="257,96 276,72 426,72" fill="none" stroke="#6ee7b7" stroke-width="1.6"/>' +
        '<text x="282" y="65" fill="#6ee7b7" font-size="13.5" font-weight="800">Cảm biến nhiệt độ</text>' +
        // Base rail
        '<rect x="145" y="280" width="380" height="16" rx="4" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>' +
        // Cylinder
        '<rect x="165" y="168" width="320" height="106" rx="10" fill="rgba(15,23,42,0.8)" stroke="#94a3b8" stroke-width="3"/>' +
        '<rect x="167" y="170" width="180" height="102" rx="8" fill="url(#' + u + 'gas)"/>' +
        '<g class="ambient-gas-a"><circle cx="205" cy="204" r="3.5" fill="#38bdf8"/><circle cx="285" cy="238" r="3.5" fill="#38bdf8"/><circle cx="242" cy="245" r="3.5" fill="#7dd3fc"/></g>' +
        '<g class="ambient-gas-b"><circle cx="232" cy="196" r="3.5" fill="#38bdf8"/><circle cx="312" cy="208" r="3.5" fill="#7dd3fc"/><circle cx="195" cy="242" r="3.5" fill="#38bdf8"/></g>' +
        // Scale marks on cylinder
        '<line x1="205" y1="258" x2="205" y2="274" stroke="#cbd5e1" stroke-width="2"/>' +
        '<line x1="245" y1="258" x2="245" y2="274" stroke="#cbd5e1" stroke-width="2"/>' +
        '<line x1="285" y1="258" x2="285" y2="274" stroke="#cbd5e1" stroke-width="2"/>' +
        '<line x1="325" y1="258" x2="325" y2="274" stroke="#cbd5e1" stroke-width="2"/>' +
        '<line x1="365" y1="258" x2="365" y2="274" stroke="#cbd5e1" stroke-width="2"/>' +
        '<line x1="405" y1="258" x2="405" y2="274" stroke="#cbd5e1" stroke-width="2"/>' +
        // Moving Piston & Crank
        '<g class="ambient-piston-x">' +
        '<rect x="342" y="170" width="18" height="102" rx="3" fill="#475569" stroke="#e2e8f0" stroke-width="1.6"/>' +
        '<line x1="360" y1="221" x2="578" y2="221" stroke="#cbd5e1" stroke-width="5"/>' +
        '<rect x="478" y="160" width="14" height="122" rx="3" fill="#334155" stroke="#94a3b8" stroke-width="1.4"/>' +
        '<path d="M 578 221 L 578 148 L 606 148" fill="none" stroke="#cbd5e1" stroke-width="5" stroke-linecap="round"/>' +
        '<rect x="598" y="136" width="22" height="24" rx="4" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5"/>' +
        '</g>' +
        // Labels
        '<polyline points="425,168 446,136 520,136" fill="none" stroke="#cbd5e1" stroke-width="1.6"/>' +
        '<text x="450" y="129" fill="#e2e8f0" font-size="13.5" font-weight="800">Xilanh</text>' +
        '<polyline points="351,170 370,138 370,115" fill="none" stroke="#f59e0b" stroke-width="1.6"/>' +
        '<text x="370" y="108" fill="#fbbf24" font-size="13.5" font-weight="800" text-anchor="middle">Pít-tông</text>' +
        '<polyline points="578,162 556,108 656,108" fill="none" stroke="#38bdf8" stroke-width="1.6"/>' +
        '<text x="606" y="100" fill="#7dd3fc" font-size="13.5" font-weight="800" text-anchor="middle">Tay quay</text>' +
        '</svg>';
      return '<div class="vlxt-visual-container centered"><div class="vlxt-stage-wrap">' +
        captionHtml('fa-solid fa-gauge', this.caption) + svg + '</div></div>';
    }
  },

  'MH-C2-28': {
    id: 'MH-C2-28',
    title: 'Thí nghiệm khảo sát áp suất p theo nhiệt độ tuyệt đối T',
    topic: 'DS-C2.1',
    layout: 'single',
    caption: 'Thí nghiệm đẳng tích: Bình thủy tinh chứa 1 lít khí nối với áp kế và nhiệt kế',
    alt: 'Bình cầu thủy tinh chứa 1 lít khí nhúng trong chậu nước đun nóng, cắm nhiệt kế và nối ống dẫn sang áp kế',
    build: function (u) {
      var svg =
        '<svg viewBox="0 0 680 350" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<defs><linearGradient id="' + u + 'wb" x1="0%" y1="0%" x2="0%" y2="100%">' +
        '<stop offset="0%" stop-color="rgba(56,189,248,0.28)"/><stop offset="100%" stop-color="rgba(14,116,144,0.55)"/>' +
        '</linearGradient></defs>' +
        '<rect x="16" y="16" width="648" height="318" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Tripod + Burner
        '<line x1="118" y1="264" x2="366" y2="264" stroke="#64748b" stroke-width="5"/>' +
        '<line x1="142" y1="266" x2="120" y2="318" stroke="#64748b" stroke-width="5"/>' +
        '<line x1="342" y1="266" x2="364" y2="318" stroke="#64748b" stroke-width="5"/>' +
        '<rect x="226" y="286" width="32" height="32" rx="3" fill="#475569"/>' +
        '<path d="M 242 264 C 230 278 232 288 242 288 C 252 288 254 278 242 264 Z" fill="#38bdf8" class="ambient-heat-arrow"/>' +
        '<path d="M 242 271 C 236 280 237 286 242 286 C 247 286 248 280 242 271 Z" fill="#f59e0b" class="ambient-heat-arrow"/>' +
        // Water beaker
        '<path d="M 136 122 L 146 260 L 338 260 L 348 122" fill="none" stroke="#94a3b8" stroke-width="3"/>' +
        '<rect x="147" y="138" width="190" height="121" rx="4" fill="url(#' + u + 'wb)" class="ambient-water-wave"/>' +
        // Glass sphere flask (V = 1 lít)
        '<rect x="234" y="88" width="28" height="38" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>' +
        '<rect x="236" y="86" width="24" height="14" rx="2" fill="#d97706"/>' +
        '<circle cx="248" cy="186" r="58" fill="rgba(15,23,42,0.72)" stroke="#7dd3fc" stroke-width="2.5"/>' +
        '<g class="ambient-gas-a"><circle cx="230" cy="176" r="3.5" fill="#fbbf24"/><circle cx="268" cy="198" r="3.5" fill="#fbbf24"/></g>' +
        '<g class="ambient-gas-b"><circle cx="262" cy="168" r="3.5" fill="#38bdf8"/><circle cx="234" cy="204" r="3.5" fill="#38bdf8"/></g>' +
        '<text x="248" y="191" fill="#e2e8f0" font-size="13.5" font-weight="800" text-anchor="middle">Khí (1 lít)</text>' +
        // Thermometer inside water
        '<rect x="164" y="54" width="12" height="175" rx="6" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>' +
        '<rect x="167" y="92" width="6" height="130" fill="#ef4444"/>' +
        '<circle cx="170" cy="226" r="8" fill="#ef4444"/>' +
        // Pipe to Pressure Gauge
        '<path d="M 248 86 L 248 56 L 444 56 L 444 214 L 510 214" fill="none" stroke="#94a3b8" stroke-width="8" stroke-linejoin="round"/>' +
        '<path d="M 248 86 L 248 56 L 444 56 L 444 214 L 510 214" fill="none" stroke="#0f172a" stroke-width="3.5" stroke-linejoin="round"/>' +
        // Gauge stand & dial
        '<rect x="492" y="250" width="76" height="14" rx="3" fill="#475569"/>' +
        '<rect x="523" y="194" width="14" height="56" fill="#64748b"/>' +
        '<circle cx="530" cy="150" r="44" fill="#f8fafc" stroke="#38bdf8" stroke-width="3"/>' +
        '<circle cx="530" cy="150" r="35" fill="#0f172a" stroke="#475569" stroke-width="1.5"/>' +
        '<line x1="530" y1="150" x2="508" y2="128" stroke="#f59e0b" stroke-width="2.8" stroke-linecap="round" class="ambient-needle"/>' +
        '<circle cx="530" cy="150" r="4.5" fill="#e2e8f0"/>' +
        // Clean labels & leaders
        '<polyline points="164,66 132,48 92,48" fill="none" stroke="#fca5a5" stroke-width="1.6"/>' +
        '<text x="86" y="52" fill="#fca5a5" font-size="13.5" font-weight="800" text-anchor="end">Nhiệt kế</text>' +
        '<polyline points="145,178 96,178" fill="none" stroke="#38bdf8" stroke-width="1.6"/>' +
        '<text x="88" y="182" fill="#7dd3fc" font-size="13.5" font-weight="800" text-anchor="end">Nước</text>' +
        '<text x="530" y="92" fill="#fbbf24" font-size="14" font-weight="800" text-anchor="middle">Áp kế</text>' +
        '<text x="530" y="294" fill="#94a3b8" font-size="13" text-anchor="middle">Nút cao su bịt kín (V = const)</text>' +
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
    alt: 'Bình tam giác chứa khí ngâm trong nước đun nóng nối với áp kế, phía trên cắm thiết bị (1) và trong nước cắm thiết bị (2)',
    build: function (u) {
      // IMPORTANT: Do NOT write "xilanh" on (1) or "nhiệt kế" on (2) because Statement d tests this!
      var svg =
        '<svg viewBox="0 0 680 360" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="16" y="16" width="648" height="328" rx="12" fill="#070d1c" stroke="#1e293b" stroke-width="1.5"/>' +
        // Water tank
        '<path d="M 150 202 L 150 318 L 530 318 L 530 202" fill="none" stroke="#94a3b8" stroke-width="3"/>' +
        '<rect x="153" y="220" width="374" height="95" fill="rgba(14,165,233,0.3)" class="ambient-water-wave"/>' +
        '<text x="340" y="298" fill="#fca5a5" font-size="14.5" font-weight="800" text-anchor="middle">Nước đun nóng</text>' +
        // Erlenmeyer flask
        '<path d="M 318 164 L 318 206 L 268 274 Q 262 284 276 284 L 404 284 Q 418 284 412 274 L 362 206 L 362 164" fill="rgba(15,23,42,0.7)" stroke="#e2e8f0" stroke-width="2.5"/>' +
        '<rect x="314" y="150" width="52" height="18" rx="3" fill="#334155" stroke="#94a3b8" stroke-width="1.5"/>' +
        '<g class="ambient-gas-a"><circle cx="322" cy="245" r="3.5" fill="#fbbf24"/><circle cx="356" cy="260" r="3.5" fill="#38bdf8"/></g>' +
        '<g class="ambient-gas-b"><circle cx="352" cy="236" r="3.5" fill="#fbbf24"/><circle cx="315" cy="264" r="3.5" fill="#38bdf8"/></g>' +
        // Part (1) mounted on stopper (syringe with plunger)
        '<rect x="330" y="58" width="20" height="92" rx="2" fill="rgba(248,250,252,0.12)" stroke="#e2e8f0" stroke-width="2"/>' +
        '<rect x="323" y="54" width="34" height="5" rx="2" fill="#cbd5e1"/>' +
        '<rect x="331" y="102" width="18" height="10" fill="#ef4444"/>' +
        '<line x1="340" y1="34" x2="340" y2="102" stroke="#cbd5e1" stroke-width="3"/>' +
        '<rect x="326" y="30" width="28" height="6" rx="2" fill="#94a3b8"/>' +
        // Badge (1)
        '<polyline points="350,82 396,50 420,50" fill="none" stroke="#10b981" stroke-width="2"/>' +
        '<circle cx="436" cy="50" r="16" fill="#064e3b" stroke="#10b981" stroke-width="2.2"/>' +
        '<text x="436" y="55" fill="#6ee7b7" font-size="15" font-weight="800" text-anchor="middle">1</text>' +
        // Part (2) dipped in water tank (thermometer)
        '<rect x="466" y="128" width="14" height="145" rx="7" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>' +
        '<rect x="470" y="162" width="6" height="104" fill="#ef4444"/>' +
        '<circle cx="473" cy="268" r="7" fill="#ef4444"/>' +
        '<polyline points="480,154 522,126 544,126" fill="none" stroke="#10b981" stroke-width="2"/>' +
        '<circle cx="560" cy="126" r="16" fill="#064e3b" stroke="#10b981" stroke-width="2.2"/>' +
        '<text x="560" y="131" fill="#6ee7b7" font-size="15" font-weight="800" text-anchor="middle">2</text>' +
        // Pressure gauge on left
        '<path d="M 304 196 L 210 196 L 210 156" fill="none" stroke="#94a3b8" stroke-width="6" stroke-linejoin="round"/>' +
        '<circle cx="210" cy="120" r="36" fill="#f8fafc" stroke="#38bdf8" stroke-width="2.6"/>' +
        '<circle cx="210" cy="120" r="28" fill="#0f172a" stroke="#475569" stroke-width="1.4"/>' +
        '<line x1="210" y1="120" x2="225" y2="104" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" class="ambient-needle"/>' +
        '<circle cx="210" cy="120" r="4" fill="#e2e8f0"/>' +
        '<polyline points="184,96 154,72 86,72" fill="none" stroke="#fbbf24" stroke-width="1.8"/>' +
        '<text x="80" y="76" fill="#fbbf24" font-size="14" font-weight="800" text-anchor="end">Áp kế</text>' +
        // Callout to Binh chua khi
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
            var prev = slot.getAttribute('data-vlxt-mounted');
            if (prev === mid && slot.querySelector('svg')) continue;
            slot.innerHTML = render(mid, opts);
            slot.setAttribute('data-vlxt-mounted', mid);
            mounted += 1;
        }
        return mounted;
    }

    var api = {
        version: VERSION,
        has: has,
        get: get,
        listIds: listIds,
        render: render,
        getSvgString: getSvgString,
        mountAll: mountAll,
        ensureStyles: ensureStyles
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }
    global.VLXTModels = api;
})(typeof window !== 'undefined' ? window : globalThis);
