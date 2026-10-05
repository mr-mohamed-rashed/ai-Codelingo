import React, { useState, lazy, Suspense } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LeaderboardPodium } from './components/LeaderboardPodium';
import { Footer } from './components/Footer';
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
  Settings,
  ShieldAlert
} from 'lucide-react';
import { playSound } from './utils/audioEngine';

// التحميل الكسول الموجه للأداء العالي (Lazy loading for high performance)
const DuolingoPath = lazy(() => import('./components/DuolingoPath').then(m => ({ default: m.DuolingoPath })));
const TeacherDashboard = lazy(() => import('./components/TeacherDashboard'));
const QuizEngine = lazy(() => import('./components/QuizEngine'));
const AuthModal = lazy(() => import('./components/AuthModal'));
const MicroLessonModal = lazy(() => import('./components/MicroLessonModal').then(m => ({ default: m.MicroLessonModal })));
const AITutorModal = lazy(() => import('./components/AITutorModal').then(m => ({ default: m.AITutorModal })));
const ApprovalNoticeModal = lazy(() => import('./components/ApprovalNoticeModal'));
const TeacherLoginModal = lazy(() => import('./components/TeacherLoginModal'));
const PrivacyPolicyModal = lazy(() => import('./components/PrivacyPolicyModal'));
const TermsOfUseModal = lazy(() => import('./components/TermsOfUseModal'));
const InstallGuideModal = lazy(() => import('./components/InstallGuideModal'));

class DashboardErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Dashboard error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="teacher-dashboard-overlay flex items-center justify-center p-6 text-center" style={{ minHeight: '80vh' }}>
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-2xl max-w-lg border border-red-200 dark:border-red-900/50">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-950/60 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 dark:text-red-400">
              <ShieldAlert size={36} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
              تنبيه في لوحة التحكم
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              حدث خطأ غير متوقع أثناء تحميل لوحة التحكم. يمكنك العودة للمنصة أو إعادة المحاولة بأمان.
            </p>
            {this.state.error?.message && (
              <div className="bg-red-50 dark:bg-red-950/40 p-2.5 rounded-lg mb-4 text-xs font-mono text-red-600 dark:text-red-300 overflow-x-auto text-left" dir="ltr">
                {this.state.error.message}
              </div>
            )}
            <div className="flex gap-3 justify-center">
              <button
                className="duo-btn duo-btn-primary py-2 px-5"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  if (this.props.onReset) this.props.onReset();
                }}
              >
                العودة للرئيسية 🏠
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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
    t,
    canInstall,
    isStandalone,
    installApp
  } = useApp();

  const [dismissPwaBanner, setDismissPwaBanner] = React.useState(false);

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
          src={`${import.meta.env.BASE_URL}icon-512.png`} 
          alt="" 
          width="512"
          height="512"
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          className="platform-watermark-img" 
        />
      </div>

      {/* الشريط العلوي المشترك HUD */}
      <Navbar />

      {/* إذا كان في وضع لوحة تحكم الأستاذ */}
      {isTeacherMode ? (
        <DashboardErrorBoundary onReset={() => setIsTeacherMode(false)}>
          <Suspense fallback={
            <div className="lazy-suspense-container">
              <div className="lazy-suspense-spinner" />
              <span className="lazy-suspense-text">جاري تحميل لوحة المعلم...</span>
            </div>
          }>
            <TeacherDashboard />
          </Suspense>
        </DashboardErrorBoundary>
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
            <Suspense fallback={
              <div className="lazy-suspense-container">
                <div className="lazy-suspense-spinner" />
                <span className="lazy-suspense-text">جاري تحميل مسار المنهج...</span>
              </div>
            }>
              <DuolingoPath />
            </Suspense>
          </section>

          {/* تذييل الصفحة التفاعلي للأستاذ محمد راشد */}
          <Footer />
        </main>
      )}

      {/* النوافذ المنبثقة التفاعلية */}
      <Suspense fallback={
        <div className="modal-suspense-fallback">
          <div className="lazy-suspense-spinner" />
        </div>
      }>
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
        {activeModal === 'pwa_install_guide' && <InstallGuideModal />}
      </Suspense>

      {/* شريط دعوة تثبيت المنصة كتطبيق على الموبايل */}
      {canInstall && !isStandalone && !dismissPwaBanner && (
        <aside className="mobile-pwa-bottom-bar" aria-label="تثبيت التطبيق">
          <div className="mobile-pwa-content">
            <div className="mobile-pwa-badge">
              <img src={`${import.meta.env.BASE_URL}icon-192.png`} alt="App Icon" className="mobile-pwa-img" />
            </div>
            <div className="mobile-pwa-text">
              <strong className="mobile-pwa-title">تطبيق كودلينجو الرسمي 📲</strong>
              <span className="mobile-pwa-sub">ثبّته لشاشتك الرئيسية لوصول أسرع</span>
            </div>
          </div>
          <div className="mobile-pwa-actions">
            <button 
              type="button" 
              className="duo-btn duo-btn-success mobile-pwa-btn"
              onClick={installApp}
            >
              تثبيت
            </button>
            <button 
              type="button" 
              className="mobile-pwa-close-btn"
              onClick={() => setDismissPwaBanner(true)}
              title="إغلاق"
            >
              ✕
            </button>
          </div>
        </aside>
      )}
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
