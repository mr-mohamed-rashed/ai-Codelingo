import React, { useState, useEffect } from 'react';
import './MicroLessonModal.css';
import { useApp } from '../context/AppContext';
import { CHAPTERS_METADATA } from '../data/curriculumMeta.js';
import { X, Volume2, Square, Pause, Play, Sparkles, BookOpen, Lightbulb, HelpCircle, ArrowLeft, ArrowRight, CheckCircle2, RotateCw, AlertCircle, Radio } from 'lucide-react';
import { narrator, speakEnglish, playSound } from '../utils/audioEngine';
import { teacherAudioPlayer } from '../utils/teacherAudioEngine';

export const MicroLessonModal = () => {
  const {
    activeChunk,
    localizedActiveChunk,
    setActiveModal,
    currentStudent,
    lang,
    t
  } = useApp();

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activePlayingCard, setActivePlayingCard] = useState(null);
  const [flippedTerms, setFlippedTerms] = useState({});
  const [speechRate, setSpeechRate] = useState(0.88);
  const [isAutoPlayNext, setIsAutoPlayNext] = useState(true);
  const [audioNotice, setAudioNotice] = useState(null);

  useEffect(() => {
    return () => {
      teacherAudioPlayer.stop();
      narrator.stop();
    };
  }, []);

  const chunk = localizedActiveChunk || activeChunk;

  if (!activeChunk || !chunk) return null;

  const isChunkCompleted = currentStudent?.completedChunks?.includes(chunk.id);
  const currentStars = currentStudent?.chunkRatings?.[chunk.id]?.stars || (isChunkCompleted ? 3 : 0);

  // Retrieve Chapter Metadata
  const chapter = CHAPTERS_METADATA.find(c => c.id === chunk.chapterId) || CHAPTERS_METADATA[0];
  const chapterTitle = lang === 'ar' ? chapter.title : chapter.enTitle;

  const chunkTitle = chunk.chunkTitle;
  const lessonTitle = chunk.lessonTitle;
  const summary = chunk.summary;

  const handleToggleAudio = () => {
    playSound.click();
    if (isPlayingAudio) {
      teacherAudioPlayer.stop();
      setIsPlayingAudio(false);
      setActivePlayingCard(null);
    } else {
      setAudioNotice(null);
      teacherAudioPlayer.autoPlayNext = isAutoPlayNext;
      teacherAudioPlayer.playFullSequence(chunk, {
        rate: speechRate,
        onStart: (info) => {
          setIsPlayingAudio(true);
          if (typeof info.cardIndex === 'number') {
            setActivePlayingCard(info.cardIndex);
            const el = document.getElementById(`concept-card-${info.cardIndex}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          } else {
            setActivePlayingCard('full');
          }
        },
        onAutoAdvance: (nextIndex) => {
          setActivePlayingCard(nextIndex);
          const el = document.getElementById(`concept-card-${nextIndex}`);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        },
        onAllCardsCompleted: () => {
          setIsPlayingAudio(false);
          setActivePlayingCard(null);
        },
        onError: (err) => {
          setIsPlayingAudio(false);
          setActivePlayingCard(null);
          if (err.code === 'RECORDING_PENDING') {
            setAudioNotice(err.message);
          } else if (err.code === 'NO_ARABIC_VOICE') {
            setAudioNotice(`💡 هذا المتصفح لا يحتوي على قارئ صوتي عربي مثبت، وسيتم تفعيل الصوت الحقيقي فور رفع ملف التسجيل الصوتي للأستاذ: ${err.cardMeta?.fileName || 'المقطع'}`);
          }
        }
      });
    }
  };

  const handleToggleCardAudio = (idx, card) => {
    playSound.click();
    if (activePlayingCard === idx && isPlayingAudio) {
      teacherAudioPlayer.stop();
      setIsPlayingAudio(false);
      setActivePlayingCard(null);
    } else {
      setAudioNotice(null);
      teacherAudioPlayer.autoPlayNext = isAutoPlayNext;
      teacherAudioPlayer.playCard(chunk, idx, {
        rate: speechRate,
        onStart: () => {
          setIsPlayingAudio(true);
          setActivePlayingCard(idx);
        },
        onAutoAdvance: (nextIndex) => {
          setActivePlayingCard(nextIndex);
          const el = document.getElementById(`concept-card-${nextIndex}`);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        },
        onCardEnded: () => {
          if (!isAutoPlayNext || idx + 1 >= (chunk.contentCards?.length || 0)) {
            setIsPlayingAudio(false);
            setActivePlayingCard(null);
          }
        },
        onAllCardsCompleted: () => {
          setIsPlayingAudio(false);
          setActivePlayingCard(null);
        },
        onError: (err) => {
          setIsPlayingAudio(false);
          setActivePlayingCard(null);
          if (err.code === 'RECORDING_PENDING') {
            setAudioNotice(err.message);
          } else if (err.code === 'NO_ARABIC_VOICE') {
            setAudioNotice(`💡 هذا المتصفح لا يحتوي على قارئ صوتي عربي مثبت، بانتظار رفع ملف التسجيل للأستاذ: ${err.cardMeta?.fileName || 'المقطع'}`);
          }
        }
      });
    }
  };

  const handleSpeedChange = (newRate) => {
    playSound.click();
    setSpeechRate(newRate);
  };

  const toggleAutoPlay = () => {
    playSound.click();
    const nextVal = !isAutoPlayNext;
    setIsAutoPlayNext(nextVal);
    teacherAudioPlayer.autoPlayNext = nextVal;
  };

  const handlePronounceEnglish = (enTerm, e) => {
    e.stopPropagation();
    playSound.click();
    speakEnglish(enTerm);
  };

  const toggleTermFlip = (idx) => {
    playSound.click();
    setFlippedTerms(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleProceedToAITutor = () => {
    playSound.click();
    narrator.stop();
    setIsPlayingAudio(false);
    setActivePlayingCard(null);
    setActiveModal('ai_tutor');
  };

  const handleClose = () => {
    playSound.click();
    narrator.stop();
    setIsPlayingAudio(false);
    setActivePlayingCard(null);
    setActiveModal(null);
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content-card modal-lesson-enhanced" onClick={e => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={handleClose} title={t('close')}>
          <X size={20} />
        </button>

        {/* 1. Full Chapter Name Banner Card */}
        <div 
          className="chapter-card-banner"
          style={{ background: chapter.gradient }}
        >
          <div className="chapter-banner-inner">
            <span className="chapter-banner-icon">
              {chapter.id === 1 ? '💻' : chapter.id === 2 ? '🛡️' : chapter.id === 3 ? '🌐' : '🎨'}
            </span>
            <div className="chapter-banner-titles">
              <span className="chapter-banner-super">
                {t('chapter')} {chapter.id} • {chapter.enTitle}
              </span>
              <h3 className="chapter-banner-main">{chapterTitle}</h3>
            </div>
          </div>
          <span className="lesson-badge-chip">
            {t('lesson')} {chunk.lessonId}: {lessonTitle}
          </span>
        </div>

        <div className="modal-lesson-body">
          {/* شارة توضيحية للفقرة المكتملة وإمكانية تحسين النتيجة */}
          {isChunkCompleted && (
          <div className="chunk-improvement-callout">
            <div className="callout-header-row">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-amber-400" />
                <span className="font-bold text-amber-300">
                  {lang === 'ar' ? 'هذه المحطة مكتملة ✓' : 'Topic Completed ✓'}
                </span>
                <span className="callout-stars-pill">
                  {[1, 2, 3].map((s) => (
                    <span key={s} style={{ color: s <= currentStars ? '#fbbf24' : '#64748b' }}>★</span>
                  ))}
                  <span className="text-xs font-bold text-amber-200 mr-1">({currentStars}/3)</span>
                </span>
              </div>
              <button 
                className="btn-quick-retake"
                onClick={() => {
                  playSound.correct();
                  narrator.stop();
                  setIsPlayingAudio(false);
                  setActiveModal('quiz');
                }}
              >
                <span>{lang === 'ar' ? '🎯 اختبار مباشر للدرجة الكاملة' : '🎯 Retest for 100%'}</span>
              </button>
            </div>
            <p className="callout-desc">
              {lang === 'ar'
                ? 'يمكنك مراجعة بطاقات الشرح أدناه، أو الضغط على زر الاختبار لتحسين درجتك وحصد الـ 3 نجوم كاملة.'
                : 'Review the cards below, or retake the test directly to improve your score and claim all 3 stars.'}
            </p>
          </div>
        )}

        {/* 2. Visual Chunk Header: Concept Icon + Full Unabbreviated Title */}
        <div className="chunk-header-box">
          <div className="chunk-visual-identity">
            <div className="chunk-hero-icon" title={chunkTitle}>
              <span>{chunk.iconEmoji || '📌'}</span>
            </div>
            <div className="chunk-titles-wrap">
              <span className="chunk-index-tag">
                {lang === 'ar' ? `الفقرة ${chunk.chunkIndex}` : `Topic ${chunk.chunkIndex}`}
              </span>
              <h2 className="chunk-full-title">{chunkTitle}</h2>
            </div>
          </div>
          <p className="chunk-full-summary">{summary}</p>
        </div>

        {/* 3. AI / Teacher Audio Reader Player Bar */}
        <div className={`audio-player-bar ai-female-narrator-bar ${isPlayingAudio ? 'is-playing' : ''}`}>
          <div className="audio-left-controls">
            <button 
              className={`audio-play-btn ${isPlayingAudio ? 'btn-stop-pulse' : ''}`} 
              onClick={handleToggleAudio} 
              title={isPlayingAudio ? 'إيقاف مؤقت' : 'استماع للشرح الصوتي بالتتابع'}
            >
              {isPlayingAudio ? <Square size={18} fill="#fff" /> : <Play size={20} fill="#fff" />}
            </button>
            <div className="audio-narrator-meta">
              <div className="flex items-center gap-2">
                <span className="narrator-avatar-emoji">🎙️👨‍🏫</span>
                <h4 className="audio-narrator-title">
                  {isPlayingAudio 
                    ? (lang === 'ar' ? 'جاري الاستماع للشرح الصوتي...' : 'Playing lesson audio...') 
                    : (lang === 'ar' ? 'الشرح الصوتي للمحطة (أ. محمد راشد)' : 'Lesson Audio Narration')
                  }
                </h4>
              </div>
              <p className="audio-narrator-hint">
                {lang === 'ar' 
                  ? 'تسجيلات الشرح الصوتي المباشر للمنهج مع الانتقال التلقائي بين الفقرات'
                  : 'Direct lesson voice recordings with automatic card progression'
                }
              </p>
            </div>
          </div>

          <div className="audio-right-utilities">
            {/* خيار الانتقال التلقائي للفقرة التالية */}
            <button 
              type="button"
              className={`speed-chip ${isAutoPlayNext ? 'active' : ''}`}
              onClick={toggleAutoPlay}
              title={isAutoPlayNext ? 'التشغيل المتتابع مفعّل: سينتقل تلقائياً للكارت التالي' : 'التشغيل المتتابع متوقف'}
            >
              🔁 {lang === 'ar' ? 'تتابع تلقائي' : 'Auto-Next'}
            </button>

            {/* سرعات القراءة */}
            <div className="audio-speed-chips">
              <button 
                type="button"
                className={`speed-chip ${speechRate === 0.85 ? 'active' : ''}`}
                onClick={() => handleSpeedChange(0.85)}
                title="سرعة هادئة"
              >
                0.85x
              </button>
              <button 
                type="button"
                className={`speed-chip ${speechRate === 1.0 ? 'active' : ''}`}
                onClick={() => handleSpeedChange(1.0)}
                title="سرعة طبيعية"
              >
                1.0x
              </button>
              <button 
                type="button"
                className={`speed-chip ${speechRate === 1.15 ? 'active' : ''}`}
                onClick={() => handleSpeedChange(1.15)}
                title="سرعة سريعة"
              >
                1.15x
              </button>
            </div>
          </div>

          {/* تنبيه حالة التسجيل أو الصوت */}
          {audioNotice && (
            <div className="audio-teacher-notice-banner w-full">
              <AlertCircle size={16} className="shrink-0" />
              <span>{audioNotice}</span>
            </div>
          )}
        </div>

        {/* 4. Core Concepts & Educational Content Cards with Dedicated Audio Players */}
        <div className="lesson-cards-section">
          {chunk.contentCards && chunk.contentCards.map((card, idx) => (
            <div 
              key={idx} 
              id={`concept-card-${idx}`}
              className={`lesson-concept-card ${activePlayingCard === idx ? 'is-currently-playing' : ''} ${card.type === 'teacherTip' ? 'card-exam-tip' : ''}`}
            >
              <div className="concept-card-header-row">
                <div className="flex items-center gap-2 flex-wrap flex-1">
                  <h4 className="concept-card-title">
                    {card.title}
                  </h4>
                  <span className="audio-card-id-pill" title="كود ملف التسجيل الصوتي في مجلد audio/lessons">
                    🎙️ {chunk.id}-card-{idx + 1}
                  </span>
                </div>
                <button
                  type="button"
                  className={`btn-play-card-audio ${activePlayingCard === idx ? 'is-playing' : ''}`}
                  onClick={() => handleToggleCardAudio(idx, card)}
                  title={activePlayingCard === idx ? (lang === 'ar' ? 'إيقاف الاستماع' : 'Stop') : (lang === 'ar' ? 'استمع لشرح هذه البطاقة' : 'Listen to this card')}
                >
                  {activePlayingCard === idx ? (
                    <>
                      <Square size={13} fill="currentColor" />
                      <span>{lang === 'ar' ? 'إيقاف' : 'Stop'}</span>
                    </>
                  ) : (
                    <>
                      <Volume2 size={15} />
                      <span>{lang === 'ar' ? 'استمع للشرح' : 'Listen'}</span>
                    </>
                  )}
                </button>
              </div>

              {card.points && (
                <ul className="concept-points-list">
                  {card.points.map((pt, pIdx) => (
                    <li key={pIdx}>{pt}</li>
                  ))}
                </ul>
              )}

              {card.text && (
                <p className="concept-card-text">{card.text}</p>
              )}
            </div>
          ))}
        </div>

        {/* 5. Two Dedicated Sections for Terms */}
        {chunk.keyTerms && chunk.keyTerms.length > 0 && (
          <div className="terms-dual-container">
            {/* Section A: Arabic Core Terms & Detailed Explanations */}
            <div className="terms-group-block">
              <div className="terms-group-header">
                <BookOpen size={18} color="#60a5fa" />
                <h4>{t('arabicTermsTitle')}</h4>
              </div>

              <div className="terms-grid">
                {chunk.keyTerms.map((term, tIdx) => (
                  <div key={tIdx} className="arabic-term-card">
                    <div className="arabic-term-top">
                      <span className="arabic-term-name">{term.term}</span>
                      <span className="arabic-term-en-pill">{term.en}</span>
                    </div>
                    <p className="arabic-term-def">{term.definition}</p>
                    {term.example && (
                      <div className="term-note-box example-box">
                        <strong>{t('example')}</strong> {term.example}
                      </div>
                    )}
                    {term.examTip && (
                      <div className="term-note-box exam-box">
                        <strong>{t('examNote')}</strong> {term.examTip}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Section B: English Vocabulary Mastery Cards (Flashcards) */}
            <div className="terms-group-block english-mastery-block">
              <div className="terms-group-header">
                <Sparkles size={18} color="#fbbf24" />
                <h4>{t('englishTermsTitle')}</h4>
                <span className="exam-priority-pill">{t('memorizeBadge')}</span>
              </div>

              <div className="english-cards-grid">
                {chunk.keyTerms.map((term, tIdx) => {
                  const isFlipped = !!flippedTerms[tIdx];
                  return (
                    <div 
                      key={tIdx} 
                      className={`en-mastery-card ${isFlipped ? 'card-is-flipped' : ''}`}
                      onClick={() => toggleTermFlip(tIdx)}
                    >
                      <div className="en-card-front">
                        <div className="en-card-top-row">
                          <span className="en-badge-memorize">🎯 {lang === 'ar' ? 'حفظ إنجليزي' : 'Key Vocabulary'}</span>
                          <button 
                            className="btn-pronounce-en"
                            onClick={(e) => handlePronounceEnglish(term.en, e)}
                            title={t('listenEnglish')}
                          >
                            <Volume2 size={16} />
                            <span>{t('listenEnglish')}</span>
                          </button>
                        </div>

                        <h3 className="en-term-large">{term.en}</h3>
                        <p className="en-term-ar-translation">
                          {isFlipped ? term.definition : (lang === 'ar' ? `المعنى: ${term.term} (اضغط للتفاصيل)` : `Meaning: ${term.term} (Click to flip)`)}
                        </p>

                        <div className="flip-hint-strip">
                          <RotateCw size={13} />
                          <span>{lang === 'ar' ? 'اضغط لاختبار حفظك للمصطلح' : 'Click to test recall'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        </div>

        {/* 6. Modal Footer Action: Proceed to AI Tutor & Quiz */}
        <div className="modal-footer-actions">
          {isChunkCompleted ? (
            <div className="completed-modal-actions-grid">
              <button 
                className="duo-btn duo-btn-primary flex-1 py-3 text-base flex items-center justify-center gap-2"
                onClick={() => {
                  playSound.correct();
                  narrator.stop();
                  setIsPlayingAudio(false);
                  setActiveModal('quiz');
                }}
              >
                <Sparkles size={20} />
                <span>{lang === 'ar' ? '🎯 اختبار جديد لتحسين النتيجة' : '🎯 Retest to Improve Score'}</span>
              </button>
              <button 
                className="btn-proceed-tutor flex-1"
                onClick={handleProceedToAITutor}
              >
                <span>{lang === 'ar' ? '🤖 مراجعة مع المعلم الذكي' : '🤖 Review with AI Tutor'}</span>
                {lang === 'ar' ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
              </button>
            </div>
          ) : (
            <button 
              className="btn-proceed-tutor"
              onClick={handleProceedToAITutor}
            >
              <span>{t('nextToAITutor')}</span>
              {lang === 'ar' ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
