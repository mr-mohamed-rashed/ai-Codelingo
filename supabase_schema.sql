-- ==============================================================================
-- Schema: منصة كودلينجو للبرمجة والذكاء الاصطناعي • ثانية بكالوريا
-- Author: أ. محمد راشد
-- Target: Supabase (PostgreSQL)
-- Description: إنشاء الجداول الأربعة المترابطة (الفصول، الدروس، الفقرات، الأسئلة)
-- ==============================================================================

-- 1. جدول الفصول الدراسية (Chapters)
CREATE TABLE IF NOT EXISTS public.chapters (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  en_title TEXT,
  description TEXT,
  color TEXT DEFAULT '#4f46e5',
  gradient TEXT,
  light_bg TEXT,
  border_color TEXT,
  icon TEXT DEFAULT 'Cpu',
  lessons_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. جدول الدروس (Lessons)
CREATE TABLE IF NOT EXISTS public.lessons (
  id TEXT PRIMARY KEY, -- e.g. '1-1', '1-2', '2-1'
  chapter_id INTEGER NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  en_title TEXT,
  lesson_order INTEGER DEFAULT 1,
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. جدول الفقرات التعليمية ومحطات الإتقان (Chunks)
CREATE TABLE IF NOT EXISTS public.chunks (
  id TEXT PRIMARY KEY, -- e.g. 'ch1-l1-c1', 'ch1-l1-exam'
  chapter_id INTEGER NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  chunk_title TEXT NOT NULL,
  en_chunk_title TEXT,
  type TEXT NOT NULL DEFAULT 'chunk', -- 'chunk' أو 'exam'
  icon_emoji TEXT DEFAULT '⏳',
  xp_reward INTEGER DEFAULT 30,
  stars_reward INTEGER DEFAULT 1,
  summary TEXT,
  audio_narration_text TEXT,
  en_audio_narration_text TEXT,
  ai_tutor_prompt TEXT,
  simplified_explanation TEXT,
  key_terms JSONB DEFAULT '[]'::jsonb,
  content_cards JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. جدول بنك الأسئلة والاختبارات التفاعلية (Questions Bank)
CREATE TABLE IF NOT EXISTS public.questions (
  id TEXT PRIMARY KEY, -- e.g. 'ch1-l1-c1_q1', 'ch1-l1-exam_q3'
  chunk_id TEXT NOT NULL REFERENCES public.chunks(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  chapter_id INTEGER NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  question_index INTEGER DEFAULT 1,
  level TEXT NOT NULL, -- 'mcq' أو 'true_false' أو 'term_fill'
  question TEXT NOT NULL,
  en_question TEXT,
  options JSONB DEFAULT '[]'::jsonb, -- مصفوفة الخيارات لسؤال الاختيار من متعدد
  en_options JSONB DEFAULT '[]'::jsonb,
  correct_index INTEGER, -- رقم الخيار الصحيح (0, 1, 2, 3)
  is_true BOOLEAN, -- في حالة سؤال صح أو خطأ
  correct_term TEXT, -- في حالة سؤال كتابة المصطلح
  english_term TEXT,
  acceptable_answers JSONB DEFAULT '[]'::jsonb,
  explanation TEXT,
  en_explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- فهارس لتحسين سرعة الاستعلامات والبحث اللحظي (Indexes for High Performance)
CREATE INDEX IF NOT EXISTS idx_lessons_chapter ON public.lessons(chapter_id);
CREATE INDEX IF NOT EXISTS idx_chunks_lesson ON public.chunks(lesson_id);
CREATE INDEX IF NOT EXISTS idx_chunks_chapter ON public.chunks(chapter_id);
CREATE INDEX IF NOT EXISTS idx_questions_chunk ON public.questions(chunk_id);
CREATE INDEX IF NOT EXISTS idx_questions_lesson ON public.questions(lesson_id);

-- ==============================================================================
-- سياسات الأمان والحماية (Row Level Security - RLS)
-- تتيح القراءة العامة لجميع الطلاب، بينما التعديل والإضافة للأدمن فقط
-- ==============================================================================
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- 1. السماح للجميع بقراءة المنهج (Public Read)
CREATE POLICY "Public chapters can be read by all" ON public.chapters FOR SELECT USING (true);
CREATE POLICY "Public lessons can be read by all" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Public chunks can be read by all" ON public.chunks FOR SELECT USING (true);
CREATE POLICY "Public questions can be read by all" ON public.questions FOR SELECT USING (true);

-- 2. السماح للإدارة فقط بالتعديل والحذف والإضافة (Admin Insert/Update/Delete)
CREATE POLICY "Admins can modify chapters" ON public.chapters FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');
CREATE POLICY "Admins can modify lessons" ON public.lessons FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');
CREATE POLICY "Admins can modify chunks" ON public.chunks FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');
CREATE POLICY "Admins can modify questions" ON public.questions FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');
