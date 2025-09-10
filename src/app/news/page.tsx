"use client";

import { Clock, BookOpen, Lightbulb, TrendingUp, Wrench, Shield } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

function ComingSoonCard({ icon: Icon, title, description }: { icon: React.ComponentType<{ className?: string }>; title: string; description: string }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-black/20 p-6 hover:shadow-lg transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-[#008e4ed3]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative text-center">
        <div className="w-16 h-16 bg-[#008e4ed3] rounded-full flex items-center justify-center mx-auto mb-4 text-white group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <p className="text-foreground/80 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default function NewsPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Будь ласка, введіть email');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        setShowSuccess(true);
        setEmail('');
        // Hide success message after 5 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
      } else {
        setError(result.error || 'Помилка підписки');
      }
    } catch {
      setError('Помилка підписки');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#008e4ed3]/10 via-transparent to-[#008e4ed3]/5" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-[#008e4ed3] to-[#008E4E] bg-clip-text text-transparent">
              Новини та статті
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-foreground/80 leading-relaxed">
              Ваше надійне джерело знань про все, що стосується сільськогосподарських шин
            </p>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-[#008e4ed3]/10 text-[#008e4ed3] px-6 py-3 rounded-full text-sm font-medium mb-6">
            <Clock className="w-5 h-5" />
            Сторінка в розробці
          </div>
          <h2 className="text-3xl font-bold mb-6">Скоро тут з&apos;являться цікаві матеріали</h2>
          <p className="text-lg text-foreground/80 leading-relaxed max-w-4xl mx-auto">
            Ми готуємо для вас корисний контент, який допоможе аграріям та всім, хто працює на землі, 
            зробити правильний вибір та максимально ефективно використовувати сільськогосподарські шини.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <ComingSoonCard
            icon={TrendingUp}
            title="Огляди новинок"
            description="Перші огляди нових моделей сільськогосподарських шин, технічні характеристики та порівняння з аналогами."
          />
          <ComingSoonCard
            icon={BookOpen}
            title="Поради з вибору"
            description="Детальні гіди з вибору шин для різних типів техніки, умов експлуатації та специфіки роботи."
          />
          <ComingSoonCard
            icon={Wrench}
            title="Експлуатація"
            description="Практичні поради з правильного використання, догляду та обслуговування сільськогосподарських шин."
          />
          <ComingSoonCard
            icon={Lightbulb}
            title="Корисні лайфхаки"
            description="Секрети та хитрощі, як заощадити кошти та продовжити термін служби ваших шин."
          />
          <ComingSoonCard
            icon={Shield}
            title="Безпека та надійність"
            description="Важливі аспекти безпеки при роботі з с/г технікою та як правильно оцінити стан шин."
          />
          <ComingSoonCard
            icon={BookOpen}
            title="Технічні статті"
            description="Глибокі матеріали про технології виробництва, матеріали та інновації в галузі с/г шин."
          />
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-br from-[#008e4ed3]/10 to-[#008E4E]/5 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Завітайте трохи пізніше!</h3>
          <p className="text-lg text-foreground/80 mb-6 max-w-2xl mx-auto">
            Ми працюємо над створенням якісного контенту, який стане вашим надійним помічником 
            у виборі та експлуатації сільськогосподарських шин.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/products" 
              className="inline-flex items-center justify-center px-6 py-3 bg-[#008E4E] text-white rounded-lg hover:bg-[#007A42] transition-colors font-medium"
            >
              Перейти в магазин
            </Link>
            <Link 
              href="/contacts" 
              className="inline-flex items-center justify-center px-6 py-3 border border-[#008E4E] text-[#008E4E] rounded-lg hover:bg-[#008E4E] hover:text-white transition-colors font-medium"
            >
              Зв&apos;язатися з нами
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white dark:bg-black/20 rounded-2xl border border-black/10 dark:border-white/10 p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Будьте в курсі новин</h3>
          <p className="text-foreground/80 mb-6 max-w-2xl mx-auto">
            Підпишіться на наші оновлення, щоб першими дізнаватися про нові статті, 
            поради та корисні матеріали про сільськогосподарські шини.
          </p>
          
          {showSuccess ? (
            <div className="max-w-md mx-auto">
              <div className="bg-[#008E4E]/10 border border-[#008E4E]/20 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center gap-2 text-[#008E4E]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">Дякуємо, що підписались на наші новини!</span>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="email" 
                  placeholder="Ваш email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#008E4E] focus:border-transparent"
                  required
                />
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-[#008E4E] text-white rounded-lg hover:bg-[#007A42] transition-colors font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Підписка...
                    </>
                  ) : (
                    'Підписатися'
                  )}
                </button>
              </div>
              {error && (
                <p className="text-red-600 text-sm mt-2">{error}</p>
              )}
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
