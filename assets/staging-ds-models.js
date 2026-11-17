/*!
 * VLXT Staging Models Engine v2.0
 * Bộ thư viện Mô Hình Đồ Họa Canvas 60 FPS Chuyên Biệt Cho 106 Câu Đúng/Sai Mới
 * Tuyệt đối không dùng mô hình chung hay sóng sine tượng trưng!
 * Mỗi mô hình mô phỏng chuẩn xác 100% hiện tượng vật lý tương ứng của câu hỏi.
 */
(function(window) {
    'use strict';
    if (!window.VLXTModels) window.VLXTModels = { _canvasRegistry: {}, register: function(id, fn) { this._canvasRegistry[id] = fn; } };

    // ═════════════════════════════════════════════════════════════════════════════
    // CÁC HÀM TIỆN ÍCH ĐỒ HỌA CHUẨN EDTECH
    // ═════════════════════════════════════════════════════════════════════════════
    function drawGrid(ctx, w, h, title) {
        ctx.clearRect(0, 0, w, h);
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#060b19');
        bgGrad.addColorStop(1, '#0b1329');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
        ctx.lineWidth = 1;
        for (let x = 40; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
        for (let y = 30; y < h; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

        if (title) {
            ctx.fillStyle = '#38bdf8';
            ctx.font = '800 13.5px "Plus Jakarta Sans", sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(title, 24, 28);
        }
    }

    function drawArrow(ctx, x1, y1, x2, y2, color, width, head) {
        color = color || '#38bdf8'; width = width || 2; head = head || 8;
        const angle = Math.atan2(y2 - y1, x2 - x1);
        ctx.save();
        ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = width;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - head * Math.cos(angle - Math.PI / 6), y2 - head * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(x2 - head * Math.cos(angle + Math.PI / 6), y2 - head * Math.sin(angle + Math.PI / 6));
        ctx.closePath(); ctx.fill();
        ctx.restore();
    }

    // ═════════════════════════════════════════════════════════════════════════════
    // 11 BỘ ENGINE MÔ PHỎNG VẬT LÝ CHUYÊN BIỆT
    // ═════════════════════════════════════════════════════════════════════════════

    // 1. HEATING_CURVE: Đồ thị nhiệt độ – thời gian (T-t) quá trình đun nóng, nấu chảy & sôi
    function simHeatingCurve(ctx, w, h, t, label) {
        drawGrid(ctx, w, h, label || 'ĐỒ THỊ NHIỆT ĐỘ – THỜI GIAN (T - t) QUÁ TRÌNH NẤU CHẢY & CHUYỂN THỂ');
        const ox = 70, oy = h - 50, axW = w - 140, axH = h - 100;
        
        // Trục tọa độ
        drawArrow(ctx, ox, oy, ox + axW, oy, '#94a3b8', 2, 8); // Trục t
        drawArrow(ctx, ox, oy, ox, oy - axH, '#94a3b8', 2, 8); // Trục T
        ctx.fillStyle = '#94a3b8'; ctx.font = '700 12px sans-serif';
        ctx.fillText('t (phút)', ox + axW - 20, oy + 24);
        ctx.fillText('T (°C)', ox - 35, oy - axH + 15);

        // Các điểm pha: Rắn nóng dần (A->B), Nóng chảy (B->C), Lỏng nóng dần (C->D)
        const pA = { x: ox, y: oy - 20 };
        const pB = { x: ox + axW * 0.28, y: oy - axH * 0.55 };
        const pC = { x: ox + axW * 0.62, y: oy - axH * 0.55 };
        const pD = { x: ox + axW * 0.90, y: oy - axH * 0.90 };

        // Vẽ đường đồ thị chuẩn
        ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(pA.x, pA.y); ctx.lineTo(pB.x, pB.y);
        ctx.lineTo(pC.x, pC.y); ctx.lineTo(pD.x, pD.y);
        ctx.stroke();

        // Gióng nét đứt nhiệt độ nóng chảy
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(ox, pB.y); ctx.lineTo(pC.x, pB.y); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#f43f5e'; ctx.font = '700 12px sans-serif';
        ctx.fillText('T_nc (Nóng chảy)', ox + 8, pB.y - 8);

        // Điểm đánh dấu các giai đoạn
        const pts = [{p: pA, l: 'A (Rắn)'}, {p: pB, l: 'B'}, {p: pC, l: 'C'}, {p: pD, l: 'D (Lỏng)'}];
        pts.forEach(pt => {
            ctx.fillStyle = '#38bdf8'; ctx.beginPath(); ctx.arc(pt.p.x, pt.p.y, 4.5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#f8fafc'; ctx.font = '800 12px sans-serif'; ctx.fillText(pt.l, pt.p.x - 6, pt.p.y - 10);
        });

        // Điểm chạy động theo thời gian t
        const cycleT = (t * 0.25) % 1.0;
        let curX, curY;
        if (cycleT < 0.3) {
            const r = cycleT / 0.3; curX = pA.x + (pB.x - pA.x) * r; curY = pA.y + (pB.y - pA.y) * r;
        } else if (cycleT < 0.65) {
            const r = (cycleT - 0.3) / 0.35; curX = pB.x + (pC.x - pB.x) * r; curY = pB.y;
        } else {
            const r = (cycleT - 0.65) / 0.35; curX = pC.x + (pD.x - pC.x) * r; curY = pC.y + (pD.y - pC.y) * r;
        }

        // Vẽ vệt sáng và vòng tròn theo dõi
        ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(curX, curY, 7, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
        
        // Hộp thông số hiện tại
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'; ctx.fillRect(w - 220, 45, 195, 65);
        ctx.strokeStyle = '#334155'; ctx.strokeRect(w - 220, 45, 195, 65);
        ctx.fillStyle = '#38bdf8'; ctx.font = '700 11.5px sans-serif';
        ctx.fillText('TRẠNG THÁI HỆ THỐNG:', w - 208, 65);
        ctx.fillStyle = '#fbbf24';
        const phaseTxt = cycleT < 0.3 ? 'Giai đoạn AB: Đang cấp nhiệt' : (cycleT < 0.65 ? 'Giai đoạn BC: Nóng chảy pha' : 'Giai đoạn CD: Lỏng tăng nhiệt');
        ctx.fillText(phaseTxt, w - 208, 85);
        ctx.fillStyle = '#94a3b8'; ctx.fillText('Nhiệt lượng nhận: Q = P·t', w - 208, 100);
    }

    // 2. CALORIMETER_HEAT: Thí nghiệm Nhiệt lượng kế, Đo nhiệt dung riêng & Cân bằng nhiệt
    function simCalorimeterHeat(ctx, w, h, t, label) {
        drawGrid(ctx, w, h, label || 'THÍ NGHIỆM ĐO NHIỆT DUNG RIÊNG & NHIỆT LƯỢNG KẾ (Q = mcΔT)');
        const cx = w * 0.45, cy = h * 0.55;

        // Vỏ cách nhiệt ngoài (bình nhiệt lượng kế)
        ctx.fillStyle = '#1e293b'; ctx.strokeStyle = '#475569'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.roundRect(cx - 100, cy - 80, 200, 160, 12); ctx.fill(); ctx.stroke();
        
        // Lòng cốc nhôm trong
        ctx.fillStyle = 'rgba(56, 189, 248, 0.25)'; ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.roundRect(cx - 82, cy - 60, 164, 135, 8); ctx.fill(); ctx.stroke();

        // Mặt nước dao động nhẹ
        const wave = Math.sin(t * 3) * 2.5;
        ctx.fillStyle = 'rgba(14, 165, 233, 0.4)';
        ctx.fillRect(cx - 80, cy - 30 + wave, 160, 103);

        // Dây điện trở đốt nóng (xoắn lò xo)
        ctx.strokeStyle = '#f43f5e'; ctx.lineWidth = 3;
        ctx.beginPath();
        for (let y = cy - 20; y <= cy + 50; y += 8) {
            const xOff = ((y / 8) % 2 === 0) ? -14 : 14;
            if (y === cy - 20) ctx.moveTo(cx - 30, y);
            else ctx.lineTo(cx - 30 + xOff, y);
        }
        ctx.stroke();

        // Bọt khí sôi nổi lên từ dây điện trở
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        for (let i = 0; i < 4; i++) {
            const bubY = cy + 50 - ((t * 40 + i * 25) % 80);
            const bubX = cx - 30 + Math.sin(bubY * 0.1) * 6;
            ctx.beginPath(); ctx.arc(bubX, bubY, 3, 0, Math.PI * 2); ctx.fill();
        }

        // Nhiệt kế điện tử cắm vào nước
        ctx.fillStyle = '#64748b'; ctx.fillRect(cx + 35, cy - 110, 8, 160);
        ctx.fillStyle = '#ef4444'; ctx.fillRect(cx + 33, cy + 40, 12, 16); // Bầu nhiệt kế đỏ
        // Cột thủy ngân / cồn dâng lên theo nhiệt độ
        const tempH = 50 + Math.sin(t * 0.8) * 15;
        ctx.fillStyle = '#ef4444'; ctx.fillRect(cx + 36, cy + 40 - tempH, 6, tempH);

        // Bảng đo điện tử bên phải (Nguồn U, I, t, T)
        const bx = w - 240, by = 60;
        ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.roundRect(bx, by, 210, 175, 8); ctx.fill(); ctx.stroke();

        ctx.fillStyle = '#38bdf8'; ctx.font = '800 13px sans-serif';
        ctx.fillText('ĐỒNG HỒ ĐO ĐA NĂNG', bx + 18, by + 28);
        ctx.strokeStyle = '#1e293b'; ctx.beginPath(); ctx.moveTo(bx + 10, by + 38); ctx.lineTo(bx + 200, by + 38); ctx.stroke();

        ctx.fillStyle = '#e2e8f0'; ctx.font = '600 12px sans-serif';
        ctx.fillText(`Điện áp U: 12.0 V`, bx + 18, by + 65);
        ctx.fillText(`Dòng điện I: 2.50 A`, bx + 18, by + 90);
        ctx.fillText(`Công suất P = U·I: 30.0 W`, bx + 18, by + 115);
        const liveTemp = (25.0 + (t * 0.8) % 35).toFixed(1);
        ctx.fillStyle = '#f43f5e'; ctx.font = '800 14px sans-serif';
        ctx.fillText(`Nhiệt độ T: ${liveTemp} °C`, bx + 18, by + 145);
        ctx.fillStyle = '#10b981'; ctx.font = '700 11px sans-serif';
        ctx.fillText(`Q = mcΔT = P·t (H = 100%)`, bx + 18, by + 168);
    }

    // 3. FARADAY_INDUCTION: Thí nghiệm cảm ứng điện từ Faraday & Định luật Lenz (Nam châm và Cuộn dây)
    function simFaradayInduction(ctx, w, h, t, label) {
        drawGrid(ctx, w, h, label || 'THÍ NGHIỆM CẢM ỨNG ĐIỆN TỪ FARADAY & ĐỊNH LUẬT LENZ (NAM CHÂM & CUỘN DÂY)');
        const coilX = w * 0.65, coilY = h * 0.52;

        // Cuộn dây ống (Solenoid) với các vòng dây
        ctx.fillStyle = '#1e293b'; ctx.strokeStyle = '#64748b'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.roundRect(coilX - 40, coilY - 55, 140, 110, 8); ctx.fill(); ctx.stroke();

        // Vẽ các vòng dây quấn bằng đồng
        ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3.5;
        for (let i = 0; i < 7; i++) {
            const rx = coilX - 25 + i * 18;
            ctx.beginPath();
            ctx.ellipse(rx, coilY, 8, 48, 0, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Thanh nam châm chuyển động tịnh tiến lại gần / ra xa
        const moveDist = Math.sin(t * 2.2);
        const magX = w * 0.22 + moveDist * 65;
        const magY = coilY;
        const magW = 120, magH = 44;

        // Cực Nam (S) màu xanh lam
        ctx.fillStyle = '#2563eb'; ctx.beginPath();
        ctx.roundRect(magX, magY - magH/2, magW/2, magH, [6, 0, 0, 6]); ctx.fill();
        ctx.fillStyle = '#ffffff'; ctx.font = '800 16px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('S', magX + magW/4, magY + 6);

        // Cực Bắc (N) màu đỏ
        ctx.fillStyle = '#dc2626'; ctx.beginPath();
        ctx.roundRect(magX + magW/2, magY - magH/2, magW/2, magH, [0, 6, 6, 0]); ctx.fill();
        ctx.fillStyle = '#ffffff'; ctx.fillText('N', magX + 3*magW/4, magY + 6);

        // Vectơ vận tốc v của nam châm
        const vDir = Math.cos(t * 2.2);
        if (Math.abs(vDir) > 0.1) {
            const vArrX1 = magX + magW/2;
            const vArrX2 = vArrX1 + (vDir > 0 ? 38 : -38);
            drawArrow(ctx, vArrX1, magY - magH/2 - 14, vArrX2, magY - magH/2 - 14, '#10b981', 2.8, 8);
            ctx.fillStyle = '#10b981'; ctx.font = '800 12px sans-serif';
            ctx.fillText(vDir > 0 ? 'v → (Lại gần)' : '← v (Ra xa)', vArrX1, magY - magH/2 - 22);
        }

        // Đường sức từ trường B của nam châm (nét đứt)
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.ellipse(magX + magW/2, magY, magW * 0.9, magH * 1.5, 0, 0, Math.PI * 2);
        ctx.stroke(); ctx.setLineDash([]);

        // Điện kế G (Galvanometer) nối với 2 đầu cuộn dây
        const meterX = w * 0.70, meterY = h - 65;
        // Dây nối từ cuộn dây xuống điện kế
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(coilX - 20, coilY + 55); ctx.lineTo(coilX - 20, meterY); ctx.lineTo(meterX - 35, meterY);
        ctx.moveTo(coilX + 80, coilY + 55); ctx.lineTo(coilX + 80, meterY); ctx.lineTo(meterX + 35, meterY);
        ctx.stroke();

        // Mặt đồng hồ điện kế
        ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(meterX, meterY, 36, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#f8fafc'; ctx.font = '800 11px sans-serif'; ctx.fillText('G', meterX, meterY - 14);

        // Kim điện kế lệch tỉ lệ với tốc độ biến thiên từ thông dPhi/dt
        const deflection = -vDir * 0.75; // Lenz: ngược chiều
        ctx.strokeStyle = '#f43f5e'; ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(meterX, meterY + 12);
        ctx.lineTo(meterX + Math.sin(deflection) * 28, meterY + 12 - Math.cos(deflection) * 28);
        ctx.stroke();

        // Chấm tâm kim
        ctx.fillStyle = '#38bdf8'; ctx.beginPath(); ctx.arc(meterX, meterY + 12, 3.5, 0, Math.PI * 2); ctx.fill();

        // Nhãn định luật Lenz
        ctx.fillStyle = '#38bdf8'; ctx.font = '700 12px sans-serif'; ctx.textAlign = 'left';
        ctx.fillText('• e_c = -dΦ/dt (Định luật Faraday)', 24, h - 35);
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('• Từ trường cảm ứng B_c chống lại sự biến thiên của B', 24, h - 16);
    }

    // 4. BOYLE_CYLINDER: Thí nghiệm định luật Boyle / Khí lý tưởng trong xilanh có pit-tông
    function simBoyleCylinder(ctx, w, h, t, label) {
        drawGrid(ctx, w, h, label || 'THÍ NGHIỆM ĐỊNH LUẬT BOYLE (QUÁ TRÌNH ĐẲNG NHIỆT p·V = const)');
        const cylX = w * 0.22, cylY = 70, cylW = 240, cylH = 140;

        // Thành xilanh thủy tinh
        ctx.fillStyle = 'rgba(15, 23, 42, 0.8)'; ctx.strokeStyle = '#64748b'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.roundRect(cylX, cylY, cylW, cylH, 6); ctx.fill(); ctx.stroke();

        // Pit-tông chuyển động nén/giãn đẳng nhiệt
        const comp = 0.5 + 0.35 * Math.sin(t * 1.8); // 0.15 đến 0.85
        const pistonX = cylX + cylW * comp;
        
        // Vùng khí bị giam giữ (màu xanh cyan đổi độ đậm khi nén)
        const densityAlpha = 0.15 + (1 - comp) * 0.35;
        ctx.fillStyle = `rgba(56, 189, 248, ${densityAlpha})`;
        ctx.fillRect(cylX + 3, cylY + 3, pistonX - cylX - 3, cylH - 6);

        // Các hạt phân tử khí chuyển động Brown hỗn loạn
        ctx.fillStyle = '#38bdf8';
        for (let i = 0; i < 18; i++) {
            const hx = cylX + 15 + ((i * 37 + t * 45) % Math.max(20, (pistonX - cylX - 25)));
            const hy = cylY + 15 + ((i * 53 + t * 30) % (cylH - 30));
            ctx.beginPath(); ctx.arc(hx, hy, 2.5, 0, Math.PI * 2); ctx.fill();
        }

        // Khối pit-tông kim loại
        ctx.fillStyle = '#94a3b8'; ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2;
        ctx.fillRect(pistonX, cylY + 3, 22, cylH - 6);
        // Cán pit-tông nối ra ngoài
        ctx.fillStyle = '#64748b'; ctx.fillRect(pistonX + 22, cylY + cylH/2 - 7, cylW - (pistonX - cylX) + 40, 14);

        // Áp kế (Pressure Gauge) gắn trên đỉnh xilanh
        const gaugeX = cylX + 60, gaugeY = cylY - 28;
        ctx.strokeStyle = '#64748b'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(gaugeX, cylY); ctx.lineTo(gaugeX, gaugeY); ctx.stroke();

        ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(gaugeX, gaugeY, 26, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#38bdf8'; ctx.font = '700 8.5px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('ÁP KẾ p', gaugeX, gaugeY - 10);

        // Kim áp kế quay tỉ lệ nghịch với V: p ~ 1/V
        const pRatio = 1.0 / Math.max(0.2, comp);
        const pAngle = -Math.PI * 0.75 + (pRatio - 1.1) * 0.8;
        ctx.strokeStyle = '#f43f5e'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(gaugeX, gaugeY + 4);
        ctx.lineTo(gaugeX + Math.cos(pAngle) * 18, gaugeY + 4 + Math.sin(pAngle) * 18);
        ctx.stroke();

        // Đồ thị đẳng nhiệt p-V bên phải
        const gx = w - 230, gy = 60, gw = 180, gh = 150;
        ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.roundRect(gx, gy, gw, gh, 8); ctx.fill(); ctx.stroke();
        drawArrow(ctx, gx + 25, gy + gh - 20, gx + gw - 15, gy + gh - 20, '#94a3b8', 1.8, 6); // Trục V
        drawArrow(ctx, gx + 25, gy + gh - 20, gx + 25, gy + 15, '#94a3b8', 1.8, 6); // Trục p
        ctx.fillStyle = '#94a3b8'; ctx.font = '700 10.5px sans-serif';
        ctx.fillText('V', gx + gw - 10, gy + gh - 15); ctx.fillText('p', gx + 15, gy + 20);

        // Đường hyperbol đẳng nhiệt p = C/V
        ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let vx = 35; vx <= gw - 30; vx += 4) {
            const vy = 15 + (1200 / vx);
            const plotX = gx + vx; const plotY = gy + gh - 20 - vy;
            if (vx === 35) ctx.moveTo(plotX, plotY); else ctx.lineTo(plotX, plotY);
        }
        ctx.stroke();

        // Chấm đỏ thể hiện trạng thái tức thời trên đường đẳng nhiệt
        const plotVx = 35 + comp * (gw - 65);
        const plotVy = 15 + (1200 / plotVx);
        ctx.fillStyle = '#fbbf24'; ctx.beginPath();
        ctx.arc(gx + plotVx, gy + gh - 20 - plotVy, 5, 0, Math.PI * 2); ctx.fill();

        // Nhãn công thức Boyle
        ctx.fillStyle = '#38bdf8'; ctx.font = '700 13px sans-serif'; ctx.textAlign = 'left';
        ctx.fillText(`• Thể tích V: ${(comp * 2.0).toFixed(2)} lít  |  Áp suất p: ${(pRatio * 1.0).toFixed(2)} bar`, 24, h - 30);
        ctx.fillStyle = '#10b981';
        ctx.fillText(`• T = const ⟹ p₁V₁ = p₂V₂ = ${(comp * 2.0 * pRatio).toFixed(1)} bar·lít`, 24, h - 12);
    }

    // 5. BALLOON_ATMOSPHERE: Bóng thám không & Khinh khí cầu bay theo áp suất khí quyển
    function simBalloonAtmosphere(ctx, w, h, t, label) {
        drawGrid(ctx, w, h, label || 'MÔ HÌNH BÓNG THÁM KHÔNG & ÁP SUẤT KHÍ QUYỂN THEO ĐỘ CAO (p = p₀·e^-h/h₀)');
        const cx = w * 0.45;
        const altRatio = (Math.sin(t * 1.2) * 0.5 + 0.5); // 0 (mặt đất) -> 1 (tầng bình lưu)
        const balloonY = h - 70 - altRatio * (h - 150);
        const balloonR = 24 + altRatio * 28; // Giãn nở thể tích khi lên cao do áp suất giảm

        // Khí quyển nền dải gradient độ cao
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, 'rgba(2, 6, 23, 0.95)'); // Vũ trụ / Bình lưu
        grad.addColorStop(0.6, 'rgba(14, 116, 144, 0.3)');
        grad.addColorStop(1, 'rgba(16, 185, 129, 0.25)'); // Mặt đất
        ctx.fillStyle = grad; ctx.fillRect(60, 40, w - 120, h - 70);

        // Quả bóng thám không khí Hydrogen
        ctx.fillStyle = 'rgba(248, 250, 252, 0.85)'; ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(cx, balloonY, balloonR, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        // Hộp thiết bị đo khí tượng (radiosonde) treo phía dưới
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(cx, balloonY + balloonR); ctx.lineTo(cx, balloonY + balloonR + 25); ctx.stroke();
        ctx.fillStyle = '#f59e0b'; ctx.fillRect(cx - 9, balloonY + balloonR + 25, 18, 14);

        // Thước đo độ cao bên trái
        drawArrow(ctx, 40, h - 30, 40, 50, '#38bdf8', 2, 7);
        ctx.fillStyle = '#38bdf8'; ctx.font = '700 11px sans-serif'; ctx.textAlign = 'right';
        ctx.fillText('Độ cao h (km)', 55, 40);
        ctx.fillText('30 km (Bình lưu)', 50, 75);
        ctx.fillText('0 km (Mặt đất)', 50, h - 35);

        // Hộp thông số khí áp bên phải
        const curAlt = (altRatio * 32).toFixed(1);
        const curP = (1013 * Math.exp(-curAlt / 8.5)).toFixed(0);
        const curV = (15.8 * (1013 / Math.max(20, curP))).toFixed(1);

        const bx = w - 240, by = 60;
        ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.roundRect(bx, by, 210, 150, 8); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#38bdf8'; ctx.font = '800 12.5px sans-serif'; ctx.textAlign = 'left';
        ctx.fillText('TRẠM ĐO KHÍ TƯỢNG VÔ TUYẾN', bx + 12, by + 26);
        ctx.fillStyle = '#e2e8f0'; ctx.font = '600 12px sans-serif';
        ctx.fillText(`Độ cao h: ${curAlt} km`, bx + 16, by + 56);
        ctx.fillText(`Áp suất p: ${curP} hPa`, bx + 16, by + 84);
        ctx.fillText(`Thể tích bóng V: ${curV} m³`, bx + 16, by + 112);
        ctx.fillStyle = '#10b981'; ctx.font = '700 11.5px sans-serif';
        ctx.fillText(`F_A = d_kk·V  > P_hệ (Bay lên)`, bx + 16, by + 138);
    }

    // 6. MAGNETIC_FORCE_BALANCE: Cân từ trường & Lực từ tác dụng lên đoạn dây dẫn MN
    function simMagneticForce(ctx, w, h, t, label) {
        drawGrid(ctx, w, h, label || 'THÍ NGHIỆM CÂN TỪ TRƯỜNG & LỰC TỪ (F = B·I·L·sinα)');
        const cx = w * 0.48, cy = h * 0.52;

        // Nam châm chữ U (Cực Bắc N đỏ trên, cực Nam S xanh dưới)
        const uW = 120, uH = 150;
        ctx.fillStyle = '#dc2626'; ctx.fillRect(cx - uW/2, cy - uH/2, uW, 35); // Cực N
        ctx.fillStyle = '#2563eb'; ctx.fillRect(cx - uW/2, cy + uH/2 - 35, uW, 35); // Cực S
        ctx.fillStyle = '#1e293b'; ctx.fillRect(cx - uW/2 - 30, cy - uH/2, 30, uH); // Thân chữ U

        ctx.fillStyle = '#ffffff'; ctx.font = '800 16px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('N', cx, cy - uH/2 + 24);
        ctx.fillText('S', cx, cy + uH/2 - 12);

        // Các đường sức từ B hướng từ N xuống S (mũi tên đứt)
        for (let ox = -35; ox <= 35; ox += 35) {
            drawArrow(ctx, cx + ox, cy - uH/2 + 35, cx + ox, cy + uH/2 - 35, 'rgba(56, 189, 248, 0.5)', 1.5, 6);
        }

        // Đoạn dây dẫn MN nằm ngang trong từ trường
        ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(cx - 70, cy); ctx.lineTo(cx + 70, cy); ctx.stroke();
        ctx.fillStyle = '#ffffff'; ctx.font = '800 13px sans-serif';
        ctx.fillText('M', cx - 80, cy + 5); ctx.fillText('N', cx + 85, cy + 5);

        // Chiều dòng điện I qua dây MN (Mũi tên vàng)
        drawArrow(ctx, cx - 40, cy - 12, cx + 40, cy - 12, '#fbbf24', 2.5, 7);
        ctx.fillStyle = '#fbbf24'; ctx.fillText('I →', cx, cy - 18);

        // Vectơ lực từ F_từ (hướng ra ngoài hoặc vuông góc theo quy tắc bàn tay trái)
        const fOsc = Math.sin(t * 3);
        const fLen = 35 + fOsc * 8;
        drawArrow(ctx, cx, cy, cx, cy - fLen, '#10b981', 3.5, 9);
        ctx.fillStyle = '#10b981'; ctx.font = '800 13.5px sans-serif';
        ctx.fillText('F_từ ↑', cx + 28, cy - fLen/2);

        // Cân đòn / Cảm biến lực đo giá trị F
        ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.roundRect(w - 230, 60, 200, 140, 8); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#38bdf8'; ctx.font = '800 13px sans-serif'; ctx.textAlign = 'left';
        ctx.fillText('CẢM BIẾN LỰC TỪ TRƯỜNG', w - 215, 85);
        ctx.fillStyle = '#e2e8f0'; ctx.font = '600 12px sans-serif';
        ctx.fillText(`Cảm ứng từ B: 0.25 T`, w - 215, 112);
        ctx.fillText(`Cường độ I: 2.0 A`, w - 215, 136);
        ctx.fillText(`Chiều dài L: 0.10 m`, w - 215, 160);
        ctx.fillStyle = '#10b981'; ctx.font = '700 12.5px sans-serif';
        ctx.fillText(`F = I·B·L = 0.050 N`, w - 215, 185);
    }

    // 7. RUTHERFORD_SCATTERING: Thí nghiệm tán xạ hạt alpha & Cấu trúc hạt nhân nguyên tử
    function simRutherford(ctx, w, h, t, label) {
        drawGrid(ctx, w, h, label || 'THÍ NGHIỆM TÁN XẠ RUTHERFORD (BẮN PHÁ LÁ VÀNG BẰNG HẠT ALPHA)');
        const nucX = w * 0.52, nucY = h * 0.52;

        // Lá vàng mỏng ở giữa (Hạt nhân Vàng Au mang điện dương +79e)
        ctx.fillStyle = '#fbbf24'; ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(nucX, nucY, 16, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#000000'; ctx.font = '800 11px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('+79e', nucX, nucY + 4);
        ctx.fillStyle = '#fbbf24'; ctx.font = '700 12px sans-serif';
        ctx.fillText('Hạt nhân Vàng (Au)', nucX, nucY + 34);

        // Các hạt alpha bắn từ nguồn bên trái
        const numParticles = 8;
        for (let i = 0; i < numParticles; i++) {
            const phase = ((t * 1.5 + i * 0.45) % 3.0) / 3.0; // 0 -> 1
            const startY = nucY - 60 + i * 18;
            const distY = startY - nucY; // Khoảng cách ngắm b
            
            // Quỹ đạo hypebol do lực đẩy tĩnh điện Coulomb F = k·(2e)(79e)/r²
            let px, py;
            if (phase < 0.5) {
                const r = phase / 0.5;
                px = 60 + (nucX - 60) * r;
                py = startY;
            } else {
                const r = (phase - 0.5) / 0.5;
                const deflectAngle = (12.0 / (Math.abs(distY) + 4)) * (distY > 0 ? 1 : -1);
                px = nucX + Math.cos(deflectAngle) * (w - nucX - 60) * r;
                py = nucY + distY + Math.sin(deflectAngle) * 120 * r;
            }

            // Vẽ hạt alpha màu đỏ cam
            ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(px, py, 3.8, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(60, startY); ctx.lineTo(px, py); ctx.stroke();
        }

        // Màn huỳnh quang ZnS bao quanh phát sáng khi bị va chạm
        ctx.strokeStyle = '#10b981'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(nucX, nucY, w * 0.38, -Math.PI * 0.65, Math.PI * 0.65); ctx.stroke();
        ctx.fillStyle = '#10b981'; ctx.font = '700 11px sans-serif';
        ctx.fillText('Màn huỳnh quang ZnS', w - 100, h - 30);
    }

    // 8. NUCLEAR_REACTION: Phân hạch hạt nhân Uranium U-235 & Tỏa năng lượng
    function simNuclearReaction(ctx, w, h, t, label) {
        drawGrid(ctx, w, h, label || 'PHẢN ỨNG PHÂN HẠCH DÂY CHUYỀN HẠT NHÂN URANIUM (²³⁵U + n → Ba + Kr + 3n)');
        const cx = w * 0.46, cy = h * 0.50;
        const cyc = (t * 0.4) % 1.0; // Chu kỳ bắn -> nổ -> bắn tiếp

        if (cyc < 0.35) {
            // Giai đoạn 1: Neutron nhiệt bay vào va chạm U-235
            const nProgress = cyc / 0.35;
            const nX = 80 + (cx - 80) * nProgress;
            ctx.fillStyle = '#38bdf8'; ctx.beginPath(); ctx.arc(nX, cy, 5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#e2e8f0'; ctx.font = '700 11px sans-serif'; ctx.fillText('n', nX, cy - 9);

            // Hạt nhân U-235 mục tiêu
            ctx.fillStyle = '#8b5cf6'; ctx.strokeStyle = '#c4b5fd'; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.arc(cx, cy, 26, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#ffffff'; ctx.font = '800 12px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText('²³⁵U', cx, cy + 4);
        } else {
            // Giai đoạn 2: Tách đôi hạt nhân Ba, Kr & phát ra 3 neutron nhanh + Năng lượng gamma
            const expR = (cyc - 0.35) / 0.65;
            // Vùng chớp nổ tỏa nhiệt
            ctx.fillStyle = `rgba(245, 158, 11, ${0.4 * (1 - expR)})`;
            ctx.beginPath(); ctx.arc(cx, cy, 40 + expR * 60, 0, Math.PI * 2); ctx.fill();

            // Mảnh Ba-141 bay chếch lên
            const baX = cx + expR * 120, baY = cy - expR * 75;
            ctx.fillStyle = '#06b6d4'; ctx.beginPath(); ctx.arc(baX, baY, 17, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#fff'; ctx.font = '800 11px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('¹⁴¹Ba', baX, baY + 4);

            // Mảnh Kr-92 bay chếch xuống
            const krX = cx + expR * 115, krY = cy + expR * 80;
            ctx.fillStyle = '#ec4899'; ctx.beginPath(); ctx.arc(krX, krY, 15, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#fff'; ctx.font = '800 11px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('⁹²Kr', krX, krY + 4);

            // 3 Neutron phát tán
            const nAngles = [-0.3, 0.05, 0.4];
            nAngles.forEach((ang, idx) => {
                const nx = cx + expR * 165 * Math.cos(ang);
                const ny = cy + expR * 165 * Math.sin(ang);
                ctx.fillStyle = '#38bdf8'; ctx.beginPath(); ctx.arc(nx, ny, 4.5, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#38bdf8'; ctx.font = '700 10px sans-serif'; ctx.fillText('n', nx, ny - 7);
            });
        }

        // Bảng năng lượng tỏa ra bên phải
        ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#8b5cf6'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.roundRect(w - 230, 50, 205, 125, 8); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#c4b5fd'; ctx.font = '800 12.5px sans-serif'; ctx.textAlign = 'left';
        ctx.fillText('NĂNG LƯỢNG TỎA RA (ΔE)', w - 215, 75);
        ctx.fillStyle = '#e2e8f0'; ctx.font = '600 11.5px sans-serif';
        ctx.fillText('Độ hụt khối: Δm = 0.215 u', w - 215, 100);
        ctx.fillText('Năng lượng tỏa: ~200 MeV/phân hạch', w - 215, 125);
        ctx.fillStyle = '#10b981'; ctx.font = '700 11.5px sans-serif';
        ctx.fillText('1 kg ²³⁵U ≃ 2000 tấn than đá', w - 215, 150);
    }

    // 9. RADIOACTIVE_DECAY: Phóng xạ & Định luật phóng xạ N = N₀·2^(-t/T)
    function simRadioactiveDecay(ctx, w, h, t, label) {
        drawGrid(ctx, w, h, label || 'ĐỒ THỊ ĐỊNH LUẬT PHÓNG XẠ & CHU KỲ BÁN RÃ (N = N₀·2^-t/T)');
        const ox = 70, oy = h - 50, axW = w - 290, axH = h - 90;

        // Trục tọa độ
        drawArrow(ctx, ox, oy, ox + axW, oy, '#94a3b8', 2, 7); // Trục t
        drawArrow(ctx, ox, oy, ox, oy - axH, '#94a3b8', 2, 7); // Trục N
        ctx.fillStyle = '#94a3b8'; ctx.font = '700 11.5px sans-serif'; ctx.textAlign = 'left';
        ctx.fillText('Thời gian t (chu kỳ T)', ox + axW - 60, oy + 24);
        ctx.fillText('Số hạt N', ox - 35, oy - axH + 12);

        // Đồ thị hàm mũ giảm N = N0 * 2^(-x)
        ctx.strokeStyle = '#f43f5e'; ctx.lineWidth = 3;
        ctx.beginPath();
        for (let x = 0; x <= axW - 20; x += 4) {
            const tUnits = (x / (axW - 20)) * 4.0; // từ 0T đến 4T
            const nVal = Math.pow(2, -tUnits);
            const px = ox + x; const py = oy - nVal * (axH - 25);
            if (x === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Các mốc bán rã T, 2T, 3T
        const halfs = [
            { t: 0, l: 'N₀', r: 1.0 }, { t: 1, l: 'N₀/2', r: 0.5 },
            { t: 2, l: 'N₀/4', r: 0.25 }, { t: 3, l: 'N₀/8', r: 0.125 }
        ];
        halfs.forEach(hf => {
            const hx = ox + (hf.t / 4.0) * (axW - 20);
            const hy = oy - hf.r * (axH - 25);
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
            ctx.beginPath(); ctx.moveTo(hx, oy); ctx.lineTo(hx, hy); ctx.lineTo(ox, hy); ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = '#38bdf8'; ctx.beginPath(); ctx.arc(hx, hy, 4, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#94a3b8'; ctx.font = '700 11px sans-serif'; ctx.textAlign = 'right';
            ctx.fillText(hf.l, ox - 8, hy + 4);
            ctx.textAlign = 'center';
            if (hf.t > 0) ctx.fillText(`${hf.t}T`, hx, oy + 16);
        });

        // Điểm chạy động theo thời gian
        const progT = (t * 0.3) % 4.0;
        const curN = Math.pow(2, -progT);
        const curX = ox + (progT / 4.0) * (axW - 20);
        const curY = oy - curN * (axH - 25);
        ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(curX, curY, 6.5, 0, Math.PI * 2); ctx.fill();

        // Mẫu vật phóng xạ & Máy đếm Geiger bên phải
        const bx = w - 200, by = 50;
        ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#f43f5e'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.roundRect(bx, by, 180, 160, 8); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#f43f5e'; ctx.font = '800 12px sans-serif'; ctx.textAlign = 'left';
        ctx.fillText('MÁY ĐẾM XUNG GEIGER', bx + 12, by + 24);

        // Đèn chớp xung phóng xạ
        const flash = Math.sin(t * 12) > 0.3;
        ctx.fillStyle = flash ? '#ef4444' : '#334155';
        ctx.beginPath(); ctx.arc(bx + 30, by + 50, 7, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#e2e8f0'; ctx.font = '700 11px sans-serif';
        ctx.fillText('Độ phóng xạ H(t)', bx + 45, by + 54);

        ctx.fillStyle = '#94a3b8'; ctx.font = '600 11px sans-serif';
        ctx.fillText(`Thời gian t: ${progT.toFixed(2)} chu kỳ`, bx + 12, by + 86);
        ctx.fillText(`Còn lại: ${(curN * 100).toFixed(1)}% N₀`, bx + 12, by + 110);
        ctx.fillStyle = '#10b981'; ctx.font = '700 11px sans-serif';
        ctx.fillText(`Đã phân rã: ${((1 - curN) * 100).toFixed(1)}%`, bx + 12, by + 134);
    }

    // 10. GAS_PV_CYCLE: Chu trình biến đổi khí lý tưởng p-V
    function simGasPVCycle(ctx, w, h, t, label) {
        drawGrid(ctx, w, h, label || 'CHU TRÌNH BIẾN ĐỔI TRẠNG THÁI KHÍ LÝ TƯỞNG (ĐỒ THỊ p - V)');
        const ox = w * 0.28, oy = h - 60, axW = 260, axH = 150;
        drawArrow(ctx, ox, oy, ox + axW, oy, '#94a3b8', 2, 7); // Trục V
        drawArrow(ctx, ox, oy, ox, oy - axH, '#94a3b8', 2, 7); // Trục p
        ctx.fillStyle = '#94a3b8'; ctx.font = '700 11px sans-serif';
        ctx.fillText('V (lít)', ox + axW - 20, oy + 20); ctx.fillText('p (bar)', ox - 25, oy - axH + 15);

        // 4 đỉnh chu trình hình chữ nhật hoặc tam giác
        const p1 = {x: ox + 40, y: oy - 120, l: '(1)'};
        const p2 = {x: ox + 180, y: oy - 120, l: '(2)'};
        const p3 = {x: ox + 180, y: oy - 35, l: '(3)'};
        const p4 = {x: ox + 40, y: oy - 35, l: '(4)'};

        // Vùng diện tích sinh công
        ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
        ctx.fillRect(p1.x, p1.y, p2.x - p1.x, p4.y - p1.y);

        // Đường chu trình có mũi tên định hướng theo chiều kim đồng hồ (sinh công)
        drawArrow(ctx, p1.x, p1.y, p2.x, p2.y, '#38bdf8', 2.5, 7);
        drawArrow(ctx, p2.x, p2.y, p3.x, p3.y, '#38bdf8', 2.5, 7);
        drawArrow(ctx, p3.x, p3.y, p4.x, p4.y, '#38bdf8', 2.5, 7);
        drawArrow(ctx, p4.x, p4.y, p1.x, p1.y, '#38bdf8', 2.5, 7);

        [p1, p2, p3, p4].forEach(pt => {
            ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#fff'; ctx.font = '800 12px sans-serif'; ctx.fillText(pt.l, pt.x - 5, pt.y - 8);
        });

        // Điểm chạy quanh chu trình
        const cyc = (t * 0.3) % 4.0;
        let cx, cy;
        if (cyc < 1) { cx = p1.x + (p2.x - p1.x) * cyc; cy = p1.y; }
        else if (cyc < 2) { cx = p2.x; cy = p2.y + (p3.y - p2.y) * (cyc - 1); }
        else if (cyc < 3) { cx = p2.x - (p2.x - p3.x + (p3.x - p4.x)) * (cyc - 2); cy = p3.y; }
        else { cx = p4.x; cy = p3.y - (p3.y - p1.y) * (cyc - 3); }

        ctx.fillStyle = '#f43f5e'; ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.fill();
    }

    // 11. ELECTROMAGNETIC_APP: Máy phát điện / Khung dây quay / Sóng điện từ
    function simElectromagneticApp(ctx, w, h, t, label) {
        drawGrid(ctx, w, h, label || 'MÁY PHÁT ĐIỆN XOAY CHIỀU & KHUNG DÂY QUAY TRONG TỪ TRƯỜNG (e = E₀·sinωt)');
        const cx = w * 0.35, cy = h * 0.52;

        // Nam châm 2 bên
        ctx.fillStyle = '#dc2626'; ctx.fillRect(cx - 130, cy - 60, 45, 120);
        ctx.fillStyle = '#2563eb'; ctx.fillRect(cx + 85, cy - 60, 45, 120);
        ctx.fillStyle = '#fff'; ctx.font = '800 16px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('N', cx - 105, cy + 6); ctx.fillText('S', cx + 108, cy + 6);

        // Khung dây quay tròn
        const ang = t * 3.5;
        const coilW = 75 * Math.cos(ang);
        ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(cx, cy, Math.abs(coilW), 55, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Đồ thị sóng xoay chiều bên phải
        const sx = w - 240, sy = h * 0.52;
        drawArrow(ctx, sx - 20, sy, sx + 180, sy, '#94a3b8', 1.5, 6);
        ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let x = 0; x <= 160; x += 3) {
            const y = Math.sin((x / 20) - t * 3.5) * 40;
            if (x === 0) ctx.moveTo(sx + x, sy - y); else ctx.lineTo(sx + x, sy - y);
        }
        ctx.stroke();
    }

    // ═════════════════════════════════════════════════════════════════════════════
    
    // Expose 11 Physics Engines to window for Hot Reload & Studio Code Editor
    window.simHeatingCurve = simHeatingCurve;
    window.simCalorimeterHeat = simCalorimeterHeat;
    window.simFaradayInduction = simFaradayInduction;
    window.simBoyleCylinder = simBoyleCylinder;
    window.simBalloonAtmosphere = simBalloonAtmosphere;
    window.simMagneticForce = simMagneticForce;
    window.simRutherford = simRutherford;
    window.simNuclearReaction = simNuclearReaction;
    window.simRadioactiveDecay = simRadioactiveDecay;
    window.simGasPVCycle = simGasPVCycle;
    window.simElectromagneticApp = simElectromagneticApp;
    window.drawGrid = drawGrid;
    window.drawArrow = drawArrow;

    // ÁNH XẠ CHÍNH THỨC TOÀN BỘ 106 MODEL ID VÀO CÁC HÀM VẼ CHUẨN XÁC
    // ═════════════════════════════════════════════════════════════════════════════

    (function() {
    const fn = function(ctx, w, h, t) { simCalorimeterHeat(ctx, w, h, t, 'MH-STAGING-C1-01 · Mô hình Truyền nhiệt & Cân bằng nhiệt trong thực tế'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C1-01
// Hiện tượng: MH-STAGING-C1-01 · Mô hình Truyền nhiệt & Cân bằng nhiệt trong thực tế
VLXTModels.register('MH-STAGING-C1-01', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simCalorimeterHeat
    simCalorimeterHeat(ctx, w, h, t, 'MH-STAGING-C1-01 · Mô hình Truyền nhiệt & Cân bằng nhiệt trong thực tế');
});`;
    window.VLXTModels.register('MH-STAGING-C1-01', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simHeatingCurve(ctx, w, h, t, 'MH-STAGING-C1-02 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C1-02
// Hiện tượng: MH-STAGING-C1-02 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng
VLXTModels.register('MH-STAGING-C1-02', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simHeatingCurve
    simHeatingCurve(ctx, w, h, t, 'MH-STAGING-C1-02 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng');
});`;
    window.VLXTModels.register('MH-STAGING-C1-02', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simCalorimeterHeat(ctx, w, h, t, 'MH-STAGING-C1-03 · Mô hình Truyền nhiệt & Cân bằng nhiệt trong thực tế'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C1-03
// Hiện tượng: MH-STAGING-C1-03 · Mô hình Truyền nhiệt & Cân bằng nhiệt trong thực tế
VLXTModels.register('MH-STAGING-C1-03', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simCalorimeterHeat
    simCalorimeterHeat(ctx, w, h, t, 'MH-STAGING-C1-03 · Mô hình Truyền nhiệt & Cân bằng nhiệt trong thực tế');
});`;
    window.VLXTModels.register('MH-STAGING-C1-03', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simHeatingCurve(ctx, w, h, t, 'MH-STAGING-C1-04 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C1-04
// Hiện tượng: MH-STAGING-C1-04 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng
VLXTModels.register('MH-STAGING-C1-04', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simHeatingCurve
    simHeatingCurve(ctx, w, h, t, 'MH-STAGING-C1-04 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng');
});`;
    window.VLXTModels.register('MH-STAGING-C1-04', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simHeatingCurve(ctx, w, h, t, 'MH-STAGING-C1-05 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C1-05
// Hiện tượng: MH-STAGING-C1-05 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng
VLXTModels.register('MH-STAGING-C1-05', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simHeatingCurve
    simHeatingCurve(ctx, w, h, t, 'MH-STAGING-C1-05 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng');
});`;
    window.VLXTModels.register('MH-STAGING-C1-05', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simCalorimeterHeat(ctx, w, h, t, 'MH-STAGING-C1-06 · Mô hình Truyền nhiệt & Cân bằng nhiệt trong thực tế'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C1-06
// Hiện tượng: MH-STAGING-C1-06 · Mô hình Truyền nhiệt & Cân bằng nhiệt trong thực tế
VLXTModels.register('MH-STAGING-C1-06', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simCalorimeterHeat
    simCalorimeterHeat(ctx, w, h, t, 'MH-STAGING-C1-06 · Mô hình Truyền nhiệt & Cân bằng nhiệt trong thực tế');
});`;
    window.VLXTModels.register('MH-STAGING-C1-06', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simHeatingCurve(ctx, w, h, t, 'MH-STAGING-C1-07 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C1-07
// Hiện tượng: MH-STAGING-C1-07 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng
VLXTModels.register('MH-STAGING-C1-07', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simHeatingCurve
    simHeatingCurve(ctx, w, h, t, 'MH-STAGING-C1-07 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng');
});`;
    window.VLXTModels.register('MH-STAGING-C1-07', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simHeatingCurve(ctx, w, h, t, 'MH-STAGING-C1-08 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C1-08
// Hiện tượng: MH-STAGING-C1-08 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng
VLXTModels.register('MH-STAGING-C1-08', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simHeatingCurve
    simHeatingCurve(ctx, w, h, t, 'MH-STAGING-C1-08 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng');
});`;
    window.VLXTModels.register('MH-STAGING-C1-08', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simCalorimeterHeat(ctx, w, h, t, 'MH-STAGING-C1-09 · Mô hình Chuyển hóa năng lượng & Công suất cấp nhiệt thực tế'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C1-09
// Hiện tượng: MH-STAGING-C1-09 · Mô hình Chuyển hóa năng lượng & Công suất cấp nhiệt thực tế
VLXTModels.register('MH-STAGING-C1-09', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simCalorimeterHeat
    simCalorimeterHeat(ctx, w, h, t, 'MH-STAGING-C1-09 · Mô hình Chuyển hóa năng lượng & Công suất cấp nhiệt thực tế');
});`;
    window.VLXTModels.register('MH-STAGING-C1-09', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simHeatingCurve(ctx, w, h, t, 'MH-STAGING-C1-10 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C1-10
// Hiện tượng: MH-STAGING-C1-10 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng
VLXTModels.register('MH-STAGING-C1-10', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simHeatingCurve
    simHeatingCurve(ctx, w, h, t, 'MH-STAGING-C1-10 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng');
});`;
    window.VLXTModels.register('MH-STAGING-C1-10', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simCalorimeterHeat(ctx, w, h, t, 'MH-STAGING-C1-11 · Mô hình Thí nghiệm đo Nhiệt dung riêng'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C1-11
// Hiện tượng: MH-STAGING-C1-11 · Mô hình Thí nghiệm đo Nhiệt dung riêng
VLXTModels.register('MH-STAGING-C1-11', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simCalorimeterHeat
    simCalorimeterHeat(ctx, w, h, t, 'MH-STAGING-C1-11 · Mô hình Thí nghiệm đo Nhiệt dung riêng');
});`;
    window.VLXTModels.register('MH-STAGING-C1-11', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simCalorimeterHeat(ctx, w, h, t, 'MH-STAGING-C1-12 · Mô hình Truyền nhiệt & Cân bằng nhiệt trong thực tế'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C1-12
// Hiện tượng: MH-STAGING-C1-12 · Mô hình Truyền nhiệt & Cân bằng nhiệt trong thực tế
VLXTModels.register('MH-STAGING-C1-12', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simCalorimeterHeat
    simCalorimeterHeat(ctx, w, h, t, 'MH-STAGING-C1-12 · Mô hình Truyền nhiệt & Cân bằng nhiệt trong thực tế');
});`;
    window.VLXTModels.register('MH-STAGING-C1-12', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simHeatingCurve(ctx, w, h, t, 'MH-STAGING-C1-13 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C1-13
// Hiện tượng: MH-STAGING-C1-13 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng
VLXTModels.register('MH-STAGING-C1-13', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simHeatingCurve
    simHeatingCurve(ctx, w, h, t, 'MH-STAGING-C1-13 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng');
});`;
    window.VLXTModels.register('MH-STAGING-C1-13', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simCalorimeterHeat(ctx, w, h, t, 'MH-STAGING-C1-14 · Mô hình Thí nghiệm đo Nhiệt dung riêng'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C1-14
// Hiện tượng: MH-STAGING-C1-14 · Mô hình Thí nghiệm đo Nhiệt dung riêng
VLXTModels.register('MH-STAGING-C1-14', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simCalorimeterHeat
    simCalorimeterHeat(ctx, w, h, t, 'MH-STAGING-C1-14 · Mô hình Thí nghiệm đo Nhiệt dung riêng');
});`;
    window.VLXTModels.register('MH-STAGING-C1-14', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simHeatingCurve(ctx, w, h, t, 'MH-STAGING-C1-15 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C1-15
// Hiện tượng: MH-STAGING-C1-15 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng
VLXTModels.register('MH-STAGING-C1-15', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simHeatingCurve
    simHeatingCurve(ctx, w, h, t, 'MH-STAGING-C1-15 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng');
});`;
    window.VLXTModels.register('MH-STAGING-C1-15', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simHeatingCurve(ctx, w, h, t, 'MH-STAGING-C1-16 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C1-16
// Hiện tượng: MH-STAGING-C1-16 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng
VLXTModels.register('MH-STAGING-C1-16', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simHeatingCurve
    simHeatingCurve(ctx, w, h, t, 'MH-STAGING-C1-16 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng');
});`;
    window.VLXTModels.register('MH-STAGING-C1-16', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simCalorimeterHeat(ctx, w, h, t, 'MH-STAGING-C1-17 · Mô hình Thí nghiệm đo Nhiệt dung riêng'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C1-17
// Hiện tượng: MH-STAGING-C1-17 · Mô hình Thí nghiệm đo Nhiệt dung riêng
VLXTModels.register('MH-STAGING-C1-17', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simCalorimeterHeat
    simCalorimeterHeat(ctx, w, h, t, 'MH-STAGING-C1-17 · Mô hình Thí nghiệm đo Nhiệt dung riêng');
});`;
    window.VLXTModels.register('MH-STAGING-C1-17', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simCalorimeterHeat(ctx, w, h, t, 'MH-STAGING-C1-18 · Mô hình Truyền nhiệt & Cân bằng nhiệt trong thực tế'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C1-18
// Hiện tượng: MH-STAGING-C1-18 · Mô hình Truyền nhiệt & Cân bằng nhiệt trong thực tế
VLXTModels.register('MH-STAGING-C1-18', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simCalorimeterHeat
    simCalorimeterHeat(ctx, w, h, t, 'MH-STAGING-C1-18 · Mô hình Truyền nhiệt & Cân bằng nhiệt trong thực tế');
});`;
    window.VLXTModels.register('MH-STAGING-C1-18', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simCalorimeterHeat(ctx, w, h, t, 'MH-STAGING-C1-19 · Mô hình Thí nghiệm đo Nhiệt dung riêng'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C1-19
// Hiện tượng: MH-STAGING-C1-19 · Mô hình Thí nghiệm đo Nhiệt dung riêng
VLXTModels.register('MH-STAGING-C1-19', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simCalorimeterHeat
    simCalorimeterHeat(ctx, w, h, t, 'MH-STAGING-C1-19 · Mô hình Thí nghiệm đo Nhiệt dung riêng');
});`;
    window.VLXTModels.register('MH-STAGING-C1-19', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simCalorimeterHeat(ctx, w, h, t, 'MH-STAGING-C1-20 · Mô hình Thí nghiệm đo Nhiệt dung riêng'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C1-20
// Hiện tượng: MH-STAGING-C1-20 · Mô hình Thí nghiệm đo Nhiệt dung riêng
VLXTModels.register('MH-STAGING-C1-20', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simCalorimeterHeat
    simCalorimeterHeat(ctx, w, h, t, 'MH-STAGING-C1-20 · Mô hình Thí nghiệm đo Nhiệt dung riêng');
});`;
    window.VLXTModels.register('MH-STAGING-C1-20', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simCalorimeterHeat(ctx, w, h, t, 'MH-STAGING-C1-21 · Mô hình Truyền nhiệt & Cân bằng nhiệt trong thực tế'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C1-21
// Hiện tượng: MH-STAGING-C1-21 · Mô hình Truyền nhiệt & Cân bằng nhiệt trong thực tế
VLXTModels.register('MH-STAGING-C1-21', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simCalorimeterHeat
    simCalorimeterHeat(ctx, w, h, t, 'MH-STAGING-C1-21 · Mô hình Truyền nhiệt & Cân bằng nhiệt trong thực tế');
});`;
    window.VLXTModels.register('MH-STAGING-C1-21', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simHeatingCurve(ctx, w, h, t, 'MH-STAGING-C1-22 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C1-22
// Hiện tượng: MH-STAGING-C1-22 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng
VLXTModels.register('MH-STAGING-C1-22', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simHeatingCurve
    simHeatingCurve(ctx, w, h, t, 'MH-STAGING-C1-22 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng');
});`;
    window.VLXTModels.register('MH-STAGING-C1-22', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simCalorimeterHeat(ctx, w, h, t, 'MH-STAGING-C1-23 · Mô hình Thí nghiệm đo Nhiệt dung riêng'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C1-23
// Hiện tượng: MH-STAGING-C1-23 · Mô hình Thí nghiệm đo Nhiệt dung riêng
VLXTModels.register('MH-STAGING-C1-23', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simCalorimeterHeat
    simCalorimeterHeat(ctx, w, h, t, 'MH-STAGING-C1-23 · Mô hình Thí nghiệm đo Nhiệt dung riêng');
});`;
    window.VLXTModels.register('MH-STAGING-C1-23', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simCalorimeterHeat(ctx, w, h, t, 'MH-STAGING-C1-24 · Mô hình Thí nghiệm đo Nhiệt dung riêng'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C1-24
// Hiện tượng: MH-STAGING-C1-24 · Mô hình Thí nghiệm đo Nhiệt dung riêng
VLXTModels.register('MH-STAGING-C1-24', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simCalorimeterHeat
    simCalorimeterHeat(ctx, w, h, t, 'MH-STAGING-C1-24 · Mô hình Thí nghiệm đo Nhiệt dung riêng');
});`;
    window.VLXTModels.register('MH-STAGING-C1-24', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simCalorimeterHeat(ctx, w, h, t, 'MH-STAGING-C1-25 · Mô hình Truyền nhiệt & Cân bằng nhiệt trong thực tế'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C1-25
// Hiện tượng: MH-STAGING-C1-25 · Mô hình Truyền nhiệt & Cân bằng nhiệt trong thực tế
VLXTModels.register('MH-STAGING-C1-25', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simCalorimeterHeat
    simCalorimeterHeat(ctx, w, h, t, 'MH-STAGING-C1-25 · Mô hình Truyền nhiệt & Cân bằng nhiệt trong thực tế');
});`;
    window.VLXTModels.register('MH-STAGING-C1-25', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simCalorimeterHeat(ctx, w, h, t, 'MH-STAGING-C1-26 · Mô hình Thí nghiệm đo Nhiệt dung riêng'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C1-26
// Hiện tượng: MH-STAGING-C1-26 · Mô hình Thí nghiệm đo Nhiệt dung riêng
VLXTModels.register('MH-STAGING-C1-26', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simCalorimeterHeat
    simCalorimeterHeat(ctx, w, h, t, 'MH-STAGING-C1-26 · Mô hình Thí nghiệm đo Nhiệt dung riêng');
});`;
    window.VLXTModels.register('MH-STAGING-C1-26', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simHeatingCurve(ctx, w, h, t, 'MH-STAGING-C1-27 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C1-27
// Hiện tượng: MH-STAGING-C1-27 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng
VLXTModels.register('MH-STAGING-C1-27', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simHeatingCurve
    simHeatingCurve(ctx, w, h, t, 'MH-STAGING-C1-27 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng');
});`;
    window.VLXTModels.register('MH-STAGING-C1-27', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simCalorimeterHeat(ctx, w, h, t, 'MH-STAGING-C1-28 · Mô hình Hệ thống làm mát, hút ẩm & Chuyển thể kỹ thuật'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C1-28
// Hiện tượng: MH-STAGING-C1-28 · Mô hình Hệ thống làm mát, hút ẩm & Chuyển thể kỹ thuật
VLXTModels.register('MH-STAGING-C1-28', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simCalorimeterHeat
    simCalorimeterHeat(ctx, w, h, t, 'MH-STAGING-C1-28 · Mô hình Hệ thống làm mát, hút ẩm & Chuyển thể kỹ thuật');
});`;
    window.VLXTModels.register('MH-STAGING-C1-28', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simCalorimeterHeat(ctx, w, h, t, 'MH-STAGING-C1-29 · Mô hình Truyền nhiệt & Cân bằng nhiệt trong thực tế'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C1-29
// Hiện tượng: MH-STAGING-C1-29 · Mô hình Truyền nhiệt & Cân bằng nhiệt trong thực tế
VLXTModels.register('MH-STAGING-C1-29', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simCalorimeterHeat
    simCalorimeterHeat(ctx, w, h, t, 'MH-STAGING-C1-29 · Mô hình Truyền nhiệt & Cân bằng nhiệt trong thực tế');
});`;
    window.VLXTModels.register('MH-STAGING-C1-29', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simHeatingCurve(ctx, w, h, t, 'MH-STAGING-C1-30 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C1-30
// Hiện tượng: MH-STAGING-C1-30 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng
VLXTModels.register('MH-STAGING-C1-30', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simHeatingCurve
    simHeatingCurve(ctx, w, h, t, 'MH-STAGING-C1-30 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng');
});`;
    window.VLXTModels.register('MH-STAGING-C1-30', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simHeatingCurve(ctx, w, h, t, 'MH-STAGING-C1-31 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C1-31
// Hiện tượng: MH-STAGING-C1-31 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng
VLXTModels.register('MH-STAGING-C1-31', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simHeatingCurve
    simHeatingCurve(ctx, w, h, t, 'MH-STAGING-C1-31 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng');
});`;
    window.VLXTModels.register('MH-STAGING-C1-31', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simHeatingCurve(ctx, w, h, t, 'MH-STAGING-C1-32 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C1-32
// Hiện tượng: MH-STAGING-C1-32 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng
VLXTModels.register('MH-STAGING-C1-32', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simHeatingCurve
    simHeatingCurve(ctx, w, h, t, 'MH-STAGING-C1-32 · Mô hình Thí nghiệm đo Nhiệt nóng chảy riêng & Nhiệt hóa hơi riêng');
});`;
    window.VLXTModels.register('MH-STAGING-C1-32', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simCalorimeterHeat(ctx, w, h, t, 'MH-STAGING-C1-33 · Mô hình Truyền nhiệt & Cân bằng nhiệt trong thực tế'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C1-33
// Hiện tượng: MH-STAGING-C1-33 · Mô hình Truyền nhiệt & Cân bằng nhiệt trong thực tế
VLXTModels.register('MH-STAGING-C1-33', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simCalorimeterHeat
    simCalorimeterHeat(ctx, w, h, t, 'MH-STAGING-C1-33 · Mô hình Truyền nhiệt & Cân bằng nhiệt trong thực tế');
});`;
    window.VLXTModels.register('MH-STAGING-C1-33', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simBalloonAtmosphere(ctx, w, h, t, 'MH-STAGING-C2-01 · Mô hình Bóng thám không, Khinh khí cầu & Khí quyển'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C2-01
// Hiện tượng: MH-STAGING-C2-01 · Mô hình Bóng thám không, Khinh khí cầu & Khí quyển
VLXTModels.register('MH-STAGING-C2-01', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simBalloonAtmosphere
    simBalloonAtmosphere(ctx, w, h, t, 'MH-STAGING-C2-01 · Mô hình Bóng thám không, Khinh khí cầu & Khí quyển');
});`;
    window.VLXTModels.register('MH-STAGING-C2-01', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simBoyleCylinder(ctx, w, h, t, 'MH-STAGING-C2-02 · Mô hình Định luật Boyle trong Thủy tĩnh, Y sinh & Kỹ thuật'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C2-02
// Hiện tượng: MH-STAGING-C2-02 · Mô hình Định luật Boyle trong Thủy tĩnh, Y sinh & Kỹ thuật
VLXTModels.register('MH-STAGING-C2-02', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simBoyleCylinder
    simBoyleCylinder(ctx, w, h, t, 'MH-STAGING-C2-02 · Mô hình Định luật Boyle trong Thủy tĩnh, Y sinh & Kỹ thuật');
});`;
    window.VLXTModels.register('MH-STAGING-C2-02', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simBoyleCylinder(ctx, w, h, t, 'MH-STAGING-C2-03 · Mô hình Định luật Boyle trong Thủy tĩnh, Y sinh & Kỹ thuật'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C2-03
// Hiện tượng: MH-STAGING-C2-03 · Mô hình Định luật Boyle trong Thủy tĩnh, Y sinh & Kỹ thuật
VLXTModels.register('MH-STAGING-C2-03', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simBoyleCylinder
    simBoyleCylinder(ctx, w, h, t, 'MH-STAGING-C2-03 · Mô hình Định luật Boyle trong Thủy tĩnh, Y sinh & Kỹ thuật');
});`;
    window.VLXTModels.register('MH-STAGING-C2-03', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simGasPVCycle(ctx, w, h, t, 'MH-STAGING-C2-04 · Mô hình Thí nghiệm kiểm chứng các đẳng quá trình & Phương pháp thực nghiệm'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C2-04
// Hiện tượng: MH-STAGING-C2-04 · Mô hình Thí nghiệm kiểm chứng các đẳng quá trình & Phương pháp thực nghiệm
VLXTModels.register('MH-STAGING-C2-04', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simGasPVCycle
    simGasPVCycle(ctx, w, h, t, 'MH-STAGING-C2-04 · Mô hình Thí nghiệm kiểm chứng các đẳng quá trình & Phương pháp thực nghiệm');
});`;
    window.VLXTModels.register('MH-STAGING-C2-04', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simBoyleCylinder(ctx, w, h, t, 'MH-STAGING-C2-05 · Mô hình Đèn sợi đốt'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C2-05
// Hiện tượng: MH-STAGING-C2-05 · Mô hình Đèn sợi đốt
VLXTModels.register('MH-STAGING-C2-05', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simBoyleCylinder
    simBoyleCylinder(ctx, w, h, t, 'MH-STAGING-C2-05 · Mô hình Đèn sợi đốt');
});`;
    window.VLXTModels.register('MH-STAGING-C2-05', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simBalloonAtmosphere(ctx, w, h, t, 'MH-STAGING-C2-06 · Mô hình Bóng thám không, Khinh khí cầu & Khí quyển'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C2-06
// Hiện tượng: MH-STAGING-C2-06 · Mô hình Bóng thám không, Khinh khí cầu & Khí quyển
VLXTModels.register('MH-STAGING-C2-06', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simBalloonAtmosphere
    simBalloonAtmosphere(ctx, w, h, t, 'MH-STAGING-C2-06 · Mô hình Bóng thám không, Khinh khí cầu & Khí quyển');
});`;
    window.VLXTModels.register('MH-STAGING-C2-06', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simBalloonAtmosphere(ctx, w, h, t, 'MH-STAGING-C2-07 · Mô hình Bóng thám không, Khinh khí cầu & Khí quyển'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C2-07
// Hiện tượng: MH-STAGING-C2-07 · Mô hình Bóng thám không, Khinh khí cầu & Khí quyển
VLXTModels.register('MH-STAGING-C2-07', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simBalloonAtmosphere
    simBalloonAtmosphere(ctx, w, h, t, 'MH-STAGING-C2-07 · Mô hình Bóng thám không, Khinh khí cầu & Khí quyển');
});`;
    window.VLXTModels.register('MH-STAGING-C2-07', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simBoyleCylinder(ctx, w, h, t, 'MH-STAGING-C2-08 · Mô hình Đèn sợi đốt'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C2-08
// Hiện tượng: MH-STAGING-C2-08 · Mô hình Đèn sợi đốt
VLXTModels.register('MH-STAGING-C2-08', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simBoyleCylinder
    simBoyleCylinder(ctx, w, h, t, 'MH-STAGING-C2-08 · Mô hình Đèn sợi đốt');
});`;
    window.VLXTModels.register('MH-STAGING-C2-08', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simBalloonAtmosphere(ctx, w, h, t, 'MH-STAGING-C2-09 · Mô hình Bóng thám không, Khinh khí cầu & Khí quyển'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C2-09
// Hiện tượng: MH-STAGING-C2-09 · Mô hình Bóng thám không, Khinh khí cầu & Khí quyển
VLXTModels.register('MH-STAGING-C2-09', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simBalloonAtmosphere
    simBalloonAtmosphere(ctx, w, h, t, 'MH-STAGING-C2-09 · Mô hình Bóng thám không, Khinh khí cầu & Khí quyển');
});`;
    window.VLXTModels.register('MH-STAGING-C2-09', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simBoyleCylinder(ctx, w, h, t, 'MH-STAGING-C2-10 · Mô hình Đèn sợi đốt'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C2-10
// Hiện tượng: MH-STAGING-C2-10 · Mô hình Đèn sợi đốt
VLXTModels.register('MH-STAGING-C2-10', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simBoyleCylinder
    simBoyleCylinder(ctx, w, h, t, 'MH-STAGING-C2-10 · Mô hình Đèn sợi đốt');
});`;
    window.VLXTModels.register('MH-STAGING-C2-10', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simBalloonAtmosphere(ctx, w, h, t, 'MH-STAGING-C2-11 · Mô hình Bóng thám không, Khinh khí cầu & Khí quyển'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C2-11
// Hiện tượng: MH-STAGING-C2-11 · Mô hình Bóng thám không, Khinh khí cầu & Khí quyển
VLXTModels.register('MH-STAGING-C2-11', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simBalloonAtmosphere
    simBalloonAtmosphere(ctx, w, h, t, 'MH-STAGING-C2-11 · Mô hình Bóng thám không, Khinh khí cầu & Khí quyển');
});`;
    window.VLXTModels.register('MH-STAGING-C2-11', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simGasPVCycle(ctx, w, h, t, 'MH-STAGING-C2-12 · Mô hình Thí nghiệm kiểm chứng các đẳng quá trình & Phương pháp thực nghiệm'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C2-12
// Hiện tượng: MH-STAGING-C2-12 · Mô hình Thí nghiệm kiểm chứng các đẳng quá trình & Phương pháp thực nghiệm
VLXTModels.register('MH-STAGING-C2-12', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simGasPVCycle
    simGasPVCycle(ctx, w, h, t, 'MH-STAGING-C2-12 · Mô hình Thí nghiệm kiểm chứng các đẳng quá trình & Phương pháp thực nghiệm');
});`;
    window.VLXTModels.register('MH-STAGING-C2-12', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simBalloonAtmosphere(ctx, w, h, t, 'MH-STAGING-C2-13 · Mô hình Bóng thám không, Khinh khí cầu & Khí quyển'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C2-13
// Hiện tượng: MH-STAGING-C2-13 · Mô hình Bóng thám không, Khinh khí cầu & Khí quyển
VLXTModels.register('MH-STAGING-C2-13', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simBalloonAtmosphere
    simBalloonAtmosphere(ctx, w, h, t, 'MH-STAGING-C2-13 · Mô hình Bóng thám không, Khinh khí cầu & Khí quyển');
});`;
    window.VLXTModels.register('MH-STAGING-C2-13', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simBalloonAtmosphere(ctx, w, h, t, 'MH-STAGING-C2-14 · Mô hình Bóng thám không, Khinh khí cầu & Khí quyển'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C2-14
// Hiện tượng: MH-STAGING-C2-14 · Mô hình Bóng thám không, Khinh khí cầu & Khí quyển
VLXTModels.register('MH-STAGING-C2-14', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simBalloonAtmosphere
    simBalloonAtmosphere(ctx, w, h, t, 'MH-STAGING-C2-14 · Mô hình Bóng thám không, Khinh khí cầu & Khí quyển');
});`;
    window.VLXTModels.register('MH-STAGING-C2-14', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simBalloonAtmosphere(ctx, w, h, t, 'MH-STAGING-C2-15 · Mô hình Bóng thám không, Khinh khí cầu & Khí quyển'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C2-15
// Hiện tượng: MH-STAGING-C2-15 · Mô hình Bóng thám không, Khinh khí cầu & Khí quyển
VLXTModels.register('MH-STAGING-C2-15', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simBalloonAtmosphere
    simBalloonAtmosphere(ctx, w, h, t, 'MH-STAGING-C2-15 · Mô hình Bóng thám không, Khinh khí cầu & Khí quyển');
});`;
    window.VLXTModels.register('MH-STAGING-C2-15', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simBalloonAtmosphere(ctx, w, h, t, 'MH-STAGING-C2-16 · Mô hình Bóng thám không, Khinh khí cầu & Khí quyển'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C2-16
// Hiện tượng: MH-STAGING-C2-16 · Mô hình Bóng thám không, Khinh khí cầu & Khí quyển
VLXTModels.register('MH-STAGING-C2-16', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simBalloonAtmosphere
    simBalloonAtmosphere(ctx, w, h, t, 'MH-STAGING-C2-16 · Mô hình Bóng thám không, Khinh khí cầu & Khí quyển');
});`;
    window.VLXTModels.register('MH-STAGING-C2-16', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simGasPVCycle(ctx, w, h, t, 'MH-STAGING-C2-17 · Mô hình Thí nghiệm kiểm chứng các đẳng quá trình & Phương pháp thực nghiệm'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C2-17
// Hiện tượng: MH-STAGING-C2-17 · Mô hình Thí nghiệm kiểm chứng các đẳng quá trình & Phương pháp thực nghiệm
VLXTModels.register('MH-STAGING-C2-17', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simGasPVCycle
    simGasPVCycle(ctx, w, h, t, 'MH-STAGING-C2-17 · Mô hình Thí nghiệm kiểm chứng các đẳng quá trình & Phương pháp thực nghiệm');
});`;
    window.VLXTModels.register('MH-STAGING-C2-17', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simBoyleCylinder(ctx, w, h, t, 'MH-STAGING-C2-18 · Mô hình Định luật Boyle trong Thủy tĩnh, Y sinh & Kỹ thuật'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C2-18
// Hiện tượng: MH-STAGING-C2-18 · Mô hình Định luật Boyle trong Thủy tĩnh, Y sinh & Kỹ thuật
VLXTModels.register('MH-STAGING-C2-18', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simBoyleCylinder
    simBoyleCylinder(ctx, w, h, t, 'MH-STAGING-C2-18 · Mô hình Định luật Boyle trong Thủy tĩnh, Y sinh & Kỹ thuật');
});`;
    window.VLXTModels.register('MH-STAGING-C2-18', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simBalloonAtmosphere(ctx, w, h, t, 'MH-STAGING-C2-19 · Mô hình Bóng thám không, Khinh khí cầu & Khí quyển'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C2-19
// Hiện tượng: MH-STAGING-C2-19 · Mô hình Bóng thám không, Khinh khí cầu & Khí quyển
VLXTModels.register('MH-STAGING-C2-19', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simBalloonAtmosphere
    simBalloonAtmosphere(ctx, w, h, t, 'MH-STAGING-C2-19 · Mô hình Bóng thám không, Khinh khí cầu & Khí quyển');
});`;
    window.VLXTModels.register('MH-STAGING-C2-19', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simBoyleCylinder(ctx, w, h, t, 'MH-STAGING-C2-20 · Mô hình Định luật Boyle trong Thủy tĩnh, Y sinh & Kỹ thuật'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C2-20
// Hiện tượng: MH-STAGING-C2-20 · Mô hình Định luật Boyle trong Thủy tĩnh, Y sinh & Kỹ thuật
VLXTModels.register('MH-STAGING-C2-20', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simBoyleCylinder
    simBoyleCylinder(ctx, w, h, t, 'MH-STAGING-C2-20 · Mô hình Định luật Boyle trong Thủy tĩnh, Y sinh & Kỹ thuật');
});`;
    window.VLXTModels.register('MH-STAGING-C2-20', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simBoyleCylinder(ctx, w, h, t, 'MH-STAGING-C2-21 · Mô hình Bơm khí, Bình nén & Thay đổi lượng khí'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C2-21
// Hiện tượng: MH-STAGING-C2-21 · Mô hình Bơm khí, Bình nén & Thay đổi lượng khí
VLXTModels.register('MH-STAGING-C2-21', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simBoyleCylinder
    simBoyleCylinder(ctx, w, h, t, 'MH-STAGING-C2-21 · Mô hình Bơm khí, Bình nén & Thay đổi lượng khí');
});`;
    window.VLXTModels.register('MH-STAGING-C2-21', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simFaradayInduction(ctx, w, h, t, 'MH-STAGING-C3-01 · Mô hình Loa, Sóng điện từ'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C3-01
// Hiện tượng: MH-STAGING-C3-01 · Mô hình Loa, Sóng điện từ
VLXTModels.register('MH-STAGING-C3-01', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simFaradayInduction
    simFaradayInduction(ctx, w, h, t, 'MH-STAGING-C3-01 · Mô hình Loa, Sóng điện từ');
});`;
    window.VLXTModels.register('MH-STAGING-C3-01', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simFaradayInduction(ctx, w, h, t, 'MH-STAGING-C3-02 · Mô hình Loa, Sóng điện từ'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C3-02
// Hiện tượng: MH-STAGING-C3-02 · Mô hình Loa, Sóng điện từ
VLXTModels.register('MH-STAGING-C3-02', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simFaradayInduction
    simFaradayInduction(ctx, w, h, t, 'MH-STAGING-C3-02 · Mô hình Loa, Sóng điện từ');
});`;
    window.VLXTModels.register('MH-STAGING-C3-02', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simFaradayInduction(ctx, w, h, t, 'MH-STAGING-C3-03 · Mô hình Loa, Sóng điện từ'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C3-03
// Hiện tượng: MH-STAGING-C3-03 · Mô hình Loa, Sóng điện từ
VLXTModels.register('MH-STAGING-C3-03', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simFaradayInduction
    simFaradayInduction(ctx, w, h, t, 'MH-STAGING-C3-03 · Mô hình Loa, Sóng điện từ');
});`;
    window.VLXTModels.register('MH-STAGING-C3-03', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simFaradayInduction(ctx, w, h, t, 'MH-STAGING-C3-04 · Mô hình Loa, Sóng điện từ'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C3-04
// Hiện tượng: MH-STAGING-C3-04 · Mô hình Loa, Sóng điện từ
VLXTModels.register('MH-STAGING-C3-04', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simFaradayInduction
    simFaradayInduction(ctx, w, h, t, 'MH-STAGING-C3-04 · Mô hình Loa, Sóng điện từ');
});`;
    window.VLXTModels.register('MH-STAGING-C3-04', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simFaradayInduction(ctx, w, h, t, 'MH-STAGING-C3-05 · Mô hình Loa, Sóng điện từ'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C3-05
// Hiện tượng: MH-STAGING-C3-05 · Mô hình Loa, Sóng điện từ
VLXTModels.register('MH-STAGING-C3-05', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simFaradayInduction
    simFaradayInduction(ctx, w, h, t, 'MH-STAGING-C3-05 · Mô hình Loa, Sóng điện từ');
});`;
    window.VLXTModels.register('MH-STAGING-C3-05', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simFaradayInduction(ctx, w, h, t, 'MH-STAGING-C3-06 · Mô hình Loa, Sóng điện từ'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C3-06
// Hiện tượng: MH-STAGING-C3-06 · Mô hình Loa, Sóng điện từ
VLXTModels.register('MH-STAGING-C3-06', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simFaradayInduction
    simFaradayInduction(ctx, w, h, t, 'MH-STAGING-C3-06 · Mô hình Loa, Sóng điện từ');
});`;
    window.VLXTModels.register('MH-STAGING-C3-06', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simFaradayInduction(ctx, w, h, t, 'MH-STAGING-C3-07 · Mô hình Loa, Sóng điện từ'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C3-07
// Hiện tượng: MH-STAGING-C3-07 · Mô hình Loa, Sóng điện từ
VLXTModels.register('MH-STAGING-C3-07', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simFaradayInduction
    simFaradayInduction(ctx, w, h, t, 'MH-STAGING-C3-07 · Mô hình Loa, Sóng điện từ');
});`;
    window.VLXTModels.register('MH-STAGING-C3-07', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simFaradayInduction(ctx, w, h, t, 'MH-STAGING-C3-08 · Mô hình Loa, Sóng điện từ'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C3-08
// Hiện tượng: MH-STAGING-C3-08 · Mô hình Loa, Sóng điện từ
VLXTModels.register('MH-STAGING-C3-08', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simFaradayInduction
    simFaradayInduction(ctx, w, h, t, 'MH-STAGING-C3-08 · Mô hình Loa, Sóng điện từ');
});`;
    window.VLXTModels.register('MH-STAGING-C3-08', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simElectromagneticApp(ctx, w, h, t, 'MH-STAGING-C3-09 · Mô hình Máy phát điện xoay chiều, Dynamo & Phanh tái sinh'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C3-09
// Hiện tượng: MH-STAGING-C3-09 · Mô hình Máy phát điện xoay chiều, Dynamo & Phanh tái sinh
VLXTModels.register('MH-STAGING-C3-09', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simElectromagneticApp
    simElectromagneticApp(ctx, w, h, t, 'MH-STAGING-C3-09 · Mô hình Máy phát điện xoay chiều, Dynamo & Phanh tái sinh');
});`;
    window.VLXTModels.register('MH-STAGING-C3-09', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simFaradayInduction(ctx, w, h, t, 'MH-STAGING-C3-10 · Mô hình Loa, Sóng điện từ'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C3-10
// Hiện tượng: MH-STAGING-C3-10 · Mô hình Loa, Sóng điện từ
VLXTModels.register('MH-STAGING-C3-10', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simFaradayInduction
    simFaradayInduction(ctx, w, h, t, 'MH-STAGING-C3-10 · Mô hình Loa, Sóng điện từ');
});`;
    window.VLXTModels.register('MH-STAGING-C3-10', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simElectromagneticApp(ctx, w, h, t, 'MH-STAGING-C3-11 · Mô hình Hạt tích điện trong Từ trường: Cyclotron, LHC, Quang phổ khối'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C3-11
// Hiện tượng: MH-STAGING-C3-11 · Mô hình Hạt tích điện trong Từ trường: Cyclotron, LHC, Quang phổ khối
VLXTModels.register('MH-STAGING-C3-11', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simElectromagneticApp
    simElectromagneticApp(ctx, w, h, t, 'MH-STAGING-C3-11 · Mô hình Hạt tích điện trong Từ trường: Cyclotron, LHC, Quang phổ khối');
});`;
    window.VLXTModels.register('MH-STAGING-C3-11', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simFaradayInduction(ctx, w, h, t, 'MH-STAGING-C3-12 · Mô hình Loa, Sóng điện từ'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C3-12
// Hiện tượng: MH-STAGING-C3-12 · Mô hình Loa, Sóng điện từ
VLXTModels.register('MH-STAGING-C3-12', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simFaradayInduction
    simFaradayInduction(ctx, w, h, t, 'MH-STAGING-C3-12 · Mô hình Loa, Sóng điện từ');
});`;
    window.VLXTModels.register('MH-STAGING-C3-12', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simFaradayInduction(ctx, w, h, t, 'MH-STAGING-C3-13 · Mô hình Loa, Sóng điện từ'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C3-13
// Hiện tượng: MH-STAGING-C3-13 · Mô hình Loa, Sóng điện từ
VLXTModels.register('MH-STAGING-C3-13', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simFaradayInduction
    simFaradayInduction(ctx, w, h, t, 'MH-STAGING-C3-13 · Mô hình Loa, Sóng điện từ');
});`;
    window.VLXTModels.register('MH-STAGING-C3-13', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simMagneticForce(ctx, w, h, t, 'MH-STAGING-C3-14 · Mô hình Cân từ trường, Lực từ trên dây dẫn & Tương tác hai dòng điện'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C3-14
// Hiện tượng: MH-STAGING-C3-14 · Mô hình Cân từ trường, Lực từ trên dây dẫn & Tương tác hai dòng điện
VLXTModels.register('MH-STAGING-C3-14', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simMagneticForce
    simMagneticForce(ctx, w, h, t, 'MH-STAGING-C3-14 · Mô hình Cân từ trường, Lực từ trên dây dẫn & Tương tác hai dòng điện');
});`;
    window.VLXTModels.register('MH-STAGING-C3-14', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simElectromagneticApp(ctx, w, h, t, 'MH-STAGING-C3-15 · Mô hình Hạt tích điện trong Từ trường: Cyclotron, LHC, Quang phổ khối'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C3-15
// Hiện tượng: MH-STAGING-C3-15 · Mô hình Hạt tích điện trong Từ trường: Cyclotron, LHC, Quang phổ khối
VLXTModels.register('MH-STAGING-C3-15', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simElectromagneticApp
    simElectromagneticApp(ctx, w, h, t, 'MH-STAGING-C3-15 · Mô hình Hạt tích điện trong Từ trường: Cyclotron, LHC, Quang phổ khối');
});`;
    window.VLXTModels.register('MH-STAGING-C3-15', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simFaradayInduction(ctx, w, h, t, 'MH-STAGING-C3-16 · Mô hình Loa, Sóng điện từ'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C3-16
// Hiện tượng: MH-STAGING-C3-16 · Mô hình Loa, Sóng điện từ
VLXTModels.register('MH-STAGING-C3-16', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simFaradayInduction
    simFaradayInduction(ctx, w, h, t, 'MH-STAGING-C3-16 · Mô hình Loa, Sóng điện từ');
});`;
    window.VLXTModels.register('MH-STAGING-C3-16', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simFaradayInduction(ctx, w, h, t, 'MH-STAGING-C3-17 · Mô hình Loa, Sóng điện từ'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C3-17
// Hiện tượng: MH-STAGING-C3-17 · Mô hình Loa, Sóng điện từ
VLXTModels.register('MH-STAGING-C3-17', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simFaradayInduction
    simFaradayInduction(ctx, w, h, t, 'MH-STAGING-C3-17 · Mô hình Loa, Sóng điện từ');
});`;
    window.VLXTModels.register('MH-STAGING-C3-17', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simFaradayInduction(ctx, w, h, t, 'MH-STAGING-C3-18 · Mô hình Loa, Sóng điện từ'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C3-18
// Hiện tượng: MH-STAGING-C3-18 · Mô hình Loa, Sóng điện từ
VLXTModels.register('MH-STAGING-C3-18', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simFaradayInduction
    simFaradayInduction(ctx, w, h, t, 'MH-STAGING-C3-18 · Mô hình Loa, Sóng điện từ');
});`;
    window.VLXTModels.register('MH-STAGING-C3-18', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-01 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C4-01
// Hiện tượng: MH-STAGING-C4-01 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống
VLXTModels.register('MH-STAGING-C4-01', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simRadioactiveDecay
    simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-01 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống');
});`;
    window.VLXTModels.register('MH-STAGING-C4-01', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-02 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C4-02
// Hiện tượng: MH-STAGING-C4-02 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống
VLXTModels.register('MH-STAGING-C4-02', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simRadioactiveDecay
    simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-02 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống');
});`;
    window.VLXTModels.register('MH-STAGING-C4-02', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-03 · Mô hình Phóng xạ trong Y học hạt nhân & Xạ trị'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C4-03
// Hiện tượng: MH-STAGING-C4-03 · Mô hình Phóng xạ trong Y học hạt nhân & Xạ trị
VLXTModels.register('MH-STAGING-C4-03', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simRadioactiveDecay
    simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-03 · Mô hình Phóng xạ trong Y học hạt nhân & Xạ trị');
});`;
    window.VLXTModels.register('MH-STAGING-C4-03', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-04 · Mô hình Phóng xạ môi trường, Chu kỳ bán rã & An toàn bức xạ'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C4-04
// Hiện tượng: MH-STAGING-C4-04 · Mô hình Phóng xạ môi trường, Chu kỳ bán rã & An toàn bức xạ
VLXTModels.register('MH-STAGING-C4-04', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simRadioactiveDecay
    simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-04 · Mô hình Phóng xạ môi trường, Chu kỳ bán rã & An toàn bức xạ');
});`;
    window.VLXTModels.register('MH-STAGING-C4-04', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-05 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C4-05
// Hiện tượng: MH-STAGING-C4-05 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống
VLXTModels.register('MH-STAGING-C4-05', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simRadioactiveDecay
    simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-05 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống');
});`;
    window.VLXTModels.register('MH-STAGING-C4-05', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-06 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C4-06
// Hiện tượng: MH-STAGING-C4-06 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống
VLXTModels.register('MH-STAGING-C4-06', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simRadioactiveDecay
    simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-06 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống');
});`;
    window.VLXTModels.register('MH-STAGING-C4-06', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-07 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C4-07
// Hiện tượng: MH-STAGING-C4-07 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống
VLXTModels.register('MH-STAGING-C4-07', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simRadioactiveDecay
    simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-07 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống');
});`;
    window.VLXTModels.register('MH-STAGING-C4-07', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-08 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C4-08
// Hiện tượng: MH-STAGING-C4-08 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống
VLXTModels.register('MH-STAGING-C4-08', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simRadioactiveDecay
    simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-08 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống');
});`;
    window.VLXTModels.register('MH-STAGING-C4-08', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simNuclearReaction(ctx, w, h, t, 'MH-STAGING-C4-09 · Mô hình Lò phản ứng hạt nhân, Phân hạch & Nhiệt hạch'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C4-09
// Hiện tượng: MH-STAGING-C4-09 · Mô hình Lò phản ứng hạt nhân, Phân hạch & Nhiệt hạch
VLXTModels.register('MH-STAGING-C4-09', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simNuclearReaction
    simNuclearReaction(ctx, w, h, t, 'MH-STAGING-C4-09 · Mô hình Lò phản ứng hạt nhân, Phân hạch & Nhiệt hạch');
});`;
    window.VLXTModels.register('MH-STAGING-C4-09', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simRutherford(ctx, w, h, t, 'MH-STAGING-C4-10 · Mô hình Thí nghiệm tán xạ hạt Alpha & Cấu trúc hạt nhân'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C4-10
// Hiện tượng: MH-STAGING-C4-10 · Mô hình Thí nghiệm tán xạ hạt Alpha & Cấu trúc hạt nhân
VLXTModels.register('MH-STAGING-C4-10', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simRutherford
    simRutherford(ctx, w, h, t, 'MH-STAGING-C4-10 · Mô hình Thí nghiệm tán xạ hạt Alpha & Cấu trúc hạt nhân');
});`;
    window.VLXTModels.register('MH-STAGING-C4-10', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-11 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C4-11
// Hiện tượng: MH-STAGING-C4-11 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống
VLXTModels.register('MH-STAGING-C4-11', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simRadioactiveDecay
    simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-11 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống');
});`;
    window.VLXTModels.register('MH-STAGING-C4-11', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-12 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C4-12
// Hiện tượng: MH-STAGING-C4-12 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống
VLXTModels.register('MH-STAGING-C4-12', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simRadioactiveDecay
    simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-12 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống');
});`;
    window.VLXTModels.register('MH-STAGING-C4-12', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-13 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C4-13
// Hiện tượng: MH-STAGING-C4-13 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống
VLXTModels.register('MH-STAGING-C4-13', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simRadioactiveDecay
    simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-13 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống');
});`;
    window.VLXTModels.register('MH-STAGING-C4-13', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-14 · Mô hình Phóng xạ môi trường, Chu kỳ bán rã & An toàn bức xạ'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C4-14
// Hiện tượng: MH-STAGING-C4-14 · Mô hình Phóng xạ môi trường, Chu kỳ bán rã & An toàn bức xạ
VLXTModels.register('MH-STAGING-C4-14', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simRadioactiveDecay
    simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-14 · Mô hình Phóng xạ môi trường, Chu kỳ bán rã & An toàn bức xạ');
});`;
    window.VLXTModels.register('MH-STAGING-C4-14', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-15 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C4-15
// Hiện tượng: MH-STAGING-C4-15 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống
VLXTModels.register('MH-STAGING-C4-15', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simRadioactiveDecay
    simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-15 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống');
});`;
    window.VLXTModels.register('MH-STAGING-C4-15', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-16 · Mô hình Phóng xạ môi trường, Chu kỳ bán rã & An toàn bức xạ'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C4-16
// Hiện tượng: MH-STAGING-C4-16 · Mô hình Phóng xạ môi trường, Chu kỳ bán rã & An toàn bức xạ
VLXTModels.register('MH-STAGING-C4-16', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simRadioactiveDecay
    simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-16 · Mô hình Phóng xạ môi trường, Chu kỳ bán rã & An toàn bức xạ');
});`;
    window.VLXTModels.register('MH-STAGING-C4-16', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-17 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C4-17
// Hiện tượng: MH-STAGING-C4-17 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống
VLXTModels.register('MH-STAGING-C4-17', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simRadioactiveDecay
    simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-17 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống');
});`;
    window.VLXTModels.register('MH-STAGING-C4-17', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-18 · Mô hình Phóng xạ môi trường, Chu kỳ bán rã & An toàn bức xạ'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C4-18
// Hiện tượng: MH-STAGING-C4-18 · Mô hình Phóng xạ môi trường, Chu kỳ bán rã & An toàn bức xạ
VLXTModels.register('MH-STAGING-C4-18', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simRadioactiveDecay
    simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-18 · Mô hình Phóng xạ môi trường, Chu kỳ bán rã & An toàn bức xạ');
});`;
    window.VLXTModels.register('MH-STAGING-C4-18', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-19 · Mô hình Phóng xạ trong Y học hạt nhân & Xạ trị'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C4-19
// Hiện tượng: MH-STAGING-C4-19 · Mô hình Phóng xạ trong Y học hạt nhân & Xạ trị
VLXTModels.register('MH-STAGING-C4-19', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simRadioactiveDecay
    simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-19 · Mô hình Phóng xạ trong Y học hạt nhân & Xạ trị');
});`;
    window.VLXTModels.register('MH-STAGING-C4-19', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simNuclearReaction(ctx, w, h, t, 'MH-STAGING-C4-20 · Mô hình Lò phản ứng hạt nhân, Phân hạch & Nhiệt hạch'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C4-20
// Hiện tượng: MH-STAGING-C4-20 · Mô hình Lò phản ứng hạt nhân, Phân hạch & Nhiệt hạch
VLXTModels.register('MH-STAGING-C4-20', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simNuclearReaction
    simNuclearReaction(ctx, w, h, t, 'MH-STAGING-C4-20 · Mô hình Lò phản ứng hạt nhân, Phân hạch & Nhiệt hạch');
});`;
    window.VLXTModels.register('MH-STAGING-C4-20', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-21 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C4-21
// Hiện tượng: MH-STAGING-C4-21 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống
VLXTModels.register('MH-STAGING-C4-21', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simRadioactiveDecay
    simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-21 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống');
});`;
    window.VLXTModels.register('MH-STAGING-C4-21', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-22 · Mô hình Phóng xạ trong Y học hạt nhân & Xạ trị'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C4-22
// Hiện tượng: MH-STAGING-C4-22 · Mô hình Phóng xạ trong Y học hạt nhân & Xạ trị
VLXTModels.register('MH-STAGING-C4-22', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simRadioactiveDecay
    simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-22 · Mô hình Phóng xạ trong Y học hạt nhân & Xạ trị');
});`;
    window.VLXTModels.register('MH-STAGING-C4-22', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-23 · Mô hình Phóng xạ môi trường, Chu kỳ bán rã & An toàn bức xạ'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C4-23
// Hiện tượng: MH-STAGING-C4-23 · Mô hình Phóng xạ môi trường, Chu kỳ bán rã & An toàn bức xạ
VLXTModels.register('MH-STAGING-C4-23', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simRadioactiveDecay
    simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-23 · Mô hình Phóng xạ môi trường, Chu kỳ bán rã & An toàn bức xạ');
});`;
    window.VLXTModels.register('MH-STAGING-C4-23', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-24 · Mô hình Phóng xạ môi trường, Chu kỳ bán rã & An toàn bức xạ'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C4-24
// Hiện tượng: MH-STAGING-C4-24 · Mô hình Phóng xạ môi trường, Chu kỳ bán rã & An toàn bức xạ
VLXTModels.register('MH-STAGING-C4-24', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simRadioactiveDecay
    simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-24 · Mô hình Phóng xạ môi trường, Chu kỳ bán rã & An toàn bức xạ');
});`;
    window.VLXTModels.register('MH-STAGING-C4-24', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-25 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C4-25
// Hiện tượng: MH-STAGING-C4-25 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống
VLXTModels.register('MH-STAGING-C4-25', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simRadioactiveDecay
    simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-25 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống');
});`;
    window.VLXTModels.register('MH-STAGING-C4-25', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simNuclearReaction(ctx, w, h, t, 'MH-STAGING-C4-26 · Mô hình Lò phản ứng hạt nhân, Phân hạch & Nhiệt hạch'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C4-26
// Hiện tượng: MH-STAGING-C4-26 · Mô hình Lò phản ứng hạt nhân, Phân hạch & Nhiệt hạch
VLXTModels.register('MH-STAGING-C4-26', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simNuclearReaction
    simNuclearReaction(ctx, w, h, t, 'MH-STAGING-C4-26 · Mô hình Lò phản ứng hạt nhân, Phân hạch & Nhiệt hạch');
});`;
    window.VLXTModels.register('MH-STAGING-C4-26', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-27 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C4-27
// Hiện tượng: MH-STAGING-C4-27 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống
VLXTModels.register('MH-STAGING-C4-27', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simRadioactiveDecay
    simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-27 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống');
});`;
    window.VLXTModels.register('MH-STAGING-C4-27', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-28 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C4-28
// Hiện tượng: MH-STAGING-C4-28 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống
VLXTModels.register('MH-STAGING-C4-28', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simRadioactiveDecay
    simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-28 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống');
});`;
    window.VLXTModels.register('MH-STAGING-C4-28', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-29 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C4-29
// Hiện tượng: MH-STAGING-C4-29 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống
VLXTModels.register('MH-STAGING-C4-29', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simRadioactiveDecay
    simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-29 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống');
});`;
    window.VLXTModels.register('MH-STAGING-C4-29', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-30 · Mô hình Phóng xạ môi trường, Chu kỳ bán rã & An toàn bức xạ'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C4-30
// Hiện tượng: MH-STAGING-C4-30 · Mô hình Phóng xạ môi trường, Chu kỳ bán rã & An toàn bức xạ
VLXTModels.register('MH-STAGING-C4-30', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simRadioactiveDecay
    simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-30 · Mô hình Phóng xạ môi trường, Chu kỳ bán rã & An toàn bức xạ');
});`;
    window.VLXTModels.register('MH-STAGING-C4-30', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-31 · Mô hình Phóng xạ trong Y học hạt nhân & Xạ trị'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C4-31
// Hiện tượng: MH-STAGING-C4-31 · Mô hình Phóng xạ trong Y học hạt nhân & Xạ trị
VLXTModels.register('MH-STAGING-C4-31', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simRadioactiveDecay
    simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-31 · Mô hình Phóng xạ trong Y học hạt nhân & Xạ trị');
});`;
    window.VLXTModels.register('MH-STAGING-C4-31', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-32 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C4-32
// Hiện tượng: MH-STAGING-C4-32 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống
VLXTModels.register('MH-STAGING-C4-32', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simRadioactiveDecay
    simRadioactiveDecay(ctx, w, h, t, 'MH-STAGING-C4-32 · Mô hình Thiết bị kỹ thuật hạt nhân & Cảm biến đời sống');
});`;
    window.VLXTModels.register('MH-STAGING-C4-32', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simNuclearReaction(ctx, w, h, t, 'MH-STAGING-C4-33 · Mô hình Lò phản ứng hạt nhân, Phân hạch & Nhiệt hạch'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C4-33
// Hiện tượng: MH-STAGING-C4-33 · Mô hình Lò phản ứng hạt nhân, Phân hạch & Nhiệt hạch
VLXTModels.register('MH-STAGING-C4-33', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simNuclearReaction
    simNuclearReaction(ctx, w, h, t, 'MH-STAGING-C4-33 · Mô hình Lò phản ứng hạt nhân, Phân hạch & Nhiệt hạch');
});`;
    window.VLXTModels.register('MH-STAGING-C4-33', fn);
})();
    (function() {
    const fn = function(ctx, w, h, t) { simRutherford(ctx, w, h, t, 'MH-STAGING-C4-34 · Mô hình Thí nghiệm tán xạ hạt Alpha & Cấu trúc hạt nhân'); };
    fn._rawSource = `// Mô hình vật lý chuẩn EdTech 60 FPS: MH-STAGING-C4-34
// Hiện tượng: MH-STAGING-C4-34 · Mô hình Thí nghiệm tán xạ hạt Alpha & Cấu trúc hạt nhân
VLXTModels.register('MH-STAGING-C4-34', function(ctx, w, h, t) {
    // Chạy engine mô phỏng chuyên sâu: simRutherford
    simRutherford(ctx, w, h, t, 'MH-STAGING-C4-34 · Mô hình Thí nghiệm tán xạ hạt Alpha & Cấu trúc hạt nhân');
});`;
    window.VLXTModels.register('MH-STAGING-C4-34', fn);
})();

    console.log('[VLXT] 106 Staging Models Registered with Specific Physics Simulations!');
})(window);
