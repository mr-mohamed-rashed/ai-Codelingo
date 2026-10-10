import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CHAPTERS_METADATA } from '../data/curriculumMeta.js';
import { X, Volume2, Square, Pause, Play, Sparkles, BookOpen, Lightbulb, HelpCircle, ArrowLeft, ArrowRight, CheckCircle2, RotateCw } from 'lucide-react';
import { narrator, speakEnglish, playSound } from '../utils/audioEngine';

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
  const [flippedTerms, setFlippedTerms] = useState({});
  const [speechRate, setSpeechRate] = useState(0.88);

  useEffect(() => {
    return () => {
      narrator.stop();
    };
  }, []);

  if (!activeChunk) return null;

  const chunk = localizedActiveChunk || activeChunk;
  const isChunkCompleted = currentStudent?.completedChunks?.includes(chunk.id);
  const currentStars = currentStudent?.chunkRatings?.[chunk.id]?.stars || (isChunkCompleted ? 3 : 0);

  // Retrieve Chapter Metadata
  const chapter = CHAPTERS_METADATA.find(c => c.id === chunk.chapterId) || CHAPTERS_METADATA[0];
  const chapterTitle = lang === 'ar' ? chapter.title : chapter.enTitle;

  const chunkTitle = chunk.chunkTitle;
  const lessonTitle = chunk.lessonTitle;
  const summary = chunk.summary;

  // نص القراءة الصوتية الكامل والمتقن للمحطة
  const fullNarrationScript = React.useMemo(() => {
    let script = `${chunkTitle}. ${summary}. `;
    if (chunk.contentCards && chunk.contentCards.length > 0) {
      script += "المفاهيم التعليمية: " + chunk.contentCards.map(c => `${c.title}: ${c.points ? c.points.join('، ') : (c.text || '')}`).join('. ') + ". ";
    }
    if (chunk.audioNarrationText) {
      script += chunk.audioNarrationText;
    }
    return script;
  }, [chunkTitle, summary, chunk]);

  const handleToggleAudio = () => {
    playSound.click();
    if (isPlayingAudio) {
      narrator.stop();
      setIsPlayingAudio(false);
    } else {
      narrator.speak(
        fullNarrationScript,
        lang === 'ar' ? 'ar-SA' : 'en-US',
        () => setIsPlayingAudio(true),
        () => setIsPlayingAudio(false),
        () => setIsPlayingAudio(false),
        speechRate
      );
    }
  };

  const handleSpeedChange = (newRate) => {
    playSound.click();
    setSpeechRate(newRate);
    if (isPlayingAudio) {
      narrator.stop();
      narrator.speak(
        fullNarrationScript,
        lang === 'ar' ? 'ar-SA' : 'en-US',
        () => setIsPlayingAudio(true),
        () => setIsPlayingAudio(false),
        () => setIsPlayingAudio(false),
        newRate
      );
    }
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
    setActiveModal('ai_tutor');
  };

  const handleClose = () => {
    playSound.click();
    narrator.stop();
    setIsPlayingAudio(false);
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

        {/* 3. AI Female Teacher Audio Reader Player Bar */}
        <div className={`audio-player-bar ai-female-narrator-bar ${isPlayingAudio ? 'is-playing' : ''}`}>
          <div className="audio-left-controls">
            <button 
              className={`audio-play-btn ${isPlayingAudio ? 'btn-stop-pulse' : ''}`} 
              onClick={handleToggleAudio} 
              title={isPlayingAudio ? 'إيقاف مؤقت' : 'استماع للشرح الصوتي بالذكاء الاصطناعي'}
            >
              {isPlayingAudio ? <Square size={18} fill="#fff" /> : <Play size={20} fill="#fff" />}
            </button>
            <div className="audio-narrator-meta">
              <div className="flex items-center gap-2">
                <span className="narrator-avatar-emoji">🎙️👩‍🏫</span>
                <h4 className="audio-narrator-title">
                  {isPlayingAudio 
                    ? (lang === 'ar' ? 'جاري قراءة وشرح الدرس بصوت أنثوي هادئ...' : 'Narrating lesson in calm female voice...') 
                    : (lang === 'ar' ? 'المعلمة الافتراضية (قراءة وشرح صوتي هادئ)' : 'AI Female Tutor (Calm Voice Narration)')
                  }
                </h4>
              </div>
              <p className="audio-narrator-hint">
                {lang === 'ar' 
                  ? 'قراءة ذكية وميسرة لكافة محاور ومفاهيم المحطة بصوت أنثوي هادئ لتثبيت المعلومة'
                  : 'Articulate AI narration designed for calm comprehension'
                }
              </p>
            </div>
          </div>

          <div className="audio-right-utilities">
            {/* سرعات القراءة */}
            <div className="audio-speed-chips">
              <button 
                type="button"
                className={`speed-chip ${speechRate === 0.85 ? 'active' : ''}`}
                onClick={() => handleSpeedChange(0.85)}
                title="قراءة هادئة ومركزة"
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
                title="قراءة سريعة"
              >
                1.15x
              </button>
            </div>

            <div className="audio-lang-indicator">
              <Volume2 size={16} />
              <span>{lang === 'ar' ? 'صوت أنثى هادئ' : 'Calm Voice'}</span>
            </div>
          </div>
        </div>

        {/* 4. Core Concepts & Educational Content Cards */}
        <div className="lesson-cards-section">
          {chunk.contentCards && chunk.contentCards.map((card, idx) => (
            <div 
              key={idx} 
              className={`lesson-concept-card ${card.type === 'teacherTip' ? 'card-exam-tip' : ''}`}
            >
              <h4 className="concept-card-title">
                {card.title}
              </h4>

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
