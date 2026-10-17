/**
 * خدمة المصادقة الاجتماعية المباشرة (Social Auth Service)
 * تدعم:
 * 1. تسجيل الدخول بحساب Google الرسمي عبر Google Identity Services (GIS)
 * 2. فتح نافذة اختيار الحساب المنبثقة وسحب الاسم الحقيقي، الإيميل، والصورة الشخصية فوراً
 * 3. دعم Facebook JavaScript SDK
 * 4. إدارة وحفظ مفاتيح الربط (Google Client ID & Facebook App ID)
 */

export const STORAGE_KEYS = {
  GOOGLE_CLIENT_ID: 'codelingo_google_client_id',
  FACEBOOK_APP_ID: 'codelingo_fb_app_id',
  SUPABASE_URL: 'codelingo_supabase_url',
  SUPABASE_ANON_KEY: 'codelingo_supabase_anon_key'
};

/**
 * الحصول على معرّف عميل جوجل من التخزين المحلي أو متغيرات البيئة
 */
export function getGoogleClientId() {
  if (typeof window !== 'undefined' && window.localStorage) {
    const stored = window.localStorage.getItem(STORAGE_KEYS.GOOGLE_CLIENT_ID);
    if (stored && stored.trim()) return stored.trim();
  }
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GOOGLE_CLIENT_ID) {
    return import.meta.env.VITE_GOOGLE_CLIENT_ID.trim();
  }
  return '185036534923-r2hc2bevojkjl073gbfs0ef008s1lckh.apps.googleusercontent.com';
}

/**
 * الحصول على معرّف تطبيق فيسبوك من التخزين المحلي أو متغيرات البيئة
 */
export function getFacebookAppId() {
  if (typeof window !== 'undefined' && window.localStorage) {
    const stored = window.localStorage.getItem(STORAGE_KEYS.FACEBOOK_APP_ID);
    if (stored && stored.trim()) return stored.trim();
  }
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FACEBOOK_APP_ID) {
    return import.meta.env.VITE_FACEBOOK_APP_ID.trim();
  }
  return '2287502738483185';
}

/**
 * حفظ مفاتيح Google و Facebook في التخزين المحلي
 */
export function saveSocialKeys({ googleClientId, facebookAppId }) {
  if (typeof window === 'undefined') return;
  if (googleClientId !== undefined) {
    if (googleClientId.trim()) {
      localStorage.setItem(STORAGE_KEYS.GOOGLE_CLIENT_ID, googleClientId.trim());
    } else {
      localStorage.removeItem(STORAGE_KEYS.GOOGLE_CLIENT_ID);
    }
  }
  if (facebookAppId !== undefined) {
    if (facebookAppId.trim()) {
      localStorage.setItem(STORAGE_KEYS.FACEBOOK_APP_ID, facebookAppId.trim());
    } else {
      localStorage.removeItem(STORAGE_KEYS.FACEBOOK_APP_ID);
    }
  }
}

/**
 * التأكد من تحميل مكتبة Google Identity Services
 */
function ensureGoogleLoaded(timeoutMs = 6000) {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) {
      return resolve(window.google);
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      if (window.google?.accounts?.oauth2) {
        clearInterval(interval);
        resolve(window.google);
      } else if (Date.now() - startTime > timeoutMs) {
        clearInterval(interval);
        // محاولة تحميل السكربت ديناميكياً إذا لم يكن موجوداً
        const existingScript = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
        if (!existingScript) {
          const script = document.createElement('script');
          script.src = 'https://accounts.google.com/gsi/client';
          script.async = true;
          script.defer = true;
          script.onload = () => {
            setTimeout(() => {
              if (window.google?.accounts?.oauth2) resolve(window.google);
              else reject(new Error('تعذر تهيئة مكتبة Google Identity Services'));
            }, 300);
          };
          script.onerror = () => reject(new Error('تعذر تحميل مكتبة Google من الخادم'));
          document.head.appendChild(script);
        } else {
          reject(new Error('تأخر تحميل مكتبة Google. يرجى التحقق من اتصال الإنترنت.'));
        }
      }
    }, 150);
  });
}

/**
 * 1. تسجيل الدخول الرسمي بحساب Google وسحب الاسم والإيميل والصورة
 * يفتح النافذة المنبثقة الرسمية من جوجل لاختيار الحساب ومنح الإذن
 */
export async function signInWithGoogleIdentity(customClientId = null) {
  const clientId = (customClientId || getGoogleClientId()).trim();

  if (!clientId) {
    throw new Error('MISSING_GOOGLE_CLIENT_ID');
  }

  await ensureGoogleLoaded();

  return new Promise((resolve, reject) => {
    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'openid email profile',
        prompt: 'select_account',
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            if (tokenResponse.error === 'access_denied') {
              reject(new Error('تم إلغاء عملية المتابعة من قِبل المستخدم.'));
            } else {
              reject(new Error(`خطأ من Google: ${tokenResponse.error_description || tokenResponse.error}`));
            }
            return;
          }

          try {
            // سحب بيانات المستخدم الحقيقية من Google UserInfo API
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
            });

            if (!res.ok) {
              throw new Error(`تعذر جلب بيانات الحساب (${res.status})`);
            }

            const profile = await res.json();
            const fullName = profile.name || `${profile.given_name || ''} ${profile.family_name || ''}`.trim() || 'طالب كودلينجو';
            const email = profile.email || '';
            const avatar = profile.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(fullName)}`;

            resolve({
              user: {
                id: `g-${profile.sub || Date.now().toString().slice(-6)}`,
                email: email,
                user_metadata: {
                  full_name: fullName,
                  name: fullName,
                  avatar_url: avatar,
                  picture: avatar,
                  email_verified: profile.email_verified
                },
                app_metadata: {
                  provider: 'google'
                }
              },
              profile: {
                id: profile.sub,
                name: fullName,
                email: email,
                avatar: avatar,
                provider: 'google'
              },
              accessToken: tokenResponse.access_token
            });
          } catch (fetchErr) {
            reject(new Error(`فشل الاتصال بـ Google UserInfo: ${fetchErr.message}`));
          }
        }
      });

      // طلب صلاحية الوصول وفتح نافذة جوجل المنبثقة
      client.requestAccessToken({ prompt: 'select_account' });
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * 2. تسجيل الدخول الرسمي بحساب Facebook وسحب الاسم والإيميل والصورة
 */
export async function signInWithFacebookSDK(customAppId = null) {
  const appId = (customAppId || getFacebookAppId()).trim();

  if (!appId) {
    throw new Error('MISSING_FACEBOOK_APP_ID');
  }

  return new Promise((resolve, reject) => {
    function triggerFbLogin() {
      window.FB.login((response) => {
        if (response.authResponse) {
          window.FB.api('/me', { fields: 'id,name,email,picture.width(250).height(250)' }, (profile) => {
            if (!profile || profile.error) {
              reject(new Error(profile?.error?.message || 'تعذر سحب بيانات حساب فيسبوك'));
              return;
            }

            const fullName = profile.name || 'طالب متميز (Facebook)';
            const email = profile.email || `fb.${profile.id}@facebook.com`;
            const avatar = profile.picture?.data?.url || `https://api.dicebear.com/7.x/bottts/svg?seed=FBStudent`;

            resolve({
              user: {
                id: `fb-${profile.id}`,
                email: email,
                user_metadata: {
                  full_name: fullName,
                  name: fullName,
                  avatar_url: avatar,
                  picture: avatar
                },
                app_metadata: {
                  provider: 'facebook'
                }
              },
              profile: {
                id: profile.id,
                name: fullName,
                email: email,
                avatar: avatar,
                provider: 'facebook'
              },
              accessToken: response.authResponse.accessToken
            });
          });
        } else {
          reject(new Error('تم إلغاء تسجيل الدخول بحساب Facebook'));
        }
      }, { scope: 'public_profile,email' });
    }

    if (window.FB) {
      window.FB.init({
        appId: appId,
        cookie: true,
        xfbml: true,
        version: 'v19.0'
      });
      triggerFbLogin();
    } else {
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/ar_AR/sdk.js';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        window.FB.init({
          appId: appId,
          cookie: true,
          xfbml: true,
          version: 'v19.0'
        });
        triggerFbLogin();
      };
      script.onerror = () => reject(new Error('تعذر تحميل مكتبة Facebook SDK'));
      document.body.appendChild(script);
    }
  });
}
