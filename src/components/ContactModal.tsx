"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/providers/I18nProvider";

type Props = {
  open: boolean;
  onClose: () => void;
};

interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  message: string;
}

export default function ContactModal({ open, onClose }: Props) {
  const { t } = useI18n();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      setFormData({ name: '', phone: '', email: '', message: '' });
      setSubmitStatus('idle');
      setErrorMessage('');
    }
  }, [open]);

  if (!open) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Phone mask: +38 (___) ___-__-__
  const formatUaPhone = (raw: string) => {
    const digits = raw.replace(/\D/g, '');
    let d = digits;
    // Ensure country code 38
    if (d.startsWith('380')) {
      d = '38' + d.slice(2); // keep 38 + next 10
    } else if (d.startsWith('38')) {
      // ok
    } else if (d.startsWith('0')) {
      d = '38' + d; // prepend country code
    } else if (d.length && !d.startsWith('38')) {
      d = '38' + d; // prepend
    }
    d = d.slice(0, 12); // 38 + 10 digits
    const cc = '+38';
    const a = d.slice(2, 5);
    const b = d.slice(5, 8);
    const c = d.slice(8, 10);
    const e2 = d.slice(10, 12);
    let out = cc + ' ';
    out += '(' + a.padEnd(3, '_') + ') ';
    out += b.padEnd(3, '_');
    out += '-' + c.padEnd(2, '_');
    out += '-' + e2.padEnd(2, '_');
    return out;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = formatUaPhone(e.target.value);
    setFormData(prev => ({ ...prev, phone: masked }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setTimeout(() => {
          onClose();
        }, 5000);
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.error || 'Помилка відправки повідомлення');
      }
    } catch {
      setSubmitStatus('error');
      setErrorMessage('Помилка відправки повідомлення');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-xl rounded-2xl bg-[#008e4ed3] text-white shadow-[0_20px_60px_rgba(0,142,78,0.3)] border border-white/20 backdrop-blur-md">
          <div className="px-8 pt-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-white text-center w-full drop-shadow">{t('contact.modal.title')}</h3>
              <button
                type="button"
                onClick={onClose}
                className="ml-auto h-9 px-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
              >
                {t('contact.modal.close')}
              </button>
            </div>
            <p className="mt-2 text-center text-sm text-[#E6F7EF]">{t('contact.modal.lead')}</p>
          </div>

          {submitStatus === 'success' ? (
            <div className="px-8 py-10 text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">{t('contact.modal.sent')}</h4>
              <p className="text-white/80">{t('contact.modal.soon')}</p>
            </div>
          ) : (
            <form className="px-8 py-6 grid gap-4" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-semibold text-white uppercase tracking-wide">
                  {t('contact.modal.name')} <span className="text-[#FFD700]">*</span>
                </label>
                <input 
                  id="name" 
                  name="name" 
                  value={formData.name}
                  onChange={handleInputChange}
                  required 
                  className="h-12 rounded-xl border-0 bg-white px-4 text-[#2d3748] placeholder:text-[#a0aec0] shadow-md focus:outline-none focus:ring-2 focus:ring-[#008E4E]/40" 
                  placeholder={t('contact.modal.name.placeholder')}
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="phone" className="text-sm font-semibold text-white uppercase tracking-wide">
                  {t('contact.modal.phone')} <span className="text-[#FFD700]">*</span>
                </label>
                <input 
                  id="phone" 
                  name="phone" 
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  required 
                  type="tel"
                  className="h-12 rounded-xl border-0 bg-white px-4 text-[#2d3748] placeholder:text-[#a0aec0] shadow-md focus:outline-none focus:ring-2 focus:ring-[#008E4E]/40" 
                  placeholder="+995 ___ ___ ___"
                  inputMode="tel"
                  autoComplete="tel"
                  pattern="^\+38 \(\d{3}\) \d{3}-\d{2}-\d{2}$"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-semibold text-white uppercase tracking-wide">
                  {t('contact.modal.email')}
                </label>
                <input 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  type="email" 
                  className="h-12 rounded-xl border-0 bg-white px-4 text-[#2d3748] placeholder:text-[#a0aec0] shadow-md focus:outline-none focus:ring-2 focus:ring-[#008E4E]/40"
                  placeholder="your@email.com"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="message" className="text-sm font-semibold text-white uppercase tracking-wide">
                  {t('contact.modal.message')}
                </label>
                <textarea 
                  id="message" 
                  name="message" 
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4} 
                  className="rounded-xl border-0 bg-white px-4 py-3 text-[#2d3748] placeholder:text-[#a0aec0] shadow-md focus:outline-none focus:ring-2 focus:ring-[#008E4E]/40 resize-y min-h-[120px] max-h-[250px]" 
                  placeholder={t('contact.modal.message.placeholder')}
                />
              </div>

              {submitStatus === 'error' && (
                <div className="p-3 bg-[#FFD700]/20 border border-[#FFD700]/40 rounded-xl">
                  <p className="text-sm text-white">{errorMessage}</p>
                </div>
              )}
              
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button 
                  type="submit" 
                  className="flex-1 h-12 px-5 rounded-xl bg-[#FFD700] text-[#2d3748] font-semibold shadow-md hover:bg-[#FFED4E] hover:shadow-lg transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('contact.modal.sending')}
                    </>
                  ) : (
                    t('contact.modal.send')
                  )}
                </button>
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="flex-1 h-12 px-5 rounded-xl bg-white text-[#008E4E] font-semibold shadow-md hover:bg-[#F7FAFC] hover:shadow-lg transition"
                  disabled={isSubmitting}
                >
                  {t('contact.modal.cancel')}
                </button>
              </div>
              <p className="mt-2 text-center text-xs text-[#E6F7EF] italic">{t('contact.modal.required')}</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}





