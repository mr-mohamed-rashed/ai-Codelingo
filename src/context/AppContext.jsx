import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { CURRICULUM_DATA, CHAPTERS_METADATA } from '../data/curriculumData';
import { TRANSLATIONS } from '../data/translations';
import { CURRICULUM_ENGLISH, getLocalizedChunk } from '../data/curriculumEnglish';
import { playSound } from '../utils/audioEngine';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

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

// قائمة الطلاب المعتمدة - تبدأ فارغة تماماً دون أي حسابات افتراضية
export const INITIAL_STUDENTS = [];


export const AppProvider = ({ children }) => {
  // Theme state: 'light' | 'dark' (المود الأساسي هو اللايت Light)
  const [theme, setTheme] = useState(() => {
    const userChoice = localStorage.getItem('agy_theme_user_choice');
    if (userChoice === 'dark' || userChoice === 'light') {
      return userChoice;
    }
    return 'light'; // الأساسي الافتراضي لايت
  });

  // Language state: 'ar' | 'en' (اللغة الأساسية هي العربية Arabic)
  const [lang, setLang] = useState(() => {
    const userChoice = localStorage.getItem('agy_lang_user_choice');
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
      localStorage.setItem('agy_theme_user_choice', next);
      localStorage.setItem('agy_theme', next);
      return next;
    });
  };

  // Toggle Language (تبديل اللغة وحفظ الاختيار تلقائياً)
  const toggleLang = () => {
    playSound.click();
    setLang(prev => {
      const next = prev === 'ar' ? 'en' : 'ar';
      localStorage.setItem('agy_lang_user_choice', next);
      localStorage.setItem('agy_lang', next);
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
    localStorage.setItem('agy_theme_user_choice', theme);
    localStorage.setItem('agy_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    document.body.className = theme === 'light' ? 'theme-light' : 'theme-dark';
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('agy_lang_user_choice', lang);
    localStorage.setItem('agy_lang', lang);
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  }, [lang]);

  // حفظ واسترجاع بيانات الطلاب من التخزين المحلي (نسخة v3 المحدثة مع سجل الأخطاء والمراكز)
  // حفظ واسترجاع بيانات الطلاب من التخزين المحلي (نسخة نظيفة خالية من الحسابات الوهمية)
  const [students, setStudents] = useState(() => {
    try {
      // إزالة ومسح أي نسخ قديمة من التخزين كانت تحتوي على حسابات افتراضية
      localStorage.removeItem('agy_students_list_v3');
      localStorage.removeItem('agy_students_list_v2');
      localStorage.removeItem('agy_students_list');

      const saved = localStorage.getItem('agy_students_clean_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // استبعاد أي حسابات تجريبية قديمة تبدأ بـ std-00
          return parsed.filter(s => s && !String(s.id).startsWith('std-00'));
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_STUDENTS;
  });

  // حفظ واسترجاع بيانات المجموعات الدراسية
  const [groups, setGroups] = useState(() => {
    try {
      localStorage.removeItem('agy_groups_list_v3');
      const saved = localStorage.getItem('agy_groups_clean_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_GROUPS;
  });

  useEffect(() => {
    localStorage.setItem('agy_groups_clean_v1', JSON.stringify(groups));
  }, [groups]);

  // تحديث التخزين المحلي عند تغيير بيانات الطلاب
  useEffect(() => {
    localStorage.setItem('agy_students_clean_v1', JSON.stringify(students));
  }, [students]);

  // الطالب الحالي المسجل دخوله (إذا كان حساباً وهمياً يتم مسحه فوراً لطلب الدخول الفعلي)
  const [currentStudentId, setCurrentStudentId] = useState(() => {
    const savedId = localStorage.getItem('agy_current_student_id');
    if (savedId && String(savedId).startsWith('std-00')) {
      localStorage.removeItem('agy_current_student_id');
      return null;
    }
    return savedId || null;
  });

  // الصفحة المعروضة الحالية: 'home' (الرئيسية ومدرج الأوائل) أو 'content' (صفحة المحتوى ومسار التعلم)
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('agy_current_page') || 'home';
  });

  useEffect(() => {
    localStorage.setItem('agy_current_page', currentPage);
  }, [currentPage]);

  // تسجيل خروج الطالب
  const logoutStudent = () => {
    playSound.click();
    setCurrentStudentId(null);
    localStorage.removeItem('agy_current_student_id');
    setCurrentPage('home');
  };

  // وضع لوحة تحكم المعلم
  const [isTeacherMode, setIsTeacherMode] = useState(false);

  // إدارة حسابات المشرفين والأدمن
  const [admins, setAdmins] = useState(() => {
    try {
      const saved = localStorage.getItem('agy_admin_accounts');
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
      const saved = localStorage.getItem('agy_current_admin');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  // حفظ قائمة الأدمن في التخزين المحلي
  useEffect(() => {
    localStorage.setItem('agy_admin_accounts', JSON.stringify(admins));
  }, [admins]);

  // حفظ جلسة الأدمن الحالي
  useEffect(() => {
    if (currentAdmin) {
      localStorage.setItem('agy_current_admin', JSON.stringify(currentAdmin));
    } else {
      localStorage.removeItem('agy_current_admin');
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
  const logoutAdmin = () => {
    playSound.click();
    setCurrentAdmin(null);
    setIsTeacherMode(false);
    localStorage.removeItem('agy_current_admin');
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

  // التحكم في النوافذ المنبثقة
  const [activeModal, setActiveModal] = useState(null); // 'lesson' | 'ai_tutor' | 'quiz' | 'auth' | 'term_tooltip'
  const [activeChunk, setActiveChunk] = useState(null);
  const [currentTermTooltip, setCurrentTermTooltip] = useState(null);

  // تحديث التخزين المحلي عند تغيير بيانات الطلاب
  useEffect(() => {
    localStorage.setItem('agy_students_list', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    if (currentStudentId) {
      localStorage.setItem('agy_current_student_id', currentStudentId);
    } else {
      localStorage.removeItem('agy_current_student_id');
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
  const currentStudent = currentStudentId ? (students.find(s => s.id === currentStudentId) || students[0]) : guestStudent;
  const isStudentLoggedIn = Boolean(currentStudentId && currentStudentId !== 'guest' && students.some(s => s.id === currentStudentId));

  // المجموعة التي ينتمي إليها الطالب الحالي
  const currentStudentGroup = useMemo(() => {
    if (!currentStudent || !currentStudent.id) return null;
    return groups.find(g => 
      g.id === currentStudent.groupId || (g.studentIds && g.studentIds.includes(currentStudent.id))
    ) || null;
  }, [groups, currentStudent]);

  // عدد الطلاب في انتظار الموافقة
  const pendingStudentsCount = students.filter(s => s.status === 'pending').length;

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
   * تعيين طالب لمجموعة دراسية محددة
   */
  const assignStudentToGroup = (studentId, groupId) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, groupId } : s));
    setGroups(prev => prev.map(g => {
      const studentSet = new Set(g.studentIds || []);
      if (g.id === groupId) {
        studentSet.add(studentId);
      } else {
        studentSet.delete(studentId);
      }
      return { ...g, studentIds: Array.from(studentSet) };
    }));
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
    const chapterChunks = CURRICULUM_DATA.filter(c => c.chapterId === chapterId);
    const chunkIds = chapterChunks.map(c => c.id);

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
    const cleanName = (name || '').trim();
    const newStudent = {
      id: `std-${Date.now().toString().slice(-4)}`,
      name: cleanName,
      phone: (phone || '').trim(),
      guardianPhone: (guardianPhone || '').trim(),
      email: (email || '').trim(),
      avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanName || 'Student')}`,
      provider,
      status: "pending", // في انتظار اعتماد الأستاذ وتحديد المجموعة
      joinDate: new Date().toISOString().split('T')[0],
      groupId: null,
      xp: 0,
      stars: 0,
      streak: 1,
      completedChunks: [],
      chunkRatings: {},
      trophies: [],
      wrongAnswers: [],
      currentStation: "في انتظار تصريح المعلم وتحديد المجموعة",
      allowedCurriculum: {
        chapters: [1],
        lessons: ["1-1"],
        chunks: []
      }
    };

    setStudents(prev => [newStudent, ...prev]);
    setCurrentStudentId(newStudent.id);
    playSound.correct();
    return newStudent;
  };

  // المزامنة التلقائية مع جلسة تسجيل الدخول السحابي (Google / Facebook / Phone عبر Supabase)
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const handleOAuthUser = (user) => {
      if (!user || !user.email) return;
      const userEmail = user.email.toLowerCase();
      const existing = students.find(s => s.email && s.email.toLowerCase() === userEmail);
      if (existing) {
        if (currentStudentId !== existing.id) {
          setCurrentStudentId(existing.id);
        }
      } else {
        const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0];
        const userAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture || '';
        const provider = user.app_metadata?.provider || 'google';
        registerNewStudent({
          name: userName,
          email: user.email,
          avatar: userAvatar,
          provider
        });
      }
    };

    // فحص الجلسة عند تحميل الصفحة (إذا عاد الطالب من صفحة Google / Facebook)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        handleOAuthUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user && (event === 'SIGNED_IN' || event === 'USER_UPDATED')) {
        handleOAuthUser(session.user);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [isSupabaseConfigured, students, currentStudentId]);

  /**
   * تحديث وتعديل الملف الشخصي للطالب (الاسم، الصورة، رقم الهاتف، ورقم ولي الأمر)
   */
  const updateStudentProfile = (studentId, { name, phone, guardianPhone, email, avatar }) => {
    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;
      return {
        ...s,
        name: name !== undefined ? name.trim() : s.name,
        phone: phone !== undefined ? phone.trim() : s.phone,
        guardianPhone: guardianPhone !== undefined ? guardianPhone.trim() : (s.guardianPhone || ''),
        email: email !== undefined ? email.trim() : s.email,
        avatar: avatar || s.avatar
      };
    }));
    playSound.levelUp();
  };

  /**
   * اعتماد حساب الطالب مع تعيين مجموعته الدراسية مباشرة (مطلب أساسي لدخول الطالب)
   */
  const approveStudentWithGroup = (studentId, groupId) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return { 
          ...s, 
          status: 'approved', 
          groupId: groupId || null,
          currentStation: s.currentStation && !s.currentStation.includes('انتظار')
            ? s.currentStation 
            : 'الدرس 1-1: المراحل الخمس التاريخية لتطور الحوسبة'
        };
      }
      return s;
    }));

    if (groupId) {
      setGroups(prev => prev.map(g => {
        if (g.id === groupId) {
          const set = new Set(g.studentIds || []);
          set.add(studentId);
          return { ...g, studentIds: Array.from(set) };
        }
        return g;
      }));
    }

    playSound.levelUp();
  };

  /**
   * اعتماد أو تعليق حساب الطالب بواسطة الأستاذ
   */
  const updateStudentStatus = (studentId, newStatus) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return { ...s, status: newStatus };
      }
      return s;
    }));
    playSound.click();
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
    const chunkIndex = CURRICULUM_DATA.findIndex(c => c.id === lastChunkId);
    if (chunkIndex !== -1 && chunkIndex + 1 < CURRICULUM_DATA.length) {
      const nextChunk = CURRICULUM_DATA[chunkIndex + 1];
      return `${nextChunk.lessonTitle} • ${nextChunk.chunkTitle}`;
    }
    return lang === 'en' ? 'All Lessons Mastered 🏆' : 'أتم إتقان جميع محطات المنهج 🏆';
  };

  /**
   * تحكم الأستاذ في صلاحيات المنهج لكل طالب بشكل فردي
   */
  const toggleStudentCurriculum = (studentId, type, itemId) => {
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
      return { ...s, allowedCurriculum: currentAllowed };
    }));
    playSound.click();
  };

  /**
   * فتح جميع دروس فصل معين لطالب بضغطة زر واحدة من لوحة الأستاذ
   */
  const unlockEntireChapter = (studentId, chapterId) => {
    const chapterChunks = CURRICULUM_DATA.filter(c => c.chapterId === chapterId);
    const chunkIds = chapterChunks.map(c => c.id);
    const lessonIds = [...new Set(chapterChunks.map(c => c.lessonId))];

    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;

      const allowed = { ...s.allowedCurriculum };
      allowed.chapters = [...new Set([...(allowed.chapters || []), chapterId])];
      allowed.lessons = [...new Set([...(allowed.lessons || []), ...lessonIds])];
      allowed.chunks = [...new Set([...(allowed.chunks || []), ...chunkIds])];

      return { ...s, allowedCurriculum: allowed };
    }));
    playSound.levelUp();
  };

  /**
   * فتح جميع فقرات درس معين لطالب بضغطة زر واحدة
   */
  const unlockEntireLesson = (studentId, lessonId) => {
    const lessonChunks = CURRICULUM_DATA.filter(c => c.lessonId === lessonId);
    const chunkIds = lessonChunks.map(c => c.id);
    const chapterId = lessonChunks[0]?.chapterId;

    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;

      const allowed = { ...s.allowedCurriculum };
      if (chapterId) {
        allowed.chapters = [...new Set([...(allowed.chapters || []), chapterId])];
      }
      allowed.lessons = [...new Set([...(allowed.lessons || []), lessonId])];
      allowed.chunks = [...new Set([...(allowed.chunks || []), ...chunkIds])];

      return { ...s, allowedCurriculum: allowed };
    }));
    playSound.levelUp();
  };

  /**
   * قفل جميع فقرات درس معين لطالب
   */
  const lockEntireLesson = (studentId, lessonId) => {
    const lessonChunks = CURRICULUM_DATA.filter(c => c.lessonId === lessonId);
    const chunkIds = lessonChunks.map(c => c.id);

    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;

      const allowed = { ...s.allowedCurriculum };
      allowed.lessons = (allowed.lessons || []).filter(l => l !== lessonId);
      allowed.chunks = (allowed.chunks || []).filter(c => !chunkIds.includes(c));

      return { ...s, allowedCurriculum: allowed };
    }));
    playSound.click();
  };

  /**
   * فتح المنهج تتابعياً حتى محطة معينة (Sequential unlock up to chunk)
   */
  const unlockUpToChunk = (studentId, targetChunkId) => {
    const targetIndex = CURRICULUM_DATA.findIndex(c => c.id === targetChunkId);
    if (targetIndex < 0) return;

    const chunksToUnlock = CURRICULUM_DATA.slice(0, targetIndex + 1);
    const chunkIds = chunksToUnlock.map(c => c.id);
    const chapterIds = [...new Set(chunksToUnlock.map(c => c.chapterId))];
    const lessonIds = [...new Set(chunksToUnlock.map(c => c.lessonId))];

    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;

      const allowed = { ...s.allowedCurriculum };
      allowed.chapters = [...new Set([...(allowed.chapters || []), ...chapterIds])];
      allowed.lessons = [...new Set([...(allowed.lessons || []), ...lessonIds])];
      allowed.chunks = [...new Set([...(allowed.chunks || []), ...chunkIds])];

      return { ...s, allowedCurriculum: allowed };
    }));
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
    if (!currentStudent || currentStudent.status !== 'approved') return false;

    // 1. أي فقرة مكتملة تظل مفتوحة دائماً للمراجعة
    if (currentStudent.completedChunks?.includes(chunkId)) return true;

    const chunk = CURRICULUM_DATA.find(c => c.id === chunkId);
    if (!chunk) return false;

    // 2. فحص الصلاحيات الفردية المباشرة الممنوحة للطالب من الأستاذ (الأولوية العليا)
    const allowed = currentStudent.allowedCurriculum;
    if (allowed) {
      if (allowed.chunks && allowed.chunks.includes(chunkId)) return true;
      if (allowed.chapters && allowed.chapters.includes(chunk.chapterId) && allowed.lessons && allowed.lessons.includes(chunk.lessonId)) {
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
        const currentIndex = CURRICULUM_DATA.findIndex(c => c.id === chunkId);
        if (currentIndex <= 0) return true;
        const prevNode = CURRICULUM_DATA[currentIndex - 1];
        return currentStudent.completedChunks?.includes(prevNode.id);
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
        updateGroupHomeworkNote,
        isChunkHomework,
        currentTermTooltip,
        setCurrentTermTooltip,
        pendingStudentsCount,
        registerNewStudent,
        updateStudentProfile,
        updateStudentStatus,
        approveStudentWithGroup,
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
