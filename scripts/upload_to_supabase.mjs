import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// قراءة متغيرات البيئة من .env يدوياً
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.substring(0, idx).trim();
      const val = trimmed.substring(idx + 1).trim().replace(/^["']|["']$/g, '');
      env[key] = val;
    }
  });
  return env;
}

const env = loadEnv();
const supabaseUrl = process.env.VITE_SUPABASE_URL || env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log(`
⚠️ [Supabase Uploader] لم يتم العثور على مفاتيح Supabase في ملف .env
يرجى وضع المفاتيح في ملف .env بالشكل التالي:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

أو يمكنك نسخ وتشغيل ملف supabase_schema.sql ثم data/seeds/seed_curriculum.sql مباشرة في SQL Editor داخل Supabase!
  `);
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function upload() {
  console.log(`Connecting to Supabase at: ${supabaseUrl}...`);

  const seedsDir = path.join(__dirname, '..', 'data', 'seeds');
  const chapters = JSON.parse(fs.readFileSync(path.join(seedsDir, 'chapters.json'), 'utf8'));
  const lessons = JSON.parse(fs.readFileSync(path.join(seedsDir, 'lessons.json'), 'utf8'));
  const chunks = JSON.parse(fs.readFileSync(path.join(seedsDir, 'chunks.json'), 'utf8'));
  const questions = JSON.parse(fs.readFileSync(path.join(seedsDir, 'questions.json'), 'utf8'));

  // 1. رفع الفصول
  console.log(`Uploading ${chapters.length} chapters...`);
  const { error: chErr } = await supabase.from('chapters').upsert(chapters);
  if (chErr) throw new Error(`Chapters upload error: ${chErr.message}`);
  console.log('✓ Chapters uploaded successfully.');

  // 2. رفع الدروس
  console.log(`Uploading ${lessons.length} lessons...`);
  const { error: lsErr } = await supabase.from('lessons').upsert(lessons);
  if (lsErr) throw new Error(`Lessons upload error: ${lsErr.message}`);
  console.log('✓ Lessons uploaded successfully.');

  // 3. رفع الفقرات
  console.log(`Uploading ${chunks.length} chunks...`);
  const { error: chkErr } = await supabase.from('chunks').upsert(chunks);
  if (chkErr) throw new Error(`Chunks upload error: ${chkErr.message}`);
  console.log('✓ Chunks uploaded successfully.');

  // 4. رفع الأسئلة على دفعات (Batches of 50)
  console.log(`Uploading ${questions.length} questions...`);
  const batchSize = 50;
  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize);
    const { error: qErr } = await supabase.from('questions').upsert(batch);
    if (qErr) throw new Error(`Questions batch ${i / batchSize + 1} error: ${qErr.message}`);
    console.log(`✓ Questions uploaded (${Math.min(i + batchSize, questions.length)} / ${questions.length})`);
  }

  console.log('🎉 All 4 tables uploaded to Supabase successfully!');
}

upload().catch(err => {
  console.error('❌ Upload failed:', err.message);
  process.exit(1);
});
