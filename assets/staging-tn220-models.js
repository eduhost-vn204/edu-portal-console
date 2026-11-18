/**
 * VLXT 60 FPS Bespoke Physics Canvas Models — Staging Package 220 (MH-TN220-*)
 * Architecture: Self-contained 780x305 Retina-ready Canvas 2D functions
 * Rules: Flat sharp EdTech palette (no glow blur), Zero answer leakage
 */
(function () {
    'use strict';
    if (!window.VLXTModels || typeof window.VLXTModels.register !== 'function') {
        console.warn('[VLXT staging-tn220-models] window.VLXTModels not initialized.');
        return;
    }

    // 1. MH-TN220-C1-01 — Đun nóng khí trong ống nghiệm đậy nút kín (LT699 #168)
    window.VLXTModels.register('MH-TN220-C1-01', function (ctx, w, h, t) {
        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, '#060b19'); bg.addColorStop(1, '#0a1226');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = 'rgba(148,163,184,0.06)'; ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 26) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
        for (let y = 0; y < h; y += 26) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

        const phase = (t * 0.28) % 1;
        function drawSetup(cx, popped) {
            ctx.fillStyle = 'rgba(13,23,44,0.85)';
            ctx.strokeStyle = 'rgba(56,189,248,0.22)';
            ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.roundRect(cx - 170, 14, 340, h - 28, 10); ctx.fill(); ctx.stroke();

            // Giá đỡ thí nghiệm
            ctx.fillStyle = '#475569';
            ctx.fillRect(cx - 125, h - 42, 110, 7);
            ctx.fillRect(cx - 88, 52, 7, h - 94);
            ctx.fillStyle = '#64748b';
            ctx.fillRect(cx - 94, 96, 20, 14);
            ctx.fillRect(cx - 82, 100, 96, 6);
            ctx.fillStyle = '#334155';
            ctx.fillRect(cx + 8, 95, 22, 16);

            // Đèn cồn & ngọn lửa
            const bx = cx + 19, by = h - 42;
            ctx.fillStyle = '#38bdf8';
            ctx.globalAlpha = 0.25;
            ctx.beginPath(); ctx.arc(bx, by - 14, 18, Math.PI, 0); ctx.lineTo(bx + 22, by); ctx.lineTo(bx - 22, by); ctx.closePath(); ctx.fill();
            ctx.globalAlpha = 1;
            ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.5; ctx.stroke();
            ctx.fillStyle = '#64748b'; ctx.fillRect(bx - 5, by - 36, 10, 8);
            const flicker = Math.sin(t * 14) * 2.5;
            ctx.fillStyle = '#f97316';
            ctx.beginPath(); ctx.moveTo(bx, by - 66 + flicker); ctx.quadraticCurveTo(bx + 11, by - 48, bx, by - 36); ctx.quadraticCurveTo(bx - 11, by - 48, bx, by - 66 + flicker); ctx.fill();
            ctx.fillStyle = '#fde047';
            ctx.beginPath(); ctx.moveTo(bx, by - 55 + flicker * 0.6); ctx.quadraticCurveTo(bx + 5, by - 44, bx, by - 37); ctx.quadraticCurveTo(bx - 5, by - 44, bx, by - 55 + flicker * 0.6); ctx.fill();

            // Ống nghiệm + chất lỏng
            const tx = cx + 7, ty = 64, tw = 24, th = 122;
            ctx.fillStyle = 'rgba(56,189,248,0.34)';
            ctx.fillRect(tx + 2, ty + 62, tw - 4, th - 70);
            ctx.beginPath(); ctx.arc(bx, ty + th - 10, tw / 2 - 2, 0, Math.PI); ctx.fill();
            ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.moveTo(tx - 3, ty); ctx.lineTo(tx, ty + 6); ctx.lineTo(tx, ty + th - 10);
            ctx.arc(bx, ty + th - 10, tw / 2, Math.PI, 0, true);
            ctx.lineTo(tx + tw, ty + 6); ctx.lineTo(tx + tw + 3, ty);
            ctx.stroke();

            if (!popped) {
                const vib = Math.sin(t * 24) * 0.8;
                ctx.fillStyle = '#fb7185';
                ctx.beginPath();
                ctx.moveTo(tx + 1, ty - 10 + vib); ctx.lineTo(tx + tw - 1, ty - 10 + vib);
                ctx.lineTo(tx + tw - 4, ty + 8 + vib); ctx.lineTo(tx + 4, ty + 8 + vib); ctx.closePath();
                ctx.fill();
                ctx.fillStyle = '#94a3b8'; ctx.font = '700 13px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'center';
                ctx.fillText('a) Hơ nóng ống nghiệm có nút kín', cx, h - 22);
            } else {
                const jumpY = phase < 0.72 ? (phase / 0.72) * 34 : 34;
                const corkAlpha = phase < 0.88 ? 1 : (1 - phase) / 0.12;
                ctx.globalAlpha = Math.max(0, corkAlpha);
                ctx.fillStyle = '#fbbf24';
                const cy = ty - 16 - jumpY;
                ctx.beginPath();
                ctx.moveTo(tx, cy); ctx.lineTo(tx + tw, cy);
                ctx.lineTo(tx + tw - 3, cy + 16); ctx.lineTo(tx + 3, cy + 16); ctx.closePath();
                ctx.fill();
                // Hơi khí bốc lên
                ctx.fillStyle = 'rgba(226,232,240,0.45)';
                for (let k = 0; k < 3; k++) {
                    const p2 = (phase + k * 0.25) % 1;
                    ctx.globalAlpha = (1 - p2) * 0.6;
                    ctx.beginPath(); ctx.arc(bx + (k - 1) * 7, ty - 6 - p2 * 36, 5 + p2 * 6, 0, Math.PI * 2); ctx.fill();
                }
                ctx.globalAlpha = 1;
                ctx.fillStyle = '#f8fafc'; ctx.font = '700 13px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'center';
                ctx.fillText('b) Nút bị đẩy bật ra ngoài', cx, h - 22);
            }
        }
        drawSetup(195, false);
        drawSetup(585, true);
        ctx.fillStyle = '#38bdf8'; ctx.font = '800 13px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('THÍ NGHIỆM HƠ NÓNG CHẤT KHÍ TRONG ỐNG NGHIỆM', w / 2, 34);
    });

    // 2. MH-TN220-C1-02 — Thả quả cầu kim loại vào nước nóng (LT699 #254)
    window.VLXTModels.register('MH-TN220-C1-02', function (ctx, w, h, t) {
        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, '#060b19'); bg.addColorStop(1, '#0a1226');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = 'rgba(148,163,184,0.06)'; ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 26) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }

        const phase = (t * 0.26) % 1;
        function drawPanel(cx, submerged, title) {
            ctx.fillStyle = 'rgba(13,23,44,0.85)';
            ctx.strokeStyle = 'rgba(56,189,248,0.22)'; ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.roundRect(cx - 172, 16, 344, h - 32, 10); ctx.fill(); ctx.stroke();

            // Giá kẹp nhiệt kế
            ctx.fillStyle = '#475569';
            ctx.fillRect(cx - 135, h - 42, 230, 6);
            ctx.fillRect(cx + 80, 44, 7, h - 86);
            ctx.fillStyle = '#64748b';
            ctx.fillRect(cx - 10, 74, 96, 6);
            ctx.fillRect(cx + 75, 70, 16, 14);

            // Cốc thủy tinh hở miệng chứa nước nóng
            const gx = cx - 80, gy = 118, gw = 108, gh = 140;
            const waterH = submerged ? 96 : 74;
            ctx.fillStyle = submerged ? 'rgba(56,189,248,0.34)' : 'rgba(251,113,133,0.32)';
            ctx.fillRect(gx + 3, gy + gh - waterH, gw - 6, waterH - 2);
            ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(gx - 8, gy - 6); ctx.lineTo(gx, gy); ctx.lineTo(gx, gy + gh);
            ctx.lineTo(gx + gw, gy + gh); ctx.lineTo(gx + gw, gy);
            ctx.stroke();

            // Nhiệt kế
            const kx = cx + 8, ky = 56, kh = 180;
            ctx.fillStyle = '#1e293b'; ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1.4;
            ctx.beginPath(); ctx.roundRect(kx - 5, ky, 10, kh, 5); ctx.fill(); ctx.stroke();
            const mercTop = submerged ? ky + 48 : ky + 28;
            ctx.fillStyle = '#f43f5e';
            ctx.fillRect(kx - 2, mercTop, 4, kh - (mercTop - ky) - 4);
            ctx.beginPath(); ctx.arc(kx, ky + kh - 3, 7, 0, Math.PI * 2); ctx.fill();

            // Quả cầu kim loại
            const sx = submerged ? gx + 34 : gx - 34;
            const sy = gy + gh - 20;
            const sg = ctx.createRadialGradient(sx - 6, sy - 6, 3, sx, sy, 20);
            sg.addColorStop(0, submerged ? '#fbbf24' : '#e2e8f0');
            sg.addColorStop(1, submerged ? '#b45309' : '#475569');
            ctx.fillStyle = sg;
            ctx.beginPath(); ctx.arc(sx, sy, 20, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1.2; ctx.stroke();

            if (submerged) {
                // Mũi tên truyền nhiệt nhẹ vào quả cầu
                ctx.strokeStyle = 'rgba(251,191,36,' + (0.45 + 0.45 * Math.sin(t * 5)) + ')';
                ctx.lineWidth = 1.8;
                [-1, 1].forEach(d => {
                    ctx.beginPath(); ctx.moveTo(sx + d * 32, sy - 14); ctx.lineTo(sx + d * 23, sy - 8); ctx.stroke();
                });
            }
            ctx.fillStyle = '#e2e8f0'; ctx.font = '700 12.5px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(title, cx, h - 22);
        }
        drawPanel(195, false, 'Ban đầu: Quả cầu ở ngoài cốc nước nóng');
        drawPanel(585, true, 'Cân bằng nhiệt: Quả cầu nằm trong cốc');
    });

    // 3. MH-TN220-C1-03 — Quả bóng bàn bị móp thả vào nước nóng (LT699 #279)
    window.VLXTModels.register('MH-TN220-C1-03', function (ctx, w, h, t) {
        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, '#060b19'); bg.addColorStop(1, '#0a1226');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = 'rgba(148,163,184,0.06)'; ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 26) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }

        const phase = (t * 0.30) % 1;
        // Panel a) Bóng móp
        ctx.fillStyle = 'rgba(13,23,44,0.86)'; ctx.strokeStyle = 'rgba(56,189,248,0.22)'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.roundRect(38, 26, 300, 250, 12); ctx.fill(); ctx.stroke();
        const bx1 = 188, by1 = 152, r = 52;
        ctx.fillStyle = '#f1f5f9'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(bx1, by1, r, -Math.PI * 0.25, Math.PI * 1.25);
        ctx.quadraticCurveTo(bx1, by1 - 8, bx1 + r * Math.cos(-Math.PI * 0.25), by1 + r * Math.sin(-Math.PI * 0.25));
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = 'rgba(15,23,42,0.18)';
        ctx.beginPath(); ctx.ellipse(bx1, by1 - 24, 24, 10, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#cbd5e1'; ctx.font = '700 13px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('a) Quả bóng bàn bị móp', bx1, 258);

        // Mũi tên chuyển tiếp
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(352, 165); ctx.quadraticCurveTo(390, 185, 424, 165); ctx.stroke();
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath(); ctx.moveTo(432, 160); ctx.lineTo(416, 158); ctx.lineTo(422, 173); ctx.closePath(); ctx.fill();

        // Panel b) Cốc nước nóng hở miệng + bóng phồng dần
        ctx.fillStyle = 'rgba(13,23,44,0.86)'; ctx.strokeStyle = 'rgba(56,189,248,0.22)'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.roundRect(442, 26, 300, 250, 12); ctx.fill(); ctx.stroke();
        const cx2 = 592, cupTop = 108, cupBot = 228;
        // Quai cốc
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.arc(cx2 + 62, 166, 20, -Math.PI / 2, Math.PI / 2); ctx.stroke();
        // Nước nóng trong cốc
        ctx.fillStyle = 'rgba(251,113,133,0.30)';
        ctx.fillRect(cx2 - 58, 138, 116, cupBot - 138);
        // Thành cốc hở miệng
        ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(cx2 - 62, cupTop); ctx.lineTo(cx2 - 56, cupBot); ctx.lineTo(cx2 + 56, cupBot); ctx.lineTo(cx2 + 62, cupTop);
        ctx.stroke();
        // Bóng bàn phồng dần theo chu kì sawtooth
        const dent = (1 - Math.min(1, phase * 1.25)) * 22;
        const bx2 = cx2, by2 = 132;
        ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(bx2, by2, 34, -Math.PI * 0.25, Math.PI * 1.25);
        ctx.quadraticCurveTo(bx2, by2 - 34 + dent, bx2 + 34 * Math.cos(-Math.PI * 0.25), by2 + 34 * Math.sin(-Math.PI * 0.25));
        ctx.fill(); ctx.stroke();
        // Gợn hơi ấm
        ctx.strokeStyle = 'rgba(251,146,60,0.5)'; ctx.lineWidth = 1.4;
        for (let k = -1; k <= 1; k++) {
            const dy = ((phase + k * 0.3) % 1) * 20;
            ctx.beginPath(); ctx.moveTo(cx2 + k * 24, 98 - dy); ctx.quadraticCurveTo(cx2 + k * 24 + 5, 90 - dy, cx2 + k * 24, 82 - dy); ctx.stroke();
        }
        ctx.fillStyle = '#38bdf8'; ctx.font = '700 13px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('b) Trong nước nóng: Bóng phồng trở lại', cx2, 258);
    });

    // 4. MH-TN220-C2-04 — Hai bình X (V) và Y (4V) nối qua khóa S (VNA-C2 #284)
    window.VLXTModels.register('MH-TN220-C2-04', function (ctx, w, h, t) {
        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, '#060b19'); bg.addColorStop(1, '#0a1226');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = 'rgba(148,163,184,0.06)'; ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 26) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }

        const phase = (t * 0.16) % 1;
        const valveOpen = phase > 0.25;
        // Bình X (bên trái, thể tích V)
        const x1 = 110, y1 = 112, w1 = 135, h1 = 92;
        ctx.fillStyle = 'rgba(56,189,248,0.12)'; ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2.4;
        ctx.fillRect(x1, y1, w1, h1); ctx.strokeRect(x1, y1, w1, h1);
        // Bình Y (bên phải, thể tích 4V)
        const x2 = 385, y2 = 66, w2 = 285, h2 = 176;
        ctx.fillStyle = valveOpen ? 'rgba(56,189,248,0.07)' : 'rgba(15,23,42,0.75)';
        ctx.fillRect(x2, y2, w2, h2); ctx.strokeRect(x2, y2, w2, h2);
        // Ống nối hẹp
        ctx.fillStyle = '#0a1226';
        ctx.fillRect(x1 + w1 - 2, 146, x2 - (x1 + w1) + 4, 24);
        ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(x1 + w1, 146); ctx.lineTo(x2, 146);
        ctx.moveTo(x1 + w1, 170); ctx.lineTo(x2, 170);
        ctx.stroke();

        // Van khóa S
        const sx = (x1 + w1 + x2) / 2;
        ctx.strokeStyle = valveOpen ? '#10b981' : '#f43f5e'; ctx.lineWidth = 3.2;
        if (!valveOpen) {
            ctx.beginPath(); ctx.moveTo(sx, 128); ctx.lineTo(sx, 172); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(sx - 12, 128); ctx.lineTo(sx + 12, 128); ctx.stroke();
        } else {
            ctx.beginPath(); ctx.moveTo(sx - 12, 134); ctx.lineTo(sx + 12, 134); ctx.stroke();
        }

        // Hạt phân tử khí chuyển động nhiệt (không tiết lộ đáp số cụ thể ở Y)
        for (let i = 0; i < 18; i++) {
            const seed = i * 1.37;
            let px, py;
            if (!valveOpen) {
                px = x1 + 14 + ((Math.sin(t * 2.1 + seed) * 0.5 + 0.5) * (w1 - 28));
                py = y1 + 14 + ((Math.cos(t * 2.5 + seed * 1.4) * 0.5 + 0.5) * (h1 - 28));
            } else {
                const span = (w1 + w2 + 95);
                const raw = ((i / 18) + t * (0.14 + (i % 3) * 0.05) * (i % 2 === 0 ? 1 : -1) + 10) % 1;
                px = x1 + 12 + raw * span;
                if (px > x1 + w1 - 6 && px < x2 + 6) {
                    py = 158 + Math.sin(t * 6 + seed) * 6;
                } else if (px <= x1 + w1 - 6) {
                    py = y1 + 12 + (Math.sin(t * 2.4 + seed) * 0.5 + 0.5) * (h1 - 24);
                } else {
                    py = y2 + 14 + (Math.sin(t * 2.2 + seed) * 0.5 + 0.5) * (h2 - 28);
                }
            }
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath(); ctx.arc(px, py, 3.2, 0, Math.PI * 2); ctx.fill();
        }

        ctx.fillStyle = '#f8fafc'; ctx.font = '800 16px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('X', x1 + w1 / 2, y1 - 14);
        ctx.fillText('Y', x2 + w2 / 2, y2 - 14);
        ctx.fillText('V', x1 + w1 / 2, y1 + h1 / 2 + 5);
        ctx.fillText('4V', x2 + w2 / 2, y2 + h2 / 2 + 5);
        ctx.fillStyle = valveOpen ? '#10b981' : '#f43f5e';
        ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(valveOpen ? 'S (Đã mở)' : 'S (Đóng)', sx, 118);
        ctx.fillStyle = '#94a3b8'; ctx.font = '600 12.5px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('Ban đầu: p(X) = 400 kPa, bình Y chân không', w / 2, h - 18);
    });

    // 5. MH-TN220-C2-05 — Đồ thị đẳng nhiệt OABC & ODEF (VNA-C2 #410)
    window.VLXTModels.register('MH-TN220-C2-05', function (ctx, w, h, t) {
        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, '#060b19'); bg.addColorStop(1, '#0a1226');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = 'rgba(148,163,184,0.06)'; ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 26) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }

        const ox = 200, oy = 258, axW = 390, axH = 215;
        // Hai hình chữ nhật OABC và ODEF (tỉ lệ hypebol p*V = const = 14000)
        const vB = 72, pB = 14000 / vB; // 194.4
        const vE = 250, pE = 14000 / vE; // 56
        const pulse = (Math.sin(t * 2.2) + 1) * 0.5;
        ctx.fillStyle = `rgba(56,189,248,${0.08 + pulse * 0.08})`;
        ctx.fillRect(ox, oy - pB, vB, pB);
        ctx.fillStyle = `rgba(251,191,36,${0.16 - pulse * 0.08})`;
        ctx.fillRect(ox, oy - pE, vE, pE);

        // Đường nét đứt gióng
        ctx.save(); ctx.setLineDash([5, 5]); ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.4;
        ctx.strokeRect(ox, oy - pB, vB, pB);
        ctx.strokeRect(ox, oy - pE, vE, pE);
        ctx.restore();

        // Trục tọa độ
        ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.moveTo(ox, oy + 8); ctx.lineTo(ox, oy - axH); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ox - 8, oy); ctx.lineTo(ox + axW, oy); ctx.stroke();
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath(); ctx.moveTo(ox, oy - axH - 6); ctx.lineTo(ox - 5, oy - axH + 6); ctx.lineTo(ox + 5, oy - axH + 6); ctx.fill();
        ctx.beginPath(); ctx.moveTo(ox + axW + 6, oy); ctx.lineTo(ox + axW - 6, oy - 5); ctx.lineTo(ox + axW - 6, oy + 5); ctx.fill();

        // Đường hypebol pV = const
        ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 3;
        ctx.beginPath();
        for (let v = 42; v <= 345; v += 3) {
            const py = oy - 14000 / v;
            if (py < oy - axH + 12) continue;
            if (v === 42 || (14000 / (v - 3) > axH - 12)) ctx.moveTo(ox + v, py);
            else ctx.lineTo(ox + v, py);
        }
        ctx.stroke();

        // Nhãn điểm & trục
        ctx.fillStyle = '#f8fafc'; ctx.font = '700 14px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('p', ox - 10, oy - axH + 6);
        ctx.fillText('A', ox - 10, oy - pB + 5);
        ctx.fillText('D', ox - 10, oy - pE + 5);
        ctx.fillText('O', ox - 8, oy + 16);
        ctx.textAlign = 'center';
        ctx.fillText('C', ox + vB, oy + 18);
        ctx.fillText('F', ox + vE, oy + 18);
        ctx.fillText('V', ox + axW, oy + 18);
        ctx.fillText('B', ox + vB + 12, oy - pB - 8);
        ctx.fillText('E', ox + vE + 10, oy - pE - 10);

        // Chú thích S1, S2 (không lộ dấu =/< />!)
        ctx.fillStyle = '#38bdf8'; ctx.beginPath(); ctx.arc(ox + vB, oy - pB, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(ox + vE, oy - pE, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.textAlign = 'left'; ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#38bdf8'; ctx.fillText('S₁ = Diện tích OABC', 525, 92);
        ctx.fillStyle = '#fbbf24'; ctx.fillText('S₂ = Diện tích ODEF', 525, 118);
    });

    // 6. MH-TN220-C2-06 — Hai đường đẳng nhiệt T1, T2 trên đồ thị p-V (VNA-C2 #464)
    window.VLXTModels.register('MH-TN220-C2-06', function (ctx, w, h, t) {
        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, '#060b19'); bg.addColorStop(1, '#0a1226');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = 'rgba(148,163,184,0.06)'; ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 26) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }

        const ox = 205, oy = 256, axW = 370, axH = 212;
        ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.moveTo(ox, oy + 6); ctx.lineTo(ox, oy - axH); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ox - 6, oy); ctx.lineTo(ox + axW, oy); ctx.stroke();
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath(); ctx.moveTo(ox, oy - axH - 6); ctx.lineTo(ox - 5, oy - axH + 6); ctx.lineTo(ox + 5, oy - axH + 6); ctx.fill();
        ctx.beginPath(); ctx.moveTo(ox + axW + 6, oy); ctx.lineTo(ox + axW - 6, oy - 5); ctx.lineTo(ox + axW - 6, oy + 5); ctx.fill();

        function drawCurve(k, color, label) {
            ctx.strokeStyle = color; ctx.lineWidth = 3;
            ctx.beginPath();
            let started = false;
            for (let v = 35; v <= 325; v += 3) {
                const py = oy - k / v;
                if (py < oy - axH + 14) continue;
                if (!started) { ctx.moveTo(ox + v, py); started = true; }
                else ctx.lineTo(ox + v, py);
            }
            ctx.stroke();
            ctx.fillStyle = color; ctx.font = '800 15px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'left';
            ctx.fillText(label, ox + 332, oy - k / 325 + 5);
            // Hạt chuyển động dọc đường đẳng nhiệt
            const vDot = 95 + ((t * 42) % 210);
            const yDot = oy - k / vDot;
            if (yDot > oy - axH + 14) {
                ctx.fillStyle = '#ffffff';
                ctx.beginPath(); ctx.arc(ox + vDot, yDot, 4.5, 0, Math.PI * 2); ctx.fill();
            }
        }
        drawCurve(10500, '#38bdf8', 'T₁');
        drawCurve(21500, '#fbbf24', 'T₂');
        ctx.fillStyle = '#f8fafc'; ctx.font = '700 14px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'right'; ctx.fillText('p', ox - 10, oy - axH + 8); ctx.fillText('O', ox - 8, oy + 16);
        ctx.textAlign = 'center'; ctx.fillText('V', ox + axW, oy + 18);
    });

    // 7. MH-TN220-C2-07 — Quá trình biến đổi (1)-(2)-(3) trên đồ thị p-V (VNA-C2 #417)
    window.VLXTModels.register('MH-TN220-C2-07', function (ctx, w, h, t) {
        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, '#060b19'); bg.addColorStop(1, '#0a1226');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = 'rgba(148,163,184,0.06)'; ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 26) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }

        const ox = 200, oy = 256, axW = 380, axH = 212;
        const v3 = 82, v1 = 152, v2 = 305;
        const p1 = 56, p3 = 178; // p3 * v3 ≈ p1 * v2 (82*178=14596 vs 56*305=17080) -> khớp mượt

        ctx.save(); ctx.setLineDash([5, 5]); ctx.strokeStyle = 'rgba(148,163,184,0.55)'; ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(ox, oy - p3); ctx.lineTo(ox + v3, oy - p3); ctx.lineTo(ox + v3, oy);
        ctx.moveTo(ox + v1, oy - p1); ctx.lineTo(ox + v1, oy);
        ctx.moveTo(ox, oy - p1); ctx.lineTo(ox + v2, oy - p1); ctx.lineTo(ox + v2, oy);
        ctx.stroke();
        ctx.restore();

        // Trục
        ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.moveTo(ox, oy + 6); ctx.lineTo(ox, oy - axH); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ox - 6, oy); ctx.lineTo(ox + axW, oy); ctx.stroke();

        // Đoạn (1)->(2) đẳng áp
        ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(ox + v1, oy - p1); ctx.lineTo(ox + v2, oy - p1); ctx.stroke();
        // Cung hypebol (2)->(3)
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3;
        ctx.beginPath();
        const k = p3 * v3;
        for (let i = 0; i <= 40; i++) {
            const u = i / 40;
            const vv = v2 + (v3 - v2) * u;
            const pp = (p1 * v2 * (1 - u) + k * u) / vv;
            if (i === 0) ctx.moveTo(ox + vv, oy - pp); else ctx.lineTo(ox + vv, oy - pp);
        }
        ctx.stroke();

        // Chấm chạy từ (1)->(2)->(3)
        const s = (t * 0.25) % 1;
        let dx, dy;
        if (s < 0.45) {
            const u = s / 0.45;
            dx = ox + v1 + (v2 - v1) * u; dy = oy - p1;
        } else {
            const u = (s - 0.45) / 0.55;
            const vv = v2 + (v3 - v2) * u;
            const pp = (p1 * v2 * (1 - u) + k * u) / vv;
            dx = ox + vv; dy = oy - pp;
        }
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(dx, dy, 5, 0, Math.PI * 2); ctx.fill();

        [[v1, p1, '(1)', 0, -14], [v2, p1, '(2)', 8, -14], [v3, p3, '(3)', 0, -14]].forEach(([vx, px, lb, oxt, oyt]) => {
            ctx.fillStyle = '#f8fafc'; ctx.beginPath(); ctx.arc(ox + vx, oy - px, 4.5, 0, Math.PI * 2); ctx.fill();
            ctx.font = '700 13.5px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(lb, ox + vx + oxt, oy - px + oyt);
        });
        ctx.fillStyle = '#f8fafc'; ctx.font = '700 14px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'right'; ctx.fillText('p', ox - 10, oy - axH + 8); ctx.fillText('O', ox - 8, oy + 16);
        ctx.textAlign = 'center'; ctx.fillText('V', ox + axW, oy + 18);
    });

    // 8. MH-TN220-C2-08 — Chu trình (1)-(2)-(3)-(4)-(1) trên hệ P-T (VNA-C2 #449)
    window.VLXTModels.register('MH-TN220-C2-08', function (ctx, w, h, t) {
        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, '#060b19'); bg.addColorStop(1, '#0a1226');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = 'rgba(148,163,184,0.06)'; ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 26) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }

        const ox = 225, oy = 258, axW = 330, axH = 216;
        const p1 = { x: ox + 75, y: oy - 48 }, p2 = { x: ox + 215, y: oy - 138 };
        const p3 = { x: ox + 215, y: oy - 196 }, p4 = { x: ox + 75, y: oy - 196 };

        ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.moveTo(ox, oy + 6); ctx.lineTo(ox, oy - axH); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ox - 6, oy); ctx.lineTo(ox + axW, oy); ctx.stroke();

        // Đường nối kéo dài tới O
        ctx.save(); ctx.setLineDash([5, 5]); ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(p1.x, p1.y); ctx.stroke();
        ctx.restore();

        const segs = [[p1, p2], [p2, p3], [p3, p4], [p4, p1]];
        segs.forEach(([a, b]) => {
            ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.8;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, ang = Math.atan2(b.y - a.y, b.x - a.x);
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.moveTo(mx + 6 * Math.cos(ang), my + 6 * Math.sin(ang));
            ctx.lineTo(mx - 6 * Math.cos(ang - 0.55), my - 6 * Math.sin(ang - 0.55));
            ctx.lineTo(mx - 6 * Math.cos(ang + 0.55), my - 6 * Math.sin(ang + 0.55));
            ctx.closePath(); ctx.fill();
        });

        // Hạt chạy theo chu trình
        const cyc = (t * 0.25) % 1;
        const si = Math.floor(cyc * 4), u = (cyc * 4) - si;
        const [pa, pb] = segs[si];
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(pa.x + (pb.x - pa.x) * u, pa.y + (pb.y - pa.y) * u, 4.5, 0, Math.PI * 2); ctx.fill();

        [[p1, '(1)', -18, 12], [p2, '(2)', 18, 12], [p3, '(3)', 14, -10], [p4, '(4)', -16, -10]].forEach(([pt, lb, dx, dy]) => {
            ctx.fillStyle = '#38bdf8'; ctx.beginPath(); ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#f8fafc'; ctx.font = '700 13.5px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(lb, pt.x + dx, pt.y + dy);
        });
        ctx.fillStyle = '#f8fafc'; ctx.font = '700 14px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'right'; ctx.fillText('P', ox - 10, oy - axH + 8); ctx.fillText('O', ox - 8, oy + 16);
        ctx.textAlign = 'center'; ctx.fillText('T', ox + axW, oy + 18);
    });

    // 9. MH-TN220-C2-09 — 4 đồ thị Hình a,b,c,d quá trình đẳng áp (VNA-C2 #491)
    window.VLXTModels.register('MH-TN220-C2-09', function (ctx, w, h, t) {
        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, '#060b19'); bg.addColorStop(1, '#0a1226');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

        const boxes = [
            { title: 'Hình a', yL: 'p', xL: 'V', oL: 'O', fn: (ox, oy) => {
                ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(ox, oy - 74); ctx.lineTo(ox + 26, oy - 74); ctx.stroke();
                ctx.setLineDash([]); ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(ox + 26, oy - 74); ctx.lineTo(ox + 108, oy - 74); ctx.stroke();
            }},
            { title: 'Hình b', yL: 'V', xL: 't(°C)', oL: 'O', fn: (ox, oy) => {
                ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(ox - 34, oy); ctx.lineTo(ox, oy - 30); ctx.stroke();
                ctx.setLineDash([]); ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(ox, oy - 30); ctx.lineTo(ox + 75, oy - 110); ctx.stroke();
                ctx.fillStyle = '#cbd5e1'; ctx.font = '600 11px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'center';
                ctx.fillText('−273', ox - 34, oy + 16);
            }},
            { title: 'Hình c', yL: 'p', xL: 'V', oL: 'O', fn: (ox, oy) => {
                ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(ox + 56, oy); ctx.lineTo(ox + 56, oy - 34); ctx.stroke();
                ctx.setLineDash([]); ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(ox + 56, oy - 34); ctx.lineTo(ox + 56, oy - 114); ctx.stroke();
            }},
            { title: 'Hình d', yL: 'V', xL: 'T(K)', oL: 'O', fn: (ox, oy) => {
                ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + 28, oy - 30); ctx.stroke();
                ctx.setLineDash([]); ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(ox + 28, oy - 30); ctx.lineTo(ox + 95, oy - 102); ctx.stroke();
            }},
        ];
        boxes.forEach((b, idx) => {
            const bx = 22 + idx * 188, bw = 172;
            ctx.fillStyle = 'rgba(13,23,44,0.88)'; ctx.strokeStyle = 'rgba(56,189,248,0.24)'; ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.roundRect(bx, 24, bw, 256, 10); ctx.fill(); ctx.stroke();
            const ox = idx === 1 ? bx + 68 : bx + 34, oy = 214;
            ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.8;
            ctx.beginPath(); ctx.moveTo(ox, oy + 8); ctx.lineTo(ox, 62); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(idx === 1 ? bx + 12 : bx + 18, oy); ctx.lineTo(bx + bw - 16, oy); ctx.stroke();
            ctx.save(); ctx.strokeStyle = '#38bdf8'; b.fn(ox, oy); ctx.restore();
            ctx.fillStyle = '#e2e8f0'; ctx.font = '700 12px "Plus Jakarta Sans", sans-serif';
            ctx.textAlign = 'right'; ctx.fillText(b.yL, ox - 6, 68);
            ctx.textAlign = 'center'; ctx.fillText(b.oL, ox - 8, oy + 16);
            ctx.fillText(b.xL, bx + bw - 22, oy + 16);
            ctx.fillStyle = '#cbd5e1'; ctx.font = '800 14px "Plus Jakarta Sans", sans-serif';
            ctx.fillText(b.title, bx + bw / 2, 262);
        });
    });

    // 10. MH-TN220-C2-10 — 4 đồ thị Hình 1,2,3,4 quá trình đẳng áp (LT699 #59)
    window.VLXTModels.register('MH-TN220-C2-10', function (ctx, w, h, t) {
        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, '#060b19'); bg.addColorStop(1, '#0a1226');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

        const boxes = [
            { title: 'Hình 1', yL: 'V', xL: 't(°C)', fn: (ox, oy) => {
                ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(ox - 24, oy); ctx.lineTo(ox, oy - 30); ctx.stroke();
                ctx.setLineDash([]); ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(ox, oy - 30); ctx.lineTo(ox + 72, oy - 118); ctx.stroke();
                ctx.fillStyle = '#cbd5e1'; ctx.font = '700 11px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'right';
                ctx.fillText('V₀', ox - 6, oy - 28);
            }},
            { title: 'Hình 2', yL: 'p', xL: 'V', fn: (ox, oy) => {
                ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(ox, oy - 78); ctx.lineTo(ox + 96, oy - 78); ctx.stroke();
            }},
            { title: 'Hình 3', yL: 'p', xL: 'V', fn: (ox, oy) => {
                ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(ox + 68, oy); ctx.lineTo(ox + 68, oy - 114); ctx.stroke();
            }},
            { title: 'Hình 4', yL: 'V', xL: 'T(K)', fn: (ox, oy) => {
                ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + 26, oy - 28); ctx.stroke();
                ctx.setLineDash([]); ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(ox + 26, oy - 28); ctx.lineTo(ox + 92, oy - 102); ctx.stroke();
            }},
        ];
        boxes.forEach((b, idx) => {
            const bx = 22 + idx * 188, bw = 172;
            ctx.fillStyle = 'rgba(13,23,44,0.88)'; ctx.strokeStyle = 'rgba(56,189,248,0.24)'; ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.roundRect(bx, 24, bw, 256, 10); ctx.fill(); ctx.stroke();
            const ox = idx === 0 ? bx + 54 : bx + 34, oy = 214;
            ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.8;
            ctx.beginPath(); ctx.moveTo(ox, oy + 8); ctx.lineTo(ox, 62); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(bx + 18, oy); ctx.lineTo(bx + bw - 16, oy); ctx.stroke();
            ctx.save(); ctx.strokeStyle = '#38bdf8'; b.fn(ox, oy); ctx.restore();
            ctx.fillStyle = '#e2e8f0'; ctx.font = '700 12px "Plus Jakarta Sans", sans-serif';
            ctx.textAlign = 'right'; ctx.fillText(b.yL, ox - 6, 68);
            ctx.textAlign = 'center'; ctx.fillText('O', ox - 8, oy + 16);
            ctx.fillText(b.xL, bx + bw - 22, oy + 16);
            ctx.fillStyle = '#cbd5e1'; ctx.font = '800 14px "Plus Jakarta Sans", sans-serif';
            ctx.fillText(b.title, bx + bw / 2, 262);
        });
    });

    // 11. MH-TN220-C2-11 — Chu trình ABCA trên hệ p-V (VNA-C2 #382)
    window.VLXTModels.register('MH-TN220-C2-11', function (ctx, w, h, t) {
        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, '#060b19'); bg.addColorStop(1, '#0a1226');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = 'rgba(148,163,184,0.06)'; ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 26) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }

        const ox = 220, oy = 256, axW = 340, axH = 214;
        const vB = 78, vA = 248, pA = 56, k = pA * vA; // pB = 13888 / 78 = 178.05
        const pB = k / vB;

        ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.moveTo(ox, oy + 6); ctx.lineTo(ox, oy - axH); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ox - 6, oy); ctx.lineTo(ox + axW, oy); ctx.stroke();
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath(); ctx.moveTo(ox, oy - axH - 6); ctx.lineTo(ox - 5, oy - axH + 6); ctx.lineTo(ox + 5, oy - axH + 6); ctx.fill();
        ctx.beginPath(); ctx.moveTo(ox + axW + 6, oy); ctx.lineTo(ox + axW - 6, oy - 5); ctx.lineTo(ox + axW - 6, oy + 5); ctx.fill();

        // Hypebol A -> B + mũi tên chỉ chiều
        ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 3;
        ctx.beginPath();
        for (let i = 0; i <= 40; i++) {
            const v = vA + (vB - vA) * (i / 40), p = k / v;
            if (i === 0) ctx.moveTo(ox + v, oy - p); else ctx.lineTo(ox + v, oy - p);
        }
        ctx.stroke();
        const vm = (vA + vB) * 0.48, pm = k / vm, angAB = Math.atan2(-(k / (vm - 4) - k / (vm + 4)), -8);
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(ox + vm + 7 * Math.cos(angAB), oy - pm + 7 * Math.sin(angAB));
        ctx.lineTo(ox + vm - 6 * Math.cos(angAB - 0.55), oy - pm - 6 * Math.sin(angAB - 0.55));
        ctx.lineTo(ox + vm - 6 * Math.cos(angAB + 0.55), oy - pm - 6 * Math.sin(angAB + 0.55));
        ctx.closePath(); ctx.fill();

        // Đẳng áp B -> C + mũi tên phải
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(ox + vB, oy - pB); ctx.lineTo(ox + vA, oy - pB); ctx.stroke();
        const midBC = ox + (vB + vA) / 2;
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath(); ctx.moveTo(midBC + 7, oy - pB); ctx.lineTo(midBC - 5, oy - pB - 5.5); ctx.lineTo(midBC - 5, oy - pB + 5.5); ctx.closePath(); ctx.fill();

        // Đẳng tích C -> A + mũi tên xuống
        ctx.strokeStyle = '#10b981'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(ox + vA, oy - pB); ctx.lineTo(ox + vA, oy - pA); ctx.stroke();
        const midCA = oy - (pB + pA) / 2;
        ctx.fillStyle = '#10b981';
        ctx.beginPath(); ctx.moveTo(ox + vA, midCA + 7); ctx.lineTo(ox + vA - 5.5, midCA - 5); ctx.lineTo(ox + vA + 5.5, midCA - 5); ctx.closePath(); ctx.fill();

        // Hạt chuyển động theo chu trình A -> B -> C -> A
        const s = (t * 0.25) % 1;
        let dx, dy;
        if (s < 0.34) {
            const u = s / 0.34, v = vA + (vB - vA) * u;
            dx = ox + v; dy = oy - k / v;
        } else if (s < 0.67) {
            const u = (s - 0.34) / 0.33;
            dx = ox + vB + (vA - vB) * u; dy = oy - pB;
        } else {
            const u = (s - 0.67) / 0.33;
            dx = ox + vA; dy = oy - (pB + (pA - pB) * u);
        }
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(dx, dy, 5, 0, Math.PI * 2); ctx.fill();

        [[vA, pA, 'A', 12, 16], [vB, pB, 'B', -16, -6], [vA, pB, 'C', 14, -6]].forEach(([vx, px, lb, dtx, dty]) => {
            ctx.fillStyle = '#f8fafc'; ctx.beginPath(); ctx.arc(ox + vx, oy - px, 4.2, 0, Math.PI * 2); ctx.fill();
            ctx.font = '800 15px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(lb, ox + vx + dtx, oy - px + dty);
        });
        ctx.fillStyle = '#f8fafc'; ctx.font = '700 14px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'right'; ctx.fillText('p', ox - 10, oy - axH + 8); ctx.fillText('O', ox - 8, oy + 16);
        ctx.textAlign = 'center'; ctx.fillText('V', ox + axW, oy + 18);
    });

    // 12. MH-TN220-C2-12 — Chu trình (1)-(2)-(3)-(4)-(1) trên hệ V-T (LT699 #389)
    window.VLXTModels.register('MH-TN220-C2-12', function (ctx, w, h, t) {
        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, '#060b19'); bg.addColorStop(1, '#0a1226');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = 'rgba(148,163,184,0.06)'; ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 26) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }

        const ox = 165, oy = 250, axW = 480, axH = 205;
        const p1 = { x: ox + 100, y: oy - 65 }, p2 = { x: ox + 210, y: oy - 65 };
        const p3 = { x: ox + 420, y: oy - 130 }, p4 = { x: ox + 200, y: oy - 130 };

        ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.moveTo(ox, oy + 6); ctx.lineTo(ox, oy - axH); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ox - 6, oy); ctx.lineTo(ox + axW, oy); ctx.stroke();

        ctx.save(); ctx.setLineDash([5, 5]); ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(ox, oy); ctx.lineTo(p1.x, p1.y);
        ctx.moveTo(ox, oy); ctx.lineTo(p2.x, p2.y);
        ctx.stroke(); ctx.restore();

        const segs = [[p1, p2], [p2, p3], [p3, p4], [p4, p1]];
        segs.forEach(([a, b]) => {
            ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.8;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, ang = Math.atan2(b.y - a.y, b.x - a.x);
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.moveTo(mx + 6 * Math.cos(ang), my + 6 * Math.sin(ang));
            ctx.lineTo(mx - 6 * Math.cos(ang - 0.55), my - 6 * Math.sin(ang - 0.55));
            ctx.lineTo(mx - 6 * Math.cos(ang + 0.55), my - 6 * Math.sin(ang + 0.55));
            ctx.closePath(); ctx.fill();
        });

        const cyc = (t * 0.25) % 1;
        const si = Math.floor(cyc * 4), u = (cyc * 4) - si;
        const [pa, pb] = segs[si];
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(pa.x + (pb.x - pa.x) * u, pa.y + (pb.y - pa.y) * u, 4.5, 0, Math.PI * 2); ctx.fill();

        [[p1, '(1)', -18, 5], [p2, '(2)', 8, 18], [p3, '(3)', 18, 5], [p4, '(4)', -8, -14]].forEach(([pt, lb, dx, dy]) => {
            ctx.fillStyle = '#38bdf8'; ctx.beginPath(); ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#f8fafc'; ctx.font = '700 13px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(lb, pt.x + dx, pt.y + dy);
        });
        ctx.fillStyle = '#f8fafc'; ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'left'; ctx.fillText('Trục thể tích (V)', ox + 10, oy - axH + 10);
        ctx.textAlign = 'right'; ctx.fillText('O', ox - 8, oy + 16);
        ctx.textAlign = 'center'; ctx.fillText('Trục nhiệt độ tuyệt đối (T)', ox + axW - 60, oy + 22);
    });

    // 13. MH-TN220-C3-13 — Ống dây lõi sắt non và vectơ B tại Z (VNA-C3 #558)
    window.VLXTModels.register('MH-TN220-C3-13', function (ctx, w, h, t) {
        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, '#060b19'); bg.addColorStop(1, '#0a1226');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = 'rgba(148,163,184,0.06)'; ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 26) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }

        const cx = 365, cy = 175, cw = 270, ch = 84;
        // Điểm Z và mũi tên sang phải phía trên ống dây
        const zx = cx - 42, zy = 76;
        ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(zx, zy, 5, 0, Math.PI * 2); ctx.fill();
        ctx.font = '800 15px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'right';
        ctx.fillText('Z', zx - 10, zy + 5);
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(zx + 8, zy); ctx.lineTo(zx + 96, zy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(zx + 102, zy); ctx.lineTo(zx + 88, zy - 7); ctx.lineTo(zx + 88, zy + 7); ctx.closePath(); ctx.fill();

        // Lõi sắt non
        ctx.fillStyle = '#1e293b'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.roundRect(cx - cw / 2, cy - ch / 2, cw, ch, 8); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.ellipse(cx + cw / 2, cy, 14, ch / 2, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        // Các vòng dây quấn quanh lõi (P đi lên mặt trước, Q xuống từ mặt sau)
        ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 3;
        const turns = 7, x0 = cx - cw / 2 + 28, step = 30;
        for (let i = 0; i < turns; i++) {
            const x = x0 + i * step;
            ctx.beginPath();
            ctx.moveTo(x, cy + ch / 2 + 8);
            ctx.bezierCurveTo(x - 6, cy + 10, x - 4, cy - ch / 2 - 14, x + step * 0.45, cy - ch / 2 - 12);
            ctx.stroke();
        }
        // Đầu dây P và Q (không vẽ mũi tên chiều dòng điện để tránh lộ đáp án!)
        ctx.beginPath(); ctx.moveTo(x0, cy + ch / 2 + 8); ctx.lineTo(x0, cy + ch / 2 + 46); ctx.stroke();
        const qx = x0 + (turns - 1) * step + 18;
        ctx.beginPath(); ctx.moveTo(qx, cy + ch / 2); ctx.lineTo(qx, cy + ch / 2 + 46); ctx.stroke();

        ctx.fillStyle = '#f8fafc'; ctx.font = '800 15px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('P', x0 - 14, cy + ch / 2 + 44);
        ctx.fillText('Q', qx + 14, cy + ch / 2 + 44);
        ctx.fillText('X', cx - cw / 2 - 22, cy + 5);
        ctx.fillText('Y', cx + cw / 2 + 28, cy + 5);

        ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(cx + cw / 2 + 2, cy + 4); ctx.lineTo(cx + cw / 2 + 56, cy + 38); ctx.stroke();
        ctx.fillStyle = '#94a3b8'; ctx.font = '700 13px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'left';
        ctx.fillText('Lõi sắt non', cx + cw / 2 + 60, cy + 43);
    });

    // 14. MH-TN220-C3-14 — Thanh nam châm AB và kim nam châm treo (VNA-C3 #656)
    window.VLXTModels.register('MH-TN220-C3-14', function (ctx, w, h, t) {
        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, '#060b19'); bg.addColorStop(1, '#0a1226');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = 'rgba(148,163,184,0.06)'; ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 26) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }

        // Giá treo ngang
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(420, 44); ctx.lineTo(610, 44); ctx.stroke();
        // Đường đứt thẳng đứng chuẩn
        ctx.save(); ctx.setLineDash([7, 7]); ctx.strokeStyle = '#64748b'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(515, 44); ctx.lineTo(515, 272); ctx.stroke();
        ctx.restore();

        // Thanh nam châm thẳng (tô đồng nhất xám đậm, không tiết lộ cực N/S!)
        ctx.fillStyle = '#334155'; ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.roundRect(145, 194, 192, 32, 4); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#f8fafc'; ctx.font = '800 16px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('A', 152, 182);
        ctx.fillText('B', 330, 182);

        // Dây treo + kim nam châm N-S bị hút lệch nhẹ về B
        const sway = Math.sin(t * 2.4) * 0.025;
        const pivotX = 515, pivotY = 44, len = 166;
        const nx = pivotX - 42 + Math.sin(sway) * 8, ny = pivotY + len;
        ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(pivotX, pivotY); ctx.lineTo(nx, ny); ctx.stroke();

        ctx.save();
        ctx.translate(nx, ny);
        ctx.rotate(sway);
        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.moveTo(-64, 0); ctx.lineTo(0, -14); ctx.lineTo(0, 14); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.moveTo(64, 0); ctx.lineTo(0, -14); ctx.lineTo(0, 14); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = '#f8fafc'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(-64, 0); ctx.lineTo(0, -14); ctx.lineTo(64, 0); ctx.lineTo(0, 14); ctx.closePath(); ctx.stroke();
        ctx.fillStyle = '#f8fafc'; ctx.font = '800 15px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('N', -68, -16);
        ctx.fillText('S', 68, -16);
        ctx.restore();
    });

    // 15. MH-TN220-C3-15 — Đường sức từ giữa hai cực từ (A) và (B) (LT699 #67)
    window.VLXTModels.register('MH-TN220-C3-15', function (ctx, w, h, t) {
        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, '#060b19'); bg.addColorStop(1, '#0a1226');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = 'rgba(148,163,184,0.06)'; ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 26) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }

        // 7 đường sức từ hướng từ A sang B
        const yOffs = [-98, -62, -30, 0, 30, 62, 98];
        const cy = h / 2, xL = 225, xR = 555;
        yOffs.forEach(dy => {
            ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.moveTo(xL, cy + dy * 0.25);
            ctx.quadraticCurveTo((xL + xR) / 2, cy + dy * 1.45, xR, cy + dy * 0.25);
            ctx.stroke();
            const midY = cy + dy * 0.85;
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.moveTo(w / 2 + 8, midY); ctx.lineTo(w / 2 - 5, midY - 6); ctx.lineTo(w / 2 - 5, midY + 6);
            ctx.closePath(); ctx.fill();
            // Hạt chuyển động theo đường sức từ A->B
            const u = (t * 0.45 + Math.abs(dy) * 0.01) % 1;
            const px = (1 - u) * (1 - u) * xL + 2 * (1 - u) * u * (w / 2) + u * u * xR;
            const py = (1 - u) * (1 - u) * (cy + dy * 0.25) + 2 * (1 - u) * u * (cy + dy * 1.45) + u * u * (cy + dy * 0.25);
            ctx.fillStyle = '#e0f2fe'; ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fill();
        });

        // Hai thanh nam châm màu trung tính (không tiết lộ đáp án cực Bắc/Nam)
        ctx.fillStyle = '#1e293b'; ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.roundRect(75, cy - 22, 165, 44, 5); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.roundRect(540, cy - 22, 165, 44, 5); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#f8fafc'; ctx.font = '700 15px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'left'; ctx.fillText('Nam châm   A', 92, cy + 5);
        ctx.fillText('B   Nam châm', 555, cy + 5);
    });

    // 16. MH-TN220-C3-16 — Mật độ đường sức từ tại 4 điểm (1)..(4) (LT699 #82)
    window.VLXTModels.register('MH-TN220-C3-16', function (ctx, w, h, t) {
        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, '#060b19'); bg.addColorStop(1, '#0a1226');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = 'rgba(148,163,184,0.06)'; ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 26) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }

        const lines = [[-130, -34], [-68, -16], [0, 0], [68, 16], [130, 34]];
        lines.forEach(([xTop, xBot]) => {
            const x0 = w / 2 + xBot, y0 = h - 30, x1 = w / 2 + xTop * 1.15, y1 = 26;
            ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.6;
            ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
            const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, ang = Math.atan2(y1 - y0, x1 - x0);
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath();
            ctx.moveTo(mx + 8 * Math.cos(ang), my + 8 * Math.sin(ang));
            ctx.lineTo(mx - 6 * Math.cos(ang - 0.5), my - 6 * Math.sin(ang - 0.5));
            ctx.lineTo(mx - 6 * Math.cos(ang + 0.5), my - 6 * Math.sin(ang + 0.5));
            ctx.closePath(); ctx.fill();
        });

        // 4 điểm đồng dạng — KHÔNG làm nổi bật đáp án (1)
        const pts = [[342, 224, '(1)', -6, -14], [372, 166, '(2)', 0, -14], [414, 112, '(3)', 0, -14], [474, 70, '(4)', 0, -14]];
        pts.forEach(([px, py, lb, dx, dy]) => {
            ctx.fillStyle = '#f8fafc'; ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
            ctx.font = 'italic 700 15px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(lb, px + dx, py + dy);
        });
    });

    // 17. MH-TN220-C3-17 — Kim nam châm định hướng trong từ trường Trái Đất (LT699 #220)
    window.VLXTModels.register('MH-TN220-C3-17', function (ctx, w, h, t) {
        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, '#060b19'); bg.addColorStop(1, '#0a1226');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = 'rgba(148,163,184,0.06)'; ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 26) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }

        const cx = w / 2, baseTop = 228;
        // Đế trụ la bàn
        ctx.fillStyle = '#334155'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.roundRect(cx - 84, baseTop, 168, 34, 6); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#475569';
        ctx.fillRect(cx - 14, 128, 28, baseTop - 128);
        ctx.strokeRect(cx - 14, 128, 28, baseTop - 128);
        ctx.fillStyle = '#cbd5e1'; ctx.fillRect(cx - 3, 102, 6, 28);

        // Kim nam châm N-S dao động nhẹ cân bằng trên trục
        const ang = 0.28 + Math.sin(t * 2.2) * 0.05;
        ctx.save(); ctx.translate(cx, 102); ctx.rotate(ang);
        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.moveTo(-124, 0); ctx.lineTo(0, -14); ctx.lineTo(0, 14); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.moveTo(124, 0); ctx.lineTo(0, -14); ctx.lineTo(0, 14); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = '#f8fafc'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(-124, 0); ctx.lineTo(0, -14); ctx.lineTo(124, 0); ctx.lineTo(0, 14); ctx.closePath(); ctx.stroke();
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI * 2); ctx.fill();
        ctx.font = '800 20px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'center';
        ctx.fillStyle = '#fca5a5'; ctx.fillText('N', -138, -12);
        ctx.fillStyle = '#93c5fd'; ctx.fillText('S', 138, 24);
        ctx.restore();
    });

    // 18. MH-TN220-C3-18 — Đường sức từ của nam châm và các điểm A, B, C, D (LT699 #334)
    window.VLXTModels.register('MH-TN220-C3-18', function (ctx, w, h, t) {
        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, '#060b19'); bg.addColorStop(1, '#0a1226');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = 'rgba(148,163,184,0.06)'; ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 26) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }

        const cx = w / 2, cy = 156, mw = 210, mh = 52;
        ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 1.8;
        // Các vòng đường sức kín trên/dưới (N -> S) + mũi tên chiều đường sức
        [52, 92, 134].forEach(ry => {
            [-1, 1].forEach(s => {
                ctx.beginPath();
                ctx.moveTo(cx - mw / 2 + 12, cy + s * mh / 2);
                ctx.bezierCurveTo(cx - mw * 0.65, cy + s * (mh / 2 + ry), cx + mw * 0.65, cy + s * (mh / 2 + ry), cx + mw / 2 - 12, cy + s * mh / 2);
                ctx.stroke();
                const ay = cy + s * (mh / 2 + 0.75 * ry);
                ctx.fillStyle = '#38bdf8';
                ctx.beginPath(); ctx.moveTo(cx + 6, ay); ctx.lineTo(cx - 4, ay - 4.5); ctx.lineTo(cx - 4, ay + 4.5); ctx.closePath(); ctx.fill();
            });
        });
        // Đường sức trục & cánh hai bên + mũi tên chiều N (ra) / S (vào)
        ctx.beginPath(); ctx.moveTo(cx - mw / 2, cy); ctx.lineTo(130, cy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(650, cy); ctx.lineTo(cx + mw / 2, cy); ctx.stroke();
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.moveTo(158, cy); ctx.lineTo(168, cy - 4.5); ctx.lineTo(168, cy + 4.5); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(605, cy); ctx.lineTo(615, cy - 4.5); ctx.lineTo(615, cy + 4.5); ctx.closePath(); ctx.fill();
        [-1, 1].forEach(s => {
            ctx.beginPath(); ctx.moveTo(cx - mw / 2, cy + s * 10); ctx.quadraticCurveTo(195, cy + s * 36, 155, cy + s * 86); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(cx + mw / 2, cy + s * 10); ctx.quadraticCurveTo(585, cy + s * 36, 625, cy + s * 86); ctx.stroke();
        });

        // Nam châm N - S
        ctx.fillStyle = '#ef4444'; ctx.fillRect(cx - mw / 2, cy - mh / 2, mw / 2, mh);
        ctx.fillStyle = '#2563eb'; ctx.fillRect(cx, cy - mh / 2, mw / 2, mh);
        ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 2; ctx.strokeRect(cx - mw / 2, cy - mh / 2, mw, mh);
        ctx.fillStyle = '#ffffff'; ctx.font = '800 22px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('N', cx - mw / 4, cy + 8);
        ctx.fillText('S', cx + mw / 4, cy + 8);

        // 4 điểm A, B, C, D đồng nhất
        const pts = [[cx + mw / 2 + 14, cy - 12, 'A', 6, -12], [cx + mw / 2 + 46, cy + 16, 'B', 14, 14], [cx - mw / 2 - 58, cy - 18, 'C', -14, -8], [cx + 22, cy - mh / 2 - 100, 'D', 6, -12]];
        pts.forEach(([px, py, lb, dx, dy]) => {
            ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#f8fafc'; ctx.font = '800 14px "Plus Jakarta Sans", sans-serif';
            ctx.fillText(lb, px + dx, py + dy);
        });
    });

    // 19. MH-TN220-C3-19 — Thí nghiệm Oersted dây dẫn đặt trên kim nam châm (GV-CD3-NEW #40)
    window.VLXTModels.register('MH-TN220-C3-19', function (ctx, w, h, t) {
        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, '#060b19'); bg.addColorStop(1, '#0a1226');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = 'rgba(148,163,184,0.06)'; ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 26) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }

        // Nguồn điện 1,5 V góc trên phải
        ctx.fillStyle = '#1e3a8a'; ctx.strokeStyle = '#60a5fa'; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.roundRect(575, 28, 125, 72, 6); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#f8fafc'; ctx.fillRect(584, 52, 107, 42);
        ctx.fillStyle = '#0f172a'; ctx.font = '800 12px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('1,5 V DC', 636, 70);
        ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(614, 84, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#2563eb'; ctx.beginPath(); ctx.arc(668, 84, 4.5, 0, Math.PI * 2); ctx.fill();

        // Hai trụ đỡ dây đồng thẳng
        ctx.fillStyle = '#334155'; ctx.fillRect(102, 174, 46, 22); ctx.fillRect(468, 224, 46, 22);
        ctx.fillStyle = '#94a3b8'; ctx.fillRect(122, 86, 8, 92); ctx.fillRect(488, 136, 8, 92);
        // Dây dẫn đồng thẳng đi qua hai trụ
        ctx.strokeStyle = '#fb923c'; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(126, 106); ctx.lineTo(492, 168); ctx.stroke();
        // Dây nối tới nguồn
        ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(122, 108); ctx.bezierCurveTo(60, 42, 420, 26, 614, 84); ctx.stroke();
        ctx.strokeStyle = '#38bdf8';
        ctx.beginPath(); ctx.moveTo(496, 168); ctx.bezierCurveTo(620, 215, 690, 140, 668, 84); ctx.stroke();

        // Kim nam châm đặt song song dưới dây dẫn (nhấp nhẹ chờ đóng công tắc)
        const bx = 304, by = 228;
        ctx.fillStyle = '#1e293b'; ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.ellipse(bx, by + 26, 46, 16, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#475569'; ctx.fillRect(bx - 5, by - 4, 10, 28);
        ctx.save(); ctx.translate(bx, by - 6); ctx.rotate(0.16);
        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.moveTo(64, 0); ctx.lineTo(0, -10); ctx.lineTo(0, 10); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#2563eb';
        ctx.beginPath(); ctx.moveTo(-64, 0); ctx.lineTo(0, -10); ctx.lineTo(0, 10); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = '#f8fafc'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(-64, 0); ctx.lineTo(0, -10); ctx.lineTo(64, 0); ctx.lineTo(0, 10); ctx.closePath(); ctx.stroke();
        ctx.restore();
        ctx.fillStyle = '#cbd5e1'; ctx.font = '700 12.5px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('Ban đầu: Trục kim nam châm song song dây dẫn', 300, h - 14);
    });

    // 20. MH-TN220-C3-20 — Khung vuông cạnh L đi qua vùng từ trường rộng 5L (VNA-C3 #540)
    window.VLXTModels.register('MH-TN220-C3-20', function (ctx, w, h, t) {
        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, '#060b19'); bg.addColorStop(1, '#0a1226');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

        const bx = 260, bw = 280, by = 38, bh = 196; // 5L ~ 280px => L = 56px
        const L = 56;
        ctx.fillStyle = 'rgba(56,189,248,0.06)'; ctx.fillRect(bx, by, bw, bh);
        ctx.save(); ctx.setLineDash([6, 5]); ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
        ctx.strokeRect(bx, by, bw, bh); ctx.restore();

        // Kí hiệu từ trường đều dấu nhân
        ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 1.8;
        for (let x = bx + 28; x < bx + bw - 10; x += 48) {
            for (let y = by + 26; y < by + bh - 10; y += 38) {
                ctx.beginPath();
                ctx.moveTo(x - 6, y - 6); ctx.lineTo(x + 6, y + 6);
                ctx.moveTo(x + 6, y - 6); ctx.lineTo(x - 6, y + 6);
                ctx.stroke();
            }
        }

        // Nhãn kích thước 5L
        ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(bx, by + bh + 18); ctx.lineTo(bx + bw, by + bh + 18); ctx.stroke();
        ctx.fillStyle = '#f8fafc'; ctx.font = '700 14px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('5L', bx + bw / 2, by + bh + 38);

        // Khung vuông cạnh L chuyển động đều sang phải (một chiều sawtooth)
        const s = (t * 0.16) % 1;
        const fx = 95 + s * 525, fy = by + (bh - L) / 2;
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 3.2;
        ctx.strokeRect(fx, fy, L, L);
        ctx.fillStyle = '#fbbf24'; ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('L', fx + L / 2, fy + L + 20);

        // Véc-tơ vận tốc v
        ctx.strokeStyle = '#10b981'; ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.moveTo(fx + L + 8, fy + L / 2); ctx.lineTo(fx + L + 48, fy + L / 2); ctx.stroke();
        ctx.fillStyle = '#10b981';
        ctx.beginPath(); ctx.moveTo(fx + L + 54, fy + L / 2); ctx.lineTo(fx + L + 42, fy + L / 2 - 5); ctx.lineTo(fx + L + 42, fy + L / 2 + 5); ctx.fill();
        ctx.fillText('v', fx + L + 30, fy + L / 2 - 10);
    });

    // 21. MH-TN220-C3-21 — 4 hình xác định chiều dòng điện cảm ứng theo Lenz (VNA-C3 #572)
    window.VLXTModels.register('MH-TN220-C3-21', function (ctx, w, h, t) {
        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, '#060b19'); bg.addColorStop(1, '#0a1226');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

        const cases = [
            { lb: '(1)', leftPole: 'N', rightPole: 'S', moveDir: 1, ringDown: true },
            { lb: '(2)', leftPole: 'N', rightPole: 'S', moveDir: 1, ringDown: false },
            { lb: '(3)', leftPole: 'S', rightPole: 'N', moveDir: -1, ringDown: true },
            { lb: '(4)', leftPole: 'S', rightPole: 'N', moveDir: -1, ringDown: false },
        ];
        cases.forEach((c, idx) => {
            const bx = 18 + idx * 188, bw = 176, cy = 148;
            ctx.fillStyle = 'rgba(13,23,44,0.88)'; ctx.strokeStyle = 'rgba(56,189,248,0.24)'; ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.roundRect(bx, 24, bw, 256, 10); ctx.fill(); ctx.stroke();

            // Nam châm + mũi tên v
            const mx = bx + 16, mw = 74, mh = 26;
            ctx.fillStyle = c.leftPole === 'N' ? '#ef4444' : '#2563eb'; ctx.fillRect(mx, cy - mh / 2, mw / 2, mh);
            ctx.fillStyle = c.rightPole === 'N' ? '#ef4444' : '#2563eb'; ctx.fillRect(mx + mw / 2, cy - mh / 2, mw / 2, mh);
            ctx.strokeStyle = '#f8fafc'; ctx.lineWidth = 1.4; ctx.strokeRect(mx, cy - mh / 2, mw, mh);
            ctx.fillStyle = '#ffffff'; ctx.font = '800 13px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(c.leftPole, mx + mw / 4, cy + 5); ctx.fillText(c.rightPole, mx + 3 * mw / 4, cy + 5);

            // Véc-tơ v
            const vx0 = c.moveDir > 0 ? mx + mw + 4 : mx + 24;
            const vx1 = c.moveDir > 0 ? mx + mw + 30 : mx - 2;
            ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2.2;
            ctx.beginPath(); ctx.moveTo(vx0, cy - 26); ctx.lineTo(vx1, cy - 26); ctx.stroke();
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath(); ctx.moveTo(vx1 + c.moveDir * 6, cy - 26); ctx.lineTo(vx1 - c.moveDir * 4, cy - 31); ctx.lineTo(vx1 - c.moveDir * 4, cy - 21); ctx.fill();
            ctx.font = 'italic 700 13px "Plus Jakarta Sans", sans-serif';
            ctx.fillText('v', (vx0 + vx1) / 2, cy - 33);

            // Vòng dây treo & mũi tên dòng điện gắn trên đề (tuyệt đối KHÔNG đánh dấu hình nào đúng!)
            const rx = bx + 134;
            ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(rx - 12, 46); ctx.lineTo(rx + 12, 46); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(rx, 46); ctx.lineTo(rx, cy - 58); ctx.stroke();
            // Nửa sau nét đứt + nửa trước nét liền
            ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = '#64748b'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.ellipse(rx, cy, 18, 58, 0, -Math.PI / 2, Math.PI / 2); ctx.stroke(); ctx.restore();
            ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.8;
            ctx.beginPath(); ctx.ellipse(rx, cy, 18, 58, 0, Math.PI / 2, -Math.PI / 2); ctx.stroke();
            // Mũi tên chỉ chiều ở cạnh trước (bên trái ellipse)
            const ay = cy, ax = rx - 18, ad = c.ringDown ? 1 : -1;
            ctx.fillStyle = '#fbbf24';
            ctx.beginPath(); ctx.moveTo(ax, ay + ad * 8); ctx.lineTo(ax - 6, ay - ad * 5); ctx.lineTo(ax + 6, ay - ad * 5); ctx.closePath(); ctx.fill();

            ctx.fillStyle = '#e2e8f0'; ctx.font = '800 15px "Plus Jakarta Sans", sans-serif';
            ctx.fillText(c.lb, bx + bw / 2, 260);
        });
    });

    // 22. MH-TN220-C3-22 — 4 phương án thí nghiệm nam châm & ống dây nối ampe kế (VNA-C3 #643)
    window.VLXTModels.register('MH-TN220-C3-22', function (ctx, w, h, t) {
        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, '#060b19'); bg.addColorStop(1, '#0a1226');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

        const panels = [
            { x: 18,  y: 12,  lb: 'a) Quay quanh trục đứng' },
            { x: 398, y: 12,  lb: 'b) Kéo nam châm ra xa' },
            { x: 18,  y: 158, lb: 'c) Đưa nam châm lại gần' },
            { x: 398, y: 158, lb: 'd) Quay quanh trục ngang' },
        ];
        panels.forEach((p, idx) => {
            const pw = 364, ph = 135;
            ctx.fillStyle = 'rgba(13,23,44,0.88)'; ctx.strokeStyle = 'rgba(56,189,248,0.22)'; ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.roundRect(p.x, p.y, pw, ph, 8); ctx.fill(); ctx.stroke();

            // Ống dây & ampe kế trung tính (kim ở giữa để KHÔNG lộ đáp án!)
            const sx = p.x + 36, sy = p.y + 42, sw = 136;
            ctx.fillStyle = '#334155'; ctx.fillRect(sx, sy - 12, sw, 24);
            ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2.4;
            for (let k = 0; k < 10; k++) {
                ctx.beginPath(); ctx.ellipse(sx + 10 + k * 12, sy, 4.5, 16, 0, 0, Math.PI * 2); ctx.stroke();
            }
            ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.8;
            ctx.beginPath(); ctx.moveTo(sx + 8, sy + 16); ctx.lineTo(sx + 8, sy + 52); ctx.lineTo(sx + sw - 8, sy + 52); ctx.lineTo(sx + sw - 8, sy + 16); ctx.stroke();
            // Mặt ampe kế
            ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#cbd5e1';
            ctx.beginPath(); ctx.roundRect(sx + sw / 2 - 24, sy + 30, 48, 36, 5); ctx.fill(); ctx.stroke();
            ctx.strokeStyle = '#38bdf8';
            ctx.beginPath(); ctx.arc(sx + sw / 2, sy + 56, 15, Math.PI, 0); ctx.stroke();
            ctx.strokeStyle = '#f8fafc';
            ctx.beginPath(); ctx.moveTo(sx + sw / 2, sy + 56); ctx.lineTo(sx + sw / 2, sy + 42); ctx.stroke();

            // Nam châm bên phải theo từng phương án
            const mx = p.x + 225, my = p.y + 42;
            if (idx === 0) {
                const rot = Math.sin(t * 2.5) * 0.65;
                ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.4;
                ctx.beginPath(); ctx.moveTo(mx + 42, my - 30); ctx.lineTo(mx + 42, my + 32); ctx.stroke();
                ctx.save(); ctx.translate(mx + 42, my); ctx.scale(Math.cos(rot), 1);
                ctx.fillStyle = '#ef4444'; ctx.fillRect(-42, -12, 42, 24);
                ctx.fillStyle = '#2563eb'; ctx.fillRect(0, -12, 42, 24);
                ctx.fillStyle = '#fff'; ctx.font = '800 12px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'center';
                ctx.fillText('N', -21, 4); ctx.fillText('S', 21, 4);
                ctx.restore();
            } else if (idx === 1 || idx === 2) {
                const dir = idx === 1 ? 1 : -1;
                const shift = ((t * 0.45) % 1) * 20 * dir;
                const x0 = mx + shift;
                ctx.fillStyle = '#ef4444'; ctx.fillRect(x0, my - 12, 42, 24);
                ctx.fillStyle = '#2563eb'; ctx.fillRect(x0 + 42, my - 12, 42, 24);
                ctx.fillStyle = '#fff'; ctx.font = '800 12px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'center';
                ctx.fillText('N', x0 + 21, my + 4); ctx.fillText('S', x0 + 63, my + 4);
                ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.4;
                ctx.beginPath(); ctx.moveTo(mx + 20, my + 28); ctx.lineTo(mx + 64, my + 28); ctx.stroke();
                const ax = dir > 0 ? mx + 68 : mx + 16;
                ctx.fillStyle = '#38bdf8';
                ctx.beginPath(); ctx.moveTo(ax, my + 28); ctx.lineTo(ax - dir * 8, my + 23); ctx.lineTo(ax - dir * 8, my + 33); ctx.fill();
            } else {
                // d) Quay quanh trục ngang đồng trục nam châm
                ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.4;
                ctx.beginPath(); ctx.moveTo(mx - 14, my); ctx.lineTo(mx + 102, my); ctx.stroke();
                ctx.fillStyle = '#ef4444'; ctx.fillRect(mx, my - 12, 42, 24);
                ctx.fillStyle = '#2563eb'; ctx.fillRect(mx + 42, my - 12, 42, 24);
                ctx.fillStyle = '#fff'; ctx.font = '800 12px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'center';
                ctx.fillText('N', mx + 21, my + 4); ctx.fillText('S', mx + 63, my + 4);
                ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.8;
                ctx.beginPath(); ctx.arc(mx + 92, my, 12, -1.2, 1.2); ctx.stroke();
            }
            ctx.fillStyle = '#cbd5e1'; ctx.font = '700 12px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'right';
            ctx.fillText(p.lb, p.x + pw - 12, p.y + ph - 10);
        });
    });

    // 23. MH-TN220-C3-23 — Đồ thị B(t) tăng đều từ 0 lên 0,5 T trong 1,0 s (VNA-C3 #653)
    window.VLXTModels.register('MH-TN220-C3-23', function (ctx, w, h, t) {
        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, '#060b19'); bg.addColorStop(1, '#0a1226');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

        const ox = 230, oy = 256, gw = 320, gh = 200;
        // Lưới tọa độ B (0..0,5) & t (0..1,0)
        ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = 'rgba(148,163,184,0.3)'; ctx.lineWidth = 1;
        for (let k = 1; k <= 5; k++) {
            const yy = oy - (k / 5) * gh;
            ctx.beginPath(); ctx.moveTo(ox, yy); ctx.lineTo(ox + gw, yy); ctx.stroke();
        }
        for (let k = 1; k <= 4; k++) {
            const xx = ox + (k / 4) * gw;
            ctx.beginPath(); ctx.moveTo(xx, oy); ctx.lineTo(xx, oy - gh); ctx.stroke();
        }
        ctx.restore();

        // Trục
        ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.moveTo(ox, oy + 6); ctx.lineTo(ox, oy - gh - 16); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ox - 6, oy); ctx.lineTo(ox + gw + 26, oy); ctx.stroke();

        // Đường đồ thị B(t)
        ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 3.2;
        ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + gw, oy - gh); ctx.stroke();
        // Chấm chạy trên đồ thị
        const s = (t * 0.25) % 1;
        ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(ox + s * gw, oy - s * gh, 5.5, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#f8fafc'; ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'right';
        ['0,1', '0,2', '0,3', '0,4', '0,5'].forEach((lb, idx) => {
            ctx.fillText(lb, ox - 10, oy - ((idx + 1) / 5) * gh + 4);
        });
        ctx.fillText('0', ox - 8, oy + 16);
        ctx.fillText('B (T)', ox - 10, oy - gh - 18);
        ctx.textAlign = 'center';
        ctx.fillText('0,5', ox + gw * 0.5, oy + 18);
        ctx.fillText('1,0', ox + gw, oy + 18);
        ctx.fillText('t (s)', ox + gw + 36, oy + 18);
    });

    // 24. MH-TN220-C3-24 — 4 hình khung dây trong từ trường đều (VNA-C3 #665)
    window.VLXTModels.register('MH-TN220-C3-24', function (ctx, w, h, t) {
        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, '#060b19'); bg.addColorStop(1, '#0a1226');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

        const cases = [
            { lb: '(1)', horiz: true, nLines: 4 },
            { lb: '(2)', horiz: true, nLines: 6 },
            { lb: '(3)', horiz: false, nLines: 4 },
            { lb: '(4)', horiz: false, nLines: 6 },
        ];
        cases.forEach((c, idx) => {
            const bx = 20 + idx * 188, bw = 174, cx = bx + bw / 2, cy = 152;
            ctx.fillStyle = 'rgba(13,23,44,0.88)'; ctx.strokeStyle = 'rgba(56,189,248,0.24)'; ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.roundRect(bx, 22, bw, 260, 10); ctx.fill(); ctx.stroke();

            // Khung bình hành nghiêng đồng nhất
            ctx.fillStyle = 'rgba(148,163,184,0.34)'; ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.moveTo(cx - 34, cy - 26); ctx.lineTo(cx + 58, cy - 26);
            ctx.lineTo(cx + 34, cy + 26); ctx.lineTo(cx - 58, cy + 26); ctx.closePath();
            ctx.fill(); ctx.stroke();

            ctx.strokeStyle = '#38bdf8'; ctx.fillStyle = '#38bdf8'; ctx.lineWidth = 2;
            if (c.horiz) {
                for (let k = 0; k < c.nLines; k++) {
                    const dy = -20 + (k / (c.nLines - 1)) * 40;
                    ctx.beginPath(); ctx.moveTo(cx + 68, cy + dy); ctx.lineTo(cx - 68, cy + dy); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(cx - 74, cy + dy); ctx.lineTo(cx - 64, cy + dy - 4); ctx.lineTo(cx - 64, cy + dy + 4); ctx.fill();
                }
            } else {
                for (let k = 0; k < c.nLines; k++) {
                    const dx = -38 + (k / (c.nLines - 1)) * 76, yTop = 58, yBot = 224;
                    ctx.beginPath(); ctx.moveTo(cx + dx, yTop); ctx.lineTo(cx + dx, yBot); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(cx + dx, yBot + 6); ctx.lineTo(cx + dx - 4, yBot - 4); ctx.lineTo(cx + dx + 4, yBot - 4); ctx.fill();
                }
            }
            ctx.fillStyle = '#38bdf8'; ctx.font = '800 13px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'center';
            ctx.fillText('B', cx - 6, 48);
            ctx.fillStyle = '#e2e8f0'; ctx.font = '800 15px "Plus Jakarta Sans", sans-serif';
            ctx.fillText(c.lb, cx, 266);
        });
    });

    // 25. MH-TN220-C4-25 — Hai mô hình nguyên tử (7p,7n) và (14p,14n) (VNA-C4 #843)
    window.VLXTModels.register('MH-TN220-C4-25', function (ctx, w, h, t) {
        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, '#060b19'); bg.addColorStop(1, '#0a1226');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

        function drawAtom(cx, cy, pCount, nCount, shells) {
            // Hạt nhân
            ctx.fillStyle = '#1e293b'; ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2.4;
            ctx.beginPath(); ctx.arc(cx, cy, 32, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#f8fafc'; ctx.font = '800 13px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(`${pCount}p`, cx, cy - 3);
            ctx.fillText(`${nCount}n`, cx, cy + 15);
            shells.forEach(([r, nEl, spd], si) => {
                ctx.strokeStyle = 'rgba(148,163,184,0.55)'; ctx.lineWidth = 1.6;
                ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
                for (let k = 0; k < nEl; k++) {
                    const a = (k / nEl) * Math.PI * 2 + t * spd + si;
                    ctx.fillStyle = '#38bdf8';
                    ctx.beginPath(); ctx.arc(cx + r * Math.cos(a), cy + r * Math.sin(a), 4.5, 0, Math.PI * 2); ctx.fill();
                }
            });
        }
        drawAtom(205, 152, 7, 7, [[58, 2, 0.7], [88, 5, -0.45]]);
        drawAtom(565, 152, 14, 14, [[54, 2, 0.75], [84, 8, -0.5], [116, 4, 0.35]]);
    });

    // 26. MH-TN220-C4-26 — Mô hình nguyên tử (13p,14n) (VNA-C4 #899)
    window.VLXTModels.register('MH-TN220-C4-26', function (ctx, w, h, t) {
        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, '#060b19'); bg.addColorStop(1, '#0a1226');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

        const cx = w / 2, cy = h / 2;
        ctx.fillStyle = '#1e293b'; ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2.6;
        ctx.beginPath(); ctx.arc(cx, cy, 36, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#f8fafc'; ctx.font = '800 15px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('13p', cx, cy - 4);
        ctx.fillText('14n', cx, cy + 16);

        [[62, 2, 0.8], [94, 8, -0.5], [126, 3, 0.35]].forEach(([r, nEl, spd], si) => {
            ctx.strokeStyle = 'rgba(148,163,184,0.6)'; ctx.lineWidth = 1.8;
            ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
            for (let k = 0; k < nEl; k++) {
                const a = (k / nEl) * Math.PI * 2 + t * spd + si;
                ctx.fillStyle = '#38bdf8';
                ctx.beginPath(); ctx.arc(cx + r * Math.cos(a), cy + r * Math.sin(a), 5, 0, Math.PI * 2); ctx.fill();
            }
        });
    });

    // 27. MH-TN220-C4-27 — 4 đồ thị liên hệ E_lkr theo số nucleon A (VNA-C4 #955)
    window.VLXTModels.register('MH-TN220-C4-27', function (ctx, w, h, t) {
        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, '#060b19'); bg.addColorStop(1, '#0a1226');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

        const boxes = [
            { lb: 'Hình a', pts: [[0,0], [22,42], [50,76], [85,94], [116,98]] },
            { lb: 'Hình b', pts: [[0,0], [16,84], [32,98], [72,82], [114,72]] },
            { lb: 'Hình c', pts: [[0,0], [22,68], [38,94], [62,48], [108,16]] },
            { lb: 'Hình d', pts: [[0,0], [112,102]] },
        ];
        boxes.forEach((b, idx) => {
            const bx = 22 + idx * 188, bw = 172, ox = bx + 38, oy = 216;
            ctx.fillStyle = 'rgba(13,23,44,0.88)'; ctx.strokeStyle = 'rgba(56,189,248,0.24)'; ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.roundRect(bx, 24, bw, 256, 10); ctx.fill(); ctx.stroke();

            ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.8;
            ctx.beginPath(); ctx.moveTo(ox, oy + 6); ctx.lineTo(ox, 68); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(ox - 6, oy); ctx.lineTo(bx + bw - 14, oy); ctx.stroke();

            ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.8;
            ctx.beginPath();
            ctx.moveTo(ox, oy);
            if (b.pts.length === 2) {
                ctx.lineTo(ox + b.pts[1][0], oy - b.pts[1][1]);
            } else {
                for (let k = 1; k < b.pts.length; k++) {
                    const prev = b.pts[k - 1], cur = b.pts[k];
                    const cx = ox + (prev[0] + cur[0]) / 2, cy = oy - (prev[1] + cur[1]) / 2;
                    ctx.quadraticCurveTo(ox + prev[0], oy - prev[1], cx, cy);
                }
                const last = b.pts[b.pts.length - 1];
                ctx.lineTo(ox + last[0], oy - last[1]);
            }
            ctx.stroke();

            ctx.fillStyle = '#e2e8f0';
            ctx.font = '700 12.5px "Plus Jakarta Sans", sans-serif';
            ctx.textAlign = 'right'; ctx.fillText('E', ox - 16, 70); ctx.fillText('O', ox - 6, oy + 16);
            ctx.font = '700 9.5px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'left';
            ctx.fillText('lkr', ox - 15, 74);
            ctx.font = '700 12px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'center';
            ctx.fillText('A', bx + bw - 18, oy + 16);
            ctx.fillStyle = '#cbd5e1'; ctx.font = '800 14px "Plus Jakarta Sans", sans-serif';
            ctx.fillText(b.lb, bx + bw / 2, 262);
        });
    });
})();
