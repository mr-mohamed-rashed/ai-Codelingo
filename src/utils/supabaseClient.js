import { createClient } from '@supabase/supabase-js';
import { 
  getEnvOrStorage, 
  getSupabaseUrl, 
  getSupabaseAnonKey, 
  isSupabaseConfigured, 
  checkIsSupabaseConfigured, 
  saveSupabaseCredentials 
} from './supabaseConfig';

export {
  getEnvOrStorage,
  getSupabaseUrl,
  getSupabaseAnonKey,
  isSupabaseConfigured,
  checkIsSupabaseConfigured,
  saveSupabaseCredentials
};

// إنشاء وإدارة عميل Supabase المشترك ديناميكياً
let _clientInstance = null;
export function getSupabaseInstance() {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!_clientInstance || _clientInstance.__url !== url || _clientInstance.__key !== key) {
    _clientInstance = createClient(
      url || 'https://placeholder.supabase.co',
      key || 'placeholder-anon-key'
    );
    _clientInstance.__url = url;
    _clientInstance.__key = key;
  }
  return _clientInstance;
}

// تصدير كائن supabase كـ Proxy يضمن دائماً استخدام أحدث بيانات اتصال حتى لو تم تحديثها أثناء التشغيل
export const supabase = new Proxy({}, {
  get(target, prop) {
    const client = getSupabaseInstance();
    const value = client[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  }
});

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
