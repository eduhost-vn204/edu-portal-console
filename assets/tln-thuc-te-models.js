/**
 * VLXT_TLN_MODELS — Thư viện Mô hình SVG Trả Lời Ngắn (Phần III)
 * Tuân thủ nghiêm ngặt AGENTS.md:
 * - Phẳng, sắc nét, tương phản cao, chuẩn EdTech quốc tế.
 * - Tuyệt đối CẤM AI GLOW / drop-shadow nhòe / neon ảo.
 */
(function() {
    window.VLXT_TLN_MODELS = window.VLXT_TLN_MODELS || {};

    window.VLXT_TLN_MODELS['MH-TLN-2026-03'] = {
        id: 'MH-TLN-2026-03',
        title: 'Thanh kim loại trượt trên hai thanh ray trong từ trường đều',
        svg: `<svg viewBox="0 0 680 320" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" style="background:#0f172a;border-radius:10px;border:1px solid #334155;display:block;margin:0 auto;max-width:680px">
            <!-- Khung bao & lưới tọa độ nhẹ -->
            <rect x="0" y="0" width="680" height="320" fill="#0f172a" rx="10"/>
            <pattern id="grid-tln" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" stroke-width="1"/>
            </pattern>
            <rect width="680" height="320" fill="url(#grid-tln)" opacity="0.6"/>

            <!-- Hai thanh ray kim loại song song -->
            <!-- Ray trên -->
            <rect x="70" y="60" width="540" height="12" fill="#94a3b8" rx="3" stroke="#475569" stroke-width="1.5"/>
            <!-- Ray dưới -->
            <rect x="70" y="240" width="540" height="12" fill="#94a3b8" rx="3" stroke="#475569" stroke-width="1.5"/>

            <!-- Dây dẫn nối bên phải tạo mạch kín -->
            <rect x="598" y="60" width="12" height="192" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5"/>

            <!-- Thanh kim loại trượt thẳng đứng -->
            <g id="sliding-rod">
                <rect x="330" y="52" width="18" height="208" fill="#3b82f6" rx="4" stroke="#1d4ed8" stroke-width="2"/>
                <!-- Tiếp điểm điện -->
                <circle cx="339" cy="66" r="5" fill="#f59e0b"/>
                <circle cx="339" cy="246" r="5" fill="#f59e0b"/>
                <!-- Nhãn thanh trượt R -->
                <text x="339" y="160" fill="#ffffff" font-family="'Plus Jakarta Sans',sans-serif" font-size="13" font-weight="700" text-anchor="middle">R</text>
            </g>

            <!-- Vector vận tốc v hướng sang trái -->
            <g id="velocity-vector">
                <defs>
                    <marker id="arrow-v" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 10 0 L 0 5 L 10 10 z" fill="#f87171"/>
                    </marker>
                </defs>
                <line x1="320" y1="156" x2="200" y2="156" stroke="#f87171" stroke-width="3.5" marker-end="url(#arrow-v)"/>
                <text x="250" y="142" fill="#f87171" font-family="'Plus Jakarta Sans',sans-serif" font-size="18" font-weight="700" text-anchor="middle">v⃗</text>
            </g>

            <!-- Kích thước chiều dài l giữa 2 ray -->
            <g id="dimension-l">
                <line x1="120" y1="78" x2="120" y2="234" stroke="#e2e8f0" stroke-width="1.5" stroke-dasharray="3 3"/>
                <line x1="112" y1="78" x2="128" y2="78" stroke="#e2e8f0" stroke-width="2"/>
                <line x1="112" y1="234" x2="128" y2="234" stroke="#e2e8f0" stroke-width="2"/>
                <!-- Mũi tên 2 đầu -->
                <path d="M 120 86 L 116 94 L 124 94 Z" fill="#e2e8f0"/>
                <path d="M 120 226 L 116 218 L 124 218 Z" fill="#e2e8f0"/>
                <text x="100" y="162" fill="#f1f5f9" font-family="'Plus Jakarta Sans',sans-serif" font-size="20" font-weight="700" font-style="italic" text-anchor="middle">ℓ</text>
            </g>

            <!-- Vùng từ trường đều B hướng ra khỏi mặt phẳng hình vẽ (Ký hiệu vòng tròn có chấm ở tâm ⊙) -->
            <g id="magnetic-field-out">
                <!-- Hàng 1 -->
                <circle cx="430" cy="110" r="14" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
                <circle cx="430" cy="110" r="4.5" fill="#38bdf8"/>

                <circle cx="520" cy="110" r="14" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
                <circle cx="520" cy="110" r="4.5" fill="#38bdf8"/>

                <!-- Hàng 2 -->
                <circle cx="430" cy="200" r="14" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
                <circle cx="430" cy="200" r="4.5" fill="#38bdf8"/>

                <circle cx="520" cy="200" r="14" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
                <circle cx="520" cy="200" r="4.5" fill="#38bdf8"/>

                <!-- Nhãn Vector B -->
                <circle cx="500" cy="155" r="18" fill="#0284c7" stroke="#e0f2fe" stroke-width="2"/>
                <circle cx="500" cy="155" r="5" fill="#ffffff"/>
                <text x="546" y="162" fill="#38bdf8" font-family="'Plus Jakarta Sans',sans-serif" font-size="22" font-weight="700">B⃗</text>
            </g>

            <!-- Chú thích chân trang đồ họa -->
            <rect x="70" y="275" width="540" height="30" fill="#1e293b" rx="6"/>
            <text x="340" y="295" fill="#94a3b8" font-family="'Plus Jakarta Sans',sans-serif" font-size="12" font-weight="500" text-anchor="middle">
                Sơ đồ thanh ray trượt kim loại trong từ trường đều vuông góc hướng ra ngoài mặt phẳng (⊙ B⃗)
            </text>
        </svg>`
    };
})();
