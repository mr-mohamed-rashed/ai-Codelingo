// Lightweight Supabase Configuration Helper (Zero External Dependencies)
// يساعد في الحفاظ على سرعة الصفحة الأولى 100% دون تحميل حزمة سوبابيز الثقيلة

export const getEnvOrStorage = (envKey, storageKey) => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.[envKey]) {
    return import.meta.env[envKey];
  }
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage.getItem(storageKey) || '';
  }
  return '';
};

export const getSupabaseUrl = () => {
  const envVal = getEnvOrStorage('VITE_SUPABASE_URL', 'codelingo_supabase_url');
  if (envVal && !envVal.includes('placeholder')) return envVal.trim();
  return 'https://ugmczeteraqkjvioqbrj.supabase.co';
};

export const getSupabaseAnonKey = () => {
  const envVal = getEnvOrStorage('VITE_SUPABASE_ANON_KEY', 'codelingo_supabase_anon_key');
  if (envVal && !envVal.includes('placeholder')) return envVal.trim();
  return 'sb_publishable_WYhzpIEluZrOoLXm3UOIcw_etoMCv6y';
};

// التحقق من توافر المفاتيح لتنبيه المطور
export const isSupabaseConfigured = Boolean(getSupabaseUrl() && getSupabaseAnonKey());

export function checkIsSupabaseConfigured() {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  return Boolean(url && key && !url.includes('placeholder'));
}

export function saveSupabaseCredentials(url, anonKey) {
  if (typeof window !== 'undefined' && window.localStorage) {
    if (url && url.trim()) {
      window.localStorage.setItem('codelingo_supabase_url', url.trim());
    }
    if (anonKey && anonKey.trim()) {
      window.localStorage.setItem('codelingo_supabase_anon_key', anonKey.trim());
    }
  }
}
