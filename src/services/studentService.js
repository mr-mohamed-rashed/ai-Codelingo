/**
 * خدمة إدارة بيانات الطلاب والمزامنة السحابية (Student Service)
 * تدعم:
 * 1. الحفظ والمزامنة المباشرة في جدول students في Supabase
 * 2. تسجيل الدخول بجوجل وفيسبوك وسحب الاسم والصورة والإيميل تلقائياً
 * 3. العمل في وضعي الأونلاين والأوفلاين مع التخزين المحلي الآمن
 * 4. التحميل الكسول (Dynamic Import) لمكتبة Supabase للحفاظ على أداء المنصة 100%
 */

// فحص توافر متغيرات البيئة أو التخزين المحلي كبديل
export const isSupabaseConfigured = Boolean(
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof window !== 'undefined' && window.localStorage?.getItem('codelingo_supabase_url') && window.localStorage?.getItem('codelingo_supabase_anon_key'))
);

// جلب عميل Supabase عند الطلب فقط لحماية سرعة الصفحة الأولى
let _supabaseCache = null;
async function getSupabaseClient() {
  if (_supabaseCache) return _supabaseCache;
  const { supabase } = await import('../utils/supabaseClient');
  _supabaseCache = supabase;
  return _supabaseCache;
}

// تحويل كائن الطالب من صيغة قاعدة البيانات (snake_case) إلى صيغة التطبيق (camelCase)
export function mapDbStudentToApp(dbRecord) {
  if (!dbRecord) return null;
  return {
    id: dbRecord.id || `std-${Date.now().toString().slice(-4)}`,
    authUserId: dbRecord.auth_user_id || null,
    name: dbRecord.name || 'طالب كودلينجو',
    email: dbRecord.email || '',
    phone: dbRecord.phone || '',
    guardianPhone: dbRecord.guardian_phone || '',
    avatar: dbRecord.avatar || '',
    provider: dbRecord.provider || 'google',
    status: dbRecord.status || 'pending',
    isMasterTeacher: Boolean(dbRecord.is_master_teacher),
    joinDate: dbRecord.created_at ? dbRecord.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
    groupId: dbRecord.group_id || null,
    xp: dbRecord.xp ?? 0,
    stars: dbRecord.stars ?? 0,
    streak: dbRecord.streak ?? 1,
    completedChunks: Array.isArray(dbRecord.completed_chunks) ? dbRecord.completed_chunks : [],
    chunkRatings: dbRecord.chunk_ratings || {},
    trophies: Array.isArray(dbRecord.trophies) ? dbRecord.trophies : [],
    wrongAnswers: Array.isArray(dbRecord.wrong_answers) ? dbRecord.wrong_answers : [],
    currentStation: dbRecord.current_station || '',
    allowedCurriculum: dbRecord.allowed_curriculum || {}
  };
}

// تحويل كائن الطالب من صيغة التطبيق (camelCase) إلى صيغة قاعدة البيانات (snake_case)
export function mapAppStudentToDb(appStudent) {
  if (!appStudent) return null;
  return {
    id: String(appStudent.id),
    auth_user_id: appStudent.authUserId || null,
    name: (appStudent.name || '').trim(),
    email: appStudent.email ? appStudent.email.trim().toLowerCase() : null,
    phone: (appStudent.phone || '').trim() || null,
    guardian_phone: (appStudent.guardianPhone || '').trim() || null,
    avatar: appStudent.avatar || null,
    provider: appStudent.provider || 'google',
    status: appStudent.status || 'pending',
    is_master_teacher: Boolean(appStudent.isMasterTeacher),
    group_id: appStudent.groupId || null,
    xp: Number(appStudent.xp || 0),
    stars: Number(appStudent.stars || 0),
    streak: Number(appStudent.streak || 1),
    completed_chunks: appStudent.completedChunks || [],
    chunk_ratings: appStudent.chunkRatings || {},
    trophies: appStudent.trophies || [],
    wrong_answers: appStudent.wrongAnswers || [],
    current_station: appStudent.currentStation || '',
    allowed_curriculum: appStudent.allowedCurriculum || {},
    updated_at: new Date().toISOString()
  };
}

/**
 * 1. حفظ أو تحديث بيانات الطالب في جدول students في Supabase
 * يتم دمج البيانات (Upsert) بحسب البريد الإلكتروني أو المعرف
 */
export async function syncStudentWithSupabase(student) {
  if (!isSupabaseConfigured || !student) {
    return student;
  }

  try {
    const supabase = await getSupabaseClient();
    const dbPayload = mapAppStudentToDb(student);
    
    const { data, error } = await supabase
      .from('students')
      .upsert(dbPayload, { 
        onConflict: student.email ? 'email' : 'id',
        ignoreDuplicates: false 
      })
      .select()
      .maybeSingle();

    if (error) {
      console.warn('⚠️ Supabase sync note (students table):', error.message);
      return student;
    }

    if (data) {
      return mapDbStudentToApp(data);
    }
  } catch (err) {
    console.warn('⚠️ Student sync error:', err);
  }

  return student;
}

/**
 * 2. البحث عن طالب في Supabase عبر البريد الإلكتروني
 */
export async function fetchStudentByEmail(email) {
  if (!isSupabaseConfigured || !email) return null;

  try {
    const supabase = await getSupabaseClient();
    const cleanEmail = email.trim().toLowerCase();
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (error) throw error;
    if (data) return mapDbStudentToApp(data);
  } catch (err) {
    console.warn('⚠️ Fetch student by email note:', err);
  }

  return null;
}

/**
 * 3. جلب جميع الطلاب المعتمدين لمدرج الشرف ولوحة التحكم
 */
export async function fetchAllStudentsFromSupabase() {
  if (!isSupabaseConfigured) return [];

  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('xp', { ascending: false });

    if (error) throw error;
    if (data && Array.isArray(data)) {
      return data.map(mapDbStudentToApp);
    }
  } catch (err) {
    console.warn('⚠️ Fetch all students note:', err);
  }

  return [];
}

/**
 * 4. تحديث تقدم الطالب سحابياً (النقاط، النجوم، الفقرات المنجزة)
 */
export async function updateStudentProgressInSupabase(studentId, updates) {
  if (!isSupabaseConfigured || !studentId) return;

  try {
    const supabase = await getSupabaseClient();
    const payload = {};
    if (updates.xp !== undefined) payload.xp = updates.xp;
    if (updates.stars !== undefined) payload.stars = updates.stars;
    if (updates.streak !== undefined) payload.streak = updates.streak;
    if (updates.completedChunks !== undefined) payload.completed_chunks = updates.completedChunks;
    if (updates.chunkRatings !== undefined) payload.chunk_ratings = updates.chunkRatings;
    if (updates.trophies !== undefined) payload.trophies = updates.trophies;
    if (updates.wrongAnswers !== undefined) payload.wrong_answers = updates.wrongAnswers;
    if (updates.currentStation !== undefined) payload.current_station = updates.currentStation;
    payload.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('students')
      .update(payload)
      .eq('id', studentId);

    if (error) console.warn('⚠️ Progress update note:', error.message);
  } catch (err) {
    console.warn('⚠️ Progress update error:', err);
  }
}

/**
 * 5. بدء تسجيل الدخول بحساب Google (OAuth) مع فرض شاشة اختيار الجيميل
 * prompt: 'select_account' يتيح للمستخدم اختيار الحساب الذي يفضله
 */
export async function signInWithGoogleOAuth() {
  if (!isSupabaseConfigured) {
    throw new Error('يرجى ضبط مفاتيح Supabase في ملف .env أولاً');
  }

  const supabase = await getSupabaseClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + window.location.pathname,
      queryParams: {
        prompt: 'select_account',
        access_type: 'offline'
      }
    }
  });

  if (error) throw error;
  return data;
}

/**
 * 6. بدء تسجيل الدخول بحساب Facebook (OAuth)
 */
export async function signInWithFacebookOAuth() {
  if (!isSupabaseConfigured) {
    throw new Error('يرجى ضبط مفاتيح Supabase في ملف .env أولاً');
  }

  const supabase = await getSupabaseClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: window.location.origin + window.location.pathname,
      scopes: 'email,public_profile'
    }
  });

  if (error) throw error;
  return data;
}
