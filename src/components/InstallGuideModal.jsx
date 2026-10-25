import React, { useState, useEffect, useRef } from 'react';
import './InstallGuideModal.css';
import { useApp } from '../context/AppContext';
import { 
  X, 
  CheckCircle, 
  DownloadCloud, 
  Smartphone, 
  Copy, 
  Check, 
  AlertTriangle,
  ArrowUpRight,
  Share2
} from 'lucide-react';
import { playSound } from '../utils/audioEngine';

export default function InstallGuideModal() {
  const { setActiveModal, lang, installPrompt, setInstallPrompt } = useApp();
  
  const [installedSuccessfully, setInstalledSuccessfully] = useState(false);
  const [hasPrompt, setHasPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [copied, setCopied] = useState(false);
  const [promptAttempted, setPromptAttempted] = useState(false);

  useEffect(() => {
    // 1. كشف نوع الجهاز والمتصفح
    if (typeof navigator !== 'undefined') {
      const ua = navigator.userAgent || '';
      const iosDevice = /iPhone|iPad|iPod/i.test(ua);
      const inApp = /FBAV|FBAN|Instagram|WhatsApp|Line|Snapchat|Telegram/i.test(ua);
      setIsIOS(iosDevice);
      setIsInAppBrowser(inApp);
    }

    // 2. التحقق من توفر أمر التثبيت الرسمي من كروم
    const promptEvent = installPrompt || (typeof window !== 'undefined' ? window.__codelingo_install_prompt : null);
    if (promptEvent) {
      setHasPrompt(true);
      // تشغيل نافذة إذن النظام فوراً
      try {
        promptEvent.prompt();
        setPromptAttempted(true);
        promptEvent.userChoice.then((choiceResult) => {
          if (choiceResult && choiceResult.outcome === 'accepted') {
            setInstalledSuccessfully(true);
            playSound.levelUp();
            if (setInstallPrompt) setInstallPrompt(null);
            if (typeof window !== 'undefined') window.__codelingo_install_prompt = null;
          }
        }).catch(() => {});
      } catch (err) {
        console.log('Prompt execution error:', err);
      }
    }

    // 3. الاستماع لحدث تثبيت التطبيق الفعلي من نظام التشغيل
    const handleAppInstalled = () => {
      setInstalledSuccessfully(true);
      playSound.levelUp();
      if (setInstallPrompt) setInstallPrompt(null);
      if (typeof window !== 'undefined') window.__codelingo_install_prompt = null;
    };

    window.addEventListener('appinstalled', handleAppInstalled);
    return () => window.removeEventListener('appinstalled', handleAppInstalled);
  }, [installPrompt]);

  const handleTriggerPrompt = async () => {
    playSound.click();
    const promptEvent = installPrompt || (typeof window !== 'undefined' ? window.__codelingo_install_prompt : null);
    if (promptEvent) {
      try {
        promptEvent.prompt();
        const { outcome } = await promptEvent.userChoice;
        if (outcome === 'accepted') {
          setInstalledSuccessfully(true);
          playSound.levelUp();
          if (setInstallPrompt) setInstallPrompt(null);
          if (typeof window !== 'undefined') window.__codelingo_install_prompt = null;
        }
      } catch (err) {
        console.log('Manual prompt error:', err);
      }
    }
  };

  const handleCopy = () => {
    try {
      const url = typeof window !== 'undefined' ? window.location.origin : 'https://ai-codelingo.vercel.app';
      navigator.clipboard.writeText(url);
      setCopied(true);
      playSound.click();
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
      <div 
        className="modal-card direct-pwa-installer-card" 
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

        {/* إذا تم التثبيت الفعلي على الهاتف بنجاح */}
        {installedSuccessfully ? (
          <div className="installer-success-view">
            <div className="success-icon-wrap">
              <CheckCircle size={48} className="text-emerald-500" />
            </div>
            <h3 className="installer-title text-emerald-400">تم التثبيت بنجاح على هاتفك! 🎉</h3>
            <p className="installer-desc">
              ستجد الآن أيقونة تطبيق كودلينجو الرسمية على شاشتك الرئيسية، اضغط عليها في أي وقت لبدء المذاكرة دون إنترنت.
            </p>
            <button
              type="button"
              className="duo-btn duo-btn-success w-full py-3 font-bold"
              onClick={() => setActiveModal(null)}
            >
              فتح المنصة والبدء 🚀
            </button>
          </div>
        ) : (
          <div className="installer-main-view">
            {/* الشعار */}
            <div className="installer-icon-ring">
              <picture>
                <source srcSet="/icon-192.webp" type="image/webp" />
                <img 
                  src="/icon-192.png" 
                  alt="CodeLingo Icon" 
                  className="installer-app-img"
                />
              </picture>
            </div>

            <h3 className="installer-title">تثبيت تطبيق كودلينجو 📲</h3>
            
            {/* إذا كان إذن التثبيت التلقائي متاحاً في المتصفح */}
            {hasPrompt && (
              <div className="prompt-action-area">
                <p className="installer-desc">
                  اضغط على الزر الأخضر بالأسفل لتأكيد إذن التثبيت من هاتفك:
                </p>
                <button
                  type="button"
                  className="duo-btn duo-btn-success w-full py-3.5 font-extrabold flex items-center justify-center gap-2 text-base mb-3"
                  onClick={handleTriggerPrompt}
                >
                  <DownloadCloud size={20} />
                  <span>تأكيد التثبيت على شاشة الهاتف 📲</span>
                </button>
              </div>
            )}

            {/* الحل المضمون 100% لجميع الأجهزة التي يمنع فيها النظام التثبيت التلقائي */}
            <div className="guaranteed-install-box">
              <div className="install-box-header">
                <span className="box-badge">الحل المضمون فوراً ⚡</span>
                <h4>إذا لم تظهر لك نافذة التثبيت تلقائياً:</h4>
              </div>

              {isIOS ? (
                /* خطوات هواتف آيفون */
                <div className="direct-os-step">
                  <div className="step-num">1</div>
                  <div className="step-content">
                    اضغط على زر المشاركة <strong>(Share ⎋)</strong> في أسفل متصفح Safari، ثم اختر <strong>"إضافة إلى الشاشة الرئيسية" (Add to Home Screen)</strong>.
                  </div>
                </div>
              ) : (
                /* خطوات هواتف أندرويد (كروم) */
                <div className="direct-os-step">
                  <div className="step-num">1</div>
                  <div className="step-content">
                    اضغط على <strong>الثلاث نقاط (⋮)</strong> في أعلى متصفح جوجل كروم ⬅️ ثم اختر <strong>"تثبيت التطبيق" (Install app)</strong> أو <strong>"إضافة إلى الشاشة الرئيسية"</strong>.
                  </div>
                </div>
              )}

              {/* تنبيه هواتف شاومي وريدمي وأوبو */}
              <div className="xiaomi-perm-notice">
                <AlertTriangle size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>لهواتف شاومي، ريدمي، وأوبو:</strong> تأكد من تفعيل إذن <em>(اختصارات الشاشة الرئيسية)</em> لمتصفح كروم من إعدادات الهاتف إذا لم تظهر الأيقونة.
                </span>
              </div>
            </div>

            {/* نسخ الرابط لفتحه في كروم مباشرة في حال كان داخل واتساب */}
            <div className="footer-actions-row">
              <button
                type="button"
                className="duo-btn duo-btn-secondary py-2.5 px-4 text-xs font-bold flex-1 flex items-center justify-center gap-1.5"
                onClick={handleCopy}
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copied ? 'تم نسخ الرابط! ✅' : 'نسخ رابط المنصة لكروم'}</span>
              </button>

              <button
                type="button"
                className="duo-btn duo-btn-primary py-2.5 px-5 text-xs font-bold"
                onClick={() => setActiveModal(null)}
              >
                إغلاق
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
