import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Lock, 
  Phone, 
  Mail, 
  X, 
  FileText, 
  CheckCircle2, 
  UserCheck, 
  Database, 
  EyeOff, 
  Smartphone,
  Sparkles
} from 'lucide-react';
import { playSound } from '../utils/audioEngine';

export default function PrivacyPolicyModal() {
  const { setActiveModal, lang } = useApp();

  const handleClose = () => {
    playSound.click();
    setActiveModal(null);
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div 
        className="modal-card legal-document-modal-card" 
        onClick={e => e.stopPropagation()}
      >
        {/* زر الإغلاق */}
        <button 
          className="quiz-close-btn" 
          onClick={handleClose}
          title={lang === 'en' ? 'Close' : 'إغلاق'}
        >
          <X size={20} />
        </button>

        {/* ترويسة المستند القانوني */}
        <div className="legal-doc-header">
          <div className="legal-doc-icon-wrap bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck size={32} />
          </div>
          <span className="legal-doc-tag">
            {lang === 'en' ? 'Official Privacy & Data Protection' : 'وثيقة حماية وخصوصية بيانات الطلاب'}
          </span>
          <h2 className="legal-doc-title">
            {lang === 'en' ? 'Privacy Policy' : 'سياسة الخصوصية والأمان'}
          </h2>
          <div className="teacher-author-badge">
            <span className="author-role">{lang === 'en' ? 'Supervised by:' : 'إشراف وتدريس:'}</span>
            <span className="author-name">{lang === 'en' ? 'Mr. Mohamed Rashed' : 'الأستاذ / محمد راشد'}</span>
            <span className="author-specialty">• {lang === 'en' ? 'Computer Science & AI Expert' : 'خبير البرمجة والذكاء الاصطناعي'}</span>
          </div>
        </div>

        {/* محتوى سياسة الخصوصية الشامل والمنسق */}
        <div className="legal-doc-scroll-content">
          {/* مقدمة */}
          <div className="legal-section-block">
            <h3 className="legal-section-title">
              <span className="section-num">1</span>
              <span>{lang === 'en' ? 'Introduction & Privacy Commitment' : 'المقدمة والتزامنا بحماية خصوصيتك'}</span>
            </h3>
            <p className="legal-paragraph">
              {lang === 'en'
                ? 'Welcome to the Interactive Programming & AI Learning Platform, created and supervised by Mr. Mohamed Rashed. We hold the privacy of our students and their families in the highest regard, adhering strictly to global digital security standards and educational data privacy protocols.'
                : 'أهلاً بكم في المنصة التفاعلية لمنهج البرمجة والذكاء الاصطناعي، التي يشرف عليها ويديرها الأستاذ محمد راشد. نلتزم التزاماً كاملاً بحماية خصوصية بيانات الطلاب وأولياء الأمور، وتوفير بيئة تعليمية آمنة وموثوقة خالية من أي انتهاك للبيانات.'
              }
            </p>
          </div>

          {/* البيانات التي يتم جمعها */}
          <div className="legal-section-block">
            <h3 className="legal-section-title">
              <span className="section-num">2</span>
              <span>{lang === 'en' ? 'Data We Collect' : 'البيانات التي نقوم بجمعها'}</span>
            </h3>
            <ul className="legal-checklist">
              <li>
                <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                <div>
                  <strong>{lang === 'en' ? 'Account Information: ' : 'بيانات الحساب الشخصي: '}</strong>
                  {lang === 'en' 
                    ? 'Student full name, contact phone number, and email address for account identity and emergency contact.'
                    : 'الاسم الكامل للطالب، رقم الهاتف للتواصل والمتابعة، والبريد الإلكتروني المعتمد لتوثيق الحساب.'
                  }
                </div>
              </li>
              <li>
                <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                <div>
                  <strong>{lang === 'en' ? 'Academic Progress Data: ' : 'بيانات التقدم والدرجات: '}</strong>
                  {lang === 'en' 
                    ? 'Quiz scores, mastery ratings (stars and trophies), attempted questions, and mistake reinforcement cycles.'
                    : 'درجات الاختبارات، النجوم المكتسبة، كؤوس إتقان الدروس، وسجل تصحيح وتثبيت المفاهيم.'
                  }
                </div>
              </li>
              <li>
                <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                <div>
                  <strong>{lang === 'en' ? 'Class Group Allocation: ' : 'بيانات السنتر والمجموعة الدراسية: '}</strong>
                  {lang === 'en' 
                    ? 'Assigned study center location and schedule for unlocking relevant explained topics.'
                    : 'السنتر التابع له الطالب، ومواعيد الحصص لفتح الفقرات المشروحة في كل مجموعة بشكل منظم.'
                  }
                </div>
              </li>
            </ul>
          </div>

          {/* الغرض من استخدام البيانات */}
          <div className="legal-section-block">
            <h3 className="legal-section-title">
              <span className="section-num">3</span>
              <span>{lang === 'en' ? 'Purpose of Data Processing' : 'كيفية استخدام البيانات الأكاديمية'}</span>
            </h3>
            <p className="legal-paragraph">
              {lang === 'en'
                ? 'Student data is exclusively utilized for academic purposes: tracking individual comprehension, enforcing the 90% mastery threshold designed by Mr. Mohamed Rashed, synchronizing curriculum unlocks with physical classes, and celebrating academic achievements.'
                : 'تُستخدم بيانات الطلاب حصرياً لأغراض تعليمية وتربوية تخدم الطالب مباشرة: متابعة مستوى الاستيعاب الفردي من قِبل الأستاذ محمد راشد، تطبيق معيار الإتقان الأكاديمي (شرط الـ 90% للاجتياز)، فتح المنهج المشروح بالتزامن مع الحصص، وتحفيز الطلاب بالنجوم والكؤوس.'
              }
            </p>
          </div>

          {/* عدم مشاركة البيانات والسرية */}
          <div className="legal-section-block">
            <h3 className="legal-section-title">
              <span className="section-num">4</span>
              <span>{lang === 'en' ? 'Strict Confidentiality & Zero Advertising' : 'السرية التامة وعدم مشاركة البيانات إطلاقاً'}</span>
            </h3>
            <p className="legal-paragraph">
              {lang === 'en'
                ? 'We strictly DO NOT sell, rent, trade, or share any personal or academic information with third parties, marketing firms, or external advertisers. All records are guarded with robust security.'
                : 'نؤكد عدم بيع أو تأجير أو مشاركة أو تداول أي بيانات شخصية أو دراسية لأي طرف ثالث أو جهات إعلانية تحت أي ظرف. المنصة مخصصة للتعليم الأكاديمي فقط وخالية تماماً من الإعلانات التجارية.'
              }
            </p>
          </div>

          {/* التخزين المحلي وأمن الجلسات */}
          <div className="legal-section-block">
            <h3 className="legal-section-title">
              <span className="section-num">5</span>
              <span>{lang === 'en' ? 'Offline Persistence & Storage Security' : 'التخزين المحلي والأمان الفني'}</span>
            </h3>
            <p className="legal-paragraph">
              {lang === 'en'
                ? 'The platform utilizes encrypted browser LocalStorage to maintain learning progress, audio narration state, and quiz queues even when network connectivity fluctuates, guaranteeing a seamless educational experience.'
                : 'تستخدم المنصة تقنيات التخزين المحلي الآمنة (LocalStorage) لحفظ تقدم الطالب ومراحله المنجزة وأصوات النطق التفاعلية، حتى لا يفقد الطالب إجاباته في حال انقطاع اتصال الإنترنت المؤقت.'
              }
            </p>
          </div>

          {/* حقوق الطالب وولي الأمر والتواصل */}
          <div className="legal-section-block">
            <h3 className="legal-section-title">
              <span className="section-num">6</span>
              <span>{lang === 'en' ? 'Parent & Student Rights & Direct Contact' : 'حقوق الطالب وولي الأمر والتواصل المباشر'}</span>
            </h3>
            <p className="legal-paragraph">
              {lang === 'en'
                ? 'Parents and students have full rights to request progress transcripts, update phone numbers, or request account management by directly reaching out to Mr. Mohamed Rashed through the official channels below:'
                : 'يحق لولي الأمر أو الطالب طلب مراجعة الدرجات أو تعديل رقم الهاتف أو تحديث بيانات الاشتراك بالتواصل المباشر مع الأستاذ محمد راشد عبر القنوات الرسمية التالية:'
              }
            </p>
            
            <div className="teacher-direct-contact-card">
              <div className="contact-col">
                <span className="contact-label">{lang === 'en' ? 'Direct Mobile & WhatsApp' : 'الهاتف المباشر وواتساب'}</span>
                <a href="tel:01005144500" className="contact-value-link">
                  <Phone size={16} className="text-emerald-400" />
                  <span className="font-mono text-base font-bold">01005144500</span>
                </a>
              </div>
              <div className="contact-col">
                <span className="contact-label">{lang === 'en' ? 'Official Academic Email' : 'البريد الإلكتروني المعتمد'}</span>
                <a href="mailto:mrrashed0777@gmail.com" className="contact-value-link">
                  <Mail size={16} className="text-indigo-400" />
                  <span className="font-mono text-base font-bold">mrrashed0777@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* أزرار الإجراءات */}
        <div className="legal-doc-footer-actions">
          <button 
            className="duo-btn duo-btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2"
            onClick={handleClose}
          >
            <CheckCircle2 size={18} />
            <span>{lang === 'en' ? 'I Have Read & Understood the Privacy Policy' : 'قرأت واطلعت على سياسة الخصوصية'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
