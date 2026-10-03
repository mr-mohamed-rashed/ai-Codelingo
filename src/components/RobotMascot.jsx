import React, { useState } from 'react';
import { Sparkles, Play, Zap } from 'lucide-react';
import { playSound } from '../utils/audioEngine';

export const RobotSVG = ({ isFlying = false, isWiggling = false, size = 64 }) => {
  return (
    <div className={`robot-svg-wrapper ${isFlying ? 'robot-flying' : ''} ${isWiggling ? 'robot-wiggle' : ''}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="robot-svg-graphic"
      >
        <defs>
          {/* Head & Body Gradient */}
          <linearGradient id="robotBodyGrad" x1="20" y1="20" x2="80" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* Visor Gradient */}
          <linearGradient id="robotVisorGrad" x1="25" y1="30" x2="75" y2="55" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          {/* Glow Neon Cyan */}
          <linearGradient id="neonCyanGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          {/* Core Energy Glow */}
          <radialGradient id="energyCoreGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </radialGradient>

          {/* Jet Thruster Flame */}
          <linearGradient id="thrusterFlame" x1="50" y1="80" x2="50" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </linearGradient>

          {/* Filter for Visor Glow */}
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Jet Thruster Flame Effect (Underneath) */}
        <g className="robot-thruster-group">
          <ellipse cx="40" cy="85" rx="6" ry="8" fill="url(#thrusterFlame)" className="jet-pulse-1" />
          <ellipse cx="60" cy="85" rx="6" ry="8" fill="url(#thrusterFlame)" className="jet-pulse-2" />
          {isFlying && (
            <path
              d="M34 85 Q50 102 66 85 Q50 96 34 85 Z"
              fill="url(#thrusterFlame)"
              className="jet-blast-flame"
            />
          )}
        </g>

        {/* Antenna */}
        <line x1="50" y1="20" x2="50" y2="10" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
        <circle cx="50" cy="9" r="5" fill="#f59e0b" filter="url(#neonGlow)" className="antenna-beacon" />

        {/* Ears / Headphone Modules */}
        <rect x="18" y="28" width="6" height="16" rx="3" fill="#64748b" />
        <rect x="76" y="28" width="6" height="16" rx="3" fill="#64748b" />
        <circle cx="21" cy="36" r="2" fill="#38bdf8" />
        <circle cx="79" cy="36" r="2" fill="#38bdf8" />

        {/* Head Shell */}
        <rect x="22" y="18" width="56" height="34" rx="17" fill="url(#robotBodyGrad)" stroke="#bae6fd" strokeWidth="1.5" />

        {/* Digital Screen Visor */}
        <rect x="28" y="24" width="44" height="22" rx="10" fill="url(#robotVisorGrad)" stroke="#38bdf8" strokeWidth="1" />

        {/* Digital Eyes (Cute neon cyan curved expressive eyes) */}
        <g className="robot-eyes-group" filter="url(#neonGlow)">
          <ellipse cx="40" cy="35" rx="4.5" ry="5.5" fill="#22d3ee" className="robot-eye robot-eye-left" />
          <ellipse cx="60" cy="35" rx="4.5" ry="5.5" fill="#22d3ee" className="robot-eye robot-eye-right" />
          {/* Eye shine highlights */}
          <circle cx="41.5" cy="33.5" r="1.5" fill="#ffffff" />
          <circle cx="61.5" cy="33.5" r="1.5" fill="#ffffff" />
        </g>

        {/* Neck Ring */}
        <rect x="42" y="52" width="16" height="4" rx="2" fill="#475569" />

        {/* Torso / Body */}
        <path
          d="M30 56 Q50 54 70 56 L66 80 Q50 84 34 80 Z"
          fill="url(#robotBodyGrad)"
          stroke="#bae6fd"
          strokeWidth="1.5"
        />

        {/* Energy Core / Power Arc in Chest */}
        <circle cx="50" cy="68" r="6" fill="url(#energyCoreGrad)" filter="url(#neonGlow)" className="energy-core-pulse" />
        <circle cx="50" cy="68" r="3" fill="#ffffff" />

        {/* Left Arm (Resting) */}
        <path
          d="M28 58 Q22 66 26 74"
          stroke="#0284c7"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="26" cy="74" r="3.5" fill="#38bdf8" />

        {/* Right Arm (Waving or steering) */}
        <path
          d={isFlying ? "M72 58 Q80 66 78 74" : "M72 58 Q82 52 80 44"}
          stroke="#0284c7"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          className={!isFlying ? "robot-waving-arm" : ""}
        />
        <circle cx={isFlying ? "78" : "80"} cy={isFlying ? "74" : "44"} r="3.5" fill="#38bdf8" />
      </svg>
    </div>
  );
};

export const RobotMascotGuide = ({
  stationTitle,
  onStartClick,
  lang = 'ar',
  t
}) => {
  const [isWiggling, setIsWiggling] = useState(false);
  const [customSpeech, setCustomSpeech] = useState(null);

  const handleClickRobot = (e) => {
    e.stopPropagation();
    playSound.correct();
    setIsWiggling(true);
    setCustomSpeech(lang === 'en' ? 'Ready for the mission! ⚡' : 'جاهز للتحدي الجديد يا بطل؟ ✨');
    
    setTimeout(() => {
      setIsWiggling(false);
    }, 800);

    setTimeout(() => {
      setCustomSpeech(null);
    }, 3500);
  };

  const handleLaunch = (e) => {
    e.stopPropagation();
    playSound.click();
    if (onStartClick) {
      onStartClick();
    }
  };

  return (
    <div 
      className="robot-mascot-guide"
      onClick={handleClickRobot}
      title={lang === 'en' ? 'Click me!' : 'اضغط على المرشد الذكي!'}
    >
      {/* فقاعة الحديث التفاعلية */}
      <div className="robot-speech-bubble" onClick={(e) => e.stopPropagation()}>
        <div className="speech-bubble-tail" />
        <div className="speech-bubble-header">
          <Sparkles size={13} className="text-amber-400" />
          <span className="speech-guide-name">{lang === 'en' ? 'Guide Bot' : 'المرشد الذكي'}</span>
        </div>
        <p className="speech-bubble-text">
          {customSpeech || (lang === 'en' ? 'Your next station is here! 🚀' : 'محطتك التالية هنا! 🚀')}
        </p>
        <button 
          className="speech-start-chip"
          onClick={handleLaunch}
        >
          <Play size={12} fill="currentColor" />
          <span>{lang === 'en' ? 'Start' : 'ابدأ الآن'}</span>
        </button>
      </div>

      {/* مجسم الروبوت المتحرك */}
      <div className="robot-character-body">
        <RobotSVG isWiggling={isWiggling} size={62} />
        {/* Anti-gravity shadow disc */}
        <div className="robot-antigravity-shadow" />
      </div>
    </div>
  );
};
