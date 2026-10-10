import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  X, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  LogIn,
  Check
} from 'lucide-react';
import { playSound } from '../utils/audioEngine';

// مفتاح التشفير السري لتشفير كلمة المرور محلياً
const ENCRYPT_KEY = 'CodeLingo_Secure_Master_Key_2026_@#$';

// دالة تشفير كلمة المرور لحفظها محلياً مشفرة
const encryptSecret = (text) => {
  if (!text) return '';
  try {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ ENCRYPT_KEY.charCodeAt(i % ENCRYPT_KEY.length);
      result += String.fromCharCode(charCode);
    }
    return btoa(encodeURIComponent(result));
  } catch (e) {
    try {
      return btoa(unescape(encodeURIComponent(text)));
    } catch {
      return text;
    }
  }
};

// دالة فك التشفير لكلمة المرور المحفوظة
const decryptSecret = (cipher) => {
  if (!cipher) return '';
  try {
    const raw = decodeURIComponent(atob(cipher));
    let result = '';
    for (let i = 0; i < raw.length; i++) {
      const charCode = raw.charCodeAt(i) ^ ENCRYPT_KEY.charCodeAt(i % ENCRYPT_KEY.length);
      result += String.fromCharCode(charCode);
    }
    return result;
  } catch (e) {
    try {
      return decodeURIComponent(escape(atob(cipher)));
    } catch {
      return '';
    }
  }
};

export default function TeacherLoginModal() {
  const { 
    setActiveModal, 
    loginAdmin, 
    lang 
  } = useApp();

  const [rememberMe, setRememberMe] = useState(() => {
    return (localStorage.getItem('codelingo_admin_remember_me') || localStorage.getItem('agy_admin_remember_me')) !== 'false';
  });

  const [email, setEmail] = useState(() => {
    return localStorage.getItem('codelingo_remembered_admin_email') || localStorage.getItem('agy_remembered_admin_email') || '';
  });

  const [password, setPassword] = useState(() => {
    const savedCipher = localStorage.getItem('codelingo_remembered_admin_pass') || localStorage.getItem('agy_remembered_admin_pass');
    if (savedCipher) {
      return decryptSecret(savedCipher);
    }
    return '';
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [adminName, setAdminName] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError(lang === 'en' ? 'Please enter both email and password' : 'يرجى إدخال البريد الإلكتروني وكلمة المرور');
      playSound.wrong();
      return;
    }

    const res = loginAdmin(email, password);
    if (!res.success) {
      setError(res.error || (lang === 'en' ? 'Invalid credentials' : 'البريد الإلكتروني أو كلمة المرور غير صحيحة!'));
      playSound.wrong();
      return;
    }

    if (rememberMe) {
      localStorage.setItem('codelingo_admin_remember_me', 'true');
      localStorage.setItem('codelingo_remembered_admin_email', email.trim());
      localStorage.setItem('codelingo_remembered_admin_pass', encryptSecret(password.trim()));
    } else {
      localStorage.setItem('codelingo_admin_remember_me', 'false');
      localStorage.removeItem('codelingo_remembered_admin_email');
      localStorage.removeItem('codelingo_remembered_admin_pass');
      localStorage.removeItem('agy_remembered_admin_email');
      localStorage.removeItem('agy_remembered_admin_pass');
    }

    playSound.correct();
    setAdminName(res.admin?.name || (lang === 'en' ? 'Admin' : 'الأدمن'));
    setIsSuccess(true);

    setTimeout(() => {
      setActiveModal(null);
      playSound.levelUp();
    }, 600);
  };

  const handleClose = () => {
    playSound.click();
    setActiveModal(null);
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div 
        className="modal-card teacher-login-modal-card" 
        onClick={e => e.stopPropagation()}
      >
        {/* زر الإغلاق */}
        <button 
          className="quiz-close-btn" 
          onClick={handleClose}
          title={lang === 'en' ? 'Close' : 'إغلاق'}
        >
          <X size={20} />
        </button>

        {/* رأس النافذة العام دون أسماء مسبقة */}
        <div className="teacher-login-header">
          <div className="teacher-shield-icon-wrap">
            <ShieldCheck size={36} className="text-emerald-400" />
            <div className="shield-sparkle">
              <Sparkles size={16} className="text-amber-400" />
            </div>
          </div>
          <span className="teacher-portal-tag">
            {lang === 'en' ? 'Admin & Management Portal' : 'بوابة لوحة تحكم الإدارة'}
          </span>
          <h2 className="teacher-login-title">
            {lang === 'en' ? 'Admin & Staff Login' : 'تسجيل دخول الأدمن والمشرفين'}
          </h2>
          <p className="teacher-login-subtitle">
            {lang === 'en' 
              ? 'Enter authorized email and password to access the platform management dashboard.'
              : 'أدخل البريد الإلكتروني وكلمة المرور المعتمدة للوصول إلى لوحة إدارة المنصة والطلاب.'
            }
          </p>
        </div>

        {/* رسائل التنبيه والنجاح */}
        {error && (
          <div className="admin-login-error-alert">
            <AlertCircle size={18} className="text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isSuccess && (
          <div className="teacher-login-alert alert-success">
            <CheckCircle2 size={18} />
            <span>
              {lang === 'en' 
                ? `Welcome back, ${adminName}! Opening dashboard...` 
                : `أهلاً بك يا ${adminName}! جاري فتح لوحة التحكم...`
              }
            </span>
          </div>
        )}

        {/* نموذج تسجيل الدخول الحقيقي */}
        <form onSubmit={handleLogin} className="teacher-login-form">
          <div className="admin-input-group">
            <label className="admin-input-label">
              <Mail size={15} className="text-indigo-400" />
              <span>{lang === 'en' ? 'Admin Email' : 'البريد الإلكتروني للأدمن'}</span>
            </label>
            <div className="admin-input-wrapper">
              <input 
                type="email" 
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder={lang === 'en' ? 'admin@example.com' : 'ادخل البريد الإلكتروني المعتمد...'}
                className="admin-form-input font-mono"
                required
                autoComplete="email"
                dir="ltr"
              />
            </div>
          </div>

          <div className="admin-input-group">
            <label className="admin-input-label">
              <Lock size={15} className="text-emerald-400" />
              <span>{lang === 'en' ? 'Password / Security Code' : 'كلمة المرور / الرمز السري'}</span>
            </label>
            <div className="admin-input-wrapper">
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder={lang === 'en' ? 'Enter password...' : 'أدخل كلمة المرور...'}
                className="admin-form-input admin-form-input-has-toggle font-mono"
                required
                autoComplete="current-password"
                dir="ltr"
              />
              <button 
                type="button"
                className="admin-password-toggle-btn"
                onClick={() => setShowPassword(prev => !prev)}
                title={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* شيك بوكس تذكر الايميل والباسورد */}
          <label 
            className="teacher-remember-checkbox-label"
            onClick={() => setRememberMe(prev => !prev)}
          >
            <div className={`teacher-custom-checkbox-box ${rememberMe ? 'is-checked' : ''}`}>
              {rememberMe && <Check size={14} className="text-white" />}
            </div>
            <div className="teacher-checkbox-texts">
              <span className="teacher-checkbox-title">
                {lang === 'en' 
                  ? 'Remember email & password' 
                  : 'تذكر الايميل والباسورد'
                }
              </span>
            </div>
          </label>

          {/* زر تسجيل الدخول */}
          <button 
            type="submit" 
            className="duo-btn duo-btn-primary teacher-submit-btn w-full py-3.5 text-base flex items-center justify-center gap-2 mt-3"
          >
            <LogIn size={18} />
            <span className="font-bold">
              {lang === 'en' ? 'Sign In to Dashboard' : 'تسجيل الدخول إلى لوحة التحكم'}
            </span>
            {lang === 'ar' ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
}
