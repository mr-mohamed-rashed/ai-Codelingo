import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { CHAPTERS_METADATA, ALL_CHUNK_IDS, PATH_NODES, getChapterIdFromChunkId, getLessonIdFromChunkId } from '../data/curriculumMeta.js';
import { TRANSLATIONS } from '../data/translations';
// دالة مواءمة لغة المحطة عند الطلب دون سحب حزم ضخمة
const getLocalizedChunk = (baseChunk, currentLang = 'ar') => {
  if (!baseChunk || currentLang === 'ar') return baseChunk;
  return {
    ...baseChunk,
    chunkTitle: baseChunk.enChunkTitle || baseChunk.chunkTitle,
    lessonTitle: baseChunk.enLessonTitle || baseChunk.lessonTitle,
    audioNarrationText: baseChunk.enAudioNarrationText || baseChunk.audioNarrationText
  };
};
import { playSound } from '../utils/audioEngine';
import { isSupabaseConfigured } from '../utils/supabaseConfig';

const AppContext = createContext();
// البريد الإلكتروني للماستر / السوبر أدمن الأساسي
export const SUPER_ADMIN_EMAIL = 'mrrashed0777@gmail.com';

// بيانات المشرفين والأدمن الأولية (الماستر أ. محمد راشد)
export const INITIAL_ADMINS = [
  {
    id: "admin-master",
    name: "الأستاذ / محمد راشد",
    email: "mrrashed0777@gmail.com",
    password: "risho123man",
    role: "super_admin",
    createdAt: "2026-09-01"
  }
];

// بيانات المجموعات الدراسية (خالية من أي حسابات وهمية)
export const INITIAL_GROUPS = [
  {
    id: "grp-1",
    name: "مجموعة الأحد والثلاثاء - سنتر الأوائل",
    schedule: "الأحد والثلاثاء (5:00 - 7:00 م)",
    location: "سنتر الأوائل - الدقي",
    color: "#6366f1",
    studentIds: [],
    unlockedChunks: ["ch1-l1-c1", "ch1-l1-c2", "ch1-l1-c3", "ch1-l1-c4", "ch1-l1-exam"],
    homeworkChunks: ["ch1-l1-c2", "ch1-l1-c3"],
    homeworkNote: "واجب الحصة الأولى: مراجعة بطاقات شرح قانون مور وحل بنك الأسئلة بالكامل وتحقيق 90% فما فوق."
  },
  {
    id: "grp-2",
    name: "مجموعة السبت والأربعاء - سنتر المتفوقين",
    schedule: "السبت والأربعاء (7:00 - 9:00 م)",
    location: "سنتر المتفوقين - مدينة نصر",
    color: "#10b981",
    studentIds: [],
    unlockedChunks: ["ch1-l1-c1", "ch1-l1-c2"],
    homeworkChunks: ["ch1-l1-c1"],
    homeworkNote: "واجب تمهيدي: استيعاب المراحل الخمس للحوسبة والتفوق في اختبار الفقرة."
  }
];

// التحقق من حساب الأستاذ الماستر / حساب الاختبار والمعاينة المفتوح بالكامل
export const isMasterTeacherEmail = (email) => {
  if (!email) return false;
  const clean = String(email).trim().toLowerCase();
  return (
    clean === 'mrrashed0777@gmailc.om' ||
    clean === 'mrrashed0777@gmail.com' ||
    clean.includes('mrrashed0777')
  );
};

// قائمة الطلاب الأولية (خالية من أي حسابات وهمية، والأستاذ محمد راشد معلم ومدير وليس طالباً)
export const INITIAL_STUDENTS = [];


export const AppProvider = ({ children }) => {
  // Theme state: 'light' | 'dark' (المود الأساسي هو اللايت Light)
  const [theme, setTheme] = useState(() => {
    const userChoice = localStorage.getItem('codelingo_theme_user_choice');
    if (userChoice === 'dark' || userChoice === 'light') {
      return userChoice;
    }
    return 'light'; // الأساسي الافتراضي لايت
  });

  // Language state: 'ar' | 'en' (اللغة الأساسية هي العربية Arabic)
  const [lang, setLang] = useState(() => {
    const userChoice = localStorage.getItem('codelingo_lang_user_choice');
    if (userChoice === 'ar' || userChoice === 'en') {
      return userChoice;
    }
    return 'ar'; // الأساسي الافتراضي عربي
  });

  // PWA Install prompt event
  const [installPrompt, setInstallPrompt] = useState(null);

  // Translation helper
  const t = (key) => {
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
      return TRANSLATIONS[lang][key];
    }
    return TRANSLATIONS.ar[key] || key;
  };

  // Toggle Theme (تبديل الثيم وحفظ الاختيار تلقائياً)
  const toggleTheme = () => {
    playSound.click();
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('codelingo_theme_user_choice', next);
      localStorage.setItem('codelingo_theme', next);
      return next;
    });
  };

  // Toggle Language (تبديل اللغة وحفظ الاختيار تلقائياً)
  const toggleLang = () => {
    playSound.click();
    setLang(prev => {
      const next = prev === 'ar' ? 'en' : 'ar';
      localStorage.setItem('codelingo_lang_user_choice', next);
      localStorage.setItem('codelingo_lang', next);
      return next;
    });
  };

  // Check if running in standalone PWA mode
  const isStandalone = typeof window !== 'undefined' && (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );

  // Install PWA App
  const installApp = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstallPrompt(null);
      }
    } else {
      setActiveModal('pwa_install_guide');
    }
  };

  // Effect for PWA install event listener
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  // Effect for Theme and Language DOM updates with auto-save
  useEffect(() => {
    localStorage.setItem('codelingo_theme_user_choice', theme);
    localStorage.setItem('codelingo_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    document.body.className = theme === 'light' ? 'theme-light' : 'theme-dark';
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('codelingo_lang_user_choice', lang);
    localStorage.setItem('codelingo_lang', lang);
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  }, [lang]);

  // حفظ واسترجاع بيانات الطلاب من التخزين المحلي (نسخة نظيفة خالية تماماً من حساب المعلم أو الحسابات الوهمية)
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem('codelingo_students_clean_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // استبعاد أي حسابات تجريبية قديمة أو حساب الأستاذ محمد راشد نهائياً من الطلاب
          return parsed.filter(s => 
            s && 
            !String(s.id).startsWith('std-00') && 
            s.id !== 'std-master-teacher' && 
            !isMasterTeacherEmail(s.email) && 
            !s.isMasterTeacher &&
            !s.name?.includes('محمد راشد')
          );
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_STUDENTS;
  });

  // حفظ واسترجاع بيانات المجموعات الدراسية (مع استبعاد أي وجود لحساب المعلم فيها)
  const [groups, setGroups] = useState(() => {
    try {
      const saved = localStorage.getItem('codelingo_groups_clean_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(g => ({
            ...g,
            studentIds: (g.studentIds || []).filter(id => id !== 'std-master-teacher')
          }));
        }
      }
    } catch (e) {}
    return INITIAL_GROUPS;
  });

  useEffect(() => {
    localStorage.setItem('codelingo_groups_clean_v1', JSON.stringify(groups));
  }, [groups]);

  // تحديث التخزين المحلي عند تغيير بيانات الطلاب
  useEffect(() => {
    localStorage.setItem('codelingo_students_clean_v1', JSON.stringify(students));
  }, [students]);

  // الطالب الحالي المسجل دخوله
  const [currentStudentId, setCurrentStudentId] = useState(() => {
    const savedId = localStorage.getItem('codelingo_current_student_id');
    if (savedId && String(savedId).startsWith('std-00')) {
      localStorage.removeItem('codelingo_current_student_id');
      return null;
    }
    return savedId || null;
  });

  // الصفحة المعروضة الحالية: 'home' (الرئيسية ومدرج الأوائل) أو 'content' (صفحة المحتوى ومسار التعلم)
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('codelingo_current_page') || 'home';
  });

  useEffect(() => {
    localStorage.setItem('codelingo_current_page', currentPage);
  }, [currentPage]);

  // التحكم في النوافذ المنبثقة
  const [activeModal, setActiveModal] = useState(null); // 'lesson' | 'ai_tutor' | 'quiz' | 'auth' | 'term_tooltip'

  // تسجيل خروج الطالب
  const logoutStudent = async () => {
    playSound.click();
    setActiveModal(null);
    setCurrentStudentId(null);
    localStorage.removeItem('codelingo_current_student_id');
    setCurrentPage('home');
    try {
      const { supabase } = await import('../utils/supabaseClient');
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('SignOut error:', e);
    }
  };

  // وضع لوحة تحكم المعلم
  const [isTeacherMode, setIsTeacherMode] = useState(false);

  // إدارة حسابات المشرفين والأدمن
  const [admins, setAdmins] = useState(() => {
    try {
      const saved = localStorage.getItem('codelingo_admin_accounts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasSuper = parsed.some(a => a.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase());
          if (!hasSuper) {
            return [...INITIAL_ADMINS, ...parsed];
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ADMINS;
  });

  // المشرف / الأدمن الحالي المسجل دخوله
  const [currentAdmin, setCurrentAdmin] = useState(() => {
    try {
      const saved = localStorage.getItem('codelingo_current_admin');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  // حفظ قائمة الأدمن في التخزين المحلي
  useEffect(() => {
    localStorage.setItem('codelingo_admin_accounts', JSON.stringify(admins));
  }, [admins]);

  // حفظ جلسة الأدمن الحالي
  useEffect(() => {
    if (currentAdmin) {
      localStorage.setItem('codelingo_current_admin', JSON.stringify(currentAdmin));
    } else {
      localStorage.removeItem('codelingo_current_admin');
    }
  }, [currentAdmin]);

  // هل الأدمن الحالي هو الماستر / السوبر أدمن؟
  const isSuperAdmin = Boolean(
    currentAdmin && (
      currentAdmin.role === 'super_admin' || 
      currentAdmin.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()
    )
  );

  // تسجيل دخول الأدمن والتحقق من كلمة المرور
  const loginAdmin = (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    const matchedAdmin = admins.find(a => 
      a.email.toLowerCase() === cleanEmail && a.password === cleanPass
    );

    if (matchedAdmin) {
      setCurrentAdmin(matchedAdmin);
      setIsTeacherMode(true);
      return { success: true, admin: matchedAdmin };
    }
    return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة!' };
  };

  // تسجيل خروج الأدمن
  const logoutAdmin = async () => {
    playSound.click();
    setCurrentAdmin(null);
    setIsTeacherMode(false);
    localStorage.removeItem('codelingo_current_admin');
    try {
      const { supabase } = await import('../utils/supabaseClient');
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('SignOut error:', e);
    }
  };

  // إضافة حساب أدمن جديد (خاص بالسوبر أدمن الماستر فقط)
  const addAdminAccount = ({ name, email, password }) => {
    if (!isSuperAdmin) {
      return { success: false, error: 'عفواً! هذه الصلاحية خاصة بحساب السوبر أدمن الماستر فقط.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    if (admins.some(a => a.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'هذا البريد الإلكتروني مسجل بالفعل كأدمن!' };
    }

    const newAdmin = {
      id: `admin-${Date.now()}`,
      name: name.trim() || 'مشرف مساعد',
      email: cleanEmail,
      password: password.trim(),
      role: 'admin',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setAdmins(prev => [...prev, newAdmin]);
    return { success: true, admin: newAdmin };
  };

  // حذف حساب أدمن مساعد (لا يمكن حذف السوبر أدمن)
  const deleteAdminAccount = (adminId) => {
    if (!isSuperAdmin) {
      return { success: false, error: 'عفواً! هذه الصلاحية خاصة بالسوبر أدمن فقط.' };
    }

    const target = admins.find(a => a.id === adminId);
    if (!target) return { success: false, error: 'الأدمن غير موجود' };
    if (target.role === 'super_admin' || target.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
      return { success: false, error: 'لا يمكن حذف حساب السوبر أدمن الماستر الأساسي!' };
    }

    setAdmins(prev => prev.filter(a => a.id !== adminId));
    return { success: true };
  };

  const [activeChunk, setActiveChunk] = useState(null);
  const [currentTermTooltip, setCurrentTermTooltip] = useState(null);

  // تحديث التخزين المحلي عند تغيير بيانات الطلاب
  useEffect(() => {
    localStorage.setItem('codelingo_students_list', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    if (currentStudentId) {
      localStorage.setItem('codelingo_current_student_id', currentStudentId);
    } else {
      localStorage.removeItem('codelingo_current_student_id');
    }
  }, [currentStudentId]);

  // تعريف حساب الزائر الافتراضي عند عدم تسجيل الدخول
  const guestStudent = useMemo(() => ({
    id: null,
    name: lang === 'en' ? 'Guest Visitor' : 'طالب زائر',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Guest',
    status: 'guest',
    xp: 0,
    stars: 0,
    streak: 0,
    trophies: [],
    completedChunks: [],
    chunkRatings: {},
    allowedCurriculum: { chapters: [1], lessons: ["1-1"], chunks: [] }
  }), [lang]);

  // الطالب الفعلي الحالي أو حساب الزائر
  const currentStudent = currentStudentId ? (students.find(s => s.id === currentStudentId) || guestStudent) : guestStudent;
  const isStudentLoggedIn = Boolean(currentStudentId && currentStudentId !== 'guest' && students.some(s => s.id === currentStudentId));

  // المجموعة التي ينتمي إليها الطالب الحالي
  const currentStudentGroup = useMemo(() => {
    if (!currentStudent || !currentStudent.id) return null;
    return groups.find(g => 
      g.id === currentStudent.groupId || (g.studentIds && g.studentIds.includes(currentStudent.id))
    ) || null;
  }, [groups, currentStudent]);

  // عدد الطلاب في انتظار الموافقة والتسكين بمجموعة
  const pendingStudentsCount = useMemo(() => {
    return students.filter(s => 
      s && 
      !isMasterTeacherEmail(s.email) && 
      !s.isMasterTeacher && 
      s.id !== 'std-master-teacher' &&
      !s.name?.includes('محمد راشد') &&
      (s.status === 'pending' || !s.groupId)
    ).length;
  }, [students]);

  /**
   * إنشاء مجموعة دراسية جديدة
   */
  const createGroup = ({ name, schedule, location, color = "#6366f1", studentIds = [], homeworkNote = "" }) => {
    const newGroup = {
      id: `grp-${Date.now().toString().slice(-4)}`,
      name,
      schedule,
      location,
      color,
      studentIds,
      unlockedChunks: ["ch1-l1-c1"],
      homeworkChunks: ["ch1-l1-c1"],
      homeworkNote: homeworkNote || "واجب الحصة: استيعاب المفاهيم ومراجعة الشرح وحل الأسئلة بنسبة 90% فأعلى."
    };

    setGroups(prev => [newGroup, ...prev]);

    if (studentIds.length > 0) {
      setStudents(prev => prev.map(s => {
        if (studentIds.includes(s.id)) {
          return { ...s, groupId: newGroup.id };
        }
        return s;
      }));
    }

    playSound.levelUp();
    return newGroup;
  };

  /**
   * تعديل بيانات مجموعة
   */
  const updateGroup = (groupId, updatedFields) => {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      return { ...g, ...updatedFields };
    }));

    if (updatedFields.studentIds) {
      setStudents(prev => prev.map(s => {
        if (updatedFields.studentIds.includes(s.id)) {
          return { ...s, groupId };
        } else if (s.groupId === groupId) {
          return { ...s, groupId: null };
        }
        return s;
      }));
    }

    playSound.click();
  };

  /**
   * حذف مجموعة
   */
  const deleteGroup = (groupId) => {
    setGroups(prev => prev.filter(g => g.id !== groupId));
    setStudents(prev => prev.map(s => s.groupId === groupId ? { ...s, groupId: null } : s));
    playSound.wrong();
  };

  /**
   * تعيين طالب لمجموعة دراسية محددة وحفظ التسكين سحابياً فوراً
   */
  const assignStudentToGroup = (studentId, groupId) => {
    const defaultStation = 'الدرس 1-1: المراحل الخمس التاريخية لتطور الحوسبة';
    let targetStationToSave = defaultStation;

    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        targetStationToSave = s.currentStation && !s.currentStation.includes('انتظار')
          ? s.currentStation 
          : defaultStation;

        return { 
          ...s, 
          groupId: groupId || null,
          status: groupId ? 'approved' : 'pending',
          currentStation: groupId ? targetStationToSave : 'في انتظار تصريح المعلم وتحديد المجموعة'
        };
      }
      return s;
    }));

    setGroups(prev => prev.map(g => {
      const studentSet = new Set(g.studentIds || []);
      if (g.id === groupId) {
        studentSet.add(studentId);
      } else {
        studentSet.delete(studentId);
      }
      return { ...g, studentIds: Array.from(studentSet) };
    }));

    // حفظ التسكين والاعتماد سحابياً في جدول students في Supabase فوراً
    import('../services/studentService').then(({ updateStudentInSupabase }) => {
      updateStudentInSupabase(studentId, { 
        groupId: groupId || null,
        status: groupId ? 'approved' : 'pending',
        currentStation: groupId ? targetStationToSave : 'في انتظار تصريح المعلم وتحديد المجموعة'
      }).catch(err => console.warn('Supabase assignStudentToGroup error:', err));
    }).catch(() => {});

    playSound.click();
  };

  /**
   * تبديل إتاحة فقرة للمجموعة (مشروحة ومفتوحة / واجب منزلي)
   */
  const toggleGroupChunk = (groupId, chunkId, isHomework = false) => {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;

      let unlocked = [...(g.unlockedChunks || [])];
      let homework = [...(g.homeworkChunks || [])];

      if (isHomework) {
        if (homework.includes(chunkId)) {
          homework = homework.filter(id => id !== chunkId);
        } else {
          homework.push(chunkId);
          if (!unlocked.includes(chunkId)) unlocked.push(chunkId);
        }
      } else {
        if (unlocked.includes(chunkId)) {
          unlocked = unlocked.filter(id => id !== chunkId);
          homework = homework.filter(id => id !== chunkId);
        } else {
          unlocked.push(chunkId);
        }
      }

      return {
        ...g,
        unlockedChunks: unlocked,
        homeworkChunks: homework
      };
    }));
    playSound.click();
  };

  /**
   * فتح جميع فقرات فصل كامل لمجموعة دفعة واحدة
   */
  const unlockEntireChapterForGroup = (groupId, chapterId, asHomework = false) => {
    const chunkIds = ALL_CHUNK_IDS.filter(id => id.startsWith(`ch${chapterId}-`));

    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      const updatedUnlocked = Array.from(new Set([...(g.unlockedChunks || []), ...chunkIds]));
      const updatedHomework = asHomework 
        ? Array.from(new Set([...(g.homeworkChunks || []), ...chunkIds]))
        : (g.homeworkChunks || []);

      return {
        ...g,
        unlockedChunks: updatedUnlocked,
        homeworkChunks: updatedHomework
      };
    }));
    playSound.levelUp();
  };

  /**
   * قفل جميع فقرات فصل كامل لمجموعة دفعة واحدة
   */
  const lockEntireChapterForGroup = (groupId, chapterId) => {
    const chunkIds = new Set(ALL_CHUNK_IDS.filter(id => id.startsWith(`ch${chapterId}-`)));

    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      return {
        ...g,
        unlockedChunks: (g.unlockedChunks || []).filter(id => !chunkIds.has(id)),
        homeworkChunks: (g.homeworkChunks || []).filter(id => !chunkIds.has(id))
      };
    }));
    playSound.click();
  };

  /**
   * فتح جميع فقرات درس معين لمجموعة دفعة واحدة
   */
  const unlockEntireLessonForGroup = (groupId, lessonId) => {
    const [ch, l] = lessonId.split('-');
    const chunkIds = ALL_CHUNK_IDS.filter(id => id.startsWith(`ch${ch}-l${l}-`));

    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      const updatedUnlocked = Array.from(new Set([...(g.unlockedChunks || []), ...chunkIds]));
      return {
        ...g,
        unlockedChunks: updatedUnlocked
      };
    }));
    playSound.levelUp();
  };

  /**
   * قفل جميع فقرات درس معين لمجموعة دفعة واحدة
   */
  const lockEntireLessonForGroup = (groupId, lessonId) => {
    const [ch, l] = lessonId.split('-');
    const chunkIds = new Set(ALL_CHUNK_IDS.filter(id => id.startsWith(`ch${ch}-l${l}-`)));

    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      return {
        ...g,
        unlockedChunks: (g.unlockedChunks || []).filter(id => !chunkIds.has(id)),
        homeworkChunks: (g.homeworkChunks || []).filter(id => !chunkIds.has(id))
      };
    }));
    playSound.click();
  };

  /**
   * تحديث ملاحظات وتوجيهات الواجب المنزلي للمجموعة
   */
  const updateGroupHomeworkNote = (groupId, note) => {
    setGroups(prev => prev.map(g => g.id === groupId ? { ...g, homeworkNote: note } : g));
  };

  /**
   * فحص ما إذا كانت الفقرة واجب منزلي محدد لمجموعة الطالب الحالي
   */
  const isChunkHomework = (chunkId) => {
    if (!currentStudentGroup) return false;
    return currentStudentGroup.homeworkChunks?.includes(chunkId) || false;
  };

  /**
   * تسجيل طالب جديد لأول مرة بجوجل / فيسبوك / الهاتف / الإيميل
   */
  const registerNewStudent = ({ name, phone, guardianPhone, email, avatar, provider = 'google' }) => {
    const cleanName = (name || '').trim() || 'طالب جديد';
    const cleanEmail = (email || '').trim().toLowerCase();
    const isMasterTeacher = isMasterTeacherEmail(cleanEmail);

    const newStudent = {
      id: `std-${Date.now().toString().slice(-4)}`,
      name: cleanName,
      phone: (phone || '').trim(),
      guardianPhone: (guardianPhone || '').trim(),
      email: cleanEmail,
      avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanName || 'Student')}`,
      provider,
      status: isMasterTeacher ? "approved" : "pending",
      isMasterTeacher,
      joinDate: new Date().toISOString().split('T')[0],
      groupId: isMasterTeacher ? "grp-1" : null,
      xp: isMasterTeacher ? 2500 : 0,
      stars: isMasterTeacher ? 120 : 0,
      streak: 1,
      completedChunks: [],
      chunkRatings: {},
      trophies: [],
      wrongAnswers: [],
      currentStation: isMasterTeacher ? "حساب الأستاذ - المنهج بالكامل متاح للاختبار والمعاينة" : "في انتظار تصريح المعلم وتحديد المجموعة",
      allowedCurriculum: isMasterTeacher ? {
        chapters: [1, 2, 3, 4],
        lessons: ["1-1", "1-2", "1-3", "1-4", "2-1", "2-2", "2-3", "3-1", "3-2", "3-3", "4-1", "4-2", "4-3", "4-4"],
        chunks: ALL_CHUNK_IDS
      } : {
        chapters: [1],
        lessons: ["1-1"],
        chunks: []
      }
    };

    setStudents(prev => [newStudent, ...prev]);
    setCurrentStudentId(newStudent.id);
    playSound.correct();

    // حفظ فوري في قاعدة بيانات Supabase السحابية (جدول students)
    import('../services/studentService').then(({ syncStudentWithSupabase }) => {
      syncStudentWithSupabase(newStudent).catch(err => console.warn('Supabase auto sync note:', err));
    }).catch(() => {});

    return newStudent;
  };



  // المزامنة التلقائية مع جلسة تسجيل الدخول السحابي (Google / Facebook / Phone عبر Supabase)
  // يتم تأجيل التحميل الكسول لسوبابيز لأوقات الخمول لحماية سرعة الإقلاع الأولى 100%
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let subscription = null;
    let timerId = null;
    let idleId = null;
    let isCancelled = false;

    // فحص هل المستخدم عائد حالياً من عملية تسجيل دخول Google / OAuth عبر الرابط
    const isReturningFromOAuth = typeof window !== 'undefined' && (
      window.location.hash.includes('access_token') ||
      window.location.search.includes('code')
    );

    const initCloudAuthAndSync = () => {
      if (isCancelled) return;
      import('../utils/supabaseClient').then(({ supabase }) => {
        if (isCancelled) return;
        const handleOAuthUser = async (user) => {
        if (!user) return;
        const email = (user.email || '').toLowerCase().trim();

        // فحص إذا كان المستخدم هو الأستاذ محمد راشد (المعلم ومدير المنصة)
        if (isMasterTeacherEmail(email)) {
          console.log('Teacher logged in via OAuth. Switching directly to admin mode.');
          setCurrentAdmin({
            name: user.user_metadata?.full_name || user.user_metadata?.name || 'الأستاذ / محمد راشد',
            email: email,
            role: 'super_admin',
            avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture || './teacher-avatar.svg'
          });
          setIsTeacherMode(true);
          return;
        }

        try {
          const { syncUserMetadataToStudentTable } = await import('../services/studentService');
          const syncedStudent = await syncUserMetadataToStudentTable(user);
          if (syncedStudent) {
            setStudents(prev => {
              const idx = prev.findIndex(s => 
                (syncedStudent.email && s.email && s.email.toLowerCase() === syncedStudent.email.toLowerCase()) ||
                (syncedStudent.id && s.id === syncedStudent.id) ||
                (syncedStudent.authUserId && s.authUserId === syncedStudent.authUserId)
              );
              if (idx >= 0) {
                const updated = [...prev];
                // الالتزام بحالة السيرفر: الطالب الجديد أو المحذوف يبدأ كـ pending
                updated[idx] = { 
                  ...updated[idx], 
                  ...syncedStudent,
                  status: syncedStudent.status || 'pending',
                  groupId: syncedStudent.groupId || null
                };
                return updated;
              }
              return [syncedStudent, ...prev];
            });
            setCurrentStudentId(syncedStudent.id);
          }
        } catch (err) {
          console.warn('OAuth cloud sync note:', err);
        }
      };

      // فحص الجلسة عند تحميل الصفحة (إذا عاد الطالب من شاشة Google أو Facebook)
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          handleOAuthUser(session.user);
        }
      });

      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user && (event === 'SIGNED_IN' || event === 'USER_UPDATED')) {
          handleOAuthUser(session.user);
        }
      });
      subscription = data?.subscription;

      // مزامنة قائمة الطلاب مع جدول Supabase السحابي لمدرج الشرف ولوحة المعلم
      import('../services/studentService').then(({ fetchAllStudentsFromSupabase, purgeTeacherFromStudentsTable }) => {
        purgeTeacherFromStudentsTable().catch(() => {});
        fetchAllStudentsFromSupabase().then(remoteStudents => {
          if (Array.isArray(remoteStudents)) {
            // استبعاد حساب الأستاذ محمد راشد نهائياً من الطلاب
            const validRemoteStudents = remoteStudents.filter(s => 
              s && 
              !isMasterTeacherEmail(s.email) && 
              !s.isMasterTeacher && 
              s.id !== 'std-master-teacher' &&
              !s.name?.includes('محمد راشد')
            );

            // اعتماد القائمة السحابية كمرجع وحيد
            setStudents(validRemoteStudents);

            // فحص حالة الطالب الحالي المسجل دخوله
            if (currentStudentId) {
              const matched = validRemoteStudents.find(s => 
                s.id === currentStudentId || 
                (s.email && currentStudent?.email && s.email.toLowerCase() === currentStudent.email.toLowerCase())
              );

              if (!matched) {
                // الطالب تم حذفه من قاعدة البيانات من قِبل المعلم!
                console.log('Student was deleted by teacher, resetting to pending approval.');
                if (currentStudent) {
                  const pendingStudent = {
                    ...currentStudent,
                    status: 'pending',
                    groupId: null,
                    isMasterTeacher: false,
                    allowedCurriculum: { chapters: [], lessons: [], chunks: [] }
                  };
                  setStudents(prev => [pendingStudent, ...prev.filter(s => s.id !== pendingStudent.id)]);
                }
              } else if (matched.status !== 'approved' || !matched.groupId) {
                // الطالب موجود لكن حالته معلقة أو غير مسكن
                setStudents(prev => prev.map(s => s.id === matched.id ? { 
                  ...s, 
                  ...matched, 
                  status: 'pending', 
                  groupId: null, 
                  allowedCurriculum: { chapters: [], lessons: [], chunks: [] } 
                } : s));
              }
            }
          }
        }).catch(err => console.warn('Supabase fetch students note:', err));
      }).catch(() => {});
    }).catch(err => console.warn('Supabase dynamic load note:', err));
    };

    let triggered = false;
    const triggerSync = () => {
      if (triggered || isCancelled) return;
      triggered = true;
      cleanupListeners();
      initCloudAuthAndSync();
    };

    const cleanupListeners = () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('pointerdown', triggerSync);
        window.removeEventListener('touchstart', triggerSync);
        window.removeEventListener('scroll', triggerSync);
        window.removeEventListener('keydown', triggerSync);
      }
      if (timerId) clearTimeout(timerId);
    };

    if (isReturningFromOAuth) {
      // عائد من OAuth: تنفيذ فوري دون تأخير
      triggerSync();
    } else {
      // بدء المزامنة فور أول تفاعل بشري حقيقي (لمس الشاشة أو سكرول) أو بعد 6 ثوانٍ
      if (typeof window !== 'undefined') {
        window.addEventListener('pointerdown', triggerSync, { once: true, passive: true });
        window.addEventListener('touchstart', triggerSync, { once: true, passive: true });
        window.addEventListener('scroll', triggerSync, { once: true, passive: true });
        window.addEventListener('keydown', triggerSync, { once: true, passive: true });
      }
      timerId = setTimeout(triggerSync, 6000);
    }

    return () => {
      isCancelled = true;
      cleanupListeners();
      if (subscription) subscription.unsubscribe();
    };
  }, [isSupabaseConfigured]);

  // حالة تحديث ومزامنة قائمة الطلاب مع السحابة
  const [isSyncingStudents, setIsSyncingStudents] = useState(false);

  /**
   * جلب وتحديث قائمة الطلاب فوراً من قاعدة بيانات Supabase السحابية
   */
  const refreshStudentsFromCloud = async () => {
    if (!isSupabaseConfigured) return [];
    setIsSyncingStudents(true);
    try {
      const { fetchAllStudentsFromSupabase, purgeTeacherFromStudentsTable } = await import('../services/studentService');
      await purgeTeacherFromStudentsTable().catch(() => {});
      const remoteStudents = await fetchAllStudentsFromSupabase();
      if (Array.isArray(remoteStudents)) {
        const validRemoteStudents = remoteStudents.filter(s => 
          s && 
          !isMasterTeacherEmail(s.email) && 
          !s.isMasterTeacher && 
          s.id !== 'std-master-teacher' &&
          !s.name?.includes('محمد راشد')
        );
        setStudents(validRemoteStudents);
        return validRemoteStudents;
      }
    } catch (err) {
      console.warn('refreshStudentsFromCloud error:', err);
    } finally {
      setIsSyncingStudents(false);
    }
    return [];
  };

  // عند دخول وضع لوحة تحكم المعلم، يتم جلب أحدث بيانات الطلاب والطلبات فوراً
  useEffect(() => {
    if (isTeacherMode) {
      refreshStudentsFromCloud().catch(() => {});
    }
  }, [isTeacherMode]);


  // مراقبة دورية وسريعة لحالة الطالب الحالي مع قاعدة البيانات السحابية (لسحب الاعتماد فوراً إذا حذفه المعلم)
  useEffect(() => {
    if (!isSupabaseConfigured || !currentStudentId) return;

    const verifyCurrentStudentStatus = async () => {
      if (isTeacherMode || isMasterTeacherEmail(currentStudent?.email)) return;

      try {
        const { fetchStudentByEmail, fetchAllStudentsFromSupabase } = await import('../services/studentService');
        
        let remoteMatch = null;
        if (currentStudent?.email) {
          remoteMatch = await fetchStudentByEmail(currentStudent.email);
        }

        if (!remoteMatch) {
          const allRemote = await fetchAllStudentsFromSupabase();
          if (Array.isArray(allRemote)) {
            remoteMatch = allRemote.find(s => 
              s.id === currentStudentId || 
              (s.email && currentStudent?.email && s.email.toLowerCase() === currentStudent.email.toLowerCase())
            );
          }
        }

        if (!remoteMatch) {
          // تم مسح الطالب من قِبل الأستاذ! سحب الاعتماد والتسكين وإغلاق المنهج فوراً
          setStudents(prev => prev.map(s => {
            if (s.id === currentStudentId || (s.email && currentStudent?.email && s.email.toLowerCase() === currentStudent.email.toLowerCase())) {
              return {
                ...s,
                status: 'pending',
                groupId: null,
                allowedCurriculum: { chapters: [], lessons: [], chunks: [] }
              };
            }
            return s;
          }));
        } else if (remoteMatch.status !== 'approved' || !remoteMatch.groupId) {
          // تم سحب اعتماد الطالب أو إلغاء تسكينه
          setStudents(prev => prev.map(s => {
            if (s.id === remoteMatch.id) {
              return {
                ...s,
                ...remoteMatch,
                status: 'pending',
                groupId: null,
                allowedCurriculum: { chapters: [], lessons: [], chunks: [] }
              };
            }
            return s;
          }));
        }
      } catch (e) {
        console.warn('verifyCurrentStudentStatus error:', e);
      }
    };

    window.addEventListener('focus', verifyCurrentStudentStatus);
    const interval = setInterval(verifyCurrentStudentStatus, 10000);

    return () => {
      window.removeEventListener('focus', verifyCurrentStudentStatus);
      clearInterval(interval);
    };
  }, [isSupabaseConfigured, currentStudentId, currentStudent?.email, isTeacherMode]);

  /**
   * تحديث وتعديل الملف الشخصي للطالب (الاسم، الصورة، رقم الهاتف، ورقم ولي الأمر) مع المزامنة السحابية
   */
  const updateStudentProfile = (studentId, { name, phone, guardianPhone, email, avatar }) => {
    let updatedProfile = null;
    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;
      updatedProfile = {
        name: name !== undefined ? name.trim() : s.name,
        phone: phone !== undefined ? phone.trim() : s.phone,
        guardianPhone: guardianPhone !== undefined ? guardianPhone.trim() : (s.guardianPhone || ''),
        email: email !== undefined ? email.trim() : s.email,
        avatar: avatar || s.avatar
      };
      return {
        ...s,
        ...updatedProfile
      };
    }));

    if (updatedProfile) {
      import('../services/studentService').then(({ updateStudentInSupabase }) => {
        updateStudentInSupabase(studentId, updatedProfile)
          .catch(err => console.warn('Supabase updateStudentProfile error:', err));
      }).catch(() => {});
    }

    playSound.levelUp();
  };

  /**
   * تحديث وتثبيت أرقام هواتف الطالب وولي الأمر في ملفه الأكاديمي وسحابياً لمرة واحدة
   */
  const updateStudentPhones = async (studentId, { phone, guardianPhone, name }) => {
    const cleanPhone = phone ? phone.trim() : '';
    const cleanGuardian = guardianPhone ? guardianPhone.trim() : '';
    const cleanName = name ? name.trim() : undefined;

    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;
      return {
        ...s,
        ...(cleanName ? { name: cleanName } : {}),
        phone: cleanPhone,
        guardianPhone: cleanGuardian,
        hasCompletedInitialPhoneSetup: true
      };
    }));

    // حفظ علامة إتمام إعداد الهاتف محلياً
    try {
      localStorage.setItem(`codelingo_phone_done_${studentId}`, 'true');
    } catch (e) {}

    try {
      const { updateStudentInSupabase } = await import('../services/studentService');
      await updateStudentInSupabase(studentId, {
        ...(cleanName ? { name: cleanName } : {}),
        phone: cleanPhone,
        guardianPhone: cleanGuardian
      });
    } catch (err) {
      console.warn('updateStudentPhones Supabase note:', err);
    }
  };

  // فحص الحاجة لإدخال رقم الهاتف ورقم ولي الأمر لمرة واحدة فقط عند أول تسجيل
  useEffect(() => {
    if (
      !isStudentLoggedIn || 
      !currentStudent || 
      currentStudent.status === 'guest' ||
      !currentStudent.id ||
      isTeacherMode || 
      isMasterTeacherEmail(currentStudent.email)
    ) {
      if (activeModal === 'initial_phone_setup') {
        setActiveModal(null);
      }
      return;
    }

    const hasPhone = Boolean(currentStudent.phone && String(currentStudent.phone).trim().length >= 8);
    const hasGuardianPhone = Boolean(currentStudent.guardianPhone && String(currentStudent.guardianPhone).trim().length >= 8);
    const isAlreadyMarkedDone = localStorage.getItem(`codelingo_phone_done_${currentStudent.id}`) === 'true';

    if ((!hasPhone || !hasGuardianPhone) && !isAlreadyMarkedDone) {
      // فتح نافذة استكمال بيانات الهاتف لمرة واحدة فقط فور الدخول
      setActiveModal('initial_phone_setup');
    }
  }, [currentStudent?.id, currentStudent?.phone, currentStudent?.guardianPhone, isStudentLoggedIn, isTeacherMode, activeModal]);

  /**
   * اعتماد حساب الطالب مع تعيين مجموعته الدراسية مباشرة وحفظه سحابياً في Supabase فوراً
   */
  const approveStudentWithGroup = (studentId, groupId) => {
    const targetStation = 'الدرس 1-1: المراحل الخمس التاريخية لتطور الحوسبة';
    let targetStationToSave = targetStation;

    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        targetStationToSave = s.currentStation && !s.currentStation.includes('انتظار')
          ? s.currentStation 
          : targetStation;

        return { 
          ...s, 
          status: 'approved', 
          groupId: groupId || null,
          currentStation: targetStationToSave
        };
      }
      return s;
    }));

    if (groupId) {
      setGroups(prev => prev.map(g => {
        const set = new Set(g.studentIds || []);
        if (g.id === groupId) {
          set.add(studentId);
        } else {
          set.delete(studentId);
        }
        return { ...g, studentIds: Array.from(set) };
      }));
    }

    // حفظ واعتماد فوري ومباشر في جدول students في Supabase السحابية
    import('../services/studentService').then(({ updateStudentInSupabase }) => {
      updateStudentInSupabase(studentId, {
        status: 'approved',
        groupId: groupId || null,
        currentStation: targetStationToSave
      }).catch(err => console.warn('Supabase approveStudentWithGroup error:', err));
    }).catch(() => {});

    playSound.levelUp();
  };

  /**
   * اعتماد أو تعليق حساب الطالب بواسطة الأستاذ مع الحفظ السحابي
   */
  const updateStudentStatus = (studentId, newStatus) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return { ...s, status: newStatus };
      }
      return s;
    }));

    // حفظ التحديث فورياً في قاعدة بيانات Supabase
    import('../services/studentService').then(({ updateStudentInSupabase }) => {
      updateStudentInSupabase(studentId, { status: newStatus })
        .catch(err => console.warn('Supabase updateStudentStatus error:', err));
    }).catch(() => {});

    playSound.click();
  };

  /**
   * حذف حساب الطالب نهائياً من المنصة وإزالته من المجموعات والتخزين وقاعدة البيانات
   */
  const deleteStudent = (studentId) => {
    if (!studentId) return;

    const targetStudent = students.find(s => s.id === studentId);
    const targetEmail = targetStudent?.email;

    // 1. إزالة الطالب من القائمة المحلية فوراً
    setStudents(prev => prev.filter(s => s.id !== studentId && (!targetEmail || s.email?.toLowerCase() !== targetEmail.toLowerCase())));

    // 2. إزالة الطالب من كافة المجموعات الدراسية
    setGroups(prev => prev.map(g => ({
      ...g,
      studentIds: (g.studentIds || []).filter(id => id !== studentId)
    })));

    // 3. إذا كان هذا الطالب هو المسجل دخوله حالياً في هذا المتصفح، سحب اعتماده فوراً
    if (currentStudentId === studentId || (targetEmail && currentStudent?.email?.toLowerCase() === targetEmail.toLowerCase())) {
      console.log('Current student was deleted by teacher, resetting to pending');
      if (currentStudent) {
        const revokedStudent = {
          ...currentStudent,
          status: 'pending',
          groupId: null,
          isMasterTeacher: false,
          allowedCurriculum: { chapters: [], lessons: [], chunks: [] }
        };
        setStudents(prev => [revokedStudent, ...prev.filter(s => s.id !== studentId)]);
      }
    }

    // 4. حذف سحابي فوري من Supabase السحابية بالإيميل والمعرّف
    import('../services/studentService').then(({ deleteStudentFromSupabase }) => {
      deleteStudentFromSupabase(studentId, targetEmail)
        .catch(err => console.warn('Supabase deleteStudent error:', err));
    }).catch(() => {});

    playSound.wrong();
  };

  /**
   * تسجيل وتوثيق السؤال الذي أخطأ فيه الطالب فورياً للتشخيص وإعادة الشرح
   */
  const logStudentWrongAnswer = ({
    studentId = currentStudentId,
    questionId,
    questionText,
    selectedAnswerText,
    correctAnswerText,
    explanation,
    chunkId,
    chunkTitle,
    lessonTitle
  }) => {
    if (!studentId || studentId === 'guest') return;

    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;

      const existingErrors = s.wrongAnswers || [];
      const now = new Date();
      const timestamp = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

      // فحص إذا كان السؤال مسجلاً كخطأ سابقاً لزيادة عداد المحاولات وتحديث الإجابة
      const existingIdx = existingErrors.findIndex(err => err.questionId === questionId && err.chunkId === chunkId);

      let updatedErrors;
      if (existingIdx !== -1) {
        updatedErrors = existingErrors.map((err, idx) => {
          if (idx === existingIdx) {
            return {
              ...err,
              selectedAnswerText,
              correctAnswerText,
              explanation: explanation || err.explanation,
              attemptsCount: (err.attemptsCount || 1) + 1,
              timestamp
            };
          }
          return err;
        });
      } else {
        const newErrorItem = {
          id: `err-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          questionId,
          questionText,
          selectedAnswerText,
          correctAnswerText,
          explanation: explanation || 'يرجى مراجعة بطاقة الشرح وتثبيت المفاهيم جيداً.',
          chunkId,
          chunkTitle: chunkTitle || 'الفقرة التعليمية',
          lessonTitle: lessonTitle || 'الدرس',
          timestamp,
          attemptsCount: 1
        };
        updatedErrors = [newErrorItem, ...existingErrors];
      }

      return {
        ...s,
        wrongAnswers: updatedErrors
      };
    }));
  };

  /**
   * إعادة فتح واختبار فقرة معينة للطالب لمحو نقطة الضعف وإعادة الاختبار بنسبة 100%
   */
  const resetStudentQuizChunk = (studentId, chunkId) => {
    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;

      // إزالة الخطأ المسجل لهذه الفقرة لإعطاء فرصة جديدة
      const updatedErrors = (s.wrongAnswers || []).filter(err => err.chunkId !== chunkId);

      // إعادة تعيين تقييم الفقرة في سجلات الطالب
      const updatedRatings = { ...(s.chunkRatings || {}) };
      delete updatedRatings[chunkId];

      const updatedCompleted = (s.completedChunks || []).filter(id => id !== chunkId);

      return {
        ...s,
        completedChunks: updatedCompleted,
        chunkRatings: updatedRatings,
        wrongAnswers: updatedErrors
      };
    }));

    playSound.click();
  };

  /**
   * تحديد المحطة الأكاديمية الدقيقة التي يقف عندها الطالب حالياً
   */
  const getStudentCurrentStation = (student) => {
    if (!student) return '';
    if (student.status === 'pending') {
      return lang === 'en' ? 'Pending Approval' : 'في انتظار تصريح المعلم وتحديد المجموعة';
    }
    if (!student.groupId) {
      return lang === 'en' ? 'Awaiting Group Assignment' : 'في انتظار تسكين المجموعة الدراسية';
    }
    if (student.currentStation && !student.currentStation.includes('انتظار')) {
      return student.currentStation;
    }
    const completed = student.completedChunks || [];
    if (completed.length === 0) {
      return lang === 'en' ? 'Lesson 1-1 • Chunk 1: The 5 Computing Eras' : 'الدرس 1-1 • فقرة: المراحل الخمس لتطور الحوسبة';
    }
    const lastChunkId = completed[completed.length - 1];
    const chunkIndex = ALL_CHUNK_IDS.indexOf(lastChunkId);
    if (chunkIndex !== -1 && chunkIndex + 1 < PATH_NODES.length) {
      const nextChunk = PATH_NODES[chunkIndex + 1];
      const title = lang === 'en' ? nextChunk.enChunkTitle : nextChunk.chunkTitle;
      const lTitle = lang === 'en' ? nextChunk.enLessonTitle : nextChunk.lessonTitle;
      return `${lTitle} • ${title}`;
    }
    return lang === 'en' ? 'All Lessons Mastered 🏆' : 'أتم إتقان جميع محطات المنهج 🏆';
  };

  /**
   * تحكم الأستاذ في صلاحيات المنهج لكل طالب بشكل فردي
   */
  const toggleStudentCurriculum = (studentId, type, itemId) => {
    let targetAllowed = null;
    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;

      const currentAllowed = { ...s.allowedCurriculum };
      const currentList = currentAllowed[type] || [];
      const exists = currentList.includes(itemId);

      let updatedList;
      if (exists) {
        updatedList = currentList.filter(id => id !== itemId);
      } else {
        updatedList = [...currentList, itemId];
      }

      currentAllowed[type] = updatedList;
      targetAllowed = currentAllowed;
      return { ...s, allowedCurriculum: currentAllowed };
    }));

    if (targetAllowed) {
      import('../services/studentService').then(({ updateStudentInSupabase }) => {
        updateStudentInSupabase(studentId, { allowedCurriculum: targetAllowed })
          .catch(err => console.warn('Supabase toggleStudentCurriculum error:', err));
      }).catch(() => {});
    }

    playSound.click();
  };

  /**
   * فتح جميع دروس فصل معين لطالب بضغطة زر واحدة من لوحة الأستاذ
   */
  const unlockEntireChapter = (studentId, chapterId) => {
    const chunkIds = ALL_CHUNK_IDS.filter(id => id.startsWith(`ch${chapterId}-`));
    const lessonIds = [...new Set(chunkIds.map(id => getLessonIdFromChunkId(id)).filter(Boolean))];
    let targetAllowed = null;

    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;

      const allowed = { ...s.allowedCurriculum };
      allowed.chapters = [...new Set([...(allowed.chapters || []), chapterId])];
      allowed.lessons = [...new Set([...(allowed.lessons || []), ...lessonIds])];
      allowed.chunks = [...new Set([...(allowed.chunks || []), ...chunkIds])];

      targetAllowed = allowed;
      return { ...s, allowedCurriculum: allowed };
    }));

    if (targetAllowed) {
      import('../services/studentService').then(({ updateStudentInSupabase }) => {
        updateStudentInSupabase(studentId, { allowedCurriculum: targetAllowed })
          .catch(err => console.warn('Supabase unlockEntireChapter error:', err));
      }).catch(() => {});
    }

    playSound.levelUp();
  };

  /**
   * فتح جميع فقرات درس معين لطالب بضغطة زر واحدة
   */
  const unlockEntireLesson = (studentId, lessonId) => {
    const [ch, l] = lessonId.split('-');
    const chunkIds = ALL_CHUNK_IDS.filter(id => id.startsWith(`ch${ch}-l${l}-`));
    const chapterId = parseInt(ch, 10);
    let targetAllowed = null;

    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;

      const allowed = { ...s.allowedCurriculum };
      if (chapterId) {
        allowed.chapters = [...new Set([...(allowed.chapters || []), chapterId])];
      }
      allowed.lessons = [...new Set([...(allowed.lessons || []), lessonId])];
      allowed.chunks = [...new Set([...(allowed.chunks || []), ...chunkIds])];

      targetAllowed = allowed;
      return { ...s, allowedCurriculum: allowed };
    }));

    if (targetAllowed) {
      import('../services/studentService').then(({ updateStudentInSupabase }) => {
        updateStudentInSupabase(studentId, { allowedCurriculum: targetAllowed })
          .catch(err => console.warn('Supabase unlockEntireLesson error:', err));
      }).catch(() => {});
    }

    playSound.levelUp();
  };

  /**
   * قفل جميع فقرات درس معين لطالب
   */
  const lockEntireLesson = (studentId, lessonId) => {
    const [ch, l] = lessonId.split('-');
    const chunkIds = ALL_CHUNK_IDS.filter(id => id.startsWith(`ch${ch}-l${l}-`));
    let targetAllowed = null;

    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;

      const allowed = { ...s.allowedCurriculum };
      allowed.lessons = (allowed.lessons || []).filter(lId => lId !== lessonId);
      allowed.chunks = (allowed.chunks || []).filter(c => !chunkIds.includes(c));

      targetAllowed = allowed;
      return { ...s, allowedCurriculum: allowed };
    }));

    if (targetAllowed) {
      import('../services/studentService').then(({ updateStudentInSupabase }) => {
        updateStudentInSupabase(studentId, { allowedCurriculum: targetAllowed })
          .catch(err => console.warn('Supabase lockEntireLesson error:', err));
      }).catch(() => {});
    }

    playSound.click();
  };

  /**
   * فتح المنهج تتابعياً حتى محطة معينة (Sequential unlock up to chunk)
   */
  const unlockUpToChunk = (studentId, targetChunkId) => {
    const targetIndex = ALL_CHUNK_IDS.indexOf(targetChunkId);
    if (targetIndex < 0) return;

    const chunkIds = ALL_CHUNK_IDS.slice(0, targetIndex + 1);
    const chapterIds = [...new Set(chunkIds.map(id => getChapterIdFromChunkId(id)).filter(Boolean))];
    const lessonIds = [...new Set(chunkIds.map(id => getLessonIdFromChunkId(id)).filter(Boolean))];
    let targetAllowed = null;

    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;

      const allowed = { ...s.allowedCurriculum };
      allowed.chapters = [...new Set([...(allowed.chapters || []), ...chapterIds])];
      allowed.lessons = [...new Set([...(allowed.lessons || []), ...lessonIds])];
      allowed.chunks = [...new Set([...(allowed.chunks || []), ...chunkIds])];

      targetAllowed = allowed;
      return { ...s, allowedCurriculum: allowed };
    }));

    if (targetAllowed) {
      import('../services/studentService').then(({ updateStudentInSupabase }) => {
        updateStudentInSupabase(studentId, { allowedCurriculum: targetAllowed })
          .catch(err => console.warn('Supabase unlockUpToChunk error:', err));
      }).catch(() => {});
    }

    playSound.levelUp();
  };

  /**
   * فحص ما إذا كانت الفقرة مفتوحة ومتاحة للطالب:
   * 1. الطالب حسابه معتمد (Approved).
   * 2. الصلاحيات الفردية المخصصة للطالب من الأستاذ (allowedCurriculum) تفتح له المحطة فوراً!
   * 3. إذا كان الطالب في مجموعة دراسية، فإن محطات المجموعة المشروحة أو الواجب مفتوحة له.
   * 4. أي فقرة أتمها الطالب مسبقاً تظل مفتوحة للمراجعة دائماً.
   */
  const isChunkUnlocked = (chunkId) => {
    if (!currentStudent) return false;

    // فحص وضع الأستاذ أو حساب الماستر للاختبار والمعاينة: المنهج بالكامل متاح 100%
    const studentEmail = (currentStudent.email || '').toLowerCase().trim();
    if (
      isTeacherMode || 
      currentStudent.isMasterTeacher || 
      isMasterTeacherEmail(studentEmail)
    ) {
      return true;
    }

    if (currentStudent.status !== 'approved') return false;

    // 1. أي فقرة مكتملة تظل مفتوحة دائماً للمراجعة
    if (currentStudent.completedChunks?.includes(chunkId)) return true;

    const chapterId = getChapterIdFromChunkId(chunkId);
    const lessonId = getLessonIdFromChunkId(chunkId);
    if (!chapterId || !lessonId) return false;

    // 2. فحص الصلاحيات الفردية المباشرة الممنوحة للطالب من الأستاذ (الأولوية العليا)
    const allowed = currentStudent.allowedCurriculum;
    if (allowed) {
      if (allowed.chunks && allowed.chunks.includes(chunkId)) return true;
      if (allowed.chapters && allowed.chapters.includes(chapterId) && allowed.lessons && allowed.lessons.includes(lessonId)) {
        if (!allowed.chunks || allowed.chunks.includes(chunkId)) return true;
      }
    }

    // 3. إذا كان الطالب مرتبطاً بمجموعة دراسية، فالمجموعة هي المرجع للفقرات المشروحة
    if (currentStudentGroup) {
      const isGroupUnlocked = currentStudentGroup.unlockedChunks?.includes(chunkId) || 
                              currentStudentGroup.homeworkChunks?.includes(chunkId);
      if (isGroupUnlocked) {
        // إذا كان واجباً منزلياً فهو متاح مباشرة للدراسة والحل
        if (currentStudentGroup.homeworkChunks?.includes(chunkId)) return true;

        // تسلسل المراحل العادي
        const currentIndex = ALL_CHUNK_IDS.indexOf(chunkId);
        if (currentIndex <= 0) return true;
        const prevNodeId = ALL_CHUNK_IDS[currentIndex - 1];
        return currentStudent.completedChunks?.includes(prevNodeId);
      }
    }

    return false;
  };


  // حالة تحرك المرشد الآلي بين المحطات مع التهنئة بالنسبة
  const [robotMovingState, setRobotMovingState] = useState({
    isMoving: false,
    fromChunkId: null,
    toChunkId: null,
    score: 100
  });

  const triggerRobotMove = (fromChunkId, toChunkId, score = 100) => {
    setActiveModal(null);
    setActiveChunk(null);
    setRobotMovingState({
      isMoving: true,
      fromChunkId,
      toChunkId,
      score
    });
  };

  const clearRobotMove = () => {
    setRobotMovingState({
      isMoving: false,
      fromChunkId: null,
      toChunkId: null,
      score: 100
    });
  };

  /**
   * إكمال الفقرة أو الاختبار بنجاح ومنح النجوم (حتى 3 نجوم) والكؤوس
   */
  const markChunkCompleted = (chunkId, xp = 35, earnedStars = 1, isFullScoreWithDistinction = false, isBossExam = false) => {
    setStudents(prev => prev.map(s => {
      if (s.id !== currentStudentId) return s;

      const alreadyCompleted = s.completedChunks?.includes(chunkId) || false;
      const updatedCompleted = alreadyCompleted ? s.completedChunks : [...s.completedChunks, chunkId];

      const currentRating = s.chunkRatings?.[chunkId]?.stars || 0;
      const bestStars = Math.max(currentRating, earnedStars);
      const updatedRatings = {
        ...(s.chunkRatings || {}),
        [chunkId]: {
          stars: bestStars,
          fullScore: isFullScoreWithDistinction || (s.chunkRatings?.[chunkId]?.fullScore ?? false)
        }
      };

      // إضافة كأس الدرس إذا كان اختبار شامل
      let updatedTrophies = s.trophies ? [...s.trophies] : [];
      if (isBossExam && !updatedTrophies.includes(chunkId)) {
        updatedTrophies.push(chunkId);
      }

      const starsGain = alreadyCompleted ? Math.max(0, earnedStars - currentRating) : earnedStars;

      return {
        ...s,
        completedChunks: updatedCompleted,
        chunkRatings: updatedRatings,
        trophies: updatedTrophies,
        xp: s.xp + (alreadyCompleted ? Math.floor(xp / 2) : xp),
        stars: s.stars + starsGain
      };
    }));

    playSound.levelUp();
  };

  return (
    <AppContext.Provider
      value={{
        students,
        setStudents,
        currentStudent,
        currentStudentId,
        setCurrentStudentId,
        logoutStudent,
        isStudentLoggedIn,
        isTeacherMode,
        setIsTeacherMode,
        admins,
        currentAdmin,
        isSuperAdmin,
        loginAdmin,
        logoutAdmin,
        addAdminAccount,
        deleteAdminAccount,
        activeModal,
        setActiveModal,
        activeChunk,
        setActiveChunk,
        localizedActiveChunk: getLocalizedChunk(activeChunk, lang),
        getLocalizedChunk: (chunk) => getLocalizedChunk(chunk, lang),
        groups,
        currentStudentGroup,
        createGroup,
        updateGroup,
        deleteGroup,
        assignStudentToGroup,
        toggleGroupChunk,
        unlockEntireChapterForGroup,
        lockEntireChapterForGroup,
        unlockEntireLessonForGroup,
        lockEntireLessonForGroup,
        updateGroupHomeworkNote,
        isChunkHomework,
        currentTermTooltip,
        setCurrentTermTooltip,
        pendingStudentsCount,
        refreshStudentsFromCloud,
        isSyncingStudents,
        registerNewStudent,
        updateStudentProfile,
        updateStudentPhones,
        updateStudentStatus,
        approveStudentWithGroup,
        deleteStudent,
        logStudentWrongAnswer,
        resetStudentQuizChunk,
        getStudentCurrentStation,
        toggleStudentCurriculum,
        unlockEntireChapter,
        unlockEntireLesson,
        lockEntireLesson,
        unlockUpToChunk,
        isChunkUnlocked,
        markChunkCompleted,
        robotMovingState,
        triggerRobotMove,
        clearRobotMove,
        theme,
        toggleTheme,
        lang,
        toggleLang,
        t,
        currentPage,
        setCurrentPage,
        installApp,
        installPrompt,
        isStandalone,
        canInstall: !isStandalone
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
