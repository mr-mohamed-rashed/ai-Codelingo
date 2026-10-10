import React, { useState, useEffect, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles, 
  HelpCircle, 
  RotateCcw, 
  BookOpen, 
  Award, 
  Flame, 
  Star, 
  Heart,
  Volume2, 
  Trophy, 
  Layers,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { playSound, speakArabic, speakEnglish } from '../utils/audioEngine';
import { CHAPTERS_METADATA, ALL_CHUNK_IDS } from '../data/curriculumMeta.js';

/**
 * دالة مساعدة لتوليد وجه بديل للسؤال عند الخطأ
 * "ونأكد عليه السؤال مراراً وتكراراً بأوجه مختلفة لحد ما يحفظ السؤال"
 */
function generateReinforcementQuestion(failedQuestion, chunk, lang) {
  if (!failedQuestion) return null;

  const pool = chunk?.questionPool || [];
  // 1. البحث عن سؤال بديل لم يُعرض بعد في بنك أسئلة الفقرة
  const altCandidate = pool.find(q => 
    q.id !== failedQuestion.id && 
    (q.id.startsWith(failedQuestion.id) || q.id.includes('alt') || q.id.includes('reinforce'))
  );

  if (altCandidate) {
    return {
      ...altCandidate,
      uniqueKey: `${altCandidate.id}_re_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      isReinforcement: true,
      originalQuestionId: failedQuestion.originalQuestionId || failedQuestion.id,
      reinforceTitle: lang === 'en' 
        ? '🔄 Concept Reinforcement: Alternate Question Variant' 
        : '🔄 محطة التثبيت: تأكيد وحفظ المفهوم بوجه بديل'
    };
  }

  // 2. إذا لم يتوفر سؤال جاهز، ننشئ وجهاً بديلاً ذكياً للمفهوم:
  // أ. إذا كان اختيار من متعدد أو اختيار الأصح: نحوّله لسؤال صواب أو خطأ حول الإجابة الصحيحة لتثبيتها في الذاكرة
  if (failedQuestion.level === 'mcq' || failedQuestion.level === 'best_choice') {
    const correctText = failedQuestion.options?.[failedQuestion.correctIndex] || '';
    const shouldBeTrue = Math.random() > 0.45;

    let statementQuestion = '';
    if (shouldBeTrue) {
      statementQuestion = lang === 'en'
        ? `True or False (Concept Reinforcement):\nFor: "${failedQuestion.question}"\nThe correct answer is: "${correctText}".`
        : `تأكيد وحفظ المفهوم (صواب أم خطأ):\nبخصوص: «${failedQuestion.question}»\nهل العبارة الصحيحة المعتمدة هي: «${correctText}»؟`;
    } else {
      const wrongIndex = (failedQuestion.correctIndex + 1) % (failedQuestion.options?.length || 2);
      const wrongText = failedQuestion.options?.[wrongIndex] || '';
      statementQuestion = lang === 'en'
        ? `True or False (Concept Reinforcement):\nFor: "${failedQuestion.question}"\nThe statement: "${wrongText}" is completely correct.`
        : `تأكيد دقة المفهوم (صواب أم خطأ):\nبخصوص: «${failedQuestion.question}»\nهل العبارة: «${wrongText}» هي التوصيف المعتمد السليم؟`;
    }

    return {
      id: `${failedQuestion.id}_tf_re_${Date.now()}`,
      uniqueKey: `${failedQuestion.id}_tf_re_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      level: 'true_false',
      isTrue: shouldBeTrue,
      question: statementQuestion,
      explanation: failedQuestion.explanation,
      isReinforcement: true,
      originalQuestionId: failedQuestion.originalQuestionId || failedQuestion.id,
      reinforceTitle: lang === 'en' 
        ? '🔄 Concept Reinforcement: True or False Angle' 
        : '🔄 محطة التثبيت: صواب أم خطأ لترسيخ وحفظ المفهوم'
    };
  }

  // ب. إذا كان السؤال صواب أو خطأ: نعكس صياغته لاختبار المفهوم من زاوية نقيضة
  if (failedQuestion.level === 'true_false') {
    const isTrueOriginal = failedQuestion.isTrue;
    return {
      id: `${failedQuestion.id}_rev_re_${Date.now()}`,
      uniqueKey: `${failedQuestion.id}_rev_re_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      level: 'true_false',
      isTrue: !isTrueOriginal,
      question: lang === 'en'
        ? `Reinforcement Check: The opposite statement of: "${failedQuestion.question}" is correct.`
        : `تأكيد المفهوم: نقيض العبارة التالية هو الصحيح: «${failedQuestion.question}»`,
      explanation: failedQuestion.explanation,
      isReinforcement: true,
      originalQuestionId: failedQuestion.originalQuestionId || failedQuestion.id,
      reinforceTitle: lang === 'en' 
        ? '🔄 Concept Reinforcement: Verification Angle' 
        : '🔄 محطة التثبيت: تأكيد المفهوم بوجه تحليلي دقيق'
    };
  }

  // ج. إذا كان تكملة مصطلح: نحوّله لسؤال اختيار من متعدد مباشر
  if (failedQuestion.level === 'timed_fill') {
    return {
      id: `${failedQuestion.id}_mcq_re_${Date.now()}`,
      uniqueKey: `${failedQuestion.id}_mcq_re_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      level: 'mcq',
      question: lang === 'en'
        ? `Memorization Check: What is the exact term in: "${failedQuestion.questionTemplate}"?`
        : `تثبيت حفظ المصطلح: ما هو المصطلح العلمي الدقيق المطلوب في: «${failedQuestion.questionTemplate}»؟`,
      options: failedQuestion.options || [],
      correctIndex: (failedQuestion.options || []).indexOf(failedQuestion.missingWord),
      explanation: failedQuestion.explanation,
      isReinforcement: true,
      originalQuestionId: failedQuestion.originalQuestionId || failedQuestion.id,
      reinforceTitle: lang === 'en' 
        ? '🔄 Term Mastery: Recall Confirmation' 
        : '🔄 محطة التثبيت: استرجاع المصطلح العلمي للتأكد من حفظه'
    };
  }

  return null;
}

export default function QuizEngine() {
  const { 
    activeChunk, 
    localizedActiveChunk, 
    setActiveModal, 
    setActiveChunk, 
    markChunkCompleted, 
    triggerRobotMove,
    logStudentWrongAnswer,
    lang, 
    t 
  } = useApp();

  const chunk = localizedActiveChunk || activeChunk;
  const isExamMode = chunk?.type === 'lesson_exam' || chunk?.isLessonExam;

  // ==========================================
  // حالة المحاولات وقائمة الأسئلة الديناميكية
  // ==========================================
  const [attemptCount, setAttemptCount] = useState(0);
  const [questionsQueue, setQuestionsQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [initialQuestionsCount, setInitialQuestionsCount] = useState(8);

  // تتبع الإجابات والأخطاء في المحاولة الأولى لحساب الدرجة النهائية
  const [firstAttemptMistakes, setFirstAttemptMistakes] = useState(new Set());

  // حالة شاشات النهاية (النجاح فوق 90%، أو الرجوع الإجباري للشرح أقل من 90%)
  const [finalScorePercent, setFinalScorePercent] = useState(100);
  const [isSuccessFinished, setIsSuccessFinished] = useState(false);
  const [isMandatoryReview, setIsMandatoryReview] = useState(false);

  // تفاعل السؤال الحالي
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hearts, setHearts] = useState(3);

  // تتبع سؤال التميز وسجل النجوم
  const [bestChoiceAnsweredCorrectly, setBestChoiceAnsweredCorrectly] = useState(true);
  const [earnedStarsAwarded, setEarnedStarsAwarded] = useState(3);

  // مؤقت الأسئلة محددة الوقت
  const [timeLeft, setTimeLeft] = useState(25);
  const timerRef = useRef(null);

  // تهيئة طابور الأسئلة عند بدء الاختبار أو إعادة المحاولة
  useEffect(() => {
    if (!chunk) return;
    let baseList = [];
    if (isExamMode) {
      baseList = chunk.examQuestions || [];
    } else {
      baseList = chunk.questionPool ? chunk.questionPool.slice(0, 8) : [];
    }

    const formattedQueue = baseList.map((q, idx) => ({
      ...q,
      uniqueKey: `${q.id || 'q'}_init_${idx}`,
      originalQuestionId: q.id || `q_${idx}`,
      isReinforcement: false
    }));

    setQuestionsQueue(formattedQueue);
    setInitialQuestionsCount(formattedQueue.length || 8);
    setCurrentIndex(0);
    setFirstAttemptMistakes(new Set());
    setSelectedAnswer(null);
    setIsChecked(false);
    setIsCorrect(false);
    setHearts(3);
    setBestChoiceAnsweredCorrectly(true);
    setIsSuccessFinished(false);
    setIsMandatoryReview(false);
    setFinalScorePercent(100);
  }, [chunk, attemptCount, isExamMode]);

  const activeQuestion = questionsQueue[currentIndex] || null;

  // مؤقت التكملة بوقت محدد
  useEffect(() => {
    if (!isExamMode && activeQuestion?.level === 'timed_fill' && activeQuestion && !isChecked && !isMandatoryReview && !isSuccessFinished) {
      const initialTime = activeQuestion.timeLimit || 25;
      setTimeLeft(initialTime);

      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleTimeExpired();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, activeQuestion, isChecked, isMandatoryReview, isSuccessFinished, attemptCount, isExamMode]);

  const handleTimeExpired = () => {
    playSound.wrong();
    setIsChecked(true);
    setIsCorrect(false);

    if (activeQuestion && !activeQuestion.isReinforcement) {
      setFirstAttemptMistakes(prev => {
        const next = new Set(prev);
        next.add(activeQuestion.originalQuestionId);
        return next;
      });

      if (logStudentWrongAnswer) {
        logStudentWrongAnswer({
          questionId: activeQuestion.id || activeQuestion.originalQuestionId,
          questionText: activeQuestion.question,
          selectedAnswerText: lang === 'en' ? 'Time expired with no answer' : 'انتهى الوقت المحدد دون تحديد إجابة',
          correctAnswerText: String(activeQuestion.missingWord || ''),
          explanation: activeQuestion.explanation || '',
          chunkId: chunk.id,
          chunkTitle: chunk.chunkTitle || chunk.title,
          lessonTitle: chunk.lessonTitle || ''
        });
      }
    }

    setHearts(prev => Math.max(1, prev - 1));

    // إضافة وجه بديل لترسيخ وحفظ المفهوم
    const alternateQ = generateReinforcementQuestion(activeQuestion, chunk, lang);
    if (alternateQ) {
      setQuestionsQueue(prev => [...prev, alternateQ]);
    }
  };

  if (!activeChunk || !chunk) return null;

  const chapter = CHAPTERS_METADATA.find(c => c.id === chunk.chapterId) || CHAPTERS_METADATA[0];
  const chapterTitle = lang === 'ar' ? chapter.title : chapter.enTitle;
  const chunkTitle = chunk.chunkTitle;
  const lessonTitle = chunk.lessonTitle;

  // التحقق من الإجابة وتطبيق آلية التثبيت والتكرار عند الخطأ
  const handleCheckAnswer = () => {
    if (selectedAnswer === null || isChecked || !activeQuestion) return;

    let correct = false;

    if (isExamMode) {
      correct = selectedAnswer === activeQuestion.correctIndex;
    } else {
      if (activeQuestion.level === 'mcq' || activeQuestion.level === 'best_choice') {
        correct = selectedAnswer === activeQuestion.correctIndex;
      } else if (activeQuestion.level === 'true_false') {
        correct = selectedAnswer === activeQuestion.isTrue;
      } else if (activeQuestion.level === 'timed_fill') {
        correct = selectedAnswer === activeQuestion.missingWord;
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }

    setIsChecked(true);
    setIsCorrect(correct);

    if (correct) {
      playSound.correct();
    } else {
      playSound.wrong();

      // إذا أخطأ في سؤال الأصح والأشمل (سؤال التميز)
      if (activeQuestion?.level === 'best_choice') {
        setBestChoiceAnsweredCorrectly(false);
      }

      // إذا كان السؤال أصلياً (ليس سؤال تثبيت)، نسجل أنه تم الخطأ فيه في المحاولة الأولى
      if (!activeQuestion.isReinforcement) {
        setFirstAttemptMistakes(prev => {
          const next = new Set(prev);
          next.add(activeQuestion.originalQuestionId);
          return next;
        });

        // تسجيل السؤال الخاطئ وإجابة الطالب وتصحيحها فوراً للتشخيص الأكاديمي
        if (logStudentWrongAnswer) {
          let selectedText = '';
          let correctText = '';
          if (isExamMode || activeQuestion.level === 'mcq' || activeQuestion.level === 'best_choice') {
            selectedText = activeQuestion.options?.[selectedAnswer] || String(selectedAnswer);
            correctText = activeQuestion.options?.[activeQuestion.correctIndex] || '';
          } else if (activeQuestion.level === 'true_false') {
            selectedText = selectedAnswer ? (lang === 'en' ? 'True' : 'صحيح') : (lang === 'en' ? 'False' : 'خطأ');
            correctText = activeQuestion.isTrue ? (lang === 'en' ? 'True' : 'صحيح') : (lang === 'en' ? 'False' : 'خطأ');
          } else if (activeQuestion.level === 'timed_fill') {
            selectedText = String(selectedAnswer);
            correctText = String(activeQuestion.missingWord || '');
          }

          logStudentWrongAnswer({
            questionId: activeQuestion.id || activeQuestion.originalQuestionId,
            questionText: activeQuestion.question,
            selectedAnswerText: selectedText,
            correctAnswerText: correctText,
            explanation: activeQuestion.explanation || '',
            chunkId: chunk.id,
            chunkTitle: chunk.chunkTitle || chunk.title,
            lessonTitle: chunk.lessonTitle || ''
          });
        }
      }

      // تقليل القلوب بشكل رمزي (مع الحفاظ على فرصة إكمال دورة التثبيت)
      setHearts(prev => Math.max(1, prev - 1));

      // تأكيد السؤال مراراً وتكراراً بأوجه مختلفة حتى يحفظ الطالب السؤال
      const alternateQ = generateReinforcementQuestion(activeQuestion, chunk, lang);
      if (alternateQ) {
        setQuestionsQueue(prev => [...prev, alternateQ]);
      }
    }
  };

  // المتابعة للسؤال التالي أو تقييم النتيجة وفق شرط الـ 90%
  const handleNextStep = () => {
    if (currentIndex < questionsQueue.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsChecked(false);
      setIsCorrect(false);
    } else {
      // تم الانتهاء من جميع الأسئلة الأساسية وكافة أسئلة التثبيت والتكرار!
      // حساب نسبة الإتقان الأكاديمي:
      const totalInitial = initialQuestionsCount || 8;
      const mistakesCount = firstAttemptMistakes.size;

      let score = 100;
      if (mistakesCount === 0) {
        score = 100;
      } else if (mistakesCount === 1) {
        // خطأ واحد فقط وتم تثبيته وتكراره بنجاح باهر في أسئلة التثبيت -> 92% (يتجاوز 90%)
        score = 92;
      } else if (mistakesCount === 2) {
        score = 75;
      } else if (mistakesCount === 3) {
        score = 63;
      } else {
        score = Math.max(25, Math.round(((totalInitial - mistakesCount) / totalInitial) * 100));
      }

      setFinalScorePercent(score);

      if (score >= 90) {
        // اجتياز بنجاح! نسبة الإتقان >= 90%
        const finalStars = (score === 100 && bestChoiceAnsweredCorrectly) ? 3 : 2;
        const isFullDistinction = (score === 100 && bestChoiceAnsweredCorrectly);
        setEarnedStarsAwarded(finalStars);
        setIsSuccessFinished(true);
        setIsMandatoryReview(false);
        playSound.levelUp();

        markChunkCompleted(chunk.id, chunk.xpReward, finalStars, isFullDistinction, isExamMode);

        confetti({
          particleCount: 160,
          spread: 90,
          origin: { y: 0.55 },
          colors: ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6']
        });
      } else {
        // نسبة الإتقان أقل من 90%
        // "غير كده بنخليه يرجع للدرس إجباري"
        setIsMandatoryReview(true);
        setIsSuccessFinished(false);
        playSound.wrong();
      }
    }
  };

  // العودة إلى مراجعة الشرح (إجباري عند عدم تجاوز 90%)
  const handleBackToLesson = () => {
    playSound.click();
    setActiveModal('lesson');
  };

  // إعادة الاختبار لتحسين النتيجة وحصد العلامة الكاملة والـ 3 نجوم
  const handleRetakeQuiz = () => {
    playSound.click();
    setAttemptCount(prev => prev + 1);
  };

  // الانتقال للمرحلة التالية في المنهج بعد النجاح وتحريك المرشد الآلي مع نسبة التهنئة
  const handleGoToNextChunk = () => {
    const currentIndexInCurriculum = ALL_CHUNK_IDS.indexOf(activeChunk.id);
    if (currentIndexInCurriculum !== -1 && currentIndexInCurriculum + 1 < ALL_CHUNK_IDS.length) {
      const nextChunkId = ALL_CHUNK_IDS[currentIndexInCurriculum + 1];
      // إغلاق المودال وتحريك المرشد الآلي على الخريطة بتهنئة بالنسبة المئوية والانتقال للمحطة التالية
      triggerRobotMove(activeChunk.id, nextChunkId, finalScorePercent);
    } else {
      setActiveModal(null);
    }
    playSound.click();
  };

  const speakQuestion = (text) => {
    if (!text) return;
    if (lang === 'en') {
      speakEnglish(text);
    } else {
      speakArabic(text);
    }
  };

  const totalSteps = questionsQueue.length || 8;
  const currentStepNum = currentIndex;

  return (
    <div className="modal-backdrop">
      <div className={`modal-card quiz-modal-card ${isExamMode ? 'exam-boss-modal' : ''}`}>
        
        {/* شريط التقدم العلوي على طريقة دوولينجو */}
        {!isMandatoryReview && !isSuccessFinished && (
          <div className="quiz-header-bar">
            <button 
              className="quiz-close-btn"
              onClick={() => setActiveModal(null)}
              title={t('close')}
            >
              ✕
            </button>

            {/* شريط التقدم */}
            <div className="quiz-progress-track">
              <div 
                className="quiz-progress-fill"
                style={{ width: `${((currentStepNum + (isChecked && isCorrect ? 1 : 0)) / totalSteps) * 100}%` }}
              />
            </div>

            {/* القلوب / الفرص */}
            <div className="quiz-hearts-display">
              {[...Array(3)].map((_, i) => (
                <Heart 
                  key={i} 
                  size={20} 
                  className={`heart-icon ${i < hearts ? 'heart-active' : 'heart-empty'}`} 
                />
              ))}
            </div>
          </div>
        )}

        {/* بطاقة تعريف الفصل والفقرة */}
        <div className="chapter-card-banner">
          <div className="chapter-banner-left">
            <div className="chapter-banner-badge">
              <Layers size={14} />
              <span>{lang === 'en' ? `Chapter ${chunk.chapterId}` : `الفصل ${chunk.chapterId}`}</span>
            </div>
            <span className="chapter-banner-name">{chapterTitle}</span>
          </div>
          <div className="chapter-banner-chunk">
            <span className="chapter-chunk-badge">{chunk.iconEmoji || '🎯'}</span>
            <span className="chapter-chunk-title">{chunkTitle}</span>
          </div>
        </div>

        {/* ==================================================== */}
        {/* 1. شاشة المراجعة الإجبارية للدرس عند الحصول على أقل من 90% */}
        {/* ==================================================== */}
        {isMandatoryReview ? (
          <div className="quiz-mandatory-container">
            <div className="mandatory-icon-box">
              <AlertTriangle size={42} />
            </div>

            <h3 className="mandatory-title">
              {t('masteryThresholdWarning')}
            </h3>

            {/* عرض نسبة الإتقان المحققة باللون الأحمر / البرتقالي */}
            <div className="mastery-score-display">
              <div className="mastery-score-pill score-fail">
                <span className="score-label">{t('masteryScore')}</span>
                <span className="score-number">{finalScorePercent}%</span>
                <span className="score-note">{t('requiredThresholdNote')}</span>
              </div>
            </div>

            <div className="mandatory-card-alert">
              <p>{t('mandatoryReviewNotice')}</p>
            </div>

            <div className="mandatory-actions">
              <button 
                className="duo-btn duo-btn-primary w-full py-4 text-lg font-bold"
                onClick={handleBackToLesson}
              >
                <BookOpen size={22} />
                {t('backToLessonMandatory')}
              </button>
            </div>
          </div>
        ) : isSuccessFinished ? (
          /* ==================================================== */
          /* 2. شاشة النجاح والاحتفال عند تحقيق 90% فأكثر */
          /* ==================================================== */
          <div className="quiz-success-container">
            <div className="success-badge-wrapper">
              {isExamMode ? (
                <Trophy size={88} className="success-badge-icon text-amber-400" />
              ) : (
                <Award size={80} className="success-badge-icon" />
              )}
              <div className="sparkle-orbit">
                <Sparkles size={26} className="sparkle-1" />
                <Sparkles size={22} className="sparkle-2" />
              </div>
            </div>

            <h2 className="success-title">
              {isExamMode 
                ? (lang === 'en' ? 'Congratulations! Lesson Fully Mastered 🏆' : 'مبروك! أتقنت الدرس كاملاً 🏆')
                : (lang === 'en' ? 'Awesome Job Champion! 🌟' : 'رائع وممتاز يا بطل! 🌟')
              }
            </h2>
            <p className="success-subtitle">
              {isExamMode ? (
                lang === 'en' ? (
                  <>Mastery Exam passed for: <strong>"{lessonTitle}"</strong></>
                ) : (
                  <>تم اجتياز الاختبار الشامل لـ: <strong>"{chunk.lessonTitle}"</strong></>
                )
              ) : (
                lang === 'en' ? (
                  <>Successfully passed and mastered: <strong>"{chunkTitle}"</strong></>
                ) : (
                  <>أتقنت بنجاح مفاهيم فقرة: <strong>"{chunk.chunkTitle}"</strong></>
                )
              )}
            </p>

            {/* بطاقة نسبة الإتقان الأكاديمي المحققة (>= 90%) */}
            <div className="mastery-score-display">
              <div className="mastery-score-pill score-pass">
                <span className="score-label">{t('masteryScore')}</span>
                <span className="score-number">{finalScorePercent}%</span>
                <span className="score-note">
                  {finalScorePercent === 100 
                    ? (lang === 'en' ? '🌟 Perfect Distinction Score!' : '🌟 الدرجة النهائية مع الامتياز الكامل!')
                    : (lang === 'en' ? '✨ Excellent Passing Score (≥ 90%)!' : '✨ اجتياز أكاديمي متفوق (≥ 90%)!')
                  }
                </span>
              </div>
            </div>

            {/* بطاقات المكافآت */}
            <div className="rewards-grid">
              <div className="reward-card xp-reward">
                <Flame size={28} className="text-amber-500" />
                <div className="reward-num">+{chunk.xpReward}</div>
                <div className="reward-label">{t('xpPoints')}</div>
              </div>
              <div className="reward-card star-reward">
                <Star size={28} className="text-yellow-400 fill-yellow-400" />
                <div className="reward-num">+{earnedStarsAwarded}</div>
                <div className="reward-label">{t('stars')}</div>
              </div>
            </div>

            {/* لوحة تقييم النجوم الثلاثة للمحطة */}
            <div className="quiz-star-rating-showcase">
              <div className="star-rating-icons">
                {[1, 2, 3].map((starNum) => (
                  <Star
                    key={starNum}
                    size={36}
                    className={`quiz-eval-star ${starNum <= earnedStarsAwarded ? 'star-gold-glow' : 'star-dimmed'}`}
                    fill={starNum <= earnedStarsAwarded ? '#fbbf24' : 'none'}
                  />
                ))}
              </div>
              <div className="star-rating-caption">
                {earnedStarsAwarded === 3 ? (
                  <div className="star-caption-distinction">
                    <Sparkles size={18} className="text-amber-400" />
                    <span>{t('threeStarsDistinction')}</span>
                  </div>
                ) : earnedStarsAwarded === 2 ? (
                  <div className="star-caption-good">
                    <span>{t('twoStars')}</span>
                  </div>
                ) : (
                  <div className="star-caption-pass">
                    <span>{t('oneStar')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* راية كأس إتقان الدرس للاختبارات الشاملة */}
            {isExamMode && (
              <div className="exam-trophy-banner-award">
                <Trophy size={36} className="trophy-gold-icon" fill="#fbbf24" color="#d97706" />
                <div className="trophy-banner-text">
                  <h4>{t('lessonTrophyEarned')}</h4>
                  <p>{lang === 'en' ? 'Trophy added to your showcase and navbar stats!' : 'تم تتويجك بالكأس وإضافته إلى سجل إنجازاتك في الشريط العلوي والخريطة!'}</p>
                </div>
              </div>
            )}

            <div className="success-actions">
              <button 
                className="duo-btn duo-btn-primary w-full text-lg py-4"
                onClick={handleGoToNextChunk}
              >
                {t('proceedToMapAndNext')}
              </button>
              <button 
                className="duo-btn duo-btn-secondary w-full py-3 flex items-center justify-center gap-2"
                onClick={handleRetakeQuiz}
                style={{ borderColor: '#f59e0b', color: '#fbbf24' }}
              >
                <Sparkles size={18} />
                <span>
                  {earnedStarsAwarded === 3 && finalScorePercent === 100
                    ? (lang === 'ar' ? '🔄 تدريب إضافي وتأكيد الإتقان' : '🔄 Retake for Extra Practice')
                    : (lang === 'ar' ? '🎯 إعادة الاختبار لتحقيق 100% والـ 3 نجوم' : '🎯 Retest for 100% & 3 Stars')
                  }
                </span>
              </button>
              <button 
                className="duo-btn duo-btn-secondary w-full"
                onClick={() => setActiveModal(null)}
              >
                {t('backToMap')}
              </button>
            </div>
          </div>
        ) : (
          /* ==================================================== */
          /* 3. واجهة السؤال النشط (مع دعم التثبيت والتكرار) */
          /* ==================================================== */
          <div className="quiz-body">
            {/* شارة نوع السؤال أو شارة التثبيت البديل */}
            <div className="quiz-tier-badge">
              {activeQuestion?.isReinforcement ? (
                <div className="tier-tag tag-reinforce">
                  <RotateCcw size={16} />
                  <span>{activeQuestion.reinforceTitle || t('reinforceBadge')}</span>
                </div>
              ) : isExamMode ? (
                <span className="tier-tag tag-exam-boss">
                  {lang === 'en' 
                    ? `🏆 Lesson Mastery Exam • Question ${currentIndex + 1} of ${totalSteps}`
                    : `🏆 اختبار إتقان الدرس الشامل • السؤال ${currentIndex + 1} من ${totalSteps}`
                  }
                </span>
              ) : (
                <>
                  {activeQuestion?.level === 'best_choice' && (
                    <div className="tier-tag tag-best-choice">
                      <Sparkles size={16} />
                      <span>
                        {lang === 'en' 
                          ? `🎯 Question ${currentIndex + 1} of ${totalSteps}: Choose the Most Accurate & Complete Answer` 
                          : `🎯 السؤال ${currentIndex + 1} من ${totalSteps}: تفكير نقدي • اختر الإجابة الأصح والأشمل من بين البدائل`
                        }
                      </span>
                    </div>
                  )}
                  {activeQuestion?.level === 'mcq' && (
                    <span className="tier-tag tag-mcq">
                      {lang === 'en' 
                        ? `📝 Question ${currentIndex + 1} of ${totalSteps}: Multiple Choice` 
                        : `📝 السؤال ${currentIndex + 1} من ${totalSteps}: اختيار من متعدد`
                      }
                    </span>
                  )}
                  {activeQuestion?.level === 'true_false' && (
                    <span className="tier-tag tag-tf">
                      {lang === 'en' 
                        ? `⚖️ Question ${currentIndex + 1} of ${totalSteps}: True or False` 
                        : `⚖️ السؤال ${currentIndex + 1} من ${totalSteps}: صواب أو خطأ`
                      }
                    </span>
                  )}
                  {activeQuestion?.level === 'timed_fill' && (
                    <div className="tier-tag tag-timed">
                      <span>
                        {lang === 'en' 
                          ? `⚡ Question ${currentIndex + 1} of ${totalSteps}: Timed Fill-in` 
                          : `⚡ السؤال ${currentIndex + 1} من ${totalSteps}: إكمال المصطلح بالوقت`
                        }
                      </span>
                      <div className={`countdown-badge ${timeLeft <= 5 ? 'pulse-danger' : ''}`}>
                        <Clock size={16} />
                        <span>{timeLeft} {lang === 'en' ? 'sec' : 'ثانية'}</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* نص السؤال مع زر نطق صوتي */}
            <div className="quiz-question-box">
              <h3 className="quiz-question-text">
                {!isExamMode && activeQuestion?.level === 'timed_fill' 
                  ? activeQuestion.questionTemplate 
                  : activeQuestion?.question
                }
              </h3>
              <button 
                className="audio-speech-btn"
                title={lang === 'en' ? 'Listen to question' : 'استمع للسؤال بصوت ناطق'}
                onClick={() => speakQuestion(activeQuestion?.question || activeQuestion?.questionTemplate)}
              >
                <Volume2 size={18} />
              </button>
            </div>

            {/* تلميح خاص بأسئلة التكملة */}
            {!isExamMode && activeQuestion?.hint && (
              <div className="quiz-hint-banner">
                <HelpCircle size={16} />
                <span>{lang === 'en' ? 'Hint:' : '💡 تلميح:'} {activeQuestion.hint}</span>
              </div>
            )}

            {/* خيارات السؤال: الاختيار من متعدد / الأصح والأشمل */}
            {(isExamMode || activeQuestion?.level === 'mcq' || activeQuestion?.level === 'best_choice') && (
              <div className="options-vertical-grid">
                {activeQuestion?.options?.map((opt, idx) => {
                  let optClass = "quiz-option-btn";
                  if (selectedAnswer === idx) optClass += " selected";
                  if (isChecked) {
                    if (idx === activeQuestion.correctIndex) optClass += " is-correct";
                    else if (selectedAnswer === idx) optClass += " is-wrong";
                  }

                  const optionLetter = lang === 'en' 
                    ? ['A', 'B', 'C', 'D', 'E'][idx] || idx + 1
                    : ['أ', 'ب', 'ج', 'د', 'هـ'][idx] || idx + 1;

                  return (
                    <button
                      key={idx}
                      className={optClass}
                      disabled={isChecked}
                      onClick={() => {
                        setSelectedAnswer(idx);
                        playSound.click();
                      }}
                    >
                      <span className="option-index-badge">
                        {optionLetter}
                      </span>
                      <span className="option-text">{opt}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* خيارات صح أم خطأ */}
            {activeQuestion?.level === 'true_false' && (
              <div className="options-tf-grid">
                <button
                  className={`quiz-tf-btn tf-true ${selectedAnswer === true ? 'selected' : ''} ${
                    isChecked ? (activeQuestion.isTrue === true ? 'is-correct' : selectedAnswer === true ? 'is-wrong' : '') : ''
                  }`}
                  disabled={isChecked}
                  onClick={() => {
                    setSelectedAnswer(true);
                    playSound.click();
                  }}
                >
                  <CheckCircle2 size={32} />
                  <span className="tf-label">{t('trueOption')}</span>
                </button>

                <button
                  className={`quiz-tf-btn tf-false ${selectedAnswer === false ? 'selected' : ''} ${
                    isChecked ? (activeQuestion.isTrue === false ? 'is-correct' : selectedAnswer === false ? 'is-wrong' : '') : ''
                  }`}
                  disabled={isChecked}
                  onClick={() => {
                    setSelectedAnswer(false);
                    playSound.click();
                  }}
                >
                  <XCircle size={32} />
                  <span className="tf-label">{t('falseOption')}</span>
                </button>
              </div>
            )}

            {/* خيارات التكملة بالوقت */}
            {!isExamMode && activeQuestion?.level === 'timed_fill' && (
              <div className="options-vertical-grid">
                {activeQuestion?.options?.map((word, idx) => {
                  let optClass = "quiz-option-btn fill-option";
                  if (selectedAnswer === word) optClass += " selected";
                  if (isChecked) {
                    if (word === activeQuestion.missingWord) optClass += " is-correct";
                    else if (selectedAnswer === word) optClass += " is-wrong";
                  }

                  return (
                    <button
                      key={idx}
                      className={optClass}
                      disabled={isChecked}
                      onClick={() => {
                        setSelectedAnswer(word);
                        playSound.click();
                      }}
                    >
                      <span className="option-text font-bold">{word}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* شريط الإجراءات والتحقق السفلي (Sticky Footer ثابت غير مقصوص) */}
        {/* ==================================================== */}
        {!isMandatoryReview && !isSuccessFinished && (
          <div className={`quiz-footer-banner ${isChecked ? (isCorrect ? 'footer-correct' : 'footer-wrong') : ''}`}>
            {isChecked && (
              <div className="feedback-message-area">
                <div className="feedback-title-row">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 size={24} className="text-green-500" />
                      <span className="feedback-status text-green-400">{t('correctFeedback')}</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={24} className="text-rose-500" />
                      <span className="feedback-status text-rose-400">{t('wrongFeedback')}</span>
                    </>
                  )}
                </div>
                <p className="feedback-explanation">
                  {activeQuestion?.explanation}
                </p>
              </div>
            )}

            <div className="footer-actions-row">
              {!isChecked ? (
                <button
                  className="duo-btn duo-btn-primary w-full py-3.5 text-lg"
                  disabled={selectedAnswer === null}
                  onClick={handleCheckAnswer}
                >
                  {t('submitAnswer')} 🚀
                </button>
              ) : isCorrect ? (
                <button
                  className="duo-btn duo-btn-success w-full py-3.5 text-lg font-bold"
                  onClick={handleNextStep}
                >
                  {t('continueNext')}
                </button>
              ) : (
                /* زر المتابعة البارز عند الخطأ لتثبيت وتكرار المفهوم */
                <div className="footer-wrong-action-box">
                  <button
                    className="duo-btn duo-btn-danger w-full py-3.5 text-lg font-bold"
                    onClick={handleNextStep}
                  >
                    {t('reinforceContinue')}
                  </button>
                  {!isExamMode && (
                    <button
                      className="duo-btn duo-btn-secondary w-full text-sm py-2"
                      onClick={handleBackToLesson}
                    >
                      <BookOpen size={16} />
                      {t('backToExplanation')}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
