/**
 * خدمة إدارة وجلب المنهج الذكية (Curriculum Service)
 * تدعم:
 * 1. الجلب السحابي من Supabase بالطلب فقط (On-Demand Fetching)
 * 2. التخزين المؤقت في جهاز الطالب (IndexedDB / Local Caching)
 * 3. البديل المحلي في وضع الأوفلاين (Graceful Fallback)
 */

import { CHAPTERS_METADATA } from '../data/curriculumMeta.js';

// ذاكرة وصول سريعة أثناء الجلسة (In-Memory Cache)
const memoryCache = {
  chapters: CHAPTERS_METADATA,
  lessons: new Map(),
  chunks: new Map(),
  questionsByChunk: new Map()
};

// بادئة التخزين المحلي في المتصفح
const CACHE_PREFIX = 'codelingo_curriculum_cache_';

function getLocalCached(key) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

function setLocalCached(key, data) {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(data));
  } catch (e) {}
}

/**
 * 1. جلب بيانات الفصول الأربعة الرئيسية (خفيفة وفورية)
 */
export async function fetchChapters() {
  if (memoryCache.chapters && memoryCache.chapters.length > 0) {
    return memoryCache.chapters;
  }

  // محاولة الجلب من Supabase إذا كانت المفاتيح متوفرة
  const isConfigured = Boolean(import.meta.env?.VITE_SUPABASE_URL && import.meta.env?.VITE_SUPABASE_ANON_KEY);
  if (isConfigured) {
    try {
      const { supabase } = await import('../utils/supabaseClient');
      const { data, error } = await supabase.from('chapters').select('*').order('id');
      if (!error && data && data.length > 0) {
        memoryCache.chapters = data;
        setLocalCached('chapters', data);
        return data;
      }
    } catch (err) {
      console.warn('Supabase chapters fetch note:', err);
    }
  }

  return CHAPTERS_METADATA;
}

/**
 * 2. جلب فقرات درس معين وأسئلته بالطلب فقط (On-Demand per Lesson)
 * @param {string} lessonId - e.g. '1-1', '2-3'
 */
export async function fetchLessonChunks(lessonId) {
  if (!lessonId) return [];

  // فحص ذاكرة الوصول السريع (Memory Cache)
  if (memoryCache.lessons.has(lessonId)) {
    return memoryCache.lessons.get(lessonId);
  }

  // فحص الكاش المحلي في المتصفح (Local Storage Cache)
  const cached = getLocalCached(`lesson_${lessonId}`);
  if (cached && Array.isArray(cached) && cached.length > 0) {
    memoryCache.lessons.set(lessonId, cached);
    return cached;
  }

  // محاولة الجلب السحابي من Supabase
  const isConfigured = Boolean(import.meta.env?.VITE_SUPABASE_URL && import.meta.env?.VITE_SUPABASE_ANON_KEY);
  if (isConfigured) {
    try {
      const { supabase } = await import('../utils/supabaseClient');
      
      // جلب الفقرات التابعة للدرس
      const { data: chunksData, error: chunkErr } = await supabase
        .from('chunks')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('chunk_index');

      if (!chunkErr && chunksData && chunksData.length > 0) {
        // جلب أسئلة هذا الدرس
        const { data: questionsData } = await supabase
          .from('questions')
          .select('*')
          .eq('lesson_id', lessonId)
          .order('question_index');

        // ربط الأسئلة بالفقرات لتكون بنفس هيكل التطبيق
        const questionsMap = new Map();
        (questionsData || []).forEach(q => {
          if (!questionsMap.has(q.chunk_id)) questionsMap.set(q.chunk_id, []);
          questionsMap.get(q.chunk_id).push({
            id: q.id,
            level: q.level,
            question: q.question,
            options: q.options || [],
            correctIndex: q.correct_index,
            isTrue: q.is_true,
            correctTerm: q.correct_term,
            englishTerm: q.english_term,
            acceptableAnswers: q.acceptable_answers || [],
            explanation: q.explanation || ''
          });
        });

        const compiledChunks = chunksData.map(c => ({
          id: c.id,
          chapterId: c.chapter_id,
          lessonId: c.lesson_id,
          chunkIndex: c.chunk_index,
          chunkTitle: c.chunk_title,
          enChunkTitle: c.en_chunk_title,
          type: c.type,
          iconEmoji: c.icon_emoji,
          xpReward: c.xp_reward,
          starsReward: c.stars_reward,
          summary: c.summary,
          audioNarrationText: c.audio_narration_text,
          enAudioNarrationText: c.en_audio_narration_text,
          aiTutorPrompt: c.ai_tutor_prompt,
          simplifiedExplanation: c.simplified_explanation,
          keyTerms: c.key_terms || [],
          contentCards: c.content_cards || [],
          questionPool: questionsMap.get(c.id) || []
        }));

        memoryCache.lessons.set(lessonId, compiledChunks);
        setLocalCached(`lesson_${lessonId}`, compiledChunks);
        return compiledChunks;
      }
    } catch (err) {
      console.warn('Supabase fetchLessonChunks error, using fallback:', err);
    }
  }

  // البديل المحلي المدمج (Fallback to local curriculumData)
  const { CURRICULUM_DATA } = await import('../data/curriculumData.js');
  const fallbackChunks = CURRICULUM_DATA.filter(c => c.lessonId === lessonId);
  memoryCache.lessons.set(lessonId, fallbackChunks);
  setLocalCached(`lesson_${lessonId}`, fallbackChunks);
  return fallbackChunks;
}

/**
 * 3. جلب فقرة معينة مع بنك أسئلتها
 * @param {string} chunkId - e.g. 'ch1-l1-c1'
 */
export async function fetchChunkById(chunkId) {
  if (!chunkId) return null;

  if (memoryCache.chunks.has(chunkId)) {
    return memoryCache.chunks.get(chunkId);
  }

  // استنتاج رقم الدرس من معرف الفقرة، مثلا: 'ch1-l1-c1' -> '1-1'
  const match = chunkId.match(/ch(\d+)-l(\d+)/);
  if (match) {
    const lessonId = `${match[1]}-${match[2]}`;
    const chunks = await fetchLessonChunks(lessonId);
    const found = chunks.find(c => c.id === chunkId);
    if (found) {
      memoryCache.chunks.set(chunkId, found);
      return found;
    }
  }

  // في حال لم نجدها، البحث في القائمة الاحتياطية الكاملة
  const { CURRICULUM_DATA } = await import('../data/curriculumData.js');
  const found = CURRICULUM_DATA.find(c => c.id === chunkId);
  if (found) memoryCache.chunks.set(chunkId, found);
  return found || null;
}

/**
 * 4. حفظ وتعديل سؤال في قاعدة البيانات مباشرة (خاص بلوحة تحكم الأستاذ)
 */
export async function updateQuestionInDb(questionObj) {
  const isConfigured = Boolean(import.meta.env?.VITE_SUPABASE_URL && import.meta.env?.VITE_SUPABASE_ANON_KEY);
  if (!isConfigured) {
    throw new Error('يرجى ضبط مفاتيح Supabase في ملف .env لتعديل الأسئلة سحابياً.');
  }

  const { supabase } = await import('../utils/supabaseClient');
  const { data, error } = await supabase
    .from('questions')
    .upsert({
      id: questionObj.id,
      chunk_id: questionObj.chunk_id,
      lesson_id: questionObj.lesson_id,
      chapter_id: questionObj.chapter_id,
      question: questionObj.question,
      options: questionObj.options,
      correct_index: questionObj.correct_index,
      is_true: questionObj.is_true,
      correct_term: questionObj.correct_term,
      explanation: questionObj.explanation,
      updated_at: new Date().toISOString()
    })
    .select();

  if (error) throw error;

  // تنظيف الكاش المحلي للدرس ليتجدد فوراً
  if (questionObj.lesson_id) {
    memoryCache.lessons.delete(questionObj.lesson_id);
    localStorage.removeItem(CACHE_PREFIX + `lesson_${questionObj.lesson_id}`);
  }

  return data;
}
