"use client";

import { useEffect, useState } from "react";

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
        }, 2000);
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
        <div className="w-full max-w-lg rounded-xl bg-[#0054a6] text-white shadow-xl border border-white/20">
          <div className="px-6 py-4 border-b border-white/20 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Зворотний зв&apos;язок</h3>
            <button
              type="button"
              onClick={onClose}
              className="h-8 px-3 rounded-md bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              Закрити
            </button>
          </div>
          
          {submitStatus === 'success' ? (
            <div className="px-6 py-8 text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Ваше повідомлення надіслано.</h4>
              <p className="text-white/80">Ми з Вами зв&apos;яжемось найближчим часом.</p>
            </div>
          ) : (
            <form className="px-6 py-5 grid gap-4" onSubmit={handleSubmit}>
              <div className="grid gap-1">
                <label htmlFor="name" className="text-sm font-medium text-white">
                  Ім&apos;я <span className="text-red-300">*</span>
                </label>
                <input 
                  id="name" 
                  name="name" 
                  value={formData.name}
                  onChange={handleInputChange}
                  required 
                  className="h-11 rounded-md border border-white/20 bg-white/10 px-3 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent" 
                  placeholder="Введіть ваше ім'я"
                />
              </div>
              
              <div className="grid gap-1">
                <label htmlFor="phone" className="text-sm font-medium text-white">
                  Телефон <span className="text-red-300">*</span>
                </label>
                <input 
                  id="phone" 
                  name="phone" 
                  value={formData.phone}
                  onChange={handleInputChange}
                  required 
                  type="tel"
                  className="h-11 rounded-md border border-white/20 bg-white/10 px-3 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent" 
                  placeholder="+38 (0XX) XXX-XX-XX"
                />
              </div>
              
              <div className="grid gap-1">
                <label htmlFor="email" className="text-sm font-medium text-white">
                  Email
                </label>
                <input 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  type="email" 
                  className="h-11 rounded-md border border-white/20 bg-white/10 px-3 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent" 
                  placeholder="your@email.com"
                />
              </div>
              
              <div className="grid gap-1">
                <label htmlFor="message" className="text-sm font-medium text-white">
                  Повідомлення
                </label>
                <textarea 
                  id="message" 
                  name="message" 
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4} 
                  className="rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent resize-none" 
                  placeholder="Опишіть ваше питання або пропозицію..."
                />
              </div>

              {submitStatus === 'error' && (
                <div className="p-3 bg-red-500/20 border border-red-400/30 rounded-md">
                  <p className="text-sm text-red-200">{errorMessage}</p>
                </div>
              )}
              
              <div className="pt-2 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="h-11 px-5 rounded-md border border-white/20 hover:bg-white/10 transition-colors text-white"
                  disabled={isSubmitting}
                >
                  Скасувати
                </button>
                <button 
                  type="submit" 
                  className="h-11 px-5 rounded-md bg-white/10 text-white hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Надсилання...
                    </>
                  ) : (
                    'Надіслати'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}





