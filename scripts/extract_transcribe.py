import os
import sys
import json
import time
import hashlib
import subprocess

sys.stdout.reconfigure(encoding='utf-8')

def get_file_hash(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

def format_timestamp_srt(seconds):
    millis = int(round((seconds - int(seconds)) * 1000))
    secs = int(seconds) % 60
    mins = (int(seconds) // 60) % 60
    hours = int(seconds) // 3600
    return f'{hours:02d}:{mins:02d}:{secs:02d},{millis:03d}'

def format_timestamp_vtt(seconds):
    millis = int(round((seconds - int(seconds)) * 1000))
    secs = int(seconds) % 60
    mins = (int(seconds) // 60) % 60
    hours = int(seconds) // 3600
    return f'{hours:02d}:{mins:02d}:{secs:02d}.{millis:03d}'

def extract_audio(video_path, audio_path):
    print(f'[Audio] Dang trich xuat audio tu: {os.path.basename(video_path)}...')
    cmd = [
        'ffmpeg', '-y', '-i', video_path,
        '-vn', '-acodec', 'pcm_s16le', '-ar', '16000', '-ac', '1',
        audio_path
    ]
    res = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True, encoding='utf-8', errors='replace')
    if res.returncode != 0:
        raise RuntimeError(f'FFmpeg error: {res.stderr}')
    print(f'[Audio] Trich xuat audio thanh cong -> {os.path.basename(audio_path)} ({os.path.getsize(audio_path)} bytes)')

def transcribe(video_path, output_dir, model_name='base', force=False):
    os.makedirs(output_dir, exist_ok=True)
    transcript_json = os.path.join(output_dir, 'transcript.json')
    srt_path = os.path.join(output_dir, 'subtitles.srt')
    vtt_path = os.path.join(output_dir, 'subtitles.vtt')
    meta_json = os.path.join(output_dir, 'transcribe_meta.json')
    audio_path = os.path.join(output_dir, 'audio_16k.wav')

    video_hash = get_file_hash(video_path)
    if not force and os.path.exists(transcript_json) and os.path.exists(meta_json):
        try:
            with open(meta_json, 'r', encoding='utf-8') as f:
                meta = json.load(f)
            if meta.get('video_hash') == video_hash:
                print(f'[Transcribe] Transcript da ton tai va hash video khop. Bo qua chay lai.')
                return meta
        except Exception:
            pass

    if not os.path.exists(audio_path) or force:
        extract_audio(video_path, audio_path)

    from faster_whisper import WhisperModel

    print(f'[Transcribe] Khoi tao mo hinh Faster-Whisper ({model_name})...')
    device = 'cuda'
    compute_type = 'float16'
    try:
        model = WhisperModel(model_name, device=device, compute_type=compute_type)
        print(f'[Transcribe] Dang dung thiet bi: CUDA (float16)')
    except Exception as e:
        print(f'[Transcribe] Khong the tai CUDA ({e}), fallback sang CPU (int8)...')
        device = 'cpu'
        compute_type = 'int8'
        model = WhisperModel(model_name, device=device, compute_type=compute_type)

    start_time = time.time()
    print(f'[Transcribe] Dang nhan dang tieng Viet voi word timestamps...')
    segments, info = model.transcribe(
        audio_path,
        language='vi',
        task='transcribe',
        word_timestamps=True,
        beam_size=5,
        vad_filter=True,
        vad_parameters=dict(min_silence_duration_ms=500)
    )

    all_segments = []
    srt_lines = []
    vtt_lines = ['WEBVTT\n']
    seg_idx = 1
    total_conf = 0.0
    conf_count = 0

    print(f'[Transcribe] Audio duration: {info.duration:.1f}s, Language prob: {info.language_probability:.2f}')

    for s in segments:
        words = []
        if s.words:
            for w in s.words:
                words.append({
                    'start': round(w.start, 2),
                    'end': round(w.end, 2),
                    'word': w.word.strip(),
                    'probability': round(w.probability, 4)
                })
                total_conf += w.probability
                conf_count += 1

        seg_data = {
            'id': s.id,
            'seek': s.seek,
            'start': round(s.start, 2),
            'end': round(s.end, 2),
            'text': s.text.strip(),
            'avg_logprob': round(s.avg_logprob, 4),
            'no_speech_prob': round(s.no_speech_prob, 4),
            'words': words
        }
        all_segments.append(seg_data)

        srt_lines.append(f'{seg_idx}')
        srt_lines.append(f'{format_timestamp_srt(s.start)} --> {format_timestamp_srt(s.end)}')
        srt_lines.append(f'{s.text.strip()}\n')

        vtt_lines.append(f'{seg_idx}')
        vtt_lines.append(f'{format_timestamp_vtt(s.start)} --> {format_timestamp_vtt(s.end)}')
        vtt_lines.append(f'{s.text.strip()}\n')

        if seg_idx % 25 == 0:
            print(f'  [Progress] Segment {seg_idx}: {s.start:.1f}s -> {s.end:.1f}s | {s.text[:50]}...')

        seg_idx += 1

    elapsed = time.time() - start_time
    avg_conf = (total_conf / conf_count) if conf_count > 0 else 0.0

    print(f'[Transcribe] Hoan tat nhan dang trong {elapsed:.1f}s. So segments: {len(all_segments)}, Avg confidence: {avg_conf:.4f}')

    with open(transcript_json, 'w', encoding='utf-8') as f:
        json.dump(all_segments, f, ensure_ascii=False, indent=2)

    with open(srt_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(srt_lines))

    with open(vtt_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(vtt_lines))

    meta = {
        'video_path': video_path,
        'video_hash': video_hash,
        'duration': info.duration,
        'language': info.language,
        'language_probability': info.language_probability,
        'model': model_name,
        'device': device,
        'compute_type': compute_type,
        'segments_count': len(all_segments),
        'words_count': conf_count,
        'avg_confidence': round(avg_conf, 4),
        'elapsed_seconds': round(elapsed, 2),
        'created_at': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
    }

    with open(meta_json, 'w', encoding='utf-8') as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)

    print(f'[Transcribe] Da luu day du:')
    print(f'  - {transcript_json}')
    print(f'  - {srt_path}')
    print(f'  - {vtt_path}')
    print(f'  - {meta_json}')

    return meta

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print('Usage: py -3.12 extract_transcribe.py <video_path> <output_dir> [model_name] [--force]')
        sys.exit(1)
    vid = sys.argv[1]
    out = sys.argv[2]
    model = sys.argv[3] if len(sys.argv) > 3 and not sys.argv[3].startswith('--') else 'base'
    force = '--force' in sys.argv
    transcribe(vid, out, model_name=model, force=force)
