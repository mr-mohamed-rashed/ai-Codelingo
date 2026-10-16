/**
 * Teacher Audio Engine: مشغل التسجيلات الصوتية الحقيقية للأستاذ محمد راشد
 * يدعم:
 * 1. تشغيل ملفات MP3 الحقيقية لكل كارت ولكل فقرة
 * 2. التشغيل المتتابع التلقائي (الانتقال التلقائي للكارت التالي فور انتهاء التسجيل)
 * 3. معرفات واضحة وسهلة (Audio IDs) لكل كارت وفقرة
 * 4. السقوط الآمن والمريح في حال عدم وجود تسجيل بعد
 */

import { narrator, playSound } from './audioEngine';

class TeacherAudioEngine {
  constructor() {
    this.audioElement = null;
    this.isPlaying = false;
    this.currentChunkId = null;
    this.currentCardIndex = null;
    this.currentAudioId = null;
    this.isRealAudio = false;
    this.autoPlayNext = true; // تفعيل الانتقال التلقائي افتراضياً كما طلب الأستاذ
    this.onStateChange = null;
  }

  /**
   * استخراج بيانات الصوت لأي كارت داخل أي فقرة
   */
  getCardAudioMeta(chunk, cardIndex) {
    if (!chunk) return null;
    const cardNum = cardIndex + 1;
    const audioId = `${chunk.id}-card-${cardNum}`;
    const fileName = `${audioId}.mp3`;
    const defaultUrl = `/audio/lessons/${fileName}`;
    const card = chunk.contentCards?.[cardIndex];

    return {
      audioId,
      fileName,
      audioUrl: card?.audioUrl || card?.audioFile || defaultUrl,
      title: card?.title || `الكارت ${cardNum}`
    };
  }

  /**
   * استخراج بيانات الصوت للفقرة بالكامل
   */
  getChunkFullAudioMeta(chunk) {
    if (!chunk) return null;
    const audioId = `${chunk.id}-full`;
    const fileName = `${audioId}.mp3`;
    return {
      audioId,
      fileName,
      audioUrl: chunk.audioUrl || `/audio/lessons/${fileName}`,
      title: chunk.chunkTitle
    };
  }

  /**
   * إيقاف أي صوت مشغل حالياً
   */
  stop() {
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
        this.audioElement.src = '';
      } catch (e) {}
      this.audioElement = null;
    }
    narrator.stop();
    this.isPlaying = false;
    this.currentCardIndex = null;
    this.currentAudioId = null;
    this.isRealAudio = false;
    if (this.onStateChange) this.onStateChange();
  }

  /**
   * تشغيل كارت محدد داخل فقرة
   */
  playCard(chunk, cardIndex, options = {}) {
    this.stop();

    if (!chunk || !chunk.contentCards || cardIndex >= chunk.contentCards.length) {
      if (options.onAllCardsCompleted) options.onAllCardsCompleted();
      return;
    }

    const cardMeta = this.getCardAudioMeta(chunk, cardIndex);
    const card = chunk.contentCards[cardIndex];
    this.currentChunkId = chunk.id;
    this.currentCardIndex = cardIndex;
    this.currentAudioId = cardMeta.audioId;

    // محاولة تشغيل ملف التسجيل الحقيقي MP3
    const testAudio = new Audio(cardMeta.audioUrl);

    testAudio.oncanplaythrough = () => {
      // الملف موجود ويعمل بنجاح
      this.audioElement = testAudio;
      this.isPlaying = true;
      this.isRealAudio = true;
      if (options.onStart) options.onStart({ isRealAudio: true, audioId: cardMeta.audioId, cardIndex });
      if (this.onStateChange) this.onStateChange();

      testAudio.play().catch(e => {
        console.warn("Auto-play was blocked or failed:", e);
      });
    };

    testAudio.onended = () => {
      this.isPlaying = false;
      this.audioElement = null;
      if (options.onCardEnded) options.onCardEnded({ cardIndex, audioId: cardMeta.audioId });
      if (this.onStateChange) this.onStateChange();

      // الانتقال التلقائي للكارت التالي إذا كان خيار التشغيل المتتابع مفعلاً
      if (this.autoPlayNext && cardIndex + 1 < chunk.contentCards.length) {
        if (options.onAutoAdvance) options.onAutoAdvance(cardIndex + 1);
        setTimeout(() => {
          this.playCard(chunk, cardIndex + 1, options);
        }, 600); // فاصل زمني هادئ نصف ثانية بين الكروت
      } else if (cardIndex + 1 >= chunk.contentCards.length) {
        playSound.levelUp();
        if (options.onAllCardsCompleted) options.onAllCardsCompleted();
      }
    };

    testAudio.onerror = () => {
      // لم يتم العثور على ملف MP3 مسجل بعد لهذا الكارت
      // التحقق مما إذا كان هناك قارئ صوتي عربي متاح
      const hasArVoice = narrator.hasArabicVoice();
      if (hasArVoice) {
        this.isRealAudio = false;
        const cleanTitle = (card.title || '').replace(/^[💡📌⚠️✅]\s*/, '');
        const pts = card.points 
          ? card.points.map(p => p.replace(/^[0-9️⃣🔟#•\-–—]\s*/, '')).join('. ') 
          : (card.text || '');
        const textToRead = `${cleanTitle}. ${pts}`.trim();

        narrator.speak(
          textToRead,
          'ar-SA',
          () => {
            this.isPlaying = true;
            if (options.onStart) options.onStart({ isRealAudio: false, audioId: cardMeta.audioId, cardIndex });
            if (this.onStateChange) this.onStateChange();
          },
          () => {
            this.isPlaying = false;
            if (options.onCardEnded) options.onCardEnded({ cardIndex, audioId: cardMeta.audioId });
            if (this.onStateChange) this.onStateChange();

            // انتقال متتابع أيضاً
            if (this.autoPlayNext && cardIndex + 1 < chunk.contentCards.length) {
              if (options.onAutoAdvance) options.onAutoAdvance(cardIndex + 1);
              setTimeout(() => {
                this.playCard(chunk, cardIndex + 1, options);
              }, 600);
            } else if (cardIndex + 1 >= chunk.contentCards.length) {
              playSound.levelUp();
              if (options.onAllCardsCompleted) options.onAllCardsCompleted();
            }
          },
          (err) => {
            this.isPlaying = false;
            if (options.onError) options.onError({ code: 'NO_ARABIC_VOICE', cardMeta });
            if (this.onStateChange) this.onStateChange();
          },
          options.rate || 0.88
        );
      } else {
        // لا يوجد ملف صوتي ولا قارئ عربي مثبت بالجهاز
        this.isPlaying = false;
        if (options.onError) {
          options.onError({
            code: 'RECORDING_PENDING',
            cardMeta,
            message: `المقطع الصوتي قيد التسجيل بصوت أ. محمد راشد قريباً (كود الملف: ${cardMeta.fileName})`
          });
        }
        if (this.onStateChange) this.onStateChange();
      }
    };

    // بدء محاولة التحميل
    testAudio.load();
  }

  /**
   * تشغيل الفقرة كاملة بالتتابع (من الكارت الأول وحتى الأخير)
   */
  playFullSequence(chunk, options = {}) {
    const fullMeta = this.getChunkFullAudioMeta(chunk);
    const fullAudio = new Audio(fullMeta.audioUrl);

    // إذا وُجد تسجيل كامل للفقرة كملف واحد ch1-l1-c1-full.mp3، نقوم بتشغيله
    fullAudio.oncanplaythrough = () => {
      this.stop();
      this.audioElement = fullAudio;
      this.isPlaying = true;
      this.isRealAudio = true;
      this.currentAudioId = fullMeta.audioId;
      if (options.onStart) options.onStart({ isRealAudio: true, audioId: fullMeta.audioId, isFull: true });
      if (this.onStateChange) this.onStateChange();

      fullAudio.play().catch(e => console.warn(e));
    };

    fullAudio.onended = () => {
      this.isPlaying = false;
      this.audioElement = null;
      playSound.levelUp();
      if (options.onAllCardsCompleted) options.onAllCardsCompleted();
      if (this.onStateChange) this.onStateChange();
    };

    fullAudio.onerror = () => {
      // لا يوجد ملف كامل واحد -> تشغيل الكروت بالتتابع بدءاً من الكارت الأول
      this.playCard(chunk, 0, options);
    };

    fullAudio.load();
  }
}

export const teacherAudioPlayer = new TeacherAudioEngine();
