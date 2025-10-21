
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bot, buildLeadMessage } from "@/lib/telegram";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, phone, categories, modelSlugs, roomImageUrl, telegramUserId, telegramUsername } = body || {};
  if (!name || !phone || !roomImageUrl || !Array.isArray(categories)) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const models = await prisma.productModel.findMany({ where: { slug: { in: modelSlugs || [] } } });
  const lead = await prisma.lead.create({
    data: {
      customerName: name,
      phone,
      roomImageUrl,
      categories,
      telegramUserId,
      telegramUsername,
      models: { create: models.map((m) => ({ modelId: m.id })) },
    },
    include: { models: { include: { model: true } } },
  });

  const tgDeepLink = `https://t.me/${process.env.NEXT_PUBLIC_BOT_USERNAME || "your_bot" }?start=lead_${lead.id}`;

  // Notify admin chat
  try {
    const caption = buildLeadMessage(lead);
    await bot.telegram.sendPhoto(process.env.TELEGRAM_ADMIN_CHAT_ID!, lead.roomImageUrl, {
      caption,
      reply_markup: {
        inline_keyboard: [[
          { text: "Открыть в админке", url: `${process.env.NEXTAUTH_URL}/admin/leads/${lead.id}` },
        ]]
      }
    });
  } catch (e) {
    console.error("TG notify failed", e);
  }

  return NextResponse.json({ ok: true, leadId: lead.id, tgDeepLink });
}
