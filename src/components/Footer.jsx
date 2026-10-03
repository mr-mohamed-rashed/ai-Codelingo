import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Scale, 
  Phone, 
  Sparkles,
  Lock,
  ArrowUpRight,
  MessageCircle
} from 'lucide-react';
import { playSound } from '../utils/audioEngine';

export const Footer = () => {
  const { setActiveModal, setIsTeacherMode, lang } = useApp();

  const handleOpenPrivacy = (e) => {
    e.preventDefault();
    playSound.click();
    setActiveModal('privacy_policy');
  };

  const handleOpenTerms = (e) => {
    e.preventDefault();
    playSound.click();
    setActiveModal('terms_of_use');
  };

  const handleOpenTeacherLogin = (e) => {
    e.preventDefault();
    playSound.click();
    setActiveModal('teacher_login');
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="student-footer modern-academic-footer">
      <div className="footer-top-grid">
        {/* العمود 1: التعريف بالمنصة التعليمية */}
        <div className="footer-col-brand">
          <h4 className="footer-col-heading">
            {lang === 'en' ? 'About Platform' : 'عن المنصة'}
          </h4>

          <div className="footer-brand-title-wrap">
            <div className="footer-avatar-badge" title="منصة البرمجة والذكاء الاصطناعي">
              <img 
                src="/app-logo.jpg" 
                alt="Logo" 
                className="footer-avatar-logo-img" 
              />
            </div>
            <div className="footer-brand-text">
              <h3 className="footer-platform-name">
                {lang === 'en' ? 'Interactive Curriculum Platform' : 'منصة المنهج التفاعلي'}
              </h3>
              <span className="footer-curriculum-tag">
                {lang === 'en' 
                  ? 'Programming & AI • 2nd Baccalaureate' 
                  : 'البرمجة والذكاء الاصطناعي • ثانية بكالوريا'
                }
              </span>
            </div>
          </div>

          {/* التعريف بالمنصة */}
          <p className="footer-bio-desc">
            {lang === 'en'
              ? 'An elite interactive curriculum platform combining bite-sized Codelingo-style micro-lessons, smart AI tutoring, spaced repetition quizzes, and strict 90% mastery threshold for ultimate exam success.'
              : 'منصة تفاعلية رائدة تجمع بين شرح الفقرات بأسلوب كودلينجو الممتع، المعلم الذكي التفاعلي، بنك الأسئلة المتدرجة، ومعيار إتقان 90% لضمان الدرجة النهائية والتفوق في الامتحانات.'
            }
          </p>
        </div>

        {/* العمود 2: كيو ار كود للمحادثة المباشرة */}
        <div className="footer-col-contact footer-col-qr">
          <h4 className="footer-col-heading">
            {lang === 'en' ? 'Direct Contact' : 'التواصل المباشر'}
          </h4>

          <div className="whatsapp-qr-container">
            <a 
              href="https://wa.me/201005144500" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="whatsapp-qr-card-link"
              title={lang === 'en' ? 'Click or scan to chat on WhatsApp' : 'امسح أو اضغط للمحادثة عبر واتساب'}
            >
              <div className="whatsapp-qr-image-frame">
                <img 
                  src="/whatsapp-qr.svg" 
                  alt="WhatsApp QR Code" 
                  className="whatsapp-qr-code-img" 
                />
              </div>

              <div className="whatsapp-qr-meta">
                <div className="whatsapp-brand-symbol-badge" title="واتساب WhatsApp">
                  <svg className="whatsapp-official-icon" viewBox="0 0 24 24" width="26" height="26">
                    <path fill="#25D366" d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.03C9.36 7.03 9.09 7.1 8.87 7.33C8.65 7.57 8.02 8.16 8.02 9.36C8.02 10.56 8.9 11.72 9.02 11.89C9.15 12.06 10.73 14.5 13.15 15.54C15.16 16.41 15.57 16.23 16.02 16.19C16.46 16.15 17.44 15.6 17.65 15.02C17.85 14.43 17.85 13.93 17.79 13.83C17.73 13.72 17.57 13.66 17.3 13.53C17.04 13.4 15.73 12.76 15.49 12.67C15.24 12.58 15.07 12.54 14.89 12.81C14.72 13.07 14.22 13.66 14.07 13.83C13.92 14.01 13.77 14.03 13.51 13.9C13.25 13.77 12.4 13.49 11.4 12.6C10.61 11.9 10.08 11.03 9.93 10.77C9.77 10.51 9.91 10.37 10.05 10.24C10.17 10.12 10.31 9.93 10.45 9.77C10.59 9.6 10.63 9.48 10.72 9.31C10.81 9.13 10.77 8.98 10.7 8.85C10.64 8.72 10.14 7.5 9.93 7C9.73 6.51 9.52 6.58 9.36 6.57L8.87 6.57C8.87 6.57 9.53 7.03 9.53 7.03Z"/>
                  </svg>
                  <span className="whatsapp-badge-label">{lang === 'en' ? 'WhatsApp' : 'واتساب'}</span>
                </div>

                <p className="whatsapp-scan-hint">
                  {lang === 'en' ? 'Scan or click to chat directly' : 'امسح الباركود أو اضغط للدردشة المباشرة'}
                </p>
              </div>
            </a>
          </div>
        </div>

        {/* العمود 3: السياسات والشروط */}
        <div className="footer-col-links">
          <h4 className="footer-col-heading">
            {lang === 'en' ? 'Legal Policies' : 'السياسات والشروط'}
          </h4>

          <div className="footer-actions-stack">
            {/* رابط سياسة الخصوصية */}
            <button 
              className="footer-nav-btn"
              onClick={handleOpenPrivacy}
            >
              <div className="footer-nav-btn-content">
                <span className="footer-nav-icon-box icon-privacy">
                  <ShieldCheck size={16} />
                </span>
                <span className="footer-nav-text">{lang === 'en' ? 'Privacy Policy' : 'سياسة الخصوصية'}</span>
              </div>
              <ArrowUpRight size={15} className="footer-nav-arrow" />
            </button>

            {/* رابط شروط الاستخدام */}
            <button 
              className="footer-nav-btn"
              onClick={handleOpenTerms}
            >
              <div className="footer-nav-btn-content">
                <span className="footer-nav-icon-box icon-terms">
                  <Scale size={16} />
                </span>
                <span className="footer-nav-text">{lang === 'en' ? 'Terms of Use' : 'شروط الاستخدام'}</span>
              </div>
              <ArrowUpRight size={15} className="footer-nav-arrow" />
            </button>
          </div>
        </div>
      </div>

      {/* شريط حقوق الملكية السفلي */}
      <div className="footer-bottom-bar">
        <div className="footer-bottom-inner">
          <div className="footer-copyright-wrap">
            <p className="copyright-text">
              {lang === 'en' 
                ? `All Rights Reserved © ${currentYear}` 
                : `جميع الحقوق محفوظة © ${currentYear}`
              }
            </p>
            {/* الشارة المميزة لإعداد وتدريس أ. محمد راشد */}
            <div className="footer-teacher-signature">
              <Sparkles size={14} className="text-amber-400" />
              <span>{lang === 'en' ? 'Curriculum Author: Mr. Mohamed Rashed' : 'إعداد وتدريس: أ. محمد راشد'}</span>
            </div>
          </div>

          {/* زر القفل وكلمة ادمن في مكان رقم التليفون والايميل */}
          <div className="footer-bottom-admin-zone">
            <button 
              className="btn-teacher-bottom-lock"
              onClick={handleOpenTeacherLogin}
              title={lang === 'en' ? 'Admin Panel' : 'لوحة تحكم الأدمن'}
              aria-label="تسجيل دخول الأدمن"
            >
              <Lock size={15} />
            </button>
            <span 
              className="footer-bottom-admin-text"
              onClick={handleOpenTeacherLogin}
            >
              {lang === 'en' ? 'Admin' : 'ادمن'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
