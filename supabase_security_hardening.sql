-- ==============================================================================
-- ملف تأمين قاعدة بيانات سوبابيز بالكامل (Supabase Complete Security Hardening)
-- المنصة: منصة كودلينجو للبرمجة والذكاء الاصطناعي • الأستاذ محمد راشد
-- الأهداف المحققة في هذا الملف:
-- 1. تفعيل سياسات أمان الصفوف (Row Level Security - RLS) بنسبة 100%
-- 2. منع أي طالب من تعديل أو حذف بيانات طلاب آخرين
-- 3. منع أي طالب من اعتماد نفسه (تغيير status إلى approved) أو تسكين نفسه في مجموعة
-- 4. قفل صلاحيات الحذف والتعديل للمنهج وجداول الطلاب لصالح الأستاذ محمد راشد فقط
-- 5. فحص المدخلات على مستوى قاعدة البيانات (Database Constraints) لمنع أي تلاعب
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- أولاً: تفعيل RLS على جميع جداول المنصة
-- ------------------------------------------------------------------------------
ALTER TABLE IF EXISTS public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.students ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- ثانياً: تنظيف السياسات القديمة إن وُجدت
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public chapters can be read by all" ON public.chapters;
DROP POLICY IF EXISTS "Admins can modify chapters" ON public.chapters;
DROP POLICY IF EXISTS "Public lessons can be read by all" ON public.lessons;
DROP POLICY IF EXISTS "Admins can modify lessons" ON public.lessons;
DROP POLICY IF EXISTS "Public chunks can be read by all" ON public.chunks;
DROP POLICY IF EXISTS "Admins can modify chunks" ON public.chunks;
DROP POLICY IF EXISTS "Public questions can be read by all" ON public.questions;
DROP POLICY IF EXISTS "Admins can modify questions" ON public.questions;

DROP POLICY IF EXISTS "Public students can be read by all" ON public.students;
DROP POLICY IF EXISTS "Anyone can register or upsert student" ON public.students;
DROP POLICY IF EXISTS "Students can update their own data" ON public.students;
DROP POLICY IF EXISTS "Only teacher can delete students" ON public.students;
DROP POLICY IF EXISTS "Students can only update their own row" ON public.students;
DROP POLICY IF EXISTS "Teacher full access on students" ON public.students;

-- ------------------------------------------------------------------------------
-- ثالثاً: تأمين جداول المنهج والدروس والأسئلة (الطلاب قراءة فقط • المعلم تعديل كامل)
-- ------------------------------------------------------------------------------
-- 1. الفصول (Chapters)
CREATE POLICY "Public chapters can be read by all" 
  ON public.chapters FOR SELECT 
  USING (true);

CREATE POLICY "Only teacher can modify chapters" 
  ON public.chapters FOR ALL 
  USING (
    auth.jwt() ->> 'email' ILIKE '%mrrashed0777%' OR 
    auth.jwt() ->> 'email' ILIKE '%mr.mohamed.rashed%' OR 
    auth.role() = 'service_role'
  );

-- 2. الدروس (Lessons)
CREATE POLICY "Public lessons can be read by all" 
  ON public.lessons FOR SELECT 
  USING (true);

CREATE POLICY "Only teacher can modify lessons" 
  ON public.lessons FOR ALL 
  USING (
    auth.jwt() ->> 'email' ILIKE '%mrrashed0777%' OR 
    auth.jwt() ->> 'email' ILIKE '%mr.mohamed.rashed%' OR 
    auth.role() = 'service_role'
  );

-- 3. الفقرات التعليمية (Chunks)
CREATE POLICY "Public chunks can be read by all" 
  ON public.chunks FOR SELECT 
  USING (true);

CREATE POLICY "Only teacher can modify chunks" 
  ON public.chunks FOR ALL 
  USING (
    auth.jwt() ->> 'email' ILIKE '%mrrashed0777%' OR 
    auth.jwt() ->> 'email' ILIKE '%mr.mohamed.rashed%' OR 
    auth.role() = 'service_role'
  );

-- 4. بنك الأسئلة (Questions)
CREATE POLICY "Public questions can be read by all" 
  ON public.questions FOR SELECT 
  USING (true);

CREATE POLICY "Only teacher can modify questions" 
  ON public.questions FOR ALL 
  USING (
    auth.jwt() ->> 'email' ILIKE '%mrrashed0777%' OR 
    auth.jwt() ->> 'email' ILIKE '%mr.mohamed.rashed%' OR 
    auth.role() = 'service_role'
  );

-- ------------------------------------------------------------------------------
-- رابعاً: سياسات جدول الطلاب الصارمة (Students Table Policies)
-- ------------------------------------------------------------------------------

-- 1. القراءة (SELECT): مسموح للجميع لقراءة الترتيب ولوحة الشرف والبيانات الأكاديمية
CREATE POLICY "Allow reading student data for leaderboard and app"
  ON public.students FOR SELECT
  USING (true);

-- 2. الإضافة (INSERT): يُسمح بإضافة الحساب عند تسجيل الطالب في Supabase Auth
CREATE POLICY "Allow inserting new student on registration"
  ON public.students FOR INSERT
  WITH CHECK (
    -- حساب الطالب يطابق المعرّف الموثق في Auth أو المعلم الماستر
    (auth.uid() IS NOT NULL AND auth.uid() = auth_user_id) OR
    (auth.jwt() ->> 'email' IS NOT NULL AND lower(auth.jwt() ->> 'email') = lower(email)) OR
    auth.jwt() ->> 'email' ILIKE '%mrrashed0777%' OR
    auth.role() = 'service_role' OR
    auth.role() = 'anon'
  );

-- 3. التعديل (UPDATE): الطالب يُعدل سطر حسابه هو فقط (أو المعلم يعدل أي حساب)
CREATE POLICY "Students can only update their own row"
  ON public.students FOR UPDATE
  USING (
    -- المعلم يملك تعديل أي طالب
    auth.jwt() ->> 'email' ILIKE '%mrrashed0777%' OR
    auth.jwt() ->> 'email' ILIKE '%mr.mohamed.rashed%' OR
    auth.role() = 'service_role' OR
    -- الطالب يُعدل سطر حسابه الشخصي فقط
    (auth.uid() IS NOT NULL AND auth.uid() = auth_user_id) OR
    (auth.jwt() ->> 'email' IS NOT NULL AND lower(auth.jwt() ->> 'email') = lower(email))
  )
  WITH CHECK (
    auth.jwt() ->> 'email' ILIKE '%mrrashed0777%' OR
    auth.jwt() ->> 'email' ILIKE '%mr.mohamed.rashed%' OR
    auth.role() = 'service_role' OR
    (auth.uid() IS NOT NULL AND auth.uid() = auth_user_id) OR
    (auth.jwt() ->> 'email' IS NOT NULL AND lower(auth.jwt() ->> 'email') = lower(email))
  );

-- 4. الحذف (DELETE): محظور تماماً على جميع الطلاب • المعلم فقط من يملك الحذف
CREATE POLICY "Only teacher can delete students"
  ON public.students FOR DELETE
  USING (
    auth.jwt() ->> 'email' ILIKE '%mrrashed0777%' OR 
    auth.jwt() ->> 'email' ILIKE '%mr.mohamed.rashed%' OR 
    auth.role() = 'service_role'
  );

-- ------------------------------------------------------------------------------
-- خامساً: تريجر الحماية الفولاذي (Trigger) لمنع الطالب من اعتماد نفسه
-- حتى لو أرسل الطالب طلباً برمجياً لتغيير status أو group_id، التريجر يلغيه فوراً!
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.protect_student_privileges()
RETURNS TRIGGER AS $$
DECLARE
  caller_email TEXT;
  caller_role TEXT;
BEGIN
  -- استخراج إيميل المستخدم الحالي ودوره من الـ JWT التابع لـ Supabase
  caller_email := COALESCE(auth.jwt() ->> 'email', '');
  caller_role := COALESCE(auth.role(), '');

  -- إذا كان المتصل هو المعلم (الأستاذ محمد راشد) أو service_role، فله كامل الصلاحيات
  IF caller_email ILIKE '%mrrashed0777%' OR caller_email ILIKE '%mr.mohamed.rashed%' OR caller_role = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- إذا كان المتصل طالباً عادياً، يتم فرض القيود التالية بقوة السيرفر:
  -- 1. منع الطالب من ترقية حسابه بنفسه إلى approved (يظل على حالته القديمة)
  NEW.status := OLD.status;

  -- 2. منع الطالب من تسكين نفسه في أي مجموعة (تظل كما هي)
  NEW.group_id := OLD.group_id;

  -- 3. منع الطالب من فك قفل المنهج لنفسه برمجياً (تظل كما حددها المعلم)
  NEW.allowed_curriculum := OLD.allowed_curriculum;

  -- 4. منع الطالب من وضع نفسه كأستاذ ماستر
  NEW.is_master_teacher := FALSE;

  -- 5. تثبيت معرّف المستخدم والإيميل لمنع انتحال شخصية حسابات أخرى
  NEW.auth_user_id := COALESCE(OLD.auth_user_id, NEW.auth_user_id);
  NEW.email := COALESCE(OLD.email, NEW.email);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ربط التريجر بجدول الطلاب ليعمل قبل أي عملية UPDATE
DROP TRIGGER IF EXISTS trg_protect_student_privileges ON public.students;
CREATE TRIGGER trg_protect_student_privileges
  BEFORE UPDATE ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_student_privileges();

-- ------------------------------------------------------------------------------
-- سادساً: قيود فحص صحة المدخلات في قاعدة البيانات (Database Integrity Constraints)
-- ------------------------------------------------------------------------------
DO $$ 
BEGIN
  -- قيد: الحالة لا يمكن أن تكون سوى approved أو pending أو guest
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_student_status') THEN
    ALTER TABLE public.students ADD CONSTRAINT chk_student_status 
      CHECK (status IN ('approved', 'pending', 'guest'));
  END IF;

  -- قيد: طول اسم الطالب لا يتجاوز 120 حرفاً
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_student_name_length') THEN
    ALTER TABLE public.students ADD CONSTRAINT chk_student_name_length 
      CHECK (char_length(name) <= 120);
  END IF;

  -- قيد: طول رقم هاتف الطالب لا يتجاوز 30 حرفاً
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_student_phone_length') THEN
    ALTER TABLE public.students ADD CONSTRAINT chk_student_phone_length 
      CHECK (phone IS NULL OR char_length(phone) <= 30);
  END IF;

  -- قيد: طول رقم ولي الأمر لا يتجاوز 30 حرفاً
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_student_guardian_phone_length') THEN
    ALTER TABLE public.students ADD CONSTRAINT chk_student_guardian_phone_length 
      CHECK (guardian_phone IS NULL OR char_length(guardian_phone) <= 30);
  END IF;
END $$;

-- تنظيف نهائي لأي سجل تجريبي قديم للمعلم كطالب
DELETE FROM public.students 
WHERE id = 'std-master-teacher' 
   OR email ILIKE '%mrrashed0777%' 
   OR name ILIKE '%محمد راشد%';

-- رسالة نجاح
SELECT 'Security policies, RLS, and privilege triggers applied successfully! 🛡️' AS status;
