import React, { useState } from 'react';
import './InitialPhoneSetupModal.css';
import { Phone, HeartHandshake, Smartphone, ShieldCheck, AlertCircle, CheckCircle, ArrowRight, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { playSound } from '../utils/audioEngine';

export default function InitialPhoneSetupModal() {
  const { currentStudent, updateStudentPhones, setActiveModal, logoutStudent, setCurrentPage, lang = 'ar' } = useApp();

  const [studentPhone, setStudentPhone] = useState(currentStudent?.phone || '');
  const [guardianPhone, setGuardianPhone] = useState(currentStudent?.guardianPhone || '');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);

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

  const cleanDigits = (val) => String(val || '').replace(/[^0-9+]/g, '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanStudent = cleanDigits(studentPhone);
    const cleanGuardian = cleanDigits(guardianPhone);

    if (!cleanStudent || cleanStudent.length < 10) {
      setErrorMsg(lang === 'ar' 
        ? '⚠️ يرجى إدخال رقم هاتف الطالب بشكل صحيح (10 أرقام على الأقل، مثال: 01012345678)' 
        : 'Please enter a valid student phone number (at least 10 digits)'
      );
      playSound.wrong();
      return;
    }

    if (!cleanGuardian || cleanGuardian.length < 10) {
      setErrorMsg(lang === 'ar' 
        ? '⚠️ يرجى إدخال رقم هاتف ولي الأمر بشكل صحيح لمتابعة الأستاذ وتسكينك في المجموعة' 
        : 'Please enter a valid guardian phone number'
      );
      playSound.wrong();
      return;
    }

    if (cleanStudent === cleanGuardian) {
      setErrorMsg(lang === 'ar'
        ? '⚠️ يُفضل أن يكون رقم ولي الأمر مختلفاً عن رقم الطالب للتواصل ومتابعة الحضور والتقارير'
        : 'Guardian phone should preferably be different from student phone'
      );
    }

    try {
      setIsSaving(true);
      await updateStudentPhones(currentStudent.id, {
        phone: cleanStudent,
        guardianPhone: cleanGuardian
      });

      setIsSavedSuccessfully(true);
      playSound.levelUp();

      setTimeout(() => {
        setIsSaving(false);
        // إذا كان الحساب بحاجة لاعتماد الأستاذ، نوجهه لنافذة إشعار الاعتماد فورا
        if (currentStudent?.status === 'pending') {
          setActiveModal('approval_notice');
        } else {
          setActiveModal(null);
        }
      }, 900);
    } catch (err) {
      console.error('Error saving student phones:', err);
      setIsSaving(false);
      setErrorMsg(lang === 'ar' ? 'حدث خطأ أثناء حفظ الأرقام، يرجى المحاولة ثانية' : 'Error saving numbers, please try again');
      playSound.wrong();
    }
  };

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
          <Smartphone size={32} />
        </div>

        <h3 className="setup-title">
          {lang === 'ar' ? 'استكمال بيانات التسجيل 📱' : 'Registration Completion 📱'}
        </h3>

        <div className="setup-student-chip">
          <img 
            src={currentStudent?.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=Student'} 
            alt={currentStudent?.name}
            className="setup-student-avatar" 
          />
          <span>{currentStudent?.name || 'طالب كودلينجو'}</span>
          <span style={{ opacity: 0.5 }}>•</span>
          <span style={{ direction: 'ltr' }}>{currentStudent?.email || ''}</span>
        </div>

        <p className="setup-subtitle">
          {lang === 'ar'
            ? 'خطوة واحدة بسيطة مطلوبة لمرة واحدة فقط لتسجيل ملفك الأكاديمي، ولتمكين الأستاذ محمد راشد من اعتماد حسابك وتسكينك في مجموعتك الدراسية.'
            : 'One quick step required only once to register your profile and enable teacher approval and group assignment.'
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
            <span>{lang === 'ar' ? 'تم حفظ وتأكيد بياناتك بنجاح! جاري المتابعة... 🚀' : 'Data saved successfully! Continuing...'}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="setup-form">
            <div className="setup-field">
              <label className="setup-label">
                <span>{lang === 'ar' ? 'رقم هاتف الطالب / واتساب' : 'Student Phone / WhatsApp'}</span>
                <span className="setup-label-req">{lang === 'ar' ? '* مطلوب' : '* Required'}</span>
              </label>
              <div className="setup-input-wrapper">
                <Phone size={18} className="setup-input-icon" />
                <input 
                  type="tel"
                  className="setup-input"
                  placeholder="010XXXXXXXX"
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  disabled={isSaving}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="setup-field">
              <label className="setup-label">
                <span>{lang === 'ar' ? 'رقم هاتف ولي الأمر' : 'Guardian Phone'}</span>
                <span className="setup-label-req">{lang === 'ar' ? '* إجباري للمتابعة' : '* Required'}</span>
              </label>
              <div className="setup-input-wrapper">
                <HeartHandshake size={18} className="setup-input-icon" style={{ color: '#f59e0b' }} />
                <input 
                  type="tel"
                  className="setup-input"
                  placeholder="011XXXXXXXX / 012XXXXXXXX"
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
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
                  ? 'هذه الأرقام تطلب لمرة واحدة فقط ويتم حفظها في بروفايلك الأكاديمي، ولن تُطلب منك في أي تسجيل دخول قادم.' 
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
