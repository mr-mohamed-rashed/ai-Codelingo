import React, { useRef, useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { CHAPTERS_METADATA, PATH_NODES } from '../data/curriculumMeta.js';
import { fetchChunkById } from '../services/curriculumService.js';
import { Star, Lock, Check, Play, BookOpen, AlertCircle, Sparkles, Award, Trophy, Crown, Flame, School, BookOpenCheck } from 'lucide-react';
import { playSound } from '../utils/audioEngine';
import { RobotMascotGuide, RobotSVG } from './RobotMascot';

const CHAPTER_EN_DESCRIPTIONS = {
  1: "Computing evolution, Moore's Law, neural networks, AI foundations, ethics, and governance.",
  2: "Symmetric and asymmetric encryption, firewalls, DMZ, incident response lifecycle, and risk management.",
  3: "3-Tier web architecture, HTTP/HTTPS protocols, and the fundamental roles of HTML, CSS, and JavaScript.",
  4: "Digital media characteristics, User Persona, CRAP design principles, website evaluation, and PDCA cycle."
};

export const DuolingoPath = () => {
  const {
    currentStudent,
    isStudentLoggedIn,
    currentStudentGroup,
    isChunkUnlocked,
    isChunkHomework,
    setActiveChunk,
    setActiveModal,
    robotMovingState,
    clearRobotMove,
    lang,
    t
  } = useApp();

  const pathContainerRef = useRef(null);

  // تحديد المحطة النشطة التي عليها الدور (أول محطة مفتوحة وغير مكتملة)
  const activeStationId = useMemo(() => {
    const uncompletedUnlocked = PATH_NODES.find(c => 
      isChunkUnlocked(c.id) && !currentStudent?.completedChunks?.includes(c.id)
    );
    return uncompletedUnlocked ? uncompletedUnlocked.id : PATH_NODES[0].id;
  }, [currentStudent?.completedChunks, isChunkUnlocked]);

  // حالة الروبوت الطائر عند الانتقال بين المحطات
  const [flyingRobot, setFlyingRobot] = useState(null);

  // مراقبة أمر الانتقال وتحريك المرشد الآلي بين المحطة القديمة والجديدة
  useEffect(() => {
    if (!robotMovingState?.isMoving || !robotMovingState.fromChunkId || !robotMovingState.toChunkId) {
      return;
    }

    const fromId = robotMovingState.fromChunkId;
    const toId = robotMovingState.toChunkId;

    const timer = setTimeout(() => {
      const fromEl = document.getElementById(`node-station-${fromId}`);
      const toEl = document.getElementById(`node-station-${toId}`);
      const containerEl = pathContainerRef.current;

      if (fromEl && toEl && containerEl) {
        const containerRect = containerEl.getBoundingClientRect();
        const fromRect = fromEl.getBoundingClientRect();
        const toRect = toEl.getBoundingClientRect();

        const startX = fromRect.left - containerRect.left + (fromRect.width / 2) - 34;
        const startY = fromRect.top - containerRect.top + (fromRect.height / 2) - 34;

        const targetX = toRect.left - containerRect.left + (toRect.width / 2) - 34;
        const targetY = toRect.top - containerRect.top + (toRect.height / 2) - 34;

        // تمرير الكاميرا بسلاسة للمحطة المستهدفة
        toEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // تعيين نقطة انطلاق الروبوت
        setFlyingRobot({
          x: startX,
          y: startY,
          isAnimating: false,
          isLanded: false
        });

        // تشغيل التحليق في الفريم التالي
        requestAnimationFrame(() => {
          setFlyingRobot({
            x: targetX,
            y: targetY,
            isAnimating: true,
            isLanded: false
          });
        });

        // وصول الروبوت بعد انتهاء مدة الطيران (1300ms)
        const landTimer = setTimeout(() => {
          setFlyingRobot(prev => prev ? { ...prev, isLanded: true } : null);
          playSound.levelUp();

          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.55 },
            colors: ['#38bdf8', '#fbbf24', '#22c55e', '#a855f7']
          });

          // العودة للوضع المستقر بجانب المحطة الجديدة
          const finishTimer = setTimeout(() => {
            setFlyingRobot(null);
            clearRobotMove();
          }, 1400);

          return () => clearTimeout(finishTimer);
        }, 1300);

        return () => clearTimeout(landTimer);
      } else {
        if (toEl) {
          toEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        clearRobotMove();
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [robotMovingState?.isMoving, robotMovingState?.fromChunkId, robotMovingState?.toChunkId]);

  const handleNodeClick = async (chunk, isUnlocked, isCompleted) => {
    playSound.click();
    if (!isUnlocked) {
      playSound.wrong();
      if (!isStudentLoggedIn) {
        setActiveModal('auth');
      } else {
        setActiveModal('approval_notice');
      }
      return;
    }
    setActiveChunk(chunk);
    if (chunk.type === 'lesson_exam') {
      setActiveModal('quiz');
    } else {
      setActiveModal('lesson');
    }
    // Fetch full chunk details (cards, questions, audio) on-demand
    try {
      const fullChunk = await fetchChunkById(chunk.id);
      if (fullChunk) {
        setActiveChunk(fullChunk);
      }
    } catch (e) {
      console.warn('On-demand chunk fetch note:', e);
    }
  };

  // الأنماط التبادلية لمنحنى مسار دوولينجو
  const alignmentPatterns = ['node-row-center', 'node-row-right', 'node-row-center', 'node-row-left'];

  return (
    <div className="path-main-container" ref={pathContainerRef}>
      {/* تحليق المرشد الآلي بين المحطات */}
      {flyingRobot && (
        <div
          className="flying-robot-overlay"
          style={{
            transform: `translate3d(${flyingRobot.x}px, ${flyingRobot.y}px, 0)`,
            transition: flyingRobot.isAnimating ? 'transform 1.3s cubic-bezier(0.25, 1, 0.5, 1)' : 'none'
          }}
        >
          <div className="flying-robot-container">
            <RobotSVG isFlying={true} size={68} />
            <div className="flying-robot-speech">
              {flyingRobot.isLanded
                ? (lang === 'en' ? 'Arrived at your next mission! 🎯' : 'وصلنا لمحطتك التالية بنجاح! 🎯')
                : (lang === 'en' 
                    ? `🎉 Excellent! Mastered at ${robotMovingState?.score || 100}%! Moving down to next station... 🚀`
                    : `🎉 كفو يا بطل! أتقنت بنسبة ${robotMovingState?.score || 100}%! متوجهين للمحطة التالية 🚀`
                  )
              }
            </div>
          </div>
        </div>
      )}

      {/* تنبيه إذا كان حساب الطالب قيد المراجعة */}
      {currentStudent && currentStudent.status === 'pending' && (
        <div className="pending-review-banner">
          <AlertCircle size={28} color="#f59e0b" style={{ flexShrink: 0 }} />
          <div>
            <h4 className="pending-notice-title">{t('pendingNoticeTitle')}</h4>
            <p className="pending-notice-desc">{t('pendingNoticeDesc')}</p>
          </div>
        </div>
      )}

      {/* Chapters & Progression Nodes */}
      {CHAPTERS_METADATA.map((chapter) => {
        const chapterChunks = PATH_NODES.filter(c => c.chapterId === chapter.id);
        
        // استخراج قائمة الدروس الفريدة داخل هذا الفصل
        const lessonIds = [...new Set(chapterChunks.map(c => c.lessonId))];

        const chapterTitle = lang === 'ar' ? chapter.title : chapter.enTitle;
        const chapterDesc = lang === 'ar' 
          ? chapter.description 
          : (CHAPTER_EN_DESCRIPTIONS[chapter.id] || (chapter.enTitle + " - Core principles and applied technologies."));

        return (
          <div key={chapter.id} className="chapter-section-wrapper">
            {/* بطاقة ترويسة الفصل الكاملة ذات التصميم الفاخر */}
            <div 
              className="chapter-path-header"
              style={{ background: chapter.gradient }}
            >
              <div className="chapter-header-text">
                <div className="chapter-badge-pill">
                  <span>{t('chapter')} {chapter.id}</span>
                  <span className="bullet-sep">•</span>
                  <span>{chapter.enTitle}</span>
                </div>
                <h2>{chapterTitle}</h2>
                <p>{chapterDesc}</p>
              </div>
              <div className="chapter-header-avatar">
                {chapter.id === 1 ? '💻' : chapter.id === 2 ? '🛡️' : chapter.id === 3 ? '🌐' : '🎨'}
              </div>
            </div>

            {/* تفريع الدروس داخل الفصل */}
            <div className="chapter-lessons-container">
              {lessonIds.map((lessonId) => {
                const lessonChunks = chapterChunks.filter(c => c.lessonId === lessonId);
                const firstChunk = lessonChunks[0];
                const regularChunks = lessonChunks.filter(c => c.type === 'chunk');
                const examChunk = lessonChunks.find(c => c.type === 'lesson_exam');

                const lessonTitle = lang === 'en' ? (firstChunk?.enLessonTitle || firstChunk?.lessonTitle) : firstChunk?.lessonTitle;

                const isExamCompleted = examChunk && (
                  currentStudent?.trophies?.includes(examChunk.id) || 
                  currentStudent?.completedChunks?.includes(examChunk.id)
                );

                return (
                  <div key={lessonId} className="lesson-unit-block">
                    {/* شريط عنوان الدرس الفاصل الأنيق */}
                    <div className="lesson-ribbon-bar">
                      <div className="lesson-ribbon-info">
                        <span className="lesson-pill-tag">{t('lesson')} {lessonId}</span>
                        <h3 className="lesson-ribbon-title">{lessonTitle}</h3>
                      </div>
                      <div className="lesson-ribbon-badge">
                        <span>{regularChunks.length} {t('independentChunks')}</span>
                        {isExamCompleted ? (
                          <span className="lesson-ribbon-trophy-tag" title={t('lessonTrophyClaimed')}>
                            <Trophy size={13} fill="#fbbf24" color="#d97706" />
                            <span>{lang === 'en' ? 'Trophy Won' : 'تم حصد الكأس'}</span>
                          </span>
                        ) : (
                          <span className="exam-indicator-badge">{t('fullExam')}</span>
                        )}
                      </div>
                    </div>

                    {/* مسار عقد فقرات الدرس واختباره النهائي */}
                    <div className="lesson-nodes-flow">
                      {lessonChunks.map((chunk, index) => {
                        const isUnlocked = isChunkUnlocked(chunk.id);
                        const isCompleted = currentStudent?.completedChunks?.includes(chunk.id);
                        const isHw = isChunkHomework(chunk.id);
                        const alignClass = alignmentPatterns[index % alignmentPatterns.length];
                        const isExam = chunk.type === 'lesson_exam';

                        const chunkTitle = lang === 'en' ? (chunk?.enChunkTitle || chunk.chunkTitle) : chunk.chunkTitle;

                        // النجوم المكتسبة لهذه المحطة
                        const chunkStars = currentStudent?.chunkRatings?.[chunk.id]?.stars || (isCompleted ? 3 : 0);

                        // هل هذه هي المحطة النشطة التي يقف عندها المرشد الآلي؟
                        const isActiveStation = chunk.id === activeStationId;

                        return (
                          <div 
                            key={chunk.id} 
                            id={`node-station-${chunk.id}`}
                            className={`duo-node-wrapper ${alignClass} ${
                              isCompleted ? 'node-completed' : isUnlocked ? 'node-active' : 'node-locked'
                            } ${isExam ? 'exam-boss-node' : ''} ${isActiveStation ? 'node-is-current-turn' : ''} ${isHw ? 'node-is-homework' : ''}`}
                            onClick={() => handleNodeClick(chunk, isUnlocked, isCompleted)}
                          >
                            {/* شارة الإنجاز: مكتمل فقط دون كلمة واجب */}
                            {isCompleted && (
                              <div className="node-homework-ribbon hw-done">
                                <span>{lang === 'en' ? '✓ Completed' : '✓ مكتمل'}</span>
                              </div>
                            )}

                            {/* المرشد الآلي يقف بجوار المحطة التي عليها الدور */}
                            {isActiveStation && !flyingRobot && (
                              <div className="active-station-robot-anchor">
                                <RobotMascotGuide
                                  stationTitle={chunkTitle}
                                  onStartClick={() => handleNodeClick(chunk, isUnlocked, isCompleted)}
                                  lang={lang}
                                  t={t}
                                />
                              </div>
                            )}

                            {/* الأيقونة التوضيحية المستقلة لكل فقرة */}
                            <div className="node-concept-badge" title={chunkTitle}>
                              <span>{chunk.iconEmoji || (isExam ? '🏆' : '📌')}</span>
                            </div>

                            <button 
                              className={`duo-node-btn ${isExam ? 'boss-btn' : ''}`}
                              title={isUnlocked ? `${chunkTitle}` : (lang === 'ar' ? 'هذه المرحلة مقفلة - يجب إكمال ما قبلها أولاً' : 'Locked Stage')}
                            >
                              {isExam ? (
                                isCompleted ? (
                                  <Trophy size={36} color="#fbbf24" fill="#fbbf24" className="gold-trophy-pulse" />
                                ) : isUnlocked ? (
                                  <Crown size={34} color="#ffffff" className="crown-bounce" />
                                ) : (
                                  <Lock size={28} color="#94a3b8" />
                                )
                              ) : (
                                isCompleted ? (
                                  <Check size={32} color="#ffffff" strokeWidth={3} />
                                ) : isUnlocked ? (
                                  <Play size={28} color="#ffffff" fill="#ffffff" style={{ [lang === 'ar' ? 'marginRight' : 'marginLeft']: '-3px' }} />
                                ) : (
                                  <Lock size={26} color="#94a3b8" />
                                )
                              )}
                            </button>

                            {/* شارة التقييم بالنجوم الثلاثة للفقرات المكتملة */}
                            {isCompleted && !isExam && (
                              <div 
                                className="node-stars-pill" 
                                title={chunkStars === 3 
                                  ? (lang === 'en' ? '3 Stars: Perfect Score & Distinction Question' : '3 نجوم: علامة كاملة وسؤال الامتياز') 
                                  : `${chunkStars}/3 ${t('stars')}`
                                }
                              >
                                {[1, 2, 3].map((s) => (
                                  <Star
                                    key={s}
                                    size={12}
                                    className={`node-star-icon ${s <= chunkStars ? 'star-filled' : 'star-empty'}`}
                                    fill={s <= chunkStars ? '#fbbf24' : 'rgba(148, 163, 184, 0.35)'}
                                    color={s <= chunkStars ? '#f59e0b' : 'transparent'}
                                  />
                                ))}
                              </div>
                            )}

                            {/* شارة كأس الإتقان الذهبي للاختبارات الشاملة المكتملة */}
                            {isCompleted && isExam && (
                              <div className="node-trophy-gold-pill" title={lang === 'en' ? 'Lesson Mastery Trophy Awarded!' : 'كأس إتقان الدرس الذهبي!'}>
                                <Trophy size={13} fill="#fbbf24" color="#d97706" />
                                <span>{lang === 'en' ? 'Mastery Cup' : 'كأس الإتقان'}</span>
                              </div>
                            )}

                            {/* شارة عنوان المرحلة بالكامل دون أي اقتصاص */}
                            <div className={`node-title-label ${isExam ? 'label-exam-boss' : ''}`}>
                              {isExam ? (
                                <div className="exam-label-inner">
                                  <span className="exam-label-title">🏆 {chunkTitle}</span>
                                  <span className="exam-label-reward">+{chunk.xpReward} XP • {chunk.starsReward} ⭐</span>
                                </div>
                              ) : (
                                <span className="chunk-label-text">{chunkTitle}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DuolingoPath;

