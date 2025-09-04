import { NextResponse } from 'next/server';

// NOTE: У продакшені збережіть у ENV
const TELEGRAM_BOT_TOKEN = '8335053620:AAH7nD2cVB5wH2WkH7wSDTdBynIEZSTFP60';
const TELEGRAM_CHAT_ID = '442457024';

function formatMessage(payload: any): string {
  const {
    type, // 'quick' | 'full'
    firstName,
    lastName,
    email,
    phone,
    region,
    city,
    delivery, // ['Нова Пошта','САТ','Делівері','Самовивіз']
    carrierWarehouse,
    message,
    items,
    total
  } = payload;

  const lines: string[] = [];
  lines.push(`🧾 НОВЕ ЗАМОВЛЕННЯ (${type === 'quick' ? 'Швидке' : 'Повне'})`);
  lines.push(`👤 ${firstName || ''} ${lastName || ''}`.trim());
  if (phone) lines.push(`📞 ${phone}`);
  if (email) lines.push(`✉️ ${email}`);
  if (region) lines.push(`🌍 Область: ${region}`);
  if (city) lines.push(`🏙️ Місто/НП: ${city}`);
  if (delivery && delivery.length) lines.push(`🚚 Доставка: ${delivery.join(', ')}`);
  if (carrierWarehouse) lines.push(`🏬 Склад перевізника: ${carrierWarehouse}`);
  if (message) lines.push(`📝 Повідомлення: ${message}`);
  if (Array.isArray(items) && items.length) {
    lines.push(`\n📦 Товари:`);
    for (const it of items) {
      lines.push(`• ${it.product_name} (${it.model} / ${it.size}) x${it.quantity} — ${it.regular_price} грн`);
    }
  }
  if (total) lines.push(`\n💰 Разом: ${total} грн`);
  return lines.join('\n');
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Валідація
    const isQuick = data?.type === 'quick';
    if (!data?.firstName || !data?.phone) {
      return NextResponse.json({ error: 'Ім’я та телефон обов’язкові' }, { status: 400 });
    }
    if (!isQuick) {
      const required = ['lastName', 'region', 'city', 'delivery'];
      for (const k of required) {
        if (!data?.[k] || (k === 'delivery' && !Array.isArray(data.delivery))) {
          return NextResponse.json({ error: `Поле ${k} обов’язкове` }, { status: 400 });
        }
      }
    }

    const text = formatMessage(data);
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    const tg = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text })
    });

    const tgResp = await tg.json();
    if (!tg.ok) {
      return NextResponse.json({ error: 'Помилка надсилання в Telegram', details: tgResp }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: 'Невідома помилка', details: e?.message }, { status: 500 });
  }
}
