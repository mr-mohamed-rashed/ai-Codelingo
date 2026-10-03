import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileCheck2, 
  Scale, 
  Phone, 
  Mail, 
  X, 
  CheckCircle2, 
  ShieldAlert, 
  Award, 
  BookOpen, 
  Sparkles,
  School
} from 'lucide-react';
import { playSound } from '../utils/audioEngine';

export default function TermsOfUseModal() {
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

        {/* ترويسة شروط الاستخدام */}
        <div className="legal-doc-header">
          <div className="legal-doc-icon-wrap bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
            <Scale size={32} />
          </div>
          <span className="legal-doc-tag">
            {lang === 'en' ? 'Terms & Conditions of Service' : 'شروط وأحكام الاستخدام الأكاديمي'}
          </span>
          <h2 className="legal-doc-title">
            {lang === 'en' ? 'Terms of Use' : 'شروط وضوابط استخدام المنصة'}
          </h2>
          <div className="teacher-author-badge">
            <span className="author-role">{lang === 'en' ? 'Prepared & Owned by:' : 'إعداد وحقوق ملكية:'}</span>
            <span className="author-name">{lang === 'en' ? 'Mr. Mohamed Rashed' : 'الأستاذ / محمد راشد'}</span>
            <span className="author-specialty">• {lang === 'en' ? 'Curriculum Author & Lead Educator' : 'معد ومدرس المنهج الأكاديمي'}</span>
          </div>
        </div>

        {/* محتوى الشروط */}
        <div className="legal-doc-scroll-content">
          {/* 1. القبول والالتزام */}
          <div className="legal-section-block">
            <h3 className="legal-section-title">
              <span className="section-num">1</span>
              <span>{lang === 'en' ? 'Acceptance of Terms' : 'الموافقة على الشروط والأحكام'}</span>
            </h3>
            <p className="legal-paragraph">
              {lang === 'en'
                ? 'By registering an account or accessing any lesson, quiz, or feature on this platform, you agree to abide unconditionally by these Terms of Use formulated by Mr. Mohamed Rashed for the Programming & Artificial Intelligence Curriculum.'
                : 'يعد إنشاء حساب أو تسجيل الدخول أو استخدام أي جزء من المنصة التفاعلية بمثابة إقرار صريح بالموافقة التامة والالتزام بجميع الضوابط والشروط التعليمية الموضوعة من قِبل الأستاذ محمد راشد لمنهج البرمجة والذكاء الاصطناعي.'
              }
            </p>
          </div>

          {/* 2. الملكية الفكرية وحماية المحتوى */}
          <div className="legal-section-block">
            <h3 className="legal-section-title">
              <span className="section-num">2</span>
              <span>{lang === 'en' ? 'Intellectual Property & Copyright' : 'حقوق الملكية الفكرية والنشر الأكاديمي'}</span>
            </h3>
            <div className="legal-highlight-box">
              <p className="legal-paragraph text-amber-200">
                {lang === 'en'
                  ? 'All educational materials, micro-lesson cards, interactive vocabulary, audio narrations, standard questions, distinction challenges, and practice exams are the exclusive intellectual property of Mr. Mohamed Rashed.'
                  : 'جميع الشروحات التفاعلية، بطاقات الدروس، نصوص النطق الصوتي، بنوك الأسئلة، أسئلة الامتياز، والاختبارات الشاملة للمنهج هي ملكية فكرية حصرية ومحمية للأستاذ محمد راشد.'
                }
              </p>
            </div>
            <p className="legal-paragraph mt-2">
              {lang === 'en'
                ? 'Reproduction, commercial distribution, public re-uploading, or unauthorized exploitation of any platform materials without prior written consent from Mr. Mohamed Rashed is strictly prohibited and subject to legal accountability.'
                : 'يُحظر تماماً تصوير أو نسخ أو إعادة نشر أو تداول المحتوى التعليمي تجارياً أو خارج نطاق طلاب مجموعات وسناتر الأستاذ محمد راشد دون إذن كتابي رسمي ومسبق.'
              }
            </p>
          </div>

          {/* 3. سياسة الحسابات والاستخدام الشخصي */}
          <div className="legal-section-block">
            <h3 className="legal-section-title">
              <span className="section-num">3</span>
              <span>{lang === 'en' ? 'Individual Student Account Policy' : 'سياسة الحساب الفردي والاشتراك'}</span>
            </h3>
            <ul className="legal-checklist">
              <li>
                <CheckCircle2 size={16} className="text-indigo-400 flex-shrink-0" />
                <div>
                  {lang === 'en'
                    ? 'Each account is strictly personal and non-transferable, designated solely for the enrolled student.'
                    : 'الحساب التعليمي مخصص ومقيد باسم الطالب الفردي، ولا يجوز إعارة الحساب أو مشاركة بيانات الدخول مع أي شخص آخر.'
                  }
                </div>
              </li>
              <li>
                <CheckCircle2 size={16} className="text-indigo-400 flex-shrink-0" />
                <div>
                  {lang === 'en'
                    ? 'The administration reserves the right to suspend any account that exhibits suspicious multi-user activity.'
                    : 'يحق لإدارة المنصة تعليق أو إلغاء تفعيل أي حساب يثبت تداوله بين عدة أجهزة أو مستخدمين خارج نطاق السنتر المسجل به الطالب.'
                  }
                </div>
              </li>
            </ul>
          </div>

          {/* 4. المعيار الأكاديمي الصارم (نسبة 90%) */}
          <div className="legal-section-block">
            <h3 className="legal-section-title">
              <span className="section-num">4</span>
              <span>{lang === 'en' ? 'Academic Mastery Standard (90% Threshold)' : 'معيار الاجتياز التربوي (شرط 90% للإتقان)'}</span>
            </h3>
            <p className="legal-paragraph">
              {lang === 'en'
                ? 'To guarantee excellence in the final Baccalaureate and National Examinations, Mr. Mohamed Rashed has established a mandatory 90% mastery threshold. If a student scores below 90%, they must review the core concepts before advancing, ensuring solid memory consolidation.'
                : 'لضمان تفوق الطالب في امتحانات شهادة الثانوية العامة والبكالوريا، اعتمد الأستاذ محمد راشد معيار إتقان صارم بنسبة 90% على الأقل لتخطي كل محطة. عند الحصول على أقل من 90%، يلتزم الطالب بالعودة لمراجعة الشرح مع المعلم الذكي وتثبيت المفاهيم.'
              }
            </p>
          </div>

          {/* 5. الالتزام بالسلوك الأخلاقي */}
          <div className="legal-section-block">
            <h3 className="legal-section-title">
              <span className="section-num">5</span>
              <span>{lang === 'en' ? 'Digital Code of Conduct & Ethics' : 'ميثاق السلوك الأخلاقي والتقني'}</span>
            </h3>
            <p className="legal-paragraph">
              {lang === 'en'
                ? 'Students are expected to adhere to high moral standards in interactions, homework submissions, and AI ethics principles covered throughout Chapter 1.'
                : 'يلتزم جميع الطلاب بالآداب العامة، واستخدام تقنيات الذكاء الاصطناعي بشكل أخلاقي وبنّاء وفقاً للمبادئ الواردة في منهج الوزارة، والامتناع عن أي محاولات تلاعب بالنتائج أو النجوم.'
              }
            </p>
          </div>

          {/* 6. التحديثات والتواصل الرسمي */}
          <div className="legal-section-block">
            <h3 className="legal-section-title">
              <span className="section-num">6</span>
              <span>{lang === 'en' ? 'Official Inquiries & Direct Line' : 'قنوات التواصل والاستفسارات الرسمية'}</span>
            </h3>
            <p className="legal-paragraph">
              {lang === 'en'
                ? 'For any clarifications, center enrollment inquiries, or academic support, students and guardians can communicate directly with Mr. Mohamed Rashed:'
                : 'لأي استفسارات بخصوص الاشتراك في السناتر أو المجموعات أو الدعم الأكاديمي المباشر، يمكنكم التواصل مع الأستاذ محمد راشد عبر القنوات المعتمدة:'
              }
            </p>

            <div className="teacher-direct-contact-card">
              <div className="contact-col">
                <span className="contact-label">{lang === 'en' ? 'Phone & WhatsApp Hotline' : 'رقم الهاتف المباشر والواتساب'}</span>
                <a href="tel:01005144500" className="contact-value-link">
                  <Phone size={16} className="text-emerald-400" />
                  <span className="font-mono text-base font-bold">01005144500</span>
                </a>
              </div>
              <div className="contact-col">
                <span className="contact-label">{lang === 'en' ? 'Official Teacher Email' : 'البريد الإلكتروني للأستاذ'}</span>
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
            <span>{lang === 'en' ? 'I Accept the Terms of Use' : 'أوافق وألتزم بشروط الاستخدام'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
