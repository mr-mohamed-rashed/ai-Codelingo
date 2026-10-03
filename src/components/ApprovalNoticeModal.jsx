import React from 'react';
import { ShieldAlert, Clock, Phone, X, BookOpen, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { playSound } from '../utils/audioEngine';

export default function ApprovalNoticeModal() {
  const { currentStudent, setActiveModal, lang } = useApp();

  return (
    <div className="modal-backdrop">
      <div className="modal-card approval-notice-card" style={{ maxWidth: '500px' }}>
        <button 
          className="quiz-close-btn"
          onClick={() => setActiveModal(null)}
          title="إغلاق"
        >
          ✕
        </button>

        <div className="auth-step-container text-center">
          <div className="pending-badge-icon-wrap" style={{ margin: '0 auto 12px auto' }}>
            <Clock size={48} className="text-amber-500" />
          </div>

          <h2 className="auth-title text-amber-700">
            {lang === 'ar' ? 'الدرس مقفل حالياً 🔒' : 'Lesson is Locked 🔒'}
          </h2>

          <div className="pending-alert-box mt-3 text-right" style={{ background: '#fffbeb', borderColor: '#fde68a' }}>
            <ShieldAlert size={22} className="text-amber-600 flex-shrink-0" />
            <p className="text-xs text-amber-900 leading-relaxed m-0">
              {lang === 'ar'
                ? `مرحباً يا ${currentStudent?.name || 'بطل'}، تم تسجيل حسابك بالجيميل بنجاح، ولكن طبقاً لنظام المنصة لا يمكنك فتح ومتابعة محطات الدروس إلا بعد أن يعطيك الأستاذ محمد راشد التصريح ويعتمد تسكينك في مجموعتك الدراسية لمتابعة تقدمك ونقاط ضعفك.`
                : 'Your account is registered, but lessons remain locked until approved by the teacher and assigned to your study group.'
              }
            </p>
          </div>

          <div className="student-profile-summary-card mt-3 text-right">
            <img 
              src={currentStudent?.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=Student'} 
              alt={currentStudent?.name} 
              className="summary-card-avatar"
            />
            <div className="summary-card-info">
              <h4 className="font-bold text-slate-800 text-sm">{currentStudent?.name}</h4>
              <div className="text-xs text-slate-600">
                📱 هاتف الطالب: <strong>{currentStudent?.phone || 'غير مسجل'}</strong>
              </div>
              <div className="text-xs text-amber-800 font-semibold">
                👨‍👩‍👧 ولي الأمر: <strong>{currentStudent?.guardianPhone || 'غير مسجل'}</strong>
              </div>
              <span className="pending-chip mt-1 inline-block text-xs">
                الحالة: في انتظار اعتماد الأستاذ وتحديد المجموعة ⏳
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 w-full">
            <a
              href={`https://wa.me/201012345678?text=${encodeURIComponent(
                `أهلاً يا أستاذ محمد، أنا الطالب ${currentStudent?.name || ''}، سجلت في المنصة (${currentStudent?.email || ''}) ورقم ولي أمري (${currentStudent?.guardianPhone || ''}). أرجو من حضرتك إعطائي تصريح الدخول لمراجعة المنهج وفتح الدروس.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="duo-btn text-center text-white py-2.5 font-bold flex items-center justify-center gap-2"
              style={{ background: '#25D366', borderBottomColor: '#128C7E' }}
            >
              <Phone size={15} />
              <span>مراسلة الأستاذ على واتساب للاعتماد السريع</span>
            </a>

            <button 
              className="duo-btn duo-btn-secondary w-full py-2"
              onClick={() => setActiveModal(null)}
            >
              فهمت ذلك، إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
