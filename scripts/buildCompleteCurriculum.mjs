import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CURRICULUM_DATA } from '../src/data/curriculumData.js';
import { OFFICIAL_EXAMS_DATA } from './officialExamsData.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(`Original CURRICULUM_DATA items count: ${CURRICULUM_DATA.length}`);

// 1. Update 14 lesson exams
const updatedData = [];

// Prepare Chapter Boss objects
const CHAPTER_BOSS_EXAMS = {
  1: {
    id: "ch1-chapter-exam",
    iconEmoji: "👑",
    chapterId: 1,
    lessonId: "1-boss",
    lessonTitle: "👑 الامتحان الوزاري الشامل: تكنولوجيا المعلومات والمجتمع",
    chunkIndex: 99,
    chunkTitle: "👑 الاختبار الوزاري الشامل: وحدة تكنولوجيا المعلومات والمجتمع",
    type: "lesson_exam",
    isLessonExam: true,
    isChapterExam: true,
    xpReward: 200,
    starsReward: 5,
    summary: "الامتحان الوزاري التجميعي الأكبر للوحدة الأولى من كتاب التقييمات ص 3 إلى 29 يجمع كافة المفاهيم ونماذج A و B و C المعتمدة.",
    audioNarrationText: "أهلاً بك يا بطل في الاختبار الوزاري الشامل والأكبر للوحدة الأولى كاملة! هذا الامتحان يمثل التحدي النهائي لاجتياز الوحدة والحصول على التاج الذهبي و200 نقطة خبرة. ركّز جيداً وأرنا إبداعك!",
    examQuestions: OFFICIAL_EXAMS_DATA["ch1-chapter-exam"].questions
  },
  2: {
    id: "ch2-chapter-exam",
    iconEmoji: "👑",
    chapterId: 2,
    lessonId: "2-boss",
    lessonTitle: "👑 اختبار شهر أكتوبر الوزاري المعتمد: وحدة الأمن السيبراني",
    chunkIndex: 99,
    chunkTitle: "👑 الاختبار الوزاري لشهر أكتوبر: وحدة الأمن السيبراني (ص 35)",
    type: "lesson_exam",
    isLessonExam: true,
    isChapterExam: true,
    xpReward: 200,
    starsReward: 5,
    summary: "الامتحان الرسمي لشهر أكتوبر المعتمد من وزارة التربية والتعليم من كتاب التقييمات ص 35 يجمع كافة مفاهيم الأمن والتشفير وجدران الحماية.",
    audioNarrationText: "مرحباً بك في اختبار شهر أكتوبر الوزاري المعتمد لوحدة الأمن السيبراني! هذا الامتحان مطابق تماماً لنموذج تقييم شهر أكتوبر الرسمي ص 35 في كتاب الوزارة. استعد لتتويج مهاراتك الأمنية بالتاج الملكي!",
    examQuestions: OFFICIAL_EXAMS_DATA["ch2-chapter-exam"].questions
  },
  3: {
    id: "ch3-chapter-exam",
    iconEmoji: "👑",
    chapterId: 3,
    lessonId: "3-boss",
    lessonTitle: "👑 اختبار شهر نوفمبر الوزاري المعتمد: وحدة تطبيقات الويب",
    chunkIndex: 99,
    chunkTitle: "👑 الاختبار الوزاري لشهر نوفمبر: وحدة تطبيقات الويب (ص 62)",
    type: "lesson_exam",
    isLessonExam: true,
    isChapterExam: true,
    xpReward: 200,
    starsReward: 5,
    summary: "الامتحان الرسمي لشهر نوفمبر المعتمد من وزارة التربية والتعليم من كتاب التقييمات ص 62 يغطي طبقات الويب 3-Tier والبروتوكولات و HTML/CSS/JS.",
    audioNarrationText: "أهلاً بك يا بطل في اختبار شهر نوفمبر الوزاري المعتمد لوحدة تطبيقات الويب! هذا الامتحان مطابق لنموذج شهر نوفمبر الرسمي ص 62 من كتاب التقييمات الوزاري. اجتيازه يمنحك التاج الذهبي ويثبت جدارتك كمطور ويب واعد!",
    examQuestions: OFFICIAL_EXAMS_DATA["ch3-chapter-exam"].questions
  },
  4: {
    id: "ch4-chapter-exam",
    iconEmoji: "👑",
    chapterId: 4,
    lessonId: "4-boss",
    lessonTitle: "👑 الامتحان الوزاري الشامل: الفصل الدراسي الأول كاملاً",
    chunkIndex: 99,
    chunkTitle: "👑 الامتحان الوزاري الشامل للفصل الدراسي الأول (ص 84 - 87)",
    type: "lesson_exam",
    isLessonExam: true,
    isChapterExam: true,
    xpReward: 300,
    starsReward: 5,
    summary: "الامتحان الوزاري النهائي التجميعي الأكبر للفصل الدراسي الأول كاملاً من ص 84 إلى 87 بكتاب الأداءات والتقييمات، متوجاً رحلة الترم الأول بأكملها.",
    audioNarrationText: "ألف مبروك وصولك للقمة! هذا هو التحدي الأكبر والامتحان الوزاري الشامل للترم الأول كاملاً من نماذج الوزارة النهائية ص 84 إلى 87. اجتياز هذا الامتحان يعني تفوقك التام واستعدادك للترم الثاني!",
    examQuestions: OFFICIAL_EXAMS_DATA["ch4-chapter-exam"].questions
  }
};

for (const item of CURRICULUM_DATA) {
  if (item.type === 'lesson_exam' && OFFICIAL_EXAMS_DATA[item.id]) {
    const official = OFFICIAL_EXAMS_DATA[item.id];
    const updatedExam = {
      ...item,
      chunkTitle: official.chunkTitle || item.chunkTitle,
      summary: official.summary || item.summary,
      examQuestions: official.questions
    };
    updatedData.push(updatedExam);

    // After the last lesson exam of each chapter, inject chapter boss exam
    if (item.id === 'ch1-l4-exam') {
      updatedData.push(CHAPTER_BOSS_EXAMS[1]);
    } else if (item.id === 'ch2-l3-exam') {
      updatedData.push(CHAPTER_BOSS_EXAMS[2]);
    } else if (item.id === 'ch3-l3-exam') {
      updatedData.push(CHAPTER_BOSS_EXAMS[3]);
    } else if (item.id === 'ch4-l4-exam') {
      updatedData.push(CHAPTER_BOSS_EXAMS[4]);
    }
  } else {
    updatedData.push(item);
  }
}

console.log(`New CURRICULUM_DATA items count: ${updatedData.length} (expected 49: 31 chunks + 14 lesson exams + 4 chapter exams)`);

// 2. Generate updated curriculumData.js file content
const curriculumDataFile = path.resolve(__dirname, '../src/data/curriculumData.js');
const fileHeader = `/**
 * بنك محتوى منهج البرمجة والذكاء الاصطناعي - ثانية بكالوريا (الترم الأول كاملاً)
 * المنهج التفاعلي الوزاري المعتمد
 * 4 فصول رئيسية • 14 درساً تفصيلياً • 31 فقرة تعليمية مستقلة • 14 اختبار إتقان للدروس • 4 امتحانات وزارية شاملة للفصول
 * الأسئلة مستخرجة ومطابقة رسمياً لكتاب الأداءات والتقييمات الصادر من وزارة التربية والتعليم (87 صفحة)
 */

export const CURRICULUM_DATA = ${JSON.stringify(updatedData, null, 2)};
`;

fs.writeFileSync(curriculumDataFile, fileHeader, 'utf8');
console.log(`Saved updated curriculumData.js successfully!`);
