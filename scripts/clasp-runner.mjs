import { spawn } from 'child_process';

export function runClasp(args, cwd = process.cwd()) {
  return new Promise((resolve, reject) => {
    const cmdLine = 'clasp.cmd ' + args.map(a => /\s/.test(a) ? `"${a.replace(/"/g, '""')}"` : a).join(' ');
    console.log(`[CLASP] Running: ${cmdLine}`);
    const child = spawn(cmdLine, [], {
      cwd,
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', d => {
      const text = d.toString();
      stdout += text;
      process.stdout.write(text);
    });

    child.stderr.on('data', d => {
      const text = d.toString();
      stderr += text;
      process.stderr.write(text);
    });

    child.on('close', code => {
      console.log(`[CLASP] Exit code: ${code}`);
      if (code === 0) {
        resolve({ stdout, stderr, code });
      } else {
        reject(new Error(`clasp failed with code ${code}: ${stderr || stdout}`));
      }
    });

    child.on('error', err => {
      reject(err);
    });
  });
}

if (process.argv[1] && process.argv[1].endsWith('clasp-runner.mjs')) {
  const args = process.argv.slice(2);
  runClasp(args).catch(err => {
    console.error('Clasp runner error:', err.message);
    process.exit(1);
  });
}
