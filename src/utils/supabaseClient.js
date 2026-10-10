import { createClient } from '@supabase/supabase-js';

// قراءة بيانات الاتصال بسوبا بيز من متغيرات البيئة أو التخزين المحلي كبديل فوري
const getEnvOrStorage = (envKey, storageKey) => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.[envKey]) {
    return import.meta.env[envKey];
  }
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage.getItem(storageKey) || '';
  }
  return '';
};

const supabaseUrl = getEnvOrStorage('VITE_SUPABASE_URL', 'codelingo_supabase_url');
const supabaseAnonKey = getEnvOrStorage('VITE_SUPABASE_ANON_KEY', 'codelingo_supabase_anon_key');

// التحقق من توافر المفاتيح لتنبيه المطور في الكونسول
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.info(
    'ℹ️ [Supabase] بانتظار إدخال VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY في ملف .env أو إعدادات المنصة السحابية.'
  );
}

// إنشاء عميل Supabase المشترك
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);

/**
 * 1) إرسال رمز التحقق OTP لرقم الهاتف (SMS)
 * @param {string} phone - رقم الهاتف بالصيغة الدولية، مثلا: +201005144500
 */
export async function sendOtpToPhone(phone) {
  if (!isSupabaseConfigured) {
    throw new Error('يرجى ضبط مفاتيح Supabase في ملف .env أولاً');
  }

  // تنظيف وتنسيق الرقم ليحتوي على كود الدولة إذا لم يكن موجوداً
  let formattedPhone = phone.trim();
  if (!formattedPhone.startsWith('+')) {
    // افتراض كود مصر +20 إذا بدأ بـ 01
    if (formattedPhone.startsWith('01')) {
      formattedPhone = '+2' + formattedPhone;
    } else {
      formattedPhone = '+' + formattedPhone;
    }
  }

  const { data, error } = await supabase.auth.signInWithOtp({
    phone: formattedPhone,
  });

  if (error) {
    console.error('Supabase OTP Error:', error);
    throw error;
  }

  return { success: true, formattedPhone, data };
}

/**
 * 2) التحقق من كود الـ OTP المدخل من الطالب
 * @param {string} phone - رقم الهاتف
 * @param {string} token - كود التحقق المكون من 6 أرقام
 */
export async function verifyPhoneOtp(phone, token) {
  if (!isSupabaseConfigured) {
    throw new Error('يرجى ضبط مفاتيح Supabase في ملف .env أولاً');
  }

  let formattedPhone = phone.trim();
  if (!formattedPhone.startsWith('+') && formattedPhone.startsWith('01')) {
    formattedPhone = '+2' + formattedPhone;
  }

  const { data, error } = await supabase.auth.verifyOtp({
    phone: formattedPhone,
    token: token.trim(),
    type: 'sms',
  });

  if (error) {
    console.error('Supabase Verify OTP Error:', error);
    throw error;
  }

  return { success: true, session: data.session, user: data.user };
}

/**
 * 3) تسجيل طالب جديد برقم الهاتف وكلمة مرور (مباشر دون الحاجة لـ SMS Gateway)
 * @param {string} phone - رقم الهاتف
 * @param {string} password - كلمة السر
 * @param {object} studentData - الاسم، ولي الأمر، إلخ
 */
export async function signUpWithPhonePassword(phone, password, studentData = {}) {
  if (!isSupabaseConfigured) {
    throw new Error('يرجى ضبط مفاتيح Supabase في ملف .env أولاً');
  }

  let formattedPhone = phone.trim();
  if (!formattedPhone.startsWith('+') && formattedPhone.startsWith('01')) {
    formattedPhone = '+2' + formattedPhone;
  }

  const { data, error } = await supabase.auth.signUp({
    phone: formattedPhone,
    password: password,
    options: {
      data: {
        name: studentData.name || '',
        guardian_phone: studentData.guardianPhone || '',
        avatar: studentData.avatar || '',
        role: 'student',
      }
    }
  });

  if (error) throw error;
  return data;
}

/**
 * 4) تسجيل دخول طالب برقم الهاتف وكلمة المرور
 * @param {string} phone - رقم الهاتف
 * @param {string} password - كلمة السر
 */
export async function signInWithPhonePassword(phone, password) {
  if (!isSupabaseConfigured) {
    throw new Error('يرجى ضبط مفاتيح Supabase في ملف .env أولاً');
  }

  let formattedPhone = phone.trim();
  if (!formattedPhone.startsWith('+') && formattedPhone.startsWith('01')) {
    formattedPhone = '+2' + formattedPhone;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    phone: formattedPhone,
    password: password,
  });

  if (error) throw error;
  return data;
}

/**
 * 5) تسجيل الخروج
 */
export async function signOutSupabase() {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.auth.signOut();
  if (error) console.error('SignOut error:', error);
}
