import React, { useState, useEffect } from 'react';
import './InstallGuideModal.css';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Smartphone, 
  Share, 
  PlusSquare, 
  MoreVertical, 
  Copy, 
  Check, 
  Sparkles, 
  Monitor, 
  Download,
  AlertCircle
} from 'lucide-react';
import { playSound } from '../utils/audioEngine';

export default function InstallGuideModal() {
  const { setActiveModal, installPrompt, setInstallPrompt, lang = 'ar' } = useApp();
  
  // اكتشاف تلقائي لنوع جهاز الطالب
  const [deviceTab, setDeviceTab] = useState(() => {
    if (typeof navigator === 'undefined') return 'android';
    const ua = navigator.userAgent || '';
    const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (isIOS) return 'ios';
    const isAndroid = /Android/i.test(ua);
    if (isAndroid) return 'android';
    return 'desktop';
  });

  const [copied, setCopied] = useState(false);
  const [nativeInstallSuccess, setNativeInstallSuccess] = useState(false);

  const promptEvent = installPrompt || (typeof window !== 'undefined' ? window.__codelingo_install_prompt : null);

  // تشغيل التثبيت الفوري إذا كان متاحاً في المتصفح
  const handleNativePrompt = async () => {
    playSound.click();
    if (!promptEvent) return;

    try {
      await promptEvent.prompt();
      const choiceResult = await promptEvent.userChoice;
      if (choiceResult && choiceResult.outcome === 'accepted') {
        setNativeInstallSuccess(true);
        if (setInstallPrompt) setInstallPrompt(null);
        if (typeof window !== 'undefined') window.__codelingo_install_prompt = null;
        playSound.levelUp();
        setTimeout(() => {
          setActiveModal(null);
        }, 1800);
      }
    } catch (err) {
      console.warn('Native install prompt error:', err);
    }
  };

  // نسخ الرابط لفتحه في سفاري أو كروم
  const handleCopyLink = () => {
    playSound.click();
    const url = window.location.origin;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }).catch(() => {});
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
      <div 
        className="modal-card smart-installer-modal-card" 
        onClick={e => e.stopPropagation()}
      >
        {/* زر الإغلاق */}
        <button 
          className="quiz-close-btn" 
          onClick={() => setActiveModal(null)}
          title="إغلاق"
        >
          <X size={20} />
        </button>

        {/* رأس النافذة مع الشعار */}
        <div className="smart-installer-header">
          <div className="smart-installer-app-icon">
            <picture>
              <source srcSet="/icon-192.webp" type="image/webp" />
              <img 
                src="/icon-192.png" 
                alt="CodeLingo Icon" 
                className="smart-installer-img"
              />
            </picture>
            <div className="smart-installer-badge-sparkle">
              <Sparkles size={14} className="text-amber-400" />
            </div>
          </div>

          <h3 className="smart-installer-title">
            تثبيت منصة كودلينجو 📲
          </h3>
          <p className="smart-installer-subtitle">
            ثبّت التطبيق على شاشة هاتفك الرئيسية لتجربة سريعة بدون شريط المتصفح
          </p>
        </div>

        {/* ألسنة التبديل بين الأجهزة: أندرويد vs آيفون vs كمبيوتر */}
        <div className="smart-installer-tabs-nav">
          <button
            type="button"
            className={`smart-tab-btn ${deviceTab === 'android' ? 'active' : ''}`}
            onClick={() => {
              setDeviceTab('android');
              playSound.click();
            }}
          >
            <Smartphone size={16} />
            <span>أندرويد 🤖</span>
          </button>

          <button
            type="button"
            className={`smart-tab-btn ${deviceTab === 'ios' ? 'active' : ''}`}
            onClick={() => {
              setDeviceTab('ios');
              playSound.click();
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.62-.75 1.04-1.8 0.93-2.84-.9.04-1.99.6-2.64 1.35-.58.65-1.09 1.72-.95 2.74 1 .08 2.03-.51 2.66-1.25z"/>
            </svg>
            <span>آيفون 🍏</span>
          </button>

          <button
            type="button"
            className={`smart-tab-btn ${deviceTab === 'desktop' ? 'active' : ''}`}
            onClick={() => {
              setDeviceTab('desktop');
              playSound.click();
            }}
          >
            <Monitor size={16} />
            <span>كمبيوتر 💻</span>
          </button>
        </div>

        {/* =========================================================================
            محتوى التثبيت لأجهزة أندرويد (شاومي • فيفو • سامسونج • أوبو • ريلمي)
            ========================================================================= */}
        {deviceTab === 'android' && (
          <div className="smart-installer-panel">
            {promptEvent && !nativeInstallSuccess && (
              <div className="smart-native-prompt-card">
                <button
                  type="button"
                  className="duo-btn duo-btn-success smart-main-install-btn"
                  onClick={handleNativePrompt}
                >
                  <Download size={18} />
                  <span>تثبيت فوري على شاشة الهاتف الآن 🚀</span>
                </button>
                <span className="smart-hint-text">
                  ⚡ مدعوم بضغطة واحدة على هذا المتصفح
                </span>
              </div>
            )}

            {nativeInstallSuccess && (
              <div className="smart-success-box">
                🎉 تم إرسال طلب التثبيت بنجاح! ستجد التطبيق على شاشة هاتفك الرئيسية.
              </div>
            )}

            {/* الدليل المصور الشامل لهواتف شاومي وفيفو وكل أجهزة أندرويد */}
            <div className="smart-steps-container">
              <div className="smart-step-item">
                <div className="smart-step-num">1</div>
                <div className="smart-step-info">
                  <strong>اضغط على قائمة المتصفح</strong>
                  <span>اضغط على الـ 3 نقاط <MoreVertical size={14} className="inline text-indigo-400" /> في أعلى أو أسفل المتصفح.</span>
                </div>
              </div>

              <div className="smart-step-item">
                <div className="smart-step-num">2</div>
                <div className="smart-step-info">
                  <strong>اختر "تثبيت التطبيق" أو "إضافة للشاشة الرئيسية"</strong>
                  <span>اضغط على خيار <PlusSquare size={14} className="inline text-emerald-400" /> <b>تثبيت التطبيق</b> (Add to Home screen).</span>
                </div>
              </div>

              <div className="smart-step-item">
                <div className="smart-step-num">3</div>
                <div className="smart-step-info">
                  <strong>تأكيد التثبيت</strong>
                  <span>اضغط <b>"تثبيت"</b> وسينزل التطبيق فوراً على شاشتك مثل أي تطبيق عادي!</span>
                </div>
              </div>
            </div>

            {/* تنبيه خاص لهواتف شاومي وفيفو */}
            <div className="smart-xiaomi-vivo-notice">
              <AlertCircle size={16} className="text-amber-400 flex-shrink-0" />
              <span>
                <b>لهواتف شاومي وفيفو:</b> يفضل فتح المنصة في متصفح <b>Google Chrome</b> لضمان ظهور خيار التثبيت مباشرة بدون أذونات المتصفحات المعقدة.
              </span>
            </div>

            <button
              type="button"
              className="smart-copy-link-btn"
              onClick={handleCopyLink}
            >
              {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              <span>{copied ? 'تم نسخ الرابط بنجاح! افتحه في Google Chrome 📋' : 'نسخ رابط المنصة لفتحه في Google Chrome 📋'}</span>
            </button>
          </div>
        )}

        {/* =========================================================================
            محتوى التثبيت لأجهزة آيفون (iPhone & iPad - iOS)
            ========================================================================= */}
        {deviceTab === 'ios' && (
          <div className="smart-installer-panel">
            <div className="smart-steps-container">
              <div className="smart-step-item">
                <div className="smart-step-num">1</div>
                <div className="smart-step-info">
                  <strong>افتح الرابط في متصفح Safari</strong>
                  <span>تأكد من فتح المنصة عبر متصفح <b>Safari</b> الأصلي للآيفون.</span>
                </div>
              </div>

              <div className="smart-step-item">
                <div className="smart-step-num">2</div>
                <div className="smart-step-info">
                  <strong>اضغط على زر المشاركة (Share)</strong>
                  <span>اضغط على أيقونة المربع بسهم لأعلى <Share size={15} className="inline text-blue-400" /> في الشريط السفلي لشاشة الآيفون.</span>
                </div>
              </div>

              <div className="smart-step-item">
                <div className="smart-step-num">3</div>
                <div className="smart-step-info">
                  <strong>إضافة إلى الصفحة الرئيسية</strong>
                  <span>مرر القائمة لأسفل واختر <PlusSquare size={15} className="inline text-emerald-400" /> <b>إضافة إلى الصفحة الرئيسية</b> (Add to Home Screen).</span>
                </div>
              </div>

              <div className="smart-step-item">
                <div className="smart-step-num">4</div>
                <div className="smart-step-info">
                  <strong>اضغط على كلمة "إضافة" (Add)</strong>
                  <span>في أعلى يمين الشاشة اضغط <b>إضافة</b>، وستظهر أيقونة المنصة على شاشة هاتفك فوراً!</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="smart-copy-link-btn"
              onClick={handleCopyLink}
            >
              {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              <span>{copied ? 'تم نسخ الرابط! افتحه في Safari 📋' : 'نسخ الرابط لفتحه في متصفح Safari 📋'}</span>
            </button>
          </div>
        )}

        {/* =========================================================================
            محتوى التثبيت لأجهزة الكمبيوتر (Windows / Mac)
            ========================================================================= */}
        {deviceTab === 'desktop' && (
          <div className="smart-installer-panel">
            <div className="smart-steps-container">
              <div className="smart-step-item">
                <div className="smart-step-num">1</div>
                <div className="smart-step-info">
                  <strong>أيقونة التثبيت في شريط العنوان</strong>
                  <span>في متصفح Google Chrome أو Edge، انظر إلى أقصى يمين شريط الرابط (العنوان) في الأعلى.</span>
                </div>
              </div>

              <div className="smart-step-item">
                <div className="smart-step-num">2</div>
                <div className="smart-step-info">
                  <strong>اضغط على أيقونة التثبيت (⊕)</strong>
                  <span>اضغط على أيقونة الشاشة أو علامة <b>تثبيت التطبيق</b>.</span>
                </div>
              </div>

              <div className="smart-step-item">
                <div className="smart-step-num">3</div>
                <div className="smart-step-info">
                  <strong>تأكيد التثبيت</strong>
                  <span>اضغط <b>"تثبيت"</b>، وستعمل المنصة كنافذة برنامج مستقلة على سطح المكتب مباشرة!</span>
                </div>
              </div>
            </div>

            {promptEvent && (
              <button
                type="button"
                className="duo-btn duo-btn-primary smart-main-install-btn mt-3"
                onClick={handleNativePrompt}
              >
                <Download size={18} />
                <span>تثبيت المنصة على الكمبيوتر الآن 💻</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
