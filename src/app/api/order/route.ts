import { NextResponse } from 'next/server';

// NOTE: У продакшені збережіть у ENV
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8335053620:AAH7nD2cVB5wH2WkH7wSDTdBynIEZSTFP60';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '442457024';

type DeliveryOption = 'Нова Пошта' | 'САТ' | 'Делівері' | 'Самовивіз';

interface OrderItem {
  id: number;
  product_name: string;
  model: string;
  size: string;
  regular_price: number;
  quantity: number;
}

interface BaseOrder {
  type: 'quick' | 'full';
  firstName: string;
  phone: string;
  items?: OrderItem[];
  total?: number;
}

interface FullOrder extends BaseOrder {
  type: 'full';
  lastName: string;
  email?: string;
  region: string;
  city: string;
  delivery: DeliveryOption[];
  carrierWarehouse?: string;
  message?: string;
}

type QuickOrder = BaseOrder & { type: 'quick' };

type OrderPayload = QuickOrder | FullOrder;

function isOrderItem(x: unknown): x is OrderItem {
  if (typeof x !== 'object' || x === null) return false;
  const it = x as Record<string, unknown>;
  return typeof it.id === 'number'
    && typeof it.product_name === 'string'
    && typeof it.model === 'string'
    && typeof it.size === 'string'
    && typeof it.regular_price === 'number'
    && typeof it.quantity === 'number';
}

function isOrderPayload(x: unknown): x is OrderPayload {
  if (typeof x !== 'object' || x === null) return false;
  const o = x as Record<string, unknown>;
  if (o.type !== 'quick' && o.type !== 'full') return false;
  if (typeof o.firstName !== 'string' || typeof o.phone !== 'string') return false;
  if (o.items && (!Array.isArray(o.items) || !o.items.every(isOrderItem))) return false;
  if (o.total && typeof o.total !== 'number') return false;
  if (o.type === 'full') {
    // required for full
    if (typeof o.lastName !== 'string') return false;
    if (typeof o.region !== 'string' || typeof o.city !== 'string') return false;
    if (!Array.isArray(o.delivery)) return false;
  }
  return true;
}

function formatMessage(payload: OrderPayload): string {
  const {
    firstName,
    lastName,
    email,
    phone,
    region,
    city,
    delivery,
    carrierWarehouse,
    message,
    items,
    total
  } = payload as FullOrder;

  const lines: string[] = [];
  lines.push(`🧾 НОВЕ ЗАМОВЛЕННЯ (${payload.type === 'quick' ? 'Швидке' : 'Повне'})`);
  lines.push(`👤 ${firstName}${lastName ? ' ' + lastName : ''}`.trim());
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
      lines.push(`• ${it.product_name} (${it.model} / ${it.size}) x${it.quantity} — ${it.regular_price} ₾`);
    }
  }
  if (total) lines.push(`\n💰 Разом: ${total} ₾`);
  return lines.join('\n');
}

export async function POST(req: Request) {
  try {
    const raw: unknown = await req.json();

    if (!isOrderPayload(raw)) {
      return NextResponse.json({ error: 'Некоректні дані замовлення' }, { status: 400 });
    }

    const data = raw as OrderPayload;

    // Мінімальна валідація
    if (!data.firstName.trim() || !data.phone.trim()) {
      return NextResponse.json({ error: 'Ім’я та телефон обов’язкові' }, { status: 400 });
    }
    if (data.type === 'full') {
      const full = data as FullOrder;
      if (!full.lastName.trim() || !full.region.trim() || !full.city.trim() || !full.delivery?.length) {
        return NextResponse.json({ error: 'Заповніть обовʼязкові поля' }, { status: 400 });
      }
    }

    const text = formatMessage(data);
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    const tgResp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text })
    });

    const ok = tgResp.ok;
    if (!ok) {
      const details = await tgResp.text();
      return NextResponse.json({ error: 'Помилка надсилання в Telegram', details }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown';
    return NextResponse.json({ error: 'Невідома помилка', details: msg }, { status: 500 });
  }
}
