const { CURRICULUM_DATA, CHAPTERS_METADATA } = require('../src/data/curriculumData.js');
const { CURRICULUM_ENGLISH, getLocalizedChunk } = require('../src/data/curriculumEnglish.js');

console.log('====================================================');
console.log('🧪 VERIFYING ENGLISH LOCALIZATION INTEGRITY');
console.log('====================================================');

let totalNodes = CURRICULUM_DATA.length;
let passedNodes = 0;
let totalCards = 0;
let totalTerms = 0;
let totalPoolQuestions = 0;
let totalExamQuestions = 0;
let errors = [];

CURRICULUM_DATA.forEach((chunk, index) => {
  const en = CURRICULUM_ENGLISH[chunk.id];
  if (!en) {
    errors.push(`Node ${chunk.id} (${chunk.chunkTitle || chunk.lessonTitle}) is MISSING from CURRICULUM_ENGLISH!`);
    return;
  }

  // Test getLocalizedChunk
  const localized = getLocalizedChunk(chunk, 'en');
  if (!localized.chunkTitle || localized.chunkTitle === chunk.chunkTitle) {
    if (chunk.type !== 'lesson_exam') {
      errors.push(`Node ${chunk.id}: chunkTitle not localized: "${localized.chunkTitle}"`);
    }
  }

  if (chunk.type === 'chunk') {
    if (!localized.contentCards || localized.contentCards.length === 0) {
      errors.push(`Node ${chunk.id}: contentCards missing or empty`);
    } else {
      totalCards += localized.contentCards.length;
    }

    if (!localized.keyTerms || localized.keyTerms.length === 0) {
      errors.push(`Node ${chunk.id}: keyTerms missing or empty`);
    } else {
      totalTerms += localized.keyTerms.length;
    }

    if (!localized.questionPool || localized.questionPool.length === 0) {
      errors.push(`Node ${chunk.id}: questionPool missing or empty`);
    } else {
      totalPoolQuestions += localized.questionPool.length;
      localized.questionPool.forEach((q, qIdx) => {
        if (q.level === 'mcq') {
          if (!Array.isArray(q.options) || q.options.length < 2) {
            errors.push(`Node ${chunk.id} q${qIdx} (mcq): invalid options`);
          }
          if (typeof q.correctIndex !== 'number' || q.correctIndex < 0 || q.correctIndex >= q.options.length) {
            errors.push(`Node ${chunk.id} q${qIdx} (mcq): correctIndex ${q.correctIndex} out of bounds`);
          }
        } else if (q.level === 'true_false') {
          if (typeof q.isTrue !== 'boolean') {
            errors.push(`Node ${chunk.id} q${qIdx} (true_false): isTrue is not boolean (${q.isTrue})`);
          }
        } else if (q.level === 'timed_fill') {
          if (!Array.isArray(q.options) || !q.options.includes(q.missingWord)) {
            errors.push(`Node ${chunk.id} q${qIdx} (timed_fill): missingWord "${q.missingWord}" not in options [${q.options.join(', ')}]`);
          }
        }
      });
    }
  } else if (chunk.type === 'lesson_exam') {
    if (!localized.examQuestions || localized.examQuestions.length === 0) {
      errors.push(`Node ${chunk.id}: examQuestions missing or empty`);
    } else {
      totalExamQuestions += localized.examQuestions.length;
      localized.examQuestions.forEach((q, qIdx) => {
        if (!Array.isArray(q.options) || q.options.length < 2) {
          errors.push(`Node ${chunk.id} exam-q${qIdx}: invalid options`);
        }
        if (typeof q.correctIndex !== 'number' || q.correctIndex < 0 || q.correctIndex >= q.options.length) {
          errors.push(`Node ${chunk.id} exam-q${qIdx}: correctIndex ${q.correctIndex} out of bounds`);
        }
      });
    }
  }

  passedNodes++;
});

console.log(`✓ Total Curriculum Nodes checked: ${totalNodes}`);
console.log(`✓ Passed Nodes: ${passedNodes} / ${totalNodes}`);
console.log(`✓ Total Content Cards localized: ${totalCards}`);
console.log(`✓ Total Key Terms localized: ${totalTerms}`);
console.log(`✓ Total Pool Questions localized: ${totalPoolQuestions}`);
console.log(`✓ Total Boss Exam Questions localized: ${totalExamQuestions}`);
console.log(`✓ Total All Questions: ${totalPoolQuestions + totalExamQuestions}`);

if (errors.length > 0) {
  console.error('\n❌ Validation Errors Found:');
  errors.forEach(err => console.error('  - ' + err));
  process.exit(1);
} else {
  console.log('\n🎉 ALL INTEGRITY CHECKS PASSED WITH 100% SUCCESS!');
}
