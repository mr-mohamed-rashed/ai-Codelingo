import React from 'react';
import { useApp } from '../context/AppContext';
import { Flame, Star, Zap, Trophy, Shield, BookOpen, Sun, Moon, Globe, Smartphone, LogIn, LogOut } from 'lucide-react';
import { playSound } from '../utils/audioEngine';

export const Navbar = () => {
  const {
    currentStudent,
    isStudentLoggedIn,
    logoutStudent,
    isTeacherMode,
    setIsTeacherMode,
    pendingStudentsCount,
    setActiveModal,
    theme,
    toggleTheme,
    lang,
    toggleLang,
    t,
    canInstall,
    installApp,
    currentPage,
    setCurrentPage
  } = useApp();

  const handleAuthAction = () => {
    playSound.click();
    if (isTeacherMode) {
      setIsTeacherMode(false);
    } else if (isStudentLoggedIn) {
      logoutStudent();
    } else {
      setActiveModal('auth_login');
    }
  };

  return (
    <header className="app-navbar">
      {/* Brand & Title */}
      <div 
        className="brand-section cursor-pointer"
        onClick={() => {
          playSound.click();
          if (isTeacherMode) setIsTeacherMode(false);
          setCurrentPage('home');
        }}
        title="الانتقال للصفحة الرئيسية ومدرج الأوائل"
      >
        <div className="brand-logo-badge">
          <picture>
            <source srcSet={`${import.meta.env.BASE_URL}icon-192.webp`} type="image/webp" />
            <img 
              src={`${import.meta.env.BASE_URL}icon-192.png`} 
              width="44" 
              height="44" 
              alt="شعار منصة كودلينجو" 
              className="brand-logo-img" 
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </picture>
        </div>
        <div className="brand-title-wrap">
          <div className="brand-title-heading">{t('appTitle')}</div>
          <span className="brand-subtitle">{t('appSubtitle')}</span>
        </div>
      </div>

      {/* روابط التنقل الرئيسية بين: الصفحة الرئيسية | صفحة المحتوى */}
      {!isTeacherMode && (
        <nav className="nav-main-pages-links">
          <button 
            className={`nav-page-tab-btn ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => {
              playSound.click();
              setCurrentPage('home');
            }}
            title={lang === 'ar' ? 'الصفحة الرئيسية ومدرج الأوائل' : 'Home Page & Podium'}
          >
            <Trophy size={16} className="text-amber-400" />
            <span>{lang === 'ar' ? 'الرئيسية 🏆' : 'Home 🏆'}</span>
          </button>
          
          <button 
            className={`nav-page-tab-btn ${currentPage === 'content' ? 'active' : ''}`}
            onClick={() => {
              playSound.click();
              if (!isStudentLoggedIn) {
                setActiveModal('auth');
              } else {
                setCurrentPage('content');
              }
            }}
            title={lang === 'ar' ? 'صفحة المحتوى ومسار الدروس' : 'Curriculum & Content Page'}
          >
            <BookOpen size={16} className="text-indigo-400" />
            <span>{lang === 'ar' ? 'صفحة المحتوى 📚' : 'Content 📚'}</span>
          </button>
        </nav>
      )}

      {/* Center & Stats (Student HUD) */}
      {!isTeacherMode && currentStudent && (
        <div className="hud-stats-group">
          <div className="hud-stat-chip stat-streak" title={lang === 'ar' ? "أيام التفاعل المتتالية" : "Days Streak"}>
            <Flame size={18} fill="#f97316" />
            <span>{currentStudent.streak} {t('daysStreak')}</span>
          </div>

          <div className="hud-stat-chip stat-stars" title={lang === 'ar' ? "مجموع النجوم المكتسبة" : "Stars Earned"}>
            <Star size={18} fill="#fbbf24" />
            <span>{currentStudent.stars}</span>
          </div>

          <div className="hud-stat-chip stat-trophies" title={lang === 'ar' ? "كؤوس إتقان الدروس" : "Lesson Mastery Trophies"}>
            <Trophy size={18} fill="#f59e0b" color="#d97706" />
            <span>{currentStudent.trophies?.length || 0} {t('trophies')}</span>
          </div>

          <div className="hud-stat-chip stat-xp" title={lang === 'ar' ? "نقاط الخبرة XP" : "XP Points"}>
            <Zap size={18} fill="#818cf8" />
            <span>{currentStudent.xp} {t('xpPoints')}</span>
          </div>
        </div>
      )}

      {/* Right Controls: Unified Utilities Capsule, Teacher Button & Profile */}
      <div className="navbar-controls-group">
        {/* Segmented Utility Capsule (Theme, Lang, PWA) */}
        <div className="nav-utilities-capsule">
          {/* PWA Install Button */}
          {canInstall && (
            <button
              className="nav-capsule-btn btn-pwa"
              onClick={installApp}
              title={t('installAppDesc')}
            >
              <Smartphone size={15} />
              <span className="capsule-label">{t('installApp')}</span>
            </button>
          )}

          {/* Theme Toggle (Light / Dark) */}
          <button
            className="nav-capsule-btn btn-theme"
            onClick={toggleTheme}
            title={theme === 'dark' ? t('lightMode') : t('darkMode')}
          >
            {theme === 'dark' ? (
              <>
                <Sun size={15} className="capsule-icon text-amber-400" />
                <span className="capsule-label">{lang === 'ar' ? 'لايت' : 'Light'}</span>
              </>
            ) : (
              <>
                <Moon size={15} className="capsule-icon text-indigo-400" />
                <span className="capsule-label">{lang === 'ar' ? 'ليلي' : 'Dark'}</span>
              </>
            )}
          </button>

          <div className="capsule-divider" />

          {/* Language Toggle (Arabic / English) */}
          <button
            className="nav-capsule-btn btn-lang"
            onClick={toggleLang}
            title="Switch Language / تغيير اللغة"
          >
            <Globe size={15} className="capsule-icon text-cyan-400" />
            <span className="capsule-lang-tag">{lang === 'ar' ? 'EN' : 'عربي'}</span>
          </button>
        </div>

        {/* زر تسجيل الدخول أو تسجيل الخروج للطلاب */}
        {isTeacherMode ? (
          <button 
            className="btn-nav-auth btn-nav-back"
            onClick={handleAuthAction}
            title={t('backToMap')}
          >
            <BookOpen size={16} />
            <span className="btn-nav-auth-text">{t('backToMap')}</span>
          </button>
        ) : isStudentLoggedIn ? (
          <button 
            className="btn-nav-auth btn-nav-logout"
            onClick={handleAuthAction}
            title={t('signOut')}
          >
            <LogOut size={16} />
            <span className="btn-nav-auth-text">{t('signOut')}</span>
          </button>
        ) : (
          <button 
            className="btn-nav-auth btn-nav-login"
            onClick={handleAuthAction}
            title={t('signIn')}
          >
            <LogIn size={16} />
            <span className="btn-nav-auth-text">{t('signIn')}</span>
          </button>
        )}

        {/* Student Profile Trigger */}
        {!isTeacherMode && currentStudent && (
          <div 
            className="user-profile-trigger"
            onClick={() => {
              playSound.click();
              setActiveModal('profile');
            }}
            title={currentStudent.name}
          >
            <div className="avatar-ring-wrap">
              <img 
                src={currentStudent.avatar} 
                alt={currentStudent.name} 
                className="user-avatar-img" 
              />
              <span className={`avatar-status-dot ${currentStudent.status === 'approved' ? 'dot-approved' : 'dot-pending'}`} />
            </div>
            <div className="user-profile-info">
              <span className="user-profile-name">{currentStudent.name}</span>
              <span 
                className="user-profile-status"
                style={{ color: currentStudent.status === 'approved' ? '#10b981' : '#f59e0b' }}
              >
                {currentStudent.status === 'approved' ? `✓ ${t('approvedStudent')}` : `⏳ ${t('pendingStudent')}`}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
