import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CHAPTERS_METADATA, CURRICULUM_DATA } from '../src/data/curriculumData.js';
import { CURRICULUM_ENGLISH } from '../src/data/curriculumEnglish.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(`Loaded ${CHAPTERS_METADATA.length} chapters and ${CURRICULUM_DATA.length} nodes from curriculumData.js.`);

// 1. جدول الفصول (chapters)
const chapters = CHAPTERS_METADATA.map(ch => ({
  id: ch.id,
  title: ch.title,
  en_title: ch.enTitle || '',
  description: ch.description || '',
  color: ch.color || '#4f46e5',
  gradient: ch.gradient || '',
  light_bg: ch.lightBg || '',
  border_color: ch.borderColor || '',
  icon: ch.icon || 'Cpu',
  lessons_count: ch.lessonsCount || 0
}));

// 2. جدول الدروس (lessons)
const lessonsMap = new Map();
CURRICULUM_DATA.forEach(c => {
  if (!lessonsMap.has(c.lessonId)) {
    const enChunk = CURRICULUM_ENGLISH[c.id];
    lessonsMap.set(c.lessonId, {
      id: c.lessonId,
      chapter_id: c.chapterId,
      title: c.lessonTitle,
      en_title: enChunk?.lessonTitle || '',
      lesson_order: parseInt(c.lessonId.split('-')[1]) || 1,
      summary: `درس تفاعلي يغطي مفاهيم ${c.lessonTitle}`
    });
  }
});
const lessons = Array.from(lessonsMap.values()).sort((a, b) => a.id.localeCompare(b.id));

// 3. جدول الفقرات (chunks)
// 4. جدول بنك الأسئلة (questions)
const chunks = [];
const questions = [];

CURRICULUM_DATA.forEach((c) => {
  const enChunk = CURRICULUM_ENGLISH[c.id] || {};

  chunks.push({
    id: c.id,
    chapter_id: c.chapterId,
    lesson_id: c.lessonId,
    chunk_index: c.chunkIndex,
    chunk_title: c.chunkTitle,
    en_chunk_title: enChunk.title || '',
    type: c.type || 'chunk',
    icon_emoji: c.iconEmoji || '⏳',
    xp_reward: c.xpReward || 30,
    stars_reward: c.starsReward || 1,
    summary: c.summary || '',
    audio_narration_text: c.audioNarrationText || '',
    en_audio_narration_text: enChunk.narration || '',
    ai_tutor_prompt: c.aiTutorPrompt || '',
    simplified_explanation: c.simplifiedExplanation || enChunk.simplifiedExplanation || '',
    key_terms: c.keyTerms || enChunk.keyTerms || [],
    content_cards: c.contentCards || enChunk.contentCards || []
  });

  // استخراج الأسئلة
  if (Array.isArray(c.questionPool)) {
    c.questionPool.forEach((q, qIdx) => {
      const qId = `${c.id}_${q.id || `q${qIdx + 1}`}`;
      questions.push({
        id: qId,
        chunk_id: c.id,
        lesson_id: c.lessonId,
        chapter_id: c.chapterId,
        question_index: qIdx + 1,
        level: q.level || 'mcq',
        question: q.question,
        options: q.options || [],
        correct_index: typeof q.correctIndex === 'number' ? q.correctIndex : null,
        is_true: typeof q.isTrue === 'boolean' ? q.isTrue : null,
        correct_term: q.correctTerm || null,
        english_term: q.englishTerm || null,
        acceptable_answers: q.acceptableAnswers || [],
        explanation: q.explanation || ''
      });
    });
  }
});

console.log(`Generated Statistics:
✓ Chapters: ${chapters.length}
✓ Lessons: ${lessons.length}
✓ Chunks & Exams: ${chunks.length}
✓ Questions in Bank: ${questions.length}`);

// حفظ ملفات JSON المنفصلة
const outDir = path.join(__dirname, '..', 'data', 'seeds');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(path.join(outDir, 'chapters.json'), JSON.stringify(chapters, null, 2), 'utf8');
fs.writeFileSync(path.join(outDir, 'lessons.json'), JSON.stringify(lessons, null, 2), 'utf8');
fs.writeFileSync(path.join(outDir, 'chunks.json'), JSON.stringify(chunks, null, 2), 'utf8');
fs.writeFileSync(path.join(outDir, 'questions.json'), JSON.stringify(questions, null, 2), 'utf8');

// توليد ملف SQL متكامل للإدخال بضغطة واحدة في محرر SQL في Supabase
function sqlEscape(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val;
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
  return `'${String(val).replace(/'/g, "''")}'`;
}

let sql = `-- ==============================================================================
-- بذور محتوى منصة كودلينجو (Curriculum Data Seeds for Supabase)
-- تم توليدها آلياً لكافة الفصول والدروس والفقرات وبنك الأسئلة
-- ==============================================================================

-- 1. إدخال الفصول الـ 4
`;

chapters.forEach(ch => {
  sql += `INSERT INTO public.chapters (id, title, en_title, description, color, gradient, light_bg, border_color, icon, lessons_count)
VALUES (${sqlEscape(ch.id)}, ${sqlEscape(ch.title)}, ${sqlEscape(ch.en_title)}, ${sqlEscape(ch.description)}, ${sqlEscape(ch.color)}, ${sqlEscape(ch.gradient)}, ${sqlEscape(ch.light_bg)}, ${sqlEscape(ch.border_color)}, ${sqlEscape(ch.icon)}, ${sqlEscape(ch.lessons_count)})
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;\n`;
});

sql += `\n-- 2. إدخال الدروس الـ 14\n`;
lessons.forEach(l => {
  sql += `INSERT INTO public.lessons (id, chapter_id, title, en_title, lesson_order, summary)
VALUES (${sqlEscape(l.id)}, ${sqlEscape(l.chapter_id)}, ${sqlEscape(l.title)}, ${sqlEscape(l.en_title)}, ${sqlEscape(l.lesson_order)}, ${sqlEscape(l.summary)})
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;\n`;
});

sql += `\n-- 3. إدخال الفقرات الـ 45\n`;
chunks.forEach(c => {
  sql += `INSERT INTO public.chunks (id, chapter_id, lesson_id, chunk_index, chunk_title, en_chunk_title, type, icon_emoji, xp_reward, stars_reward, summary, audio_narration_text, en_audio_narration_text, ai_tutor_prompt, simplified_explanation, key_terms, content_cards)
VALUES (${sqlEscape(c.id)}, ${sqlEscape(c.chapter_id)}, ${sqlEscape(c.lesson_id)}, ${sqlEscape(c.chunk_index)}, ${sqlEscape(c.chunk_title)}, ${sqlEscape(c.en_chunk_title)}, ${sqlEscape(c.type)}, ${sqlEscape(c.icon_emoji)}, ${sqlEscape(c.xp_reward)}, ${sqlEscape(c.stars_reward)}, ${sqlEscape(c.summary)}, ${sqlEscape(c.audio_narration_text)}, ${sqlEscape(c.en_audio_narration_text)}, ${sqlEscape(c.ai_tutor_prompt)}, ${sqlEscape(c.simplified_explanation)}, ${sqlEscape(c.key_terms)}, ${sqlEscape(c.content_cards)})
ON CONFLICT (id) DO UPDATE SET chunk_title = EXCLUDED.chunk_title, summary = EXCLUDED.summary, key_terms = EXCLUDED.key_terms, content_cards = EXCLUDED.content_cards;\n`;
});

sql += `\n-- 4. إدخال بنك الأسئلة (${questions.length} سؤال)\n`;
questions.forEach(q => {
  sql += `INSERT INTO public.questions (id, chunk_id, lesson_id, chapter_id, question_index, level, question, options, correct_index, is_true, correct_term, english_term, acceptable_answers, explanation)
VALUES (${sqlEscape(q.id)}, ${sqlEscape(q.chunk_id)}, ${sqlEscape(q.lesson_id)}, ${sqlEscape(q.chapter_id)}, ${sqlEscape(q.question_index)}, ${sqlEscape(q.level)}, ${sqlEscape(q.question)}, ${sqlEscape(q.options)}, ${sqlEscape(q.correct_index)}, ${sqlEscape(q.is_true)}, ${sqlEscape(q.correct_term)}, ${sqlEscape(q.english_term)}, ${sqlEscape(q.acceptable_answers)}, ${sqlEscape(q.explanation)})
ON CONFLICT (id) DO UPDATE SET question = EXCLUDED.question, options = EXCLUDED.options, correct_index = EXCLUDED.correct_index, explanation = EXCLUDED.explanation;\n`;
});

fs.writeFileSync(path.join(outDir, 'seed_curriculum.sql'), sql, 'utf8');
console.log(`✓ Successfully generated SQL seed file: data/seeds/seed_curriculum.sql (${Math.round(sql.length / 1024)} KB)`);
