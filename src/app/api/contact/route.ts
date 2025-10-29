import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// NOTE: У продакшені збережіть у ENV
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8335053620:AAH7nD2cVB5wH2WkH7wSDTdBynIEZSTFP60';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '442457024';

interface ContactFormData {
  name: string;
  phone: string;
  email?: string;
  message?: string;
}

function isContactFormData(x: unknown): x is ContactFormData {
  if (typeof x !== 'object' || x === null) return false;
  const data = x as Record<string, unknown>;
  
  return typeof data.name === 'string' 
    && typeof data.phone === 'string'
    && (data.email === undefined || typeof data.email === 'string')
    && (data.message === undefined || typeof data.message === 'string');
}

function formatContactMessage(data: ContactFormData): string {
  const lines: string[] = [];
  
  lines.push(`📞 НОВЕ ПОВІДОМЛЕННЯ ЗВОРОТНОГО ЗВ'ЯЗКУ`);
  lines.push(`👤 Ім'я: ${data.name}`);
  lines.push(`📱 Телефон: ${data.phone}`);
  
  if (data.email) {
    lines.push(`✉️ Email: ${data.email}`);
  }
  
  if (data.message) {
    lines.push(`\n📝 Повідомлення:`);
    lines.push(`${data.message}`);
  }
  
  lines.push(`\n🕐 Час: ${new Date().toLocaleString('uk-UA', { 
    timeZone: 'Europe/Kiev',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })}`);
  
  return lines.join('\n');
}

export async function POST(req: Request) {
  try {
    const langCookie = (await cookies()).get('lang')?.value;
    const lang = langCookie === 'ka' ? 'ka' : 'ru';
    const t = (key: string) => {
      const ru: Record<string, string> = {
        invalid: 'Некорректные данные формы',
        required: 'Имя и телефон обязательны',
        email: 'Некорректный формат email',
        phone: 'Некорректный формат телефона',
        tg: 'Ошибка отправки в Telegram',
        ok: 'Сообщение успешно отправлено',
      };
      const ka: Record<string, string> = {
        invalid: 'ფორმის მონაცემები არასწორია',
        required: 'სახელი და ტელეფონი სავალდებულოა',
        email: 'Email ფორმატი არასწორია',
        phone: 'ტელეფონის ფორმატი არასწორია',
        tg: 'Telegram-ზე გაგზავნის შეცდომა',
        ok: 'შეტყობინება წარმატებით გაიგზავნა',
      };
      return (lang === 'ka' ? ka : ru)[key];
    };
    const raw: unknown = await req.json();

    if (!isContactFormData(raw)) {
      return NextResponse.json({ error: t('invalid') }, { status: 400 });
    }

    const data = raw as ContactFormData;

    // Валідація обов'язкових полів
    if (!data.name.trim() || !data.phone.trim()) {
      return NextResponse.json({ error: t('required') }, { status: 400 });
    }

    // Валідація email якщо вказано
    if (data.email && data.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return NextResponse.json({ error: t('email') }, { status: 400 });
      }
    }

    // Валідація телефону (базова перевірка)
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
      return NextResponse.json({ error: t('phone') }, { status: 400 });
    }

    const message = formatContactMessage(data);
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    const tgResp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        chat_id: TELEGRAM_CHAT_ID, 
        text: message,
        parse_mode: 'HTML'
      })
    });

    const ok = tgResp.ok;
    if (!ok) {
      const details = await tgResp.text();
      console.error('Telegram API error:', details);
      return NextResponse.json({ error: t('tg'), details }, { status: 502 });
    }

    return NextResponse.json({ ok: true, message: t('ok') });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown';
    console.error('Contact API error:', msg);
    return NextResponse.json({ error: 'Невідома помилка', details: msg }, { status: 500 });
  }
}
