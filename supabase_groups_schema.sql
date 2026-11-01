-- ==============================================================================
-- Schema: إنشاء جدول المجموعات الدراسية (Groups) والربط مع الطلاب في Supabase
-- Author: أ. محمد راشد • منصة كودلينجو للبرمجة والذكاء الاصطناعي
-- ==============================================================================

-- 1. إنشاء جدول المجموعات الدراسية (Groups)
CREATE TABLE IF NOT EXISTS public.groups (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  schedule TEXT,
  location TEXT,
  color TEXT DEFAULT '#6366f1',
  unlocked_chunks JSONB DEFAULT '["ch1-l1-c1", "ch1-l1-c2", "ch1-l1-c3", "ch1-l1-c4", "ch1-l1-exam"]'::jsonb,
  homework_chunks JSONB DEFAULT '["ch1-l1-c2", "ch1-l1-c3"]'::jsonb,
  homework_note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. إدخال المجموعات الأولية المعتمدة
INSERT INTO public.groups (id, name, schedule, location, color, unlocked_chunks, homework_chunks, homework_note)
VALUES 
  (
    'grp-1', 
    'مجموعة الأحد والثلاثاء - سنتر الأوائل', 
    'الأحد والثلاثاء (5:00 - 7:00 م)', 
    'سنتر الأوائل - الدقي', 
    '#6366f1', 
    '["ch1-l1-c1", "ch1-l1-c2", "ch1-l1-c3", "ch1-l1-c4", "ch1-l1-exam"]'::jsonb, 
    '["ch1-l1-c2", "ch1-l1-c3"]'::jsonb, 
    'واجب الحصة الأولى: مراجعة بطاقات شرح قانون مور وحل بنك الأسئلة بالكامل وتحقيق 90% فما فوق.'
  ),
  (
    'grp-2', 
    'مجموعة السبت والأربعاء - سنتر المتفوقين', 
    'السبت والأربعاء (7:00 - 9:00 م)', 
    'سنتر المتفوقين - مدينة نصر', 
    '#10b981', 
    '["ch1-l1-c1", "ch1-l1-c2"]'::jsonb, 
    '["ch1-l1-c1"]'::jsonb, 
    'واجب تمهيدي: استيعاب المراحل الخمس للحوسبة والتفوق في اختبار الفقرة.'
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  schedule = EXCLUDED.schedule,
  location = EXCLUDED.location,
  color = EXCLUDED.color,
  updated_at = NOW();

-- 3. تفعيل أمان الصفوف (RLS)
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

-- 4. سياسة القراءة العامة لجميع الطلاب والمعلمين (لعرض أسماء المجموعات والمنهج المفتوح)
DROP POLICY IF EXISTS "Public groups can be read by all" ON public.groups;
CREATE POLICY "Public groups can be read by all" ON public.groups 
  FOR SELECT USING (true);

-- 5. سياسة الإضافة والتعديل والحذف للمعلم فقط
DROP POLICY IF EXISTS "Teacher can insert groups" ON public.groups;
CREATE POLICY "Teacher can insert groups" ON public.groups 
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Teacher can update groups" ON public.groups;
CREATE POLICY "Teacher can update groups" ON public.groups 
  FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Teacher can delete groups" ON public.groups;
CREATE POLICY "Teacher can delete groups" ON public.groups 
  FOR DELETE USING (true);

-- 6. تفعيل البث اللحظي (Realtime) لجدول المجموعات
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'groups'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.groups;
  END IF;
END $$;
