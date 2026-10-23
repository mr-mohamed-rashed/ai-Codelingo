import { OFFICIAL_EXAMS_DATA } from './officialExamsData.mjs';

let totalQ = 0;
for (const [id, exam] of Object.entries(OFFICIAL_EXAMS_DATA)) {
  console.log(`Checking ${id}: ${exam.questions.length} questions`);
  exam.questions.forEach((q, i) => {
    totalQ++;
    if (!q.question) throw new Error(`${id} q${i} missing question`);
    if (!Array.isArray(q.options) || q.options.length < 2) throw new Error(`${id} q${i} invalid options`);
    if (typeof q.correctIndex !== 'number' || q.correctIndex < 0 || q.correctIndex >= q.options.length) {
      throw new Error(`${id} q${i} invalid correctIndex: ${q.correctIndex} (options len: ${q.options.length})`);
    }
    if (!q.explanation) throw new Error(`${id} q${i} missing explanation`);
  });
}
console.log(`SUCCESS: All ${totalQ} questions in all 18 exams are valid!`);
