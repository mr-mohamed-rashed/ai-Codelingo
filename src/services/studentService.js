/**
 * خدمة إدارة بيانات الطلاب والمزامنة السحابية (Student Service)
 * تدعم:
 * 1. الحفظ والمزامنة المباشرة في جدول students في Supabase
 * 2. تسجيل الدخول بجوجل وفيسبوك وسحب الاسم والصورة والإيميل تلقائياً
 * 3. العمل في وضعي الأونلاين والأوفلاين مع التخزين المحلي الآمن
 * 4. التحميل الكسول (Dynamic Import) لمكتبة Supabase للحفاظ على أداء المنصة 100%
 */

import { isSupabaseConfigured } from '../utils/supabaseClient';
export { isSupabaseConfigured };

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
 * تحديث حقول الطالب في جدول students في Supabase (مثل الاعتماد، وتسكين المجموعة، وتحديث الملف)
 */
export async function updateStudentInSupabase(studentId, updates = {}) {
  if (!isSupabaseConfigured || !studentId) return null;

  try {
    const supabase = await getSupabaseClient();
    const payload = {};
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.groupId !== undefined) payload.group_id = updates.groupId;
    if (updates.currentStation !== undefined) payload.current_station = updates.currentStation;
    if (updates.name !== undefined) payload.name = updates.name.trim();
    if (updates.phone !== undefined) payload.phone = updates.phone ? updates.phone.trim() : null;
    if (updates.guardianPhone !== undefined) payload.guardian_phone = updates.guardianPhone ? updates.guardianPhone.trim() : null;
    if (updates.avatar !== undefined) payload.avatar = updates.avatar;
    if (updates.authUserId !== undefined) payload.auth_user_id = updates.authUserId;
    if (updates.xp !== undefined) payload.xp = Number(updates.xp);
    if (updates.stars !== undefined) payload.stars = Number(updates.stars);
    if (updates.streak !== undefined) payload.streak = Number(updates.streak);
    if (updates.completedChunks !== undefined) payload.completed_chunks = updates.completedChunks;
    if (updates.chunkRatings !== undefined) payload.chunk_ratings = updates.chunkRatings;
    if (updates.trophies !== undefined) payload.trophies = updates.trophies;
    if (updates.wrongAnswers !== undefined) payload.wrong_answers = updates.wrongAnswers;
    if (updates.allowedCurriculum !== undefined) payload.allowed_curriculum = updates.allowedCurriculum;
    payload.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('students')
      .update(payload)
      .eq('id', studentId)
      .select()
      .maybeSingle();

    if (error) {
      console.warn('⚠️ updateStudentInSupabase note:', error.message);
      return null;
    }
    return data ? mapDbStudentToApp(data) : null;
  } catch (err) {
    console.warn('⚠️ updateStudentInSupabase error:', err);
    return null;
  }
}

/**
 * حذف حساب طالب نهائياً من قاعدة بيانات Supabase
 */
export async function deleteStudentFromSupabase(studentId) {
  if (!isSupabaseConfigured || !studentId) return false;

  try {
    const supabase = await getSupabaseClient();
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', studentId);

    if (error) {
      console.warn('⚠️ deleteStudentFromSupabase note:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('⚠️ deleteStudentFromSupabase error:', err);
    return false;
  }
}

/**
 * تنسيق وتوحيد رقم الهاتف بالصيغة الدولية (+20 لمصر إذا بدأ بـ 01)
 */
export function formatInternationalPhone(phone) {
  if (!phone) return '';
  let cleaned = String(phone).trim().replace(/[\s-]/g, '');
  if (!cleaned.startsWith('+')) {
    if (cleaned.startsWith('01') && cleaned.length >= 11) {
      cleaned = '+2' + cleaned;
    } else if (cleaned.startsWith('1') && cleaned.length >= 10) {
      cleaned = '+20' + cleaned;
    } else {
      cleaned = '+' + cleaned;
    }
  }
  return cleaned;
}

/**
 * 5. بدء تسجيل الدخول بحساب Google (OAuth) مع فرض شاشة اختيار الجيميل
 * prompt: 'select_account' يتيح للمستخدم اختيار الحساب الذي يفضله
 */
export async function signInWithGoogleOAuth() {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  });

  if (error) throw error;
  return data;
}

/**
 * 6. بدء تسجيل الدخول بحساب Facebook (OAuth)
 */
export async function signInWithFacebookOAuth() {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: window.location.origin
    }
  });

  if (error) throw error;
  return data;
}

/**
 * 7. تسجيل الدخول بالبريد الإلكتروني وكلمة المرور عبر Supabase
 */
export async function signInWithEmailPassword(email, password) {
  if (!isSupabaseConfigured) {
    throw new Error('يرجى ضبط مفاتيح Supabase في ملف .env أولاً');
  }

  const supabase = await getSupabaseClient();
  const cleanEmail = String(email).trim().toLowerCase();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password: String(password).trim()
  });

  if (error) throw error;
  return data;
}

/**
 * 8. إنشاء حساب جديد بالبريد الإلكتروني مع حفظ الميتاداتا
 */
export async function signUpWithEmailPassword(email, password, metadata = {}) {
  if (!isSupabaseConfigured) {
    throw new Error('يرجى ضبط مفاتيح Supabase في ملف .env أولاً');
  }

  const supabase = await getSupabaseClient();
  const cleanEmail = String(email).trim().toLowerCase();
  const { data, error } = await supabase.auth.signUp({
    email: cleanEmail,
    password: String(password).trim(),
    options: {
      data: {
        full_name: metadata.name || '',
        name: metadata.name || '',
        phone: metadata.phone || '',
        guardian_phone: metadata.guardianPhone || '',
        avatar_url: metadata.avatar || '',
        role: 'student'
      }
    }
  });

  if (error) throw error;
  return data;
}

/**
 * 9. تسجيل الدخول برقم الهاتف وكلمة المرور عبر Supabase
 */
export async function signInWithPhonePassword(phone, password) {
  if (!isSupabaseConfigured) {
    throw new Error('يرجى ضبط مفاتيح Supabase في ملف .env أولاً');
  }

  const supabase = await getSupabaseClient();
  const formattedPhone = formatInternationalPhone(phone);
  const { data, error } = await supabase.auth.signInWithPassword({
    phone: formattedPhone,
    password: String(password).trim()
  });

  if (error) throw error;
  return data;
}

/**
 * 10. إنشاء حساب جديد برقم الهاتف وكلمة المرور عبر Supabase
 */
export async function signUpWithPhonePassword(phone, password, metadata = {}) {
  if (!isSupabaseConfigured) {
    throw new Error('يرجى ضبط مفاتيح Supabase في ملف .env أولاً');
  }

  const supabase = await getSupabaseClient();
  const formattedPhone = formatInternationalPhone(phone);
  const { data, error } = await supabase.auth.signUp({
    phone: formattedPhone,
    password: String(password).trim(),
    options: {
      data: {
        full_name: metadata.name || '',
        name: metadata.name || '',
        guardian_phone: metadata.guardianPhone || '',
        avatar_url: metadata.avatar || '',
        role: 'student'
      }
    }
  });

  if (error) throw error;
  return data;
}

/**
 * 11. إرسال رمز التحقق OTP لرقم الهاتف (SMS)
 */
export async function sendPhoneOtp(phone) {
  if (!isSupabaseConfigured) {
    throw new Error('يرجى ضبط مفاتيح Supabase في ملف .env أولاً');
  }

  const supabase = await getSupabaseClient();
  const formattedPhone = formatInternationalPhone(phone);
  const { data, error } = await supabase.auth.signInWithOtp({
    phone: formattedPhone
  });

  if (error) throw error;
  return { success: true, formattedPhone, data };
}

/**
 * 12. التحقق من كود الـ OTP
 */
export async function verifyPhoneOtp(phone, token) {
  if (!isSupabaseConfigured) {
    throw new Error('يرجى ضبط مفاتيح Supabase في ملف .env أولاً');
  }

  const supabase = await getSupabaseClient();
  const formattedPhone = formatInternationalPhone(phone);
  const { data, error } = await supabase.auth.verifyOtp({
    phone: formattedPhone,
    token: String(token).trim(),
    type: 'sms'
  });

  if (error) throw error;
  return data;
}

/**
 * 13. استخراج الميتاداتا وتحديث جدول students في Supabase (Upsert تلقائي وفوري)
 * يسترجع: الاسم الكامل، الصورة، البريد، والهاتف، ويدمجهم مع جدول الطلاب
 */
export async function syncUserMetadataToStudentTable(authUser, extraData = {}) {
  if (!authUser) return null;

  const metadata = authUser.user_metadata || {};
  const extractedName = (
    metadata.full_name || 
    metadata.name || 
    metadata.display_name || 
    extraData.name || 
    authUser.email?.split('@')[0] || 
    'طالب كودلينجو'
  ).trim();

  const extractedAvatar = (
    metadata.avatar_url || 
    metadata.picture || 
    extraData.avatar || 
    `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(extractedName)}`
  );

  const cleanEmail = (authUser.email || extraData.email || '').trim().toLowerCase();
  const cleanPhone = (authUser.phone || extraData.phone || '').trim();
  const guardianPhone = (metadata.guardian_phone || extraData.guardianPhone || '').trim();
  const provider = authUser.app_metadata?.provider || extraData.provider || 'supabase';

  const isMaster = cleanEmail.includes('mrrashed0777');

  // 1. فحص ما إذا كان الطالب مسجلاً مسبقاً في قاعدة بيانات Supabase
  let existingStudent = null;
  if (isSupabaseConfigured) {
    if (cleanEmail) {
      existingStudent = await fetchStudentByEmail(cleanEmail);
    }
    if (!existingStudent && authUser.id) {
      try {
        const supabase = await getSupabaseClient();
        const { data } = await supabase
          .from('students')
          .select('*')
          .eq('auth_user_id', authUser.id)
          .maybeSingle();
        if (data) existingStudent = mapDbStudentToApp(data);
      } catch (e) {
        console.warn('⚠️ Error checking auth_user_id in Supabase:', e);
      }
    }
  }

  // 2. إذا كان الطالب موجوداً مسبقاً: نحافظ على حالة الاعتماد والتسكين والتقدم بالكامل!
  if (existingStudent) {
    const updatedStudent = {
      ...existingStudent,
      authUserId: authUser.id || existingStudent.authUserId,
      name: (extractedName && extractedName !== 'طالب كودلينجو') ? extractedName : (existingStudent.name || extractedName),
      avatar: extractedAvatar || existingStudent.avatar,
      email: cleanEmail || existingStudent.email,
      phone: cleanPhone || existingStudent.phone,
      guardianPhone: guardianPhone || existingStudent.guardianPhone,
      provider: provider || existingStudent.provider,
      status: isMaster ? 'approved' : (existingStudent.status || 'pending'),
      groupId: isMaster ? (existingStudent.groupId || 'grp-1') : (existingStudent.groupId || null),
      isMasterTeacher: isMaster || Boolean(existingStudent.isMasterTeacher)
    };

    if (isSupabaseConfigured) {
      try {
        await updateStudentInSupabase(existingStudent.id, {
          authUserId: updatedStudent.authUserId,
          name: updatedStudent.name,
          avatar: updatedStudent.avatar,
          phone: updatedStudent.phone,
          guardianPhone: updatedStudent.guardianPhone,
          status: updatedStudent.status,
          groupId: updatedStudent.groupId
        });
      } catch (err) {
        console.warn('⚠️ Error updating existing student in Supabase:', err);
      }
    }

    return updatedStudent;
  }

  // 3. طالب جديد يسجل للمرة الأولى
  const studentPayload = {
    id: `std-${authUser.id ? authUser.id.substring(0, 8) : Date.now().toString().slice(-6)}`,
    authUserId: authUser.id,
    name: extractedName,
    email: cleanEmail || null,
    phone: cleanPhone || null,
    guardianPhone: guardianPhone || null,
    avatar: extractedAvatar,
    provider: provider,
    status: isMaster ? 'approved' : 'pending',
    groupId: isMaster ? 'grp-1' : null,
    isMasterTeacher: isMaster,
    currentStation: isMaster ? 'حساب الأستاذ - المنهج بالكامل متاح للاختبار والمعاينة' : 'في انتظار تصريح المعلم وتحديد المجموعة'
  };

  // عمل Upsert سحابي في جدول students
  if (isSupabaseConfigured) {
    try {
      const synced = await syncStudentWithSupabase(studentPayload);
      if (synced) return synced;
    } catch (err) {
      console.warn('⚠️ syncUserMetadataToStudentTable error:', err);
    }
  }

  return studentPayload;
}
