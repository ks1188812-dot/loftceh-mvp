
import { NextRequest } from "next/server";
import { bot, clientMenu } from "@/lib/telegram";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

bot.start(async (ctx) => {
  const payload = (ctx.startPayload || "").trim();
  if (payload.startsWith("lead_")) {
    const id = payload.replace("lead_", "");
    await prisma.lead.update({ where: { id }, data: { telegramUserId: String(ctx.chat.id), telegramUsername: ctx.from?.username || null } });
    await ctx.reply("Заявка связана ✅. Мы на связи здесь!", clientMenu());
  } else {
    await ctx.reply("Здравствуйте! Отправьте фото комнаты или оставьте заявку на сайте.", clientMenu());
  }
});

bot.hears("Каталог", async (ctx) => {
  await ctx.reply("Открыть каталог: " + (process.env.NEXTAUTH_URL || "https://example.com"));
});
bot.hears("Отзывы", async (ctx) => {
  await ctx.reply("Канал с отзывами: " + (process.env.NEXT_PUBLIC_REVIEWS_URL || "https://t.me/loftceh_reviews"));
});
bot.hears("Открыть сайт", async (ctx) => {
  await ctx.reply("Открыть сайт: " + (process.env.NEXTAUTH_URL || "https://example.com"));
});

export async function POST(req: NextRequest) {
  const update = await req.json();
  await bot.handleUpdate(update);
  return new Response("ok");
}
