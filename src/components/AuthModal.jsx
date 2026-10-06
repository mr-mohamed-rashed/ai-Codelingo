import React, { useState, useRef, useEffect } from 'react';
import { 
  Mail, 
  User, 
  Phone, 
  CheckCircle, 
  ShieldAlert, 
  Sparkles, 
  LogIn, 
  ArrowRight,
  Camera,
  Upload,
  Lock,
  Smartphone,
  ShieldCheck,
  HeartHandshake
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { playSound } from '../utils/audioEngine';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

export default function AuthModal({ initialMode = 'login' }) {
  const { 
    registerNewStudent, 
    updateStudentProfile,
    setActiveModal, 
    students, 
    setCurrentStudentId, 
    currentStudentId,
    currentStudent,
    isStudentLoggedIn,
    setCurrentPage
  } = useApp();

  // 'login' | 'profile_setup' | 'pending_notice'
  const [authStep, setAuthStep] = useState(
    initialMode === 'profile' || (isStudentLoggedIn && currentStudentId) ? 'profile_setup' : 'login'
  );

  // طريقة تسجيل الدخول المختارة: 'google' | 'facebook' | 'email' | 'phone'
  const [loginMethod, setLoginMethod] = useState('google');

  const isActualStudent = isStudentLoggedIn && currentStudent && currentStudent.status !== 'guest';

  // بيانات النموذج
  const [formData, setFormData] = useState({
    name: isActualStudent ? (currentStudent.name || '') : '',
    email: isActualStudent ? (currentStudent.email || '') : '',
    phone: isActualStudent ? (currentStudent.phone || '') : '',
    guardianPhone: isActualStudent ? (currentStudent.guardianPhone || '') : '',
    avatar: isActualStudent ? (currentStudent.avatar || '') : '',
    provider: isActualStudent ? (currentStudent.provider || 'google') : 'google',
    password: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  // تحديث البيانات إذا تغير الطالب الحالي
  useEffect(() => {
    if (isStudentLoggedIn && currentStudent && currentStudent.status !== 'guest' && authStep === 'profile_setup') {
      setFormData(prev => ({
        ...prev,
        name: currentStudent.name || prev.name,
        email: currentStudent.email || prev.email,
        phone: currentStudent.phone || prev.phone,
        guardianPhone: currentStudent.guardianPhone || prev.guardianPhone,
        avatar: currentStudent.avatar || prev.avatar
      }));
    }
  }, [currentStudent, isStudentLoggedIn, authStep]);

  // رفع صورة شخصية مخصصة من الجهاز
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('يرجى اختيار ملف صورة صالح (JPG, PNG)');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setErrorMessage('حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 4 ميجابايت');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64Data = uploadEvent.target.result;
      setFormData(prev => ({ ...prev, avatar: base64Data }));
      playSound.click();
    };
    reader.readAsDataURL(file);
  };

  // معالجة بيانات الحساب المسحوبة من Google أو Facebook مباشرة
  const handleOAuthProfileSuccess = ({ name, email, avatar, provider }) => {
    // فحص ما إذا كان هناك طالب مسجل مسبقاً بهذا البريد
    const existing = students.find(s => s.email && s.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentStudentId(existing.id);
      if (!existing.guardianPhone) {
        // يحتاج إكمال رقم ولي الأمر فقط
        setFormData({
          name: existing.name || name || '',
          email: existing.email || email,
          phone: existing.phone || '',
          guardianPhone: '',
          avatar: existing.avatar || avatar || '',
          provider
        });
        setAuthStep('profile_setup');
      } else {
        setActiveModal(null);
        setCurrentPage('home');
      }
      return;
    }

    // طالب جديد: نسحب اسمه وصورته الحقيقية وبريده مباشرة إلى البروفايل
    setFormData(prev => ({
      ...prev,
      name: name && name !== 'طالب زائر' ? name : '',
      email: email || '',
      avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email || 'student')}`,
      provider
    }));
    setAuthStep('profile_setup');
  };

  // تسجيل الدخول بحساب Google (جيميل)
  const handleGoogleAuth = async () => {
    playSound.click();
    setErrorMessage('');

    // 1. استخدام مزود Supabase السحابي المباشر (وهو الخيار الأساسي والأنظف)
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin + window.location.pathname
          }
        });
        if (error) throw error;
        return;
      } catch (err) {
        console.error('Supabase Google OAuth error:', err);
        setErrorMessage(err.message || 'تعذر الاتصال بخدمة جوجل عبر Supabase');
        return;
      }
    }

    // 2. استخدام Google Client ID (سواء من .env أو المحفوظ في لوحة المشرف)
    const googleClientId = import.meta.env?.VITE_GOOGLE_CLIENT_ID || localStorage.getItem('agy_google_client_id');
    if (googleClientId && window.google?.accounts?.oauth2) {
      try {
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: 'email profile openid',
          callback: async (tokenResponse) => {
            if (tokenResponse && tokenResponse.access_token) {
              try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                });
                const profile = await res.json();
                handleOAuthProfileSuccess({
                  name: profile.name || '',
                  email: profile.email || '',
                  avatar: profile.picture || '',
                  provider: 'google'
                });
                return;
              } catch (fetchErr) {
                console.error('Error fetching Google profile:', fetchErr);
                setErrorMessage('تم الاتصال بحساب جوجل ولكن تعذر جلب بيانات البروفايل');
              }
            } else if (tokenResponse?.error) {
              setErrorMessage('تعذر إتمام الدخول بحساب جوجل: ' + tokenResponse.error);
            }
          }
        });
        tokenClient.requestAccessToken({ prompt: 'select_account' });
        return;
      } catch (err) {
        console.warn('Google direct OAuth error:', err);
        setErrorMessage('تعذر فتح نافذة حسابات جوجل: ' + (err.message || ''));
        return;
      }
    }

    // 3. إذا لم يكن المفتاح مدخلاً بعد: تنبيه واضح للأستاذ
    setErrorMessage('⚠️ لم يتم ربط معرّف Google Client ID بعد في المنصة. يرجى إدخاله في لوحة تحكم الأستاذ (تبويب المشرفين) أو تزويدنا به لتفعيل اختيار الحساب وسحب الاسم والصورة الحقيقية تلقائياً.');
  };

  // تسجيل الدخول عبر Facebook
  const handleFacebookAuth = async () => {
    playSound.click();
    setErrorMessage('');

    // 1. استخدام مزود Supabase السحابي المباشر
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'facebook',
          options: {
            redirectTo: window.location.origin + window.location.pathname
          }
        });
        if (error) throw error;
        return;
      } catch (err) {
        console.error('Supabase Facebook OAuth error:', err);
        setErrorMessage(err.message || 'تعذر الاتصال بخدمة فيسبوك عبر Supabase');
        return;
      }
    }

    // 2. فحص Facebook App ID (من .env أو لوحة المشرف)
    const fbAppId = import.meta.env?.VITE_FACEBOOK_APP_ID || localStorage.getItem('agy_fb_app_id');
    if (fbAppId && window.FB) {
      try {
        try {
          window.FB.init({
            appId: fbAppId,
            cookie: true,
            xfbml: true,
            version: 'v19.0'
          });
        } catch (initErr) {}

        window.FB.login((response) => {
          if (response.authResponse) {
            window.FB.api('/me', { fields: 'name,email,picture.width(400).height(400)' }, (profile) => {
              handleOAuthProfileSuccess({
                name: profile.name || '',
                email: profile.email || `fb.user.${profile.id}@facebook.com`,
                avatar: profile.picture?.data?.url || '',
                provider: 'facebook'
              });
            });
          } else {
            setErrorMessage('تم إلغاء تسجيل الدخول بفيسبوك أو لم يتم منح الصلاحية');
          }
        }, { scope: 'public_profile,email' });
        return;
      } catch (err) {
        console.warn('Facebook direct OAuth error, falling back:', err);
        setErrorMessage('تعذر فتح نافذة فيسبوك: ' + (err.message || ''));
        return;
      }
    }

    // 3. إذا لم يكن المفتاح مدخلاً بعد
    setErrorMessage('⚠️ لم يتم ربط معرّف Facebook App ID بعد في المنصة. يرجى إدخاله في لوحة تحكم الأستاذ (تبويب المشرفين) أو تزويدنا به لتفعيل اختيار الحساب وسحب الصورة والاسم تلقائياً.');
  };

  // تسجيل الدخول بالبريد الإلكتروني
  const handleEmailAuthSubmit = (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }
    const existing = students.find(s => s.email && s.email.toLowerCase() === formData.email.trim().toLowerCase());
    if (existing) {
      setCurrentStudentId(existing.id);
      setActiveModal(null);
      setCurrentPage('home');
      return;
    }
    setFormData(prev => ({ ...prev, provider: 'email' }));
    setAuthStep('profile_setup');
  };

  // تسجيل الدخول برقم الهاتف
  const handlePhoneAuthSubmit = (e) => {
    e.preventDefault();
    if (!formData.phone.trim() || formData.phone.trim().length < 10) {
      setErrorMessage('يرجى إدخال رقم هاتف صحيح (11 رقماً)');
      return;
    }
    const existing = students.find(s => s.phone && s.phone.trim() === formData.phone.trim());
    if (existing) {
      setCurrentStudentId(existing.id);
      setActiveModal(null);
      setCurrentPage('home');
      return;
    }
    setFormData(prev => ({
      ...prev,
      provider: 'phone',
      email: prev.email || `${formData.phone.trim()}@codelingo.edu`
    }));
    setAuthStep('profile_setup');
  };

  // حفظ الملف الشخصي وتأكيد البيانات (الاسم، صورة الطالب، رقم الهاتف، ورقم ولي الأمر إجباري)
  const handleSaveProfileSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || formData.name.trim().length < 3) {
      setErrorMessage('يرجى كتابة الاسم الثلاثي أو الرباعي للطالب بشكل صحيح');
      return;
    }

    if (!formData.phone.trim() || formData.phone.trim().length < 10) {
      setErrorMessage('يرجى إدخال رقم هاتف الطالب / واتساب (10 أرقام على الأقل)');
      return;
    }

    // شرط إجباري: رقم ولي الأمر
    if (!formData.guardianPhone.trim() || formData.guardianPhone.trim().length < 10) {
      setErrorMessage('⚠️ رقم هاتف ولي الأمر مطلوب إجباري لمتابعة المعلم أ/ محمد راشد مع الأسرة');
      return;
    }

    if (formData.phone.trim() === formData.guardianPhone.trim()) {
      setErrorMessage('تنبيه: يجب إدخال رقم هاتف ولي الأمر مختلفاً عن رقم هاتف الطالب للتواصل المستقل');
      return;
    }

    if (isStudentLoggedIn && currentStudentId) {
      // تعديل ملف موجود
      updateStudentProfile(currentStudentId, {
        name: formData.name,
        phone: formData.phone,
        guardianPhone: formData.guardianPhone,
        email: formData.email,
        avatar: formData.avatar
      });
      setAuthStep('pending_notice');
    } else {
      // تسجيل طالب جديد
      const newStudent = registerNewStudent({
        name: formData.name,
        phone: formData.phone,
        guardianPhone: formData.guardianPhone,
        email: formData.email,
        avatar: formData.avatar,
        provider: formData.provider
      });
      setAuthStep('pending_notice');
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card auth-modal-card">
        <button 
          className="quiz-close-btn"
          onClick={() => setActiveModal(null)}
          title="إغلاق"
        >
          ✕
        </button>

        {/* =========================================================
            المرحلة الأولى: خيارات تسجيل الدخول الأربعة الحقيقية
            (Google, Facebook, Email, Phone) دون عرض حسابات تجريبية
            ========================================================= */}
        {authStep === 'login' && (
          <div className="auth-step-container">
            <div className="auth-icon-badge">
              <Sparkles size={34} className="text-indigo-600" />
            </div>

            <h2 className="auth-title">تسجيل الدخول للمنصة التعليمية</h2>
            <p className="auth-subtitle">
              منهج البرمجة والذكاء الاصطناعي • ثانية بكالوريا <br />
              <strong>إشراف وإعداد: الأستاذ / محمد راشد</strong>
            </p>

            {/* ألسنة التبديل بين طرق الدخول */}
            <div className="auth-methods-nav">
              <button 
                type="button"
                className={`auth-method-tab ${loginMethod === 'google' ? 'active' : ''}`}
                onClick={() => setLoginMethod('google')}
              >
                <span>Google</span>
              </button>
              <button 
                type="button"
                className={`auth-method-tab ${loginMethod === 'facebook' ? 'active' : ''}`}
                onClick={() => setLoginMethod('facebook')}
              >
                <span>Facebook</span>
              </button>
              <button 
                type="button"
                className={`auth-method-tab ${loginMethod === 'phone' ? 'active' : ''}`}
                onClick={() => setLoginMethod('phone')}
              >
                <span>الهاتف</span>
              </button>
              <button 
                type="button"
                className={`auth-method-tab ${loginMethod === 'email' ? 'active' : ''}`}
                onClick={() => setLoginMethod('email')}
              >
                <span>الإيميل</span>
              </button>
            </div>

            {errorMessage && (
              <div className="auth-error-banner">
                {errorMessage}
              </div>
            )}

            {/* محتوى طريقة الدخول: Google */}
            {loginMethod === 'google' && (
              <div className="auth-method-content">
                <p className="text-xs text-slate-500 mb-3 text-center">
                  سجل دخولك بحساب Google (جيميل) لربط إنجازاتك تلقائياً
                </p>
                <button 
                  type="button"
                  className="google-signin-btn"
                  onClick={handleGoogleAuth}
                >
                  <svg className="google-icon" viewBox="0 0 24 24" width="22" height="22">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>المتابعة باستخدام حساب Google (Gmail)</span>
                </button>
              </div>
            )}

            {/* محتوى طريقة الدخول: Facebook */}
            {loginMethod === 'facebook' && (
              <div className="auth-method-content">
                <p className="text-xs text-slate-500 mb-3 text-center">
                  سجل دخولك بحساب فيسبوك المعتمد للتواصل السريع
                </p>
                <button 
                  type="button"
                  className="facebook-signin-btn"
                  onClick={handleFacebookAuth}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>المتابعة باستخدام Facebook</span>
                </button>
              </div>
            )}

            {/* محتوى طريقة الدخول: رقم الهاتف */}
            {loginMethod === 'phone' && (
              <form onSubmit={handlePhoneAuthSubmit} className="auth-method-content">
                <div className="form-field">
                  <label className="field-label">رقم هاتف الطالب / واتساب *</label>
                  <div className="input-with-icon">
                    <Smartphone size={18} className="field-icon" />
                    <input 
                      type="tel" 
                      placeholder="010XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="duo-btn duo-btn-primary w-full mt-3 py-2.5">
                  الدخول والمتابعة برقم الهاتف 📱
                </button>
              </form>
            )}

            {/* محتوى طريقة الدخول: الإيميل وكلمة المرور */}
            {loginMethod === 'email' && (
              <form onSubmit={handleEmailAuthSubmit} className="auth-method-content">
                <div className="form-field">
                  <label className="field-label">البريد الإلكتروني *</label>
                  <div className="input-with-icon">
                    <Mail size={18} className="field-icon" />
                    <input 
                      type="email" 
                      placeholder="student@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-field">
                  <label className="field-label">كلمة المرور *</label>
                  <div className="input-with-icon">
                    <Lock size={18} className="field-icon" />
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="duo-btn duo-btn-primary w-full mt-3 py-2.5">
                  تسجيل الدخول بالبريد الإلكتروني ✉️
                </button>
              </form>
            )}

            <div className="auth-security-notice mt-4">
              <ShieldCheck size={16} className="text-emerald-500 flex-shrink-0" />
              <span>تسجيل الدخول محمي ومربوط مباشرة بنظام مجموعات الأستاذ محمد راشد</span>
            </div>
          </div>
        )}

        {/* =========================================================
            المرحلة الثانية: تظبيط الملف الشخصي للطالب
            (رفع صورة، الاسم، هاتف الطالب، ورقم ولي الأمر إجباري)
            ========================================================= */}
        {authStep === 'profile_setup' && (
          <form className="auth-step-container profile-setup-container" onSubmit={handleSaveProfileSubmit}>
            <div className="auth-icon-badge">
              <User size={34} className="text-indigo-600" />
            </div>

            <h2 className="auth-title">
              {isStudentLoggedIn ? 'تعديل الملف الشخصي' : 'إكمال وتظبيط الملف الشخصي للطالب'}
            </h2>
            <p className="auth-subtitle">
              يرجى رفع صورتك وكتابة بياناتك ورقم ولي الأمر لاعتمادك في مجموعات أ/ محمد راشد
            </p>

            {errorMessage && (
              <div className="auth-error-banner">
                {errorMessage}
              </div>
            )}

            {/* قسم رفع واختيار صورة الطالب الشخصية */}
            <div className="profile-photo-picker-section">
              <div className="photo-preview-wrap">
                <img 
                  src={formData.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=Student'} 
                  alt="Student Preview" 
                  className="photo-preview-img"
                />
                <button 
                  type="button"
                  className="photo-camera-badge"
                  onClick={() => fileInputRef.current?.click()}
                  title="رفع صورة من الجهاز"
                >
                  <Camera size={16} />
                </button>
              </div>

              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePhotoUpload} 
                accept="image/*" 
                style={{ display: 'none' }}
              />

              <div className="photo-actions-wrap">
                <button 
                  type="button" 
                  className="duo-btn duo-btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={14} />
                  <span>رفع صورة شخصية من جهازك</span>
                </button>
                <span className="text-xs text-slate-400">أو اختر أفاتاراً تلقائياً بالاسم</span>
              </div>
            </div>

            <div className="form-fields-group">
              {/* اسم الطالب (إجباري) */}
              <div className="form-field">
                <label className="field-label">اسم الطالب الثلاثي / الرباعي * (إجباري)</label>
                <div className="input-with-icon">
                  <User size={18} className="field-icon" />
                  <input 
                    type="text" 
                    placeholder="مثال: عمر أحمد مصطفى كامل"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* رقم هاتف الطالب */}
              <div className="form-field">
                <label className="field-label">رقم هاتف الطالب / واتساب * (إجباري)</label>
                <div className="input-with-icon">
                  <Phone size={18} className="field-icon" />
                  <input 
                    type="tel" 
                    placeholder="010XXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* رقم ولي الأمر (إجباري مطلوب) */}
              <div className="form-field highlight-field-guardian">
                <label className="field-label guardian-label">
                  <HeartHandshake size={16} className="text-amber-500" />
                  <span>رقم هاتف ولي الأمر * (إجباري لمتابعة الأستاذ)</span>
                </label>
                <div className="input-with-icon">
                  <Phone size={18} className="field-icon text-amber-500" />
                  <input 
                    type="tel" 
                    placeholder="011XXXXXXXX / 012XXXXXXXX"
                    value={formData.guardianPhone}
                    onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                    required
                  />
                </div>
                <span className="field-hint text-amber-600 font-semibold">
                  ⚠️ إجباري: يُستخدم لإرسال تقارير الدرجات، الحضور، وتأكيد اشتراكك مع م/ محمد راشد.
                </span>
              </div>

              {/* البريد الإلكتروني */}
              <div className="form-field">
                <label className="field-label">البريد الإلكتروني (جيميل)</label>
                <div className="input-with-icon">
                  <Mail size={18} className="field-icon" />
                  <input 
                    type="email" 
                    placeholder="student@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="form-actions-row mt-4">
              <button 
                type="button" 
                className="duo-btn duo-btn-secondary"
                onClick={() => setAuthStep('login')}
              >
                رجوع
              </button>
              <button 
                type="submit" 
                className="duo-btn duo-btn-primary flex-1 py-3"
              >
                حفظ البيانات وتأكيد الحساب 🚀
              </button>
            </div>
          </form>
        )}

        {/* =========================================================
            المرحلة الثالثة: إشعار انتظار تصريح المعلم وتسكين المجموعة
            ========================================================= */}
        {authStep === 'pending_notice' && (
          <div className="auth-step-container">
            <div className="pending-badge-icon-wrap">
              <CheckCircle size={52} className="text-emerald-500" />
            </div>

            <h2 className="auth-title text-emerald-700">تم تسجيل وتأكيد بياناتك بنجاح!</h2>
            
            <div className="pending-alert-box">
              <ShieldAlert size={22} className="text-amber-600 flex-shrink-0" />
              <p className="text-sm text-amber-900 leading-relaxed">
                حسابك مسجل الآن في المنصة. طبقاً للنظام، <strong>لن تتمكن من فتح محطات الدروس إلا بعد تصريح واعتماد أ/ محمد راشد وتسكينك في مجموعتك الدراسية</strong> لمتابعة تقدمك ونقاط ضعفك.
              </p>
            </div>

            {/* بطاقة معاينة بيانات الطالب مع صورة الطالب ورقم ولي الأمر */}
            <div className="student-profile-summary-card">
              <img 
                src={formData.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=Student'} 
                alt={formData.name} 
                className="summary-card-avatar"
              />
              <div className="summary-card-info">
                <h4 className="font-bold text-slate-800 text-base">{formData.name}</h4>
                <div className="text-xs text-slate-600 mt-0.5">
                  📱 هاتف الطالب: <strong>{formData.phone}</strong>
                </div>
                <div className="text-xs text-amber-800 font-semibold mt-0.5">
                  👨‍👩‍👧 ولي الأمر: <strong>{formData.guardianPhone}</strong>
                </div>
                {formData.email && (
                  <div className="text-xs text-slate-500 mt-0.5">
                    ✉️ {formData.email}
                  </div>
                )}
                <span className="pending-chip mt-1.5 inline-block">
                  الحالة: في انتظار تصريح الأستاذ وتحديد المجموعة ⏳
                </span>
              </div>
            </div>

            <div className="mt-4 w-full flex flex-col gap-2">
              <a
                href={`https://wa.me/201012345678?text=${encodeURIComponent(
                  `أهلاً يا أستاذ محمد، أنا الطالب ${formData.name}، سجلت في المنصة بالبيانات التالية:\n• هاتف الطالب: ${formData.phone}\n• هاتف ولي الأمر: ${formData.guardianPhone}\n• الإيميل: ${formData.email || 'غير مسجل'}\nأرجو من حضرتك إعطائي تصريح الدخول وتسكيني في مجموعتي الدراسية لمراجعة المنهج.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="duo-btn text-center text-white py-2.5 font-bold flex items-center justify-center gap-2"
                style={{ background: '#25D366', borderBottomColor: '#128C7E' }}
              >
                <span>📲 إرسال رسالة تفعيل للأستاذ عبر واتساب</span>
              </a>

              <button 
                className="duo-btn duo-btn-primary w-full py-2.5"
                onClick={() => {
                  setActiveModal(null);
                  setCurrentPage('home');
                }}
              >
                الدخول للصفحة الرئيسية للمنصة 🏠
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
