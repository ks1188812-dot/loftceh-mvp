// src/app/api/sendToTelegram/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'nodejs'; // нужен Node runtime для работы с FormData/внешним API

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const name = String(form.get('name') || '').trim();
    const phone = String(form.get('phone') || '').trim();
    const selections = String(form.get('selections') || '').trim();   // "bed-loft-a,desk-work-b"
    const categories = String(form.get('categories') || '').trim();   // "BEDS,DESKS"
    const photo = form.get('photo') as File | null;

    if (!name || !phone) {
      return NextResponse.json({ ok: false, error: 'Введите имя и телефон' }, { status: 400 });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN!;
    const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID!;
    if (!token || !chatId) {
      return NextResponse.json({ ok: false, error: 'No Telegram env' }, { status: 500 });
    }

    const caption =
      `🆕 Новая заявка\n` +
      `Имя: ${name}\n` +
      `Телефон: ${phone}\n` +
      (categories ? `Категории: ${categories}\n` : '') +
      (selections ? `Модели: ${selections}\n` : '');

    // 1) отправим текст
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: caption }),
    });

    // 2) если есть фото — отправим отдельным сообщением
    if (photo) {
      const tgForm = new FormData();
      tgForm.append('chat_id', chatId);
      tgForm.append('caption', 'Фото комнаты');
      tgForm.append('photo', photo, (photo as File).name || 'room.jpg');

      await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
        method: 'POST',
        body: tgForm,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('sendToTelegram error', e);
    return NextResponse.json({ ok: false, error: e?.message || 'server error' }, { status: 500 });
  }
}
