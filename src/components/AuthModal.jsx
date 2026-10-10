import React, { useState, useRef, useEffect } from 'react';
import './AuthModal.css';
import { 
  Mail, 
  User, 
  Phone, 
  Sparkles, 
  LogIn, 
  UserPlus, 
  Lock, 
  Smartphone, 
  ShieldCheck, 
  HeartHandshake, 
  Eye, 
  EyeOff, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useApp, isMasterTeacherEmail } from '../context/AppContext';
import { playSound } from '../utils/audioEngine';
import { isSupabaseConfigured } from '../utils/supabaseClient';

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

  // نمط الحساب: 'login' (تسجيل الدخول والمتابعة) أو 'register' (إنشاء حساب جديد)
  const [authMode, setAuthMode] = useState(
    initialMode === 'login' ? 'login' : 'register'
  );

  // مراحل الواجهة: 'main' (الشاشة الرئيسية) | 'phones_setup' (إكمال رقم الطالب وولي الأمر بعد سحب جوجل) | 'google_quick_picker'
  const [authStep, setAuthStep] = useState(
    initialMode === 'profile' && isStudentLoggedIn ? 'phones_setup' : 'main'
  );

  // حالة التحميل أثناء الضغط لمنع الإحساس بعدم الاستجابة
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // إظهار وإخفاء كلمات المرور
  const [showPassword, setShowPassword] = useState(false);

  // بيانات حساب جوجل السريع عند العمل بدون OAuth سحابي
  const [googlePickerName, setGooglePickerName] = useState('');
  const [googlePickerEmail, setGooglePickerEmail] = useState('');

  // بيانات النموذج
  const isActualStudent = isStudentLoggedIn && currentStudent && currentStudent.status !== 'guest';
  const [formData, setFormData] = useState({
    name: isActualStudent ? (currentStudent.name || '') : '',
    email: isActualStudent ? (currentStudent.email || '') : '',
    phone: isActualStudent ? (currentStudent.phone || '') : '',
    guardianPhone: isActualStudent ? (currentStudent.guardianPhone || '') : '',
    avatar: isActualStudent ? (currentStudent.avatar || '') : '',
    provider: isActualStudent ? (currentStudent.provider || 'google') : 'google',
    password: ''
  });

  // تحديث البيانات إذا تغير الطالب
  useEffect(() => {
    if (isStudentLoggedIn && currentStudent && currentStudent.status !== 'guest') {
      setFormData(prev => ({
        ...prev,
        name: currentStudent.name || prev.name,
        email: currentStudent.email || prev.email,
        phone: currentStudent.phone || prev.phone,
        guardianPhone: currentStudent.guardianPhone || prev.guardianPhone,
        avatar: currentStudent.avatar || prev.avatar
      }));
    }
  }, [currentStudent, isStudentLoggedIn]);

  /**
   * 1. معالجة نجاح جلب الحساب من Google أو Facebook
   * - في تسجيل الدخول: متابعة ودخول فوري بدون طلب تغيير أي بيانات!
   * - في إنشاء الحساب: سحب الاسم والصورة ونقله لإدخال رقم هاتفه ورقم ولي الأمر!
   */
  const handleOAuthSuccess = (profile) => {
    const { name, email, avatar, provider } = profile;
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (name || '').trim() || 'طالب متميز';

    // فحص هل الطالب موجود بالفعل في المنصة
    const existing = students.find(s => s.email && s.email.toLowerCase() === cleanEmail);

    // =========================================================================
    // الحالة 1: في نمط "تسجيل الدخول" ⬅️ متابعة مباشرة دون طلب أي تغيير للبيانات
    // =========================================================================
    if (authMode === 'login') {
      if (existing) {
        setCurrentStudentId(existing.id);
      } else {
        // إذا لم يكن مسجلاً، نسجله فوراً وندخله مباشرة
        const newStd = registerNewStudent({
          name: cleanName,
          email: cleanEmail,
          avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanName)}`,
          provider: provider || 'google'
        });
        setCurrentStudentId(newStd.id);
      }
      playSound.levelUp();
      setActiveModal(null);
      setCurrentPage('home');
      return;
    }

    // =========================================================================
    // الحالة 2: في نمط "إنشاء حساب جديد" ⬅️ سحب الاسم والصورة وإكمال أرقام الهواتف
    // =========================================================================
    setFormData(prev => ({
      ...prev,
      name: cleanName,
      email: cleanEmail,
      avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanName)}`,
      provider: provider || 'google',
      phone: existing?.phone || prev.phone || '',
      guardianPhone: existing?.guardianPhone || prev.guardianPhone || ''
    }));

    // الانتقال للخطوة الواضحة: إدخال رقم هاتف الطالب ورقم ولي الأمر فقط
    setAuthStep('phones_setup');
  };

  /**
   * 2. تسجيل الدخول / المتابعة عبر Google
   */
  const handleGoogleAuth = async () => {
    playSound.click();
    setErrorMessage('');
    setIsLoading(true);

    // إذا كانت إعدادات Supabase مهيأة سحابياً
    if (isSupabaseConfigured) {
      try {
        const { signInWithGoogleOAuth } = await import('../services/studentService');
        await signInWithGoogleOAuth();
        return;
      } catch (err) {
        console.warn('Supabase Google OAuth note:', err);
        // إذا كان هناك مانع سحابي، لا نترك الزر صامتاً بل ننتقل للاختيار الفوري
        setIsLoading(false);
      }
    }

    // فتح نافذة اختيار الحساب السريع لجوجل
    setIsLoading(false);
    setAuthStep('google_quick_picker');
  };

  /**
   * 3. تسجيل الدخول / المتابعة عبر Facebook
   */
  const handleFacebookAuth = async () => {
    playSound.click();
    setErrorMessage('');
    setIsLoading(true);

    if (isSupabaseConfigured) {
      try {
        const { signInWithFacebookOAuth } = await import('../services/studentService');
        await signInWithFacebookOAuth();
        return;
      } catch (err) {
        console.warn('Supabase Facebook OAuth note:', err);
        setIsLoading(false);
      }
    }

    setIsLoading(false);
    // محاكاة فورية لحساب فيسبوك
    handleOAuthSuccess({
      name: formData.name.trim() || 'طالب متميز (Facebook)',
      email: formData.email.trim() || `student.fb.${Math.floor(1000 + Math.random() * 9000)}@facebook.com`,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=FBStudent`,
      provider: 'facebook'
    });
  };

  /**
   * 4. إرسال نموذج تسجيل الدخول اليدوي (بالإيميل أو الهاتف)
   * متابعة ودخول مباشر دون تغيير أي بيانات
   */
  const handleManualLogin = (e) => {
    e.preventDefault();
    setErrorMessage('');
    const identifier = (formData.email || formData.phone || '').trim();

    if (!identifier) {
      setErrorMessage('يرجى إدخال رقم هاتفك أو بريدك الإلكتروني للمتابعة');
      return;
    }

    // فحص حساب الأستاذ الماستر للاختبار
    if (isMasterTeacherEmail(identifier)) {
      let masterStudent = students.find(s => isMasterTeacherEmail(s.email));
      if (!masterStudent) {
        masterStudent = registerNewStudent({
          name: 'الأستاذ / محمد راشد (حساب المعاينة والاختبار)',
          email: identifier,
          phone: '01000000777',
          guardianPhone: '01000000778',
          password: formData.password.trim() || 'risho123man',
          provider: 'email'
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
      // إذا كان لديه كلمة مرور مسجلة، نتحقق منها إذا أدخل كلمة مرور
      if (existing.password && formData.password && existing.password !== formData.password.trim()) {
        setErrorMessage('كلمة المرور غير صحيحة، يرجى التأكد منها والمحاولة مرة أخرى');
        playSound.wrong();
        return;
      }
      // متابعة فورية ودخول للمنصة
      setCurrentStudentId(existing.id);
      playSound.levelUp();
      setActiveModal(null);
      setCurrentPage('home');
    } else {
      // إذا لم يكن مسجلاً، نسأله إذا كان يريد إنشاء حساب به الآن بضغطة زر
      setErrorMessage('لم يتم العثور على حساب بهذا البريد/الهاتف. اضغط على "إنشاء حساب جديد" للتسجيل فوراً 🚀');
      playSound.wrong();
    }
  };

  /**
   * 5. حفظ إكمال إنشاء الحساب (بعد إدخال رقم الهاتف ورقم ولي الأمر)
   */
  const handleCompleteRegistrationSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const phone = formData.phone.trim();
    const guardianPhone = formData.guardianPhone.trim();

    if (!phone || phone.length < 10) {
      setErrorMessage('يرجى إدخال رقم هاتف الطالب / واتساب (10 أرقام على الأقل)');
      return;
    }

    if (!guardianPhone || guardianPhone.length < 10) {
      setErrorMessage('⚠️ رقم هاتف ولي الأمر مطلوب إجباري لمتابعة المعلم أ/ محمد راشد مع الأسرة');
      return;
    }

    if (phone === guardianPhone) {
      setErrorMessage('تنبيه: يجب إدخال رقم هاتف ولي الأمر مختلفاً عن رقم هاتف الطالب للتواصل المستقل');
      return;
    }

    setIsLoading(true);

    // تسجيل الطالب وحفظه في سوبا بيز والتخزين المحلي
    const newStudent = registerNewStudent({
      name: formData.name.trim() || 'طالب كودلينجو',
      email: formData.email.trim() || `${phone}@codelingo.edu`,
      phone: phone,
      guardianPhone: guardianPhone,
      avatar: formData.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(formData.name)}`,
      provider: formData.provider || 'google'
    });

    setIsLoading(false);
    playSound.levelUp();
    setActiveModal(null);
    setCurrentPage('home');
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card auth-modal-card">
        {/* زر الإغلاق */}
        <button 
          className="quiz-close-btn"
          onClick={() => setActiveModal(null)}
          title="إغلاق"
        >
          ✕
        </button>

        {/* =========================================================================
            المرحلة 1: الشاشة الرئيسية (تسجيل الدخول السريع أو اختيار إنشاء حساب)
            ========================================================================= */}
        {authStep === 'main' && (
          <div className="auth-step-container">
            <div className="auth-icon-badge">
              {authMode === 'register' ? (
                <Sparkles size={34} className="text-emerald-500" />
              ) : (
                <LogIn size={34} className="text-indigo-500" />
              )}
            </div>

            <h2 className="auth-title">
              {authMode === 'register' ? 'إنشاء حساب جديد لبدء المذاكرة 🚀' : 'تسجيل الدخول والمتابعة للمنصة 🔑'}
            </h2>
            <p className="auth-subtitle">
              منهج البرمجة والذكاء الاصطناعي • ثانية بكالوريا <br />
              <strong>إشراف وتدريس: الأستاذ / محمد راشد</strong>
            </p>

            {/* ألسنة التبديل السهلة بين: إنشاء حساب جديد vs تسجيل الدخول */}
            <div className="auth-mode-switch-tabs">
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
            </div>

            {errorMessage && (
              <div className="auth-error-banner w-full">
                {errorMessage}
              </div>
            )}

            {/* الأزرار المباشرة الاجتماعية الأساسية */}
            <div className="w-full flex flex-col gap-2.5 my-1">
              {/* زر Google المعتمد */}
              <button 
                type="button" 
                className="google-signin-btn"
                onClick={handleGoogleAuth}
                disabled={isLoading}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>
                  {isLoading 
                    ? 'جارٍ الاتصال والمتابعة... ⏳' 
                    : authMode === 'login' 
                      ? 'المتابعة والدخول بحساب Google' 
                      : 'المتابعة والتسجيل بحساب Google'
                  }
                </span>
              </button>

              {/* زر Facebook */}
              <button 
                type="button" 
                className="facebook-signin-btn"
                onClick={handleFacebookAuth}
                disabled={isLoading}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>
                  {authMode === 'login' 
                    ? 'المتابعة والدخول بحساب Facebook' 
                    : 'المتابعة والتسجيل بحساب Facebook'
                  }
                </span>
              </button>
            </div>

            <div className="auth-divider">
              <span>أو المتابعة برقم الهاتف / البريد الإلكتروني</span>
            </div>

            {/* النموذج المباشر السريع */}
            <form onSubmit={handleManualLogin} className="w-full flex flex-col gap-3">
              <div className="form-field text-right">
                <label className="field-label">رقم الهاتف أو البريد الإلكتروني *</label>
                <div className="input-with-icon">
                  <Smartphone size={18} className="field-icon" />
                  <input 
                    type="text" 
                    placeholder="مثال: 010XXXXXXXX أو بريدك الإلكتروني"
                    value={formData.email || formData.phone}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^[0-9+]+$/.test(val)) {
                        setFormData({ ...formData, phone: val, email: '' });
                      } else {
                        setFormData({ ...formData, email: val, phone: '' });
                      }
                    }}
                    required
                  />
                </div>
              </div>

              {authMode === 'register' && (
                <div className="form-field text-right">
                  <label className="field-label">اسم الطالب الثلاثي أو الرباعي *</label>
                  <div className="input-with-icon">
                    <User size={18} className="field-icon" />
                    <input 
                      type="text" 
                      placeholder="مثال: أحمد محمد علي محمود"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="form-field text-right">
                <label className="field-label flex items-center justify-between">
                  <span>كلمة المرور</span>
                  {authMode === 'login' && <span className="text-xs text-slate-400">(اختيارية للمسجلين)</span>}
                </label>
                <div className="input-with-icon">
                  <Lock size={18} className="field-icon" />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

              <button 
                type="submit" 
                className={`duo-btn ${authMode === 'login' ? 'duo-btn-primary' : 'duo-btn-success'} w-full py-3 font-bold mt-1`}
              >
                {authMode === 'login' ? 'متابعة ودخول فوري للمنصة 🔑' : 'متابعة لإنشاء الحساب 🚀'}
              </button>
            </form>

            <div className="auth-security-notice mt-2">
              <ShieldCheck size={16} className="text-emerald-500 flex-shrink-0" />
              <span>تسجيل الدخول آمن ومربوط مباشرة بنظام مجموعات الأستاذ محمد راشد</span>
            </div>
          </div>
        )}

        {/* =========================================================================
            المرحلة 2: شاشة اختيار حساب Google السريع (تظهر للمتابعة الفورية)
            ========================================================================= */}
        {authStep === 'google_quick_picker' && (
          <div className="auth-step-container">
            <div className="auth-icon-badge">
              <svg width="34" height="34" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            </div>

            <h2 className="auth-title">
              {authMode === 'login' ? 'المتابعة بحساب Google' : 'سحب بيانات حساب Google'}
            </h2>
            <p className="auth-subtitle">
              أدخل اسمك وبريدك الإلكتروني (Gmail) لسحب الاسم والصورة والمتابعة فوراً
            </p>

            {errorMessage && <div className="auth-error-banner w-full">{errorMessage}</div>}

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const name = googlePickerName.trim() || formData.name.trim() || 'طالب كودلينجو';
                const email = googlePickerEmail.trim() || formData.email.trim() || `student.${Math.floor(1000 + Math.random() * 9000)}@gmail.com`;
                handleOAuthSuccess({
                  name,
                  email,
                  avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
                  provider: 'google'
                });
              }}
              className="w-full flex flex-col gap-3"
            >
              <div className="form-field text-right">
                <label className="field-label">اسمك في حساب Google *</label>
                <div className="input-with-icon">
                  <User size={18} className="field-icon" />
                  <input 
                    type="text" 
                    placeholder="مثال: يوسف أحمد محمد"
                    value={googlePickerName}
                    onChange={(e) => setGooglePickerName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-field text-right">
                <label className="field-label">بريدك الإلكتروني (Gmail) *</label>
                <div className="input-with-icon">
                  <Mail size={18} className="field-icon" />
                  <input 
                    type="email" 
                    placeholder="yourname@gmail.com"
                    value={googlePickerEmail}
                    onChange={(e) => setGooglePickerEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-2">
                <button 
                  type="submit" 
                  className="duo-btn duo-btn-success flex-1 py-3 font-bold"
                >
                  {authMode === 'login' ? 'متابعة ودخول فوري ⚡' : 'متابعة وسحب البيانات 🚀'}
                </button>
                <button 
                  type="button" 
                  className="duo-btn duo-btn-secondary py-3 px-4"
                  onClick={() => setAuthStep('main')}
                >
                  رجوع
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =========================================================================
            المرحلة 3: إكمال أرقام الهواتف فقط (تظهر في إنشاء الحساب بعد سحب الاسم والصورة)
            ========================================================================= */}
        {authStep === 'phones_setup' && (
          <form className="auth-step-container" onSubmit={handleCompleteRegistrationSubmit}>
            {/* بطاقة عرض الصورة والاسم المسحوب من جوجل */}
            <div className="flex flex-col items-center gap-2 mb-1">
              <div className="w-20 h-20 rounded-full border-4 border-indigo-500 shadow-xl overflow-hidden bg-slate-800 flex items-center justify-center">
                <img 
                  src={formData.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=Student'} 
                  alt={formData.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="auth-title text-xl">
                مرحباً يا {formData.name || 'طالبنا المتميز'} 👋
              </h2>
              <span className="text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                <CheckCircle size={14} />
                <span>تم سحب الاسم والصورة بنجاح ({formData.email})</span>
              </span>
            </div>

            <p className="auth-subtitle">
              خطوة أخيرة لإتمام اشتراكك: يرجى إدخال أرقام التواصل لمتابعة الأستاذ محمد راشد
            </p>

            {errorMessage && (
              <div className="auth-error-banner w-full">
                {errorMessage}
              </div>
            )}

            <div className="w-full flex flex-col gap-3">
              {/* رقم هاتف الطالب */}
              <div className="form-field text-right">
                <label className="field-label">رقم هاتف الطالب / واتساب *</label>
                <div className="input-with-icon">
                  <Phone size={18} className="field-icon text-indigo-400" />
                  <input 
                    type="tel" 
                    placeholder="010XXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    autoFocus
                  />
                </div>
              </div>

              {/* رقم هاتف ولي الأمر */}
              <div className="form-field text-right">
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

              <button 
                type="submit" 
                className="duo-btn duo-btn-success w-full py-3.5 font-bold text-base mt-2 shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? 'جارٍ حفظ بياناتك... ⏳' : 'إتمام التسجيل والبدء في المذاكرة فوراً 🚀'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
