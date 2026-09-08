import os
import sys
import re
import json
import docx

sys.stdout.reconfigure(encoding='utf-8')

def parse_wed_file(docx_path):
    if not os.path.exists(docx_path):
        raise FileNotFoundError(f'Khong tim thay file: {docx_path}')

    doc = docx.Document(docx_path)
    questions = []
    curr_q = None

    for p in doc.paragraphs:
        t = p.text.strip()
        if not t:
            continue

        # Pattern nhan dien bat dau cau: Cau 1., Cau 2: ...
        m_q = re.match(r'^Câu\s+(\d+)[\.\:](.*)', t, re.IGNORECASE)
        if m_q:
            if curr_q:
                questions.append(curr_q)
            curr_q = {
                'number': int(m_q.group(1)),
                'stem': m_q.group(2).strip(),
                'options': {},
                'correct': None
            }
            continue

        # Pattern phuong an: *A., A., *B), B., ...
        m_opt = re.match(r'^(\*?)\s*([A-D])[\.\:\)]\s*(.*)', t)
        if m_opt and curr_q:
            is_correct = bool(m_opt.group(1))
            letter = m_opt.group(2).upper()
            content = m_opt.group(3).strip()
            curr_q['options'][letter] = content
            if is_correct:
                curr_q['correct'] = letter
            continue

        # Doan noi tiep noi dung
        if curr_q:
            if not curr_q['options']:
                curr_q['stem'] += '\n' + t
            else:
                last_letter = list(curr_q['options'].keys())[-1]
                curr_q['options'][last_letter] += '\n' + t

    if curr_q:
        questions.append(curr_q)

    # Validations
    errors = []
    if len(questions) != 20:
        errors.append(f'So cau khong dung 20 (thuc te: {len(questions)})')

    for q in questions:
        num = q['number']
        opts = q['options']
        for opt_key in ['A', 'B', 'C', 'D']:
            if opt_key not in opts or not opts[opt_key]:
                errors.append(f'Cau {num} thieu lua chon {opt_key}')
        if not q['correct']:
            errors.append(f'Cau {num} khong co dap an danh dau (*)')

    if errors:
        raise ValueError(f'Loi xac thuc file {os.path.basename(docx_path)}:\n' + '\n'.join(errors))

    return questions

def convert_to_video_cau_hoi(questions, timestamps=None):
    items = []
    for i, q in enumerate(questions):
        t_sec = ''
        if timestamps and i < len(timestamps):
            t_sec = timestamps[i].get('timestamp', '')
        items.append({
            'thuTu': i + 1,
            't': t_sec,
            'nhId': '',
            'type': 'mc',
            'q': q['stem'],
            'A': q['options'].get('A', ''),
            'B': q['options'].get('B', ''),
            'C': q['options'].get('C', ''),
            'D': q['options'].get('D', ''),
            'ans': q['correct']
        })
    return items

def convert_to_bai_tap_trac_nghiem(questions):
    items = []
    for i, q in enumerate(questions):
        items.append({
            'thuTu': i + 1,
            'type': 'mc',
            'q': q['stem'],
            'A': q['options'].get('A', ''),
            'B': q['options'].get('B', ''),
            'C': q['options'].get('C', ''),
            'D': q['options'].get('D', ''),
            'correct': q['correct']
        })
    return items

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: py -3.12 parse_wed_docx.py <docx_path> [--output json_path]')
        sys.exit(1)
    p = sys.argv[1]
    res = parse_wed_file(p)
    print(f'Parsed successfully: {len(res)} questions from {os.path.basename(p)}')
    if '--output' in sys.argv:
        out_idx = sys.argv.index('--output') + 1
        with open(sys.argv[out_idx], 'w', encoding='utf-8') as f:
            json.dump(res, f, ensure_ascii=False, indent=2)
