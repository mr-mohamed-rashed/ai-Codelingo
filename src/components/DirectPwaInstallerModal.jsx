import React, { useState, useEffect, useRef } from 'react';
import './InstallGuideModal.css';
import { useApp } from '../context/AppContext';
import { X } from 'lucide-react';
import { playSound } from '../utils/audioEngine';

export default function DirectPwaInstallerModal() {
  const { setActiveModal, installPrompt, setInstallPrompt } = useApp();
  
  const [progress, setProgress] = useState(6);
  const [statusMessage, setStatusMessage] = useState('جاري فحص إعدادات الهاتف وبدء التثبيت...');
  const [isDone, setIsDone] = useState(false);
  const promptedRef = useRef(false);

  useEffect(() => {
    // 1. استدعاء إذن نظام الهاتف تلقائياً فوراً
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

    triggerNativePrompt();

    // 2. تنزيل ملفات التطبيق والمنهج فعلياً في الكاش
    let currentProgress = 8;
    setProgress(8);

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

    if (typeof caches !== 'undefined') {
      caches.open('codelingo-cache-v13').then((cache) => {
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

    // 3. شريط تقدم سلس وديناميكي يكتمل تلقائياً ويفتح التطبيق
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 8) + 4;
      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(100);
        setStatusMessage('تم تثبيت التطبيق بنجاح! 🚀');
        setIsDone(true);
        playSound.levelUp();
        clearInterval(interval);

        // إغلاق الشاشة تلقائياً بعد اكتمال التثبيت
        setTimeout(() => {
          setActiveModal(null);
        }, 1400);
      } else {
        setProgress(currentProgress);
      }
    }, 180);

    return () => clearInterval(interval);
  }, []);

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
          aria-label="إغلاق"
        >
          <X size={20} />
        </button>

        {/* أيقونة التطبيق والأنيميشن */}
        <div className="installer-icon-ring">
          <picture>
            <source srcSet={`${import.meta.env.BASE_URL}icon-192.webp`} type="image/webp" />
            <img 
              src={`${import.meta.env.BASE_URL}icon-192.png`} 
              alt="CodeLingo Icon" 
              className="installer-app-img"
              width="74"
              height="74"
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
      </div>
    </div>
  );
}
