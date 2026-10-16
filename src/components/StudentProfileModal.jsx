import React, { useState } from 'react';
import './StudentProfileModal.css';
import { 
  User, 
  Mail, 
  Phone, 
  HeartHandshake, 
  ShieldCheck, 
  Users, 
  Flame, 
  Star, 
  Trophy, 
  Sparkles, 
  CheckCircle, 
  Clock, 
  Save, 
  LogOut, 
  Send 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { playSound } from '../utils/audioEngine';

export default function StudentProfileModal() {
  const { 
    currentStudent, 
    currentStudentGroup, 
    updateStudentPhones, 
    setActiveModal, 
    logoutStudent, 
    lang = 'ar' 
  } = useApp();

  const [studentName, setStudentName] = useState(currentStudent?.name || '');
  const [phone, setPhone] = useState(currentStudent?.phone || '');
  const [guardianPhone, setGuardianPhone] = useState(currentStudent?.guardianPhone || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!currentStudent) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSaveSuccess(false);

    const cleanPhone = String(phone || '').replace(/[^0-9+]/g, '');
    const cleanGuardian = String(guardianPhone || '').replace(/[^0-9+]/g, '');

    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMsg(lang === 'ar' ? '⚠️ يرجى إدخال رقم هاتف صحيح (10 أرقام على الأقل)' : 'Please enter a valid phone number');
      playSound.wrong();
      return;
    }

    if (!cleanGuardian || cleanGuardian.length < 10) {
      setErrorMsg(lang === 'ar' ? '⚠️ يرجى إدخال رقم هاتف ولي الأمر بشكل صحيح' : 'Please enter a valid guardian phone');
      playSound.wrong();
      return;
    }

    try {
      setIsSaving(true);
      await updateStudentPhones(currentStudent.id, {
        name: studentName.trim() || currentStudent.name,
        phone: cleanPhone,
        guardianPhone: cleanGuardian
      });
      setIsSaving(false);
      setSaveSuccess(true);
      playSound.levelUp();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setIsSaving(false);
      setErrorMsg(lang === 'ar' ? 'حدث خطأ أثناء حفظ التعديلات' : 'Error saving changes');
      playSound.wrong();
    }
  };

  const isApproved = currentStudent.status === 'approved';

  return (
    <div className="profile-modal-backdrop">
      <div className="profile-modal-card">
        <button 
          className="profile-close-btn"
          onClick={() => setActiveModal(null)}
          title="إغلاق"
        >
          ✕
        </button>

        {/* Top Hero Section */}
        <div className="profile-top-hero">
          <div className="profile-avatar-wrap">
            <img 
              src={currentStudent.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=Student'} 
              alt={currentStudent.name} 
              className="profile-avatar-img"
            />
          </div>

          <h3 className="profile-name-title">{currentStudent.name}</h3>
          <div className="profile-email-sub">{currentStudent.email || 'حساب محلي'}</div>

          <div className={`profile-status-badge ${isApproved ? 'approved' : 'pending'}`}>
            {isApproved ? (
              <>
                <CheckCircle size={15} />
                <span>
                  {currentStudentGroup 
                    ? `طالب معتمد • ${currentStudentGroup.name}` 
                    : (lang === 'en' ? 'Approved Student' : 'طالب معتمد ونشط بالمنصة')}
                </span>
              </>
            ) : (
              <>
                <Clock size={15} />
                <span>{lang === 'en' ? 'Pending Teacher Approval' : 'الحساب قيد المراجعة بانتظار اعتماد الأستاذ'}</span>
              </>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="profile-stats-grid">
          <div className="profile-stat-box">
            <Sparkles size={18} color="#6366f1" />
            <div className="profile-stat-val">{currentStudent.xp || 0}</div>
            <div className="profile-stat-lbl">نقاط XP</div>
          </div>
          <div className="profile-stat-box">
            <Star size={18} color="#fbbf24" fill="#fbbf24" />
            <div className="profile-stat-val">{currentStudent.stars || 0}</div>
            <div className="profile-stat-lbl">النجوم</div>
          </div>
          <div className="profile-stat-box">
            <Flame size={18} color="#f97316" fill="#f97316" />
            <div className="profile-stat-val">{currentStudent.streak || 1}</div>
            <div className="profile-stat-lbl">أيام الحماس</div>
          </div>
        </div>

        {/* Contact Info & Numbers Form */}
        <div className="profile-section-card">
          <div className="profile-section-title">
            <Phone size={17} color="#38bdf8" />
            <span>بيانات التواصل المسجلة في البروفايل</span>
          </div>

          {errorMsg && (
            <div className="setup-error-box mb-3" style={{ marginBottom: '10px' }}>
              <span>{errorMsg}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="setup-info-box mb-3" style={{ background: 'rgba(16, 185, 129, 0.15)', borderColor: '#10b981', color: '#6ee7b7', marginBottom: '10px' }}>
              <CheckCircle size={18} style={{ flexShrink: 0 }} />
              <span>تم حفظ وتحديث بيانات البروفايل بنجاح في قاعدة البيانات! 🚀</span>
            </div>
          )}

          <form onSubmit={handleSave} className="profile-field-group">
            <div className="profile-field-item">
              <label className="profile-field-label">
                <User size={14} />
                <span>اسم الطالب</span>
              </label>
              <div className="profile-field-input-box">
                <User size={16} className="profile-field-icon" />
                <input 
                  type="text" 
                  value={studentName} 
                  onChange={(e) => setStudentName(e.target.value)}
                  dir="rtl"
                  required
                />
              </div>
            </div>

            <div className="profile-field-item">
              <label className="profile-field-label">
                <Phone size={14} />
                <span>رقم هاتف الطالب / واتساب</span>
              </label>
              <div className="profile-field-input-box">
                <Phone size={16} className="profile-field-icon" />
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="010XXXXXXXX"
                  dir="ltr"
                  required
                />
              </div>
            </div>

            <div className="profile-field-item">
              <label className="profile-field-label">
                <HeartHandshake size={14} style={{ color: '#f59e0b' }} />
                <span>رقم ولي الأمر</span>
              </label>
              <div className="profile-field-input-box">
                <HeartHandshake size={16} className="profile-field-icon" style={{ color: '#f59e0b' }} />
                <input 
                  type="tel" 
                  value={guardianPhone} 
                  onChange={(e) => setGuardianPhone(e.target.value)}
                  placeholder="011XXXXXXXX / 012XXXXXXXX"
                  dir="ltr"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="profile-save-btn"
              disabled={isSaving}
            >
              <Save size={16} />
              <span>{isSaving ? 'جارٍ الحفظ... ⏳' : 'حفظ تعديلات الأرقام والبروفايل'}</span>
            </button>
          </form>
        </div>

        {/* Action Buttons */}
        <div className="profile-actions-column">
          <a
            href={`https://wa.me/201012345678?text=${encodeURIComponent(
              `أهلاً يا أستاذ محمد، أنا الطالب ${currentStudent.name}، مسجل في المنصة (${currentStudent.email})، رقم تليفوني: ${currentStudent.phone || phone} ورقم ولي أمري: ${currentStudent.guardianPhone || guardianPhone}.`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="profile-whatsapp-btn"
          >
            <Send size={16} />
            <span>مراسلة الأستاذ محمد راشد عبر واتساب</span>
          </a>

          <button 
            type="button" 
            className="profile-logout-btn"
            onClick={logoutStudent}
          >
            <LogOut size={16} />
            <span>تسجيل الخروج من الحساب</span>
          </button>
        </div>
      </div>
    </div>
  );
}
