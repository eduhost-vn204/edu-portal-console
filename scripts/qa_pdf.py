import os
import sys
import json
import hashlib
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')

def qa_single_pdf(p, out_dir):
    if not os.path.exists(p):
        return {'path': p, 'ok': False, 'error': 'File not found'}
    sz = os.path.getsize(p)
    if sz == 0:
        return {'path': p, 'ok': False, 'error': 'Empty file'}
    with open(p, 'rb') as f:
        h = hashlib.sha256(f.read()).hexdigest()
    doc = pymupdf.open(p)
    cnt = len(doc)
    img_rel = None
    if cnt > 0:
        pix = doc[0].get_pixmap(dpi=150)
        img_name = os.path.splitext(os.path.basename(p))[0] + '_page1.png'
        img_path = os.path.join(out_dir, img_name)
        pix.save(img_path)
        img_rel = img_name
    txt = doc[0].get_text()[:200].replace('\n', ' ') if cnt > 0 else ''
    doc.close()
    return {
        'file': os.path.basename(p),
        'path': p,
        'size_bytes': sz,
        'sha256': h,
        'page_count': cnt,
        'sample_text': txt,
        'preview_img': img_rel,
        'ok': True
    }

def qa_all_pdfs(pdfs, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    res = [qa_single_pdf(p, out_dir) for p in pdfs]
    for r in res:
        st = 'PASS' if r.get('ok') else 'FAIL'
        f_name = r.get('file', '')
        pg = r.get('page_count', 0)
        sz = r.get('size_bytes', 0)
        print(f'[{st}] {f_name} - {pg} pages, {sz} bytes')
    rep = os.path.join(out_dir, 'pdf_qa_report.json')
    with open(rep, 'w', encoding='utf-8') as f:
        json.dump(res, f, ensure_ascii=False, indent=2)
    print(f'Saved QA report to {rep}')
    return res

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print('Usage: py -3.12 qa_pdf.py <output_dir> <pdf1> [pdf2 ...]')
        sys.exit(1)
    out = sys.argv[1]
    qa_all_pdfs(sys.argv[2:], out)
