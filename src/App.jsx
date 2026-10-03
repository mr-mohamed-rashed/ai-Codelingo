import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { DuolingoPath } from './components/DuolingoPath';
import { LeaderboardPodium } from './components/LeaderboardPodium';
import { MicroLessonModal } from './components/MicroLessonModal';
import { AITutorModal } from './components/AITutorModal';
import QuizEngine from './components/QuizEngine';
import TeacherDashboard from './components/TeacherDashboard';
import AuthModal from './components/AuthModal';
import { Footer } from './components/Footer';
import TeacherLoginModal from './components/TeacherLoginModal';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import TermsOfUseModal from './components/TermsOfUseModal';
import { 
  ShieldCheck, 
  Clock, 
  GraduationCap,
  Trophy,
  Map,
  Sparkles,
  School,
  Lock,
  Phone,
  BookOpen,
  LogIn,
  Settings
} from 'lucide-react';
import { playSound } from './utils/audioEngine';

import ApprovalNoticeModal from './components/ApprovalNoticeModal';

function MainAppContent() {
  const { 
    isTeacherMode, 
    currentStudent, 
    isStudentLoggedIn,
    students = [],
    groups = [],
    activeModal, 
    setActiveModal,
    setIsTeacherMode,
    currentPage,
    setCurrentPage,
    lang,
    t
  } = useApp();

  // حساب المتصدر الحالي لعرض شريط تحفيزي
  const topChampion = students.filter(s => s.status === 'approved').sort((a, b) => (b.xp || 0) - (a.xp || 0))[0];

  // شرط أساسي: لا يمكن التواجد في صفحة المحتوى دون تسجيل دخول
  React.useEffect(() => {
    if (currentPage === 'content' && !isStudentLoggedIn) {
      setCurrentPage('home');
      setActiveModal('auth');
    }
  }, [currentPage, isStudentLoggedIn, setCurrentPage, setActiveModal]);

  return (
    <div className="app-layout">
      {/* بصمة اللوجو المائية الكبيرة الثابتة خلف المحتوى */}
      <div className="platform-watermark-bg" aria-hidden="true">
        <img 
          src="/app-logo.jpg" 
          alt="" 
          className="platform-watermark-img" 
        />
      </div>

      {/* الشريط العلوي المشترك HUD */}
      <Navbar />

      {/* إذا كان في وضع لوحة تحكم الأستاذ */}
      {isTeacherMode ? (
        <TeacherDashboard />
      ) : currentPage === 'home' ? (
        /* =========================================================
           الصفحة الرئيسية المستقلة (Standalone Home Page)
           تحتوي على التقديم ومدرج الأوائل وزر الإجراء الواضح
           ========================================================= */
        <main className="student-main-content home-standalone-page">
          {/* قسم بطاقة الهوية والترحيب التقديمية للمنصة */}
          <section className="home-hero-presentation">
            <div className="home-hero-content-wrap">
              <div className="home-hero-badge-wrap">
                <span className="home-hero-pill-tag">
                  <Sparkles size={15} className="text-amber-400" />
                  <span>{lang === 'ar' ? 'منهج البرمجة والذكاء الاصطناعي • ثانية بكالوريا' : 'AI & Programming Curriculum • 2nd Baccalaureate'}</span>
                </span>
              </div>

              <h1 className="home-hero-main-title">
                {lang === 'ar' ? (
                  <>منصة <span className="brand-highlight">كودلينجو</span> للبرمجة والذكاء الاصطناعي</>
                ) : (
                  <>Welcome to <span className="brand-highlight">CodeLingo</span> AI Platform</>
                )}
              </h1>

              <p className="home-hero-subtitle">
                {lang === 'ar' 
                  ? 'منظومة التعلم التفاعلية لطلاب الصف الثاني بكالوريا لإتقان مفاهيم الحوسبة والذكاء الاصطناعي والأمن السيبراني بأسلوب تفاعلي مشوق • إعداد وإشراف: الأستاذ / محمد راشد.'
                  : 'Interactive learning platform for 2nd Baccalaureate students to master AI, cybersecurity, and computing concepts • Supervised by Eng. Mohamed Rashed.'
                }
              </p>

              {/* زر الإجراء الرئيسي الواضح والوحيد (دون تكرار) */}
              <div className="home-hero-cta-group">
                {!isStudentLoggedIn ? (
                  <button 
                    className="duo-btn duo-btn-primary home-cta-primary-btn"
                    onClick={() => {
                      playSound.click();
                      setActiveModal('auth');
                    }}
                    id="btn-login-start"
                  >
                    <LogIn size={20} />
                    <span>{lang === 'ar' ? 'تسجيل الدخول لبدء المذاكرة 🔐' : 'Sign in to Start Learning 🔐'}</span>
                  </button>
                ) : (
                  <div className="home-student-portal-row">
                    <button 
                      className="duo-btn duo-btn-primary home-cta-primary-btn"
                      onClick={() => {
                        playSound.click();
                        setCurrentPage('content');
                      }}
                      id="btn-enter-content-page"
                    >
                      <BookOpen size={22} />
                      <span>{lang === 'ar' ? 'الدخول لمسار المنهج 📚' : 'Enter Curriculum 📚'}</span>
                    </button>

                    {/* كارت الطالب المتجاوب: تعديل الملف زرار صغير فوق، والترحيب بالاكسبرينس لوحده تحت */}
                    <div className="home-student-card">
                      <div className="student-card-top-action">
                        <button 
                          type="button"
                          className="student-card-edit-btn"
                          onClick={() => {
                            playSound.click();
                            setActiveModal('profile');
                          }}
                          title={lang === 'ar' ? 'اضغط لتعديل بياناتك وصورتك ورقم ولي الأمر' : 'Edit profile'}
                        >
                          <Settings size={13} className="text-emerald-400" />
                          <span>{lang === 'ar' ? 'تعديل الملف الشخصي' : 'Edit Profile'}</span>
                        </button>
                      </div>

                      <div className="student-card-welcome-row">
                        <img 
                          src={currentStudent?.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=Student'} 
                          alt={currentStudent?.name} 
                          className="student-card-avatar" 
                        />
                        <div className="student-card-greeting-info">
                          <span className="student-card-title">
                            {lang === 'ar' ? 'مرحباً بك يا بطل:' : 'Welcome Hero:'}
                          </span>
                          <span className="student-card-name-xp">
                            <strong className="student-hero-name">{currentStudent?.name}</strong>
                            <span className="student-hero-xp-chip">
                              <Sparkles size={12} className="text-amber-400" />
                              <span>({currentStudent?.xp || 0} XP)</span>
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* بطاقات المزايا الأكاديمية السريعة */}
              <div className="home-features-pills-row">
                <div className="home-feature-pill">
                  <span className="feature-pill-icon">📚</span>
                  <span>{lang === 'ar' ? '4 فصول دراسية معتمدة' : '4 Accredited Chapters'}</span>
                </div>
                <div className="home-feature-pill">
                  <span className="feature-pill-icon">💡</span>
                  <span>{lang === 'ar' ? '14 درساً تفاعلياً بأسلوب كودلينجو' : '14 Interactive Lessons'}</span>
                </div>
                <div className="home-feature-pill">
                  <span className="feature-pill-icon">🎯</span>
                  <span>{lang === 'ar' ? 'بنك أسئلة واختبارات شاملة' : 'Question Bank & Exams'}</span>
                </div>
                <div className="home-feature-pill">
                  <span className="feature-pill-icon">🤖</span>
                  <span>{lang === 'ar' ? 'معلم ذكاء اصطناعي فوري' : 'Instant AI Tutor'}</span>
                </div>
              </div>
            </div>
          </section>

          {/* مدرج الأوائل والمتصدرين الذهبي والفضى والبرونزي - المركز الرئيسي في الصفحة الرئيسية */}
          <section className="home-podium-section" id="section-champions-podium">
            <LeaderboardPodium />
          </section>

          {/* تذييل الصفحة التفاعلي للأستاذ محمد راشد */}
          <Footer />
        </main>
      ) : (
        /* =========================================================
           صفحة المحتوى المستقلة (Dedicated Content Page)
           تحتوي على مسار المنهج التفاعلي الملتوي والدروس
           ========================================================= */
        <main className="student-main-content content-standalone-page">
          {/* شريط علوي أنيق للتنقل والعودة للرئيسية */}
          <div className="content-page-topbar">
            <button 
              className="back-to-home-btn duo-btn duo-btn-secondary"
              onClick={() => {
                playSound.click();
                setCurrentPage('home');
              }}
              title={lang === 'ar' ? 'العودة للصفحة الرئيسية ومدرج الأوائل' : 'Back to Home & Podium'}
            >
              <Trophy size={16} className="text-amber-500" />
              <span>{lang === 'ar' ? 'العودة للرئيسية ومدرج الأوائل 🏆' : 'Back to Home & Podium 🏆'}</span>
            </button>

            <div className="content-page-title-badge">
              <BookOpen size={18} className="text-indigo-500" />
              <span className="font-bold">
                {lang === 'ar' ? 'مسار المنهج التفاعلي - الصف الثاني بكالوريا' : 'Interactive Curriculum Path - 2nd Baccalaureate'}
              </span>
            </div>
          </div>

          {/* مسار المنهج الملتوي (Duolingo Learning Path) */}
          <section className="duolingo-path-container">
            <DuolingoPath />
          </section>

          {/* تذييل الصفحة التفاعلي للأستاذ محمد راشد */}
          <Footer />
        </main>
      )}

      {/* النوافذ المنبثقة التفاعلية */}
      {activeModal === 'lesson' && <MicroLessonModal />}
      {activeModal === 'ai_tutor' && <AITutorModal />}
      {activeModal === 'quiz' && <QuizEngine />}
      {(activeModal === 'auth' || activeModal === 'profile') && (
        <AuthModal initialMode={activeModal === 'profile' ? 'profile' : 'login'} />
      )}
      {activeModal === 'approval_notice' && <ApprovalNoticeModal />}
      {activeModal === 'teacher_login' && <TeacherLoginModal />}
      {activeModal === 'privacy_policy' && <PrivacyPolicyModal />}
      {activeModal === 'terms_of_use' && <TermsOfUseModal />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
