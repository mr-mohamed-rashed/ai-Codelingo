const fs = require('fs');
const path = require('path');

const { NEW_QUESTIONS_DATA: ch1Data } = require('./data_ch1_8q.cjs');
const { CH234_QUESTIONS: ch234Data } = require('./data_ch234_8q.cjs');

const ALL_NEW_QUESTIONS = {
  ...ch1Data,
  ...ch234Data
};

console.log('Total chunks to expand to 8 questions:', Object.keys(ALL_NEW_QUESTIONS).length);

// 1. Load curriculumData.js content
const curriculumDataPath = path.join(__dirname, '../src/data/curriculumData.js');

// We can load using node dynamic import or read and evaluate
async function run() {
  const { CURRICULUM_DATA, CHAPTERS_METADATA } = await import('../src/data/curriculumData.js');
  const { CURRICULUM_ENGLISH, getLocalizedChunk } = await import('../src/data/curriculumEnglish.js');

  let updatedChunksCount = 0;

  // Process CURRICULUM_DATA (Arabic)
  const updatedCurriculumData = CURRICULUM_DATA.map(node => {
    if (node.type !== 'chunk') return node;

    const newQuestions = ALL_NEW_QUESTIONS[node.id];
    if (!newQuestions) {
      console.warn(`No new questions defined for ${node.id}`);
      return node;
    }

    const currentPool = node.questionPool || [];
    // Current questions: q1, q1_alt, q2, q2_alt, q3, q3_alt
    // We want 8 questions in order:
    // 0: q1 (mcq)
    // 1: q1_alt (mcq)
    // 2: q2 (true_false)
    // 3: q2_alt (true_false)
    // 4: q_best (best_choice)
    // 5: q3 (timed_fill)
    // 6: q_reinforce (mcq or timed_fill)
    // 7: q3_alt (timed_fill)
    const q1 = currentPool.find(q => q.id === 'q1') || currentPool[0];
    const q1_alt = currentPool.find(q => q.id === 'q1_alt') || currentPool[1];
    const q2 = currentPool.find(q => q.id === 'q2') || currentPool[2];
    const q2_alt = currentPool.find(q => q.id === 'q2_alt') || currentPool[3];
    const q3 = currentPool.find(q => q.id === 'q3') || currentPool[4];
    const q3_alt = currentPool.find(q => q.id === 'q3_alt') || currentPool[5];

    const q_best = newQuestions.ar.find(q => q.id === 'q_best');
    const q_reinforce = newQuestions.ar.find(q => q.id === 'q_reinforce');

    const eightPool = [
      q1,
      q1_alt,
      q2,
      q2_alt,
      q_best,
      q3,
      q_reinforce,
      q3_alt
    ].filter(Boolean);

    updatedChunksCount++;
    return {
      ...node,
      questionPool: eightPool
    };
  });

  console.log(`Updated ${updatedChunksCount} Arabic chunks with 8 questions.`);

  // Write updated curriculumData.js
  const curriculumFileHeader = `/**
 * بنك محتوى منهج البرمجة والذكاء الاصطناعي - ثانية بكالوريا (الترم الأول كاملاً)
 * المنهج التفاعلي المعتمد
 * 4 فصول رئيسية • 14 درساً تفصيلياً • 31 فقرة تعليمية مستقلة (8 أسئلة لكل فقرة) • 14 اختبار إتقان ختامي
 */

export const CHAPTERS_METADATA = ${JSON.stringify(CHAPTERS_METADATA, null, 2)};

export const CURRICULUM_DATA = ${JSON.stringify(updatedCurriculumData, null, 2)};
`;

  fs.writeFileSync(curriculumDataPath, curriculumFileHeader, 'utf8');
  console.log('Saved updated curriculumData.js successfully.');

  // Process CURRICULUM_ENGLISH
  const updatedEnglishCurriculum = { ...CURRICULUM_ENGLISH };

  Object.keys(ALL_NEW_QUESTIONS).forEach(chunkId => {
    const enChunk = updatedEnglishCurriculum[chunkId];
    if (!enChunk) {
      console.warn(`No English chunk found for ${chunkId}`);
      return;
    }

    const currentEnPool = enChunk.questionPool || [];
    const q1 = currentEnPool.find(q => q.id === 'q1') || currentEnPool[0];
    const q1_alt = currentEnPool.find(q => q.id === 'q1_alt') || currentEnPool[1];
    const q2 = currentEnPool.find(q => q.id === 'q2') || currentEnPool[2];
    const q2_alt = currentEnPool.find(q => q.id === 'q2_alt') || currentEnPool[3];
    const q3 = currentEnPool.find(q => q.id === 'q3') || currentEnPool[4];
    const q3_alt = currentEnPool.find(q => q.id === 'q3_alt') || currentEnPool[5];

    const newEnQuestions = ALL_NEW_QUESTIONS[chunkId].en;
    const q_best = newEnQuestions.find(q => q.id === 'q_best');
    const q_reinforce = newEnQuestions.find(q => q.id === 'q_reinforce');

    const eightEnPool = [
      q1,
      q1_alt,
      q2,
      q2_alt,
      q_best,
      q3,
      q_reinforce,
      q3_alt
    ].filter(Boolean);

    enChunk.questionPool = eightEnPool;
  });

  const englishFilePath = path.join(__dirname, '../src/data/curriculumEnglish.js');
  const englishFileContent = `/**
 * Full English Curriculum Data (Auto-compiled)
 * Covers all 45 nodes across 4 chapters and 14 lessons:
 * - 31 chunks with 8 questions each (including Best/Most Complete Choice questions)
 * - 14 Boss Mastery Exams (5 questions each)
 * - 40 content cards, 66 key terms with definitions, examples, and exam tips
 */

export const CURRICULUM_ENGLISH = ${JSON.stringify(updatedEnglishCurriculum, null, 2)};

/**
 * Helper to get a fully localized chunk merging Arabic base and English translation
 */
export function getLocalizedChunk(baseChunk, lang = 'ar') {
  if (!baseChunk) return null;
  if (lang === 'ar') return baseChunk;

  const en = CURRICULUM_ENGLISH[baseChunk.id];
  if (!en) return baseChunk;

  return {
    ...baseChunk,
    chunkTitle: en.title || baseChunk.chunkTitle,
    lessonTitle: en.lessonTitle || baseChunk.lessonTitle,
    summary: en.summary || baseChunk.summary,
    audioNarrationText: en.narration || baseChunk.audioNarrationText,
    simplifiedExplanation: en.simplifiedExplanation || baseChunk.simplifiedExplanation,
    aiTutorPrompt: en.aiPrompt || baseChunk.aiTutorPrompt,
    contentCards: en.contentCards && en.contentCards.length > 0 ? en.contentCards : baseChunk.contentCards,
    keyTerms: en.keyTerms && en.keyTerms.length > 0 ? en.keyTerms : baseChunk.keyTerms,
    questionPool: en.questionPool && en.questionPool.length > 0 ? en.questionPool : baseChunk.questionPool,
    examQuestions: en.examQuestions && en.examQuestions.length > 0 ? en.examQuestions : baseChunk.examQuestions
  };
}
`;

  fs.writeFileSync(englishFilePath, englishFileContent, 'utf8');
  console.log('Saved updated curriculumEnglish.js successfully.');
}

run().catch(err => {
  console.error('Error applying 8 questions:', err);
  process.exit(1);
});
