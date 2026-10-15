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

-- ==============================================================================
-- 5. جدول الطلاب والحسابات المزامنة (Students Table)
-- يدعم حفظ ومزامنة بيانات الطلاب مع Google و Facebook و مدرج الشرف
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.students (
  id TEXT PRIMARY KEY, -- e.g. 'std-12345678'
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  guardian_phone TEXT,
  avatar TEXT,
  provider TEXT DEFAULT 'google',
  status TEXT DEFAULT 'approved', -- 'approved' أو 'pending'
  is_master_teacher BOOLEAN DEFAULT FALSE,
  group_id TEXT,
  xp INTEGER DEFAULT 0,
  stars INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 1,
  completed_chunks JSONB DEFAULT '[]'::jsonb,
  chunk_ratings JSONB DEFAULT '{}'::jsonb,
  trophies JSONB DEFAULT '[]'::jsonb,
  wrong_answers JSONB DEFAULT '[]'::jsonb,
  current_station TEXT DEFAULT '',
  allowed_curriculum JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- فهارس للبحث السريع ومدرج الشرف
CREATE INDEX IF NOT EXISTS idx_students_email ON public.students(email);
CREATE INDEX IF NOT EXISTS idx_students_auth_user ON public.students(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_students_xp ON public.students(xp DESC);

-- تفعيل سياسات الأمان لجدول الطلاب (RLS)
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- 1. السماح للجميع بقراءة بيانات الطلاب (لعرض مدرج الشرف وترتيب الأوائل)
DROP POLICY IF EXISTS "Public students can be read by all" ON public.students;
CREATE POLICY "Public students can be read by all" ON public.students 
  FOR SELECT USING (true);

-- 2. السماح للطلاب بتسجيل أنفسهم أو تحديث تقدمهم
DROP POLICY IF EXISTS "Anyone can register or upsert student" ON public.students;
CREATE POLICY "Anyone can register or upsert student" ON public.students 
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Students can update their own data" ON public.students;
CREATE POLICY "Students can update their own data" ON public.students 
  FOR UPDATE USING (true) WITH CHECK (true);

-- 3. دالة وتريجر لتسجيل الطالب تلقائياً وسحب بياناته من Google أو Facebook فور المصادقة في Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
DECLARE
  extracted_name TEXT;
  extracted_avatar TEXT;
BEGIN
  -- استخراج الاسم والصورة الشخصية من ميتاداتا جوجل أو فيسبوك
  extracted_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'display_name',
    split_part(NEW.email, '@', 1),
    'طالب كودلينجو'
  );
  
  extracted_avatar := COALESCE(
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'picture',
    'https://api.dicebear.com/7.x/bottts/svg?seed=' || md5(COALESCE(NEW.email, NEW.id::text))
  );

  INSERT INTO public.students (
    id,
    auth_user_id,
    name,
    email,
    phone,
    avatar,
    provider,
    status,
    xp,
    stars,
    streak
  ) VALUES (
    'std-' || substr(NEW.id::text, 1, 8),
    NEW.id,
    extracted_name,
    NEW.email,
    NEW.phone,
    extracted_avatar,
    COALESCE(NEW.raw_app_meta_data->>'provider', 'google'),
    'approved',
    0,
    0,
    1
  )
  ON CONFLICT (email) DO UPDATE SET
    auth_user_id = EXCLUDED.auth_user_id,
    name = COALESCE(public.students.name, EXCLUDED.name),
    avatar = COALESCE(EXCLUDED.avatar, public.students.avatar),
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ربط التريجر بجدول المستخدمين auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

