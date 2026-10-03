const fs = require('fs');
const path = require('path');

const ch1 = require('./translations_ch1.cjs');
const ch2 = require('./translations_ch2.cjs');
const ch3 = require('./translations_ch3.cjs');
const ch4 = require('./translations_ch4.cjs');

const merged = {
  ...ch1,
  ...ch2,
  ...ch3,
  ...ch4
};

const keys = Object.keys(merged);
console.log(`Total nodes merged: ${keys.length}`);

// Generate ES module file for src/data/curriculumEnglish.js
const fileContent = `/**
 * Full English Curriculum Data (Auto-compiled)
 * Covers all 45 nodes across 4 chapters and 14 lessons:
 * - Titles, lesson titles, summaries, narrations
 * - Content cards, teacher tips
 * - Key terms with definitions, examples, and exam tips
 * - Full question pools (MCQ, True/False, Timed Fill) and lesson boss exam questions
 */

export const CURRICULUM_ENGLISH = ${JSON.stringify(merged, null, 2)};

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

const outputPath = path.join(__dirname, '../src/data/curriculumEnglish.js');
fs.writeFileSync(outputPath, fileContent, 'utf8');
console.log(`Successfully compiled translations to: ${outputPath}`);
