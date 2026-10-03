import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CHAPTERS_METADATA } from '../data/curriculumData';
import { CURRICULUM_ENGLISH } from '../data/curriculumEnglish';
import { Bot, RefreshCw, Zap, CheckCircle2, ArrowRight, ArrowLeft, Sparkles, MessageSquare } from 'lucide-react';
import { playSound } from '../utils/audioEngine';

export const AITutorModal = () => {
  const {
    activeChunk,
    localizedActiveChunk,
    setActiveModal,
    lang,
    t
  } = useApp();

  const [showSimplerExplanation, setShowSimplerExplanation] = useState(false);

  if (!activeChunk) return null;

  const chunk = localizedActiveChunk || activeChunk;

  const chapter = CHAPTERS_METADATA.find(c => c.id === chunk.chapterId) || CHAPTERS_METADATA[0];
  const chapterTitle = lang === 'ar' ? chapter.title : chapter.enTitle;

  const chunkTitle = chunk.chunkTitle;
  const prompt = chunk.aiTutorPrompt;
  const simplifiedExplanation = chunk.simplifiedExplanation;

  const handleReread = () => {
    playSound.click();
    setActiveModal('lesson');
  };

  const handleRequestSimpler = () => {
    playSound.click();
    setShowSimplerExplanation(true);
  };

  const handleStartQuiz = () => {
    playSound.correct();
    setActiveModal('quiz');
  };

  const handleClose = () => {
    playSound.click();
    setActiveModal(null);
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content-card modal-tutor-box" onClick={e => e.stopPropagation()}>
        {/* Chapter Context Ribbon */}
        <div 
          className="tutor-chapter-badge"
          style={{ background: chapter.gradient }}
        >
          <span>{chapter.id === 1 ? '💻' : chapter.id === 2 ? '🛡️' : chapter.id === 3 ? '🌐' : '🎨'}</span>
          <span>{t('chapter')} {chapter.id}: {chapterTitle} • {chunkTitle}</span>
        </div>

        {/* Mascot Avatar */}
        <div className="tutor-mascot-avatar">
          🤖
        </div>

        {/* Header */}
        <div>
          <span className="tutor-role-pill">
            {t('aiTutorTitle')}
          </span>
          <h3 className="tutor-headline">
            {lang === 'ar' ? 'فحص الاستيعاب التفاعلي' : 'Interactive Comprehension Check'}
          </h3>
        </div>

        {/* Speech Bubble */}
        <div className="tutor-speech-bubble">
          <p>{prompt}</p>

          {/* Simpler Analogy View if Requested */}
          {showSimplerExplanation && (
            <div className="tutor-simpler-box">
              <strong>
                💡 {lang === 'ar' ? 'تشبيه واقعي ومبسط جداً:' : 'Simpler Real-world Analogy:'}
              </strong>
              <p>{simplifiedExplanation}</p>
            </div>
          )}
        </div>

        {/* Action Choices */}
        <div className="tutor-actions-col">
          {/* Choice 1: Start Quiz */}
          <button 
            className="btn-duo-primary"
            onClick={handleStartQuiz}
          >
            <Zap size={22} fill="#fff" />
            <span>{t('iUnderstood')}</span>
          </button>

          {/* Choice 2: Ask for simpler explanation */}
          {!showSimplerExplanation && (
            <button 
              className="btn-duo-secondary"
              onClick={handleRequestSimpler}
            >
              <RefreshCw size={18} />
              <span>{t('askExplainAgain')}</span>
            </button>
          )}

          {/* Choice 3: Re-read lesson explanation */}
          <button 
            className="btn-link-action"
            onClick={handleReread}
          >
            {lang === 'ar' ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            <span>{t('backToExplanation')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
