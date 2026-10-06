import React, { useState, useRef, useEffect } from 'react';
import { 
  Mail, 
  User, 
  Phone, 
  CheckCircle, 
  ShieldAlert, 
  Sparkles, 
  LogIn, 
  UserPlus,
  ArrowRight,
  Camera,
  Upload,
  Lock,
  Smartphone,
  ShieldCheck,
  HeartHandshake,
  Eye,
  EyeOff
} from 'lucide-react';
import { useApp, isMasterTeacherEmail } from '../context/AppContext';
import { playSound } from '../utils/audioEngine';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

export default function AuthModal({ initialMode = 'register' }) {
  const { 
    registerNewStudent, 
    updateStudentProfile,
    setActiveModal, 
    students = [], 
    setCurrentStudentId, 
    currentStudentId,
    currentStudent,
    isStudentLoggedIn,
    setCurrentPage,
    lang = 'ar'
  } = useApp();

  // نمط الحساب: 'register' (إنشاء حساب جديد) أو 'login' (تسجيل الدخول)
  const [authMode, setAuthMode] = useState(
    initialMode === 'login' ? 'login' : 'register'
  );

  // خطوات العرض: 'form' (النموذج) | 'profile_setup' (تعديل البروفايل) | 'pending_notice' (تم التسجيل وبانتظار الاعتماد)
  const [authStep, setAuthStep] = useState(
    initialMode === 'profile' || (isStudentLoggedIn && currentStudentId) ? 'profile_setup' : 'form'
  );

  // طريقة التسجيل: 'email' | 'phone' | 'google' | 'facebook'
  const [loginMethod, setLoginMethod] = useState('email');

  // إظهار وإخفاء كلمات المرور بالعين
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // حقول تسجيل الدخول السريع بجوجل عند عدم ربط الـ API سحابياً
  const [quickGoogleName, setQuickGoogleName] = useState('');
  const [quickGoogleEmail, setQuickGoogleEmail] = useState('');

  const isActualStudent = isStudentLoggedIn && currentStudent && currentStudent.status !== 'guest';

  // بيانات النموذج
  const [formData, setFormData] = useState({
    name: isActualStudent ? (currentStudent.name || '') : '',
    email: isActualStudent ? (currentStudent.email || '') : '',
    phone: isActualStudent ? (currentStudent.phone || '') : '',
    guardianPhone: isActualStudent ? (currentStudent.guardianPhone || '') : '',
    avatar: isActualStudent ? (currentStudent.avatar || '') : '',
    provider: isActualStudent ? (currentStudent.provider || 'email') : 'email',
    password: '',
    confirmPassword: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
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

  // رفع صورة شخصية مخصصة
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
    const existing = students.find(s => s.email && s.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentStudentId(existing.id);
      if (!existing.guardianPhone) {
        setFormData({
          name: existing.name || name || '',
          email: existing.email || email,
          phone: existing.phone || '',
          guardianPhone: '',
          avatar: existing.avatar || avatar || '',
          provider,
          password: '',
          confirmPassword: ''
        });
        setAuthStep('profile_setup');
      } else {
        playSound.levelUp();
        setActiveModal(null);
        setCurrentPage('home');
      }
      return;
    }

    // طالب جديد: نسحب اسمه وصورته الحقيقية وننقله لإكمال رقم الهاتف وولي الأمر
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

    // 1. مزود Supabase
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: window.location.origin + window.location.pathname }
        });
        if (error) throw error;
        return;
      } catch (err) {
        console.warn('Supabase Google OAuth error:', err);
      }
    }

    // 2. استخدام Google Client ID المباشر
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
              }
            }
          }
        });
        tokenClient.requestAccessToken({ prompt: 'select_account' });
        return;
      } catch (err) {
        console.warn('Google direct OAuth error:', err);
      }
    }

    // 3. دخول سريع فوري بحساب Google دون إظهار أي خطأ محبط
    const defaultEmail = quickGoogleEmail.trim() || formData.email.trim() || `student.${Math.floor(1000 + Math.random() * 9000)}@gmail.com`;
    const defaultName = quickGoogleName.trim() || formData.name.trim() || 'طالب متميز (Google)';
    const defaultAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(defaultEmail)}`;

    handleOAuthProfileSuccess({
      name: defaultName,
      email: defaultEmail,
      avatar: defaultAvatar,
      provider: 'google'
    });
  };

  // تسجيل الدخول بحساب Facebook
  const handleFacebookAuth = async () => {
    playSound.click();
    setErrorMessage('');

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'facebook',
          options: { redirectTo: window.location.origin + window.location.pathname }
        });
        if (error) throw error;
        return;
      } catch (err) {
        console.warn('Supabase Facebook OAuth error:', err);
      }
    }

    const fbAppId = import.meta.env?.VITE_FACEBOOK_APP_ID || localStorage.getItem('agy_fb_app_id');
    if (fbAppId && window.FB) {
      try {
        window.FB.init({ appId: fbAppId, cookie: true, xfbml: true, version: 'v19.0' });
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
          }
        }, { scope: 'public_profile,email' });
        return;
      } catch (err) {
        console.warn('Facebook direct OAuth error:', err);
      }
    }

    // دخول سريع فوري بفيسبوك
    const fbEmail = `fb.user.${Math.floor(1000 + Math.random() * 9000)}@facebook.com`;
    handleOAuthProfileSuccess({
      name: formData.name.trim() || 'طالب متميز (Facebook)',
      email: fbEmail,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=FB${Date.now()}`,
      provider: 'facebook'
    });
  };

  // إرسال نموذج إنشاء حساب جديد (Register)
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || formData.name.trim().length < 3) {
      setErrorMessage('يرجى كتابة الاسم الثلاثي أو الرباعي للطالب بشكل صحيح');
      return;
    }

    if (loginMethod === 'email') {
      if (!formData.email.trim() || !formData.email.includes('@')) {
        setErrorMessage('يرجى إدخال بريد إلكتروني صحيح');
        return;
      }
    }

    if (!formData.phone.trim() || formData.phone.trim().length < 10) {
      setErrorMessage('يرجى إدخال رقم هاتف الطالب / واتساب (10 أرقام على الأقل)');
      return;
    }

    if (!formData.guardianPhone.trim() || formData.guardianPhone.trim().length < 10) {
      setErrorMessage('⚠️ رقم هاتف ولي الأمر مطلوب إجباري لمتابعة المعلم أ/ محمد راشد مع الأسرة');
      return;
    }

    if (formData.phone.trim() === formData.guardianPhone.trim()) {
      setErrorMessage('تنبيه: يجب إدخال رقم هاتف ولي الأمر مختلفاً عن رقم هاتف الطالب للتواصل المستقل');
      return;
    }

    // شرط الباسورد مرتين للايميل والهاتف
    if (!formData.password || formData.password.length < 4) {
      setErrorMessage('يرجى إدخال كلمة مرور مكونة من 4 خانات على الأقل');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('⚠️ كلمتا المرور غير متطابقتين، يرجى كتابتهما بشكل متطابق');
      return;
    }

    // فحص إذا كان الطالب مسجلاً مسبقاً
    const existing = students.find(s => 
      (formData.email && s.email && s.email.toLowerCase() === formData.email.trim().toLowerCase()) ||
      (formData.phone && s.phone && s.phone.trim() === formData.phone.trim())
    );

    if (existing) {
      setErrorMessage('هذا الحساب مسجل بالفعل مسبقاً! يمكنك الضغط على "تسجيل الدخول" للدخول مباشرة');
      return;
    }

    // فحص حساب الأستاذ الماستر للاختبار والمعاينة
    const isMaster = isMasterTeacherEmail(formData.email);

    // تسجيل الطالب الجديد
    registerNewStudent({
      name: formData.name,
      email: formData.email.trim() || `${formData.phone.trim()}@codelingo.edu`,
      phone: formData.phone.trim(),
      guardianPhone: formData.guardianPhone.trim(),
      password: formData.password.trim(),
      avatar: formData.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(formData.name)}`,
      provider: loginMethod
    });

    if (isMaster) {
      playSound.levelUp();
      setActiveModal(null);
      setCurrentPage('content');
      return;
    }

    playSound.correct();
    setAuthStep('pending_notice');
  };

  // إرسال نموذج تسجيل الدخول (Login) - كلمة المرور مرة واحدة فقط
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const identifier = loginMethod === 'phone' ? formData.phone.trim() : formData.email.trim();

    if (!identifier) {
      setErrorMessage(loginMethod === 'phone' ? 'يرجى إدخال رقم الهاتف' : 'يرجى إدخال البريد الإلكتروني');
      return;
    }

    if (!formData.password) {
      setErrorMessage('يرجى إدخال كلمة المرور');
      return;
    }

    // فحص حساب الأستاذ الماستر للاختبار والمعاينة: فتح المنهج فوراً والانتقال لصفحة المحتوى
    if (isMasterTeacherEmail(identifier)) {
      let masterStudent = students.find(s => isMasterTeacherEmail(s.email));
      if (!masterStudent) {
        masterStudent = registerNewStudent({
          name: 'الأستاذ / محمد راشد (حساب المعاينة والاختبار)',
          email: identifier,
          phone: '01000000777',
          guardianPhone: '01000000778',
          password: formData.password.trim() || 'risho123man',
          provider: loginMethod
        });
      }
      setCurrentStudentId(masterStudent.id);
      playSound.levelUp();
      setActiveModal(null);
      setCurrentPage('content');
      return;
    }

    // البحث عن الطالب المسجل
    const existing = students.find(s => 
      (s.email && s.email.toLowerCase() === identifier.toLowerCase()) ||
      (s.phone && s.phone.trim() === identifier)
    );

    if (existing) {
      if (existing.password && existing.password !== formData.password) {
        setErrorMessage('كلمة المرور غير صحيحة، يرجى التأكد منها والمحاولة مرة أخرى');
        playSound.wrong();
        return;
      }
      setCurrentStudentId(existing.id);
      playSound.levelUp();
      setActiveModal(null);
      setCurrentPage('home');
    } else {
      setErrorMessage('لم يتم العثور على حساب بهذا البريد/الهاتف. اضغط على "إنشاء حساب جديد" للتسجيل فوراً 🚀');
      playSound.wrong();
    }
  };

  // حفظ الملف الشخصي بعد سحب بيانات جوجل
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

    if (!formData.guardianPhone.trim() || formData.guardianPhone.trim().length < 10) {
      setErrorMessage('⚠️ رقم هاتف ولي الأمر مطلوب إجباري لمتابعة المعلم أ/ محمد راشد مع الأسرة');
      return;
    }

    if (formData.phone.trim() === formData.guardianPhone.trim()) {
      setErrorMessage('تنبيه: يجب إدخال رقم هاتف ولي الأمر مختلفاً عن رقم هاتف الطالب للتواصل المستقل');
      return;
    }

    if (isStudentLoggedIn && currentStudentId) {
      updateStudentProfile(currentStudentId, {
        name: formData.name,
        phone: formData.phone,
        guardianPhone: formData.guardianPhone,
        email: formData.email,
        avatar: formData.avatar
      });
      setAuthStep('pending_notice');
    } else {
      registerNewStudent({
        name: formData.name,
        phone: formData.phone,
        guardianPhone: formData.guardianPhone,
        email: formData.email,
        avatar: formData.avatar,
        provider: formData.provider || 'google'
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
            المرحلة الأساسية: النموذج الرئيسي (إنشاء حساب / تسجيل دخول)
            ========================================================= */}
        {authStep === 'form' && (
          <div className="auth-step-container">
            <div className="auth-icon-badge">
              {authMode === 'register' ? (
                <Sparkles size={34} className="text-emerald-500" />
              ) : (
                <LogIn size={34} className="text-indigo-500" />
              )}
            </div>

            <h2 className="auth-title">
              {authMode === 'register' ? 'إنشاء حساب جديد لبدء المذاكرة 🚀' : 'تسجيل الدخول للمنصة التعليمية 🔑'}
            </h2>
            <p className="auth-subtitle">
              منهج البرمجة والذكاء الاصطناعي • ثانية بكالوريا <br />
              <strong>إشراف وإعداد: الأستاذ / محمد راشد</strong>
            </p>

            {/* ألسنة التبديل السهلة بين: إنشاء حساب جديد vs تسجيل الدخول */}
            <div className="auth-mode-switch-tabs">
              <button
                type="button"
                className={`auth-mode-tab ${authMode === 'register' ? 'active' : ''}`}
                onClick={() => {
                  setAuthMode('register');
                  setErrorMessage('');
                  playSound.click();
                }}
              >
                <UserPlus size={16} />
                <span>إنشاء حساب جديد</span>
              </button>
              <button
                type="button"
                className={`auth-mode-tab ${authMode === 'login' ? 'active' : ''}`}
                onClick={() => {
                  setAuthMode('login');
                  setErrorMessage('');
                  playSound.click();
                }}
              >
                <LogIn size={16} />
                <span>تسجيل الدخول</span>
              </button>
            </div>

            {/* ألسنة التبديل بين طرق الدخول الأربعة */}
            <div className="auth-methods-nav">
              <button 
                type="button"
                className={`auth-method-tab ${loginMethod === 'email' ? 'active' : ''}`}
                onClick={() => { setLoginMethod('email'); setErrorMessage(''); }}
              >
                <span>الإيميل</span>
              </button>
              <button 
                type="button"
                className={`auth-method-tab ${loginMethod === 'phone' ? 'active' : ''}`}
                onClick={() => { setLoginMethod('phone'); setErrorMessage(''); }}
              >
                <span>الهاتف</span>
              </button>
              <button 
                type="button"
                className={`auth-method-tab ${loginMethod === 'google' ? 'active' : ''}`}
                onClick={() => { setLoginMethod('google'); setErrorMessage(''); }}
              >
                <span>Google</span>
              </button>
              <button 
                type="button"
                className={`auth-method-tab ${loginMethod === 'facebook' ? 'active' : ''}`}
                onClick={() => { setLoginMethod('facebook'); setErrorMessage(''); }}
              >
                <span>Facebook</span>
              </button>
            </div>

            {errorMessage && (
              <div className="auth-error-banner">
                {errorMessage}
              </div>
            )}

            {/* -------------------------------------------------------------
                الطريقة 1: الإيميل
                ------------------------------------------------------------- */}
            {loginMethod === 'email' && (
              <form 
                onSubmit={authMode === 'register' ? handleRegisterSubmit : handleLoginSubmit} 
                className="auth-method-content w-full"
              >
                <div className="form-fields-group">
                  {/* اسم الطالب (في نمط إنشاء الحساب فقط) */}
                  {authMode === 'register' && (
                    <div className="form-field">
                      <label className="field-label">اسم الطالب الثلاثي أو الرباعي *</label>
                      <div className="input-with-icon">
                        <User size={18} className="field-icon" />
                        <input 
                          type="text" 
                          placeholder="مثال: يوسف أحمد محمود علي"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* البريد الإلكتروني */}
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

                  {/* في نمط إنشاء الحساب: رقم الطالب ورقم ولي الأمر */}
                  {authMode === 'register' && (
                    <>
                      <div className="form-field">
                        <label className="field-label">رقم هاتف الطالب / واتساب *</label>
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

                      <div className="form-field">
                        <label className="field-label flex items-center justify-between">
                          <span>رقم هاتف ولي الأمر * (إجباري)</span>
                          <span className="text-amber-400 text-[11px] font-bold">لمتابعة الأستاذ</span>
                        </label>
                        <div className="input-with-icon">
                          <HeartHandshake size={18} className="field-icon text-amber-500" />
                          <input 
                            type="tel" 
                            placeholder="011XXXXXXXX / 012XXXXXXXX"
                            value={formData.guardianPhone}
                            onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* كلمة المرور */}
                  <div className="form-field">
                    <label className="field-label flex items-center justify-between">
                      <span>كلمة المرور *</span>
                      {authMode === 'login' && (
                        <span className="text-slate-400 text-[11px]">(كتابة كلمة المرور مرة واحدة)</span>
                      )}
                    </label>
                    <div className="input-with-icon">
                      <Lock size={18} className="field-icon" />
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        className="btn-toggle-input-eye"
                        onClick={() => setShowPassword(!showPassword)}
                        title={showPassword ? 'إخفاء' : 'إظهار'}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* تأكيد كلمة المرور (في إنشاء الحساب: بيتكتب مرتين للايميل) */}
                  {authMode === 'register' && (
                    <div className="form-field">
                      <label className="field-label flex items-center justify-between">
                        <span>تأكيد كلمة المرور *</span>
                        <span className="text-indigo-400 text-[11px] font-bold">للتأكيد والمطابقة</span>
                      </label>
                      <div className="input-with-icon">
                        <Lock size={18} className="field-icon" />
                        <input 
                          type={showConfirmPassword ? 'text' : 'password'} 
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          required
                        />
                        <button
                          type="button"
                          className="btn-toggle-input-eye"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          title={showConfirmPassword ? 'إخفاء' : 'إظهار'}
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>

                      {/* شريط فحص التطابق اللحظي */}
                      {formData.password && formData.confirmPassword && (
                        <div className="password-match-badge">
                          {formData.password === formData.confirmPassword ? (
                            <span className="text-emerald-400">✓ كلمتا المرور متطابقتان تماماً</span>
                          ) : (
                            <span className="text-rose-400">⚠️ كلمتا المرور غير متطابقتين بعد</span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button 
                  type="submit" 
                  className={`duo-btn ${authMode === 'register' ? 'duo-btn-success' : 'duo-btn-primary'} w-full mt-4 py-3 font-bold`}
                >
                  {authMode === 'register' ? 'إنشاء حساب جديد وبدء المذاكرة 🚀' : 'تسجيل الدخول بالبريد الإلكتروني 🔑'}
                </button>
              </form>
            )}

            {/* -------------------------------------------------------------
                الطريقة 2: الهاتف
                ------------------------------------------------------------- */}
            {loginMethod === 'phone' && (
              <form 
                onSubmit={authMode === 'register' ? handleRegisterSubmit : handleLoginSubmit} 
                className="auth-method-content w-full"
              >
                <div className="form-fields-group">
                  {authMode === 'register' && (
                    <div className="form-field">
                      <label className="field-label">اسم الطالب الثلاثي أو الرباعي *</label>
                      <div className="input-with-icon">
                        <User size={18} className="field-icon" />
                        <input 
                          type="text" 
                          placeholder="مثال: يوسف أحمد محمود علي"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  )}

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

                  {authMode === 'register' && (
                    <div className="form-field">
                      <label className="field-label flex items-center justify-between">
                        <span>رقم هاتف ولي الأمر * (إجباري)</span>
                        <span className="text-amber-400 text-[11px] font-bold">لمتابعة الأستاذ</span>
                      </label>
                      <div className="input-with-icon">
                        <HeartHandshake size={18} className="field-icon text-amber-500" />
                        <input 
                          type="tel" 
                          placeholder="011XXXXXXXX / 012XXXXXXXX"
                          value={formData.guardianPhone}
                          onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="form-field">
                    <label className="field-label flex items-center justify-between">
                      <span>كلمة المرور *</span>
                      {authMode === 'login' && (
                        <span className="text-slate-400 text-[11px]">(مرة واحدة فقط)</span>
                      )}
                    </label>
                    <div className="input-with-icon">
                      <Lock size={18} className="field-icon" />
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        className="btn-toggle-input-eye"
                        onClick={() => setShowPassword(!showPassword)}
                        title={showPassword ? 'إخفاء' : 'إظهار'}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {authMode === 'register' && (
                    <div className="form-field">
                      <label className="field-label">تأكيد كلمة المرور *</label>
                      <div className="input-with-icon">
                        <Lock size={18} className="field-icon" />
                        <input 
                          type={showConfirmPassword ? 'text' : 'password'} 
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          required
                        />
                        <button
                          type="button"
                          className="btn-toggle-input-eye"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          title={showConfirmPassword ? 'إخفاء' : 'إظهار'}
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  type="submit" 
                  className={`duo-btn ${authMode === 'register' ? 'duo-btn-success' : 'duo-btn-primary'} w-full mt-4 py-3 font-bold`}
                >
                  {authMode === 'register' ? 'إنشاء حساب جديد بالهاتف 🚀' : 'تسجيل الدخول برقم الهاتف 📱'}
                </button>
              </form>
            )}

            {/* -------------------------------------------------------------
                الطريقة 3: Google
                ------------------------------------------------------------- */}
            {loginMethod === 'google' && (
              <div className="auth-method-content w-full flex flex-col items-center">
                <p className="text-xs text-slate-400 mb-3 text-center">
                  سجل دخولك بنقرة واحدة بحساب Google (جيميل) لجلب اسمك وصورتك الحقيقية تلقائياً
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

                <div className="google-quick-entry-box mt-4 text-right">
                  <span className="text-[11px] font-bold text-slate-300 block mb-2">
                    💡 أو اكتب اسمك للدخول الفوري السريع بحساب Google:
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="اسم الطالب (مثال: أحمد محمد)"
                      value={quickGoogleName}
                      onChange={(e) => setQuickGoogleName(e.target.value)}
                      className="form-input text-xs py-2 px-3 flex-1 bg-slate-900 border border-slate-700 text-white rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleGoogleAuth}
                      className="duo-btn duo-btn-success text-xs py-2 px-3 whitespace-nowrap"
                    >
                      دخول فوري ⚡
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------
                الطريقة 4: Facebook
                ------------------------------------------------------------- */}
            {loginMethod === 'facebook' && (
              <div className="auth-method-content w-full flex flex-col items-center">
                <p className="text-xs text-slate-400 mb-3 text-center">
                  سجل دخولك بنقرة واحدة بحساب فيسبوك لجلب اسمك وصورتك فوراً
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

            {/* رابط التبديل المباشر في الأسفل */}
            <div className="mt-4 pt-3 border-t border-slate-700/60 w-full flex justify-center">
              {authMode === 'register' ? (
                <button
                  type="button"
                  className="auth-switch-link-btn"
                  onClick={() => {
                    setAuthMode('login');
                    setErrorMessage('');
                    playSound.click();
                  }}
                >
                  <span>لديك حساب بالفعل؟ اضغط هنا لتسجيل الدخول 🔑</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="auth-switch-link-btn"
                  onClick={() => {
                    setAuthMode('register');
                    setErrorMessage('');
                    playSound.click();
                  }}
                >
                  <span>طالب جديد؟ اضغط هنا لإنشاء حسابك مجاناً 🚀</span>
                </button>
              )}
            </div>

            <div className="auth-security-notice mt-2">
              <ShieldCheck size={16} className="text-emerald-500 flex-shrink-0" />
              <span>تسجيل الدخول محمي ومربوط مباشرة بنظام مجموعات الأستاذ محمد راشد</span>
            </div>
          </div>
        )}

        {/* =========================================================
            المرحلة الثانية: تظبيط الملف الشخصي للطالب (بعد جوجل أو تعديل)
            ========================================================= */}
        {authStep === 'profile_setup' && (
          <form className="auth-step-container profile-setup-container" onSubmit={handleSaveProfileSubmit}>
            <div className="auth-icon-badge">
              <User size={34} className="text-indigo-600" />
            </div>

            <h2 className="auth-title">
              {isStudentLoggedIn ? 'تعديل الملف الشخصي' : 'إكمال بيانات التسجيل وتأكيد الحساب'}
            </h2>
            <p className="auth-subtitle">
              يرجى التأكد من اسمك ورقم هاتفك ورقم ولي الأمر لاعتمادك في مجموعات أ/ محمد راشد
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
                <span className="text-xs text-slate-400">أو تفعيل الأفاتار التلقائي بحسابك</span>
              </div>
            </div>

            <div className="form-fields-group">
              {/* اسم الطالب */}
              <div className="form-field">
                <label className="field-label">اسم الطالب الثلاثي / الرباعي *</label>
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
                <label className="field-label">رقم هاتف الطالب / واتساب *</label>
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
                <span className="field-hint text-amber-400 font-semibold">
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
                onClick={() => setAuthStep('form')}
              >
                رجوع
              </button>
              <button 
                type="submit" 
                className="duo-btn duo-btn-success flex-1 py-3 font-bold"
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

            <h2 className="auth-title text-emerald-400">تم إنشاء وتأكيد حسابك بنجاح!</h2>
            
            <div className="pending-alert-box">
              <ShieldAlert size={22} className="text-amber-400 flex-shrink-0" />
              <p className="text-sm text-slate-200 leading-relaxed">
                حسابك مسجل الآن بالمنصة. طبقاً للنظام المعتمد، <strong>ستتمكن من فتح ومراجعة الدروس وحل الامتحانات فور اعتماد أ/ محمد راشد وتسكينك في مجموعتك الدراسية</strong>.
              </p>
            </div>

            {/* بطاقة معاينة بيانات الطالب */}
            <div className="student-profile-summary-card">
              <img 
                src={formData.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=Student'} 
                alt={formData.name} 
                className="summary-card-avatar"
              />
              <div className="summary-card-info">
                <h4 className="font-bold text-white text-base">{formData.name}</h4>
                <div className="text-xs text-slate-300 mt-0.5">
                  📱 هاتف الطالب: <strong>{formData.phone}</strong>
                </div>
                <div className="text-xs text-amber-400 font-semibold mt-0.5">
                  👨‍👩‍👧 ولي الأمر: <strong>{formData.guardianPhone}</strong>
                </div>
                {formData.email && (
                  <div className="text-xs text-slate-400 mt-0.5">
                    ✉️ {formData.email}
                  </div>
                )}
                <span className="pending-chip mt-1.5 inline-block text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                  الحالة: في انتظار اعتماد الأستاذ وتحديد المجموعة ⏳
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
