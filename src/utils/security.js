/**
 * وحدة الحماية والتحقق من المدخلات (Security & Input Sanitization)
 * منصة كودلينجو للبرمجة والذكاء الاصطناعي
 * 
 * تحمي من:
 * 1. هجمات XSS (Cross-Site Scripting) عبر تنظيف وسوم HTML والنصوص البرمجية
 * 2. هجمات الحقن والمدخلات التخريبية (SQL/NoSQL/PostgREST injection attempts)
 * 3. فحص ومطابقة أرقام الهواتف والبريد الإلكتروني قبل إرسالها لقاعدة البيانات
 */

/**
 * تنظيف النصوص العادية وتجريدها من وسوم HTML والأكواد البرمجية
 * @param {string} input - النص المدخل
 * @param {number} maxLength - الحد الأقصى للطول (افتراضي 200 حرف)
 * @returns {string} النص بعد التنظيف والحماية
 */
export function sanitizeText(input, maxLength = 200) {
  if (typeof input !== 'string') return '';
  
  // إزالة وسوم HTML و JavaScript لمنع ثغرات XSS
  const cleaned = input
    .replace(/<[^>]*>?/gm, '') // حذف أي وسوم HTML مثل <script>, <img>, <iframe>
    .replace(/[<>'"`;\\]/g, '') // إزالة الحروف الخاصة المستخدمة في حقن الأوامر
    .replace(/\s+/g, ' ') // دمج المسافات الزائدة
    .trim();

  return cleaned.slice(0, maxLength);
}

/**
 * تنظيف وفحص أرقام الهواتف (أرقام فقط بحد أقصى 11 رقماً)
 * @param {string} phone - رقم الهاتف
 * @returns {string} رقم الهاتف النظيف
 */
export function sanitizePhone(phone) {
  if (!phone) return '';
  // استخراج الأرقام فقط
  let cleaned = String(phone).replace(/[^0-9]/g, '').trim();

  // معالجة كود الدولة الدولي لمصر (002 أو 20) وتحويله إلى الصيغة المحلية (01...)
  if (cleaned.startsWith('002')) {
    cleaned = cleaned.slice(3);
  } else if (cleaned.startsWith('20') && cleaned.length >= 12) {
    cleaned = '0' + cleaned.slice(2);
  }

  // إذا كان الرقم 10 أرقام ويبدأ بـ 10 أو 11 أو 12 أو 15، نضيف له الصفر في البداية
  if (cleaned.length === 10 && (cleaned.startsWith('10') || cleaned.startsWith('11') || cleaned.startsWith('12') || cleaned.startsWith('15'))) {
    cleaned = '0' + cleaned;
  }

  return cleaned.slice(0, 11);
}

/**
 * التحقق من صحة رقم الهاتف (11 رقماً ويبدأ بـ 01)
 * @param {string} phone
 * @returns {boolean}
 */
export function isValidPhone(phone) {
  const cleaned = sanitizePhone(phone);
  return cleaned.length === 11 && cleaned.startsWith('01');
}

/**
 * تنظيف وفحص البريد الإلكتروني
 * @param {string} email
 * @returns {string}
 */
export function sanitizeEmail(email) {
  if (typeof email !== 'string') return '';
  const cleaned = email.trim().toLowerCase().slice(0, 120);
  return cleaned;
}

/**
 * التحقق من صيغة البريد الإلكتروني
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  const cleaned = sanitizeEmail(email);
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(cleaned);
}

/**
 * فحص وتطهير كائن الطالب بالكامل قبل إرساله لقاعدة البيانات
 * @param {Object} studentData
 * @returns {Object} كائن مفحوص ومطهر وآمن تماماً
 */
export function sanitizeStudentInput(studentData = {}) {
  const result = { ...studentData };

  if (result.name !== undefined) {
    result.name = sanitizeText(result.name, 80) || 'طالب كودلينجو';
  }
  if (result.phone !== undefined) {
    result.phone = sanitizePhone(result.phone) || null;
  }
  if (result.guardianPhone !== undefined) {
    result.guardianPhone = sanitizePhone(result.guardianPhone) || null;
  }
  if (result.email !== undefined) {
    result.email = sanitizeEmail(result.email) || null;
  }
  if (result.avatar !== undefined && typeof result.avatar === 'string') {
    // التحقق من أن رابط الصورة يبدأ بـ https:// أو مسار محلي آمن
    const avatar = result.avatar.trim();
    if (avatar.startsWith('https://') || avatar.startsWith('./') || avatar.startsWith('/')) {
      result.avatar = avatar.slice(0, 300);
    } else {
      result.avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=Student`;
    }
  }

  return result;
}
