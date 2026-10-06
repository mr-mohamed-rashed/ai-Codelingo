import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Phone, 
  Mail, 
  Flame, 
  Star, 
  Sliders, 
  Unlock, 
  Lock, 
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
  School,
  Calendar,
  MapPin,
  BookOpenCheck,
  Check,
  X,
  Sparkles,
  Layers,
  Save,
  UserCheck,
  Crown,
  LogOut,
  KeyRound,
  ShieldAlert,
  AlertCircle,
  UserPlus,
  Eye,
  EyeOff,
  Target,
  AlertTriangle,
  RefreshCw,
  MessageSquare,
  HelpCircle,
  FileQuestion,
  Award,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CHAPTERS_METADATA, CURRICULUM_DATA } from '../data/curriculumData';
import { CURRICULUM_ENGLISH } from '../data/curriculumEnglish';
import { playSound } from '../utils/audioEngine';

export default function TeacherDashboard() {
  const { 
    students = [], 
    groups = [],
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
    setIsTeacherMode,
    setCurrentStudentId,
    currentStudentId,
    admins = [],
    currentAdmin,
    isSuperAdmin,
    addAdminAccount,
    deleteAdminAccount,
    logoutAdmin,
    lang,
    t
  } = useApp();

  // مصفوفات آمنة مع حماية قصوى ضد القيم الفارغة والـ TDZ
  const safeGroups = Array.isArray(groups) ? groups.filter(Boolean) : [];
  const safeStudents = Array.isArray(students) ? students.filter(Boolean) : [];

  // التبويب النشط: المجموعات والواجبات | الطلاب والاشتراكات | إدارة المشرفين
  const [activeTab, setActiveTab] = useState('groups'); // 'groups' | 'students' | 'admins'

  // إدارة حسابات الأدمن والمشرفين (Super Admin)
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [showNewAdminPassword, setShowNewAdminPassword] = useState(false);
  const [adminFormError, setAdminFormError] = useState('');
  const [adminSearchQuery, setAdminSearchQuery] = useState('');

  // إعدادات وتصريح مفاتيح Google Cloud و Meta (Facebook) OAuth
  const [googleClientIdInput, setGoogleClientIdInput] = useState(() => {
    return localStorage.getItem('agy_google_client_id') || import.meta.env?.VITE_GOOGLE_CLIENT_ID || '';
  });
  const [fbAppIdInput, setFbAppIdInput] = useState(() => {
    return localStorage.getItem('agy_fb_app_id') || import.meta.env?.VITE_FACEBOOK_APP_ID || '';
  });
  const [oauthSaveSuccess, setOauthSaveSuccess] = useState(false);

  const handleSaveOAuthKeys = (e) => {
    e.preventDefault();
    if (googleClientIdInput.trim()) {
      localStorage.setItem('agy_google_client_id', googleClientIdInput.trim());
    } else {
      localStorage.removeItem('agy_google_client_id');
    }
    if (fbAppIdInput.trim()) {
      localStorage.setItem('agy_fb_app_id', fbAppIdInput.trim());
    } else {
      localStorage.removeItem('agy_fb_app_id');
    }
    setOauthSaveSuccess(true);
    playSound.correct();
    setTimeout(() => setOauthSaveSuccess(false), 3000);
  };

  // حالة إظهار/قفل تفاصيل بطاقات المشرفين بـ "العين" (الأساسي مقفول افتراضياً)
  const [revealedAdminCards, setRevealedAdminCards] = useState({});
  const [revealedPasswords, setRevealedPasswords] = useState({});

  const toggleAdminCardDetails = (adminId) => {
    setRevealedAdminCards(prev => ({
      ...prev,
      [adminId]: !prev[adminId]
    }));
    playSound.click();
  };

  const toggleAdminPassword = (adminId) => {
    setRevealedPasswords(prev => ({
      ...prev,
      [adminId]: !prev[adminId]
    }));
    playSound.click();
  };

  // فلاتر وبحث
  const [searchQuery, setSearchQuery] = useState('');
  const [groupSearchQuery, setGroupSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all | pending | approved

  // نافذة تخصيص المنهج والواجب للمجموعة
  const [selectedGroupForCurriculum, setSelectedGroupForCurriculum] = useState(null);
  const [tempHomeworkNote, setTempHomeworkNote] = useState('');

  // نافذة مراجعة طلاب وتقدم المجموعة
  const [selectedGroupForReview, setSelectedGroupForReview] = useState(null);

  // نافذة تشخيص الأخطاء ونقاط الضعف للطالب
  const [selectedStudentForDiagnosis, setSelectedStudentForDiagnosis] = useState(null);

  // نافذة اعتماد الطالب مع اختيار المجموعة
  const [studentToApproveWithGroup, setStudentToApproveWithGroup] = useState(null);
  const [selectedGroupIdForApproval, setSelectedGroupIdForApproval] = useState('');

  // نافذة إنشاء أو تعديل مجموعة
  const [groupModalState, setGroupModalState] = useState({
    isOpen: false,
    mode: 'create', // 'create' | 'edit'
    groupId: null,
    name: '',
    schedule: '',
    location: '',
    color: '#6366f1',
    studentIds: [],
    homeworkNote: ''
  });

  // نافذة تخصيص المنهج الفردي للطالب (Direct Permissions)
  const [selectedStudentIdForCurriculum, setSelectedStudentIdForCurriculum] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState([1]); // Chapters open in drawer
  const [expandedLessons, setExpandedLessons] = useState(['1-1']); // Lessons open in drawer

  // نظام التنقل الهرمي للدروس والفقرات مع زر الرجوع (Back Button) للمجموعة
  const [groupCurriculumNav, setGroupCurriculumNav] = useState({
    level: 'chapters', // 'chapters' | 'lessons' | 'topics'
    chapterId: 1,
    lessonId: '1-1'
  });

  // نظام التنقل الهرمي للدروس والفقرات مع زر الرجوع (Back Button) للطالب الفردي
  const [studentCurriculumNav, setStudentCurriculumNav] = useState({
    level: 'chapters', // 'chapters' | 'lessons' | 'topics'
    chapterId: 1,
    lessonId: '1-1'
  });

  // الطالب النشط المحدد للتخصيص الفردي - متصل مباشرة بالحالة العامة لضمان عدم حدوث أي تجمد في الواجهة
  const activeCurriculumStudent = selectedStudentIdForCurriculum 
    ? (safeStudents.find(s => s?.id === selectedStudentIdForCurriculum) || null) 
    : null;

  // المجموعة النشطة المحددة لتخصيص المنهج والواجب للمجموعة
  const activeSelectedGroup = selectedGroupForCurriculum 
    ? (safeGroups.find(g => g?.id === selectedGroupForCurriculum.id) || selectedGroupForCurriculum) 
    : null;

  const toggleChapterExpand = (chapterId) => {
    setExpandedChapters(prev => 
      prev.includes(chapterId) 
        ? prev.filter(id => id !== chapterId) 
        : [...prev, chapterId]
    );
    playSound.click();
  };

  const toggleLessonExpand = (lessonId) => {
    setExpandedLessons(prev => 
      prev.includes(lessonId) 
        ? prev.filter(id => id !== lessonId) 
        : [...prev, lessonId]
    );
    playSound.click();
  };

  // فتح نافذة تخصيص المنهج والانتقال تلقائياً لآخر محطة وصلها الطالب
  const openStudentCurriculumModal = (student) => {
    setSelectedStudentIdForCurriculum(student.id);

    const allowedChunks = student.allowedCurriculum?.chunks || [];
    let latestChunk = null;
    if (allowedChunks.length > 0) {
      for (let i = CURRICULUM_DATA.length - 1; i >= 0; i--) {
        if (allowedChunks.includes(CURRICULUM_DATA[i].id)) {
          latestChunk = CURRICULUM_DATA[i];
          break;
        }
      }
    }
    if (!latestChunk) {
      latestChunk = CURRICULUM_DATA[0];
    }

    setStudentCurriculumNav({
      level: 'chapters',
      chapterId: latestChunk.chapterId,
      lessonId: latestChunk.lessonId
    });

    playSound.click();
  };

  const scrollToLastStation = (targetChunkId) => {
    const el = document.getElementById(`perm-chunk-${targetChunkId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      playSound.click();
    }
  };

  // فتح نافذة إنشاء مجموعة جديدة
  const handleOpenCreateGroup = () => {
    setGroupModalState({
      isOpen: true,
      mode: 'create',
      groupId: null,
      name: '',
      schedule: 'الأحد والثلاثاء (5:00 - 7:00 م)',
      location: 'سنتر الأوائل - الدقي',
      color: '#6366f1',
      studentIds: [],
      homeworkNote: 'مراجعة الجزء المشروح وحل بنك الأسئلة وتحقيق 90% فأعلى للاجتياز.'
    });
    playSound.click();
  };

  // فتح نافذة تعديل مجموعة
  const handleOpenEditGroup = (group) => {
    setGroupModalState({
      isOpen: true,
      mode: 'edit',
      groupId: group.id,
      name: group.name,
      schedule: group.schedule,
      location: group.location,
      color: group.color || '#6366f1',
      studentIds: group.studentIds || [],
      homeworkNote: group.homeworkNote || ''
    });
    playSound.click();
  };

  // حفظ المجموعة (إنشاء أو تعديل)
  const handleSaveGroup = (e) => {
    e.preventDefault();
    if (!groupModalState.name.trim()) return;

    if (groupModalState.mode === 'create') {
      createGroup({
        name: groupModalState.name,
        schedule: groupModalState.schedule,
        location: groupModalState.location,
        color: groupModalState.color,
        studentIds: groupModalState.studentIds,
        homeworkNote: groupModalState.homeworkNote
      });
    } else {
      updateGroup(groupModalState.groupId, {
        name: groupModalState.name,
        schedule: groupModalState.schedule,
        location: groupModalState.location,
        color: groupModalState.color,
        studentIds: groupModalState.studentIds,
        homeworkNote: groupModalState.homeworkNote
      });
    }

    setGroupModalState(prev => ({ ...prev, isOpen: false }));
    playSound.correct();
  };

  // فتح نافذة تعيين المنهج والواجب للمجموعة
  const handleOpenGroupCurriculum = (group) => {
    setSelectedGroupForCurriculum(group);
    setTempHomeworkNote(group.homeworkNote || '');
    setGroupCurriculumNav({
      level: 'chapters',
      chapterId: 1,
      lessonId: '1-1'
    });
    playSound.click();
  };

  // حفظ ملاحظة الواجب للمجموعة
  const handleSaveHomeworkNote = () => {
    if (selectedGroupForCurriculum) {
      updateGroupHomeworkNote(selectedGroupForCurriculum.id, tempHomeworkNote);
      playSound.correct();
    }
  };

  // إحصائيات عامة وفلاتر لوحة التحكم
  const totalGroups = safeGroups.length;
  const totalStudents = safeStudents.length;
  const pendingStudents = safeStudents.filter(s => s?.status === 'pending');
  const approvedStudents = safeStudents.filter(s => s?.status === 'approved');
  const totalUnlockedAcrossGroups = Array.from(new Set(safeGroups.flatMap(g => (g?.unlockedChunks && Array.isArray(g.unlockedChunks)) ? g.unlockedChunks : []))).length;

  const filteredGroups = safeGroups.filter(g => 
    (g.name || '').toLowerCase().includes(groupSearchQuery.toLowerCase()) || 
    (g.location || '').toLowerCase().includes(groupSearchQuery.toLowerCase())
  );

  const filteredStudents = safeStudents.filter(student => {
    if (!student) return false;
    const matchesSearch = 
      (student.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.phone || '').includes(searchQuery) ||
      (student.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && student.status === filterStatus;
  });

  return (
    <div className="teacher-dashboard-overlay">
      <div className="teacher-dashboard-container">
        {/* رأس لوحة التحكم الفاخر */}
        <div className="teacher-header">
          <div className="teacher-title-group">
            <div className="teacher-badge-pill">
              <ShieldCheck size={18} className="text-emerald-400" />
              <span>{lang === 'en' ? 'Academic Administration Panel • CS & AI Curriculum' : 'لوحة الإدارة الأكاديمية • مسار البرمجة والذكاء الاصطناعي'}</span>
            </div>
            <h1 className="teacher-main-title">
              {lang === 'en' ? 'Study Groups & Homework Assignment Management' : 'إدارة المجموعات وتحديد المنهج المشروح والواجب المنزلي'}
            </h1>
            <p className="teacher-subtitle">
              {lang === 'en' 
                ? 'Create classes, assign explained curriculum topics, set homework with strict 90% mastery, and manage students.'
                : 'أنشئ مجموعاتك، حدد الأجزاء المشروحة في الحصة، وعيّن الواجبات المنزلية بدقة لكل مجموعة مع متابعة تقدم الطلاب'
              }
            </p>
          </div>

          <div className="teacher-header-actions">
            {/* بطاقة تعريف المشرف / الأدمن الحالي مع زر تسجيل الخروج */}
            <div className="admin-user-hud-badge">
              <div className="admin-hud-avatar">
                {isSuperAdmin ? '👑' : '🛡️'}
              </div>
              <div className="admin-hud-info">
                <span className="admin-hud-name">
                  {currentAdmin ? currentAdmin.name : (lang === 'en' ? 'Administrator' : 'المشرف المعتمد')}
                </span>
                <span className="admin-hud-role">
                  {isSuperAdmin 
                    ? (lang === 'en' ? 'Super Admin (Master)' : 'سوبر أدمن (الماستر)') 
                    : (lang === 'en' ? 'Assistant Admin' : 'مشرف معتمد')
                  }
                </span>
              </div>
              <button 
                className="btn-admin-hud-logout"
                onClick={() => {
                  logoutAdmin();
                }}
                title={lang === 'en' ? 'Sign out from admin' : 'تسجيل خروج الأدمن'}
              >
                <LogOut size={16} />
              </button>
            </div>

            <button 
              className="duo-btn duo-btn-primary flex items-center gap-2"
              onClick={() => {
                setIsTeacherMode(false);
                playSound.click();
              }}
            >
              <ArrowRight size={18} />
              {t('backToMap')}
            </button>
          </div>
        </div>

        {/* بطاقات الإحصائيات الأربعة */}
        <div className="stats-cards-grid">
          <div className="stat-card">
            <div className="stat-icon-wrap bg-indigo-100 text-indigo-600">
              <School size={26} />
            </div>
            <div className="stat-info">
              <span className="stat-value text-indigo-600">{totalGroups}</span>
              <span className="stat-label">{lang === 'en' ? 'Active Groups' : 'مجموعات دراسية نشطة'}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrap bg-purple-100 text-purple-600">
              <BookOpen size={26} />
            </div>
            <div className="stat-info">
              <span className="stat-value text-purple-600">{totalUnlockedAcrossGroups}</span>
              <span className="stat-label">{lang === 'en' ? 'Explained Topics in Groups' : 'الفقرات المشروحة بالمجموعات'}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrap bg-emerald-100 text-emerald-600">
              <Users size={26} />
            </div>
            <div className="stat-info">
              <span className="stat-value text-emerald-600">{totalStudents}</span>
              <span className="stat-label">{lang === 'en' ? 'Enrolled Students' : 'إجمالي الطلاب المسجلين'}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrap bg-amber-100 text-amber-600">
              <Clock size={26} />
            </div>
            <div className="stat-info">
              <span className="stat-value text-amber-600">{pendingStudents.length}</span>
              <span className="stat-label">{lang === 'en' ? 'Pending Approval' : 'طلبات في انتظار الموافقة'}</span>
            </div>
          </div>
        </div>

        {/* التبويب الرئيسي: المجموعات والواجبات | الطلاب والاشتراكات */}
        <div className="teacher-tabs-nav">
          <button 
            className={`teacher-tab-btn ${activeTab === 'groups' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('groups');
              playSound.click();
            }}
          >
            <School size={20} />
            <span>{t('tabGroups')} ({groups.length})</span>
          </button>

          <button 
            className={`teacher-tab-btn ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('students');
              playSound.click();
            }}
          >
            <Users size={20} />
            <span>{t('tabStudents')} ({students.length})</span>
            {pendingStudents.length > 0 && (
              <span className="tab-pending-badge">{pendingStudents.length}</span>
            )}
          </button>

          {isSuperAdmin && (
            <button 
              className={`teacher-tab-btn ${activeTab === 'admins' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('admins');
                playSound.click();
              }}
            >
              <Crown size={20} className="text-amber-400" />
              <span>{lang === 'en' ? 'Admins & Staff' : 'إدارة المشرفين والأدمن'} ({admins.length})</span>
            </button>
          )}
        </div>

        {/* ========================================================= */}
        {/* التبويب 1: المجموعات والواجبات (Groups & Homework) */}
        {/* ========================================================= */}
        {activeTab === 'groups' && (
          <div className="groups-management-section">
            <div className="groups-toolbar-row">
              <div className="search-input-wrap flex-1">
                <Search size={20} className="search-icon" />
                <input 
                  type="text"
                  placeholder={lang === 'en' ? 'Search by group name, center or schedule...' : 'ابحث باسم المجموعة، السنتر، أو الموعد...'}
                  value={groupSearchQuery}
                  onChange={(e) => setGroupSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>

              <button 
                className="duo-btn duo-btn-primary flex items-center gap-2"
                onClick={handleOpenCreateGroup}
              >
                <Plus size={20} />
                <span>{t('createGroup')}</span>
              </button>
            </div>

            {/* شبكة كروت المجموعات */}
            {filteredGroups.length === 0 ? (
              <div className="empty-students-state">
                <School size={54} className="text-slate-400" />
                <h3>{t('noGroupsYet')}</h3>
                <p>{lang === 'en' ? 'Click "Create New Group" to get started.' : 'اضغط على زر "إنشاء مجموعة جديدة" لتنظيم مواعيد السناتر والواجبات.'}</p>
                <button 
                  className="duo-btn duo-btn-primary mt-4"
                  onClick={handleOpenCreateGroup}
                >
                  <Plus size={18} />
                  <span>{t('createGroup')}</span>
                </button>
              </div>
            ) : (
              <div className="groups-cards-grid">
                {filteredGroups.map((group) => {
                  const groupStudents = safeStudents.filter(s => 
                    s && (s.groupId === group.id || (Array.isArray(group.studentIds) && group.studentIds.includes(s.id)))
                  );
                  const unlockedCount = group.unlockedChunks?.length || 0;
                  const homeworkCount = group.homeworkChunks?.length || 0;

                  return (
                    <div key={group.id} className="group-card">
                      {/* رأس بطاقة المجموعة */}
                      <div className="group-card-header">
                        <div className="group-title-col">
                          <div className="flex items-center gap-2.5">
                            <span 
                              className="group-color-dot" 
                              style={{ backgroundColor: group.color || '#6366f1' }}
                            />
                            <h3 className="group-card-title">{group.name}</h3>
                          </div>
                          <div className="group-badges-row">
                            <span className="group-meta-pill">
                              <Calendar size={13} />
                              <span>{group.schedule}</span>
                            </span>
                            <span className="group-meta-pill">
                              <MapPin size={13} />
                              <span>{group.location}</span>
                            </span>
                          </div>
                        </div>

                        <div className="group-header-actions">
                          <button 
                            className="group-icon-btn" 
                            title={t('editGroup')}
                            onClick={() => handleOpenEditGroup(group)}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            className="group-icon-btn btn-danger-icon" 
                            title={t('deleteGroup')}
                            onClick={() => {
                              if (window.confirm(lang === 'en' ? 'Delete this group?' : 'هل أنت متأكد من حذف هذه المجموعة؟')) {
                                deleteGroup(group.id);
                              }
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* إحصائيات المنهج والواجب للطلاب */}
                      {/* إحصائيات المنهج والطلاب */}
                      <div className="group-stats-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
                        <div className="group-stat-chip chip-unlocked">
                          <BookOpen size={16} className="text-emerald-500" />
                          <div>
                            <span className="stat-num">{unlockedCount}</span>
                            <span className="stat-desc">{lang === 'en' ? 'Explained Topics' : 'الفقرات المشروحة'}</span>
                          </div>
                        </div>

                        <div className="group-stat-chip chip-students">
                          <Users size={16} className="text-blue-500" />
                          <div>
                            <span className="stat-num">{groupStudents.length}</span>
                            <span className="stat-desc">{t('groupStudents')}</span>
                          </div>
                        </div>
                      </div>

                      {/* طلاب المجموعة المصغرون */}
                      <div className="group-students-preview-bar">
                        <span className="preview-label">{lang === 'en' ? 'Students:' : 'الطلاب:'}</span>
                        {groupStudents.length === 0 ? (
                          <span className="text-xs text-slate-400 italic">
                            {lang === 'en' ? 'No students assigned yet' : 'لم يتم ربط طلاب بهذه المجموعة بعد'}
                          </span>
                        ) : (
                          <div className="avatars-overlap-row">
                            {groupStudents.slice(0, 5).map(s => (
                              <img 
                                key={s.id} 
                                src={s.avatar} 
                                alt={s.name} 
                                title={s.name}
                                className="avatar-overlap-img"
                              />
                            ))}
                            {groupStudents.length > 5 && (
                              <span className="avatar-more-count">+{groupStudents.length - 5}</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* أزرار العمليات للمجموعة */}
                      <div className="group-actions-row">
                        <button 
                          className="duo-btn duo-btn-success"
                          onClick={() => {
                            setSelectedGroupForReview(group);
                            playSound.click();
                          }}
                          title={lang === 'en' ? 'Review student scores, stations and mistakes in this group' : 'متابعة أين يقف كل طالب ودرجاته ونقاط ضعفه في المجموعة'}
                        >
                          <Users size={16} />
                          <span>{lang === 'en' ? `Students (${groupStudents.length})` : `مراجعة الطلاب (${groupStudents.length}) 👥`}</span>
                        </button>

                        <button 
                          className="duo-btn duo-btn-primary"
                          onClick={() => handleOpenGroupCurriculum(group)}
                        >
                          <Sliders size={16} />
                          <span>{lang === 'en' ? 'Topics' : 'المشروح بالحصة 📚'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* التبويب 2: الطلاب والاشتراكات الفردية (Students Tab) */}
        {/* ========================================================= */}
        {activeTab === 'students' && (
          <div className="students-management-section">
            <div className="students-filter-bar">
              <div className="search-input-wrap">
                <Search size={20} className="search-icon" />
                <input 
                  type="text"
                  placeholder={lang === 'en' ? 'Search by student name, phone or email...' : 'ابحث باسم الطالب، رقم التليفون، أو بريد Gmail...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="filter-buttons-group">
                <button 
                  className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('all')}
                >
                  {lang === 'en' ? `All (${students.length})` : `جميع الطلاب (${students.length})`}
                </button>
                <button 
                  className={`filter-btn ${filterStatus === 'pending' ? 'active-warning' : ''}`}
                  onClick={() => setFilterStatus('pending')}
                >
                  {lang === 'en' ? `Pending (${pendingStudents.length})` : `في الانتظار (${pendingStudents.length})`}
                </button>
                <button 
                  className={`filter-btn ${filterStatus === 'approved' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('approved')}
                >
                  {lang === 'en' ? `Approved (${approvedStudents.length})` : `المعتمدون (${approvedStudents.length})`}
                </button>
              </div>
            </div>

            {/* جدول الطلاب */}
            <div className="students-table-card">
              {filteredStudents.length === 0 ? (
                <div className="empty-students-state">
                  <Users size={48} className="text-slate-300" />
                  <h3>{lang === 'en' ? 'No students match your query' : 'لا يوجد طلاب يطابقون خيارات البحث'}</h3>
                  <p>{lang === 'en' ? 'Try adjusting your search query or status filter' : 'جرّب تعديل كلمة البحث أو فلتر الحالة لعرض المسجلين'}</p>
                </div>
              ) : (
                <div className="students-list">
                  {filteredStudents.map((student) => {
                    const isSelectedForPreview = student.id === currentStudentId;
                    const completedCount = student.completedChunks ? student.completedChunks.length : 0;
                    const studentGroup = groups.find(g => 
                      g.id === student.groupId || (g.studentIds && g.studentIds.includes(student.id))
                    );

                    return (
                      <div 
                        key={student.id} 
                        className={`student-row-card ${student.status === 'pending' ? 'row-pending' : ''} ${isSelectedForPreview ? 'row-active-user' : ''}`}
                      >
                        <div className="student-profile-col">
                          <img 
                            src={student.avatar} 
                            alt={student.name} 
                            className="student-avatar-img"
                          />
                          <div className="student-text-details">
                            <div className="student-name-row">
                              <h4 className="student-full-name">{student.name}</h4>
                              {student.status === 'pending' ? (
                                <span className="status-badge badge-pending">
                                  <Clock size={13} />
                                  {lang === 'en' ? 'Pending Approval' : 'في انتظار الموافقة'}
                                </span>
                              ) : (
                                <span className="status-badge badge-approved">
                                  <CheckCircle size={13} />
                                  {lang === 'en' ? 'Approved & Active' : 'معتمد ونشط'}
                                </span>
                              )}
                              {isSelectedForPreview && (
                                <span className="status-badge badge-current-view">
                                  {lang === 'en' ? 'Current Session' : 'الحساب المعروض حالياً'}
                                </span>
                              )}
                            </div>

                            <div className="student-contacts-row">
                              <a 
                                href={`https://wa.me/2${student.phone.replace(/[^0-9]/g, '')}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="contact-pill phone-pill"
                                title={lang === 'en' ? 'Chat on WhatsApp' : 'مراسلة الطالب مباشرة عبر واتساب'}
                              >
                                <Phone size={14} />
                                <span>{student.phone}</span>
                                <ExternalLink size={12} />
                              </a>
                              <span className="contact-pill email-pill">
                                <Mail size={14} />
                                <span>{student.email}</span>
                              </span>
                              {student.guardianPhone && (
                                <a 
                                  href={`https://wa.me/2${student.guardianPhone.replace(/[^0-9]/g, '')}`} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="contact-pill phone-pill"
                                  style={{ borderColor: '#10b981', color: '#047857', background: '#ecfdf5' }}
                                  title={lang === 'en' ? 'Chat with Guardian on WhatsApp' : 'مراسلة ولي الأمر مباشرة عبر واتساب'}
                                >
                                  <Users size={14} />
                                  <span>ولي الأمر: {student.guardianPhone}</span>
                                  <ExternalLink size={12} />
                                </a>
                              )}
                            </div>

                            {/* المحطة التي يقف عندها الطالب حالياً */}
                            <div className="student-station-badge-row flex items-center gap-1.5 mt-1.5">
                              <MapPin size={14} className="text-amber-500 flex-shrink-0" />
                              <span className="text-xs text-slate-500 font-bold">{lang === 'en' ? 'Standing at:' : 'واقف عند:'}</span>
                              <span className="station-name-text text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                                {getStudentCurrentStation ? getStudentCurrentStation(student) : (student.currentStation || 'الدرس 1-1')}
                              </span>
                            </div>

                            {/* تعيين المجموعة الدراسية للطالب */}
                            <div className="student-group-assignment-row">
                              <School size={15} className="text-indigo-500" />
                              <span className="text-xs font-bold text-slate-600">
                                {lang === 'en' ? 'Assigned Group:' : 'المجموعة الدراسية:'}
                              </span>
                              <select 
                                className="student-group-select"
                                value={student.groupId || ''}
                                onChange={(e) => assignStudentToGroup(student.id, e.target.value || null)}
                              >
                                <option value="">{lang === 'en' ? '-- No Group (Individual Access) --' : '-- بدون مجموعة (في الانتظار) --'}</option>
                                {groups.map(g => (
                                  <option key={g.id} value={g.id}>
                                    {g.name} ({g.schedule})
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* مقاييس إنجاز الطالب */}
                        <div className="student-progress-col">
                          <div className="progress-metric">
                            <span className="metric-val text-amber-500">
                              <Flame size={16} />
                              {student.xp} XP
                            </span>
                          </div>
                          <div className="progress-metric">
                            <span className="metric-val text-yellow-500">
                              <Star size={16} className="fill-yellow-400" />
                              {student.stars}
                            </span>
                          </div>
                          <div className="progress-metric">
                            <span className="metric-val text-indigo-600">
                              <BookOpen size={16} />
                              {completedCount} / {CURRICULUM_DATA.length} {lang === 'en' ? 'topics' : 'فقرة'}
                            </span>
                          </div>
                        </div>

                        {/* أزرار الإجراءات الفردية */}
                        <div className="student-actions-col">
                          {student.status === 'pending' ? (
                            <button
                              className="duo-btn duo-btn-success text-sm py-2 px-3 flex items-center gap-1.5"
                              onClick={() => {
                                setStudentToApproveWithGroup(student);
                                setSelectedGroupIdForApproval(groups[0]?.id || '');
                                playSound.click();
                              }}
                              title={lang === 'en' ? 'Approve and assign student to group' : 'اعتماد الطالب وتسكينه في مجموعته الدراسية'}
                            >
                              <CheckCircle size={16} />
                              <span>{lang === 'en' ? 'Approve & Assign Group' : 'اعتماد وتسكين بمجموعة 🚀'}</span>
                            </button>
                          ) : (
                            <button
                              className="duo-btn duo-btn-secondary text-sm py-2 px-3 flex items-center gap-1.5"
                              onClick={() => updateStudentStatus(student.id, 'pending')}
                              title={lang === 'en' ? 'Suspend account' : 'تعليق الحساب مؤقتاً'}
                            >
                              <Lock size={15} />
                              {lang === 'en' ? 'Suspend' : 'تعليق الحساب'}
                            </button>
                          )}

                          {/* زر تشخيص نقاط الضعف وسجل الأخطاء */}
                          <button
                            className="duo-btn text-sm py-2 px-3 flex items-center gap-1.5"
                            style={{ background: '#f59e0b', color: '#fff', borderBottomColor: '#d97706' }}
                            onClick={() => {
                              setSelectedStudentForDiagnosis(student);
                              playSound.click();
                            }}
                            title={lang === 'en' ? 'View wrong questions & diagnosis' : 'سجل الأسئلة الخاطئة ونقاط الضعف لإعادة الشرح'}
                          >
                            <Target size={15} />
                            <span>{lang === 'en' ? 'Diagnosis' : 'تشخيص الأخطاء 🎯'}</span>
                            {student.wrongAnswers && student.wrongAnswers.length > 0 && (
                              <span className="badge-errors-count bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                                {student.wrongAnswers.length}
                              </span>
                            )}
                          </button>

                          {/* زر تحديد المنهج الخاص بالطالب */}
                          <button
                            className="duo-btn duo-btn-primary text-sm py-2 px-3 flex items-center gap-1.5"
                            onClick={() => openStudentCurriculumModal(student)}
                            title={lang === 'en' ? 'Customize curriculum and unlock next stations' : 'تخصيص المنهج وفتح المحطات التالية للطالب'}
                          >
                            <Sliders size={16} />
                            <span>{lang === 'en' ? 'Permissions' : 'صلاحيات المنهج'}</span>
                          </button>

                          {/* زر حذف حساب الطالب نهائياً */}
                          <button
                            className="duo-btn duo-btn-danger text-sm py-2 px-3 flex items-center gap-1.5"
                            onClick={() => {
                              const confirmMsg = lang === 'en'
                                ? `Are you sure you want to permanently delete student "${student.name}"? This action cannot be undone.`
                                : `هل أنت متأكد من مسح حساب الطالب "${student.name}" نهائياً من المنصة؟ سيتم حذف جميع بياناته وتقدمه.`;
                              if (window.confirm(confirmMsg)) {
                                deleteStudent(student.id);
                              }
                            }}
                            title={lang === 'en' ? 'Permanently delete student account' : 'مسح حساب الطالب نهائياً من المنصة'}
                          >
                            <Trash2 size={15} />
                            <span>{lang === 'en' ? 'Delete' : 'مسح الطالب 🗑️'}</span>
                          </button>

                          {/* معاينة الحساب كطالب */}
                          {!isSelectedForPreview && (
                            <button
                              className="preview-as-student-btn"
                              onClick={() => {
                                setCurrentStudentId(student.id);
                                playSound.click();
                              }}
                              title={lang === 'en' ? 'Preview platform as this student' : 'التبديل لعرض المنصة من منظور هذا الطالب'}
                            >
                              {lang === 'en' ? 'Preview 👁️' : 'معاينة كطالب 👁️'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* التبويب 3: إدارة المشرفين والأدمن (خاص بالسوبر أدمن الماستر) */}
        {/* ========================================================= */}
        {isSuperAdmin && activeTab === 'admins' && (
          <div className="admins-management-section">
            {/* لافتة تعريف الماستر الذهبية */}
            <div className="master-superadmin-banner">
              <div className="master-banner-icon">
                <Crown size={32} className="text-amber-400" />
              </div>
              <div className="master-banner-text">
                <h3>{lang === 'en' ? 'Super Admin Master Control Panel' : 'لوحة تحكم السوبر أدمن الماستر (أ. محمد راشد)'}</h3>
                <p>
                  {lang === 'en' 
                    ? 'Only you as Master Super Admin can add, manage, or remove authorized staff & assistant admins. Each added admin can log in with their email and password to manage student groups and homework.'
                    : 'بصفتك السوبر أدمن الماستر (الوحيد المالك للصلاحيات العليا)، يمكنك إضافة حسابات مشرفين مساعدين وتعيين بريد إلكتروني وكلمة مرور لكل منهم، ليتمكنوا من تسجيل الدخول وإدارة المجموعات وتحديد الواجبات للطلاب.'
                  }
                </p>
              </div>
              <button 
                className="duo-btn duo-btn-success flex items-center gap-2"
                onClick={() => {
                  setNewAdminName('');
                  setNewAdminEmail('');
                  setNewAdminPassword('');
                  setAdminFormError('');
                  setAdminFormSuccess('');
                  setAdminModalOpen(true);
                  playSound.click();
                }}
              >
                <UserPlus size={18} />
                <span>{lang === 'en' ? 'Add New Admin' : 'إضافة أدمن جديد'}</span>
              </button>
            </div>

            {/* شريط البحث وتصفية المشرفين */}
            <div className="groups-toolbar-row">
              <div className="search-input-wrap flex-1">
                <Search size={20} className="search-icon" />
                <input 
                  type="text"
                  placeholder={lang === 'en' ? 'Search admins by name or email...' : 'ابحث عن المشرفين بالاسم أو البريد الإلكتروني...'}
                  value={adminSearchQuery}
                  onChange={e => setAdminSearchQuery(e.target.value)}
                  className="search-input"
                />
                {adminSearchQuery && (
                  <button className="clear-search-btn" onClick={() => setAdminSearchQuery('')}>
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* شبكة بطاقات المشرفين والأدمن */}
            <div className="admins-cards-grid">
              {admins
                .filter(a => 
                  a.name.toLowerCase().includes(adminSearchQuery.toLowerCase()) || 
                  a.email.toLowerCase().includes(adminSearchQuery.toLowerCase())
                )
                .map((admin) => {
                  const isThisMaster = admin.role === 'super_admin' || admin.email.toLowerCase() === 'mrrashed0777@gmail.com';
                  return (
                    <div 
                      key={admin.id} 
                      className={`admin-card-item ${isThisMaster ? 'is-master-card' : ''}`}
                    >
                      <div className="admin-card-header">
                        <div className="admin-header-main-info flex items-center gap-3">
                          <div className="admin-avatar-box">
                            {isThisMaster ? '👑' : '🛡️'}
                          </div>
                          <div className="admin-header-titles">
                            <h4 className="admin-name">{admin.name}</h4>
                            <span className={`admin-role-badge ${isThisMaster ? 'badge-super' : 'badge-staff'}`}>
                              {isThisMaster 
                                ? (lang === 'en' ? 'Super Admin (Master)' : 'سوبر أدمن • الماستر') 
                                : (lang === 'en' ? 'Assistant Admin' : 'مشرف معتمد')
                              }
                            </span>
                          </div>
                        </div>
                        {/* زر العين لقفل وفتح تفاصيل البطاقة وكلمة المرور */}
                        <button
                          type="button"
                          className={`btn-card-eye-toggle ${revealedAdminCards[admin.id] ? 'is-active' : ''}`}
                          onClick={() => toggleAdminCardDetails(admin.id)}
                          title={revealedAdminCards[admin.id] ? (lang === 'en' ? 'Lock & hide credentials' : 'قفل المكان وإخفاء البيانات') : (lang === 'en' ? 'Unlock & show credentials' : 'فتح المكان وإظهار البيانات')}
                        >
                          {revealedAdminCards[admin.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>

                      {/* المكان ده: مغلق افتراضياً بالعين، ويفتح عند النقر */}
                      {revealedAdminCards[admin.id] ? (
                        <div className="admin-card-details animate-fade-in">
                          <div className="admin-detail-line">
                            <Mail size={14} className="text-indigo-400" />
                            <span className="font-mono text-xs">{admin.email}</span>
                          </div>
                          <div className="admin-detail-line password-detail-line flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <KeyRound size={14} className="text-emerald-400" />
                              <span className="text-xs text-slate-300">
                                {lang === 'en' ? 'Password:' : 'كلمة المرور:'}{' '}
                                <span className="font-mono text-emerald-400 font-bold tracking-wider">
                                  {revealedPasswords[admin.id] ? admin.password : '••••••••••••'}
                                </span>
                              </span>
                            </div>
                            <button
                              type="button"
                              className="btn-inner-eye-pw"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleAdminPassword(admin.id);
                              }}
                              title={revealedPasswords[admin.id] ? (lang === 'en' ? 'Hide password' : 'إخفاء كلمة المرور') : (lang === 'en' ? 'Show password' : 'إظهار كلمة المرور')}
                            >
                              {revealedPasswords[admin.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                              <span>{revealedPasswords[admin.id] ? (lang === 'en' ? 'Hide' : 'إخفاء') : (lang === 'en' ? 'Show' : 'إظهار')}</span>
                            </button>
                          </div>
                          <div className="admin-detail-line">
                            <Clock size={14} className="text-slate-400" />
                            <span className="text-xs text-slate-400">
                              {lang === 'en' ? 'Created:' : 'تاريخ الإنشاء:'} {admin.createdAt || '2026-09-01'}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="admin-card-details-closed"
                          onClick={() => toggleAdminCardDetails(admin.id)}
                          title={lang === 'en' ? 'Click to show account details and password' : 'اضغط لإظهار بيانات الحساب وكلمة المرور'}
                        >
                          <div className="closed-icon-badge">
                            <EyeOff size={16} />
                          </div>
                          <div className="closed-text-col">
                            <span className="closed-title">
                              {lang === 'en' ? 'Account Details & Password Protected' : 'بيانات الحساب وكلمة المرور مقفولة'}
                            </span>
                            <span className="closed-subtitle">
                              {lang === 'en' ? 'Click eye icon or card to view' : 'اضغط على العين بالأعلى أو هنا لفتح العرض 👁️'}
                            </span>
                          </div>
                          <span className="btn-open-eye-pill">
                            <Eye size={13} />
                            <span>{lang === 'en' ? 'View' : 'فتح'}</span>
                          </span>
                        </div>
                      )}

                      <div className="admin-card-footer">
                        {isThisMaster ? (
                          <div className="master-protected-label">
                            <ShieldCheck size={14} className="text-amber-400" />
                            <span>{lang === 'en' ? 'Protected Master Account' : 'حساب الماستر الأساسي (محمي)'}</span>
                          </div>
                        ) : (
                          <button 
                            className="btn-delete-admin"
                            onClick={() => {
                              if (window.confirm(lang === 'en' ? `Are you sure you want to delete ${admin.name}?` : `هل أنت متأكد من حذف حساب الأدمن ${admin.name}؟`)) {
                                deleteAdminAccount(admin.id);
                                playSound.wrong();
                              }
                            }}
                            title={lang === 'en' ? 'Delete this admin account' : 'حذف هذا المشرف'}
                          >
                            <Trash2 size={15} />
                            <span>{lang === 'en' ? 'Delete Account' : 'حذف المشرف'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* قسم ربط تسجيل الدخول السحابي التلقائي (Google & Facebook) */}
            <div className="oauth-settings-card mt-8 p-6 rounded-2xl border border-indigo-500/30 bg-slate-900/60 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                  <KeyRound size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>{lang === 'en' ? 'Google Cloud & Facebook Sign-In Setup' : '🔑 ربط تصريح تسجيل الدخول التلقائي (Google & Facebook)'}</span>
                    <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                      خاص بالماستر فقط
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'en' 
                      ? 'Enter your Google Client ID and Facebook App ID to automatically fetch student real names and profile pictures.'
                      : 'أدخل معرّف Google Client ID و Facebook App ID لسحب اسم الطالب وصورته الحقيقية تلقائياً عند ضغطه على تسجيل الدخول.'
                    }
                  </p>
                </div>
              </div>

              {oauthSaveSuccess && (
                <div className="teacher-login-alert alert-success my-3 p-3 rounded-lg flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <CheckCircle size={18} />
                  <span>تم حفظ وتفعيل مفاتيح الربط السحابي بنجاح! جاهز للاستخدام الفوري.</span>
                </div>
              )}

              <form onSubmit={handleSaveOAuthKeys} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: googleClientIdInput ? '#10b981' : '#f59e0b' }}></span>
                    <span>معرّف عميل جوجل (Google OAuth Client ID)</span>
                    {googleClientIdInput ? (
                      <span className="text-emerald-400 text-xs font-semibold">(مفعل ومربوط ✓)</span>
                    ) : (
                      <span className="text-amber-400 text-xs font-semibold">(غير مدخل بعد ⚠️)</span>
                    )}
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: xxxxxxxxxxxx-xxxxxxxxxxxx.apps.googleusercontent.com"
                    value={googleClientIdInput}
                    onChange={(e) => setGoogleClientIdInput(e.target.value)}
                    className="form-input text-xs font-mono"
                    dir="ltr"
                  />
                  <span className="text-[11px] text-slate-400 block mt-1">
                    يتم نسخه من Google Cloud Console (APIs & Services &gt; Credentials &gt; OAuth 2.0 Client IDs).
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: fbAppIdInput ? '#10b981' : '#f59e0b' }}></span>
                    <span>معرّف تطبيق فيسبوك (Facebook App ID)</span>
                    {fbAppIdInput ? (
                      <span className="text-emerald-400 text-xs font-semibold">(مفعل ومربوط ✓)</span>
                    ) : (
                      <span className="text-amber-400 text-xs font-semibold">(غير مدخل بعد ⚠️)</span>
                    )}
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: 123456789012345"
                    value={fbAppIdInput}
                    onChange={(e) => setFbAppIdInput(e.target.value)}
                    className="form-input text-xs font-mono"
                    dir="ltr"
                  />
                  <span className="text-[11px] text-slate-400 block mt-1">
                    يتم نسخه من Meta for Developers (developers.facebook.com &gt; My Apps).
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 space-y-1.5">
                  <div className="font-bold text-indigo-400 flex items-center gap-1.5">
                    <ExternalLink size={14} />
                    <span>الروابط المعتمدة التي يجب أن تضعها في Google Cloud Console (Authorized JavaScript origins):</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px]">
                    <span className="bg-slate-900 px-2 py-1 rounded border border-slate-700 text-emerald-400">https://ai-codelingo.pages.dev</span>
                    <span className="bg-slate-900 px-2 py-1 rounded border border-slate-700 text-blue-400">http://localhost:5173</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="duo-btn duo-btn-success py-2.5 px-6 flex items-center gap-2 text-sm font-bold"
                >
                  <Save size={16} />
                  <span>حفظ وتفعيل مفاتيح الدخول التلقائي 💾</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* نافذة إضافة أدمن جديد (خاصة بالسوبر أدمن الماستر) */}
      {/* ========================================================= */}
      {adminModalOpen && (
        <div className="modal-backdrop" onClick={() => setAdminModalOpen(false)}>
          <div className="modal-card admin-add-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header-row">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {lang === 'en' ? 'Add New Assistant Admin' : 'إضافة أدمن / مشرف مساعد جديد'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'en' 
                      ? 'Create login credentials for a staff member or assistant teacher.'
                      : 'أنشئ حساباً لمساعد أو معلم زميل ليتمكن من الدخول للوحة التحكم والمتابعة.'
                    }
                  </p>
                </div>
              </div>
              <button 
                className="quiz-close-btn"
                onClick={() => setAdminModalOpen(false)}
              >
                ✕
              </button>
            </div>

            {adminFormError && (
              <div className="admin-login-error-alert my-3">
                <AlertCircle size={18} className="text-rose-400 flex-shrink-0" />
                <span>{adminFormError}</span>
              </div>
            )}

            {adminFormSuccess && (
              <div className="teacher-login-alert alert-success my-3">
                <CheckCircle size={18} />
                <span>{adminFormSuccess}</span>
              </div>
            )}

            <form 
              onSubmit={e => {
                e.preventDefault();
                setAdminFormError('');
                setAdminFormSuccess('');

                if (!newAdminName.trim() || !newAdminEmail.trim() || !newAdminPassword.trim()) {
                  setAdminFormError(lang === 'en' ? 'Please fill in all fields' : 'يرجى ملء جميع الحقول المطلوبة');
                  playSound.wrong();
                  return;
                }

                const res = addAdminAccount({
                  name: newAdminName,
                  email: newAdminEmail,
                  password: newAdminPassword
                });

                if (!res.success) {
                  setAdminFormError(res.error || 'حدث خطأ أثناء الإضافة');
                  playSound.wrong();
                  return;
                }

                playSound.correct();
                setAdminFormSuccess(lang === 'en' ? 'Admin added successfully!' : 'تمت إضافة المشرف بنجاح!');
                setTimeout(() => {
                  setAdminModalOpen(false);
                }, 800);
              }}
              className="space-y-4 mt-3"
            >
              <div className="admin-input-group">
                <label className="admin-input-label">
                  <Users size={15} className="text-indigo-400" />
                  <span>{lang === 'en' ? 'Admin Name' : 'اسم المشرف / الأدمن'}</span>
                </label>
                <div className="admin-input-wrapper">
                  <input 
                    type="text" 
                    value={newAdminName}
                    onChange={e => setNewAdminName(e.target.value)}
                    placeholder={lang === 'en' ? 'e.g. Mr. Ahmed Hosny' : 'مثال: أ. أحمد حسني (مشرف سنتر الأوائل)'}
                    className="admin-form-input"
                    required
                  />
                </div>
              </div>

              <div className="admin-input-group">
                <label className="admin-input-label">
                  <Mail size={15} className="text-emerald-400" />
                  <span>{lang === 'en' ? 'Authorized Email' : 'البريد الإلكتروني للدخول'}</span>
                </label>
                <div className="admin-input-wrapper">
                  <input 
                    type="email" 
                    value={newAdminEmail}
                    onChange={e => setNewAdminEmail(e.target.value)}
                    placeholder="ahmed.admin@gmail.com"
                    className="admin-form-input font-mono"
                    required
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="admin-input-group">
                <label className="admin-input-label">
                  <KeyRound size={15} className="text-amber-400" />
                  <span>{lang === 'en' ? 'Password' : 'كلمة مرور الحساب'}</span>
                </label>
                <div className="admin-input-wrapper">
                  <input 
                    type={showNewAdminPassword ? 'text' : 'password'} 
                    value={newAdminPassword}
                    onChange={e => setNewAdminPassword(e.target.value)}
                    placeholder={lang === 'en' ? 'Choose strong password...' : 'أدخل كلمة المرور للأدمن الجديد...'}
                    className="admin-form-input font-mono"
                    required
                    dir="ltr"
                  />
                  <button 
                    type="button"
                    className="admin-password-toggle-btn"
                    onClick={() => setShowNewAdminPassword(prev => !prev)}
                  >
                    {showNewAdminPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="modal-actions-row pt-3">
                <button
                  type="button"
                  className="duo-btn duo-btn-secondary"
                  onClick={() => setAdminModalOpen(false)}
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="duo-btn duo-btn-success flex items-center gap-2"
                >
                  <UserPlus size={18} />
                  <span>{lang === 'en' ? 'Save & Activate Admin' : 'حفظ وتفعيل المشرف'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* نافذة تحديد المنهج المشروح والواجب للمجموعة (Group Curriculum & HW) */}
      {/* ========================================================= */}
      {activeSelectedGroup && (
        <div className="modal-backdrop">
          <div className="modal-card teacher-curriculum-modal group-curriculum-modal">
            {/* ترويسة النافذة */}
            <div className="modal-header-row">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: activeSelectedGroup.color || '#6366f1' }}
                >
                  <School size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    {lang === 'en' 
                      ? `Select Topics Explained in: ${activeSelectedGroup.name}`
                      : `تحديد الفقرات المشروحة لـ: ${activeSelectedGroup.name}`
                    }
                  </h3>
                  <p className="text-xs text-slate-500">
                    {lang === 'en' 
                      ? 'Toggle the topics you have explained in class so they become immediately unlocked for all students in this group.'
                      : 'حدد الفقرات التي تم شرحها في الحصة ليتم فتحها فوراً لطلاب المجموعة ليراجعوا الشرح ويحلوا الأسئلة.'
                    }
                  </p>
                </div>
              </div>
              <button 
                className="quiz-close-btn"
                onClick={() => setSelectedGroupForCurriculum(null)}
              >
                ✕
              </button>
            </div>

            {/* شريط الإحصائيات السريعة للمجموعة ومسار التنقل */}
            <div className="group-perm-quick-stats flex items-center justify-between gap-3 flex-wrap">
              <span className="quick-stat-badge bg-emerald-50 text-emerald-700 border border-emerald-200">
                ✅ {lang === 'en' ? 'Explained Topics Count:' : 'عدد الفقرات المشروحة للمجموعة:'} {activeSelectedGroup.unlockedChunks?.length || 0} من {CURRICULUM_DATA.length} فقرة
              </span>

              <div className="flex items-center gap-2">
                <button
                  className="duo-btn duo-btn-success text-xs py-1.5 px-3 flex items-center gap-1 font-bold"
                  onClick={() => {
                    CHAPTERS_METADATA.forEach(ch => unlockEntireChapterForGroup(activeSelectedGroup.id, ch.id, false));
                    playSound.levelUp();
                  }}
                  title="فتح المنهج كاملاً لجميع طلاب المجموعة"
                >
                  <Unlock size={13} />
                  <span>فتح المنهج كاملاً للمجموعة 🔓</span>
                </button>
              </div>
            </div>

            {/* ========================================================
                المستوى 1: شاشة الفصول الأربعة (level === 'chapters')
                ======================================================== */}
            {groupCurriculumNav.level === 'chapters' && (
              <div className="curriculum-assignment-body">
                <div className="curriculum-step-header mb-3">
                  <h4 className="font-bold text-slate-800 text-base flex items-center gap-2">
                    <span>📚 فصول المنهج الدراسي (4 فصول)</span>
                  </h4>
                  <span className="text-xs text-slate-500">
                    اضغط على أي فصل لفتح دروسه الأربعة واستعراض محتوياتها:
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {CHAPTERS_METADATA.map((chapter) => {
                    const chapterChunks = CURRICULUM_DATA.filter(c => c.chapterId === chapter.id);
                    const lessonIds = [...new Set(chapterChunks.map(c => c.lessonId))];
                    const unlockedList = activeSelectedGroup.unlockedChunks || [];
                    const chapterUnlockedCount = chapterChunks.filter(c => unlockedList.includes(c.id)).length;
                    const allUnlocked = chapterUnlockedCount === chapterChunks.length && chapterChunks.length > 0;

                    return (
                      <div 
                        key={chapter.id} 
                        className="chapter-drilldown-card p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => {
                          setGroupCurriculumNav({ level: 'lessons', chapterId: chapter.id, lessonId: null });
                          playSound.click();
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="chapter-drilldown-badge-icon w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: chapter.gradient || 'linear-gradient(135deg, #4f46e5, #06b6d4)' }}>
                              {chapter.id === 1 ? '💻' : chapter.id === 2 ? '🛡️' : chapter.id === 3 ? '🌐' : '🎨'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-slate-800 text-base flex items-center gap-2 flex-wrap">
                                <span>الفصل {chapter.id}: {chapter.title}</span>
                                <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full font-bold border border-indigo-200">
                                  {lessonIds.length} دروس • {chapterChunks.length} فقرة
                                </span>
                                {chapterUnlockedCount > 0 ? (
                                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                                    {chapterUnlockedCount} / {chapterChunks.length} مشروح ✓
                                  </span>
                                ) : (
                                  <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-semibold">
                                    مغلق بالكامل 🔒
                                  </span>
                                )}
                              </h4>
                              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                {chapter.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
                            <button
                              className={`duo-btn ${allUnlocked ? 'duo-btn-secondary' : 'duo-btn-success'} text-xs py-1.5 px-3 flex items-center gap-1 font-bold`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (allUnlocked) {
                                  lockEntireChapterForGroup(activeSelectedGroup.id, chapter.id);
                                } else {
                                  unlockEntireChapterForGroup(activeSelectedGroup.id, chapter.id, false);
                                }
                              }}
                              title={allUnlocked ? 'قفل الفصل بالكامل' : 'فتح الفصل كاملاً'}
                            >
                              {allUnlocked ? <Lock size={13} /> : <Unlock size={13} />}
                              <span>{allUnlocked ? 'قفل الفصل 🔒' : 'فتح الفصل 🔓'}</span>
                            </button>

                            <button
                              className="duo-btn duo-btn-primary text-xs py-1.5 px-3.5 flex items-center gap-1.5 font-bold"
                              onClick={() => {
                                setGroupCurriculumNav({ level: 'lessons', chapterId: chapter.id, lessonId: null });
                                playSound.click();
                              }}
                            >
                              <span>استعراض الدروس ({lessonIds.length})</span>
                              <ArrowLeft size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ========================================================
                المستوى 2: شاشة دروس الفصل المختار (level === 'lessons')
                ======================================================== */}
            {groupCurriculumNav.level === 'lessons' && (() => {
              const chapter = CHAPTERS_METADATA.find(c => c.id === groupCurriculumNav.chapterId) || CHAPTERS_METADATA[0];
              const chapterChunks = CURRICULUM_DATA.filter(c => c.chapterId === chapter.id);
              const lessonIds = [...new Set(chapterChunks.map(c => c.lessonId))];
              const unlockedList = activeSelectedGroup.unlockedChunks || [];
              const chapterUnlockedCount = chapterChunks.filter(c => unlockedList.includes(c.id)).length;
              const allUnlocked = chapterUnlockedCount === chapterChunks.length && chapterChunks.length > 0;

              return (
                <div className="curriculum-assignment-body">
                  {/* شريط التنقل وزرار الباك (Back to Chapters) */}
                  <div className="curriculum-nav-breadcrumb-bar p-3 bg-slate-100 rounded-xl mb-3 flex items-center justify-between gap-3 flex-wrap border border-slate-200">
                    <div className="flex items-center gap-2">
                      <button
                        className="duo-btn duo-btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold"
                        onClick={() => {
                          setGroupCurriculumNav({ level: 'chapters', chapterId: null, lessonId: null });
                          playSound.click();
                        }}
                        id="btn-back-to-chapters"
                      >
                        <ArrowRight size={15} />
                        <span>⬅️ رجوع لقائمة الفصول</span>
                      </button>
                      <div className="text-xs font-bold text-slate-700">
                        <span>الفصل {chapter.id}: {chapter.title}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        {chapterUnlockedCount} / {chapterChunks.length} مشروح
                      </span>
                      <button
                        className={`duo-btn ${allUnlocked ? 'duo-btn-secondary' : 'duo-btn-success'} text-xs py-1.5 px-3 flex items-center gap-1 font-bold`}
                        onClick={() => {
                          if (allUnlocked) {
                            lockEntireChapterForGroup(activeSelectedGroup.id, chapter.id);
                          } else {
                            unlockEntireChapterForGroup(activeSelectedGroup.id, chapter.id, false);
                          }
                        }}
                      >
                        {allUnlocked ? <Lock size={13} /> : <Unlock size={13} />}
                        <span>{allUnlocked ? 'قفل الفصل كاملاً 🔒' : 'فتح الفصل كاملاً 🔓'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="curriculum-step-header mb-3">
                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                      <span>📖 دروس الفصل {chapter.id} ({lessonIds.length} دروس):</span>
                    </h4>
                    <span className="text-xs text-slate-500">
                      اضغط على أي درس لعرض كافة فقراته المتقسمة داخله والتحكم بها:
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {lessonIds.map((lessonId) => {
                      const lessonChunks = chapterChunks.filter(c => c.lessonId === lessonId);
                      const lessonUnlockedCount = lessonChunks.filter(c => unlockedList.includes(c.id)).length;
                      const isLessonFullyUnlocked = lessonUnlockedCount === lessonChunks.length && lessonChunks.length > 0;
                      const lessonTitle = lessonChunks[0]?.lessonTitle || `درس ${lessonId}`;

                      return (
                        <div
                          key={lessonId}
                          className="lesson-drilldown-card p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer"
                          onClick={() => {
                            setGroupCurriculumNav({ level: 'topics', chapterId: chapter.id, lessonId });
                            playSound.click();
                          }}
                        >
                          <div className="flex items-center justify-between gap-3 flex-wrap">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <span className="lesson-perm-badge bg-indigo-600 text-white font-bold text-xs px-2.5 py-1 rounded-md flex-shrink-0">
                                درس {lessonId}
                              </span>
                              <div className="flex-1 min-w-0">
                                <h5 className="font-bold text-slate-800 text-sm">{lessonTitle}</h5>
                                <span className="text-xs font-semibold mt-0.5 block" style={{ color: lessonUnlockedCount > 0 ? '#059669' : '#64748b' }}>
                                  ({lessonUnlockedCount} من {lessonChunks.length} مشروحة للمجموعة)
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
                              <button
                                className={`duo-btn ${isLessonFullyUnlocked ? 'duo-btn-secondary' : 'duo-btn-success'} text-xs py-1.5 px-3 flex items-center gap-1 font-bold`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isLessonFullyUnlocked) {
                                    lockEntireLessonForGroup(activeSelectedGroup.id, lessonId);
                                  } else {
                                    unlockEntireLessonForGroup(activeSelectedGroup.id, lessonId);
                                  }
                                }}
                              >
                                {isLessonFullyUnlocked ? <Lock size={13} /> : <Unlock size={13} />}
                                <span>{isLessonFullyUnlocked ? 'قفل الدرس 🔒' : 'فتح الدرس 🔓'}</span>
                              </button>

                              <button
                                className="duo-btn duo-btn-primary text-xs py-1.5 px-3.5 flex items-center gap-1.5 font-bold"
                                onClick={() => {
                                  setGroupCurriculumNav({ level: 'topics', chapterId: chapter.id, lessonId });
                                  playSound.click();
                                }}
                              >
                                <span>عرض فقرات الدرس ({lessonChunks.length})</span>
                                <ArrowLeft size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* ========================================================
                المستوى 3: شاشة فقرات الدرس المختار (level === 'topics')
                ======================================================== */}
            {groupCurriculumNav.level === 'topics' && (() => {
              const chapter = CHAPTERS_METADATA.find(c => c.id === groupCurriculumNav.chapterId) || CHAPTERS_METADATA[0];
              const chapterChunks = CURRICULUM_DATA.filter(c => c.chapterId === chapter.id);
              const lessonChunks = chapterChunks.filter(c => c.lessonId === groupCurriculumNav.lessonId);
              const unlockedList = activeSelectedGroup.unlockedChunks || [];
              const lessonUnlockedCount = lessonChunks.filter(c => unlockedList.includes(c.id)).length;
              const isLessonFullyUnlocked = lessonUnlockedCount === lessonChunks.length && lessonChunks.length > 0;
              const lessonTitle = lessonChunks[0]?.lessonTitle || `درس ${groupCurriculumNav.lessonId}`;

              return (
                <div className="curriculum-assignment-body">
                  {/* شريط التنقل وزرار الباك (Back Buttons) */}
                  <div className="curriculum-nav-breadcrumb-bar p-3 bg-slate-100 rounded-xl mb-3 flex items-center justify-between gap-3 flex-wrap border border-slate-200">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        className="duo-btn duo-btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold"
                        onClick={() => {
                          setGroupCurriculumNav({ level: 'lessons', chapterId: chapter.id, lessonId: null });
                          playSound.click();
                        }}
                        id="btn-back-to-lessons"
                      >
                        <ArrowRight size={15} />
                        <span>⬅️ رجوع لدروس الفصل</span>
                      </button>

                      <button
                        className="duo-btn duo-btn-secondary text-xs py-1.5 px-2.5 flex items-center gap-1"
                        onClick={() => {
                          setGroupCurriculumNav({ level: 'chapters', chapterId: null, lessonId: null });
                          playSound.click();
                        }}
                      >
                        <span>الفصول 📚</span>
                      </button>

                      <div className="text-xs font-bold text-slate-700">
                        <span>الفصل {chapter.id} / درس {groupCurriculumNav.lessonId}: {lessonTitle}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        {lessonUnlockedCount} / {lessonChunks.length} مشروحة
                      </span>
                      <button
                        className={`duo-btn ${isLessonFullyUnlocked ? 'duo-btn-secondary' : 'duo-btn-success'} text-xs py-1.5 px-3 flex items-center gap-1 font-bold`}
                        onClick={() => {
                          if (isLessonFullyUnlocked) {
                            lockEntireLessonForGroup(activeSelectedGroup.id, groupCurriculumNav.lessonId);
                          } else {
                            unlockEntireLessonForGroup(activeSelectedGroup.id, groupCurriculumNav.lessonId);
                          }
                        }}
                      >
                        {isLessonFullyUnlocked ? <Lock size={13} /> : <Unlock size={13} />}
                        <span>{isLessonFullyUnlocked ? 'قفل كل الفقرات 🔒' : 'فتح كل الفقرات 🔓'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="curriculum-step-header mb-2">
                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                      <span>🎯 جميع فقرات ومحتويات درس {groupCurriculumNav.lessonId}:</span>
                    </h4>
                    <span className="text-xs text-slate-500">
                      فعل مفتاح «تم الشرح» لأي فقرة تم شرحها في الحصة ليتم فتحها فوراً للمجموعة:
                    </span>
                  </div>

                  {/* قائمة الفقرات كاملة مع سكرول فسيح وواضح ومريح جداً */}
                  <div className="topics-scroll-viewport max-h-[58vh] overflow-y-auto p-2 pb-16 flex flex-col gap-2.5">
                    {lessonChunks.map((chunk) => {
                      const isUnlocked = unlockedList.includes(chunk.id);
                      const engTitle = CURRICULUM_ENGLISH[chunk.id]?.title;
                      const displayChunkTitle = (lang === 'en' && engTitle) ? engTitle : chunk.chunkTitle;

                      return (
                        <div key={chunk.id} className="chunk-perm-item group-chunk-perm-item p-3.5 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 transition-all shadow-sm">
                          <div className="chunk-perm-info flex items-start gap-3 flex-1 min-w-0">
                            <span className="chunk-perm-lesson-badge text-xs font-bold px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200 flex-shrink-0">
                              {chunk.iconEmoji || '🎯'} {chunk.type === 'lesson_exam' ? 'اختبار شامل' : 'فقرة شرح'}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-slate-800 text-sm flex items-center gap-2 flex-wrap">
                                <span>{displayChunkTitle}</span>
                                {isUnlocked ? (
                                  <span className="badge-tag-explained text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                    ✅ مشروح ومفتوح
                                  </span>
                                ) : (
                                  <span className="badge-tag-locked text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                                    🔒 مقفول
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-600 mt-1 leading-relaxed">
                                {chunk.summary}
                              </div>
                            </div>
                          </div>

                          {/* مفتاح تم الشرح في الحصة */}
                          <div className="perm-switches-group flex-shrink-0 mr-3">
                            <label className="perm-control-toggle cursor-pointer flex items-center gap-2" title={t('explainedInClass')}>
                              <span className="toggle-text-label font-bold text-xs" style={{ color: isUnlocked ? '#059669' : '#64748b' }}>
                                {isUnlocked ? 'تم الشرح ✓' : 'لم يشرح بعد'}
                              </span>
                              <div className="toggle-switch-wrapper">
                                <input
                                  type="checkbox"
                                  checked={isUnlocked}
                                  onChange={() => toggleGroupChunk(activeSelectedGroup.id, chunk.id, false)}
                                />
                                <span className="toggle-switch-slider"></span>
                              </div>
                            </label>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            <div className="modal-footer-row">
              <button
                className="duo-btn duo-btn-primary w-full py-3"
                onClick={() => {
                  setSelectedGroupForCurriculum(null);
                  playSound.correct();
                }}
              >
                {lang === 'en' ? 'Save & Close Group Roadmap ✅' : 'حفظ وإغلاق إعدادات المجموعة ✅'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* نافذة إنشاء / تعديل مجموعة دراسية (Create/Edit Group Modal) */}
      {/* ========================================================= */}
      {groupModalState.isOpen && (
        <div className="modal-backdrop">
          <div className="modal-card group-editor-modal">
            <div className="modal-header-row">
              <div className="flex items-center gap-2.5">
                <School size={24} className="text-indigo-600" />
                <h3 className="text-xl font-bold text-slate-800">
                  {groupModalState.mode === 'create' ? t('createGroup') : t('editGroup')}
                </h3>
              </div>
              <button 
                className="quiz-close-btn"
                onClick={() => setGroupModalState(prev => ({ ...prev, isOpen: false }))}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveGroup} className="group-form-body">
              {/* اسم المجموعة */}
              <div className="form-group-field">
                <label className="form-label">{t('groupName')} *</label>
                <input 
                  type="text"
                  required
                  placeholder={lang === 'en' ? 'e.g. Sunday & Tuesday - El-Rowad Center' : 'مثال: مجموعة الأحد والثلاثاء - سنتر الأوائل'}
                  value={groupModalState.name}
                  onChange={(e) => setGroupModalState(prev => ({ ...prev, name: e.target.value }))}
                  className="form-input"
                />
              </div>

              {/* المواعيد والسنتر */}
              <div className="form-two-cols">
                <div className="form-group-field">
                  <label className="form-label">{t('groupSchedule')}</label>
                  <input 
                    type="text"
                    placeholder={lang === 'en' ? 'e.g. Sun & Tue (5:00 - 7:00 PM)' : 'مثال: الأحد والثلاثاء (5:00 - 7:00 م)'}
                    value={groupModalState.schedule}
                    onChange={(e) => setGroupModalState(prev => ({ ...prev, schedule: e.target.value }))}
                    className="form-input"
                  />
                </div>

                <div className="form-group-field">
                  <label className="form-label">{t('groupLocation')}</label>
                  <input 
                    type="text"
                    placeholder={lang === 'en' ? 'e.g. El-Rowad Center or Online' : 'مثال: سنتر الأوائل - الدقي أو أونلاين'}
                    value={groupModalState.location}
                    onChange={(e) => setGroupModalState(prev => ({ ...prev, location: e.target.value }))}
                    className="form-input"
                  />
                </div>
              </div>

              {/* لون التمييز للمجموعة */}
              <div className="form-group-field">
                <label className="form-label">{lang === 'en' ? 'Group Color Tag' : 'لون تمييز المجموعة'}</label>
                <div className="flex items-center gap-3">
                  {['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'].map(c => (
                    <button
                      key={c}
                      type="button"
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${groupModalState.color === c ? 'scale-125 border-slate-800 shadow-md' : 'border-transparent'}`}
                      style={{ backgroundColor: c }}
                      onClick={() => setGroupModalState(prev => ({ ...prev, color: c }))}
                    />
                  ))}
                </div>
              </div>

              {/* اختيار طلاب المجموعة */}
              <div className="form-group-field">
                <label className="form-label flex items-center justify-between">
                  <span>{t('groupStudents')} ({groupModalState.studentIds.length})</span>
                  <span className="text-xs text-slate-400 font-normal">
                    {lang === 'en' ? 'Check students who attend this group' : 'علّم على الطلاب الذين يحضرون في هذه المجموعة'}
                  </span>
                </label>
                
                <div className="students-selector-checklist">
                  {students.map(s => {
                    const isChecked = groupModalState.studentIds.includes(s.id);
                    return (
                      <label 
                        key={s.id} 
                        className={`student-check-item ${isChecked ? 'selected' : ''}`}
                      >
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setGroupModalState(prev => ({ ...prev, studentIds: [...prev.studentIds, s.id] }));
                            } else {
                              setGroupModalState(prev => ({ ...prev, studentIds: prev.studentIds.filter(id => id !== s.id) }));
                            }
                          }}
                        />
                        <img src={s.avatar} alt="" className="w-6 h-6 rounded-full" />
                        <span className="student-check-name">{s.name}</span>
                        <span className="text-xs text-slate-400 font-mono">({s.phone})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="form-actions-row">
                <button 
                  type="button" 
                  className="duo-btn duo-btn-secondary"
                  onClick={() => setGroupModalState(prev => ({ ...prev, isOpen: false }))}
                >
                  {lang === 'en' ? 'Cancel' : 'إلغاء'}
                </button>
                <button 
                  type="submit" 
                  className="duo-btn duo-btn-primary flex-1"
                >
                  {groupModalState.mode === 'create' ? t('createGroup') : t('editGroup')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* نافذة تحديد المنهج الفردي للطالب (Student Direct Permissions) */}
      {/* ========================================================= */}
      {activeCurriculumStudent && (
        <div className="modal-backdrop">
          <div className="modal-card teacher-curriculum-modal group-curriculum-modal">
            <div className="modal-header-row">
              <div className="flex items-center gap-3">
                <img 
                  src={activeCurriculumStudent.avatar} 
                  alt="" 
                  className="w-11 h-11 rounded-full border-2 border-indigo-500 object-cover" 
                />
                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    {lang === 'en' 
                      ? `Customize Roadmap for: ${activeCurriculumStudent.name}`
                      : `تخصيص المنهج الفردي: ${activeCurriculumStudent.name}`
                    }
                  </h3>
                  <p className="text-xs text-slate-500">
                    {lang === 'en' 
                      ? 'Select chapters, lessons, and topics that this student is allowed to study'
                      : 'حدد الفصول والدروس والفقرات المفتوحة لدراسة الطالب (4 فصول • 14 درساً)'
                    }
                  </p>
                </div>
              </div>
              <button 
                className="quiz-close-btn"
                onClick={() => {
                  setSelectedStudentIdForCurriculum(null);
                  playSound.click();
                }}
              >
                ✕
              </button>
            </div>

            {/* شريط تعقب موقع الطالب وآخر محطة وصلها + زر الفتح السريع للمحطة التالية */}
            {(() => {
              const allowedChunks = activeCurriculumStudent.allowedCurriculum?.chunks || [];
              let lastIndex = -1;
              CURRICULUM_DATA.forEach((c, idx) => {
                if (allowedChunks.includes(c.id)) {
                  lastIndex = idx;
                }
              });

              const lastChunk = lastIndex >= 0 ? CURRICULUM_DATA[lastIndex] : null;
              const nextChunk = lastIndex + 1 < CURRICULUM_DATA.length ? CURRICULUM_DATA[lastIndex + 1] : null;

              return (
                <div className="student-station-tracker-banner">
                  <div className="tracker-station-info">
                    <span className="text-xs font-bold text-slate-700">📍 آخر محطة مفتوحة للطالب:</span>
                    {lastChunk ? (
                      <span className="tracker-station-badge">
                        <span>درس {lastChunk.lessonId}:</span>
                        <span>{lastChunk.chunkTitle}</span>
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                        لم يُفتح له أي محطة بعد
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {lastChunk && (
                      <button 
                        className="duo-btn duo-btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                        onClick={() => scrollToLastStation(lastChunk.id)}
                        title="تمرير الشاشة لموقع آخر محطة"
                      >
                        <MapPin size={13} className="text-amber-500" />
                        <span>موقع الطالب</span>
                      </button>
                    )}

                    {nextChunk && (
                      <button 
                        className="duo-btn duo-btn-success text-xs py-1.5 px-3 flex items-center gap-1.5"
                        onClick={() => {
                          toggleStudentCurriculum(activeCurriculumStudent.id, 'chunks', nextChunk.id);
                          if (!activeCurriculumStudent.allowedCurriculum?.chapters?.includes(nextChunk.chapterId)) {
                            toggleStudentCurriculum(activeCurriculumStudent.id, 'chapters', nextChunk.chapterId);
                          }
                          if (!activeCurriculumStudent.allowedCurriculum?.lessons?.includes(nextChunk.lessonId)) {
                            toggleStudentCurriculum(activeCurriculumStudent.id, 'lessons', nextChunk.lessonId);
                          }
                          // فتح الفصل والدرس تلقائياً إذا كانا مغلقين
                          if (!expandedChapters.includes(nextChunk.chapterId)) {
                            setExpandedChapters(prev => [...prev, nextChunk.chapterId]);
                          }
                          if (!expandedLessons.includes(nextChunk.lessonId)) {
                            setExpandedLessons(prev => [...prev, nextChunk.lessonId]);
                          }
                          playSound.levelUp();
                          setTimeout(() => scrollToLastStation(nextChunk.id), 200);
                        }}
                        title={`فتح المحطة التالية فوراً: ${nextChunk.chunkTitle}`}
                      >
                        <Zap size={14} className="text-yellow-300" />
                        <span>فتح المحطة التالية مباشرة ⚡ (درس {nextChunk.lessonId})</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* ========================================================
                المستوى 1: شاشة الفصول الأربعة للطالب (level === 'chapters')
                ======================================================== */}
            {studentCurriculumNav.level === 'chapters' && (
              <div className="curriculum-assignment-body">
                <div className="curriculum-step-header mb-3">
                  <h4 className="font-bold text-slate-800 text-base flex items-center gap-2">
                    <span>📚 فصول المنهج الدراسي للطالب (4 فصول)</span>
                  </h4>
                  <span className="text-xs text-slate-500">
                    اضغط على أي فصل لفتح دروسه الأربعة واستعراض محتوياتها:
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {CHAPTERS_METADATA.map((chapter) => {
                    const chapterChunks = CURRICULUM_DATA.filter(c => c.chapterId === chapter.id);
                    const lessonIds = [...new Set(chapterChunks.map(c => c.lessonId))];
                    const allowedChunks = activeCurriculumStudent.allowedCurriculum?.chunks || [];
                    const chapterAllowedCount = chapterChunks.filter(c => allowedChunks.includes(c.id)).length;
                    const isChapterFullyUnlocked = chapterAllowedCount === chapterChunks.length && chapterChunks.length > 0;

                    return (
                      <div 
                        key={chapter.id} 
                        className="chapter-drilldown-card p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => {
                          setStudentCurriculumNav({ level: 'lessons', chapterId: chapter.id, lessonId: null });
                          playSound.click();
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="chapter-drilldown-badge-icon w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: chapter.gradient || 'linear-gradient(135deg, #4f46e5, #06b6d4)' }}>
                              {chapter.id === 1 ? '💻' : chapter.id === 2 ? '🛡️' : chapter.id === 3 ? '🌐' : '🎨'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-slate-800 text-base flex items-center gap-2 flex-wrap">
                                <span>الفصل {chapter.id}: {chapter.title}</span>
                                <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full font-bold border border-indigo-200">
                                  {lessonIds.length} دروس • {chapterChunks.length} فقرة
                                </span>
                                {chapterAllowedCount > 0 ? (
                                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                                    {chapterAllowedCount} / {chapterChunks.length} مفتوح ✓
                                  </span>
                                ) : (
                                  <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-semibold">
                                    مغلق بالكامل 🔒
                                  </span>
                                )}
                              </h4>
                              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                {chapter.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
                            <button
                              className={`duo-btn ${isChapterFullyUnlocked ? 'duo-btn-secondary' : 'duo-btn-success'} text-xs py-1.5 px-3 flex items-center gap-1 font-bold`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isChapterFullyUnlocked) {
                                  chapterChunks.forEach(c => {
                                    if (allowedChunks.includes(c.id)) {
                                      toggleStudentCurriculum(activeCurriculumStudent.id, 'chunks', c.id);
                                    }
                                  });
                                } else {
                                  unlockEntireChapter(activeCurriculumStudent.id, chapter.id);
                                }
                              }}
                              title={isChapterFullyUnlocked ? 'قفل الفصل بالكامل' : 'فتح الفصل كاملاً'}
                            >
                              {isChapterFullyUnlocked ? <Lock size={13} /> : <Unlock size={13} />}
                              <span>{isChapterFullyUnlocked ? 'قفل الفصل 🔒' : 'فتح الفصل 🔓'}</span>
                            </button>

                            <button
                              className="duo-btn duo-btn-primary text-xs py-1.5 px-3.5 flex items-center gap-1.5 font-bold"
                              onClick={() => {
                                setStudentCurriculumNav({ level: 'lessons', chapterId: chapter.id, lessonId: null });
                                playSound.click();
                              }}
                            >
                              <span>استعراض الدروس ({lessonIds.length})</span>
                              <ArrowLeft size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ========================================================
                المستوى 2: شاشة دروس الفصل المختار للطالب (level === 'lessons')
                ======================================================== */}
            {studentCurriculumNav.level === 'lessons' && (() => {
              const chapter = CHAPTERS_METADATA.find(c => c.id === studentCurriculumNav.chapterId) || CHAPTERS_METADATA[0];
              const chapterChunks = CURRICULUM_DATA.filter(c => c.chapterId === chapter.id);
              const lessonIds = [...new Set(chapterChunks.map(c => c.lessonId))];
              const allowedChunks = activeCurriculumStudent.allowedCurriculum?.chunks || [];
              const chapterAllowedCount = chapterChunks.filter(c => allowedChunks.includes(c.id)).length;
              const isChapterFullyUnlocked = chapterAllowedCount === chapterChunks.length && chapterChunks.length > 0;

              return (
                <div className="curriculum-assignment-body">
                  {/* شريط التنقل وزرار الباك (Back to Chapters) */}
                  <div className="curriculum-nav-breadcrumb-bar p-3 bg-slate-100 rounded-xl mb-3 flex items-center justify-between gap-3 flex-wrap border border-slate-200">
                    <div className="flex items-center gap-2">
                      <button
                        className="duo-btn duo-btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold"
                        onClick={() => {
                          setStudentCurriculumNav({ level: 'chapters', chapterId: null, lessonId: null });
                          playSound.click();
                        }}
                      >
                        <ArrowRight size={15} />
                        <span>⬅️ رجوع لقائمة الفصول</span>
                      </button>
                      <div className="text-xs font-bold text-slate-700">
                        <span>الفصل {chapter.id}: {chapter.title}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        {chapterAllowedCount} / {chapterChunks.length} مفتوح
                      </span>
                      <button
                        className={`duo-btn ${isChapterFullyUnlocked ? 'duo-btn-secondary' : 'duo-btn-success'} text-xs py-1.5 px-3 flex items-center gap-1 font-bold`}
                        onClick={() => {
                          if (isChapterFullyUnlocked) {
                            chapterChunks.forEach(c => {
                              if (allowedChunks.includes(c.id)) {
                                toggleStudentCurriculum(activeCurriculumStudent.id, 'chunks', c.id);
                              }
                            });
                          } else {
                            unlockEntireChapter(activeCurriculumStudent.id, chapter.id);
                          }
                        }}
                      >
                        {isChapterFullyUnlocked ? <Lock size={13} /> : <Unlock size={13} />}
                        <span>{isChapterFullyUnlocked ? 'قفل الفصل كاملاً 🔒' : 'فتح الفصل كاملاً 🔓'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="curriculum-step-header mb-3">
                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                      <span>📖 دروس الفصل {chapter.id} ({lessonIds.length} دروس):</span>
                    </h4>
                    <span className="text-xs text-slate-500">
                      اضغط على أي درس لعرض كافة فقراته المتقسمة داخله والتحكم بها:
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {lessonIds.map((lessonId) => {
                      const lessonChunks = chapterChunks.filter(c => c.lessonId === lessonId);
                      const lessonAllowedCount = lessonChunks.filter(c => allowedChunks.includes(c.id)).length;
                      const isLessonFullyUnlocked = lessonAllowedCount === lessonChunks.length && lessonChunks.length > 0;
                      const lessonTitle = lessonChunks[0]?.lessonTitle || `درس ${lessonId}`;

                      return (
                        <div
                          key={lessonId}
                          className="lesson-drilldown-card p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer"
                          onClick={() => {
                            setStudentCurriculumNav({ level: 'topics', chapterId: chapter.id, lessonId });
                            playSound.click();
                          }}
                        >
                          <div className="flex items-center justify-between gap-3 flex-wrap">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <span className="lesson-perm-badge bg-indigo-600 text-white font-bold text-xs px-2.5 py-1 rounded-md flex-shrink-0">
                                درس {lessonId}
                              </span>
                              <div className="flex-1 min-w-0">
                                <h5 className="font-bold text-slate-800 text-sm">{lessonTitle}</h5>
                                <span className="text-xs font-semibold mt-0.5 block" style={{ color: lessonAllowedCount > 0 ? '#059669' : '#64748b' }}>
                                  ({lessonAllowedCount} من {lessonChunks.length} مفتوحة للطالب)
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
                              <button
                                className={`duo-btn ${isLessonFullyUnlocked ? 'duo-btn-secondary' : 'duo-btn-success'} text-xs py-1.5 px-3 flex items-center gap-1 font-bold`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isLessonFullyUnlocked) {
                                    lessonChunks.forEach(c => {
                                      if (allowedChunks.includes(c.id)) {
                                        toggleStudentCurriculum(activeCurriculumStudent.id, 'chunks', c.id);
                                      }
                                    });
                                  } else {
                                    unlockEntireLesson(activeCurriculumStudent.id, lessonId);
                                  }
                                }}
                              >
                                {isLessonFullyUnlocked ? <Lock size={13} /> : <Unlock size={13} />}
                                <span>{isLessonFullyUnlocked ? 'قفل الدرس 🔒' : 'فتح الدرس 🔓'}</span>
                              </button>

                              <button
                                className="duo-btn duo-btn-primary text-xs py-1.5 px-3.5 flex items-center gap-1.5 font-bold"
                                onClick={() => {
                                  setStudentCurriculumNav({ level: 'topics', chapterId: chapter.id, lessonId });
                                  playSound.click();
                                }}
                              >
                                <span>عرض فقرات الدرس ({lessonChunks.length})</span>
                                <ArrowLeft size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* ========================================================
                المستوى 3: شاشة فقرات الدرس المختار للطالب (level === 'topics')
                ======================================================== */}
            {studentCurriculumNav.level === 'topics' && (() => {
              const chapter = CHAPTERS_METADATA.find(c => c.id === studentCurriculumNav.chapterId) || CHAPTERS_METADATA[0];
              const chapterChunks = CURRICULUM_DATA.filter(c => c.chapterId === chapter.id);
              const lessonChunks = chapterChunks.filter(c => c.lessonId === studentCurriculumNav.lessonId);
              const allowedChunks = activeCurriculumStudent.allowedCurriculum?.chunks || [];
              const lessonAllowedCount = lessonChunks.filter(c => allowedChunks.includes(c.id)).length;
              const isLessonFullyUnlocked = lessonAllowedCount === lessonChunks.length && lessonChunks.length > 0;
              const lessonTitle = lessonChunks[0]?.lessonTitle || `درس ${studentCurriculumNav.lessonId}`;

              return (
                <div className="curriculum-assignment-body">
                  {/* شريط التنقل وزرار الباك (Back Buttons) */}
                  <div className="curriculum-nav-breadcrumb-bar p-3 bg-slate-100 rounded-xl mb-3 flex items-center justify-between gap-3 flex-wrap border border-slate-200">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        className="duo-btn duo-btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold"
                        onClick={() => {
                          setStudentCurriculumNav({ level: 'lessons', chapterId: chapter.id, lessonId: null });
                          playSound.click();
                        }}
                      >
                        <ArrowRight size={15} />
                        <span>⬅️ رجوع لدروس الفصل</span>
                      </button>

                      <button
                        className="duo-btn duo-btn-secondary text-xs py-1.5 px-2.5 flex items-center gap-1"
                        onClick={() => {
                          setStudentCurriculumNav({ level: 'chapters', chapterId: null, lessonId: null });
                          playSound.click();
                        }}
                      >
                        <span>الفصول 📚</span>
                      </button>

                      <div className="text-xs font-bold text-slate-700">
                        <span>الفصل {chapter.id} / درس {studentCurriculumNav.lessonId}: {lessonTitle}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        {lessonAllowedCount} / {lessonChunks.length} مفتوحة
                      </span>
                      <button
                        className={`duo-btn ${isLessonFullyUnlocked ? 'duo-btn-secondary' : 'duo-btn-success'} text-xs py-1.5 px-3 flex items-center gap-1 font-bold`}
                        onClick={() => {
                          if (isLessonFullyUnlocked) {
                            lessonChunks.forEach(c => {
                              if (allowedChunks.includes(c.id)) {
                                toggleStudentCurriculum(activeCurriculumStudent.id, 'chunks', c.id);
                              }
                            });
                          } else {
                            unlockEntireLesson(activeCurriculumStudent.id, studentCurriculumNav.lessonId);
                          }
                        }}
                      >
                        {isLessonFullyUnlocked ? <Lock size={13} /> : <Unlock size={13} />}
                        <span>{isLessonFullyUnlocked ? 'قفل كل الفقرات 🔒' : 'فتح كل الفقرات 🔓'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="curriculum-step-header mb-2">
                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                      <span>🎯 جميع فقرات ومحتويات درس {studentCurriculumNav.lessonId}:</span>
                    </h4>
                    <span className="text-xs text-slate-500">
                      فعل مفتاح «مفتوح للطالب» لتحديد المحطات المتاحة لهذا الطالب للدراسة والحل:
                    </span>
                  </div>

                  {/* قائمة الفقرات كاملة مع سكرول فسيح وواضح ومريح جداً */}
                  <div className="topics-scroll-viewport max-h-[58vh] overflow-y-auto p-2 pb-16 flex flex-col gap-2.5">
                    {lessonChunks.map((chunk) => {
                      const isAllowed = allowedChunks.includes(chunk.id);
                      const engTitle = CURRICULUM_ENGLISH[chunk.id]?.title;
                      const displayChunkTitle = (lang === 'en' && engTitle) ? engTitle : chunk.chunkTitle;

                      return (
                        <div key={chunk.id} className="chunk-perm-item p-3.5 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 transition-all shadow-sm">
                          <div className="chunk-perm-info flex items-start gap-3 flex-1 min-w-0">
                            <span className="chunk-perm-lesson-badge text-xs font-bold px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200 flex-shrink-0">
                              {chunk.iconEmoji || '🎯'} {chunk.type === 'lesson_exam' ? 'اختبار شامل' : 'فقرة شرح'}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-slate-800 text-sm flex items-center gap-2 flex-wrap">
                                <span>{displayChunkTitle}</span>
                                {isAllowed ? (
                                  <span className="badge-tag-explained text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                    ✓ مفتوح للطالب
                                  </span>
                                ) : (
                                  <span className="badge-tag-locked text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                                    🔒 مقفول
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-600 mt-1 leading-relaxed">
                                {chunk.summary}
                              </div>
                            </div>
                          </div>

                          {/* مفتاح فتح/قفل الفقرة للطالب */}
                          <div className="perm-switches-group flex-shrink-0 mr-3">
                            <label className="perm-control-toggle cursor-pointer flex items-center gap-2">
                              <span className="toggle-text-label font-bold text-xs" style={{ color: isAllowed ? '#059669' : '#64748b' }}>
                                {isAllowed ? 'مفتوح ✓' : 'مغلق 🔒'}
                              </span>
                              <div className="toggle-switch-wrapper">
                                <input
                                  type="checkbox"
                                  checked={isAllowed}
                                  onChange={() => {
                                    toggleStudentCurriculum(activeCurriculumStudent.id, 'chunks', chunk.id);
                                    if (!activeCurriculumStudent.allowedCurriculum?.chapters?.includes(chunk.chapterId)) {
                                      toggleStudentCurriculum(activeCurriculumStudent.id, 'chapters', chunk.chapterId);
                                    }
                                    if (!activeCurriculumStudent.allowedCurriculum?.lessons?.includes(chunk.lessonId)) {
                                      toggleStudentCurriculum(activeCurriculumStudent.id, 'lessons', chunk.lessonId);
                                    }
                                  }}
                                />
                                <span className="toggle-switch-slider"></span>
                              </div>
                            </label>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            <div className="modal-footer-row flex gap-2">
              <button
                className="duo-btn duo-btn-primary w-full py-3"
                onClick={() => {
                  setSelectedStudentIdForCurriculum(null);
                  playSound.correct();
                }}
              >
                {lang === 'en' ? 'Save & Close Permissions ✅' : 'حفظ وإغلاق التخصيص ✅'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* نافذة منبثقة: مراجعة طلاب وتقدم المجموعة ودرجاتهم */}
      {/* ========================================================= */}
      {selectedGroupForReview && (
        <div className="modal-backdrop">
          <div className="modal-card group-review-modal-card">
            <div className="modal-header">
              <div className="flex items-center gap-2.5">
                <span 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: selectedGroupForReview.color || '#6366f1' }}
                />
                <div>
                  <h3 className="modal-title">
                    {lang === 'en' ? `Group Review: ${selectedGroupForReview.name}` : `مراجعة طلاب وتقدم: ${selectedGroupForReview.name}`}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedGroupForReview.schedule} • {selectedGroupForReview.location}
                  </p>
                </div>
              </div>
              <button 
                className="quiz-close-btn"
                onClick={() => setSelectedGroupForReview(null)}
              >
                ✕
              </button>
            </div>

            <div className="group-review-content">
              {/* ملخص إحصائيات المجموعة */}
              <div className="group-review-summary-bar">
                <div className="summary-item">
                  <span className="summary-label">{lang === 'en' ? 'Total Students' : 'إجمالي الطلاب'}</span>
                  <strong className="summary-val text-indigo-600">
                    {students.filter(s => s.groupId === selectedGroupForReview.id || (selectedGroupForReview.studentIds && selectedGroupForReview.studentIds.includes(s.id))).length}
                  </strong>
                </div>
                <div className="summary-item">
                  <span className="summary-label">{lang === 'en' ? 'Explained Topics' : 'الفقرات المشروحة'}</span>
                  <strong className="summary-val text-emerald-600">
                    {selectedGroupForReview.unlockedChunks?.length || 0}
                  </strong>
                </div>
                <div className="summary-item">
                  <span className="summary-label">{lang === 'en' ? 'Homework Assigned' : 'واجبات المجموعة'}</span>
                  <strong className="summary-val text-amber-600">
                    {selectedGroupForReview.homeworkChunks?.length || 0}
                  </strong>
                </div>
              </div>

              {/* قائمة طلاب المجموعة وتفاصيل درجاتهم ومحطتهم وأخطائهم */}
              <div className="group-students-review-list">
                {(() => {
                  const groupStudents = students.filter(s => 
                    s.groupId === selectedGroupForReview.id || 
                    (selectedGroupForReview.studentIds && selectedGroupForReview.studentIds.includes(s.id))
                  );

                  if (groupStudents.length === 0) {
                    return (
                      <div className="empty-group-students p-8 text-center">
                        <Users size={40} className="text-slate-300 mx-auto mb-2" />
                        <p className="text-slate-500 text-sm">
                          {lang === 'en' ? 'No students enrolled in this group yet.' : 'لا يوجد طلاب مسجلون في هذه المجموعة حتى الآن.'}
                        </p>
                      </div>
                    );
                  }

                  return groupStudents.map(student => {
                    const completedCount = student.completedChunks?.length || 0;
                    const errorsCount = student.wrongAnswers?.length || 0;
                    const homeworkTargetCount = selectedGroupForReview.homeworkChunks?.length || 0;
                    const homeworkFinished = homeworkTargetCount > 0 && selectedGroupForReview.homeworkChunks.every(hId => student.completedChunks?.includes(hId));

                    return (
                      <div key={student.id} className="group-student-review-card">
                        <div className="student-info-flex">
                          <img src={student.avatar} alt={student.name} className="review-avatar" />
                          <div>
                            <h4 className="review-student-name">{student.name}</h4>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <a 
                                href={`https://wa.me/2${student.phone.replace(/[^0-9]/g, '')}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="whatsapp-quick-link"
                                title="مراسلة الطالب عبر واتساب"
                              >
                                <Phone size={12} />
                                <span>{student.phone}</span>
                              </a>
                              {student.guardianPhone && (
                                <a 
                                  href={`https://wa.me/2${student.guardianPhone.replace(/[^0-9]/g, '')}`} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="whatsapp-quick-link"
                                  style={{ color: '#059669', borderColor: '#a7f3d0' }}
                                  title="مراسلة ولي الأمر عبر واتساب"
                                >
                                  👨‍👩‍👧 <span>ولي الأمر: {student.guardianPhone}</span>
                                </a>
                              )}
                              <span className="student-id-tag">ID: {student.id}</span>
                            </div>
                          </div>
                        </div>

                        {/* أين يقف الطالب بالضبط */}
                        <div className="student-station-cell">
                          <span className="cell-sublabel">{lang === 'en' ? 'Current Station:' : 'أين يقف بالضبط:'}</span>
                          <div className="station-pill">
                            <MapPin size={13} className="text-amber-500 flex-shrink-0" />
                            <span className="station-text">
                              {getStudentCurrentStation ? getStudentCurrentStation(student) : (student.currentStation || 'الدرس 1-1')}
                            </span>
                          </div>
                        </div>

                        {/* مجموع الدرجات والإتقان */}
                        <div className="student-scores-cell">
                          <span className="cell-sublabel">{lang === 'en' ? 'Mastery & Scores:' : 'الدرجات والإتقان:'}</span>
                          <div className="flex items-center gap-2">
                            <span className="score-badge xp-badge">
                              <Flame size={13} className="text-amber-500" />
                              {student.xp} XP
                            </span>
                            <span className="score-badge star-badge">
                              <Star size={13} className="text-yellow-400 fill-yellow-400" />
                              {student.stars}
                            </span>
                            <span className="score-badge chunk-badge">
                              <BookOpen size={13} className="text-emerald-500" />
                              {completedCount} فقرة
                            </span>
                          </div>
                        </div>

                        {/* حالة الواجب */}
                        <div className="student-homework-cell">
                          <span className="cell-sublabel">{lang === 'en' ? 'Homework Status:' : 'حالة الواجب:'}</span>
                          {homeworkTargetCount === 0 ? (
                            <span className="hw-status-badge hw-none">لا يوجد واجب</span>
                          ) : homeworkFinished ? (
                            <span className="hw-status-badge hw-done">
                              <Check size={12} />
                              أتم الواجب بالكامل
                            </span>
                          ) : (
                            <span className="hw-status-badge hw-pending">
                              <Clock size={12} />
                              الواجب قيد الحل
                            </span>
                          )}
                        </div>

                        {/* أزرار الإجراءات للطلاب في المجموعة */}
                        <div className="student-actions-cell flex items-center gap-2">
                          <button
                            className="duo-btn text-xs py-2 px-3 flex items-center gap-1.5"
                            style={{ 
                              background: errorsCount > 0 ? '#ef4444' : '#10b981', 
                              color: '#fff',
                              borderBottomColor: errorsCount > 0 ? '#b91c1c' : '#059669'
                            }}
                            onClick={() => {
                              setSelectedStudentForDiagnosis(student);
                              playSound.click();
                            }}
                          >
                            <Target size={14} />
                            <span>
                              {errorsCount > 0 
                                ? (lang === 'en' ? `Weaknesses (${errorsCount})` : `نقاط الضعف (${errorsCount}) 🎯`) 
                                : (lang === 'en' ? '100% Mastery' : 'إتقان 100% 🌟')}
                            </span>
                          </button>

                          <button
                            className="duo-btn duo-btn-danger text-xs py-2 px-2.5 flex items-center gap-1"
                            onClick={() => {
                              const confirmMsg = lang === 'en'
                                ? `Are you sure you want to delete student "${student.name}"?`
                                : `هل تريد مسح حساب الطالب "${student.name}" نهائياً من المنصة؟`;
                              if (window.confirm(confirmMsg)) {
                                deleteStudent(student.id);
                              }
                            }}
                            title={lang === 'en' ? 'Delete student' : 'مسح حساب الطالب'}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            <div className="modal-footer-row">
              <button 
                className="duo-btn duo-btn-primary w-full py-2.5"
                onClick={() => setSelectedGroupForReview(null)}
              >
                {lang === 'en' ? 'Close Review' : 'إغلاق نافذة مراجعة المجموعة'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* نافذة تشخيص الأخطاء ونقاط الضعف للطالب (إعادة الشرح والتثبيت) */}
      {/* ========================================================= */}
      {selectedStudentForDiagnosis && (
        <div className="modal-backdrop">
          <div className="modal-card student-diagnosis-modal-card">
            <div className="modal-header">
              <div className="flex items-center gap-3">
                <div className="diagnosis-icon-aura">
                  <Target size={24} className="text-amber-500" />
                </div>
                <div>
                  <h3 className="modal-title">
                    {lang === 'en' ? 'Student Weakness & Mistakes Diagnostic' : 'سجل تشخيص نقاط الضعف والأسئلة الخاطئة'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedStudentForDiagnosis.name} • {selectedStudentForDiagnosis.email}
                  </p>
                </div>
              </div>
              <button 
                className="quiz-close-btn"
                onClick={() => setSelectedStudentForDiagnosis(null)}
              >
                ✕
              </button>
            </div>

            <div className="diagnosis-modal-body">
              {/* بطاقة تعريف الطالب وموقعه في المنهج */}
              <div className="diagnosis-student-summary-strip">
                <img src={selectedStudentForDiagnosis.avatar} alt={selectedStudentForDiagnosis.name} className="diagnosis-avatar" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-base text-slate-800">{selectedStudentForDiagnosis.name}</h4>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      {selectedStudentForDiagnosis.xp} XP • {selectedStudentForDiagnosis.stars} ⭐
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-600">
                    <MapPin size={13} className="text-amber-500" />
                    <span>{lang === 'en' ? 'Standing at: ' : 'واقف حالياً عند: '}</span>
                    <strong>{getStudentCurrentStation ? getStudentCurrentStation(selectedStudentForDiagnosis) : (selectedStudentForDiagnosis.currentStation || 'الدرس 1-1')}</strong>
                  </div>
                </div>
              </div>

              {/* إذا كان هناك أخطاء مسجلة */}
              {selectedStudentForDiagnosis.wrongAnswers && selectedStudentForDiagnosis.wrongAnswers.length > 0 ? (
                <div className="diagnosis-errors-container">
                  <div className="diagnosis-section-heading">
                    <AlertTriangle size={18} className="text-red-500" />
                    <span>
                      {lang === 'en' 
                        ? `Recorded Mistakes (${selectedStudentForDiagnosis.wrongAnswers.length}) - Ready for Remediation:` 
                        : `الأسئلة التي أخطأ فيها الطالب (${selectedStudentForDiagnosis.wrongAnswers.length}) - بحاجة لتثبيت الشرح:`
                      }
                    </span>
                  </div>

                  <div className="errors-breakdown-list">
                    {selectedStudentForDiagnosis.wrongAnswers.map((err, idx) => (
                      <div key={err.id || idx} className="error-diagnostic-card">
                        {/* ترويسة بطاقة الخطأ */}
                        <div className="error-card-header">
                          <span className="error-topic-badge">
                            {err.lessonTitle || 'الدرس'} • {err.chunkTitle || 'الفقرة'}
                          </span>
                          <div className="error-meta-tags">
                            {err.attemptsCount > 1 && (
                              <span className="attempts-tag">
                                {err.attemptsCount} محاولات
                              </span>
                            )}
                            <span className="timestamp-tag">{err.timestamp || 'مؤخراً'}</span>
                          </div>
                        </div>

                        {/* نص السؤال كاملاً */}
                        <div className="error-question-box">
                          <span className="q-label">❓ {lang === 'en' ? 'Question:' : 'نص السؤال:'}</span>
                          <p className="q-text">{err.questionText}</p>
                        </div>

                        {/* مقارنة إجابة الطالب الخاطئة بالإجابة النموذجية */}
                        <div className="answers-comparison-grid">
                          <div className="answer-box student-wrong-box">
                            <div className="answer-box-title text-red-600">
                              <span>❌ {lang === 'en' ? "Student's Wrong Choice:" : "إجابة الطالب الخاطئة:"}</span>
                            </div>
                            <p className="answer-content text-red-700 font-semibold">{err.selectedAnswerText}</p>
                          </div>

                          <div className="answer-box teacher-correct-box">
                            <div className="answer-box-title text-emerald-600">
                              <span>✅ {lang === 'en' ? 'Model Correct Answer:' : 'الإجابة النموذجية الصحيحة:'}</span>
                            </div>
                            <p className="answer-content text-emerald-700 font-bold">{err.correctAnswerText}</p>
                          </div>
                        </div>

                        {/* الشرح وتصحيح المفهوم */}
                        {err.explanation && (
                          <div className="concept-explanation-box">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 mb-1">
                              <HelpCircle size={14} />
                              <span>{lang === 'en' ? 'Key Concept & Teacher Explanation:' : '💡 الشرح وتصحيح المفهوم وتثبيته:'}</span>
                            </div>
                            <p className="explanation-text">{err.explanation}</p>
                          </div>
                        )}

                        {/* أزرار معالجة نقطة الضعف وإعادة الاختبار ومراسلة الطالب */}
                        <div className="error-remediation-actions">
                          <button
                            className="duo-btn duo-btn-primary text-xs py-2 px-3 flex items-center gap-1.5"
                            onClick={() => {
                              resetStudentQuizChunk(selectedStudentForDiagnosis.id, err.chunkId);
                              setSelectedStudentForDiagnosis(prev => ({
                                ...prev,
                                wrongAnswers: prev.wrongAnswers.filter(a => a.chunkId !== err.chunkId)
                              }));
                            }}
                            title="إعادة فتح الفقرة في حساب الطالب لإعادة الاختبار وتجاوز الجزء بنسبة 100%"
                          >
                            <RefreshCw size={13} />
                            <span>{lang === 'en' ? 'Reset Topic for Retake 🔄' : 'إعادة فتح الفقرة للطالب لاختبارها وتجاوزها 🔄'}</span>
                          </button>

                          <a
                            href={`https://wa.me/2${selectedStudentForDiagnosis.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              `أهلاً يا ${selectedStudentForDiagnosis.name} 👋\nمعاك أ/ محمد راشد.\nبخصوص سؤالك في درس "${err.lessonTitle}" (${err.chunkTitle}):\n\n❓ السؤال: ${err.questionText}\n❌ إجابتك: ${err.selectedAnswerText}\n✅ الإجابة النموذجية: ${err.correctAnswerText}\n\n💡 توضيح وتثبيت المفهوم:\n${err.explanation}\n\nراجعها كويس وجهز نفسك للاختبار مرة ثانية لتجاوز الجزء بالعلامة الكاملة! 💪`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="duo-btn duo-btn-success text-xs py-2 px-3 flex items-center gap-1.5 text-white"
                            style={{ background: '#25D366', borderBottomColor: '#128C7E' }}
                            title="إرسال توضيح وشرح السؤال للطالب على واتساب بنقرة واحدة"
                          >
                            <MessageSquare size={13} />
                            <span>{lang === 'en' ? 'Send Explanation via WhatsApp 📲' : 'إرسال شرح السؤال على واتساب 📲'}</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* إذا لم يكن هناك أخطاء */
                <div className="empty-errors-state p-8 text-center">
                  <div className="celebration-trophy-aura w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award size={36} className="text-emerald-600" />
                  </div>
                  <h4 className="font-extrabold text-emerald-800 text-lg mt-2">
                    {lang === 'en' ? 'Zero Mistakes Recorded! 🎉' : 'ما شاء الله! لا توجد أخطاء مسجلة 🎉'}
                  </h4>
                  <p className="text-sm text-slate-600 max-w-md mx-auto mt-1">
                    {lang === 'en' 
                      ? 'This student has achieved a 100% accuracy on all tested concepts so far. No weaknesses detected.'
                      : 'أجاب الطالب على كافة الأسئلة بدقة ونموذجية وحقق نسبة إتقان 100% في المحطات التي اختبرها.'
                    }
                  </p>
                </div>
              )}
            </div>

            <div className="modal-footer-row">
              <button 
                className="duo-btn duo-btn-primary w-full py-2.5"
                onClick={() => setSelectedStudentForDiagnosis(null)}
              >
                {lang === 'en' ? 'Done & Close' : 'تم وإغلاق ملف التشخيص'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* نافذة اعتماد الطالب واختيار المجموعة الدراسية */}
      {/* ========================================================= */}
      {studentToApproveWithGroup && (
        <div className="modal-backdrop">
          <div className="modal-card approval-group-modal-card">
            <div className="modal-header">
              <div className="flex items-center gap-2">
                <CheckCircle size={22} className="text-emerald-500" />
                <h3 className="modal-title">
                  {lang === 'en' ? 'Approve & Assign Group' : 'اعتماد الطالب وتسكينه في مجموعته الدراسية'}
                </h3>
              </div>
              <button 
                className="quiz-close-btn"
                onClick={() => setStudentToApproveWithGroup(null)}
              >
                ✕
              </button>
            </div>

            <div className="p-4 flex flex-col gap-4">
              <p className="text-sm text-slate-600">
                {lang === 'en' 
                  ? `Select a study group for student ${studentToApproveWithGroup.name}. Their curriculum lessons will be unlocked automatically.`
                  : `لتفعيل حساب الطالب "${studentToApproveWithGroup.name}" والسماح له بدخول المنصة، اختر المجموعة الدراسية التي ينتمي إليها:`
                }
              </p>

              <div className="form-field">
                <label className="field-label font-bold text-slate-700">
                  {lang === 'en' ? 'Assign to Group *' : 'المجموعة الدراسية المعتمدة *'}
                </label>
                <select
                  className="student-group-select w-full p-2.5 border rounded-lg"
                  value={selectedGroupIdForApproval}
                  onChange={(e) => setSelectedGroupIdForApproval(e.target.value)}
                >
                  <option value="">{lang === 'en' ? '-- Select Study Group --' : '-- اختر المجموعة الدراسية --'}</option>
                  {groups.map(g => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.schedule})
                    </option>
                  ))}
                </select>
              </div>

              <div className="approval-student-preview-mini p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 flex flex-col gap-1">
                <div><strong>البريد:</strong> {studentToApproveWithGroup.email}</div>
                <div><strong>الهاتف:</strong> {studentToApproveWithGroup.phone}</div>
                <div><strong>هاتف ولي الأمر:</strong> {studentToApproveWithGroup.guardianPhone || 'غير مسجل'}</div>
              </div>
            </div>

            <div className="modal-footer-row flex gap-2">
              <button 
                className="duo-btn duo-btn-secondary flex-1 py-2.5"
                onClick={() => setStudentToApproveWithGroup(null)}
              >
                إلغاء
              </button>
              <button 
                className="duo-btn duo-btn-success flex-1 py-2.5"
                onClick={() => {
                  approveStudentWithGroup(studentToApproveWithGroup.id, selectedGroupIdForApproval);
                  setStudentToApproveWithGroup(null);
                }}
              >
                اعتماد وتسكين الطالب فوراً 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
