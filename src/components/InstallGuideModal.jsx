import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Smartphone, Share2, MoreVertical, PlusSquare, CheckCircle, DownloadCloud } from 'lucide-react';
import { playSound } from '../utils/audioEngine';

export default function InstallGuideModal() {
  const { setActiveModal, lang, installPrompt } = useApp();
  const [platform, setPlatform] = useState(() => {
    // كشف تلقائي لنوع الجهاز
    if (typeof navigator !== 'undefined') {
      const ua = navigator.userAgent || '';
      if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
    }
    return 'android';
  });

  const handleClose = () => {
    playSound.click();
    setActiveModal(null);
  };

  const handleNativeInstall = async () => {
    playSound.click();
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        setActiveModal(null);
      }
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div 
        className="modal-card legal-document-modal-card pwa-install-modal-card" 
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '480px' }}
      >
        {/* زر الإغلاق */}
        <button 
          className="quiz-close-btn" 
          onClick={handleClose}
          title={lang === 'en' ? 'Close' : 'إغلاق'}
        >
          <X size={20} />
        </button>

        {/* الترويسة */}
        <div className="legal-doc-header" style={{ marginBottom: '18px' }}>
          <div className="legal-doc-icon-wrap bg-indigo-500/20 text-indigo-400 border border-indigo-500/40">
            <DownloadCloud size={32} />
          </div>
          <span className="legal-doc-tag" style={{ background: 'rgba(99, 102, 241, 0.15)', borderColor: '#818cf8', color: '#c7d2fe' }}>
            {lang === 'en' ? 'Install Official App' : 'تثبيت المنصة كتطبيق على هاتفك'}
          </span>
          <h2 className="legal-doc-title" style={{ fontSize: '1.45rem' }}>
            {lang === 'en' ? 'Install CodeLingo App' : 'تطبيق كودلينجو السريع'}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>
            {lang === 'en' 
              ? 'Access lessons and exams instantly from your home screen with zero lag!'
              : 'ثبت التطبيق لتصل لمذاكرتك وامتحاناتك بضغطة زر من شاشتك الرئيسية وبدون إعلانات!'
            }
          </p>
        </div>

        {/* إذا كان البرومت التلقائي متوفراً للأندرويد */}
        {installPrompt && (
          <div style={{ marginBottom: '16px', textAlign: 'center' }}>
            <button 
              className="duo-btn duo-btn-primary w-full py-3 flex items-center justify-center gap-2 text-base font-bold"
              onClick={handleNativeInstall}
            >
              <DownloadCloud size={20} />
              <span>{lang === 'en' ? 'Click to Install Now' : 'اضغط للتثبيت الفوري 📲'}</span>
            </button>
            <div style={{ margin: '14px 0 8px', color: '#64748b', fontSize: '0.8rem' }}>
              {lang === 'en' ? 'Or follow the manual steps below:' : 'أو اتبع الخطوات السريعة بالأسفل:'}
            </div>
          </div>
        )}

        {/* اختيار النظام: أندرويد أو آيفون */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(255, 255, 255, 0.04)', padding: '4px', borderRadius: '12px', marginBottom: '18px' }}>
          <button
            type="button"
            onClick={() => setPlatform('android')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '10px',
              border: 'none',
              background: platform === 'android' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'transparent',
              color: platform === 'android' ? '#ffffff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Smartphone size={16} />
            <span>هواتف أندرويد (Android)</span>
          </button>

          <button
            type="button"
            onClick={() => setPlatform('ios')}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '10px',
              border: 'none',
              background: platform === 'ios' ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'transparent',
              color: platform === 'ios' ? '#ffffff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Share2 size={16} />
            <span>آيفون وآيباد (iPhone / iOS)</span>
          </button>
        </div>

        {/* محتوى الإرشادات */}
        <div className="install-steps-wrap" style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          {platform === 'android' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ width: '26px', height: '26px', borderRadius: '8px', background: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem', flexShrink: 0 }}>1</span>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#cbd5e1' }}>
                  اضغط على زر القائمة في متصفح كروم <strong>(الثلاث نقاط الرأسية ⋮)</strong> في أعلى أو أسفل الشاشة.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ width: '26px', height: '26px', borderRadius: '8px', background: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem', flexShrink: 0 }}>2</span>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#cbd5e1' }}>
                  اختر من القائمة <strong>"تثبيت التطبيق (Install app)"</strong> أو <strong>"إضافة إلى الشاشة الرئيسية (Add to Home screen)"</strong>.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ width: '26px', height: '26px', borderRadius: '8px', background: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem', flexShrink: 0 }}>3</span>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#cbd5e1' }}>
                  اضغط على <strong>"تثبيت (Install)"</strong> وسيظهر أيقونة التطبيق فوراً على شاشة هاتفك مثل أي تطبيق من متجر Play!
                </p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ width: '26px', height: '26px', borderRadius: '8px', background: '#6366f1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem', flexShrink: 0 }}>1</span>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#cbd5e1' }}>
                  افتح الرابط في متصفح <strong>Safari</strong>، ثم اضغط على زر <strong>المشاركة (Share ⎋)</strong> في أسفل الشاشة.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ width: '26px', height: '26px', borderRadius: '8px', background: '#6366f1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem', flexShrink: 0 }}>2</span>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#cbd5e1' }}>
                  مرر القائمة للأسفل قليلاً واختر <strong>"إضافة إلى الشاشة الرئيسية (Add to Home Screen)"</strong>.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ width: '26px', height: '26px', borderRadius: '8px', background: '#6366f1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem', flexShrink: 0 }}>3</span>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#cbd5e1' }}>
                  اضغط على <strong>"إضافة (Add)"</strong> في أعلى اليمين وستجد التطبيق على شاشتك الرئيسية كأنه محمل من App Store!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* زر تم الفهم */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            className="duo-btn duo-btn-success w-full py-3 text-sm font-bold flex items-center justify-center gap-2"
            onClick={handleClose}
          >
            <CheckCircle size={18} />
            <span>{lang === 'en' ? 'Got it, Close' : 'فهمت الخطوات، إغلاق'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
