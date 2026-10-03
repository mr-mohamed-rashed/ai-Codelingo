/**
 * Audio Engine: Web Speech Synthesis (Text-to-Speech) & Web Audio Sound FX
 * إعداد: م / محمد راشد
 */

// Web Audio Context for synthesized sound effects
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const playSound = {
  // صوت الإجابة الصحيحة مثل دوولينجو (نغمة صاعدة مبهجة)
  correct: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Note 1 (E5 - 659.25Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.15, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.18);

      // Note 2 (A5 - 880Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, now + 0.12);
      gain2.gain.setValueAtTime(0.22, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.45);
    } catch (e) {
      console.warn("Audio effect error:", e);
    }
  },

  // صوت الخطأ اللطيف (نغمة تنبيه غير محبطة)
  wrong: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.28);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.28);
    } catch (e) {}
  },

  // صوت احتفال إكمال الفقرة والترقية
  levelUp: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + idx * 0.10;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } catch (e) {}
  },

  // صوت نقرة تفاعلية خفيفة
  click: () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }
};

/**
 * Text-to-Speech (TTS) Voice Narration Controller
 * تم التخصيص بقارئة الذكاء الاصطناعي (صوت أنثوي هادئ لنطق وشرح المنهج التعليمي)
 */
class VoiceNarrator {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentUtterance = null;
    this.isPlaying = false;
    this.currentRate = 0.88; // وتيرة هادئة وتعليمية مريحة
    this.currentPitch = 1.10; // نبرة صوت أنثوية دافئة ومتزنة

    if (this.synth && this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => {
        // Pre-warm voices list
        this.synth.getVoices();
      };
    }
  }

  /**
   * البحث عن أفضل صوت أنثوي عربي هادئ ومتزن
   */
  getBestFemaleArabicVoice() {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return null;

    // 1. الأصوات الأنثوية العربية المخصصة (Microsoft, Google, Apple)
    const femaleVoicePatterns = /(salma|zariyah|hoda|laila|zeina|fatima|maryam|sana|amany|mageda|female|woman)/i;
    
    const preferredFemaleAr = voices.find(v => 
      v.lang.startsWith('ar') && femaleVoicePatterns.test(v.name)
    );
    if (preferredFemaleAr) return preferredFemaleAr;

    // 2. أي صوت عربي متاح
    const anyArVoice = voices.find(v => v.lang.startsWith('ar') || /arabic/i.test(v.name) || /ar[-_]/i.test(v.lang));
    if (anyArVoice) return anyArVoice;

    // 3. صوت افتراضي ناعم
    return voices.find(v => femaleVoicePatterns.test(v.name)) || null;
  }

  speak(text, lang = 'ar-SA', onStart, onEnd, onError, customRate) {
    if (!this.synth) {
      if (onError) onError("المتصفح لا يدعم القراءة الصوتية");
      return;
    }

    this.stop();

    if (!text || !text.trim()) {
      if (onEnd) onEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = customRate || (lang.startsWith('en') ? 0.90 : this.currentRate);
    utterance.pitch = this.currentPitch; // نبرة هادئة ومريحة

    // انتقاء الصوت الأنثوي المناسب
    if (lang.startsWith('en')) {
      const voices = this.synth.getVoices();
      const enFemale = voices.find(v => 
        v.lang.startsWith('en') && /(female|samantha|zira|natural|google|victoria|karen)/i.test(v.name)
      );
      if (enFemale) utterance.voice = enFemale;
    } else {
      const bestFemaleVoice = this.getBestFemaleArabicVoice();
      if (bestFemaleVoice) {
        utterance.voice = bestFemaleVoice;
      }
    }

    utterance.onstart = () => {
      this.isPlaying = true;
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.isPlaying = false;
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      this.isPlaying = false;
      this.currentUtterance = null;
      if (onError) onError(e);
    };

    this.currentUtterance = utterance;
    try {
      this.synth.speak(utterance);
    } catch (e) {
      console.warn("TTS Speak error:", e);
      if (onError) onError(e);
    }
  }

  pause() {
    if (this.synth && this.isPlaying) {
      this.synth.pause();
    }
  }

  resume() {
    if (this.synth) {
      this.synth.resume();
    }
  }

  stop() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {}
      this.isPlaying = false;
      this.currentUtterance = null;
    }
  }
}

export const narrator = new VoiceNarrator();

export const speakArabic = (text, onStart, onEnd, customRate) => {
  narrator.speak(text, 'ar-SA', onStart, onEnd, null, customRate);
};

export const speakEnglish = (text, onStart, onEnd) => {
  narrator.speak(text, 'en-US', onStart, onEnd);
};

