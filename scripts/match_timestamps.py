import os
import sys
import re
import json

VI_NUM_WORDS = {
    1: ['một', '1'],
    2: ['hai', '2'],
    3: ['ba', '3'],
    4: ['bốn', 'tư', '4'],
    5: ['năm', '5'],
    6: ['sáu', '6'],
    7: ['bảy', '7'],
    8: ['tám', '8'],
    9: ['chín', '9'],
    10: ['mười', '10'],
    11: ['mười một', '11'],
    12: ['mười hai', '12'],
    13: ['mười ba', '13'],
    14: ['mười bốn', '14'],
    15: ['mười lăm', 'mười năm', '15'],
    16: ['mười sáu', '16'],
    17: ['mười bảy', '17'],
    18: ['mười tám', '18'],
    19: ['mười chín', '19'],
    20: ['hai mươi', 'hai chục', '20']
}

def extract_keywords(text):
    stop_words = {'câu', 'hỏi', 'cho', 'một', 'các', 'của', 'trong', 'được', 'khi', 'ở', 'và', 'là', 'với', 'có', 'đến', 'theo', 'nào', 'sau', 'đây'}
    words = re.findall(r'\b[a-zA-Zà-ỹÀ-Ỹ0-9_°]+', text.lower())
    return [w for w in words if len(w) > 2 and w not in stop_words]

def match_timestamps(transcript_path, questions):
    with open(transcript_path, 'r', encoding='utf-8') as f:
        segments = json.load(f)

    results = []
    last_raw_time = 0.0

    for q in questions:
        num = q['number']
        stem = q['stem']
        kw = extract_keywords(stem)
        num_patterns = VI_NUM_WORDS.get(num, [str(num)])

        candidates = []
        for s_idx, s in enumerate(segments):
            start = s['start']
            if start < last_raw_time - 10.0:
                continue

            text_lower = s['text'].lower()
            score = 0
            has_num = False

            for np in num_patterns:
                pat = r'\b(?:câu|bài|sang|đến|chữa)\s+(?:số\s+)?' + re.escape(np) + r'\b'
                if re.search(pat, text_lower):
                    score += 60
                    has_num = True
                    break

            if not has_num:
                pat2 = r'\bcâu\s+' + str(num) + r'\b'
                if re.search(pat2, text_lower):
                    score += 55
                    has_num = True

            matched_kw = [k for k in kw if k in text_lower]
            score += len(matched_kw) * 6

            if score > 0:
                exact_start = start
                if s.get('words'):
                    for w in s['words']:
                        wt = w['word'].lower()
                        for np in num_patterns:
                            if np in wt or str(num) in wt:
                                exact_start = w['start']
                                break
                        if exact_start != start:
                            break

                candidates.append({
                    'start': exact_start,
                    'raw_text': s['text'],
                    'score': score,
                    'has_num': has_num,
                    'matched_kw': matched_kw
                })

        best = None
        if candidates:
            valids = [c for c in candidates if c['start'] >= last_raw_time]
            if not valids:
                valids = candidates
            valids.sort(key=lambda c: (-c['score'], c['start']))
            best = valids[0]

        if best:
            raw_t = best['start']
            last_raw_time = raw_t
            buffered_t = max(0, int(round(raw_t - 3.0)))
            conf = 'HIGH' if best['score'] >= 60 else ('MEDIUM' if best['score'] >= 30 else 'LOW')
            ev = best['raw_text']
            raw_val = round(raw_t, 2)
            sc = best['score']
        else:
            buffered_t = None
            raw_val = None
            conf = 'LOW'
            ev = 'Không tìm thấy segment phù hợp'
            sc = 0

        results.append({
            'question_number': num,
            'timestamp': buffered_t,
            'raw_timestamp': raw_val,
            'confidence': conf,
            'score': sc,
            'evidence': ev
        })

    return results

def generate_md_report(res, out_md):
    lines = [
        '# BÁO CÁO ĐỐI SOÁT 20 MỐC THỜI GIAN VIDEO BÀI GIẢNG',
        '',
        '| Câu | Mốc Web (giây) | Mốc Web (mm:ss) | Raw (s) | Confidence | Transcript Evidence |',
        '|:---:|:---:|:---:|:---:|:---:|:---|'
    ]
    for r in res:
        q_num = r['question_number']
        t = r['timestamp']
        if t is not None:
            mm = t // 60
            ss = t % 60
            f_time = '{:02d}:{:02d}'.format(mm, ss)
            t_str = str(t)
        else:
            f_time = 'N/A'
            t_str = 'N/A'
        r_str = '{:.1f}'.format(r['raw_timestamp']) if r['raw_timestamp'] is not None else 'N/A'
        ev = r['evidence'].replace('|', '&#124;').replace('\n', ' ')[:80]
        conf = r['confidence']
        lines.append('| Câu {} | {} | {} | {} | {} | {} |'.format(q_num, t_str, f_time, r_str, conf, ev))

    with open(out_md, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines) + '\n')

if __name__ == '__main__':
    if len(sys.argv) < 4:
        print('Usage: py -3.12 match_timestamps.py <transcript_json> <wed_docx> <output_json> [output_md]')
        sys.exit(1)
    from parse_wed_docx import parse_wed_file
    tr_p = sys.argv[1]
    docx_p = sys.argv[2]
    out_j = sys.argv[3]
    out_m = sys.argv[4] if len(sys.argv) > 4 else out_j.replace('.json', '.md')

    qs = parse_wed_file(docx_p)
    res = match_timestamps(tr_p, qs)
    with open(out_j, 'w', encoding='utf-8') as f:
        json.dump(res, f, ensure_ascii=False, indent=2)
    generate_md_report(res, out_m)
    print('Matched {} timestamps -> {} & {}'.format(len(res), out_j, out_m))
