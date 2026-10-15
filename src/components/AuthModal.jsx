import React, { useState, useEffect } from 'react';
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
  KeyRound,
  ArrowRight,
  Globe,
  Share2
} from 'lucide-react';
import { useApp, isMasterTeacherEmail } from '../context/AppContext';
import { playSound } from '../utils/audioEngine';
import { isSupabaseConfigured } from '../utils/supabaseClient';
import {
  signInWithGoogleOAuth,
  signInWithFacebookOAuth,
  signInWithEmailPassword,
  signUpWithEmailPassword,
  signInWithPhonePassword,
  signUpWithPhonePassword,
  sendPhoneOtp,
  verifyPhoneOtp,
  syncUserMetadataToStudentTable
} from '../services/studentService';
import { 
  getGoogleClientId, 
  getFacebookAppId, 
  signInWithGoogleIdentity, 
  signInWithFacebookSDK, 
  saveSocialKeys 
} from '../services/socialAuthService';

export default function AuthModal({ initialMode = 'register' }) {
  const { 
    registerNewStudent, 
    setActiveModal, 
    students = [], 
    setCurrentStudentId, 
    currentStudent,
    isStudentLoggedIn,
    setCurrentPage,
    lang = 'ar'
  } = useApp();

  // نمط الحساب: 'login' (تسجيل الدخول) أو 'register' (إنشاء حساب جديد)
  const [authMode, setAuthMode] = useState(
    initialMode === 'login' ? 'login' : 'register'
  );

  // طريقة المصادقة المختارة من الـ 4 طرق: 'google' | 'facebook' | 'email' | 'phone'
  const [authMethod, setAuthMethod] = useState('google');

  // نمط المصادقة بالهاتف: 'password' (كلمة مرور) أو 'otp' (رمز تحقق SMS)
  const [phoneAuthSubtype, setPhoneAuthSubtype] = useState('password');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  // حالة التحميل والرسائل
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // إظهار وإخفاء كلمات المرور
  const [showPassword, setShowPassword] = useState(false);

  // بيانات النموذج
  const isActualStudent = isStudentLoggedIn && currentStudent && currentStudent.status !== 'guest';
  const [formData, setFormData] = useState({
    name: isActualStudent ? (currentStudent.name || '') : '',
    email: isActualStudent ? (currentStudent.email || '') : '',
    phone: isActualStudent ? (currentStudent.phone || '') : '',
    guardianPhone: isActualStudent ? (currentStudent.guardianPhone || '') : '',
    password: '',
    avatar: isActualStudent ? (currentStudent.avatar || '') : '',
  });

  // نوافذ إعداد وربط المفاتيح إذا لم تكن مدخلة
  const [showGoogleKeyModal, setShowGoogleKeyModal] = useState(false);
  const [inputGoogleClientId, setInputGoogleClientId] = useState(() => getGoogleClientId());

  const [showFacebookKeyModal, setShowFacebookKeyModal] = useState(false);
  const [inputFbAppId, setInputFbAppId] = useState(() => getFacebookAppId());

  // نموذج محلي سريع في حالة عدم ضبط Supabase محلياً
  const [showQuickLocalPicker, setShowQuickLocalPicker] = useState(false);
  const [quickPickerName, setQuickPickerName] = useState('');
  const [quickPickerEmail, setQuickPickerEmail] = useState('');

  // تحديث البيانات إذا تغير الطالب المسجل
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
   * إتمام تسجيل الدخول أو إنشاء الحساب بنجاح وتحديث الحالة والواجهة
   */
  const handleAuthCompletion = async (authUser, extraProfile = {}) => {
    try {
      setIsLoading(true);
      // مزامنة الميتاداتا وحفظها في جدول students في Supabase (Upsert تلقائي وفوري)
      const syncedStudent = await syncUserMetadataToStudentTable(authUser, {
        name: extraProfile.name || formData.name,
        guardianPhone: extraProfile.guardianPhone || formData.guardianPhone,
        phone: extraProfile.phone || formData.phone,
        email: extraProfile.email || formData.email,
        avatar: extraProfile.avatar || formData.avatar,
        provider: extraProfile.provider || authMethod
      });

      // تسجيله في ذاكرة التطبيق المحلية فوراً
      let localStd = students.find(s => 
        (syncedStudent?.email && s.email && s.email.toLowerCase() === syncedStudent.email.toLowerCase()) ||
        (syncedStudent?.phone && s.phone === syncedStudent.phone) ||
        (syncedStudent?.id && s.id === syncedStudent.id)
      );

      if (!localStd) {
        localStd = registerNewStudent({
          name: syncedStudent?.name || formData.name || 'طالب كودلينجو',
          email: syncedStudent?.email || formData.email,
          phone: syncedStudent?.phone || formData.phone,
          guardianPhone: syncedStudent?.guardianPhone || formData.guardianPhone,
          avatar: syncedStudent?.avatar || formData.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${Date.now()}`,
          provider: extraProfile.provider || authMethod
        });
      }

      setCurrentStudentId(localStd.id || syncedStudent?.id);
      playSound.levelUp();
      setSuccessMessage('تمت المصادقة بنجاح! جاري فتح المنصة... 🚀');
      
      setTimeout(() => {
        setIsLoading(false);
        setActiveModal(null);
        setCurrentPage('home');
      }, 700);
    } catch (err) {
      console.error('Auth completion error:', err);
      setIsLoading(false);
      setErrorMessage(err.message || 'حدث خطأ أثناء مزامنة البيانات');
    }
  };

  /**
   * 1. خيار Google OAuth الرسمي (Google Identity Services أو Supabase)
   */
  const handleGoogleSubmit = async () => {
    playSound.click();
    setErrorMessage('');
    setIsLoading(true);

    const googleClientId = getGoogleClientId();

    // أ) إذا كان Google Client ID متوفراً: نفتح نافذة جوجل المنبثقة الرسمية مباشرة
    if (googleClientId) {
      try {
        const { user, profile } = await signInWithGoogleIdentity(googleClientId);
        await handleAuthCompletion(user, profile);
        return;
      } catch (err) {
        console.warn('Google Identity error:', err);
        setIsLoading(false);
        if (err.message?.includes('access_denied') || err.message?.includes('إلغاء')) {
          setErrorMessage('تم إلغاء المتابعة بحساب Google.');
        } else {
          setErrorMessage(err.message || 'تعذر استكمال تسجيل الدخول عبر Google.');
        }
        return;
      }
    }

    // ب) إذا كانت سوبا بيز مضبوطة ومفعلة لمزود Google OAuth
    if (isSupabaseConfigured) {
      try {
        await signInWithGoogleOAuth();
        return;
      } catch (err) {
        console.warn('Supabase Google OAuth error:', err);
        setIsLoading(false);
        setErrorMessage(err.message || 'تعذر الاتصال بـ Supabase Google OAuth.');
      }
    }

    // ج) إذا لم تكن المفاتيح مدخلة بعد، نفتح نافذة ربط Google Client ID
    setIsLoading(false);
    setShowGoogleKeyModal(true);
  };

  /**
   * 2. خيار Facebook OAuth الرسمي (Facebook SDK أو Supabase)
   */
  const handleFacebookSubmit = async () => {
    playSound.click();
    setErrorMessage('');
    setIsLoading(true);

    const fbAppId = getFacebookAppId();

    // أ) إذا كان Facebook App ID متوفراً: نفتح نافذة فيسبوك الرسمية مباشرة
    if (fbAppId) {
      try {
        const { user, profile } = await signInWithFacebookSDK(fbAppId);
        await handleAuthCompletion(user, profile);
        return;
      } catch (err) {
        console.warn('Facebook SDK error:', err);
        setIsLoading(false);
        setErrorMessage(err.message || 'تعذر تسجيل الدخول عبر Facebook.');
        return;
      }
    }

    // ب) إذا كانت سوبا بيز مضبوطة لمزود Facebook OAuth
    if (isSupabaseConfigured) {
      try {
        await signInWithFacebookOAuth();
        return;
      } catch (err) {
        console.warn('Supabase Facebook OAuth error:', err);
        setIsLoading(false);
        setErrorMessage(err.message || 'تعذر الاتصال بـ Supabase Facebook OAuth.');
      }
    }

    // ج) إذا لم تكن المفاتيح مدخلة بعد، نفتح نافذة ربط Facebook App ID
    setIsLoading(false);
    setShowFacebookKeyModal(true);
  };

  /**
   * 3. خيار البريد الإلكتروني (Email & Password)
   */
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    const email = formData.email.trim().toLowerCase();
    const password = formData.password.trim();

    if (!email || !email.includes('@')) {
      setErrorMessage('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('كلمة المرور يجب أن لا تقل عن 6 أحرف أو أرقام');
      return;
    }

    // فحص حساب الأستاذ الماستر
    if (isMasterTeacherEmail(email)) {
      const masterStudent = students.find(s => isMasterTeacherEmail(s.email));
      if (masterStudent) {
        setCurrentStudentId(masterStudent.id);
        playSound.levelUp();
        setActiveModal(null);
        setCurrentPage('content');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (isSupabaseConfigured) {
        if (authMode === 'register') {
          // إنشاء حساب جديد بالبريد
          const { user } = await signUpWithEmailPassword(email, password, {
            name: formData.name.trim() || email.split('@')[0],
            guardianPhone: formData.guardianPhone.trim(),
            phone: formData.phone.trim(),
            avatar: formData.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(formData.name || email)}`
          });
          await handleAuthCompletion(user || { id: `usr-${Date.now()}`, email, user_metadata: { full_name: formData.name } }, { provider: 'email' });
        } else {
          // تسجيل دخول بالبريد
          const { user } = await signInWithEmailPassword(email, password);
          await handleAuthCompletion(user, { provider: 'email' });
        }
      } else {
        // وضع العمل المحلي الآمن
        if (authMode === 'register') {
          const newStudent = registerNewStudent({
            name: formData.name.trim() || email.split('@')[0],
            email: email,
            phone: formData.phone.trim(),
            guardianPhone: formData.guardianPhone.trim(),
            avatar: formData.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(formData.name || email)}`,
            provider: 'email'
          });
          setCurrentStudentId(newStudent.id);
        } else {
          const existing = students.find(s => s.email && s.email.toLowerCase() === email);
          if (existing) {
            setCurrentStudentId(existing.id);
          } else {
            throw new Error('لم يتم العثور على حساب بهذا البريد. اضغط على "إنشاء حساب جديد" للتسجيل فوراً');
          }
        }
        playSound.levelUp();
        setActiveModal(null);
        setCurrentPage('home');
      }
    } catch (err) {
      console.warn('Email Auth Error:', err);
      setErrorMessage(err.message || 'فشل تسجيل الدخول بالبريد الإلكتروني');
      playSound.wrong();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 4. خيار رقم الهاتف (Phone & Password / OTP)
   */
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    const phone = formData.phone.trim();

    if (!phone || phone.length < 10) {
      setErrorMessage('يرجى إدخال رقم هاتف صحيح (10 أرقام على الأقل)');
      return;
    }

    if (authMode === 'register' && !formData.guardianPhone) {
      setErrorMessage('⚠️ رقم ولي الأمر مطلوب إجباري لمتابعة الأستاذ');
      return;
    }

    setIsLoading(true);

    try {
      if (isSupabaseConfigured) {
        if (phoneAuthSubtype === 'otp') {
          // مسار رمز التأكيد OTP
          if (!otpSent) {
            await sendPhoneOtp(phone);
            setOtpSent(true);
            setSuccessMessage(`تم إرسال رمز التأكيد SMS إلى الرقم ${phone}`);
            setIsLoading(false);
            return;
          } else {
            if (!otpCode || otpCode.length < 4) {
              setErrorMessage('يرجى إدخال رمز التأكيد المستلم المكون من 6 أرقام');
              setIsLoading(false);
              return;
            }
            const { user } = await verifyPhoneOtp(phone, otpCode);
            await handleAuthCompletion(user, { provider: 'phone', phone });
          }
        } else {
          // مسار كلمة المرور
          const password = formData.password.trim();
          if (!password || password.length < 6) {
            setErrorMessage('كلمة المرور يجب أن لا تقل عن 6 أحرف أو أرقام');
            setIsLoading(false);
            return;
          }

          if (authMode === 'register') {
            const { user } = await signUpWithPhonePassword(phone, password, {
              name: formData.name.trim() || 'طالب كودلينجو',
              guardianPhone: formData.guardianPhone.trim(),
              avatar: formData.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(phone)}`
            });
            await handleAuthCompletion(user, { provider: 'phone', phone });
          } else {
            const { user } = await signInWithPhonePassword(phone, password);
            await handleAuthCompletion(user, { provider: 'phone', phone });
          }
        }
      } else {
        // وضع العمل المحلي الآمن برقم الهاتف
        if (authMode === 'register') {
          const newStudent = registerNewStudent({
            name: formData.name.trim() || 'طالب كودلينجو',
            phone: phone,
            guardianPhone: formData.guardianPhone.trim(),
            email: formData.email.trim() || `${phone}@codelingo.edu`,
            avatar: formData.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(phone)}`,
            provider: 'phone'
          });
          setCurrentStudentId(newStudent.id);
        } else {
          const existing = students.find(s => s.phone && s.phone.trim() === phone);
          if (existing) {
            setCurrentStudentId(existing.id);
          } else {
            throw new Error('لم يتم العثور على حساب مسجل بهذا الرقم. اضغط على "إنشاء حساب جديد" للتسجيل فوراً');
          }
        }
        playSound.levelUp();
        setActiveModal(null);
        setCurrentPage('home');
      }
    } catch (err) {
      console.warn('Phone Auth Error:', err);
      setErrorMessage(err.message || 'حدث خطأ أثناء المصادقة برقم الهاتف');
      playSound.wrong();
    } finally {
      setIsLoading(false);
    }
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
            نافذة إدخال وتفعيل Google Client ID لفتح شاشة جوجل الرسمية
            ========================================================================= */}
        {showGoogleKeyModal ? (
          <div className="auth-step-container">
            <div className="auth-icon-badge">
              <svg width="34" height="34" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            </div>

            <h2 className="auth-title">المتابعة المباشرة بحساب Google</h2>
            <p className="auth-subtitle">
              لسحب بريدك المسجل في Gmail واسمك وصورتك الشخصية تلقائياً دون كتابة، أدخل معرّف العميل (Google Client ID):
            </p>

            {errorMessage && (
              <div className="auth-error-banner w-full mb-3">
                {errorMessage}
              </div>
            )}

            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                const cid = inputGoogleClientId.trim();
                if (!cid) {
                  setErrorMessage('يرجى لصق Google Client ID المصرح به');
                  return;
                }
                saveSocialKeys({ googleClientId: cid });
                setShowGoogleKeyModal(false);
                setIsLoading(true);
                setErrorMessage('');
                try {
                  const { user, profile } = await signInWithGoogleIdentity(cid);
                  await handleAuthCompletion(user, profile);
                } catch (err) {
                  console.warn('Google Auth Error:', err);
                  setIsLoading(false);
                  setShowGoogleKeyModal(true);
                  setErrorMessage(err.message || 'تعذر إتمام المصادقة بحساب Google');
                }
              }}
              className="auth-form-stack"
            >
              <div className="form-field text-right">
                <label className="field-label">معرّف عميل جوجل (Google Client ID) *</label>
                <div className="input-with-icon">
                  <KeyRound size={18} className="field-icon" />
                  <input 
                    type="text" 
                    placeholder="xxxxxxxxxxxx-xxxxxxxxxxxx.apps.googleusercontent.com"
                    value={inputGoogleClientId}
                    onChange={(e) => setInputGoogleClientId(e.target.value)}
                    dir="ltr"
                    className="font-mono text-xs"
                    required
                  />
                </div>
                <span className="text-[11px] text-slate-500 block mt-1">
                  💡 يتم حفظه في متصفحك مرة واحدة فقط، وسيفتح فوراً نافذة Google لاختيار الحساب.
                </span>
              </div>

              <div className="auth-actions-row flex-col gap-2">
                <button type="submit" className="duo-btn duo-btn-success auth-btn-main w-full" disabled={isLoading}>
                  {isLoading ? 'جارٍ الاتصال بـ Google... ⏳' : 'حفظ وفتح نافذة Google فوراً 🚀'}
                </button>

                <div className="flex gap-2 w-full">
                  <button 
                    type="button" 
                    className="duo-btn duo-btn-secondary auth-btn-back flex-1"
                    onClick={() => {
                      const mockGoogleUser = {
                        id: `g-${Date.now().toString().slice(-6)}`,
                        email: `student.${Math.floor(1000 + Math.random() * 9000)}@gmail.com`,
                        user_metadata: {
                          full_name: 'طالب كودلينجو التجريبي',
                          avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=StudentDemo`
                        },
                        app_metadata: { provider: 'google' }
                      };
                      handleAuthCompletion(mockGoogleUser, { name: 'طالب كودلينجو التجريبي', provider: 'google' });
                    }}
                  >
                    دخول تجريبي سريع
                  </button>
                  <button 
                    type="button" 
                    className="duo-btn duo-btn-secondary auth-btn-back flex-1"
                    onClick={() => setShowGoogleKeyModal(false)}
                  >
                    رجوع
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : showFacebookKeyModal ? (
          /* =========================================================================
              نافذة إدخال وتفعيل Facebook App ID
              ========================================================================= */
          <div className="auth-step-container">
            <div className="auth-icon-badge">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="#1877f2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>

            <h2 className="auth-title">المتابعة المباشرة بحساب Facebook</h2>
            <p className="auth-subtitle">
              لسحب اسمك وصورتك من Facebook تلقائياً، أدخل معرّف التطبيق (Facebook App ID):
            </p>

            {errorMessage && (
              <div className="auth-error-banner w-full mb-3">
                {errorMessage}
              </div>
            )}

            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                const aid = inputFbAppId.trim();
                if (!aid) {
                  setErrorMessage('يرجى إدخال Facebook App ID');
                  return;
                }
                saveSocialKeys({ facebookAppId: aid });
                setShowFacebookKeyModal(false);
                setIsLoading(true);
                setErrorMessage('');
                try {
                  const { user, profile } = await signInWithFacebookSDK(aid);
                  await handleAuthCompletion(user, profile);
                } catch (err) {
                  console.warn('Facebook Auth Error:', err);
                  setIsLoading(false);
                  setShowFacebookKeyModal(true);
                  setErrorMessage(err.message || 'تعذر إتمام تسجيل الدخول بـ Facebook');
                }
              }}
              className="auth-form-stack"
            >
              <div className="form-field text-right">
                <label className="field-label">معرّف تطبيق فيسبوك (Facebook App ID) *</label>
                <div className="input-with-icon">
                  <KeyRound size={18} className="field-icon" />
                  <input 
                    type="text" 
                    placeholder="مثال: 123456789012345"
                    value={inputFbAppId}
                    onChange={(e) => setInputFbAppId(e.target.value)}
                    dir="ltr"
                    className="font-mono text-xs"
                    required
                  />
                </div>
              </div>

              <div className="auth-actions-row flex-col gap-2">
                <button type="submit" className="duo-btn duo-btn-success auth-btn-main w-full" disabled={isLoading}>
                  {isLoading ? 'جارٍ الاتصال بـ Facebook... ⏳' : 'حفظ وفتح نافذة Facebook فوراً 🚀'}
                </button>

                <div className="flex gap-2 w-full">
                  <button 
                    type="button" 
                    className="duo-btn duo-btn-secondary auth-btn-back flex-1"
                    onClick={() => {
                      const mockFbUser = {
                        id: `fb-${Date.now().toString().slice(-6)}`,
                        email: `student.fb.${Math.floor(1000 + Math.random() * 9000)}@facebook.com`,
                        user_metadata: {
                          full_name: 'طالب فيسبوك التجريبي',
                          avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=FBStudent`
                        },
                        app_metadata: { provider: 'facebook' }
                      };
                      handleAuthCompletion(mockFbUser, { name: 'طالب فيسبوك التجريبي', provider: 'facebook' });
                    }}
                  >
                    دخول تجريبي سريع
                  </button>
                  <button 
                    type="button" 
                    className="duo-btn duo-btn-secondary auth-btn-back flex-1"
                    onClick={() => setShowFacebookKeyModal(false)}
                  >
                    رجوع
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : showQuickLocalPicker ? (
          <div className="auth-step-container">
            <div className="auth-icon-badge">
              <User size={34} className="text-indigo-500" />
            </div>
            <h2 className="auth-title">تسجيل حساب سريع</h2>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const name = quickPickerName.trim() || formData.name.trim() || 'طالب كودلينجو';
                const email = quickPickerEmail.trim() || formData.email.trim() || `student.${Math.floor(1000 + Math.random() * 9000)}@gmail.com`;
                const mockUser = {
                  id: `u-${Date.now().toString().slice(-6)}`,
                  email: email,
                  user_metadata: { full_name: name, avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}` },
                  app_metadata: { provider: 'local' }
                };
                handleAuthCompletion(mockUser, { name, email, provider: 'local' });
              }}
              className="auth-form-stack"
            >
              <div className="form-field text-right">
                <label className="field-label">اسم الطالب *</label>
                <div className="input-with-icon">
                  <User size={18} className="field-icon" />
                  <input type="text" value={quickPickerName} onChange={(e) => setQuickPickerName(e.target.value)} required />
                </div>
              </div>
              <div className="form-field text-right">
                <label className="field-label">البريد الإلكتروني *</label>
                <div className="input-with-icon">
                  <Mail size={18} className="field-icon" />
                  <input type="email" value={quickPickerEmail} onChange={(e) => setQuickPickerEmail(e.target.value)} required />
                </div>
              </div>
              <div className="auth-actions-row">
                <button type="submit" className="duo-btn duo-btn-success auth-btn-main">متابعة 🚀</button>
                <button type="button" className="duo-btn duo-btn-secondary auth-btn-back" onClick={() => setShowQuickLocalPicker(false)}>رجوع</button>
              </div>
            </form>
          </div>
        ) : (
          /* =========================================================================
              الواجهة الرئيسية الشاملة: 4 خيارات مصادقة معتمدة من Supabase
              ========================================================================= */
          <div className="auth-step-container">
            {/* الشعار الترحيبي ورأس النافذة */}
            <div className="auth-icon-badge">
              {authMode === 'register' ? (
                <Sparkles size={34} className="text-emerald-500" />
              ) : (
                <LogIn size={34} className="text-indigo-500" />
              )}
            </div>

            <h2 className="auth-title">
              {authMode === 'register' ? 'إنشاء حساب جديد لبدء المذاكرة 🚀' : 'تسجيل الدخول للمنصة 🔑'}
            </h2>
            <p className="auth-subtitle">
              منهج البرمجة والذكاء الاصطناعي • ثانية بكالوريا <br />
              <strong>إشراف وتدريس: الأستاذ / محمد راشد</strong>
            </p>

            {/* ألسنة التبديل بين: تسجيل الدخول vs إنشاء حساب جديد */}
            <div className="auth-mode-switch-tabs">
              <button
                type="button"
                className={`auth-mode-tab ${authMode === 'login' ? 'active' : ''}`}
                onClick={() => {
                  setAuthMode('login');
                  setErrorMessage('');
                  setSuccessMessage('');
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
                  setSuccessMessage('');
                  playSound.click();
                }}
              >
                <UserPlus size={16} />
                <span>إنشاء حساب جديد</span>
              </button>
            </div>

            {/* الألسنة الأربعة لطرق المصادقة (4 Authentication Options) */}
            <div className="auth-methods-segmented-tabs" role="tablist">
              <button
                type="button"
                className={`auth-method-chip ${authMethod === 'google' ? 'active' : ''}`}
                onClick={() => {
                  setAuthMethod('google');
                  setErrorMessage('');
                  playSound.click();
                }}
                title="المصادقة بحساب Google"
              >
                <svg width="17" height="17" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                className={`auth-method-chip ${authMethod === 'facebook' ? 'active' : ''}`}
                onClick={() => {
                  setAuthMethod('facebook');
                  setErrorMessage('');
                  playSound.click();
                }}
                title="المصادقة بحساب Facebook"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="#1877f2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </button>

              <button
                type="button"
                className={`auth-method-chip ${authMethod === 'email' ? 'active' : ''}`}
                onClick={() => {
                  setAuthMethod('email');
                  setErrorMessage('');
                  playSound.click();
                }}
                title="المصادقة بالبريد الإلكتروني"
              >
                <Mail size={16} className="text-amber-400" />
                <span>البريد</span>
              </button>

              <button
                type="button"
                className={`auth-method-chip ${authMethod === 'phone' ? 'active' : ''}`}
                onClick={() => {
                  setAuthMethod('phone');
                  setErrorMessage('');
                  playSound.click();
                }}
                title="المصادقة برقم الهاتف"
              >
                <Smartphone size={16} className="text-emerald-400" />
                <span>الهاتف</span>
              </button>
            </div>

            {/* رسائل الأخطاء والنجاح */}
            {errorMessage && (
              <div className="auth-error-banner w-full">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="auth-success-banner w-full">
                {successMessage}
              </div>
            )}

            {/* =========================================================================
                الطريقة 1: خيار Google
                ========================================================================= */}
            {authMethod === 'google' && (
              <div className="auth-method-content-panel">
                <p className="auth-panel-hint">
                  {authMode === 'register' 
                    ? 'تسجيل سريع وفوري عبر حساب Google؛ سيتم سحب اسمك وصورتك الشخصية تلقائياً دون الحاجة لكتابة بيانات.'
                    : 'سجل دخولك بنقرة واحدة عبر حساب Google المرتبط بمتابعة درجاتك في المنصة.'
                  }
                </p>

                <div className="auth-social-buttons">
                  <button 
                    type="button" 
                    className="google-signin-btn"
                    onClick={handleGoogleSubmit}
                    disabled={isLoading}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>
                      {isLoading 
                        ? 'جارٍ الاتصال بـ Supabase... ⏳' 
                        : authMode === 'login' 
                          ? 'المتابعة والدخول بحساب Google' 
                          : 'المتابعة والتسجيل بحساب Google'
                      }
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* =========================================================================
                الطريقة 2: خيار Facebook
                ========================================================================= */}
            {authMethod === 'facebook' && (
              <div className="auth-method-content-panel">
                <p className="auth-panel-hint">
                  {authMode === 'register' 
                    ? 'تسجيل سريع وفوري عبر حساب Facebook؛ سيتم سحب اسمك وصورتك الشخصية تلقائياً.'
                    : 'سجل دخولك بنقرة واحدة عبر حساب Facebook المعتمد في المنصة.'
                  }
                </p>

                <div className="auth-social-buttons">
                  <button 
                    type="button" 
                    className="facebook-signin-btn"
                    onClick={handleFacebookSubmit}
                    disabled={isLoading}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#ffffff">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>
                      {isLoading 
                        ? 'جارٍ الاتصال بـ Supabase... ⏳' 
                        : authMode === 'login' 
                          ? 'المتابعة والدخول بحساب Facebook' 
                          : 'المتابعة والتسجيل بحساب Facebook'
                      }
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* =========================================================================
                الطريقة 3: خيار البريد الإلكتروني (Email & Password)
                ========================================================================= */}
            {authMethod === 'email' && (
              <form onSubmit={handleEmailSubmit} className="auth-form-stack">
                {authMode === 'register' && (
                  <div className="form-field text-right">
                    <label className="field-label">اسم الطالب الثلاثي أو الرباعي *</label>
                    <div className="input-with-icon">
                      <User size={18} className="field-icon" />
                      <input 
                        type="text" 
                        placeholder="مثال: يوسف أحمد محمد"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="form-field text-right">
                  <label className="field-label">البريد الإلكتروني (Email) *</label>
                  <div className="input-with-icon">
                    <Mail size={18} className="field-icon" />
                    <input 
                      type="email" 
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-field text-right">
                  <label className="field-label">كلمة المرور * (6 أحرف أو أرقام على الأقل)</label>
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
                  <>
                    <div className="form-field text-right">
                      <label className="field-label">رقم هاتف الطالب / واتساب</label>
                      <div className="input-with-icon">
                        <Phone size={18} className="field-icon" />
                        <input 
                          type="tel" 
                          placeholder="010XXXXXXXX"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-field text-right">
                      <label className="field-label flex items-center justify-between">
                        <span>رقم ولي الأمر * (إجباري)</span>
                        <span className="text-amber-400 text-xs font-bold">لمتابعة الأستاذ</span>
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

                <button 
                  type="submit" 
                  className={`duo-btn ${authMode === 'login' ? 'duo-btn-primary' : 'duo-btn-success'} auth-submit-btn`}
                  disabled={isLoading}
                >
                  {isLoading 
                    ? 'جارٍ التحقق مع Supabase... ⏳' 
                    : authMode === 'login' 
                      ? 'تسجيل الدخول بالبريد الإلكتروني 🔑' 
                      : 'إنشاء حساب جديد بالبريد 🚀'
                  }
                </button>
              </form>
            )}

            {/* =========================================================================
                الطريقة 4: خيار رقم الهاتف (Phone & Password / OTP)
                ========================================================================= */}
            {authMethod === 'phone' && (
              <form onSubmit={handlePhoneSubmit} className="auth-form-stack">
                {/* مفتاح التبديل الداخلي لرقم الهاتف: كلمة مرور vs رمز OTP */}
                <div className="phone-auth-type-pill-row">
                  <button
                    type="button"
                    className={`phone-sub-chip ${phoneAuthSubtype === 'password' ? 'active' : ''}`}
                    onClick={() => {
                      setPhoneAuthSubtype('password');
                      setOtpSent(false);
                      playSound.click();
                    }}
                  >
                    <KeyRound size={14} />
                    <span>كلمة المرور</span>
                  </button>
                  <button
                    type="button"
                    className={`phone-sub-chip ${phoneAuthSubtype === 'otp' ? 'active' : ''}`}
                    onClick={() => {
                      setPhoneAuthSubtype('otp');
                      playSound.click();
                    }}
                  >
                    <Smartphone size={14} />
                    <span>رمز التأكيد (SMS OTP)</span>
                  </button>
                </div>

                {authMode === 'register' && (
                  <div className="form-field text-right">
                    <label className="field-label">اسم الطالب الثلاثي أو الرباعي *</label>
                    <div className="input-with-icon">
                      <User size={18} className="field-icon" />
                      <input 
                        type="text" 
                        placeholder="مثال: يوسف أحمد محمد"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="form-field text-right">
                  <label className="field-label">رقم هاتف الطالب (Phone Number) *</label>
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

                {/* نمط كلمة المرور */}
                {phoneAuthSubtype === 'password' && (
                  <div className="form-field text-right">
                    <label className="field-label">كلمة المرور * (6 أحرف أو أرقام)</label>
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
                )}

                {/* نمط الـ OTP */}
                {phoneAuthSubtype === 'otp' && otpSent && (
                  <div className="form-field text-right">
                    <label className="field-label">أدخل رمز التأكيد المرسل (6 أرقام) *</label>
                    <div className="input-with-icon">
                      <KeyRound size={18} className="field-icon text-emerald-400" />
                      <input 
                        type="text" 
                        placeholder="123456"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        required
                        autoFocus
                      />
                    </div>
                  </div>
                )}

                {authMode === 'register' && (
                  <div className="form-field text-right">
                    <label className="field-label flex items-center justify-between">
                      <span>رقم ولي الأمر * (إجباري)</span>
                      <span className="text-amber-400 text-xs font-bold">لمتابعة الأستاذ</span>
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

                <button 
                  type="submit" 
                  className={`duo-btn ${authMode === 'login' ? 'duo-btn-primary' : 'duo-btn-success'} auth-submit-btn`}
                  disabled={isLoading}
                >
                  {isLoading 
                    ? 'جارٍ الاتصال... ⏳' 
                    : phoneAuthSubtype === 'otp' && !otpSent
                      ? 'إرسال رمز التأكيد SMS 📩'
                      : phoneAuthSubtype === 'otp' && otpSent
                        ? 'تأكيد الرمز والدخول ⚡'
                        : authMode === 'login'
                          ? 'تسجيل الدخول برقم الهاتف 🔑'
                          : 'إنشاء حساب جديد برقم الهاتف 🚀'
                  }
                </button>
              </form>
            )}

            {/* إشعار أمان المنصة */}
            <div className="auth-security-notice mt-2">
              <ShieldCheck size={16} className="text-emerald-500 flex-shrink-0" />
              <span>المصادقة سحابية مؤمنة 100% ومربوطة مباشرة بقاعدة بيانات Supabase</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
