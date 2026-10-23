import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CHAPTERS_METADATA, ALL_CHUNK_IDS, PATH_NODES } from '../src/data/curriculumMeta.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Construct new ALL_CHUNK_IDS
const newAllChunkIds = [];
for (const id of ALL_CHUNK_IDS) {
  newAllChunkIds.push(id);
  if (id === 'ch1-l4-exam') newAllChunkIds.push('ch1-chapter-exam');
  if (id === 'ch2-l3-exam') newAllChunkIds.push('ch2-chapter-exam');
  if (id === 'ch3-l3-exam') newAllChunkIds.push('ch3-chapter-exam');
  if (id === 'ch4-l4-exam') newAllChunkIds.push('ch4-chapter-exam');
}

// Boss Nodes Definitions
const BOSS_PATH_NODES = {
  1: {
    id: "ch1-chapter-exam",
    chapterId: 1,
    lessonId: "1-boss",
    chunkIndex: 99,
    chunkTitle: "👑 الاختبار الوزاري الشامل: وحدة تكنولوجيا المعلومات والمجتمع",
    enChunkTitle: "👑 Unit 1 Comprehensive Ministry Exam: IT & Society",
    lessonTitle: "👑 الامتحان الوزاري الشامل للوحدة الأولى",
    enLessonTitle: "👑 Unit 1 Comprehensive Ministry Exam",
    type: "lesson_exam",
    iconEmoji: "👑",
    xpReward: 200,
    starsReward: 5,
    isChapterExam: true
  },
  2: {
    id: "ch2-chapter-exam",
    chapterId: 2,
    lessonId: "2-boss",
    chunkIndex: 99,
    chunkTitle: "👑 الاختبار الوزاري لشهر أكتوبر: وحدة الأمن السيبراني (ص 35)",
    enChunkTitle: "👑 October Official Ministry Exam: Cybersecurity (p. 35)",
    lessonTitle: "👑 اختبار شهر أكتوبر الوزاري المعتمد: وحدة الأمن السيبراني",
    enLessonTitle: "👑 October Official Ministry Exam: Cybersecurity",
    type: "lesson_exam",
    iconEmoji: "👑",
    xpReward: 200,
    starsReward: 5,
    isChapterExam: true
  },
  3: {
    id: "ch3-chapter-exam",
    chapterId: 3,
    lessonId: "3-boss",
    chunkIndex: 99,
    chunkTitle: "👑 الاختبار الوزاري لشهر نوفمبر: وحدة تطبيقات الويب (ص 62)",
    enChunkTitle: "👑 November Official Ministry Exam: Web Applications (p. 62)",
    lessonTitle: "👑 اختبار شهر نوفمبر الوزاري المعتمد: وحدة تطبيقات الويب",
    enLessonTitle: "👑 November Official Ministry Exam: Web Applications",
    type: "lesson_exam",
    iconEmoji: "👑",
    xpReward: 200,
    starsReward: 5,
    isChapterExam: true
  },
  4: {
    id: "ch4-chapter-exam",
    chapterId: 4,
    lessonId: "4-boss",
    chunkIndex: 99,
    chunkTitle: "👑 الامتحان الوزاري الشامل للفصل الدراسي الأول (ص 84 - 87)",
    enChunkTitle: "👑 First Semester Grand Final Ministry Exam (p. 84 - 87)",
    lessonTitle: "👑 الامتحان الوزاري الشامل: الفصل الدراسي الأول كاملاً",
    enLessonTitle: "👑 First Semester Grand Final Ministry Exam",
    type: "lesson_exam",
    iconEmoji: "👑",
    xpReward: 300,
    starsReward: 5,
    isChapterExam: true
  }
};

const newPathNodes = [];
for (const node of PATH_NODES) {
  newPathNodes.push(node);
  if (node.id === 'ch1-l4-exam') newPathNodes.push(BOSS_PATH_NODES[1]);
  if (node.id === 'ch2-l3-exam') newPathNodes.push(BOSS_PATH_NODES[2]);
  if (node.id === 'ch3-l3-exam') newPathNodes.push(BOSS_PATH_NODES[3]);
  if (node.id === 'ch4-l4-exam') newPathNodes.push(BOSS_PATH_NODES[4]);
}

console.log(`Original ALL_CHUNK_IDS: ${ALL_CHUNK_IDS.length}, New: ${newAllChunkIds.length}`);
console.log(`Original PATH_NODES: ${PATH_NODES.length}, New: ${newPathNodes.length}`);

const targetFile = path.resolve(__dirname, '../src/data/curriculumMeta.js');

const metaContent = `/**
 * خريطة وفهارس المنهج الخفيفة (Lightweight Curriculum Metadata)
 * تحتوي على بيانات الفصول الـ 4 وقائمة معرفات وعقد المسار الـ 49 المعتمدة
 * تتيح فتح الصفحة الرئيسية في 0 ثانية دون تحميل بنك الأسئلة والشروحات الكاملة مسبقاً
 */

export const CHAPTERS_METADATA = ${JSON.stringify(CHAPTERS_METADATA, null, 2)};

export const ALL_CHUNK_IDS = ${JSON.stringify(newAllChunkIds, null, 2)};

export const PATH_NODES = ${JSON.stringify(newPathNodes, null, 2)};

export function getChapterIdFromChunkId(chunkId) {
  const m = String(chunkId).match(/^ch(\\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

export function getLessonIdFromChunkId(chunkId) {
  const m = String(chunkId).match(/^ch(\\d+)-l(\\d+)/);
  if (m) return \`\${m[1]}-\${m[2]}\`;
  const boss = String(chunkId).match(/^ch(\\d+)-chapter-exam/);
  if (boss) return \`\${boss[1]}-boss\`;
  return null;
}

export function getChunkNodeById(chunkId) {
  return PATH_NODES.find(n => n.id === chunkId) || null;
}

export function getNextChunkNode(currentChunkId) {
  const idx = ALL_CHUNK_IDS.indexOf(currentChunkId);
  if (idx !== -1 && idx + 1 < PATH_NODES.length) {
    return PATH_NODES[idx + 1];
  }
  return null;
}

export function getPreviousChunkNode(currentChunkId) {
  const idx = ALL_CHUNK_IDS.indexOf(currentChunkId);
  if (idx > 0) {
    return PATH_NODES[idx - 1];
  }
  return null;
}
`;

fs.writeFileSync(targetFile, metaContent, 'utf8');
console.log('Successfully updated src/data/curriculumMeta.js!');
