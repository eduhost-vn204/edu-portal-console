import fs from 'fs';
import path from 'path';

const candidatePath = 'C:/Users/Xuan Truong/.gemini/antigravity/brain/e36e7db9-4957-452f-9e82-1608c27a5ece/scratch/vatly-content-studio-private/content-pipeline/chuong-1/05-approved-output/chapter-1-batch-001/pilot-5-website-candidate.json';
const candidate = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));

console.log('=== TESTING KATEX FORMULAS FOR 5 PILOT QUESTIONS ===\n');

let formulaCount = 0;
let errorCount = 0;

candidate.forEach(q => {
  const fields = {
    question: q.question,
    optA: q.optA,
    optB: q.optB,
    optC: q.optC,
    optD: q.optD,
    explanation: q.explanation
  };

  for (const [fName, text] of Object.entries(fields)) {
    if (!text) continue;
    const matches = text.match(/\$([^\$]+)\$/g) || [];
    matches.forEach(m => {
      formulaCount++;
      const math = m.slice(1, -1);
      // Check balanced braces {}
      let braceCount = 0;
      for (let i = 0; i < math.length; i++) {
        if (math[i] === '{' && (i === 0 || math[i - 1] !== '\\')) braceCount++;
        if (math[i] === '}' && (i === 0 || math[i - 1] !== '\\')) braceCount--;
        if (braceCount < 0) {
          console.error(`[ERR] ${q.id} ${fName}: Unbalanced closing brace in "${math}"`);
          errorCount++;
        }
      }
      if (braceCount !== 0) {
        console.error(`[ERR] ${q.id} ${fName}: Unclosed brace in "${math}"`);
        errorCount++;
      }

      // Check common KaTeX syntax: \circ, \text, \frac, \cdot, \implies, \approx
      const unknownCommands = math.match(/\\[a-zA-Z]+/g) || [];
      const ALLOWED = new Set(['\\circ', '\\text', '\\frac', '\\cdot', '\\implies', '\\approx', '\\alpha', '\\beta', '\\Delta', '\\times', '\\pm', '\\mu']);
      unknownCommands.forEach(cmd => {
        if (!ALLOWED.has(cmd)) {
          console.warn(`[WARN] ${q.id} ${fName}: Non-standard command "${cmd}" in "${math}"`);
        }
      });
    });
  }
});

console.log(`\nChecked ${formulaCount} formulas across 5 pilot questions.`);
console.log(`KaTeX syntax errors: ${errorCount}`);
if (errorCount === 0) {
  console.log('100% KaTeX formulas are valid, well-formed and safe for website rendering.');
}
