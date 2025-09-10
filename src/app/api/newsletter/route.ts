import { NextRequest, NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = '8335053620:AAH7nD2cVB5wH2WkH7wSDTdBynIEZSTFP60';
const TELEGRAM_CHAT_ID = '442457024';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Send message to Telegram bot
    const telegramMessage = `📧 Нова підписка на новини!\n\nEmail: ${email}\n\nКористувач бажає отримувати розсилку з новинами про сільськогосподарські шини CEAT.`;
    
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const telegramResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: telegramMessage,
        parse_mode: 'HTML'
      }),
    });

    if (!telegramResponse.ok) {
      console.error('Failed to send Telegram message:', await telegramResponse.text());
      return NextResponse.json(
        { error: 'Failed to process subscription' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Successfully subscribed to newsletter' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
