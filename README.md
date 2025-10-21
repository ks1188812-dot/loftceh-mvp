
# LOFT ЦЕХ — MVP (Next.js + Prisma + Telegraf)

## Быстрый старт (Netlify + Supabase)
1) Создай проект в Supabase → получи DATABASE_URL, создай bucket `loft-uploads`.
2) Добавь переменные окружения на Netlify (из `.env.example`).
3) Deploy на Netlify — получишь домен `*.netlify.app`.
4) Пропиши webhook:
   https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook?url=https://<your-site-name>.netlify.app/api/telegram
5) Проверь: https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/getWebhookInfo
6) Открой сайт → пройди мастер → заявка должна прилететь в TG-чат админа.

## Prisma
- `npm run prisma:migrate` — локально (или через Prisma Studio).
- `npx prisma studio` — управлять данными.
- Добавь модели в таблицу ProductModel (или используй fallback-демо в интерфейсе).

## Что где
- `src/app/page.tsx` — мастер выбора (категории → модели → фото → контакты).
- `src/app/api/upload/route.ts` — загрузка фото в Supabase Storage.
- `src/app/api/lead/route.ts` — создание лида + уведомление админу в TG + deep link в бота.
- `src/app/api/telegram/route.ts` — webhook бота, /start с привязкой `lead_<id>` и простое меню.

## Важно
- После смены домена обязательно повтори setWebhook с новым URL.
- Храни секреты только в переменных окружения.
