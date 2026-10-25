import React, { useState, useMemo, useEffect } from 'react';
import './InstallGuideModal.css';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Smartphone, 
  Share2, 
  CheckCircle, 
  DownloadCloud, 
  AlertTriangle, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles,
  ArrowDown
} from 'lucide-react';
import { playSound } from '../utils/audioEngine';

export default function InstallGuideModal() {
  const { setActiveModal, lang, installPrompt } = useApp();
  
  // كشف تلقائي لنوع الجهاز ونوع المتصفح
  const [platform, setPlatform] = useState(() => {
    if (typeof navigator !== 'undefined') {
      const ua = navigator.userAgent || '';
      if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
    }
    return 'android';
  });

  // كشف ما إذا كان المستخدم يفتح الرابط من داخل متصفح واتساب أو فيسبوك أو ماسنجر (In-App Browser)
  const isInAppBrowser = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent || navigator.vendor || window.opera || '';
    return /FBAV|FBAN|Instagram|WhatsApp|Line|Snapchat|Telegram/i.test(ua);
  }, []);

  const [copied, setCopied] = useState(false);
  const [installStatus, setInstallStatus] = useState('idle'); // 'idle' | 'installing' | 'success' | 'manual'
  const [installProgress, setInstallProgress] = useState(0);

  const handleClose = () => {
    playSound.click();
    setActiveModal(null);
  };

  const handleCopyLink = () => {
    try {
      const url = typeof window !== 'undefined' ? window.location.origin : 'https://ai-codelingo.pages.dev';
      navigator.clipboard.writeText(url);
      setCopied(true);
      playSound.click();
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const handleStartInstall = async () => {
    playSound.click();
    setInstallStatus('installing');
    setInstallProgress(15);

    // محاكاة سريعة لتحضير حزمة التطبيق والملفات دون إنترنت
    const timer1 = setTimeout(() => setInstallProgress(55), 250);
    const timer2 = setTimeout(async () => {
      setInstallProgress(100);

      if (installPrompt) {
        try {
          installPrompt.prompt();
          const { outcome } = await installPrompt.userChoice;
          if (outcome === 'accepted') {
            setInstallStatus('success');
            playSound.levelUp();
            setTimeout(() => {
              setActiveModal(null);
            }, 2500);
          } else {
            setInstallStatus('manual');
          }
        } catch {
          setInstallStatus('manual');
        }
      } else {
        // إذا لم يكن البرومت التلقائي متاحاً (مثل سفاري أو متصفح داخلي)
        setInstallStatus('manual');
      }
    }, 600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div 
        className="modal-card legal-document-modal-card pwa-install-modal-card" 
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '490px' }}
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
        <div className="legal-doc-header">
          <div className="legal-doc-icon-wrap pwa-main-icon-wrap">
            <DownloadCloud size={30} />
          </div>
          <span className="pwa-tag-pill">
            <Sparkles size={13} />
            {lang === 'en' ? 'Official Web App' : 'تطبيق كودلينجو الرسمي'}
          </span>
          <h2 className="pwa-modal-title">
            {lang === 'en' ? 'Install App on Your Phone' : 'تثبيت المنصة كتطبيق على هاتفك'}
          </h2>
          <p className="pwa-modal-subtitle">
            {lang === 'en' 
              ? 'Access lessons and exams instantly from your home screen with zero lag!'
              : 'ثبت التطبيق لتصل لمذاكرتك وامتحاناتك بضغطة زر من شاشتك الرئيسية وبدون إعلانات وبأعلى سرعة!'
            }
          </p>
        </div>

        {/* تنبيه إذا كان المستخدم داخل متصفح واتساب أو فيسبوك */}
        {isInAppBrowser && (
          <div className="in-app-browser-alert">
            <div className="alert-icon-col">
              <AlertTriangle size={20} className="text-amber-500" />
            </div>
            <div className="alert-text-col">
              <strong>{lang === 'en' ? 'In-App Browser Detected' : 'تنبيه: أنت داخل متصفح واتساب / فيسبوك ⚠️'}</strong>
              <p>
                {lang === 'en' 
                  ? 'In-app browsers prevent direct app installation. Tap the 3 dots (⋮) at top and choose "Open in Chrome/Safari".'
                  : 'متصفح واتساب وفيسبوك يمنع تثبيت التطبيقات. اضغط على الثلاث نقاط (⋮ أو ⋯) في أعلى الشاشة واختر "فتح في متصفح Chrome" للتثبيت فوراً!'
                }
              </p>
            </div>
          </div>
        )}

        {/* زر التثبيت التفاعلي وشريط التقدم */}
        <div className="pwa-install-action-box">
          {installStatus === 'success' ? (
            <div className="pwa-success-message">
              <CheckCircle size={28} className="text-emerald-500" />
              <div>
                <h4>{lang === 'en' ? 'Installed Successfully!' : 'تم التثبيت بنجاح! 🎉'}</h4>
                <p>{lang === 'en' ? 'You will find CodeLingo app icon on your home screen.' : 'ستجد الآن أيقونة تطبيق كودلينجو على شاشتك الرئيسية جاهزة للمذاكرة.'}</p>
              </div>
            </div>
          ) : (
            <>
              <button 
                type="button"
                className="duo-btn duo-btn-success w-full py-3.5 flex items-center justify-center gap-2 text-base font-bold pwa-action-btn"
                onClick={handleStartInstall}
                disabled={installStatus === 'installing'}
              >
                <DownloadCloud size={20} />
                <span>
                  {installStatus === 'installing'
                    ? (lang === 'en' ? 'Preparing Application Package...' : 'جاري تجهيز وتثبيت التطبيق...')
                    : (lang === 'en' ? 'Install App Now 📲' : 'تثبيت التطبيق على الشاشة الرئيسية 📲')
                  }
                </span>
              </button>

              {/* شريط التحميل التفاعلي */}
              {installStatus === 'installing' && (
                <div className="pwa-progress-container">
                  <div className="pwa-progress-bar-bg">
                    <div 
                      className="pwa-progress-bar-fill" 
                      style={{ width: `${installProgress}%` }}
                    />
                  </div>
                  <div className="pwa-progress-status-text">
                    <span>{installProgress < 60 ? 'الاتصال بنظام الهاتف وتجهيز الأيقونة...' : 'إتمام حزمة التثبيت دون إنترنت...'}</span>
                    <span dir="ltr">{installProgress}%</span>
                  </div>
                </div>
              )}

              {installStatus === 'manual' && (
                <div className="pwa-manual-guide-hint">
                  <ArrowDown size={16} className="text-emerald-500 animate-bounce" />
                  <span>
                    {lang === 'en' 
                      ? 'Follow the quick steps below to add to your home screen:' 
                      : 'اضغط على الخطوات السريعة الموضحة بالأسفل لإضافته لشاشتك 👇'}
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {/* اختيار النظام: أندرويد أو آيفون */}
        <div className="platform-toggle-row">
          <button
            type="button"
            className={`platform-toggle-btn ${platform === 'android' ? 'active-android' : ''}`}
            onClick={() => {
              setPlatform('android');
              playSound.click();
            }}
          >
            <Smartphone size={16} />
            <span>هواتف أندرويد (Android)</span>
          </button>

          <button
            type="button"
            className={`platform-toggle-btn ${platform === 'ios' ? 'active-ios' : ''}`}
            onClick={() => {
              setPlatform('ios');
              playSound.click();
            }}
          >
            <Share2 size={16} />
            <span>آيفون وآيباد (iPhone / iOS)</span>
          </button>
        </div>

        {/* محتوى الإرشادات الواضحة المقروءة */}
        <div className="install-steps-container">
          {platform === 'android' ? (
            <div className="install-steps-list">
              <div className="install-step-card">
                <span className="step-badge-num num-android">1</span>
                <div className="step-text-wrap">
                  <strong className="step-highlight">افتح قائمة المتصفح:</strong>
                  <p className="step-desc">
                    اضغط على زر القائمة في متصفح جوجل كروم <strong>(الثلاث نقاط الرأسية ⋮)</strong> في أعلى أو أسفل الشاشة.
                  </p>
                </div>
              </div>

              <div className="install-step-card">
                <span className="step-badge-num num-android">2</span>
                <div className="step-text-wrap">
                  <strong className="step-highlight">اختر التثبيت:</strong>
                  <p className="step-desc">
                    اختر من القائمة <strong>"تثبيت التطبيق (Install app)"</strong> أو <strong>"إضافة إلى الشاشة الرئيسية (Add to Home screen)"</strong>.
                  </p>
                </div>
              </div>

              <div className="install-step-card">
                <span className="step-badge-num num-android">3</span>
                <div className="step-text-wrap">
                  <strong className="step-highlight">تأكيد التثبيت:</strong>
                  <p className="step-desc">
                    اضغط على <strong>"تثبيت (Install)"</strong> وسيظهر تطبيق كودلينجو فوراً على شاشة هاتفك مثل أي تطبيق تم تنزيله من متجر Play!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="install-steps-list">
              <div className="install-step-card">
                <span className="step-badge-num num-ios">1</span>
                <div className="step-text-wrap">
                  <strong className="step-highlight">افتح في سفاري Safari:</strong>
                  <p className="step-desc">
                    تأكد من فتح الرابط في متصفح <strong>Safari</strong>، ثم اضغط على زر <strong>المشاركة (Share ⎋)</strong> في أسفل الشاشة.
                  </p>
                </div>
              </div>

              <div className="install-step-card">
                <span className="step-badge-num num-ios">2</span>
                <div className="step-text-wrap">
                  <strong className="step-highlight">إضافة للشاشة الرئيسية:</strong>
                  <p className="step-desc">
                    مرر القائمة للأسفل قليلاً واختر <strong>"إضافة إلى الشاشة الرئيسية (Add to Home Screen)"</strong>.
                  </p>
                </div>
              </div>

              <div className="install-step-card">
                <span className="step-badge-num num-ios">3</span>
                <div className="step-text-wrap">
                  <strong className="step-highlight">تأكيد الإضافة:</strong>
                  <p className="step-desc">
                    اضغط على <strong>"إضافة (Add)"</strong> في أعلى اليمين وستجد تطبيق كودلينجو على شاشتك الرئيسية فوراً.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* أدوات إضافية: نسخ الرابط وزر الإغلاق */}
        <div className="pwa-modal-footer">
          <button
            type="button"
            className="duo-btn duo-btn-secondary py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2"
            onClick={handleCopyLink}
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copied ? 'تم نسخ الرابط! ✅' : 'نسخ رابط المنصة'}</span>
          </button>

          <button
            type="button"
            className="duo-btn duo-btn-primary flex-1 py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-1.5"
            onClick={handleClose}
          >
            <CheckCircle size={15} />
            <span>{lang === 'en' ? 'Got it, Close' : 'فهمت الخطوات، إغلاق'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
