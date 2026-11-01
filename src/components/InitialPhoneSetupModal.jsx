import React, { useState, useRef } from 'react';
import './InitialPhoneSetupModal.css';
import { 
  Phone, 
  HeartHandshake, 
  Smartphone, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle, 
  ArrowRight, 
  LogOut,
  Camera,
  Upload,
  User,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { playSound } from '../utils/audioEngine';

// شخصيات كرتونية عصرية للبنين والبنات
const CARTOON_BOY_AVATARS = [
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Omar&glassesProbability=0',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&glassesProbability=0',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Leo&glassesProbability=0',
  'https://api.dicebear.com/7.x/bottts/svg?seed=HeroBoy'
];

const CARTOON_GIRL_AVATARS = [
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Mona&hair=long01,long02',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka&hair=long03,long04',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Lily&hair=long01',
  'https://api.dicebear.com/7.x/bottts/svg?seed=HeroGirl'
];

export default function InitialPhoneSetupModal() {
  const { currentStudent, updateStudentPhones, setActiveModal, logoutStudent, setCurrentPage, lang = 'ar' } = useApp();

  const [gender, setGender] = useState(currentStudent?.gender || 'male');
  const [studentPhone, setStudentPhone] = useState(currentStudent?.phone || '');
  const [guardianPhone, setGuardianPhone] = useState(currentStudent?.guardianPhone || '');
  
  // تحديد الصورة المبدئية
  const [avatar, setAvatar] = useState(() => {
    if (currentStudent?.avatar && !currentStudent.avatar.includes('seed=Student') && !currentStudent.avatar.includes('seed=Guest')) {
      return currentStudent.avatar;
    }
    return currentStudent?.gender === 'female' ? CARTOON_GIRL_AVATARS[0] : CARTOON_BOY_AVATARS[0];
  });

  const [isCustomUploaded, setIsCustomUploaded] = useState(() => {
    return Boolean(currentStudent?.avatar && currentStudent.avatar.startsWith('data:image'));
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);
  const fileInputRef = useRef(null);

  // إذا كان الحساب غير مسجل أو زائر، لا تظهر النافذة مطلقاً
  if (!currentStudent || currentStudent.status === 'guest' || !currentStudent.id) {
    return null;
  }

  const handleExit = async () => {
    playSound.click();
    setActiveModal(null);
    setCurrentPage('home');
    if (typeof logoutStudent === 'function') {
      await logoutStudent();
    }
  };

  const cleanDigits = (val) => String(val || '').replace(/[^0-9]/g, '').slice(0, 11);

  // عند تغيير الجنس: تحديث الصورة الكرتونية الافتراضية إذا لم يكن قد رفع صورة شخصية
  const handleGenderChange = (newGender) => {
    setGender(newGender);
    playSound.click();
    if (!isCustomUploaded) {
      if (newGender === 'female') {
        setAvatar(CARTOON_GIRL_AVATARS[0]);
      } else {
        setAvatar(CARTOON_BOY_AVATARS[0]);
      }
    }
  };

  // رفع صورة مخصصة من الهاتف أو الكمبيوتر مع ضغطها تلقائياً عبر Canvas
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg(lang === 'ar' ? '⚠️ يرجى اختيار ملف صورة صالح (JPG, PNG, WebP)' : 'Please select an image file');
      playSound.wrong();
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg(lang === 'ar' ? '⚠️ حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 8 ميجابايت' : 'Image too large');
      playSound.wrong();
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const maxDim = 180;
          let w = img.width;
          let h = img.height;
          if (w > h) {
            if (w > maxDim) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            }
          } else {
            if (h > maxDim) {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          setAvatar(compressed);
          setIsCustomUploaded(true);
          playSound.levelUp();
        } catch (err) {
          console.warn('Canvas resize fallback:', err);
          setAvatar(event.target.result);
          setIsCustomUploaded(true);
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanStudent = cleanDigits(studentPhone);
    const cleanGuardian = cleanDigits(guardianPhone);

    if (!gender) {
      setErrorMsg(lang === 'ar' ? '⚠️ يرجى تحديد النوع (طالب أو طالبة)' : 'Please select gender');
      playSound.wrong();
      return;
    }

    if (!cleanStudent || cleanStudent.length !== 11 || !cleanStudent.startsWith('01')) {
      setErrorMsg(lang === 'ar' 
        ? '⚠️ رقم هاتف الطالب يجب أن يتكون من 11 رقماً بالضبط ويبدأ بـ 01 (مثال: 01012345678)' 
        : 'Student phone must be exactly 11 digits starting with 01'
      );
      playSound.wrong();
      return;
    }

    if (!cleanGuardian || cleanGuardian.length !== 11 || !cleanGuardian.startsWith('01')) {
      setErrorMsg(lang === 'ar' 
        ? '⚠️ رقم ولي الأمر يجب أن يتكون من 11 رقماً بالضبط ويبدأ بـ 01 (مثال: 01123456789)' 
        : 'Guardian phone must be exactly 11 digits starting with 01'
      );
      playSound.wrong();
      return;
    }

    if (cleanStudent === cleanGuardian) {
      setErrorMsg(lang === 'ar'
        ? '⚠️ يُشترط أن يكون رقم ولي الأمر مختلفاً عن رقم الطالب للتواصل ومتابعة الحضور والتقارير'
        : 'Guardian phone must be different from student phone'
      );
      playSound.wrong();
      return;
    }

    try {
      setIsSaving(true);
      await updateStudentPhones(currentStudent.id, {
        phone: cleanStudent,
        guardianPhone: cleanGuardian,
        gender,
        avatar
      });

      setIsSavedSuccessfully(true);
      playSound.levelUp();

      setTimeout(() => {
        setIsSaving(false);
        // إذا كان الحساب بحاجة لاعتماد الأستاذ، نوجهه لنافذة إشعار الاعتماد فوراً
        if (currentStudent?.status === 'pending') {
          setActiveModal('approval_notice');
        } else {
          setActiveModal(null);
        }
      }, 900);
    } catch (err) {
      console.error('Error saving student phones:', err);
      setIsSaving(false);
      setErrorMsg(lang === 'ar' ? 'حدث خطأ أثناء حفظ البيانات، يرجى المحاولة ثانية' : 'Error saving data, please try again');
      playSound.wrong();
    }
  };

  const activePresets = gender === 'female' ? CARTOON_GIRL_AVATARS : CARTOON_BOY_AVATARS;

  return (
    <div className="initial-setup-backdrop">
      <div className="initial-setup-card">
        <button 
          className="profile-close-btn"
          onClick={handleExit}
          title={lang === 'ar' ? 'إغلاق والعودة للرئيسية' : 'Close and return home'}
        >
          ✕
        </button>

        <div className="setup-header-badge">
          <Smartphone size={30} />
        </div>

        <h3 className="setup-title">
          {lang === 'ar' ? 'استكمال بيانات التسجيل والبروفايل 📱' : 'Registration Completion 📱'}
        </h3>

        <div className="setup-student-chip">
          <img 
            src={avatar || currentStudent?.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=Student'} 
            alt={currentStudent?.name}
            className="setup-student-avatar" 
          />
          <span className="font-bold">{currentStudent?.name || 'طالب كودلينجو'}</span>
          <span style={{ opacity: 0.4 }}>•</span>
          <span style={{ direction: 'ltr' }}>{currentStudent?.email || ''}</span>
        </div>

        <p className="setup-subtitle">
          {lang === 'ar'
            ? 'خطوة بسيطة لمرة واحدة فقط لتسجيل هويتك وصورتك، ولتمكين الأستاذ محمد راشد من اعتماد حسابك وتسكينك في مجموعتك الدراسية.'
            : 'One quick step required only once to setup your profile, avatar and enable teacher approval and group assignment.'
          }
        </p>

        {errorMsg && (
          <div className="setup-error-box mb-3">
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {isSavedSuccessfully ? (
          <div className="setup-info-box" style={{ background: 'rgba(16, 185, 129, 0.15)', borderColor: '#10b981', color: '#6ee7b7' }}>
            <CheckCircle size={22} style={{ flexShrink: 0 }} />
            <span>{lang === 'ar' ? 'تم حفظ وتأكيد بياناتك وصورتك بنجاح! جاري المتابعة... 🚀' : 'Data saved successfully! Continuing...'}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="setup-form">
            {/* اختيار الجنس (ولد / بنت) */}
            <div className="setup-field">
              <label className="setup-label">
                <span>{lang === 'ar' ? 'تحديد النوع / الجنس' : 'Select Gender'}</span>
                <span className="setup-label-req">{lang === 'ar' ? '* مطلوب' : '* Required'}</span>
              </label>
              <div className="setup-gender-group">
                <button
                  type="button"
                  className={`setup-gender-btn ${gender === 'male' ? 'active male-active' : ''}`}
                  onClick={() => handleGenderChange('male')}
                >
                  <span className="gender-emoji">👦</span>
                  <div className="gender-text-wrap">
                    <span className="gender-title">{lang === 'ar' ? 'طالب (ولد)' : 'Male'}</span>
                    <span className="gender-sub">{lang === 'ar' ? 'أفاتار كرتوني ولد' : 'Boy Cartoon'}</span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`setup-gender-btn ${gender === 'female' ? 'active female-active' : ''}`}
                  onClick={() => handleGenderChange('female')}
                >
                  <span className="gender-emoji">👧</span>
                  <div className="gender-text-wrap">
                    <span className="gender-title">{lang === 'ar' ? 'طالبة (بنت)' : 'Female'}</span>
                    <span className="gender-sub">{lang === 'ar' ? 'أفاتار كرتوني بنت' : 'Girl Cartoon'}</span>
                  </div>
                </button>
              </div>
            </div>

            {/* صورة البروفايل (كرتونية أو رفع صورة شخصية) */}
            <div className="setup-field setup-avatar-field">
              <label className="setup-label">
                <span>{lang === 'ar' ? 'صورة البروفايل' : 'Profile Picture'}</span>
                <span className="setup-avatar-status-badge">
                  {isCustomUploaded ? (lang === 'ar' ? '📷 صورة شخصية مرفوعة' : 'Custom photo') : (lang === 'ar' ? '✨ كرتونية افتراضية' : 'Default cartoon')}
                </span>
              </label>

              <div className="setup-avatar-picker-card">
                <div className="setup-avatar-preview-wrap">
                  <img src={avatar} alt="Avatar Preview" className="setup-avatar-main-img" />
                  <button 
                    type="button" 
                    className="setup-avatar-cam-badge"
                    onClick={() => fileInputRef.current?.click()}
                    title={lang === 'ar' ? 'رفع صورتك من جهازك' : 'Upload photo'}
                  >
                    <Camera size={13} />
                  </button>
                </div>

                <div className="setup-avatar-controls-col">
                  <span className="setup-picker-hint">
                    {lang === 'ar' ? 'اختر شخصية كرتونية تناسبك أو ارفع صورتك الخاصة:' : 'Choose a cartoon character or upload your own photo:'}
                  </span>

                  <div className="setup-presets-row">
                    {activePresets.map((cUrl, idx) => (
                      <button
                        type="button"
                        key={idx}
                        className={`setup-preset-chip ${avatar === cUrl ? 'selected' : ''}`}
                        onClick={() => {
                          setAvatar(cUrl);
                          setIsCustomUploaded(false);
                          playSound.click();
                        }}
                        title={lang === 'ar' ? `شخصية كرتونية ${idx + 1}` : `Cartoon ${idx + 1}`}
                      >
                        <img src={cUrl} alt={`Avatar option ${idx + 1}`} />
                      </button>
                    ))}
                  </div>

                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handlePhotoUpload} 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                  />

                  <button
                    type="button"
                    className="setup-upload-trigger-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={14} />
                    <span>{lang === 'ar' ? 'رفع صورتك من الجهاز 📷' : 'Upload from device'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* رقم هاتف الطالب */}
            <div className="setup-field">
              <label className="setup-label">
                <span>{lang === 'ar' ? 'رقم هاتف الطالب / واتساب' : 'Student Phone / WhatsApp'} ({studentPhone.length}/11)</span>
                <span className="setup-label-req">{lang === 'ar' ? '* 11 رقماً' : '* 11 digits'}</span>
              </label>
              <div className="setup-input-wrapper">
                <Phone size={18} className="setup-input-icon" />
                <input 
                  type="tel"
                  className="setup-input"
                  placeholder="010XXXXXXXX (11 رقماً)"
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(cleanDigits(e.target.value))}
                  maxLength={11}
                  disabled={isSaving}
                  required
                />
              </div>
            </div>

            {/* رقم هاتف ولي الأمر */}
            <div className="setup-field">
              <label className="setup-label">
                <span>{lang === 'ar' ? 'رقم هاتف ولي الأمر' : 'Guardian Phone'} ({guardianPhone.length}/11)</span>
                <span className="setup-label-req">{lang === 'ar' ? '* 11 رقماً' : '* 11 digits'}</span>
              </label>
              <div className="setup-input-wrapper">
                <HeartHandshake size={18} className="setup-input-icon" style={{ color: '#f59e0b' }} />
                <input 
                  type="tel"
                  className="setup-input"
                  placeholder="011XXXXXXXX / 012XXXXXXXX (11 رقماً)"
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(cleanDigits(e.target.value))}
                  maxLength={11}
                  disabled={isSaving}
                  required
                />
              </div>
            </div>

            <div className="setup-info-box">
              <ShieldCheck size={20} style={{ flexShrink: 0, color: '#f59e0b' }} />
              <div>
                <strong>{lang === 'ar' ? 'تأكيد الخصوصية:' : 'Privacy Note:'}</strong>{' '}
                {lang === 'ar' 
                  ? 'هذه البيانات تُطلب لمرة واحدة فقط ويتم حفظها في بروفايلك الأكاديمي لمتابعة التقارير والواجبات.' 
                  : 'Requested only once and saved to your profile for teacher follow-up.'
                }
              </div>
            </div>

            <button 
              type="submit" 
              className="setup-submit-btn"
              disabled={isSaving}
            >
              {isSaving ? (
                <span>{lang === 'ar' ? 'جارٍ الحفظ والمزامنة... ⏳' : 'Saving... ⏳'}</span>
              ) : (
                <>
                  <span>{lang === 'ar' ? 'تأكيد وحفظ البيانات في البروفايل 🚀' : 'Save & Confirm Data 🚀'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        )}

        <button 
          type="button" 
          className="setup-logout-link"
          onClick={handleExit}
          title="العودة للصفحة الرئيسية والتصفح كزائر"
        >
          <LogOut size={14} style={{ display: 'inline', marginLeft: '6px', verticalAlign: 'middle' }} />
          <span>{lang === 'ar' ? 'العودة للصفحة الرئيسية كزائر' : 'Return to home as guest'}</span>
        </button>
      </div>
    </div>
  );
}
