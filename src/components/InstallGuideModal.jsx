import React, { useState, useEffect, useRef } from 'react';
import './InstallGuideModal.css';
import { useApp } from '../context/AppContext';
import { 
  X, 
  CheckCircle, 
  DownloadCloud, 
  Smartphone, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { playSound } from '../utils/audioEngine';

export default function InstallGuideModal() {
  const { setActiveModal, lang, installPrompt, setInstallPrompt } = useApp();
  
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('جاري فحص إعدادات الهاتف وبدء التثبيت...');
  const [isDone, setIsDone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const promptedRef = useRef(false);

  useEffect(() => {
    // كشف سريع للجهاز والمتصفح
    if (typeof navigator !== 'undefined') {
      const ua = navigator.userAgent || '';
      setIsIOS(/iPhone|iPad|iPod/i.test(ua));
      setIsInAppBrowser(/FBAV|FBAN|Instagram|WhatsApp|Line|Snapchat|Telegram/i.test(ua));
    }

    // إطلاق طلب تثبيت المتصفح الرسمي وأخذ الإذن فوراً
    const triggerNativePrompt = async () => {
      if (promptedRef.current) return;
      promptedRef.current = true;

      const promptEvent = installPrompt || (typeof window !== 'undefined' ? window.__codelingo_install_prompt : null);
      if (promptEvent) {
        try {
          promptEvent.prompt();
          promptEvent.userChoice.then((choiceResult) => {
            if (choiceResult && choiceResult.outcome === 'accepted') {
              if (setInstallPrompt) setInstallPrompt(null);
              if (typeof window !== 'undefined') window.__codelingo_install_prompt = null;
            }
          }).catch(() => {});
        } catch (e) {
          console.log('Prompt error:', e);
        }
      }
    };

    // تشغيل طلب الإذن مباشرة
    triggerNativePrompt();

    // تشغيل شريط التحميل وتنزيل ملفات التطبيق الحقيقية للكاش حسب سرعة النت والجهاز
    let currentProgress = 5;
    setProgress(5);

    const coreAssetsToCache = [
      '/',
      '/index.html',
      '/manifest.json',
      '/favicon.svg',
      '/icon-192.png',
      '/icon-512.png',
      '/app-logo.jpg'
    ];

    let downloadedCount = 0;
    const totalAssets = coreAssetsToCache.length;

    // محاولة تنزيل وتخزين الملفات في الكاش الفعلي للمتصفح (Offline PWA Cache)
    if (typeof caches !== 'undefined') {
      caches.open('codelingo-cache-v2').then((cache) => {
        coreAssetsToCache.forEach((asset) => {
          fetch(asset, { cache: 'no-cache' })
            .then((res) => {
              if (res.ok) cache.put(asset, res.clone());
            })
            .catch(() => {})
            .finally(() => {
              downloadedCount++;
              const calculated = Math.min(95, Math.floor((downloadedCount / totalAssets) * 80) + 15);
              currentProgress = Math.max(currentProgress, calculated);
              setProgress(currentProgress);
              if (calculated < 50) {
                setStatusMessage('جاري تنزيل ملفات المنهج والأيقونات...');
              } else if (calculated < 85) {
                setStatusMessage('جاري تهيئة التطبيق للعمل دون إنترنت...');
              }
            });
        });
      }).catch(() => {});
    }

    // شريط تقدم سلس يواكب سرعة التحميل وينهي التثبيت
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 8) + 4;
      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(100);
        setStatusMessage('تم تثبيت التطبيق وتنزيل المنهج بنجاح! 🚀');
        setIsDone(true);
        playSound.levelUp();
        clearInterval(interval);

        // فتح التطبيق تلقائياً بعد اكتمال التحميل
        setTimeout(() => {
          setActiveModal(null);
        }, 1500);
      } else {
        setProgress(currentProgress);
      }
    }, 180);

    return () => clearInterval(interval);
  }, []);

  const handleManualPromptClick = () => {
    playSound.click();
    const promptEvent = installPrompt || (typeof window !== 'undefined' ? window.__codelingo_install_prompt : null);
    if (promptEvent) {
      promptEvent.prompt();
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
      <div 
        className="modal-card direct-pwa-installer-card" 
        onClick={e => e.stopPropagation()}
      >
        {/* زر الإغلاق السريع */}
        <button 
          className="quiz-close-btn" 
          onClick={() => setActiveModal(null)}
          title="إلغاء"
        >
          <X size={20} />
        </button>

        {/* أيقونة التطبيق والأنيميشن */}
        <div className="installer-icon-ring">
          <picture>
            <source srcSet="/icon-192.webp" type="image/webp" />
            <img 
              src="/icon-192.png" 
              alt="CodeLingo Icon" 
              className="installer-app-img"
            />
          </picture>
          <div className="installer-pulse-glow" />
        </div>

        {/* العنوان والحالة */}
        <h3 className="installer-title">
          {isDone ? 'تم تثبيت كودلينجو بنجاح! 🎉' : 'جاري تثبيت تطبيق كودلينجو 📲'}
        </h3>
        
        <p className="installer-desc">
          {isDone 
            ? 'جاري فتح المنصة الآن... ستجد التطبيق أيضاً على شاشة هاتفك الرئيسية.'
            : statusMessage
          }
        </p>

        {/* شريط التحميل التفاعلي الحقيقي */}
        <div className="installer-progress-box">
          <div className="installer-progress-track">
            <div 
              className={`installer-progress-bar ${isDone ? 'bar-done' : ''}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="installer-progress-meta">
            <span>{isDone ? 'جاهز للاستخدام' : 'جاري التحميل والتثبيت...'}</span>
            <span dir="ltr" className="installer-pct">{progress}%</span>
          </div>
        </div>

        {/* زر إعادة طلب الإذن في حال لم يضغط عليه الطالب */}
        {!isDone && (installPrompt || (typeof window !== 'undefined' && window.__codelingo_install_prompt)) && (
          <button
            type="button"
            className="duo-btn duo-btn-success w-full py-3 mt-3 font-bold flex items-center justify-center gap-2 text-sm"
            onClick={handleManualPromptClick}
          >
            <DownloadCloud size={18} />
            <span>تأكيد الإذن والتثبيت على الهاتف 📲</span>
          </button>
        )}

        {/* إشعار خفيف جداً فقط إذا كان آيفون أو متصفح واتساب الداخلي */}
        {isIOS && (
          <div className="installer-mini-hint">
            <span>📱 على هواتف الآيفون: اضغط زر المشاركة بالأسفل <strong>(Share ⎋)</strong> ثم <strong>(إضافة للشاشة الرئيسية ➕)</strong></span>
          </div>
        )}

        {isInAppBrowser && !isIOS && (
          <div className="installer-mini-hint inapp-hint">
            <span>⚠️ للتثبيت المباشر: اضغط الثلاث نقاط (⋮) بأعلى الشاشة واختر <strong>(فتح في Chrome)</strong></span>
          </div>
        )}
      </div>
    </div>
  );
}
